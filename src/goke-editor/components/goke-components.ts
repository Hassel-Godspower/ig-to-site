/**
 * Goke native components – Elementor-style widget palette
 * Layout · Content · Media · Forms · Business · Commerce
 * Zero Bootstrap dependency in the editor chrome; HTML is plain.
 */

import { registry } from "../core/registry";
import type { ComponentDefinition } from "../types";
import { iconSvgMarkup } from "../data/icons";

const components: ComponentDefinition[] = [
  // ═══════════════════════════════════════════════
  // Layout
  // ═══════════════════════════════════════════════
  {
    type: "layout/section",
    name: "Section",
    category: "Layout",
    icon: "▣",
    html: `<section data-goke="section" class="site-section" data-section-name="Section" style="padding: 64px 24px;">
  <div data-goke="container" style="max-width: 1120px; margin: 0 auto;">
    <div data-goke-empty>Drop content here</div>
  </div>
</section>`,
    attributes: ["data-goke"],
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
    type: "layout/inner-section",
    name: "Inner section",
    category: "Layout",
    icon: "▦",
    html: `<div data-goke="inner-section" style="display: flex; flex-wrap: wrap; gap: 24px; width: 100%;">
  <div data-goke="column" style="flex: 1 1 280px; min-width: 0;"><div data-goke-empty>Column</div></div>
  <div data-goke="column" style="flex: 1 1 280px; min-width: 0;"><div data-goke-empty>Column</div></div>
</div>`,
    attributes: ["data-goke"],
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
  {
    type: "layout/spacer",
    name: "Spacer",
    category: "Layout",
    icon: "↕",
    html: `<div data-goke="spacer" style="height: 40px; width: 100%;" aria-hidden="true"></div>`,
    attributes: ["data-goke"],
    properties: [
      {
        name: "Height",
        key: "height",
        cssProperty: "height",
        inputType: "css-unit",
        units: ["px", "rem", "vh"],
        defaultValue: "40px",
      },
    ],
  },
  {
    type: "layout/divider",
    name: "Divider",
    category: "Layout",
    icon: "—",
    html: `<hr data-goke="divider" style="border: none; border-top: 1px solid #e5e7eb; margin: 24px 0;" />`,
    attributes: ["data-goke"],
    properties: [
      {
        name: "Color",
        key: "color",
        cssProperty: "border-top-color",
        inputType: "color",
        defaultValue: "#e5e7eb",
      },
      {
        name: "Thickness",
        key: "thickness",
        cssProperty: "border-top-width",
        inputType: "css-unit",
        units: ["px"],
        defaultValue: "1px",
      },
    ],
  },

  // ═══════════════════════════════════════════════
  // Content
  // ═══════════════════════════════════════════════
  {
    type: "content/heading",
    name: "Heading",
    category: "Content",
    icon: "H",
    tags: ["h1", "h2", "h3", "h4", "h5", "h6"],
    html: `<h2 data-goke="heading" style="font-size: 2rem; font-weight: 700; line-height: 1.2; margin: 0 0 12px; color: #111827;">Add your heading here</h2>`,
    attributes: ["data-goke"],
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
        name: "Size",
        key: "fontSize",
        cssProperty: "font-size",
        inputType: "css-unit",
        units: ["px", "rem", "em"],
      },
    ],
  },
  {
    type: "content/text",
    name: "Text Editor",
    category: "Content",
    icon: "T",
    tags: ["p"],
    html: `<p data-goke="text" style="font-size: 1rem; line-height: 1.6; color: #4b5563; margin: 0 0 12px;">Write your text here. Keep it clear and useful for your visitors.</p>`,
    attributes: ["data-goke"],
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
    type: "content/button",
    name: "Button",
    category: "Content",
    icon: "▢",
    tags: ["button"],
    html: `<a data-goke="button" href="#contact" style="display: inline-block; padding: 12px 24px; background: var(--goke-primary, #3b82f6); color: #fff; border-radius: 8px; text-decoration: none; font-weight: 600;">Click here</a>`,
    attributes: ["data-goke"],
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
    type: "content/link",
    name: "Link",
    category: "Content",
    icon: "↗",
    html: `<a data-goke="link" href="https://example.com" style="color: var(--goke-primary, #3b82f6); text-decoration: underline;">Link text</a>`,
    attributes: ["data-goke"],
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
        name: "URL",
        key: "href",
        htmlAttr: "href",
        inputType: "link",
      },
    ],
  },
  {
    type: "content/list",
    name: "List",
    category: "Content",
    icon: "≡",
    html: `<ul data-goke="list" style="margin: 0 0 16px; padding-left: 1.25rem; color: #374151; line-height: 1.7;">
  <li>First list item</li>
  <li>Second list item</li>
  <li>Third list item</li>
</ul>`,
    attributes: ["data-goke"],
    properties: [
      {
        name: "Items (one per line)",
        key: "items",
        inputType: "textarea",
        onChange(node, value) {
          const items = String(value)
            .split("\n")
            .map((s) => s.trim())
            .filter(Boolean);
          node.innerHTML = items.map((t) => "<li>" + t + "</li>").join("");
          return node;
        },
      },
    ],
  },
  {
    type: "content/quote",
    name: "Blockquote",
    category: "Content",
    icon: "❝",
    html: `<blockquote data-goke="quote" style="margin: 0 0 16px; padding: 16px 20px; border-left: 4px solid var(--goke-primary, #3b82f6); background: #f8fafc; color: #374151; font-style: italic;">
  "A short quote that builds trust."
  <footer style="margin-top: 8px; font-style: normal; font-weight: 600; font-size: 0.875rem;">— Author</footer>
</blockquote>`,
    attributes: ["data-goke"],
  },
  {
    type: "content/badge",
    name: "Badge",
    category: "Content",
    icon: "●",
    html: `<span data-goke="badge" style="display: inline-block; padding: 4px 10px; border-radius: 999px; background: #eff6ff; color: #1d4ed8; font-size: 0.75rem; font-weight: 600;">New</span>`,
    attributes: ["data-goke"],
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
        name: "Background",
        key: "background",
        cssProperty: "background-color",
        inputType: "color",
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
    type: "content/alert",
    name: "Alert / Notice",
    category: "Content",
    icon: "!",
    html: `<div data-goke="alert" role="status" style="padding: 12px 16px; border-radius: 8px; background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0;">
  Success — your message goes here.
</div>`,
    attributes: ["data-goke"],
    properties: [
      {
        name: "Message",
        key: "text",
        inputType: "textarea",
        onChange(node, value) {
          node.textContent = String(value);
          return node;
        },
      },
    ],
  },
  {
    type: "content/icon",
    name: "Icon",
    category: "Content",
    icon: "★",
    html: `<span data-goke="icon" data-icon="heart" style="display:inline-flex;align-items:center;justify-content:center;width:48px;height:48px;color:var(--goke-primary,#3b82f6);">${iconSvgMarkup("heart", 32)}</span>`,
    attributes: ["data-goke"],
    properties: [
      {
        name: "Icon",
        key: "icon",
        htmlAttr: "data-icon",
        inputType: "icon",
        defaultValue: "heart",
        onChange(node, value) {
          const name = String(value || "heart");
          node.setAttribute("data-icon", name);
          node.innerHTML = iconSvgMarkup(name, 32);
          return node;
        },
      },
      {
        name: "Color",
        key: "color",
        cssProperty: "color",
        inputType: "color",
        defaultValue: "#3b82f6",
      },
      {
        name: "Size",
        key: "size",
        inputType: "css-unit",
        units: ["px", "rem"],
        defaultValue: "32px",
        onChange(node, value) {
          const size = String(value || "32px");
          const px = parseInt(size, 10) || 32;
          node.style.width = size;
          node.style.height = size;
          const svg = node.querySelector("svg");
          if (svg) {
            svg.setAttribute("width", String(px));
            svg.setAttribute("height", String(px));
          }
          return node;
        },
      },
    ],
  },
  {
    type: "content/icon-box",
    name: "Icon box",
    category: "Content",
    icon: "◆",
    html: `<div data-goke="icon-box" style="text-align: center; padding: 24px;">
  <div data-goke="icon" data-icon="zap" style="display:inline-flex;margin-bottom:12px;color:var(--goke-primary,#3b82f6);">${iconSvgMarkup("zap", 36)}</div>
  <h3 data-goke="heading" style="margin: 0 0 8px; font-size: 1.125rem;">Feature title</h3>
  <p data-goke="text" style="margin: 0; color: #6b7280; font-size: 0.9375rem;">Short description of this feature or benefit.</p>
</div>`,
    attributes: ["data-goke"],
  },

  // ═══════════════════════════════════════════════
  // Media
  // ═══════════════════════════════════════════════
  {
    type: "content/image",
    name: "Image",
    category: "Media",
    icon: "▣",
    tags: ["img"],
    html: `<img data-goke="image" src="https://picsum.photos/800/450" alt="Image" style="width: 100%; height: auto; border-radius: 8px; display: block;" />`,
    attributes: ["data-goke"],
    properties: [
      {
        name: "Image",
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
        key: "radius",
        cssProperty: "border-radius",
        inputType: "css-unit",
        units: ["px", "%"],
      },
    ],
  },
  {
    type: "content/video",
    name: "Video",
    category: "Media",
    icon: "▶",
    html: `<div data-goke="video" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px;">
  <iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" title="Video" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" allowfullscreen loading="lazy"></iframe>
</div>`,
    attributes: ["data-goke"],
    properties: [
      {
        name: "Embed URL",
        key: "src",
        child: "iframe",
        htmlAttr: "src",
        inputType: "link",
        placeholder: "https://www.youtube.com/embed/…",
      },
    ],
  },
  {
    type: "content/map",
    name: "Google Maps",
    category: "Media",
    icon: "⌖",
    html: `<div data-goke="map" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; border-radius: 8px;">
  <iframe src="https://maps.google.com/maps?q=Lagos&t=&z=13&ie=UTF8&iwloc=&output=embed" title="Map" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" loading="lazy"></iframe>
</div>`,
    attributes: ["data-goke"],
    properties: [
      {
        name: "Map embed URL",
        key: "src",
        child: "iframe",
        htmlAttr: "src",
        inputType: "link",
      },
    ],
  },
  {
    type: "content/gallery",
    name: "Image gallery",
    category: "Media",
    icon: "▦",
    html: `<div data-goke="gallery" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px;">
  <img data-goke="image" src="https://picsum.photos/seed/g1/400/300" alt="" style="width: 100%; border-radius: 8px; object-fit: cover; aspect-ratio: 4/3;" />
  <img data-goke="image" src="https://picsum.photos/seed/g2/400/300" alt="" style="width: 100%; border-radius: 8px; object-fit: cover; aspect-ratio: 4/3;" />
  <img data-goke="image" src="https://picsum.photos/seed/g3/400/300" alt="" style="width: 100%; border-radius: 8px; object-fit: cover; aspect-ratio: 4/3;" />
</div>`,
    attributes: ["data-goke"],
  },

  // ═══════════════════════════════════════════════
  // Forms
  // ═══════════════════════════════════════════════
  {
    type: "form/form",
    name: "Form",
    category: "Forms",
    icon: "▤",
    html: `<form data-goke="form" style="display: flex; flex-direction: column; gap: 12px; max-width: 480px;">
  <label style="display: flex; flex-direction: column; gap: 4px; font-size: 0.875rem; color: #374151;">
    Name
    <input data-goke="input" type="text" name="name" placeholder="Your name" style="padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px;" />
  </label>
  <label style="display: flex; flex-direction: column; gap: 4px; font-size: 0.875rem; color: #374151;">
    Email
    <input data-goke="input" type="email" name="email" placeholder="you@example.com" style="padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px;" />
  </label>
  <label style="display: flex; flex-direction: column; gap: 4px; font-size: 0.875rem; color: #374151;">
    Message
    <textarea data-goke="textarea" name="message" rows="4" placeholder="How can we help?" style="padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; resize: vertical;"></textarea>
  </label>
  <button data-goke="button" type="submit" style="padding: 12px 20px; background: var(--goke-primary, #3b82f6); color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Send message</button>
</form>`,
    attributes: ["data-goke"],
  },
  {
    type: "form/input",
    name: "Input",
    category: "Forms",
    icon: "▭",
    html: `<input data-goke="input" type="text" placeholder="Enter text" style="width: 100%; max-width: 400px; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; box-sizing: border-box;" />`,
    attributes: ["data-goke"],
    properties: [
      {
        name: "Placeholder",
        key: "placeholder",
        htmlAttr: "placeholder",
        inputType: "text",
      },
      {
        name: "Type",
        key: "type",
        htmlAttr: "type",
        inputType: "select",
        options: [
          { value: "text", label: "Text" },
          { value: "email", label: "Email" },
          { value: "tel", label: "Phone" },
          { value: "number", label: "Number" },
          { value: "url", label: "URL" },
          { value: "password", label: "Password" },
        ],
      },
    ],
  },
  {
    type: "form/textarea",
    name: "Textarea",
    category: "Forms",
    icon: "☰",
    html: `<textarea data-goke="textarea" rows="4" placeholder="Your message" style="width: 100%; max-width: 480px; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; box-sizing: border-box; resize: vertical;"></textarea>`,
    attributes: ["data-goke"],
    properties: [
      {
        name: "Placeholder",
        key: "placeholder",
        htmlAttr: "placeholder",
        inputType: "text",
      },
    ],
  },
  {
    type: "form/select",
    name: "Select",
    category: "Forms",
    icon: "▽",
    html: `<select data-goke="select" style="width: 100%; max-width: 400px; padding: 10px 12px; border: 1px solid #d1d5db; border-radius: 8px; background: #fff;">
  <option value="">Choose…</option>
  <option value="a">Option A</option>
  <option value="b">Option B</option>
  <option value="c">Option C</option>
</select>`,
    attributes: ["data-goke"],
  },
  {
    type: "form/checkbox",
    name: "Checkbox",
    category: "Forms",
    icon: "☑",
    html: `<label data-goke="checkbox" style="display: flex; align-items: center; gap: 8px; font-size: 0.9375rem; color: #374151; cursor: pointer;">
  <input type="checkbox" name="agree" />
  I agree to the terms
</label>`,
    attributes: ["data-goke"],
  },
  {
    type: "form/submit",
    name: "Submit button",
    category: "Forms",
    icon: "➤",
    html: `<button data-goke="button" type="submit" style="padding: 12px 24px; background: var(--goke-primary, #3b82f6); color: #fff; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Submit</button>`,
    attributes: ["data-goke"],
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
    ],
  },

  // ═══════════════════════════════════════════════
  // Business
  // ═══════════════════════════════════════════════
  {
    type: "business/hero",
    name: "Hero",
    category: "Business",
    icon: "▣",
    html: `<section data-goke="section" class="site-section" data-section-name="Hero" style="padding: 80px 24px; text-align: center; background: #0f172a; color: #fff;">
  <div data-goke="container" style="max-width: 720px; margin: 0 auto;">
    <h1 id="hero-headline" data-goke="heading" style="font-size: 2.75rem; font-weight: 800; line-height: 1.15; margin: 0 0 16px;">Your headline goes here</h1>
    <p id="hero-subheadline" data-goke="text" style="font-size: 1.125rem; opacity: 0.9; margin: 0 0 28px;">A short supporting line that explains what you offer.</p>
    <a id="cta-button" data-goke="button" href="#contact" class="cta-button" style="display: inline-block; background: var(--goke-primary, #3b82f6); color: #fff; padding: 14px 28px; border-radius: 10px; font-weight: 600; text-decoration: none;">Get started</a>
  </div>
</section>`,
    attributes: ["data-goke"],
  },
  {
    type: "business/feature",
    name: "Feature card",
    category: "Business",
    icon: "★",
    html: `<div data-goke="feature" style="padding: 24px; border-radius: 12px; background: #fff; border: 1px solid #e5e7eb;">
  <h3 data-goke="heading" style="margin: 0 0 8px; font-size: 1.125rem;">Feature title</h3>
  <p data-goke="text" style="margin: 0; color: #6b7280;">Describe this feature in one or two sentences.</p>
</div>`,
    attributes: ["data-goke"],
  },
  {
    type: "business/pricing",
    name: "Pricing card",
    category: "Business",
    icon: "$",
    html: `<div data-goke="pricing" style="padding: 32px; border-radius: 16px; border: 2px solid var(--goke-primary, #3b82f6); text-align: center; background: #fff;">
  <h3 data-goke="heading" style="margin: 0 0 8px;">Pro</h3>
  <p data-goke="text" style="font-size: 2rem; font-weight: 800; margin: 0 0 8px;">₦75,000</p>
  <p data-goke="text" style="color: #6b7280; margin: 0 0 20px;">Full site + edits + support</p>
  <a data-goke="button" href="#contact" style="display: inline-block; background: var(--goke-primary, #3b82f6); color: #fff; padding: 12px 24px; border-radius: 8px; font-weight: 600; text-decoration: none;">Choose plan</a>
</div>`,
    attributes: ["data-goke"],
  },
  {
    type: "business/testimonial",
    name: "Testimonial",
    category: "Business",
    icon: "❝",
    html: `<blockquote data-goke="testimonial" style="margin: 0; padding: 24px; background: #f8fafc; border-radius: 12px; border-left: 4px solid var(--goke-primary, #3b82f6);">
  <p data-goke="text" style="margin: 0 0 12px; font-style: italic;">"Outstanding work — delivered exactly what we needed."</p>
  <footer style="display: flex; align-items: center; gap: 12px;">
    <img src="https://i.pravatar.cc/48" alt="" style="width: 48px; height: 48px; border-radius: 50%;" />
    <span data-goke="text" style="font-weight: 600;">Ada, Founder</span>
  </footer>
</blockquote>`,
    attributes: ["data-goke"],
  },
  {
    type: "business/cta",
    name: "Call to action",
    category: "Business",
    icon: "→",
    html: `<section data-goke="section" class="site-section" data-section-name="CTA" style="padding: 56px 24px; text-align: center; background: var(--goke-primary, #3b82f6); color: #fff;">
  <div data-goke="container" style="max-width: 640px; margin: 0 auto;">
    <h2 data-goke="heading" style="margin: 0 0 12px; font-size: 1.75rem;">Ready to get started?</h2>
    <p data-goke="text" style="opacity: 0.9; margin: 0 0 24px;">Join thousands of teams already building with us.</p>
    <a data-goke="button" href="#contact" style="display: inline-block; padding: 14px 28px; background: #fff; color: #0f172a; border-radius: 8px; text-decoration: none; font-weight: 600;">Start free trial</a>
  </div>
</section>`,
    attributes: ["data-goke"],
  },
  {
    type: "business/faq",
    name: "FAQ item",
    category: "Business",
    icon: "?",
    html: `<details data-goke="faq" style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 12px 16px; margin-bottom: 8px; background: #fff;">
  <summary data-goke="heading" style="font-weight: 600; cursor: pointer;">Frequently asked question?</summary>
  <p data-goke="text" style="margin: 12px 0 0; color: #6b7280;">Clear answer that helps the visitor decide.</p>
</details>`,
    attributes: ["data-goke"],
  },
  {
    type: "business/stats",
    name: "Stats row",
    category: "Business",
    icon: "#",
    html: `<div data-goke="stats" style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; text-align: center;">
  <div><div style="font-size: 2rem; font-weight: 800; color: var(--goke-primary, #3b82f6);">120+</div><div style="color: #6b7280; font-size: 0.875rem;">Clients</div></div>
  <div><div style="font-size: 2rem; font-weight: 800; color: var(--goke-primary, #3b82f6);">98%</div><div style="color: #6b7280; font-size: 0.875rem;">Satisfaction</div></div>
  <div><div style="font-size: 2rem; font-weight: 800; color: var(--goke-primary, #3b82f6);">24/7</div><div style="color: #6b7280; font-size: 0.875rem;">Support</div></div>
</div>`,
    attributes: ["data-goke"],
  },
  {
    type: "business/social",
    name: "Social links",
    category: "Business",
    icon: "◎",
    html: `<div data-goke="social" style="display: flex; gap: 12px; align-items: center;">
  <a href="https://instagram.com" aria-label="Instagram" style="color: var(--goke-primary, #3b82f6);">${iconSvgMarkup("instagram", 24)}</a>
  <a href="https://twitter.com" aria-label="Twitter" style="color: var(--goke-primary, #3b82f6);">${iconSvgMarkup("twitter", 24)}</a>
  <a href="https://facebook.com" aria-label="Facebook" style="color: var(--goke-primary, #3b82f6);">${iconSvgMarkup("facebook", 24)}</a>
  <a href="https://youtube.com" aria-label="YouTube" style="color: var(--goke-primary, #3b82f6);">${iconSvgMarkup("youtube", 24)}</a>
</div>`,
    attributes: ["data-goke"],
  },
  {
    type: "business/contact",
    name: "Contact block",
    category: "Business",
    icon: "✉",
    html: `<section data-goke="section" class="site-section" data-section-name="Contact" id="contact" style="padding: 64px 24px; background: #0f172a; color: #fff;">
  <div data-goke="container" style="max-width: 560px; margin: 0 auto; text-align: center;">
    <h2 data-goke="heading" style="font-size: 2rem; margin: 0 0 12px;">Get in touch</h2>
    <p data-goke="text" style="color: #94a3b8; margin: 0 0 28px;">Tell us about your project. We will reply within 24 hours.</p>
    <a data-goke="button" href="mailto:hello@example.com" style="display: inline-block; background: var(--goke-primary, #3b82f6); color: #fff; padding: 14px 28px; border-radius: 10px; font-weight: 600; text-decoration: none;">Email us</a>
  </div>
</section>`,
    attributes: ["data-goke"],
  },

  // ═══════════════════════════════════════════════
  // Commerce
  // ═══════════════════════════════════════════════
  {
    type: "commerce/product",
    name: "Product card",
    category: "Commerce",
    icon: "🛒",
    html: `<div data-goke="product" style="border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden; background: #fff;">
  <img data-goke="image" src="https://picsum.photos/400/300" alt="Product" style="width: 100%; height: 200px; object-fit: cover;" />
  <div style="padding: 20px;">
    <h3 data-goke="heading" style="font-size: 1.125rem; font-weight: 600; margin: 0 0 4px;">Product name</h3>
    <p data-goke="text" style="color: #6b7280; font-size: 0.875rem; margin: 0 0 12px;">Short description of the product.</p>
    <div style="display: flex; align-items: center; justify-content: space-between;">
      <span style="font-size: 1.25rem; font-weight: 700;">₦49,000</span>
      <a data-goke="button" href="#" style="padding: 8px 16px; background: #111827; color: #fff; border-radius: 6px; text-decoration: none; font-size: 0.875rem; font-weight: 600;">Add to cart</a>
    </div>
  </div>
</div>`,
    attributes: ["data-goke"],
  },
];

registry.registerMany(components);

export default components;
