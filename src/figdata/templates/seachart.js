/* ---------- SEA CHART: 16-POINT COMPASS DIRECTIONS AND A SCALE LINE (0697 Mathematical requirements: "give direction in
   terms of a 16-point compass", "understand scale and the use of a scale line"; 6.3 chart and compass rose) ----------
   A generated chart of a stretch of coast: land on the left, an island with a lighthouse, and six features. A compass
   rose (16 spokes, only N, E, S and W labelled) and a scale line with a ruler under it. A second ruler lies along the
   dashed line from the harbour to the dive site, with its 0 at the harbour, as a student's ruler would.
   Questions: a 16-point direction between two features (options include the letter-swap NNE/ENE, the nearest 8-point
   direction and the reverse direction); tap the feature in a given direction; km per cm from the scale line; the real
   distance along the ruler; a real distance back to chart cm; tick the true statements about the chart.
   Every asked direction is built within 2.5° of an exact 16-point direction; positions are generated. */
import { rng, pickR, shuffleR, fmt, pickMixed } from "../core.js";

const KEY = "seachart";
const W = 560, CL = 20, CT = 20, CR = 540, CB = 360, PXCM = 40, PXMM = 4;
const DIR16 = ["north", "north-north-east", "north-east", "east-north-east", "east", "east-south-east", "south-east", "south-south-east", "south", "south-south-west", "south-west", "west-south-west", "west", "west-north-west", "north-west", "north-north-west"];
const AB16 = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
const dname = (d) => `${DIR16[((d % 16) + 16) % 16]} (${AB16[((d % 16) + 16) % 16]})`;
const ROSE = { x: 488, y: 72, r: 36 };
const SCALES = [[0.5, [2, 4, 6]], [2, [2, 3, 4, 5]], [2.5, [2, 4]], [4, [2, 3]], [5, [2, 3, 4]]];  // km per cm (never 1, so multiplying and dividing give different answers), scale-line lengths in cm giving whole km

const bearing = (a, b) => ((Math.atan2(b.x - a.x, -(b.y - a.y)) * 180) / Math.PI + 360) % 360;
const angDiff = (a, b) => Math.abs(((a - b) % 360 + 540) % 360 - 180);
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const at = (p, brg, d) => ({ x: p.x + d * Math.sin((brg * Math.PI) / 180), y: p.y - d * Math.cos((brg * Math.PI) / 180) });

