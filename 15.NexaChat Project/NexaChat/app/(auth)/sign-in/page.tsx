"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import React from "react";

const SignInPage = () => {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center bg-background px-4 font-sans antialiased selection:bg-blue-500/30 overflow-hidden">
      {/* Subtle background brand glows */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/5 blur-[150px] rounded-full pointer-events-none" />

      {/* Top Left Global Branding Layer */}
      <div className="absolute top-6 left-6 z-50 flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="NexaChat Icon"
          width={56}
          height={56}
          className="rounded-full object-contain drop-shadow-sm hover:scale-105 transition-transform duration-300"
          priority
        />
        <div className="relative transform translate-y-0.5">
          <Image
            src="/nexachat.png"
            alt="NexaChat Text Logo"
            width={140}
            height={50}
            className="object-contain dark:brightness-0 dark:invert"
            priority
          />
        </div>
      </div>

      {/* Main Authentication Container Card */}
      <div className="relative z-10 w-full max-w-xl mx-auto border border-border bg-card text-card-foreground rounded-3xl p-8 md:p-12 shadow-xl shadow-foreground/5 flex flex-col justify-between min-h-[440px]">
        {/* Content Area */}
        <div className="space-y-8 my-auto">
          <div className="space-y-3">
            {/* Clean Tailwind Text Brand Alignment */}
            <h1 className="text-3xl font-black tracking-tight text-foreground md:text-4xl leading-tight">
              Welcome back to{" "}
              <span className="inline-block tracking-tighter">
                Nexa
                <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-violet-500 bg-clip-text text-transparent">
                  Chat
                </span>
              </span>
            </h1>

            <p className="text-sm text-muted-foreground leading-relaxed max-w-md pt-1">
              Sign in below to restore your conversations. We&apos;ll increase
              your message limits if you do 😉
            </p>
          </div>

          <div className="space-y-4">
            <Button
              variant="default"
              className="w-full h-16 gap-4 text-base font-bold tracking-wide transition-all duration-200 shadow-md active:scale-[0.99] bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer rounded-2xl px-8 flex flex-row justify-center items-center"
              onClick={() =>
                authClient.signIn.social({
                  provider: "github",
                  callbackURL: "/",
                })
              }
            >
              <Image
                src="/github.svg"
                alt="GitHub Logo"
                width={28}
                height={28}
                className="object-contain shrink-0 dark:brightness-0 dark:invert"
              />
              <span className="font-bold">Sign in with GitHub</span>
            </Button>
          </div>
        </div>

        {/* Footer info text */}
        <div className="text-xs text-muted-foreground/60 text-center pt-6 border-t border-border mt-6">
          By continuing, you agree to NexaChat&apos;s Terms of Service and
          Privacy Policy.
        </div>
      </div>
    </section>
  );
};

export default SignInPage;
