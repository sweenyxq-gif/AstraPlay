import { describe, expect, it } from "vitest";
import { validateRemoteAddonUrl } from "./security";

describe("remote addon URL policy", () => {
  it("accepts public HTTPS addon URLs", () => expect(validateRemoteAddonUrl("https://example.com/manifest.json").hostname).toBe("example.com"));
  it.each(["http://example.com/manifest.json", "https://127.0.0.1/manifest.json", "https://router.local/repo.json", "file:///tmp/manifest.json"])("rejects unsafe addon URL %s", (url) => expect(() => validateRemoteAddonUrl(url)).toThrow());
});
