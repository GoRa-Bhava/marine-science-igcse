/* ---------- DEPTH PROFILES (0697 2.5 Effects of increasing depth; 5.3 open-ocean zones) ----------
   Depth is on the vertical axis and INCREASES DOWNWARDS (0 m at the top), as on real depth profiles.
   Two variants, chosen by the seed:
   - "light": light intensity (% of surface light) at two sites with different water clarity, 0–160 m.
     2.5/LO2–3: light decreases with depth (absorbed and scattered by water and particles); clearer water lets
     light penetrate deeper (Secchi disc). Exact percentages are never required as knowledge — they are read off.
   - "column": two side-by-side panels sharing one depth axis, 0–1600 m: temperature with either dissolved oxygen
     or pressure. 2.5/LO4–6 and 5.3/LO3 (sunlight 0–200 m, twilight 200–1000 m, midnight below 1000 m — required
     knowledge, so the zones are NOT drawn while asking). Pressure: "about 1 atmosphere per 10 m" is given by the
     graph, never required as recall. "Thermocline" and "oxygen minimum zone" are never used (forbidden terms).
   Measurements are plotted as points joined point to point. Read/plot tolerance = ±½ smallest square. */
import { rng, pickR, shuffleR, fmt, round1, pickMixed, gridLines } from "../core.js";

const KEY = "depth";
const SITES = ["Site A", "Site B"];
const PLACES_L = ["two survey sites off the same coast", "a clear offshore site and a sheltered bay", "two sites in a coastal sea"];
const PLACES_C = ["an open-ocean research cruise", "a survey station in the open ocean", "a deep-water monitoring station"];
const QTY = {
  temp: { name: "temperature", axis: "temperature / °C", unit: "°C", max: 30, cols: 30, major: 5, label: 5, sq: 1, dp: 1 },
  oxy: { name: "dissolved oxygen", axis: "dissolved oxygen / mg per dm³", unit: "mg per dm³", max: 10, cols: 20, major: 2, label: 4, sq: 0.5, dp: 1 },
  pres: { name: "pressure", axis: "pressure / atm", unit: "atm", max: 200, cols: 20, major: 5, label: 5, sq: 10, dp: 0 },
  light: { name: "light intensity", axis: "light intensity / % of surface light", unit: "%", max: 100, cols: 20, major: 4, label: 4, sq: 5, dp: 0 },
};

function make(seed) {
  for (let tries = 0; ; tries++) {
    const r = rng(seed + tries * 7919);
    if (r() < 0.4) {
      // light variant: points every 10 m, 0–160 m (5 m small squares)
      const kClear = 26 + Math.floor(r() * 16), kTurb = 7 + Math.floor(r() * 8), clearSite = r() < 0.5 ? 0 : 1;
      const depths = Array.from({ length: 17 }, (_, i) => i * 10);
      const series = [0, 1].map((s) => depths.map((d) => Math.round(100 * Math.exp(-d / (s === clearSite ? kClear : kTurb)))));
      if (series.some((S) => S.slice(1, 4).some((v, i) => v >= S[i]))) continue; // strictly falling from 0 to 30 m
      return { kind: KEY, variant: "light", seed, place: pickR(r, PLACES_L), dmax: 160, rows: 32, dsq: 5, dmajor: 4, depths, series, clearSite, k: [clearSite === 0 ? kClear : kTurb, clearSite === 1 ? kClear : kTurb] };
    }
    // column variant: points every 100 m, 0–1600 m (50 m small squares; majors every 200 m)
    const Ts = 18 + Math.floor(r() * 11), Td = 2 + Math.floor(r() * 4), m = 50 + 50 * Math.floor(r() * 3), L = 160 + 20 * Math.floor(r() * 8);
    const depths = Array.from({ length: 17 }, (_, i) => i * 100);
    const temp = depths.map((d) => round1(d <= m ? Ts : Td + (Ts - Td) * Math.exp(-(d - m) / L)));
    const second = r() < 0.55 ? "oxy" : "pres";
    let other;
    if (second === "oxy") {
      const Os = (70 + Math.floor(r() * 21)) / 10, Od = (10 + Math.floor(r() * 16)) / 10, Lo = 180 + 20 * Math.floor(r() * 9), mo = 50 * Math.floor(r() * 2);
      other = depths.map((d) => round1(d <= mo ? Os : Od + (Os - Od) * Math.exp(-(d - mo) / Lo)));
    } else other = depths.map((d) => 1 + d / 10);
    const ch = (a, b) => Math.abs(temp[depths.indexOf(a)] - temp[depths.indexOf(b)]);
    // zone changes: midnight (1000–1600) must change clearly least, sunlight (0–200) more than midnight by ≥ 1 °C
    if (!(ch(0, 200) >= ch(1000, 1600) + 1 && ch(200, 1000) >= ch(1000, 1600) + 3 && ch(200, 1000) >= ch(0, 200) + 1)) continue;
    return { kind: KEY, variant: "column", seed, place: pickR(r, PLACES_C), dmax: 1600, rows: 32, dsq: 50, dmajor: 4, depths, temp, second, other };
  }
}

