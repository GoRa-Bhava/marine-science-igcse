/* ---------- MARINE BAR CHART (simple or grouped, hatching key) ----------
   0697: draw/interpret bar charts (bars of equal width that do not touch, for categorical or discrete data);
   percentage change; mean; compare the change of two series; limitations of conclusions from data.
   Contexts: 6.6 plastic garbage patches, 6.4 aquaculture vs capture, 3.6/6.9 turtle nesting beaches,
   6.3 fishing methods (syllabus list), 5.7 reef sites, 6.6 beach clean-ups. All data generated. */
import { rng, pickR, shuffleR, fmt, round1, pickMixed } from "../core.js";

const KEY = "mbar";
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const GROUPED = [
  { id: "plastic", title: "mean mass concentration of plastic inside and outside an ocean garbage patch", cats: ["2000", "2004", "2008", "2012", "2016", "2020"], catWord: "survey year", catIn: (c) => c,
    xlab: "survey year", ylab: "mean mass concentration of plastic / kg per km²", series: ["inside the garbage patch", "surrounding water"], short: ["inside", "outside"], unit: "kg per km²", ps: [5, 10, 20],
    shapes: [["rise"], ["rise"]], rg: [[10, 38], [3, 16]], compare: "more", limit: "These are means, so they hide how much the samples varied." },
  { id: "aqua", title: "fish production from capture fisheries and aquaculture in a region", cats: ["1990", "1995", "2000", "2005", "2010", "2015"], catWord: "year", catIn: (c) => c,
    xlab: "year", ylab: "fish production / million tonnes", series: ["capture fisheries", "aquaculture"], unit: "million tonnes", ps: [1, 2],
    shapes: [["fall"], ["rise"]], rg: [[14, 38], [3, 36]], compare: "dir", limit: "The data are from one region, so may not apply elsewhere." },
  { id: "nests", title: "turtle nests counted on two beaches", cats: ["2015", "2016", "2017", "2018", "2019", "2020"], catWord: "year", catIn: (c) => c,
    xlab: "year", ylab: "number of turtle nests", series: ["Beach A (protected)", "Beach B (tourist resort)"], unit: "nests", ps: [1, 2],
    shapes: [["rise"], ["fall"]], rg: [[8, 38], [4, 30]], compare: "dir", limit: "Only two beaches were compared, so other causes are possible." },
];
const SIMPLE = [
  { id: "cleanup", title: "plastic collected in beach clean-ups at one beach", cats: ["2017", "2018", "2019", "2020", "2021", "2022"], catWord: "year", catIn: (c) => c,
    xlab: "year", ylab: "mass of plastic collected / kg", unit: "kg", ps: [5, 10], shapes: ["rise", "risefall", "fallrise"], limit: "Only one beach was cleaned, so other beaches may differ." },
];
const CAT = [
  { id: "methods", title: "catch landed at one port by six fishing methods", cats: ["pelagic trawling", "beam trawling", "purse seine", "gill nets", "longlining", "pole and line"], catWord: "fishing method", catIn: (c) => c, prep: "for",
    xlab: "fishing method", ylab: "catch / tonnes", unit: "tonnes", ps: [10, 20, 50], limit: "The catch is from one port, so it may not represent others." },
  { id: "reef", title: "fish species recorded at six reef sites", cats: ["Site A", "Site B", "Site C", "Site D", "Site E", "Site F"], catWord: "site", catIn: (c) => c, prep: "at",
    xlab: "reef site", ylab: "number of fish species", unit: "species", ps: [1], limit: "Only six sites were surveyed, so the reef may differ elsewhere." },
];
const BADLIM = ["Bar charts cannot be used to compare values from different years or places.", "The bars should touch, because the categories follow on from each other.", "The measured variable should be on the x-axis, not on the y-axis."];

