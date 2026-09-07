"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Bot, Send, X, Sparkles, User, Copy, Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Explain the two-pointer technique",
  "What's the time complexity of quicksort?",
  "How do I debug a segfault in C++?",
  "Give me a hint for solving 3Sum",
];

const WELCOME: Message = {
  role: "assistant",
  content:
    "Hi, I'm **ArenaAI** 👋 — your coding mentor. Ask me about algorithms, complexity, debugging, or a hint for a problem you're stuck on.",
};

/** Splits assistant text into plain-text and fenced code-block segments. */
function parseSegments(text: string) {
  const segments: { type: "text" | "code"; lang?: string; content: string }[] = [];
  const regex = /```(\w+)?\n?([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      segments.push({ type: "text", content: text.slice(lastIndex, match.index) });
    }
    segments.push({ type: "code", lang: match[1], content: match[2].replace(/\n$/, "") });
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    segments.push({ type: "text", content: text.slice(lastIndex) });
  }
  return segments;
}

/** Minimal inline markdown: **bold** and `code`. */
function renderInline(text: string, keyPrefix: string) {
  const parts = text.split(/(\*\*[^*]+\*\*|`[^`]+`)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={`${keyPrefix}-${i}`} className="font-bold">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith("`") && part.endsWith("`")) {
      return (
        <code
          key={`${keyPrefix}-${i}`}
          className="px-1 py-0.5 rounded bg-slate-200/60 dark:bg-zinc-800 text-[11px] font-mono text-violet-600 dark:text-violet-400"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
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
        <button
          onClick={copy}
          className="text-slate-400 hover:text-violet-500 transition-colors"
          title="Copy code"
        >
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
      <div
        className={cn(
          "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
          isUser
            ? "bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300"
            : "bg-gradient-to-br from-violet-500 to-indigo-600 text-white",
        )}
      >
        {isUser ? <User className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
      </div>
      <div
        className={cn(
          "max-w-[80%] rounded-xl px-3 py-2 text-[13px] leading-relaxed",
          isUser
            ? "bg-violet-600 text-white"
            : "bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-200",
        )}
      >
        {isUser
          ? message.content
          : parseSegments(message.content).map((seg, i) =>
              seg.type === "code" ? (
                <CodeBlock key={i} code={seg.content} lang={seg.lang} />
              ) : (
                <p key={i} className="whitespace-pre-wrap">
                  {renderInline(seg.content, `s${i}`)}
                </p>
              ),
            )}
      </div>
    </div>
  );
}

interface CodeMateWidgetProps {
  // Optional context (e.g. from a problem page) forwarded to the assistant.
  context?: {
    problemTitle?: string;
    description?: string;
    difficulty?: string;
    language?: string;
    code?: string;
  };
}

export function CodeMateWidget({ context }: CodeMateWidgetProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, loading, open]);

  // On the problem-solving page, the richer context-aware ArenaAI panel takes
  // over, so hide this floating widget there to avoid two assistants.
  const isProblemDetail = /^\/problems\/[^/]+$/.test(pathname ?? "");
  if (isProblemDetail) return null;

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || loading) return;

    const next = [...messages, { role: "user" as const, content }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // Don't send the welcome message to the model.
          messages: next.filter((m) => m !== WELCOME),
          context,
        }),
      });
      const data = await res.json();
      const reply = data.reply || data.error || "Sorry, something went wrong.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Network error — please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating launcher */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          title="Ask ArenaAI"
          className="fixed bottom-5 right-5 z-50 h-14 w-14 rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-xl shadow-violet-500/30 flex items-center justify-center hover:scale-105 active:scale-95 transition-transform group"
        >
          <Bot className="w-6 h-6" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
        </button>
      )}

      {/* Chat panel */}
      {open && (
        <div className="fixed bottom-5 right-5 z-50 w-[calc(100vw-2.5rem)] sm:w-[400px] h-[560px] max-h-[calc(100vh-2.5rem)] flex flex-col rounded-2xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-zinc-900 bg-gradient-to-r from-violet-600 to-indigo-600 text-white shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div className="leading-tight">
                <h3 className="text-sm font-extrabold tracking-wide">ArenaAI</h3>
                <p className="text-[10px] text-white/70 font-medium">Your AI coding mentor</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setMessages([WELCOME])}
                title="Clear chat"
                className="p-1.5 rounded-lg hover:bg-white/15 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setOpen(false)}
                title="Close"
                className="p-1.5 rounded-lg hover:bg-white/15 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {context?.problemTitle && (
              <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-violet-500 bg-violet-500/10 border border-violet-500/20 rounded-lg px-2.5 py-1.5">
                Context: {context.problemTitle}
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

            {/* Suggestion chips (only on a fresh chat) */}
            {messages.length === 1 && !loading && (
              <div className="flex flex-wrap gap-2 pt-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="text-[11px] font-medium text-slate-600 dark:text-zinc-300 bg-slate-100 dark:bg-zinc-900 hover:bg-violet-500/10 hover:text-violet-600 dark:hover:text-violet-400 border border-slate-200 dark:border-zinc-800 rounded-full px-3 py-1.5 transition-colors text-left"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-100 dark:border-zinc-900 shrink-0">
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    send(input);
                  }
                }}
                rows={1}
                placeholder="Ask ArenaAI anything about code..."
                className="flex-1 resize-none max-h-28 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-900/40 px-3 py-2.5 text-[13px] text-slate-700 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-violet-500 placeholder:text-slate-400 dark:placeholder:text-zinc-600"
              />
              <Button
                onClick={() => send(input)}
                disabled={loading || !input.trim()}
                className="h-10 w-10 shrink-0 rounded-xl bg-violet-600 hover:bg-violet-700 text-white p-0 disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-[9px] text-slate-400 dark:text-zinc-600 mt-1.5 text-center">
              ArenaAI can make mistakes. Verify important info.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
