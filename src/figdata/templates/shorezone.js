/* ---------- SHORE ZONES IN CROSS-SECTION (0697 5.4/LO1–LO4 rocky shores; 5.5/LO1–LO4 sandy and muddy shores) ----------
   A generated cross-section of a shore: rocky (irregular steps), sandy (smooth, moderate slope, a dune at the top) or
   muddy (a bank, then an almost flat mudflat). The high-tide mark and the low-tide mark are dashed lines that run to a
   height scale on the right (small division 0.2 m); the sea is drawn at either high tide or low tide. Four or five
   points (P–T, letters in random order) sit on the shore surface in the three zones.
   Zones are only the three in the syllabus guidance (KM5 5.4/LO1, 5.5/LO1): supratidal (above the high-tide mark, reached
   only by spray), intertidal (between the marks, covered and uncovered by each tide), subtidal (below the low-tide mark,
   always submerged). Never used: upper/middle/lower intertidal, "splash zone", spring/neap tide marks.
   Misconceptions used as distractors: intertidal = always wet; subtidal exposed at low tide; supratidal covered at high tide.
   Questions: tap a named zone (transparent column per zone, no zone letters shown); which zone is labelled A/B/C; read the
   height of a tide mark (±0.1 m = ½ small division); which points change state at the other tide (multi); conditions of a
   lettered zone (multi); one organism / sediment item for the shore type (5.4/LO3–4, 5.5/LO2–4); one factor item
   (biotic/abiotic, 5.4/LO2, 5.5/LO3) or a second sediment item for muddy shores. Horizontal distances are not to scale. */
import { rng, pickR, shuffleR, fmt, round1, pickMixed } from "../core.js";

const KEY = "shorezone";
const W = 560, PL = 14, PR = 486, PT = 58;
const ZN = { sup: "supratidal zone", int: "intertidal zone", sub: "subtidal zone" };
const ZS = { sup: "supratidal", int: "intertidal", sub: "subtidal" };
const ZPOS = { sup: "above the high-tide mark", int: "between the high-tide mark and the low-tide mark", sub: "below the low-tide mark" };
const ZIDS = ["sup", "int", "sub"];
const TYPES = { rocky: "rocky shore", sandy: "sandy shore", muddy: "muddy shore" };
const PLACES = { rocky: ["a rocky shore on an exposed headland", "a rocky shore in a small bay"], sandy: ["a sandy beach facing the open sea", "a sandy shore on a straight coast"], muddy: ["a muddy shore in a sheltered inlet", "a mudflat beside an estuary"] };
const MARG = 0.5;   // points sit at least 0.5 m (2½ small divisions) above or below a tide mark

/* monotone cubic (Fritsch–Carlson) through knots, sampled every 4 px */
function pchip(K) {
  const n = K.length, d = [], m = [];
  for (let i = 0; i < n - 1; i++) d.push((K[i + 1][1] - K[i][1]) / (K[i + 1][0] - K[i][0]));
  m[0] = d[0]; m[n - 1] = d[n - 2];
  for (let i = 1; i < n - 1; i++) m[i] = d[i - 1] * d[i] <= 0 ? 0 : (2 * d[i - 1] * d[i]) / (d[i - 1] + d[i]);
  const out = [];
  for (let i = 0; i < n - 1; i++) {
    const [x0, y0] = K[i], [x1, y1] = K[i + 1], hh = x1 - x0, steps = Math.max(2, Math.round(hh / 4));
    for (let k = 0; k < steps; k++) { const t = k / steps, t2 = t * t, t3 = t2 * t;
      out.push([x0 + t * hh, (2 * t3 - 3 * t2 + 1) * y0 + (t3 - 2 * t2 + t) * hh * m[i] + (-2 * t3 + 3 * t2) * y1 + (t3 - t2) * hh * m[i + 1]]); }
  }
  out.push(K[n - 1].slice());
  return out;
}
const hAt = (prof, x) => { for (let i = 1; i < prof.length; i++) if (x <= prof[i][0] + 1e-9) { const [x0, y0] = prof[i - 1], [x1, y1] = prof[i]; return y0 + (y1 - y0) * (x - x0) / (x1 - x0); } return prof[prof.length - 1][1]; };
const sortedRand = (r, n, a, b) => Array.from({ length: n }, () => a + r() * (b - a)).sort((p, q) => p - q);

