/* ---------- ROCKY-SHORE PROFILE + PERCENTAGE COVER (0697 5.2/LO2–3 investigating; 5.4 rocky shores) ----------
   Two linked graphs share the x-axis "distance up the shore from low tide / m":
   top    — the shore profile (height above low tide), measured section by section between ranging poles
            with a clinometer (5.2/LO3; drawn point to point — no trigonometry is ever asked);
   bottom — percentage cover of one organism in quadrats placed every 4 m along the tape (a belt transect, 5.2/LO2).
   Organisms and reasons follow the knowledge model 5.4/LO3–4: Fucus is limited up-shore by drying (exposure to air);
   mussels are limited down-shore by predators (starfish, given) when the tide covers them; limpets survive exposure by
   clamping their shells to the rock. Zone sub-names (upper/middle/lower) are not used (not required by 5.4/LO1).
   Tolerances: height ±0.1 m, cover ±2.5 % (½ small square); the cross-read adds the error carried from reading
   the distance off the profile. */
import { rng, pickR, shuffleR, fmt, round1, gridLines } from "../core.js";

const KEY = "shore", DX = 40, QI = 4;           // transect 0–40 m, quadrats every 4 m
const ORGS = {
  fucus: { name: "a brown seaweed (Fucus)", short: "Fucus", peak: [5, 8] },
  mussel: { name: "mussels", short: "mussels", peak: [1, 3] },
  limpet: { name: "limpets", short: "limpets", peak: [3, 7] },
};
const PLACES = ["a rocky shore on an exposed headland", "a rocky shore in a sheltered bay", "a rocky shore beside a harbour"];

function make(seed) {
  for (let tries = 0; ; tries++) {
    const r = rng(seed + tries * 7919);
    // profile: vertices at multiples of 4 m, heights multiples of 0.2 m, rising up the shore
    const cuts = [0, ...shuffleR(r, [8, 12, 16, 20, 24, 28, 32]).slice(0, 3 + Math.floor(r() * 2)).sort((a, b) => a - b), 40];
    const Hmax = r() < 0.5 ? 4 : 5;
    const grads = cuts.slice(1).map(() => 0.02 + r() * 0.2);
    const total = cuts.slice(1).reduce((s, x, i) => s + grads[i] * (x - cuts[i]), 0), target = Hmax - 0.4 - Math.floor(r() * 3) * 0.2;
    const hv = [0]; for (let i = 1; i < cuts.length; i++) hv.push(Math.round((hv[i - 1] + grads[i - 1] * (cuts[i] - cuts[i - 1]) * target / total) * 5) / 5);
    hv[hv.length - 1] = round1(Math.round(target * 5) / 5);
    hv.forEach((h, i) => (hv[i] = Math.round(h * 5) / 5));
    if (hv.some((h, i) => i && h <= hv[i - 1])) continue;
    const g = hv.slice(1).map((h, i) => (h - hv[i]) / (cuts[i + 1] - cuts[i]));
    const gs = g.slice().sort((a, b) => b - a); if (gs[0] < gs[1] * 1.3) continue;              // one clearly steepest section
    if (!cuts.slice(1, -1).some((d, j) => Math.min(g[j], g[j + 1]) >= 0.08)) continue;      // a pole where the height can be read back to a distance
    // percentage cover at quadrats 0,4,...,40
    const orgKey = pickR(r, Object.keys(ORGS)), O = ORGS[orgKey];
    const pk = O.peak[0] + Math.floor(r() * (O.peak[1] - O.peak[0] + 1)), top = 60 + 5 * Math.floor(r() * 7), wid = 1.6 + r() * 1.4;
    const cover = Array.from({ length: DX / QI + 1 }, (_, i) => Math.max(0, Math.min(100, Math.round(top * Math.exp(-((i - pk) ** 2) / (2 * wid * wid)) / 5) * 5)));
    const mx = Math.max(...cover); if (cover.filter((v) => v === mx).length > 1) continue;
    if (cover.filter((v) => v > 0).length < 4) continue;
    return { kind: KEY, seed, place: pickR(r, PLACES), Hmax, cuts, hv, g, orgKey, cover, pk: cover.indexOf(mx) };
  }
}
const hAt = (F, d) => { for (let i = 1; i < F.cuts.length; i++) if (d <= F.cuts[i] + 1e-9) return F.hv[i - 1] + (F.hv[i] - F.hv[i - 1]) * (d - F.cuts[i - 1]) / (F.cuts[i] - F.cuts[i - 1]); return F.hv[F.hv.length - 1]; };

