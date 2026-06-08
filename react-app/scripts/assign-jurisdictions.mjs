/**
 * assign-jurisdictions.mjs
 *
 * One-time / re-runnable data step. Reads public/data/trumbull.json, assigns
 * each provider a Trumbull County jurisdiction by point-in-polygon against the
 * county GIS boundaries, and writes the `jurisdiction` field back in place.
 *
 *   node scripts/assign-jurisdictions.mjs
 *
 * Why precompute instead of doing this in the browser:
 *   - 1,174 points × dozens of polygons is wasted work on every page load.
 *   - The county GIS server is occasionally down; baking the result means the
 *     filter still works offline / when GIS is unavailable.
 *   - The result is deterministic and reviewable in the committed JSON.
 *
 * Boundary source (same server the map overlays use):
 *   layer 108 (munis)     -> NAME      -> cities + villages
 *   layer 109 (townships) -> TOWNSHIP  -> townships
 * NOTE: this ArcGIS server returns query errors as HTTP 200 with an error
 * body, so we never trust response.ok alone — we require a `features` array.
 *
 * Assignment rule:
 *   1. If the point is inside a municipality polygon (108), use that
 *      city/village. Municipalities win over townships because an incorporated
 *      city is carved out of / overlaps township geometry in some datasets.
 *   2. Else if inside a township polygon (109), use that township.
 *   3. Else "Outside Trumbull County".
 * The stored value is the disambiguated label, e.g. "Warren (City)",
 * "Howland (Township)" — matching src/data/jurisdictions.ts.
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_PATH = resolve(__dirname, "../public/data/trumbull.json");

const BASE =
  "https://webgis.co.trumbull.oh.us/gisserver/rest/services/Maps/Tax_Map_WM/MapServer";
const MUNI_URL = `${BASE}/108/query?where=1%3D1&outFields=NAME&outSR=4326&f=geojson`;
const TWP_URL = `${BASE}/109/query?where=1%3D1&outFields=TOWNSHIP&outSR=4326&f=geojson`;

const OUTSIDE_COUNTY = "Outside Trumbull County";

// Canonical kind per bare name, so the GIS NAME field can be labeled
// City vs. Village correctly. (Townships come from the other layer.)
const CITY_NAMES = new Set([
  "Cortland",
  "Girard",
  "Hubbard",
  "Niles",
  "Warren",
]);
const VILLAGE_NAMES = new Set([
  "Lordstown",
  "McDonald",
  "Newton Falls",
  "Orangeville",
  "West Farmington",
  "Yankee Lake",
]);

async function fetchGeoJSON(url, label) {
  const res = await fetch(url);
  const body = await res.json();
  // ArcGIS wraps errors in a 200; the only reliable signal is `features`.
  if (!body || !Array.isArray(body.features)) {
    throw new Error(
      `${label}: no features in response (server error?). Got: ${JSON.stringify(
        body,
      ).slice(0, 200)}`,
    );
  }
  return body;
}

/** Ray-casting point-in-ring test. ring: [[lng,lat], ...]. */
function pointInRing(lng, lat, ring) {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0],
      yi = ring[i][1];
    const xj = ring[j][0],
      yj = ring[j][1];
    const intersect =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

/** Point in a single Polygon (rings[0] outer, rest holes). */
function pointInPolygon(lng, lat, rings) {
  if (!rings.length || !pointInRing(lng, lat, rings[0])) return false;
  for (let h = 1; h < rings.length; h++) {
    if (pointInRing(lng, lat, rings[h])) return false; // in a hole
  }
  return true;
}

/** Point in a GeoJSON geometry (Polygon or MultiPolygon). */
function pointInGeometry(lng, lat, geom) {
  if (!geom) return false;
  if (geom.type === "Polygon") return pointInPolygon(lng, lat, geom.coordinates);
  if (geom.type === "MultiPolygon")
    return geom.coordinates.some((poly) => pointInPolygon(lng, lat, poly));
  return false;
}

