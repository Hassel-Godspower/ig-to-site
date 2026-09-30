export function PricingTeaser() {
  return (
    <section className="gk-section gk-section-alt" id="pricing">
      <div className="gk-container">
        <div className="gk-section-head">
          <h2>Preview free. Pay when you publish.</h2>
          <p>
            Generate and edit at no charge. Checkout only when you’re ready for a live site.
          </p>
        </div>
        <div className="gk-pricing">
          <article className="gk-price-card">
            <h3>Preview</h3>
            <p className="price">
              ₦0 <span>/ start</span>
            </p>
            <ul>
              <li>Instagram export → site</li>
              <li>Full visual editor</li>
              <li>Templates &amp; globals</li>
              <li>No public domain until you pay</li>
            </ul>
            <a href="#start" className="gk-btn gk-btn-ghost gk-btn-block">
              Start free
            </a>
          </article>
          <article className="gk-price-card featured">
            <h3>Go live</h3>
            <p className="price">
              ₦10,000 <span>/ once</span>
            </p>
            <p className="gk-price-note">About $6 · one-time publish</p>
            <ul>
              <li>Everything in Preview</li>
              <li>Deploy your site</li>
              <li>Your brand on the open web</li>
              <li>Keep editing after launch</li>
            </ul>
            <a href="#start" className="gk-btn gk-btn-accent gk-btn-block">
              Generate first
            </a>
          </article>
        </div>
      </div>
    </section>
  );
}
