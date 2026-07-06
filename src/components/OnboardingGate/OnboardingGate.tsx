"use client";
import { useEffect } from "react";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";

const EXEMPT_PREFIXES = ["/login", "/register", "/onboarding", "/admin"];

// Forces users with no `year` set (i.e. first login) to the onboarding
// screen before they can reach any other protected page.
const OnboardingGate = () => {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (
      !pathname ||
      pathname === "/" ||
      EXEMPT_PREFIXES.some((p) => pathname.startsWith(p))
    )
      return;

    let cancelled = false;
    const check = async () => {
      try {
        const { data } = await axios.get("/api/user/me");
        if (!cancelled && data.year === "") {
          router.replace("/onboarding");
        }
      } catch {
        // AuthInterceptor handles unauthenticated redirects.
      }
    };
    check();

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  return null;
};

export default OnboardingGate;
