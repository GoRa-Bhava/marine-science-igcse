/* ---------- MARINE LINE GRAPH (two series over time, joined point to point) ----------
   0697: Mathematical requirements (draw/interpret line graphs, interpolate, percentage change) and Presentation of
   data (points as ×, plot and read to ½ small square; axes need not include 0). Contexts: 6.9 MPAs, 6.8 climate
   change (sea temperature, decreasing pH), 6.3 fisheries, 5.7/6.8 coral bleaching. All data generated. */
import { rng, pickR, shuffleR, fmt, round1, pickMixed } from "../core.js";

const KEY = "mline";
const yrs = (a, b, s) => { const o = []; for (let y = a; y <= b; y += s) o.push(y); return o; };
const CTX = [
  { id: "mpa", cap: "fish species on coral reefs inside a marine protected area and in a fished area", s: ["reefs inside the MPA", "reefs in the fished area"], yl: "number of fish species", unit: "species", what: "number of fish species",
    x: yrs(2012, 2020, 1), y0: 0, ys: 1, N: 30, sh: [["rise"], ["fall", "fallrise"]], rg: [[8, 28], [4, 20]], pct: true },
  { id: "sst", cap: "mean sea-surface temperature at two reef sites", s: ["Site 1", "Site 2"], yl: "mean sea-surface temperature / °C", unit: "°C", what: "mean sea-surface temperature",
    x: yrs(1985, 2020, 5), y0: 24, ys: 0.1, N: 40, sh: [["rise"], ["rise", "risefall"]], rg: [[4, 36], [3, 30]], pct: false },
  { id: "ph", cap: "pH of surface sea water at two monitoring stations", s: ["Station A", "Station B"], yl: "pH of surface sea water", unit: "", what: "pH of the surface sea water",
    x: yrs(1990, 2020, 5), y0: 8, ys: 0.01, N: 25, sh: [["fall"], ["fall", "fallrise"]], rg: [[4, 23], [2, 20]], pct: false, isPH: true },
  { id: "catch", cap: "the catch from two fish stocks", s: ["Stock A", "Stock B"], yl: "catch / thousand tonnes", unit: "thousand tonnes", what: "catch",
    x: yrs(1970, 2020, 10), y0: 0, ys: 5, N: 40, sh: [["risefall"], ["rise", "fall"]], rg: [[6, 38], [4, 30]], pct: true },
  { id: "coral", cap: "coral cover on two reefs in the years after a bleaching event", s: ["Reef A (protected)", "Reef B (polluted)"], yl: "coral cover / %", unit: "%", what: "coral cover",
    x: yrs(0, 8, 1), xl: (v) => `year ${v}`, xt: "years after the bleaching event", y0: 0, ys: 2, N: 30, sh: [["rise"], ["rise", "fallrise"]], rg: [[3, 28], [2, 16]], pct: true },
];
const lab = (C, i) => (C.xl ? C.xl(C.x[i]) : String(C.x[i]));
const xt = (C) => C.xt || "year";
const dpOf = (C) => (C.ys < 0.1 ? 2 : C.ys < 1 ? 1 : 0);
const vf = (C, v) => fmt(v, dpOf(C));
const uu = (C) => (C.unit ? " " + C.unit : "");

