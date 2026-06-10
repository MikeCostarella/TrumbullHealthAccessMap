import styles from "./MapLayersControl.module.css";

interface MapLayersControlProps {
  leVisible: boolean;
  povertyVisible: boolean;
  onToggleLe: () => void;
  onTogglePoverty: () => void;
}

/**
 * Unified "Map layers" panel (top-right of the map). Replaces the two
 * separate Life-expectancy / Poverty-rate toggle buttons with one card of
 * checkboxes, so the set of available overlays — and which are currently
 * shown — is visible at a glance. Layers are independent: both can be on,
 * though the choropleths overlap when they are (poverty draws above).
 * Each layer's legend still renders via its own component when visible.
 */
export function MapLayersControl({
  leVisible,
  povertyVisible,
  onToggleLe,
  onTogglePoverty,
}: MapLayersControlProps) {
  return (
    <div className={styles.panel} role="group" aria-label="Map layers">
      <div className={styles.header}>Map layers</div>

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
  );
}
