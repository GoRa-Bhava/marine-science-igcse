/* ---------- TIDE GAUGE TRACE (0697 1.4/LO1–LO2) ----------
   Two days of a recording tide gauge a week apart (day 1 and day 8): one spring tide, one neap tide.
   Syllabus quantity is TIDAL AMPLITUDE = (height of high tide − height of low tide) ÷ 2, with the formula given
   in the stem (as in the real paper). "Tidal range" is never used as a named quantity (knowledge model 1.4/LO2).
   Grid: x 0–24 h in 0.5 h small squares; y 0–Ymax m in 0.1 m small squares. Read/plot tolerance = ±½ small square
   for heights (±0.05 m); times are read to ±0.25 h (half a small square). Every low tide inside the day is accepted (the mark scheme credits either). */
import { rng, pickR, fmt, round1, round2, pickMixed, gridLines } from "../core.js";

const KEY = "tide", PERIOD = 12.4;
const DAYS = ["day 1", "day 8"];
const PLACES = ["a harbour wall", "a pier on a rocky shore", "a jetty in an estuary", "a sea wall in a fishing port"];

function make(seed) {
  for (let tries = 0; ; tries++) {
    const r = rng(seed + tries * 7919);
    const As = (12 + Math.floor(r() * 9)) / 10;            // spring amplitude 1.2–2.0 m
    const An = round1(As - (6 + Math.floor(r() * 5)) / 10); // neap 0.6–1.0 m smaller
    if (An < 0.4) continue;
    const M = round1(As + 0.3 + Math.floor(r() * 4) / 10);   // mean level, keeps the spring low ≥ 0.3 m
    const Ymax = Math.ceil((M + As + 0.3) * 2) / 2;          // top of the grid, a multiple of 0.5 m
    if (Ymax > 5) continue;
    const springDay = r() < 0.5 ? 0 : 1;
    const day = [0, 1].map((d) => {
      const A = d === springDay ? As : An;
      const tL = (10 + Math.floor(r() * 13)) / 2;            // a low tide on the grid, 5–11 h
      return { A, M, high: round1(M + A), low: round1(M - A), tL, tH1: round1(tL - PERIOD / 2), tH2: round1(tL + PERIOD / 2) };
    });
    if (day.some((x) => x.tH1 < 0.5 || x.tH2 > 23.5)) continue; // both high tides inside the day
    return { kind: KEY, seed, place: pickR(r, PLACES), Ymax, springDay, day };
  }
}
const hAt = (D, t) => D.M + D.A * Math.cos(2 * Math.PI * (t - D.tL) / PERIOD + Math.PI);

function geo(F) { const W = 560, L = 58, R = 18, T = 46, B = 54, rows = Math.round(F.Ymax * 10), sq = 7.2; const ph = rows * sq; return { W, H: T + ph + B, L, T, pw: W - L - R, ph, rows, cols: 48 }; }
const X = (G, t) => G.L + t / 24 * G.pw, Y = (G, F, h) => G.T + G.ph - h / F.Ymax * G.ph;

/* axes for the reading guide: same geometry svg() uses. x 0–24 h (label every 2 h), y 0–Ymax m (label every 0.5 m). */
function axes(F) {
  const G = geo(F), rows = Math.round(F.Ymax * 10);
  const yt = []; for (let i = 0; i <= rows; i++) { const h = i / 10; yt.push({ at: Y(G, F, h), label: i % 5 === 0 ? fmt(h, 1) : undefined }); }
  const xt = []; for (let i = 0; i <= 48; i++) { const t = i / 2; xt.push({ at: X(G, t), label: i % 4 === 0 ? String(t) : undefined }); }
  return [{ plot: { x0: G.L, x1: G.L + G.pw, y0: G.T, y1: G.T + G.ph }, x: { ticks: xt }, y: { ticks: yt } }];
}

