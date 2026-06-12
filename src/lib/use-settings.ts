import { useEffect } from "react";
import { useLocalStorage } from "./use-local-storage";
import { applySettings, DEFAULT_SETTINGS, type Settings } from "./settings";

/** Read/write personalization settings and keep the DOM in sync with them. */
export function useSettings() {
  const [settings, setSettings] = useLocalStorage<Settings>(
    "pt.settings",
    DEFAULT_SETTINGS,
  );

  useEffect(() => {
    applySettings(settings);
  }, [settings]);

  function update(patch: Partial<Settings>) {
    setSettings((prev) => ({ ...prev, ...patch }));
  }

  return { settings, update };
}
