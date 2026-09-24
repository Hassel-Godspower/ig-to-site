/**
 * Tier 2 — Saved section templates + insert into canvas
 */

"use client";

import React, { useEffect, useState } from "react";
import {
  listTemplates,
  deleteTemplate,
  type StoredTemplate,
} from "@/lib/templateStore";

interface TemplatesPanelProps {
  onInsert: (html: string) => void;
  refreshKey?: number;
}

export function TemplatesPanel({ onInsert, refreshKey }: TemplatesPanelProps) {
  const [items, setItems] = useState<StoredTemplate[]>([]);

  useEffect(() => {
    setItems(listTemplates());
  }, [refreshKey]);

  if (items.length === 0) {
    return (
      <div className="goke-templates-panel">
        <p className="goke-properties-empty">
          No saved sections yet. Select a section and click{" "}
          <strong>Save template</strong> on the context bar.
        </p>
      </div>
    );
  }

  return (
    <div className="goke-templates-panel">
      <ul className="goke-palette-list">
        {items.map((tpl) => (
          <li key={tpl.id} className="goke-template-row">
            <button
              type="button"
              className="goke-palette-item"
              style={{ flex: 1 }}
              onClick={() => onInsert(tpl.html)}
              title="Insert into page"
            >
              <span className="goke-palette-icon">⧉</span>
              <span className="goke-palette-name">{tpl.name}</span>
            </button>
            <button
              type="button"
              className="goke-tpl-delete"
              title="Delete template"
              onClick={() => setItems(deleteTemplate(tpl.id))}
            >
              ×
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TemplatesPanel;
