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
          <p className="gk-legal-updated">Last updated: September 2026</p>
          <p>
            gòke (“we”) helps you turn an Instagram data export into a website. This page
            explains what we process when you use ig-to-site.
          </p>
          <h2>What you upload</h2>
          <p>
            When you upload an Instagram export (.zip or .json), we process the file to generate
            a preview site. We ask you to export only profile and posts so the file stays small
            and limited in scope.
          </p>
          <h2>How we use it</h2>
          <p>
            Export data is used to build and store your job preview, power the visual editor, and
            — if you pay to publish — deploy your site. We do not sell your export data.
          </p>
          <h2>Storage</h2>
          <p>
            Generated site files and job metadata may be stored on our infrastructure (including
            third-party hosting and object storage) for as long as needed to provide the service.
          </p>
          <h2>Payments</h2>
          <p>
            If you publish, payment is handled by our payment provider. We receive confirmation of
            payment, not your full card details.
          </p>
          <h2>Contact</h2>
          <p>
            Questions about privacy: use the contact channel published on the site when available,
            or reach out via the product support path shown after you generate a site.
          </p>
          <p>
            <Link href="/">← Home</Link>
          </p>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