function geo(F) {
  const W = 560, T = 74, B = 18, ph = F.rows * 10, L = 62, R = 16;
  if (F.variant === "light") return { W, H: T + ph + B, T, ph, panels: [{ q: "light", x: L, w: W - L - R }] };
  const gap = 30, w = (W - L - R - gap) / 2;
  return { W, H: T + ph + B, T, ph, panels: [{ q: "temp", x: L, w }, { q: F.second, x: L + w + gap, w }] };
}
const yD = (G, F, d) => G.T + d / F.dmax * G.ph;
const xV = (P, v) => P.x + v / QTY[P.q].max * P.w;

/* axes for the reading guide: depth (y) runs DOWN the left; the value axis is along the TOP of each panel. */
function axes(F) {
  const G = geo(F);
  const yt = []; for (let rr = 0; rr <= F.rows; rr++) yt.push({ at: G.T + rr * G.ph / F.rows, label: rr % F.dmajor === 0 ? String(rr * F.dsq) : undefined });
  return G.panels.map((P) => {
    const Q = QTY[P.q], xt = [];
    for (let c = 0; c <= Q.cols; c++) xt.push({ at: P.x + c * P.w / Q.cols, label: c % Q.label === 0 ? fmt(c * Q.sq) : undefined });
    return { plot: { x0: P.x, x1: P.x + P.w, y0: G.T, y1: G.T + G.ph }, x: { ticks: xt }, y: { ticks: yt }, xAxisY: G.T, yAxisX: P.x };
  });
}
const seriesOf = (F, q, s) => (q === "light" ? F.series[s] : q === "temp" ? F.temp : F.other);