function geo(F) {
  const W = 560, L = 62, R = 18, pw = W - L - R, rowsH = F.Hmax * 5, sqH = 8;
  const T1 = 30, ph1 = rowsH * sqH, T2 = T1 + ph1 + 62, ph2 = 20 * 8;
  return { W, H: T2 + ph2 + 52, L, pw, T1, ph1, T2, ph2, rowsH };
}
const X = (G, d) => G.L + d / DX * G.pw, Y1 = (G, F, h) => G.T1 + G.ph1 - h / F.Hmax * G.ph1, Y2 = (G, c) => G.T2 + G.ph2 - c / 100 * G.ph2;

/* axes for the reading guide: two stacked panels (height, then percentage cover) sharing the distance axis. */
function axes(F) {
  const G = geo(F), xt = [];
  for (let i = 0; i <= DX; i++) xt.push({ at: X(G, i), label: i % 5 === 0 ? String(i) : undefined });
  const yTop = []; for (let k = 0; k <= G.rowsH; k++) { const h = k * 0.2; yTop.push({ at: Y1(G, F, h), label: k % 5 === 0 ? fmt(h, 1) : undefined }); }
  const yBot = []; for (let i = 0; i <= 20; i++) { const c = i * 5; yBot.push({ at: Y2(G, c), label: i % 4 === 0 ? String(c) : undefined }); }
  return [
    { plot: { x0: G.L, x1: G.L + G.pw, y0: G.T1, y1: G.T1 + G.ph1 }, x: { ticks: xt }, y: { ticks: yTop } },
    { plot: { x0: G.L, x1: G.L + G.pw, y0: G.T2, y1: G.T2 + G.ph2 }, x: { ticks: xt }, y: { ticks: yBot } },
  ];
}

