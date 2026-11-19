/* Pure, React/DOM-free core for useRestoreScroll — so the decisions it makes can
 * be unit-tested directly (the hook itself needs a renderer and a real scroller). */

export const HIGHLIGHT_MS = 1000;

/* How to put the student back on the list after they return from an item:
 *   - "top":  the saved offset still fits, so scroll straight back to it
 *             (directly, with no smooth-scroll animation).
 *   - "item": the list is shorter than it was (a filter changed its height, say),
 *             so the saved offset no longer makes sense — centre the opened item.
 * A 1px slack absorbs sub-pixel rounding of scrollHeight/clientHeight. */
export function restorePlan(savedTop, maxTop) {
  const limit = Math.max(0, maxTop);
  if (savedTop <= limit + 1) return { mode: "top", top: savedTop };
  return { mode: "item" };
}

/* The brief highlight is shown only when we know which item to mark and the user
 * has not asked for reduced motion. Restoring the position itself never depends on
 * this — only the highlight does. */
export function shouldHighlight(itemId, reducedMotion) {
  return itemId != null && !reducedMotion;
}

/* A tiny in-memory store keyed by listKey, so different filters/units of the same
 * list restore independently and never clobber each other. Lives only in memory —
 * it is meant to survive a round-trip to an item, not a reload. */
export function makeMemory() {
  const m = new Map();
  return {
    save: (key, top, itemId) => { m.set(key, { top, itemId }); },
    peek: (key) => m.has(key),
    take: (key) => { const v = m.get(key); m.delete(key); return v; },
    size: () => m.size,
  };
}

/* Escape an item id for use in a [data-restore-item="…"] selector. */
export function cssEscape(v) {
  const s = String(v);
  if (typeof CSS !== "undefined" && CSS && typeof CSS.escape === "function") return CSS.escape(s);
  return s.replace(/["\\\]]/g, "\\$&");
}
