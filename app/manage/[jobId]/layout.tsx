import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Business admin · gòke",
  description: "Orders, bookings, and products for your published site.",
};

export default function ManageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
