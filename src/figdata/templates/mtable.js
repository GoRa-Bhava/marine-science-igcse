/* ---------- RESULTS TABLE (0697 practical activities) ----------
   Levels of an independent variable × 4 repeats, one clear anomaly, a blank mean. Contexts are the 0697 PAs:
   2.2/LO6 solubility of a solute · 2.3/LO4 gas solubility · 2.4/LO3 salinity and density · 2.2/LO4 CO₂ and pH ·
   4.3/LO6 light and photosynthesis · 2.5/LO3 Secchi disc · 5.2/LO5 moisture content of sediment.
   Skills: spot the anomaly, mean leaving it out (stated rounding), range, IV / DV / control variables, why repeat,
   which conclusion best describes the means, evidence that supports a claim. Data are generated, never real. */
import { rng, pickR, shuffleR, pickMixed } from "../core.js";

const KEY = "mtable";
const CTX = [
  { id: "solute", title: "A student investigated how temperature affects the mass of a salt that dissolves in 100 cm³ of water. The solution was stirred until no more salt would dissolve.",
    cap: "a solubility investigation", ref: "2.2/LO6", iv: "temperature of the water", ivHead: "temperature / °C", ivU: "°C", levels: [20, 30, 40, 50, 60],
    dv: "mass of salt dissolved", dvHead: "mass of salt dissolved / g", dvU: "g", dp: 1, base: [30, 34], delta: [10, 16], dir: 1, trends: ["mono"], noise: 0.5, rep: "trial",
    cvs: ["volume of water used", "type of salt", "amount of stirring", "size of the salt crystals", "type of container"] },
  { id: "gas", title: "A student used a dissolved oxygen meter to measure the oxygen concentration in samples of sea water kept at different temperatures.",
    cap: "a dissolved oxygen investigation", ref: "2.3/LO4", iv: "temperature of the sea water", ivHead: "temperature / °C", ivU: "°C", levels: [5, 10, 15, 20, 25],
    dv: "dissolved oxygen concentration", dvHead: "dissolved oxygen / mg per dm³", dvU: "mg per dm³", dp: 1, base: [12.2, 13.0], delta: [-5.0, -3.8], dir: -1, trends: ["mono"], noise: 0.2, rep: "sample",
    cvs: ["salinity of the sea water", "volume of each sample", "time each sample was left to settle", "depth the meter probe was placed at", "how long the sample was exposed to the air"] },
  { id: "density", title: "A student made salt solutions of different salinities and measured the density of each one.",
    cap: "a salinity and density investigation", ref: "2.4/LO3", iv: "salinity of the water", ivHead: "salinity / ppt", ivU: "ppt", levels: [0, 10, 20, 30, 40],
    dv: "density", dvHead: "density / g per cm³", dvU: "g per cm³", dp: 3, base: [0.998, 1.000], delta: [0.028, 0.032], dir: 1, trends: ["mono"], noise: 0.001, rep: "trial",
    cvs: ["temperature of the water", "volume of solution measured", "type of salt used", "balance used to measure the mass", "measuring cylinder used"] },
  { id: "ph", title: "A student bubbled carbon dioxide through a beaker of sea water and measured the pH every 2 minutes with a pH meter.",
    cap: "a carbon dioxide and pH investigation", ref: "2.2/LO4", iv: "time carbon dioxide was bubbled through", ivHead: "time / minutes", ivU: "minutes", levels: [0, 2, 4, 6, 8],
    dv: "pH of the sea water", dvHead: "pH", dvU: "", dp: 1, base: [8.1, 8.3], delta: [-2.0, -1.5], dir: -1, trends: ["mono", "plateau"], noise: 0.1, rep: "beaker",
    cvs: ["volume of sea water", "rate the gas was bubbled through", "starting temperature of the sea water", "type of sea water sample", "size of the beaker"] },
  { id: "photo", title: "A student placed a lamp at different distances from a piece of pondweed in water and counted the bubbles of gas released in one minute.",
    cap: "a light and photosynthesis investigation", ref: "4.3/LO6", iv: "distance of the lamp from the plant", ivHead: "distance from lamp / cm", ivU: "cm", levels: [10, 20, 30, 40, 50],
    dv: "rate of bubbling", dvHead: "number of bubbles per minute", dvU: "", dp: 0, base: [44, 58], delta: [-40, -30], dir: -1, trends: ["mono", "plateau"], noise: 1.5, rep: "count",
    cvs: ["temperature of the water", "piece of pondweed used", "length of time bubbles were counted", "volume of water in the tube", "amount of carbon dioxide in the water"] },
  { id: "secchi", title: "Students used a Secchi disc to measure how far light penetrates the water at sites at different distances from a river mouth. They took four readings at each site.",
    cap: "a Secchi disc survey", ref: "2.5/LO3", iv: "distance from the river mouth", ivHead: "distance from river mouth / km", ivU: "km", levels: [0, 2, 4, 6, 8],
    dv: "Secchi depth", dvHead: "Secchi depth / m", dvU: "m", dp: 1, base: [1.2, 1.8], delta: [3.5, 5.0], dir: 1, trends: ["mono", "plateau"], noise: 0.2, rep: "reading",
    cvs: ["time of day the readings were taken", "person taking the readings", "side of the boat the disc was lowered from", "Secchi disc used", "weather conditions"] },
  { id: "moisture", title: "Students measured the moisture content of sand samples taken at different distances up a beach from the low-tide mark. They tested four samples at each distance.",
    cap: "a sediment moisture survey", ref: "5.2/LO5", iv: "distance up the beach", ivHead: "distance from low-tide mark / m", ivU: "m", levels: [0, 10, 20, 30, 40],
    dv: "moisture content", dvHead: "moisture content / %", dvU: "%", dp: 0, base: [22, 28], delta: [-18, -14], dir: -1, trends: ["mono", "plateau"], noise: 0.8, rep: "sample",
    cvs: ["mass of each sand sample", "oven temperature used for drying", "drying time", "depth each sample was taken from", "time after low tide the samples were taken"] },
];
const R = 4;
const meanOf = (a) => a.reduce((s, x) => s + x, 0) / a.length;
const rnd = (v, dp) => Math.round(v * 10 ** dp) / 10 ** dp;
const fx = (v, dp) => v.toFixed(dp);
const lv = (C, v) => `${v}${C.ivU ? " " + C.ivU : ""}`;
const ut = (C) => (C.dvU ? (C.dvU === "%" ? "%" : " " + C.dvU) : "");
const cap = (s) => s[0].toUpperCase() + s.slice(1);
// a value is unsafe to round when it sits on a rounding half-way point (students' calculators and JS could disagree)
const nearHalf = (v, dp) => { const f = Math.abs(v * 10 ** dp) % 1; return Math.abs(f - 0.5) < 0.03; };

