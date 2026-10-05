/* Mixed Practice session builder — spaced repetition (FSRS), Mixed-Practice only.
 *
 * The SR schedule lives in its own map (see progressStore `sr::<profile>`), fed
 * only by Mixed-Practice answers. A session is built once at the start:
 *   1. DUE first — items whose SR record isDue (due today or overdue), oldest-due
 *      first, interleaved by topic.
 *   2. Fill to `size` with NEW items — never scheduled in Mixed Practice — in book
 *      (flat) order, interleaved by topic.
 * Due and new are disjoint, so no item appears twice. Items that have an SR record
 * but aren't due are held back until their due day. The session is never empty: a
 * day with nothing due runs entirely on new items; a brand-new user's first
 * session is all new items. Pure + side-effect free, so it is unit-tested directly.
 */
import { isDue } from "./scheduler.js";

// Round-robin by topic, preserving each topic's internal order, so one topic
// never stacks up. `topicOf(id)` returns the item's topic key.
function interleaveByTopic(ids, topicOf) {
  const buckets = new Map();
  for (const id of ids) {
    const t = topicOf(id) || "?";
    if (!buckets.has(t)) buckets.set(t, []);
    buckets.get(t).push(id);
  }
  const keys = [...buckets.keys()];
  const out = [];
  let added = true;
  while (added) {
    added = false;
    for (const k of keys) {
      const b = buckets.get(k);
      if (b.length) { out.push(b.shift()); added = true; }
    }
  }
  return out;
}

export function buildMixedSession(flatOrder, srMap = {}, topicOf = () => "?", size = 20, now = new Date()) {
  const due = flatOrder.filter((id) => isDue(srMap[id], now));
  // oldest-due first (earliest due date), stable for equal dates
  due.sort((a, b) => {
    const da = srMap[a]?.due || "";
    const db = srMap[b]?.due || "";
    return da < db ? -1 : da > db ? 1 : 0;
  });
  const fresh = flatOrder.filter((id) => !srMap[id]); // never scheduled in Mixed Practice
  const ordered = [...interleaveByTopic(due, topicOf), ...interleaveByTopic(fresh, topicOf)];
  return ordered.slice(0, size); // due are disjoint from fresh → no duplicates
}

export const MIXED_SESSION_SIZE = 20;
