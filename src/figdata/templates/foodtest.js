/* ---------- FOOD TESTS: A RACK OF RESULTS (0697 4.1/LO2, PA, AO3) ----------
   Six test tubes after food tests on two food samples. Sample 1 is tested with all four reagents (iodine solution,
   Benedict's solution, biuret solution, ethanol emulsion test); sample 2 with biuret solution and one other test.
   Under the rack, a results table gives tube letter, sample and reagent; its "colour seen" row is filled in only after
   Check, and only for the tubes that question is about (an accessible colour-name readout that never gives away a later answer).
   COLOUR EXCEPTION (approved): the tube contents use the fixed hex colours of practical card P4.1 (practicals.js `tests`),
   on a fixed light-neutral backing card with printed lines (clear liquid shows the lines, a cloudy emulsion hides them),
   so the colours read the same in dark and light themes. Everything else uses the CSS variables.
   KM4 4.1/LO2: iodine orange-brown → blue-black; Benedict's (hot water bath) blue → green / yellow / orange / brick-red;
   biuret blue → lilac / purple; ethanol: dissolve, add to water → cloudy white emulsion; negative = no change; ethanol is
   flammable (no naked flame). Forbidden (never required): reagent chemistry, the non-reducing sugar test, quantitative
   Benedict's. The Benedict's comparison is qualitative only (which tube is further along the colour series), as on P4.1.
   Misconception distractors: iodine turns purple, biuret turns blue-black, Benedict's works cold, "no change" means the
   test failed, the white emulsion is protein.
   Question ownership (lesson: no feedback may give away a later answer): each question's explanation and readout name
   only its own tubes; the biuret tubes belong to the tap question alone; the reagent-from-colour question asks about a
   positive colour that no tube in the figure shows, and comes first. */
import { rng, pickR, shuffleR } from "../core.js";

const KEY = "foodtest";
const W = 540, CW = 90, TOP = 34, PANEL_H = 160, PW = 70, TW = 40;
const RH = 30, ROW = [0, 1, 2, 3].map((k) => TOP + PANEL_H + 6 + k * RH); // table rows: tube letter / reagent / colour readout (after Check only)
const H = ROW[3] + 4;
const LET = "ABCDEF";
const PAIRS = [["X", "Y"], ["P", "Q"], ["R", "S"], ["M", "N"], ["J", "K"]];
const TESTS = ["I", "B", "Bi", "E"];
const RLAB = { I: "iodine", B: "Benedict's", Bi: "biuret", E: "ethanol" };
const RNAME = { I: "iodine solution", B: "Benedict's solution", Bi: "biuret solution", E: "the ethanol emulsion test" };
const NUT = { I: "starch", B: "reducing sugar", Bi: "protein", E: "lipid (fat or oil)" };
const NUTS = { I: "starch", B: "reducing sugar", Bi: "protein", E: "lipid" };
// P4.1 colours (practicals.js) — tube contents only
const BEN = ["#1f6feb", "#3aa66b", "#f2c744", "#f08a24", "#b7410e"], BENN = ["blue", "green", "yellow", "orange", "brick-red"];
const COL = { I: ["#b5651d", "#16233f"], Bi: ["#2e6fd6", "#b48ad6"], E: ["#cfdae0", "#e9eef2"] };
const CNAME = { I: ["orange-brown", "blue-black"], Bi: ["blue", "lilac"], E: ["clear", "cloudy white"] };
const CARD = "#d3dadf", CARDLINE = "#56636d";

const colourOf = (t) => (t.test === "B" ? BEN[t.v] : COL[t.test][t.v]);
const nameOf = (t) => (t.test === "B" ? BENN[t.v] : CNAME[t.test][t.v]);
const pos = (t) => t.v > 0;

