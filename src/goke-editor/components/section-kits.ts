/**
 * Pre-built section kits for IG/business sites
 * Registered into the component registry under category "Kits".
 */

import { registry } from "../core/registry";
import type { ComponentDefinition } from "../types";

const kits: ComponentDefinition[] = [
  {
    type: "kit/hero-centered",
    name: "Hero – Centered",
    category: "Kits",
    icon: "▣",
    html: `<section class="site-section" data-goke="section" data-section-name="Hero" style="padding:80px 24px;text-align:center;background:var(--goke-bg,#fff);">
  <div data-goke="container" style="max-width:720px;margin:0 auto;">
    <h1 data-goke="heading" style="font-size:2.75rem;font-weight:800;line-height:1.15;color:var(--goke-text,#111);margin:0 0 16px;">Your headline goes here</h1>
    <p data-goke="text" style="font-size:1.125rem;color:var(--goke-muted,#6b7280);margin:0 0 28px;">A short supporting line that explains what you offer.</p>
    <a data-goke="button" href="#contact" style="display:inline-block;background:var(--goke-primary,#3b82f6);color:#fff;padding:14px 28px;border-radius:10px;font-weight:600;text-decoration:none;">Get started</a>
  </div>
</section>`,
    properties: [],
  },
  {
    type: "kit/services-3",
    name: "Services – 3 cards",
    category: "Kits",
    icon: "▦",
    html: `<section class="site-section" data-goke="section" data-section-name="Services" style="padding:64px 24px;background:#f8fafc;">
  <div data-goke="container" style="max-width:1100px;margin:0 auto;">
    <h2 data-goke="heading" style="text-align:center;font-size:2rem;margin:0 0 40px;color:var(--goke-text,#111);">What we offer</h2>
    <div data-goke="columns" style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
      <div data-goke="container" style="background:#fff;border-radius:12px;padding:28px;box-shadow:0 1px 3px rgba(0,0,0,.08);">
        <h3 data-goke="heading" style="margin:0 0 8px;font-size:1.25rem;">Service one</h3>
        <p data-goke="text" style="margin:0;color:var(--goke-muted,#6b7280);">Describe this service in one or two sentences.</p>
      </div>
      <div data-goke="container" style="background:#fff;border-radius:12px;padding:28px;box-shadow:0 1px 3px rgba(0,0,0,.08);">
        <h3 data-goke="heading" style="margin:0 0 8px;font-size:1.25rem;">Service two</h3>
        <p data-goke="text" style="margin:0;color:var(--goke-muted,#6b7280);">Describe this service in one or two sentences.</p>
      </div>
      <div data-goke="container" style="background:#fff;border-radius:12px;padding:28px;box-shadow:0 1px 3px rgba(0,0,0,.08);">
        <h3 data-goke="heading" style="margin:0 0 8px;font-size:1.25rem;">Service three</h3>
        <p data-goke="text" style="margin:0;color:var(--goke-muted,#6b7280);">Describe this service in one or two sentences.</p>
      </div>
    </div>
  </div>
</section>`,
    properties: [],
  },
  {
    type: "kit/whatsapp-cta",
    name: "WhatsApp CTA",
    category: "Kits",
    icon: "💬",
    html: `<section class="site-section" data-goke="section" data-section-name="WhatsApp" style="padding:56px 24px;background:var(--goke-primary,#25D366);text-align:center;">
  <div data-goke="container" style="max-width:560px;margin:0 auto;">
    <h2 data-goke="heading" style="color:#fff;font-size:1.75rem;margin:0 0 12px;">Chat with us on WhatsApp</h2>
    <p data-goke="text" style="color:rgba(255,255,255,.9);margin:0 0 24px;">Quick replies. Real people. No forms.</p>
    <a data-goke="button" href="https://wa.me/2348000000000" target="_blank" rel="noopener" style="display:inline-block;background:#fff;color:#128C7E;padding:14px 28px;border-radius:999px;font-weight:700;text-decoration:none;">Message on WhatsApp</a>
  </div>
</section>`,
    properties: [
      {
        name: "WhatsApp link",
        key: "href",
        htmlAttr: "href",
        child: "a",
        inputType: "link",
      },
    ],
  },
  {
    type: "kit/testimonials",
    name: "Testimonials",
    category: "Kits",
    icon: "★",
    html: `<section class="site-section" data-goke="section" data-section-name="Testimonials" style="padding:64px 24px;">
  <div data-goke="container" style="max-width:900px;margin:0 auto;">
    <h2 data-goke="heading" style="text-align:center;font-size:2rem;margin:0 0 40px;">What clients say</h2>
    <div data-goke="columns" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
      <blockquote data-goke="container" style="margin:0;padding:24px;background:#f8fafc;border-radius:12px;border-left:4px solid var(--goke-primary,#3b82f6);">
        <p data-goke="text" style="margin:0 0 12px;font-style:italic;">“Outstanding work — delivered exactly what we needed.”</p>
        <footer data-goke="text" style="font-weight:600;">— Ada, Founder</footer>
      </blockquote>
      <blockquote data-goke="container" style="margin:0;padding:24px;background:#f8fafc;border-radius:12px;border-left:4px solid var(--goke-primary,#3b82f6);">
        <p data-goke="text" style="margin:0 0 12px;font-style:italic;">“Professional, fast, and easy to work with.”</p>
        <footer data-goke="text" style="font-weight:600;">— Chidi, Manager</footer>
      </blockquote>
    </div>
  </div>
</section>`,
    properties: [],
  },
  {
    type: "kit/contact-simple",
    name: "Contact block",
    category: "Kits",
    icon: "✉",
    html: `<section class="site-section" data-goke="section" data-section-name="Contact" id="contact" style="padding:64px 24px;background:#0f172a;color:#fff;">
  <div data-goke="container" style="max-width:560px;margin:0 auto;text-align:center;">
    <h2 data-goke="heading" style="font-size:2rem;margin:0 0 12px;">Get in touch</h2>
    <p data-goke="text" style="color:#94a3b8;margin:0 0 28px;">Tell us about your project. We’ll reply within 24 hours.</p>
    <a data-goke="button" href="mailto:hello@example.com" style="display:inline-block;background:var(--goke-primary,#3b82f6);color:#fff;padding:14px 28px;border-radius:10px;font-weight:600;text-decoration:none;">Email us</a>
  </div>
</section>`,
    properties: [],
  },
  {
    type: "kit/pricing-2",
    name: "Pricing – 2 tiers",
    category: "Kits",
    icon: "₦",
    html: `<section class="site-section" data-goke="section" data-section-name="Pricing" style="padding:64px 24px;">
  <div data-goke="container" style="max-width:800px;margin:0 auto;">
    <h2 data-goke="heading" style="text-align:center;font-size:2rem;margin:0 0 40px;">Simple pricing</h2>
    <div data-goke="columns" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
      <div data-goke="container" style="border:1px solid #e2e8f0;border-radius:16px;padding:32px;text-align:center;">
        <h3 data-goke="heading" style="margin:0 0 8px;">Starter</h3>
        <p data-goke="text" style="font-size:2rem;font-weight:800;margin:0 0 16px;">₦25,000</p>
        <p data-goke="text" style="color:#6b7280;margin:0 0 24px;">Perfect for getting online fast.</p>
        <a data-goke="button" href="#contact" style="display:inline-block;background:#e2e8f0;color:#0f172a;padding:12px 24px;border-radius:8px;font-weight:600;text-decoration:none;">Choose</a>
      </div>
      <div data-goke="container" style="border:2px solid var(--goke-primary,#3b82f6);border-radius:16px;padding:32px;text-align:center;">
        <h3 data-goke="heading" style="margin:0 0 8px;">Pro</h3>
        <p data-goke="text" style="font-size:2rem;font-weight:800;margin:0 0 16px;">₦75,000</p>
        <p data-goke="text" style="color:#6b7280;margin:0 0 24px;">Full site + edits + support.</p>
        <a data-goke="button" href="#contact" style="display:inline-block;background:var(--goke-primary,#3b82f6);color:#fff;padding:12px 24px;border-radius:8px;font-weight:600;text-decoration:none;">Choose</a>
      </div>
    </div>
  </div>
</section>`,
    properties: [],
  },
];

registry.registerMany(kits);

export default kits;
