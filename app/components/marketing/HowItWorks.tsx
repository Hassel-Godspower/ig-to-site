export function HowItWorks() {
  const steps = [
    {
      n: "1",
      title: "Bring what you already have",
      body: "Business: Instagram handle or data export. Professional: LinkedIn URL and/or a PDF CV. No blank canvas required.",
    },
    {
      n: "2",
      title: "We build the site",
      body: "gòke turns that material into a multi-page website — brand and services for businesses, career narrative for professionals.",
    },
    {
      n: "3",
      title: "Edit, then go live",
      body: "Open the editor, refine copy and layout, then publish once with Paystack when you are ready.",
    },
  ];

  return (
    <section className="gk-section" id="how">
      <div className="gk-container">
        <div className="gk-section-head">
          <h2>From presence to a website you own</h2>
          <p>
            One product, two doors: Instagram for businesses, LinkedIn / CV for
            professionals. Same generate → edit → publish pipeline.
          </p>
        </div>
        <div className="gk-steps">
          {steps.map((s) => (
            <article key={s.n} className="gk-step">
              <div className="gk-step-num">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </article>
          ))}
        </div>
        <p
          style={{
            marginTop: "1.75rem",
            textAlign: "center",
            fontSize: 14,
            color: "var(--gk-muted)",
          }}
        >
          <a href="#start">Instagram path</a>
          {" · "}
          <a href="#professional">LinkedIn / CV path</a>
        </p>
      </div>
    </section>
  );
}
