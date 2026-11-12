/* ---------- MAGNIFICATION WITH AN ON-SCREEN RULER (0697 3.4/LO7, with 3.4/LO6 drawing rules) ----------
   A line drawing of a marine organism with two marked points X and Y and a ruler (mm ticks, cm numbers) laid along X–Y.
   Syllabus: magnification = image size ÷ actual size (state, use, manipulate). Convert to the same units first (1 cm = 10 mm).
   Tolerance (as in the mark scheme): the measured image length is accepted to ±1 mm; every calculated answer accepts any value
   that rounds correctly from a measurement within that ±1 mm (check(v), never a fixed tolerance on the answer).
   Knowledge-model misconceptions used as distractors: dividing the wrong way · skipping the cm→mm conversion ·
   multiplying instead of dividing for actual size · rounding upward. Drawing rules from the syllabus "Drawings" section
   and the examiner rubric: large (uses most of the space), sharp, clear unbroken lines, no shading or colour, correct
   proportions, ruled label lines that touch the feature (no arrowheads). */
import { rng, pickR, shuffleR, fmt, pickMixed, FIG_IMG } from "../core.js";

const KEY = "magnify", CM = 40, MM = CM / 10, W = 560, CY = 108;

/* organisms: what X–Y measures; actual-size range (mm) and the units used for the actual size.
   Each has a colour photograph (public/figdata-img/<img>.webp) and a line drawing (orgPath). The lanternfish and the
   seagrass leaf are always photographs; the others are a photograph or a drawing, half each.
   IMG: ar = height ÷ width of the photo; fa, fb = where the measured part starts and ends, as fractions of its width. */
const IMG = {"lanternfish": {"ar": 0.3129, "fa": 0.0191, "fb": 0.9809}, "isopod": {"ar": 0.5478, "fa": 0.0193, "fb": 0.9807}, "copepod": {"ar": 0.7, "fa": 0.0192, "fb": 0.9808}, "seagrass": {"ar": 0.0902, "fa": 0.0192, "fb": 0.9808}, "limpet": {"ar": 0.3977, "fa": 0.0189, "fb": 0.9811}};
const ORGS = [
  { id: "lanternfish", name: "lanternfish", part: "from the tip of the snout to the end of the tail", photoOnly: true, act: [30, 120], unit: "cm", Ms: [0.5, 2] },
  { id: "isopod", name: "marine isopod", part: "from the front of the head to the end of the tail", act: [8, 40], unit: "mm", Ms: [2, 4, 5] },
  { id: "copepod", name: "copepod", part: "from the front of the head to the end of the tail", act: [1, 4], unit: "mm", Ms: [20, 25, 40, 50], phCap: "taken through a light microscope" },
  { id: "seagrass", name: "seagrass leaf", part: "from the base of the leaf to its tip", photoOnly: true, act: [100, 300], unit: "cm", Ms: [0.25, 0.5] },
  { id: "limpet", name: "limpet shell", part: "across the base of the shell", act: [20, 50], unit: "mm", Ms: [2, 2.5, 4] },
];

function make(seed) {
  for (let tries = 0; ; tries++) {
    const r = rng(seed + tries * 6151);
    const org = pickR(r, ORGS), what = org.photoOnly || r() < 0.5 ? "photograph" : "drawing", off = pickR(r, [0, 0, 0, 1, 2]);           // ruler zero at X, or X lined up with the 1 or 2 cm mark
    const Lmax = 114 - 10 * off;                                              // image length (mm) whose ruler still fits
    const variant = r() < 0.5 ? "mag" : "act";
    let L, A, M;
    if (variant === "act") {                                                  // magnification given: find the actual length
      M = pickR(r, org.Ms);
      // actual length in tenths of a mm so the answer is a clean value; image L = M*A must be a whole number of mm
      const Lc = []; for (let l = 45; l <= Math.min(110, Lmax); l++) { const a = l / M; if (a >= org.act[0] && a <= org.act[1] && Math.abs(a * 10 - Math.round(a * 10)) < 1e-9) Lc.push(l); }
      if (!Lc.length) continue; L = pickR(r, Lc); A = L / M;
    } else {                                                                  // actual length given: find the magnification
      L = 45 + Math.floor(r() * (Math.min(110, Lmax) - 44));
      const Ac = []; const step = org.unit === "cm" ? 1 : org.act[1] <= 5 ? 0.1 : 1; // actual size given to a sensible precision (mm)
      for (let a = org.act[0]; a <= org.act[1] + 1e-9; a += step) Ac.push(Math.round(a * 10) / 10);
      A = pickR(r, Ac); M = L / A;
      if (M < 0.2 || M > 80 || (M > 0.8 && M < 1.25)) continue;              // near ×1, dividing either way gives the same answer
    }
    return { kind: KEY, seed, org, what, off, L, A, M, variant, faults: shuffleR(r, ["shading", "sketchy", "arrows", "small"]).slice(0, 2), goodPos: Math.floor(r() * 3) };
  }
}

