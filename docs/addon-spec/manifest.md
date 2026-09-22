# Manifest resource

Every addon exposes `GET /manifest.json` over HTTPS. Required fields are `id`, `name`, `version`, `description`, `author`, `resources`, and `types`. Unknown or malformed capabilities are rejected.

AstraPlay also accepts the official Stremio manifest shape, including string or object resources and catalog declarations. The installer stores the verified manifest URL locally; live catalog, meta, stream, and subtitle requests are routed through the protected server proxy.

```json
{"id":"org.example.archive","name":"Archive","version":"1.0.0","description":"Authorized media","author":"Example","resources":["catalog","meta","stream","subtitles"],"types":["movie","series"]}
```