function make(seed) {
  const C = CTX[Math.floor(rng(seed)() * CTX.length)];
  for (let tries = 0; tries < 600; tries++) {
    const r = rng(seed + tries * 7907 + 3), n = C.levels.length, unit = 10 ** -C.dp;
    const trend = pickR(r, C.trends);
    const base = C.base[0] + r() * (C.base[1] - C.base[0]), delta = C.delta[0] + r() * (C.delta[1] - C.delta[0]);
    const pk = pickR(r, [2, 3]);                                       // plateau starts at this level
    const m = C.levels.map((_, k) => trend === "mono" ? base + delta * Math.pow(k / (n - 1), 0.85 + r() * 0.3) : base + delta * Math.min(1, k / pk));
    const rows = C.levels.map((v, k) => ({ label: String(v), short: lv(C, v), mean: m[k], k }));
    let fail = false;
    rows.forEach((row) => { row.vals = []; for (let j = 0; j < R; j++) { const v = rnd(row.mean + (r() - 0.5) * 2 * C.noise, C.dp); if (v <= 0 || (C.id === "ph" && v > 8.4)) fail = true; row.vals.push(v); } });
    if (fail) continue;
    // anomaly: one repeat in one row, clearly outside its row (never in the first row, so a starting value is never the anomaly)
    const ar = 1 + Math.floor(r() * (n - 1)), aj = Math.floor(r() * R), row = rows[ar];
    const others = row.vals.filter((_, j) => j !== aj), om = meanOf(others), spread = Math.max(...others) - Math.min(...others);
    const step = Math.abs(delta) / (n - 1), up = r() < 0.5;
    let av = rnd(om + (up ? 1 : -1) * Math.max(step * (0.8 + r() * 0.4), 4 * C.noise), C.dp);
    const gap = up ? av - Math.max(...others) : Math.min(...others) - av;
    if (av <= 0 || gap < Math.max(3 * spread, 3 * C.noise, 2 * unit)) continue;
    if (C.id === "ph" && (av > 8.4 || av < 4)) continue;
    row.vals[aj] = av; row.anom = aj;
    rows.forEach((x) => { const v = x.anom == null ? x.vals : x.vals.filter((_, j) => j !== x.anom); x.tm = meanOf(v); x.dmean = rnd(x.tm, C.dp); });
    if (rows.some((x) => nearHalf(x.tm, C.dp))) continue;
    // the trend must be clear in the means
    const d = rows.slice(1).map((x, i) => (x.tm - rows[i].tm) * C.dir), tot = Math.abs(rows[n - 1].tm - rows[0].tm);
    const big = Math.max(0.12 * tot, 3 * unit), flat = Math.max(0.05 * tot, unit);
    let okT = true;
    if (trend === "mono") okT = d.every((x) => x > big);
    if (trend === "plateau") okT = d.every((x, i) => (i < pk ? x > 1.5 * big : Math.abs(x) <= flat)) && pk < n - 1;
    if (!okT) continue;
    // a range question needs a non-anomalous row with a range of at least 2 units
    const rangeRows = rows.map((x, i) => i).filter((i) => i !== ar && Math.max(...rows[i].vals) - Math.min(...rows[i].vals) >= 2 * unit - 1e-9);
    if (!rangeRows.length) continue;
    const F = { kind: KEY, seed, C, rows, ar, aj, trend, pk, rangeRow: pickR(r, rangeRows) };
    const ev = evidence(F); if (!ev.some((x) => x[1]) || !ev.some((x) => !x[1])) continue;
    return F;
  }
  return make(seed + 1);
}

