"use client";

import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Terminal } from "lucide-react";

const TestCasesPanel = ({ testCases }: any) => {
  if (!testCases || testCases.length === 0) return null;

  return (
    <Card className="rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white/80 dark:bg-slate-950/40 backdrop-blur-md shadow-sm overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-zinc-900/60 bg-slate-50/50 dark:bg-zinc-900/10 select-none">
        <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-zinc-200">
          <Terminal className="size-4 stroke-[2.5] text-violet-500" />
          <span className="text-xs font-mono font-extrabold tracking-wider uppercase">
            Validation Datasets_
          </span>
        </CardTitle>
        <CardDescription className="text-[11px] font-medium text-slate-400 dark:text-zinc-500 uppercase font-mono tracking-wide pl-6">
          Evaluate compiler behavior against unit boundaries.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4">
        <ScrollArea className="h-64 pr-2">
          <div className="space-y-3">
            {testCases.map((testCase: any, index: any) => (
              <TestCaseItem key={index} testCase={testCase} index={index} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

function TestCaseItem({ testCase, index }: any) {
  return (
    <div className="border border-slate-100 dark:border-zinc-900 bg-slate-50/40 dark:bg-zinc-900/20 rounded-xl p-3.5 space-y-2 font-mono">
      <div className="text-[10px] font-extrabold tracking-widest text-slate-400 dark:text-zinc-500 uppercase">
        VECTOR_0{index + 1} //
      </div>
      <div className="space-y-1.5 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1">
          <span className="font-bold text-slate-500 dark:text-zinc-400 w-20 shrink-0">
            INPUT:
          </span>
          <code className="bg-slate-100 dark:bg-zinc-900 border border-slate-200/40 dark:border-zinc-800/40 px-2 py-0.5 rounded text-xs text-slate-800 dark:text-zinc-300 break-all">
            {testCase.input}
          </code>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1">
          <span className="font-bold text-violet-500 dark:text-violet-400 w-20 shrink-0">
            EXPECTED:
          </span>
          <code className="bg-slate-100 dark:bg-zinc-900 border border-slate-200/40 dark:border-zinc-800/40 px-2 py-0.5 rounded text-xs text-slate-800 dark:text-zinc-300 break-all">
            {testCase.output}
          </code>
        </div>
      </div>
    </div>
  );
}

export default TestCasesPanel;
