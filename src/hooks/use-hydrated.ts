import * as React from "react";

const subscribe = () => () => {};

/**
 * False while the prerendered markup is being hydrated, true afterwards.
 * Useful for content that must not differ between the server render and the
 * first client render, such as a fade-in.
 */
export function useHydrated(): boolean {
  return React.useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
