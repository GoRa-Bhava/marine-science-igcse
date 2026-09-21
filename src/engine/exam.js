// Exam-tier (tier-3) grading — a single marking-point checklist, graded
// CONTENT-ONLY. The learner ticks the points they'd include; a pass requires the
// ticked set to equal the true mark points (no misses, no wrong picks). Answer
// ORDER is never authored, entered or graded anywhere. Kept pure and testable.
//
// Normalises both the current authoring fields (check / distractors [/ build])
// and the newer { points:[{ text, correct, distractorReason }], modelAnswer }
// shape, so existing items and future ones both work with no migration.

export function examPoints(item) {
  if (Array.isArray(item.points)) {
    return item.points.map((p) => ({ text: p.text, correct: !!p.correct, reason: p.distractorReason }));
  }
  const correct = (item.check || []).map((t) => ({ text: t, correct: true }));
  const wrong = (item.distractors || []).map((t, i) => ({
    text: t, correct: false, reason: (item.distractorReasons || [])[i],
  }));
  return [...correct, ...wrong];
}

export function examModel(item) {
  return item.modelAnswer || item.build || [];
}

export function examCorrectIdx(item) {
  const pts = examPoints(item);
  return pts.map((_, i) => i).filter((i) => pts[i].correct);
}

function sameSet(a, b) {
  if (a.length !== b.length) return false;
  const s = new Set(a);
  return b.every((x) => s.has(x));
}

// Binary retrieval result for the scheduler: pass iff every mark point is ticked
// and no distractor is. Order plays no part.
export function examPassed(item, checkSel) {
  return sameSet(checkSel, examCorrectIdx(item));
}

// Granular score for DISPLAY only (never spacing): (chosenCorrect − wrongPicks)
// / totalCorrect, clamped to 0..1.
export function examScore(item, checkSel) {
  const pts = examPoints(item);
  const total = pts.filter((p) => p.correct).length;
  const chosenCorrect = checkSel.filter((i) => pts[i] && pts[i].correct).length;
  const wrongPicks = checkSel.filter((i) => pts[i] && !pts[i].correct).length;
  if (!total) return 0;
  return Math.max(0, Math.min(1, (chosenCorrect - wrongPicks) / total));
}
