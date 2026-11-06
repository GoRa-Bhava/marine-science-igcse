/* ---------- MARINE SCATTER GRAPH (relationship, anomaly, best-fit line, gradient, reading from the line) ----------
   0697 Presentation of data: a best-fit line (trend line) is a single thin line with a roughly even spread of points
   either side, ignoring clear anomalies; draw one only when intermediate values can be predicted; read from the
   graph to ½ small square; gradient with units. Axes need not include (0, 0). Syllabus does not use the word
   "correlation", so relationships are described in words ("as x increases, y decreases").
   Contexts: 2.3/LO3 temperature vs dissolved oxygen; 2.4 salinity / temperature vs density; 6.7-style outflow
   distance vs species; 5.7/6.8 temperature vs coral bleaching. All data generated. */
import { rng, pickR, shuffleR, fmt } from "../core.js";

const KEY = "mscatter", NC = 40, NR = 30;
const CTX = [
  { id: "do", cap: "water temperature and dissolved oxygen in 12 sea-water samples", xl: "water temperature / °C", x0: 0, xs: 0.5, xw: "water temperature", xu: "°C",
    yl: "dissolved oxygen / mg per dm³", y0: 0, ys: 0.5, yw: "dissolved oxygen", yu: "mg per dm³", gu: "mg per dm³ per °C", L: [10.5, 12.5], R: [5.5, 7.5], dp: 1,
    explain: { q: "Which explanation of the relationship is correct?", options: ["Gases are less soluble in warmer water, so less oxygen dissolves.", "Fish use more oxygen in warm water, which explains the whole pattern.", "Warm water is denser, so less oxygen can mix into it.", "Warm water has more salt in it, so less room is left for oxygen."],
      why: "As temperature rises, gas particles gain kinetic energy and escape from the water more easily, so <b>gases are less soluble in warmer water</b>. This is the opposite of most solids, which dissolve more as temperature rises. Warm water is less dense, not denser, and the samples here are water, not fish." } },
  { id: "sal", cap: "salinity and density in 12 sea-water samples at the same temperature", xl: "salinity / ppt", x0: 15, xs: 0.5, xw: "salinity", xu: "ppt",
    yl: "density / kg per m³", y0: 1005, ys: 1, yw: "density", yu: "kg per m³", gu: "kg per m³ per ppt", L: [1011, 1013], R: [1025, 1027], dp: 1,
    explain: { q: "Which explanation of the relationship is correct?", options: ["Dissolved salts add mass to the same volume, so density increases.", "Salt raises the temperature of the water, which makes the water denser.", "Saltier water holds more dissolved oxygen, which adds to its mass.", "Salt makes the water molecules move faster, so they pack more closely."],
      why: "Density = mass ÷ volume. Dissolving more salt adds mass without much change in volume, so <b>saltier water is denser</b>. The samples were all at the same temperature, so temperature is not the cause, and dissolved oxygen is far too small to change the density." } },
  { id: "temp", cap: "water temperature and density in 12 sea-water samples of the same salinity", xl: "water temperature / °C", x0: 0, xs: 0.5, xw: "water temperature", xu: "°C",
    yl: "density / kg per m³", y0: 1022, ys: 0.2, yw: "density", yu: "kg per m³", gu: "kg per m³ per °C", L: [1027.4, 1028], R: [1023.4, 1024.2], dp: 1,
    explain: { q: "Which explanation of the relationship is correct?", options: ["Warmer water expands, so the same mass takes up more volume.", "Warmer water contains more dissolved salt, which makes it less dense.", "Warmer water loses its dissolved oxygen, which makes it lighter.", "Warmer water molecules move more slowly, so they spread out more."],
      why: "When water is heated its particles gain kinetic energy and move further apart, so the <b>same mass takes up a larger volume</b> and the density falls. The samples all had the same salinity, and the oxygen lost is far too little to change the density. Particles move faster, not slower, when warmer." } },
  { id: "outflow", cap: "number of species at sampling sites at different distances from a sewage outflow", xl: "distance from the outflow / m", x0: 0, xs: 10, xw: "distance from the outflow", xu: "m",
    yl: "number of species", y0: 0, ys: 1, yw: "number of species", yu: "species", gu: "species per m", L: [2, 6], R: [21, 27], dp: 0,
    explain: { q: "Which explanation of the relationship is most likely?", options: ["Pollution is more diluted further away, so more species survive.", "Species move towards the outflow to feed on the extra nutrients it adds.", "The outflow adds oxygen to the water, so few species need to live near it.", "Sites further from the outflow were sampled for longer than the near sites."],
      why: "Near the outflow the water is most polluted (for example low oxygen from decomposing sewage), so only a few tolerant species survive. Further away the pollution is <b>diluted</b>, so more species can live there. Species moving towards the outflow would give the opposite pattern, and a fair survey samples every site in the same way." } },
  { id: "bleach", cap: "mean sea temperature and coral bleaching at 12 reef sites", xl: "mean sea temperature / °C", x0: 26, xs: 0.1, xw: "mean sea temperature", xu: "°C",
    yl: "coral bleached / %", y0: 0, ys: 2, yw: "percentage of coral bleached", yu: "%", gu: "% per °C", L: [2, 8], R: [44, 56], dp: 0,
    explain: { q: "Which explanation of the relationship is correct?", options: ["Heat stress makes the corals expel their zooxanthellae.", "Warmer water holds more nutrients, and these poison the coral polyps.", "Higher temperatures kill the fish that keep the coral clean.", "Warm water is more salty, so the coral skeleton dissolves."],
      why: "Sea temperatures above normal stress the coral polyps, so they <b>expel the zooxanthellae</b> (algae) living in their tissues. The coral loses its colour and its main food source, which is coral bleaching. Nutrients, cleaner fish and salinity are not the cause in this data." } },
];
const fx = (C, v) => fmt(Math.round(v * 100) / 100, C.xs < 1 ? 1 : 0);
const fy = (C, v) => fmt(Math.round(v * 100) / 100, C.ys < 1 ? 1 : 0);
function make(seed) {
  const C = CTX[Math.floor(rng(seed)() * CTX.length)];
  for (let tries = 0; tries < 400; tries++) {
    const r = rng(seed + tries * 6131 + 5), snap = (v) => C.y0 + Math.round((v - C.y0) / C.ys) * C.ys;
    const yL = snap(C.L[0] + r() * (C.L[1] - C.L[0])), yR = snap(C.R[0] + r() * (C.R[1] - C.R[0]));
    const g = (yR - yL) / (NC * C.xs), line = (x) => yL + g * (x - C.x0);
    const n = 12, ai = 3 + Math.floor(r() * 6);
    let X = []; for (let i = 0; i < n; i++) X.push(C.x0 + (3 + (i + 0.15 + r() * 0.7) * 34 / n) * C.xs);
    X = X.map((x) => Math.round(Math.round(x / C.xs * 2) / 2 * C.xs * 1000) / 1000);
    let res = X.map(() => (r() + r() + r() - 1.5) * 1.6 * C.ys);
    const idx = X.map((_, i) => i).filter((i) => i !== ai), mx = idx.reduce((a, i) => a + X[i], 0) / idx.length;
    const mr = idx.reduce((a, i) => a + res[i], 0) / idx.length, sxx = idx.reduce((a, i) => a + (X[i] - mx) ** 2, 0), sxr = idx.reduce((a, i) => a + (X[i] - mx) * (res[i] - mr), 0);
    res = res.map((v, i) => v - mr - sxr / sxx * (X[i] - mx));
    const asg = line(X[ai]) - C.y0 > NR * C.ys / 2 ? -1 : 1; res[ai] = asg * (6.5 + r() * 2) * C.ys;
    const dpow = Math.pow(10, C.dp), top = C.y0 + NR * C.ys;
    const Y = X.map((x, i) => Math.round((line(x) + res[i]) * dpow) / dpow);
    if (Y.some((y) => y < C.y0 || y > top) || [yL, yR].some((y) => y < C.y0 || y > top)) continue;
    if (idx.some((i) => Math.abs(Y[i] - line(X[i])) > 2.6 * C.ys)) continue;
    if (Math.abs(Y[ai] - line(X[ai])) < 6 * C.ys) continue;
    if (new Set(X.map((x, i) => x + "," + Y[i])).size !== n) continue;
    const mY = idx.reduce((a, i) => a + Y[i], 0) / idx.length;
    return { kind: KEY, seed, C, X, Y, ai, g, yL, yR, mx, mY };
  }
  return make(seed + 1);
}
function geo() { const W = 560, H = 470, L = 70, R = 22, T = 26, B = 58, pw = W - L - R, ph = H - T - B; return { W, H, L, T, pw, ph, sx: pw / NC, sy: ph / NR }; }
/* axes for the reading guide: same geometry svg() uses. y label every 5 squares, x every 10. */
function axes(F) {
  const C = F.C, G = geo(), { L, T, pw, ph, sx, sy } = G;
  const yt = []; for (let i = 0; i <= NR; i++) yt.push({ at: T + ph - i * sy, label: i % 5 === 0 ? fy(C, C.y0 + i * C.ys) : undefined });
  const xt = []; for (let i = 0; i <= NC; i++) xt.push({ at: L + i * sx, label: i % 10 === 0 ? fx(C, C.x0 + i * C.xs) : undefined });
  return [{ plot: { x0: L, x1: L + pw, y0: T, y1: T + ph }, x: { ticks: xt }, y: { ticks: yt } }];
}
function clip(F, g, px, py) {
  const C = F.C, x1 = C.x0, x2 = C.x0 + NC * C.xs, y0 = C.y0, y1 = C.y0 + NR * C.ys; let a = [x1, py + g * (x1 - px)], b = [x2, py + g * (x2 - px)];
  const cy = (yy) => [px + (yy - py) / g, yy];
  if (a[1] < y0) a = cy(y0); if (a[1] > y1) a = cy(y1); if (b[1] < y0) b = cy(y0); if (b[1] > y1) b = cy(y1);
  return [a, b];
}
function svg(F, opt) {
  opt = opt || {}; const C = F.C, G = geo(), { W, H, L, T, pw, ph, sx, sy } = G, hl = opt.hl || {};
  const PX = (x) => L + (x - C.x0) / C.xs * sx, PY = (y) => T + ph - (y - C.y0) / C.ys * sy;
  let s = "";
  for (let i = 0; i <= NR; i++) s += `<line x1="${L}" x2="${L + pw}" y1="${T + i * sy}" y2="${T + i * sy}" class="${i % 5 ? "gmin" : "gmaj"}"/>`;
  for (let i = 0; i <= NC; i++) s += `<line y1="${T}" y2="${T + ph}" x1="${L + i * sx}" x2="${L + i * sx}" class="${i % 5 ? "gmin" : "gmaj"}"/>`;
  s += `<line x1="${L}" x2="${L + pw}" y1="${T + ph}" y2="${T + ph}" class="axis"/><line x1="${L}" x2="${L}" y1="${T}" y2="${T + ph}" class="axis"/>`;
  for (let i = 0; i <= NR; i += 5) s += `<text x="${L - 7}" y="${T + ph - i * sy + 5}" text-anchor="end">${fy(C, C.y0 + i * C.ys)}</text>`;
  for (let i = 0; i <= NC; i += 10) s += `<text x="${L + i * sx}" y="${T + ph + 19}" text-anchor="middle">${fx(C, C.x0 + i * C.xs)}</text>`;
  s += `<text x="${L + pw / 2}" y="${H - 10}" text-anchor="middle">${C.xl}</text><text transform="translate(15 ${T + ph / 2}) rotate(-90)" text-anchor="middle">${C.yl}</text>`;
  const seg = (a, b, cls) => `<line x1="${PX(a[0])}" y1="${PY(a[1])}" x2="${PX(b[0])}" y2="${PY(b[1])}" class="${cls}"/>`;
  if (opt.fit) { const [a, b] = clip(F, F.g, C.x0, F.yL); s += seg(a, b, "fline msfit"); }
  if (opt.state && opt.state.g != null) { const [a, b] = clip(F, opt.state.g, F.mx, F.mY); s += seg(a, b, "msuser"); }
  if (opt.mid) s += `<line x1="${PX(opt.mid[0])}" x2="${PX(opt.mid[0])}" y1="${T + ph}" y2="${PY(opt.mid[1])}" class="msc"/><line x1="${L}" x2="${PX(opt.mid[0])}" y1="${PY(opt.mid[1])}" y2="${PY(opt.mid[1])}" class="msc"/>`;
  if (opt.grad) { const a = opt.grad[0], b = opt.grad[1]; s += `<line x1="${PX(a[0])}" x2="${PX(b[0])}" y1="${PY(a[1])}" y2="${PY(a[1])}" class="msc"/><line x1="${PX(b[0])}" x2="${PX(b[0])}" y1="${PY(a[1])}" y2="${PY(b[1])}" class="msc"/>`; }
  F.X.forEach((x, i) => { const cx = PX(x), cy = PY(F.Y[i]), h = (hl.pts || []).includes(i), k = h ? 7 : 5;
    s += `<path d="M${cx - k} ${cy - k}L${cx + k} ${cy + k}M${cx - k} ${cy + k}L${cx + k} ${cy - k}" class="msx${h ? " hl" : ""}"/>`; });
  if (opt.plotMode || opt.showMean) { const cx = PX(F.mx), cy = PY(F.mY); s += `<path d="M${cx - 9} ${cy}H${cx + 9}M${cx} ${cy - 9}V${cy + 9}" class="msmean"/><circle cx="${cx}" cy="${cy}" r="11" class="msmeanc"/>`; }
  if (opt.tapPts) F.X.forEach((x, i) => (s += `<circle cx="${PX(x)}" cy="${PY(F.Y[i])}" r="12" fill="transparent" data-tap="p${i}"/>`));
  const hit = opt.plotMode ? `<rect x="${L}" y="${T}" width="${pw}" height="${ph}" fill="transparent" class="plothit"/>` : "";
  return `<svg viewBox="0 0 ${W} ${H}" class="figsvg fig-${KEY}" role="img" aria-label="Scatter graph of ${C.cap}">${s}${hit}</svg>`;
}
function questions(F, r) {
  const C = F.C, qs = [], pos = F.g > 0, ys = C.ys, yu = C.yu ? " " + C.yu : "", xu = C.xu ? " " + C.xu : "";
  const idx = F.X.map((_, i) => i).filter((i) => i !== F.ai);
  // 1. describe the relationship (syllabus wording, no "correlation")
  const rel = [`As the ${C.xw} increases, the ${C.yw} increases.`, `As the ${C.xw} increases, the ${C.yw} decreases.`, `The ${C.yw} stays about the same as the ${C.xw} increases.`, `As the ${C.xw} increases, the ${C.yw} increases, then decreases.`];
  qs.push({ kind: "choice", q: "Which statement describes the relationship shown by the graph?", options: rel, a: pos ? 0 : 1, hl: {},
    why: `Apart from the anomaly, the crosses form a band that slopes ${pos ? "upwards" : "downwards"} from left to right: as the ${C.xw} increases, the ${C.yw} <b>${pos ? "increases" : "decreases"}</b>. The band is roughly straight, with no peak.` });
  // 2. tap the anomaly
  qs.push({ kind: "tap", q: "One result is anomalous. Tap it on the graph.", a: ["p" + F.ai], askOpt: { tapPts: true }, ansTxt: `the point at ${fx(C, F.X[F.ai])}${xu}, ${fmt(F.Y[F.ai])}${yu}`, hl: { pts: [F.ai] },
    labelOf: (id) => { const i = +id.slice(1); return `${fx(C, F.X[i])}, ${fmt(F.Y[i])}`; },
    why: `The anomalous result does not fit the pattern of the others: at ${fx(C, F.X[F.ai])}${xu} it is ${F.Y[F.ai] > F.yL + F.g * (F.X[F.ai] - C.x0) ? "far above" : "far below"} the band of points. Anomalous results are ignored when the best-fit line is drawn.` });
  // 3. draw the best-fit line (pivot is a screen aid)
  const span = Math.max(...idx.map((i) => Math.abs(F.X[i] - F.mx))), tolG = 2 * ys / span, step = tolG / 2;
  const G = geo(), dX = (px) => C.x0 + (px - G.L) / G.sx * C.xs, dY = (py) => C.y0 + (G.T + G.ph - py) / G.sy * ys;
  qs.push({ kind: "plot", q: "Draw the best-fit line, ignoring the anomalous point. To make this easier on a screen, your line turns about the + (the mean of the other points, which a good best-fit line passes close to). Tap the graph to set the slope.", hl: {},
    askOpt: { plotMode: true },
    plot: {
      start: { g: 0 }, answer: { g: F.g }, hint: "Tap anywhere on the graph: the line goes through the + and the point you tap.",
      fromTap: (p) => { const x = dX(p.x), y = dY(p.y); if (Math.abs(x - F.mx) < C.xs * 1.5) return null; return { g: (y - F.mY) / (x - F.mx) }; },
      nudges: [["b", "↺ turn anticlockwise", "Turn the line anticlockwise"], ["a", "↻ turn clockwise", "Turn the line clockwise"]],
      nudge: (s, k) => ({ g: s.g + (k === "b" ? step : -step) }),
      label: () => "Line drawn.",
      check: (s) => Math.abs(s.g - F.g) <= tolG + 1e-12,
    },
    doneOpt: (s) => ({ state: s, fit: true, showMean: true }),
    doneNote: (s, ok) => (ok ? "Your line (orange) is close to the best-fit line (thick)." : "The thick line is the best-fit line. Your line (orange) is too steep or not steep enough."),
    why: "A best-fit line is a single thin, straight line that follows the trend, with a roughly even spread of points on either side along its whole length. The anomalous point is ignored. Lines are accepted if they stay within 2 small squares of the best-fit line across the data." });
  // 4. read from the line (interpolation)
  const lo = Math.min(...F.X), hi = Math.max(...F.X), k = Math.round((F.yR - F.yL) / ys);
  const cols = [5, 10, 15, 20, 25, 30, 35].filter((c) => { const x = C.x0 + c * C.xs; return x > lo + 2 * C.xs && x < hi - 2 * C.xs; });
  const good = cols.filter((c) => ((k * c / 5) % 4 + 4) % 4 === 0), cc = pickR(r, good.length ? good : cols), Xq = Math.round((C.x0 + cc * C.xs) * 1000) / 1000, Yq = F.yL + F.g * (Xq - C.x0);
  qs.push({ kind: "num", q: `Use the best-fit line to estimate the ${C.yw} when the ${C.xw} is ${fx(C, Xq)}${xu}.`, ans: Yq, tol: ys / 2, unit: C.yu, askOpt: { fit: true }, doneOpt: () => ({ fit: true, mid: [Xq, Yq] }), hl: {},
    ansTxt: `${fmt(Math.round(Yq * 100) / 100)}${yu}`,
    why: `Go up from ${fx(C, Xq)}${xu} on the x-axis to the <b>line</b> (not the nearest cross), then across to the y-axis: about <b>${fmt(Math.round(Yq * 100) / 100)}${yu}</b>. This is interpolation. Accepted to ±½ small square (±${fmt(ys / 2)}${yu}).` });
  // 5. gradient with units
  const gTol = Math.max(Math.abs(F.g) * 0.06, ys / (30 * C.xs)), x2 = C.x0 + NC * C.xs, a0 = [C.x0, F.yL], b0 = [x2, F.yR];
  qs.push({ kind: "num", q: `The best-fit line has been drawn. Calculate its gradient.${pos ? "" : " (A line that slopes down has a negative gradient.)"}`, ans: F.g, tol: gTol, unit: C.gu,
    ansTxt: `${fmt(Number(F.g.toPrecision(3)))} ${C.gu}`, askOpt: { fit: true }, doneOpt: () => ({ fit: true, grad: [a0, b0] }), hl: {},
    why: `Use two points far apart <b>on the line</b> (not data points), e.g. (${fx(C, C.x0)}, ${fy(C, F.yL)}) and (${fx(C, x2)}, ${fy(C, F.yR)}). Gradient = change in y ÷ change in x = (${fy(C, F.yR)} − ${fy(C, F.yL)}) ÷ (${fx(C, x2)} − ${fx(C, C.x0)}) = <b>${fmt(Number(F.g.toPrecision(3)))} ${C.gu}</b>.` });
  // 6. explain the relationship (knowledge-model misconceptions as distractors)
  qs.push({ kind: "choice", q: C.explain.q, options: C.explain.options, a: 0, hl: {}, askOpt: { fit: true }, doneOpt: () => ({ fit: true }), why: C.explain.why });
  // 7. when a best-fit line is used
  qs.push({ kind: "choice", q: "Why is a best-fit line drawn on this graph, instead of joining the points point to point?", askOpt: { fit: true }, doneOpt: () => ({ fit: true }), hl: {},
    options: ["Each point is a separate sample, so the line shows the overall trend.", "The samples were taken one after another, so each joins to the next.", "A best-fit line makes the anomalous result fit the pattern.", "The x-values are not evenly spaced, so the points cannot be joined."], a: 0,
    why: "Each cross is a separate, independent sample, so there is no order to join them in. A best-fit line shows the trend and lets you predict values in between. Point-to-point lines are used for readings taken in sequence, such as a time series, and an anomaly is ignored, not made to fit." });
  return qs;
}
function selfTest(F, qs) {
  const bad = [], idx = F.X.map((_, i) => i).filter((i) => i !== F.ai);
  const mx = idx.reduce((a, i) => a + F.X[i], 0) / idx.length, my = idx.reduce((a, i) => a + F.Y[i], 0) / idx.length;
  const b = idx.reduce((a, i) => a + (F.X[i] - mx) * (F.Y[i] - my), 0) / idx.reduce((a, i) => a + (F.X[i] - mx) ** 2, 0);
  const p = qs.find((q) => q.kind === "plot"); if (!p.plot.check({ g: b })) bad.push("least-squares line rejected");
  if (Math.sign(b) !== Math.sign(F.g)) bad.push("sign");
  const rel = qs[0]; if ((F.g > 0) !== (rel.a === 0)) bad.push("relationship wrong");
  return bad;
}

