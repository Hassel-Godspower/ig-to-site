import type { InstagramProfile } from "./parseInstagramExport";

/**
 * Multi-page static site from Instagram data via Groq.
 * Niche is inferred from name + bio + captions so design, copy, and
 * imagery match spa / commerce / real-estate / etc. — not a random template.
 */

export type BusinessNiche =
  | "spa_wellness"
  | "beauty_salon"
  | "restaurant_food"
  | "ecommerce_retail"
  | "real_estate"
  | "legal_professional"
  | "healthcare_clinic"
  | "auto_dealership"
  | "hotel_stay"
  | "fitness_gym"
  | "education"
  | "creative_portfolio"
  | "church_faith"
  | "tech_saas"
  | "general_business";

type NicheGuide = {
  id: BusinessNiche;
  label: string;
  keywords: string[];
  palette: string;
  typography: string;
  imagery: string;
  mood: string;
  pagesHint: string;
  homepageSections: string;
  ctaStyle: string;
};

const NICHE_GUIDES: NicheGuide[] = [
  {
    id: "spa_wellness",
    label: "Spa / Wellness / Massage",
    keywords: [
      "spa", "massage", "wellness", "facial", "hammam", "sauna", "hot stone",
      "bodywork", "relax", "therapy", "aromatherapy", "scrub", "manicure",
      "pedicure", "nail", "beauty spa", "day spa", "reflexology",
    ],
    palette:
      "Soft neutrals + sage/emerald or dusty rose; cream backgrounds; muted gold accents. Avoid loud neon.",
    typography:
      "Elegant serif for headings (e.g. Cormorant Garamond, Playfair Display) + clean sans for body (DM Sans, Inter).",
    imagery:
      "Calm treatment rooms, hands/massage, stones, towels, candles, soft lighting. Warm, serene photos — not party or product-grid shots.",
    mood: "Serene, restorative, premium care",
    pagesHint:
      "Home, About, Services (treatments + prices), Gallery, Contact (booking CTA / WhatsApp).",
    homepageSections:
      "Hero with atmospheric image + calming headline → Featured treatments → Why us → Testimonials → Booking CTA",
    ctaStyle: "Book a session / Book your experience — soft rounded buttons",
  },
  {
    id: "beauty_salon",
    label: "Beauty / Salon / Barber",
    keywords: [
      "salon", "hair", "barber", "makeup", "lash", "brow", "braid", "wig",
      "glow", "skincare", "cosmetic", "beautician", "stylist",
    ],
    palette: "Soft black/rose gold or warm beige + blush; high-contrast accents",
    typography: "Stylish display heading + modern sans body",
    imagery: "Before/after hair, salon chairs, styling, glam portraits",
    mood: "Glamorous, confident, polished",
    pagesHint: "Home, About, Services, Gallery, Contact",
    homepageSections: "Hero → Services → Gallery strip → Stylists → Book now",
    ctaStyle: "Book appointment",
  },
  {
    id: "restaurant_food",
    label: "Restaurant / Food / Café",
    keywords: [
      "restaurant", "cafe", "café", "kitchen", "menu", "chef", "food", "dining",
      "cuisine", "grill", "bistro", "bakery", "catering", "delivery", "eatery",
    ],
    palette: "Warm terracotta, deep green, or charcoal + cream; appetizing contrast",
    typography: "Bold display for menu titles + readable body",
    imagery: "Plated dishes, ingredients, dining room, chef — food-forward",
    mood: "Inviting, delicious, local hospitality",
    pagesHint: "Home, Menu (or Services), About, Gallery, Contact / Reservation",
    homepageSections: "Hero dish → Signature menu → About chef → Gallery → Reserve",
    ctaStyle: "View menu / Reserve a table / Order now",
  },
  {
    id: "ecommerce_retail",
    label: "Retail / Product sales / Shop",
    keywords: [
      "shop", "store", "buy", "sale", "product", "order", "delivery", "price",
      "₦", "naira", "catalog", "collection", "fashion", "wear", "boutique",
      "shipping", "cart", "merchandise", "wholesale",
    ],
    palette: "Clean white + strong brand primary; commercial clarity",
    typography: "Modern sans throughout; bold product titles",
    imagery: "Product on clean background, lifestyle shots, packaging — sales-focused",
    mood: "Trustworthy, clear offers, conversion-oriented",
    pagesHint: "Home, Shop/Services (products), About, Gallery, Contact",
    homepageSections: "Hero offer → Featured products → Categories → Trust badges → Shop CTA",
    ctaStyle: "Shop now / Order on WhatsApp / View collection",
  },
  {
    id: "real_estate",
    label: "Real Estate / Property",
    keywords: [
      "estate", "property", "realtor", "agent", "rent", "lease", "apartment",
      "house", "land", "listing", "mortgage", "bedroom", "duplex", "shortlet",
    ],
    palette: "Navy/slate + white + gold or forest green accents — trustworthy",
    typography: "Strong sans headings; clear numbers for prices",
    imagery: "Building exteriors, interiors, skyline, keys — property photography",
    mood: "Professional, credible, aspirational",
    pagesHint: "Home, Properties (services), About, Gallery, Contact",
    homepageSections: "Hero search-style → Featured listings → Why us → Agents → Contact",
    ctaStyle: "View listings / Schedule inspection / Contact agent",
  },
  {
    id: "legal_professional",
    label: "Legal / Consulting / Professional services",
    keywords: [
      "law", "lawyer", "attorney", "legal", "counsel", "advocate", "chambers",
      "consultant", "advisory", "accountant", "audit", "firm", "solicitor",
    ],
    palette: "Deep navy, charcoal, white, restrained gold — formal",
    typography: "Serif headings (authority) + clean sans body",
    imagery: "Office, documents (tasteful), handshake, skyline — no gimmicks",
    mood: "Authoritative, discreet, trustworthy",
    pagesHint: "Home, About, Practice areas/Services, Team, Contact",
    homepageSections: "Hero credibility → Practice areas → About firm → CTA consultation",
    ctaStyle: "Book a consultation / Contact chambers",
  },
  {
    id: "healthcare_clinic",
    label: "Clinic / Healthcare / Dental",
    keywords: [
      "clinic", "hospital", "doctor", "dental", "medical", "patient", "health",
      "pharmacy", "lab", "diagnostic", "pediatric", "optometr",
    ],
    palette: "Medical blue/teal + white; calm and clean",
    typography: "Friendly professional sans",
    imagery: "Clinic interior, care moments, team in coats — reassuring",
    mood: "Caring, sterile-clean, approachable",
    pagesHint: "Home, About, Services, Doctors, Contact / Appointments",
    homepageSections: "Hero care message → Services → Why patients trust us → Book",
    ctaStyle: "Book appointment / Call clinic",
  },
  {
    id: "auto_dealership",
    label: "Auto / Dealership / Mechanic",
    keywords: [
      "auto", "car", "vehicle", "dealer", "motor", "toyota", "benz", "suv",
      "mechanic", "garage", "spare", "workshop", "drive",
    ],
    palette: "Dark charcoal + red or electric blue accents — automotive",
    typography: "Bold condensed headlines + tech sans",
    imagery: "Vehicles, showroom, detail shots, keys — car-forward",
    mood: "Powerful, clear inventory, sales-ready",
    pagesHint: "Home, Inventory/Services, About, Gallery, Contact / Finance",
    homepageSections: "Hero vehicle → Featured stock → Services → Finance CTA",
    ctaStyle: "Browse inventory / Book test drive",
  },
  {
    id: "hotel_stay",
    label: "Hotel / Short-let / Hospitality",
    keywords: [
      "hotel", "lodge", "suite", "guest", "check-in", "booking", "airbnb",
      "short-let", "shortlet", "resort", "staycation", "rooms",
    ],
    palette: "Warm luxury neutrals + deep accent",
    typography: "Elegant serif + light sans",
    imagery: "Rooms, lobby, pool, breakfast — hospitality",
    mood: "Welcoming luxury",
    pagesHint: "Home, Rooms, About, Gallery, Contact / Book",
    homepageSections: "Hero stay → Rooms → Amenities → Book",
    ctaStyle: "Check availability / Book stay",
  },
  {
    id: "fitness_gym",
    label: "Gym / Fitness / Training",
    keywords: [
      "gym", "fitness", "workout", "trainer", "crossfit", "yoga", "pilates",
      "coach", "muscle", "training",
    ],
    palette: "Black + energetic accent (orange/lime)",
    typography: "Heavy display + tight sans",
    imagery: "Training, equipment, athletes",
    mood: "Motivating, energetic",
    pagesHint: "Home, Classes/Services, About, Gallery, Contact",
    homepageSections: "Hero intensity → Programs → Trainers → Join",
    ctaStyle: "Join now / Free trial",
  },
  {
    id: "education",
    label: "School / Training / Education",
    keywords: [
      "school", "academy", "tutor", "course", "learn", "student", "training",
      "institute", "college", "lesson",
    ],
    palette: "Trust blue + warm accent",
    typography: "Clear readable sans",
    imagery: "Classroom, students, certificates",
    mood: "Inspiring, structured",
    pagesHint: "Home, Programs, About, Gallery, Contact / Enroll",
    homepageSections: "Hero mission → Programs → Outcomes → Enroll",
    ctaStyle: "Enroll / Apply now",
  },
  {
    id: "creative_portfolio",
    label: "Creative / Portfolio / Studio",
    keywords: [
      "design", "photographer", "portfolio", "studio", "artist", "creative",
      "branding", "illustrat", "videographer", "director",
    ],
    palette: "Minimal black/white or bold one-accent",
    typography: "Expressive display + neutral body",
    imagery: "Work samples, process, portraits",
    mood: "Creative, distinctive",
    pagesHint: "Home, Work/Gallery, About, Services, Contact",
    homepageSections: "Hero statement → Selected work → About → Contact",
    ctaStyle: "View work / Hire me",
  },
  {
    id: "church_faith",
    label: "Church / Faith / Ministry",
    keywords: [
      "church", "ministry", "pastor", "gospel", "fellowship", "worship",
      "parish", "sermon", "christian", "mosque", "islamic", "temple",
    ],
    palette: "Deep purple/blue + gold or soft warm faith tones",
    typography: "Warm serif + readable sans",
    imagery: "Congregation, worship, community outreach",
    mood: "Welcoming, hopeful",
    pagesHint: "Home, About, Ministries/Services, Gallery, Contact",
    homepageSections: "Hero welcome → Service times → Ministries → Visit",
    ctaStyle: "Plan your visit / Watch live",
  },
  {
    id: "tech_saas",
    label: "Tech / SaaS / App",
    keywords: [
      "software", "saas", "app", "startup", "api", "cloud", "ai", "platform",
      "digital", "tech", "developer",
    ],
    palette: "Modern indigo/violet + dark surfaces",
    typography: "Inter/Geist-style product sans",
    imagery: "UI mockups, abstract gradients, team",
    mood: "Innovative, clear value prop",
    pagesHint: "Home, Features/Services, About, Pricing-style, Contact",
    homepageSections: "Hero product → Features → Social proof → CTA",
    ctaStyle: "Start free / Get demo",
  },
  {
    id: "general_business",
    label: "General local business",
    keywords: [],
    palette: "Professional blue + neutral surfaces",
    typography: "Clean modern sans",
    imagery: "Team, workplace, customers — approachable business",
    mood: "Clear, local, trustworthy",
    pagesHint: "Home, About, Services, Gallery, Contact",
    homepageSections: "Hero → Services → About → Contact",
    ctaStyle: "Contact us / Get a quote",
  },
];

