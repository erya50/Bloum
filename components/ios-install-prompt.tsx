"use client";

import { useState, useSyncExternalStore } from "react";

const subscribe = () => () => {};

export function IosInstallPrompt() {
  const isIos = useSyncExternalStore(
    subscribe,
    () => /iPad|iPhone|iPod/.test(navigator.userAgent),
    () => false
  );
  const isStandalone = useSyncExternalStore(
    subscribe,
    () => window.matchMedia("(display-mode: standalone)").matches,
    () => false
  );
  const [dismissed, setDismissed] = useState(false);

  if (!isIos || isStandalone || dismissed) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 z-50 flex items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-white p-4 shadow-lg sm:inset-x-auto sm:right-4 sm:w-80">
      <p className="text-sm text-ink/80">
        BLOUM installieren: Tippe auf{" "}
        <span aria-label="Teilen-Symbol" role="img">
          ⎋
        </span>{" "}
        und dann „Zum Home-Bildschirm&quot;.
      </p>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        className="shrink-0 text-sm text-ink/50 hover:text-ink"
      >
        ✕
      </button>
    </div>
  );
}
