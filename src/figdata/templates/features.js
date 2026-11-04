/* ---------- FEATURE AND RESULT TABLES (0697 3.3/LO3, 3.4/LO4, 4.1/LO2) ----------
   Panel A: a line drawing of a marine invertebrate + a "feature: present or absent?" table to complete (tap the cells),
   then its invertebrate group (3.4/LO4 features only), its domain (3.3/LO3: Bacteria, Archaea, Eukarya) and the feature
   that tells it apart from another group. Panel B: a food-test results table (4.1/LO2: iodine, Benedict's, biuret,
   ethanol emulsion) — which substances are present, a positive colour that is NOT shown in the table, and a method or
   safety step. Feature truth values follow the syllabus lists exactly; features that are ambiguous for a group (e.g. a
   crustacean's segments, a mollusc's "soft body", an echinoderm's "shell") are never asked for that group. */
import { rng, pickR, shuffleR, pickMixed } from "../core.js";

const KEY = "features";
const FEAT = { bilat: "bilateral symmetry", radial: "radial symmetry", penta: "pentaradial symmetry (body in five parts)", exo: "exoskeleton", eyes: "compound eyes", ant: "two pairs of antennae",
  legs: "jointed legs", tent: "tentacles with stinging cells", tube: "tube feet", spiny: "spiny skin", seg: "segmented body", unseg: "unsegmented body", setae: "setae (bristles)", shell: "a shell (internal or external)", soft: "soft body" };
// truth per group: true = has it, false = does not; missing = not asked (ambiguous)
const GROUPS = {
  crustaceans: { has: ["bilat", "exo", "eyes", "ant", "legs"], not: ["radial", "penta", "tent", "tube", "setae", "shell"] },
  cnidarians: { has: ["radial", "tent"], not: ["bilat", "penta", "exo", "eyes", "ant", "legs", "tube", "setae", "shell"] },
  echinoderms: { has: ["penta", "spiny", "tube"], not: ["bilat", "exo", "eyes", "ant", "legs", "tent", "setae"] },
  molluscs: { has: ["bilat", "unseg", "shell"], not: ["radial", "penta", "exo", "eyes", "ant", "legs", "tube", "setae", "seg"] },
  annelids: { has: ["bilat", "seg", "soft", "setae"], not: ["radial", "penta", "exo", "eyes", "ant", "legs", "tent", "tube", "unseg", "shell"] },
};
const UNIQUE = { crustaceans: ["exo", "eyes", "ant", "legs"], cnidarians: ["radial", "tent"], echinoderms: ["penta", "spiny", "tube"], molluscs: ["shell", "unseg"], annelids: ["seg", "setae", "soft"] };
const truth = (g, f) => (GROUPS[g].has.includes(f) ? true : GROUPS[g].not.includes(f) ? false : null);

