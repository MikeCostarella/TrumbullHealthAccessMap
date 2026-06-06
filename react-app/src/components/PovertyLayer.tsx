import { useEffect, useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import type { GeoJsonObject } from "geojson";
import {
  BOUNDARY_BASE,
  BOUNDARY_QUERY,
  povertyColor,
  povertyLookup,
} from "../data/povertyData";

interface PovertyLayerProps {
  visible: boolean;
}

/**
 * Poverty choropleth overlay. Imperative by necessity: the polygons come from
 * runtime GeoJSON fetches against the Trumbull County GIS server, which don't
 * map cleanly to declarative <GeoJSON> children. We manage Leaflet panes and
 * layers directly through the map instance from context.
 *
 * Panes (z-index): poverty fill (340) < township outlines (350) <
 * muni outlines (360), all below markers (600). The boundary outline panes
 * stay visible at all times; the poverty toggle only shows/hides the fill pane.
 *
 * If a fetch fails (server down, CORS), the overlay simply doesn't appear —
 * the rest of the map is unaffected.
 */
export function PovertyLayer({ visible }: PovertyLayerProps) {
  const map = useMap();
  const fillPaneRef = useRef<HTMLElement | null>(null);
  const loadedRef = useRef(false);

  // One-time setup: create panes and fetch both boundary layers.
  useEffect(() => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    const fillPane = map.createPane("poverty");
    fillPane.style.zIndex = "340";
    fillPaneRef.current = fillPane;

    const townshipPane = map.createPane("townships");
    townshipPane.style.zIndex = "350";
    const muniPane = map.createPane("munis");
    muniPane.style.zIndex = "360";

    const buildFill = (geo: GeoJsonObject, fillOpacity: number) =>
      L.geoJSON(geo, {
        pane: "poverty",
        style: (feature) => {
          const rec = povertyLookup(feature?.properties?.NAME);
          return {
            color: "transparent",
            weight: 0,
            fillColor: povertyColor(rec ? rec.rate : null),
            fillOpacity,
          };
        },
        onEachFeature: (feature, layer) => {
          const rec = povertyLookup(feature?.properties?.NAME);
          if (rec) {
            const pct = (rec.rate * 100).toFixed(1) + "%";
            const remainder = rec.remainder
              ? ' <em style="opacity:.7">(remainder)</em>'
              : "";
            layer.bindTooltip(
              `<strong>${rec.label}</strong>${remainder}<br>` +
                `Poverty rate: <strong>${pct}</strong> (${rec.tier})<br>` +
                `<span style="opacity:.8">${rec.note}</span>`,
              { sticky: true, className: "boundary-tooltip", direction: "top" },
            );
          }
        },
      }).addTo(map);

    const buildOutline = (
      geo: GeoJsonObject,
      pane: string,
      style: L.PathOptions,
      labelSuffix: string,
    ) =>
      L.geoJSON(geo, {
        pane,
        style,
        onEachFeature: (feature, layer) => {
          const name = feature?.properties?.NAME;
          if (name) {
            const pretty = String(name)
              .replace(/\s+TOWNSHIP\s*$/i, "")
              .replace(/\s+/g, " ")
              .trim();
            layer.bindTooltip(`${pretty}${labelSuffix}`, {
              sticky: true,
              className: "boundary-tooltip",
              direction: "center",
            });
          }
          // Outlines must not intercept marker clicks.
          layer.on("add", () => {
            const path = (layer as L.Path & { _path?: SVGElement })._path;
            if (path) path.style.pointerEvents = "none";
          });
        },
      }).addTo(map);

    // Townships (layer 109): fill first, then dashed outline.
    fetch(`${BOUNDARY_BASE}/109${BOUNDARY_QUERY}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((geo: GeoJsonObject | null) => {
        if (!geo) return;
        buildFill(geo, 0.65);
        buildOutline(
          geo,
          "townships",
          {
            color: "#3A342B",
            weight: 1.4,
            opacity: 0.7,
            fillOpacity: 0,
            dashArray: "5,5",
          },
          " Township",
        );
      })
      .catch(() => {
        /* silent — overlay is nice-to-have */
      });

    // Munis (layer 108): fill painted over townships, then solid navy outline.
    fetch(`${BOUNDARY_BASE}/108${BOUNDARY_QUERY}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((geo: GeoJsonObject | null) => {
        if (!geo) return;
        buildFill(geo, 0.7);
        buildOutline(
          geo,
          "munis",
          {
            color: "#15294A",
            weight: 2.2,
            opacity: 0.95,
            fillColor: "#1F3A5F",
            fillOpacity: 0.025,
          },
          "",
        );
      })
      .catch(() => {
        /* silent */
      });
  }, [map]);

  // Reflect the `visible` prop by toggling only the poverty fill pane. The
  // municipal/township outline panes stay visible at all times so the
  // boundaries render on the base map regardless of the poverty overlay
  // (matching the original app). Their hover tooltips remain active too.
  useEffect(() => {
    const fill = fillPaneRef.current;
    if (fill) fill.style.display = visible ? "" : "none";
  }, [visible, map]);

  return null;
}
