/* Teacher tools — assignment building + results (pure, no I/O, unit-tested).
 * Assignment payload (WA1.): { v, id, t, due, cls, ids:[itemIds], n }
 * Result payload   (WR1.): { v, aid, n, c, d, r:[[itemId, 1|0, pick?]] }
 */
import { rng } from "./aggregate.js";

export function newAssignmentId() {
  const a = "abcdefghijklmnopqrstuvwxyz0123456789";
  let s = "";
  for (let i = 0; i < 8; i++) s += a[Math.floor(Math.random() * a.length)];
  return s;
}

// Types that auto-grade cleanly in an assignment.
export const ASSIGNABLE_TYPES = ["choice", "multi", "match", "gap"];

// Pick up to `count` item ids for an assignment.
//   pool: items [{ id, type, topic, unit }]
//   topicIds / unitIds: the selection (either or both; empty = no constraint)
//   answeredCount: { itemId: nStudentsWhoAnswered } — prefer less-answered items
//   seed: deterministic shuffling
export function pickAssignmentItems(pool, { topicIds = [], unitIds = [], count = 10, answeredCount = {}, seed = 1 } = {}) {
  const tSet = new Set(topicIds);
  const uSet = new Set((unitIds || []).map(String));
  const constrained = tSet.size > 0 || uSet.size > 0;
  let items = pool.filter((it) => ASSIGNABLE_TYPES.includes(it.type));
  if (constrained) {
    items = items.filter((it) => tSet.has(it.topic) || uSet.has(String(it.unit)));
  }
  const r = rng(seed);
  // Order by: least-answered-by-class first, then deterministic shuffle.
  const decorated = items.map((it) => ({ it, ans: answeredCount[it.id] || 0, j: r() }));
  decorated.sort((a, b) => a.ans - b.ans || a.j - b.j);
  const n = Math.max(1, Math.min(25, count));
  return decorated.slice(0, n).map((d) => d.it.id);
}

// Build an assignment object ready for encodeAssignment.
export function buildAssignment({ title, due, classCode, itemIds }) {
  return {
    id: newAssignmentId(),
    t: String(title || "Assignment").slice(0, 80),
    due: due || "",
    cls: String(classCode || "").slice(0, 20),
    ids: itemIds || [],
    n: (itemIds || []).length,
  };
}

// Does this assignment include locked units (2–6)? Unit 1 is always free.
export function assignmentNeedsLicence(itemIds, itemById = {}, topicUnit = {}) {
  for (const id of itemIds) {
    const it = itemById[id];
    if (!it) continue;
    const unit = it.unit != null ? it.unit : topicUnit[it.topic];
    if (unit != null && Number(unit) >= 2) return true;
  }
  return false;
}

// Build a result object from the student's per-item outcomes.
//   perItem: [{ itemId, right, pick }]
export function buildResult(assignment, perItem = [], { name, classCode, date } = {}) {
  const r = perItem.map((p) => {
    const row = [p.itemId, p.right ? 1 : 0];
    if (!p.right && p.pick !== undefined && p.pick !== null) row.push(p.pick);
    return row;
  });
  return {
    aid: assignment.id || assignment.aid || "",
    n: String(name || "").slice(0, 30),
    c: String(classCode || assignment.cls || "").slice(0, 20),
    d: date || new Date().toISOString().slice(0, 10),
    r,
  };
}

// Score a result: correct count and total.
export function scoreResult(result) {
  const r = (result && result.r) || [];
  const correct = r.filter((x) => x[1] === 1).length;
  return { correct, total: r.length, pct: r.length ? Math.round((correct / r.length) * 100) : 0 };
}

// Aggregate many results for one assignment into a per-question "most got wrong"
// summary. itemById resolves stems/options for display.
//   returns { students:[{name, correct, total, pct, d}], questions:[{itemId, stem, wrong, total, picks:[{pick,text,n}]}] }
export function aggregateResults(results, itemById = {}) {
  const students = results.map((res) => ({ name: res.n, d: res.d, ...scoreResult(res) }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const q = new Map();
  for (const res of results) {
    for (const row of res.r || []) {
      const [itemId, ok, pick] = row;
      const g = q.get(itemId) || { itemId, wrong: 0, total: 0, picks: new Map() };
      g.total++;
      if (ok !== 1) {
        g.wrong++;
        if (pick !== undefined) {
          const key = Array.isArray(pick) ? pick.slice().sort((a, b) => a - b).join(",") : String(pick);
          const pg = g.picks.get(key) || { pick, n: 0 };
          pg.n++;
          g.picks.set(key, pg);
        }
      }
      q.set(itemId, g);
    }
  }
  const questions = [];
  for (const g of q.values()) {
    const item = itemById[g.itemId];
    const options = (item && item.options) || [];
    const picks = [...g.picks.values()].map((pg) => ({
      pick: pg.pick,
      n: pg.n,
      text: Array.isArray(pg.pick) ? pg.pick.map((i) => options[i]).filter(Boolean).join(" + ") : options[pg.pick],
    })).sort((a, b) => b.n - a.n);
    questions.push({
      itemId: g.itemId,
      stem: item ? item.q : g.itemId,
      wrong: g.wrong,
      total: g.total,
      picks,
    });
  }
  questions.sort((a, b) => b.wrong - a.wrong || a.itemId.localeCompare(b.itemId));
  return { students, questions };
}
