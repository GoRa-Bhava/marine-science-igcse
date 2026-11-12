/* ---------- CONTEXT CALCULATIONS (0697 Mathematical requirements) ----------
   A fact card of numbers from a marine context, then 5–6 linked calculations with the rounding rule stated in the
   stem: % change (change ÷ ORIGINAL × 100 — the wrong-denominator trap), minimum whole containers (round UP),
   number remaining after % survival, % transfer of biomass between trophic levels (4.4/LO13), magnification and
   actual size with unit conversion (3.4/LO7; µm, mm, cm), density = mass ÷ volume (2.4/LO1), salinity in ppt
   (2.2/LO7). All numbers are generated. */
import { rng, pickR, shuffleR, fmt, pickMixed } from "../core.js";

const KEY = "mcalc";
const rnd = (v, dp) => Math.round(v * 10 ** dp) / 10 ** dp;
const nearHalf = (v, dp) => { const f = Math.abs(v * 10 ** dp) % 1; return Math.abs(f - 0.5) < 0.02; };
const int = (r, a, b) => a + Math.floor(r() * (b - a + 1));
const eq = (x) => (v) => Math.abs(v - x) < 1e-9;
const f = (v, dp) => (dp == null ? fmt(v) : fmt(v, dp));

/* each builder returns { title, ref, rows:[[id,label,value text]], qs(r) } or null to retry */
const BUILD = {
  coral(r) {
    const per = int(r, 12, 30), need = int(r, 150, 900); if (need % per === 0) return null;
    const surv = int(r, 55, 92), c1 = int(r, 8, 25), c2 = c1 + int(r, 4, 20), g = [0, 1, 2, 3].map(() => rnd(int(r, 30, 95) / 10 + 2, 1));
    const frames = Math.ceil(need / per), alive = need * surv / 100, pct = (c2 - c1) / c1 * 100, gm = g.reduce((s, x) => s + x, 0) / 4;
    if (Number.isInteger(alive) || nearHalf(alive, 0) || nearHalf(pct, 0) || nearHalf(gm, 1)) return null;
    return { title: "A conservation group is restoring a coral reef by growing coral fragments on nursery frames and then planting them out.", ref: "6.9 · Mathematical requirements",
      rows: [["per", "Coral fragments that fit on one nursery frame", `${per}`], ["need", "Fragments needed for the reef site", `${need}`], ["surv", "Fragments that survive their first year after planting", `${surv}%`],
        ["c1", "Live coral cover on the site before planting", `${c1}%`], ["c2", "Live coral cover on the site three years later", `${c2}%`], ["g", "Growth of four fragments in their first year / mm", g.map((x) => fmt(x, 1)).join(", ")]],
      qs: (r) => [
        { kind: "num", q: `Calculate the <b>minimum number of whole frames</b> needed to grow ${need} fragments.`, ans: frames, tol: 0, unit: "frames", check: eq(frames), hl: { rows: ["per", "need"] },
          why: `${need} ÷ ${per} = ${(need / per).toFixed(2)}. You cannot have part of a frame, and ${Math.floor(need / per)} frames would hold only ${Math.floor(need / per) * per} fragments, so round <b>up</b>: <b>${frames} frames</b>.` },
        { kind: "choice", q: `${need} ÷ ${per} = ${(need / per).toFixed(2)}. Why must this be rounded <b>up</b> to ${frames}, not to the nearest whole number?`, a: 0, hl: { rows: ["per", "need"] },
          options: ["Fewer frames could not hold all the fragments", "Frames are only sold in even numbers", "Rounding up allows for the fragments that die", "Rounding up gives a more accurate mean"],
          why: `${Math.floor(need / per)} frames hold ${Math.floor(need / per) * per} fragments, fewer than the ${need} needed, so the answer is rounded <b>up</b>. Survival is a separate step: it is not part of how many frames are needed to grow the fragments.` },
        { kind: "num", q: `How many of the ${need} fragments are expected to survive their first year? Give your answer <b>to the nearest whole number</b>.`, ans: Math.round(alive), tol: 0, unit: "fragments", check: eq(Math.round(alive)), hl: { rows: ["need", "surv"] },
          why: `${surv}% of ${need} = ${need} × ${surv} ÷ 100 = ${alive.toFixed(2)}, which is <b>${Math.round(alive)}</b> to the nearest whole number.` },
        { kind: "tap", q: "To calculate the <b>percentage increase</b> in live coral cover, which value do you divide by? Tap it on the card.", a: ["c1"], ansTxt: `the cover before planting (${c1}%)`, labelOf: (id) => ({ per: "fragments per frame", need: "fragments needed", surv: "survival", c1: "cover before", c2: "cover three years later", g: "growth" }[id]), hl: { rows: ["c1"] },
          why: `Percentage change = change ÷ <b>original value</b> × 100. The original value is the cover before planting, <b>${c1}%</b>.` },
        { kind: "num", q: "Calculate the percentage increase in live coral cover. Give your answer <b>to the nearest whole number</b>.", ans: Math.round(pct), tol: 0, unit: "%", check: eq(Math.round(pct)), hl: { rows: ["c1", "c2"] },
          why: `Increase = ${c2} − ${c1} = ${c2 - c1} percentage points. ${c2 - c1} ÷ ${c1} × 100 = ${pct.toFixed(2)}%, which is <b>${Math.round(pct)}%</b>. Dividing by ${c2} (the new value) is a common mistake.` },
        { kind: "num", q: "Calculate the mean growth of the four fragments. Give your answer <b>to 1 decimal place</b>.", ans: rnd(gm, 1), tol: 0, dp: 1, unit: "mm", check: eq(rnd(gm, 1)), hl: { rows: ["g"] },
          why: `(${g.map((x) => fmt(x, 1)).join(" + ")}) ÷ 4 = ${fmt(rnd(g.reduce((s, x) => s + x, 0), 1), 1)} ÷ 4 = ${gm.toFixed(3)}, which is <b>${fmt(rnd(gm, 1), 1)} mm</b> to 1 decimal place.` },
      ] };
  },
  fishery(r) {
    const x1 = int(r, 180, 900), x2 = Math.round(x1 * (0.45 + r() * 0.4)), boats = int(r, 24, 90), hold = int(r, 12, 40), land = int(r, 150, 700);
    const pd = (x1 - x2) / x1 * 100, wrong = (x1 - x2) / x2 * 100, perBoat = x2 * 1000 / boats, hauls = Math.ceil(land / hold);
    if (land % hold === 0 || nearHalf(pd, 0) || nearHalf(wrong, 0) || Math.round(pd) === Math.round(wrong) || nearHalf(perBoat, 0)) return null;
    const y1 = int(r, 2008, 2012), y2 = y1 + int(r, 8, 12);
    return { title: "A fisheries officer recorded the total catch of one fish species landed at a port.", ref: "6.3 · Mathematical requirements",
      rows: [["x1", `Total catch in ${y1} / tonnes`, `${x1}`], ["x2", `Total catch in ${y2} / tonnes`, `${x2}`], ["boats", `Number of boats fishing in ${y2}`, `${boats}`], ["hold", "Mass of fish one boat can carry per trip / tonnes", `${hold}`], ["land", "Catch a fishing company plans to land this year / tonnes", `${land}`]],
      qs: (r) => [
        { kind: "tap", q: `To calculate the percentage decrease in catch from ${y1} to ${y2}, which value do you divide by? Tap it on the card.`, a: ["x1"], ansTxt: `the ${y1} catch (${x1} tonnes)`, labelOf: (id) => ({ x1: `${y1} catch`, x2: `${y2} catch`, boats: "boats", hold: "mass per trip", land: "planned catch" }[id]), hl: { rows: ["x1"] },
          why: `Percentage change = change ÷ <b>original value</b> × 100. The original value is the earlier catch, <b>${x1} tonnes</b>.` },
        { kind: "num", q: `Calculate the percentage decrease in catch from ${y1} to ${y2}. Give your answer <b>to the nearest whole number</b>.`, ans: Math.round(pd), tol: 0, unit: "%", check: eq(Math.round(pd)), hl: { rows: ["x1", "x2"] },
          why: `Decrease = ${x1} − ${x2} = ${x1 - x2} tonnes. ${x1 - x2} ÷ ${x1} × 100 = ${pd.toFixed(2)}%, which is <b>${Math.round(pd)}%</b>.` },
        { kind: "choice", q: `A student wrote: (${x1} − ${x2}) ÷ ${x2} × 100 = ${Math.round(wrong)}%. What mistake did the student make?`, a: 0, hl: { rows: ["x1", "x2"] },
          options: ["They divided by the new value, not the original value", "They subtracted the two catches the wrong way round", "They forgot to multiply by 100 at the end", "They should have added the two catches together"],
          why: `The change must be divided by the <b>original</b> (${y1}) value, ${x1}, not the new value ${x2}. The subtraction and the × 100 were done correctly.` },
        { kind: "num", q: `Calculate the mean catch per boat in ${y2}, in <b>kilograms</b>. Give your answer <b>to the nearest whole number</b>. (1 tonne = 1000 kg)`, ans: Math.round(perBoat), tol: 0, unit: "kg", check: eq(Math.round(perBoat)), hl: { rows: ["x2", "boats"] },
          why: `${x2} tonnes = ${x2 * 1000} kg. ${x2 * 1000} ÷ ${boats} = ${perBoat.toFixed(2)}, which is <b>${Math.round(perBoat)} kg</b> per boat.` },
        { kind: "num", q: `What is the <b>minimum number of trips</b> needed to land ${land} tonnes, if each trip carries ${hold} tonnes?`, ans: hauls, tol: 0, unit: "trips", check: eq(hauls), hl: { rows: ["hold", "land"] },
          why: `${land} ÷ ${hold} = ${(land / hold).toFixed(2)}. ${Math.floor(land / hold)} trips carry only ${Math.floor(land / hold) * hold} tonnes, so round <b>up</b>: <b>${hauls} trips</b>.` },
      ] };
  },
  biomass(r) {
    const chains = [["phytoplankton", "zooplankton", "herring", "seal"], ["kelp", "sea urchin", "sea otter", "orca"], ["seagrass", "sea turtle", "tiger shark", "–"], ["diatoms", "krill", "squid", "sperm whale"]];
    const ch = pickR(r, chains.filter((c) => c[3] !== "–"));
    const b1 = int(r, 400, 1600), p1 = int(r, 6, 18) / 100, p2 = int(r, 6, 18) / 100, p3 = int(r, 5, 15) / 100;
    const b2 = rnd(b1 * p1, 1), b3 = rnd(b2 * p2, 2), b4 = rnd(b3 * p3, 3);
    const t12 = b2 / b1 * 100, t23 = b3 / b2 * 100, t14 = b4 / b1 * 100;
    if (nearHalf(t12, 1) || nearHalf(t23, 1) || nearHalf(t14, 2) || b4 < 0.05 || rnd(t12, 1) === rnd(t23, 1)) return null;
    return { title: `The biomass at each trophic level of a marine food chain was estimated: ${ch.join(" → ")}.`, ref: "4.4/LO13 · Mathematical requirements",
      rows: [["b1", `Biomass of ${ch[0]} / g per m²`, fmt(b1)], ["b2", `Biomass of ${ch[1]} / g per m²`, fmt(b2, 1)], ["b3", `Biomass of ${ch[2]} / g per m²`, fmt(b3, 2)], ["b4", `Biomass of ${ch[3]} / g per m²`, fmt(b4, 3)]],
      qs: (r) => {
        const st = [["Not all of the organisms at one level are eaten by the next level", true, "true: some die and are decomposed instead."], ["Some of the food eaten is egested as faeces", true, "true: undigested material is egested."], ["Some of the biomass is used in respiration and released as carbon dioxide", true, "true: respiration releases energy and carbon dioxide."],
          ["Consumers digest and absorb all of the food they eat", false, "false: some is egested."], ["Every producer in the area is eaten by a primary consumer", false, "false: many are not eaten."], ["Biomass increases at each level because the animals are larger", false, "false: the total biomass at each level gets smaller, even if each animal is larger."]];
        const pick = pickMixed(r, st, 4);
        return [
          { kind: "num", q: `Calculate the percentage of the biomass of ${ch[0]} that is transferred to the ${ch[1]}. Give your answer <b>to 1 decimal place</b>.`, ans: rnd(t12, 1), tol: 0, dp: 1, unit: "%", check: eq(rnd(t12, 1)), hl: { rows: ["b1", "b2"] },
            why: `% transferred = biomass at the higher level ÷ biomass at the lower level × 100 = ${fmt(b2, 1)} ÷ ${fmt(b1)} × 100 = ${t12.toFixed(3)}%, which is <b>${fmt(rnd(t12, 1), 1)}%</b>.` },
          { kind: "tap", q: `To calculate the percentage of biomass transferred from the ${ch[1]} to the ${ch[2]}, which value do you divide by? Tap it on the card.`, a: ["b2"], ansTxt: `the ${ch[1]} biomass (${fmt(b2, 1)} g per m²)`, labelOf: (id) => ({ b1: ch[0], b2: ch[1], b3: ch[2], b4: ch[3] }[id]), hl: { rows: ["b2"] },
            why: `Divide by the biomass at the level the energy comes <b>from</b>, the ${ch[1]}: <b>${fmt(b2, 1)} g per m²</b>.` },
          { kind: "num", q: `Calculate the percentage of the biomass of ${ch[1]} that is transferred to the ${ch[2]}. Give your answer <b>to 1 decimal place</b>.`, ans: rnd(t23, 1), tol: 0, dp: 1, unit: "%", check: eq(rnd(t23, 1)), hl: { rows: ["b2", "b3"] },
            why: `${fmt(b3, 2)} ÷ ${fmt(b2, 1)} × 100 = ${t23.toFixed(3)}%, which is <b>${fmt(rnd(t23, 1), 1)}%</b>.` },
          { kind: "num", q: `What percentage of the biomass of ${ch[0]} ends up in the ${ch[3]}? Give your answer <b>to 2 decimal places</b>.`, ans: rnd(t14, 2), tol: 0, dp: 2, unit: "%", check: eq(rnd(t14, 2)), hl: { rows: ["b1", "b4"] },
            why: `${fmt(b4, 3)} ÷ ${fmt(b1)} × 100 = ${t14.toFixed(4)}%, which is <b>${fmt(rnd(t14, 2), 2)}%</b>. Only a tiny fraction reaches the top of the chain.` },
          ...(pick ? [{ kind: "multi", q: "Tick every statement that helps to explain why biomass decreases at each trophic level.", options: pick.map((s) => s[0]), a: pick.map((s, i) => (s[1] ? i : -1)).filter((i) => i >= 0), hl: {},
            why: pick.map((s) => `${s[1] ? "✓" : "✗"} ${s[0]}: ${s[2]}`).join("<br>") }] : []),
        ];
      } };
  },
  magnify(r) {
    const orgs = [["copepod (a zooplankton)", "µm", [40, 50, 80, 100]], ["diatom (a phytoplankton cell)", "µm", [400, 500, 800, 1000]], ["barnacle larva", "µm", [100, 150, 200, 250]], ["juvenile shrimp", "mm", [2, 3, 4, 5]], ["periwinkle shell", "mm", [2, 3, 4]]];
    const [org, small, mags] = pickR(r, orgs), M = pickR(r, mags);
    const img = int(r, 32, 118);                                 // measured image length / mm
    const act = img / M, actUm = act * 1000, d2 = int(r, 40, 150);
    const um = small === "µm";
    const act2 = um ? Math.round(actUm * (0.6 + r() * 0.8)) : rnd(act * (0.6 + r() * 0.8), 1);
    if (act2 <= 0) return null;
    const M2 = um ? d2 * 1000 / act2 : d2 / act2;
    if ((um ? nearHalf(actUm, 0) : nearHalf(act, 1)) || nearHalf(M2, 0)) return null;
    const aAns = um ? Math.round(actUm) : rnd(act, 1), aUnit = um ? "µm" : "mm";
    return { title: `A student photographed a ${org} ${um ? "through a microscope" : "with a hand lens"} and then made a drawing of a second specimen.`, ref: "3.4/LO7 · Mathematical requirements",
      rows: [["img", "Length of the organism on the photograph / mm", `${img}`], ["mag", "Magnification of the photograph", `×${M}`], ["d2", "Length of the student's drawing of the second specimen / mm", `${d2}`], ["act2", `Actual length of the second specimen / ${aUnit}`, um ? `${act2}` : fmt(act2, 1)]],
      qs: (r) => [
        { kind: "choice", q: "Magnification = image size ÷ actual size. Which rearrangement gives the <b>actual size</b>?", a: 0, hl: {},
          options: ["actual size = image size ÷ magnification", "actual size = image size × magnification", "actual size = magnification ÷ image size", "actual size = image size − magnification"],
          why: "Rearranging magnification = image size ÷ actual size gives <b>actual size = image size ÷ magnification</b>." },
        { kind: "tap", q: "Tap the value on the card that is the <b>image size</b> for the photograph.", a: ["img"], ansTxt: `the length on the photograph (${img} mm)`, labelOf: (id) => ({ img: "length on the photograph", mag: "magnification", d2: "length of the drawing", act2: "second specimen" }[id]), hl: { rows: ["img"] },
          why: `The image size is the length measured on the photograph: <b>${img} mm</b>.` },
        { kind: "num", q: `Calculate the actual length of the ${org.split(" (")[0]} on the photograph, in <b>${aUnit}</b>.${um ? " Give your answer to the nearest whole number. (1 mm = 1000 µm)" : " Give your answer to 1 decimal place."}`, ans: aAns, tol: 0, dp: um ? 0 : 1, unit: aUnit, check: eq(aAns), hl: { rows: ["img", "mag"] },
          why: `Actual size = image size ÷ magnification = ${img} ÷ ${M} = ${act.toFixed(4)} mm${um ? ` = ${act.toFixed(4)} × 1000 = ${actUm.toFixed(1)} µm, which is <b>${aAns} µm</b>` : `, which is <b>${fmt(aAns, 1)} mm</b>`}.` },
        { kind: "num", q: `Calculate the magnification of the student's drawing. Give your answer <b>to the nearest whole number</b>.`, ans: Math.round(M2), tol: 0, unit: "", check: eq(Math.round(M2)), ansTxt: `×${Math.round(M2)}`, hl: { rows: ["d2", "act2"] },
          why: um ? `Use the same units: ${d2} mm = ${d2 * 1000} µm. Magnification = image size ÷ actual size = ${d2 * 1000} ÷ ${act2} = ${M2.toFixed(2)}, which is <b>×${Math.round(M2)}</b>.`
            : `Magnification = image size ÷ actual size = ${d2} ÷ ${fmt(act2, 1)} = ${M2.toFixed(2)}, which is <b>×${Math.round(M2)}</b>.` },
        { kind: "choice", q: `A student gave the actual length of the organism on the photograph as ${img * M} mm. What mistake did they make?`, a: 0, hl: { rows: ["img", "mag"] },
          options: ["They multiplied by the magnification instead of dividing", "They forgot to convert the answer from mm into cm", "They measured the drawing instead of the photograph", "They divided the magnification by the image size"],
          why: `${img} × ${M} = ${img * M}: the student multiplied. The actual organism is smaller than its image, so divide: ${img} ÷ ${M}.` },
      ] };
  },
  density(r) {
    const n = 3, vol = [int(r, 40, 120), int(r, 40, 120), int(r, 40, 120)], dens = shuffleR(r, [1.000 + int(r, 0, 4) / 1000, 1.018 + int(r, 0, 6) / 1000, 1.028 + int(r, 0, 6) / 1000]);
    const mass = vol.map((v, i) => rnd(v * dens[i], 1)), d = mass.map((m, i) => m / vol[i]);
    if (d.some((x) => nearHalf(x, 3))) return null;
    const ds = d.map((x) => rnd(x, 3)); if (new Set(ds).size < 3 || Math.max(...ds) - [...ds].sort((a, b) => a - b)[1] < 0.003) return null;
    const ppt = pickR(r, [8, 12, 30, 34, 35, 36, 38, 40]), kg = pickR(r, [0.5, 1.5, 2, 2.5, 4]), salt = ppt * kg, dm3 = pickR(r, [0.25, 0.4, 0.5, 0.75]), cm3 = dm3 * 1000;
    const hi = ds.indexOf(Math.max(...ds)), L = ["A", "B", "C"];
    return { title: "A student measured the mass and volume of three water samples, A, B and C, collected from different places.", ref: "2.4/LO1 · 2.2/LO7",
      rows: [["ppt", "Salinity of the open-ocean water nearby / ppt", `${ppt}`]],
      table: `<table class="ftable mc-samples"><thead><tr><th>sample</th><th>mass / g</th><th>volume / cm³</th></tr></thead><tbody>${L.map((l, i) => `<tr data-row="s${i}"><td data-tap="s${i}">${l}</td><td>${fmt(mass[i], 1)}</td><td>${vol[i]}</td></tr>`).join("")}</tbody></table>`,
      qs: (r) => [
        { kind: "num", q: `Density = mass ÷ volume. Calculate the density of sample ${L[0]} in g per cm³. Give your answer <b>to 3 decimal places</b>.`, ans: ds[0], tol: 0, dp: 3, unit: "g per cm³", check: eq(ds[0]), hl: { rows: ["s0"] },
          why: `${fmt(mass[0], 1)} ÷ ${vol[0]} = ${d[0].toFixed(5)}, which is <b>${fmt(ds[0], 3)} g per cm³</b>.` },
        { kind: "tap", q: "Tap the sample with the <b>highest density</b>.", a: [`s${hi}`], ansTxt: `sample ${L[hi]}`, labelOf: (id) => (id === "ppt" ? "salinity" : `sample ${L[+id.slice(1)]}`), hl: { rows: [`s${hi}`] },
          why: `Densities: ${L.map((l, i) => `${l} ${fmt(ds[i], 3)}`).join(", ")} g per cm³. Sample <b>${L[hi]}</b> is the densest: most likely the saltiest water.` },
        { kind: "choice", q: "Which unit is correct for density calculated from mass in grams and volume in cm³?", a: 0, hl: {},
          options: ["g per cm³", "cm³ per g", "g × cm³", "g per cm"],
          why: "Density = mass ÷ volume, so the unit is mass unit per volume unit: <b>g per cm³</b>." },
        { kind: "num", q: `Salinity is the mass of dissolved salts in grams per kilogram of water (ppt). What mass of salts is dissolved in ${fmt(kg)} kg of the open-ocean water?`, ans: salt, tol: 0, unit: "g", check: eq(salt), hl: { rows: ["ppt"] },
          why: `${ppt} ppt means ${ppt} g of salts in every 1 kg. ${ppt} × ${fmt(kg)} = <b>${fmt(salt)} g</b>.` },
        { kind: "num", q: `A beaker holds ${fmt(dm3)} dm³ of water. What is this volume in cm³? (1 dm³ = 1000 cm³)`, ans: cm3, tol: 0, unit: "cm³", check: eq(cm3), hl: {},
          why: `${fmt(dm3)} × 1000 = <b>${fmt(cm3)} cm³</b>.` },
      ] };
  },
};
const KINDS = Object.keys(BUILD);

