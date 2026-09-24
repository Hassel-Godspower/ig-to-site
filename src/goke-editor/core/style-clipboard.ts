/**
 * Copy / paste styles between elements (Elementor-style)
 */

import { STYLE_ATTR, HOVER_ATTR } from "./responsive-export";
import type { CSSProps, ResponsiveStyles } from "../types/document";
import { styleManager } from "./style-manager";

export type StyleClipboardPayload = {
  styles: ResponsiveStyles;
  hover: CSSProps;
  /** Direct inline styles snapshot for immediate visual paste */
  inline: CSSProps;
};

const INTERESTING = [
  "color",
  "background-color",
  "background-image",
  "font-size",
  "font-weight",
  "line-height",
  "letter-spacing",
  "text-align",
  "margin",
  "margin-top",
  "margin-right",
  "margin-bottom",
  "margin-left",
  "padding",
  "padding-top",
  "padding-right",
  "padding-bottom",
  "padding-left",
  "border-radius",
  "border-width",
  "border-style",
  "border-color",
  "box-shadow",
  "opacity",
  "display",
  "width",
  "max-width",
  "gap",
  "justify-content",
  "align-items",
  "flex-direction",
  "flex-wrap",
  "transform",
];

let clipboard: StyleClipboardPayload | null = null;

function readInline(el: HTMLElement): CSSProps {
  const out: CSSProps = {};
  for (const prop of INTERESTING) {
    const v = styleManager.getStyle(el, prop, true);
    if (v) out[prop] = v;
  }
  return out;
}

export function copyStyles(el: HTMLElement): StyleClipboardPayload {
  let styles: ResponsiveStyles = {};
  try {
    const raw = el.getAttribute(STYLE_ATTR);
    if (raw) styles = JSON.parse(raw);
  } catch {
    /* ignore */
  }
  let hover: CSSProps = {};
  try {
    const raw = el.getAttribute(HOVER_ATTR);
    if (raw) hover = JSON.parse(raw);
  } catch {
    /* ignore */
  }
  const inline = readInline(el);
  // If no structured store, put inline into desktop
  if (!styles.desktop || Object.keys(styles.desktop).length === 0) {
    styles = { ...styles, desktop: { ...inline } };
  }
  clipboard = { styles, hover, inline };
  return clipboard;
}

export function pasteStyles(el: HTMLElement): boolean {
  if (!clipboard) return false;

  el.setAttribute(STYLE_ATTR, JSON.stringify(clipboard.styles));
  if (clipboard.hover && Object.keys(clipboard.hover).length) {
    el.setAttribute(HOVER_ATTR, JSON.stringify(clipboard.hover));
  }

  // Apply desktop/inline immediately for visual feedback
  const apply = clipboard.styles.desktop || clipboard.inline;
  for (const [prop, val] of Object.entries(apply)) {
    styleManager.setStyle(el, prop, val);
  }
  return true;
}

export function hasStyleClipboard(): boolean {
  return clipboard != null;
}

export function getStyleClipboard(): StyleClipboardPayload | null {
  return clipboard;
}
