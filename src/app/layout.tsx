import type { Metadata } from "next";
import { DM_Sans, Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { ToastProvider } from "@/context/ToastContext";
import AuthInterceptor from "@/components/AuthInterceptor/AuthInterceptor";
import OnboardingGate from "@/components/OnboardingGate/OnboardingGate";
import PageTracker from "@/components/PageTracker/PageTracker";
const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const SITE_URL = "https://ciscogni.dcism.org";
const SITE_NAME = "Ciscogni";
// Fallback copy for every route; the root page ("/") overrides title/
// description/OG image with the admin-editable values from the DB
// (see src/app/page.tsx) — kept out of this layout so that DB lookups
// don't run on every single page in the app.
const SITE_DESCRIPTION =
  "Ciscogni is a gamified practice platform for USC (University of San Carlos) students taking Programming 1 and Programming 2. Drill output prediction, bug detection, and logic tracing questions with XP, streaks, and a class leaderboard.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ciscogni — Programming Practice for USC Students",
    template: "%s | Ciscogni",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Ciscogni",
    "USC",
    "University of San Carlos",
    "Programming 1",
    "Programming 2",
    "C programming practice",
    "programming quiz",
  ],
  authors: [{ name: "Ciscogni" }],
  applicationName: SITE_NAME,
  category: "education",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/assets/images/logo.png",
  },
  manifest: "/site.webmanifest",
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Ciscogni — Programming Practice for USC Students",
    description: SITE_DESCRIPTION,
    locale: "en_US",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: SITE_NAME }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ciscogni — Programming Practice for USC Students",
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${inter.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else if (theme === 'system' || !theme) {
                    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                      document.documentElement.classList.add('dark');
                    }
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          <ToastProvider>
            <AuthInterceptor />
            <OnboardingGate />
            <PageTracker />
            {children}
          </ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