function make(seed) {
  const kind = KINDS[Math.floor(rng(seed)() * KINDS.length)];
  for (let t = 0; t < 400; t++) { const r = rng(seed + t * 6151 + 11); const c = BUILD[kind](r); if (c) return { kind: KEY, seed, ctxKind: kind, c, qseed: (seed ^ (t * 2654435761)) >>> 0 }; }
  return make(seed + 1);
}
function svg(F, opt) {
  opt = opt || {}; const hl = (opt.hl && opt.hl.rows) || [];
  let h = `<div class="fig-${KEY}"><p class="mc-cap">${F.c.title}</p>`;
  if (F.c.table) h += F.c.table.replace(/<tr data-row="(\w+)">/g, (m, id) => `<tr${hl.includes(id) ? ' class="hl"' : ""}>`);
  h += `<table class="ftable mc-card"><tbody>`;
  for (const [id, label, val] of F.c.rows) h += `<tr${hl.includes(id) ? ' class="hl"' : ""}><th scope="row">${label}</th><td${F.c.table ? "" : ` data-tap="${id}"`}>${val}</td></tr>`;
  return h + `</tbody></table></div>`;
}
function questions(F, r) { return F.c.qs(r); }
function selfTest(F, qs) {
  const bad = [];
  const ids = F.c.table ? [...F.c.table.matchAll(/data-tap="(\w+)"/g)].map((m) => m[1]) : F.c.rows.map((x) => x[0]);
  qs.forEach((q, i) => { if (q.kind === "tap" && q.a.some((a) => !ids.includes(a))) bad.push("tap id " + i); if (q.kind === "num" && !Number.isFinite(q.ans)) bad.push("ans " + i); });
  if (!qs.some((q) => q.kind === "tap") || !qs.some((q) => q.kind === "choice" || q.kind === "multi")) bad.push("kinds");
  return bad;
}