/* ---- drawings ---- */
function orgPath(o, x0, x1, cy, cls) {
  const len = x1 - x0, c = cls || "mgline";
  if (o.id === "lanternfish") {
    const h = Math.min(0.27 * len, 110), tb = x0 + 0.8 * len;
    let s = `<path class="${c}" d="M${x0},${cy} C${x0 + 0.1 * len},${cy - 0.55 * h} ${x0 + 0.55 * len},${cy - 0.6 * h} ${tb},${cy - 0.12 * h} L${x1},${cy - 0.5 * h} L${x1 - 0.07 * len},${cy} L${x1},${cy + 0.5 * h} L${tb},${cy + 0.12 * h} C${x0 + 0.55 * len},${cy + 0.6 * h} ${x0 + 0.1 * len},${cy + 0.55 * h} ${x0},${cy} Z"/>`;
    s += `<circle class="${c}" cx="${x0 + 0.12 * len}" cy="${cy - 0.08 * h}" r="${0.13 * h}"/><path class="${c}" d="M${x0 + 0.25 * len},${cy - 0.32 * h} Q${x0 + 0.29 * len},${cy} ${x0 + 0.24 * len},${cy + 0.33 * h}"/>`;
    s += `<path class="${c}" d="M${x0 + 0.42 * len},${cy - 0.42 * h} L${x0 + 0.5 * len},${cy - 0.72 * h} L${x0 + 0.58 * len},${cy - 0.38 * h}"/><path class="${c}" d="M${x0 + 0.3 * len},${cy + 0.08 * h} L${x0 + 0.42 * len},${cy + 0.24 * h} L${x0 + 0.32 * len},${cy + 0.2 * h}"/>`;
    for (let i = 0; i < 6; i++) s += `<circle class="${c}" cx="${x0 + (0.32 + i * 0.07) * len}" cy="${cy + 0.36 * h - i * 0.02 * h}" r="${Math.max(1.6, 0.025 * h)}"/>`;
    return s;
  }
  if (o.id === "isopod") {
    const h = Math.min(0.42 * len, 95), n = 7;
    let s = `<path class="${c}" d="M${x0},${cy} C${x0},${cy - 0.5 * h} ${x0 + 0.12 * len},${cy - 0.5 * h} ${x0 + 0.5 * len},${cy - 0.5 * h} C${x1 - 0.1 * len},${cy - 0.5 * h} ${x1},${cy - 0.3 * h} ${x1},${cy} C${x1},${cy + 0.3 * h} ${x1 - 0.1 * len},${cy + 0.5 * h} ${x0 + 0.5 * len},${cy + 0.5 * h} C${x0 + 0.12 * len},${cy + 0.5 * h} ${x0},${cy + 0.5 * h} ${x0},${cy} Z"/>`;
    for (let i = 1; i <= n; i++) { const x = x0 + (0.13 + i * 0.1) * len; s += `<path class="${c}" d="M${x},${cy - 0.49 * h} Q${x + 0.03 * len},${cy} ${x},${cy + 0.49 * h}"/>`; }
    s += `<path class="${c}" d="M${x0 + 0.05 * len},${cy - 0.3 * h} C${x0 + 0.1 * len},${cy - 0.75 * h} ${x0 + 0.3 * len},${cy - 0.85 * h} ${x0 + 0.42 * len},${cy - 0.78 * h}"/><path class="${c}" d="M${x0 + 0.05 * len},${cy + 0.3 * h} C${x0 + 0.1 * len},${cy + 0.75 * h} ${x0 + 0.3 * len},${cy + 0.85 * h} ${x0 + 0.42 * len},${cy + 0.78 * h}"/>`;
    s += `<circle class="${c}" cx="${x0 + 0.08 * len}" cy="${cy - 0.18 * h}" r="${Math.max(2, 0.05 * h)}"/><circle class="${c}" cx="${x0 + 0.08 * len}" cy="${cy + 0.18 * h}" r="${Math.max(2, 0.05 * h)}"/>`;
    return s;
  }
  if (o.id === "copepod") {
    const h = Math.min(0.36 * len, 100), te = x0 + 0.64 * len;
    let s = `<path class="${c}" d="M${x0},${cy} C${x0},${cy - 0.5 * h} ${x0 + 0.2 * len},${cy - 0.55 * h} ${x0 + 0.34 * len},${cy - 0.42 * h} C${x0 + 0.5 * len},${cy - 0.28 * h} ${te},${cy - 0.14 * h} ${te},${cy - 0.08 * h} L${te},${cy + 0.08 * h} C${te},${cy + 0.14 * h} ${x0 + 0.5 * len},${cy + 0.28 * h} ${x0 + 0.34 * len},${cy + 0.42 * h} C${x0 + 0.2 * len},${cy + 0.55 * h} ${x0},${cy + 0.5 * h} ${x0},${cy} Z"/>`;
    s += `<path class="${c}" d="M${te},${cy - 0.06 * h} L${x1 - 0.06 * len},${cy - 0.05 * h} L${x1 - 0.06 * len},${cy + 0.05 * h} L${te},${cy + 0.06 * h}"/>`;
    for (let i = 1; i < 4; i++) { const x = te + i * (x1 - 0.06 * len - te) / 4; s += `<line class="${c}" x1="${x}" y1="${cy - 0.055 * h}" x2="${x}" y2="${cy + 0.055 * h}"/>`; }
    s += `<path class="${c}" d="M${x1 - 0.06 * len},${cy - 0.04 * h} L${x1},${cy - 0.12 * h} M${x1 - 0.06 * len},${cy + 0.04 * h} L${x1},${cy + 0.12 * h}"/>`;
    s += `<path class="${c}" d="M${x0 + 0.06 * len},${cy - 0.32 * h} C${x0 + 0.25 * len},${cy - 0.8 * h} ${x0 + 0.6 * len},${cy - 0.75 * h} ${x0 + 0.88 * len},${cy - 0.62 * h}"/><path class="${c}" d="M${x0 + 0.06 * len},${cy + 0.32 * h} C${x0 + 0.25 * len},${cy + 0.8 * h} ${x0 + 0.6 * len},${cy + 0.75 * h} ${x0 + 0.88 * len},${cy + 0.62 * h}"/>`;
    s += `<circle class="${c} mgfill" cx="${x0 + 0.06 * len}" cy="${cy}" r="${Math.max(2.2, 0.05 * h)}"/>`;
    return s;
  }
  if (o.id === "seagrass") {
    const h = Math.max(14, Math.min(0.08 * len, 30));
    let s = `<path class="${c}" d="M${x0},${cy - 0.5 * h} L${x1 - 0.06 * len},${cy - 0.5 * h} Q${x1},${cy - 0.5 * h} ${x1},${cy} Q${x1},${cy + 0.5 * h} ${x1 - 0.06 * len},${cy + 0.5 * h} L${x0},${cy + 0.5 * h} Z"/>`;
    for (const f of [-0.22, 0, 0.22]) s += `<line class="${c}" x1="${x0 + 0.02 * len}" y1="${cy + f * h}" x2="${x1 - 0.05 * len}" y2="${cy + f * h}"/>`;
    s += `<path class="${c}" d="M${x0},${cy - 0.5 * h} L${x0},${cy + 0.5 * h} M${x0 + 0.14 * len},${cy - 0.5 * h} L${x0 + 0.14 * len},${cy + 0.5 * h}"/>`;
    return s;
  }
  // limpet shell (side view): a low cone with growth lines parallel to the base
  const h = Math.min(0.4 * len, 120), base = cy + 0.42 * h, ax = x0 + 0.42 * len;
  let s = `<path class="${c}" d="M${x0},${base} C${x0 + 0.12 * len},${base - 0.6 * h} ${ax - 0.14 * len},${base - h} ${ax},${base - h} C${ax + 0.16 * len},${base - h} ${x1 - 0.1 * len},${base - 0.55 * h} ${x1},${base} Z"/>`;
  for (const k of [0.22, 0.45, 0.68]) { const y = base - k * h, xl = x0 + k * (ax - x0) * 0.95, xr = x1 - k * (x1 - ax) * 0.95; s += `<path class="${c} mgthin" d="M${xl},${y} Q${ax},${y - 0.12 * h} ${xr},${y}"/>`; }
  s += `<circle class="${c} mgfill" cx="${ax}" cy="${base - h + 4}" r="2.5"/>`;
  return s;
}

