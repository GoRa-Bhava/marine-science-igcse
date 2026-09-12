import { test } from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { figureDims, labelPool, gradeTap, gradeLabel } from "./figures.js";

async function loadContent() {
  const res = await build({ entryPoints: ["src/content/index.js"], bundle: true, write: false,
    format: "esm", platform: "node", jsx: "automatic", logLevel: "silent" });
  const mod = await import(`data:text/javascript;base64,${Buffer.from(res.outputFiles[0].text).toString("base64")}`);
  return mod.content;
}
const content = await loadContent();
const FIG = content.figures;
const ITEMS = content.items;
const figItems = ITEMS.filter((i) => i.fig);

test("all figure items reference a real figure, and are the three ported types", () => {
  assert.ok(figItems.length >= 23, `expected the 23 figure items, got ${figItems.length}`);
  for (const it of figItems) {
    assert.ok(FIG[it.fig], `${it.id}: missing figure ${it.fig}`);
    assert.ok(["tap", "label", "choice"].includes(it.type), `${it.id}: type ${it.type}`);
  }
});

test("figureDims reads viewBox for SVG and w/h for raster", () => {
  for (const [id, f] of Object.entries(FIG)) {
    const d = figureDims(f);
    assert.ok(d && d.w > 0 && d.h > 0, `${id}: dims`);
  }
  assert.deepEqual(figureDims({ art: { kind: "img", w: 900, h: 360 } }), { w: 900, h: 360 });
  assert.deepEqual(figureDims({ art: { kind: "svg", svg: '<svg viewBox="0 0 460 470">' } }), { w: 460, h: 470 });
  assert.equal(figureDims(null), null);
});

test("tap grades right only when the tapped hotspot is the target", () => {
  const tap = figItems.find((i) => i.type === "tap");
  assert.ok(gradeTap(tap, tap.target));
  const other = FIG[tap.fig].hotspots.find((h) => h.id !== tap.target);
  assert.equal(gradeTap(tap, other.id), false);
  assert.equal(gradeTap(tap, null), false);
});

test("label grades right only when every hotspot carries its own label", () => {
  const lab = figItems.find((i) => i.type === "label");
  const fig = FIG[lab.fig];
  const n = fig.hotspots.length;
  const right = {}; for (let i = 0; i < n; i++) right[i] = i;
  assert.ok(gradeLabel(fig, right));
  // one spot missing
  const partial = { ...right }; delete partial[0];
  assert.equal(gradeLabel(fig, partial), false);
  // a distractor (pool index >= n) placed on a spot
  const withDistractor = { ...right, 0: n };
  assert.equal(gradeLabel(fig, withDistractor), false);
  // two spots swapped
  const swapped = { ...right, 0: 1, 1: 0 };
  assert.equal(gradeLabel(fig, swapped), false);
});

test("labelPool is the hotspot labels followed by any distractors", () => {
  const lab = figItems.find((i) => i.type === "label" && i.extra);
  const fig = FIG[lab.fig];
  const pool = labelPool(lab, fig);
  assert.equal(pool.length, fig.hotspots.length + lab.extra.length);
  fig.hotspots.forEach((h, i) => assert.equal(pool[i], h.label));
});

test("figure-choice keeps the normal choice shape, author-first-correct", () => {
  const fc = figItems.find((i) => i.type === "choice");
  assert.ok(Array.isArray(fc.options) && fc.options.length >= 2);
  assert.equal(fc.a, 0);
});

test("a missing figure resolves to no dims (renderer skips it, fails safe)", () => {
  assert.equal(figureDims(FIG.__nope__), null);
});
