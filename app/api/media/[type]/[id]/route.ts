import { NextResponse } from "next/server";
export const GET = () => NextResponse.json({ code: "NO_LOCAL_CATALOG", message: "Metadata must come from an installed addon." }, { status: 404 });