function geo(F) {
  const X = 40 + F.off * CM, Y = X + F.L * MM, G = { r0: 40, X, Y, len: Math.ceil(F.L / 10 + 0.6) + F.off, ry: 196 };
  if (F.what === "photograph") {                     // photo scaled so its measured part runs exactly from X to Y
    const m = IMG[F.org.id], w = (Y - X) / (m.fb - m.fa), h = w * m.ar;
    G.img = { x: X - m.fa * w, y: 28, w, h }; G.ry = Math.max(84, Math.ceil(28 + h + 12));
  }
  return G;
}

function rulerSVG(F, G) {
  const y = G.ry; let s = `<rect x="${G.r0 - 10}" y="${y}" width="${G.len * CM + 20}" height="38" rx="3" class="mgruler"/>`;
  for (let mm = 0; mm <= G.len * 10; mm++) { const x = G.r0 + mm * MM, h = mm % 10 === 0 ? 12 : mm % 5 === 0 ? 9 : 6; s += `<line x1="${x}" x2="${x}" y1="${y}" y2="${y + h}" class="mgtick"/>`; }
  for (let c = 0; c <= G.len; c++) s += `<text x="${G.r0 + c * CM}" y="${y + 27}" text-anchor="middle" class="mgnum">${c}</text>`;
  s += `<text x="${G.r0 + G.len * CM + 16}" y="${y + 27}" class="mgnum">cm</text>`;
  return s;
}

