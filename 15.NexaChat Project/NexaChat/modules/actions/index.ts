"use server";

import { prisma } from "@/lib/db";
import { currentUser } from "../auth/actions";
import { MessageRole, MessageType } from "@/lib/generated/prisma/enums";
import { revalidatePath } from "next/cache";

interface IcreateChatWithMessage {
  content: string;
  model: string;
}

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

export async function createChatWithMessage({
  content,
  model,
}: IcreateChatWithMessage): Promise<ApiResponse> {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const title = content.slice(0, 30) + "...";
    const chat = await prisma.chat.create({
      data: {
        title,
        model,
        userId: user.id,
        messages: {
          create: {
            content,
            model,
            messageRole: MessageRole.USER,
            messageType: MessageType.NORMAL,
          },
        },
      },

      include: {
        messages: true,
      },
    });

    revalidatePath("/", "page");

    return { success: true, data: chat };
  } catch (error) {
    console.error("Error creating chat with message:", error);
    return { success: false, message: "Error creating chat with message" };
  }
}

export async function getAllChats(): Promise<ApiResponse> {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const chats = await prisma.chat.findMany({
      where: {
        userId: user.id,
      },
      include: { messages: true },
      orderBy: {
        updatedAt: "desc", // Order by most recently updated
      },
    });

    revalidatePath("/", "page");

    return { success: true, data: chats };
  } catch (error) {
    console.error("Error getting all chats:", error);
    return { success: false, message: "Error getting all chats" };
  }
}

export async function getChatById(chatId: string): Promise<ApiResponse> {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const chat = await prisma.chat.findFirst({
      where: {
        id: chatId,
        userId: user.id,
      },
      include: { messages: true },
    });

    return { success: true, data: chat };
  } catch (error) {
    console.error("Error getting chat by id:", error);
    return { success: false, message: "Error getting chat by id" };
  }
}

export async function deleteChat(chatId: string): Promise<ApiResponse> {
  try {
    const user = await currentUser();

    if (!user) {
      return { success: false, message: "User not found" };
    }

    const chat = await prisma.chat.delete({
      where: {
        id: chatId,
        userId: user?.id,
      },
    });

    if (!chat) {
      return { success: false, message: "Chat not found" };
    }

    revalidatePath("/", "page");

    return { success: true, data: chat };
  } catch (error) {
    console.error("Error deleting chat:", error);
    return { success: false, message: "Error deleting chat" };
  }
}

export async function renameChat(chatId: string, title: string): Promise<ApiResponse> {
  try {
    const user = await currentUser();
    if (!user) return { success: false, message: "User not found" };

    const chat = await prisma.chat.update({
      where: { id: chatId, userId: user.id },
      data: { title: title.trim() },
    });

    revalidatePath("/", "layout");
    return { success: true, data: chat };
  } catch (error) {
    console.error("Error renaming chat:", error);
    return { success: false, message: "Error renaming chat" };
  }
}

export async function updateUserProfile({
  name,
  image,
}: {
  name?: string;
  image?: string;
}): Promise<ApiResponse> {
  try {
    const user = await currentUser();
    if (!user) return { success: false, message: "User not found" };

    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
        ...(name && { name: name.trim() }),
        ...(image !== undefined && { image }),
      },
      select: { id: true, name: true, email: true, image: true },
    });

    revalidatePath("/", "layout");
    return { success: true, data: updated };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, message: "Error updating profile" };
  }
}
