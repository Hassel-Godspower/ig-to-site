/** Real published sites — keep this list honest and up to date. */
const EXAMPLES = [
  {
    name: "Pax & Pearl BodyWorks",
    niche: "Spa · wellness",
    href: "https://paxpearlbodyworks.pages.dev",
    blurb: "Massage and bodywork in Lagos — services, gallery, and WhatsApp booking.",
  },
  {
    name: "Brandrich",
    niche: "Creative · brand",
    href: "https://brandrich.pages.dev",
    blurb: "Brand presence built from Instagram content into a multi-section site.",
  },
] as const;

export function LiveExamples() {
  return (
    <section className="gk-section" id="live-examples" aria-labelledby="live-examples-title">
      <div className="gk-container">
        <div className="gk-section-head">
          <h2 id="live-examples-title">Live on the open web</h2>
          <p>
            Real publishes from gòke — open them, scroll on your phone, then generate yours.
          </p>
        </div>
        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          }}
        >
          {EXAMPLES.map((ex) => (
            <a
              key={ex.href}
              href={ex.href}
              target="_blank"
              rel="noreferrer"
              className="gk-card"
              style={{
                display: "block",
                padding: "1.25rem",
                borderRadius: 12,
                border: "1px solid var(--gk-border-strong)",
                background: "var(--gk-surface)",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <p
                style={{
                  margin: 0,
                  fontSize: 11,
                  letterSpacing: "0.06em",
                  color: "var(--gk-accent)",
                  textTransform: "uppercase",
                }}
              >
                {ex.niche}
              </p>
              <h3
                style={{
                  margin: "0.35rem 0",
                  fontSize: "1.1rem",
                  color: "var(--gk-text)",
                }}
              >
                {ex.name}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: "var(--gk-muted)",
                  lineHeight: 1.5,
                }}
              >
                {ex.blurb}
              </p>
              <span
                style={{
                  display: "inline-block",
                  marginTop: 12,
                  fontSize: 13,
                  color: "var(--gk-accent-hover)",
                }}
              >
                Open live site →
              </span>
            </a>
          ))}
        </div>
        <p
          style={{
            marginTop: "1.25rem",
            fontSize: 13,
            color: "var(--gk-faint)",
          }}
        >
          More customer sites land here as they go live. Yours can be next.
        </p>
      </div>
    </section>
  );
}
