import { test } from "node:test";
import assert from "node:assert/strict";
import {
  restorePlan, shouldHighlight, makeMemory, cssEscape, HIGHLIGHT_MS,
} from "./scrollRestore.core.js";

test("restorePlan returns to the exact saved position when it still fits", () => {
  // Scrolled to 1400px in a list whose max scroll is still 3000px → go straight back.
  const plan = restorePlan(1400, 3000);
  assert.equal(plan.mode, "top");
  assert.equal(plan.top, 1400);
});

test("restorePlan tolerates sub-pixel rounding at the very bottom", () => {
  // Saved offset a hair beyond the measured max (fractional scrollHeight) still counts.
  assert.equal(restorePlan(2000.4, 2000).mode, "top");
  assert.equal(restorePlan(2002, 2000).mode, "item"); // genuinely past the end → fall back
});

test("restorePlan falls back to the opened item when the list is now shorter", () => {
  // The saved offset (1400) no longer exists because the list collapsed to 400px tall.
  const plan = restorePlan(1400, 400);
  assert.equal(plan.mode, "item");
  assert.equal(plan.top, undefined);
});

test("restorePlan never asks to scroll past the top (negative max clamps to 0)", () => {
  assert.deepEqual(restorePlan(0, -50), { mode: "top", top: 0 });
});

test("the highlight shows only with an item id and motion allowed", () => {
  assert.equal(shouldHighlight("prac-tides", false), true);
  assert.equal(shouldHighlight("prac-tides", true), false, "reduced motion → no highlight");
  assert.equal(shouldHighlight(null, false), false, "no item → no highlight");
  assert.equal(shouldHighlight(undefined, false), false);
});

test("the highlight lasts about a second", () => {
  assert.equal(HIGHLIGHT_MS, 1000);
});

test("memory keys each list independently, so filters/units never clobber each other", () => {
  const mem = makeMemory();
  mem.save("writing", 1200, "w40");
  mem.save("writing:unit3", 300, "w-u3-2");
  assert.equal(mem.peek("writing"), true);
  assert.equal(mem.peek("practicals"), false, "an untouched list has nothing to restore");

  // Returning to one filter restores its own place and leaves the other intact.
  const back = mem.take("writing");
  assert.deepEqual(back, { top: 1200, itemId: "w40" });
  assert.equal(mem.peek("writing"), false, "consumed exactly once");
  assert.equal(mem.peek("writing:unit3"), true);
  assert.deepEqual(mem.take("writing:unit3"), { top: 300, itemId: "w-u3-2" });
});

test("memory take() is a one-shot: a second return has nothing pending (fresh = top)", () => {
  const mem = makeMemory();
  mem.save("practicals", 900, "p7");
  assert.ok(mem.take("practicals"));
  assert.equal(mem.take("practicals"), undefined, "nothing left to restore the next time");
  assert.equal(mem.peek("practicals"), false);
});

test("cssEscape makes an id safe inside a [data-restore-item=\"…\"] selector", () => {
  // Ids are plain slugs today, but a quote/backslash must never break the selector.
  const out = cssEscape('a"b\\c');
  assert.ok(!/(?<!\\)"/.test(out), "no unescaped double-quote");
  assert.equal(typeof out, "string");
  assert.equal(cssEscape("prac-tides"), "prac-tides");
});