function make(seed) {
  const u = rng(seed ^ 0x51ed)(), type = u < 0.4 ? "rocky" : u < 0.7 ? "sandy" : "muddy";   // the shore type is fixed by the seed, so retries do not bias it
  for (let tries = 0; tries < 4000; tries++) {
    const r = rng(seed + tries * 7919 + 11);
    const Hmax = pickR(r, [5, 6, 7]);
    const LT = round1(1.2 + Math.floor(r() * 9) / 10);
    const HT = round1(LT + 2.0 + Math.floor(r() * (Hmax * 10 - 11 - (LT + 2.0) * 10 + 1)) / 10);
    if (HT > Hmax - 1.1 + 1e-9 || HT - LT < 2 - 1e-9) continue;
    const hL = round1(Math.min(Hmax - 0.3, HT + 1.0 + r() * 1.4)), hR = round1(Math.max(0.3, LT - 0.9 - r() * 0.6));
    if (hL < HT + 0.9 || hR > LT - 0.8) continue;
    const wS = type === "muddy" ? 100 + r() * 25 : 105 + r() * 45, wI = type === "muddy" ? 215 + r() * 30 : type === "sandy" ? 150 + r() * 60 : 160 + r() * 70;
    const xHT = PL + wS, xLT = xHT + wI;
    if (PR - xLT < 130) continue;
    let K, prof;
    if (type === "rocky") {
      const cl = PL + 12 + r() * 22;
      K = [[PL, hL], [cl, hL - 0.1 - r() * 0.2]];
      const ns = 1 + Math.floor(r() * 3), xs = sortedRand(r, ns, cl + 12, xHT - 12), hs = sortedRand(r, ns, HT + 0.2, K[1][1] - 0.3).reverse();
      xs.forEach((x, i) => K.push([x, hs[i]]));
      K.push([xHT, HT]);
      const ni = 3 + Math.floor(r() * 3), xi = sortedRand(r, ni, xHT + 14, xLT - 14), hi = sortedRand(r, ni, LT + 0.15, HT - 0.15).reverse();
      xi.forEach((x, i) => K.push([x, hi[i]]));
      K.push([xLT, LT]);
      const nb = 2 + Math.floor(r() * 2), xb = sortedRand(r, nb, xLT + 14, PR - 14), hb = sortedRand(r, nb, hR + 0.1, LT - 0.15).reverse();
      xb.forEach((x, i) => K.push([x, hb[i]]));
      K.push([PR, hR]);
      if (K.some((k, i) => i && (k[0] - K[i - 1][0] < 8 || k[1] >= K[i - 1][1]))) continue;
      prof = K;
    } else if (type === "sandy") {
      const crest = PL + 28 + r() * 26, R = HT - LT;
      K = [[PL, hL - 0.3 - r() * 0.3], [crest, hL], [xHT, HT], [xHT + wI * (0.45 + r() * 0.1), LT + R * (0.42 + r() * 0.12)], [xLT, LT], [xLT + 40, LT - 0.45 - r() * 0.2], [PR, hR]];
      if (K[5][1] <= hR + 0.1 || K[0][1] < HT + 0.6) continue;
      prof = pchip(K);
    } else {
      const bank = PL + 34 + r() * 22, R = HT - LT;
      K = [[PL, hL], [bank, HT + 0.45 + r() * 0.2], [xHT, HT], [xHT + wI * 0.22, LT + R * (0.5 + r() * 0.08)], [xHT + wI * 0.72, LT + R * (0.16 + r() * 0.06)], [xLT, LT], [xLT + 34, LT - 0.5 - r() * 0.2], [PR, hR]];
      if (K[6][1] <= hR + 0.1 || K[1][1] >= hL - 0.2) continue;
      prof = pchip(K);
    }
    // points: counts per zone, positions on the surface with margins from the marks and from each other
    const cnt = pickR(r, [[1, 2, 1], [1, 2, 2], [2, 2, 1], [1, 3, 1]]), pts = [];
    const range = { sup: [PL + 16, xHT - 20], int: [xHT + 20, xLT - 20], sub: [xLT + 22, PR - 90] };
    const okH = { sup: (h) => h >= HT + MARG, int: (h) => h <= HT - MARG && h >= LT + MARG, sub: (h) => h <= LT - MARG };
    let bad = false;
    ZIDS.forEach((z, zi) => {
      for (let k = 0; k < cnt[zi] && !bad; k++) {
        let got = null;
        for (let t = 0; t < 60 && !got; t++) { const x = range[z][0] + r() * (range[z][1] - range[z][0]), h = hAt(prof, x);
          if (okH[z](h) && pts.every((p) => Math.abs(p.x - x) >= 44)) got = { x, h, zone: z }; }
        if (!got) bad = true; else pts.push(got);
      }
    });
    if (bad) continue;
    const letters = shuffleR(r, ["P", "Q", "R", "S", "T"].slice(0, pts.length));
    pts.forEach((p, i) => (p.id = letters[i]));
    pts.sort((a, b) => a.id.localeCompare(b.id));
    const zl = {}; shuffleR(r, ["A", "B", "C"]).forEach((L, i) => (zl[ZIDS[i]] = L));
    return { kind: KEY, seed, type, place: pickR(r, PLACES[type]), Hmax, HT, LT, hL, hR, xHT, xLT, prof, pts, zl, tide: r() < 0.5 ? "high" : "low" };
  }
  throw new Error("shorezone: no layout");
}

