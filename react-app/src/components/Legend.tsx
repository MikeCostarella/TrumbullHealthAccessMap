import type { FacilityType } from "../types/resource";
import { FACILITY_TYPES_IN_ORDER, metaFor } from "../data/facilityTypes";
import styles from "./Legend.module.css";

interface LegendProps {
  enabledTypes: Set<FacilityType>;
  countsByType: Map<FacilityType, number>;
  onToggleType: (t: FacilityType) => void;
  onShowAll: () => void;
  onHideAll: () => void;
  /** Mobile drawer: whether visible, and a close handler. */
  open: boolean;
  onClose: () => void;
}

export function Legend({
  enabledTypes,
  countsByType,
  onToggleType,
  onShowAll,
  onHideAll,
  open,
  onClose,
}: LegendProps) {
  return (
    <aside
      className={`${styles.legend} ${open ? styles.open : ""}`}
      aria-label="Facility type filter"
    >
      <button
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Close facility key"
      >
        &times;
      </button>

      <div className={styles.inner}>
        <h2 className={styles.title}>Facility Key</h2>
        <p className={styles.sub}>Click a type to toggle</p>

        <ul className={styles.list}>
          {FACILITY_TYPES_IN_ORDER.filter((t) => countsByType.has(t)).map(
            (type) => {
              const meta = metaFor(type);
              const on = enabledTypes.has(type);
              return (
                <li key={type}>
                  <button
                    className={styles.item}
                    aria-pressed={on}
                    onClick={() => onToggleType(type)}
                  >
                    <span
                      className={styles.marker}
                      style={{ background: meta.color }}
                      dangerouslySetInnerHTML={{ __html: meta.icon }}
                    />
                    <span className={styles.label}>{meta.short ?? type}</span>
                    <span className={styles.count}>
                      {countsByType.get(type)}
                    </span>
                  </button>
                </li>
              );
            },
          )}
        </ul>

        <div className={styles.actions}>
          <button className={styles.actionBtn} onClick={onShowAll}>
            Show all
          </button>
          <button className={styles.actionBtn} onClick={onHideAll}>
            Hide all
          </button>
        </div>
      </div>
    </aside>
  );
}
