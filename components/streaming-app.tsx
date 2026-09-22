"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Bookmark, Check, ChevronRight, CircleUserRound, Cloud, Compass, Film, Home, Library, ListFilter, LoaderCircle, Play, Plus, Search, Settings2, Sparkles, Star, Tv, Volume2 } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { demoAddon, findMedia, media, sources } from "@/mocks/media";
import type { MediaItem } from "@/packages/shared/src/models";

type View = "home" | "details" | "discover" | "library" | "addons" | "search" | "watch" | "stremio" | "remote-watch";
type StoredAddon = { kind: "stremio" | "cloudstream"; url: string; id: string; name: string; version?: string; description: string; capabilities: string[]; pluginCount?: number; catalogs?: Array<{ type: string; id: string; name?: string }> };
type RemoteMeta = { id: string; type: string; name: string; poster?: string; background?: string; description?: string; releaseInfo?: string };
type RemoteStream = { name?: string; title?: string; url?: string; ytId?: string; infoHash?: string };

function PosterArt({ item, landscape = false }: { item: MediaItem; landscape?: boolean }) {
  return (
    <div className={`poster-art ${landscape ? "landscape" : ""}`} style={{ "--tone-a": item.palette[0], "--tone-b": item.palette[1] } as React.CSSProperties}>
      <span className="poster-orbit" />
      <span className="poster-glyph">{item.glyph}</span>
      <span className="poster-eyebrow">{item.eyebrow}</span>
    </div>
  );
}

function MediaCard({ item, landscape = false }: { item: MediaItem; landscape?: boolean }) {
  return (
    <Link href={`/title/${item.type}/${item.id}`} className={`media-card ${landscape ? "is-landscape" : ""}`} aria-label={`Open ${item.title}`}>
      <PosterArt item={item} landscape={landscape} />
      {item.progress !== undefined && <span className="progress-track"><span style={{ width: `${item.progress}%` }} /></span>}
      <span className="media-card-copy"><strong>{item.title}</strong><small>{item.year} · {item.type === "series" ? "Series" : item.runtime}</small></span>
    </Link>
  );
}

function MediaRail({ title, items, landscape = false }: { title: string; items: MediaItem[]; landscape?: boolean }) {
  return (
    <section className="rail-section" aria-labelledby={title.replaceAll(" ", "-")}>
      <div className="section-heading"><h2 id={title.replaceAll(" ", "-")}>{title}</h2><button aria-label={`See all ${title}`}>View all <ChevronRight /></button></div>
      <div className={`media-rail ${landscape ? "landscape-rail" : ""}`}>{items.map((item) => <MediaCard key={item.id} item={item} landscape={landscape} />)}</div>
    </section>
  );
}

function ConnectedCatalogs() {
  const [items, setItems] = useState<Array<RemoteMeta & { addonName: string }>>([]);
  useEffect(() => {
    let active = true;
    async function load() {
      const addons = JSON.parse(localStorage.getItem("astraplay:addons") ?? "[]") as StoredAddon[];
      const results = await Promise.all(addons.filter((addon) => addon.kind === "stremio" && addon.catalogs?.length).slice(0, 4).map(async (addon) => {
        const catalog = addon.catalogs?.[0];
        if (!catalog) return [];
        try {
          const response = await fetch("/api/addons/stremio", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ manifestUrl: addon.url, resource: "catalog", type: catalog.type, id: catalog.id }) });
          const data = await response.json() as { metas?: RemoteMeta[] };
          return (data.metas ?? []).slice(0, 12).map((meta) => ({ ...meta, addonName: addon.name }));
        } catch { return []; }
      }));
      if (active) setItems(results.flat());
    }
    void load(); return () => { active = false; };
  }, []);
  if (!items.length) return null;
  return <section className="connected-catalog"><div className="section-heading"><h2>From your Stremio addons</h2><span>Live catalog</span></div><div className="remote-rail">{items.map((item, index) => <Link href={`/stremio/${encodeURIComponent(item.type)}/${encodeURIComponent(item.id)}`} className="remote-card" key={`${item.id}-${index}`}><div className="remote-poster">{item.poster ? <Image src={item.poster} alt="" fill sizes="180px" unoptimized /> : <span>{item.name.slice(0, 2)}</span>}</div><strong>{item.name}</strong><small>{item.releaseInfo ?? item.addonName}</small></Link>)}</div></section>;
}

