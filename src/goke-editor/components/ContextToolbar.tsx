/**
 * Floating context toolbar
 * Move · Duplicate · Copy style · Paste style · Save template · Delete
 */

"use client";

import React, { useEffect, useState } from "react";

interface ContextToolbarProps {
  element: HTMLElement | null;
  iframe: HTMLIFrameElement | null;
  onDuplicate: () => void;
  onDelete: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onCopyStyle?: () => void;
  onPasteStyle?: () => void;
  onSaveTemplate?: () => void;
  canPasteStyle?: boolean;
}

export function ContextToolbar({
  element,
  iframe,
  onDuplicate,
  onDelete,
  onMoveUp,
  onMoveDown,
  onCopyStyle,
  onPasteStyle,
  onSaveTemplate,
  canPasteStyle,
}: ContextToolbarProps) {
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  useEffect(() => {
    if (!element || !iframe) {
      setPos(null);
      return;
    }
    const update = () => {
      const iframeRect = iframe.getBoundingClientRect();
      const rect = element.getBoundingClientRect();
      setPos({
        top: iframeRect.top + rect.top + window.scrollY - 36,
        left: iframeRect.left + rect.left + window.scrollX,
      });
    };
    update();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [element, iframe]);

  if (!pos || !element) return null;

  return (
    <div
      className="goke-context-toolbar"
      style={{ top: pos.top, left: Math.max(8, pos.left) }}
    >
      <button type="button" title="Move up" onClick={onMoveUp}>
        ↑
      </button>
      <button type="button" title="Move down" onClick={onMoveDown}>
        ↓
      </button>
      <button type="button" title="Duplicate" onClick={onDuplicate}>
        Duplicate
      </button>
      {onCopyStyle && (
        <button type="button" title="Copy styles" onClick={onCopyStyle}>
          Copy style
        </button>
      )}
      {onPasteStyle && (
        <button
          type="button"
          title="Paste styles"
          onClick={onPasteStyle}
          disabled={!canPasteStyle}
        >
          Paste style
        </button>
      )}
      {onSaveTemplate && (
        <button type="button" title="Save as template" onClick={onSaveTemplate}>
          Save template
        </button>
      )}
      <button
        type="button"
        title="Delete"
        className="goke-ctx-danger"
        onClick={onDelete}
      >
        Delete
      </button>
    </div>
  );
}

export default ContextToolbar;
