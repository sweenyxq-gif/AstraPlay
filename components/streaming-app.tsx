"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useId, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  Bookmark,
  BookmarkCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  CircleUserRound,
  Clapperboard,
  Clock,
  Cloud,
  Compass,
  ExternalLink,
  Film,
  FolderPlus,
  Heart,
  Home,
  Info,
  Layers,
  Library,
  ListVideo,
  LoaderCircle,
  Maximize2,
  Minimize2,
  Play,
  Plus,
  RefreshCw,
  RotateCcw,
  RotateCw,
  Search,
  Settings2,
  Sparkles,
  Subtitles,
  Trash2,
  Tv,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  getInstalledAddons,
  PRESET_ADDONS,
  saveInstalledAddons,
  StoredAddon,
} from "@/lib/addons/presets";
import {
  getWatchlist,
  getWatchProgress,
  isInWatchlist,
  removeWatchProgress,
  saveWatchProgress,
  toggleWatchlist,
  WatchlistItem,
  WatchProgress,
} from "@/lib/storage";

type View =
  | "home"
  | "details"
  | "discover"
  | "library"
  | "addons"
  | "search"
  | "watch"
  | "stremio"
  | "remote-watch";

export interface RemoteMeta {
  id: string;
  type: string;
  name: string;
  genres?: string[];
  poster?: string;
  posterShape?: string;
  background?: string;
  logo?: string;
  description?: string;
  releaseInfo?: string;
  year?: string | number;
  imdbRating?: string | number;
  runtime?: string;
  director?: string | string[];
  cast?: string | string[];
  videos?: Array<{
    id: string;
    title?: string;
    name?: string;
    season?: number;
    number?: number;
    episode?: number;
    thumbnail?: string;
    released?: string;
    overview?: string;
    description?: string;
  }>;
}

export interface RemoteStream {
  name?: string;
  title?: string;
  url?: string;
  ytId?: string;
  infoHash?: string;
  fileIdx?: number;
  description?: string;
  behaviorHints?: Record<string, unknown>;
  addonName?: string;
  quality?: string;
}


export interface RemoteSubtitle {
  id?: string;
  url: string;
  lang: string;
  label?: string;
}

// Global fallback sample streams for testing open cinema
const SAMPLE_FALLBACK_STREAMS: Record<string, string> = {
  default: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  "tt0050083": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
  "tt0111161": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
};

// ---------------------------------------------------------------------------
// Header & Navigation
// ---------------------------------------------------------------------------

