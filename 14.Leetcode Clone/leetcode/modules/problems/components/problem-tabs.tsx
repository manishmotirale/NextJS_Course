"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, FileText, Lightbulb, Terminal } from "lucide-react";
import { SubmissionHistory } from "./submission-history";

export const ProblemTabs = ({ problem, submissionHistory }: any) => {
  return (
    <Card className="rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white/80 dark:bg-slate-950/40 backdrop-blur-md shadow-sm overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-zinc-900/60 bg-slate-50/50 dark:bg-zinc-900/10 select-none">
        <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-zinc-200">
          <Terminal className="size-4 stroke-[2.5] text-violet-500" />
          <span className="text-xs font-mono font-extrabold tracking-wider uppercase">
            Problem Console_
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="p-3">
        <Tabs defaultValue="submissions" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-slate-100/70 dark:bg-zinc-900/40 border border-slate-200/60 dark:border-zinc-800/60 rounded-xl p-1 h-auto">
            <TabsTrigger
              value="submissions"
              className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:dark:bg-zinc-950 data-[state=active]:text-violet-600 data-[state=active]:dark:text-violet-400 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-slate-200/60 data-[state=active]:dark:border-zinc-800/60 text-slate-500 dark:text-zinc-500 transition-all"
            >
              <Trophy className="size-3.5 stroke-[2.5]" />
              Submissions
            </TabsTrigger>
            <TabsTrigger
              value="editorial"
              className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:dark:bg-zinc-950 data-[state=active]:text-violet-600 data-[state=active]:dark:text-violet-400 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-slate-200/60 data-[state=active]:dark:border-zinc-800/60 text-slate-500 dark:text-zinc-500 transition-all"
            >
              <FileText className="size-3.5 stroke-[2.5]" />
              Editorial
            </TabsTrigger>
            <TabsTrigger
              value="hints"
              className="flex items-center gap-1.5 text-[11px] font-mono font-bold uppercase tracking-wider rounded-lg py-2 data-[state=active]:bg-white data-[state=active]:dark:bg-zinc-950 data-[state=active]:text-violet-600 data-[state=active]:dark:text-violet-400 data-[state=active]:shadow-sm data-[state=active]:border data-[state=active]:border-slate-200/60 data-[state=active]:dark:border-zinc-800/60 text-slate-500 dark:text-zinc-500 transition-all"
            >
              <Lightbulb className="size-3.5 stroke-[2.5]" />
              Hints
            </TabsTrigger>
          </TabsList>

          {/* Submissions Tab */}
          <TabsContent value="submissions" className="mt-3">
            <SubmissionHistory submissions={submissionHistory} />
          </TabsContent>

          {/* Editorial Tab */}
          <TabsContent value="editorial" className="mt-3">
            {problem?.editorial ? (
              <div className="rounded-xl border border-slate-100 dark:border-zinc-900 bg-slate-50/40 dark:bg-zinc-900/20 p-4 font-mono text-xs leading-relaxed text-slate-700 dark:text-zinc-300 whitespace-pre-wrap">
                {problem.editorial}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 space-y-3 select-none">
                <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-zinc-900/40 border border-slate-200/60 dark:border-zinc-800/60">
                  <FileText className="size-7 text-slate-400 dark:text-zinc-600" />
                </div>
                <p className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-600">
                  Editorial Not Available
                </p>
                <p className="text-[11px] text-slate-400 dark:text-zinc-600 font-medium text-center max-w-xs">
                  The editorial for this problem hasn't been published yet.
                </p>
              </div>
            )}
          </TabsContent>

          {/* Hints Tab */}
          <TabsContent value="hints" className="mt-3">
            {problem?.hints ? (
              <div className="rounded-xl border border-slate-100 dark:border-zinc-900 bg-slate-50/40 dark:bg-zinc-900/20 p-4 font-mono text-xs leading-relaxed text-slate-700 dark:text-zinc-300 whitespace-pre-wrap">
                <div className="flex items-center gap-1.5 mb-3 text-[10px] font-extrabold uppercase tracking-widest text-amber-500 dark:text-amber-400">
                  <Lightbulb className="size-3.5 fill-current" />
                  Hint Matrix
                </div>
                {problem.hints}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-14 space-y-3 select-none">
                <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-zinc-900/40 border border-slate-200/60 dark:border-zinc-800/60">
                  <Lightbulb className="size-7 text-slate-400 dark:text-zinc-600" />
                </div>
                <p className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-600">
                  No Hints Available
                </p>
                <p className="text-[11px] text-slate-400 dark:text-zinc-600 font-medium text-center max-w-xs">
                  No hints have been added for this problem yet.
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
