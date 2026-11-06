/* ---------- SEAFLOOR PROFILE: GEOMORPHOLOGY OF THE OCEANS (0697 1.3/LO6; 1.3/LO4 Mariana Trench; 1.2/LO4 boundary types) ----------
   A generated cross-section of the ocean floor from a coast out into the deep ocean: land → continental shelf (shallow, gentle)
   → continental slope (steep) → abyssal plain (deep, flat), then two or three of a mid-ocean ridge, an ocean trench and a
   volcanic island, in a random order, separated by stretches of abyssal plain. The coast is on the left or the right. The
   six features named in the 1.3 guidance carry letters A–F (shuffled) on label lines, as in the exam. Depth axis 0–9000 m
   (0 m = sea level, small division 500 m); the drawing is not to scale horizontally, and that is said in words.
   Questions: tap a named feature; name a lettered feature; identify a feature from its description or from how it forms
   (ridge = plates move apart, trench = one plate forced beneath another, as in KM1 1.2/LO4 and 1.3/LO6); read a depth or a
   height from the scale (±½ small division); order the features met going out from the coast on THIS drawing; tick the
   true statements. Depth numbers are only ever read from the scale, never recalled (KM1 1.3/LO6 forbids depths as
   knowledge); the only depth fact used is the Mariana Trench ≈ 11 000 m (1.3/LO4), in explanations only. */
import { rng, shuffleR, pickMixed, fmt } from "../core.js";

const KEY = "seafloor";
const W = 560, L = 64, R = 548, PW = R - L, SEA = 76, MAXD = 9000, PH = 280, KPX = PH / MAXD, AXB = SEA + PH, VH = AXB + 34;
const SEAW = 64;
const yOf = (d) => SEA + d * KPX;
const NAME = { shelf: "continental shelf", slope: "continental slope", plain: "abyssal plain", ridge: "mid-ocean ridge", trench: "ocean trench", island: "volcanic island" };
const DESC = {
  shelf: "the shallow, gently sloping seabed next to the coast",
  slope: "the steep drop from the edge of the shelf down to the deep ocean floor",
  plain: "the flat, deep ocean floor",
  ridge: "an underwater mountain chain, formed where two tectonic plates move apart",
  trench: "a deep, narrow depression, formed where one tectonic plate is forced beneath another",
  island: "a volcano that has built up from the seabed until it rises above sea level",
};
// misconception partners (KM1 1.3/LO6: shelf/slope reversed; abyssal plain thought shallow; ridge/trench confused)
const PARTNER = { shelf: ["slope", "plain"], slope: ["shelf", "plain"], plain: ["shelf", "slope"], ridge: ["trench", "island"], trench: ["ridge", "plain"], island: ["ridge", "trench"] };
const ALL = ["shelf", "slope", "plain", "ridge", "trench", "island"];

// rise shapes: [t, fraction]
const RIDGE = [[0, 0], [0.1, 0.12], [0.2, 0.3], [0.3, 0.55], [0.38, 0.8], [0.44, 1], [0.5, -1], [0.56, 1], [0.62, 0.8], [0.7, 0.55], [0.8, 0.3], [0.9, 0.12], [1, 0]];
const TRENCH = [[0, 0], [0.16, 0.12], [0.3, 0.5], [0.44, 1], [0.54, 1], [0.7, 0.45], [0.86, 0.12], [1, 0]];
const ISLAND = [[0, 0], [0.12, 0.12], [0.25, 0.42], [0.36, 0.78], [0.44, 1], [0.5, -1], [0.56, 1], [0.64, 0.78], [0.75, 0.42], [0.88, 0.12], [1, 0]];

function depthAt(pts, u) {
  for (let i = 1; i < pts.length; i++) if (u <= pts[i][0]) { const [u0, d0] = pts[i - 1], [u1, d1] = pts[i]; return u1 === u0 ? d1 : d0 + (d1 - d0) * (u - u0) / (u1 - u0); }
  return pts[pts.length - 1][1];
}

