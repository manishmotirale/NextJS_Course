"use client";

import React from "react";
import Link from "next/link";
import {
  Bookmark,
  PencilIcon,
  TrashIcon,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";

/**
 * Single row in the problems table
 */
export function ProblemRow({ problem, number, user, onDelete, onSave }: any) {
  const isSolved = problem.solvedBy?.length > 0;

  return (
    <TableRow className="group border-none hover:bg-slate-500/5 dark:hover:bg-zinc-800/20 transition-all duration-200">
      {/* Number + Solved Status Indicator */}
      <TableCell className="align-middle pl-4">
        <div className="flex items-center gap-2.5">
          {number != null && (
            <span className="text-[11px] font-mono font-bold text-slate-400 dark:text-zinc-600 tabular-nums w-7 shrink-0">
              #{number}
            </span>
          )}
          <SolvedIndicator checked={isSolved} />
        </div>
      </TableCell>

      {/* Title with link */}
      <TableCell className="align-middle font-semibold text-sm max-w-xs sm:max-w-md truncate">
        <ProblemTitle id={problem.id} title={problem.title} />
      </TableCell>

      {/* Tags List */}
      <TableCell className="align-middle">
        <TagsList tags={problem.tags} />
      </TableCell>

      {/* Difficulty badge */}
      <TableCell className="align-middle">
        <DifficultyBadge difficulty={problem.difficulty} />
      </TableCell>

      {/* Action buttons alignment setup */}
      <TableCell className="align-middle text-right pr-6">
        <ActionButtons
          problemId={problem.id}
          isAdmin={user?.role === "ADMIN"}
          onDelete={onDelete}
          onSave={onSave}
        />
      </TableCell>
    </TableRow>
  );
}

/**
 * Icon-driven indicator replacing raw gray checkbox for code state
 */
function SolvedIndicator({ checked }: { checked: boolean }) {
  return checked ? (
    <CheckCircle2 className="h-4 w-4 text-emerald-500 dark:text-emerald-400 stroke-[2.5] drop-shadow-[0_0_6px_rgba(16,185,129,0.2)]" />
  ) : (
    <Circle className="h-4 w-4 text-slate-300 dark:text-zinc-700 stroke-[2]" />
  );
}

/**
 * High-fidelity link matching modern competitive coding indices
 */
function ProblemTitle({ id, title }: { id: string; title: string }) {
  return (
    <Link
      href={`/problems/${id}`}
      className="text-slate-900 dark:text-zinc-100 hover:text-violet-600 dark:hover:text-violet-400 font-medium transition-colors duration-150 block truncate"
    >
      {title}
    </Link>
  );
}

/**
 * Clean mono tag list with slate-neutral cyber tinting rules
 */
function TagsList({ tags = [] }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5 max-w-sm mx-auto">
      {tags.map((tag, idx) => (
        <Badge
          key={idx}
          variant="outline"
          className="text-[10px] font-mono font-bold uppercase tracking-wider bg-slate-100/50 dark:bg-zinc-900/40 border-slate-200/60 dark:border-zinc-800/60 text-slate-500 dark:text-zinc-400 px-2 py-0.5 rounded-md hover:bg-slate-100 dark:hover:bg-zinc-900/80 transition-colors"
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}

/**
 * Difficulty component utilizing localized high-contrast badges
 */
function DifficultyBadge({ difficulty }: { difficulty: string }) {
  const normalized = (difficulty || "EASY").toUpperCase();

  const styles: Record<string, string> = {
    EASY: "bg-emerald-500/10 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
    MEDIUM:
      "bg-amber-500/10 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
    HARD: "bg-rose-500/10 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
  };

  return (
    <Badge
      variant="outline"
      className={`${styles[normalized] || styles.EASY} text-[10px] font-extrabold tracking-widest px-2 py-0.5 rounded-lg border uppercase shadow-sm select-none`}
    >
      {difficulty}
    </Badge>
  );
}

/**
 * Action layout matching platform action rules
 */
function ActionButtons({ problemId, isAdmin, onDelete, onSave }: any) {
  return (
    <div className="flex items-center justify-end gap-1.5 opacity-80 group-hover:opacity-100 transition-opacity duration-150">
      {isAdmin && (
        <>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(problemId)}
            title="Delete problem"
            className="h-8 w-8 text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 dark:hover:bg-rose-500/10 rounded-lg transition-all"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
          <Link href={`/edit-problem/${problemId}`}>
            <Button
              variant="ghost"
              size="icon"
              title="Edit problem"
              className="h-8 w-8 text-slate-400 hover:text-amber-500 hover:bg-amber-500/5 dark:hover:bg-amber-500/10 rounded-lg transition-all"
            >
              <PencilIcon className="h-4 w-4" />
            </Button>
          </Link>
        </>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onSave(problemId)}
        title="Add to playlist"
        className="h-8 w-8 text-slate-400 hover:text-violet-500 hover:bg-violet-500/5 dark:hover:bg-violet-500/10 rounded-lg transition-all"
      >
        <Bookmark className="h-4 w-4" />
      </Button>
    </div>
  );
}
