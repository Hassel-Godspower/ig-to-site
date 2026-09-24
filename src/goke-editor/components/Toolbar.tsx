/**
 * Top toolbar – undo/redo, device, save, preview
 */

"use client";

import React from "react";
import type { EditorState } from "../types";

interface ToolbarProps {
  canUndo: boolean;
  canRedo: boolean;
  device: EditorState["device"];
  mode: EditorState["mode"];
  onUndo: () => void;
  onRedo: () => void;
  onDevice: (d: EditorState["device"]) => void;
  onMode: (m: EditorState["mode"]) => void;
  onSave: () => void;
}

export function Toolbar({
  canUndo,
  canRedo,
  device,
  mode,
  onUndo,
  onRedo,
  onDevice,
  onMode,
  onSave,
}: ToolbarProps) {
  return (
    <header className="goke-toolbar">
      <div className="goke-toolbar-left">
        <span className="goke-logo">gòke</span>
        <div className="goke-toolbar-group">
          <button
            type="button"
            disabled={!canUndo}
            onClick={onUndo}
            title="Undo"
          >
            ↶ Undo
          </button>
          <button
            type="button"
            disabled={!canRedo}
            onClick={onRedo}
            title="Redo"
          >
            ↷ Redo
          </button>
        </div>
      </div>

      <div className="goke-toolbar-center">
        <div className="goke-device-switch">
          {(
            [
              ["desktop", "Desktop"],
              ["tablet", "Tablet"],
              ["mobile", "Mobile"],
            ] as const
          ).map(([id, label]) => (
            <button
              key={id}
              type="button"
              className={device === id ? "active" : ""}
              onClick={() => onDevice(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="goke-toolbar-right">
        <button
          type="button"
          className={mode === "preview" ? "active" : ""}
          onClick={() => onMode(mode === "edit" ? "preview" : "edit")}
        >
          {mode === "edit" ? "Preview" : "Edit"}
        </button>
        <button type="button" className="goke-btn-primary" onClick={onSave}>
          Save
        </button>
      </div>
    </header>
  );
}

export default Toolbar;
