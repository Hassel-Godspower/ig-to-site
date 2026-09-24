/**
 * Global design tokens (colors + Google Fonts)
 */

"use client";

import React from "react";
import type { DesignTokens } from "../types/document";
import { DEFAULT_TOKENS } from "../types/document";
import { GOOGLE_FONTS, fontSelectOptions } from "../data/google-fonts";

interface GlobalsPanelProps {
  tokens: DesignTokens;
  onChange: (tokens: DesignTokens) => void;
}

export function GlobalsPanel({ tokens, onChange }: GlobalsPanelProps) {
  const t = tokens || DEFAULT_TOKENS;
  const options = fontSelectOptions();

  function setColor(key: keyof DesignTokens["colors"], value: string) {
    onChange({
      ...t,
      colors: { ...t.colors, [key]: value },
    });
  }

  function setFont(key: keyof DesignTokens["fonts"], value: string) {
    onChange({
      ...t,
      fonts: { ...t.fonts, [key]: value },
    });
  }

  /** Prefer matching catalog entry so the <select> shows the right option */
  function selectValue(stack: string): string {
    const exact = options.find((o) => o.value === stack);
    if (exact) return exact.value;
    const lower = stack.toLowerCase();
    const soft = GOOGLE_FONTS.find(
      (f) =>
        lower.includes(f.name.toLowerCase()) ||
        lower.includes(f.family.split(",")[0].replace(/['"]/g, "").toLowerCase())
    );
    return soft?.family ?? stack;
  }

  const colorFields: { key: keyof DesignTokens["colors"]; label: string }[] = [
    { key: "primary", label: "Primary" },
    { key: "secondary", label: "Secondary" },
    { key: "text", label: "Text" },
    { key: "muted", label: "Muted" },
    { key: "background", label: "Background" },
  ];

  return (
    <div className="goke-globals-panel">
      <div className="goke-field-section">
        <h4>Global colors</h4>
      </div>
      {colorFields.map(({ key, label }) => (
        <div key={key} className="goke-field goke-field-color">
          <label>{label}</label>
          <div className="goke-color-row">
            <input
              type="color"
              value={
                t.colors[key]?.startsWith("#") ? t.colors[key] : "#000000"
              }
              onChange={(e) => setColor(key, e.target.value)}
            />
            <input
              type="text"
              value={t.colors[key]}
              onChange={(e) => setColor(key, e.target.value)}
            />
          </div>
        </div>
      ))}

      <div className="goke-field-section">
        <h4>Global fonts</h4>
      </div>
      <div className="goke-field">
        <label>Heading font</label>
        <select
          value={selectValue(t.fonts.heading)}
          onChange={(e) => setFont("heading", e.target.value)}
          style={{ fontFamily: selectValue(t.fonts.heading) }}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} style={{ fontFamily: o.value }}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <div className="goke-field">
        <label>Body font</label>
        <select
          value={selectValue(t.fonts.body)}
          onChange={(e) => setFont("body", e.target.value)}
          style={{ fontFamily: selectValue(t.fonts.body) }}
        >
          {options.map((o) => (
            <option key={o.value} value={o.value} style={{ fontFamily: o.value }}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
      <p className="goke-properties-empty" style={{ marginTop: 12 }}>
        Fonts load from Google Fonts into the canvas. Use{" "}
        <code>var(--goke-font-heading)</code> /{" "}
        <code>var(--goke-font-body)</code> and{" "}
        <code>var(--goke-primary)</code> in kits and styles.
      </p>
    </div>
  );
}

export default GlobalsPanel;
