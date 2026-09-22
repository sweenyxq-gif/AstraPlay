import { z } from "zod";
export const addonManifestSchema = z.object({
  id: z.string().regex(/^[a-z0-9.-]+$/), name: z.string().min(1).max(80),
  version: z.string().min(1).max(24), description: z.string().max(280),
  author: z.string().max(80).default("Unknown"),
  resources: z.array(z.enum(["catalog", "meta", "stream", "subtitles"])).min(1),
  types: z.array(z.enum(["movie", "series"])).min(1),
});
export const streamSourceSchema = z.object({
  id: z.string(), addonId: z.string(), provider: z.string(), title: z.string(),
  quality: z.enum(["4K", "1080p", "720p"]), format: z.enum(["HLS", "DASH", "MP4"]),
  language: z.string(), size: z.string().optional(), url: z.string().url().refine((value) => value.startsWith("https://"), "Only HTTPS stream URLs are allowed"),
});
export type AddonManifestInput = z.infer<typeof addonManifestSchema>;
