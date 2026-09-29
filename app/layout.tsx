import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CodeCascadePreloader } from "./components/CodeCascadePreloader";
import { PwaInstallPrompt } from "./components/PwaInstallPrompt";

export const metadata: Metadata = {
  title: {
    default: "gòke — Instagram to website",
    template: "%s · gòke",
  },
  description:
    "Turn your Instagram into a real multi-section website. Generate from your data export, edit visually, publish when you’re ready.",
  applicationName: "gòke",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "gòke",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    title: "gòke — Instagram to website",
    description:
      "From Instagram export to live site — visual editor included. Free to preview, pay to go live.",
    type: "website",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [{ url: "/icons/icon-192.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icons/icon-192.svg" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#08090c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        <link rel="apple-touch-icon" href="/icons/icon-192.svg" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <CodeCascadePreloader />
        {children}
        <PwaInstallPrompt />
      </body>
    </html>
  );
}
