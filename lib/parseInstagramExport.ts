import AdmZip from "adm-zip";

export interface InstagramPost {
  caption: string;
  timestamp?: number;
  /** Relative paths inside the export zip, when present */
  imagePaths?: string[];
  /** Absolute http(s) URIs if the export embeds them */
  imageUrls?: string[];
}

export interface InstagramProfile {
  username: string;
  bio: string;
  name: string;
  posts: InstagramPost[];
  /** Best-effort gallery URLs/paths for the site generator */
  mediaUrls: string[];
}

/**
 * Parses an Instagram "Download your information" export.
 * Accepts .zip (profile + posts JSON, optional media files) or a single .json.
 */
export function parseInstagramExport(
  fileBuffer: Buffer,
  fileName: string
): InstagramProfile {
  if (fileName.toLowerCase().endsWith(".zip")) {
    return parseZip(fileBuffer);
  }
  if (fileName.toLowerCase().endsWith(".json")) {
    return parseSingleJson(JSON.parse(fileBuffer.toString("utf-8")));
  }
  throw new Error(
    `Unsupported file type: ${fileName}. Expected .zip or .json.`
  );
}

function parseZip(buffer: Buffer): InstagramProfile {
  const zip = new AdmZip(buffer);
  const entries = zip.getEntries();

  let profileJson: any = null;
  let postsJson: any = null;
  const mediaInZip: string[] = [];

  for (const entry of entries) {
    if (entry.isDirectory) continue;
    const lower = entry.entryName.toLowerCase();
    if (
      lower.endsWith("profile.json") ||
      lower.endsWith("personal_information.json")
    ) {
      profileJson = safeParse(entry.getData().toString("utf-8"));
    }
    if (lower.match(/posts_\d+\.json$/) || lower.includes("content/posts")) {
      if (lower.endsWith(".json")) {
        postsJson = safeParse(entry.getData().toString("utf-8"));
      }
    }
    if (/\.(jpe?g|png|webp|gif)$/i.test(lower)) {
      mediaInZip.push(entry.entryName.replace(/\\/g, "/"));
    }
  }

  if (!profileJson && !postsJson) {
    throw new Error(
      "Could not find profile.json or posts_*.json inside the zip. " +
        "Make sure this is an Instagram 'Download your information' export in JSON format."
    );
  }

  const posts = extractPosts(postsJson);
  const fromPosts = posts.flatMap((p) => [
    ...(p.imageUrls || []),
    ...(p.imagePaths || []),
  ]);
  const mediaUrls = unique([
    ...fromPosts.filter((u) => /^https?:\/\//i.test(u)),
    // local zip paths are not publicly fetchable; generator uses https URLs only
    ...fromPosts.filter((u) => !/^https?:\/\//i.test(u)).slice(0, 0),
    ...mediaInZip.slice(0, 0),
  ]);

  // Prefer http URLs from JSON; if none, leave mediaUrls empty (generator uses placeholders)
  const httpFromPosts = posts.flatMap((p) => p.imageUrls || []);
  const allHttp = unique(httpFromPosts);

  return {
    username: extractUsername(profileJson),
    bio: extractBio(profileJson),
    name: extractName(profileJson),
    posts,
    mediaUrls: allHttp.slice(0, 24),
  };
}

function parseSingleJson(json: any): InstagramProfile {
  if (Array.isArray(json)) {
    const posts = extractPosts(json);
    return {
      username: "",
      bio: "",
      name: "",
      posts,
      mediaUrls: unique(posts.flatMap((p) => p.imageUrls || [])).slice(0, 24),
    };
  }
  const posts = extractPosts(json?.posts ?? json?.media ?? null);
  return {
    username: extractUsername(json),
    bio: extractBio(json),
    name: extractName(json),
    posts,
    mediaUrls: unique(posts.flatMap((p) => p.imageUrls || [])).slice(0, 24),
  };
}

function safeParse(text: string): any {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function unique(arr: string[]): string[] {
  return [...new Set(arr.filter(Boolean))];
}

function extractBio(profile: any): string {
  if (!profile) return "";
  const pi =
    profile?.profile_user?.[0]?.string_map_data?.Biography?.value ??
    profile?.profile_user?.[0]?.string_map_data?.Bio?.value ??
    profile?.biography ??
    profile?.bio ??
    "";
  return String(pi || "");
}

function extractUsername(profile: any): string {
  if (!profile) return "";
  return String(
    profile?.profile_user?.[0]?.string_map_data?.Username?.value ??
      profile?.username ??
      profile?.profile_username ??
      ""
  );
}

function extractName(profile: any): string {
  if (!profile) return "";
  return String(
    profile?.profile_user?.[0]?.string_map_data?.Name?.value ??
      profile?.name ??
      profile?.full_name ??
      ""
  );
}

function extractPosts(postsJson: any): InstagramPost[] {
  if (!postsJson) return [];
  const list = Array.isArray(postsJson)
    ? postsJson
    : Array.isArray(postsJson?.posts)
      ? postsJson.posts
      : [];

  return list.slice(0, 40).map((p: any) => {
    const caption =
      p?.title ??
      p?.media?.[0]?.title ??
      p?.caption ??
      p?.string_map_data?.Caption?.value ??
      "";
    const timestamp =
      p?.creation_timestamp ??
      p?.media?.[0]?.creation_timestamp ??
      p?.taken_at ??
      undefined;

    const imageUrls: string[] = [];
    const imagePaths: string[] = [];

    const collect = (uri: any) => {
      if (!uri || typeof uri !== "string") return;
      if (/^https?:\/\//i.test(uri)) imageUrls.push(uri);
      else imagePaths.push(uri);
    };

    // Common IG export shapes
    if (Array.isArray(p?.media)) {
      for (const m of p.media) {
        collect(m?.uri);
        collect(m?.url);
        if (Array.isArray(m?.media_metadata?.photo_metadata?.exif_data)) {
          /* skip */
        }
      }
    }
    collect(p?.uri);
    collect(p?.url);
    if (Array.isArray(p?.attachments)) {
      for (const a of p.attachments) {
        const data = a?.data || [];
        for (const d of data) {
          collect(d?.uri || d?.url);
        }
      }
    }

    return {
      caption: String(caption || "").slice(0, 500),
      timestamp: typeof timestamp === "number" ? timestamp : undefined,
      imageUrls: unique(imageUrls).slice(0, 5),
      imagePaths: unique(imagePaths).slice(0, 5),
    };
  });
}