function svg(F, opt) {
  opt = opt || {};
  const { C, rows } = F, hl = opt.hl || {};
  let h = `<div class="fig-${KEY}"><p class="mt-cap">${C.title}</p><table class="ftable"><thead><tr><th rowspan="2">${C.ivHead}</th><th colspan="${R}">${C.dvHead}<span class="mt-rep">${C.rep} number</span></th><th rowspan="2">mean${C.dvU ? " / " + C.dvU : C.dvHead === "pH" ? " pH" : ""}</th></tr><tr>${Array.from({ length: R }, (_, j) => `<th>${j + 1}</th>`).join("")}</tr></thead><tbody>`;
  rows.forEach((row, i) => {
    const rowHl = hl.rows && hl.rows.includes(i);
    h += `<tr><th scope="row">${row.label}</th>`;
    row.vals.forEach((v, j) => {
      const cl = [rowHl && !(hl.skipAnom && j === row.anom) ? "hl" : "", hl.skipAnom && rowHl && j === row.anom ? "out" : ""].filter(Boolean).join(" ");
      h += `<td data-tap="r${i}c${j}"${cl ? ` class="${cl}"` : ""}>${fx(v, C.dp)}</td>`;
    });
    h += i === F.ar ? `<td class="blank${rowHl ? " hl" : ""}">${opt.showMean ? fx(row.dmean, C.dp) : ""}</td>` : `<td class="mean${rowHl ? " hl" : ""}">${fx(row.dmean, C.dp)}</td>`;
    h += `</tr>`;
  });
  return h + `</tbody></table></div>`;
}

