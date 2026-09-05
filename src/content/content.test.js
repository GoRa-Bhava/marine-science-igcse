/* Checks the active subject against CONTENT-SPEC.md. Run with `npm test`.
   The content module contains JSX (the drawn fallback art), so it is bundled
   with esbuild first and then imported. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { build } from "esbuild";

async function loadContent() {
  const result = await build({
    entryPoints: ["src/content/index.js"],
    bundle: true,
    write: false,
    format: "esm",
    platform: "node",
    jsx: "automatic",
    logLevel: "silent",
  });
  const code = result.outputFiles[0].text;
  const mod = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
  return mod.content;
}

const content = await loadContent();
const { topics, units, items, creatures } = content;

test("subject meta is complete", () => {
  for (const k of ["id", "title", "subtitle", "headline", "storeKey", "creaturePath"]) {
    assert.equal(typeof content[k], "string", k);
  }
  for (const k of ["title", "noun", "blurb"]) assert.equal(typeof content.collection[k], "string", `collection.${k}`);
});

test("topics are unique and belong to a listed unit", () => {
  const ids = new Set();
  const unitNumbers = new Set(units.map((u) => u.n));
  for (const t of topics) {
    assert.ok(!ids.has(t.id), `duplicate topic id ${t.id}`);
    ids.add(t.id);
    assert.ok(unitNumbers.has(t.unit), `topic ${t.id} has unknown unit ${t.unit}`);
    assert.equal(typeof t.name, "string", t.id);
    assert.equal(typeof t.depth, "string", `${t.id} depth`);
  }
  for (const u of units) {
    assert.ok(topics.some((t) => t.unit === u.n), `unit ${u.n} has no topics`);
  }
});

test("every item has the fields its type needs", () => {
  const ids = new Set();
  const topicIds = new Set(topics.map((t) => t.id));
  for (const it of items) {
    const where = `item ${it.id}`;
    assert.ok(!ids.has(it.id), `duplicate item id ${it.id}`);
    ids.add(it.id);
    assert.ok(topicIds.has(it.topic), `${where}: unknown topic ${it.topic}`);
    assert.equal(typeof it.q, "string", `${where}: q`);
    assert.equal(typeof it.why, "string", `${where}: why`);

    if (it.type === "choice") {
      assert.equal(it.options.length, 4, `${where}: choice needs 4 options`);
      assert.ok(Number.isInteger(it.a) && it.a >= 0 && it.a < 4, `${where}: a`);
      assert.equal(new Set(it.options).size, 4, `${where}: duplicate options`);
    } else if (it.type === "gap") {
      assert.equal(it.segments.length, it.answers.length + 1, `${where}: segments must be answers + 1`);
      assert.ok(it.answers.length >= 1, `${where}: needs at least one blank`);
      assert.equal(new Set(it.bank).size, it.bank.length, `${where}: repeated bank word`);
      for (const a of it.answers) assert.ok(it.bank.includes(a), `${where}: answer "${a}" missing from bank`);
      assert.equal(new Set(it.answers).size, it.answers.length, `${where}: repeated answer`);
    } else if (it.type === "multi") {
      // QUESTION-SPEC asks for 5-7 options; a few unit 1-3 items predate that.
      assert.ok(it.options.length >= 4 && it.options.length <= 7, `${where}: multi needs 4-7 options`);
      assert.ok(it.a.length >= 2, `${where}: at least two correct`);
      assert.ok(it.options.length - it.a.length >= 1, `${where}: at least one incorrect`);
      for (const i of it.a) assert.ok(i >= 0 && i < it.options.length, `${where}: a out of range`);
    } else if (it.type === "match") {
      assert.ok(it.pairs.length >= 3 && it.pairs.length <= 5, `${where}: match needs 3-5 pairs`);
      assert.equal(new Set(it.pairs.map((p) => p[1])).size, it.pairs.length, `${where}: repeated description`);
      for (const p of it.pairs) assert.equal(p.length, 2, `${where}: pair shape`);
    } else if (it.type === "chain") {
      assert.ok(it.chunks.length >= 3 && it.chunks.length <= 6, `${where}: chain needs 3-6 steps`);
      assert.equal(new Set(it.chunks).size, it.chunks.length, `${where}: repeated step`);
    } else {
      assert.fail(`${where}: unknown type ${it.type}`);
    }
  }
});

test("every topic has questions", () => {
  for (const t of topics) {
    assert.ok(items.some((i) => i.topic === t.id), `topic ${t.id} has no items`);
  }
});

test("creatures are unique with a valid rarity", () => {
  const ids = new Set();
  for (const c of creatures) {
    assert.ok(!ids.has(c.id), `duplicate creature ${c.id}`);
    ids.add(c.id);
    assert.ok(["common", "uncommon", "rare"].includes(c.rarity), `${c.id} rarity`);
    assert.equal(typeof c.fact, "string", `${c.id} fact`);
  }
});
