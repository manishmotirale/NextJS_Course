/**
 * Wandbox API utility — completely free, no API key required.
 * https://wandbox.org/api
 *
 * Used ONLY for create-problem reference-solution validation.
 * The actual user code execution (Run/Submit) still uses Judge0 via RapidAPI.
 */

const WANDBOX_URL = "https://wandbox.org/api/compile.json";

/**
 * Wandbox compiler names for each language.
 * Run GET https://wandbox.org/api/list.json to see all available compilers.
 */
const WANDBOX_COMPILER: Record<string, string> = {
  JAVASCRIPT: "nodejs-20.2.0",
  PYTHON: "cpython-3.12.0",
  CPP: "gcc-13.2.0",
};

/**
 * Extra compiler options per language.
 */
const WANDBOX_COMPILER_OPTIONS: Record<string, string> = {
  JAVASCRIPT: "",
  PYTHON: "",
  CPP: "-std=c++17",
};

export interface WandboxResult {
  stdout: string;
  stderr: string;
  compilerError: string;
  exitCode: number; // 0 = clean exit
  success: boolean; // true if process exited 0 with no compiler error
}

/**
 * Execute a single code snippet against one stdin input using Wandbox.
 */
export async function runWithWandbox(
  language: string,
  sourceCode: string,
  stdin: string,
): Promise<WandboxResult> {
  const lang = language.toUpperCase();
  const compiler = WANDBOX_COMPILER[lang];

  if (!compiler) {
    throw new Error(`Unsupported language for Wandbox validation: ${language}`);
  }

  const body: Record<string, string> = {
    compiler,
    code: sourceCode,
    stdin,
  };

  const compilerOptions = WANDBOX_COMPILER_OPTIONS[lang];
  if (compilerOptions) {
    body["compiler-option-raw"] = compilerOptions;
  }

  const response = await fetch(WANDBOX_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15_000), // 15 s per execution
  });

  if (!response.ok) {
    throw new Error(
      `Wandbox returned HTTP ${response.status}: ${response.statusText}`,
    );
  }

  const data = await response.json();

  // Wandbox status field: "0" = success, anything else = runtime/compile error
  const exitCode = parseInt(data.status ?? "1", 10);
  const compilerError: string = (data.compiler_error ?? "").trim();
  const stdout: string = (data.program_output ?? "").trim();
  const stderr: string = (data.program_error ?? "").trim();

  return {
    stdout,
    stderr,
    compilerError,
    exitCode,
    success: exitCode === 0 && compilerError === "",
  };
}
