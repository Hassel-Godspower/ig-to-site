import Link from "next/link";

export default function HowToExportPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#0d0d0d", color: "#f5f5f5", fontFamily: "system-ui, sans-serif", padding: 24, display: "flex", justifyContent: "center" }}>
      <div style={{ maxWidth: 560 }}>
        <h1 style={{ fontSize: 22, fontWeight: 500 }}>Download your Instagram data</h1>
        <ol style={{ color: "#d4d4d4", fontSize: 14, lineHeight: 1.8 }}>
          <li>Open Instagram and go to your profile.</li>
          <li>Tap the menu (three lines) top right, then <strong>Accounts Center</strong>.</li>
          <li>Tap <strong>Your information and permissions</strong> → <strong>Export your information</strong>.</li>
          <li>Tap <strong>Create export</strong>, select your Instagram profile, then <strong>Next</strong>.</li>
          <li>Choose <strong>Export to device</strong>.</li>
          <li>Set format to <strong>JSON</strong> (not HTML) — this is required for our site builder to read it.</li>
          <li>Tap <strong>Start export</strong> and enter your password when prompted.</li>
          <li>You&apos;ll get a notification when it&apos;s ready (often within a few hours). Download the ZIP file.</li>
        </ol>
        <p style={{ color: "#a3a3a3", fontSize: 13 }}>
          Once downloaded, come back here and upload the ZIP file directly — no need to unzip it.
        </p>
        <Link href="/" style={{ color: "#60a5fa", fontSize: 14 }}>← Back</Link>
      </div>
    </main>
  );
}
