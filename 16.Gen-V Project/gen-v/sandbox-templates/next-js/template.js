import { Template, waitForPort } from "e2b";

export const template = Template()
  .fromImage("node:22-slim")
  .setUser("root")
  .runCmd(
    "apt-get update && apt-get install -y curl && apt-get clean && rm -rf /var/lib/apt/lists/*",
  )
  .copy("compile_page.sh", "/compile_page.sh")
  .runCmd("chmod +x /compile_page.sh")
  .setUser("user")
  // create-next-app refuses to scaffold into a non-empty directory (/home/user
  // already has shell dotfiles), so build in a scratch subfolder and flatten after.
  .setWorkdir("/home/user/nextjs-app")
  // JavaScript, not TypeScript. The system prompt instructs the agent to write
  // "app/page.jsx" and read "/home/user/components/ui/button.jsx". A TS scaffold
  // produces page.tsx/button.tsx, so every readFiles call misses and the agent
  // loops until maxIter with nothing written. It would also leave a duplicate
  // app/page.tsx + app/page.jsx conflict once the agent does write.
  .runCmd("npx --yes create-next-app@16.2.12 . --yes --no-git --js")
  // Pre-install shadcn deps manually to avoid container RAM spikes.
  .runCmd(
    "npm install clsx tailwind-merge class-variance-authority tw-animate-css lucide-react --no-audit --no-fund",
  )
  .runCmd("npx --yes shadcn@latest init -d --force")
  // The prompt promises the agent that every shadcn component already exists
  // under @/components/ui. `init` alone only creates components.json, so without
  // this the agent's imports resolve to nothing.
  .runCmd("npx --yes shadcn@latest add --all --yes")
  // --js scaffolds app/page.js and app/layout.js, but the prompt tells the agent
  // to write app/page.jsx. Both would resolve to the same route and Next errors
  // on the duplicate, so normalise to .jsx and let the agent overwrite it.
  .runCmd(
    "mv /home/user/nextjs-app/app/page.js /home/user/nextjs-app/app/page.jsx && mv /home/user/nextjs-app/app/layout.js /home/user/nextjs-app/app/layout.jsx",
  )
  // Flatten into /home/user so paths match the prompt's "You are already inside
  // /home/user" contract.
  .runCmd(
    "shopt -s dotglob && mv /home/user/nextjs-app/* /home/user/ && cd /home/user && rm -rf /home/user/nextjs-app",
  )
  .setWorkdir("/home/user")
  // Without a start command nothing listens on 3000 and the preview iframe
  // reports "no service running on port 3000".
  .setStartCmd("/compile_page.sh", waitForPort(3000));
