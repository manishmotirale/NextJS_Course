"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

/**
 * Pagination controls with previous/next buttons and page info
 */
export function ProblemsPagination({
  currentPage,
  totalPages,
  displayRange,
  canGoPrev, // 💡 Synced to match table prop name
  canGoNext, // 💡 Synced to match table prop name
  onPrev, // 💡 Synced to match table prop name
  onNext, // 💡 Synced to match table prop name
}: any) {
  // Grace safety check to prevent rendering empty structures on 0 entries
  if (!displayRange || displayRange.total === 0) return null;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between w-full gap-4 px-2 py-4 border-t border-slate-200/40 dark:border-zinc-800/40">
      {/* Results count text string */}
      <p className="text-[11px] font-mono tracking-wider uppercase text-slate-500 dark:text-zinc-500">
        Showing{" "}
        <span className="font-extrabold text-slate-800 dark:text-zinc-300">
          {displayRange.start}
        </span>{" "}
        to{" "}
        <span className="font-extrabold text-slate-800 dark:text-zinc-300">
          {displayRange.end}
        </span>{" "}
        of{" "}
        <span className="font-extrabold text-slate-800 dark:text-zinc-300">
          {displayRange.total}
        </span>{" "}
        entries_
      </p>

      {/* Navigation control cluster layout */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="sm"
          disabled={!canGoPrev}
          onClick={onPrev}
          className="border border-slate-200 dark:border-zinc-800/80 bg-white/80 dark:bg-slate-950/40 backdrop-blur-md rounded-xl text-slate-700 dark:text-zinc-300 hover:bg-violet-500/5 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 font-extrabold text-[10px] uppercase tracking-wider h-9 px-3 gap-1 shadow-sm transition-all duration-200 disabled:opacity-40"
        >
          <ChevronLeft className="w-3.5 h-3.5 stroke-[2.5]" />
          Prev
        </Button>

        <span className="text-[11px] font-extrabold tracking-widest text-slate-700 dark:text-zinc-400 uppercase bg-slate-100/60 dark:bg-zinc-900/60 border border-slate-200/40 dark:border-zinc-800/40 px-3 py-1.5 rounded-lg select-none">
          Page {currentPage} / {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          disabled={!canGoNext}
          onClick={onNext}
          className="border border-slate-200 dark:border-zinc-800/80 bg-white/80 dark:bg-slate-950/40 backdrop-blur-md rounded-xl text-slate-700 dark:text-zinc-300 hover:bg-violet-500/5 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 font-extrabold text-[10px] uppercase tracking-wider h-9 px-3 gap-1 shadow-sm transition-all duration-200 disabled:opacity-40"
        >
          Next
          <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </Button>
      </div>
    </div>
  );
}
