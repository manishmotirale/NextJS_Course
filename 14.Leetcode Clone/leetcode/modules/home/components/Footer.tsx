"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Footer = () => {
  return (
    <footer className="border-t border-slate-200/80 dark:border-zinc-800/80 bg-white/40 dark:bg-slate-950/20 backdrop-blur-md transition-all relative z-10 select-none">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Branding Column */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-3">
              <Image
                src="/image.png"
                alt="AlgoArena Logo"
                width={36}
                height={36}
                className="rounded-lg border border-violet-500/20 shadow-sm"
              />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-violet-500 bg-clip-text text-xl font-extrabold tracking-wider text-transparent uppercase">
                AlgoArena
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-zinc-400 max-w-sm leading-relaxed font-sans font-normal">
              The ultimate competitive playground built to accelerate
              engineering syntax, scale production algorithms, and dominate
              global matrices.
            </p>
          </div>

          {/* Platform Resource Links */}
          <div className="space-y-3 font-mono">
            <h4 className="text-xs font-extrabold tracking-wider text-slate-900 dark:text-white uppercase">
              System Navigation
            </h4>
            <ul className="space-y-2.5 text-xs font-bold uppercase tracking-wider">
              <li>
                <Link
                  href="/problems"
                  className="text-slate-500 dark:text-zinc-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
                >
                  Problems Log
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-slate-500 dark:text-zinc-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
                >
                  System Core / About
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-slate-500 dark:text-zinc-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
                >
                  Connect Us
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-slate-500 dark:text-zinc-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
                >
                  User Analytics
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Network Nodes */}
          <div className="space-y-4 font-mono">
            <h4 className="text-xs font-extrabold tracking-wider text-slate-900 dark:text-white uppercase">
              Connect Terminal
            </h4>
            <div className="flex items-center gap-3">
              {/* GitHub */}
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-slate-950/40 hover:bg-violet-500/10 hover:text-violet-500 transition rounded-xl"
                asChild
              >
                <a
                  href="https://github.com/manishmotirale"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.94 0-1.1.39-1.99 1.03-2.69-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.7 1.03 1.6 1.03 2.69 0 3.84-2.34 4.68-4.57 4.93.36.31.68.92.68 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
                  </svg>
                </a>
              </Button>

              {/* Twitter / X */}
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-slate-950/40 hover:bg-violet-500/10 hover:text-violet-500 transition rounded-xl"
                asChild
              >
                <a
                  href="https://x.com/manishmotirale"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Twitter"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              </Button>

              {/* LinkedIn */}
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-slate-950/40 hover:bg-violet-500/10 hover:text-violet-500 transition rounded-xl"
                asChild
              >
                <a
                  href="https://www.linkedin.com/in/manish-motirale"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright and Terminal Diagnostic Info */}
        <div className="mt-12 pt-6 border-t border-slate-200/50 dark:border-zinc-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono font-bold tracking-wider text-slate-400 dark:text-zinc-500">
          <p>
            © {new Date().getFullYear()} ALGOARENA. ALL SYSTEM RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-2 text-[10px] uppercase bg-slate-100/50 dark:bg-zinc-900/40 border border-slate-200/60 dark:border-zinc-800/80 px-3 py-1 rounded-lg">
            <Terminal className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
            <span>EXEC_BUILD: COMPLETED</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
