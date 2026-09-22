import { NextResponse } from "next/server";
export const GET = () => NextResponse.json({ items: [], message: "Search requires an installed addon." });
