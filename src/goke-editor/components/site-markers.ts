/**
 * Components that match the structural markers produced by lib/generateSite.ts
 * so generated sites are immediately editable in the Goke properties panel.
 */

import { registry } from "../core/registry";
import type { ComponentDefinition } from "../types";

const markers: ComponentDefinition[] = [
  {
    type: "site/title",
    name: "Site title",
    category: "Site",
    icon: "Aa",
    attributes: [],
    // matched by id in a custom way — we register via classes empty and use tags + we'll match by scanning
    // Actually registry matches attributes, classes, tags, regex.
    // For id-based matching we add a data attribute or use a special approach.
    // Simplest: match nothing automatically; preview can still select any element.
    // Better: add classesRegex won't help for id.
    // We'll extend registry later if needed. For now expose properties when user selects
    // an element that has id site-title — handled via a small match enhancement.
    html: `<span id="site-title">Site title</span>`,
    properties: [
      {
        name: "Text",
        key: "text",
        inputType: "text",
        onChange(node, value) {
          node.textContent = String(value);
          return node;
        },
      },
    ],
  },
  {
    type: "site/headline",
    name: "Hero headline",
    category: "Site",
    icon: "H",
    html: `<h1 id="hero-headline">Headline</h1>`,
    properties: [
      {
        name: "Text",
        key: "text",
        inputType: "text",
        onChange(node, value) {
          node.textContent = String(value);
          return node;
        },
      },
      {
        name: "Color",
        key: "color",
        cssProperty: "color",
        inputType: "color",
      },
      {
        name: "Font size",
        key: "fontSize",
        cssProperty: "font-size",
        inputType: "css-unit",
        units: ["px", "rem", "em"],
      },
    ],
  },
  {
    type: "site/subheadline",
    name: "Hero subheadline",
    category: "Site",
    icon: "T",
    html: `<p id="hero-subheadline">Subheadline</p>`,
    properties: [
      {
        name: "Text",
        key: "text",
        inputType: "textarea",
        onChange(node, value) {
          node.textContent = String(value);
          return node;
        },
      },
      {
        name: "Color",
        key: "color",
        cssProperty: "color",
        inputType: "color",
      },
    ],
  },
  {
    type: "site/cta",
    name: "CTA button",
    category: "Site",
    icon: "→",
    classes: ["cta-button"],
    html: `<a id="cta-button" class="cta-button" href="#contact">Get started</a>`,
    properties: [
      {
        name: "Label",
        key: "text",
        inputType: "text",
        onChange(node, value) {
          node.textContent = String(value);
          return node;
        },
      },
      {
        name: "Link",
        key: "href",
        htmlAttr: "href",
        inputType: "link",
      },
      {
        name: "Background",
        key: "background",
        cssProperty: "background-color",
        inputType: "color",
      },
      {
        name: "Text color",
        key: "color",
        cssProperty: "color",
        inputType: "color",
      },
    ],
  },
  {
    type: "site/section",
    name: "Section",
    category: "Site",
    icon: "▣",
    classes: ["site-section"],
    html: `<section class="site-section" data-section-name="Section"><div data-goke-empty>Drop content here</div></section>`,
    properties: [
      {
        name: "Section name",
        key: "sectionName",
        htmlAttr: "data-section-name",
        inputType: "text",
      },
      {
        name: "Background",
        key: "background",
        cssProperty: "background-color",
        inputType: "color",
      },
      {
        name: "Padding",
        key: "padding",
        cssProperty: "padding",
        inputType: "css-unit",
        units: ["px", "rem"],
      },
    ],
  },
];

registry.registerMany(markers);

/**
 * ID-based matcher used by the preview page when registry.matchNode
 * doesn't find a class/tag match. Maps element id → component type.
 */
export const ID_COMPONENT_MAP: Record<string, string> = {
  "site-title": "site/title",
  "hero-headline": "site/headline",
  "hero-subheadline": "site/subheadline",
  "cta-button": "site/cta",
};

export function matchSiteElement(el: HTMLElement) {
  const byId = el.id ? ID_COMPONENT_MAP[el.id] : undefined;
  if (byId) return registry.get(byId) ?? null;
  return registry.matchNode(el);
}

export default markers;
