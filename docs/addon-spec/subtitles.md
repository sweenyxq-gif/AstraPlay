# Subtitle resource

`GET /subtitles/:type/:id` returns language, source, format (`vtt` or `srt`), URL, and optional hearing-impaired metadata. SRT conversion produces an ephemeral WebVTT representation and never mutates the addon asset.
