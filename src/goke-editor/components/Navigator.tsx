/**
 * Layers / structure tree — Elementor-style navigator
 */

"use client";

import React from "react";
import type { NavNode } from "../types/document";

interface NavigatorProps {
  tree: NavNode[];
  selectedElement: HTMLElement | null;
  onSelect: (el: HTMLElement) => void;
}

function NodeRow({
  node,
  selectedElement,
  onSelect,
}: {
  node: NavNode;
  selectedElement: HTMLElement | null;
  onSelect: (el: HTMLElement) => void;
}) {
  const active = selectedElement === node.element;
  return (
    <li>
      <button
        type="button"
        className={`goke-nav-item ${active ? "active" : ""}`}
        style={{ paddingLeft: 8 + node.depth * 12 }}
        onClick={() => onSelect(node.element)}
        title={node.tag}
      >
        <span className="goke-nav-tag">{node.tag}</span>
        <span className="goke-nav-label">{node.label}</span>
      </button>
      {node.children.length > 0 && (
        <ul>
          {node.children.map((child) => (
            <NodeRow
              key={child.id}
              node={child}
              selectedElement={selectedElement}
              onSelect={onSelect}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function Navigator({ tree, selectedElement, onSelect }: NavigatorProps) {
  return (
    <div className="goke-navigator">
      <div className="goke-palette-header">
        <h2>Structure</h2>
      </div>
      <div className="goke-navigator-body">
        {tree.length === 0 ? (
          <p className="goke-properties-empty">Page is empty</p>
        ) : (
          <ul className="goke-nav-tree">
            {tree.map((node) => (
              <NodeRow
                key={node.id}
                node={node}
                selectedElement={selectedElement}
                onSelect={onSelect}
              />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Navigator;
