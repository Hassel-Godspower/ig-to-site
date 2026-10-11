"use client";

import { useTheme } from "./ThemeProvider";

type Props = {
  variant?: "header" | "compact";
  className?: string;
};

export function ThemeToggle({ variant = "header", className = "" }: Props) {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  const label = isDark ? "Switch to light mode" : "Switch to dark mode";

  if (variant === "compact") {
    return (
      <button
        type="button"
        className={`goke-theme-btn ${className}`.trim()}
        onClick={toggle}
        aria-label={label}
        title={label}
      >
        {isDark ? "☀" : "☾"}
      </button>
    );
  }

  return (
    <button
      type="button"
      className={`gk-theme-toggle ${className}`.trim()}
      onClick={toggle}
      aria-label={label}
      title={label}
    >
      <span aria-hidden="true" style={{ fontSize: "1.05rem", lineHeight: 1 }}>
        {isDark ? "☀" : "☾"}
      </span>
      <span className="gk-theme-toggle-label">{isDark ? "Light" : "Dark"}</span>
    </button>
  );
}
