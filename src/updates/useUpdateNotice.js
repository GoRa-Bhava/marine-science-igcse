import { useCallback, useEffect, useRef, useState } from "react";
import { shouldCheck, shouldShow, loadState, saveState, clearDismissal } from "./notice.js";

/* useUpdateNotice — checks quietly for a newer version on app start and on return
   to the foreground, and exposes a banner descriptor plus action handlers. The
   decision logic is in ./notice.js; this hook is the React/DOM/network glue.

   Returns { notice, download, update, later, onManualFound }:
   - notice: null, or { platform:"native", latest, phase:"available"|"downloading" }
     or { platform:"web" }. The banner is rendered from ReaderApp's home view, so a
     result that arrives while the user is mid-question simply waits until they are
     back on home (home-only placement = automatic deferral).
   - download(): native — open the APK and switch the banner to the downloading state.
   - update():  web — reload the page (only ever called from home, so no run is cut off).
   - later():   dismiss this build (native) / for 3 days (web) and hide the banner.
   - onManualFound(latest?): Settings' manual check found an update — clear the
     dismissal and surface the banner on home. */

const REPO = "GoRa-Bhava/marine-science-igcse";
const APK_URL = `https://github.com/${REPO}/releases/latest/download/marine-science.apk`;
const BUILD = Number(import.meta.env.VITE_BUILD_NUMBER) || 0;
const IS_NATIVE = typeof window !== "undefined" && !!window.Capacitor?.isNativePlatform?.();
const FETCH_TIMEOUT_MS = 6000;
// Set when the user taps "Update now"; read once on the next load so we can
// confirm "Update complete" after the page has reloaded onto the new version.
const UPDATED_FLAG = "marine_update_done";

/* Latest published APK build number, from the GitHub releases API tag build-N.
   Aborts after 6 s; the caller treats any rejection as "no update". */
async function fetchLatestBuild(signal) {
  const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
    headers: { Accept: "application/vnd.github+json" },
    cache: "no-store",
    signal,
  });
  if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
  const m = /build-(\d+)/.exec((await res.json()).tag_name || "");
  if (!m) throw new Error("latest release has no build number");
  return Number(m[1]);
}

