import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://astraplay.onrender.com"),
  title: { default: "AstraPlay — Repertory Cinema at Midnight", template: "%s — AstraPlay" },
  description: "A decentralized, source-agnostic streaming interface for films, series, and open media.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "AstraPlay — Repertory Cinema at Midnight",
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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <div className="film-grain" aria-hidden="true" />
        {children}
      </body>
    </html>
  );
}
