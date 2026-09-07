import Image from "next/image";

const Loading = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-screen w-full flex-col items-center justify-center gap-6 p-6"
    >
      {/* Soft glow so the loader does not read as a bare spinner on a blank page. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[420px] bg-[radial-gradient(ellipse_55%_45%_at_50%_0%,theme(colors.emerald.500/10),transparent)]"
      />

      <div className="relative flex size-24 items-center justify-center">
        {/* Two offset rings read as a pulse radiating out from the mark. */}
        <span className="border-primary/40 absolute inset-0 animate-ping rounded-2xl border-2 [animation-duration:1.8s]" />
        <span className="border-primary/25 absolute inset-3 animate-ping rounded-xl border [animation-duration:1.8s] [animation-delay:600ms]" />

        <span className="bg-card ring-border relative flex size-16 items-center justify-center rounded-2xl shadow-sm ring-1">
          <Image
            src="/logo.png"
            width={34}
            height={34}
            alt=""
            priority
            className="animate-pulse invert dark:invert-0"
          />
        </span>
      </div>

      <div className="flex flex-col items-center gap-3">
        <p className="text-shimmer text-base font-medium">Loading Gen-V</p>

        {/* Indeterminate on purpose: there is no real progress figure to report,
            and a fake percentage would be misleading. */}
        <div className="bg-muted h-1 w-44 overflow-hidden rounded-full">
          <div className="bg-primary animate-indeterminate h-full w-1/3 rounded-full" />
        </div>

        <p className="text-muted-foreground text-xs">
          Preparing your workspace
        </p>
      </div>
    </div>
  );
};

export default Loading;
