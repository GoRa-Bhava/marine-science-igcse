import { test } from "node:test";
import assert from "node:assert/strict";
import { IDBFactory } from "fake-indexeddb";
import { createProgressStore } from "./progressStore.js";

// Writing practice must be fully isolated: writing self-marks live in their own kv
// record and never touch item progress, section state or the Mixed-Practice schedule
// (which feed coverage, readiness and mixed practice).
test("writing self-marks are isolated from item/section/SR progress", async () => {
  const store = await createProgressStore({ indexedDB: new IDBFactory() });

  // Seed some ordinary progress + an SR entry (what readiness/mixed read).
  await store.putItemProgress({ id: "U1-01", box: 2, everCorrect: true });
  await store.putSectionState({ id: "1.1", status: "in_progress" });
  await store.putSRMap({ "U1-01": { due: 123, stability: 4 } });

  const itemsBefore = await store.getAllItemProgress();
  const sectionsBefore = await store.getAllSectionState();
  const srBefore = await store.getSRMap();

  // Do "writing" work.
  await store.putWriting({ "W1-01": { lastScore: 3, bestScore: 3, attempts: 1, lastAt: Date.now(), text: "an answer" } });

  // Writing round-trips on its own record.
  const w = await store.getWriting();
  assert.equal(w["W1-01"].lastScore, 3);
  assert.equal(w["W1-01"].text, "an answer");

  // Nothing else moved.
  assert.deepEqual(await store.getAllItemProgress(), itemsBefore, "item progress unchanged");
  assert.deepEqual(await store.getAllSectionState(), sectionsBefore, "section state unchanged");
  assert.deepEqual(await store.getSRMap(), srBefore, "spaced-repetition schedule unchanged");
});

test("deleting written answers strips text but keeps the self-mark, and still touches nothing else", async () => {
  const store = await createProgressStore({ indexedDB: new IDBFactory() });
  await store.putItemProgress({ id: "U1-02", box: 1 });
  await store.putWriting({ "W1-02": { lastScore: 4, bestScore: 4, attempts: 2, lastAt: 1, text: "kept locally" } });

  // Simulate the Settings "Delete my written answers": strip text from every entry.
  const cur = await store.getWriting();
  const stripped = {};
  for (const [id, rec] of Object.entries(cur)) { const { text, ...keep } = rec; stripped[id] = keep; }
  await store.putWriting(stripped);

  const after = await store.getWriting();
  assert.equal(after["W1-02"].text, undefined, "text removed");
  assert.equal(after["W1-02"].lastScore, 4, "self-mark kept");
  assert.equal((await store.getItemProgress("U1-02")).box, 1, "item progress untouched");
});
