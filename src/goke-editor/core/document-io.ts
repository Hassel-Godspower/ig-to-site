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

/** Apply design tokens as CSS variables on :root inside the iframe */
export function applyTokensToDocument(
  doc: Document,
  tokens: DesignTokens
): void {
  const root = doc.documentElement;
  root.style.setProperty("--goke-primary", tokens.colors.primary);
  root.style.setProperty("--goke-secondary", tokens.colors.secondary);
  root.style.setProperty("--goke-text", tokens.colors.text);
  root.style.setProperty("--goke-muted", tokens.colors.muted);
  root.style.setProperty("--goke-bg", tokens.colors.background);
  root.style.setProperty("--goke-font-heading", tokens.fonts.heading);
  root.style.setProperty("--goke-font-body", tokens.fonts.body);

  // Also keep legacy primary used by generateSite
  root.style.setProperty("--primary-color", tokens.colors.primary);

  let tag = doc.getElementById(TOKENS_STYLE_ID) as HTMLStyleElement | null;
  if (!tag) {
    tag = doc.createElement("style");
    tag.id = TOKENS_STYLE_ID;
    doc.head?.appendChild(tag);
  }
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
