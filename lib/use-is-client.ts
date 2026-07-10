import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/** True only once the component has hydrated on the client. Avoids SSR/CSR mismatches
 * for state (e.g. persisted cart) that doesn't exist on the server. */
export function useIsClient() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
