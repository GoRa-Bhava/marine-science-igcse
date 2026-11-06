/* ---------- CYCLES, CURVES AND TRENDS (0697 maths requirements: interpret line graphs, interpolate and extrapolate,
   determine the intercept and gradient; 5.1/LO2, 2.1/LO5, 6.8/LO5) ----------
   Three modes, each a generated line graph:
   - "cycle": sea urchins (prey) and sea otters (predators) over 20 years, in two linked panels: peaks, the lag and why.
   - "heat": a heating curve for ice warmed to boiling: the melting and boiling plateaus and why the temperature is constant.
   - "sea": sea-level change with a line of best fit drawn over the data: extrapolate it, find its gradient and intercept.
   Data are generated. */
import { rng, pickR, fmt } from "../core.js";

const KEY = "mtrend";
const tp = (cx, cy, id, on) => (on ? `<circle cx="${cx}" cy="${cy}" r="9" fill="transparent" data-tap="${id}"/>` : "");

function make(seed) {
  const r = rng(seed), m = r();
  if (m < 0.36) {
    for (let t = 0; t < 400; t++) {
      const P = pickR(r, [8, 10]), lag = pickR(r, [2, 3]), ph = r() * 2 * Math.PI, A = 46 + Math.floor(r() * 10), B = 24 + Math.floor(r() * 8), a = 8, b = 4 + Math.floor(r() * 2);
      const prey = [], pred = [];
      for (let y = 0; y <= 20; y++) { prey.push(Math.round(A + B * Math.sin(2 * Math.PI * y / P + ph))); pred.push(Math.round(a + b * Math.sin(2 * Math.PI * (y - lag) / P + ph))); }
      // first prey peak: a strict local maximum, unique within its neighbourhood, with a later predator peak
      let pk = -1; for (let y = 1; y < 12; y++) if (prey[y] > prey[y - 1] && prey[y] > prey[y + 1]) { pk = y; break; }
      if (pk < 1) continue;
      let qk = -1; for (let y = pk + 1; y < 20; y++) if (pred[y] > pred[y - 1] && pred[y] >= pred[y + 1] && pred.slice(pk + 1, y).every((v) => v < pred[y])) { qk = y; break; }
      if (qk < 0 || qk - pk !== lag || prey.filter((v, i) => Math.abs(i - pk) <= 2 && v === prey[pk]).length !== 1) continue;
      if (pred.slice(pk, qk + 2).filter((v) => v === pred[qk]).length !== 1) continue;
      const ry = pickR(r, [...Array(21).keys()].filter((y) => y !== pk && Math.abs(y - pk) > 1));
      return { kind: KEY, seed, mode: "cycle", prey, pred, pk, qk, lag, ry };
    }
    return make(seed + 1);
  }
  if (m < 0.68) {
    // steady heating, so the times follow the real energy needs: ice warms about twice as fast as liquid water (half the
    // specific heat capacity) and melting takes about 0.8 × the time to heat the water from 0 to 100 °C
    const rise = 15 + Math.floor(r() * 6), T0 = -pickR(r, [20, 25, 30]), t1 = Math.max(2, Math.round((rise * -T0) / 200)), melt = Math.round(0.8 * rise);
    const t2 = t1 + melt, t3 = t2 + rise, end = t3 + 3 + Math.floor(r() * 3), pts = [];
    for (let t = 0; t <= end; t++) pts.push(t <= t1 ? T0 + (0 - T0) * t / t1 : t <= t2 ? 0 : t <= t3 ? 100 * (t - t2) / rise : 100);
    const probe = pickR(r, [Math.round((t1 + t2) / 2), Math.round((t2 + t3) / 2), Math.min(end, t3 + 2)]);
    return { kind: KEY, seed, mode: "heat", t1, t2, t3, end, T0, pts, probe };
  }
  for (let t = 0; t < 200; t++) {
    const k = 3 + Math.round(r() * 8) / 10, y0 = 1993 + Math.floor(r() * 3), yrs = [];
    for (let y = 1996; y <= 2020; y += 2) yrs.push(y);
    const v = yrs.map((y) => Math.max(1, Math.round(k * (y - y0) + (r() - 0.5) * 8)));
    // least-squares line through the plotted points
    const n = yrs.length, mx = yrs.reduce((a, b) => a + b, 0) / n, my = v.reduce((a, b) => a + b, 0) / n;
    const sl = yrs.reduce((a, x, i) => a + (x - mx) * (v[i] - my), 0) / yrs.reduce((a, x) => a + (x - mx) ** 2, 0), ic = my - sl * mx;
    const x0 = -ic / sl, at2030 = sl * 2030 + ic;
    if (x0 < 1990.5 || x0 > 1995.5 || at2030 > 145) continue;
    return { kind: KEY, seed, mode: "sea", yrs, v, sl, ic, x0, at2030 };
  }
  return make(seed + 1);
}

