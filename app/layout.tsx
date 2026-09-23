import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://astraplay.onrender.com"),
  title: { default: "AstraPlay — Modern Streaming Aggregator", template: "%s — AstraPlay" },
  description: "A decentralized, source-agnostic streaming interface for films, series, and public domain cinema.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "AstraPlay — Modern Streaming Aggregator",
    description: "Source-agnostic streaming client for Stremio and CloudStream protocols.",
    url: "https://astraplay.onrender.com",
    siteName: "AstraPlay",
    type: "website",
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
