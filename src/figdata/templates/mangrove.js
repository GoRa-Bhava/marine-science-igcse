/* ---------- MANGROVE ADAPTATIONS (0697 5.6/LO3 mangrove tree; 5.6/LO4 banded archerfish and mudskipper; context 5.6/LO1) ----------
   Exam-style monochrome line art, drawn from seeded geometry. One of three figures per run:
     tree    — side view of a mangrove tree in an estuary, cut through the (hatched) mud: arching prop roots, a row of upright
               pneumatophores rising from a root under the mud, the trunk, the crown, and one leaf shown enlarged with salt
               crystals (dots). Seeded: trunk position, crown, number/reach of prop roots, pneumatophores, tide level, mirror.
     mud     — a mudskipper on the mud at the water's edge: two eyes set high on the head, the enlarged gill chamber, stalked
               pectoral fins propping the body, pelvic fins, dorsal and caudal fins. Seeded: size, position, facing, tide, mirror.
     archer  — a banded archerfish just below the water surface: large forward-set eyes, upturned mouth, 4–6 dark bands.
               Seeded: band count/size, tilt, size, facing, mirror.
   Letters on label lines (3–5 parts, seeded); the drawings carry no part names.
   Knowledge (KM5 5.6/LO3–LO4) is tested once per run: each fact belongs to one question, and identification feedback never
   states a function, so no feedback gives away a later answer (checked in selfTest). Forbidden content is never used:
   no lenticels, no salt exclusion at the root, no vivipary/propagules, no other mangrove animals, no fin anatomy beyond shape,
   the 150 cm spitting range only as given information. Misconceptions used as distractors: aerial roots absorb water vapour,
   aerial roots are for support, roots photosynthesise, leaves absorb salt; mudskippers have lungs, fins absorb oxygen;
   archerfish eyes give all-round vision, bands camouflage from fish below. */
import { rng, pickR, shuffleR, pickMixed } from "../core.js";

const KEY = "mangrove", W = 560;

/* ---------- geometry helpers ---------- */
const n1 = (v) => Math.round(v * 10) / 10;
const P2 = (p) => `${n1(p[0])} ${n1(p[1])}`;
const pth = (pts, close) => "M" + pts.map(P2).join("L") + (close ? "Z" : "");
const area = (pts) => { let a = 0; for (let i = 0; i < pts.length; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length]; a += x1 * y2 - x2 * y1; } return a / 2; };
const poly = (pts) => pth(area(pts) < 0 ? pts.slice().reverse() : pts, true);
const ellPts = (cx, cy, rx, ry, rot = 0, n = 24) => Array.from({ length: n }, (_, i) => { const t = (i / n) * 2 * Math.PI, x = rx * Math.cos(t), y = ry * Math.sin(t), c = Math.cos(rot), s = Math.sin(rot); return [cx + x * c - y * s, cy + x * s + y * c]; });
const rectPts = (x0, y0, x1, y1) => [[x0, y0], [x1, y0], [x1, y1], [x0, y1]];
function seg(P) {
  let d = "";
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
    d += `C${n1(p1[0] + (p2[0] - p0[0]) / 6)} ${n1(p1[1] + (p2[1] - p0[1]) / 6)} ${n1(p2[0] - (p3[0] - p1[0]) / 6)} ${n1(p2[1] - (p3[1] - p1[1]) / 6)} ${P2(p2)}`;
  }
  return d;
}
const smoothO = (P) => `M${P2(P[0])}${seg(P)}`;
function smoothC(P) {
  const n = P.length; let d = `M${P2(P[0])}`;
  for (let i = 0; i < n; i++) {
    const p0 = P[(i - 1 + n) % n], p1 = P[i], p2 = P[(i + 1) % n], p3 = P[(i + 2) % n];
    d += `C${n1(p1[0] + (p2[0] - p0[0]) / 6)} ${n1(p1[1] + (p2[1] - p0[1]) / 6)} ${n1(p2[0] - (p3[0] - p1[0]) / 6)} ${n1(p2[1] - (p3[1] - p1[1]) / 6)} ${P2(p2)}`;
  }
  return d + "Z";
}
const qpt = (a, c, b, t) => [(1 - t) ** 2 * a[0] + 2 * (1 - t) * t * c[0] + t * t * b[0], (1 - t) ** 2 * a[1] + 2 * (1 - t) * t * c[1] + t * t * b[1]];
function tubePts(pts, hw) {
  const L = [], R = [];
  pts.forEach((p, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1, nx = (-dy / l) * hw, ny = (dx / l) * hw; L.push([p[0] + nx, p[1] + ny]); R.push([p[0] - nx, p[1] - ny]); });
  return L.concat(R.reverse());
}
/** affine map local → page: rotate, scale, face (±1 flips the organism), translate, then mirror the whole page */
function mat(mirror, s, rot, face, fx, fy) { const M = mirror ? -1 : 1, c = Math.cos(rot), sn = Math.sin(rot); return [M * face * s * c, s * sn, -M * face * s * sn, s * c, M * fx + (mirror ? W : 0), fy]; }
const ap = (m, p) => [m[0] * p[0] + m[2] * p[1] + m[4], m[1] * p[0] + m[3] * p[1] + m[5]];
const mstr = (m) => `matrix(${m.map((v) => +v.toFixed(5)).join(" ")})`;
const bbox = (pts) => { const xs = pts.map((p) => p[0]), ys = pts.map((p) => p[1]); return [Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]; };

