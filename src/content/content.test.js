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
const { topics, units, items, creatures, figures = {} } = content;

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
    if (it.type !== "label") assert.equal(typeof it.why, "string", `${where}: why`);

    if (it.type === "truefalse") {
      assert.equal(typeof it.answer, "boolean", `${where}: truefalse answer must be a boolean`);
    } else if (it.type === "choice") {
      // Figure-choice items may have 2-4 options (some are two-panel picks).
      const lo = it.fig ? 2 : 4;
      assert.ok(it.options.length >= lo && it.options.length <= 4, `${where}: choice needs ${lo}-4 options`);
      assert.ok(Number.isInteger(it.a) && it.a >= 0 && it.a < it.options.length, `${where}: a`);
      assert.equal(new Set(it.options).size, it.options.length, `${where}: duplicate options`);
      if (it.fig) assert.ok(figures[it.fig], `${where}: unknown figure ${it.fig}`);
    } else if (it.type === "tap") {
      assert.ok(figures[it.fig], `${where}: unknown figure ${it.fig}`);
      assert.ok(figures[it.fig].hotspots.some((h) => h.id === it.target), `${where}: target not a hotspot`);
    } else if (it.type === "label") {
      assert.ok(figures[it.fig], `${where}: unknown figure ${it.fig}`);
      assert.ok(figures[it.fig].hotspots.length >= 2, `${where}: label figure needs hotspots`);
    } else if (it.type === "gap") {
      assert.equal(it.segments.length, it.answers.length + 1, `${where}: segments must be answers + 1`);
      assert.ok(it.answers.length >= 1, `${where}: needs at least one blank`);
      assert.equal(new Set(it.bank).size, it.bank.length, `${where}: repeated bank word`);
      for (const a of it.answers) assert.ok(it.bank.includes(a), `${where}: answer "${a}" missing from bank`);
      assert.equal(new Set(it.answers).size, it.answers.length, `${where}: repeated answer`);
    } else if (it.type === "multi") {
      // QUESTION-SPEC asks for 5-7 options; a few unit 1-3 items predate that,
      // and the vetted Unit 1 bank has one eight-option item (Q16, the five oceans).
      assert.ok(it.options.length >= 4 && it.options.length <= 9, `${where}: multi needs 4-9 options`);
      assert.ok(it.a.length >= 2, `${where}: at least two correct`);
      assert.ok(it.options.length - it.a.length >= 1, `${where}: at least one incorrect`);
      for (const i of it.a) assert.ok(i >= 0 && i < it.options.length, `${where}: a out of range`);
    } else if (it.type === "match") {
      assert.ok(it.pairs.length >= 2 && it.pairs.length <= 6, `${where}: match needs 2-6 pairs`);
      assert.equal(new Set(it.pairs.map((p) => p[1])).size, it.pairs.length, `${where}: repeated description`);
      for (const p of it.pairs) assert.equal(p.length, 2, `${where}: pair shape`);
    } else if (it.type === "chain") {
      assert.ok(it.chunks.length >= 3 && it.chunks.length <= 6, `${where}: chain needs 3-6 steps`);
      assert.equal(new Set(it.chunks).size, it.chunks.length, `${where}: repeated step`);
    } else if (it.type === "exam") {
      assert.ok(it.check.length >= 4 && it.check.length <= 6, `${where}: exam needs 4-6 check points`);
      assert.ok(it.distractors.length >= 2 && it.distractors.length <= 3, `${where}: exam needs 2-3 distractors`);
      assert.ok(it.build.length >= 4 && it.build.length <= 6, `${where}: exam needs 4-6 build phrases`);
      const points = [...it.check, ...it.distractors];
      assert.equal(new Set(points).size, points.length, `${where}: a point appears twice`);
      assert.equal(new Set(it.build).size, it.build.length, `${where}: a build phrase appears twice`);
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

// All permutations of a small index array (used to prove option-order independence).
function permutations(arr) {
  if (arr.length <= 1) return [arr];
  const out = [];
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const p of permutations(rest)) out.push([arr[i], ...p]);
  }
  return out;
}

