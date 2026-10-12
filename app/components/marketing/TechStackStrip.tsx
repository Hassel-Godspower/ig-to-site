/** Logos / names of the stack that powers gòke — trust signal under hero */

const STACK: { name: string; note?: string }[] = [
  { name: "Paystack", note: "Payments" },
  { name: "Cloudflare", note: "Hosting" },
  { name: "Next.js", note: "App" },
  { name: "Supabase", note: "Data" },
  { name: "GitHub", note: "Repos" },
  { name: "Resend", note: "Email" },
];

export function TechStackStrip() {
  return (
    <div className="gk-tech-strip" aria-label="Technology used by gòke">
      <p className="gk-tech-strip-label">Powered by</p>
      <ul className="gk-tech-strip-list">
        {STACK.map((item) => (
          <li key={item.name} className="gk-tech-chip">
            <span className="gk-tech-name">{item.name}</span>
            {item.note ? <span className="gk-tech-note">{item.note}</span> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
