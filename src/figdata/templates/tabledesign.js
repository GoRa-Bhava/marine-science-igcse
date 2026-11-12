/* ---------- DESIGN AND COMPLETE A RESULTS TABLE (0697 practical skills, AO3) ----------
   Raw readings are shown as a notebook card. The student chooses headings, spots a mistake in another student's table,
   puts the readings into IV order, names the independent variable, records to the right precision and calculates a
   derived value. Rules are taken from the 0697 2027–2029 syllabus "Presentation of data": each column headed with the
   quantity and the unit (e.g. time / s); no units in the body; record to the precision of the instrument; independent
   variable first (it goes on the x-axis); readings in order of the IV. Examiner rubric (w24 P2): ruled table, headings
   with units in the headers only, numbers in the body, readings in time order. All data is generated. */
import { rng, pickR, shuffleR, fmt, pickMixed } from "../core.js";

const KEY = "tabledesign";
const CTX = [
  { id: "cool", title: "A student measured the temperature of a sample of warm sea water as it cooled.",
    iv: { q: "time", u: "min", vals: [0, 2, 4, 6, 8, 10, 12] }, dv: { q: "temperature", u: "°C", dp: 1, inst: "The thermometer can be read to the nearest 0.5 °C." },
    note: (x, y) => `${x} min: ${y} °C`, cv: "the volume of sea water", other: "the temperature of the room",
    gen: (r, xs) => { const T0 = 50 + Math.floor(r() * 30) / 2, Ta = 19 + Math.floor(r() * 5), k = 0.09 + r() * 0.05; return xs.map((t) => Math.round((Ta + (T0 - Ta) * Math.exp(-k * t)) * 2) / 2); },
    derived: { q: (a, b) => `Calculate the fall in temperature between ${a} min and ${b} min.`, unit: "°C", f: (ya, yb) => ya - yb, why: "fall = first reading − later reading" } },
  { id: "dry", title: "A student heated a sample of wet beach sediment and weighed it at regular intervals.",
    iv: { q: "time heated", u: "min", vals: [0, 5, 10, 15, 20, 25, 30] }, dv: { q: "mass of sediment", u: "g", dp: 2, inst: "The balance shows the mass to the nearest 0.01 g." },
    note: (x, y) => `after ${x} min: ${y} g`, cv: "the temperature of the oven", other: "the size of the sediment grains",
    gen: (r, xs) => { const dry = 30 + Math.floor(r() * 2000) / 100, w = 6 + Math.floor(r() * 600) / 100, k = 0.14 + r() * 0.06; return xs.map((t) => Math.round((dry + w * Math.exp(-k * t)) * 100) / 100); },
    derived: { q: (a, b) => `Calculate the mass of water lost between ${a} min and ${b} min.`, unit: "g", f: (ya, yb) => ya - yb, why: "mass lost = first mass − later mass" } },
  { id: "oxy", title: "A student measured the dissolved oxygen in samples of sea water kept at different temperatures.",
    iv: { q: "temperature of water", u: "°C", vals: [5, 10, 15, 20, 25, 30] }, dv: { q: "dissolved oxygen", u: "mg per dm³", dp: 1, inst: "The oxygen meter displays readings to 0.1 mg per dm³." },
    note: (x, y) => `${x} °C sample: ${y} mg per dm³`, cv: "the salinity of the water", other: "the depth the sample came from",
    gen: (r, xs) => { const a = 11.8 + r() * 1.2; return xs.map((T) => Math.round((a - 0.24 * T + 0.002 * T * T + (r() - 0.5) * 0.2) * 10) / 10); },
    derived: { q: (a, b) => `Calculate the decrease in dissolved oxygen between ${a} °C and ${b} °C.`, unit: "mg per dm³", f: (ya, yb) => ya - yb, why: "decrease = reading at the lower temperature − reading at the higher temperature" } },
  { id: "limpet", title: "A student counted the limpets in a quadrat at regular distances up a rocky shore.",
    iv: { q: "distance from low-water mark", u: "m", vals: [0, 2, 4, 6, 8, 10] }, dv: { q: "number of limpets", u: null, dp: 0, inst: "Each limpet in the quadrat is counted." },
    note: (x, y) => `${x} m: ${y} limpets`, cv: "the size of the quadrat", other: "the time taken to count",
    gen: (r, xs) => { const pk = 4 + Math.floor(r() * 3), top = 14 + Math.floor(r() * 16); return xs.map((d) => Math.max(0, Math.round(top * Math.exp(-((d - pk) * (d - pk)) / (10 + r() * 6)) + (r() - 0.5) * 3))); },
    derived: { q: (a, b) => `How many more limpets were counted at ${a} m than at ${b} m?`, unit: "limpets", f: (ya, yb) => ya - yb, why: "difference = larger count − smaller count", bigFirst: true } },
  { id: "secchi", title: "A student used a Secchi disc to measure water clarity at different distances from a river mouth.",
    iv: { q: "distance from river mouth", u: "km", vals: [0, 1, 2, 3, 4, 5] }, dv: { q: "Secchi depth", u: "cm", dp: 0, inst: "The rope is marked every 1 cm." },
    note: (x, y) => `${x} km out: ${y} cm`, cv: "the time of day", other: "the weather on the day",
    gen: (r, xs) => { const d0 = 40 + Math.floor(r() * 40), g = 25 + Math.floor(r() * 30); return xs.map((x) => Math.round(d0 + g * x + (r() - 0.5) * 8)); },
    derived: { q: (a, b) => `Calculate the increase in Secchi depth between ${a} km and ${b} km.`, unit: "cm", f: (ya, yb) => yb - ya, why: "increase = later reading − first reading" } },
  { id: "dens", title: "A student made salt solutions of different salinity and weighed 100 cm³ of each.",
    iv: { q: "salinity", u: "g per dm³", vals: [0, 10, 20, 30, 40] }, dv: { q: "mass of 100 cm³", u: "g", dp: 2, inst: "The balance shows the mass to the nearest 0.01 g." },
    note: (x, y) => `${x} g per dm³: ${y} g`, cv: "the temperature of the solutions", other: "the volume of each solution",
    gen: (r, xs) => { const b = 99.7 + Math.floor(r() * 50) / 100; return xs.map((S) => Math.round((b + 0.077 * S + (r() - 0.5) * 0.06) * 100) / 100); },
    derived: { q: (a, b) => `Calculate the increase in mass between ${a} g per dm³ and ${b} g per dm³.`, unit: "g", f: (ya, yb) => yb - ya, why: "increase = later reading − first reading" } },
];
const ERR = ["unitcell", "nounit", "dp"];

