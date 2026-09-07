"use client";

import { useTheme } from "next-themes";
import { Editor } from "@monaco-editor/react";
import { Terminal } from "lucide-react";

// Robust mapping supporting common casing variations to prevent rendering crashes
const LANGUAGE_MAP = {
  cpp: "cpp",
  "c++": "cpp",
  javascript: "javascript",
  js: "javascript",
  python: "python",
  py: "python",
} as const;

type LanguageKey = keyof typeof LANGUAGE_MAP;

interface CodeEditorProps {
  value: string;
  onChange: (value?: string) => void;
  language?: string;
}

export function CodeEditor({
  value,
  onChange,
  language = "javascript",
}: CodeEditorProps) {
  const { resolvedTheme } = useTheme();

  // Normalize key lookup safely
  const normalizedLang =
    language.toLowerCase() in LANGUAGE_MAP
      ? (language.toLowerCase() as LanguageKey)
      : "javascript";

  // Calculate dynamic editor theme based on ModeToggler state
  const editorTheme = resolvedTheme === "light" ? "vs-light" : "vs-dark";

  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-white dark:bg-slate-950 shadow-md transition-colors duration-300">
      {/* Editor Header Bar matching AlgoArena Aesthetic */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-100 dark:bg-slate-900 border-b border-slate-200 dark:border-zinc-800/80 select-none">
        <div className="flex items-center gap-2 text-[10px] font-extrabold tracking-wider text-slate-600 dark:text-zinc-400 uppercase">
          <Terminal className="w-3.5 h-3.5 text-violet-600 dark:text-violet-400" />
          source_manifest.{LANGUAGE_MAP[normalizedLang]}
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500/40" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
        </div>
      </div>

      {/* Editor Main Canvas Wrapper */}
      <div className="h-[300px] w-full pt-2 bg-white dark:bg-[#1e1e1e]">
        <Editor
          height="100%"
          width="100%"
          defaultLanguage={LANGUAGE_MAP[normalizedLang]}
          theme={editorTheme} // Dynamically switches Monaco editor palette context
          value={value}
          onChange={onChange}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            readOnly: false,
            wordWrap: "on",
            formatOnPaste: true,
            formatOnType: true,
            automaticLayout: true,
            fontFamily: "var(--font-mono), monospace",
            cursorBlinking: "smooth",
            cursorSmoothCaretAnimation: "on",
            padding: { top: 8, bottom: 8 },
            scrollbar: {
              vertical: "visible",
              horizontal: "visible",
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8,
            },
          }}
        />
      </div>
    </div>
  );
}
