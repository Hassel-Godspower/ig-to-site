/**
 * Cloudflare Pages Direct Upload — Wrangler-compatible hash.
 * Uses @noble/hashes with .js subpaths (required for Next/webpack exports).
 *
 *   npm install @noble/hashes
 */

import path from "path";
import { blake3 } from "@noble/hashes/blake3.js";
import { bytesToHex } from "@noble/hashes/utils.js";
import type { PublishFile } from "./siteStore";

const CF_API = "https://api.cloudflare.com/client/v4";

function accountId(): string {
  const id = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  if (!id) throw new Error("CLOUDFLARE_ACCOUNT_ID is not set");
  return id;
}

function apiToken(): string {
  const t = (
    process.env.CLOUDFLARE_API_TOKEN ||
    process.env.CF_API_TOKEN ||
    process.env.CLOUDFLARE_TOKEN ||
    ""
  ).trim();
  if (!t) throw new Error("CLOUDFLARE_API_TOKEN is not set");
  return t;
}

function auth(): Record<string, string> {
  return { Authorization: `Bearer ${apiToken()}` };
}

export interface CloudflareDeployResult {
  projectName: string;
  siteUrl: string;
  pagesDevUrl: string;
  deploymentId?: string;
  fileCount: number;
}

function sanitize(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 58) || "goke-site"
  );
}

/** Wrangler: blake3(utf8(base64(file) + extension)).hex.slice(0, 32) */
function hashAsset(bytes: Buffer, filePath: string): string {
  const base64Contents = bytes.toString("base64");
  const extension = path.extname(filePath).replace(/^\./, "");
  const input = new TextEncoder().encode(base64Contents + extension);
  return bytesToHex(blake3(input)).slice(0, 32);
}

function contentTypeFor(filePath: string): string {
  const ext = path.extname(filePath).replace(/^\./, "").toLowerCase();
  const map: Record<string, string> = {
    html: "text/html",
    css: "text/css",
    js: "application/javascript",
    mjs: "application/javascript",
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
    md: "text/markdown",
  };
  return map[ext] || "application/octet-stream";
}

async function cfJson(
  p: string,
  init?: RequestInit
): Promise<{ ok: boolean; status: number; data: any }> {
  const res = await fetch(`${CF_API}${p}`, {
    ...init,
    headers: {
      ...auth(),
      ...(init?.body && !(init.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...(init?.headers as Record<string, string> | undefined),
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
    body: JSON.stringify({ name: projectName, production_branch: "main" }),
  });
  if (created.ok) return;
  const msg = JSON.stringify(created.data?.errors ?? created.data);
  if (created.status === 409 || /already exists/i.test(msg)) return;
  throw new Error(`Create project failed (${created.status}): ${msg}`);
}

async function getUploadToken(projectName: string): Promise<string> {
  const { ok, status, data } = await cfJson(
    `/accounts/${accountId()}/pages/projects/${projectName}/upload-token`
  );
  if (!ok || !data?.result?.jwt) {
    throw new Error(
      `upload-token failed (${status}): ${JSON.stringify(data?.errors ?? data)}`
    );
  }
  return String(data.result.jwt);
}

async function uploadAssets(
  jwt: string,
  files: { hash: string; bytes: Buffer; contentType: string }[]
): Promise<void> {
  for (let i = 0; i < files.length; i += 20) {
    const slice = files.slice(i, i + 20);
    const body = slice.map((f) => ({
      key: f.hash,
      value: f.bytes.toString("base64"),
      base64: true,
      metadata: { contentType: f.contentType },
    }));
    const res = await fetch(`${CF_API}/pages/assets/upload`, {
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
        `asset upload failed (${res.status}): ${JSON.stringify(data?.errors ?? data)}`
      );
    }
  }
}

async function createDeployment(
  projectName: string,
  manifest: Record<string, string>
): Promise<{ id?: string; url?: string; environment?: string }> {
  const form = new FormData();
  form.append("manifest", JSON.stringify(manifest));
  form.append("branch", "main");
  form.append("commit_message", "goke publish");
  form.append("commit_dirty", "true");

  const res = await fetch(
    `${CF_API}/accounts/${accountId()}/pages/projects/${projectName}/deployments`,
    { method: "POST", headers: auth(), body: form }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      `deployment failed (${res.status}): ${JSON.stringify(data?.errors ?? data)}`
    );
  }
  return {
    id: data?.result?.id,
    url: data?.result?.url,
    environment: data?.result?.environment,
  };
}

export async function deployToCloudflarePages(
  preferredName: string,
  files: PublishFile[]
): Promise<CloudflareDeployResult> {
  if (!files.length) throw new Error("No files to deploy");

  let projectName = sanitize(preferredName);
  for (let attempt = 0; attempt < 4; attempt++) {
    try {
      await ensureProject(projectName);
      break;
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      if (attempt < 3 && /already|taken|conflict|409/i.test(msg)) {
        projectName = `${sanitize(preferredName)}-${Math.random().toString(36).slice(2, 5)}`;
        continue;
      }
      throw e;
    }
  }

  const manifest: Record<string, string> = {};
  const toUpload: { hash: string; bytes: Buffer; contentType: string }[] = [];
  const seen = new Set<string>();

  for (const f of files) {
    let filePath = f.path.replace(/^\//, "").replace(/\\/g, "/");
    if (
      !filePath ||
      filePath === "editor.json" ||
      filePath === "editor-meta.json" ||
      filePath.startsWith(".git/")
    ) {
      continue;
    }
    for (const prefix of ["dist/", "out/", "public/", "build/"]) {
      if (filePath.startsWith(prefix)) filePath = filePath.slice(prefix.length);
    }

    const bytes = Buffer.from(f.contentBase64, "base64");
    if (!bytes.length) continue;

    const hash = hashAsset(bytes, filePath);
    manifest[filePath] = hash;
    if (!seen.has(hash)) {
      seen.add(hash);
      toUpload.push({ hash, bytes, contentType: contentTypeFor(filePath) });
    }
  }

  if (!manifest["index.html"]) {
    throw new Error(
      `No index.html at root. Got: ${Object.keys(manifest).slice(0, 20).join(", ") || "none"}`
    );
  }

  const jwt = await getUploadToken(projectName);
  await uploadAssets(jwt, toUpload);
  const deployment = await createDeployment(projectName, manifest);

  const pagesDevUrl = `https://${projectName}.pages.dev`;
  const siteUrl =
    deployment.environment === "preview" && deployment.url
      ? deployment.url
      : pagesDevUrl;

  return {
    projectName,
    siteUrl,
    pagesDevUrl,
    deploymentId: deployment.id,
    fileCount: Object.keys(manifest).length,
  };
}

export function isCloudflareConfigured(): boolean {
  return Boolean(
    process.env.CLOUDFLARE_ACCOUNT_ID?.trim() &&
      (process.env.CLOUDFLARE_API_TOKEN ||
        process.env.CF_API_TOKEN ||
        process.env.CLOUDFLARE_TOKEN)
  );
}
