/**
 * Deploy static site files to Cloudflare Pages (Direct Upload).
 * Each customer gets: https://{project}.pages.dev
 * Optional custom host: https://{project}.{CLOUDFLARE_PAGES_DOMAIN}
 *
 * Env (Vercel Production):
 *   CLOUDFLARE_ACCOUNT_ID
 *   CLOUDFLARE_API_TOKEN   (Account — Cloudflare Pages: Edit)
 *   CLOUDFLARE_PAGES_DOMAIN  (optional, e.g. goke.site → user.goke.site)
 */

import type { PublishFile } from "./siteStore";

const CF_API = "https://api.cloudflare.com/client/v4";

function accountId(): string {
  const id = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (!id) {
    throw new Error(
      "CLOUDFLARE_ACCOUNT_ID is not set. Add it in Vercel env (Cloudflare dashboard → Account ID)."
    );
  }
  return id;
}

function apiToken(): string {
  const t =
    process.env.CLOUDFLARE_API_TOKEN ||
    process.env.CF_API_TOKEN ||
    process.env.CLOUDFLARE_TOKEN;
  if (!t) {
    throw new Error(
      "CLOUDFLARE_API_TOKEN is not set. Create a token with Account → Cloudflare Pages → Edit."
    );
  }
  return t;
}

function headers(json = true): Record<string, string> {
  const h: Record<string, string> = {
    Authorization: `Bearer ${apiToken()}`,
  };
  if (json) h["Content-Type"] = "application/json";
  return h;
}

export interface CloudflareDeployResult {
  projectName: string;
  /** Live URL (pages.dev or custom subdomain) */
  siteUrl: string;
  deploymentId?: string;
  pagesDevUrl: string;
}

function sanitizeProjectName(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 58) || "goke-site"
  );
}

async function cfFetch(path: string, init?: RequestInit) {
  const res = await fetch(`${CF_API}${path}`, {
    ...init,
    headers: { ...headers(!(init?.body instanceof FormData)), ...(init?.headers ?? {}) },
  });
  const data = await res.json().catch(() => ({}));
  return { res, data };
}

/** Create Pages project if it does not exist */
async function ensureProject(projectName: string): Promise<void> {
  const getPath = `/accounts/${accountId()}/pages/projects/${projectName}`;
  const { res: getRes } = await cfFetch(getPath);
  if (getRes.ok) return;

  const { res, data } = await cfFetch(`/accounts/${accountId()}/pages/projects`, {
    method: "POST",
    body: JSON.stringify({
      name: projectName,
      production_branch: "main",
    }),
  });

  if (!res.ok) {
    // 409 already exists is fine
    const msg = JSON.stringify(data?.errors ?? data);
    if (res.status === 409 || /already exists/i.test(msg)) return;
    throw new Error(`Cloudflare Pages create project failed (${res.status}): ${msg}`);
  }
}

/**
 * Direct-upload all files as a production deployment.
 * Multipage: paths like about.html, styles.css, media/foo.jpg preserved.
 */
export async function deployToCloudflarePages(
  preferredName: string,
  files: PublishFile[]
): Promise<CloudflareDeployResult> {
  if (!files.length) {
    throw new Error("No files to deploy to Cloudflare Pages");
  }

  let projectName = sanitizeProjectName(preferredName);

  // Retry with suffix if name taken by another account-level conflict
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      await ensureProject(projectName);
      break;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (attempt < 3 && /already|taken|conflict|409/i.test(msg)) {
        projectName = `${sanitizeProjectName(preferredName)}-${Math.random()
          .toString(36)
          .slice(2, 5)}`;
        continue;
      }
      throw e;
    }
  }

  const form = new FormData();
  for (const f of files) {
    const path = f.path.replace(/^\//, "");
    if (!path || path === "editor.json" || path === "editor-meta.json") continue;

    const bytes = Buffer.from(f.contentBase64, "base64");
    const type = contentTypeFor(path);
    const blob = new Blob([bytes], { type });
    // Cloudflare Pages direct upload uses the filename as the path
    form.append(path, blob, path);
  }

  const { res, data } = await cfFetch(
    `/accounts/${accountId()}/pages/projects/${projectName}/deployments`,
    {
      method: "POST",
      // Let fetch set multipart boundary — do not set Content-Type manually
      headers: { Authorization: `Bearer ${apiToken()}` },
      body: form,
    }
  );

  if (!res.ok) {
    throw new Error(
      `Cloudflare Pages deploy failed (${res.status}): ${JSON.stringify(data?.errors ?? data)}`
    );
  }

  const deployment = data?.result;
  const pagesDevUrl =
    deployment?.url ||
    deployment?.aliases?.[0] ||
    `https://${projectName}.pages.dev`;

  // Prefer stable production URL
  const productionUrl = `https://${projectName}.pages.dev`;

  const customRoot = (process.env.CLOUDFLARE_PAGES_DOMAIN || "")
    .replace(/^https?:\/\//, "")
    .replace(/^\*\./, "")
    .replace(/\.$/, "")
    .trim();

  let siteUrl = productionUrl;
  if (customRoot) {
    // e.g. paxpearlbodyworks.goke.site — requires wildcard DNS + Pages custom domain setup
    siteUrl = `https://${projectName}.${customRoot}`;
    try {
      await attachCustomDomain(projectName, `${projectName}.${customRoot}`);
    } catch {
      // Domain attach is best-effort; pages.dev still works
      siteUrl = productionUrl;
    }
  }

  return {
    projectName,
    siteUrl,
    pagesDevUrl: productionUrl,
    deploymentId: deployment?.id,
  };
}

async function attachCustomDomain(
  projectName: string,
  hostname: string
): Promise<void> {
  const { res, data } = await cfFetch(
    `/accounts/${accountId()}/pages/projects/${projectName}/domains`,
    {
      method: "POST",
      body: JSON.stringify({ name: hostname }),
    }
  );
  if (!res.ok && res.status !== 409) {
    throw new Error(
      `Custom domain attach failed: ${JSON.stringify(data?.errors ?? data)}`
    );
  }
}

function contentTypeFor(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() || "";
  const map: Record<string, string> = {
    html: "text/html; charset=utf-8",
    css: "text/css; charset=utf-8",
    js: "application/javascript; charset=utf-8",
    json: "application/json",
    svg: "image/svg+xml",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    webp: "image/webp",
    gif: "image/gif",
    ico: "image/x-icon",
    woff: "font/woff",
    woff2: "font/woff2",
    txt: "text/plain",
    xml: "application/xml",
  };
  return map[ext] || "application/octet-stream";
}

/** True if Cloudflare env is configured */
export function isCloudflareConfigured(): boolean {
  return Boolean(
    process.env.CLOUDFLARE_ACCOUNT_ID &&
      (process.env.CLOUDFLARE_API_TOKEN ||
        process.env.CF_API_TOKEN ||
        process.env.CLOUDFLARE_TOKEN)
  );
}