/* integer square heights: strictly monotonic for rise/fall, single interior peak/trough otherwise */
function steps(r, total, k) { const w = Array.from({ length: k }, () => 0.4 + r()), sw = w.reduce((a, b) => a + b, 0); const s = w.map((x) => 1 + Math.floor((total - k) * x / sw)); let rem = total - s.reduce((a, b) => a + b, 0); while (rem-- > 0) s[Math.floor(r() * k)]++; return s; }
function series(r, shape, n, lo, hi) {
  const up = (a, b, k) => { if (b - a < k) b = a + k; const o = [a]; steps(r, b - a, k).forEach((d) => o.push(o[o.length - 1] + d)); return o; };
  if (shape === "rise" || shape === "fall") { const a = lo + Math.floor(r() * 3), b = hi - Math.floor(r() * 3), v = up(a, b, n - 1); return shape === "rise" ? v : v.reverse(); }
  const p = 2 + Math.floor(r() * (n - 4)), top = hi - Math.floor(r() * 3), s0 = lo + Math.floor(r() * 5), e0 = lo + 1 + Math.floor(r() * 6);
  const v = up(s0, top, p).concat(up(e0, top, n - 1 - p).reverse().slice(1));
  return shape === "risefall" ? v : v.map((x) => lo + hi - x);
}
function make(seed) {
  const C = CTX[Math.floor(rng(seed)() * CTX.length)];
  for (let tries = 0; tries < 400; tries++) {
    const r = rng(seed + tries * 7907 + 3), n = C.x.length, sh = [pickR(r, C.sh[0]), pickR(r, C.sh[1])];
    const Q = [0, 1].map((k) => series(r, sh[k], n, C.rg[k][0], C.rg[k][1]));
    if (Q.flat().some((v) => v < 1 || v > C.N - 1)) continue;
    if (Q[0].some((v, i) => Math.abs(v - Q[1][i]) < 2)) continue;                         // never touching: comparisons are clear
    if (sh[0] !== "rise" && sh[0] !== "fall") { const m = sh[0] === "risefall" ? Q[0].indexOf(Math.max(...Q[0])) : Q[0].indexOf(Math.min(...Q[0])); if (m < 1 || m > n - 2) continue; }
    const S = Q.map((a) => a.map((v) => Math.round((C.y0 + v * C.ys) * 1e6) / 1e6));
    return { kind: KEY, seed, C, sh, Q, S, n };
  }
  return make(seed + 1);
}
function geo(F) {
  const W = 560, H = 456, L = 64, R = 20, T = 46, B = 56, cp = 4, cols = (F.n - 1) * cp, pw = W - L - R, ph = H - T - B;
  const sx = pw / cols, sy = ph / F.C.N, X = (i) => L + i * cp * sx, Y = (v) => T + ph - (v - F.C.y0) / F.C.ys * sy;
  return { W, H, L, T, cp, cols, pw, ph, sx, sy, X, Y };
}
const xm = (x, y, k, cls) => `<path d="M${x - k} ${y - k}L${x + k} ${y + k}M${x - k} ${y + k}L${x + k} ${y - k}" class="${cls}"/>`;
/* axes for the reading guide: same geometry svg() uses (geo). y labelled every 5 squares, x at each data point. */
function axes(F) {
  const G = geo(F), { L, T, pw, ph, sx, sy, cols } = G, C = F.C;
  const yt = []; for (let i = 0; i <= C.N; i++) yt.push({ at: T + ph - i * sy, label: i % 5 === 0 ? vf(C, C.y0 + i * C.ys) : undefined });
  const xt = []; for (let i = 0; i <= cols; i++) { const di = i / 4; xt.push({ at: L + i * sx, label: Number.isInteger(di) && di < C.x.length ? String(C.x[di]) : undefined }); }
  return [{ plot: { x0: L, x1: L + pw, y0: T, y1: T + ph }, x: { ticks: xt }, y: { ticks: yt } }];
}
function svg(F, opt) {
  opt = opt || {}; const G = geo(F), { W, H, L, T, pw, ph, sx, sy, X, Y, cols } = G, C = F.C, hl = opt.hl || {};
  let s = "";
  for (let i = 0; i <= C.N; i++) s += `<line x1="${L}" x2="${L + pw}" y1="${T + i * sy}" y2="${T + i * sy}" class="${i % 5 ? "gmin" : "gmaj"}"/>`;
  for (let i = 0; i <= cols; i++) s += `<line y1="${T}" y2="${T + ph}" x1="${L + i * sx}" x2="${L + i * sx}" class="${i % 4 ? "gmin" : "gmaj"}"/>`;
  s += `<line x1="${L}" x2="${L + pw}" y1="${T + ph}" y2="${T + ph}" class="axis"/><line x1="${L}" x2="${L}" y1="${T}" y2="${T + ph}" class="axis"/>`;
  for (let i = 0; i <= C.N; i += 5) s += `<text x="${L - 7}" y="${T + ph - i * sy + 5}" text-anchor="end">${vf(C, C.y0 + i * C.ys)}</text>`;
  C.x.forEach((v, i) => (s += `<text x="${X(i)}" y="${T + ph + 19}" text-anchor="middle">${C.xl ? v : v}</text>`));
  s += `<text x="${L + pw / 2}" y="${H - 9}" text-anchor="middle">${xt(C)}</text><text transform="translate(15 ${T + ph / 2}) rotate(-90)" text-anchor="middle">${C.yl}</text>`;
  const hide = opt.hideIdx;
  let p2 = ""; for (let i = 0; i < F.n - 1; i++) p2 += `<line x1="${X(i)}" y1="${Y(F.S[1][i])}" x2="${X(i + 1)}" y2="${Y(F.S[1][i + 1])}" class="fline mld"/>`;
  F.S[1].forEach((v, i) => { const h = (hl.pts || []).some((p) => p[0] === 1 && p[1] === i); p2 += `<rect x="${X(i) - (h ? 6 : 4)}" y="${Y(v) - (h ? 6 : 4)}" width="${h ? 12 : 8}" height="${h ? 12 : 8}" class="fdot mls${h ? " hl" : ""}"/>`; });
  let p1 = ""; for (let i = 0; i < F.n - 1; i++) if (hide == null || (i !== hide && i + 1 !== hide)) p1 += `<line x1="${X(i)}" y1="${Y(F.S[0][i])}" x2="${X(i + 1)}" y2="${Y(F.S[0][i + 1])}" class="fline"/>`;
  F.S[0].forEach((v, i) => { if (i === hide) return; const h = (hl.pts || []).some((p) => p[0] === 0 && p[1] === i); p1 += xm(X(i), Y(v), h ? 7 : 5, `mlx${h ? " hl" : ""}`); });
  if (opt.showIdx != null) { const i = opt.showIdx; p1 += `<circle cx="${X(i)}" cy="${Y(F.S[0][i])}" r="8" class="mlring"/>`; }
  if (opt.state && opt.state.i != null) p1 += xm(X(opt.state.i), Y(opt.state.v), 7, "mlstu");
  const key = `<g class="fkey"><line x1="${L}" x2="${L + 30}" y1="18" y2="18" class="fline"/>${xm(L + 15, 18, 5, "mlx")}<text x="${L + 38}" y="23">${C.s[0]}</text>
    <line x1="${L + 250}" x2="${L + 280}" y1="18" y2="18" class="fline mld"/><rect x="${L + 261}" y="14" width="8" height="8" class="fdot mls"/><text x="${L + 288}" y="23">${C.s[1]}</text></g>`;
  const hit = opt.plotMode ? `<rect x="${L - 8}" y="${T}" width="${pw + 16}" height="${ph}" fill="transparent" class="plothit"/>` : "";
  return `<svg viewBox="0 0 ${W} ${H}" class="figsvg fig-${KEY}" role="img" aria-label="Line graph of ${C.cap}">${key}${s}${p2}${p1}${hit}</svg>`;
}
function questions(F, r) {
  const C = F.C, S = F.S, Q = F.Q, n = F.n, ys = C.ys, qs = [], A = C.s[0], B = C.s[1], u = uu(C), v = (x) => vf(C, x), G = geo(F);
  const half = `±½ small square (±${fmt(ys / 2)}${u})`, forA = `for <b>${A}</b>`, forB = `for <b>${B}</b>`;
  // 1. read series B at an interior point
  const ri = pickR(r, [...Array(n).keys()].slice(1, n - 1));
  qs.push({ kind: "num", q: `What was the ${C.what} ${forB} in ${lab(C, ri)}?`, ans: S[1][ri], tol: ys / 2, unit: C.unit, dp: dpOf(C) || undefined, hl: { pts: [[1, ri]], guide: { x: G.X(ri), y: G.Y(S[1][ri]) } },
    why: `Find ${lab(C, ri)} on the x-axis, go up to the <b>${B}</b> line (dashed, square points) and read across to the y-axis: <b>${v(S[1][ri])}${u}</b>. Each small square on the y-axis is ${fmt(ys)}${u}, so readings are accepted to ${half}.` });
  // 2. difference between the series in one year
  const di = pickR(r, [...Array(n).keys()].filter((i) => Math.abs(Q[0][i] - Q[1][i]) >= 3)), dd = Math.round(Math.abs(S[0][di] - S[1][di]) * 1e6) / 1e6, hiA = S[0][di] > S[1][di];
  qs.push({ kind: "num", q: `How much ${C.isPH ? "higher was the pH" : `higher was the ${C.what}`} ${hiA ? forA : forB} than ${hiA ? forB : forA} in ${lab(C, di)}?`, ans: dd, tol: ys, unit: C.unit, dp: dpOf(C) || undefined, hl: { pts: [[0, di], [1, di]] },
    why: `Read both lines at ${lab(C, di)}: ${A} ${v(S[0][di])}${u}, ${B} ${v(S[1][di])}${u}. Subtract: ${v(Math.max(S[0][di], S[1][di]))} − ${v(Math.min(S[0][di], S[1][di]))} = <b>${v(dd)}${u}</b>. Accepted to within one small square, because two readings are involved.` });
  // 3. percentage change from two given values (or a change for pH / temperature, where % change is not meaningful)
  if (C.pct) {
    const pairs = []; for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) { const va = S[0][a], vb = S[0][b], pc = Math.abs(vb - va) / va * 100, f = pc - Math.floor(pc);
      if (Math.abs(Q[0][b] - Q[0][a]) >= 4 && Math.abs(f - 0.5) > 0.08 && va > 0) pairs.push([a, b]); }
    const [a, b] = pickR(r, pairs), va = S[0][a], vb = S[0][b], inc = vb > va, pc = Math.round(Math.abs(vb - va) / va * 100), wrong = Math.round(Math.abs(vb - va) / vb * 100);
    qs.push({ kind: "num", q: `For <b>${A}</b>, the ${C.what} was ${v(va)}${u} in ${lab(C, a)} and ${v(vb)}${u} in ${lab(C, b)}. Calculate the percentage ${inc ? "increase" : "decrease"}. Give your answer to the nearest whole number.`,
      ans: pc, tol: 0, unit: "%", check: (x) => Math.abs(x - pc) < 1e-9, hl: { pts: [[0, a], [0, b]] },
      why: `Percentage change = change ÷ original value × 100. Change = ${v(vb)} − ${v(va)} = ${v(Math.abs(Math.round((vb - va) * 1e6) / 1e6))}${u}. ${v(Math.abs(Math.round((vb - va) * 1e6) / 1e6))} ÷ ${v(va)} × 100 = ${fmt(Math.round(Math.abs(vb - va) / va * 1000) / 10)} → <b>${pc}%</b>. Divide by the <b>original</b> (${lab(C, a)}) value${wrong !== pc ? `; dividing by the later value gives ${wrong}%, which is wrong` : ""}.` });
  } else {
    const a = 0, b = n - 1, ch = Math.round((S[0][b] - S[0][a]) * 1e6) / 1e6, inc = ch > 0;
    qs.push({ kind: "num", q: `By how much did the ${C.what} ${forA} ${inc ? "increase" : "decrease"} between ${lab(C, a)} and ${lab(C, b)}?`, ans: Math.abs(ch), tol: ys, unit: C.unit, dp: dpOf(C) || undefined, hl: { pts: [[0, a], [0, b]] },
      why: `${lab(C, a)}: ${v(S[0][a])}${u}; ${lab(C, b)}: ${v(S[0][b])}${u}. Change = ${v(Math.max(S[0][a], S[0][b]))} − ${v(Math.min(S[0][a], S[0][b]))} = <b>${v(Math.abs(ch))}${u}</b>.${C.isPH ? " A fall in pH means the sea water has become more acidic (ocean acidification)." : ""} Accepted to within one small square.` });
  }
  // 4. describe the trend of series A
  const T = { rise: "An overall increase", fall: "An overall decrease", risefall: "An increase, then a decrease", fallrise: "A decrease, then an increase" };
  const sh = F.sh[0], others = ["rise", "fall", "risefall", "fallrise"].filter((x) => x !== sh);
  const pk = sh === "risefall" ? Q[0].indexOf(Math.max(...Q[0])) : sh === "fallrise" ? Q[0].indexOf(Math.min(...Q[0])) : -1;
  qs.push({ kind: "choice", q: `Which phrase best describes the trend in the ${C.what} ${forA} from ${lab(C, 0)} to ${lab(C, n - 1)}?`, options: [T[sh], ...others.map((x) => T[x])], a: 0, hl: {},
    why: `Look at the whole ${A} line (solid, crosses). ${sh === "rise" ? `It goes up in every interval, from ${v(S[0][0])} to ${v(S[0][n - 1])}${u}.` : sh === "fall" ? `It goes down in every interval, from ${v(S[0][0])} to ${v(S[0][n - 1])}${u}.` : sh === "risefall" ? `It rises to a peak of ${v(S[0][pk])}${u} in ${lab(C, pk)}, then falls.` : `It falls to a low of ${v(S[0][pk])}${u} in ${lab(C, pk)}, then rises.`} In a written answer, describe the trend and quote values with units.` });
  // 5. tick the statements the graph supports
  const st = [], first = lab(C, 0), last = lab(C, n - 1);
  const higher = S[0].every((x, i) => x > S[1][i]);
  st.push([`${cap(A)} was higher than ${B} in every ${C.xt ? "year shown" : "year"}.`, higher, higher ? "The solid line is above the dashed line all the way." : (() => { const i = S[0].findIndex((x, k) => x < S[1][k]); return `In ${lab(C, i)} ${A} was ${v(S[0][i])} and ${B} was ${v(S[1][i])}${u}.`; })()]);
  const df = Q[0].map((x, i) => Math.abs(x - Q[1][i])), dm = Math.max(...df);
  if (df.filter((x) => x >= dm - 1).length === 1) { const gi = df.indexOf(dm), ci = r() < 0.5 ? gi : pickR(r, [...Array(n).keys()].filter((i) => i !== gi));
    st.push([`The difference between the two lines was greatest in ${lab(C, ci)}.`, ci === gi, `The biggest gap is in ${lab(C, gi)}: ${v(S[0][gi])} and ${v(S[1][gi])}${u}.`]); }
  const mono = (k) => S[k].slice(1).every((x, i) => x > S[k][i]), monoD = (k) => S[k].slice(1).every((x, i) => x < S[k][i]);
  st.push([`The ${C.what} ${forB.replace(/<\/?b>/g, "")} increased in every interval.`, mono(1), mono(1) ? "Each square point is higher than the one before." : "At least one square point is lower than (or level with) the one before."]);
  const bm = Math.max(...Q[1]); if (Q[1].filter((x) => x === bm).length === 1) { const bi = Q[1].indexOf(bm), ci = r() < 0.5 ? bi : pickR(r, [...Array(n).keys()].filter((i) => Q[1][i] <= bm - 2));
    st.push([`${cap(B)} reached its highest value in ${lab(C, ci)}.`, ci === bi, `${cap(B)} is highest in ${lab(C, bi)} (${v(S[1][bi])}${u}).`]); }
  const ch1 = Q[1][n - 1] - Q[1][0], th = pickR(r, [3, 5, 8, 10].filter((t) => Math.abs(Math.abs(ch1) - t) >= 2));
  if (th != null && ch1 !== 0) st.push([`${cap(B)} changed by more than ${v(th * ys)}${u} between ${first} and ${last}.`, Math.abs(ch1) > th, `${first}: ${v(S[1][0])}${u}; ${last}: ${v(S[1][n - 1])}${u}; a change of ${v(Math.abs(ch1) * ys)}${u}.`]);
  { const i = pickR(r, [...Array(n).keys()]); st.push([`${cap(A)} was higher than ${B} in ${lab(C, i)}.`, S[0][i] > S[1][i], `In ${lab(C, i)}: ${A} ${v(S[0][i])}${u}, ${B} ${v(S[1][i])}${u}.`]); }
  for (let k = 0; k < 20; k++) { const j = Math.floor(r() * n), m = Math.floor(r() * n); if (j === m || Math.abs(Q[0][j] - Q[0][m]) < 2) continue;
    st.push([`For ${A}, the ${C.what} was higher in ${lab(C, j)} than in ${lab(C, m)}.`, S[0][j] > S[0][m], `${A}: ${lab(C, j)} ${v(S[0][j])}${u}; ${lab(C, m)} ${v(S[0][m])}${u}.`]); break; }
  if (monoD(0) && !C.isPH) st.push([`${cap(A)} decreased in every interval.`, true, "Each cross is lower than the one before."]);
  const pick = pickMixed(r, st, 4);
  if (pick) qs.push({ kind: "multi", q: "Tick every statement the graph supports.", options: pick.map((x) => x[0]), a: pick.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0), hl: {},
    why: pick.map((x) => `${x[1] ? "✓" : "✗"} ${x[0]}: ${x[2]}`).join("<br>") });
  // 6. point to point, not best fit
  qs.push({ kind: "choice", q: "The points on this graph are joined point to point with straight lines, not with a best-fit line. Why is this correct here?",
    options: ["The readings were taken one after another in time, so each is joined to the next.", "The points lie close to a straight line, so a best-fit line is not needed.", "The two lines are on the same axes, so a best-fit line would be confusing.", "Joining point to point removes the effect of any anomalous points."], a: 0, hl: {},
    why: "These are measurements in a time sequence, so each point is joined to the next with a ruler to show every change between readings. A best-fit line is drawn only when there is good reason to believe values in between can be predicted, such as when each point is a separate sample." });
  // 7. plot the missing point of series A from a table (last)
  const mi = pickR(r, [...Array(n).keys()].slice(1, n - 1)), mv = S[0][mi], h = ys / 2;
  const tbl = `<div class="mlwrap"><table class="ftable mltbl"><tr><th>${xt(C)}</th>${C.x.map((x) => `<th>${x}</th>`).join("")}</tr><tr><th>${C.yl}</th>${S[0].map((x) => `<td>${v(x)}</td>`).join("")}</tr></table></div>`;
  qs.push({ kind: "plot", q: `The table shows the results ${forA}. The point for ${lab(C, mi)} is missing from the graph. Plot it as a cross (×).${tbl}`, hl: { pts: [[0, mi]] },
    askOpt: { hideIdx: mi, plotMode: true },
    plot: {
      start: { i: 0, v: C.y0 }, answer: { i: mi, v: mv }, hint: "Tap the graph to plot the point, then adjust it with the buttons.",
      fromTap: (p) => { const g = geo(F); return { i: Math.max(0, Math.min(n - 1, Math.round((p.x - g.L) / (g.cp * g.sx)))), v: Math.round((C.y0 + Math.max(0, Math.min(C.N, Math.round((g.T + g.ph - p.y) / g.sy * 2) / 2)) * ys) * 1e6) / 1e6 }; },
      nudges: [["x-", "◀", "Move one interval left"], ["v-", "▼", "Down half a square"], ["v+", "▲", "Up half a square"], ["x+", "▶", "Move one interval right"]],
      nudge: (s, k) => ({ i: k === "x-" ? Math.max(0, s.i - 1) : k === "x+" ? Math.min(n - 1, s.i + 1) : s.i, v: Math.round(Math.max(C.y0, Math.min(C.y0 + C.N * ys, s.v + (k === "v-" ? -h : k === "v+" ? h : 0))) * 1e6) / 1e6 }),
      label: (s) => `Your cross: ${lab(C, s.i)}, ${vf(C, s.v)}${u}.`,
      check: (s) => s.i === mi && Math.abs(s.v - mv) <= h + 1e-9,
    },
    doneOpt: (s, ok) => ({ state: s, showIdx: ok ? null : mi }),
    doneNote: (s, ok) => (ok ? "" : `Ringed: the correct point, ${lab(C, mi)} at ${v(mv)}${u}. Your cross is in orange.`),
    why: `Go up from ${lab(C, mi)} to ${v(mv)}${u}. The y-axis starts at ${v(C.y0)} and each small square is ${fmt(ys)}${u}, so that is ${fmt(Math.round((mv - C.y0) / ys * 10) / 10)} small squares up. Plot a neat cross, accepted to within half a small square.` });
  return qs;
}
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
function selfTest(F, qs) {
  const bad = [], C = F.C;
  F.S.flat().forEach((x) => { const k = (x - C.y0) / C.ys; if (Math.abs(k - Math.round(k)) > 1e-6 || k < 0 || k > C.N) bad.push("off grid " + x); });
  if (F.sh[0] === "rise" && !F.S[0].every((x, i) => !i || x > F.S[0][i - 1])) bad.push("rise not monotonic");
  if (F.sh[0] === "fall" && !F.S[0].every((x, i) => !i || x < F.S[0][i - 1])) bad.push("fall not monotonic");
  const p = qs.find((q) => q.kind === "num" && /percentage/.test(q.q)); if (p) { const m = p.q.match(/was ([\d.]+).* and ([\d.]+)/); if (m && Math.round(Math.abs(+m[2] - +m[1]) / +m[1] * 100) !== p.ans) bad.push("pct mismatch"); }
  return bad;
}

