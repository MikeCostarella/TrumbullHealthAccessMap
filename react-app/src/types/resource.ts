/**
 * Domain types for the Access to Care map.
 *
 * The source dataset stored service availability as "Yes"/"No" strings and a
 * stringly-typed `type` field. Here we model the *clean* shape the app uses
 * everywhere: a `FacilityType` union and a `services` object of real booleans.
 * The conversion from the raw on-disk shape happens once, at the data
 * boundary (see data/loadResources.ts), so the rest of the app never touches
 * "Yes"/"No" strings again.
 */

/** The twelve facility categories. Drives marker color, icon, and legend. */
export type FacilityType =
  | "Hospital"
  | "FQHC (Federally Qualified Health Center)"
  | "Urgent Care"
  | "Primary Care Clinic"
  | "Pharmacy"
  | "Dental Practice"
  | "Behavioral / Mental Health"
  | "Vision / Optometry"
  | "Specialty Practice"
  | "Health Department"
  | "Planned Parenthood"
  | "Other";

/** Boolean service flags, normalized from the raw s_* "Yes"/"No" fields. */
export interface ResourceServices {
  primary: boolean;
  dental: boolean;
  mentalHealth: boolean;
  substanceUse: boolean;
  prenatal: boolean;
  pediatric: boolean;
  vision: boolean;
  pharmacy: boolean;
}

/** A single care facility, as used throughout the UI. */
export interface Resource {
  id: string;
  name: string;
  type: FacilityType;
  addr: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  specialty: string | null;
  phone: string | null;
  web: string | null;
  services: ResourceServices;
  /** Trumbull County jurisdiction (e.g. "Warren (City)", "Howland
   *  (Township)", or "Outside Trumbull County"), assigned by point-in-polygon
   *  at data-convert time. Distinct from `city`, which is the mailing city.
   *  Drives the City filter. */
  jurisdiction: string;
}

/**
 * The raw record shape exactly as it sits in the JSON on disk. Kept separate
 * from `Resource` so the normalization boundary is explicit and type-checked.
 */
export interface RawResource {
  id: string;
  name: string;
  type: string;
  addr: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  specialty: string | null;
  phone: string | null;
  web: string | null;
  services: ResourceServices;
  /** Optional on disk: present once assign-jurisdictions.mjs has run. */
  jurisdiction?: string;
}
