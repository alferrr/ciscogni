import type { Metadata } from "next";
import Login from "@/app/login/page";
import { getSeoSettings } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSeoSettings();
  const ogImage = seo.ogImageUrl || "/opengraph-image";

  return {
    title: seo.title,
    description: seo.description,
    keywords: seo.keywords.split(",").map((k) => k.trim()),
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: [{ url: ogImage, width: 1200, height: 630, alt: "Ciscogni" }],
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title,
      description: seo.description,
      images: [ogImage],
    },
  };
}

export default async function Home() {
  const seo = await getSeoSettings();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Ciscogni",
    url: "https://ciscogni.dcism.org",
    description: seo.description,
    applicationCategory: "EducationalApplication",
    operatingSystem: "Any",
    audience: {
      "@type": "EducationalAudience",
      educationalRole: "student",
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Login />
    </>
  );
}
