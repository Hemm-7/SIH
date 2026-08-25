import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
// Leaflet's own stylesheet must load before any map renders, or tiles stack
// unpositioned. Imported once here rather than per-component.
import "leaflet/dist/leaflet.css";
import "./i18n";
import "./index.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element #root not found in index.html.");
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
