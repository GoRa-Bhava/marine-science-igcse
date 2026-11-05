/* ---------- AQUACULTURE SYSTEMS FROM A DIAGRAM (0697 6.4/LO4; 6.4/LO2, 6.4/LO5) ----------
   Seeded schematic side views of fish farms: an OPEN system (net cages with floats and cover nets, moored in a coastal
   sea, with currents, wild fish, a seal and seabirds) and/or a CLOSED system (tanks on land; water drains to a filter,
   a pump returns it to the tanks, an oxygen supply bubbles gas into the tanks, and an outlet pipe takes material from
   the filter to a separate container). One or both panels per run; land side, flow direction, number of cages (1–3)
   and tanks (2–3), sizes and which parts carry letters all vary. No words name the parts: only letters on label lines.
   Questions: which system is closed (or what type the farm is), with the reason (KM6 6.4/LO4 misconceptions: "closed
   because the net holds the fish / the bay is enclosed"); name a lettered part (×2); tap a part by its job (where waste
   passes into the sea; what stops seabirds; what moves the water; what supplies oxygen); why the filter is needed (or
   why the cages are covered with netting, s24: netting against predators); tick the true advantages/disadvantages of
   one system (escapes and disease spread from open cages; cost, energy and control of conditions in closed tanks).
   KM6 forbidden: parameter values, sea lice/wrasse by name, antibiotic-resistance detail — none is used. No numbers at all.
   Feedback is written so that no explanation gives away the answer to a later question in the same run. */
import { rng, pickR, shuffleR, pickMixed } from "../core.js";

const KEY = "aquafarm";
const W = 560, PH = 240, GAPY = 34, TOPT = 24;
const n1 = (v) => Math.round(v * 10) / 10;

const NAME = { net: "net cage", floats: "floats", cover: "cover net", mooring: "mooring line", anchor: "anchor block",
  tank: "tank", pump: "pump", filter: "filter", outlet: "outlet pipe", oxygen: "oxygen supply" };
const OPEN_PARTS = ["net", "floats", "cover", "mooring", "anchor"], CLOSED_PARTS = ["tank", "pump", "filter", "outlet", "oxygen"];
const panelOf = (id) => (OPEN_PARTS.includes(id) ? "open" : "closed");
// structure-only descriptions (they never locate or explain another part)
const DESCR = {
  net: "the bag of netting that hangs down into the water and holds the farmed fish",
  floats: "the floating ring at the surface that keeps the cage afloat",
  cover: "the netting stretched over the top of the cage",
  mooring: "the line that runs down to the seabed and holds the cage in place against currents and waves",
  anchor: "the heavy block on the seabed that holds the farm in place",
  pump: "the round unit with blades (an impeller) that pushes the water along the pipes",
  filter: "the box of filter material that the water from the tanks flows through",
  outlet: "the pipe that leads out of the system: its arrow points away from the tanks, into a separate container",
};
const PARTNER = { net: ["cover", "floats"], floats: ["net", "cover"], cover: ["net", "floats"], mooring: ["anchor", "floats"], anchor: ["mooring", "net"],
  pump: ["filter", "tank"], filter: ["pump", "outlet"], outlet: ["filter", "oxygen"] };

/* ---------- geometry helpers ---------- */
const pth = (pts, close) => "M" + pts.map(([x, y]) => `${n1(x)} ${n1(y)}`).join("L") + (close ? "Z" : "");
const poly = (pts) => { let a = 0; for (let i = 0; i < pts.length; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length]; a += x1 * y2 - x2 * y1; } return pth(a < 0 ? pts.slice().reverse() : pts, true); };
const rectPts = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
const circPts = (cx, cy, rr) => Array.from({ length: 16 }, (_, i) => [cx + rr * Math.cos((i * Math.PI) / 8), cy + rr * Math.sin((i * Math.PI) / 8)]);
function bandPts(x1, y1, x2, y2, w) {
  const L = Math.hypot(x2 - x1, y2 - y1) || 1, nx = (-(y2 - y1) / L) * w / 2, ny = ((x2 - x1) / L) * w / 2;
  return [[x1 - nx, y1 - ny], [x2 - nx, y2 - ny], [x2 + nx, y2 + ny], [x1 + nx, y1 + ny]];
}
function inPoly(p, pts) {
  let c = false;
  for (let i = 0, j = pts.length - 1; i < pts.length; j = i++) { const [xi, yi] = pts[i], [xj, yj] = pts[j]; if ((yi > p[1]) !== (yj > p[1]) && p[0] < ((xj - xi) * (p[1] - yi)) / (yj - yi) + xi) c = !c; }
  return c;
}
function segX(a, b, c, d) {
  const o = (p, q, r) => Math.sign((q[0] - p[0]) * (r[1] - p[1]) - (q[1] - p[1]) * (r[0] - p[0]));
  return o(a, b, c) * o(a, b, d) < 0 && o(c, d, a) * o(c, d, b) < 0;
}
const bbox = (pts) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };
const boxHit = (A, B, m = 0) => A[0] - m < B[2] && A[2] + m > B[0] && A[1] - m < B[3] && A[3] + m > B[1];
function segNearBox(a, b, B, m) { for (let i = 0; i <= 30; i++) { const t = i / 30, x = a[0] + (b[0] - a[0]) * t, y = a[1] + (b[1] - a[1]) * t; if (x > B[0] - m && x < B[2] + m && y > B[1] - m && y < B[3] + m) return true; } return false; }

/* ---------- letters on label lines ----------
   pts: [{id, x, y, side}] (side "top": the letter sits in the strip at the top of the panel; "bottom": just below the point).
   Returns letter positions, or null if a leader would pass through another part or cross another leader. */
function placeLetters(pts, obst) {
  const top = pts.filter((p) => p.side === "top").sort((a, b) => a.x - b.x), out = {};
  const xs = top.map((p) => p.x);
  for (let it = 0; it < 30; it++) {
    for (let i = 1; i < xs.length; i++) if (xs[i] < xs[i - 1] + 32) xs[i] = xs[i - 1] + 32;
    for (let i = xs.length - 1; i >= 0; i--) { const hi = i === xs.length - 1 ? 544 : xs[i + 1] - 32; if (xs[i] > hi) xs[i] = hi; if (xs[i] < 16) xs[i] = 16; }
  }
  for (let i = 1; i < xs.length; i++) if (xs[i] - xs[i - 1] < 31.9) return null;
  top.forEach((p, i) => { if (Math.abs(xs[i] - p.x) > 46) out.bad = true; out[p.id] = { lx: xs[i], ly: 21, ax: xs[i], ay: 28, px: p.x, py: p.y }; });
  for (const p of pts.filter((q) => q.side === "bottom")) out[p.id] = { lx: p.x, ly: p.y + 36, ax: p.x, ay: p.y + 21, px: p.x, py: p.y + 2 };
  if (out.bad) return null;
  const ids = pts.map((p) => p.id);
  for (const id of ids) {
    const L = out[id], len = Math.hypot(L.px - L.ax, L.py - L.ay);
    for (let i = 0; i <= 50; i++) {
      const t = (i / 50) * Math.max(0, 1 - 8 / len), q = [L.ax + (L.px - L.ax) * t, L.ay + (L.py - L.ay) * t];
      for (const o of obst) if (o.id !== id && inPoly(q, o.pts)) return null;
    }
  }
  for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) { const A = out[ids[i]], B = out[ids[j]]; if (segX([A.ax, A.ay], [A.px, A.py], [B.ax, B.ay], [B.px, B.py])) return null; }
  return out;
}