/* ================= TREE ================= */
const mudT = (F, x) => 322 + Math.max(0, F.TX - 50 - x) * 0.13 - Math.max(0, x - F.TX) * 0.045 + 1.4 * Math.sin(x / 23 + F.ph);
const TREE_BOT = 384, TREE_H = 406;
const IC = [476, 96], IR = 56;
function leafGeo() {
  const t1 = [IC[0] - 40, IC[1] + 16], t2 = [IC[0] + 38, IC[1] - 14], dx = t2[0] - t1[0], dy = t2[1] - t1[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L, h = 30;
  const mid = [(t1[0] + t2[0]) / 2, (t1[1] + t2[1]) / 2], c1 = [mid[0] + nx * h, mid[1] + ny * h], c2 = [mid[0] - nx * h, mid[1] - ny * h];
  const at = (u, v) => [t1[0] + dx * u + nx * v * 2 * u * (1 - u) * h, t1[1] + dy * u + ny * v * 2 * u * (1 - u) * h];
  return { t1, t2, c1, c2, at };
}
function makeTree(r, F) {
  F.TX = 200 + r() * 22; F.tw = 10 + r() * 2.5; F.ph = r() * 6.28;
  const cr = { cx: F.TX + 6 + r() * 10, cy: 90 + r() * 6, rx: 112 + r() * 14, ry: 62 + r() * 8 };
  cr.k = Array.from({ length: 16 }, () => 0.95 + r() * 0.08); F.crown = cr;
  const roots = [];
  const left = r() < 0.6 ? [[48, 60, 250, 260], [82, 98, 228, 238], [118, 134, 205, 214]] : [[54, 68, 244, 256], [104, 124, 210, 222]];
  const right = [[48, 60, 248, 258], [86, 100, 216, 226]];
  for (const [sg, set] of [[-1, left], [1, right]]) for (const [d0, d1, a0, a1] of set) {
    const d = d0 + r() * (d1 - d0), y0 = a0 + r() * (a1 - a0), ex = F.TX + sg * d;
    roots.push({ sg, d, s: [F.TX + sg * F.tw * 0.6, y0], c: [F.TX + sg * d * 0.5, y0 - 22 - r() * 10], e: [ex, mudT(F, ex) + 14] });
  }
  F.roots = roots;
  const n = 6 + Math.floor(r() * 3), x0 = 384 + r() * 8, x1 = 526, pn = [];
  for (let i = 0; i < n; i++) pn.push({ x: x0 + (i * (x1 - x0)) / (n - 1) + (r() - 0.5) * 5, h: 36 + r() * 14, lean: (r() - 0.5) * 6 });
  F.pn = pn;
  const lo = Math.max(...pn.map((p) => mudT(F, p.x) - p.h + 14)), hi = mudT(F, F.TX - 60) - 4;
  if (hi - lo < 10) return false;
  F.WL = lo + r() * (hi - lo);
  const G = leafGeo(); F.salt = [];
  const ns = 11 + Math.floor(r() * 4);
  for (let t = 0; t < 400 && F.salt.length < ns; t++) { const u = 0.14 + r() * 0.72, v = (r() * 2 - 1) * 0.72, p = G.at(u, v); if (F.salt.every((q) => Math.hypot(q[0] - p[0], q[1] - p[1]) > 8)) F.salt.push(p); }
  F.small = [0.6, 1.0, 1.55, 2.1, 2.55].map((a) => a + (r() - 0.5) * 0.25);
  return true;
}
const crownPt = (cr, i, f = 1) => { const t = (i / 16) * 2 * Math.PI; return [cr.cx + cr.rx * cr.k[i % 16] * f * Math.cos(t), cr.cy + cr.ry * cr.k[i % 16] * f * Math.sin(t)]; };
const outerRoot = (F) => F.roots.filter((q) => q.sg < 0).sort((a, b) => b.d - a.d)[0];
const rootPts = (q, t0 = 0) => Array.from({ length: 21 }, (_, i) => qpt(q.s, q.c, q.e, t0 + ((1 - t0) * i) / 20));
const pnMud = (F, p) => mudT(F, p.x);

function treeParts(F) {
  const cr = F.crown, G = leafGeo(), last = F.pn[F.pn.length - 1], o = outerRoot(F), oa = qpt(o.s, o.c, o.e, 0.5);
  const tips = F.pn.map((p) => pnMud(F, p) - p.h), muds = F.pn.map((p) => pnMud(F, p));
  const tStart = (q) => { for (let t = 0; t <= 1; t += 0.01) if (Math.abs(qpt(q.s, q.c, q.e, t)[0] - F.TX) >= F.tw + 10) return t; return 0.3; };
  return [
    { id: "trunk", name: "trunk", anchor: [F.TX + F.tw * 0.9, 192], lab: [F.TX + 64, 184],
      tap: [rectPts(F.TX - F.tw - 6, cr.cy + cr.ry * 1.16, F.TX + F.tw + 6, mudT(F, F.TX) + 4)] },
    { id: "prop", name: "prop root", anchor: oa, lab: [oa[0] - 44, oa[1] - 30], tap: F.roots.map((q) => tubePts(rootPts(q, tStart(q)), 12)) },
    { id: "pneu", name: "pneumatophore", anchor: [last.x + last.lean * 0.4 + 2, pnMud(F, last) - last.h * 0.5], lab: [Math.min(546, last.x + 24), pnMud(F, last) - last.h - 14],
      tap: [rectPts(F.pn[0].x - 12, Math.min(...tips) - 8, last.x + 12, Math.max(...muds) + 6)] },
    { id: "leaf", name: "leaf", anchor: G.at(0.62, 0.45), lab: [546, 44], tap: [ellPts(cr.cx, cr.cy, cr.rx * 1.1, cr.ry * 1.14), ellPts(IC[0], IC[1], IR, IR)] },
  ];
}
function treeDraw(F) {
  const cr = F.crown, G = leafGeo();
  let s = "";
  // water (estuary) and mud
  let xe = W; for (let x = 0; x <= W; x += 2) if (mudT(F, x) <= F.WL) { xe = x; break; }
  const surf = []; for (let x = 0; x <= W; x += 4) surf.push([x, mudT(F, x)]);
  const wpts = [[0, F.WL], [xe, F.WL]]; for (let x = xe; x >= 0; x -= 4) wpts.push([x, mudT(F, x)]);
  s += `<path d="${pth(wpts, true)}" class="mg-water"/>`;
  const mud = surf.concat([[W, TREE_BOT], [0, TREE_BOT]]);
  s += `<path d="${pth(mud, true)}" class="mg-bg"/><path d="${pth(mud, true)}" fill="url(#${KEY}-hat)"/><path d="${pth(surf)}" class="mg-ln mg-mudl"/>`;
  s += `<line x1="0" y1="${n1(F.WL)}" x2="${xe}" y2="${n1(F.WL)}" class="mg-surf"/>`;
  // root under the mud, with the pneumatophores rising from it
  const cab = []; for (let x = F.TX + F.tw - 2; x <= 538; x += 6) cab.push([x, mudT(F, x) + 17 + 1.5 * Math.sin(x / 31)]);
  s += `<path d="${smoothO(cab)}" class="mg-tubeo"/><path d="${smoothO(cab)}" class="mg-tubei"/>`;
  for (const p of F.pn) {
    const m = pnMud(F, p), cy = mudT(F, p.x) + 17 + 1.5 * Math.sin(p.x / 31), tx = p.x + p.lean, ty = m - p.h;
    s += `<path d="${pth([[p.x - 3.4, cy], [p.x - 2.6 + p.lean * 0.5, m - p.h * 0.5], [tx - 1.3, ty + 5], [tx, ty], [tx + 1.3, ty + 5], [p.x + 2.6 + p.lean * 0.5, m - p.h * 0.5], [p.x + 3.4, cy]], true)}" class="mg-part"/>`;
  }
  // prop roots (outlined tubes) with rootlets in the mud
  for (const q of F.roots) {
    const d = smoothO(rootPts(q));
    s += `<path d="${d}" class="mg-tubeo mg-rt"/><path d="${d}" class="mg-tubei mg-rti"/>`;
    s += `<path d="M${P2(q.e)}l${-5 * q.sg} 9M${P2(q.e)}l${6 * q.sg} 8M${P2(q.e)}l0 10" class="mg-ln mg-thin"/>`;
  }
  // trunk
  const ty0 = cr.cy + cr.ry * 0.7, ty1 = mudT(F, F.TX) + 22;
  s += `<path d="${pth([[F.TX - F.tw * 0.8, ty0], [F.TX + F.tw * 0.8, ty0], [F.TX + F.tw, ty1], [F.TX - F.tw, ty1]], true)}" class="mg-part"/>`;
  s += `<path d="M${n1(F.TX - 3)} ${n1(ty0 + 60)}v14M${n1(F.TX + 4)} ${n1(ty0 + 95)}v16M${n1(F.TX - 2)} ${n1(ty0 + 128)}v12" class="mg-ln mg-thin"/>`;
  // crown: scalloped outline, branches, a few leaves; the leaf shown enlarged sticks out on the inset side
  let cd = `M${P2(crownPt(cr, 0))}`;
  for (let i = 0; i < 16; i++) { const a = crownPt(cr, i), b = crownPt(cr, i + 1), m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], c = [cr.cx + (m[0] - cr.cx) * 1.13, cr.cy + (m[1] - cr.cy) * 1.16]; cd += `Q${P2(c)} ${P2(b)}`; }
  s += `<path d="${cd}Z" class="mg-part"/>`;
  const bt = [F.TX, cr.cy + cr.ry * 0.72];
  const fork = [F.TX, cr.cy + cr.ry * 0.25];
  s += `<path d="M${P2(bt)}L${P2(fork)}" class="mg-ln mg-br"/>`;
  for (const [fx, fy, o] of [[-0.6, -0.05, bt], [-0.25, -0.6, fork], [0.2, -0.65, fork], [0.58, -0.1, fork], [0.3, 0.3, bt]]) { const e = [cr.cx + cr.rx * fx, cr.cy + cr.ry * fy], c = [(o[0] + e[0]) / 2, Math.min(o[1], e[1]) + 4]; s += `<path d="M${P2(o)}Q${P2(c)} ${P2(e)}" class="mg-ln mg-thin"/>`; }
  const leafS = (c, len, wd, rot) => { const ca = Math.cos(rot), sa = Math.sin(rot), a = [c[0] - len * ca, c[1] - len * sa], b = [c[0] + len * ca, c[1] + len * sa], k1 = [c[0] - wd * sa, c[1] + wd * ca], k2 = [c[0] + wd * sa, c[1] - wd * ca]; return `<path d="M${P2(a)}Q${P2(k1)} ${P2(b)}Q${P2(k2)} ${P2(a)}Z" class="mg-part mg-thinl"/><path d="M${P2(a)}L${P2(b)}" class="mg-ln mg-thin"/>`; };
  for (const a of F.small) { const c = [cr.cx + cr.rx * 1.02 * Math.cos(a), cr.cy + cr.ry * 1.06 * Math.sin(a)]; s += leafS(c, 8, 6, a + Math.PI / 2 + 0.5); }
  const tl = [cr.cx + cr.rx * cr.k[0] * 1.08, cr.cy + 4];
  s += leafS(tl, 10, 7, -0.35) + `<circle cx="${n1(tl[0] - 2)}" cy="${n1(tl[1] + 0.5)}" r="1.1" class="mg-dot"/><circle cx="${n1(tl[0] + 3)}" cy="${n1(tl[1] - 1)}" r="1.1" class="mg-dot"/>`;
  // inset: the leaf enlarged, with salt crystals
  const g1 = [IC[0] + IR * Math.cos(2.5), IC[1] + IR * Math.sin(2.5)], g2 = [IC[0] + IR * Math.cos(3.8), IC[1] + IR * Math.sin(3.8)];
  s += `<path d="M${P2([tl[0] + 9, tl[1] - 3])}L${P2(g2)}M${P2([tl[0] + 9, tl[1] + 3])}L${P2(g1)}" class="mg-ln mg-thin mg-dash"/>`;
  s += `<circle cx="${IC[0]}" cy="${IC[1]}" r="${IR}" class="mg-inset"/>`;
  s += `<path d="M${P2(G.t1)}Q${P2(G.c1)} ${P2(G.t2)}Q${P2(G.c2)} ${P2(G.t1)}Z" class="mg-part"/><path d="M${P2([G.t1[0] - 9, G.t1[1] + 5])}L${P2(G.t2)}" class="mg-ln"/>`;
  for (const u of [0.26, 0.42, 0.58, 0.74]) for (const v of [-1, 1]) { const a = G.at(u, 0), b = G.at(u + 0.1, v * 0.8); s += `<path d="M${P2(a)}L${P2(b)}" class="mg-ln mg-thin"/>`; }
  for (const p of F.salt) s += `<circle cx="${n1(p[0])}" cy="${n1(p[1])}" r="2.2" class="mg-dot"/>`;
  return s;
}
function treeTexts(F) {
  return [["water", 10, F.WL + 15, "start"], ["mud", 14, 372, "start"], ["enlarged view", IC[0], IC[1] + IR + 16, "middle"], ["not to scale", W - 10, TREE_H - 6, "end"]];
}

