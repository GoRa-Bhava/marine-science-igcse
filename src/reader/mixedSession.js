/* Pure controller for a Mixed Practice run — the reference implementation of the
 * Back/Skip rules, so they can be unit-tested without rendering ReaderApp.
 *
 * Rules (mirrored by ReaderApp's smart-mode record()/next()/goBack()):
 *  - Answering writes the item's spaced-repetition (SR) entry exactly ONCE per run.
 *    An item answered this run and returned to with Back is shown read-only
 *    (isReviewed), so answering it again is a no-op and it is never re-scored.
 *  - Skipping writes nothing: no SR entry, so the item stays due and a later
 *    session offers it again. Back to a skipped item leaves it attemptable.
 *  - The summary counts answered items only; skipped items are never counted wrong.
 *
 * ReaderApp shares applyMixedAnswer below for the one-write-per-run SR update; the
 * position arithmetic here mirrors its generic next()/goBack().
 */
import { answer as schedAnswer } from "../engine/scheduler.js";

// Next SR map after answering `id`. No-op if the item was already answered this run
// (the UI shows it read-only, so this is also a guard that makes the rule testable).
export function applyMixedAnswer(srMap, answeredThisRun, id, right, now = new Date()) {
  if (answeredThisRun.includes(id)) return srMap;     // already scored this run → no re-score
  return { ...srMap, [id]: schedAnswer(srMap[id], right, now) };
}

export function startRun(queue, srMap = {}) {
  return {
    queue: [...queue], pos: 0, maxPos: 0, answered: [], sr: { ...srMap },
    summary: { answered: 0, correct: 0, wrong: [] },
  };
}
export function current(run) { return run.queue[run.pos]; }
export function atEnd(run) { return run.pos >= run.queue.length - 1; }
// Answered this run, so shown read-only (never re-scored). Mirrors ReaderApp `reviewed`.
export function isReviewed(run) { return run.answered.includes(current(run)); }

// Answer the current item once. No-op if already answered this run.
export function answerCurrent(run, right, now = new Date()) {
  const id = current(run);
  if (run.answered.includes(id)) return run;          // never re-scored
  return {
    ...run,
    answered: [...run.answered, id],
    sr: applyMixedAnswer(run.sr, run.answered, id, right, now),
    summary: {
      answered: run.summary.answered + 1,
      correct: run.summary.correct + (right ? 1 : 0),
      wrong: right ? run.summary.wrong : [...run.summary.wrong, id],
    },
  };
}

// Skip or advance — writes nothing. Stops at the end (caller then shows the summary).
export function advance(run) {
  if (atEnd(run)) return run;
  const pos = run.pos + 1;
  return { ...run, pos, maxPos: Math.max(run.maxPos, pos) };
}
export const skip = advance;

export function goBack(run) {
  if (run.pos <= 0) return run;
  return { ...run, pos: run.pos - 1 };
}
