/* ========================================================================
   PER-UNIT STUDY RUN — ordering

   A run is a resumable queue of every servable item in a unit, ordered:
     1. due / lapsed  — the ones to review or that were got wrong, first
     2. not-yet-seen
     3. already-known (seen, scheduled ahead) — last, so a learner can stop
        before grinding mastered material.
   Within each band the tier ramp and topic interleave are applied (shared
   with buildLesson), and family exclusion acts as an ordering preference,
   not a cap (selectForLesson with size = band length returns the whole band
   with one item per family first, then siblings).

   Pure and testable; App.jsx supplies the unit's item pool and the RANK map.
   ======================================================================== */
import { isDue } from "./scheduler.js";
import { selectForLesson } from "./select.js";

/* Group by RANK (the recall -> application ladder), then round-robin across
   topics within each rank so a lesson climbs the ladder and interleaves. */
export function rankInterleave(items, RANK) {
  const byRank = {};
  items.forEach((i) => { const r = RANK[i.type]; (byRank[r] = byRank[r] || []).push(i); });
  const out = [];
  Object.keys(byRank).sort().forEach((r) => {
    const buckets = {};
    byRank[r].forEach((i) => (buckets[i.topic] = buckets[i.topic] || []).push(i));
    const keys = Object.keys(buckets);
    let added = true;
    while (added) {
      added = false;
      keys.forEach((k) => { if (buckets[k].length) { out.push(buckets[k].shift()); added = true; } });
    }
  });
  return out;
}

/* Build the ordered list of item ids for a unit run. `pool` is every servable
   item in the unit. */
export function buildRunQueue(pool, progress, RANK, now = new Date()) {
  const seen = (i) => progress.items?.[i.id]?.seen;
  const dueP = (i) => isDue(progress.items?.[i.id], now);
  const band = (items) => rankInterleave(selectForLesson(items, items.length, progress, now), RANK);

  const due = band(pool.filter((i) => dueP(i)));
  const unseen = band(pool.filter((i) => !seen(i)));
  const known = band(pool.filter((i) => seen(i) && !dueP(i)));
  return [...due, ...unseen, ...known].map((i) => i.id);
}

/* A saved run can be resumed when it has items still ahead of its position. */
export function runIsResumable(run) {
  return !!(run && run.queue && run.queue.length && run.pos < run.queue.length);
}

/* Add an item to the run's missed set on a wrong answer, once. */
export function recordMiss(missed, id, right) {
  return !right && !missed.includes(id) ? [...missed, id] : missed;
}

/* Should a just-answered item be re-served at the end of the SAME free-study
   lesson? Only a wrong answer is, and only once — EXCEPT an exam item, which is
   graded once and then only rescheduled for a later day (re-serving a two-step
   exam mid-session is confusing and could trap the learner on it, so it always
   advances instead). Per-unit runs never requeue; they collect misses for the
   end-of-run review. Keeping this pure makes the advance-after-wrong path
   testable without a React renderer. */
export function shouldRequeueAfterWrong(item, wasRight, { alreadyRequeued = false, inRun = false } = {}) {
  if (wasRight) return false;
  if (!item || item.type === "exam") return false;
  return !alreadyRequeued && !inRun;
}
