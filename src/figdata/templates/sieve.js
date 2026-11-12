/* ---------- SIEVING RESULTS: SEDIMENT PARTICLE-SIZE TABLE + BAR CHART (0697 5.2/LO4 PA; 5.5/LO2) ----------
   A dried sediment sample of known starting mass is shaken through a stack of four sieves (largest mesh at the top);
   the mass caught on each sieve and the mass that passed through all of them are tabulated, with a total row, and drawn
   as a bar chart of the five size classes. Three layouts, fixed by the seed:
     pct   one sample; the table has a percentage column with one blank, and that class's bar is missing from a
           percentage chart (complete the table, then plot the bar);
     mass1 one sample; mass chart, no percentage column;
     two   Sample A and Sample B (one sandy, one muddy, same starting mass) as a grouped mass chart with a hatching key.
   Stacks 2/1/0.5/0.125 or 1/0.5/0.25/0.125 mm. The shore item is worded against the middle sieve S[2], which sampleOk
   guarantees (coarse: ≥60% larger; fine: ≥65% smaller); the cumulative item never uses S[2]. Masses are whole tenths of a gram (balance to 0.1 g) and add up exactly to the total row; a seeded 0–4.8 g is lost in
   sieving. KM5 5.2/LO4: dry first so particles do not clump; decreasing mesh down the stack; weigh each fraction;
   callipers for oversized particles. Forbidden: named grain-size scales (no phi, no Wentworth class names: no "silt",
   "clay", "gravel"), sorting coefficients; 5.5/LO2 particle-size numbers are given, never required.
   Misconceptions as distractors: mud = larger particles; mud particles are heavy; sieving measures moisture; mud holds
   more oxygen; sand is more stable; fine sediment is brought in by strong waves; the fraction that passed through every
   sieve was "lost".
   Questions: % of total mass collected in one class (stated rounding; pct: the blank cell); tap the class with the largest
   mass (two: in the sandy sample, or where the samples are closest / differ most); % finer/coarser than a mesh size (cumulative, nearest whole number); check
   the total against the starting mass (choice); which shore / which holds more oxygen and why (choice); method
   statements (multi); plot the missing bar (last). U5-125 (one sieve ÷ starting mass) is not repeated. Data generated. */
import { rng, pickR, shuffleR, fmt, pickMixed } from "../core.js";

const KEY = "sieve";
// both stacks end at 0.125 mm, so a mostly-finer-than-the-last-sieve sample is mud rather than fine sand, and the stack
// used gives no clue to the shore type
const STACKS = [[2, 1, 0.5, 0.125], [1, 0.5, 0.25, 0.125]];
const SHAPES = { c1: [[12, 22], [30, 42], [18, 28], [8, 15], [2, 7]], c2: [[4, 10], [16, 26], [30, 42], [14, 22], [3, 8]], fine: [[1, 4], [3, 7], [8, 14], [18, 28], [45, 62]] };
const M0S = [100, 150, 200, 250];
const NC = 5, ROWS = 40;
const SITES = ["a study site on the coast", "a site near the low-tide mark", "a coastal survey site"];
const g1 = (t) => (t / 10).toFixed(1);                     // tenths of a gram → "48.6"
const rdp = (v, dp) => Math.round(v * 10 ** dp) / 10 ** dp;
const fx = (v, dp) => rdp(v, dp).toFixed(dp);
const nearHalf = (v, dp, m) => { const f = Math.abs(v * 10 ** dp) % 1; return Math.abs(f - 0.5) < m; };
const sum = (a) => a.reduce((s, x) => s + x, 0);
const argmax = (a) => a.indexOf(Math.max(...a));
const ruleTxt = (dp) => (dp === 0 ? "to the nearest whole number" : "to 1 decimal place");

const clsLab = (S, i) => (i === 0 ? `more than ${S[0]}` : i === 4 ? `less than ${S[3]}` : `${S[i]}–${S[i - 1]}`);
const clsTxt = (S, i) => (i === 0 ? `larger than ${S[0]} mm` : i === 4 ? `smaller than ${S[3]} mm` : `between ${S[i]} mm and ${S[i - 1]} mm`);
const rowName = (S, i) => (i < 4 ? `the ${S[i]} mm sieve` : "the sediment that passed through all the sieves");
const rowShort = (S, i) => (i < 4 ? `${S[i]} mm sieve` : "passed through all sieves");

function genSample(r, shape, M0) {
  const w = SHAPES[shape].map(([a, b]) => a + r() * (b - a)), sw = sum(w);
  const loss = r() < 0.5 ? 0 : 12 + Math.floor(r() * 37), T = M0 * 10 - loss;
  const mt = w.map((x) => Math.round((T * x) / sw)); mt[argmax(mt)] += T - sum(mt);
  return { shape, coarse: shape !== "fine", M0, loss, T, mt };
}
function sampleOk(s) {
  if (new Set(s.mt).size !== NC || Math.min(...s.mt) < 10 || s.mt[4] === s.loss) return false;
  const P = s.mt.map((x) => (x / s.T) * 100);
  if (s.coarse) return P[0] + P[1] + P[2] >= 60 && P[4] <= 8;
  return P[3] + P[4] >= 65 && P[0] + P[1] <= 10 && P[4] >= 45;
}
const pickPs = (mx, opts) => opts.find((p) => mx <= 38 * p && mx >= 16 * p) || null;