const trendTxt = (F, t) => {
  const C = F.C, at = F.rows[F.pk].short, up = (s) => (s > 0 ? "increases" : "decreases");
  if (t === "mono") return `The ${C.dv} ${up(C.dir)} every time the ${C.iv} increases.`;
  if (t === "opp") return `The ${C.dv} ${up(-C.dir)} every time the ${C.iv} increases.`;
  if (t === "plateau") return `The ${C.dv} ${up(C.dir)} as the ${C.iv} increases up to ${at}, then stays about the same.`;
  if (t === "peak") return `The ${C.dv} ${up(C.dir)} up to ${at}, then ${up(-C.dir)} as the ${C.iv} increases.`;
  return `The ${C.iv} has no clear effect on the ${C.dv}.`;
};

function evidence(F) {
  const { C, rows, ar } = F, st = [], unit = 10 ** -C.dp, tolD = Math.max(3 * unit, 2 * C.noise), flat = Math.max(unit, C.noise);
  const word = C.dir > 0 ? "higher" : "lower";
  for (let i = 0; i < rows.length; i++) for (let j = i + 1; j < rows.length; j++) {
    const A = rows[i], B = rows[j], dd = (B.dmean - A.dmean) * C.dir;
    if (Math.abs(dd) >= tolD) st.push([`The mean at ${B.short} is ${dd * C.dir > 0 ? "higher" : "lower"} than the mean at ${A.short}.`, dd > 0, `${A.short}: ${fx(A.dmean, C.dp)}, ${B.short}: ${fx(B.dmean, C.dp)} — ${dd > 0 ? `${word} at the larger ${C.iv}, so it supports the conclusion` : "the opposite direction, so it does not support it"}.`]);
    else if (Math.abs(B.dmean - A.dmean) <= flat && j === i + 1) st.push([`The mean at ${B.short} is about the same as the mean at ${A.short}.`, false, `${A.short}: ${fx(A.dmean, C.dp)}, ${B.short}: ${fx(B.dmean, C.dp)} — no change, so it does not support the conclusion.`]);
  }
  // overlapping repeats in neighbouring rows (counter-evidence)
  for (let i = 0; i + 1 < rows.length; i++) {
    const A = rows[i], B = rows[i + 1]; if (i + 1 === ar || i === ar) continue;
    const ja = C.dir > 0 ? A.vals.indexOf(Math.max(...A.vals)) : A.vals.indexOf(Math.min(...A.vals)), jb = C.dir > 0 ? B.vals.indexOf(Math.min(...B.vals)) : B.vals.indexOf(Math.max(...B.vals));
    if ((A.vals[ja] - B.vals[jb]) * C.dir >= tolD) st.push([`${cap(C.rep)} ${ja + 1} at ${A.short} gave a ${C.dir > 0 ? "higher" : "lower"} result than ${C.rep} ${jb + 1} at ${B.short}.`, false, `${fx(A.vals[ja], C.dp)} against ${fx(B.vals[jb], C.dp)}, even though ${A.short} is the smaller ${C.iv}, so this does not support the conclusion.`]);
  }
  return st;
}

