/**
 * Step-by-step product tour for the gòke preview editor.
 * Highlights chrome targets (data-tour) with a spotlight + tooltip.
 */

"use client";

import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";

export type TourStep = {
  /** data-tour attribute value */
  target: string;
  title: string;
  body: string;
  /** Switch left rail tab before measuring */
  leftTab?: "structure" | "components" | "templates" | "media";
  placement?: "right" | "left" | "bottom" | "top";
};

const DEFAULT_STEPS: TourStep[] = [
  {
    target: "tour-components-tab",
    title: "Components",
    body: "Drag widgets from here onto the canvas — headings, buttons, images, sections, and kits. Search to find any block quickly.",
    leftTab: "components",
    placement: "right",
  },
  {
    target: "tour-components-panel",
    title: "Widget library",
    body: "Each card is a building block. Drag it onto a section of your site to add structure the way Elementor widgets work.",
    leftTab: "components",
    placement: "right",
  },
  {
    target: "tour-templates-tab",
    title: "Templates",
    body: "Use a starter or gòke main template to improve your design in one click — layout, sections, and polish without starting from scratch.",
    leftTab: "templates",
    placement: "right",
  },
  {
    target: "tour-templates-panel",
    title: "Apply a template",
    body: "Pick a template that matches your niche. You can merge it with your Instagram content instead of wiping the page.",
    leftTab: "templates",
    placement: "right",
  },
  {
    target: "tour-media-tab",
    title: "Media",
    body: "Upload logos, photos, and videos here first, then place them on the site — same idea as Elementor’s media library.",
    leftTab: "media",
    placement: "right",
  },
  {
    target: "tour-structure-tab",
    title: "Structure",
    body: "See every section and element as a tree. Click a row to select it on the canvas and edit it in Properties.",
    leftTab: "structure",
    placement: "right",
  },
  {
    target: "tour-canvas",
    title: "Canvas",
    body: "This is your live site. Click text, images, or buttons to edit them. Use Desktop / Tablet / Mobile above to check responsive layout.",
    placement: "left",
  },
  {
    target: "tour-properties",
    title: "Properties",
    body: "With something selected, change copy, links, colors, and design here — Content, Design, and Globals tabs.",
    placement: "left",
  },
  {
    target: "tour-page-switch",
    title: "Multiple pages",
    body: "Switch Home, About, Services, Gallery, and Contact here. Each page is part of the full site you publish.",
    placement: "bottom",
  },
  {
    target: "tour-go-live",
    title: "Go live",
    body: "When you’re happy, publish. We’ll host the full multi-page site so visitors see what you built in the editor.",
    placement: "bottom",
  },
];

type Rect = { top: number; left: number; width: number; height: number };

function measure(selector: string): Rect | null {
  const el = document.querySelector(`[data-tour="${selector}"]`) as HTMLElement | null;
  if (!el) return null;
  const r = el.getBoundingClientRect();
  if (r.width < 2 && r.height < 2) return null;
  return { top: r.top, left: r.left, width: r.width, height: r.height };
}

interface EditorTourProps {
  open: boolean;
  onClose: () => void;
  onLeftTab?: (tab: TourStep["leftTab"]) => void;
  steps?: TourStep[];
}

