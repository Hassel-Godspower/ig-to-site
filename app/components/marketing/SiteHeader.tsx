"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export function SiteHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="gk-header">
      <div className="gk-container gk-header-inner">
        <Link href="/" className="gk-logo" aria-label="gòke home">
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

        <button
          type="button"
          className="gk-nav-toggle"
          aria-label="Menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          Menu
        </button>

        <nav className={`gk-nav${open ? " open" : ""}`} aria-label="Primary">
          <a href="#how" onClick={() => setOpen(false)}>
            How it works
          </a>
          <a href="#editor" onClick={() => setOpen(false)}>
            Editor
          </a>
          <a href="#templates" onClick={() => setOpen(false)}>
            Templates
          </a>
          <a href="#pricing" onClick={() => setOpen(false)}>
            Pricing
          </a>
          <Link href="/why" onClick={() => setOpen(false)}>
            Why gòke
          </Link>
          <Link href="/own-your-presence" onClick={() => setOpen(false)}>
            Own your presence
          </Link>
          <Link href="/how-to-export" onClick={() => setOpen(false)}>
            Export guide
          </Link>
        </nav>

        <div className="gk-nav-actions">
          <a href="#start" className="gk-btn gk-btn-primary">
            Generate site
          </a>
        </div>
      </div>
    </header>
  );
}
