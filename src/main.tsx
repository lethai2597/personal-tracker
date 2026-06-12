import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { App } from "./app";
import { ConfirmProvider } from "./components/confirm-dialog";
import { seedSampleDataIfEmpty } from "./lib/sample-data";
import { applySettings, DEFAULT_SETTINGS, type Settings } from "./lib/settings";

// Apply saved theme/accent/background before first paint to avoid a flash.
try {
  const raw = window.localStorage.getItem("pt.settings");
  applySettings(raw ? (JSON.parse(raw) as Settings) : DEFAULT_SETTINGS);
} catch {
  applySettings(DEFAULT_SETTINGS);
}

// First-ever visit lands on a populated board so the welcome tour has content.
if (window.localStorage.getItem("pt.welcomed") === null) {
  seedSampleDataIfEmpty();
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ConfirmProvider>
      <App />
    </ConfirmProvider>
  </StrictMode>,
);