/* ---- drawing */
function grid(L, T, pw, ph, cols, rows, mx, my) {
  let s = "";
  for (let i = 0; i <= rows; i++) s += `<line x1="${L}" x2="${L + pw}" y1="${T + i * ph / rows}" y2="${T + i * ph / rows}" class="${i % my ? "gmin" : "gmaj"}"/>`;
  for (let i = 0; i <= cols; i++) s += `<line y1="${T}" y2="${T + ph}" x1="${L + i * pw / cols}" x2="${L + i * pw / cols}" class="${i % mx ? "gmin" : "gmaj"}"/>`;
  return s + `<line x1="${L}" x2="${L + pw}" y1="${T + ph}" y2="${T + ph}" class="axis"/><line x1="${L}" x2="${L}" y1="${T}" y2="${T + ph}" class="axis"/>`;
}
const xm = (x, y, k) => `<path d="M${x - k} ${y - k}L${x + k} ${y + k}M${x - k} ${y + k}L${x + k} ${y - k}" class="mt-x"/>`;
function cycleSVG(F, opt) {
  const W = 560, H = 560, L = 64, pw = 470, hl = opt.hl || {};
  const panel = (vals, T, ph, ymax, step, lab, cls, tapIds) => {
    const rows = ymax / step, X = (i) => L + i * pw / 20, Y = (v) => T + ph - v / ymax * ph;
    let s = grid(L, T, pw, ph, 20, rows, 5, rows > 20 ? 5 : 2);
    for (let i = 0; i <= ymax; i += (rows > 20 ? step * 5 : step * 2)) s += `<text x="${L - 8}" y="${Y(i) + 5}" text-anchor="end">${i}</text>`;
    s += `<polyline points="${vals.map((v, i) => `${X(i)},${Y(v)}`).join(" ")}" class="mt-line ${cls}"/>`;
    vals.forEach((v, i) => { s += `<circle cx="${X(i)}" cy="${Y(v)}" r="3.2" class="mt-dot${(hl.pts || []).includes(`${tapIds}${i}`) ? " hl" : ""}"/>` + tp(X(i), Y(v), `${tapIds}${i}`, opt.tapMode === tapIds); });
    s += `<text transform="translate(18 ${T + ph / 2}) rotate(-90)" text-anchor="middle">${lab}</text>`;
    return s;
  };
  let s = panel(F.prey, 24, 220, 100, 2, "sea urchins per 10 m²", "mt-a", "u") + panel(F.pred, 300, 190, 16, 1, "sea otters per km²", "mt-b", "o");
  for (let i = 0; i <= 20; i += 2) s += `<text x="${L + i * pw / 20}" y="${510}" text-anchor="middle">${i}</text>`;
  s += `<text x="${L + pw / 2}" y="${H - 22}" text-anchor="middle">time / years</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="figsvg fig-${KEY}" role="img" aria-label="Line graphs of sea urchin and sea otter numbers over 20 years">${s}</svg>`;
}
function heatSVG(F, opt) {
  const W = 560, H = 440, L = 70, T = 24, pw = 460, ph = 340, hl = opt.hl || {}, cols = F.end, X = (t) => L + t * pw / cols, Y = (v) => T + ph - (v + 30) / 140 * ph;
  let s = grid(L, T, pw, ph, cols, 28, 5, 2);
  for (let v = -30; v <= 110; v += 10) s += `<text x="${L - 8}" y="${Y(v) + 5}" text-anchor="end">${v}</text>`;
  for (let t = 0; t <= cols; t += cols > 24 ? 4 : 2) s += `<text x="${X(t)}" y="${T + ph + 20}" text-anchor="middle">${t}</text>`;
  const seg = [[0, F.t1], [F.t1, F.t2], [F.t2, F.t3], [F.t3, F.end]];
  seg.forEach(([a, b], k) => { const id = `s${k + 1}`, pts = []; for (let t = a; t <= b; t++) pts.push(`${X(t)},${Y(F.pts[t])}`);
    s += `<polyline points="${pts.join(" ")}" class="mt-line mt-a${(hl.segs || []).includes(id) ? " mt-hl" : ""}"/>`;
    if (opt.tapMode) s += `<polyline points="${pts.join(" ")}" class="mt-hit" data-tap="${id}"/>`; });
  s += `<line x1="${L}" x2="${L + pw}" y1="${Y(0)}" y2="${Y(0)}" class="mt-zero"/>`;
  s += `<text x="${L + pw / 2}" y="${H - 12}" text-anchor="middle">time / minutes</text><text transform="translate(18 ${T + ph / 2}) rotate(-90)" text-anchor="middle">temperature / °C</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="figsvg fig-${KEY}" role="img" aria-label="Heating curve: temperature of ice and water against time">${s}</svg>`;
}
function seaSVG(F, opt) {
  const W = 560, H = 440, L = 64, T = 24, pw = 470, ph = 340, X = (y) => L + (y - 1990) / 45 * pw, Y = (v) => T + ph - v / 150 * ph;
  let s = grid(L, T, pw, ph, 45, 30, 5, 2);
  for (let v = 0; v <= 150; v += 10) s += `<text x="${L - 8}" y="${Y(v) + 5}" text-anchor="end">${v}</text>`;
  for (let y = 1990; y <= 2035; y += 5) s += `<text x="${X(y)}" y="${T + ph + 20}" text-anchor="middle">${y}</text>`;
  F.yrs.forEach((y, i) => (s += xm(X(y), Y(F.v[i]), 4)));
  s += `<line x1="${X(1996)}" y1="${Y(F.sl * 1996 + F.ic)}" x2="${X(2020)}" y2="${Y(F.sl * 2020 + F.ic)}" class="mt-fit"/>`;
  if (opt.reveal) s += `<line x1="${X(F.x0)}" y1="${Y(0)}" x2="${X(2030)}" y2="${Y(F.at2030)}" class="mt-ext"/>`;
  s += `<text x="${L + pw / 2}" y="${H - 12}" text-anchor="middle">year</text><text transform="translate(18 ${T + ph / 2}) rotate(-90)" text-anchor="middle">sea-level change / mm</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="figsvg fig-${KEY}" role="img" aria-label="Graph of sea-level change against year with a line of best fit">${s}</svg>`;
}
function svg(F, opt) { opt = opt || {}; return F.mode === "cycle" ? cycleSVG(F, opt) : F.mode === "heat" ? heatSVG(F, opt) : seaSVG(F, opt); }

