/**
 * Cloudflare Pages Direct Upload (Wrangler-compatible)
 *
 * Hash = blake3(utf8(base64(file) + extension)).hex.slice(0, 32)
 * Uses @noble/hashes (pure JS) — no blake3-wasm.
 *
 *   npm install @noble/hashes
 */

import path from "path";
import type { PublishFile } from "./siteStore";

const CF_API = "https://api.cloudflare.com/client/v4";

function accountId(): string {
  const id = process.env.CLOUDFLARE_ACCOUNT_ID;
  if (!id) throw new Error("CLOUDFLARE_ACCOUNT_ID is not set.");
  return id;
}

function apiToken(): string {
  const t =
    process.env.CLOUDFLARE_API_TOKEN ||
    process.env.CF_API_TOKEN ||
    process.env.CLOUDFLARE_TOKEN;
  if (!t) throw new Error("CLOUDFLARE_API_TOKEN is not set.");
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
  fileCount: number;
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

/** Wrangler-compatible asset hash */
function hashAsset(bytes: Buffer, filePath: string): string {
  const base64Contents = bytes.toString("base64");
  const extension = path.extname(filePath).replace(/^\./, "");
  const input = base64Contents + extension;

  // @noble/hashes is pure JS
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { blake3 } = require("@noble/hashes/blake3") as {
    blake3: (msg: Uint8Array) => Uint8Array;
  };
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { bytesToHex } = require("@noble/hashes/utils") as {
    bytesToHex: (b: Uint8Array) => string;
  };
  const msg = new TextEncoder().encode(input);
  return bytesToHex(blake3(msg)).slice(0, 32);
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
  };
  return map[ext] || "application/octet-stream";
}

async function cfJson(
  apiPath: string,
  init?: RequestInit
): Promise<{ ok: boolean; status: number; data: any }> {
  const res = await fetch(`${CF_API}${apiPath}`, {
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
    `Cloudflare create project failed (${created.status}): ${msg}`
  );
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
  return data.result.jwt as string;
}

async function uploadAssets(
  jwt: string,
  files: { hash: string; bytes: Buffer; contentType: string }[]
): Promise<void> {
  const endpoint = `${CF_API}/pages/assets/upload`;
  for (let i = 0; i < files.length; i += 25) {
    const slice = files.slice(i, i + 25);
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
    { method: "POST", headers: authHeader(), body: form }
  );
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(
      `Pages deploy failed (${res.status}): ${JSON.stringify(data?.errors ?? data)}`
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
  if (!files.length) throw new Error("No files to deploy to Cloudflare Pages");

  // Fail fast if hash lib missing
  try {
    require("@noble/hashes/blake3");
  } catch {
    throw new Error(
      "Missing dependency @noble/hashes. Run: npm install @noble/hashes"
    );
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
    if (filePath.startsWith("dist/")) filePath = filePath.slice(5);
    if (filePath.startsWith("out/")) filePath = filePath.slice(4);
    if (filePath.startsWith("public/")) filePath = filePath.slice(7);

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
      `No index.html at root. Files: ${Object.keys(manifest).slice(0, 15).join(", ") || "none"}`
    );
  }

  const jwt = await getUploadToken(projectName);
  await uploadAssets(jwt, toUpload);
  const deployment = await createDeployment(projectName, manifest);

  const pagesDevUrl = `https://${projectName}.pages.dev`;
  let siteUrl = pagesDevUrl;
  if (deployment.environment && deployment.environment !== "production" && deployment.url) {
    siteUrl = deployment.url;
  }

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
    process.env.CLOUDFLARE_ACCOUNT_ID &&
      (process.env.CLOUDFLARE_API_TOKEN ||
        process.env.CF_API_TOKEN ||
        process.env.CLOUDFLARE_TOKEN)
  );
}