function Header({ activePath }: { activePath?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const current = activePath || pathname || "/";
  const [activeAddonsCount, setActiveAddonsCount] = useState(0);

  useEffect(() => {
    const addons = getInstalledAddons();
    setActiveAddonsCount(addons.filter((a) => a.enabled !== false).length);
  }, []);

  const isHome = current === "/" || current === "";
  const isDiscover = current.startsWith("/discover") || current.startsWith("/stremio") || current.startsWith("/title");
  const isSearch = current.startsWith("/search");
  const isLibrary = current.startsWith("/library");
  const isAddons = current.startsWith("/addons");

  function navigateTo(path: string, e: React.MouseEvent) {
    e.preventDefault();
    router.push(path);
  }

  return (
    <header className="app-header">
      <div onClick={(e) => navigateTo("/", e)} style={{ cursor: "pointer" }}>
        <BrandMark />
      </div>
      <nav className="desktop-nav" aria-label="Primary navigation">
        <Link href="/" className={isHome ? "active" : ""} onClick={(e) => navigateTo("/", e)}>
          Home
        </Link>
        <Link href="/discover" className={isDiscover ? "active" : ""} onClick={(e) => navigateTo("/discover", e)}>
          Discover
        </Link>
        <Link href="/search" className={isSearch ? "active" : ""} onClick={(e) => navigateTo("/search", e)}>
          Search
        </Link>
        <Link href="/library" className={isLibrary ? "active" : ""} onClick={(e) => navigateTo("/library", e)}>
          Library
        </Link>
        <Link href="/addons" className={isAddons ? "active" : ""} onClick={(e) => navigateTo("/addons", e)}>
          Addons{" "}
          <span className="addon-pill-count">
            {activeAddonsCount}
          </span>
        </Link>
      </nav>
      <div className="header-actions">
        <Link className={`icon-button ${isSearch ? "active-action" : ""}`} href="/search" onClick={(e) => navigateTo("/search", e)} aria-label="Search">
          <Search />
        </Link>
        <Link className={`icon-button ${isLibrary ? "active-action" : ""}`} href="/library" onClick={(e) => navigateTo("/library", e)} aria-label="Library">
          <Bookmark />
        </Link>
        <Link className={`icon-button ${isAddons ? "active-action" : ""}`} href="/addons" onClick={(e) => navigateTo("/addons", e)} aria-label="Addons setup">
          <Settings2 />
        </Link>
      </div>
    </header>
  );
}

function MobileNav({ activePath }: { activePath?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const current = activePath || pathname || "/";

  const isHome = current === "/" || current === "";
  const isDiscover = current.startsWith("/discover") || current.startsWith("/stremio") || current.startsWith("/title");
  const isSearch = current.startsWith("/search");
  const isLibrary = current.startsWith("/library");
  const isAddons = current.startsWith("/addons");

  function navigateTo(path: string, e: React.MouseEvent) {
    e.preventDefault();
    router.push(path);
  }

  return (
    <nav className="mobile-nav" aria-label="Mobile navigation">
      <Link href="/" className={isHome ? "active" : ""} onClick={(e) => navigateTo("/", e)}>
        <Home />
        <span>Home</span>
      </Link>
      <Link href="/discover" className={isDiscover ? "active" : ""} onClick={(e) => navigateTo("/discover", e)}>
        <Compass />
        <span>Discover</span>
      </Link>
      <Link href="/search" className={isSearch ? "active" : ""} onClick={(e) => navigateTo("/search", e)}>
        <Search />
        <span>Search</span>
      </Link>
      <Link href="/library" className={isLibrary ? "active" : ""} onClick={(e) => navigateTo("/library", e)}>
        <Library />
        <span>Library</span>
      </Link>
      <Link href="/addons" className={isAddons ? "active" : ""} onClick={(e) => navigateTo("/addons", e)}>
        <Settings2 />
        <span>Addons</span>
      </Link>
    </nav>
  );
}

function formatAirDate(raw?: string): string {
  if (!raw) return "";
  try {
    const d = new Date(raw);
    if (isNaN(d.getTime())) return raw;
    return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return raw;
  }
}

function formatReleaseInfo(raw?: string): string {
  if (!raw) return "";
  const cleaned = raw.replace(/\?/g, "–").trim();
  const currentYear = new Date().getFullYear();
  const match = cleaned.match(/^(\d{4})\s*[-–]\s*(\d{4})$/);
  if (match) {
    const startYear = parseInt(match[1], 10);
    const endYear = parseInt(match[2], 10);
    if (endYear > currentYear) {
      return `${startYear}–present`;
    }
    return `${startYear}–${endYear}`;
  }
  return cleaned;
}

const PROMO_KEYWORDS = [
  "donation needed",
  "donation",
  "donate",
  "discord",
  "telegram",
  "t.me/",
  "join our",
  "buy debrid",
  "real-debrid",
  "alldebrid",
  "premium only",
  "subscribe to",
  "no stream",
  "join the discord",
];

function isPromoOrInvalidStream(s: RemoteStream): boolean {
  const title = (s.title || s.name || "").toLowerCase();
  const desc = (s.description || "").toLowerCase();
  if (PROMO_KEYWORDS.some((kw) => title.includes(kw) || desc.includes(kw))) {
    return true;
  }
  if (!s.url && !s.infoHash && !s.ytId) {
    return true;
  }
  return false;
}

function AppShell({
  children,
  minimal = false,
  activePath,
}: {
  children: React.ReactNode;
  minimal?: boolean;
  activePath?: string;
}) {
  return (
    <div className={`app-shell ${minimal ? "minimal" : ""}`}>
      {!minimal && <Header activePath={activePath} />}
      {children}
      {!minimal && <Footer />}
      {!minimal && <MobileNav activePath={activePath} />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 1. HOME VIEW
// ---------------------------------------------------------------------------

function HomeView() {
  const router = useRouter();
  const [heroMeta, setHeroMeta] = useState<RemoteMeta | null>(null);
  const [rails, setRails] = useState<
    Array<{
      title: string;
      addonName: string;
      addonUrl: string;
      type: string;
      catalogId: string;
      items: RemoteMeta[];
    }>
  >([]);
  const [continueWatching, setContinueWatching] = useState<WatchProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAddons, setHasAddons] = useState(true);

  const continueRailRef = useRef<HTMLDivElement | null>(null);
  const railRefs = useRef<Record<string, HTMLDivElement | null>>({});

  function scrollRail(key: string, distance: number) {
    const el = railRefs.current[key];
    if (el) {
      el.scrollBy({ left: distance, behavior: "smooth" });
    }
  }

  function scrollContinue(distance: number) {
    if (continueRailRef.current) {
      continueRailRef.current.scrollBy({ left: distance, behavior: "smooth" });
    }
  }

  useEffect(() => {
    let active = true;
    async function loadHome() {
      const addons = getInstalledAddons().filter((a) => a.enabled !== false);
      if (!addons.length) {
        if (active) {
          setHasAddons(false);
          setLoading(false);
        }
        return;
      }

      setContinueWatching(getWatchProgress());

      const stremioAddons = addons.filter((a) => a.kind === "stremio" && a.catalogs?.length);
      const loadedRails: Array<{
        title: string;
        addonName: string;
        addonUrl: string;
        type: string;
        catalogId: string;
        items: RemoteMeta[];
      }> = [];

      for (const addon of stremioAddons.slice(0, 4)) {
        for (const cat of (addon.catalogs ?? []).slice(0, 3)) {
          try {
            const res = await fetch("/api/addons/stremio", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify({
                manifestUrl: addon.url,
                resource: "catalog",
                type: cat.type,
                id: cat.id,
              }),
            });
            if (!res.ok) continue;
            const data = (await res.json()) as { metas?: RemoteMeta[] };
            const metas = (data.metas ?? []).slice(0, 30);
            if (metas.length > 0) {
              loadedRails.push({
                title: cat.name || `${cat.type === "movie" ? "Movies" : "Series"} (${cat.id})`,
                addonName: addon.name,
                addonUrl: addon.url,
                type: cat.type,
                catalogId: cat.id,
                items: metas,
              });
            }
          } catch {
            // ignore rail failure
          }
        }
      }

      if (!active) return;
      setRails(loadedRails);

      // Set hero from first available rail item
      if (loadedRails.length > 0 && loadedRails[0].items.length > 0) {
        const topItem = loadedRails[0].items[0];
        try {
          const detailRes = await fetch("/api/addons/stremio", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              manifestUrl: loadedRails[0].addonUrl,
              resource: "meta",
              type: topItem.type,
              id: topItem.id,
            }),
          });
          if (detailRes.ok) {
            const detailData = (await detailRes.json()) as { meta?: RemoteMeta };
            setHeroMeta(detailData.meta ?? topItem);
          } else {
            setHeroMeta(topItem);
          }
        } catch {
          setHeroMeta(topItem);
        }
      }

      setLoading(false);
    }

    void loadHome();
    return () => {
      active = false;
    };
  }, []);

  function handleQuickInstallPresets() {
    saveInstalledAddons(PRESET_ADDONS);
    window.location.reload();
  }

  function handleNavigate(path: string, e?: React.MouseEvent) {
    if (e) e.preventDefault();
    router.push(path);
  }

  return (
    <AppShell activePath="/">
      <main>
        {loading ? (
          <div className="home-loading-screen">
            <LoaderCircle className="spin" />
            <p>Connecting to installed Stremio & CloudStream addons…</p>
          </div>
        ) : !hasAddons ? (
          <div className="standard-page home-empty">
            <section className="empty-catalog">
              <Sparkles />
              <span className="kicker">Out-of-the-Box Streaming</span>
              <h2>Start with verified addons.</h2>
              <p>
                AstraPlay connects to remote Stremio and CloudStream providers for
                real-time catalogs, rich metadata, subtitles, and streams.
              </p>
              <div className="empty-actions">
                <Button onClick={handleQuickInstallPresets} className="primary-action">
                  <Plus /> 1-Click Install Recommended Addons
                </Button>
                <Button asChild variant="secondary">
                  <Link href="/addons" onClick={(e) => handleNavigate("/addons", e)}>Custom URL Setup</Link>
                </Button>
              </div>
            </section>
          </div>
        ) : (
          <>
            {heroMeta && (
              <section className="hero">
                <div
                  className="hero-image"
                  style={{
                    backgroundImage: heroMeta.background
                      ? `url(${heroMeta.background})`
                      : heroMeta.poster
                      ? `url(${heroMeta.poster})`
                      : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center 20%",
                  }}
                />
                <div className="hero-copy">
                  <span className="kicker">
                    {heroMeta.type === "series" ? "Featured Series" : "Featured Movie"}
                  </span>
                  <h1>{heroMeta.name}</h1>
                  <div className="meta-line">
                    {heroMeta.releaseInfo && <span>{heroMeta.releaseInfo}</span>}
                    {heroMeta.imdbRating && (
                      <span className="rating-badge">★ {heroMeta.imdbRating} IMDb</span>
                    )}
                    {heroMeta.runtime && <span>{heroMeta.runtime}</span>}
                    {heroMeta.genres?.slice(0, 3).map((g) => (
                      <span key={g}>{g}</span>
                    ))}
                  </div>
                  <p>{heroMeta.description || "Stream directly from your installed addons."}</p>
                  <div className="hero-actions">
                    <Button
                      className="primary-action"
                      onClick={() =>
                        handleNavigate(
                          `/stremio/${encodeURIComponent(heroMeta.type)}/${encodeURIComponent(
                            heroMeta.id
                          )}`
                        )
                      }
                    >
                      <Play /> Watch Now
                    </Button>
                    <Button
                      asChild
                      className="secondary-action"
                    >
                      <Link
                        href={`/stremio/${encodeURIComponent(
                          heroMeta.type
                        )}/${encodeURIComponent(heroMeta.id)}`}
                        onClick={(e) =>
                          handleNavigate(
                            `/stremio/${encodeURIComponent(
                              heroMeta.type
                            )}/${encodeURIComponent(heroMeta.id)}`,
                            e
                          )
                        }
                      >
                        <Info /> Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </section>
            )}

            <div className="content-stage">
              {/* Continue Watching Rail */}
              {continueWatching.length > 0 && (
                <section className="rail-section">
                  <div className="section-heading">
                    <div className="heading-left">
                      <h2>Continue Watching</h2>
                    </div>
                    <div className="rail-controls">
                      <Link
                        href="/library"
                        className="see-all-link"
                        onClick={(e) => handleNavigate("/library", e)}
                      >
                        See Library <ChevronRight size={16} />
                      </Link>
                      <div className="rail-arrows">
                        <button
                          type="button"
                          className="rail-arrow-btn"
                          aria-label="Scroll left"
                          onClick={() => scrollContinue(-420)}
                        >
                          <ChevronLeft size={16} />
                        </button>
                        <button
                          type="button"
                          className="rail-arrow-btn"
                          aria-label="Scroll right"
                          onClick={() => scrollContinue(420)}
                        >
                          <ChevronRight size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="media-rail landscape-rail" ref={continueRailRef}>
                    {continueWatching.map((item) => {
                      const href = `/stremio/${encodeURIComponent(item.type)}/${encodeURIComponent(item.id)}`;
                      return (
                        <Link
                          key={item.id}
                          href={href}
                          className="media-card"
                          onClick={(e) => handleNavigate(href, e)}
                        >
                          <div
                            className="poster-art landscape"
                            style={{
                              backgroundImage: item.backdrop
                                ? `url(${item.backdrop})`
                                : item.poster
                                ? `url(${item.poster})`
                                : undefined,
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          >
                            <div className="progress-track">
                              <span style={{ width: `${Math.min(100, Math.max(5, item.percent))}%` }} />
                            </div>
                          </div>
                          <div className="media-card-copy">
                            <strong>{item.title}</strong>
                            <small>
                              {item.season && item.episode
                                ? `S${item.season}:E${item.episode}`
                                : `${Math.round(item.percent)}% watched`}
                            </small>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Dynamic Addon Rails */}
              {rails.map((rail, idx) => {
                const railKey = `rail-${idx}`;
                const discoverHref = `/discover?addon=${encodeURIComponent(rail.addonUrl)}&type=${encodeURIComponent(rail.type)}&id=${encodeURIComponent(rail.catalogId)}`;
                return (
                  <section className="rail-section" key={`${rail.title}-${idx}`}>
                    <div className="section-heading">
                      <div className="heading-left">
                        <h2>{rail.title}</h2>
                        <span className="addon-tag">{rail.addonName}</span>
                      </div>
                      <div className="rail-controls">
                        <Link
                          href={discoverHref}
                          className="see-all-link"
                          onClick={(e) => handleNavigate(discoverHref, e)}
                        >
                          View More <ChevronRight size={16} />
                        </Link>
                        <div className="rail-arrows">
                          <button
                            type="button"
                            className="rail-arrow-btn"
                            aria-label={`Scroll ${rail.title} left`}
                            onClick={() => scrollRail(railKey, -450)}
                          >
                            <ChevronLeft size={16} />
                          </button>
                          <button
                            type="button"
                            className="rail-arrow-btn"
                            aria-label={`Scroll ${rail.title} right`}
                            onClick={() => scrollRail(railKey, 450)}
                          >
                            <ChevronRight size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div
                      className="media-rail"
                      ref={(el) => {
                        railRefs.current[railKey] = el;
                      }}
                    >
                      {rail.items.map((item, itemIdx) => {
                        const href = `/stremio/${encodeURIComponent(item.type)}/${encodeURIComponent(item.id)}`;
                        return (
                          <Link
                            key={`${item.id}-${itemIdx}`}
                            href={href}
                            className="media-card"
                            onClick={(e) => handleNavigate(href, e)}
                          >
                            <div
                              className="poster-art"
                              style={{
                                backgroundImage: item.poster
                                  ? `url(${item.poster})`
                                  : undefined,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                              }}
                            >
                              {!item.poster && (
                                <span className="poster-glyph">{item.name.charAt(0)}</span>
                              )}
                            </div>
                            <div className="media-card-copy">
                              <strong>{item.name}</strong>
                              <small>{item.releaseInfo ?? item.type}</small>
                            </div>
                          </Link>
                        );
                      })}
                      {/* End of rail View More Card */}
                      <div
                        className="media-card view-more-card"
                        onClick={() => handleNavigate(discoverHref)}
                      >
                        <div className="view-more-inner">
                          <Sparkles size={24} />
                          <strong>View More</strong>
                          <span>Browse full catalog</span>
                        </div>
                      </div>
                    </div>
                  </section>
                );
              })}
            </div>
          </>
        )}
      </main>
    </AppShell>
  );
}

// ---------------------------------------------------------------------------
// 2. DISCOVER VIEW
// ---------------------------------------------------------------------------

function DiscoverView() {
  const router = useRouter();
  const [addons, setAddons] = useState<StoredAddon[]>([]);
  const [selectedAddonUrl, setSelectedAddonUrl] = useState("");
  const [selectedType, setSelectedType] = useState("movie");
  const [selectedCatalogId, setSelectedCatalogId] = useState("top");
  const [items, setItems] = useState<RemoteMeta[]>([]);
  const [loading, setLoading] = useState(true);
  const [skip, setSkip] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const list = getInstalledAddons().filter(
      (a) => a.kind === "stremio" && a.enabled !== false && a.catalogs?.length
    );
    setAddons(list);
    if (list.length > 0) {
      const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null;
      const queryAddon = params?.get("addon");
      const queryType = params?.get("type");
      const queryCatalog = params?.get("id");

      const targetAddon = queryAddon && list.some((a) => a.url === queryAddon)
        ? list.find((a) => a.url === queryAddon)!
        : list[0];

      setSelectedAddonUrl(targetAddon.url);
      if (queryType) {
        setSelectedType(queryType);
      } else if (targetAddon.catalogs?.[0]) {
        setSelectedType(targetAddon.catalogs[0].type);
      }
      if (queryCatalog) {
        setSelectedCatalogId(queryCatalog);
      } else if (targetAddon.catalogs?.[0]) {
        setSelectedCatalogId(targetAddon.catalogs[0].id);
      }
    } else {
      setLoading(false);
    }
  }, []);

  const activeAddon = useMemo(
    () => addons.find((a) => a.url === selectedAddonUrl) ?? addons[0],
    [addons, selectedAddonUrl]
  );

  const availableCatalogs = useMemo(() => {
    return activeAddon?.catalogs ?? [];
  }, [activeAddon]);

  useEffect(() => {
    if (!selectedAddonUrl || !selectedType || !selectedCatalogId) return;
    let active = true;
    setLoading(true);

    async function fetchCatalog() {
      try {
        const res = await fetch("/api/addons/stremio", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            manifestUrl: selectedAddonUrl,
            resource: "catalog",
            type: selectedType,
            id: selectedCatalogId,
            extra: skip > 0 ? `skip=${skip}` : undefined,
          }),
        });
        if (!res.ok) throw new Error();
        const data = (await res.json()) as { metas?: RemoteMeta[] };
        if (active) {
          const newItems = data.metas ?? [];
          setItems((prev) => (skip === 0 ? newItems : [...prev, ...newItems]));
          setHasMore(newItems.length >= 10);
          setLoading(false);
        }
      } catch {
        if (active) {
          setLoading(false);
          setHasMore(false);
        }
      }
    }

    void fetchCatalog();
    return () => {
      active = false;
    };
  }, [selectedAddonUrl, selectedType, selectedCatalogId, skip]);

  function handleAddonChange(url: string) {
    setSelectedAddonUrl(url);
    setSkip(0);
    const addon = addons.find((a) => a.url === url);
    if (addon?.catalogs?.[0]) {
      setSelectedType(addon.catalogs[0].type);
      setSelectedCatalogId(addon.catalogs[0].id);
    }
  }

  function handleTypeChange(type: string) {
    setSelectedType(type);
    setSkip(0);
    const cat = availableCatalogs.find((c) => c.type === type);
    if (cat) {
      setSelectedCatalogId(cat.id);
    }
  }

  function handleCardClick(item: RemoteMeta, e: React.MouseEvent) {
    e.preventDefault();
    router.push(`/stremio/${encodeURIComponent(item.type)}/${encodeURIComponent(item.id)}`);
  }

  return (
    <AppShell activePath="/discover">
      <main className="standard-page">
        <div className="page-intro">
          <span className="kicker">Multi-Addon Catalog</span>
          <h1>Discover Titles.</h1>
          <p>Browse live feeds aggregated directly from your installed Stremio addons.</p>
        </div>

        {addons.length === 0 ? (
          <div className="addon-empty">
            <Cloud />
            <strong>No active catalog addons</strong>
            <p>Install Cinemeta or a Stremio addon to explore catalogs.</p>
            <Button asChild className="primary-action">
              <Link href="/addons" onClick={(e) => { e.preventDefault(); router.push("/addons"); }}>Go to Addons</Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="filter-bar">
              <div className="filter-addons">
                {addons.map((addon) => (
                  <button
                    key={addon.id}
                    type="button"
                    className={`filter-btn ${selectedAddonUrl === addon.url ? "active" : ""}`}
                    onClick={() => handleAddonChange(addon.url)}
                  >
                    {addon.name}
                  </button>
                ))}
              </div>

              <div className="filter-types">
                <button
                  type="button"
                  className={`filter-btn ${selectedType === "movie" ? "active" : ""}`}
                  onClick={() => handleTypeChange("movie")}
                >
                  Movies
                </button>
                <button
                  type="button"
                  className={`filter-btn ${selectedType === "series" ? "active" : ""}`}
                  onClick={() => handleTypeChange("series")}
                >
                  Series
                </button>
              </div>
            </div>

            <div className="discover-grid">
              {items.map((item, idx) => {
                const href = `/stremio/${encodeURIComponent(item.type)}/${encodeURIComponent(item.id)}`;
                return (
                  <Link
                    key={`${item.id}-${idx}`}
                    href={href}
                    className="media-card"
                    onClick={(e) => handleCardClick(item, e)}
                  >
                    <div
                      className="poster-art"
                      style={{
                        backgroundImage: item.poster ? `url(${item.poster})` : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    >
                      {!item.poster && (
                        <span className="poster-glyph">{item.name.charAt(0)}</span>
                      )}
                    </div>
                    <div className="media-card-copy">
                      <strong>{item.name}</strong>
                      <small>{item.releaseInfo ?? item.type}</small>
                    </div>
                  </Link>
                );
              })}
            </div>

            {loading && (
              <div className="loading-line">
                <LoaderCircle className="spin" /> Loading catalog items…
              </div>
            )}

            {!loading && hasMore && items.length > 0 && (
              <div className="load-more-wrap">
                <Button
                  variant="secondary"
                  onClick={() => setSkip((s) => s + 20)}
                >
                  Load More Titles
                </Button>
              </div>
            )}
          </>
        )}
      </main>
    </AppShell>
  );
}

// ---------------------------------------------------------------------------
// 3. SEARCH VIEW
// ---------------------------------------------------------------------------

function SearchView() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Array<RemoteMeta & { addonName: string }>>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      setSearching(false);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      setHasSearched(true);
      const addons = getInstalledAddons().filter(
        (a) => a.kind === "stremio" && a.enabled !== false && a.capabilities.includes("catalog")
      );

      const found: Array<RemoteMeta & { addonName: string }> = [];

      await Promise.all(
        addons.map(async (addon) => {
          for (const type of ["movie", "series"]) {
            try {
              const res = await fetch("/api/addons/stremio", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                  manifestUrl: addon.url,
                  resource: "catalog",
                  type,
                  id: "top",
                  extra: `search=${encodeURIComponent(q)}`,
                }),
              });
              if (!res.ok) continue;
              const data = (await res.json()) as { metas?: RemoteMeta[] };
              for (const m of data.metas ?? []) {
                if (!found.some((existing) => existing.id === m.id)) {
                  found.push({ ...m, addonName: addon.name });
                }
              }
            } catch {
              // ignore
            }
          }
        })
      );

      setResults(found);
      setSearching(false);
    }, 350);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <AppShell activePath="/search">
      <main className="standard-page search-page">
        <div className="page-intro compact">
          <span className="kicker">Instant Global Search</span>
          <h1>Search All Addons.</h1>
          <p>Type to query all installed Stremio & CloudStream catalogs simultaneously.</p>
        </div>

        <div className="search-field standalone">
          <Search />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search movies, TV shows, anime, creators…"
          />
          {query && (
            <button
              className="icon-button"
              onClick={() => setQuery("")}
              aria-label="Clear search"
            >
              <X />
            </button>
          )}
        </div>

        {searching && (
          <div className="loading-line">
            <LoaderCircle className="spin" /> Searching connected sources…
          </div>
        )}

        {!searching && hasSearched && results.length === 0 && (
          <div className="addon-empty">
            <Film />
            <strong>No results for “{query}”</strong>
            <p>Try searching for a different title or install additional catalogs.</p>
          </div>
        )}

        <div className="discover-grid">
          {results.map((item) => {
            const href = `/stremio/${encodeURIComponent(item.type)}/${encodeURIComponent(item.id)}`;
            return (
              <Link
                key={item.id}
                href={href}
                className="media-card"
                onClick={(e) => {
                  e.preventDefault();
                  router.push(href);
                }}
              >
                <div
                  className="poster-art"
                  style={{
                    backgroundImage: item.poster ? `url(${item.poster})` : undefined,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {!item.poster && (
                    <span className="poster-glyph">{item.name.charAt(0)}</span>
                  )}
                </div>
                <div className="media-card-copy">
                  <strong>{item.name}</strong>
                  <small>
                    {item.releaseInfo ?? item.year ?? item.type} · {item.addonName}
                  </small>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </AppShell>
  );
}

// ---------------------------------------------------------------------------
// 4. TITLE DETAILS VIEW
// ---------------------------------------------------------------------------

function StremioDetailsView({
  mediaId,
  mediaType,
}: {
  mediaId: string;
  mediaType: string;
}) {
  const router = useRouter();
  const [meta, setMeta] = useState<RemoteMeta | null>(null);
  const [streams, setStreams] = useState<RemoteStream[]>([]);
  const [loadingMeta, setLoadingMeta] = useState(true);
  const [loadingStreams, setLoadingStreams] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState<{
    id: string;
    season: number;
    number: number;
    title?: string;
  } | null>(null);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [streamsOpen, setStreamsOpen] = useState(false);

  useEffect(() => {
    setInWatchlist(isInWatchlist(mediaId));
  }, [mediaId]);

  // Load Metadata
  useEffect(() => {
    let active = true;
    async function loadMeta() {
      setLoadingMeta(true);
      const addons = getInstalledAddons().filter(
        (a) => a.kind === "stremio" && a.enabled !== false && a.capabilities.includes("meta")
      );

      let foundMeta: RemoteMeta | null = null;
      for (const addon of addons) {
        try {
          const res = await fetch("/api/addons/stremio", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              manifestUrl: addon.url,
              resource: "meta",
              type: mediaType,
              id: mediaId,
            }),
          });
          if (!res.ok) continue;
          const data = (await res.json()) as { meta?: RemoteMeta };
          if (data.meta) {
            foundMeta = data.meta;
            break;
          }
        } catch {
          // continue
        }
      }

      if (!active) return;
      if (foundMeta) {
        setMeta(foundMeta);
        if (typeof document !== "undefined") {
          const cleanYear = formatReleaseInfo(foundMeta.releaseInfo || (foundMeta.year ? String(foundMeta.year) : ""));
          document.title = `${foundMeta.name}${cleanYear ? ` (${cleanYear})` : ""} — AstraPlay`;
        }
        // If series with videos, default to first season and first episode
        if (foundMeta.type === "series" && foundMeta.videos?.length) {
          const first = foundMeta.videos[0];
          const s = first.season ?? 1;
          const ep = first.number ?? first.episode ?? 1;
          setSelectedSeason(s);
          setSelectedEpisode({
            id: first.id,
            season: s,
            number: ep,
            title: first.title || first.name,
          });
        }
      } else {
        setMeta({ id: mediaId, type: mediaType, name: mediaId });
      }
      setLoadingMeta(false);
    }

    void loadMeta();
    return () => {
      active = false;
    };
  }, [mediaId, mediaType]);

  // Fetch Streams
  async function fetchStreamsForTarget(targetId: string) {
    setLoadingStreams(true);
    setStreams([]);
    setStreamsOpen(true);

    const addons = getInstalledAddons().filter(
      (a) => a.kind === "stremio" && a.enabled !== false && a.capabilities.includes("stream")
    );

    const resolved: RemoteStream[] = [];

    await Promise.all(
      addons.map(async (addon) => {
        try {
          const res = await fetch("/api/addons/stremio", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              manifestUrl: addon.url,
              resource: "stream",
              type: mediaType,
              id: targetId,
            }),
          });
          if (!res.ok) return;
          const data = (await res.json()) as { streams?: RemoteStream[] };
          for (const s of data.streams ?? []) {
            if (isPromoOrInvalidStream(s)) continue;
            resolved.push({
              ...s,
              addonName: addon.name,
              quality: extractQuality(s.name ?? s.title ?? ""),
            });
          }
        } catch {
          // ignore
        }
      })
    );

    // If no stream addon returned playable streams, add public fallback open stream for demo
    if (resolved.length === 0) {
      const fallbackUrl =
        SAMPLE_FALLBACK_STREAMS[mediaId] ?? SAMPLE_FALLBACK_STREAMS.default;
      resolved.push({
        name: "Open Cinema CDN",
        title: "Standard Web Stream (1080p)",
        url: fallbackUrl,
        addonName: "Public Domain & Open Cinema",
        quality: "1080p",
      });
    }

    setStreams(resolved);
    setLoadingStreams(false);
  }

  function extractQuality(text: string): string {
    const upper = text.toUpperCase();
    if (upper.includes("4K") || upper.includes("2160P")) return "4K UHD";
    if (upper.includes("1080P")) return "1080p";
    if (upper.includes("720P")) return "720p";
    if (upper.includes("480P")) return "480p";
    return "HD";
  }

  function handleStartPlay(stream: RemoteStream) {
    sessionStorage.setItem(
      "astraplay:selectedStream",
      JSON.stringify({
        ...stream,
        meta,
        season: selectedEpisode?.season,
        episode: selectedEpisode?.number,
        episodeTitle: selectedEpisode?.title,
      })
    );
    router.push(`/watch/stremio/${encodeURIComponent(mediaId)}`);
  }

  function handleToggleWatchlist() {
    if (!meta) return;
    const added = toggleWatchlist({
      id: meta.id,
      type: meta.type,
      title: meta.name,
      poster: meta.poster,
      backdrop: meta.background,
      year: meta.releaseInfo ?? meta.year,
      addedAt: Date.now(),
    });
    setInWatchlist(added);
  }

  // Calculate seasons
  const seasons = useMemo(() => {
    if (!meta?.videos?.length) return [];
    const set = new Set<number>();
    for (const v of meta.videos) {
      if (v.season) set.add(v.season);
    }
    return Array.from(set).sort((a, b) => a - b);
  }, [meta]);

  const episodesInSeason = useMemo(() => {
    if (!meta?.videos?.length) return [];
    return meta.videos
      .filter((v) => (v.season ?? 1) === selectedSeason)
      .sort((a, b) => (a.number ?? a.episode ?? 0) - (b.number ?? b.episode ?? 0));
  }, [meta, selectedSeason]);

  return (
    <AppShell activePath="/discover">
      <main className="details-page">
        {/* Cinematic Backdrop */}
        <div className="detail-backdrop">
          <div
            className="hero-image"
            style={{
              backgroundImage: meta?.background
                ? `url(${meta.background})`
                : meta?.poster
                ? `url(${meta.poster})`
                : undefined,
              backgroundSize: "cover",
              backgroundPosition: "center 20%",
            }}
          />
        </div>

        {/* Overview Header */}
        <div className="detail-overview">
          <div className="detail-poster-wrap">
            <button
              type="button"
              className="detail-back-btn"
              onClick={() => router.back()}
              aria-label="Go back"
            >
              <ArrowLeft size={16} /> Back
            </button>
            <div
              className="poster-art detail-poster"
              style={{
                backgroundImage: meta?.poster ? `url(${meta.poster})` : undefined,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {!meta?.poster && (
                <span className="poster-glyph">{meta?.name?.charAt(0) ?? "A"}</span>
              )}
            </div>
          </div>

          <div className="detail-copy">
            <span className="kicker">
              {meta?.type === "series" ? "TV Series" : "Feature Film"}
            </span>
            <h1>{loadingMeta ? "Loading title…" : meta?.name}</h1>

            <div className="meta-line">
              {meta?.releaseInfo && <span>{formatReleaseInfo(meta.releaseInfo)}</span>}
              {meta?.imdbRating && (
                <span className="rating-badge">★ {meta.imdbRating} IMDb</span>
              )}
              {meta?.runtime && <span>{meta.runtime}</span>}
            </div>

            {meta?.genres && (
              <div className="genre-row">
                {meta.genres.map((g) => (
                  <span key={g}>{g}</span>
                ))}
              </div>
            )}

            <p>{meta?.description || "Metadata fetched from installed addons."}</p>

            <div className="hero-actions">
              <Button
                className="primary-action"
                onClick={() => {
                  const targetId =
                    meta?.type === "series" && selectedEpisode
                      ? selectedEpisode.id
                      : mediaId;
                  void fetchStreamsForTarget(targetId);
                }}
              >
                <Play /> Stream Now
              </Button>

              <Button
                variant="secondary"
                className="secondary-action"
                onClick={handleToggleWatchlist}
              >
                {inWatchlist ? (
                  <>
                    <BookmarkCheck /> In Watchlist
                  </>
                ) : (
                  <>
                    <Bookmark /> Add to Watchlist
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Series Episode Picker */}
        {meta?.type === "series" && seasons.length > 0 && (
          <section className="episodes">
            <div className="section-heading">
              <h2>Episodes</h2>
              <div className="season-tabs">
                {seasons.map((s) => (
                  <button
                    key={s}
                    className={selectedSeason === s ? "active" : ""}
                    onClick={() => setSelectedSeason(s)}
                  >
                    Season {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="episode-list">
              {episodesInSeason.map((ep) => {
                const epNum = ep.number ?? ep.episode ?? 1;
                const isSelected = selectedEpisode?.id === ep.id;
                const rawTitle = ep.title || ep.name || "";
                const cleanTitle =
                  !rawTitle || rawTitle === String(epNum) || rawTitle === `Episode ${epNum}`
                    ? `Episode ${epNum}`
                    : rawTitle.replace(new RegExp(`^${epNum}[.\\-\\s]+`), "");

                return (
                  <div
                    key={ep.id}
                    className={`episode ${isSelected ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedEpisode({
                        id: ep.id,
                        season: selectedSeason,
                        number: epNum,
                        title: cleanTitle,
                      });
                      void fetchStreamsForTarget(ep.id);
                    }}
                  >
                    <span className="episode-number">{epNum}</span>
                    <div
                      className="poster-art landscape episode-thumbnail"
                      style={{
                        backgroundImage: ep.thumbnail
                          ? `url(${ep.thumbnail})`
                          : meta?.background
                          ? `url(${meta.background})`
                          : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div className="episode-info">
                      <strong>{cleanTitle}</strong>
                      {ep.released && <small>{formatAirDate(ep.released)}</small>}
                      <p>{ep.overview || ep.description || "Episode details"}</p>
                    </div>
                    <Button
                      size="sm"
                      variant={isSelected ? "default" : "secondary"}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEpisode({
                          id: ep.id,
                          season: selectedSeason,
                          number: epNum,
                          title: ep.title || ep.name,
                        });
                        void fetchStreamsForTarget(ep.id);
                      }}
                    >
                      <Play /> Watch
                    </Button>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Stream Source Picker Dialog */}
        <Dialog open={streamsOpen} onOpenChange={setStreamsOpen}>
          <DialogContent className="source-dialog">
            <DialogHeader>
              <DialogTitle>Select a Source</DialogTitle>
              <DialogDescription>
                {selectedEpisode
                  ? `Streaming Season ${selectedEpisode.season} Episode ${selectedEpisode.number} - ${
                      selectedEpisode.title || ""
                    }`
                  : `Select a stream provider for ${meta?.name}`}
              </DialogDescription>
            </DialogHeader>

            {loadingStreams ? (
              <div className="loading-line">
                <LoaderCircle className="spin" /> Resolving streams from connected addons…
              </div>
            ) : streams.length === 0 ? (
              <div className="no-streams">
                No active addons returned streams for this title. Try installing a streaming provider.
              </div>
            ) : (
              <div className="stream-list">
                {streams.map((stream, i) => (
                  <div
                    key={`${stream.addonName}-${i}`}
                    className="source-row clickable"
                    onClick={() => handleStartPlay(stream)}
                  >
                    <div className="quality-pill">{stream.quality || "HD"}</div>
                    <div className="source-details">
                      <strong>{stream.title || stream.name || "Live Stream"}</strong>
                      <small>
                        {stream.addonName} ·{" "}
                        {stream.ytId
                          ? "YouTube Stream"
                          : stream.infoHash
                          ? "Torrent Magnet"
                          : "Direct CDN"}
                      </small>
                      {stream.description && (
                        <p className="stream-desc">{stream.description}</p>
                      )}
                    </div>
                    <Button size="sm" className="primary-action">
                      <Play /> Play
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    </AppShell>
  );
}

// ---------------------------------------------------------------------------
// 5. UNIVERSAL VIDEO PLAYER
// ---------------------------------------------------------------------------

function RemoteWatchView({
  mediaId = "",
  mediaType = "movie",
}: {
  mediaId?: string;
  mediaType?: string;
}) {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [streamData, setStreamData] = useState<{
    url?: string;
    ytId?: string;
    infoHash?: string;
    title?: string;
    name?: string;
    addonName?: string;
    meta?: RemoteMeta;
    season?: number;
    episode?: number;
    episodeTitle?: string;
  } | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [subtitles, setSubtitles] = useState<RemoteSubtitle[]>([]);
  const [selectedSubUrl, setSelectedSubUrl] = useState<string>("off");
  const [subtitlesMenuOpen, setSubtitlesMenuOpen] = useState(false);
  const [resolvingDirect, setResolvingDirect] = useState(false);

  // Load stream payload from sessionStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = sessionStorage.getItem("astraplay:selectedStream");
      if (raw) {
        setStreamData(JSON.parse(raw));
        return;
      }
    } catch {
      // ignore
    }
  }, []);

  // If no stream data exists in sessionStorage, auto-resolve from mediaId
  useEffect(() => {
    if (!mediaId) return;
    if (streamData?.url || streamData?.ytId) return;
    let active = true;

    async function autoResolve() {
      setResolvingDirect(true);
      const addons = getInstalledAddons().filter((a) => a.enabled !== false);
      const metaAddon = addons.find((a) => a.capabilities.includes("meta"));
      let meta: RemoteMeta = { id: mediaId, type: mediaType, name: mediaId };

      if (metaAddon) {
        try {
          const mRes = await fetch("/api/addons/stremio", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              manifestUrl: metaAddon.url,
              resource: "meta",
              type: mediaType,
              id: mediaId,
            }),
          });
          if (mRes.ok) {
            const mData = (await mRes.json()) as { meta?: RemoteMeta };
            if (mData.meta) meta = mData.meta;
          }
        } catch {
          // ignore
        }
      }

      const streamAddons = addons.filter((a) => a.capabilities.includes("stream"));
      let resolved: RemoteStream | null = null;

      for (const sAddon of streamAddons) {
        try {
          const sRes = await fetch("/api/addons/stremio", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              manifestUrl: sAddon.url,
              resource: "stream",
              type: mediaType,
              id: mediaId,
            }),
          });
          if (sRes.ok) {
            const sData = (await sRes.json()) as { streams?: RemoteStream[] };
            if (sData.streams && sData.streams.length > 0) {
              resolved = { ...sData.streams[0], addonName: sAddon.name };
              break;
            }
          }
        } catch {
          // ignore
        }
      }

      if (!resolved) {
        resolved = {
          name: "Open Cinema CDN",
          title: "1080p Web Stream",
          url: SAMPLE_FALLBACK_STREAMS[mediaId] ?? SAMPLE_FALLBACK_STREAMS.default,
          addonName: "Public Domain Streams",
        };
      }

      if (active && resolved) {
        setStreamData({
          ...resolved,
          meta,
        });
        setResolvingDirect(false);
      }
    }

    void autoResolve();
    return () => {
      active = false;
    };
  }, [mediaId, mediaType, streamData]);


  // Fetch Subtitles from installed subtitle addons
  useEffect(() => {
    if (!streamData?.meta?.id) return;
    let active = true;

    async function loadSubs() {
      const addons = getInstalledAddons().filter(
        (a) => a.kind === "stremio" && a.enabled !== false && a.capabilities.includes("subtitles")
      );

      const resolvedSubs: RemoteSubtitle[] = [];
      const targetId =
        streamData?.season && streamData?.episode
          ? `${streamData.meta?.id}:${streamData.season}:${streamData.episode}`
          : streamData?.meta?.id ?? "";

      for (const addon of addons) {
        try {
          const res = await fetch("/api/addons/stremio", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({
              manifestUrl: addon.url,
              resource: "subtitles",
              type: streamData?.meta?.type || "movie",
              id: targetId,
            }),
          });
          if (!res.ok) continue;
          const data = (await res.json()) as { subtitles?: RemoteSubtitle[] };
          for (const s of data.subtitles ?? []) {
            resolvedSubs.push(s);
          }
        } catch {
          // ignore
        }
      }

      if (active) {
        setSubtitles(resolvedSubs);
      }
    }

    void loadSubs();
    return () => {
      active = false;
    };
  }, [streamData]);

  // Video event handlers
  function togglePlay() {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      void videoRef.current.play();
    } else {
      videoRef.current.pause();
    }
  }

  function handleTimeUpdate() {
    if (!videoRef.current) return;
    const cur = videoRef.current.currentTime;
    const dur = videoRef.current.duration || 0;
    setCurrentTime(cur);
    setDuration(dur);

    // Save progress periodically
    if (streamData?.meta?.id && dur > 0) {
      const percent = (cur / dur) * 100;
      saveWatchProgress({
        id: streamData.meta.id,
        type: streamData.meta.type,
        title: streamData.meta.name,
        poster: streamData.meta.poster,
        backdrop: streamData.meta.background,
        timestamp: cur,
        duration: dur,
        percent,
        season: streamData.season,
        episode: streamData.episode,
        episodeTitle: streamData.episodeTitle,
        updatedAt: Date.now(),
      });
    }
  }

  function handleScrub(e: React.MouseEvent<HTMLDivElement>) {
    if (!videoRef.current || duration === 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    videoRef.current.currentTime = pos * duration;
  }

  function skipSeconds(sec: number) {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(
      0,
      Math.min(duration, videoRef.current.currentTime + sec)
    );
  }

  function toggleMute() {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  }

  function toggleFullscreen() {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      void containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      void document.exitFullscreen();
      setIsFullscreen(false);
    }
  }

  function formatTime(seconds: number): string {
    if (isNaN(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    const hrs = Math.floor(mins / 60);
    if (hrs > 0) {
      const remMins = mins % 60;
      return `${hrs}:${remMins < 10 ? "0" : ""}${remMins}:${
        secs < 10 ? "0" : ""
      }${secs}`;
    }
    return `${mins < 10 ? "0" : ""}${mins}:${secs < 10 ? "0" : ""}${secs}`;
  }

  const titleText =
    streamData?.meta?.name ??
    streamData?.title ??
    streamData?.name ??
    "Video Stream";

  const epSubtitle =
    streamData?.season && streamData?.episode
      ? `Season ${streamData.season} Episode ${streamData.episode}${
          streamData.episodeTitle ? ` · ${streamData.episodeTitle}` : ""
        }`
      : undefined;

  return (
    <div className="watch-page" ref={containerRef}>
      {/* Top Navigation Bar */}
      <div className="watch-top">
        <Button
          variant="ghost"
          size="sm"
          className="exit-player-btn"
          onClick={() => {
            if (typeof window !== "undefined" && window.history.length > 1) {
              router.back();
            } else {
              router.push(
                mediaId
                  ? `/stremio/${encodeURIComponent(mediaType)}/${encodeURIComponent(mediaId)}`
                  : "/discover"
              );
            }
          }}
        >
          <ArrowLeft /> Back
        </Button>
        <div className="watch-meta-info">
          <strong>{resolvingDirect ? "Resolving Stream…" : titleText}</strong>
          {epSubtitle && <small>{epSubtitle}</small>}
        </div>
        <BrandMark />
      </div>

      {/* Main Playback Area */}
      {resolvingDirect ? (
        <div className="player-empty">
          <LoaderCircle className="spin" />
          <h1>Finding live stream…</h1>
          <p>Asking installed Stremio & CloudStream addons for playable sources.</p>
        </div>
      ) : streamData?.ytId ? (

        <iframe
          className="embedded-yt-player"
          src={`https://www.youtube-nocookie.com/embed/${streamData.ytId}?autoplay=1&rel=0`}
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
        />
      ) : streamData?.url ? (
        <>
          <video
            ref={videoRef}
            src={streamData.url}
            autoPlay
            playsInline
            crossOrigin="anonymous"
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={() => {
              if (videoRef.current) {
                setDuration(videoRef.current.duration);
                // Check if continuing from previous progress
                if (streamData.meta?.id) {
                  const saved = getWatchProgress().find(
                    (p) => p.id === streamData.meta?.id
                  );
                  if (saved && saved.timestamp > 10 && saved.percent < 95) {
                    videoRef.current.currentTime = saved.timestamp;
                  }
                }
              }
            }}
            onClick={togglePlay}
          >
            {selectedSubUrl !== "off" && (
              <track
                src={selectedSubUrl}
                kind="subtitles"
                label="Active"
                default
              />
            )}
          </video>

          {/* Center Play/Pause indicator on click */}
          {!isPlaying && (
            <button
              className="center-play"
              onClick={togglePlay}
              aria-label="Play stream"
            >
              <Play />
            </button>
          )}

          {/* Bottom Player Controls */}
          <div className="player-controls">
            {/* Scrubber Timeline */}
            <div
              className="scrubber clickable"
              onClick={handleScrub}
              role="slider"
              aria-valuenow={currentTime}
              aria-valuemin={0}
              aria-valuemax={duration}
            >
              <span
                style={{
                  width: `${duration ? (currentTime / duration) * 100 : 0}%`,
                }}
              />
            </div>

            <div className="control-row">
              <button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"}>
                {isPlaying ? <span className="pause-bars small" /> : <Play />}
              </button>
              <button
                onClick={() => skipSeconds(-10)}
                aria-label="Rewind 10 seconds"
              >
                <RotateCcw />
              </button>
              <button
                onClick={() => skipSeconds(10)}
                aria-label="Forward 10 seconds"
              >
                <RotateCw />
              </button>

              <span>
                {formatTime(currentTime)} / {formatTime(duration)}
              </span>

              <div />

              {/* Subtitles Menu */}
              {subtitles.length > 0 && (
                <div className="subtitles-control-wrap">
                  <button
                    onClick={() => setSubtitlesMenuOpen((o) => !o)}
                    className={selectedSubUrl !== "off" ? "text-brand" : ""}
                    aria-label="Subtitles selector"
                  >
                    <Subtitles />
                  </button>
                  {subtitlesMenuOpen && (
                    <div className="subtitles-dropdown">
                      <strong>Subtitles</strong>
                      <button
                        className={selectedSubUrl === "off" ? "active" : ""}
                        onClick={() => {
                          setSelectedSubUrl("off");
                          setSubtitlesMenuOpen(false);
                        }}
                      >
                        Off
                      </button>
                      {subtitles.map((sub, i) => (
                        <button
                          key={`${sub.lang}-${i}`}
                          className={selectedSubUrl === sub.url ? "active" : ""}
                          onClick={() => {
                            setSelectedSubUrl(sub.url);
                            setSubtitlesMenuOpen(false);
                          }}
                        >
                          {sub.label || sub.lang.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Volume Slider */}
              <button onClick={toggleMute} aria-label="Mute toggle">
                {isMuted ? <VolumeX /> : <Volume2 />}
              </button>

              {/* Fullscreen */}
              <button onClick={toggleFullscreen} aria-label="Fullscreen">
                {isFullscreen ? <Minimize2 /> : <Maximize2 />}
              </button>
            </div>
          </div>
        </>
      ) : streamData?.infoHash ? (
        <div className="player-empty">
          <Cloud />
          <h1>Torrent Stream Selected</h1>
          <p>
            Hash: <code>{streamData.infoHash}</code>
          </p>
          <p>This source uses a peer-to-peer torrent protocol.</p>
          <Button asChild className="primary-action">
            <a
              href={`magnet:?xt=urn:btih:${streamData.infoHash}&dn=${encodeURIComponent(
                titleText
              )}`}
            >
              <ExternalLink /> Open in Torrent Player / Client
            </a>
          </Button>
        </div>
      ) : (
        <div className="player-empty">
          <Film />
          <h1>No Stream Selected</h1>
          <p>Choose a title and stream provider to begin playback.</p>
          <Button asChild className="primary-action">
            <Link href="/discover">Browse Titles</Link>
          </Button>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// 6. LIBRARY VIEW
// ---------------------------------------------------------------------------

function LibraryView() {
  const router = useRouter();
  const [tab, setTab] = useState<"continue" | "watchlist" | "history">(
    "continue"
  );
  const [progressList, setProgressList] = useState<WatchProgress[]>([]);
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);

  useEffect(() => {
    setProgressList(getWatchProgress());
    setWatchlist(getWatchlist());
  }, []);

  function handleRemoveProgress(id: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    removeWatchProgress(id);
    setProgressList((prev) => prev.filter((p) => p.id !== id));
  }

  function handleRemoveWatchlist(id: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const item = watchlist.find((w) => w.id === id);
    if (item) {
      toggleWatchlist(item);
      setWatchlist((prev) => prev.filter((w) => w.id !== id));
    }
  }

  return (
    <AppShell activePath="/library">
      <main className="standard-page">
        <div className="page-intro compact">
          <span className="kicker">Personal Media Stash</span>
          <h1>Your Library.</h1>
          <p>Watch progress, bookmarks, and viewing history saved to this device.</p>
        </div>

        <div className="library-tabs">
          <button
            className={tab === "continue" ? "active" : ""}
            onClick={() => setTab("continue")}
          >
            Continue Watching ({progressList.length})
          </button>
          <button
            className={tab === "watchlist" ? "active" : ""}
            onClick={() => setTab("watchlist")}
          >
            Watchlist ({watchlist.length})
          </button>
        </div>

        {tab === "continue" && (
          <>
            {progressList.length === 0 ? (
              <div className="addon-empty">
                <Clock />
                <strong>No active watch history</strong>
                <p>Start streaming any movie or series to see resume points here.</p>
                <Button asChild className="primary-action">
                  <Link href="/discover">Browse Titles</Link>
                </Button>
              </div>
            ) : (
              <div className="library-grid">
                {progressList.map((item) => {
                  const href = `/stremio/${encodeURIComponent(item.type)}/${encodeURIComponent(item.id)}`;
                  return (
                    <div
                      key={item.id}
                      className="library-card"
                      style={{ cursor: "pointer" }}
                      onClick={() => router.push(href)}
                    >
                      <div className="library-card-art">
                        <div
                          className="poster-art landscape"
                          style={{
                            backgroundImage: item.backdrop
                              ? `url(${item.backdrop})`
                              : item.poster
                              ? `url(${item.poster})`
                              : undefined,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                          }}
                        >
                          <div className="progress-track">
                            <span
                              style={{
                                width: `${Math.min(
                                  100,
                                  Math.max(5, item.percent)
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="library-card-body">
                        <div>
                          <strong>{item.title}</strong>
                          <small>
                            {item.season && item.episode
                              ? `S${item.season}:E${item.episode} · `
                              : ""}
                            {Math.round(item.percent)}% completed
                          </small>
                        </div>
                        <button
                          className="icon-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveProgress(item.id, e);
                          }}
                          aria-label="Remove from history"
                        >
                          <Trash2 />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {tab === "watchlist" && (
          <>
            {watchlist.length === 0 ? (
              <div className="addon-empty">
                <Bookmark />
                <strong>Your watchlist is empty</strong>
                <p>Add titles from any details page to save them for later.</p>
                <Button asChild className="primary-action">
                  <Link href="/discover" onClick={(e) => { e.preventDefault(); router.push("/discover"); }}>Discover Titles</Link>
                </Button>
              </div>
            ) : (
              <div className="discover-grid">
                {watchlist.map((item) => {
                  const href = `/stremio/${encodeURIComponent(item.type)}/${encodeURIComponent(item.id)}`;
                  return (
                    <div
                      key={item.id}
                      className="media-card"
                      onClick={() => router.push(href)}
                    >
                      <div
                        className="poster-art"
                        style={{
                          backgroundImage: item.poster
                            ? `url(${item.poster})`
                            : undefined,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                        }}
                      >
                        {!item.poster && (
                          <span className="poster-glyph">
                            {item.title.charAt(0)}
                          </span>
                        )}
                      </div>
                      <div className="media-card-copy">
                        <strong>{item.title}</strong>
                        <div className="card-footer-actions">
                          <small>{item.year ?? item.type}</small>
                          <button
                            type="button"
                            className="text-button remove-btn"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRemoveWatchlist(item.id, e);
                            }}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>
    </AppShell>
  );
}

// ---------------------------------------------------------------------------
// 7. ADDONS MANAGER VIEW
// ---------------------------------------------------------------------------

function AddonsView() {
  type Inspection = {
    kind: "stremio" | "cloudstream";
    url: string;
    manifest: {
      id?: string;
      name: string;
      version?: string;
      description?: string;
      resources?: Array<string | { name: string }>;
      pluginLists?: string[];
      catalogs?: Array<{ type: string; id: string; name?: string }>;
    };
    plugins?: unknown[];
    runtime?: string;
  };

  const [installed, setInstalled] = useState<StoredAddon[]>(() => {
    return getInstalledAddons();
  });

  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");
  const [successNotice, setSuccessNotice] = useState("");

  async function inspectAndInstall(directUrl?: string) {
    const targetUrl = (directUrl || url).trim();
    if (!targetUrl) return;

    setStatus("loading");
    setMessage("");
    try {
      const response = await fetch("/api/addons/inspect", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });
      const result = (await response.json()) as Inspection & { message?: string };
      if (!response.ok) {
        throw new Error(result.message ?? "Could not inspect this addon.");
      }

      const resources =
        result.kind === "stremio"
          ? (result.manifest.resources ?? []).map((item) =>
              typeof item === "string" ? item : item.name
            )
          : ["repository", "providers"];

      const next: StoredAddon = {
        kind: result.kind,
        url: result.url,
        id: result.manifest.id ?? result.url,
        name: result.manifest.name,
        version: result.manifest.version,
        description: result.manifest.description ?? "",
        capabilities: resources,
        pluginCount: result.plugins?.length,
        catalogs: result.manifest.catalogs,
        enabled: true,
      };

      const updated = [...installed.filter((item) => item.id !== next.id), next];
      setInstalled(updated);
      saveInstalledAddons(updated);
      setOpen(false);
      setInspection(null);
      setUrl("");
      setStatus("idle");
      setSuccessNotice(
        `Added ${next.name}! Capabilities: ${next.capabilities.join(", ")}.`
      );
      setTimeout(() => setSuccessNotice(""), 6000);
    } catch (error) {
      setStatus("error");
      setMessage(
        error instanceof Error
          ? error.message
          : "Could not inspect this addon. Check URL format."
      );
    }
  }

  function handleInstallPreset(preset: StoredAddon) {

    const updated = [...installed.filter((item) => item.id !== preset.id), preset];
    setInstalled(updated);
    saveInstalledAddons(updated);
  }

  function toggleAddonEnabled(id: string) {
    const updated = installed.map((a) =>
      a.id === id ? { ...a, enabled: a.enabled === false ? true : false } : a
    );
    setInstalled(updated);
    saveInstalledAddons(updated);
  }

  function removeAddon(id: string) {
    const updated = installed.filter((item) => item.id !== id);
    setInstalled(updated);
    saveInstalledAddons(updated);
  }

  return (
    <AppShell activePath="/addons">
      <main className="standard-page addons-page">
        <div className="page-intro">
          <span className="kicker">Addon Ecosystem</span>
          <h1>Addon Store & Manager.</h1>
          <p>
            Connect remote Stremio manifests and CloudStream repositories. AstraPlay
            indexes their catalogs, metadata, and stream endpoints in real time.
          </p>
        </div>

        {/* Preset Store Section */}
        <section className="addon-store-section">
          <div className="section-heading">
            <h2>Recommended Verified Addons</h2>
            <span className="kicker">1-Click Install</span>
          </div>
          <div className="preset-grid">
            {PRESET_ADDONS.map((preset) => {
              const isInstalled = installed.some((i) => i.id === preset.id);
              return (
                <div key={preset.id} className="preset-card">
                  <div className="preset-top">
                    <span className="verified">
                      <Check /> {preset.kind}
                    </span>
                    <h3>{preset.name}</h3>
                    <p>{preset.description}</p>
                  </div>
                  <div className="preset-bottom">
                    <div className="capabilities">
                      {preset.capabilities.map((c) => (
                        <span key={c}>{c}</span>
                      ))}
                    </div>
                    <Button
                      size="sm"
                      variant={isInstalled ? "secondary" : "default"}
                      disabled={isInstalled}
                      onClick={() => handleInstallPreset(preset)}
                    >
                      {isInstalled ? "Installed" : "Install"}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Installed Addons Toolbar */}
        <div className="addon-toolbar">
          <div>
            <button className="active">Installed ({installed.length})</button>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="secondary">
                <Plus /> Custom Manifest URL
              </Button>
            </DialogTrigger>
            <DialogContent className="install-dialog">
              <DialogHeader>
                <DialogTitle>Install Custom Addon</DialogTitle>
                <DialogDescription>
                  Enter an HTTPS URL pointing to a Stremio <code>manifest.json</code> or a
                  CloudStream <code>repo.json</code>.
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  void inspectAndInstall();
                }}
              >
                <label className="addon-url-field">
                  <span>Addon or repository URL</span>
                  <input
                    value={url}
                    onChange={(event) => setUrl(event.target.value)}
                    placeholder="https://.../manifest.json"
                    autoFocus
                  />
                </label>
                {message && <p className="install-error">{message}</p>}
                <div className="install-actions">
                  <Button
                    type="submit"
                    disabled={!url.trim() || status === "loading"}
                    className="primary-action"
                  >
                    {status === "loading" && <LoaderCircle className="spin" />}
                    {status === "loading" ? "Verifying Addon…" : "Add Addon"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {successNotice && (
          <div className="success-banner">
            <Check />
            <span>{successNotice}</span>
          </div>
        )}


        {/* Installed Addons List */}
        {installed.length === 0 && (
          <div className="addon-empty">
            <Cloud />
            <strong>No addons installed yet</strong>
            <p>Click Install on any recommended addon above to get started.</p>
          </div>
        )}

        {installed.map((addon) => (
          <article className="addon-card" key={addon.id}>
            <div className="addon-icon">
              {addon.kind === "stremio" ? <Sparkles /> : <Cloud />}
            </div>
            <div className="addon-main">
              <span className="verified">
                <Check /> {addon.kind} compatible
              </span>
              <h2>{addon.name}</h2>
              <p>
                {addon.description ||
                  (addon.kind === "cloudstream"
                    ? `${addon.pluginCount ?? 0} CloudStream providers indexed.`
                    : "Remote Stremio addon")}
              </p>
              <div className="capabilities">
                {addon.capabilities.map((resource) => (
                  <span key={resource}>{resource}</span>
                ))}
              </div>
            </div>
            <div className="addon-side">
              <small>{addon.version ? `v${addon.version}` : addon.kind}</small>
              <button
                className={`switch ${addon.enabled !== false ? "on" : ""}`}
                aria-label={`Toggle ${addon.name}`}
                onClick={() => toggleAddonEnabled(addon.id)}
              >
                <span />
              </button>
              <button
                className="text-button"
                onClick={() => removeAddon(addon.id)}
              >
                Remove
              </button>
            </div>
          </article>
        ))}

        <section className="security-note">
          <Settings2 />
          <div>
            <strong>Protocol-safe execution boundary</strong>
            <p>
              Stremio HTTP addons are proxied securely with anti-SSRF protection. CloudStream
              repositories are indexed safely; DEX/JVM binaries are isolated from the browser.
            </p>
          </div>
        </section>
      </main>
    </AppShell>
  );
}

// ---------------------------------------------------------------------------
// Root App Router Switcher
// ---------------------------------------------------------------------------

export function StreamingApp({
  view,
  mediaId = "",
  mediaType = "movie",
}: {
  view: View;
  mediaId?: string;
  mediaType?: string;
}) {
  useEffect(() => {
    document.documentElement.style.colorScheme = "dark";
  }, []);

  if (view === "details" || view === "stremio") {
    return <StremioDetailsView mediaId={mediaId} mediaType={mediaType} />;
  }
  if (view === "discover") return <DiscoverView />;
  if (view === "library") return <LibraryView />;
  if (view === "addons") return <AddonsView />;
  if (view === "search") return <SearchView />;
  if (view === "watch" || view === "remote-watch") {
    return <RemoteWatchView mediaId={mediaId} mediaType={mediaType} />;
  }
  return <HomeView />;
}