/* ---------- drawing ---------- */
function geo(F) { const sq = F.Hmax === 5 ? 11 : F.Hmax === 6 ? 10 : 9, ph = F.Hmax * 5 * sq; return { sq, ph, PB: PT + ph, H: PT + ph + 40 }; }
const Yh = (G, F, h) => G.PB - h / F.Hmax * G.ph;
const zoneX = (F) => ({ sup: [PL, F.xHT], int: [F.xHT, F.xLT], sub: [F.xLT, PR] });

/* axes for the reading guide: a height (y) scale on the RIGHT; horizontal distances are not to scale. */
function axes(F) {
  const G = geo(F), yt = [];
  for (let i = 0; i <= F.Hmax * 5; i++) yt.push({ at: Yh(G, F, i / 5), label: i % 5 === 0 ? String(i / 5) : undefined });
  return [{ plot: { x0: PL, x1: PR, y0: PT, y1: G.PB }, x: { ticks: [] }, y: { ticks: yt }, yAxisX: PR }];
}

function svg(F, opt) {
  opt = opt || {}; const G = geo(F), hl = opt.hl || {}, Y = (h) => Yh(G, F, h), ZX = zoneX(F);
  const pat = F.type === "rocky"
    ? `<pattern id="${KEY}-rock" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M0 14L14 0M-3 3L3 -3M11 17L17 11M0 0L14 14" class="sz-pl"/></pattern>`
    : F.type === "sandy"
    ? `<pattern id="${KEY}-sand" width="12" height="12" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1.2" class="sz-pd"/><circle cx="9" cy="9" r="1.2" class="sz-pd"/></pattern>`
    : `<pattern id="${KEY}-mud" width="16" height="10" patternUnits="userSpaceOnUse"><path d="M1 3H8M9 8H15" class="sz-pl"/></pattern>`;
  const pid = `${KEY}-${F.type === "rocky" ? "rock" : F.type === "sandy" ? "sand" : "mud"}`;
  let s = `<defs>${pat}</defs>`;
  // the sea, at the tide drawn
  const sh = F.tide === "high" ? F.HT : F.LT, xs = F.tide === "high" ? F.xHT : F.xLT, ys = Y(sh);
  const below = F.prof.filter((p) => p[0] > xs + 1e-9).map((p) => `${p[0].toFixed(1)},${Y(p[1]).toFixed(1)}`);
  let surf = ""; for (let x = xs; x <= PR + 1e-9; x += 6) surf += `${x.toFixed(1)},${(ys + (x === xs ? 0 : 1.6 * Math.sin((x - xs) / 7))).toFixed(1)} `;
  s += `<polygon points="${xs.toFixed(1)},${ys.toFixed(1)} ${surf}${PR},${ys.toFixed(1)} ${below.reverse().join(" ")}" class="sz-sea"/>`;
  s += `<polyline points="${surf}${PR},${ys.toFixed(1)}" class="sz-surf"/>`;
  // ground
  const top = F.prof.map((p) => `${p[0].toFixed(1)},${Y(p[1]).toFixed(1)}`).join(" ");
  s += `<polygon points="${top} ${PR},${G.PB} ${PL},${G.PB}" class="sz-gnd"/><polygon points="${top} ${PR},${G.PB} ${PL},${G.PB}" fill="url(#${pid})"/>`;
  s += `<polyline points="${top}" class="fline"/>`;
  // zone highlight after Check
  if (hl.zone) { const [a, b] = ZX[hl.zone]; s += `<rect x="${a}" y="${PT}" width="${b - a}" height="${G.ph}" class="sz-zhl"/>`; }
  // tide marks
  for (const [m, h, x, lab] of [["HT", F.HT, F.xHT, "high-tide mark"], ["LT", F.LT, F.xLT, "low-tide mark"]]) {
    const y = Y(h);
    s += `<line x1="${x.toFixed(1)}" x2="${PR}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}" class="sz-mark${hl.mark === m ? " sz-mhl" : ""}"/>`;
    s += `<text x="${PR - 6}" y="${(y - 6).toFixed(1)}" text-anchor="end" class="sz-ml sz-halo">${lab}</text>`;
    if (hl.mark === m) s += `<circle cx="${PR}" cy="${y.toFixed(1)}" r="5" class="fdot hl"/>`;
  }
  s += `<text x="${PR - 6}" y="${(ys + 21).toFixed(1)}" text-anchor="end" class="sz-sl sz-halo">sea</text>`;
  // height scale on the right
  s += `<line x1="${PR}" x2="${PR}" y1="${PT}" y2="${G.PB}" class="axis"/>`;
  for (let i = 0; i <= F.Hmax * 5; i++) { const y = Y(i / 5), maj = i % 5 === 0; s += `<line x1="${PR - (maj ? 7 : 4)}" x2="${PR + (maj ? 7 : 4)}" y1="${y}" y2="${y}" class="sz-tick"/>`; if (maj) s += `<text x="${PR + 11}" y="${y + 5}">${i / 5}</text>`; }
  s += `<text transform="translate(${W - 12} ${PT + G.ph / 2}) rotate(-90)" text-anchor="middle" class="sz-ax">height / m</text>`;
  // zone brackets (letters and/or names)
  if (opt.letters || opt.names) {
    for (const z of ZIDS) { const [a, b] = ZX[z], yb = PT - 14;
      s += `<path d="M${a + 4} ${yb + 7}V${yb}H${b - 4}V${yb + 7}" class="sz-br${hl.zone === z ? " sz-brhl" : ""}"/>`;
      const named = opt.names === true || (Array.isArray(opt.names) && opt.names.includes(z));   // after Check only the asked zone is named, so later questions are not given away
      const t = opt.letters && named ? `${F.zl[z]}: ${ZS[z]}` : opt.letters ? F.zl[z] : named ? ZS[z] : "";
      if (t) s += `<text x="${(a + b) / 2}" y="${yb - 7}" text-anchor="middle" class="${named ? "sz-zn" : "sz-zl"}">${t}</text>`; }
    for (const [x, h] of [[F.xHT, F.HT], [F.xLT, F.LT]]) s += `<line x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${PT - 8}" y2="${Y(h).toFixed(1)}" class="sz-bound"/>`;
  }
  // points
  for (const p of F.pts) { const x = p.x, y = Y(p.h);
    if ((hl.pts || []).includes(p.id)) s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="10" class="sz-phl"/>`;
    s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="4.5" class="fdot"/><text x="${(x + 7).toFixed(1)}" y="${(y - 8).toFixed(1)}" class="sz-pt sz-halo">${p.id}</text>`; }
  s += `<text x="${PL}" y="${G.PB + 22}" class="sz-note">A ${TYPES[F.type]} in cross-section, sea at ${F.tide} tide. Horizontal distances not to scale.</text>`;
  // tap targets: one transparent column per zone
  if (opt.tapMode) for (const z of ZIDS) { const [a, b] = ZX[z]; s += `<rect x="${a.toFixed(1)}" y="${PT}" width="${(b - a).toFixed(1)}" height="${G.ph}" data-tap="${z}" fill="transparent" stroke="transparent"/>`; }
  return `<svg viewBox="0 0 ${W} ${G.H}" class="figsvg fig-${KEY}" role="img" aria-label="Cross-section of a ${TYPES[F.type]} with the high-tide mark, the low-tide mark and lettered points">${s}</svg>`;
}

