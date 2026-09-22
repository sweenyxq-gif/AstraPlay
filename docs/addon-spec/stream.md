# Stream resource

`GET /stream/:type/:id` and `GET /stream/series/:id/:season/:episode` return `{ "items": StreamSource[] }`. A source declares provider, label, URL, quality, format, language, optional size, and safe behavior hints. HTTPS is mandatory outside explicit local development.

Signed URLs receive a TTL shorter than their validity. Redirects are revalidated and private-network destinations are rejected.
