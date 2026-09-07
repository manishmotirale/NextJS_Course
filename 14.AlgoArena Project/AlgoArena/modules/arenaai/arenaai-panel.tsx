"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Bot,
  Send,
  X,
  Sparkles,
  User,
  Copy,
  Check,
  Trash2,
  BookOpen,
  Lightbulb,
  Bug,
  ScrollText,
  Gauge,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

type ActionKey =
  | "explain"
  | "hint"
  | "debug"
  | "explain_code"
  | "complexity"
  | "optimize";

const ACTIONS: {
  key: ActionKey;
  label: string;
  icon: React.ElementType;
  display: string;
  needsCode?: boolean;
}[] = [
  { key: "explain", label: "Explain Problem", icon: BookOpen, display: "Explain this problem" },
  { key: "hint", label: "Give Me a Hint", icon: Lightbulb, display: "Give me a hint" },
  { key: "debug", label: "Debug My Code", icon: Bug, display: "Debug my code", needsCode: true },
  { key: "explain_code", label: "Explain My Code", icon: ScrollText, display: "Explain my code", needsCode: true },
  { key: "complexity", label: "Analyze Complexity", icon: Gauge, display: "Analyze complexity", needsCode: true },
  { key: "optimize", label: "Optimize Solution", icon: Zap, display: "Optimize my solution", needsCode: true },
];

/** Splits assistant text into plain-text and fenced code-block segments. */
function parseSegments(text: string) {
  const segments: { type: "text" | "code"; lang?: string; content: string }[] = [];
  const regex = /```(\w+)?\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex)
      segments.push({ type: "text", content: text.slice(lastIndex, match.index) });
    segments.push({ type: "code", lang: match[1], content: match[2].replace(/\n$/, "") });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length)
    segments.push({ type: "text", content: text.slice(lastIndex) });
  return segments;
}

function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**"))
      return <strong key={`${keyPrefix}-${i}`} className="font-bold">{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`"))
      return (
        <code key={`${keyPrefix}-${i}`} className="px-1 py-0.5 rounded bg-slate-200/60 dark:bg-zinc-800 text-[11px] font-mono text-violet-600 dark:text-violet-400">
          {part.slice(1, -1)}
        </code>
      );
    return <span key={`${keyPrefix}-${i}`}>{part}</span>;
  });
}

