/* ---------- SAMPLING A ROCKY SHORE (0697 5.2/LO1–LO2) ----------
   Three panels share one generated shore:
   - "quadrat": a 0.5 m × 0.5 m quadrat with 25 squares. It shows a seaweed patch (each square either fully covered
     or less than a quarter covered, so the half-covered rule is never ambiguous), barnacles (dots), limpets (cones)
     and sometimes periwinkles (spirals).
   - "grid": the sampling area gridded into 1 m² squares, numbered across and up. It is used for random-coordinate
     tapping and the scale-up estimate (mean per quadrat × number of squares, which is exact by construction).
   - "transect": a shore profile from the top of the shore to the sea, with a line or belt transect.
   The knowledge model 5.2 terms are used throughout: random sampling, systematic sampling, line transect,
   belt transect, percentage cover, species richness. Kite diagrams and diversity indices are not used. */
import { rng, pickR, shuffleR, fmt, pickMixed } from "../core.js";

const KEY = "quadrat";
const DIMS = [[10, 8], [10, 10], [12, 10], [10, 6]];
const SHORES = ["a rocky shore", "a rocky shore below a cliff", "rocks at the edge of a bay", "a rocky shore near a harbour"];
const CW = 5;                                   // quadrat is 5 × 5 squares, each 4 % of the quadrat
const cid = (c, u) => `${c}-${u}`;

function grow(r, n) {                           // a connected blob of n cells in a 5 × 5 grid
  const start = [1 + Math.floor(r() * 3), 1 + Math.floor(r() * 3)], S = new Set([start.join(",")]);
  for (let guard = 0; S.size < n && guard < 500; guard++) {
    const [x, y] = [...S][Math.floor(r() * S.size)].split(",").map(Number);
    const [dx, dy] = pickR(r, [[1, 0], [-1, 0], [0, 1], [0, -1]]);
    const nx = x + dx, ny = y + dy;
    if (nx >= 0 && nx < CW && ny >= 0 && ny < CW) S.add(`${nx},${ny}`);
  }
  return S;
}

function make(seed) {
  for (let tries = 0; tries < 400; tries++) {
    const r = rng(seed + tries * 7907 + 3);
    // quadrat contents
    const nSea = 5 + Math.floor(r() * 12);               // 5–16 squares covered → 20–64 %
    const sea = grow(r, nSea);
    if (sea.size !== nSea) continue;
    const fringe = [];                                     // small (<25 %) overlaps into neighbouring squares
    const used = new Set();
    for (const k of sea) { const [x, y] = k.split(",").map(Number);
      for (const [dx, dy, side] of [[1, 0, "l"], [-1, 0, "r"], [0, 1, "b"], [0, -1, "t"]]) {
        const nx = x + dx, ny = y + dy, nk = `${nx},${ny}`; if (nx < 0 || ny < 0 || nx >= CW || ny >= CW || sea.has(nk) || used.has(nk)) continue;
        if (r() < 0.35) { used.add(nk); fringe.push({ x: nx, y: ny, side, f: 0.12 + r() * 0.1, p: 0.35 + r() * 0.3 }); }
      } }
    const fringeCells = new Set(fringe.map((f) => `${f.x},${f.y}`));
    // free squares (not seaweed, not fringe) for animals
    const free = []; for (let x = 0; x < CW; x++) for (let y = 0; y < CW; y++) if (!sea.has(`${x},${y}`) && !fringeCells.has(`${x},${y}`)) free.push([x, y]);
    const nBar = 8 + Math.floor(r() * 23), nLim = 2 + Math.floor(r() * 5), hasPeri = r() < 0.5, nPeri = hasPeri ? 1 + Math.floor(r() * 3) : 0;
    const pts = [], place = (min) => { for (let g = 0; g < 200; g++) { const [x, y] = pickR(r, free); const p = [x + 0.15 + r() * 0.7, y + 0.15 + r() * 0.7]; if (pts.every((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) > min)) { pts.push(p); return p; } } return null; };
    const bar = [], lim = [], peri = [];
    let ok = true;
    for (let i = 0; i < nLim && ok; i++) { const p = place(0.42); if (!p) ok = false; else lim.push(p); }
    for (let i = 0; i < nPeri && ok; i++) { const p = place(0.42); if (!p) ok = false; else peri.push(p); }
    for (let i = 0; i < nBar && ok; i++) { const p = place(0.22); if (!p) ok = false; else bar.push(p); }
    if (!ok) continue;
    // sampling area
    const [N, M] = pickR(r, DIMS);
    const all = []; for (let c = 1; c <= N; c++) for (let u = 1; u <= M; u++) all.push([c, u]);
    const rq = shuffleR(r, all).slice(0, 5);
    const counts = rq.map(() => Math.floor(r() * 11));
    const sum = counts.reduce((a, b) => a + b, 0);
    if (sum === 0 || new Set(counts).size < 3) continue;
    const est = sum * N * M / 5;                           // N·M is a multiple of 5 → whole number
    if (!Number.isInteger(est)) continue;
    const tq = shuffleR(r, all.filter(([c, u]) => !rq.some(([a, b]) => a === c && b === u))).slice(0, 4);   // tap set (different squares)
    // transect
    const belt = r() < 0.5, len = pickR(r, [16, 20, 24]), step = pickR(r, [2, 4]);
    return { kind: KEY, seed, place: pickR(r, SHORES), sea: [...sea], fringe, bar, lim, peri, nSea, N, M, rq, counts, sum, est, tq, belt, len, step };
  }
  throw new Error("quadrat: no layout");
}

