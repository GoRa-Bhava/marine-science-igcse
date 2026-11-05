/* ---------- LABEL THE PARTS (0697 3.1/LO1–LO4 cells; 3.4/LO3 bony fish; 3.5/LO1–LO4 seagrass, kelp, dinoflagellate,
   diatom; 5.7/LO2–LO3 coral polyp) ----------
   Nine colour diagrams made for this app (public/figdata-img/lp-<id>.webp, square, no text in the image). The app draws
   the label lines and letters, and the tap areas, from the part maps below (coordinates in a 1024 × 1024 frame).
   Only structures named in the 2027–29 syllabus lists are asked about. Visible extras (the DNA loop and flagellum of the
   bacterium, the plates of the dinoflagellate) can be tapped as wrong answers but are never asked for.
   Questions: tap a named structure; name the structure on a label line; the function of a labelled structure; a
   comparison (cells) or the kingdom (other organisms); the features that identify the organism. */
import { rng, pickR, shuffleR, pickMixed, FIG_IMG } from "../core.js";

const KEY = "labelparts";
// shapes: ["e", cx, cy, rx, ry, rotDeg] ellipse, ["r", x0, y0, x1, y1] rectangle, ["p", [[x, y], ...]] polygon
const ORGS = [
  { id: "fish", name: "a bony fish", ref: "3.4/LO3", kingdom: null, caption: "a bony fish (side view)",
    parts: [
      { id: "dorsal", name: "dorsal fin", noFn: true, fn: "Controlling pitching, rolling and yawing, and changes of direction", at: [520, 285], tap: [["p", [[285, 325], [330, 235], [450, 245], [600, 315], [775, 455], [700, 445], [560, 375], [400, 335]]]] },
      { id: "pectoral", name: "pectoral fin", noFn: true, fn: "Controlling pitching, rolling and yawing, and changes of direction", at: [420, 540], tap: [["p", [[300, 560], [380, 500], [515, 495], [470, 565], [330, 605]]]] },
      { id: "pelvic", name: "pelvic fin", noFn: true, fn: "Controlling pitching, rolling and yawing, and changes of direction", at: [360, 725], tap: [["p", [[300, 665], [400, 665], [425, 800], [345, 745]]]] },
      { id: "anal", name: "anal fin", noFn: true, fn: "Controlling pitching, rolling and yawing, and changes of direction", at: [690, 640], tap: [["p", [[580, 675], [650, 595], [780, 565], [705, 645], [665, 720]]]] },
      { id: "caudal", name: "caudal fin", fn: "Giving forward thrust", at: [925, 510], tap: [["p", [[825, 470], [1015, 355], [955, 510], [1015, 660], [825, 560]]]] },
      { id: "operculum", name: "operculum", fn: "Covering and protecting the gills", at: [252, 455], tap: [["p", [[195, 430], [272, 410], [290, 560], [262, 655], [195, 625], [215, 520]]]] },
      { id: "scales", name: "scales", base: true, fn: "Protecting the body", at: [450, 385], tap: [["p", [[290, 330], [556, 342], [773, 440], [822, 467], [822, 554], [664, 636], [447, 680], [290, 665]]]] },
      { id: "lateral", name: "lateral line", fn: "Detecting vibrations in the water", at: [560, 448], tap: null },
      { id: "nares", name: "nares", fn: "Detecting chemicals in the water", at: [76, 492], tap: null },
    ] },
  { id: "animalcell", cellScale: true, name: "an animal cell", ref: "3.1/LO3", cell: "animal", caption: "an animal cell",
    parts: [
      { id: "membrane", name: "cell membrane", fn: "Controlling what enters and leaves the cell", at: [22, 520], tap: null },
      { id: "nucleus", name: "nucleus", fn: "Containing the genetic material and controlling the cell", at: [560, 630], tap: [["e", 527, 503, 165, 165, 0]] },
      { id: "cytoplasm", name: "cytoplasm", base: true, fn: "Providing the place where most chemical reactions happen", at: [880, 310], tap: [["e", 512, 512, 470, 465, 0]] },
      { id: "mito", name: "mitochondrion", fn: "Releasing energy by aerobic respiration", at: [312, 228], tap: [["e", 312, 228, 105, 58, -32], ["e", 716, 213, 115, 58, 18], ["e", 138, 505, 55, 112, 22], ["e", 862, 505, 55, 112, 22], ["e", 288, 765, 112, 58, 22], ["e", 688, 800, 115, 58, -20]] },
    ] },
  { id: "plantcell", cellScale: true, name: "a plant cell", ref: "3.1/LO3", cell: "plant", caption: "a plant cell from a leaf",
    parts: [
      { id: "wall", name: "cell wall", fn: "Supporting the cell and stopping it bursting", at: [22, 560], tap: [["r", -30, 300, 29, 800], ["r", 250, 970, 800, 1030], ["r", 250, -20, 800, 40], ["r", 991, 250, 1050, 800]] },
      { id: "membrane", name: "cell membrane", fn: "Controlling what enters and leaves the cell", at: [41, 380], tap: null },
      { id: "vacuole", name: "vacuole", fn: "Storing water and dissolved substances (cell sap)", at: [470, 500], tap: [["e", 470, 500, 280, 270, 0]] },
      { id: "nucleus", name: "nucleus", fn: "Containing the genetic material and controlling the cell", at: [866, 337], tap: [["e", 866, 337, 92, 92, 0]] },
      { id: "chloro", name: "chloroplast", fn: "Absorbing light for photosynthesis", at: [522, 123], tap: [["e", 242, 135, 92, 48, 0], ["e", 522, 123, 102, 45, 0], ["e", 808, 150, 102, 50, 0], ["e", 103, 407, 52, 80, 0], ["e", 98, 657, 48, 85, 0], ["e", 878, 540, 85, 65, 0], ["e", 870, 712, 85, 62, 0], ["e", 170, 855, 80, 55, 0], ["e", 530, 875, 102, 52, 0]] },
      { id: "mito", name: "mitochondrion", fn: "Releasing energy by aerobic respiration", at: [727, 862], tap: [["e", 128, 245, 62, 40, -25], ["e", 355, 885, 60, 38, 15], ["e", 727, 862, 62, 40, -15]] },
      { id: "cytoplasm", name: "cytoplasm", base: true, fn: "Providing the place where most chemical reactions happen", at: [890, 880], tap: [["e", 512, 512, 460, 460, 0]] },
    ] },
  { id: "bacterium", cellScale: true, name: "a bacterial cell", ref: "3.1/LO3", cell: "bacterium", caption: "a bacterial cell",
    parts: [
      { id: "wall", name: "cell wall", fn: "Supporting the cell and giving it its shape", at: [400, 378], tap: [["r", 150, 636, 650, 690], ["r", 150, 340, 650, 391]] },
      { id: "membrane", name: "cell membrane", fn: "Controlling what enters and leaves the cell", at: [470, 627], tap: null },
      { id: "cytoplasm", name: "cytoplasm", base: true, fn: "Providing the place where most chemical reactions happen", at: [120, 512], tap: [["e", 382, 514, 330, 104, 0]] },
      { id: "dna", name: "loop of DNA", fn: null, extra: true, at: [380, 440], tap: [["p", [[170, 470], [260, 440], [390, 455], [520, 440], [585, 500], [520, 560], [390, 585], [230, 575], [175, 520]]]] },
      { id: "flag", name: "flagellum", fn: null, extra: true, at: [900, 470], tap: [["p", [[750, 490], [880, 470], [1010, 430], [990, 470], [870, 530], [760, 530]]]] },
    ] },
  { id: "coral", name: "a coral polyp", ref: "5.7/LO2", kingdom: "animal", caption: "a coral polyp, cut open (inset: part of a tentacle, magnified)",
    parts: [
      { id: "tentacle", name: "tentacle", base: true, noTapAsk: true, fn: "Catching food and moving it to the mouth", at: [300, 200], tap: [["p", [[20, 470], [40, 320], [170, 240], [250, 150], [430, 150], [560, 200], [640, 300], [680, 470], [560, 450], [450, 440], [250, 440], [140, 470]]]] },
      { id: "stinging", name: "stinging cell", fn: "Stinging and paralysing prey, and defending the polyp", at: [770, 250], tap: [["e", 825, 270, 150, 95, -15]] },
      { id: "mouth", name: "mouth", fn: "Taking in food and passing out waste", at: [352, 412], tap: [["e", 352, 410, 60, 34, 0]] },
      { id: "stomach", name: "stomach", fn: "Digesting the food", at: [330, 760], tap: [["e", 330, 750, 115, 110, 0]] },
      { id: "skeleton", name: "calcium carbonate skeleton", fn: "Supporting and protecting the polyp, and building the reef", at: [110, 820], tap: [["e", 105, 790, 38, 130, -4], ["e", 565, 780, 40, 130, 4], ["e", 330, 965, 220, 26, 0]] },
    ] },
  { id: "kelp", name: "kelp", ref: "3.5/LO2", kingdom: "protoctist", caption: "a young kelp attached to a rock",
    parts: [
      { id: "blade", name: "blade", fn: "Absorbing light for photosynthesis over a large, flat surface", at: [190, 200], tap: [["e", 180, 205, 95, 55, 38], ["e", 470, 120, 55, 95, -35], ["e", 805, 280, 120, 45, -15], ["e", 780, 430, 115, 40, -10], ["e", 165, 400, 95, 40, 10], ["e", 528, 298, 125, 40, -35], ["e", 191, 538, 120, 38, -8], ["e", 741, 565, 125, 42, 5]] },
      { id: "bladder", name: "gas bladder", fn: "Floating the blades up towards the light", at: [296, 447], tap: [["e", 400, 241, 45, 45, 0], ["e", 278, 318, 45, 45, 0], ["e", 422, 382, 45, 45, 0], ["e", 296, 447, 45, 45, 0], ["e", 320, 568, 45, 45, 0], ["e", 676, 348, 45, 45, 0], ["e", 632, 470, 45, 45, 0], ["e", 592, 587, 45, 45, 0]] },
      { id: "stipe", name: "stipe", fn: "Acting as a stem from which the blades develop", at: [458, 770], tap: [["e", 456, 770, 34, 105, -4]] },
      { id: "holdfast", name: "holdfast", fn: "Anchoring the kelp to the rock", at: [470, 915], tap: [["e", 468, 918, 100, 48, 0]] },
    ] },
  { id: "seagrass", name: "a seagrass", ref: "3.5/LO1", kingdom: "plant", caption: "seagrass, with the seabed cut away",
    parts: [
      { id: "leaf", name: "leaf", fn: "Carrying out photosynthesis", at: [200, 280], base: true, tap: [["r", 0, 80, 330, 620], ["r", 345, 70, 650, 620], ["r", 680, 80, 1024, 620]] },
      { id: "flower", name: "flower", fn: "Carrying out sexual reproduction", at: [540, 415], tap: [["e", 540, 415, 60, 58, 0]] },
      { id: "rhizome", name: "rhizome", fn: "Connecting the plants and allowing asexual reproduction", at: [330, 752], tap: [["r", 215, 728, 440, 778], ["r", 525, 728, 760, 778]] },
      { id: "root", name: "root", fn: "Securing the plant in the sediment and taking in minerals", at: [170, 880], tap: [["e", 170, 875, 80, 75, 0], ["e", 488, 875, 80, 75, 0], ["e", 808, 875, 80, 75, 0]] },
    ] },
  { id: "dino", cellScale: true, noNames: ["cell wall"], name: "a dinoflagellate", ref: "3.5/LO3", kingdom: "protoctist", caption: "a dinoflagellate, seen through a microscope",
    parts: [
      { id: "flagella", name: "flagellum", fn: "Moving the cell through the water", at: [612, 902], tap: [["r", 200, 370, 820, 425], ["p", [[455, 760], [520, 760], [880, 1000], [800, 1010], [450, 820]]]] },
      { id: "chloro", name: "chloroplast", noTapAsk: true, fn: "Absorbing light for photosynthesis", at: [560, 145], tap: [["e", 540, 140, 55, 35, 0], ["e", 340, 230, 45, 35, 0], ["e", 610, 280, 50, 40, 0], ["e", 350, 480, 50, 40, 0], ["e", 640, 500, 50, 40, 0]] },
      { id: "plates", name: "outer covering of the cell", fn: null, extra: true, base: true, at: [200, 300], tap: [["e", 495, 380, 345, 355, 0]] },
    ] },
  { id: "diatom", cellScale: true, noNames: ["cell wall"], name: "a diatom", ref: "3.5/LO4", kingdom: "protoctist", caption: "a diatom, seen through a microscope",
    parts: [
      { id: "skeleton", name: "silica skeleton", noFn: true, fn: "Protecting the cell", at: [700, 250], tap: [["e", 512, 380, 330, 210, 0]] },
      { id: "chloro", name: "chloroplast", fn: "Absorbing light for photosynthesis", at: [440, 900], tap: [["e", 205, 775, 60, 45, 20], ["e", 440, 880, 105, 40, 0], ["e", 665, 850, 70, 40, 0], ["e", 830, 760, 70, 45, -25]] },
    ] },
];
const byId = (O, id) => O.parts.find((p) => p.id === id);
const tappable = (O) => O.parts.filter((p) => p.tap);
const asked = (O) => O.parts.filter((p) => !p.extra);
const LETTERS = "ABC";
// fallback names / functions from other organisms, for organisms with few parts
const ALL = ORGS.flatMap((O) => asked(O).map((p) => ({ o: O.id, cell: !!O.cellScale, name: p.name, fn: p.noFn ? null : p.fn })));
// function options that would also be true for the key: never offered together
const CLASH = [/photosynthesis/i, /^(Supporting|Protecting)/];
const clash = (a, b) => CLASH.some((re) => re.test(a) && re.test(b));

