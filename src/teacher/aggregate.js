/* Teacher tools — class aggregation (pure, no I/O, fully unit-tested).
 *
 * Input everywhere is `students`: an array of { name, classCode, addedAt, report }
 * where report is a decoded payload v1 (see reportCodec). Bank lookups (item text,
 * writing points, topic names) are passed in so this stays free of content imports
 * and unit-tests in Node.
 */

// Deterministic RNG (mulberry32) so pickers are reproducible with a seed.
export function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Colour band for a % correct (green ≥75, amber 50–74, red <50, grey = no data).
export function cellState(pct) {
  if (pct == null) return "grey";
  if (pct >= 75) return "green";
  if (pct >= 50) return "amber";
  return "red";
}

// % correct for an attempted unit = correct / attempted (null when nothing attempted).
function unitPct(cell) {
  if (!cell) return null;
  const [att, , cor] = cell;
  return att > 0 ? Math.round((cor / att) * 100) : null;
}

// ---- Class heatmap: students × units (or topics) --------------------------
// Returns { units:[ids sorted], rows:[{ name, classCode, updated, cells:{id:{pct,state,att,tot,cor}} }] }.
export function heatmap(students, { topicMeta } = {}) {
  const unitSet = new Set();
  const rows = students.map((s) => {
    const u = (s.report && s.report.u) || {};
    const cells = {};
    for (const [unit, cell] of Object.entries(u)) {
      unitSet.add(unit);
      const pct = unitPct(cell);
      cells[unit] = { pct, state: cellState(pct), att: cell[0], tot: cell[1], cor: cell[2] };
    }
    return { name: s.name, classCode: s.classCode, updated: (s.report && s.report.d) || s.addedAt || "", cells };
  });
  const units = [...unitSet].sort((a, b) => Number(a) - Number(b));
  return { units, rows };
}

// ---- Class weakest topics -------------------------------------------------
// Sums tp across students; accuracy = correct/attempts. topicMeta: { id:{name,unit} }.
// Returns [{ topicId, name, unit, attempts, correct, accuracy }] weakest first.
export function classWeakestTopics(students, topicMeta = {}, { minAttempts = 1 } = {}) {
  const acc = {};
  for (const s of students) {
    const tp = (s.report && s.report.tp) || {};
    for (const [topic, v] of Object.entries(tp)) {
      const [attempts = 0, correct = 0] = v || [];
      const a = (acc[topic] ||= { attempts: 0, correct: 0 });
      a.attempts += attempts;
      a.correct += correct;
    }
  }
  const out = [];
  for (const [topicId, a] of Object.entries(acc)) {
    if (a.attempts < minAttempts) continue;
    const meta = topicMeta[topicId] || {};
    out.push({
      topicId,
      name: meta.name || topicId,
      unit: meta.unit,
      attempts: a.attempts,
      correct: a.correct,
      accuracy: a.attempts > 0 ? a.correct / a.attempts : 0,
    });
  }
  // Weakest first: lowest accuracy, then most attempts (more evidence), then id for stability.
  out.sort((x, y) => x.accuracy - y.accuracy || y.attempts - x.attempts || (x.topicId < y.topicId ? -1 : 1));
  return out;
}

// ---- Top misconceptions ---------------------------------------------------
// Groups mp picks across students. itemById: id → { q, options, why, topic, unit }.
// topicUnit: topicId → unit (for the unit filter). Returns groups, most chosen first.
export function topMisconceptions(students, itemById = {}, topicUnit = {}, { unit } = {}) {
  const groups = new Map();
  const total = students.length;
  for (const s of students) {
    const mp = (s.report && s.report.mp) || [];
    for (const [itemId, pick] of mp) {
      const key = itemId + "#" + (Array.isArray(pick) ? pick.slice().sort((a, b) => a - b).join(",") : pick);
      const g = groups.get(key) || { itemId, pick, n: 0 };
      g.n++;
      groups.set(key, g);
    }
  }
  const out = [];
  for (const g of groups.values()) {
    const item = itemById[g.itemId];
    if (!item) continue; // item no longer in the bank → skip
    const itemUnit = item.unit != null ? item.unit : topicUnit[item.topic];
    if (unit != null && String(itemUnit) !== String(unit)) continue;
    const options = item.options || [];
    const optionText = Array.isArray(g.pick)
      ? g.pick.map((i) => options[i]).filter((t) => t != null).join(" + ")
      : options[g.pick];
    if (optionText == null) continue; // pick index out of range for current bank
    out.push({
      itemId: g.itemId,
      pick: g.pick,
      n: g.n,
      total,
      stem: item.q,
      optionText,
      why: item.why,
      unit: itemUnit,
      topic: item.topic,
    });
  }
  out.sort((a, b) => b.n - a.n || (a.itemId < b.itemId ? -1 : a.itemId > b.itemId ? 1 : 0));
  return out;
}

