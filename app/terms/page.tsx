import Link from "next/link";
import { SiteHeader } from "../components/marketing/SiteHeader";
import { SiteFooter } from "../components/marketing/SiteFooter";

export default function TermsPage() {
  return (
    <>
      <SiteHeader />
      <main className="gk-legal-page">
        <div className="gk-container gk-legal-wrap">
          <h1>Terms of use</h1>
          <p className="gk-legal-updated">Last updated: September 2026</p>
          <p>
            By using gòke / ig-to-site, you agree to these terms. If you do not agree, do not use
            the service.
          </p>
          <h2>The service</h2>
          <p>
            gòke provides tools to generate and edit a website from an Instagram data export.
            Preview is free; publishing may require a one-time fee as shown at checkout.
          </p>
          <h2>Your content</h2>
          <p>
            You must only upload data you have the right to use. You are responsible for the
            content of your export and of the site you publish.
          </p>
          <h2>Acceptable use</h2>
          <p>
            Do not misuse the service (including attempts to disrupt infrastructure, scrape
            beyond normal use, or publish illegal content).
          </p>
          <h2>Availability</h2>
          <p>
            The product is provided as-is. We may change features, pricing display, or limits
            (including upload size) as the service evolves.
          </p>
          <h2>Limitation</h2>
          <p>
            To the extent permitted by law, gòke is not liable for indirect or consequential
            losses arising from use of the preview or published sites.
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
