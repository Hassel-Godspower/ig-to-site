/**
 * Left sidebar – component palette
 */

"use client";

import React from "react";
import { registry } from "../core/registry";

interface ComponentPaletteProps {
  onDragStart: (type: string, e: React.DragEvent) => void;
}

export function ComponentPalette({ onDragStart }: ComponentPaletteProps) {
  const categories = registry.getCategories();

  return (
    <aside className="goke-palette">
      <div className="goke-palette-header">
        <h2>Components</h2>
      </div>
      <div className="goke-palette-body">
        {categories.map((cat) => {
          const items = registry.getByCategory(cat);
          return (
            <div key={cat} className="goke-palette-group">
              <div className="goke-palette-group-title">{cat}</div>
              <ul>
                {items.map((comp) => (
                  <li
                    key={comp.type}
                    draggable
                    onDragStart={(e) => onDragStart(comp.type, e)}
                    className="goke-palette-item"
                    title={comp.name}
                  >
                    <span className="goke-palette-icon">
                      {comp.icon ?? "◇"}
                    </span>
                    <span className="goke-palette-name">{comp.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export default ComponentPalette;
