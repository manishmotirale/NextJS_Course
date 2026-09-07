export function lastAssistantTextMessageContent(result) {
  // agent-kit message roles are lowercase ("assistant" | "user" | "system"),
  // not the Prisma MessageRole enum casing.
  const lastAssistantTextMessageIndex = result.output.findLastIndex(
    (message) => message.role === "assistant",
  );

  if (lastAssistantTextMessageIndex === -1) return undefined;

  const message = result.output[lastAssistantTextMessageIndex];

  return message?.content
    ? typeof message.content === "string"
      ? message.content
      : message.content.map((c) => c.text).join("")
    : undefined;
}