function make(seed) {
  // the feature set, their order and the side of the coast come from the seed alone; the geometry retries until it fits
  const r0 = rng(seed ^ 0x5eaf100d), mirror = r0() < 0.5, roll = r0();
  let feats = ["ridge", "trench", "island"];
  if (roll >= 0.6) feats = feats.filter((_, i) => i !== Math.min(2, Math.floor((roll - 0.6) / 0.4 * 3)));
  const order = shuffleR(r0, feats), three = order.length === 3;
  for (let tries = 0; tries < 4000; tries++) {
    const r = rng(seed + tries * 7919 + 13);
    const plainD = 4000 + 100 * Math.floor(r() * 16), shelfD = 150 + 10 * Math.floor(r() * 11);
    const crest = 1800 + 100 * Math.floor(r() * 13), trenchD = 6800 + 100 * Math.floor(r() * 17);
    if (plainD - crest < 1500 || trenchD - plainD < 1500) continue;
    const islandTop = 350 + 10 * Math.floor(r() * 20);
    const landH = 600 + r() * 250;
    const landW = 36 + r() * 8, shelfW = (three ? 58 : 62) + r() * (three ? 10 : 16), slopeW = (three ? 38 : 40) + r() * (three ? 8 : 12);
    const fw = { ridge: (three ? 76 : 80) + r() * 14, trench: 32 + r() * 8, island: (three ? 46 : 48) + r() * 10 };
    const avail = PW - landW - shelfW - slopeW - order.reduce((s, f) => s + fw[f], 0), nP = order.length + 1;
    const wts = Array.from({ length: nP }, () => (three ? 0.85 : 0.7) + r() * (three ? 0.3 : 0.6)), sw = wts.reduce((a, b) => a + b, 0), pw = wts.map((w) => (w / sw) * avail);
    if (pw.some((w) => w < 32)) continue;
    // segments and profile points (u from the coast side, depth in m; negative = above sea level)
    const segs = [], pts = [];
    let u = 0;
    pts.push([0, -landH], [landW * 0.45, -landH * 0.92], [landW * 0.8, -landH * 0.45], [landW, 0]);
    segs.push({ type: "land", u0: 0, u1: landW }); u = landW;
    pts.push([u + shelfW * 0.5, shelfD * 0.45], [u + shelfW, shelfD]); segs.push({ type: "shelf", u0: u, u1: u + shelfW }); u += shelfW;
    const sm = (t) => t * t * (3 - 2 * t);
    for (const t of [0.2, 0.4, 0.6, 0.8, 1]) pts.push([u + slopeW * t, shelfD + (plainD - shelfD) * sm(t)]);
    segs.push({ type: "slope", u0: u, u1: u + slopeW }); u += slopeW;
    const flip = r() < 0.5, jag = RIDGE.map(() => (r() * 2 - 1) * 0.06);
    for (let k = 0; k < nP; k++) {
      pts.push([u + pw[k], plainD]); segs.push({ type: "plain", u0: u, u1: u + pw[k] }); u += pw[k];
      if (k === order.length) break;
      const f = order[k], w = fw[f];
      if (f === "ridge") { const D = plainD - crest; RIDGE.slice(1).forEach(([t, v], i) => pts.push([u + w * t, v < 0 ? crest + 400 : plainD - D * (v === 1 || v === 0 ? v : v + jag[i])])); }
      if (f === "trench") { const D = trenchD - plainD, tr = (flip ? TRENCH.map(([t, v]) => [1 - t, v]).sort((a, b) => a[0] - b[0]) : TRENCH).slice(1); tr.forEach(([t, v]) => pts.push([u + w * t, plainD + D * v])); }
      if (f === "island") { const D = plainD + islandTop; ISLAND.slice(1).forEach(([t, v]) => pts.push([u + w * t, v < 0 ? -islandTop + 120 : plainD - D * v])); }
      segs.push({ type: f, u0: u, u1: u + w }); u += w;
    }
    for (const s of segs) { const inside = pts.filter((p) => p[0] >= s.u0 - 1e-9 && p[0] <= s.u1 + 1e-9).map((p) => p[1]); s.dmin = Math.min(...inside); s.dmax = Math.max(...inside); }
    // label-line points
    const plains = segs.filter((s) => s.type === "plain"), widest = plains.reduce((a, b) => (b.u1 - b.u0 > a.u1 - a.u0 ? b : a));
    const seg = (t) => segs.find((s) => s.type === t), lead = {};
    lead.shelf = seg("shelf").u0 + shelfW * 0.55; lead.slope = seg("slope").u0 + slopeW * 0.5; lead.plain = (widest.u0 + widest.u1) / 2;
    if (seg("ridge")) lead.ridge = seg("ridge").u0 + fw.ridge * 0.44;
    if (seg("trench")) lead.trench = seg("trench").u0 + fw.trench * 0.49;
    if (seg("island")) lead.island = seg("island").u0 + fw.island * 0.44;
    const xs = Object.values(lead).sort((a, b) => a - b);
    if (xs.some((x, i) => i && x - xs[i - 1] < 28)) continue;
    // "sea level" written just under the sea surface at the ocean end: clear of label lines and of the seabed
    let seaU = null;
    for (let a = PW - 2 - SEAW; a >= PW - 170 && seaU == null; a -= 2) {
      if (xs.some((x) => x > a - 6 && x < a + SEAW + 6)) continue;
      let clear = true; for (let uu = a - 10; uu <= a + SEAW + 10; uu += 2) if (yOf(depthAt(pts, uu)) < SEA + 30) clear = false;
      if (clear) seaU = a;
    }
    if (seaU == null) continue;
    const present = ["shelf", "slope", "plain", ...order];
    const letters = shuffleR(r, "ABCDEF".slice(0, present.length).split("")), letter = {};
    present.forEach((t, i) => (letter[t] = letters[i]));
    return { kind: KEY, seed, mirror, order, present, pts, segs, lead, letter, seaU, plainD, shelfD, crest, trenchD, islandTop, landW };
  }
  throw new Error("seafloor: no layout");
}

