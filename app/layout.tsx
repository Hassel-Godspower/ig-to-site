import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./theme.css";
import { CodeCascadePreloader } from "./components/CodeCascadePreloader";
import { PwaInstallPrompt } from "./components/PwaInstallPrompt";
import { ThemeProvider } from "./components/ThemeProvider";

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
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#08090c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var k='goke-theme';var t=localStorage.getItem(k);if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'}document.documentElement.setAttribute('data-theme',t);document.documentElement.style.colorScheme=t}catch(e){document.documentElement.setAttribute('data-theme','dark')}})();`,
          }}
        />

        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/* iOS home screen */}
        <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" sizes="180x180" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="gòke" />
        <meta name="mobile-web-app-capable" content="yes" />
      </head>
      <body>
        <ThemeProvider>
          <CodeCascadePreloader />
          {children}
          <PwaInstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}
