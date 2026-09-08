// modules/chat/components/chat-view/chat-welcome-tabs.tsx
"use client";
import React, { useState } from "react";
import {
  Sparkles,
  Compass,
  Code2,
  GraduationCap,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CHAT_TAB_MESSAGE = [
  {
    tabName: "Create",
    icon: <Sparkles className="h-4 w-4" />,
    messages: [
      "Write a motivational LinkedIn post about landing your first internship",
      "Create a startup idea that solves a real-world student problem",
      "Draft a professional email requesting an internship opportunity",
      "Generate a week's worth of Instagram content ideas for a tech creator",
    ],
  },
  {
    tabName: "Explore",
    icon: <Compass className="h-4 w-4" />,
    messages: [
      "Summarize today's biggest AI news in under 2 minutes",
      "Compare ChatGPT, Claude, Gemini, and Grok side-by-side",
      "Top 10 highest-paying software engineering jobs in 2026",
      "Explain the latest trends in web development",
    ],
  },
  {
    tabName: "Code",
    icon: <Code2 className="h-4 w-4" />,
    messages: [
      "Build a full-stack authentication system using Next.js and Better Auth",
      "Optimize a React component for high performance rendering",
      "Explain closures in JavaScript with practical real-world examples",
      "Convert a JavaScript REST API function into TypeScript",
    ],
  },
  {
    tabName: "Learn",
    icon: <GraduationCap className="h-4 w-4" />,
    messages: [
      "Teach me SQL from beginner to advanced with interactive queries",
      "Explain system design principles for technical interviews",
      "Create a 30-day roadmap to master Data Structures and Algorithms",
      "How does Retrieval-Augmented Generation (RAG) work under the hood?",
    ],
  },
];

interface ChatWelcomeTabsProps {
  userName?: string;
  onMessageSelect: (message: string) => void;
}

const ChatWelcomeTabs: React.FC<ChatWelcomeTabsProps> = ({
  userName = "Friend",
  onMessageSelect,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const formattedName = userName.split(" ")[0] || userName;

  return (
    <div className="flex flex-col items-center justify-center px-4 pt-12 pb-6">
      <div className="w-full max-w-3xl space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">
            Where to begin,{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {formattedName}?
            </span>
          </h1>
          <p className="text-sm text-muted-foreground">
            Select a category or type a custom query to launch your session.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-2 border-b border-border/40 pb-3 overflow-x-auto">
          {CHAT_TAB_MESSAGE.map((tab, index) => {
            const isActive = activeTab === index;
            return (
              <button
                key={tab.tabName}
                onClick={() => setActiveTab(index)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-xl transition-all duration-200 cursor-pointer",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground",
                )}
              >
                {tab.icon}
                <span>{tab.tabName}</span>
              </button>
            );
          })}
        </div>

        {/* Prompt Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 min-h-[220px]">
          {CHAT_TAB_MESSAGE[activeTab].messages.map((message, index) => (
            <button
              key={index}
              onClick={() => onMessageSelect(message)}
              className="group relative flex flex-col justify-between p-4 text-left rounded-2xl border border-border/60 bg-card/40 hover:bg-card hover:border-primary/30 transition-all duration-200 hover:shadow-md"
            >
              <span className="text-sm text-foreground/80 group-hover:text-foreground transition-colors leading-relaxed">
                {message}
              </span>
              <div className="flex justify-end pt-2">
                <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:text-primary transition-all duration-200" />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatWelcomeTabs;