function drawingsSVG(F, opt) {
  // three student drawings of the same isopod: one follows the rules, the other two each break exactly one rule
  const pw = 176, ph = 210, labs = ["A", "B", "C"], panels = [];
  let k = 0;
  for (let i = 0; i < 3; i++) panels.push(i === F.goodPos ? "good" : F.faults[k++]);
  let s = "";
  panels.forEach((kind, i) => {
    const px = 6 + i * (pw + 4), py = 8;
    s += `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" class="mgpanel"/><text x="${px + 10}" y="${py + 24}" class="mglab">${labs[i]}</text>`;
    const small = kind === "small", x0 = small ? px + 18 : px + 22, x1 = small ? px + 66 : px + pw - 14, cy = small ? py + ph - 40 : py + 112;
    const cls = kind === "sketchy" ? "mgline mgsketch" : "mgline";
    let body = orgPath({ id: "isopod" }, x0, x1, cy, cls);
    if (kind === "shading") { const len = x1 - x0, h = 0.42 * len; for (let j = 0; j < 14; j++) { const x = x0 + 0.12 * len + j * 0.055 * len; body += `<line class="mgshade" x1="${x}" y1="${cy + 0.05 * h}" x2="${x + 0.06 * len}" y2="${cy + 0.42 * h}"/>`; } }
    s += body;
    // two labels: antenna (top) and leg-free label "head" (left) — label lines ruled; "arrows" panel: arrowheads stopping short
    const lenP = x1 - x0, h = Math.min(0.42 * lenP, 95);
    const tA = [x0 + 0.3 * lenP, cy - 0.8 * h], tH = [x0 + 0.06 * lenP, cy + 0.05 * h];
    const lab = (pt, tx, ty, word) => {
      if (kind === "arrows") { const dx = pt[0] - tx, dy = pt[1] - ty, d = Math.hypot(dx, dy), ex = tx + dx * (1 - 12 / d), ey = ty + dy * (1 - 12 / d), a = Math.atan2(dy, dx);
        return `<line class="mglabline" x1="${tx}" y1="${ty}" x2="${ex}" y2="${ey}"/><polygon class="mgarrow" points="${ex},${ey} ${ex - 7 * Math.cos(a - 0.45)},${ey - 7 * Math.sin(a - 0.45)} ${ex - 7 * Math.cos(a + 0.45)},${ey - 7 * Math.sin(a + 0.45)}"/><text class="mgword" x="${tx}" y="${ty - 4}" text-anchor="middle">${word}</text>`; }
      return `<line class="mglabline" x1="${tx}" y1="${ty}" x2="${pt[0]}" y2="${pt[1]}"/><text class="mgword" x="${tx}" y="${ty - 4}" text-anchor="middle">${word}</text>`;
    };
    s += lab(tA, Math.min(px + pw - 30, tA[0] + 60), py + 34, "antenna") + lab(tH, px + 30, py + ph - 14 - (small ? 120 : 0), "head");
    if (opt.tapMode) s += `<rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="transparent" data-tap="${labs[i]}"/>`;
  });
  return `<svg viewBox="0 0 ${3 * pw + 20} ${ph + 16}" class="figsvg fig-${KEY}" role="img" aria-label="Three student drawings of an isopod">${s}</svg>`;
}

