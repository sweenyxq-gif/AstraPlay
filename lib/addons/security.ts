const blockedHosts = new Set(["localhost", "localhost.localdomain", "metadata.google.internal"]);

export class AddonRequestError extends Error {
  constructor(public code: string, message: string, public status = 400) { super(message); }
}

export function validateRemoteAddonUrl(input: string) {
  let url: URL;
  try { url = new URL(input); } catch { throw new AddonRequestError("INVALID_ADDON_URL", "Enter a complete HTTPS URL."); }
  if (url.protocol !== "https:") throw new AddonRequestError("UNSAFE_ADDON_URL", "Addon URLs must use HTTPS.");
  if (url.username || url.password) throw new AddonRequestError("UNSAFE_ADDON_URL", "Credentials are not allowed in addon URLs.");
  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  if (blockedHosts.has(host) || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".internal")) throw new AddonRequestError("PRIVATE_NETWORK_BLOCKED", "Private network addon addresses are not allowed.");
  if (/^(127|10|0|169\.254|192\.168)\./.test(host) || /^172\.(1[6-9]|2\d|3[01])\./.test(host) || host === "::1" || host.startsWith("fc") || host.startsWith("fd")) throw new AddonRequestError("PRIVATE_NETWORK_BLOCKED", "Private network addon addresses are not allowed.");
  return url;
}

export async function safeJsonFetch(input: string, maxBytes = 1_000_000) {
  let url = validateRemoteAddonUrl(input);
  for (let redirect = 0; redirect <= 3; redirect += 1) {
    const response = await fetch(url, { redirect: "manual", headers: { Accept: "application/json", "User-Agent": "AstraPlay-AddonRuntime/0.1" }, signal: AbortSignal.timeout(8_000) });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location || redirect === 3) throw new AddonRequestError("REDIRECT_REJECTED", "The addon redirected too many times.", 502);
      url = validateRemoteAddonUrl(new URL(location, url).toString());
      continue;
    }
    if (!response.ok) throw new AddonRequestError("ADDON_UNAVAILABLE", `The addon returned HTTP ${response.status}.`, 502);
    const declaredLength = Number(response.headers.get("content-length") ?? 0);
    if (declaredLength > maxBytes) throw new AddonRequestError("ADDON_RESPONSE_TOO_LARGE", "The addon response is too large.", 413);
    const text = await response.text();
    if (new TextEncoder().encode(text).byteLength > maxBytes) throw new AddonRequestError("ADDON_RESPONSE_TOO_LARGE", "The addon response is too large.", 413);
    try { return { data: JSON.parse(text) as unknown, finalUrl: url.toString() }; } catch { throw new AddonRequestError("INVALID_ADDON_RESPONSE", "The addon did not return valid JSON.", 502); }
  }
  throw new AddonRequestError("ADDON_UNAVAILABLE", "The addon could not be reached.", 502);
}
