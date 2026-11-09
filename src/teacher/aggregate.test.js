import { test } from "node:test";
import assert from "node:assert/strict";
import {
  cellState,
  heatmap,
  classWeakestTopics,
  topMisconceptions,
  writingInsight,
  lessonStarterItems,
  studentsToCsv,
} from "./aggregate.js";

function student(name, report, classCode = "10B") {
  return { name, classCode, addedAt: "2026-11-01", report: { v: 1, app: "0697", n: name, c: classCode, d: "2026-11-08", u: {}, tp: {}, mp: [], w: {}, ...report } };
}

// ---- cellState thresholds ----
test("cellState bands: green/amber/red/grey", () => {
  assert.equal(cellState(90), "green");
  assert.equal(cellState(75), "green");
  assert.equal(cellState(74), "amber");
  assert.equal(cellState(50), "amber");
  assert.equal(cellState(49), "red");
  assert.equal(cellState(0), "red");
  assert.equal(cellState(null), "grey");
});

// ---- heatmap ----
test("heatmap computes % correct per unit and collects unit columns", () => {
  const students = [
    student("Maya", { u: { 1: [10, 20, 8], 2: [4, 10, 1] } }),
    student("Sam", { u: { 1: [5, 20, 5], 3: [2, 8, 0] } }),
  ];
  const hm = heatmap(students);
  assert.deepEqual(hm.units, ["1", "2", "3"]);
  const maya = hm.rows.find((r) => r.name === "Maya");
  assert.equal(maya.cells["1"].pct, 80); // 8/10
  assert.equal(maya.cells["1"].state, "green");
  assert.equal(maya.cells["2"].pct, 25); // 1/4
  assert.equal(maya.cells["2"].state, "red");
  const sam = hm.rows.find((r) => r.name === "Sam");
  assert.equal(sam.cells["1"].pct, 100);
  assert.equal(sam.cells["3"].pct, 0);
  assert.equal(sam.cells["2"], undefined); // not attempted → no cell (grey)
});

// ---- weakest topics ----
test("classWeakestTopics aggregates and orders weakest first", () => {
  const students = [
    student("A", { tp: { tides: [10, 2], cells: [4, 4] } }),
    student("B", { tp: { tides: [10, 3], cells: [6, 5] } }),
  ];
  const meta = { tides: { name: "Tides", unit: 1 }, cells: { name: "Cells", unit: 3 } };
  const weak = classWeakestTopics(students, meta);
  assert.equal(weak[0].topicId, "tides"); // 5/20 = 0.25 vs cells 9/10 = 0.9
  assert.equal(weak[0].name, "Tides");
  assert.equal(weak[0].attempts, 20);
  assert.equal(weak[0].correct, 5);
  assert.ok(Math.abs(weak[0].accuracy - 0.25) < 1e-9);
  assert.equal(weak[1].topicId, "cells");
});

test("classWeakestTopics respects minAttempts", () => {
  const students = [student("A", { tp: { rare: [1, 0], common: [20, 10] } })];
  const weak = classWeakestTopics(students, {}, { minAttempts: 5 });
  assert.deepEqual(weak.map((w) => w.topicId), ["common"]);
});

// ---- misconceptions ----
const BANK = {
  Q1: { q: "Why is the sea salty?", options: ["Rivers carry dissolved salts", "Fish make salt", "Rain is salty", "The sky"], why: "Rivers…", topic: "sea", unit: 2 },
  Q2: { q: "Pick the producers", options: ["Phytoplankton", "Tuna", "Seagrass", "Crab"], why: "Producers…", topic: "food", unit: 4 },
};

test("topMisconceptions groups picks, resolves option text, counts N of M", () => {
  const students = [
    student("A", { mp: [["Q1", 1]] }),
    student("B", { mp: [["Q1", 1], ["Q2", [1, 3]]] }),
    student("C", { mp: [["Q1", 2]] }),
  ];
  const top = topMisconceptions(students, BANK, {});
  // Q1 pick 1 chosen by A,B → n=2 (top); Q1 pick 2 by C → n=1; Q2 multi by B → n=1
  assert.equal(top[0].itemId, "Q1");
  assert.equal(top[0].pick, 1);
  assert.equal(top[0].n, 2);
  assert.equal(top[0].total, 3);
  assert.equal(top[0].optionText, "Fish make salt");
  const multi = top.find((t) => t.itemId === "Q2");
  assert.equal(multi.optionText, "Tuna + Crab"); // indices 1 and 3
});

test("topMisconceptions filters by unit and skips items missing from the bank", () => {
  const students = [
    student("A", { mp: [["Q1", 1], ["GONE", 0], ["Q2", 1]] }),
  ];
  const u2 = topMisconceptions(students, BANK, {}, { unit: 2 });
  assert.deepEqual(u2.map((t) => t.itemId), ["Q1"]); // Q2 is unit 4, GONE missing
});

// ---- writing insight ----
const WB = {
  W1: { q: "Explain tides", command: "Explain", marks: 4, points: [{ t: "Moon gravity" }, { t: "Sun adds" }, { t: "Alignment" }, { t: "Range" }] },
};

test("writingInsight averages scores and ranks most-missed points", () => {
  const students = [
    student("A", { w: { W1: [2, 4, [0, 1]] } }), // missed points 2,3
    student("B", { w: { W1: [1, 4, [0]] } }), // missed points 1,2,3
  ];
  const ins = writingInsight(students, WB);
  const q = ins.questions[0];
  assert.equal(q.qid, "W1");
  assert.equal(q.attempts, 2);
  assert.equal(q.avgScore, 1.5);
  assert.equal(q.avgPct, 38); // 1.5/4
  // point 2 ("Alignment") and point 3 ("Range") missed by both → missed=2
  const top = ins.missedPoints[0];
  assert.equal(top.missed, 2);
  assert.ok(["Alignment", "Range"].includes(top.text));
});

// ---- lesson starter ----
test("lessonStarterItems picks from weakest topics, deterministically", () => {
  const students = [student("A", { tp: { tides: [10, 1], cells: [10, 9] } })];
  const meta = { tides: { name: "Tides", unit: 1 }, cells: { name: "Cells", unit: 3 } };
  const itemById = {
    T1: { id: "T1", topic: "tides", q: "Q about tides", qRecall: "Recall tides", options: ["a"], a: 0, why: "" },
    T2: { id: "T2", topic: "tides", q: "Q2 tides", qRecall: "Recall tides 2", options: ["a"], a: 0, why: "" },
    C1: { id: "C1", topic: "cells", q: "Q cells", qRecall: "Recall cells", options: ["a"], a: 0, why: "" },
  };
  const a = lessonStarterItems(students, itemById, meta, { n: 2, seed: 7 });
  const b = lessonStarterItems(students, itemById, meta, { n: 2, seed: 7 });
  assert.deepEqual(a.map((x) => x.id), b.map((x) => x.id)); // deterministic
  assert.equal(a[0].topic, "tides"); // weakest topic first
  assert.ok(a.length <= 2);
});

// ---- CSV ----
test("studentsToCsv emits a header and per-student unit percentages", () => {
  const students = [student("Maya, J", { u: { 1: [10, 20, 8], 2: [4, 10, 1] } })];
  const csv = studentsToCsv(students, { unitIds: ["1", "2"] });
  const lines = csv.split("\n");
  assert.equal(lines[0], "Name,Class,Updated,Unit 1 %,Unit 2 %");
  assert.equal(lines[1], '"Maya, J",10B,2026-11-08,80,25'); // name quoted (has comma)
});
