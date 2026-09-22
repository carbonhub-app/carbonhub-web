import * as React from "react";

/**
 * localStorage is an external store, so it is read through
 * useSyncExternalStore rather than copied into state inside an effect.
 * Writes go through setItem and notify every hook reading the same key, which
 * also keeps two components showing the same key in step.
 */
const listeners = new Map<string, Set<() => void>>();

function subscribeTo(key: string) {
  return (onChange: () => void) => {
    let forKey = listeners.get(key);
    if (!forKey) {
      forKey = new Set();
      listeners.set(key, forKey);
    }
    forKey.add(onChange);
    // another tab writing the same key should be picked up too
    window.addEventListener("storage", onChange);
    return () => {
      forKey.delete(onChange);
      window.removeEventListener("storage", onChange);
    };
  };
}

function notify(key: string) {
  listeners.get(key)?.forEach((l) => l());
}

export function readLocalStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

export function writeLocalStorage(key: string, value: string | null): void {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // a blocked write should not break the caller
  }
  notify(key);
}

/**
 * The raw string held at `key`, or null. During prerender it reads as null,
 * which is what the static export is built with.
 */
export function useLocalStorageValue(key: string): string | null {
  const subscribe = React.useMemo(() => subscribeTo(key), [key]);
  return React.useSyncExternalStore(
    subscribe,
    () => readLocalStorage(key),
    () => null,
  );
}
