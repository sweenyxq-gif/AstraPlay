import { NextResponse } from "next/server";
import { PUBLIC_DOMAIN_MANIFEST } from "@/lib/addons/publicdomain-data";

export async function GET() {
  return NextResponse.json(PUBLIC_DOMAIN_MANIFEST, {
    headers: {
      "access-control-allow-origin": "*",
      "cache-control": "public, max-age=3600",
    },
  });
}