/* ================= MUDSKIPPER ================= */
const MS_FLAT = 470;
const mudM = (F, x) => F.MUD + 1.2 * Math.sin(x / 19 + F.ph) + Math.min(70, Math.max(0, x - MS_FLAT) * 0.9);
// local outline: facing +x, the mud at y = 0
const MS_BODY = [[162, -26], [156, -44], [136, -58], [112, -62], [84, -58], [44, -54], [0, -50], [-50, -44], [-100, -34], [-132, -26], [-134, -13], [-96, -11], [-46, -11], [0, -13], [40, -15], [62, -15], [76, -10], [94, -4], [116, -4], [136, -8], [151, -14], [160, -20]];
function makeMud(r, F) {
  F.MUD = 176 + r() * 6; F.ph = r() * 6.28; F.WL = F.MUD + 12 + r() * 12;
  F.s = 1.04 + r() * 0.08; F.face = r() < 0.5 ? 1 : -1; F.fx = 256 + r() * 14;
  F.spots = []; for (let t = 0; t < 200 && F.spots.length < 9; t++) { const x = -116 + r() * 180, y = -42 + r() * 24 + (x < -60 ? 6 : 0); if (F.spots.every((p) => Math.hypot(p[0] - x, p[1] - y) > 14)) F.spots.push([x, y]); }
  F.m = mat(F.mirror, F.s, 0, F.face, F.fx, F.MUD);
  return true;
}
function mudParts() {
  return [
    { id: "dorsal", name: "dorsal fin", anchor: [24, -98], lab: [6, -140], tap: [rectPts(-2, -114, 50, -52)] },
    { id: "caudal", name: "caudal (tail) fin", anchor: [-170, -17], lab: [-206, -54], tap: [rectPts(-188, -42, -130, 2)] },
    { id: "pelv", name: "pelvic fin", anchor: [10, -4], lab: [2, 42], tap: [rectPts(-14, -24, 30, 14)] },
    { id: "pect", name: "pectoral fin", anchor: [58, -12], lab: [66, 42], tap: [rectPts(30, -40, 86, 8)] },
    { id: "mouth", name: "mouth", anchor: [157, -22], lab: [198, -54], tap: [rectPts(140, -42, 176, -10)] },
    { id: "gill", name: "enlarged gill chamber", anchor: [106, -20], lab: [150, 40], tap: [ellPts(104, -24, 26, 19)] },
    { id: "eye", name: "eye", anchor: [118, -74], lab: [140, -122], tap: [ellPts(113, -69, 18, 14)] },
  ];
}
function mudDrawFish(F) {
  let s = "";
  s += `<path d="${smoothO([[-6, -49], [-16, -70], [-62, -64], [-106, -50], [-128, -31]])}" class="mg-fin"/>`;
  s += `<path d="M-30 -48L-36 -66M-60 -45L-66 -62M-90 -39L-96 -53" class="mg-ln mg-thin"/>`;
  s += `<path d="${smoothC([[46, -53], [44, -80], [34, -106], [18, -110], [6, -90], [2, -49]])}" class="mg-fin"/>`;
  s += `<path d="M38 -54L34 -98M28 -54L25 -106M18 -53L16 -104M10 -52L10 -86" class="mg-ln mg-thin"/>`;
  s += `<path d="${smoothC([[-130, -30], [-152, -38], [-176, -28], [-184, -18], [-176, -6], [-152, -3], [-130, -13]])}" class="mg-fin"/>`;
  s += `<path d="M-136 -21L-180 -18M-136 -25L-172 -30M-136 -17L-172 -8" class="mg-ln mg-thin"/>`;
  s += `<circle cx="105" cy="-70" r="10" class="mg-body"/>`;
  s += `<path d="${smoothC(MS_BODY)}" class="mg-body"/>`;
  // the enlarged gill chamber: a shaded, swollen region behind the mouth, edged by the gill cover
  s += `<path d="M128 -50${seg([[128, -50], [100, -46], [80, -30], [82, -12], [96, -4]])}${seg([[96, -4], [116, -4], [136, -8], [148, -14]])}${seg([[148, -14], [146, -32], [128, -50]])}Z" class="mg-tint"/>`;
  s += `<path d="${smoothO([[128, -50], [100, -46], [80, -30], [82, -12], [96, -4]])}" class="mg-ln"/>`;
  s += `<path d="${smoothO([[161, -24], [150, -20], [140, -21]])}" class="mg-ln"/>`;
  for (const [x, y] of F.spots) s += `<circle cx="${n1(x)}" cy="${n1(y)}" r="1.7" class="mg-dot"/>`;
  s += `<circle cx="118" cy="-68" r="12" class="mg-body"/><circle cx="121" cy="-69" r="5.5" class="mg-dot"/>`;
  s += `<path d="${smoothC([[38, -34], [52, -36], [62, -20], [86, -6], [88, -1], [46, 0], [44, -8], [34, -22]])}" class="mg-fin"/>`;
  s += `<path d="M58 -14L54 0M62 -12L64 -1M66 -10L74 -1M70 -9L84 -2" class="mg-ln mg-thin"/>`;
  s += `<path d="${smoothC([[10, -14], [24, -14], [28, -4], [26, 0], [-6, 0], [-4, -6], [4, -12]])}" class="mg-fin"/><path d="M16 -12L8 -1M20 -12L18 0M24 -10L24 -1" class="mg-ln mg-thin"/>`;
  return s;
}
function mudScene(F) {
  const H = mudH(F); let s = "";
  let xe = W; for (let x = MS_FLAT; x <= W; x += 2) if (mudM(F, x) >= F.WL) { xe = x; break; }
  const surf = []; for (let x = 0; x <= W; x += 4) surf.push([x, mudM(F, x)]);
  const wp = [[xe, F.WL], [W, F.WL]]; for (let x = W; x >= xe; x -= 4) wp.push([x, mudM(F, x)]);
  s += `<path d="${pth(wp, true)}" class="mg-water"/>`;
  const mud = surf.concat([[W, H - 14], [0, H - 14]]);
  s += `<path d="${pth(mud, true)}" class="mg-bg"/><path d="${pth(mud, true)}" fill="url(#${KEY}-hat)"/><path d="${pth(surf)}" class="mg-ln mg-mudl"/>`;
  s += `<line x1="${xe}" y1="${n1(F.WL)}" x2="${W}" y2="${n1(F.WL)}" class="mg-surf"/>`;
  return s;
}
const mudH = (F) => Math.round(F.MUD + 94);
const mudTexts = (F) => [["water", W - 12, F.WL + 18, "end"], ["mud", 12, F.MUD + 72, "start"], ["not to scale", W - 10, 18, "end"]];