function CodeBlock({ code, lang }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="relative my-2 rounded-lg overflow-hidden border border-slate-200 dark:border-zinc-800">
      <div className="flex items-center justify-between px-3 py-1 bg-slate-100 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
        <span className="text-[9px] font-mono font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500">
          {lang || "code"}
        </span>
        <button onClick={copy} className="text-slate-400 hover:text-violet-500 transition-colors" title="Copy code">
          {copied ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
        </button>
      </div>
      <pre className="p-3 overflow-x-auto bg-slate-50 dark:bg-zinc-950 text-[11px] leading-relaxed">
        <code className="font-mono text-slate-800 dark:text-zinc-200">{code}</code>
      </pre>
    </div>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex gap-2.5", isUser ? "flex-row-reverse" : "flex-row")}>
      <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", isUser ? "bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300" : "bg-gradient-to-br from-violet-500 to-indigo-600 text-white")}>
        {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
      </div>
      <div className={cn("max-w-[82%] rounded-xl px-3 py-2 text-[13px] leading-relaxed", isUser ? "bg-violet-600 text-white" : "bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-200")}>
        {isUser
          ? message.content
          : parseSegments(message.content).map((seg, i) =>
              seg.type === "code" ? (
                <CodeBlock key={i} code={seg.content} lang={seg.lang} />
              ) : (
                <p key={i} className="whitespace-pre-wrap">{renderInline(seg.content, `s${i}`)}</p>
              ),
            )}
      </div>
    </div>
  );
}

interface ArenaAIPanelProps {
  problem: any;
  code: string;
  language: string;
  executionResponse?: any;
}

export function ArenaAIPanel({ problem, code, language, executionResponse }: ArenaAIPanelProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Restore collapse state per problem session.
  useEffect(() => {
    const saved = localStorage.getItem("arenaai-open");
    if (saved === "true") setOpen(true);
  }, []);
  useEffect(() => {
    localStorage.setItem("arenaai-open", String(open));
  }, [open]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  const buildContext = () => {
    let executionResult: string | undefined;
    const tc = executionResponse?.submission?.testCases ?? executionResponse?.testCases;
    if (Array.isArray(tc)) {
      const passed = tc.filter((t: any) => t.passed).length;
      executionResult = `${passed}/${tc.length} test cases passed. Status: ${executionResponse?.submission?.status ?? executionResponse?.status ?? "unknown"}.`;
    }
    return {
      problemTitle: problem?.title,
      description: problem?.description,
      constraints: problem?.constraints,
      difficulty: problem?.difficulty,
      language,
      code,
      executionResult,
      hintsUsed,
    };
  };

  const post = async (displayText: string, action?: ActionKey) => {
    if (loading) return; // prevent duplicate requests
    const next = [...messages, { role: "user" as const, content: displayText }];
    setMessages(next);
    setInput("");
    setLoading(true);
    if (action === "hint") setHintsUsed((h) => h + 1);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, action: action ?? "chat", context: buildContext() }),
      });
      const data = await res.json();
      const reply = data.reply || data.error || "ArenaAI is temporarily unavailable. Please try again.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "Connection lost. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  const runAction = (a: (typeof ACTIONS)[number]) => {
    if (a.needsCode && (!code || code.trim() === "")) {
      setMessages((prev) => [...prev, { role: "assistant", content: "Write some code in the editor first, then I can help with that." }]);
      setOpen(true);
      return;
    }
    const label = a.key === "hint" ? `${a.display} (#${hintsUsed + 1})` : a.display;
    post(label, a.key);
  };

  return (
    <>
      {/* Collapsed tab */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center gap-2 rounded-l-xl bg-gradient-to-b from-violet-600 to-indigo-600 text-white pl-3 pr-2.5 py-3 shadow-lg shadow-violet-500/30 hover:pr-4 transition-all"
          title="Open ArenaAI"
        >
          <Bot className="w-5 h-5" />
          <span className="text-[10px] font-extrabold uppercase tracking-widest [writing-mode:vertical-rl] rotate-180">
            ArenaAI
          </span>
        </button>
      )}

      {/* Panel */}
      {open && (
        <div className="fixed right-0 top-0 z-40 h-screen w-[calc(100vw-1rem)] sm:w-[420px] flex flex-col border-l border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-zinc-900 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <h3 className="text-sm font-extrabold tracking-wide">ArenaAI</h3>
                <p className="text-[10px] text-white/70 font-medium">Your DSA mentor</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => { setMessages([]); setHintsUsed(0); }} title="Clear chat" className="p-1.5 rounded-lg hover:bg-white/15 transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
              <button onClick={() => setOpen(false)} title="Collapse" className="p-1.5 rounded-lg hover:bg-white/15 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Problem context chip */}
          {problem?.title && (
            <div className="px-4 py-2 border-b border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/20 shrink-0">
              <p className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet-500 truncate">
                ● {problem.title} · {language}
                {hintsUsed > 0 ? ` · ${hintsUsed} hint${hintsUsed > 1 ? "s" : ""} used` : ""}
              </p>
            </div>
          )}

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && !loading && (
              <div className="text-center py-4">
                <div className="w-12 h-12 mx-auto rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center mb-3">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <p className="text-sm font-bold text-slate-700 dark:text-zinc-200">What can I help with?</p>
                <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">Pick an action or ask me anything about this problem.</p>
              </div>
            )}
            {messages.map((m, i) => (
              <MessageBubble key={i} message={m} />
            ))}
            {loading && (
              <div className="flex gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div className="bg-slate-100 dark:bg-zinc-900 rounded-xl px-3 py-3 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-bounce" />
                </div>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="px-3 py-2.5 border-t border-slate-100 dark:border-zinc-900 shrink-0">
            <div className="grid grid-cols-2 gap-1.5">
              {ACTIONS.map((a) => (
                <button
                  key={a.key}
                  onClick={() => runAction(a)}
                  disabled={loading}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 px-2.5 py-2 text-[11px] font-bold text-slate-600 dark:text-zinc-300 hover:border-violet-500/40 hover:text-violet-600 dark:hover:text-violet-400 disabled:opacity-40 transition-all text-left"
                >
                  <a.icon className="w-3.5 h-3.5 shrink-0 text-violet-500" />
                  <span className="truncate">{a.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Chat input */}
          <div className="p-3 border-t border-slate-100 dark:border-zinc-900 shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    if (input.trim()) post(input.trim());
                  }
                }}
                rows={1}
                placeholder="Ask ArenaAI..."
                className="flex-1 resize-none max-h-28 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 px-3 py-2.5 text-[13px] text-slate-700 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder:text-slate-400 dark:placeholder:text-zinc-600"
              />
              <Button
                onClick={() => input.trim() && post(input.trim())}
                disabled={loading || !input.trim()}
                className="h-10 w-10 shrink-0 rounded-xl bg-violet-600 hover:bg-violet-700 text-white p-0 disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
