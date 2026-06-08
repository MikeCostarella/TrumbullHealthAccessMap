import { useState } from "react";
import type { ResourceServices } from "../types/resource";
import { SERVICE_FILTERS } from "../data/filters";
import type { FilterState } from "../state/filterReducer";
import styles from "./FilterPanel.module.css";

interface FilterPanelProps {
  open: boolean;
  filters: FilterState;
  cities: string[];
  cityCounts: Map<string, number>;
  specialties: string[];
  onToggleService: (s: keyof ResourceServices) => void;
  onToggleCity: (c: string) => void;
  onToggleSpecialty: (s: string) => void;
  onClear: () => void;
}

export function FilterPanel({
  open,
  filters,
  cities,
  cityCounts,
  specialties,
  onToggleService,
  onToggleCity,
  onToggleSpecialty,
  onClear,
}: FilterPanelProps) {
  const [specSearch, setSpecSearch] = useState("");

  const visibleSpecialties = specSearch
    ? specialties.filter((s) =>
        s.toLowerCase().includes(specSearch.toLowerCase()),
      )
    : specialties;

  return (
    <div className={`${styles.panel} ${open ? styles.open : ""}`}>
      <div className={styles.grid}>
        <div className={styles.group}>
          <h3 className={styles.groupTitle}>Services offered</h3>
          <div className={styles.options}>
            {SERVICE_FILTERS.map(({ key, label }) => (
              <label key={key} className={styles.option}>
                <input
                  type="checkbox"
                  checked={filters.services.has(key)}
                  onChange={() => onToggleService(key)}
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div className={styles.group}>
          <h3 className={styles.groupTitle}>City</h3>
          <div className={`${styles.options} ${styles.scrollList}`}>
            {cities.map((c) => {
              const count = cityCounts.get(c) ?? 0;
              return (
                <label
                  key={c}
                  className={`${styles.option} ${styles.cityOption} ${
                    count === 0 ? styles.empty : ""
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={filters.cities.has(c)}
                    onChange={() => onToggleCity(c)}
                  />
                  <span className={styles.cityName}>{c}</span>
                  <span className={styles.cityCount}>{count}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className={styles.group}>
          <h3 className={styles.groupTitle}>Specialty</h3>
          <input
            className={styles.specSearch}
            type="search"
            value={specSearch}
            onChange={(e) => setSpecSearch(e.target.value)}
            placeholder="Filter specialties…"
            aria-label="Filter specialty list"
          />
          <div className={`${styles.options} ${styles.scrollList}`}>
            {visibleSpecialties.map((s) => (
              <label key={s} className={styles.option}>
                <input
                  type="checkbox"
                  checked={filters.specialties.has(s)}
                  onChange={() => onToggleSpecialty(s)}
                />
                {s}
              </label>
            ))}
          </div>
        </div>
      </div>

      <button className={styles.clear} onClick={onClear}>
        Clear all filters
      </button>
    </div>
  );
}