/* ================= ARCHERFISH ================= */
const AR_SURF = 44, AR_H = 300;
const AR_UP = [[154, -22], [130, -33], [100, -43], [70, -50], [35, -56], [0, -58], [-40, -55], [-80, -44], [-110, -30], [-128, -17]];
const AR_LO = [[-128, 11], [-105, 21], [-70, 37], [-30, 49], [10, 55], [55, 51], [95, 38], [128, 20], [150, 6], [163, -7], [171, -19], [175, -31]];
const arBodyD = () => `M${P2(AR_UP[0])}${seg(AR_UP)}L${P2(AR_LO[0])}${seg(AR_LO)}Z`;
const backY = (x) => { for (let i = 0; i < AR_UP.length - 1; i++) { const [x1, y1] = AR_UP[i], [x2, y2] = AR_UP[i + 1]; if (x <= x1 && x >= x2) return y1 + ((y2 - y1) * (x1 - x)) / (x1 - x2); } return -20; };
function makeArcher(r, F) {
  F.nb = 4 + Math.floor(r() * 3); F.s = 0.92 + r() * 0.07; F.face = r() < 0.5 ? 1 : -1; F.rot = -(0.09 + r() * 0.08);
  F.fx = 280 + (r() - 0.5) * 24; F.fy = 168 + r() * 8;
  const x0 = 80, x1 = -104, sp = (x0 - x1) / (F.nb - 1);
  F.bands = Array.from({ length: F.nb }, (_, i) => ({ x: x0 - i * sp + (r() - 0.5) * 4, w: 13 + r() * 4, yb: 14 + r() * 14 }));
  F.m = mat(F.mirror, F.s, F.rot, F.face, F.fx, F.fy);
  return true;
}
function archerParts(F) {
  const b = F.bands[1];
  return [
    { id: "dorsal", name: "dorsal fin", anchor: [-46, -78], lab: [-60, -124], tap: [[[-12, -56], [-24, -96], [-48, -100], [-78, -82], [-106, -34]]] },
    { id: "anal", name: "anal fin", anchor: [-58, 72], lab: [-70, 112], tap: [[[-18, 48], [-34, 88], [-60, 92], [-92, 70], [-116, 20]]] },
    { id: "caudal", name: "caudal (tail) fin", anchor: [-166, -8], lab: [-212, -26], tap: [[[-124, -20], [-184, -54], [-174, -14], [-186, 36], [-124, 16]]] },
    { id: "pelvic", name: "pelvic fin", anchor: [30, 66], lab: [20, 110], tap: [[[56, 46], [44, 96], [8, 94], [6, 48]]] },
    { id: "band", name: "dark bands", anchor: [b.x + 2, (backY(b.x) + b.yb) / 2 - 8], lab: [b.x - 6, -100], tap: F.bands.map((q) => rectPts(q.x - 13 + 2, backY(q.x) + 1, q.x + 13 + 2, q.yb + 4)) },
    { id: "pect", name: "pectoral fin", anchor: [60, 14], lab: [98, 92], tap: [ellPts(64, 13, 30, 20)] },
    { id: "eye", name: "eye", anchor: [126, -24], lab: [150, -80], tap: [ellPts(126, -16, 17, 17)] },
    { id: "mouth", name: "mouth", anchor: [170, -22], lab: [216, -40], tap: [rectPts(144, -42, 188, -2)] },
  ];
}
function archerDrawFish(F) {
  let s = `<defs><clipPath id="${KEY}-body-${F.seed}"><path d="${arBodyD()}"/></clipPath></defs>`;
  s += `<path d="${pth([[-16, -55], [-26, -86], [-44, -90], [-70, -74], [-98, -37]], true)}" class="mg-fin"/><path d="M-26 -55L-28 -84M-40 -53L-44 -87M-56 -50L-60 -80M-72 -46L-76 -68" class="mg-ln mg-thin"/>`;
  s += `<path d="${pth([[-22, 50], [-34, 80], [-56, 84], [-84, 66], [-110, 22]], true)}" class="mg-fin"/><path d="M-34 48L-40 78M-50 44L-56 80M-68 38L-74 70" class="mg-ln mg-thin"/>`;
  s += `<path d="${pth([[-124, -16], [-150, -30], [-176, -46], [-168, -14], [-170, 6], [-178, 30], [-150, 20], [-124, 12]], true)}" class="mg-fin"/><path d="M-128 -6L-170 -30M-128 -1L-168 -4M-128 4L-172 22" class="mg-ln mg-thin"/>`;
  s += `<path d="${pth([[46, 52], [34, 78], [24, 76], [20, 54]], true)}" class="mg-fin"/>`;
  s += `<path d="${arBodyD()}" class="mg-body"/>`;
  s += `<g clip-path="url(#${KEY}-body-${F.seed})">` + F.bands.map((q) => { const t = backY(q.x) - 8; return `<path d="${pth([[q.x - q.w / 2 + 4, t], [q.x + q.w / 2 + 4, t], [q.x + 3, q.yb], [q.x - 3, q.yb]], true)}" class="mg-band"/>`; }).join("") + `</g>`;
  s += `<path d="${smoothO([[98, -36], [90, -18], [90, 4], [98, 28]])}" class="mg-ln"/>`;
  s += `<path d="${smoothO([[174, -29], [162, -16], [146, -9]])}" class="mg-ln"/>`;
  s += `<circle cx="126" cy="-16" r="13" class="mg-body"/><circle cx="130" cy="-17" r="6" class="mg-dot"/>`;
  s += `<path d="${smoothC([[86, 6], [70, 2], [52, 8], [46, 18], [60, 22], [78, 18]])}" class="mg-fin"/><path d="M82 9L52 12M82 12L50 18M82 15L60 21" class="mg-ln mg-thin"/>`;
  return s;
}
function archerScene() {
  let s = `<rect x="0" y="${AR_SURF}" width="${W}" height="${AR_H - AR_SURF}" class="mg-water"/>`;
  let d = `M0 ${AR_SURF}`; for (let x = 0; x < W; x += 14) d += `Q${x + 7} ${AR_SURF - 3} ${x + 14} ${AR_SURF}`;
  return s + `<path d="${d}" class="mg-surf"/>`;
}
const archerTexts = () => [["air", 12, 30, "start"], ["water", 12, 66, "start"], ["not to scale", W - 10, 28, "end"]];

/* ================= shared ================= */
const PARTS = (F) => (F.mode === "tree" ? treeParts(F) : F.mode === "mud" ? mudParts(F) : archerParts(F));
const partOf = (F, id) => PARTS(F).find((p) => p.id === id);
const figH = (F) => (F.mode === "tree" ? TREE_H : F.mode === "mud" ? mudH(F) : AR_H);
/** letters: each lettered part gets the next letter, top to bottom then left to right on the page */
function letters(F) {
  const ps = F.lettered.map((id) => { const p = partOf(F, id); return { id, L: ap(F.m, p.lab) }; }).sort((a, b) => a.L[1] - b.L[1] || a.L[0] - b.L[0]);
  return Object.fromEntries(ps.map((p, i) => [p.id, "ABCDE"[i]]));
}
const TAPS = (F, id) => partOf(F, id).tap.map((pts) => pts.map((p) => ap(F.m, p)));

