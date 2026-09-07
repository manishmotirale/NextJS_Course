export function ConstraintsSection({ constraints }: any) {
  if (!constraints) return null;

  return (
    <div className="space-y-2 font-mono">
      <h3 className="text-xs font-extrabold tracking-widest text-slate-400 dark:text-zinc-500 uppercase">
        Boundaries & Constraints:
      </h3>
      <div className="bg-slate-50/50 dark:bg-zinc-900/30 border border-slate-100 dark:border-zinc-900 p-4 rounded-xl">
        <pre className="text-xs text-slate-500 dark:text-zinc-400 whitespace-pre-wrap leading-relaxed font-mono">
          {constraints}
        </pre>
      </div>
    </div>
  );
}
