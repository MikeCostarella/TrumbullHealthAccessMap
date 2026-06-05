import { Marker, Tooltip } from "react-leaflet";
import type { Resource } from "../types/resource";
import { facilityIcon } from "./markerIcon";

interface ResourceMarkersProps {
  resources: Resource[];
  onSelect: (resource: Resource) => void;
}

/**
 * Renders one marker per resource. Declarative: the marker set is a pure
 * function of `resources`, so filtering/searching just changes the array and
 * React adds/removes markers — no manual layer-group bookkeeping. The keyed
 * elements let React reconcile efficiently when the filtered set changes.
 */
export function ResourceMarkers({ resources, onSelect }: ResourceMarkersProps) {
  return (
    <>
      {resources.map((r) => (
        <Marker
          key={r.id}
          position={[r.lat, r.lng]}
          icon={facilityIcon(r.type)}
          eventHandlers={{ click: () => onSelect(r) }}
        >
          <Tooltip className="facility-tooltip" direction="top" offset={[0, -4]}>
            {r.name}
          </Tooltip>
        </Marker>
      ))}
    </>
  );
}