function make(seed) {
  for (let tries = 0; tries < 200; tries++) {
    const r = rng(seed + tries * 7919 + 5);
    const F = { kind: KEY, seed, mode: ["tree", "mud", "archer"][Math.floor(r() * 3)], mirror: r() < 0.5 };
    if (F.mode === "tree") { if (!makeTree(r, F)) continue; F.m = mat(F.mirror, 1, 0, 1, 0, 0); }
    if (F.mode === "mud") makeMud(r, F);
    if (F.mode === "archer") makeArcher(r, F);
    // roles (see the header): tap T (function stated), function of Z, name X; the group left over goes to the tick question
    let others;
    if (F.mode === "tree") {
      [F.T, F.Z] = shuffleR(r, ["prop", "leaf"]);
      F.X = F.Z === "prop" && r() < 0.4 ? "prop" : "pneu";
      others = ["prop", "pneu", "leaf", "trunk"];
    } else if (F.mode === "mud") {
      F.gT = r() < 0.5 ? "fins" : "gill";
      if (F.gT === "fins") { F.X = "gill"; F.gZ = r() < 0.5 ? "eye" : "gill"; }
      else { F.X = r() < 0.5 ? "pect" : "pelv"; F.gZ = r() < 0.5 ? "eye" : "fins"; }
      F.Z = F.gZ === "fins" ? (F.X === "pect" ? "pelv" : "pect") : F.gZ;
      F.g3 = ["eye", "fins", "gill"].find((g) => g !== F.gT && g !== F.gZ);
      others = ["eye", "pect", "pelv", "gill", "mouth", "dorsal", "caudal"];
    } else {
      F.T = "band"; F.Z = r() < 0.5 ? "eye" : "mouth"; F.g3 = F.Z === "eye" ? "mouth" : "eye";
      F.X = pickR(r, ["dorsal", "pect", "anal", "pelvic"]);
      F.N = pickR(r, ["dorsal", "anal", "pelvic", "pect"].filter((x) => x !== F.X));
      others = ["eye", "mouth", "band", "dorsal", "caudal", "pect", "anal", "pelvic"];
    }
    const need = [...new Set([F.X, F.Z])], rest = shuffleR(r, others.filter((x) => !need.includes(x)));
    const tot = F.mode === "tree" ? 3 + Math.floor(r() * 2) : 3 + Math.floor(r() * 3);
    F.lettered = need.concat(rest.slice(0, Math.max(0, tot - need.length)));
    F.L = letters(F);
    // letters stay inside the figure and apart from each other
    const Ls = F.lettered.map((id) => ap(F.m, partOf(F, id).lab)), H = figH(F);
    if (Ls.some((p) => p[0] < 12 || p[0] > W - 12 || p[1] < 14 || p[1] > H - 8)) continue;
    if (Ls.some((p, i) => Ls.some((q, j) => j > i && Math.hypot(p[0] - q[0], p[1] - q[1]) < 30))) continue;
    return F;
  }
  throw new Error("mangrove: no layout");
}

function svg(F, opt) {
  opt = opt || {}; const hl = opt.hl || {}, H = figH(F);
  let s = `<defs><pattern id="${KEY}-hat" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="8" class="mg-hat"/></pattern></defs>`;
  const sc = mstr(mat(F.mirror, 1, 0, 1, 0, 0));
  if (F.mode === "tree") s += `<g transform="${sc}">${treeDraw(F)}</g>`;
  if (F.mode === "mud") s += `<g transform="${sc}">${mudScene(F)}</g><g transform="${mstr(F.m)}">${mudDrawFish(F)}</g>`;
  if (F.mode === "archer") s += `<g transform="${sc}">${archerScene(F)}</g><g transform="${mstr(F.m)}">${archerDrawFish(F)}</g>`;
  // words on the figure (never a part name); mirrored with the page
  const T = F.mode === "tree" ? treeTexts(F) : F.mode === "mud" ? mudTexts(F) : archerTexts(F);
  for (const [t, x, y, a] of T) { const X = F.mirror ? W - x : x, A = F.mirror ? { start: "end", end: "start", middle: "middle" }[a] : a; s += `<text x="${n1(X)}" y="${n1(y)}" text-anchor="${A}" class="mg-sm">${t}</text>`; }
  // highlight after Check
  if (hl.part) s += `<path d="${TAPS(F, hl.part).map(poly).join("")}" class="mg-hl"/>`;
  // label lines and letters
  for (const id of F.lettered) {
    const p = partOf(F, id), A = ap(F.m, p.anchor), L = ap(F.m, p.lab), d = Math.hypot(L[0] - A[0], L[1] - A[1]), e = [L[0] + ((A[0] - L[0]) * 10) / d, L[1] + ((A[1] - L[1]) * 10) / d];
    s += `<line x1="${n1(A[0])}" y1="${n1(A[1])}" x2="${n1(e[0])}" y2="${n1(e[1])}" class="mg-lab"/>`;
    s += `<rect x="${n1(L[0] - 11)}" y="${n1(L[1] - 12)}" width="22" height="24" rx="4" class="mg-lbg"/><text x="${n1(L[0])}" y="${n1(L[1] + 7)}" text-anchor="middle" class="mg-let">${F.L[id]}</text>`;
  }
  // tap areas
  if (opt.tapMode) for (const p of PARTS(F)) s += `<path d="${TAPS(F, p.id).map(poly).join("")}" fill="transparent" data-tap="${p.id}"/>`;
  // archerfish: drawn on a fixed light card in both themes, so the dark bands read as dark against a light body
  // (approved exception to the CSS-variable rule; letters, lines and highlights inherit the card's ink)
  if (F.mode === "archer") s = `<g class="mg-card"><rect x="0" y="0" width="${W}" height="${H}" rx="10" class="mg-cardbg"/>${s}</g>`;
  const al = { tree: "A mangrove tree in an estuary, drawn from the side and cut through the mud, with one leaf shown enlarged", mud: "A mudskipper on the mud at the water's edge, drawn from the side", archer: "A banded archerfish just below the water surface, drawn from the side" }[F.mode];
  return `<svg viewBox="0 0 ${W} ${H}" class="figsvg fig-${KEY}" role="img" aria-label="${al}, with lettered label lines">${s}</svg>`;
}

/* ---------- questions ---------- */
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const NAMEB = { prop: "prop root", pneu: "pneumatophore", leaf: "leaf", trunk: "trunk", eye: "eye", pect: "pectoral fin", pelv: "pelvic fin", pelvic: "pelvic fin", gill: "enlarged gill chamber", mouth: "mouth", dorsal: "dorsal fin", caudal: "caudal (tail) fin", anal: "anal fin", band: "dark bands" };
const WHERE = { pect: "the fin just behind the head, one on each side", pelv: "the small fin on the underside of the body", pelvic: "the small fin on the underside of the body, about halfway along", dorsal: "the fin on the back", anal: "the fin on the underside of the body, near the tail", caudal: "the tail fin" };
const tapQ = (F, q) => Object.assign({ kind: "tap", labelOf: () => "the part you tapped", hint: q.multi ? "Tap two parts of the drawing, then press Check." : "Tap one part of the drawing.", askOpt: { tapMode: true }, doneOpt: () => ({ tapMode: true }) }, q);
const nameOpts = (r, key, pool) => {
  let d = shuffleR(r, pool.filter((x) => x !== key)).slice(0, 3);
  if (key.length >= Math.max(...d.map((x) => x.length))) { const lg = pool.filter((x) => x !== key && !d.includes(x) && x.length > key.length); if (lg.length) d[2] = lg[0]; }
  return [key, ...d];
};