function make(seed) {
  for (let tries = 0; ; tries++) {
    const r = rng(seed + tries * 4099);
    const C = pickR(r, CTX), xs = C.iv.vals.slice(), ys = C.gen(r, xs);
    if (ys.some((y) => y < 0 || isNaN(y))) continue;
    // monotonic data must stay strictly monotonic after rounding (except the drying curve, which may level off at the end)
    if (C.id === "cool" || C.id === "oxy") { if (ys.some((y, i) => i && y >= ys[i - 1])) continue; }
    if (C.id === "secchi" || C.id === "dens") { if (ys.some((y, i) => i && y <= ys[i - 1])) continue; }
    if (C.id === "dry") { if (ys.some((y, i) => i && y > ys[i - 1]) || ys[0] - ys[1] < 0.5) continue; }
    if (C.id === "limpet") { if (new Set(ys).size < ys.length - 1 || Math.max(...ys) < 8) continue; }
    const order = shuffleR(r, xs.map((_, i) => i));            // notebook order (as written down)
    if (order.every((k, i) => k === i)) continue;
    const err = pickR(r, ERR), errRow = 1 + Math.floor(r() * (xs.length - 2)), errCol = err === "nounit" ? (C.dv.u ? 1 : 0) : 1;
    return { kind: KEY, seed, C, xs, ys, order, err, errRow, errCol };
  }
}

const cell = (C, v, which) => (which === 0 ? fmt(v) : fmt(v, C.dv.dp));
const head = (Q) => (Q.u ? `${Q.q} / ${Q.u}` : Q.q);

