import { currentUser } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Free OpenRouter models, tried in order. Free tiers are frequently
 * rate-limited upstream (HTTP 429), so we fall through to the next model
 * instead of failing the request.
 */
const MODEL_CHAIN = [
  process.env.OPENROUTER_MODEL,
  "nvidia/nemotron-3-super-120b-a12b:free",
  "cohere/north-mini-code:free",
  "z-ai/glm-5.2:free",
  "google/gemma-4-31b-it:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
].filter(Boolean) as string[];

const SYSTEM_PROMPT = `You are ArenaAI, a friendly and concise coding mentor built into AlgoArena, a LeetCode-style practice platform.

Your job:
- Help users understand and solve Data Structures & Algorithms problems.
- Explain concepts, debug code, analyze time/space complexity, and suggest approaches.
- Support JavaScript, Python, and C++.

Guidelines:
- Be concise and practical. Prefer short explanations with small code snippets.
- When a user is stuck on a problem, default to GUIDING HINTS and the intuition first. Only give a full solution if the user explicitly asks for it.
- Always put code inside fenced code blocks with a language tag (e.g. \`\`\`python).
- If a question is not about programming, politely steer back to coding help.
- Never claim to run code; you can only reason about it.
- Answer directly. Do NOT narrate your reasoning process or say things like "We need to answer...".`;

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

// Specialized ArenaAI actions -> precise model instructions.
const ACTION_PROMPTS: Record<string, (ctx: any) => string> = {
  explain: () =>
    "Explain this problem in a beginner-friendly way. Cover: what it's asking, input requirements, output requirements, the important constraints, what the solver needs to figure out, and end with one simple worked example. Do NOT give the solution.",
  hint: (ctx) =>
    `Give me hint number ${ctx?.hintsUsed ? ctx.hintsUsed + 1 : 1} for this problem. Reveal ONLY this single hint in 1-3 sentences that nudge my intuition forward. Do NOT reveal later hints or the full solution. Build progressively on earlier hints.`,
  debug: () =>
    "Debug my current code. Identify syntax problems, logical errors, incorrect conditions/loops, missed edge cases, incorrect variable handling, potential runtime errors, or a wrong algorithm choice. Point to specific lines where possible. Be concise. Do NOT rewrite the whole solution unless I ask.",
  explain_code: () =>
    "Explain what my current code does: the major sections, the important variables, and the algorithm being used. Then state its time and space complexity. Don't explain every single token.",
  complexity: () =>
    "Analyze the time and space complexity of my current code. Give Big-O for both time and space, then a short explanation of why.",
  optimize: () =>
    "Analyze my current solution and suggest optimizations. First state the current time/space complexity, then the improvement idea, then describe the optimized approach separately (with a short snippet if helpful). Do NOT silently replace my code.",
};

/** Builds the system prompt, appending problem/code context when available. */
function buildSystemText(context: any): string {
  let systemText = SYSTEM_PROMPT;
  if (!context?.problemTitle) return systemText;

  systemText +=
    `\n\nThe user is currently viewing this problem:\n` +
    `Title: ${context.problemTitle}\n` +
    (context.difficulty ? `Difficulty: ${context.difficulty}\n` : "") +
    (context.description
      ? `Description: ${String(context.description).slice(0, 2000)}\n`
      : "") +
    (context.constraints
      ? `Constraints: ${String(context.constraints).slice(0, 600)}\n`
      : "") +
    (context.language ? `Working language: ${context.language}\n` : "") +
    (context.code
      ? `\nTheir current code:\n\`\`\`\n${String(context.code).slice(0, 2800)}\n\`\`\`\n`
      : "") +
    (context.executionResult
      ? `\nMost recent execution result:\n${String(context.executionResult).slice(0, 800)}\n`
      : "");

  return systemText;
}

export async function POST(request: NextRequest) {
  try {
    const user = await currentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Please sign in to chat with ArenaAI." },
        { status: 401 },
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      // Graceful fallback so the UI stays functional before a key is configured.
      return NextResponse.json({
        reply:
          "ArenaAI isn't fully wired up yet. Add an `OPENROUTER_API_KEY` to your `.env` file (get a free key at https://openrouter.ai/keys) and restart the dev server to enable me.",
        configured: false,
      });
    }

    const body = await request.json();
    const messages: ChatMessage[] = Array.isArray(body?.messages)
      ? body.messages
      : [];
    const context = body?.context;
    const action: string | undefined = body?.action;

    if (messages.length === 0 && !action) {
      return NextResponse.json(
        { error: "No messages provided" },
        { status: 400 },
      );
    }

    // OpenAI-compatible message list: system first, then the conversation.
    const chatMessages: { role: string; content: string }[] = [
      { role: "system", content: buildSystemText(context) },
      ...messages.slice(-12).map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    ];

    // For a specialized action, replace the trailing user turn with a precise
    // instruction (the client displays a friendly label instead).
    if (action && action !== "chat" && ACTION_PROMPTS[action]) {
      const instruction = ACTION_PROMPTS[action](context);
      const last = chatMessages[chatMessages.length - 1];
      if (last && last.role === "user") {
        last.content = instruction;
      } else {
        chatMessages.push({ role: "user", content: instruction });
      }
    }

    const headers = {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      // Optional attribution headers for the OpenRouter dashboard.
      "HTTP-Referer": process.env.OPENROUTER_SITE_URL || "http://localhost:3000",
      "X-Title": process.env.OPENROUTER_SITE_NAME || "AlgoArena",
    };

    const attempted: string[] = [];

    for (const model of MODEL_CHAIN) {
      try {
        const res = await fetch(OPENROUTER_URL, {
          method: "POST",
          headers,
          body: JSON.stringify({
            model,
            messages: chatMessages,
            temperature: 0.6,
            max_tokens: 1200,
          }),
          signal: AbortSignal.timeout(45_000),
        });

        const data = await res.json().catch(() => null);

        if (!res.ok || data?.error) {
          const status = res.status;
          const msg = data?.error?.message ?? `HTTP ${status}`;
          attempted.push(`${model}: ${msg}`);
          console.warn(`[chat] ${model} failed (${status}):`, String(msg).slice(0, 160));

          // 401/403 are key problems — no point trying other models.
          if (status === 401 || status === 403) {
            return NextResponse.json(
              {
                error:
                  "ArenaAI's API key was rejected. Please check OPENROUTER_API_KEY in .env.",
              },
              { status: 502 },
            );
          }
          continue; // rate-limited / unavailable → try next model
        }

        const reply = data?.choices?.[0]?.message?.content?.trim();
        if (!reply) {
          attempted.push(`${model}: empty response`);
          continue;
        }

        return NextResponse.json({ reply, configured: true, model });
      } catch (err: any) {
        attempted.push(`${model}: ${err?.message}`);
        console.warn(`[chat] ${model} threw:`, err?.message);
      }
    }

    console.error("[chat] All models failed:", attempted.join(" | "));
    return NextResponse.json(
      {
        error:
          "ArenaAI is temporarily unavailable (all free models are busy). Please try again in a moment.",
      },
      { status: 503 },
    );
  } catch (error: any) {
    console.error("[chat] Error:", error?.message);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