/* tree */
const COND = [
  { g: "oxy", T: "The waterlogged mud around its roots holds very little oxygen.", F: "The mud around its roots is well drained and holds plenty of oxygen.", w: "the mud is waterlogged: its spaces are filled with water, so it holds very little oxygen" },
  { g: "salt", T: "Salty sea water covers its roots when the tide comes in.", F: "The water around its roots at high tide is fresh river water.", w: "at high tide, salty sea water comes into the estuary and covers the roots" },
  { g: "tide", T: "It grows in the intertidal zone, so the tide covers and uncovers its roots.", F: "It grows below the low-tide mark, where the tide does not uncover its roots.", w: "mangrove forests grow in the intertidal zone, so the tide covers and uncovers the roots" },
  { g: "river", T: "River water keeps flowing into the estuary when the tide is out.", F: "The river stops flowing into the estuary when the tide is out.", w: "the river keeps flowing, so at low tide river water fills more of the estuary" },
];
function treeQs(F, r) {
  const qs = [], L = F.L;
  // 1. name the part labelled X (identification only: no function in the feedback)
  const kX = NAMEB[F.X], oX = F.X === "pneu" ? ["pneumatophore", "prop root", "rhizome", "storage taproot"] : ["prop root", "pneumatophore", "rhizome", "storage taproot"];
  qs.push({ kind: "choice", q: `Name the part labelled <b>${L[F.X]}</b>.`, options: oX, a: 0, hl: { part: F.X }, _leak: F.X === "pneu" ? /pneumatophore/i : /prop root/i,
    why: F.X === "pneu" ? `${L.pneu} is a <b>pneumatophore</b> (an aerial root): one of the upright roots that grow up out of the mud from a root running under the surface.`
      : `${L.prop} is a <b>prop root</b>: one of the roots that arch out from the trunk and down into the mud.` });
  // 2. the conditions the tree lives in (one statement per group)
  let pick;
  for (let t = 0; t < 30; t++) { pick = shuffleR(r, COND).slice(0, 4).map((c) => ({ c, v: r() < 0.5 })); if (pick.some((x) => x.v) && pick.some((x) => !x.v)) break; }
  if (!pick.some((x) => x.v)) pick[0].v = true; if (pick.every((x) => x.v)) pick[1].v = false;
  qs.push({ kind: "multi", q: "Tick <b>every</b> statement that is true about the place where this tree grows.", options: pick.map((x) => (x.v ? x.c.T : x.c.F)), a: pick.map((x, i) => (x.v ? i : -1)).filter((i) => i >= 0), hl: {}, _st: pick,
    why: pick.map((x) => (x.v ? `✓ ${x.c.T}` : `✗ ${x.c.F}: ${x.c.w}.`)).join("<br>") + "<br>The tree's adaptations let it live with these conditions." });
  // 3. tap the part that does a stated job
  if (F.T === "prop") qs.push(tapQ(F, { q: "Tap the part of the tree that holds it firmly in the soft mud against the flow of the tides.", a: ["prop"], ansTxt: "the prop roots", _leak: /prop root/i,
    why: "The <b>prop roots</b> arch out from the trunk and down into the soft mud. Like the ropes of a tent, they hold the tree firmly in place so that the tidal flow does not wash it over." }));
  else qs.push(tapQ(F, { q: "Tap the part of the tree that secretes (gets rid of) excess salt.", a: ["leaf"], ansTxt: "the leaves", _leak: /secret/i,
    why: "The <b>leaves</b> secrete excess salt. The tree takes in salty water, and the extra salt is pushed out onto the leaf surface, where it dries as crystals: the dots on the enlarged leaf." }));
  // 4. function of the part labelled Z
  if (F.Z === "prop") qs.push({ kind: "choice", q: `What is the function of the roots labelled <b>${L.prop}</b>?`, hl: { part: "prop" }, _leak: /firm|support/i,
    options: ["Holding the tree firmly in soft mud against tidal flow", "Absorbing water vapour from the air above the mud at low tide", "Carrying out photosynthesis to make extra food for the tree", "Storing fresh water for the tree to use when the tide is out"], a: 0,
    why: `${L.prop} is a <b>prop root</b>. Prop roots arch down from the trunk into the soft mud and <b>support</b> the tree, holding it firmly in place against the tidal flow.` });
  else qs.push({ kind: "choice", q: `<b>${L.leaf}</b> is a leaf, shown enlarged. The dots on it are crystals of salt. Which adaptation do they show?`, hl: { part: "leaf" }, _leak: /secret/i,
    options: ["The leaf secretes excess salt out of the tree.", "The leaf absorbs salt from sea spray for the tree to use.", "The leaf stores salt to make it taste bad to insects.", "The leaf traps salt from the air before it reaches the roots."], a: 0,
    why: "Mangrove leaves <b>secrete excess salt</b>. The tree takes in salty water, and the extra salt is pushed out onto the leaf surface, where it dries as crystals. Leaves do not absorb salt from the air or from sea spray." });
  // 5. explain: waterlogged, low-oxygen mud and the pneumatophores (every option starts from a true condition)
  qs.push({ kind: "choice", q: "The mud of a mangrove forest is waterlogged. Which statement explains how the <b>pneumatophores</b> (aerial roots) help the tree to survive there?", hl: { part: "pneu" }, _leak: /take[s]? in oxygen|gas exchange|respir/i,
    options: ["The mud holds little oxygen, so these roots take in oxygen from the air for respiration.", "The mud holds little oxygen, so these roots photosynthesise to make extra oxygen for the tree.", "The mud holds little oxygen, so these roots grow upwards to prop the tree up above it.", "The mud holds little oxygen, so these roots absorb water vapour from the air instead."], a: 0,
    why: "Waterlogged mud has its spaces filled with water, so it holds <b>very little oxygen</b>. The pneumatophores grow up out of the mud into the air and <b>take in oxygen</b> (gas exchange). The oxygen reaches the roots buried in the mud, so they can carry out <b>respiration</b> and release energy. Pneumatophores do not absorb water vapour, photosynthesise or prop the tree up: the prop roots support it." });
  return qs;
}

/* mudskipper */
const MUD_ST = {
  eye: [["Its eyes are set high on its head, for use out of the water.", true, "large eyes set high on the head are for use out of the water"],
    ["Its eyes are set low on its head, to look for food under the water.", false, "the eyes are set high on the head (look at the drawing), for use out of the water"],
    ["Its eyes are small, because it finds its food by touch in the mud.", false, "the eyes are large (look at the drawing), for use out of the water"]],
  fins: [["Its pectoral fins are shaped to prop up its body on the mud.", true, "the pectoral fins prop the body up and push it across the mud"],
    ["The shape of its pectoral and pelvic fins lets it move on land.", true, "the pectoral and pelvic fins are shaped for movement on land"],
    ["Its fins absorb oxygen from the air while they are moist.", false, "the fins are shaped for moving on land; they are not where oxygen is taken in"]],
  gill: [["Its enlarged gill chambers trap water, so it can get oxygen on land.", true, "the enlarged gill chambers trap water, so the gills can still take in oxygen out of the water"],
    ["Its gill chambers are enlarged to hold food it collects on the mud.", false, "the enlarged gill chambers trap water for the gills, not food"],
    ["Its gill chambers are enlarged to help it float in deep water.", false, "the enlarged gill chambers trap water for the gills when it is out of the water"]],
};
const MUD_GEN = [["It is a fish, and it has gills.", true, "a mudskipper is a fish, with gills and fins"], ["It is an amphibian, like a frog, so it is not a fish.", false, "a mudskipper is a fish, with gills and fins, even though it spends time out of the water"]];
const MUD_LOW = ["It spends time out of the water on the mud at low tide.", true, "it feeds and moves about on the mud when the tide is out"];
const MUD_LEAK = { eye: /\beyes?\b/i, fins: /move (about )?on land|movement on land|moving on land|props? (itself|its body|the body) up/i, gill: /trap/i };
function mudQs(F, r) {
  const qs = [], L = F.L;
  // 1. name X (identification only)
  if (F.X === "gill") qs.push({ kind: "choice", q: `Name the part labelled <b>${L.gill}</b>.`, options: ["enlarged gill chamber", "enlarged swim bladder", "throat pouch for storing food", "pectoral fin"], a: 0, hl: { part: "gill" }, _leak: /gill chamber/i,
    why: `${L.gill} is the <b>enlarged gill chamber</b>: the swollen area at the side of the head, behind the mouth, covered by the gill cover.` });
  else qs.push({ kind: "choice", q: `Name the fin labelled <b>${L[F.X]}</b>.`, options: nameOpts(r, NAMEB[F.X], ["pectoral fin", "pelvic fin", "dorsal fin", "caudal (tail) fin"]), a: 0, hl: { part: F.X }, _leak: F.X === "pect" ? /pectoral/i : /pelvic/i,
    why: `${L[F.X]} is a <b>${NAMEB[F.X]}</b>: ${WHERE[F.X]}.` });
  // 2. tap the part(s) that do a stated job
  if (F.gT === "fins") qs.push(tapQ(F, { q: "Tap <b>both</b> kinds of fin whose shape lets the mudskipper move about on land.", multi: true, a: ["pect", "pelv"], ansTxt: "the pectoral fin and the pelvic fin", _leak: MUD_LEAK.fins,
    why: "The <b>pectoral fins</b> (just behind the head) and the <b>pelvic fins</b> (underneath) are shaped for movement on land: the mudskipper props itself up on them and pushes itself across the mud." }));
  else qs.push(tapQ(F, { q: "Tap the part that traps a supply of water, so the mudskipper can still get oxygen when it is out of the water.", a: ["gill"], ansTxt: "the enlarged gill chamber", _leak: MUD_LEAK.gill,
    why: "The <b>enlarged gill chambers</b> at the sides of the head trap water. When the mudskipper is out of the water, its gills stay in this trapped water, so they can go on taking in oxygen." }));
  // 3. function of Z
  if (F.Z === "eye") qs.push({ kind: "choice", q: `The eye labelled <b>${L.eye}</b> is large and set high on the head. What is this adaptation for?`, hl: { part: "eye" }, _leak: MUD_LEAK.eye,
    options: ["Seeing well when the mudskipper is out of the water", "Giving binocular vision to aim jets of water at prey", "Seeing prey that is buried deep down in the mud", "Seeing in the dark inside its burrow under the mud"], a: 0,
    why: "Large eyes set high on the head are for <b>use out of the water</b>: the mudskipper can see around it while it is out on the mud, or while only the top of its head is above the water." });
  else if (F.Z === "gill") qs.push({ kind: "choice", q: `What is the function of the enlarged gill chamber labelled <b>${L.gill}</b>?`, hl: { part: "gill" }, _leak: MUD_LEAK.gill,
    options: ["Trapping water so it can get oxygen on land", "Holding a bubble of air to help it float at high tide", "Storing food to digest while it is out of the water", "Keeping its eyes moist while it is out of the water"], a: 0,
    why: `${L.gill} is an <b>enlarged gill chamber</b>. It traps water, so the gills stay in water and can go on taking in oxygen when the mudskipper is out on the mud.` });
  else qs.push({ kind: "choice", q: `What is the shape of the fin labelled <b>${L[F.Z]}</b> adapted for?`, hl: { part: F.Z }, _leak: MUD_LEAK.fins,
    options: ["Moving the mudskipper across the mud when it is on land", "Absorbing oxygen from the air while the fin is kept moist", "Pumping water over the gills while it is out of the water", "Splashing water over its skin to stop it drying out"], a: 0,
    why: `${L[F.Z]} is a <b>${NAMEB[F.Z]}</b>. The pectoral and pelvic fins are shaped for <b>movement on land</b>: the mudskipper props itself up on them and pushes itself over the mud.` });
  // 4. tick the true statements (the group not tested yet, plus general statements)
  const pool = MUD_ST[F.g3].map((x) => x.concat(F.g3)).concat([pickR(r, MUD_GEN).concat("gen"), MUD_LOW.concat("low")]);
  const st = pickMixed(r, pool, 4);
  qs.push({ kind: "multi", q: "Tick <b>every</b> statement that is true for the mudskipper.", options: st.map((x) => x[0]), a: st.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0), hl: {}, _st: st,
    _leak: MUD_LEAK[F.g3], why: st.map((x) => (x[1] ? `✓ ${x[0]}` : `✗ ${x[0]}: ${x[2]}.`)).join("<br>") });
  // 5. the lungs misconception: how it gets oxygen out of water
  const ds = [["They do have lungs, which take over from the gills as soon as the fish leaves the water at low tide.", null],
    ["They have no lungs; they absorb oxygen through their moist fins as they push themselves across the mud.", "fins"],
    ["They have no lungs; their gills take in oxygen straight from the dry air, so they do not need any water.", "gill"],
    ["They have no lungs; they hold their breath on land and go back into the water every few seconds.", null]];
  const dd = shuffleR(r, ds.filter((d) => d[1] !== F.g3)).slice(0, 3).map((d) => d[0]);
  qs.push({ kind: "choice", q: "A student says: “Mudskippers can stay out of the water because they breathe air with lungs.” Which statement corrects the student?", hl: {}, _leak: /skin|lining/i,
    options: ["They have no lungs; they absorb oxygen through moist skin and the lining of the mouth and throat.", ...dd], a: 0,
    why: "Mudskippers are fish and have <b>no lungs</b>. Out of the water they absorb oxygen through their <b>skin</b> and the <b>lining of the mouth and throat</b>, as long as these are kept <b>moist</b>. Their enlarged gill chambers also trap water, so the gills keep working." });
  return qs;
}

