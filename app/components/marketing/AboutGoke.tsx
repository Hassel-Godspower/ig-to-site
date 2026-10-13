/** Who is behind gòke — HighValue Solutions */
export function AboutGoke() {
  const WA = "https://wa.me/2347065341105";
  const TEL = "+234 706 534 1105";

  return (
    <section
      className="gk-section gk-section-alt"
      id="about-goke"
      aria-labelledby="about-goke-title"
    >
      <div className="gk-container" style={{ maxWidth: 720 }}>
        <div className="gk-section-head">
          <p className="gk-kicker" style={{ marginBottom: "0.5rem" }}>
            gòke by HighValue
          </p>
          <h2 id="about-goke-title">Who builds gòke</h2>
          <p>
            <strong>gòke</strong> is a product of{" "}
            <strong>HighValue Solutions</strong> — built for Instagram-native
            businesses in Nigeria and across Africa: coaches, spas, boutiques,
            studios, and service brands that need a real website, not another bio
            link.
          </p>
          <p style={{ color: "var(--gk-muted)", fontSize: 14, lineHeight: 1.6 }}>
            Payments run through{" "}
            <strong style={{ color: "var(--gk-text)" }}>Paystack</strong>. Sites
            publish to{" "}
            <strong style={{ color: "var(--gk-text)" }}>Cloudflare Pages</strong>.
            You generate free; you pay once (₦20,000) when you are ready to go
            live.
          </p>
          <p style={{ marginTop: "1rem", fontSize: 14 }}>
            <a
              href={WA}
              target="_blank"
              rel="noopener noreferrer"
              className="gk-btn gk-btn-primary"
              style={{ display: "inline-flex" }}
            >
              WhatsApp us — {TEL}
            </a>
          </p>
          <p style={{ color: "var(--gk-faint)", fontSize: 13, marginTop: "1rem" }}>
            Product: <strong style={{ color: "var(--gk-accent)" }}>gòke</strong>
            {" · "}
            Company: <strong style={{ color: "var(--gk-text)" }}>HighValue Solutions</strong>
            {" · "}
            <a href={`tel:+2347065341105`} style={{ color: "var(--gk-accent)" }}>
              +2347065341105
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
