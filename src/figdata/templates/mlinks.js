/* ---------- LINKED LINE GRAPHS (one context per run) ----------
   Three generated line graphs where two quantities are linked, each tied to one outcome:
   - "photo"  4.3/LO6 (PA): rate of photosynthesis (bubbles per minute) against distance of the lamp. Falls as the
     distance rises, by less for each extra 10 cm. Never requires limiting factors or the inverse-square law (KM4).
     One distance has not been plotted all run; the last question gives its three counts: mean, then plot.
   - "estuary" 5.6/LO2: salinity (upper graph) and water temperature (lower graph) sharing a time axis over ~13 h.
     Salinity highest at high tide (sea water in); temperature steadier at high tide, changes most around low tide
     (shallow water follows the air). Dissolved oxygen is NEVER shown or keyed (KM5 flag 5.6a).
   - "climate" 6.8/LO1–3: carbon dioxide (left axis) and mean sea-surface temperature (right axis) over decades,
     generated values only. Relationship described in words (the syllabus does not use "correlation"); the graph on
     its own shows the two rose together, not that one caused the other; the cause is the enhanced greenhouse effect.
   Grids: read and plot to ±½ smallest square; a difference of two readings to ±1 small square. All data generated. */
import { rng, pickR, shuffleR, fmt, pickMixed, gridLines } from "../core.js";

const KEY = "mlinks";
const MODES = ["photo", "estuary", "climate"];
const r6 = (v) => Math.round(v * 1e6) / 1e6;
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------------- data ---------------- */
function makePhoto(seed, r) {
  for (let t = 0; t < 400; t++) {
    const d5 = pickR(r, [2, 4]), inc = [0, 1, 2, 3].map(() => pickR(r, [2, 2, 4, 4, 6]));
    const drops = [d5]; inc.forEach((k) => drops.unshift(drops[0] + k));            // 10–20 cm drop is biggest
    const tot = drops.reduce((a, b) => a + b, 0), R5 = 4 + 2 * Math.floor(r() * 5), R0 = R5 + tot;
    if (R0 < 40 || R0 > 58) continue;
    const R = [R0]; drops.forEach((d) => R.push(R[R.length - 1] - d));
    const mi = pickR(r, [3, 4]);                                                       // 40 or 50 cm not plotted
    const a = 1 + Math.floor(r() * 2), b = a + 1 + Math.floor(r() * 2), off = shuffleR(r, [a, b, -(a + b)]);
    const counts = off.map((o) => R[mi] + o);
    return { kind: KEY, seed, mode: "photo", D: [10, 20, 30, 40, 50, 60], R, drops, mi, counts };
  }
  return null;
}
const fT = (u) => (1 + Math.cos(2 * Math.PI * u / 12.4)) / 2;
function makeEstuary(seed, r) {
  for (let t = 0; t < 400; t++) {
    const tH = pickR(r, [5, 6, 7, 8]), Shi = 26 + 2 * Math.floor(r() * 5), Slo = 4 + 2 * Math.floor(r() * 5);
    if (Shi - Slo < 16) continue;
    const f = [...Array(14).keys()].map((i) => fT(i - tH));
    const S = f.map((x) => Slo + 2 * Math.round((Shi - Slo) * x / 2));
    if (S[tH] !== Shi || S.some((v, i) => i !== tH && v > Shi - 2)) continue;           // one clear highest reading
    const warm = r() < 0.5, A = 4 + 0.5 * Math.floor(r() * 4);
    const Tb = warm ? 18 + 0.5 * Math.floor(r() * 12) : 17 + 0.5 * Math.floor(r() * 12);
    const Tw = f.map((x) => Math.round((Tb + (warm ? 1 : -1) * A * (1 - x) * (1 - x)) * 2) / 2);
    const lo = Math.min(...Tw), hi = Math.max(...Tw), rangeT = r6(hi - lo), y0 = Math.floor((lo + hi) / 2 - 3);   // 6 °C axis: the data use over half of it
    if (lo < y0 + 0.5 || hi > y0 + 5.5 || rangeT < 3) continue;
    return { kind: KEY, seed, mode: "estuary", tH, S, Tw, warm, Ty0: y0, rangeT };
  }
  return null;
}
function makeClimate(seed, r) {
  for (let t = 0; t < 600; t++) {
    const c0 = pickR(r, [315, 320]); let inc = pickR(r, [5, 10]); const C = [c0];
    for (let k = 0; k < 6; k++) { C.push(C[k] + inc); inc += pickR(r, [0, 5, 5]); }
    if (C[6] < 400 || C[6] > 425) continue;
    const T0 = pickR(r, [16, 17, 18, 19, 20, 21, 22, 23, 24]);                         // right axis T0 … T0 + 3.0 °C
    const start = 8 + Math.floor(r() * 5), st = [start];                            // temperature in 0.1 °C rows
    const dip = r() < 0.4 ? 1 + Math.floor(r() * 3) : -1;                           // a dip only mid-series, never in the last decade
    for (let k = 0; k < 6; k++) st.push(st[k] + (k === dip ? -1 : 1 + Math.floor(r() * 3)));
    if (st[6] - st[0] < 7 || st[6] - st[0] > 14 || st[6] > 28) continue;               // a rise of 0.7–1.4 °C
    const cr = C.map((v) => (v - 300) / 5);
    if (cr.some((v, i) => Math.abs(v - st[i]) < 2)) continue;                         // points never on top of each other
    const M = st.map((k) => r6(T0 + k / 10)), mi = pickR(r, [1, 2, 3, 4, 5].filter((i) => i !== dip && i !== dip + 1));
    return { kind: KEY, seed, mode: "climate", Y: [1960, 1970, 1980, 1990, 2000, 2010, 2020], C, M, st, T0, mi };
  }
  return null;
}
function make(seed) {
  const r = rng(seed), mode = MODES[Math.floor(r() * 3)];
  const F = mode === "photo" ? makePhoto(seed, r) : mode === "estuary" ? makeEstuary(seed, r) : makeClimate(seed, r);
  return F || make(seed + 1);
}

