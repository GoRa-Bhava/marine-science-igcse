import { test } from "node:test";
import assert from "node:assert/strict";
import { IDBFactory } from "fake-indexeddb";
import { createTeacherStore, classIdForCode } from "./teacherStore.js";

// A fresh, isolated IndexedDB per store (so tests don't share state).
const freshStore = () => createTeacherStore(new IDBFactory());

function report(name, code, extra = {}) {
  return { v: 1, app: "0697", n: name, c: code, d: "2026-11-08", u: {}, tp: {}, mp: [], w: {}, ...extra };
}

test("addReport groups students under a class by code", async () => {
  const s = freshStore();
  await s.addReport(report("Maya R", "10B-MARINE"));
  await s.addReport(report("Sam T", "10B-MARINE"));
  await s.addReport(report("Lee P", "9C-SCI"));
  const classes = await s.listClasses();
  const c10 = classes.find((c) => c.code === "10B-MARINE");
  assert.equal(c10.students.length, 2);
  assert.deepEqual(c10.students.map((x) => x.name).sort(), ["Maya R", "Sam T"]);
  assert.equal(classIdForCode("10b-marine"), "code:10B-MARINE"); // normalised
});

test("re-importing the same student and class replaces the older report", async () => {
  const s = freshStore();
  await s.addReport(report("Maya R", "10B", { u: { 1: [5, 10, 2] } }));
  await s.addReport(report("maya r", "10B", { u: { 1: [10, 10, 9] } })); // same name (case/space-insensitive)
  const classes = await s.listClasses();
  const c = classes.find((x) => x.code === "10B");
  assert.equal(c.students.length, 1);
  assert.deepEqual(c.students[0].report.u[1], [10, 10, 9]); // newest wins
});

test("a report with no class code lands in a no-code class", async () => {
  const s = freshStore();
  await s.addReport(report("Jo", ""));
  const classes = await s.listClasses();
  assert.equal(classes.length, 1);
  assert.equal(classes[0].students[0].name, "Jo");
});

test("createClass makes an empty codeless class", async () => {
  const s = freshStore();
  const cls = await s.createClass("My tutees");
  assert.equal(cls.code, "");
  const classes = await s.listClasses();
  assert.ok(classes.some((c) => c.name === "My tutees"));
});

test("deleteStudent and deleteClass remove data", async () => {
  const s = freshStore();
  await s.addReport(report("Maya R", "10B"));
  await s.addReport(report("Sam T", "10B"));
  await s.deleteStudent(classIdForCode("10B"), "Maya R");
  let classes = await s.listClasses();
  assert.deepEqual(classes[0].students.map((x) => x.name), ["Sam T"]);
  await s.deleteClass(classIdForCode("10B"));
  classes = await s.listClasses();
  assert.equal(classes.length, 0);
});

test("exportAll / importAll round-trips and merges", async () => {
  const s1 = freshStore();
  await s1.addReport(report("Maya R", "10B"));
  const dump = await s1.exportAll();
  assert.equal(dump.kind, "teacher-backup");

  const s2 = freshStore();
  await s2.addReport(report("Sam T", "9C"));
  await s2.importAll(dump); // merge
  const classes = await s2.listClasses();
  assert.equal(classes.length, 2);
  assert.ok(classes.some((c) => c.code === "10B"));
  assert.ok(classes.some((c) => c.code === "9C"));
});

test("memory backend works with no IndexedDB", async () => {
  const s = createTeacherStore(null); // force memory
  await s.addReport(report("Maya R", "10B"));
  const classes = await s.listClasses();
  assert.equal(classes[0].students[0].name, "Maya R");
});
