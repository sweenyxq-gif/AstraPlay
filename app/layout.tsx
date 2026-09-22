import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "AstraPlay", template: "%s — AstraPlay" },
  description: "A source-agnostic home for films, series, and personal media.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
