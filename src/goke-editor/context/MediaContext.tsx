/**
 * Job-scoped media upload for PropertyField / IconPicker.
 * Always claims edit token before POST /upload.
 */

"use client";

import React, { createContext, useCallback, useContext } from "react";
import { editAuthHeaders, ensureEditToken } from "@/lib/editTokenClient";

type MediaContextValue = {
  jobId: string | null;
  uploadFile: (file: File) => Promise<string>;
};

const MediaContext = createContext<MediaContextValue>({
  jobId: null,
  uploadFile: async () => {
    throw new Error("Media upload is not available outside the editor");
  },
});

export function MediaProvider({
  jobId,
  children,
}: {
  jobId: string;
  children: React.ReactNode;
}) {
  const uploadFile = useCallback(
    async (file: File): Promise<string> => {
      await ensureEditToken(jobId);
      const body = new FormData();
      body.append("file", file);
      const res = await fetch("/api/site/" + jobId + "/upload", {
        method: "POST",
        headers: editAuthHeaders(jobId),
        body,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(
          (data as { error?: string })?.error ||
            "Upload failed (" + res.status + ")"
        );
      }
      return (data as { url: string }).url;
    },
    [jobId]
  );

  return (
    <MediaContext.Provider value={{ jobId, uploadFile }}>
      {children}
    </MediaContext.Provider>
  );
}

export function useMediaUpload() {
  return useContext(MediaContext);
}
