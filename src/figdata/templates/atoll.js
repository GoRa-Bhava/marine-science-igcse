/* ---------- ATOLL FORMATION: THE DARWIN–DANA–DALY THEORY (0697 5.7, "describe the Darwin–Dana–Daly theory of atoll
   formation"; knowledge model 5.7/LO9, with the light / zooxanthellae link from 5.7/LO4–LO5) ----------
   Three schematic panels, P, Q and R, each a cross-section through one volcanic island and its reef, with a plan view
   beside it (most seeds). The panels show the three stages in a mixed-up order:
     fringing reef — the reef is joined to the shore of the island;
     barrier reef  — the island has subsided, the reef has grown upwards, and a lagoon separates the reef from the island;
     atoll         — the island is below sea level, leaving a ring of reef around a lagoon.
   The geometry is one model: the same cone is lowered by s1 = 0 < s2 < s3 and the reef stays where it grew, so the
   lagoon opens because the shoreline moves inwards as the island sinks. Varies by seed: the island's height, width,
   asymmetry and crater; reef widths; how far it sinks; the panel order; left–right mirroring; whether plan views show.
   Not to scale (said on the figure). Forbidden content (KM 5.7/LO9) is never required: no hotspot chains, no rates,
   no glacial sea-level control (sea-level change is never used, true or false). Misconceptions used as distractors:
   the reef sinks while the island rises · coral grows downwards · the reef grows from a seamount that never surfaced ·
   waves wear the island flat with no sinking · atolls form on continental shelves · an atoll called a barrier reef. */
import { rng, shuffleR, pickMixed } from "../core.js";

const KEY = "atoll";
const W = 560, TOP = 30, PH = 146, GAP = 8;
const XL = 40, XR = 400, DTOT = 118;            // cross-section x range; cone depth from peak to u = 1
const PCX = 492, PR = 48;                        // plan view centre x, max radius
const LET = ["P", "Q", "R"];
const STG = ["fringing reef", "barrier reef", "atoll"], ART = ["a fringing reef", "a barrier reef", "an atoll"];
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const f1 = (v) => (Math.round(v * 10) / 10).toFixed(1);

/* ---------- model ---------- */
const panelTop = (p) => TOP + p * (PH + GAP);
const SLo = 38, BOTo = PH - 6;                    // sea level and bottom, as offsets from the panel top

/** depth below the peak at horizontal distance t from the centre, on one side (0 = left, 1 = right) */
function depth(F, t, side) {
  const u = Math.abs(t) / F.hw[side], e = 0.04, uu = Math.sqrt(u * u + e * e) - e;
  let d = DTOT * Math.pow(uu, F.q);
  if (F.crater) d += F.crater.d * Math.max(0, 1 - (u / F.crater.rad) ** 2);
  return d;
}
/** cone surface (y relative to sea level, + is down) at stage k */
const yRel = (F, k, t, side) => -F.Hp + F.s[k] + depth(F, t, side);
/** shoreline distance at stage k: the outermost point where the cone reaches the level (relative to sea level), or null */
function shore(F, k, side, level = 0) {
  for (let t = 260; t >= 0; t -= 0.25) if (yRel(F, k, t, side) <= level) return t;
  return null;
}
/** where a reef face starting at sea level at distance b meets the cone: outwards (dir = 1) or inwards (dir = −1) */
const SLOPE = 3.2;
function foot(F, k, b, side, dir) {
  for (let t = b; t >= 0 && t < 400; t += 0.25 * dir) if (Math.abs(t - b) * SLOPE >= yRel(F, k, t, side)) return t;
  return dir > 0 ? 400 : 0;
}

