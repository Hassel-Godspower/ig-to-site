/**
 * Creates a Vercel deployment directly via the REST API — no CLI, no git
 * push. Docs: https://vercel.com/docs/rest-api/reference/endpoints/deployments
 *
 * Each file's SHA1 + size go through the "files" array, base64-encoded
 * inline (fine for a handful of small files; for larger sites you'd
 * upload to Vercel's file store first and reference by SHA).
 */
export async function deployToVercel(
  files: Record<string, string>,
  projectName: string
): Promise<{ url: string }> {
  const token = process.env.VERCEL_API_TOKEN;
  if (!token) throw new Error("VERCEL_API_TOKEN is not set");

  const teamQuery = process.env.VERCEL_TEAM_ID
    ? `?teamId=${process.env.VERCEL_TEAM_ID}`
    : "";

  const deployFiles = Object.entries(files).map(([path, content]) => ({
    file: path,
    data: Buffer.from(content, "utf-8").toString("base64"),
    encoding: "base64",
  }));

  const res = await fetch(`https://api.vercel.com/v13/deployments${teamQuery}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: sanitizeProjectName(projectName),
      files: deployFiles,
      target: "production",
      projectSettings: { framework: null }, // static files, no build step
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Vercel deploy failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  // data.url is the deployment host, e.g. "my-site-abc123.vercel.app"
  return { url: `https://${data.url}` };
}

function sanitizeProjectName(name: string): string {
  return (
    name
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 50) || "ig-generated-site"
  );
}
