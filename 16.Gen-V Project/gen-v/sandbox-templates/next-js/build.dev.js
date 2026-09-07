import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { Template, defaultBuildLogger } from "e2b";
import { template } from "./template.js";

// `dotenv/config` resolves .env from the current working directory, which fails
// when this script is run from its own folder. Resolve the repo root instead so
// E2B_API_KEY is found regardless of where you invoke it from.
const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(here, "../../.env") });

if (!process.env.E2B_API_KEY) {
  console.error("E2B_API_KEY not found in .env at the project root.");
  process.exit(1);
}

async function main() {
  await Template.build(template, "gen-v-dev", {
    // Defaults are 2 CPU / 1024 MB. Next 16 + Turbopack compiling a page that
    // imports shadcn components OOMs in 1 GB: the dev server is killed and
    // Turbopack surfaces it as "Failed to write app endpoint /page", which the
    // preview iframe shows as a 500.
    // Measured: at 2048 MB the resumed snapshot already holds ~1800 MB (the
    // pre-warmed Turbopack dev server), leaving ~180 MB. Compiling a generated
    // page with ~10 shadcn imports OOM-kills `next dev`, after which the
    // preview serves 502 or refuses the port and never recovers.
    cpuCount: 2,
    memoryMB: 4096,
    onBuildLogs: defaultBuildLogger(),
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