export default {
  key: KEY, group: "Tables and fieldwork", name: "Calculations from data", topics: "Units 2, 3, 4 and 6 (Mathematical requirements)", html: true, noZoom: true, thumbSeed: 5,
  ctx: (F) => `fact card (${F.c.ref})`,
  blurb: "A card of numbers from a marine context, then the exam's favourite calculations: % change, rounding up, % survival, % transfer, magnification and density.",
  tips: ["Percentage change = change ÷ <b>original</b> value × 100.", "\"Minimum number of whole…\" means round <b>up</b>, even if the decimal is small.", "Magnification = image size ÷ actual size, so actual size = image size ÷ magnification. Use the same units.", "% transferred = biomass at the higher level ÷ biomass at the lower level × 100.", "Give the answer to the rounding the question asks for, with the unit."],
  make, svg, questions, selfTest,
  css: `.fig-${KEY} .mc-cap{margin:0 0 8px;font-size:13.5px;line-height:1.45;color:var(--soft)}.fig-${KEY} .mc-card th{text-align:left;font-weight:600}.fig-${KEY} .mc-samples{margin-bottom:10px}.fig-${KEY} .mc-samples td[data-tap]{font-weight:800;cursor:pointer}.fig-${KEY} .mc-card td{font-weight:700;white-space:nowrap;cursor:pointer}.fig-${KEY} .mc-card tr.hl th,.fig-${KEY} .mc-card tr.hl td{background:color-mix(in srgb,var(--app) 28%,transparent)}`,
};