/* ---------- drawing ---------- */
function quadratSVG(F, opt) {
  const hl = opt.hl || {}, W = 540, Q = 300, X0 = 120, Y0 = 18, s = Q / CW;
  const X = (x) => X0 + x * s, Y = (y) => Y0 + Q - y * s;                 // y measured up from the bottom
  let g = `<defs><pattern id="quadrat-weed" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(35)"><line x1="0" y1="0" x2="0" y2="6" class="qd-hatch"/></pattern></defs>`;
  g += `<rect x="${X0}" y="${Y0}" width="${Q}" height="${Q}" class="qd-bg"/>`;
  for (const k of F.sea) { const [x, y] = k.split(",").map(Number); g += `<rect x="${X(x)}" y="${Y(y + 1)}" width="${s}" height="${s}" class="qd-weed${hl.weed ? " hl" : ""}"/>`; }
  for (const f of F.fringe) { const cx = f.side === "l" ? X(f.x) : f.side === "r" ? X(f.x + 1) : X(f.x) + f.p * s, cy = f.side === "b" ? Y(f.y) : f.side === "t" ? Y(f.y + 1) : Y(f.y) - f.p * s;
    const rr = f.f * s * 1.25; g += `<ellipse cx="${cx}" cy="${cy}" rx="${f.side === "l" || f.side === "r" ? rr : rr * 1.2}" ry="${f.side === "b" || f.side === "t" ? rr : rr * 1.2}" class="qd-weed${hl.weed ? " hl" : ""}" clip-path="url(#quadrat-clip)"/>`; }
  g += `<clipPath id="quadrat-clip"><rect x="${X0}" y="${Y0}" width="${Q}" height="${Q}"/></clipPath>`;
  for (const [x, y] of F.bar) g += `<circle cx="${X(x)}" cy="${Y(y)}" r="4.2" class="qd-bar${hl.bar ? " hl" : ""}"/><circle cx="${X(x)}" cy="${Y(y)}" r="1.3" class="qd-in"/>`;
  for (const [x, y] of F.lim) g += `<polygon points="${X(x)},${Y(y) - 10} ${X(x) + 10},${Y(y) + 7} ${X(x) - 10},${Y(y) + 7}" class="qd-lim"/>`;
  for (const [x, y] of F.peri) g += `<circle cx="${X(x)}" cy="${Y(y)}" r="8" class="qd-lim"/><path d="M${X(x)} ${Y(y)} m-4 0 a4 4 0 1 1 4 4" class="qd-sp"/>`;
  for (let i = 0; i <= CW; i++) g += `<line x1="${X0}" x2="${X0 + Q}" y1="${Y0 + i * s}" y2="${Y0 + i * s}" class="qd-grid"/><line y1="${Y0}" y2="${Y0 + Q}" x1="${X0 + i * s}" x2="${X0 + i * s}" class="qd-grid"/>`;
  g += `<rect x="${X0}" y="${Y0}" width="${Q}" height="${Q}" class="qd-frame"/>`;
  g += `<text x="${X0 + Q / 2}" y="${Y0 + Q + 20}" text-anchor="middle" class="qd-s">0.5 m</text><text transform="translate(${X0 - 12} ${Y0 + Q / 2}) rotate(-90)" text-anchor="middle" class="qd-s">0.5 m</text>`;
  // key
  const ky = Y0 + Q + 46;
  const key = [[`<rect x="0" y="-11" width="22" height="14" class="qd-weed"/>`, "seaweed"], [`<circle cx="11" cy="-4" r="4.2" class="qd-bar"/>`, "barnacle"], [`<polygon points="11,-14 20,3 2,3" class="qd-lim"/>`, "limpet"]];
  if (F.peri.length) key.push([`<circle cx="11" cy="-4" r="8" class="qd-lim"/><path d="M11 -4 m-4 0 a4 4 0 1 1 4 4" class="qd-sp"/>`, "periwinkle"]);
  key.forEach((k, i) => { g += `<g transform="translate(${30 + (i % 2) * 250} ${ky + Math.floor(i / 2) * 28})">${k[0]}<text x="32" y="1" class="qd-k">${k[1]}</text></g>`; });
  const H = ky + Math.ceil(key.length / 2) * 28 + 6;
  return `<svg viewBox="0 0 ${W} ${H}" class="figsvg fig-${KEY}" role="img" aria-label="A gridded quadrat with seaweed, barnacles and limpets">${g}</svg>`;
}