/* ---------------- drawing ---------------- */
const pane = (L, T, pw, ph, cols, rows, x0, dx, y0, dy) => ({ L, T, pw, ph, cols, rows, x0, dx, y0, dy,
  X: (x) => L + (x - x0) / dx * pw / cols, Y: (y) => T + ph - (y - y0) / dy * ph / rows });
const GEO = {
  photo: () => ({ W: 560, H: 440, P: pane(64, 24, 476, 360, 30, 30, 0, 2, 0, 2) }),
  estuary: () => ({ W: 560, H: 454, P: pane(60, 22, 478, 180, 26, 20, 0, 0.5, 0, 2), Q: null }),
  climate: () => ({ W: 560, H: 462, P: pane(70, 46, 420, 360, 24, 30, 1960, 2.5, 300, 5) }),
};
function geo(F) { const G = GEO[F.mode](); if (F.mode === "estuary") G.Q = pane(60, 244, 478, 156, 26, 12, 0, 0.5, F.Ty0, 0.5); return G; }
const xm = (x, y, k, cls) => `<path d="M${x - k} ${y - k}L${x + k} ${y + k}M${x - k} ${y + k}L${x + k} ${y - k}" class="${cls}"/>`;
const sqm = (x, y, k, cls) => `<rect x="${x - k}" y="${y - k}" width="${2 * k}" height="${2 * k}" class="${cls}"/>`;
const axes = (P) => `<line x1="${P.L}" x2="${P.L + P.pw}" y1="${P.T + P.ph}" y2="${P.T + P.ph}" class="axis"/><line x1="${P.L}" x2="${P.L}" y1="${P.T}" y2="${P.T + P.ph}" class="axis"/>`;
const cons = (P, x, y, right) => { const X = P.X(x), Y = P.Y(y); return `<line x1="${right ? P.L + P.pw : P.L}" x2="${X}" y1="${Y}" y2="${Y}" class="mkcons"/><line x1="${X}" x2="${X}" y1="${Y}" y2="${P.T + P.ph}" class="mkcons"/>`; };
const isHl = (hl, s, i) => (hl.pts || []).some((p) => p[0] === s && p[1] === i);
/* a series joined point to point; `skip` index is left out (with its two segments) */
function series(P, xs, ys, skip, mark, sid, hl, dash) {
  let s = "";
  for (let i = 0; i < xs.length - 1; i++) if (i !== skip && i + 1 !== skip) s += `<line x1="${P.X(xs[i])}" y1="${ys[i]}" x2="${P.X(xs[i + 1])}" y2="${ys[i + 1]}" class="fline${dash ? " mkd" : ""}"/>`;
  xs.forEach((x, i) => { if (i === skip) return; const h = isHl(hl, sid, i); s += mark(P.X(x), ys[i], h ? 7 : 5, (mark === xm ? "mkx" : "mks") + (h ? " hl" : "")); });
  return s;
}
const stu = (x, y) => xm(x, y, 7, "mkstu");
const ring = (x, y) => `<circle cx="${x}" cy="${y}" r="10" class="mkring"/>`;

