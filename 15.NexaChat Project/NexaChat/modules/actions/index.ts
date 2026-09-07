"use server";

import { prisma } from "@/lib/db";
import { currentUser } from "../auth/actions";
import { MessageRole, MessageType } from "@/lib/generated/prisma/browser";
import { revalidatePath } from "next/cache";

interface IcreateChatWithMessage {
  content: string;
  model: string;
}

export async function createChatWithMessage({
  content,
  model,
}: IcreateChatWithMessage) {
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

export async function getAllChats() {
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
        createdAt: "desc",
      },
    });
    return { success: true, data: chats };
  } catch (error) {
    console.error("Error getting all chats:", error);
    return { success: false, message: "Error getting all chats" };
  }
}

export async function getChatById(chatId: string) {
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

export async function deleteChat(chatId: string) {
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

    return { success: true, data: chat };
  } catch (error) {
    console.error("Error deleting chat:", error);
    return { success: false, message: "Error deleting chat" };
  }
}