/* ---------- open system (unmirrored: land on the left, open sea to the right) ---------- */
function buildOpen(r, lettered) {
  const S = n1(90 + r() * 8), B = n1(222 + r() * 6), landW = n1(54 + r() * 20), yL = n1(S - 24 - r() * 8);
  const slopeEnd = landW + 70;
  const bedY = (x) => (x <= landW ? S : x >= slopeEnd ? B : S + ((x - landW) / 70) * (B - S));
  const nC = pickR(r, [1, 2, 2, 3, 3]);
  const cw = n1(nC === 1 ? 84 + r() * 12 : nC === 2 ? 70 + r() * 12 : 60 + r() * 6);
  const gap = n1(nC === 3 ? 24 + r() * 6 : 28 + r() * 14), md = n1(42 + r() * 10);
  const cd = n1(Math.min(B - S - 46, 66 + r() * 18));
  const span = nC * cw + (nC - 1) * gap + 2 * md, lo = slopeEnd + 26, hi = 518 - span;
  if (hi < lo) return null;
  const ax0 = n1(lo + r() * (hi - lo));
  const cages = []; for (let k = 0; k < nC; k++) { const a = n1(ax0 + md + k * (cw + gap)); cages.push({ a, b: n1(a + cw), m: n1(a + cw / 2) }); }
  const c0 = cages[0], cL = cages[nC - 1];
  const anchors = [{ x: n1(c0.a - md), y: B }, { x: n1(cL.b + md), y: B }];
  const moors = [[c0.a + 2, S + 4, anchors[0].x, B - 11], [cL.b - 2, S + 4, anchors[1].x, B - 11]];
  const cur = r() < 0.5 ? 1 : -1;
  // tap shapes
  const taps = {
    cover: cages.map((c) => [[c.a + 7, S - 6], [c.m - 18, S - 48], [c.m + 18, S - 48], [c.b - 7, S - 6]]),
    floats: cages.map((c) => rectPts(c.a - 5, S - 9, c.b + 5, S + 13)),
    net: cages.map((c) => [[c.a + 4, S + 13], [c.b - 4, S + 13], [c.b - 9, S + cd + 8], [c.a + 9, S + cd + 8]]),
    mooring: moors.map(([x1, y1, x2, y2]) => { const t0 = 0.24, t1 = 0.84; return bandPts(x1 + (x2 - x1) * t0, y1 + (y2 - y1) * t0, x1 + (x2 - x1) * t1, y1 + (y2 - y1) * t1, 22); }),
    anchor: anchors.map((A) => rectPts(A.x - 16, A.y - 21, A.x + 16, A.y + 4)),
  };
  // label points: one cage (or one end) per part
  const kc = Math.floor(r() * nC), ck = cages[kc], side = r() < 0.5 ? 0 : 1;
  const pts = {
    cover: { x: n1(ck.m + (ck.b - 7 - ck.m) * 0.45), y: n1(S - 4 - 26 * 0.55), side: "top" },
    floats: { x: n1(side ? cages[Math.floor(r() * nC)].b + 1 : cages[Math.floor(r() * nC)].a - 1), y: S + 1, side: "top" },
    net: { x: cages[Math.floor(r() * nC)].m, y: n1(S + cd), side: "bottom" },
    mooring: (() => { const M = moors[side ? 0 : 1]; return { x: n1((M[0] + M[2]) / 2), y: n1((M[1] + M[3]) / 2), side: "top" }; })(),
    anchor: (() => { const A = anchors[r() < 0.5 ? 0 : 1], o = A === anchors[0] ? -7 : 7; return { x: n1(A.x + o), y: n1(A.y - 11), side: "top" }; })(),
  };
  const obst = [];
  for (const id of OPEN_PARTS) for (const p of taps[id]) obst.push({ id, pts: p });
  const L = placeLetters(lettered.map((id) => ({ id, ...pts[id] })), obst);
  if (!L) return null;
  // keep-out list for decorations
  const keep = obst.map((o) => bbox(o.pts)), segs = Object.values(L).map((q) => [[q.ax, q.ay], [q.px, q.py]]), lets = Object.values(L).map((q) => [q.lx - 12, q.ly - 18, q.lx + 12, q.ly + 5]);
  const free = (B0, m = 6) => !keep.some((k) => boxHit(B0, k, m)) && !segs.some(([a, b]) => segNearBox(a, b, B0, m)) && !lets.some((k) => boxHit(B0, k, m));
  const deco = { birds: [], fish: [], seal: null, arrows: [] };
  const take = (B0) => { keep.push(B0); return B0; };
  for (let t = 0; t < 200 && deco.birds.length < 1 + (r() < 0.5 ? 1 : 0); t++) { const x = n1(slopeEnd + r() * (540 - slopeEnd)), y = n1(38 + r() * (S - 82)); const B0 = [x - 11, y - 8, x + 11, y + 2]; if (free(B0, 4)) { take(B0); deco.birds.push([x, y]); } }
  for (let t = 0; t < 300 && !deco.seal; t++) { const x = n1(slopeEnd + 10 + r() * (500 - slopeEnd)), y = n1(S + 26 + r() * 50); const B0 = [x - 10, y - 10, x + 42, y + 10]; if (y + 14 < bedY(x) && y + 14 < bedY(x + 42) && free(B0, 4)) { take(B0); deco.seal = [x, y, cur]; } }
  for (let t = 0; t < 200 && deco.arrows.length < 2; t++) { const x = n1(slopeEnd + r() * (500 - slopeEnd)), y = n1(S + 18 + r() * (B - S - 50)); const B0 = [x - 4, y - 7, x + 48, y + 7]; if (y + 14 < bedY(x) && free(B0, 4)) { take(B0); deco.arrows.push([x, y]); } }
  if (deco.arrows.length < 2) return null;
  for (let t = 0; t < 300 && deco.fish.length < 3; t++) { const x = n1(slopeEnd + 10 + r() * (520 - slopeEnd)), y = n1(S + 18 + r() * (B - S - 40)); const B0 = [x - 11, y - 6, x + 11, y + 6]; if (y + 10 < bedY(x) && free(B0, 3)) { take(B0); deco.fish.push([x, y, r() < 0.5 ? 1 : -1]); } }
  // the word "current" goes above the first arrow
  const cfree = [deco.arrows[0][0] - 2, deco.arrows[0][1] - 24, deco.arrows[0][0] + 56, deco.arrows[0][1] - 8];
  deco.cword = free(cfree, 1) ? 0 : 1;
  // farmed fish inside the nets, waste plume (drawn only when asked for)
  const inFish = cages.map((c) => { const fs = []; for (let t = 0; t < 80 && fs.length < 3; t++) { const x = c.a + 18 + r() * (cw - 36), y = S + 22 + r() * (cd - 40); if (fs.every((f) => Math.abs(f[0] - x) > 20 || Math.abs(f[1] - y) > 11)) fs.push([n1(x), n1(y), r() < 0.5 ? 1 : -1]); } return fs; });
  const waste = cages.map((c) => Array.from({ length: 10 }, (_, i) => { const t = (i + 0.5) / 10; return [n1(c.m + cur * (10 + 40 * t) + (r() * 2 - 1) * 9), n1(S + cd + 6 + t * (B - S - cd - 16) + (r() * 2 - 1) * 3)]; }));
  return { kind: "open", S, B, landW, yL, slopeEnd, cages, cw, cd, md, anchors, moors, cur, taps, L, deco, inFish, waste };
}

