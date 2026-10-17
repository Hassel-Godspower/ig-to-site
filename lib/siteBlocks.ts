/**
 * Deterministic HTML fragments for each block id.
 * Content is injected; structure is fixed per block — quality stays stable.
 */

import type { ShellContent } from "./premiumShell";
import type { CatalogItem } from "./extractCatalog";
import type { HeroBlockId, SectionBlockId, SitePlan } from "./sitePlan";

const E = (s: string) =>
  String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function servicesBento(c: ShellContent): string {
  return c.services
    .slice(0, 4)
    .map(
      (s, i) =>
        `<article class="bento-card reveal${i === 0 ? " tall" : ""}" data-goke="container"><img src="${E(s.image)}" alt="${E(s.title)}" loading="lazy" data-goke="image"/><div class="body"><span class="tag" data-goke="text">${E(s.tag)}</span><h3 data-goke="heading">${E(s.title)}</h3><p data-goke="text">${E(s.body)}</p><a href="services.html" class="btn btn-ghost btn-sm" data-goke="button">Explore</a></div></article>`
    )
    .join("");
}

function servicesGrid(c: ShellContent): string {
  return c.services
    .slice(0, 6)
    .map(
      (s) =>
        `<article class="svc-card reveal" data-goke="container"><img src="${E(s.image)}" alt="${E(s.title)}" loading="lazy" data-goke="image"/><div class="body"><p class="tag" data-goke="text">${E(s.tag)}</p><h3 data-goke="heading">${E(s.title)}</h3><p data-goke="text">${E(s.body)}</p></div></article>`
    )
    .join("");
}

function servicesList(c: ShellContent): string {
  return c.services
    .slice(0, 6)
    .map(
      (s) =>
        `<article data-goke="container"><span class="tag" data-goke="text">${E(s.tag)}</span><div><h3 data-goke="heading">${E(s.title)}</h3><p data-goke="text">${E(s.body)}</p></div><a href="contact.html" class="btn btn-ghost btn-sm" data-goke="button">${E(c.primaryCta)}</a></article>`
    )
    .join("");
}

function metricsHtml(c: ShellContent): string {
  return c.metrics
    .slice(0, 4)
    .map(
      (m) =>
        `<div class="num-card" data-goke="container"><strong data-goke="text">${E(m.value)}</strong><span data-goke="text">${E(m.label)}</span></div>`
    )
    .join("");
}

function mosaicHtml(c: ShellContent): string {
  return c.gallery
    .slice(0, 6)
    .map(
      (g) =>
        `<figure data-goke="container"><img src="${E(g.src)}" alt="${E(g.alt)}" loading="lazy" data-goke="image"/></figure>`
    )
    .join("");
}

function quotesHtml(c: ShellContent): string {
  return c.quotes
    .slice(0, 2)
    .map(
      (q) =>
        `<blockquote class="quote reveal" data-goke="container"><p data-goke="text">${E(q.text)}</p><footer data-goke="text">— <strong>${E(q.author)}</strong></footer></blockquote>`
    )
    .join("");
}

function aboutPs(c: ShellContent): string {
  return c.aboutParagraphs.map((p) => `<p data-goke="text">${E(p)}</p>`).join("");
}
function aboutLi(c: ShellContent): string {
  return c.aboutList.map((x) => `<li data-goke="text">${E(x)}</li>`).join("");
}

