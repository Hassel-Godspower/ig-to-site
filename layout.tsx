export const metadata = {
  title: "Instagram to website",
  description: "Turn your Instagram profile into a live website.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
