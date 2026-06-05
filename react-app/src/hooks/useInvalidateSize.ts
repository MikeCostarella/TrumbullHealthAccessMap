import { useEffect } from "react";
import { useMap } from "react-leaflet";

/**
 * Leaflet renders into a container whose size it measures once. If the
 * container's size settles *after* the map initializes — common on mobile
 * (iOS Safari URL-bar transitions) and in grid/flex layouts that resolve late
 * — the map renders into stale dimensions, leaving gray gutters or a clipped
 * map until something forces a recalculation.
 *
 * This calls invalidateSize() shortly after mount and on every window resize /
 * orientation change to keep Leaflet's idea of its size in sync with reality.
 * Ported from the original app's setTimeout(invalidateSize, 350) workaround.
 */
export function useInvalidateSize(): void {
  const map = useMap();

  useEffect(() => {
    // Defer once so the initial layout has resolved before measuring.
    const initial = window.setTimeout(() => {
      map.invalidateSize({ animate: false });
    }, 350);

    const onResize = () => map.invalidateSize({ animate: false });
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      window.clearTimeout(initial);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [map]);
}
