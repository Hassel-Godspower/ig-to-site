/**
 * Elementor-style media library — upload first, then click to use.
 */

"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useMediaUpload } from "../context/MediaContext";

type MediaItem = { filename: string; url: string };

interface MediaPanelProps {
  /** Apply URL to the currently selected <img> (or any handler) */
  onPick: (url: string) => void;
}

export function MediaPanel({ onPick }: MediaPanelProps) {
  const { jobId, uploadFile } = useMediaUpload();
  const [items, setItems] = useState<MediaItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const refresh = useCallback(async () => {
    if (!jobId) return;
    try {
      const res = await fetch(`/api/site/${jobId}/media`);
      const data = await res.json();
      if (res.ok) setItems(data.items || []);
    } catch {
      /* ignore */
    }
  }, [jobId]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function onUpload(file: File | null) {
    if (!file) return;
    setErr(null);
    setBusy(true);
    try {
      await uploadFile(file);
      await refresh();
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  }

  async function onDelete(filename: string) {
    if (!jobId) return;
    if (!window.confirm(`Remove ${filename}?`)) return;
    const res = await fetch(
      `/api/site/${jobId}/media?file=${encodeURIComponent(filename)}`,
      { method: "DELETE" }
    );
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setErr(data.error || "Delete failed");
      return;
    }
    await refresh();
  }

  return (
    <div className="goke-media-panel">
      <p className="goke-properties-empty" style={{ marginBottom: 8 }}>
        Upload images/video first, then click a thumbnail to set the selected
        image&apos;s source (or insert later from Properties).
      </p>
      <div className="goke-image-actions" style={{ marginBottom: 10 }}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/mp4,video/webm"
          style={{ display: "none" }}
          onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          className="goke-btn-upload"
          disabled={busy || !jobId}
          onClick={() => inputRef.current?.click()}
        >
          {busy ? "Uploading…" : "Upload media"}
        </button>
      </div>
      {err && (
        <p className="goke-properties-empty" style={{ color: "#ef4444" }}>
          {err}
        </p>
      )}
      {items.length === 0 ? (
        <p className="goke-properties-empty">No uploads yet.</p>
      ) : (
        <div className="goke-media-grid">
          {items.map((item) => {
            const isVideo = /\.(mp4|webm)$/i.test(item.filename);
            return (
              <div key={item.filename} className="goke-media-cell">
                <button
                  type="button"
                  className="goke-media-thumb"
                  title="Use this media"
                  onClick={() => onPick(item.url)}
                >
                  {isVideo ? (
                    <span className="goke-media-video-label">VIDEO</span>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.url} alt="" />
                  )}
                </button>
                <button
                  type="button"
                  className="goke-media-del"
                  title="Delete"
                  onClick={() => onDelete(item.filename)}
                >
                  ×
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MediaPanel;
