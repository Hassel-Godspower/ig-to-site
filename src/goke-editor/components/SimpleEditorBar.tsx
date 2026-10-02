/**
 * Simple mode: text, logo URL, primary color, WhatsApp — no widget tree.
 */
"use client";

import React, { useEffect, useState } from "react";

type Props = {
  iframe: HTMLIFrameElement | null;
  onDirty: () => void;
};

function docOf(iframe: HTMLIFrameElement | null): Document | null {
  try {
    return iframe?.contentDocument ?? null;
  } catch {
    return null;
  }
}

function textOf(doc: Document, sel: string): string {
  const el = doc.querySelector(sel);
  return (el?.textContent || "").trim();
}

function setText(doc: Document, sel: string, value: string) {
  const el = doc.querySelector(sel);
  if (el) el.textContent = value;
}

export function SimpleEditorBar({ iframe, onDirty }: Props) {
  const [title, setTitle] = useState("");
  const [headline, setHeadline] = useState("");
  const [sub, setSub] = useState("");
  const [cta, setCta] = useState("");
  const [logoUrl, setLogoUrl] = useState("");
  const [wa, setWa] = useState("");
  const [primary, setPrimary] = useState("#3b82f6");

  // Load from canvas when iframe is ready
  useEffect(() => {
    const doc = docOf(iframe);
    if (!doc) return;
    setTitle(textOf(doc, "#site-title, .brand-text, .brand"));
    setHeadline(textOf(doc, "#hero-headline, h1"));
    setSub(textOf(doc, "#hero-subheadline, .hero p, .hero-description"));
    setCta(textOf(doc, "#cta-button, a[data-goke=button]"));
    const img =
      (doc.querySelector(".brand-logo, .site-logo") as HTMLImageElement | null)?.src ||
      "";
    setLogoUrl(img.startsWith("http") || img.startsWith("/") ? img : "");
    setWa(doc.body.getAttribute("data-wa") || "");
    const root = doc.documentElement;
    const cs = doc.defaultView?.getComputedStyle(root);
    const v =
      root.style.getPropertyValue("--goke-primary").trim() ||
      cs?.getPropertyValue("--goke-primary")?.trim() ||
      "#3b82f6";
    if (v) setPrimary(v);
  }, [iframe, iframe?.src]);

  function apply() {
    const doc = docOf(iframe);
    if (!doc) return;
    if (title) {
      setText(doc, "#site-title .brand-text", title);
      setText(doc, "#site-title", title);
      const brandText = doc.querySelector(".brand-text");
      if (brandText) brandText.textContent = title;
    }
    if (headline) setText(doc, "#hero-headline, h1", headline);
    if (sub) {
      const subEl =
        doc.querySelector("#hero-subheadline") ||
        doc.querySelector(".hero p, .hero-description, .hero-content p");
      if (subEl) subEl.textContent = sub;
    }
    if (cta) {
      const btn =
        doc.querySelector("#cta-button") ||
        doc.querySelector("a[data-goke=button], .hero a.btn, .hero-buttons a");
      if (btn) btn.textContent = cta;
    }
    if (logoUrl) {
      doc.querySelectorAll(".brand-logo, .site-logo").forEach((node) => {
        const img = node as HTMLImageElement;
        if (img.tagName === "IMG") img.src = logoUrl;
      });
    }
    doc.body.setAttribute("data-wa", wa.replace(/\D/g, ""));
    doc.documentElement.style.setProperty("--goke-primary", primary);
    doc.querySelectorAll("[style*='--goke-primary'], .btn-primary, a.btn").forEach(() => {
      /* CSS var drives most buttons */
    });
    onDirty();
  }

  const field: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: 4,
    marginBottom: 12,
    fontSize: 12,
    color: "#9ca3af",
  };
  const input: React.CSSProperties = {
    background: "#15121c",
    border: "1px solid rgba(167,139,250,0.25)",
    borderRadius: 8,
    padding: "8px 10px",
    color: "#f3f4f6",
    fontSize: 13,
  };

  return (
    <div
      className="goke-simple-editor"
      style={{
        width: 300,
        flexShrink: 0,
        background: "#12151c",
        borderLeft: "1px solid rgba(255,255,255,0.08)",
        padding: 14,
        overflowY: "auto",
        height: "100%",
      }}
    >
      <h3 style={{ margin: "0 0 4px", fontSize: 14, color: "#f3f4f6" }}>Quick edit</h3>
      <p style={{ margin: "0 0 14px", fontSize: 12, color: "#9ca3af", lineHeight: 1.4 }}>
        Change text, logo, color, and WhatsApp. For full drag-and-drop, use an Instagram export
        on the homepage.
      </p>

      <label style={field}>
        Brand name
        <input style={input} value={title} onChange={(e) => setTitle(e.target.value)} />
      </label>
      <label style={field}>
        Hero headline
        <input style={input} value={headline} onChange={(e) => setHeadline(e.target.value)} />
      </label>
      <label style={field}>
        Supporting line
        <textarea
          style={{ ...input, minHeight: 64, resize: "vertical" }}
          value={sub}
          onChange={(e) => setSub(e.target.value)}
        />
      </label>
      <label style={field}>
        Main button text
        <input style={input} value={cta} onChange={(e) => setCta(e.target.value)} />
      </label>
      <label style={field}>
        Logo image URL
        <input
          style={input}
          value={logoUrl}
          onChange={(e) => setLogoUrl(e.target.value)}
          placeholder="https://…"
        />
      </label>
      <label style={field}>
        WhatsApp number
        <input
          style={input}
          value={wa}
          onChange={(e) => setWa(e.target.value)}
          placeholder="2348012345678"
        />
      </label>
      <label style={field}>
        Brand color
        <input
          type="color"
          value={/^#/.test(primary) ? primary : "#3b82f6"}
          onChange={(e) => setPrimary(e.target.value)}
          style={{ width: "100%", height: 36, border: "none", background: "transparent" }}
        />
      </label>

      <button
        type="button"
        onClick={apply}
        style={{
          width: "100%",
          marginTop: 8,
          padding: "10px 14px",
          borderRadius: 8,
          border: "none",
          background: "linear-gradient(135deg,#8b5cf6,#a78bfa)",
          color: "#0c0a10",
          fontWeight: 600,
          cursor: "pointer",
          fontSize: 13,
        }}
      >
        Apply changes
      </button>
    </div>
  );
}
