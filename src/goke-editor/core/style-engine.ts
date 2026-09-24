/**
 * Style engine — responsive property map + grouped controls
 * Builds on style-manager for live iframe writes.
 */

import { styleManager } from "./style-manager";
import type { Breakpoint, CSSProps, ResponsiveStyles } from "../types/document";

export type StyleGroupId =
  | "layout"
  | "spacing"
  | "typography"
  | "background"
  | "border";

export type StyleControl = {
  key: string;
  cssProperty: string;
  label: string;
  inputType: "text" | "color" | "css-unit" | "select";
  options?: { value: string; label: string }[];
  units?: string[];
};

export const STYLE_GROUPS: Record<
  StyleGroupId,
  { label: string; controls: StyleControl[] }
> = {
  layout: {
    label: "Layout",
    controls: [
      {
        key: "display",
        cssProperty: "display",
        label: "Display",
        inputType: "select",
        options: [
          { value: "block", label: "Block" },
          { value: "flex", label: "Flex" },
          { value: "grid", label: "Grid" },
          { value: "inline-block", label: "Inline block" },
          { value: "none", label: "Hidden" },
        ],
      },
      {
        key: "width",
        cssProperty: "width",
        label: "Width",
        inputType: "css-unit",
        units: ["px", "%", "rem", "vw"],
      },
      {
        key: "maxWidth",
        cssProperty: "max-width",
        label: "Max width",
        inputType: "css-unit",
        units: ["px", "%", "rem"],
      },
      {
        key: "gap",
        cssProperty: "gap",
        label: "Gap",
        inputType: "css-unit",
        units: ["px", "rem"],
      },
      {
        key: "justifyContent",
        cssProperty: "justify-content",
        label: "Justify",
        inputType: "select",
        options: [
          { value: "flex-start", label: "Start" },
          { value: "center", label: "Center" },
          { value: "flex-end", label: "End" },
          { value: "space-between", label: "Space between" },
        ],
      },
      {
        key: "alignItems",
        cssProperty: "align-items",
        label: "Align",
        inputType: "select",
        options: [
          { value: "flex-start", label: "Start" },
          { value: "center", label: "Center" },
          { value: "flex-end", label: "End" },
          { value: "stretch", label: "Stretch" },
        ],
      },
    ],
  },
  spacing: {
    label: "Spacing",
    controls: [
      {
        key: "margin",
        cssProperty: "margin",
        label: "Margin",
        inputType: "css-unit",
        units: ["px", "rem"],
      },
      {
        key: "padding",
        cssProperty: "padding",
        label: "Padding",
        inputType: "css-unit",
        units: ["px", "rem"],
      },
    ],
  },
  typography: {
    label: "Typography",
    controls: [
      {
        key: "fontSize",
        cssProperty: "font-size",
        label: "Size",
        inputType: "css-unit",
        units: ["px", "rem", "em"],
      },
      {
        key: "fontWeight",
        cssProperty: "font-weight",
        label: "Weight",
        inputType: "select",
        options: [
          { value: "400", label: "Normal" },
          { value: "500", label: "Medium" },
          { value: "600", label: "Semi-bold" },
          { value: "700", label: "Bold" },
          { value: "800", label: "Extra-bold" },
        ],
      },
      {
        key: "lineHeight",
        cssProperty: "line-height",
        label: "Line height",
        inputType: "text",
      },
      {
        key: "textAlign",
        cssProperty: "text-align",
        label: "Align",
        inputType: "select",
        options: [
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
          { value: "right", label: "Right" },
        ],
      },
      {
        key: "color",
        cssProperty: "color",
        label: "Color",
        inputType: "color",
      },
    ],
  },
  background: {
    label: "Background",
    controls: [
      {
        key: "backgroundColor",
        cssProperty: "background-color",
        label: "Color",
        inputType: "color",
      },
    ],
  },
  border: {
    label: "Border",
    controls: [
      {
        key: "borderRadius",
        cssProperty: "border-radius",
        label: "Radius",
        inputType: "css-unit",
        units: ["px", "%"],
      },
      {
        key: "borderWidth",
        cssProperty: "border-width",
        label: "Width",
        inputType: "css-unit",
        units: ["px"],
      },
      {
        key: "borderColor",
        cssProperty: "border-color",
        label: "Color",
        inputType: "color",
      },
      {
        key: "boxShadow",
        cssProperty: "box-shadow",
        label: "Shadow",
        inputType: "text",
      },
    ],
  },
};

const BP_ATTR = "data-goke-styles";

function readStore(el: HTMLElement): ResponsiveStyles {
  try {
    const raw = el.getAttribute(BP_ATTR);
    if (raw) return JSON.parse(raw) as ResponsiveStyles;
  } catch {
    /* ignore */
  }
  return {};
}

function writeStore(el: HTMLElement, store: ResponsiveStyles): void {
  el.setAttribute(BP_ATTR, JSON.stringify(store));
}

export function getStyle(
  el: HTMLElement,
  cssProperty: string,
  breakpoint: Breakpoint = "desktop"
): string {
  const store = readStore(el);
  const fromStore = store[breakpoint]?.[cssProperty];
  if (fromStore) return fromStore;

  // Fall back to inline / computed for desktop
  if (breakpoint === "desktop") {
    return (
      styleManager.getStyle(el, cssProperty, true) ||
      styleManager.getStyle(el, cssProperty) ||
      ""
    );
  }
  return store.desktop?.[cssProperty] || "";
}

export function setStyle(
  el: HTMLElement,
  cssProperty: string,
  value: string,
  breakpoint: Breakpoint = "desktop"
): void {
  const store = readStore(el);
  if (!store[breakpoint]) store[breakpoint] = {};
  const slice = store[breakpoint]!;
  if (!value) delete slice[cssProperty];
  else slice[cssProperty] = value;
  writeStore(el, store);

  // Live preview: always apply current breakpoint to inline style
  // Full multi-breakpoint CSS is emitted at publish time later
  if (breakpoint === "desktop" || !store.desktop?.[cssProperty]) {
    styleManager.setStyle(el, cssProperty, value);
  } else if (breakpoint === "desktop") {
    styleManager.setStyle(el, cssProperty, value);
  } else {
    // For non-desktop while editing that breakpoint, apply temporarily
    styleManager.setStyle(el, cssProperty, value);
  }
}

export function getAllStyles(
  el: HTMLElement,
  breakpoint: Breakpoint
): CSSProps {
  const result: CSSProps = {};
  for (const group of Object.values(STYLE_GROUPS)) {
    for (const control of group.controls) {
      const v = getStyle(el, control.cssProperty, breakpoint);
      if (v) result[control.cssProperty] = v;
    }
  }
  return result;
}

export const styleEngine = { getStyle, setStyle, getAllStyles, STYLE_GROUPS };
export default styleEngine;
