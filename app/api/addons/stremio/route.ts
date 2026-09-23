import { NextRequest, NextResponse } from "next/server";
import { AddonRequestError, safeJsonFetch, validateRemoteAddonUrl } from "@/lib/addons/security";
import {
  stremioCatalogResponseSchema,
  stremioMetaResponseSchema,
  stremioStreamResponseSchema,
  stremioSubtitlesResponseSchema,
} from "@/packages/addon-types/src/stremio";

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      manifestUrl?: unknown;
      resource?: unknown;
      type?: unknown;
      id?: unknown;
      extra?: unknown;
    };
    if (
      ![body.manifestUrl, body.resource, body.type, body.id].every(
        (value) => typeof value === "string"
      )
    ) {
      throw new AddonRequestError(
        "INVALID_ADDON_REQUEST",
        "Manifest URL, resource, type, and id are required."
      );
    }
    const resource = body.resource as string;
    if (!["catalog", "meta", "stream", "subtitles"].includes(resource)) {
      throw new AddonRequestError(
        "INVALID_ADDON_RESOURCE",
        "Unsupported addon resource."
      );
    }
    const manifestStr = String(body.manifestUrl || "");
    const idStr = String(body.id || "");
    const isPublicDomain =
      manifestStr.includes("publicdomain") ||
      idStr.startsWith("pd_") ||
      idStr.startsWith("open_") ||
      idStr === "public_domain";

    if (isPublicDomain) {
      const {
        getPublicDomainMetas,
        getPublicDomainMeta,
        getPublicDomainStreams,
      } = await import("@/lib/addons/publicdomain-data");

      if (resource === "catalog") {
        let skip = 0;
        let query: string | undefined = undefined;
        if (typeof body.extra === "string") {
          const matchSkip = body.extra.match(/skip=(\d+)/);
          if (matchSkip) skip = parseInt(matchSkip[1], 10);
          const matchSearch = body.extra.match(/search=([^&]+)/);
          if (matchSearch) query = decodeURIComponent(matchSearch[1]);
        } else if (typeof body.extra === "object" && body.extra !== null) {
          const ex = body.extra as Record<string, unknown>;
          if (ex.skip) skip = parseInt(String(ex.skip), 10) || 0;
          if (ex.search) query = String(ex.search);
        }
        const metas = getPublicDomainMetas(skip, query);
        return NextResponse.json({ metas });
      }
      if (resource === "meta") {
        const meta = getPublicDomainMeta(idStr);
        return NextResponse.json({ meta });
      }
      if (resource === "stream") {
        const streams = getPublicDomainStreams(idStr);
        return NextResponse.json({ streams });
      }
      if (resource === "subtitles") {
        return NextResponse.json({ subtitles: [] });
      }
    }

    const manifestUrl = validateRemoteAddonUrl(body.manifestUrl as string);
    const base = new URL("./", manifestUrl);

    let extraSegment = "";
    if (typeof body.extra === "string" && body.extra.trim()) {
      extraSegment = `/${body.extra.trim().replace(/^\//, "")}`;
    } else if (
      typeof body.extra === "object" &&
      body.extra !== null &&
      !Array.isArray(body.extra)
    ) {
      const parts = Object.entries(body.extra as Record<string, unknown>)
        .filter(([, v]) => v !== undefined && v !== null && v !== "")
        .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(String(v))}`);
      if (parts.length > 0) {
        extraSegment = `/${parts.join("&")}`;
      }
    }

    const endpoint = new URL(
      `${resource}/${encodeURIComponent(body.type as string)}/${encodeURIComponent(
        body.id as string
      )}${extraSegment}.json`,
      base
    ).toString();

    const { data } = await safeJsonFetch(
      endpoint,
      resource === "catalog" || resource === "meta" ? 3_000_000 : 1_500_000
    );

    if (resource === "catalog") {
      const parsed = stremioCatalogResponseSchema.safeParse(data);
      return NextResponse.json(parsed.success ? parsed.data : data);
    }
    if (resource === "meta") {
      const parsed = stremioMetaResponseSchema.safeParse(data);
      return NextResponse.json(parsed.success ? parsed.data : data);
    }
    if (resource === "stream") {
      const parsed = stremioStreamResponseSchema.safeParse(data);
      return NextResponse.json(parsed.success ? parsed.data : data);
    }
    if (resource === "subtitles") {
      const parsed = stremioSubtitlesResponseSchema.safeParse(data);
      return NextResponse.json(parsed.success ? parsed.data : data);
    }

    return NextResponse.json(data);
  } catch (error) {
    const known =
      error instanceof AddonRequestError
        ? error
        : new AddonRequestError(
            "ADDON_REQUEST_FAILED",
            error instanceof Error ? error.message : "The addon request failed validation.",
            502
          );
    return NextResponse.json(
      { code: known.code, message: known.message },
      { status: known.status }
    );
  }
}

