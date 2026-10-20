"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ThemeToggle } from "../ThemeToggle";

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <header className="gk-header">
      <div className="gk-container gk-header-inner">
        <Link href="/" className="gk-logo" aria-label="gòke home" onClick={close}>
          <Image
            src="/icons/icon-192.png"
            alt=""
            width={32}
            height={32}
            className="gk-logo-img"
            priority
          />
          <span className="gk-logo-word">gòke</span>
        </Link>

        <nav className={`gk-nav${open ? " open" : ""}`} aria-label="Primary">
          <a href="/#professional" onClick={close}>
            Career
          </a>
          <a href="/#how" onClick={close}>
            How it works
          </a>
          <a href="/#live-examples" onClick={close}>
            Live sites
          </a>
          <a href="/#demo" onClick={close}>
            Demo
          </a>
          <a href="/#pricing" onClick={close}>
            Pricing
          </a>
          <a
            href="/#start"
            className="gk-nav-mobile-cta gk-btn gk-btn-primary"
            onClick={close}
          >
            Generate site
          </a>
        </nav>

        {/* Always visible: theme + menu (mobile) + desktop CTA */}
        <div className="gk-header-tools">
          <ThemeToggle />
          <button
            type="button"
            className="gk-nav-toggle"
            aria-label="Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? "Close" : "Menu"}
          </button>
          <div className="gk-nav-actions">
            <a href="/#start" className="gk-btn gk-btn-primary">
              Generate site
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
