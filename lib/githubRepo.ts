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

// Creates a private repo (with an initial commit, so it has a branch to push
// to) named after the customer's chosen subdomain, and pushes the generated
// files into it. Only called once payment has succeeded -- nothing gets
// created in your GitHub account for visitors who never pay. If the name is
// taken, retries with a short random suffix (GitHub repo names only need to
// be unique within your account, so collisions should be rare).
export async function createRepoWithFiles(
  files: Record<string, string>,
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

  await Promise.all(
    Object.entries(files).map(([path, content]) => pushFile(owner, repoName, path, content, defaultBranch))
  );

  return { owner, repoName, repoUrl: repo.html_url, defaultBranch };
}

async function pushFile(
  owner: string,
  repo: string,
  path: string,
  content: string,
  branch: string
): Promise<void> {
  const res = await gh(`/repos/${owner}/${repo}/contents/${encodeURIComponent(path)}`, {
    method: "PUT",
    body: JSON.stringify({
      message: `Add ${path}`,
      content: Buffer.from(content, "utf-8").toString("base64"),
      branch,
    }),
  });
  if (!res.ok) throw new Error(`GitHub push failed for ${path}: ${res.status} ${await res.text()}`);
}
