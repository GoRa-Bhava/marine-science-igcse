import { test } from "node:test";
import assert from "node:assert/strict";
import { FIG_TEMPLATES, FIG_GROUPS } from "./index.js";
import { rng, gradeFigQuestion, parseNum, figOpt, fmt } from "./core.js";

/* Generic invariants for every Figures & data template, over many seeds (port of the 0680 node-gen harness).
   A template may add t.selfTest(F, qs) -> ["problem", ...] for its own checks. */
const SEEDS = Number(process.env.FIG_SEEDS || 800);
const REQUIRED = ["key", "group", "name", "topics", "blurb", "tips", "ctx", "make", "svg", "questions"];

for (const t of FIG_TEMPLATES) {
  test(`figure template ${t.key}: invariants over ${SEEDS} seeds`, () => {
    const bad = [];
    for (const k of REQUIRED) if (t[k] == null) bad.push("missing field " + k);
    if (!FIG_GROUPS.includes(t.group)) bad.push("unknown group " + t.group);
    for (let s = 1; s <= SEEDS && bad.length < 20; s++) {
      const seed = (s * 2654435761) >>> 0; let F, qs;
      try { F = t.make(seed); qs = t.questions(F, rng(seed ^ 0x9e3779b9)); } catch (e) { bad.push(`seed ${seed} throws ${e.message}`); continue; }
      const again = t.questions(t.make(seed), rng(seed ^ 0x9e3779b9));
      if (JSON.stringify(again.map((q) => [q.q, q.options, q.ans, q.a])) !== JSON.stringify(qs.map((q) => [q.q, q.options, q.ans, q.a]))) bad.push(`seed ${seed} not deterministic`);
      try { t.svg(F, {}); t.svg(F, { thumb: true }); t.ctx(F); } catch (e) { bad.push(`seed ${seed} svg throws ${e.message}`); }
      if (qs.length < 4) bad.push(`seed ${seed} only ${qs.length} questions`);
      qs.forEach((q, i) => {
        const tag = `seed ${seed} q${i} ${q.kind}`;
        if (!q.q || !q.why) bad.push(tag + " no stem/why");
        if (/undefined|NaN|\[object/.test(q.q + q.why + JSON.stringify(q.options || []))) bad.push(tag + " text has undefined/NaN");
        try { t.svg(F, figOpt(q, "ask", null)); t.svg(F, figOpt(q, "done", q.plot ? q.plot.answer : [], true)); if (q.plot) t.svg(F, figOpt(q, "done", q.plot.start, false)); } catch (e) { bad.push(tag + " svg opt throws " + e.message); }
        if (q.kind === "num") { if (typeof q.ans !== "number" || isNaN(q.ans) || q.tol == null) bad.push(tag + " bad ans/tol"); if (!gradeFigQuestion(q, q.dp ? q.ans.toFixed(q.dp) : String(q.ans)).ok) bad.push(tag + " own answer marked wrong"); if (gradeFigQuestion(q, q.ans + Math.max(1, q.tol * 3)).ok) bad.push(tag + " far answer marked right"); }
        if (q.kind === "choice") { if (!(q.options.length >= 3 && q.options.length <= 5) || new Set(q.options).size !== q.options.length || !(q.a >= 0 && q.a < q.options.length)) bad.push(tag + " bad options"); }
        if (q.kind === "multi") { if (new Set(q.options).size !== q.options.length || !q.a.length || q.a.length === q.options.length) bad.push(tag + " multi all/none or bad"); }
        if (q.kind === "order") { if (q.a.length !== q.options.length || new Set(q.a).size !== q.a.length) bad.push(tag + " bad order"); }
        if (q.kind === "tap") { const sv = t.svg(F, figOpt(q, "ask", null)); const ids = [...sv.matchAll(/data-tap="([^"]+)"/g)].map((m) => m[1]);
          if (!q.a.length || q.a.some((id) => !ids.includes(String(id)))) bad.push(tag + " answer not tappable"); if (new Set(ids).size !== ids.length) bad.push(tag + " duplicate tap ids"); if (!q.multi && q.a.length !== 1) bad.push(tag + " single tap, several answers"); if (ids.length < 3) bad.push(tag + " fewer than 3 tappable"); }
        if (q.kind === "plot") { const p = q.plot; if (!p || !p.answer || !p.check(p.answer)) bad.push(tag + " plot answer rejected"); if (JSON.stringify(p.start) !== JSON.stringify(p.answer) && p.check(p.start)) bad.push(tag + " start accepted");
          if (!/class="plothit/.test(t.svg(F, figOpt(q, "ask", null)))) bad.push(tag + " no plothit"); if (p.nudges) p.nudge(p.start, p.nudges[0][0]); }
      });
      if (t.selfTest) for (const m of t.selfTest(F, qs) || []) bad.push(`seed ${seed} ${m}`);
    }
    assert.deepEqual(bad, []);
  });
}

test("parseNum accepts exam-style typing", () => {
  assert.equal(parseNum("−4"), -4); assert.equal(parseNum("3,5"), 3.5); assert.equal(parseNum("24,000"), 24000); assert.equal(parseNum("1 200"), 1200); assert.ok(isNaN(parseNum("1.2.3")));
});
test("fmt never truncates", () => { assert.equal(fmt(1.15), "1.15"); assert.equal(fmt(-0.0475), "−0.0475"); assert.equal(fmt(2, 1), "2.0"); });
