import Login from "@/app/login/page";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Ciscogni",
  url: "https://ciscogni.dcism.org",
  description:
    "Gamified programming practice platform for USC (University of San Carlos) students taking Programming 1 and Programming 2, with XP, streaks, and a class leaderboard.",
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

export default function Home() {
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
