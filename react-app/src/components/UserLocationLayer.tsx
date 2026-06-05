import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

/**
 * "You are here" geolocation marker, ported from the original app
 * (Latest/Index.html ~line 2689).
 *
 * On mount we make a single browser-geolocation request. If the user is
 * inside the regional bbox (Trumbull County plus a ~16-mile buffer south
 * into the Youngstown/Boardman area) we drop a pulsing cyan dot with a
 * permanent "You are here" tooltip and fly to it. If they deny, the API
 * is missing, the request times out, or they're far away (Cleveland,
 * Pittsburgh), we silently keep the default Warren-centered view — no
 * intrusive error messages.
 *
 * Uses the useMap escape hatch (same pattern as the choropleth layers)
 * because the marker, tooltip, flyTo, and the one-shot geolocation request
 * are all imperative Leaflet/browser side effects rather than declarative
 * react-leaflet children.
 */

// Region bbox: Trumbull County (~41.18-41.46 N, -80.97 to -80.50 W) extended
// ~0.23° south to capture Youngstown/Boardman residents, plus slop elsewhere.
const LOCATE_BBOX = {
  minLat: 40.95,
  maxLat: 41.5,
  minLng: -81.05,
  maxLng: -80.45,
};

function isInRegion(lat: number, lng: number): boolean {
  return (
    lat >= LOCATE_BBOX.minLat &&
    lat <= LOCATE_BBOX.maxLat &&
    lng >= LOCATE_BBOX.minLng &&
    lng <= LOCATE_BBOX.maxLng
  );
}

export function UserLocationLayer() {
  const map = useMap();
  const requestedRef = useRef(false);

  useEffect(() => {
    // One-shot: never re-request on re-render.
    if (requestedRef.current) return;
    requestedRef.current = true;

    if (!("geolocation" in navigator)) return; // no API available

    let userMarker: L.Marker | null = null;

    // Kick off after the initial paint so the permission prompt doesn't
    // compete with the first map render.
    const timer = window.setTimeout(() => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          // Far away (e.g. Akron, Pittsburgh): keep county overview.
          if (!isInRegion(lat, lng)) return;

          // Pulsing cyan dot. CSS (.user-location-marker, in global.css)
          // handles the dot + two staggered pulse rings.
          const userIcon = L.divIcon({
            className: "",
            html:
              '<div class="user-location-marker">' +
              '<div class="ulm-pulse"></div>' +
              '<div class="ulm-dot"></div>' +
              "</div>",
            iconSize: [28, 28],
            iconAnchor: [14, 14],
            tooltipAnchor: [0, -12],
          });

          userMarker = L.marker([lat, lng], {
            icon: userIcon,
            zIndexOffset: 1000, // float above facility markers
            keyboard: false,
            interactive: true,
            alt: "Your approximate location",
          }).bindTooltip("You are here", {
            className: "user-location-tooltip",
            direction: "top",
            offset: [0, -4],
            permanent: true, // always visible — don't hide on mouseout
          });
          userMarker.addTo(map);

          // Inside Trumbull proper → neighborhood zoom (13); in the southern
          // buffer (Youngstown/Boardman) → wider zoom (11) that keeps the
          // county's facilities visible to the north. Loose southern bound
          // (41.15) so Girard / Liberty Twp. residents aren't pushed wide.
          const inTrumbullProper =
            lat >= 41.15 && lat <= 41.48 && lng >= -81.0 && lng <= -80.48;
          const targetZoom = inTrumbullProper ? 13 : 11;
          map.flyTo([lat, lng], targetZoom, {
            duration: 1.2,
            easeLinearity: 0.25,
          });
        },
        () => {
          // PERMISSION_DENIED / POSITION_UNAVAILABLE / TIMEOUT — in every
          // case keep the default view, no error message.
        },
        {
          enableHighAccuracy: false, // desktop wifi-positioning is fine
          timeout: 8000,
          maximumAge: 5 * 60 * 1000, // cached position up to 5 min is OK
        },
      );
    }, 400);

    return () => {
      window.clearTimeout(timer);
      if (userMarker) {
        userMarker.remove();
        userMarker = null;
      }
    };
  }, [map]);

  return null;
}
