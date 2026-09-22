import Link from "next/link";
import { brand } from "@/config/brand";
export function BrandMark() {
  return <Link className="brand-mark" href="/" aria-label={`${brand.name} home`}><span className="brand-symbol">A</span><span>{brand.name}</span></Link>;
}