function questions(F, r) {
  const { C, rows, ar, aj } = F, qs = [], arow = rows[ar], u = ut(C);
  const cellLabel = (id) => { const m = /^r(\d+)c(\d+)$/.exec(id); return `${C.rep} ${+m[2] + 1} at ${rows[+m[1]].short}`; };
  // 1. tap the anomaly
  const others = arow.vals.filter((_, j) => j !== aj);
  qs.push({ kind: "tap", q: "One result in the table is anomalous. Tap it.", a: [`r${ar}c${aj}`], ansTxt: `${C.rep} ${aj + 1} at ${arow.short} (${fx(arow.vals[aj], C.dp)})`, labelOf: cellLabel, hint: "Tap a result in the table.", hl: { rows: [ar] },
    why: `An anomalous result does not fit the pattern of the other repeats. At ${arow.short} the other results are ${others.map((v) => fx(v, C.dp)).join(", ")}, but ${C.rep} ${aj + 1} is <b>${fx(arow.vals[aj], C.dp)}</b>, much ${arow.vals[aj] < Math.min(...others) ? "lower" : "higher"}. Anomalous results are left out when the mean is calculated.` });
  // 2. mean leaving out the anomaly
  const ans = arow.dmean, rule = C.dp === 0 ? "to the nearest whole number" : `to ${C.dp} decimal place${C.dp > 1 ? "s" : ""}`;
  qs.push({ kind: "num", q: `The mean for ${arow.short} has been left blank. Calculate it, leaving out the anomalous result. Give your answer ${rule}.`, ans, tol: 0, dp: C.dp, unit: C.dvU || (C.dvHead === "pH" ? "" : ""), check: (v) => Math.abs(v - ans) < 1e-9,
    hl: { rows: [ar], skipAnom: true }, doneOpt: () => ({ hl: { rows: [ar], skipAnom: true }, showMean: true }),
    why: `Leave out ${fx(arow.vals[aj], C.dp)}. (${others.map((v) => fx(v, C.dp)).join(" + ")}) ÷ 3 = ${fx(others.reduce((s, x) => s + x, 0), C.dp)} ÷ 3 = ${arow.tm.toFixed(C.dp + 2)}, which is <b>${fx(ans, C.dp)}${u}</b> ${rule}. Divide by the number of results you used (3), not 4.` });
  // 3. range of another row
  const rr = rows[F.rangeRow], rg = rnd(Math.max(...rr.vals) - Math.min(...rr.vals), C.dp);
  qs.push({ kind: "num", q: `What is the range of the results at ${rr.short}?`, ans: rg, tol: 0, dp: C.dp, unit: C.dvU, check: (v) => Math.abs(v - rg) < 1e-9, hl: { rows: [F.rangeRow] },
    why: `Range = highest − lowest = ${fx(Math.max(...rr.vals), C.dp)} − ${fx(Math.min(...rr.vals), C.dp)} = <b>${fx(rg, C.dp)}${u}</b>.` });
  // 4. variables
  const cv = shuffleR(r, C.cvs);
  if (r() < 0.5) {
    const askIV = r() < 0.5, opts = askIV ? [C.iv, C.dv, cv[0], cv[1]] : [C.dv, C.iv, cv[0], cv[1]];
    qs.push({ kind: "choice", q: askIV ? "What is the independent variable in this investigation?" : "What is the dependent variable in this investigation?", options: opts.map(cap), a: 0,
      why: `The independent variable is the one that is changed on purpose: the <b>${C.iv}</b>. The dependent variable is the one that is measured: the <b>${C.dv}</b>. ${cap(cv[0])} and ${cv[1]} are control variables, kept the same.` });
  } else {
    const st = [[cv[0], true], [cv[1], true], [cv[2], true], [C.iv, false], [C.dv, false]].map((x) => [cap(x[0]), x[1], x[1] ? "a control variable — keep it the same" : x[0] === C.iv ? "the independent variable — it is changed on purpose" : "the dependent variable — it is measured"]);
    const pick = shuffleR(r, st);
    qs.push({ kind: "multi", q: "Tick every <b>control variable</b> (a variable that should be kept the same).", options: pick.map((s) => s[0]), a: pick.map((s, i) => (s[1] ? i : -1)).filter((i) => i >= 0),
      why: pick.map((s) => `${s[1] ? "✓" : "✗"} ${s[0]} — ${s[2]}`).join("<br>") });
  }
  // 5. why repeat
  qs.push({ kind: "choice", q: `Why did the ${C.id === "secchi" || C.id === "moisture" ? "students" : "student"} take four repeats at each ${C.iv.split(" ")[0] === "time" ? "time" : "level"}?`, a: 0,
    options: ["So anomalies can be spotted and a mean calculated", "So the investigation becomes a fair test", "So the measuring instrument is more precise", "So the range of the independent variable is wider"],
    why: "Repeating lets you spot an anomalous result and calculate a mean, which makes the results more <b>reliable</b>. A fair test comes from keeping the control variables the same; repeats do not change the precision of the instrument or the range of values tested." });
  // 6. which conclusion
  const tset = ["mono", "opp", "plateau", "peak", "none"], copts = [F.trend, ...shuffleR(r, tset.filter((t) => t !== F.trend)).slice(0, 3)];
  const meansTxt = rows.map((x) => `${x.short}: ${fx(x.dmean, C.dp)}`).join("; ");
  qs.push({ kind: "choice", q: "Which conclusion best describes the pattern in the means?", options: copts.map((t) => trendTxt(F, t)), a: 0, hl: { rows: rows.map((_, i) => i) },
    why: `Use the means in order of ${C.iv}${" (with the anomalous result left out)"}: ${meansTxt}. ${F.trend === "mono" ? `Every step gives a ${C.dir > 0 ? "higher" : "lower"} mean.` : `The means ${C.dir > 0 ? "rise" : "fall"} until ${rows[F.pk].short}, then change very little.`}` });
  // 7. evidence that supports a claim
  const claim = `As the ${C.iv} increases, the ${C.dv} ${C.dir > 0 ? "increases" : "decreases"}.`, st = evidence(F);
  const pick = pickMixed(r, st, 4);
  if (pick) qs.push({ kind: "multi", q: `A student concluded: “${claim}” Tick every piece of evidence from the table that <b>supports</b> this conclusion.`, options: pick.map((s) => s[0]), a: pick.map((s, i) => (s[1] ? i : -1)).filter((i) => i >= 0),
    why: pick.map((s) => `${s[1] ? "✓" : "✗"} ${s[0]} ${s[2]}`).join("<br>") });
  return qs;
}

