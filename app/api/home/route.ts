import { NextResponse } from "next/server";
import { media } from "@/mocks/media";
export const GET = () => NextResponse.json({ hero: media[0], rails: { trending: media.slice(1, 7), topRated: [...media].sort((a, b) => b.rating - a.rating) } });