/* ---------- closed system (unmirrored: oxygen cylinder, tanks, filter with the pump above it, waste container) ---------- */
function buildClosed(r, lettered) {
  const G = n1(212 + r() * 6), LG = 16, TB = G - LG;
  const nT = r() < 0.5 ? 2 : 3, tw = n1(nT === 2 ? 74 + r() * 12 : 62 + r() * 10), tg = n1(18 + r() * 10), th = n1(68 + r() * 16);
  const TT = n1(TB - th), yR = n1(TT - 26);
  const cx0 = n1(10 + r() * 6), x0 = n1(cx0 + 20 + 24 + r() * 8);
  const tanks = []; for (let k = 0; k < nT; k++) { const a = n1(x0 + k * (tw + tg)); tanks.push({ a, b: n1(a + tw) }); }
  const tEnd = tanks[nT - 1].b, fx = n1(tEnd + 34 + r() * 10), fw = n1(60 + r() * 6), fh = n1(62 + r() * 10), FT = n1(G - fh);
  const px = n1(fx + fw * 0.4), py = yR, dx = n1(fx + fw + 32 + r() * 6), dw = 30, oy = n1(G - 14);
  if (dx + dw > 550 || FT - (py + 15) < 16) return null;
  const hoseY = n1(G - 70), diffY = n1(TB - 10);
  // pipe segments (for drawing and as leader obstacles)
  const drops = tanks.map((t) => n1(t.a + tw * 0.65)), drains = tanks.map((t) => n1(t.a + tw * 0.32));
  const pipes = {
    ret: [[px - 15, yR], [drops[0], yR]],
    drops: drops.map((x) => [[x, yR], [x, TT + 6]]),
    drains: drains.map((x) => [[x, TB], [x, G - 7]]),
    drain: [[drains[0], G - 7], [fx, G - 7]],
    clean: [[px, FT], [px, py + 15]],
    out: [[fx + fw, oy], [dx, oy]],
    hose: [[cx0 + 10, G - 62], [cx0 + 10, hoseY], [x0 - 8, hoseY], [x0 - 8, diffY], [tanks[nT - 1].a + tw / 2, diffY]],
  };
  const taps = {
    tank: tanks.map((t) => rectPts(t.a, TT, t.b, TB)),
    pump: [circPts(px, py, 24)],
    filter: [rectPts(fx, FT, fx + fw, G)],
    outlet: [rectPts(fx + fw + 1, oy - 11, dx - 1, oy + 11)],
    oxygen: [rectPts(cx0 - 8, G - 72, cx0 + 28, G)],
  };
  const pts = {
    tank: { x: n1(tanks[0].a + 10), y: n1(TT + 16), side: "top" },
    pump: { x: px, y: n1(py - 15), side: "top" },
    filter: { x: n1(fx + fw - 9), y: n1(FT + 12), side: "top" },
    outlet: { x: n1((fx + fw + dx) / 2), y: oy, side: "top" },
    oxygen: { x: n1(cx0 + 3), y: n1(G - 44), side: "top" },
  };
  const obst = [];
  for (const id of CLOSED_PARTS) for (const p of taps[id]) obst.push({ id, pts: p });
  const segList = [pipes.ret, ...pipes.drops, pipes.clean];
  for (let i = 0; i < pipes.hose.length - 1; i++) segList.push([pipes.hose[i], pipes.hose[i + 1]]);
  for (const [a, b] of segList) obst.push({ id: null, pts: bandPts(a[0], a[1], b[0], b[1], 8) });
  const L = placeLetters(lettered.map((id) => ({ id, ...pts[id] })), obst);
  if (!L) return null;
  const tFish = tanks.map((t) => { const fs = []; for (let q = 0; q < 80 && fs.length < 2; q++) { const x = t.a + 12 + r() * (tw - 24), y = TT + 24 + r() * (th - 46); if (Math.abs(x - (t.a + tw / 2)) < 10) continue; if (fs.every((f) => Math.abs(f[0] - x) > 22 || Math.abs(f[1] - y) > 12)) fs.push([n1(x), n1(y), r() < 0.5 ? 1 : -1]); } return fs; });
  return { kind: "closed", G, TB, TT, th, yR, tanks, tw, cx0, x0, fx, fw, fh, FT, px, py, dx, dw, oy, hoseY, diffY, drops, drains, pipes, taps, L, tFish };
}

/* ---------- generation ---------- */
function make(seed) {
  const r0 = rng(seed ^ 0xa9a7a3);
  const roll = r0(), mode = roll < 0.55 ? "both" : roll < 0.775 ? "open" : "closed";
  let plan;
  if (mode === "both") {
    const on = pickR(r0, OPEN_PARTS.filter((p) => p !== "cover")), cn = pickR(r0, ["pump", "filter", "outlet"]);
    const tap = pickR(r0, ["net", "cover", "pump", "oxygen"].filter((t) => t !== on && t !== cn));
    const multi = tap === "oxygen" ? "open" : r0() < 0.5 ? "open" : "closed";
    plan = { mode, names: r0() < 0.5 ? [on, cn] : [cn, on], tap, q4: "filter", multi };
  } else if (mode === "open") {
    plan = { mode, names: shuffleR(r0, ["floats", pickR(r0, ["mooring", "anchor"])]), tap: "net", q4: "cover", multi: "open" };
  } else {
    const tap = r0() < 0.5 ? "pump" : "oxygen";
    plan = { mode, names: shuffleR(r0, ["pump", "filter", "outlet"].filter((t) => t !== tap)).slice(0, 2), tap, q4: "filter", multi: "closed" };
  }
  const order = mode === "both" ? (r0() < 0.5 ? ["open", "closed"] : ["closed", "open"]) : [mode];
  const per = mode === "both" ? 3 : 4;
  for (let tries = 0; tries < 3000; tries++) {
    const r = rng(seed + tries * 7919 + 29);
    const lettered = {}, panels = {};
    for (const k of order) {
      const must = plan.names.filter((n) => panelOf(n) === k);
      const rest = shuffleR(r, (k === "open" ? OPEN_PARTS : CLOSED_PARTS).filter((p) => !must.includes(p)));
      lettered[k] = must.concat(rest.slice(0, per - must.length));
      panels[k] = k === "open" ? buildOpen(r, lettered[k]) : buildClosed(r, lettered[k]);
    }
    if (order.some((k) => !panels[k])) continue;
    const all = order.flatMap((k) => lettered[k]), lets = shuffleR(r, "ABCDEFGH".slice(0, all.length).split("")), letter = {};
    all.forEach((id, i) => (letter[id] = lets[i]));
    const mir = { open: r() < 0.5, closed: r() < 0.5 };
    return { kind: KEY, seed, mode, order, plan, panels, lettered, letter, mir, wasteAlways: plan.tap !== "net" };
  }
  throw new Error("aquafarm: no layout");
}

/* ---------- drawing ---------- */
const fishP = (x, y, s, dir = 1) => { const X = (d) => n1(x + d * s * dir); return `<path d="M${X(7)} ${n1(y)}Q${X(1)} ${n1(y - 3.8 * s)} ${X(-5)} ${n1(y)}Q${X(1)} ${n1(y + 3.8 * s)} ${X(7)} ${n1(y)}ZM${X(-4.5)} ${n1(y)}L${X(-8.5)} ${n1(y - 3.3 * s)}L${X(-8.5)} ${n1(y + 3.3 * s)}Z" class="af-fill"/>`; };
const arrowHead = (x, y, dx, dy, s = 6) => { const L = Math.hypot(dx, dy) || 1, ux = dx / L, uy = dy / L; return `<path d="${pth([[x + ux * s, y + uy * s], [x - ux * s * 0.6 - uy * s * 0.7, y - uy * s * 0.6 + ux * s * 0.7], [x - ux * s * 0.6 + uy * s * 0.7, y - uy * s * 0.6 - ux * s * 0.7]], true)}" class="af-fill"/>`; };
const pipe = (pts) => `<path d="${pth(pts)}" class="af-pipeo"/><path d="${pth(pts)}" class="af-pipei"/>`;

