/**
 * Create a private GitHub repo and push site files immediately after payment.
 * Uses sequential Contents API writes with 409 retry (parallel pushes race).
 */

const GITHUB_API = "https://api.github.com";

function token(): string {
  const t =
    process.env.GITHUB_TOKEN ||
    process.env.GH_TOKEN ||
    process.env.GITHUB_PAT;
  if (!t) {
    throw new Error(
      "GITHUB_TOKEN is not set. Add a classic PAT with repo scope in Vercel env."
    );
  }
  return t;
}

function headers(): Record<string, string> {
  return {
    Authorization: `Bearer ${token()}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "User-Agent": "goke-site-publisher",
  };
}

async function gh(path: string, init?: RequestInit) {
  const res = await fetch(`${GITHUB_API}${path}`, {
    ...init,
    headers: { ...headers(), ...(init?.headers ?? {}) },
  });
  return res;
}

export interface CreatedRepo {
  owner: string;
  repoName: string;
  repoUrl: string;
  defaultBranch: string;
}

export type RepoFile =
  | { path: string; content: string; encoding?: "utf-8" }
  | { path: string; contentBase64: string };

function sanitizeRepoName(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 50) || "goke-site";
}

/** Create private repo and push all files. */
export async function createRepoWithFiles(
  files: Record<string, string> | RepoFile[],
  preferredName: string
): Promise<CreatedRepo> {
  let name = sanitizeRepoName(preferredName);
  let repo: any = null;

  for (let attempt = 0; attempt < 6; attempt++) {
    const res = await gh("/user/repos", {
      method: "POST",
      body: JSON.stringify({
        name,
        private: true,
        auto_init: true,
        description: "Published with gòke",
      }),
    });
    if (res.ok) {
      repo = await res.json();
      break;
    }
    const body = await res.text();
    if (res.status === 422) {
      // name taken
      name = `${sanitizeRepoName(preferredName)}-${Math.random()
        .toString(36)
        .slice(2, 6)}`;
      continue;
    }
    if (res.status === 401 || res.status === 403) {
      throw new Error(
        `GitHub auth failed (${res.status}). Check GITHUB_TOKEN has "repo" scope. ${body}`
      );
    }
    throw new Error(`GitHub repo creation failed: ${res.status} ${body}`);
  }
  if (!repo) {
    throw new Error("GitHub repo creation failed after retries (name collisions).");
  }

  // Brief wait so auto_init default branch exists
  await new Promise((r) => setTimeout(r, 800));

  const owner = repo.owner.login as string;
  const repoName = repo.name as string;
  const defaultBranch = (repo.default_branch as string) || "main";

  const list: RepoFile[] = Array.isArray(files)
    ? files
    : Object.entries(files).map(([path, content]) => ({ path, content }));

  // Sequential pushes — parallel Contents API causes 409 conflicts
  for (const f of list) {
    await pushFile(owner, repoName, f, defaultBranch);
  }

  return { owner, repoName, repoUrl: repo.html_url as string, defaultBranch };
}

async function pushFile(
  owner: string,
  repo: string,
  file: RepoFile,
  branch: string
): Promise<void> {
  const path = file.path.replace(/^\//, "");
  if (!path) return;

  const contentBase64 =
    "contentBase64" in file
      ? file.contentBase64
      : Buffer.from(file.content, "utf-8").toString("base64");

  const encodedPath = path
    .split("/")
    .map((s) => encodeURIComponent(s))
    .join("/");

  for (let attempt = 0; attempt < 5; attempt++) {
    let sha: string | undefined;
    try {
      const getRes = await gh(
        `/repos/${owner}/${repo}/contents/${encodedPath}?ref=${encodeURIComponent(branch)}`
      );
      if (getRes.ok) {
        const existing = await getRes.json();
        sha = existing.sha;
      }
    } catch {
      /* create new */
    }

    const res = await gh(`/repos/${owner}/${repo}/contents/${encodedPath}`, {
      method: "PUT",
      body: JSON.stringify({
        message: `Add ${path}`,
        content: contentBase64,
        branch,
        ...(sha ? { sha } : {}),
      }),
    });

    if (res.ok) return;

    const text = await res.text();
    // 409 = concurrent update; retry with fresh sha
    if (res.status === 409 || res.status === 422) {
      await new Promise((r) => setTimeout(r, 300 * (attempt + 1)));
      continue;
    }
    throw new Error(
      `GitHub file push failed for ${path}: ${res.status} ${text}`
    );
  }
  throw new Error(`GitHub file push failed for ${path} after retries`);
}
