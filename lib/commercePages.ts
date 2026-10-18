/**
 * Aurelia-style ecommerce pages for sales niches:
 * Shop cards → cart (qty +/-) → checkout form → WhatsApp owner.
 */

import type { CatalogItem } from "./extractCatalog";
import type { ShellContent } from "./premiumShell";

const E = (s: string) =>
  String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export function formatNgn(n: number): string {
  return `₦${Number(n || 0).toLocaleString("en-NG")}`;
}

/** Inject window.GOKE_PRODUCTS from catalog for cart line resolution */
export function productsScriptTag(items: CatalogItem[]): string {
  const payload = items.map((p) => ({
    id: p.id,
    name: p.name,
    price: p.price != null && p.price > 0 ? p.price : 0,
    image: p.image || "",
    description: p.description || "",
  }));
  return `<script>window.GOKE_PRODUCTS=${JSON.stringify(payload)};window.GOKE_FORMAT=function(n){try{return"₦"+Number(n||0).toLocaleString("en-NG")}catch(e){return"₦"+n}};</script>`;
}

/** Cart page — Aurelia structure: lines, qty, subtotal, go to checkout */
export function assembleCommerceCartBody(c: ShellContent): string {
  return `
<section class="section goke-cart-page" data-goke="section" data-section-name="cart">
  <div class="section-inner" style="max-width:900px;margin:0 auto">
    <p class="section-label" data-goke="text">Cart</p>
    <h1 class="section-title" data-goke="heading">Your cart</h1>
    <p data-goke="text" style="color:var(--muted);margin-bottom:1.5rem">Adjust quantities, then continue to checkout. Your order is sent to ${E(c.brand)} on WhatsApp — no card payment on this page.</p>

    <div class="goke-commerce-layout">
      <div class="panel" style="flex:1">
        <div id="goke-cart-items" data-cart-page class="goke-cart-items">
          <p class="goke-cart-empty-msg" style="color:var(--muted)">Your cart is empty. <a href="shop.html">Browse the shop</a>.</p>
        </div>
      </div>
      <aside class="panel goke-cart-summary-aside" style="min-width:260px">
        <h2 data-goke="heading" style="font-size:1.05rem;margin-bottom:1rem">Summary</h2>
        <div class="goke-summary-row"><span>Subtotal</span><strong id="goke-cart-subtotal">₦0</strong></div>
        <div class="goke-summary-row"><span>Items</span><span class="goke-cart-count">0</span></div>
        <div class="goke-summary-row goke-summary-total"><span>Total</span><strong id="goke-cart-total">₦0</strong></div>
        <a href="checkout.html" class="btn btn-primary btn-block goke-checkout-link" style="margin-top:1.25rem;display:block;text-align:center" data-goke="button">Checkout</a>
        <button type="button" class="btn btn-ghost btn-block goke-cart-checkout" style="margin-top:0.5rem;width:100%" data-goke="button">Quick WhatsApp order</button>
        <p style="margin-top:1rem;font-size:0.8rem;color:var(--muted)"><a href="shop.html">Continue shopping</a></p>
      </aside>
    </div>
  </div>
</section>`;
}

