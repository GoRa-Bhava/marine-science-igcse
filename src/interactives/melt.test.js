import { test } from "node:test";
import assert from "node:assert/strict";
import { floatingLevel, landLevel, raisesSea } from "./melt.js";

test("the floating tank's water level is constant across the whole melt", () => {
  const base = floatingLevel(0);
  for (let m = 0; m <= 100; m += 5) assert.equal(floatingLevel(m), base);
});

test("the land tank's water level increases monotonically with melt", () => {
  for (let m = 0; m < 100; m += 5) {
    assert.ok(landLevel(m + 5) > landLevel(m), `land level rises ${m}->${m + 5}`);
  }
});

test("both tanks start equal; at full melt land is higher than floating", () => {
  assert.equal(landLevel(0), floatingLevel(0));
  assert.ok(landLevel(100) > floatingLevel(100));
});

test("self-check: land ice raises the sea, floating ice does not", () => {
  assert.equal(raisesSea("land"), true);
  assert.equal(raisesSea("floating"), false);
});