function steps(r, total, k) { const w = Array.from({ length: k }, () => 0.4 + r()), sw = w.reduce((a, b) => a + b, 0); const s = w.map((x) => 1 + Math.floor((total - k) * x / sw)); let rem = total - s.reduce((a, b) => a + b, 0); while (rem-- > 0) s[Math.floor(r() * k)]++; return s; }
function series(r, shape, n, lo, hi) {
  const up = (a, b, k) => { if (b - a < k) b = a + k; const o = [a]; steps(r, b - a, k).forEach((d) => o.push(o[o.length - 1] + d)); return o; };
  if (shape === "rise" || shape === "fall") { const a = lo + Math.floor(r() * 4), b = hi - Math.floor(r() * 4), v = up(a, b, n - 1); return shape === "rise" ? v : v.reverse(); }
  const p = 2 + Math.floor(r() * 2), top = hi - Math.floor(r() * 4), s0 = lo + Math.floor(r() * 6), e0 = lo + 2 + Math.floor(r() * 8);
  const v = up(s0, top, p).concat(up(e0, top, n - 1 - p).reverse().slice(1));
  return shape === "risefall" ? v : v.map((x) => lo + hi - x);
}
function make(seed) {
  const r0 = rng(seed), roll = r0();
  for (let tries = 0; tries < 400; tries++) {
    const r = rng(seed + tries * 6151 + 3);
    if (roll < 0.5) {
      const C = GROUPED[Math.floor(r0() * 997 + tries) % GROUPED.length], sh = [pickR(r, C.shapes[0]), pickR(r, C.shapes[1])];
      const a = series(r, sh[0], 6, C.rg[0][0], C.rg[0][1]), b = series(r, sh[1], 6, C.rg[1][0], C.rg[1][1]);
      if ([...a, ...b].some((x) => x < 2 || x > 39)) continue;
      if (a.some((x, i) => Math.abs(x - b[i]) < 1)) continue;
      const ca = a[5] - a[0], cb = b[5] - b[0];
      if (C.compare === "more" && Math.abs(ca - cb) < 3) continue;
      const d = a.map((x, i) => Math.abs(x - b[i])), sd = d.slice().sort((p, q) => q - p); if (sd[0] - sd[1] < 1) continue;
      const ps = pickR(r, C.ps);
      return { kind: "grouped", C, sh, ps, ns: 2, cats: C.cats, v: [a.map((x) => x * ps), b.map((x) => x * ps)], sq: [a, b] };
    }
    if (roll < 0.7) {
      const C = SIMPLE[0], shape = pickR(r, C.shapes), sq = series(r, shape, 6, 4, 38);
      if (sq.some((x) => x < 2 || x > 39) || new Set(sq).size < 6) continue;
      const m = sq.indexOf(Math.max(...sq)); if (shape === "risefall" && (m === 0 || m === 5)) continue;
      const mn = sq.indexOf(Math.min(...sq)); if (shape === "fallrise" && (mn === 0 || mn === 5)) continue;
      const ps = pickR(r, C.ps);
      return { kind: "simple", C, sh: [shape], ps, ns: 1, cats: C.cats, v: [sq.map((x) => x * ps)], sq: [sq] };
    }
    const C = CAT[Math.floor(r0() * 991 + tries) % CAT.length], sq = shuffleR(r, Array.from({ length: 34 }, (_, i) => i + 4)).slice(0, 6);
    if (sq.some((x, i) => sq.some((y, j) => i !== j && Math.abs(x - y) < 2))) continue;
    const ps = pickR(r, C.ps);
    return { kind: "cat", C, sh: null, ps, ns: 1, cats: C.cats, v: [sq.map((x) => x * ps)], sq: [sq] };
  }
  return make(seed + 1);
}
const geo = (F) => { const W = 560, L = 66, R = 14, T = F.ns === 2 ? 62 : 30, ph = 340, B = F.kind === "cat" && F.C.id === "methods" ? 92 : 66, pw = W - L - R, n = F.cats.length, cw = pw / n, sq = ph / 40;
  const bw = F.ns === 2 ? cw * 0.33 : cw * 0.5, gap = cw * 0.05;
  const bx = (c, s) => (F.ns === 2 ? L + cw * c + (cw - 2 * bw - gap) / 2 + s * (bw + gap) : L + cw * c + (cw - bw) / 2);
  return { W, L, T, ph, B, pw, n, cw, sq, bw, bx, H: T + ph + B, yv: (v) => T + ph - (v / F.ps) * sq }; };
