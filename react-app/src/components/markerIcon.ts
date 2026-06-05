import L from "leaflet";
import type { FacilityType } from "../types/resource";
import { metaFor } from "../data/facilityTypes";

/**
 * Builds the Leaflet divIcon for a facility type: a colored circular pin with
 * a white border and the type's inline SVG glyph centered inside. Mirrors the
 * original app's `.marker-pin` markup exactly.
 *
 * Icons are cached per type so panning/filtering a thousand markers doesn't
 * rebuild identical divIcons over and over.
 */
const iconCache = new Map<FacilityType, L.DivIcon>();

export function facilityIcon(type: FacilityType): L.DivIcon {
  const cached = iconCache.get(type);
  if (cached) return cached;

  const meta = metaFor(type);
  const icon = L.divIcon({
    className: "",
    html: `<div class="marker-pin" style="background:${meta.color}">${meta.icon}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    tooltipAnchor: [0, -16],
  });

  iconCache.set(type, icon);
  return icon;
}