function svg(F, opt) {
  opt = opt || {}; const G = geo(F), hl = opt.hl || {};
  let s = gridLines(G.L, G.T, G.pw, G.ph, G.cols, G.rows, 4, 5);
  for (let t = 0; t <= 24; t += 2) s += `<text x="${X(G, t)}" y="${G.T + G.ph + 18}" text-anchor="middle">${t}</text>`;
  for (let h = 0; h <= F.Ymax + 1e-9; h += 0.5) s += `<text x="${G.L - 8}" y="${Y(G, F, h) + 5}" text-anchor="end">${fmt(h, 1)}</text>`;
  s += `<text x="${G.L + G.pw / 2}" y="${G.H - 12}" text-anchor="middle">time / hours</text>`;
  s += `<text transform="translate(16 ${G.T + G.ph / 2}) rotate(-90)" text-anchor="middle">height of water / m</text>`;
  F.day.forEach((D, d) => {
    const pts = []; for (let i = 0; i <= 240; i++) { const t = i / 10; pts.push(`${X(G, t).toFixed(1)},${Y(G, F, hAt(D, t)).toFixed(1)}`); }
    s += `<polyline points="${pts.join(" ")}" class="fline${d ? " tdash" : ""}${hl.day === d ? " thl" : ""}"/>`;
    if (opt.tapMode) s += `<polyline points="${pts.join(" ")}" data-tap="d${d}" fill="none" stroke="transparent" stroke-width="18"/>`;
  });
  // after-Check construction marks
  if (hl.mark) for (const m of [].concat(hl.mark)) {
    const x = X(G, m.t), y = Y(G, F, m.h);
    s += `<line x1="${G.L}" x2="${x}" y1="${y}" y2="${y}" class="tcons"/><line x1="${x}" x2="${x}" y1="${y}" y2="${G.T + G.ph}" class="tcons"/><circle cx="${x}" cy="${y}" r="5" class="fdot hl"/>`;
  }
  if (opt.state && typeof opt.state.t === "number") { const x = X(G, opt.state.t), y = Y(G, F, opt.state.h); s += `<g class="plotted tcross"><line x1="${x - 7}" x2="${x + 7}" y1="${y - 7}" y2="${y + 7}"/><line x1="${x - 7}" x2="${x + 7}" y1="${y + 7}" y2="${y - 7}"/></g>`; }
  s += `<line x1="${G.L}" x2="${G.L + G.pw}" y1="${G.T + G.ph}" y2="${G.T + G.ph}" class="axis"/><line x1="${G.L}" x2="${G.L}" y1="${G.T}" y2="${G.T + G.ph}" class="axis"/>`;
  s += `<g class="fkey"><line x1="${G.L}" x2="${G.L + 30}" y1="20" y2="20" class="fline"/><text x="${G.L + 38}" y="25">${DAYS[0]}</text><line x1="${G.L + 120}" x2="${G.L + 150}" y1="20" y2="20" class="fline tdash"/><text x="${G.L + 158}" y="25">${DAYS[1]}</text></g>`;
  if (opt.plotMode) s += `<rect x="${G.L}" y="${G.T}" width="${G.pw}" height="${G.ph}" fill="transparent" class="plothit"/>`;
  return `<svg viewBox="0 0 ${G.W} ${G.H}" class="figsvg fig-${KEY}" role="img" aria-label="Tide gauge record for two days, height of water against time">${s}</svg>`;
}

