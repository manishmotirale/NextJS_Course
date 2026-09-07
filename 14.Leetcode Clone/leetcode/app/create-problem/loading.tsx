import { Terminal } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-[80vh] w-full flex flex-col items-center justify-center px-4 relative">
      {/* Background Creative Tech Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none" />

      <div className="flex flex-col items-center gap-4 relative z-10 select-none">
        {/* Glowing Matrix Spinner */}
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-xl border-2 border-t-violet-500 border-r-transparent border-b-indigo-500 border-l-transparent animate-spin duration-700" />
          <div className="absolute inset-2 rounded-lg border border-b-blue-500 border-t-transparent border-r-cyan-500 border-l-transparent animate-spin duration-1000 reverse" />
          <Terminal className="w-5 h-5 text-violet-400 animate-pulse" />
        </div>

        {/* Text Loader */}
        <div className="text-center space-y-1">
          <h3 className="text-sm font-extrabold tracking-wider text-slate-900 dark:text-white uppercase">
            Initializing Form Matrix
          </h3>
          <p className="text-[10px] font-mono text-slate-400 dark:text-zinc-500 uppercase tracking-widest animate-pulse">
            fetching_admin_permissions...
          </p>
        </div>
      </div>
    </div>
  );
}
