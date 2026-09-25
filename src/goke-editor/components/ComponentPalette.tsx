/**
 * Left sidebar – searchable 2-column component palette (Elementor-style)
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
        let items = registry.getByCategory(cat);
        if (q) {
          items = items.filter(
            (c) =>
              c.name.toLowerCase().includes(q) ||
              c.type.toLowerCase().includes(q) ||
              cat.toLowerCase().includes(q)
          );
        }
        return { cat, items };
      })
      .filter((g) => g.items.length > 0);
  }, [categories, query]);

  return (
    <aside className="goke-palette">
      <div className="goke-palette-header">
        <h2>Components</h2>
      </div>
      <div className="goke-palette-search-wrap">
        <input
          type="search"
          className="goke-palette-search"
          placeholder="Search widgets…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search components"
        />
      </div>
      <div className="goke-palette-body">
        {filtered.map(({ cat, items }) => (
          <div key={cat} className="goke-palette-group">
            <div className="goke-palette-group-title">{cat}</div>
            <div className="goke-palette-grid">
              {items.map((comp) => (
                <button
                  key={comp.type}
                  type="button"
                  draggable
                  onDragStart={(e) => onDragStart(comp.type, e)}
                  className="goke-palette-card"
                  title={comp.name}
                >
                  <span className="goke-palette-card-icon">
                    {comp.icon ?? "◇"}
                  </span>
                  <span className="goke-palette-card-name">{comp.name}</span>
                </button>
              ))}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="goke-properties-empty">No widgets match.</p>
        )}
      </div>
    </aside>
  );
}

export default ComponentPalette;
