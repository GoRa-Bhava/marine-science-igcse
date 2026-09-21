import { test } from "node:test";
import assert from "node:assert/strict";
import { examPoints, examModel, examCorrectIdx, examPassed, examScore } from "./exam.js";

// Legacy authoring shape (check / distractors / build).
const legacy = {
  id: "X1", type: "exam",
  check: ["point A", "point B", "point C"],
  distractors: ["wrong D", "wrong E"],
  build: ["A because…", "then B", "so C"],
};

test("legacy items normalise to points (correct + distractors) and a model answer", () => {
  const pts = examPoints(legacy);
  assert.equal(pts.length, 5);
  assert.equal(pts.filter((p) => p.correct).length, 3);
  assert.deepEqual(examCorrectIdx(legacy), [0, 1, 2]);
  assert.deepEqual(examModel(legacy), ["A because…", "then B", "so C"]);
});

test("pass is content-only: exactly the mark points, no order involved", () => {
  assert.equal(examPassed(legacy, [0, 1, 2]), true, "all mark points, none wrong");
  assert.equal(examPassed(legacy, [2, 0, 1]), true, "order of ticks is irrelevant");
  assert.equal(examPassed(legacy, [0, 1]), false, "a missed point fails");
  assert.equal(examPassed(legacy, [0, 1, 2, 3]), false, "a wrong pick fails");
  assert.equal(examPassed(legacy, [0, 1, 3]), false, "miss + wrong fails");
});

test("display score reflects chosen-correct minus wrong picks, clamped", () => {
  assert.equal(examScore(legacy, [0, 1, 2]), 1);
  assert.equal(Math.round(examScore(legacy, [0, 1]) * 100) / 100, 0.67);
  assert.equal(examScore(legacy, [3, 4]), 0, "two wrong picks clamp to 0");
});

test("new {points, modelAnswer} shape works with optional distractorReason", () => {
  const modern = {
    id: "X2", type: "exam",
    points: [
      { id: "a", text: "mark 1", correct: true },
      { id: "b", text: "mark 2", correct: true },
      { id: "c", text: "trap", correct: false, distractorReason: "names the wrong process" },
    ],
    modelAnswer: ["one", "two"],
  };
  assert.deepEqual(examCorrectIdx(modern), [0, 1]);
  assert.equal(examPassed(modern, [0, 1]), true);
  assert.equal(examPassed(modern, [0, 1, 2]), false);
  assert.equal(examPoints(modern)[2].reason, "names the wrong process");
  assert.deepEqual(examModel(modern), ["one", "two"]);
});
