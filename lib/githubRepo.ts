const GITHUB_API = "https://api.github.com";

function headers() {
  return {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
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

// Creates a private repo and pushes files. contentBase64 preferred for binary.
export async function createRepoWithFiles(
  files: Record<string, string> | RepoFile[],
  preferredName: string
): Promise<CreatedRepo> {
  let name = preferredName;
  let repo: any = null;

  for (let attempt = 0; attempt < 5; attempt++) {
    const res = await gh("/user/repos", {
      method: "POST",
      body: JSON.stringify({ name, private: true, auto_init: true }),
    });
    if (res.ok) {
      repo = await res.json();
      break;
    }
    if (res.status === 422) {
      name = `${preferredName}-${Math.random().toString(36).slice(2, 6)}`;
      continue;
    }
    throw new Error(`GitHub repo creation failed: ${res.status} ${await res.text()}`);
  }
  if (!repo) throw new Error("GitHub repo creation failed after retries (name collisions).");

  const owner = repo.owner.login as string;
  const repoName = repo.name as string;
  const defaultBranch = repo.default_branch as string;

  const list: RepoFile[] = Array.isArray(files)
    ? files
    : Object.entries(files).map(([path, content]) => ({ path, content }));

  await Promise.all(
    list.map((f) => pushFile(owner, repoName, f, defaultBranch))
  );

  return { owner, repoName, repoUrl: repo.html_url, defaultBranch };
}

async function pushFile(
  owner: string,
  repo: string,
  file: RepoFile,
  branch: string
): Promise<void> {
  const path = file.path;
  const contentBase64 =
    "contentBase64" in file
      ? file.contentBase64
      : Buffer.from(file.content, "utf-8").toString("base64");

  const res = await gh(
    `/repos/${owner}/${repo}/contents/${path
      .split("/")
      .map(encodeURIComponent)
      .join("/")}`,
    {
      method: "PUT",
      body: JSON.stringify({
        message: `Add ${path}`,
        content: contentBase64,
        branch,
      }),
    }
  );

  if (!res.ok) {
    throw new Error(
      `GitHub file push failed for ${path}: ${res.status} ${await res.text()}`
    );
  }
}
