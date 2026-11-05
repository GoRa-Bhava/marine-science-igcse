/* ---------- MATHS SKILLS FROM MARINE DATA (0697 Mathematical requirements: standard form, significant figures,
   area of a circle, volume of a cylinder, units) ----------
   A data card from a plankton and sediment survey (generated numbers). Questions: write a large number in standard
   form, turn standard form back into an ordinary number, convert a small length in standard form to µm, round to
   significant figures, the area of a circular diatom, the volume and density of a cylindrical sediment core. */
import { rng, pickR, shuffleR, fmt } from "../core.js";

const KEY = "mmaths";
const SUP = { "0": "⁰", "1": "¹", "2": "²", "3": "³", "4": "⁴", "5": "⁵", "6": "⁶", "7": "⁷", "8": "⁸", "9": "⁹", "−": "⁻" };
const sup = (n) => "10" + String(n < 0 ? "−" + Math.abs(n) : n).split("").map((c) => SUP[c]).join("");   // Unicode superscripts: read the same in the app, the preview and printed packs
const dec = (v) => v.toFixed(10).replace(/0+$/, "").replace(/\.$/, "");
const sf = (v, n) => { if (v === 0) return 0; const p = Math.floor(Math.log10(Math.abs(v))) - n + 1; return Math.round(v / 10 ** p) * 10 ** p; };
const near = (a, b) => Math.abs(a - b) < 1e-9 * Math.max(1, Math.abs(b));
const PI = [3.14, 3.142, Math.PI];

function make(seed) {
  const r = rng(seed);
  const big = { a: pickR(r, [2.4, 3.6, 4.8, 5.2, 6.5, 7.5, 8.4]), b: pickR(r, [9, 10, 11]) };          // kg of CO₂ (emissions)
  const cells = { a: pickR(r, [1.5, 2.5, 3.2, 4.6, 6.4]), b: pickR(r, [4, 5, 6]) };                     // cells per dm³
  const dia = { a: pickR(r, [2.4, 3.5, 4.5, 6.2, 8.0]), b: -5 };                                       // diatom diameter in m
  const dumm = Math.round(dia.a * 10);                                                                // in µm (×10^-5 m = ×10 µm)
  const rad = pickR(r, [2.5, 3, 3.5, 4]), len = pickR(r, [10, 12, 15, 20]), dens = 1.6 + Math.round(r() * 50) / 100;
  const vol = Math.PI * rad * rad * len, mass = Math.round(vol * dens);
  const raw = Math.round((1.02 + r() * 0.01) * 100000) / 100000;                                        // a density to round to 3 s.f.
  return { kind: KEY, seed, big, cells, dia, dumm, rad, len, mass, raw, sfN: pickR(r, [2, 3]) };
}

function svg(F) {
  const rows = [
    ["carbon dioxide released by one country burning fossil fuels in a year (kg)", fmt(F.big.a * 10 ** F.big.b).replace(/\B(?=(\d{3})+(?!\d))/g, " ")],
    ["phytoplankton cells in 1 dm³ of sea water", `${fmt(F.cells.a)} × ${sup(F.cells.b)}`],
    ["diameter of one circular diatom (m)", `${fmt(F.dia.a)} × ${sup(F.dia.b)}`],
    ["sediment core: radius of the tube (cm)", fmt(F.rad)],
    ["sediment core: length of the core (cm)", fmt(F.len)],
    ["sediment core: mass of the sediment (g)", fmt(F.mass)],
    ["density of a sea-water sample from a calculator (g/cm³)", fmt(F.raw)],
  ];
  let h = `<div class="fig-${KEY}"><p class="mm-cap">Data from a plankton and sediment survey</p><table class="ftable"><thead><tr><th>measurement</th><th>value</th></tr></thead><tbody>`;
  rows.forEach(([a, b]) => (h += `<tr><th scope="row">${a}</th><td>${b}</td></tr>`));
  return h + `</tbody></table></div>`;
}

