/* ========================================================================
   LESSON SELECTION — exclusion families

   A session serves at most one item per `family`, so two near-duplicate
   questions never land in the same lesson. Items with no `family` are
   singletons and are never excluded. Among due members of one family the
   least-recently-reviewed is preferred, so resurfacing rotates through the
   family instead of starving its siblings.

   Pure and side-effect free, so it is unit-tested directly. buildLesson in
   App.jsx keeps its due-before-fresh gathering and its rank/interleave
   output; only this middle selection step lives here.
   ======================================================================== */
import { isDue } from "./scheduler.js";

/* Reorder the due list so that, within each family, the oldest-reviewed
   member comes first, keeping the overall order otherwise stable. The greedy
   filter then keeps that oldest member as the family's single representative.
   A missing last_review counts as oldest (an item met but never reviewed on
   schedule should resurface before one that has). */
export function rotateDue(due, progress) {
  const lastReview = (it) => progress.items?.[it.id]?.fsrs?.last_review || "";
  const familyAnchor = new Map(); // family -> index of its first member
  due.forEach((it, idx) => {
    if (it.family && !familyAnchor.has(it.family)) familyAnchor.set(it.family, idx);
  });
  return due
    .map((it, idx) => ({ it, idx }))
    .sort((a, b) => {
      const ka = a.it.family ? familyAnchor.get(a.it.family) : a.idx;
      const kb = b.it.family ? familyAnchor.get(b.it.family) : b.idx;
      if (ka !== kb) return ka - kb;               // keep families where they were
      const la = lastReview(a.it), lb = lastReview(b.it);
      if (la !== lb) return la < lb ? -1 : 1;        // oldest reviewed first
      return a.idx - b.idx;                          // stable
    })
    .map((x) => x.it);
}

/* Walk the ordered candidates, keeping an item unless its family is already
   represented; cap at `size`. A skipped duplicate does not cost a slot. */
export function familyFilter(candidates, size) {
  const seen = new Set();
  const out = [];
  for (const it of candidates) {
    if (out.length >= size) break;
    if (it.family) {
      if (seen.has(it.family)) continue;
      seen.add(it.family);
    }
    out.push(it);
  }
  return out;
}

/* Pick up to `size` items from an ordered candidate list. Family exclusion is
   a soft cap, not a hard one: take one item per family first (due before
   fresh, due members rotated by last_review), then, only if that leaves the
   lesson short of `size`, backfill from the held-back same-family siblings —
   least-recently-reviewed first. So a session never repeats a family while
   distinct families remain, but a small topic (or a topic where every item is
   one family) still fills instead of collapsing to a single question. */
export function selectForLesson(candidates, size, progress, now = new Date()) {
  const due = candidates.filter((i) => isDue(progress.items?.[i.id], now));
  const nonDue = candidates.filter((i) => !isDue(progress.items?.[i.id], now));
  const ordered = [...rotateDue(due, progress), ...nonDue];

  const seen = new Set();
  const oncePerFamily = [];
  const held = [];
  for (const it of ordered) {
    if (it.family && seen.has(it.family)) { held.push(it); continue; }
    if (it.family) seen.add(it.family);
    oncePerFamily.push(it);
  }

  const chosen = oncePerFamily.slice(0, size);
  if (chosen.length < size && held.length) {
    const lr = (it) => progress.items?.[it.id]?.fsrs?.last_review || "";
    const backfill = held
      .map((it, idx) => ({ it, idx }))
      .sort((a, b) => {
        const la = lr(a.it), lb = lr(b.it);
        if (la !== lb) return la < lb ? -1 : 1;   // least recently reviewed first
        return a.idx - b.idx;                        // stable
      })
      .map((x) => x.it);
    for (const it of backfill) {
      if (chosen.length >= size) break;
      chosen.push(it);
    }
  }
  return chosen;
}
