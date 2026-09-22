import { NextResponse } from "next/server";
export const GET = () => NextResponse.json({ items: [], cacheTtlSeconds: 0, message: "Sources must come from an installed addon." });
