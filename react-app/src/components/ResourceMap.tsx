import { MapContainer, TileLayer } from "react-leaflet";
import type { Resource } from "../types/resource";
import { ResourceMarkers } from "./ResourceMarkers";
import { PovertyLayer } from "./PovertyLayer";
import { LifeExpectancyLayer } from "./LifeExpectancyLayer";
import { UserLocationLayer } from "./UserLocationLayer";
import { useInvalidateSize } from "../hooks/useInvalidateSize";
import styles from "./ResourceMap.module.css";

// Map view, tiles, and zoom limits ported verbatim from the original app.
const CENTER: [number, number] = [41.235, -80.79]; // Warren/Niles/Howland cluster
const ZOOM = 12;
const MIN_ZOOM = 10; // keep place labels legible
const MAX_ZOOM = 16; // Esri Light Gray Canvas tiles stop at 16

// Esri World Street Map (legacy ArcGIS Online tile service). Chosen over the
// muted gray canvas because street/place labels stay legible at the
// neighborhood zoom levels users actually browse at.
// Attribution to Esri is required by their terms of use.
const TILE_URL =
  "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}";
const TILE_ATTRIBUTION = "Tiles &copy; Esri \u2014 Esri, DeLorme, NAVTEQ";

interface ResourceMapProps {
  resources: Resource[];
  onSelect: (resource: Resource) => void;
  povertyVisible: boolean;
  leVisible: boolean;
}

/** Runs side-effect hooks that need the Leaflet map instance from context. */
function MapEffects() {
  useInvalidateSize();
  return null;
}

export function ResourceMap({
  resources,
  onSelect,
  povertyVisible,
  leVisible,
}: ResourceMapProps) {
  return (
    <MapContainer
      className={styles.map}
      center={CENTER}
      zoom={ZOOM}
      minZoom={MIN_ZOOM}
      maxZoom={MAX_ZOOM}
      zoomControl
    >
      <TileLayer
        url={TILE_URL}
        attribution={TILE_ATTRIBUTION}
        maxZoom={MAX_ZOOM}
        crossOrigin
      />
      <PovertyLayer visible={povertyVisible} />
      <LifeExpectancyLayer visible={leVisible} />
      <ResourceMarkers resources={resources} onSelect={onSelect} />
      <UserLocationLayer />
      <MapEffects />
    </MapContainer>
  );
}
