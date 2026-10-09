/** Ongoing value — answers “what happens after I pay?” */
export function AfterGoLive() {
  return (
    <section className="gk-section" id="after-go-live" aria-labelledby="after-go-live-title">
      <div className="gk-container">
        <div className="gk-section-head">
          <h2 id="after-go-live-title">After you go live</h2>
          <p>One payment publishes the site. Here is what you can expect next.</p>
        </div>
        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          }}
        >
          {[
            {
              t: "Your link",
              d: "You get a Cloudflare Pages URL (yourbrand.pages.dev) by email when deploy succeeds. HTTPS is included.",
            },
            {
              t: "Edits",
              d: "You can keep refining the site in the editor for that job. Save before major changes. Post-publish redesign support is available as a follow-up.",
            },
            {
              t: "Custom domain",
              d: "Connecting yourbrand.com is a separate setup step (DNS). Not included automatically in the base ₦20,000 publish.",
            },
            {
              t: "Instagram updates",
              d: "New posts do not auto-sync yet. Re-generate or edit manually when your offer changes.",
            },
          ].map((x) => (
            <article
              key={x.t}
              style={{
                padding: "1.15rem",
                borderRadius: 12,
                border: "1px solid rgba(167,139,250,0.2)",
                background: "rgba(18,16,24,0.85)",
              }}
            >
              <h3 style={{ margin: "0 0 0.4rem", fontSize: "1rem", color: "#f3f4f6" }}>{x.t}</h3>
              <p style={{ margin: 0, fontSize: 14, color: "#9ca3af", lineHeight: 1.55 }}>{x.d}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
