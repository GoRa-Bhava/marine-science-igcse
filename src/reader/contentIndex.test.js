import { test } from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";
import { buildContentIndex, secOf, unitOf } from "./contentIndex.js";

const mk = (id, ref, tier, extra = {}) => ({ id, ref, tier, type: "choice", ...extra });

test("secOf/unitOf derive from ref", () => {
  assert.equal(secOf({ ref: "2.3/LO2" }), "2.3");
  assert.equal(secOf({ ref: "1.3/LO6 · 1.2/LO4" }), "1.3");
  assert.equal(unitOf("2.3"), 2);
});

test("groups by section, orders by tier then author order", () => {
  const items = [
    mk("a", "2.1/LO1", 3), // exam (later)
    mk("b", "2.1/LO2", 1), // recall (first)
    mk("c", "2.1/LO3", 2), // application (middle)
    mk("d", "2.1/LO4", 1), // recall, authored after b
    mk("e", "2.2/LO1", 1),
  ];
  const idx = buildContentIndex(items);
  assert.deepEqual(idx.sections["2.1"].orderedItemIds, ["b", "d", "c", "a"], "tier ramp, stable within tier");
  assert.equal(idx.sections["2.1"].total, 4);
  assert.equal(idx.sections["2.2"].total, 1);
  assert.equal(idx.sections["2.1"].title, "The water cycle");
});

test("unit rollup, itemLoc, nextSectionId, firstItemOf, flatOrder", () => {
  const items = [mk("a", "2.1/LO1", 1), mk("b", "2.2/LO1", 1), mk("c", "3.1/LO1", 1)];
  const idx = buildContentIndex(items);
  assert.deepEqual(idx.units.map((u) => u.unitId), [2, 3]);
  assert.equal(idx.units[0].title, "Sea Water");
  assert.equal(idx.itemLoc.b.sectionId, "2.2");
  assert.equal(idx.itemLoc.b.unitId, 2);
  assert.equal(idx.nextSectionId("2.1"), "2.2");
  assert.equal(idx.nextSectionId("2.2"), "3.1");
  assert.equal(idx.nextSectionId("3.1"), null);
  assert.equal(idx.firstItemOf("2.2"), "b");
  assert.deepEqual(idx.flatOrder, ["a", "b", "c"]);
});

test("drops items whose figure is missing", () => {
  const items = [mk("a", "2.1/LO1", 1), mk("b", "2.1/LO2", 1, { fig: "F99" })];
  const idx = buildContentIndex(items, { /* no F99 */ });
  assert.deepEqual(idx.sections["2.1"].orderedItemIds, ["a"]);
});

test("real bank: index covers all six units and their syllabus sections", async () => {
  const r = await build({ entryPoints: ["src/content/index.js"], bundle: true, write: false, format: "esm", platform: "node", jsx: "automatic", logLevel: "silent" });
  const mod = await import(`data:text/javascript;base64,${Buffer.from(r.outputFiles[0].text).toString("base64")}`);
  const idx = buildContentIndex(mod.content.items, mod.content.figures || {});
  assert.ok(idx.itemCount >= 500, `indexed ${idx.itemCount} items`);
  assert.deepEqual(idx.units.map((u) => u.unitId), [1, 2, 3, 4, 5, 6]);
  assert.equal(idx.sectionIds.length, 37, "37 syllabus sections");
  // every item is placed in exactly one section
  assert.equal(Object.keys(idx.itemLoc).length, idx.itemCount);
});
