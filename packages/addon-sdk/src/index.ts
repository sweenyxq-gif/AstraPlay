import { addonManifestSchema, type AddonManifestInput } from "../../addon-types/src";
type Request = { type: "movie" | "series"; id: string };
type Handler<T> = (request: Request) => Promise<T>;
export function createAddon(input: AddonManifestInput) {
  const manifest = addonManifestSchema.parse(input);
  const handlers = new Map<string, Handler<unknown>>();
  return {
    manifest,
    registerCatalog: <T>(handler: Handler<T>) => handlers.set("catalog", handler),
    registerMeta: <T>(handler: Handler<T>) => handlers.set("meta", handler),
    registerStream: <T>(handler: Handler<T>) => handlers.set("stream", handler),
    registerSubtitles: <T>(handler: Handler<T>) => handlers.set("subtitles", handler),
    handle: async <T>(resource: string, request: Request) => {
      const handler = handlers.get(resource);
      if (!handler) throw new Error(`Unsupported addon resource: ${resource}`);
      return handler(request) as Promise<T>;
    },
  };
}
