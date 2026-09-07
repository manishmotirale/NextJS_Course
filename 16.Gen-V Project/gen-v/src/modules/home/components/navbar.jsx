"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full border-b border-border/50 bg-background/85 backdrop-blur-lg transition-all duration-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10 h-20 flex justify-between items-center">
        
        {/* Brand / Logo Section (Only Logo) */}
        <Link
          href="/"
          className="flex items-center group transition-opacity hover:opacity-90"
        >
          <div className="relative overflow-hidden rounded-2xl p-1 bg-gradient-to-tr from-primary/20 via-primary/10 to-transparent border border-border/60 shadow-sm transition-all duration-300 group-hover:border-primary/50 group-hover:scale-105">
            <Image
              src="/logo.png"
              alt="Gen-V Logo"
              width={54}
              height={54}
              className="shrink-0 invert dark:invert-0 object-contain"
            />
          </div>
        </Link>

        {/* Action Controls & Auth */}
        <div className="flex items-center gap-4">
          
          {/* Theme Toggler */}
          <ThemeToggle />

          <div className="h-6 w-[1px] bg-border/80 mx-1 hidden sm:block" />

          {/* Signed Out State */}
          <SignedOut>
            <div className="flex items-center gap-3">
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-base font-semibold text-muted-foreground hover:text-foreground hover:bg-accent/60 px-5 transition-colors"
                >
                  Sign In
                </Button>
              </SignInButton>

              <SignUpButton mode="modal">
                <Button
                  size="lg"
                  className="text-base font-semibold shadow-md transition-all duration-200 hover:shadow-lg hover:opacity-95 px-6 bg-primary text-primary-foreground"
                >
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          </SignedOut>

          {/* Signed In State */}
          <SignedIn>
            <div className="flex items-center gap-3">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox:
                      "w-11 h-11 border-2 border-border/80 shadow-sm hover:scale-105 transition-transform rounded-full",
                  },
                }}
              />
            </div>
          </SignedIn>
        </div>

      </div>
    </header>
  );
};

export default Navbar;