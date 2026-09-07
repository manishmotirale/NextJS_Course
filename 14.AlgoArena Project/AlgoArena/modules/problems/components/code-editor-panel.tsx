"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Code, Send, Play, Copy, Check, RotateCcw } from "lucide-react";
import { useTheme } from "next-themes";
import { Editor } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  EDITOR_OPTIONS,
  getEditorLanguage,
  LANGUAGE_OPTIONS,
} from "../constant";

const CodeEditorPanel = ({
  code,
  onCodeChange,
  selectedLanguage,
  onLanguageChange,
  onRun,
  onSubmit,
  onReset,
  isRunning,
  isSubmitting,
}: any) => {
  const { theme } = useTheme();
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code ?? "");
      setCopied(true);
      toast.success("Code copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Failed to copy code");
    }
  };

  return (
    <Card className="rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white/80 dark:bg-slate-950/40 backdrop-blur-md shadow-sm overflow-hidden">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-zinc-900/60 bg-slate-50/50 dark:bg-zinc-900/10 select-none">
        <div className="flex items-center justify-between w-full">
          <CardTitle className="flex items-center gap-2 text-slate-800 dark:text-zinc-200">
            <Code className="size-4 stroke-[2.5] text-violet-500" />
            <span className="text-xs font-mono font-extrabold tracking-wider uppercase">
              Assembly Console_
            </span>
          </CardTitle>

          <div className="flex items-center gap-2">
            {/* Copy code */}
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              title="Copy code"
              className="h-9 w-9 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 hover:text-violet-500 rounded-lg shadow-sm transition-all"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500 stroke-[2.5]" />
              ) : (
                <Copy className="h-3.5 w-3.5 stroke-[2.5]" />
              )}
            </Button>

            {/* Reset to starter code */}
            <Button
              variant="outline"
              size="icon"
              onClick={onReset}
              title="Reset to starter code"
              className="h-9 w-9 border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 hover:text-amber-500 rounded-lg shadow-sm transition-all"
            >
              <RotateCcw className="h-3.5 w-3.5 stroke-[2.5]" />
            </Button>

            <Select value={selectedLanguage} onValueChange={onLanguageChange}>
              <SelectTrigger className="w-[130px] h-9 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-mono font-bold tracking-wider text-slate-600 dark:text-zinc-400 uppercase focus:ring-1 focus:ring-violet-500 shadow-sm rounded-lg">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-lg">
                {LANGUAGE_OPTIONS.map((lang) => (
                  <SelectItem
                    key={lang.value}
                    value={lang.value}
                    className="text-xs font-mono font-bold tracking-wider uppercase text-slate-700 dark:text-zinc-300 focus:bg-violet-500/5 dark:focus:bg-violet-500/10"
                  >
                    {lang.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="border border-slate-200/80 dark:border-zinc-800/80 rounded-xl overflow-hidden shadow-inner bg-[#1e1e1e]">
          <Editor
            height="380px"
            language={getEditorLanguage(selectedLanguage)}
            value={code}
            onChange={(value: any) => onCodeChange(value || "")}
            theme={theme === "dark" ? "vs-dark" : "light"}
            options={EDITOR_OPTIONS}
          />
        </div>

        <div className="flex items-center justify-end gap-3 mt-4 select-none">
          <Button
            onClick={onRun}
            disabled={isRunning || isSubmitting}
            variant="outline"
            className="h-10 px-4 border border-slate-200 dark:border-zinc-800/80 bg-white/80 dark:bg-slate-950/40 backdrop-blur-md rounded-xl text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-900/60 font-bold text-xs uppercase tracking-wider gap-2 shadow-sm transition-all disabled:opacity-40"
          >
            <Play
              className={cn(
                "h-3.5 w-3.5 stroke-[2.5]",
                isRunning && "animate-pulse",
              )}
            />
            {isRunning ? "Executing..." : "Run Code"}
          </Button>

          <Button
            onClick={onSubmit}
            disabled={isSubmitting || isRunning}
            className="h-10 px-5 rounded-xl font-bold text-xs uppercase tracking-wider gap-2 bg-violet-600 hover:bg-violet-700 dark:bg-violet-600 dark:hover:bg-violet-500 text-white shadow-md shadow-violet-500/10 active:scale-[0.98] transition-all disabled:opacity-40"
          >
            <Send className="h-3.5 w-3.5 stroke-[2.5]" />
            {isSubmitting ? "Transmitting..." : "Submit Vector"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CodeEditorPanel;
