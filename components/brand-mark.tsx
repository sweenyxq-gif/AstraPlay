import Link from "next/link";
import { brand } from "@/config/brand";

export function BrandMark() {
  return (
    <Link className="brand-mark group" href="/" aria-label={`${brand.name} repertory cinema`}>
      <div className="brand-symbol-wrap">
        <svg viewBox="0 0 28 28" fill="none" className="brand-svg-mark" xmlns="http://www.w3.org/2000/svg">
          <rect width="28" height="28" rx="4" fill="#181411" stroke="rgba(245, 166, 35, 0.35)" strokeWidth="1" />
          {/* Film reel sprockets and aperture */}
          <circle cx="14" cy="14" r="8" stroke="#f5a623" strokeWidth="1.5" strokeDasharray="3 2" />
          <circle cx="14" cy="14" r="3.5" fill="#f5a623" />
          {/* Perforation notches */}
          <rect x="1" y="4" width="3" height="3" rx="0.5" fill="#100d0b" />
          <rect x="24" y="4" width="3" height="3" rx="0.5" fill="#100d0b" />
          <rect x="1" y="21" width="3" height="3" rx="0.5" fill="#100d0b" />
          <rect x="24" y="21" width="3" height="3" rx="0.5" fill="#100d0b" />
        </svg>
      </div>
      <div className="brand-text-block">
        <span className="brand-name-text">
          {brand.name}
        </span>
        <span className="brand-subtext font-mono">REPERTORY</span>
      </div>
    </Link>
  );
}