export default {
  key: KEY, group: "Graphs and charts", name: "Scatter graph", topics: "Units 2, 5 and 6 (2.3, 2.4, 5.7, 6.7, 6.8)", thumbSeed: 9,
  blurb: "Each cross is a separate sample, such as temperature and dissolved oxygen. Describe the relationship, find the anomaly and use a best-fit line.",
  tips: ["Describe the relationship in words: \"as x increases, y decreases\".", "An anomalous result does not fit the pattern. Ignore it when you draw the best-fit line.", "A best-fit line is one thin line with points roughly evenly spread either side. It does not have to pass through any point.", "Read estimates from the line, not from the nearest cross, to ½ small square.", "Gradient = change in y ÷ change in x, using two points far apart on the line. Give units."],
  ctx: (F) => F.C.cap, make, svg, axes, questions, selfTest,
  css: `.fig-mscatter .msx{stroke:currentColor;stroke-width:2;fill:none}.fig-mscatter .msx.hl{stroke:var(--app);stroke-width:3.4}.fig-mscatter .msfit{stroke-width:3}
.fig-mscatter .msuser{stroke:var(--accent);stroke-width:2.6}.fig-mscatter .msmean{stroke:var(--recall);stroke-width:2.6}.fig-mscatter .msmeanc{fill:none;stroke:var(--recall);stroke-width:1.2}
.fig-mscatter .msc{stroke:var(--app);stroke-width:2;stroke-dasharray:4 3}`,
};