/* archerfish */
const AR_ST = {
  eye: [["Its large eyes face forwards, giving it binocular vision.", true, "the large, forward-set eyes give binocular vision"],
    ["It can move its eyes to aim at prey that is out of the water.", true, "its eyes are movable, so it can target prey out of the water"],
    ["Its eyes are set far back on its head, giving all-round vision.", false, "the eyes are set far forward on the head, near the mouth (look at the drawing), giving binocular vision, not all-round vision"],
    ["Its forward-facing eyes let it watch for predators all around it.", false, "forward-facing eyes give binocular vision for judging distance, not all-round vision"],
    ["Its eyes are small, as it finds its prey mainly by smell.", false, "the eyes are large (look at the drawing): it finds and targets its prey by sight"]],
  mouth: [["Its mouth is shaped so that it can spit a jet of water at insects.", true, ""],
    ["The jet of water it spits can knock insects into the water.", true, ""],
    ["It uses its upturned mouth to filter plankton from the water.", false, "the mouth is shaped for spitting a jet of water at insects, not for filtering"],
    ["Its jaws are shaped for crushing the shells of crabs on the mud.", false, "the mouth is shaped for spitting a jet of water at insects above the water"],
    ["It scrapes algae off the mangrove roots with its mouth.", false, "the mouth is shaped for spitting a jet of water at insects above the water"]],
};
const AR_LEAK = { eye: /binocular|\beyes?\b/i, mouth: /spit|jet|mouth/i };
function archerQs(F, r) {
  const qs = [], L = F.L, FINS = ["dorsal fin", "caudal (tail) fin", "pectoral fin", "anal fin", "pelvic fin"];
  // 1. tap a named fin
  qs.push(tapQ(F, { q: `Tap the <b>${NAMEB[F.N]}</b>.`, a: [F.N], ansTxt: `the ${NAMEB[F.N]}`, _leak: new RegExp(NAMEB[F.N]),
    why: `This is the <b>${NAMEB[F.N]}</b>: ${WHERE[F.N]}.` }));
  // 2. name the fin labelled X
  qs.push({ kind: "choice", q: `Name the fin labelled <b>${L[F.X]}</b>.`, options: nameOpts(r, NAMEB[F.X], FINS.filter((x) => x !== NAMEB[F.N])), a: 0, hl: { part: F.X }, _leak: new RegExp(NAMEB[F.X].replace(/[()]/g, "\\$&")),
    why: `${L[F.X]} is the <b>${NAMEB[F.X]}</b>${F.X === "caudal" ? "" : `: ${WHERE[F.X]}`}.` });
  // 3. tap the camouflage
  qs.push(tapQ(F, { q: "Tap the feature that helps to hide the archerfish from birds hunting above the water.", a: ["band"], ansTxt: "the dark bands", _leak: /band|camoufl/i,
    why: "The <b>dark bands</b> on the back are <b>camouflage</b>. Seen from above, they break up the outline of the fish, so birds hunting from above find it harder to spot." }));
  // 4. function of Z
  if (F.Z === "eye") qs.push({ kind: "choice", q: `What is the main function of the large, movable eyes, such as the one labelled <b>${L.eye}</b>?`, hl: { part: "eye" }, _leak: AR_LEAK.eye,
    options: ["Binocular vision, to judge the distance to prey out of the water", "All-round vision, to watch for predators coming from every side of it", "Seeing prey that hides in the mud on the bottom below it", "Seeing in very dim light when it hunts deep down at night"], a: 0,
    why: `The eyes are large, <b>forward-set</b> and movable. Facing forwards, they give <b>binocular vision</b>, so the fish can judge how far away an insect is when it is out of the water, and target it. They do not give all-round vision.` });
  else qs.push({ kind: "choice", q: `What is the function of the specially shaped mouth labelled <b>${L.mouth}</b>?`, hl: { part: "mouth" }, _leak: AR_LEAK.mouth,
    options: ["Spitting a jet of water to knock insects into the water", "Filtering plankton out of the water just below the surface", "Scraping algae off the roots of the mangrove trees", "Sucking up worms from the soft mud on the bottom"], a: 0,
    why: "The mouth is shaped so that the archerfish can <b>spit a jet of water</b> (up to about 150 cm) at insects on leaves above the surface. The jet knocks them into the water, where the fish eats them." });
  // 5. tick the true statements about the group not tested yet
  const st = pickMixed(r, AR_ST[F.g3].map((x) => x.concat(F.g3)), 4);
  qs.push({ kind: "multi", q: "Tick <b>every</b> statement that is true for the banded archerfish.", options: st.map((x) => x[0]), a: st.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0), hl: {}, _st: st, _leak: AR_LEAK[F.g3],
    why: st.map((x) => (x[1] ? `✓ ${x[0]}` : `✗ ${x[0]}: ${x[2]}.`)).join("<br>") });
  return qs;
}

function questions(F, r) { return F.mode === "tree" ? treeQs(F, r) : F.mode === "mud" ? mudQs(F, r) : archerQs(F, r); }