function make(seed) {
  const r0 = rng(seed), u = r0(), mode = u < 0.4 ? "pct" : u < 0.65 ? "mass1" : "two", tu = r0();
  const tapVar = mode !== "two" ? "max" : tu < 0.4 ? "max" : tu < 0.7 ? "close" : "diff";   // "differ most" is always the bottom class, so it is kept to under a third
  for (let tries = 0; tries < 900; tries++) {
    const r = rng(seed + tries * 7919 + 11), S0 = pickR(r, STACKS), M0 = pickR(r, M0S), cs = pickR(r, ["c1", "c2"]);
    let shapes;
    if (mode === "two") shapes = r() < 0.5 ? [cs, "fine"] : ["fine", cs];
    else shapes = [r() < 0.5 ? cs : "fine"];
    const S = S0;
    const smp = shapes.map((sh) => genSample(r, sh, M0));
    if (!smp.every(sampleOk)) continue;
    if (mode === "two" && new Set([...smp[0].mt, ...smp[1].mt]).size !== 2 * NC) continue;
    const F = { kind: KEY, seed, mode, S, M0, smp, ns: smp.length, site: pickR(r, SITES), tapVar };
    // values drawn as bars, scale, the blank (pct)
    if (mode === "pct") {
      const s0 = smp[0], P = s0.mt.map((x) => (x / s0.T) * 100), pdp = pickR(r, [0, 1]);
      const disp = P.map((p) => rdp(p, pdp));
      if (new Set(disp).size !== NC || disp.some((x) => x < 1)) continue;
      const mx = argmax(P), cand = [0, 1, 2, 3, 4].filter((i) => i !== mx && disp[i] >= 4 && !nearHalf(P[i], pdp, 0.15)
        && rdp(100 - sum(disp.filter((_, j) => j !== i)), pdp) === disp[i]);
      if (!cand.length) continue;
      F.pdp = pdp; F.P = P; F.disp = disp; F.blank = pickR(r, cand);
      F.vals = [disp]; F.ps = pickPs(Math.max(...disp), [1, 2]); F.unit = "%";
    } else {
      F.vals = smp.map((s) => s.mt.map((x) => x / 10)); F.ps = pickPs(Math.max(...F.vals.flat()), [1, 2, 5]); F.unit = "g";
    }
    if (!F.ps) continue;
    const ps = F.ps;
    // largest bar (single) / largest difference (two): a clear winner
    if (tapVar === "diff" || tapVar === "close") {
      const d = [0, 1, 2, 3, 4].map((c) => Math.abs(F.vals[0][c] - F.vals[1][c])), sd = d.slice().sort((a, b) => (tapVar === "diff" ? b - a : a - b));
      if (Math.abs(sd[0] - sd[1]) < 2 * ps) continue; F.tapC = d.indexOf(sd[0]);
    } else {
      F.tapS = F.ns === 2 ? smp.findIndex((x) => x.coarse) : 0;
      const v = F.vals[F.tapS], sv = v.slice().sort((a, b) => b - a); if (sv[0] - sv[1] < 2 * ps) continue; F.tapC = argmax(v);
    }
    // missing bar for the plot question
    let hc, hs = 0;
    if (mode === "pct") hc = F.blank;
    else {
      hs = Math.floor(r() * F.ns);
      const c = [0, 1, 2, 3, 4].filter((i) => i !== argmax(F.vals[hs]) && i !== F.tapC && F.vals[hs][i] >= 3 * ps);
      if (!c.length) continue; hc = pickR(r, c);
    }
    if (F.vals[hs][hc] < 3 * ps) continue;
    F.hide = { c: hc, s: hs };
    // first calculation (mass layouts): one class of one sample
    if (mode !== "pct") {
      const s = Math.floor(r() * F.ns), c = Math.floor(r() * NC), dp = pickR(r, [0, 1]), p = (smp[s].mt[c] / smp[s].T) * 100;
      if (nearHalf(p, dp, 0.15)) continue; F.q1 = { s, c, dp };
    } else F.q1 = { s: 0, c: F.blank, dp: F.pdp };
    // cumulative percentage finer / coarser than a mesh size (never the middle sieve S[2]: that split is the shore item's evidence)
    const cum = [];
    for (let s = 0; s < F.ns; s++) for (let k = 0; k <= 1; k++) for (const dir of ["larger", "smaller"]) {
      if (dir === "larger" && k === 0) continue;
      const cl = dir === "larger" ? [...Array(k + 1).keys()] : [...Array(NC).keys()].filter((i) => i > k);
      if (cl.length < 2) continue;
      const pc = (sum(cl.map((i) => smp[s].mt[i])) / smp[s].T) * 100;
      if (nearHalf(pc, 0, 0.2)) continue;
      if (mode === "pct" && Math.round(sum(cl.map((i) => F.disp[i]))) !== Math.round(pc)) continue;
      // the off-by-one-sieve slip must give a different answer
      const alt = dir === "larger" ? cl.slice(0, -1) : [k, ...cl];
      if (Math.abs(Math.round((sum(alt.map((i) => smp[s].mt[i])) / smp[s].T) * 100) - Math.round(pc)) < 2) continue;
      cum.push({ s, k, dir, cl, pc });
    }
    if (!cum.length) continue;
    F.cum = pickR(r, cum);
    F.chk = Math.floor(r() * F.ns);
    F.shoreVar = mode === "two" ? pickR(r, ["mud", "sand", "oxy"]) : "type";
    return F;
  }
  return make(seed + 1);
}

