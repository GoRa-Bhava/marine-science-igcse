/* ---------- THE GREENHOUSE EFFECT: AN ARROW DIAGRAM (0697 6.8, "describe the effects of present-day pollution of the air
   by methane and carbon dioxide, including the enhanced greenhouse effect and climate change"; "explain the role of the
   ocean in absorbing heat"; "describe the effects of increasing atmospheric carbon dioxide on sea water"; "describe
   possible impacts of increasing greenhouse gases on marine ecosystems". Knowledge model 6.8/LO2, LO3, LO4, LO6) ----------
   An exam-style schematic: the Sun, a layer of greenhouse gases in the atmosphere, and the ocean surface. Energy arrows:
     S  sunlight passing through the atmosphere to the surface;
     U  heat radiated from the surface up to the greenhouse gases;
     E  heat that passes through the gases and escapes to space;
     R  heat that the gases radiate back towards the surface (the "trapped" heat);
     O  (most seeds) heat absorbed by the ocean.
   Arrows carry letters, never words; which arrows are lettered, and with which letters, varies by seed. Arrow WIDTH shows the
   amount of energy (stated in a key). Two layouts: one diagram, or two diagrams (1 and 2) with the same sunlight and the
   same surface heat, where the diagram with more greenhouse gas has a narrower escape arrow and a wider return arrow. The
   gas layer is drawn identically in both, so the student must read the arrows. Mirrored left–right on some seeds.
   Forbidden content (KM 6.8/LO2–LO4) is never required: no water vapour, no wavelengths, no −18/+14 °C, no heat-capacity
   values, no carbonate chemistry, no methane sources. Misconceptions used as distractors: the gases block or reflect
   sunlight · carbon dioxide "reacts with oxygen" to make heat · the natural effect is the problem · the ocean reflects the
   heat · thermal expansion "makes new water" · evaporation lowers sea level · warm water holds more oxygen · pH rises.
   Question order is chosen so no feedback hands over a later answer: the true/false statements come first (their
   feedback names no arrows), then the arrow letter, the tap (a different arrow), the comparison, the ocean, the ecosystem. */
import { rng, shuffleR, pickMixed } from "../core.js";

const KEY = "greenhouse";
const W = 540, PH = 262, HEAD = 24, GAP = 12;
const SURF = 206, LAY0 = 98, LAY1 = 124;
/* arrow geometry (un-mirrored, sun on the left), panel-local coordinates */
const GEO = {
  S: [[68, 66], [168, 202]],
  U: [[214, 202], [250, 128]],
  E: [[266, 94], [296, 16]],
  R: [[290, 128], [330, 202]],
  O: [[362, 222], [372, 256]],
};
/* letter position: fraction along the arrow and which side (+1 = right of travel direction, un-mirrored) */
const LPOS = { S: [0.62, -1], U: [0.5, 1], E: [0.5, 1], R: [0.5, -1], O: [0.5, -1] };
const ORDER = ["S", "U", "E", "R", "O"];
const MEAN = {
  S: "sunlight passing through to the Earth's surface",
  U: "heat radiated from the Earth's surface",
  E: "heat escaping from the atmosphere to space",
  R: "heat radiated back towards the surface by greenhouse gases",
  O: "heat being absorbed by the ocean",
};
const MISMEAN = ["sunlight reflected back into space by greenhouse gases", "heat produced when carbon dioxide reacts with oxygen"];
const WHYMEAN = {
  S: "sunlight from the Sun passes through the atmosphere, including the layer of greenhouse gases, and warms the Earth's surface. Greenhouse gases do not block or reflect the incoming sunlight",
  U: "the surface, warmed by sunlight, radiates heat upwards into the atmosphere, towards the greenhouse gases",
  E: "it starts at the layer of greenhouse gases and points up into space, so it is heat that is not trapped and escapes",
  O: "it points down from the surface into the sea water, because the ocean absorbs heat at its surface",
};
/* letter sets; a letter never matches a word the arrow could stand for (S = sunlight, E = escape, R = radiated back, O = ocean) */
const LETSETS = [["A", "B", "C", "D", "E"], ["J", "K", "L", "M", "N"], ["V", "W", "X", "Y", "Z"], ["F", "G", "J", "K", "L"]];
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const f1 = (v) => (Math.round(v * 10) / 10).toFixed(1);

