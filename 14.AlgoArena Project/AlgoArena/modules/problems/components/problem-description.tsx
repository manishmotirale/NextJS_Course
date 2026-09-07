"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { ExampleSection } from "./example-section";
import { ConstraintsSection } from "./constraint-section";

export function ProblemDescription({ problem }: any) {
  return (
    <Card className="rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white/80 dark:bg-slate-950/40 backdrop-blur-md shadow-sm overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-zinc-900/60 bg-slate-50/50 dark:bg-zinc-900/10 select-none">
        <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-zinc-200">
          <FileText className="size-4 stroke-[2.5] text-violet-500" />
          <span className="text-xs font-mono font-extrabold tracking-wider uppercase">
            Problem Matrix Description_
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="pt-5">
        <div className="space-y-6">
          <p className="text-sm text-slate-700 dark:text-zinc-300 leading-relaxed font-normal whitespace-pre-wrap">
            {problem?.description}
          </p>

          {problem?.examples &&
            Object.values(problem.examples).map(
              (example: any, index: number) => (
                <ExampleSection key={index} example={example} index={index} />
              ),
            )}

          {problem?.constraints && (
            <ConstraintsSection constraints={problem.constraints} />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
