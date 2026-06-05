import { useEffect, useState } from "react";

/** Mobile breakpoint, matching the 720px used across the component CSS. */
const MOBILE_QUERY = "(max-width: 720px)";

/**
 * Tracks whether the viewport is at or below the mobile breakpoint.
 * Updates on resize/orientation change via matchMedia.
 */
export function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(MOBILE_QUERY).matches,
  );

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", onChange);
    // Sync once in case it changed before listener attached.
    setIsMobile(mq.matches);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return isMobile;
}
