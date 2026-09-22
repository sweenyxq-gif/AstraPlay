import { NextRequest, NextResponse } from "next/server";
import { cloudstreamPluginSchema, cloudstreamRepoSchema, stremioManifestSchema } from "@/packages/addon-types/src/stremio";
import { AddonRequestError, safeJsonFetch } from "@/lib/addons/security";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as { url?: unknown };
    if (typeof body.url !== "string") throw new AddonRequestError("INVALID_ADDON_URL", "An addon URL is required.");
    const { data, finalUrl } = await safeJsonFetch(body.url);
    const stremio = stremioManifestSchema.safeParse(data);
    if (stremio.success) return NextResponse.json({ kind: "stremio", url: finalUrl, manifest: stremio.data });
    const cloudstream = cloudstreamRepoSchema.safeParse(data);
    if (cloudstream.success) {
      const pluginPayloads = await Promise.all(cloudstream.data.pluginLists.slice(0, 4).map((url) => safeJsonFetch(url, 2_000_000)));
      const plugins = pluginPayloads.flatMap(({ data: pluginData }) => Array.isArray(pluginData) ? pluginData : []).map((plugin) => cloudstreamPluginSchema.safeParse(plugin)).filter((result) => result.success).map((result) => result.data).slice(0, 200);
      return NextResponse.json({ kind: "cloudstream", url: finalUrl, manifest: cloudstream.data, plugins, runtime: "bridge-required" });
    }
    throw new AddonRequestError("UNSUPPORTED_ADDON", "This is not a valid Stremio manifest or CloudStream repository.");
  } catch (error) {
    const known = error instanceof AddonRequestError ? error : new AddonRequestError("ADDON_INSPECTION_FAILED", "The addon could not be inspected.", 502);
    return NextResponse.json({ code: known.code, message: known.message }, { status: known.status });
  }
}
