import { useMemo } from "react";
import type { FacilityType } from "../types/resource";
import { useResources } from "../hooks/useResources";
import {
  FACILITY_TYPES_IN_ORDER,
  metaFor,
} from "../data/facilityTypes";
import styles from "./App.module.css";

/**
 * Scaffold verification screen. Confirms the data layer works end to end:
 * fetch -> normalize -> typed metadata -> render. This is temporary; it will
 * be replaced by the real map UI in the next migration slice.
 */
export default function App() {
  const { resources, loading, error } = useResources("trumbull");

  const countsByType = useMemo(() => {
    const counts = new Map<FacilityType, number>();
    for (const r of resources) {
      counts.set(r.type, (counts.get(r.type) ?? 0) + 1);
    }
    return counts;
  }, [resources]);

  return (
    <div className={styles.app}>
      <p className={styles.subtitle}>Trumbull County Combined Health District</p>
      <h1 className={styles.title}>Access to Care</h1>

      {loading && <p className={styles.status}>Loading resources&hellip;</p>}

      {error && (
        <p className={`${styles.status} ${styles.error}`}>
          Could not load data: {error.message}
        </p>
      )}

      {!loading && !error && (
        <>
          <p className={styles.count}>
            Loaded <strong>{resources.length}</strong> mappable resources across{" "}
            <strong>{countsByType.size}</strong> facility types.
          </p>

          <ul className={styles.breakdown}>
            {FACILITY_TYPES_IN_ORDER.filter((t) => countsByType.has(t)).map(
              (type) => {
                const meta = metaFor(type);
                return (
                  <li key={type} className={styles.row}>
                    <span
                      className={styles.marker}
                      style={{ background: meta.color }}
                      // Inline SVG icon string from TYPE_META.
                      dangerouslySetInnerHTML={{ __html: meta.icon }}
                    />
                    <span className={styles.label}>{meta.short ?? type}</span>
                    <span className={styles.tally}>{countsByType.get(type)}</span>
                  </li>
                );
              },
            )}
          </ul>
        </>
      )}
    </div>
  );
}
