import type { Metadata } from "next";
import "@/src/goke-editor/styles/editor.css";

export const metadata: Metadata = {
  title: "Instagram to website",
  description: "Turn your Instagram profile into a live website.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ margin: 0, background: "#0f1117", color: "#e8eaed" }}>
        {children}
      </body>
    </html>
  );
}