/* ---------- item banks (KM5 5.4/LO2–4, 5.5/LO2–4) ---------- */
const BANK = {
  fucus: (X) => ({ ref: "5.4/LO4", q: `<i>Fucus</i> (a brown seaweed) grows at point <b>${X}</b>. Which feature helps it survive when the tide is out?`,
    options: ["Thick, leathery fronds that slow down water loss", "Roots that take up water from cracks in the rock", "A holdfast that stores water until the tide returns", "Pale fronds that reflect strong sunlight away"],
    why: `Point ${X} is in the intertidal zone, so it is exposed to air at low tide and <i>Fucus</i> can dry out. Its <b>thick, leathery fronds reduce water loss</b>. The holdfast attaches it to the rock against wave action and currents; it does not store water. Seaweeds have no roots, and sunlight is not the problem.` }),
  limpet: (X) => ({ ref: "5.4/LO4", q: `Limpets live on the rock at point <b>${X}</b>. How do they reduce water loss when the tide is out?`,
    options: ["They clamp their shells tightly against the rock", "They move down the shore to stay in the sea", "Their shells take in water from the damp air", "They pull their tentacles back inside their shells"],
    why: `Point ${X} is in the intertidal zone, so it is exposed to air at low tide. A limpet <b>pulls its shell down tightly against the rock</b>, which seals water in; the hard shell also protects it from predators. Limpets stay where they are, shells cannot absorb water from the air, and retracting tentacles is what sea anemones do.` }),
  mussel: (X) => ({ ref: "5.4/LO3", q: `Mussels are common at point <b>${X}</b> but scarce in the subtidal zone. Suggest why.`,
    options: ["Predators such as starfish can reach them all the time", "They cannot take in enough oxygen when always under water", "There is too little food for them below the low-tide mark", "The water below the low-tide mark is too cold for them"],
    why: `The subtidal zone is always submerged, so <b>predators such as starfish can reach the mussels all the time</b> and eat them. At point ${X}, in the intertidal zone, predators can only reach them while the tide is in. Mussels take in oxygen and filter food from the water, so being under water is not the problem in itself.` }),
  anemone: (X) => ({ ref: "5.4/LO4", q: `Sea anemones near point <b>${X}</b> are found only in rock pools or under seaweed. How does this help them survive?`,
    options: ["They stay moist there when the tide is out", "Seaweed there provides them with food to eat", "Rock pools give them more light for growth", "Their base cannot grip on to bare rock"],
    why: `Point ${X} is in the intertidal zone, so it is exposed to air at low tide. Water left in rock pools and the damp cover of seaweed <b>stop the anemones drying out</b>. Out of water they also retract their tentacles. Anemones catch prey with their tentacles; light and grip are not the reasons.` }),
  lugO2: (X) => ({ ref: "5.5/LO4", q: `How are lugworms in burrows at point <b>${X}</b> able to keep respiring when the tide is out?`,
    options: ["Their haemoglobin takes up oxygen even at low levels", "They come up to the surface of the sand to breathe air", "They stop respiring completely until the tide comes back", "They absorb oxygen from the sand grains that they swallow"],
    why: `At low tide the water in the burrow at point ${X} is not renewed, so it holds little oxygen. Lugworms have <b>specialised haemoglobin</b> that can take up oxygen even when there is little of it, so they keep respiring. They stay in the burrow and do not breathe air.` }),
  lugFeed: (X) => ({ ref: "5.5/LO4", q: `Lugworms live in U-shaped burrows at point <b>${X}</b>. How do they feed?`,
    options: ["They swallow sand and digest the microorganisms in it", "They filter plankton from water drawn into the burrow", "They catch small crabs at the entrance to the burrow", "They graze on seaweed that grows on the sand surface"],
    why: `A lugworm <b>ingests sand and digests the microorganisms</b> (and other organic matter) in it, then passes out the sand as a cast at the surface. It is not a filter feeder, and seaweeds cannot attach to loose sand.` }),
  clam: (X) => ({ ref: "5.5/LO4", q: `Clams live at point <b>${X}</b>, where the sand is loose and unstable. Which adaptation helps them live there?`,
    options: ["A muscular foot used to burrow into the sand", "A shell that clamps tightly on to rocks for grip", "A holdfast that anchors them to the sand surface", "Roots that grow down to hold them in the sand"],
    why: `There is no stable surface on a sandy shore, so clams live buried. A <b>muscular foot</b> lets them burrow quickly, which protects them from predators and from exposure at low tide. There are no rocks to clamp on to; holdfasts belong to seaweeds, and clams have no roots.` }),
  noweed: (X) => ({ ref: "5.5/LO3", q: `Almost no seaweeds grow on the sand around point <b>${X}</b>. Suggest why.`,
    options: ["There is no stable surface for them to attach to", "Sand has none of the nutrients that they need to grow", "Sand reflects too much light for them to grow", "Their roots cannot grow down into the loose sand"],
    why: `Sand is an <b>unstable substrate</b>: the grains move, so there is no firm surface for a seaweed's holdfast to attach to. Seaweeds do not have roots, sand does contain nutrients, and light is not the limiting factor.` }),
  mudO2: (X) => ({ ref: "5.5/LO2", q: `The mud at point <b>${X}</b> contains very little oxygen. Which explains this?`,
    options: ["The mud is waterlogged, with few air spaces", "The water over the mud is too still to hold oxygen", "Mud particles are too heavy for air to get in", "Mud particles are large, so water fills the gaps"],
    why: `Mud is made of very small particles packed closely together and it stays <b>waterlogged</b>, so there are few air spaces and little oxygen. Sand has larger particles with air spaces between them, so it holds more oxygen. Still water does contain some oxygen, and mud particles are small and light, not heavy.` }),
  mudCond: () => ({ ref: "5.5/LO2", q: "Which describes the conditions where a muddy shore like this one forms?",
    options: ["Sheltered, calm water where deposition exceeds erosion", "Exposed coast where strong waves carry mud ashore", "Fast currents where erosion is greater than deposition", "Rough water where erosion and deposition are equal"],
    why: "Mud has very small particles, which settle only in <b>sheltered, calm water</b>. There the rate of <b>deposition is greater than the rate of erosion</b>, so mud builds up into an almost flat shore. Strong waves and fast currents carry fine particles away." }),
  mudStable: () => ({ ref: "5.5/LO2", q: "Compared with a sandy shore, which statement about this muddy shore is correct?",
    options: ["Its particles stick together when wet, so it is stable", "Its particles are larger, so it holds more oxygen", "It is steeper because its particles are heavier", "Its loose particles are easily moved, so it is unstable"],
    why: "Mud particles are very small and <b>stick together when wet</b>, so a muddy shore is stable and almost flat. A sandy shore has larger, loose particles: it is less stable, steeper and holds more oxygen in its air spaces." }),
};
const ORG_BANK = { rocky: ["fucus", "limpet", "mussel", "anemone"], sandy: ["lugO2", "lugFeed", "clam", "noweed"], muddy: ["mudO2"] };
const ABIOTIC = { rocky: ["wave action", "exposure to air", "air temperature", "water temperature", "oxygen"], sandy: ["air temperature", "exposure to air", "an unstable substrate"] };   // KM5 5.5/LO3 abiotic list
const BIOTIC = ["predation", "food availability"];

