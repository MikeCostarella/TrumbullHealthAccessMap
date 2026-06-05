/**
 * Life-expectancy-by-census-tract data. Source: CDC/NCHS USALEEP (2010–2015),
 * based on 2010 census tract boundaries. Keyed by 11-digit GEOID. Lifted
 * verbatim from the original app. Note: a couple of historical tracts have no
 * current TIGERweb polygon and simply won't render.
 */

export interface LifeExpectancyRecord {
  /** Tract label, e.g. "9330.01". */
  tract: string;
  /** Life expectancy in years. */
  le: number;
  /** Confidence interval string, e.g. "81.7-97.5". */
  ci: string;
  /** Standard error. */
  se: number;
}

export const LE_DATA: Record<string, LifeExpectancyRecord> = {"39155933001":{"tract":"9330.01","le":86.0,"ci":"81.7-97.5","se":2.4057},"39155931602":{"tract":"9316.02","le":82.3,"ci":"81.7-97.5","se":2.0943},"39155930500":{"tract":"9305.0","le":80.6,"ci":"79.6-81.6","se":1.2705},"39155933400":{"tract":"9334.0","le":80.4,"ci":"79.6-81.6","se":2.9164},"39155930800":{"tract":"9308.0","le":80.1,"ci":"79.6-81.6","se":1.3609},"39155932000":{"tract":"9320.0","le":79.7,"ci":"79.6-81.6","se":1.5371},"39155932200":{"tract":"9322.0","le":79.6,"ci":"79.6-81.6","se":2.5383},"39155933002":{"tract":"9330.02","le":79.4,"ci":"77.6-79.5","se":1.3681},"39155930101":{"tract":"9301.01","le":79.1,"ci":"77.6-79.5","se":2.0138},"39155930900":{"tract":"9309.0","le":79.0,"ci":"77.6-79.5","se":1.1977},"39155930600":{"tract":"9306.0","le":78.6,"ci":"77.6-79.5","se":1.4856},"39155931601":{"tract":"9316.01","le":78.5,"ci":"77.6-79.5","se":1.4619},"39155930300":{"tract":"9303.0","le":78.5,"ci":"77.6-79.5","se":1.2701},"39155931900":{"tract":"9319.0","le":78.4,"ci":"77.6-79.5","se":1.459},"39155921400":{"tract":"9214.0","le":77.9,"ci":"77.6-79.5","se":3.8265},"39155931200":{"tract":"9312.0","le":77.8,"ci":"77.6-79.5","se":1.3974},"39155932701":{"tract":"9327.01","le":77.6,"ci":"77.6-79.5","se":1.2287},"39155930102":{"tract":"9301.02","le":77.6,"ci":"77.6-79.5","se":2.0306},"39155930200":{"tract":"9302.0","le":77.6,"ci":"77.6-79.5","se":1.5515},"39155931500":{"tract":"9315.0","le":77.6,"ci":"77.6-79.5","se":1.6818},"39155932300":{"tract":"9323.0","le":77.5,"ci":"75.2-77.5","se":2.7205},"39155931300":{"tract":"9313.0","le":77.4,"ci":"75.2-77.5","se":1.1689},"39155931100":{"tract":"9311.0","le":77.4,"ci":"75.2-77.5","se":1.8029},"39155933500":{"tract":"9335.0","le":77.3,"ci":"75.2-77.5","se":0.9136},"39155931000":{"tract":"9310.0","le":77.3,"ci":"75.2-77.5","se":1.6946},"39155920300":{"tract":"9203.0","le":77.1,"ci":"75.2-77.5","se":1.4928},"39155932500":{"tract":"9325.0","le":77.0,"ci":"75.2-77.5","se":1.4541},"39155930400":{"tract":"9304.0","le":77.0,"ci":"75.2-77.5","se":1.4679},"39155932900":{"tract":"9329.0","le":76.7,"ci":"75.2-77.5","se":1.4454},"39155930700":{"tract":"9307.0","le":76.6,"ci":"75.2-77.5","se":0.9893},"39155933600":{"tract":"9336.0","le":76.6,"ci":"75.2-77.5","se":1.4541},"39155921200":{"tract":"9212.0","le":75.6,"ci":"75.2-77.5","se":2.0937},"39155933700":{"tract":"9337.0","le":75.2,"ci":"75.2-77.5","se":1.5637},"39155932802":{"tract":"9328.02","le":75.1,"ci":"56.9-75.1","se":1.4485},"39155933302":{"tract":"9333.02","le":75.1,"ci":"56.9-75.1","se":1.0011},"39155932801":{"tract":"9328.01","le":74.7,"ci":"56.9-75.1","se":1.6162},"39155931700":{"tract":"9317.0","le":74.6,"ci":"56.9-75.1","se":1.587},"39155932702":{"tract":"9327.02","le":74.1,"ci":"56.9-75.1","se":1.7991},"39155921500":{"tract":"9215.0","le":73.9,"ci":"56.9-75.1","se":1.3906},"39155933301":{"tract":"9333.01","le":73.6,"ci":"56.9-75.1","se":1.5217},"39155931400":{"tract":"9314.0","le":73.2,"ci":"56.9-75.1","se":1.3056},"39155933100":{"tract":"9331.0","le":73.2,"ci":"56.9-75.1","se":2.304},"39155921000":{"tract":"9210.0","le":72.8,"ci":"56.9-75.1","se":1.3416},"39155920500":{"tract":"9205.0","le":71.9,"ci":"56.9-75.1","se":3.2132},"39155920400":{"tract":"9204.0","le":71.6,"ci":"56.9-75.1","se":1.3246},"39155920700":{"tract":"9207.0","le":71.2,"ci":"56.9-75.1","se":1.4551},"39155932600":{"tract":"9326.0","le":70.8,"ci":"56.9-75.1","se":1.4654},"39155920900":{"tract":"9209.0","le":70.7,"ci":"56.9-75.1","se":1.783},"39155921600":{"tract":"9216.0","le":70.4,"ci":"56.9-75.1","se":1.2816},"39155921300":{"tract":"9213.0","le":69.7,"ci":"56.9-75.1","se":1.9747},"39155933900":{"tract":"9339.0","le":69.6,"ci":"56.9-75.1","se":1.9168},"39155921100":{"tract":"9211.0","le":69.2,"ci":"56.9-75.1","se":1.3769},"39155920600":{"tract":"9206.0","le":69.0,"ci":"56.9-75.1","se":1.387},"39155920800":{"tract":"9208.0","le":68.6,"ci":"56.9-75.1","se":1.9369},"39155933800":{"tract":"9338.0","le":63.2,"ci":"56.9-75.1","se":2.4654}};

