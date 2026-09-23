import type { Metadata } from "next";

export async function resolveTitleMetadata(type: string, id: string, prefix = ""): Promise<Metadata> {
  const decodedId = decodeURIComponent(id);
  const decodedType = decodeURIComponent(type);

  // Check public domain data
  if (decodedId.startsWith("pd_") || decodedId.startsWith("open_")) {
    const { getPublicDomainMeta } = await import("@/lib/addons/publicdomain-data");
    const item = getPublicDomainMeta(decodedId);
    if (item) {
      const titleStr = `${prefix}${item.name} (${item.year})`;
      return {
        title: titleStr,
        description: item.description,
        openGraph: {
          title: `${titleStr} — AstraPlay`,
          description: item.description,
          images: item.poster ? [{ url: item.poster }] : [],
        },
      };
    }
  }

  // Check Cinemeta
  try {
    const res = await fetch(`https://v3-cinemeta.strem.io/meta/${decodedType}/${decodedId}.json`, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(3500),
    });
    if (res.ok) {
      const data = (await res.json()) as {
        meta?: { name?: string; year?: string | number; releaseInfo?: string; description?: string; poster?: string };
      };
      if (data?.meta?.name) {
        const year = data.meta.year || data.meta.releaseInfo || "";
        const cleanYear = String(year).replace(/\?/g, "–").trim();
        const titleStr = cleanYear ? `${prefix}${data.meta.name} (${cleanYear})` : `${prefix}${data.meta.name}`;
        return {
          title: titleStr,
          description: data.meta.description || `Stream ${data.meta.name} on AstraPlay.`,
          openGraph: {
            title: `${titleStr} — AstraPlay`,
            description: data.meta.description,
            images: data.meta.poster ? [{ url: data.meta.poster }] : [],
          },
        };
      }
    }
  } catch {
    // fallback
  }

  return {
    title: `${prefix}${decodedType === "series" ? "TV Series" : "Movie"} Details`,
  };
}
