import { Button } from "@/components/ui/button";
import { UserRole } from "@/lib/generated/prisma/enums";
import { getCurrentUserData } from "@/modules/auth/actions";
import { getProblemById } from "@/modules/problems/actions";
import { ArrowLeft } from "lucide-react";
import { redirect, notFound } from "next/navigation";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ModeToggle } from "@/components/modetoggler";
import { CreateProblemForm } from "@/modules/problems/components/create-problem-form";

/** Maps a DB problem record into the shape the create/edit form expects. */
function toFormValues(p: any) {
  const emptyLang = { input: "", output: "", explanation: "" };
  return {
    title: p.title ?? "",
    description: p.description ?? "",
    difficulty: p.difficulty ?? undefined,
    constraints: p.constraints ?? "",
    hints: p.hints ?? "",
    editorial: p.editorial ?? "",
    tags: Array.isArray(p.tags) && p.tags.length
      ? p.tags.map((t: string) => ({ value: t }))
      : [{ value: "" }],
    testCases: Array.isArray(p.testCases) && p.testCases.length
      ? p.testCases
      : [{ input: "", output: "" }],
    examples: {
      JAVASCRIPT: p.examples?.JAVASCRIPT ?? emptyLang,
      PYTHON: p.examples?.PYTHON ?? emptyLang,
      CPP: p.examples?.CPP ?? emptyLang,
    },
    codeSnippets: {
      JAVASCRIPT: p.codeSnippets?.JAVASCRIPT ?? "",
      PYTHON: p.codeSnippets?.PYTHON ?? "",
      CPP: p.codeSnippets?.CPP ?? "",
    },
    // DB column is `referenceSolution` (singular); form uses `referenceSolutions`
    referenceSolutions: {
      JAVASCRIPT: p.referenceSolution?.JAVASCRIPT ?? "",
      PYTHON: p.referenceSolution?.PYTHON ?? "",
      CPP: p.referenceSolution?.CPP ?? "",
    },
    skipValidation: false,
  };
}

const EditProblemPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const user = await getCurrentUserData();
  if (!user || "error" in user || user.role !== UserRole.ADMIN) {
    redirect("/");
  }

  const { data: problem } = await getProblemById(id);
  if (!problem) {
    notFound();
  }

  const initialData = toFormValues(problem);

  return (
    <div className="min-h-screen text-slate-900 dark:text-zinc-100 transition-colors mt-12 mb-16 relative overflow-hidden">
      {/* Background Creative Tech Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-blue-500/5 via-indigo-500/5 to-purple-500/5 dark:from-blue-600/10 dark:via-indigo-600/15 dark:to-purple-600/10 blur-[140px] rounded-full pointer-events-none -z-10" />

      <section className="container mx-auto max-w-5xl px-4 flex flex-col items-center justify-center space-y-10 relative z-10">
        {/* Header Action Control Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center w-full pb-6 gap-4 border-b border-slate-200/60 dark:border-zinc-800/60">
          <div className="flex items-center gap-4 shrink-0">
            <Link href="/problems">
              <Button
                variant="outline"
                size="icon"
                className="border border-slate-200 dark:border-zinc-800/80 bg-white/80 dark:bg-slate-950/40 backdrop-blur-md rounded-xl text-slate-700 dark:text-zinc-300 hover:bg-violet-500/5 dark:hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 transition-all duration-200 h-11 w-11 shadow-sm"
              >
                <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
              </Button>
            </Link>

            <Link href="/" className="flex items-center gap-3 group">
              <Image
                src="/image.png"
                alt="AlgoArena Logo"
                width={42}
                height={42}
                className="rounded-xl border border-violet-500/10 dark:border-violet-500/20 shadow-sm transition-transform duration-200 group-hover:scale-105"
              />

              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-400 dark:to-violet-500 bg-clip-text text-2xl font-extrabold tracking-wider text-transparent uppercase transition-opacity group-hover:opacity-90">
                AlgoArena
              </span>
            </Link>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
            <h1 className="text-xl md:text-2xl font-extrabold tracking-wider uppercase text-slate-900 dark:text-white leading-tight text-right flex-1 sm:flex-initial">
              Editing{" "}
              <span className="bg-gradient-to-r from-violet-600 to-pink-600 dark:from-violet-400 dark:to-pink-400 bg-clip-text text-transparent block md:inline">
                {problem.title}
              </span>
            </h1>

            <div className="w-11 h-11 flex items-center justify-center shrink-0">
              <ModeToggle />
            </div>
          </div>
        </div>

        {/* Edit Form Workspace */}
        <div className="w-full">
          <CreateProblemForm problemId={id} initialData={initialData} />
        </div>
      </section>
    </div>
  );
};

export default EditProblemPage;
