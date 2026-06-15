import type { Metadata } from "next";
import "../src/index.css";

export const metadata: Metadata = {
  title: "Personal Tracker",
  description: "A private Bento-grid dashboard for everyday planning.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
