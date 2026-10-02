import { test } from "node:test";
import assert from "node:assert/strict";
import { IDBFactory } from "fake-indexeddb";
import {
  createProgressStore, createMemoryStore, SCHEMA_VERSION, ProgressStore, MemoryBackend,
} from "./progressStore.js";

test("memory store: item progress put/get round-trips and stamps updatedAt + logical id", async () => {
  const s = createMemoryStore();
  await s.ready();
  const out = await s.putItemProgress({ id: "Q1", box: 2, seen: true, everCorrect: true });
  assert.equal(out.id, "Q1", "returns the logical itemId, not the composite key");
  assert.ok(out.updatedAt > 0, "stamped updatedAt");
  const got = await s.getItemProgress("Q1");
  assert.equal(got.box, 2);
  assert.equal(got.everCorrect, true);
  assert.equal(await s.getItemProgress("nope"), null);
});

test("getAllItemProgress returns the active profile's records, stripped to itemId", async () => {
  const s = createMemoryStore();
  await s.putItemProgress({ id: "Q1", box: 1 });
  await s.putItemProgress({ id: "Q2", box: 3 });
  const all = await s.getAllItemProgress();
  assert.equal(all.length, 2);
  assert.deepEqual(all.map((r) => r.id).sort(), ["Q1", "Q2"]);
});

test("deleteItemProgress / Many / deleteSectionState wipe within the active profile", async () => {
  const s = createMemoryStore();
  await s.putItemProgress({ id: "Q1", box: 3 });
  await s.putItemProgress({ id: "Q2", box: 1 });
  await s.putItemProgress({ id: "Q3", box: 2 });
  await s.deleteItemProgress("Q1");
  assert.equal(await s.getItemProgress("Q1"), null);
  await s.deleteItemProgressMany(["Q2"]);
  assert.equal(await s.getItemProgress("Q2"), null);
  assert.equal((await s.getItemProgress("Q3")).box, 2, "unlisted survives");
  await s.putSectionState({ id: "3.1", status: "in_progress" });
  await s.deleteSectionState("3.1");
  assert.equal(await s.getSectionState("3.1"), null);
  await s.deleteItemProgress("nope"); await s.deleteItemProgressMany(); // safe no-ops
});

test("bookmark, section state and per-profile settings persist and merge", async () => {
  const s = createMemoryStore();
  await s.putBookmark({ mode: "read", sectionId: "1.1", itemId: "Q3", index: 4 });
  const bm = await s.getBookmark();
  assert.equal(bm.id, "bookmark", "logical id preserved to the caller");
  assert.equal(bm.itemId, "Q3");

  await s.putSectionState({ id: "1.1", complete: false });
  await s.putSectionState({ id: "1.2", complete: true });
  assert.equal((await s.getSectionState("1.2")).complete, true);
  assert.equal((await s.getAllSectionState()).length, 2);

  await s.putSettings({ examDate: "2026-11-01" });
  await s.putSettings({ nudgeToSmartPractice: true });
  const st = await s.getSettings();
  assert.equal(st.examDate, "2026-11-01", "settings merge, not overwrite");
  assert.equal(st.nudgeToSmartPractice, true);
});

test("meta carries schemaVersion 2 + a generated deviceId; a default profile exists", async () => {
  const s = createMemoryStore();
  const meta = await s.getMeta();
  assert.equal(meta.schemaVersion, SCHEMA_VERSION);
  assert.equal(SCHEMA_VERSION, 2);
  assert.ok(typeof meta.deviceId === "string" && meta.deviceId.length > 0);
  const profiles = s.listProfiles();
  assert.equal(profiles.length, 1, "seeded with exactly one profile");
  assert.ok(s.getActiveProfileId(), "an active profile id is set");
  assert.equal(s.getActiveProfile().name, "Me");
});

/* ---- profiles ---- */

test("profiles are fully isolated: progress in one does not leak to another", async () => {
  const s = createMemoryStore();
  await s.ready();
  const me = s.getActiveProfileId();
  await s.putItemProgress({ id: "Q1", box: 5 });
  const ravi = await s.createProfile("Ravi", "#F3C34E");
  assert.equal(s.listProfiles().length, 2);
  await s.setActiveProfile(ravi.id);
  assert.equal(await s.getItemProgress("Q1"), null, "Ravi starts empty");
  await s.putItemProgress({ id: "Q1", box: 1 });
  await s.setActiveProfile(me);
  assert.equal((await s.getItemProgress("Q1")).box, 5, "Me's Q1 is untouched");
  await s.setActiveProfile(ravi.id);
  assert.equal((await s.getItemProgress("Q1")).box, 1, "Ravi's Q1 is its own");
});