function svgPhoto(F, opt, G) {
  const P = G.P, hl = opt.hl || {}; let s = gridLines(P.L, P.T, P.pw, P.ph, P.cols, P.rows, 5, 5) + axes(P);
  for (let d = 0; d <= 60; d += 10) s += `<text x="${P.X(d)}" y="${P.T + P.ph + 19}" text-anchor="middle">${d}</text>`;
  for (let v = 0; v <= 60; v += 10) s += `<text x="${P.L - 7}" y="${P.Y(v) + 5}" text-anchor="end">${v}</text>`;
  s += `<text x="${P.L + P.pw / 2}" y="${G.H - 10}" text-anchor="middle">distance of lamp from plant / cm</text><text transform="translate(16 ${P.T + P.ph / 2}) rotate(-90)" text-anchor="middle">rate / bubbles per minute</text>`;
  if (hl.cons) s += cons(P, hl.cons.x, hl.cons.y);
  s += series(P, F.D, F.R.map((v) => P.Y(v)), opt.reveal ? -1 : F.mi, xm, "a", hl);
  if (hl.cons) s += `<circle cx="${P.X(hl.cons.x)}" cy="${P.Y(hl.cons.y)}" r="5" class="fdot hl"/>`;
  if (!opt.reveal) s += `<text x="${P.L + P.pw - 8}" y="${P.T + 22}" text-anchor="end" class="mknote">The result for ${F.D[F.mi]} cm has not been plotted.</text>`;
  if (opt.ring) s += ring(P.X(F.D[F.mi]), P.Y(F.R[F.mi]));
  if (opt.state && opt.state.d != null) s += stu(P.X(opt.state.d), P.Y(opt.state.v));
  if (opt.plotMode) s += `<rect x="${P.L - 8}" y="${P.T - 6}" width="${P.pw + 16}" height="${P.ph + 12}" fill="transparent" class="plothit"/>`;
  return s;
}
function svgEstuary(F, opt, G) {
  const P = G.P, Q = G.Q, hl = opt.hl || {}, hrs = [...Array(14).keys()]; let s = "";
  for (const [Z, top, step, lab] of [[P, 40, 10, "salinity / ppt"], [Q, Q.y0 + 6, 1, "temperature / °C"]]) {
    s += gridLines(Z.L, Z.T, Z.pw, Z.ph, Z.cols, Z.rows, 2, Z === P ? 5 : 2) + axes(Z);
    for (let v = Z.y0; v <= top + 1e-9; v += step) s += `<text x="${Z.L - 7}" y="${Z.Y(v) + 5}" text-anchor="end">${fmt(v)}</text>`;
    for (let h = 0; h <= 13; h++) s += `<text x="${Z.X(h)}" y="${Z.T + Z.ph + 18}" text-anchor="middle" class="mksm">${h}</text>`;
    s += `<text transform="translate(16 ${Z.T + Z.ph / 2}) rotate(-90)" text-anchor="middle">${lab}</text>`;
  }
  s += `<text x="${Q.L + Q.pw / 2}" y="${G.H - 10}" text-anchor="middle">time since the start of the survey / hours</text>`;
  if (hl.cons) for (const c of [].concat(hl.cons)) s += cons(c.p === "t" ? Q : P, c.x, c.y);
  s += series(P, hrs, F.S.map((v) => P.Y(v)), -1, xm, "s", hl) + series(Q, hrs, F.Tw.map((v) => Q.Y(v)), -1, xm, "t", hl);
  if (opt.tapMode) hrs.forEach((h) => (s += `<rect x="${P.X(h) - 18}" y="${P.T}" width="36" height="${P.ph}" fill="transparent" data-tap="h${h}"/>`));
  return s;
}
function svgClimate(F, opt, G) {
  const P = G.P, hl = opt.hl || {}, YT = (v) => P.T + P.ph - (v - F.T0) / 0.1 * P.ph / P.rows; let s = gridLines(P.L, P.T, P.pw, P.ph, P.cols, P.rows, 4, 5) + axes(P);
  s += `<line x1="${P.L + P.pw}" x2="${P.L + P.pw}" y1="${P.T}" y2="${P.T + P.ph}" class="axis"/>`;
  F.Y.forEach((y) => (s += `<text x="${P.X(y)}" y="${P.T + P.ph + 25}" text-anchor="middle">${y}</text>`));
  for (let k = 0; k <= 30; k += 5) { s += `<text x="${P.L - 7}" y="${P.Y(300 + 5 * k) + 5}" text-anchor="end">${300 + 5 * k}</text><text x="${P.L + P.pw + 10}" y="${YT(F.T0 + k / 10) + 5}">${fmt(F.T0 + k / 10, 1)}</text>`; }
  s += `<text x="${P.L + P.pw / 2}" y="${G.H - 6}" text-anchor="middle">year</text><text transform="translate(16 ${P.T + P.ph / 2}) rotate(-90)" text-anchor="middle">carbon dioxide in the air / ppm</text>`;
  s += `<text transform="translate(${G.W - 10} ${P.T + P.ph / 2}) rotate(90)" text-anchor="middle">mean sea-surface temperature / °C</text>`;
  if (hl.cons) for (const c of [].concat(hl.cons)) { const X = P.X(c.x), Y = c.p === "m" ? YT(c.y) : P.Y(c.y); s += `<line x1="${c.p === "m" ? P.L + P.pw : P.L}" x2="${X}" y1="${Y}" y2="${Y}" class="mkcons"/><line x1="${X}" x2="${X}" y1="${Y}" y2="${P.T + P.ph}" class="mkcons"/>`; }
  s += series(P, F.Y, F.C.map((v) => P.Y(v)), -1, sqm, "c", hl, true) + series(P, F.Y, F.M.map((v) => YT(v)), opt.reveal ? -1 : F.mi, xm, "m", hl);
  if (!opt.reveal) s += `<text x="${P.L + 8}" y="${P.T + 22}" class="mknote">The temperature for ${F.Y[F.mi]} has not been plotted.</text>`;
  if (opt.ring) s += ring(P.X(F.Y[F.mi]), YT(F.M[F.mi]));
  if (opt.state && opt.state.i != null) s += stu(P.X(F.Y[opt.state.i]), YT(opt.state.v));
  s += `<g class="fkey"><line x1="${P.L}" x2="${P.L + 30}" y1="20" y2="20" class="fline"/>${xm(P.L + 15, 20, 5, "mkx")}<text x="${P.L + 38}" y="25">sea-surface temperature</text>
    <line x1="${P.L + 250}" x2="${P.L + 280}" y1="20" y2="20" class="fline mkd"/>${sqm(P.L + 265, 20, 4, "mks")}<text x="${P.L + 288}" y="25">carbon dioxide</text></g>`;
  if (opt.plotMode) s += `<rect x="${P.L - 8}" y="${P.T - 6}" width="${P.pw + 16}" height="${P.ph + 12}" fill="transparent" class="plothit"/>`;
  return s;
}
const ARIA = { photo: "Line graph of rate of photosynthesis against distance of the lamp", estuary: "Two line graphs sharing a time axis: salinity and water temperature in an estuary", climate: "Line graph with two y-axes: carbon dioxide in the air and mean sea-surface temperature against year" };
function svg(F, opt) {
  opt = opt || {}; const G = geo(F);
  const body = F.mode === "photo" ? svgPhoto(F, opt, G) : F.mode === "estuary" ? svgEstuary(F, opt, G) : svgClimate(F, opt, G);
  return `<svg viewBox="0 0 ${G.W} ${G.H}" class="figsvg fig-${KEY}" role="img" aria-label="${ARIA[F.mode]}">${body}</svg>`;
}

/* ---------------- questions ---------------- */
const multiQ = (pick, q) => ({ kind: "multi", q: q || "Tick every statement the graph supports.", options: pick.map((x) => x[0]), a: pick.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0), hl: {},
  why: pick.map((x) => `${x[1] ? "✓" : "✗"} ${x[0]} — ${x[2]}`).join("<br>") });