function drawOpen(P, F, opt, showWaste) {
  const { S, B, landW, yL, slopeEnd, cages, cd } = P;
  let s = "";
  // water, land, seabed
  s += `<rect x="${landW}" y="${S}" width="${W - landW}" height="${B - S + 2}" class="af-water"/>`;
  const bed = [[landW, S], [slopeEnd, B]]; for (let x = slopeEnd + 30; x < W; x += 30) bed.push([x, B + (((x * 37) % 7) - 3) * 0.4]); bed.push([W, B]);
  const ground = [[0, yL], [landW - 22, yL + 3], [landW - 6, S - 6], ...bed, [W, PH], [0, PH]];
  s += `<path d="${poly(ground)}" class="af-bg"/><path d="${poly(ground)}" fill="url(#${KEY}-bed)" stroke="none"/><path d="${pth([[0, yL], [landW - 22, yL + 3], [landW - 6, S - 6], ...bed])}" class="af-edge"/>`;
  let sd = `M${landW - 4} ${S}`; for (let x = landW - 4; x < W; x += 12) sd += `Q${n1(x + 6)} ${n1(S - 2.4)} ${n1(Math.min(W, x + 12))} ${S}`;
  s += `<path d="${sd}" class="af-surf"/>`;
  // moorings and anchors
  for (const [x1, y1, x2, y2] of P.moors) s += `<line x1="${n1(x1)}" y1="${n1(y1)}" x2="${n1(x2)}" y2="${n1(y2)}" class="af-rope"/>`;
  for (const A of P.anchors) s += `<path d="${poly([[A.x - 10, A.y + 1], [A.x + 10, A.y + 1], [A.x + 7, A.y - 11], [A.x - 7, A.y - 11]])}" class="af-block"/>`;
  // cages
  cages.forEach((c, k) => {
    const net = `M${n1(c.a + 5)} ${S + 4}L${n1(c.a + 11)} ${n1(S + cd - 12)}Q${n1(c.a + 13)} ${n1(S + cd)} ${c.m} ${n1(S + cd)}Q${n1(c.b - 13)} ${n1(S + cd)} ${n1(c.b - 11)} ${n1(S + cd - 12)}L${n1(c.b - 5)} ${S + 4}Z`;
    s += `<path d="${net}" fill="url(#${KEY}-mesh)" class="af-net"/>`;
    for (const f of P.inFish[k]) s += fishP(f[0], f[1], 1.05, f[2]);
    const tent = [[c.a + 7, S - 4], [c.m, S - 30], [c.b - 7, S - 4]];
    s += `<path d="${pth(tent, true)}" fill="url(#${KEY}-fine)" class="af-cover"/><line x1="${c.m}" y1="${S - 4}" x2="${c.m}" y2="${S - 31}" class="af-pole"/>`;
    s += `<rect x="${c.a}" y="${S - 4}" width="${P.cw}" height="9" rx="4" class="af-float"/>`;
  });
  // wildlife and currents
  for (const [x, y] of P.deco.birds) s += `<path d="M${n1(x - 10)} ${n1(y - 2)}Q${n1(x - 5)} ${n1(y - 8)} ${x} ${y}Q${n1(x + 5)} ${n1(y - 8)} ${n1(x + 10)} ${n1(y - 2)}" class="af-bird"/>`;
  for (const [x, y, d] of P.deco.fish) s += fishP(x, y, 1.1, d);
  if (P.deco.seal) { const [x, y, d] = P.deco.seal, X = (u) => n1(d > 0 ? x + u : x + 32 - u);
    s += `<path d="M${X(0)} ${n1(y)}Q${X(8)} ${n1(y - 9)} ${X(24)} ${n1(y - 6)}Q${X(32)} ${n1(y - 6)} ${X(36)} ${n1(y - 9)}Q${X(41)} ${n1(y - 7)} ${X(38)} ${n1(y - 2)}Q${X(30)} ${n1(y + 3)} ${X(16)} ${n1(y + 4)}L${X(12)} ${n1(y + 9)}L${X(8)} ${n1(y + 4)}Q${X(2)} ${n1(y + 3)} ${X(-6)} ${n1(y + 6)}L${X(-4)} ${n1(y)}L${X(-8)} ${n1(y - 5)}Z" class="af-fill"/>`; }
  for (const [x, y] of P.deco.arrows) { const xa = P.cur > 0 ? x : x + 44, xb = P.cur > 0 ? x + 38 : x + 6; s += `<line x1="${xa}" y1="${y}" x2="${xb}" y2="${y}" class="af-arrow"/>` + arrowHead(xb, y, P.cur, 0, 7); }
  if (showWaste) P.waste.forEach((ws, k) => { for (const [x, y] of ws) s += `<circle cx="${x}" cy="${y}" r="1.9" class="af-fill"/>`; const c = cages[k], mx = c.m + P.cur * 34; s += `<path d="M${n1(mx - 24)} ${B}Q${n1(mx - 10)} ${B - 7} ${n1(mx)} ${B - 6}Q${n1(mx + 12)} ${B - 6} ${n1(mx + 24)} ${B}Z" fill="url(#${KEY}-dots)" class="af-mound"/>`; });
  return s;
}

