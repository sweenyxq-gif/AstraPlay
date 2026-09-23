import React from "react";

export function MarqueeTicker({ items = [] }: { items?: string[] }) {
  const displayItems = items.length > 0 ? items : [
    "MIDNIGHT REPERTORY SCREENINGS",
    "35MM OPTICAL SOUND PRINTS",
    "UNCUT PRINTS & RESTORATIONS",
    "DECENTRALIZED ARCHIVE PROTOCOL",
    "ADMIT ONE — LIGHTS DOWN AT 12:00",
  ];

  return (
    <div className="marquee-wrapper" aria-hidden="true">
      <div className="marquee-badge font-mono">
        <span className="live-dot" /> NOW SHOWING
      </div>
      <div className="marquee-track">
        <div className="marquee-content font-mono">
          {displayItems.map((text, i) => (
            <span key={i} className="marquee-item">
              <span className="marquee-sep">✦</span> {text}
            </span>
          ))}
          {/* Duplicate for infinite seamless scroll */}
          {displayItems.map((text, i) => (
            <span key={`dup-${i}`} className="marquee-item">
              <span className="marquee-sep">✦</span> {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
