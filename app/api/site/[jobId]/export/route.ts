import { NextRequest, NextResponse } from "next/server";
import AdmZip from "adm-zip";
import {
  listAllSiteFiles,
  getSiteFile,
  getSiteBinary,
  isBinaryPath,
} from "@/lib/siteStore";
import { assertSiteWriteAccess } from "@/lib/editAuth";
import { getJob } from "@/lib/jobStore";

export const runtime = "nodejs";
export const maxDuration = 60;

/**
 * GET /api/site/[jobId]/export
 * Downloads a ZIP of all site files (ownership / offline backup).
 * Requires edit token, dashboard access, or admin.
 */
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;

  const auth = await assertSiteWriteAccess(req, jobId);
  if (!auth.ok) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  const job = await getJob(jobId);
  if (!job) {
    return NextResponse.json({ error: "Job not found" }, { status: 404 });
  }

  const paths = await listAllSiteFiles(jobId);
  if (!paths.length) {
    return NextResponse.json(
      { error: "No site files found for this job" },
      { status: 404 }
    );
  }

  const zip = new AdmZip();
  let count = 0;

  for (const rel of paths) {
    if (rel === "editor.json" || rel.endsWith("/editor.json")) continue;
    try {
      if (isBinaryPath(rel)) {
        const blob = await getSiteBinary(jobId, rel);
        if (!blob) continue;
        const buf = Buffer.from(await blob.arrayBuffer());
        zip.addFile(rel, buf);
        count++;
      } else {
        const text = await getSiteFile(jobId, rel);
        if (text == null) continue;
        zip.addFile(rel, Buffer.from(text, "utf-8"));
        count++;
      }
    } catch {
      /* skip bad object */
    }
  }

  if (count === 0) {
    return NextResponse.json(
      { error: "Could not read any site files" },
      { status: 500 }
    );
  }

  const name =
    (job.username || job.parsedUsername || jobId)
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .slice(0, 40) || "goke-site";

  const out = zip.toBuffer();
  return new NextResponse(out, {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${name}-goke-export.zip"`,
      "Cache-Control": "no-store",
    },
  });
}
