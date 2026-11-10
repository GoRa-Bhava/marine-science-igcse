import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { UNIT_FIGURES, UNIT_FIGURE_ITEMS } from "./index.js";

// public/ is three levels up from this file (src/content/unit-figures/).
const PUBLIC = fileURLToPath(new URL("../../../public/", import.meta.url));

// Pull every image src a figure references (img figures carry a path; svg figures are inline).
function imgSrc(fig) {
  const art = fig.art || fig;
  if (!art || art.kind !== "img") return null;
  return art.src || art.href || art.url || null;
}

test("picture batch 1: 81 figures and 138 items (tap 61, choice 61, label 14, multi 2)", () => {
  assert.equal(Object.keys(UNIT_FIGURES).length, 81);
  assert.equal(UNIT_FIGURE_ITEMS.length, 138);
  const types = {};
  for (const it of UNIT_FIGURE_ITEMS) types[it.type] = (types[it.type] || 0) + 1;
  assert.deepEqual(types, { tap: 61, choice: 61, label: 14, multi: 2 });
});

test("every figs-units file a figure references exists in public/", () => {
  const missing = [];
  for (const [key, fig] of Object.entries(UNIT_FIGURES)) {
    const src = imgSrc(fig);
    if (!src || !/figs-units\//.test(src)) continue;
    const rel = src.replace(/^\.?\//, "");
    if (!fs.existsSync(PUBLIC + rel)) missing.push(`${key}: ${src}`);
  }
  assert.deepEqual(missing, [], "figs-units image(s) referenced but not present under public/");
});

test("every other public image a figure references exists (figdata-img, card-art, figs)", () => {
  const missing = [];
  for (const [key, fig] of Object.entries(UNIT_FIGURES)) {
    const src = imgSrc(fig);
    if (!src || /figs-units\//.test(src)) continue;      // figs-units covered above
    if (!/(figdata-img|card-art|figs)\//.test(src)) continue; // only our known public dirs
    const rel = src.replace(/^\.?\//, "");
    if (!fs.existsSync(PUBLIC + rel)) missing.push(`${key}: ${src}`);
  }
  assert.deepEqual(missing, [], "public image(s) referenced but not present");
});

test("every unit-figure item references a figure that exists in the batch", () => {
  for (const it of UNIT_FIGURE_ITEMS) {
    assert.ok(it.fig, `${it.id}: has a fig`);
    assert.ok(UNIT_FIGURES[it.fig], `${it.id}: references missing figure ${it.fig}`);
  }
});
