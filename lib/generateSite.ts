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
            "You are a senior brand designer and conversion copywriter who ships production static websites (HTML + one CSS file + one JS file only). No React, no Next.js, no Tailwind CDN required, no Framer/GSAP. Your sites must look custom-built for THIS business — not a recycled Wix/Elementor starter. Prefer restraint, hierarchy, and real copy over gimmicks. Output ONLY the required file blocks — no markdown fences, no commentary.",
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
    .slice(0, 24)
    .join("\n");
  const mediaLines =
    (profile as { mediaUrls?: string[] }).mediaUrls
      ?.slice(0, 12)
      .map((u, i) => `${i + 1}. ${u}`)
      .join("\n") ||
    `(no URLs — use https://picsum.photos/seed/${niche.id}-{n}/1400/900 with niche-matching seeds)`;

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

  return `Build a complete multi-page static website from the business data below.

=== BUSINESS DATA (source of truth — do not invent facts) ===
Name: ${brand}
Username: ${profile.username || "(unknown)"}
Bio: ${bio}
Detected niche: ${niche.id} — ${niche.label}
Mood / palette / type / imagery direction:
${nicheBrief}
Captions (services, offers, location, tone):
${captions || "(none)"}
Image URLs (prefer these in <img src>; else niche-matched picsum seeds):
${mediaLines}
WhatsApp digits (if any): ${wa}

=== HARD RULES ===
1. Output ONLY the file blocks defined at the end. No markdown, no commentary.
2. Exactly these pages (complete HTML5 documents each):
   - index.html (Home)
   - about.html
   - services.html
   - gallery.html
   - contact.html
3. Shared design system in styles.css only (do not put large <style> blocks in HTML).
4. Shared script.js for: mobile-only hamburger nav toggle, smooth scroll, contact form → WhatsApp.
   Desktop = horizontal links only (hide .nav-toggle). Mobile = hamburger opens dropdown.
5. IDENTICAL header + footer on every page:
   - Logo/brand link id="site-title" → index.html
   - Nav links (relative): index.html, about.html, services.html, gallery.html, contact.html
   - Footer: brand, one short line from bio, same nav, WhatsApp/contact if available
6. Every CTA/control: use <a class="btn"> or <button> with data-goke="button".
7. Editor hooks: id="hero-headline", id="hero-subheadline", id="cta-button" on Home hero;
   class="site-section" data-section-name="..." on major sections;
   data-goke="heading|text|image|link|button" on key nodes.
8. Put data-wa="${waNumber || ""}" on every <body>.
9. NO lorem ipsum. Never invent awards, metrics, or press. Only claims supported by captions/bio.
10. Mobile-first CSS; readable type; hero MUST include a real image — never an empty white hero.


=== NAVIGATION (mandatory pattern — every page) ===
Use this structure in the header on EVERY page (same links, same order):

<header class="site-header" data-goke="container">
  <div class="nav-bar">
    <a href="index.html" class="brand" id="site-title" data-goke="link">BRAND</a>
    <button type="button" class="nav-toggle" data-goke="button" aria-label="Open menu" aria-expanded="false" aria-controls="site-nav">
      <span class="nav-toggle-bar"></span>
      <span class="nav-toggle-bar"></span>
      <span class="nav-toggle-bar"></span>
    </button>
    <nav id="site-nav" class="site-nav" data-goke="nav" hidden>
      <ul class="nav-list">
        <li><a href="index.html" data-goke="link">Home</a></li>
        <li><a href="about.html" data-goke="link">About</a></li>
        <li><a href="services.html" data-goke="link">Services</a></li>
        <li><a href="gallery.html" data-goke="link">Gallery</a></li>
        <li><a href="contact.html" data-goke="link">Contact</a></li>
      </ul>
    </nav>
  </div>
</header>

CSS requirements:
- Desktop (min-width: 768px): .nav-toggle { display: none !important; }
  .site-nav { display: block !important; position: static; background: transparent; }
  .nav-list { display: flex; flex-direction: row; gap: 1.25rem; list-style: none; }
  Horizontal links only — NO hamburger on desktop.
- Mobile (max-width: 767px): .nav-toggle { display: inline-flex; }
  .site-nav[hidden] { display: none !important; }
  .site-nav:not([hidden]) { display: block; position absolute/full-width dropdown under header; }
  Stacked links in the dropdown.

script.js MUST:
- Toggle #site-nav hidden attribute when .nav-toggle is clicked
- Set aria-expanded true/false
- Close menu when a nav link is clicked (mobile)
- Do NOT show the toggle on desktop (CSS handles visibility)

=== QUALITY BAR (Elementor-grade, not Elementor-clone) ===
- Distinct layout for this niche (spa ≠ auto dealer ≠ law firm ≠ shop).
- Clear hierarchy: Google Fonts pair in each <head> matching the niche typography direction.
- CSS variables on :root: --primary, --primary-hover, --bg, --surface, --text, --muted, --border, --radius, --shadow.
- Alternating section surfaces; section padding ~4–6rem on desktop.
- Buttons: solid primary + outline secondary; :hover states in CSS.
- Cards with subtle shadow/border; gallery as responsive CSS grid.
- Contact page: form#contact-form with name, email, message + submit data-goke="button".
  In script.js: preventDefault on submit → open https://wa.me/NUMBER?text=encodeURIComponent(...) when data-wa is set; otherwise alert that WhatsApp is not configured.
- Trust without lies: location, services, and tone from captions only.

=== PAGE INTENT ===
HOME: Hero (image + H1 + sub + dual CTAs) → optional trust strip → 3 service pillars from captions → about teaser → gallery teaser → final CTA.
ABOUT: Story from bio/captions → values/method → soft CTA to contact.
SERVICES: Outcome-led service cards inferred from captions → simple process steps → CTA.
GALLERY: Image grid (real URLs or niche seeds) with meaningful alt text.
CONTACT: Short pitch → form#contact-form → contact/WhatsApp details.

Link stylesheet as <link rel="stylesheet" href="styles.css">.
Link script as <script src="script.js" defer></script> before </body>.

=== OUTPUT FORMAT (strict) ===
===PAGE:index.html===
<!DOCTYPE html>
...full document...
===PAGE:about.html===
<!DOCTYPE html>
...full document...
===PAGE:services.html===
<!DOCTYPE html>
...full document...
===PAGE:gallery.html===
<!DOCTYPE html>
...full document...
===PAGE:contact.html===
<!DOCTYPE html>
...full document...
===CSS===
...full styles.css...
===JS===
...full script.js (nav toggle + WhatsApp form handler)...`;
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
  files["script.js"] = ensureNavScript(
    ensureWhatsAppScript(files["script.js"] || "", waNumber)
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


function ensureNavScript(js: string): string {
  if (js.includes("nav-toggle") && js.includes("site-nav")) return js;
  const handler = `
/* goke: mobile nav — hamburger only (CSS hides toggle on desktop) */
(function () {
  function bindNav() {
    var toggle = document.querySelector(".nav-toggle, .navbar-toggler, .menu-toggle");
    var nav = document.querySelector("#site-nav, .site-nav, nav[data-goke='nav']");
    if (!toggle || !nav) return;
    if (toggle.__gokeNav) return;
    toggle.__gokeNav = true;
    toggle.addEventListener("click", function () {
      var open = nav.hasAttribute("hidden");
      if (open) {
        nav.removeAttribute("hidden");
        toggle.setAttribute("aria-expanded", "true");
      } else {
        nav.setAttribute("hidden", "");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        if (window.matchMedia("(max-width: 767px)").matches) {
          nav.setAttribute("hidden", "");
          toggle.setAttribute("aria-expanded", "false");
        }
      });
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", bindNav);
  else bindNav();
})();
`;
  return js.trim() + "\n" + handler;
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
