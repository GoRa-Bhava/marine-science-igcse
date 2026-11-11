import { test } from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { PRACTICALS } from "../reader/practicals.js";
import { recallEligible, recallStem, recallOn } from "../reader/recallFirst.js";
import { UNIT_FIGURE_ITEMS } from "./unit-figures/index.js";
import { UNIT_FIGURE_ITEMS_C } from "./unit-figures/index-c.js";
import { UNIT_FIGURE_ITEMS_P } from "./unit-figures/index-p.js";
import fs from "node:fs";

const res = await build({ entryPoints: ["src/content/index.js"], bundle: true, write: false, format: "esm", platform: "node", jsx: "automatic", logLevel: "silent" });
const content = (await import(`data:text/javascript;base64,${Buffer.from(res.outputFiles[0].text).toString("base64")}`)).content;
// content.items already merges the figure batches, but import batch 1, 2C and 3
// explicitly and dedupe so these recall checks provably cover every unit-figure item.
const byId = new Map();
for (const it of [...content.items, ...PRACTICALS.flatMap((p) => p.items || []), ...UNIT_FIGURE_ITEMS, ...UNIT_FIGURE_ITEMS_C, ...UNIT_FIGURE_ITEMS_P]) {
  if (it && it.id != null && !byId.has(it.id)) byId.set(it.id, it);
}
const all = [...byId.values()];
const strip = (s) => String(s || "").replace(/<[^>]+>/g, "");
// A choice stem "needs the options in view" when it names them. The option phrases
// (which of these / which statement / which pair / the following / option(s)) match
// in any case, so a capital-"Which" picture stem is caught. NOT and EXCEPT match
// only in capitals, as the original test did, so an ordinary lower-case "not"
// ("not to scale", "a fish and not a reptile") is not flagged.
const OPTION_WORDS = /\b(which (of the following|of these|option|statement|one of|pair|row|sequence|list)|the following|options?)\b/i;
const CAPS_ONLY = /\b(NOT|EXCEPT)\b/;
const needsOptionsInView = (s) => OPTION_WORDS.test(strip(s)) || CAPS_ONLY.test(strip(s));

test("recall fields: only on choice items, well-formed", () => {
  for (const it of all) {
    if ("qRecall" in it) {
      assert.equal(it.type, "choice", `${it.id}: qRecall only on choice items`);
      assert.ok(typeof it.qRecall === "string" && it.qRecall.trim().length > 10, `${it.id}: qRecall must be a real question`);
      assert.ok(!/—/.test(it.qRecall), `${it.id}: no em-dashes in qRecall`);
      assert.ok(!needsOptionsInView(it.qRecall), `${it.id}: qRecall must not refer to options`);
    }
    if ("recall" in it) assert.equal(it.recall, false, `${it.id}: recall may only be false`);
  }
});

test("every choice stem that needs the options in view has a qRecall or recall:false", () => {
  // Hard check over the main bank, the practicals and all unit-figure items (batch
  // 1, 2C and 3 are in `all`). Any choice stem that names the options and has no
  // qRecall or recall:false fails the build.
  const missing = all.filter((it) => it.type === "choice" && needsOptionsInView(it.q) && !it.qRecall && it.recall !== false).map((it) => it.id);
  assert.deepEqual(missing, [], "add qRecall (or recall:false) to these choice items");
});

test("recallEligible / recallStem / recallOn", () => {
  const c = { type: "choice", q: "Which of these is X?", qRecall: "Name X.", options: ["a", "b"], a: 0 };
  assert.equal(recallOn(undefined), true, "default ON");
  assert.equal(recallOn({ recallFirst: false }), false);
  assert.equal(recallEligible(c, {}), true);
  assert.equal(recallEligible(c, { recallFirst: false }), false);
  assert.equal(recallEligible({ ...c, recall: false }, {}), false);
  assert.equal(recallEligible({ type: "multi" }, {}), false);
  assert.equal(recallStem(c), "Name X.");
  assert.equal(recallStem({ q: "What is Y?" }), "What is Y?");
});

test("the picture-question player shows recallStem(item) and the figure while the options are hidden", () => {
  // Picture questions are choice items carrying a `fig`, rendered by ChoiceQ. When
  // recall-first hides the options, the hidden branch must show recallStem(item)
  // (so a qRecall stem is used in place of an options-dependent q) and still render
  // the figure, so the question is answerable from the picture.
  const src = fs.readFileSync(new URL("../App.jsx", import.meta.url), "utf8");
  const start = src.indexOf("hidden ? (");
  assert.ok(start >= 0, "ChoiceQ has an options-hidden (recall-first) branch");
  const branch = src.slice(start, src.indexOf(") : (", start));
  assert.ok(branch.includes("recallStem(item)"), "hidden branch shows recallStem(item)");
  assert.ok(/item\.fig && <FigureStage/.test(branch), "hidden branch renders the figure for picture questions");
});

test("the revealed choice branch keeps recallStem(item) when eligible, and uses item.q when recall-first is off", () => {
  // After "Show the options", the stem must not switch from the qRecall the student
  // answered back to item.q. The revealed branch shows recallStem(item) for a
  // recall-eligible item, and the plain item.q only when recall-first is off.
  const it = { type: "choice", q: "Which of these is X?", qRecall: "Name X.", options: ["a", "b"], a: 0 };
  const shownStem = (item, settings) => (recallEligible(item, settings) ? recallStem(item) : item.q);
  assert.equal(shownStem(it, {}), "Name X.", "eligible → recallStem (the qRecall)");
  assert.equal(shownStem(it, { recallFirst: false }), "Which of these is X?", "recall-first off → item.q");
  const src = fs.readFileSync(new URL("../App.jsx", import.meta.url), "utf8");
  const start = src.indexOf("hidden ? (");
  const revealed = src.slice(src.indexOf(") : (", start));
  assert.ok(/eligible \? recallStem\(item\) : item\.q/.test(revealed), "revealed branch shows recallStem(item) when eligible, else item.q");
});
