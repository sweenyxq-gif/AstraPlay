import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { Footer } from "@/components/footer";
import { Info, ArrowLeft, Cpu, Globe, ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "About AstraPlay",
  description: "About the AstraPlay streaming aggregator platform and open architecture.",
};

export default function AboutPage() {
  return (
    <div className="app-shell">
      <header className="site-header">
        <Link href="/" className="brand-link" aria-label="AstraPlay Home">
          <BrandMark />
        </Link>
        <div className="header-actions">
          <Link href="/" className="icon-button" aria-label="Back to Home">
            <ArrowLeft />
          </Link>
        </div>
      </header>

      <main className="legal-page">
        <div className="legal-container">
          <div className="legal-header">
            <div className="badge-row">
              <span className="footer-badge">
                <Info size={14} /> Open Architecture
              </span>
            </div>
            <h1>About AstraPlay</h1>
            <p className="legal-updated">Modern, Source-Agnostic Streaming Aggregator</p>
          </div>

          <section className="legal-section">
            <h2>The Vision</h2>
            <p>
              AstraPlay was built to offer a sleek, cinematic, unified interface for decentralized media
              ecosystems. Rather than locking users into a single catalog or proprietary silo, AstraPlay
              gives users full ownership over their streaming sources by implementing open protocol
              standards:
            </p>
            <div className="features-grid">
              <div className="feature-card">
                <Globe className="feature-icon" />
                <h3>Stremio Protocol</h3>
                <p>
                  Full compatibility with official and community Stremio HTTP addon manifests for catalogs,
                  rich metadata, subtitles, and streams.
                </p>
              </div>
              <div className="feature-card">
                <Cpu className="feature-icon" />
                <h3>CloudStream Indexing</h3>
                <p>
                  Repository inspection and provider catalog integration for the open-source CloudStream
                  extension ecosystem.
                </p>
              </div>
              <div className="feature-card">
                <ShieldCheck className="feature-icon" />
                <h3>Privacy-First</h3>
                <p>
                  Zero server-side accounts or telemetry. Watchlist and playback progress remain stored
                  in your private browser storage.
                </p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
