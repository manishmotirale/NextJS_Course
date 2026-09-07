"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Cpu,
  Code2,
  Calendar,
  History,
  Terminal,
} from "lucide-react";

interface Submission {
  id: string;
  status: string;
  language: string;
  memory: string | null;
  time: string | null;
  createdAt: string | Date;
}

interface SubmissionHistoryProps {
  submissions?: Submission[];
}

export const SubmissionHistory = ({
  submissions = [],
}: SubmissionHistoryProps) => {
  if (!submissions.length) {
    return (
      <div className="flex flex-col items-center justify-center py-14 space-y-3 select-none">
        <div className="p-4 rounded-2xl bg-slate-100/60 dark:bg-zinc-900/40 border border-slate-200/60 dark:border-zinc-800/60">
          <History className="size-7 text-slate-400 dark:text-zinc-600" />
        </div>
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-600">
          No Submissions Yet
        </p>
        <p className="text-[11px] text-slate-400 dark:text-zinc-600 font-medium text-center max-w-xs">
          Run or submit your code to see your execution history here.
        </p>
      </div>
    );
  }

  const formatMemory = (memory: string | null) => {
    if (!memory) return "N/A";
    try {
      const memoryArray = JSON.parse(memory);
      const avg =
        memoryArray.reduce(
          (a: number, b: string | number) => a + parseFloat(String(b)),
          0,
        ) / memoryArray.length;
      return `${avg.toFixed(2)} KB`;
    } catch {
      return "N/A";
    }
  };

  const formatTime = (time: string | null) => {
    if (!time) return "N/A";
    try {
      const timeArray = JSON.parse(time);
      const avg =
        timeArray
          .map((t: string) => parseFloat(t.replace(" s", "")))
          .reduce((a: number, b: number) => a + b, 0) / timeArray.length;
      return `${avg.toFixed(3)} s`;
    } catch {
      return "N/A";
    }
  };

  const formatDate = (dateString: string | Date) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Always show the most recent submission first.
  const orderedSubmissions = [...submissions].sort(
    (a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <ScrollArea className="h-[420px] pr-1">
      <div className="space-y-3 pb-1">
        {orderedSubmissions.map((submission, idx) => {
          const isAccepted = submission.status === "Accepted";
          return (
            <div
              key={submission.id || idx}
              className="group border border-slate-100 dark:border-zinc-900/80 bg-slate-50/40 dark:bg-zinc-900/20 rounded-xl p-4 space-y-3 font-mono hover:border-violet-500/20 dark:hover:border-violet-500/20 transition-all duration-200"
            >
              {/* Header row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {isAccepted ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 font-mono text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                      <CheckCircle2 className="size-3 stroke-[2.5]" />
                      Accepted
                    </Badge>
                  ) : (
                    <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-2.5 py-0.5 font-mono text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1">
                      <XCircle className="size-3 stroke-[2.5]" />
                      Failed
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 dark:text-zinc-600 font-semibold">
                  <Calendar className="size-3" />
                  {formatDate(submission.createdAt)}
                </div>
              </div>

              {/* Stats grid */}
              <div className="grid grid-cols-3 gap-2">
                <div className="flex flex-col gap-1 px-2.5 py-2 rounded-lg bg-slate-100/50 dark:bg-zinc-900/40 border border-slate-200/40 dark:border-zinc-800/40">
                  <div className="flex items-center gap-1.5 text-[9px] font-extrabold tracking-widest uppercase text-slate-400 dark:text-zinc-600">
                    <Code2 className="size-2.5 text-violet-500" />
                    Language
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-zinc-300 truncate">
                    {submission.language}
                  </p>
                </div>

                <div className="flex flex-col gap-1 px-2.5 py-2 rounded-lg bg-slate-100/50 dark:bg-zinc-900/40 border border-slate-200/40 dark:border-zinc-800/40">
                  <div className="flex items-center gap-1.5 text-[9px] font-extrabold tracking-widest uppercase text-slate-400 dark:text-zinc-600">
                    <Cpu className="size-2.5 text-indigo-500" />
                    Memory
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                    {formatMemory(submission.memory)}
                  </p>
                </div>

                <div className="flex flex-col gap-1 px-2.5 py-2 rounded-lg bg-slate-100/50 dark:bg-zinc-900/40 border border-slate-200/40 dark:border-zinc-800/40">
                  <div className="flex items-center gap-1.5 text-[9px] font-extrabold tracking-widest uppercase text-slate-400 dark:text-zinc-600">
                    <Clock className="size-2.5 text-cyan-500" />
                    Runtime
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-zinc-300">
                    {formatTime(submission.time)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};
