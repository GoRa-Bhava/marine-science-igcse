import { test } from "node:test";
import assert from "node:assert/strict";
import { FIG_TEMPLATES } from "./index.js";
import { parseNum, fmt } from "./core.js";
import { checkTemplate } from "./invariants.js";

/* Generic invariants for every Figures & data template (see invariants.js), plus a template's own selfTest. */
const SEEDS = Number(process.env.FIG_SEEDS || 800);
const keys = new Set();
for (const t of FIG_TEMPLATES) {
  test(`figure template ${t.key}: invariants over ${SEEDS} seeds`, () => {
    assert.ok(!keys.has(t.key), "duplicate key " + t.key); keys.add(t.key);
    assert.deepEqual(checkTemplate(t, SEEDS), []);
  });
}
test("parseNum accepts exam-style typing", () => {
  assert.equal(parseNum("−4"), -4); assert.equal(parseNum("3,5"), 3.5); assert.equal(parseNum("24,000"), 24000); assert.equal(parseNum("1 200"), 1200); assert.ok(isNaN(parseNum("1.2.3")));
});
test("fmt never truncates", () => { assert.equal(fmt(1.15), "1.15"); assert.equal(fmt(-0.0475), "−0.0475"); assert.equal(fmt(2, 1), "2.0"); });
