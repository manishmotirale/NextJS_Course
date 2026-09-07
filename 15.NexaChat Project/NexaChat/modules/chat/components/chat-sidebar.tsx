"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import UserButton from "@/modules/auth/components/user-button";
import { PlusIcon, SearchIcon, EllipsisIcon, Trash } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { isToday, isYesterday, isWithinInterval, subDays } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import DeleteChatModel from "@/components/delete-chat-model";
import { useGetChats } from "@/modules/hooks/use-chats";
import { Spinner } from "@/components/ui/spinner";

type ChatMessage = {
  content?: string | null;
};

type Chat = {
  id: string;
  title?: string | null;
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
  messages?: ChatMessage[] | null;
};

const DATE_GROUPS = [
  { key: "today", label: "Today" },
  { key: "yesterday", label: "Yesterday" },
  { key: "lastWeek", label: "Last 7 Days" },
  { key: "older", label: "Older" },
] as const;

type DateGroupKey = (typeof DATE_GROUPS)[number]["key"];

type GroupedChats = Record<DateGroupKey, Chat[]>;

type ChatItemProps = {
  chat: Chat;
  isActive: boolean;
  onDelete: (e: React.MouseEvent, chatId: string) => void;
};

type ChatGroupProps = {
  label: string;
  chats?: Chat[];
  activeChatId: string | null;
  onDelete: (e: React.MouseEvent, chatId: string) => void;
};

function groupChatsByDate(chats: Chat[]) {
  const groups: GroupedChats = {
    today: [],
    yesterday: [],
    lastWeek: [],
    older: [],
  };
  const now = new Date();

  if (!Array.isArray(chats)) return groups;

  chats.forEach((chat) => {
    try {
      // Fallback to createdAt, updatedAt, or now if date is missing
      const rawDate = chat.createdAt || chat.updatedAt || new Date();
      const date = typeof rawDate === "string" ? new Date(rawDate) : rawDate;

      // Handle invalid date objects gracefully
      if (isNaN(date.getTime())) {
        groups.older.push(chat);
        return;
      }

      if (isToday(date)) {
        groups.today.push(chat);
      } else if (isYesterday(date)) {
        groups.yesterday.push(chat);
      } else if (isWithinInterval(date, { start: subDays(now, 7), end: now })) {
        groups.lastWeek.push(chat);
      } else {
        groups.older.push(chat);
      }
    } catch (error) {
      console.error("Error processing chat date:", error, chat);
      groups.older.push(chat);
    }
  });

  return groups;
}

function ChatItem({ chat, isActive, onDelete }: ChatItemProps) {
  const router = useRouter();

  return (
    <div
      className={cn(
        "flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent",
        isActive && "bg-sidebar-accent",
      )}
      onClick={() => router.push(`/chat/${chat.id}`)}
    >
      <span className="truncate flex-1">{chat.title || "Untitled Chat"}</span>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-none hover:bg-sidebar-accent-foreground/10"
          onClick={(e) => e.stopPropagation()}
        >
          <EllipsisIcon className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-red-500 cursor-pointer"
            onClick={(e) => onDelete(e, chat.id)}
          >
            <Trash className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ChatGroup({ label, chats = [], activeChatId, onDelete }: ChatGroupProps) {
  if (!chats || chats.length === 0) return null;

  return (
    <div className="mb-4">
      <div className="mb-2 px-2 text-xs font-semibold text-muted-foreground">
        {label}
      </div>
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          isActive={chat.id === activeChatId}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

const ChatSidebar = ({ user }: { user: any }) => {
  const {
    data: chats = [],
    isPending,
    isError,
    error,
  } = useGetChats();

  const pathname = usePathname();
  const activeChatId = pathname?.startsWith("/chat/")
    ? pathname.split("/")[2]
    : null;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const filteredChats = useMemo<Chat[]>(() => {
    if (!Array.isArray(chats)) return [];
    if (!searchQuery) return chats;
    const query = searchQuery.toLowerCase();

    return chats.filter(
      (chat) =>
        chat.title?.toLowerCase().includes(query) ||
        chat.messages?.some((msg) => msg.content?.toLowerCase().includes(query)),
    );
  }, [searchQuery, chats]);

  const groupedChats = useMemo<GroupedChats>(() => {
    return groupChatsByDate(filteredChats);
  }, [filteredChats]);

  const handleDelete = (e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedChatId(chatId);
    setIsModalOpen(true);
  };

  if (isPending) {
    return <Spinner className="m-auto" />;
  }

  return (
    <div className="flex h-full w-64 flex-col border-r border-border bg-sidebar">
      {/* Header */}
      <div className="flex items-center border-b border-sidebar-border px-4 py-3 h-14 overflow-hidden">
        <Link
          href="/"
          className="flex items-center hover:opacity-90 transition-opacity"
        >
          <Image
            src="/nexachat.png"
            alt="NexaChat"
            width={200}
            height={200}
            className="h-32 w-auto object-contain -my-10 scale-150 filter invert brightness-200"
            priority
          />
        </Link>
      </div>

      <div className="p-4">
        <Link href="/" className={cn(buttonVariants(), "w-full")}> 
          <PlusIcon className="mr-2 h-4 w-4" />
          New Chat
        </Link>
      </div>

      <div className="px-4 pb-4">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search your threads..."
            className="pl-9 pr-8 bg-sidebar-accent border-sidebar-border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-2">
        {isError ? (
          <div className="px-3 py-8 text-center text-sm text-destructive">
            {error instanceof Error ? error.message : "Unable to load chats"}
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="text-center text-sm text-muted-foreground py-8">
            {searchQuery ? "No chats found" : "No chats yet"}
          </div>
        ) : (
          DATE_GROUPS.map((group) => (
            <ChatGroup
              key={group.key}
              label={group.label}
              chats={groupedChats[group.key]}
              activeChatId={activeChatId}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      {/* Footer */}
      <div className="p-4 flex items-center gap-3 border-t border-sidebar-border">
        <UserButton user={user} />
        <span className="flex-1 text-sm text-sidebar-foreground truncate">
          {user?.email}
        </span>
      </div>

      <DeleteChatModel
        chatId={selectedChatId}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </div>
  );
};

export default ChatSidebar;