/* layout: 1024 frame → image 470 px wide at x 45; letters in the side margins */
const IX = 45, IY = 8, IS = 470, W = 560;
const fx = (x) => IX + (x / 1024) * IS, fy = (y) => IY + (y / 1024) * IS;

function make(seed) {
  const r = rng(seed);
  const O = pickR(r, ORGS), A = asked(O);
  const tc = tappable(O).filter((p) => !p.extra && !p.noTapAsk), tapT = tappable(O).length >= 3 && tc.length ? pickR(r, tc) : null;
  const order = shuffleR(r, A.map((p) => p.id));
  const labA = order[0], fnIds = order.filter((id) => !byId(O, id).noFn), labB = fnIds.find((id) => id !== labA) || fnIds[0];
  return { kind: KEY, seed, org: O.id, tapT: tapT && tapT.id, labA, labB };
}

function shapeSVG(sh, attrs) {
  if (sh[0] === "e") { const [, cx, cy, rx, ry, rot] = sh; return `<ellipse cx="${fx(cx).toFixed(1)}" cy="${fy(cy).toFixed(1)}" rx="${((rx / 1024) * IS).toFixed(1)}" ry="${((ry / 1024) * IS).toFixed(1)}" transform="rotate(${rot || 0} ${fx(cx).toFixed(1)} ${fy(cy).toFixed(1)})" ${attrs}/>`; }
  if (sh[0] === "r") { const [, x0, y0, x1, y1] = sh; return `<rect x="${fx(x0).toFixed(1)}" y="${fy(y0).toFixed(1)}" width="${(((x1 - x0) / 1024) * IS).toFixed(1)}" height="${(((y1 - y0) / 1024) * IS).toFixed(1)}" ${attrs}/>`; }
  return `<polygon points="${sh[1].map(([x, y]) => `${fx(x).toFixed(1)},${fy(y).toFixed(1)}`).join(" ")}" ${attrs}/>`;
}

