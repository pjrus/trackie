"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function usePersistedState<T>(
  key: string,
  fallback: T,
  normalise?: (value: unknown) => T,
) {
  const [value, setValue] = useState<T>(fallback);
  const [loaded, setLoaded] = useState(false);
  // localStorage is read a microtask after mount (it cannot be touched while
  // rendering: these pages are prerendered). A caller that writes during that
  // gap — useRememberView records the current route on mount — must not have
  // its value overwritten by the older one coming off disk.
  const written = useRef(false);
  const set = useCallback<React.Dispatch<React.SetStateAction<T>>>((next) => {
    written.current = true;
    setValue(next);
  }, []);
  useEffect(() => {
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      const stored = localStorage.getItem(key);
      if (stored !== null && !written.current) {
        let parsed: unknown;
        try {
          parsed = JSON.parse(stored);
        } catch {
          parsed = stored;
        }
        setValue(normalise ? normalise(parsed) : (parsed as T));
      }
      setLoaded(true);
    });
    return () => {
      active = false;
    };
    // fallback/normalise intentionally excluded: this must run once on
    // mount, not whenever a caller passes a fresh inline fallback/normalise
    // reference (e.g. usePersistedState(key, [], normaliseApplications)).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  useEffect(() => {
    if (loaded)
      localStorage.setItem(
        key,
        typeof value === "string" ? value : JSON.stringify(value),
      );
  }, [key, loaded, value]);
  return [value, set, loaded] as const;
}
