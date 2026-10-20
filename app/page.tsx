import { SiteHeader } from "./components/marketing/SiteHeader";
import { HeroUpload } from "./components/marketing/HeroUpload";
import { ProfessionalUpload } from "./components/marketing/ProfessionalUpload";
import { ProfessionalRotator } from "./components/marketing/ProfessionalRotator";
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
 * Two equal doors on the homepage:
 * 1) Instagram → business site
 * 2) LinkedIn / CV → professional site
 * Each door has its own rotator + upload widget in its own section.
 */
export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main>
        {/* —— Instagram / business —— */}
        <section className="gk-hero" id="start" aria-labelledby="ig-path-heading">
          <div className="gk-container gk-hero-grid">
            <div>
              <HeroRotator />
            </div>
            <HeroUpload />
          </div>
        </section>

        {/* —— LinkedIn / CV / professional —— */}
        <section
          className="gk-section gk-section-alt gk-professional-section"
          id="professional"
          aria-labelledby="pro-path-heading"
        >
          <div className="gk-container gk-hero-grid">
            <div>
              <ProfessionalRotator />
            </div>
            <ProfessionalUpload />
          </div>
        </section>

        <HowItWorks />
        <LiveExamples />

        <section className="gk-section gk-section-alt" id="demo">
          <div className="gk-container">
            <div className="gk-section-head">
              <h2>See the transformation</h2>
              <p>
                A social or career profile becomes a multi-page site people can
                browse and act on — with clear calls to action, not another list
                of links.
              </p>
            </div>
            <DemoVideos />
            <div className="gk-demo-actions">
              <a href="#start" className="gk-btn gk-btn-primary">
                Start from Instagram
              </a>
              <a href="#professional" className="gk-btn gk-btn-ghost">
                Start from LinkedIn / CV
              </a>
              <Link href="/how-to-export" className="gk-btn gk-btn-ghost">
                Instagram export guide
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
              Instagram handle or export · LinkedIn profile or CV — generate free,
              edit in the browser, pay once to go live.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              <a href="#start" className="gk-btn gk-btn-primary gk-btn-lg">
                Instagram path
              </a>
              <a href="#professional" className="gk-btn gk-btn-ghost gk-btn-lg">
                LinkedIn / CV path
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