function gridSVG(F, opt) {
  const hl = opt.hl || {}, { N, M } = F, W = 540, L = 40, gw = 468, s = gw / N, T = 14, gh = s * M, H = T + gh + 46;
  const X = (c) => L + (c - 1) * s, Y = (u) => T + gh - u * s;
  let g = `<defs><pattern id="quadrat-rock" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="4" cy="5" r="1.1" class="qd-in"/><circle cx="12" cy="12" r="1.1" class="qd-in"/></pattern></defs>`;
  g += `<rect x="${L}" y="${T}" width="${gw}" height="${gh}" fill="url(#quadrat-rock)" class="qd-bg"/>`;
  for (let c = 0; c <= N; c++) g += `<line x1="${L + c * s}" x2="${L + c * s}" y1="${T}" y2="${T + gh}" class="qd-grid"/>`;
  for (let u = 0; u <= M; u++) g += `<line x1="${L}" x2="${L + gw}" y1="${T + u * s}" y2="${T + u * s}" class="qd-grid"/>`;
  for (let c = 1; c <= N; c++) g += `<text x="${X(c) + s / 2}" y="${T + gh + 18}" text-anchor="middle" class="qd-n">${c}</text>`;
  for (let u = 1; u <= M; u++) g += `<text x="${L - 8}" y="${Y(u) + s / 2 + 5}" text-anchor="end" class="qd-n">${u}</text>`;
  g += `<text x="${L + gw / 2}" y="${H - 6}" text-anchor="middle" class="qd-n">across →  (each square is 1 m²)</text><text transform="translate(12 ${T + gh / 2}) rotate(-90)" text-anchor="middle" class="qd-n">up →</text>`;
  if (opt.counts) F.rq.forEach(([c, u], i) => { g += `<rect x="${X(c) + 2}" y="${Y(u) + 2}" width="${s - 4}" height="${s - 4}" class="qd-samp${hl.counts ? " hl" : ""}"/><text x="${X(c) + s / 2}" y="${Y(u) + s / 2 + 6}" text-anchor="middle" class="qd-cnt">${F.counts[i]}</text>`; });
  if (opt.tapMode) for (let c = 1; c <= N; c++) for (let u = 1; u <= M; u++) g += `<rect x="${X(c)}" y="${Y(u)}" width="${s}" height="${s}" fill="transparent" data-tap="${cid(c, u)}"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="figsvg fig-${KEY}" role="img" aria-label="The sampling area divided into 1 metre squares">${g}</svg>`;
}

