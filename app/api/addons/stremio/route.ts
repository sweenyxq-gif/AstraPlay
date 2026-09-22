import { NextRequest, NextResponse } from "next/server";
import { AddonRequestError, safeJsonFetch, validateRemoteAddonUrl } from "@/lib/addons/security";
import { stremioCatalogResponseSchema, stremioStreamResponseSchema } from "@/packages/addon-types/src/stremio";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { manifestUrl?: unknown; resource?: unknown; type?: unknown; id?: unknown; extra?: unknown };
    if (![body.manifestUrl, body.resource, body.type, body.id].every((value) => typeof value === "string")) throw new AddonRequestError("INVALID_ADDON_REQUEST", "Manifest URL, resource, type, and id are required.");
    const resource = body.resource as string;
    if (!["catalog", "meta", "stream", "subtitles"].includes(resource)) throw new AddonRequestError("INVALID_ADDON_RESOURCE", "Unsupported addon resource.");
    const manifestUrl = validateRemoteAddonUrl(body.manifestUrl as string);
    const base = new URL("./", manifestUrl);
    const extra = typeof body.extra === "string" && body.extra ? `/${encodeURIComponent(body.extra).replaceAll("%3D", "=").replaceAll("%26", "&")}` : "";
    const endpoint = new URL(`${resource}/${encodeURIComponent(body.type as string)}/${encodeURIComponent(body.id as string)}${extra}.json`, base).toString();
    const { data } = await safeJsonFetch(endpoint, resource === "catalog" ? 2_000_000 : 1_000_000);
    if (resource === "catalog") return NextResponse.json(stremioCatalogResponseSchema.parse(data));
    if (resource === "stream") return NextResponse.json(stremioStreamResponseSchema.parse(data));
    return NextResponse.json(data);
  } catch (error) {
    const known = error instanceof AddonRequestError ? error : new AddonRequestError("ADDON_REQUEST_FAILED", "The addon request failed validation.", 502);
    return NextResponse.json({ code: known.code, message: known.message }, { status: known.status });
  }
}
