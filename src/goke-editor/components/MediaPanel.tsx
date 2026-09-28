/**
 * Elementor-style media library — upload first, then click to use.
 */

"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useMediaUpload } from "../context/MediaContext";

type MediaItem = { filename: string; url: string };

interface MediaPanelProps {
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
      if (inputRef.current) inputRef.current.value = "";
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

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (file) void onUpload(file);
  }

  return (
    <div className="goke-media-panel" style={{ padding: 10 }}>
      <p style={{ fontSize: 12, color: "#9ca3af", marginBottom: 10, lineHeight: 1.45 }}>
        Upload images or video here, then click a thumbnail to apply it to the
        selected image — or insert a new image on the canvas.
      </p>

      {/* Always-visible upload zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        style={{
          border: "1px dashed #3b82f6",
          borderRadius: 10,
          padding: "20px 12px",
          textAlign: "center",
          cursor: busy ? "wait" : "pointer",
          background: "rgba(59,130,246,0.08)",
          marginBottom: 12,
        }}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/*,video/mp4,video/webm"
          style={{ display: "none" }}
          onChange={(e) => onUpload(e.target.files?.[0] ?? null)}
        />
        <div style={{ fontSize: 22, marginBottom: 6 }}>⬆</div>
        <div style={{ fontSize: 13, color: "#e5e7eb", fontWeight: 600 }}>
          {busy ? "Uploading…" : "Click or drop to upload"}
        </div>
        <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4 }}>
          PNG, JPG, WebP, GIF, MP4 · max 12MB
        </div>
      </div>

      {err && (
        <p style={{ color: "#f87171", fontSize: 12, marginBottom: 8 }}>{err}</p>
      )}

      {items.length === 0 ? (
        <p className="goke-properties-empty" style={{ fontSize: 12 }}>
          No media yet. Upload above — files stay with this job and publish with
          the site.
        </p>
      ) : (
        <div
          className="goke-media-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
          }}
        >
          {items.map((item) => {
            const isVideo = /\.(mp4|webm)$/i.test(item.filename);
            return (
              <div key={item.filename} className="goke-media-cell" style={{ position: "relative" }}>
                <button
                  type="button"
                  className="goke-media-thumb"
                  title="Use this media"
                  onClick={() => onPick(item.url)}
                  style={{
                    width: "100%",
                    aspectRatio: "1",
                    border: "1px solid #2a2f3c",
                    borderRadius: 8,
                    overflow: "hidden",
                    background: "#0b0d12",
                    padding: 0,
                    cursor: "pointer",
                  }}
                >
                  {isVideo ? (
                    <span style={{ color: "#93c5fd", fontSize: 11 }}>VIDEO</span>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.url}
                      alt=""
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  )}
                </button>
                <button
                  type="button"
                  title="Delete"
                  onClick={() => onDelete(item.filename)}
                  style={{
                    position: "absolute",
                    top: 4,
                    right: 4,
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    border: "none",
                    background: "rgba(0,0,0,0.65)",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: 14,
                    lineHeight: "22px",
                  }}
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
