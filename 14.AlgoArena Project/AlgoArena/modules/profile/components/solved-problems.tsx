import React from "react";
import { Trophy, Calendar, Code } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const SolvedProblems = ({ solvedProblems = [] }: any) => {
  const formatDate = (dateString: any) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <Card className="rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white/80 dark:bg-slate-950/40 backdrop-blur-md shadow-sm overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-zinc-900/60 bg-slate-50/50 dark:bg-zinc-900/10 select-none">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-zinc-200">
            <Trophy className="size-4 stroke-[2.5] text-emerald-500" />
            <span className="text-xs font-mono font-extrabold tracking-wider uppercase">
              Solved Problems_
            </span>
          </CardTitle>
          <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md shadow-none">
            {solvedProblems.length}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        {solvedProblems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 space-y-2 font-mono select-none">
            <Code className="size-6 text-slate-300 dark:text-zinc-700 stroke-[2]" />
            <p className="text-[11px] font-bold text-slate-400 dark:text-zinc-500 uppercase tracking-wider">
              zero_matrices_resolved
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[280px] pr-2">
            <div className="space-y-2.5">
              {solvedProblems.map((problem: any) => (
                <div
                  key={problem.id}
                  className="flex items-center justify-between border border-slate-100 dark:border-zinc-900/80 bg-slate-50/30 dark:bg-zinc-900/10 p-3 rounded-xl font-mono hover:border-emerald-500/20 dark:hover:border-emerald-500/20 transition-all duration-150"
                >
                  <div className="space-y-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-800 dark:text-zinc-200 truncate pr-2">
                      {problem.problem?.title ?? `Problem ${problem.problemId?.slice(0, 8)}...`}
                    </h4>
                    <span className="text-[9px] font-bold tracking-wider uppercase text-slate-400 dark:text-zinc-600 block">
                      {problem.problem?.difficulty ?? "ID: " + problem.problemId?.slice(0, 8) + "..."}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-semibold text-slate-400 dark:text-zinc-600 whitespace-nowrap shrink-0">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(problem.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
};

export default SolvedProblems;
