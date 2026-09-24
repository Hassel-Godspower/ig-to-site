/**
 * Properties of the selected element (content controls)
 */

"use client";

import React, { useMemo } from "react";
import type { ComponentDefinition, ComponentProperty } from "../types";
import { styleManager } from "../core/style-manager";
import { PropertyField } from "./PropertyField";

interface PropertiesPanelProps {
  element: HTMLElement | null;
  component: ComponentDefinition | null;
  onUpdate: (
    key: string,
    value: string | number | boolean,
    property: ComponentProperty
  ) => void;
  /** When true, render fields only (parent owns the aside shell) */
  embedded?: boolean;
}

function readValue(el: HTMLElement, prop: ComponentProperty): string {
  let target = el;
  if (prop.child) {
    const child = el.querySelector(prop.child) as HTMLElement | null;
    if (child) target = child;
  }

  if (prop.htmlAttr) {
    return target.getAttribute(prop.htmlAttr) ?? "";
  }
  if (prop.cssProperty) {
    return (
      styleManager.getStyle(target, prop.cssProperty, true) ||
      styleManager.getStyle(target, prop.cssProperty) ||
      ""
    );
  }
  if (prop.key === "text" || prop.inputType === "textarea") {
    return target.textContent ?? "";
  }
  return String(prop.defaultValue ?? "");
}

export function PropertiesPanel({
  element,
  component,
  onUpdate,
  embedded = false,
}: PropertiesPanelProps) {
  const properties = component?.properties ?? [];

  const values = useMemo(() => {
    if (!element) return {};
    const map: Record<string, string> = {};
    for (const p of properties) {
      map[p.key] = readValue(element, p);
    }
    return map;
  }, [element, properties]);

  const fields = (
    <>
      {!element || !component ? (
        <p className="goke-properties-empty">Select an element on the canvas</p>
      ) : properties.length === 0 ? (
        <p className="goke-properties-empty">
          No content properties — use the Design tab
        </p>
      ) : (
        properties.map((prop) => (
          <PropertyField
            key={prop.key}
            property={prop}
            value={values[prop.key] ?? ""}
            onChange={(val) => onUpdate(prop.key, val, prop)}
          />
        ))
      )}
    </>
  );

  if (embedded) return <div>{fields}</div>;

  return (
    <aside className="goke-properties">
      <div className="goke-properties-header">
        <h2>{component?.name || "Properties"}</h2>
        {component && (
          <span className="goke-properties-type">{component.type}</span>
        )}
      </div>
      <div className="goke-properties-body">{fields}</div>
    </aside>
  );
}

export default PropertiesPanel;