const S = 'class="fd-l"';
const ORGS = [
  { name: "crab", group: "crustaceans", draw: () => {
    let s = `<ellipse cx="110" cy="92" rx="46" ry="30" ${S}/>`;
    for (let i = 0; i < 4; i++) { const y = 92 + (i - 1.5) * 12; s += `<polyline points="${68},${y} ${46 - i * 2},${y - 14 + i * 6} ${30 - i * 3},${y + 10 + i * 4}" ${S}/><polyline points="${152},${y} ${174 + i * 2},${y - 14 + i * 6} ${190 + i * 3},${y + 10 + i * 4}" ${S}/>`; }
    s += `<polyline points="86,66 70,44 62,30" ${S}/><path d="M62 30 q-14 -6 -10 -16 q10 4 14 10 M62 30 q4 -12 14 -10" ${S}/><polyline points="134,66 150,44 158,30" ${S}/><path d="M158 30 q14 -6 10 -16 q-10 4 -14 10 M158 30 q-4 -12 -14 -10" ${S}/>`;
    s += `<line x1="102" y1="64" x2="98" y2="52" ${S}/><circle cx="98" cy="50" r="3" ${S}/><line x1="118" y1="64" x2="122" y2="52" ${S}/><circle cx="122" cy="50" r="3" ${S}/><path d="M104 62 q-6 -18 -16 -24 M116 62 q6 -18 16 -24 M106 62 q-2 -10 -8 -16 M114 62 q2 -10 8 -16" ${S}/>`;
    return s; } },
  { name: "shrimp", group: "crustaceans", draw: () => {
    let s = `<path d="M48 70 q20 -26 60 -22 q46 4 58 34 q6 22 -12 38" ${S}/><path d="M48 70 q22 6 60 2 q36 -2 50 22 q4 14 -6 26" ${S}/>`;
    for (let i = 0; i < 6; i++) { const t = i / 6, x = 96 + t * 62, y = 48 + Math.sin(t * 2.6) * 30; s += `<line x1="${x}" y1="${y + 2}" x2="${x - 6}" y2="${y + 24}" ${S}/>`; }
    s += `<path d="M154 120 l14 10 l-6 -16 z M154 120 l-4 16 l-8 -12 z" ${S}/><circle cx="56" cy="62" r="3" ${S}/><path d="M48 66 q-30 -20 -40 -50 M50 64 q-24 -34 -20 -58 M48 70 q-26 0 -40 12 M48 72 q-20 8 -30 24" ${S}/>`;
    for (let i = 0; i < 5; i++) s += `<polyline points="${70 + i * 10},76 ${66 + i * 10},96 ${72 + i * 10},104" ${S}/>`;
    return s; } },
  { name: "jellyfish", group: "cnidarians", draw: () => {
    let s = `<path d="M50 80 q60 -90 120 0 q-15 8 -30 0 q-15 8 -30 0 q-15 8 -30 0 q-15 8 -30 0 z" ${S}/>`;
    for (let i = 0; i < 7; i++) { const x = 58 + i * 17; s += `<path d="M${x} 84 q8 18 0 34 q-8 16 0 30" ${S}/>`; }
    s += `<path d="M100 84 q-6 30 6 58 M120 84 q8 28 -4 56" class="fd-l fd-thick"/>`; return s; } },
  { name: "sea anemone", group: "cnidarians", draw: () => {
    let s = `<path d="M80 150 L84 84 Q110 74 136 84 L140 150 Z" ${S}/><ellipse cx="110" cy="84" rx="26" ry="7" ${S}/>`;
    for (let i = 0; i < 13; i++) { const a = Math.PI * (0.08 + 0.84 * i / 12), x = 110 - Math.cos(a) * 26, y = 82; s += `<path d="M${x.toFixed(1)} ${y} q${(-Math.cos(a) * 30).toFixed(1)} ${(-30 - Math.sin(a) * 10).toFixed(1)} ${(-Math.cos(a) * 40).toFixed(1)} ${(-58 * Math.sin(a) - 4).toFixed(1)}" ${S}/>`; }
    return s; } },
  { name: "starfish", group: "echinoderms", draw: () => {
    const pts = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr = i % 2 ? 22 : 62; pts.push(`${(110 + Math.cos(a) * rr).toFixed(1)},${(88 + Math.sin(a) * rr).toFixed(1)}`); }
    let s = `<polygon points="${pts.join(" ")}" ${S}/>`;
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; for (let k = 1; k <= 4; k++) { const rr = 10 + k * 11; s += `<circle cx="${(110 + Math.cos(a) * rr).toFixed(1)}" cy="${(88 + Math.sin(a) * rr).toFixed(1)}" r="1.8" class="fd-dot"/>`; } }
    return s; } },
  { name: "sea urchin", group: "echinoderms", draw: () => {
    let s = `<circle cx="110" cy="88" r="34" ${S}/>`;
    for (let i = 0; i < 36; i++) { const a = i * Math.PI / 18, r1 = 34, r2 = i % 2 ? 60 : 54; s += `<line x1="${(110 + Math.cos(a) * r1).toFixed(1)}" y1="${(88 + Math.sin(a) * r1).toFixed(1)}" x2="${(110 + Math.cos(a) * r2).toFixed(1)}" y2="${(88 + Math.sin(a) * r2).toFixed(1)}" ${S}/>`; }
    for (let i = 0; i < 5; i++) { const a = -Math.PI / 2 + i * 2 * Math.PI / 5; s += `<line x1="110" y1="88" x2="${(110 + Math.cos(a) * 30).toFixed(1)}" y2="${(88 + Math.sin(a) * 30).toFixed(1)}" class="fd-l fd-thin"/>`; }
    return s; } },
  { name: "sea snail", group: "molluscs", draw: () => {
    let d = "M110 86"; for (let i = 1; i <= 60; i++) { const a = i * 0.32, rr = 3 + i * 0.75; d += ` L${(110 + Math.cos(a) * rr).toFixed(1)} ${(86 + Math.sin(a) * rr * 0.9).toFixed(1)}`; }
    return `<path d="${d}" ${S}/><path d="M64 120 q46 14 116 4 q6 -4 0 -8 q-40 -2 -70 -6" ${S}/><path d="M166 118 q14 -16 18 -34 M170 118 q20 -10 28 -24" ${S}/>`; } },
  { name: "mussel", group: "molluscs", draw: () => {
    let s = `<path d="M40 120 Q60 40 170 50 Q190 70 170 90 Q110 130 40 120 Z" ${S}/>`;
    for (let k = 1; k <= 4; k++) { const f = 1 - k * 0.18; s += `<path d="M${40 + 10 * k} ${120 - 2 * k} Q${60 + 8 * k} ${40 + 14 * k} ${170 - 18 * k} ${50 + 9 * k}" class="fd-l fd-thin"/>`; void f; }
    return s + `<path d="M40 120 q30 6 64 -4" ${S}/>`; } },
  { name: "ragworm", group: "annelids", draw: () => {
    const pts = []; for (let i = 0; i <= 40; i++) { const x = 20 + i * 4.6; pts.push([x, 88 + Math.sin(i / 5) * 16]); }
    let s = `<polyline points="${pts.map((p) => `${p[0].toFixed(1)},${(p[1] - 7).toFixed(1)}`).join(" ")}" ${S}/><polyline points="${pts.map((p) => `${p[0].toFixed(1)},${(p[1] + 7).toFixed(1)}`).join(" ")}" ${S}/>`;
    for (let i = 1; i < 40; i += 2) { const [x, y] = pts[i]; s += `<line x1="${x.toFixed(1)}" y1="${(y - 7).toFixed(1)}" x2="${x.toFixed(1)}" y2="${(y + 7).toFixed(1)}" class="fd-l fd-thin"/><path d="M${x.toFixed(1)} ${(y - 7).toFixed(1)} l-3 -7 M${x.toFixed(1)} ${(y - 7).toFixed(1)} l3 -7 M${x.toFixed(1)} ${(y + 7).toFixed(1)} l-3 7 M${x.toFixed(1)} ${(y + 7).toFixed(1)} l3 7" class="fd-l fd-thin"/>`; }
    return s + `<path d="M20 81 q-8 -4 -12 -12 M20 81 q-10 2 -14 -4" ${S}/>`; } },
];

