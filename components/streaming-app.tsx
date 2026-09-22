"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Bookmark, Check, ChevronRight, CircleUserRound, Cloud, Compass, Film, Home, Library, LoaderCircle, Play, Plus, Search, Settings2, Sparkles } from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

type View = "home" | "details" | "discover" | "library" | "addons" | "search" | "watch" | "stremio" | "remote-watch";
type StoredAddon = { kind: "stremio" | "cloudstream"; url: string; id: string; name: string; version?: string; description: string; capabilities: string[]; pluginCount?: number; catalogs?: Array<{ type: string; id: string; name?: string }> };
type RemoteMeta = { id: string; type: string; name: string; poster?: string; background?: string; description?: string; releaseInfo?: string };
type RemoteStream = { name?: string; title?: string; url?: string; ytId?: string; infoHash?: string };

function ConnectedCatalogs() {
  const [items, setItems] = useState<Array<RemoteMeta & { addonName: string }>>([]);
  const [loaded, setLoaded] = useState(false);
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
      if (active) { setItems(results.flat()); setLoaded(true); }
    }
    void load(); return () => { active = false; };
  }, []);
  if (!loaded) return <div className="loading-line"><LoaderCircle className="spin" /> Loading installed catalogs…</div>;
  if (!items.length) return <EmptyCatalog />;
  return <section className="connected-catalog"><div className="section-heading"><h2>From your Stremio addons</h2><span>Live catalog</span></div><div className="remote-list">{items.map((item, index) => <Link href={`/stremio/${encodeURIComponent(item.type)}/${encodeURIComponent(item.id)}`} className="remote-list-card" key={`${item.id}-${index}`}><span><strong>{item.name}</strong><small>{item.releaseInfo ?? item.addonName}</small></span><ChevronRight /></Link>)}</div></section>;
}

function EmptyCatalog() {
  return <section className="empty-catalog"><Sparkles /><span className="kicker">No demo catalog</span><h2>Your library starts with your addons.</h2><p>Install a Stremio manifest or CloudStream repository. AstraPlay will show only data returned by the sources you connect.</p><Button asChild className="primary-action"><Link href="/addons"><Plus /> Connect an addon</Link></Button></section>;
}

function Header() {
  return (
    <header className="app-header"><BrandMark /><nav className="desktop-nav" aria-label="Primary navigation"><Link href="/">Home</Link><Link href="/discover">Discover</Link><Link href="/addons">Addons</Link></nav><div className="header-actions"><Link className="icon-button" href="/search" aria-label="Search"><Search /></Link><Link className="icon-button" href="/library" aria-label="Library"><Bookmark /></Link><button className="profile-button" aria-label="Open profile"><CircleUserRound /></button></div></header>
  );
}

function MobileNav() {
  return <nav className="mobile-nav" aria-label="Mobile navigation"><Link href="/"><Home /><span>Home</span></Link><Link href="/discover"><Compass /><span>Discover</span></Link><Link href="/search"><Search /><span>Search</span></Link><Link href="/library"><Library /><span>Library</span></Link><button><CircleUserRound /><span>Profile</span></button></nav>;
}

function AppShell({ children, minimal = false }: { children: React.ReactNode; minimal?: boolean }) {
  return <div className={`app-shell ${minimal ? "minimal" : ""}`}>{!minimal && <Header />}{children}{!minimal && <MobileNav />}</div>;
}

function HomeView() {
  return <AppShell><main className="standard-page home-empty"><EmptyCatalog /></main></AppShell>;
}

function DetailsView() {
  return <AppShell><main className="standard-page"><EmptyCatalog /></main></AppShell>;
}

function DiscoverView() {
  return <AppShell><main className="standard-page"><div className="page-intro"><span className="kicker">Installed sources only</span><h1>Discover.</h1><p>Titles below come directly from the Stremio addons you install.</p></div><ConnectedCatalogs /></main></AppShell>;
}