function make(seed) {
  for (let tries = 0; ; tries++) {
    const r = rng(seed + tries * 7919);
    const [s1, s2] = pickR(r, PAIRS);
    const T2 = pickR(r, ["I", "E", "B"]);                 // sample 2's second test
    const cmp = T2 === "B";
    const res = {};
    res.I1 = r() < 0.5 ? 1 : 0; res.E1 = r() < 0.5 ? 1 : 0;
    if (cmp) { const a = 1 + Math.floor(r() * 4); let b = 1 + Math.floor(r() * 3); if (b >= a) b++; if (Math.abs(a - b) < 2) continue; res.B1 = a; res.B2 = b; }
    else { res.B1 = Math.floor(r() * 5); res[T2 + "2"] = r() < 0.5 ? 1 : 0; }
    const proteinIn = r() < 0.5 ? 1 : 2; res.Bi1 = proteinIn === 1 ? 1 : 0; res.Bi2 = proteinIn === 2 ? 1 : 0;
    // the reagent-from-colour question asks about a positive colour that no tube in the figure shows:
    // blue-black (no positive iodine tube), cloudy white (no positive ethanol tube) or brick-red (no brick-red Benedict's tube)
    const free = ["I", "E"].filter((t) => !res[t + "1"] && !res[t + "2"]);
    if (!cmp && res.B1 !== 4) free.push("B");
    if (!free.length) continue;
    const o1 = shuffleR(r, TESTS), o2 = shuffleR(r, ["Bi", T2]);
    const tubes = o1.map((t) => ({ test: t, s: 1, v: res[t + "1"] })).concat(o2.map((t) => ({ test: t, s: 2, v: res[t + "2"] })));
    tubes.forEach((t, i) => { t.id = LET[i]; t.sample = t.s === 1 ? s1 : s2; });
    const nb = free.filter((x) => x !== "B");                // keep the three keys roughly balanced
    const idColour = nb.length && free.includes("B") && r() < 0.5 ? pickR(r, nb) : pickR(r, free);
    return { kind: KEY, seed, s1, s2, T2, cmp, tubes, idColour };
  }
}
const tubeOf = (F, s, test) => F.tubes.find((t) => t.s === s && t.test === test);

const cx = (i) => CW * i + CW / 2;
const LIQ = TOP + 66, BOT = TOP + PANEL_H - 12 - TW / 2;
function tubePath(x) {
  const l = x - TW / 2, rr = x + TW / 2, top = TOP + 12;
  return `M${l - 4} ${top}L${l} ${top + 5}L${l} ${BOT}A${TW / 2} ${TW / 2} 0 0 0 ${rr} ${BOT}L${rr} ${top + 5}L${rr + 4} ${top}`;
}
function liquidPath(x) {
  const l = x - TW / 2 + 2, rr = x + TW / 2 - 2, rad = TW / 2 - 2;
  return `M${l} ${LIQ}L${l} ${BOT}A${rad} ${rad} 0 0 0 ${rr} ${BOT}L${rr} ${LIQ}Z`;
}

