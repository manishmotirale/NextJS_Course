// modules/chat/components/chat-view/chat-message-form.tsx
"use client";
import { useState, useEffect, useRef } from "react";
import { ArrowUpIcon, SquareIcon } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useAIModels } from "@/modules/hooks/use-ai-models";
import { ModelSelector } from "./model-selector";
import { useCreateChat } from "@/modules/hooks/use-chats";
import { cn } from "@/lib/utils";

interface ChatMessageFormProps {
  initialMessage?: string;
  onMessageChange?: (message: string) => void;
}

export default function ChatMessageForm({
  initialMessage = "",
  onMessageChange,
}: ChatMessageFormProps) {
  const { data: modelsData, isPending: isModelsPending } = useAIModels();
  const modelsList = modelsData?.models || [];

  const [message, setMessage] = useState(initialMessage || "");
  const [selectedModel, setSelectedModel] = useState<string>("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { mutateAsync, isPending: isChatPending } = useCreateChat();

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 220) + "px";
  }, [message]);

  useEffect(() => {
    if (modelsList.length > 0) {
      // Always set first model if current selection is empty
      if (!selectedModel || selectedModel === "") {
        console.log("Setting default model for new chat:", modelsList[0].id);
        setSelectedModel(modelsList[0].id);
      }
    }
  }, [modelsList]); // Remove selectedModel from deps

  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
      onMessageChange?.("");
    }
  }, [initialMessage, onMessageChange]);

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const trimmed = message.trim();
    if (!trimmed || isChatPending) return;

    try {
      await mutateAsync({ content: trimmed, model: selectedModel });
      setMessage("");
    } catch (error: unknown) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  const canSend = message.trim().length > 0 && !isChatPending;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 pb-6">
      <form onSubmit={handleSubmit}>
        <div
          className={cn(
            "relative rounded-2xl border bg-card shadow-lg transition-all duration-200",
            "border-border/60 hover:border-border/80",
            "focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20 focus-within:shadow-xl",
            isChatPending && "opacity-80"
          )}
        >
          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask NexaChat anything... Type your message here"
            rows={1}
            className={cn(
              "w-full resize-none bg-transparent px-4 pt-4 pb-2 text-sm leading-relaxed outline-none",
              "placeholder:text-muted-foreground/60 min-h-[56px] max-h-[240px]",
              "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border/50",
              isChatPending && "cursor-not-allowed"
            )}
            disabled={isChatPending}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
          />

          {/* Character count indicator for long messages */}
          {message.length > 800 && (
            <div className="absolute top-2 right-4 text-[10px] text-muted-foreground/60">
              {message.length}
            </div>
          )}

          {/* Bottom bar */}
          <div className="flex items-center justify-between gap-3 px-3 pb-3 pt-1 border-t border-border/20">
            <div className="flex items-center gap-2 min-w-0">
              {isModelsPending ? (
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Spinner className="h-3 w-3" />
                  <span>Loading models...</span>
                </div>
              ) : (
                <ModelSelector
                  models={modelsList}
                  selectedModelId={selectedModel}
                  onModelSelect={setSelectedModel}
                />
              )}
              
              {/* Message length indicator */}
              <div className="text-[10px] text-muted-foreground/50">
                {message.trim().length > 0 && `${message.trim().length} chars`}
              </div>
            </div>

            {/* Send button */}
            <button
              type="submit"
              disabled={!canSend}
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200",
                "focus:outline-none focus:ring-2 focus:ring-primary/50",
                canSend
                  ? "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 shadow-md hover:shadow-lg"
                  : "bg-muted text-muted-foreground cursor-not-allowed",
              )}
              title={canSend ? "Send message" : "Type a message to send"}
            >
              {isChatPending ? (
                <Spinner className="h-4 w-4" />
              ) : (
                <ArrowUpIcon className="h-4 w-4 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 mt-3 text-[10px] text-muted-foreground/60">
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-muted/50 font-mono text-[9px]">Enter</kbd> to send
          </span>
          <span>•</span>
          <span>
            <kbd className="px-1.5 py-0.5 rounded bg-muted/50 font-mono text-[9px]">Shift+Enter</kbd> for new line
          </span>
        </div>
      </form>
    </div>
  );
}