/** Checkout page — customer details + order summary → WhatsApp */
export function assembleCommerceCheckoutBody(c: ShellContent): string {
  return `
<section class="section goke-checkout-page" data-goke="section" data-section-name="checkout">
  <div class="section-inner" style="max-width:960px;margin:0 auto">
    <p class="section-label" data-goke="text">Checkout</p>
    <h1 class="section-title" data-goke="heading">Checkout</h1>
    <p class="muted" data-goke="text" style="color:var(--muted);margin-bottom:1.5rem">Complete your details. We open WhatsApp to ${E(c.brand)} with your order — no online payment is taken here.</p>

    <div class="goke-commerce-layout">
      <form id="goke-checkout-form" class="panel goke-checkout-form" style="flex:1.2">
        <h2 data-goke="heading" style="font-size:1.05rem;margin-bottom:1rem">Delivery details</h2>
        <div class="field"><label for="co-name">Full name</label><input id="co-name" name="name" required autocomplete="name" data-goke="text"/></div>
        <div class="field"><label for="co-phone">Phone / WhatsApp</label><input id="co-phone" name="phone" type="tel" required autocomplete="tel" data-goke="text"/></div>
        <div class="field"><label for="co-email">Email (optional)</label><input id="co-email" name="email" type="email" autocomplete="email"/></div>
        <div class="field"><label for="co-address">Address</label><textarea id="co-address" name="address" rows="2" required data-goke="text"></textarea></div>
        <div class="field" style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
          <div><label for="co-city">City</label><input id="co-city" name="city" required value="Lagos"/></div>
          <div><label for="co-state">State</label><input id="co-state" name="state" required value="Lagos"/></div>
        </div>
        <div class="field"><label for="co-notes">Order notes (optional)</label><textarea id="co-notes" name="notes" rows="2"></textarea></div>
        <div class="field">
          <label for="co-payment">Preferred payment</label>
          <select id="co-payment" name="payment">
            <option value="Bank transfer">Bank transfer</option>
            <option value="Pay on delivery">Pay on delivery</option>
            <option value="WhatsApp arrange">Arrange on WhatsApp</option>
          </select>
        </div>
        <button type="submit" class="btn btn-primary btn-block" data-goke="button">Send order on WhatsApp</button>
        <p style="margin-top:0.75rem;font-size:0.8rem;color:var(--muted)"><a href="cart.html">Back to cart</a></p>
      </form>

      <aside class="panel" style="min-width:260px">
        <h2 data-goke="heading" style="font-size:1.05rem;margin-bottom:1rem">Order summary</h2>
        <div id="goke-checkout-summary" data-checkout-summary></div>
        <div class="goke-summary-row goke-summary-total" style="margin-top:1rem"><span>Total</span><strong id="goke-checkout-total">₦0</strong></div>
      </aside>
    </div>
  </div>
</section>`;
}

export const AURELIA_CART_CSS = `
.goke-commerce-layout{display:flex;flex-wrap:wrap;gap:1.25rem;align-items:flex-start}
.goke-cart-items{display:flex;flex-direction:column;gap:12px}
.goke-cart-line{display:grid;grid-template-columns:72px 1fr auto;gap:12px;align-items:center;padding:12px;border:1px solid var(--line);border-radius:var(--radius,12px);background:var(--surface,var(--ink-2))}
.goke-cart-line img{width:72px;height:72px;object-fit:cover;border-radius:8px}
.goke-cart-line .meta strong{display:block;margin-bottom:4px}
.goke-cart-line .meta .price{color:var(--muted);font-size:.9rem}
.goke-qty{display:inline-flex;align-items:center;border:1px solid var(--line);border-radius:8px;overflow:hidden}
.goke-qty button{border:0;background:transparent;color:var(--text);width:32px;height:32px;cursor:pointer}
.goke-qty input{width:40px;text-align:center;border:0;background:transparent;color:var(--text);font:inherit}
.goke-cart-line .line-total{font-weight:700;min-width:4.5rem;text-align:right}
.goke-cart-line .remove{border:0;background:transparent;color:var(--muted);cursor:pointer;font-size:1rem}
.goke-summary-row{display:flex;justify-content:space-between;gap:12px;padding:6px 0;font-size:.95rem}
.goke-summary-total{border-top:1px solid var(--line);margin-top:8px;padding-top:12px;font-size:1.05rem}
.btn-block{width:100%}
.order-line{display:flex;justify-content:space-between;gap:8px;padding:6px 0;border-bottom:1px solid var(--line);font-size:.9rem}
@media(max-width:720px){.goke-cart-line{grid-template-columns:56px 1fr;}.goke-cart-line .line-total{grid-column:2}}
`;
