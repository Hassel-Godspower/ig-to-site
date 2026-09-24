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
  const goke = el.getAttribute("data-goke");
  if (goke) return goke.charAt(0).toUpperCase() + goke.slice(1);

  const sectionName = el.getAttribute("data-section-name");
  if (sectionName) return sectionName;

  if (el.id === "site-title") return "Site title";
  if (el.id === "hero-headline") return "Headline";
  if (el.id === "hero-subheadline") return "Subheadline";
  if (el.id === "cta-button") return "CTA button";

  const tag = el.tagName.toLowerCase();
  const text = (el.textContent || "").trim().slice(0, 24);
  if (text && ["h1", "h2", "h3", "h4", "p", "a", "button"].includes(tag)) {
    return `${tag}: ${text}${text.length >= 24 ? "…" : ""}`;
  }
  if (tag === "img") return "Image";
  if (tag === "section") return "Section";
  return tag;
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