function make(seed) {
  for (let tries = 0; tries < 5000; tries++) {
    const r = rng(seed + tries * 7919 + 5);
    const ph = [r() * 6.28, r() * 6.28], coastX = (y) => 64 + 14 * Math.sin(y / 38 + ph[0]) + 8 * Math.sin(y / 15 + ph[1]);
    const isl = { x: 250 + r() * 170, y: 130 + r() * 150, r: 20 };
    const inSea = (p, m = 14) => p.x > coastX(p.y) + 30 + m && p.x < CR - m && p.y > CT + m + 10 && p.y < CB - m && dist(p, isl) > isl.r + m + 8 && dist(p, ROSE) > ROSE.r + 30;
    const f = {};
    f.harbour = { x: 0, y: 110 + r() * 200 }; f.harbour.x = coastX(f.harbour.y) + 3;
    f.lighthouse = { x: isl.x, y: isl.y };
    // ruler pair: harbour → dive site, a whole number of mm, within 28° of east
    const lenMM = 55 + Math.floor(r() * 41), rb = 90 + (r() * 2 - 1) * 28;
    f["dive site"] = at(f.harbour, rb, lenMM * PXMM);
    if (!inSea(f["dive site"], 24)) continue;
    // roles: q1 = the feature whose direction from the lighthouse is asked; tap = the tap answer; free = placed anywhere
    const [q1, tap, free] = shuffleR(r, ["buoy", "reef", "wreck"]);
    // direction pair: lighthouse → q1 on an exact 16-point direction (± 2.5°)
    const d1 = Math.floor(r() * 16); f[q1] = at(f.lighthouse, d1 * 22.5 + (r() * 2 - 1) * 2.5, 110 + r() * 80);
    if (!inSea(f[q1], 20)) continue;
    // tap pair: from a reference feature to the tap answer on an exact 16-point direction
    const ref = pickR(r, ["harbour", "dive site", "lighthouse", q1]), d2 = Math.floor(r() * 16);
    f[tap] = at(f[ref], d2 * 22.5 + (r() * 2 - 1) * 2.5, 100 + r() * 90);
    if (!inSea(f[tap], 20)) continue;
    f[free] = { x: 140 + r() * 360, y: 50 + r() * 290 };
    if (!inSea(f[free], 20)) continue;
    const names = Object.keys(f);
    let ok = true;
    for (let i = 0; i < names.length && ok; i++) for (let j = i + 1; j < names.length; j++) if (dist(f[names[i]], f[names[j]]) < 62) { ok = false; break; }
    if (!ok) continue;
    // the tap answer must be the only feature anywhere near that direction from the reference
    if (names.some((n) => n !== ref && n !== tap && angDiff(bearing(f[ref], f[n]), d2 * 22.5) < 34)) continue;
    // the ruler must not cover another feature
    const rr = (rb * Math.PI) / 180, ux = Math.sin(rr), uy = -Math.cos(rr), nx = -uy, ny = ux;   // along, and the normal on the ruler side
    const rcm = Math.ceil(lenMM / 10), inRuler = (q, m = 0) => { const v = { x: q.x - f.harbour.x, y: q.y - f.harbour.y }, al = v.x * ux + v.y * uy, ac = v.x * nx + v.y * ny; return al > -10 - m && al < rcm * PXCM + 30 + m && ac > -m && ac < 29 + m; };
    // the whole ruler stays inside the chart frame
    if ([[-8, 0], [rcm * PXCM + 22, 0], [-8, 28], [rcm * PXCM + 22, 28]].some(([a, c]) => { const x = f.harbour.x + a * ux + c * nx, y = f.harbour.y + a * uy + c * ny; return x < CL + 2 || x > CR - 2 || y < CT + 2 || y > CB - 2; })) continue;
    if (names.some((n) => n !== "harbour" && n !== "dive site" && inRuler(f[n], 16))) continue;
    if ([0, 1, 2, 3, 4, 5, 6, 7].some((a) => inRuler(at(isl, a * 45, isl.r), 4))) continue;
    // labels: first free place out of four around each symbol (not over another label, symbol, the ruler, the rose or the island)
    const lab = {}, boxes = [], over = (A, B) => A.x0 < B.x1 && B.x0 < A.x1 && A.y0 < B.y1 && B.y0 < A.y1;
    const syms = names.map((n) => ({ x0: f[n].x - 10, x1: f[n].x + 10, y0: f[n].y - 10, y1: f[n].y + 10, n }));
    const roseB = { x0: ROSE.x - ROSE.r - 18, x1: ROSE.x + ROSE.r + 18, y0: ROSE.y - ROSE.r - 18, y1: ROSE.y + ROSE.r + 18 }, islB = { x0: isl.x - isl.r, x1: isl.x + isl.r, y0: isl.y - isl.r, y1: isl.y + isl.r };
    for (const n of names) {
      const w = n.length * 8.4 + 4, P = f[n]; let got = null;
      for (const [dx, dy, an] of [[10, -9, "start"], [-10, -9, "end"], [10, 21, "start"], [-10, 21, "end"], [14, 5, "start"], [-14, 5, "end"]]) {
        const x0 = an === "start" ? P.x + dx : P.x + dx - w, B = { x0, x1: x0 + w, y0: P.y + dy - 13, y1: P.y + dy + 3 };
        if (B.x0 < CL + 4 || B.x1 > CR - 4 || B.y0 < CT + 4 || B.y1 > CB - 4) continue;
        if (boxes.some((b) => over(b, B)) || syms.some((b) => b.n !== n && over(b, B)) || over(roseB, B) || (n !== "lighthouse" && over(islB, B))) continue;
        const pts = [[B.x0, B.y0], [B.x1, B.y0], [B.x0, B.y1], [B.x1, B.y1], [(B.x0 + B.x1) / 2, (B.y0 + B.y1) / 2], [B.x0 + w / 4, B.y1], [B.x1 - w / 4, B.y0]];
        if (pts.some(([x, y]) => inRuler({ x, y }, 2))) continue;
        if (n !== "harbour" && B.x0 < coastX(B.y0) + 4) continue;
        const dB = (q) => Math.hypot(Math.max(B.x0 - q.x, 0, q.x - B.x1), Math.max(B.y0 - q.y, 0, q.y - B.y1));
        if (names.some((m2) => m2 !== n && dB(f[m2]) < dB(P) + 14)) continue;          // never closer to another symbol than to its own
        got = { dx, dy, an }; boxes.push(B); break;
      }
      if (!got) { ok = false; break; } lab[n] = got;
    }
    if (!ok) continue;
    // enough material for the tick-true question: at least 2 feature pairs on an exact 16-point line (not the asked pairs)
    const asked = [["lighthouse", q1].sort().join("|"), [ref, tap].sort().join("|")];
    let nDir = 0; for (let i = 0; i < names.length; i++) for (let j = i + 1; j < names.length; j++) { const a = names[i], b = names[j]; if (asked.includes([a, b].sort().join("|")) || dist(f[a], f[b]) < 90) continue; const brg = bearing(f[a], f[b]); if (angDiff(brg, Math.round(brg / 22.5) * 22.5) <= 3) nDir++; }
    let nDist = 0; for (const a of names) for (const b of names) { if (a >= b || a === "harbour" || b === "harbour") continue; const da = dist(f.harbour, f[a]), db = dist(f.harbour, f[b]); if (Math.max(da, db) / Math.min(da, db) >= 1.35) nDist++; }
    if (nDir < 2 || nDir + nDist < 5) continue;
    // scale
    const [k, Ls] = pickR(r, SCALES), sl = pickR(r, Ls), km = sl * k;
    const keepKm = pickR(r, [1, 1.5, 2, 3, 4, 5, 6, 8, 10].filter((x) => { const c = x / k; return c >= 0.5 && c <= 8 && Math.abs(c * 10 - Math.round(c * 10)) < 1e-9 && x !== km; }));
    if (keepKm == null) continue;
    return { kind: KEY, seed, ph, isl, f, lab, lenMM, rcm, rb, q1, d1, ref, tap, d2, k, sl, km, keepKm };
  }
  throw new Error("seachart: no layout");
}

