/**
 * Cloudflare Pages Direct Upload (Wrangler-compatible protocol)
 *
 * 1) Ensure project exists
 * 2) GET upload-token (JWT)
 * 3) Hash files (MD5 hex) + POST /pages/assets/upload
 * 4) POST deployments with multipart form field `manifest`
 *
 * Env:
 *   CLOUDFLARE_ACCOUNT_ID
 *   CLOUDFLARE_API_TOKEN
 *   CLOUDFLARE_PAGES_DOMAIN (optional)
 */

import { createHash } from "crypto";
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

function authHeader(): Record<string, string> {
  return { Authorization: `Bearer ${apiToken()}` };
}

export interface CloudflareDeployResult {
  projectName: string;
  siteUrl: string;
  pagesDevUrl: string;
  deploymentId?: string;
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

function md5Hex(buf: Buffer): string {
  return createHash("md5").update(buf).digest("hex");
}

function contentTypeFor(path: string): string {
  const ext = path.split(".").pop()?.toLowerCase() || "";
  const map: Record<string, string> = {
    html: "text/html; charset=utf-8",
    css: "text/css; charset=utf-8",
    js: "application/javascript; charset=utf-8",
    mjs: "application/javascript; charset=utf-8",
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
    map: "application/json",
  };
  return map[ext] || "application/octet-stream";
}

async function cfJson(
  path: string,
  init?: RequestInit
): Promise<{ ok: boolean; status: number; data: any }> {
  const res = await fetch(`${CF_API}${path}`, {
    ...init,
    headers: {
      ...authHeader(),
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok, status: res.status, data };
}

async function ensureProject(projectName: string): Promise<void> {
  const get = await cfJson(
    `/accounts/${accountId()}/pages/projects/${projectName}`
  );
  if (get.ok) return;

  const created = await cfJson(`/accounts/${accountId()}/pages/projects`, {
    method: "POST",
    body: JSON.stringify({
      name: projectName,
      production_branch: "main",
    }),
  });

  if (created.ok) return;
  const msg = JSON.stringify(created.data?.errors ?? created.data);
  if (created.status === 409 || /already exists/i.test(msg)) return;
  throw new Error(
    `Cloudflare Pages create project failed (${created.status}): ${msg}`
  );
}

async function getUploadToken(projectName: string): Promise<string> {
  const { ok, status, data } = await cfJson(
    `/accounts/${accountId()}/pages/projects/${projectName}/upload-token`
  );
  if (!ok || !data?.result?.jwt) {
    throw new Error(
      `Cloudflare upload-token failed (${status}): ${JSON.stringify(data?.errors ?? data)}`
    );
  }
  return data.result.jwt as string;
}

/**
 * Upload file blobs to Pages asset store (authenticated with upload JWT).
 * Batches of up to 50 files.
 */
async function uploadAssets(
  jwt: string,
  files: { hash: string; bytes: Buffer; contentType: string }[]
): Promise<void> {
  const endpoint = `${CF_API}/pages/assets/upload`;
  const batchSize = 40;

  for (let i = 0; i < files.length; i += batchSize) {
    const slice = files.slice(i, i + batchSize);
    const body = slice.map((f) => ({
      key: f.hash,
      value: f.bytes.toString("base64"),
      base64: true,
      metadata: { contentType: f.contentType },
    }));

    const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(
        `Cloudflare asset upload failed (${res.status}): ${JSON.stringify(data?.errors ?? data)}`
      );
    }
  }
}

async function createDeployment(
  projectName: string,
  manifest: Record<string, string>
): Promise<{ id?: string; url?: string }> {
  const form = new FormData();
  form.append("manifest", JSON.stringify(manifest));
  form.append("branch", "main");
  form.append("commit_message", "goke publish");
  form.append("commit_dirty", "true");

  const res = await fetch(
    `${CF_API}/accounts/${accountId()}/pages/projects/${projectName}/deployments`,
    {
      method: "POST",
      headers: authHeader(),
      body: form,
    }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      `Cloudflare Pages deploy failed (${res.status}): ${JSON.stringify(data?.errors ?? data)}`
    );
  }
  return {
    id: data?.result?.id,
    url: data?.result?.url || data?.result?.aliases?.[0],
  };
}

async function attachCustomDomain(
  projectName: string,
  hostname: string
): Promise<void> {
  const { ok, status, data } = await cfJson(
    `/accounts/${accountId()}/pages/projects/${projectName}/domains`,
    {
      method: "POST",
      body: JSON.stringify({ name: hostname }),
    }
  );
  if (!ok && status !== 409) {
    throw new Error(
      `Custom domain attach failed: ${JSON.stringify(data?.errors ?? data)}`
    );
  }
}

export async function deployToCloudflarePages(
  preferredName: string,
  files: PublishFile[]
): Promise<CloudflareDeployResult> {
  if (!files.length) {
    throw new Error("No files to deploy to Cloudflare Pages");
  }

  let projectName = sanitizeProjectName(preferredName);

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

  // Build path → hash manifest + payload list
  const manifest: Record<string, string> = {};
  const toUpload: { hash: string; bytes: Buffer; contentType: string }[] = [];
  const seenHash = new Set<string>();

  for (const f of files) {
    const path = f.path.replace(/^\//, "");
    if (!path || path === "editor.json" || path === "editor-meta.json") continue;

    const bytes = Buffer.from(f.contentBase64, "base64");
    const hash = md5Hex(bytes);
    manifest[path] = hash;

    if (!seenHash.has(hash)) {
      seenHash.add(hash);
      toUpload.push({
        hash,
        bytes,
        contentType: contentTypeFor(path),
      });
    }
  }

  if (Object.keys(manifest).length === 0) {
    throw new Error("No publishable files after filtering");
  }

  const jwt = await getUploadToken(projectName);
  await uploadAssets(jwt, toUpload);
  const deployment = await createDeployment(projectName, manifest);

  const pagesDevUrl = `https://${projectName}.pages.dev`;
  let siteUrl = pagesDevUrl;

  const customRoot = (process.env.CLOUDFLARE_PAGES_DOMAIN || "")
    .replace(/^https?:\/\//, "")
    .replace(/^\*\./, "")
    .replace(/\.$/, "")
    .trim();

  if (customRoot) {
    try {
      await attachCustomDomain(projectName, `${projectName}.${customRoot}`);
      siteUrl = `https://${projectName}.${customRoot}`;
    } catch {
      siteUrl = pagesDevUrl;
    }
  }

  return {
    projectName,
    siteUrl,
    pagesDevUrl,
    deploymentId: deployment.id,
  };
}

export function isCloudflareConfigured(): boolean {
  return Boolean(
    process.env.CLOUDFLARE_ACCOUNT_ID &&
      (process.env.CLOUDFLARE_API_TOKEN ||
        process.env.CF_API_TOKEN ||
        process.env.CLOUDFLARE_TOKEN)
  );
}
