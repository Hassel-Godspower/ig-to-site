/**
 * Booking / appointment kits — forms submit to WhatsApp via script.js runtime.
 * Category: "Booking"
 */
import { registry } from "../core/registry";
import type { ComponentDefinition } from "../types";

const kits: ComponentDefinition[] = [
  {
    type: "kit/booking-form",
    name: "Booking form",
    category: "Booking",
    icon: "📅",
    html: `<section class="site-section goke-booking" data-goke="section" data-section-name="Book" style="padding:64px 24px;background:#f8fafc;">
  <div data-goke="container" style="max-width:560px;margin:0 auto;">
    <h2 data-goke="heading" style="text-align:center;font-size:2rem;margin:0 0 8px;">Book an appointment</h2>
    <p data-goke="text" style="text-align:center;color:#6b7280;margin:0 0 28px;">Pick a service and time — we confirm on WhatsApp.</p>
    <form class="goke-booking-form" data-goke="form" style="display:flex;flex-direction:column;gap:14px;background:#fff;padding:28px;border-radius:16px;border:1px solid #e2e8f0;">
      <label style="display:flex;flex-direction:column;gap:6px;font-size:0.875rem;font-weight:600;">
        Your name
        <input data-goke="input" name="name" required placeholder="Full name" style="padding:12px 14px;border-radius:10px;border:1px solid #e2e8f0;font:inherit;" />
      </label>
      <label style="display:flex;flex-direction:column;gap:6px;font-size:0.875rem;font-weight:600;">
        Phone
        <input data-goke="input" name="phone" type="tel" required placeholder="080…" style="padding:12px 14px;border-radius:10px;border:1px solid #e2e8f0;font:inherit;" />
      </label>
      <label style="display:flex;flex-direction:column;gap:6px;font-size:0.875rem;font-weight:600;">
        Service
        <select data-goke="input" name="service" style="padding:12px 14px;border-radius:10px;border:1px solid #e2e8f0;font:inherit;">
          <option>Consultation</option>
          <option>Standard session</option>
          <option>Premium package</option>
        </select>
      </label>
      <label style="display:flex;flex-direction:column;gap:6px;font-size:0.875rem;font-weight:600;">
        Preferred date
        <input data-goke="input" name="date" type="date" style="padding:12px 14px;border-radius:10px;border:1px solid #e2e8f0;font:inherit;" />
      </label>
      <label style="display:flex;flex-direction:column;gap:6px;font-size:0.875rem;font-weight:600;">
        Preferred time
        <input data-goke="input" name="time" type="time" style="padding:12px 14px;border-radius:10px;border:1px solid #e2e8f0;font:inherit;" />
      </label>
      <label style="display:flex;flex-direction:column;gap:6px;font-size:0.875rem;font-weight:600;">
        Notes
        <textarea data-goke="input" name="notes" rows="3" placeholder="Anything we should know?" style="padding:12px 14px;border-radius:10px;border:1px solid #e2e8f0;font:inherit;resize:vertical;"></textarea>
      </label>
      <button type="submit" data-goke="button" style="margin-top:8px;padding:14px;border:none;border-radius:10px;background:var(--goke-primary,#3b82f6);color:#fff;font-weight:700;cursor:pointer;">Request booking on WhatsApp</button>
    </form>
  </div>
</section>`,
    properties: [],
  },
  {
    type: "kit/services-book",
    name: "Services + Book CTAs",
    category: "Booking",
    icon: "✦",
    html: `<section class="site-section" data-goke="section" data-section-name="Services" style="padding:64px 24px;">
  <div data-goke="container" style="max-width:1000px;margin:0 auto;">
    <h2 data-goke="heading" style="text-align:center;font-size:2rem;margin:0 0 32px;">Services</h2>
    <div data-goke="columns" style="display:grid;grid-template-columns:repeat(3,1fr);gap:20px;">
      <div data-goke="container" style="padding:24px;border-radius:16px;border:1px solid #e2e8f0;">
        <h3 data-goke="heading" style="margin:0 0 8px;">Classic</h3>
        <p data-goke="text" style="color:#6b7280;margin:0 0 12px;font-size:0.9rem;">60 min session</p>
        <p data-goke="text" style="font-weight:800;margin:0 0 16px;">₦20,000</p>
        <a data-goke="button" href="#book" class="goke-book-link" style="display:inline-block;padding:10px 18px;border-radius:8px;background:var(--goke-primary,#3b82f6);color:#fff;text-decoration:none;font-weight:600;">Book</a>
      </div>
      <div data-goke="container" style="padding:24px;border-radius:16px;border:2px solid var(--goke-primary,#3b82f6);">
        <h3 data-goke="heading" style="margin:0 0 8px;">Signature</h3>
        <p data-goke="text" style="color:#6b7280;margin:0 0 12px;font-size:0.9rem;">90 min session</p>
        <p data-goke="text" style="font-weight:800;margin:0 0 16px;">₦35,000</p>
        <a data-goke="button" href="#book" class="goke-book-link" style="display:inline-block;padding:10px 18px;border-radius:8px;background:var(--goke-primary,#3b82f6);color:#fff;text-decoration:none;font-weight:600;">Book</a>
      </div>
      <div data-goke="container" style="padding:24px;border-radius:16px;border:1px solid #e2e8f0;">
        <h3 data-goke="heading" style="margin:0 0 8px;">Premium</h3>
        <p data-goke="text" style="color:#6b7280;margin:0 0 12px;font-size:0.9rem;">Full experience</p>
        <p data-goke="text" style="font-weight:800;margin:0 0 16px;">₦55,000</p>
        <a data-goke="button" href="#book" class="goke-book-link" style="display:inline-block;padding:10px 18px;border-radius:8px;background:var(--goke-primary,#3b82f6);color:#fff;text-decoration:none;font-weight:600;">Book</a>
      </div>
    </div>
  </div>
</section>`,
    properties: [],
  },
];

registry.registerMany(kits);
export default kits;