test("rename and delete a profile; delete removes only its data and never leaves zero", async () => {
  const s = createMemoryStore();
  await s.ready();
  const me = s.getActiveProfileId();
  await s.putItemProgress({ id: "Q1", box: 4 });
  const mira = await s.createProfile("Mira");
  await s.setActiveProfile(mira.id);
  await s.putItemProgress({ id: "Q9", box: 2 });
  await s.renameProfile(mira.id, { name: "Mira R", color: "#FF7A5C" });
  assert.equal(s.listProfiles().find((p) => p.id === mira.id).name, "Mira R");
  // delete Mira (active) → falls back to Me, Mira's data gone
  await s.deleteProfile(mira.id);
  assert.equal(s.getActiveProfileId(), me, "active fell back to the remaining profile");
  assert.equal(s.listProfiles().length, 1);
  await s.setActiveProfile(me);
  assert.equal((await s.getItemProgress("Q1")).box, 4, "Me's data intact");
  // deleting the last profile seeds a fresh default (never zero)
  await s.deleteProfile(me);
  assert.equal(s.listProfiles().length, 1, "a fresh default profile replaces the last one");
  assert.ok(s.getActiveProfileId());
});

test("deviceSettings are shared and separate from per-profile settings (entitlement lives here)", async () => {
  const s = createMemoryStore();
  await s.ready();
  await s.putDeviceSettings({ entitlement: { valid: true, maxProfiles: 3, tier: "family" } });
  const a = s.getActiveProfileId();
  const b = await s.createProfile("B");
  await s.setActiveProfile(b.id);
  const dev = await s.getDeviceSettings();
  assert.equal(dev.entitlement.maxProfiles, 3, "entitlement is device-level, visible from any profile");
  await s.putSettings({ examDate: "2026-06-01" });
  await s.setActiveProfile(a);
  assert.notEqual((await s.getSettings()).examDate, "2026-06-01", "examDate is per profile");
});

/* ---- migration ---- */

test("v1 → v2 migration folds an existing single-learner store into a default profile (lossless)", async () => {
  const backend = new MemoryBackend();
  await backend.put("kv", { id: "meta", schemaVersion: 1, deviceId: "seed-dev", createdAt: 1, updatedAt: 1 });
  await backend.put("items", { id: "Q1", itemId: "Q1", box: 4, everCorrect: true, updatedAt: 10 });
  await backend.put("sections", { id: "1.1", sectionId: "1.1", status: "in_progress", updatedAt: 10 });
  await backend.put("kv", { id: "bookmark", mode: "read", itemId: "Q1", updatedAt: 10 });
  await backend.put("kv", { id: "bookmarks", byUnit: { 1: { unitId: 1, itemId: "Q1" } }, lastUnitId: 1, updatedAt: 10 });
  await backend.put("kv", { id: "settings", examDate: "2026-05-01", creatures: ["lugworm"], theme: "dark", updatedAt: 10 });

  const s = new ProgressStore(backend); // real MIGRATIONS
  await s.ready();

  assert.equal((await s.getMeta()).schemaVersion, 2, "schemaVersion bumped");
  assert.equal((await s.getMeta()).deviceId, "seed-dev", "deviceId preserved");
  assert.equal(s.listProfiles().length, 1, "default profile created");
  assert.equal(s.getActiveProfile().name, "Me");
  assert.equal((await s.getItemProgress("Q1")).box, 4, "item progress carried into the default profile");
  assert.equal((await s.getSectionState("1.1")).status, "in_progress", "section state carried");
  assert.equal((await s.getBookmark()).itemId, "Q1", "bookmark carried");
  assert.equal((await s.getBookmarks()).lastUnitId, 1, "per-unit bookmarks carried");
  assert.equal((await s.getSettings()).examDate, "2026-05-01", "examDate moved into per-profile settings");
  assert.deepEqual((await s.getSettings()).creatures, ["lugworm"], "creatures moved into per-profile settings");
});

test("a store already at v2 runs no migration", async () => {
  const idb = new IDBFactory();
  const s1 = await createProgressStore({ indexedDB: idb });
  assert.equal((await s1.getMeta()).schemaVersion, 2);
  await s1.putItemProgress({ id: "Q1", box: 2 });
  const s2 = await createProgressStore({ indexedDB: idb });
  assert.equal((await s2.getItemProgress("Q1")).box, 2, "no re-migration, data intact");
});

/* ---- export / import ---- */

