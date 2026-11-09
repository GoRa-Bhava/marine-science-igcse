import { test } from "node:test";
import assert from "node:assert/strict";
import {
  encodeReport,
  decodeReport,
  encodeAssignment,
  decodeAssignment,
  encodeResult,
  decodeResult,
  reportUrl,
  assignmentUrl,
  resultUrl,
  readHash,
  REPORT_SIZE_LIMIT,
} from "./reportCodec.js";

// ---- builders ----
function sampleReport() {
  return {
    app: "0697",
    n: "Maya R",
    c: "10B-MARINE",
    d: "2026-11-08",
    u: { 1: [12, 20, 9], 2: [8, 18, 5], 3: [4, 16, 1] },
    tp: { "1-cells": [6, 4], "2-osmosis": [5, 2], "3-tides": [3, 0] },
    mp: [["U2-14", 1], ["U3-07", [0, 2]], ["U1-22", 3]],
    w: { "W-01": [3, 6, [0, 2]], "W-05": [5, 8, [1]] },
    rd: { 1: 72, 2: 40 },
    ex: "2027-05-14",
  };
}

// A big, realistic profile: 6 units, 41 topics, 40 wrong picks, 14 writing answers.
function fullReport() {
  const u = {};
  for (let i = 1; i <= 6; i++) u[i] = [20, 25, 10 + i];
  const tp = {};
  for (let i = 0; i < 41; i++) tp[`t-${i}`] = [(i % 7) + 1, i % 4];
  const mp = [];
  for (let i = 0; i < 40; i++) mp.push([`U${(i % 6) + 1}-${String(i).padStart(2, "0")}`, i % 2 ? [0, 3] : (i % 4)]);
  const w = {};
  for (let i = 0; i < 14; i++) w[`W-${String(i).padStart(2, "0")}`] = [i % 7, 8, [0, 1, 3].slice(0, i % 4)];
  return { app: "0697", n: "Zoë Łukáš-Ødegård 🐙", c: "SET-2-MARINE", d: "2026-11-09", u, tp, mp, w, rd: { 1: 80, 2: 55 }, ex: "2027-05-14" };
}

// ---- report round-trip ----
test("report round-trips exactly and carries v:1", async () => {
  const data = sampleReport();
  const code = await encodeReport(data);
  assert.ok(code.startsWith("WC1."), "has WC1. prefix");
  const back = await decodeReport(code);
  assert.equal(back.v, 1);
  delete back.v;
  assert.deepEqual(back, data);
});

test("report with unicode name round-trips", async () => {
  const data = { ...sampleReport(), n: "Zoë Łukáš 🐙", c: "Ωmega" };
  const back = await decodeReport(await encodeReport(data));
  assert.equal(back.n, "Zoë Łukáš 🐙");
  assert.equal(back.c, "Ωmega");
});

// ---- size target + trimming ----
test("full profile encodes under 1.5 KB and still decodes", async () => {
  const code = await encodeReport(fullReport());
  assert.ok(code.length <= REPORT_SIZE_LIMIT, `code length ${code.length} should be <= ${REPORT_SIZE_LIMIT}`);
  const back = await decodeReport(code);
  // Required fields survive trimming.
  assert.equal(back.n, "Zoë Łukáš-Ødegård 🐙");
  assert.ok(back.u && Object.keys(back.u).length === 6);
});

test("a small report is not trimmed (misconceptions kept in full)", async () => {
  const data = sampleReport();
  const back = await decodeReport(await encodeReport(data));
  assert.deepEqual(back.mp, data.mp);
  assert.deepEqual(back.w, data.w);
});

// ---- assignment & result round-trips ----
test("assignment round-trips (WA1.)", async () => {
  const data = { id: "a1b2c3d4", t: "Tides & currents", due: "2026-11-14", cls: "10B-MARINE", ids: ["U2-01", "U2-05", "U3-09"], n: 10 };
  const code = await encodeAssignment(data);
  assert.ok(code.startsWith("WA1."));
  const back = await decodeAssignment(code);
  assert.equal(back.v, 1);
  delete back.v;
  assert.deepEqual(back, data);
});