function questions(F, r) {
  const qs = [];
  const B = F.big, val = B.a * 10 ** B.b;
  const sfOpts = [`${fmt(B.a)} × ${sup(B.b)} kg`, `${fmt(B.a * 10)} × ${sup(B.b - 1)} kg`, `${fmt(B.a)} × ${sup(B.b - 1)} kg`, `${fmt(B.a)} × ${sup(B.b + 1)} kg`];
  qs.push({ kind: "choice", q: "Write the mass of carbon dioxide released in standard form.", options: sfOpts, a: 0,
    why: `In standard form the first number is between 1 and 10, multiplied by a power of 10. Move the decimal point until you have ${fmt(B.a)}: that takes ${B.b} places, so the mass is <b>${fmt(B.a)} × ${sup(B.b)} kg</b>. ${fmt(B.a * 10)} × ${sup(B.b - 1)} has the same value but is not standard form, because ${fmt(B.a * 10)} is bigger than 10; the other two have the wrong power.` });
  const C = F.cells, n = Math.round(C.a * 10 ** C.b);
  qs.push({ kind: "num", q: "Write the number of phytoplankton cells in 1 dm³ as an ordinary number.", ans: n, tol: 0, unit: "cells",
    why: `${fmt(C.a)} × ${sup(C.b)} means ${fmt(C.a)} multiplied by 10 ${C.b} times, which moves the decimal point ${C.b} places to the right: <b>${fmt(n).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</b>.` });
  qs.push({ kind: "num", q: "What is the diameter of the diatom in micrometres (µm)? (1 m = 1 000 000 µm)", ans: F.dumm, tol: 0, unit: "µm",
    why: `${fmt(F.dia.a)} × ${sup(-5)} m = ${fmt(F.dia.a)} × 0.00001 m = ${dec(F.dia.a / 100000)} m. Multiply by 1 000 000 to change m to µm: <b>${F.dumm} µm</b>.` });
  const sv = sf(F.raw, F.sfN), sfd = F.sfN === 2 ? 1 : 2;
  qs.push({ kind: "num", q: `Give the density of the sea-water sample to ${F.sfN} significant figures.`, ans: sv, tol: 0, unit: "g/cm³", dp: sfd, check: (v) => near(v, sv),
    why: `Significant figures are counted from the first non-zero digit. ${fmt(F.raw)} to ${F.sfN} significant figures is <b>${fmt(sv, sfd)} g/cm³</b>: look at the next digit to decide whether to round up.` });
  const rr = F.dumm / 2, aOpts = PI.map((p) => Math.round(p * rr * rr)), aAns = Math.round(Math.PI * rr * rr);
  qs.push({ kind: "num", q: "Calculate the area of the circular diatom in µm². Use area = πr² and give your answer to the nearest whole number.", ans: aAns, tol: 0, unit: "µm²", check: (v) => aOpts.some((x) => Math.abs(v - x) <= 1),
    why: `The radius is half the diameter: ${F.dumm} ÷ 2 = ${fmt(rr)} µm. Area = π × ${fmt(rr)}² = π × ${fmt(rr * rr)} = <b>${aAns} µm²</b> using the π key on a calculator (using π = 3.14 gives ${Math.round(3.14 * rr * rr)}, which is also accepted). Using the diameter instead of the radius gives an answer four times too big.` });
  const vol = (p) => p * F.rad * F.rad * F.len, vAns = Math.round(vol(Math.PI)), vOpts = PI.map((p) => vol(p));
  qs.push({ kind: "num", q: "Calculate the volume of the sediment core in cm³. Use volume = πr²h and give your answer to the nearest whole number.", ans: vAns, tol: 0, unit: "cm³", check: (v) => vOpts.some((x) => Math.abs(v - x) <= 1),
    why: `Volume of a cylinder = π × radius² × length = π × ${fmt(F.rad)}² × ${F.len} = π × ${fmt(F.rad * F.rad)} × ${F.len} = <b>${vAns} cm³</b> using the π key (π = 3.14 gives ${Math.round(vol(3.14))}, also accepted).` });
  const dens = vOpts.map((v) => F.mass / v), dAns = sf(F.mass / vol(Math.PI), 2);
  qs.push({ kind: "num", q: "Use your volume to calculate the density of the sediment (density = mass ÷ volume). Give your answer to 2 significant figures.", ans: dAns, tol: 0, unit: "g/cm³", dp: 1, check: (v) => dens.some((d) => near(v, sf(d, 2))),
    why: `Density = ${F.mass} g ÷ ${vAns} cm³ = ${fmt(Math.round(F.mass / vAns * 1000) / 1000)} = <b>${fmt(dAns, 1)} g/cm³</b> to 2 significant figures.` });
  return qs;
}

function selfTest(F, qs) {
  const bad = [];
  if (F.dumm !== Math.round(F.dia.a * 10)) bad.push("diatom µm");
  if (qs[0].options.length !== 4 || new Set(qs[0].options).size !== 4) bad.push("sf options");
  if (!qs[3].check(sf(F.raw, F.sfN))) bad.push("s.f. own");
  if (qs[3].check(F.raw) && sf(F.raw, F.sfN) !== F.raw) bad.push("s.f. unrounded accepted");
  const d = qs[6]; if (!d.check(d.ans)) bad.push("density own");
  return bad;
}

export default {
  key: KEY, group: "Tables and fieldwork", name: "Maths skills from marine data", topics: "Mathematical requirements; 3.4, 5.2, 6.8", html: true, noZoom: true, thumbSeed: 6,
  ctx: () => "data from a plankton and sediment survey",
  blurb: "Standard form, significant figures, the area of a circle and the volume of a cylinder, using survey data.",
  tips: ["Standard form: a number between 1 and 10 × a power of 10, for example 3.7 × 10¹⁰.", "Count significant figures from the first non-zero digit.", "Area of a circle = πr²; use the radius, which is half the diameter.", "Volume of a cylinder = πr²h. Density = mass ÷ volume."],
  make, svg, questions, selfTest,
  css: `.fig-mmaths .mm-cap{margin:2px 0 8px;font-size:13px;color:var(--soft)}.fig-mmaths .ftable th{text-align:left;font-weight:600}.fig-mmaths .ftable td{white-space:nowrap}`,
};
