/**
 * Elementor-parity lightweight widgets for gòke editor.
 * Patterns inspired by VvvebJs components-widgets / elements (Apache-2.0)
 * and Elementor widget taxonomy — pure HTML + data-goke, no Bootstrap.
 */

import { registry } from "../core/registry";
import type { ComponentDefinition } from "../types";

const widgets: ComponentDefinition[] = [
  // ── Advanced content ───────────────────────────────────────
  {
    type: "content/tabs",
    name: "Tabs",
    category: "Content",
    icon: "▤",
    html: `<div data-goke="tabs" style="border:1px solid #e2e8f0;border-radius:12px;overflow:hidden;background:#fff;">
  <div role="tablist" style="display:flex;border-bottom:1px solid #e2e8f0;background:#f8fafc;">
    <button type="button" data-goke="button" style="flex:1;padding:12px 16px;border:0;background:#fff;font-weight:600;border-bottom:2px solid var(--goke-primary,#3b82f6);cursor:pointer;">Tab one</button>
    <button type="button" data-goke="button" style="flex:1;padding:12px 16px;border:0;background:transparent;font-weight:500;color:#64748b;cursor:pointer;">Tab two</button>
    <button type="button" data-goke="button" style="flex:1;padding:12px 16px;border:0;background:transparent;font-weight:500;color:#64748b;cursor:pointer;">Tab three</button>
  </div>
  <div data-goke="container" style="padding:20px;">
    <p data-goke="text" style="margin:0;color:#334155;">Tab content — edit this text. Swap tabs visually by editing labels.</p>
  </div>
</div>`,
    properties: [],
  },
  {
    type: "content/accordion",
    name: "Accordion",
    category: "Content",
    icon: "☰",
    html: `<div data-goke="accordion" style="display:flex;flex-direction:column;gap:8px;">
  <details data-goke="faq" open style="border:1px solid #e2e8f0;border-radius:10px;padding:12px 16px;background:#fff;">
    <summary data-goke="heading" style="font-weight:600;cursor:pointer;">Section title</summary>
    <p data-goke="text" style="margin:10px 0 0;color:#64748b;">Expandable body text.</p>
  </details>
  <details data-goke="faq" style="border:1px solid #e2e8f0;border-radius:10px;padding:12px 16px;background:#fff;">
    <summary data-goke="heading" style="font-weight:600;cursor:pointer;">Another section</summary>
    <p data-goke="text" style="margin:10px 0 0;color:#64748b;">More content.</p>
  </details>
</div>`,
    properties: [],
  },
  {
    type: "content/counter",
    name: "Counter",
    category: "Content",
    icon: "123",
    html: `<div data-goke="counter" style="text-align:center;padding:16px;">
  <div data-goke="heading" style="font-size:2.5rem;font-weight:800;color:var(--goke-primary,#3b82f6);line-height:1;">500+</div>
  <p data-goke="text" style="margin:8px 0 0;color:#64748b;font-size:0.9rem;">Happy clients</p>
</div>`,
    properties: [],
  },
  {
    type: "content/progress",
    name: "Progress bar",
    category: "Content",
    icon: "━",
    html: `<div data-goke="progress" style="margin:8px 0;">
  <div style="display:flex;justify-content:space-between;margin-bottom:6px;">
    <span data-goke="text" style="font-size:0.875rem;font-weight:600;">Skill</span>
    <span data-goke="text" style="font-size:0.875rem;color:#64748b;">85%</span>
  </div>
  <div style="height:10px;background:#e2e8f0;border-radius:999px;overflow:hidden;">
    <div style="width:85%;height:100%;background:var(--goke-primary,#3b82f6);border-radius:999px;"></div>
  </div>
</div>`,
    properties: [],
  },
  {
    type: "content/star-rating",
    name: "Star rating",
    category: "Content",
    icon: "★",
    html: `<div data-goke="rating" style="display:inline-flex;gap:4px;align-items:center;color:#f59e0b;font-size:1.25rem;" aria-label="5 star rating">
  <span>★</span><span>★</span><span>★</span><span>★</span><span>★</span>
  <span data-goke="text" style="margin-left:8px;font-size:0.875rem;color:#64748b;">5.0</span>
</div>`,
    properties: [],
  },
  {
    type: "content/testimonial-card",
    name: "Testimonial card",
    category: "Content",
    icon: "❝",
    html: `<blockquote data-goke="testimonial" style="margin:0;padding:24px;background:#f8fafc;border-radius:14px;border:1px solid #e2e8f0;">
  <p data-goke="text" style="margin:0 0 16px;font-size:1.05rem;color:#334155;font-style:italic;">“Your quote here — edit to match real client feedback.”</p>
  <footer style="display:flex;align-items:center;gap:12px;">
    <img data-goke="image" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80" alt="Client" style="width:44px;height:44px;border-radius:50%;object-fit:cover;"/>
    <div>
      <div data-goke="heading" style="font-weight:700;font-size:0.95rem;">Client name</div>
      <div data-goke="text" style="font-size:0.8rem;color:#64748b;">Role · City</div>
    </div>
  </footer>
</blockquote>`,
    properties: [],
  },
  {
    type: "content/cta-box",
    name: "Call to action box",
    category: "Content",
    icon: "▶",
    html: `<div data-goke="cta-box" style="padding:32px;border-radius:16px;background:linear-gradient(135deg,var(--goke-primary,#3b82f6),#1d4ed8);color:#fff;text-align:center;">
  <h3 data-goke="heading" style="margin:0 0 10px;font-size:1.35rem;">Ready when you are</h3>
  <p data-goke="text" style="margin:0 0 20px;opacity:0.95;">One clear next step.</p>
  <a data-goke="button" href="#contact" style="display:inline-block;background:#fff;color:var(--goke-primary,#3b82f6);padding:12px 24px;border-radius:10px;font-weight:700;text-decoration:none;">Book now</a>
</div>`,
    properties: [],
  },
  {
    type: "content/image-box",
    name: "Image box",
    category: "Media",
    icon: "▣",
    html: `<div data-goke="image-box" style="border-radius:14px;overflow:hidden;border:1px solid #e2e8f0;background:#fff;max-width:360px;">
  <img data-goke="image" src="https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=600&q=80" alt="Feature" style="width:100%;height:180px;object-fit:cover;display:block;"/>
  <div style="padding:16px;">
    <h3 data-goke="heading" style="margin:0 0 8px;font-size:1.1rem;">Title</h3>
    <p data-goke="text" style="margin:0;color:#64748b;font-size:0.9rem;">Supporting text under the image.</p>
  </div>
</div>`,
    properties: [],
  },
  {
    type: "content/price-table",
    name: "Price table",
    category: "Commerce",
    icon: "₦",
    html: `<div data-goke="price-table" style="border:1px solid #e2e8f0;border-radius:16px;padding:28px;text-align:center;background:#fff;max-width:300px;">
  <h3 data-goke="heading" style="margin:0 0 8px;">Plan name</h3>
  <p data-goke="text" style="font-size:2rem;font-weight:800;margin:0 0 8px;color:var(--goke-text,#0f172a);">₦50,000</p>
  <p data-goke="text" style="margin:0 0 20px;color:#64748b;font-size:0.9rem;">Per package</p>
  <ul data-goke="list" style="text-align:left;padding-left:1.2rem;margin:0 0 20px;color:#475569;font-size:0.9rem;">
    <li>Feature one</li>
    <li>Feature two</li>
    <li>Feature three</li>
  </ul>
  <a data-goke="button" href="#contact" style="display:inline-block;width:100%;box-sizing:border-box;background:var(--goke-primary,#3b82f6);color:#fff;padding:12px;border-radius:10px;font-weight:600;text-decoration:none;">Select</a>
</div>`,
    properties: [],
  },
  {
    type: "content/map-embed",
    name: "Map embed",
    category: "Media",
    icon: "🗺",
    html: `<div data-goke="map" style="border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;min-height:240px;">
  <iframe data-goke="embed" title="Location map" src="https://www.openstreetmap.org/export/embed.html?bbox=3.3%2C6.4%2C3.5%2C6.6&amp;layer=mapnik" style="border:0;width:100%;height:240px;" loading="lazy"></iframe>
</div>`,
    properties: [],
  },
  {
    type: "content/video-embed",
    name: "Video embed",
    category: "Media",
    icon: "▶",
    html: `<div data-goke="video-wrap" style="position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;background:#0f172a;">
  <iframe data-goke="embed" title="Video" src="https://www.youtube.com/embed/dQw4w9WgXcQ" style="position:absolute;inset:0;width:100%;height:100%;border:0;" allowfullscreen loading="lazy"></iframe>
</div>`,
    properties: [],
  },
  {
    type: "content/whatsapp-button",
    name: "WhatsApp button",
    category: "Business",
    icon: "💬",
    html: `<a data-goke="button" href="https://wa.me/2348000000000" style="display:inline-flex;align-items:center;gap:8px;background:#25D366;color:#fff;padding:14px 24px;border-radius:999px;font-weight:700;text-decoration:none;box-shadow:0 4px 14px rgba(37,211,102,0.35);">
  <span aria-hidden="true">💬</span>
  <span data-goke="text">Chat on WhatsApp</span>
</a>`,
    properties: [
      {
        name: "WhatsApp link",
        key: "href",
        htmlAttr: "href",
        inputType: "text",
        defaultValue: "https://wa.me/2348000000000",
      },
    ],
  },
  {
    type: "layout/html-block",
    name: "HTML block",
    category: "Layout",
    icon: "</>",
    html: `<div data-goke="html-block" style="padding:12px;border:1px dashed #cbd5e1;border-radius:8px;color:#64748b;font-size:0.875rem;">
  Custom HTML block — replace with your markup.
</div>`,
    properties: [],
  },
];

registry.registerMany(widgets);
export default widgets;
