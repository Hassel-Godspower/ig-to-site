import { redirect } from "next/navigation";

/**
 * Simple preview used to lack Desktop/Tablet/Mobile.
 * Send everyone to the full editor so editing capacity matches Instagram path.
 */
export default async function PreviewSimpleRedirect({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) {
  const { jobId } = await params;
  redirect(`/preview/${jobId}`);
}