function SourceDialog({ item, trigger }: { item: MediaItem; trigger?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger ?? <Button className="primary-action"><Play fill="currentColor" /> Watch now</Button>}</DialogTrigger>
      <DialogContent className="source-dialog">
        <DialogHeader><DialogTitle>Choose how to watch</DialogTitle><DialogDescription>Sources for {item.title} are grouped by quality. Your choice stays on this device.</DialogDescription></DialogHeader>
        <div className="source-toolbar"><span>{sources.length} verified demo sources</span><button><ListFilter /> Best match</button></div>
        <div className="quality-group"><p>1080p</p>{sources.slice(0, 1).map((source) => <Link key={source.id} href={`/watch/${item.type}/${item.id}?source=${source.id}`} className="source-row"><span className="quality-pill">{source.quality}</span><span><strong>{source.provider}</strong><small>{source.title} · {source.format} · {source.language}</small></span><span className="source-size">{source.size}<ChevronRight /></span></Link>)}</div>
        <div className="quality-group"><p>720p</p>{sources.slice(1).map((source) => <Link key={source.id} href={`/watch/${item.type}/${item.id}?source=${source.id}`} className="source-row"><span className="quality-pill muted">{source.quality}</span><span><strong>{source.provider}</strong><small>{source.title} · {source.format} · {source.language}</small></span><span className="source-size">{source.size}<ChevronRight /></span></Link>)}</div>
        <p className="dialog-note">Demo streams use an authorized public sample. Addons never execute code in your browser.</p>
      </DialogContent>
    </Dialog>
  );
}

function SearchDialog() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => media.filter((item) => `${item.title} ${item.genres.join(" ")}`.toLowerCase().includes(query.toLowerCase())), [query]);
  return (
    <Dialog>
      <DialogTrigger asChild><button className="icon-button" aria-label="Search"><Search /></button></DialogTrigger>
      <DialogContent className="search-dialog">
        <DialogHeader><DialogTitle className="sr-only">Search AstraPlay</DialogTitle><DialogDescription className="sr-only">Search movies and series</DialogDescription></DialogHeader>
        <label className="search-field"><Search /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search films, series, people…" /></label>
        <p className="search-caption">{query ? `${results.length} matches` : "Try “mystery”, “drama”, or a title"}</p>
        <div className="search-results">{results.slice(0, 5).map((item) => <Link href={`/title/${item.type}/${item.id}`} key={item.id}><PosterArt item={item} landscape /><span><strong>{item.title}</strong><small>{item.year} · {item.genres.join(" · ")}</small></span><ChevronRight /></Link>)}</div>
      </DialogContent>
    </Dialog>
  );
}

function Header() {
  return (
    <header className="app-header"><BrandMark /><nav className="desktop-nav" aria-label="Primary navigation"><Link href="/">Home</Link><Link href="/discover?type=movie">Movies</Link><Link href="/discover?type=series">TV Shows</Link><Link href="/discover">Discover</Link><Link href="/addons">Addons</Link></nav><div className="header-actions"><SearchDialog /><Link className="icon-button" href="/library" aria-label="Library"><Bookmark /></Link><button className="profile-button" aria-label="Open profile"><CircleUserRound /></button></div></header>
  );
}

function MobileNav() {
  return <nav className="mobile-nav" aria-label="Mobile navigation"><Link href="/"><Home /><span>Home</span></Link><Link href="/discover"><Compass /><span>Discover</span></Link><Link href="/search"><Search /><span>Search</span></Link><Link href="/library"><Library /><span>Library</span></Link><button><CircleUserRound /><span>Profile</span></button></nav>;
}

function AppShell({ children, minimal = false }: { children: React.ReactNode; minimal?: boolean }) {
  return <div className={`app-shell ${minimal ? "minimal" : ""}`}>{!minimal && <Header />}{children}{!minimal && <MobileNav />}</div>;
}

