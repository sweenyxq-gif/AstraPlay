import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/discover", "/library", "/addons", "/search", "/about", "/dmca", "/terms"],
        disallow: ["/api/", "/watch/"],
      },
    ],
    sitemap: "https://astraplay.onrender.com/sitemap.xml",
  };
}