function svg(F, opt) {
  opt = opt || {};
  if (opt.mode === "drawings") return drawingsSVG(F, opt);
  const G = geo(F), hl = opt.hl || {}, ph = G.img;
  let s = ph ? `<image href="${FIG_IMG}mg-${F.org.id}.webp" x="${r2(ph.x)}" y="${ph.y}" width="${r2(ph.w)}" height="${r2(ph.h)}" preserveAspectRatio="none"/>` : orgPath(F.org, G.X, G.Y, CY);
  for (const [x, t] of [[G.X, "X"], [G.Y, "Y"]]) {
    s += `<line x1="${x}" x2="${x}" y1="22" y2="${G.ry}" class="mgguide"/><text x="${x}" y="17" text-anchor="middle" class="mgxy">${t}</text>`;
    if (ph) s += `<line x1="${x}" x2="${x}" y1="${ph.y}" y2="${r2(ph.y + ph.h)}" class="mgguide-ph0"/><line x1="${x}" x2="${x}" y1="${ph.y}" y2="${r2(ph.y + ph.h)}" class="mgguide-ph"/>`;
  }
  if (hl.seg) s += `<line x1="${G.X}" x2="${G.Y}" y1="${G.ry - 5}" y2="${G.ry - 5}" class="mghl"/>`;
  s += rulerSVG(F, G);
  const capt = `${F.what === "photograph" ? "Photograph" : "Drawing"} of a ${F.org.name}${F.what === "photograph" && F.org.phCap ? " " + F.org.phCap : ""}${F.variant === "act" ? ` · magnification ×${fmt(F.M)}` : ""}`;
  s += `<text x="${W / 2}" y="${G.ry + 66}" text-anchor="middle" class="mgcap">${capt}</text>`;
  return `<svg viewBox="0 0 ${W} ${G.ry + 78}" class="figsvg fig-${KEY}" role="img" aria-label="${capt} with points X and Y and a ruler">${s}</svg>`;
}
const r2 = (v) => Math.round(v * 100) / 100;

/* accepted-range checker: any v that rounds (to dp) from a true value within [lo, hi] */
const rangeCheck = (lo, hi, dp) => (v) => { const h = 0.5 * Math.pow(10, -dp); return v - h <= hi + 1e-9 && v + h >= lo - 1e-9; };
const rnd = (v, dp) => Math.round(v * Math.pow(10, dp)) / Math.pow(10, dp);

