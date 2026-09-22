# Catalog resource

`GET /catalog/:type/:id` returns `{ "items": MediaItem[] }`. Pagination uses an opaque `nextCursor`; consumers must not infer provider page numbers. Catalog responses are medium-lived cache candidates.
