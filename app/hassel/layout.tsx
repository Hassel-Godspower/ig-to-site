import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: {
    absolute: "Hassel Godspower | SEO Specialist · Technical SEO & Web Growth",
  },
  description:
    "Hassel Godspower — SEO specialist and website developer in Lagos. Technical SEO, WordPress, local search, and conversion-focused sites. Founder of HighValue Solutions.",
  alternates: {
    canonical: "https://highvaluesolutions.net/hassel",
  },
  openGraph: {
    type: "profile",
    title: "Hassel Godspower | SEO Specialist",
    description:
      "Technical SEO, web development and digital growth. Founder of HighValue Solutions.",
    url: "https://highvaluesolutions.net/hassel",
  },
  twitter: {
    card: "summary",
    title: "Hassel Godspower | SEO Specialist",
    description:
      "Technical SEO, web development and digital growth. Founder of HighValue Solutions.",
  },
  robots: { index: true, follow: true },
};

export default function HasselLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {/* Hide gòke product tab bar on this personal route */}
      <style
        dangerouslySetInnerHTML={{
          __html: `body:has(.hg-root) .gk-app-tabbar{display:none!important}`,
        }}
      />
      {children}
    </>
  );
}