test("U2-18 correct answer resolves to 'slightly alkaline' regardless of option order", () => {
  const it = items.find((i) => i.id === "U2-18");
  assert.ok(it, "U2-18 present");
  assert.equal(it.type, "choice");
  // New source option set: "strongly acidic" filler replaced by "strongly alkaline".
  assert.deepEqual(
    [...it.options].sort(),
    ["neutral", "slightly acidic", "slightly alkaline", "strongly alkaline"].sort(),
  );
  assert.ok(!it.options.includes("strongly acidic"), "old filler removed");
  // Correctness is tied to the authored index `a`; ChoiceQ only shuffles the DISPLAY
  // order, so the option flagged correct is "slightly alkaline" under every permutation.
  assert.equal(it.options[it.a], "slightly alkaline");
  for (const order of permutations(it.options.map((_, i) => i))) {
    const shownCorrect = order.find((i) => i === it.a);
    assert.equal(it.options[shownCorrect], "slightly alkaline", `order ${order}`);
  }
});

test("G11 uses the source's N/S-vs-E/W direction mapping", () => {
  const it = items.find((i) => i.id === "G11");
  assert.ok(it, "G11 present");
  assert.equal(it.type, "gap");
  assert.deepEqual(it.answers, ["coordinates", "north or south", "east or west"]);
  assert.ok(it.bank.includes("up or down") && it.bank.includes("bearings"), "strengthened distractors present");
});

test("Q20 is handled by the match interaction (climate zones, no 'subtropical')", () => {
  const it = items.find((i) => i.id === "Q20");
  assert.ok(it, "Q20 present");
  assert.equal(it.type, "match", "Q20 is a match, not an MCQ");
  const rights = it.pairs.map((p) => p[1]);
  assert.deepEqual([...rights].sort(), ["polar zone", "temperate zone", "tropical zone"].sort());
  // The non-syllabus "subtropical" filler must not appear in any pair (either side).
  const pairText = it.pairs.flat().join(" ").toLowerCase();
  assert.ok(!pairText.includes("subtropical"), "no 'subtropical' filler in the pairs");
});

test("U6 evaluate items keep the balanced answer keyed first (a=0, 4 options)", () => {
  for (const id of ["U6-19", "U6-59", "U6-65", "U6-91"]) {
    const it = items.find((i) => i.id === id);
    assert.ok(it, `${id} present`);
    assert.equal(it.type, "choice");
    assert.equal(it.options.length, 4, `${id}: four options`);
    assert.equal(it.a, 0, `${id}: correct answer keyed first`);
  }
});

test("true/false seed items are present, tier-1, and grade on a boolean", () => {
  const tf = items.filter((i) => i.type === "truefalse");
  assert.ok(tf.length >= 20, `expected the T/F seed set, got ${tf.length}`);
  for (const it of tf) {
    assert.equal(it.tier, 1, `${it.id}: T/F is recall tier 1`);
    assert.equal(typeof it.answer, "boolean", `${it.id}: boolean answer`);
    assert.ok(typeof it.q === "string" && it.q.length > 0, `${it.id}: statement`);
  }
});

test("ridge/trench item U1-98 is now a live multi with the {0,1,2,3} true set", () => {
  const it = items.find((i) => i.id === "U1-98");
  assert.ok(it, "U1-98 present");
  assert.equal(it.type, "multi", "converted from exam to multi");
  assert.equal(it.tier, 2, "application tier");
  assert.equal(it.options.length, 8, "8 statements (4 true / 4 false)");
  assert.deepEqual([...it.a].sort((x, y) => x - y), [0, 1, 2, 3]);
  assert.match(it.q, /mid-ocean ridge and an ocean trench/i);
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