/* axes for the reading guide: value (y) axis only — the category axis has no numeric ticks. */
function axes(F) {
  const G = geo(F), { L, T, ph, pw, sq } = G;
  const yt = []; for (let i = 0; i <= 40; i++) yt.push({ at: T + ph - i * sq, label: i % 5 === 0 ? String(i * F.ps) : undefined });
  return [{ plot: { x0: L, x1: L + pw, y0: T, y1: T + ph }, x: { ticks: [] }, y: { ticks: yt } }];
}
function wrapLab(t, x, y) { const w = t.split(" "); if (t.length <= 10 || w.length === 1) return `<text x="${x}" y="${y}" text-anchor="middle" class="mbcat">${t}</text>`;
  const mid = Math.ceil(w.length / 2); return `<text x="${x}" y="${y}" text-anchor="middle" class="mbcat"><tspan x="${x}">${w.slice(0, mid).join(" ")}</tspan><tspan x="${x}" dy="15">${w.slice(mid).join(" ")}</tspan></text>`; }
function svg(F, opt) {
  opt = opt || {}; const G = geo(F), { W, L, T, ph, pw, n, cw, sq, bw, bx, H, yv } = G, hl = (opt.hl && opt.hl.bars) || [];
  let s = `<defs><pattern id="mbar-h0" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" class="mbpbg"/><line x1="0" y1="0" x2="0" y2="7" stroke="currentColor" stroke-width="2.4"/></pattern></defs>`;
  const cols = Math.round(pw / sq);
  for (let i = 0; i <= 40; i++) s += `<line x1="${L}" x2="${L + pw}" y1="${T + i * sq}" y2="${T + i * sq}" class="${i % 5 ? "gmin" : "gmaj"}"/>`;
  for (let i = 0; i <= cols; i++) { const x = L + i * pw / cols; s += `<line x1="${x}" x2="${x}" y1="${T}" y2="${T + ph}" class="${i % 5 ? "gmin" : "gmaj"}"/>`; }
  for (let i = 0; i <= 40; i += 5) s += `<text x="${L - 8}" y="${T + ph - i * sq + 5}" text-anchor="end">${i * F.ps}</text>`;
  const cls = (si) => (F.ns === 2 ? `mbs${si}` : "fbar");
  for (let si = 0; si < F.ns; si++) F.v[si].forEach((v, c) => {
    const id = `${c}-${si}`; if (opt.hide === id) return; const y = yv(v);
    s += `<rect x="${bx(c, si)}" y="${y}" width="${bw}" height="${T + ph - y}" class="${cls(si)}${hl.includes(id) ? " hl" : ""}"${opt.tapMode ? ` data-tap="${id}"` : ""}/>`;
  });
  if (opt.state && opt.plotSeries != null && opt.state.c != null) { const st = opt.state, y = yv(st.v); s += `<rect x="${bx(st.c, opt.plotSeries)}" y="${y}" width="${bw}" height="${T + ph - y}" class="${cls(opt.plotSeries)} mbstu"/>`; }
  F.cats.forEach((c, i) => (s += wrapLab(c, L + cw * (i + 0.5), T + ph + 20)));
  s += `<line x1="${L}" x2="${L + pw}" y1="${T + ph}" y2="${T + ph}" class="axis"/><line x1="${L}" x2="${L}" y1="${T}" y2="${T + ph}" class="axis"/>`;
  s += `<text x="${L + pw / 2}" y="${H - 10}" text-anchor="middle">${F.C.xlab}</text><text transform="translate(16 ${T + ph / 2}) rotate(-90)" text-anchor="middle">${F.C.ylab}</text>`;
  if (F.ns === 2) s += `<g><rect x="${L}" y="14" width="20" height="14" class="mbs0"/><text x="${L + 27}" y="26">${F.C.series[0]}</text><rect x="${L + 250}" y="14" width="20" height="14" class="mbs1"/><text x="${L + 277}" y="26">${F.C.series[1]}</text></g>`;
  if (opt.plotMode) s += `<rect x="${L}" y="${T}" width="${pw}" height="${ph}" fill="transparent" class="plothit"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="figsvg fig-${KEY}" role="img" aria-label="Bar chart of ${F.C.title}">${s}</svg>`;
}
function questions(F, r) {
  const qs = [], C = F.C, n = F.cats.length, ps = F.ps, u = C.unit ? " " + C.unit : "", V = F.v, S = F.sq, Gg = geo(F);
  const M = (si) => (F.ns === 2 ? `${C.ylab.replace(/ \/.*$/, "")} for the ${C.series[si]}` : C.ylab.replace(/ \/.*$/, ""));
  const cin = (c) => C.catIn(F.cats[c]), pin = (c) => `${C.prep || "in"} ${C.catIn(F.cats[c])}`, val = (si, c) => `${V[si][c]}${u}`, argmax = (a) => a.indexOf(Math.max(...a));
  const ser = (si) => (F.ns === 2 ? `<b>${C.series[si]}</b> ` : "");
  // 1. read a bar
  const rs = Math.floor(r() * F.ns), rc = pickR(r, [...Array(n).keys()].filter((c) => c !== argmax(V[rs])));
  qs.push({ kind: "num", q: `What was the ${M(rs)} ${pin(rc)}?`, ans: V[rs][rc], tol: ps / 2, unit: C.unit, hl: { bars: [`${rc}-${rs}`], guide: { x: Gg.bx(rc, rs) + Gg.bw / 2, y: Gg.yv(V[rs][rc]) } },
    why: `Go to the top of the ${F.ns === 2 ? `${ser(rs)}bar (check the key) ` : "bar "}for ${cin(rc)} and read across to the vertical axis: <b>${val(rs, rc)}</b>. Each small square is ${ps}${u}; readings are accepted to within half a small square.` });
  // 2. tap the highest bar of one series
  const ts = Math.floor(r() * F.ns), tc = argmax(V[ts]);
  qs.push({ kind: "tap", q: `Tap the ${F.ns === 2 ? ser(ts) : ""}bar that shows the highest ${C.ylab.replace(/ \/.*$/, "")}.`, a: [`${tc}-${ts}`], askOpt: { tapMode: true }, hl: { bars: [`${tc}-${ts}`] },
    labelOf: (id) => { const [c, si] = id.split("-").map(Number); return F.ns === 2 ? `${C.series[si]}, ${cin(c)}` : cin(c); }, ansTxt: `${F.ns === 2 ? C.series[ts] + ", " : ""}${cin(tc)}`,
    why: `The tallest ${F.ns === 2 ? `${ser(ts)}bar (use the shading in the key)` : "bar"} is ${cin(tc)}, at ${val(ts, tc)}.${F.ns === 2 ? " Compare only bars with the same shading." : ""}` });
  // 3. compare the change (grouped) / trend (simple) / difference (categorical)
  if (F.kind === "grouped") {
    const ca = V[0][n - 1] - V[0][0], cb = V[1][n - 1] - V[1][0], A0 = C.series[0], A1 = C.series[1];
    let opts, why;
    if (C.compare === "more") {
      const aMore = ca > cb;
      opts = [`It increased more ${aMore ? "inside the garbage patch" : "in the surrounding water"} than ${aMore ? "in the surrounding water" : "inside the garbage patch"}.`, `It increased more ${aMore ? "in the surrounding water" : "inside the garbage patch"} than ${aMore ? "inside the garbage patch" : "in the surrounding water"}.`,
        "It increased by about the same amount in both areas.", "It increased inside the garbage patch but decreased in the surrounding water."];
      why = `Work out each change from ${cin(0)} to ${cin(n - 1)}. Inside: ${V[0][0]} → ${V[0][n - 1]}, an increase of ${ca}${u}. Surrounding water: ${V[1][0]} → ${V[1][n - 1]}, an increase of ${cb}${u}. Both increased, but the increase was larger ${aMore ? "inside the patch" : "in the surrounding water"}. A comparison must say which changed more, with data.`;
    } else {
      const w = (sh) => (sh === "rise" ? "increased" : "decreased"), all = [["rise", "rise"], ["fall", "fall"], ["rise", "fall"], ["fall", "rise"]];
      const txt = (p) => (p[0] === p[1] ? `Both ${w(p[0])} from ${cin(0)} to ${cin(n - 1)}.` : `${cap(A0)} ${w(p[0])} while ${A1} ${w(p[1])}.`);
      const right = all.find((p) => p[0] === F.sh[0] && p[1] === F.sh[1]);
      opts = [txt(right), ...all.filter((p) => p !== right).map(txt)];
      why = `${cap(A0)}: ${V[0][0]} ${pin(0)} → ${V[0][n - 1]} ${pin(n - 1)} (${w(F.sh[0])} by ${Math.abs(ca)}${u}). ${cap(A1)}: ${V[1][0]} → ${V[1][n - 1]} (${w(F.sh[1])} by ${Math.abs(cb)}${u}). Use the key to tell the two sets of bars apart.`;
    }
    qs.push({ kind: "choice", q: `Which statement best compares the change in the two sets of bars from ${cin(0)} to ${cin(n - 1)}?`, options: opts, a: 0, hl: { bars: [`0-0`, `${n - 1}-0`, `0-1`, `${n - 1}-1`] }, why });
  } else if (F.kind === "simple") {
    const T = { rise: "An overall increase", fall: "An overall decrease", risefall: "An increase, then a decrease", fallrise: "A decrease, then an increase" }, sh = F.sh[0];
    qs.push({ kind: "choice", q: `Which phrase best describes the trend in the ${M(0)} from ${cin(0)} to ${cin(n - 1)}?`, options: [T[sh], ...["rise", "fall", "risefall", "fallrise"].filter((x) => x !== sh).map((x) => T[x])], a: 0,
      why: `Look at all six bars, not just the first and last. ${sh === "rise" ? "Each bar is taller than the one before." : sh === "risefall" ? `The bars rise to a peak ${pin(argmax(V[0]))}, then fall.` : `The bars fall to a low ${pin(V[0].indexOf(Math.min(...V[0])))}, then rise.`} Quote values with units when you describe a trend.` });
  } else {
    const pairs = []; for (let a = 0; a < n; a++) for (let b = 0; b < n; b++) if (a !== b && S[0][a] - S[0][b] >= 4) pairs.push([a, b]);
    const [a, b] = pickR(r, pairs), d = V[0][a] - V[0][b];
    qs.push({ kind: "num", q: `How much greater was the ${M(0)} for ${cin(a)} than for ${cin(b)}?`, ans: d, tol: ps, unit: C.unit, hl: { bars: [`${a}-0`, `${b}-0`] },
      why: `Read both bars, then subtract: ${cin(a)} ${val(0, a)} − ${cin(b)} ${val(0, b)} = <b>${d}${u}</b>. Accepted to within one small square, because two readings are involved.` });
  }
  // 4. percentage change (time series, values given) or mean (categorical)
  if (F.kind !== "cat") {
    const cs = Math.floor(r() * F.ns), pairs = [];
    for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) { const va = V[cs][a], vb = V[cs][b], pc = Math.abs(vb - va) / va * 100, f = pc - Math.floor(pc);
      if (Math.abs(S[cs][b] - S[cs][a]) >= 4 && Math.abs(f - 0.5) > 0.08) pairs.push([a, b]); }
    const [a, b] = pickR(r, pairs), va = V[cs][a], vb = V[cs][b], inc = vb > va, pc = Math.round(Math.abs(vb - va) / va * 100), wrong = Math.round(Math.abs(vb - va) / vb * 100);
    qs.push({ kind: "num", q: `The ${M(cs)} was ${va}${u} ${pin(a)} and ${vb}${u} ${pin(b)}. Calculate the percentage ${inc ? "increase" : "decrease"}. Give your answer to the nearest whole number.`,
      ans: pc, tol: 0, unit: "%", check: (x) => Math.abs(x - pc) < 1e-9, hl: { bars: [`${a}-${cs}`, `${b}-${cs}`] },
      why: `Percentage change = change ÷ original value × 100. Change = ${Math.abs(vb - va)}${u}. ${Math.abs(vb - va)} ÷ ${va} × 100 = ${fmt(Math.round(Math.abs(vb - va) / va * 1000) / 10)} → <b>${pc}%</b>. Always divide by the <b>original</b> (${cin(a)}) value${wrong !== pc ? `; dividing by the later value gives ${wrong}%, which is wrong` : ""}.` });
  } else {
    const tot = V[0].reduce((p, q) => p + q, 0), mean = tot / n, m1 = round1(mean);
    qs.push({ kind: "num", q: `Use the bar chart to calculate the mean ${M(0)} for the six ${C.catWord === "site" ? "sites" : "fishing methods"}. Give your answer to 1 decimal place.`, ans: m1, tol: Math.max(ps / 2, 0.05), unit: C.unit, dp: 1, hl: { bars: V[0].map((_, i) => `${i}-0`) },
      why: `Mean = total ÷ number of values. ${V[0].join(" + ")} = ${tot}${u}. ${tot} ÷ ${n} = <b>${m1.toFixed(1)}${u}</b>. ${ps > 0.5 ? `Accepted to within half a small square (±${fmt(ps / 2)}${u}), because each bar is read from the chart.` : ""}` });
  }
  // 5. tick the statements the chart supports
  const st = [], pair = (si) => { for (let k = 0; k < 30; k++) { const a = Math.floor(r() * n), b = Math.floor(r() * n); if (a !== b && Math.abs(S[si][a] - S[si][b]) >= 2) return [a, b]; } return null; };
  for (let k = 0; k < 2; k++) { const si = Math.floor(r() * F.ns), p = pair(si); if (p) { const [a, b] = p; st.push([`The ${M(si)} was higher ${pin(a)} than ${pin(b)}.`, V[si][a] > V[si][b], `${cin(a)}: ${val(si, a)}; ${cin(b)}: ${val(si, b)}.`]); } }
  for (let k = 0; k < 20; k++) { const si = Math.floor(r() * F.ns), a = Math.floor(r() * n), b = Math.floor(r() * n); if (a === b) continue; const ra = V[si][b] / V[si][a]; if (Math.abs(ra - 2) < 0.2) continue;
    st.push([`The ${M(si)} ${pin(b)} was more than double the value ${pin(a)}.`, ra > 2, `${val(si, b)} compared with ${val(si, a)}; double ${V[si][a]} is ${2 * V[si][a]}.`]); break; }
  if (F.ns === 2) { const higher = V[0].every((x, i) => x > V[1][i]); st.push([`The ${C.series[0]} bar is taller than the ${C.series[1]} bar in every ${C.catWord}.`, higher, higher ? "The hatched bar is taller in every group." : "In at least one group the plain bar is taller."]); }
  if (F.kind === "cat") { const srt = V[0].slice().sort((p, q) => q - p), tot = srt.reduce((p, q) => p + q, 0), top2 = srt[0] + srt[1]; if (Math.abs(top2 - tot / 2) >= 2 * ps) st.push([`The two highest bars together make up more than half of the total.`, top2 > tot / 2, `Top two: ${top2}${u}; total: ${tot}${u}; half: ${tot / 2}${u}.`]); }
  for (const want of [true, false]) if (!st.some((x) => x[1] === want)) { const si = Math.floor(r() * F.ns), p = pair(si); if (p) { let [a, b] = p; if ((V[si][a] > V[si][b]) !== want) [a, b] = [b, a];
    st.push([`The ${M(si)} was higher ${pin(a)} than ${pin(b)}.`, want, `${cin(a)}: ${val(si, a)}; ${cin(b)}: ${val(si, b)}.`]); } }
  const uniq = st.filter((x, i) => st.findIndex((y) => y[0] === x[0]) === i), pick = pickMixed(r, uniq, Math.min(4, uniq.length));
  if (pick) qs.push({ kind: "multi", q: "Tick every statement the bar chart supports.", options: pick.map((x) => x[0]), a: pick.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0), hl: {}, why: pick.map((x) => `${x[1] ? "✓" : "✗"} ${x[0]}: ${x[2]}`).join("<br>") });
  // 6. limitations of a conclusion drawn from the chart (tick every valid one)
  const goodLim = [C.limit, "The chart does not show how many samples each bar is based on."];
  const badLim = shuffleR(r, BADLIM.concat(["The y-axis does not start at zero, so the bars cannot be compared fairly."])).slice(0, 3);
  const limOpts = shuffleR(r, goodLim.map((t) => [t, true]).concat(badLim.map((t) => [t, false])));
  qs.push({ kind: "multi", q: `A student uses this bar chart to draw a conclusion about ${C.title.replace(/^(mean |the )/, "")}. Tick <b>every</b> valid limitation of the data.`, options: limOpts.map((x) => x[0]), a: limOpts.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0), hl: {},
    why: `Valid: ${goodLim.join(" ")} Not valid: bar charts are a correct way to compare years or categories; bars for categories or discrete data should <b>not</b> touch (only histograms for continuous data have touching bars); the measured (dependent) variable goes on the y-axis; and this y-axis does start at zero.` });
  // 7. plot the missing bar (last)
  const cand = []; for (let si = 0; si < F.ns; si++) for (let c = 0; c < n; c++) if (c !== argmax(V[si]) && S[si][c] >= 2) cand.push([c, si]);
  const [hc, hs] = pickR(r, cand), hid = `${hc}-${hs}`, ans = V[hs][hc], top = 40 * ps, h = ps / 2;
  qs.push({ kind: "plot", q: `The ${F.ns === 2 ? ser(hs) : ""}bar for ${cin(hc)} is missing. Its value was <b>${ans}${u}</b>. Tap the chart to draw it in the right place, at the right height.`, hl: { bars: [hid] },
    askOpt: { hide: hid, plotMode: true, plotSeries: hs },
    plot: {
      start: { c: 0, v: 0 }, answer: { c: hc, v: ans }, hint: "Tap the chart to draw the bar.",
      fromTap: (p) => { const G = geo(F); return { c: Math.max(0, Math.min(n - 1, Math.floor((p.x - G.L) / G.cw))), v: Math.max(0, Math.min(top, Math.round((G.T + G.ph - p.y) / G.sq * 2) / 2 * ps)) }; },
      nudges: [["c-", "◀", "Move the bar one place left"], ["v-", "▼", "Lower the bar by half a square"], ["v+", "▲", "Raise the bar by half a square"], ["c+", "▶", "Move the bar one place right"]],
      nudge: (s, k) => ({ c: k === "c-" ? Math.max(0, s.c - 1) : k === "c+" ? Math.min(n - 1, s.c + 1) : s.c, v: round1(k === "v-" ? Math.max(0, s.v - h) : k === "v+" ? Math.min(top, s.v + h) : s.v) }),
      label: (s) => `Your bar: ${cin(s.c)}, ${fmt(s.v)}${u}.`,
      check: (s) => s.c === hc && Math.abs(s.v - ans) <= h + 1e-9,
    },
    doneOpt: (s, ok) => ({ hide: ok ? hid : null, state: s, plotSeries: hs, hl: { bars: ok ? [] : [hid] } }),
    doneNote: (s, ok) => (ok ? "" : `Highlighted: the correct bar, ${cin(hc)} at ${ans}${u}. Your bar has the orange outline.`),
    why: `Find ${cin(hc)}${F.ns === 2 ? ` and use the ${C.series[hs]} position and shading from the key` : ""}. Each small square is ${ps}${u}, so ${ans}${u} is ${ans / ps} small squares up. Bars are the same width as the others, do not touch, and are marked to within half a small square.` });
  return qs;
}
function selfTest(F, qs) {
  const bad = [];
  F.v.forEach((a, si) => { if (Math.max(...a) > 40 * F.ps) bad.push("bar above axis"); if (a.filter((x) => x === Math.max(...a)).length > 1) bad.push("tied max " + si); if (a.some((x) => x % F.ps)) bad.push("off grid"); });
  if (F.kind === "grouped") F.sh.forEach((sh, si) => { const a = F.v[si]; if (!a.every((x, i) => !i || (sh === "rise" ? x > a[i - 1] : x < a[i - 1]))) bad.push("grouped shape " + si); });
  const t = qs.find((q) => q.kind === "tap"); const [c, si] = t.a[0].split("-").map(Number); if (F.v[si][c] !== Math.max(...F.v[si])) bad.push("tap not max");
  const cmp = qs.find((q) => q.kind === "choice" && /compares the change/.test(q.q));
  if (cmp && F.C.compare === "more") { const ca = F.v[0][5] - F.v[0][0], cb = F.v[1][5] - F.v[1][0]; if ((ca > cb) !== /more inside/.test(cmp.options[0])) bad.push("compare wrong"); }
  return bad;
}