function svg(F, opt) {
  opt = opt || {}; const G = geo(F), hl = opt.hl || {}, O = ORGS[F.orgKey];
  let s = gridLines(G.L, G.T1, G.pw, G.ph1, 40, G.rowsH, 5, 5) + gridLines(G.L, G.T2, G.pw, G.ph2, 40, 20, 5, 2);
  for (const [T, ph] of [[G.T1, G.ph1], [G.T2, G.ph2]]) {
    s += `<line x1="${G.L}" x2="${G.L + G.pw}" y1="${T + ph}" y2="${T + ph}" class="axis"/><line x1="${G.L}" x2="${G.L}" y1="${T}" y2="${T + ph}" class="axis"/>`;
    for (let d = 0; d <= DX; d += 5) s += `<text x="${X(G, d)}" y="${T + ph + 17}" text-anchor="middle">${d}</text>`;
  }
  for (let h = 0; h <= F.Hmax; h++) s += `<text x="${G.L - 7}" y="${Y1(G, F, h) + 5}" text-anchor="end">${fmt(h, 1)}</text>`;
  for (let c = 0; c <= 100; c += 20) s += `<text x="${G.L - 7}" y="${Y2(G, c) + 5}" text-anchor="end">${c}</text>`;
  s += `<text transform="translate(16 ${G.T1 + G.ph1 / 2}) rotate(-90)" text-anchor="middle" class="shax">height above low tide / m</text>`;
  s += `<text transform="translate(16 ${G.T2 + G.ph2 / 2}) rotate(-90)" text-anchor="middle" class="shax">percentage cover / %</text>`;
  s += `<text x="${G.L + G.pw / 2}" y="${G.T1 + G.ph1 + 36}" text-anchor="middle" class="shax">distance up the shore from low tide / m</text>`;
  s += `<text x="${G.L + G.pw / 2}" y="${G.T2 + G.ph2 + 36}" text-anchor="middle" class="shax">distance up the shore from low tide / m</text>`;
  s += `<text x="${G.L + 6}" y="${G.T1 - 10}" class="shttl">Shore profile</text><text x="${G.L + 6}" y="${G.T2 - 10}" class="shttl">Percentage cover of ${O.short}</text>`;
  // profile
  s += `<polyline points="${F.cuts.map((d, i) => `${X(G, d)},${Y1(G, F, F.hv[i])}`).join(" ")}" class="fline"/>` + F.cuts.map((d, i) => `<circle cx="${X(G, d)}" cy="${Y1(G, F, F.hv[i])}" r="3" class="fdot"/>`).join("");
  if (hl.sec != null) { const i = hl.sec; s += `<line x1="${X(G, F.cuts[i])}" x2="${X(G, F.cuts[i + 1])}" y1="${Y1(G, F, F.hv[i])}" y2="${Y1(G, F, F.hv[i + 1])}" class="shhl"/>`; }
  if (opt.tapMode) F.cuts.slice(1).forEach((d, i) => (s += `<line x1="${X(G, F.cuts[i])}" x2="${X(G, d)}" y1="${Y1(G, F, F.hv[i])}" y2="${Y1(G, F, F.hv[i + 1])}" data-tap="s${i}" stroke="transparent" stroke-width="18" stroke-linecap="round"/>`));
  // cover (break the line around a hidden point)
  const hide = opt.hideC;
  for (let i = 1; i < F.cover.length; i++) if (i !== hide && i - 1 !== hide) s += `<line x1="${X(G, (i - 1) * QI)}" x2="${X(G, i * QI)}" y1="${Y2(G, F.cover[i - 1])}" y2="${Y2(G, F.cover[i])}" class="fline"/>`;
  F.cover.forEach((c, i) => { if (i !== hide) s += `<circle cx="${X(G, i * QI)}" cy="${Y2(G, c)}" r="3" class="fdot"/>`; });
  // construction lines after Check
  if (hl.cross) { const { h, d, c } = hl.cross; const x = X(G, d);
    s += `<line x1="${G.L}" x2="${x}" y1="${Y1(G, F, h)}" y2="${Y1(G, F, h)}" class="shcons"/><line x1="${x}" x2="${x}" y1="${Y1(G, F, h)}" y2="${Y2(G, c)}" class="shcons"/><line x1="${G.L}" x2="${x}" y1="${Y2(G, c)}" y2="${Y2(G, c)}" class="shcons"/><circle cx="${x}" cy="${Y1(G, F, h)}" r="5" class="fdot hl"/><circle cx="${x}" cy="${Y2(G, c)}" r="5" class="fdot hl"/>`; }
  if (hl.markH) { const { d, h } = hl.markH, x = X(G, d), y = Y1(G, F, h); s += `<line x1="${x}" x2="${x}" y1="${G.T1 + G.ph1}" y2="${y}" class="shcons"/><line x1="${G.L}" x2="${x}" y1="${y}" y2="${y}" class="shcons"/><circle cx="${x}" cy="${y}" r="5" class="fdot hl"/>`; }
  if (hl.markC) { const { d, c } = hl.markC, x = X(G, d), y = Y2(G, c); s += `<line x1="${x}" x2="${x}" y1="${G.T2 + G.ph2}" y2="${y}" class="shcons"/><circle cx="${x}" cy="${y}" r="5" class="fdot hl"/>`; }
  if (opt.state && typeof opt.state.d === "number") { const x = X(G, opt.state.d), y = Y2(G, opt.state.c); s += `<g class="plotted shcross"><line x1="${x - 7}" x2="${x + 7}" y1="${y - 7}" y2="${y + 7}"/><line x1="${x - 7}" x2="${x + 7}" y1="${y + 7}" y2="${y - 7}"/></g>`; }
  if (opt.plotMode) s += `<rect x="${G.L}" y="${G.T2}" width="${G.pw}" height="${G.ph2}" fill="transparent" class="plothit"/>`;
  return `<svg viewBox="0 0 ${G.W} ${G.H}" class="figsvg fig-${KEY}" role="img" aria-label="Shore profile and percentage cover along a transect">${s}</svg>`;
}