function svg(F, opt) {
  opt = opt || {}; const hl = opt.hl || {}, O = ORGS.find((o) => o.id === F.org);
  let s = `<rect x="${IX - 4}" y="${IY - 4}" width="${IS + 8}" height="${IS + 8}" rx="10" class="lp-bg"/><image href="${FIG_IMG}lp-${O.id}.webp" x="${IX}" y="${IY}" width="${IS}" height="${IS}"/>`;
  // label lines: letter in the nearer side margin, ruled line to the structure; letters on one side kept 26 px apart
  const L = Object.entries(opt.labels || {}).map(([k, pid]) => { const p = byId(O, pid); return { k, ax: fx(p.at[0]), ay: fy(p.at[1]), left: p.at[0] < 512 }; });
  for (const side of [true, false]) {
    const g = L.filter((l) => l.left === side).sort((a, b) => a.ay - b.ay);
    g.forEach((l, i) => (l.ly = i ? Math.max(l.ay, g[i - 1].ly + 26) : l.ay));
    for (let i = g.length - 1; i >= 0; i--) if (g[i].ly > IS) { g[i].ly = IS; if (i) g[i - 1].ly = Math.min(g[i - 1].ly, g[i].ly - 26); }
  }
  for (const l of L) {
    const mx = l.left ? 30 : W - 30, lx = l.left ? 18 : W - 18;
    s += `<line x1="${mx}" y1="${l.ly.toFixed(1)}" x2="${l.ax.toFixed(1)}" y2="${l.ay.toFixed(1)}" class="lp-line"/><circle cx="${l.ax.toFixed(1)}" cy="${l.ay.toFixed(1)}" r="4" class="lp-dot"/>`;
    s += `<text x="${lx}" y="${(l.ly + 6).toFixed(1)}" text-anchor="middle" class="lp-let">${l.k}</text>`;
  }
  if (hl.part) { const p = byId(O, hl.part); (p.tap || []).forEach((sh) => (s += shapeSVG(sh, 'class="lp-hl"'))); if (!p.tap) s += `<circle cx="${fx(p.at[0]).toFixed(1)}" cy="${fy(p.at[1]).toFixed(1)}" r="12" class="lp-hl"/>`; }
  if (opt.tapMode) for (const p of tappable(O).filter((p) => p.base).concat(tappable(O).filter((p) => !p.base))) s += `<g data-tap="${p.id}">${p.tap.map((sh) => shapeSVG(sh, 'fill="transparent"')).join("")}</g>`;
  if (opt.showRegions) for (const p of O.parts) (p.tap || []).forEach((sh) => (s += shapeSVG(sh, 'class="lp-dbg"'))); // design aid only
  return `<svg viewBox="0 0 ${W} ${IS + 14}" class="figsvg fig-${KEY}" role="img" aria-label="Diagram of ${O.name}">${s}</svg>`;
}

