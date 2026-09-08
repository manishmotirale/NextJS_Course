"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useGetChatById } from "@/modules/hooks/use-chats";
import { useAIModels } from "@/modules/hooks/use-ai-models";
import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";
import { ArrowUpIcon, SquareIcon, CopyIcon, EditIcon, CheckIcon, XIcon } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

import {
  Conversation,
  ConversationContent,
  ConversationDownload,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";

import { ModelSelector } from "../chat-view/model-selector";
import {
  Message,
  MessageContent,
  MessageResponse,
  MessageActions,
  MessageAction,
  MessageToolbar,
} from "@/components/ai-elements/message";
import {
  Reasoning,
  ReasoningContent,
  ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import { toast } from "sonner";

interface DBMessage {
  id: string;
  content: string;
  messageRole: "USER" | "ASSISTANT" | string;
  createdAt: string | Date;
}

type MessagePartShape = {
  type: string;
  text?: string;
  [key: string]: unknown;
};

function parseMessageToUI(msg: DBMessage) {
  const basePart = { type: "text", text: msg.content };

  try {
    const parts = JSON.parse(msg.content);
    return {
      id: msg.id,
      role: msg.messageRole.toLowerCase(),
      parts: Array.isArray(parts) ? parts : [basePart],
      createdAt: msg.createdAt,
    };
  } catch {
    return {
      id: msg.id,
      role: msg.messageRole.toLowerCase(),
      parts: [basePart],
      createdAt: msg.createdAt,
    };
  }
}

function MessagePart({
  part,
  messageId,
  partIndex,
  role,
  isStreaming,
  onEdit,
}: {
  part: MessagePartShape;
  messageId: string;
  partIndex: number;
  role: UIMessage["role"];
  isStreaming: boolean;
  onEdit?: (messageId: string, newText: string) => void;
}) {
  const key = `${messageId}-${partIndex}`;
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(part.text || "");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Auto resize
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
    }
  }, [isEditing]);

  const handleCopy = async () => {
    if (part.text) {
      try {
        await navigator.clipboard.writeText(part.text);
        toast.success("Message copied to clipboard");
      } catch (error) {
        console.error("Failed to copy:", error);
        toast.error("Failed to copy message");
      }
    }
  };

  const handleEditStart = () => {
    setEditText(part.text || "");
    setIsEditing(true);
  };

  const handleEditSave = () => {
    if (editText.trim() && editText !== part.text) {
      onEdit?.(messageId, editText.trim());
    }
    setIsEditing(false);
  };

  const handleEditCancel = () => {
    setEditText(part.text || "");
    setIsEditing(false);
  };

  if (part.type === "text") {
    return (
      <div key={key} className="w-full">
        <Message from={role}>
          <MessageContent>
            {isEditing && role === "user" ? (
              <div className="w-full">
                <textarea
                  ref={textareaRef}
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  className="w-full resize-none bg-background border border-border rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/50"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleEditSave();
                    }
                    if (e.key === "Escape") {
                      handleEditCancel();
                    }
                  }}
                  onInput={(e) => {
                    const target = e.currentTarget;
                    target.style.height = "auto";
                    target.style.height = target.scrollHeight + "px";
                  }}
                />
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={handleEditSave}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
                  >
                    <CheckIcon className="h-3 w-3" />
                    Resend
                  </button>
                  <button
                    onClick={handleEditCancel}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs bg-muted text-muted-foreground rounded hover:bg-muted/80 transition-colors"
                  >
                    <XIcon className="h-3 w-3" />
                    Cancel
                  </button>
                  <div className="text-[10px] text-muted-foreground ml-2">
                    <kbd className="px-1.5 py-0.5 rounded bg-muted/50 font-mono">Enter</kbd> to resend · <kbd className="px-1.5 py-0.5 rounded bg-muted/50 font-mono">Esc</kbd> to cancel
                  </div>
                </div>
              </div>
            ) : (
              <MessageResponse>{part.text}</MessageResponse>
            )}
          </MessageContent>
        </Message>
        
        {/* Action buttons below the message box */}
        {!isEditing && (
          <div className="flex justify-end mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <MessageActions>
              <MessageAction
                onClick={handleCopy}
                tooltip="Copy message"
                label="Copy"
                className="text-muted-foreground hover:text-foreground"
              >
                <CopyIcon className="h-3.5 w-3.5" />
              </MessageAction>
              {role === "user" && !isStreaming && (
                <MessageAction
                  onClick={handleEditStart}
                  tooltip="Edit and resend message"
                  label="Edit"
                  className="text-muted-foreground hover:text-foreground"
                >
                  <EditIcon className="h-3.5 w-3.5" />
                </MessageAction>
              )}
            </MessageActions>
          </div>
        )}
      </div>
    );
  }

  if (part.type === "reasoning") {
    return (
      <Reasoning
        className="max-w-2xl px-4 py-4 border border-muted rounded-md bg-muted/50"
        key={key}
        isStreaming={isStreaming}
      >
        <ReasoningTrigger />
        <ReasoningContent className="mt-2 italic font-light text-muted-foreground">
          {part.text ?? ""}
        </ReasoningContent>
      </Reasoning>
    );
  }

  if (part.type === "step-start" && partIndex > 0) {
    return (
      <div key={key} className="my-4 text-gray-500">
        <hr className="border-gray-300" />
      </div>
    );
  }

  return null;
}

