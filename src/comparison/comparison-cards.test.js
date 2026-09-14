import { test } from "node:test";
import assert from "node:assert/strict";
import { COMPARISON_CARDS, getComparisonCard } from "./comparison-cards.js";

test("there are the 14 cards (Batch 1 + Batch 2), each with a unique id", () => {
  assert.equal(COMPARISON_CARDS.length, 14);
  const ids = COMPARISON_CARDS.map((c) => c.id);
  assert.equal(new Set(ids).size, ids.length);
});

test("every card has the required two-sided shape", () => {
  for (const c of COMPARISON_CARDS) {
    const where = c.id;
    for (const k of ["id", "title", "subtitle", "ref", "memoryHook"]) assert.equal(typeof c[k], "string", `${where}: ${k}`);
    assert.equal(typeof c.unit, "number", `${where}: unit`);
    for (const side of ["a", "b"]) {
      const s = c[side];
      assert.equal(typeof s.name, "string", `${where}.${side}: name`);
      assert.equal(typeof s.kicker, "string", `${where}.${side}: kicker`);
      assert.ok(["teal", "coral"].includes(s.accent), `${where}.${side}: accent`);
    }
    assert.ok(Array.isArray(c.rows) && c.rows.length >= 2, `${where}: rows`);
    for (const r of c.rows) {
      assert.equal(typeof r.label, "string", `${where}: row label`);
      assert.equal(typeof r.a, "string", `${where}: row a`);
      assert.equal(typeof r.b, "string", `${where}: row b`);
    }
  }
});

test("optional sections, when present, are well formed", () => {
  for (const c of COMPARISON_CARDS) {
    for (const side of ["a", "b"]) {
      const s = c[side];
      if (s.equation) assert.ok(Array.isArray(s.equation) && s.equation.length, `${c.id}.${side}: equation`);
      if (s.energyStory) assert.ok(Array.isArray(s.energyStory) && s.energyStory.length, `${c.id}.${side}: energyStory`);
    }
    if (c.quickTest) {
      const q = c.quickTest;
      assert.equal(typeof q.q, "string", `${c.id}: quickTest.q`);
      assert.ok(Array.isArray(q.options) && q.options.length >= 2, `${c.id}: quickTest.options`);
      assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length, `${c.id}: quickTest.answer`);
      assert.equal(typeof q.feedback, "string", `${c.id}: quickTest.feedback`);
    }
  }
});

test("shared rows carry both sides (the BOTH badge case)", () => {
  const shared = COMPARISON_CARDS.flatMap((c) => c.rows.filter((r) => r.shared));
  for (const r of shared) { assert.ok(r.a && r.b, "a shared row still has both values"); }
});

test("getComparisonCard finds by id and returns undefined otherwise", () => {
  assert.equal(getComparisonCard("cmp-resp-photo")?.id, "cmp-resp-photo");
  assert.equal(getComparisonCard("nope"), undefined);
});