const cap = (s) => s[0].toUpperCase() + s.slice(1);
const lc = (t) => t[0].toLowerCase() + t.slice(1);

const pool = (O) => ALL.filter((x) => x.o !== O.id && x.cell === !!O.cellScale);
function namesFor(O, keep, r, n) {
  const kn = byId(O, keep).name, no = O.noNames || [];
  const own = shuffleR(r, asked(O).filter((p) => p.id !== keep).map((p) => p.name));
  const other = shuffleR(r, pool(O).map((x) => x.name)).filter((v, i, a) => a.indexOf(v) === i && v !== kn && !own.includes(v) && !no.includes(v));
  return own.concat(other).slice(0, n);
}
function fnsFor(O, keep, r, n) {
  const k = byId(O, keep).fn, ok = (f) => f && f !== k && !clash(f, k);
  const own = shuffleR(r, asked(O).filter((p) => p.id !== keep && !p.noFn).map((p) => p.fn)).filter((v, i, a) => ok(v) && a.indexOf(v) === i);
  const other = shuffleR(r, pool(O).map((x) => x.fn)).filter((v, i, a) => ok(v) && a.indexOf(v) === i && !own.includes(v));
  return own.concat(other).slice(0, n);
}

function questions(F, r) {
  const qs = [], O = ORGS.find((o) => o.id === F.org), A = byId(O, F.labA), B = byId(O, F.labB);
  // 1. tap a named structure
  if (F.tapT) { const T = byId(O, F.tapT);
    qs.push({ kind: "tap", q: T.id === "flagella" ? "Tap either of the two <b>flagella</b>." : `Tap the <b>${T.name}</b>${T.id === "mito" || T.id === "chloro" || T.id === "tentacle" || T.id === "bladder" || T.id === "blade" || T.id === "leaf" || T.id === "root" ? " (any one of them)" : ""}.`, a: [T.id], ansTxt: `the ${T.name}`, labelOf: (id) => `the ${byId(O, id).name}`,
      askOpt: { tapMode: true }, doneOpt: () => ({ tapMode: true, hl: { part: T.id } }), hl: { part: T.id },
      why: T.noFn && O.id === "fish" ? `This is the <b>${T.name}</b>. Together, the fins control pitching, rolling and yawing and changes of direction; the caudal fin gives forward thrust.` : `This is the <b>${T.name}</b>. Its job: ${lc(T.fn)}.` }); }
  // 2. name the structure on label A
  const zm = () => (["animalcell", "plantcell", "bacterium", "fish"].includes(O.id) ? " Use Zoom to look closely." : "");
  qs.push({ kind: "choice", q: "Name the structure labelled <b>A</b>." + zm(A), options: [A.name, ...namesFor(O, A.id, r, 3)], a: 0,
    askOpt: { labels: { A: A.id } }, doneOpt: () => ({ labels: { A: A.id }, hl: { part: A.id } }), hl: { part: A.id },
    why: A.noFn && O.id === "fish" ? `A is the <b>${A.name}</b>. Together, the fins control pitching, rolling and yawing and changes of direction; the caudal fin gives forward thrust.` : `A is the <b>${A.name}</b>${A.id === "caudal" ? " (tail fin)" : ""}. Its job: ${lc(A.fn)}.` });
  // 3. function of the structure on label B (B ≠ A when the organism has more than one asked part)
  const Bq = B;
  qs.push({ kind: "choice", q: "What is the job of the structure labelled <b>B</b>?" + zm(Bq), options: [Bq.fn, ...fnsFor(O, Bq.id, r, 3)], a: 0,
    askOpt: { labels: { B: Bq.id } }, doneOpt: () => ({ labels: { B: Bq.id }, hl: { part: Bq.id } }), hl: { part: Bq.id },
    why: `B is the <b>${Bq.name}</b>. Its job: ${lc(Bq.fn)}. The other options are the jobs of other structures.` });
  // 4. organism-specific
  if (O.cell === "plant" || O.cell === "animal") {
    const st = [["cell wall", true], ["chloroplast", true], ["large vacuole", true], ["nucleus", false], ["cell membrane", false], ["cytoplasm", false], ["mitochondrion", false]];
    const sh = shuffleR(r, st);
    qs.push({ kind: "multi", q: O.cell === "plant" ? "Tick the structures in this plant cell that an animal cell does <b>not</b> have." : "Tick the structures found in plant cells that this animal cell does <b>not</b> have.",
      options: sh.map((x) => x[0]), a: sh.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0),
      why: "Plant cells have a <b>cell wall</b>, <b>chloroplasts</b> and a <b>large vacuole</b>; animal cells do not. Both kinds of cell have a nucleus, a cell membrane, cytoplasm and mitochondria." });
  } else if (O.cell === "bacterium") {
    qs.push({ kind: "choice", q: "Which of these structures, found in plant and animal cells, is missing from this bacterial cell?", options: ["nucleus", "cell membrane", "cytoplasm", "cell wall"], a: 0,
      why: "A bacterial cell has a cell wall, a cell membrane and cytoplasm, but <b>no nucleus</b>: its genetic material is a loop of DNA loose in the cytoplasm." });
  } else if (O.kingdom) {
    const ks = ["protoctist kingdom", "plant kingdom", "animal kingdom"], k = O.kingdom + " kingdom";
    const reason = { protoctist: O.id === "kelp" ? "Kelp is a macroalga (a seaweed). Seaweeds belong to the <b>protoctist kingdom</b>, not the plant kingdom, even though they photosynthesise." : `${cap(O.name)} is a single-celled organism with chloroplasts. It belongs to the <b>protoctist kingdom</b>, not the plant kingdom.`,
      plant: "Seagrasses are true plants, with roots, leaves and flowers, so they belong to the <b>plant kingdom</b>. Seaweeds such as kelp are protoctists.", animal: "Corals are animals (cnidaria). The polyp catches food with its tentacles. It is in the <b>animal kingdom</b>, even though algae live in its tissues." }[O.kingdom];
    qs.push({ kind: "choice", q: `Which kingdom does ${O.name.replace(/^a /, "this ").replace(/^kelp$/, "kelp")} belong to?`, options: [k, ...ks.filter((x) => x !== k), "the Bacteria domain"].slice(0, 4), a: 0, why: reason });
  }
  // 5. identifying features (single-celled protoctists, seaweed vs seagrass) or which label is which
  if (O.id === "dino" || O.id === "diatom") {
    const st = O.id === "dino" ? [["It is a single cell.", true], ["It has chloroplasts for photosynthesis.", true], ["It has two flagella for movement.", true], ["It has a silica skeleton.", false], ["It has roots and leaves.", false], ["It has a mouth and a stomach.", false]]
      : [["It is a single cell.", true], ["It has chloroplasts for photosynthesis.", true], ["It has a silica skeleton.", true], ["It has two flagella for movement.", false], ["Its skeleton is made of calcium carbonate.", false], ["It has a holdfast.", false]];
    const sh = shuffleR(r, st); qs.push({ kind: "multi", q: `Tick the features of ${O.name.replace(/^a /, "a ")}.`, options: sh.map((x) => x[0]), a: sh.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0),
      why: O.id === "dino" ? "Dinoflagellates are microscopic, single-celled protoctists with chloroplasts and <b>two flagella</b>. They have a nucleus; it is diatoms that have a silica skeleton." : "Diatoms are microscopic, single-celled protoctists with chloroplasts and a <b>silica</b> skeleton (not calcium carbonate). It is dinoflagellates that have two flagella." });
  } else if (asked(O).length >= 4) {
    const three = shuffleR(r, asked(O)).slice(0, 3), labs = Object.fromEntries(three.map((p, i) => [LETTERS[i], p.id]));
    qs.push({ kind: "order", q: `Put the labels in order: <b>A</b>, then <b>B</b>, then <b>C</b>. Tap the names in that order.`, options: three.map((p) => p.name), a: [0, 1, 2],
      askOpt: { labels: labs }, doneOpt: () => ({ labels: labs }), hl: {},
      why: three.map((p, i) => `${LETTERS[i]} is the <b>${p.name}</b>`).join("; ") + "." });
  }
  return qs;
}