function notebook(F) {
  const C = F.C;
  return `<div class="tdcard"><div class="tdct">Notebook</div><p class="tdcap">${C.title}</p><ul>${F.order.map((i) => `<li>${C.note(fmt(F.xs[i]), cell(C, F.ys[i], 1))}</li>`).join("")}</ul></div>`;
}
function tableHTML(F, opt, rows, mistake) {
  const C = F.C, hl = (opt && opt.hl) || {};
  const th = (j) => { const Q = j ? C.dv : C.iv, txt = mistake && mistake.err === "nounit" && mistake.errCol === j ? Q.q : head(Q);
    return `<th${hl.col === j ? ' class="tdhl"' : ""} data-tap="h${j}">${txt}</th>`; };
  let h = `<table class="ftable tdtable"><thead><tr>${th(0)}${th(1)}</tr></thead><tbody>`;
  rows.forEach((i, n) => {
    h += "<tr>";
    for (let j = 0; j < 2; j++) {
      let v = j ? cell(C, F.ys[i], 1) : cell(C, F.xs[i], 0);
      if (mistake && n === mistake.errRow && j === 1) { if (mistake.err === "unitcell") v = `${v} ${C.dv.u || "limpets"}`; if (mistake.err === "dp") v = C.dv.dp ? fmt(F.ys[i], C.dv.dp + 1) : fmt(F.ys[i], 1); }
      h += `<td data-tap="r${n}c${j}"${hl.rows && hl.rows.includes(n) && j === 0 ? ' class="tdhl"' : ""}>${v}</td>`;
    }
    h += "</tr>";
  });
  return h + "</tbody></table>";
}
function svg(F, opt) {
  opt = opt || {};
  const all = F.xs.map((_, i) => i);
  let body;
  if (opt.mode === "student") body = `<p class="tdcap">Another student's table of the same readings:</p>${tableHTML(F, opt, all, F)}`;
  else if (opt.mode === "correct") body = `${notebook(F)}<p class="tdcap">A correctly set out table:</p>${tableHTML(F, opt, all, null).replace(/ data-tap="[^"]+"/g, "")}`;
  else body = notebook(F);
  return `<div class="fig-${KEY}">${body}</div>`;
}

