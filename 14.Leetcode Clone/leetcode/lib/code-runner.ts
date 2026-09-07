/**
 * Unified free code execution library for AlgoArena.
 *
 * Execution chain (no RapidAPI/Judge0 dependency):
 *   JavaScript → Local Node.js vm      (zero latency, always works)
 *   C++        → Local g++ compiler    (if installed) → Wandbox → Paiza → Piston
 *   Python     → Local python          (if installed) → Wandbox → Paiza → Piston
 *
 * Running code locally on the server is the primary, most reliable path.
 * Public online runners are only used as a fallback when a local toolchain
 * is unavailable (e.g. no python installed) or a local compile is rejected
 * by an older toolchain.
 */

import { spawn } from "child_process";
import { writeFile, mkdtemp, rm } from "fs/promises";
import os from "os";
import path from "path";

// ─── Local process helpers (C++ via g++, Python via python) ──────────────────

interface ProcResult {
  code:       number;
  stdout:     string;
  stderr:     string;
  timedOut?:  boolean;
  spawnError?: boolean; // executable not found on PATH (ENOENT)
}

/** Spawn a child process, pipe stdin, capture stdout/stderr with a timeout. */
function runProcess(
  cmd:       string,
  args:      string[],
  stdin:     string,
  cwd:       string,
  timeoutMs: number
): Promise<ProcResult> {
  return new Promise((resolve) => {
    let child;
    try {
      child = spawn(cmd, args, { cwd, windowsHide: true });
    } catch (e: any) {
      resolve({ code: -1, stdout: "", stderr: String(e?.message ?? e), spawnError: true });
      return;
    }

    let stdout = "";
    let stderr = "";
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      try { child.kill(); } catch { /* noop */ }
    }, timeoutMs);

    child.stdout.on("data", (d) => (stdout += d.toString()));
    child.stderr.on("data", (d) => (stderr += d.toString()));
    child.on("error", (err: any) => {
      clearTimeout(timer);
      resolve({
        code: -1,
        stdout,
        stderr: String(err?.message ?? err),
        spawnError: err?.code === "ENOENT",
      });
    });
    child.on("close", (code) => {
      clearTimeout(timer);
      resolve({ code: code ?? -1, stdout, stderr, timedOut });
    });

    try {
      if (stdin) child.stdin.write(stdin);
      child.stdin.end();
    } catch { /* noop */ }
  });
}

/** Result of a local run, with flags so the caller knows whether to fall back. */
interface LocalResult {
  success:       boolean;
  output:        string;
  error:         string;
  notAvailable?: boolean; // toolchain not installed → try online
  compileError?: boolean; // local compile failed → try online (newer compiler)
}

