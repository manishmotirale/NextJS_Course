// components/header.tsx
import React from "react";
import { ModeToggle } from "./mode-toggle";
import { Sparkles } from "lucide-react";

const Header = () => {
  return (
    <header className="flex h-14 items-center justify-between border-b border-border/40 bg-background/60 backdrop-blur-xl px-4 py-2 sticky top-0 z-40">
      <div className="flex items-center gap-2">
        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Sparkles className="h-3.5 w-3.5" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Workspace
        </span>
      </div>
      <div className="flex items-center gap-2">
        <ModeToggle />
      </div>
    </header>
  );
};

export default Header;
