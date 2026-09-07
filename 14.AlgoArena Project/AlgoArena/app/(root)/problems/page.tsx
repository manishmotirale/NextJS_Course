import { getCurrentUserData } from "@/modules/auth/actions";
import { getAllProblems, getProblemOfTheDay } from "@/modules/problems/actions";
import ProblemsTable from "@/modules/problems/components/problems-table";
import { Terminal } from "lucide-react";

const ProblemPage = async () => {
  const user = await getCurrentUserData();
  const { data: problems, error } = await getAllProblems();
  const { data: dailyProblem } = await getProblemOfTheDay();

  if (error) {
    return (
      <div className="min-h-[80vh] w-full flex flex-col items-center justify-center px-4 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-red-600/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex flex-col items-center gap-4 relative z-10 text-center">
          <div className="w-12 h-12 rounded-xl border border-red-500/20 bg-red-500/5 flex items-center justify-center text-red-500 shadow-sm animate-pulse">
            <Terminal className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold tracking-wider text-red-500 uppercase font-mono">
              Database Sync Interrupted
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-sm">
              {error ||
                "An unexpected error occurred while executing data retrieval."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-slate-900 dark:text-zinc-100 transition-colors pt-30 pb-16 relative overflow-hidden">
      {/* Background Creative Tech Glow Matrix */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 dark:from-blue-600/10 dark:via-indigo-600/10 dark:to-purple-600/10 blur-[150px] rounded-full pointer-events-none -z-10" />

      {/* Main Table Content Container */}
      <section className="relative z-10">
        <ProblemsTable
          problems={problems}
          user={user}
          dailyProblemId={dailyProblem?.id}
        />
      </section>
    </div>
  );
};

export default ProblemPage;
