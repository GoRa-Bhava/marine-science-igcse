import { test } from "node:test";
import assert from "node:assert/strict";
import {
  pickAssignmentItems,
  buildAssignment,
  assignmentNeedsLicence,
  buildResult,
  scoreResult,
  aggregateResults,
  ASSIGNABLE_TYPES,
} from "./assignment.js";
import { encodeAssignment, decodeAssignment, encodeResult, decodeResult } from "./reportCodec.js";

const POOL = [
  { id: "Q1", type: "choice", topic: "tides", unit: 1, options: ["a", "b", "c"] },
  { id: "Q2", type: "choice", topic: "tides", unit: 1, options: ["a", "b", "c"] },
  { id: "Q3", type: "multi", topic: "cells", unit: 3, options: ["a", "b", "c", "d"] },
  { id: "Q4", type: "gap", topic: "cells", unit: 3 },
  { id: "Q5", type: "read", topic: "tides", unit: 1 }, // not assignable
  { id: "Q6", type: "chain", topic: "tides", unit: 1 }, // not assignable
];

test("pickAssignmentItems filters to assignable types and selected topics", () => {
  const ids = pickAssignmentItems(POOL, { topicIds: ["tides"], count: 10, seed: 1 });
  assert.deepEqual(ids.sort(), ["Q1", "Q2"]); // Q5(read)/Q6(chain) excluded
});

test("pickAssignmentItems honours unit selection and count cap", () => {
  const ids = pickAssignmentItems(POOL, { unitIds: [3], count: 1, seed: 1 });
  assert.equal(ids.length, 1);
  assert.ok(["Q3", "Q4"].includes(ids[0]));
});

test("pickAssignmentItems prefers items fewer of the class have answered", () => {
  const ids = pickAssignmentItems(POOL, { topicIds: ["tides"], count: 1, answeredCount: { Q1: 10, Q2: 0 }, seed: 5 });
  assert.deepEqual(ids, ["Q2"]); // Q2 answered by nobody → chosen first
});

test("pickAssignmentItems is deterministic with a seed", () => {
  const a = pickAssignmentItems(POOL, { count: 3, seed: 42 });
  const b = pickAssignmentItems(POOL, { count: 3, seed: 42 });
  assert.deepEqual(a, b);
});

test("assignmentNeedsLicence true only when Units 2–6 are included", () => {
  const bank = Object.fromEntries(POOL.map((i) => [i.id, i]));
  assert.equal(assignmentNeedsLicence(["Q1", "Q2"], bank), false); // all unit 1
  assert.equal(assignmentNeedsLicence(["Q1", "Q3"], bank), true); // Q3 unit 3
});

test("buildAssignment / encode / decode round-trips", async () => {
  const a = buildAssignment({ title: "Tides quiz", due: "2026-11-20", classCode: "10B", itemIds: ["Q1", "Q2"] });
  assert.equal(a.id.length, 8);
  assert.equal(a.n, 2);
  const back = await decodeAssignment(await encodeAssignment(a));
  delete back.v;
  assert.deepEqual(back, a);
});

test("buildResult records pick only on wrong answers; round-trips", async () => {
  const assignment = { id: "aid12345", cls: "10B" };
  const perItem = [
    { itemId: "Q1", right: true, pick: 0 },
    { itemId: "Q2", right: false, pick: 2 },
    { itemId: "Q3", right: false, pick: [1, 3] },
  ];
  const res = buildResult(assignment, perItem, { name: "Maya R" });
  assert.deepEqual(res.r, [["Q1", 1], ["Q2", 0, 2], ["Q3", 0, [1, 3]]]);
  assert.equal(scoreResult(res).correct, 1);
  assert.equal(scoreResult(res).total, 3);
  const back = await decodeResult(await encodeResult(res));
  delete back.v;
  assert.deepEqual(back, res);
});

test("aggregateResults summarises students and most-wrong questions", () => {
  const bank = Object.fromEntries(POOL.map((i) => [i.id, { ...i, q: `Stem ${i.id}` }]));
  const results = [
    { aid: "a", n: "Maya", d: "2026-11-12", r: [["Q1", 1], ["Q2", 0, 2]] },
    { aid: "a", n: "Sam", d: "2026-11-12", r: [["Q1", 0, 1], ["Q2", 0, 2]] },
  ];
  const agg = aggregateResults(results, bank);
  assert.deepEqual(agg.students.map((s) => s.name), ["Maya", "Sam"]);
  assert.equal(agg.students.find((s) => s.name === "Maya").correct, 1);
  // Q2 wrong by both → top; its most-common pick is index 2 → "c"
  assert.equal(agg.questions[0].itemId, "Q2");
  assert.equal(agg.questions[0].wrong, 2);
  assert.equal(agg.questions[0].picks[0].text, "c");
});

test("ASSIGNABLE_TYPES is the expected set", () => {
  assert.deepEqual(ASSIGNABLE_TYPES, ["choice", "multi", "match", "gap"]);
});
