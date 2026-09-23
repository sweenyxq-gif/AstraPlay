import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://astraplay.onrender.com";
  const routes = [
    "",
    "/discover",
    "/library",
    "/addons",
    "/search",
    "/about",
    "/dmca",
    "/terms",
  ];

  return routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" || route === "/discover" ? "daily" : "monthly",
    priority: route === "" ? 1.0 : route === "/discover" ? 0.9 : 0.7,
  }));
}
