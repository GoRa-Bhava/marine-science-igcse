import { test } from "node:test";
import assert from "node:assert/strict";
import { shuffleDeck, mixedDeck } from "./order.js";
import { FLASHCARDS } from "./flashcards.js";

// Deterministic PRNG so the tests are reproducible.
function mulberry32(seed) {
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const ids = (deck) => deck.map((c) => c.id);
const sortedIds = (deck) => ids(deck).slice().sort();

test("shuffleDeck returns a permutation (same ids, no loss or duplication)", () => {
  const out = shuffleDeck(FLASHCARDS, mulberry32(1));
  assert.equal(out.length, FLASHCARDS.length);
  assert.deepEqual(sortedIds(out), sortedIds(FLASHCARDS));
  assert.notEqual(out, FLASHCARDS);            // new array
  assert.deepEqual(sortedIds(FLASHCARDS), sortedIds(FLASHCARDS)); // input unchanged order-independent
});

test("shuffleDeck does not mutate its input", () => {
  const before = ids(FLASHCARDS);
  shuffleDeck(FLASHCARDS, mulberry32(7));
  assert.deepEqual(ids(FLASHCARDS), before);
});

test("mixedDeck returns a permutation (same ids, no loss or duplication)", () => {
  const out = mixedDeck(FLASHCARDS, mulberry32(42));
  assert.equal(out.length, FLASHCARDS.length);
  assert.deepEqual(sortedIds(out), sortedIds(FLASHCARDS));
});

test("mixedDeck never puts two same-unit cards next to each other (36-card deck, 6/unit)", () => {
  for (let seed = 0; seed < 100; seed++) {
    const out = mixedDeck(FLASHCARDS, mulberry32(seed));
    for (let i = 1; i < out.length; i++) {
      assert.notEqual(out[i].unit, out[i - 1].unit,
        `seed ${seed}: cards ${i - 1} and ${i} share unit ${out[i].unit}`);
    }
  }
});

test("different seeds give different first cards", () => {
  const a = mixedDeck(FLASHCARDS, mulberry32(1))[0];
  const b = mixedDeck(FLASHCARDS, mulberry32(2))[0];
  assert.notEqual(a.id, b.id);
});

test("over 200 seeds the first card comes from every unit", () => {
  const unitsSeen = new Set();
  for (let seed = 0; seed < 200; seed++) {
    unitsSeen.add(mixedDeck(FLASHCARDS, mulberry32(seed))[0].unit);
  }
  const allUnits = [...new Set(FLASHCARDS.map((c) => c.unit))];
  for (const u of allUnits) assert.ok(unitsSeen.has(u), `no seed started on unit ${u}`);
});

test("mixedDeck handles a lopsided deck without crashing and keeps all cards", () => {
  // One unit with more than half the cards cannot fully avoid adjacency, but the
  // result must still be a complete permutation.
  const deck = [
    { id: "a1", unit: 1 }, { id: "a2", unit: 1 }, { id: "a3", unit: 1 },
    { id: "b1", unit: 2 },
  ];
  const out = mixedDeck(deck, mulberry32(3));
  assert.deepEqual(out.map((c) => c.id).slice().sort(), ["a1", "a2", "a3", "b1"]);
});

test("a single-unit deck round-trips through mixedDeck as a permutation", () => {
  const deck = FLASHCARDS.filter((c) => c.unit === 1);
  const out = mixedDeck(deck, mulberry32(9));
  assert.deepEqual(out.map((c) => c.id).slice().sort(), deck.map((c) => c.id).slice().sort());
});