/* axes for the reading guide: the depth (y) axis only — the cross-section is not to scale horizontally. */
function axes() {
  const yt = []; for (let dd = 0; dd <= MAXD; dd += 500) yt.push({ at: yOf(dd), label: dd % 1000 === 0 ? String(dd) : undefined });
  return [{ plot: { x0: L, x1: R, y0: SEA, y1: AXB }, x: { ticks: [] }, y: { ticks: yt } }];
}

/* ---------- drawing ---------- */
const X = (F, u) => (F.mirror ? R - u : L + u);
function boxes(F, type) {
  return F.segs.filter((s) => s.type === type).map((s) => { const a = X(F, s.u0), b = X(F, s.u1); return { x0: Math.min(a, b), x1: Math.max(a, b), y0: yOf(s.dmin) - 26, y1: Math.min(AXB, yOf(s.dmax) + 26) }; });
}
const boxPath = (bs) => bs.map((b) => `M${b.x0.toFixed(1)} ${b.y0.toFixed(1)}H${b.x1.toFixed(1)}V${b.y1.toFixed(1)}H${b.x0.toFixed(1)}Z`).join("");

function svg(F, opt) {
  opt = opt || {}; const hl = opt.hl || {};
  const coastX = X(F, F.landW), endX = X(F, PW), wx0 = Math.min(coastX, endX), wx1 = Math.max(coastX, endX);
  let s = `<defs><pattern id="${KEY}-rock" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" class="sf-hatch"/></pattern></defs>`;
  // water, depth grid (visible only in the water), sea surface
  s += `<rect x="${wx0}" y="${SEA}" width="${wx1 - wx0}" height="${PH}" class="sf-water"/>`;
  for (let d = 500; d <= MAXD; d += 500) s += `<line x1="${L}" x2="${R}" y1="${yOf(d).toFixed(1)}" y2="${yOf(d).toFixed(1)}" class="${d % 1000 ? "gmin" : "gmaj"}"/>`;
  s += `<line x1="${wx0}" x2="${wx1}" y1="${SEA}" y2="${SEA}" class="sf-sea"/>`;
  // rock: the profile down to the bottom of the drawing
  let d = F.pts.map((p, i) => `${i ? "L" : "M"}${X(F, p[0]).toFixed(1)} ${yOf(p[1]).toFixed(1)}`).join("");
  const rock = d + `L${X(F, PW)} ${AXB}L${X(F, 0)} ${AXB}Z`;
  s += `<path d="${rock}" class="sf-rock"/><path d="${rock}" class="sf-rockh"/><path d="${d}" class="sf-floor"/>`;
  // highlights after Check
  for (const t of hl.f || []) s += `<path d="${boxPath(boxes(F, t))}" class="sf-hl"/>`;
  for (const g of hl.read || []) { const x = X(F, g.u), y = yOf(g.d); s += `<line x1="${L}" x2="${x.toFixed(1)}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}" class="sf-guide"/><circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5" class="sf-gdot"/>`; }
  // depth axis (always on the left)
  s += `<line x1="${L}" x2="${L}" y1="${SEA}" y2="${AXB}" class="axis"/>`;
  for (let dd = 0; dd <= MAXD; dd += 500) { const y = yOf(dd).toFixed(1), maj = dd % 1000 === 0; s += `<line x1="${L - (maj ? 6 : 3.5)}" x2="${L}" y1="${y}" y2="${y}" class="axis"/>`; if (maj) s += `<text x="${L - 9}" y="${(+y + 5).toFixed(1)}" text-anchor="end" class="sf-tick">${dd}</text>`; }
  s += `<text transform="translate(11 ${(SEA + AXB) / 2}) rotate(-90)" text-anchor="middle" class="sf-ax">depth / m</text>`;
  // words on the drawing
  const landC = X(F, F.landW * 0.45);
  s += `<text x="${landC.toFixed(1)}" y="${SEA - 3}" text-anchor="middle" class="sf-word">land</text>`;
  const slx = Math.min(X(F, F.seaU), X(F, F.seaU + SEAW));
  s += `<text x="${slx.toFixed(1)}" y="${SEA + 16}" class="sf-word sf-halo">sea level</text>`;
  // letters on label lines
  for (const t of F.present) {
    const u = F.lead[t], x = X(F, u).toFixed(1), y = yOf(depthAt(F.pts, u)), on = (hl.f || []).includes(t);
    s += `<line x1="${x}" x2="${x}" y1="${SEA - 30}" y2="${(y - 1).toFixed(1)}" class="sf-lead${on ? " on" : ""}"/><circle cx="${x}" cy="${y.toFixed(1)}" r="2.6" class="sf-dot${on ? " on" : ""}"/>`;
    s += `<text x="${x}" y="${SEA - 35}" text-anchor="middle" class="sf-let${on ? " on" : ""}">${F.letter[t]}</text>`;
  }
  s += `<text x="${(L + R) / 2}" y="${AXB + 22}" text-anchor="middle" class="sf-note">Not to scale horizontally; the vertical scale is greatly exaggerated.</text>`;
  if (opt.tapMode) for (const t of F.present) s += `<path d="${boxPath(boxes(F, t))}" fill="transparent" data-tap="${t}"/>`;
  return `<svg viewBox="0 0 ${W} ${VH}" class="figsvg fig-${KEY}" role="img" aria-label="A cross-section of the ocean floor from a coast to the deep ocean, with lettered features and a depth scale">${s}</svg>`;
}

