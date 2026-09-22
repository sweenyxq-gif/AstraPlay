import { NextResponse } from "next/server";
import { findMedia } from "@/mocks/media";
export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return NextResponse.json(findMedia(id));
}