function drawClosed(P) {
  const { G, TB, TT, tanks, tw, cx0, x0, fx, fw, FT, px, py, dx, dw, oy } = P;
  let s = "";
  s += `<rect x="0" y="${G}" width="${W}" height="${PH - G}" class="af-bg"/><rect x="0" y="${G}" width="${W}" height="${PH - G}" fill="url(#${KEY}-bed)"/><line x1="0" x2="${W}" y1="${G}" y2="${G}" class="af-edge"/>`;
  // drains and drain line, outlet, return line (pipes behind the units)
  P.drains.forEach((x) => (s += pipe([[x, TB], [x, G - 7]])));
  s += pipe([[P.drains[0] - 3, G - 7], [fx, G - 7]]) + arrowHead(n1((tanks[tanks.length - 1].b + fx) / 2), G - 7, 1, 0, 6);
  s += pipe([[fx + fw, oy], [dx + 4, oy]]) + arrowHead(n1((fx + fw + dx) / 2 + 2), oy, 1, 0, 6);
  s += pipe([[px, FT], [px, py + 14]]) + arrowHead(px, n1((FT + py + 15) / 2 + 2), 0, -1, 6);
  s += pipe([[px - 14, P.yR], [P.drops[0] - 3, P.yR]]);
  P.drops.forEach((x, k) => { s += pipe([[x, P.yR - 3], [x, TT + 6]]) + arrowHead(x, TT + 12, 0, 1, 6); if (k < P.drops.length - 1) s += arrowHead(n1((x + P.drops[k + 1]) / 2), P.yR, -1, 0, 6); });
  s += arrowHead(n1((P.drops[P.drops.length - 1] + px - 15) / 2), P.yR, -1, 0, 6);
  // tanks
  tanks.forEach((t, k) => {
    s += `<line x1="${t.a + 6}" x2="${t.a + 6}" y1="${TB}" y2="${G}" class="af-leg"/><line x1="${t.b - 6}" x2="${t.b - 6}" y1="${TB}" y2="${G}" class="af-leg"/>`;
    s += `<rect x="${t.a}" y="${n1(TT + 9)}" width="${tw}" height="${n1(TB - TT - 9)}" class="af-water"/>`;
    let w = `M${t.a} ${n1(TT + 9)}`; for (let x = t.a; x < t.b - 0.1; x += 10) w += `Q${n1(x + 5)} ${n1(TT + 7)} ${n1(Math.min(t.b, x + 10))} ${n1(TT + 9)}`; s += `<path d="${w}" class="af-surf"/>`;
    for (const f of P.tFish[k]) s += fishP(f[0], f[1], 1.05, f[2]);
    const cx = n1(t.a + tw / 2); s += `<rect x="${cx - 5}" y="${P.diffY - 3}" width="10" height="5" class="af-block"/>`;
    for (let i = 0; i < 4; i++) s += `<circle cx="${n1(cx + (i % 2 ? 3 : -3))}" cy="${n1(P.diffY - 10 - i * 9)}" r="${n1(2 + i * 0.3)}" class="af-bub"/>`;
  });
  // oxygen hose (drawn over the tank walls), then tank outlines
  s += `<path d="${pth(P.pipes.hose)}" class="af-hose"/>`;
  tanks.forEach((t) => (s += `<rect x="${t.a}" y="${TT}" width="${tw}" height="${TB - TT}" class="af-tank"/>`));
  // oxygen cylinder
  s += `<path d="M${cx0} ${G}V${G - 52}Q${cx0} ${G - 60} ${cx0 + 10} ${G - 60}Q${cx0 + 20} ${G - 60} ${cx0 + 20} ${G - 52}V${G}Z" class="af-unit"/><rect x="${cx0 + 6}" y="${G - 65}" width="8" height="6" class="af-block"/><line x1="${cx0}" x2="${cx0 + 20}" y1="${G - 44}" y2="${G - 44}" class="af-thin"/>`;
  // filter: layers of filter material
  const lh = (G - FT) / 3;
  s += `<rect x="${fx}" y="${FT}" width="${fw}" height="${G - FT}" class="af-unit"/>`;
  s += `<rect x="${fx + 3}" y="${n1(FT + 3)}" width="${fw - 6}" height="${n1(lh - 3)}" fill="url(#${KEY}-grav)"/><rect x="${fx + 3}" y="${n1(FT + lh)}" width="${fw - 6}" height="${n1(lh)}" fill="url(#${KEY}-fine)"/><rect x="${fx + 3}" y="${n1(FT + 2 * lh)}" width="${fw - 6}" height="${n1(lh - 3)}" fill="url(#${KEY}-dots)"/>`;
  s += `<line x1="${fx}" x2="${fx + fw}" y1="${n1(FT + lh)}" y2="${n1(FT + lh)}" class="af-thin"/><line x1="${fx}" x2="${fx + fw}" y1="${n1(FT + 2 * lh)}" y2="${n1(FT + 2 * lh)}" class="af-thin"/>`;
  // pump (impeller)
  s += `<circle cx="${px}" cy="${py}" r="15" class="af-unit"/>`;
  for (let i = 0; i < 4; i++) { const a = (i * Math.PI) / 2 + 0.3, b = a + 0.9; s += `<path d="M${n1(px + 3 * Math.cos(a))} ${n1(py + 3 * Math.sin(a))}Q${n1(px + 9 * Math.cos(a + 0.2))} ${n1(py + 9 * Math.sin(a + 0.2))} ${n1(px + 12 * Math.cos(b))} ${n1(py + 12 * Math.sin(b))}" class="af-blade"/>`; }
  s += `<circle cx="${px}" cy="${py}" r="2.6" class="af-fill"/>`;
  // waste container
  s += `<rect x="${dx}" y="${G - 30}" width="${dw}" height="30" class="af-unit"/><rect x="${dx + 3}" y="${G - 15}" width="${dw - 6}" height="12" fill="url(#${KEY}-dots)"/><line x1="${dx - 2}" x2="${dx + dw + 2}" y1="${G - 30}" y2="${G - 30}" class="af-thick"/>`;
  return s;
}

function svg(F, opt) {
  opt = opt || {}; const hl = opt.hl || {};
  const both = F.order.length === 2, showWaste = F.wasteAlways || !!opt.waste || !!hl.waste;
  const H = both ? 2 * (PH + GAPY) + 26 : PH + 34;
  let s = `<defs><pattern id="${KEY}-mesh" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 0L7 7M7 0L0 7" class="af-mesh"/></pattern>` +
    `<pattern id="${KEY}-fine" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 2.5H5M2.5 0V5" class="af-mesh"/></pattern>` +
    `<pattern id="${KEY}-bed" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M-1 1L1 -1M0 7L7 0M6 8L8 6" class="af-hatch"/></pattern>` +
    `<pattern id="${KEY}-dots" width="5" height="5" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="1" class="af-fill"/></pattern>` +
    `<pattern id="${KEY}-grav" width="9" height="8" patternUnits="userSpaceOnUse"><circle cx="2.5" cy="2.5" r="2" class="af-gc"/><circle cx="7" cy="6" r="2" class="af-gc"/></pattern></defs>`;
  F.order.forEach((k, i) => {
    const P = F.panels[k], y0 = both ? i * (PH + GAPY) + TOPT : 4, mir = F.mir[k], X = (x) => n1(mir ? W - x : x);
    s += `<g transform="translate(0 ${y0})">`;
    if (both) s += `<text x="2" y="-7" class="af-title${hl.panel === k ? " on" : ""}">Farm ${i + 1}</text>`;
    s += `<g${mir ? ` transform="matrix(-1 0 0 1 ${W} 0)"` : ""}>`;
    s += k === "open" ? drawOpen(P, F, opt, showWaste) : drawClosed(P);
    // highlight of a part after Check
    if (hl.part && panelOf(hl.part) === k) s += `<path d="${P.taps[hl.part].map(poly).join("")}" class="af-hl"/>`;
    // label lines
    for (const id of F.lettered[k]) { const L = P.L[id], on = hl.part === id; s += `<line x1="${n1(L.ax)}" y1="${n1(L.ay)}" x2="${n1(L.px)}" y2="${n1(L.py)}" class="af-lead${on ? " on" : ""}"/><circle cx="${n1(L.px)}" cy="${n1(L.py)}" r="2.4" class="af-dot${on ? " on" : ""}"/>`; }
    if (opt.tapMode) { const ids = k === "open" ? OPEN_PARTS : CLOSED_PARTS; for (const id of ids) s += `<path d="${P.taps[id].map(poly).join("")}" fill="transparent" data-tap="${id}"/>`; }
    s += `</g>`;
    // words and letters (never mirrored)
    if (k === "open") {
      s += `<text x="${X(P.landW * 0.42)}" y="${n1(P.yL + 20)}" text-anchor="middle" class="af-word">land</text>`;
      const A = P.deco.arrows[P.deco.cword], ax = P.cur > 0 ? A[0] + 19 : A[0] + 25;
      s += `<text x="${X(ax)}" y="${n1(A[1] - 11)}" text-anchor="middle" class="af-word af-halo">current</text>`;
    }
    for (const id of F.lettered[k]) { const L = P.L[id], on = hl.part === id; s += `<text x="${X(L.lx)}" y="${n1(L.ly)}" text-anchor="middle" class="af-let af-halo${on ? " on" : ""}">${F.letter[id]}</text>`; }
    s += `<rect x="0.75" y="0.75" width="${W - 1.5}" height="${PH - 1.5}" class="af-frame${hl.panel === k ? " on" : ""}"/>`;
    s += `</g>`;
  });
  s += `<text x="${W / 2}" y="${H - 10}" text-anchor="middle" class="af-sm">Side views, not drawn to scale. Arrows show the direction of water flow.</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="figsvg fig-${KEY}" role="img" aria-label="${both ? "Side views of two fish farms" : "Side view of a fish farm"}, with lettered parts">${s}</svg>`;
}

