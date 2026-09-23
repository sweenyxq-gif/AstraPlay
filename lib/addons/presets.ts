export interface StoredAddon {
  kind: "stremio" | "cloudstream";
  url: string;
  id: string;
  name: string;
  version?: string;
  description: string;
  capabilities: string[];
  pluginCount?: number;
  catalogs?: Array<{ type: string; id: string; name?: string; extra?: Array<{ name: string; isRequired?: boolean }> }>;
  enabled?: boolean;
}

export const PRESET_ADDONS: StoredAddon[] = [
  {
    kind: "stremio",
    id: "community.cinemeta",
    name: "Cinemeta",
    version: "3.0.12",
    description: "Official IMDb and TheMovieDb metadata and catalogs for movies and series.",
    url: "https://v3-cinemeta.strem.io/manifest.json",
    capabilities: ["catalog", "meta"],
    enabled: true,
    catalogs: [
      { type: "movie", id: "top", name: "Top Movies" },
      { type: "series", id: "top", name: "Top Series" },
      { type: "movie", id: "year", name: "New Movies" },
      { type: "series", id: "year", name: "New Series" },
    ],
  },
  {
    kind: "stremio",
    id: "org.stremio.opensubtitlesv3",
    name: "OpenSubtitles v3",
    version: "1.0.0",
    description: "Official multi-language subtitle provider for movie and series streaming.",
    url: "https://opensubtitles-v3.strem.io/manifest.json",
    capabilities: ["subtitles"],
    enabled: true,
  },
  {
    kind: "stremio",
    id: "org.astraplay.publicdomain",
    name: "Public Domain & Open Cinema",
    version: "2.0.0",
    description: "Verified genuine public domain classics, open-source cinema (Blender Open Projects), and Internet Archive films.",
    url: "https://astraplay.onrender.com/api/addons/publicdomain/manifest.json",
    capabilities: ["catalog", "meta", "stream"],
    enabled: true,
    catalogs: [
      { type: "movie", id: "public_domain", name: "Public Domain Feature Films" },
    ],
  },
  {
    kind: "stremio",
    id: "com.stremio.HdHub",
    name: "HdHub Multi-Quality Streams",
    version: "1.0.7",
    description: "Multi-quality (4K, 1080p, 720p) stream resolver for movies and series.",
    url: "https://hdhub.thevolecitor.qzz.io/eyJ0b3Jib3giOiJ1bnNldCIsInF1YWxpdGllcyI6IjIxNjBwLDEwODBwLDcyMHAiLCJzb3J0IjoiZGVzYyJ9/manifest.json",
    capabilities: ["stream"],
    enabled: true,
  },
  {
    kind: "cloudstream",
    id: "cs.community.repo",
    name: "CloudStream Community Index",
    version: "1.0.0",
    description: "CloudStream multi-provider repository index with hundreds of indexed streaming providers.",
    url: "https://raw.githubusercontent.com/recloudstream/cloudstream-extensions/master/repo.json",
    capabilities: ["repository", "providers"],
    pluginCount: 84,
    enabled: true,
  },
];


export function getInstalledAddons(): StoredAddon[] {
  if (typeof window === "undefined") return PRESET_ADDONS;
  try {
    const raw = localStorage.getItem("astraplay:addons");
    if (!raw) {
      // Seed default recommended addons on initial setup
      localStorage.setItem("astraplay:addons", JSON.stringify(PRESET_ADDONS));
      return PRESET_ADDONS;
    }
    let parsed = JSON.parse(raw) as StoredAddon[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem("astraplay:addons", JSON.stringify(PRESET_ADDONS));
      return PRESET_ADDONS;
    }

    // Auto-migrate legacy public domain preset if misconfigured to Cinemeta
    let modified = false;
    parsed = parsed.map((addon) => {
      if (
        addon.id === "org.publicdomain.movies" ||
        addon.id === "org.astraplay.publicdomain" ||
        addon.name.toLowerCase().includes("public domain")
      ) {
        if (
          addon.url.includes("v3-cinemeta.strem.io") ||
          addon.catalogs?.[0]?.id === "top"
        ) {
          modified = true;
          return PRESET_ADDONS.find((a) => a.id === "org.astraplay.publicdomain")!;
        }
      }
      return addon;
    });

    if (modified) {
      localStorage.setItem("astraplay:addons", JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    return PRESET_ADDONS;
  }
}

export function saveInstalledAddons(addons: StoredAddon[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("astraplay:addons", JSON.stringify(addons));
  } catch {
    // ignore
  }
}
