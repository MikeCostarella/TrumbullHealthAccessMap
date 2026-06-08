/**
 * The authoritative set of Trumbull County, Ohio jurisdictions.
 *
 * Source: Trumbull County Archives & Records Center — the county comprises
 * 5 cities, 6 villages, and 24 townships (35 total). Mailing-city strings on
 * provider records (e.g. "Mineral Ridge", "Masury", "Youngstown") do NOT map
 * to these jurisdictions, so providers are assigned a jurisdiction by
 * point-in-polygon against the county GIS boundaries at data-convert time
 * (see scripts/assign-jurisdictions.mjs). This list drives the City filter:
 * it is the fixed universe of options, shown even when a jurisdiction has zero
 * providers.
 */

export type JurisdictionKind = "city" | "village" | "township";

export interface Jurisdiction {
  /** Bare name as it appears in GIS boundary attributes, e.g. "Howland". */
  name: string;
  kind: JurisdictionKind;
}

/** Special bucket for providers that fall outside every county boundary
 *  (e.g. Youngstown-proper records in the source data). Not a real
 *  jurisdiction; listed last and never type-labeled as city/village/township. */
export const OUTSIDE_COUNTY = "Outside Trumbull County";

export const CITIES: readonly string[] = [
  "Cortland",
  "Girard",
  "Hubbard",
  "Niles",
  "Warren",
];

export const VILLAGES: readonly string[] = [
  "Lordstown",
  "McDonald",
  "Newton Falls",
  "Orangeville",
  "West Farmington",
  "Yankee Lake",
];

export const TOWNSHIPS: readonly string[] = [
  "Bazetta",
  "Bloomfield",
  "Braceville",
  "Bristol",
  "Brookfield",
  "Champion",
  "Farmington",
  "Fowler",
  "Greene",
  "Gustavus",
  "Hartford",
  "Howland",
  "Hubbard",
  "Johnston",
  "Kinsman",
  "Liberty",
  "Mecca",
  "Mesopotamia",
  "Newton",
  "Southington",
  "Vernon",
  "Vienna",
  "Warren",
  "Weathersfield",
];

/** All real jurisdictions with their kind. */
export const JURISDICTIONS: readonly Jurisdiction[] = [
  ...CITIES.map((name) => ({ name, kind: "city" as const })),
  ...VILLAGES.map((name) => ({ name, kind: "village" as const })),
  ...TOWNSHIPS.map((name) => ({ name, kind: "township" as const })),
];

const KIND_LABEL: Record<JurisdictionKind, string> = {
  city: "City",
  village: "Village",
  township: "Township",
};

/**
 * Canonical filter value for a jurisdiction, e.g. "Warren (City)" vs.
 * "Warren (Township)". The kind suffix disambiguates the several name
 * collisions in Trumbull County (Warren, Hubbard, Newton all exist as both a
 * municipality and a township) and is what the UI displays and the data field
 * stores, so each option is unique.
 */
export function jurisdictionLabel(j: Jurisdiction): string {
  return `${j.name} (${KIND_LABEL[j.kind]})`;
}

/** The fixed, sorted list of filter labels: all 35 jurisdictions
 *  alphabetically, then the Outside-county bucket last. */
export const JURISDICTION_OPTIONS: readonly string[] = [
  ...JURISDICTIONS.map(jurisdictionLabel).sort((a, b) => a.localeCompare(b)),
  OUTSIDE_COUNTY,
];