/* ---------- questions ---------- */
// statements for the tick-true question: groups of variants [text, isTrue, explanation, tag?]; one variant per group
const OPEN_ST = [
  ["esc", [["Farmed fish that escape through a torn net can compete or breed with wild fish.", true, "escaped farmed fish compete with wild fish for food and space, and can breed with them"],
    ["Farmed fish that escape through a torn net can help the wild stock to recover.", false, "escapes harm wild stocks: escaped fish compete and breed with wild fish rather than topping them up"]]],
  ["dis", [["Parasites and disease can spread from the farmed fish to wild fish nearby.", true, "sea water flows freely through the net, so parasites and disease pass between farmed and wild fish"],
    ["The net keeps parasites and disease inside the cage, away from wild fish.", false, "a net holds the fish, not the water: parasites and disease pass through it to wild fish"]]],
  ["oxy", [["Waste food and faeces from the cages can lower the oxygen level of the water around the farm.", true, "as waste food and faeces decompose, they use up oxygen in the water around and below the cages"],
    ["The cages can raise the oxygen level of the water around the farm.", false, "the farm does the opposite: as waste food and faeces decompose, they use up oxygen in the water around and below the cages"]]],
  ["flow", [["Currents flowing through the nets bring oxygen to the fish and carry waste away.", true, "the cages sit in the open sea, so currents renew the water in them"],
    ["The water in the cages has to be pumped through a filter to keep it clean.", false, "an open system needs no pumps or filters: currents renew the water in the cages"]]],
  ["cost", [["It is cheaper to set up and run than a farm with tanks, pumps and filters.", true, "it needs no pumps, filters or oxygen supply, so it costs less and uses less energy"],
    ["It uses more energy than a farm with tanks, because its water must be pumped.", false, "currents move the water through the cages, so no pumping is needed; tank farms use more energy"]]],
  ["cond", [["The temperature and salinity in the cages change with the surrounding sea.", true, "the water in the cages is the sea itself, so the farmer cannot control its temperature or salinity"],
    ["The farmer can set the temperature and salinity in the cages to suit the fish.", false, "the water in the cages is the sea itself; control of conditions is an advantage of closed tank systems"]]],
  ["pred", [["Seals and birds are attracted to the caged fish, so nets are needed to keep them out.", true, "predators gather around the cages, so farms use nets over and around the cages"],
    ["Predators such as seals cannot reach fish kept in a net cage in the sea.", false, "seals can attack fish through the net and birds dive in from above, so farms protect the cages with nets"]], "pred"],
];
const CLOSED_ST = [
  ["cond", [["Temperature, salinity and oxygen can be kept at the levels the fish need.", true, "the water is isolated from the sea, so it can be monitored and controlled"],
    ["The temperature of the water in the tanks changes with the sea, as in a net cage.", false, "the tanks are not connected to the sea, so their conditions can be controlled"]], "oxy"],
  ["cost", [["It costs more to build and run, because the pumps and filters need equipment and energy.", true, "pumps, filters and the oxygen supply cost money to buy and use energy all the time"],
    ["It is cheaper to run than net cages, because the water moves round without any energy.", false, "the pump uses energy all the time to move the water, so running costs are higher than for net cages"]]],
  ["esc", [["Farmed fish are much less likely to escape into the wild.", true, "the fish are held in tanks on land, away from the sea"],
    ["Fish escaping from the tanks are a bigger problem than escapes from net cages.", false, "it is the other way round: fish rarely escape from tanks on land, but torn sea cages release fish into the wild"]]],
  ["dis", [["Disease and parasites are less likely to spread to wild fish, as the tanks are cut off from the sea.", true, "no water flows between the tanks and the sea, so disease is not passed to wild fish"],
    ["Parasites from wild fish reach the farmed fish more easily than in net cages.", false, "the tanks are cut off from the sea, so wild fish and their parasites cannot reach the farmed fish"]]],
  ["power", [["The farm depends on its machinery, so a power cut that stops the pumps can soon harm the fish.", true, "with the pumps stopped, no water flows through the filter, so waste soon builds up in the tanks"],
    ["A power cut can stop the pumps without harming the fish, because the tanks hold plenty of water.", false, "with the pumps stopped, no water flows through the filter, so waste soon builds up in the tanks"]]],
  ["cur", [["Oxygen has to be supplied, because no currents flow through the tanks.", true, "the tanks are not connected to the sea, so oxygen has to be added"],
    ["Ocean currents bring oxygen and food to the fish in the tanks.", false, "the tanks are on land and not connected to the sea, so no currents reach them"]], "oxy"],
  ["site", [["The farm can be built away from the coast, as it does not need to be in the sea.", true, "the tanks are on land and the water is reused, so the farm does not have to be in the sea"],
    ["The farm must be built on the shore, because sea water has to flow through the tanks.", false, "the water is cleaned and reused, not taken from the sea, so the farm can be built away from the coast"]]],
];

