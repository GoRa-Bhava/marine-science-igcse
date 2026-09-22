import { test } from "node:test";
import assert from "node:assert/strict";
import {
  boxAfter, weightFor, pickNext, suppressN, masteryState, readiness, unitReadiness,
} from "./scoring.js";

test("box ladder: correct climbs to 5, wrong resets to 0, counts track", () => {
  let p = boxAfter(null, true, "Q1");      // unseen -> correct
  assert.equal(p.box, 1); assert.equal(p.wrongFlag, false); assert.equal(p.timesSeen, 1); assert.equal(p.timesCorrect, 1);
  for (let i = 0; i < 6; i++) p = boxAfter(p, true, "Q1");
  assert.equal(p.box, 5, "capped at 5");
  assert.equal(p.timesSeen, 7);
  p = boxAfter(p, false, "Q1");
  assert.equal(p.box, 0, "wrong resets to 0");
  assert.equal(p.wrongFlag, true);
  assert.equal(p.lastResult, "wrong");
  assert.equal(p.timesWrong, 1);
});

test("unseen answered wrong is box 0 with wrongFlag", () => {
  const p = boxAfter(null, false, "Q2");
  assert.equal(p.box, 0); assert.equal(p.wrongFlag, true);
});

test("weights: unseen=4, wrong/box0=8, box1=3 ... box5=0.5", () => {
  assert.equal(weightFor(null), 4);
  assert.equal(weightFor({ timesSeen: 0 }), 4);
  assert.equal(weightFor({ timesSeen: 1, box: 0, wrongFlag: true }), 8);
  assert.equal(weightFor({ timesSeen: 2, box: 0 }), 8);
  assert.equal(weightFor({ timesSeen: 3, box: 1 }), 3);
  assert.equal(weightFor({ timesSeen: 3, box: 5 }), 0.5);
});

test("suppressN is 8, or pool-1 when the pool is small", () => {
  assert.equal(suppressN(100), 8);
  assert.equal(suppressN(5), 4);
  assert.equal(suppressN(1), 0);
});

test("pickNext never returns a recently-shown item (no immediate repeats)", () => {
  const pool = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j"];
  const recent = ["a", "b", "c", "d", "e", "f", "g", "h"]; // last 8
  for (let i = 0; i < 50; i++) {
    const pick = pickNext(pool, {}, recent, () => Math.random());
    assert.ok(!recent.slice(-8).includes(pick), `picked suppressed ${pick}`);
  }
});

test("pickNext is wrong-biased: box0 items dominate over box5", () => {
  const pool = ["wrong1", "wrong2", "mastered1", "mastered2"];
  const pm = {
    wrong1: { timesSeen: 1, box: 0, wrongFlag: true },
    wrong2: { timesSeen: 1, box: 0, wrongFlag: true },
    mastered1: { timesSeen: 6, box: 5 },
    mastered2: { timesSeen: 6, box: 5 },
  };
  let wrong = 0, mastered = 0;
  // deterministic-ish: many draws with real rng; no suppression (recent empty but
  // pool is 4 so suppressN=3 — clear recent each draw to sample the full pool)
  for (let i = 0; i < 4000; i++) {
    const pick = pickNext(pool, pm, []);
    if (pick.startsWith("wrong")) wrong++; else mastered++;
  }
  // weights: wrong 8+8=16 vs mastered 0.5+0.5=1 -> ~16:1
  assert.ok(wrong > mastered * 8, `wrong ${wrong} vs mastered ${mastered}`);
});

test("mastery states", () => {
  const ids = ["a", "b", "c", "d"];
  assert.equal(masteryState(ids, {}), "unstarted");
  // weak: low accuracy
  assert.equal(masteryState(ids, { a: { timesSeen: 2, timesCorrect: 0, box: 0 } }), "weak");
  // mastered: high accuracy + most attempted box>=3
  const good = { a: { timesSeen: 5, timesCorrect: 5, box: 5 }, b: { timesSeen: 5, timesCorrect: 5, box: 4 }, c: { timesSeen: 5, timesCorrect: 4, box: 3 } };
  assert.equal(masteryState(ids, good), "mastered");
  // improving: middling accuracy, not mostly boxed
  const mid = { a: { timesSeen: 4, timesCorrect: 3, box: 2 }, b: { timesSeen: 4, timesCorrect: 2, box: 2 } };
  assert.equal(masteryState(ids, mid), "improving");
});

test("fresh 100% pass is improving, never weak (box level never forces a downgrade)", () => {
  const ids = ["a", "b", "c", "d"];
  // Every item answered correctly once: correct bumps 0->1, so all sit at box 1
  // with accuracy 1.0. Box clause must NOT drag this to "weak".
  const perfectOnce = {
    a: { timesSeen: 1, timesCorrect: 1, box: 1 },
    b: { timesSeen: 1, timesCorrect: 1, box: 1 },
    c: { timesSeen: 1, timesCorrect: 1, box: 1 },
    d: { timesSeen: 1, timesCorrect: 1, box: 1 },
  };
  assert.equal(masteryState(ids, perfectOnce), "improving");
  assert.notEqual(masteryState(ids, perfectOnce), "weak");
});

test("readiness = coverage × accuracy", () => {
  const ids = ["a", "b", "c", "d"]; // total 4
  const pm = { a: { timesSeen: 2, timesCorrect: 2, box: 2 }, b: { timesSeen: 2, timesCorrect: 1, box: 1 } }; // attempted 2/4, acc 3/4
  const r = readiness(ids, pm);
  assert.equal(r.coverage, 0.5);
  assert.equal(r.accuracy, 0.75);
  assert.equal(r.value, 0.375);
  // unit rollup averages sections
  const u = unitReadiness([ids, ["x"]], pm); // 2nd section unseen -> 0
  assert.ok(Math.abs(u - (0.375 + 0) / 2) < 1e-9);
});
