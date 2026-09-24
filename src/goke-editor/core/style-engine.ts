/**
 * Style engine — responsive property map + grouped controls
 * Includes per-side spacing and hover state.
 */

import { styleManager } from "./style-manager";
import type { Breakpoint, CSSProps, ResponsiveStyles } from "../types/document";
import { STYLE_ATTR, HOVER_ATTR } from "./responsive-export";

export type StyleGroupId =
  | "layout"
  | "spacing"
  | "typography"
  | "background"
  | "border"
  | "hover";

export type StyleControl = {
  key: string;
  cssProperty: string;
  label: string;
  inputType: "text" | "color" | "css-unit" | "select" | "spacing-box";
  options?: { value: string; label: string }[];
  units?: string[];
  hover?: boolean;
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
        key: "flexDirection",
        cssProperty: "flex-direction",
        label: "Direction",
        inputType: "select",
        options: [
          { value: "row", label: "Row" },
          { value: "column", label: "Column" },
          { value: "row-reverse", label: "Row reverse" },
          { value: "column-reverse", label: "Column reverse" },
        ],
      },
      {
        key: "flexWrap",
        cssProperty: "flex-wrap",
        label: "Wrap",
        inputType: "select",
        options: [
          { value: "nowrap", label: "No wrap" },
          { value: "wrap", label: "Wrap" },
        ],
      },
      {
        key: "width",
        cssProperty: "width",
        label: "Width",
        inputType: "css-unit",
        units: ["px", "%", "rem", "vw", "auto"],
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
          { value: "space-around", label: "Space around" },
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
        key: "marginBox",
        cssProperty: "margin",
        label: "Margin",
        inputType: "spacing-box",
        units: ["px", "rem"],
      },
      {
        key: "paddingBox",
        cssProperty: "padding",
        label: "Padding",
        inputType: "spacing-box",
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
        key: "letterSpacing",
        cssProperty: "letter-spacing",
        label: "Letter spacing",
        inputType: "css-unit",
        units: ["px", "em"],
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
      {
        key: "backgroundImage",
        cssProperty: "background-image",
        label: "Image / gradient",
        inputType: "text",
      },
      {
        key: "opacity",
        cssProperty: "opacity",
        label: "Opacity",
        inputType: "text",
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
        key: "borderStyle",
        cssProperty: "border-style",
        label: "Style",
        inputType: "select",
        options: [
          { value: "none", label: "None" },
          { value: "solid", label: "Solid" },
          { value: "dashed", label: "Dashed" },
          { value: "dotted", label: "Dotted" },
        ],
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
  hover: {
    label: "Hover",
    controls: [
      {
        key: "hoverBg",
        cssProperty: "background-color",
        label: "Background",
        inputType: "color",
        hover: true,
      },
      {
        key: "hoverColor",
        cssProperty: "color",
        label: "Text color",
        inputType: "color",
        hover: true,
      },
      {
        key: "hoverOpacity",
        cssProperty: "opacity",
        label: "Opacity",
        inputType: "text",
        hover: true,
      },
      {
        key: "hoverTransform",
        cssProperty: "transform",
        label: "Transform",
        inputType: "text",
        hover: true,
      },
    ],
  },
};

function readStore(el: HTMLElement): ResponsiveStyles {
  try {
    const raw = el.getAttribute(STYLE_ATTR);
    if (raw) return JSON.parse(raw) as ResponsiveStyles;
  } catch {
    /* ignore */
  }
  return {};
}

function writeStore(el: HTMLElement, store: ResponsiveStyles): void {
  el.setAttribute(STYLE_ATTR, JSON.stringify(store));
}

function readHover(el: HTMLElement): CSSProps {
  try {
    const raw = el.getAttribute(HOVER_ATTR);
    if (raw) return JSON.parse(raw) as CSSProps;
  } catch {
    /* ignore */
  }
  return {};
}

function writeHover(el: HTMLElement, hover: CSSProps): void {
  if (Object.keys(hover).length === 0) el.removeAttribute(HOVER_ATTR);
  else el.setAttribute(HOVER_ATTR, JSON.stringify(hover));
}

function ensureId(el: HTMLElement): void {
  if (!el.getAttribute("data-goke-id") && !el.id) {
    el.setAttribute(
      "data-goke-id",
      `goke_${Math.random().toString(36).slice(2, 9)}`
    );
  }
}

export function getStyle(
  el: HTMLElement,
  cssProperty: string,
  breakpoint: Breakpoint = "desktop",
  hover = false
): string {
  if (hover) return readHover(el)[cssProperty] || "";
  const store = readStore(el);
  const fromStore = store[breakpoint]?.[cssProperty];
  if (fromStore) return fromStore;
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
  breakpoint: Breakpoint = "desktop",
  hover = false
): void {
  ensureId(el);
  if (hover) {
    const h = readHover(el);
    if (!value) delete h[cssProperty];
    else h[cssProperty] = value;
    writeHover(el, h);
    return;
  }
  const store = readStore(el);
  if (!store[breakpoint]) store[breakpoint] = {};
  const slice = store[breakpoint]!;
  if (!value) delete slice[cssProperty];
  else slice[cssProperty] = value;
  writeStore(el, store);
  styleManager.setStyle(el, cssProperty, value);
}

export function setSpacingBox(
  el: HTMLElement,
  prefix: "margin" | "padding",
  sides: { top?: string; right?: string; bottom?: string; left?: string },
  breakpoint: Breakpoint = "desktop"
): void {
  for (const side of ["top", "right", "bottom", "left"] as const) {
    setStyle(el, `${prefix}-${side}`, sides[side] ?? "", breakpoint);
  }
}

export function getSpacingBox(
  el: HTMLElement,
  prefix: "margin" | "padding",
  breakpoint: Breakpoint = "desktop"
): { top: string; right: string; bottom: string; left: string } {
  return {
    top: getStyle(el, `${prefix}-top`, breakpoint),
    right: getStyle(el, `${prefix}-right`, breakpoint),
    bottom: getStyle(el, `${prefix}-bottom`, breakpoint),
    left: getStyle(el, `${prefix}-left`, breakpoint),
  };
}

export function getAllStyles(
  el: HTMLElement,
  breakpoint: Breakpoint
): CSSProps {
  const result: CSSProps = {};
  for (const group of Object.values(STYLE_GROUPS)) {
    for (const control of group.controls) {
      if (control.inputType === "spacing-box") continue;
      const v = getStyle(el, control.cssProperty, breakpoint, !!control.hover);
      if (v) result[control.cssProperty] = v;
    }
  }
  return result;
}

export const styleEngine = {
  getStyle,
  setStyle,
  getAllStyles,
  setSpacingBox,
  getSpacingBox,
  STYLE_GROUPS,
};
export default styleEngine;
