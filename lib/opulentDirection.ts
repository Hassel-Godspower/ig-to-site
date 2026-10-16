/**
 * Opulent design direction per niche.
 * Maps business type → luxury archetype, palette, type, voice, imagery rules.
 * Used by premiumShell (theme) and generateSite (AI copy prompt).
 */

export type LuxuryArchetype =
  | "exotic_sanctuary" // spa, wellness, beauty
  | "sensorial_indulgence" // dining, bar, bakery
  | "technical_opulence" // fitness, auto performance
  | "quiet_authority" // law, advisory, real estate
  | "modern_heritage" // fashion, jewelry, african wear
  | "clinical_precision" // clinic, dental, pharmacy
  | "editorial_craft" // photo, creative agency
  | "warm_institution" // school, church, hotel
  | "product_clarity" // tech, logistics, general
  | "athletic_edge"; // gym, coach

export type OpulentDirection = {
  archetype: LuxuryArchetype;
  label: string;
  /** Emotional promise for copy */
  emotionalPromise: string;
  paletteNote: string;
  /** CSS-ready theme hints */
  ink: string;
  ink2: string;
  surface: string;
  accent: string;
  text: string;
  muted: string;
  onAccent: string;
  mode: "dark" | "light";
  fontDisplay: string;
  fontBody: string;
  googleFontsHref: string;
  radius: string;
  radiusLg: string;
  voice: string;
  headlineStyle: string;
  imageDirection: string;
  ctaTone: string;
  avoid: string;
};

const FONT_SERIF =
  "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Outfit:wght@300;400;500;600&display=swap";
const FONT_SYNE =
  "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Syne:wght@600;700;800&display=swap";
const FONT_PRECISE =
  "https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&family=Instrument+Serif:ital@0;1&display=swap";

/** Default opulent dark charcoal + gold */
const OPULENT_DEFAULT: OpulentDirection = {
  archetype: "product_clarity",
  label: "Quiet luxury business",
  emotionalPromise: "trust and elevated presence",
  paletteNote: "Charcoal, warm ivory, restrained gold",
  ink: "#0c0a09",
  ink2: "#141210",
  surface: "#1a1714",
  accent: "#c9a86c",
  text: "#f3eee4",
  muted: "#a39e93",
  onAccent: "#0c0a09",
  mode: "dark",
  fontDisplay: '"Cormorant Garamond", Georgia, serif',
  fontBody: '"Outfit", system-ui, sans-serif',
  googleFontsHref: FONT_SERIF,
  radius: "4px",
  radiusLg: "10px",
  voice: "Confident, concise, never salesy. Speak as an established brand.",
  headlineStyle: "Short, powerful; avoid 'Welcome to' and generic startup phrases.",
  imageDirection:
    "Editorial, cinematic lighting, dignified subjects. Prefer dark and brown skin representation in human imagery. Unsplash/Pexels only. No cheesy stock smiles.",
  ctaTone: "Clear and calm (Book · Enquire · Message)",
  avoid: "Bright primaries, clutter, playful bounce animations, marketplace density.",
};

function d(partial: Partial<OpulentDirection>): OpulentDirection {
  return { ...OPULENT_DEFAULT, ...partial };
}

/**
 * Resolve opulent direction from niche id (blueprint or legacy).
 */
