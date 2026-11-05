import { test } from "node:test";
import assert from "node:assert/strict";
import {
  shouldCheck,
  shouldShow,
  loadState,
  saveState,
  clearDismissal,
  STORAGE_KEY,
  CHECK_INTERVAL_MS,
  FAIL_RETRY_MS,
  WEB_DISMISS_MS,
} from "./notice.js";

const H = 60 * 60 * 1000;
const NOW = 1_700_000_000_000;

// ---- shouldCheck: the 6-hour throttle and 30-minute failure backoff ----
test("shouldCheck: first run (no history) is allowed", () => {
  assert.equal(shouldCheck({ now: NOW, lastCheck: 0, lastFail: 0 }), true);
});

test("shouldCheck: throttled within 6 hours of a successful check", () => {
  assert.equal(shouldCheck({ now: NOW, lastCheck: NOW - 5 * H }), false);
  assert.equal(shouldCheck({ now: NOW, lastCheck: NOW - CHECK_INTERVAL_MS + 1 }), false);
});

test("shouldCheck: allowed again once 6 hours have passed", () => {
  assert.equal(shouldCheck({ now: NOW, lastCheck: NOW - 6 * H }), true);
  assert.equal(shouldCheck({ now: NOW, lastCheck: NOW - 7 * H }), true);
});

test("shouldCheck: a failure forces a 30-minute backoff even if lastCheck is stale", () => {
  // lastCheck is old (would otherwise allow), but we failed 10 min ago.
  assert.equal(shouldCheck({ now: NOW, lastCheck: NOW - 8 * H, lastFail: NOW - 10 * 60 * 1000 }), false);
  // 31 min after the failure, the backoff has lapsed.
  assert.equal(shouldCheck({ now: NOW, lastCheck: NOW - 8 * H, lastFail: NOW - FAIL_RETRY_MS - 1 }), true);
});

// ---- shouldShow: native (APK) ----
test("shouldShow native: a dev build (BUILD 0) never shows", () => {
  assert.equal(shouldShow({ platform: "native", latest: 99, build: 0 }), false);
});

test("shouldShow native: an older or equal latest never shows", () => {
  assert.equal(shouldShow({ platform: "native", latest: 10, build: 10 }), false); // equal
  assert.equal(shouldShow({ platform: "native", latest: 9, build: 10 }), false);  // older
});

test("shouldShow native: a strictly newer build shows", () => {
  assert.equal(shouldShow({ platform: "native", latest: 11, build: 10 }), true);
});

test("shouldShow native: the same build, once dismissed, stays hidden", () => {
  assert.equal(shouldShow({ platform: "native", latest: 11, build: 10, dismissedBuild: 11 }), false);
});

test("shouldShow native: a newer build than the dismissed one shows again", () => {
  assert.equal(shouldShow({ platform: "native", latest: 12, build: 10, dismissedBuild: 11 }), true);
});

test("shouldShow native: offline/error (latest null) gives no banner", () => {
  assert.equal(shouldShow({ platform: "native", latest: null, build: 10 }), false);
});

// ---- shouldShow: web ----
test("shouldShow web: nothing without a ready worker (offline/error/no update)", () => {
  assert.equal(shouldShow({ platform: "web", webReady: false, now: NOW }), false);
});

test("shouldShow web: a ready worker shows when never dismissed", () => {
  assert.equal(shouldShow({ platform: "web", webReady: true, now: NOW, dismissedAt: null }), true);
});

test("shouldShow web: a fresh dismissal hides it", () => {
  assert.equal(shouldShow({ platform: "web", webReady: true, now: NOW, dismissedAt: NOW - 2 * 24 * H }), false);
});

test("shouldShow web: the dismissal lapses after 3 days", () => {
  assert.equal(shouldShow({ platform: "web", webReady: true, now: NOW, dismissedAt: NOW - WEB_DISMISS_MS - 1 }), true);
});

test("shouldShow: an unknown platform shows nothing", () => {
  assert.equal(shouldShow({ platform: "nope", webReady: true, latest: 99, build: 1 }), false);
});

// ---- storage helpers (with an injected localStorage shim) ----
function withShim(fn) {
  const map = new Map();
  const prev = globalThis.localStorage;
  globalThis.localStorage = {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => { map.set(k, String(v)); },
    removeItem: (k) => { map.delete(k); },
  };
  try { fn(map); } finally { globalThis.localStorage = prev; }
}

test("loadState returns defaults when storage is empty or blocked", () => {
  withShim(() => {
    assert.deepEqual(loadState(), { lastCheck: 0, lastFail: 0, dismissedBuild: null, dismissedAt: null });
  });
  // No localStorage at all → still defaults, no throw, and nothing persists.
  const prev = globalThis.localStorage;
  globalThis.localStorage = undefined;
  try {
    assert.deepEqual(loadState(), { lastCheck: 0, lastFail: 0, dismissedBuild: null, dismissedAt: null });
    assert.doesNotThrow(() => saveState({ lastCheck: 1 })); // can't persist, but never throws
    assert.deepEqual(loadState(), { lastCheck: 0, lastFail: 0, dismissedBuild: null, dismissedAt: null });
  } finally { globalThis.localStorage = prev; }
});

test("saveState merges and loadState reads it back", () => {
  withShim((map) => {
    saveState({ lastCheck: NOW });
    saveState({ dismissedBuild: 42 });
    const s = loadState();
    assert.equal(s.lastCheck, NOW);
    assert.equal(s.dismissedBuild, 42);
    assert.ok(map.get(STORAGE_KEY).includes("42"));
  });
});

test("clearDismissal wipes both dismissal keys but keeps timestamps", () => {
  withShim(() => {
    saveState({ lastCheck: NOW, dismissedBuild: 42, dismissedAt: NOW });
    clearDismissal();
    const s = loadState();
    assert.equal(s.dismissedBuild, null);
    assert.equal(s.dismissedAt, null);
    assert.equal(s.lastCheck, NOW); // untouched
  });
});

test("loadState tolerates corrupt JSON", () => {
  withShim((map) => {
    map.set(STORAGE_KEY, "{not json");
    assert.deepEqual(loadState(), { lastCheck: 0, lastFail: 0, dismissedBuild: null, dismissedAt: null });
  });
});
