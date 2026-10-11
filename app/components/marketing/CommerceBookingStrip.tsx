import Link from "next/link";

/** Marketing: what generated sites can include — shop + book */
export function CommerceBookingStrip() {
  return (
    <section className="gk-section" id="commerce-booking" style={{ padding: "4rem 0" }}>
      <div className="gk-container">
        <div className="gk-section-head" style={{ marginBottom: "2rem" }}>
          <h2>Shop &amp; book — built into the site</h2>
          <p style={{ color: "var(--gk-muted)", maxWidth: 560 }}>
            Generated sites can take orders and appointment requests without a heavy store
            platform. Products and bookings go straight to WhatsApp — the channel Nigerian
            customers already use.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.25rem",
          }}
        >
          <div
            style={{
              padding: "1.5rem",
              borderRadius: 16,
              border: "1px solid var(--gk-border)",
              background: "var(--gk-surface)",
            }}
          >
            <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.1rem" }}>E‑commerce lite</h3>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "var(--gk-muted)", lineHeight: 1.6 }}>
              <li>Product grids &amp; featured items</li>
              <li>Add to cart (saved in the browser)</li>
              <li>Order summary → WhatsApp</li>
              <li>Editable prices &amp; photos in the editor</li>
            </ul>
          </div>
          <div
            style={{
              padding: "1.5rem",
              borderRadius: 16,
              border: "1px solid var(--gk-border)",
              background: "var(--gk-surface)",
            }}
          >
            <h3 style={{ margin: "0 0 0.5rem", fontSize: "1.1rem" }}>Booking</h3>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "var(--gk-muted)", lineHeight: 1.6 }}>
              <li>Service lists with Book CTAs</li>
              <li>Date &amp; time request form</li>
              <li>Submits to WhatsApp for confirmation</li>
              <li>Ideal for spas, salons, clinics, coaches</li>
            </ul>
          </div>
        </div>
        <p style={{ marginTop: "1.5rem", fontSize: "0.9rem", color: "var(--gk-faint)" }}>
          Full Shopify-style inventory &amp; card checkout can come later as an optional
          upgrade. Today every published site ships shop/book UI that works offline-first
          with WhatsApp.
        </p>
        <p style={{ marginTop: "1rem" }}>
          <a href="#start" className="gk-btn gk-btn-primary">
            Generate my site
          </a>
          {" · "}
          <Link href="/why" style={{ color: "var(--gk-accent)" }}>
            Why gòke
          </Link>
        </p>
      </div>
    </section>
  );
}
