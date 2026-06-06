/**
 * Poverty-by-area data for the choropleth overlay. Source: ACS 5-year
 * estimates. Township figures are remainder-of-township where a
 * city/village/CDP is carved out. Lifted verbatim from the original app.
 *
 * Keys are UPPERCASE jurisdiction names matching (after light normalization)
 * the NAME property on the county GIS boundary features.
 */

export type PovertyTier =
  | ">25%"
  | "20-25%"
  | "16-20%"
  | "12-16%"
  | "8-12%"
  | "<8%";

export interface PovertyRecord {
  /** Poverty rate as a decimal (0.319 = 31.9%). */
  rate: number;
  tier: PovertyTier;
  /** Display name, e.g. "Warren (city)". */
  label: string;
  note: string;
  /** True when this is the remainder of a township after a carve-out. */
  remainder?: boolean;
}

export const POVERTY_DATA: Record<string, PovertyRecord> = {
  // Cities
  WARREN: { rate: 0.319, tier: ">25%", label: "Warren (city)", note: "County seat; highest poverty rate in the county." },
  NILES: { rate: 0.162, tier: "16-20%", label: "Niles (city)", note: "Moderately elevated; Niles City Schools." },
  GIRARD: { rate: 0.199, tier: "16-20%", label: "Girard (city)", note: "Carved out of Liberty Twp.; among the highest-poverty cities in the county." },
  "NEWTON FALLS": { rate: 0.2, tier: "20-25%", label: "Newton Falls (city)", note: "Newton Falls Schools — lower-income district." },
  CORTLAND: { rate: 0.09, tier: "8-12%", label: "Cortland (city)", note: "Higher-income; Lakeview Schools." },
  HUBBARD: { rate: 0.069, tier: "<8%", label: "Hubbard (city)", note: "Lower poverty than the surrounding township." },
  // Villages
  LORDSTOWN: { rate: 0.081, tier: "8-12%", label: "Lordstown (village)", note: "Industrial — GM / Foxconn / Ultium." },
  MCDONALD: { rate: 0.038, tier: "<8%", label: "McDonald (village)", note: "Lowest poverty rate in the county; former U.S. Steel company town." },
  "WEST FARMINGTON": { rate: 0.167, tier: "16-20%", label: "West Farmington (village)", note: "Inside Farmington Twp.; wide ±14% MOE (small pop)." },
  ORANGEVILLE: { rate: 0.044, tier: "<8%", label: "Orangeville (village)", note: "Tiny village on PA border; very wide MOE." },
  // Townships — remainder rates where a city/village has been carved out
  LIBERTY: { rate: 0.245, tier: "20-25%", label: "Liberty Twp.", note: "Remainder excluding Girard city.", remainder: true },
  BROOKFIELD: { rate: 0.165, tier: "16-20%", label: "Brookfield Twp.", note: "Brookfield Local Schools; includes Masury CDP." },
  WEATHERSFIELD: { rate: 0.12, tier: "12-16%", label: "Weathersfield Twp.", note: "Remainder excluding Mineral Ridge & McDonald.", remainder: true },
  "HUBBARD TOWNSHIP": { rate: 0.099, tier: "8-12%", label: "Hubbard Twp.", note: "Remainder excluding Hubbard city.", remainder: true },
  VERNON: { rate: 0.135, tier: "12-16%", label: "Vernon Twp.", note: "Remainder excluding Orangeville village.", remainder: true },
  FARMINGTON: { rate: 0.105, tier: "8-12%", label: "Farmington Twp.", note: "Remainder excluding West Farmington village.", remainder: true },
  "WARREN TOWNSHIP": { rate: 0.13, tier: "12-16%", label: "Warren Twp.", note: "Distinct from Warren city." },
  HOWLAND: { rate: 0.1, tier: "8-12%", label: "Howland Twp.", note: "Higher-income suburb; Howland Center CDP (rate 7%) sits inside." },
  CHAMPION: { rate: 0.105, tier: "8-12%", label: "Champion Twp.", note: "Champion Schools; Mercy Health ER planned." },
  BAZETTA: { rate: 0.1, tier: "8-12%", label: "Bazetta Twp.", note: "Lakeview Schools; Cortland surrounds." },
  VIENNA: { rate: 0.115, tier: "8-12%", label: "Vienna Twp.", note: "Includes Youngstown-Warren Regional Airport." },
  KINSMAN: { rate: 0.145, tier: "12-16%", label: "Kinsman Twp.", note: "Rural NE township; FQHC service area." },
  BRISTOL: { rate: 0.138, tier: "12-16%", label: "Bristol Twp.", note: "Includes Bristolville; Bristol Local Schools." },
  BLOOMFIELD: { rate: 0.135, tier: "12-16%", label: "Bloomfield Twp.", note: "Rural." },
  BRACEVILLE: { rate: 0.13, tier: "12-16%", label: "Braceville Twp.", note: "Rural / mixed." },
  HARTFORD: { rate: 0.115, tier: "8-12%", label: "Hartford Twp.", note: "Rural." },
  NEWTON: { rate: 0.115, tier: "8-12%", label: "Newton Twp.", note: "Surrounds Newton Falls." },
  MECCA: { rate: 0.112, tier: "8-12%", label: "Mecca Twp.", note: "Includes part of Mosquito Lake area." },
  GUSTAVUS: { rate: 0.11, tier: "8-12%", label: "Gustavus Twp.", note: "Rural." },
  SOUTHINGTON: { rate: 0.11, tier: "8-12%", label: "Southington Twp.", note: "Rural." },
  FOWLER: { rate: 0.105, tier: "8-12%", label: "Fowler Twp.", note: "Rural." },
  GREENE: { rate: 0.102, tier: "8-12%", label: "Greene Twp.", note: "Rural." },
  MESOPOTAMIA: { rate: 0.098, tier: "8-12%", label: "Mesopotamia Twp.", note: "Rural; includes Amish community." },
  JOHNSTON: { rate: 0.095, tier: "8-12%", label: "Johnston Twp.", note: "Rural." },
};

