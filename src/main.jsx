import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

// Fonts bundled into the app itself — no request to Google, works with no network.
import "@fontsource-variable/fraunces";
import "@fontsource/karla/400.css";
import "@fontsource/karla/500.css";
import "@fontsource/karla/600.css";

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
