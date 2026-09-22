import { NextResponse } from "next/server";
export const GET = () => NextResponse.json({ hero: null, rails: {}, message: "No local catalog is installed." });
