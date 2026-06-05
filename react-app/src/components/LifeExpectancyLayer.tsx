import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import type { GeoJsonObject } from "geojson";
import {
  LE_DATA,
  leColor,
  TRACT_GEO_URL_GEN,
  TRACT_GEO_URL_PRECISE,
} from "../data/lifeExpectancyData";

interface LifeExpectancyLayerProps {
  visible: boolean;
}

/**
 * Life-expectancy choropleth, drawn on census tracts. Independent of the
 * poverty overlay — its own pane and its own data join (by GEOID, an exact
 * match, simpler than poverty's name lookup).
 *
 * Tract polygons come from TIGERweb at runtime. We try the generalized
 * (lighter) endpoint first and fall back to the precise one. Tracts with no
 * matching LE record render gray; tracts with no polygon simply don't appear.
 *
 * Pane 'lifeExpectancy' sits at z-index 342 — just above the poverty fill
 * (340) so that, with both overlays on, LE reads on top, but still below the
 * boundary outlines (350/360) and markers (600).
 */
export function LifeExpectancyLayer({ visible }: LifeExpectancyLayerProps) {
  const map = useMap();
  const paneRef = useRef<HTMLElement | null>(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    const pane = map.createPane("lifeExpectancy");
    pane.style.zIndex = "342";
    paneRef.current = pane;

    const render = (geo: GeoJsonObject) => {
      L.geoJSON(geo, {
        pane: "lifeExpectancy",
        style: (feature) => {
          const geoid = feature?.properties?.GEOID;
          const rec = geoid ? LE_DATA[geoid] : undefined;
          return {
            pane: "lifeExpectancy",
            color: "#8A8B92",
            weight: 0.6,
            opacity: 0.45,
            fillColor: leColor(rec ? rec.le : null),
            fillOpacity: 0.6,
          };
        },
        onEachFeature: (feature, layer) => {
          const geoid = feature?.properties?.GEOID;
          const rec = geoid ? LE_DATA[geoid] : undefined;
          if (!rec) return;
          layer.bindTooltip(
            `<strong>Census Tract ${rec.tract}</strong><br>` +
              `Life expectancy: <strong>${rec.le.toFixed(1)} yrs</strong><br>` +
              `<span style="opacity:.8">95% CI: ${rec.ci}</span>`,
            { sticky: true, className: "boundary-tooltip", direction: "top" },
          );
          // Don't let tract fills intercept marker clicks.
          layer.on("add", () => {
            const path = (layer as L.Path & { _path?: SVGElement })._path;
            if (path) path.style.pointerEvents = "none";
          });
        },
      }).addTo(map);
    };

    // Try generalized geometry, fall back to precise.
    fetch(TRACT_GEO_URL_GEN)
      .then((r) =>
        r.ok ? r.json() : Promise.reject(new Error("HTTP " + r.status)),
      )
      .then((geo: GeoJsonObject & { features?: unknown[] }) => {
        if (!geo?.features?.length) throw new Error("no features");
        render(geo);
      })
      .catch(() =>
        fetch(TRACT_GEO_URL_PRECISE)
          .then((r) => (r.ok ? r.json() : null))
          .then((geo: GeoJsonObject | null) => {
            if (geo) render(geo);
          })
          .catch(() => {
            /* silent — overlay is nice-to-have */
          }),
      );
  }, [map]);

  useEffect(() => {
    const pane = paneRef.current;
    if (pane) pane.style.display = visible ? "" : "none";
  }, [visible, map]);

  return null;
}
