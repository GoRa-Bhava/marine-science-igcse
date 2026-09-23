/* grade.js transitively imports the JSX content module, so (like content.test.js)
   we bundle it with esbuild first, then import the pure functions. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";

async function loadModule(entry) {
  const r = await build({
    entryPoints: [entry], bundle: true, write: false,
    format: "esm", platform: "node", jsx: "automatic", logLevel: "silent",
  });
  const code = r.outputFiles[0].text;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
}

const { initAnswer, canSubmit, gradeItem } = await loadModule("src/quiz/grade.js");

test("truefalse: init is null, both verdicts are submittable, grades on the boolean", () => {
  const tItem = { type: "truefalse", q: "x", answer: true };
  const fItem = { type: "truefalse", q: "y", answer: false };
  assert.equal(initAnswer(tItem), null);
  // null cannot submit; either verdict can (false is a real choice, not "unanswered")
  assert.equal(canSubmit(tItem, null), false);
  assert.equal(canSubmit(tItem, true), true);
  assert.equal(canSubmit(tItem, false), true);
  assert.equal(gradeItem(tItem, true), true);
  assert.equal(gradeItem(tItem, false), false);
  assert.equal(gradeItem(fItem, false), true);
  assert.equal(gradeItem(fItem, true), false);
});

test("multi (mark-true): grades on the exact true set, order-independent", () => {
  const item = { type: "multi", q: "mark true", options: ["a", "b", "c", "d", "e", "f", "g", "h"], a: [0, 1, 2, 3] };
  assert.equal(initAnswer(item).length, 0);
  assert.equal(canSubmit(item, []), false);
  assert.equal(canSubmit(item, [0]), true);
  assert.equal(gradeItem(item, [0, 1, 2, 3]), true);
  assert.equal(gradeItem(item, [3, 2, 1, 0]), true, "order does not matter");
  assert.equal(gradeItem(item, [0, 1, 2]), false, "missing one true");
  assert.equal(gradeItem(item, [0, 1, 2, 3, 4]), false, "one extra (false) selected");
  assert.equal(gradeItem(item, [4, 5, 6, 7]), false, "all wrong");
});
