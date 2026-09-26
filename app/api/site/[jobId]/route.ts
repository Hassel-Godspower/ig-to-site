import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import {
  saveSiteFile,
  saveSiteBinary,
  isBinaryPath,
  contentTypeFor,
} from "@/lib/siteStore";
import { findGokeMain } from "@/src/goke-editor/data/goke-main-templates";

/**
 * POST /api/site/[jobId]/seed-template
 * Body: { templateId: string }
 *
 * Copies every file from public/goke-templates/{folder}/ into the job's
 * storage prefix so multi-page HTML + CSS + JS + images publish intact.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  if (!jobId || /[^a-zA-Z0-9_-]/.test(jobId)) {
    return NextResponse.json({ error: "Invalid jobId" }, { status: 400 });
  }

  let templateId = "";
  try {
    const body = await req.json();
    templateId = String(body?.templateId || "");
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const tpl = findGokeMain(templateId);
  if (!tpl) {
    return NextResponse.json({ error: "Unknown template" }, { status: 404 });
  }

  const root = path.join(process.cwd(), "public", "goke-templates", tpl.folder);
  let entries: string[] = [];
  try {
    entries = await walkDir(root, root);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Template folder missing";
    return NextResponse.json({ error: msg }, { status: 404 });
  }

  const uploaded: string[] = [];
  for (const abs of entries) {
    const rel = path.relative(root, abs).split(path.sep).join("/");
    // skip metadata
    if (rel === "goke.json" || rel === "README.md") continue;

    const buf = await fs.readFile(abs);
    if (isBinaryPath(rel)) {
      await saveSiteBinary(jobId, rel, buf, contentTypeFor(rel));
    } else {
      await saveSiteFile(jobId, rel, buf.toString("utf-8"));
    }
    uploaded.push(rel);
  }

  // remember which pack was seeded (for publish / re-open)
  await saveSiteFile(
    jobId,
    "goke-template.json",
    JSON.stringify({
      id: tpl.id,
      folder: tpl.folder,
      name: tpl.name,
      seededAt: new Date().toISOString(),
      files: uploaded,
    })
  );

  return NextResponse.json({
    ok: true,
    folder: tpl.folder,
    files: uploaded,
  });
}

async function walkDir(dir: string, root: string): Promise<string[]> {
  const out: string[] = [];
  const items = await fs.readdir(dir, { withFileTypes: true });
  for (const item of items) {
    const full = path.join(dir, item.name);
    if (item.isDirectory()) {
      out.push(...(await walkDir(full, root)));
    } else if (item.isFile()) {
      out.push(full);
    }
  }
  return out;
}
