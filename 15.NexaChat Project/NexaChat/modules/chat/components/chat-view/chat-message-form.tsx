// modules/chat/components/chat-view/chat-message-form.tsx
"use client";
import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { useAIModels } from "@/modules/hooks/use-ai-models";
import { ModelSelector } from "./model-selector";
import { useCreateChat } from "@/modules/hooks/use-chats";

export default function ChatMessageForm({
  initialMessage,
  onMessageChange,
}: any) {
  const { data: modelsData, isPending } = useAIModels();
  const modelsList = modelsData?.models || [];

  const [message, setMessage] = useState(initialMessage || "");
  const [selectedModel, setSelectedModel] = useState<string>("");

  const { mutateAsync, isPending: isChatPending } = useCreateChat();

  // Set default model once React Query fetches models successfully
  useEffect(() => {
    if (modelsList.length > 0 && !selectedModel) {
      setSelectedModel(modelsList[0].id);
    }
  }, [modelsList, selectedModel]);

  useEffect(() => {
    if (initialMessage) {
      setMessage(initialMessage);
      onMessageChange?.("");
    }
  }, [initialMessage, onMessageChange]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await mutateAsync({ content: message, model: selectedModel });
      toast.success("Message sent");
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-6">
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative rounded-2xl border border-border/80 bg-card/60 backdrop-blur-xl shadow-xl shadow-black/5 transition-all duration-300 focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20">
          <Textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask NexaChat anything..."
            className="min-h-[70px] max-h-[220px] resize-none border-0 bg-transparent px-4 pt-4 pb-2 text-sm md:text-base focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/60"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />

          <div className="flex items-center justify-between gap-2 px-3 py-2 border-t border-border/40 bg-muted/20 rounded-b-2xl">
            <div className="flex items-center gap-1.5">
              {isPending ? (
                <Spinner />
              ) : (
                <ModelSelector
                  models={modelsList}
                  selectedModelId={selectedModel}
                  onModelSelect={setSelectedModel}
                />
              )}
            </div>

            <Button
              type="submit"
              disabled={!message.trim() || isChatPending}
              size="icon"
              className="h-8 w-8 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground transition-all duration-200 active:scale-95 disabled:opacity-30"
            >
              {isChatPending ? (
                <Spinner />
              ) : (
                <ArrowUp className="h-4 w-4 stroke-[2.5]" />
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
