import type { Metadata } from "next";
import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";
import { Footer } from "@/components/footer";
import { ShieldCheck, Mail, ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "DMCA Policy & Copyright",
  description: "AstraPlay Digital Millennium Copyright Act (DMCA) compliance notice and copyright agent contact information.",
};

export default function DmcaPage() {
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
                <ShieldCheck size={14} /> 17 U.S.C. § 512
              </span>
            </div>
            <h1>Digital Millennium Copyright Act (DMCA) Notice</h1>
            <p className="legal-updated">Last revised: September 2026</p>
          </div>

          <section className="legal-section">
            <h2>1. Service Operation & Architecture</h2>
            <p>
              AstraPlay (<code>astraplay.onrender.com</code>) is an open-source web application and
              content aggregator frontend. AstraPlay does <strong>not</strong> host, upload, archive,
              transcode, or store any media, audio, video files, or torrent payloads on any of its servers.
            </p>
            <p>
              The service operates strictly as a decentralized index and browser client for external,
              third-party user-configured protocol providers (such as the open Stremio Addon Protocol and
              CloudStream Extension specification). All search results, catalog items, and streaming
              locations are dynamically queried client-side from remote third-party endpoints independently
              maintained by external parties over whom AstraPlay has no control.
            </p>
          </section>

          <section className="legal-section">
            <h2>2. Safe Harbor Compliance</h2>
            <p>
              It is the policy of AstraPlay to respect the legitimate rights of copyright owners, their
              agents, and representatives. AstraPlay operates under the safe harbor provisions of Title II
              of the Digital Millennium Copyright Act, 17 U.S.C. § 512(c) and § 512(d).
            </p>
            <p>
              Because AstraPlay does not host or store any media files on its servers, removing content from
              AstraPlay does not remove the content from the Internet, the host server, or the decentralized
              third-party addon provider. However, AstraPlay will promptly disable, blacklist, or remove
              any default preset indexing link or catalog mapping upon receipt of a valid and complete notification.
            </p>
          </section>

          <section className="legal-section">
            <h2>3. Submitting a Takedown Notice</h2>
            <p>
              To file a copyright infringement notification with AstraPlay, you must submit a written
              communication that includes substantially the following information:
            </p>
            <ol>
              <li>
                A physical or electronic signature of a person authorized to act on behalf of the owner of
                an exclusive right that is allegedly infringed.
              </li>
              <li>
                Identification of the copyrighted work claimed to have been infringed, or, if multiple
                copyrighted works are covered by a single notification, a representative list of such works.
              </li>
              <li>
                Identification of the specific material or link on AstraPlay that is claimed to be infringing
                or to be the subject of infringing activity, including exact URLs.
              </li>
              <li>
                Information reasonably sufficient to permit AstraPlay to contact the complaining party, such
                as an address, telephone number, and email address.
              </li>
              <li>
                A statement that the complaining party has a good faith belief that use of the material in
                the manner complained of is not authorized by the copyright owner, its agent, or the law.
              </li>
              <li>
                A statement that the information in the notification is accurate, and under penalty of
                perjury, that the complaining party is authorized to act on behalf of the owner of an
                exclusive right that is allegedly infringed.
              </li>
            </ol>
          </section>

          <section className="legal-section">
            <h2>4. Designated Copyright Agent</h2>
            <div className="contact-box">
              <Mail size={20} />
              <div>
                <strong>Designated Copyright Agent</strong>
                <p>Email: <code>dmca-agent@astraplay.org</code></p>
                <p>Subject Line: <code>DMCA Takedown Notice - [Content Title]</code></p>
                <small>Average response time: 24–48 business hours.</small>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