function svg(F, opt) {
  opt = opt || {}; const G = geo(F), hl = opt.hl || {};
  let s = "";
  G.panels.forEach((P, pi) => {
    const Q = QTY[P.q];
    s += gridLines(P.x, G.T, P.w, G.ph, Q.cols, F.rows, Q.major, F.dmajor);
    for (let c = 0; c <= Q.cols; c += Q.label) s += `<text x="${P.x + c * P.w / Q.cols}" y="${G.T - 8}" text-anchor="middle">${fmt(c * Q.sq)}</text>`;
    s += `<text x="${P.x + P.w / 2}" y="${G.T - 30}" text-anchor="middle" class="dpaxis">${Q.axis}</text>`;
    s += `<line x1="${P.x}" x2="${P.x + P.w}" y1="${G.T}" y2="${G.T}" class="axis"/><line x1="${P.x}" x2="${P.x}" y1="${G.T}" y2="${G.T + G.ph}" class="axis"/>`;
    if (pi === 0) {
      for (let rr = 0; rr <= F.rows; rr += F.dmajor) s += `<text x="${P.x - 7}" y="${G.T + rr * G.ph / F.rows + 5}" text-anchor="end">${rr * F.dsq}</text>`;
      s += `<text transform="translate(14 ${G.T + G.ph / 2}) rotate(-90)" text-anchor="middle">depth / m</text>`;
      s += `<path d="M ${P.x - 46} ${G.T + G.ph * 0.62} l 0 26 m -5 -9 l 5 9 l 5 -9" class="dparrow"/>`;
    }
    const nS = P.q === "light" ? 2 : 1;
    for (let si = 0; si < nS; si++) {
      const S = seriesOf(F, P.q, si); let pts = [];
      F.depths.forEach((d, i) => { if (opt.hideP && opt.hideP.q === P.q && opt.hideP.s === si && opt.hideP.i === i) return; pts.push([xV(P, S[i]), yD(G, F, d)]); });
      s += `<polyline points="${pts.map((p) => p.map((v) => v.toFixed(1)).join(",")).join(" ")}" class="fline${si ? " dpdash" : ""}"/>`;
      F.depths.forEach((d, i) => { if (opt.hideP && opt.hideP.q === P.q && opt.hideP.s === si && opt.hideP.i === i) return;
        const x = xV(P, S[i]), y = yD(G, F, d); s += si ? `<rect x="${x - 3}" y="${y - 3}" width="6" height="6" class="dpsq"/>` : `<circle cx="${x}" cy="${y}" r="3" class="fdot"/>`; });
    }
    // tappable zone bands (temperature panel only, transparent while asking)
    if (opt.tapZones && pi === 0) [["sun", 0, 200], ["twi", 200, 1000], ["mid", 1000, F.dmax]].forEach(([id, a, b]) => (s += `<rect x="${P.x}" y="${yD(G, F, a)}" width="${P.w}" height="${yD(G, F, b) - yD(G, F, a)}" data-tap="${id}" fill="transparent" stroke="transparent"/>`));
    if (opt.plotMode && opt.plotPanel === pi) s += `<rect x="${P.x}" y="${G.T}" width="${P.w}" height="${G.ph}" fill="transparent" class="plothit" data-panel="${pi}"/>`;
  });
  if (hl.zones) { const P = G.panels[0], x2 = G.panels[G.panels.length - 1].x + G.panels[G.panels.length - 1].w;
    for (const d of [200, 1000]) s += `<line x1="${P.x}" x2="${x2}" y1="${yD(G, F, d)}" y2="${yD(G, F, d)}" class="dpzone"/>`;
    for (const [a, b, nm] of [[0, 200, "sunlight zone"], [200, 1000, "twilight zone"], [1000, F.dmax, "midnight zone"]]) s += `<text x="${(P.x + x2) / 2}" y="${(yD(G, F, a) + yD(G, F, b)) / 2 + 5}" text-anchor="middle" class="dpzt">${nm}</text>`; }
  if (hl.mark) for (const m of [].concat(hl.mark)) { const P = G.panels[m.p], x = xV(P, m.v), y = yD(G, F, m.d);
    s += `<line x1="${P.x}" x2="${x}" y1="${y}" y2="${y}" class="dpcons"/><line x1="${x}" x2="${x}" y1="${G.T}" y2="${y}" class="dpcons"/><circle cx="${x}" cy="${y}" r="5" class="fdot hl"/>`; }
  if (opt.state && typeof opt.state.d === "number") { const P = G.panels[opt.state.p], x = xV(P, opt.state.v), y = yD(G, F, opt.state.d);
    s += `<g class="plotted dpcross"><line x1="${x - 7}" x2="${x + 7}" y1="${y - 7}" y2="${y + 7}"/><line x1="${x - 7}" x2="${x + 7}" y1="${y + 7}" y2="${y - 7}"/></g>`; }
  if (F.variant === "light") s += `<g class="fkey"><line x1="${G.W - 250}" x2="${G.W - 222}" y1="16" y2="16" class="fline"/><circle cx="${G.W - 236}" cy="16" r="3" class="fdot"/><text x="${G.W - 214}" y="21">${SITES[0]}</text><line x1="${G.W - 130}" x2="${G.W - 102}" y1="16" y2="16" class="fline dpdash"/><rect x="${G.W - 119}" y="13" width="6" height="6" class="dpsq"/><text x="${G.W - 94}" y="21">${SITES[1]}</text></g>`;
  return `<svg viewBox="0 0 ${G.W} ${G.H}" class="figsvg fig-${KEY}" role="img" aria-label="Depth profile with depth increasing downwards">${s}</svg>`;
}

