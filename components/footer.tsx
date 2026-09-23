import React from "react";
import Link from "next/link";
import { BrandMark } from "./brand-mark";
import { ShieldCheck, Scale, ExternalLink } from "lucide-react";

function GithubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-container">
        <div className="footer-top">
          <div className="footer-brand">
            <BrandMark />
            <p className="footer-tagline">
              AstraPlay is an open-source, source-agnostic streaming interface and media
              aggregator designed for high-performance decentralized playback.
            </p>
            <div className="footer-badges">
              <span className="footer-badge">
                <ShieldCheck size={14} /> DMCA Compliant
              </span>
              <span className="footer-badge">
                <Scale size={14} /> Decentralized Protocol
              </span>
            </div>
          </div>

          <div className="footer-column">
            <h3>Navigation</h3>
            <ul>
              <li><Link href="/">Home</Link></li>
              <li><Link href="/discover">Discover</Link></li>
              <li><Link href="/search">Search</Link></li>
              <li><Link href="/library">Library & Watchlist</Link></li>
              <li><Link href="/addons">Addon Manager</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Legal & Safety</h3>
            <ul>
              <li><Link href="/dmca">DMCA Policy & Takedown</Link></li>
              <li><Link href="/terms">Terms of Service</Link></li>
              <li><Link href="/about">About & Architecture</Link></li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Project</h3>
            <ul>
              <li>
                <a
                  href="https://github.com/sweenyxq-gif/AstraPlay"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="external-link"
                >
                  <GithubIcon size={14} /> GitHub Repository <ExternalLink size={12} />
                </a>
              </li>
              <li>
                <span className="footer-muted-text">Stremio & CloudStream Compatible</span>
              </li>
              <li>
                <span className="footer-muted-text">Node.js Engine 22+</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-disclaimer">
          <p>
            <strong>Disclaimer:</strong> AstraPlay does not host, store, scrape, encode, or transmit
            any video files, media streams, or copyrighted content on its servers. AstraPlay operates
            strictly as an open-source client-side interface that consumes user-installed third-party
            manifests via public APIs (Stremio and CloudStream protocols). All media links are resolved
            and streamed directly between the client browser and third-party remote host providers.
            AstraPlay complies with 17 U.S.C. § 512 and the Digital Millennium Copyright Act.
          </p>
        </div>

        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} AstraPlay. All rights reserved.</p>
          <div className="footer-bottom-links">
            <Link href="/dmca">DMCA</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/about">About</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
