import { describe, expect, it } from "vitest";
import { addonManifestSchema, streamSourceSchema } from "./index";

describe("addon protocol validation", () => {
  it("accepts the controlled manifest shape", () => {
    expect(addonManifestSchema.parse({ id: "org.example.demo", name: "Demo", version: "1.0.0", description: "Safe demo", author: "Example", resources: ["stream"], types: ["movie"] }).id).toBe("org.example.demo");
  });
  it("rejects unsafe stream protocols", () => {
    expect(() => streamSourceSchema.parse({ id: "x", addonId: "a", provider: "Demo", title: "File", quality: "1080p", format: "MP4", language: "en", url: "javascript:alert(1)" })).toThrow();
  });
});
