import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { Footer } from "@/components/footer";
import { Scale, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "AstraPlay Terms of Service and protocol usage guidelines.",
};

export default function TermsPage() {
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
                <Scale size={14} /> User Agreement
              </span>
            </div>
            <h1>Terms of Service</h1>
            <p className="legal-updated">Last revised: September 2026</p>
          </div>

          <section className="legal-section">
            <h2>1. Acceptance of Terms</h2>
            <p>
              By accessing or using AstraPlay, you agree to be bound by these Terms of Service. If you do
              not agree to these terms, please do not use the application.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Nature of the Service</h2>
            <p>
              AstraPlay is an open web application providing a media user interface compatible with
              the Stremio and CloudStream addon specifications. AstraPlay does not host media content,
              operate media streaming servers, or distribute copyright-protected video files.
            </p>
            <p>
              Users are solely responsible for the addon manifests, streaming URLs, and repositories they
              choose to install or connect within their personal browser sessions.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Local Storage and Privacy</h2>
            <p>
              AstraPlay stores user preferences, installed addons list, watch progress, and library
              favorites entirely within the user&apos;s local browser storage (<code>localStorage</code> and{" "}
              <code>sessionStorage</code>). AstraPlay does not track, collect, or sell personal viewing history.
            </p>
          </section>

          <section className="legal-section">
            <h2>4. Third-Party Links & Services</h2>
            <p>
              AstraPlay interacts with third-party servers and networks. We have no control over the
              availability, legality, quality, or security of external streams or providers. Use of
              third-party addons is at your own risk.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
