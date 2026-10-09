/** Who is behind gòke — trust gap from appraisal */
export function AboutGoke() {
  return (
    <section className="gk-section gk-section-alt" id="about-goke" aria-labelledby="about-goke-title">
      <div className="gk-container" style={{ maxWidth: 720 }}>
        <div className="gk-section-head">
          <h2 id="about-goke-title">Who builds gòke</h2>
          <p>
            gòke is built for Instagram-native businesses in Nigeria and across Africa — coaches,
            spas, boutiques, studios, and service brands that need a real site, not another bio link.
          </p>
          <p style={{ color: "#9ca3af", fontSize: 14, lineHeight: 1.6 }}>
            Payments run through <strong style={{ color: "#e5e7eb" }}>Paystack</strong>. Sites publish
            to <strong style={{ color: "#e5e7eb" }}>Cloudflare Pages</strong>. You generate free; you
            pay once (₦20,000) when you are ready to go live.
          </p>
          <p style={{ color: "#6b7280", fontSize: 13 }}>
            Product: <strong style={{ color: "#c4b5fd" }}>gòke</strong>
            {" · "}
            Currently served at highvaluesolutions.net while the goke domain is prepared.
          </p>
        </div>
      </div>
    </section>
  );
}
