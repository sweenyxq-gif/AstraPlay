# AstraPlay

A cinematic, source-agnostic streaming aggregation foundation. The web experience consumes unified media, stream, subtitle, and addon contracts; provider-specific behavior stays outside the UI.

## Run locally

```bash
npm install
npm run dev
```

Quality gates: `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build`.

## Repository map

- `app/` — Next.js routes and HTTP boundaries
- `components/` — product and UI presentation
- `packages/shared/` — domain models
- `packages/addon-types/` — runtime schemas and shared types
- `packages/addon-sdk/` — ergonomic addon registration API
- `mocks/` — isolated development catalogs
- `examples/public-domain-addon/` — controlled legal protocol example
- `docs/` — architecture, security, development, and addon protocol

This Phase 1/2 delivery intentionally uses isolated demo metadata. Production metadata, authentication, database persistence, Redis caching, and Shaka playback are next-phase integrations.
