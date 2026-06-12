import { useCallbackRef } from "./use-callback-ref";
import { useEffect, useState } from "react";

/**
 * Persist a piece of React state in localStorage so every tracker keeps its
 * data across reloads. Reads lazily on mount, writes on every change.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => readStored(key, initialValue));

  const persist = useCallbackRef((next: T) => {
    try {
      window.localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // Storage full or unavailable — keep state in memory only.
    }
  });

  useEffect(() => {
    persist(value);
  }, [value, persist]);

  return [value, setValue] as const;
}

function readStored<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
