import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { onBoardUser } from "@/modules/auth/actions";
import {
  getPlatformStats,
  getProblemDifficultyCounts,
} from "@/modules/problems/actions";
import {
  ChevronRight,
  Code2,
  Play,
  Star,
  Trophy,
  Users,
  Zap,
  Terminal,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Formats large counts compactly (1500 -> "1.5K"), with a trailing "+".
function formatCount(n: number): string {
  if (n >= 1000) {
    const k = n / 1000;
    return `${k % 1 === 0 ? k : k.toFixed(1)}K+`;
  }
  return `${n}`;
}

export default async function Home() {
  await onBoardUser();

  const { data: platform } = await getPlatformStats();
  const { data: diffCounts } = await getProblemDifficultyCounts();

  const features = [
    {
      icon: <Code2 className="w-5 h-5 animate-pulse" />,
      title: "Interactive Coding",
      description:
        "Practice with real-world coding challenges and get instant feedback on your solutions.",
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      title: "Track Progress",
      description:
        "Monitor your improvement with detailed analytics and achievement systems.",
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Global Community",
      description:
        "Learn from thousands of developers worldwide and share your knowledge.",
    },
    {
      icon: <Zap className="w-5 h-5" />,
      title: "Real-time Feedback",
      description:
        "Get instant feedback on your solutions with detailed explanations.",
    },
  ];

  const stats = [
    {
      number: platform.problemCount.toString(),
      label: "Problems Available",
      color: "from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400",
    },
    {
      number: formatCount(platform.solvedCount),
      label: "Problems Solved",
      color:
        "from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400",
    },
    {
      number: formatCount(platform.userCount),
      label: "Developers",
      color:
        "from-violet-600 to-purple-600 dark:from-violet-400 dark:to-purple-400",
    },
    {
      number: `${platform.languages}`,
      label: "Languages",
      color: "from-pink-600 to-rose-600 dark:from-pink-400 dark:to-rose-400",
    },
  ];

  const problemCategories = [
    {
      level: "LEVEL 01",
      title: "Easy Problems",
      description:
        "Perfect for getting started with basic programming concepts and syntax.",
      count: `${diffCounts.EASY} Challenges`,
      gradient:
        "from-blue-500/5 via-cyan-500/5 to-transparent dark:from-blue-500/10 dark:via-cyan-500/5 dark:to-transparent",
      border:
        "border-slate-200 dark:border-zinc-800/80 hover:border-cyan-500/40 dark:hover:border-cyan-500/40",
      glow: "shadow-sm dark:shadow-cyan-500/10",
      text: "text-cyan-600 dark:text-cyan-400",
      badgeBg:
        "bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 border-cyan-500/20",
    },
    {
      level: "LEVEL 02",
      title: "Medium Problems",
      description:
        "Challenge yourself with data structures and algorithm problems.",
      count: `${diffCounts.MEDIUM} Challenges`,
      gradient:
        "from-indigo-500/5 via-violet-500/5 to-transparent dark:from-indigo-500/10 dark:via-violet-500/5 dark:to-transparent",
      border:
        "border-slate-200 dark:border-zinc-800/80 hover:border-indigo-500/40 dark:hover:border-indigo-500/40",
      glow: "shadow-sm dark:shadow-indigo-500/10",
      text: "text-indigo-600 dark:text-indigo-400",
      badgeBg:
        "bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/20",
    },
    {
      level: "LEVEL 03",
      title: "Hard Problems",
      description:
        "Master complex algorithms and compete in programming contests.",
      count: `${diffCounts.HARD} Challenges`,
      gradient:
        "from-violet-500/5 via-purple-500/5 to-transparent dark:from-violet-500/10 dark:via-purple-500/5 dark:to-transparent",
      border:
        "border-slate-200 dark:border-zinc-800/80 hover:border-purple-500/40 dark:hover:border-purple-500/40",
      glow: "shadow-sm dark:shadow-purple-500/10",
      text: "text-purple-600 dark:text-purple-400",
      badgeBg:
        "bg-purple-500/10 text-purple-700 dark:text-purple-400 border-purple-500/20",
    },
  ];

  return (
    <div className="min-h-screen text-slate-900 dark:text-zinc-100 transition-colors pt-24 relative overflow-x-hidden select-none">
      {/* BACKGROUND TECH GRID & VECTOR ILLUSTRATION */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Tech Wireframe Matrix Illustration */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] opacity-20 dark:opacity-[0.12] pointer-events-none select-none z-0">
        <svg
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          className="stroke-indigo-500 dark:stroke-violet-400 fill-none stroke-[0.75]"
        >
          <defs>
            <radialGradient id="glow" cx="50%" cy="30%" r="50%">
              <stop
                offset="0%"
                stopColor="rgb(139, 92, 246)"
                stopOpacity="0.15"
              />
              <stop
                offset="100%"
                stopColor="rgb(139, 92, 246)"
                stopOpacity="0"
              />
            </radialGradient>
          </defs>
          <circle
            cx="50%"
            cy="40%"
            r="280"
            strokeDasharray="4 8"
            className="animate-[spin_120s_linear_infinite]"
          />
          <circle
            cx="50%"
            cy="40%"
            r="180"
            strokeDasharray="16 6"
            className="animate-[spin_80s_linear_infinite_reverse]"
          />
          <path d="M 100 200 L 300 120 L 500 240 L 700 100 L 900 280 L 1100 150" />
          <path d="M 150 450 L 400 320 L 650 480 L 800 290 L 1050 420" />
          <circle cx="300" cy="120" r="4" className="fill-indigo-500" />
          <circle
            cx="700"
            cy="100"
            r="4"
            className="fill-violet-500 animate-ping"
          />
          <circle cx="800" cy="290" r="4" className="fill-pink-500" />
          <circle cx="400" cy="320" r="4" className="fill-cyan-500" />
        </svg>
      </div>

      {/* Hero Section */}
      <section className="min-h-[85vh] flex flex-col justify-center items-center px-4 pt-12 relative overflow-hidden">
        <div className="absolute top-12 left-1/4 w-[350px] h-[350px] bg-blue-500/5 dark:bg-blue-600/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute top-24 right-1/4 w-[400px] h-[400px] bg-violet-500/5 dark:bg-violet-600/15 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          {/* High-Tech Badge */}
          <Badge
            variant="outline"
            className="inline-flex items-center gap-2 mb-8 bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-violet-500/30 p-1.5 pr-4 rounded-full backdrop-blur-md shadow-md hover:bg-slate-100 dark:hover:bg-slate-900/80"
          >
            <span className="bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-500 dark:via-indigo-500 dark:to-violet-600 text-white px-3 py-0.5 rounded-full text-[10px] font-mono font-extrabold tracking-wider uppercase">
              LIVE ARENA
            </span>
            <span className="text-slate-700 dark:text-zinc-400 flex items-center gap-1 text-xs font-mono font-extrabold tracking-wider uppercase">
              <Star className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400 fill-current" />
              10,000+ Coders Battling
            </span>
          </Badge>

          {/* Title - Matches About Page Style */}
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-black font-mono tracking-tight leading-[1.1] mb-8 uppercase text-slate-900 dark:text-white">
            Master{" "}
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-500 bg-clip-text text-transparent">
              Problem Solving
            </span>
            <br />
            With{" "}
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-500 bg-clip-text text-transparent">
              AlgoArena_
            </span>
          </h1>

          {/* Subheading - Uses clean geometric sans font */}
          <p className="text-sm sm:text-base text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto mb-12 leading-relaxed font-sans font-normal">
            Deploy optimized algorithms, claim your rank on the leaderboard, and
            unlock real-time feedback matrix systems.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-24">
            <Link href="/problems">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600 hover:scale-105 active:scale-95 text-white shadow-xl shadow-indigo-500/20 dark:shadow-indigo-500/15 transition-all duration-300 rounded-xl font-mono font-extrabold tracking-wider px-10 h-14 group text-xs uppercase"
              >
                <Play className="w-4 h-4 mr-2 fill-current" />
                Start Coding Now
                <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>

            <Link href="/problems">
              <Button
                variant="outline"
                size="lg"
                className="border border-slate-200 dark:border-zinc-800/80 bg-white/80 dark:bg-slate-950/45 backdrop-blur-md text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900/60 rounded-xl px-10 h-14 font-mono font-extrabold tracking-wider text-xs uppercase transition-all duration-300"
              >
                Browse Problems
              </Button>
            </Link>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto relative select-none">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 dark:from-blue-500/10 dark:via-indigo-500/10 dark:to-purple-500/10 rounded-2xl blur-xl opacity-50 dark:opacity-100 pointer-events-none" />

            {stats.map((stat, index) => (
              <Card
                key={index}
                className="group border border-slate-200 dark:border-zinc-850 bg-white/80 dark:bg-slate-950/40 backdrop-blur-md rounded-2xl transition-all duration-300 hover:-translate-y-1 hover:border-violet-500/30 overflow-hidden shadow-sm"
              >
                <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-violet-500/40 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
                <CardHeader className="p-5 md:p-6 text-center space-y-1 font-mono">
                  <CardTitle
                    className={`text-3xl md:text-4xl font-extrabold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent tracking-tight`}
                  >
                    {stat.number}
                  </CardTitle>
                  <CardDescription className="text-[9px] text-slate-400 dark:text-zinc-500 font-extrabold uppercase tracking-widest">
                    {stat.label}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-28 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-20 space-y-2">
            <h2 className="text-2xl md:text-4xl font-black font-mono uppercase tracking-tight text-slate-900 dark:text-white">
              Engineered for{" "}
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                Performance_
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-500 max-w-xl mx-auto font-mono font-bold uppercase tracking-wide">
              Everything required to elevate your mental compiled execution
              matrix.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="group border border-slate-200 dark:border-zinc-800/80 bg-white/80 dark:bg-slate-950/40 backdrop-blur-md rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:border-violet-500/30 hover:-translate-y-1 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-8 h-8 bg-gradient-to-br from-violet-500/5 to-transparent transition-opacity opacity-0 group-hover:opacity-100" />

                <CardHeader className="p-6 pb-2">
                  <div className="w-10 h-10 bg-slate-100 dark:bg-violet-500/10 rounded-xl flex items-center justify-center text-violet-600 dark:text-violet-400 border border-slate-200 dark:border-violet-500/20 mb-4 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-slate-900 dark:text-white text-sm font-mono font-extrabold tracking-wider uppercase group-hover:text-violet-600 dark:group-hover:text-violet-400 transition-colors">
                    {feature.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 pt-0">
                  <CardDescription className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed font-sans font-normal">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Levels Segment */}
      <section id="problems" className="py-24 relative">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-20 space-y-2">
            <h2 className="text-2xl md:text-4xl font-black font-mono uppercase tracking-tight text-slate-900 dark:text-white">
              Select Your{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-500 bg-clip-text text-transparent">
                Difficulty_
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-500 max-w-lg mx-auto font-mono font-bold uppercase tracking-wide">
              Scale cleanly across tiered execution spaces crafted from basic to
              masters logic.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
            {problemCategories.map((category, index) => (
              <Card
                key={index}
                className={`relative overflow-hidden rounded-2xl border-2 ${category.border} bg-gradient-to-br ${category.gradient} shadow-md ${category.glow} hover:scale-[1.03] transition-all duration-300 group`}
              >
                <div className="absolute inset-0 bg-[radial-gradient(#80808008_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

                <div className="flex flex-col h-full justify-between relative z-10">
                  <CardHeader className="p-6">
                    <div>
                      <Badge
                        variant="outline"
                        className={`inline-block text-[9px] font-mono font-extrabold tracking-widest px-2.5 py-1 rounded border mb-4 shadow-sm uppercase ${category.badgeBg}`}
                      >
                        {category.level}
                      </Badge>
                      <CardTitle className="text-slate-900 dark:text-white text-xl font-mono font-extrabold uppercase tracking-wider mt-1">
                        {category.title}
                      </CardTitle>
                    </div>
                  </CardHeader>

                  <CardContent className="p-6 pt-0 space-y-6 flex-grow">
                    <CardDescription className="text-slate-500 dark:text-zinc-400 text-xs leading-relaxed font-sans font-normal">
                      {category.description}
                    </CardDescription>

                    <div className="pt-4 border-t border-slate-200 dark:border-zinc-850/60 flex items-center justify-between font-mono">
                      <span
                        className={`font-extrabold text-xs tracking-wider uppercase ${category.text}`}
                      >
                        {category.count}
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-zinc-800 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
                        <ChevronRight className="w-4 h-4 text-slate-600 dark:text-zinc-400 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Terminal Call To Action */}
      <section className="py-20 max-w-6xl mx-auto px-4 mb-20">
        <div className="relative p-[1px] overflow-hidden rounded-3xl bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600 shadow-xl dark:shadow-indigo-500/10">
          <div className="relative overflow-hidden rounded-[23px] bg-white dark:bg-slate-950 p-8 md:p-16 text-center">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-500/5 to-transparent pointer-events-none" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-indigo-500/5 dark:bg-indigo-500/10 blur-[120px] rounded-full pointer-events-none" />

            <h2 className="text-2xl md:text-4xl font-black font-mono text-slate-900 dark:text-white uppercase tracking-tight mb-4 relative z-10">
              Ready to claim your ranking?
            </h2>
            <p className="text-[10px] md:text-xs text-slate-400 dark:text-zinc-500 mb-8 max-w-md mx-auto font-mono font-bold relative z-10 uppercase tracking-widest">
              Join thousands competing over premium algorithm puzzles daily.
            </p>

            <Link href="/problems" className="relative z-10 inline-block">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-600 hover:scale-105 active:scale-95 transition-all duration-300 text-white rounded-xl px-12 font-mono font-extrabold tracking-wider uppercase shadow-xl shadow-indigo-500/20 h-14 text-xs"
              >
                Access Platform Free
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
