import { test } from "node:test";
import assert from "node:assert/strict";
import { PRACTICALS, practicalsList, practicalById, practicalItemIds } from "./practicals.js";

const ITEM_TYPES = new Set(["match", "chain", "choice", "multi", "truefalse", "best", "gap"]);

// Floors, not exact counts — lower only if practicals are deliberately retired.
// They guard against accidental mass loss (a practical or a whole unit going
// missing in a bad merge) without breaking when a single question is added or
// retired.
const FLOORS = {
  practicals: 18,        // 20 authored
  totalItems: 100,       // 110 authored
  itemsPerPractical: 3,
  pilotItems: 10,        // P4.1 has 13
  // Units that must each own at least one hands-on practical. Unit 6 is absent by
  // design: its only practical (P6.1, data handling) is cross-cutting AO3 skills,
  // not a Unit 6 topic, so it is tagged crossCutting and grouped on its own.
  units: [1, 2, 3, 4, 5],
};

test("practicals expose the pilot food-tests entry with a full procedure card", () => {
  assert.ok(PRACTICALS.length >= 1, "at least one practical");
  const p = practicalById("P4.1");
  assert.ok(p, "P4.1 present");
  assert.equal(p.ref, "4.1/LO2");
  assert.equal(p.unit, 4);
  assert.match(p.title, /food test/i);
  assert.ok(p.aim && p.tests?.length && p.safety?.length && p.technique?.length, "aim/tests/safety/technique present");
  // Each test is a labelled result; swatch colours are hex.
  for (const t of p.tests) {
    assert.ok(t.nutrient && t.method && t.positive && t.negative, "test has method + results");
    if (t.posColor) assert.match(t.posColor, /^#[0-9a-f]{3,8}$/i);
    if (t.scale) assert.ok(Array.isArray(t.scale) && t.scale.length >= 2, "scale is a colour run");
  }
});

test("practical items are well-formed and helpers resolve them", () => {
  const ids = practicalItemIds("P4.1");
  assert.ok(ids.length >= FLOORS.pilotItems, `P4.1 has >= ${FLOORS.pilotItems} items, got ${ids.length}`);
  const seen = new Set();
  for (const it of practicalById("P4.1").items) {
    assert.ok(it.id?.startsWith("P4.1-"), `namespaced id: ${it.id}`);
    assert.ok(!seen.has(it.id), `unique id: ${it.id}`); seen.add(it.id);
    assert.ok(ITEM_TYPES.has(it.type), `known item type: ${it.type}`);
    assert.equal(it.status, "human_review", `${it.id} awaits vetting`);
  }
  assert.deepEqual(practicalItemIds("nope"), [], "unknown id → no items");
  assert.equal(practicalById("nope"), null);
  assert.equal(practicalsList().length, PRACTICALS.length);
});

test("the full set: practicals across units 1–6 (floors, not exact counts), both card shapes, all vetted", () => {
  assert.ok(PRACTICALS.length >= FLOORS.practicals, `>= ${FLOORS.practicals} practicals authored, got ${PRACTICALS.length}`);
  const byUnit = {};
  let items = 0;
  const seenIds = new Set();
  for (const p of PRACTICALS) {
    byUnit[p.unit] = (byUnit[p.unit] || 0) + 1;
    assert.ok(p.id && p.ref && p.title && p.subtitle && p.aim, `${p.id} has header fields`);
    assert.ok(p.technique?.length, `${p.id} has exam technique`);
    // Exactly one card shape: reagent tests[] OR procedure steps[].
    assert.ok(!!p.tests?.length !== !!p.steps?.length, `${p.id} is one shape (tests xor steps)`);
    assert.ok(p.items.length >= FLOORS.itemsPerPractical, `${p.id}: >= ${FLOORS.itemsPerPractical} items, got ${p.items.length}`);
    for (const it of p.items) {
      assert.ok(!seenIds.has(it.id), `globally unique item id: ${it.id}`); seenIds.add(it.id);
      assert.equal(it.status, "human_review", `${it.id} awaits vetting`);
      items++;
    }
  }
  assert.ok(items >= FLOORS.totalItems, `>= ${FLOORS.totalItems} items total, got ${items}`);
  for (const u of FLOORS.units) assert.ok((byUnit[u] || 0) >= 1, `unit ${u} has at least one practical`);
  // Procedure shape present (e.g. the pH practical carries labelled colour swatches).
  const ph = PRACTICALS.find((p) => p.swatches?.length);
  assert.ok(ph && ph.steps?.length && ph.apparatus?.length, "a procedure practical with swatches exists");
  assert.ok(ph.swatches.every((s) => s.label && /^#[0-9a-f]{3,8}$/i.test(s.color)), "swatches are {label,color-hex}");
});

test("the data-handling practical is cross-cutting AO3, not a Unit 6 topic", () => {
  const p = practicalById("P6.1");
  assert.ok(p, "P6.1 present");
  assert.equal(p.crossCutting, true, "P6.1 is tagged cross-cutting");
  assert.equal(p.unit, undefined, "P6.1 has no numbered syllabus unit");
  assert.ok(!/^\d/.test(p.ref), `P6.1 ref is not a syllabus code, got "${p.ref}"`);
  // No numbered-unit practical is wrongly flagged cross-cutting.
  for (const q of PRACTICALS) assert.ok(!(q.crossCutting && q.unit != null), `${q.id}: cross-cutting xor numbered unit`);
});

// Standing invariants: rules that must hold for EVERY practicals item, so new
// questions are checked automatically. These deliberately assert no item counts.
test("every practicals item obeys the standing invariants", () => {
  const seen = new Set();
  for (const p of PRACTICALS) {
    for (const it of p.items) {
      const where = it.id;
      assert.ok(it.id && !seen.has(it.id), `unique id: ${it.id}`);
      seen.add(it.id);
      assert.ok(ITEM_TYPES.has(it.type), `${where}: known type ${it.type}`);
      assert.ok(typeof it.why === "string" && it.why.trim().length > 0, `${where}: non-empty why`);

      if (it.type === "choice") {
        assert.ok(Array.isArray(it.options) && it.options.length >= 2, `${where}: choice needs options`);
        assert.equal(it.a, 0, `${where}: choice must stay correct-first (a === 0)`);
        assert.equal(new Set(it.options).size, it.options.length, `${where}: duplicate options`);
      } else if (it.type === "truefalse") {
        assert.equal(typeof it.answer, "boolean", `${where}: truefalse answer must be a boolean`);
      } else if (it.type === "multi") {
        assert.ok(Array.isArray(it.options) && it.options.length >= 2, `${where}: multi needs options`);
        assert.ok(Array.isArray(it.a) && it.a.length >= 1, `${where}: multi needs correct indexes`);
        assert.equal(new Set(it.a).size, it.a.length, `${where}: repeated correct index`);
        for (const i of it.a) assert.ok(Number.isInteger(i) && i >= 0 && i < it.options.length, `${where}: a index out of range`);
        assert.equal(new Set(it.options).size, it.options.length, `${where}: duplicate options`);
      } else if (it.type === "match") {
        assert.ok(Array.isArray(it.pairs) && it.pairs.length >= 2, `${where}: match needs pairs`);
        for (const pr of it.pairs) assert.equal(pr.length, 2, `${where}: pair shape`);
        const rights = it.pairs.map((pr) => pr[1]);
        assert.equal(new Set(rights).size, rights.length, `${where}: repeated pair answer`);
        if (it.extra !== undefined) {
          assert.ok(Array.isArray(it.extra) && it.extra.every((e) => typeof e === "string" && e.trim()), `${where}: extra are non-empty strings`);
          assert.equal(new Set(it.extra).size, it.extra.length, `${where}: repeated extra decoy`);
          const rset = new Set(rights);
          for (const e of it.extra) assert.ok(!rset.has(e), `${where}: extra "${e.slice(0, 30)}" duplicates a pair answer (second-correct)`);
        }
      } else if (it.type === "chain") {
        assert.ok(Array.isArray(it.chunks) && it.chunks.length >= 2, `${where}: chain needs steps`);
        assert.equal(new Set(it.chunks).size, it.chunks.length, `${where}: repeated step`);
      }
    }
  }
});
