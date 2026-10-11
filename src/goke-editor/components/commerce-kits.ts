/**
 * Shop / e-commerce section kits for static gòke sites.
 * Cart uses data attributes + shared runtime in script.js (localStorage + WhatsApp order).
 * Category: "Shop"
 */
import { registry } from "../core/registry";
import type { ComponentDefinition } from "../types";

const kits: ComponentDefinition[] = [
  {
    type: "kit/shop-grid-3",
    name: "Shop – 3 products",
    category: "Shop",
    icon: "🛍",
    html: `<section class="site-section goke-shop" data-goke="section" data-section-name="Shop" style="padding:64px 24px;background:var(--goke-bg,#fff);">
  <div data-goke="container" style="max-width:1100px;margin:0 auto;">
    <h2 data-goke="heading" style="text-align:center;font-size:2rem;margin:0 0 8px;">Shop</h2>
    <p data-goke="text" style="text-align:center;color:var(--goke-muted,#6b7280);margin:0 0 40px;">Featured products — add to cart and order on WhatsApp.</p>
    <div data-goke="columns" class="goke-product-grid" style="display:grid;grid-template-columns:repeat(3,1fr);gap:24px;">
      <article class="goke-product" data-goke="container" data-product-id="p1" data-product-name="Signature item" data-product-price="15000" style="border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;background:#fff;">
        <img data-goke="image" src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80" alt="Product" style="width:100%;height:200px;object-fit:cover;" />
        <div style="padding:16px;">
          <h3 data-goke="heading" style="margin:0 0 6px;font-size:1.1rem;">Signature item</h3>
          <p data-goke="text" style="margin:0 0 12px;color:#6b7280;font-size:0.9rem;">Short product line from your brand.</p>
          <p data-goke="text" class="goke-price" style="margin:0 0 14px;font-weight:800;font-size:1.15rem;">₦15,000</p>
          <button type="button" class="goke-add-cart" data-goke="button" style="width:100%;padding:12px;border:none;border-radius:10px;background:var(--goke-primary,#3b82f6);color:#fff;font-weight:600;cursor:pointer;">Add to cart</button>
        </div>
      </article>
      <article class="goke-product" data-goke="container" data-product-id="p2" data-product-name="Popular pick" data-product-price="25000" style="border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;background:#fff;">
        <img data-goke="image" src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80" alt="Product" style="width:100%;height:200px;object-fit:cover;" />
        <div style="padding:16px;">
          <h3 data-goke="heading" style="margin:0 0 6px;font-size:1.1rem;">Popular pick</h3>
          <p data-goke="text" style="margin:0 0 12px;color:#6b7280;font-size:0.9rem;">Best seller for your audience.</p>
          <p data-goke="text" class="goke-price" style="margin:0 0 14px;font-weight:800;font-size:1.15rem;">₦25,000</p>
          <button type="button" class="goke-add-cart" data-goke="button" style="width:100%;padding:12px;border:none;border-radius:10px;background:var(--goke-primary,#3b82f6);color:#fff;font-weight:600;cursor:pointer;">Add to cart</button>
        </div>
      </article>
      <article class="goke-product" data-goke="container" data-product-id="p3" data-product-name="Premium set" data-product-price="45000" style="border:1px solid #e2e8f0;border-radius:16px;overflow:hidden;background:#fff;">
        <img data-goke="image" src="https://images.unsplash.com/photo-1560343090-f0409e92791a?w=600&q=80" alt="Product" style="width:100%;height:200px;object-fit:cover;" />
        <div style="padding:16px;">
          <h3 data-goke="heading" style="margin:0 0 6px;font-size:1.1rem;">Premium set</h3>
          <p data-goke="text" style="margin:0 0 12px;color:#6b7280;font-size:0.9rem;">Higher-ticket bundle.</p>
          <p data-goke="text" class="goke-price" style="margin:0 0 14px;font-weight:800;font-size:1.15rem;">₦45,000</p>
          <button type="button" class="goke-add-cart" data-goke="button" style="width:100%;padding:12px;border:none;border-radius:10px;background:var(--goke-primary,#3b82f6);color:#fff;font-weight:600;cursor:pointer;">Add to cart</button>
        </div>
      </article>
    </div>
  </div>
</section>`,
    properties: [],
  },
  {
    type: "kit/cart-bar",
    name: "Cart bar (floating)",
    category: "Shop",
    icon: "🛒",
    html: `<div class="goke-cart-bar" data-goke="container" style="position:fixed;bottom:20px;right:20px;z-index:40;display:flex;align-items:center;gap:12px;padding:12px 18px;background:#0f172a;color:#fff;border-radius:999px;box-shadow:0 8px 30px rgba(0,0,0,.25);font-family:system-ui,sans-serif;">
  <span data-goke="text" class="goke-cart-count" style="font-weight:700;">0 items</span>
  <button type="button" class="goke-cart-checkout" data-goke="button" style="border:none;border-radius:999px;padding:8px 16px;background:var(--goke-primary,#3b82f6);color:#fff;font-weight:600;cursor:pointer;">Order on WhatsApp</button>
</div>`,
    properties: [],
  },
  {
    type: "kit/product-feature",
    name: "Product – hero feature",
    category: "Shop",
    icon: "★",
    html: `<section class="site-section" data-goke="section" data-section-name="Featured product" style="padding:72px 24px;">
  <div data-goke="container" class="goke-product" data-product-id="featured" data-product-name="Featured product" data-product-price="35000" style="max-width:1000px;margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:40px;align-items:center;">
    <img data-goke="image" src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80" alt="Featured" style="width:100%;border-radius:16px;object-fit:cover;min-height:320px;" />
    <div>
      <p data-goke="text" style="color:var(--goke-primary,#3b82f6);font-weight:600;margin:0 0 8px;">Featured</p>
      <h2 data-goke="heading" style="font-size:2rem;margin:0 0 12px;">Featured product</h2>
      <p data-goke="text" style="color:#6b7280;margin:0 0 16px;line-height:1.6;">Describe the offer with real copy from Instagram captions.</p>
      <p data-goke="text" class="goke-price" style="font-size:1.5rem;font-weight:800;margin:0 0 20px;">₦35,000</p>
      <button type="button" class="goke-add-cart" data-goke="button" style="padding:14px 28px;border:none;border-radius:10px;background:var(--goke-primary,#3b82f6);color:#fff;font-weight:600;cursor:pointer;">Add to cart</button>
    </div>
  </div>
</section>`,
    properties: [],
  },
];

registry.registerMany(kits);
export default kits;
