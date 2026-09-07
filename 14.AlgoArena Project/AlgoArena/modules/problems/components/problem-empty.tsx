"use client";

import React from "react";
import { Terminal } from "lucide-react";

/**
 * Empty state shown when no problems match the filters
 */
export function ProblemsEmpty() {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 w-full text-center animate-fade-in select-none">
      {/* Tech Alert Icon Box */}
      <div className="w-10 h-10 rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-900/30 flex items-center justify-center text-slate-400 dark:text-zinc-500 shadow-sm">
        <Terminal className="w-4 h-4 stroke-[2.5]" />
      </div>

      {/* Warning Text Structure */}
      <div className="space-y-0.5">
        <h4 className="text-xs font-extrabold tracking-wider text-slate-800 dark:text-zinc-200 uppercase">
          Zero Matrices Matched
        </h4>
        <p className="text-[11px] font-mono tracking-widest text-slate-400 dark:text-zinc-500 uppercase">
          no_problems_found_matching_criteria
        </p>
      </div>
    </div>
  );
}
