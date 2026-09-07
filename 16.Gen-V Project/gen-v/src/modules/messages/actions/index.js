"use server";

import { MessageRole, MessageType } from "@prisma/client";
import db from "@/lib/db";
import { inngest } from "@/inngest/client";
import { getCurrentUser } from "@/modules/auth/actions";
import { consumeCredits } from "@/lib/usage";

export const createMessage = async (value, projectId) => {
  const user = await getCurrentUser();

  if (!user) throw new Error("User not found");

  if (!value?.trim()) throw new Error("Message content is required");
  if (!projectId) throw new Error("Project id is required");

  // `userId` is not part of Project's unique index, so this has to be
  // findFirst - findUnique would reject the argument.
  const project = await db.project.findFirst({
    where: {
      id: projectId,
      userId: user.id,
    },
  });

  if (!project) throw new Error("Project not found");

  try {
    await consumeCredits();
  } catch (error) {
    // rate-limiter-flexible rejects with a RateLimiterRes (not an Error)
    // when the limit is exhausted.
    if (error instanceof Error) {
      throw new Error("Something went wrong while consuming credits");
    }

    throw new Error("You have run out of credits");
  }

  const newMessage = await db.message.create({
    data: {
      projectId: projectId,
      content: value,
      role: MessageRole.USER,
      type: MessageType.RESULT,
    },
  });

  await inngest.send({
    name: "code-agent/run",
    data: {
      value: value,
      projectId: projectId,
    },
  });

  return newMessage;
};

export const getMessage = async (projectId) => {
  const user = await getCurrentUser();

  if (!user) throw new Error("User not found or Unauthorized");

  if (!projectId) throw new Error("Project id is required");

  const project = await db.project.findFirst({
    where: {
      id: projectId,
      userId: user.id,
    },
  });

  if (!project) throw new Error("Project not found or Unauthorized");

  const messages = await db.message.findMany({
    where: {
      projectId: projectId,
    },
    orderBy: {
      createdAt: "asc",
    },
    include: {
      fragments: true,
    },
  });

  return messages;
};
