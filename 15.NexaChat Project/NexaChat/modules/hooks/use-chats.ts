import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createChatWithMessage,
  deleteChat,
  getAllChats,
  getChatById,
  renameChat,
} from "../actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * Chat API Response types
 */
interface ChatResponse {
  success: boolean;
  message?: string;
  data?: any;
}

interface CreateChatResponse {
  success: boolean;
  data?: {
    id: string;
    title?: string;
  };
}

export const useGetChats = () => {
  return useQuery({
    queryKey: ["chats"],
    queryFn: async () => {
      const res = await getAllChats();

      if (!res?.success) {
        throw new Error(res?.message || "Failed to load chats");
      }

      return Array.isArray(res.data) ? res.data : [];
    },
  });
};

export const useGetChatById = (chatId: string) => {
  return useQuery({
    queryKey: ["chat", chatId],
    queryFn: () => getChatById(chatId),
  });
};

export const useCreateChat = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: createChatWithMessage,
    onSuccess: async (res: CreateChatResponse) => {
      if (res?.success && res?.data) {
        // Await invalidation so React Query fetches the new chat list before page navigation
        await queryClient.invalidateQueries({ queryKey: ["chats"] });
        router.push(`/chat/${res.data.id}?autoTrigger=true`);
      }
    },
    onError: (error: Error) => {
      console.error("Error creating chat:", error);
      toast.error("Error creating chat");
    },
  });
};

export const useDeleteChat = (chatId: string | null) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => deleteChat(chatId || ""),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["chats"] });
      router.push("/");
    },
    onError: () => {
      toast.error("Error deleting chat");
    },
  });
};

export const useRenameChat = (chatId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ title }: { title: string }) => renameChat(chatId, title),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["chats"] });
    },
    onError: () => {
      toast.error("Error renaming chat");
    },
  });
};
