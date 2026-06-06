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
  // Permanent boundary name labels, tracked so a zoom handler can show/hide
  // them by tier (munis at zoom >= 10, townships at zoom >= 11).
  const labelMarkersRef = useRef<L.Marker[]>([]);

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
    // Permanent place-name labels sit above the outlines but still below the
    // facility markers (600), so a label never hides a clickable marker.
    const labelPane = map.createPane("boundaryLabels");
    labelPane.style.zIndex = "370";
    labelPane.style.pointerEvents = "none";

    // Permanent name label centered on a boundary feature, ported from the
    // original app. Uses the bounds-center (fast, good enough for these mostly
    // compact shapes) and a non-interactive divIcon so it never blocks clicks.
    // `kind` selects the CSS styling: munis are uppercase navy, townships are
    // italic gray and subordinate.
    const addBoundaryLabel = (
      layer: L.Layer,
      displayName: string,
      kind: "township" | "muni",
    ) => {
      let center: L.LatLng;
      try {
        center = (layer as L.Polygon).getBounds().getCenter();
      } catch {
        return; // skip features without geometry
      }
      const labelClass =
        kind === "township"
          ? "boundary-label township-label"
          : "boundary-label muni-label";
      const labelMarker = L.marker(center, {
        pane: "boundaryLabels",
        interactive: false,
        keyboard: false,
        icon: L.divIcon({
          className: "",
          html: `<div class="${labelClass}">${displayName}</div>`,
          iconSize: undefined, // let CSS size the label
          iconAnchor: [0, 0],
        }),
      });
      labelMarkersRef.current.push(labelMarker);
      labelMarker.addTo(map);
    };

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
      kind: "township" | "muni",
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
            const suffix = kind === "township" ? " Township" : "";
            // Permanent place-name label (replaces the old hover tooltip so the
            // names are always visible, matching the original app).
            addBoundaryLabel(layer, `${pretty}${suffix}`, kind);
          }
          // Outlines must not intercept marker clicks.
          layer.on("add", () => {
            const path = (layer as L.Path & { _path?: SVGElement })._path;
            if (path) path.style.pointerEvents = "none";
          });
        },
      }).addTo(map);

    // Show labels only when zoomed in enough to be readable: munis at zoom
    // >= 10 (residents orient by city/village name), townships at >= 11
    // (subordinate, would clutter the county overview). Matches the original.
    const updateLabelVisibility = () => {
      const z = map.getZoom();
      labelMarkersRef.current.forEach((m) => {
        const el = m.getElement();
        if (!el) return;
        const labelEl = el.querySelector<HTMLElement>(".boundary-label");
        if (!labelEl) return;
        const isTownship = labelEl.classList.contains("township-label");
        const threshold = isTownship ? 11 : 10;
        labelEl.style.display = z >= threshold ? "" : "none";
      });
    };
    map.on("zoomend", updateLabelVisibility);

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
          "township",
        );
        updateLabelVisibility();
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
          "muni",
        );
        updateLabelVisibility();
      })
      .catch(() => {
        /* silent */
      });

    return () => {
      map.off("zoomend", updateLabelVisibility);
    };
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