function transectSVG(F, opt) {
  const W = 540, H = 270, x0 = 40, x1 = 470, yTop = 56, yLow = 176, n = F.len;
  const X = (d) => x0 + (x1 - x0) * d / n, Yg = (d) => yTop + (yLow - yTop) * Math.pow(d / n, 1.15) + 6 * Math.sin(d * 1.3);
  let pts = []; for (let i = 0; i <= 60; i++) { const d = n * i / 60; pts.push(`${X(d).toFixed(1)},${Yg(d).toFixed(1)}`); }
  let g = `<polygon points="${x0},${H - 48} ${pts.join(" ")} ${x1 + 50},${yLow + 8} ${x1 + 50},${H - 48}" class="qd-rockfill"/>`;
  g += `<polyline points="${pts.join(" ")}" class="qd-ground"/>`;
  g += `<rect x="${x1 - 20}" y="${yLow - 8}" width="${W - x1 + 20}" height="${H - 48 - yLow + 8}" class="qd-sea"/><text x="${x1 + 25}" y="${yLow + 26}" text-anchor="middle" class="qd-k">sea</text>`;
  g += `<text x="${x0}" y="${yTop - 26}" class="qd-k">top of shore</text>`;
  // tape
  g += `<polyline points="${pts.join(" ")}" class="qd-tape" transform="translate(0 -4)"/>`;
  for (let d = 0; d <= n; d += 4) g += `<text x="${X(d)}" y="${Yg(d) - 14}" text-anchor="middle" class="qd-n">${d}</text>`;
  g += `<text x="${(x0 + x1) / 2}" y="${H - 4}" text-anchor="middle" class="qd-n">distance along the tape / m</text>`;
  if (F.belt) for (let d = 0; d <= n - 1; d += F.step) { const x = X(d), y = Yg(d); g += `<rect x="${x - 9}" y="${y - 2}" width="18" height="18" class="qd-qsq"/>`; }
  else for (let d = 1; d <= n; d += 1) { const x = X(d), y = Yg(d) - 4; g += `<line x1="${x}" x2="${x}" y1="${y - 6}" y2="${y + 6}" class="qd-tick"/>`; if (d % 2 === 1) g += `<circle cx="${x}" cy="${y + 9}" r="3.2" class="qd-bar"/>`; }
  g += `<text x="${(x0 + x1) / 2}" y="${H - 26}" text-anchor="middle" class="qd-k">${F.belt ? `a quadrat placed every ${F.step} m along the tape` : "organisms touching the tape recorded every 1 m"}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="figsvg fig-${KEY}" role="img" aria-label="A shore profile from the top of the shore to the sea with a tape measure">${g}</svg>`;
}

function svg(F, opt) {
  opt = opt || {};
  const panel = opt.panel || (opt.hl && opt.hl.panel) || "quadrat";
  if (panel === "grid") return gridSVG(F, Object.assign({}, opt, opt.hl && opt.hl.grid));
  if (panel === "transect") return transectSVG(F, opt);
  return quadratSVG(F, opt);
}

