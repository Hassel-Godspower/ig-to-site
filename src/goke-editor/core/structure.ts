/**
 * Structure engine — Section → Container → Widget rules
 * Mirrors Elementor's nesting model for the live builder.
 */

export type StructureKind = "section" | "container" | "widget" | "root" | "unknown";

const SECTION_SELECTORS = [
  "section",
  "[data-goke='section']",
  "[data-goke='hero']",
  "[data-goke='cta']",
  ".site-section",
];

const CONTAINER_SELECTORS = [
  "[data-goke='container']",
  "[data-goke='columns']",
  ".container",
  "[data-goke-empty]",
];

/** Infer structural kind from a DOM element */
export function getKind(el: HTMLElement | null): StructureKind {
  if (!el) return "unknown";
  if (el === el.ownerDocument?.body) return "root";

  const goke = el.getAttribute("data-goke");
  if (goke === "section" || goke === "hero" || goke === "cta") return "section";
  if (goke === "container" || goke === "columns") return "container";
  if (el.classList.contains("site-section") || el.tagName === "SECTION")
    return "section";
  if (el.hasAttribute("data-goke-empty")) return "container";
  if (el.classList.contains("container")) return "container";

  // Widgets: headings, text, buttons, images, etc.
  const widgetTags = ["H1", "H2", "H3", "H4", "H5", "H6", "P", "IMG", "A", "BUTTON", "UL", "OL", "BLOCKQUOTE", "FORM", "VIDEO", "IFRAME"];
  if (widgetTags.includes(el.tagName)) return "widget";
  if (el.hasAttribute("data-goke") && goke !== "section" && goke !== "container")
    return "widget";

  return "unknown";
}

/** What kinds can be dropped into a given parent kind */
const ALLOWS: Record<StructureKind, StructureKind[]> = {
  root: ["section"],
  section: ["container", "widget"],
  container: ["container", "widget"],
  widget: [],
  unknown: ["section", "container", "widget"],
};

export function canDrop(parent: HTMLElement, componentType: string): boolean {
  const parentKind = getKind(parent);
  const childKind = kindFromComponentType(componentType);
  return ALLOWS[parentKind]?.includes(childKind) ?? true;
}

/** Resolve best drop target when user drops on an arbitrary node */
export function resolveDropTarget(
  target: HTMLElement,
  componentType: string
): { parent: HTMLElement; position: "inside" | "before" | "after" } {
  const childKind = kindFromComponentType(componentType);
  let el: HTMLElement | null = target;
  const body = target.ownerDocument?.body;

  while (el && el !== body) {
    const kind = getKind(el);
    if (ALLOWS[kind]?.includes(childKind)) {
      return { parent: el, position: "inside" };
    }
    // Try sibling placement after a widget when dropping a section
    if (childKind === "section" && kind === "section") {
      return { parent: el, position: "after" };
    }
    el = el.parentElement;
  }

  return { parent: body!, position: "inside" };
}

export function kindFromComponentType(type: string): StructureKind {
  if (
    type.startsWith("layout/section") ||
    type.includes("hero") ||
    type.includes("cta") ||
    type.startsWith("business/") ||
    type.startsWith("site/section")
  ) {
    return "section";
  }
  if (
    type.startsWith("layout/container") ||
    type.startsWith("layout/columns")
  ) {
    return "container";
  }
  return "widget";
}

/** Human label for navigator */
export function labelForElement(el: HTMLElement): string {
  const sectionName = el.getAttribute("data-section-name");
  if (sectionName) return sectionName;

  const goke = el.getAttribute("data-goke");
  if (goke && !["container", "columns", "text"].includes(goke)) {
    return goke.charAt(0).toUpperCase() + goke.slice(1);
  }

  const idMap: Record<string, string> = {
    "site-title": "Site title",
    "hero-headline": "Headline",
    "hero-subheadline": "Subheadline",
    "cta-button": "CTA button",
  };
  if (el.id && idMap[el.id]) return idMap[el.id];
  if (el.id) {
    const pretty = el.id
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    if (pretty.length < 40) return pretty;
  }

  const cls = typeof el.className === "string" ? el.className : "";
  const classHints = [
    "hero", "about", "services", "gallery", "contact", "footer",
    "header", "nav", "navbar", "pricing", "testimonial", "cta",
  ];
  for (const hint of classHints) {
    if (cls.toLowerCase().split(/\s+/).some((c) => c === hint || c.includes(hint))) {
      return hint.charAt(0).toUpperCase() + hint.slice(1);
    }
  }

  const tag = el.tagName.toLowerCase();
  const tagLabels: Record<string, string> = {
    header: "Header",
    footer: "Footer",
    nav: "Navigation",
    main: "Main",
    section: "Section",
    article: "Article",
    aside: "Aside",
    img: "Image",
    video: "Video",
    form: "Form",
    ul: "List",
    ol: "List",
    li: "List item",
    button: "Button",
    a: "Link",
    div: "Block",
    span: "Text",
  };

  const textTags = ["h1", "h2", "h3", "h4", "h5", "h6", "p", "a", "button", "label", "li"];
  if (textTags.includes(tag)) {
    let text = "";
    for (const node of Array.from(el.childNodes)) {
      if (node.nodeType === 3) text += node.textContent || "";
    }
    if (!text.trim()) text = (el.textContent || "").trim();
    text = text.replace(/\s+/g, " ").trim().slice(0, 28);
    const level =
      tag.startsWith("h") && tag.length === 2
        ? `Heading ${tag[1]}`
        : tagLabels[tag] || tag.toUpperCase();
    if (text) return `${level}: ${text}${text.length >= 28 ? "…" : ""}`;
    return level;
  }

  if (tagLabels[tag]) return tagLabels[tag];
  return tag.toUpperCase();
}

/** Icon key for navigator row */
export function iconForElement(el: HTMLElement): string {
  const tag = el.tagName.toLowerCase();
  const goke = el.getAttribute("data-goke") || "";
  if (tag === "header" || goke === "header") return "▣";
  if (tag === "section" || goke === "section" || goke === "hero") return "▭";
  if (tag === "footer") return "▬";
  if (tag === "nav") return "☰";
  if (tag === "img") return "▣";
  if (tag === "a" || tag === "button" || goke === "button") return "▶";
  if (tag.startsWith("h") && tag.length === 2) return "T";
  if (tag === "p") return "¶";
  if (tag === "ul" || tag === "ol") return "≡";
  if (getKind(el) === "container") return "▦";
  return "◇";
}

export function matchesSection(el: HTMLElement): boolean {
  return SECTION_SELECTORS.some((sel) => {
    try {
      return el.matches(sel);
    } catch {
      return false;
    }
  });
}

export function matchesContainer(el: HTMLElement): boolean {
  return CONTAINER_SELECTORS.some((sel) => {
    try {
      return el.matches(sel);
    } catch {
      return false;
    }
  });
}