/** Choropleth fill color for a poverty rate (decimal). null → "no data" gray. */
export function povertyColor(rate: number | null | undefined): string {
  if (rate == null) return "#E8E4DA";
  if (rate > 0.25) return "#A50F15";
  if (rate >= 0.2) return "#DE2D26";
  if (rate >= 0.16) return "#FB6A4A";
  if (rate >= 0.12) return "#FCAE91";
  if (rate >= 0.08) return "#FEE5D9";
  return "#FFF7F3";
}

/**
 * Resolve a GIS feature name to its poverty record.
 *
 * `kind` disambiguates the city/township name collisions: the township GIS
 * layer returns bare names (e.g. "WARREN", "HUBBARD") that also match a CITY
 * key with a very different poverty rate. For townships we therefore try the
 * "<NAME> TOWNSHIP" key FIRST, so Warren Twp. (0.13) and Hubbard Twp. (0.099)
 * resolve correctly instead of grabbing Warren/Hubbard city. Townships whose
 * data key is bare (HOWLAND, LIBERTY, …) still fall through to the exact match.
 */
export function povertyLookup(
  rawName: string | null | undefined,
  kind?: "township" | "muni",
): PovertyRecord | null {
  if (!rawName) return null;
  const upper = rawName.toUpperCase().trim();
  // Township-first: prefer the explicit "<NAME> TOWNSHIP" key when present.
  if (kind === "township") {
    const twpKey = `${upper} TOWNSHIP`;
    if (POVERTY_DATA[twpKey]) return POVERTY_DATA[twpKey];
  }
  if (POVERTY_DATA[upper]) return POVERTY_DATA[upper];
  const stripped = upper.replace(/\s+(CITY|VILLAGE|TOWNSHIP)\s*$/i, "").trim();
  if (POVERTY_DATA[stripped]) return POVERTY_DATA[stripped];
  return null;
}

/** Legend tiers, top (highest poverty) to bottom. */
export const POVERTY_LEGEND: { color: string; label: string }[] = [
  { color: "#A50F15", label: "> 25% (very high)" },
  { color: "#DE2D26", label: "20 – 25% (high)" },
  { color: "#FB6A4A", label: "16 – 20% (elevated)" },
  { color: "#FCAE91", label: "12 – 16% (moderate)" },
  { color: "#FEE5D9", label: "8 – 12% (low)" },
  { color: "#FFF7F3", label: "< 8% (very low)" },
  { color: "#E8E4DA", label: "No data" },
];

/** County GIS boundary service: layer 108 = munis, 109 = townships.
 *
 * The two layers expose the jurisdiction name under DIFFERENT field names:
 * layer 108 (Admin/munis) uses `NAME`, layer 109 (Townships) uses `TOWNSHIP`.
 * Requesting the wrong field returns an ArcGIS 400 ("Failed to execute query")
 * wrapped in a 200 response, so each layer must request its own field. */
export const BOUNDARY_BASE =
  "https://webgis.co.trumbull.oh.us/gisserver/rest/services/Maps/Tax_Map_WM/MapServer";
export const BOUNDARY_QUERY_MUNI =
  "/query?where=1%3D1&outFields=NAME&outSR=4326&f=geojson";
export const BOUNDARY_QUERY_TOWNSHIP =
  "/query?where=1%3D1&outFields=TOWNSHIP&outSR=4326&f=geojson";

/** @deprecated Use BOUNDARY_QUERY_MUNI / BOUNDARY_QUERY_TOWNSHIP. Kept as the
 *  muni-field query for backward compatibility. */
export const BOUNDARY_QUERY = BOUNDARY_QUERY_MUNI;
