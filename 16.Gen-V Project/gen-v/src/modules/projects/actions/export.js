"use server";

import JSZip from "jszip";
import db from "@/lib/db";
import { getCurrentUser } from "@/modules/auth/actions";

/**
 * Loads a fragment the caller is allowed to see, together with its project files.
 * Ownership is checked through message -> project -> userId so one user cannot
 * export another user's generation.
 */
async function loadOwnedFragment(fragmentId) {
  const user = await getCurrentUser();

  if (!user) throw new Error("Unauthorized");
  if (!fragmentId) throw new Error("Fragment id is required");

  const fragment = await db.fragment.findFirst({
    where: {
      id: fragmentId,
      message: {
        project: {
          userId: user.id,
        },
      },
    },
    include: {
      message: {
        include: {
          project: true,
        },
      },
    },
  });

  if (!fragment) throw new Error("Fragment not found");

  return fragment;
}

/** Full project when we captured it, otherwise just the generated files. */
function resolveFiles(fragment) {
  const project = fragment.projectFiles;

  if (project && typeof project === "object" && Object.keys(project).length > 0) {
    return { files: project, complete: true };
  }

  return { files: fragment.files ?? {}, complete: false };
}

const README = (title, projectName, complete) => `# ${title}

Generated with Gen-V from the project "${projectName}".

## Getting started

\`\`\`bash
npm install
npm run dev
\`\`\`

Then open http://localhost:3000.
${
  complete
    ? ""
    : `
> Note: this archive contains only the files that were generated for this
> version, not the surrounding Next.js scaffold. Drop them into a Next.js app
> with Tailwind CSS and shadcn/ui installed.
`
}`;

/**
 * Builds a zip of the fragment and returns it base64 encoded, because server
 * actions cannot stream binary directly to the client.
 */
export const downloadFragment = async (fragmentId) => {
  const fragment = await loadOwnedFragment(fragmentId);
  const { files, complete } = resolveFiles(fragment);

  if (Object.keys(files).length === 0) {
    throw new Error("This version has no files to download");
  }

  const zip = new JSZip();

  for (const [path, content] of Object.entries(files)) {
    zip.file(path, typeof content === "string" ? content : String(content ?? ""));
  }

  if (!files["README.md"]) {
    zip.file(
      "README.md",
      README(fragment.title, fragment.message.project.name, complete),
    );
  }

  const base64 = await zip.generateAsync({
    type: "base64",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  const safeName =
    fragment.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "gen-v-project";

  return {
    base64,
    filename: `${safeName}.zip`,
    fileCount: Object.keys(files).length,
    complete,
  };
};

const GITHUB_API = "https://api.github.com";

async function github(token, endpoint, options = {}) {
  const res = await fetch(`${GITHUB_API}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${token}`,
      "X-GitHub-Api-Version": "2022-11-28",
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      body?.message ?? `GitHub request failed with status ${res.status}`;

    throw new Error(
      res.status === 401
        ? "GitHub rejected the token. Check that it is valid and has the `repo` scope."
        : message,
    );
  }

  return body;
}

/**
 * Pushes a fragment to GitHub as a single commit.
 *
 * The token is used for this request only and never stored. It needs the `repo`
 * scope (classic) or Contents read/write (fine-grained).
 */
export const exportFragmentToGithub = async ({
  fragmentId,
  token,
  repoName,
  isPrivate = true,
}) => {
  const fragment = await loadOwnedFragment(fragmentId);
  const { files, complete } = resolveFiles(fragment);

  if (!token?.trim()) throw new Error("A GitHub token is required");
  if (!repoName?.trim()) throw new Error("A repository name is required");

  const entries = Object.entries(files);

  if (entries.length === 0) {
    throw new Error("This version has no files to export");
  }

  const cleanToken = token.trim();
  const cleanRepo = repoName
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "");

  const account = await github(cleanToken, "/user");

  // Reuse the repo if it already exists so a retry is not a hard failure.
  let repo = await github(
    cleanToken,
    `/repos/${account.login}/${cleanRepo}`,
  ).catch(() => null);

  if (!repo) {
    repo = await github(cleanToken, "/user/repos", {
      method: "POST",
      body: JSON.stringify({
        name: cleanRepo,
        description: `${fragment.title} - generated with Gen-V`,
        private: Boolean(isPrivate),
        auto_init: true,
      }),
    });

    // auto_init commits asynchronously; wait for the default branch to exist.
    for (let attempt = 0; attempt < 10; attempt++) {
      const ref = await github(
        cleanToken,
        `/repos/${account.login}/${cleanRepo}/git/ref/heads/${repo.default_branch}`,
      ).catch(() => null);

      if (ref) break;

      await new Promise((resolve) => setTimeout(resolve, 1500));
    }
  }

  const owner = account.login;
  const branch = repo.default_branch || "main";

  const withReadme = entries.some(([p]) => p === "README.md")
    ? entries
    : [
        ...entries,
        [
          "README.md",
          README(fragment.title, fragment.message.project.name, complete),
        ],
      ];

  // One blob per file, then a single tree and commit. Cheaper and atomic
  // compared with the contents API per file.
  const blobs = [];

  for (const [path, content] of withReadme) {
    const blob = await github(cleanToken, `/repos/${owner}/${cleanRepo}/git/blobs`, {
      method: "POST",
      body: JSON.stringify({
        content: Buffer.from(
          typeof content === "string" ? content : String(content ?? ""),
        ).toString("base64"),
        encoding: "base64",
      }),
    });

    blobs.push({
      path,
      mode: "100644",
      type: "blob",
      sha: blob.sha,
    });
  }

  const head = await github(
    cleanToken,
    `/repos/${owner}/${cleanRepo}/git/ref/heads/${branch}`,
  ).catch(() => null);

  const tree = await github(cleanToken, `/repos/${owner}/${cleanRepo}/git/trees`, {
    method: "POST",
    body: JSON.stringify({
      tree: blobs,
      ...(head ? { base_tree: undefined } : {}),
    }),
  });

  const commit = await github(
    cleanToken,
    `/repos/${owner}/${cleanRepo}/git/commits`,
    {
      method: "POST",
      body: JSON.stringify({
        message: `${fragment.title}\n\nGenerated with Gen-V`,
        tree: tree.sha,
        parents: head?.object?.sha ? [head.object.sha] : [],
      }),
    },
  );

  await github(cleanToken, `/repos/${owner}/${cleanRepo}/git/refs/heads/${branch}`, {
    method: "PATCH",
    body: JSON.stringify({ sha: commit.sha, force: true }),
  });

  return {
    url: repo.html_url,
    repo: `${owner}/${cleanRepo}`,
    fileCount: withReadme.length,
    complete,
  };
};
