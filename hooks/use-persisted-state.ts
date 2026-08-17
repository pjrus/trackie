"use client";

import { useEffect, useState } from "react";

export function usePersistedState<T>(
  key: string,
  fallback: T,
  normalise?: (value: unknown) => T,
) {
  const [value, setValue] = useState<T>(fallback);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        try {
          const parsed =
            key === "viewMode" || key === "sortBy"
              ? stored
              : JSON.parse(stored);
          setValue(normalise ? normalise(parsed) : (parsed as T));
        } catch {
          setValue(fallback);
        }
      }
      setLoaded(true);
    });
    return () => {
      active = false;
    };
  }, [fallback, key, normalise]);
  useEffect(() => {
    if (loaded)
      localStorage.setItem(
        key,
        typeof value === "string" ? value : JSON.stringify(value),
      );
  }, [key, loaded, value]);
  return [value, setValue, loaded] as const;
}
