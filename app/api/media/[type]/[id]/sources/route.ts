import { NextResponse } from "next/server";
import { sources } from "@/mocks/media";
export const GET = () => NextResponse.json({ items: sources, cacheTtlSeconds: 120 });
