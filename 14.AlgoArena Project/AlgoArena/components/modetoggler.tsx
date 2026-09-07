"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-500/20 bg-slate-900/80 backdrop-blur-md" />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="group flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-500/20 bg-slate-900/80 text-zinc-200 backdrop-blur-md transition-all duration-300 hover:border-violet-400 hover:bg-violet-500/10 hover:shadow-lg hover:shadow-violet-500/20 active:scale-95"
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-yellow-400 transition-transform duration-300 group-hover:rotate-180" />
      ) : (
        <Moon className="h-5 w-5 text-violet-400 transition-transform duration-300 group-hover:-rotate-12" />
      )}
    </button>
  );
}