function make(seed) {
  const r = rng(seed + 4049);
  const F = { kind: KEY, seed };
  F.two = r() < 0.5; F.mirror = r() < 0.5; F.ocean = r() < 0.7;
  F.arrows = ORDER.filter((a) => a !== "O" || F.ocean);
  // which arrows carry letters: all, or all but one of S/U/O (E and R always lettered, so the comparison can name them)
  const drop = r() < 0.35 ? shuffleR(r, F.arrows.filter((a) => a === "S" || a === "U" || a === "O"))[0] : null;
  const lettered = F.arrows.filter((a) => a !== drop);
  const LS = LETSETS[Math.floor(r() * LETSETS.length)].slice(0, lettered.length);
  let perm = shuffleR(r, LS); for (let n = 0; n < 50 && lettered.some((a, i) => perm[i] === a); n++) perm = shuffleR(r, LS);
  F.let = {}; lettered.forEach((a, i) => (F.let[a] = perm[i]));
  // widths (SVG units). U is shared out between E and R.
  const wS = 9 + Math.round(r() * 2), wU = 9 + Math.round(r() * 2), wO = 6 + Math.round(r() * 2);
  if (F.two) {
    F.hi = r() < 0.5 ? 0 : 1;                  // panel index with the higher concentration of greenhouse gases
    const big = wU - 1 + Math.round(r()), small = Math.max(3, wU + 4 - big - 1);
    F.w = [0, 1].map((p) => ({ S: wS, U: wU, O: wO, E: p === F.hi ? small : big, R: p === F.hi ? big : small }));
  } else {
    const e = Math.round(wU / 2 + (r() - 0.5) * 2);
    F.w = [{ S: wS, U: wU, O: wO, E: e, R: wU + 1 - e }];
  }
  // molecules in the layer, the same in every panel
  F.mol = []; for (let i = 0; i < 34; i++) F.mol.push([14 + r() * (W - 28), LAY0 + 5 + r() * (LAY1 - LAY0 - 10)]);
  return F;
}

/* ---------- drawing ---------- */
const nP = (F) => (F.two ? 2 : 1);
const pTop = (F, p) => (F.two ? HEAD + p * (PH + GAP + HEAD) : 0);
const X = (F, x) => (F.mirror ? W - x : x);
const anc = (F, a) => (F.mirror ? (a === "end" ? "start" : a === "start" ? "end" : a) : a);

/** an arrow from a to b with shaft width w: a shaft path plus a head, as one filled polygon */
function arrowPoly(a, b, w) {
  const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, nx = -uy, ny = ux;
  const hl = 11 + w * 0.6, hw = w / 2 + 7, bx = b[0] - ux * hl, by = b[1] - uy * hl, h = w / 2;
  const P = [[a[0] + nx * h, a[1] + ny * h], [bx + nx * h, by + ny * h], [bx + nx * hw, by + ny * hw], b, [bx - nx * hw, by - ny * hw], [bx - nx * h, by - ny * h], [a[0] - nx * h, a[1] - ny * h]];
  return "M" + P.map(([x, y]) => `${f1(x)} ${f1(y)}`).join("L") + "Z";
}
function ends(F, id, T) { return GEO[id].map(([x, y]) => [X(F, x), y + T]); }
function letterAt(F, id, T, w) {
  const [a, b] = ends(F, id, T), [t, sd] = LPOS[id], dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy);
  const s = sd * (F.mirror ? -1 : 1), nx = -dy / L * s, ny = dx / L * s, off = w / 2 + 15;
  return [a[0] + dx * t + nx * off, a[1] + dy * t + ny * off];
}