const TESTS = [
  { id: "starch", sub: "starch", test: "iodine solution", start: "orange-brown", pos: "blue-black" },
  { id: "sugar", sub: "reducing sugar", test: "Benedict's solution", start: "blue", pos: "brick-red" },
  { id: "protein", sub: "protein", test: "biuret solution", start: "blue", pos: "lilac (purple)" },
  { id: "lipid", sub: "lipid (fats and oils)", test: "ethanol, then water", start: "colourless", pos: "cloudy white emulsion" },
];
const SAMPLES = ["a fish-food pellet", "an unknown food sample", "a sample of ground-up feed from a fish farm", "a sample of shrimp feed", "a mixed food sample"];

function make(seed) {
  const r = rng(seed), org = pickR(r, ORGS), g = org.group;
  // feature rows: 3 the organism has (≥1 unique to its group) + 2 it lacks
  for (let t = 0; t < 200; t++) {
    const rr = rng(seed + t * 4099 + 7);
    const has = shuffleR(rr, GROUPS[g].has), not = shuffleR(rr, GROUPS[g].not);
    const tr = has.slice(0, Math.min(3, has.length)); if (!tr.some((f) => UNIQUE[g].includes(f))) continue;
    const rows = shuffleR(rr, [...tr.map((f) => [f, true]), ...not.slice(0, 5 - tr.length).map((f) => [f, false])]);
    // the group must be the only one consistent with all five rows
    const fits = Object.keys(GROUPS).filter((h) => rows.every(([f, v]) => truth(h, f) === null || truth(h, f) === v));
    if (fits.length !== 1) continue;
    // two rows are filled in already (one present, one absent); three are blank
    const fT = rows.findIndex((x) => x[1]), fF = rows.findIndex((x) => !x[1]);
    const filled = [fT, fF]; const blanks = rows.map((_, i) => i).filter((i) => !filled.includes(i));
    // a second group to tell it apart from, and a food sample with 1–3 substances present
    const g2 = pickR(rr, Object.keys(GROUPS).filter((h) => h !== g));
    const disc = UNIQUE[g].filter((f) => truth(g2, f) === false), sameAll = Object.keys(FEAT).filter((f) => truth(g, f) !== null && truth(g, f) === truth(g2, f));
    const bothHave = shuffleR(rr, sameAll.filter((f) => truth(g, f))), neither = shuffleR(rr, sameAll.filter((f) => !truth(g, f))), same = [...bothHave.slice(0, 1), ...neither].slice(0, 3);
    if (!disc.length || same.length < 3) continue;
    const nPos = 1 + Math.floor(rr() * 3), present = shuffleR(rr, TESTS.map((x) => x.id)).slice(0, nPos);
    return { kind: KEY, seed, org, g, rows, filled, blanks, g2, disc: pickR(rr, disc), same, present, sample: pickR(rr, SAMPLES) };
  }
  return make(seed + 1);
}

