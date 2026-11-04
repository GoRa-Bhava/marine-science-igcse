/* ---------- FEATURE AND RESULT TABLES (0697 3.3/LO3, 3.4/LO4, 4.1/LO2) ----------
   Panel A: a colour photograph of a marine invertebrate + a "feature: present or absent?" table to complete (tap the cells),
   then its invertebrate group (3.4/LO4 features only), its domain (3.3/LO3: Bacteria, Archaea, Eukarya) and the feature
   that tells it apart from another group. Panel B: a food-test results table (4.1/LO2: iodine, Benedict's, biuret,
   ethanol emulsion) — which substances are present, a positive colour that is NOT shown in the table, and a method or
   safety step. Feature truth values follow the syllabus lists exactly; features that are ambiguous for a group (e.g. a
   crustacean's segments, a mollusc's "soft body", an echinoderm's "shell") are never asked for that group. */
import { rng, pickR, shuffleR, pickMixed, FIG_IMG } from "../core.js";

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

/* organisms: a colour photograph each (public/figdata-img/fd-<img>.webp). Every feature row is answered from the
   organism's GROUP, so features too small to see in a photograph (stinging cells, a crab's second pair of antennae)
   are still fair. Organisms that would mislead are left out: scallop (visible simple eyes), cup coral (stony skeleton),
   hermit crab (borrowed shell), chiton (plates look segmented), squid (internal shell), sea cucumber. */
const ORGS = [
  { name: "crab", group: "crustaceans", img: "crab" },
  { name: "shrimp", group: "crustaceans", img: "shrimp" },
  { name: "lobster", group: "crustaceans", img: "lobster" },
  { name: "jellyfish", group: "cnidarians", img: "jellyfish" },
  { name: "sea anemone", group: "cnidarians", img: "sea-anemone" },
  { name: "starfish", group: "echinoderms", img: "starfish" },
  { name: "sea urchin", group: "echinoderms", img: "sea-urchin" },
  { name: "brittle star", group: "echinoderms", img: "brittle-star" },
  { name: "sea snail", group: "molluscs", img: "sea-snail" },
  { name: "mussel", group: "molluscs", img: "mussel" },
  { name: "limpet", group: "molluscs", img: "limpet" },
  { name: "ragworm", group: "annelids", img: "ragworm" },
  { name: "bristle worm", group: "annelids", img: "bristle-worm" },
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
  let h = `<div class="fig-${KEY}"><div class="fd-wrap"><img class="fd-photo" src="${FIG_IMG}fd-${F.org.img}.webp" width="720" height="720" alt="Photograph of a marine invertebrate" draggable="false"><p class="fd-cap">Photograph of a marine invertebrate (not to scale)</p></div>`;
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
  qs.push({ kind: "tap", multi: true, q: `Look at the photograph and the table. Use what you know about this organism's group to complete the table: tap <b>present</b> or <b>absent</b> in each empty row.`, a: blankAns, hint: "Tap one answer in each of the three empty rows.",
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
  css: `.fig-${KEY} .fd-wrap{text-align:center;margin-bottom:8px}.fig-${KEY} .fd-photo{display:block;width:100%;max-width:320px;height:auto;aspect-ratio:1;margin:0 auto;border-radius:10px;background:#8a8f93;-webkit-user-select:none;user-select:none}.fig-${KEY} .fd-cap{margin:2px 0 8px;font-size:13px;color:var(--soft)}.fig-${KEY} .ftable th{text-align:left}.fig-${KEY} .fd-opt{cursor:pointer;min-width:70px}.fig-${KEY} .fd-given{font-weight:700}.fig-${KEY} .fd-right{font-weight:800}.fig-${KEY} tr.hl th,.fig-${KEY} tr.hl td{background:color-mix(in srgb,var(--app) 28%,transparent)}`,
};