function qPhoto(F, r) {
  const { D, R, mi, drops, counts } = F, qs = [], vis = [0, 1, 2, 3, 4, 5].filter((i) => i !== mi), u = " bubbles per minute";
  const segOK = [0, 1, 2, 3, 4].filter((k) => k !== mi && k + 1 !== mi);             // segments drawn on the graph
  // 1. interpolate halfway along a drawn segment
  const k1 = pickR(r, segOK.filter((k) => k > 0)), dm = D[k1] + 5, vm = (R[k1] + R[k1 + 1]) / 2;
  qs.push({ kind: "num", q: `Use the graph to find the rate of photosynthesis when the lamp was <b>${dm} cm</b> from the plant.`, ans: vm, tol: 1, unit: "bubbles per minute", hl: { cons: { x: dm, y: vm } },
    why: `Go up from ${dm} cm on the x-axis to the line, then across to the y-axis: <b>${fmt(vm)}${u}</b>. ${dm} cm is halfway between the points at ${D[k1]} cm (${R[k1]}) and ${D[k1 + 1]} cm (${R[k1 + 1]}), so the reading on the ruled line is halfway between them. Each small square is 2${u}, so readings are accepted to ±½ small square (±1 bubble per minute).` });
  // 2. describe the results, quoting data (trend + shape)
  const a0 = R[0], a5 = R[5];
  qs.push({ kind: "choice", q: "Which statement describes the results shown on the graph?",
    options: [`The rate fell from ${a0} to ${a5} bubbles per minute, with the biggest fall between 10 and 20 cm.`, `The rate fell from ${a0} to ${a5} bubbles per minute, with the biggest fall between ${D[segOK[segOK.length - 1]]} and ${D[segOK[segOK.length - 1]] + 10} cm.`,
      `The rate fell from ${a0} to ${a5} bubbles per minute, falling by the same amount for every extra 10 cm.`, `The rate rose from ${a5} to ${a0} bubbles per minute, with the biggest rise between 50 and 60 cm.`], a: 0, hl: { pts: [["a", 0], ["a", 1], ["a", 5]] },
    why: `Read the line from left to right, in the direction the distance increases. The rate falls from ${a0}${u} at 10 cm to ${a5}${u} at 60 cm. The steepest part of the line is between 10 and 20 cm (a fall of ${drops[0]}), and the line gets less steep as the lamp moves further away, so the falls are not equal. A good description gives the trend and quotes data with units.` });
  // 3. difference between two plotted distances
  const pairs = []; vis.forEach((i) => vis.forEach((j) => { if (i < j && R[i] - R[j] >= 10 && !(i === 0 && j === 5)) pairs.push([i, j]); }));
  const [i3, j3] = pickR(r, pairs), d3 = R[i3] - R[j3];
  qs.push({ kind: "num", q: `How much higher was the rate of photosynthesis at <b>${D[i3]} cm</b> than at <b>${D[j3]} cm</b>?`, ans: d3, tol: 2, unit: "bubbles per minute", hl: { pts: [["a", i3], ["a", j3]] },
    why: `Read both points: ${D[i3]} cm → ${R[i3]}${u}; ${D[j3]} cm → ${R[j3]}${u}. Subtract: ${R[i3]} − ${R[j3]} = <b>${d3}${u}</b>. Accepted to within one small square (±2), because two readings are involved.` });
  // 4. explain the trend (KM4 misconceptions as distractors)
  qs.push({ kind: "choice", q: "The rate of photosynthesis fell as the lamp was moved further from the plant. Which is the best explanation?",
    options: ["Less light reached the plant, so less energy was available for photosynthesis.", "The plant respired more slowly, so it released fewer bubbles of carbon dioxide.",
      "Less carbon dioxide reached the plant, so photosynthesis slowed.", "The plant took up less water from the tube, so it had less to make glucose from."], a: 0, hl: {},
    why: "Moving the lamp further away gives the plant a <b>lower light intensity</b>, so less energy from light is available for photosynthesis: less oxygen is made and fewer bubbles are released. The bubbles are oxygen from photosynthesis, not carbon dioxide from respiration, and moving the lamp does not change the supply of carbon dioxide or water to the plant." });
  // 5. conclusion and method statements
  const fig = [], met = [];
  fig.push(["The rate was highest when the lamp was closest to the plant.", true, `The highest point is at 10 cm (${a0}${u}).`]);
  fig.push(["The plant stopped photosynthesising when the lamp was 60 cm away.", false, `At 60 cm there were still ${a5}${u}, so photosynthesis was still happening, only more slowly.`]);
  { const far = pickR(r, vis.filter((i) => i >= 2 && Math.abs(R[i] - a0 / 2) >= 3)); if (far != null) fig.push([`The rate at ${D[far]} cm was less than half the rate at 10 cm.`, R[far] < a0 / 2, `Half of ${a0} is ${fmt(a0 / 2)}; at ${D[far]} cm the rate was ${R[far]}${u}.`]); }
  { const sp = []; segOK.forEach((k) => segOK.forEach((m) => { if (k > 0 && k < m && drops[k] - drops[m] >= 4) sp.push([k, m]); }));   // not the 10–20 cm fall: item 2's feedback quotes it
    if (sp.length) { let [k, m] = pickR(r, sp); const tr = r() < 0.5; if (!tr) [k, m] = [m, k];
      fig.push([`Moving the lamp from ${D[k]} to ${D[k + 1]} cm reduced the rate by more than moving it from ${D[m]} to ${D[m + 1]} cm.`, drops[k] > drops[m], `${D[k]} → ${D[k + 1]} cm: a fall of ${drops[k]}; ${D[m]} → ${D[m + 1]} cm: a fall of ${drops[m]}.`]); } }
  met.push(["Standing the tube in a water bath keeps the temperature the same at each distance.", true, "The lamp gives out heat, so a water bath controls the temperature."]);
  met.push(["The same piece of water plant should be used at each distance.", true, "Using the same plant keeps its size and number of leaves the same."]);
  met.push(["The distance of the lamp is one of the variables that was kept the same.", false, "The distance is the independent variable: it is the one that was changed."]);
  met.push(["The bubbles should be counted for a different length of time at each distance.", false, "The counting time must be the same at each distance, or the counts cannot be compared."]);
  met.push(["Collecting the gas and measuring its volume would be more accurate than counting bubbles.", true, "Bubbles are not all the same size, so the volume of gas is a better measure."]);
  met.push(["The plant should be left for a few minutes after the lamp is moved, before counting starts.", true, "This lets the plant adjust to the new light intensity."]);
  const pf = shuffleR(r, fig).slice(0, 2), pm = shuffleR(r, met).slice(0, 3), all = pf.concat(pm);
  const pick = all.some((x) => x[1]) && all.some((x) => !x[1]) ? shuffleR(r, all) : pickMixed(r, fig.concat(met), 5);
  qs.push(multiQ(pick, "Tick every statement about the conclusion and the method that is correct."));
  // 6. mean of three counts, then plot it (last)
  const X = D[mi], m = R[mi], sum = counts.reduce((a, b) => a + b, 0);
  qs.push({ kind: "plot", q: `The result for <b>${X} cm</b> has not been plotted. At ${X} cm the student counted the bubbles three times: <b>${counts.join(", ")}</b> bubbles per minute. Calculate the mean, then plot it on the graph as a cross (×).`, hl: {},
    askOpt: { plotMode: true },
    plot: {
      start: { d: 0, v: 0 }, answer: { d: X, v: m }, hint: "Tap the graph to place your cross, then adjust it with the buttons.",
      fromTap: (p) => { const P = geo(F).P; return { d: Math.max(0, Math.min(60, Math.round((p.x - P.L) / P.pw * 60))), v: Math.max(0, Math.min(60, Math.round((P.T + P.ph - p.y) / P.ph * 60))) }; },
      nudges: [["x-", "◀", "Move 1 cm left"], ["v-", "▼", "Down 1 bubble per minute"], ["v+", "▲", "Up 1 bubble per minute"], ["x+", "▶", "Move 1 cm right"]],
      nudge: (s, k) => ({ d: Math.max(0, Math.min(60, s.d + (k === "x-" ? -1 : k === "x+" ? 1 : 0))), v: Math.max(0, Math.min(60, s.v + (k === "v-" ? -1 : k === "v+" ? 1 : 0))) }),
      label: (s) => `Your cross: ${s.d} cm, ${s.v} bubbles per minute.`,
      check: (s) => Math.abs(s.d - X) <= 1 && Math.abs(s.v - m) <= 1,
    },
    doneOpt: (s, ok) => ({ state: s, reveal: true, ring: !ok }),
    doneNote: (s, ok) => (ok ? "" : `Ringed: the correct point, ${X} cm at ${m} bubbles per minute. Your cross is in orange.`),
    why: `Mean = (${counts.join(" + ")}) ÷ 3 = ${sum} ÷ 3 = <b>${m}${u}</b>. Plot it at <b>${X} cm</b> across and <b>${m}</b> up. Each small square is 2 cm across and 2${u} up, so ${m} is ${fmt(m / 2)} small squares up. A cross is accepted to within half a small square either way.` });
  return qs;
}

