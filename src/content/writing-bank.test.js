import { test } from "node:test";
import assert from "node:assert/strict";
import { WRITING, WRITING_COMMANDS, scoreWriting, writingByUnit } from "./writing-bank.js";

test("writing bank: ids are unique and match W<unit>-NN", () => {
  const seen = new Set();
  for (const w of WRITING) {
    assert.match(w.id, /^W\d+-\d{2}$/, `${w.id} must match W<unit>-NN`);
    assert.equal(w.id, `W${w.unit}-${w.id.split("-")[1]}`, `${w.id} unit prefix must match unit ${w.unit}`);
    assert.ok(!seen.has(w.id), `duplicate id ${w.id}`);
    seen.add(w.id);
  }
});

test("writing bank: marks are 2-6 and points.length >= marks", () => {
  for (const w of WRITING) {
    assert.ok(Number.isInteger(w.marks) && w.marks >= 2 && w.marks <= 6, `${w.id} marks must be 2-6`);
    assert.ok(Array.isArray(w.points), `${w.id} points must be an array`);
    assert.ok(w.points.length >= w.marks, `${w.id} needs at least ${w.marks} points (has ${w.points.length})`);
  }
});

test("writing bank: every point has a non-empty t; accept is optional and a string", () => {
  for (const w of WRITING) {
    for (const p of w.points) {
      assert.equal(typeof p.t, "string");
      assert.ok(p.t.trim().length > 0, `${w.id} has an empty point`);
      if (p.accept !== undefined) assert.equal(typeof p.accept, "string", `${w.id} accept must be a string`);
    }
  }
});

test("writing bank: q and model are non-empty strings", () => {
  for (const w of WRITING) {
    assert.ok(typeof w.q === "string" && w.q.trim().length > 0, `${w.id} q must be non-empty`);
    assert.ok(typeof w.model === "string" && w.model.trim().length > 0, `${w.id} model must be non-empty`);
  }
});

test("writing bank: command is an allowed exam command word", () => {
  for (const w of WRITING) {
    assert.ok(WRITING_COMMANDS.includes(w.command), `${w.id} command "${w.command}" is not allowed`);
  }
});

test("writing bank: status is human_review", () => {
  for (const w of WRITING) assert.equal(w.status, "human_review", `${w.id} status must be human_review`);
});

test("writing bank: noCredit (when present) is an array of non-empty strings", () => {
  for (const w of WRITING) {
    if (w.noCredit === undefined) continue;
    assert.ok(Array.isArray(w.noCredit), `${w.id} noCredit must be an array`);
    for (const n of w.noCredit) assert.ok(typeof n === "string" && n.trim().length > 0, `${w.id} noCredit entry empty`);
  }
});

test("scoreWriting = min(ticked, marks), floored at 0", () => {
  assert.equal(scoreWriting(0, 4), 0);
  assert.equal(scoreWriting(3, 4), 3);
  assert.equal(scoreWriting(4, 4), 4);
  assert.equal(scoreWriting(6, 4), 4, "caps at marks");
  assert.equal(scoreWriting(99, 5), 5, "caps at marks");
  assert.equal(scoreWriting(-2, 4), 0, "floors at 0");
  assert.equal(scoreWriting(2.9, 4), 2, "floors fractional ticks");
  assert.equal(scoreWriting(NaN, 4), 0);
});

test("writingByUnit groups in ascending unit order, preserving bank order within a unit", () => {
  const groups = writingByUnit();
  const units = groups.map((g) => g.unit);
  assert.deepEqual(units, [...units].sort((a, b) => a - b), "units ascending");
  // every question appears exactly once
  const flat = groups.flatMap((g) => g.questions.map((q) => q.id));
  assert.equal(flat.length, WRITING.length);
  assert.equal(new Set(flat).size, WRITING.length);
});

import { scoreWritingItem, pointLabel } from "./writing-bank.js";

test("writing bank: caps refer to real point labels and are positive", () => {
  for (const w of WRITING) {
    if (!w.caps) continue;
    const labels = new Set(w.points.map(pointLabel).filter(Boolean));
    for (const c of w.caps) {
      assert.ok(Array.isArray(c.labels) && c.labels.length >= 1, `${w.id} cap needs labels`);
      for (const l of c.labels) assert.ok(labels.has(l), `${w.id} cap label "${l}" has no points`);
      assert.ok(Number.isInteger(c.max) && c.max >= 1, `${w.id} cap max must be a positive integer`);
    }
  }
});

test("writing bank: full marks are still reachable on every item after caps", () => {
  for (const w of WRITING) {
    const all = w.points.map((_, i) => i);
    assert.equal(scoreWritingItem(w, all), w.marks, `${w.id} cannot reach ${w.marks} with every point ticked`);
  }
});

test("scoreWritingItem applies single and combined caps", () => {
  const item = { marks: 6, points: [
    { t: "Strength: a" }, { t: "Strength: b" }, { t: "Strength: c" }, { t: "Strength: d" },
    { t: "Limitation: e" }, { t: "Limitation: f" }, { t: "Limitation: g" }, { t: "Judgement: h" } ],
    caps: [{ labels: ["Strength"], max: 3 }, { labels: ["Limitation"], max: 3 }, { labels: ["Strength", "Limitation"], max: 5 }] };
  assert.equal(scoreWritingItem(item, [0, 1, 2, 3]), 3, "single cap");
  assert.equal(scoreWritingItem(item, [0, 1, 2, 3, 4, 5, 6]), 5, "combined cap");
  assert.equal(scoreWritingItem(item, [0, 1, 2, 4, 5, 7]), 6, "judgement lifts to full marks");
  assert.equal(scoreWritingItem({ marks: 4, points: [{ t: "a" }, { t: "b" }] }, [0, 1, 1, 9]), 2, "no caps, ignores duplicates and bad indices");
});

test("no single capped group (or combined cap) reaches full marks on its own", () => {
  for (const w of WRITING) {
    for (const c of w.caps || []) {
      const only = w.points.map((p, i) => (c.labels.includes(pointLabel(p)) ? i : -1)).filter((i) => i >= 0);
      assert.ok(scoreWritingItem(w, only) < w.marks, `${w.id}: the ${c.labels.join("+")} points alone reach full marks`);
    }
  }
});
