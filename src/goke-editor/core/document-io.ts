/**
 * Tier 3 — Document I/O
 * editor.json is the edit-time source of truth; HTML remains the publish artifact.
 */

import type {
  DesignTokens,
  GokeDocument,
  GokeNode,
  NodeKind,
  ResponsiveStyles,
  CSSProps,
} from "../types/document";
import { DEFAULT_TOKENS as TOKENS_FALLBACK } from "../types/document";
import { getKind } from "./structure";
import { STYLE_ATTR, HOVER_ATTR } from "./responsive-export";
import { ensureGoogleFontsInDocument } from "../data/google-fonts";

const TOKENS_STYLE_ID = "goke-design-tokens";

export function emptyDocument(jobId?: string): GokeDocument {
  return {
    version: 1,
    tokens: { ...TOKENS_FALLBACK, colors: { ...TOKENS_FALLBACK.colors }, fonts: { ...TOKENS_FALLBACK.fonts } },
    tree: [],
    meta: { jobId },
  };
}

/**
 * Apply design tokens as CSS variables on :root inside the iframe.
 *
 * Generated premium shells use --text / --ink / --muted (and body rules in styles.css).
 * Forcing body { color: DEFAULT dark-on-white } caused FOUC: light text from the site,
 * then dark text after the editor attached — independent of the real background.
 *
 * When a designed site is detected, we only bridge --goke-* for widgets and do NOT
 * override body color/background.
 */
export function applyTokensToDocument(
  doc: Document,
  tokens: DesignTokens
): void {
  const root = doc.documentElement;
  const cs =
    typeof doc.defaultView?.getComputedStyle === "function"
      ? doc.defaultView.getComputedStyle(root)
      : null;

  const siteText =
    (cs?.getPropertyValue("--text") || "").trim() ||
    (cs?.getPropertyValue("--goke-text") || "").trim();
  const siteMuted =
    (cs?.getPropertyValue("--muted") || "").trim() ||
    (cs?.getPropertyValue("--goke-muted") || "").trim();
  const siteBg =
    (cs?.getPropertyValue("--ink") || "").trim() ||
    (cs?.getPropertyValue("--goke-bg") || "").trim() ||
    (cs?.getPropertyValue("--bg") || "").trim();
  const siteAccent =
    (cs?.getPropertyValue("--accent") || "").trim() ||
    (cs?.getPropertyValue("--goke-primary") || "").trim();

  const hasDesignedTheme = !!(
    siteText ||
    doc.querySelector('link[href*="styles.css"]') ||
    doc.querySelector("style#goke-shell-theme") ||
    doc.body?.getAttribute("data-goke-cart-mode") ||
    doc.querySelector("[data-section-name]")
  );

  const primary = siteAccent || tokens.colors.primary;
  const text = hasDesignedTheme && siteText ? siteText : tokens.colors.text;
  const muted = hasDesignedTheme && siteMuted ? siteMuted : tokens.colors.muted;
  const background =
    hasDesignedTheme && siteBg ? siteBg : tokens.colors.background;

  root.style.setProperty("--goke-primary", primary);
  root.style.setProperty("--goke-secondary", tokens.colors.secondary);
  root.style.setProperty("--goke-text", text);
  root.style.setProperty("--goke-muted", muted);
  root.style.setProperty("--goke-bg", background);
  root.style.setProperty("--goke-font-heading", tokens.fonts.heading);
  root.style.setProperty("--goke-font-body", tokens.fonts.body);
  root.style.setProperty("--primary-color", primary);

  // Keep shell vars in sync so kits using either naming stay consistent
  if (hasDesignedTheme) {
    if (siteText) root.style.setProperty("--text", siteText);
    if (siteMuted) root.style.setProperty("--muted", siteMuted);
    if (siteBg) root.style.setProperty("--ink", siteBg);
    if (siteAccent) root.style.setProperty("--accent", siteAccent);
  }

  let tag = doc.getElementById(TOKENS_STYLE_ID) as HTMLStyleElement | null;
  if (!tag) {
    tag = doc.createElement("style");
    tag.id = TOKENS_STYLE_ID;
    doc.head?.appendChild(tag);
  }

  if (hasDesignedTheme) {
    // Bridge only — never paint body over the generated theme (stops white→dark text flash)
    tag.textContent = `:root {
  --goke-primary: ${primary};
  --goke-secondary: ${tokens.colors.secondary};
  --goke-text: ${text};
  --goke-muted: ${muted};
  --goke-bg: ${background};
  --goke-font-heading: ${tokens.fonts.heading};
  --goke-font-body: ${tokens.fonts.body};
  --primary-color: ${primary};
}
/* Designed site: do not override body color/background — styles.css owns the look */`;
  } else {
    tag.textContent = `:root {
  --goke-primary: ${tokens.colors.primary};
  --goke-secondary: ${tokens.colors.secondary};
  --goke-text: ${tokens.colors.text};
  --goke-muted: ${tokens.colors.muted};
  --goke-bg: ${tokens.colors.background};
  --goke-font-heading: ${tokens.fonts.heading};
  --goke-font-body: ${tokens.fonts.body};
  --primary-color: ${tokens.colors.primary};
}
body { font-family: var(--goke-font-body); color: var(--goke-text); background: var(--goke-bg); }
h1, h2, h3, h4, h5, h6 { font-family: var(--goke-font-heading); }`;
  }

  ensureGoogleFontsInDocument(doc, [tokens.fonts.heading, tokens.fonts.body]);
}

