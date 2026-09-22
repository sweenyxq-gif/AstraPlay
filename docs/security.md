# Addon security

Treat addon URLs and responses as hostile. Production installation must resolve DNS server-side, permit HTTPS only, reject localhost/private/link-local/reserved ranges, re-check every redirect, cap redirects, set connection and total timeouts, limit response bytes, and validate content type plus JSON schema.

Strip unapproved request headers and response HTML, never forward user cookies or authorization implicitly, and do not log tokens or sensitive query parameters. Re-resolve hostnames at connection time to reduce DNS-rebinding risk. Stream URLs are short-cache data, not trusted executable content.
