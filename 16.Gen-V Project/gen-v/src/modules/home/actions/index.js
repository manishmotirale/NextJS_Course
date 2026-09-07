"use server";

import { inngest } from "@/inngest/client"; // Lowercase 'inngest'
import { randomUUID } from "node:crypto";

export const onInvoke = async ({ value, projectId } = {}) => {
  if (!value?.trim()) {
    throw new Error("Project prompt is required");
  }

  await inngest.send({
    name: "code-agent/run",
    data: {
      value,
      projectId: projectId || randomUUID(),
    },
  });
};