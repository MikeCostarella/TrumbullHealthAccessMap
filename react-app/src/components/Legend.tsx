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
  /** Desktop rail-collapse: whether collapsed to the icon rail, and a toggle. */
  collapsed: boolean;
  onToggleCollapsed: () => void;
}

export function Legend({
  enabledTypes,
  countsByType,
  onToggleType,
  onShowAll,
  onHideAll,
  open,
  onClose,
  collapsed,
  onToggleCollapsed,
}: LegendProps) {
  return (
    <aside
      className={`${styles.legend} ${open ? styles.open : ""} ${
        collapsed ? styles.collapsed : ""
      }`}
      aria-label="Facility type filter"
    >
      <button
        className={styles.closeBtn}
        onClick={onClose}
        aria-label="Close facility key"
      >
        &times;
      </button>

      {/* Desktop-only collapse/expand toggle. Hidden on mobile (the drawer
          uses the hamburger + closeBtn instead). */}
      <button
        className={styles.collapseBtn}
        onClick={onToggleCollapsed}
        aria-label={collapsed ? "Expand facility key" : "Collapse facility key"}
        aria-expanded={!collapsed}
        title={collapsed ? "Expand facility key" : "Collapse facility key"}
      >
        <span className={styles.collapseChevron} aria-hidden="true">
          {collapsed ? "\u00BB" : "\u00AB"}
        </span>
      </button>

      <div className={styles.inner}>
        <h2 className={styles.title}>Facility Key</h2>
        <p className={styles.sub}>Click a type to toggle</p>

        <ul className={styles.list}>
          {FACILITY_TYPES_IN_ORDER.filter((t) => countsByType.has(t)).map(
            (type) => {
              const meta = metaFor(type);
              const on = enabledTypes.has(type);
              const label = meta.short ?? type;
              const count = countsByType.get(type);
              return (
                <li key={type}>
                  <button
                    className={styles.item}
                    aria-pressed={on}
                    onClick={() => onToggleType(type)}
                    // When collapsed, the label/count are visually hidden, so
                    // expose them as a native tooltip on the icon rail.
                    title={collapsed ? `${label} (${count})` : undefined}
                  >
                    <span
                      className={styles.marker}
                      style={{ background: meta.color }}
                      dangerouslySetInnerHTML={{ __html: meta.icon }}
                    />
                    <span className={styles.label}>{label}</span>
                    <span className={styles.count}>{count}</span>
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