function HomeView() {
  const hero = media[0];
  return <AppShell><main><section className="hero"><div className="hero-image" /><div className="hero-copy"><span className="kicker">{hero.eyebrow} · New this week</span><h1>The Signal<br /><em>Sea</em></h1><div className="meta-line"><span>{hero.year}</span><span className="rating"><Star fill="currentColor" /> {hero.rating}</span><span>{hero.runtime}</span><span>16+</span></div><p>{hero.description}</p><div className="hero-actions"><SourceDialog item={hero} /><Button asChild variant="secondary" className="secondary-action"><Link href={`/title/${hero.type}/${hero.id}`}>More info</Link></Button><button className="round-action" aria-label="Add The Signal Sea to watchlist"><Plus /></button></div></div><div className="hero-index"><span>01</span><i /><small>04</small></div></section><div className="content-stage"><MediaRail title="Continue watching" items={media.filter((item) => item.progress)} landscape /><MediaRail title="Trending now" items={media.slice(1, 7)} /><MediaRail title="Stories beyond the map" items={media.slice(3, 9)} landscape /><MediaRail title="Top rated" items={[media[5], media[0], media[4], media[1], media[7], media[2]]} /></div></main></AppShell>;
}

function DetailsView({ item }: { item: MediaItem }) {
  const [saved, setSaved] = useState(false);
  return <AppShell><main className="details-page"><div className="detail-backdrop"><div className="hero-image" /></div><section className="detail-overview"><div className="detail-poster"><PosterArt item={item} /></div><div className="detail-copy"><span className="kicker">{item.eyebrow}</span><h1>{item.title}</h1><div className="meta-line"><span>{item.year}</span><span className="rating"><Star fill="currentColor" /> {item.rating}</span><span>{item.runtime}</span><span>4K</span></div><p>{item.description}</p><div className="genre-row">{item.genres.map((genre) => <span key={genre}>{genre}</span>)}</div><div className="hero-actions"><SourceDialog item={item} /><Button variant="secondary" onClick={() => setSaved((value) => !value)}>{saved ? <Check /> : <Plus />}{saved ? "In watchlist" : "Watchlist"}</Button></div></div></section>{item.type === "series" && <section className="episodes"><div className="section-heading"><h2>Season 1</h2><button>8 episodes <ChevronRight /></button></div>{["The Weather Station", "An Empty Frequency", "Perihelion"].map((title, index) => <article className="episode" key={title}><div className="episode-number">0{index + 1}</div><div className="episode-still"><PosterArt item={media[index + 1]} landscape /></div><div><strong>{title}</strong><small>{42 + index * 5} min</small><p>{media[index + 1].description}</p></div><button aria-label={`Play ${title}`}><Play fill="currentColor" /></button></article>)}</section>}<div className="content-stage detail-rails"><MediaRail title="More like this" items={media.filter((candidate) => candidate.id !== item.id).slice(0, 6)} /></div></main></AppShell>;
}

function DiscoverView() {
  const [filter, setFilter] = useState<"all" | "movie" | "series">("all");
  const visible = filter === "all" ? media : media.filter((item) => item.type === filter);
  return <AppShell><main className="standard-page"><div className="page-intro"><span className="kicker">Curated for discovery</span><h1>Find your next world.</h1><p>Browse every installed catalog through one normalized interface.</p></div><ConnectedCatalogs /><div className="filter-bar"><div>{(["all", "movie", "series"] as const).map((value) => <button className={filter === value ? "active" : ""} key={value} onClick={() => setFilter(value)}>{value === "all" ? "Demo titles" : value === "movie" ? "Movies" : "TV shows"}</button>)}</div><button><Settings2 /> Filters</button></div><div className="discover-grid">{visible.map((item) => <MediaCard item={item} key={item.id} />)}</div></main></AppShell>;
}

function LibraryView() {
  return <AppShell><main className="standard-page"><div className="page-intro compact"><span className="kicker">Your library</span><h1>Pick up where you left off.</h1></div><div className="library-tabs"><button className="active">Continue watching</button><button>Watchlist</button><button>History</button><button>Completed</button></div><div className="library-grid">{media.filter((item) => item.progress).map((item) => <MediaCard item={item} key={item.id} landscape />)}</div><div className="quiet-panel"><Sparkles /><div><strong>Your watchlist has room for a few more worlds.</strong><p>Add a title from any details page and it will appear here.</p></div><Button asChild variant="secondary"><Link href="/discover">Browse titles</Link></Button></div></main></AppShell>;
}