const pv = (n) => `Point ${n}`;
function questions(F, r) {
  const qs = [], ZX = zoneX(F), byZ = (z) => F.pts.filter((p) => p.zone === z);
  const [z1, z2, z3] = shuffleR(r, ZIDS);   // each zone question is about a different zone
  const COND = { sup: "the sea never covers it, and only spray from breaking waves reaches it", int: "it is covered by the sea at high tide and uncovered at low tide, about twice a day", sub: "it is under water at every state of the tide, even at low tide" };
  // 1. tap the named zone (no zone letters)
  qs.push({ kind: "tap", q: `Tap the <b>${ZN[z1]}</b> on the diagram.`, a: [z1], ansTxt: `the ${ZN[z1]}, ${ZPOS[z1]}`, labelOf: (id) => `the ${ZS[id]} zone`,
    hint: "Tap a part of the shore to choose that zone.", askOpt: { tapMode: true }, doneOpt: () => ({ tapMode: true, names: [z1], hl: { zone: z1 } }),
    why: `The ${ZN[z1]} is the part of the shore ${ZPOS[z1]}: ${COND[z1]}. Use the places where the dashed tide marks meet the shore as the zone boundaries.` });
  // 2. which zone is labelled …
  const L2 = F.zl[z2];
  qs.push({ kind: "choice", q: `Which zone of the shore is labelled <b>${L2}</b>?`, options: [ZN[z2], ...ZIDS.filter((z) => z !== z2).map((z) => ZN[z])], a: 0,
    askOpt: { letters: true }, doneOpt: () => ({ letters: true, names: [z2], hl: { zone: z2 } }),
    why: `Zone ${L2} is the part of the shore ${ZPOS[z2]}, so it is the <b>${ZN[z2]}</b>: ${COND[z2]}.` });
  // 3. read the height of a tide mark
  const m = r() < 0.5 ? "HT" : "LT", mh = m === "HT" ? F.HT : F.LT, mn = m === "HT" ? "high-tide mark" : "low-tide mark";
  qs.push({ kind: "num", q: `Use the height scale. What is the height of the <b>${mn}</b>?`, ans: mh, tol: 0.1, unit: "m", dp: 1, hl: { mark: m },
    why: `Follow the dashed ${mn} to the height scale on the right. It meets the scale at <b>${fmt(mh, 1)} m</b>. Each small division is 0.2 m, so a reading within half a division (±0.1 m) is accepted.` });
  // 4. which points change at the other state of the tide (uses the tide drawn)
  const hi = F.tide === "high", tr4 = (p) => (hi ? p.zone !== "sub" : p.zone !== "sup");
  const RS4 = hi
    ? { sup: "above the high-tide mark (supratidal): the sea never covers it, so it is exposed to air at low tide as well", int: "between the marks (intertidal): the sea leaves it uncovered when the tide goes out", sub: "below the low-tide mark (subtidal): it stays under water even at low tide" }
    : { sup: "above the high-tide mark (supratidal): even at high tide the sea does not reach it, only spray does", int: "between the marks (intertidal): the sea covers it when the tide comes in", sub: "below the low-tide mark (subtidal): it is under water at every state of the tide" };
  qs.push({ kind: "multi", q: hi ? `The sea is shown at <b>high tide</b>. Tick <b>every</b> point that will be exposed to air at <b>low tide</b>.` : `The sea is shown at <b>low tide</b>. Tick <b>every</b> point that will be under water at <b>high tide</b>.`,
    options: F.pts.map((p) => pv(p.id)), a: F.pts.map((p, i) => (tr4(p) ? i : -1)).filter((i) => i >= 0), hl: { pts: F.pts.filter(tr4).map((p) => p.id) },
    why: F.pts.map((p) => `${tr4(p) ? "✓" : "✗"} Point ${p.id}: ${RS4[p.zone]}.`).join("<br>") });
  // 5. conditions in a lettered zone (multi; misconceptions as false statements)
  const L3 = F.zl[z3];
  // [statement, truth per zone, reason per zone]
  const ST = [
    ["It is covered by the sea at every high tide.", { sup: false, int: true, sub: true }, { sup: "the sea never rises above the high-tide mark", int: "high tide covers the shore up to the high-tide mark", sub: "it is under water at every state of the tide" }],
    ["It is exposed to air at every low tide.", { sup: true, int: true, sub: false }, { sup: "the sea never covers it, so it is exposed to air at low tide (and at high tide too)", int: "the falling tide uncovers the shore down to the low-tide mark", sub: "it is below the low-tide mark, so it stays under water even at low tide" }],
    ["It stays under water even when the tide is out.", { sup: false, int: false, sub: true }, { sup: "the sea never covers it at all", int: "the tide uncovers it at every low tide, so it is not always wet", sub: "the sea does not fall below the low-tide mark, so it is always submerged" }],
    ["The sea does not cover it; only spray reaches it.", { sup: true, int: false, sub: false }, { sup: "it is above the high-tide mark, so only spray from breaking waves reaches it", int: "the sea covers it at every high tide", sub: "it is under water all the time" }],
    ["It is covered and uncovered about twice a day.", { sup: false, int: true, sub: false }, { sup: "it is never covered by the sea", int: "there are about two high tides and two low tides each day", sub: "it is never uncovered by the sea" }],
  ].map(([t, v, why]) => [t, v[z3], why[z3]]);
  const pick = pickMixed(r, ST, 4);
  qs.push({ kind: "multi", q: `Tick <b>every</b> statement that is true for the zone labelled <b>${L3}</b>.`, options: pick.map((x) => x[0]), a: pick.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0),
    askOpt: { letters: true }, doneOpt: () => ({ letters: true, names: [z3], hl: { zone: z3 } }),
    why: `Zone ${L3} is ${ZPOS[z3]}, so it is the <b>${ZN[z3]}</b>: ${COND[z3]}.<br>` + pick.map((x) => `${x[1] ? "✓" : "✗"} ${x[0]}: ${x[2]}.`).join("<br>") });
  // 6. an organism or sediment item for this shore type, at an intertidal point
  const ints = byZ("int"), key6 = pickR(r, ORG_BANK[F.type]);
  const P6 = key6 === "mussel" ? ints.reduce((a, b) => (b.h < a.h ? b : a)) : pickR(r, ints);
  const B6 = BANK[key6](P6.id);
  qs.push({ kind: "choice", q: B6.q, options: B6.options, a: 0, hl: { pts: [P6.id] }, why: B6.why, ref: B6.ref });
  // 7. biotic or abiotic factor (rocky / sandy), or a second sediment item (muddy)
  if (F.type === "muddy") {
    const B7 = BANK[pickR(r, ["mudCond", "mudStable"])]();
    qs.push({ kind: "choice", q: B7.q, options: B7.options, a: 0, hl: {}, why: B7.why, ref: B7.ref });
  } else {
    const ab = ABIOTIC[F.type], wantBio = r() < 0.5, shore = TYPES[F.type];
    const bio = pickR(r, BIOTIC);
    let dis = shuffleR(r, ab).slice(0, 3);
    if (wantBio && F.type === "rocky" && bio === "food availability" && !dis.includes("water temperature")) dis = ["water temperature", ...dis.slice(0, 2)];   // keeps the key from being the longest option
    const key7 = pickR(r, ab);
    // "an unstable substrate" (21 letters) would be the longest option against the two biotic factors, so then the food factor is worded at the same length or longer
    const opts = wantBio ? [bio, ...dis] : [key7, "predation", key7 === "an unstable substrate" ? "the availability of food" : "food availability"];
    qs.push({ kind: "choice", q: `Which of these is ${wantBio ? "a <b>biotic</b>" : "an <b>abiotic</b>"} factor that affects where organisms live on this ${shore}?`, options: opts, a: 0, hl: {}, ref: F.type === "rocky" ? "5.4/LO2" : "5.5/LO3",
      why: `Biotic factors come from other living things: <b>predation</b> and <b>food availability</b>. Abiotic factors are physical or chemical conditions, such as ${F.type === "rocky" ? "wave action, exposure to air, oxygen, air temperature and water temperature" : "an unstable substrate (loose sand grains moved by the waves), air temperature and exposure to air and wind"}. So the answer is <b>${opts[0]}</b>.` });
  }
  return qs;
}

