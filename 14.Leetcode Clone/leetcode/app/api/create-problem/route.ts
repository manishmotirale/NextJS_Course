import { prisma } from "@/lib/db";
import { runCode } from "@/lib/code-runner";
import { wrapCode, extractEntrypointName } from "@/lib/code-wrapper";
import { outputsMatch } from "@/lib/compare";
import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // --- 1. Auth ---
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({
      where: { clerkId: clerkUser.id },
      select: { id: true, role: true },
    });

    if (!dbUser) {
      return NextResponse.json(
        { error: "User not found. Please sign out and sign in again." },
        { status: 401 }
      );
    }

    if (dbUser.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Forbidden: Admin role required." },
        { status: 403 }
      );
    }

    // --- 2. Parse body ---
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const {
      problemId, // present => update an existing problem; absent => create new
      title,
      description,
      difficulty,
      tags,
      examples,
      constraints,
      hints,
      editorial,
      testCases,
      codeSnippets,
      referenceSolutions,
      skipValidation,
    } = body;

    if (!title || !description || !difficulty || !constraints) {
      return NextResponse.json(
        { error: "Missing required fields: title, description, difficulty, constraints" },
        { status: 400 }
      );
    }

    if (!testCases || !Array.isArray(testCases) || testCases.length === 0) {
      return NextResponse.json(
        { error: "At least one test case is required" },
        { status: 400 }
      );
    }

    if (!codeSnippets || !referenceSolutions) {
      return NextResponse.json(
        { error: "Code snippets and reference solutions are required" },
        { status: 400 }
      );
    }

    // --- 3. Validate via free code runner (optional) ---
    if (!skipValidation) {
      try {
        for (const [language, solutionCode] of Object.entries(referenceSolutions)) {
          if (!solutionCode || String(solutionCode).trim() === "") continue;

          // Determine the entry function from the starter snippet (more reliable
          // than auto-detection when a solution defines helper functions).
          let entrypoint: string | undefined;
          try {
            const snippet = (codeSnippets as Record<string, string>)?.[language];
            if (snippet) {
              const ep = extractEntrypointName(language, snippet);
              if (ep) entrypoint = ep;
            }
          } catch {
            /* fall back to auto-detection inside wrapCode */
          }

          for (let i = 0; i < testCases.length; i++) {
            const tc = testCases[i];
            const wrappedCode = wrapCode(language, String(solutionCode), entrypoint);
            const result = await runCode(language, wrappedCode, tc.input);

            if (!result.success) {
              return NextResponse.json(
                {
                  error: `[${language}] Reference solution failed on test case #${i + 1}`,
                  detail: result.error,
                },
                { status: 400 }
              );
            }

            const actual = result.output.trim();
            const expected = String(tc.output).trim();

            if (!outputsMatch(actual, expected)) {
              return NextResponse.json(
                {
                  error: `[${language}] Wrong output on test case #${i + 1}`,
                  detail: `Expected: "${expected}" | Got: "${actual}"`,
                },
                { status: 400 }
              );
            }
          }
        }
      } catch (valErr: any) {
        console.error("[create-problem] Validation service error:", valErr?.message);
        return NextResponse.json(
          {
            error:
              'Validation service is unreachable. Toggle "Skip Validation" at the top of the form and try again.',
          },
          { status: 502 }
        );
      }
    }

    // --- 4. Save to DB (update when problemId is present, otherwise create) ---
    const data = {
      title: String(title),
      description: String(description),
      difficulty,
      tags: Array.isArray(tags) ? tags : [],
      examples: examples ?? {},
      constraints: String(constraints),
      hints: hints ? String(hints) : null,
      editorial: editorial ? String(editorial) : null,
      testCases,
      codeSnippets,
      referenceSolution: referenceSolutions,
    };

    if (problemId) {
      const existing = await prisma.problem.findUnique({
        where: { id: String(problemId) },
        select: { id: true },
      });
      if (!existing) {
        return NextResponse.json(
          { success: false, error: "Problem not found." },
          { status: 404 }
        );
      }

      const problem = await prisma.problem.update({
        where: { id: String(problemId) },
        data,
      });

      return NextResponse.json(
        { success: true, message: "Problem updated successfully", data: problem, updated: true },
        { status: 200 }
      );
    }

    const problem = await prisma.problem.create({
      data: { ...data, userId: dbUser.id },
    });

    return NextResponse.json(
      { success: true, message: "Problem created successfully", data: problem },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("[create-problem] Unhandled error:", err);
    return NextResponse.json(
      { success: false, error: err?.message ?? "Internal server error" },
      { status: 500 }
    );
  }
}
