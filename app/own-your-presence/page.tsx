import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "../components/marketing/SiteHeader";
import { SiteFooter } from "../components/marketing/SiteFooter";

export const metadata: Metadata = {
  title: "You don’t own Instagram — Own your online presence | gòke",
  description:
    "Instagram is powerful for discovery — but it’s rented space. gòke turns your Instagram content into a website you control: generate, edit, publish.",
};

const roles = [
  {
    title: "Discovery",
    body: "People find you through Search, Explore, Reels, and shared posts. Instagram is unmatched for showing up where attention already is.",
  },
  {
    title: "Trust in motion",
    body: "Stories, posts, and comments build familiarity. Your audience learns your face, voice, and offer in the feed they open every day.",
  },
  {
    title: "Conversation",
    body: "DMs and comments are where interest becomes a lead. For many businesses, Instagram is the front desk.",
  },
  {
    title: "Proof",
    body: "Before-and-afters, client wins, product shots, and day-in-the-life content do the selling work that a blank homepage can’t.",
  },
];

const cons = [
  {
    title: "You rent the platform — you don’t own it",
    body: "Accounts, reach, and features sit on Meta’s terms. Algorithms change. Tools disappear. Policies shift. Your audience’s relationship is mediated by a company you don’t control.",
  },
  {
    title: "Reach is not a promise",
    body: "Organic reach can fall without warning. Boosting becomes a tax on visibility. Building only on the feed means growth is always on someone else’s dial.",
  },
  {
    title: "A profile is not a business site",
    body: "Bio links, story highlights, and a grid are not a homepage, services page, gallery, or clear contact path. Serious buyers still look for a real web presence.",
  },
  {
    title: "Your content is locked in someone else’s box",
    body: "Years of captions, photos, and brand voice live inside an app. Exporting is possible — but most tools never turn that archive into a site you own.",
  },
  {
    title: "One ban or lockout can go dark overnight",
    body: "Hacked accounts, false flags, and verification issues happen. If Instagram is your only storefront, the business goes quiet with the app.",
  },
  {
    title: "You’re always “inside” their product",
    body: "Customers remember the app more than your domain. That weakens brand memory when they search for you later on Google or share a link with a friend.",
  },
];

const fills = [
  {
    title: "Keep Instagram for growth — add a site for ownership",
    body: "gòke doesn’t ask you to quit the app. It turns the content you’ve already published into a multi-section website you can publish and point your bio to.",
  },
  {
    title: "Generate from your export — don’t retype your brand",
    body: "Upload your Instagram data export. gòke builds structure from profile, captions, and posts so you start from your story, not a blank builder.",
  },
  {
    title: "Edit visually, then go live once",
    body: "Refine copy, layout, and media in the editor. Free to generate and edit. Pay once (₦20,000) when you’re ready to publish — not monthly rent to keep a draft.",
  },
  {
    title: "A destination that isn’t a link list",
    body: "Home, about, services, gallery, contact — the pages clients expect when they leave the feed and decide whether to trust you.",
  },
];

export default function OwnYourPresencePage() {
  return (
    <>
      <SiteHeader />
      <main className="gk-own-page">
        <section className="gk-own-hero">
          <div className="gk-container gk-own-hero-inner">
            <p className="gk-kicker">Platform reality</p>
            <h1>
              You don’t own Instagram.
              <br />
              <em>Own your online presence.</em>
            </h1>
            <p className="gk-own-lead">
              Instagram is one of the best tools a modern business can use. It is still{" "}
              <strong>rented space</strong>. gòke helps you turn what you’ve already built there
              into a website that belongs to you.
            </p>
            <div className="gk-demo-actions">
              <Link href="/#start" className="gk-btn gk-btn-primary">
                Generate my site
              </Link>
              <Link href="/why" className="gk-btn gk-btn-ghost">
                Why gòke
              </Link>
            </div>
          </div>
        </section>

        <section className="gk-section">
          <div className="gk-container">
            <div className="gk-section-head">
              <h2>What Instagram does well for business</h2>
              <p>
                Ignoring Instagram is rarely smart. Understanding its role — and its limits — is.
              </p>
            </div>
            <div className="gk-own-roles">
              {roles.map((r) => (
                <article key={r.title} className="gk-own-card">
                  <h3>{r.title}</h3>
                  <p>{r.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="gk-section gk-section-alt">
          <div className="gk-container gk-own-narrow">
            <p className="gk-kicker">The hard truth</p>
            <h2>Borrowing a platform is not the same as owning a presence</h2>
            <p className="gk-own-intro">
              When your entire brand lives inside one app, you are building on land you don’t hold
              the deed to. That works — until it doesn’t.
            </p>
          </div>
          <div className="gk-container">
            <div className="gk-own-cons">
              {cons.map((c, i) => (
                <article key={c.title} className="gk-own-con">
                  <span className="gk-own-con-n">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{c.title}</h3>
                    <p>{c.body}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="gk-section">
          <div className="gk-container">
            <div className="gk-section-head">
              <h2>How gòke fills the gap</h2>
              <p>
                Stay visible where your audience already scrolls. Add a site you control for when
                they’re ready to take you seriously.
              </p>
            </div>
            <div className="gk-own-fills">
              {fills.map((f) => (
                <article key={f.title} className="gk-own-fill">
                  <h3>{f.title}</h3>
                  <p>{f.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="gk-section gk-section-alt">
          <div className="gk-container gk-own-split">
            <div className="gk-own-split-card">
              <h3>Only on Instagram</h3>
              <ul>
                <li>Audience lives in the app</li>
                <li>Bio link or link-in-bio page</li>
                <li>Reach depends on the algorithm</li>
                <li>Brand sits inside Meta’s product</li>
                <li>One lockout risks going dark</li>
              </ul>
            </div>
            <div className="gk-own-split-card gk-own-split-card-accent">
              <h3>Instagram + a site you own</h3>
              <ul>
                <li>Same content, structured for the open web</li>
                <li>Real pages: story, offer, proof, contact</li>
                <li>Bio points to <em>your</em> presence</li>
                <li>Edit and publish on your terms</li>
                <li>A destination that outlasts a feed post</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="gk-section">
          <div className="gk-container gk-own-promise">
            <p className="gk-kicker">Own it</p>
            <h2>Don’t only borrow the stage. Keep a home of your own.</h2>
            <p>
              Instagram remains a powerful stage. A website is the address on the door. gòke
              helps you open that door with the work you’ve already done — generate from your
              export, edit visually, publish when you’re ready.
            </p>
          </div>
        </section>

        <section className="gk-cta-band">
          <div className="gk-container">
            <h2>Turn your Instagram into a site you own</h2>
            <p>Free to generate and edit. ₦20,000 once to go live.</p>
            <div className="gk-demo-actions" style={{ justifyContent: "center" }}>
              <Link href="/#start" className="gk-btn gk-btn-primary gk-btn-lg">
                Generate my site
              </Link>
              <Link href="/how-to-export" className="gk-btn gk-btn-ghost">
                How to export Instagram data
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
