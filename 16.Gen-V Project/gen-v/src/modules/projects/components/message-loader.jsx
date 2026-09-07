import Image from "next/image";
import React from "react";
import { useState, useEffect } from "react";

/**
 * Ordered roughly to match what the agent is actually doing: reading the
 * scaffold, writing components, then wiring the page together. Vague words like
 * "loading..." made the wait feel longer than it is.
 */
const messages = [
  "Reading your request...",
  "Planning the component structure...",
  "Setting up the sandbox...",
  "Choosing the right shadcn components...",
  "Writing the layout...",
  "Building the components...",
  "Wiring up state and interactions...",
  "Styling with Tailwind...",
  "Compiling the preview...",
  "Almost there, final touches...",
];

const ShimmerMessages = () => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      // Hold on the last message instead of looping back to the start, which
      // made long runs look like they had restarted.
      setCurrentMessageIndex((prevIndex) =>
        prevIndex >= messages.length - 1 ? prevIndex : prevIndex + 1,
      );
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <span className="animate-pulse bg-gradient-to-r from-muted-foreground via-foreground to-muted-foreground bg-[length:200%_100%] bg-clip-text text-sm text-transparent">
        {messages[currentMessageIndex]}
      </span>
    </div>
  );
};

const MessageLoading = () => {
  return (
    <div className="group flex flex-col px-2 pb-4">
      <div className="mb-2 flex items-center gap-2 pl-2">
        <Image
          src={"/logo.png"}
          alt="Gen-V"
          width={28}
          height={28}
          className="shrink-0 invert dark:invert-0"
        />
        <span className="text-sm font-medium">Gen-V</span>
      </div>

      <div className="flex flex-col gap-y-3 pl-8.5">
        <ShimmerMessages />

        {/* Skeleton lines hint that real content is coming. */}
        {/* muted-foreground/20 rather than bg-muted: --muted (#ededed) is almost
            the same as the light background, so the bars were invisible. */}
        <div className="space-y-2">
          <div className="bg-muted-foreground/20 h-2.5 w-3/5 animate-pulse rounded-full" />
          <div className="bg-muted-foreground/20 h-2.5 w-4/5 animate-pulse rounded-full [animation-delay:150ms]" />
          <div className="bg-muted-foreground/20 h-2.5 w-2/5 animate-pulse rounded-full [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
};

export default MessageLoading;