async function runCppLocally(code: string, stdin: string): Promise<LocalResult> {
  const dir = await mkdtemp(path.join(os.tmpdir(), "algoarena-"));
  const src = path.join(dir, "main.cpp");
  const exe = path.join(dir, process.platform === "win32" ? "main.exe" : "main.out");
  try {
    await writeFile(src, code, "utf8");

    const compile = await runProcess(
      "g++",
      ["-std=c++17", "-O2", src, "-o", exe],
      "",
      dir,
      20_000
    );
    if (compile.spawnError) {
      return { success: false, output: "", error: "g++ not installed", notAvailable: true };
    }
    if (compile.code !== 0) {
      return {
        success: false,
        output: "",
        error: "Compilation error: " + compile.stderr.trim(),
        compileError: true,
      };
    }

    const run = await runProcess(exe, [], stdin, dir, 10_000);
    if (run.timedOut) {
      return { success: false, output: run.stdout.trim(), error: "Time limit exceeded" };
    }
    if (run.code !== 0) {
      return {
        success: false,
        output: run.stdout.trim(),
        error: run.stderr.trim() || "Runtime error",
      };
    }
    return { success: true, output: run.stdout.trim(), error: "" };
  } catch (e: any) {
    return { success: false, output: "", error: String(e?.message ?? e), notAvailable: true };
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

// Cache the detected python command so we only probe once per server process.
let _pythonCmd: string | null | undefined;

async function getPythonCommand(): Promise<string | null> {
  if (_pythonCmd !== undefined) return _pythonCmd;
  for (const cmd of ["python3", "python", "py"]) {
    const r = await runProcess(cmd, ["--version"], "", process.cwd(), 5_000);
    // The Windows Store alias returns spawnError=false but a non-zero/blank result;
    // require a clean exit AND some version text.
    if (!r.spawnError && r.code === 0 && /python/i.test(r.stdout + r.stderr)) {
      _pythonCmd = cmd;
      return cmd;
    }
  }
  _pythonCmd = null;
  return null;
}

async function runPythonLocally(pyCmd: string, code: string, stdin: string): Promise<LocalResult> {
  const dir = await mkdtemp(path.join(os.tmpdir(), "algoarena-"));
  const src = path.join(dir, "main.py");
  try {
    await writeFile(src, code, "utf8");
    const run = await runProcess(pyCmd, [src], stdin, dir, 12_000);
    if (run.spawnError) {
      return { success: false, output: "", error: "python not installed", notAvailable: true };
    }
    if (run.timedOut) {
      return { success: false, output: run.stdout.trim(), error: "Time limit exceeded" };
    }
    if (run.code !== 0) {
      return {
        success: false,
        output: run.stdout.trim(),
        error: run.stderr.trim() || "Runtime error",
      };
    }
    return { success: true, output: run.stdout.trim(), error: "" };
  } catch (e: any) {
    return { success: false, output: "", error: String(e?.message ?? e), notAvailable: true };
  } finally {
    await rm(dir, { recursive: true, force: true }).catch(() => {});
  }
}

// ─── Local JavaScript Runner (via Node.js vm) ────────────────────────────────
// For JS submissions we run code directly inside Node.js — no external API needed.

async function runJavaScriptLocally(
  code:  string,
  stdin: string
): Promise<{ success: boolean; output: string; error: string }> {
  const { runInNewContext } = await import("vm");

  let stdout = "";
  let stderr = "";

  const sandbox: Record<string, any> = {
    // Capture console.log output
    console: {
      log:   (...args: any[]) => { stdout += args.map((a) => typeof a === "object" ? JSON.stringify(a) : String(a)).join(" ") + "\n"; },
      error: (...args: any[]) => { stderr += args.map(String).join(" ") + "\n"; },
      warn:  (...args: any[]) => {},
      info:  (...args: any[]) => {},
    },
    // Stub process so wrappers work
    process: {
      stdout:  { write: (s: string) => { stdout += s; } },
      stderr:  { write: (s: string) => { stderr += s; } },
      argv:    ["node", "solution.js"],
      env:     {},
      exit:    (code: number) => { throw new Error(`__EXIT__${code}`); },
      version: process.version,
    },
    // Stub require — 'fs' and 'readline' are needed by templates/wrappers
    require: (mod: string) => {
      if (mod === "fs") {
        return {
          readFileSync: (_path: any, _enc?: any) => stdin,
          writeFileSync: () => {},
          existsSync:   () => true,
        };
      }
      if (mod === "readline") {
        return {
          createInterface: () => {
            // Split stdin into lines up front. Because runInNewContext executes
            // synchronously and returns before any real timers fire, we must emit
            // "line" events synchronously the moment the handler is registered.
            const lines = stdin.split(/\r?\n/);
            const closeCbs: Function[] = [];
            let closed = false;
            const api = {
              on: (event: string, callback: Function) => {
                if (event === "line") {
                  for (const line of lines) {
                    if (closed) break;
                    callback(line);
                  }
                } else if (event === "close") {
                  closeCbs.push(callback);
                }
                return api;
              },
              close: () => {
                if (closed) return;
                closed = true;
                closeCbs.forEach((cb) => cb());
              },
            };
            return api;
          },
        };
      }
      // Allow path module stubs
      if (mod === "path") return { join: (...a: string[]) => a.join("/") };
      throw new Error(`Cannot require '${mod}' in sandbox`);
    },
    // Standard globals
    Buffer,
    Math, JSON, Date,
    Array, Object, String, Number, Boolean, Symbol, BigInt,
    Map, Set, WeakMap, WeakSet, Promise,
    parseInt, parseFloat, isNaN, isFinite,
    Infinity, NaN,
    setTimeout:   (fn: Function, _ms: number) => { fn(); },
    clearTimeout: () => {},
    setInterval:  () => {},
    clearInterval: () => {},
  };
  // Freeze to prevent escaping
  sandbox.global = sandbox;

  try {
    runInNewContext(code, sandbox, { timeout: 5000, filename: "solution.js" });
    return { success: true, output: stdout.trim(), error: stderr.trim() };
  } catch (err: any) {
    const msg: string = err?.message ?? "";
    // process.exit() used in driver — not an error
    if (msg.startsWith("__EXIT__")) {
      return { success: true, output: stdout.trim(), error: stderr.trim() };
    }
    return { success: false, output: stdout.trim(), error: msg || "Runtime error" };
  }
}

// ─── Piston ────────────────────────────────────────────────────────────────

const PISTON_URL = "https://emkc.org/api/v2/piston/execute";

const PISTON_LANG: Record<string, { language: string; version: string }> = {
  JAVASCRIPT: { language: "javascript", version: "18.15.0" },
  PYTHON:     { language: "python",     version: "3.10.0"  },
  CPP:        { language: "c++",        version: "10.2.0"  },
};

async function runWithPiston(
  language: string,
  code:     string,
  stdin:    string
): Promise<{ success: boolean; output: string; error: string }> {
  const lang    = language.toUpperCase();
  const runtime = PISTON_LANG[lang];
  if (!runtime) throw new Error(`Unsupported language: ${language}`);

  const resp = await fetch(PISTON_URL, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      language: runtime.language,
      version:  runtime.version,
      files:    [{ name: "main", content: code }],
      stdin,
      run_timeout: 10000,
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!resp.ok) throw new Error(`Piston HTTP ${resp.status}: ${resp.statusText}`);

  const data = await resp.json();
  const run  = data.run ?? {};
  const out  = (run.stdout ?? "").trim();
  const err  = (run.stderr ?? "").trim();

  if ((run.code ?? 0) !== 0 || (err && !out)) {
    return { success: false, output: "", error: err || "Runtime error" };
  }
  return { success: true, output: out, error: "" };
}

// ─── Paiza.io ──────────────────────────────────────────────────────────────
//  Free public guest API — no registration needed.

const PAIZA_CREATE = "https://api.paiza.io/runners/create";
const PAIZA_DETAIL = "https://api.paiza.io/runners/get_details";
const PAIZA_GUEST  = "guest";

const PAIZA_LANG: Record<string, string> = {
  JAVASCRIPT: "javascript",
  PYTHON:     "python3",
  CPP:        "cpp",
  JAVA:       "java",
};

async function runWithPaiza(
  language: string,
  code:     string,
  stdin:    string
): Promise<{ success: boolean; output: string; error: string }> {
  const lang      = language.toUpperCase();
  const paizaLang = PAIZA_LANG[lang];
  if (!paizaLang) throw new Error(`Unsupported language for Paiza: ${language}`);

  // Submit
  const createResp = await fetch(PAIZA_CREATE, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source_code: code,
      language:    paizaLang,
      input:       stdin,
      api_key:     PAIZA_GUEST,
    }),
    signal: AbortSignal.timeout(15_000),
  });

  if (!createResp.ok) {
    throw new Error(`Paiza create HTTP ${createResp.status}`);
  }

  const created = await createResp.json();
  const runId   = created?.id;
  if (!runId) throw new Error("Paiza did not return a run ID");

  // Poll until completed
  for (let attempt = 0; attempt < 25; attempt++) {
    await new Promise((r) => setTimeout(r, 700));

    const detailResp = await fetch(
      `${PAIZA_DETAIL}?id=${encodeURIComponent(runId)}&api_key=${PAIZA_GUEST}`,
      { signal: AbortSignal.timeout(10_000) }
    );
    if (!detailResp.ok) continue;

    const d = await detailResp.json();

    // Check if still running (status field, not result field)
    const status = (d?.status ?? "").toLowerCase();
    if (status === "running" || status === "waiting") continue;

    const stdout   = (d?.stdout       ?? "").trim();
    const buildErr = (d?.build_stderr ?? "").trim();
    const stderr   = (d?.stderr       ?? "").trim();
    const result   = (d?.result       ?? "success").toLowerCase();

    if (buildErr) {
      return { success: false, output: "", error: `Compile error: ${buildErr}` };
    }
    if (result === "failure" || result === "timeout") {
      return { success: false, output: stdout, error: stderr || `Execution ${result}` };
    }
    return { success: true, output: stdout, error: "" };
  }

  throw new Error("Paiza execution timed out");
}

