/**
 * What ₦20k includes — payment, ownership, hosting. Critical trust gap fix.
 */
export function TrustOwnership() {
  return (
    <section className="gk-section" id="what-you-get" aria-labelledby="what-you-get-title">
      <div className="gk-container">
        <div className="gk-section-head">
          <h2 id="what-you-get-title">What you get when you go live</h2>
          <p>
            Plain language. No surprise subscriptions. Pay once with Paystack when the site is ready.
          </p>
        </div>
        <div className="gk-trust-grid" style={{ display: "grid", gap: "1.25rem", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <article className="gk-card" style={{ padding: "1.25rem", borderRadius: 12, border: "1px solid rgba(167,139,250,0.2)", background: "rgba(18,16,24,0.8)" }}>
            <h3 style={{ marginTop: 0, fontSize: "1.05rem" }}>Payment</h3>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "#9ca3af", fontSize: 14, lineHeight: 1.55 }}>
              <li>₦20,000 once via <strong style={{ color: "#e5e7eb" }}>Paystack</strong> (cards, bank, USSD where available)</li>
              <li>Receipt emailed by Paystack</li>
              <li>No monthly fee to keep the published site online on our standard host</li>
            </ul>
          </article>
          <article className="gk-card" style={{ padding: "1.25rem", borderRadius: 12, border: "1px solid rgba(167,139,250,0.2)", background: "rgba(18,16,24,0.8)" }}>
            <h3 style={{ marginTop: 0, fontSize: "1.05rem" }}>Your live site</h3>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "#9ca3af", fontSize: 14, lineHeight: 1.55 }}>
              <li>Public URL on Cloudflare Pages (e.g. <code style={{ color: "#c4b5fd" }}>yourbrand.pages.dev</code>)</li>
              <li>HTTPS included</li>
              <li>Multi-page static HTML/CSS/JS you can keep</li>
              <li>Source repo created under the gòke operator GitHub account for deploy</li>
            </ul>
          </article>
          <article className="gk-card" style={{ padding: "1.25rem", borderRadius: 12, border: "1px solid rgba(167,139,250,0.2)", background: "rgba(18,16,24,0.8)" }}>
            <h3 style={{ marginTop: 0, fontSize: "1.05rem" }}>What is not automatic yet</h3>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "#9ca3af", fontSize: 14, lineHeight: 1.55 }}>
              <li>Custom domain (e.g. yourbrand.com) — available as a follow-up setup</li>
              <li>Auto-sync of every new Instagram post after publish</li>
              <li>Full ecommerce checkout / inventory system</li>
            </ul>
          </article>
        </div>
        <p style={{ marginTop: "1.5rem", fontSize: 13, color: "#6b7280", maxWidth: 640 }}>
          Preview links are shareable job URLs for editing before payment. After you pay, you receive the live link by email when deploy succeeds.
        </p>
      </div>
    </section>
  );
}