/* ---------- questions ---------- */
const cap = (t) => t.charAt(0).toUpperCase() + t.slice(1);
function contrast(t, F) {
  const has = (x) => F.present.includes(x);
  if (t === "shelf") return "The continental slope is the steep part beyond the edge of the shelf, not the shallow part next to the coast.";
  if (t === "slope") return "Do not confuse it with the continental shelf: that is the shallow, gentle part next to the coast, before the slope.";
  if (t === "plain") return "The abyssal plain is deep, not shallow: the shallow, flat-looking seabed next to the coast is the continental shelf.";
  if (t === "ridge") return `Do not confuse it with an ocean trench${has("trench") ? "" : " (not on this diagram)"}: a trench goes <i>down</i> below the abyssal plain, a ridge rises <i>up</i> from it.`;
  if (t === "trench") return `Do not confuse it with a mid-ocean ridge${has("ridge") ? "" : " (not on this diagram)"}: a ridge rises <i>up</i> from the abyssal plain, a trench goes <i>down</i> below it.`;
  return "A mid-ocean ridge is a mountain chain that stays under water; a volcanic island reaches above sea level.";
}
function questions(F, r) {
  const qs = [], Lt = F.letter, pres = F.present, off = F.order;
  // targets: the description/process item prefers an offshore feature; three different features
  const descT = shuffleR(r, off)[0];
  const rest = shuffleR(r, pres.filter((t) => t !== descT)), tapT = rest[0], nameT = rest[1];

  // 1. tap a named feature
  qs.push({ kind: "tap", q: `Tap the <b>${NAME[tapT]}</b> on the diagram.`, a: [tapT], ansTxt: `the ${NAME[tapT]} (${Lt[tapT]})`, labelOf: (id) => NAME[id],
    askOpt: { tapMode: true }, doneOpt: () => ({ tapMode: true }),
    why: `The ${NAME[tapT]} is ${DESC[tapT]}. On this diagram it is the part labelled <b>${Lt[tapT]}</b>. ${contrast(tapT, F)}` });

  // 2. name a lettered feature (exam form)
  const pool = PARTNER[nameT].concat(shuffleR(r, ALL.filter((t) => t !== nameT && !PARTNER[nameT].includes(t))));
  let opts = [nameT, ...pool.slice(0, 3)];
  if (!opts.slice(1).some((t) => NAME[t].length >= NAME[nameT].length)) opts[3] = ["shelf", "slope"].find((t) => t !== nameT && !opts.includes(t)) || opts[3];
  qs.push({ kind: "choice", q: `Name the feature labelled <b>${Lt[nameT]}</b>.`, options: opts.map((t) => NAME[t]), a: 0, hl: { f: [nameT] },
    why: `<b>${Lt[nameT]}</b> is the <b>${NAME[nameT]}</b>: ${DESC[nameT]}. ${contrast(nameT, F)}` });

  // 3. identify from a description or from how it forms (tap or letters)
  let dq = DESC[descT], dwhy = `The ${NAME[descT]} is ${DESC[descT]}.`;
  if (descT === "ridge") { dq = "formed where two tectonic plates move apart"; dwhy = "A mid-ocean ridge forms at a divergent boundary, where two tectonic plates move apart: magma rises into the gap and builds an underwater mountain chain."; }
  if (descT === "trench") { dq = "formed where one tectonic plate is forced beneath another"; dwhy = "An ocean trench forms at a convergent boundary, where one tectonic plate is forced beneath (subducted under) another, making a deep, narrow depression. The deepest point in the oceans, in the Mariana Trench (about 11 000 m deep), is in an ocean trench."; }
  // magma also rises at a ridge, so with a ridge on the drawing the island is described by its shape as well
  if (descT === "island") { dq = off.includes("ridge") ? DESC.island : "built up from the seabed by erupting magma"; dwhy = "A volcanic island is a volcano: erupting magma builds it up from the seabed until it rises above sea level."; }
  const stemD = /^(the |an |a )/.test(dq) ? `is ${dq}` : `was ${dq}`;
  // ridge/trench process stems: the volcanic island is never a distractor (islands occur at both kinds of boundary), so
  // when an island is drawn the letter-choice form is used and the fillers are shelf, slope and plain
  const proc = descT === "ridge" || descT === "trench";
  const tapForm = r() < 0.5 && !(proc && off.includes("island"));
  if (tapForm) {
    qs.push({ kind: "tap", q: `Tap the feature that ${stemD}.`, a: [descT], ansTxt: `the ${NAME[descT]} (${Lt[descT]})`, labelOf: (id) => NAME[id],
      askOpt: { tapMode: true }, doneOpt: () => ({ tapMode: true }), why: `${dwhy} On this diagram it is <b>${Lt[descT]}</b>. ${contrast(descT, F)}` });
  } else {
    const lp = proc ? [descT === "ridge" ? "trench" : "ridge"].filter((t) => pres.includes(t)).concat(shuffleR(r, ["shelf", "slope", "plain"]))
      : PARTNER[descT].filter((t) => pres.includes(t)).concat(shuffleR(r, pres.filter((t) => t !== descT && !PARTNER[descT].includes(t))));
    const lo = [descT, ...lp.slice(0, 3)];
    qs.push({ kind: "choice", q: `Which labelled feature ${stemD}?`, options: lo.map((t) => Lt[t]), a: 0, hl: { f: [descT] },
      why: `${dwhy} On this diagram that is <b>${Lt[descT]}</b>. ${contrast(descT, F)}` });
  }

  // 4. read the depth scale (±½ small division = ±250 m; a height from two readings ±500 m)
  const vs = ["plain"]; if (off.includes("ridge")) vs.push("crest", "height"); if (off.includes("trench")) vs.push("trench");
  const v = vs[Math.floor(r() * vs.length)];
  const plainU = F.lead.plain;
  if (v === "plain") qs.push({ kind: "num", q: "Use the depth scale. What is the depth of the <b>abyssal plain</b>?", ans: F.plainD, tol: 250, unit: "m", hl: { read: [{ u: plainU, d: F.plainD }] },
    why: `The abyssal plain is the deep, flat floor. Read across from it to the depth scale: it is at <b>${fmt(F.plainD)} m</b>. Each small division is 500 m, so answers within half a division (±250 m) are accepted.` });
  if (v === "crest") { const u = F.lead.ridge;
    qs.push({ kind: "num", q: "Use the depth scale. What is the depth of the <b>top</b> of the mid-ocean ridge?", ans: F.crest, tol: 250, unit: "m", hl: { read: [{ u, d: F.crest }] },
      why: `The top of the ridge is its shallowest point. Read across from it to the depth scale: <b>${fmt(F.crest)} m</b>. Each small division is 500 m, so answers within ±250 m are accepted.` }); }
  if (v === "height") { const u = F.lead.ridge, h = F.plainD - F.crest;
    qs.push({ kind: "num", q: "Use the depth scale. How many metres does the top of the mid-ocean ridge rise <b>above the abyssal plain</b>?", ans: h, tol: 500, unit: "m", hl: { read: [{ u, d: F.crest }, { u: plainU, d: F.plainD }] },
      why: `Abyssal plain: ${fmt(F.plainD)} m deep. Top of the ridge: ${fmt(F.crest)} m deep. Height of the ridge above the plain = ${fmt(F.plainD)} − ${fmt(F.crest)} = <b>${fmt(h)} m</b>. Two readings, each to ±250 m, so answers within ±500 m are accepted.` }); }
  if (v === "trench") { const u = F.lead.trench;
    qs.push({ kind: "num", q: "Use the depth scale. What is the depth of the <b>deepest point</b> of the ocean trench on this diagram?", ans: F.trenchD, tol: 250, unit: "m", hl: { read: [{ u, d: F.trenchD }] },
      why: `Read across from the bottom of the trench to the depth scale: <b>${fmt(F.trenchD)} m</b> (answers within ±250 m are accepted). Read the scale, not a remembered figure: about 11 000 m is the Mariana Trench, the deepest point in all the oceans, and this diagram is a made-up example.` }); }

  // 5. order going out from the coast on THIS drawing (shelf → slope → plain is the knowledge; the rest is figure-reading)
  const seq = ["shelf", "slope", "plain", ...off.slice(0, 2)];
  const ord = shuffleR(r, seq.map((_, i) => i));
  qs.push({ kind: "order", q: "Start at the coast and go out across this diagram. Put these features in the order you <b>first</b> reach them.", options: ord.map((i) => cap(NAME[seq[i]])), a: seq.map((_, i) => ord.indexOf(i)),
    ansTxt: seq.map((t, n) => `${n + 1}. ${cap(NAME[t])} (${Lt[t]})`).join("<br>"),
    why: `Every ocean margin goes <b>continental shelf → continental slope → abyssal plain</b>: the shallow shelf next to the coast, the steep slope at its edge, then the deep, flat plain. Beyond that, on this diagram, you reach the ${NAME[off[0]]} (${Lt[off[0]]}) and then the ${NAME[off[1]]} (${Lt[off[1]]}), with more abyssal plain between them.` });

  // 6. tick the true statements (one statement per idea)
  const has = (t) => off.includes(t), G = [];
  G.push([["The continental slope is steeper than the continental shelf.", true, "The slope drops steeply from the edge of the shelf to the deep floor; the shelf slopes gently."], ["The continental shelf is steeper than the continental slope.", false, "It is the other way round: the shelf slopes gently, the slope is steep."]]);
  G.push([["The continental shelf is shallower than the abyssal plain.", true, `The shelf is only a little below sea level; the abyssal plain is about ${fmt(F.plainD)} m deep.`], ["The abyssal plain is shallower than the continental shelf.", false, "The abyssal plain is the deep ocean floor; the shelf is the shallow seabed next to the coast."]]);
  G.push([["The continental shelf is next to the coast.", true, "The shelf is the shallow seabed that starts at the coast."], ["The abyssal plain is next to the coast.", false, "The shelf and then the slope lie between the coast and the abyssal plain."]]);
  if (has("ridge")) {
    G.push([["The top of the mid-ocean ridge is below sea level.", true, `The ridge is an underwater mountain chain: its top is about ${fmt(F.crest)} m deep.`], ["The top of the mid-ocean ridge is above sea level.", false, `The ridge is an underwater mountain chain: its top is still about ${fmt(F.crest)} m below sea level.`]]);
    G.push([["The mid-ocean ridge formed where two plates move apart.", true, "A mid-ocean ridge forms at a divergent boundary, where plates move apart."], ["The mid-ocean ridge formed where one plate is forced beneath another.", false, "That describes an ocean trench (convergent boundary). A ridge forms where plates move apart."]]);
  }
  if (has("trench")) {
    G.push([["The bottom of the ocean trench is deeper than the abyssal plain.", true, `The trench goes down to about ${fmt(F.trenchD)} m, below the plain at about ${fmt(F.plainD)} m.`], ["The abyssal plain is deeper than the bottom of the ocean trench.", false, `The trench (about ${fmt(F.trenchD)} m) is deeper than the plain (about ${fmt(F.plainD)} m).`]]);
    G.push([["The ocean trench formed where one plate is forced beneath another.", true, "A trench forms at a convergent boundary, where one plate is forced beneath (subducted under) another."], ["The ocean trench formed where two plates move apart.", false, "Plates moving apart form a mid-ocean ridge. A trench forms where one plate is forced beneath another."]]);
  }
  if (has("island")) {
    G.push([["The top of the volcanic island is above sea level.", true, "A volcanic island has built up from the seabed until it rises above sea level."], ["The top of the volcanic island is below sea level.", false, "It is an island, so its top rises above sea level."]]);
    G.push([["The volcanic island was built up by erupting magma.", true, "A volcanic island is a volcano: erupting magma has built it up from the seabed."], ["The volcanic island is a block of crust pushed up from below, not a volcano.", false, "A volcanic island is a volcano, built up from the seabed by erupting magma."]]);
  }
  const choice = G.map(() => Math.floor(r() * 2));
  if (choice.every((c) => c === choice[0])) { const k = Math.floor(r() * G.length); choice[k] = 1 - choice[k]; }
  const uniq = G.map((g, k) => g[choice[k]]), pick = pickMixed(r, uniq, 5);
  qs.push({ kind: "multi", q: "Tick <b>every</b> statement that is true.", options: pick.map((x) => x[0]), a: pick.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0),
    why: pick.map((x) => `${x[1] ? "✓" : "✗"} ${x[0]} — ${x[2]}`).join("<br>") });
  return qs;
}