function qEstuary(F, r) {
  const { S, Tw, tH, warm } = F, qs = [], hrs = [...Array(14).keys()], iMin = S.indexOf(Math.min(...S));
  // 1. read salinity at an hour away from high and low tide
  const t1 = pickR(r, hrs.filter((h) => Math.abs(h - tH) >= 2 && Math.abs(h - iMin) >= 2 && S[h] > Math.min(...S) + 3));
  qs.push({ kind: "num", q: `What was the salinity of the water <b>${t1} hours</b> after the start of the survey?`, ans: S[t1], tol: 1, unit: "ppt", hl: { pts: [["s", t1]], cons: { p: "s", x: t1, y: S[t1] } },
    why: `Use the upper graph. Go up from ${t1} hours to the cross, then across to the salinity axis: <b>${S[t1]} ppt</b>. Each small square is 2 ppt, so readings are accepted to ±½ small square (±1 ppt).` });
  // 2. tap the reading taken at high tide
  qs.push({ kind: "tap", q: "The salinity was measured every hour. Use the graph to find when high tide was. Tap the salinity reading taken at high tide.", a: [`h${tH}`], askOpt: { tapMode: true },
    labelOf: (id) => `${id.slice(1)} hours`, ansTxt: `the reading at ${tH} hours (${S[tH]} ppt)`, hint: "Tap the salinity graph above or below the reading you choose.", hl: { pts: [["s", tH]] },
    why: `In an estuary the salinity is highest at high tide and lowest at low tide. The highest salinity reading is <b>${S[tH]} ppt at ${tH} hours</b>, so high tide was at about ${tH} hours. A common mistake is to choose the lowest reading.` });
  // 3. explain the rise in salinity towards high tide
  const a3 = S.slice(0, tH).indexOf(Math.min(...S.slice(0, tH)));
  qs.push({ kind: "choice", q: `Between ${a3} and ${tH} hours the salinity rose from ${S[a3]} to ${S[tH]} ppt. Which explanation is correct?`,
    options: ["The rising tide brought more salty sea water into the estuary.", "The rising tide left salt behind on the mud as water evaporated.", "Mangrove roots held the river water back as the tide came in.", "Warmer water at high tide dissolved salt from the mud."], a: 0, hl: { pts: [["s", a3], ["s", tH]] },
    why: "An estuary is where a river meets the sea. As the tide rises, <b>salty sea water flows in</b> and makes up more of the water, so the salinity rises to its highest at high tide. As the tide falls the sea water flows out, river (fresh) water makes up more of what is left, and the salinity falls. Evaporation cannot explain a rise as the water gets deeper, and roots do not hold back river water." });
  // 4. range of temperature
  const mx = Math.max(...Tw), mn = Math.min(...Tw), all = (v) => hrs.filter((h) => Tw[h] === v), at = (v) => (all(v).length === 1 ? ` (at ${all(v)[0]} hours)` : "");
  qs.push({ kind: "num", q: "Calculate the <b>range</b> of the water temperature during the survey.", ans: F.rangeT, tol: 0.5, unit: "°C", dp: 1, hl: { pts: all(mx).concat(all(mn)).map((h) => ["t", h]) },
    why: `Range = highest value − lowest value. Use the lower graph: highest ${fmt(mx, 1)} °C${at(mx)}, lowest ${fmt(mn, 1)} °C${at(mn)}. ${fmt(mx, 1)} − ${fmt(mn, 1)} = <b>${fmt(F.rangeT, 1)} °C</b>. Accepted to within one small square (±0.5 °C), because two readings are involved.` });
  // 5. statements
  const st = [];
  for (let k = 0; k < 30; k++) { const i = pickR(r, hrs), j = pickR(r, hrs); if (Math.abs(S[i] - S[j]) >= 4) { st.push([`The salinity at ${i} hours was higher than at ${j} hours.`, S[i] > S[j], `${i} hours: ${S[i]} ppt; ${j} hours: ${S[j]} ppt.`]); break; } }
  { const k = pickR(r, hrs.filter((h) => h !== t1)), th = pickR(r, [10, 15, 20, 25].filter((v) => Math.abs(S[k] - v) >= 3)); if (th != null) st.push([`The salinity was above ${th} ppt at ${k} hours.`, S[k] > th, `At ${k} hours the salinity was ${S[k]} ppt.`]); }
  { const rg = S[tH] - Math.min(...S), th = pickR(r, [10, 15, 20, 25].filter((v) => Math.abs(rg - v) >= 3)); if (th != null) st.push([`The range of salinity during the survey was more than ${th} ppt.`, rg > th, `Highest ${S[tH]} ppt, lowest ${Math.min(...S)} ppt: a range of ${rg} ppt.`]); }
  for (let k = 0; k < 30; k++) { const i = pickR(r, hrs), j = pickR(r, hrs); if (Tw[i] !== mx && Tw[i] !== mn && Math.abs(Tw[i] - Tw[j]) >= 1) { st.push([`The water temperature at ${i} hours was higher than at ${j} hours.`, Tw[i] > Tw[j], `${i} hours: ${fmt(Tw[i], 1)} °C; ${j} hours: ${fmt(Tw[j], 1)} °C.`]); break; } }
  st.push(["Sea water made up more of the water in the estuary at high tide than at low tide.", true, "That is why the salinity is highest at high tide."]);
  st.push(["The readings show that the salinity was highest at low tide.", false, `The salinity was highest at high tide (${S[tH]} ppt at ${tH} hours).`]);
  st.push(["The river water entering the estuary was saltier than the sea water.", false, "River water is fresh water; the salinity rises when sea water flows in."]);
  const pick = pickMixed(r, st, 4); if (pick) qs.push(multiQ(pick));
  // 6. explain the temperature pattern (last: its explanation would otherwise help earlier items)
  qs.push({ kind: "choice", q: `On the day of the survey the air was <b>${warm ? "warmer" : "cooler"}</b> than the sea water. The water temperature was furthest from its high-tide value around low tide, and steadiest around high tide. Which is the best explanation?`,
    options: [`At low tide the water was shallow, so the air ${warm ? "warmed" : "cooled"} it more quickly.`, "At low tide the river stopped flowing, so the water was not mixed.", `At low tide the water was less salty, so it ${warm ? "gained" : "lost"} heat faster than sea water.`], a: 0, hl: {},
    why: `At low tide only a small volume of <b>shallow water</b> is left over the mud, so its temperature quickly moves towards the air temperature (here it ${warm ? "warmed" : "cooled"}). At high tide a large volume of sea water covers the estuary, so the temperature stays steadier. The river keeps flowing at low tide, and lower salinity is not the reason the temperature changed.` });
  return qs;
}