/** Read tokens currently applied (or defaults) */
export function readTokensFromDocument(doc: Document): DesignTokens {
  const cs = doc.defaultView?.getComputedStyle(doc.documentElement);
  const get = (name: string, fallback: string) =>
    cs?.getPropertyValue(name).trim() || fallback;
  const d = TOKENS_FALLBACK;
  return {
    colors: {
      primary: get("--goke-primary", d.colors.primary),
      secondary: get("--goke-secondary", d.colors.secondary),
      text: get("--goke-text", d.colors.text),
      muted: get("--goke-muted", d.colors.muted),
      background: get("--goke-bg", d.colors.background),
    },
    fonts: {
      heading: get("--goke-font-heading", d.fonts.heading),
      body: get("--goke-font-body", d.fonts.body),
    },
  };
}

function parseStyles(el: HTMLElement): ResponsiveStyles {
  try {
    const raw = el.getAttribute(STYLE_ATTR);
    if (raw) return JSON.parse(raw) as ResponsiveStyles;
  } catch {
    /* ignore */
  }
  return {};
}

function parseHover(el: HTMLElement): CSSProps | undefined {
  try {
    const raw = el.getAttribute(HOVER_ATTR);
    if (raw) return JSON.parse(raw) as CSSProps;
  } catch {
    /* ignore */
  }
  return undefined;
}

function kindToNodeKind(el: HTMLElement): NodeKind {
  const k = getKind(el);
  if (k === "section") return "section";
  if (k === "container") return "container";
  return "widget";
}

/** Snapshot live DOM body into a lightweight GokeDocument tree */
export function documentFromDom(
  doc: Document,
  jobId?: string
): GokeDocument {
  const tokens = readTokensFromDocument(doc);
  const walk = (parent: HTMLElement): GokeNode[] => {
    const nodes: GokeNode[] = [];
    for (const child of Array.from(parent.children) as HTMLElement[]) {
      if (
        child.tagName === "SCRIPT" ||
        child.tagName === "STYLE" ||
        child.getAttribute("data-goke-ui")
      ) {
        continue;
      }
      const id =
        child.getAttribute("data-goke-id") ||
        child.id ||
        `n_${Math.random().toString(36).slice(2, 8)}`;
      if (!child.getAttribute("data-goke-id")) {
        child.setAttribute("data-goke-id", id);
      }
      const hover = parseHover(child);
      const node: GokeNode = {
        id,
        type: child.getAttribute("data-goke") || child.tagName.toLowerCase(),
        kind: kindToNodeKind(child),
        props: {
          tag: child.tagName.toLowerCase(),
          text: child.children.length === 0 ? child.textContent : undefined,
          href: child.getAttribute("href") || undefined,
          src: child.getAttribute("src") || undefined,
          className: child.className || undefined,
          hover,
        },
        styles: parseStyles(child),
        children: walk(child),
      };
      nodes.push(node);
    }
    return nodes;
  };

  return {
    version: 1,
    tokens,
    tree: doc.body ? walk(doc.body) : [],
    meta: {
      title: doc.title,
      jobId,
    },
  };
}

export function serializeDocument(doc: GokeDocument): string {
  return JSON.stringify(doc, null, 2);
}

export function parseDocument(raw: string): GokeDocument | null {
  try {
    const data = JSON.parse(raw) as GokeDocument;
    if (data?.version !== 1) return null;
    return data;
  } catch {
    return null;
  }
}

/** Build a template fragment from a selected element's outerHTML + styles */
export type SectionTemplate = {
  id: string;
  name: string;
  html: string;
  createdAt: string;
  category?: string;
};

export function captureSectionTemplate(
  el: HTMLElement,
  name: string
): SectionTemplate {
  return {
    id: `tpl_${Math.random().toString(36).slice(2, 10)}`,
    name: name || "Untitled section",
    html: el.outerHTML,
    createdAt: new Date().toISOString(),
    category: "saved",
  };
}