/* ---- figure ---- */
const sName = (F, s) => (F.ns === 2 ? `Sample ${"AB"[s]}` : "the sample");
const geo = (F) => {
  const W = 470, L = 68, R = 6, T = F.ns === 2 ? 50 : 20, ph = 330, B = 88, pw = W - L - R, cw = pw / NC, sq = ph / ROWS;
  const bw = F.ns === 2 ? cw * 0.34 : cw * 0.5, gap = cw * 0.05;
  const bx = (c, s) => (F.ns === 2 ? L + cw * c + (cw - 2 * bw - gap) / 2 + s * (bw + gap) : L + cw * c + (cw - bw) / 2);
  return { W, L, T, ph, B, pw, cw, sq, bw, bx, H: T + ph + B, yv: (v) => T + ph - (v / F.ps) * sq };
};
/* axes for the reading guide: the value (y) axis of the bar chart only (category axis has no numeric ticks). */
function axes(F) {
  const G = geo(F), { L, T, ph, pw, sq } = G;
  const yt = []; for (let i = 0; i <= ROWS; i++) yt.push({ at: T + ph - i * sq, label: i % 5 === 0 ? fmt(i * F.ps) : undefined });
  return [{ plot: { x0: L, x1: L + pw, y0: T, y1: T + ph }, x: { ticks: [] }, y: { ticks: yt } }];
}
function wrapLab(t, x, y) {
  // "more than 2" / "less than 0.25" on two lines; a long range such as "0.125–0.25" splits after the dash
  const two = /^(more|less) than /.test(t) ? [t.replace(/ [^ ]+$/, ""), t.replace(/^.* /, "")] : t.length > 8 ? [t.replace(/–.*$/, "–"), t.replace(/^.*–/, "")] : null;
  if (!two) return `<text x="${x}" y="${y}" text-anchor="middle" class="svcat">${t}</text>`;
  return `<text x="${x}" y="${y}" text-anchor="middle" class="svcat"><tspan x="${x}">${two[0]}</tspan><tspan x="${x}" dy="19">${two[1]}</tspan></text>`;
}
function chart(F, opt) {
  const G = geo(F), { W, L, T, ph, pw, cw, sq, bw, bx, H, yv } = G, hl = (opt.hl && opt.hl.bars) || [];
  const hide = opt.hide !== undefined ? opt.hide : F.mode === "pct" ? [`${F.blank}-0`] : [];
  let s = `<defs><pattern id="sieve-h0" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="7" height="7" class="svpbg"/><line x1="0" y1="0" x2="0" y2="7" stroke="currentColor" stroke-width="2.4"/></pattern></defs>`;
  const cols = Math.round(pw / sq);
  for (let i = 0; i <= ROWS; i++) s += `<line x1="${L}" x2="${L + pw}" y1="${T + i * sq}" y2="${T + i * sq}" class="${i % 5 ? "gmin" : "gmaj"}"/>`;
  for (let i = 0; i <= cols; i++) { const x = L + (i * pw) / cols; s += `<line x1="${x}" x2="${x}" y1="${T}" y2="${T + ph}" class="${i % 5 ? "gmin" : "gmaj"}"/>`; }
  for (let i = 0; i <= ROWS; i += 5) s += `<text x="${L - 8}" y="${T + ph - i * sq + 6}" text-anchor="end" class="svtick">${fmt(i * F.ps)}</text>`;
  const cls = (si) => (F.ns === 2 ? `svs${si}` : "fbar");
  for (let si = 0; si < F.ns; si++) F.vals[si].forEach((v, c) => {
    const id = `${c}-${si}`; if (hide.includes(id)) return; const y = yv(v);
    s += `<rect x="${bx(c, si)}" y="${y}" width="${bw}" height="${T + ph - y}" class="${cls(si)}${hl.includes(id) ? " hl" : ""}"/>`;
  });
  if (opt.state && opt.state.c != null) { const st = opt.state, y = yv(st.v); s += `<rect x="${bx(st.c, F.hide.s)}" y="${y}" width="${bw}" height="${T + ph - y}" class="${cls(F.hide.s)} plotted svstu"/>`; }
  for (let c = 0; c < NC; c++) s += wrapLab(clsLab(F.S, c), L + cw * (c + 0.5), T + ph + 23);
  s += `<line x1="${L}" x2="${L + pw}" y1="${T + ph}" y2="${T + ph}" class="axis"/><line x1="${L}" x2="${L}" y1="${T}" y2="${T + ph}" class="axis"/>`;
  s += `<text x="${L + pw / 2}" y="${H - 8}" text-anchor="middle" class="svax">particle size / mm</text><text transform="translate(17 ${T + ph / 2}) rotate(-90)" text-anchor="middle" class="svax">${F.mode === "pct" ? "percentage of total mass / %" : "mass of sediment / g"}</text>`;
  if (F.ns === 2) s += `<g class="svax"><rect x="${L}" y="12" width="26" height="18" class="svs0"/><text x="${L + 34}" y="27">Sample A</text><rect x="${L + 170}" y="12" width="26" height="18" class="svs1"/><text x="${L + 204}" y="27">Sample B</text></g>`;
  if (opt.tapMode) for (let c = 0; c < NC; c++) s += `<rect x="${L + cw * c + 3}" y="${T}" width="${cw - 6}" height="${ph}" class="svhit" data-tap="c${c}"/>`;
  if (opt.plotMode) s += `<rect x="${L}" y="${T}" width="${pw}" height="${ph}" fill="transparent" class="plothit"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="figsvg fig-${KEY} fig-${KEY}-c" role="img" aria-label="Bar chart of sediment ${F.mode === "pct" ? "percentage" : "mass"} in each particle-size class">${s}</svg>`;
}
function table(F, opt) {
  const { S, smp } = F, hc = new Set((opt.hl && opt.hl.cells) || []), blank = F.mode === "pct" && opt.blank;
  const td = (row, col, txt, extra) => `<td class="${[hc.has(`${row}-${col}`) ? "hl" : "", extra || ""].filter(Boolean).join(" ")}">${txt}</td>`;
  let h = `<table class="ftable"><thead>`;
  if (F.ns === 2) h += `<tr><th rowspan="2">mesh size of sieve / mm</th><th colspan="2">mass of sediment collected / g</th></tr><tr><th>Sample A</th><th>Sample B</th></tr>`;
  else h += `<tr><th>mesh size of sieve / mm</th><th>mass of sediment collected / g</th>${F.mode === "pct" ? "<th>percentage of total mass / %</th>" : ""}</tr>`;
  h += `</thead><tbody>`;
  for (let i = 0; i < NC; i++) {
    h += `<tr><th scope="row"${i === 4 ? ' class="svpan"' : ""}>${i < 4 ? S[i] : "passed through all sieves"}</th>`;
    smp.forEach((s, si) => (h += td(i, si + 1, g1(s.mt[i]))));
    if (F.mode === "pct") h += blank && i === F.blank ? td(i, 2, "", "blank") : td(i, 2, fx(F.disp[i], F.pdp));
    h += `</tr>`;
  }
  h += `<tr class="svtot"><th scope="row">total</th>${smp.map((s, si) => td(5, si + 1, g1(s.T))).join("")}${F.mode === "pct" ? td(5, 2, F.pdp ? "100.0" : "100") : ""}</tr>`;
  return h + `</tbody></table>`;
}
function svg(F, opt) {
  opt = opt || {};
  if (opt.thumb) return chart(F, { hide: [] });
  const cap = F.ns === 2
    ? `Two sediment samples, A and B, were collected from two different shores. Each sample had a starting mass of <b>${F.M0}.0 g</b>. Each was passed through the same stack of sieves, with the largest mesh at the top.`
    : `A sediment sample was collected from ${F.site}. Its starting mass was <b>${F.M0}.0 g</b>. It was passed through a stack of sieves, with the largest mesh at the top.`;
  return `<div class="fig-${KEY}"><p class="sv-cap">${cap}</p>${table(F, opt)}${chart(F, opt)}</div>`;
}

