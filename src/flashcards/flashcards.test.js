import { test } from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { FLASHCARDS, FLASHCARD_UNITS, flashcardsByUnit, retrievalToItem } from "./flashcards.js";

// grade.js transitively imports the JSX content module → bundle it first.
async function loadModule(entry) {
  const r = await build({
    entryPoints: [entry], bundle: true, write: false,
    format: "esm", platform: "node", jsx: "automatic", logLevel: "silent",
  });
  const code = r.outputFiles[0].text;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
}
const { initAnswer, canSubmit, gradeItem } = await loadModule("src/quiz/grade.js");

test("the flashcard bank is the full set with well-formed retrieval forms", () => {
  assert.equal(FLASHCARDS.length, 36, "6 cards per unit x 6 units");
  const ids = new Set();
  for (const c of FLASHCARDS) {
    assert.ok(c.id && !ids.has(c.id), `unique id: ${c.id}`); ids.add(c.id);
    assert.ok(c.front && c.back, `${c.id} has front + back`);
    assert.ok(Number.isInteger(c.unit), `${c.id} has a unit`);
    const r = c.retrieval;
    assert.ok(r && (r.type === "choice" || r.type === "gap"), `${c.id} retrieval is choice|gap`);
    if (r.type === "choice") {
      assert.ok(Array.isArray(r.options) && r.options.length >= 2, `${c.id} options`);
      assert.ok(Number.isInteger(r.answer) && r.answer >= 0 && r.answer < r.options.length, `${c.id} answer index`);
    } else {
      assert.ok(String(r.stem).includes("______"), `${c.id} cloze stem has a blank`);
      assert.equal(typeof r.answer, "string", `${c.id} gap answer is a word`);
      assert.ok(Array.isArray(r.wordBank) && r.wordBank.includes(r.answer), `${c.id} wordBank includes the answer`);
    }
  }
});

test("FLASHCARD_UNITS and flashcardsByUnit partition the deck", () => {
  const total = FLASHCARD_UNITS.reduce((n, u) => n + flashcardsByUnit(u).length, 0);
  assert.equal(total, FLASHCARDS.length);
  assert.deepEqual(FLASHCARD_UNITS, [1, 2, 3, 4, 5, 6]);
});

test("retrievalToItem yields an item the shared grader marks correctly (self-test smoke)", () => {
  for (const c of FLASHCARDS) {
    const item = retrievalToItem(c);
    assert.ok(item, `${c.id} builds an item`);
    assert.equal(canSubmit(item, initAnswer(item)), false, `${c.id} unanswered is not submittable`);
    if (item.type === "choice") {
      assert.equal(gradeItem(item, item.a), true, `${c.id} correct option grades true`);
      assert.equal(gradeItem(item, (item.a + 1) % item.options.length), false, `${c.id} wrong option grades false`);
    } else {
      assert.equal(item.segments.length, item.answers.length + 1, `${c.id} segments = answers + 1`);
      assert.equal(gradeItem(item, item.answers), true, `${c.id} correct cloze grades true`);
      assert.equal(gradeItem(item, item.answers.map(() => "___wrong___")), false, `${c.id} wrong cloze grades false`);
    }
  }
});
