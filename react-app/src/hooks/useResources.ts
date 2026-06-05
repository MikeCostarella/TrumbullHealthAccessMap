import { useEffect, useState } from "react";
import type { Resource } from "../types/resource";
import { loadResources } from "../data/loadResources";

export interface UseResourcesResult {
  resources: Resource[];
  loading: boolean;
  error: Error | null;
}

/**
 * Loads resources for a jurisdiction, handling loading/error state and
 * aborting the fetch on unmount or jurisdiction change. The returned
 * `resources` are already normalized and guaranteed mappable.
 */
export function useResources(jurisdiction = "trumbull"): UseResourcesResult {
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    loadResources(jurisdiction, controller.signal)
      .then((data) => {
        setResources(data);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (controller.signal.aborted) return;
        setError(err instanceof Error ? err : new Error(String(err)));
        setLoading(false);
      });

    return () => controller.abort();
  }, [jurisdiction]);

  return { resources, loading, error };
}
