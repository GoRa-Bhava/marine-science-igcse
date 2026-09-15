import { test } from "node:test";
import assert from "node:assert/strict";
import {
  organismState, waterHeight, underStress, isExposed,
  ANEMONE_DRIES_BELOW, MUSSEL_PREDATED_ABOVE, ORGANISMS, FACTORS, FORBIDDEN_FACTORS,
} from "./rockyShore.js";

test("an organism above the tide line reads exposed, below reads submerged", () => {
  // mussel sits low: exposed at low tide, submerged at high tide
  assert.equal(isExposed("mussel", 0), true);
  assert.equal(isExposed("mussel", 100), false);
  // limpet sits high: exposed at low tide
  assert.equal(isExposed("limpet", 0), true);
  // exposed matches the geometry
  const w = waterHeight(50);
  for (const o of ORGANISMS) {
    if (o.id === "starfish") continue;
    assert.equal(organismState(o.id, 50).exposed, o.height > w, `${o.id} exposed vs geometry`);
  }
});

test("anemone dries out below its threshold; mussel is predated above its threshold", () => {
  assert.equal(organismState("anemone", ANEMONE_DRIES_BELOW - 1).stressed, true);
  assert.equal(organismState("anemone", ANEMONE_DRIES_BELOW).stressed, false);
  assert.equal(organismState("anemone", 100).stressed, false);
  assert.equal(organismState("mussel", MUSSEL_PREDATED_ABOVE).stressed, true);
  assert.equal(organismState("mussel", MUSSEL_PREDATED_ABOVE - 1).stressed, false);
  assert.equal(organismState("mussel", 0).stressed, false);
  // both extremes stress exactly one organism; mid-shore stresses none
  assert.equal(underStress(0), 1);
  assert.equal(underStress(50), 0);
  assert.equal(underStress(100), 1);
});

test("only allowed rocky-shore factors appear; forbidden ones never do", () => {
  for (const f of FORBIDDEN_FACTORS) assert.ok(!FACTORS.includes(f), `${f} must not be a factor`);
  // no organism note mentions a forbidden factor or competition
  const notes = [];
  for (let t = 0; t <= 100; t += 5) for (const o of ORGANISMS) notes.push(organismState(o.id, t).note.toLowerCase());
  const blob = notes.join(" | ");
  for (const bad of ["salinity", "light", "ph", "competition"]) assert.ok(!blob.includes(bad), `note must not mention ${bad}`);
});
