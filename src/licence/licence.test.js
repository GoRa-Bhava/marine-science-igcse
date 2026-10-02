import { test } from "node:test";
import assert from "node:assert/strict";
import { isEntitled, isUnlocked, maxProfilesForVariant, tierForVariant, graceExpired, maxProfilesOf, GRACE_MS } from "./licence.js";
import { LICENCE_CONFIG } from "./config.js";

const NOW = 1_000_000_000_000;
const fresh = (over = {}) => ({ key: "K", instanceId: "i", valid: true, maxProfiles: 1, lastValidatedAt: NOW, ...over });

test("isUnlocked: Unit 1 is free with no entitlement; other units need a valid one", () => {
  assert.equal(isUnlocked(1, null, NOW), true, "Unit 1 free");
  assert.equal(isUnlocked(2, null, NOW), false, "Unit 2 locked without entitlement");
  assert.equal(isUnlocked(6, fresh(), NOW), true, "Unit 6 unlocked with a valid entitlement");
});

test("isEntitled honours the 30-day offline grace, then lapses", () => {
  assert.equal(isEntitled(fresh({ lastValidatedAt: NOW - GRACE_MS + 1000 }), NOW), true, "inside grace");
  assert.equal(isEntitled(fresh({ lastValidatedAt: NOW - GRACE_MS - 1000 }), NOW), false, "past grace");
  assert.equal(isEntitled(fresh({ valid: false }), NOW), false, "refunded/disabled → invalid");
  assert.equal(isEntitled(null, NOW), false);
  assert.equal(isEntitled({ key: "", valid: true }, NOW), false, "no key");
});

test("graceExpired flags a valid-but-stale entitlement (soft prompt), not a fresh one", () => {
  assert.equal(graceExpired(fresh(), NOW), false);
  assert.equal(graceExpired(fresh({ lastValidatedAt: NOW - GRACE_MS - 1 }), NOW), true);
  assert.equal(graceExpired(fresh({ valid: false, lastValidatedAt: NOW - GRACE_MS - 1 }), NOW), false, "already invalid, not a grace case");
});

test("variant → tier/maxProfiles (family = 3, single/free = 1)", () => {
  assert.equal(maxProfilesForVariant(LICENCE_CONFIG.variantIdFamily, "Family"), 3);
  assert.equal(tierForVariant(LICENCE_CONFIG.variantIdFamily), "family");
  assert.equal(maxProfilesForVariant(LICENCE_CONFIG.variantIdSingle, "Single"), 1);
  assert.equal(maxProfilesForVariant("anything", "Family Plan"), 3, "matches on variant name too");
  assert.equal(tierForVariant("x", "Single"), "single");
  assert.equal(maxProfilesOf(null), 1, "no entitlement → cap 1");
  assert.equal(maxProfilesOf({ maxProfiles: 3 }), 3);
});