function svg(F, opt) {
  opt = opt || {}; const hl = opt.hl || {}, read = hl.read || [], ring = hl.ring || [];
  let s = "";
  // tap targets go behind the drawing (the drawing ignores pointer events), so a selected tube's colour is never tinted
  F.tubes.forEach((t, i) => { s += `<rect x="${cx(i) - CW / 2 + 3}" y="${TOP - 4}" width="${CW - 6}" height="${ROW[2] - TOP + 2}" rx="8" class="ft-tap" ${opt.tapMode ? `data-tap="${t.id}"` : ""}/>`; });
  s += `<g class="ft-draw">`;
  // which sample each tube holds
  for (const [s0, n, name] of [[0, 4, F.s1], [4, 2, F.s2]]) {
    const x1 = CW * s0 + 8, x2 = CW * (s0 + n) - 8;
    s += `<path d="M${x1} 30V22H${x2}V30" class="ft-br"/><rect x="${(x1 + x2) / 2 - 44}" y="8" width="88" height="22" class="ft-brbg"/><text x="${(x1 + x2) / 2}" y="24" text-anchor="middle" class="ft-sm">sample ${name}</text>`;
  }
  F.tubes.forEach((t, i) => {
    const x = cx(i), px = x - PW / 2;
    s += `<rect x="${px}" y="${TOP}" width="${PW}" height="${PANEL_H}" rx="6" fill="${CARD}" class="ft-card${ring.includes(t.id) ? " ft-ring" : ""}"/>`;
    for (let y = LIQ - 8; y < TOP + PANEL_H - 6; y += 9) s += `<line x1="${px + 5}" x2="${px + PW - 5}" y1="${y}" y2="${y}" stroke="${CARDLINE}" stroke-width="1.3"/>`;
    const clear = t.test === "E" && !t.v;
    s += `<path d="${liquidPath(x)}" fill="${colourOf(t)}" fill-opacity="${clear ? 0.28 : t.test === "E" ? 1 : 0.94}" stroke="#1d2a33" stroke-opacity=".55" stroke-width="1"/>`;
    s += `<path d="${tubePath(x)}" class="ft-glass"/><path d="${tubePath(x)}" class="ft-glass2"/>`;
  });
  // results table: tube letter and reagent; the colour row is filled only after Check, for this question's tubes
  for (let k = 0; k <= 2; k++) s += `<line x1="0" x2="${W}" y1="${ROW[k]}" y2="${ROW[k]}" class="ft-tl"/>`;
  for (let i = 0; i <= 6; i++) s += `<line x1="${CW * i}" x2="${CW * i}" y1="${ROW[0]}" y2="${ROW[2]}" class="ft-tl${i === 4 ? " ft-tl2" : ""}"/>`;
  F.tubes.forEach((t, i) => {
    const x = cx(i);
    s += `<text x="${x}" y="${ROW[0] + 22}" text-anchor="middle" class="ft-let">${t.id}</text>`;
    s += `<text x="${x}" y="${ROW[1] + 21}" text-anchor="middle" class="ft-rg">${RLAB[t.test]}</text>`;
    if (read.includes(t.id)) { const nm = nameOf(t);
      s += `<rect x="${x - CW / 2 + 2}" y="${ROW[2] + 3}" width="${CW - 4}" height="${RH - 5}" rx="5" class="ft-readbg"/><text x="${x}" y="${ROW[2] + 20}" text-anchor="middle" class="ft-read"${nm.length > 9 ? ` textLength="86" lengthAdjust="spacingAndGlyphs"` : ""}>${nm}</text>`; }
  });
  s += `</g>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="figsvg fig-${KEY}" role="img" aria-label="Six test tubes after food tests on samples ${F.s1} and ${F.s2}, each labelled with its letter and reagent">${s}</svg>`;
}

/* ---------- questions ---------- */
const tl = (t) => `tube ${t.id}`;
const sayT = (t) => `${tl(t)} (sample ${t.sample}, ${RLAB[t.test]}) is <b>${nameOf(t)}</b>`;