function qClimate(F, r) {
  const { Y, C, M, mi } = F, qs = [], idx = [0, 1, 2, 3, 4, 5, 6], mv = idx.filter((i) => i !== mi);
  // 1. read the temperature (right-hand axis)
  const j1 = pickR(r, mv);
  qs.push({ kind: "num", q: `What was the mean sea-surface temperature in <b>${Y[j1]}</b>?`, ans: M[j1], tol: 0.05, unit: "°C", dp: 1, hl: { pts: [["m", j1]], cons: { p: "m", x: Y[j1], y: M[j1] } },
    why: `The sea-surface temperature line has crosses (see the key) and uses the <b>right-hand axis</b>. Go up from ${Y[j1]} to the cross, then across to the right: <b>${fmt(M[j1], 1)} °C</b>. Each small square on that axis is 0.1 °C, so readings are accepted to ±½ small square (±0.05 °C). Reading the left-hand axis by mistake gives a carbon dioxide value.` });
  // 2. change in carbon dioxide
  const pr = []; idx.forEach((a) => idx.forEach((b) => { if (b - a >= 3) pr.push([a, b]); })); const [a2, b2] = pickR(r, pr), d2 = C[b2] - C[a2];
  qs.push({ kind: "num", q: `By how much did the carbon dioxide level increase between <b>${Y[a2]}</b> and <b>${Y[b2]}</b>?`, ans: d2, tol: 5, unit: "ppm", hl: { pts: [["c", a2], ["c", b2]] },
    why: `Carbon dioxide is the dashed line with squares, read on the <b>left-hand axis</b>. ${Y[a2]}: ${C[a2]} ppm; ${Y[b2]}: ${C[b2]} ppm. Increase = ${C[b2]} − ${C[a2]} = <b>${d2} ppm</b>. Accepted to within one small square (±5 ppm), because two readings are involved.` });
  // 3. describe the relationship
  qs.push({ kind: "choice", q: "Which statement best describes the relationship shown by the graph?",
    options: ["As the carbon dioxide level rose, the sea-surface temperature also rose.", "As the carbon dioxide level rose, the sea-surface temperature fell.", "As the carbon dioxide level rose, the sea-surface temperature stayed the same.", "As the carbon dioxide level rose, the sea-surface temperature rose and then fell."], a: 0, hl: {},
    why: `Both lines go up from ${Y[0]} to ${Y[6]}: carbon dioxide from ${C[0]} to ${C[6]} ppm and sea-surface temperature from ${fmt(M[0], 1)} to ${fmt(M[6], 1)} °C. So as one rose, the other rose too.${F.st.some((v, i) => i && v < F.st[i - 1]) ? " The temperature dipped slightly in one decade, but the overall pattern is a rise." : ""} Describe a relationship in words like this, then quote values with units.` });
  // 4. explain the link (enhanced greenhouse effect; KM6 misconceptions as distractors)
  qs.push({ kind: "choice", q: "Scientists link the rise in sea-surface temperature to the extra carbon dioxide in the air. Which explanation is correct?",
    options: ["Extra carbon dioxide traps more of the heat radiated from the Earth's surface.", "Extra carbon dioxide lets more of the Sun's light through the air to warm the sea.", "Extra carbon dioxide reacts with oxygen in the air and releases heat.", "Extra carbon dioxide dissolves in the sea and makes it acidic, and acid water is warmer."], a: 0, hl: {},
    why: "Carbon dioxide is a greenhouse gas: it traps heat radiated from the Earth's surface. Extra carbon dioxide traps more heat (the <b>enhanced greenhouse effect</b>), which causes climate change, and the ocean absorbs much of that heat. Carbon dioxide does not let in more sunlight or react with oxygen to make heat. Dissolved carbon dioxide does lower the pH of sea water, but that is a separate effect and does not warm the water." });
  // 5. statements: always the causation trap, plus three from the figure
  const st = [];
  st.push(["The graph shows that the sea-surface temperature rose as the carbon dioxide level rose.", true, "Both lines rise over the same period."]);
  { const y = pickR(r, idx), th = pickR(r, [325, 350, 375, 400].filter((v) => Math.abs(C[y] - v) >= 10 && Math.abs(C[y] - v) <= 30)); if (th != null) st.push([`The carbon dioxide level was above ${th} ppm in ${Y[y]}.`, C[y] > th, `In ${Y[y]} it was ${C[y]} ppm.`]); }
  { const e = C[2] - C[0], l = C[6] - C[4], tr = r() < 0.5; if (Math.abs(e - l) >= 10) st.push(tr ? [`Carbon dioxide rose by more between ${Y[4]} and ${Y[6]} than between ${Y[0]} and ${Y[2]}.`, l > e, `${Y[4]}–${Y[6]}: +${l} ppm; ${Y[0]}–${Y[2]}: +${e} ppm.`]
    : [`Carbon dioxide rose by more between ${Y[0]} and ${Y[2]} than between ${Y[4]} and ${Y[6]}.`, e > l, `${Y[0]}–${Y[2]}: +${e} ppm; ${Y[4]}–${Y[6]}: +${l} ppm.`]); }
  { const rise = F.st[6] - F.st[0], th = pickR(r, [0.5, 0.8, 1.0, 1.2, 1.5].filter((v) => Math.abs(rise / 10 - v) >= 0.2)); if (th != null) st.push([`The sea-surface temperature rose by more than ${fmt(th, 1)} °C between ${Y[0]} and ${Y[6]}.`, rise / 10 > th, `${fmt(M[0], 1)} °C to ${fmt(M[6], 1)} °C: a rise of ${fmt(rise / 10, 1)} °C.`]); }
  st.push([`Both the carbon dioxide level and the sea-surface temperature were lower in ${Y[0]} than in ${Y[6]}.`, true, `${Y[0]}: ${C[0]} ppm and ${fmt(M[0], 1)} °C; ${Y[6]}: ${C[6]} ppm and ${fmt(M[6], 1)} °C.`]);
  const trap = ["The graph shows that the rise in carbon dioxide caused the rise in sea-surface temperature.", false, "The graph shows only that the two rose over the same period. Two quantities rising together do not, on their own, show that one caused the other; the cause is explained by the enhanced greenhouse effect, not by the graph alone."];
  const rest = shuffleR(r, st).slice(0, 3); if (!rest.some((x) => x[1])) rest[0] = st.find((x) => x[1]);
  qs.push(multiQ(shuffleR(r, rest.concat([trap]))));
  // 6. plot the missing temperature (right-hand axis)
  const V = M[mi];
  qs.push({ kind: "plot", q: `The mean sea-surface temperature in <b>${Y[mi]}</b> was <b>${fmt(V, 1)} °C</b>. This point has not been plotted. Plot it on the graph as a cross (×).`, hl: {},
    askOpt: { plotMode: true },
    plot: {
      start: { i: 0, v: F.T0 }, answer: { i: mi, v: V }, hint: "Tap the graph to place your cross, then adjust it with the buttons.",
      fromTap: (p) => { const P = geo(F).P; return { i: Math.max(0, Math.min(6, Math.round((p.x - P.L) / (P.pw / 6)))), v: r6(F.T0 + Math.max(0, Math.min(60, Math.round((P.T + P.ph - p.y) / P.ph * 60))) * 0.05) }; },
      nudges: [["x-", "◀", "Move one decade left"], ["v-", "▼", "Down half a small square"], ["v+", "▲", "Up half a small square"], ["x+", "▶", "Move one decade right"]],
      nudge: (s, k) => ({ i: Math.max(0, Math.min(6, s.i + (k === "x-" ? -1 : k === "x+" ? 1 : 0))), v: r6(Math.max(F.T0, Math.min(F.T0 + 3, s.v + (k === "v-" ? -0.05 : k === "v+" ? 0.05 : 0)))) }),
      label: (s) => `Your cross: ${Y[s.i]}, ${fmt(s.v, 2)} °C on the right-hand axis.`,
      check: (s) => s.i === mi && Math.abs(s.v - V) <= 0.05 + 1e-9,
    },
    doneOpt: (s, ok) => ({ state: s, reveal: true, ring: !ok }),
    doneNote: (s, ok) => (ok ? "" : `Ringed: the correct point, ${Y[mi]} at ${fmt(V, 1)} °C on the right-hand axis. Your cross is in orange.`),
    why: `Temperature is read on the <b>right-hand axis</b>, which starts at ${fmt(F.T0, 1)} °C; each small square is 0.1 °C. ${fmt(V, 1)} °C is ${fmt(r6((V - F.T0) * 10))} small squares up, above ${Y[mi]}. A cross within half a small square (±0.05 °C) is accepted. Using the left-hand (carbon dioxide) axis by mistake puts the cross in the wrong place.` });
  return qs;
}
function questions(F, r) { return F.mode === "photo" ? qPhoto(F, r) : F.mode === "estuary" ? qEstuary(F, r) : qClimate(F, r); }