// ─── Wandbox ───────────────────────────────────────────────────────────────

const WANDBOX_URL = "https://wandbox.org/api/compile.json";

const WANDBOX_COMPILER: Record<string, string> = {
  JAVASCRIPT: "nodejs-20.17.0",
  PYTHON:     "cpython-3.12.7",
  CPP:        "gcc-13.2.0",
};

const WANDBOX_OPTIONS: Record<string, string> = {
  CPP: "-std=c++17",
};

async function runWithWandbox(
  language: string,
  code:     string,
  stdin:    string
): Promise<{ success: boolean; output: string; error: string }> {
  const lang     = language.toUpperCase();
  const compiler = WANDBOX_COMPILER[lang];
  if (!compiler) throw new Error(`Unsupported language for Wandbox: ${language}`);

  const body: Record<string, string> = { compiler, code, stdin };
  if (WANDBOX_OPTIONS[lang]) body["compiler-option-raw"] = WANDBOX_OPTIONS[lang];

  // Wandbox occasionally returns transient 5xx errors — retry up to 3 times.
  let resp: Response | null = null;
  let lastStatus = 0;
  for (let attempt = 0; attempt < 3; attempt++) {
    resp = await fetch(WANDBOX_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
      signal:  AbortSignal.timeout(20_000),
    });
    if (resp.ok) break;
    lastStatus = resp.status;
    // Only retry on server-side errors (5xx); client errors won't improve with retry
    if (resp.status < 500) break;
    await new Promise((r) => setTimeout(r, 600 * (attempt + 1)));
  }

  if (!resp || !resp.ok) {
    throw new Error(`Wandbox HTTP ${resp?.status ?? lastStatus}: ${resp?.statusText ?? "unreachable"}`);
  }

  const data     = await resp.json();
  const exitCode = parseInt(data.status ?? "1", 10);
  const output   = (data.program_output ?? "").trim();
  const compErr  = (data.compiler_error ?? "").trim();
  const stderr   = (data.program_error  ?? "").trim();

  if (exitCode !== 0 || compErr) {
    return { success: false, output: "", error: compErr || stderr || "Execution error" };
  }
  return { success: true, output, error: "" };
}

