"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { getLanguageName, pollBatchResults, submitBatch } from "@/lib/judge0";
import { getCurrentUserData } from "@/modules/auth/actions";

/**
 * Deletes a problem (admin only). Related submissions, solved records, and
 * playlist entries are removed automatically via the schema's onDelete: Cascade.
 */
export const deleteProblem = async (id: string) => {
  try {
    const user = await getCurrentUserData();
    if (!user || !("id" in user) || (user as any).role !== "ADMIN") {
      return { success: false, error: "Forbidden: Admin access required." };
    }

    const existing = await prisma.problem.findUnique({ where: { id } });
    if (!existing) {
      return { success: false, error: "Problem not found." };
    }

    await prisma.problem.delete({ where: { id } });

    revalidatePath("/problems");
    return { success: true };
  } catch (error) {
    console.error("Error deleting problem:", error);
    return { success: false, error: "Failed to delete problem" };
  }
};

export const getAllProblems = async () => {
  try {
    const user = await getCurrentUserData();
    // @ts-ignore
    const currentUserId = user?.id as string | undefined;

    const problems = await prisma.problem.findMany({
      include: {
        solvedBy: currentUserId
          ? { where: { userId: currentUserId } }
          : false,
      },
      orderBy: { createdAt: "desc" },
    });

    return { success: true, data: problems };
  } catch (error) {
    console.error("Error fetching problems:", error);
    return { success: false, error: "Failed to fetch problems" };
  }
};

export const getProblemById = async (id: string) => {
  try {
    const problem = await prisma.problem.findUnique({ where: { id } });
    return { success: true, data: problem };
  } catch (error) {
    console.error("Error fetching problem:", error);
    return { success: false, error: "Failed to fetch problem" };
  }
};

/**
 * Real platform-wide stats for the landing page (replaces hardcoded numbers).
 * Returns total problems, developers, solved count, and accepted-run rate.
 */
export const getPlatformStats = async () => {
  try {
    const [problemCount, userCount, solvedCount, totalSubs, acceptedSubs] =
      await Promise.all([
        prisma.problem.count(),
        prisma.user.count(),
        prisma.problemSolved.count(),
        prisma.submission.count(),
        prisma.submission.count({ where: { status: "Accepted" } }),
      ]);

    const successRate =
      totalSubs > 0 ? Math.round((acceptedSubs / totalSubs) * 100) : 0;

    return {
      success: true,
      data: {
        problemCount,
        userCount,
        solvedCount,
        languages: 3, // JavaScript, Python, C++
        successRate,
      },
    };
  } catch (error) {
    console.error("Error fetching platform stats:", error);
    return {
      success: false,
      data: {
        problemCount: 0,
        userCount: 0,
        solvedCount: 0,
        languages: 3,
        successRate: 0,
      },
    };
  }
};

/** Returns the total number of problems per difficulty: { EASY, MEDIUM, HARD }. */
export const getProblemDifficultyCounts = async () => {
  try {
    const grouped = await prisma.problem.groupBy({
      by: ["difficulty"],
      _count: { _all: true },
    });

    const counts: Record<string, number> = { EASY: 0, MEDIUM: 0, HARD: 0 };
    for (const g of grouped) {
      counts[g.difficulty] = g._count._all;
    }
    return { success: true, data: counts };
  } catch (error) {
    console.error("Error counting problems by difficulty:", error);
    return { success: false, data: { EASY: 0, MEDIUM: 0, HARD: 0 } };
  }
};

/**
 * Deterministic "Problem of the Day": every user sees the same problem on a
 * given calendar day, and it rotates daily. Picks by day-index modulo count
 * over a stable ordering (by createdAt), so it is stable within a day.
 */
export const getProblemOfTheDay = async () => {
  try {
    const problems = await prisma.problem.findMany({
      select: {
        id: true,
        title: true,
        difficulty: true,
        tags: true,
        description: true,
        createdAt: true,
      },
      orderBy: { createdAt: "asc" },
    });

    if (problems.length === 0) {
      return { success: true, data: null };
    }

    // Days since Unix epoch (UTC) as a stable daily seed.
    const dayIndex = Math.floor(Date.now() / 86_400_000);
    const chosen = problems[dayIndex % problems.length];

    return { success: true, data: chosen };
  } catch (error) {
    console.error("Error fetching problem of the day:", error);
    return { success: false, data: null };
  }
};

