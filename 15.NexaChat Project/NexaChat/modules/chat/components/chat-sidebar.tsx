"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import UserButton from "@/modules/auth/components/user-button";
import {
  PlusIcon,
  SearchIcon,
  EllipsisIcon,
  Trash,
  PencilIcon,
  CheckIcon,
  XIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo, useRef, useEffect } from "react";
import { isToday, isYesterday, isWithinInterval, subDays } from "date-fns";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { usePathname, useRouter } from "next/navigation";
import DeleteChatModel from "@/components/delete-chat-model";
import { useGetChats, useRenameChat } from "@/modules/hooks/use-chats";
import { Spinner } from "@/components/ui/spinner";
import { useSidebar } from "@/components/providers/sidebar-provider";
import ProfileModal from "@/components/profile-modal";

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

type User = {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
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

function groupChatsByDate(chats: Chat[]): GroupedChats {
  const groups: GroupedChats = { today: [], yesterday: [], lastWeek: [], older: [] };
  const now = new Date();
  if (!Array.isArray(chats)) return groups;

  chats.forEach((chat) => {
    try {
      // Use updatedAt first (most recent activity), fall back to createdAt
      const rawDate = chat.updatedAt || chat.createdAt || new Date();
      const date = typeof rawDate === "string" ? new Date(rawDate) : rawDate;
      if (isNaN(date.getTime())) { groups.older.push(chat); return; }

      if (isToday(date)) groups.today.push(chat);
      else if (isYesterday(date)) groups.yesterday.push(chat);
      else if (isWithinInterval(date, { start: subDays(now, 7), end: now })) groups.lastWeek.push(chat);
      else groups.older.push(chat);
    } catch {
      groups.older.push(chat);
    }
  });

  return groups;
}

function ChatItem({ chat, isActive, onDelete }: ChatItemProps) {
  const router = useRouter();
  const { mutateAsync: renameChat, isPending: isRenaming } = useRenameChat(chat.id);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(chat.title || "Untitled Chat");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleRenameStart = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTitle(chat.title || "Untitled Chat");
    setIsEditing(true);
  };

  const handleRenameSubmit = async () => {
    const trimmed = editTitle.trim();
    if (trimmed && trimmed !== chat.title) {
      await renameChat({ title: trimmed });
    }
    setIsEditing(false);
  };

  const handleRenameCancel = () => {
    setEditTitle(chat.title || "Untitled Chat");
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleRenameSubmit();
    if (e.key === "Escape") handleRenameCancel();
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1 rounded-lg px-2 py-1.5 bg-sidebar-accent">
        <input
          ref={inputRef}
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 text-sm bg-transparent border-b border-primary/50 outline-none text-sidebar-foreground placeholder:text-muted-foreground"
          disabled={isRenaming}
        />
        <button
          onClick={handleRenameSubmit}
          disabled={isRenaming}
          className="p-0.5 rounded hover:bg-primary/20 text-primary shrink-0"
        >
          <CheckIcon className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={handleRenameCancel}
          className="p-0.5 rounded hover:bg-destructive/20 text-muted-foreground shrink-0"
        >
          <XIcon className="h-3.5 w-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "group flex cursor-pointer items-center justify-between rounded-lg px-3 py-2 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent",
        isActive && "bg-sidebar-accent",
      )}
      onClick={() => router.push(`/chat/${chat.id}`)}
    >
      <span className="truncate flex-1">{chat.title || "Untitled Chat"}</span>
      <DropdownMenu>
        <DropdownMenuTrigger
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded hover:bg-sidebar-accent-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <EllipsisIcon className="h-4 w-4" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-40">
          <DropdownMenuItem
            className="cursor-pointer text-xs"
            onClick={handleRenameStart}
          >
            <PencilIcon className="h-3.5 w-3.5 mr-2" />
            Rename
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive cursor-pointer text-xs"
            onClick={(e) => onDelete(e, chat.id)}
          >
            <Trash className="h-3.5 w-3.5 mr-2" />
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
    <div className="mb-3">
      <div className="mb-1 px-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
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