/* ---------- questions ---------- */
function questions(F, r) {
  const qs = [];
  const bars = F.bar.length, lims = F.lim.length, species = 3 + (F.peri.length ? 1 : 0);
  // 1. percentage cover (count squares more than half covered)
  qs.push({ kind: "num", q: "Estimate the percentage cover of <b>seaweed</b> in this quadrat. Count a square only if more than half of it is covered. There are 25 squares.", ans: F.nSea * 4, tol: 0, unit: "%",
    askOpt: { panel: "quadrat" }, hl: { panel: "quadrat", weed: true },
    why: `${F.nSea} squares are more than half covered by seaweed. Each square is 1/25 of the quadrat = 4 %, so the percentage cover = ${F.nSea} × 4 = <b>${F.nSea * 4} %</b>. Squares with only a small edge of seaweed are not counted.` });
  // 2. density or species richness
  if (r() < 0.6) qs.push({ kind: "num", q: "The quadrat measures 0.5 m × 0.5 m (an area of 0.25 m²). Use the number of <b>barnacles</b> in it to estimate the number of barnacles per m².", ans: bars * 4, tol: 0, unit: "per m²",
    askOpt: { panel: "quadrat" }, hl: { panel: "quadrat", bar: true },
    why: `There are ${bars} barnacles in 0.25 m². 1 m² is 4 times bigger, so the estimate is ${bars} ÷ 0.25 = ${bars} × 4 = <b>${bars * 4} per m²</b>.` });
  else qs.push({ kind: "num", q: "What is the <b>species richness</b> in this quadrat?", ans: species, tol: 0, unit: "",
    askOpt: { panel: "quadrat" }, hl: { panel: "quadrat" },
    why: `Species richness is the number of different species present, not the number of individuals. The key shows ${species} species in the quadrat (seaweed, barnacles, limpets${F.peri.length ? " and periwinkles" : ""}), so the species richness is <b>${species}</b>.` });
  // 3. random coordinates → tap the squares
  const tq = F.tq, list = tq.map(([c, u]) => `(${c}, ${u})`).join(", ");
  qs.push({ kind: "tap", multi: true, q: `A student used a random-number generator to choose four 1 m² squares to sample. The numbers (across, up) were ${list}. Tap the four squares.`,
    a: tq.map(([c, u]) => cid(c, u)), ansTxt: list, labelOf: (id) => `(${id.replace("-", ", ")})`, hint: "Tap each square once. Read across first, then up.",
    askOpt: { panel: "grid", tapMode: true }, doneOpt: () => ({ panel: "grid", tapMode: true }),
    why: `Read the first number along the bottom (across) and the second up the side. ${tq.map(([c, u]) => `(${c}, ${u}) is ${c} across and ${u} up`).join("; ")}.` });
  // 4. scale-up estimate
  const mean = F.sum / 5, area = F.N * F.M;
  qs.push({ kind: "num", q: `The numbers show how many <b>limpets</b> a student counted in five randomly placed 1 m² quadrats. The whole area is ${F.N} m × ${F.M} m. Estimate the total number of limpets in the area.`, ans: F.est, tol: 0, unit: "limpets",
    askOpt: { panel: "grid", counts: true }, hl: { panel: "grid", grid: { counts: true }, counts: true },
    why: `Mean per quadrat = (${F.counts.join(" + ")}) ÷ 5 = ${F.sum} ÷ 5 = ${fmt(mean)}. The area is ${F.N} × ${F.M} = ${area} m², which is ${area} quadrats. Estimate = ${fmt(mean)} × ${area} = <b>${F.est} limpets</b>.` });
  // 5. which transect method
  qs.push({ kind: "choice", q: "Which sampling method is shown in this diagram?", options: [F.belt ? "Belt transect" : "Line transect", F.belt ? "Line transect" : "Belt transect", "Random sampling with quadrats"], a: 0,
    askOpt: { panel: "transect" }, hl: {},
    why: F.belt ? `A <b>belt transect</b>: a quadrat is placed at regular intervals (every ${F.step} m) along the tape and the organisms inside it are recorded. This is systematic sampling, not random.`
      : "A <b>line transect</b>: the organisms touching the tape are recorded at regular intervals along it. This is systematic sampling, not random." });
  // 6. why a transect, or why random numbers
  if (r() < 0.5) qs.push({ kind: "choice", q: "Why does the student use a transect from the top of the shore to the sea, instead of random quadrats?",
    options: ["To show how the organisms change down the shore", "To find the total population of each species", "To make sure the quadrats are placed without bias", "To make sure that every organism is counted"], a: 0,
    askOpt: { panel: "transect" }, hl: {},
    why: "A transect samples systematically along a line, so it shows the <b>distribution</b>: how the organisms change from the top of the shore to the sea. It does not give the total population, and random placement (not a transect) is what avoids bias." });
  else qs.push({ kind: "choice", q: "Why did the student use random numbers to choose where to place the quadrats?",
    options: ["So the student cannot choose the places, which avoids bias", "So the quadrats are spread out evenly across the area", "So that fewer quadrats are needed for a reliable mean", "So the results show how organisms change down the shore"], a: 0,
    askOpt: { panel: "grid", counts: true }, hl: { panel: "grid", grid: { counts: true } },
    why: "Random numbers mean the student cannot pick squares that look interesting, so <b>sampler bias is removed</b>. Random quadrats are not evenly spread, more quadrats (not random ones) make the mean more reliable, and a transect, not random sampling, shows change down the shore." });
  // 7. safety on a rocky shore
  const st = [
    ["Check the tide times before going onto the shore.", true, "The incoming tide can cut people off, so tide times must be known."],
    ["Wear shoes or boots with a good grip.", true, "Wet rocks and seaweed are slippery."],
    ["Work in a group rather than alone.", true, "Someone can help or fetch help if there is an accident."],
    ["Carry a phone or a whistle in case of an emergency.", true, "A whistle or phone lets you call for help."],
    ["Wear a lab coat to keep your clothes clean.", false, "A lab coat is for the laboratory; it does nothing for the hazards of a shore."],
    ["Go out as the tide comes in, when the rock pools are fullest.", false, "Sampling is done as the tide goes out; a rising tide can cut you off."],
    ["Work alone so that the organisms are not disturbed.", false, "Working alone is unsafe on a shore; work in a group."],
  ];
  const pick = pickMixed(r, st, 4);
  qs.push({ kind: "multi", q: "Tick every precaution that makes sampling on a rocky shore safer.", options: pick.map((x) => x[0]), a: pick.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0),
    askOpt: { panel: "transect" }, hl: {},
    why: pick.map((x) => `${x[1] ? "✓" : "✗"} ${x[0]} — ${x[2]}`).join("<br>") });
  return qs;
}