function questions(F, r) {
  const qs = [], G = geo(F), sp = F.springDay, np = 1 - sp;
  const d = r() < 0.5 ? 0 : 1, D = F.day[d], other = F.day[1 - d];
  // 1. read a high-tide height
  qs.push({ kind: "num", q: `What was the height of the water at the first high tide on <b>${DAYS[d]}</b>?`, ans: D.high, tol: 0.05, unit: "m", dp: 1, hl: { mark: { t: D.tH1, h: D.high }, day: d },
    why: `Find the first peak of the ${d ? "dashed" : "solid"} ${DAYS[d]} line and read across to the height axis: <b>${fmt(D.high, 1)} m</b>. Each small square up the axis is 0.1 m, so read to the nearest half square.` });
  // 2. read a low-tide time
  const lows = (D) => [D.tL, round1(D.tL + PERIOD)].filter((t) => t <= 24);
  const oL = lows(other), nearLow = (D, t) => lows(D).some((x) => Math.abs(t - x) <= 0.25 + 1e-9);
  qs.push({ kind: "num", q: `Give the time of <b>one</b> of the low tides on <b>${DAYS[1 - d]}</b>.`, ans: other.tL, tol: 0.25, unit: "hours", check: (v) => nearLow(other, v),
    ansTxt: oL.map((t) => `${fmt(t)} hours`).join(" or "), hl: { mark: oL.map((t) => ({ t, h: other.low })), day: 1 - d },
    why: `The low tides are the lowest points of the ${1 - d ? "dashed" : "solid"} ${DAYS[1 - d]} line. Read straight down to the time axis: <b>${oL.map((t) => fmt(t) + " hours").join("</b> and <b>")}</b>. Each small square along the axis is half an hour, so read to the nearest half square (±0.25 hours). Either low tide is correct.` });
  // 3. tidal amplitude (formula given, as in the paper) — the ÷2 step is the skill
  qs.push({ kind: "num", q: `Tidal amplitude = (height of high tide − height of low tide) ÷ 2.<br>Use the graph to calculate the tidal amplitude on <b>${DAYS[d]}</b>.`, ans: D.A, tol: 0.05, unit: "m", dp: 1, hl: { mark: [{ t: D.tH1, h: D.high }, { t: D.tL, h: D.low }], day: d },
    why: `High tide ${fmt(D.high, 1)} m, low tide ${fmt(D.low, 1)} m. (${fmt(D.high, 1)} − ${fmt(D.low, 1)}) ÷ 2 = ${fmt(round1(D.high - D.low), 1)} ÷ 2 = <b>${fmt(D.A, 1)} m</b>. A common slip is to stop at ${fmt(round1(D.high - D.low), 1)} m and forget to divide by 2.` });
  // 4. which day is the spring tide, and the Sun–Moon position (2×2, parallel options)
  const opt4 = [`${cap(DAYS[sp])}: the Sun and the Moon were in a line`, `${cap(DAYS[sp])}: the Sun and the Moon were at right angles`, `${cap(DAYS[np])}: the Sun and the Moon were in a line`, `${cap(DAYS[np])}: the Sun and the Moon were at right angles`];
  qs.push({ kind: "choice", q: "One of these days had a spring tide. Which statement is correct?", options: opt4, a: 0, hl: { day: sp },
    why: `The spring tide is the day with the larger tidal amplitude: ${DAYS[sp]} (${fmt(F.day[sp].A, 1)} m against ${fmt(F.day[np].A, 1)} m). Its high tide is higher and its low tide is lower. At a spring tide the Sun and the Moon are in a line; at a neap tide they are at right angles.` });
  // 5. why spring tides are larger (misconceptions from the knowledge model as distractors)
  qs.push({ kind: "choice", q: "Why is the tidal amplitude larger at a spring tide than at a neap tide?",
    options: ["The gravitational pulls of the Sun and the Moon combine", "The Moon is closer to the Earth at a spring tide", "Spring tides only happen in the spring season", "Stronger winds push more water onto the coast"], a: 0, hl: { day: sp },
    why: "When the Sun and the Moon are in a line, their gravitational effects on the water combine. The bigger pull makes high tide higher and low tide lower. The name has nothing to do with the season, and the Moon's distance and the wind are not the cause." });
  // 6. tick the statements the graph supports
  const S = F.day[sp], N = F.day[np], thr = pickR(r, [0.5, 1.0, 1.5].filter((t) => Math.abs(N.low - t) >= 0.2));
  const st = [
    [`There were two high tides on ${DAYS[d]}.`, true, `${DAYS[d]} has high tides at about ${fmt(D.tH1)} and ${fmt(D.tH2)} hours.`],
    r() < 0.5 ? [`The time between the two high tides on ${DAYS[d]} was more than 12 hours.`, true, `The high tides are about ${fmt(round1(D.tH2 - D.tH1))} hours apart.`]
              : [`The time between the two high tides on ${DAYS[d]} was less than 10 hours.`, false, `The high tides are about ${fmt(round1(D.tH2 - D.tH1))} hours apart, a little over 12 hours.`],
    [`Low tide on the spring-tide day was lower than low tide on the neap-tide day.`, S.low < N.low, `Spring-tide low ${fmt(S.low, 1)} m; neap-tide low ${fmt(N.low, 1)} m.`],
    [`High tide on the neap-tide day was higher than high tide on the spring-tide day.`, N.high > S.high, `Neap-tide high ${fmt(N.high, 1)} m; spring-tide high ${fmt(S.high, 1)} m.`],
  ];
  if (thr != null) st.push([`The water level on ${DAYS[np]} stayed above ${fmt(thr, 1)} m all day.`, N.low > thr, `The lowest level on ${DAYS[np]} is ${fmt(N.low, 1)} m.`]);
  const pick = pickMixed(r, st, 4);
  if (pick) qs.push({ kind: "multi", q: "Tick every statement the graph supports.", options: pick.map((x) => x[0]), a: pick.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0), hl: {},
    why: pick.map((x) => `${x[1] ? "✓" : "✗"} ${x[0]} — ${x[2]}`).join("<br>") });
  // 7. plot: mark the low tide of a day with a cross (reads both axes)
  const pd = r() < 0.5 ? 0 : 1, PD = F.day[pd], hx = 0.25, hy = 0.05;
  const snap = (v, s) => Math.round(v / s) * s;
  qs.push({ kind: "plot", q: `Mark <b>one of the low tides on ${DAYS[pd]}</b> with a cross (×). Tap the graph, then use the buttons to adjust.`, hl: { day: pd },
    askOpt: { plotMode: true },
    plot: {
      start: { t: 0, h: 0 }, answer: { t: PD.tL, h: PD.low }, hint: "Tap the graph to place your cross.",
      fromTap: (p) => ({ t: Math.max(0, Math.min(24, snap((p.x - G.L) / G.pw * 24, hx))), h: Math.max(0, Math.min(F.Ymax, round2(snap((G.T + G.ph - p.y) / G.ph * F.Ymax, hy)))) }),
      nudges: [["l", "◀", "Move the cross a quarter of an hour earlier"], ["d", "▼", "Move the cross 0.05 m lower"], ["u", "▲", "Move the cross 0.05 m higher"], ["r", "▶", "Move the cross a quarter of an hour later"]],
      nudge: (s, k) => ({ t: Math.max(0, Math.min(24, s.t + (k === "l" ? -hx : k === "r" ? hx : 0))), h: Math.max(0, Math.min(F.Ymax, round2(s.h + (k === "d" ? -hy : k === "u" ? hy : 0)))) }),
      label: (s) => `Your cross: ${fmt(s.t)} hours, ${fmt(s.h, 2)} m.`,
      check: (s) => nearLow(PD, s.t) && Math.abs(s.h - PD.low) <= 0.05 + 1e-9,
    },
    doneOpt: (s, ok) => ({ state: s, hl: { mark: lows(PD).map((t) => ({ t, h: PD.low })), day: pd } }),
    doneNote: (s, ok) => (ok ? "" : `The low tides on ${DAYS[pd]} are at ${lows(PD).map((t) => fmt(t)).join(" and ")} hours, ${fmt(PD.low, 1)} m (highlighted).`),
    why: `A low tide is a lowest point of the ${pd ? "dashed" : "solid"} line: <b>${lows(PD).map((t) => fmt(t)).join("</b> or <b>")} hours</b> along, <b>${fmt(PD.low, 1)} m</b> up. A cross at either low tide is marked right if it is within half a small square of the time (±0.25 hours) and of the height (±0.05 m).` });
  return qs;
}
const cap = (s) => s[0].toUpperCase() + s.slice(1);