function make(seed) {
  for (let tries = 0; tries < 4000; tries++) {
    const r = rng(seed + tries * 7919 + 11);
    const F = { kind: KEY, seed };
    F.perm = shuffleR(r, [0, 1, 2]);            // perm[panel] = stage shown in that panel
    F.mirror = r() < 0.5; F.plan = r() < 0.75;
    F.cx = 220 + (r() - 0.5) * 26;
    F.Hp = 28 + r() * 7; F.q = 1.3 + r() * 0.3;
    F.hw = [150 + r() * 40, 150 + r() * 40];
    F.crater = r() < 0.4 ? { d: 3 + r() * 3, rad: 0.05 + r() * 0.03 } : null;
    const w = [30 + r() * 9, 30 + r() * 9], wr = [19 + r() * 6, 19 + r() * 6];
    F.s = [0, F.Hp * (0.58 + r() * 0.12), F.Hp + 10 + r() * 6];
    F.hs = [0, 1].map((sd) => [shore(F, 0, sd), shore(F, 1, sd), shore(F, 2, sd)]);
    if (F.hs.some((h) => h[0] == null || h[1] == null || h[2] != null)) continue;
    F.hs0t = [0, 1].map((sd) => shore(F, 0, sd, -1));
    F.xo = [0, 1].map((sd) => F.hs[sd][0] + w[sd]);
    F.xi = [0, 1].map((sd) => F.xo[sd] - wr[sd]);
    // lagoon at the barrier stage at least 28 units wide each side; island still clearly above sea level
    if ([0, 1].some((sd) => F.xi[sd] - F.hs[sd][1] < 28)) continue;
    if (F.Hp - F.s[1] < 9) continue;
    // atoll stage: the whole reef column stands on rock inside the panel; the sunken peak at least 8 below sea level
    F.fo = [0, 1, 2].map((k) => [0, 1].map((sd) => foot(F, k, F.xo[sd], sd, 1)));
    F.fi = [0, 1, 2].map((k) => [0, 1].map((sd) => (k ? foot(F, k, F.xi[sd], sd, -1) : null)));
    if ([0, 1].some((sd) => yRel(F, 2, F.fo[2][sd], sd) > BOTo - SLo - 4)) continue;
    if (Math.min(...[0, 1].map((sd) => yRel(F, 2, 0, sd))) < 8) continue;
    // island above water stays clear of the "sea level" label (right) and the panel letter (left)
    const ext = [F.cx - F.hs[0][0], F.cx + F.hs[1][0]];
    if (Math.min(...ext.map((x) => Math.min(x - XL, XR - x))) < 72) continue;
    // reef inside the cross-section with open sea beyond it on both sides
    if (F.cx - F.fo[2][0] < XL + 20 || F.cx + F.fo[2][1] > XR - 20) continue;
    return F;
  }
  throw new Error("atoll: no layout");
}

/* ---------- drawing ---------- */
const PTS = (a) => "M" + a.map(([x, y]) => `${f1(x)} ${f1(y)}`).join("L") + "Z";

