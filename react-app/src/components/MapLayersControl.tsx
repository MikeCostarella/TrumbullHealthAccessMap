import { useEffect, useState } from "react";
import { useIsMobile } from "../hooks/useIsMobile";
import styles from "./MapLayersControl.module.css";

interface MapLayersControlProps {
  leVisible: boolean;
  povertyVisible: boolean;
  onToggleLe: () => void;
  onTogglePoverty: () => void;
}

/**
 * Unified "Map layers" panel (top-right of the map). One card of checkboxes
 * showing which overlays exist and which are currently on. Collapsible via
 * its header — and, following the same convention as the overlay legends,
 * it starts collapsed on mobile and auto-collapses when the viewport
 * crosses into mobile width. While collapsed, a small count badge shows how
 * many layers are active so an enabled overlay is never invisible state.
 * Layers are independent: both can be on, though the choropleths overlap
 * when they are (poverty draws above).
 */
export function MapLayersControl({
  leVisible,
  povertyVisible,
  onToggleLe,
  onTogglePoverty,
}: MapLayersControlProps) {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(!isMobile);

  // Collapse on entering mobile, expand on returning to desktop.
  useEffect(() => {
    setOpen(!isMobile);
  }, [isMobile]);

  const activeCount = Number(leVisible) + Number(povertyVisible);

  return (
    <div
      className={`${styles.panel} ${open ? "" : styles.collapsed}`}
      role="group"
      aria-label="Map layers"
    >
      <button
        className={styles.header}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <span className={styles.headerTitle}>Map layers</span>
        {!open && activeCount > 0 && (
          <span className={styles.badge}>{activeCount} on</span>
        )}
        <span className={styles.chev}>▾</span>
      </button>

      {open && (
        <div className={styles.body}>
          <label className={styles.row}>
            <input
              type="checkbox"
              checked={leVisible}
              onChange={onToggleLe}
              aria-label="Show life expectancy overlay"
            />
            <span className={`${styles.dot} ${styles.leDot}`} />
            <span>Life expectancy</span>
          </label>

          <label className={styles.row}>
            <input
              type="checkbox"
              checked={povertyVisible}
              onChange={onTogglePoverty}
              aria-label="Show poverty rate overlay"
            />
            <span className={`${styles.dot} ${styles.povDot}`} />
            <span>Poverty rate</span>
          </label>
        </div>
      )}
    </div>
  );
}
