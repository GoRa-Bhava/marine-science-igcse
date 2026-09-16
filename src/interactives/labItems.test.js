import { test } from "node:test";
import assert from "node:assert/strict";
import { LAB_ITEMS } from "./labItems.js";

test("every lab item has a unique key and a concept+unit label", () => {
  assert.ok(LAB_ITEMS.length >= 5, "at least the five interactives");
  const keys = LAB_ITEMS.map((i) => i.key);
  assert.equal(new Set(keys).size, keys.length, "keys are unique");
  for (const it of LAB_ITEMS) {
    assert.ok(typeof it.label === "string" && it.label.length > 0, `${it.key} has a label`);
    assert.match(it.label, /Unit/i, `${it.key} label names its unit(s)`);
  }
});

test("the menu order matches the brief", () => {
  assert.deepEqual(LAB_ITEMS.map((i) => i.key), ["tides", "depth", "melt", "estuary", "rocky", "foodweb"]);
});
