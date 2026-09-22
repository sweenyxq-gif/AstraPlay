# Astra CloudStream Bridge

CloudStream extensions are compiled Android/JVM plugins, not remote JSON addons. A browser cannot safely or correctly execute their DEX/JAR code. AstraPlay therefore treats a CloudStream repository as an index and delegates provider execution to a separately isolated bridge.

The bridge contract is HTTP and returns the same normalized domain objects used by Stremio addons:

- `POST /v1/search` — `{ providerId, query }`
- `POST /v1/load` — `{ providerId, url }`
- `POST /v1/streams` — `{ providerId, data }`

Production requirements: container isolation per provider, no host filesystem, outbound domain allowlists, strict CPU/memory/time budgets, response limits, request IDs, and no forwarded user cookies. This runtime is intentionally not embedded in the Cloudflare web deployment.
