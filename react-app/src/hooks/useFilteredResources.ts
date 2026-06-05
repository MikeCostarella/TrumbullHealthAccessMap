import { useMemo } from "react";
import type { FacilityType, Resource } from "../types/resource";
import type { FilterState } from "../state/filterReducer";

export interface FilteredResult {
  /** Resources passing all active filters — drives the markers. */
  filtered: Resource[];
  /** Total count per facility type across ALL resources (legend badges). */
  countsByType: Map<FacilityType, number>;
  /** Sorted unique cities present in the data (for the city filter group). */
  cities: string[];
  /** Sorted unique specialties present in the data (specialty filter group). */
  specialties: string[];
}

/** True if a resource passes every active filter. Mirrors the original
 *  matchesResource: type ∈ enabled, search substring across several fields,
 *  services AND, cities/specialties OR-within-group. */
function matches(r: Resource, f: FilterState): boolean {
  if (!f.enabledTypes.has(r.type)) return false;

  if (f.search) {
    const haystack = [r.name, r.type, r.city, r.specialty, r.addr, r.zip]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();
    if (!haystack.includes(f.search.toLowerCase())) return false;
  }

  for (const key of f.services) {
    if (!r.services[key]) return false;
  }

  if (f.cities.size > 0 && !f.cities.has(r.city)) return false;
  if (f.specialties.size > 0 && r.specialty && !f.specialties.has(r.specialty)) {
    return false;
  }
  if (f.specialties.size > 0 && !r.specialty) return false;

  return true;
}

export function useFilteredResources(
  resources: Resource[],
  filters: FilterState,
): FilteredResult {
  // Per-type totals and the city/specialty option lists depend only on the
  // data, so compute them once and reuse across filter changes.
  const { countsByType, cities, specialties } = useMemo(() => {
    const counts = new Map<FacilityType, number>();
    const citySet = new Set<string>();
    const specSet = new Set<string>();
    for (const r of resources) {
      counts.set(r.type, (counts.get(r.type) ?? 0) + 1);
      if (r.city) citySet.add(r.city);
      if (r.specialty) specSet.add(r.specialty);
    }
    return {
      countsByType: counts,
      cities: [...citySet].sort((a, b) => a.localeCompare(b)),
      specialties: [...specSet].sort((a, b) => a.localeCompare(b)),
    };
  }, [resources]);

  const filtered = useMemo(
    () => resources.filter((r) => matches(r, filters)),
    [resources, filters],
  );

  return { filtered, countsByType, cities, specialties };
}
