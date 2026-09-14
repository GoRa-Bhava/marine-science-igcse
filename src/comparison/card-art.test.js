import { test } from "node:test";
import assert from "node:assert/strict";
import { COMPARISON_CARDS } from "./comparison-cards.js";
import { CARD_ART, hasHeroArt } from "./card-art.js";

// The component leads each side with a hero <img> when hasHeroArt(id, side) is
// true, and falls back to the ConceptVisual emblem otherwise. The app has no DOM
// test runner, so these assert the per-side decision that drives that choice
// (equivalent to "renders an <img>" vs "renders the emblem fallback").

test("a side with art resolves to its hero image path; a side without falls back", () => {
  // Positive: every real card+side that has art maps to the expected webp key.
  for (const c of COMPARISON_CARDS) {
    for (const side of ["a", "b"]) {
      if (hasHeroArt(c.id, side)) {
        assert.ok(CARD_ART.has(`${c.id}__${side}`), `${c.id}__${side} in set`);
        // path the component builds for the <img>
        const src = `card-art/${c.id}__${side}.webp`;
        assert.match(src, /^card-art\/[\w-]+__[ab]\.webp$/);
      } else {
        // fallback path still has an emblem to render
        assert.equal(typeof c[side].visualKey, "string", `${c.id}.${side} visualKey`);
        assert.ok(c[side].visualKey.length, `${c.id}.${side} visualKey non-empty`);
      }
    }
  }
});

test("the emblem fallback branch is reachable for an unknown card/side", () => {
  assert.equal(hasHeroArt("cmp-does-not-exist", "a"), false);
  assert.equal(hasHeroArt(COMPARISON_CARDS[0].id, "z"), false);
});

test("every art key names a real card side (no orphan art entries)", () => {
  const validKeys = new Set();
  for (const c of COMPARISON_CARDS) for (const side of ["a", "b"]) validKeys.add(`${c.id}__${side}`);
  for (const key of CARD_ART) assert.ok(validKeys.has(key), `art key ${key} matches a card side`);
});
