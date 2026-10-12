/**
 * What ₦20k includes — payment, ownership, hosting.
 */
export function TrustOwnership() {
  const card = {
    padding: "1.25rem",
    borderRadius: 12,
    border: "1px solid var(--gk-border-strong)",
    background: "var(--gk-surface)",
  } as const;
  const list = {
    margin: 0,
    paddingLeft: "1.1rem",
    color: "var(--gk-muted)",
    fontSize: 14,
    lineHeight: 1.55,
  } as const;
  const heading = {
    margin: "0 0 0.75rem",
    fontSize: "1.05rem",
    color: "var(--gk-text)",
  } as const;
  const strong = { color: "var(--gk-text)" } as const;
  const code = { color: "var(--gk-accent)" } as const;

  return (
    <section className="gk-section" id="what-you-get" aria-labelledby="what-you-get-title">
      <div className="gk-container">
        <div className="gk-section-head">
          <h2 id="what-you-get-title">What you get when you go live</h2>
          <p>
            Plain language. No surprise subscriptions. Pay once with Paystack when the site is
            ready.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          }}
        >
          <article className="gk-card" style={card}>
            <h3 style={heading}>Payment</h3>
            <ul style={list}>
              <li>
                ₦20,000 once via <strong style={strong}>Paystack</strong> (cards, bank, USSD
                where available)
              </li>
              <li>Receipt emailed by Paystack</li>
              <li>No monthly fee to keep the published site online on our standard host</li>
            </ul>
          </article>
          <article className="gk-card" style={card}>
            <h3 style={heading}>Your live site</h3>
            <ul style={list}>
              <li>
                Public URL on Cloudflare Pages (e.g.{" "}
                <code style={code}>yourbrand.pages.dev</code>)
              </li>
              <li>HTTPS included</li>
              <li>Site files also in a GitHub repo linked to your job</li>
            </ul>
          </article>
          <article className="gk-card" style={card}>
            <h3 style={heading}>What is not automatic</h3>
            <ul style={list}>
              <li>Custom domain (yourbrand.com) — optional DNS setup after publish</li>
              <li>Auto-sync of new Instagram posts</li>
              <li>Full redesign after go-live (available as a follow-up)</li>
            </ul>
          </article>
        </div>
        <p
          style={{
            marginTop: "1.5rem",
            fontSize: 13,
            color: "var(--gk-faint)",
            maxWidth: 640,
          }}
        >
          You own the published site content and can keep editing from your dashboard access
          link. Generate stays free until you choose to go live.
        </p>
      </div>
    </section>
  );
}
