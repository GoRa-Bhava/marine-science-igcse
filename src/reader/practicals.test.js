import { test } from "node:test";
import assert from "node:assert/strict";
import { PRACTICALS, practicalsList, practicalById, practicalItemIds } from "./practicals.js";

const ITEM_TYPES = new Set(["match", "chain", "choice", "multi", "truefalse", "exam", "best", "gap"]);

test("practicals expose the pilot food-tests entry with a full procedure card", () => {
  assert.ok(PRACTICALS.length >= 1, "at least one practical");
  const p = practicalById("P4.1");
  assert.ok(p, "P4.1 present");
  assert.equal(p.ref, "4.1/LO2");
  assert.equal(p.unit, 4);
  assert.match(p.title, /food test/i);
  assert.ok(p.aim && p.tests?.length && p.safety?.length && p.technique?.length, "aim/tests/safety/technique present");
  // Each test is a labelled result; swatch colours are hex.
  for (const t of p.tests) {
    assert.ok(t.nutrient && t.method && t.positive && t.negative, "test has method + results");
    if (t.posColor) assert.match(t.posColor, /^#[0-9a-f]{3,8}$/i);
    if (t.scale) assert.ok(Array.isArray(t.scale) && t.scale.length >= 2, "scale is a colour run");
  }
});

test("practical items are well-formed and helpers resolve them", () => {
  const ids = practicalItemIds("P4.1");
  assert.equal(ids.length, 11, "11 pilot items");
  const seen = new Set();
  for (const it of practicalById("P4.1").items) {
    assert.ok(it.id?.startsWith("P4.1-"), `namespaced id: ${it.id}`);
    assert.ok(!seen.has(it.id), `unique id: ${it.id}`); seen.add(it.id);
    assert.ok(ITEM_TYPES.has(it.type), `known item type: ${it.type}`);
    assert.equal(it.status, "human_review", `${it.id} awaits vetting`);
  }
  assert.deepEqual(practicalItemIds("nope"), [], "unknown id → no items");
  assert.equal(practicalById("nope"), null);
  assert.equal(practicalsList().length, PRACTICALS.length);
});