/* axes for the reading guide: built from the same geometry each mode's SVG uses. */
function axes(F) {
  if (F.mode === "cycle") {
    const L = 64, pw = 470;
    const mk = (T, ph, ymax, step) => {
      const X = (i) => L + i * pw / 20, Y = (v) => T + ph - v / ymax * ph, rows = ymax / step, lstep = rows > 20 ? step * 5 : step * 2;
      const xt = []; for (let i = 0; i <= 20; i++) xt.push({ at: X(i), label: i % 2 === 0 ? String(i) : undefined });
      const yt = []; for (let v = 0; v <= ymax + 1e-9; v += step) yt.push({ at: Y(v), label: v % lstep === 0 ? String(v) : undefined });
      return { plot: { x0: L, x1: L + pw, y0: T, y1: T + ph }, x: { ticks: xt }, y: { ticks: yt } };
    };
    return [mk(24, 220, 100, 2), mk(300, 190, 16, 1)];
  }
  if (F.mode === "heat") {
    const L = 70, T = 24, pw = 460, ph = 340, cols = F.end, X = (t) => L + t * pw / cols, Y = (v) => T + ph - (v + 30) / 140 * ph, xstep = cols > 24 ? 4 : 2;
    const yt = []; for (let v = -30; v <= 110; v += 5) yt.push({ at: Y(v), label: v % 10 === 0 ? String(v) : undefined });
    const xt = []; for (let t = 0; t <= cols; t++) xt.push({ at: X(t), label: t % xstep === 0 ? String(t) : undefined });
    return [{ plot: { x0: L, x1: L + pw, y0: T, y1: T + ph }, x: { ticks: xt }, y: { ticks: yt } }];
  }
  const L = 64, T = 24, pw = 470, ph = 340, X = (y) => L + (y - 1990) / 45 * pw, Y = (v) => T + ph - v / 150 * ph;
  const yt = []; for (let v = 0; v <= 150; v += 5) yt.push({ at: Y(v), label: v % 10 === 0 ? String(v) : undefined });
  const xt = []; for (let y = 1990; y <= 2035; y++) xt.push({ at: X(y), label: (y - 1990) % 5 === 0 ? String(y) : undefined });
  return [{ plot: { x0: L, x1: L + pw, y0: T, y1: T + ph }, x: { ticks: xt }, y: { ticks: yt } }];
}

