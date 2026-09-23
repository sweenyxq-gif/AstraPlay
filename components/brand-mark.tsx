import Link from "next/link";
import { brand } from "@/config/brand";

export function BrandMark() {
  return (
    <Link className="brand-mark group" href="/" aria-label={`${brand.name} home`}>
      <div className="brand-symbol-wrap">
        <svg viewBox="0 0 28 28" fill="none" className="brand-svg-mark" xmlns="http://www.w3.org/2000/svg">
          <rect width="28" height="28" rx="7" fill="#13161c" />
          <path d="M14 6L21 21H17L14 14.5L11 21H7L14 6Z" fill="var(--brand-accent)" />
          <circle cx="14" cy="18" r="2" fill="#fff" opacity="0.9" />
        </svg>
      </div>
      <span className="brand-name-text">
        {brand.name}
        <span className="brand-dot" />
      </span>
    </Link>
  );
}

