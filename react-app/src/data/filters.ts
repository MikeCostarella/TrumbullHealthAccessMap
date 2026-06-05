import type { ResourceServices } from "../types/resource";

/**
 * Service filters map directly onto the boolean keys of ResourceServices.
 * Typing `key` as `keyof ResourceServices` means a renamed/removed service
 * field becomes a compile error here, not a silently dead filter.
 */
export interface ServiceFilter {
  key: keyof ResourceServices;
  label: string;
}

export const SERVICE_FILTERS: ServiceFilter[] = [
  { key: "primary", label: "Primary care" },
  { key: "dental", label: "Dental" },
  { key: "mentalHealth", label: "Mental / behavioral health" },
  { key: "substanceUse", label: "Substance use / MAT" },
  { key: "prenatal", label: "Prenatal / OB-GYN" },
  { key: "pediatric", label: "Pediatric" },
  { key: "vision", label: "Vision" },
  { key: "pharmacy", label: "Pharmacy" },
];

/**
 * NOTE: The original app defined "access" filters (Medicaid, Medicare,
 * sliding scale, telehealth, transit) but the dataset has no corresponding
 * fields, so these filters never matched anything. They are intentionally
 * omitted here. When/if the data gains these fields, add them to
 * ResourceServices (or a new ResourceAccess type) and reintroduce filters
 * the same type-safe way as SERVICE_FILTERS above.
 */