function selfTest(F, qs) {
  const bad = [];
  if (F.sea.length !== F.nSea) bad.push("seaweed count");
  for (const f of F.fringe) if (F.sea.includes(`${f.x},${f.y}`)) bad.push("fringe inside patch");
  if (F.fringe.some((f) => Math.PI * (f.f * 1.25) ** 2 * 1.2 / 2 > 0.2 || f.p - 1.2 * 1.25 * f.f < 0 || f.p + 1.2 * 1.25 * f.f > 1)) bad.push("fringe too big");
  if (new Set(F.fringe.map((f) => f.x + "," + f.y)).size !== F.fringe.length) bad.push("two fringes in a square");
  if (!Number.isInteger(F.est) || F.est !== F.sum * F.N * F.M / 5) bad.push("estimate");
  const tap = qs.find((q) => q.kind === "tap"); if (new Set(tap.a).size !== 4) bad.push("tap set");
  for (const [c, u] of [...F.tq, ...F.rq]) if (c < 1 || u < 1 || c > F.N || u > F.M) bad.push("square off grid");
  const pts = [...F.bar, ...F.lim, ...F.peri]; for (const [x, y] of pts) { const k = `${Math.floor(x)},${Math.floor(y)}`; if (F.sea.includes(k)) bad.push("animal under seaweed"); }
  return bad;
}

export default {
  key: KEY, group: "Tables and fieldwork", name: "Sampling a rocky shore", topics: "Unit 5 (5.2)", thumbSeed: 5,
  blurb: "A gridded quadrat, a sampling area and a transect: percentage cover, counts, random sampling and transects.",
  tips: ["Percentage cover: count the squares that are more than half covered. With 25 squares, each square is 4 %.", "Per m²: a 0.5 m × 0.5 m quadrat is 0.25 m², so multiply the count by 4.", "Estimate a population: mean per quadrat × number of quadrats that would fit in the whole area.", "Random sampling (random-number coordinates) avoids bias. A transect (line or belt) is systematic and shows how organisms change down the shore.", "Species richness is the number of different species, not the number of individuals."],
  ctx: (F) => `sampling on ${F.place}`,
  make, svg, questions, selfTest,
  css: `.fig-quadrat .qd-bg{fill:var(--surface2);stroke:none}.fig-quadrat .qd-weed{fill:url(#quadrat-weed);stroke:currentColor;stroke-width:1}.fig-quadrat .qd-weed.hl{fill:color-mix(in srgb,var(--app) 55%,transparent)}
.fig-quadrat .qd-hatch{stroke:currentColor;stroke-width:2.2}.fig-quadrat .qd-bar{fill:var(--surface2);stroke:currentColor;stroke-width:1.6}.fig-quadrat .qd-bar.hl{fill:var(--app)}
.fig-quadrat .qd-in{fill:currentColor}.fig-quadrat .qd-lim{fill:var(--surface2);stroke:currentColor;stroke-width:1.8}.fig-quadrat .qd-sp{fill:none;stroke:currentColor;stroke-width:1.4}
.fig-quadrat .qd-grid{stroke:currentColor;stroke-width:1;opacity:.75}.fig-quadrat .qd-frame{fill:none;stroke:currentColor;stroke-width:3}
.fig-quadrat .qd-s,.fig-quadrat .qd-n{font-size:13px}.fig-quadrat .qd-k{font-size:14px}.fig-quadrat .qd-cnt{font-size:17px;font-weight:700}
.fig-quadrat .qd-samp{fill:var(--surface2);stroke:currentColor;stroke-width:2}.fig-quadrat .qd-samp.hl{stroke:var(--app);stroke-width:3}
.fig-quadrat .qd-rockfill{fill:color-mix(in srgb,var(--ink) 12%,transparent);stroke:none}.fig-quadrat .qd-ground{fill:none;stroke:currentColor;stroke-width:2}
.fig-quadrat .qd-sea{fill:color-mix(in srgb,var(--recall) 22%,transparent);stroke:none}.fig-quadrat .qd-tape{fill:none;stroke:var(--app);stroke-width:2.5;stroke-dasharray:6 3}
.fig-quadrat .qd-qsq{fill:none;stroke:currentColor;stroke-width:2}.fig-quadrat .qd-tick{stroke:currentColor;stroke-width:1.5}`,
};
