/**
 * Per-facility-type presentation metadata: marker color (CSS token), inline
 * SVG icon, legend display order, and an optional short label. Typed as a
 * Record over FacilityType so the compiler guarantees every type has an entry
 * — add a FacilityType and TS will flag the missing metadata here.
 */
import type { FacilityType } from "../types/resource";

export interface FacilityMeta {
  /** CSS custom property reference, e.g. "var(--t-hospital)". */
  color: string;
  /** Inline SVG markup for the marker/legend glyph. */
  icon: string;
  /** Sort order in the legend (ascending). */
  order: number;
  /** Optional short label for tight UI (falls back to the full type name). */
  short?: string;
}

const ICONS: Record<string, string> = {
  hospital: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>`,
  fqhc: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 21V9l8-5 8 5v12"/><path d="M9 21v-6h6v6"/><path d="M12 8v4M10 10h4"/></svg>`,
  urgent: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"><path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z"/></svg>`,
  primary: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3v6a4 4 0 0 0 8 0V3"/><path d="M6 3h2M12 3h2"/><path d="M10 13v3a4 4 0 0 0 8 0"/><circle cx="18" cy="9" r="2"/></svg>`,
  pharmacy: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="8" width="20" height="8" rx="4" transform="rotate(-30 12 12)"/><path d="M9.5 6.5l5 8.5" stroke-width="2"/></svg>`,
  dental: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" stroke-width="0.8" stroke-linejoin="round"><path d="M8 2c-2.5 0-4 2-4 4.5 0 2 .8 3.5 1.3 5.2.6 2 .9 4 1.2 6 .2 1.5.5 3.3 1.5 3.3 1.2 0 1.4-2 1.7-3.5.3-1.5.6-3 1.3-3 .7 0 1 1.5 1.3 3 .3 1.5.5 3.5 1.7 3.5 1 0 1.3-1.8 1.5-3.3.3-2 .6-4 1.2-6 .5-1.7 1.3-3.2 1.3-5.2C20 4 18.5 2 16 2c-1.5 0-2.5.6-4 .6S9.5 2 8 2Z"/></svg>`,
  mh: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 1 4 3 3 0 0 0 4 3h1V4Z"/><path d="M15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-1 4 3 3 0 0 1-4 3h-1V4Z"/></svg>`,
  vision: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3" fill="currentColor"/></svg>`,
  specialty: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M12 11v5M9.5 13.5h5"/></svg>`,
  health_dept: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 4 5v6c0 5 3.5 9 8 11 4.5-2 8-6 8-11V5l-8-3Z"/><path d="M12 8v6M9 11h6"/></svg>`,
  pp: `<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.7A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg>`,
  other: `<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M9 9a3 3 0 1 1 4.5 2.6c-.9.5-1.5 1.2-1.5 2.4v.5"/><circle cx="12" cy="18" r="0.4" fill="currentColor"/></svg>`,
};

export const TYPE_META: Record<FacilityType, FacilityMeta> = {
  "Hospital": { color: "var(--t-hospital)", icon: ICONS.hospital, order: 1 },
  "FQHC (Federally Qualified Health Center)": { color: "var(--t-fqhc)", icon: ICONS.fqhc, order: 2, short: "FQHC" },
  "Urgent Care": { color: "var(--t-urgent)", icon: ICONS.urgent, order: 3 },
  "Primary Care Clinic": { color: "var(--t-primary)", icon: ICONS.primary, order: 4 },
  "Pharmacy": { color: "var(--t-pharmacy)", icon: ICONS.pharmacy, order: 5 },
  "Dental Practice": { color: "var(--t-dental)", icon: ICONS.dental, order: 6 },
  "Behavioral / Mental Health": { color: "var(--t-mh)", icon: ICONS.mh, order: 7 },
  "Vision / Optometry": { color: "var(--t-vision)", icon: ICONS.vision, order: 8 },
  "Specialty Practice": { color: "var(--t-specialty)", icon: ICONS.specialty, order: 9 },
  "Health Department": { color: "var(--t-health)", icon: ICONS.health_dept, order: 10 },
  "Planned Parenthood": { color: "var(--t-pp)", icon: ICONS.pp, order: 11, short: "Planned Parenthood" },
  "Other": { color: "var(--t-other)", icon: ICONS.other, order: 99 },
};

/** Metadata for a type, falling back to "Other" for any unknown value. */
export function metaFor(type: FacilityType): FacilityMeta {
  return TYPE_META[type] ?? TYPE_META.Other;
}

/** All facility types, in legend display order. */
export const FACILITY_TYPES_IN_ORDER = (
  Object.keys(TYPE_META) as FacilityType[]
).sort((a, b) => TYPE_META[a].order - TYPE_META[b].order);
