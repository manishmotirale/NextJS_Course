"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useEditor(
  problem: any,
  initialLanguage: "JAVASCRIPT" | "PYTHON" | "CPP"
) {
  const [selectedLanguage, setSelectedLanguage] = useState(initialLanguage);
  const [code, setCode] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [executionResponse, setExecutionResponse] = useState<any | null>(null);

  // Load the starter code snippet when language or problem changes
  useEffect(() => {
    if (problem?.codeSnippets?.[selectedLanguage]) {
      setCode(problem.codeSnippets[selectedLanguage]);
    } else {
      setCode("");
    }
  }, [selectedLanguage, problem]);

  // Core execution function — calls /api/execute (Piston + Wandbox, free)
  const execute = async (isSubmit: boolean) => {
    if (!problem) return;

    const loading = isSubmit ? setIsSubmitting : setIsRunning;

    try {
      loading(true);
      setExecutionResponse(null);

      const response = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sourceCode: code,
          language:   selectedLanguage,
          problemId:  problem.id,
          testCases:  problem.testCases,
          isSubmit,
        }),
      });

      // If the server returned HTML (e.g. Next.js 500 page), surface a clean error
      const contentType = response.headers.get("content-type") ?? "";
      if (!response.ok && contentType.includes("text/html")) {
        throw new Error(`Server error ${response.status} — please try again`);
      }

      const data = await response.json();

      if (!data.success) {
        toast.error(data.error ?? "Execution failed");
        return;
      }

      // Map into the shape <ExecutionResults> expects
      setExecutionResponse({
        submission: {
          ...data.submission,
          testCases: data.submission?.testCasesResults ?? data.submission?.testCases ?? [],
        },
      });

      if (isSubmit) {
        if (data.allPassed) {
          toast.success("Vector Accepted! All test cases passed.", { duration: 5000 });
        } else {
          toast.error("Wrong Answer — check the test case results below.");
        }
      } else {
        toast.success("Run complete!");
      }
    } catch (err: any) {
      console.error("[useEditor] Execution error:", err);
      toast.error(err?.message ?? "An error occurred while running your code.");
    } finally {
      loading(false);
    }
  };

  const handleRun    = () => execute(false);
  const handleSubmit = () => execute(true);

  // Reset the editor back to the problem's starter snippet for the current language
  const resetCode = () => {
    const snippet = problem?.codeSnippets?.[selectedLanguage] ?? "";
    setCode(snippet);
    toast.success("Code reset to starter template");
  };

  return {
    selectedLanguage,
    setSelectedLanguage,
    code,
    setCode,
    isRunning,
    isSubmitting,
    executionResponse,
    handleRun,
    handleSubmit,
    resetCode,
  };
}
