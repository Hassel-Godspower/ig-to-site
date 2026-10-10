import { Suspense, type ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <Suspense fallback={<div style={{ padding: 24, color: "#9ca3af" }}>Loading…</div>}>{children}</Suspense>;
}