/* ---------- drawing ---------- */
function coastPath(F) {
  const cx = (y) => 64 + 14 * Math.sin(y / 38 + F.ph[0]) + 8 * Math.sin(y / 15 + F.ph[1]);
  let d = `M${CL} ${CT}`; for (let y = CT; y <= CB; y += 6) d += `L${cx(y).toFixed(1)} ${y}`; return d + `L${cx(CB).toFixed(1)} ${CB}L${CL} ${CB}Z`;
}
function ruler(x, y, deg, cm, off = 0, id) {
  let s = `<g transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${deg.toFixed(2)}) translate(0 ${off})"${id ? ` class="${id}"` : ""}><rect x="-8" y="0" width="${cm * PXCM + 30}" height="24" class="sc-ruler"/>`;
  for (let i = 0; i <= cm * 10; i++) { const h = i % 10 === 0 ? 11 : i % 5 === 0 ? 8 : 5; s += `<line x1="${i * PXMM}" x2="${i * PXMM}" y1="0" y2="${h}" class="sc-tick"/>`; if (i % 10 === 0) s += `<text x="${i * PXMM}" y="21" text-anchor="middle" class="sc-rn">${i / 10}</text>`; }
  return s + `<text x="${cm * PXCM + 10}" y="21" class="sc-rn">cm</text></g>`;
}
const SYM = {
  harbour: (p) => `<rect x="${p.x - 5}" y="${p.y - 5}" width="10" height="10" class="sc-sym"/>`,
  lighthouse: (p) => `<path d="M${p.x} ${p.y - 8}L${p.x + 6} ${p.y + 6}L${p.x - 6} ${p.y + 6}Z" class="sc-sym"/>`,
  buoy: (p) => `<circle cx="${p.x}" cy="${p.y}" r="5.5" class="sc-sym"/>`,
  reef: (p) => `<path d="M${p.x - 8} ${p.y}l4 -5l4 5l4 -5l4 5" class="sc-reef"/>`,
  "dive site": (p) => `<path d="M${p.x - 6} ${p.y - 6}L${p.x + 6} ${p.y + 6}M${p.x + 6} ${p.y - 6}L${p.x - 6} ${p.y + 6}" class="sc-x"/>`,
  wreck: (p) => `<path d="M${p.x - 8} ${p.y}H${p.x + 8}M${p.x - 4} ${p.y - 5}V${p.y + 5}M${p.x + 4} ${p.y - 5}V${p.y + 5}" class="sc-x"/>`,
};