const EXPLAIN = {
  fucus: { q: "Suggest why there is little Fucus near the top of the transect.", options: ["It is out of the water for longer there, so it dries out", "Too much sunlight bleaches the fronds higher up the shore", "Mussels higher up the shore graze on the seaweed fronds", "The rock there is too hard for the holdfast to grip on to"],
    why: "Higher up the shore the rock is uncovered by the tide for longer, so Fucus is <b>exposed to the air</b> for longer and dries out. Its thick, leathery fronds slow water loss, but only up to a point. Light does not bleach it, and mussels are filter feeders, not grazers." },
  mussel: { q: "Suggest why there are few mussels near the bottom of the transect.", options: ["Starfish can feed on them when the tide covers this area", "They cannot get enough oxygen when they are under water", "They dry out because this part is uncovered for longest", "The waves here are too gentle to carry enough food to them"],
    why: "The bottom of the shore is covered by the sea for most of the time, so predators such as <b>starfish</b> can reach the mussels and eat them. This part of the shore is uncovered for the <b>shortest</b> time, not the longest, and mussels take in oxygen from the water." },
  limpet: { q: "How are limpets able to survive being uncovered by the tide?", options: ["They clamp their shells to the rock to stop water loss", "They move down to the sea each time the tide goes out", "Their shells absorb water from the damp air at low tide", "They retract their tentacles to keep them moist and safe"],
    why: "When the tide goes out, a limpet pulls its shell down tightly against the rock, which seals in water and stops it drying out; the hard shell also protects it from predators. Limpets stay in place rather than following the sea, and it is sea anemones, not limpets, that retract tentacles." },
};

