import Image from "next/image";
import { Button } from "@/components/ui/button";
import { connectDB } from "@/lib/db";
import { CheckCircle } from "lucide-react";
import TodoForm from "@/components/todoform";
import TodoList from "@/components/todolist";

export default async function Home() {
  await connectDB();

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-slate-100 to-slate-200 p-6 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950 sm:p-12 md:p-24">
      <main className="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60 sm:p-8">
        {/* Header */}
        <header className="mb-8 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900/30">
              <CheckCircle
                size={26}
                className="text-blue-600 dark:text-blue-400"
              />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
              TaskForge
            </h1>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-400">
            Organize your daily tasks and forge a better version of your day.
          </p>
        </header>

        {/* Optional subtle hero image usage */}
        <div className="mb-6 flex justify-center">
          <Image
            src="/todo.png"
            alt="Task illustration"
            width={600}
            height={600}
            className="opacity-80 dark:opacity-60"
          />
        </div>

        {/* Form + List */}
        <section className="space-y-6">
          <TodoForm />
          <TodoList />
        </section>

        {/* Footer */}
        <footer className="mt-8 flex flex-col items-center gap-3 text-center">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Powered by Next.js • MongoDB • TanStack Query
          </p>

          {/* You actually use Button now */}
          <Button variant="outline" className="text-xs">
            Stay Productive 🚀
          </Button>
        </footer>
      </main>
    </div>
  );
}