function svg(F, opt) {
  opt = opt || {}; const hl = opt.hl || {};
  let s = `<rect x="${CL}" y="${CT}" width="${CR - CL}" height="${CB - CT}" class="sc-sea"/><path d="${coastPath(F)}" class="sc-land"/>`;
  s += `<circle cx="${F.isl.x}" cy="${F.isl.y}" r="${F.isl.r}" class="sc-land"/>`;
  s += `<text x="${CL + 8}" y="${CT + 22}" class="sc-lab">land</text>`;
  // compass rose: 16 spokes; only N, E, S, W labelled
  for (let i = 0; i < 16; i++) { const L = i % 4 === 0 ? ROSE.r : i % 2 === 0 ? ROSE.r * 0.72 : ROSE.r * 0.5, p = at(ROSE, i * 22.5, L); s += `<line x1="${ROSE.x}" y1="${ROSE.y}" x2="${p.x.toFixed(1)}" y2="${p.y.toFixed(1)}" class="${i % 4 === 0 ? "sc-sp1" : "sc-sp2"}"/>`; }
  ["N", "E", "S", "W"].forEach((t, i) => { const p = at(ROSE, i * 90, ROSE.r + 10); s += `<text x="${p.x.toFixed(1)}" y="${(p.y + 5).toFixed(1)}" text-anchor="middle" class="sc-lab">${t}</text>`; });
  // the dashed line and ruler from the harbour to the dive site
  const H = F.f.harbour, D = F.f["dive site"];
  s += `<line x1="${H.x}" y1="${H.y}" x2="${D.x}" y2="${D.y}" class="sc-route"/>`;
  s += ruler(H.x, H.y, F.rb - 90, F.rcm, 3);
  if (hl.guide) for (const [a, b] of hl.guide) { const A = F.f[a], B = F.f[b]; s += `<line x1="${A.x}" y1="${A.y}" x2="${B.x}" y2="${B.y}" class="sc-guide"/>`; }
  for (const [n, p] of Object.entries(F.f)) {
    const on = (hl.f || []).includes(n), L = F.lab[n];
    if (on) s += `<circle cx="${p.x}" cy="${p.y}" r="13" class="sc-hl"/>`;
    s += SYM[n](p) + `<text x="${p.x + L.dx}" y="${p.y + L.dy}" text-anchor="${L.an}" class="sc-lab sc-halo">${n}</text>`;
    if (opt.tapMode) s += `<circle cx="${p.x}" cy="${p.y}" r="16" fill="transparent" data-tap="${n}"/>`;
  }
  s += `<rect x="${CL}" y="${CT}" width="${CR - CL}" height="${CB - CT}" class="sc-frame"/>`;
  // scale line, with a ruler under it
  const sx = CL + 10, sy = CB + 30, len = F.sl * PXCM;
  s += `<text x="${sx}" y="${sy - 12}" class="sc-lab">scale line</text><line x1="${sx}" x2="${sx + len}" y1="${sy}" y2="${sy}" class="sc-scale"/>`;
  s += `<line x1="${sx}" x2="${sx}" y1="${sy - 6}" y2="${sy + 2}" class="sc-scale"/><line x1="${sx + len}" x2="${sx + len}" y1="${sy - 6}" y2="${sy + 2}" class="sc-scale"/>`;
  s += `<text x="${sx + len + 12}" y="${sy - 2}" class="sc-lab">represents ${fmt(F.km)} km</text>`;
  s += ruler(sx, sy + 4, 0, F.sl + 1);
  s += `<text x="${CR}" y="${CB + 92}" text-anchor="end" class="sc-sm">The ruler along the dashed line has its 0 at the harbour.</text>`;
  return `<svg viewBox="0 0 ${W} ${CB + 100}" class="figsvg fig-${KEY}" role="img" aria-label="A sea chart with a compass rose, features, a scale line and rulers">${s}</svg>`;
}

