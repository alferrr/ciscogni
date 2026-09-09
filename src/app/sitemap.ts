import type { MetadataRoute } from "next";

const SITE_URL = "https://ciscogni.dcism.org";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE_URL}/`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${SITE_URL}/register`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];
}
