/**
 * Simple mode: click any canvas element to edit text, images, links.
 * Double-click text to type directly on the page (Builder inline edit).
 */
"use client";

import React, { useCallback, useEffect, useState } from "react";

type Props = {
  iframe: HTMLIFrameElement | null;
  selectedElement: HTMLElement | null;
  onDirty: () => void;
};

function docOf(iframe: HTMLIFrameElement | null): Document | null {
  try {
    return iframe?.contentDocument ?? null;
  } catch {
    return null;
  }
}

function isTextish(el: HTMLElement): boolean {
  return ["H1", "H2", "H3", "H4", "H5", "H6", "P", "SPAN", "A", "BUTTON", "LI", "LABEL", "TD", "TH", "FIGCAPTION", "STRONG", "EM", "SMALL", "DIV"].includes(
    el.tagName
  );
}

function isMedia(el: HTMLElement): boolean {
  return el.tagName === "IMG" || el.tagName === "VIDEO" || el.tagName === "SOURCE";
}

function isLink(el: HTMLElement): boolean {
  return el.tagName === "A";
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
  width: "100%",
  boxSizing: "border-box",
};

export function SimpleEditorBar({ iframe, selectedElement, onDirty }: Props) {
  const [selText, setSelText] = useState("");
  const [selSrc, setSelSrc] = useState("");
  const [selHref, setSelHref] = useState("");
  const [selAlt, setSelAlt] = useState("");
  const [brand, setBrand] = useState("");
  const [wa, setWa] = useState("");
  const [primary, setPrimary] = useState("#3b82f6");
  const [tick, setTick] = useState(0);

  const refreshGlobals = useCallback(() => {
    const doc = docOf(iframe);
    if (!doc) return;
    const brandEl =
      doc.querySelector("#site-title .brand-text") ||
      doc.querySelector(".brand-text") ||
      doc.querySelector("#site-title");
    if (brandEl) setBrand((brandEl.textContent || "").trim());
    setWa(doc.body.getAttribute("data-wa") || "");
    const root = doc.documentElement;
    const v =
      root.style.getPropertyValue("--goke-primary").trim() ||
      doc.defaultView?.getComputedStyle(root).getPropertyValue("--goke-primary")?.trim() ||
      "#3b82f6";
    if (v) setPrimary(v.startsWith("#") ? v.slice(0, 7) : "#3b82f6");
  }, [iframe]);

  useEffect(() => {
    refreshGlobals();
    if (!iframe) return;
    const onLoad = () => {
      window.setTimeout(() => {
        refreshGlobals();
        setTick((t) => t + 1);
      }, 200);
    };
    iframe.addEventListener("load", onLoad);
    // poll once if already loaded
    if (iframe.contentDocument?.readyState === "complete") {
      window.setTimeout(refreshGlobals, 300);
    }
    return () => iframe.removeEventListener("load", onLoad);
  }, [iframe, iframe?.src, refreshGlobals]);

  useEffect(() => {
    if (!selectedElement) {
      setSelText("");
      setSelSrc("");
      setSelHref("");
      setSelAlt("");
      return;
    }
    setSelText(selectedElement.textContent || "");
    if (isMedia(selectedElement)) {
      setSelSrc(selectedElement.getAttribute("src") || "");
      setSelAlt(selectedElement.getAttribute("alt") || "");
    } else {
      const img = selectedElement.querySelector("img");
      setSelSrc(img?.getAttribute("src") || "");
      setSelAlt(img?.getAttribute("alt") || "");
    }
    setSelHref(isLink(selectedElement) ? selectedElement.getAttribute("href") || "" : "");
  }, [selectedElement, tick]);

  const dirty = () => onDirty();

  const hasSel = !!selectedElement;
  const showText =
    hasSel &&
    (isTextish(selectedElement!) ||
      (!isMedia(selectedElement!) && (selectedElement!.textContent || "").trim().length > 0));
  const showImage =
    hasSel && (isMedia(selectedElement!) || !!selectedElement!.querySelector("img"));
  const showHref = hasSel && isLink(selectedElement!);

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
      <h3 style={{ margin: "0 0 6px", fontSize: 14, color: "#f3f4f6" }}>Edit site</h3>
      <p style={{ margin: "0 0 14px", fontSize: 12, color: "#9ca3af", lineHeight: 1.45 }}>
        <strong style={{ color: "#c4b5fd" }}>Click</strong> any text, button, or image on the
        page to edit it here.{" "}
        <strong style={{ color: "#c4b5fd" }}>Double-click</strong> text to type on the canvas.
      </p>

      <div
        style={{
          marginBottom: 16,
          padding: 12,
          borderRadius: 10,
          border: "1px solid rgba(167,139,250,0.3)",
          background: "rgba(167,139,250,0.08)",
        }}
      >
        <div style={{ fontSize: 11, color: "#a78bfa", fontWeight: 600, marginBottom: 8 }}>
          {hasSel ? `Selected: <${selectedElement!.tagName.toLowerCase()}>` : "Nothing selected"}
        </div>

        {!hasSel && (
          <p style={{ margin: 0, fontSize: 12, color: "#9ca3af" }}>
            Click a headline, paragraph, button, or photo on the preview.
          </p>
        )}

        {showText && (
          <label style={field}>
            Text
            <textarea
              style={{ ...input, minHeight: 80, resize: "vertical" }}
              value={selText}
              onChange={(e) => {
                const v = e.target.value;
                setSelText(v);
                if (selectedElement) {
                  selectedElement.textContent = v;
                  dirty();
                }
              }}
            />
          </label>
        )}

        {showHref && (
          <label style={field}>
            Link URL
            <input
              style={input}
              value={selHref}
              onChange={(e) => {
                const v = e.target.value;
                setSelHref(v);
                selectedElement?.setAttribute("href", v);
                dirty();
              }}
            />
          </label>
        )}

        {showImage && (
          <>
            <label style={field}>
              Image URL
              <input
                style={input}
                value={selSrc}
                onChange={(e) => {
                  const v = e.target.value;
                  setSelSrc(v);
                  if (!selectedElement) return;
                  if (isMedia(selectedElement)) selectedElement.setAttribute("src", v);
                  else selectedElement.querySelector("img")?.setAttribute("src", v);
                  dirty();
                }}
                placeholder="https://…"
              />
            </label>
            <label style={field}>
              Alt text
              <input
                style={input}
                value={selAlt}
                onChange={(e) => {
                  const v = e.target.value;
                  setSelAlt(v);
                  if (!selectedElement) return;
                  if (selectedElement.tagName === "IMG") selectedElement.setAttribute("alt", v);
                  else selectedElement.querySelector("img")?.setAttribute("alt", v);
                  dirty();
                }}
              />
            </label>
          </>
        )}
      </div>

      <div style={{ fontSize: 11, color: "#6b7280", fontWeight: 600, marginBottom: 8 }}>
        SITE-WIDE
      </div>

      <label style={field}>
        Brand name
        <input style={input} value={brand} onChange={(e) => setBrand(e.target.value)} />
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
          value={/^#[0-9a-fA-F]{6}$/.test(primary) ? primary : "#3b82f6"}
          onChange={(e) => setPrimary(e.target.value)}
          style={{ width: "100%", height: 36, border: "none", background: "transparent" }}
        />
      </label>

      <button
        type="button"
        onClick={() => {
          const doc = docOf(iframe);
          if (!doc) return;
          const bt = doc.querySelector(".brand-text") || doc.querySelector("#site-title");
          if (bt) bt.textContent = brand;
          doc.body.setAttribute("data-wa", wa.replace(/\D/g, ""));
          doc.documentElement.style.setProperty("--goke-primary", primary);
          dirty();
        }}
        style={{
          width: "100%",
          marginTop: 4,
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
        Apply site-wide settings
      </button>
    </div>
  );
}
