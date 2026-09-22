import { NextRequest, NextResponse } from "next/server";
import { media } from "@/mocks/media";
export function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.get("q")?.trim().toLowerCase() ?? "";
  return NextResponse.json({ items: query ? media.filter((item) => `${item.title} ${item.genres.join(" ")}`.toLowerCase().includes(query)) : [] });
}
