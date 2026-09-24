/**
 * Single property control – pure React, no Bootstrap
 */

"use client";

import React from "react";
import type { ComponentProperty } from "../types";

interface PropertyFieldProps {
  property: ComponentProperty;
  value: string;
  onChange: (value: string | number | boolean) => void;
}

export function PropertyField({
  property,
  value,
  onChange,
}: PropertyFieldProps) {
  const id = `prop-${property.key}`;

  switch (property.inputType) {
    case "text":
    case "link":
      return (
        <div className="goke-field">
          <label htmlFor={id}>{property.name}</label>
          <input
            id={id}
            type="text"
            value={value}
            placeholder={property.placeholder}
            onChange={(e) => onChange(e.target.value)}
            onBlur={(e) => onChange(e.target.value)}
          />
        </div>
      );

    case "textarea":
      return (
        <div className="goke-field">
          <label htmlFor={id}>{property.name}</label>
          <textarea
            id={id}
            rows={3}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );

    case "number":
      return (
        <div className="goke-field">
          <label htmlFor={id}>{property.name}</label>
          <input
            id={id}
            type="number"
            value={value}
            min={property.min}
            max={property.max}
            step={property.step}
            onChange={(e) => onChange(Number(e.target.value))}
          />
        </div>
      );

    case "select":
      return (
        <div className="goke-field">
          <label htmlFor={id}>{property.name}</label>
          <select
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          >
            {(property.options ?? []).map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      );

    case "color":
      return (
        <div className="goke-field goke-field-color">
          <label htmlFor={id}>{property.name}</label>
          <div className="goke-color-row">
            <input
              id={id}
              type="color"
              value={value || "#000000"}
              onChange={(e) => onChange(e.target.value)}
            />
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder="#000000"
            />
          </div>
        </div>
      );

    case "checkbox":
      return (
        <div className="goke-field goke-field-check">
          <label>
            <input
              type="checkbox"
              checked={value === "true" || value === "1"}
              onChange={(e) => onChange(e.target.checked)}
            />
            {property.name}
          </label>
        </div>
      );

    case "range":
      return (
        <div className="goke-field">
          <label htmlFor={id}>
            {property.name}: {value}
          </label>
          <input
            id={id}
            type="range"
            min={property.min ?? 0}
            max={property.max ?? 100}
            step={property.step ?? 1}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );

    case "css-unit": {
      const match = String(value).match(/^([\d.]+)([a-z%]*)$/i);
      const num = match ? match[1] : "";
      const unit = match ? match[2] || "px" : "px";
      const units = property.units ?? ["px", "rem", "%", "em"];

      return (
        <div className="goke-field">
          <label>{property.name}</label>
          <div className="goke-unit-row">
            <input
              type="number"
              value={num}
              onChange={(e) => onChange(e.target.value + unit)}
            />
            <select
              value={unit}
              onChange={(e) => onChange(num + e.target.value)}
            >
              {units.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
        </div>
      );
    }

    case "image":
      return (
        <div className="goke-field">
          <label htmlFor={id}>{property.name}</label>
          <input
            id={id}
            type="text"
            value={value}
            placeholder="https://… or /path/to/image"
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );

    case "section":
      return (
        <div className="goke-field-section">
          <h4>{property.name}</h4>
        </div>
      );

    default:
      return null;
  }
}

export default PropertyField;
