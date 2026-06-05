import styles from "./Toolbar.module.css";

interface ToolbarProps {
  search: string;
  onSearch: (value: string) => void;
  onToggleLegend: () => void;
  onToggleFilters: () => void;
  filtersOpen: boolean;
  activeFilterCount: number;
}

export function Toolbar({
  search,
  onSearch,
  onToggleLegend,
  onToggleFilters,
  filtersOpen,
  activeFilterCount,
}: ToolbarProps) {
  return (
    <div className={styles.bar}>
      <button
        className={styles.hamburger}
        onClick={onToggleLegend}
        aria-label="Toggle facility key"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
          <path
            d="M3 6h18M3 12h18M3 18h18"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </button>

      <div className={styles.searchWrap}>
        <svg
          className={styles.searchIcon}
          viewBox="0 0 24 24"
          width="18"
          height="18"
          aria-hidden="true"
        >
          <circle
            cx="11"
            cy="11"
            r="7"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          />
          <path
            d="m20 20-3.5-3.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <input
          className={styles.search}
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search by name, city, or specialty…"
          aria-label="Search resources"
        />
      </div>

      <button
        className={`${styles.filterToggle} ${filtersOpen ? styles.open : ""}`}
        onClick={onToggleFilters}
        aria-expanded={filtersOpen}
      >
        <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
          <path
            d="M3 5h18l-7 8v6l-4 2v-8z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
        <span className={styles.filterLabel}>Filters</span>
        {activeFilterCount > 0 && (
          <span className={styles.badge}>{activeFilterCount}</span>
        )}
        <svg
          className={styles.chev}
          viewBox="0 0 24 24"
          width="14"
          height="14"
          aria-hidden="true"
        >
          <path
            d="m6 9 6 6 6-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
