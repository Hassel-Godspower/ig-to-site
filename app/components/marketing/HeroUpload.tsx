"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

/** Vercel body limit ~4.5 MB — stay under 4 MB for multipart overhead. */
const MAX_FILE_BYTES = 4 * 1024 * 1024;

export function HeroUpload() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);

  const acceptFile = useCallback((selected: File | null) => {
    setError(null);
    if (!selected) {
      setFile(null);
      return;
    }
    if (selected.size > MAX_FILE_BYTES) {
      setFile(null);
      if (inputRef.current) inputRef.current.value = "";
      setError(
        `That file is ${(selected.size / 1024 / 1024).toFixed(1)} MB — over the 4 MB limit. ` +
          `Export only profile and posts (not messages or full media) to keep it small.`
      );
      return;
    }
    setFile(selected);
  }, []);

  function onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    acceptFile(e.target.files?.[0] ?? null);
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDrag(false);
    const f = e.dataTransfer.files?.[0] ?? null;
    if (f && !/\.(zip|json)$/i.test(f.name)) {
      setError("Please upload a .zip or .json Instagram data export.");
      return;
    }
    acceptFile(f);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!file) {
      setError("Upload your Instagram data export first.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/generate", { method: "POST", body: formData });
      const contentType = res.headers.get("content-type") ?? "";

      if (!contentType.includes("application/json")) {
        if (res.status === 413) {
          throw new Error(
            "That file is too large to upload. Export just your profile and posts " +
              "(not messages, stories, or media) to keep it under 4 MB."
          );
        }
        throw new Error(`Upload failed (${res.status}). Please try again.`);
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Generation failed");
      router.push(`/preview/${data.jobId}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong";
      setError(message);
      setLoading(false);
    }
  }

  return (
    <div className="gk-upload-card" id="start">
      <h2>Start from your Instagram export</h2>
      <p className="gk-card-sub">
        Upload a data export (.zip or .json). We build a site you can preview and edit —
        you only pay when you go live.
      </p>

      <form onSubmit={handleSubmit}>
        <div
          className={`gk-dropzone${drag ? " is-drag" : ""}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDrag(true);
          }}
          onDragLeave={() => setDrag(false)}
          onDrop={onDrop}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".zip,.json"
            onChange={onInputChange}
            aria-label="Instagram data export file"
          />
          <div className="gk-dropzone-icon" aria-hidden>
            ↑
          </div>
          <strong>Drop export here, or click to browse</strong>
          <span>.zip or .json · under 4 MB</span>
        </div>

        {file && (
          <div className="gk-file-chip">
            <span aria-hidden>📄</span>
            <strong title={file.name}>{file.name}</strong>
            <span>{(file.size / 1024).toFixed(0)} KB</span>
          </div>
        )}

        {error && <p className="gk-error">{error}</p>}

        {!file && !error && (
          <p className="gk-upload-hint">Choose a file to continue</p>
        )}

        <button
          type="submit"
          className="gk-btn gk-btn-primary gk-btn-lg gk-btn-block"
          disabled={loading || !file}
        >
          {loading ? (
            <>
              <span className="gk-spinner" aria-hidden />
              Building your site…
            </>
          ) : (
            "Generate my site"
          )}
        </button>
      </form>

      <p className="gk-upload-foot">
        Need the export file?{" "}
        <Link href="/how-to-export">How to download Instagram data</Link>
      </p>
    </div>
  );
}
