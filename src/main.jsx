import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import { checkForUpdate } from "./lib/updater";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Auto-update OTA (só no app nativo; no navegador é no-op).
checkForUpdate();