function selfTest(F, qs) {
  const bad = [], O = ORGS.find((o) => o.id === F.org);
  for (const q of qs) if (q.kind === "choice" && new Set(q.options).size !== q.options.length) bad.push("dup options " + q.q.slice(0, 30));
  if (F.tapT && !byId(O, F.tapT).tap) bad.push("tap target has no area");
  for (const p of O.parts) if (!p.extra && !p.fn) bad.push("no function " + p.id);
  const fq = qs.find((q) => /job of the structure/.test(q.q)); if (fq) { if (fq.options.slice(1).some((o) => clash(o, fq.options[0]))) bad.push("job clash"); if (byId(O, F.labB).noFn) bad.push("B has no taught job"); }
  const nq = qs.find((q) => /Name the structure/.test(q.q)); if (nq && (O.noNames || []).some((n) => nq.options.includes(n))) bad.push("banned name");
  return bad;
}

export default {
  key: KEY, group: "Diagrams", name: "Label the parts", topics: "Unit 3 (3.1, 3.4, 3.5) and Unit 5 (5.7)", thumbSeed: 2,
  blurb: "Colour diagrams of cells, a bony fish, a coral polyp, kelp, seagrass, a dinoflagellate and a diatom: find, name and explain each part.",
  tips: ["Use Zoom to see thin structures such as the cell membrane clearly.", "Plant cells have a cell wall, chloroplasts and a large vacuole; animal cells do not. Bacterial cells have no nucleus.", "Fish: the operculum covers the gills, the lateral line detects vibrations and the nares detect chemicals. The caudal fin gives forward thrust.", "Coral polyp: tentacles catch food, stinging cells paralyse prey, the stomach digests and the calcium carbonate skeleton supports.", "Kelp is a protoctist: holdfast anchors, stipe, blades photosynthesise, gas bladders float the blades. Seagrass is a plant: roots, rhizome, leaves and flowers.", "Dinoflagellates have two flagella; diatoms have a silica skeleton. Both are single cells with chloroplasts."],
  ctx: (F) => ORGS.find((o) => o.id === F.org).caption,
  make, svg, questions, selfTest, ORGS,
  css: `.fig-labelparts .lp-bg{fill:#fff;stroke:var(--line);stroke-width:1}.fig-labelparts .lp-line{stroke:#111;stroke-width:2.5}.fig-labelparts .lp-dot{fill:#111}
.fig-labelparts .lp-let{font-size:18px;font-weight:800;fill:currentColor}.fig-labelparts .lp-hl{fill:color-mix(in srgb,var(--app) 30%,transparent);stroke:var(--app);stroke-width:2.5}
.fig-labelparts .lp-cap{font-size:12.5px;fill:currentColor;opacity:.85}.fig-labelparts .lp-dbg{fill:rgba(255,0,0,.18);stroke:red;stroke-width:1}`,
};
