"use client";
import { useEffect } from "react";

// Re-runs `callback` when the tab regains focus, and also when the page is
// restored from the browser back-forward cache (e.g. clicking Chrome's back
// button) — bfcache restoration does not remount the component or re-fire
// window "focus", so without this, pages can be left showing stale/blank
// data after a back navigation.
export const useRefetchOnShow = (callback: () => void) => {
  useEffect(() => {
    const handleFocus = () => callback();
    const handlePageShow = (e: PageTransitionEvent) => {
      if (e.persisted) callback();
    };
    window.addEventListener("focus", handleFocus);
    window.addEventListener("pageshow", handlePageShow);
    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("pageshow", handlePageShow);
    };
  }, [callback]);
};
