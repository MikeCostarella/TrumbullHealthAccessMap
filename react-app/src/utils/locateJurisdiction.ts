import {
  BOUNDARY_BASE,
  BOUNDARY_QUERY_MUNI,
  BOUNDARY_QUERY_TOWNSHIP,
} from "../data/povertyData";
import { OUTSIDE_COUNTY, VILLAGES } from "../data/jurisdictions";

/**
 * Runtime "which jurisdiction is this point in?" lookup, used for the
 * user's live GPS position (which, unlike providers, can't be assigned at
 * data-convert time). Mirrors scripts/assign-jurisdictions.mjs: municipality
 * layer wins over township, GIS names are normalized to the canonical
 * labels ("WARREN CITY" -> "Warren (City)", "MCDONALD VILLAGE" ->
 * "McDonald (Village)").
 *
 * Boundaries are fetched lazily on first call and cached for the session,
 * so map loads pay nothing unless the user opens the location dialog. On
 * fetch failure (county GIS down) we resolve to null and the caller shows
 * the dialog without a jurisdiction line rather than erroring.
 */

type Ring = [number, number][];
interface Geometry {
  type: "Polygon" | "MultiPolygon";
  coordinates: Ring[] | Ring[][];
}
interface Feature {
  geometry: Geometry | null;
  properties: Record<string, unknown> | null;
}

function pointInRing(lng: number, lat: number, ring: Ring): boolean {
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

function pointInPolygon(lng: number, lat: number, rings: Ring[]): boolean {
  if (!rings.length || !pointInRing(lng, lat, rings[0])) return false;
  for (let h = 1; h < rings.length; h++) {
    if (pointInRing(lng, lat, rings[h])) return false; // inside a hole
  }
  return true;
}

function pointInGeometry(lng: number, lat: number, g: Geometry | null): boolean {
  if (!g) return false;
  if (g.type === "Polygon") return pointInPolygon(lng, lat, g.coordinates as Ring[]);
  if (g.type === "MultiPolygon")
    return (g.coordinates as Ring[][]).some((p) => pointInPolygon(lng, lat, p));
  return false;
}

/** "WARREN CITY" -> "Warren"; "MCDONALD VILLAGE" -> "McDonald". */
const NAME_FIXUPS: Record<string, string> = { Mcdonald: "McDonald" };
function bareName(raw: unknown): string {
  const stripped = String(raw ?? "").replace(
    /\s+(CITY|VILLAGE|TOWNSHIP|TWP)\.?$/i,
    "",
  );
  const titled = stripped
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
    .trim();
  return NAME_FIXUPS[titled] ?? titled;
}

const VILLAGE_SET = new Set(VILLAGES);

let boundaryPromise: Promise<{ muni: Feature[]; twp: Feature[] }> | null = null;

async function fetchLayer(url: string): Promise<Feature[]> {
  const res = await fetch(url);
  const body = await res.json();
  // This ArcGIS server returns errors as HTTP 200 with an error body; the
  // only reliable success signal is a features array.
  if (!body || !Array.isArray(body.features)) {
    throw new Error("boundary fetch returned no features");
  }
  return body.features as Feature[];
}

function loadBoundaries() {
  if (!boundaryPromise) {
    boundaryPromise = Promise.all([
      fetchLayer(`${BOUNDARY_BASE}/108${BOUNDARY_QUERY_MUNI}`),
      fetchLayer(`${BOUNDARY_BASE}/109${BOUNDARY_QUERY_TOWNSHIP}`),
    ]).then(([muni, twp]) => ({ muni, twp }));
    // Allow a retry on a later click if the first fetch failed.
    boundaryPromise.catch(() => {
      boundaryPromise = null;
    });
  }
  return boundaryPromise;
}

/**
 * Resolve the canonical jurisdiction label for a point, or
 * OUTSIDE_COUNTY when it's not inside any Trumbull boundary.
 * Returns null when the boundaries can't be fetched.
 */
export async function locateJurisdiction(
  lat: number,
  lng: number,
): Promise<string | null> {
  try {
    const { muni, twp } = await loadBoundaries();
    for (const f of muni) {
      if (pointInGeometry(lng, lat, f.geometry)) {
        const bare = bareName(f.properties?.NAME);
        return VILLAGE_SET.has(bare) ? `${bare} (Village)` : `${bare} (City)`;
      }
    }
    for (const f of twp) {
      if (pointInGeometry(lng, lat, f.geometry)) {
        return `${bareName(f.properties?.TOWNSHIP)} (Township)`;
      }
    }
    return OUTSIDE_COUNTY;
  } catch {
    return null;
  }
}
