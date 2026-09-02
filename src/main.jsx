import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Offline support. Registered after load so it never delays first paint.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const url = new URL("sw.js", document.baseURI).href;
    navigator.serviceWorker.register(url).catch(() => {
      // Works fine without it — just no offline mode.
    });
  });
}