// ---- Writing insight ------------------------------------------------------
// writingById: qid → { q, command, marks, points:[{t}] }. Returns
// { questions:[{qid, q, attempts, avgPct, avgScore, marks}], missedPoints:[{qid, index, text, missed, attempts}] }.
export function writingInsight(students, writingById = {}) {
  const perQ = {};
  for (const s of students) {
    const w = (s.report && s.report.w) || {};
    for (const [qid, v] of Object.entries(w)) {
      const [score = 0, marks = 0, ticks = []] = v || [];
      const q = (perQ[qid] ||= { qid, attempts: 0, scoreSum: 0, marks, missed: {} });
      q.attempts++;
      q.scoreSum += score;
      if (marks) q.marks = marks;
      const def = writingById[qid];
      const nPoints = def && Array.isArray(def.points) ? def.points.length : 0;
      const ticked = new Set((ticks || []).map(Number));
      for (let i = 0; i < nPoints; i++) if (!ticked.has(i)) q.missed[i] = (q.missed[i] || 0) + 1;
    }
  }
  const questions = [];
  const missedPoints = [];
  for (const q of Object.values(perQ)) {
    const def = writingById[q.qid] || {};
    const marks = q.marks || def.marks || 0;
    const avgScore = q.attempts ? q.scoreSum / q.attempts : 0;
    questions.push({
      qid: q.qid,
      q: def.q || q.qid,
      command: def.command,
      attempts: q.attempts,
      marks,
      avgScore,
      avgPct: marks ? Math.round((avgScore / marks) * 100) : null,
    });
    for (const [idx, missed] of Object.entries(q.missed)) {
      const points = def.points || [];
      const pt = points[Number(idx)];
      missedPoints.push({ qid: q.qid, index: Number(idx), text: pt ? pt.t : `point ${Number(idx) + 1}`, missed, attempts: q.attempts });
    }
  }
  // Lowest average first (weakest questions), then fewest marks.
  questions.sort((a, b) => (a.avgPct ?? 101) - (b.avgPct ?? 101) || a.qid.localeCompare(b.qid));
  // Most-missed points first.
  missedPoints.sort((a, b) => b.missed - a.missed || a.qid.localeCompare(b.qid) || a.index - b.index);
  return { questions, missedPoints };
}

// ---- Lesson starter -------------------------------------------------------
// Picks up to n recall questions from the class's weakest topics. itemById maps
// id → item (with topic, q, qRecall, options, a, why). Deterministic with a seed.
export function lessonStarterItems(students, itemById = {}, topicMeta = {}, { n = 5, seed = 1 } = {}) {
  const weak = classWeakestTopics(students, topicMeta, { minAttempts: 1 });
  const byTopic = {};
  for (const it of Object.values(itemById)) {
    if (!it || !it.topic) continue;
    (byTopic[it.topic] ||= []).push(it);
  }
  const r = rng(seed);
  const picked = [];
  const seen = new Set();
  for (const w of weak) {
    if (picked.length >= n) break;
    let pool = (byTopic[w.topicId] || []).filter((it) => (it.qRecall || it.q) && !seen.has(it.id));
    // shuffle pool deterministically
    pool = pool
      .map((it) => [r(), it])
      .sort((a, b) => a[0] - b[0])
      .map(([, it]) => it);
    const take = pool[0];
    if (take) {
      picked.push(take);
      seen.add(take.id);
    }
  }
  return picked.slice(0, n);
}

// ---- CSV export -----------------------------------------------------------
// Students × units (and optionally topics). Returns a CSV string.
export function studentsToCsv(students, { unitIds = [], topicMeta = {}, topicIds = [] } = {}) {
  const esc = (v) => {
    const s = v == null ? "" : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = ["Name", "Class", "Updated"];
  for (const u of unitIds) header.push(`Unit ${u} %`);
  for (const t of topicIds) header.push((topicMeta[t] && topicMeta[t].name) || t);
  const lines = [header.map(esc).join(",")];
  for (const s of students) {
    const rep = s.report || {};
    const row = [s.name, s.classCode || "", rep.d || s.addedAt || ""];
    for (const u of unitIds) row.push(unitPct((rep.u || {})[u]) ?? "");
    for (const t of topicIds) {
      const v = (rep.tp || {})[t];
      row.push(v && v[0] > 0 ? Math.round((v[1] / v[0]) * 100) : "");
    }
    lines.push(row.map(esc).join(","));
  }
  return lines.join("\n");
}