/** First feature whose geometry contains the point; returns its name via
 *  nameFn, or null. */
function locate(lng, lat, features, nameFn) {
  for (const f of features) {
    if (pointInGeometry(lng, lat, f.geometry)) {
      const n = nameFn(f.properties || {});
      if (n) return String(n).trim();
    }
  }
  return null;
}

/** Title-case a possibly all-caps GIS name, preserving normal word casing.
 *  "WARREN" -> "Warren", "WEST FARMINGTON" -> "West Farmington". A small
 *  fix-up table restores intercapitalized names the naive title-caser would
 *  flatten (e.g. "MCDONALD" -> "McDonald"). */
const NAME_FIXUPS = { Mcdonald: "McDonald" };

function titleCase(s) {
  const t = s
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
  return NAME_FIXUPS[t] ?? t;
}

/** Canonicalize a raw GIS muni/township name to its bare jurisdiction name,
 *  matching src/data/jurisdictions.ts. The county GIS NAME field embeds the
 *  classification ("WARREN CITY", "NEWTON FALLS VILLAGE"), and TOWNSHIP names
 *  may arrive all-caps — strip the trailing CITY/VILLAGE/TOWNSHIP word and
 *  title-case the rest so "WARREN CITY" -> "Warren", "NEWTON FALLS VILLAGE" ->
 *  "Newton Falls". */
function bareName(raw) {
  return titleCase(
    String(raw).replace(/\s+(CITY|VILLAGE|TOWNSHIP|TWP)\.?$/i, ""),
  );
}

function labelMuni(name) {
  const bare = bareName(name);
  if (VILLAGE_NAMES.has(bare)) return `${bare} (Village)`;
  // Everything else from the muni layer is an incorporated city.
  return `${bare} (City)`;
}

async function main() {
  console.log("Fetching county boundaries…");
  const [muni, twp] = await Promise.all([
    fetchGeoJSON(MUNI_URL, "munis (108)"),
    fetchGeoJSON(TWP_URL, "townships (109)"),
  ]);
  console.log(
    `  munis: ${muni.features.length} features, townships: ${twp.features.length} features`,
  );

  const raw = JSON.parse(readFileSync(DATA_PATH, "utf8"));
  const records = Array.isArray(raw) ? raw : raw.resources || raw.data;
  if (!Array.isArray(records)) throw new Error("Could not find records array in trumbull.json");

  const tally = new Map();
  let outside = 0;
  let badCoords = 0;

  for (const r of records) {
    const lng = Number(r.lng);
    const lat = Number(r.lat);
    let jurisdiction;
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
      jurisdiction = OUTSIDE_COUNTY;
      badCoords++;
    } else {
      const muniName = locate(lng, lat, muni.features, (p) => p.NAME);
      if (muniName) {
        jurisdiction = labelMuni(muniName);
      } else {
        const twpName = locate(lng, lat, twp.features, (p) => p.TOWNSHIP);
        jurisdiction = twpName ? `${bareName(twpName)} (Township)` : OUTSIDE_COUNTY;
      }
    }
    if (jurisdiction === OUTSIDE_COUNTY) outside++;
    r.jurisdiction = jurisdiction;
    tally.set(jurisdiction, (tally.get(jurisdiction) ?? 0) + 1);
  }

  writeFileSync(DATA_PATH, JSON.stringify(raw, null, 2) + "\n", "utf8");

  console.log("\nAssigned jurisdictions (provider counts):");
  for (const [j, n] of [...tally.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${String(n).padStart(4)}  ${j}`);
  }
  console.log(
    `\nTotal: ${records.length}  |  Outside county: ${outside}  |  Bad coords: ${badCoords}`,
  );
  console.log(`Wrote ${DATA_PATH}`);
}

main().catch((err) => {
  console.error("\nFAILED:", err.message);
  console.error(
    "If this is a network error, the county GIS server may be unreachable. " +
      "Re-run when it's back; the existing jurisdiction values are left untouched on failure.",
  );
  process.exit(1);
});