export function renderHero(hero: HeroBlockId, c: ShellContent): string {
  const heroImg = c.gallery[0]?.src || c.aboutImage || "";

  if (hero === "hero_fullbleed") {
    return `
<section class="hero-bleed site-section" data-goke="section" data-section-name="hero">
  <div class="hero-media"><img src="${E(heroImg)}" alt="${E(c.brand)}" width="1800" height="1100" data-goke="image"/><div class="hero-overlay"></div></div>
  <div class="hero-content">
    <p class="eyebrow" data-goke="text">${E(c.kicker)}</p>
    <h1 id="hero-headline" data-goke="heading">${E(c.headlineLine1)}<br/>${E(c.headlineLine2)}</h1>
    <p class="hero-lead" data-goke="text">${E(c.lead)}</p>
    <div class="hero-actions">
      <a href="contact.html" class="btn btn-primary" id="cta-button" data-goke="button">${E(c.primaryCta)}</a>
      <a href="services.html" class="btn btn-outline" data-goke="button">${E(c.secondaryCta)}</a>
    </div>
  </div>
</section>`;
  }

  if (hero === "hero_authority") {
    return `
<section class="hero-authority site-section" data-goke="section" data-section-name="hero">
  <div class="hero-authority-grid">
    <div>
      <p class="eyebrow" data-goke="text">${E(c.kicker)}</p>
      <h1 id="hero-headline" data-goke="heading">${E(c.headlineLine1)} <span style="color:var(--accent)">${E(c.headlineLine2)}</span></h1>
      <p class="hero-lead" data-goke="text">${E(c.lead)}</p>
      <div class="hero-actions">
        <a href="contact.html" class="btn btn-primary" id="cta-button" data-goke="button">${E(c.primaryCta)}</a>
        <a href="services.html" class="btn btn-ghost" data-goke="button">${E(c.secondaryCta)}</a>
      </div>
    </div>
    <div class="split-media"><img src="${E(heroImg)}" alt="${E(c.brand)}" data-goke="image"/></div>
  </div>
</section>`;
  }

  if (hero === "hero_minimal") {
    return `
<section class="hero-authority site-section" data-goke="section" data-section-name="hero">
  <p class="eyebrow" data-goke="text">${E(c.kicker)}</p>
  <h1 id="hero-headline" data-goke="heading" style="max-width:18ch;font-size:clamp(2.8rem,8vw,5rem)">${E(c.headlineLine1)} ${E(c.headlineLine2)}</h1>
  <p class="hero-lead" data-goke="text">${E(c.lead)}</p>
  <div class="hero-actions">
    <a href="contact.html" class="btn btn-primary" id="cta-button" data-goke="button">${E(c.primaryCta)}</a>
    <a href="services.html" class="btn btn-ghost" data-goke="button">${E(c.secondaryCta)}</a>
  </div>
</section>`;
  }

  // hero_asymmetric (default performance)
  return `
<section class="hero site-section" data-goke="section" data-section-name="hero">
  <div class="hero-visual"><img src="${E(heroImg)}" alt="${E(c.brand)}" width="1800" height="1200" data-goke="image"/></div>
  <div class="hero-body">
    <p class="hero-kicker" data-goke="text">${E(c.kicker)}</p>
    <h1 id="hero-headline" data-goke="heading">${E(c.headlineLine1)} <span class="line2">${E(c.headlineLine2)}</span></h1>
    <p class="hero-lead" data-goke="text">${E(c.lead)}</p>
    <div class="hero-actions">
      <a href="contact.html" class="btn btn-primary" id="cta-button" data-goke="button">${E(c.primaryCta)}</a>
      <a href="services.html" class="btn btn-ghost" data-goke="button">${E(c.secondaryCta)}</a>
    </div>
    <div class="hero-metrics" data-goke="container">${c.metrics
      .slice(0, 3)
      .map(
        (m) =>
          `<div><strong data-goke="text">${E(m.value)}</strong><span data-goke="text">${E(m.label)}</span></div>`
      )
      .join("")}</div>
  </div>
</section>`;
}