/* plot question on one panel/series: a missing measured point */
function plotQ(F, G, pi, si, i, label) {
  const P = G.panels[pi], Q = QTY[P.q], S = seriesOf(F, P.q, si), d = F.depths[i], v = S[i], hx = Q.sq / 2, hy = F.dsq / 2;
  const snap = (x, st) => Math.round(x / st) * st, clampV = (x) => Math.max(0, Math.min(Q.max, x)), clampD = (x) => Math.max(0, Math.min(F.dmax, x));
  return { kind: "plot", q: `The ${label} reading at <b>${d} m</b> was <b>${fmt(v, Q.dp)} ${Q.unit}</b>. It is missing from the graph. Plot it with a cross (×).`,
    askOpt: { plotMode: true, plotPanel: pi, hideP: { q: P.q, s: si, i } },
    plot: { start: { p: pi, v: 0, d: 0 }, answer: { p: pi, v, d }, hint: "Tap the graph to place your cross.",
      fromTap: (p) => ({ p: pi, v: clampV(round2(snap((p.x - P.x) / P.w * Q.max, hx))), d: clampD(snap((p.y - G.T) / G.ph * F.dmax, hy)) }),
      nudges: [["l", "◀", `Move the cross ${fmt(hx)} ${Q.unit} lower`], ["u", "▲", `Move the cross ${hy} m shallower`], ["dn", "▼", `Move the cross ${hy} m deeper`], ["r", "▶", `Move the cross ${fmt(hx)} ${Q.unit} higher`]],
      nudge: (s, k) => ({ p: pi, v: clampV(round2(s.v + (k === "l" ? -hx : k === "r" ? hx : 0))), d: clampD(s.d + (k === "u" ? -hy : k === "dn" ? hy : 0)) }),
      label: (s) => `Your cross: ${fmt(s.d)} m, ${fmt(s.v)} ${Q.unit}.`,
      check: (s) => s.p === pi && Math.abs(s.d - d) <= hy + 1e-9 && Math.abs(s.v - v) <= hx + 1e-9 },
    doneOpt: (s, ok) => ({ state: s, hideP: ok ? { q: P.q, s: si, i } : null, hl: { mark: { p: pi, v, d } } }),
    doneNote: (s, ok) => (ok ? "" : `The correct point is highlighted: ${d} m, ${fmt(v, Q.dp)} ${Q.unit}.`),
    why: `Find ${d} m on the depth axis (depth increases <b>down</b> the page), then go across to ${fmt(v, Q.dp)} ${Q.unit} on the ${Q.name} axis at the top. Each small square is ${F.dsq} m down and ${fmt(Q.sq)} ${Q.unit} across; a cross within half a small square is marked right.` };
}
const round2 = (v) => Math.round(v * 100) / 100;