function questions(F, r) {
  const qs = [], C = F.C, n = F.xs.length;
  // 1. heading for a column with a unit
  const col = C.dv.u && r() < 0.6 ? 1 : 0, Q = col ? C.dv : C.iv;
  qs.push({ kind: "choice", q: `Which is the correct heading for the <b>${Q.q}</b> column of the results table?`, options: [`${Q.q} / ${Q.u}`, Q.q, Q.u, `${Q.u} / ${Q.q}`], a: 0,
    doneOpt: () => ({ mode: "correct", hl: { col } }),
    why: `A heading gives the quantity, then a solidus, then the unit: <b>${Q.q} / ${Q.u}</b>. The unit goes in the heading only, so the numbers below it can be written on their own.` });
  // 2. tap the mistake in another student's table
  const tapId = F.err === "nounit" ? `h${F.errCol}` : `r${F.errRow}c1`;
  const EW = { unitcell: `the unit is written inside a cell (“${cell(C, F.ys[F.errRow], 1)} ${C.dv.u || "limpets"}”). Units belong in the heading only.`,
    nounit: `the heading “${(F.errCol ? C.dv : C.iv).q}” has no unit. It should read “${head(F.errCol ? C.dv : C.iv)}”.`,
    dp: `one reading is recorded to a different number of decimal places from the rest. ${C.dv.inst} Every reading should be written ${C.dv.dp ? `to ${C.dv.dp} decimal place${C.dv.dp > 1 ? "s" : ""}` : "as a whole number"}.` };
  qs.push({ kind: "tap", q: "Another student put the same readings into this table. There is <b>one</b> mistake. Tap it.", a: [tapId],
    ansTxt: F.err === "nounit" ? "the heading without a unit" : `the reading in row ${F.errRow + 1}`, labelOf: (id) => (id[0] === "h" ? "a heading" : `row ${+id.slice(1, id.indexOf("c")) + 1}, ${id.endsWith("c0") ? "first" : "second"} column`),
    askOpt: { mode: "student" }, doneOpt: () => ({ mode: "student" }), hint: "Tap the cell or heading that is wrong.",
    why: `The mistake: ${EW[F.err]}` });
  // 3. order: put five of the readings into the order they go in the table
  const five = shuffleR(r, F.xs.map((_, i) => i)).slice(0, 5).sort((a, b) => a - b);
  const chips = five.map((i) => `${fmt(F.xs[i])} ${C.iv.u}: ${cell(C, F.ys[i], 1)}${C.dv.u ? " " + C.dv.u : ""}`);
  qs.push({ kind: "order", q: `These five readings were written down in the wrong order. Put them in the order they should appear in the results table, top row first.`, options: chips, a: chips.map((_, k) => k),
    doneOpt: () => ({ mode: "correct", hl: { rows: five } }),
    why: `Rows go in order of the <b>independent variable</b> (${C.iv.q}), from smallest to largest: ${five.map((i) => fmt(F.xs[i])).join(", ")} ${C.iv.u}. Do not sort by the results.` });
  // 4. which is the independent variable
  qs.push({ kind: "choice", q: "Which is the <b>independent variable</b> in this investigation?", options: [C.iv.q, C.dv.q, C.cv, C.other], a: 0,
    why: `The independent variable is the one the student chose and changed: <b>${C.iv.q}</b>. It goes in the first column (and on the x-axis of a graph). ${cap(C.dv.q)} is the dependent variable, the one measured. ${cap(C.cv)} should be kept the same (a control variable).` });
  // 5. precision to record
  const y = F.ys[1 + Math.floor(r() * (n - 2))], P = ["as whole numbers", "to 1 decimal place", "to 2 decimal places", "to 3 decimal places"];
  const ex = (d) => fmt(Math.round(y * Math.pow(10, Math.min(d, C.dv.dp))) / Math.pow(10, Math.min(d, C.dv.dp)), d);
  qs.push({ kind: "choice", q: `${C.dv.inst} How should the ${C.dv.q} readings be recorded in the table?`, options: P.map((p, d) => `${p}, for example ${ex(d)}`), a: C.dv.dp,
    why: `Record to the precision of the instrument, and use the same number of decimal places all the way down the column: <b>${P[C.dv.dp]}</b>${C.dv.dp ? ` (e.g. ${ex(C.dv.dp)})` : ""}. More decimal places than the instrument can show would be made up; fewer would throw information away.` });
  // 6. derived value
  let ia = Math.floor(r() * (n - 2)), ib = ia + 1 + Math.floor(r() * (n - 1 - ia));
  if (C.derived.bigFirst && F.ys[ia] < F.ys[ib]) [ia, ib] = [ib, ia];
  const d = Math.round(C.derived.f(F.ys[ia], F.ys[ib]) * 100) / 100;
  if (d > 0) qs.push({ kind: "num", q: `Use the readings. ${C.derived.q(fmt(F.xs[ia]), fmt(F.xs[ib]))}`, ans: d, tol: 1e-6, unit: C.derived.unit, dp: C.dv.dp || undefined,
    why: `${cap(C.derived.why)}: ${C.derived.f(1, 0) === 1 ? `${cell(C, F.ys[ia], 1)} − ${cell(C, F.ys[ib], 1)}` : `${cell(C, F.ys[ib], 1)} − ${cell(C, F.ys[ia], 1)}`} = <b>${fmt(d, C.dv.dp)} ${C.derived.unit}</b>.` });
  // 7. tick the features of a correctly drawn results table
  const st = [
    ["Each column heading gives the quantity and its unit.", true, "e.g. “" + head(C.iv) + "”."],
    ["Units appear in the headings, not next to the numbers.", true, "No units in the body of the table."],
    ["The independent variable is in the first column.", true, "It is the variable the investigator chose."],
    ["Rows are in order of the independent variable.", true, "Smallest to largest value of " + C.iv.q + "."],
    ["Every reading in a column has the same number of decimal places.", true, "Recorded to the precision of the instrument."],
    ["The unit is written after every number in the table.", false, "Units go in the heading only."],
    ["Rows are sorted from the largest result to the smallest.", false, "Order the rows by the independent variable, not the results."],
    ["The dependent variable goes in the first column.", false, "The independent variable comes first."],
    ["Each reading keeps as many decimal places as the calculator shows.", false, "Use the precision of the instrument, the same for every reading."],
    ["A heading can be left blank when its unit is obvious.", false, "Every column needs a heading with its quantity (and unit)."],
  ];
  const pk = pickMixed(r, st, 5);
  if (pk) qs.push({ kind: "multi", q: "Tick every feature of a correctly drawn results table.", options: pk.map((x) => x[0]), a: pk.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0),
    why: pk.map((x) => `${x[1] ? "✓" : "✗"} ${x[0]}: ${x[2]}`).join("<br>") });
  return qs;
}
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function selfTest(F, qs) {
  const bad = [], C = F.C;
  const st = qs.find((q) => q.kind === "tap"), html = svg(F, { mode: "student" });
  // exactly one cell differs from the correct table (or one heading lacks its unit)
  const ok = tableHTML(F, {}, F.xs.map((_, i) => i), null), cellsOf = (h) => [...h.matchAll(/<t[hd][^>]*data-tap="([^"]+)"[^>]*>([^<]*)</g)].map((m) => [m[1], m[2]]);
  const a = cellsOf(ok), b = cellsOf(html.replace(/^.*?<table/, "<table")), diff = a.filter((x, i) => x[1] !== b[i][1]).map((x) => x[0]);
  if (diff.length !== 1 || diff[0] !== st.a[0]) bad.push("student table should differ in exactly the tapped cell: " + JSON.stringify(diff) + " vs " + st.a[0]);
  // every DV cell in the correct table has the same number of decimal places
  const dps = F.ys.map((y) => (cell(C, y, 1).split(".")[1] || "").length); if (new Set(dps).size !== 1 || dps[0] !== C.dv.dp) bad.push("dp mismatch");
  const pq = qs.find((q) => q.q.includes("recorded in the table")); if (new Set(pq.options).size !== 4) bad.push("precision options not unique");
  const nq = qs.find((q) => q.kind === "num"); if (nq && Math.abs(nq.ans - Math.round(nq.ans * 100) / 100) > 1e-9) bad.push("derived not 2dp");
  if (C.iv.vals.some((v, i) => i && v <= C.iv.vals[i - 1])) bad.push("iv not ascending");
  return bad;
}