function selfTest(F, qs) {
  const bad = [], P = F.prof;
  for (let i = 1; i < P.length; i++) if (P[i][0] <= P[i - 1][0]) bad.push("profile x not increasing");
  for (const p of P) { if (p[0] < F.xHT - 1e-6 && p[1] <= F.HT + 1e-9) bad.push("supratidal ground at or below HT"); if (p[0] > F.xHT + 1e-6 && p[1] >= F.HT - 1e-9) bad.push("ground above HT seaward of the mark"); if (p[0] < F.xLT - 1e-6 && p[1] <= F.LT + 1e-9) bad.push("ground below LT landward of the mark"); if (p[0] > F.xLT + 1e-6 && p[1] >= F.LT - 1e-9) bad.push("ground above LT seaward"); if (p[1] < 0.2 || p[1] > F.Hmax - 0.2) bad.push("profile off the scale"); }
  if (Math.abs(hAt(P, F.xHT) - F.HT) > 1e-6 || Math.abs(hAt(P, F.xLT) - F.LT) > 1e-6) bad.push("marks do not meet the shore");
  if (F.xHT - PL < 100 || F.xLT - F.xHT < 150 || PR - F.xLT < 130) bad.push("zone too narrow to tap");
  if (Math.abs(F.HT * 10 - Math.round(F.HT * 10)) > 1e-9 || Math.abs(F.LT * 10 - Math.round(F.LT * 10)) > 1e-9 || F.HT - F.LT < 2 - 1e-9) bad.push("tide marks");
  for (const z of ZIDS) if (!F.pts.some((p) => p.zone === z)) bad.push("no point in " + z);
  for (const p of F.pts) { const h = hAt(P, p.x); if (Math.abs(h - p.h) > 1e-9) bad.push("point off the surface");
    const z = h > F.HT ? "sup" : h > F.LT ? "int" : "sub"; if (z !== p.zone) bad.push("point zone"); if (Math.min(Math.abs(h - F.HT), Math.abs(h - F.LT)) < MARG - 1e-9) bad.push("point too close to a mark"); }
  if (new Set(F.pts.map((p) => p.id)).size !== F.pts.length || new Set(Object.values(F.zl)).size !== 3) bad.push("labels not unique");
  for (const q of qs) if (q.kind === "choice") { const len = q.options.map((o) => o.length); if (len[q.a] > Math.max(...len.filter((_, i) => i !== q.a))) bad.push("correct option is the longest: " + q.q.slice(0, 40)); }
  const banned = /splash|spring tide|neap|upper shore|middle shore|lower shore|upper intertidal|middle intertidal|lower intertidal/i;
  for (const q of qs) if (banned.test(q.q + q.why + (q.options || []).join(" "))) bad.push("forbidden term: " + q.q.slice(0, 40));
  return bad;
}