function LibraryView() {
  return <AppShell><main className="standard-page"><div className="page-intro compact"><span className="kicker">Your library</span><h1>Nothing saved yet.</h1><p>Watch history and saved titles will appear here after you connect an addon and start watching.</p></div><EmptyCatalog /></main></AppShell>;
}

function AddonsView() {
  type Inspection = { kind: "stremio" | "cloudstream"; url: string; manifest: { id?: string; name: string; version?: string; description?: string; resources?: Array<string | { name: string }>; pluginLists?: string[]; catalogs?: Array<{ type: string; id: string; name?: string }> }; plugins?: unknown[]; runtime?: string };
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
  return <AppShell><main className="standard-page addons-page"><div className="page-intro"><span className="kicker">Source connections</span><h1>Bring your addons.</h1><p>Install Stremio manifests directly or import a CloudStream repository. AstraPlay contains no preloaded catalog or demo provider.</p></div><div className="addon-toolbar"><div><button className="active">Installed</button><button>Stremio</button><button>CloudStream</button></div><Dialog open={open} onOpenChange={setOpen}><DialogTrigger asChild><Button variant="secondary"><Plus /> Install addon</Button></DialogTrigger><DialogContent className="install-dialog"><DialogHeader><DialogTitle>Install an addon</DialogTitle><DialogDescription>Paste a Stremio <code>manifest.json</code> URL or a CloudStream <code>repo.json</code> URL. AstraPlay inspects it before installation.</DialogDescription></DialogHeader><label className="addon-url-field"><span>Addon or repository URL</span><input value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://…/manifest.json" /></label>{message && <p className="install-error">{message}</p>}{inspection && <div className="inspection-card"><span className="verified"><Check /> {inspection.kind} detected</span><h3>{inspection.manifest.name}</h3><p>{inspection.manifest.description}</p>{inspection.kind === "cloudstream" && <p className="bridge-message"><Cloud /> {inspection.plugins?.length ?? 0} providers indexed. Playback requires an Astra CloudStream Bridge because Android JVM plugins cannot execute safely in a browser.</p>}</div>}<div className="install-actions">{!inspection ? <Button onClick={inspectAddon} disabled={!url || status === "loading"}>{status === "loading" && <LoaderCircle className="spin" />}Inspect addon</Button> : <Button onClick={installAddon}>Install {inspection.manifest.name}</Button>}</div></DialogContent></Dialog></div>{installed.length === 0 && <div className="addon-empty"><Cloud /><strong>No addons installed</strong><p>Use “Install addon” to connect your own source.</p></div>}{installed.map((addon) => <article className="addon-card" key={addon.id}><div className="addon-icon">{addon.kind === "stremio" ? <Sparkles /> : <Cloud />}</div><div className="addon-main"><span className="verified"><Check /> {addon.kind} compatible</span><h2>{addon.name}</h2><p>{addon.description || (addon.kind === "cloudstream" ? `${addon.pluginCount ?? 0} CloudStream providers indexed.` : "Remote Stremio addon")}</p><div className="capabilities">{addon.capabilities.map((resource) => <span key={resource}>{resource}</span>)}</div></div><div className="addon-side"><small>{addon.version ? `v${addon.version}` : addon.kind}</small><button className="switch on" aria-label={`Disable ${addon.name}`}><span /></button><button className="text-button" onClick={() => { const updated = installed.filter((item) => item.id !== addon.id); setInstalled(updated); localStorage.setItem("astraplay:addons", JSON.stringify(updated)); }}>Remove</button></div></article>)}<section className="security-note"><Settings2 /><div><strong>Protocol compatibility, not arbitrary execution</strong><p>Stremio HTTP addons run directly through the normalized proxy. CloudStream repositories can be indexed here; their compiled Android plugins require the separate bridge runtime instead of unsafe browser execution.</p></div></section></main></AppShell>;
}

function SearchView() {
  return <AppShell><main className="standard-page search-page"><div className="page-intro compact"><span className="kicker">Search installed sources</span><h1>Search starts after setup.</h1><p>Connect an addon first; AstraPlay no longer includes a local demo catalog.</p></div><Button asChild className="primary-action"><Link href="/addons"><Plus /> Connect an addon</Link></Button></main></AppShell>;
}