function questions(F, r) {
  const qs = [], X = F.s1, Y = F.s2;
  const xi = tubeOf(F, 1, "I"), xb = tubeOf(F, 1, "B"), xe = tubeOf(F, 1, "E");
  const bi1 = tubeOf(F, 1, "Bi"), bi2 = tubeOf(F, 2, "Bi"), y2 = tubeOf(F, 2, F.T2);

  // 1. which reagent gives this colour (a positive colour that no tube in the figure shows)
  const idT = F.idColour, RO = ["iodine solution", "Benedict's solution", "biuret solution", "ethanol, then water"];
  const idStem = { I: "gave a <b>blue-black</b> colour", B: "gave a <b>brick-red</b> colour", E: "gave a <b>cloudy white emulsion</b>" }[idT];
  qs.push({ kind: "choice", q: `In a different investigation, a food test on another food sample ${idStem}. Which was used in this test?`,
    options: RO, a: { I: 0, B: 1, E: 3 }[idT], hl: {}, fixedOpts: true,
    why: idT === "I"
      ? "<b>Iodine solution</b> is the test for starch: it starts orange-brown and turns <b>blue-black</b> when starch is present. Biuret solution does not turn blue-black, and iodine with starch is blue-black, not purple."
      : idT === "B" ? "<b>Benedict's solution</b> tests for reducing sugars; brick-red is a positive result. Iodine stays orange-brown without starch; it does not turn brick-red."
      : "The <b>ethanol emulsion test</b> is the test for lipids: dissolve the food in <b>ethanol</b>, then pour the liquid into <b>water</b>. A <b>cloudy white emulsion</b> shows lipid is present. The cloudiness does not show protein." });

  // 2. tick the correct statements about sample 1 (iodine, Benedict's and ethanol tubes only)
  const own2 = [xi, xb, xe].sort((a, b) => (a.id < b.id ? -1 : 1));
  const pres = (t) => [[`Sample ${X} contains ${NUT[t.test]}.`, pos(t)], [`Sample ${X} contains no ${NUT[t.test]}.`, !pos(t)]];
  const extra = (t) => {
    if (!pos(t)) return [[`${cap(tl(t))} gives a valid negative result.`, true], [`The test in ${tl(t)} did not work, as there was no change.`, false]];
    const T = t.test === "I" ? [`The blue-black colour in ${tl(t)} shows that sample ${X} contains starch.`, `${cap(tl(t))} cannot show whether sample ${X} contains protein.`]
      : t.test === "E" ? [`The cloudy white emulsion in ${tl(t)} shows that sample ${X} contains lipid.`, `${cap(tl(t))} cannot show whether sample ${X} contains protein.`] : null;
    if (!T) return [];
    const what = t.test === "I" ? "blue-black colour" : "cloudy white emulsion";
    return [[pickR(r, T), true], [`The ${what} in ${tl(t)} shows that sample ${X} contains protein.`, false]];
  };
  // one tube (iodine or ethanol) gives a true/false pair about how to read it; the other two give a presence statement each
  const xt = pickR(r, [xi, xe]), xp = extra(xt);
  let st = own2.filter((t) => t !== xt).map((t) => pickR(r, pres(t))).concat(xp);
  st = shuffleR(r, st);
  const w2 = own2.map((t) => `${cap(sayT(t))}: ${pos(t) ? `${NUTS[t.test]} is present` : `a negative result, so there is no ${NUTS[t.test]}`}.`);
  const misW = [];
  const has = (re) => st.some((x) => re.test(x[0]));
  if (xt === xi && pos(xi)) misW.push(`Blue-black in the iodine tube shows starch, not protein: iodine solution cannot test for protein.`);
  if (xt === xe && pos(xe)) misW.push(`A cloudy white emulsion shows lipid, not protein: the ethanol test cannot test for protein.`);
  if (has(/did not work|valid negative/)) misW.push(`“No change” is a negative result: the test worked and the nutrient is absent.`);
  qs.push({ kind: "multi", q: `Use tubes ${own2[0].id}, ${own2[1].id} and ${own2[2].id}. Tick every correct statement about sample ${X}.`,
    options: st.map((x) => x[0]), a: st.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0), hl: { read: own2.map((t) => t.id), ring: own2.map((t) => t.id) },
    why: st.map((x) => `${x[1] ? "✓" : "✗"} ${x[0]}`).join("<br>") + `<br>${w2.join(" ")} ${misW.join(" ")}` });

  // 3. results-table entry for sample 2's other tube, or the Benedict's comparison
  if (F.cmp) {
    const more = xb.v > y2.v ? 1 : 2, A = [X, Y];
    const opts = [[`Sample ${A[more - 1]}: its Benedict's result is closer to brick-red`, true], [`Sample ${A[2 - more]}: its Benedict's result is closer to brick-red`, false],
      [`Sample ${A[more - 1]}: its Benedict's result is closer to the blue starting colour`, false], [`Sample ${A[2 - more]}: its Benedict's result is closer to the blue starting colour`, false]];
    const hi = more === 1 ? xb : y2, lo = more === 1 ? y2 : xb;
    qs.push({ kind: "choice", q: `Both samples were tested in the same way and gave a positive Benedict's result. Which sample contains more reducing sugar, and why?`,
      options: opts.map((o) => o[0]), a: 0, hl: { read: [xb.id, y2.id], ring: [xb.id, y2.id] },
      why: `${cap(sayT(hi))} and ${sayT(lo)}. Benedict's solution changes from blue through green, yellow and orange to brick-red: the further along this series, the more reducing sugar. So <b>sample ${hi.sample}</b> contains more. This compares the amounts by colour only; it does not measure them.` });
  } else {
    const t = y2, nn = NUTS[t.test], c = CNAME[t.test];
    const O = [[`${c[1]} — ${nn} present`, pos(t)], [`${c[0]} — ${nn} absent`, !pos(t)], [`${c[1]} — ${nn} absent`, false], [`${c[0]} — ${nn} present`, false],
      [t.test === "I" ? `purple — starch present` : `cloudy white — protein present`, false]];
    const ai = O.findIndex((o) => o[1]);
    qs.push({ kind: "choice", q: `A results table records the colour seen and the conclusion for each tube. Which entry is correct for <b>${tl(t)}</b>?`,
      options: O.map((o) => o[0]), a: ai, hl: { read: [t.id], ring: [t.id] },
      why: `${cap(sayT(t))}. ${t.test === "I" ? "Iodine solution stays orange-brown without starch and turns blue-black with starch." : "In the ethanol emulsion test the liquid stays clear without lipid and turns cloudy white with lipid."} So the entry is <b>${O[ai][0]}</b>. ${t.test === "I" ? "Iodine does not turn purple." : "The cloudy white emulsion shows lipid, not protein."}` });
  }

  // 4. tap the tube that shows protein
  const pt = pos(bi1) ? bi1 : bi2, nt = pos(bi1) ? bi2 : bi1;
  const bb = F.tubes.find((t) => t.test === "I" && pos(t));
  const rd4 = [bi1.id, bi2.id].concat(bb ? [bb.id] : []);
  qs.push({ kind: "tap", q: `Tap the tube that shows a <b>positive</b> test for <b>protein</b>.`, a: [pt.id], ansTxt: tl(pt), labelOf: (id) => `tube ${id}`,
    askOpt: { tapMode: true }, hl: { read: rd4 }, hint: "Tap a tube.",
    why: `Protein is tested with <b>biuret solution</b>, which starts blue and turns <b>lilac (purple)</b> when protein is present. ${cap(sayT(pt))}, so sample ${pt.sample} contains protein; ${sayT(nt)}, so sample ${nt.sample} does not.${bb ? ` The blue-black in ${tl(bb)} is iodine with starch, not a protein result.` : ""}`,
    doneOpt: () => ({ tapMode: true, hl: { read: rd4 } }) });

  // 5. method or safety
  if (r() < 0.5) {
    qs.push({ kind: "choice", q: `Before recording the colours in the Benedict's tubes, what should the student do?`,
      options: ["Heat them in a hot water bath", "Leave them to stand at room temperature", "Cool them in an ice bath", "Shake them, then record at once"], a: 0, hl: {},
      why: "Benedict's solution must be <b>heated in a hot water bath</b> for a few minutes. Cold Benedict's solution stays blue even when reducing sugar is present, so an unheated tube would give a false negative." });
  } else {
    qs.push({ kind: "choice", q: `The ethanol emulsion test must be carried out with no naked flames nearby. Why?`,
      options: ["Ethanol is flammable and catches fire easily", "The flame would use up the oxygen the test needs", "The flame would turn the ethanol cloudy", "Light from the flame hides the cloudy emulsion"], a: 0, hl: {},
      why: "Ethanol is <b>flammable</b>, so there must be <b>no naked flame</b> nearby. The test needs no heating: dissolve the food in ethanol, then pour the liquid into water. (Eye protection is worn throughout the food tests, as the reagents are irritants.)" });
  }

  // 6. improvement (AO3)
  if (r() < 0.6) {
    qs.push({ kind: "choice", q: `Another student says that a colour in one of the tubes might come from the reagent itself, not from the food. How could the investigation be improved to check this?`,
      options: ["Set up a control tube of water with the same reagent", "Add more drops of the reagent to each tube", "Use a larger piece of each food sample", "Mix all four reagents together in a single tube of the food"], a: 0, hl: {},
      why: "A <b>control</b>: a tube with <b>water instead of food</b> and the same reagent shows the colour of the reagent alone (a negative result). A food tube that looks different from its control shows a real result. More reagent or more food does not show what the reagent alone looks like." });
  } else {
    qs.push({ kind: "choice", q: `The student used a separate portion of each food sample for each test. Why?`,
      options: ["So that one reagent does not affect another test", "So that every tube holds more of the food sample", "So that all of the tests can finish at the same time", "So that the food sample does not need dissolving"], a: 0, hl: {},
      why: "Each test needs its own <b>fresh portion</b> of the food, so that one reagent cannot react with or hide the result of another. Using equal volumes of food and reagent in each tube also keeps the comparison fair." });
  }
  return qs;
}
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

