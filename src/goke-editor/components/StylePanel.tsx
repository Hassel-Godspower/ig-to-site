/**
 * Design panel — layout, spacing (per-side), type, bg, border, hover
 * Respects active breakpoint.
 */

"use client";

import React, { useMemo, useState } from "react";
import {
  STYLE_GROUPS,
  getStyle,
  setStyle,
  getSpacingBox,
  setSpacingBox,
  type StyleGroupId,
} from "../core/style-engine";
import type { Breakpoint } from "../types/document";
import { PropertyField } from "./PropertyField";
import type { ComponentProperty } from "../types";

interface StylePanelProps {
  element: HTMLElement | null;
  breakpoint: Breakpoint;
  onChange: () => void;
}

const GROUP_ORDER: StyleGroupId[] = [
  "layout",
  "spacing",
  "typography",
  "background",
  "border",
  "hover",
];

export function StylePanel({
  element,
  breakpoint,
  onChange,
}: StylePanelProps) {
  // Force re-read when element or breakpoint changes
  const [tick, setTick] = useState(0);

  const values = useMemo(() => {
    if (!element) return {} as Record<string, string>;
    const map: Record<string, string> = {};
    for (const gid of GROUP_ORDER) {
      for (const c of STYLE_GROUPS[gid].controls) {
        if (c.inputType === "spacing-box") continue;
        map[`${c.hover ? "hover:" : ""}${c.cssProperty}`] = getStyle(
          element,
          c.cssProperty,
          breakpoint,
          !!c.hover
        );
      }
    }
    return map;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [element, breakpoint, tick]);

  if (!element) return null;

  function bump() {
    setTick((t) => t + 1);
    onChange();
  }

  function handleChange(
    cssProperty: string,
    value: string | number | boolean,
    hover = false
  ) {
    if (!element) return;
    setStyle(element, cssProperty, String(value), breakpoint, hover);
    bump();
  }

  return (
    <div className="goke-style-panel">
      <div className="goke-field-section">
        <h4>Design · {breakpoint}</h4>
      </div>
      {GROUP_ORDER.map((gid) => {
        const group = STYLE_GROUPS[gid];
        return (
          <div key={gid} className="goke-style-group">
            <div className="goke-style-group-title">{group.label}</div>
            {group.controls.map((control) => {
              if (control.inputType === "spacing-box") {
                const prefix = control.cssProperty as "margin" | "padding";
                const sides = getSpacingBox(element, prefix, breakpoint);
                return (
                  <PropertyField
                    key={control.key}
                    property={{
                      name: control.label,
                      key: control.key,
                      inputType: "spacing-box" as ComponentProperty["inputType"],
                    }}
                    value=""
                    onChange={() => {}}
                    spacingValue={sides}
                    onSpacingChange={(next) => {
                      setSpacingBox(element, prefix, next, breakpoint);
                      bump();
                    }}
                  />
                );
              }

              const prop: ComponentProperty = {
                name: control.label,
                key: control.key,
                cssProperty: control.cssProperty,
                inputType: control.inputType as ComponentProperty["inputType"],
                options: control.options,
                units: control.units,
              };
              const valKey = `${control.hover ? "hover:" : ""}${control.cssProperty}`;
              return (
                <PropertyField
                  key={control.key + (control.hover ? "-h" : "")}
                  property={prop}
                  value={values[valKey] ?? ""}
                  onChange={(val) =>
                    handleChange(control.cssProperty, val, !!control.hover)
                  }
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default StylePanel;
