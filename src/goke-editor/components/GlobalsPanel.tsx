/**
 * Tier 2 — Global design tokens (colors + fonts)
 */

"use client";

import React from "react";
import type { DesignTokens } from "../types/document";
import { DEFAULT_TOKENS } from "../types/document";

interface GlobalsPanelProps {
  tokens: DesignTokens;
  onChange: (tokens: DesignTokens) => void;
}

export function GlobalsPanel({ tokens, onChange }: GlobalsPanelProps) {
  const t = tokens || DEFAULT_TOKENS;

  function setColor(
    key: keyof DesignTokens["colors"],
    value: string
  ) {
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
        <input
          type="text"
          value={t.fonts.heading}
          onChange={(e) => setFont("heading", e.target.value)}
          placeholder="system-ui, sans-serif"
        />
      </div>
      <div className="goke-field">
        <label>Body font</label>
        <input
          type="text"
          value={t.fonts.body}
          onChange={(e) => setFont("body", e.target.value)}
          placeholder="system-ui, sans-serif"
        />
      </div>
      <p className="goke-properties-empty" style={{ marginTop: 12 }}>
        Use <code>var(--goke-primary)</code> in kits and styles. Changing
        tokens updates the whole site.
      </p>
    </div>
  );
}

export default GlobalsPanel;
