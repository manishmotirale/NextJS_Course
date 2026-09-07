"use client";

import React from "react";
import { Plus, Shuffle, Flame } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function ProblemsHeader({
  onCreatePlaylist,
  problems = [],
  dailyProblemId,
}: any) {
  const router = useRouter();

  const openDaily = () => {
    if (!dailyProblemId) {
      toast.info("No daily problem available yet.");
      return;
    }
    router.push(`/problems/${dailyProblemId}`);
  };

  const pickRandom = () => {
    if (!problems || problems.length === 0) {
      toast.info("No problems available to pick from.");
      return;
    }

    // Prefer unsolved problems; fall back to the full set if all are solved.
    const unsolved = problems.filter(
      (p: any) => !(p.solvedBy?.length > 0),
    );
    const pool = unsolved.length > 0 ? unsolved : problems;
    const choice = pool[Math.floor(Math.random() * pool.length)];

    toast.success(`Opening "${choice.title}"`);
    router.push(`/problems/${choice.id}`);
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full select-none">
      {/* Title & Subtitle Left Block */}
      <div className="space-y-1">
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-zinc-50 uppercase font-mono">
          Problems_
        </h1>
        <p className="text-xs font-medium tracking-wide text-slate-500 dark:text-zinc-400">
          Manage and solve core algorithmic execution matrices.
        </p>
      </div>

      {/* Primary Interaction Buttons Right Block */}
      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
        {/* Problem of the Day — jumps straight to today's problem */}
        <Button
          onClick={openDaily}
          variant="outline"
          title="Solve today's Problem of the Day"
          className="h-10 px-4 rounded-xl font-bold text-xs uppercase tracking-wider gap-2 border-orange-300/60 dark:border-orange-700/50 text-orange-600 dark:text-orange-400 hover:bg-orange-500/5 dark:hover:bg-orange-500/10 active:scale-[0.98] transition-all duration-200"
        >
          <Flame className="h-4 w-4 stroke-[2.5]" />
          Daily
        </Button>

        <Button
          onClick={pickRandom}
          variant="outline"
          title="Jump to a random (unsolved) problem"
          className="h-10 px-4 rounded-xl font-bold text-xs uppercase tracking-wider gap-2 border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-violet-500/5 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 active:scale-[0.98] transition-all duration-200"
        >
          <Shuffle className="h-4 w-4 stroke-[2.5]" />
          Pick Random
        </Button>

        <Button
          onClick={onCreatePlaylist}
          className="h-10 px-4 rounded-xl font-bold text-xs uppercase tracking-wider gap-2 bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 text-white shadow-md shadow-violet-500/10 hover:shadow-violet-500/20 active:scale-[0.98] transition-all duration-200"
        >
          <Plus className="h-4 w-4 stroke-[2.5]" />
          Create Playlist
        </Button>
      </div>
    </div>
  );
}
