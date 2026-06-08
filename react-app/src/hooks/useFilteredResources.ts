import { useMemo } from "react";
import type { FacilityType, Resource } from "../types/resource";
import type { FilterState } from "../state/filterReducer";
import { JURISDICTION_OPTIONS } from "../data/jurisdictions";

export interface FilteredResult {
  /** Resources passing all active filters — drives the markers. */
  filtered: Resource[];
  /** Total count per facility type across ALL resources (legend badges). */
  countsByType: Map<FacilityType, number>;
  /** Fixed, ordered list of jurisdiction filter labels (all 35 + outside). */
  cities: string[];
  /** Provider count per jurisdiction label across ALL resources. */
  cityCounts: Map<string, number>;
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

  if (f.cities.size > 0 && !f.cities.has(r.jurisdiction)) return false;
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
  // Per-type totals, per-jurisdiction counts, and the specialty option list
  // depend only on the data, so compute them once and reuse across filter
  // changes. The jurisdiction list itself is FIXED (all 35 + outside), so
  // every option shows even at zero — we only tally counts here.
  const { countsByType, cityCounts, specialties } = useMemo(() => {
    const counts = new Map<FacilityType, number>();
    const cityTally = new Map<string, number>();
    const specSet = new Set<string>();
    for (const r of resources) {
      counts.set(r.type, (counts.get(r.type) ?? 0) + 1);
      cityTally.set(r.jurisdiction, (cityTally.get(r.jurisdiction) ?? 0) + 1);
      if (r.specialty) specSet.add(r.specialty);
    }
    return {
      countsByType: counts,
      cityCounts: cityTally,
      specialties: [...specSet].sort((a, b) => a.localeCompare(b)),
    };
  }, [resources]);

  const filtered = useMemo(
    () => resources.filter((r) => matches(r, filters)),
    [resources, filters],
  );

  return {
    filtered,
    countsByType,
    cities: [...JURISDICTION_OPTIONS],
    cityCounts,
    specialties,
  };
}
