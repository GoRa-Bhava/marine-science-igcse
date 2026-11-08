import { test } from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { PRACTICALS } from "../reader/practicals.js";
import { recallEligible, recallStem, recallOn } from "../reader/recallFirst.js";

const res = await build({ entryPoints: ["src/content/index.js"], bundle: true, write: false, format: "esm", platform: "node", jsx: "automatic", logLevel: "silent" });
const content = (await import(`data:text/javascript;base64,${Buffer.from(res.outputFiles[0].text).toString("base64")}`)).content;
const all = [...content.items, ...PRACTICALS.flatMap((p) => p.items || [])];
const strip = (s) => String(s || "").replace(/<[^>]+>/g, "");
const OPTION_REF = /\b(which (of the following|of these|option|statement|one of|pair|row|sequence|list)|the following|options?)\b|\b(NOT|EXCEPT)\b/;

test("recall fields: only on choice items, well-formed", () => {
  for (const it of all) {
    if ("qRecall" in it) {
      assert.equal(it.type, "choice", `${it.id}: qRecall only on choice items`);
      assert.ok(typeof it.qRecall === "string" && it.qRecall.trim().length > 10, `${it.id}: qRecall must be a real question`);
      assert.ok(!/—/.test(it.qRecall), `${it.id}: no em-dashes in qRecall`);
      assert.ok(!OPTION_REF.test(strip(it.qRecall)), `${it.id}: qRecall must not refer to options`);
    }
    if ("recall" in it) assert.equal(it.recall, false, `${it.id}: recall may only be false`);
  }
});

test("every choice stem that needs the options in view has a qRecall or recall:false", () => {
  const missing = all.filter((it) => it.type === "choice" && OPTION_REF.test(strip(it.q)) && !it.qRecall && it.recall !== false).map((it) => it.id);
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
