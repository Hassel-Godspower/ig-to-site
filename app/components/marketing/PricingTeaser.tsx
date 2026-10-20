export function PricingTeaser() {
  return (
    <section className="gk-section gk-section-alt" id="pricing">
      <div className="gk-container">
        <div className="gk-section-head">
          <h2>Preview free. Pay when you publish.</h2>
          <p>
            Generate from Instagram or LinkedIn / CV and edit at no charge.
            Checkout only when you want a live URL. Payments by{" "}
            <strong>Paystack</strong>.
          </p>
        </div>
        <div className="gk-pricing">
          <article className="gk-price-card">
            <h3>Preview</h3>
            <p className="price">
              ₦0 <span>/ start</span>
            </p>
            <ul>
              <li>Instagram handle, export, LinkedIn, or CV → site</li>
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
            <ul>
              <li>HTTPS site on Cloudflare Pages</li>
              <li>yourusername.pages.dev included</li>
              <li>Email with your live link</li>
              <li>Keep editing from your dashboard</li>
            </ul>
            <a href="#start" className="gk-btn gk-btn-primary gk-btn-block">
              Generate first — pay later
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