/* ---------- questions ---------- */
function questions(F, r) {
  const qs = [], f = F.f;
  // 1. 16-point direction of the buoy from the lighthouse
  // options are symmetric sets (each option's opposite is also an option), so the key cannot be found from the set alone:
  // odd d → d, its letter-swap, and both opposites; even d → d, the 8-point direction 45° round, and both opposites
  const d = F.d1, Q1 = F.q1, odd = d % 2 === 1, ic = odd ? ((d - 1) % 4 === 2 ? d - 1 : d + 1) : null, m = odd ? 2 * ic - d : d + (r() < 0.5 ? 2 : -2);
  qs.push({ kind: "choice", q: `In which direction is the <b>${Q1}</b> from the <b>lighthouse</b>? North is up the chart.`, options: [d, m, d + 8, m + 8].map(dname), a: 0, hl: { f: ["lighthouse", Q1], guide: [["lighthouse", Q1]] },
    why: `Start at the lighthouse (the place you are measuring <i>from</i>) and look towards the ${Q1}. The line points <b>${dname(d)}</b>. ${odd ? `The 16-point directions between the main ones take their first word from the nearer of N, E, S or W: ${AB16[d]} is between ${AB16[(d + 15) % 16]} and ${AB16[(d + 1) % 16]}, nearer to ${AB16[(d - 1) % 4 === 0 ? d - 1 : (d + 1) % 16]}. ${AB16[(m + 16) % 16]} is a different direction.` : `It points straight along one of the 8 main directions, not between two of them.`} ${AB16[(d + 8) % 16]} would be the direction of the lighthouse from the ${Q1}.` });
  // 2. tap the feature in a given direction from a reference
  const ref = F.ref, T = F.tap;
  qs.push({ kind: "tap", q: `Tap the feature that is <b>${dname(F.d2)}</b> of the <b>${ref}</b>.`, a: [T], ansTxt: `the ${T}`, labelOf: (id) => `the ${id}`,
    askOpt: { tapMode: true }, doneOpt: () => ({ tapMode: true, hl: { f: [ref, T], guide: [[ref, T]] } }),
    why: `Put yourself at the ${ref} and face ${DIR16[F.d2]}: the <b>${T}</b> lies in that direction. Every other feature is at least 1½ compass points away from that line.` });
  // 3. km per cm from the scale line
  qs.push({ kind: "num", q: "Use the ruler under the scale line. How many kilometres does <b>1 cm</b> on the chart represent?", ans: F.k, tol: 0, unit: "km",
    why: `The scale line is ${F.sl} cm long and represents ${fmt(F.km)} km. So 1 cm represents ${fmt(F.km)} ÷ ${F.sl} = <b>${fmt(F.k)} km</b>.` });
  // 4. real distance along the ruler
  const lcm = F.lenMM / 10, real = lcm * F.k;
  qs.push({ kind: "num", q: "Read the ruler along the dashed line, then use the scale to find the real distance from the <b>harbour</b> to the <b>dive site</b>, in km.", ans: Math.round(real * 100) / 100, tol: 0.1 * F.k + 1e-9, unit: "km",
    hl: { f: ["harbour", "dive site"] },
    why: `The ruler starts at 0 at the harbour and reads <b>${fmt(lcm, 1)} cm</b> at the dive site. Each cm represents ${fmt(F.k)} km, so the distance is ${fmt(lcm, 1)} × ${fmt(F.k)} = <b>${fmt(real)} km</b>. Marked to within 1 mm of ruler reading (${fmt(0.1 * F.k)} km).` });
  // 5. real distance back to chart cm
  const ccm = F.keepKm / F.k;
  qs.push({ kind: "num", q: `Boats must stay at least <b>${fmt(F.keepKm)} km</b> from the reef. How long is ${fmt(F.keepKm)} km on this chart, in cm?`, ans: ccm, tol: 0.05, unit: "cm", dp: ccm % 1 ? 1 : 0,
    why: `1 cm on the chart represents ${fmt(F.k)} km, so ${fmt(F.keepKm)} km is ${fmt(F.keepKm)} ÷ ${fmt(F.k)} = <b>${fmt(ccm)} cm</b> on the chart. Divide by the km per cm to go from a real distance back to the chart.` });
  // 6. tick every true statement (directions on exact 16-point lines, and clear distance comparisons)
  const names = Object.keys(f), st = [];
  for (const a of names) for (const b of names) {
    if (a === b) continue; const brg = bearing(f[a], f[b]), dd = Math.round(brg / 22.5) % 16;
    if (angDiff(brg, dd * 22.5) > 3 || dist(f[a], f[b]) < 90) continue;
    const pr = [a, b].sort().join("|"); if (pr === ["lighthouse", F.q1].sort().join("|") || pr === [F.ref, F.tap].sort().join("|")) continue;
    const o = dd % 2 ? (((dd - 1) % 4 === 2 ? dd - 1 : dd + 1) * 2 - dd + 16) % 16 : (dd + 2 + 4 * Math.floor(r() * 2) * 3) % 16;
    st.push([`The ${b} is ${DIR16[dd]} of the ${a}.`, true, `From the ${a}, the ${b} is ${AB16[dd]}.`]);
    st.push([`The ${b} is ${DIR16[o]} of the ${a}.`, false, `From the ${a}, the ${b} is ${AB16[dd]}, not ${AB16[o]}.`]);
    if (r() < 0.5) st.push([`The ${a} is ${DIR16[dd]} of the ${b}.`, false, `That is the wrong way round: the ${a} is ${AB16[(dd + 8) % 16]} of the ${b}.`]);
  }
  const H = f.harbour; for (const a of names) for (const b of names) { if (a >= b || a === "harbour" || b === "harbour") continue; const da = dist(H, f[a]), db = dist(H, f[b]); if (Math.max(da, db) / Math.min(da, db) < 1.35) continue;
    const near = da < db ? a : b, far = da < db ? b : a; st.push([`The ${near} is closer to the harbour than the ${far} is.`, true, `On the chart the ${near} is nearer the harbour.`]); st.push([`The ${far} is closer to the harbour than the ${near} is.`, false, `The ${far} is further from the harbour than the ${near}.`]); }
  // at most one statement about any pair of features
  const pairOf = (t) => { const ns = names.filter((n) => t.includes(`the ${n} `) || t.includes(`the ${n}.`) || t.startsWith(`The ${n} `)); return ns.sort().join("|"); };
  let pick = null;
  for (let t = 0; t < 12 && !pick; t++) { const seen = new Set(), uniq = shuffleR(r, st).filter((x) => { const k = pairOf(x[0]); if (seen.has(k)) return false; seen.add(k); return true; }); if (uniq.length >= 4) pick = pickMixed(r, uniq, Math.min(5, uniq.length)); }
  if (pick) qs.push({ kind: "multi", q: "Tick <b>every</b> statement that is true for this chart.", options: pick.map((x) => x[0]), a: pick.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0),
    why: pick.map((x) => `${x[1] ? "✓" : "✗"} ${x[0]}: ${x[2]}`).join("<br>") });
  return qs;
}