// ─── Public facade ──────────────────────────────────────────────────────────

export interface RunResult {
  success: boolean;
  output:  string;
  error:   string;
}

/**
 * Runs code. Chain (ordered by current reliability, Feb 2026):
 *   JS     → local vm (instant, no API) → Wandbox → Paiza.io → Piston
 *   PY/CPP → Wandbox → Paiza.io → Piston
 *
 * NOTE: Piston's public API became whitelist-only (2/15/2026) and now returns 401,
 * so it is tried last. Paiza's guest API is heavily rate-limited on rapid
 * sequential calls, so Wandbox — which is reliable and unmetered — is tried first.
 */
export async function runCode(
  language: string,
  code:     string,
  stdin:    string
): Promise<RunResult> {
  const lang = language.toUpperCase();

  // 0a. JavaScript: run locally in Node.js vm — zero network, always available
  if (lang === "JAVASCRIPT" || lang === "JS") {
    try {
      const result = await runJavaScriptLocally(code, stdin);
      // Only use local result if it produced output or a clear error
      if (result.success || result.error) return result;
    } catch (e: any) {
      console.warn("[code-runner] Local JS runner failed:", e?.message);
    }
  }

  // 0b. C++: compile & run locally via g++ if installed
  if (lang === "CPP" || lang === "C++") {
    try {
      const r = await runCppLocally(code, stdin);
      // Return a definitive local result; only fall through when g++ is missing
      // or an older local toolchain rejected a compile (newer online gcc may accept).
      if (!r.notAvailable && !r.compileError) {
        return { success: r.success, output: r.output, error: r.error };
      }
      if (r.compileError) {
        console.warn("[code-runner] Local g++ compile failed, trying online:", r.error.slice(0, 120));
      }
    } catch (e: any) {
      console.warn("[code-runner] Local C++ runner failed:", e?.message);
    }
  }

  // 0c. Python: run locally via python if installed
  if (lang === "PYTHON" || lang === "PY") {
    try {
      const pyCmd = await getPythonCommand();
      if (pyCmd) {
        const r = await runPythonLocally(pyCmd, code, stdin);
        if (!r.notAvailable) {
          return { success: r.success, output: r.output, error: r.error };
        }
      }
    } catch (e: any) {
      console.warn("[code-runner] Local Python runner failed:", e?.message);
    }
  }

  const errors: string[] = [];

  // 1. Wandbox — most reliable free runner (no rate limit, no whitelist)
  try {
    return await runWithWandbox(language, code, stdin);
  } catch (e: any) {
    errors.push(`Wandbox: ${e?.message}`);
    console.warn("[code-runner] Wandbox failed:", e?.message);
  }

  // 2. Paiza.io — works but guest API is rate-limited
  try {
    return await runWithPaiza(language, code, stdin);
  } catch (e: any) {
    errors.push(`Paiza: ${e?.message}`);
    console.warn("[code-runner] Paiza failed:", e?.message);
  }

  // 3. Piston — public API is whitelist-only since 2/15/2026 (usually 401); last resort
  try {
    return await runWithPiston(language, code, stdin);
  } catch (e: any) {
    errors.push(`Piston: ${e?.message}`);
    console.warn("[code-runner] Piston failed:", e?.message);
  }

  throw new Error(
    "All code-execution services are unreachable. Tried: " + errors.join("; ")
  );
}
