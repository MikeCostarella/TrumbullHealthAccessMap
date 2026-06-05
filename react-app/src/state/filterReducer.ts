import type { FacilityType, ResourceServices } from "../types/resource";

/**
 * All filter state for the map, plus a reducer to update it. Kept in one place
 * so the legend, search box, and filter panel all dispatch against the same
 * source of truth, and the filtered resource list is derived from it.
 */
export interface FilterState {
  /** Facility types currently shown (legend toggles). */
  enabledTypes: Set<FacilityType>;
  /** Free-text search across name/type/city/specialty/address/zip. */
  search: string;
  /** Service flags that must ALL be present (AND logic). */
  services: Set<keyof ResourceServices>;
  /** Cities to include; empty means all (OR logic within the group). */
  cities: Set<string>;
  /** Specialties to include; empty means all (OR logic within the group). */
  specialties: Set<string>;
}

export type FilterAction =
  | { type: "toggleFacilityType"; facilityType: FacilityType }
  | { type: "showAllTypes"; all: FacilityType[] }
  | { type: "hideAllTypes" }
  | { type: "setSearch"; value: string }
  | { type: "toggleService"; service: keyof ResourceServices }
  | { type: "toggleCity"; city: string }
  | { type: "toggleSpecialty"; specialty: string }
  | { type: "clearFilters" };

/** Initial state: every type enabled, nothing else filtered. */
export function initFilterState(allTypes: FacilityType[]): FilterState {
  return {
    enabledTypes: new Set(allTypes),
    search: "",
    services: new Set(),
    cities: new Set(),
    specialties: new Set(),
  };
}

/** Toggle membership of a value in a Set immutably. */
function toggleInSet<T>(set: Set<T>, value: T): Set<T> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

export function filterReducer(
  state: FilterState,
  action: FilterAction,
): FilterState {
  switch (action.type) {
    case "toggleFacilityType":
      return {
        ...state,
        enabledTypes: toggleInSet(state.enabledTypes, action.facilityType),
      };
    case "showAllTypes":
      return { ...state, enabledTypes: new Set(action.all) };
    case "hideAllTypes":
      return { ...state, enabledTypes: new Set() };
    case "setSearch":
      return { ...state, search: action.value };
    case "toggleService":
      return { ...state, services: toggleInSet(state.services, action.service) };
    case "toggleCity":
      return { ...state, cities: toggleInSet(state.cities, action.city) };
    case "toggleSpecialty":
      return {
        ...state,
        specialties: toggleInSet(state.specialties, action.specialty),
      };
    case "clearFilters":
      return {
        ...state,
        search: "",
        services: new Set(),
        cities: new Set(),
        specialties: new Set(),
      };
  }
}

/** Count of active filters beyond type toggles (for the Filters button badge). */
export function activeFilterCount(state: FilterState): number {
  return (
    (state.search ? 1 : 0) +
    state.services.size +
    state.cities.size +
    state.specialties.size
  );
}