function selfTest(F, qs) {
  const bad = [], { rows, ar, aj, C } = F;
  const others = rows[ar].vals.filter((_, j) => j !== aj);
  if (rows[ar].vals[aj] >= Math.min(...others) && rows[ar].vals[aj] <= Math.max(...others)) bad.push("anomaly inside its row");
  rows.forEach((x, i) => { if (i === ar) return; const sp = Math.max(...x.vals) - Math.min(...x.vals); if (sp > 6 * C.noise + 2 * 10 ** -C.dp) bad.push("another row looks anomalous " + i); });
  const gap = Math.min(...others.map((v) => Math.abs(v - rows[ar].vals[aj])));
  if (gap < 2 * 10 ** -C.dp) bad.push("anomaly too close");
  const tq = qs.find((q) => q.q.startsWith("Which conclusion best")); if (!tq || new Set(tq.options).size !== tq.options.length) bad.push("conclusion options");
  if (!qs.some((q) => q.kind === "multi" && q.q.includes("supports"))) bad.push("no evidence multi");
  return bad;
}

export default {
  key: KEY, group: "Tables and fieldwork", name: "Results table", topics: "Units 2, 4 and 5 practical activities", html: true, noZoom: true, thumbSeed: 3,
  ctx: (F) => `results of ${F.C.cap} (${F.C.ref})`,
  blurb: "Results from the practical activities, with four repeats and one anomaly. Find the anomaly, process the data and judge a conclusion.",
  tips: ["An <b>anomalous</b> result does not fit the pattern of the other repeats. Leave it out of the mean.", "Mean = total ÷ number of results used. Round as the question asks.", "Range = highest − lowest.", "The <b>independent</b> variable is changed; the <b>dependent</b> variable is measured; <b>control</b> variables are kept the same.", "Repeats let you spot anomalies and calculate a mean, so the results are more reliable."],
  make, svg, questions, selfTest,
  css: `.fig-${KEY} .mt-cap{margin:0 0 8px;font-size:13.5px;line-height:1.45;color:var(--soft)}.fig-${KEY} .ftable td[data-tap]{cursor:pointer}.fig-${KEY} .ftable td.hl,.fig-${KEY} .ftable th.hl{background:color-mix(in srgb,var(--app) 28%,transparent)}.fig-${KEY} .ftable td.out{text-decoration:line-through;opacity:.6}.fig-${KEY} .ftable td.mean{font-weight:700}.fig-${KEY} .ftable{font-size:13px}.fig-${KEY} .ftable th,.fig-${KEY} .ftable td{padding:6px 4px}.fig-${KEY} .mt-rep{display:block;font-weight:400;font-size:12px;color:var(--soft)}.fig-${KEY} thead tr:first-child th:first-child{min-width:74px}`,
};