export default {
  key: KEY, group: "Graphs and charts", name: "Bar chart", topics: "Units 3, 5 and 6 (3.6, 5.7, 6.3, 6.4, 6.6, 6.9)", thumbSeed: 4,
  blurb: "Simple and grouped bar charts, such as plastic inside and outside a garbage patch. Read, compare, calculate and draw a missing bar.",
  tips: ["Read from the <b>top</b> of the bar straight across to the axis. Work out what one small square is worth first.", "In a grouped chart, use the key: compare only bars with the same shading.", "\"Compare the change\": work out how much each series changed, then say which changed more, with data.", "Percentage change = change ÷ <b>original</b> value × 100. Mean = total ÷ number of values.", "Bar charts have bars of equal width that do not touch."],
  ctx: (F) => F.C.title, make, svg, axes, questions, selfTest,
  css: `.fig-mbar .mbs0{fill:url(#mbar-h0);stroke:currentColor;stroke-width:1}.fig-mbar .mbs1{fill:color-mix(in srgb,var(--ink) 20%,transparent);stroke:currentColor;stroke-width:1}.fig-mbar .mbpbg{fill:var(--surface2)}
.fig-mbar .hl{fill:color-mix(in srgb,var(--app) 75%,transparent)}.fig-mbar .mbstu{stroke:var(--accent);stroke-width:3}.fig-mbar .mbcat{font-size:14px}`,
};