function selfTest(F, qs) {
  const bad = [], f = F.f;
  if (angDiff(bearing(f.lighthouse, f[F.q1]), F.d1 * 22.5) > 2.6) bad.push("q1 direction");
  if (angDiff(bearing(f[F.ref], f[F.tap]), F.d2 * 22.5) > 2.6) bad.push("tap direction");
  for (const n of Object.keys(f)) if (n !== F.ref && n !== F.tap && angDiff(bearing(f[F.ref], f[n]), F.d2 * 22.5) < 34) bad.push("tap not unique");
  if (F.k === 1) bad.push("k = 1");
  if (Math.abs(dist(f.harbour, f["dive site"]) - F.lenMM * PXMM) > 0.01) bad.push("ruler length");
  if (Math.abs(F.km / F.sl - F.k) > 1e-9 || F.km % 1) bad.push("scale");
  const c = qs[0]; if (new Set(c.options).size !== 4) bad.push("dir options");
  const m = qs.find((q) => q.kind === "multi"); if (!m) bad.push("no multi");
  else if (new Set(m.options.map((t) => Object.keys(f).filter((n) => t.includes(n)).sort().join("|"))).size !== m.options.length) bad.push("multi pair repeated");
  else m.options.forEach((t, i) => { const mm = t.match(/^The (.+) is ([a-z-]+) of the (.+)\.$/); if (!mm) return; const dd = DIR16.indexOf(mm[2]), tr = angDiff(bearing(f[mm[3]], f[mm[1]]), dd * 22.5) <= 3; if (tr !== m.a.includes(i)) bad.push("multi truth " + t); });
  return bad;
}

