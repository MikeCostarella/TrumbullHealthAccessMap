import { useEffect } from "react";
import type { Resource } from "../types/resource";
import { metaFor } from "../data/facilityTypes";
import { SERVICE_FILTERS } from "../data/filters";
import styles from "./ResourceModal.module.css";

interface ResourceModalProps {
  resource: Resource | null;
  onClose: () => void;
}

/** Normalize a possibly-schemeless website into a safe absolute URL. */
function normalizeWeb(web: string): string {
  return /^https?:\/\//.test(web) ? web : `https://${web}`;
}

export function ResourceModal({ resource, onClose }: ResourceModalProps) {
  // Close on Escape while the modal is open.
  useEffect(() => {
    if (!resource) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [resource, onClose]);

  if (!resource) return null;

  const r = resource;
  const meta = metaFor(r.type);

  const fullAddr = [r.addr, r.city, `${r.state || "OH"} ${r.zip || ""}`.trim()]
    .filter(Boolean)
    .join(", ");
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddr)}`;
  const dirUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(fullAddr)}`;

  const offered = SERVICE_FILTERS.filter(({ key }) => r.services[key]);

  return (
    <div
      className={styles.backdrop}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${r.name} details`}
    >
      {/* Stop propagation so clicks inside the card don't close it. */}
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.head}>
          <span
            className={styles.pin}
            style={{ background: meta.color }}
            dangerouslySetInnerHTML={{ __html: meta.icon }}
          />
          <div className={styles.titles}>
            <div className={styles.type}>{r.type}</div>
            <h3 className={styles.name}>{r.name}</h3>
          </div>
          <button
            className={styles.close}
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className={styles.body}>
          {fullAddr && (
            <div className={styles.section}>
              <div className={styles.label}>Address</div>
              <div className={styles.address}>{fullAddr}</div>
              <div className={styles.actions}>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.aMap}
                >
                  View on Google Maps
                </a>
                <a
                  href={dirUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.aDir}
                >
                  Get Directions
                </a>
              </div>
            </div>
          )}

          {r.specialty && (
            <div className={styles.section}>
              <div className={styles.label}>Specialty</div>
              <div className={styles.kv}>{r.specialty}</div>
            </div>
          )}

          {offered.length > 0 && (
            <div className={styles.section}>
              <div className={styles.label}>Services Offered</div>
              <div className={styles.tags}>
                {offered.map(({ key, label }) => (
                  <span key={key} className={`${styles.tag} ${styles.gold}`}>
                    {label}
                  </span>
                ))}
              </div>
            </div>
          )}

          {r.phone && (
            <div className={styles.section}>
              <div className={styles.label}>Phone</div>
              <div className={styles.kv}>
                <a href={`tel:${r.phone}`}>{r.phone}</a>
              </div>
            </div>
          )}

          {r.web && (
            <div className={styles.section}>
              <div className={styles.label}>Website</div>
              <div className={styles.kv}>
                <a
                  href={normalizeWeb(r.web)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {r.web}
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
