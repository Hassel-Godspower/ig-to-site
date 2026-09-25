/**
 * Sync Instagram / current-page content into a starter template
 * instead of wiping the generated site.
 *
 * Strategy:
 * 1. extractSiteContent(currentDoc) — title, hero, CTA, section text, images
 * 2. load starter HTML
 * 3. mergeContentIntoHtml(starterHtml, content) — fill #site-title, #hero-*,
 *    #cta-button, then fill remaining imgs / text by order
 */

export type ExtractedSiteContent = {
  title: string;
  headline: string;
  subheadline: string;
  ctaText: string;
  ctaHref: string;
  /** data-section-name → plain text snapshot (first meaningful block) */
  sectionTexts: Record<string, string>;
  /** All image URLs found in the page (gallery order) */
  images: string[];
  /** Optional accent from --primary-color / --goke-primary */
  primaryColor?: string;
};

const SKIP_IMG =
  /data:|placeholder|1x1|pixel|spacer|blank|logo\.svg|icon/i;

export function extractSiteContent(doc: Document): ExtractedSiteContent {
  const text = (sel: string) =>
    doc.querySelector(sel)?.textContent?.trim() ?? "";

  const title =
    text("#site-title") ||
    text("header .navbar-brand") ||
    text("header a") ||
    text("h1") ||
    doc.title ||
    "";

  const headline =
    text("#hero-headline") ||
    text("section h1") ||
    text(".hero h1") ||
    text("h1") ||
    "";

  const subheadline =
    text("#hero-subheadline") ||
    text("#hero-headline + p") ||
    text(".hero p") ||
    text("section p") ||
    "";

  const ctaEl =
    (doc.querySelector("#cta-button") as HTMLAnchorElement | null) ||
    (doc.querySelector("a.cta-button") as HTMLAnchorElement | null) ||
    (doc.querySelector(".hero a.btn, .hero a.button, section a.btn") as HTMLAnchorElement | null);

  const ctaText = ctaEl?.textContent?.trim() ?? "";
  const ctaHref = ctaEl?.getAttribute("href") ?? "#contact";

  const sectionTexts: Record<string, string> = {};
  doc.querySelectorAll("section.site-section[data-section-name]").forEach((sec) => {
    const name = sec.getAttribute("data-section-name") || "";
    if (!name) return;
    const p =
      sec.querySelector("p")?.textContent?.trim() ||
      sec.textContent?.trim().slice(0, 280) ||
      "";
    if (p) sectionTexts[name.toLowerCase()] = p;
  });

  const images: string[] = [];
  doc.querySelectorAll("img[src]").forEach((img) => {
    const src = img.getAttribute("src") || "";
    if (!src || SKIP_IMG.test(src)) return;
    if (!images.includes(src)) images.push(src);
  });

  const cs = doc.defaultView?.getComputedStyle(doc.documentElement);
  const primaryColor =
    cs?.getPropertyValue("--primary-color")?.trim() ||
    cs?.getPropertyValue("--goke-primary")?.trim() ||
    undefined;

  return {
    title,
    headline,
    subheadline,
    ctaText,
    ctaHref,
    sectionTexts,
    images,
    primaryColor,
  };
}

/**
 * Parse HTML string in an isolated document, apply content, return full HTML.
 */
export function mergeContentIntoHtml(
  templateHtml: string,
  content: ExtractedSiteContent
): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(templateHtml, "text/html");

  setText(doc, "#site-title", content.title);
  setText(doc, "#hero-headline", content.headline);
  setText(doc, "#hero-subheadline", content.subheadline);

  // Fallbacks if template lacks our markers
  if (content.title) {
    const brand = doc.querySelector(
      "header .navbar-brand, .navbar-brand, header a.logo, a.logo"
    );
    if (brand && !doc.querySelector("#site-title")) {
      brand.textContent = content.title;
    }
    if (doc.title && content.title) doc.title = content.title;
  }
  if (content.headline) {
    const h1 = doc.querySelector("#hero-headline") || doc.querySelector("h1");
    if (h1 && !h1.id) h1.textContent = content.headline;
  }
  if (content.subheadline) {
    const sub =
      doc.querySelector("#hero-subheadline") ||
      doc.querySelector("h1 + p") ||
      doc.querySelector(".hero p, .flex-caption p, section p");
    if (sub && sub.id !== "hero-headline") sub.textContent = content.subheadline;
  }

  const cta =
    (doc.querySelector("#cta-button") as HTMLAnchorElement | null) ||
    (doc.querySelector("a.cta-button") as HTMLAnchorElement | null) ||
    (doc.querySelector(
      ".hero a.btn, .flex-caption a, a.btn-primary, a.button"
    ) as HTMLAnchorElement | null);
  if (cta) {
    if (content.ctaText) cta.textContent = content.ctaText;
    if (content.ctaHref) cta.setAttribute("href", content.ctaHref);
  }

  // Map section body text when names loosely match
  doc.querySelectorAll("section[data-section-name]").forEach((sec) => {
    const name = (sec.getAttribute("data-section-name") || "").toLowerCase();
    const match = Object.entries(content.sectionTexts).find(
      ([k]) => name.includes(k) || k.includes(name)
    );
    if (!match) return;
    const p = sec.querySelector("p");
    if (p) p.textContent = match[1];
  });

  // Paint images in order onto template <img>s (skip tiny icons)
  const imgs = Array.from(doc.querySelectorAll("img[src]")).filter((img) => {
    const src = img.getAttribute("src") || "";
    return src && !SKIP_IMG.test(src);
  });
  content.images.forEach((src, i) => {
    if (imgs[i]) imgs[i].setAttribute("src", src);
  });

  // Brand color into :root if present
  if (content.primaryColor) {
    const root = doc.documentElement;
    root.style.setProperty("--primary-color", content.primaryColor);
    root.style.setProperty("--goke-primary", content.primaryColor);
    // Also try to patch a :root rule in a style tag
    doc.querySelectorAll("style").forEach((style) => {
      if (style.textContent && style.textContent.includes("--primary-color")) {
        style.textContent = style.textContent.replace(
          /--primary-color\s*:\s*[^;]+;/,
          `--primary-color: ${content.primaryColor};`
        );
      }
    });
  }

  // Ensure structural markers exist for continued editing
  ensureMarker(doc, "site-title", content.title);
  ensureMarker(doc, "hero-headline", content.headline);
  ensureMarker(doc, "hero-subheadline", content.subheadline);

  return "<!DOCTYPE html>\n" + doc.documentElement.outerHTML;
}

function setText(doc: Document, selector: string, value: string) {
  if (!value) return;
  const el = doc.querySelector(selector);
  if (el) el.textContent = value;
}

function ensureMarker(doc: Document, id: string, value: string) {
  if (!value || doc.getElementById(id)) return;
  // Non-destructive: only add id to a likely element if missing
  if (id === "hero-headline") {
    const h1 = doc.querySelector("h1");
    if (h1 && !h1.id) h1.id = id;
  }
  if (id === "site-title") {
    const brand = doc.querySelector(".navbar-brand, header a");
    if (brand && !brand.id) brand.id = id;
  }
}

/** High-level: extract from live canvas doc + merge into template HTML string */
export function mergeCurrentDocIntoTemplate(
  currentDoc: Document,
  templateHtml: string
): string {
  const content = extractSiteContent(currentDoc);
  return mergeContentIntoHtml(templateHtml, content);
}
