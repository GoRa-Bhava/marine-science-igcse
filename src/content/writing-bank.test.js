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