function svg(F, opt) {
  opt = opt || {}; const hl = opt.hl || {}, tp = opt.tap;
  let s = "";
  for (let p = 0; p < nP(F); p++) {
    const T = pTop(F, p), wd = F.w[p], on = (hl.frames || []).includes(p);
    if (F.two) s += `<text x="${X(F, 14)}" y="${T - 7}" text-anchor="${anc(F, "start")}" class="gh-head">Diagram ${p + 1}</text>`;
    s += `<rect x="4" y="${T}" width="${W - 8}" height="${PH}" rx="8" class="gh-frame${on ? " gh-on" : ""}"/>`;
    // ocean
    let wave = `M4 ${SURF + T}`; for (let x = 4; x <= W - 4; x += 6) wave += `L${x} ${f1(SURF + T + 2.6 * Math.sin((x / 24) * 2 * Math.PI))}`;
    s += `<path d="${wave}L${W - 4} ${T + PH - 1}L4 ${T + PH - 1}Z" class="gh-water"/><path d="${wave}" class="gh-surf"/>`;
    // the gas layer
    s += `<rect x="5" y="${LAY0 + T}" width="${W - 10}" height="${LAY1 - LAY0}" class="gh-layer"/>`;
    for (const [mx, my] of F.mol) s += `<circle cx="${f1(X(F, mx))}" cy="${f1(my + T)}" r="3" class="gh-mol"/>`;
    // the Sun
    const scx = X(F, 46), scy = 46 + T;
    for (let i = 0; i < 12; i++) { const th = (i / 12) * 2 * Math.PI; s += `<line x1="${f1(scx + 26 * Math.cos(th))}" y1="${f1(scy + 26 * Math.sin(th))}" x2="${f1(scx + 34 * Math.cos(th))}" y2="${f1(scy + 34 * Math.sin(th))}" class="gh-ray"/>`; }
    s += `<circle cx="${scx}" cy="${scy}" r="22" class="gh-sun"/><text x="${scx}" y="${scy + 5}" text-anchor="middle" class="gh-sunt">Sun</text>`;
    // labels (words for places only; arrows carry letters)
    const lx = X(F, W - 14), la = anc(F, "end");
    s += `<text x="${lx}" y="${T + 24}" text-anchor="${la}" class="gh-lab">space</text>`;
    const bw = 184, bx = F.mirror ? 9 : W - 9 - bw;   // name plate inside the band, on the side away from the arrows
    s += `<rect x="${bx}" y="${LAY0 + T + 3}" width="${bw}" height="${LAY1 - LAY0 - 6}" rx="3" class="gh-plate"/><text x="${lx}" y="${LAY1 + T - 7}" text-anchor="${la}" class="gh-lab">greenhouse gases</text>`;
    s += `<text x="${lx}" y="${LAY0 + T - 10}" text-anchor="${la}" class="gh-lab">atmosphere</text>`;
    s += `<text x="${lx}" y="${T + PH - 16}" text-anchor="${la}" class="gh-lab">ocean</text>`;
    // arrows
    for (const id of F.arrows) {
      const [a, b] = ends(F, id, T), w = wd[id], isH = (hl.arrows || []).includes(id) && (hl.panels || [p]).includes(p);
      s += `<path d="${arrowPoly(a, b, w)}" class="gh-arr${isH ? " hl" : ""}"/>`;
      if (F.let[id]) { const [x, y] = letterAt(F, id, T, w); s += `<text x="${f1(x)}" y="${f1(y + 7)}" text-anchor="middle" class="gh-let">${F.let[id]}</text>`; }
    }
    if (tp != null && tp === p) for (const id of F.arrows) { const [a, b] = ends(F, id, T); s += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="transparent" stroke-width="34" data-tap="${id}"/>`; }
  }
  const ky = pTop(F, nP(F) - 1) + PH + 24;
  s += `<text x="10" y="${ky}" class="gh-sm">Arrow width shows the amount of energy.</text><text x="${W - 10}" y="${ky}" text-anchor="end" class="gh-sm">not to scale</text>`;
  return `<svg viewBox="0 0 ${W} ${ky + 8}" class="figsvg fig-${KEY}" role="img" aria-label="${F.two ? "Two diagrams" : "A diagram"} of the greenhouse effect: the Sun, a layer of greenhouse gases in the atmosphere and the ocean, with lettered arrows showing energy">${s}</svg>`;
}

/* ---------- questions ---------- */
/* [statement, true?, reason, tag]: at most one statement per tag in a run, so no two shown contradict each other */
const MULTI = [
  ["Greenhouse gases trap some of the heat radiated from the Earth's surface.", true, "they absorb heat given out by the surface and radiate some of it back"],
  ["Carbon dioxide and methane are both greenhouse gases.", true, "both are released by human activity and both trap heat"],
  ["Adding extra greenhouse gases to the atmosphere causes the enhanced greenhouse effect.", true, "the extra gases strengthen the natural greenhouse effect", "nat"],
  ["The enhanced greenhouse effect is a cause of climate change.", true, "it raises the average temperature of the Earth, which changes climates"],
  ["Without the natural greenhouse effect, the Earth would be much colder.", true, "the natural effect keeps the Earth warm enough for life; the problem is the extra gases", "nat"],
  ["Sunlight passes through the greenhouse gases to reach the Earth's surface.", true, "the gases let the incoming sunlight through, as the diagram shows", "sun"],
  ["Greenhouse gases block incoming sunlight, so less of it reaches the surface.", false, "the gases let sunlight through; they trap the heat radiated from the surface", "sun"],
  ["Greenhouse gases reflect sunlight back into space, which cools the Earth.", false, "they do not reflect sunlight, and their effect is to warm the Earth, not cool it", "sun"],
  ["Carbon dioxide reacts with oxygen in the air, and this reaction gives out heat.", false, "carbon dioxide does not react to make heat; it traps heat radiated from the surface"],
  ["The natural greenhouse effect, not the extra gases from human activity, is the problem.", false, "the natural effect is needed; the extra gases cause the enhanced effect", "nat"],
];
const OCEAN = [
  { q: "The ocean absorbs much of the extra heat trapped by greenhouse gases. What happens to the sea water as a result?",
    o: ["It expands as it warms, so sea level rises", "It contracts as it warms, so sea level falls", "More of it evaporates, so sea level falls", "Its particles join to make new water, so sea level rises"],
    why: "As sea water absorbs heat, its particles move faster and further apart, so the same mass of water takes up a <b>larger volume</b>. This is <b>thermal expansion</b>, and it makes <b>sea level rise</b>. No new water is made, and evaporation does not lower sea level." },
  { q: "The ocean absorbs much of the extra heat trapped by greenhouse gases. How does this affect global temperature?",
    o: ["It slows the rise in global temperature", "It speeds up the rise in global temperature", "It cools the Earth by reflecting heat to space", "It turns the heat into dissolved carbon dioxide"],
    why: "The ocean takes up a large share of the extra heat, so the air warms <b>more slowly</b> than it otherwise would: the ocean helps to <b>keep global temperature stable</b>. It does not reflect the heat away, and heat is not turned into a gas; the warmed water expands instead." },
];
const IMPACT = [
  { q: "Increasing greenhouse gases warm the sea. What is a likely effect on fish that need a lot of dissolved oxygen?",
    o: ["Warm water holds less oxygen, so they move to cooler water", "Warm water holds more oxygen, so they grow faster", "Warm water holds more oxygen, so they move into it", "Warm water holds less salt, so they move into shallower water"],
    why: "Warm water holds <b>less dissolved oxygen</b> than cold water. Fish that need a lot of oxygen <b>move to cooler water</b> (their distribution and migration change) or die where they cannot move." },
  { q: "Increasing greenhouse gases warm the sea. Sea temperature on a reef stays above normal for several weeks. What is the most likely effect on the corals?",
    o: ["They expel their zooxanthellae and turn white", "They take in more zooxanthellae and grow faster", "They grow downwards into deeper, cooler water", "They take in more oxygen, so the reef grows larger"],
    why: "Warm water stresses the coral polyps, so they <b>expel their zooxanthellae</b> and lose their colour: <b>coral bleaching</b>. Without the sugars from the zooxanthellae the coral may starve and die." },
  { q: "As the amount of carbon dioxide in the atmosphere increases, more of it dissolves in sea water. What happens to the sea water?",
    o: ["Its pH decreases, so it becomes more acidic", "Its pH increases, so it becomes more alkaline", "Its pH stays the same, but it holds more oxygen", "It loses its oxygen, as the carbon dioxide pushes it out"],
    why: "Dissolved carbon dioxide forms a weak acid, so the sea water's <b>pH decreases</b> and it becomes <b>more acidic</b> (acidification). Its pH does not rise. Increasing carbon dioxide also warms the sea, the other effect on sea water." },
];

function questions(F, r) {
  const qs = [], L = (id) => F.let[id], arrowName = (id) => (L(id) ? `arrow <b>${L(id)}</b>` : "the arrow");
  const D = (p) => `diagram ${p + 1}`;
  // 1. which statements about the greenhouse effect are true (first: its feedback names no arrow)
  let pick = null;
  for (let n = 0; n < 200 && !pick; n++) { const c = pickMixed(r, MULTI, 5), tg = c.map((x) => x[3]).filter(Boolean); if (new Set(tg).size === tg.length) pick = c; }
  if (!pick) pick = shuffleR(r, [0, 1, 3, 8, 6].map((i) => MULTI[i]));
  qs.push({ kind: "multi", q: "Use the diagram and your own knowledge. Tick <b>every</b> statement that is true.", options: pick.map((x) => x[0]), a: pick.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0), hl: {},
    why: pick.map((x) => `${x[1] ? "✓" : "✗"} ${x[0]}: ${x[2]}.`).join("<br>") });
  // 2. what does a lettered arrow show (never R: that is the tap target or appears in the comparison)
  const cand = ["S", "U", "E", "O"].filter((a) => L(a) && F.arrows.includes(a));
  const wts = cand.map((a) => (a === "S" ? 0.5 : 1)); let u = r() * wts.reduce((x, y) => x + y), x2 = cand[0];
  for (let i = 0; i < cand.length; i++) { u -= wts[i]; if (u <= 0) { x2 = cand[i]; break; } }
  // R's meaning only beside the heat arrows it could be confused with (E, U); otherwise three from the pool. The key is
  // never the longest option: if it would be, the last distractor is swapped for the longest unused one.
  const pool = shuffleR(r, ORDER.filter((a) => a !== x2 && a !== "R").map((a) => MEAN[a]).concat(MISMEAN));
  let dis = x2 === "E" || x2 === "U" ? [MEAN.R, ...pool.slice(0, 2)] : pool.slice(0, 3);
  if (Math.max(...dis.map((x) => x.length)) <= MEAN[x2].length) { const rest = pool.filter((x) => !dis.includes(x)).sort((a, b) => b.length - a.length); if (rest.length && rest[0].length > MEAN[x2].length) dis[2] = rest[0]; }
  qs.push({ kind: "choice", q: `What does <b>arrow ${L(x2)}</b> show?${F.two ? " (It shows the same thing in both diagrams.)" : ""}`, options: [MEAN[x2], ...dis].map(cap), a: 0, hl: { arrows: [x2], panels: [0, 1] },
    why: `Arrow ${L(x2)} shows <b>${MEAN[x2]}</b>. ${cap(WHYMEAN[x2])}.` });
  // 3. tap the arrow showing heat trapped and radiated back (or, sometimes, heat escaping), on one diagram
  const tgt = x2 === "E" || r() < 0.7 ? "R" : "E", tpP = F.two ? Math.floor(r() * 2) : 0;
  const tStem = tgt === "R" ? "the heat that is <b>trapped</b> by greenhouse gases and <b>radiated back</b> towards the Earth's surface" : "heat that passes through the greenhouse gases and <b>escapes to space</b>";
  qs.push({ kind: "tap", q: `${F.two ? `On <b>${D(tpP)}</b>, tap` : "Tap"} the arrow that shows ${tStem}.`, a: [tgt], ansTxt: tgt === "R" ? "the arrow from the gas layer down to the surface" : "the arrow from the gas layer up into space",
    labelOf: (id) => (F.let[id] ? `arrow ${F.let[id]}` : "an unlettered arrow"), hint: "Tap one arrow on the diagram.",
    askOpt: { tap: tpP }, doneOpt: () => ({ tap: tpP, hl: { arrows: [tgt], panels: [tpP], frames: F.two ? [tpP] : [] } }),
    why: tgt === "R" ? "Greenhouse gases absorb some of the heat radiated from the surface and <b>radiate it back towards the surface</b>. That is the arrow that runs <b>from the gas layer down to the surface</b>. This trapped heat keeps the surface warmer than it would otherwise be."
      : "Heat radiated from the surface that is not trapped passes through the layer of greenhouse gases and <b>escapes to space</b>: the arrow that runs <b>from the gas layer up into space</b>." });
  // 4. more carbon dioxide: compare the two diagrams, or predict the change on one
  const e = L("E"), rr = L("R");
  if (F.two) {
    const hi = F.hi, lo = 1 - hi, Dh = cap(D(hi)), Dl = cap(D(lo));
    qs.push({ kind: "choice", q: "One diagram shows the Earth with a <b>higher concentration</b> of carbon dioxide and other greenhouse gases. Which diagram is it, and why?",
      options: [`${Dh}, because less heat escapes to space`, `${Dl}, because more heat escapes to space`, `${Dh}, because less sunlight reaches the surface`, `${Dl}, because more heat is radiated back to the surface`], a: 0,
      hl: { arrows: ["E", "R"], panels: [hi], frames: [hi] },
      why: `Arrow width shows the amount of energy. In <b>${D(hi)}</b>, arrow ${e} (heat escaping to space) is <b>narrower</b> and arrow ${rr} (heat radiated back) is <b>wider</b> than in ${D(lo)}. More greenhouse gas traps more heat, so less escapes: the <b>enhanced greenhouse effect</b>, which warms the Earth. The sunlight arrow is the same width in both diagrams: the gases do not block sunlight.` });
  } else {
    const [p1, p2] = e < rr ? [e, rr] : [rr, e];
    qs.push({ kind: "choice", q: `Arrow width shows the amount of energy. If more carbon dioxide were added to the atmosphere, how would arrows <b>${p1}</b> and <b>${p2}</b> change?`,
      options: [`${e} becomes narrower and ${rr} becomes wider`, `${e} becomes wider and ${rr} becomes narrower`, `Both stay the same, but the sunlight arrow becomes narrower`, `${e} and ${rr} both become narrower`], a: 0,
      hl: { arrows: ["E", "R"], panels: [0] },
      why: `Arrow ${e} is heat escaping to space and arrow ${rr} is heat radiated back to the surface. More carbon dioxide traps more of the heat from the surface, so <b>${rr} becomes wider</b> and <b>${e} becomes narrower</b>: the <b>enhanced greenhouse effect</b>, which warms the Earth. The sunlight is not blocked, so its arrow does not change.` });
  }
  // 5. the ocean's role
  const oc = OCEAN[Math.floor(r() * OCEAN.length)];
  qs.push({ kind: "choice", q: oc.q, options: oc.o.slice(), a: 0, hl: F.ocean ? { arrows: ["O"], panels: [0, 1] } : {}, why: oc.why });
  // 6. effects of increasing greenhouse gases on sea water and marine ecosystems (no sea-level item: question 5 covers it)
  const im = IMPACT[Math.floor(r() * IMPACT.length)];
  qs.push({ kind: "choice", q: im.q, options: im.o.slice(), a: 0, hl: {}, why: im.why });
  return qs;
}

function segDist(a, b, c, d) {
  const pd = (p, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy))); return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy); };
  return Math.min(pd(a, c, d), pd(b, c, d), pd(c, a, b), pd(d, a, b));
}
function selfTest(F, qs) {
  const bad = [];
  if (!F.let.E || !F.let.R) bad.push("E/R unlettered");
  const ls = Object.values(F.let); if (new Set(ls).size !== ls.length) bad.push("dup letters");
  // tap overlays (26 wide) never overlap
  for (let i = 0; i < ORDER.length; i++) for (let j = i + 1; j < ORDER.length; j++) if (segDist(...GEO[ORDER[i]], ...GEO[ORDER[j]]) < 34) bad.push("overlays touch " + ORDER[i] + ORDER[j]);
  if (F.two) {
    const h = F.w[F.hi], l = F.w[1 - F.hi];
    if (!(h.E <= l.E - 4 && h.R >= l.R + 4)) bad.push("widths not distinct");
    if (h.S !== l.S || h.U !== l.U) bad.push("sunlight/surface widths differ");
  }
  for (const w of F.w) for (const id of F.arrows) if (!(w[id] >= 3)) bad.push("thin arrow");
  const q2 = qs[1], q3 = qs[2];
  if (q3.a[0] === "E" && /escap/.test(q2.why)) bad.push("q2 reveals tap");
  if (/arrow [A-Z]\b/.test(qs[0].why)) bad.push("multi names an arrow");
  for (const [a, l] of Object.entries(F.let)) if (a === l) bad.push("tell letter " + a);
  if (q3.kind !== "tap" || qs[1].hl.arrows[0] === q3.a[0]) bad.push("tap repeats q2");
  // q2's feedback never names the tap target's letter
  if (new RegExp(`arrow ${F.let[q3.a[0]]}\\b`).test(q2.why)) bad.push("q2 names the tap letter");
  for (const q of qs) if (q.kind === "choice") {
    if (new Set(q.options).size !== q.options.length) bad.push("dup options");
    const Ln = q.options.map((x) => x.length); if (Ln[0] >= Math.max(...Ln.slice(1))) bad.push("key is longest: " + q.q.slice(0, 50));
  }
  { const tg = qs[0].options.map((t) => (MULTI.find((x) => x[0] === t) || [])[3]).filter(Boolean); if (new Set(tg).size !== tg.length) bad.push("contradictory multi pair"); }
  const m = qs[0]; m.options.forEach((t, i) => { const st = MULTI.find((x) => x[0] === t); if (!st || st[1] !== m.a.includes(i)) bad.push("multi truth"); });
  for (const q of qs.filter((q) => q.kind === "tap")) { const sv = svg(F, q.askOpt); if (!sv.includes(`data-tap="${q.a[0]}"`)) bad.push("tap target missing"); }
  if (/sea level/i.test(qs[5].q + qs[5].options.join())) bad.push("q6 sea level");
  return bad;
}

export default {
  key: KEY, group: "Diagrams", name: "The greenhouse effect", topics: "Unit 6 (6.8)", thumbSeed: 5,
  blurb: "An arrow diagram of the Sun, the greenhouse gases and the ocean: say what each arrow shows, find the trapped heat and predict what more carbon dioxide does.",
  tips: ["Sunlight passes through the atmosphere and warms the Earth's surface. Greenhouse gases do not block or reflect it.",
    "The warm surface radiates heat. Greenhouse gases such as carbon dioxide and methane trap some of it and radiate it back towards the surface; the rest escapes to space.",
    "More greenhouse gas traps more heat, so less escapes: the enhanced greenhouse effect, which causes climate change.",
    "Where arrow width shows the amount of energy, compare widths: a narrower arrow to space means more heat is being trapped.",
    "The ocean absorbs much of the extra heat. This slows the rise in global temperature, but the warmed water expands, so sea level rises."],
  ctx: (F) => (F.two ? "two diagrams of the greenhouse effect, with different amounts of greenhouse gas" : "the greenhouse effect: arrows show how energy moves"),
  make, svg, questions, selfTest,
  css: `.fig-greenhouse{font-size:15px}.fig-greenhouse .gh-frame{fill:var(--surface);stroke:var(--line);stroke-width:1}.fig-greenhouse .gh-frame.gh-on{stroke:var(--app);stroke-width:3}
.fig-greenhouse .gh-head{font-size:16px;font-weight:800}.fig-greenhouse .gh-lab{font-size:19px;opacity:.9}.fig-greenhouse .gh-sm{font-size:17px;opacity:.85}.fig-greenhouse .gh-plate{fill:var(--surface);stroke:none}
.fig-greenhouse .gh-water{fill:color-mix(in srgb,var(--ink) 11%,var(--surface))}.fig-greenhouse .gh-surf{fill:none;stroke:currentColor;stroke-width:1.5}
.fig-greenhouse .gh-layer{fill:color-mix(in srgb,var(--ink) 5%,var(--surface));stroke:currentColor;stroke-width:1;stroke-dasharray:5 4}
.fig-greenhouse .gh-mol{fill:none;stroke:currentColor;stroke-width:1.1;opacity:.75}
.fig-greenhouse .gh-sun{fill:var(--surface);stroke:currentColor;stroke-width:1.6}.fig-greenhouse .gh-ray{stroke:currentColor;stroke-width:1.6}.fig-greenhouse .gh-sunt{font-size:14px;font-weight:700}
.fig-greenhouse .gh-arr{fill:color-mix(in srgb,var(--ink) 42%,var(--surface));stroke:currentColor;stroke-width:1.3;stroke-linejoin:round}.fig-greenhouse .gh-arr.hl{fill:var(--app);stroke:var(--app)}
.fig-greenhouse .gh-let{font-size:21px;font-weight:800;paint-order:stroke;stroke:var(--surface);stroke-width:4px;stroke-linejoin:round}`,
};
