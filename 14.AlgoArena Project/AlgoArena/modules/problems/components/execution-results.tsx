"use client";

import React from "react";
import { SubmissionDetails } from "./submission-details";
import { TestCaseTable } from "./testcase-table";

export function ExecutionResults({ executionResponse }: any) {
  if (!executionResponse?.submission) return null;

  return (
    <div className="space-y-6 mt-6 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <div className="flex items-center gap-2 px-1">
        <div className="h-1.5 w-1.5 rounded-full bg-violet-500 animate-pulse" />
        <span className="text-xs font-mono font-bold tracking-wider text-muted-foreground uppercase">
          Telemetry Execution Data Matrix
        </span>
      </div>
      <SubmissionDetails submission={executionResponse.submission} />
      <TestCaseTable testCases={executionResponse.submission.testCases} />
    </div>
  );
}