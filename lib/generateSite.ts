import type { InstagramProfile } from "./parseInstagramExport";

/**
 * Generates a multi-page static site from Instagram data via Groq.
 * Returns a map of relative paths → file contents, e.g.:
 *   index.html, about.html, services.html, gallery.html, contact.html,
 *   styles.css, script.js, pages.json
 */

export async function generateSite(
  profile: InstagramProfile
): Promise<Record<string, string>> {
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      max_tokens: 16000,
      temperature: 0.4,
      messages: [{ role: "user", content: buildPrompt(profile) }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq request failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const raw: string = data.choices?.[0]?.message?.content ?? "";
  return parseMultiPage(raw, profile);
}

function buildPrompt(profile: InstagramProfile): string {
  const captions = profile.posts
    .map((p) => `- ${p.caption}`)
    .filter((c) => c.length > 3)
    .slice(0, 20)
    .join("\n");
  const mediaLines =
    (profile as { mediaUrls?: string[] }).mediaUrls
      ?.slice(0, 12)
      .map((u, i) => `${i + 1}. ${u}`)
      .join("\n") ||
    "(no public image URLs — use https://picsum.photos/seed/{topic}-{n}/1200/800 placeholders)";

  const brand = profile.name || profile.username || "Business";
  const bio = profile.bio || "(none provided)";

  return `You are a senior web designer building a COMPLETE multi-page static website
(plain HTML + one shared CSS file + one shared JS file — no React, no Next.js,
no build step). Use the Instagram business data below.

=== BUSINESS DATA ===
Name: ${brand}
Bio: ${bio}
Username: ${profile.username || "(unknown)"}
Recent captions (infer services, tone, location, offers):
${captions || "(none)"}

Image URLs (prefer these in <img src> when present):
${mediaLines}

=== REQUIRED SITE STRUCTURE (exactly these pages) ===
1. index.html   — Home (hero with real imagery, intro, featured services, CTA)
2. about.html   — About the business / story / values
3. services.html — Services or offerings (cards or list with details)
4. gallery.html — Visual gallery (grid of images from data or placeholders)
5. contact.html — Contact form UI + location / hours / WhatsApp-style CTA

Optional sixth page ONLY if captions clearly imply a menu/shop/booking:
6. booking.html OR menu.html OR shop.html — only when relevant

=== SHARED ASSETS ===
- styles.css — ALL visual design for every page (do not put <style> in HTML)
- script.js  — shared nav mobile toggle, smooth scroll, form preventDefault

=== DESIGN QUALITY (critical) ===
- Premium, industry-appropriate look (spa → calm neutrals; auto → bold; etc.)
- Hero on index MUST include a large image (not text-only empty white space)
- Consistent header + footer on EVERY page with the SAME nav links to all pages
- Nav links must be relative: index.html, about.html, services.html, gallery.html, contact.html
- Use CSS variables on :root for --primary, --text, --muted, --bg, --surface
- Link stylesheet as: <link rel="stylesheet" href="styles.css">
- Link script as: <script src="script.js" defer></script> before </body>
- Google Fonts allowed via one <link> in each page <head>
- Mobile responsive (flex/grid, readable type, no horizontal scroll)
- Real Nigerian/local business friendliness if location appears in captions
- Accessibility: alt text on images, label on form fields, semantic landmarks

=== EDITOR HOOKS (required on every page) ===
Add these ids where content exists so the visual editor can target them:
- id="site-title" on the brand/logo text in the header
- id="hero-headline" on the main H1 of index.html only
- id="hero-subheadline" on the hero supporting paragraph (index)
- id="cta-button" on the primary hero CTA link/button (index)
- class="site-section" and data-section-name="About|Services|Gallery|Contact|..." on major <section>s

=== OUTPUT FORMAT (strict — no markdown fences, no commentary) ===
===PAGE:index.html===
<!DOCTYPE html>
...full html...
===PAGE:about.html===
<!DOCTYPE html>
...full html...
===PAGE:services.html===
<!DOCTYPE html>
...full html...
===PAGE:gallery.html===
<!DOCTYPE html>
...full html...
===PAGE:contact.html===
<!DOCTYPE html>
...full html...
===CSS===
...full styles.css...
===JS===
...full script.js...

Every PAGE block must be a complete valid HTML5 document.
Keep each HTML page focused (not huge); put decoration in CSS.
Total response must fit the token budget — prioritize complete working pages over verbose copy.`;
}

function parseMultiPage(
  raw: string,
  profile: InstagramProfile
): Record<string, string> {
  const files: Record<string, string> = {};

  // ===PAGE:filename=== ... until next ===PAGE: or ===CSS=== or ===JS===
  const pageRe = /===PAGE:([a-z0-9._-]+)===\s*([\s\S]*?)(?====PAGE:|===CSS===|===JS===|$)/gi;
  let m: RegExpExecArray | null;
  while ((m = pageRe.exec(raw)) !== null) {
    const name = m[1].trim().toLowerCase();
    const body = m[2].trim();
    if (name.endsWith(".html") && body.length > 50) {
      files[name] = stripFences(body);
    }
  }

  // Fallback: legacy single-page ===HTML=== format
  if (!files["index.html"]) {
    const htmlMatch = raw.match(/===HTML===([\s\S]*?)(?:===CSS===|===PAGE:|$)/i);
    if (htmlMatch) {
      files["index.html"] = stripFences(htmlMatch[1].trim());
    }
  }

  const cssMatch = raw.match(/===CSS===([\s\S]*?)(?:===JS===|$)/i);
  const jsMatch = raw.match(/===JS===([\s\S]*)$/i);

  if (cssMatch) files["styles.css"] = stripFences(cssMatch[1].trim());
  if (jsMatch) files["script.js"] = stripFences(jsMatch[1].trim());

  if (!files["index.html"]) {
    throw new Error(
      "Groq response missing index.html. Expected ===PAGE:index.html=== sections. " +
        "Retry generation."
    );
  }
  if (!files["styles.css"]) {
    files["styles.css"] =
      "/* fallback */ body{font-family:system-ui;margin:0;padding:1rem} ";
  }
  if (!files["script.js"]) {
    files["script.js"] = "/* goke */\n";
  }

  // Ensure secondary pages exist (minimal stubs if model skipped them)
  const brand = profile.name || profile.username || "Home";
  const required = ["about.html", "services.html", "gallery.html", "contact.html"];
  for (const page of required) {
    if (!files[page]) {
      files[page] = minimalPage(brand, page.replace(".html", ""));
    }
  }

  // Manifest for the editor page switcher
  const pages = Object.keys(files)
    .filter((k) => k.endsWith(".html"))
    .sort((a, b) => {
      if (a === "index.html") return -1;
      if (b === "index.html") return 1;
      return a.localeCompare(b);
    })
    .map((file) => ({
      file,
      title: pageTitle(file),
    }));

  files["pages.json"] = JSON.stringify({ pages }, null, 2);

  return files;
}

function stripFences(s: string): string {
  return s
    .replace(/^```(?:html|css|js|javascript)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

function pageTitle(file: string): string {
  if (file === "index.html") return "Home";
  return file
    .replace(/\.html$/i, "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function minimalPage(brand: string, kind: string): string {
  const title = pageTitle(kind + ".html");
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${title} — ${brand}</title>
<link rel="stylesheet" href="styles.css"/>
</head>
<body>
<header class="site-header">
  <a href="index.html" id="site-title">${brand}</a>
  <nav>
    <a href="index.html">Home</a>
    <a href="about.html">About</a>
    <a href="services.html">Services</a>
    <a href="gallery.html">Gallery</a>
    <a href="contact.html">Contact</a>
  </nav>
</header>
<main>
  <section class="site-section" data-section-name="${title}">
    <h1>${title}</h1>
    <p>Tell your story here. Edit this page in gòke.</p>
  </section>
</main>
<footer><p>© ${brand}</p></footer>
<script src="script.js" defer></script>
</body>
</html>`;
}
