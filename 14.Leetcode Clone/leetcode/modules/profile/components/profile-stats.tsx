import React from "react";
import { BarChart3, Target, Clock, Award, Flame } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ProfileStats = ({
  submissions = [],
  solvedCount = 0,
  playlistCount = 0,
  streak = 0,
}: any) => {
  const acceptedSubmissions = submissions.filter(
    (s: any) => s.status === "Accepted",
  ).length;

  const successRate =
    submissions.length > 0
      ? Math.round((acceptedSubmissions / submissions.length) * 100)
      : 0;

  const stats = [
    {
      icon: Flame,
      label: "Day Streak",
      value: `${streak}${streak > 0 ? "🔥" : ""}`,
      colorClass:
        "text-orange-500 dark:text-orange-400 border-orange-500/10 bg-orange-500/5",
    },
    {
      icon: Target,
      label: "Success Rate",
      value: `${successRate}%`,
      colorClass:
        "text-emerald-500 dark:text-emerald-400 border-emerald-500/10 bg-emerald-500/5",
    },
    {
      icon: BarChart3,
      label: "Total Runs",
      value: submissions.length.toString(),
      colorClass:
        "text-blue-500 dark:text-blue-400 border-blue-500/10 bg-blue-500/5",
    },
    {
      icon: Award,
      label: "Matrices Solved",
      value: solvedCount.toString(),
      colorClass:
        "text-violet-500 dark:text-violet-400 border-violet-500/10 bg-violet-500/5",
    },
    {
      icon: Clock,
      label: "Playlists Compiled",
      value: playlistCount.toString(),
      colorClass:
        "text-amber-500 dark:text-amber-400 border-amber-500/10 bg-amber-500/5",
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 select-none">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className="rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white/80 dark:bg-slate-950/40 backdrop-blur-md shadow-sm overflow-hidden"
          >
            <CardContent className="p-5 flex items-center gap-4">
              <div
                className={`p-3 rounded-xl border shrink-0 ${stat.colorClass}`}
              >
                <Icon className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div className="space-y-0.5 truncate">
                <p className="text-xl sm:text-2xl font-black font-mono tracking-tight text-slate-900 dark:text-zinc-50">
                  {stat.value}
                </p>
                <p className="text-[10px] font-mono font-bold tracking-wider uppercase text-slate-400 dark:text-zinc-500 truncate">
                  {stat.label}
                </p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default ProfileStats;