function lightQuestions(F, r) {
  const qs = [], G = geo(F), cs = F.clearSite, ts = 1 - cs, Q = QTY.light;
  const siteLine = (s) => (s ? "dashed line with squares" : "solid line with dots");
  // 1. read % at a depth
  const s1 = r() < 0.5 ? 0 : 1, i1 = pickR(r, F.depths.map((_, i) => i).filter((i) => F.series[s1][i] >= 10 && F.series[s1][i] <= 90));
  qs.push({ kind: "num", q: `What was the light intensity at <b>${F.depths[i1]} m</b> at <b>${SITES[s1]}</b>?`, ans: F.series[s1][i1], tol: 2.5, unit: "% of surface light", hl: { mark: { p: 0, v: F.series[s1][i1], d: F.depths[i1] } },
    why: `Go down to ${F.depths[i1]} m on the depth axis, across to the ${siteLine(s1)} (${SITES[s1]}), then up to the light axis: <b>${F.series[s1][i1]}%</b>. Each small square across is 5%, so read to the nearest 2.5%.` });
  // 2. depth where light falls to a value (between two measured points: read along the line)
  const s2 = 1 - s1, Sx = F.series[s2], cand = [50, 40, 30, 25, 20].filter((p) => Sx.some((v, i) => i && Sx[i - 1] > p && v < p && Sx[i - 1] - v >= 6) && !Sx.includes(p));
  const pct = cand.length ? pickR(r, cand) : null;
  if (pct != null) { const i = Sx.findIndex((v) => v < pct), d = F.depths[i - 1] + (Sx[i - 1] - pct) / (Sx[i - 1] - Sx[i]) * 10;
    qs.push({ kind: "num", q: `At what depth did the light intensity at <b>${SITES[s2]}</b> fall to <b>${pct}%</b> of surface light?`, ans: round1(d), tol: 2.5, unit: "m", ansTxt: `about ${fmt(round1(d))} m`, hl: { mark: { p: 0, v: pct, d } },
      why: `Find ${pct}% on the light axis, go straight down to the ${siteLine(s2)} (${SITES[s2]}) — between the readings at ${F.depths[i - 1]} m (${Sx[i - 1]}%) and ${F.depths[i]} m (${Sx[i]}%) — then across to the depth axis: about <b>${fmt(Math.round(d))} m</b>. Accepted to within half a small square (2.5 m).` }); }
  // 3. clearer water
  qs.push({ kind: "choice", q: "At which site is the water clearer?", options: [SITES[cs], SITES[ts], "The water is equally clear at both sites"], a: 0, hl: {},
    why: `In clearer water, light penetrates deeper. At ${SITES[cs]} the light falls more slowly with depth (for example ${F.series[cs][2]}% at 20 m, against ${F.series[ts][2]}% at ${SITES[ts]}), so its water is clearer. Murky water has more particles, which absorb and scatter the light.` });
  // 4. Secchi disc (2.5/LO3)
  qs.push({ kind: "choice", q: "A Secchi disc is lowered at each site. Which statement is correct?", options: [`It disappears at a greater depth at ${SITES[cs]}`, `It disappears at a greater depth at ${SITES[ts]}`, "It disappears at the same depth at both sites", "It measures how deep the water is at each site"], a: 0, hl: {},
    why: `A Secchi disc is lowered until it just disappears. That depth measures water clarity (light penetration), not the depth of the water. ${SITES[cs]} has clearer water, so the disc stays visible to a greater depth there.` });
  // 5. why light decreases
  qs.push({ kind: "choice", q: "Why does light intensity decrease with depth?", options: ["Light is absorbed and scattered by the water and particles in it", "The higher pressure at depth squeezes the light out of the water", "The colder water at depth blocks the light from passing through", "Light travels a fixed distance into any water and then stops"], a: 0, hl: {},
    why: "Water and the particles in it absorb and scatter light, so less light reaches each deeper layer. It fades gradually rather than stopping at a fixed depth, and pressure and temperature are not the cause." });
  // 6. tick statements
  const at = (s, d) => F.series[s][F.depths.indexOf(d)];
  const st = [];
  for (const d of shuffleR(r, [10, 20, 30, 40])) { const a = at(cs, d), b = at(ts, d); if (b > 0 && Math.abs(a / b - 2) > 0.3) { st.push([`At ${d} m, ${SITES[cs]} receives more than twice as much light as ${SITES[ts]}.`, a > 2 * b, `At ${d} m: ${SITES[cs]} ${a}%, ${SITES[ts]} ${b}%.`]); break; } }
  for (const th of shuffleR(r, [5, 10, 20])) { const dd = F.depths.find((d) => at(ts, d) < th); if (dd == null) continue; const cut = pickR(r, [40, 60, 80]); const first = dd;
    if (Math.abs(first - cut) >= 10) { st.push([`At ${SITES[ts]} the light falls below ${th}% before ${cut} m.`, first < cut, `${SITES[ts]} first reads below ${th}% at ${first} m.`]); break; } }
  { const d = pickR(r, [100, 120, 140]); const v = at(cs, d); if (Math.abs(v - 5) >= 2) st.push([`At ${SITES[cs]} more than 5% of surface light still reaches ${d} m.`, v > 5, `${SITES[cs]} reads ${v}% at ${d} m.`]); }
  st.push([`At both sites, each reading from the surface down to 30 m is lower than the one above it.`, true, "Both lines keep falling over the first 30 m."]);
  st.push([`Light reaches the same depth at both sites before it is almost gone.`, false, `Light fades much faster at ${SITES[ts]} than at ${SITES[cs]}.`]);
  const pick = pickMixed(r, st, 4);
  if (pick) qs.push({ kind: "multi", q: "Tick every statement the graph supports.", options: pick.map((x) => x[0]), a: pick.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0), hl: {}, why: pick.map((x) => `${x[1] ? "✓" : "✗"} ${x[0]} — ${x[2]}`).join("<br>") });
  // 7. plot a missing point
  const ps = r() < 0.5 ? 0 : 1, pi = pickR(r, F.depths.map((_, i) => i).filter((i) => i >= 1 && i <= 8 && F.series[ps][i] >= 8));
  qs.push(plotQ(F, G, 0, ps, pi, `${SITES[ps]}`));
  return qs;
}

