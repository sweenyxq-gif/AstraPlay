# Meta resource

`GET /meta/:type/:id` returns one unified media object. Provider-only fields must be mapped into `externalIds` or omitted. Metadata can use a long cache TTL because it is independent from expiring streams.
