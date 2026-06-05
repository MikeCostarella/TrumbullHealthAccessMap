import { useEffect, useState } from "react";
import { LE_LEGEND } from "../data/lifeExpectancyData";
import { useIsMobile } from "../hooks/useIsMobile";
import styles from "./LifeExpectancyControls.module.css";

interface LifeExpectancyControlsProps {
  visible: boolean;
  onToggle: () => void;
}

/** "Life expectancy" toggle (top-right) + its own legend (bottom-right).
 *  The legend starts collapsed on mobile and auto-collapses when the
 *  viewport crosses into mobile width. */
export function LifeExpectancyControls({
  visible,
  onToggle,
}: LifeExpectancyControlsProps) {
  const isMobile = useIsMobile();
  const [legendOpen, setLegendOpen] = useState(!isMobile);

  // Collapse on entering mobile, expand on returning to desktop.
  useEffect(() => {
    setLegendOpen(!isMobile);
  }, [isMobile]);

  return (
    <>
      <button
        className={styles.toggle}
        aria-pressed={visible}
        onClick={onToggle}
        aria-label="Toggle life expectancy overlay"
      >
        <span className={styles.dot} />
        <span>Life expectancy</span>
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
            <span className={styles.legendTitle}>Life expectancy</span>
            <span className={styles.chev}>▾</span>
          </button>
          {legendOpen && (
            <div className={styles.legendBody}>
              {LE_LEGEND.map((row) => (
                <div key={row.label} className={styles.row}>
                  <span
                    className={styles.swatch}
                    style={{ background: row.color }}
                  />
                  {row.label}
                </div>
              ))}
              <div className={styles.note}>
                CDC/NCHS USALEEP, 2010–2015, by census tract.
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
