export type MediaType = "movie" | "series";
export interface MediaItem {
  id: string; type: MediaType; title: string; eyebrow: string; description: string;
  year: number; rating: number; runtime: string; genres: string[];
  palette: [string, string]; glyph: string; progress?: number;
}
export interface StreamSource {
  id: string; addonId: string; provider: string; title: string;
  quality: "4K" | "1080p" | "720p"; format: "HLS" | "DASH" | "MP4";
  language: string; size?: string; url: string;
}
export interface AddonManifest {
  id: string; name: string; version: string; description: string; author: string;
  resources: Array<"catalog" | "meta" | "stream" | "subtitles">; types: MediaType[];
}
