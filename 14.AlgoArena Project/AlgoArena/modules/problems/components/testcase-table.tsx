import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, AlertTriangle, Cpu } from "lucide-react";

export const TestCaseTable = ({ testCases = [] }: any) => {
  return (
    <div className="w-full rounded-xl border border-slate-200/80 dark:border-zinc-800/80 bg-white dark:bg-zinc-950 overflow-hidden shadow-sm">
      <Table>
        <TableHeader className="bg-slate-50/70 dark:bg-zinc-900/30 select-none">
          <TableRow className="hover:bg-transparent border-b border-slate-100 dark:border-zinc-900">
            <TableHead className="w-[90px] font-mono text-[11px] uppercase font-bold tracking-wider">Vector</TableHead>
            <TableHead className="font-mono text-[11px] uppercase font-bold tracking-wider">Status</TableHead>
            <TableHead className="font-mono text-[11px] uppercase font-bold tracking-wider">Memory</TableHead>
            <TableHead className="font-mono text-[11px] uppercase font-bold tracking-wider">Time</TableHead>
            <TableHead className="font-mono text-[11px] uppercase font-bold tracking-wider">Your Output</TableHead>
            <TableHead className="font-mono text-[11px] uppercase font-bold tracking-wider">Expected</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {testCases.map((testCase: any, index: number) => {
            // Determine what to show in the output cell
            const compileErr  = testCase.compileOutput || testCase.compile_output;
            const runtimeErr  = testCase.stderr;
            const hasOutput   = testCase.stdout && testCase.stdout.trim().length > 0;

            let outputDisplay: React.ReactNode;
            if (hasOutput) {
              outputDisplay = (
                <span className="text-violet-600 dark:text-violet-400 font-mono text-xs">
                  {testCase.stdout}
                </span>
              );
            } else if (compileErr) {
              outputDisplay = (
                <span className="text-amber-600 dark:text-amber-400 font-mono text-[10px] leading-tight">
                  Compile Error: {String(compileErr).slice(0, 60)}…
                </span>
              );
            } else if (runtimeErr) {
              outputDisplay = (
                <span className="text-rose-600 dark:text-rose-400 font-mono text-[10px] leading-tight">
                  Runtime Error: {String(runtimeErr).slice(0, 60)}…
                </span>
              );
            } else {
              outputDisplay = (
                <span className="text-slate-400 dark:text-zinc-600 font-mono text-xs italic">
                  ∅ no output
                </span>
              );
            }

            return (
              <TableRow
                key={testCase.id || index}
                className="border-b border-slate-100 dark:border-zinc-900/60 hover:bg-slate-50/30 dark:hover:bg-zinc-900/10"
              >
                <TableCell className="font-mono text-xs font-bold text-muted-foreground">
                  #{String(index + 1).padStart(2, "0")}
                </TableCell>

                <TableCell>
                  {testCase.passed ? (
                    <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10 rounded-md font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                      <Check className="mr-1 size-3 stroke-[3]" /> Passed
                    </Badge>
                  ) : (
                    <Badge className="bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/10 rounded-md font-mono text-[10px] font-bold uppercase tracking-wider px-2 py-0.5">
                      <AlertTriangle className="mr-1 size-3" />
                      {compileErr ? "Compile Err" : runtimeErr ? "Runtime Err" : "Wrong Ans"}
                    </Badge>
                  )}
                </TableCell>

                <TableCell className="font-mono text-xs tracking-tight text-slate-600 dark:text-zinc-400">
                  {testCase.memory || "N/A"}
                </TableCell>

                <TableCell className="font-mono text-xs tracking-tight text-slate-600 dark:text-zinc-400">
                  {testCase.time || "N/A"}
                </TableCell>

                <TableCell className="max-w-[200px] font-mono text-xs bg-slate-50 dark:bg-zinc-900/40 px-2 py-1.5 border border-slate-100/70 dark:border-zinc-900/40 rounded-md">
                  {outputDisplay}
                </TableCell>

                <TableCell className="max-w-[180px] truncate font-mono text-xs text-slate-600 dark:text-zinc-400 px-2 py-1">
                  {testCase.expected || "∅"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};