import path from "node:path";
import { fileURLToPath } from "node:url";
import dotenv from "dotenv";
import { Template, defaultBuildLogger } from "e2b";
import { template } from "./template.js";

// Resolve .env from the repo root, not the current working directory.
const here = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(here, "../../.env") });

if (!process.env.E2B_API_KEY) {
  console.error("E2B_API_KEY not found in .env at the project root.");
  process.exit(1);
}

async function main() {
  await Template.build(template, "gen-v", {
    onBuildLogs: defaultBuildLogger(),
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