function selfTest(F, qs) {
  const bad = [];
  const bis = F.tubes.filter((t) => t.test === "Bi"); if (bis.filter(pos).length !== 1) bad.push("not exactly one protein-positive tube");
  if (F.tubes.some((t) => t.test === F.idColour && (F.idColour === "B" ? t.v === 4 : pos(t)))) bad.push("asked colour is shown in the figure");
  if (new Set(F.tubes.map((t) => t.test + t.s)).size !== 6) bad.push("duplicate test/sample");
  if (F.cmp) { const b = F.tubes.filter((t) => t.test === "B"); if (b.length !== 2 || !b.every(pos) || b[0].v === b[1].v) bad.push("comparison shades not distinct positives"); }
  qs.forEach((q, i) => {
    if (q.kind === "choice") { const L = q.options.map((o) => o.length), c = L[q.a]; if (!q.fixedOpts && L.every((x, k) => k === q.a || x <= c)) bad.push(`q${i} correct option is the longest`); }
    if (q.kind === "multi") { if (!q.a.length || q.a.length === q.options.length) bad.push(`q${i} multi not mixed`); }
    // the explanation and readout name only this question's own tubes
    const own = new Set([...(q.hl && q.hl.read) || [], ...(q.a && q.kind === "tap" ? q.a : [])]);
    for (const m of (q.why + q.q).matchAll(/tubes? ([A-F])(?:, ([A-F]))?(?: and ([A-F]))?/g)) for (const id of m.slice(1).filter(Boolean)) if (!own.has(id)) bad.push(`q${i} mentions tube ${id} it does not own`);
    if (/always|never|only/i.test(q.q + (q.options || []).join(" "))) bad.push(`q${i} absolute word`);
  });
  // biuret tubes are named only by the tap question
  const biIds = bis.map((t) => t.id);
  qs.forEach((q, i) => { if (q.kind !== "tap" && biIds.some((id) => (q.hl.read || []).includes(id))) bad.push(`q${i} reads out a biuret tube`); });
  return bad;
}

