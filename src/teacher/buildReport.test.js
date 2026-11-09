import { test } from "node:test";
import assert from "node:assert/strict";
import { contentIndex, buildReport, reportSummary } from "./buildReport.js";
import { encodeReport, decodeReport } from "./reportCodec.js";

const CONTENT = {
  topics: [
    { id: "space", unit: 1 },
    { id: "inside", unit: 1 },
    { id: "osmosis", unit: 2 },
  ],
  items: [
    { id: "Q1", topic: "space" },
    { id: "Q2", topic: "space" },
    { id: "Q3", topic: "inside" },
    { id: "Q4", topic: "osmosis" },
    { id: "Q5", topic: "osmosis" },
  ],
};
const WRITING = [{ id: "W1", marks: 6 }, { id: "W2", marks: 4 }];
const IDX = contentIndex(CONTENT, WRITING);

test("contentIndex groups items by unit and topic", () => {
  assert.deepEqual(IDX.unitItemIds, { 1: ["Q1", "Q2", "Q3"], 2: ["Q4", "Q5"] });
  assert.deepEqual(IDX.topicItemIds, { space: ["Q1", "Q2"], inside: ["Q3"], osmosis: ["Q4", "Q5"] });
  assert.deepEqual(IDX.writingMarks, { W1: 6, W2: 4 });
});

test("per-unit [attempted,total,correct] and per-topic [attempts,correct]", () => {
  const progressMap = {
    Q1: { timesSeen: 2, timesCorrect: 2, wrongFlag: false, box: 2 },
    Q2: { timesSeen: 1, timesCorrect: 0, timesWrong: 1, wrongFlag: true, box: 0, lastPick: 3, lastSeenAt: 100 },
    Q3: { timesSeen: 1, timesCorrect: 1, wrongFlag: false, box: 1 },
    Q4: { timesSeen: 3, timesCorrect: 1, wrongFlag: true, box: 0, lastPick: [0, 2], lastSeenAt: 200 },
    // Q5 unattempted
  };
  const rep = buildReport({ name: "Maya R", classCode: "10B" }, { progressMap, writingData: {}, index: IDX });
  // unit 1: Q1,Q2,Q3 attempted=3 total=3 correct=2 (Q1,Q3)
  assert.deepEqual(rep.u[1], [3, 3, 2]);
  // unit 2: Q4 attempted=1 total=2 correct=0
  assert.deepEqual(rep.u[2], [1, 2, 0]);
  // topics
  assert.deepEqual(rep.tp.space, [3, 2]); // 2+1 seen, 2+0 correct
  assert.deepEqual(rep.tp.inside, [1, 1]);
  assert.deepEqual(rep.tp.osmosis, [3, 1]);
  assert.equal(rep.c, "10B");
  assert.equal(rep.app, "0697");
});

test("misconceptions are most-recent-first and only for currently-wrong items", () => {
  const progressMap = {
    Q2: { timesSeen: 1, wrongFlag: true, lastPick: 3, lastSeenAt: 100 },
    Q4: { timesSeen: 3, wrongFlag: true, lastPick: [0, 2], lastSeenAt: 200 },
    Q1: { timesSeen: 1, wrongFlag: false, lastPick: 1, lastSeenAt: 300 }, // right now → excluded
  };
  const rep = buildReport({ name: "A" }, { progressMap, writingData: {}, index: IDX });
  assert.deepEqual(rep.mp, [["Q4", [0, 2]], ["Q2", 3]]); // Q4 (200) before Q2 (100); Q1 excluded
});

test("writing uses bank marks and lastTicks", () => {
  const writingData = {
    W1: { lastScore: 4, bestScore: 5, attempts: 2, lastTicks: [0, 2] },
    W2: { lastScore: 0, attempts: 1 }, // no ticks → []
  };
  const rep = buildReport({ name: "A" }, { progressMap: {}, writingData, index: IDX });
  assert.deepEqual(rep.w.W1, [4, 6, [0, 2]]);
  assert.deepEqual(rep.w.W2, [0, 4, []]);
});

test("class code and exam date are optional", () => {
  const rep = buildReport({ name: "A" }, { progressMap: {}, writingData: {}, index: IDX });
  assert.equal("c" in rep, false);
  assert.equal("ex" in rep, false);
  const rep2 = buildReport({ name: "A", classCode: "X", examDate: "2027-05-14" }, { progressMap: {}, writingData: {}, index: IDX });
  assert.equal(rep2.c, "X");
  assert.equal(rep2.ex, "2027-05-14");
});

test("name is capped at 30 chars and date defaults to today", () => {
  const rep = buildReport({ name: "x".repeat(50) }, { progressMap: {}, writingData: {}, index: IDX });
  assert.equal(rep.n.length, 30);
  assert.match(rep.d, /^\d{4}-\d{2}-\d{2}$/);
});

test("reportSummary counts started units, topics and writing answers", () => {
  const rep = {
    u: { 1: [3, 3, 2], 2: [0, 2, 0] }, // only unit 1 started
    tp: { space: [3, 2], inside: [1, 1] },
    w: { W1: [4, 6, []] },
  };
  assert.equal(reportSummary(rep), "1 unit · 2 topics · 1 writing answer");
});

test("a built report round-trips through the codec", async () => {
  const progressMap = { Q2: { timesSeen: 1, wrongFlag: true, lastPick: 3, lastSeenAt: 100 } };
  const rep = buildReport({ name: "Zoë 🐙", classCode: "10B" }, { progressMap, writingData: {}, index: IDX });
  const back = await decodeReport(await encodeReport(rep));
  delete back.v;
  assert.deepEqual(back, rep);
});