/* ---- questions ---- */
function questions(F, r) {
  const { S, smp, ps } = F, qs = [], two = F.ns === 2, u = F.unit === "%" ? "%" : " g";
  const sIn = (s) => (two ? ` for <b>Sample ${"AB"[s]}</b>` : "");
  const keepFill = (q) => q;   // the completed table is the default figure, so nothing extra is needed after Check
  // 1. percentage of the total mass collected in one size class
  {
    const { s, c, dp } = F.q1, sm = smp[s], p = (sm.mt[c] / sm.T) * 100, ans = rdp(p, dp);
    const stem = F.mode === "pct"
      ? `The percentage for ${rowName(S, c)} has been left blank in the table. Calculate it. Give your answer ${ruleTxt(dp)}.`
      : `Calculate the percentage of the total mass collected${sIn(s)} that ${c < 4 ? `was caught on the ${S[c]} mm sieve` : "passed through all the sieves"}. Give your answer ${ruleTxt(dp)}.`;
    const chk = F.mode === "pct" ? ` Check: the five percentages should add up to 100% (100 − the other four = ${fx(100 - sum(F.disp.filter((_, j) => j !== c)), dp)}%).` : "";
    qs.push({ kind: "num", q: stem, ans, tol: 0, dp, unit: "%", check: (v) => Math.abs(v - ans) < 1e-9, askOpt: { blank: true },
      hl: { cells: [`${c}-${s + 1}`, `5-${s + 1}`].concat(F.mode === "pct" ? [`${c}-2`] : []) },
      why: `Percentage = mass in the class ÷ total mass collected × 100 = ${g1(sm.mt[c])} ÷ ${g1(sm.T)} × 100 = ${p.toFixed(dp + 2)} → <b>${fx(ans, dp)}%</b> ${ruleTxt(dp)}. Use the total from the table, the mass that was actually sieved.${chk}` });
  }
  // 2. tap: the size class with the largest mass (one sample) / where the samples differ most (two)
  {
    const c = F.tapC, lab = (i) => `${clsLab(S, i)} mm`, both = F.tapVar !== "max", ts = F.tapS || 0;
    const tapHl = { bars: both ? [`${c}-0`, `${c}-1`] : [`${c}-${ts}`], cells: both ? [`${c}-1`, `${c}-2`] : [`${c}-${ts + 1}`] };
    let q, why;
    if (F.tapVar !== "max") {
      const d = [0, 1, 2, 3, 4].map((i) => Math.abs(smp[0].mt[i] - smp[1].mt[i])), most = F.tapVar === "diff";
      q = most ? "Tap the size class in which the masses of Sample A and Sample B differ the most." : "Tap the size class in which the masses of Sample A and Sample B are closest to each other.";
      why = `Subtract the two masses in each size class: ${d.map((x, i) => `${lab(i)} ${g1(x)} g`).join("; ")}. The ${most ? "biggest" : "smallest"} difference is <b>${lab(c)}</b> (${g1(smp[0].mt[c])} g against ${g1(smp[1].mt[c])} g).`;
    } else if (two) {
      const X = "AB"[F.tapS];
      q = `Tap the size class that contains the largest mass of sediment in <b>Sample ${X}</b>.`;
      why = `The tallest Sample ${X} bar (${F.tapS ? "plain" : "hatched"} in the key) is <b>${lab(c)}</b>, which matches the largest Sample ${X} mass in the table, ${g1(smp[F.tapS].mt[c])} g (${rowShort(S, c)}). Compare only bars with the same shading.`;
    } else {
      q = "Tap the size class that contains the largest mass of sediment.";
      why = `The tallest bar is <b>${lab(c)}</b>, which matches the largest mass in the table, ${g1(smp[0].mt[c])} g (${rowShort(S, c)}).${F.mode === "pct" ? " Each percentage is in proportion to its mass, so the largest percentage is also the largest mass." : ""}`;
    }
    qs.push(keepFill({ kind: "tap", q, a: [`c${c}`], askOpt: { tapMode: true }, labelOf: (id) => lab(+id.slice(1)), ansTxt: lab(c), hint: "Tap a size class on the bar chart.",
      hl: tapHl, why, doneOpt: () => ({ hl: tapHl, tapMode: true }) }));
  }
  // 3. cumulative: percentage of particles larger / smaller than a mesh size
  {
    const { s, k, dir, cl, pc } = F.cum, sm = smp[s], mesh = S[k], ans = Math.round(pc), tot = sum(cl.map((i) => sm.mt[i]));
    const sv = cl.filter((i) => i < 4).map((i) => `${S[i]} mm`), pan = cl.includes(4);
    const svTxt = sv.length ? `the ${sv.length > 1 ? sv.slice(0, -1).join(", ") + " and " + sv[sv.length - 1] + " sieves" : sv[0] + " sieve"}` : "";
    const reason = dir === "larger"
      ? `Particles larger than ${mesh} mm cannot pass through the ${mesh} mm mesh, so they were caught on ${svTxt}.`
      : `Particles smaller than ${mesh} mm passed through the ${mesh} mm sieve, so they were caught on ${svTxt}${pan ? " or passed through all the sieves" : ""}. The ${mesh} mm sieve itself holds particles larger than ${mesh} mm, so leave it out.`;
    qs.push(keepFill({ kind: "num", q: `What percentage of the total mass collected${sIn(s)} was made up of particles ${dir} than ${mesh} mm? Give your answer to the nearest whole number.`,
      ans, tol: 0, dp: 0, unit: "%", check: (v) => Math.abs(v - ans) < 1e-9, hl: { cells: cl.map((i) => `${i}-${s + 1}`).concat([`5-${s + 1}`]) },
      why: `${reason} Add these masses: ${cl.map((i) => g1(sm.mt[i])).join(" + ")} = ${g1(tot)} g. Then ${g1(tot)} ÷ ${g1(sm.T)} × 100 = ${pc.toFixed(2)} → <b>${ans}%</b>.` }));
  }
  // 4. check the total against the starting mass
  {
    const s = F.chk, sm = smp[s], L = g1(sm.loss), pan = g1(sm.mt[4]), who = two ? `Sample ${"AB"[s]}` : "the sample";
    const A = "No sediment was lost: the total collected equals the starting mass", E = `${pan} g was lost, because it passed through all of the sieves`;
    const opts = sm.loss
      ? [`${L} g was lost as fine dust or as grains stuck in the sieve mesh`, A, `${L} g was lost, because particles broke into smaller pieces as they were shaken`, E]
      : [A, "Some sediment was lost, because the total is below the starting mass", E, "The total is more than the starting mass, so the balance needs checking"];
    const why = sm.loss
      ? `Starting mass − total collected = ${F.M0}.0 − ${g1(sm.T)} = <b>${L} g lost</b>. Small losses happen when fine particles escape as dust or stay stuck in the mesh. Particles breaking into smaller pieces would not change the total mass, and the ${pan} g that passed through all the sieves was collected and weighed, so it is part of the total.`
      : `The total collected, ${g1(sm.T)} g, equals the starting mass of ${F.M0}.0 g, so <b>no sediment was lost</b>. The ${pan} g that passed through all the sieves was collected underneath and weighed, so it is part of the total, not a loss.`;
    qs.push(keepFill({ kind: "choice", q: `The starting mass of ${who} was ${F.M0}.0 g. Compare this with the total mass collected. Which statement is correct?`, options: opts, a: 0, hl: { cells: [`5-${s + 1}`] }, why }));
  }
  // 5. which shore / which holds more oxygen, and why
  {
    let q, opts, why;
    const mid = `${S[2]} mm`, ofs = (s) => (s.mt[0] + s.mt[1] + s.mt[2]) / s.T * 100;   // % larger than the middle sieve
    const ev = (s, who) => (s.coarse ? `${fx(ofs(s), 0)}% of ${who} mass was caught on the ${S[0]} mm, ${S[1]} mm and ${S[2]} mm sieves, so most of ${who} mass is in particles larger than ${mid}`
      : `${fx(100 - ofs(s), 0)}% of ${who} mass passed through the ${mid} sieve, so most of ${who} mass is in particles smaller than ${mid}`);
    if (two) {
      const C = "AB"[smp[0].coarse ? 0 : 1], Fn = "AB"[smp[0].coarse ? 1 : 0];
      const lead = "One sample came from a sandy shore facing the open sea and the other from a muddy shore in a sheltered bay.";
      if (F.shoreVar === "mud") {
        q = `${lead} Which sample came from the <b>muddy</b> shore, and why?`;
        opts = [`Sample ${Fn}, because most of its mass is in particles smaller than ${mid}`, `Sample ${C}, because most of its mass is in particles larger than ${mid}`, `Sample ${C}, because its large, heavy particles settle out in sheltered water`, `Sample ${Fn}, because strong waves carry the small particles onto the shore`];
        why = `${ev(smp["AB".indexOf(Fn)], `Sample ${Fn}'s`)}. Very small particles settle only in sheltered, calm water, so they build up on a muddy shore; strong waves would carry them away. Sample ${C} has mostly larger particles, which stay on an exposed sandy shore. Mud particles are small and light, not heavy.`;
      } else if (F.shoreVar === "sand") {
        q = `${lead} Which sample came from the <b>sandy</b> shore, and why?`;
        opts = [`Sample ${C}, because most of its mass is in particles larger than ${mid}`, `Sample ${Fn}, because most of its mass is in particles smaller than ${mid}`, `Sample ${Fn}, because strong waves leave the smallest particles behind`, `Sample ${C}, because its large particles stick together and make it stable`];
        why = `${ev(smp["AB".indexOf(C)], `Sample ${C}'s`)}. On a shore facing the open sea, strong waves carry the very small particles away and leave the larger ones, so the sediment is sand. Sand grains are loose and easily moved (unstable); it is mud particles that stick together when wet.`;
      } else {
        q = `${lead} Which sample's sediment is likely to hold more oxygen between its particles, and why?`;
        opts = [`Sample ${C}, because its larger particles leave air spaces and drain well`, `Sample ${Fn}, because its small particles hold more water, which holds oxygen`, `Sample ${Fn}, because the calm water over it lets more oxygen dissolve`, `Sample ${C}, because its particles stick together and trap air between them`];
        why = `${ev(smp["AB".indexOf(C)], `Sample ${C}'s`)} (sand). There are bigger spaces between them, so water drains out and air gets in, and the sediment holds more oxygen. Sample ${Fn} has mostly very small particles (mud), packed closely and waterlogged, so it has few air spaces and little oxygen. Mud particles stick together; sand grains do not.`;
      }
    } else {
      q = "This sample came either from a sandy shore facing the open sea or from a muddy shore in a sheltered bay. Which is more likely, and why?";
      // a 2 × 2 of shore × what the data show, so no option is singled out by sharing words with the others
      const o = (sh, sz) => `The ${sh} shore, because most of the mass is in particles ${sz} than ${mid}`;
      const e1 = ev(smp[0], "the");
      if (smp[0].coarse) {
        opts = [o("sandy", "larger"), o("muddy", "larger"), o("sandy", "smaller"), o("muddy", "smaller")];
        why = `${e1[0].toUpperCase() + e1.slice(1)}. Strong waves on a shore facing the open sea carry very small particles away and leave larger ones, so this is <b>sand</b>. Mud has very small, light particles that settle only in sheltered, calm water; mud is not made of larger particles.`;
      } else {
        opts = [o("muddy", "smaller"), o("sandy", "smaller"), o("muddy", "larger"), o("sandy", "larger")];
        why = `${e1[0].toUpperCase() + e1.slice(1)}. Very small particles settle only in sheltered, calm water, where deposition is greater than erosion, so this is <b>mud</b>. On a shore facing the open sea, strong waves carry small particles away.`;
      }
    }
    qs.push(keepFill({ kind: "choice", q, options: opts, a: 0, hl: {}, why }));
  }
  // 6. method statements
  {
    // pairs that state opposite versions of one step: at most one of each pair is shown, so neither gives the other away
    const fam = [
      [["The sediment is dried first, so that the particles do not clump together.", true, "damp particles stick together and are caught on the wrong sieve"],
        ["The sediment is sieved while still damp, so that no fine dust is lost.", false, "damp sediment clumps, so small particles are caught with the large ones; it is dried first"]],
      [["Each sample is shaken for the same length of time.", true, "the shaking time is a control variable: longer shaking lets more particles through"],
        ["The shaking time can differ between samples, as the total mass stays the same.", false, "the shaking time changes how the mass is shared between the sieves, so it must be kept the same"]],
      [["The sieve with the smallest mesh is placed at the bottom of the stack.", true, "the mesh gets smaller down the stack, so each sieve catches a smaller size class"],
        ["The sieve with the largest mesh is placed at the bottom of the stack.", false, "the largest mesh goes at the top, otherwise every particle would fall straight through to it"]],
    ];
    fam.push([["Particles too large for the sieves can be measured with callipers.", true, "very large particles, such as pebbles or shells, are measured directly"],
      ["Particles too large for the sieves are left out of the results.", false, "they are part of the sample, so they are measured with a ruler or callipers instead"]]);
    fam.push([["Sieving shows particle size, not moisture content.", true, "moisture content is a different practical: weigh, dry and reweigh"],
      ["Sieving also shows the moisture content of the sediment.", false, "sieving sorts particles by size; moisture content is found by weighing, drying and reweighing"]]);
    const pickV = fam.map(() => Math.floor(r() * 2));
    if (pickV.every((v) => v === pickV[0])) { const j = Math.floor(r() * fam.length); pickV[j] = 1 - pickV[j]; }   // keep a true/false mix
    const st = fam.map((f, j) => f[pickV[j]]);
    if (two) st.push(["Both samples are passed through the same set of sieves.", true, "the same mesh sizes are needed for a fair comparison"]);
    const pick = pickMixed(r, st, 4);
    qs.push(keepFill({ kind: "multi", q: "Which of these describe a good method for this investigation? Tick <b>every</b> correct statement.", options: pick.map((x) => x[0]), a: pick.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0), hl: {},
      why: pick.map((x) => `${x[1] ? "✓" : "✗"} ${x[0]}: ${x[2]}.`).join("<br>") }));
  }
  // 7. plot the missing bar (last)
  {
    const { c: hc, s: hs } = F.hide, hid = `${hc}-${hs}`, ans = F.vals[hs][hc], h = ps / 2, top = ROWS * ps, snap = Math.round(ans / h) * h;
    const valTxt = F.mode === "pct" ? `${fx(ans, F.pdp)}%` : `${g1(smp[hs].mt[hc])} g`;
    const stem = F.mode === "pct"
      ? `The bar for the <b>${clsLab(S, hc)} mm</b> size class is missing. Its percentage is <b>${valTxt}</b>. Tap the chart to draw the bar in the right place, at the right height.`
      : `The bar${two ? ` for <b>Sample ${"AB"[hs]}</b>` : ""} in the <b>${clsLab(S, hc)} mm</b> size class is missing. Use the table to draw it. Tap the chart to place the bar, at the right height.`;
    qs.push({ kind: "plot", q: stem, hl: { bars: [hid] }, askOpt: { hide: [hid], plotMode: true },
      plot: {
        start: { c: 0, v: 0 }, answer: { c: hc, v: snap }, hint: "Tap the chart to draw the bar.",
        fromTap: (p) => { const G = geo(F); return { c: Math.max(0, Math.min(NC - 1, Math.floor((p.x - G.L) / G.cw))), v: Math.max(0, Math.min(top, (Math.round(((G.T + G.ph - p.y) / G.sq) * 2) / 2) * ps)) }; },
        nudges: [["c-", "◀", "Move the bar one class left"], ["v-", "▼", "Lower the bar by half a square"], ["v+", "▲", "Raise the bar by half a square"], ["c+", "▶", "Move the bar one class right"]],
        nudge: (s, k) => ({ c: k === "c-" ? Math.max(0, s.c - 1) : k === "c+" ? Math.min(NC - 1, s.c + 1) : s.c, v: rdp(k === "v-" ? Math.max(0, s.v - h) : k === "v+" ? Math.min(top, s.v + h) : s.v, 2) }),
        label: (s) => `Your bar: ${clsLab(S, s.c)} mm, ${fmt(s.v)}${u}.`,
        check: (s) => s.c === hc && Math.abs(s.v - ans) <= h + 1e-9,
      },
      doneOpt: (s, ok) => ({ hide: ok ? [hid] : [], state: s, hl: { bars: ok ? [] : [hid], cells: [`${hc}-${F.mode === "pct" ? 2 : hs + 1}`] } }),
      doneNote: (s, ok) => (ok ? "" : `Highlighted: the correct bar, ${clsLab(S, hc)} mm at ${valTxt}. Your bar has the orange outline.`),
      why: `Find the ${clsLab(S, hc)} mm class${two ? ` and use the Sample ${"AB"[hs]} position and shading from the key` : ""}. Each small square is ${fmt(ps)}${u}, so ${valTxt} is ${fmt(rdp(ans / ps, 2))} small squares up. Draw the bar the same width as the others; it is marked to within half a small square (±${fmt(h)}${u}).` });
  }
  return qs;
}