export default {
  key: KEY, group: "Tables and fieldwork", name: "Food test results", topics: "Unit 4 (4.1)", thumbSeed: 7,
  blurb: "A rack of test tubes after food tests on two samples: read the colours, draw conclusions, and plan a safe, fair test.",
  tips: ["Iodine solution tests for starch: orange-brown → blue-black.", "Benedict's solution tests for reducing sugars. Heat it in a hot water bath: blue → green → yellow → orange → brick-red. The further along, the more reducing sugar.",
    "Biuret solution tests for protein: blue → lilac (purple).", "Ethanol emulsion test for lipids: dissolve the food in ethanol, then pour into water. A cloudy white emulsion means lipid is present.",
    "No change is a negative result: the nutrient is absent. It does not mean the test failed.", "Safety: no naked flames near ethanol (flammable); wear eye protection (the reagents are irritants)."],
  ctx: (F) => `food tests on samples ${F.s1} and ${F.s2}`,
  make, svg, questions, selfTest,
  css: `.fig-${KEY} .ft-draw,.fig-${KEY} .ft-draw *{pointer-events:none}.fig-${KEY} .ft-tap{fill:transparent;stroke:none}
.fig-${KEY} .ft-glass{fill:none;stroke:var(--ink);stroke-width:3.4;stroke-linejoin:round}.fig-${KEY} .ft-glass2{fill:none;stroke:var(--surface);stroke-width:1.1}
.fig-${KEY} .ft-card{stroke:var(--line);stroke-width:1}.fig-${KEY} .ft-card.ft-ring{stroke:var(--app);stroke-width:4}
.fig-${KEY} .ft-tl{stroke:var(--mut);stroke-width:1}.fig-${KEY} .ft-tl2{stroke:currentColor;stroke-width:2}.fig-${KEY} .ft-br{fill:none;stroke:currentColor;stroke-width:1.4}
.fig-${KEY} .ft-brbg{fill:var(--surface2)}.fig-${KEY} .ft-sm{font-size:16px;font-weight:600}.fig-${KEY} .ft-let{font-weight:700;font-size:19px}
.fig-${KEY} .ft-rg{font-size:16px}.fig-${KEY} .ft-read{font-size:16px;font-weight:700}.fig-${KEY} .ft-readbg{fill:color-mix(in srgb,var(--app) 32%,transparent);stroke:var(--app);stroke-width:1.2}`,
};
