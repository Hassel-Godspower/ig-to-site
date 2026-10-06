import { SiteHeader } from "./components/marketing/SiteHeader";
import { HeroUpload } from "./components/marketing/HeroUpload";
import { HowItWorks } from "./components/marketing/HowItWorks";
import { ProofStrip } from "./components/marketing/ProofStrip";
import { EditorShowcase } from "./components/marketing/EditorShowcase";
import { TemplatesStrip } from "./components/marketing/TemplatesStrip";
import { PricingTeaser } from "./components/marketing/PricingTeaser";
import { SiteFooter } from "./components/marketing/SiteFooter";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main>
        <section className="gk-hero">
          <div className="gk-container gk-hero-grid">
            <div>
              <p className="gk-kicker">Instagram → website</p>
              <h1>
                Your Instagram, as a <em>real website</em>
              </h1>
              <p className="gk-hero-lead">
                Upload your data export. gòke builds a multi-section site, opens a visual
                editor, and lets you go live when you’re ready — not another link-in-bio.
              </p>
              <ul className="gk-hero-points">
                <li>Free to generate &amp; edit</li>
                <li>Visual drag-and-drop editor</li>
                <li>Pay only to publish · ₦20,000 once</li>
              </ul>
              <p className="gk-hero-demo">
                No export yet?{" "}
                <a href="#demo">See how Instagram becomes a site</a>
              </p>
            </div>
            <HeroUpload />
          </div>
        </section>

        <HowItWorks />
        <ProofStrip />

        {/* Demo / case study band */}
        <section className="gk-section gk-section-alt" id="demo">
          <div className="gk-container">
            <div className="gk-section-head">
              <h2>See the transformation</h2>
              <p>
                A fitness coach’s Instagram presence becomes a booking-ready site — profile,
                offer, and gallery structured for the open web.
              </p>
            </div>
            <div className="gk-demo-frame">
              <img
                src="/marketing/proof/fitness.svg"
                alt="Instagram profile transforming into a fitness website"
                width={900}
                height={520}
              />
            </div>
            <div className="gk-demo-actions">
              <a href="#start" className="gk-btn gk-btn-primary">
                Generate my site
              </a>
              <Link href="/how-to-export" className="gk-btn gk-btn-ghost">
                How to export Instagram data
              </Link>
            </div>
          </div>
        </section>

        <EditorShowcase />
        <TemplatesStrip />
        <PricingTeaser />

        <section className="gk-cta-band">
          <div className="gk-container">
            <h2>Ready when your Instagram is</h2>
            <p>Export your data, drop the file, and open your site in the editor.</p>
            <a href="#start" className="gk-btn gk-btn-primary gk-btn-lg">
              Generate my site
            </a>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
