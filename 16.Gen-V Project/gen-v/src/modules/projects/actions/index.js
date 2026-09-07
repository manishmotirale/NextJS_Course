"use server";

import { inngest } from "@/inngest/client";
import db from "@/lib/db";
import { MessageRole, MessageType } from "@prisma/client";
import { getCurrentUser } from "@/modules/auth/actions";
import { consumeCredits } from "@/lib/usage";
import { deriveProjectName } from "@/lib/project-name";

export const createProject = async (value) => {
  const user = await getCurrentUser();

  if (!user) throw new Error("User not found");

  if (!value?.trim()) throw new Error("Project description is required");

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

  const newProject = await db.project.create({
    data: {
      // Derived from the prompt instead of a random slug like "icy-adult".
      name: deriveProjectName(value),
      userId: user.id,
      messages: {
        create: {
          content: value,
          role: MessageRole.USER,
          type: MessageType.RESULT,
        },
      },
    },
  });

  await inngest.send({
    name: "code-agent/run",
    data: {
      value: value,
      projectId: newProject.id,
    },
  });

  return newProject;
};

export const getProjects = async () => {
  const user = await getCurrentUser();

  if (!user) throw new Error("User not found");

  const projects = await db.project.findMany({
    where: {
      userId: user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return projects;
};

/**
 * Sandboxes are ephemeral (15 minute timeout) but Fragment.sandboxUrl is stored
 * permanently, so previews from older messages point at sandboxes that no longer
 * exist. E2B answers those with HTTP 502 and a JSON body of
 * {"sandboxId":"...","message":"The sandbox was not found","code":502}.
 *
 * Checked server-side because the browser cannot read the status of a
 * cross-origin response.
 */
export const getPreviewStatus = async (sandboxUrl) => {
  if (!sandboxUrl) return "unreachable";

  try {
    const res = await fetch(sandboxUrl, {
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });

    if (res.ok) return "ready";

    // Distinguish an expired sandbox from an app-level error inside a live one.
    // E2B replies with JSON; a Next.js error page is HTML.
    const contentType = res.headers.get("content-type") ?? "";

    if (res.status === 502 && contentType.includes("application/json")) {
      const body = await res.json().catch(() => null);

      if (
        typeof body?.message === "string" &&
        body.message.toLowerCase().includes("not found")
      ) {
        return "expired";
      }
    }

    return "unreachable";
  } catch {
    return "unreachable";
  }
};

export const getProjectById = async (projectId) => {
  const user = await getCurrentUser();

  if (!user) throw new Error("User not found");

  const project = await db.project.findFirst({
    where: {
      id: projectId,
      userId: user.id,
    },
  });

  if (!project) throw new Error("Project not found");

  return project;
};

/**
 * Deletes a project and everything under it. Messages and fragments cascade via
 * the schema's onDelete: Cascade, so only the project row is removed here.
 *
 * Scoped with deleteMany + userId so a crafted id cannot delete another user's
 * project; a plain delete() by id would not check ownership.
 */
export const deleteProject = async (projectId) => {
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");
  if (!projectId) throw new Error("Project id is required");

  const result = await db.project.deleteMany({
    where: {
      id: projectId,
      userId: user.id,
    },
  });

  if (result.count === 0) {
    throw new Error("Project not found");
  }

  return { id: projectId };
};

/** Lets the user correct a name that was derived from their prompt. */
export const renameProject = async (projectId, name) => {
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");
  if (!projectId) throw new Error("Project id is required");

  const trimmed = name?.trim();

  if (!trimmed) throw new Error("Name cannot be empty");
  if (trimmed.length > 60) throw new Error("Name is too long");

  const result = await db.project.updateMany({
    where: {
      id: projectId,
      userId: user.id,
    },
    data: { name: trimmed },
  });

  if (result.count === 0) throw new Error("Project not found");

  return { id: projectId, name: trimmed };
};

/** Stars or unstars a project. Returns the new state so the UI can confirm. */
export const toggleFavorite = async (projectId) => {
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");
  if (!projectId) throw new Error("Project id is required");

  const project = await db.project.findFirst({
    where: { id: projectId, userId: user.id },
    select: { id: true, isFavorite: true },
  });

  if (!project) throw new Error("Project not found");

  const updated = await db.project.update({
    where: { id: project.id },
    data: { isFavorite: !project.isFavorite },
    select: { id: true, isFavorite: true },
  });

  return updated;
};

/**
 * Copies a project along with its messages and fragments.
 *
 * No Inngest event is sent: this duplicates existing output rather than
 * generating anything, so it costs no credits and starts no sandbox.
 */
export const duplicateProject = async (projectId) => {
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");
  if (!projectId) throw new Error("Project id is required");

  const source = await db.project.findFirst({
    where: { id: projectId, userId: user.id },
    include: {
      messages: {
        orderBy: { createdAt: "asc" },
        include: { fragments: true },
      },
    },
  });

  if (!source) throw new Error("Project not found");

  const copy = await db.project.create({
    data: {
      name: `${source.name} (copy)`.slice(0, 60),
      userId: user.id,
      messages: {
        create: source.messages.map((message) => ({
          content: message.content,
          role: message.role,
          type: message.type,
          ...(message.fragments
            ? {
                fragments: {
                  create: {
                    // The original sandbox is almost certainly gone, but the
                    // stored files are what make the copy useful.
                    sandboxUrl: message.fragments.sandboxUrl,
                    title: message.fragments.title,
                    files: message.fragments.files,
                    projectFiles: message.fragments.projectFiles ?? undefined,
                  },
                },
              }
            : {}),
        })),
      },
    },
  });

  return copy;
};
