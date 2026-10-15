export function PricingTeaser() {
  return (
    <section className="gk-section gk-section-alt" id="pricing">
      <div className="gk-container">
        <div className="gk-section-head">
          <h2>Preview free. Pay when you publish.</h2>
          <p>
            Generate and edit at no charge. Checkout only when you are ready for a live
            site. Payments by <strong>Paystack</strong>.
          </p>
        </div>
        <div className="gk-pricing">
          <article className="gk-price-card">
            <h3>Preview</h3>
            <p className="price">
              ₦0 <span>/ start</span>
            </p>
            <ul>
              <li>Handle or Instagram export → site</li>
              <li>Simple editor or full visual editor</li>
              <li>Multi-page preview</li>
              <li>No public URL until you pay</li>
            </ul>
            <a href="#start" className="gk-btn gk-btn-ghost gk-btn-block">
              Start free
            </a>
          </article>
          <article className="gk-price-card featured">
            <h3>Go live</h3>
            <p className="price">
              ₦20,000 <span>/ once</span>
            </p>
            <p className="gk-price-note">One-time · Paystack</p>
            <ul>
              <li>Everything in Preview</li>
              <li>Hosting on Cloudflare Pages</li>
              <li>
                Free domain: <strong>yourusername.pages.dev</strong>
              </li>
              <li>HTTPS + email with your live link</li>
              <li>Site files you own and control</li>
            </ul>
            <a href="#start" className="gk-btn gk-btn-accent gk-btn-block">
              Generate first
            </a>
          </article>
        </div>
        <p
          style={{
            textAlign: "center",
            marginTop: "1.25rem",
            fontSize: 14,
            color: "var(--gk-muted)",
            lineHeight: 1.6,
          }}
        >
          Custom domain (you.com / .com.ng):{" "}
          <strong style={{ color: "var(--gk-text)" }}>₦30,000 / year</strong>
          {" · "}
          <a href="#what-you-get" style={{ color: "var(--gk-accent)" }}>
            Full inclusions, add-ons &amp; FAQ
          </a>
        </p>
      </div>
    </section>
  );
}