export const MessageViewWithForm = ({ chatId }: { chatId: string }) => {
  const { data: chatData, isPending } = useGetChatById(chatId);

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
      </div>
    );
  }

  if (!chatData?.success || !chatData?.data) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground">
        Chat Not Found
      </div>
    );
  }

  const rawMessages = chatData.data.messages ?? [];
  const initialMessages: UIMessage[] = rawMessages
    .filter((m: DBMessage | any) => m?.id && m?.content?.trim())
    .map(parseMessageToUI);

  return (
    <ChatView
      chatId={chatId}
      initialMessages={initialMessages}
      initialModel={chatData.data.model}
    />
  );
};

const ChatView = ({
  chatId,
  initialMessages,
  initialModel,
}: {
  chatId: string;
  initialMessages: UIMessage[];
  initialModel: string | null;
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const shouldAutoTrigger = searchParams.get("autoTrigger") === "true";
  const hasAutoTriggered = useRef(false);
  const queryClient = useQueryClient();

  const [selectedModel, setSelectedModel] = useState<string | null>(
    initialModel,
  );
  const { data: modelsData, isPending: isModelLoading } = useAIModels();

  // Auto-select first model if no model is selected - more aggressive check
  useEffect(() => {
    const models = modelsData?.models;
    if (models && models.length > 0) {
      // If no model selected OR empty string, set first model
      if (!selectedModel || selectedModel === "") {
        console.log("Setting default model:", models[0].id);
        setSelectedModel(models[0].id);
      }
    }
  }, [modelsData?.models]); // Remove selectedModel from deps to avoid loop

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: "/api/chat",
      }),
    [],
  );

  const { messages, status, sendMessage, regenerate, stop, error, append } = useChat({
    id: chatId,
    messages: initialMessages,
    transport,
    onError: (error) => {
      console.error("Send message failed:", error);
      toast.error("Failed to send message");
    },
    onFinish: () => {
      // Invalidate chats query to refresh sidebar order
      queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
  });

  const isBuzy = status === "submitted" || status === "streaming";

  const handleEditMessage = async (messageId: string, newText: string) => {
    try {
      if (!selectedModel) {
        toast.error("Please select a model first");
        return;
      }

      // Send the edited message as a new message
      await sendMessage(
        { text: newText },
        {
          body: {
            chatId,
            model: selectedModel,
            skipUserMessage: false,
          },
        },
      );
      
      toast.success("Message resent successfully");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  useEffect(() => {
    if (!shouldAutoTrigger) return;
    if (hasAutoTriggered.current) return;
    if (!selectedModel) return;
    if (messages.length === 0) return;
    if (messages.at(-1)?.role !== "user") return;

    hasAutoTriggered.current = true;

    regenerate({
      body: {
        chatId,
        model: selectedModel,
        skipUserMessage: true,
      },
    }).catch((err) => {
      console.error("Auto-trigger failed:", err);
      toast.error("Failed to generate response");
    });

    const params = new URLSearchParams(searchParams.toString());
    params.delete("autoTrigger");
    const query = params.toString();
    router.replace(`/chat/${chatId}${query ? `?${query}` : ""}`, {
      scroll: false,
    });
  }, [
    shouldAutoTrigger,
    selectedModel,
    messages,
    chatId,
    regenerate,
    router,
    searchParams,
  ]);

  const handleSubmit = async (message: { text: string }) => {
    const text = message.text?.trim();
    if (!text) return;
    if (!selectedModel) {
      toast.error("Please select a model first");
      return; 
    }

    if (isBuzy) return;

    try {
      await sendMessage(
        { text },
        {
          body: {
            chatId,
            model: selectedModel,
            skipUserMessage: false,
          },
        },
      );
      
      // Force immediate sidebar refresh
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: ["chats"] });
      }, 1000);
    } catch (error) {
      console.error("Send message failed:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-[calc(100vh-4rem)]">
      <div className="flex flex-col h-full">
        <Conversation className="h-full">
          <ConversationContent>
            {messages.length === 0 ? (
              <ConversationEmptyState
                title="Start the conversation"
                description="Send a message to get started."
              />
            ) : (
              messages.map((message) => (
                <div key={message.id} className="group">
                  {message.parts.map((part, i) => (
                    <MessagePart
                      key={`${message.id}-${i}`}
                      part={part as MessagePartShape}
                      messageId={message.id}
                      partIndex={i}
                      role={message.role}
                      isStreaming={
                        isBuzy &&
                        message === messages.at(-1) &&
                        i === message.parts.length - 1
                      }
                      onEdit={handleEditMessage}
                    />
                  ))}
                </div>
              ))
            )}

            {status === "submitted" && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Spinner />
                <span className="text-sm">AI is thinking...</span>
              </div>
            )}

            {error && (
              <div className="text-sm text-destructive">
                {error.message || "Something went wrong."}
              </div>
            )}
          </ConversationContent>
          <ConversationScrollButton />
        </Conversation>

        <div className="mt-4 shrink-0">
          <form onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.currentTarget);
            const text = formData.get("message") as string;
            if (text?.trim()) {
              handleSubmit({ text: text.trim() });
              e.currentTarget.reset();
            }
          }}>
            <div
              className={cn(
                "relative rounded-2xl border bg-card shadow-lg transition-all duration-200",
                "border-border/60 hover:border-border/80",
                "focus-within:border-primary/60 focus-within:ring-2 focus-within:ring-primary/20",
                isBuzy && "opacity-80"
              )}
            >
              {/* Textarea */}
              <textarea
                name="message"
                placeholder="Continue the conversation... Type your message here"
                disabled={isBuzy}
                rows={1}
                className={cn(
                  "w-full resize-none bg-transparent px-4 pt-4 pb-2 text-sm leading-relaxed outline-none",
                  "placeholder:text-muted-foreground/60 min-h-[56px] max-h-[240px]",
                  "scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border/50",
                  isBuzy && "cursor-not-allowed"
                )}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    const form = e.currentTarget.form;
                    if (form) {
                      const formData = new FormData(form);
                      const text = formData.get("message") as string;
                      if (text?.trim()) {
                        handleSubmit({ text: text.trim() });
                        form.reset();
                      }
                    }
                  }
                }}
                onInput={(e) => {
                  // Auto-resize textarea
                  const target = e.currentTarget;
                  target.style.height = "auto";
                  target.style.height = Math.min(target.scrollHeight, 240) + "px";
                }}
                style={{
                  fieldSizing: "content"
                }}
              />

              {/* Bottom bar */}
              <div className="flex items-center justify-between gap-3 px-3 pb-3 pt-1 border-t border-border/20">
                <div className="flex items-center gap-2 min-w-0">
                  {isModelLoading ? (
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Spinner className="h-3 w-3" />
                      <span>Loading models...</span>
                    </div>
                  ) : (
                    <ModelSelector
                      models={modelsData?.models ?? []}
                      selectedModelId={selectedModel ?? ""}
                      onModelSelect={setSelectedModel}
                      className=""
                    />
                  )}
                  
                  {/* Status indicator */}
                  {status === "streaming" && (
                    <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      <span>Streaming</span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Helpful shortcut text */}
                  {!isBuzy && (
                    <span className="text-[9px] text-muted-foreground/50 hidden sm:inline">
                      <kbd className="px-1 py-0.5 rounded bg-muted/40 font-mono">Enter</kbd> to send
                    </span>
                  )}
                  
                  {/* Send/Stop button */}
                  {isBuzy ? (
                    <button
                      type="button"
                      onClick={stop}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200 bg-destructive text-destructive-foreground hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-destructive/50"
                      title="Stop generation"
                    >
                      <SquareIcon className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={!selectedModel}
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-all duration-200",
                        "focus:outline-none focus:ring-2 focus:ring-primary/50",
                        selectedModel
                          ? "bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 shadow-md hover:shadow-lg"
                          : "bg-muted text-muted-foreground cursor-not-allowed",
                      )}
                      title={selectedModel ? "Send message" : "Select a model first"}
                    >
                      <ArrowUpIcon className="h-4 w-4 stroke-[2.5]" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