/** geometry of one panel: returns path strings for rock, reef, lagoon and open sea (cross-section), and the plan view */
function panelGeo(F, p, ox) {
  const k = F.perm[p], T = panelTop(p), SL = T + SLo, BOT = T + BOTo;
  const X = (t) => { const x = F.cx + t; return ox + (F.mirror ? XL + XR - x : x); };   // t = signed distance from centre
  const side = (t) => (t < 0 ? 0 : 1);
  const Y = (t) => Math.min(SL + yRel(F, k, t, side(t)), BOT);
  const cone = (t0, t1, n = 2) => { const out = [], st = t1 > t0 ? n : -n; for (let t = t0; st > 0 ? t < t1 : t > t1; t += st) out.push([X(t), Y(t)]); out.push([X(t1), Y(t1)]); return out; };
  const g = {};
  // rock: the whole cone, clipped to the bottom of the panel
  g.rock = PTS([[X(XL - F.cx), BOT], ...cone(XL - F.cx, XR - F.cx), [X(XR - F.cx), BOT]]);
  // reef, one block each side
  const reefs = [], lag = [], sea = [];
  for (const sd of [0, 1]) {
    const sg = sd ? 1 : -1, a = k === 0 ? F.hs0t[sd] : F.xi[sd], b = F.xo[sd], top = SL - 1;
    const pts = [[X(sg * a), top], [X(sg * b), top], ...cone(sg * F.fo[k][sd], sg * (k === 0 ? a : F.fi[k][sd]))];
    reefs.push(PTS(pts));
    // open sea on this side: from the panel edge to the reef's outer face
    const edge = sd ? XR - F.cx : XL - F.cx;
    sea.push(PTS([[X(edge), SL], [X(sg * b), SL], ...cone(sg * F.fo[k][sd], edge)]));
    if (k === 1) lag.push(PTS([[X(sg * F.hs[sd][1]), SL], [X(sg * a), SL], ...cone(sg * F.fi[k][sd], sg * F.hs[sd][1])]));
  }
  if (k === 2) lag.push(PTS([[X(-F.xi[0]), SL], [X(F.xi[1]), SL], ...cone(F.fi[2][1], -F.fi[2][0])]));
  g.reef = reefs.join(""); g.lagoon = lag.join(""); g.sea = sea.join("");
  // tap areas: the same regions, each extended straight up to the top of the panel as a column, so a tap above the
  // waterline counts (the barrier-stage lagoon is only a thin wedge of water)
  const C = T + 4, tR = [], tL = [], tS = [];
  const isl = k === 2 ? null : [0, 1].map((sd) => (k === 0 ? F.hs0t[sd] : F.hs[sd][1]));
  for (const sd of [0, 1]) {
    const sg = sd ? 1 : -1, a = k === 0 ? F.hs0t[sd] : F.xi[sd], b = F.xo[sd], edge = sd ? XR - F.cx : XL - F.cx;
    tS.push(PTS([[X(edge), C], [X(sg * b), C], [X(sg * b), SL], ...cone(sg * F.fo[k][sd], edge)]));
    tR.push(PTS([[X(sg * a), C], [X(sg * b), C], [X(sg * b), SL - 1], ...cone(sg * F.fo[k][sd], sg * (k === 0 ? a : F.fi[k][sd])), [X(sg * a), SL - 1]]));
    if (k === 1) tL.push(PTS([[X(sg * F.hs[sd][1]), C], [X(sg * a), C], [X(sg * a), SL], ...cone(sg * F.fi[k][sd], sg * F.hs[sd][1])]));
  }
  if (k === 2) tL.push(PTS([[X(-F.xi[0]), C], [X(F.xi[1]), C], [X(F.xi[1]), SL], ...cone(F.fi[2][1], -F.fi[2][0])]));
  const eL = XL - F.cx, eR = XR - F.cx;
  g.tap = { sea: tS.join(""), reef: tR.join(""), lagoon: tL.join("") || null,
    rock: isl ? PTS([[X(eL), BOT], ...cone(eL, -isl[0]), [X(-isl[0]), C], [X(isl[1]), C], ...cone(isl[1], eR), [X(eR), BOT]]) : g.rock };
  g.water = `M${f1(X(XL - F.cx))} ${SL}H${f1(X(XR - F.cx))}V${BOT}H${f1(X(XL - F.cx))}Z`;
  g.SL = SL; g.T = T; g.BOT = BOT;
  // plan view: radius at angle θ blends the left and right distances, with a gentle seeded wobble
  if (F.plan) {
    const cy = T + PH / 2, kk = PR / Math.max(F.xo[0] + 4, F.xo[1] + 4), ph = (F.seed % 628) / 100;
    const polar = (dL, dR) => { const out = []; for (let i = 0; i < 64; i++) { const th = (i / 64) * 2 * Math.PI, c = Math.cos(th) * (F.mirror ? -1 : 1);
      const d = (dR * (1 + c) + dL * (1 - c)) / 2, wob = 1 + 0.06 * Math.sin(2 * th + ph) + 0.04 * Math.sin(3 * th + 2 * ph);
      out.push([PCX + d * kk * wob * Math.cos(th), cy + d * kk * wob * Math.sin(th) * 0.92]); } return PTS(out); };
    const outer = polar(F.xo[0] + 4, F.xo[1] + 4), inner = k === 0 ? polar(F.hs[0][0], F.hs[1][0]) : polar(F.xi[0], F.xi[1]);
    const isl = k === 2 ? null : polar(F.hs[0][k], F.hs[1][k]);
    const bx = PCX - 56, by = T + 6, bw = 112, bh = PH - 12;
    g.pbox = { x: bx, y: by, w: bw, h: bh };
    const box = `M${bx} ${by}H${bx + bw}V${by + bh}H${bx}Z`;
    g.pSea = box + outer; g.pReef = outer + inner; g.pIsl = isl; g.pLag = k === 0 ? null : inner + (isl || "");
  }
  return g;
}

