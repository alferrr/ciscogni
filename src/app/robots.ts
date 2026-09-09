import type { MetadataRoute } from "next";

const SITE_URL = "https://ciscogni.dcism.org";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/register"],
      disallow: [
        "/api/",
        "/dashboard",
        "/practice",
        "/competitive",
        "/daily",
        "/leaderboard",
        "/profile",
        "/onboarding",
        "/admin",
      ],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
