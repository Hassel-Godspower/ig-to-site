import Anthropic from "@anthropic-ai/sdk";
import type { InstagramProfile } from "./parseInstagramExport";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * Turns parsed Instagram data into three plain static files: index.html,
 * styles.css, script.js. These are exactly the files that get previewed,
 * edited, and later deployed as-is — no build step, no framework.
 */
export async function generateSite(
  profile: InstagramProfile
): Promise<Record<string, string>> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-6",
    max_tokens: 8000,
    messages: [{ role: "user", content: buildPrompt(profile) }],
  });

  const textBlock = response.content.find((b) => b.type === "text");
  const raw = textBlock && "text" in textBlock ? textBlock.text : "";
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
      "Claude's response didn't match the expected ===HTML===/===CSS===/===JS=== format. " +
        "Consider retrying, or logging `raw` to inspect what came back."
    );
  }

  return {
    "index.html": htmlMatch[1].trim(),
    "styles.css": cssMatch[1].trim(),
    "script.js": jsMatch[1].trim(),
  };
}