export default {
  key: KEY, group: "Graphs and charts", name: "Line graph", topics: "Units 5 and 6 (5.7, 6.3, 6.8, 6.9)", thumbSeed: 3,
  blurb: "Two lines over time, such as reefs inside and outside a protected area. Read, compare, calculate and plot points.",
  tips: ["Check the key first: which line is which (solid with crosses, or dashed with squares).", "The y-axis does not always start at 0. Read the first label before counting squares.", "Read and plot to within half of the smallest square. Plot points as neat crosses.", "Percentage change = change ÷ original value × 100. Divide by the earlier value.", "Readings taken over time are joined point to point."],
  ctx: (F) => F.C.cap, make, svg, axes, questions, selfTest,
  css: `.fig-mline .mld{stroke-dasharray:8 5}.fig-mline .mls{fill:var(--surface2);stroke:currentColor;stroke-width:1.6}.fig-mline .mls.hl{fill:var(--app)}
.fig-mline .mlx{stroke:currentColor;stroke-width:2.2;fill:none}.fig-mline .mlx.hl{stroke:var(--app);stroke-width:3.4}.fig-mline .mlstu{stroke:var(--accent);stroke-width:3.2;fill:none}
.fig-mline .mlring{fill:none;stroke:var(--app);stroke-width:3}.mlwrap{overflow-x:auto;margin-top:10px;max-width:100%}.mltbl{font-size:12px;width:auto}.mltbl th,.mltbl td{padding:3px 4px}`,
};