function selfTest(F, qs) {
  const bad = [], { smp, S } = F;
  smp.forEach((s, i) => {
    if (sum(s.mt) !== s.T) bad.push("masses do not add up " + i);
    if (s.T + s.loss !== s.M0 * 10) bad.push("loss wrong " + i);
    if (new Set(s.mt).size !== NC) bad.push("tied masses " + i);
    if (!sampleOk(s)) bad.push("sample shape " + i);
  });
  if (F.ns === 2 && smp[0].coarse === smp[1].coarse) bad.push("two samples same type");
  F.vals.forEach((v) => { if (Math.max(...v) > ROWS * F.ps) bad.push("bar above axis"); });
  if (F.mode === "pct" && Math.abs(sum(F.P) - 100) > 1e-6) bad.push("percentages");
  const q1 = qs[0], s1 = smp[F.q1.s]; if (Math.abs(q1.ans - rdp((s1.mt[F.q1.c] / s1.T) * 100, F.q1.dp)) > 1e-9) bad.push("q1 answer");
  const tq = qs.find((q) => q.kind === "tap"), tc = +tq.a[0].slice(1);
  if (F.ns === 1 && F.vals[0][tc] !== Math.max(...F.vals[0])) bad.push("tap not max");
  if (F.ns === 2 && F.tapVar !== "max") { const d = [0, 1, 2, 3, 4].map((i) => Math.abs(smp[0].mt[i] - smp[1].mt[i])); if (d[tc] !== (F.tapVar === "diff" ? Math.max(...d) : Math.min(...d))) bad.push("tap not max/min diff"); }
  if (F.ns === 2 && F.tapVar === "max" && F.vals[F.tapS][tc] !== Math.max(...F.vals[F.tapS])) bad.push("tap not max (two)");
  if (S[3] !== 0.125) bad.push("stack must end at 0.125 mm");
  // the keyed shore claim is true by the numbers: "most of the mass is in particles larger / smaller than S[2]"
  { const sq0 = qs.find((q) => q.kind === "choice" && /shore|oxygen/.test(q.q)), key = sq0.options[sq0.a], m = /particles (larger|smaller) than ([\d.]+) mm/.exec(key);
    if (/most of (its|the) mass/.test(key)) { if (!m || +m[2] !== S[2]) bad.push("shore key wording");
      else { const s = F.ns === 2 ? smp["AB".indexOf(key[7])] : smp[0], big = (s.mt[0] + s.mt[1] + s.mt[2]) / s.T * 100; if (!(m[1] === "larger" ? big > 55 : 100 - big > 55)) bad.push("shore key claim untrue"); } } }
  if (F.mode === "pct" && (F.blank === tc)) bad.push("blank is the largest");
  const pq = qs.find((q) => q.kind === "plot"); if (!pq.plot.check(pq.plot.answer) || pq.plot.check(pq.plot.start)) bad.push("plot");
  for (const q of qs) {
    if (q.kind === "choice") { const L = q.options.map((o) => o.length); if (L[q.a] > Math.max(...L.filter((_, i) => i !== q.a))) bad.push("key longest: " + q.q.slice(0, 40)); }
    if (/wentworth|\bphi\b|\bsilt|\bclay|gravel/i.test(q.q + q.why + (q.options || []).join(" "))) bad.push("forbidden term");
    if (/\b(always|never|only|all of the time)\b/i.test((q.options || []).join(" "))) bad.push("absolute word in options");
  }
  const sq = qs.find((q) => q.kind === "choice" && /shore|oxygen/.test(q.q));
  const co = smp.findIndex((s) => s.coarse), fi = smp.findIndex((s) => !s.coarse);
  if (F.ns === 2) { const want = F.shoreVar === "mud" ? "AB"[fi] : "AB"[co]; if (!sq.options[0].startsWith(`Sample ${want}`)) bad.push("shore key"); }
  else if (!sq.options[0].startsWith(smp[0].coarse ? "The sandy" : "The muddy")) bad.push("shore key single");
  const ck = qs.find((q) => /starting mass of/.test(q.q)); if (ck && (smp[F.chk].loss > 0) !== /lost as fine dust/.test(ck.options[0])) bad.push("check key");
  return bad;
}