function svg(F, opt) {
  opt = opt || {}; const panel = opt.panel || "class", hl = opt.hl || {};
  if (panel === "food") {
    let h = `<div class="fig-${KEY}"><p class="fd-cap">Food tests on ${F.sample}</p><table class="ftable"><thead><tr><th>test</th><th>colour at the start</th><th>colour at the end</th></tr></thead><tbody>`;
    TESTS.forEach((T) => { const pos = F.present.includes(T.id);
      h += `<tr${hl.rows && hl.rows.includes(T.id) ? ' class="hl"' : ""}><th scope="row">${T.test}</th><td>${T.start}</td><td>${pos ? T.pos : `stays ${T.start}`}</td></tr>`; });
    return h + `</tbody></table></div>`;
  }
  const done = !!opt.reveal;
  let h = `<div class="fig-${KEY}"><div class="fd-wrap"><svg viewBox="0 0 220 165" class="figsvg fd-draw" role="img" aria-label="Line drawing of a marine invertebrate">${F.org.draw()}</svg><p class="fd-cap">A marine invertebrate (not to scale)</p></div>`;
  h += `<table class="ftable"><thead><tr><th>feature</th><th colspan="2">present or absent?</th></tr></thead><tbody>`;
  F.rows.forEach(([f, v], i) => {
    h += `<tr><th scope="row">${FEAT[f]}</th>`;
    if (F.filled.includes(i)) h += `<td colspan="2" class="fd-given">${v ? "present" : "absent"}</td>`;
    else h += `<td data-tap="b${i}p" class="fd-opt${done && v ? " fd-right" : ""}">present</td><td data-tap="b${i}a" class="fd-opt${done && !v ? " fd-right" : ""}">absent</td>`;
    h += `</tr>`;
  });
  return h + `</tbody></table></div>`;
}

