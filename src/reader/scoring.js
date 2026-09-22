/* Reader scoring — box ladder, wrong-weighted priority queue, mastery, readiness.
 * Pure functions (spec §5–6); no storage or React here.
 */

// ---- Box ladder (spec §5) ------------------------------------------------
// Unseen = no ItemProgress record. correct -> box = min(box+1, 5); wrong -> 0.
export function boxAfter(prev, correct, itemId, at = Date.now()) {
  const base = prev && Number.isInteger(prev.box) ? prev.box : 0;
  const box = correct ? Math.min(base + 1, 5) : 0;
  return {
    itemId: itemId ?? prev?.itemId,
    box,
    timesSeen: (prev?.timesSeen || 0) + 1,
    timesCorrect: (prev?.timesCorrect || 0) + (correct ? 1 : 0),
    timesWrong: (prev?.timesWrong || 0) + (correct ? 0 : 1),
    lastResult: correct ? "correct" : "wrong",
    wrongFlag: !correct,
    lastSeenAt: at,
  };
}

// ---- Priority weights (spec §5, fixed table — NOT interpolated) ----------
export const QUEUE_WEIGHTS = { unseen: 4, wrong: 8, box0: 8, box1: 3, box2: 2, box3: 1.5, box4: 1, box5: 0.5 };

export function weightFor(progress) {
  if (!progress || (progress.timesSeen || 0) === 0) return QUEUE_WEIGHTS.unseen; // unseen
  if (progress.wrongFlag || progress.box === 0) return QUEUE_WEIGHTS.wrong;
  const w = QUEUE_WEIGHTS["box" + progress.box];
  return w == null ? 1 : w;
}

// ---- Smart-practice selection (weighted random, suppress last N=8) --------
export function suppressN(poolSize) { return Math.min(8, Math.max(0, poolSize - 1)); }

// pool: itemId[]; progressMap: {itemId: ItemProgress}; recent: itemId[] (most
// recent last). rng defaults to Math.random. Returns one itemId (weighted), never
// one of the last suppressN(pool) shown (unless the pool is that small).
export function pickNext(pool, progressMap = {}, recent = [], rng = Math.random) {
  if (!pool.length) return null;
  const n = suppressN(pool.length);
  const blocked = new Set(recent.slice(-n));
  let eligible = pool.filter((id) => !blocked.has(id));
  if (!eligible.length) eligible = pool.slice();
  const weights = eligible.map((id) => weightFor(progressMap[id]));
  const total = weights.reduce((a, b) => a + b, 0);
  let r = rng() * total;
  for (let i = 0; i < eligible.length; i++) {
    r -= weights[i];
    if (r < 0) return eligible[i];
  }
  return eligible[eligible.length - 1];
}

// ---- Mastery + readiness (per section/topic) -----------------------------
export function sectionStats(itemIds, progressMap = {}) {
  const total = itemIds.length;
  let attempted = 0, seen = 0, correct = 0, boxLE1 = 0, boxGE3 = 0;
  for (const id of itemIds) {
    const p = progressMap[id];
    if (p && (p.timesSeen || 0) > 0) {
      attempted++;
      seen += p.timesSeen; correct += p.timesCorrect || 0;
      if (p.box <= 1) boxLE1++; else if (p.box >= 3) boxGE3++;
    }
  }
  const accuracy = seen > 0 ? correct / seen : 0;
  const coverage = total > 0 ? attempted / total : 0;
  return { total, attempted, seen, correct, accuracy, coverage, boxLE1, boxGE3 };
}

export function masteryState(itemIds, progressMap = {}) {
  const s = sectionStats(itemIds, progressMap);
  if (s.attempted === 0) return "unstarted";
  const majorityLE1 = s.boxLE1 > s.attempted / 2;
  const majorityGE3 = s.boxGE3 > s.attempted / 2;
  if (s.accuracy >= 0.8 && majorityGE3) return "mastered";
  if (s.accuracy < 0.5 || majorityLE1) return "weak";
  return "improving";
}

// Exam-readiness for v1 = coverage × accuracy (0..1). Also returns the parts.
export function readiness(itemIds, progressMap = {}) {
  const s = sectionStats(itemIds, progressMap);
  return { value: s.coverage * s.accuracy, coverage: s.coverage, accuracy: s.accuracy, attempted: s.attempted, total: s.total };
}

// Roll readiness up to a unit average across its sections (equal-weighted by
// section, matching the library's per-unit summary).
export function unitReadiness(sectionItemIdLists, progressMap = {}) {
  const vals = sectionItemIdLists.map((ids) => readiness(ids, progressMap).value);
  if (!vals.length) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}