export function renderSection(id: SectionBlockId, c: ShellContent): string {
  const heroImg2 = c.gallery[1]?.src || c.aboutImage || c.gallery[0]?.src || "";

  switch (id) {
    case "marquee": {
      const marquee = [...c.marquee, ...c.marquee]
        .map((x, i) => `<span>${i % 2 ? `<em>${E(x)}</em>` : E(x)}</span>`)
        .join("");
      return `<div class="marquee-wrap" aria-hidden="true"><div class="marquee">${marquee}</div></div>`;
    }
    case "services_bento":
      return `<section class="section site-section reveal" data-goke="section" data-section-name="services"><div class="section-inner"><p class="section-label" data-goke="text">Paths</p><h2 class="section-title" data-goke="heading">Choose how you work with us</h2><p class="section-copy" data-goke="text">${E(c.lead)}</p><div class="bento">${servicesBento(c)}</div></div></section>`;
    case "services_grid":
      return `<section class="section site-section reveal" data-goke="section" data-section-name="services"><div class="section-inner"><p class="section-label" data-goke="text">Offerings</p><h2 class="section-title" data-goke="heading">What we offer</h2><div class="svc-grid">${servicesGrid(c)}</div></div></section>`;
    case "services_list":
      return `<section class="section site-section reveal" data-goke="section" data-section-name="services" style="background:var(--ink-2);border-block:1px solid var(--line)"><div class="section-inner"><p class="section-label" data-goke="text">Practice</p><h2 class="section-title" data-goke="heading">How we work with you</h2><div class="svc-list">${servicesList(c)}</div></div></section>`;
    case "offerings_editorial":
      return `<section class="section site-section reveal" data-goke="section" data-section-name="services"><div class="section-inner"><p class="section-label" data-goke="text">Offerings</p><h2 class="section-title" data-goke="heading">Signature experiences</h2><p class="section-copy" data-goke="text">${E(c.lead)}</p><div class="svc-grid">${servicesGrid(c)}</div><p style="margin-top:2rem;text-align:center"><a href="services.html" class="btn btn-ghost" data-goke="button">View all</a></p></div></section>`;
    case "about_split":
      return `<section class="section site-section reveal" data-goke="section" data-section-name="about"><div class="section-inner split"><div class="split-media"><img src="${E(c.aboutImage || heroImg2)}" alt="" data-goke="image"/></div><div class="split-copy"><p class="section-label" data-goke="text">Our story</p><h2 class="section-title" data-goke="heading">${E(c.aboutTitle)}</h2>${aboutPs(c)}<ul class="list-check">${aboutLi(c)}</ul><a href="about.html" class="btn btn-primary" style="margin-top:1rem" data-goke="button">About ${E(c.brand)}</a></div></div></section>`;
    case "metrics_row":
      return `<section class="section site-section reveal" data-goke="section" data-section-name="metrics" style="background:var(--ink-2);border-block:1px solid var(--line)"><div class="section-inner"><div class="numbers">${metricsHtml(c)}</div></div></section>`;
    case "gallery_mosaic":
      return `<section class="section site-section reveal" data-goke="section" data-section-name="gallery"><div class="section-inner"><p class="section-label" data-goke="text">Atmosphere</p><h2 class="section-title" data-goke="heading">A visual journal</h2><div class="mosaic">${mosaicHtml(c)}</div><p style="margin-top:1.5rem;text-align:center"><a href="gallery.html" class="btn btn-ghost" data-goke="button">Full gallery</a></p></div></section>`;
    case "quotes": {
      const q = quotesHtml(c);
      if (!q) return "";
      return `<section class="section site-section reveal" data-goke="section" data-section-name="quotes"><div class="section-inner"><div class="quotes">${q}</div></div></section>`;
    }
    case "cta_band":
      return `<section class="cta-band site-section reveal" data-goke="section" data-section-name="cta-band"><h2 data-goke="heading">${E(c.ctaTitle)}</h2><p data-goke="text">${E(c.ctaBody)}</p><a href="contact.html" class="btn btn-primary" data-goke="button">${E(c.primaryCta)}</a></section>`;
    case "cta_panel":
      return `<section class="section site-section reveal" data-goke="section" data-section-name="cta"><div class="section-inner"><div class="cta-panel"><h2 data-goke="heading">${E(c.ctaTitle)}</h2><p data-goke="text">${E(c.ctaBody)}</p><a href="contact.html" class="btn btn-primary" data-goke="button">${E(c.primaryCta)}</a></div></div></section>`;
    default:
      return "";
  }
}

/** Assemble home <main> from plan */
export function assembleHomeMain(plan: SitePlan, c: ShellContent): string {
  const parts: string[] = [renderHero(plan.hero, c)];
  for (const sid of plan.sections) {
    const html = renderSection(sid, c);
    if (html) parts.push(html);
  }
  if (c.products?.length && c.shoppable) {
    const feat = assembleHomeProductsSection(c);
    if (feat) {
      const ctaIdx = parts.findIndex(
        (p) => p.includes('data-section-name="cta') || p.includes("cta-band") || p.includes("cta-panel")
      );
      if (ctaIdx > 0) parts.splice(ctaIdx, 0, feat);
      else parts.push(feat);
    }
  }
  return parts.join("\n");
}


