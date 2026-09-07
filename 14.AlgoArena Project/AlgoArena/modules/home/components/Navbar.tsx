"use client";

import { UserRole } from "@/lib/generated/prisma/enums";
import Image from "next/image";
import Link from "next/link";
import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { Menu } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/modetoggler";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface NavbarProps {
  userRole?: any;
}

export const Navbar = ({ userRole }: NavbarProps) => {
  return (
    <nav className="fixed top-4 left-1/2 z-50 w-full max-w-6xl -translate-x-1/2 px-4 select-none">
      <div className="overflow-hidden rounded-2xl border border-slate-200/80 dark:border-zinc-800/80 bg-white/80 dark:bg-slate-950/40 backdrop-blur-md shadow-md transition-all duration-300">
        <div className="flex h-16 items-center justify-between px-6">
          {/* ---------------- Logo ---------------- */}
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <Image
              src="/image.png"
              alt="AlgoArena Logo"
              width={34}
              height={34}
              className="rounded-lg"
            />
            <span className="text-lg font-black font-mono tracking-widest text-slate-900 dark:text-zinc-50 uppercase">
              AlgoArena_
            </span>
          </Link>

          {/* ---------------- Desktop Links ---------------- */}
          <div className="hidden lg:flex items-center gap-8 font-mono text-xs font-bold tracking-wider uppercase">
            <Link
              href="/problems"
              className="text-slate-500 dark:text-zinc-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
            >
              Problems
            </Link>

            <Link
              href="/about"
              className="text-slate-500 dark:text-zinc-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
            >
              About
            </Link>

            <Link
              href="/contact"
              className="text-slate-500 dark:text-zinc-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
            >
              Connect
            </Link>

            <Link
              href="/profile"
              className="text-slate-500 dark:text-zinc-400 hover:text-violet-500 dark:hover:text-violet-400 transition-colors"
            >
              Profile
            </Link>
          </div>

          {/* ---------------- Right Side Controls ---------------- */}
          <div className="hidden lg:flex items-center gap-3">
            <ModeToggle />

            <Show when="signed-in">
              {userRole === UserRole.ADMIN && (
                <Link href="/create-problem">
                  <Button
                    variant="outline"
                    className="h-9 px-4 border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-slate-950/45 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900/60 font-bold tracking-wider text-xs uppercase rounded-xl transition-all"
                  >
                    Create Problem
                  </Button>
                </Link>
              )}

              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9 ring-2 ring-violet-500/20",
                  },
                }}
              />
            </Show>

            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className="text-slate-600 dark:text-zinc-400 hover:text-violet-500 font-bold text-xs uppercase tracking-wider h-9"
                >
                  Sign In
                </Button>
              </SignInButton>

              <SignUpButton mode="modal">
                <Button className="h-9 px-4 rounded-xl font-bold text-xs uppercase tracking-wider bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 text-white shadow-md shadow-violet-500/10 active:scale-[0.98] transition-all">
                  Sign Up
                </Button>
              </SignUpButton>
            </Show>
          </div>

          {/* ---------------- Mobile Menu ---------------- */}
          <div className="flex items-center gap-3 lg:hidden">
            <ModeToggle />

            <Show when="signed-in">
              <UserButton />
            </Show>

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-xl border border-slate-200 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900/60"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>

              <SheetContent
                side="right"
                className="w-[300px] border-l border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 p-0 backdrop-blur-md font-mono"
              >
                {/* Header */}
                <div className="border-b border-slate-100 dark:border-zinc-900 px-6 py-5 select-none">
                  <div className="flex items-center gap-3">
                    <Image
                      src="/image.png"
                      alt="AlgoArena"
                      width={38}
                      height={38}
                      className="rounded-lg"
                    />
                    <div>
                      <h2 className="text-lg font-black text-slate-900 dark:text-zinc-50 uppercase tracking-widest">
                        AlgoArena_
                      </h2>
                      <p className="text-[9px] font-bold tracking-wider text-slate-400 dark:text-zinc-500 uppercase mt-0.5">
                        Code • Solve • Conquer
                      </p>
                    </div>
                  </div>
                </div>

                {/* Navigation Links */}
                <div className="space-y-1 p-4 text-xs font-bold uppercase tracking-wider">
                  <Link
                    href="/"
                    className="flex items-center rounded-xl px-4 py-3 text-slate-500 dark:text-zinc-400 transition hover:bg-slate-50 dark:hover:bg-zinc-900/40 hover:text-violet-500 dark:hover:text-violet-400"
                  >
                    Home
                  </Link>

                  <Link
                    href="/problems"
                    className="flex items-center rounded-xl px-4 py-3 text-slate-500 dark:text-zinc-400 transition hover:bg-slate-50 dark:hover:bg-zinc-900/40 hover:text-violet-500 dark:hover:text-violet-400"
                  >
                    Problems
                  </Link>

                  <Link
                    href="/about"
                    className="flex items-center rounded-xl px-4 py-3 text-slate-500 dark:text-zinc-400 transition hover:bg-slate-50 dark:hover:bg-zinc-900/40 hover:text-violet-500 dark:hover:text-violet-400"
                  >
                    About
                  </Link>

                  <Link
                    href="/contact"
                    className="flex items-center rounded-xl px-4 py-3 text-slate-500 dark:text-zinc-400 transition hover:bg-slate-50 dark:hover:bg-zinc-900/40 hover:text-violet-500 dark:hover:text-violet-400"
                  >
                    Connect
                  </Link>

                  <Link
                    href="/profile"
                    className="flex items-center rounded-xl px-4 py-3 text-slate-500 dark:text-zinc-400 transition hover:bg-slate-50 dark:hover:bg-zinc-900/40 hover:text-violet-500 dark:hover:text-violet-400"
                  >
                    Profile
                  </Link>

                  <div className="my-4 border-t border-slate-100 dark:border-zinc-900" />

                  <Show when="signed-in">
                    {userRole === UserRole.ADMIN && (
                      <Link href="/create-problem" className="block pt-1">
                        <Button className="w-full rounded-xl bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 text-white font-bold uppercase tracking-wider h-10 text-xs">
                          Create Problem
                        </Button>
                      </Link>
                    )}
                  </Show>

                  <Show when="signed-out">
                    <div className="space-y-2.5 pt-1">
                      <SignInButton mode="modal">
                        <Button
                          variant="outline"
                          className="w-full border-slate-200 dark:border-zinc-800/80 font-bold uppercase tracking-wider text-slate-600 dark:text-zinc-400 h-10 text-xs hover:bg-slate-50 dark:hover:bg-zinc-900/30 rounded-xl"
                        >
                          Sign In
                        </Button>
                      </SignInButton>

                      <SignUpButton mode="modal">
                        <Button className="w-full rounded-xl bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 text-white font-bold uppercase tracking-wider h-10 text-xs">
                          Sign Up
                        </Button>
                      </SignUpButton>
                    </div>
                  </Show>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};
