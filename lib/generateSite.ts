import type { InstagramProfile } from "./parseInstagramExport";

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

export async function generateSite(
  profile: InstagramProfile
): Promise<Record<string, string>> {
  const niche = detectNiche(profile);
  const waNumber = extractWhatsAppNumber(profile);

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
            "You are a Principal Frontend Engineer and brand designer. Convert Instagram business data into a PREMIUM multi-page static website (semantic HTML5 + one styles.css + one script.js only). No React, no Tailwind CDN, no Bootstrap. The design must unmistakably match the detected niche the way a high-end agency would: hotel = cinematic luxury; fitness = dark high-energy; architecture = editorial white serif; auto = performance hero + inventory grid; beauty/hair = product-forward gallery; cosmetics = soft light beauty. Output ONLY the required file blocks. No markdown, no lorem, no TODO, no invented awards.",
        },
        { role: "user", content: buildPrompt(profile, niche, waNumber) },
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
  files["niche.json"] = JSON.stringify(
    {
      id: niche.id,
      label: niche.label,
      whatsapp: waNumber,
      detectedAt: new Date().toISOString(),
    },
    null,
    2
  );
  return files;
}

function buildPrompt(
  profile: InstagramProfile,
  niche: NicheGuide,
  waNumber: string | null
): string {
  const captions = profile.posts
    .map((p) => `- ${p.caption}`)
    .filter((c) => c.length > 3)
    .slice(0, 28)
    .join("\n");
  const mediaLines =
    (profile as { mediaUrls?: string[] }).mediaUrls
      ?.slice(0, 14)
      .map((u, i) => `${i + 1}. ${u}`)
      .join("\n") ||
    `(no URLs — use https://picsum.photos/seed/${niche.id}-{n}/1600/1000 with niche-matching subjects)`;

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
- Desktop nav = horizontal links; HIDE hamburger (.nav-toggle { display:none !important })
- Mobile = hamburger toggles #site-nav; close on link click
- body data-wa="${waNumber || ""}" on every page
- Editor hooks: id="site-title", id="hero-headline", id="hero-subheadline", id="cta-button" on Home; data-goke on heading|text|image|link|button; class="site-section" data-section-name="..."
- NO lorem ipsum, NO fake metrics/awards/prices, NO empty white heroes

=== LAYER 4 — DESIGN SYSTEM (styles.css :root) ===
Define --primary --primary-hover --bg --surface --text --muted --border --radius --shadow --header-h with HEX for THIS niche.
Hero ~70–100vh with real image + readable overlay.
Dual CTAs everywhere important: .btn solid + .btn-outline.
Gallery cards: image + title + small action button.
Section padding 3rem mobile / 5–6rem desktop; max width ~1200px.

=== LAYER 5 — REQUIRED PAGES (full HTML documents each) ===
1) index.html — Hero (blueprint) → optional trust only if data supports → 3 service/value pillars from captions → about teaser → gallery teaser (2–6 images with labels) → final CTA band
2) about.html — Story from bio → values/method → CTA
3) services.html — Outcome cards from captions (or Vehicles/Training/Collections per blueprint) → process → CTA
4) gallery.html — Full responsive grid; card title from caption first line; button View details / Case study / Shop look per niche
5) contact.html — Pitch → form#contact-form (name, email, message) + submit data-goke="button" → WhatsApp/contact

Shared header on every page:
<header class="site-header" data-goke="container">
  <div class="nav-bar">
    <a href="index.html" class="brand" id="site-title" data-goke="link">${brand}</a>
    <button type="button" class="nav-toggle" data-goke="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav"><span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span><span class="nav-toggle-bar"></span></button>
    <nav id="site-nav" class="site-nav" data-goke="nav">
      <ul class="nav-list">
        <li><a href="index.html" data-goke="link">Home</a></li>
        <li><a href="about.html" data-goke="link">About</a></li>
        <li><a href="services.html" data-goke="link">Services</a></li>
        <li><a href="gallery.html" data-goke="link">Gallery</a></li>
        <li><a href="contact.html" data-goke="link">Contact</a></li>
      </ul>
    </nav>
    <!-- optional desktop-only header CTA links matching blueprint -->
  </div>
</header>
Identical footer: brand, bio line, same links, wa.me if number exists.
<link rel="stylesheet" href="styles.css"> and <script src="script.js" defer></script> on every page.

=== LAYER 6 — script.js ===
1) Mobile nav toggle + aria-expanded
2) #contact-form → preventDefault → https://wa.me/NUMBER?text=... when data-wa set
3) IntersectionObserver .site-section → .is-visible fade-up
4) Optional header elevation on scroll

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

  // Always ensure solid WhatsApp form handler
  files["script.js"] = ensureWhatsAppScript(
    files["script.js"] || "",
    waNumber
  );

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

  files["pages.json"] = JSON.stringify({ pages }, null, 2);
  return files;
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
