import { describe, expect, it } from "vitest";
import { addonManifestSchema, streamSourceSchema } from "./index";
import {
  cloudstreamRepoSchema,
  stremioMetaResponseSchema,
  stremioSubtitlesResponseSchema,
} from "./stremio";

describe("addon protocol validation", () => {
  it("accepts the controlled manifest shape", () => {
    expect(
      addonManifestSchema.parse({
        id: "org.example.demo",
        name: "Demo",
        version: "1.0.0",
        description: "Safe demo",
        author: "Example",
        resources: ["stream"],
        types: ["movie"],
      }).id
    ).toBe("org.example.demo");
  });

  it("rejects unsafe stream protocols", () => {
    expect(() =>
      streamSourceSchema.parse({
        id: "x",
        addonId: "a",
        provider: "Demo",
        title: "File",
        quality: "1080p",
        format: "MP4",
        language: "en",
        url: "javascript:alert(1)",
      })
    ).toThrow();
  });

  it("parses series meta with episodes", () => {
    const metaPayload = {
      meta: {
        id: "tt0903747",
        type: "series",
        name: "Breaking Bad",
        genres: ["Crime", "Drama"],
        videos: [
          {
            id: "tt0903747:1:1",
            title: "Pilot",
            season: 1,
            number: 1,
            released: "2008-01-20",
          },
        ],
      },
    };
    const parsed = stremioMetaResponseSchema.parse(metaPayload);
    expect(parsed.meta?.name).toBe("Breaking Bad");
    expect(parsed.meta?.videos?.[0].season).toBe(1);
    expect(parsed.meta?.videos?.[0].number).toBe(1);
  });

  it("validates subtitle tracks and cloudstream repo", () => {
    const subs = stremioSubtitlesResponseSchema.parse({
      subtitles: [{ id: "sub-1", url: "https://example.com/en.vtt", lang: "eng" }],
    });
    expect(subs.subtitles.length).toBe(1);
    expect(subs.subtitles[0].lang).toBe("eng");

    const repo = cloudstreamRepoSchema.parse({
      name: "Community Repo",
      manifestVersion: 1,
      pluginLists: ["https://example.com/plugins.json"],
    });
    expect(repo.name).toBe("Community Repo");
  });
});

