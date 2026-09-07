import React from "react";
import { Gauge } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface DifficultyBreakdownProps {
  // solvedProblems each contain a nested `problem` with `difficulty`
  solvedProblems?: any[];
  totals?: Record<string, number>;
}

const rows = [
  {
    key: "EASY",
    label: "Easy",
    bar: "bg-emerald-500",
    text: "text-emerald-600 dark:text-emerald-400",
    track: "bg-emerald-500/10",
  },
  {
    key: "MEDIUM",
    label: "Medium",
    bar: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
    track: "bg-amber-500/10",
  },
  {
    key: "HARD",
    label: "Hard",
    bar: "bg-rose-500",
    text: "text-rose-600 dark:text-rose-400",
    track: "bg-rose-500/10",
  },
] as const;

const DifficultyBreakdown = ({
  solvedProblems = [],
  totals = { EASY: 0, MEDIUM: 0, HARD: 0 },
}: DifficultyBreakdownProps) => {
  const solvedByDiff: Record<string, number> = { EASY: 0, MEDIUM: 0, HARD: 0 };
  for (const sp of solvedProblems) {
    const d = (sp.problem?.difficulty ?? "EASY").toUpperCase();
    if (d in solvedByDiff) solvedByDiff[d] += 1;
  }

  return (
    <Card className="rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white/80 dark:bg-slate-950/40 backdrop-blur-md shadow-sm overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-zinc-900/60 bg-slate-50/50 dark:bg-zinc-900/10 select-none">
        <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-zinc-200">
          <Gauge className="size-4 stroke-[2.5] text-violet-500" />
          <span className="text-xs font-mono font-extrabold tracking-wider uppercase">
            Progress by Difficulty_
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-5 space-y-4">
        {rows.map((row) => {
          const solved = solvedByDiff[row.key];
          const total = totals[row.key as keyof typeof totals] ?? 0;
          const pct = total > 0 ? Math.round((solved / total) * 100) : 0;
          return (
            <div key={row.key} className="space-y-1.5 font-mono">
              <div className="flex items-center justify-between">
                <span
                  className={`text-[11px] font-extrabold uppercase tracking-wider ${row.text}`}
                >
                  {row.label}
                </span>
                <span className="text-[11px] font-bold text-slate-500 dark:text-zinc-400">
                  {solved}
                  <span className="text-slate-300 dark:text-zinc-600">
                    {" "}
                    / {total}
                  </span>
                </span>
              </div>
              <div
                className={`h-2 w-full rounded-full overflow-hidden ${row.track}`}
              >
                <div
                  className={`h-full rounded-full ${row.bar} transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default DifficultyBreakdown;