function questions(F, r) {
  const qs = [], o = F.org, L = F.L, G = geo(F);
  const offTxt = F.off ? ` Careful: X is lined up with the ${F.off} cm mark, not with 0.` : "";
  // 1. measure the image length (mm), ±1 mm
  qs.push({ kind: "num", q: `Use the ruler to measure the length of the ${F.what} between <b>X</b> and <b>Y</b>, in millimetres. <span class="mhint">(Tap ⤢ Zoom to read the ruler.)</span>`, ans: L, tol: 1, unit: "mm", hl: { seg: true },
    why: `${F.off ? `X is at ${F.off}.0 cm and Y is at ${fmt((F.off * 10 + L) / 10, 1)} cm on the ruler, so the length is ${fmt((F.off * 10 + L) / 10, 1)} − ${F.off}.0 = ${fmt(L / 10, 1)} cm` : `X is at 0 and Y is at ${fmt(L / 10, 1)} cm`} = <b>${L} mm</b> (each small division is 1 mm). Measurements within 1 mm are accepted.${offTxt}` });
  // 2. the calculation
  const Ashow = o.unit === "cm" ? `${fmt(F.A / 10, 1)} cm` : `${fmt(F.A)} mm`;
  if (F.variant === "mag") {
    const dp = F.M >= 10 ? 0 : 1, lo = (L - 1) / F.A, hi = (L + 1) / F.A, ans = rnd(F.M, dp);
    qs.push({ kind: "num", q: `The actual length of the ${o.name} ${o.part} is <b>${Ashow}</b>.<br>Magnification = image size ÷ actual size. Calculate the magnification of the ${F.what}. Give your answer ${dp ? "to 1 decimal place" : "to the nearest whole number"}.`,
      ans, tol: 0, unit: "×", check: rangeCheck(lo, hi, dp), ansTxt: `×${fmt(ans, dp)} (any value from ×${fmt(rnd(lo, dp), dp)} to ×${fmt(rnd(hi, dp), dp)} is accepted, from a measurement within 1 mm)`, hl: { seg: true },
      why: `Use the same units for both lengths. Image = ${L} mm; actual = ${o.unit === "cm" ? `${fmt(F.A / 10, 1)} cm = ${fmt(F.A)} mm` : `${fmt(F.A)} mm`}. Magnification = ${L} ÷ ${fmt(F.A)} = ${fmt(rnd(F.M, 3))} = <b>×${fmt(ans, dp)}</b>${dp ? " (1 d.p.)" : " (nearest whole number)"}.${o.unit === "cm" ? ` Dividing ${L} by ${fmt(F.A / 10, 1)} without changing cm to mm gives an answer ten times too big.` : ""}` });
  } else {
    const outCm = o.unit === "cm", dp = 1, lo = (L - 1) / F.M, hi = (L + 1) / F.M, ansMm = F.A, ans = outCm ? rnd(ansMm / 10, dp) : rnd(ansMm, dp);
    const k = outCm ? 0.1 : 1;
    qs.push({ kind: "num", q: `The magnification of the ${F.what} is <b>×${fmt(F.M)}</b>.<br>Magnification = image size ÷ actual size. Calculate the actual length of the ${o.name} ${o.part}, in <b>${outCm ? "cm" : "mm"}</b>. Give your answer to 1 decimal place.`,
      ans, tol: 0, unit: outCm ? "cm" : "mm", check: rangeCheck(lo * k, hi * k, dp), ansTxt: `${fmt(ans, dp)} ${outCm ? "cm" : "mm"} (any value from ${fmt(rnd(lo * k, dp), dp)} to ${fmt(rnd(hi * k, dp), dp)} is accepted, from a measurement within 1 mm)`, hl: { seg: true },
      why: `Rearrange: actual size = image size ÷ magnification = ${L} mm ÷ ${fmt(F.M)} = ${fmt(rnd(ansMm, 2))} mm${outCm ? ` = <b>${fmt(ans, dp)} cm</b> (÷ 10 to change mm to cm)` : ` = <b>${fmt(ans, dp)} mm</b>`}. Multiplying by the magnification instead would give ${fmt(rnd(L * F.M, 1))} mm: far too ${F.M > 1 ? "large" : "small"}.` });
  }
  // 3. rearrangement (choice)
  const target = pickR(r, ["actual", "image", "mag"]);
  const R = { actual: ["image size ÷ magnification", "image size × magnification", "magnification ÷ image size", "image size − magnification"],
    image: ["magnification × actual size", "actual size ÷ magnification", "magnification ÷ actual size", "actual size − magnification"],
    mag: ["image size ÷ actual size", "actual size ÷ image size", "image size × actual size", "image size − actual size"] };
  const tw = { actual: "the actual size", image: "the image size", mag: "the magnification" };
  qs.push({ kind: "choice", q: `Which calculation gives <b>${tw[target]}</b>?`, options: R[target], a: 0, hl: {},
    why: `Start from magnification = image size ÷ actual size. ${target === "actual" ? "Rearranged, actual size = image size ÷ magnification." : target === "image" ? "Rearranged, image size = magnification × actual size." : "Magnification is image ÷ actual, not the other way round."} A quick check: for a magnified image (×${o.Ms[o.Ms.length - 1] >= 2 ? fmt(o.Ms[o.Ms.length - 1]) : "2"}), the image is bigger than the real object.` });
  // 4. the unit-conversion trap, diagnosed (numbers chosen so the mistake gives a 10× error)
  const im = pickR(r, [42, 56, 63, 84, 96]), acm = pickR(r, [3, 4, 6, 7, 8].filter((a) => (im / a) % 1 === 0 || ((im / a) * 10) % 1 === 0));
  if (acm) {
    const wrong = rnd(im / acm, 1), right = rnd(im / (acm * 10), 2);
    qs.push({ kind: "choice", q: `A student measured an image as <b>${im} mm</b>. The actual size is <b>${acm} cm</b>. They wrote: magnification = ${im} ÷ ${acm} = ×${fmt(wrong)}. What mistake did they make?`,
      options: ["They did not change the units to match first", "They divided the actual size by the image size", "They should have multiplied the two lengths", "They rounded the answer up instead of down"], a: 0, hl: {},
      why: `The two lengths are in different units. ${acm} cm = ${acm * 10} mm, so magnification = ${im} ÷ ${acm * 10} = <b>×${fmt(right)}</b>. Their answer is 10 times too big. They did divide the right way round (image ÷ actual), and no rounding was involved.` });
  }
  // 5. drawing rules (multi)
  const st = [
    ["The drawing uses most of the space available.", true, "Drawings should be large and use most of the space."],
    ["Lines are sharp, clear and unbroken.", true, "Use a sharp pencil and continuous lines."],
    ["There is no shading or colour.", true, "Shading and colour are not used in biological drawings."],
    ["Label lines are drawn with a ruler and touch the feature.", true, "Ruled label lines must touch the feature labelled."],
    ["The parts are drawn in the correct proportions.", true, "Proportions and positions must match the specimen."],
    ["Shading is used to show the darker parts of the body.", false, "Shading is never used; it hides the outline."],
    ["Every scale and spine is drawn to show full detail.", false, "Draw the outline and key features, not every scale."],
    ["Label lines end in an arrowhead pointing at the feature.", false, "Label lines are plain ruled lines with no arrowheads."],
    ["The outline is built up from short, sketchy strokes.", false, "Sketchy, broken lines lose marks; use one clear line."],
    ["Colour pencils are used to show the real colours.", false, "No colour is used."],
  ];
  const pick = pickMixed(r, st, 5);
  if (pick) qs.push({ kind: "multi", q: "Tick every feature of a good biological drawing.", options: pick.map((x) => x[0]), a: pick.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0), hl: {},
    why: pick.map((x) => `${x[1] ? "✓" : "✗"} ${x[0]}: ${x[2]}`).join("<br>") });
  // 6. tap the drawing that follows the rules; 7. what is wrong with one of the others
  const labs = ["A", "B", "C"], good = labs[F.goodPos], FAULT = { shading: "It uses shading", sketchy: "Its outline is sketchy and broken", arrows: "Its label lines end in arrowheads", small: "It is too small for the space" };
  const FWHY = { shading: "shading is used inside the body", sketchy: "the outline is drawn with broken, sketchy lines", arrows: "the label lines end in arrowheads and stop short of the parts", small: "it is drawn small in one corner instead of using most of the space" };
  const badIdx = [0, 1, 2].filter((i) => i !== F.goodPos), faultOf = {}; badIdx.forEach((i, k) => (faultOf[labs[i]] = F.faults[k]));
  qs.push({ kind: "tap", q: "Three students drew the same isopod. Tap the drawing that follows <b>all</b> the rules for a biological drawing.", a: [good], ansTxt: `drawing ${good}`, labelOf: (id) => `drawing ${id}`,
    askOpt: { mode: "drawings", tapMode: true }, doneOpt: () => ({ mode: "drawings", tapMode: true }),
    why: `Drawing <b>${good}</b> is large, with clear unbroken lines, no shading and ruled label lines that touch the parts. ${badIdx.map((i) => `In ${labs[i]}, ${FWHY[faultOf[labs[i]]]}.`).join(" ")}` });
  const bl = pickR(r, badIdx.map((i) => labs[i])), fk = faultOf[bl];
  qs.push({ kind: "choice", q: `What is wrong with drawing <b>${bl}</b>?`, options: [FAULT[fk], ...Object.keys(FAULT).filter((k) => k !== fk && k !== faultOf[labs[badIdx.find((i) => labs[i] !== bl)]]).map((k) => FAULT[k]), "Its labels are written in pencil, not pen"].slice(0, 4), a: 0,
    askOpt: { mode: "drawings" }, doneOpt: () => ({ mode: "drawings" }),
    why: `In drawing ${bl}, ${FWHY[fk]}. Labels in pencil are fine: a sharp pencil is what the rules ask for.` });
  return qs;
}

