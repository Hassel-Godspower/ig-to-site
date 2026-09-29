import { SiteHeader } from "./components/marketing/SiteHeader";
import { HeroUpload } from "./components/marketing/HeroUpload";
import { HowItWorks } from "./components/marketing/HowItWorks";
import { ProofStrip } from "./components/marketing/ProofStrip";
import { EditorShowcase } from "./components/marketing/EditorShowcase";
import { TemplatesStrip } from "./components/marketing/TemplatesStrip";
import { PricingTeaser } from "./components/marketing/PricingTeaser";
import { SiteFooter } from "./components/marketing/SiteFooter";

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main>
        {/* Hero */}
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
                <li>Elementor-style editor</li>
                <li>Pay only to publish</li>
              </ul>
            </div>
            <HeroUpload />
          </div>
        </section>

        <HowItWorks />
        <ProofStrip />
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