/* ---- questions */
function questions(F, r) {
  const qs = [];
  if (F.mode === "cycle") {
    qs.push({ kind: "num", q: `How many sea urchins per 10 m² were there in year ${F.ry}?`, ans: F.prey[F.ry], tol: 1, unit: "per 10 m²", hl: { pts: [`u${F.ry}`], guide: { x: 64 + F.ry * 470 / 20, y: 244 - F.prey[F.ry] / 100 * 220 } },
      why: `Go up from year ${F.ry} to the urchin line and read across: <b>${F.prey[F.ry]}</b> per 10 m². Each small square on that axis is 2, so answers within half a square (1) are accepted.` });
    qs.push({ kind: "tap", q: "Tap the point that shows the first peak in the number of sea urchins.", a: [`u${F.pk}`], askOpt: { tapMode: "u" }, doneOpt: () => ({ tapMode: "u" }), hl: { pts: [`u${F.pk}`] },
      labelOf: (id) => `year ${id.slice(1)}`, ansTxt: `year ${F.pk}`, why: `The urchin numbers rise to their first high point in <b>year ${F.pk}</b>, at ${F.prey[F.pk]} per 10 m², and then fall.` });
    qs.push({ kind: "num", q: "How many years after the first peak in sea urchins did the sea otters reach their next peak?", ans: F.lag, tol: 0, unit: "years", hl: { pts: [`u${F.pk}`, `o${F.qk}`] },
      why: `The urchins peak in year ${F.pk} and the otters in year ${F.qk}, so the otter peak comes <b>${F.lag} years</b> later. The predator peaks always lag behind the prey peaks.` });
    qs.push({ kind: "choice", q: "Explain why the number of sea otters rises after the number of sea urchins rises.", options: ["With more urchins to eat, more otters survive and raise young, so their numbers increase", "Sea otters compete with sea urchins for kelp, so more urchins means more otters", "Sea otters migrate away when there are many urchins, so their numbers fall", "Sea urchins protect young otters from their predators, so more otters survive"], a: 0,
      why: "The otters are predators of the urchins. When there is more food, more otters survive and breed, so the otter population grows, but it takes time to breed, so the rise comes after the urchins' rise. Otters eat urchins rather than competing with them for kelp." });
    qs.push({ kind: "choice", q: "Explain why the number of sea urchins then falls.", options: ["The larger number of otters eats more urchins than are being born", "The urchins run out of space on the seabed, so they stop moving", "The urchins migrate to deeper water to find more kelp to eat", "The otters spread a disease to the urchins, which kills all of them"], a: 0,
      why: "As the otter population grows, the otters eat more urchins, and when more are eaten than are produced, the urchin population falls. Fewer urchins then means less food for the otters, so the otters fall too, and the cycle repeats." });
    qs.push({ kind: "choice", q: "Which statement describes the relationship shown by the two graphs?", options: ["Both populations rise and fall in a repeating cycle, with the otter peaks coming a little after the urchin peaks", "The urchin population rises steadily while the otter population falls steadily over the 20 years", "The two populations always rise and fall at exactly the same time, so their peaks are in the same years", "The two populations are not linked, because their numbers change in completely different ways"], a: 0,
      why: `Both lines go up and down in a regular, repeating cycle, and each otter peak comes about ${F.lag} years after an urchin peak. This lag is typical of a predator–prey relationship.` });
    return qs;
  }
  if (F.mode === "heat") {
    const segName = { s1: "the ice warming up to 0 °C", s2: "the ice melting at 0 °C", s3: "the water warming up from 0 °C to 100 °C", s4: "the water boiling at 100 °C" };
    qs.push({ kind: "tap", q: "Tap the part of the graph that shows the ice melting.", a: ["s2"], askOpt: { tapMode: true }, doneOpt: () => ({ tapMode: true }), hl: { segs: ["s2"] }, labelOf: (id) => segName[id], ansTxt: segName.s2,
      why: "While ice melts, the temperature stays at <b>0 °C</b>, so melting is the first flat section of the graph. The energy taken in is used to separate the particles rather than to raise the temperature." });
    qs.push({ kind: "num", q: "How long did it take for the ice to melt?", ans: F.t2 - F.t1, tol: 0.5, unit: "minutes", hl: { segs: ["s2"] },
      why: `The flat section at 0 °C runs from ${F.t1} minutes to ${F.t2} minutes, so melting took ${F.t2} − ${F.t1} = <b>${F.t2 - F.t1} minutes</b>.` });
    qs.push({ kind: "choice", q: "Why does the temperature stay the same while the ice is melting, even though it is still being heated?", options: ["The energy is used to separate the particles, not to make them move faster", "The heater switches itself off until all of the ice has turned to water", "Melting ice gives out energy, which cancels out the heat being supplied", "The thermometer cannot measure temperatures while there is ice present"], a: 0,
      why: "During a change of state the energy supplied overcomes the forces holding the particles together. The particles' kinetic energy (which temperature measures) does not increase until all the ice has melted. Melting takes in energy; it does not give it out." });
    const st = F.probe < F.t2 && F.probe > F.t1 ? "a mixture of ice and liquid water" : F.probe > F.t3 ? "liquid water turning into water vapour (boiling)" : "liquid water";
    qs.push({ kind: "choice", q: `What is happening to the water at ${F.probe} minutes?`, options: ["a mixture of ice and liquid water", "liquid water", "liquid water turning into water vapour (boiling)", "solid ice only, getting colder"].sort((a, b) => (a === st ? -1 : b === st ? 1 : 0)), a: 0,
      why: `At ${F.probe} minutes the graph shows ${F.probe > F.t1 && F.probe < F.t2 ? "the 0 °C plateau, so ice and water are both present while melting" : F.probe > F.t3 ? "the 100 °C plateau, so the water is boiling" : "the rising section between 0 °C and 100 °C, so it is all liquid water warming up"}: <b>${st}</b>.` });
    qs.push({ kind: "tap", q: "Tap the part of the graph where all of the water is liquid and its temperature is rising.", a: ["s3"], askOpt: { tapMode: true }, doneOpt: () => ({ tapMode: true }), hl: { segs: ["s3"] }, labelOf: (id) => segName[id], ansTxt: segName.s3,
      why: "Between the two flat sections, all the ice has melted and the liquid water warms from 0 °C to 100 °C, so the temperature rises steadily." });
    return qs;
  }
  const sl = F.sl, a30 = F.at2030, k = fmt(Math.round(sl * 10) / 10), x0r = Math.round(F.x0);
  qs.push({ kind: "num", q: "Extend the line of best fit to estimate the sea-level change in 2030.", ans: Math.round(a30), tol: 0, unit: "mm", check: (v) => Math.abs(v - a30) <= 2.5 + 1e-9, doneOpt: () => ({ reveal: true }),
    why: `Continue the straight line beyond 2020 at the same slope, then read across from 2030: about <b>${Math.round(a30)} mm</b>. Answers within half a small square (2.5 mm) of the extended line are accepted.` });
  qs.push({ kind: "num", q: "Use the line of best fit to calculate the average rate of sea-level rise, in mm per year.", ans: Math.round(sl * 10) / 10, tol: 0, unit: "mm per year", check: (v) => Math.abs(v - sl) <= 0.35 + 1e-9,
    why: `Gradient = change in sea level ÷ change in time. For example, from 1996 to 2020 the line rises from ${fmt(Math.round(sl * 1996 + F.ic))} mm to ${fmt(Math.round(sl * 2020 + F.ic))} mm: ${fmt(Math.round(sl * 2020 + F.ic) - Math.round(sl * 1996 + F.ic))} ÷ 24 ≈ <b>${k} mm per year</b>. Use points far apart on the line, not single plotted crosses.` });
  qs.push({ kind: "num", q: "Extend the line of best fit backwards. In which year does it cross 0 mm (the intercept on the year axis)?", ans: x0r, tol: 0, unit: "", check: (v) => Math.abs(v - F.x0) <= 0.5 + 1e-9, doneOpt: () => ({ reveal: true }),
    why: `Extending the line back to where it meets 0 mm gives about <b>${x0r}</b>, the year from which the change is measured. Answers within half a small square (half a year) of the line are accepted.` });
  qs.push({ kind: "choice", q: "Why is the estimate for 2030 less certain than a reading taken from the line between 1996 and 2020?", options: ["It assumes the trend continues unchanged beyond the data, which may not happen", "The line of best fit is drawn less accurately after the year 2020", "Sea level cannot be measured after 2020, so the graph stops", "The crosses after 2020 have been plotted in the wrong places"], a: 0,
    why: "Reading within the data (interpolation) is backed by measurements. Extrapolating assumes the same rate continues, but the rate could speed up (for example if ice sheets melt faster) or slow down, so the estimate is less reliable." });
  qs.push({ kind: "choice", q: "Which statement describes the trend shown by the graph?", options: [`Sea level rose fairly steadily, by about ${k} mm per year`, `Sea level rose quickly at first and then levelled off`, `Sea level rose and fell in a regular cycle`, `Sea level fell by about ${k} mm per year`], a: 0,
    why: `The crosses lie close to a straight, upward line, so sea level rose at a fairly steady rate of about ${k} mm per year over the period.` });
  return qs;
}

