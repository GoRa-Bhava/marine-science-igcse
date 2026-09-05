import { test } from "node:test";
import assert from "node:assert/strict";
import {
  answer, isDue, itemStrength, migrateRecord, migrateProgress,
  addDays, todayISO, PROGRESS_VERSION,
} from "./scheduler.js";

const at = (iso) => new Date(iso);
const T0 = at("2026-09-05T10:00:00Z");
const whenDue = (rec) => at(`${rec.due}T10:00:00Z`); // the moment it falls due

test("a new item answered right is scheduled ahead, at least a day out", () => {
  const rec = answer(undefined, true, T0);
  assert.equal(rec.seen, true);
  assert.ok(rec.due > todayISO(T0));
  assert.ok(rec.fsrs.stability > 0);
  assert.equal(isDue(rec, T0), false);
  assert.equal(isDue(rec, whenDue(rec)), true);
});

test("a wrong answer comes back tomorrow", () => {
  const fresh = answer(undefined, false, T0);
  assert.equal(fresh.due, addDays(1, T0));

  let rec = answer(undefined, true, T0);
  rec = answer(rec, true, whenDue(rec));
  const lapsed = answer(rec, false, whenDue(rec));
  assert.equal(lapsed.due, addDays(1, whenDue(rec)));
  assert.equal(lapsed.fsrs.lapses, 1);
});

test("a correct answer before the gap has passed changes nothing", () => {
  const rec = answer(undefined, true, T0);
  const early = at("2026-09-05T18:00:00Z");
  assert.equal(isDue(rec, early), false);
  assert.strictEqual(answer(rec, true, early), rec);
});

test("a wrong answer before the gap has passed still counts as a lapse", () => {
  let rec = answer(undefined, true, T0);
  rec = answer(rec, true, whenDue(rec));
  const early = at(`${addDays(-1, whenDue(rec))}T10:00:00Z`);
  assert.equal(isDue(rec, early), false);
  const lapsed = answer(rec, false, early);
  assert.notStrictEqual(lapsed, rec);
  assert.ok(lapsed.fsrs.stability < rec.fsrs.stability);
});

test("intervals grow with each successful review and differ per item", () => {
  const gap = (rec, prevDue) => (at(rec.due) - at(prevDue)) / 86400e3;
  let a = answer(undefined, true, T0);
  let b = answer(undefined, true, T0);
  assert.equal(a.due, b.due);

  // a: right every time; b: stumbles once
  const aGaps = [];
  for (let i = 0; i < 4; i++) {
    const na = answer(a, true, whenDue(a));
    aGaps.push(gap(na, a.due));
    a = na;
    b = answer(b, i !== 1, whenDue(b));
  }
  assert.ok(aGaps.every((g, i) => i === 0 || g > aGaps[i - 1]), `a gaps grow: ${aGaps}`);
  assert.notEqual(a.due, b.due);
  assert.ok(a.fsrs.stability > b.fsrs.stability);
});

test("strength follows the old box ladder through stability", () => {
  const s = (stability) => itemStrength({ seen: true, fsrs: { stability } });
  assert.equal(s(0.5), 0);
  assert.equal(s(1), 0.25);
  assert.equal(s(3), 0.5);
  assert.equal(s(7), 0.75);
  assert.equal(s(21), 1);
  assert.equal(s(100), 1);
  assert.equal(itemStrength(undefined), 0);
  assert.ok(s(5) > 0.5 && s(5) < 0.75);
});

test("old box records migrate without changing strength, due or seen", () => {
  for (let box = 0; box <= 4; box++) {
    const old = { box, due: "2026-09-04", seen: true };
    const m = migrateRecord(old, T0);
    assert.equal(m.seen, true);
    assert.equal(m.due, "2026-09-04");
    assert.equal(m.box, undefined);
    assert.equal(itemStrength(m), box / 4, `box ${box}`);
    assert.equal(isDue(m, T0), true);
    // and it keeps scheduling from there
    const next = answer(m, true, T0);
    assert.ok(next.due > todayISO(T0));
    assert.ok(next.fsrs.reps > m.fsrs.reps);
  }
});

test("progress migrates once and fresh progress is left alone", () => {
  const old = {
    items: { a: { box: 2, due: "2026-09-01", seen: true }, b: { box: 4, due: "2026-10-01", seen: true } },
    creatures: ["clownfish"], mastered: [],
  };
  const { progress, migrated } = migrateProgress(old, T0);
  assert.equal(migrated, true);
  assert.equal(progress.version, PROGRESS_VERSION);
  assert.ok(progress.items.a.fsrs && progress.items.b.fsrs);
  assert.deepEqual(progress.creatures, ["clownfish"]);
  const again = migrateProgress(progress, T0);
  assert.equal(again.migrated, false);
  assert.strictEqual(again.progress, progress);

  const fresh = { items: {}, creatures: [], mastered: [], version: PROGRESS_VERSION };
  assert.strictEqual(migrateProgress(fresh, T0).progress, fresh);
});

test("records survive a JSON round trip", () => {
  const rec = answer(undefined, true, T0);
  const back = JSON.parse(JSON.stringify(rec));
  const next = answer(back, true, whenDue(back));
  assert.ok(next.fsrs.stability > back.fsrs.stability);
});
