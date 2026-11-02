import { test } from "node:test";
import assert from "node:assert/strict";
import { buildMixedSession } from "./mixed.js";
import { answer } from "./scheduler.js";

// Topic map for a tiny bank: ids a1,a2,a3 (topic A), b1,b2,b3 (topic B), c1,c2 (topic C).
const FLAT = ["a1", "b1", "a2", "b2", "c1", "c2", "a3", "b3"];
const topicOf = (id) => id[0]; // first char = topic

// Deterministic PRNG so the topic shuffle is reproducible in tests (mulberry32).
function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// No two consecutive items share a topic (holds while every bucket still has
// items left — i.e. before the shorter buckets run out).
const noConsecutiveSameTopic = (s) => s.every((id, i) => i === 0 || topicOf(id) !== topicOf(s[i - 1]));

test("brand-new user: full session of new items, no repeats, topics interleaved", () => {
  const s = buildMixedSession(FLAT, {}, topicOf, 5, new Date("2026-10-06"), mulberry32(1));
  assert.equal(s.length, 5, "fills to size with new items");
  assert.equal(new Set(s).size, 5, "no item twice");
  assert.ok(noConsecutiveSameTopic(s), "topics interleaved, not stacked");
});

test("topic lead order is randomised — not always topic A (Unit 1) first", () => {
  const firstTopics = new Set();
  for (let seed = 1; seed <= 8; seed++) {
    const s = buildMixedSession(FLAT, {}, topicOf, 5, new Date("2026-10-06"), mulberry32(seed));
    firstTopics.add(topicOf(s[0]));
  }
  assert.ok(firstTopics.size > 1, "the leading topic varies across sessions");
});

test("all due items precede all fresh items (due pool shuffled, not ordered)", () => {
  const now = new Date("2026-10-10");
  const srMap = {
    a1: { seen: true, due: "2026-10-07" }, // topic A, due
    a2: { seen: true, due: "2026-10-09" }, // topic A, due
    b1: { seen: true, due: "2026-10-10" }, // topic B, due today
    c1: { seen: true, due: "2026-10-20" }, // not due → excluded
  };
  const s = buildMixedSession(FLAT, srMap, topicOf, 6, now, mulberry32(3));
  assert.ok(!s.includes("c1"), "not-due scheduled item is held back");
  const firstFresh = s.findIndex((x) => !srMap[x]);
  const dueIdx = ["a1", "a2", "b1"].map((id) => s.indexOf(id));
  assert.ok(dueIdx.every((i) => i !== -1 && i < firstFresh), "all due before any fresh");
  assert.equal(new Set(s).size, s.length, "no repeats");
});

test("selection spreads across a topic's range, not just the earliest items", () => {
  const flat = Array.from({ length: 10 }, (_, i) => "a" + (i + 1)); // a1..a10, one topic
  const picked = new Set();
  for (let seed = 1; seed <= 12; seed++) {
    buildMixedSession(flat, {}, () => "A", 3, new Date("2026-10-06"), mulberry32(seed)).forEach((id) => picked.add(id));
  }
  // if it only ever took the first 3 (a1,a2,a3) in book order, this set would be 3
  assert.ok(picked.size > 3, "picks span more than the earliest few questions");
});

test("two different rngs produce different sessions", () => {
  const s1 = buildMixedSession(FLAT, {}, topicOf, 5, new Date("2026-10-06"), mulberry32(1));
  const s2 = buildMixedSession(FLAT, {}, topicOf, 5, new Date("2026-10-06"), mulberry32(2));
  assert.notDeepEqual(s1, s2, "different seeds give a different session");
});

test("a day with nothing due runs entirely on new items; never empty", () => {
  const now = new Date("2026-10-10");
  const srMap = { a1: { seen: true, due: "2026-11-01" }, b1: { seen: true, due: "2026-11-02" } };
  const s = buildMixedSession(FLAT, srMap, topicOf, 4, now, mulberry32(2));
  assert.equal(s.length, 4);
  assert.ok(!s.includes("a1") && !s.includes("b1"), "scheduled-but-not-due excluded");
  assert.ok(s.every((id) => !srMap[id]), "all new items");
});

test("an item answered today (via scheduler.answer) is not due today, so it's excluded", () => {
  const now = new Date("2026-10-06");
  const rec = answer(undefined, true, now); // correct first answer → due >= tomorrow
  const srMap = { a1: rec };
  const s = buildMixedSession(["a1", "b1"], srMap, topicOf, 5, now, mulberry32(1));
  assert.ok(!s.includes("a1"), "just-answered item does not recur the same day");
  assert.ok(s.includes("b1"), "a fresh item still appears");
});

test("size cap is respected; due beyond size still bounds the session", () => {
  const now = new Date("2026-10-10");
  const srMap = {}; for (const id of FLAT) srMap[id] = { seen: true, due: "2026-10-01" };
  const s = buildMixedSession(FLAT, srMap, topicOf, 3, now, mulberry32(5));
  assert.equal(s.length, 3, "capped at size even when more are due");
  assert.equal(new Set(s).size, 3);
});

test("default rng (no seed) still produces a valid, full, non-repeating session", () => {
  const s = buildMixedSession(FLAT, {}, topicOf, 5, new Date("2026-10-06"));
  assert.equal(s.length, 5);
  assert.equal(new Set(s).size, 5);
});