function selfTest(F, qs) {
  const bad = [], G = geo(F);
  if (G.Y > W - 20) bad.push("drawing runs off the figure");
  if (G.img) { if (G.img.x < 2 || G.img.x + G.img.w > W - 2) bad.push("photo runs off the figure"); if (Math.abs(G.img.x + IMG[F.org.id].fa * G.img.w - G.X) > 0.01 || Math.abs(G.img.x + IMG[F.org.id].fb * G.img.w - G.Y) > 0.01) bad.push("photo not aligned with X–Y"); }
  if (!G.img) { const sv = orgPath(F.org, G.X, G.Y, CY), ys = [...sv.matchAll(/-?\d+(?:\.\d+)?,(-?\d+(?:\.\d+)?)/g)].map((m) => +m[1]).concat([...sv.matchAll(/(?:y1|y2|cy)="(-?\d+(?:\.\d+)?)"/g)].map((m) => +m[1]));
    if (Math.min(...ys) < 20 || Math.max(...ys) > 192) bad.push(`drawing overlaps the labels or ruler (${Math.round(Math.min(...ys))}–${Math.round(Math.max(...ys))})`); }
  if (G.r0 + G.len * CM + 40 > W) bad.push("ruler runs off the figure");
  if (G.len * 10 < F.off * 10 + F.L) bad.push("ruler shorter than X–Y");
  if (!Number.isInteger(F.L) || F.L < 45 || F.L > 110) bad.push("image length out of range " + F.L);
  const o = F.org; const A = F.A; if (A < o.act[0] - 1e-9 || A > o.act[1] + 1e-9) bad.push("actual size out of range");
  if (Math.abs(F.M - F.L / F.A) > 1e-9) bad.push("M ≠ L/A");
  const calc = qs[1]; if (!calc.check(calc.ans)) bad.push("calc own answer rejected");
  // a cm/mm slip (10× error) and an upside-down division must both be rejected
  if (F.variant === "mag") { if (calc.check(calc.ans * 10) || calc.check(rnd(F.A / F.L, 3))) bad.push("trap answer accepted"); }
  else { if (calc.check(calc.ans * 10) || calc.check(calc.ans / 10) || calc.check(rnd(F.L * F.M, 1))) bad.push("trap answer accepted"); }
  const m = qs.find((q) => q.kind === "tap"); if (!m || m.a.length !== 1) bad.push("no tap");
  const ch = qs[qs.length - 1]; if (new Set(ch.options).size !== 4) bad.push("fault options not 4 unique");
  return bad;
}