export const executeCode = async (
  source_code: string,
  language_id: number,
  stdin: string[],
  expected_outputs: string[],
  id: string
) => {
  const userData = await getCurrentUserData();
  if (!userData || !("id" in userData) || !userData.id) {
    return { success: false, error: "You must be logged in to submit code." };
  }
  const user = userData;

  if (
    !Array.isArray(stdin) ||
    stdin.length === 0 ||
    !Array.isArray(expected_outputs) ||
    expected_outputs.length !== stdin.length
  ) {
    return { success: false, error: "Invalid test cases" };
  }

  try {
    // Submit to Judge0 (RapidAPI)
    const submissions = stdin.map((input) => ({
      source_code,
      language_id,
      stdin: input,
      base64_encoded: false,
      wait: false,
    }));

    const submitResponse = await submitBatch(submissions);
    const tokens = submitResponse.map((res: any) => res.token);
    const results = await pollBatchResults(tokens);

    let allPassed = true;

    const detailedResults = results.map((result: any, i: number) => {
      const stdout = result.stdout?.trim() ?? null;
      const expected_output = expected_outputs[i]?.trim() ?? null;
      const passed = stdout === expected_output;
      if (!passed) allPassed = false;

      return {
        testCases: i + 1,
        passed,
        stdin: stdin[i],
        stdout,
        expected: expected_output,
        stderr: result.stderr?.trim() ?? null,
        compile_output: result.compile_output?.trim() ?? null,
        status: result.status?.description ?? "Unknown",
        memory: result.memory ? `${result.memory} KB` : null,
        time: result.time ? `${result.time} s` : null,
      };
    });

    // Save submission record
    const submission = await prisma.submission.create({
      data: {
        userId: user.id,
        problemId: id,
        sourceCode: source_code,
        language: getLanguageName(language_id),
        stdin: stdin.join("\n"),
        stdout: JSON.stringify(detailedResults.map((r: any) => r.stdout)),
        stderr: detailedResults.some((r: any) => r.stderr)
          ? JSON.stringify(detailedResults.map((r: any) => r.stderr))
          : null,
        compileOutput: detailedResults.some((r: any) => r.compile_output)
          ? JSON.stringify(detailedResults.map((r: any) => r.compile_output))
          : null,
        status: allPassed ? "Accepted" : "Wrong Answer",
        memory: detailedResults.some((r: any) => r.memory)
          ? JSON.stringify(detailedResults.map((r: any) => r.memory))
          : null,
        time: detailedResults.some((r: any) => r.time)
          ? JSON.stringify(detailedResults.map((r: any) => r.time))
          : null,
      },
    });

    if (allPassed) {
      await prisma.problemSolved.upsert({
        where: { userId_problemId: { userId: user.id, problemId: id } },
        update: {},
        create: { userId: user.id, problemId: id },
      });
    }

    const testCaseResults = detailedResults.map((result: any) => ({
      submissionId: submission.id,
      testCase: result.testCases,
      passed: result.passed,
      stdout: result.stdout,
      expected: result.expected,
      stderr: result.stderr,
      compileOutput: result.compile_output,
      status: result.status,
      memory: result.memory,
      time: result.time,
    }));

    await prisma.testCasesResult.createMany({ data: testCaseResults });

    const submissionWithTestCases = await prisma.submission.findUnique({
      where: { id: submission.id },
      include: { testCasesResults: true },
    });

    return { success: true, data: submissionWithTestCases };
  } catch (error: any) {
    console.error("Error executing code:", error?.response?.data ?? error);
    return {
      success: false,
      error:
        error?.response?.data?.message || "Code execution failed. Please try again.",
    };
  }
};

export const getAllSubmissionByCurrentForProblem = async (problemId: string) => {
  const userData = await getCurrentUserData();
  const userId =
    userData && "id" in userData ? (userData as any).id : undefined;

  const submissions = await prisma.submission.findMany({
    where: { problemId, userId },
    orderBy: { createdAt: "desc" },
  });

  return { success: true, data: submissions };
};
