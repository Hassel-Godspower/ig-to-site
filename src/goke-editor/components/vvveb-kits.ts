/**
 * VvvebJs-inspired section kits for gòke
 * Source patterns: https://github.com/givanz/VvvebJs (Apache-2.0)
 * Adapted: no Bootstrap dependency — inline CSS + data-goke for the live editor.
 * Category: "Kits" (same as section-kits — palette merges by category)
 */

import { registry } from "../core/registry";
import type { ComponentDefinition } from "../types";

const img = (seed: string, w = 800) =>
  `https://images.unsplash.com/${seed}?auto=format&fit=crop&w=${w}&q=80`;

const kits: ComponentDefinition[] = [
  // ── Hero / CTA (Elementor-style) ───────────────────────────
  {
    type: "kit/vv-hero-split",
    name: "Hero – Split (Vvveb)",
    category: "Kits",
    icon: "▣",
    html: `<section class="site-section" data-goke="section" data-section-name="Hero" style="padding:0;background:var(--goke-bg,#fff);">
  <div data-goke="container" style="max-width:1120px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:0;align-items:stretch;min-height:480px;">
    <div style="padding:64px 40px;display:flex;flex-direction:column;justify-content:center;">
      <p data-goke="text" style="text-transform:uppercase;letter-spacing:0.08em;font-size:0.75rem;color:var(--goke-primary,#3b82f6);margin:0 0 12px;font-weight:600;">Welcome</p>
      <h1 data-goke="heading" style="font-size:2.75rem;font-weight:800;line-height:1.15;margin:0 0 16px;color:var(--goke-text,#0f172a);">Headline that sells the outcome</h1>
      <p data-goke="text" style="font-size:1.125rem;color:var(--goke-muted,#64748b);margin:0 0 28px;max-width:36ch;">Supporting line drawn from your Instagram story — clear, specific, local.</p>
      <div style="display:flex;flex-wrap:wrap;gap:12px;">
        <a data-goke="button" href="#contact" style="display:inline-block;background:var(--goke-primary,#3b82f6);color:#fff;padding:14px 28px;border-radius:10px;font-weight:600;text-decoration:none;">Get started</a>
        <a data-goke="button" href="#about" style="display:inline-block;background:transparent;color:var(--goke-text,#0f172a);padding:14px 28px;border-radius:10px;font-weight:600;text-decoration:none;border:1px solid #e2e8f0;">Learn more</a>
      </div>
    </div>
    <div style="min-height:320px;background:#e2e8f0;">
      <img data-goke="image" src="${img("photo-1600880292203-757bb62b4baf")}" alt="Hero" style="width:100%;height:100%;object-fit:cover;display:block;"/>
    </div>
  </div>
</section>`,
    properties: [],
  },
  {
    type: "kit/cta-band",
    name: "CTA – Full band",
    category: "Kits",
    icon: "▶",
    html: `<section class="site-section" data-goke="section" data-section-name="CTA" style="padding:56px 24px;background:var(--goke-primary,#3b82f6);color:#fff;text-align:center;">
  <div data-goke="container" style="max-width:720px;margin:0 auto;">
    <h2 data-goke="heading" style="font-size:1.75rem;font-weight:800;margin:0 0 12px;">Ready to take the next step?</h2>
    <p data-goke="text" style="margin:0 0 24px;opacity:0.92;">Message us on WhatsApp — we respond fast.</p>
    <a data-goke="button" href="#contact" style="display:inline-block;background:#fff;color:var(--goke-primary,#3b82f6);padding:14px 28px;border-radius:10px;font-weight:700;text-decoration:none;">Contact us</a>
  </div>
</section>`,
    properties: [],
  },

  // ── Team (from Vvveb about-team pattern) ───────────────────
  {
    type: "kit/team-4",
    name: "Team – 4 cards",
    category: "Kits",
    icon: "👥",
    html: `<section class="site-section" data-goke="section" data-section-name="Team" style="padding:64px 24px;background:#f8fafc;">
  <div data-goke="container" style="max-width:1120px;margin:0 auto;">
    <h2 data-goke="heading" style="text-align:center;font-size:2rem;font-weight:800;margin:0 0 40px;color:var(--goke-text,#0f172a);">Meet the team</h2>
    <div data-goke="columns" style="display:grid;grid-template-columns:repeat(4,1fr);gap:20px;">
      <div data-goke="container" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(15,23,42,0.06);text-align:center;">
        <img data-goke="image" src="${img("photo-1507591064344-4c6ce005b128", 400)}" alt="Team" style="width:100%;height:200px;object-fit:cover;display:block;"/>
        <div style="padding:20px;">
          <h3 data-goke="heading" style="margin:0 0 4px;font-size:1.05rem;">Ada Okonkwo</h3>
          <p data-goke="text" style="margin:0;color:#64748b;font-size:0.875rem;">Founder</p>
        </div>
      </div>
      <div data-goke="container" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(15,23,42,0.06);text-align:center;">
        <img data-goke="image" src="${img("photo-1487412720507-e7ab37603c6f", 400)}" alt="Team" style="width:100%;height:200px;object-fit:cover;display:block;"/>
        <div style="padding:20px;">
          <h3 data-goke="heading" style="margin:0 0 4px;font-size:1.05rem;">Chidi Bello</h3>
          <p data-goke="text" style="margin:0;color:#64748b;font-size:0.875rem;">Operations</p>
        </div>
      </div>
      <div data-goke="container" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(15,23,42,0.06);text-align:center;">
        <img data-goke="image" src="${img("photo-1522536421511-14c9073df899", 400)}" alt="Team" style="width:100%;height:200px;object-fit:cover;display:block;"/>
        <div style="padding:20px;">
          <h3 data-goke="heading" style="margin:0 0 4px;font-size:1.05rem;">Tolu Adeyemi</h3>
          <p data-goke="text" style="margin:0;color:#64748b;font-size:0.875rem;">Creative</p>
        </div>
      </div>
      <div data-goke="container" style="background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 20px rgba(15,23,42,0.06);text-align:center;">
        <img data-goke="image" src="${img("photo-1477118476589-bff2c5c4cfbb", 400)}" alt="Team" style="width:100%;height:200px;object-fit:cover;display:block;"/>
        <div style="padding:20px;">
          <h3 data-goke="heading" style="margin:0 0 4px;font-size:1.05rem;">Ngozi Eze</h3>
          <p data-goke="text" style="margin:0;color:#64748b;font-size:0.875rem;">Client success</p>
        </div>
      </div>
    </div>
  </div>
</section>`,
    properties: [],
  },

  // ── Portfolio grids (Vvveb portfolio patterns) ──────────────
  {
    type: "kit/portfolio-3",
    name: "Portfolio – 3 columns",
    category: "Kits",
    icon: "▦",
    html: `<section class="site-section" data-goke="section" data-section-name="Portfolio" style="padding:64px 24px;background:var(--goke-bg,#fff);">
  <div data-goke="container" style="max-width:1120px;margin:0 auto;">
    <h2 data-goke="heading" style="text-align:center;font-size:2rem;font-weight:800;margin:0 0 12px;">Selected work</h2>
    <p data-goke="text" style="text-align:center;color:#64748b;margin:0 0 40px;">Projects and results from the feed — structured for the web.</p>
    <div data-goke="columns" style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
      <article data-goke="container" style="border-radius:14px;overflow:hidden;border:1px solid #e2e8f0;">
        <img data-goke="image" src="${img("photo-1497366216548-37526070297c")}" alt="Project" style="width:100%;height:200px;object-fit:cover;display:block;"/>
        <div style="padding:16px;">
          <h3 data-goke="heading" style="margin:0 0 8px;font-size:1.1rem;">Project title</h3>
          <p data-goke="text" style="margin:0;color:#64748b;font-size:0.9rem;">Short caption from Instagram.</p>
        </div>
      </article>
      <article data-goke="container" style="border-radius:14px;overflow:hidden;border:1px solid #e2e8f0;">
        <img data-goke="image" src="${img("photo-1497366754035-f200968a6e72")}" alt="Project" style="width:100%;height:200px;object-fit:cover;display:block;"/>
        <div style="padding:16px;">
          <h3 data-goke="heading" style="margin:0 0 8px;font-size:1.1rem;">Project title</h3>
          <p data-goke="text" style="margin:0;color:#64748b;font-size:0.9rem;">Short caption from Instagram.</p>
        </div>
      </article>
      <article data-goke="container" style="border-radius:14px;overflow:hidden;border:1px solid #e2e8f0;">
        <img data-goke="image" src="${img("photo-1486312338219-ce68d2c6f44d")}" alt="Project" style="width:100%;height:200px;object-fit:cover;display:block;"/>
        <div style="padding:16px;">
          <h3 data-goke="heading" style="margin:0 0 8px;font-size:1.1rem;">Project title</h3>
          <p data-goke="text" style="margin:0;color:#64748b;font-size:0.9rem;">Short caption from Instagram.</p>
        </div>
      </article>
    </div>
  </div>
</section>`,
    properties: [],
  },
  {
    type: "kit/gallery-4",
    name: "Gallery – 4 grid",
    category: "Kits",
    icon: "🖼",
    html: `<section class="site-section" data-goke="section" data-section-name="Gallery" style="padding:64px 24px;background:#0f172a;">
  <div data-goke="container" style="max-width:1120px;margin:0 auto;">
    <h2 data-goke="heading" style="text-align:center;color:#fff;font-size:2rem;margin:0 0 32px;">Gallery</h2>
    <div data-goke="columns" style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;">
      <img data-goke="image" src="${img("photo-1517248135467-4c7edcad34c4", 500)}" alt="Gallery" style="width:100%;height:180px;object-fit:cover;border-radius:10px;display:block;"/>
      <img data-goke="image" src="${img("photo-1414235077428-338989a2e8c0", 500)}" alt="Gallery" style="width:100%;height:180px;object-fit:cover;border-radius:10px;display:block;"/>
      <img data-goke="image" src="${img("photo-1556910103-1c02745aae4d", 500)}" alt="Gallery" style="width:100%;height:180px;object-fit:cover;border-radius:10px;display:block;"/>
      <img data-goke="image" src="${img("photo-1478144592103-25e218a04891", 500)}" alt="Gallery" style="width:100%;height:180px;object-fit:cover;border-radius:10px;display:block;"/>
    </div>
  </div>
</section>`,
    properties: [],
  },

  // ── Pricing (Elementor pricing table) ──────────────────────
  {
    type: "kit/pricing-3",
    name: "Pricing – 3 tiers",
    category: "Kits",
    icon: "₦",
    html: `<section class="site-section" data-goke="section" data-section-name="Pricing" style="padding:64px 24px;background:#f8fafc;">
  <div data-goke="container" style="max-width:1120px;margin:0 auto;">
    <h2 data-goke="heading" style="text-align:center;font-size:2rem;margin:0 0 40px;">Simple pricing</h2>
    <div data-goke="columns" style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">
      <div data-goke="container" style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:28px;text-align:center;">
        <h3 data-goke="heading" style="margin:0 0 8px;">Starter</h3>
        <p data-goke="text" style="font-size:2rem;font-weight:800;margin:0 0 16px;">₦25,000</p>
        <p data-goke="text" style="color:#64748b;margin:0 0 20px;">Essential package.</p>
        <a data-goke="button" href="#contact" style="display:inline-block;background:#e2e8f0;color:#0f172a;padding:12px 24px;border-radius:8px;font-weight:600;text-decoration:none;">Choose</a>
      </div>
      <div data-goke="container" style="background:#fff;border:2px solid var(--goke-primary,#3b82f6);border-radius:16px;padding:28px;text-align:center;transform:scale(1.02);">
        <h3 data-goke="heading" style="margin:0 0 8px;">Pro</h3>
        <p data-goke="text" style="font-size:2rem;font-weight:800;margin:0 0 16px;">₦75,000</p>
        <p data-goke="text" style="color:#64748b;margin:0 0 20px;">Most popular.</p>
        <a data-goke="button" href="#contact" style="display:inline-block;background:var(--goke-primary,#3b82f6);color:#fff;padding:12px 24px;border-radius:8px;font-weight:600;text-decoration:none;">Choose</a>
      </div>
      <div data-goke="container" style="background:#fff;border:1px solid #e2e8f0;border-radius:16px;padding:28px;text-align:center;">
        <h3 data-goke="heading" style="margin:0 0 8px;">Business</h3>
        <p data-goke="text" style="font-size:2rem;font-weight:800;margin:0 0 16px;">₦150,000</p>
        <p data-goke="text" style="color:#64748b;margin:0 0 20px;">Full support.</p>
        <a data-goke="button" href="#contact" style="display:inline-block;background:#e2e8f0;color:#0f172a;padding:12px 24px;border-radius:8px;font-weight:600;text-decoration:none;">Choose</a>
      </div>
    </div>
  </div>
</section>`,
    properties: [],
  },

  // ── Testimonials ───────────────────────────────────────────
  {
    type: "kit/testimonials-3",
    name: "Testimonials – 3",
    category: "Kits",
    icon: "★",
    html: `<section class="site-section" data-goke="section" data-section-name="Testimonials" style="padding:64px 24px;background:var(--goke-bg,#fff);">
  <div data-goke="container" style="max-width:1120px;margin:0 auto;">
    <h2 data-goke="heading" style="text-align:center;font-size:2rem;margin:0 0 40px;">What clients say</h2>
    <div data-goke="columns" style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">
      <blockquote data-goke="container" style="margin:0;padding:24px;background:#f8fafc;border-radius:14px;border-left:4px solid var(--goke-primary,#3b82f6);">
        <p data-goke="text" style="margin:0 0 16px;color:#334155;font-style:italic;">“Outstanding service — booked again within a week.”</p>
        <footer data-goke="text" style="font-weight:600;color:#0f172a;">— Amaka, Lagos</footer>
      </blockquote>
      <blockquote data-goke="container" style="margin:0;padding:24px;background:#f8fafc;border-radius:14px;border-left:4px solid var(--goke-primary,#3b82f6);">
        <p data-goke="text" style="margin:0 0 16px;color:#334155;font-style:italic;">“Professional, on time, and worth every naira.”</p>
        <footer data-goke="text" style="font-weight:600;color:#0f172a;">— Emeka, Abuja</footer>
      </blockquote>
      <blockquote data-goke="container" style="margin:0;padding:24px;background:#f8fafc;border-radius:14px;border-left:4px solid var(--goke-primary,#3b82f6);">
        <p data-goke="text" style="margin:0 0 16px;color:#334155;font-style:italic;">“Finally a brand that shows up the way they post.”</p>
        <footer data-goke="text" style="font-weight:600;color:#0f172a;">— Zainab, PH</footer>
      </blockquote>
    </div>
  </div>
</section>`,
    properties: [],
  },

  // ── FAQ accordion ──────────────────────────────────────────
  {
    type: "kit/vv-faq-list",
    name: "FAQ – Accordion (Vvveb)",
    category: "Kits",
    icon: "?",
    html: `<section class="site-section" data-goke="section" data-section-name="FAQ" style="padding:64px 24px;background:#f8fafc;">
  <div data-goke="container" style="max-width:720px;margin:0 auto;">
    <h2 data-goke="heading" style="text-align:center;font-size:2rem;margin:0 0 32px;">Questions</h2>
    <details data-goke="faq" style="border:1px solid #e2e8f0;border-radius:10px;padding:14px 18px;margin-bottom:10px;background:#fff;">
      <summary data-goke="heading" style="font-weight:600;cursor:pointer;">How do I book?</summary>
      <p data-goke="text" style="margin:12px 0 0;color:#64748b;">Message us on WhatsApp or use the contact form — we confirm within hours.</p>
    </details>
    <details data-goke="faq" style="border:1px solid #e2e8f0;border-radius:10px;padding:14px 18px;margin-bottom:10px;background:#fff;">
      <summary data-goke="heading" style="font-weight:600;cursor:pointer;">Where are you located?</summary>
      <p data-goke="text" style="margin:12px 0 0;color:#64748b;">We serve clients across Lagos and by arrangement in other cities.</p>
    </details>
    <details data-goke="faq" style="border:1px solid #e2e8f0;border-radius:10px;padding:14px 18px;margin-bottom:10px;background:#fff;">
      <summary data-goke="heading" style="font-weight:600;cursor:pointer;">What are your rates?</summary>
      <p data-goke="text" style="margin:12px 0 0;color:#64748b;">See pricing above or ask for a custom quote.</p>
    </details>
  </div>
</section>`,
    properties: [],
  },

  // ── Features / icon boxes ──────────────────────────────────
  {
    type: "kit/features-3",
    name: "Features – 3 icon boxes",
    category: "Kits",
    icon: "✦",
    html: `<section class="site-section" data-goke="section" data-section-name="Features" style="padding:64px 24px;background:var(--goke-bg,#fff);">
  <div data-goke="container" style="max-width:1120px;margin:0 auto;">
    <h2 data-goke="heading" style="text-align:center;font-size:2rem;margin:0 0 40px;">Why choose us</h2>
    <div data-goke="columns" style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
      <div data-goke="container" style="text-align:center;padding:24px;">
        <div style="width:56px;height:56px;margin:0 auto 16px;border-radius:14px;background:rgba(59,130,246,0.12);display:flex;align-items:center;justify-content:center;font-size:1.5rem;color:var(--goke-primary,#3b82f6);">★</div>
        <h3 data-goke="heading" style="margin:0 0 8px;">Quality</h3>
        <p data-goke="text" style="margin:0;color:#64748b;">Consistent results your clients notice.</p>
      </div>
      <div data-goke="container" style="text-align:center;padding:24px;">
        <div style="width:56px;height:56px;margin:0 auto 16px;border-radius:14px;background:rgba(59,130,246,0.12);display:flex;align-items:center;justify-content:center;font-size:1.5rem;color:var(--goke-primary,#3b82f6);">⏱</div>
        <h3 data-goke="heading" style="margin:0 0 8px;">On time</h3>
        <p data-goke="text" style="margin:0;color:#64748b;">Respect for your schedule.</p>
      </div>
      <div data-goke="container" style="text-align:center;padding:24px;">
        <div style="width:56px;height:56px;margin:0 auto 16px;border-radius:14px;background:rgba(59,130,246,0.12);display:flex;align-items:center;justify-content:center;font-size:1.5rem;color:var(--goke-primary,#3b82f6);">♥</div>
        <h3 data-goke="heading" style="margin:0 0 8px;">Care</h3>
        <p data-goke="text" style="margin:0;color:#64748b;">Support before and after.</p>
      </div>
    </div>
  </div>
</section>`,
    properties: [],
  },

  // ── Contact + map placeholder ──────────────────────────────
  {
    type: "kit/contact-map",
    name: "Contact + map",
    category: "Kits",
    icon: "📍",
    html: `<section class="site-section" data-goke="section" data-section-name="Contact" id="contact" style="padding:64px 24px;background:#f8fafc;">
  <div data-goke="container" style="max-width:1120px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:32px;align-items:start;">
    <div>
      <h2 data-goke="heading" style="font-size:1.75rem;margin:0 0 12px;">Visit or message us</h2>
      <p data-goke="text" style="color:#64748b;margin:0 0 20px;">Lagos · Nigeria</p>
      <p data-goke="text" style="margin:0 0 8px;"><strong>Phone:</strong> +234 800 000 0000</p>
      <p data-goke="text" style="margin:0 0 20px;"><strong>Email:</strong> hello@example.com</p>
      <a data-goke="button" href="https://wa.me/2348000000000" style="display:inline-block;background:#25D366;color:#fff;padding:12px 24px;border-radius:10px;font-weight:600;text-decoration:none;">WhatsApp</a>
    </div>
    <div data-goke="container" style="border-radius:14px;overflow:hidden;min-height:280px;background:#e2e8f0;">
      <iframe data-goke="embed" title="Map" src="https://www.openstreetmap.org/export/embed.html?bbox=3.3%2C6.4%2C3.5%2C6.6&amp;layer=mapnik" style="border:0;width:100%;height:280px;" loading="lazy"></iframe>
    </div>
  </div>
</section>`,
    properties: [],
  },

  // ── Logo strip / trust ─────────────────────────────────────
  {
    type: "kit/vv-logo-strip",
    name: "Logo strip (Vvveb)",
    category: "Kits",
    icon: "▣",
    html: `<section class="site-section" data-goke="section" data-section-name="Clients" style="padding:40px 24px;background:#fff;border-top:1px solid #f1f5f9;border-bottom:1px solid #f1f5f9;">
  <div data-goke="container" style="max-width:960px;margin:0 auto;text-align:center;">
    <p data-goke="text" style="font-size:0.75rem;text-transform:uppercase;letter-spacing:0.1em;color:#94a3b8;margin:0 0 20px;">Trusted by teams like</p>
    <div style="display:flex;flex-wrap:wrap;gap:28px;justify-content:center;align-items:center;opacity:0.7;">
      <span data-goke="text" style="font-weight:700;color:#64748b;">Brand A</span>
      <span data-goke="text" style="font-weight:700;color:#64748b;">Brand B</span>
      <span data-goke="text" style="font-weight:700;color:#64748b;">Brand C</span>
      <span data-goke="text" style="font-weight:700;color:#64748b;">Brand D</span>
    </div>
  </div>
</section>`,
    properties: [],
  },
];

registry.registerMany(kits);
export default kits;
