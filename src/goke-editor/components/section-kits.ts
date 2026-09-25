/**
 * Tier 2 — Pre-built section kits (Elementor / GrapesJS-style blocks)
 * Category: "Kits". Side-effect: registry.registerMany
 */

import { registry } from "../core/registry";
import type { ComponentDefinition } from "../types";
import { iconSvgMarkup } from "../data/icons";

const kits: ComponentDefinition[] = [
  {
    type: "kit/hero-centered",
    name: "Hero – Centered",
    category: "Kits",
    icon: "▣",
    html: `<section class="site-section" data-goke="section" data-section-name="Hero" style="padding:80px 24px;text-align:center;background:var(--goke-bg,#fff);">
  <div data-goke="container" style="max-width:720px;margin:0 auto;">
    <h1 id="hero-headline" data-goke="heading" style="font-size:2.75rem;font-weight:800;line-height:1.15;color:var(--goke-text,#111);margin:0 0 16px;">Your headline goes here</h1>
    <p id="hero-subheadline" data-goke="text" style="font-size:1.125rem;color:var(--goke-muted,#6b7280);margin:0 0 28px;">A short supporting line that explains what you offer.</p>
    <a id="cta-button" data-goke="button" href="#contact" class="cta-button" style="display:inline-block;background:var(--goke-primary,#3b82f6);color:#fff;padding:14px 28px;border-radius:10px;font-weight:600;text-decoration:none;">Get started</a>
  </div>
</section>`,
    properties: [],
  },
  {
    type: "kit/hero-split",
    name: "Hero – Split",
    category: "Kits",
    icon: "▥",
    html: `<section class="site-section" data-goke="section" data-section-name="Hero" style="padding:64px 24px;background:#0f172a;color:#fff;">
  <div data-goke="container" style="max-width:1120px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;">
    <div>
      <h1 id="hero-headline" data-goke="heading" style="font-size:2.5rem;font-weight:800;margin:0 0 16px;">Grow your business online</h1>
      <p id="hero-subheadline" data-goke="text" style="opacity:.85;margin:0 0 24px;line-height:1.6;">Turn Instagram content into a professional site visitors trust.</p>
      <a id="cta-button" data-goke="button" href="#contact" class="cta-button" style="display:inline-block;background:var(--goke-primary,#3b82f6);color:#fff;padding:12px 24px;border-radius:8px;font-weight:600;text-decoration:none;">Book a call</a>
    </div>
    <img data-goke="image" src="https://picsum.photos/seed/hero/640/480" alt="" style="width:100%;border-radius:16px;object-fit:cover;" />
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
  <div data-goke="container" style="max-width:1120px;margin:0 auto;">
    <h2 data-goke="heading" style="text-align:center;font-size:2rem;margin:0 0 40px;">What we offer</h2>
    <div data-goke="columns" style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:24px;">
      <div data-goke="feature" style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:24px;text-align:center;">
        <div style="display:inline-flex;margin-bottom:12px;color:var(--goke-primary,#3b82f6);">${iconSvgMarkup("zap", 32)}</div>
        <h3 data-goke="heading" style="margin:0 0 8px;">Fast delivery</h3>
        <p data-goke="text" style="margin:0;color:#6b7280;font-size:.9375rem;">Launch quickly without sacrificing quality.</p>
      </div>
      <div data-goke="feature" style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:24px;text-align:center;">
        <div style="display:inline-flex;margin-bottom:12px;color:var(--goke-primary,#3b82f6);">${iconSvgMarkup("shield", 32)}</div>
        <h3 data-goke="heading" style="margin:0 0 8px;">Reliable support</h3>
        <p data-goke="text" style="margin:0;color:#6b7280;font-size:.9375rem;">We stay available after your site goes live.</p>
      </div>
      <div data-goke="feature" style="background:#fff;border:1px solid #e2e8f0;border-radius:12px;padding:24px;text-align:center;">
        <div style="display:inline-flex;margin-bottom:12px;color:var(--goke-primary,#3b82f6);">${iconSvgMarkup("sparkles", 32)}</div>
        <h3 data-goke="heading" style="margin:0 0 8px;">Polished design</h3>
        <p data-goke="text" style="margin:0;color:#6b7280;font-size:.9375rem;">Clean layouts that match your brand.</p>
      </div>
    </div>
  </div>
</section>`,
    properties: [],
  },
  {
    type: "kit/pricing-2",
    name: "Pricing – 2 tiers",
    category: "Kits",
    icon: "$",
    html: `<section class="site-section" data-goke="section" data-section-name="Pricing" style="padding:64px 24px;background:#fff;">
  <div data-goke="container" style="max-width:800px;margin:0 auto;">
    <h2 data-goke="heading" style="text-align:center;font-size:2rem;margin:0 0 40px;">Simple pricing</h2>
    <div data-goke="columns" style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
      <div data-goke="pricing" style="border:1px solid #e2e8f0;border-radius:16px;padding:32px;text-align:center;">
        <h3 data-goke="heading" style="margin:0 0 8px;">Starter</h3>
        <p data-goke="text" style="font-size:2rem;font-weight:800;margin:0 0 16px;">₦25,000</p>
        <p data-goke="text" style="color:#6b7280;margin:0 0 24px;">Perfect for getting online fast.</p>
        <a data-goke="button" href="#contact" style="display:inline-block;background:#e2e8f0;color:#0f172a;padding:12px 24px;border-radius:8px;font-weight:600;text-decoration:none;">Choose</a>
      </div>
      <div data-goke="pricing" style="border:2px solid var(--goke-primary,#3b82f6);border-radius:16px;padding:32px;text-align:center;">
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
  {
    type: "kit/testimonials",
    name: "Testimonials – row",
    category: "Kits",
    icon: "❝",
    html: `<section class="site-section" data-goke="section" data-section-name="Testimonials" style="padding:64px 24px;background:#f8fafc;">
  <div data-goke="container" style="max-width:1120px;margin:0 auto;">
    <h2 data-goke="heading" style="text-align:center;font-size:2rem;margin:0 0 40px;">Loved by clients</h2>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:24px;">
      <blockquote data-goke="testimonial" style="margin:0;padding:24px;background:#fff;border-radius:12px;border:1px solid #e5e7eb;">
        <p data-goke="text" style="margin:0 0 16px;font-style:italic;color:#374151;">Professional, fast, and exactly what we needed for our brand.</p>
        <footer style="font-weight:600;">— Chioma, Founder</footer>
      </blockquote>
      <blockquote data-goke="testimonial" style="margin:0;padding:24px;background:#fff;border-radius:12px;border:1px solid #e5e7eb;">
        <p data-goke="text" style="margin:0 0 16px;font-style:italic;color:#374151;">Our Instagram finally has a proper home online.</p>
        <footer style="font-weight:600;">— Tunde, Creator</footer>
      </blockquote>
    </div>
  </div>
</section>`,
    properties: [],
  },
  {
    type: "kit/logo-strip",
    name: "Logo strip",
    category: "Kits",
    icon: "◎",
    html: `<section class="site-section" data-goke="section" data-section-name="Partners" style="padding:40px 24px;background:#fff;border-top:1px solid #f1f5f9;border-bottom:1px solid #f1f5f9;">
  <div data-goke="container" style="max-width:960px;margin:0 auto;text-align:center;">
    <p data-goke="text" style="font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;color:#94a3b8;margin:0 0 20px;">Trusted by teams at</p>
    <div style="display:flex;flex-wrap:wrap;gap:32px;justify-content:center;align-items:center;opacity:.55;font-weight:700;color:#64748b;">
      <span>Acme</span><span>Northwind</span><span>Globex</span><span>Initech</span><span>Umbrella</span>
    </div>
  </div>
</section>`,
    properties: [],
  },
  {
    type: "kit/team-3",
    name: "Team – 3 people",
    category: "Kits",
    icon: "☺",
    html: `<section class="site-section" data-goke="section" data-section-name="Team" style="padding:64px 24px;background:#fff;">
  <div data-goke="container" style="max-width:960px;margin:0 auto;">
    <h2 data-goke="heading" style="text-align:center;font-size:2rem;margin:0 0 40px;">Meet the team</h2>
    <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;text-align:center;">
      <div>
        <img src="https://i.pravatar.cc/160?img=11" alt="" style="width:96px;height:96px;border-radius:50%;object-fit:cover;margin:0 auto 12px;display:block;" />
        <h3 data-goke="heading" style="margin:0 0 4px;font-size:1.0625rem;">Ada Okafor</h3>
        <p data-goke="text" style="margin:0;color:#6b7280;font-size:.875rem;">Founder</p>
      </div>
      <div>
        <img src="https://i.pravatar.cc/160?img=12" alt="" style="width:96px;height:96px;border-radius:50%;object-fit:cover;margin:0 auto 12px;display:block;" />
        <h3 data-goke="heading" style="margin:0 0 4px;font-size:1.0625rem;">James Bello</h3>
        <p data-goke="text" style="margin:0;color:#6b7280;font-size:.875rem;">Design</p>
      </div>
      <div>
        <img src="https://i.pravatar.cc/160?img=13" alt="" style="width:96px;height:96px;border-radius:50%;object-fit:cover;margin:0 auto 12px;display:block;" />
        <h3 data-goke="heading" style="margin:0 0 4px;font-size:1.0625rem;">Sade Ibeh</h3>
        <p data-goke="text" style="margin:0;color:#6b7280;font-size:.875rem;">Growth</p>
      </div>
    </div>
  </div>
</section>`,
    properties: [],
  },
  {
    type: "kit/faq-list",
    name: "FAQ – list",
    category: "Kits",
    icon: "?",
    html: `<section class="site-section" data-goke="section" data-section-name="FAQ" style="padding:64px 24px;background:#f8fafc;">
  <div data-goke="container" style="max-width:640px;margin:0 auto;">
    <h2 data-goke="heading" style="text-align:center;font-size:2rem;margin:0 0 32px;">Questions</h2>
    <details data-goke="faq" style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:12px 16px;margin-bottom:8px;">
      <summary style="font-weight:600;cursor:pointer;">How long does setup take?</summary>
      <p data-goke="text" style="margin:12px 0 0;color:#6b7280;">Most sites are ready the same day you upload your Instagram export.</p>
    </details>
    <details data-goke="faq" style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:12px 16px;margin-bottom:8px;">
      <summary style="font-weight:600;cursor:pointer;">Can I edit after publish?</summary>
      <p data-goke="text" style="margin:12px 0 0;color:#6b7280;">Yes — open the editor anytime and save changes.</p>
    </details>
    <details data-goke="faq" style="background:#fff;border:1px solid #e5e7eb;border-radius:8px;padding:12px 16px;">
      <summary style="font-weight:600;cursor:pointer;">Do I need a developer?</summary>
      <p data-goke="text" style="margin:12px 0 0;color:#6b7280;">No. The visual editor is built for non-technical owners.</p>
    </details>
  </div>
</section>`,
    properties: [],
  },
  {
    type: "kit/cta-banner",
    name: "CTA banner",
    category: "Kits",
    icon: "→",
    html: `<section class="site-section" data-goke="section" data-section-name="CTA" style="padding:56px 24px;text-align:center;background:var(--goke-primary,#3b82f6);color:#fff;">
  <div data-goke="container" style="max-width:640px;margin:0 auto;">
    <h2 data-goke="heading" style="margin:0 0 12px;font-size:1.75rem;">Ready to go live?</h2>
    <p data-goke="text" style="opacity:.9;margin:0 0 24px;">Publish your site and share a professional link with clients.</p>
    <a data-goke="button" href="#contact" style="display:inline-block;padding:14px 28px;background:#fff;color:#0f172a;border-radius:8px;text-decoration:none;font-weight:600;">Get started</a>
  </div>
</section>`,
    properties: [],
  },
  {
    type: "kit/contact-split",
    name: "Contact – split",
    category: "Kits",
    icon: "✉",
    html: `<section class="site-section" data-goke="section" data-section-name="Contact" id="contact" style="padding:64px 24px;background:#0f172a;color:#fff;">
  <div data-goke="container" style="max-width:960px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:start;">
    <div>
      <h2 data-goke="heading" style="font-size:2rem;margin:0 0 12px;">Contact us</h2>
      <p data-goke="text" style="color:#94a3b8;margin:0 0 20px;">We reply within one business day.</p>
      <p data-goke="text" style="margin:0 0 8px;">hello@example.com</p>
      <p data-goke="text" style="margin:0;">+234 800 000 0000</p>
    </div>
    <form data-goke="form" style="display:flex;flex-direction:column;gap:12px;">
      <input data-goke="input" type="text" placeholder="Name" style="padding:12px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#fff;" />
      <input data-goke="input" type="email" placeholder="Email" style="padding:12px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#fff;" />
      <textarea data-goke="textarea" rows="4" placeholder="Message" style="padding:12px;border-radius:8px;border:1px solid #334155;background:#1e293b;color:#fff;resize:vertical;"></textarea>
      <button data-goke="button" type="submit" style="padding:12px;border:none;border-radius:8px;background:var(--goke-primary,#3b82f6);color:#fff;font-weight:600;cursor:pointer;">Send</button>
    </form>
  </div>
</section>`,
    properties: [],
  },
  {
    type: "kit/gallery-grid",
    name: "Gallery – 6 images",
    category: "Kits",
    icon: "▦",
    html: `<section class="site-section" data-goke="section" data-section-name="Gallery" style="padding:64px 24px;background:#fff;">
  <div data-goke="container" style="max-width:1120px;margin:0 auto;">
    <h2 data-goke="heading" style="text-align:center;font-size:2rem;margin:0 0 32px;">Gallery</h2>
    <div data-goke="gallery" style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
      <img data-goke="image" src="https://picsum.photos/seed/a/400/300" alt="" style="width:100%;border-radius:8px;object-fit:cover;aspect-ratio:4/3;" />
      <img data-goke="image" src="https://picsum.photos/seed/b/400/300" alt="" style="width:100%;border-radius:8px;object-fit:cover;aspect-ratio:4/3;" />
      <img data-goke="image" src="https://picsum.photos/seed/c/400/300" alt="" style="width:100%;border-radius:8px;object-fit:cover;aspect-ratio:4/3;" />
      <img data-goke="image" src="https://picsum.photos/seed/d/400/300" alt="" style="width:100%;border-radius:8px;object-fit:cover;aspect-ratio:4/3;" />
      <img data-goke="image" src="https://picsum.photos/seed/e/400/300" alt="" style="width:100%;border-radius:8px;object-fit:cover;aspect-ratio:4/3;" />
      <img data-goke="image" src="https://picsum.photos/seed/f/400/300" alt="" style="width:100%;border-radius:8px;object-fit:cover;aspect-ratio:4/3;" />
    </div>
  </div>
</section>`,
    properties: [],
  },
  {
    type: "kit/stats-bar",
    name: "Stats bar",
    category: "Kits",
    icon: "#",
    html: `<section class="site-section" data-goke="section" data-section-name="Stats" style="padding:48px 24px;background:#0f172a;color:#fff;">
  <div data-goke="container" style="max-width:900px;margin:0 auto;display:grid;grid-template-columns:repeat(4,1fr);gap:16px;text-align:center;">
    <div><div style="font-size:1.75rem;font-weight:800;color:var(--goke-primary,#3b82f6);">500+</div><div style="font-size:.8125rem;color:#94a3b8;">Projects</div></div>
    <div><div style="font-size:1.75rem;font-weight:800;color:var(--goke-primary,#3b82f6);">98%</div><div style="font-size:.8125rem;color:#94a3b8;">Happy clients</div></div>
    <div><div style="font-size:1.75rem;font-weight:800;color:var(--goke-primary,#3b82f6);">12</div><div style="font-size:.8125rem;color:#94a3b8;">Years</div></div>
    <div><div style="font-size:1.75rem;font-weight:800;color:var(--goke-primary,#3b82f6);">24/7</div><div style="font-size:.8125rem;color:#94a3b8;">Support</div></div>
  </div>
</section>`,
    properties: [],
  },
];

registry.registerMany(kits);
export default kits;
