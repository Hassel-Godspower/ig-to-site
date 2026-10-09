import type { InstagramProfile } from "./parseInstagramExport";
import { buildNicheCuratedImages } from "./lagosNicheImages";
import { blueprintPromptSection, resolveNicheBlueprint, pagesJsonFromBlueprint } from "./blueprintPrompt";
import { toLegacyNicheId } from "./nicheCompat";

/**
 * Multi-page niche-aware static site via Groq.
 * Phone numbers in bio/captions → contact forms open WhatsApp (wa.me).
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
      "pedicure", "reflexology", "body works", "bodyworks",
    ],
    palette:
      "Soft neutrals + sage/emerald or dusty rose; cream backgrounds; muted gold. No neon.",
    typography:
      "Elegant serif headings (Cormorant Garamond / Playfair) + clean sans body (DM Sans).",
    imagery:
      "Treatment rooms, massage, stones, towels, candles — serene, not product grids.",
    mood: "Serene, restorative, premium care",
    pagesHint: "Home, About, Services, Gallery, Contact (WhatsApp booking)",
    homepageSections:
      "Hero with image → Featured treatments → Why us → Testimonials → Book CTA",
    ctaStyle: "Book your experience",
  },
  {
    id: "beauty_salon",
    label: "Beauty / Salon / Barber",
    keywords: [
      "salon", "hair", "barber", "makeup", "lash", "brow", "braid", "wig",
      "skincare", "stylist", "beautician",
    ],
    palette: "Soft black / rose gold or warm beige + blush",
    typography: "Stylish display + modern sans",
    imagery: "Hair, salon chairs, glam portraits",
    mood: "Glamorous, polished",
    pagesHint: "Home, About, Services, Gallery, Contact",
    homepageSections: "Hero → Services → Gallery → Book",
    ctaStyle: "Book appointment",
  },
  {
    id: "restaurant_food",
    label: "Restaurant / Food / Café",
    keywords: [
      "restaurant", "cafe", "café", "menu", "chef", "food", "dining", "grill",
      "bakery", "catering", "kitchen",
    ],
    palette: "Warm terracotta / deep green / charcoal + cream",
    typography: "Bold menu titles + readable body",
    imagery: "Plated food, dining room, chef",
    mood: "Inviting, local hospitality",
    pagesHint: "Home, Menu/Services, About, Gallery, Contact",
    homepageSections: "Hero dish → Signature menu → Reserve",
    ctaStyle: "Reserve a table / Order on WhatsApp",
  },
  {
    id: "ecommerce_retail",
    label: "Retail / Product sales / Shop",
    keywords: [
      "shop", "store", "buy", "sale", "product", "order", "delivery", "price",
      "catalog", "collection", "fashion", "boutique", "wholesale", "naira",
    ],
    palette: "Clean white + strong brand primary",
    typography: "Modern commercial sans",
    imagery: "Product shots, lifestyle, packaging",
    mood: "Clear offers, conversion-focused",
    pagesHint: "Home, Shop/Services, About, Gallery, Contact",
    homepageSections: "Hero offer → Featured products → Shop CTA",
    ctaStyle: "Shop now / Order on WhatsApp",
  },
  {
    id: "real_estate",
    label: "Real Estate / Property",
    keywords: [
      "estate", "property", "realtor", "agent", "rent", "lease", "apartment",
      "house", "land", "listing", "shortlet", "duplex",
    ],
    palette: "Navy/slate + white + gold",
    typography: "Strong sans; clear price figures",
    imagery: "Buildings, interiors, keys",
    mood: "Professional, credible",
    pagesHint: "Home, Properties, About, Gallery, Contact",
    homepageSections: "Hero → Featured listings → Contact agent",
    ctaStyle: "View listings / WhatsApp agent",
  },
  {
    id: "legal_professional",
    label: "Legal / Consulting / Professional",
    keywords: [
      "law", "lawyer", "attorney", "legal", "counsel", "chambers", "consultant",
      "accountant", "firm", "solicitor",
    ],
    palette: "Deep navy, charcoal, white, restrained gold",
    typography: "Serif headings + clean sans body",
    imagery: "Office, skyline, professional portraits",
    mood: "Authoritative, discreet",
    pagesHint: "Home, About, Services, Gallery, Contact",
    homepageSections: "Hero credibility → Practice areas → Consultation CTA",
    ctaStyle: "Book a consultation",
  },
  {
    id: "healthcare_clinic",
    label: "Clinic / Healthcare",
    keywords: [
      "clinic", "hospital", "doctor", "dental", "medical", "patient", "health",
      "pharmacy",
    ],
    palette: "Medical teal/blue + white",
    typography: "Friendly professional sans",
    imagery: "Clinic, care team — reassuring",
    mood: "Caring, clean",
    pagesHint: "Home, About, Services, Gallery, Contact",
    homepageSections: "Hero → Services → Book appointment",
    ctaStyle: "Book appointment",
  },
  {
    id: "auto_dealership",
    label: "Auto / Dealership",
    keywords: [
      "auto", "car", "vehicle", "dealer", "motor", "mechanic", "garage", "suv",
    ],
    palette: "Charcoal + red or electric blue",
    typography: "Bold headlines + tech sans",
    imagery: "Vehicles, showroom",
    mood: "Powerful, sales-ready",
    pagesHint: "Home, Inventory, About, Gallery, Contact",
    homepageSections: "Hero vehicle → Stock → Test drive CTA",
    ctaStyle: "Browse inventory / WhatsApp dealer",
  },
  {
    id: "hotel_stay",
    label: "Hotel / Short-let",
    keywords: [
      "hotel", "lodge", "suite", "guest", "booking", "shortlet", "short-let",
      "resort", "rooms",
    ],
    palette: "Warm luxury neutrals",
    typography: "Elegant serif + light sans",
    imagery: "Rooms, lobby, amenities",
    mood: "Welcoming luxury",
    pagesHint: "Home, Rooms, About, Gallery, Contact",
    homepageSections: "Hero stay → Rooms → Book",
    ctaStyle: "Check availability",
  },
  {
    id: "fitness_gym",
    label: "Gym / Fitness",
    keywords: [
      "gym", "fitness", "workout", "trainer", "yoga", "coach", "training",
    ],
    palette: "Black + energetic accent",
    typography: "Heavy display + tight sans",
    imagery: "Training, equipment",
    mood: "Motivating",
    pagesHint: "Home, Classes, About, Gallery, Contact",
    homepageSections: "Hero → Programs → Join",
    ctaStyle: "Join now",
  },
  {
    id: "education",
    label: "Education / Training",
    keywords: [
      "school", "academy", "tutor", "course", "learn", "student", "institute",
    ],
    palette: "Trust blue + warm accent",
    typography: "Clear readable sans",
    imagery: "Classroom, students",
    mood: "Inspiring",
    pagesHint: "Home, Programs, About, Gallery, Contact",
    homepageSections: "Hero → Programs → Enroll",
    ctaStyle: "Enroll now",
  },
  {
    id: "creative_portfolio",
    label: "Creative / Portfolio",
    keywords: [
      "design", "photographer", "portfolio", "studio", "artist", "creative",
      "branding", "videographer",
    ],
    palette: "Minimal black/white or one bold accent",
    typography: "Expressive display + neutral body",
    imagery: "Work samples, process",
    mood: "Distinctive creative",
    pagesHint: "Home, Work, About, Services, Contact",
    homepageSections: "Hero → Selected work → Hire CTA",
    ctaStyle: "View work / Hire me",
  },
  {
    id: "church_faith",
    label: "Church / Faith",
    keywords: [
      "church", "ministry", "pastor", "gospel", "worship", "fellowship",
    ],
    palette: "Deep purple/blue + gold",
    typography: "Warm serif + readable sans",
    imagery: "Worship, community",
    mood: "Welcoming, hopeful",
    pagesHint: "Home, About, Ministries, Gallery, Contact",
    homepageSections: "Hero → Service times → Visit",
    ctaStyle: "Plan your visit",
  },
  {
    id: "tech_saas",
    label: "Tech / SaaS",
    keywords: [
      "software", "saas", "app", "startup", "api", "cloud", "ai", "platform",
      "digital", "tech",
    ],
    palette: "Indigo/violet + dark surfaces",
    typography: "Product sans (Inter-like)",
    imagery: "UI mockups, abstract gradients",
    mood: "Innovative, clear value",
    pagesHint: "Home, Features, About, Gallery, Contact",
    homepageSections: "Hero product → Features → Demo CTA",
    ctaStyle: "Get demo / Start free",
  },
  {
    id: "general_business",
    label: "General local business",
    keywords: [],
    palette: "Professional blue + neutrals",
    typography: "Clean modern sans",
    imagery: "Team, workplace, customers",
    mood: "Clear, local, trustworthy",
    pagesHint: "Home, About, Services, Gallery, Contact",
    homepageSections: "Hero → Services → Contact",
    ctaStyle: "Contact us / Get a quote",
  },
];


/** High-quality Unsplash fallbacks (Lagos niche catalogue) when IG export has few/no image URLs */
const NICHE_CURATED_IMAGES: Record<string, string[]> = buildNicheCuratedImages();