function questions(F, r) {
  const qs = [], G = geo(F), O = ORGS[F.orgKey], nq = F.cover.length;
  // 1. read the height at a distance (not a vertex, so it must be read off a section)
  const d1 = pickR(r, Array.from({ length: 39 }, (_, i) => i + 1).filter((d) => !F.cuts.includes(d))), h1 = hAt(F, d1);
  qs.push({ kind: "num", q: `What is the height of the shore above low tide at <b>${d1} m</b> up the shore?`, ans: Math.round(h1 * 100) / 100, tol: 0.1, unit: "m", ansTxt: `${fmt(Math.round(h1 * 100) / 100)} m`, hl: { markH: { d: d1, h: h1 } },
    why: `On the shore profile, go up from ${d1} m to the line, then across to the height axis: <b>${fmt(round1(h1), 1)} m</b> (to the nearest half square, 0.1 m). Each small square up is 0.2 m.` });
  // 2. cross-read: % cover where the shore is H m above low tide (H at a pole position = a quadrat position)
  // pick the pole (a quadrat position) where reading back from height to distance is most reliable
  const tolAt = (d) => { const vi = F.cuts.indexOf(d), ci = d / QI, gMin = Math.min(F.g[vi - 1], F.g[vi]), dd = 0.5 + 0.1 / gMin;
    const slopeC = Math.max(ci ? Math.abs(F.cover[ci] - F.cover[ci - 1]) : 0, ci < nq - 1 ? Math.abs(F.cover[ci + 1] - F.cover[ci]) : 0) / QI;
    return 2.5; };   // the height is a surveyed point (a corner of the profile), so its distance is exact: only the cover reading is marked, to ±½ small square (as in the mark scheme)
  const cand = F.cuts.slice(1, -1).filter((d, j) => Math.min(F.g[j], F.g[j + 1]) >= 0.08).sort((a, b) => (F.cover[b / QI] >= 10) - (F.cover[a / QI] >= 10) || tolAt(a) - tolAt(b) || a - b);
  const dS = cand[0], vi = F.cuts.indexOf(dS), H = F.hv[vi], ci = dS / QI, cS = F.cover[ci], tol2 = tolAt(dS);
  qs.push({ kind: "num", q: `Use <b>both</b> graphs. What was the percentage cover of ${O.short} where the shore is <b>${fmt(H, 1)} m</b> above low tide?`, ans: cS, tol: tol2, unit: "%", hl: { cross: { h: H, d: dS, c: cS } },
    why: `Top graph: find ${fmt(H, 1)} m on the height axis, go across to the profile and down to the distance axis: <b>${dS} m</b> up the shore. Bottom graph: go up from ${dS} m to the line and across: <b>${cS}%</b>. The height is at a corner of the profile, so the distance can be read exactly; the cover is accepted to within half a small square (±${fmt(tol2)}%).` });
  // 3. tap the steepest section
  const steep = F.g.indexOf(Math.max(...F.g));
  qs.push({ kind: "tap", q: "Tap the <b>steepest section</b> of the shore profile.", a: [`s${steep}`], ansTxt: `the section from ${F.cuts[steep]} m to ${F.cuts[steep + 1]} m`, labelOf: (id) => { const i = +id.slice(1); return `${F.cuts[i]}–${F.cuts[i + 1]} m`; },
    hint: "Tap a section of the profile line.", askOpt: { tapMode: true }, doneOpt: () => ({ tapMode: true, hl: { sec: steep } }),
    why: `The steepest section is where the height rises most for each metre along: from ${F.cuts[steep]} m to ${F.cuts[steep + 1]} m the shore rises ${fmt(round1(F.hv[steep + 1] - F.hv[steep]), 1)} m in ${F.cuts[steep + 1] - F.cuts[steep]} m. Look for the line that slopes up most sharply.` });
  // 4. where is cover highest
  qs.push({ kind: "num", q: `How far up the shore was the percentage cover of ${O.short} highest?`, ans: F.pk * QI, tol: 0.5, unit: "m", hl: { markC: { d: F.pk * QI, c: F.cover[F.pk] } },
    why: `The highest point on the percentage-cover line is ${F.cover[F.pk]}%, at <b>${F.pk * QI} m</b> up the shore.` });
  // 5. explain the distribution (knowledge-model reasons and misconceptions)
  const E = EXPLAIN[F.orgKey];
  qs.push({ kind: "choice", q: E.q, options: E.options, a: 0, hl: {}, why: E.why });
  // 6. the sampling method
  qs.push({ kind: "choice", q: "Quadrats were placed every 4 m along a tape from low tide up the shore, and the percentage cover inside each one was recorded. What is this sampling method?", options: ["A belt transect", "A line transect", "Random sampling with quadrats", "A shore profile survey"], a: 0, hl: {},
    why: "Placing quadrats at set intervals along a tape is a <b>belt transect</b>: systematic sampling that shows how distribution changes along a gradient. A line transect records only the organisms touching the tape; random sampling is used to estimate the population of a whole area, not to show change along the shore." });
  // 7. plot a missing cover point
  const pi = pickR(r, Array.from({ length: nq - 2 }, (_, i) => i + 1).filter((i) => i !== F.pk && F.cover[i] >= 10)), dP = pi * QI, cP = F.cover[pi];
  const snap = (v, s) => Math.round(v / s) * s, cl = (v, a, b) => Math.max(a, Math.min(b, v));
  qs.push({ kind: "plot", q: `The quadrat at <b>${dP} m</b> had <b>${cP}%</b> cover of ${O.short}. Its point is missing from the bottom graph. Plot it with a cross (×).`,
    askOpt: { plotMode: true, hideC: pi },
    plot: { start: { d: 0, c: 0 }, answer: { d: dP, c: cP }, hint: "Tap the bottom graph to place your cross.",
      fromTap: (p) => ({ d: cl(snap((p.x - G.L) / G.pw * DX, 0.5), 0, DX), c: cl(snap((G.T2 + G.ph2 - p.y) / G.ph2 * 100, 2.5), 0, 100) }),
      nudges: [["l", "◀", "Move the cross 0.5 m down the shore"], ["dn", "▼", "Lower the cross by 2.5%"], ["u", "▲", "Raise the cross by 2.5%"], ["rt", "▶", "Move the cross 0.5 m up the shore"]],
      nudge: (s, k) => ({ d: cl(s.d + (k === "l" ? -0.5 : k === "rt" ? 0.5 : 0), 0, DX), c: cl(s.c + (k === "dn" ? -2.5 : k === "u" ? 2.5 : 0), 0, 100) }),
      label: (s) => `Your cross: ${fmt(s.d)} m, ${fmt(s.c)}%.`,
      check: (s) => Math.abs(s.d - dP) <= 0.5 + 1e-9 && Math.abs(s.c - cP) <= 2.5 + 1e-9 },
    doneOpt: (s, ok) => ({ state: s, hideC: ok ? pi : null, hl: { markC: { d: dP, c: cP } } }),
    doneNote: (s, ok) => (ok ? "" : `The correct point is highlighted: ${dP} m, ${cP}%.`),
    why: `Go along the bottom graph to ${dP} m, then up to ${cP}%. Each small square is 1 m across and 5% up, so a cross within half a small square is marked right.` });
  return qs;
}

