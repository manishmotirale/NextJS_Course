"use client";

import React from "react";
import Link from "next/link";
import {
  Terminal,
  Cpu,
  Layers,
  Play,
  Trophy,
  ArrowRight,
  Database,
  Shield,
  Zap,
  List,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const AboutAlgoArenaPage = () => {
  const platformFeatures = [
    {
      icon: Cpu,
      title: "Isolated Code Execution",
      description:
        "Submit and run solutions inside a sandboxed runtime environment leveraging high-performance compilation pipelines.",
      colorClass: "text-violet-500 border-violet-500/10 bg-violet-500/5",
    },
    {
      icon: Zap,
      title: "Multi-Language Support",
      description:
        "Write solutions natively using Monaco Editor setups customized for JavaScript, Python, and C++ execution blocks.",
      colorClass: "text-amber-500 border-amber-500/10 bg-amber-500/5",
    },
    {
      icon: List,
      title: "Custom Problem Playlists",
      description:
        "Compile and bundle difficult execution matrices into personalized directories to structure your preparation paths.",
      colorClass: "text-blue-500 border-blue-500/10 bg-blue-500/5",
    },
    {
      icon: Trophy,
      title: "Submission Analytics",
      description:
        "Track precise memory diagnostics, runtime speed execution metrics, and unit test boundaries across historically cached runs.",
      colorClass: "text-emerald-500 border-emerald-500/10 bg-emerald-500/5",
    },
    {
      icon: Shield,
      title: "Secure Onboarding",
      description:
        "Seamless synchronization layer mapping execution logs to private user roles directly connected through protected database instances.",
      colorClass: "text-rose-500 border-rose-500/10 bg-rose-500/5",
    },
    {
      icon: Database,
      title: "Modern MERN Pipeline",
      description:
        "Built on top of a lightning-fast React, Next.js, and Prisma-driven structure engineered to provide highly responsive transitions.",
      colorClass: "text-indigo-500 border-indigo-500/10 bg-indigo-500/5",
    },
  ];

  return (
    <div className="min-h-screen text-slate-900 dark:text-zinc-100 transition-colors pt-28 pb-16 relative overflow-hidden select-none">
      {/* Immersive Background Cyber Mesh */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-gradient-to-r from-violet-500/5 via-fuchsia-500/5 to-blue-500/5 blur-[160px] rounded-full pointer-events-none -z-10" />

      <div className="container mx-auto px-4 max-w-5xl space-y-12 relative z-10">
        {/* Hero Meta Header */}
        <div className="space-y-4 text-center max-w-3xl mx-auto">
          <Badge
            variant="outline"
            className="text-[10px] font-mono font-bold uppercase tracking-widest bg-violet-500/10 text-violet-600 dark:text-violet-400 border-violet-500/20 px-3 py-1 rounded-lg"
          >
            platform_manifest_
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black font-mono tracking-tight text-slate-900 dark:text-zinc-50 uppercase">
            ALGOARENA_
          </h1>
          <p className="text-sm sm:text-base font-normal leading-relaxed text-slate-600 dark:text-zinc-400 font-sans">
            AlgoArena is an interactive competitive programming environment
            designed for engineers. It streamlines the process of writing,
            compiling, and testing solutions against demanding technical test
            sets, providing instant compiler diagnostics and performance
            footprints.
          </p>
        </div>

        {/* Platform Overview Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {platformFeatures.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <Card
                key={index}
                className="rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white/80 dark:bg-slate-950/40 backdrop-blur-md shadow-sm overflow-hidden flex flex-col hover:border-violet-500/20 dark:hover:border-violet-500/20 transition-all duration-200"
              >
                <CardContent className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div
                      className={`p-2.5 rounded-xl border w-fit shrink-0 ${feat.colorClass}`}
                    >
                      <Icon className="w-4 h-4 stroke-[2.5]" />
                    </div>
                    <h3 className="text-sm font-mono font-extrabold uppercase tracking-wider text-slate-800 dark:text-zinc-200">
                      {feat.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 leading-relaxed font-sans font-normal">
                      {feat.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Dynamic Architectural Blueprint Card */}
        <Card className="rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white/80 dark:bg-slate-950/40 backdrop-blur-md shadow-sm overflow-hidden">
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-zinc-900/60 bg-slate-50/50 dark:bg-zinc-900/10">
            <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-zinc-200">
              <Terminal className="size-4 stroke-[2.5] text-violet-500" />
              <span className="text-xs font-mono font-extrabold tracking-wider uppercase">
                Runtime Pipeline Blueprint_
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-5 font-mono text-xs text-slate-600 dark:text-zinc-400 leading-relaxed space-y-4">
            <div className="bg-slate-50/50 dark:bg-zinc-900/30 border border-slate-100 dark:border-zinc-900 p-4 rounded-xl space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-violet-500 font-extrabold">
                  1. MONACO ENGINE_
                </span>
                <span className="text-slate-400 dark:text-zinc-600">
                  // Captures source stream in the UI layout
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-violet-500 font-extrabold">
                  2. TRANSMISSION VECTOR_
                </span>
                <span className="text-slate-400 dark:text-zinc-600">
                  // Ships payload arrays down to remote server actions
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-violet-500 font-extrabold">
                  3. SANDBOXED EXECUTION_
                </span>
                <span className="text-slate-400 dark:text-zinc-600">
                  // Evaluates and aggregates system outputs synchronously
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-violet-500 font-extrabold">
                  4. COMPLIANCE MATCHING_
                </span>
                <span className="text-slate-400 dark:text-zinc-600">
                  // Reports runtime, memory limits, and target values back
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="flex items-center justify-center pt-4 select-none">
          <Link href="/problems">
            <Button className="h-10 px-6 rounded-xl font-bold text-xs uppercase tracking-wider gap-2 bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 text-white shadow-md shadow-violet-500/10 active:scale-[0.98] transition-all">
              Access Workspace{" "}
              <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AboutAlgoArenaPage;
