import AdmZip from "adm-zip";

export interface InstagramProfile {
  username: string;
  bio: string;
  name: string;
  posts: { caption: string; timestamp?: number }[];
}

/**
 * Parses an Instagram "Download your information" export.
 * Accepts either:
 *  - a .zip buffer containing profile.json + posts_1.json (typical JSON export layout)
 *  - a raw .json buffer if the user only uploaded a single file
 *
 * Real exports nest these files under varying folder names depending on
 * export version, so this walks all entries rather than assuming exact paths.
 */
export function parseInstagramExport(fileBuffer: Buffer, fileName: string): InstagramProfile {
  if (fileName.toLowerCase().endsWith(".zip")) {
    return parseZip(fileBuffer);
  }
  if (fileName.toLowerCase().endsWith(".json")) {
    return parseSingleJson(JSON.parse(fileBuffer.toString("utf-8")));
  }
  throw new Error(`Unsupported file type: ${fileName}. Expected .zip or .json.`);
}

function parseZip(buffer: Buffer): InstagramProfile {
  const zip = new AdmZip(buffer);
  const entries = zip.getEntries();

  let profileJson: any = null;
  let postsJson: any = null;

  for (const entry of entries) {
    const lower = entry.entryName.toLowerCase();
    if (lower.endsWith("profile.json") || lower.endsWith("personal_information.json")) {
      profileJson = safeParse(entry.getData().toString("utf-8"));
    }
    if (lower.match(/posts_\d+\.json$/) || lower.includes("content/posts")) {
      postsJson = safeParse(entry.getData().toString("utf-8"));
    }
  }

  if (!profileJson && !postsJson) {
    throw new Error(
      "Could not find profile.json or posts_*.json inside the zip. " +
        "Make sure this is an Instagram 'Download your information' export in JSON format."
    );
  }

  const bio = extractBio(profileJson);
  const username = extractUsername(profileJson);
  const name = extractName(profileJson);
  const posts = extractPosts(postsJson);

  return { username, bio, name, posts };
}

function parseSingleJson(json: any): InstagramProfile {
  // Best-effort: this branch is hit when a user uploads just one file
  // rather than the full zip. We try both profile and posts shapes.
  if (Array.isArray(json)) {
    return { username: "", bio: "", name: "", posts: extractPosts(json) };
  }
  return {
    username: extractUsername(json),
    bio: extractBio(json),
    name: extractName(json),
    posts: extractPosts(json?.posts ?? null),
  };
}

function safeParse(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function extractBio(profileJson: any): string {
  return (
    profileJson?.profile_user?.[0]?.string_map_data?.Bio?.value ??
    profileJson?.biography ??
    ""
  );
}

function extractUsername(profileJson: any): string {
  return (
    profileJson?.profile_user?.[0]?.string_map_data?.Username?.value ??
    profileJson?.username ??
    ""
  );
}

function extractName(profileJson: any): string {
  return (
    profileJson?.profile_user?.[0]?.string_map_data?.Name?.value ??
    profileJson?.name ??
    ""
  );
}

function extractPosts(postsJson: any): { caption: string; timestamp?: number }[] {
  if (!postsJson) return [];
  const list = Array.isArray(postsJson) ? postsJson : postsJson.posts ?? [];
  return list
    .map((p: any) => ({
      caption: p?.title ?? p?.media?.[0]?.title ?? "",
      timestamp: p?.creation_timestamp ?? p?.media?.[0]?.creation_timestamp,
    }))
    .filter((p: any) => p.caption)
    .slice(0, 20); // cap for prompt size
}