function columnQuestions(F, r) {
  const qs = [], G = geo(F), T = F.temp, O = F.other, two = F.second, Q2 = QTY[two];
  const di = (d) => F.depths.indexOf(d);
  // 1. read temperature at a depth (on a measured point, not 200 m — that is Q2)
  const d1 = pickR(r, [300, 400, 500, 600, 700, 800]);
  qs.push({ kind: "num", q: `What was the temperature at <b>${d1} m</b>?`, ans: T[di(d1)], tol: 0.5, unit: "°C", dp: 1, hl: { mark: { p: 0, v: T[di(d1)], d: d1 } },
    why: `Go down to ${d1} m on the depth axis (depth increases down the page), across to the temperature line, then up to the temperature axis: <b>${fmt(T[di(d1)], 1)} °C</b>. Each small square across is 1 °C, so read to the nearest 0.5 °C.` });
  // 2. temperature at the bottom of the sunlight zone (needs 5.3/LO3: 200 m)
  qs.push({ kind: "num", q: "What was the temperature at the bottom of the <b>sunlight zone</b>?", ans: T[di(200)], tol: 0.5, unit: "°C", dp: 1, hl: { mark: { p: 0, v: T[di(200)], d: 200 }, zones: true },
    why: `The sunlight zone is from 0 m to 200 m, so read the temperature at <b>200 m</b>: <b>${fmt(T[di(200)], 1)} °C</b>. The twilight zone is 200–1000 m and the midnight zone is below 1000 m.` });
  // 3. tap the zone where the temperature changes least
  const chg = { sun: Math.abs(T[0] - T[di(200)]), twi: Math.abs(T[di(200)] - T[di(1000)]), mid: Math.abs(T[di(1000)] - T[di(1600)]) };
  const most = r() < 0.5;
  qs.push({ kind: "tap", q: `Tap the <b>zone</b> of the ocean where the temperature changes the ${most ? "most" : "least"}. (Tap on the temperature graph.)`, a: [most ? "twi" : "mid"], ansTxt: most ? "the twilight zone (200–1000 m)" : "the midnight zone (below 1000 m)", labelOf: (id) => ({ sun: "sunlight zone", twi: "twilight zone", mid: "midnight zone" }[id]),
    hint: "Tap a depth on the temperature graph to choose that zone.", askOpt: { tapZones: true }, doneOpt: () => ({ tapZones: true, hl: { zones: true } }),
    why: `Sunlight zone (0–200 m): changes by ${fmt(round1(chg.sun))} °C. Twilight zone (200–1000 m): ${fmt(round1(chg.twi))} °C. Midnight zone (below 1000 m): only ${fmt(round1(chg.mid))} °C — the deep water has a <b>very stable, low temperature</b>. ${most ? "The biggest change is in the <b>twilight zone</b>, where the warm surface water gives way to cold deep water." : ""}` });
  // 4–5. second quantity
  if (two === "oxy") {
    const d4 = pickR(r, [100, 200, 300, 400, 500, 600].filter((d) => O[di(d)] < O[0] - 0.3));
    qs.push({ kind: "num", q: `What was the dissolved oxygen concentration at <b>${d4} m</b>?`, ans: O[di(d4)], tol: 0.25, unit: "mg per dm³", dp: 1, hl: { mark: { p: 1, v: O[di(d4)], d: d4 } },
      why: `Go down to ${d4} m, across to the dissolved oxygen line, then up to its axis: <b>${fmt(O[di(d4)], 1)} mg per dm³</b>. Each small square across is 0.5 mg per dm³, so read to the nearest 0.25.` });
    qs.push({ kind: "choice", q: "Why is the dissolved oxygen concentration highest near the surface?", options: ["Oxygen dissolves from the air and is released by photosynthesis", "Warm surface water can hold more dissolved oxygen than cold water", "Breaking waves split the water molecules to release oxygen gas", "Fish near the surface breathe out oxygen into the water around them"], a: 0, hl: {},
      why: "Near the surface, oxygen dissolves into the water from the atmosphere, and producers in the sunlight zone release oxygen by photosynthesis. Warm water actually holds <b>less</b> dissolved gas than cold water, and animals take oxygen in rather than give it out." });
    qs.push({ kind: "choice", q: "Why is there little dissolved oxygen in deep water?", options: ["There is no light for photosynthesis, and respiration uses oxygen up", "Cold deep water is not able to hold any dissolved oxygen at all", "The very high pressure at depth squeezes the oxygen out of the water", "Bioluminescent animals use up nearly all of the oxygen to make light"], a: 0, hl: {},
      why: "Below the sunlight zone there is no light, so there is no photosynthesis to add oxygen. Organisms respiring, and the decomposition of organic matter sinking from above, use up oxygen, and little mixes down from the surface. Cold water can hold dissolved oxygen — there is just no source of it at depth." });
  } else {
    const d4 = pickR(r, [300, 500, 700, 900, 1100, 1300]), v4 = O[di(d4)];
    qs.push({ kind: "num", q: `What was the pressure at <b>${d4} m</b>?`, ans: v4, tol: 5, unit: "atm", hl: { mark: { p: 1, v: v4, d: d4 } },
      why: `Go down to ${d4} m, across to the pressure line, then up to the pressure axis: <b>${v4} atm</b>. Each small square across is 10 atm, so read to the nearest 5 atm.` });
    const [a5, b5] = pickR(r, [[200, 800], [400, 1000], [300, 900], [600, 1400], [200, 1200]]), inc = O[di(b5)] - O[di(a5)];
    qs.push({ kind: "num", q: `By how much did the pressure increase between <b>${a5} m</b> and <b>${b5} m</b>?`, ans: inc, tol: 10, unit: "atm", hl: { mark: [{ p: 1, v: O[di(a5)], d: a5 }, { p: 1, v: O[di(b5)], d: b5 }] },
      why: `At ${a5} m the pressure is ${O[di(a5)]} atm; at ${b5} m it is ${O[di(b5)]} atm. Increase = ${O[di(b5)]} − ${O[di(a5)]} = <b>${inc} atm</b>. Each reading may be half a small square out, so answers within 10 atm are accepted.` });
    qs.push({ kind: "choice", q: "Why does pressure increase with depth?", options: ["The weight of the water above increases with depth", "Deeper water is saltier, so it presses down harder", "Colder deep water pushes sideways more strongly", "The seabed pushes up on the water above it"], a: 0, hl: {},
      why: "Pressure is caused by the weight of the water above. The deeper you go, the more water there is above, so the pressure increases steadily — the graph is a straight line. It does not depend on how salty or cold the water is." });
  }
  // 6. tick statements
  const st = [];
  const thT = pickR(r, [4, 6, 8, 10].filter((t) => Math.abs(T[di(1000)] - t) >= 1));
  if (thT != null) st.push([`The temperature at 1000 m was less than ${thT} °C.`, T[di(1000)] < thT, `At 1000 m the temperature is ${fmt(T[di(1000)], 1)} °C.`]);
  st.push(["The temperature changed more in the twilight zone than in the midnight zone.", chg.twi > chg.mid, `Twilight zone: ${fmt(round1(chg.twi))} °C; midnight zone: ${fmt(round1(chg.mid))} °C.`]);
  st.push(["Below 1000 m the temperature rises again with depth.", T[di(1600)] > T[di(1000)], `It falls from ${fmt(T[di(1000)], 1)} °C at 1000 m to ${fmt(T[di(1600)], 1)} °C at 1600 m.`]);
  st.push(["The warmest water was at the surface.", T[0] >= Math.max(...T), `The highest temperature, ${fmt(T[0], 1)} °C, is at the surface.`]);
  if (two === "oxy") { const ratio = O[0] / O[di(1000)]; if (Math.abs(ratio - 3) > 0.3) st.push(["The dissolved oxygen at the surface was more than three times the value at 1000 m.", ratio > 3, `Surface ${fmt(O[0], 1)}; 1000 m ${fmt(O[di(1000)], 1)} mg per dm³.`]); }
  else st.push(["The pressure increased by the same amount for every 100 m of depth.", true, "The pressure line is straight: about 10 atm more for every 100 m."]);
  const pick = pickMixed(r, st, 4);
  if (pick) qs.push({ kind: "multi", q: "Tick every statement the graphs support.", options: pick.map((x) => x[0]), a: pick.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0), hl: {}, why: pick.map((x) => `${x[1] ? "✓" : "✗"} ${x[0]} — ${x[2]}`).join("<br>") });
  // 7. plot a missing point (temperature panel, a point on the steep part)
  const pi = pickR(r, [2, 3, 4, 5, 6, 7].filter((i) => T[i] !== T[i - 1]));
  qs.push(plotQ(F, G, 0, 0, pi, "temperature"));
  return qs;
}

