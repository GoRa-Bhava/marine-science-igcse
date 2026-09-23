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

test("every flashcard has front/back and a well-formed retrieval form", () => {
  assert.ok(FLASHCARDS.length > 0);
  const ids = new Set();
  for (const c of FLASHCARDS) {
    assert.ok(c.id && !ids.has(c.id), `unique id: ${c.id}`); ids.add(c.id);
    assert.ok(c.front && c.back, `${c.id} has front + back`);
    assert.ok(Number.isInteger(c.unit), `${c.id} has a unit`);
    const r = c.retrieval;
    assert.ok(r && (r.type === "choice" || r.type === "gap"), `${c.id} retrieval is choice|gap`);
    if (r.type === "choice") {
      assert.ok(Array.isArray(r.options) && r.options.length >= 2, `${c.id} options`);
      assert.ok(r.a >= 0 && r.a < r.options.length, `${c.id} a in range`);
    } else {
      assert.equal(r.segments.length, r.answers.length + 1, `${c.id} segments = answers+1`);
      for (const ans of r.answers) assert.ok(r.bank.includes(ans), `${c.id} bank includes answer`);
    }
  }
});

test("FLASHCARD_UNITS and flashcardsByUnit partition the deck", () => {
  const total = FLASHCARD_UNITS.reduce((n, u) => n + flashcardsByUnit(u).length, 0);
  assert.equal(total, FLASHCARDS.length);
});

test("retrievalToItem yields an item the shared grader marks correctly (self-test smoke)", () => {
  for (const c of FLASHCARDS) {
    const item = retrievalToItem(c);
    assert.ok(item, `${c.id} builds an item`);
    // an untouched item is not submittable
    assert.equal(canSubmit(item, initAnswer(item)), false);
    if (item.type === "choice") {
      assert.equal(gradeItem(item, item.a), true, `${c.id} correct option grades true`);
      assert.equal(gradeItem(item, (item.a + 1) % item.options.length), false, `${c.id} wrong option grades false`);
    } else {
      assert.equal(gradeItem(item, item.answers), true, `${c.id} correct cloze grades true`);
      assert.equal(gradeItem(item, item.answers.map(() => "___wrong___")), false, `${c.id} wrong cloze grades false`);
    }
  }
});