export function resolveOpulentDirection(nicheId: string): OpulentDirection {
  const id = (nicheId || "general_business").toLowerCase();

  // Spa / wellness / beauty / salon / massage
  if (/spa|wellness|massage|beauty|nail|skincare|bodywork/.test(id)) {
    return d({
      archetype: "exotic_sanctuary",
      label: "Exotic sanctuary",
      emotionalPromise: "healing, stillness, quiet luxury",
      paletteNote: "Deep emerald, champagne gold, warm pearl",
      ink: "#0b1210",
      ink2: "#101816",
      surface: "#15201c",
      accent: "#c9a86c",
      text: "#f3eee4",
      muted: "#a39e93",
      onAccent: "#0b1210",
      voice: "Poetic and restrained. Slow the reader down. Sensory but never flowery fluff.",
      headlineStyle: "Editorial, one strong image of calm power.",
      imageDirection:
        "Serene treatment rooms, skilled hands, soft light. Prefer brown and dark skin therapists/clients in elevated spa settings. Cinematic, shallow depth of field.",
      ctaTone: "Book a session · Reserve",
    });
  }

  if (/hair|salon|glam|barber/.test(id)) {
    return d({
      archetype: "modern_heritage",
      label: "Glam atelier",
      emotionalPromise: "transformation and polish",
      paletteNote: "Ink black, soft rose-gold or champagne",
      ink: "#0a0a0b",
      ink2: "#121214",
      surface: "#1a1a1e",
      accent: "#d4a574",
      imageDirection:
        "Editorial hair and beauty campaigns; prefer dark and brown skin models, studio lighting, high contrast.",
      ctaTone: "Book appointment",
    });
  }

  // Dining / food
  if (/restaurant|food|dining|kitchen|catering/.test(id)) {
    return d({
      archetype: "sensorial_indulgence",
      label: "Fine dining opulence",
      emotionalPromise: "pleasure, ritual, taste",
      paletteNote: "Deep charcoal, liquid gold, ivory",
      ink: "#0c0a09",
      ink2: "#141210",
      surface: "#1a1714",
      accent: "#c9a227",
      imageDirection:
        "Cinematic plating, low light, rich textures. Prefer brown and dark skin chefs/guests in sophisticated settings. Moody, composed frames.",
      ctaTone: "Reserve a table · View menu",
      voice: "Like a private dining room — confident, sensory, brief.",
    });
  }

  if (/cafe|coffee|bakery|pastry|bar_lounge|lounge|nightlife/.test(id)) {
    return d({
      archetype: "sensorial_indulgence",
      label: "Sensorial hospitality",
      emotionalPromise: "warmth and craft",
      paletteNote: "Warm charcoal, cream, soft copper",
      ink: "#100e0c",
      ink2: "#1a1612",
      surface: "#221e1a",
      accent: "#c4a484",
      imageDirection:
        "Craft coffee, pastry, or nightlife with elevated lighting. Prefer diverse, dignified human presence.",
      ctaTone: "Visit · Order · Reserve",
    });
  }

  // Fitness / coach
  if (/fitness|gym|pt|train|coach_consultant|coach/.test(id)) {
    return d({
      archetype: "athletic_edge",
      label: "Performance studio",
      emotionalPromise: "discipline, energy, results",
      paletteNote: "Ink black, electric lime or sharp accent",
      ink: "#07090f",
      ink2: "#0e121b",
      surface: "#131824",
      accent: "#c8ff3d",
      onAccent: "#0a0c10",
      fontDisplay: '"Syne", system-ui, sans-serif',
      fontBody: '"Plus Jakarta Sans", system-ui, sans-serif',
      googleFontsHref: FONT_SYNE,
      radius: "14px",
      radiusLg: "24px",
      voice: "Direct, energetic, zero fluff. Performance language.",
      headlineStyle: "Sharp, two-line hero. Metrics matter.",
      imageDirection:
        "Serious training floors, coached movement. Prefer dark and brown skin athletes/coaches. High contrast, kinetic, not gym-bro cliché.",
      ctaTone: "Book a free session · Start training",
    });
  }

  // Real estate / short let
  if (/real_estate|estate|short_let|property/.test(id)) {
    return d({
      archetype: "quiet_authority",
      label: "Architectural discretion",
      emotionalPromise: "status, trust, legacy",
      paletteNote: "Midnight navy, slate, cool metallic",
      ink: "#0a0e14",
      ink2: "#111822",
      surface: "#171e2a",
      accent: "#a8b4c4",
      onAccent: "#0a0e14",
      fontDisplay: '"Instrument Serif", Georgia, serif',
      fontBody: '"DM Sans", system-ui, sans-serif',
      googleFontsHref: FONT_PRECISE,
      imageDirection:
        "Architectural photography, strong negative space. Humans secondary; when present, prefer brown and dark skin clients in refined interiors.",
      ctaTone: "View listings · Enquire",
      voice: "Precise, discreet, authoritative.",
    });
  }

  // Law / accounting / advisory
  if (/law|legal|accounting|audit|tax|advisory|wealth/.test(id)) {
    return d({
      archetype: "quiet_authority",
      label: "Professional authority",
      emotionalPromise: "trust and precision",
      paletteNote: "Charcoal, deep navy, restrained gold",
      ink: "#0b0d12",
      ink2: "#12151c",
      surface: "#1a1e28",
      accent: "#b8a06a",
      fontDisplay: '"Instrument Serif", Georgia, serif',
      fontBody: '"DM Sans", system-ui, sans-serif',
      googleFontsHref: FONT_PRECISE,
      radius: "6px",
      radiusLg: "12px",
      imageDirection:
        "Quiet offices, composed portraits. Prefer dark and brown skin professionals in tailored settings. No stock handshake clichés.",
      ctaTone: "Book a consultation · Contact chambers",
    });
  }

  // Fashion / jewelry / african wear
  if (/fashion|boutique|jewelry|ankara|african_wear|tailor/.test(id)) {
    return d({
      archetype: "modern_heritage",
      label: "Editorial atelier",
      emotionalPromise: "desire, identity, craft",
      paletteNote: "Near black, ivory, champagne",
      ink: "#0a0a0a",
      ink2: "#121212",
      surface: "#1a1a1a",
      accent: "#d4c4a8",
      imageDirection:
        "Campaign energy, strong form. Prefer dark and brown skin models, African luxury aesthetic when relevant, editorial lighting.",
      ctaTone: "Shop the collection · Book fitting",
      voice: "Minimal words, maximum presence.",
    });
  }

  // Healthcare
  if (/clinic|dental|pharmacy|healthcare|hospital/.test(id)) {
    return d({
      archetype: "clinical_precision",
      label: "Clinical calm",
      emotionalPromise: "safety and care",
      paletteNote: "Soft ink, clean white surface accents, teal or soft blue",
      ink: "#0c1214",
      ink2: "#121a1c",
      surface: "#182224",
      accent: "#5b9a8b",
      onAccent: "#061012",
      fontDisplay: '"Syne", system-ui, sans-serif',
      fontBody: '"Plus Jakarta Sans", system-ui, sans-serif',
      googleFontsHref: FONT_SYNE,
      radius: "12px",
      radiusLg: "20px",
      imageDirection:
        "Clean clinical spaces, calm care. Prefer dark and brown skin clinicians/patients with dignity. Bright but soft light.",
      ctaTone: "Book appointment · Speak to us",
      voice: "Warm authority — clear, reassuring, never alarming.",
    });
  }

  // Hotel / events
  if (/hotel|stay|lodge|event_centre|event/.test(id)) {
    return d({
      archetype: "warm_institution",
      label: "Hospitality grandeur",
      emotionalPromise: "arrival and comfort",
      paletteNote: "Deep teal or espresso, gold, soft light",
      ink: "#0c1012",
      ink2: "#141a1c",
      surface: "#1c2426",
      accent: "#c9a86c",
      imageDirection:
        "Interiors, tablescapes, arrival moments. Prefer dark and brown skin guests in elevated hospitality settings.",
      ctaTone: "Check availability · Enquire",
    });
  }

  // Creative / photo
  if (/photo|video|creative|agency|marketing/.test(id)) {
    return d({
      archetype: "editorial_craft",
      label: "Creative studio",
      emotionalPromise: "vision and craft",
      paletteNote: "Black, white, one sharp accent",
      ink: "#080808",
      ink2: "#111111",
      surface: "#181818",
      accent: "#e8e4dc",
      onAccent: "#080808",
      fontDisplay: '"Syne", system-ui, sans-serif',
      fontBody: '"Plus Jakarta Sans", system-ui, sans-serif',
      googleFontsHref: FONT_SYNE,
      imageDirection:
        "Portfolio-grade frames. Prefer dark and brown skin subjects in editorial compositions.",
      ctaTone: "Start a project · View work",
    });
  }

  // Auto
  if (/auto|car|mechanic|dealership/.test(id)) {
    return d({
      archetype: "technical_opulence",
      label: "Automotive precision",
      emotionalPromise: "power and care",
      paletteNote: "Graphite, signal red or amber accent",
      ink: "#0a0b0d",
      ink2: "#12141a",
      surface: "#1a1d24",
      accent: "#e8a317",
      onAccent: "#0a0b0d",
      fontDisplay: '"Syne", system-ui, sans-serif',
      fontBody: '"Plus Jakarta Sans", system-ui, sans-serif',
      googleFontsHref: FONT_SYNE,
      imageDirection:
        "Detail shots, showroom calm, skilled hands. Prefer dark and brown skin specialists when humans appear.",
      ctaTone: "Book inspection · Enquire",
    });
  }

  // Tech / logistics / school / church / general
  if (/tech|saas|software|digital/.test(id)) {
    return d({
      archetype: "product_clarity",
      label: "Technical clarity",
      emotionalPromise: "capability and trust",
      paletteNote: "Deep ink, electric violet or cyan accent",
      ink: "#07090f",
      ink2: "#0e121b",
      surface: "#131824",
      accent: "#a78bfa",
      onAccent: "#0a0c10",
      fontDisplay: '"Syne", system-ui, sans-serif',
      fontBody: '"Plus Jakarta Sans", system-ui, sans-serif',
      googleFontsHref: FONT_SYNE,
      radius: "12px",
      radiusLg: "20px",
      imageDirection: "Product UI, abstract geometry, or composed team with diverse representation.",
      ctaTone: "Get started · Talk to us",
    });
  }

  if (/school|education|church|faith|ministry/.test(id)) {
    return d({
      archetype: "warm_institution",
      label: "Institutional warmth",
      emotionalPromise: "belonging and growth",
      paletteNote: "Deep navy or wine, soft gold",
      ink: "#0c0e14",
      ink2: "#141824",
      surface: "#1c2030",
      accent: "#d4b87a",
      imageDirection:
        "Community and learning with dignity. Prefer dark and brown skin representation; avoid stereotypes.",
      ctaTone: "Enquire · Join us",
    });
  }

  if (/logistics|courier|dispatch/.test(id)) {
    return d({
      archetype: "product_clarity",
      label: "Operational clarity",
      emotionalPromise: "reliability",
      paletteNote: "Slate, signal orange accent",
      ink: "#0b0d10",
      ink2: "#12151a",
      surface: "#1a1e24",
      accent: "#f59e0b",
      onAccent: "#0b0d10",
      fontDisplay: '"Syne", system-ui, sans-serif',
      fontBody: '"Plus Jakarta Sans", system-ui, sans-serif',
      googleFontsHref: FONT_SYNE,
      ctaTone: "Request pickup · Get a quote",
    });
  }

  return OPULENT_DEFAULT;
}