export default {
  key: KEY, group: "Maps", zoomDefault: true, name: "Sea chart: compass and scale line", topics: "Mathematical requirements; 6.3", thumbSeed: 4,
  blurb: "A generated sea chart: 16-point compass directions between features, and real distances from a scale line.",
  tips: ["North is up the chart. Give the direction from the place you are measuring from.", "16-point directions between the main ones start with the nearer of N, E, S or W: NNE is closer to north, ENE is closer to east.", "Scale line: 1 cm represents (distance on the scale line ÷ its length in cm).", "Real distance = distance on the chart in cm × km per cm. To go back to the chart, divide."],
  ctx: () => "a sea chart of a stretch of coast",
  make, svg, questions, selfTest,
  css: `.fig-seachart .sc-sea{fill:var(--surface2)}.fig-seachart .sc-land{fill:color-mix(in srgb,var(--ink) 22%,transparent);stroke:currentColor;stroke-width:1}.fig-seachart .sc-frame{fill:none;stroke:currentColor;stroke-width:1.2}
.fig-seachart .sc-lab{font-size:14px;font-weight:700}.fig-seachart .sc-sm{font-size:12px;opacity:.85}.fig-seachart .sc-halo{paint-order:stroke;stroke:var(--surface2);stroke-width:4px;stroke-linejoin:round}
.fig-seachart .sc-sp1{stroke:currentColor;stroke-width:2}.fig-seachart .sc-sp2{stroke:currentColor;stroke-width:1}.fig-seachart .sc-sym{fill:currentColor}.fig-seachart .sc-reef{fill:none;stroke:currentColor;stroke-width:2}.fig-seachart .sc-x{stroke:currentColor;stroke-width:2.4}
.fig-seachart .sc-route{stroke:currentColor;stroke-width:1.6;stroke-dasharray:6 4}.fig-seachart .sc-guide{stroke:var(--app);stroke-width:2.5;stroke-dasharray:5 3}.fig-seachart .sc-hl{fill:color-mix(in srgb,var(--app) 35%,transparent);stroke:var(--app);stroke-width:2}
.fig-seachart .sc-ruler{fill:color-mix(in srgb,var(--surface) 82%,transparent);stroke:currentColor;stroke-width:1}.fig-seachart .sc-tick{stroke:currentColor;stroke-width:.8}.fig-seachart .sc-rn{font-size:10px}.fig-seachart .sc-scale{stroke:currentColor;stroke-width:3}`,
};
