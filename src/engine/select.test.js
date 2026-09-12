import { test } from "node:test";
import assert from "node:assert/strict";
import { selectForLesson, familyFilter, rotateDue } from "./select.js";

const NOW = new Date("2026-09-12T10:00:00Z");
const DUE = "2026-09-01";       // in the past -> due
const AHEAD = "2026-12-01";     // future -> not due

// a due record, optionally with a last_review for rotation
const dueRec = (lastReview) => ({ seen: true, due: DUE, fsrs: { stability: 8, last_review: lastReview } });
const freshRec = undefined;     // unseen -> not in progress
const item = (id, family) => (family ? { id, topic: "t", type: "choice", family } : { id, topic: "t", type: "choice" });
const prog = (entries) => ({ items: Object.fromEntries(entries) });
const ids = (arr) => arr.map((i) => i.id);

test("only one member of a 3-member family is served while other items can fill the lesson", () => {
  const cands = [item("a1", "fam"), item("a2", "fam"), item("a3", "fam"),
    item("s1"), item("s2"), item("s3"), item("s4"), item("s5"), item("s6"), item("s7")];
  const progress = prog([["a1", dueRec("2026-09-05")], ["a2", dueRec("2026-09-06")], ["a3", dueRec("2026-09-07")],
    ...["s1","s2","s3","s4","s5","s6","s7"].map((id) => [id, dueRec()])]);
  const out = selectForLesson(cands, 7, progress, NOW);
  assert.equal(out.length, 7);
  assert.equal(out.filter((i) => i.family === "fam").length, 1);
});

test("a small single-family topic fills the lesson instead of collapsing", () => {
  // 2 items, both one family -> a 2-item lesson (the reported Earth-in-space case)
  const two = [item("a1", "fam"), item("a2", "fam")];
  const p2 = prog([["a1", dueRec("2026-09-05")], ["a2", dueRec("2026-09-06")]]);
  const out2 = selectForLesson(two, 7, p2, NOW);
  assert.equal(out2.length, 2);
  assert.deepEqual(ids(out2).sort(), ["a1", "a2"]);

  // 3 items, all one family, nothing else -> all three (backfill), rotation order
  const three = [item("b1", "fam"), item("b2", "fam"), item("b3", "fam")];
  const p3 = prog([["b1", dueRec("2026-09-10")], ["b2", dueRec("2026-09-02")], ["b3", dueRec("2026-09-06")]]);
  const out3 = selectForLesson(three, 7, p3, NOW);
  assert.equal(out3.length, 3);
  assert.equal(out3[0].id, "b2");   // least-recently-reviewed leads (rotation), then backfill
});

test("family-less items are never excluded", () => {
  const cands = [item("s1"), item("s2"), item("s3"), item("s4")];
  const progress = prog([["s1", dueRec()], ["s2", dueRec()]]);   // s1,s2 due; s3,s4 fresh
  const out = selectForLesson(cands, 7, progress, NOW);
  assert.deepEqual(ids(out).sort(), ["s1", "s2", "s3", "s4"]);
});

test("a due member beats a fresh sibling for the family's slot", () => {
  const cands = [item("d", "fam"), item("f", "fam")];  // d due, f fresh
  const progress = prog([["d", dueRec("2026-09-05")]]);
  // Both are served (soft cap backfills), but the due one leads.
  const out = selectForLesson(cands, 7, progress, NOW);
  assert.equal(out[0].id, "d");
  const out2 = selectForLesson([item("f", "fam"), item("d", "fam")], 7, progress, NOW);
  assert.equal(out2[0].id, "d");
});

test("rotation serves the least-recently-reviewed due member, and alternates", () => {
  const cands = [item("x1", "fam"), item("x2", "fam")];
  // x1 reviewed more recently than x2 -> x2 (older) should be served
  let progress = prog([["x1", dueRec("2026-09-10")], ["x2", dueRec("2026-09-02")]]);
  let out = selectForLesson(cands, 7, progress, NOW);
  assert.equal(out[0].id, "x2");

  // simulate: x2 was just reviewed (now the most recent); x1 still due and older
  progress = prog([["x1", dueRec("2026-09-02")], ["x2", dueRec("2026-09-11")]]);
  out = selectForLesson(cands, 7, progress, NOW);
  assert.equal(out[0].id, "x1");   // the leading member alternated
});

test("a missing last_review counts as oldest and is served first", () => {
  const cands = [item("m1", "fam"), item("m2", "fam")];
  const progress = prog([["m1", dueRec("2026-09-05")], ["m2", dueRec(undefined)]]);
  const out = selectForLesson(cands, 7, progress, NOW);
  assert.equal(out[0].id, "m2");
});

test("a skipped duplicate does not shrink the lesson", () => {
  // fam has 2 due members; plus 6 singletons -> a full 7 should still be reached
  const cands = [
    item("a1", "fam"), item("a2", "fam"),
    item("s1"), item("s2"), item("s3"), item("s4"), item("s5"), item("s6"),
  ];
  const progress = prog([
    ["a1", dueRec("2026-09-05")], ["a2", dueRec("2026-09-06")],
    ["s1", dueRec()], ["s2", dueRec()], ["s3", dueRec()],
    ["s4", dueRec()], ["s5", dueRec()], ["s6", dueRec()],
  ]);
  const out = selectForLesson(cands, 7, progress, NOW);
  assert.equal(out.length, 7);
  const famCount = out.filter((i) => i.family === "fam").length;
  assert.equal(famCount, 1);
});

test("cap at size is honoured", () => {
  const cands = Array.from({ length: 12 }, (_, i) => item("q" + i));
  const progress = prog(cands.map((c) => [c.id, dueRec()]));
  assert.equal(selectForLesson(cands, 7, progress, NOW).length, 7);
});

test("familyFilter keeps first of each family and all singletons", () => {
  const out = familyFilter([item("a", "f1"), item("b", "f1"), item("c"), item("d", "f2"), item("e")], 10);
  assert.deepEqual(ids(out), ["a", "c", "d", "e"]);
});

test("rotateDue keeps families at their anchor position, oldest member first", () => {
  const due = [item("a1", "fam"), item("s"), item("a2", "fam")];
  const progress = prog([["a1", dueRec("2026-09-10")], ["s", dueRec()], ["a2", dueRec("2026-09-02")]]);
  // a2 is older, so it should lead the family cluster anchored at index 0; s stays after
  assert.deepEqual(ids(rotateDue(due, progress)), ["a2", "a1", "s"]);
});
