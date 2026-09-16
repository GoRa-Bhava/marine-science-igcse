import { test } from "node:test";
import assert from "node:assert/strict";
import {
  NODES, EDGES, foodSources, webState, affectedCount, seabirdSurvivesWithoutHerring,
} from "./foodWeb.js";

test("arrows point eaten -> eater (energy direction) and a chain starts with the producer", () => {
  // Diatoms are the producer and are only ever the eaten (source), never the eater.
  const eatenIds = new Set(EDGES.map(([prey]) => prey));
  const eaterIds = new Set(EDGES.map(([, eater]) => eater));
  assert.ok(eatenIds.has("diatoms"), "diatoms are eaten (base of chains)");
  assert.ok(!eaterIds.has("diatoms"), "the producer never eats anything");
  // Every node except the producer has at least one food source.
  for (const n of NODES) {
    if (n.role === "producer") assert.equal(foodSources(n.id).length, 0, "producer has no food source");
    else assert.ok(foodSources(n.id).length >= 1, `${n.id} eats something`);
  }
});

test("removing the producer fades every animal in the web", () => {
  const state = webState(["diatoms"]);
  for (const n of NODES) {
    if (n.id === "diatoms") assert.equal(state[n.id], "removed");
    else assert.equal(state[n.id], "declined", `${n.id} declines without the producer`);
  }
  assert.equal(affectedCount(["diatoms"]), NODES.length - 1);
});

test("removing herring fades the seal but not the seabird (buffered by crabs)", () => {
  const state = webState(["herring"]);
  assert.equal(state.herring, "removed");
  assert.equal(state.seal, "declined", "seal ate only herring");
  assert.equal(state.seabird, "lit", "seabird still eats crabs");
  // Nothing below herring is affected.
  assert.equal(state.zooplankton, "lit");
  assert.equal(state.diatoms, "lit");
  assert.equal(affectedCount(["herring"]), 1);
});

test("removing crab leaves the seabird lit and mussels (below it) unaffected", () => {
  const state = webState(["crab"]);
  assert.equal(state.crab, "removed");
  assert.equal(state.seabird, "lit", "seabird still eats herring");
  assert.equal(state.mussels, "lit", "mussels are below the crab");
  assert.equal(affectedCount(["crab"]), 0);
});

test("removing a top predator affects nothing (no booming, no cascade)", () => {
  assert.equal(affectedCount(["seal"]), 0);
  assert.equal(affectedCount(["seabird"]), 0);
});

test("self-check: the seabird survives when the herring is removed", () => {
  assert.equal(seabirdSurvivesWithoutHerring(), true);
});
