import { test } from "node:test";
import assert from "node:assert/strict";
import { FLASHCARDS, FLASHCARD_UNITS, flashcardsByUnit } from "./flashcards.js";

test("the flashcard bank is the full flip-only set (front/back, no retrieval)", () => {
  assert.equal(FLASHCARDS.length, 36, "6 cards per unit x 6 units");
  const ids = new Set();
  for (const c of FLASHCARDS) {
    assert.ok(c.id && !ids.has(c.id), `unique id: ${c.id}`); ids.add(c.id);
    assert.ok(typeof c.front === "string" && c.front.length > 0, `${c.id} has a front (term)`);
    assert.ok(typeof c.back === "string" && c.back.length > 0, `${c.id} has a back (definition)`);
    assert.ok(Number.isInteger(c.unit), `${c.id} has a unit`);
    // Flip-only: no graded self-test data.
    assert.equal(c.retrieval, undefined, `${c.id} carries no retrieval/self-test`);
  }
});

test("FLASHCARD_UNITS and flashcardsByUnit partition the deck across units 1–6", () => {
  assert.deepEqual(FLASHCARD_UNITS, [1, 2, 3, 4, 5, 6]);
  const total = FLASHCARD_UNITS.reduce((n, u) => n + flashcardsByUnit(u).length, 0);
  assert.equal(total, FLASHCARDS.length);
});
