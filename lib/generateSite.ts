import type { InstagramProfile } from "./parseInstagramExport";

/**
 * Turns parsed Instagram data into three plain static files: index.html,
 * styles.css, script.js. These are exactly the files that get previewed,
 * edited, and later deployed as-is — no build step, no framework.
 *
 * Uses Groq's free API (OpenAI-compatible endpoint) instead of a paid
 * model provider. Free tier is rate-limited (~30 requests/min, daily
 * token caps as of writing) — fine for a low-volume site generator, but
 * worth checking console.groq.com/settings/limits if generation starts
 * throwing 429s under real usage.
 *
 * Model: Groq deprecated llama-3.3-70b-versatile on 2026-08-16 (see
 * console.groq.com/docs/deprecations) and it now 404s. openai/gpt-oss-120b
 * is their recommended replacement -- if Groq deprecates this one too in
 * the future, that same page will list the next recommended model ID.
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
      max_tokens: 8000,
      messages: [{ role: "user", content: buildPrompt(profile) }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq request failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const raw: string = data.choices?.[0]?.message?.content ?? "";
  return parseSections(raw);
}

function buildPrompt(profile: InstagramProfile): string {
  const captions = profile.posts.map((p) => `- ${p.caption}`).join("\n");

  return `You are building a small static website (plain HTML, CSS, and
JS — no framework, no build step, no external requests except Google
Fonts) for a business/creator, using their real Instagram data below.

Business/creator name: ${profile.name || profile.username || "Unknown"}
Instagram bio: ${profile.bio || "(none provided)"}
Recent post captions (use these to infer tone, services, offerings):
${captions || "(no captions available)"}

Requirements:
- index.html links to styles.css and script.js as separate files
  (<link rel="stylesheet" href="styles.css">, <script src="script.js" defer></script>).
- Responsive, mobile-friendly, readable in both light and dark mode.
- script.js should only handle small progressive-enhancement touches
  (e.g. a mobile nav toggle, smooth scroll) — nothing load-bearing.
- No placeholder lorem ipsum — write real copy grounded in the data above.
- Do not invent contact details, prices, or claims not implied by the data.

Output EXACTLY this format, nothing before or after, no markdown fences:

===HTML===
<full contents of index.html>
===CSS===
<full contents of styles.css>
===JS===
<full contents of script.js>`;
}

function parseSections(raw: string): Record<string, string> {
  const htmlMatch = raw.match(/===HTML===([\s\S]*?)===CSS===/);
  const cssMatch = raw.match(/===CSS===([\s\S]*?)===JS===/);
  const jsMatch = raw.match(/===JS===([\s\S]*)$/);

  if (!htmlMatch || !cssMatch || !jsMatch) {
    throw new Error(
      "Groq's response didn't match the expected ===HTML===/===CSS===/===JS=== format. " +
        "Consider retrying, or logging `raw` to inspect what came back."
    );
  }

  return {
    "index.html": htmlMatch[1].trim(),
    "styles.css": cssMatch[1].trim(),
    "script.js": jsMatch[1].trim(),
  };
}