export function useUpdateNotice() {
  const [notice, setNotice] = useState(null);
  const noticeRef = useRef(null);
  noticeRef.current = notice;
  const inFlight = useRef(false);
  const webReady = useRef(false);

  // A ready web worker respects any live dismissal before surfacing.
  const surfaceWeb = useCallback(() => {
    webReady.current = true;
    const st = loadState();
    if (shouldShow({ platform: "web", webReady: true, now: Date.now(), dismissedAt: st.dismissedAt })) {
      setNotice({ platform: "web" });
    }
  }, []);

  const runCheck = useCallback(async ({ force = false } = {}) => {
    if (IS_NATIVE && BUILD === 0) return;      // dev build: never check or show
    if (inFlight.current) return;
    const now = Date.now();
    const st = loadState();
    if (!force && !shouldCheck({ now, lastCheck: st.lastCheck, lastFail: st.lastFail })) return;
    inFlight.current = true;
    try {
      if (IS_NATIVE) {
        const ctrl = new AbortController();
        const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
        let latest;
        try { latest = await fetchLatestBuild(ctrl.signal); }
        finally { clearTimeout(timer); }
        saveState({ lastCheck: now, lastFail: 0 });
        const s2 = loadState();
        if (shouldShow({ platform: "native", latest, build: BUILD, dismissedBuild: s2.dismissedBuild })) {
          setNotice({ platform: "native", latest, phase: "available" });
        }
      } else {
        const reg = await navigator.serviceWorker?.getRegistration?.();
        saveState({ lastCheck: now, lastFail: 0 });
        if (!reg) return;                       // no SW (e.g. unsupported) → nothing to do
        // Already a worker waiting from a previous load.
        if (reg.waiting && navigator.serviceWorker.controller) surfaceWeb();
        // A worker that installs from here on.
        reg.addEventListener?.("updatefound", () => {
          const sw = reg.installing;
          if (!sw) return;
          sw.addEventListener("statechange", () => {
            if (sw.state === "installed" && navigator.serviceWorker.controller) surfaceWeb();
          });
        });
        await reg.update();
      }
    } catch (e) {
      saveState({ lastFail: Date.now() });       // offline/timeout/error → silent, 30-min backoff
    } finally {
      inFlight.current = false;
    }
  }, [surfaceWeb]);

  // 0) If the previous load just finished a web update, confirm it once, then
  //    auto-hide. Runs before the update check, which finds nothing more to do.
  useEffect(() => {
    let flag = null;
    try { flag = localStorage.getItem(UPDATED_FLAG); } catch (e) { /* ignore */ }
    if (!flag) return;
    try { localStorage.removeItem(UPDATED_FLAG); } catch (e) { /* ignore */ }
    setNotice({ platform: "web", phase: "done" });
    const t = setTimeout(() => setNotice((n) => (n && n.phase === "done" ? null : n)), 6000);
    return () => clearTimeout(t);
  }, []);

  // 1) On app start, after the first render (does not block it).
  useEffect(() => {
    const t = setTimeout(() => { runCheck(); }, 0);
    return () => clearTimeout(t);
  }, [runCheck]);

  // 2) On return to the foreground.
  useEffect(() => {
    if (IS_NATIVE) {
      let handle;
      import("@capacitor/app").then(({ App }) => {
        App.addListener("appStateChange", ({ isActive }) => { if (isActive) runCheck(); })
          .then((h) => { handle = h; });
      }).catch(() => {});
      return () => { handle && handle.remove && handle.remove(); };
    }
    const onVis = () => { if (document.visibilityState === "visible") runCheck(); };
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, [runCheck]);

  const later = useCallback(() => {
    const n = noticeRef.current;
    if (!n) return;
    if (n.platform === "native") saveState({ dismissedBuild: n.latest });
    else saveState({ dismissedAt: Date.now() });
    setNotice(null);
  }, []);

  const download = useCallback(() => {
    const n = noticeRef.current;
    if (!n || n.platform !== "native") return;
    saveState({ dismissedBuild: n.latest }); // don't reappear on next open while install pending
    try { window.location.href = APK_URL; } catch (e) { /* ignore */ }
    setNotice({ ...n, phase: "downloading" });
  }, []);

  // Web "Update now": show "Updating…" so the user knows something is happening,
  // promote the waiting worker, and reload once it has taken control so the new
  // version is actually live. The flag lets the next load confirm "Update
  // complete". Falls back to a plain reload if there is no worker to wait on.
  const update = useCallback(() => {
    try { localStorage.setItem(UPDATED_FLAG, String(Date.now())); } catch (e) { /* ignore */ }
    setNotice({ platform: "web", phase: "updating" });
    let done = false;
    const reload = () => { if (done) return; done = true; try { window.location.reload(); } catch (e) { /* ignore */ } };
    try {
      const sw = navigator.serviceWorker;
      if (sw && sw.controller) {
        sw.addEventListener("controllerchange", reload, { once: true });
        sw.getRegistration()
          .then((reg) => { if (reg && reg.waiting) reg.waiting.postMessage({ type: "SKIP_WAITING" }); else reload(); })
          .catch(reload);
        setTimeout(reload, 3500);   // fallback if controllerchange never fires
      } else {
        reload();
      }
    } catch (e) { reload(); }
  }, []);

  const onManualFound = useCallback((latest) => {
    clearDismissal();
    if (IS_NATIVE) setNotice({ platform: "native", latest, phase: "available" });
    else { webReady.current = true; setNotice({ platform: "web" }); }
  }, []);

  return { notice, download, update, later, onManualFound };
}