export function EditorTour({ open, onClose, onLeftTab, steps = DEFAULT_STEPS }: EditorTourProps) {
  const [index, setIndex] = useState(0);
  const [rect, setRect] = useState<Rect | null>(null);

  const step = steps[index];

  const refresh = useCallback(() => {
    if (!step) return;
    if (step.leftTab && onLeftTab) onLeftTab(step.leftTab);
    // Wait a frame for tab panel to mount
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setRect(measure(step.target));
      });
    });
  }, [step, onLeftTab]);

  useLayoutEffect(() => {
    if (!open) return;
    refresh();
  }, [open, index, refresh]);

  useEffect(() => {
    if (!open) return;
    const onWin = () => refresh();
    window.addEventListener("resize", onWin);
    window.addEventListener("scroll", onWin, true);
    return () => {
      window.removeEventListener("resize", onWin);
      window.removeEventListener("scroll", onWin, true);
    };
  }, [open, refresh]);

  useEffect(() => {
    if (!open) setIndex(0);
  }, [open]);

  if (!open || !step) return null;

  const pad = 8;
  const hole = rect
    ? {
        top: Math.max(0, rect.top - pad),
        left: Math.max(0, rect.left - pad),
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      }
    : null;

  const tipStyle: React.CSSProperties = (() => {
    const base: React.CSSProperties = {
      position: "fixed",
      zIndex: 10060,
      width: 300,
      maxWidth: "calc(100vw - 24px)",
      background: "#12151c",
      border: "1px solid rgba(167, 139, 250, 0.45)",
      borderRadius: 12,
      padding: "16px 16px 12px",
      boxShadow: "0 16px 48px rgba(0,0,0,0.55)",
      color: "#f3f4f6",
    };
    if (!hole) {
      return { ...base, top: "50%", left: "50%", transform: "translate(-50%, -50%)" };
    }
    const place = step.placement || "right";
    if (place === "right") {
      return {
        ...base,
        top: Math.min(hole.top, window.innerHeight - 200),
        left: Math.min(hole.left + hole.width + 12, window.innerWidth - 320),
      };
    }
    if (place === "left") {
      return {
        ...base,
        top: Math.min(hole.top, window.innerHeight - 200),
        left: Math.max(12, hole.left - 312),
      };
    }
    if (place === "bottom") {
      return {
        ...base,
        top: Math.min(hole.top + hole.height + 12, window.innerHeight - 180),
        left: Math.max(12, Math.min(hole.left, window.innerWidth - 320)),
      };
    }
    return {
      ...base,
      top: Math.max(12, hole.top - 160),
      left: Math.max(12, Math.min(hole.left, window.innerWidth - 320)),
    };
  })();

  const isLast = index >= steps.length - 1;

  return (
    <div className="goke-tour" aria-modal="true" role="dialog" aria-labelledby="goke-tour-title">
      {/* Dim layer with spotlight cutout */}
      <div className="goke-tour-dim" aria-hidden>
        {hole ? (
          <div
            className="goke-tour-hole"
            style={{
              top: hole.top,
              left: hole.left,
              width: hole.width,
              height: hole.height,
            }}
          />
        ) : null}
      </div>

      <div style={tipStyle}>
        <div style={{ fontSize: 11, color: "#a78bfa", fontWeight: 600, marginBottom: 6 }}>
          Step {index + 1} of {steps.length}
        </div>
        <h3 id="goke-tour-title" style={{ margin: "0 0 8px", fontSize: 16, fontWeight: 600 }}>
          {step.title}
        </h3>
        <p style={{ margin: "0 0 14px", fontSize: 13, lineHeight: 1.45, color: "#c4c4c4" }}>
          {step.body}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
          <button
            type="button"
            onClick={onClose}
            style={btnGhost}
          >
            Skip tour
          </button>
          <div style={{ display: "flex", gap: 8 }}>
            {index > 0 && (
              <button type="button" onClick={() => setIndex((i) => i - 1)} style={btnGhost}>
                Back
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                if (isLast) onClose();
                else setIndex((i) => i + 1);
              }}
              style={btnPrimary}
            >
              {isLast ? "Got it" : "Next"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        .goke-tour-dim {
          position: fixed;
          inset: 0;
          z-index: 10055;
          background: rgba(0, 0, 0, 0.62);
          pointer-events: auto;
        }
        .goke-tour-hole {
          position: fixed;
          border-radius: 10px;
          box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.62);
          border: 2px solid #a78bfa;
          pointer-events: none;
          transition: top 0.2s ease, left 0.2s ease, width 0.2s ease, height 0.2s ease;
        }
        .goke-tour-dim {
          background: transparent;
        }
      `}</style>
    </div>
  );
}

const btnGhost: React.CSSProperties = {
  background: "transparent",
  color: "#d4d4d4",
  border: "1px solid #2a2a2a",
  borderRadius: 8,
  padding: "8px 12px",
  fontSize: 12,
  cursor: "pointer",
};

const btnPrimary: React.CSSProperties = {
  background: "#a78bfa",
  color: "#0b0d12",
  border: "none",
  borderRadius: 8,
  padding: "8px 14px",
  fontSize: 12,
  fontWeight: 600,
  cursor: "pointer",
};

export function shouldAutoStartTour(jobId: string): boolean {
  try {
    return !localStorage.getItem(`goke-tour-done-${jobId}`) && !localStorage.getItem("goke-tour-done");
  } catch {
    return true;
  }
}

export function markTourDone(jobId: string) {
  try {
    localStorage.setItem(`goke-tour-done-${jobId}`, "1");
    localStorage.setItem("goke-tour-done", "1");
  } catch {
    /* ignore */
  }
}
