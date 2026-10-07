"use client";

import { useEffect, useState } from "react";

const DEFAULT_PHRASES = [
  "Generating your website",
  "Reading your brand",
  "Picking a niche layout",
  "Writing your copy",
  "Building pages",
  "Polishing the design",
];

interface GeneratingIndicatorProps {
  phrases?: string[];
  intervalMs?: number;
  /** Use on purple primary buttons */
  onPrimary?: boolean;
}

export default function GeneratingIndicator({
  phrases = DEFAULT_PHRASES,
  intervalMs = 1600,
  onPrimary = true,
}: GeneratingIndicatorProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % phrases.length);
    }, intervalMs);
    return () => clearInterval(id);
  }, [phrases, intervalMs]);

  return (
    <span
      className={`goke-gen${onPrimary ? " goke-gen--on-primary" : ""}`}
      role="status"
      aria-live="polite"
    >
      <span className="goke-gen-dots" aria-hidden>
        <span />
        <span />
        <span />
      </span>
      <span key={index} className="goke-gen-label">
        {phrases[index]}…
      </span>
      <style>{`
        .goke-gen {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          font-size: inherit;
          font-weight: inherit;
          line-height: 1.2;
          color: inherit;
          pointer-events: none;
        }
        .goke-gen-dots {
          display: inline-flex;
          gap: 4px;
          flex-shrink: 0;
        }
        .goke-gen-dots span {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: currentColor;
          animation: goke-gen-bounce 1.15s infinite ease-in-out;
        }
        .goke-gen-dots span:nth-child(2) { animation-delay: 0.15s; }
        .goke-gen-dots span:nth-child(3) { animation-delay: 0.3s; }

        .goke-gen-label {
          animation: goke-gen-fade 0.4s ease;
          white-space: nowrap;
        }

        @keyframes goke-gen-bounce {
          0%, 80%, 100% { transform: translateY(0); opacity: 0.35; }
          40% { transform: translateY(-4px); opacity: 1; }
        }
        @keyframes goke-gen-fade {
          from { opacity: 0; transform: translateY(3px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </span>
  );
}
