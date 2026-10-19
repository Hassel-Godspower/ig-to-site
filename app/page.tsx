import { SiteHeader } from "./components/marketing/SiteHeader";
import { HeroUpload } from "./components/marketing/HeroUpload";
import { ProfessionalUpload } from "./components/marketing/ProfessionalUpload";
import { DemoVideos } from "./components/marketing/DemoVideos";
import { HeroRotator } from "./components/marketing/HeroRotator";
import { HowItWorks } from "./components/marketing/HowItWorks";
import { LiveExamples } from "./components/marketing/LiveExamples";
import { PricingTeaser } from "./components/marketing/PricingTeaser";
import { PricingWhatYouGet } from "./components/marketing/PricingWhatYouGet";
import { AboutGoke } from "./components/marketing/AboutGoke";
import { SiteFooter } from "./components/marketing/SiteFooter";
import Link from "next/link";

/**
 * Lean homepage — IG path first, LinkedIn/CV path directly under it.
 * Narrative: social presence → website you own (business or professional).
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main>
        <section className="gk-hero" id="start">
          <div className="gk-container gk-hero-grid">
            <div>
              <HeroRotator />
            </div>
            <div className="gk-start-stack">
              <HeroUpload />
              <ProfessionalUpload />
            </div>
          </div>
        </section>

        <HowItWorks />
        <LiveExamples />

        <section className="gk-section gk-section-alt" id="demo">
          <div className="gk-container">
            <div className="gk-section-head">
              <h2>See the transformation</h2>
              <p>
                A social profile becomes a multi-page site people can browse and
                act on — with clear calls to action, not another list of links.
              </p>
            </div>
            <DemoVideos />
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

        <PricingTeaser />
        <PricingWhatYouGet />
        <AboutGoke />

        <section className="gk-cta-band">
          <div className="gk-container">
            <h2>Ready when your presence is</h2>
            <p>
              Instagram handle, data export, LinkedIn, or CV — generate free, edit
              in the browser, pay once to go live on yourusername.pages.dev.
            </p>
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
