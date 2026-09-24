/**
 * Searchable Lucide-style icon grid for the properties panel.
 */

"use client";

import React, { useMemo, useState } from "react";
import { ICONS, searchIcons, iconSvgMarkup, type IconDef } from "../data/icons";

interface IconPickerProps {
  value: string;
  onChange: (name: string) => void;
}

export function IconPicker({ value, onChange }: IconPickerProps) {
  const [query, setQuery] = useState("");
  const list = useMemo(() => searchIcons(query), [query]);

  return (
    <div className="goke-icon-picker">
      <input
        type="search"
        className="goke-icon-picker-search"
        placeholder="Search icons…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        aria-label="Search icons"
      />
      <div className="goke-icon-picker-grid">
        {list.map((icon: IconDef) => (
          <button
            key={icon.name}
            type="button"
            title={icon.name}
            className={
              "goke-icon-picker-item" +
              (value === icon.name ? " is-selected" : "")
            }
            onClick={() => onChange(icon.name)}
            dangerouslySetInnerHTML={{
              __html: iconSvgMarkup(icon.name, 20),
            }}
          />
        ))}
        {list.length === 0 && (
          <p className="goke-properties-empty" style={{ gridColumn: "1 / -1" }}>
            No icons match “{query}”
          </p>
        )}
      </div>
      <p className="goke-icon-picker-meta">
        {value ? (
          <>
            Selected: <code>{value}</code>
          </>
        ) : (
          `${ICONS.length} icons`
        )}
      </p>
    </div>
  );
}

export default IconPicker;