function selfTest(F, qs) {
  const bad = [];
  F.day.forEach((D, i) => {
    if (Math.abs(hAt(D, D.tL) - D.low) > 1e-9 || Math.abs(hAt(D, D.tH1) - D.high) > 0.001) bad.push("turning points off " + i);
    if (D.low < 0.25 || D.high > F.Ymax - 0.2) bad.push("trace off the grid " + i);
    if (Math.abs(D.high * 10 - Math.round(D.high * 10)) > 1e-9 || Math.abs(D.low * 10 - Math.round(D.low * 10)) > 1e-9) bad.push("not on 0.1 m grid");
    if (Math.abs(D.tL * 2 - Math.round(D.tL * 2)) > 1e-9) bad.push("low time off grid");
  });
  if (F.day[F.springDay].A - F.day[1 - F.springDay].A < 0.6 - 1e-9) bad.push("spring/neap too close");
  return bad;
}

export default {
  key: KEY, group: "Graphs and charts", name: "Tide gauge record", topics: "Unit 1 (1.4)", thumbSeed: 7,
  blurb: "Two days of a recording tide gauge, a week apart: one spring tide and one neap tide.",
  tips: ["Read heights from the left axis: each small square is 0.1 m.", "High tide is a peak of the line; low tide is a trough. There are about two of each per day, a little over 12 hours apart.", "Tidal amplitude = (height of high tide − height of low tide) ÷ 2. Don't forget the ÷ 2.", "The day with the larger amplitude is the spring tide: the Sun and the Moon are in a line."],
  ctx: (F) => `tide gauge record from ${F.place}`,
  make, svg, axes, questions, selfTest,
  css: `.fig-tide .tdash{stroke-dasharray:7 5}.fig-tide .thl{stroke:var(--app);stroke-width:3}.fig-tide .tcons{stroke:var(--app);stroke-width:1.6;stroke-dasharray:4 3}.fig-tide .tcross line{stroke:var(--accent);stroke-width:3}`,
};