export function assembleServicesBody(plan: SitePlan, c: ShellContent): string {
  if (plan.cardStyle === "list" || plan.hero === "hero_authority") {
    return `<section class="section"><div class="section-inner"><div class="svc-list">${c.services
      .slice(0, 6)
      .map(
        (s) =>
          `<article data-goke="container"><span class="tag" data-goke="text">${E(s.tag)}</span><div><h3 data-goke="heading">${E(s.title)}</h3><p data-goke="text">${E(s.body)}</p></div><a href="contact.html" class="btn btn-ghost btn-sm" data-goke="button">${E(c.primaryCta)}</a></article>`
      )
      .join("")}</div><p style="margin-top:2rem;text-align:center"><a href="contact.html" class="btn btn-primary" data-goke="button">${E(c.primaryCta)}</a></p></div></section>`;
  }
  if (plan.cardStyle === "bento") {
    return `<section class="section"><div class="section-inner"><div class="bento">${c.services
      .slice(0, 4)
      .map(
        (s, i) =>
          `<article class="bento-card reveal${i === 0 ? " tall" : ""}" data-goke="container"><img src="${E(s.image)}" alt="${E(s.title)}" loading="lazy" data-goke="image"/><div class="body"><span class="tag" data-goke="text">${E(s.tag)}</span><h3 data-goke="heading">${E(s.title)}</h3><p data-goke="text">${E(s.body)}</p></div></article>`
      )
      .join("")}</div><p style="margin-top:2rem;text-align:center"><a href="contact.html" class="btn btn-primary" data-goke="button">${E(c.primaryCta)}</a></p></div></section>`;
  }
  return `<section class="section"><div class="section-inner"><div class="svc-grid">${c.services
    .slice(0, 6)
    .map(
      (s) =>
        `<article class="svc-card reveal" data-goke="container"><img src="${E(s.image)}" alt="${E(s.title)}" loading="lazy" data-goke="image"/><div class="body"><p class="tag" data-goke="text">${E(s.tag)}</p><h3 data-goke="heading">${E(s.title)}</h3><p data-goke="text">${E(s.body)}</p></div></article>`
    )
    .join("")}</div><p style="margin-top:2rem;text-align:center"><a href="contact.html" class="btn btn-primary" data-goke="button">${E(c.primaryCta)}</a></p></div></section>`;
}

export function productsGridHtml(items: CatalogItem[], addLabel: string): string {
  if (!items?.length) return "";
  return items
    .slice(0, 12)
    .map((p) => {
      const priceAttr = p.price != null && p.price > 0 ? String(p.price) : "0";
      const priceShow = E(p.priceLabel || "Talk on WhatsApp");
      return `<article class="svc-card goke-product-card reveal" data-goke="container" data-product-id="${E(p.id)}" data-product-name="${E(p.name)}" data-product-price="${E(priceAttr)}">
  <img src="${E(p.image)}" alt="${E(p.name)}" loading="lazy" data-goke="image"/>
  <div class="body">
    <h3 class="goke-product-name" data-goke="heading">${E(p.name)}</h3>
    <p data-goke="text">${E(p.description)}</p>
    <p class="tag" data-goke="text">${priceShow}</p>
    <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:12px">
      <button type="button" class="btn btn-primary btn-sm goke-add-cart" data-label="${E(addLabel)}" data-goke="button">${E(addLabel)}</button>
    </div>
  </div>
</article>`;
    })
    .join("");
}

export function assembleListingBody(c: ShellContent, listingTitle = "Shop"): string {
  const items = c.products?.length ? c.products : [];
  const addLabel = c.cartAddLabel || "Add to cart";
  const checkoutLabel = c.cartCheckoutLabel || "Checkout on WhatsApp";
  const grid = productsGridHtml(items, addLabel);
  if (!grid) return assembleServicesBody(c.plan, c);
  return `<section class="section" data-goke="section" data-section-name="listing"><div class="section-inner"><p class="section-label" data-goke="text">${E(listingTitle)}</p><h2 class="section-title" data-goke="heading">${E(listingTitle)}</h2><div class="svc-grid goke-product-grid">${grid}</div><div class="cta-panel" style="margin-top:2rem;text-align:center"><p class="goke-cart-empty" data-goke="text" style="color:var(--muted)">Your list is empty — add items above.</p><p class="goke-cart-full" style="display:none;margin-bottom:12px"><span class="goke-cart-count">0</span> selected · <strong class="goke-cart-total">₦0</strong></p><button type="button" class="btn btn-primary goke-cart-checkout" data-goke="button">${E(checkoutLabel)}</button></div></div></section>`;
}

export function assembleHomeProductsSection(c: ShellContent): string {
  const items = (c.products || []).slice(0, 6);
  if (!items.length) return "";
  const addLabel = c.cartAddLabel || "Add to cart";
  const grid = productsGridHtml(items, addLabel);
  const title = c.cartMode === "booking" ? "Book a service" : "Shop the collection";
  const href =
    c.nav?.find((n) => /shop|menu|inventory|services|treatment|room|course/i.test(n.href + n.label))?.href ||
    "services.html";
  return `<section class="section site-section reveal" data-goke="section" data-section-name="shop"><div class="section-inner"><p class="section-label" data-goke="text">Featured</p><h2 class="section-title" data-goke="heading">${E(title)}</h2><div class="svc-grid goke-product-grid">${grid}</div><p style="margin-top:1.5rem;text-align:center"><a href="${E(href)}" class="btn btn-ghost" data-goke="button">View all</a></p></div></section>`;
}
