"use client";
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import axios from "axios";

// Fires a beacon on every route change so the admin dashboard can chart
// real traffic instead of a placeholder metric.
const PageTracker = () => {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    axios.post("/api/track", { path: pathname }).catch(() => {});
  }, [pathname]);

  return null;
};

export default PageTracker;
