import { gemini, openai } from "@inngest/agent-kit";

/**
 * Model selection for the code agent network.
 *
 * Set AI_PROVIDER in .env:
 *   openrouter -> OpenRouter    (OPENROUTER_API_KEY)  <- recommended
 *   cerebras   -> Cerebras      (CEREBRAS_API_KEY)
 *   groq       -> Groq          (GROQ_API_KEY)
 *   gemini     -> Google Gemini (GEMINI_API_KEY)      <- currently unusable
 *
 * Provider notes, all measured against this project's API keys:
 *
 * - gemini is a dead end. Gemini 3.x returns a `thoughtSignature` with every
 *   functionCall and rejects the next turn if it is not echoed back, but
 *   agent-kit's gemini adapter rebuilds tool calls from `{ name, args }` only.
 *   Result: 400 "Function call is missing a thought_signature" on the first turn
 *   after any tool call. Gemini 2.x does not enforce this, but every 2.x model
 *   now 404s with "no longer available to new users". Verified across
 *   gemini-2.5-flash, gemini-2.5-flash-lite, gemini-2.0-flash,
 *   gemini-flash-latest, gemini-flash-lite-latest and gemini-3.5-flash.
 *
 * - groq works correctly (multi-turn tool replay verified) but its free tier
 *   caps gpt-oss-120b at 8000 tokens/minute. The system prompt alone is ~2.4k
 *   tokens and every turn replays the full history, so runs die mid-way with
 *   rate_limit_exceeded.
 *
 * - openrouter accepts a `models` array and fails over to the next entry when
 *   one errors or rate-limits, which is why it is the recommended default.
 */

export const AI_PROVIDER = (
  process.env.AI_PROVIDER || "openrouter"
).toLowerCase();

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";
const CEREBRAS_BASE_URL = "https://api.cerebras.ai/v1";

/**
 * OpenRouter accepts a `models` array and falls over to the next entry when one
 * errors, rate-limits, or is unavailable. That failover happens inside a single
 * request, so a mid-run rate limit does not kill the generation.
 *
 * Ordered cheapest-capable first. Tool calling is mandatory for the code agent,
 * so every entry must support it - many `:free` models do not, and a model that
 * silently refuses to call tools produces an empty run rather than an error.
 */
/**
 * OpenRouter rejects more than 3 entries: "'models' array must have 3 items or
 * fewer." Deliberately no Gemini here - Gemini 3.x requires thoughtSignature
 * replay that agent-kit drops, and that requirement follows the model through
 * any OpenAI-compatible proxy.
 */
const OPENROUTER_TOOL_MODELS = [
  "openai/gpt-oss-120b",
  "anthropic/claude-haiku-4.5",
  "qwen/qwen3-coder",
];

const OPENROUTER_TEXT_MODELS = [
  "openai/gpt-oss-20b",
  "anthropic/claude-haiku-4.5",
];

const MODELS = {
  gemini: {
    tool: "gemini-2.5-flash",
    text: "gemini-2.5-flash",
  },
  groq: {
    // Groq deprecated the llama-3.x chat models in June 2026; gpt-oss is the
    // current recommendation for tool calling.
    tool: "openai/gpt-oss-120b",
    text: "openai/gpt-oss-20b",
  },
  openrouter: {
    tool: OPENROUTER_TOOL_MODELS[0],
    text: OPENROUTER_TEXT_MODELS[0],
  },
  cerebras: {
    // Free tier is far more generous than Groq's 8k tokens/minute.
    tool: "qwen-3-coder-480b",
    text: "llama-3.3-70b",
  },
};

const OPENAI_COMPATIBLE = {
  groq: { baseUrl: GROQ_BASE_URL, keyName: "GROQ_API_KEY" },
  cerebras: { baseUrl: CEREBRAS_BASE_URL, keyName: "CEREBRAS_API_KEY" },
};

function requireKey(name) {
  const value = process.env[name];

  if (!value) {
    throw new Error(
      `AI_PROVIDER is "${AI_PROVIDER}" but ${name} is not set in your environment.`,
    );
  }

  return value;
}

function createModel(kind) {
  const preset = MODELS[AI_PROVIDER];

  if (!preset) {
    throw new Error(
      `Unknown AI_PROVIDER "${AI_PROVIDER}". Supported values: ${Object.keys(
        MODELS,
      ).join(", ")}.`,
    );
  }

  if (AI_PROVIDER === "openrouter") {
    const fallbacks =
      kind === "tool" ? OPENROUTER_TOOL_MODELS : OPENROUTER_TEXT_MODELS;

    return openai({
      model: preset[kind],
      apiKey: requireKey("OPENROUTER_API_KEY"),
      baseUrl: OPENROUTER_BASE_URL,
      defaultParameters: {
        // agent-kit Object.assigns defaultParameters into the request body, so
        // this reaches OpenRouter's router as-is.
        models: fallbacks,
      },
    });
  }

  const compatible = OPENAI_COMPATIBLE[AI_PROVIDER];

  if (compatible) {
    return openai({
      model: preset[kind],
      apiKey: requireKey(compatible.keyName),
      baseUrl: compatible.baseUrl,
    });
  }

  return gemini({
    model: preset[kind],
    apiKey: requireKey("GEMINI_API_KEY"),
  });
}

/** Model for the tool-calling code agent. */
export const createToolModel = () => createModel("tool");

/** Model for the tool-free title and response agents. */
export const createTextModel = () => createModel("text");