function selfTest(F, qs) {
  const bad = [], H = figH(F), strip = (h) => String(h).replace(/<[^>]+>/g, "");
  if (qs.length < 5 || qs.length > 7) bad.push("count " + qs.length);
  if (new Set(qs.map((q) => q.kind)).size < 3) bad.push("kinds");
  // letters: X and Z lettered, 3–5 letters, unique, inside the figure
  if (![F.X, F.Z].every((id) => F.lettered.includes(id))) bad.push("X/Z not lettered");
  if (F.lettered.length < 3 || F.lettered.length > 5 || new Set(F.lettered).size !== F.lettered.length) bad.push("letters " + F.lettered.join());
  if (new Set(Object.values(F.L)).size !== F.lettered.length) bad.push("letter clash");
  for (const id of F.lettered) { const p = ap(F.m, partOf(F, id).lab); if (p[0] < 12 || p[0] > W - 12 || p[1] < 14 || p[1] > H - 8) bad.push("letter outside " + id); }
  // no part names written on the figure
  const sv = svg(F, {}), txt = [...sv.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);
  const allowed = ["water", "mud", "air", "enlarged view", "not to scale", ...Object.values(F.L)];
  for (const t of txt) if (!allowed.includes(t)) bad.push("text on figure " + t);
  // tap areas: every part, at least 22 units each way, answers present
  for (const p of PARTS(F)) for (const pts of TAPS(F, p.id)) { const b = bbox(pts); if (b[2] - b[0] < 26 || b[3] - b[1] < 26) bad.push(`tap ${p.id} small ${n1(b[2] - b[0])}x${n1(b[3] - b[1])}`); if (b[0] < -2 || b[2] > W + 2 || b[1] < -2 || b[3] > H + 2) bad.push("tap outside " + p.id); }
  for (const q of qs.filter((q) => q.kind === "tap")) { const s2 = svg(F, q.askOpt), ids = [...s2.matchAll(/data-tap="([^"]+)"/g)].map((m) => m[1]); if (ids.length < 3 || q.a.some((a) => !ids.includes(a))) bad.push("tap ids"); if (q.labelOf("x") !== "the part you tapped") bad.push("labelOf names parts"); }
  // the correct option is never the longest; no duplicates
  for (const q of qs.filter((q) => q.kind === "choice")) { const k = q.options[q.a].length, o = q.options.filter((_, i) => i !== q.a).map((x) => x.length); if (k >= Math.max(...o)) bad.push("key longest: " + strip(q.q).slice(0, 40)); if (new Set(q.options).size !== q.options.length) bad.push("dup options"); }
  // multi: a true/false mix, truths from the pool, no parallel pair in one question
  for (const q of qs.filter((q) => q.kind === "multi")) {
    if (!q.a.length || q.a.length === q.options.length) bad.push("multi all/none");
    if (F.mode === "tree") { if (new Set(q._st.map((x) => x.c.g)).size !== q._st.length) bad.push("cond group twice"); q._st.forEach((x, i) => { if (x.v !== q.a.includes(i)) bad.push("cond truth"); }); }
    else q._st.forEach((x, i) => { if (x[1] !== q.a.includes(i)) bad.push("multi truth"); });
  }
  // roles: each fact tested once; identification feedback states no function; no earlier stem/feedback reveals a later answer
  if (F.mode === "tree" && (F.T === F.Z || F.X === F.T || !["prop", "leaf"].includes(F.T))) bad.push("tree roles");
  if (F.mode === "mud" && (new Set([F.gT, F.gZ, F.g3]).size !== 3 || [F.X].includes(F.T))) bad.push("mud roles");
  if (F.mode === "archer" && (F.N === F.X || F.Z === F.g3)) bad.push("archer roles");
  qs.forEach((q, j) => { if (!q._leak) return; for (let i = 0; i < j; i++) { const t = strip(qs[i].why + " " + (qs[i].ansTxt || "") + " " + qs[i].q); if (q._leak.test(t)) bad.push(`q${i} gives away q${j}`); } });
  for (const q of qs.filter((q) => /^Name the/.test(q.q))) if (/oxygen|salt|support|firm|camoufl|binocular|spit|move|moving|trap/i.test(strip(q.why))) bad.push("name feedback states a function");
  return bad;
}

export default {
  key: KEY, group: "Diagrams", name: "Mangrove adaptations", topics: "Unit 5 (5.6)", thumbSeed: 4,
  blurb: "Line drawings of a mangrove tree, a mudskipper and a banded archerfish: name the lettered parts, find the adaptations and explain how they help.",
  tips: ["Mangrove tree: prop roots arch down into the soft mud and support the tree against the tides; pneumatophores (aerial roots) grow up out of the waterlogged, low-oxygen mud and take in oxygen for respiration; the leaves secrete excess salt.",
    "Mudskipper: it has no lungs. It absorbs oxygen through its moist skin and the lining of its mouth and throat, and its enlarged gill chambers trap water. Its pectoral and pelvic fins are shaped for moving on land, and its large eyes are set high for use out of the water.",
    "Banded archerfish: large, forward-set, movable eyes give binocular vision to target insects out of the water; the mouth spits a jet of water to knock them in; the dark bands camouflage it from birds above.",
    "In an explain answer, link the condition to the adaptation: waterlogged mud → little oxygen → pneumatophores take in oxygen from the air → respiration."],
  ctx: (F) => ({ tree: "a mangrove tree in an estuary (side view, cut through the mud)", mud: "a mudskipper on the mud at the water's edge (side view)", archer: "a banded archerfish just below the water surface (side view)" }[F.mode]),
  make, svg, questions, selfTest,
  css: `.fig-mangrove .mg-bg{fill:var(--surface)}.fig-mangrove .mg-hat{stroke:currentColor;stroke-width:.9;opacity:.55}.fig-mangrove .mg-water{fill:color-mix(in srgb,var(--ink) 10%,transparent)}
.fig-mangrove .mg-ln{fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}.fig-mangrove .mg-thin{stroke-width:1.1}.fig-mangrove .mg-dash{stroke-dasharray:4 3}
.fig-mangrove .mg-mudl{stroke-width:1.8}.fig-mangrove .mg-surf{fill:none;stroke:currentColor;stroke-width:1.8}.fig-mangrove .mg-br{stroke-width:2.4}
.fig-mangrove .mg-part{fill:var(--surface);stroke:currentColor;stroke-width:1.4;stroke-linejoin:round}.fig-mangrove .mg-thinl{stroke-width:1.1}
.fig-mangrove .mg-tubeo{fill:none;stroke:currentColor;stroke-width:6.5;stroke-linecap:round}.fig-mangrove .mg-tubei{fill:none;stroke:var(--surface);stroke-width:3.4;stroke-linecap:round}
.fig-mangrove .mg-rt{stroke-width:8}.fig-mangrove .mg-rti{stroke-width:4.6}
.fig-mangrove .mg-inset{fill:var(--surface);stroke:currentColor;stroke-width:1.6}
.fig-mangrove .mg-body{fill:var(--surface);stroke:currentColor;stroke-width:1.8;stroke-linejoin:round}.fig-mangrove .mg-fin{fill:var(--surface);stroke:currentColor;stroke-width:1.4;stroke-linejoin:round}
.fig-mangrove .mg-band{fill:currentColor;opacity:.85}.fig-mangrove .mg-tint{fill:color-mix(in srgb,var(--ink) 16%,var(--surface));stroke:none}.fig-mangrove .mg-dot{fill:currentColor}
.fig-mangrove .mg-lab{stroke:currentColor;stroke-width:1.3}.fig-mangrove .mg-lbg{fill:var(--surface);opacity:.92}.fig-mangrove .mg-let{font-size:20px;font-weight:800;fill:currentColor}
.fig-mangrove .mg-sm{font-size:14px;fill:currentColor;opacity:.9}
.fig-mangrove .mg-card{--ink:#1b2a33;--surface:#f1f4f6;color:#1b2a33}.fig-mangrove .mg-cardbg{fill:#d3dadf;stroke:#56636d;stroke-width:1}
.fig-mangrove .mg-card .mg-water{fill:#c2ccd3}.fig-mangrove .mg-card .mg-band{opacity:1}
.fig-mangrove .mg-hl{fill:color-mix(in srgb,var(--app) 40%,transparent);stroke:var(--app);stroke-width:2.5}`,
};
