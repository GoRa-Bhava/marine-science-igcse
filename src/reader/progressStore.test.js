import { test } from "node:test";
import assert from "node:assert/strict";
import { IDBFactory } from "fake-indexeddb";
import {
  createProgressStore, createMemoryStore, SCHEMA_VERSION, ProgressStore, MemoryBackend,
} from "./progressStore.js";

test("memory store: item progress put/get round-trips and stamps updatedAt + id", async () => {
  const s = createMemoryStore();
  await s.ready();
  const out = await s.putItemProgress({ id: "Q1", box: 2, seen: true, everCorrect: true });
  assert.equal(out.id, "Q1");
  assert.ok(out.updatedAt > 0, "stamped updatedAt");
  const got = await s.getItemProgress("Q1");
  assert.equal(got.box, 2);
  assert.equal(got.everCorrect, true);
  assert.equal(await s.getItemProgress("nope"), null);
});

test("getAllItemProgress returns everything written", async () => {
  const s = createMemoryStore();
  await s.putItemProgress({ id: "Q1", box: 1 });
  await s.putItemProgress({ id: "Q2", box: 3 });
  const all = await s.getAllItemProgress();
  assert.equal(all.length, 2);
  assert.deepEqual(all.map((r) => r.id).sort(), ["Q1", "Q2"]);
});

test("bookmark, section state and settings persist and merge", async () => {
  const s = createMemoryStore();
  await s.putBookmark({ mode: "read", sectionId: "1.1", itemId: "Q3", index: 4 });
  const bm = await s.getBookmark();
  assert.equal(bm.id, "bookmark");
  assert.equal(bm.itemId, "Q3");

  await s.putSectionState({ id: "1.1", complete: false, seen: 5, correct: 4 });
  await s.putSectionState({ id: "1.2", complete: true, seen: 8, correct: 8 });
  assert.equal((await s.getSectionState("1.2")).complete, true);
  assert.equal((await s.getAllSectionState()).length, 2);

  await s.putSettings({ examDate: "2026-11-01" });
  await s.putSettings({ flow: "reader" });
  const st = await s.getSettings();
  assert.equal(st.examDate, "2026-11-01", "settings merge, not overwrite");
  assert.equal(st.flow, "reader");
});

test("meta carries schemaVersion + a generated deviceId", async () => {
  const s = createMemoryStore();
  const meta = await s.getMeta();
  assert.equal(meta.schemaVersion, SCHEMA_VERSION);
  assert.ok(typeof meta.deviceId === "string" && meta.deviceId.length > 0);
});

test("exportAll / importAll round-trips into a fresh store", async () => {
  const a = createMemoryStore();
  await a.putItemProgress({ id: "Q1", box: 4 });
  await a.putSectionState({ id: "1.1", complete: true });
  await a.putBookmark({ mode: "read", itemId: "Q1" });
  await a.putSettings({ examDate: "2026-12-01" });
  const dump = await a.exportAll();
  assert.equal(dump.schemaVersion, SCHEMA_VERSION);

  const b = createMemoryStore();
  const res = await b.importAll(dump);
  assert.ok(res.imported >= 3);
  assert.equal((await b.getItemProgress("Q1")).box, 4);
  assert.equal((await b.getSectionState("1.1")).complete, true);
  assert.equal((await b.getBookmark()).itemId, "Q1");
  assert.equal((await b.getSettings()).examDate, "2026-12-01");
});

test("importAll merge keeps the newer record (last-write-wins by updatedAt)", async () => {
  const s = createMemoryStore();
  const local = await s.putItemProgress({ id: "Q1", box: 5 }); // newer
  const incomingOlder = { id: "Q1", box: 1, updatedAt: local.updatedAt - 1000 };
  const incomingNewer = { id: "Q2", box: 2, updatedAt: Date.now() + 1000 };
  await s.importAll({ items: [incomingOlder, incomingNewer] });
  assert.equal((await s.getItemProgress("Q1")).box, 5, "kept newer local Q1");
  assert.equal((await s.getItemProgress("Q2")).box, 2, "imported new Q2");
});

