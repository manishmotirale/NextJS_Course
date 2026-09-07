"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ModeToggle } from "@/components/modetoggler";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getDifficultyColor } from "../constant";

export function ProblemHeader({ problem }: any) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 w-full select-none">
      <div className="space-y-3 flex-1">
        <div className="flex flex-wrap items-center gap-3">
          <Link href="/problems">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-slate-950/40 text-slate-500 dark:text-zinc-400 hover:text-violet-500 transition-all shadow-sm"
            >
              <ArrowLeft className="size-4 stroke-[2.5]" />
            </Button>
          </Link>
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-zinc-50 font-mono uppercase">
            {problem?.title}_
          </h1>
          <Badge
            className={cn(
              "text-[10px] font-extrabold tracking-widest px-2.5 py-0.5 rounded-lg border uppercase shadow-sm select-none",
              getDifficultyColor(problem?.difficulty),
            )}
          >
            {problem?.difficulty || "EASY"}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 sm:pl-12">
          {problem?.tags?.map((tag: string) => (
            <Badge
              key={tag}
              variant="outline"
              className="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100/40 dark:bg-zinc-900/40 border-slate-200/60 dark:border-zinc-800/60 text-slate-500 dark:text-zinc-400 px-2 py-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-900/80 transition-colors"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-end self-end sm:self-center">
        <ModeToggle />
      </div>
    </div>
  );
}