function svg(F, opt) {
  opt = opt || {}; const hl = opt.hl || {}, tp = opt.tap || null, ox = F.plan ? 0 : 60;
  let s = `<defs><pattern id="${KEY}-reef" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" class="at-reefbg"/><line x1="0" y1="0" x2="0" y2="7" class="at-hat"/><line x1="0" y1="3.5" x2="7" y2="3.5" class="at-hat"/></pattern></defs>`;
  s += `<text x="${(XL + XR) / 2 + ox}" y="20" text-anchor="middle" class="at-head">cross-section</text>`;
  if (F.plan) s += `<text x="${PCX}" y="20" text-anchor="middle" class="at-head">plan view</text>`;
  for (let p = 0; p < 3; p++) {
    const g = panelGeo(F, p, ox), k = F.perm[p], on = (hl.panels || []).includes(p);
    s += `<rect x="6" y="${g.T}" width="${W - 12}" height="${PH}" rx="8" class="at-frame${on ? " at-on" : ""}"/>`;
    s += `<path d="${g.water}" class="at-water"/><path d="${g.rock}" class="at-rock"/><path d="${g.reef}" class="at-reef"/>`;
    s += `<line x1="${XL + ox}" x2="${XR + ox}" y1="${g.SL}" y2="${g.SL}" class="at-sl"/>`;
    s += `<text x="${XR + ox}" y="${g.SL - 5}" text-anchor="end" class="at-sm">sea level</text>`;
    s += `<text x="22" y="${g.T + 27}" text-anchor="middle" class="at-let">${LET[p]}</text>`;
    if (F.plan) {
      const b = g.pbox;
      s += `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" class="at-water"/><path d="${g.pReef}" class="at-reef" fill-rule="evenodd"/>`;
      if (g.pIsl) s += `<path d="${g.pIsl}" class="at-rock"/>`;
      s += `<rect x="${b.x}" y="${b.y}" width="${b.w}" height="${b.h}" class="at-pframe"/>`;
    }
    if ((hl.names || []).includes(p)) s += `<text x="${XL + ox + 4}" y="${g.T + 20}" class="at-name">${STG[k]}</text>`;
    // highlighted region after Check
    if (hl.region && hl.region.p === p) { const d = regionPath(g, hl.region.view, hl.region.id); if (d) s += `<path d="${d}" class="at-hl" fill-rule="evenodd"/>`; }
    // tap overlays (one panel, one view): open sea, lagoon, rock, reef — they do not overlap
    if (tp && tp.p === p) for (const id of ["sea", "lagoon", "rock", "reef"]) { const d = tp.view === "plan" ? regionPath(g, "plan", id) : g.tap[id]; if (d) s += `<path d="${d}" fill="transparent" fill-rule="evenodd" data-tap="${id}"/>`; }
  }
  // key
  const ky = panelTop(3) + 10;
  s += `<rect x="14" y="${ky}" width="26" height="16" fill="url(#${KEY}-reef)" class="at-kbox"/><text x="48" y="${ky + 13}">coral reef</text>`;
  s += `<rect x="150" y="${ky}" width="26" height="16" class="at-rock"/><text x="184" y="${ky + 13}">rock</text>`;
  s += `<rect x="242" y="${ky}" width="26" height="16" class="at-water at-kbox"/><text x="276" y="${ky + 13}">sea water</text>`;
  s += `<text x="${W - 10}" y="${ky + 13}" text-anchor="end" class="at-sm">not to scale</text>`;
  return `<svg viewBox="0 0 ${W} ${ky + 24}" class="figsvg fig-${KEY}" role="img" aria-label="Three panels, P, Q and R, each showing a cross-section of a volcanic island and its coral reef${F.plan ? ", with a plan view" : ""}">${s}</svg>`;
}
function regionPath(g, view, id) {
  if (view === "plan") return { sea: g.pSea, lagoon: g.pLag, rock: g.pIsl, reef: g.pReef }[id] || null;
  return { sea: g.sea, lagoon: g.lagoon || null, rock: g.rock, reef: g.reef }[id] || null;
}