function questions(F, r) {
  const qs = [], { plan, letter } = F, both = F.order.length === 2;
  const farm = (k) => `Farm ${F.order.indexOf(k) + 1}`, fRef = (k) => (both ? farm(k) : "the farm");
  const tagL = (id) => (letter[id] ? ` (${letter[id]})` : "");
  const later = { waste: false };
  const wq = (q) => { if (later.waste) { q.askOpt = Object.assign({}, q.askOpt || {}, { waste: true }); if (!q.doneOpt) q.hl = Object.assign({}, q.hl || {}, { waste: true }); } return q; };

  // 1. which system is closed / what type the farm is
  if (both) {
    const o = farm("open"), c = farm("closed");
    const opts = [`${c}, because its tanks are not connected to the sea`, `${c}, because each of its tanks is sealed with a lid`, `${o}, because its nets stop the fish from escaping`, `${o}, because netting is stretched over each cage`];
    qs.push(wq({ kind: "choice", q: "Which farm uses a <b>closed</b> aquaculture system?", options: opts, a: 0, hl: { panel: "closed" },
      why: `${c} keeps its fish in tanks that are not connected to the sea, so it is a <b>closed</b> system. ${o} is an <b>open</b> system: its net cages sit in the sea and are not cut off from it. The tanks are open at the top, so the reason is not a lid; and a net round the fish or netting over the cages does not make a system closed.` }));
  } else if (F.mode === "open") {
    const opts = ["Open, because its cages are in the sea, not cut off from it", "Open, because the fish can swim in and out of the cages", "Closed, because its nets stop the fish from escaping", "Closed, because netting is stretched over the top of each cage"];
    qs.push(wq({ kind: "choice", q: "What type of aquaculture system does this farm use?", options: opts, a: 0,
      why: "The fish are kept in net cages in the sea, and the cages are not cut off from it, so this is an <b>open</b> system. The farmed fish cannot swim in and out (the nets hold them in), and a net round the fish or netting over the cages does not make a system closed: a closed system keeps the fish in tanks that are not connected to the sea." }));
  } else {
    const opts = ["Closed, because its tanks are not connected to the sea", "Closed, because each tank is sealed with a lid", "Open, because the tops of the tanks are open to the air", "Open, because water flows in and out of the tanks through pipes"];
    qs.push(wq({ kind: "choice", q: "What type of aquaculture system does this farm use?", options: opts, a: 0,
      why: "The fish are kept in tanks that are not connected to the sea, so this is a <b>closed</b> system. 'Open' and 'closed' describe whether the farm is connected to the sea, not whether the tanks have lids or pipes (these tanks are open at the top). An open system keeps the fish in net cages in the sea." }));
  }

  const nameQ = (id) => {
    const pool = (panelOf(id) === "open" ? OPEN_PARTS : CLOSED_PARTS).filter((p) => p !== id);
    const pref = PARTNER[id].concat(shuffleR(r, pool.filter((p) => !PARTNER[id].includes(p))));
    const opts = [id, ...pref.slice(0, 3)];
    return wq({ kind: "choice", q: `Name the part labelled <b>${letter[id]}</b>${both ? ` in ${farm(panelOf(id))}` : ""}.`, options: opts.map((p) => NAME[p]), a: 0, hl: { part: id },
      why: `<b>${letter[id]}</b> is the <b>${NAME[id]}</b>: ${DESCR[id]}.` });
  };
  // 2–3. name two lettered parts (before any question whose stem or feedback locates a part)
  qs.push(nameQ(plan.names[0]));
  qs.push(nameQ(plan.names[1]));

  // 4. tap a part by its job
  const tp = plan.tap, tOpt = { tapMode: true };
  if (tp === "net") {
    qs.push({ kind: "tap", q: "Uneaten food and faeces from the farmed fish pass into the sea. <b>Tap</b> the part of the farm they pass through.", a: ["net"], ansTxt: `the net cage${tagL("net")}`, labelOf: (id) => NAME[id],
      askOpt: tOpt, doneOpt: () => ({ tapMode: true, waste: true }),
      why: "They fall through the mesh of the <b>net cage</b> into the sea below. Nothing collects them, so they spread through the water and settle on the seabed under the cages (shown as dots after Check)." });
    later.waste = true;
  } else if (tp === "cover") {
    qs.push(wq({ kind: "tap", q: "Seabirds dive into the cages to take fish. <b>Tap</b> the part of the farm that stops them.", a: ["cover"], ansTxt: `the cover net${tagL("cover")}`, labelOf: (id) => NAME[id],
      askOpt: tOpt, doneOpt: () => ({ tapMode: true }),
      why: "The <b>cover net</b> stretched over the top of each cage stops seabirds diving in to take the fish. Farms also use nets to keep other predators, such as seals, away from the fish." }));
  } else if (tp === "pump") {
    qs.push(wq({ kind: "tap", q: `<b>Tap</b> the part that keeps the water flowing round ${both ? farm("closed") : "the farm"}.`, a: ["pump"], ansTxt: `the pump${tagL("pump")}`, labelOf: (id) => NAME[id],
      askOpt: tOpt, doneOpt: () => ({ tapMode: true }),
      why: "The <b>pump</b> pushes the water along the pipes and back into the tanks, so it keeps flowing round the system. The arrows on the pipes show the direction of flow." }));
  } else {
    qs.push(wq({ kind: "tap", q: "<b>Tap</b> the part that keeps the dissolved oxygen in the tanks high enough for the fish.", a: ["oxygen"], ansTxt: `the oxygen supply${tagL("oxygen")}`, labelOf: (id) => NAME[id],
      askOpt: tOpt, doneOpt: () => ({ tapMode: true }),
      why: "The <b>oxygen supply</b> (a gas cylinder) feeds oxygen through a pipe into the tanks, where it bubbles out into the water." }));
  }

  // 5. why the filter is needed / why the cages are covered
  if (plan.q4 === "filter") {
    const opts = ["It removes waste food and faeces, so the water can be reused", "It adds oxygen to the water, so that the fish have enough to respire", "It removes salt from the water, so that the fish grow faster", "It warms the water to the temperature that the fish need"];
    qs.push(wq({ kind: "choice", q: `The water in ${both ? farm("closed") : "this farm"} passes through a filter before it goes back to the tanks. Why is the filter needed?`, options: opts, a: 0,
      why: "The filter removes <b>waste food and faeces</b> from the water, so the same water can be pumped back into the tanks and <b>reused</b>. Without it, waste would build up in the tanks and harm the fish. A filter does not add oxygen, remove salt or heat the water." }));
  } else {
    const opts = ["To keep out predators, such as birds, that take the fish", "To stop waste food and faeces drifting out of the cage", "To cut the cage off from the sea, making it a closed system", "To keep the water in the cage warmer than the sea around it"];
    qs.push(wq({ kind: "choice", q: "The top of each cage is covered with netting. Suggest why.", options: opts, a: 0,
      why: "Seabirds dive for fish near the surface, so netting over the cages keeps these <b>predators</b> out (nets round the cages also keep out seals). The netting does not hold in the waste, warm the water or make the system closed." }));
  }


  // 6. tick the true statements about one system (no statement whose answer an earlier explanation gave away)
  const k = plan.multi, groups = (k === "open" ? OPEN_ST : CLOSED_ST).filter(([, , tag]) => !(tag === "pred" && (plan.tap === "cover" || plan.q4 === "cover")) && !(tag === "oxy" && plan.tap === "oxygen"));
  const ch = groups.map(([, v]) => v[Math.floor(r() * v.length)]);
  if (ch.every((x) => x[1] === ch[0][1])) { const i = groups.findIndex(([, v]) => v.length > 1); const v = groups[i][1]; ch[i] = v.find((x) => x[1] !== ch[0][1]); }
  const pick = pickMixed(r, ch, 5);
  qs.push(wq({ kind: "multi", q: `Tick <b>every</b> statement that is true for ${both ? `<b>${farm(k)}</b>` : "this farm"}.`, options: pick.map((x) => x[0]), a: pick.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0), hl: both ? { panel: k } : {},
    why: `This is ${k === "open" ? "an <b>open</b> system (net cages in the sea)" : "a <b>closed</b> system (tanks not connected to the sea)"}.<br>` + pick.map((x) => `${x[1] ? "✓" : "✗"} ${x[0]} — ${x[2]}.`).join("<br>") }));
  return qs;
}

