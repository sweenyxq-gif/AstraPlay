const blockedHosts = new Set(["localhost", "localhost.localdomain", "metadata.google.internal"]);

export class AddonRequestError extends Error {
  constructor(public code: string, message: string, public status = 400) { super(message); }
}

export function validateRemoteAddonUrl(input: string) {
  let clean = input.trim();
  if (clean.startsWith("stremio://")) {
    clean = "https://" + clean.slice(10);
  }

  let url: URL;
  try {
    url = new URL(clean);
  } catch {
    throw new AddonRequestError("INVALID_ADDON_URL", "Enter a complete HTTPS URL.");
  }

  if (url.protocol !== "https:") {
    throw new AddonRequestError("UNSAFE_ADDON_URL", "Addon URLs must use HTTPS.");
  }
  if (url.username || url.password) {
    throw new AddonRequestError("UNSAFE_ADDON_URL", "Credentials are not allowed in addon URLs.");
  }

  const host = url.hostname.toLowerCase().replace(/\.$/, "");
  if (
    blockedHosts.has(host) ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host.endsWith(".internal")
  ) {
    throw new AddonRequestError("PRIVATE_NETWORK_BLOCKED", "Private network addon addresses are not allowed.");
  }
  if (
    /^(127|10|0|169\.254|192\.168)\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
    host === "::1" ||
    host.startsWith("fc") ||
    host.startsWith("fd")
  ) {
    throw new AddonRequestError("PRIVATE_NETWORK_BLOCKED", "Private network addon addresses are not allowed.");
  }


  // If path doesn't end in a json file or slash, normalize to /manifest.json
  if (!url.pathname.endsWith(".json")) {
    if (url.pathname.endsWith("/")) {
      url.pathname = url.pathname + "manifest.json";
    } else {
      url.pathname = url.pathname + "/manifest.json";
    }
  }

  return url;
}

export async function safeJsonFetch(input: string, maxBytes = 2_000_000) {
  let url = validateRemoteAddonUrl(input);
  for (let redirect = 0; redirect <= 3; redirect += 1) {
    const response = await fetch(url, {
      redirect: "manual",
      headers: {
        Accept: "application/json, text/plain, */*",
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36 Stremio/4.4",
      },
      signal: AbortSignal.timeout(10_000),
    });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location || redirect === 3) {
        throw new AddonRequestError("REDIRECT_REJECTED", "The addon redirected too many times.", 502);
      }
      url = validateRemoteAddonUrl(new URL(location, url).toString());
      continue;
    }
    if (!response.ok) {
      throw new AddonRequestError("ADDON_UNAVAILABLE", `The addon returned HTTP ${response.status}.`, 502);
    }
    const declaredLength = Number(response.headers.get("content-length") ?? 0);
    if (declaredLength > maxBytes) {
      throw new AddonRequestError("ADDON_RESPONSE_TOO_LARGE", "The addon response is too large.", 413);
    }
    const text = await response.text();
    if (new TextEncoder().encode(text).byteLength > maxBytes) {
      throw new AddonRequestError("ADDON_RESPONSE_TOO_LARGE", "The addon response is too large.", 413);
    }
    try {
      return { data: JSON.parse(text) as unknown, finalUrl: url.toString() };
    } catch {
      throw new AddonRequestError("INVALID_ADDON_RESPONSE", "The addon did not return valid JSON.", 502);
    }
  }
  throw new AddonRequestError("ADDON_UNAVAILABLE", "The addon could not be reached.", 502);
}