function selfTest(F, qs) {
  const bad = [];
  qs.filter((q) => q.kind === "choice").forEach((q, n) => { const L = q.options.map((o) => o.length); const O = L.filter((_, i) => i !== q.a); if (L[q.a] >= Math.max(...O)) bad.push(`choice ${n} correct option longest`); if (L[q.a] < Math.min(...O)) bad.push(`choice ${n} correct option shortest`); });
  if (F.mode === "photo") {
    if (!F.R.every((v, i) => !i || v < F.R[i - 1]) || F.R.some((v) => v % 2 || v < 4 || v > 58)) bad.push("photo data off");
    if (!F.drops.every((d, i) => !i || d < F.drops[i - 1])) bad.push("drops not shrinking");
    const s = F.counts.reduce((a, b) => a + b, 0); if (s !== 3 * F.R[F.mi] || new Set(F.counts).size !== 3 || [...F.counts].sort((a, b) => a - b)[1] === F.R[F.mi]) bad.push("mean/counts off");
  }
  if (F.mode === "estuary") {
    if (F.S.indexOf(Math.max(...F.S)) !== F.tH || F.S.filter((v) => v > F.S[F.tH] - 2).length !== 1) bad.push("high tide not unique");
    if (F.Tw.some((v) => Math.abs(v * 2 - Math.round(v * 2)) > 1e-9)) bad.push("temp off grid");
    const hi = Math.abs(F.Tw[F.tH + 1] - F.Tw[F.tH - 1]), lo = Math.abs(F.Tw[0] - F.Tw[2]); if (hi > 0.5 + 1e-9) bad.push("temp not steady at high tide");
    if (/oxygen/i.test(JSON.stringify(qs.map((q) => [q.q, q.options, q.why])))) bad.push("dissolved oxygen mentioned");
    if (lo < 0) bad.push("x");
  }
  if (F.mode === "climate") {
    if (!F.C.every((v, i) => !i || v > F.C[i - 1]) || F.C[0] < 315 || F.C[6] > 425 || F.C.some((v) => v % 5)) bad.push("co2 off");
    if (F.M.some((v) => v < F.T0 || v > F.T0 + 3)) bad.push("sst off axis");
    const m = qs.find((q) => q.kind === "multi"); if (m && !m.options.some((o) => /caused/.test(o))) bad.push("causation trap missing");
  }
  const mq = qs.find((q) => q.kind === "multi"); if (!mq) bad.push("no multi");
  return bad;
}

