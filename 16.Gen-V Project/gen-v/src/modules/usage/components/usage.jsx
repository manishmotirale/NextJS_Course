import Link from "next/link";
import { CrownIcon, ZapIcon } from "lucide-react";
import { formatDuration, intervalToDuration } from "date-fns";
import { Button } from "@/components/ui/button";
import { useStatus } from "../hooks/usage";
import { useAuth } from "@clerk/nextjs";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

const SHELL = "bg-background rounded-t-xl border border-b-0 px-3 py-2.5";

export const Usage = () => {
  const { data, isPending, error } = useStatus();
  const { has } = useAuth();
  const hasProAccess = has?.({ plan: "pro" });

  if (isPending) {
    return (
      <div className={cn(SHELL, "flex items-center gap-2")}>
        <Spinner className="text-emerald-400" />
        <span className="text-muted-foreground text-xs">Loading credits...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={SHELL}>
        <p className="text-destructive text-sm">Could not load your credits</p>
      </div>
    );
  }

  const points = data?.remainingPoints ?? 0;
  const maxPoints = data?.maxPoints ?? points;
  const msBeforeNext = data?.msBeforeNext ?? 0;

  const used = Math.max(0, maxPoints - points);
  const usedPercent = maxPoints > 0 ? Math.min(100, (used / maxPoints) * 100) : 0;

  const isEmpty = points <= 0;
  const isLow = !isEmpty && maxPoints > 0 && points / maxPoints <= 0.2;

  // formatDuration returns "" once the remaining time is under an hour, which
  // rendered a bare "Resets in ". Fall back to a readable phrase.
  const resetText =
    formatDuration(intervalToDuration({ start: 0, end: msBeforeNext }), {
      format: ["months", "days", "hours"],
    }) || "less than an hour";

  return (
    <div className={SHELL}>
      <div className="flex items-center gap-x-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <ZapIcon
              className={cn(
                "size-3.5 shrink-0",
                isEmpty
                  ? "text-destructive"
                  : isLow
                    ? "text-amber-500"
                    : "text-emerald-500",
              )}
            />
            <p className="text-sm font-medium">
              {isEmpty ? (
                <span className="text-destructive">No credits left</span>
              ) : (
                <>
                  {points}{" "}
                  <span className="text-muted-foreground font-normal">
                    of {maxPoints} credits
                  </span>
                </>
              )}
            </p>
          </div>

          {/* Progress bar makes the remaining balance readable at a glance. */}
          <div
            className="bg-muted mt-2 h-1 w-full overflow-hidden rounded-full"
            role="progressbar"
            aria-valuenow={points}
            aria-valuemin={0}
            aria-valuemax={maxPoints}
            aria-label="Credits remaining"
          >
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                isEmpty
                  ? "bg-destructive"
                  : isLow
                    ? "bg-amber-500"
                    : "bg-emerald-500",
              )}
              style={{ width: `${100 - usedPercent}%` }}
            />
          </div>

          <p className="text-muted-foreground mt-1.5 text-xs">
            Resets in {resetText}
          </p>
        </div>

        {!hasProAccess && (
          // Base UI Button composes via render, not asChild.
          <Button size="sm" className="shrink-0" render={<Link href="/pricing" />}>
            <CrownIcon className="size-3.5" />
            Upgrade
          </Button>
        )}
      </div>
    </div>
  );
};
