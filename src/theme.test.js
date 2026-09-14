import { test } from "node:test";
import assert from "node:assert/strict";
import { PALETTES, paletteFor, DEFAULT_SETTINGS } from "./theme.js";

test("light and dark palettes expose the same token keys", () => {
  const dk = Object.keys(PALETTES.dark).sort();
  const lt = Object.keys(PALETTES.light).sort();
  assert.deepEqual(lt, dk, "same keys in both themes");
  assert.ok(dk.includes("bg0") && dk.includes("foam") && dk.includes("accent"));
});

test("toggling theme actually switches the tokens", () => {
  // page background and primary text must differ between themes
  assert.notEqual(PALETTES.dark.bg1, PALETTES.light.bg1);
  assert.notEqual(PALETTES.dark.foam, PALETTES.light.foam);
  // dual-role keys deliberately stay stable so on-accent ink keeps reading
  assert.equal(PALETTES.dark.abyss, PALETTES.light.abyss);
  assert.equal(PALETTES.dark.glow, PALETTES.light.glow);
});

test("paletteFor falls back to dark for an unknown theme", () => {
  assert.equal(paletteFor("light"), PALETTES.light);
  assert.equal(paletteFor("dark"), PALETTES.dark);
  assert.equal(paletteFor("nonsense"), PALETTES.dark);
  assert.equal(paletteFor(undefined), PALETTES.dark);
});

test("default settings are dark + immediate feedback", () => {
  assert.equal(DEFAULT_SETTINGS.theme, "dark");
  assert.equal(DEFAULT_SETTINGS.feedback, "immediate");
});
