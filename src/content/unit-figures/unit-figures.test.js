import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { UNIT_FIGURES, UNIT_FIGURE_ITEMS } from "./index.js";
import { UNIT_FIGURES_C, UNIT_FIGURE_ITEMS_C } from "./index-c.js";

// public/ is three levels up from this file (src/content/unit-figures/).
const PUBLIC = fileURLToPath(new URL("../../../public/", import.meta.url));

// Every picture figure/item across the unit batches (batch 1 + batch 2C).
const FIGURES = { ...UNIT_FIGURES, ...UNIT_FIGURES_C };
const ITEMS = [...UNIT_FIGURE_ITEMS, ...UNIT_FIGURE_ITEMS_C];

// Pull every image src a figure references (img figures carry a path; svg figures are inline).
function imgSrc(fig) {
  const art = fig.art || fig;
  if (!art || art.kind !== "img") return null;
  return art.src || art.href || art.url || null;
}
const typeCounts = (items) => {
  const t = {};
  for (const it of items) t[it.type] = (t[it.type] || 0) + 1;
  return t;
};

test("batch 1 (on existing art): 79 figures, 136 items (tap 59, choice 61, label 14, multi 2)", () => {
  assert.equal(Object.keys(UNIT_FIGURES).length, 79);
  assert.equal(UNIT_FIGURE_ITEMS.length, 136);
  assert.deepEqual(typeCounts(UNIT_FIGURE_ITEMS), { tap: 59, choice: 61, label: 14, multi: 2 });
});

test("batch 2C (code-drawn): 20 figures, 47 items (tap 21, choice 21, label 5)", () => {
  assert.equal(Object.keys(UNIT_FIGURES_C).length, 20);
  assert.equal(UNIT_FIGURE_ITEMS_C.length, 47);
  assert.deepEqual(typeCounts(UNIT_FIGURE_ITEMS_C), { tap: 21, choice: 21, label: 5 });
});

test("the two unit batches share no figure id and no item id", () => {
  const figClash = Object.keys(UNIT_FIGURES_C).filter((k) => k in UNIT_FIGURES);
  assert.deepEqual(figClash, [], "figure id reused across batches");
  const ids = new Set(UNIT_FIGURE_ITEMS.map((i) => i.id));
  const itemClash = UNIT_FIGURE_ITEMS_C.filter((i) => ids.has(i.id)).map((i) => i.id);
  assert.deepEqual(itemClash, [], "item id reused across batches");
});

test("every figs-units file a figure references exists in public/", () => {
  const missing = [];
  for (const [key, fig] of Object.entries(FIGURES)) {
    const src = imgSrc(fig);
    if (!src || !/figs-units\//.test(src)) continue;
    const rel = src.replace(/^\.?\//, "");
    if (!fs.existsSync(PUBLIC + rel)) missing.push(`${key}: ${src}`);
  }
  assert.deepEqual(missing, [], "figs-units image(s) referenced but not present under public/");
});

test("every other public image a figure references exists (figdata-img, card-art, figs)", () => {
  const missing = [];
  for (const [key, fig] of Object.entries(FIGURES)) {
    const src = imgSrc(fig);
    if (!src || /figs-units\//.test(src)) continue;      // figs-units covered above
    if (!/(figdata-img|card-art|figs)\//.test(src)) continue; // only our known public dirs
    const rel = src.replace(/^\.?\//, "");
    if (!fs.existsSync(PUBLIC + rel)) missing.push(`${key}: ${src}`);
  }
  assert.deepEqual(missing, [], "public image(s) referenced but not present");
});

test("every unit-figure item references a figure that exists in its batch", () => {
  for (const it of ITEMS) {
    assert.ok(it.fig, `${it.id}: has a fig`);
    assert.ok(FIGURES[it.fig], `${it.id}: references missing figure ${it.fig}`);
  }
});
