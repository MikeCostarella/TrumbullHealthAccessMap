import { useEffect, useState } from "react";
import { POVERTY_LEGEND } from "../data/povertyData";
import { useIsMobile } from "../hooks/useIsMobile";
import styles from "./PovertyControls.module.css";

interface PovertyControlsProps {
  visible: boolean;
}

/** The poverty-rate legend (bottom-left), shown only when the overlay is on.
 *  The on/off toggle itself lives in MapLayersControl. The legend starts
 *  collapsed on mobile and auto-collapses when the viewport crosses into
 *  mobile width. */
export function PovertyControls({ visible }: PovertyControlsProps) {
  const isMobile = useIsMobile();
  const [legendOpen, setLegendOpen] = useState(!isMobile);

  // Collapse on entering mobile, expand on returning to desktop.
  useEffect(() => {
    setLegendOpen(!isMobile);
  }, [isMobile]);

  return (
    <>
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