function questions(F, r) {
  const qs = [], G = F.g, cls = { panel: "class" }, food = { panel: "food" }, gName = (g) => g;
  const blankAns = F.blanks.map((i) => `b${i}${F.rows[i][1] ? "p" : "a"}`);
  // 1. complete the table (tap present/absent in each blank row)
  qs.push({ kind: "tap", multi: true, q: `Look at the drawing and the table. Complete the table for this organism: tap <b>present</b> or <b>absent</b> in each empty row.`, a: blankAns, hint: "Tap one answer in each of the three empty rows.",
    ansTxt: F.blanks.map((i) => `${FEAT[F.rows[i][0]]}: ${F.rows[i][1] ? "present" : "absent"}`).join("; "),
    labelOf: (id) => { const i = +id.slice(1, -1); return `${FEAT[F.rows[i][0]]} ${id.endsWith("p") ? "present" : "absent"}`; },
    askOpt: cls, doneOpt: () => ({ panel: "class", reveal: true }),
    why: `This organism is a ${F.org.name}, one of the <b>${G}</b>. The syllabus features of ${G} are: ${GROUPS[G].has.map((f) => FEAT[f]).join(", ")}. So: ${F.blanks.map((i) => `${FEAT[F.rows[i][0]]} — ${F.rows[i][1] ? "present" : "absent"}`).join("; ")}.` });
  // 2. which group
  const others = shuffleR(r, Object.keys(GROUPS).filter((h) => h !== G));
  const gopts = [G, ...(G === "crustaceans" ? ["annelids", ...others.filter((h) => h !== "annelids")] : others)].slice(0, 4);
  qs.push({ kind: "choice", q: "Use the completed table. Which group of invertebrates does this organism belong to?", options: gopts.map(gName), a: 0, askOpt: cls, doneOpt: () => ({ panel: "class", reveal: true }),
    why: `${F.rows.filter((x) => x[1]).map((x) => FEAT[x[0]]).join(", ")} — together these are features of the <b>${G}</b>. ${G === "crustaceans" ? "Annelids are segmented too, but they have soft bodies and setae, not an exoskeleton and jointed legs." : ""}`.trim() });
  // 3. domain (examiner-report misconceptions as distractors)
  qs.push({ kind: "choice", q: "Which domain does this organism belong to?", options: ["Eukarya", ...shuffleR(r, ["Bacteria", "Archaea", "Animals", "Invertebrates"]).slice(0, 3)], a: 0, askOpt: cls,
    why: "The three domains are Bacteria, Archaea and <b>Eukarya</b>. All animals — invertebrates included — have cells with a nucleus, so they are in the domain Eukarya. \"Animals\" is a kingdom, and \"invertebrates\" is not a classification group at that level." });
  // 4. feature that tells it apart from a second group
  qs.push({ kind: "choice", q: `Which feature would tell this organism apart from one of the <b>${F.g2}</b>?`, options: [FEAT[F.disc], ...F.same.map((f) => FEAT[f])], a: 0, askOpt: cls,
    why: `${FEAT[F.disc][0].toUpperCase() + FEAT[F.disc].slice(1)}: ${G} have it and ${F.g2} do not. The other features are the same for both groups (${F.same.map((f) => `${FEAT[f]} — ${truth(G, f) ? "both have it" : "neither has it"}`).join("; ")}), so they cannot tell them apart.` });
  // 5. which substances are present (food tests)
  const st = TESTS.map((T) => [T.sub[0].toUpperCase() + T.sub.slice(1), F.present.includes(T.id), F.present.includes(T.id) ? `the ${T.test.split(",")[0]} test turned ${T.pos}.` : `the ${T.test.split(",")[0]} test stayed ${T.start}, so it is absent.`]);
  qs.push({ kind: "multi", q: `Use the food-test results. Tick every substance present in ${F.sample}.`, options: st.map((s) => s[0]), a: st.map((s, i) => (s[1] ? i : -1)).filter((i) => i >= 0), askOpt: food, doneOpt: () => ({ panel: "food", hl: { rows: F.present } }),
    why: st.map((s) => `${s[1] ? "✓" : "✗"} ${s[0]} — ${s[2]}`).join("<br>") });
  // 6. a positive colour that the table does NOT show (a negative test in this sample), with cross-wired colours as distractors
  const neg = TESTS.filter((T) => !F.present.includes(T.id)), T6 = pickR(r, neg);
  qs.push({ kind: "choice", q: `The sample gave a negative result with ${T6.test.split(",")[0]}. What colour would it have turned if ${T6.sub} <b>had</b> been present?`, options: [T6.pos, ...TESTS.filter((x) => x.id !== T6.id).map((x) => x.pos)], a: 0, askOpt: food,
    why: `A positive ${T6.test.split(",")[0]} test gives <b>${T6.pos}</b>. The other colours belong to the other tests: ${TESTS.filter((x) => x.id !== T6.id).map((x) => `${x.pos} (${x.sub})`).join(", ")}.` });
  // 7. a method or safety step
  if (r() < 0.5) qs.push({ kind: "choice", q: "Which step is needed for the Benedict's test to work?", a: 0, askOpt: food,
    options: ["Heat the mixture in a hot water bath", "Leave the mixture to stand in a cold place", "Shake the sample with ethanol, then add water", "Add the solution until the sample turns blue-black"],
    why: "Benedict's solution only changes colour when the mixture is <b>heated in a water bath</b>. Shaking with ethanol is the lipid test, and blue-black is a positive iodine test." });
  else qs.push({ kind: "choice", q: "Why must the ethanol emulsion test be carried out well away from any naked flame?", a: 0, askOpt: food,
    options: ["Ethanol is flammable", "Ethanol turns blue-black when heated", "The emulsion only forms in the dark", "Heat breaks down the lipid in the sample"],
    why: "Ethanol is <b>flammable</b>, so it must be kept away from naked flames. The test itself needs no heating: dissolve the sample in ethanol, then add water and look for a cloudy white emulsion." });
  return qs;
}

