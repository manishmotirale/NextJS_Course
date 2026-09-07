import { inngest } from "./client";
import { NonRetriableError } from "inngest";
import {
  createAgent,
  createTool,
  createNetwork,
  createState,
} from "@inngest/agent-kit";
import { createTextModel, createToolModel } from "./model";
import Sandbox from "@e2b/code-interpreter";
import z from "zod";
import { FRAGMENT_TITLE_PROMPT, PROMPT, RESPONSE_PROMPT } from "@/prompt";
import { lastAssistantTextMessageContent } from "./utils";
import db from "@/lib/db";
import { MessageRole, MessageType } from "@prisma/client";

/**
 * Tool results are replayed into the model context on every subsequent turn,
 * so a single noisy command (npm install writes thousands of lines) gets
 * re-sent up to `maxIter` times and blows the 131k context window, producing
 * "Please reduce the length of the messages or completion" from the provider.
 * Keep the tail, which is where errors and summaries land.
 */
const MAX_TERMINAL_CHARS = 4000;

/**
 * Paths excluded from the project snapshot. Measured on a real sandbox: the full
 * project is 87 files / 617KB, but 376KB of that is package-lock.json and the
 * npm cache alone is 763MB across 11k files.
 */
const SNAPSHOT_EXCLUDES = [
  "./node_modules/*",
  "./.next/*",
  "./.git/*",
  "./.npm/*",
  "./.cache/*",
  "./.config/*",
];

/**
 * Lockfiles are excluded because package-lock.json alone is 376KB of the 617KB
 * project. The shell dotfiles are only there because the app is flattened into
 * /home/user, and they are not part of the generated project.
 */
const SNAPSHOT_SKIP_NAMES = [
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  ".bashrc",
  ".bash_logout",
  ".bash_history",
  ".profile",
  ".npmrc",
  ".viminfo",
];
const MAX_SNAPSHOT_FILE_BYTES = 128 * 1024;
const MAX_READ_FILES_CHARS = 12000;
const MAX_HISTORY_MESSAGE_CHARS = 2000;
const MAX_HISTORY_MESSAGES = 10;

const truncateTail = (text, limit) => {
  const str = typeof text === "string" ? text : String(text ?? "");

  if (str.length <= limit) return str;

  const omitted = str.length - limit;
  return `[truncated ${omitted} characters]\n...${str.slice(-limit)}`;
};

const truncateHead = (text, limit) => {
  const str = typeof text === "string" ? text : String(text ?? "");

  if (str.length <= limit) return str;

  return `${str.slice(0, limit)}\n...[truncated ${str.length - limit} characters]`;
};

/**
 * Models reliably emit the React directive without its quotes (`use client;`),
 * because in the system prompt the quotes read as prompt punctuation rather than
 * part of the code. Bare `use client;` is a syntax error that fails the whole
 * page with: Expected ';', '}'.
 *
 * Only rewrites a bare directive on the first non-empty line, so real code is
 * never touched.
 */
/**
 * Valid lucide-react export names, read from the sandbox itself so the list
 * always matches the installed version. Cached because it is ~6k names and does
 * not change between runs.
 */
let cachedIconNames = null;

const getValidIconNames = async (sandbox) => {
  if (cachedIconNames) return cachedIconNames;

  try {
    const res = await sandbox.commands.run(
      `cd /home/user && node --input-type=module -e "import * as icons from 'lucide-react'; console.log(Object.keys(icons).filter(n => /^[A-Z]/.test(n)).join(','))"`,
      { timeoutMs: 60000 },
    );

    const names = res.stdout.trim().split(",").filter(Boolean);

    if (names.length > 0) cachedIconNames = new Set(names);
  } catch (error) {
    console.error("Could not enumerate lucide-react icons:", error);
  }

  return cachedIconNames;
};

/**
 * Models routinely invent lucide icon names. `PaperPlaneIcon` and every brand
 * icon (Github, Twitter, Linkedin, ...) were removed in lucide-react v1, and a
 * single bad name is a hard build failure:
 *   Export PaperPlaneIcon doesn't exist in target module
 * Returning the invalid names as the tool result lets the agent correct itself.
 */
const findInvalidIconImports = (content, validNames) => {
  if (!validNames || typeof content !== "string") return [];

  const invalid = [];
  const importRe = /import\s*\{([^}]*)\}\s*from\s*["']lucide-react["']/g;

  let match;
  while ((match = importRe.exec(content)) !== null) {
    for (const raw of match[1].split(",")) {
      // Handle `Foo as Bar` - only the imported name matters.
      const name = raw.trim().split(/\s+as\s+/)[0].trim();

      if (name && !validNames.has(name)) invalid.push(name);
    }
  }

  return [...new Set(invalid)];
};

