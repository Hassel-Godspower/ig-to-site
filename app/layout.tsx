import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "gòke — Instagram to website",
    template: "%s · gòke",
  },
  description:
    "Turn your Instagram into a real multi-section website. Generate from your data export, edit visually, publish when you’re ready.",
  openGraph: {
    title: "gòke — Instagram to website",
    description:
      "From Instagram export to live site — visual editor included. Free to preview, pay to go live.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