function AddonsView() {
  type Inspection = { kind: "stremio" | "cloudstream"; url: string; manifest: { id?: string; name: string; version?: string; description?: string; resources?: Array<string | { name: string }>; pluginLists?: string[]; catalogs?: Array<{ type: string; id: string; name?: string }> }; plugins?: unknown[]; runtime?: string };
  const [enabled, setEnabled] = useState(true);
  const [installed, setInstalled] = useState<StoredAddon[]>(() => {
    if (typeof window === "undefined") return [];
    try { return JSON.parse(localStorage.getItem("astraplay:addons") ?? "[]") as StoredAddon[]; } catch { return []; }
  });
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [inspection, setInspection] = useState<Inspection | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");
  async function inspectAddon() {
    setStatus("loading"); setMessage(""); setInspection(null);
    try {
      const response = await fetch("/api/addons/inspect", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ url }) });
      const result = await response.json() as Inspection & { message?: string };
      if (!response.ok) throw new Error(result.message ?? "Could not inspect this addon.");
      setInspection(result); setStatus("idle");
    } catch (error) { setStatus("error"); setMessage(error instanceof Error ? error.message : "Could not inspect this addon."); }
  }
  function installAddon() {
    if (!inspection) return;
    const resources = inspection.kind === "stremio" ? (inspection.manifest.resources ?? []).map((item) => typeof item === "string" ? item : item.name) : ["repository", "providers"];
    const next: StoredAddon = { kind: inspection.kind, url: inspection.url, id: inspection.manifest.id ?? inspection.url, name: inspection.manifest.name, version: inspection.manifest.version, description: inspection.manifest.description ?? "", capabilities: resources, pluginCount: inspection.plugins?.length, catalogs: inspection.manifest.catalogs };
    const updated = [...installed.filter((item) => item.id !== next.id), next];
    setInstalled(updated); localStorage.setItem("astraplay:addons", JSON.stringify(updated)); setOpen(false); setInspection(null); setUrl("");
  }
  return <AppShell><main className="standard-page addons-page"><div className="page-intro"><span className="kicker">Source connections</span><h1>Bring your addons.</h1><p>Install Stremio manifests directly or import a CloudStream repository. Every remote response is fetched and validated by the protected addon runtime.</p></div><div className="addon-toolbar"><div><button className="active">Installed</button><button>Stremio</button><button>CloudStream</button></div><Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button variant="secondary"><Plus /> Install addon</Button></DialogTrigger><DialogContent className="install-dialog"><DialogHeader><DialogTitle>Install an addon</DialogTitle><DialogDescription>Paste a Stremio <code>manifest.json</code> URL or a CloudStream <code>repo.json</code> URL. AstraPlay inspects it before installation.</DialogDescription></DialogHeader><label className="addon-url-field"><span>Addon or repository URL</span><input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://…/manifest.json" /></label>{message && <p className="install-error">{message}</p>}{inspection && <div className="inspection-card"><span className="verified"><Check /> {inspection.kind} detected</span><h3>{inspection.manifest.name}</h3><p>{inspection.manifest.description}</p>{inspection.kind === "cloudstream" && <p className="bridge-message"><Cloud /> {inspection.plugins?.length ?? 0} providers indexed. Playback requires an Astra CloudStream Bridge because Android JVM plugins cannot execute safely in a browser.</p>}</div>}<div className="install-actions">{!inspection ? <Button onClick={inspectAddon} disabled={!url || status === "loading"}>{status === "loading" && <LoaderCircle className="spin" />}Inspect addon</Button> : <Button onClick={installAddon}>Install {inspection.manifest.name}</Button>}</div></DialogContent></Dialog></div><article className="addon-card"><div className="addon-icon"><Film /></div><div className="addon-main"><span className="verified"><Check /> Native demo protocol</span><h2>{demoAddon.name}</h2><p>{demoAddon.description}</p><div className="capabilities">{demoAddon.resources.map((resource) => <span key={resource}>{resource}</span>)}</div></div><div className="addon-side"><small>v{demoAddon.version}</small><button className={`switch ${enabled ? "on" : ""}`} onClick={() => setEnabled((value) => !value)} aria-label={`${enabled ? "Disable" : "Enable"} ${demoAddon.name}`}><span /></button><button className="text-button">Manage</button></div></article>{installed.map((addon) => <article className="addon-card" key={addon.id}><div className="addon-icon">{addon.kind === "stremio" ? <Sparkles /> : <Cloud />}</div><div className="addon-main"><span className="verified"><Check /> {addon.kind} compatible</span><h2>{addon.name}</h2><p>{addon.description || (addon.kind === "cloudstream" ? `${addon.pluginCount ?? 0} CloudStream providers indexed.` : "Remote Stremio addon")}</p><div className="capabilities">{addon.capabilities.map((resource) => <span key={resource}>{resource}</span>)}</div></div><div className="addon-side"><small>{addon.version ? `v${addon.version}` : addon.kind}</small><button className="switch on" aria-label={`Disable ${addon.name}`}><span /></button><button className="text-button" onClick={() => { const updated = installed.filter((item) => item.id !== addon.id); setInstalled(updated); localStorage.setItem("astraplay:addons", JSON.stringify(updated)); }}>Remove</button></div></article>)}<section className="security-note"><Settings2 /><div><strong>Protocol compatibility, not arbitrary execution</strong><p>Stremio HTTP addons run directly through the normalized proxy. CloudStream repositories can be indexed here; their compiled Android plugins require the separate bridge runtime instead of unsafe browser execution.</p></div></section></main></AppShell>;
}

