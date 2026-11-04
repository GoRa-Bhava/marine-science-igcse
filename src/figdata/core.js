/* Figures & data — shared helpers (pure, no DOM). Ported from the EnviroReady 0680 engine (2026-11).
   Templates draw exam-style figures as SVG strings from seeded data, so every practice uses fresh numbers
   and every answer is exact. Determinism: templates use only the seeded r() they are given — never Math.random. */

/** mulberry32 — seeded PRNG returning () => [0,1) */
export function rng(seed) {
  let a = seed >>> 0;
  return () => { a = (a + 0x6D2B79F5) >>> 0; let t = a; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export const pickR = (r, arr) => arr[Math.floor(r() * arr.length)];
export const shuffleR = (r, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };

/** fmt: real minus sign; with dp, fixed decimals; without, the value as it is (≤4 d.p., trailing zeros dropped) */
export const fmt = (v, dp) => {
  if (dp != null) return (v < 0 && Math.abs(v).toFixed(dp) !== (0).toFixed(dp) ? "−" : "") + Math.abs(v).toFixed(dp);
  const a = Number(Math.abs(v).toFixed(4)); return (v < 0 && a !== 0 ? "−" : "") + String(a);
};
export const round1 = (v) => Math.round(v * 10) / 10;
export const round2 = (v) => Math.round(v * 100) / 100;

/** pick n statements ([text, isTrue, explanation]) with ≥1 true and ≥1 false, or null */
export function pickMixed(r, st, n) {
  const T = shuffleR(r, st.filter((x) => x[1])), Fz = shuffleR(r, st.filter((x) => !x[1]));
  if (!T.length || !Fz.length) return null;
  const nt = Math.max(1, Math.min(T.length, n - 1, 1 + Math.floor(r() * (n - 1))));
  const out = T.slice(0, nt).concat(Fz.slice(0, n - nt));
  for (const x of T.slice(nt)) { if (out.length >= n) break; out.push(x); }
  return shuffleR(r, out);
}

/** typed-number parser: accepts −/–/— minus, thousands commas ("24,000"), decimal commas ("3,5"), spaces; NaN otherwise */
export function parseNum(s) {
  if (s == null) return NaN;
  s = String(s).trim().replace(/[−–—]/g, "-").replace(/[\s  ]+/g, "").replace(/,(?=\d{3}(\D|$))/g, "").replace(/,/g, ".").replace(/[^0-9.\-]/g, "");
  return s === "" || s === "-" || (s.match(/\./g) || []).length > 1 ? NaN : Number(s);
}

export const sameSet = (a, b) => a.length === b.length && a.every((x) => b.includes(x));

/** grade one answer. Returns { ok, attempted }.  answer: number|string (num), index (choice), index[] (multi),
    id[] (tap), index[] in order (order), template state (plot). */
export function gradeFigQuestion(q, answer) {
  if (q.kind === "num") { const v = typeof answer === "number" ? answer : parseNum(answer); if (isNaN(v)) return { ok: false, attempted: false }; return { ok: q.check ? !!q.check(v) : Math.abs(v - q.ans) <= q.tol + 1e-9, attempted: true }; }
  if (q.kind === "choice") return answer == null ? { ok: false, attempted: false } : { ok: +answer === q.a, attempted: true };
  if (q.kind === "multi") return !answer || !answer.length ? { ok: false, attempted: false } : { ok: sameSet(answer.map(Number), q.a), attempted: true };
  if (q.kind === "tap") return !answer || !answer.length ? { ok: false, attempted: false } : { ok: sameSet(answer.map(String), q.a.map(String)), attempted: true };
  if (q.kind === "order") return !answer || answer.length < q.a.length ? { ok: false, attempted: false } : { ok: answer.every((k, n) => k === q.a[n]), attempted: true };
  if (q.kind === "plot") return answer == null ? { ok: false, attempted: false } : { ok: !!q.plot.check(answer), attempted: true };
  return { ok: false, attempted: false };
}

/** the answer text shown after a wrong attempt */
export function answerText(q) {
  if (q.ansTxt) return q.ansTxt;
  if (q.kind === "num") return `${q.dp ? q.ans.toFixed(q.dp) : fmt(q.ans)} ${q.unit || ""}`.trim();
  if (q.kind === "order") return q.a.map((k, n) => `${n + 1}. ${q.options[k]}`).join("<br>");
  return "";
}

/** build one practice run for a template */
export function makeRun(t, seed) {
  const F = t.make(seed), qs = t.questions(F, rng(seed ^ 0x9e3779b9));
  return { key: t.key, seed, F, qs };
}

/** svg options for a question in the asking or marked state (the engine passes these straight to t.svg) */
export function figOpt(q, phase, state, ok) {
  if (phase === "ask") return Object.assign({}, q.askOpt || {}, { state: q.kind === "plot" ? state : null });
  return q.doneOpt ? q.doneOpt(state, ok) : { hl: q.hl, state: q.kind === "plot" ? state : undefined };
}

/* ---- small SVG helpers shared by Marine templates ---- */
/** Folder (relative to the page) holding the template photos, e.g. figdata-img/fd-crab.webp. In the app it is public/figdata-img/. */
export const FIG_IMG = "figdata-img/";

export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
/** grid lines for a plotting area: cols×rows small squares, major line every `major` squares */
export function gridLines(L, T, pw, ph, cols, rows, majorX = 5, majorY = 5) {
  let g = "";
  for (let i = 0; i <= rows; i++) { const y = T + i * ph / rows; g += `<line x1="${L}" x2="${L + pw}" y1="${y}" y2="${y}" class="${i % majorY ? "gmin" : "gmaj"}"/>`; }
  for (let i = 0; i <= cols; i++) { const x = L + i * pw / cols; g += `<line y1="${T}" y2="${T + ph}" x1="${x}" x2="${x}" class="${i % majorX ? "gmin" : "gmaj"}"/>`; }
  return g;
}
