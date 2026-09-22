import { NextResponse } from "next/server";
import { demoAddon } from "@/mocks/media";
export const GET = () => NextResponse.json({ installed: [{ ...demoAddon, enabled: true }] });