function SearchView() {
  const [query, setQuery] = useState("");
  const results = media.filter((item) => item.title.toLowerCase().includes(query.toLowerCase()));
  return <AppShell><main className="standard-page search-page"><div className="page-intro compact"><span className="kicker">Search everything</span><h1>What are you in the mood for?</h1></div><label className="search-field standalone"><Search /><input autoFocus value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search titles, genres, people…" /></label><div className="discover-grid">{results.map((item) => <MediaCard key={item.id} item={item} />)}</div></main></AppShell>;
}

function WatchView({ item }: { item: MediaItem }) {
  const [playing, setPlaying] = useState(false);
  return <AppShell minimal><main className="watch-page"><div className="watch-backdrop" /><div className="watch-top"><BrandMark /><Link href={`/title/${item.type}/${item.id}`}>Exit player</Link></div><button className="center-play" onClick={() => setPlaying((value) => !value)} aria-label={playing ? "Pause" : "Play"}>{playing ? <span className="pause-bars" /> : <Play fill="currentColor" />}</button><div className="player-controls"><div className="player-title"><small>Now playing</small><strong>{item.title}</strong></div><div className="scrubber"><span style={{ width: playing ? "38%" : "24%" }} /></div><div className="control-row"><button onClick={() => setPlaying((value) => !value)}>{playing ? <span className="pause-bars small" /> : <Play fill="currentColor" />}</button><button><Volume2 /></button><span>34:12 / {item.runtime}</span><div /><button>CC</button><button>1080p</button><button><Tv /></button></div></div></main></AppShell>;
}

