import axios from "axios";

/**
 * Maps frontend language keys to Judge0 CE language IDs
 * 💡 Case synchronized to 'getJudge0languageId' to match API route invocation
 */
export function getJudge0languageId(language: string) {
  const languageMap: Record<string, number> = {
    PYTHON: 71,
    PY: 71,
    JAVASCRIPT: 63,
    JS: 63,
    CPP: 54,
    "C++": 54,
    JAVA: 62,
  };

  return languageMap[language.toUpperCase()] ?? 63;
}

export function getLanguageName(languageId: number) {
  const LANGUAGE_NAMES: Record<number, string> = {
    63: "JavaScript",
    71: "Python",
    54: "C++",
    62: "Java",
  };
  return LANGUAGE_NAMES[languageId] || "Unknown";
}

/**
 * Reads Judge0 CE credentials from environment variables.
 * Primary host: judge0-ce.p.rapidapi.com (the standard, active free-tier CE endpoint)
 * Falls back to RAPIDAPI_HOST env var if set.
 */
function getJudge0Config() {
  const apiKey =
    process.env.RAPIDAPI_KEY || process.env.NEXT_PUBLIC_RAPIDAPI_KEY || "";
  // Use the standard CE endpoint. If a custom host is set in env, prefer that.
  const apiHost =
    process.env.RAPIDAPI_HOST && process.env.RAPIDAPI_HOST.includes("judge0")
      ? process.env.RAPIDAPI_HOST
      : "judge0-ce.p.rapidapi.com";

  return { apiKey, apiHost };
}

/**
 * Submits a batch of code submissions to Judge0 CE endpoint
 */
export async function submitBatch(submissions: any[]) {
  const { apiKey, apiHost } = getJudge0Config();

  const options = {
    method: "POST",
    url: `https://${apiHost}/submissions/batch`,
    params: {
      base64_encoded: "false",
    },
    headers: {
      "x-rapidapi-key": apiKey,
      "x-rapidapi-host": apiHost,
      "Content-Type": "application/json",
    },
    data: {
      submissions,
    },
  };

  const { data } = await axios.request(options);
  return data;
}

/**
 * Polls Judge0 batch results until all submissions are finished.
 * Max 30 attempts (~30 seconds) to prevent infinite hang on stuck submissions.
 */
export async function pollBatchResults(tokens: string[]) {
  const { apiKey, apiHost } = getJudge0Config();
  const MAX_ATTEMPTS = 30;
  let attempts = 0;

  while (attempts < MAX_ATTEMPTS) {
    attempts++;

    const options = {
      method: "GET",
      url: `https://${apiHost}/submissions/batch`,
      params: {
        tokens: tokens.join(","),
        base64_encoded: "false",
        fields: "*",
      },
      headers: {
        "x-rapidapi-key": apiKey,
        "x-rapidapi-host": apiHost,
      },
    };

    const { data } = await axios.request(options);
    const results = data.submissions;

    // Safety fallback in case results array payload fails to compile
    if (!results) return [];

    const isAllDone = results.every(
      (r: any) => r?.status?.id !== 1 && r?.status?.id !== 2,
    );

    if (isAllDone) return results;

    await sleep(1000);
  }

  throw new Error("Judge0 polling timeout: submissions did not complete within 30 seconds.");
}

export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