/* ---------- questions ---------- */
const MISC = ["the reef has grown downwards, away from the light", "the reef has sunk below sea level with the island"];
const RIGHT = ["the reef is joined to the island's shore", "a lagoon lies between the reef and the island", "no island is left inside the ring of reef"];
const WHYSTAGE = [
  "the reef is joined directly to the shore of the volcanic island, with no lagoon",
  "a lagoon separates the reef from what is left of the island, which is still above sea level",
  "the island is below sea level, leaving a ring of reef around a lagoon, with no island in the middle",
];
const UP = [
  ["To stay in shallow water, where there is enough light for the zooxanthellae", true],
  ["To stay in low-pressure water near the surface, which the polyps need to live", false],
  ["To keep the reef above the waves so the polyps can take in oxygen from the air", false],
  ["To get away from the parrot fish and starfish that live on the deep seabed", false],
];
const PROC = [
  ["The reef first grows as a fringing reef around the edge of a volcanic island.", true, "the theory starts with a fringing reef joined to the shore of a volcanic island"],
  ["The volcanic island slowly sinks (subsides).", true, "subsidence of the island is the key process"],
  ["The coral grows upwards as the island sinks.", true, "upward growth keeps the reef in shallow, light water"],
  ["A lagoon opens up between the reef and the island, then widens.", true, "as the island sinks its shoreline moves inwards, away from the reef"],
  ["The island ends up below sea level, leaving a ring of reef around a lagoon.", true, "that ring of reef is the atoll"],
  ["The island is worn down (eroded) as it sinks.", true, "erosion lowers the island as well as subsidence"],
  ["The reef sinks while the island rises.", false, "it is the other way round: the island sinks and the reef grows upwards"],
  ["The coral grows downwards to stay attached to the sinking island.", false, "coral grows upwards, towards the light"],
  ["The reef grows up from an undersea mountain whose top was below sea level from the start.", false, "the reef starts around an island that was above sea level"],
  ["Waves wear the island flat while it stays at the same height.", false, "the island sinks; erosion alone does not explain an atoll"],
  ["The reef forms on a continental shelf, not around a volcanic island.", false, "atolls form around volcanic islands in the open ocean"],
];