/** Infer niche from Instagram text signals */
export function detectNiche(profile: InstagramProfile): NicheGuide {
  const text = [
    profile.name || "",
    profile.username || "",
    profile.bio || "",
    ...profile.posts.map((p) => p.caption || ""),
  ]
    .join(" ")
    .toLowerCase();

  let best: NicheGuide = NICHE_GUIDES[NICHE_GUIDES.length - 1];
  let bestScore = 0;

  for (const guide of NICHE_GUIDES) {
    if (guide.id === "general_business") continue;
    let score = 0;
    for (const kw of guide.keywords) {
      if (text.includes(kw.toLowerCase())) {
        // multi-word and longer keywords weigh more
        score += kw.includes(" ") ? 3 : Math.min(kw.length, 8) / 2;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = guide;
    }
  }

  // weak signal → general business
  if (bestScore < 2) {
    return NICHE_GUIDES.find((g) => g.id === "general_business")!;
  }
  return best;
}

export async function generateSite(
  profile: InstagramProfile
): Promise<Record<string, string>> {
  const niche = detectNiche(profile);

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "openai/gpt-oss-120b",
      max_tokens: 16000,
      temperature: 0.35,
      messages: [{ role: "user", content: buildPrompt(profile, niche) }],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq request failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const raw: string = data.choices?.[0]?.message?.content ?? "";
  const files = parseMultiPage(raw, profile);
  files["niche.json"] = JSON.stringify(
    {
      id: niche.id,
      label: niche.label,
      detectedAt: new Date().toISOString(),
    },
    null,
    2
  );
  return files;
}

function buildPrompt(profile: InstagramProfile, niche: NicheGuide): string {
  const captions = profile.posts
    .map((p) => `- ${p.caption}`)
    .filter((c) => c.length > 3)
    .slice(0, 24)
    .join("\n");
  const mediaLines =
    (profile as { mediaUrls?: string[] }).mediaUrls
      ?.slice(0, 12)
      .map((u, i) => `${i + 1}. ${u}`)
      .join("\n") ||
    `(no URLs — use https://picsum.photos/seed/${niche.id}-{n}/1200/800 with seeds matching this niche)`;

  const brand = profile.name || profile.username || "Business";
  const bio = profile.bio || "(none)";

  return `You are a senior brand web designer. Build a COMPLETE multi-page static website
(plain HTML + one styles.css + one script.js — no React/Next, no build step)
that matches this business's REAL niche. Do NOT invent a random industry.

=== DETECTED NICHE (mandatory — design must match) ===
Niche ID: ${niche.id}
Niche label: ${niche.label}
Mood: ${niche.mood}
Color direction: ${niche.palette}
Typography: ${niche.typography}
Imagery direction: ${niche.imagery}
Homepage structure: ${niche.homepageSections}
CTA style: ${niche.ctaStyle}
Pages: ${niche.pagesHint}

If any of your design choices would fit a different industry better, change them
to fit ${niche.label} instead.

=== BUSINESS DATA (source of truth for copy) ===
Name: ${brand}
Bio: ${bio}
Username: ${profile.username || "(unknown)"}
Captions (use for services, offers, location, tone — do not ignore):
${captions || "(none)"}

Image URLs (prefer these in <img src>; else niche-appropriate placeholders):
${mediaLines}

=== REQUIRED FILES ===
1. index.html — Home with hero IMAGE (never text-only empty hero) + niche sections
2. about.html — Story rooted in the captions/bio
3. services.html — Real offerings inferred from captions (not generic lorem)
4. gallery.html — Visual grid
5. contact.html — Contact + strong niche CTA
Optional 6th page only if captions clearly need it (menu, booking, shop, properties).

=== DESIGN RULES ===
- Shared header/footer on every page; same relative nav links
- <link rel="stylesheet" href="styles.css"> and <script src="script.js" defer></script>
- CSS variables: --primary, --text, --muted, --bg, --surface aligned to niche palette
- Google Fonts OK (one family pair matching typography direction)
- Responsive mobile layout
- Copy must sound like THIS business, not a stock template

=== EDITOR HOOKS ===
- id="site-title" on brand in header
- id="hero-headline", id="hero-subheadline", id="cta-button" on index hero
- class="site-section" data-section-name="..." on major sections

=== OUTPUT FORMAT (strict, no markdown fences, no commentary) ===
===PAGE:index.html===
<!DOCTYPE html>
...
===PAGE:about.html===
...
===PAGE:services.html===
...
===PAGE:gallery.html===
...
===PAGE:contact.html===
...
===CSS===
...full styles.css...
===JS===
...full script.js...

Each PAGE is a full HTML5 document. Prefer complete working pages over long prose.`;
}

function parseMultiPage(
  raw: string,
  profile: InstagramProfile
): Record<string, string> {
  const files: Record<string, string> = {};

  const pageRe =
    /===PAGE:([a-z0-9._-]+)===\s*([\s\S]*?)(?====PAGE:|===CSS===|===JS===|$)/gi;
  let m: RegExpExecArray | null;
  while ((m = pageRe.exec(raw)) !== null) {
    const name = m[1].trim().toLowerCase();
    const body = m[2].trim();
    if (name.endsWith(".html") && body.length > 50) {
      files[name] = stripFences(body);
    }
  }

  if (!files["index.html"]) {
    const htmlMatch = raw.match(
      /===HTML===([\s\S]*?)(?:===CSS===|===PAGE:|$)/i
    );
    if (htmlMatch) files["index.html"] = stripFences(htmlMatch[1].trim());
  }

  const cssMatch = raw.match(/===CSS===([\s\S]*?)(?:===JS===|$)/i);
  const jsMatch = raw.match(/===JS===([\s\S]*)$/i);
  if (cssMatch) files["styles.css"] = stripFences(cssMatch[1].trim());
  if (jsMatch) files["script.js"] = stripFences(jsMatch[1].trim());

  if (!files["index.html"]) {
    throw new Error(
      "Groq response missing index.html. Expected ===PAGE:index.html===. Retry generation."
    );
  }
  if (!files["styles.css"]) {
    files["styles.css"] =
      "body{font-family:system-ui;margin:0;padding:1rem;line-height:1.5}";
  }
  if (!files["script.js"]) files["script.js"] = "/* goke */\n";

  const brand = profile.name || profile.username || "Home";
  for (const page of [
    "about.html",
    "services.html",
    "gallery.html",
    "contact.html",
  ]) {
    if (!files[page]) files[page] = minimalPage(brand, page.replace(".html", ""));
  }

  const pages = Object.keys(files)
    .filter((k) => k.endsWith(".html"))
    .sort((a, b) => {
      if (a === "index.html") return -1;
      if (b === "index.html") return 1;
      return a.localeCompare(b);
    })
    .map((file) => ({ file, title: pageTitle(file) }));

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
    <p>Edit this page in gòke.</p>
  </section>
</main>
<footer><p>© ${brand}</p></footer>
<script src="script.js" defer></script>
</body>
</html>`;
}