const ChatSidebar = ({ user }: { user: User | null }) => {
  const { isOpen, toggle } = useSidebar();
  const { data: chats = [], isPending, isError, error } = useGetChats();

  const pathname = usePathname();
  const activeChatId = pathname?.startsWith("/chat/") ? pathname.split("/")[2] : null;

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const filteredChats = useMemo<Chat[]>(() => {
    if (!Array.isArray(chats)) return [];
    if (!searchQuery) return chats;
    const query = searchQuery.toLowerCase();
    return chats.filter(
      (chat) =>
        chat.title?.toLowerCase().includes(query) ||
        chat.messages?.some((msg: ChatMessage | any) => msg.content?.toLowerCase().includes(query)),
    );
  }, [searchQuery, chats]);

  const groupedChats = useMemo<GroupedChats>(() => groupChatsByDate(filteredChats), [filteredChats]);

  const handleDelete = (e: React.MouseEvent, chatId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedChatId(chatId);
    setIsDeleteModalOpen(true);
  };

  return (
    <>
      {/* Collapsed toggle button — visible only when sidebar is closed */}
      {!isOpen && (
        <div className="flex flex-col items-center pt-3 pb-2 px-2 h-full w-12 border-r border-border bg-sidebar shrink-0">
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
            title="Open sidebar"
          >
            <PanelLeftOpenIcon className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Full sidebar */}
      {isOpen && (
        <div className="flex h-full w-64 flex-col border-r border-border bg-sidebar shrink-0">

          {/* Header — Logo + collapse button */}
          <div className="flex items-center justify-between px-4 h-14 border-b border-sidebar-border shrink-0">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <div className="relative h-7 w-7 shrink-0">
                <Image
                  src="/nexachat.png"
                  alt="NexaChat"
                  fill
                  className="object-contain filter invert brightness-200"
                  priority
                />
              </div>
              <span className="text-sm font-bold tracking-tight text-foreground">NexaChat</span>
            </Link>
            <button
              onClick={toggle}
              className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
              title="Collapse sidebar"
            >
              <PanelLeftCloseIcon className="h-4 w-4" />
            </button>
          </div>

          {/* New Chat button */}
          <div className="px-3 pt-3 pb-2 shrink-0">
            <Link href="/" className={cn(buttonVariants({ variant: "default", size: "sm" }), "w-full gap-2")}>
              <PlusIcon className="h-4 w-4" />
              New Chat
            </Link>
          </div>

          {/* Search */}
          <div className="px-3 pb-3 shrink-0">
            <div className="relative">
              <SearchIcon className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search chats..."
                className="pl-8 pr-7 h-8 text-xs bg-sidebar-accent border-sidebar-border focus-visible:ring-1 focus-visible:ring-primary/40"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-base leading-none"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          {/* Chat list */}
          <div className="flex-1 overflow-y-auto px-2 py-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-border/50">
            {isPending ? (
              <div className="flex justify-center py-8">
                <Spinner className="h-4 w-4" />
              </div>
            ) : isError ? (
              <p className="px-3 py-8 text-center text-xs text-destructive">
                {error instanceof Error ? error.message : "Unable to load chats"}
              </p>
            ) : filteredChats.length === 0 ? (
              <p className="text-center text-xs text-muted-foreground py-8">
                {searchQuery ? "No chats found" : "No chats yet"}
              </p>
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

          {/* Footer — Profile */}
          <div className="shrink-0 border-t border-sidebar-border p-3">
            <div
              className="w-full flex items-center gap-2.5 rounded-lg px-2 py-2 hover:bg-sidebar-accent transition-colors group cursor-pointer"
            >
              <UserButton user={user} onProfile={() => setIsProfileOpen(true)} />
              <div className="flex-1 min-w-0 text-left">
                <p className="text-xs font-semibold text-foreground truncate">
                  {user?.name || "User"}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">
                  {user?.email}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <DeleteChatModel
        chatId={selectedChatId}
        isModalOpen={isDeleteModalOpen}
        setIsModalOpen={setIsDeleteModalOpen}
      />

      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
      />
    </>
  );
};

export default ChatSidebar;