function selfTest(F, qs) {
  const bad = [], S = (t) => F.segs.filter((s) => s.type === t);
  const xs = Object.values(F.lead).sort((a, b) => a - b); if (xs.some((x, i) => i && x - xs[i - 1] < 28)) bad.push("label lines too close");
  if (new Set(Object.values(F.letter)).size !== F.present.length) bad.push("letters");
  for (let i = 1; i < F.pts.length; i++) if (F.pts[i][0] < F.pts[i - 1][0] - 1e-9) bad.push("profile not monotone in u");
  for (const s of S("plain")) if (s.dmin !== F.plainD || s.dmax !== F.plainD) bad.push("plain not flat");
  for (const s of S("ridge")) if (s.dmin !== F.crest || s.dmax !== F.plainD) bad.push("ridge depths");
  for (const s of S("trench")) if (s.dmax !== F.trenchD || s.dmin !== F.plainD) bad.push("trench depths");
  for (const s of S("island")) if (s.dmin !== -F.islandTop) bad.push("island top");
  const sh = S("shelf")[0], sl = S("slope")[0];
  if (!(sh.dmax < 300 && sh.dmin === 0)) bad.push("shelf depth");
  if (!((sl.dmax - sl.dmin) / (sl.u1 - sl.u0) > 5 * (sh.dmax - sh.dmin) / (sh.u1 - sh.u0))) bad.push("slope not steeper");
  if (!(F.trenchD >= F.plainD + 1500 && F.crest <= F.plainD - 1500 && F.trenchD < MAXD)) bad.push("depth ranges");
  // the "sea level" words stay clear of the seabed
  for (let u = F.seaU - 10; u <= F.seaU + SEAW + 10; u += 2) if (yOf(depthAt(F.pts, u)) < SEA + 30) { bad.push("sea level words over seabed"); break; }
  if (xs.some((x) => x > F.seaU - 6 && x < F.seaU + SEAW + 6)) bad.push("label line through sea level words");
  // num answers are what the profile shows
  const n = qs.find((q) => q.kind === "num");
  if (n) { const want = /rise <b>above/.test(n.q) ? F.plainD - F.crest : /top<\/b> of the mid-ocean/.test(n.q) ? F.crest : /deepest point/.test(n.q) ? F.trenchD : F.plainD; if (n.ans !== want) bad.push("num answer");
    for (const g of n.hl.read) if (Math.abs(depthAt(F.pts, g.u) - g.d) > 1e-6) bad.push("read point not on the seabed"); }
  // order: first occurrence going out from the coast
  const o = qs.find((q) => q.kind === "order"), first = (t) => F.segs.find((s) => s.type === t).u0;
  const names = o.a.map((k) => o.options[k].toLowerCase()), types = names.map((nm) => ALL.find((t) => NAME[t] === nm));
  if (types.some((t, i) => i && first(t) <= first(types[i - 1]))) bad.push("order wrong");
  // letter choices point at the right features
  for (const q of qs.filter((q) => q.kind === "choice")) { if (/^Name/.test(q.q)) { const L0 = q.q.match(/<b>([A-F])<\/b>/)[1]; if (NAME[F.present.find((t) => F.letter[t] === L0)] !== q.options[q.a]) bad.push("name choice"); if (!q.options.some((x, i) => i !== q.a && x.length >= q.options[q.a].length)) bad.push("answer is longest"); } }
  // statements: figure facts agree with the drawing
  const m = qs.find((q) => q.kind === "multi");
  m.options.forEach((t, i) => {
    const tr = m.a.includes(i);
    if (/ridge is (above|below) sea level/.test(t) && tr !== (/below/.test(t) === F.crest > 0)) bad.push("ridge sea statement");
    if (/island is (above|below) sea level/.test(t) && tr !== /above/.test(t)) bad.push("island sea statement");
    if (/trench is deeper/.test(t) && tr !== F.trenchD > F.plainD) bad.push("trench statement");
  });
  for (const q of qs) { if (/deepest point in the oceans/.test(q.q)) bad.push("deepest stem");
    if (/plates? (move apart|is forced)/.test(q.q)) { if (q.kind === "tap" && F.order.includes("island")) bad.push("process tap with island"); if (q.kind === "choice" && q.options.includes(F.letter.island)) bad.push("island as process distractor"); }
    if (/erupting magma/.test(q.q) && F.order.includes("ridge")) bad.push("magma stem with ridge"); }
  const tapIds = F.present; for (const q of qs.filter((q) => q.kind === "tap")) if (!tapIds.includes(q.a[0])) bad.push("tap target");
  const tg = qs.filter((q) => q.kind !== "num" && q.kind !== "order" && q.kind !== "multi").map((q) => (q.kind === "tap" ? q.a[0] : q.hl.f[0]));
  if (new Set(tg).size !== tg.length) bad.push("repeated target");
  return bad;
}