export default {
  key: KEY, group: "Tables and fieldwork", name: "Magnification and drawings", topics: "Unit 3 (3.4)", thumbSeed: 5,
  blurb: "Measure a drawing or photograph with the ruler, then use magnification = image size ÷ actual size.",
  tips: ["Magnification = image size ÷ actual size. Actual size = image size ÷ magnification.", "Put both lengths in the same units first: 1 cm = 10 mm.", "Read the ruler to the nearest millimetre. If X is not at 0, subtract the starting mark.", "A good drawing is large, with clear unbroken lines, no shading, and ruled label lines that touch the part."],
  ctx: (F) => `${F.what} of a ${F.org.name}, and three student drawings`,
  make, svg, questions, selfTest,
  css: `.fig-magnify .mgline{fill:none;stroke:currentColor;stroke-width:2;stroke-linejoin:round;stroke-linecap:round}.fig-magnify .mgfill{fill:currentColor}.fig-magnify .mgthin{stroke-width:1.4}
.fig-magnify .mgsketch{stroke-dasharray:9 4 3 5;stroke-width:1.6}.fig-magnify .mgshade{stroke:currentColor;stroke-width:1.8;opacity:.85}
.fig-magnify .mgguide{stroke:var(--mut);stroke-width:1;stroke-dasharray:3 3}.fig-magnify .mgguide-ph0{stroke:#fff;stroke-opacity:.75;stroke-width:3.2}.fig-magnify .mgguide-ph{stroke:#14202a;stroke-width:1.3;stroke-dasharray:4 3}.fig-magnify .mgxy{font-weight:700;font-size:16px}
.fig-magnify .mgruler{fill:var(--surface2);stroke:currentColor;stroke-width:1.2}.fig-magnify .mgtick{stroke:currentColor;stroke-width:1}
.fig-magnify .mgnum{font-size:13px}.fig-magnify .mgcap{font-size:13px;fill:var(--soft)}.fig-magnify .mghl{stroke:var(--app);stroke-width:5;stroke-linecap:round}
.fig-magnify .mgpanel{fill:none;stroke:var(--mut);stroke-width:1.2}.fig-magnify .mglab{font-weight:700;font-size:20px}
.fig-magnify .mglabline{stroke:currentColor;stroke-width:1.3}.fig-magnify .mgarrow{fill:currentColor}.fig-magnify .mgword{font-size:16px}`,
};
