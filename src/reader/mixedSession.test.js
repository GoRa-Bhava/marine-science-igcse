import { test } from "node:test";
import assert from "node:assert/strict";
import {
  startRun, current, isReviewed, atEnd, answerCurrent, skip, goBack,
} from "./mixedSession.js";

const NOW = new Date("2026-11-18T00:00:00Z");
const hasSR = (run, id) => run.sr[id] !== undefined;

// The scenario from BUILD-BRIEF-mixed-practice-back-skip:
//   answer item 1, skip item 2, go Back to item 1 (read-only, SR not rewritten),
//   forward to item 2 (attemptable), answer it (SR written once),
//   skip item 3 to the end (no SR entry, summary excludes it).
test("Mixed Practice run: Back and Skip with no re-scoring and no SR write on skip", () => {
  let run = startRun(["A", "B", "C"]);          // all new: SR map empty
  assert.equal(current(run), "A");

  // Answer item 1 (A) correct, then move on.
  run = answerCurrent(run, true, NOW);
  assert.ok(hasSR(run, "A"), "answering A writes its SR entry");
  assert.equal(run.summary.answered, 1);
  const srAfterA = run.sr["A"];
  run = skip(run);                               // advance to B (press Next)
  assert.equal(current(run), "B");

  // Skip item 2 (B): writes nothing.
  run = skip(run);
  assert.equal(current(run), "C");
  assert.ok(!hasSR(run, "B"), "skipping B writes no SR entry");

  // Go Back to item 1 (A): read-only, and the SR map is not updated again.
  run = goBack(run);                             // C -> B
  run = goBack(run);                             // B -> A
  assert.equal(current(run), "A");
  assert.ok(isReviewed(run), "A is answered this run -> read-only");
  const before = run.sr;
  run = answerCurrent(run, false, NOW);          // the UI blocks this; guard is a no-op
  assert.equal(run.sr, before, "answering an already-answered item does not touch the SR map");
  assert.equal(run.sr["A"], srAfterA, "A's SR entry is unchanged (not re-scored)");
  assert.equal(run.summary.answered, 1, "no extra answer counted");

  // Go forward to item 2 (B): it is attemptable.
  run = skip(run);                               // A -> B
  assert.equal(current(run), "B");
  assert.ok(!isReviewed(run), "B was skipped, so it is still attemptable");

  // Answer item 2 (B): its SR entry is written exactly once.
  run = answerCurrent(run, true, NOW);
  assert.ok(hasSR(run, "B"), "answering B writes its SR entry");
  assert.equal(run.summary.answered, 2);
  const srAfterB = run.sr["B"];
  run = answerCurrent(run, true, NOW);           // guard: a second answer is a no-op
  assert.equal(run.sr["B"], srAfterB, "B's SR entry is written exactly once");
  assert.equal(run.summary.answered, 2, "B counted once");

  // Skip item 3 (C) to the end: no SR entry, and the summary count excludes it.
  run = skip(run);                               // B -> C
  assert.equal(current(run), "C");
  assert.ok(atEnd(run), "C is the last question");
  run = skip(run);                               // at end: stays put (caller shows summary)
  assert.ok(!hasSR(run, "C"), "skipping C writes no SR entry");
  assert.equal(run.summary.answered, 2, "summary counts only answered items (A and B), not skipped C");
  assert.deepEqual(Object.keys(run.sr).sort(), ["A", "B"], "SR map holds only the answered items");
});

// A wrong answer still scores once and is counted in the summary's wrong list.
test("Mixed Practice: a wrong answer scores once and is recorded as wrong", () => {
  let run = startRun(["A", "B"]);
  run = answerCurrent(run, false, NOW);
  assert.ok(run.sr["A"] !== undefined, "wrong answer writes an SR entry");
  assert.deepEqual(run.summary.wrong, ["A"]);
  assert.equal(run.summary.correct, 0);
  assert.equal(run.summary.answered, 1);
});
