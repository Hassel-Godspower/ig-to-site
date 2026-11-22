import { redirect } from "next/navigation";

/**
 * Simple path uses the full editor (same Desktop/Tablet/Mobile + save auth).
 * Preserve ?access= and other query params from dashboard magic links.
 */
export default async function PreviewSimpleRedirect({
  params,
  searchParams,
}: {
  params: Promise<{ jobId: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { jobId } = await params;
  const sp = await searchParams;
  const q = new URLSearchParams();
  for (const [k, v] of Object.entries(sp || {})) {
    if (v == null) continue;
    if (Array.isArray(v)) v.forEach((x) => q.append(k, x));
    else q.set(k, v);
  }
  const qs = q.toString();
  redirect(qs ? "/preview/" + jobId + "?" + qs : "/preview/" + jobId);
}
