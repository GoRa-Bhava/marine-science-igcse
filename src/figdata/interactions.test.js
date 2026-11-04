import { test } from "node:test";
import assert from "node:assert/strict";
import { applyTap, orderAdd, orderRemove } from "./interactions.js";

test("applyTap single-select replaces; re-tapping clears", () => {
  assert.deepEqual(applyTap(null, "a", false), ["a"]);
  assert.deepEqual(applyTap(["a"], "b", false), ["b"], "single select replaces");
  assert.deepEqual(applyTap(["a"], "a", false), [], "re-tap deselects");
});

test("applyTap multi-select adds and removes", () => {
  assert.deepEqual(applyTap([], "a", true), ["a"]);
  assert.deepEqual(applyTap(["a"], "b", true), ["a", "b"], "adds");
  assert.deepEqual(applyTap(["a", "b"], "a", true), ["b"], "removes the tapped one");
});

test("applyTap does not mutate its input", () => {
  const before = ["a"];
  applyTap(before, "b", true);
  assert.deepEqual(before, ["a"], "input unchanged");
});

test("orderAdd appends; orderRemove removes by position", () => {
  assert.deepEqual(orderAdd([], 2), [2]);
  assert.deepEqual(orderAdd([2], 0), [2, 0]);
  assert.deepEqual(orderRemove([2, 0, 1], 1), [2, 1], "removes the middle chip");
  const before = [2, 0];
  orderRemove(before, 0);
  assert.deepEqual(before, [2, 0], "orderRemove does not mutate input");
});