function questions(F, r) {
  const qs = [], pOf = (k) => F.perm.indexOf(k), Lp = (p) => `panel ${LET[p]}`;
  const allNames = { names: [0, 1, 2] };
  let q1p;
  // 1. identify a stage (two forms)
  if (r() < 0.5) {
    const p = pOf(r() < 0.6 ? 2 : 1), k = F.perm[p]; q1p = p;
    qs.push({ kind: "choice", q: `Which stage of atoll formation is shown in <b>panel ${LET[p]}</b>?`, options: [ART[k], ...ART.filter((_, j) => j !== k)], a: 0, hl: { panels: [p], names: [p] },
      why: `Panel ${LET[p]} shows <b>${ART[k]}</b>: ${WHYSTAGE[k]}.${k === 2 ? " Do not call this a barrier reef: a barrier reef still has the island inside its lagoon." : " It is not an atoll: there is still an island inside the lagoon."}` });
  } else {
    const k = Math.floor(r() * 3), p = pOf(k); q1p = p;
    qs.push({ kind: "choice", q: `Which panel shows <b>${ART[k]}</b>?`, options: [Lp(p), ...[0, 1, 2].filter((j) => j !== p).map(Lp)].map(cap), a: 0, hl: { panels: [p], names: [p] },
      why: `${cap(ART[k])} is the stage where ${WHYSTAGE[k]}. That is <b>panel ${LET[p]}</b>.` });
  }
  // 2. order the panels (the order IS the knowledge)  — asked straight after the stage question, before any stem that names a stage
  const ord = [pOf(0), pOf(1), pOf(2)];
  qs.push({ kind: "order", q: "The panels show three stages of the <b>Darwin–Dana–Daly theory</b> of atoll formation, in a mixed-up order. Put the panels in the order they happen, earliest first.",
    options: ["panel P", "panel Q", "panel R"], a: ord, hl: allNames,
    why: `<b>${LET[ord[0]]}</b> (fringing reef: the reef is joined to the shore) → <b>${LET[ord[1]]}</b> (barrier reef: a lagoon separates the reef from the island) → <b>${LET[ord[2]]}</b> (atoll: the island is below sea level, leaving a ring of reef around a lagoon).` });
  // 3. tap the lagoon (barrier or atoll panel; cross-section or plan view)
  const lp = pOf(r() < 0.5 ? 1 : 2), lk = F.perm[lp], view = F.plan && r() < 0.45 ? "plan" : "x";
  qs.push({ kind: "tap", q: `${view === "plan" ? `On the <b>plan view</b> of <b>panel ${LET[lp]}</b>` : `On the cross-section in <b>panel ${LET[lp]}</b>`}, tap the <b>lagoon</b>.`, a: ["lagoon"], ansTxt: "the lagoon",
    labelOf: () => "the area you tapped", hint: "Tap one area of the panel.",
    askOpt: { tap: { p: lp, view } }, doneOpt: () => ({ tap: { p: lp, view }, hl: { panels: [lp], region: { p: lp, view, id: "lagoon" } } }),
    why: lk === 1 ? `The lagoon is the sheltered water <b>between the reef and the island</b>. The water outside the reef is the open sea.`
      : `In an atoll the lagoon is the water <b>enclosed by the ring of reef</b>, above the sunken island. The water outside the ring is the open sea.` });
  const ap = pOf(2);
  // 5. tick the processes in the theory
  const pick = pickMixed(r, PROC, 5);
  qs.push({ kind: "multi", q: "Tick <b>every</b> statement that is part of the Darwin–Dana–Daly theory of atoll formation.", options: pick.map((x) => x[0]), a: pick.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0), hl: allNames,
    why: pick.map((x) => `${x[1] ? "✓" : "✗"} ${x[0]} — ${x[2]}.`).join("<br>") });
  // 6. why the coral grows upwards
  qs.push({ kind: "choice", q: "As the island sinks, the coral keeps growing upwards. Why does the reef need to stay near the surface?", options: UP.map((x) => x[0]), a: 0, hl: allNames,
    why: "Coral polyps have <b>zooxanthellae</b> in their tissues. These photosynthesise and pass sugars to the polyp, so they need <b>light</b>, and light is only strong enough in <b>shallow water</b>. Coral that grows upwards as fast as the island sinks stays in the light; coral left in deep water would die. Pressure, air and predators on the seabed are not the reason." });
  // 7. a student's wrong label (the commonest: an atoll called a barrier reef). Never the panel of question 1, and it asks
  // only for the feature, since the order question's feedback has already named every stage. Options: the true stage's
  // feature (key), the feature the student's label would need, the third stage's feature and a misconception; the
  // misconception is longer than any feature, so the key is never the longest.
  let X, sl;
  if (ap !== q1p && r() < 0.6) { X = ap; sl = 1; } else { const ps = [0, 1, 2].filter((p) => p !== q1p); X = ps[Math.floor(r() * 2)]; const kx = F.perm[X], ok = [0, 1, 2].filter((j) => j !== kx); sl = ok[Math.floor(r() * 2)]; }
  const c = F.perm[X], o = [0, 1, 2].find((j) => j !== c && j !== sl);
  qs.push({ kind: "choice", q: `A student labels panel ${LET[X]} as “${STG[sl]}”. Which feature of <b>panel ${LET[X]}</b> shows that the student is wrong?`,
    options: [RIGHT[c], RIGHT[sl], RIGHT[o], MISC[Math.floor(r() * MISC.length)]].map(cap), a: 0, hl: { panels: [X], names: [X] },
    why: `Panel ${LET[X]} is <b>${ART[c]}</b>: ${RIGHT[c]}.${c === 2 && sl === 1 ? " Calling an atoll a barrier reef is a common slip: a barrier reef still has an island in its lagoon." : ""} ${cap(ART[sl])} would need ${RIGHT[sl].replace(/^the reef is joined/, "the reef to be joined").replace(/^a lagoon lies/, "a lagoon to lie").replace(/^no island is left/, "no island to be left")}, and that is not what panel ${LET[X]} shows. In every stage the reef stays at sea level, because the coral grows upwards.` });
  return qs;
}

