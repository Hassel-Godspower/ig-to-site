/**
 * Templates panel
 * - Gòke: first-party packs in /public/goke-templates
 * - Starters: external CDN HTML starters
 * - Saved: user-captured sections
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
import {
  GOKE_MAIN_TEMPLATES,
  gokeMainCategories,
  type GokeMainTemplate,
} from "../data/goke-main-templates";

export type StarterApplyMode = "merge" | "replace";

interface TemplatesPanelProps {
  onInsert: (html: string) => void;
  onApplyStarter?: (
    starter: StarterTemplate,
    mode: StarterApplyMode
  ) => void | Promise<void>;
  onApplyGokeMain?: (
    template: GokeMainTemplate,
    mode: StarterApplyMode
  ) => void | Promise<void>;
  refreshKey?: number;
}

export function TemplatesPanel({
  onInsert,
  onApplyStarter,
  onApplyGokeMain,
  refreshKey,
}: TemplatesPanelProps) {
  const [items, setItems] = useState<StoredTemplate[]>([]);
  const [tab, setTab] = useState<"goke" | "starters" | "saved">("goke");
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<StarterApplyMode>("merge");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setItems(listTemplates());
  }, [refreshKey]);

  useEffect(() => {
    setCategory("All");
    setQuery("");
  }, [tab]);

  const gokeCategories = useMemo(() => ["All", ...gokeMainCategories()], []);
  const starterCats = useMemo(() => ["All", ...starterCategories()], []);

  const gokeList = useMemo(() => {
    let list =
      category === "All"
        ? GOKE_MAIN_TEMPLATES
        : GOKE_MAIN_TEMPLATES.filter((t) => t.category === category);
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
      await onApplyStarter(tpl, mode);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load template");
    } finally {
      setLoadingId(null);
    }
  }

  async function applyGoke(tpl: GokeMainTemplate) {
    if (!onApplyGokeMain) return;
    setError(null);
    setLoadingId(tpl.id);
    try {
      await onApplyGokeMain(tpl, mode);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load Gòke template");
    } finally {
      setLoadingId(null);
    }
  }

  const categories = tab === "goke" ? gokeCategories : starterCats;

  return (
    <div className="goke-templates-panel">
      <div className="goke-tpl-tabs">
        <button
          type="button"
          className={tab === "goke" ? "active" : ""}
          onClick={() => setTab("goke")}
        >
          Gòke ({GOKE_MAIN_TEMPLATES.length})
        </button>
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

      {(tab === "goke" || tab === "starters") && (
        <>
          <p className="goke-properties-empty" style={{ margin: "8px 10px" }}>
            {tab === "goke" ? (
              <>
                Official Gòke packs. Prefer <strong>Keep content</strong> to
                sync Instagram text into the design.
              </>
            ) : (
              <>
                Community HTML starters (CDN). Prefer{" "}
                <strong>Keep content</strong> so Instagram data survives.
              </>
            )}
          </p>

          <div className="goke-tpl-mode" style={{ padding: "0 10px 8px" }}>
            <label style={{ marginRight: 12, fontSize: 12 }}>
              <input
                type="radio"
                name="tpl-mode"
                checked={mode === "merge"}
                onChange={() => setMode("merge")}
              />{" "}
              Keep content (sync)
            </label>
            <label style={{ fontSize: 12 }}>
              <input
                type="radio"
                name="tpl-mode"
                checked={mode === "replace"}
                onChange={() => setMode("replace")}
              />{" "}
              Replace page
            </label>
          </div>

          <div className="goke-palette-search-wrap">
            <input
              type="search"
              className="goke-palette-search"
              placeholder={
                tab === "goke" ? "Search Gòke templates…" : "Search starters…"
              }
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 4,
              padding: "6px 10px",
            }}
          >
            {categories.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                style={{
                  fontSize: 11,
                  padding: "2px 8px",
                  borderRadius: 12,
                  border:
                    category === c
                      ? "1px solid #3b82f6"
                      : "1px solid #2a2f3c",
                  background: category === c ? "#1e3a5f" : "transparent",
                  color: "#e8eaed",
                  cursor: "pointer",
                }}
              >
                {c}
              </button>
            ))}
          </div>

          {error && (
            <p
              className="goke-properties-empty"
              style={{ color: "#ef4444", padding: "0 10px" }}
            >
              {error}
            </p>
          )}

          {tab === "goke" && (
            <ul className="goke-palette-list">
              {gokeList.map((tpl) => (
                <li key={tpl.id} className="goke-template-row">
                  <button
                    type="button"
                    className="goke-palette-item"
                    style={{ flex: 1 }}
                    disabled={!onApplyGokeMain || loadingId === tpl.id}
                    onClick={() => applyGoke(tpl)}
                  >
                    <span className="goke-palette-icon">
                      {loadingId === tpl.id ? "…" : "◆"}
                    </span>
                    <span className="goke-palette-name">
                      {tpl.name}
                      <span className="goke-tpl-cat">{tpl.category}</span>
                    </span>
                  </button>
                </li>
              ))}
              {gokeList.length === 0 && (
                <li>
                  <p className="goke-properties-empty">No Gòke templates match.</p>
                </li>
              )}
            </ul>
          )}

          {tab === "starters" && (
            <ul className="goke-palette-list">
              {starters.map((tpl) => (
                <li key={tpl.id} className="goke-template-row">
                  <button
                    type="button"
                    className="goke-palette-item"
                    style={{ flex: 1 }}
                    disabled={!onApplyStarter || loadingId === tpl.id}
                    onClick={() => applyStarter(tpl)}
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
          )}
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
                  >
                    <span className="goke-palette-icon">⧉</span>
                    <span className="goke-palette-name">{tpl.name}</span>
                  </button>
                  <button
                    type="button"
                    className="goke-tpl-delete"
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
