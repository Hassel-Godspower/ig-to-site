/**
 * Goke native components – zero Bootstrap
 * Layout, Content, Business, Commerce building blocks
 */

import { registry } from "../core/registry";
import type { ComponentDefinition } from "../types";

const components: ComponentDefinition[] = [
  // ── Layout ─────────────────────────────────────
  {
    type: "layout/section",
    name: "Section",
    category: "Layout",
    icon: "▣",
    html: `<section data-goke="section" style="padding: 64px 24px;">
  <div data-goke="container" style="max-width: 1120px; margin: 0 auto;">
    <div data-goke-empty>Drop content here</div>
  </div>
</section>`,
    attributes: ["data-goke"],
    classes: [],
    properties: [
      {
        name: "Padding Y",
        key: "paddingY",
        cssProperty: "padding-top",
        inputType: "css-unit",
        units: ["px", "rem", "em"],
        defaultValue: "64px",
      },
      {
        name: "Background",
        key: "background",
        cssProperty: "background-color",
        inputType: "color",
        defaultValue: "#ffffff",
      },
    ],
  },
  {
    type: "layout/container",
    name: "Container",
    category: "Layout",
    icon: "▭",
    html: `<div data-goke="container" style="max-width: 1120px; margin: 0 auto; padding: 0 24px;">
  <div data-goke-empty>Drop content here</div>
</div>`,
    attributes: ["data-goke"],
    properties: [
      {
        name: "Max width",
        key: "maxWidth",
        cssProperty: "max-width",
        inputType: "css-unit",
        units: ["px", "%", "rem"],
        defaultValue: "1120px",
      },
    ],
  },
  {
    type: "layout/columns",
    name: "Columns",
    category: "Layout",
    icon: "▥",
    html: `<div data-goke="columns" style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
  <div data-goke-empty>Column 1</div>
  <div data-goke-empty>Column 2</div>
</div>`,
    attributes: ["data-goke"],
    properties: [
      {
        name: "Columns",
        key: "cols",
        cssProperty: "grid-template-columns",
        inputType: "select",
        options: [
          { value: "1fr", label: "1 column" },
          { value: "1fr 1fr", label: "2 columns" },
          { value: "1fr 1fr 1fr", label: "3 columns" },
          { value: "1fr 1fr 1fr 1fr", label: "4 columns" },
          { value: "2fr 1fr", label: "2/3 + 1/3" },
          { value: "1fr 2fr", label: "1/3 + 2/3" },
        ],
        defaultValue: "1fr 1fr",
      },
      {
        name: "Gap",
        key: "gap",
        cssProperty: "gap",
        inputType: "css-unit",
        units: ["px", "rem"],
        defaultValue: "24px",
      },
    ],
  },

  // ── Content ────────────────────────────────────
  {
    type: "content/heading",
    name: "Heading",
    category: "Content",
    icon: "H",
    tags: ["h1", "h2", "h3", "h4", "h5", "h6"],
    html: `<h2 data-goke="heading" style="font-size: 2rem; font-weight: 700; line-height: 1.2; margin: 0 0 16px;">
  Your heading here
</h2>`,
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
        name: "Level",
        key: "level",
        inputType: "select",
        options: [
          { value: "h1", label: "H1" },
          { value: "h2", label: "H2" },
          { value: "h3", label: "H3" },
          { value: "h4", label: "H4" },
          { value: "h5", label: "H5" },
          { value: "h6", label: "H6" },
        ],
        onChange(node, value) {
          const newEl = document.createElement(String(value));
          newEl.innerHTML = node.innerHTML;
          Array.from(node.attributes).forEach((a) =>
            newEl.setAttribute(a.name, a.value)
          );
          node.replaceWith(newEl);
          return newEl as HTMLElement;
        },
      },
      {
        name: "Font size",
        key: "fontSize",
        cssProperty: "font-size",
        inputType: "css-unit",
        units: ["px", "rem", "em"],
      },
      {
        name: "Color",
        key: "color",
        cssProperty: "color",
        inputType: "color",
      },
      {
        name: "Align",
        key: "textAlign",
        cssProperty: "text-align",
        inputType: "select",
        options: [
          { value: "left", label: "Left" },
          { value: "center", label: "Center" },
          { value: "right", label: "Right" },
        ],
      },
    ],
  },
  {
    type: "content/text",
    name: "Text",
    category: "Content",
    icon: "T",
    tags: ["p"],
    html: `<p data-goke="text" style="font-size: 1rem; line-height: 1.6; margin: 0 0 16px; color: #374151;">
  Write your paragraph text here. Click to edit.
</p>`,
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
        name: "Font size",
        key: "fontSize",
        cssProperty: "font-size",
        inputType: "css-unit",
        units: ["px", "rem"],
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
    type: "content/image",
    name: "Image",
    category: "Content",
    icon: "▣",
    tags: ["img"],
    html: `<img data-goke="image" src="https://picsum.photos/800/450" alt="Image" style="width: 100%; height: auto; border-radius: 8px;" />`,
    properties: [
      {
        name: "Source",
        key: "src",
        htmlAttr: "src",
        inputType: "image",
      },
      {
        name: "Alt text",
        key: "alt",
        htmlAttr: "alt",
        inputType: "text",
      },
      {
        name: "Border radius",
        key: "borderRadius",
        cssProperty: "border-radius",
        inputType: "css-unit",
        units: ["px", "%"],
      },
    ],
  },
  {
    type: "content/button",
    name: "Button",
    category: "Content",
    icon: "▢",
    html: `<a data-goke="button" href="#" style="display: inline-block; padding: 12px 24px; background: #111827; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px;">
  Click me
</a>`,
    attributes: ["data-goke"],
    properties: [
      {
        name: "Label",
        key: "label",
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
      {
        name: "Border radius",
        key: "borderRadius",
        cssProperty: "border-radius",
        inputType: "css-unit",
        units: ["px", "%"],
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
  {
    type: "content/video",
    name: "Video",
    category: "Content",
    icon: "▶",
    html: `<div data-goke="video" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px;">
  <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen></iframe>
</div>`,
    attributes: ["data-goke"],
    properties: [
      {
        name: "YouTube / Vimeo URL",
        key: "src",
        child: "iframe",
        htmlAttr: "src",
        inputType: "link",
      },
    ],
  },

  // ── Business ───────────────────────────────────
  {
    type: "business/hero",
    name: "Hero",
    category: "Business",
    icon: "★",
    html: `<section data-goke="hero" style="padding: 96px 24px; text-align: center; background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color: #fff;">
  <div style="max-width: 720px; margin: 0 auto;">
    <h1 style="font-size: 3rem; font-weight: 800; line-height: 1.1; margin: 0 0 16px;">Build something amazing</h1>
    <p style="font-size: 1.25rem; opacity: 0.85; margin: 0 0 32px;">The modern visual website builder for the next generation of creators.</p>
    <a href="#" style="display: inline-block; padding: 14px 28px; background: #3b82f6; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;">Get started</a>
  </div>
</section>`,
    attributes: ["data-goke"],
    properties: [
      {
        name: "Background",
        key: "background",
        cssProperty: "background",
        inputType: "text",
      },
    ],
  },
  {
    type: "business/feature",
    name: "Feature card",
    category: "Business",
    icon: "◆",
    html: `<div data-goke="feature" style="padding: 32px; border: 1px solid #e5e7eb; border-radius: 12px; background: #fff;">
  <div style="width: 48px; height: 48px; background: #eff6ff; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; font-size: 24px;">✦</div>
  <h3 style="font-size: 1.25rem; font-weight: 700; margin: 0 0 8px;">Feature title</h3>
  <p style="font-size: 0.95rem; color: #6b7280; margin: 0; line-height: 1.5;">Describe the benefit of this feature in one or two sentences.</p>
</div>`,
    attributes: ["data-goke"],
  },
  {
    type: "business/pricing",
    name: "Pricing card",
    category: "Business",
    icon: "$",
    html: `<div data-goke="pricing" style="padding: 32px; border: 1px solid #e5e7eb; border-radius: 16px; background: #fff; text-align: center;">
  <h3 style="font-size: 1.125rem; font-weight: 600; margin: 0 0 8px;">Pro</h3>
  <div style="font-size: 2.5rem; font-weight: 800; margin: 0 0 4px;">$29</div>
  <p style="color: #6b7280; margin: 0 0 24px; font-size: 0.875rem;">per month</p>
  <ul style="list-style: none; padding: 0; margin: 0 0 24px; text-align: left; font-size: 0.95rem; color: #374151;">
    <li style="padding: 6px 0;">✓ Unlimited projects</li>
    <li style="padding: 6px 0;">✓ Custom domains</li>
    <li style="padding: 6px 0;">✓ Priority support</li>
  </ul>
  <a href="#" style="display: block; padding: 12px; background: #111827; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;">Choose plan</a>
</div>`,
    attributes: ["data-goke"],
  },
  {
    type: "business/testimonial",
    name: "Testimonial",
    category: "Business",
    icon: "❝",
    html: `<blockquote data-goke="testimonial" style="padding: 32px; background: #f9fafb; border-radius: 12px; margin: 0;">
  <p style="font-size: 1.125rem; line-height: 1.6; margin: 0 0 20px; color: #111827;">“This tool completely changed how we ship websites. Our team is 3× faster.”</p>
  <footer style="display: flex; align-items: center; gap: 12px;">
    <img src="https://i.pravatar.cc/48" alt="" style="width: 48px; height: 48px; border-radius: 50%;" />
    <div>
      <div style="font-weight: 600; font-size: 0.95rem;">Alex Rivera</div>
      <div style="font-size: 0.8rem; color: #6b7280;">CEO, Northwind</div>
    </div>
  </footer>
</blockquote>`,
    attributes: ["data-goke"],
  },
  {
    type: "business/cta",
    name: "Call to action",
    category: "Business",
    icon: "→",
    html: `<section data-goke="cta" style="padding: 64px 24px; text-align: center; background: #111827; color: #fff; border-radius: 16px;">
  <h2 style="font-size: 2rem; font-weight: 700; margin: 0 0 12px;">Ready to get started?</h2>
  <p style="opacity: 0.8; margin: 0 0 24px;">Join thousands of teams already building with Goke.</p>
  <a href="#" style="display: inline-block; padding: 14px 28px; background: #3b82f6; color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;">Start free trial</a>
</section>`,
    attributes: ["data-goke"],
  },

  // ── Commerce ───────────────────────────────────
  {
    type: "commerce/product",
    name: "Product card",
    category: "Commerce",
    icon: "🛒",
    html: `<div data-goke="product" style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background: #fff;">
  <img src="https://picsum.photos/400/300" alt="Product" style="width: 100%; height: 200px; object-fit: cover;" />
  <div style="padding: 20px;">
    <h3 style="font-size: 1.125rem; font-weight: 600; margin: 0 0 4px;">Product name</h3>
    <p style="color: #6b7280; font-size: 0.875rem; margin: 0 0 12px;">Short description of the product.</p>
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <span style="font-size: 1.25rem; font-weight: 700;">$49</span>
      <a href="#" style="padding: 8px 16px; background: #111827; color: #fff; border-radius: 6px; text-decoration: none; font-size: 0.875rem; font-weight: 600;">Add to cart</a>
    </div>
  </div>
</div>`,
    attributes: ["data-goke"],
  },
];

// Register everything
registry.registerMany(components);

export default components;
