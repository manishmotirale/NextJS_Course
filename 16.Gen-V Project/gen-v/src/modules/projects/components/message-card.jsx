import { Response } from "@/components/ai-elements/response";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { MessageRole, MessageType } from "@prisma/client";
import { ChevronRightIcon, Code2Icon } from "lucide-react";
import Image from "next/image";
import React from "react";
import { format } from "date-fns";

const FragmentCard = ({ fragment, isActiveFragment, onFragmentClick }) => {
  const fileCount = Object.keys(fragment.files ?? {}).length;

  return (
    <button
      className={cn(
        "group/frag flex w-full max-w-sm items-center gap-3 rounded-xl border p-3 text-start transition-all",
        isActiveFragment
          ? "border-primary bg-primary/25 ring-primary/40 ring-2 dark:bg-primary/20"
          : "bg-secondary hover:bg-accent hover:border-primary/50 hover:shadow-sm",
      )}
      onClick={() => onFragmentClick(fragment)}
    >
      <span
        className={cn(
          "flex size-9 shrink-0 items-center justify-center rounded-lg border",
          isActiveFragment
            ? "border-primary/50 bg-primary text-primary-foreground"
            : "bg-background text-muted-foreground",
        )}
      >
        <Code2Icon className="size-4" />
      </span>

      <span className="flex min-w-0 flex-1 flex-col">
        <span className="line-clamp-1 text-sm font-medium">
          {fragment.title}
        </span>
        <span className="text-muted-foreground text-xs">
          {isActiveFragment ? "Viewing" : "Open preview"}
          {fileCount > 0 && ` · ${fileCount} file${fileCount === 1 ? "" : "s"}`}
        </span>
      </span>

      <ChevronRightIcon
        className={cn(
          "size-4 shrink-0 transition-transform",
          isActiveFragment
            ? "text-primary"
            : "text-muted-foreground group-hover/frag:translate-x-0.5",
        )}
      />
    </button>
  );
};

const UserMessage = ({ content }) => {
  return (
    // pb-4 matches the assistant card's bottom spacing so the thread keeps an
    // even rhythm regardless of who sent the message.
    <div className="flex justify-end pr-2 pb-4 pl-10">
      {/* Solid primary rather than a /10 tint: in light mode --primary is a pale
          mint, so a 10% wash was invisible against the near-white background.
          primary-foreground is defined for both themes, so this reads either way. */}
      <Card className="bg-primary text-primary-foreground max-w-[85%] rounded-2xl rounded-br-md border-none px-3.5 py-2.5 text-sm break-words whitespace-pre-wrap shadow-sm">
        {content}
      </Card>
    </div>
  );
};

const AssistantMessage = ({
  content,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col group px-2 pb-4",
        type === MessageType.ERROR && "text-red-700 dark:text-red-500",
      )}
    >
      <div className="mb-2 flex items-center gap-2 pl-2">
        <Image
          alt="Gen-V"
          src={"/logo.png"}
          height={28}
          width={28}
          className="invert dark:invert-0"
        />
        <span className="text-sm font-medium">Gen-V</span>
        <span className="text-muted-foreground text-xs opacity-0 transition-opacity group-hover:opacity-100">
          {format(new Date(createdAt), "HH:mm 'on' MMM dd, yyyy")}
        </span>
      </div>

      <div className="pl-8.5 flex flex-col gap-y-4">
        <Response>{content}</Response>
        {fragment && type === MessageType.RESULT && (
          <FragmentCard
            fragment={fragment}
            isActiveFragment={isActiveFragment}
            onFragmentClick={onFragmentClick}
          />
        )}
      </div>
    </div>
  );
};

const MessageCard = ({
  content,
  role,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type,
}) => {
  if (role === MessageRole.ASSISTANT) {
    return (
      <AssistantMessage
        content={content}
        fragment={fragment}
        createdAt={createdAt}
        isActiveFragment={isActiveFragment}
        onFragmentClick={onFragmentClick}
        type={type}
      />
    );
  }

  return (
    <div className="mt-5">
      <UserMessage content={content} />
    </div>
  );
};

export default MessageCard;