function StremioDetailsView({ mediaId, mediaType }: { mediaId: string; mediaType: string }) {
  const router = useRouter();
  const [meta, setMeta] = useState<RemoteMeta | null>(null);
  const [streams, setStreams] = useState<Array<RemoteStream & { addonName: string }>>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    async function load() {
      const addons = (JSON.parse(localStorage.getItem("astraplay:addons") ?? "[]") as StoredAddon[]).filter((addon) => addon.kind === "stremio");
      const request = async (addon: StoredAddon, resource: "meta" | "stream") => {
        if (!addon.capabilities.includes(resource)) return null;
        const response = await fetch("/api/addons/stremio", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ manifestUrl: addon.url, resource, type: mediaType, id: mediaId }) });
        if (!response.ok) return null;
        return { addon, data: await response.json() as { meta?: RemoteMeta; streams?: RemoteStream[] } };
      };
      const [metaResults, streamResults] = await Promise.all([Promise.all(addons.map((addon) => request(addon, "meta"))), Promise.all(addons.map((addon) => request(addon, "stream")))]);
      if (!active) return;
      setMeta(metaResults.find((result) => result?.data.meta)?.data.meta ?? { id: mediaId, type: mediaType, name: mediaId });
      setStreams(streamResults.flatMap((result) => (result?.data.streams ?? []).map((stream) => ({ ...stream, addonName: result?.addon.name ?? "Addon" }))));
      setLoading(false);
    }
    void load(); return () => { active = false; };
  }, [mediaId, mediaType]);
  function play(stream: RemoteStream) {
    if (!stream.url) return;
    sessionStorage.setItem("astraplay:selectedStream", JSON.stringify({ ...stream, meta }));
    router.push(`/watch/stremio/${encodeURIComponent(mediaId)}`);
  }
  return <AppShell><main className="remote-details">{meta?.background && <div className="remote-backdrop" style={{ backgroundImage: `url(${meta.background})` }} />}<section><span className="kicker">Stremio addon result</span><h1>{loading ? "Loading title…" : meta?.name}</h1>{meta?.releaseInfo && <div className="meta-line"><span>{meta.releaseInfo}</span><span>{mediaType}</span></div>}<p>{meta?.description ?? "Metadata is being resolved from your installed addons."}</p><h2>Available sources</h2>{loading ? <div className="loading-line"><LoaderCircle className="spin" /> Asking installed addons…</div> : streams.length ? <div className="remote-sources">{streams.map((stream, index) => <button key={`${stream.addonName}-${index}`} onClick={() => play(stream)} disabled={!stream.url}><span><strong>{stream.title || stream.name || "Stream"}</strong><small>{stream.addonName}{stream.infoHash ? " · Torrent bridge required" : stream.url ? " · Direct stream" : " · External playback"}</small></span>{stream.url ? <Play /> : <Cloud />}</button>)}</div> : <div className="no-streams">No installed addon returned a playable source for this ID.</div>}</section></main></AppShell>;
}

function RemoteWatchView() {
  const [selection] = useState<{ url?: string; title?: string; name?: string; meta?: RemoteMeta } | null>(() => {
    if (typeof window === "undefined") return null;
    try { return JSON.parse(sessionStorage.getItem("astraplay:selectedStream") ?? "null"); } catch { return null; }
  });
  return <AppShell minimal><main className="native-player"><div className="watch-top"><BrandMark /><Link href="/discover">Exit player</Link></div>{selection?.url ? <video src={selection.url} controls autoPlay playsInline crossOrigin="anonymous" /> : <div className="player-empty"><Film /><h1>No direct stream selected</h1><p>Choose a URL-based source from a connected Stremio addon.</p><Button asChild variant="secondary"><Link href="/discover">Back to discover</Link></Button></div>}<div className="native-player-label"><small>Playing from addon</small><strong>{selection?.meta?.name ?? selection?.title ?? selection?.name}</strong></div></main></AppShell>;
}

export function StreamingApp({ view, mediaId = "signal-sea", mediaType = "movie" }: { view: View; mediaId?: string; mediaType?: string }) {
  const item = findMedia(mediaId);
  useEffect(() => {
    document.documentElement.style.colorScheme = "dark";
    const context = (document as Document & { modelContext?: { registerTool: (tool: object, options?: { signal?: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({
      name: "search_catalog",
      title: "Search AstraPlay catalog",
      description: "Search the visible AstraPlay demo catalog by title or genre.",
      inputSchema: { type: "object", properties: { query: { type: "string", minLength: 1 } }, required: ["query"], additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute(input: unknown) {
        const query = typeof input === "object" && input && "query" in input && typeof input.query === "string" ? input.query.trim().toLowerCase() : "";
        if (!query) throw new Error("A non-empty query is required.");
        return { items: media.filter((entry) => `${entry.title} ${entry.genres.join(" ")}`.toLowerCase().includes(query)).map(({ id, type, title, year }) => ({ id, type, title, year })) };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);
  if (view === "details") return <DetailsView item={item} />;
  if (view === "discover") return <DiscoverView />;
  if (view === "library") return <LibraryView />;
  if (view === "addons") return <AddonsView />;
  if (view === "search") return <SearchView />;
  if (view === "watch") return <WatchView item={item} />;
  if (view === "stremio") return <StremioDetailsView mediaId={mediaId} mediaType={mediaType} />;
  if (view === "remote-watch") return <RemoteWatchView />;
  return <HomeView />;
}
