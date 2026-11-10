/* Content lint: mechanical give-away checks for every auto-graded item (quiz bank + practical cards).
   These are the faults independent reviewers kept finding by hand. Run with `npm test`.
   Existing items that already break a rule are listed in content-lint-baseline.json, so legacy issues are
   reported but only NEW violations fail the build. Fix a legacy item, then remove its id from the baseline.
   Regenerate the baseline (only after reviewing the list!) with: LINT_WRITE_BASELINE=1 npm test */
import { test } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { build } from "esbuild";
import { PRACTICALS } from "../reader/practicals.js";

const BASELINE_PATH = new URL("./content-lint-baseline.json", import.meta.url);

async function loadContent() {
  const result = await build({ entryPoints: ["src/content/index.js"], bundle: true, write: false, format: "esm", platform: "node", jsx: "automatic", logLevel: "silent" });
  const code = result.outputFiles[0].text;
  const mod = await import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
  return mod.content;
}

const strip = (s) => String(s || "").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const words = (s) => strip(s).toLowerCase().match(/[a-z][a-z'-]*/g) || [];
const ABSOLUTE = /\b(only|always|never|none|every|cannot|can't|completely|entirely|totally|proves?|proved|impossible)\b/i;
const HEDGE = /\b(can|could|may|might|often|usually|some|sometimes|tends? to|mostly|mainly|generally)\b/i;
const STOP = new Set("about above after again against because before being below between could during each from further having into more most other over same should such than that their them then there these they this those through under until very were what when where which while whom with would your water marine ocean oceans organisms organism species".split(" "));

/* Each rule returns a short message when it fires, or null. */
const RULES = {
  // the correct option is clearly the longest (≥ 15% and ≥ 8 characters longer than every distractor)
  "key-longest": (it) => {
    if (it.type !== "choice" || !Array.isArray(it.options)) return null;
    const L = it.options.map((o) => strip(o).length), k = L[it.a];
    const others = L.filter((_, i) => i !== it.a);
    return others.length && others.every((x) => k >= x * 1.15 && k - x >= 8) ? `key ${k} chars vs max distractor ${Math.max(...others)}` : null;
  },
  // absolute words appear only in wrong options. Picture items are NOT exempt:
  // a choice/multi can still give its answer away through option wording. The
  // two genuine positional exceptions (U3-D21, PQ-U5-07) are in the baseline.
  "absolute-tell": (it) => {
    const { t, f } = split(it); if (!t) return null;
    const ft = f.filter((o) => ABSOLUTE.test(strip(o))), tt = t.filter((o) => ABSOLUTE.test(strip(o)));
    return ft.length >= 1 && tt.length === 0 && (it.type === "multi" ? ft.length >= 2 : true) ? `absolutes only in wrong options (${ft.length})` : null;
  },
  // hedges appear only in correct options (multi: at least two hedged true options and no hedged false ones)
  "hedge-tell": (it) => {
    const { t, f } = split(it); if (!t) return null;
    const th = t.filter((o) => HEDGE.test(strip(o))), fh = f.filter((o) => HEDGE.test(strip(o)));
    const need = it.type === "multi" ? 2 : 1;
    return th.length >= need && fh.length === 0 ? `hedges only in correct options (${th.length})` : null;
  },
  // a distinctive stem word appears in the key and in no distractor (choice only)
  "stem-echo": (it) => {
    if (it.type !== "choice" || !Array.isArray(it.options)) return null;
    const stem = new Set(words(it.q).filter((w) => w.length >= 6 && !STOP.has(w)));
    const key = new Set(words(it.options[it.a]));
    const dis = new Set(it.options.filter((_, i) => i !== it.a).flatMap(words));
    const echo = [...stem].filter((w) => key.has(w) && !dis.has(w));
    return echo.length ? `stem word(s) only in key: ${echo.join(", ")}` : null;
  },
  // the explanation refers to options by letter or position (options are shuffled)
  "why-letters": (it) => (/\b[Oo]ption [A-F]\b|\b[Aa]nswer [A-F]\b|\([a-f]\) is\b/.test(strip(it.why)) || /\b(first|second|third|fourth|last) option\b/i.test(strip(it.why))) ? "why refers to options by letter or position" : null,
  // the same option text appears twice in one item, ignoring case and punctuation
  "dup-options": (it) => {
    const o = (it.options || []).map((x) => strip(x).toLowerCase().replace(/[\s.,;:!?'"()-]+$/g, "").replace(/\s+/g, " "));
    return new Set(o).size !== o.length ? "duplicate options (ignoring case and spacing)" : null;
  },
  // match: an extra (decoy) is a near-copy of a real right-hand description
  "match-decoy-copy": (it) => {
    if (it.type !== "match" || !it.extra) return null;
    const R = it.pairs.map((p) => strip(p[1]).toLowerCase());
    const bad = it.extra.filter((e) => R.some((r) => r === strip(e).toLowerCase()));
    return bad.length ? "decoy duplicates a real description" : null;
  },
  // multi: every option is true except exactly one, or only one is true out of many
  "multi-balance": (it) => {
    if (it.type !== "multi") return null;
    const n = it.options.length, t = it.a.length;
    return n >= 6 && (n - t === 1) ? `${t} of ${n} true — ticking everything nearly scores` : null;
  },
};
function split(it) {
  if (it.type === "choice" && Array.isArray(it.options)) return { t: [it.options[it.a]], f: it.options.filter((_, i) => i !== it.a) };
  if (it.type === "multi" && Array.isArray(it.options)) return { t: it.a.map((i) => it.options[i]), f: it.options.filter((_, i) => !it.a.includes(i)) };
  return {};
}

const content = await loadContent();
const all = [...content.items.map((it) => ({ ...it, _src: "bank" })), ...PRACTICALS.flatMap((p) => (p.items || []).map((it) => ({ ...it, _src: p.id })))];
const found = {};
for (const it of all) for (const [rule, fn] of Object.entries(RULES)) { const m = fn(it); if (m) (found[rule] ||= {})[it.id] = m; }

// duplicate stems across the bank (same question text in two items). Keyed on
// stem PLUS figure, so two picture items may share a stem when they point at
// different figures; a genuine same-stem/same-figure (or same-stem text) pair still fires.
{ const seen = {}; for (const it of all) { if (!["choice","multi","truefalse"].includes(it.type)) continue; const stem = strip(it.q).toLowerCase(); if (stem.length < 25) continue; const k = `${stem}\u0000${it.fig || ""}`; if (seen[k]) (found["dup-stem"] ||= {})[it.id] = `same stem as ${seen[k]}`; else seen[k] = it.id; } }

if (process.env.LINT_WRITE_BASELINE) {
  const out = Object.fromEntries(Object.entries(found).map(([r, ids]) => [r, Object.keys(ids).sort()]));
  fs.writeFileSync(BASELINE_PATH, JSON.stringify(out, null, 1) + "\n");
}
const baseline = fs.existsSync(BASELINE_PATH) ? JSON.parse(fs.readFileSync(BASELINE_PATH, "utf8")) : {};

for (const rule of [...Object.keys(RULES), "dup-stem"]) {
  test(`lint: ${rule}`, () => {
    const hits = found[rule] || {};
    const known = new Set(baseline[rule] || []);
    const fresh = Object.entries(hits).filter(([id]) => !known.has(id));
    const legacy = Object.keys(hits).filter((id) => known.has(id));
    if (legacy.length) console.log(`# lint ${rule}: ${legacy.length} legacy item(s) in baseline`);
    assert.deepEqual(fresh.map(([id, m]) => `${id}: ${m}`), [], `new ${rule} violations — fix the item (or, if it is a deliberate exception, add its id to content-lint-baseline.json with a reason in the commit)`);
  });
}