export default {
  key: KEY, group: "Tables and fieldwork", name: "Results tables", topics: "Practical skills (AO3)", thumbSeed: 4, html: true, noZoom: true,
  blurb: "Turn raw readings into a correct results table: headings and units, order, precision and simple calculations.",
  tips: ["Head each column with the quantity and unit, e.g. time / min. No units next to the numbers.", "Put the independent variable (the one you changed) in the first column, in order from smallest to largest.", "Record every reading to the precision of the instrument, with the same number of decimal places down the column.", "Work out changes by subtracting readings, and give the unit."],
  ctx: (F) => "readings from a practical",
  make, svg, questions, selfTest,
  css: `.fig-tabledesign .tdcard{border:1px solid var(--mut);border-radius:8px;padding:10px 14px 6px;margin-bottom:10px;background:repeating-linear-gradient(180deg,transparent 0 25px,color-mix(in srgb,var(--line) 70%,transparent) 25px 26px);font-size:15px;color:var(--ink)}
.fig-tabledesign .tdct{font-weight:800;font-size:12px;letter-spacing:.6px;text-transform:uppercase;color:var(--soft)}.fig-tabledesign .tdcap{margin:4px 0 6px;color:var(--soft);font-size:14px}
.fig-tabledesign ul{margin:0;padding-left:18px;line-height:26px;font-family:"Segoe Print","Comic Sans MS",cursive,sans-serif}.fig-tabledesign .tdtable th,.fig-tabledesign .tdtable td{min-width:90px}
.fig-tabledesign .tdhl{background:color-mix(in srgb,var(--app) 35%,transparent)}`,
};