const normalizeClientDirective = (content) => {
  if (typeof content !== "string") return content;

  return content.replace(
    /^(\s*)(use\s+(?:client|server))\s*;?[ \t]*(\r?\n|$)/,
    (_match, leading, directive, newline) => {
      const kind = directive.split(/\s+/)[1];
      return `${leading}"use ${kind}";${newline || "\n"}`;
    },
  );
};

export const codeAgentFunction = inngest.createFunction(
  {
    id: "code-agent",
    triggers: [{ event: "code-agent/run" }],
  },

  async ({ event, step }) => {
    // Validate the payload before doing any expensive work. Without this a
    // manual invoke from the Inngest dev UI (which sends no `data`) burns a
    // sandbox and a full agent run, then dies at the final DB write. Worse,
    // `findMany({ where: { projectId: undefined } })` is treated by Prisma as
    // "no filter", so the agent would be fed every message in the database.
    const projectId = event.data?.projectId;
    const value = event.data?.value;

    if (!projectId || typeof projectId !== "string") {
      throw new NonRetriableError(
        'code-agent/run received no data.projectId, which happens when the function is invoked from the Inngest dev UI with an empty payload. Submit a prompt in the app instead, or paste a payload like: { "value": "build a landing page", "projectId": "<an existing project id>" }',
      );
    }

    if (!value || typeof value !== "string" || !value.trim()) {
      throw new NonRetriableError(
        "code-agent/run requires a non-empty data.value prompt.",
      );
    }

    const projectExists = await step.run("verify-project", async () => {
      const project = await db.project.findUnique({
        where: { id: projectId },
        select: { id: true },
      });

      return Boolean(project);
    });

    if (!projectExists) {
      throw new NonRetriableError(`Project ${projectId} does not exist.`);
    }

    // Step-1
    const sandboxId = await step.run("get-sandbox-id", async () => {
      // E2B sandboxes default to a 5 minute timeout, which a multi-step
      // generation run can easily exceed, killing the sandbox mid-run.
      const sandbox = await Sandbox.create("manishs-project/gen-v-dev", {
        timeoutMs: 15 * 60 * 1000,
      });
      return sandbox.sandboxId;
    });

    const previousMessages = await step.run(
      "get-previous-messages",
      async () => {
        const formattedMessages = [];

        const messages = await db.message.findMany({
          where: {
            projectId: projectId,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: MAX_HISTORY_MESSAGES,
        });

        // Take the most recent, then flip to chronological order so the agent
        // receives the conversation oldest -> newest.
        for (const message of messages.reverse()) {
          formattedMessages.push({
            type: "text",
            role: message.role === "ASSISTANT" ? "assistant" : "user",
            content: truncateHead(message.content, MAX_HISTORY_MESSAGE_CHARS),
          });
        }

        return formattedMessages;
      },
    );

    const state = createState(
      {
        summary: "",
        files: {},
      },
      {
        messages: previousMessages,
      },
    );

    const codeAgent = createAgent({
      name: "code-agent",
      description: "An expert coding agent",
      system: PROMPT,
      model: createToolModel(),
      tools: [
        // 1. Terminal
        createTool({
          name: "terminal",
          description: "Use the terminal to run commands",
          parameters: z.object({
            command: z.string(),
          }),
          handler: async ({ command }, { step }) => {
            return await step?.run("terminal", async () => {
              const buffers = { stdout: "", stderr: "" };

              try {
                const sandbox = await Sandbox.connect(sandboxId);

                const result = await sandbox.commands.run(command, {
                  onStdout: (data) => {
                    buffers.stdout += data;
                  },

                  onStderr: (data) => {
                    buffers.stderr += data;
                  },
                });

                return truncateTail(result.stdout, MAX_TERMINAL_CHARS);
              } catch (error) {
                const detail = `Command failed: ${error} \n stdout: ${buffers.stdout}\n stderr: ${buffers.stderr}`;

                console.log(detail);

                return truncateTail(detail, MAX_TERMINAL_CHARS);
              }
            });
          },
        }),
        // 2. createOrUpdateFiles

        createTool({
          name: "createOrUpdateFiles",
          description: "Create or update files in the sanbox",
          parameters: z.object({
            files: z.array(
              z.object({
                path: z.string(),
                content: z.string(),
              }),
            ),
          }),

          handler: async ({ files }, { step, network }) => {
            const newFiles = await step?.run(
              "createOrUpdateFiles",
              async () => {
                try {
                  const updatedFiles = { ...(network?.state?.data?.files || {}) };

                  const sanbox = await Sandbox.connect(sandboxId);

                  const validIcons = await getValidIconNames(sanbox);
                  const iconProblems = [];

                  for (const file of files) {
                    const content = normalizeClientDirective(file.content);

                    const invalid = findInvalidIconImports(content, validIcons);

                    if (invalid.length > 0) {
                      iconProblems.push(`${file.path}: ${invalid.join(", ")}`);
                    }

                    await sanbox.files.write(file.path, content);
                    updatedFiles[file.path] = content;
                  }

                  if (iconProblems.length > 0) {
                    return {
                      files: updatedFiles,
                      iconError:
                        `These icons do not exist in lucide-react and WILL break the build:\n` +
                        iconProblems.join("\n") +
                        `\nlucide-react has no brand or social icons (no Github, Twitter, Linkedin, Facebook, Instagram) and no PaperPlaneIcon. ` +
                        `Use real names such as Send, SendHorizontal, Mail, Link, Share2, Globe, ShoppingCart, Star, Heart, User, Menu, X, Search. ` +
                        `Call createOrUpdateFiles again with the imports corrected.`,
                    };
                  }

                  return updatedFiles;
                } catch (error) {
                  return "Error" + error;
                }
              },
            );

            if (newFiles && typeof newFiles === "object") {
              // Icon validation failed: the files were written, but the imports
              // will not compile. Record them so later writes build on this
              // state, then hand the problem back to the agent.
              if (newFiles.iconError) {
                if (network) network.state.data.files = newFiles.files;

                return newFiles.iconError;
              }

              if (network) network.state.data.files = newFiles;

              // Return a short confirmation instead of the whole file map,
              // which would otherwise be fed back into the model context.
              return "Files created or updated successfully";
            }

            return typeof newFiles === "string"
              ? newFiles
              : "Error: files could not be written";
          },
        }), // 3. readFiles
        createTool({
          name: "readFiles",
          description: "Read files in the sandbox",

          parameters: z.object({
            files: z.array(z.string()),
          }),
          handler: async ({ files }, { step }) => {
            return await step?.run("readFiles", async () => {
              try {
                const sanbox = await Sandbox.connect(sandboxId);

                const contents = [];

                // Report per-file failures instead of aborting the whole call,
                // so a single bad path tells the agent what to fix rather than
                // leaving it to retry the same request blindly.
                for (const file of files) {
                  try {
                    const content = await sanbox.files.read(file);
                    contents.push({ path: file, content });
                  } catch (fileError) {
                    contents.push({
                      path: file,
                      error: `Could not read "${file}": ${fileError}. The app root is /home/user, so use paths like /home/user/app/page.jsx.`,
                    });
                  }
                }

                return truncateHead(
                  JSON.stringify(contents),
                  MAX_READ_FILES_CHARS,
                );
              } catch (error) {
                return "Error" + error;
              }
            });
          },
        }),
      ],

      lifecycle: {
        onResponse: async ({ result, network }) => {
          const lastAssistantMessageText =
            lastAssistantTextMessageContent(result);

          if (lastAssistantMessageText && network) {
            if (lastAssistantMessageText.includes("<task_summary>")) {
              network.state.data.summary = lastAssistantMessageText;
            }
          }

          return result;
        },
      },
    });

    const network = createNetwork({
      name: "coding-agent-network",
      agents: [codeAgent],
      maxIter: 10,

      router: async ({ network }) => {
        const summary = network.state.data.summary;

        if (summary) {
          return;
        }

        return codeAgent;
      },
    });

    const result = await network.run(value, { state });

    const summary = result.state.data.summary;
    const generatedFiles = result.state.data.files || {};

    // Decide this before spending two more model calls. Asking a title
    // generator to summarise an empty string just gets you a title like
    // "Could you provide the <task_summary>?".
    const isError = !summary || Object.keys(generatedFiles).length === 0;

    const fragmentTitleGenerator = createAgent({
      name: "fragment-title-generator",
      description: "Generate a title for the fragment",
      system: FRAGMENT_TITLE_PROMPT,
      model: createTextModel(),
    });

    const responseGenerator = createAgent({
      name: "response-generator",
      description: "Generate a response for the fragment",
      system: RESPONSE_PROMPT,
      model: createTextModel(),
    });

    const [fragmentTitleOutput, responseOutput] = isError
      ? [null, null]
      : await Promise.all([
          fragmentTitleGenerator.run(summary).then((r) => r.output),
          responseGenerator.run(summary).then((r) => r.output),
        ]);

    // Content can be a string or an array of `{ type: "text", text }` parts,
    // so the parts need `.text` pulled out of them.
    const readTextOutput = (output, fallback) => {
      const first = output?.[0];

      if (!first || first.type !== "text") {
        return fallback;
      }

      if (Array.isArray(first.content)) {
        return first.content.map((c) => c?.text ?? "").join("") || fallback;
      }

      return first.content || fallback;
    };

    const generateFragmentTitle = () =>
      readTextOutput(fragmentTitleOutput, "Untitled");

    const generateResponse = () => readTextOutput(responseOutput, "Here you go");

    // Capture the whole project, not just what the agent wrote, so the file
    // explorer shows a real project and download / GitHub export stay useful
    // long after the sandbox is gone.
    const projectFiles = await step.run("snapshot-project-files", async () => {
      if (isError) return null;

      try {
        const sandbox = await Sandbox.connect(sandboxId);

        const prune = SNAPSHOT_EXCLUDES.map((p) => `-not -path '${p}'`).join(" ");

        const listed = await sandbox.commands.run(
          `cd /home/user && find . -type f ${prune} -not -name '*.ico' -not -name '*.png' -not -name '*.jpg' -not -name '*.woff*' -size -${Math.floor(MAX_SNAPSHOT_FILE_BYTES / 1024)}k -printf '%p\\n'`,
          { timeoutMs: 60000 },
        );

        const paths = listed.stdout
          .split("\n")
          .map((line) => line.trim())
          .filter(Boolean)
          .map((p) => p.replace(/^\.\//, ""))
          .filter((p) => !SNAPSHOT_SKIP_NAMES.includes(p.split("/").pop()));

        const snapshot = {};
        const concurrency = 8;

        for (let i = 0; i < paths.length; i += concurrency) {
          const batch = paths.slice(i, i + concurrency);

          await Promise.all(
            batch.map(async (relative) => {
              try {
                snapshot[relative] = await sandbox.files.read(
                  `/home/user/${relative}`,
                );
              } catch {
                // Skip anything unreadable rather than failing the whole run.
              }
            }),
          );
        }

        return Object.keys(snapshot).length > 0 ? snapshot : null;
      } catch (error) {
        console.error("Failed to snapshot project files:", error);
        return null;
      }
    });

    const sandboxUrl = await step.run("get-sandbox-url", async () => {
      const sandbox = await Sandbox.connect(sandboxId);
      const host = sandbox.getHost(3000);

      // E2B sandbox hosts are served over TLS. Using http:// gets blocked as
      // mixed content when the app itself is served over https.
      return `https://${host}`;
    });

    // The dev server can die while compiling what the agent just wrote, which
    // leaves the preview iframe showing "no service running on port 3000" or a
    // permanent 502. Confirm it is serving and restart it once if not, so the
    // saved URL is not dead on arrival.
    await step.run("ensure-preview-ready", async () => {
      const sandbox = await Sandbox.connect(sandboxId);

      const probe = async () => {
        const res = await sandbox.commands.run(
          `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000`,
          { timeoutMs: 30000 },
        );
        return res.stdout.trim();
      };

      const isUp = async (attempts) => {
        for (let i = 0; i < attempts; i++) {
          const code = await probe().catch(() => "000");

          if (code !== "000" && !code.startsWith("5")) return true;

          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
        return false;
      };

      if (await isUp(10)) return "ready";

      // Must be an E2B background process. Shell backgrounding (`nohup ... &`)
      // dies with the command handle and does not recover the server.
      await sandbox.commands.run("pkill -f 'next dev' || true").catch(() => {});
      await sandbox.commands
        .run("/compile_page.sh", { background: true, timeoutMs: 0 })
        .catch(() => {});

      return (await isUp(30)) ? "recovered" : "unavailable";
    });

    await step.run("save-result", async () => {
      if (isError) {
        return await db.message.create({
          data: {
            projectId: projectId,
            content: "Something went wrong. Please try again",
            role: MessageRole.ASSISTANT,
            type: MessageType.ERROR,
          },
        });
      }

      return await db.message.create({
        data: {
          projectId: projectId,
          content: generateResponse(),
          role: MessageRole.ASSISTANT,
          type: MessageType.RESULT,
          fragments: {
            create: {
              sandboxUrl: sandboxUrl,
              title: generateFragmentTitle(),
              files: generatedFiles,
              projectFiles: projectFiles ?? undefined,
            },
          },
        },
      });
    });

    return {
      url: sandboxUrl,
      title: isError ? "Untitled" : generateFragmentTitle(),
      files: generatedFiles,
      summary: summary,
      isError,
    };
  },
);
