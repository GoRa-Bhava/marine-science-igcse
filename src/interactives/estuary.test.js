import { test } from "node:test";
import assert from "node:assert/strict";
import {
  salinityLevel, oxygenLevel, temperatureSwing, saltiest, tideName, HIGH_TIDE, LOW_TIDE,
} from "./estuary.js";

test("salinity and dissolved oxygen increase with tide height", () => {
  for (const [a, b] of [[0, 25], [25, 50], [50, 75], [75, 100]]) {
    assert.ok(salinityLevel(a) < salinityLevel(b), `salinity rises ${a}->${b}`);
    assert.ok(oxygenLevel(a) < oxygenLevel(b), `oxygen rises ${a}->${b}`);
  }
});

test("temperature swing decreases with tide height (steadier at high tide)", () => {
  for (const [a, b] of [[0, 25], [25, 50], [50, 75], [75, 100]]) {
    assert.ok(temperatureSwing(a) > temperatureSwing(b), `swing narrows ${a}->${b}`);
  }
});

test("salinity is higher at high tide than at low tide", () => {
  assert.ok(salinityLevel(100) > salinityLevel(0));
  assert.ok(salinityLevel(HIGH_TIDE) > salinityLevel(LOW_TIDE));
});

test("the saltiest self-check passes only at high tide", () => {
  assert.equal(saltiest(HIGH_TIDE), true);
  assert.equal(saltiest(HIGH_TIDE - 1), false);
  assert.equal(saltiest(0), false);
  assert.equal(tideName(0), "Low tide");
  assert.equal(tideName(100), "High tide");
  assert.equal(tideName(50), "Mid-tide");
});
