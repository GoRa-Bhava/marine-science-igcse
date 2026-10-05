import { test } from "node:test";
import assert from "node:assert/strict";
import { buildMixedSession } from "./mixed.js";
import { answer } from "./scheduler.js";

// Topic map for a tiny bank: ids a1,a2 (topic A), b1,b2 (topic B), c1 (topic C)...
const FLAT = ["a1", "b1", "a2", "b2", "c1", "c2", "a3", "b3"];
const topicOf = (id) => id[0]; // first char = topic

test("brand-new user: session is all new items, full, no repeats, interleaved", () => {
  const s = buildMixedSession(FLAT, {}, topicOf, 5, new Date("2026-10-06"));
  assert.equal(s.length, 5, "fills to size with new items");
  assert.equal(new Set(s).size, 5, "no item twice");
  // topic interleave: first three should span different topics, not a1,a2,a3
  assert.notDeepEqual(s.slice(0, 3), ["a1", "a2", "a3"], "topics interleaved, not stacked");
});

test("due items come first (oldest-due first), then new fill", () => {
  const now = new Date("2026-10-10");
  const srMap = {
    a1: { seen: true, due: "2026-10-08" },           // overdue (older)
    b1: { seen: true, due: "2026-10-10" },           // due today (newer)
    c1: { seen: true, due: "2026-10-20" },           // not due → excluded
  };
  const s = buildMixedSession(FLAT, srMap, topicOf, 5, now);
  // a1 and b1 are due; c1 is not due and must not appear
  assert.ok(!s.includes("c1"), "not-due scheduled item is held back");
  assert.ok(s.indexOf("a1") < s.indexOf(s.find((x) => !srMap[x])), "due before new");
  // oldest-due (a1, 10-08) before b1 (10-10) — both topic-distinct so interleave keeps due order
  assert.ok(s.indexOf("a1") < s.indexOf("b1"), "oldest-due first");
  // the rest are new fill
  assert.equal(s.length, 5);
  assert.equal(new Set(s).size, 5);
});

test("a day with nothing due runs entirely on new items; never empty", () => {
  const now = new Date("2026-10-10");
  const srMap = { a1: { seen: true, due: "2026-11-01" }, b1: { seen: true, due: "2026-11-02" } };
  const s = buildMixedSession(FLAT, srMap, topicOf, 4, now);
  assert.equal(s.length, 4);
  assert.ok(!s.includes("a1") && !s.includes("b1"), "scheduled-but-not-due excluded");
  assert.ok(s.every((id) => !srMap[id]), "all new items");
});

test("an item answered today (via scheduler.answer) is not due today, so it's excluded", () => {
  const now = new Date("2026-10-06");
  const rec = answer(undefined, true, now); // correct first answer → due >= tomorrow
  const srMap = { a1: rec };
  const s = buildMixedSession(["a1", "b1"], srMap, topicOf, 5, now);
  assert.ok(!s.includes("a1"), "just-answered item does not recur the same day");
  assert.ok(s.includes("b1"), "a fresh item still appears");
});

test("size cap is respected; due beyond size still bounds the session", () => {
  const now = new Date("2026-10-10");
  const srMap = {}; for (const id of FLAT) srMap[id] = { seen: true, due: "2026-10-01" };
  const s = buildMixedSession(FLAT, srMap, topicOf, 3, now);
  assert.equal(s.length, 3, "capped at size even when more are due");
  assert.equal(new Set(s).size, 3);
});
