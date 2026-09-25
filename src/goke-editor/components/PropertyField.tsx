/**
 * Single property control — includes spacing-box for per-side margin/padding
 */

"use client";

import React from "react";
import { IconPicker } from "./IconPicker";
import { useMediaUpload } from "../context/MediaContext";
import type { ComponentProperty } from "../types";

interface PropertyFieldProps {
  property: ComponentProperty & {
    inputType?: string;
    hover?: boolean;
  };
  value: string;
  onChange: (value: string | number | boolean) => void;
  /** For spacing-box: controlled sides */
  spacingValue?: { top: string; right: string; bottom: string; left: string };
  onSpacingChange?: (sides: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  }) => void;
}

export function PropertyField({
  property,
  value,
  onChange,
  spacingValue,
  onSpacingChange,
}: PropertyFieldProps) {
  const id = `prop-${property.key}`;
  const inputType = property.inputType as string;

  if (inputType === "spacing-box") {
    const sides = spacingValue || {
      top: "",
      right: "",
      bottom: "",
      left: "",
    };
    const set = (side: keyof typeof sides, v: string) => {
      onSpacingChange?.({ ...sides, [side]: v });
    };
    return (
      <div className="goke-field goke-spacing-box">
        <label>{property.name}</label>
        <div className="goke-spacing-grid">
          <input
            placeholder="T"
            title="Top"
            value={sides.top}
            onChange={(e) => set("top", e.target.value)}
          />
          <input
            placeholder="R"
            title="Right"
            value={sides.right}
            onChange={(e) => set("right", e.target.value)}
          />
          <input
            placeholder="B"
            title="Bottom"
            value={sides.bottom}
            onChange={(e) => set("bottom", e.target.value)}
          />
          <input
            placeholder="L"
            title="Left"
            value={sides.left}
            onChange={(e) => set("left", e.target.value)}
          />
        </div>
        <div className="goke-spacing-labels">
          <span>Top</span>
          <span>Right</span>
          <span>Bottom</span>
          <span>Left</span>
        </div>
      </div>
    );
  }

  switch (inputType) {
    case "text":
    case "link":
      return (
        <div className="goke-field">
          <label htmlFor={id}>{property.name}</label>
          <input
            id={id}
            type="text"
            value={value}
            placeholder={property.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );

    case "textarea":
      return (
        <div className="goke-field">
          <label htmlFor={id}>{property.name}</label>
          <textarea
            id={id}
            rows={3}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );

    case "number":
      return (
        <div className="goke-field">
          <label htmlFor={id}>{property.name}</label>
          <input
            id={id}
            type="number"
            value={value}
            min={property.min}
            max={property.max}
            step={property.step}
            onChange={(e) => onChange(Number(e.target.value))}
          />
        </div>
      );

    case "select":
      return (
        <div className="goke-field">
          <label htmlFor={id}>{property.name}</label>
          <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          >
            <option value="">—</option>
            {(property.options ?? []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );

    case "icon":
      return (
        <div className="goke-field">
          <label>{property.name}</label>
          <IconPicker value={value || "heart"} onChange={(v) => onChange(v)} />
        </div>
      );

    case "color":
      return (
        <div className="goke-field goke-field-color">
          <label htmlFor={id}>{property.name}</label>
          <div className="goke-color-row">
            <input
              id={id}
              type="color"
              value={value && value.startsWith("#") ? value : "#000000"}
              onChange={(e) => onChange(e.target.value)}
            />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
            />
          </div>
        </div>
      );

    case "checkbox":
      return (
        <div className="goke-field goke-field-check">
          <label>
            <input
              type="checkbox"
              checked={value === "true" || value === "1"}
              onChange={(e) => onChange(e.target.checked)}
            />
            {property.name}
          </label>
        </div>
      );

    case "range":
      return (
        <div className="goke-field">
          <label htmlFor={id}>
            {property.name}: {value}
          </label>
          <input
            id={id}
            type="range"
            min={property.min ?? 0}
            max={property.max ?? 100}
            step={property.step ?? 1}
            value={value || "0"}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );

    case "css-unit": {
      const match = String(value).match(/^([\d.]+)([a-z%]*)$/i);
      const num = match ? match[1] : value === "auto" ? "" : value;
      const unit = match ? match[2] || "px" : "px";
      const units = property.units ?? ["px", "rem", "%", "em"];

      return (
        <div className="goke-field">
          <label>{property.name}</label>
          <div className="goke-unit-row">
            <input
              type="text"
              value={num}
              placeholder="auto"
              onChange={(e) => {
                const n = e.target.value;
                if (n === "" || n === "auto") onChange(n || "");
                else onChange(n + unit);
              }}
            />
            <select
              value={unit}
              onChange={(e) => onChange((num || "0") + e.target.value)}
            >
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
    }

    case "image":
      return (
        <ImageField
          id={id}
          label={property.name}
          value={value}
          onChange={onChange}
        />
      );

    case "section":
      return (
        <div className="goke-field-section">
          <h4>{property.name}</h4>
        </div>
      );

    default:
      return null;
  }
}


function ImageField({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const { jobId, uploadFile } = useMediaUpload();
  const [busy, setBusy] = React.useState(false);
  const [err, setErr] = React.useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  async function onFile(file: File | null) {
    if (!file) return;
    setErr(null);
    setBusy(true);
    try {
      const url = await uploadFile(file);
      onChange(url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="goke-field goke-field-image">
      <label htmlFor={id}>{label}</label>
      {value ? (
        <div className="goke-image-preview">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="" />
        </div>
      ) : null}
      <input
        id={id}
        type="text"
        value={value}
        placeholder="https://… or upload below"
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="goke-image-actions">
        <input
          ref={inputRef}
          type="file"
          accept="image/png,image/jpeg,image/gif,image/webp,image/svg+xml"
          style={{ display: "none" }}
          onChange={(e) => onFile(e.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          className="goke-btn-upload"
          disabled={busy || !jobId}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? "Uploading…" : "Upload image"}
        </button>
      </div>
      {err && (
        <p className="goke-properties-empty" style={{ color: "#ef4444" }}>
          {err}
        </p>
      )}
      {!jobId && (
        <p className="goke-properties-empty">
          Open a site job to enable uploads.
        </p>
      )}
    </div>
  );
}

export default PropertyField;

