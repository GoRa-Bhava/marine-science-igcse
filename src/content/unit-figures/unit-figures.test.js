import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { UNIT_FIGURES, UNIT_FIGURE_ITEMS } from "./index.js";
import { UNIT_FIGURES_C, UNIT_FIGURE_ITEMS_C } from "./index-c.js";
import { UNIT_FIGURES_P, UNIT_FIGURE_ITEMS_P } from "./index-p.js";
import { FIGURES as FQ_FIGURES, FIGURE_ITEMS as FQ_ITEMS } from "../figures.js";

// public/ is three levels up from this file (src/content/unit-figures/).
const PUBLIC = fileURLToPath(new URL("../../../public/", import.meta.url));

// The whole figure lookup the app assembles (figures.js + the three unit batches).
// Batch-1 items moved onto new art point at R- figures defined in batch 3, so the
// image/fig checks must run against the merged map, not any single batch.
const MERGED = { ...FQ_FIGURES, ...UNIT_FIGURES, ...UNIT_FIGURES_C, ...UNIT_FIGURES_P };
const ALL_ITEMS = [...FQ_ITEMS, ...UNIT_FIGURE_ITEMS, ...UNIT_FIGURE_ITEMS_C, ...UNIT_FIGURE_ITEMS_P];

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

test("batch 1 (on existing + new art, after Don's removals): 62 figures, 133 items (tap 58, choice 60, label 14, multi 1)", () => {
  assert.equal(Object.keys(UNIT_FIGURES).length, 62);
  assert.equal(UNIT_FIGURE_ITEMS.length, 133);
  assert.deepEqual(typeCounts(UNIT_FIGURE_ITEMS), { tap: 58, choice: 60, label: 14, multi: 1 });
});

test("batch 2C (code-drawn, after Don's vetting round 1): 20 figures, 46 items (tap 20, choice 21, label 5)", () => {
  assert.equal(Object.keys(UNIT_FIGURES_C).length, 20);
  assert.equal(UNIT_FIGURE_ITEMS_C.length, 46);
  assert.deepEqual(typeCounts(UNIT_FIGURE_ITEMS_C), { tap: 20, choice: 21, label: 5 });
});

test("batch 3 (new art + replacements, after Don's vetting round 1): 75 figures, 101 items (tap 42, choice 53, label 5, multi 1)", () => {
  assert.equal(Object.keys(UNIT_FIGURES_P).length, 75);
  assert.equal(UNIT_FIGURE_ITEMS_P.length, 101);
  assert.deepEqual(typeCounts(UNIT_FIGURE_ITEMS_P), { tap: 42, choice: 53, label: 5, multi: 1 });
});

test("figures.js carries the 21 FQ items (FQ2 retired)", () => {
  assert.equal(FQ_ITEMS.length, 21);
});

test("Don's removed items are gone from every batch (stale progress for them is ignored by scoring)", () => {
  // Removed duplicates and weak-picture items. Their saved review state becomes an
  // unknown id, which scoring.js ignores (see scoring.test.js: "stale progress for a
  // deleted id is ignored"). Here we just lock in the removal.
  const gone = [
    // 10 Nov 2026
    "U5-D26", "PQ-U4-03", "PQ-U5-08", "PQ-U6-31", "FQ2",
    // Don's vetting round 1, 11 Nov 2026 (Units 1-2)
    "PQ2-U1-08", "PQ2-U1-11", "PQ2-U2-02", "PQ2-U2-08", "PQ2-U2-54",
  ];
  const present = new Set(ALL_ITEMS.map((it) => it.id));
  assert.deepEqual(gone.filter((id) => present.has(id)), [], "a removed id is still in content");
});

test("no figure id and no item id is shared across the three batches or with figures.js", () => {
  const figGroups = { FQ: FQ_FIGURES, b1: UNIT_FIGURES, c: UNIT_FIGURES_C, p: UNIT_FIGURES_P };
  const seenFig = {};
  const figClash = [];
  for (const [g, map] of Object.entries(figGroups)) {
    for (const k of Object.keys(map)) {
      if (seenFig[k]) figClash.push(`${k} in ${seenFig[k]} and ${g}`); else seenFig[k] = g;
    }
  }
  assert.deepEqual(figClash, [], "figure id reused");

  const itemGroups = { FQ: FQ_ITEMS, b1: UNIT_FIGURE_ITEMS, c: UNIT_FIGURE_ITEMS_C, p: UNIT_FIGURE_ITEMS_P };
  const seenItem = {};
  const itemClash = [];
  for (const [g, list] of Object.entries(itemGroups)) {
    for (const it of list) {
      if (seenItem[it.id]) itemClash.push(`${it.id} in ${seenItem[it.id]} and ${g}`); else seenItem[it.id] = g;
    }
  }
  assert.deepEqual(itemClash, [], "item id reused");
});

test("every figure item references a figure that exists in the merged lookup", () => {
  const missing = ALL_ITEMS.filter((it) => it.fig && !MERGED[it.fig]).map((it) => `${it.id} -> ${it.fig}`);
  assert.deepEqual(missing, [], "item(s) reference a figure missing from the merged lookup");
});

test("every image a figure references exists under public/", () => {
  const missing = [];
  for (const [key, fig] of Object.entries(MERGED)) {
    const src = imgSrc(fig);
    if (!src) continue;                       // inline SVG figures carry no file
    const rel = src.replace(/^\.?\//, "");
    if (!fs.existsSync(PUBLIC + rel)) missing.push(`${key}: ${src}`);
  }
  assert.deepEqual(missing, [], "image(s) referenced but not present under public/");
});