export default {
  key: KEY, group: "Tables and fieldwork", name: "Sieving results", topics: "Unit 5 (5.2, 5.5)", html: true, noZoom: true, thumbSeed: 5,
  blurb: "Masses of sediment caught on a stack of sieves, as a table and a bar chart. Work out percentages, check the masses, plot a bar and tell sandy from muddy sediment.",
  tips: ["Particles caught on a sieve are <b>larger</b> than its mesh: they could not pass through it.", "Percentage in a class = mass in that class ÷ total mass × 100. Round as the question asks.",
    "Add up the masses and compare with the starting mass: a small loss is usually fine dust or grains stuck in the mesh.", "Mostly larger particles → sand from an exposed shore; mostly very small particles → mud from a sheltered shore.",
    "To compare two samples, use the same starting mass and the same set of sieves, and compare the same size class in each."],
  ctx: (F) => `sieving sediment to find its particle sizes (5.2/LO4)${F.ns === 2 ? ", two shores" : ""}`,
  make, svg, axes, questions, selfTest,
  css: `.fig-${KEY} .sv-cap{margin:0 0 8px;font-size:13.5px;line-height:1.45;color:var(--soft)}.fig-${KEY} .ftable{font-size:13px;margin-bottom:10px}.fig-${KEY} .ftable th,.fig-${KEY} .ftable td{padding:6px 5px}
.fig-${KEY} .ftable td.hl{background:color-mix(in srgb,var(--app) 28%,transparent)}.fig-${KEY} .svtot th,.fig-${KEY} .svtot td{font-weight:700}.fig-${KEY} .svpan{font-weight:400;font-size:12.5px}
.fig-${KEY}-c .svs0{fill:url(#sieve-h0);stroke:currentColor;stroke-width:1}.fig-${KEY}-c .svs1{fill:color-mix(in srgb,var(--ink) 20%,transparent);stroke:currentColor;stroke-width:1}.fig-${KEY}-c .svpbg{fill:var(--surface2)}
.fig-${KEY}-c .hl{fill:color-mix(in srgb,var(--app) 75%,transparent)}.fig-${KEY}-c .plotted{fill:color-mix(in srgb,var(--accent) 45%,transparent);stroke:var(--accent);stroke-width:2.5}.fig-${KEY}-c .svcat{font-size:17px}.fig-${KEY}-c .svtick{font-size:18px}.fig-${KEY}-c .svax{font-size:17.5px}.fig-${KEY}-c .svhit{fill:transparent}`,
};
