import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Cpu, Code2, Terminal } from "lucide-react";

export const SubmissionDetails = ({ submission }: any) => {
  const isSuccess = submission.status === "Accepted";

  /**
   * Parses a JSON array string like ["2.451 s","1.233 s"] or ["142.5 KB","142.5 KB"]
   * and returns the numeric average, stripping any suffix.
   * Returns null if no valid data.
   */
  const parseAverage = (jsonStr: string | null | undefined): number | null => {
    if (!jsonStr) return null;
    try {
      const arr: any[] = JSON.parse(jsonStr);
      const nums = arr
        .map((v: any) => parseFloat(String(v)))
        .filter((n) => !isNaN(n) && n > 0);
      if (nums.length === 0) return null;
      return nums.reduce((a, b) => a + b, 0) / nums.length;
    } catch {
      return null;
    }
  };

  const avgTime   = parseAverage(submission.time);
  const avgMemory = parseAverage(submission.memory);

  return (
    <Card className="border-slate-200/60 dark:border-zinc-800/60 bg-white/60 dark:bg-zinc-950/40 backdrop-blur-md shadow-sm overflow-hidden">
      {/* Header row: title + accept/fail badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-slate-100 dark:border-zinc-900/60 bg-slate-50/50 dark:bg-zinc-900/20">
        <div className="space-y-1">
          <div className="text-xs font-mono font-bold text-muted-foreground flex items-center gap-1.5 uppercase tracking-wide">
            <Terminal className="size-3.5 text-violet-500" />
            Matrix Result Profile
          </div>
          <p className="text-[11px] font-mono text-muted-foreground">
            Timestamp:{" "}
            {submission.createdAt
              ? new Date(submission.createdAt).toLocaleString()
              : "—"}
          </p>
        </div>

        <div>
          {isSuccess ? (
            <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 px-3 py-1 font-mono text-xs uppercase font-extrabold tracking-wider">
              SUCCESS // ACCEPTED
            </Badge>
          ) : (
            <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 px-3 py-1 font-mono text-xs uppercase font-extrabold tracking-wider">
              CRITICAL // FAILED
            </Badge>
          )}
        </div>
      </div>

      {/* Stats grid */}
      <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Language */}
        <div className="p-3 rounded-xl border border-slate-100 dark:border-zinc-900/40 bg-slate-50/30 dark:bg-zinc-900/5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-violet-500/10 text-violet-500 border border-violet-500/10">
            <Code2 className="size-4" />
          </div>
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Compiler Language
            </p>
            <p className="text-sm font-mono font-bold tracking-tight mt-0.5">
              {submission.language || "—"}
            </p>
          </div>
        </div>

        {/* Memory */}
        <div className="p-3 rounded-xl border border-slate-100 dark:border-zinc-900/40 bg-slate-50/30 dark:bg-zinc-900/5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/10">
            <Cpu className="size-4" />
          </div>
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Avg Memory
            </p>
            <p className="text-sm font-mono font-bold tracking-tight mt-0.5">
              {avgMemory !== null ? `${avgMemory.toFixed(1)} KB` : "N/A"}
            </p>
          </div>
        </div>

        {/* Time */}
        <div className="p-3 rounded-xl border border-slate-100 dark:border-zinc-900/40 bg-slate-50/30 dark:bg-zinc-900/5 flex items-center gap-3">
          <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-500 border border-cyan-500/10">
            <Clock className="size-4" />
          </div>
          <div>
            <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-muted-foreground">
              Compute Latency
            </p>
            <p className="text-sm font-mono font-bold tracking-tight mt-0.5">
              {avgTime !== null ? `${avgTime.toFixed(3)} s` : "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};