import { useState } from "react";
import type { Resource } from "../types/resource";
import { useResources } from "../hooks/useResources";
import { ResourceMap } from "./ResourceMap";
import styles from "./App.module.css";

export default function App() {
  const { resources, loading, error } = useResources("trumbull");
  const [selected, setSelected] = useState<Resource | null>(null);

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
          {!loading && !error && (
            <span className={styles.count}>
              <strong>{resources.length}</strong> resources
            </span>
          )}
        </div>
      </header>

      <main className={styles.mapWrap}>
        {error && (
          <div className={styles.overlayMsg}>
            Could not load data: {error.message}
          </div>
        )}
        {loading && (
          <div className={styles.overlayMsg}>Loading resources&hellip;</div>
        )}
        {!loading && !error && (
          <ResourceMap resources={resources} onSelect={setSelected} />
        )}
      </main>

      {/* Temporary selection readout; replaced by a proper modal in the
          next slice. */}
      {selected && (
        <div className={styles.selectionBar} role="status">
          <strong>{selected.name}</strong>
          <span>
            {selected.type} &middot; {selected.city}, {selected.state}
          </span>
          <button
            className={styles.closeBtn}
            onClick={() => setSelected(null)}
            aria-label="Dismiss"
          >
            &times;
          </button>
        </div>
      )}
    </div>
  );
}
