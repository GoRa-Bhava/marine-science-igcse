import { test } from "node:test";
import assert from "node:assert/strict";
import { LAB_ITEMS } from "./labItems.js";
import { INTERACTIVES } from "./interactivesRegistry.js";

test("lab menu = the packaged interactives (registry order) plus native greenhouse", () => {
  assert.equal(LAB_ITEMS.length, INTERACTIVES.length + 1);
  const keys = LAB_ITEMS.map((i) => i.key);
  assert.equal(new Set(keys).size, keys.length, "keys are unique");
  assert.deepEqual(keys.slice(0, INTERACTIVES.length), INTERACTIVES.map((i) => i.slug), "registry order preserved");
  assert.equal(keys[keys.length - 1], "greenhouse", "greenhouse lands last");
});

test("every lab item has a unit-labelled label and a valid kind", () => {
  for (const it of LAB_ITEMS) {
    assert.ok(typeof it.label === "string" && it.label.length > 0, `${it.key} has a label`);
    assert.match(it.label, /Unit/i, `${it.key} names its unit`);
    assert.ok(it.kind === "embed" || it.kind === "native", `${it.key} has a kind`);
  }
});

test("the nine packaged items are embeds; greenhouse is native", () => {
  for (const it of LAB_ITEMS) {
    if (it.key === "greenhouse") assert.equal(it.kind, "native");
    else assert.equal(it.kind, "embed", `${it.key} is an iframe embed`);
  }
});