test("ordered migrations run once on load, transform data, and bump schemaVersion", async () => {
  // Pre-seed a backend that looks like an older schema (version 0) with real data.
  const backend = new MemoryBackend();
  await backend.put("kv", { id: "meta", schemaVersion: 0, deviceId: "seed-dev", createdAt: 1, updatedAt: 1 });
  await backend.put("items", { id: "Q1", box: 1, updatedAt: 1 });

  let ran = 0;
  const migrations = [{
    to: SCHEMA_VERSION, // brings version 0 -> current
    migrate: (d) => { ran++; d.items = (d.items || []).map((i) => ({ ...i, migrated: true })); return d; },
  }];

  const s = new ProgressStore(backend, migrations);
  await s.ready();

  assert.equal(ran, 1, "pending migration ran exactly once on init");
  assert.equal((await s.getMeta()).schemaVersion, SCHEMA_VERSION, "schemaVersion bumped");
  assert.equal((await s.getMeta()).deviceId, "seed-dev", "deviceId preserved through migration");
  assert.equal((await s.getItemProgress("Q1")).migrated, true, "data transformed by migration");

  // A store already at the current version runs no migration.
  let ran2 = 0;
  const backend2 = new MemoryBackend();
  await backend2.put("kv", { id: "meta", schemaVersion: SCHEMA_VERSION, deviceId: "d2", createdAt: 1, updatedAt: 1 });
  const s2 = new ProgressStore(backend2, [{ to: SCHEMA_VERSION, migrate: (d) => { ran2++; return d; } }]);
  await s2.ready();
  assert.equal(ran2, 0, "no migration when already at current version");
});

test("throw-safe: a backend that throws degrades to memory instead of crashing", async () => {
  const s = createMemoryStore();
  await s.ready();
  // Sabotage the backend so the next op throws.
  s.backend = { memory: false, get: () => { throw new Error("boom"); }, put: () => { throw new Error("boom"); }, getAll: () => { throw new Error("boom"); }, delete: () => {}, clear: () => {} };
  const got = await s.getItemProgress("Q1"); // should not throw
  assert.equal(got, null, "read returns safe default");
  assert.equal(s.isMemoryFallback, true, "degraded to memory");
  // after degrade, writes work again
  const w = await s.putItemProgress({ id: "Q2", box: 1 });
  assert.equal(w.id, "Q2");
  assert.equal((await s.getItemProgress("Q2")).box, 1);
});

test("factory falls back to memory when no IndexedDB is present", async () => {
  const s = await createProgressStore({ indexedDB: null });
  assert.equal(s.isMemoryFallback, true);
  await s.putItemProgress({ id: "Q1", box: 1 });
  assert.equal((await s.getItemProgress("Q1")).box, 1);
});

test("IndexedDB backend (fake-indexeddb): round-trips and persists across reopen", async () => {
  const idb = new IDBFactory(); // shared underlying data across opens
  const s1 = await createProgressStore({ indexedDB: idb });
  assert.equal(s1.isMemoryFallback, false, "used IndexedDB");
  await s1.putItemProgress({ id: "Q1", box: 3, everCorrect: true });
  await s1.putBookmark({ mode: "read", itemId: "Q1", index: 0 });
  const dev1 = (await s1.getMeta()).deviceId;

  // Reopen: data + deviceId survive.
  const s2 = await createProgressStore({ indexedDB: idb });
  assert.equal(s2.isMemoryFallback, false);
  assert.equal((await s2.getItemProgress("Q1")).box, 3);
  assert.equal((await s2.getBookmark()).itemId, "Q1");
  assert.equal((await s2.getMeta()).deviceId, dev1, "deviceId is stable across sessions");
});