test("result round-trips (WR1.)", async () => {
  const data = { aid: "a1b2c3d4", n: "Maya R", c: "10B-MARINE", d: "2026-11-12", r: [["U2-01", 1], ["U2-05", 0, 2], ["U3-09", 0, [0, 1]]] };
  const code = await encodeResult(data);
  assert.ok(code.startsWith("WR1."));
  const back = await decodeResult(code);
  delete back.v;
  assert.deepEqual(back, data);
});

// ---- friendly errors ----
async function rejectsFriendly(promise, reMatch) {
  await assert.rejects(promise, (e) => {
    assert.equal(e.friendly, true, "error is friendly");
    assert.equal(typeof e.message, "string");
    if (reMatch) assert.match(e.message, reMatch);
    return true;
  });
}

test("truncated code gives a friendly error", async () => {
  const code = await encodeReport(fullReport());
  const chopped = code.slice(0, Math.floor(code.length * 0.6));
  await rejectsFriendly(decodeReport(chopped));
});

test("corrupted body gives a friendly error", async () => {
  const code = await encodeReport(sampleReport());
  // flip several characters in the middle of the base64url body
  const arr = code.split("");
  const mid = Math.floor(arr.length / 2);
  for (let i = 0; i < 6; i++) {
    const ch = arr[mid + i];
    arr[mid + i] = ch === "A" ? "B" : "A";
  }
  await rejectsFriendly(decodeReport(arr.join("")));
});

test("newer version gives an update-the-app error", async () => {
  await rejectsFriendly(decodeReport("WC2.AAAA"), /newer version/i);
});

test("wrong kind is rejected (result decoded as report)", async () => {
  const r = await encodeResult({ aid: "x", n: "A", c: "", d: "2026-11-12", r: [] });
  await rejectsFriendly(decodeReport(r), /progress/i);
});

test("empty / non-string input is rejected", async () => {
  await rejectsFriendly(decodeReport(""));
  await rejectsFriendly(decodeReport(null));
  await rejectsFriendly(decodeReport("WC1."));
});

// ---- links & hash routing ----
test("url builders put the code only in the fragment", async () => {
  const code = await encodeReport(sampleReport());
  for (const url of [reportUrl(code), assignmentUrl(code), resultUrl(code)]) {
    const [, query = ""] = url.split("?");
    assert.equal(query, "", "no query string");
    assert.ok(url.includes("#"), "code is in the hash");
    assert.ok(url.endsWith(code));
  }
});

test("readHash routes #r / #a / #x to the right kind", () => {
  assert.deepEqual(readHash("#r=WC1.abc"), { kind: "report", code: "WC1.abc" });
  assert.deepEqual(readHash("#a=WA1.abc"), { kind: "assignment", code: "WA1.abc" });
  assert.deepEqual(readHash("#x=WR1.abc"), { kind: "result", code: "WR1.abc" });
  assert.deepEqual(readHash("r=WC1.abc"), { kind: "report", code: "WC1.abc" }); // no leading #
  assert.deepEqual(readHash("https://app.wildcateducation.co.uk/#a=WA1.xyz"), { kind: "assignment", code: "WA1.xyz" });
});

test("readHash returns null for junk or unknown keys", () => {
  assert.equal(readHash(""), null);
  assert.equal(readHash("#"), null);
  assert.equal(readHash("#z=nope"), null);
  assert.equal(readHash("#r="), null);
  assert.equal(readHash(null), null);
});

// readHash code feeds straight back into decode
test("readHash output decodes", async () => {
  const code = await encodeReport(sampleReport());
  const parsed = readHash(reportUrl(code));
  assert.equal(parsed.kind, "report");
  const back = await decodeReport(parsed.code);
  assert.equal(back.n, "Maya R");
});
