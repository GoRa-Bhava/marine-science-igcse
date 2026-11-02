/* Mixed Practice session builder — spaced repetition (FSRS), Mixed-Practice only.
 *
 * The SR schedule lives in its own map (see progressStore `sr::<profile>`), fed
 * only by Mixed-Practice answers. A session is built once at the start:
 *   1. DUE first — items whose SR record isDue (due today or overdue), shuffled and
 *      interleaved by topic (topic order reshuffled each round so none clumps).
 *   2. Fill to `size` with NEW items — never scheduled in Mixed Practice — also
 *      shuffled and interleaved by topic, so selection and order are random (not
 *      book order, and not always opening on Unit 1).
 * All due items still precede all new items, so the spaced-repetition priority (due
 * before new) holds; only the order among due items is randomised.
 * Due and new are disjoint, so no item appears twice. Items that have an SR record
 * but aren't due are held back until their due day. The session is never empty: a
 * day with nothing due runs entirely on new items; a brand-new user's first
 * session is all new items. Pure + side-effect free, so it is unit-tested directly.
 */
import { isDue } from "./scheduler.js";

// Fisher–Yates shuffle (in place). `rng` is injectable so tests stay deterministic.
// Fisher–Yates; rng defaults to Math.random. Returns a new array (pure).
function shuffle(arr, rng = Math.random) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
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
  const out = [];
  let added = true;
  while (added) {
    added = false;
    for (const k of shuffle([...buckets.keys()], rng)) {   // shuffle topic order each round
      const b = buckets.get(k);
      if (b.length) { out.push(b.shift()); added = true; }
    }
  }
  return out;
}

// Randomised + interleaved. Shuffle both pools so question SELECTION and ORDER are
// random (not book-order Q1-of-each then Q2-of-each); the due group still precedes
// new, so the spaced-repetition priority (due before new) holds — only the order
// among due items changes. interleaveByTopic keeps any one topic from clumping.
export function buildMixedSession(flatOrder, srMap = {}, topicOf = () => "?", size = 20, now = new Date(), rng = Math.random) {
  const due = shuffle(flatOrder.filter((id) => isDue(srMap[id], now)), rng);
  const fresh = shuffle(flatOrder.filter((id) => !srMap[id]), rng); // never scheduled in Mixed Practice
  const ordered = [...interleaveByTopic(due, topicOf, rng), ...interleaveByTopic(fresh, topicOf, rng)];
  return ordered.slice(0, size); // due are disjoint from fresh → no duplicates
}

export const MIXED_SESSION_SIZE = 20;