function selfTest(F, qs) {
  const bad = [];
  if (F.mode === "cycle") { if (F.qk - F.pk !== F.lag) bad.push("lag"); if (F.prey.some((v) => v < 2 || v > 98) || F.pred.some((v) => v < 1 || v > 15)) bad.push("off scale"); }
  if (F.mode === "heat") { const c = qs[3]; if (new Set(c.options).size !== 4) bad.push("state options"); if (F.pts.length !== F.end + 1) bad.push("pts"); }
  if (F.mode === "sea") { if (F.at2030 > 148 || F.x0 < 1990) bad.push("sea off scale"); if (F.v.some((v) => v > 150)) bad.push("data off scale"); }
  return bad;
}

export default {
  key: KEY, group: "Graphs and charts", name: "Cycles, curves and trends", topics: "5.1, 2.1, 6.8; maths: gradient, intercept, extrapolation", thumbSeed: 4,
  ctx: (F) => (F.mode === "cycle" ? "sea urchin and sea otter numbers over 20 years" : F.mode === "heat" ? "a heating curve for ice warmed until it boils" : "sea-level change since the 1990s"),
  blurb: "Predator–prey cycles, a heating curve with its flat sections, and a sea-level trend to extend, with its gradient and intercept.",
  tips: ["In a predator–prey cycle the predator peaks come after the prey peaks.", "On a heating curve, a flat section is a change of state: the temperature stays the same.", "Gradient = change in y ÷ change in x, using two points far apart on the line.", "To extrapolate, extend the line of best fit at the same slope beyond the data."],
  make, svg, axes, questions, selfTest,
  css: `.fig-mtrend .mt-line{fill:none;stroke-width:2.2}.fig-mtrend .mt-a{stroke:currentColor}.fig-mtrend .mt-b{stroke:currentColor;stroke-dasharray:6 4}.fig-mtrend .mt-dot{fill:currentColor}.fig-mtrend .mt-dot.hl{fill:var(--app);stroke:currentColor;stroke-width:1.5}.fig-mtrend .mt-hl{stroke:var(--app);stroke-width:5}.fig-mtrend .mt-hit{fill:none;stroke:transparent;stroke-width:18;cursor:pointer}.figsvg.fig-mtrend .mt-hit.tapel{fill:none!important;stroke-width:12px!important}.figsvg.fig-mtrend .mt-hit.tapel:not(.sel):not(.tapok):not(.tapno):not(.tapmiss){stroke:transparent!important}.fig-mtrend .mt-zero{stroke:currentColor;stroke-width:1;stroke-dasharray:3 3;opacity:.6}.fig-mtrend .mt-x{stroke:currentColor;stroke-width:2}.fig-mtrend .mt-fit{stroke:currentColor;stroke-width:2}.fig-mtrend .mt-ext{stroke:var(--app);stroke-width:2.5;stroke-dasharray:7 5}`,
};