function selfTest(F, qs) {
  const bad = [];
  if (new Set(F.perm).size !== 3) bad.push("perm");
  for (const sd of [0, 1]) {
    if (!(F.hs[sd][0] > F.hs[sd][1])) bad.push("shore did not move in");
    if (F.xi[sd] - F.hs[sd][1] < 28 - 1e-9) bad.push("lagoon too narrow");
    if (!(F.xi[sd] > F.hs[sd][0])) bad.push("barrier reef not offshore of the old shore");
    if (yRel(F, 0, F.hs[sd][0] + 0.5, sd) <= 0) bad.push("shore solve");
  }
  if (F.hs.some((h) => h[2] != null)) bad.push("island above water at the atoll stage");
  const q7 = qs[qs.length - 1], m1 = qs[0].q.match(/panel ([PQR])/), m7 = q7.q.match(/panel ([PQR])/);
  if (!/student labels/.test(q7.q)) bad.push("q7 missing"); else if (m1 && m1[1] === m7[1]) bad.push("q7 reuses the q1 panel");
  if (!/student labels/.test(q7.q) || q7.options.length !== 4) bad.push("q7 options");
  for (let p = 0; p < 3; p++) for (const id of ["sea", "reef", "rock"]) if (!svg(F, { tap: { p, view: "x" } }).includes(`data-tap="${id}"`)) bad.push("tap column " + id);
  const o = qs.find((q) => q.kind === "order"); if (o.a.some((p, n) => F.perm[p] !== n)) bad.push("order key");
  for (const q of qs) if (q.kind === "choice") {
    if (new Set(q.options).size !== q.options.length) bad.push("dup options");
    const L = q.options.map((x) => x.length); if (L.length > 3 && L[0] >= Math.max(...L.slice(1)) && L[0] > Math.min(...L)) bad.push("key is longest: " + q.q.slice(0, 40));
  }
  const m = qs.find((q) => q.kind === "multi"); m.options.forEach((t, i) => { const st = PROC.find((x) => x[0] === t); if (!st || st[1] !== m.a.includes(i)) bad.push("multi truth"); });
  // tap answers are drawn in the asked panel and view
  for (const q of qs.filter((q) => q.kind === "tap")) { const sv = svg(F, q.askOpt); if (!sv.includes(`data-tap="${q.a[0]}"`)) bad.push("tap target missing"); if ((sv.match(/data-tap=/g) || []).length < 3) bad.push("few taps"); }
  return bad;
}

export default {
  key: KEY, group: "Diagrams", name: "Atoll formation", topics: "Unit 5 (5.7)", thumbSeed: 3,
  blurb: "Three stages of the Darwin–Dana–Daly theory, in a mixed-up order: name each stage, find the lagoon and put the stages in sequence.",
  tips: ["Fringing reef: the reef is joined to the shore of a volcanic island.", "Barrier reef: the island has sunk (subsided) and the coral has grown upwards, so a lagoon separates the reef from the island.", "Atoll: the island is below sea level, leaving a ring of reef around a lagoon. An atoll is not a barrier reef: there is no island in the middle.", "The coral grows upwards as the island sinks, to stay in shallow, light water for its zooxanthellae."],
  ctx: () => "three stages of atoll formation (P, Q and R), not in order",
  make, svg, questions, selfTest,
  css: `.fig-atoll .at-head{font-size:13px;font-weight:700;opacity:.85}.fig-atoll .at-sm{font-size:12.5px;opacity:.9}.fig-atoll .at-let{font-size:20px;font-weight:800}
.fig-atoll .at-frame{fill:var(--surface);stroke:var(--line);stroke-width:1}.fig-atoll .at-frame.at-on{stroke:var(--app);stroke-width:3}
.fig-atoll .at-water{fill:color-mix(in srgb,var(--ink) 11%,var(--surface))}.fig-atoll .at-kbox{stroke:currentColor;stroke-width:1}.fig-atoll .at-pframe{fill:none;stroke:currentColor;stroke-width:1}
.fig-atoll .at-rock{fill:color-mix(in srgb,var(--ink) 32%,var(--surface));stroke:currentColor;stroke-width:1.3}
.fig-atoll .at-reef{fill:url(#atoll-reef);stroke:currentColor;stroke-width:1.3}.fig-atoll .at-reefbg{fill:var(--surface)}.fig-atoll .at-hat{stroke:currentColor;stroke-width:1}
.fig-atoll .at-sl{stroke:currentColor;stroke-width:1.6}.fig-atoll .at-name{font-size:14px;font-weight:800;fill:var(--app);paint-order:stroke;stroke:var(--surface);stroke-width:4px;stroke-linejoin:round}
.fig-atoll .at-hl{fill:color-mix(in srgb,var(--app) 45%,transparent);stroke:var(--app);stroke-width:2.5}`,
};
