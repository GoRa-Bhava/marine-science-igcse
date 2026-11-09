/* Teacher tools — assemble a student's progress report payload (pure, no I/O).
 *
 * The output matches reportCodec's payload v1. It is built entirely from data
 * already on the device (ItemProgress + writing self-marks); nothing is fetched
 * or stored here. Kept free of any content-file import so it unit-tests in Node:
 * the caller builds the grouping index with contentIndex(content, WRITING).
 */
import { readiness } from "../reader/scoring.js";

// Group content into the lookups a report needs. `content` = { topics, items },
// writing = the WRITING bank. Unit of an item = its topic's unit.
export function contentIndex(content, writing = []) {
  const topicUnit = {};
  for (const t of content.topics || []) topicUnit[t.id] = t.unit;

  const unitItemIds = {};
  const topicItemIds = {};
  for (const it of content.items || []) {
    const topic = it.topic;
    const unit = topic != null && topicUnit[topic] != null ? topicUnit[topic] : it.unit;
    if (unit == null) continue;
    (unitItemIds[unit] ||= []).push(it.id);
    if (topic != null) (topicItemIds[topic] ||= []).push(it.id);
  }

  const writingMarks = {};
  for (const w of writing || []) writingMarks[w.id] = w.marks;

  return { unitItemIds, topicItemIds, topicUnit, writingMarks };
}

const today = () => new Date().toISOString().slice(0, 10);

// meta: { name, classCode?, examDate?, date? }
// state: { progressMap, writingData, index }
export function buildReport(meta = {}, state = {}) {
  const { name = "", classCode = "", examDate, date } = meta;
  const { progressMap = {}, writingData = {}, index } = state;
  if (!index) throw new Error("buildReport needs a content index");
  const { unitItemIds, topicItemIds, writingMarks } = index;

  // Per unit: [attempted items, total items, currently-correct items].
  // "correct" = last answer was right (wrongFlag === false).
  const u = {};
  for (const [unit, ids] of Object.entries(unitItemIds)) {
    let attempted = 0;
    let correct = 0;
    for (const id of ids) {
      const p = progressMap[id];
      if (p && (p.timesSeen || 0) > 0) {
        attempted++;
        if (p.wrongFlag === false) correct++;
      }
    }
    u[unit] = [attempted, ids.length, correct];
  }

  // Per topic: [total answers given, answers correct] — only topics attempted.
  const tp = {};
  for (const [topic, ids] of Object.entries(topicItemIds)) {
    let attempts = 0;
    let correct = 0;
    for (const id of ids) {
      const p = progressMap[id];
      if (p) {
        attempts += p.timesSeen || 0;
        correct += p.timesCorrect || 0;
      }
    }
    if (attempts > 0) tp[topic] = [attempts, correct];
  }

  // Misconceptions: items whose last answer was wrong and that captured a pick,
  // most recent first, capped at 40 (the codec trims further if still too big).
  const wrong = [];
  for (const [id, p] of Object.entries(progressMap)) {
    if (p && p.wrongFlag === true && p.lastPick !== undefined) {
      wrong.push([id, p.lastPick, p.lastSeenAt || p.updatedAt || 0]);
    }
  }
  wrong.sort((a, b) => b[2] - a[2]);
  const mp = wrong.slice(0, 40).map(([id, pick]) => [id, pick]);

  // Writing: [lastScore, marks, ticks] per answered question.
  const w = {};
  for (const [qid, rec] of Object.entries(writingData)) {
    if (!rec || (rec.lastScore == null && rec.bestScore == null)) continue;
    const marks = writingMarks[qid] != null ? writingMarks[qid] : rec.of != null ? rec.of : 0;
    const ticks = Array.isArray(rec.lastTicks) ? rec.lastTicks : [];
    w[qid] = [rec.lastScore != null ? rec.lastScore : rec.bestScore, marks, ticks];
  }

  const report = { app: "0697", n: String(name).slice(0, 30), d: date || today(), u, tp, mp, w };
  const c = String(classCode || "").slice(0, 20);
  if (c) report.c = c;

  // Optional readiness per unit (coverage × accuracy, %). Dropped first by the
  // codec if the code runs over size.
  const rd = {};
  for (const [unit, ids] of Object.entries(unitItemIds)) {
    const r = readiness(ids, progressMap);
    if (r.attempted > 0) rd[unit] = Math.round(r.value * 100);
  }
  if (Object.keys(rd).length) report.rd = rd;

  if (examDate) report.ex = examDate;
  return report;
}

// A short human summary line for the share screen: "6 units · 41 topics · 14 writing answers".
export function reportSummary(report) {
  const units = report.u ? Object.values(report.u).filter((v) => v[0] > 0).length : 0;
  const topics = report.tp ? Object.keys(report.tp).length : 0;
  const writing = report.w ? Object.keys(report.w).length : 0;
  const parts = [];
  parts.push(`${units} unit${units === 1 ? "" : "s"}`);
  parts.push(`${topics} topic${topics === 1 ? "" : "s"}`);
  parts.push(`${writing} writing answer${writing === 1 ? "" : "s"}`);
  return parts.join(" · ");
}
