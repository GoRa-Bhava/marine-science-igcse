import { test } from "node:test";
import assert from "node:assert/strict";
import {
  lightPercent, pressureAtm, temperatureC, oxygenLevel, zoneName, belowSunlightZone, SUNLIGHT_ZONE,
} from "./depth.js";

test("light decreases and pressure increases with depth", () => {
  for (const [a, b] of [[0, 200], [200, 1000], [1000, 1200]]) {
    assert.ok(lightPercent(a) > lightPercent(b), `light falls ${a}->${b}`);
    assert.ok(pressureAtm(a) < pressureAtm(b), `pressure rises ${a}->${b}`);
  }
  assert.ok(lightPercent(1000) < 1, "almost no light by 1000 m");
});

test("temperature and dissolved oxygen fall with depth", () => {
  for (const [a, b] of [[0, 250], [250, 600], [600, 1200]]) {
    assert.ok(temperatureC(a) > temperatureC(b), `temp falls ${a}->${b}`);
    assert.ok(oxygenLevel(a) > oxygenLevel(b), `oxygen falls ${a}->${b}`);
  }
  assert.ok(temperatureC(1200) < 6, "deep water is cold");
});

test("pressure is 1 atm at the surface and ~11 atm at 100 m", () => {
  assert.equal(pressureAtm(0), 1);
  assert.ok(Math.abs(pressureAtm(100) - 11) < 1e-9);
});

test("zones and the sunlight-zone self-check use the 200/1000 m boundaries", () => {
  assert.equal(zoneName(0), "Sunlight zone");
  assert.equal(zoneName(200), "Sunlight zone");
  assert.equal(zoneName(600), "Twilight zone");
  assert.equal(zoneName(1200), "Midnight zone");
  assert.equal(belowSunlightZone(SUNLIGHT_ZONE), false);
  assert.equal(belowSunlightZone(SUNLIGHT_ZONE + 1), true);
});
