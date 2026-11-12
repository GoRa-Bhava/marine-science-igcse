/* Don's rule: no em-dashes in student-facing text. This walks every exported
   content item and fails if any string value contains an em-dash ("—") or the
   ASCII pair " -- ". Covers the main bank + figures + all unit-figure batches,
   the practicals, notes, flashcards and comparison cards, and the true/false,
   mark-true and writing banks (bundled like the recall test). */
import { test } from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";

const ENTRY = `
export { content } from "./src/content/index.js";
export { FIGURES, FIGURE_ITEMS } from "./src/content/figures.js";
export { TRUEFALSE } from "./src/content/truefalse-bank.js";
export { MARKTRUE } from "./src/content/mark-true-bank.js";
export { WRITING, WRITING_COMMANDS } from "./src/content/writing-bank.js";
export { NOTES } from "./src/reader/notes.js";
export { FLASHCARDS } from "./src/flashcards/flashcards.js";
export { COMPARISON_CARDS } from "./src/comparison/comparison-cards.js";
export { PRACTICALS } from "./src/reader/practicals.js";
export { UNIT_FIGURE_ITEMS, UNIT_FIGURES } from "./src/content/unit-figures/index.js";
export { UNIT_FIGURE_ITEMS_C, UNIT_FIGURES_C } from "./src/content/unit-figures/index-c.js";
export { UNIT_FIGURE_ITEMS_P, UNIT_FIGURES_P } from "./src/content/unit-figures/index-p.js";
`;

const res = await build({
  stdin: { contents: ENTRY, resolveDir: process.cwd(), sourcefile: "entry.js", loader: "js" },
  bundle: true, write: false, format: "esm", platform: "node", jsx: "automatic", logLevel: "silent",
});
const mod = await import(`data:text/javascript;base64,${Buffer.from(res.outputFiles[0].text).toString("base64")}`);

// Every content string is now em-dash free, so there are no exceptions: the test
// guards every item.
const KNOWN_GAPS = new Set([]);

const EMDASH = /—| -- /;
const hits = [];
const seen = new Set();
function walk(v, path, id) {
  if (typeof v === "string") { if (EMDASH.test(v) && !KNOWN_GAPS.has(id)) hits.push({ path, id, v }); return; }
  if (!v || typeof v !== "object") return;
  if (seen.has(v)) return; seen.add(v);
  const here = (!Array.isArray(v) && typeof v.id === "string") ? v.id : id;
  if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`, here));
  else for (const k of Object.keys(v)) walk(v[k], `${path}.${k}`, here);
}
for (const [name, val] of Object.entries(mod)) walk(val, name, null);

test("no em-dash (— or ' -- ') in any content string value", () => {
  const report = hits.map((h) => `${h.id || h.path}: …${h.v.replace(/\n/g, " ").slice(Math.max(0, h.v.search(EMDASH) - 25), h.v.search(EMDASH) + 25)}…`);
  assert.deepEqual(report, [], "remove em-dashes from these content strings");
});
