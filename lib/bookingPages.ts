/**
 * Pax & Pearl–style booking / cart pages for generated static sites.
 * - Services: catalog cards → localStorage cart
 * - Cart/Booking page: list, remove, total, name/phone/date/time → WhatsApp owner
 */

import type { CatalogItem } from "./extractCatalog";
import type { ShellContent } from "./premiumShell";

const E = (s: string) =>
  String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

export type BookingCatalogFile = {
  currency: "NGN";
  mode: "commerce" | "booking";
  adminWhatsapp: string;
  categories: { id: string; name: string }[];
  services: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    duration?: number;
    category: string;
    image?: string;
  }>;
};

/** Build catalog.json shape like Pax (categories + services) */
export function buildBookingCatalogJson(
  items: CatalogItem[],
  waNumber: string,
  mode: "commerce" | "booking"
): BookingCatalogFile {
  const cats = new Map<string, string>();
  items.forEach((it) => {
    const cid = it.kind || "service";
    if (!cats.has(cid)) {
      cats.set(
        cid,
        cid === "menu"
          ? "Menu"
          : cid === "product"
            ? "Products"
            : cid === "listing"
              ? "Listings"
              : "Services"
      );
    }
  });
  if (!cats.size) cats.set("service", "Services");

  return {
    currency: "NGN",
    mode,
    adminWhatsapp: String(waNumber || "").replace(/\D/g, ""),
    categories: [...cats.entries()].map(([id, name]) => ({ id, name })),
    services: items.map((it, i) => ({
      id: it.id,
      name: it.name,
      description: it.description,
      price: it.price != null && it.price > 0 ? it.price : 0,
      duration: it.kind === "service" || it.kind === "menu" ? 30 + (i % 4) * 15 : undefined,
      category: it.kind || "service",
      image: it.image,
    })),
  };
}

/** Full booking/cart page HTML body (inside main) */
export function assembleCartPageBody(c: ShellContent): string {
  const isBook = c.cartMode === "booking";
  const title = isBook ? "Your booking" : "Your cart";
  const empty = isBook ? "No services selected yet." : "Your cart is empty.";
  const confirm = isBook ? "Confirm booking on WhatsApp" : "Send order on WhatsApp";

  return `
<section class="section goke-cart-page" data-goke="section" data-section-name="cart">
  <div class="section-inner" style="max-width:720px;margin:0 auto">
    <p class="section-label" data-goke="text">${isBook ? "Booking" : "Cart"}</p>
    <h1 class="section-title" data-goke="heading">${E(title)}</h1>
    <p data-goke="text" style="color:var(--muted);margin-bottom:1.5rem">${E(
      isBook
        ? "Review selected services, add your details, then send to us on WhatsApp."
        : "Review your items, add your details, then send the order on WhatsApp."
    )}</p>

    <div class="panel goke-cart-summary" style="margin-bottom:1.5rem">
      <h2 data-goke="heading" style="font-size:1.15rem;margin-bottom:1rem">Selected</h2>
      <div id="goke-cart-items" class="goke-cart-items"><p class="goke-cart-empty-msg" style="color:var(--muted)">${E(empty)}</p></div>
      <div class="goke-cart-total-row" style="display:flex;justify-content:space-between;align-items:center;margin-top:1rem;padding-top:1rem;border-top:1px solid var(--line)">
        <span data-goke="text">Total</span>
        <strong id="goke-cart-total" data-goke="text">₦0</strong>
      </div>
    </div>

    <div class="panel goke-cart-form-wrap">
      <h2 data-goke="heading" style="font-size:1.15rem;margin-bottom:1rem">Your details</h2>
      <form id="goke-cart-form" class="goke-booking-form" data-goke-booking>
        <div class="field"><label for="goke-name">Name</label><input id="goke-name" name="name" required autocomplete="name" data-goke="text"/></div>
        <div class="field"><label for="goke-phone">Phone / WhatsApp</label><input id="goke-phone" name="phone" type="tel" required autocomplete="tel" data-goke="text"/></div>
        <div class="field"><label for="goke-email">Email (optional)</label><input id="goke-email" name="email" type="email" autocomplete="email"/></div>
        ${
          isBook
            ? `<div class="field"><label for="goke-date">Preferred date</label><input id="goke-date" name="date" type="date" required/></div>
        <div class="field"><label for="goke-time">Preferred time</label><input id="goke-time" name="time" type="time" required/></div>`
            : `<div class="field"><label for="goke-notes">Notes (optional)</label><textarea id="goke-notes" name="notes" rows="3"></textarea></div>`
        }
        <div class="field"><label for="goke-message">Message (optional)</label><textarea id="goke-message" name="message" rows="2"></textarea></div>
        <button type="submit" class="btn btn-primary" id="goke-cart-confirm" data-goke="button">${E(confirm)}</button>
      </form>
      <p class="note" style="color:var(--muted);font-size:0.85rem;margin-top:0.75rem">Opens WhatsApp to ${E(c.brand)} with your selection. No payment is taken on this page.</p>
    </div>
  </div>
</section>`;
}

/** Minimal CSS for cart rows (appended into styles or inline-friendly) */
export const BOOKING_CART_CSS = `
.goke-cart-items{display:flex;flex-direction:column;gap:10px}
.goke-cart-item{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:12px 14px;border:1px solid var(--line);border-radius:var(--radius,12px);background:var(--surface,var(--ink-2))}
.goke-cart-item strong{display:block}
.goke-cart-item button{border:0;background:transparent;color:var(--muted);cursor:pointer;font-size:1.1rem;line-height:1;padding:4px 8px}
.goke-cart-item button:hover{color:var(--accent,#a78bfa)}
.goke-nav-cart{position:relative}
.goke-nav-cart .goke-cart-badge,.goke-cart-badge{display:inline-flex;align-items:center;justify-content:center;min-width:1.25rem;height:1.25rem;padding:0 5px;border-radius:999px;background:var(--accent);color:var(--on-accent,#fff);font-size:0.7rem;font-weight:700;margin-left:4px}
`;
