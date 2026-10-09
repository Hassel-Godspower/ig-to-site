export function PricingTeaser() {
  return (
    <section className="gk-section gk-section-alt" id="pricing">
      <div className="gk-container">
        <div className="gk-section-head">
          <h2>Preview free. Pay when you publish.</h2>
          <p>
            Generate and edit at no charge. Checkout only when you are ready for a live site.
            Payments processed securely by <strong>Paystack</strong>.
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
              <li>Simple editor (text, logo, colour) or full visual editor</li>
              <li>Multi-page preview · mobile canvas</li>
              <li>No public domain until you pay</li>
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
            <p className="gk-price-note">About $12 · one-time · Paystack</p>
            <ul>
              <li>Everything in Preview</li>
              <li>Cloudflare Pages URL (HTTPS)</li>
              <li>Email with your live link when deploy succeeds</li>
              <li>Static site files you can keep</li>
              <li>Custom domain available as a follow-up</li>
            </ul>
            <a href="#start" className="gk-btn gk-btn-accent gk-btn-block">
              Generate first
            </a>
          </article>
        </div>
        <p style={{ textAlign: "center", marginTop: "1.25rem", fontSize: 13, color: "#9ca3af" }}>
          <a href="#what-you-get" style={{ color: "#c4b5fd" }}>See exactly what ₦20,000 includes</a>
        </p>
      </div>
    </section>
  );
}