function selfTest(F, qs) {
  const bad = [];
  if (F.hv.some((h, i) => i && h <= F.hv[i - 1]) || F.hv[F.hv.length - 1] > F.Hmax - 0.2) bad.push("profile not rising or off the grid");
  if (F.hv.some((h) => Math.abs(h * 5 - Math.round(h * 5)) > 1e-9)) bad.push("pole heights off the 0.2 m grid");
  const gs = F.g.slice().sort((a, b) => b - a); if (gs[0] < gs[1] * 1.3) bad.push("steepest not unique");
  if (F.cover.some((c) => c % 5)) bad.push("cover not on 5% grid");
  for (const q of qs) if (q.kind === "choice") { const len = q.options.map((o) => o.length); if (len[q.a] > Math.max(...len.filter((_, i) => i !== q.a))) bad.push("correct option is the longest: " + q.q.slice(0, 40)); }
  const x = qs.find((q) => q.hl && q.hl.cross); if (x) { const { h, d } = x.hl.cross; if (Math.abs(hAt(F, d) - h) > 1e-9) bad.push("cross-read height mismatch"); }
  return bad;
}

export default {
  key: KEY, group: "Graphs and charts", name: "Shore profile and cover", topics: "Unit 5 (5.2 and 5.4)", thumbSeed: 5,
  blurb: "A rocky-shore profile and the percentage cover of one organism along the same transect.",
  tips: ["Both graphs share the same distance axis, so a distance on one graph is the same place on the other.", "To use both graphs: read across the top graph to find the distance, then read the bottom graph at that distance.", "The steepest section is where the height rises most for each metre along the shore.", "Quadrats at set intervals along a tape make a belt transect."],
  ctx: (F) => `a transect up ${F.place}`,
  make, svg, axes, questions, selfTest,
  css: `.fig-shore .shax{font-size:13px}.fig-shore .shttl{font-size:13.5px;font-weight:700}.fig-shore .shhl{stroke:var(--app);stroke-width:5;stroke-linecap:round}.fig-shore .shcons{stroke:var(--app);stroke-width:1.6;stroke-dasharray:4 3}.fig-shore .shcross line{stroke:var(--accent);stroke-width:3}`,
};