export default {
  key: KEY, group: "Diagrams", name: "Ocean floor profile", topics: "Unit 1 (1.3)", thumbSeed: 5,
  blurb: "A generated cross-section of the ocean floor: find and name the continental shelf, slope, abyssal plain, mid-ocean ridge, trench and volcanic island, and read depths.",
  tips: [
    "Going out from the coast: <b>continental shelf</b> (shallow, gently sloping) → <b>continental slope</b> (steep drop) → <b>abyssal plain</b> (deep and flat).",
    "A <b>mid-ocean ridge</b> is an underwater mountain chain where two plates move apart. An <b>ocean trench</b> is a deep, narrow depression where one plate is forced beneath another.",
    "A <b>volcanic island</b> is a volcano built up from the seabed until it rises above sea level.",
    "The deepest point in the oceans is in the Mariana Trench, about 11 000 m deep.",
    "Depth increases downwards from 0 m at sea level. Read straight across to the depth scale. The vertical scale is exaggerated, so slopes look steeper than they really are.",
  ],
  ctx: () => "a cross-section of the ocean floor, from a coast out into the deep ocean",
  make, svg, axes, questions, selfTest,
  css: `.fig-seafloor .sf-water{fill:var(--surface2)}.fig-seafloor .sf-sea{stroke:currentColor;stroke-width:1.6}
.fig-seafloor .sf-rock{fill:color-mix(in srgb,var(--ink) 20%,var(--surface))}.fig-seafloor .sf-rockh{fill:url(#seafloor-rock)}.fig-seafloor .sf-hatch{stroke:var(--ink);stroke-width:.7;opacity:.3}
.fig-seafloor .sf-floor{fill:none;stroke:currentColor;stroke-width:2;stroke-linejoin:round}
.fig-seafloor .sf-tick{font-size:15px}.fig-seafloor .sf-ax{font-size:14px;font-weight:700}.fig-seafloor .sf-word{font-size:14px;font-weight:700}.fig-seafloor .sf-note{font-size:13px;opacity:.9}
.fig-seafloor .sf-halo{paint-order:stroke;stroke:var(--surface2);stroke-width:4px;stroke-linejoin:round}
.fig-seafloor .sf-lead{stroke:currentColor;stroke-width:1.3}.fig-seafloor .sf-dot{fill:currentColor}.fig-seafloor .sf-let{font-size:19px;font-weight:800}
.fig-seafloor .sf-lead.on{stroke:var(--app);stroke-width:2.2}.fig-seafloor .sf-dot.on{fill:var(--app)}.fig-seafloor .sf-let.on{fill:var(--app)}
.fig-seafloor .sf-hl{fill:color-mix(in srgb,var(--app) 30%,transparent);stroke:var(--app);stroke-width:2}
.fig-seafloor .sf-guide{stroke:var(--app);stroke-width:2.2;stroke-dasharray:6 4}.fig-seafloor .sf-gdot{fill:var(--app)}`,
};
