import { onBoardUser } from "@/modules/auth/actions";
import NavBar from "@/modules/home/components/navbar";
import React from "react";

export const dynamic = "force-dynamic";

const Layout = async ({ children }) => {
  await onBoardUser();

  return (
    <main className="relative min-h-screen w-full overflow-x-hidden flex flex-col">
      <NavBar />
      
      {/* Dotted background. Uses bg-background rather than bg-white/dark:bg-slate-950,
          which hardcoded a #020617 dark surface that did not match the app's
          --background (#121212) and left a visible seam against panels. */}
      <div
        aria-hidden="true"
        className="bg-background pointer-events-none fixed inset-0 -z-10 h-full w-full bg-[radial-gradient(var(--border)_1px,transparent_1px)] [background-size:16px_16px]"
      />

      {/* Content wrapper offset by fixed Navbar height (h-20 = 80px) */}
      <div className="flex-1 w-full pt-20">{children}</div>
    </main>
  );
};

export default Layout;