# Architecture overview

AstraPlay follows a ports-and-adapters boundary. The web client and API know only the shared domain models. Metadata providers map upstream responses into `MediaItem`; addons map authorized source systems into validated catalog, meta, stream, and subtitle resources.

```text
Web UI → Application API → Metadata port
                      └──→ Addon runtime → HTTP addon endpoints
                                      └──→ catalog | meta | stream | subtitles
```

Provider credentials and extraction behavior never enter React components. External payloads cross Zod validation before becoming domain objects. The deployment currently runs the web/API surface together; the same contracts can later be split into independently deployed apps and services without changing consumers.

## Decisions

- Next.js provides the web shell and typed route boundaries.
- Shared TypeScript models prevent UI/API drift.
- Remote HTTP addons are data-only; arbitrary addon JavaScript is never run in the browser.
- Mock metadata lives only in `mocks/` and is replaceable behind the metadata port.

## Compatibility

Stremio HTTP addons are consumed natively through their official `manifest.json` and `/{resource}/{type}/{id}.json` routes. CloudStream `repo.json` files and plugin indexes can be installed and inspected, but compiled Android plugins execute only in the isolated CloudStream Bridge described under `services/cloudstream-bridge`; the web client never evaluates plugin bytecode.
