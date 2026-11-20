import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Hassel Godspower | SEO Specialist, Technical SEO & Web Growth",
  description:
    "Hassel Godspower is an SEO specialist and website developer in Lagos, Nigeria. Technical SEO, WordPress, WooCommerce, local search and conversion-focused websites.",
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
};

export default function HasselLayout({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