function questions(F, r) { return F.variant === "light" ? lightQuestions(F, r) : columnQuestions(F, r); }

function selfTest(F, qs) {
  const bad = [];
  if (F.variant === "column") {
    if (F.temp.some((v, i) => i && v > F.temp[i - 1] + 1e-9)) bad.push("temperature rises with depth");
    if (F.temp.some((v) => v < 0 || v > 30) || F.other.some((v) => v < 0 || v > QTY[F.second].max)) bad.push("off the axis");
    if (F.second === "oxy" && F.other.some((v, i) => i && v > F.other[i - 1] + 1e-9)) bad.push("oxygen rises with depth");
  } else {
    if (F.series.some((S) => S.some((v, i) => i && v > S[i - 1]))) bad.push("light rises with depth");
    if (F.series[F.clearSite][2] <= F.series[1 - F.clearSite][2]) bad.push("clear site not brighter");
  }
  for (const q of qs) if (q.kind === "choice") { const len = q.options.map((o) => o.length); if (len[q.a] > Math.max(...len.filter((_, i) => i !== q.a))) bad.push("correct option is the longest: " + q.q.slice(0, 40)); }
  return bad;
}

export default {
  key: KEY, group: "Graphs and charts", name: "Depth profiles", topics: "Unit 2 (2.5) and Unit 5 (5.3)", thumbSeed: 12,
  blurb: "How light, temperature, dissolved oxygen and pressure change as you go deeper into the ocean.",
  tips: ["Depth is on the <b>vertical</b> axis and increases <b>downwards</b>: 0 m is at the top.", "To read a value, go down to the depth, across to the line, then up to the axis at the top.", "Zones: sunlight 0–200 m, twilight 200–1000 m, midnight below 1000 m.", "Light and temperature fall with depth; pressure rises steadily; dissolved oxygen is highest near the surface."],
  ctx: (F) => (F.variant === "light" ? `light measurements at ${F.place}` : `measurements from ${F.place}`),
  make, svg, axes, questions, selfTest,
  css: `.fig-depth .dpdash{stroke-dasharray:7 5}.fig-depth .dpsq{fill:var(--surface2);stroke:currentColor;stroke-width:1.5}.fig-depth .dpaxis{font-size:13px;font-weight:600}.fig-depth .dparrow{stroke:currentColor;stroke-width:1.6;fill:none}.fig-depth .dpcons{stroke:var(--app);stroke-width:1.6;stroke-dasharray:4 3}.fig-depth .dpcross line{stroke:var(--accent);stroke-width:3}.fig-depth .dpzone{stroke:var(--app);stroke-width:1.8;stroke-dasharray:8 4}.fig-depth .dpzt{font-size:13px;fill:var(--app);font-weight:700;paint-order:stroke;stroke:var(--surface2);stroke-width:4px;stroke-linejoin:round}`,
};
