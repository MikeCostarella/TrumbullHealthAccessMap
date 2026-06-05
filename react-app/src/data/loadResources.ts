import type { FacilityType, RawResource, Resource } from "../types/resource";
import { TYPE_META } from "./facilityTypes";

/**
 * The single seam between the app and its data source.
 *
 * Today this fetches a static JSON file from /public/data. To move to a real
 * API later, only this function changes: swap the fetch URL (or its shape)
 * and keep returning `Resource[]`. No component or hook needs to change.
 */

/** Base path that respects Vite's configured `base` (for GitHub Pages). */
const DATA_BASE = `${import.meta.env.BASE_URL}data`;

const KNOWN_TYPES = new Set<string>(Object.keys(TYPE_META));

/** Coerce an unknown `type` string to a FacilityType, defaulting to "Other". */
function normalizeType(type: string): FacilityType {
  return (KNOWN_TYPES.has(type) ? type : "Other") as FacilityType;
}

/** A record is mappable only if it has real numeric coordinates. */
function isMappable(r: RawResource): boolean {
  return typeof r.lat === "number" && typeof r.lng === "number";
}

/**
 * Load resources for a jurisdiction. `jurisdiction` is the JSON file stem,
 * e.g. "trumbull" -> /data/trumbull.json. This is what makes the app
 * reusable across counties: point it at a different file.
 */
export async function loadResources(
  jurisdiction = "trumbull",
  signal?: AbortSignal,
): Promise<Resource[]> {
  const res = await fetch(`${DATA_BASE}/${jurisdiction}.json`, { signal });
  if (!res.ok) {
    throw new Error(
      `Failed to load resources for "${jurisdiction}" (HTTP ${res.status})`,
    );
  }

  const raw: unknown = await res.json();
  if (!Array.isArray(raw)) {
    throw new Error("Resource data is not an array");
  }

  // Normalize at the boundary: unknown types -> "Other", drop unmappable
  // records so downstream code can assume valid coordinates everywhere.
  return (raw as RawResource[]).filter(isMappable).map((r) => ({
    ...r,
    type: normalizeType(r.type),
  }));
}
