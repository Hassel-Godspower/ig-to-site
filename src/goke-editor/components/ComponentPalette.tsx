/**
 * Elementor-style widget grid with search
 */

"use client";

import React, { useMemo, useState } from "react";
import { registry } from "../core/registry";

interface ComponentPaletteProps {
  onDragStart: (type: string, e: React.DragEvent) => void;
}

export function ComponentPalette({ onDragStart }: ComponentPaletteProps) {
  const [query, setQuery] = useState("");
  const categories = registry.getCategories();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories
      .map((cat) => {
        const items = registry
          .getByCategory(cat)
          .filter(
            (c) =>
              !q ||
              c.name.toLowerCase().includes(q) ||
              c.type.toLowerCase().includes(q) ||
              cat.toLowerCase().includes(q)
          );
        return { cat, items };
      })
      .filter((g) => g.items.length > 0);
  }, [categories, query]);

  return (
    <aside className="goke-palette">
      <div className="goke-palette-search">
        <input
          type="search"
          placeholder="Search widget…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search widgets"
        />
      </div>
      <div className="goke-palette-body">
        {filtered.length === 0 && (
          <p className="goke-properties-empty">No widgets match</p>
        )}
        {filtered.map(({ cat, items }) => (
          <div key={cat} className="goke-palette-group">
            <div className="goke-palette-group-title">{cat}</div>
            <ul className="goke-widget-grid">
              {items.map((comp) => (
                <li key={comp.type}>
                  <button
                    type="button"
                    className="goke-widget-card"
                    draggable
                    onDragStart={(e) => onDragStart(comp.type, e)}
                    title={`Drag ${comp.name}`}
                  >
                    <span className="goke-widget-card-icon">
                      {comp.icon ?? "◇"}
                    </span>
                    <span>{comp.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </aside>
  );
}

export default ComponentPalette;
