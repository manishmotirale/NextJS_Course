import { prisma } from "@/lib/db";
import { wrapCode } from "@/lib/code-wrapper";
import {
  submitBatch,
  pollBatchResults,
  getJudge0languageId,
  getLanguageName,
} from "@/lib/judge0";
import { runCode } from "@/lib/code-runner";
import { outputsMatch } from "@/lib/compare";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

function estimateMemoryKB(code: string): number {
  return Math.round((120 + code.length * 0.05) * 10) / 10;
}

/**
 * Flexible output comparison. Delegates to the shared judge in lib/compare,
 * which handles whitespace, JSON structure, booleans, and order-insensitive
 * list-of-lists answers (e.g. 3Sum triplets).
 */
function compareOutput(actual: string, expected: string): boolean {
  return outputsMatch(actual, expected);
}

/**
 * Normalise test-case stdin before sending to execution engines.
 *
 * Multi-line named args like:
 *   "nums = [3,3]\ntarget = 6"
 * → collapsed to single line:
 *   "nums = [3,3] target = 6"
 */
function normalizeStdin(raw: string): string {
  const s = raw.trim();
  if (!s) return s;

  const lines = s.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
  if (lines.length > 1 && lines.every((l) => /^\w+\s*=\s*.+/.test(l))) {
    return lines.join(" ");
  }
  return s;
}

async function runViaJudge0(
  wrappedCode: string,
  language: string,
  testCases: any[]
): Promise<any[] | null> {
  const apiKey =
    process.env.RAPIDAPI_KEY || process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "";
  if (!apiKey) return null; // No key → skip Judge0

  const langId = getJudge0languageId(language);

  const submissions = testCases.map((tc: any) => ({
    source_code: wrappedCode,
    language_id: langId,
    stdin: normalizeStdin(String(tc.input ?? "")),
    base64_encoded: false,
    wait: false,
  }));

  const batchResp = await submitBatch(submissions);
  const tokens = batchResp.map((r: any) => r.token);
  const j0Results = await pollBatchResults(tokens);

  return j0Results.map((r: any, i: number) => {
    const stdout      = (r.stdout ?? "").trim();
    const expected    = String(testCases[i].output ?? "").trim();
    const stderr      = (r.stderr ?? "").trim();
    const compileOut  = (r.compile_output ?? "").trim();
    const timeSec     = r.time   ? parseFloat(r.time)   : 0;
    const memoryKB    = r.memory ? parseFloat(r.memory) : estimateMemoryKB(wrappedCode);
    const passed      = compareOutput(stdout, expected);

    let status = "Wrong Answer";
    if (passed)          status = "Accepted";
    else if (compileOut) status = "Compilation Error";
    else if (stderr)     status = "Runtime Error";

    return {
      testCases:      i + 1,
      passed,
      stdin:          String(testCases[i].input),
      stdout,
      expected,
      stderr:         stderr    || null,
      compile_output: compileOut || null,
      status,
      memory:         `${memoryKB} KB`,
      time:           `${timeSec.toFixed(3)} s`,
    };
  });
}

async function runViaFallback(
  wrappedCode: string,
  language: string,
  testCases: any[]
): Promise<any[]> {
  const memKB = estimateMemoryKB(wrappedCode);
  const results = [];

  for (let i = 0; i < testCases.length; i++) {
    const stdin    = normalizeStdin(String(testCases[i].input ?? ""));
    const expected = String(testCases[i].output ?? "").trim();
    const start    = performance.now();

    try {
      const run     = await runCode(language, wrappedCode, stdin);
      const elapsed = (performance.now() - start) / 1000;
      const stdout  = run.success ? run.output.trim() : "";
      const passed  = compareOutput(stdout, expected);

      results.push({
        testCases:      i + 1,
        passed,
        stdin,
        stdout,
        expected,
        stderr:         run.success ? null : run.error,
        compile_output: null,
        status:         passed ? "Accepted" : (run.success ? "Wrong Answer" : "Runtime Error"),
        memory:         `${memKB} KB`,
        time:           `${elapsed.toFixed(3)} s`,
      });
    } catch (err: any) {
      const elapsed = (performance.now() - start) / 1000;
      results.push({
        testCases:      i + 1,
        passed:         false,
        stdin,
        stdout:         "",
        expected,
        stderr:         err?.message ?? "Execution service unavailable",
        compile_output: null,
        status:         "Runtime Error",
        memory:         `${memKB} KB`,
        time:           `${elapsed.toFixed(3)} s`,
      });
    }
  }

  return results;
}

