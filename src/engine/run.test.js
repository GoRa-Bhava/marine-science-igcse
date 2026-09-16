import { test } from "node:test";
import assert from "node:assert/strict";
import { buildRunQueue, rankInterleave, runIsResumable, recordMiss, shouldRequeueAfterWrong } from "./run.js";

const RANK = { choice: 1, tap: 1, gap: 2, label: 2, match: 3, multi: 3, chain: 4, exam: 5 };
const NOW = new Date("2026-09-13T10:00:00Z");
const DUE = "2026-09-01";
const AHEAD = "2027-01-01";

const rec = (over) => ({ seen: true, due: AHEAD, fsrs: { stability: 8, last_review: "2026-09-01" }, ...over });
const item = (id, topic, type = "choice", family) =>
  family ? { id, topic, type, family } : { id, topic, type };

test("run order is due/lapsed, then unseen, then known", () => {
  const pool = [
    item("dueA", "t1"), item("dueB", "t2"),      // due
    item("newA", "t1"), item("newB", "t2"),      // unseen
    item("knownA", "t1"), item("knownB", "t2"),  // seen, ahead
  ];
  const progress = { items: {
    dueA: rec({ due: DUE }), dueB: rec({ due: DUE }),
    knownA: rec(), knownB: rec(),
    // newA/newB absent -> unseen
  } };
  const q = buildRunQueue(pool, progress, RANK, NOW);
  assert.equal(q.length, 6);
  const pos = (id) => q.indexOf(id);
  // every due id comes before every unseen, and every unseen before every known
  for (const d of ["dueA", "dueB"]) for (const n of ["newA", "newB"]) assert.ok(pos(d) < pos(n));
  for (const n of ["newA", "newB"]) for (const k of ["knownA", "knownB"]) assert.ok(pos(n) < pos(k));
});

test("every servable item appears exactly once (family is ordering, not a cap)", () => {
  const pool = [
    item("a1", "t1", "choice", "fam"), item("a2", "t1", "choice", "fam"), item("a3", "t1", "choice", "fam"),
    item("s1", "t1"), item("s2", "t2"),
  ];
  const progress = { items: {} };  // all unseen
  const q = buildRunQueue(pool, progress, RANK, NOW);
  assert.equal(q.length, 5);
  assert.deepEqual([...q].sort(), ["a1", "a2", "a3", "s1", "s2"]);
});

test("within a band, the first of a family precedes its siblings", () => {
  const pool = [item("f1", "t1", "choice", "fam"), item("f2", "t1", "choice", "fam"), item("s", "t1")];
  const progress = { items: {
    f1: rec({ due: DUE, fsrs: { last_review: "2026-09-10" } }),
    f2: rec({ due: DUE, fsrs: { last_review: "2026-09-02" } }),   // older -> leads its family
    s: rec({ due: DUE }),
  } };
  const q = buildRunQueue(pool, progress, RANK, NOW);
  assert.ok(q.indexOf("f2") < q.indexOf("f1"));   // least-recently-reviewed sibling first
});

test("rankInterleave climbs the ladder and interleaves topics", () => {
  const items = [
    item("c1", "t1", "choice"), item("c2", "t2", "choice"),
    item("g1", "t1", "gap"), item("g2", "t2", "gap"),
  ];
  const out = rankInterleave(items, RANK).map((i) => i.id);
  // all rank-1 (choice) before any rank-2 (gap)
  assert.ok(out.indexOf("c1") < out.indexOf("g1"));
  assert.ok(out.indexOf("c2") < out.indexOf("g1"));
  // topics interleave within a rank (t1, t2 alternate)
  assert.deepEqual(out.slice(0, 2).sort(), ["c1", "c2"]);
});

test("resume: a run with items ahead is resumable and slices from pos", () => {
  const run = { queue: ["a", "b", "c", "d"], pos: 2, missed: ["a"] };
  assert.ok(runIsResumable(run));
  assert.deepEqual(run.queue.slice(run.pos), ["c", "d"]);   // still ahead
  assert.ok(!runIsResumable({ queue: ["a", "b"], pos: 2, missed: [] }));  // finished
  assert.ok(!runIsResumable(undefined));
});

test("missed set collects exactly the wrong answers, once each", () => {
  let missed = [];
  missed = recordMiss(missed, "a", true);   // right -> unchanged
  missed = recordMiss(missed, "b", false);  // wrong -> added
  missed = recordMiss(missed, "b", false);  // wrong again -> still once
  missed = recordMiss(missed, "c", false);  // wrong -> added
  assert.deepEqual(missed, ["b", "c"]);
});

test("a wrong exam answer advances instead of being re-served in the same lesson", () => {
  const exam = { id: "U1-90", topic: "inside", type: "exam" };
  const choice = { id: "Q1", topic: "inside", type: "choice" };
  // The reported loop bug: a wrong exam item must NOT requeue (it advances and
  // FSRS reschedules it for a later day).
  assert.equal(shouldRequeueAfterWrong(exam, false, {}), false, "wrong exam does not requeue");
  // A wrong ordinary item does come back once in a free-study lesson.
  assert.equal(shouldRequeueAfterWrong(choice, false, {}), true, "wrong choice requeues once");
  // ...but never twice, and never a correct answer.
  assert.equal(shouldRequeueAfterWrong(choice, false, { alreadyRequeued: true }), false, "no double requeue");
  assert.equal(shouldRequeueAfterWrong(choice, true, {}), false, "correct answers never requeue");
  // In a per-unit run nothing requeues (misses go to the end-of-run review).
  assert.equal(shouldRequeueAfterWrong(choice, false, { inRun: true }), false, "runs never requeue");
});
