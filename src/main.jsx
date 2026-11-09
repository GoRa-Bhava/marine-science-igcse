import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";


// Fonts bundled into the app itself — no request to Google, works with no network.
// Brand match (wildcateducation.co.uk): Lexend for display, Source Sans 3 for UI.
import "@fontsource/lexend/600.css";
import "@fontsource/lexend/700.css";
import "@fontsource/source-sans-3/400.css";
import "@fontsource/source-sans-3/600.css";
import "@fontsource/source-sans-3/700.css";
// Desktop web layout (≥861px). Additive, layout-only; below the breakpoint it
// contributes nothing, so the phone view and the Capacitor APK are unchanged.
import "./responsive.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Offline support for the web build only. Inside the Android app every file is
// already on the device, so there is nothing for a service worker to cache.
const isNativeApp = typeof window !== "undefined" && window.Capacitor?.isNativePlatform?.();
if (!isNativeApp && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const url = new URL("sw.js", document.baseURI).href;
    navigator.serviceWorker.register(url).catch(() => {
      // Works fine without it — just no offline mode.
    });
  });
}