export default {
  key: KEY, group: "Graphs and charts", name: "Linked graphs", topics: "Units 4, 5 and 6 (4.3, 5.6, 6.8)", thumbSeed: 5,
  blurb: "Two linked quantities: a photosynthesis practical, an estuary through one tide, or carbon dioxide and sea temperature. Read the right axis, calculate, plot and judge what the graph shows.",
  tips: ["Find which axis each line uses before you read it. With two y-axes, check the key and read across to the correct side.",
    "Read and plot to within half of the smallest square. Count what one small square is worth on each axis.",
    "Mean = total ÷ number of values. Range = highest − lowest.",
    "Describe a trend in words and quote values with units: \"as the distance increased, the rate fell from … to …\".",
    "Two quantities rising together on a graph do not, on their own, show that one causes the other. The explanation comes from the science."],
  ctx: (F) => (F.mode === "photo" ? "rate of photosynthesis of a water plant with a lamp at different distances" : F.mode === "estuary" ? "salinity and water temperature in an estuary during one tide" : "carbon dioxide in the air and mean sea-surface temperature at a monitoring station"),
  make, svg, questions, selfTest,
  css: `.fig-mlinks .mkx{stroke:currentColor;stroke-width:2.2;fill:none}.fig-mlinks .mkx.hl{stroke:var(--app);stroke-width:3.4}.fig-mlinks .mks{fill:var(--surface2);stroke:currentColor;stroke-width:1.6}.fig-mlinks .mks.hl{fill:var(--app)}
.fig-mlinks .mkd{stroke-dasharray:8 5}.fig-mlinks .mkstu{stroke:var(--accent);stroke-width:3.2;fill:none}.fig-mlinks .mkring{fill:none;stroke:var(--app);stroke-width:3}
.fig-mlinks .mkcons{stroke:var(--app);stroke-width:1.6;stroke-dasharray:4 3}.fig-mlinks .mksm{font-size:16px}.fig-mlinks .mknote{font-size:13px;font-style:italic}`,
};