function selfTest(F, qs) {
  const bad = [];
  F.rows.forEach(([f, v]) => { if (truth(F.g, f) !== v) bad.push("row truth " + f); });
  const fits = Object.keys(GROUPS).filter((h) => F.rows.every(([f, v]) => truth(h, f) === null || truth(h, f) === v));
  if (fits.length !== 1 || fits[0] !== F.g) bad.push("group not unique " + fits.join(","));
  if (truth(F.g2, F.disc) !== false || truth(F.g, F.disc) !== true) bad.push("disc feature");
  F.same.forEach((f) => { if (truth(F.g, f) !== truth(F.g2, f) || truth(F.g, f) === null) bad.push("same feature " + f); });
  if (F.present.length < 1 || F.present.length > 3) bad.push("present count");
  const q6 = qs[5]; if (F.present.some((id) => TESTS.find((t) => t.id === id).pos === q6.options[0])) bad.push("q6 colour visible in table");
  return bad;
}

export default {
  key: KEY, group: "Tables and fieldwork", name: "Feature and food-test tables", topics: "Unit 3 (3.3–3.4) and Unit 4 (4.1)", html: true, noZoom: true, thumbSeed: 4,
  ctx: () => "a marine invertebrate to classify, and food-test results",
  blurb: "Complete a present-or-absent feature table for a marine invertebrate, classify it, then read a table of food-test results.",
  tips: ["Crustaceans: bilateral symmetry, exoskeleton, compound eyes, two pairs of antennae, jointed legs.", "Cnidaria: radial symmetry, tentacles with stinging cells. Echinoderms: pentaradial symmetry, spiny skin, tube feet.", "Molluscs: bilateral symmetry, unsegmented body, a shell. Annelids: bilateral symmetry, segmented, soft body, setae.", "The three domains are Bacteria, Archaea and Eukarya. All animals are Eukarya.", "Food tests: iodine → blue-black (starch); Benedict's, heated → brick-red (reducing sugar); biuret → lilac (protein); ethanol then water → cloudy white emulsion (lipid)."],
  make, svg, questions, selfTest,
  css: `.fig-${KEY} .fd-wrap{text-align:center;margin-bottom:8px}.fig-${KEY} .fd-draw{max-width:300px;margin:0 auto;display:block}.fig-${KEY} .fd-l{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round;stroke-linejoin:round}.fig-${KEY} .fd-thin{stroke-width:1.2}.fig-${KEY} .fd-thick{stroke-width:3}.fig-${KEY} .fd-dot{fill:currentColor}.fig-${KEY} .fd-cap{margin:2px 0 8px;font-size:13px;color:var(--soft)}.fig-${KEY} .ftable th{text-align:left}.fig-${KEY} .fd-opt{cursor:pointer;min-width:70px}.fig-${KEY} .fd-given{font-weight:700}.fig-${KEY} .fd-right{font-weight:800}.fig-${KEY} tr.hl th,.fig-${KEY} tr.hl td{background:color-mix(in srgb,var(--app) 28%,transparent)}`,
};
