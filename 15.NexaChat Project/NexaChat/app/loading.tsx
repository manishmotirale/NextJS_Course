// app/loading.tsx
"use client";

import { Sparkles } from "lucide-react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Logo */}
        <div className="relative">
          {/* Outer spinning ring */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-24 w-24 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
          </div>
          
          {/* Logo */}
          <div className="relative flex h-24 w-24 items-center justify-center">
            <div className="relative h-16 w-16 animate-pulse">
              <Image
                src="/nexachat.png"
                alt="NexaChat"
                fill
                className="object-contain filter invert brightness-200"
                priority
              />
            </div>
          </div>
        </div>

        {/* Loading Text */}
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary animate-pulse" />
            NexaChat
          </h2>
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">Loading</span>
            <div className="flex gap-1">
              <span className="animate-bounce animation-delay-0">.</span>
              <span className="animate-bounce animation-delay-200">.</span>
              <span className="animate-bounce animation-delay-400">.</span>
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-48 h-1 bg-muted rounded-full overflow-hidden">
          <div className="h-full bg-primary rounded-full animate-progress" />
        </div>
      </div>
    </div>
  );
}