function resolveGalleryUrls(profile: InstagramProfile, nicheId: string): string[] {
  const fromIg = (profile.mediaUrls || []).filter(
    (u) =>
      typeof u === "string" &&
      /^https?:\/\//i.test(u) &&
      !u.includes("example.com") &&
      !u.includes("picsum.photos")
  );
  const curated =
    NICHE_CURATED_IMAGES[nicheId] || NICHE_CURATED_IMAGES.general_business;
  const out = [...fromIg];
  let i = 0;
  while (out.length < 8) {
    out.push(curated[i % curated.length]);
    i++;
  }
  return out.slice(0, 12);
}

function captionTitles(profile: InstagramProfile): string[] {
  return profile.posts
    .map((p) => (p.caption || "").split("\n")[0].trim())
    .filter((s) => s.length > 2)
    .slice(0, 12);
}


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
        score += kw.includes(" ") ? 3 : Math.min(kw.length, 8) / 2;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = guide;
    }
  }
  if (bestScore < 2) {
    return NICHE_GUIDES.find((g) => g.id === "general_business")!;
  }
  return best;
}

/** Digits-only international number for wa.me, or null */
export function extractWhatsAppNumber(profile: InstagramProfile): string | null {
  const text = [
    profile.bio || "",
    profile.name || "",
    ...profile.posts.map((p) => p.caption || ""),
  ].join(" ");

  const patterns = [
    /\+234[\s\-.]?\d{3}[\s\-.]?\d{3}[\s\-.]?\d{4}/,
    /\+234[\s\-.]?\d{10}/,
    /(?:^|[^\d])(0[789][01]\d{8})(?:[^\d]|$)/,
    /\+\d{10,15}/,
    /(?:whats?app|wa|call|tel|phone|contact)[:\s]*([+0-9][0-9\s\-.]{8,18})/i,
  ];

  for (const re of patterns) {
    const m = text.match(re);
    if (!m) continue;
    let raw = (m[1] || m[0]).replace(/[^\d+]/g, "");
    let digits = raw.replace(/\D/g, "");
    if (digits.startsWith("0") && digits.length === 11) {
      digits = "234" + digits.slice(1);
    }
    if (digits.length >= 10 && digits.length <= 15) return digits;
  }
  return null;
}


