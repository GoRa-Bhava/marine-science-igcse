import { test } from "node:test";
import assert from "node:assert/strict";
import { makeBackup, readBackup } from "./settings-io.js";
import { BACKUP_SCHEMA } from "./theme.js";

test("backup round-trips: export then import returns the same progress", () => {
  const progress = { items: { a: { seen: true } }, creatures: ["c1"], mastered: ["t1"], runs: {}, settings: { theme: "light", feedback: "review" }, version: 5 };
  const file = JSON.stringify(makeBackup(JSON.stringify(progress)));
  const res = readBackup(file);
  assert.ok(res.ok);
  assert.deepEqual(res.progress, progress);
});

test("a backup carries the schemaVersion", () => {
  const b = makeBackup(JSON.stringify({ items: {} }));
  assert.equal(b.schemaVersion, BACKUP_SCHEMA);
  assert.equal(typeof b.exportedAt, "string");
  assert.ok(b.progress && typeof b.progress === "object");
});

test("a legacy raw-progress backup (no schemaVersion) still imports", () => {
  const raw = JSON.stringify({ items: {}, creatures: [], mastered: [], runs: {}, version: 5 });
  const res = readBackup(raw);
  assert.ok(res.ok);
  assert.equal(res.progress.version, 5);
});

test("bad or incompatible files are rejected and change nothing", () => {
  assert.equal(readBackup("not json").ok, false);
  assert.equal(readBackup("[1,2,3]").ok, false);
  assert.equal(readBackup("42").ok, false);
  const newer = JSON.stringify({ schemaVersion: BACKUP_SCHEMA + 1, progress: { items: {} } });
  const res = readBackup(newer);
  assert.equal(res.ok, false);
  assert.equal(res.error, "newer-schema");
});