function WatchView() {
  return <AppShell minimal><main className="native-player"><div className="watch-top"><BrandMark /><Link href="/addons">Exit player</Link></div><div className="player-empty"><Film /><h1>No demo stream</h1><p>Choose a source returned by one of your installed Stremio addons.</p><Button asChild variant="secondary"><Link href="/addons">Connect an addon</Link></Button></div></main></AppShell>;
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
  return <AppShell><main className="remote-details"><section><span className="kicker">Stremio addon result</span><h1>{loading ? "Loading title…" : meta?.name}</h1>{meta?.releaseInfo && <div className="meta-line"><span>{meta.releaseInfo}</span><span>{mediaType}</span></div>}<p>{meta?.description ?? "Metadata is being resolved from your installed addons."}</p><h2>Available sources</h2>{loading ? <div className="loading-line"><LoaderCircle className="spin" /> Asking installed addons…</div> : streams.length ? <div className="remote-sources">{streams.map((stream, index) => <button key={`${stream.addonName}-${index}`} onClick={() => play(stream)} disabled={!stream.url}><span><strong>{stream.title || stream.name || "Stream"}</strong><small>{stream.addonName}{stream.infoHash ? " · Torrent bridge required" : stream.url ? " · Direct stream" : " · External playback"}</small></span>{stream.url ? <Play /> : <Cloud />}</button>)}</div> : <div className="no-streams">No installed addon returned a playable source for this ID.</div>}</section></main></AppShell>;
}

function RemoteWatchView() {
  const [selection] = useState<{ url?: string; title?: string; name?: string; meta?: RemoteMeta } | null>(() => {
    if (typeof window === "undefined") return null;
    try { return JSON.parse(sessionStorage.getItem("astraplay:selectedStream") ?? "null"); } catch { return null; }
  });
  return <AppShell minimal><main className="native-player"><div className="watch-top"><BrandMark /><Link href="/discover">Exit player</Link></div>{selection?.url ? <video src={selection.url} controls autoPlay playsInline crossOrigin="anonymous" /> : <div className="player-empty"><Film /><h1>No direct stream selected</h1><p>Choose a URL-based source from a connected Stremio addon.</p><Button asChild variant="secondary"><Link href="/discover">Back to discover</Link></Button></div>}<div className="native-player-label"><small>Playing from addon</small><strong>{selection?.meta?.name ?? selection?.title ?? selection?.name}</strong></div></main></AppShell>;
}

export function StreamingApp({ view, mediaId = "", mediaType = "movie" }: { view: View; mediaId?: string; mediaType?: string }) {
  useEffect(() => {
    document.documentElement.style.colorScheme = "dark";
    const context = (document as Document & { modelContext?: { registerTool: (tool: object, options?: { signal?: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    void Promise.resolve(context.registerTool({
      name: "search_catalog",
      title: "Search AstraPlay catalog",
      description: "Report whether AstraPlay has a local catalog available for search.",
      inputSchema: { type: "object", properties: { query: { type: "string", minLength: 1 } }, required: ["query"], additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute(input: unknown) {
        const query = typeof input === "object" && input && "query" in input && typeof input.query === "string" ? input.query.trim().toLowerCase() : "";
        if (!query) throw new Error("A non-empty query is required.");
        return { items: [], message: `No local catalog is installed for “${query}”. Connect an addon to search.` };
      },
    }, { signal: lifecycle.signal })).catch(() => undefined);
    return () => lifecycle.abort();
  }, []);
  if (view === "details") return <DetailsView />;
  if (view === "discover") return <DiscoverView />;
  if (view === "library") return <LibraryView />;
  if (view === "addons") return <AddonsView />;
  if (view === "search") return <SearchView />;
  if (view === "watch") return <WatchView />;
  if (view === "stremio") return <StremioDetailsView mediaId={mediaId} mediaType={mediaType} />;
  if (view === "remote-watch") return <RemoteWatchView />;
  return <HomeView />;
}
