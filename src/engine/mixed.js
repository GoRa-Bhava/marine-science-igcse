/* Mixed Practice session builder — spaced repetition (FSRS), Mixed-Practice only.
 *
 * The SR schedule lives in its own map (see progressStore `sr::<profile>`), fed
 * only by Mixed-Practice answers. A session is built once at the start:
 *   1. DUE first — items whose SR record isDue (due today or overdue), oldest-due
 *      first within each topic, interleaved by topic (topic lead order shuffled).
 *   2. Fill to `size` with NEW items — never scheduled in Mixed Practice — in book
 *      (flat) order within each topic, interleaved by topic (lead order shuffled),
 *      so a session doesn't always open on Unit 1.
 * Due and new are disjoint, so no item appears twice. Items that have an SR record
 * but aren't due are held back until their due day. The session is never empty: a
 * day with nothing due runs entirely on new items; a brand-new user's first
 * session is all new items. Pure + side-effect free, so it is unit-tested directly.
 */
import { isDue } from "./scheduler.js";

// Fisher–Yates shuffle (in place). `rng` is injectable so tests stay deterministic.
function shuffle(arr, rng = Math.random) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Round-robin by topic, preserving each topic's internal order, so one topic
// never stacks up. The topic order is shuffled each call so a session doesn't
// always lead with the same (book-order, Unit 1) topics. `topicOf(id)` returns
// the item's topic key.
function interleaveByTopic(ids, topicOf, rng = Math.random) {
  const buckets = new Map();
  for (const id of ids) {
    const t = topicOf(id) || "?";
    if (!buckets.has(t)) buckets.set(t, []);
    buckets.get(t).push(id);
  }
  const keys = shuffle([...buckets.keys()], rng); // randomise which topic leads, each session
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

export function buildMixedSession(flatOrder, srMap = {}, topicOf = () => "?", size = 20, now = new Date(), rng = Math.random) {
  const due = flatOrder.filter((id) => isDue(srMap[id], now));
  // oldest-due first (earliest due date), stable for equal dates — kept within
  // each topic bucket; only the topic lead order is randomised.
  due.sort((a, b) => {
    const da = srMap[a]?.due || "";
    const db = srMap[b]?.due || "";
    return da < db ? -1 : da > db ? 1 : 0;
  });
  const fresh = flatOrder.filter((id) => !srMap[id]); // never scheduled in Mixed Practice
  const ordered = [...interleaveByTopic(due, topicOf, rng), ...interleaveByTopic(fresh, topicOf, rng)];
  return ordered.slice(0, size); // due are disjoint from fresh → no duplicates
}

export const MIXED_SESSION_SIZE = 20;
