import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
const progressSchema = z.object({ mediaId: z.string().min(1), seconds: z.number().nonnegative(), duration: z.number().positive() });
export async function POST(request: NextRequest) {
  const result = progressSchema.safeParse(await request.json());
  if (!result.success) return NextResponse.json({ code: "INVALID_PROGRESS", message: "Progress data was not valid." }, { status: 400 });
  return NextResponse.json({ saved: result.data.seconds >= 30, complete: result.data.seconds / result.data.duration >= .92 });
}
