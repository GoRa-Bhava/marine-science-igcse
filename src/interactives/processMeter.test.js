import { test } from "node:test";
import assert from "node:assert/strict";
import {
  oxygenLevel, temperatureLevel, currentStageIndex,
  EUTRO_STAGES, GREENHOUSE_STAGES,
  EUTRO_CAPTION, GREENHOUSE_CAPTION, EUTRO_ANSWER, GREENHOUSE_ANSWER,
} from "./processMeter.js";

test("eutrophication oxygen is non-monotonic: peaks mid-run, ends low, end < start", () => {
  const samples = [];
  for (let v = 0; v <= 100; v += 5) samples.push([v, oxygenLevel(v)]);
  const values = samples.map(([, o]) => o);
  const start = oxygenLevel(0);
  const end = oxygenLevel(100);
  const peak = Math.max(...values);
  const peakV = samples[values.indexOf(peak)][0];

  assert.ok(end < start, "oxygen ends lower than it started (the crash)");
  assert.ok(peak > start && peak > end, "there is a mid-run peak above both ends");
  assert.ok(peakV > 10 && peakV < 60, `peak is mid-run (at ${peakV})`);

  // It genuinely rises then falls (not monotonic).
  const rises = values.some((o, i) => i > 0 && o > values[i - 1] + 1e-9);
  const falls = values.some((o, i) => i > 0 && o < values[i - 1] - 1e-9);
  assert.ok(rises && falls, "oxygen both rises and falls across the run");
});

test("greenhouse temperature increases monotonically with emissions", () => {
  for (let v = 0; v < 100; v += 5) {
    assert.ok(temperatureLevel(v + 5) > temperatureLevel(v), `temp rises ${v}->${v + 5}`);
  }
});

test("stage highlighting advances with the driver and never runs past the last stage", () => {
  assert.equal(currentStageIndex(EUTRO_STAGES, 0), 0);
  assert.equal(currentStageIndex(EUTRO_STAGES, 100), EUTRO_STAGES.length - 1);
  assert.equal(currentStageIndex(GREENHOUSE_STAGES, 0), 0);
  assert.equal(currentStageIndex(GREENHOUSE_STAGES, 100), GREENHOUSE_STAGES.length - 1);
  // Monotonic in the driver.
  let prev = -1;
  for (let v = 0; v <= 100; v += 1) {
    const i = currentStageIndex(EUTRO_STAGES, v);
    assert.ok(i >= prev, "stage index never goes backwards");
    prev = i;
  }
});

test("the five eutrophication stages read in order and the caption busts the misconception", () => {
  assert.equal(EUTRO_STAGES.length, 5);
  // Death is tied to decomposition using up oxygen, not toxins/starvation.
  assert.match(EUTRO_STAGES[3].note, /decompos|break down/i);
  assert.match(EUTRO_STAGES[3].note, /oxygen/i);
  assert.match(EUTRO_CAPTION, /rises during the bloom/i);
  assert.match(EUTRO_CAPTION, /use up the oxygen/i);
  assert.equal(EUTRO_ANSWER, "after");
  // Forbidden mechanisms must not appear.
  const text = EUTRO_STAGES.map((s) => `${s.label} ${s.note}`).join(" ") + " " + EUTRO_CAPTION;
  for (const forbidden of [/toxin/i, /dead zone/i, /anaerobic/i, /poison/i]) {
    assert.doesNotMatch(text, forbidden, `eutrophication avoids ${forbidden}`);
  }
});

test("the greenhouse chain traps outgoing heat and never blocks incoming sunlight", () => {
  assert.equal(GREENHOUSE_STAGES.length, 4);
  assert.match(GREENHOUSE_STAGES[1].note, /sunlight still comes in|let/i);
  assert.match(GREENHOUSE_CAPTION, /let the Sun'?s rays in|don'?t block incoming/i);
  assert.match(GREENHOUSE_CAPTION, /radiated back from the surface/i);
  assert.equal(GREENHOUSE_ANSWER, "no");
  const text = GREENHOUSE_STAGES.map((s) => `${s.label} ${s.note}`).join(" ") + " " + GREENHOUSE_CAPTION;
  for (const forbidden of [/water vapour/i, /wavelength/i, /-?18\s*°?c/i, /\+?14\s*°?c/i]) {
    assert.doesNotMatch(text, forbidden, `greenhouse avoids ${forbidden}`);
  }
});