test("exportAll / importAll round-trips all profiles into a fresh store", async () => {
  const a = createMemoryStore();
  await a.ready();
  await a.putItemProgress({ id: "Q1", box: 4 });
  await a.putSectionState({ id: "1.1", complete: true });
  await a.putBookmarks({ byUnit: { 1: { unitId: 1, itemId: "Q1", indexInSection: 3 } }, lastUnitId: 1 });
  await a.putSettings({ examDate: "2026-12-01" });
  const kid = await a.createProfile("Kid");
  await a.setActiveProfile(kid.id);
  await a.putItemProgress({ id: "Q2", box: 1 });
  await a.setActiveProfile(a.listProfiles()[0].id);

  const dump = await a.exportAll();
  assert.equal(dump.schemaVersion, SCHEMA_VERSION);

  const b = createMemoryStore();
  const res = await b.importAll(dump, { merge: false });
  assert.ok(res.imported >= 3);
  assert.equal(b.listProfiles().length, 2, "both profiles imported");
  assert.equal((await b.getItemProgress("Q1")).box, 4);
  assert.equal((await b.getSectionState("1.1")).complete, true);
  assert.equal((await b.getBookmarks()).lastUnitId, 1);
  assert.equal((await b.getSettings()).examDate, "2026-12-01");
  await b.setActiveProfile(kid.id);
  assert.equal((await b.getItemProgress("Q2")).box, 1, "the second profile's data imported and is isolated");
});

test("importAll merge keeps the newer record (last-write-wins by updatedAt)", async () => {
  const a = createMemoryStore(); await a.ready();
  const local = await a.putItemProgress({ id: "Q1", box: 5 }); // newer
  const pid = a.getActiveProfileId();
  const older = { id: `${pid}::Q1`, itemId: "Q1", profileId: pid, box: 1, updatedAt: local.updatedAt - 1000 };
  const newer = { id: `${pid}::Q2`, itemId: "Q2", profileId: pid, box: 2, updatedAt: Date.now() + 1000 };
  await a.importAll({ items: [older, newer] });
  assert.equal((await a.getItemProgress("Q1")).box, 5, "kept newer local Q1");
  assert.equal((await a.getItemProgress("Q2")).box, 2, "imported new Q2");
});

/* ---- clearAll / robustness ---- */

test("clearAll wipes everything device-wide but leaves one fresh default profile", async () => {
  const s = createMemoryStore(); await s.ready();
  await s.putItemProgress({ id: "Q1", box: 3 });
  await s.createProfile("Extra");
  await s.clearAll();
  assert.equal(s.listProfiles().length, 1, "back to a single default profile");
  assert.equal(await s.getItemProgress("Q1"), null, "progress wiped");
  assert.ok(s.getActiveProfileId());
});

test("throw-safe: a backend that throws degrades to memory instead of crashing", async () => {
  const s = createMemoryStore();
  await s.ready();
  s.backend = { memory: false, get: () => { throw new Error("boom"); }, put: () => { throw new Error("boom"); }, getAll: () => { throw new Error("boom"); }, delete: () => { throw new Error("boom"); }, clear: () => {} };
  const got = await s.getItemProgress("Q1");
  assert.equal(got, null, "read returns safe default");
  assert.equal(s.isMemoryFallback, true, "degraded to memory");
  await s.deleteItemProgress("Q1"); // must not throw
  const w = await s.putItemProgress({ id: "Q2", box: 1 });
  assert.equal(w.id, "Q2");
});

test("factory falls back to memory when no IndexedDB is present", async () => {
  const s = await createProgressStore({ indexedDB: null });
  assert.equal(s.isMemoryFallback, true);
  await s.putItemProgress({ id: "Q1", box: 1 });
  assert.equal((await s.getItemProgress("Q1")).box, 1);
});

test("IndexedDB backend (fake-indexeddb): round-trips, namespacing and delete persist across reopen", async () => {
  const idb = new IDBFactory();
  const s1 = await createProgressStore({ indexedDB: idb });
  assert.equal(s1.isMemoryFallback, false, "used IndexedDB");
  await s1.putItemProgress({ id: "Q1", box: 3, everCorrect: true });
  await s1.putItemProgress({ id: "Q2", box: 1 });
  await s1.deleteItemProgress("Q2");
  await s1.putBookmark({ mode: "read", itemId: "Q1", index: 0 });
  const dev1 = (await s1.getMeta()).deviceId;

  const s2 = await createProgressStore({ indexedDB: idb });
  assert.equal(s2.isMemoryFallback, false);
  assert.equal((await s2.getItemProgress("Q1")).box, 3);
  assert.equal(await s2.getItemProgress("Q2"), null, "delete persisted");
  assert.equal((await s2.getBookmark()).itemId, "Q1");
  assert.equal((await s2.getMeta()).deviceId, dev1, "deviceId stable across sessions");
});
