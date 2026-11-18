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
          <p className="gk-legal-updated">Last updated: November 2026</p>
          <p>
            By using gòke (highvaluesolutions.net), you agree to these terms. If
            you do not agree, do not use the service.
          </p>

          <h2>The service</h2>
          <p>
            gòke provides tools to generate and edit multi-page websites from
            Instagram (handle or export) or from LinkedIn / CV inputs. Preview is
            free. Publishing requires the one-time Go live fee shown at checkout
            (currently ₦20,000), unless a different price is clearly stated.
          </p>

          <h2>Your content</h2>
          <p>
            You must only upload data and media you have the right to use. You are
            responsible for the content of exports, CVs, and any site you publish.
          </p>

          <h2>Payments and publish guarantee</h2>
          <p>
            Successful payment is required before public publish. If payment
            succeeds and we cannot complete a reasonable publish attempt, contact
            us with your Paystack reference; we will complete the deploy or refund
            the Go live fee. Optional add-ons (custom domain, commerce, etc.) are
            charged only if you choose them and are described at purchase time.
          </p>

          <h2>Acceptable use</h2>
          <p>
            Do not misuse the service (including attempts to disrupt
            infrastructure, abuse generation limits, or publish illegal content).
          </p>

          <h2>Availability</h2>
          <p>
            The product is provided as-is. Features, pricing display, and limits
            (including upload size) may change as the service evolves.
          </p>

          <h2>Limitation</h2>
          <p>
            To the extent permitted by law, HighValue Solutions / gòke is not
            liable for indirect or consequential losses arising from preview or
            published sites, including loss of business from third-party platforms
            (Instagram, LinkedIn, Cloudflare, or payment providers).
          </p>

          <h2>Contact</h2>
          <p>
            WhatsApp +234 706 534 1105 ·{" "}
            <Link href="/support">Support</Link> ·{" "}
            <Link href="/privacy">Privacy</Link>
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
