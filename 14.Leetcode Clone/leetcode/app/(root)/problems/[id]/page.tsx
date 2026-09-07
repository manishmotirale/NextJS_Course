"use client";

import React from "react";
import Loading from "@/app/create-problem/loading";
import CodeEditorPanel from "@/modules/problems/components/code-editor-panel";
import { ProblemHeader } from "@/modules/problems/components/probelm-header";
import { ProblemDescription } from "@/modules/problems/components/problem-description";
import { ProblemTabs } from "@/modules/problems/components/problem-tabs";
import TestCasesPanel from "@/modules/problems/components/test-cases-panel";
import { useEditor } from "@/modules/problems/hooks/use-editor";
import { useProblem } from "@/modules/problems/hooks/use-problem";
import { useParams } from "next/navigation";
import { ExecutionResults } from "@/modules/problems/components/execution-results";
import { useSubmissionHistory } from "@/modules/problems/hooks/use-submission-history";
import { ArenaAIPanel } from "@/modules/arenaai/arenaai-panel";

const ProblemPage = () => {
  const params = useParams<{ id: string }>();

  const { problem, isLoading }: any = useProblem(params.id);
  const { submissionHistory } = useSubmissionHistory(params.id);
  const {
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
  } = useEditor(problem, "JAVASCRIPT");

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <Loading />
      </div>
    );
  }

  if (!problem) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-950">
        <div className="text-center space-y-3">
          <h2 className="text-2xl font-black text-slate-900 dark:text-zinc-100 uppercase tracking-widest">
            Problem Not Found
          </h2>
          <p className="text-sm text-slate-500 dark:text-zinc-400 font-mono">
            This problem does not exist or was removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-900 dark:text-zinc-100 transition-colors pt-24 pb-16 relative overflow-hidden bg-slate-50/50 dark:bg-slate-950">
      {/* Background glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-gradient-to-r from-violet-500/10 via-indigo-500/5 to-cyan-500/10 blur-[180px] rounded-full pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <ProblemHeader problem={problem} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 items-start">
          {/* LEFT: Description + Tabs */}
          <div className="lg:col-span-5 space-y-6 sticky top-24">
            <ProblemDescription problem={problem} />
            <ProblemTabs
              problem={problem}
              submissionHistory={submissionHistory}
            />
          </div>

          {/* RIGHT: Editor + Test Cases + Results */}
          <div className="lg:col-span-7 space-y-6">
            <CodeEditorPanel
              code={code}
              onCodeChange={setCode}
              selectedLanguage={selectedLanguage}
              onLanguageChange={setSelectedLanguage}
              onRun={handleRun}
              onSubmit={handleSubmit}
              onReset={resetCode}
              isRunning={isRunning}
              isSubmitting={isSubmitting}
            />

            <TestCasesPanel testCases={problem?.testCases} />
            <ExecutionResults executionResponse={executionResponse} />
          </div>
        </div>
      </div>

      {/* ArenaAI — context-aware coding mentor for this problem */}
      <ArenaAIPanel
        problem={problem}
        code={code}
        language={selectedLanguage}
        executionResponse={executionResponse}
      />
    </div>
  );
};

export default ProblemPage;
