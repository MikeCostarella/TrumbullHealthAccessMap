import { useReducer, useState } from "react";
import type { Resource } from "../types/resource";
import { useResources } from "../hooks/useResources";
import { useFilteredResources } from "../hooks/useFilteredResources";
import {
  filterReducer,
  initFilterState,
  activeFilterCount,
} from "../state/filterReducer";
import { FACILITY_TYPES_IN_ORDER } from "../data/facilityTypes";
import { ResourceMap } from "./ResourceMap";
import { Legend } from "./Legend";
import { Toolbar } from "./Toolbar";
import { FilterPanel } from "./FilterPanel";
import { ResourceModal } from "./ResourceModal";
import { PovertyControls } from "./PovertyControls";
import styles from "./App.module.css";

export default function App() {
  const { resources, loading, error } = useResources("trumbull");
  const [filters, dispatch] = useReducer(
    filterReducer,
    FACILITY_TYPES_IN_ORDER,
    initFilterState,
  );
  const { filtered, countsByType, cities, specialties } = useFilteredResources(
    resources,
    filters,
  );

  const [selected, setSelected] = useState<Resource | null>(null);
  const [legendOpen, setLegendOpen] = useState(false); // mobile drawer
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [povertyVisible, setPovertyVisible] = useState(false);

  const total = resources.length;
  const shown = filtered.length;
  const ready = !loading && !error;

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div>
          <p className={styles.subtitle}>
            Trumbull County Combined Health District
          </p>
          <h1 className={styles.title}>Access to Care</h1>
        </div>
        <div className={styles.meta}>
          {ready && (
            <span className={styles.count}>
              Showing <strong>{shown}</strong> of <strong>{total}</strong>{" "}
              resources
            </span>
          )}
        </div>
      </header>

      <div className={styles.main}>
        <Legend
          enabledTypes={filters.enabledTypes}
          countsByType={countsByType}
          onToggleType={(facilityType) =>
            dispatch({ type: "toggleFacilityType", facilityType })
          }
          onShowAll={() =>
            dispatch({ type: "showAllTypes", all: FACILITY_TYPES_IN_ORDER })
          }
          onHideAll={() => dispatch({ type: "hideAllTypes" })}
          open={legendOpen}
          onClose={() => setLegendOpen(false)}
        />

        {/* Backdrop behind the mobile legend drawer */}
        {legendOpen && (
          <div
            className={styles.backdrop}
            onClick={() => setLegendOpen(false)}
            aria-hidden="true"
          />
        )}

        <div className={styles.mapArea}>
          <div className={styles.toolbarWrap}>
            <Toolbar
              search={filters.search}
              onSearch={(value) => dispatch({ type: "setSearch", value })}
              onToggleLegend={() => setLegendOpen((v) => !v)}
              onToggleFilters={() => setFiltersOpen((v) => !v)}
              filtersOpen={filtersOpen}
              activeFilterCount={activeFilterCount(filters)}
            />
            <FilterPanel
              open={filtersOpen}
              filters={filters}
              cities={cities}
              specialties={specialties}
              onToggleService={(service) =>
                dispatch({ type: "toggleService", service })
              }
              onToggleCity={(city) => dispatch({ type: "toggleCity", city })}
              onToggleSpecialty={(specialty) =>
                dispatch({ type: "toggleSpecialty", specialty })
              }
              onClear={() => dispatch({ type: "clearFilters" })}
            />
          </div>

          <div className={styles.mapCanvas}>
            {error && (
              <div className={styles.overlayMsg}>
                Could not load data: {error.message}
              </div>
            )}
            {loading && (
              <div className={styles.overlayMsg}>Loading resources&hellip;</div>
            )}
            {ready && (
              <ResourceMap
                resources={filtered}
                onSelect={setSelected}
                povertyVisible={povertyVisible}
              />
            )}
            {ready && (
              <PovertyControls
                visible={povertyVisible}
                onToggle={() => setPovertyVisible((v) => !v)}
              />
            )}
            {ready && shown === 0 && (
              <div className={styles.noResults}>
                <strong>No matches</strong>
                <p>Try clearing search or filters.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <ResourceModal resource={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