/** Choropleth fill for a life-expectancy value (years). Sand → teal ramp:
 *  higher LE = teal, lower = sand/orange. null → "no data" gray. */
export function leColor(years: number | null | undefined): string {
  if (years == null) return "#E8E4DA";
  if (years >= 80) return "#1E6F8E";
  if (years >= 77) return "#4FA3B5";
  if (years >= 74) return "#A5C8A0";
  if (years >= 70) return "#E8C56A";
  return "#D17A3F";
}

/** Legend rows, highest LE (teal) to lowest (orange). */
export const LE_LEGEND: { color: string; label: string }[] = [
  { color: "#1E6F8E", label: "80+ yrs (highest)" },
  { color: "#4FA3B5", label: "77 – 80 yrs" },
  { color: "#A5C8A0", label: "74 – 77 yrs" },
  { color: "#E8C56A", label: "70 – 74 yrs" },
  { color: "#D17A3F", label: "< 70 yrs (lowest)" },
  { color: "#E8E4DA", label: "No data" },
];

/**
 * Trumbull County (STATE=39, COUNTY=155) census-tract GeoJSON from TIGERweb.
 * Generalized geometry first (lighter); precise as a fallback. Different
 * server from the poverty boundaries — a separate external dependency.
 */
const TRACT_WHERE = encodeURIComponent("STATE='39' AND COUNTY='155'");
const TRACT_FIELDS = "&outFields=GEOID,TRACT&outSR=4326&f=geojson";
export const TRACT_GEO_URL_GEN =
  "https://tigerweb.geo.census.gov/arcgis/rest/services/Generalized_ACS2024/Tracts_Blocks/MapServer/1/query?where=" +
  TRACT_WHERE +
  TRACT_FIELDS;
export const TRACT_GEO_URL_PRECISE =
  "https://tigerweb.geo.census.gov/arcgis/rest/services/TIGERweb/Tracts_Blocks/MapServer/0/query?where=" +
  TRACT_WHERE +
  TRACT_FIELDS;
