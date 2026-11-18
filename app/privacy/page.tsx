import Link from "next/link";
import { SiteHeader } from "../components/marketing/SiteHeader";
import { SiteFooter } from "../components/marketing/SiteFooter";

export default function PrivacyPage() {
  return (
    <>
      <SiteHeader />
      <main className="gk-legal-page">
        <div className="gk-container gk-legal-wrap">
          <h1>Privacy</h1>
          <p className="gk-legal-updated">Last updated: November 2026</p>
          <p>
            gòke is a product of HighValue Solutions. This page explains what we
            process when you generate, edit, or publish a site.
          </p>

          <h2>What you provide</h2>
          <p>
            Depending on the path you choose, you may upload an Instagram export
            (.zip / .json), paste an Instagram handle, upload a CV (PDF, Word, or
            image), paste career text, and/or provide a LinkedIn profile URL. You
            may also share an email for payment receipts and dashboard access.
          </p>

          <h2>How we use it</h2>
          <p>
            That information is used only to build your preview, power the editor,
            process payment confirmation, publish your site, and let you manage it
            from the dashboard. We do not sell your uploads or profile data.
          </p>

          <h2>Storage</h2>
          <p>
            Job metadata and generated site files may be stored on our
            infrastructure (including Supabase storage and Cloudflare hosting) for
            as long as needed to provide the service. You can request deletion of a
            preview job by contacting us with the job id or payment email.
          </p>

          <h2>Payments</h2>
          <p>
            Payments are handled by Paystack. We receive payment confirmation and
            reference data, not your full card details.
          </p>

          <h2>Contact</h2>
          <p>
            Privacy questions: WhatsApp{" "}
            <a href="https://wa.me/2347065341105">+234 706 534 1105</a> or email
            info@highvaluesolutions.net when that inbox is active.
          </p>

          <p>
            <Link href="/">← Home</Link>
            {" · "}
            <Link href="/terms">Terms</Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
