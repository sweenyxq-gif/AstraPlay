import { z } from "zod";

const resourceSchema = z.union([
  z.string().min(1),
  z.object({ name: z.string().min(1), types: z.array(z.string()).optional(), idPrefixes: z.array(z.string()).optional() }),
]);

export const stremioManifestSchema = z.object({
  id: z.string().min(1), version: z.string().min(1), name: z.string().min(1),
  description: z.string().optional().default(""),
  resources: z.array(resourceSchema).min(1), types: z.array(z.string()).min(1),
  catalogs: z.array(z.object({ type: z.string(), id: z.string(), name: z.string().optional(), extra: z.array(z.object({ name: z.string(), isRequired: z.boolean().optional() })).optional() })).optional().default([]),
  logo: z.string().url().optional(), background: z.string().url().optional(),
}).passthrough();

export const stremioCatalogResponseSchema = z.object({
  metas: z.array(z.object({ id: z.string(), type: z.string(), name: z.string(), poster: z.string().url().optional(), background: z.string().url().optional(), description: z.string().optional(), releaseInfo: z.string().optional() }).passthrough()).default([]),
}).passthrough();

export const stremioStreamResponseSchema = z.object({
  streams: z.array(z.object({ name: z.string().optional(), title: z.string().optional(), url: z.string().url().optional(), ytId: z.string().optional(), infoHash: z.string().optional(), behaviorHints: z.record(z.string(), z.unknown()).optional() }).passthrough()).default([]),
}).passthrough();

export const stremioVideoSchema = z.object({
  id: z.string(),
  title: z.string().optional(),
  name: z.string().optional(),
  season: z.number().optional(),
  number: z.number().optional(),
  episode: z.number().optional(),
  thumbnail: z.string().optional(),
  released: z.string().optional(),
  overview: z.string().optional(),
  description: z.string().optional(),
}).passthrough();

export const stremioMetaItemSchema = z.object({
  id: z.string(),
  type: z.string(),
  name: z.string(),
  genres: z.array(z.string()).optional(),
  poster: z.string().optional(),
  posterShape: z.string().optional(),
  background: z.string().optional(),
  logo: z.string().optional(),
  description: z.string().optional(),
  releaseInfo: z.string().optional(),
  year: z.union([z.string(), z.number()]).optional(),
  imdbRating: z.union([z.string(), z.number()]).optional(),
  runtime: z.string().optional(),
  director: z.union([z.string(), z.array(z.string())]).optional(),
  cast: z.union([z.string(), z.array(z.string())]).optional(),
  videos: z.array(stremioVideoSchema).optional(),
}).passthrough();

export const stremioMetaResponseSchema = z.object({
  meta: stremioMetaItemSchema.optional(),
}).passthrough();

export const stremioSubtitleSchema = z.object({
  id: z.string().optional(),
  url: z.string().url(),
  lang: z.string(),
  label: z.string().optional(),
}).passthrough();

export const stremioSubtitlesResponseSchema = z.object({
  subtitles: z.array(stremioSubtitleSchema).default([]),
}).passthrough();

export type StremioManifest = z.infer<typeof stremioManifestSchema>;
export type StremioMetaItem = z.infer<typeof stremioMetaItemSchema>;
export type StremioVideo = z.infer<typeof stremioVideoSchema>;
export type StremioSubtitle = z.infer<typeof stremioSubtitleSchema>;

export const cloudstreamRepoSchema = z.object({
  name: z.string().min(1), description: z.string().optional().default(""), manifestVersion: z.number(), pluginLists: z.array(z.string().url()).min(1),
}).passthrough();

export const cloudstreamPluginSchema = z.object({
  name: z.string().min(1), url: z.string().url(), version: z.number().optional(), description: z.string().optional(), language: z.string().optional(), status: z.number().optional(), tvTypes: z.array(z.string()).optional(),
  authors: z.array(z.string()).optional(),
  internalName: z.string().optional(),
}).passthrough();

export type CloudstreamRepo = z.infer<typeof cloudstreamRepoSchema>;
export type CloudstreamPlugin = z.infer<typeof cloudstreamPluginSchema>;