function selfTest(F, qs) {
  const bad = [], { plan } = F;
  for (const q of qs.filter((q) => q.kind === "choice")) { const L = q.options[q.a].length; if (!q.options.some((x, i) => i !== q.a && x.length >= L)) bad.push("answer is longest: " + q.options[q.a]); }
  // name targets are lettered, distinct from the tap target, and the letters point at them
  if (plan.names.some((n) => !F.letter[n])) bad.push("name target not lettered");
  if (plan.names.includes(plan.tap) || plan.names[0] === plan.names[1]) bad.push("repeated target");
  if (plan.q4 === "cover" && plan.tap === "cover") bad.push("cover twice");
  for (const q of qs.filter((q) => /^Name/.test(q.q))) { const L0 = q.q.match(/<b>([A-H])<\/b>/)[1], id = Object.keys(F.letter).find((x) => F.letter[x] === L0); if (NAME[id] !== q.options[q.a]) bad.push("name choice"); }
  if (new Set(Object.values(F.letter)).size !== Object.keys(F.letter).length) bad.push("letters repeat");
  // every panel part exists as a tap shape, tap target belongs to a drawn panel
  if (!F.order.includes(panelOf(plan.tap))) bad.push("tap target not drawn");
  for (const k of F.order) for (const id of k === "open" ? OPEN_PARTS : CLOSED_PARTS) if (!F.panels[k].taps[id] || !F.panels[k].taps[id].length) bad.push("missing tap " + id);
  // tap shapes are big enough (≥ 22 units in both directions)
  for (const k of F.order) for (const [id, ps] of Object.entries(F.panels[k].taps)) for (const p of ps) { const b = bbox(p); if (b[2] - b[0] < 21.9 || b[3] - b[1] < 21.9) bad.push("small tap " + id); }
  // tap shapes of different parts do not overlap much (centre of each shape is inside only its own part)
  for (const k of F.order) { const T = F.panels[k].taps; for (const [id, ps] of Object.entries(T)) for (const p of ps) { const b = bbox(p), c = [(b[0] + b[2]) / 2, (b[1] + b[3]) / 2]; for (const [id2, ps2] of Object.entries(T)) if (id2 !== id && ps2.some((p2) => inPoly(c, p2))) bad.push(`tap ${id} centre inside ${id2}`); } }
  // open panel: everything below the sea surface sits above the seabed; anchors on the flat seabed
  if (F.panels.open) { const P = F.panels.open; if (P.cages.some((c) => P.S + P.cd + 40 > P.B)) bad.push("net too deep for its letter"); if (P.anchors[0].x < P.slopeEnd + 20 || P.anchors[1].x > 540) bad.push("anchor position"); }
  if (F.panels.closed) { const P = F.panels.closed; if (P.yR > P.TT - 20 || P.FT - P.py - 15 < 16 || P.dx + P.dw > 550) bad.push("closed layout"); }
  // the multi uses one system's statements, mixes true and false, and never repeats the earlier give-aways
  const m = qs.find((q) => q.kind === "multi"), pool = plan.multi === "open" ? OPEN_ST : CLOSED_ST;
  m.options.forEach((t, i) => { const g = pool.find(([, v]) => v.some((x) => x[0] === t)); if (!g) bad.push("multi statement from the wrong system"); else { const v = g[1].find((x) => x[0] === t); if (v[1] !== m.a.includes(i)) bad.push("multi truth"); if (g[2] === "pred" && (plan.tap === "cover" || plan.q4 === "cover")) bad.push("pred statement after cover"); if (g[2] === "oxy" && plan.tap === "oxygen") bad.push("oxygen statement after oxygen tap"); } });
  if (m.options.length < 5) bad.push("multi has " + m.options.length);
  // waste dots are hidden until the waste tap question is checked
  const wi = qs.findIndex((q) => q.kind === "tap" && q.a[0] === "net");
  if (wi >= 0) { if (F.wasteAlways) bad.push("waste always shown with waste tap"); qs.forEach((q, i) => { if (i <= wi && (q.askOpt || {}).waste) bad.push("waste shown before the waste question"); }); }
  if (qs.length < 6) bad.push("only " + qs.length);
  // Q1: the key is not the odd one out (2 options per farm / per answer word)
  const q1 = qs[0], head = (t) => t.split(",")[0], kh = head(q1.options[q1.a]);
  if (q1.options.filter((t) => head(t) === kh).length !== 2) bad.push("Q1 key is the odd one out");
  // both name questions come before the tap and the filter/cover question; cover is never named
  if (!(/^Name/.test(qs[1].q) && /^Name/.test(qs[2].q))) bad.push("name questions not 2nd and 3rd");
  if (plan.names.includes("cover")) bad.push("cover named");
  if (/netting|cover net/.test(qs[0].options.join(" ")) && plan.names.includes("cover")) bad.push("Q1 locates a named part");
  return bad;
}

export default {
  key: KEY, group: "Diagrams", name: "Aquaculture systems", topics: "Unit 6 (6.4)", thumbSeed: 4,
  blurb: "Generated side views of fish farms: tell an open net-cage system from a closed tank system, name the lettered parts, and weigh up the advantages and disadvantages of each.",
  tips: [
    "An <b>open</b> system keeps fish in <b>net cages</b> in the sea. Currents bring oxygen and carry waste away, but waste, parasites, disease and escaped fish all pass into the surrounding sea.",
    "A <b>closed</b> system keeps fish in <b>tanks</b> that are not connected to the sea. The water is pumped round, filtered and given oxygen, so conditions can be controlled, but it costs more and uses energy.",
    "A net round the fish, or a sheltered bay, does <b>not</b> make a system closed: the question is whether the water is cut off from the sea.",
    "Farms protect their fish from predators such as birds and seals with netting, keep the water conditions (temperature, salinity, light, pH, oxygen) right for the species, and breed from broodstock.",
    "Follow the flow arrows to work out which way water and waste move through a system.",
  ],
  ctx: (F) => (F.order.length === 2 ? "side views of two fish farms (not to scale)" : "a side view of a fish farm (not to scale)"),
  make, svg, questions, selfTest,
  css: `.fig-aquafarm .af-bg{fill:var(--surface)}.fig-aquafarm .af-water{fill:color-mix(in srgb,var(--ink) 7%,transparent)}
.fig-aquafarm .af-frame{fill:none;stroke:var(--line);stroke-width:1.2}.fig-aquafarm .af-frame.on{stroke:var(--app);stroke-width:3}
.fig-aquafarm .af-surf{fill:none;stroke:currentColor;stroke-width:1.6}.fig-aquafarm .af-edge{fill:none;stroke:currentColor;stroke-width:1.6}.fig-aquafarm .af-hatch{stroke:currentColor;stroke-width:.9;opacity:.55}
.fig-aquafarm .af-fill{fill:currentColor}.fig-aquafarm .af-mesh{stroke:currentColor;stroke-width:.75;opacity:.8}.fig-aquafarm .af-gc{fill:none;stroke:currentColor;stroke-width:.9}
.fig-aquafarm .af-net{stroke:currentColor;stroke-width:1.5}.fig-aquafarm .af-cover{stroke:currentColor;stroke-width:1.3}.fig-aquafarm .af-pole{stroke:currentColor;stroke-width:2}
.fig-aquafarm .af-float{fill:color-mix(in srgb,var(--ink) 30%,var(--surface));stroke:currentColor;stroke-width:1.4}
.fig-aquafarm .af-rope{stroke:currentColor;stroke-width:1.6;stroke-dasharray:6 2.5}.fig-aquafarm .af-block{fill:color-mix(in srgb,var(--ink) 45%,var(--surface));stroke:currentColor;stroke-width:1.2}
.fig-aquafarm .af-bird{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}.fig-aquafarm .af-arrow{stroke:currentColor;stroke-width:2}
.fig-aquafarm .af-mound{stroke:currentColor;stroke-width:1}
.fig-aquafarm .af-pipeo{fill:none;stroke:currentColor;stroke-width:7;stroke-linejoin:round}.fig-aquafarm .af-pipei{fill:none;stroke:var(--surface);stroke-width:3.6;stroke-linejoin:round}
.fig-aquafarm .af-hose{fill:none;stroke:currentColor;stroke-width:2;stroke-dasharray:5 2.5}.fig-aquafarm .af-tank{fill:none;stroke:currentColor;stroke-width:2.2}.fig-aquafarm .af-leg{stroke:currentColor;stroke-width:2.4}
.fig-aquafarm .af-unit{fill:var(--surface);stroke:currentColor;stroke-width:2}.fig-aquafarm .af-thin{stroke:currentColor;stroke-width:1}.fig-aquafarm .af-thick{stroke:currentColor;stroke-width:2.6}
.fig-aquafarm .af-blade{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}.fig-aquafarm .af-bub{fill:none;stroke:currentColor;stroke-width:1.1}
.fig-aquafarm .af-word{font-size:14px;font-weight:700}.fig-aquafarm .af-title{font-size:16px;font-weight:800}.fig-aquafarm .af-title.on{fill:var(--app)}.fig-aquafarm .af-sm{font-size:13.5px;opacity:.9}
.fig-aquafarm .af-halo{paint-order:stroke;stroke:var(--surface);stroke-width:4px;stroke-linejoin:round}
.fig-aquafarm .af-lead{stroke:currentColor;stroke-width:1.3}.fig-aquafarm .af-dot{fill:currentColor}.fig-aquafarm .af-let{font-size:19px;font-weight:800}
.fig-aquafarm .af-lead.on{stroke:var(--app);stroke-width:2.2}.fig-aquafarm .af-dot.on{fill:var(--app)}.fig-aquafarm .af-let.on{fill:var(--app)}
.fig-aquafarm .af-hl{fill:color-mix(in srgb,var(--app) 32%,transparent);stroke:var(--app);stroke-width:2}`,
};