/** Deterministic SEO + a11y fixes on generated HTML (does not rely on model luck). */
function ensurePageSeo(html: string, opts: { title: string; description: string; pageName?: string }): string {
  let h = html;
  if (!/lang\s*=/i.test(h)) {
    h = h.replace(/<html\b/i, '<html lang="en"');
  }
  if (!/<meta[^>]+charset=/i.test(h)) {
    h = h.replace(/<head([^>]*)>/i, '<head$1>\n<meta charset="utf-8"/>');
  }
  if (!/<meta[^>]+name=["']viewport["']/i.test(h)) {
    h = h.replace(
      /<head([^>]*)>/i,
      '<head$1>\n<meta name="viewport" content="width=device-width, initial-scale=1"/>'
    );
  }
  const title = opts.title.slice(0, 70);
  const desc = opts.description.slice(0, 160);
  if (!/<title>/i.test(h)) {
    h = h.replace(/<head([^>]*)>/i, `<head$1>\n<title>${title}</title>`);
  }
  if (!/<meta[^>]+name=["']description["']/i.test(h)) {
    h = h.replace(
      /<head([^>]*)>/i,
      `<head$1>\n<meta name="description" content="${desc.replace(/"/g, "&quot;")}"/>`
    );
  }
  if (!/property=["']og:title["']/i.test(h)) {
    h = h.replace(
      /<head([^>]*)>/i,
      `<head$1>\n<meta property="og:title" content="${title.replace(/"/g, "&quot;")}"/>\n<meta property="og:description" content="${desc.replace(/"/g, "&quot;")}"/>`
    );
  }
  // Ensure images have alt if missing
  h = h.replace(/<img(?![^>]*\balt=)([^>]*)>/gi, '<img alt=""$1>');
  return h;
}

function buildSitemap(pages: { file: string }[]): string {
  const urls = pages
    .map((p) => {
      const loc = p.file === "index.html" ? "/" : `/${p.file}`;
      return `  <url><loc>${loc}</loc></url>`;
    })
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}


export async function generateSite(
  profile: InstagramProfile
): Promise<Record<string, string>> {
  const bp = resolveNicheBlueprint(profile as InstagramProfile & { nicheHint?: string });
  const intel = blueprintPromptSection(profile as InstagramProfile & { nicheHint?: string });
  // Map blueprint → legacy guide id for Lagos image packs
  const legacyId = toLegacyNicheId(bp.id);
  const niche = detectNiche(profile);
  // Prefer legacy mapping when user picked a fine-grained niche
  const imageNicheId = legacyId !== "general_business" ? legacyId : niche.id;
  const waNumber = extractWhatsAppNumber(profile);
  const galleryUrls = resolveGalleryUrls(profile, imageNicheId);
  const titles = captionTitles(profile);

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
      messages: [
        {
          role: "system",
          content:
            "You are a Principal Frontend Engineer shipping production static multi-page sites at the quality of Club One Africa and Pax & Pearl Body Works: real logo in header, CSS design tokens, sticky horizontal nav, mobile hamburger panel, multi-column footer, mobile app-style bottom tab bar, scroll-reveal sections, dual CTAs, and niche-accurate photography. Output ONLY HTML5. CRITICAL SEO (every HTML page): unique <title>, meta name='description', meta name='viewport', Open Graph og:title/og:description, semantic landmarks (header/main/footer), one H1 per page, img alt text, lang='en' on <html>.  Output ONLY HTML5 pages + one styles.css + one script.js. No React, no Tailwind CDN, no Bootstrap. No markdown, no lorem, no TODO.",
        },
        { role: "user", content: buildPrompt(profile, niche, waNumber, galleryUrls, titles) + "\n\n" + intel },
      ],
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Groq request failed (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const raw: string = data.choices?.[0]?.message?.content ?? "";
  const files = parseMultiPage(raw, profile, waNumber);

  // Deterministic SEO pass on every HTML page
  const brand = profile.name || profile.username || "Business";
  const baseDesc = (profile.bio || `${brand} — official website`).replace(/\s+/g, " ").slice(0, 160);
  for (const [name, content] of Object.entries(files)) {
    if (!name.endsWith(".html") || typeof content !== "string") continue;
    const pageLabel = name.replace(/\.html$/i, "").replace(/index/i, "Home");
    files[name] = ensurePageSeo(content, {
      title: name === "index.html" ? brand : `${pageLabel} · ${brand}`,
      description: baseDesc,
      pageName: pageLabel,
    });
  }

  // robots + sitemap for static host
  try {
    const pagesMeta = files["pages.json"]
      ? (JSON.parse(files["pages.json"]).pages as { file: string }[])
      : [{ file: "index.html" }];
    files["sitemap.xml"] = buildSitemap(Array.isArray(pagesMeta) ? pagesMeta : [{ file: "index.html" }]);
    files["robots.txt"] = "User-agent: *\nAllow: /\nSitemap: /sitemap.xml\n";
  } catch {
    files["robots.txt"] = "User-agent: *\nAllow: /\n";
  }

  files["niche.json"] = JSON.stringify(
    {
      id: bp.id,
      label: bp.label,
      legacyId: niche.id,
      primaryCTA: bp.primaryCTA,
      primaryGoal: bp.primaryGoal,
      whatsapp: waNumber,
      detectedAt: new Date().toISOString(),
    },
    null,
    2
  );
  if (!files["pages.json"]) {
    try {
      files["pages.json"] = pagesJsonFromBlueprint(bp);
    } catch {
      /* optional */
    }
  }
  try {
    files["niche.json"] = JSON.stringify(
      {
        id: bp.id,
        label: bp.label,
        primaryCTA: bp.primaryCTA,
        primaryGoal: bp.primaryGoal,
      },
      null,
      2
    );
  } catch {
    /* optional */
  }
  return files;
}

function buildPrompt(
  profile: InstagramProfile,
  niche: NicheGuide,
  waNumber: string | null,
  galleryUrls: string[],
  titles: string[]
): string {
  const captions = profile.posts
    .map((p) => `- ${p.caption}`)
    .filter((c) => c.length > 3)
    .slice(0, 28)
    .join("\n");
  const mediaLines = galleryUrls
    .map((u, i) => `${i + 1}. ${u}${i === 0 ? " (prefer as HERO)" : ""}`)
    .join("\n");
  const titleLines =
    titles.map((x, i) => `${i + 1}. ${x}`).join("\n") || "(derive from bio)";

  const brand = profile.name || profile.username || "Business";
  const bio = profile.bio || "(none)";
  const wa = waNumber || "NONE";

  const nicheBrief = [
    `Mood: ${niche.mood}`,
    `Palette: ${niche.palette}`,
    `Typography: ${niche.typography}`,
    `Imagery: ${niche.imagery}`,
    `Home flow: ${niche.homepageSections}`,
    `CTA language: ${niche.ctaStyle}`,
  ].join("\n");

  /**
   * Blueprint taken from production-quality IG→site mockups:
   * hotel, fitness, architecture, auto, hair/beauty, cosmetics.
   * Pages, nav labels, gallery titles, and CTA copy must follow the blueprint for the detected niche.
   */
  const blueprints: Record<
    string,
    { nav: string; pagesExtra: string; hero: string; gallery: string; headerCtas: string; look: string }
  > = {
    hotel_stay: {
      nav: "Home · About · Accommodation · Dining · Gallery · Contact",
      pagesExtra: "Prefer services.html titled as Accommodation/Dining content; gallery = room types with labels (Suite, Deluxe, Pool Villa…).",
      hero: "Full-bleed room/view photo, large brand name, elegant tagline about hospitality, dual CTAs BOOK NOW + VIEW SPECIALS. Dark gradient overlay on photo.",
      gallery: "Labeled room cards in a horizontal/grid strip under a bold GALLERY heading on dark band.",
      headerCtas: "VIEW SPECIALS + BOOK NOW / RESERVATIONS",
      look: "Luxury hotel: navy/charcoal + gold accents, serif or refined sans, cinematic photography.",
    },
    fitness_gym: {
      nav: "Home · About · Training · Results · Gallery · Contact",
      pagesExtra: "services.html = Training programs; gallery = gym/athletes/meals if in captions.",
      hero: "Dark gym interior full-bleed, huge brand name, strength/community tagline, dual CTAs BOOK A FREE SESSION + MEMBERSHIP / EXPLORE TRAINING.",
      gallery: "High-energy training + community photos; bold GALLERY on dark section.",
      headerCtas: "EXPLORE TRAINING + BOOK A FREE SESSION",
      look: "Gymshark energy: dark surfaces, bold condensed type, high-contrast buttons, motion photography.",
    },
    creative_portfolio: {
      nav: "Home · About · Projects · Experience · Gallery · Contact",
      pagesExtra: "services.html can be Projects hub; gallery = selected works with View Case Study buttons.",
      hero: "Full-bleed architecture/design photo, large serif headline (name + craft statement), sub Explore the vision…, dual CTAs HIRE ME + VIEW CV/WORK.",
      gallery: "SELECTED PROJECTS: 3-col cards — image, project title from caption first line, VIEW CASE STUDY button.",
      headerCtas: "HIRE ME + VIEW CV",
      look: "Editorial white, high-contrast serif headlines, minimal chrome, museum-like project grid.",
    },
    auto_dealership: {
      nav: "Home · Vehicles · Financing · About · Gallery · Contact",
      pagesExtra: "services.html = Vehicles/Financing; gallery = vehicle showcase grid.",
      hero: "Full-bleed car-on-road photo, huge performance headline, sub about discovering the next vehicle, optional filter bar (Body/Make/Year) + FIND VEHICLE CTA + SCHEDULE SERVICE.",
      gallery: "VEHICLE SHOWCASE: cards with image, model name, VEHICLE DETAILS / VIEW SPECS buttons.",
      headerCtas: "BROWSE INVENTORY + SCHEDULE SERVICE",
      look: "Porsche immersion + clean inventory: cinematic hero, white content band, product cards.",
    },
    beauty_salon: {
      nav: "Home · About · Collections · Services · Gallery · Contact",
      pagesExtra: "services = installs/services; gallery = styles, wigs, before/after, product packs.",
      hero: "Salon/product full-bleed, elegant brand wordmark, premium hair tagline, dual CTAs BOOK APPOINTMENT + SHOP / COLLECTIONS.",
      gallery: "Style grid (mannequin/model hair) with clean labels; GALLERY section title.",
      headerCtas: "BOOK APPOINTMENT + SHOP",
      look: "Luxury beauty: dark or soft neutrals, refined serif/sans, product photography first.",
    },
    spa_wellness: {
      nav: "Home · About · Services · Gallery · Contact",
      pagesExtra: "Calm treatment imagery; booking CTAs.",
      hero: "Soft full-bleed treatment/room photo, serene headline, dual CTAs BOOK EXPERIENCE + VIEW SERVICES.",
      gallery: "Treatments and space photos in soft rounded cards.",
      headerCtas: "BOOK NOW + VIEW SERVICES",
      look: "Cream/sage, generous whitespace, soft radius, restorative mood.",
    },
    ecommerce_retail: {
      nav: "Home · Shop · About · Gallery · Contact",
      pagesExtra: "Product-forward; gallery = collection grid with shop CTAs.",
      hero: "Lifestyle or product hero, brand + explore line, dual CTAs SHOP NOW + VIEW COLLECTION.",
      gallery: "Shoppable-style grid: image, short title from caption, SHOP LOOK / VIEW DETAILS.",
      headerCtas: "SHOP NOW + VIEW COLLECTION",
      look: "Clean commerce: product is hero, tight grid, clear price-free CTAs (no fake prices).",
    },
    tech_saas: {
      nav: "Home · Product · Solutions · About · Contact",
      pagesExtra: "Feature grid; light Stripe-like credibility.",
      hero: "Large value headline, dual CTAs GET STARTED + CONTACT SALES, optional soft gradient accent.",
      gallery: "Optional product UI / team imagery if present.",
      headerCtas: "GET STARTED + CONTACT",
      look: "Stripe: crisp type, light surface, violet/indigo accent, trust clarity.",
    },
    restaurant_food: {
      nav: "Home · Menu · About · Gallery · Contact",
      pagesExtra: "Menu cards from captions; food photography hero.",
      hero: "Appetite-led food photo, dual CTAs RESERVE + VIEW MENU.",
      gallery: "Plates and dining room grid.",
      headerCtas: "RESERVE A TABLE + VIEW MENU",
      look: "Warm terracotta/charcoal, large food imagery.",
    },
    real_estate: {
      nav: "Home · Listings · About · Gallery · Contact",
      pagesExtra: "Listing cards; discovery clarity.",
      hero: "Property photo hero, dual CTAs VIEW LISTINGS + CONTACT AGENT.",
      gallery: "Property photo grid with labels.",
      headerCtas: "VIEW LISTINGS + CONTACT AGENT",
      look: "Airbnb clarity: airy UI, large photos, navy/slate accents.",
    },
    general_business: {
      nav: "Home · About · Services · Gallery · Contact",
      pagesExtra: "Standard service business structure.",
      hero: "Strong photo hero, dual CTAs matching bio goal.",
      gallery: "Work/team/product grid from posts.",
      headerCtas: "GET STARTED + CONTACT",
      look: "Premium local brand: clear offer, dual CTAs, no template fluff.",
    },
  };

  // Map related niches
  const bpKey =
    niche.id === "healthcare_clinic"
      ? "spa_wellness"
      : niche.id === "legal_professional" || niche.id === "education"
        ? "tech_saas"
        : niche.id === "church_faith"
          ? "general_business"
          : blueprints[niche.id]
            ? niche.id
            : "general_business";
  const bp = blueprints[bpKey];

  return `Convert this Instagram business into a PREMIUM multi-page website that looks like a custom agency build for this niche (see blueprints inspired by hotel, gym, architect, auto dealer, hair boutique, clean-beauty brands).

=== LAYER 1 — INSTAGRAM DATA (source of truth) ===
Brand name: ${brand}
Username: ${profile.username || "(unknown)"}
Bio: ${bio}
Detected niche: ${niche.id} — ${niche.label}
${nicheBrief}
Captions (use for services, project titles, gallery labels — first line of caption = card title when possible):
${captions || "(none)"}
Media URLs (prefer as <img src>; otherwise niche-matched picsum seeds):
${mediaLines}
WhatsApp: ${wa}
Brand logo / avatar URL (REQUIRED in header when available — use EXACTLY):
${profile.logoUrl || profile.profilePicUrl || profile.mediaUrls?.[0] || galleryUrls[0] || ""}
Brand primary color HEX (if provided, :root --primary and --goke-primary MUST be this exact value):
${profile.brandColor || "(derive from niche palette only if missing)"}
External website from Instagram: ${profile.externalUrl || "(none)"}
Instagram category: ${profile.category || "(detect from bio)"}
IMPORTANT: Copy, headlines, and service labels MUST come from the Bio and Captions above — do not invent a generic unrelated business story when real text is present.
HEADER LOGO RULES:
- If a logo/avatar URL is provided above, the header brand MUST show:
  <a href="index.html" class="brand" id="site-title" data-goke="link">
    <img class="brand-logo site-logo" src="LOGO_URL" alt="${brand}" width="40" height="40" />
    <span class="brand-text">${brand}</span>
  </a>
- .brand { display:inline-flex; align-items:center; gap:0.65rem; text-decoration:none; }
- .brand-logo { width:40px; height:40px; border-radius:50%; object-fit:cover; flex-shrink:0; }
- If URL looks like a wide logo (not a face avatar), use border-radius:8px; height:36px; width:auto; max-width:140px; object-fit:contain;
- If no URL, text-only brand is OK.
Card / project titles from captions (first line → gallery card labels):
${titleLines}

IMAGE RULES:
- Prefer Instagram media URLs when listed above.
- If an IG URL is missing/broken, use the curated Unsplash URLs provided (already niche-matched).
- Hero MUST use image #1 (or best matching niche photo). Never a blank white hero.
- Gallery cards: image + title from caption titles list + niche action button.
- Do NOT invent fake like counts or metrics.

=== LAYER 2 — NICHE BLUEPRINT (mandatory) ===
Look & feel: ${bp.look}
Nav labels (adapt hrefs to existing html files): ${bp.nav}
Header CTAs: ${bp.headerCtas}
Hero direction: ${bp.hero}
Gallery direction: ${bp.gallery}
Notes: ${bp.pagesExtra}

=== LAYER 3 — TECH CONSTRAINTS ===
- HTML5 + ONE styles.css + ONE script.js only (no Tailwind CDN, no Bootstrap, no React)
- Google Fonts allowed (display + body pair for the niche)
- Mobile-first; breakpoints 768px / 1024px
- body data-wa="${waNumber || ""}" on every page
- Editor hooks: id="site-title", id="hero-headline", id="hero-subheadline", id="cta-button" on Home; data-goke on heading|text|image|link|button; class="site-section reveal" data-section-name="..."
- NO lorem ipsum, NO fake metrics/awards/prices, NO empty white heroes
- Site must feel ALIVE: scroll-reveal on sections, smooth hover on buttons/cards, sticky premium header

=== LAYER 4 — DESIGN SYSTEM (styles.css :root) ===
Define --primary --primary-hover --bg --surface --text --muted --border --radius --shadow --header-h with HEX for THIS niche. If Brand primary color HEX is provided, --primary and --goke-primary MUST equal that HEX.
Hero ~70–100vh with real image + readable overlay.
Dual CTAs everywhere important: .btn solid + .btn-outline.
Gallery cards: image + title + small action button.
Section padding 3rem mobile / 5–6rem desktop; max width ~1200px.
Include CSS for .reveal/.site-section opacity transform and .is-visible.
Include CSS for mobile floating footer tab bar (position:fixed; bottom:0) and body padding-bottom.

=== LAYER 5 — REQUIRED PAGES (full HTML documents each) ===
1) index.html — Hero (blueprint) → optional trust only if data supports → 3 service/value pillars from captions → about teaser → gallery teaser (2–6 images with labels) → final CTA band
2) about.html — Story from bio → values/method → CTA
3) services.html — Outcome cards from captions (or Vehicles/Training/Collections per blueprint) → process → CTA
4) gallery.html — Full responsive grid; card title from caption first line; button View details / Case study / Shop look per niche
5) contact.html — Pitch → form#contact-form (name, email, message) + submit data-goke="button" → WhatsApp/contact


=== PRODUCTION QUALITY BAR (match real agency static sites) ===
Reference quality (structure only — do not copy their content/branding):
1) Club One Africa style: sticky header with IMAGE logo + horizontal desktop links + primary nav-cta + hamburger; separate mobile-nav panel; hero as TWO-COLUMN grid (copy + large photo); section-label + section-heading; card grids with .reveal; multi-column footer with logo again; WhatsApp CTAs; CSS :root tokens; IntersectionObserver adds .active on .reveal.
2) Pax & Pearl style: brand logo image; immersive hero (image/overlay, dual primary/secondary buttons); fixed bottom mobile-nav tab bar (icon or short label + text) on small screens; body padding-bottom so content clears the bar; calm spa or high-energy fitness tokens depending on niche.

Your output must feel like those sites: polished spacing, real logo, alive scroll motion — not a bare Bootstrap skeleton.

=== PREMIUM HEADER (identical every page, horizontally aligned) ===
Structure — single row flex, space-between, vertically centered:

<header class="site-header" data-goke="container">
  <div class="nav-bar">
    <a href="index.html" class="brand" id="site-title" data-goke="link">
      <img class="brand-logo site-logo" src="LOGO_OR_AVATAR_URL" alt="${brand}" width="40" height="40" data-goke="image" />
      <span class="brand-text">${brand}</span>
    </a>
    <button type="button" class="nav-toggle menu-toggle" data-goke="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav">
      <span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span>
    </button>
    <nav class="desktop-nav site-nav" id="site-nav" data-goke="nav" aria-label="Main">
      <a href="index.html" data-goke="link">Home</a>
      <a href="about.html" data-goke="link">About</a>
      <a href="services.html" data-goke="link">Services</a>
      <a href="gallery.html" data-goke="link">Gallery</a>
      <a href="contact.html" data-goke="link">Contact</a>
    </nav>
    <!-- Mobile slide panel (Club One pattern): same links, toggled by .menu-toggle -->
    <div class="mobile-nav" id="mobileNav" data-goke="nav" hidden>
      <a href="index.html" data-goke="link">Home</a>
      <a href="about.html" data-goke="link">About</a>
      <a href="services.html" data-goke="link">Services</a>
      <a href="gallery.html" data-goke="link">Gallery</a>
      <a href="contact.html" data-goke="link">Contact</a>
      <a href="contact.html" class="mobile-nav-cta" data-goke="button">Contact</a>
    </div>
    <div class="header-ctas">
      <!-- primary CTA button matching niche; data-goke="button" -->
    </div>
  </div>
</header>

Header CSS:
- .brand { display:inline-flex; align-items:center; gap:0.65rem; } .brand-logo, .site-logo { height:40px; width:auto; max-height:48px; max-width:160px; object-fit:contain; display:block; } /* wide logos: contain; circular avatars may use border-radius:50% + fixed 40px */
- position:sticky; top:0; z-index:100; backdrop-filter:blur(16px); border-bottom subtle
- .nav-bar { display:flex; align-items:center; justify-content:space-between; gap:1rem; max-width:1200px; margin:0 auto; padding:0.85rem 1.25rem; width:100%; }
- Desktop ≥768px: .nav-toggle { display:none !important; } .nav-list { display:flex; flex-direction:row; align-items:center; gap:1.5rem; list-style:none; margin:0; padding:0; }
- Mobile <768px: show hamburger; #site-nav is a full-width DROPDOWN under the bar (absolute or block); use [hidden] or .is-open; .nav-list { flex-direction:column; }
- Every nav link has data-goke="link" so the site editor can change labels and hrefs (point to about.html, services.html, gallery.html, contact.html — add/remove items by editing these links)
- .header-ctas on desktop; may hide on smallest screens

=== PREMIUM FOOTER ===
Desktop ≥768px — horizontal multi-column (not a vertical mess):
<footer class="site-footer" data-goke="container">
  <div class="footer-inner">
    <div class="footer-brand">brand + bio line + location</div>
    <div class="footer-links">same 5 page links</div>
    <div class="footer-connect">Instagram @user + WhatsApp if available</div>
  </div>
  <div class="footer-bottom">© year brand · All rights reserved</div>
</footer>
.footer-inner { display:grid; grid-template-columns:2fr 1fr 1fr; gap:2rem; align-items:start; max-width:1200px; margin:0 auto; padding:3rem 1.25rem; }

Mobile <768px — APP-STYLE FLOATING TAB FOOTER:
- .site-footer { position:fixed; bottom:0; left:0; right:0; z-index:90; padding:0; }
- Show a compact horizontal bar of 4–5 destinations (Home, Services, Gallery, Contact) with short labels — like iOS/Android tab bar
- backdrop-filter:blur(12px); border-top; box-shadow upward
- Hide .footer-brand long text / multi-column on mobile; use .footer-mobile-tabs row only
- body { padding-bottom: 4.5rem; } on mobile so content clears the bar
- Desktop footer stays static multi-column at document end (NOT fixed)

<link rel="stylesheet" href="styles.css"> and <script src="script.js" defer></script> on every page.

=== LAYER 6 — script.js (site must feel ALIVE, not static) ===
1) Mobile nav dropdown: .nav-toggle toggles #site-nav hidden/is-open + aria-expanded; close on link click when width < 768px
2) #contact-form preventDefault → wa.me when data-wa set
3) SCROLL REVEAL required on ALL major sections:
   IntersectionObserver on .site-section, .reveal, main > section
   CSS: .reveal { opacity:0; transform:translateY(28px); transition:0.7s ease; } .reveal.active, .reveal.is-visible, .site-section.is-visible { opacity:1; transform:none; } (Club One uses .reveal.active via IntersectionObserver)
   threshold ~0.12; unobserve after show
4) Header: toggle .is-scrolled when scrollY > 24 (stronger shadow)
5) html { scroll-behavior: smooth; }
6) Buttons/cards: CSS hover transitions 0.2s (lift or shadow)

=== OUTPUT (strict, no markdown) ===
===PAGE:index.html===
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
...
===JS===
...`;
}


function parseMultiPage(
  raw: string,
  profile: InstagramProfile,
  waNumber: string | null
): Record<string, string> {
  const files: Record<string, string> = {};
  const pageRe =
    /===PAGE:([a-z0-9._-]+)===\s*([\s\S]*?)(?====PAGE:|===CSS===|===JS===|$)/gi;
  let m: RegExpExecArray | null;
  while ((m = pageRe.exec(raw)) !== null) {
    const name = m[1].trim().toLowerCase();
    const body = m[2].trim();
    if (name.endsWith(".html") && body.length > 50) {
      files[name] = injectWaAttr(stripFences(body), waNumber);
    }
  }

  if (!files["index.html"]) {
    const htmlMatch = raw.match(
      /===HTML===([\s\S]*?)(?:===CSS===|===PAGE:|$)/i
    );
    if (htmlMatch)
      files["index.html"] = injectWaAttr(
        stripFences(htmlMatch[1].trim()),
        waNumber
      );
  }

  const cssMatch = raw.match(/===CSS===([\s\S]*?)(?:===JS===|$)/i);
  const jsMatch = raw.match(/===JS===([\s\S]*)$/i);
  if (cssMatch) files["styles.css"] = stripFences(cssMatch[1].trim());
  if (jsMatch) files["script.js"] = stripFences(jsMatch[1].trim());

  if (!files["index.html"]) {
    throw new Error(
      "Groq response missing index.html. Retry generation."
    );
  }
  if (!files["styles.css"]) {
    files["styles.css"] =
      "body{font-family:system-ui;margin:0;padding:1rem;line-height:1.5}";
  }
  files["styles.css"] = ensurePremiumCss(files["styles.css"]);

  // Always ensure solid WhatsApp form handler
  files["script.js"] = ensureLiveScript(files["script.js"] || "", waNumber);

  const brand = profile.name || profile.username || "Home";
  for (const page of [
    "about.html",
    "services.html",
    "gallery.html",
    "contact.html",
  ]) {
    if (!files[page]) {
      files[page] = injectWaAttr(
        minimalPage(brand, page.replace(".html", ""), waNumber),
        waNumber
      );
    }
  }

  const pages = Object.keys(files)
    .filter((k) => k.endsWith(".html"))
    .sort((a, b) => {
      if (a === "index.html") return -1;
      if (b === "index.html") return 1;
      return a.localeCompare(b);
    })
    .map((file) => ({ file, title: pageTitle(file) }));

  // Canonical page list for all preview editors (full + simple)
  files["pages.json"] = JSON.stringify(
    {
      pages,
      generatedAt: new Date().toISOString(),
      count: pages.length,
    },
    null,
    2
  );

  // Lightweight meta for editors that also read editor-meta.json
  files["editor-meta.json"] = JSON.stringify(
    {
      pages,
      nicheId: (files["niche.json"] && (() => {
        try {
          return JSON.parse(files["niche.json"]).id;
        } catch {
          return undefined;
        }
      })()) || undefined,
      updatedAt: new Date().toISOString(),
    },
    null,
    2
  );

  return files;
}


/** Baseline CSS so weak model output still feels premium & alive */
function ensurePremiumCss(css: string): string {
  const extras = `
/* goke-premium-baseline */
:root{--goke-primary:#3b82f6;--goke-text:#111;--goke-muted:#6b7280;--goke-bg:#fff;--goke-surface:#f8fafc;--goke-border:#e2e8f0}
*{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;font-family:system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;color:var(--goke-text);background:var(--goke-bg);line-height:1.55}
img{max-width:100%;height:auto;display:block}
a{color:inherit}
.site-header{position:sticky;top:0;z-index:100;backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);background:rgba(255,255,255,.86);border-bottom:1px solid var(--goke-border)}
.site-header.is-scrolled{box-shadow:0 8px 30px rgba(0,0,0,.08)}
.nav-bar{display:flex;align-items:center;justify-content:space-between;gap:1rem;max-width:1200px;margin:0 auto;padding:.85rem 1.25rem}
.brand{display:inline-flex;align-items:center;gap:.65rem;text-decoration:none;font-weight:700}
.brand-logo,.site-logo{height:40px;width:auto;max-height:48px;max-width:160px;object-fit:contain;border-radius:8px}
.desktop-nav,.site-nav .nav-list{display:flex;align-items:center;gap:1.35rem;list-style:none;margin:0;padding:0}
.desktop-nav a,.nav-list a{text-decoration:none;font-size:.92rem;font-weight:500;opacity:.85}
.desktop-nav a:hover,.nav-list a:hover{opacity:1}
.nav-toggle,.menu-toggle{display:none;background:transparent;border:0;cursor:pointer;padding:6px;flex-direction:column;gap:5px}
.nav-toggle-bar,.menu-toggle span{display:block;width:22px;height:2px;background:#111;border-radius:1px}
.mobile-nav{display:none}
.header-ctas a,.btn,a[data-goke=button],button[data-goke=button]{transition:transform .2s ease,box-shadow .2s ease,background .2s ease}
.header-ctas a:hover,.btn:hover{transform:translateY(-1px)}
.site-section,.reveal{opacity:0;transform:translateY(28px);transition:opacity .7s ease,transform .7s ease}
.site-section.is-visible,.site-section.active,.reveal.is-visible,.reveal.active{opacity:1;transform:none}
.hero-grid{display:grid;gap:2rem;align-items:center;max-width:1200px;margin:0 auto;padding:3rem 1.25rem}
@media(min-width:900px){.hero-grid{grid-template-columns:1.1fr .9fr}}
.site-footer{border-top:1px solid var(--goke-border);background:var(--goke-surface);margin-top:3rem}
.footer-inner{display:grid;gap:2rem;max-width:1200px;margin:0 auto;padding:3rem 1.25rem}
@media(min-width:768px){.footer-inner{grid-template-columns:2fr 1fr 1fr}}
.footer-bottom{max-width:1200px;margin:0 auto;padding:1rem 1.25rem 1.5rem;font-size:.8rem;color:var(--goke-muted);border-top:1px solid var(--goke-border)}
@media(max-width:767px){
  .nav-toggle,.menu-toggle{display:inline-flex}
  .desktop-nav{display:none!important}
  .mobile-nav.is-open,.mobile-nav:not([hidden]){display:flex;flex-direction:column;gap:.5rem;padding:1rem 1.25rem;border-top:1px solid var(--goke-border);background:#fff}
  .site-footer{position:fixed;bottom:0;left:0;right:0;z-index:90;margin:0;padding:0;background:rgba(255,255,255,.94);backdrop-filter:blur(12px);border-top:1px solid var(--goke-border);box-shadow:0 -8px 30px rgba(0,0,0,.06)}
  .footer-inner,.footer-bottom{display:none}
  .site-footer::after{content:"";display:flex;justify-content:space-around;padding:.55rem .5rem calc(.55rem + env(safe-area-inset-bottom));font-size:.65rem}
  body{padding-bottom:4.5rem}
}
`;
  if (css.includes("goke-premium-baseline")) return css;
  return css + "\n" + extras;
}

function injectWaAttr(html: string, wa: string | null): string {
  if (!wa) {
    if (/<body[^>]*>/i.test(html) && !/data-wa=/i.test(html)) {
      return html.replace(/<body/i, '<body data-wa=""');
    }
    return html;
  }
  if (/data-wa=/i.test(html)) {
    return html.replace(/data-wa="[^"]*"/i, `data-wa="${wa}"`);
  }
  if (/<body/i.test(html)) {
    return html.replace(/<body/i, `<body data-wa="${wa}"`);
  }
  return html;
}


function ensureLiveScript(js: string, waNumber: string | null): string {
  let out = ensureWhatsAppScript(js, waNumber);
  if (!out.includes("nav-toggle") || !out.includes("site-nav")) {
    out += `
/* goke: mobile nav dropdown */
(function(){
  function bindNav(){
    var toggle=document.querySelector(".nav-toggle");
    var nav=document.querySelector("#mobileNav,.mobile-nav,#site-nav,.site-nav");
    if(!toggle||!nav||toggle.__gokeNav) return;
    toggle.__gokeNav=true;
    toggle.addEventListener("click",function(){
      var open=nav.hasAttribute("hidden")||!nav.classList.contains("is-open");
      if(nav.hasAttribute("hidden")||!nav.classList.contains("is-open")){
        nav.removeAttribute("hidden"); nav.classList.add("is-open");
        toggle.setAttribute("aria-expanded","true");
      } else {
        nav.setAttribute("hidden",""); nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded","false");
      }
    });
    nav.querySelectorAll("a").forEach(function(a){
      a.addEventListener("click",function(){
        if(window.matchMedia("(max-width:767px)").matches){
          nav.setAttribute("hidden",""); nav.classList.remove("is-open");
          toggle.setAttribute("aria-expanded","false");
        }
      });
    });
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",bindNav); else bindNav();
})();
`;
  }
  if (!out.includes("IntersectionObserver") && !out.includes("is-visible")) {
    out += `
/* goke: scroll reveal — sections feel alive */
(function(){
  function reveal(){
    var nodes=document.querySelectorAll(".site-section,.reveal,main section, .footer-inner");
    if(!nodes.length||!("IntersectionObserver" in window)){
      nodes.forEach(function(n){ n.classList.add("is-visible"); n.classList.add("active"); });
      return;
    }
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ en.target.classList.add("is-visible"); en.target.classList.add("active"); io.unobserve(en.target); }
      });
    },{ threshold:0.12, rootMargin:"0px 0px -40px 0px" });
    nodes.forEach(function(n){ io.observe(n); });
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",reveal); else reveal();
})();
/* goke: header scroll state */
(function(){
  var h=document.querySelector(".site-header");
  if(!h) return;
  var onScroll=function(){ h.classList.toggle("is-scrolled", window.scrollY>24); };
  window.addEventListener("scroll", onScroll, { passive:true });
  onScroll();
})();
`;
  }
  return out;
}

function ensureWhatsAppScript(js: string, wa: string | null): string {
  const handler = `
/* goke: contact form → WhatsApp */
(function () {
  function waNumber() {
    var n = (document.body && document.body.getAttribute("data-wa")) || "${wa || ""}";
    return String(n || "").replace(/\\D/g, "");
  }
  function bind() {
    document.querySelectorAll("#contact-form, form[data-goke-contact], form.contact-form").forEach(function (form) {
      if (form.__gokeWa) return;
      form.__gokeWa = true;
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        var num = waNumber();
        var fd = new FormData(form);
        var name = fd.get("name") || fd.get("full-name") || "";
        var email = fd.get("email") || "";
        var message = fd.get("message") || fd.get("msg") || "";
        var lines = [];
        if (name) lines.push("Name: " + name);
        if (email) lines.push("Email: " + email);
        if (message) lines.push("Message: " + message);
        if (!lines.length) {
          var inputs = form.querySelectorAll("input, textarea");
          inputs.forEach(function (el) {
            if (el.type === "submit" || el.type === "button") return;
            if (el.value) lines.push((el.name || el.placeholder || "Field") + ": " + el.value);
          });
        }
        var text = lines.join("\\n") || "Hello! I found you online.";
        if (!num) {
          alert("WhatsApp number not set yet. Add your number in the editor (body data-wa) or bio.");
          return;
        }
        var url = "https://wa.me/" + num + "?text=" + encodeURIComponent(text);
        window.open(url, "_blank", "noopener,noreferrer");
      });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bind);
  else bind();
})();
`;
  if (js.includes("wa.me/")) return js;
  return js.trim() + "\n" + handler;
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

function minimalPage(
  brand: string,
  kind: string,
  wa: string | null
): string {
  const title = pageTitle(kind + ".html");
  const waAttr = wa ? ` data-wa="${wa}"` : ' data-wa=""';
  const contactExtra =
    kind === "contact"
      ? `<form id="contact-form" class="contact-form">
  <label>Name <input name="name" required/></label>
  <label>Email <input name="email" type="email"/></label>
  <label>Message <textarea name="message" rows="4" required></textarea></label>
  <button data-goke="button" type="submit">Send message</button>
</form>`
      : `<p>Edit this page in gòke.</p>`;
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${title} — ${brand}</title>
<link rel="stylesheet" href="styles.css"/>
</head>
<body${waAttr}>
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
    <h1 data-goke="heading">${title}</h1>
    ${contactExtra}
  </section>
</main>
<footer><p>© ${brand}</p></footer>
<script src="script.js" defer></script>
</body>
</html>`;
}
