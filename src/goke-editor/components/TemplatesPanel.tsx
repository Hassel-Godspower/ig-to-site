/**
 * Templates panel — user-saved sections + full-page starters
 * (dawidolko/Website-Templates via CDN).
 */

"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  listTemplates,
  deleteTemplate,
  type StoredTemplate,
} from "@/lib/templateStore";
import {
  STARTER_TEMPLATES,
  starterCategories,
  type StarterTemplate,
} from "../data/starter-templates";

interface TemplatesPanelProps {
  onInsert: (html: string) => void;
  /** Replace the whole canvas with a starter page */
  onApplyStarter?: (starter: StarterTemplate) => void | Promise<void>;
  refreshKey?: number;
}

export function TemplatesPanel({
  onInsert,
  onApplyStarter,
  refreshKey,
}: TemplatesPanelProps) {
  const [items, setItems] = useState<StoredTemplate[]>([]);
  const [tab, setTab] = useState<"starters" | "saved">("starters");
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setItems(listTemplates());
  }, [refreshKey]);

  const categories = useMemo(() => ["All", ...starterCategories()], []);

  const starters = useMemo(() => {
    let list =
      category === "All"
        ? STARTER_TEMPLATES
        : STARTER_TEMPLATES.filter((t) => t.category === category);
    const q = query.trim().toLowerCase();
    if (q) {
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.id.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [category, query]);

  async function applyStarter(tpl: StarterTemplate) {
    if (!onApplyStarter) return;
    setError(null);
    setLoadingId(tpl.id);
    try {
      await onApplyStarter(tpl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load template");
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <div className="goke-templates-panel">
      <div className="goke-tpl-tabs">
        <button
          type="button"
          className={tab === "starters" ? "active" : ""}
          onClick={() => setTab("starters")}
        >
          Starters ({STARTER_TEMPLATES.length})
        </button>
        <button
          type="button"
          className={tab === "saved" ? "active" : ""}
          onClick={() => setTab("saved")}
        >
          Saved ({items.length})
        </button>
      </div>

      {tab === "starters" && (
        <>
          <p className="goke-properties-empty" style={{ marginBottom: 8 }}>
            Full-page HTML templates (
            <a
              href="https://github.com/dawidolko/Website-Templates"
              target="_blank"
              rel="noopener noreferrer"
            >
              MIT
            </a>
            ). Applying replaces the current page.
          </p>
          <input
            type="search"
            className="goke-tpl-search"
            placeholder="Search starters…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <select
            className="goke-tpl-category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          {error && (
            <p className="goke-properties-empty" style={{ color: "#ef4444" }}>
              {error}
            </p>
          )}
          <ul className="goke-palette-list goke-starter-list">
            {starters.map((tpl) => (
              <li key={tpl.id} className="goke-template-row">
                <button
                  type="button"
                  className="goke-palette-item"
                  style={{ flex: 1 }}
                  disabled={!!loadingId || !onApplyStarter}
                  onClick={() => applyStarter(tpl)}
                  title="Apply full page template"
                >
                  <span className="goke-palette-icon">
                    {loadingId === tpl.id ? "…" : "▣"}
                  </span>
                  <span className="goke-palette-name">
                    {tpl.name}
                    <span className="goke-tpl-cat">{tpl.category}</span>
                  </span>
                </button>
                <a
                  className="goke-tpl-preview"
                  href={tpl.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Live preview"
                  onClick={(e) => e.stopPropagation()}
                >
                  ↗
                </a>
              </li>
            ))}
            {starters.length === 0 && (
              <li>
                <p className="goke-properties-empty">No starters match.</p>
              </li>
            )}
          </ul>
        </>
      )}

      {tab === "saved" && (
        <>
          {items.length === 0 ? (
            <p className="goke-properties-empty">
              No saved sections yet. Select a section and click{" "}
              <strong>Save template</strong> on the context bar.
            </p>
          ) : (
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
          )}
        </>
      )}
    </div>
  );
}

export default TemplatesPanel;
