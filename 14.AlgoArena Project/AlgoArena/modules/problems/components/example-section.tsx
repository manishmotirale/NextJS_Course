"use client";

import React from "react";

export function ExampleSection({ example, index }: any) {
  if (!example) return null;

  return (
    <div className="space-y-2 font-mono">
      <h3 className="text-xs font-extrabold tracking-widest text-slate-400 dark:text-zinc-500 uppercase">
        CASE_DATA_0{index + 1}
      </h3>
      <div className="bg-slate-50/50 dark:bg-zinc-900/30 border border-slate-100 dark:border-zinc-900 p-4 rounded-xl space-y-2.5 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
          <span className="font-bold text-amber-500/90 w-28 shrink-0">
            STDIN_STREAM:
          </span>
          <code className="text-xs dark:bg-zinc-950 bg-slate-200/60 border border-slate-300/30 dark:border-zinc-800/60 text-slate-800 dark:text-zinc-200 px-2 py-0.5 rounded break-all">
            {example.input}
          </code>
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-1.5">
          <span className="font-bold text-emerald-500/90 w-28 shrink-0">
            STDOUT_VALUE:
          </span>
          <code className="text-xs dark:bg-zinc-950 bg-slate-200/60 border border-slate-300/30 dark:border-zinc-800/60 text-slate-800 dark:text-zinc-200 px-2 py-0.5 rounded break-all">
            {example.output}
          </code>
        </div>
        {example.explanation && (
          <div className="pt-1.5 border-t border-slate-100 dark:border-zinc-900/80 text-slate-600 dark:text-zinc-400 font-sans leading-relaxed text-xs">
            <span className="font-bold font-mono text-[10px] uppercase tracking-wider block text-slate-400 mb-0.5">
              Explanation:
            </span>
            {example.explanation}
          </div>
        )}
      </div>
    </div>
  );
}
