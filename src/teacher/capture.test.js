import { test } from "node:test";
import assert from "node:assert/strict";
import { lastPickOf } from "./capture.js";

test("lastPickOf: choice stores the chosen original index", () => {
  assert.equal(lastPickOf("choice", 2), 2);
  assert.equal(lastPickOf("choice", 0), 0);
});

test("lastPickOf: multi stores the sorted array of original indices", () => {
  assert.deepEqual(lastPickOf("multi", [3, 0, 2]), [0, 2, 3]);
  assert.deepEqual(lastPickOf("multi", []), []);
});

test("lastPickOf: other types and bad answers give undefined", () => {
  assert.equal(lastPickOf("gap", "x"), undefined);
  assert.equal(lastPickOf("match", {}), undefined);
  assert.equal(lastPickOf("chain", [1, 2]), undefined);
  assert.equal(lastPickOf("truefalse", true), undefined);
  assert.equal(lastPickOf("choice", null), undefined);
  assert.equal(lastPickOf("choice", -1), undefined);
});
