import { test } from "node:test";
import assert from "node:assert/strict";
import {
  LUNAR_TIDE,
  QUICK_CHECK_TOLERANCE,
  SOLAR_TIDE,
  isTideTarget,
  tidalRange,
  tideLabel,
} from "./tides.js";

test("tidal range is greatest at new/full Moon and least at quarter Moon", () => {
  const maximum = LUNAR_TIDE + SOLAR_TIDE;
  const minimum = LUNAR_TIDE - SOLAR_TIDE;
  assert.ok(Math.abs(tidalRange(0) - maximum) < 1e-12);
  assert.ok(Math.abs(tidalRange(180) - maximum) < 1e-12);
  assert.ok(Math.abs(tidalRange(90) - minimum) < 1e-12);
  assert.ok(Math.abs(tidalRange(270) - minimum) < 1e-12);
});

test("tide labels identify spring, neap and intermediate positions", () => {
  assert.equal(tideLabel(0), "Spring tide");
  assert.equal(tideLabel(180), "Spring tide");
  assert.equal(tideLabel(90), "Neap tide");
  assert.equal(tideLabel(270), "Neap tide");
  assert.equal(tideLabel(45), "Between spring and neap");
});

test("quick checks accept positions within 15 degrees of either valid alignment", () => {
  assert.equal(QUICK_CHECK_TOLERANCE, 15);
  assert.equal(isTideTarget(14.9, "spring"), true);
  assert.equal(isTideTarget(165, "spring"), true);
  assert.equal(isTideTarget(16, "spring"), false);
  assert.equal(isTideTarget(104.9, "neap"), true);
  assert.equal(isTideTarget(285, "neap"), true);
  assert.equal(isTideTarget(106, "neap"), false);
  assert.equal(isTideTarget(90, "unknown"), false);
});
