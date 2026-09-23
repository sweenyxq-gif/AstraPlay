import React from "react";

export function FilmLeader({ label = "THREADING 35MM REEL" }: { label?: string }) {
  return (
    <div className="film-leader-container" role="status" aria-label={label}>
      <div className="film-leader-circle">
        {/* Crosshair lines */}
        <div className="film-crosshair horizontal" />
        <div className="film-crosshair vertical" />
        {/* Sweeping circle radar */}
        <div className="film-sweep" />
        {/* Vintage countdown numbers */}
        <div className="film-leader-num">3</div>
      </div>
      <div className="film-leader-label font-mono">
        <span className="live-dot" /> {label}
      </div>
    </div>
  );
}
