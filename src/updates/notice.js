/* Update-notice decision logic + storage — pure and framework-free so it can be
   unit-tested in node. The React glue lives in ./useUpdateNotice.js; the banner
   in ./UpdateBanner.jsx.

   Two decisions:
   - shouldCheck(): may we hit the network now? (6-hour throttle, 30-min backoff
     after a failure).
   - shouldShow(): given a check result, do we show the banner? (platform rules,
     dismissal, the 3-day web expiry).

   Storage is a tiny JSON blob in localStorage under `marine_update`, wrapped in
   try/catch because storage can be blocked or absent. */

export const STORAGE_KEY = "marine_update";
export const CHECK_INTERVAL_MS = 6 * 60 * 60 * 1000; // at most one check per 6 hours
export const FAIL_RETRY_MS = 30 * 60 * 1000;         // after a failure, retry no sooner than 30 min
export const WEB_DISMISS_MS = 3 * 24 * 60 * 60 * 1000; // a web "Later" lapses after 3 days

/* May we run a network check now? A successful check stamps lastCheck and clears
   lastFail; a failed check stamps lastFail and leaves lastCheck untouched, so the
   6-hour throttle is not reset by failures but a 30-minute backoff still applies. */
export function shouldCheck({ now, lastCheck = 0, lastFail = 0 } = {}) {
  if (lastFail && now - lastFail < FAIL_RETRY_MS) return false;
  if (lastCheck && now - lastCheck < CHECK_INTERVAL_MS) return false;
  return true;
}

/* Given a completed check, should the banner be visible?
   - native: a real (non-dev) build, a strictly newer release, and not a build the
     user has already dismissed;
   - web: the service worker reported a new version ready, and either no dismissal
     or the 3-day dismissal has lapsed. */
export function shouldShow({
  platform,
  latest = null,
  build = 0,
  dismissedBuild = null,
  dismissedAt = null,
  now = 0,
  webReady = false,
} = {}) {
  if (platform === "native") {
    if (!build) return false;                 // dev build (BUILD 0) never shows
    if (latest == null || latest <= build) return false; // offline/error/up-to-date
    if (dismissedBuild != null && latest <= dismissedBuild) return false; // same build dismissed
    return true;                               // newer build (incl. newer than a dismissed one)
  }
  if (platform === "web") {
    if (!webReady) return false;               // no new worker, or offline/error
    if (dismissedAt != null && now - dismissedAt < WEB_DISMISS_MS) return false;
    return true;
  }
  return false;
}

// ---- storage (best-effort; never throws) ----
const DEFAULTS = { lastCheck: 0, lastFail: 0, dismissedBuild: null, dismissedAt: null };

function storage() {
  try { return globalThis.localStorage || null; } catch { return null; }
}

export function loadState() {
  try {
    const raw = storage()?.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULTS };
    const o = JSON.parse(raw);
    return { ...DEFAULTS, ...(o && typeof o === "object" ? o : {}) };
  } catch {
    return { ...DEFAULTS };
  }
}

export function saveState(patch) {
  try {
    const next = { ...loadState(), ...patch };
    storage()?.setItem(STORAGE_KEY, JSON.stringify(next));
    return next;
  } catch {
    return null;
  }
}

export function clearDismissal() {
  return saveState({ dismissedBuild: null, dismissedAt: null });
}