export default {
  key: KEY, group: "Diagrams", name: "Shore zones", topics: "Unit 5 (5.4, 5.5)", thumbSeed: 3,
  blurb: "A cross-section of a rocky, sandy or muddy shore with the tide marks: find the three zones and what each is like.",
  tips: ["The supratidal zone is above the high-tide mark: the sea never covers it, only spray reaches it.", "The intertidal zone is between the high-tide mark and the low-tide mark: it is covered at high tide and uncovered at low tide.", "The subtidal zone is below the low-tide mark: it is under water at every state of the tide.", "Read heights where the dashed tide mark meets the scale on the right: each small division is 0.2 m."],
  ctx: (F) => `a cross-section of ${F.place}`,
  make, svg, axes, questions, selfTest,
  css: `.fig-shorezone .sz-sea{fill:color-mix(in srgb,var(--ink) 10%,transparent)}.fig-shorezone .sz-surf{fill:none;stroke:currentColor;stroke-width:1.4}
.fig-shorezone .sz-gnd{fill:color-mix(in srgb,var(--ink) 16%,var(--surface2))}.fig-shorezone .sz-pl{stroke:currentColor;stroke-width:1;opacity:.5;fill:none}.fig-shorezone .sz-pd{fill:currentColor;opacity:.55}
.fig-shorezone .sz-mark{stroke:currentColor;stroke-width:1.8;stroke-dasharray:8 5}.fig-shorezone .sz-mhl{stroke:var(--app);stroke-width:3}
.fig-shorezone .sz-ml{font-size:15px;font-weight:700}.fig-shorezone .sz-sl{font-size:14px;font-style:italic}.fig-shorezone .sz-ax{font-size:14px}.fig-shorezone .sz-note{font-size:12.5px;opacity:.9}
.fig-shorezone .sz-halo{paint-order:stroke;stroke:var(--surface2);stroke-width:4px;stroke-linejoin:round}.fig-shorezone .sz-tick{stroke:currentColor;stroke-width:1}
.fig-shorezone .sz-pt{font-size:17px;font-weight:800}.fig-shorezone .sz-phl{fill:color-mix(in srgb,var(--app) 35%,transparent);stroke:var(--app);stroke-width:2}
.fig-shorezone .sz-br{fill:none;stroke:currentColor;stroke-width:1.4}.fig-shorezone .sz-brhl{stroke:var(--app);stroke-width:2.5}.fig-shorezone .sz-zl{font-size:18px;font-weight:800}.fig-shorezone .sz-zn{font-size:13.5px;font-weight:700}
.fig-shorezone .sz-bound{stroke:currentColor;stroke-width:1;stroke-dasharray:2 3;opacity:.8}.fig-shorezone .sz-zhl{fill:color-mix(in srgb,var(--app) 20%,transparent)}`,
};
