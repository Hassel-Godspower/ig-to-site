import Link from "next/link";
import { SiteHeader } from "../components/marketing/SiteHeader";
import { SiteFooter } from "../components/marketing/SiteFooter";

const steps = [
  {
    n: 1,
    t: "Open your profile",
    d: "Open Instagram and go to your profile.",
  },
  {
    n: 2,
    t: "Accounts Center",
    d: "Tap the menu (three lines) top right, then Accounts Center.",
  },
  {
    n: 3,
    t: "Export your information",
    d: "Tap Your information and permissions → Export your information.",
  },
  {
    n: 4,
    t: "Create export",
    d: "Tap Create export, select your Instagram profile, then Next.",
  },
  {
    n: 5,
    t: "Profile + Posts only",
    d: "Tap Deselect all, then check only Profile information and Posts. Leave Messages, Stories, Reels, Saved, and Followers unchecked — keeps the file small.",
  },
  {
    n: 6,
    t: "Export to device",
    d: "Choose Export to device.",
  },
  {
    n: 7,
    t: "JSON format",
    d: "Set format to JSON (not HTML) — required for gòke to read the export.",
  },
  {
    n: 8,
    t: "Low media quality",
    d: "Set media quality to Low if asked — we use text and structure, not full-res media.",
  },
  {
    n: 9,
    t: "Start export",
    d: "Tap Start export and enter your password when prompted.",
  },
  {
    n: 10,
    t: "Download the ZIP",
    d: "When Instagram notifies you, download the ZIP and upload it here — no need to unzip.",
  },
];

export default function HowToExportPage() {
  return (
    <>
      <SiteHeader />
      <main className="gk-export-page">
        <div className="gk-container gk-export-wrap">
          <p className="gk-kicker">Export guide</p>
          <h1>Download your Instagram data</h1>
          <p className="gk-export-lead">
            Follow these steps so your file stays under 4 MB and gòke can read it. JSON only —
            profile and posts are enough.
          </p>

          <ol className="gk-export-steps">
            {steps.map((s) => (
              <li key={s.n}>
                <span className="gk-export-num">{s.n}</span>
                <div>
                  <strong>{s.t}</strong>
                  <p>{s.d}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="gk-export-callout">
            <strong>Tip:</strong> Keeping the export to Profile + Posts (step 5) is the main way
            to stay under the 4 MB upload limit.
          </div>

          <div className="gk-demo-actions">
            <Link href="/#start" className="gk-btn gk-btn-primary">
              Back to upload
            </Link>
            <Link href="/" className="gk-btn gk-btn-ghost">
              Home
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
