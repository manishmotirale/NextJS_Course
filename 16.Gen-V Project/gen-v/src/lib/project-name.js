/**
 * Turns a user prompt into a readable project name.
 *
 * Replaces random-word-slugs, which produced names like "icy-adult" that said
 * nothing about the project. Done synchronously with no model call, because the
 * project row is created before the agent runs.
 */

/** Leading instructions that carry no meaning in a title. */
const LEADING_NOISE =
  /^(?:please\s+)?(?:can\s+you\s+)?(?:help\s+me\s+)?(?:i\s+(?:want|need)\s+(?:to\s+)?(?:a\s+|an\s+)?)?(?:build|create|make|design|generate|develop|code|write|implement|add|give\s+me|show\s+me)\s+(?:me\s+)?(?:a\s+|an\s+|the\s+|some\s+)?/i;

/** Dropped from the end so "... using React and Tailwind" is not in the title. */
const TRAILING_NOISE =
  /\s+(?:using|with|in|for|that|which|based\s+on|powered\s+by|styled\s+with)\s+.*$/i;

const SMALL_WORDS = new Set([
  "a",
  "an",
  "and",
  "as",
  "at",
  "but",
  "by",
  "for",
  "in",
  "of",
  "on",
  "or",
  "the",
  "to",
  "with",
]);

/** Words that should keep their conventional casing. */
const KNOWN_CASING = {
  api: "API",
  ui: "UI",
  ux: "UX",
  css: "CSS",
  html: "HTML",
  seo: "SEO",
  saas: "SaaS",
  crm: "CRM",
  cms: "CMS",
  lms: "LMS",
  pdf: "PDF",
  ai: "AI",
  ios: "iOS",
  faq: "FAQ",
  todo: "Todo",
  nextjs: "Next.js",
  react: "React",
  tailwind: "Tailwind",
  ecommerce: "E-Commerce",
  dashboard: "Dashboard",
};

/** A prompt that is only an instruction verb yields no usable name. */
const BARE_VERBS = new Set([
  "build",
  "create",
  "make",
  "design",
  "generate",
  "develop",
  "code",
  "write",
  "implement",
  "add",
  "app",
  "website",
  "site",
  "page",
]);

const MAX_WORDS = 5;
const MAX_LENGTH = 48;

const titleCase = (word, index) => {
  const lower = word.toLowerCase();

  if (KNOWN_CASING[lower]) return KNOWN_CASING[lower];

  // Small words stay lowercase unless they lead the title.
  if (index > 0 && SMALL_WORDS.has(lower)) return lower;

  return lower.charAt(0).toUpperCase() + lower.slice(1);
};

export function deriveProjectName(prompt) {
  if (typeof prompt !== "string" || !prompt.trim()) return "Untitled Project";

  // Only consider the first sentence or line; prompts often continue with
  // detailed requirements that do not belong in a name.
  let text = prompt.trim().split(/[\n.!?]/)[0] ?? "";

  text = text.replace(LEADING_NOISE, "").replace(TRAILING_NOISE, "");

  // Strip a leading article even when no verb preceded it ("a SaaS pricing page").
  text = text.replace(/^(?:a|an|the)\s+/i, "");

  // A bare instruction with no subject ("build") is not a name.
  if (BARE_VERBS.has(text.trim().toLowerCase())) return "Untitled Project";

  // Keep letters, numbers, spaces and hyphens.
  const words = text
    .replace(/[^\p{L}\p{N}\s-]/gu, " ")
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return "Untitled Project";

  let name = words.slice(0, MAX_WORDS).map(titleCase).join(" ");

  // Never leave a dangling connector at the end.
  name = name.replace(/\s+(?:and|or|with|the|a|an|of|to|for|in|on|by)$/i, "");

  if (name.length > MAX_LENGTH) {
    name = name.slice(0, MAX_LENGTH).replace(/\s+\S*$/, "");
  }

  return name.trim() || "Untitled Project";
}