/** Prompt block injected into generateSite user message */
export function opulentPromptBlock(nicheId: string, brand: string): string {
  const o = resolveOpulentDirection(nicheId);
  return `
=== OPULENT DIRECTION (mandatory) ===
Archetype: ${o.archetype} — ${o.label}
Emotional promise: ${o.emotionalPromise}
Palette: ${o.paletteNote}
Voice: ${o.voice}
Headline style: ${o.headlineStyle}
CTA tone: ${o.ctaTone}
Avoid: ${o.avoid}

IMAGE DIRECTION (critical):
${o.imageDirection}
- Source only from the provided image URLs (already curated). Describe alts that match elevated, dignified scenes.
- Prefer framing language that assumes dark and brown skin presence where humans appear — never stereotypical.

COPY RULES:
- Brand already owns its tier. No "welcome to", "we are passionate", "one-stop shop", lorem, or fake awards.
- Short powerful headlines. Supporting text considered and specific to ${brand}.
- Metrics should feel real for this niche (or omit fluff numbers — use process steps if unknown).
- Every line must reinforce exclusivity and quiet confidence — private members’ club, not marketplace.
`.trim();
}

export function shellSystemPromptOpulent(): string {
  return `You are an elite creative director writing website COPY only (JSON) for high-end, opulent, bespoke multi-page business sites.

CORE PHILOSOPHY
- Luxury is restraint + precision + sensory richness.
- Opulence is materiality (deep tones, refined metallics, generous whitespace, cinematic imagery) — never clutter or loudness.
- Every word reinforces exclusivity and quiet confidence. The brand feels custom-commissioned, not template-made.

OUTPUT
Return a single JSON object only (no markdown, no HTML, no CSS) with keys:
kicker, headlineLine1, headlineLine2, lead, primaryCta, secondaryCta,
metrics (array of {value,label} length 3),
marquee (string[]),
services (array of {tag,title,body,image} length 3-4 — image MUST be one of the provided URLs),
aboutTitle, aboutParagraphs (string[]), aboutList (string[]), aboutImage (URL from list),
gallery (array of {src,alt} from provided URLs),
quotes (optional {text,author}[]),
ctaTitle, ctaBody, footerBlurb, brand, logoUrl.

QUALITY GATE (silent self-check before answer)
- Does copy feel custom and expensive for THIS niche?
- Specific to the bio/captions provided (no generic unrelated story)?
- Would a discerning client feel this brand is "for them"?
If no, revise in your head, then output JSON only.`;
}
