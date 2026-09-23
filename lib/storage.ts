export interface WatchProgress {
  id: string;
  type: string;
  title: string;
  poster?: string;
  backdrop?: string;
  timestamp: number;
  duration: number;
  percent: number;
  season?: number;
  episode?: number;
  episodeTitle?: string;
  updatedAt: number;
}

export interface WatchlistItem {
  id: string;
  type: string;
  title: string;
  poster?: string;
  backdrop?: string;
  year?: string | number;
  addedAt: number;
}

export function getWatchProgress(): WatchProgress[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("astraplay:progress");
    return raw ? (JSON.parse(raw) as WatchProgress[]) : [];
  } catch {
    return [];
  }
}

export function saveWatchProgress(progress: WatchProgress) {
  if (typeof window === "undefined") return;
  try {
    const current = getWatchProgress();
    const filtered = current.filter((p) => p.id !== progress.id);
    const updated = [progress, ...filtered].slice(0, 50);
    localStorage.setItem("astraplay:progress", JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function removeWatchProgress(id: string) {
  if (typeof window === "undefined") return;
  try {
    const current = getWatchProgress();
    const updated = current.filter((p) => p.id !== id);
    localStorage.setItem("astraplay:progress", JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function getWatchlist(): WatchlistItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("astraplay:watchlist");
    return raw ? (JSON.parse(raw) as WatchlistItem[]) : [];
  } catch {
    return [];
  }
}

export function toggleWatchlist(item: WatchlistItem): boolean {
  if (typeof window === "undefined") return false;
  try {
    const list = getWatchlist();
    const exists = list.some((i) => i.id === item.id);
    let updated: WatchlistItem[];
    if (exists) {
      updated = list.filter((i) => i.id !== item.id);
    } else {
      updated = [item, ...list];
    }
    localStorage.setItem("astraplay:watchlist", JSON.stringify(updated));
    return !exists;
  } catch {
    return false;
  }
}

export function isInWatchlist(id: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return getWatchlist().some((item) => item.id === id);
  } catch {
    return false;
  }
}
