import { useState } from "react";
import { POVERTY_LEGEND } from "../data/povertyData";
import styles from "./PovertyControls.module.css";

interface PovertyControlsProps {
  visible: boolean;
  onToggle: () => void;
}

/** The "Poverty rate" toggle button (top-left of the map) plus the
 *  collapsible legend (bottom-left), shown only when the overlay is on. */
export function PovertyControls({ visible, onToggle }: PovertyControlsProps) {
  const [legendOpen, setLegendOpen] = useState(true);

  return (
    <>
      <button
        className={styles.toggle}
        aria-pressed={visible}
        onClick={onToggle}
        aria-label="Toggle poverty rate overlay"
      >
        <span className={styles.dot} />
        <span>Poverty rate</span>
      </button>

      {visible && (
        <div
          className={`${styles.legend} ${legendOpen ? "" : styles.collapsed}`}
        >
          <button
            className={styles.legendHeader}
            aria-expanded={legendOpen}
            onClick={() => setLegendOpen((v) => !v)}
          >
            <span className={styles.legendTitle}>Poverty rate by area</span>
            <span className={styles.chev}>▾</span>
          </button>
          {legendOpen && (
            <div className={styles.legendBody}>
              {POVERTY_LEGEND.map((row) => (
                <div key={row.label} className={styles.row}>
                  <span
                    className={styles.swatch}
                    style={{ background: row.color }}
                  />
                  {row.label}
                </div>
              ))}
              <div className={styles.note}>
                ACS 5-yr estimates. Township figures are remainder-of-township
                where a city/village/CDP is carved out.
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