export async function POST(req: NextRequest) {
  try {
    // --- Auth ---
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json(
        { success: false, error: "Not authenticated" },
        { status: 401 }
      );
    }

    const dbUser = await prisma.user.findUnique({
      where:  { clerkId: clerkUser.id },
      select: { id: true },
    });
    if (!dbUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 401 }
      );
    }

    // --- Parse body ---
    const body = await req.json();
    const { sourceCode, language, problemId, testCases, isSubmit } = body;

    if (
      !sourceCode ||
      !language   ||
      !problemId  ||
      !Array.isArray(testCases) ||
      testCases.length === 0
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // --- Fetch problem code snippets to find correct entrypoint ---
    let entrypointName: string | undefined;
    try {
      const problem = await prisma.problem.findUnique({
        where: { id: problemId },
        select: { codeSnippets: true },
      });
      if (problem && problem.codeSnippets) {
        const snippets = problem.codeSnippets as Record<string, string>;
        const langKey = language.toUpperCase() === "JS" ? "JAVASCRIPT" : language.toUpperCase();
        const snippet = snippets[langKey];
        if (snippet) {
          const { extractEntrypointName } = await import("@/lib/code-wrapper");
          const extracted = extractEntrypointName(language, snippet);
          if (extracted) {
            entrypointName = extracted;
          }
        }
      }
    } catch (e) {
      console.warn("[execute] Failed to extract entrypoint name from problem snippet:", e);
    }

    // --- Wrap code (LeetCode class → full stdin/stdout program) ---
    const wrappedCode = wrapCode(language, sourceCode, entrypointName);

    // --- Execute via local toolchain (g++/python/node) with online fallback ---
    // Judge0/RapidAPI is intentionally not used. runViaFallback delegates to
    // lib/code-runner, which runs code locally first and only falls back to
    // free public runners (Wandbox → Paiza → Piston) when needed.
    let results: any[] | null = null;

    // Judge0 kept behind an explicit opt-in flag; disabled by default.
    if (process.env.USE_JUDGE0 === "true") {
      try {
        results = await runViaJudge0(wrappedCode, language, testCases);
      } catch (j0Err: any) {
        console.warn("[execute] Judge0 failed:", j0Err?.message);
      }
    }

    if (!results) {
      results = await runViaFallback(wrappedCode, language, testCases);
    }

    const allPassed = results.every((r) => r.passed);

    // --- Only save submission record when explicitly submitting (not on "Run") ---
    let submission: any = null;
    if (isSubmit) {
      submission = await prisma.submission.create({
        data: {
          userId:        dbUser.id,
          problemId,
          sourceCode,                        // store original user code
          language:      getLanguageName(getJudge0languageId(language)),
          stdin:         testCases.map((tc: any) => tc.input).join("\n"),
          stdout:        JSON.stringify(results.map((r) => r.stdout)),
          stderr:        results.some((r) => r.stderr)
            ? JSON.stringify(results.map((r) => r.stderr))
            : null,
          compileOutput: results.some((r) => r.compile_output)
            ? JSON.stringify(results.map((r) => r.compile_output))
            : null,
          status:        allPassed ? "Accepted" : "Wrong Answer",
          memory:        JSON.stringify(results.map((r) => r.memory)),
          time:          JSON.stringify(results.map((r) => r.time)),
        },
      });

      await prisma.testCasesResult.createMany({
        data: results.map((r) => ({
          submissionId:  submission.id,
          testCase:      r.testCases,
          passed:        r.passed,
          stdout:        r.stdout,
          expected:      r.expected,
          stderr:        r.stderr        || null,
          compileOutput: r.compile_output|| null,
          status:        r.status,
          memory:        r.memory,
          time:          r.time,
        })),
      });

      // Mark as solved only on a passing submit
      if (allPassed) {
        await prisma.problemSolved.upsert({
          where:  { userId_problemId: { userId: dbUser.id, problemId } },
          update: {},
          create: { userId: dbUser.id, problemId },
        });
      }
    }

    const full = submission
      ? await prisma.submission.findUnique({
          where:   { id: submission.id },
          include: { testCasesResults: true },
        })
      : null;

    return NextResponse.json({
      success:    true,
      allPassed,
      status:     allPassed ? "Accepted" : "Wrong Answer",
      submission: { ...full, testCases: full?.testCasesResults ?? [] },
    });
  } catch (err: any) {
    console.error("[execute] Unhandled error:", err);
    return NextResponse.json(
      { success: false, error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
