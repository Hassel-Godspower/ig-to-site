/** Who is behind gòke — confidence, not apology */
export function AboutGoke() {
  return (
    <section
      className="gk-section gk-section-alt"
      id="about-goke"
      aria-labelledby="about-goke-title"
    >
      <div className="gk-container" style={{ maxWidth: 720 }}>
        <div className="gk-section-head">
          <h2 id="about-goke-title">Who builds gòke</h2>
          <p>
            gòke is built for Instagram-native businesses in Nigeria and across Africa —
            coaches, spas, boutiques, studios, and service brands that need a real site, not
            another bio link.
          </p>
          <p style={{ color: "var(--gk-muted)", fontSize: 14, lineHeight: 1.6 }}>
            Payments run through <strong style={{ color: "var(--gk-text)" }}>Paystack</strong>. Sites
            publish to <strong style={{ color: "var(--gk-text)" }}>Cloudflare Pages</strong>. You
            generate free; you pay once (₦20,000) when you are ready to go live.
          </p>
          <p style={{ color: "var(--gk-faint)", fontSize: 13 }}>
            Product: <strong style={{ color: "var(--gk-accent)" }}>gòke</strong>
            {" · "}
            Built by HighValue Solutions
          </p>
        </div>
      </div>
    </section>
  );
}
