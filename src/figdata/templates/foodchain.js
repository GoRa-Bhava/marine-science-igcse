/* ---------- MARINE FOOD WEBS, FOOD CHAINS AND PYRAMIDS (0697 4.4/LO2–LO13) ----------
   Four hand-checked marine webs (kelp forest, open ocean, rocky shore, coral reef). Arrows run from food to feeder,
   in the direction of energy transfer. Three panels:
   - "web": the whole web;
   - "chain": one 4-level chain from the web with biomass or energy values;
   - "pyramid": a pyramid of numbers or energy for that chain (not to scale, levels unlabelled while asking);
   - "scale": a pyramid of BIOMASS drawn to scale on a grid (4.4/LO13 "draw"), for the first three levels of a seaweed-based chain
     (each level 20–35 % of the one below). One bar is
     missing: read a drawn bar with the scale, then draw the missing bar to scale. Seaweed, kelp and algae chains only,
     because a phytoplankton-based pyramid of biomass can be inverted. Generated values; bar edges always on grid lines.
   The knowledge model rules are kept: energy loss is limited to respiration, movement, removal or harvesting and
   excretion, and the mark scheme also credits "not all eaten" and "undigested / egested". Those are never offered
   as wrong options. "Heat" is not a separate route. The 10 % rule is never required. % transfer =
   higher ÷ lower × 100. */
import { rng, pickR, shuffleR, fmt, pickMixed } from "../core.js";

const KEY = "foodchain";
const LV = ["producer", "primary consumer", "secondary consumer", "tertiary consumer"];
/* Webs: n = [name, x, y] (box centres on a 520-wide canvas, producers at the bottom); e = [food, feeder].
   Scenarios are authored per web: removing one organism and predicting an effect, all with plausible misreadings. */
const WEBS = [
  { id: "kelp", place: "a kelp forest",
    n: { kelp: ["kelp", 110, 350], phy: ["phytoplankton", 410, 350], urc: ["sea urchin", 110, 270], zoo: ["zooplankton", 410, 270], ott: ["sea otter", 110, 190], her: ["herring", 410, 190], sea: ["seal", 410, 110], orc: ["orca", 260, 30] },
    e: [["kelp", "urc"], ["phy", "zoo"], ["urc", "ott"], ["zoo", "her"], ["her", "sea"], ["sea", "orc"], ["ott", "orc"]],
    scen: [
      { q: "Sea otters are removed from this kelp forest by hunting. What is most likely to happen to the kelp?", o: ["It decreases, because more sea urchins survive to eat it", "It increases, because the sea otters no longer eat it", "It stays the same, because kelp is a producer", "It decreases, because the orcas start to eat the kelp"],
        why: "Sea otters eat sea urchins. Without the otters, more urchins survive, and urchins eat kelp, so the <b>kelp decreases</b>. Sea otters do not eat kelp; the arrow from kelp goes to the sea urchin." },
      { q: "The herring population falls. Which organism loses part of its food supply directly?", o: ["seal", "zooplankton", "sea urchin", "kelp"],
        why: "The arrow from herring points to the <b>seal</b>, so the seal eats herring and loses food. Zooplankton is the herring's food, not its predator." }] },
  { id: "ocean", place: "the open ocean",
    n: { phy: ["phytoplankton", 260, 350], zoo: ["zooplankton", 260, 270], sar: ["sardine", 110, 190], squ: ["squid", 410, 190], bird: ["seabird", 110, 110], tun: ["tuna", 330, 110], shk: ["shark", 330, 30] },
    e: [["phy", "zoo"], ["zoo", "sar"], ["zoo", "squ"], ["sar", "bird"], ["sar", "tun"], ["squ", "tun"], ["tun", "shk"]],
    scen: [
      { q: "Squid are overfished. What is most likely to happen to the tuna?", o: ["It may fall a little, but it can still eat sardines", "It dies out, because squid are its only food", "It increases, because there is less competition", "It is not affected, because tuna eat phytoplankton"],
        why: "Tuna eat both squid and sardines. With fewer squid it has less food, but it can still eat sardines, so it is <b>less affected</b> than an animal with only one food source." },
      { q: "Sardines are removed from this food web. Which organism loses its only food source?", o: ["seabird", "tuna", "shark", "zooplankton"],
        why: "The only arrow into the <b>seabird</b> comes from the sardine, so it loses its only food. Tuna can still eat squid, and zooplankton is eaten by sardines rather than eating them." }] },
  { id: "shore", place: "a rocky shore",
    n: { weed: ["seaweed", 110, 350], phy: ["phytoplankton", 410, 350], lim: ["limpet", 110, 270], bar: ["barnacle", 410, 270], dog: ["dog whelk", 410, 190], crab: ["crab", 260, 110], bird: ["seabird", 260, 30] },
    e: [["weed", "lim"], ["phy", "bar"], ["bar", "dog"], ["lim", "crab"], ["dog", "crab"], ["crab", "bird"], ["dog", "bird"]],
    scen: [
      { q: "Limpets are removed from this shore. What is most likely to happen to the seaweed?", o: ["It increases, because fewer limpets graze on it", "It decreases, because the crabs start to eat it", "It stays the same, because seaweed is a producer", "It decreases, because the limpets protected it"],
        why: "Limpets eat seaweed. With fewer limpets grazing, the <b>seaweed increases</b>. Crabs do not eat seaweed in this web." },
      { q: "Dog whelks are removed from this shore. Which organism is most likely to increase in number?", o: ["barnacle", "crab", "seabird", "phytoplankton"],
        why: "Dog whelks eat barnacles. Without dog whelks, fewer <b>barnacles</b> are eaten, so they increase. Crabs and seabirds lose some food instead." }] },
  { id: "reef", place: "a coral reef",
    n: { alg: ["algae", 110, 350], phy: ["phytoplankton", 410, 350], par: ["parrotfish", 110, 270], zoo: ["zooplankton", 410, 270], dam: ["damselfish", 410, 190], gro: ["grouper", 260, 110], shk: ["reef shark", 260, 30] },
    e: [["alg", "par"], ["phy", "zoo"], ["zoo", "dam"], ["par", "gro"], ["dam", "gro"], ["gro", "shk"]],
    scen: [
      { q: "Parrotfish are overfished on this reef. What is most likely to happen to the algae?", o: ["It increases, because fewer parrotfish graze on it", "It decreases, because the groupers start to eat it", "It stays the same, because algae are producers", "It decreases, because parrotfish fertilise it"],
        why: "Parrotfish graze on algae. With fewer parrotfish, the <b>algae increase</b>. Groupers eat fish, not algae." },
      { q: "The number of damselfish falls. How is the grouper most likely to be affected?", o: ["It can still eat parrotfish, so it is less affected", "It dies out, because damselfish are its only food", "It increases, because it has less competition for food", "It is not affected, because groupers eat zooplankton"],
        why: "Groupers eat damselfish <b>and</b> parrotfish. Losing one food source reduces its food, but it can still eat parrotfish, so it is less affected." }] },
];

const feeders = (W, k) => W.e.filter((e) => e[0] === k).map((e) => e[1]);
const foods = (W, k) => W.e.filter((e) => e[1] === k).map((e) => e[0]);
const isProd = (W, k) => foods(W, k).length === 0;
function chains4(W) {                         // every chain of 4 starting at a producer
  const out = [];
  for (const p of Object.keys(W.n).filter((k) => isProd(W, k))) for (const a of feeders(W, p)) for (const b of feeders(W, a)) for (const c of feeders(W, b)) out.push([p, a, b, c]);
  return out;
}
const validChain = (W, ch) => isProd(W, ch[0]) && ch.every((k, i) => i === 0 || W.e.some((e) => e[0] === ch[i - 1] && e[1] === k));
function perms(a) { if (a.length <= 1) return [a]; const o = []; a.forEach((x, i) => perms(a.slice(0, i).concat(a.slice(i + 1))).forEach((p) => o.push([x, ...p]))); return o; }

function make(seed) {
  for (let tries = 0; tries < 300; tries++) {
    const r = rng(seed + tries * 6007 + 11);
    const W = pickR(r, WEBS), cands = chains4(W).filter((ch) => perms(ch).filter((p) => validChain(W, p)).length === 1);
    if (!cands.length) continue;
    const ch = pickR(r, cands);
    // values: biomass (g per m²) or energy (kJ per m² per year)
    const energy = r() < 0.5, unit = energy ? "kJ per m² per year" : "g per m²";
    const v = [Math.round((2000 + r() * 7000) / 10) * 10];
    for (let i = 1; i < 4; i++) v.push(Math.max(1, Math.round(v[i - 1] * (0.05 + r() * 0.1) * (i === 3 && v[i - 1] < 40 ? 1 : 1))));
    if (v[3] < 2 || v[2] < 15) continue;
    // a percentage question between two levels with an unambiguous 1-d.p. rounding
    const pairs = [[0, 1], [1, 2], [2, 3], [0, 2]], [lo, hi] = pickR(r, pairs);
    const raw = v[hi] / v[lo] * 100, x = raw * 10;
    if (Math.abs((x % 1) - 0.5) < 0.08) continue;
    // pyramid type: kelp chains → numbers with a narrow base; otherwise numbers (upright) or energy
    const pyr = ch[0] === "kelp" ? "numbersKelp" : r() < 0.5 ? "numbers" : "energy";
    const nums = pyr === "numbersKelp" ? [3, 400, 30, 1] : [Math.round(500000 + r() * 500000), Math.round(20000 + r() * 20000), Math.round(300 + r() * 500), Math.round(2 + r() * 6)];
    // to-scale pyramid of biomass: a chain with a large seaweed producer (this web's, else the rocky shore's)
    const macro = chains4(W).filter((c) => ["kelp", "weed", "alg"].includes(c[0]) && perms(c).filter((p) => validChain(W, p)).length === 1);
    const SW = macro.length ? W : WEBS.find((w) => w.id === "shore"), sch = macro.length ? pickR(r, macro) : ["weed", "lim", "crab", "bird"];
    // three levels (producer, primary, secondary), each 20–35 % of the one below, so the bars stay drawable on 40 squares
    const sq = pickR(r, [5, 10, 20]), sw = [34 + 2 * Math.floor(r() * 4)];
    for (let i = 1; i < 3; i++) { let x = Math.round((sw[i - 1] * (0.2 + r() * 0.15)) / 2) * 2; if (x >= sw[i - 1]) x = sw[i - 1] - 2; sw.push(Math.max(2, x)); }
    if (!(sw[1] > sw[2]) || sw[2] < 2) continue;
    const miss = pickR(r, [0, 1].filter((i) => sw[i] >= 6)), read = pickR(r, [0, 1, 2].filter((i) => i !== miss));
    if (miss == null) continue;
    const scale = { web: SW.id, names: sch.slice(0, 3).map((k) => SW.n[k][0]), place: ({ kelp: "in", ocean: "in", shore: "on", reef: "on" }[SW.id]) + " " + SW.place, sq, w: sw, miss, read };
    return { kind: KEY, seed, W, ch, energy, unit, v, lo, hi, raw, pct: Math.round(raw * 10) / 10, pyr, nums, place: W.place, scale };
  }
  throw new Error("foodchain: no data");
}

/* ---------- drawing ---------- */
const BW = 132, BH = 34;
function arrow(x1, y1, x2, y2) { return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="fc-arr" marker-end="url(#foodchain-ah)"/>`; }
const defs = `<defs><marker id="foodchain-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" class="fc-ah"/></marker></defs>`;

function webSVG(F, opt) {
  const W = F.W, hl = opt.hl || {};
  let s = defs;
  for (const [a, b] of W.e) { const A = W.n[a], B = W.n[b]; const dy = B[2] - A[2], dx = B[1] - A[1], L = Math.hypot(dx, dy);
    // start at the top edge of the food box, end at the bottom edge of the feeder box (trimmed along the line)
    const t0 = Math.min((BH / 2) / Math.abs(dy || 1), (BW / 2) / Math.abs(dx || 1e-9)), t1 = t0;
    s += arrow(A[1] + dx * t0, A[2] + dy * t0, B[1] - dx * t1 - (dx / L) * 2, B[2] - dy * t1 - (dy / L) * 2); }
  for (const [k, [name, x, y]] of Object.entries(W.n)) {
    const h = hl.nodes && hl.nodes.includes(k);
    s += `<rect x="${x - BW / 2}" y="${y - BH / 2}" width="${BW}" height="${BH}" rx="6" class="fc-box${h ? " hl" : ""}"/><text x="${x}" y="${y + 6}" text-anchor="middle" class="fc-t">${name}</text>`;
  }
  return `<svg viewBox="0 0 520 384" class="figsvg fig-${KEY}" role="img" aria-label="A marine food web; arrows point from food to feeder">${s}</svg>`;
}

function chainSVG(F, opt) {
  const hl = opt.hl || {}, W = F.W, cx = 110, bw = 180, bh = 38, vx = 228;
  let s = defs;
  const Y = (i) => 284 - i * 74;                       // producer at the bottom, arrows point up (energy direction)
  s += `<text x="${vx}" y="18" class="fc-u">${F.energy ? "energy" : "biomass"} /</text><text x="${vx}" y="36" class="fc-u">${F.unit}</text>`;
  F.ch.forEach((k, i) => {
    const h = hl.lv && hl.lv.includes(i), y = Y(i);
    s += `<rect x="${cx - bw / 2}" y="${y - bh / 2}" width="${bw}" height="${bh}" rx="6" class="fc-box${h ? " hl" : ""}"/><text x="${cx}" y="${y + 6}" text-anchor="middle" class="fc-t">${W.n[k][0]}</text>`;
    s += `<text x="${vx}" y="${y + 6}" class="fc-v">${F.v[i].toLocaleString("en-GB")}</text>`;
    if (i < 3) s += arrow(cx, y - bh / 2, cx, Y(i + 1) + bh / 2 + 2);
  });
  return `<svg viewBox="0 0 360 312" class="figsvg fig-${KEY} fc-chain" role="img" aria-label="A marine food chain with values for each trophic level">${s}</svg>`;
}

function pyramidSVG(F, opt) {
  const hl = opt.hl || {}, W = F.W, cx = 260, bh = 44, y0 = 230;
  let widths;
  if (F.pyr === "numbersKelp") widths = [120, 420, 220, 60];
  else if (F.pyr === "numbers") widths = [440, 300, 170, 60];
  else widths = [460, 300, 160, 56];
  let s = "";
  widths.forEach((w, i) => {
    const y = y0 - i * bh, h = hl.lv && hl.lv.includes(i);
    s += `<rect x="${cx - w / 2}" y="${y}" width="${w}" height="${bh - 4}" class="fc-bar${h ? " hl" : ""}"/>`;
    if (hl.labels) s += `<text x="${cx}" y="${y + bh / 2 + 3}" text-anchor="middle" class="fc-t">${W.n[F.ch[i]][0]}</text>`;
    if (opt.tapMode) s += `<rect x="${cx - Math.max(w, 140) / 2}" y="${y}" width="${Math.max(w, 140)}" height="${bh - 4}" fill="transparent" data-tap="L${i}"/>`;
  });
  const title = F.pyr === "energy" ? "pyramid of energy (not to scale)" : "pyramid of numbers (not to scale)";
  s += `<text x="${cx}" y="${y0 + bh + 18}" text-anchor="middle" class="fc-u">${title}</text>`;
  s += `<text x="${cx}" y="18" text-anchor="middle" class="fc-u">${F.ch.map((k) => W.n[k][0]).join(" → ")}</text>`;
  return `<svg viewBox="0 0 520 ${y0 + bh + 30}" class="figsvg fig-${KEY}" role="img" aria-label="An ecological pyramid for a marine food chain">${s}</svg>`;
}

/* pyramid of biomass to scale: 40 × 16 small squares, each bar 4 squares tall, centred */
const SQ = 11, GL = 40, GT = 46, GC = 40, GR = 12, GCX = GL + (GC / 2) * SQ;
function scaleSVG(F, opt) {
  const S = F.scale, hl = opt.hl || {}, st = opt.state;
  let s = `<text x="${GCX}" y="18" text-anchor="middle" class="fc-u">${S.names.join(" → ")}</text><text x="${GCX}" y="36" text-anchor="middle" class="fc-u">pyramid of biomass, drawn to scale</text>`;
  for (let i = 0; i <= GR; i++) s += `<line x1="${GL}" x2="${GL + GC * SQ}" y1="${GT + i * SQ}" y2="${GT + i * SQ}" class="${i % 4 ? "gmin" : "gmaj"}"/>`;
  for (let i = 0; i <= GC; i++) s += `<line y1="${GT}" y2="${GT + GR * SQ}" x1="${GL + i * SQ}" x2="${GL + i * SQ}" class="${i % 10 ? "gmin" : "gmaj"}"/>`;
  const rowY = (i) => GT + (GR - 4 * (i + 1)) * SQ;
  S.w.forEach((w, i) => {
    const show = i !== S.miss || hl.showMiss, on = (hl.lv || []).includes(i);
    if (show) s += `<rect x="${GCX - (w * SQ) / 2}" y="${rowY(i)}" width="${w * SQ}" height="${4 * SQ}" class="fc-bar${on ? " hl" : ""}"/>`;
    else s += `<line x1="${GL}" x2="${GL + GC * SQ}" y1="${rowY(i) + 2 * SQ}" y2="${rowY(i) + 2 * SQ}" class="fc-miss"/>`;
  });
  if (st && st.w > 0) s += `<rect x="${GCX - (st.w * SQ) / 2}" y="${rowY(S.miss)}" width="${st.w * SQ}" height="${4 * SQ}" class="fc-mine"/>`;
  S.w.forEach((w, i) => (s += `<text x="${GCX}" y="${rowY(i) + 2 * SQ + 6}" text-anchor="middle" class="fc-t fc-halo">${S.names[i]}</text>`));
  s += `<text x="${GCX}" y="${GT + GR * SQ + 22}" text-anchor="middle" class="fc-u">1 small square = ${S.sq} g per m² of dry biomass</text><text x="${GCX}" y="${GT + GR * SQ + 40}" text-anchor="middle" class="fc-u fc-sm">values simplified so every bar can be drawn</text>`;
  if (opt.plotMode) s += `<rect x="${GL}" y="${GT}" width="${GC * SQ}" height="${GR * SQ}" fill="transparent" class="plothit"/>`;
  return `<svg viewBox="0 0 520 ${GT + GR * SQ + 50}" class="figsvg fig-${KEY}" role="img" aria-label="A pyramid of biomass drawn to scale on a grid, with one bar missing">${s}</svg>`;
}

function svg(F, opt) {
  opt = opt || {};
  const panel = opt.panel || (opt.hl && opt.hl.panel) || "web";
  if (panel === "chain") return chainSVG(F, opt);
  if (panel === "pyramid") return pyramidSVG(F, opt);
  if (panel === "scale") return scaleSVG(F, opt);
  return webSVG(F, opt);
}

/* ---------- questions ---------- */
function questions(F, r) {
  const qs = [], W = F.W, nm = (k) => W.n[k][0], C = F.ch;
  // 1. % transfer between two levels (stated rounding)
  const a = F.lo, b = F.hi, what = F.energy ? "energy" : "biomass";
  qs.push({ kind: "num", q: `Calculate the percentage of the ${what} in the <b>${nm(C[a])}</b> that is transferred to the <b>${nm(C[b])}</b>. Give your answer to 1 decimal place.`, ans: F.pct, tol: 0.05, unit: "%", dp: 1,
    askOpt: { panel: "chain" }, hl: { panel: "chain", lv: [a, b] },
    why: `Percentage transferred = (${what} at the higher level ÷ ${what} at the lower level) × 100 = (${F.v[b].toLocaleString("en-GB")} ÷ ${F.v[a].toLocaleString("en-GB")}) × 100 = ${fmt(Math.round(F.raw * 1000) / 1000)} = <b>${fmt(F.pct, 1)} %</b> to 1 d.p. Divide the higher level by the lower level, not the other way round.` });
  // 2. name the secondary consumer (options = the chain's own organisms)
  const tgt = r() < 0.6 ? 2 : r() < 0.5 ? 1 : 3;
  qs.push({ kind: "choice", q: `In this food chain, which organism is the <b>${LV[tgt]}</b>?`, options: [nm(C[tgt]), ...C.filter((_, i) => i !== tgt).map(nm)], a: 0,
    askOpt: { panel: "chain" }, hl: { panel: "chain", lv: [tgt] },
    why: `The chain starts with the producer (${nm(C[0])}). The primary consumer eats the producer (${nm(C[1])}), the secondary consumer eats the primary consumer (${nm(C[2])}) and the tertiary consumer eats the secondary consumer (${nm(C[3])}). So the ${LV[tgt]} is <b>${nm(C[tgt])}</b>.` });
  // 3. reasons for energy loss (mark-scheme points true; misconceptions false)
  const st = [
    ["Energy is used in respiration by the organisms at each level.", true, "Respiration releases energy for life processes; it is not passed on."],
    ["Energy is used for movement.", true, "Energy used to move is not stored in the body, so it cannot be passed on."],
    ["Not all of each organism is eaten by the next level.", true, "Uneaten parts (and organisms that are never eaten) keep their energy out of the chain."],
    ["Some material is not digested and is lost in faeces.", true, "Undigested food is egested and its energy does not reach the consumer."],
    ["Some energy is lost in excretion.", true, "Waste such as urea removed by excretion contains energy."],
    ["Energy is destroyed each time one organism eats another.", false, "Energy is never destroyed; it is transferred, mostly to the surroundings."],
    ["Energy is passed back down to the producers by the nutrient cycle.", false, "Nutrients are recycled, but energy flows one way and is not returned to producers."],
    ["The organisms at each higher level are smaller, so they can hold less energy.", false, "Size is not the reason: energy is lost at every level (respiration, movement, excretion, uneaten and undigested material), whatever the size of the organisms."],
  ];
  const pick = pickMixed(r, st, 5);
  qs.push({ kind: "multi", q: `Only a small part of the ${what} at one trophic level reaches the next. Tick every statement that helps to explain why.`, options: pick.map((x) => x[0]), a: pick.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0),
    askOpt: { panel: "chain" }, hl: { panel: "chain" },
    why: pick.map((x) => `${x[1] ? "✓" : "✗"} ${x[0]}: ${x[2]}`).join("<br>") });
  // 4. tap a level on the pyramid (bars unlabelled while asking)
  const lv = pickR(r, [1, 2, 3]);
  qs.push({ kind: "tap", q: `This pyramid is for the food chain shown above it. Tap the bar for the <b>${LV[lv]}</b> (${nm(C[lv])}).`, a: [`L${lv}`], ansTxt: `bar ${lv + 1} from the bottom`, labelOf: (id) => `bar ${+id.slice(1) + 1} from the bottom`,
    askOpt: { panel: "pyramid", tapMode: true }, doneOpt: () => ({ panel: "pyramid", tapMode: true, hl: { panel: "pyramid", labels: true } }),
    why: `The producer is always the bottom bar, whatever the shape of the pyramid. Counting up: ${C.map((k, i) => `${i + 1} = ${nm(k)}`).join(", ")}. So the ${LV[lv]} is <b>bar ${lv + 1}</b>.` });
  // 5. explain the shape of the pyramid
  if (F.pyr === "numbersKelp") qs.push({ kind: "choice", q: "In this pyramid of numbers the bottom bar is narrower than the bar above it. Why?",
    options: ["Each kelp plant is large, so it can feed many sea urchins", "The kelp contains less energy than the sea urchins", "The width of each bar shows how big the organisms are", "The pyramid has been drawn the wrong way up"], a: 0,
    askOpt: { panel: "pyramid" }, hl: { panel: "pyramid", labels: true, lv: [0, 1] },
    why: "A pyramid of numbers shows how many organisms are at each level. A few large kelp plants can feed many small sea urchins, so the producer bar can be narrower. The energy at each level still decreases going up; the bar width shows numbers, not size or energy." });
  else if (F.pyr === "numbers") qs.push({ kind: "choice", q: "Why does each bar of this pyramid of numbers get narrower going up?",
    options: ["Energy is lost at each level, so fewer organisms can be supported", "Organisms higher up are bigger, so they need less food in total", "Energy is destroyed each time one organism eats another", "The organisms at the top reproduce more slowly than plankton"], a: 0,
    askOpt: { panel: "pyramid" }, hl: { panel: "pyramid", labels: true },
    why: "At each level energy is lost (in respiration, movement, excretion and uneaten or undigested material), so there is less energy to support the level above and the number of organisms usually falls. Energy is never destroyed, and being bigger means each animal needs <i>more</i> food, not less." });
  else qs.push({ kind: "choice", q: "A pyramid of energy is always this shape. Why?",
    options: ["Energy is lost at each level, for example in respiration and movement", "Energy is destroyed each time one organism eats another", "The top predators are larger, so they need less energy", "Energy flows back down the chain to the producers"], a: 0,
    askOpt: { panel: "pyramid" }, hl: { panel: "pyramid", labels: true },
    why: "Only part of the energy at one level reaches the next; the rest is lost in respiration, movement, excretion and in uneaten or undigested material. So each bar is smaller than the one below, and a pyramid of energy is always upright. Energy is not destroyed and it does not return to producers." });
  // 5b. pyramid of biomass to scale: read one bar, then draw the missing bar
  const S = F.scale, rd = S.read, ms = S.miss, rv = S.w[rd] * S.sq, mv = S.w[ms] * S.sq;
  qs.push({ kind: "num", q: `This pyramid of biomass, for a food chain ${S.place}, is drawn to scale. Use the scale to work out the dry biomass of the <b>${S.names[rd]}</b>.`, ans: rv, tol: 0, unit: "g per m²",
    askOpt: { panel: "scale" }, hl: { panel: "scale", lv: [rd] },
    why: `Count the small squares across the ${S.names[rd]} bar: ${S.w[rd]} squares. Each small square is ${S.sq} g per m², so the biomass is ${S.w[rd]} × ${S.sq} = <b>${rv} g per m²</b>. Use the whole width of the bar, not half of it. The bar edges are on grid lines, so the count is exact.` });
  qs.push({ kind: "plot", q: `The bar for the <b>${S.names[ms]}</b> is missing. Its dry biomass is <b>${mv} g per m²</b>. Tap the grid to draw the bar to scale, in the centre like the others.`, hl: { panel: "scale", lv: [ms], showMiss: true },
    askOpt: { panel: "scale", plotMode: true },
    plot: {
      start: { w: 0 }, answer: { w: S.w[ms] }, hint: "Tap the grid where the right-hand end of the bar should be.",
      fromTap: (p) => ({ w: Math.max(2, Math.min(GC, 2 * Math.round(Math.abs(p.x - GCX) / SQ))) }),
      nudges: [["-", "◀ narrower", "Make the bar one small square narrower on each side"], ["+", "wider ▶", "Make the bar one small square wider on each side"]],
      nudge: (st, k) => ({ w: Math.max(2, Math.min(GC, (st.w || 0) + (k === "+" ? 2 : -2))) }),
      label: (st) => `Your bar is ${st.w} small squares wide.`,
      check: (st) => st.w === S.w[ms],
    },
    doneOpt: (st, ok) => ({ panel: "scale", state: ok ? null : st, hl: { panel: "scale", lv: [ms], showMiss: true } }),
    doneNote: (st, ok) => (ok ? "" : `Highlighted: the correct bar, ${S.w[ms]} small squares wide. Your bar has the orange outline.`),
    why: `Width = biomass ÷ value of one small square = ${mv} ÷ ${S.sq} = <b>${S.w[ms]} small squares</b>, so the bar reaches ${S.w[ms] / 2} squares either side of the centre line. Every bar is the same height; only the width shows the biomass. A pyramid of biomass drawn to scale lets you compare the levels by eye.` });
  // 6. effect of removing an organism (authored per web)
  const sc = pickR(r, W.scen);
  qs.push({ kind: "choice", q: sc.q, options: sc.o, a: 0, askOpt: { panel: "web" }, hl: { panel: "web" }, why: sc.why });
  // 7. build a 4-level chain from the web (order; the chain's order is unique)
  qs.push({ kind: "order", q: `Use the food web to put these organisms into a food chain, starting with the producer.`, options: C.map(nm), a: [0, 1, 2, 3],
    askOpt: { panel: "web" }, hl: { panel: "web", nodes: C },
    why: `Follow the arrows from the producer: ${C.map(nm).join(" → ")}. Each arrow points from the food to the organism that eats it, in the direction energy is transferred.` });
  // keep 8: drop either "name the level" (q1) or "tap the bar" (q3); both test the order of trophic levels
  qs.splice(r() < 0.5 ? 1 : 3, 1);
  return qs;
}

function selfTest(F, qs) {
  const bad = [], W = F.W;
  if (!validChain(W, F.ch)) bad.push("chain not in web");
  if (perms(F.ch).filter((p) => validChain(W, p)).length !== 1) bad.push("chain order not unique");
  for (let i = 1; i < 4; i++) if (!(F.v[i] < F.v[i - 1])) bad.push("values not decreasing");
  if (Math.abs(F.pct - Math.round(F.v[F.hi] / F.v[F.lo] * 1000) / 10) > 1e-9) bad.push("pct");
  for (const sc of W.scen) if (new Set(sc.o).size !== sc.o.length) bad.push("dup scen options");
  // authored scenario facts still match the web
  const has = (a, b) => W.e.some((e) => W.n[e[0]][0] === a && W.n[e[1]][0] === b);
  if (W.id === "kelp" && !(has("sea otter", "orca") && has("sea urchin", "sea otter") && has("kelp", "sea urchin") && has("herring", "seal"))) bad.push("kelp facts");
  if (W.id === "ocean" && !(has("squid", "tuna") && has("sardine", "tuna") && W.e.filter((e) => e[1] === "bird").length === 1)) bad.push("ocean facts");
  if (W.id === "shore" && !(has("seaweed", "limpet") && has("barnacle", "dog whelk") && !W.e.some((e) => e[0] === "weed" && e[1] === "crab"))) bad.push("shore facts");
  if (W.id === "reef" && !(has("algae", "parrotfish") && has("damselfish", "grouper") && has("parrotfish", "grouper"))) bad.push("reef facts");
  // every node box must not overlap another
  const ks = Object.keys(W.n); for (let i = 0; i < ks.length; i++) for (let j = i + 1; j < ks.length; j++) { const A = W.n[ks[i]], B = W.n[ks[j]]; if (Math.abs(A[1] - B[1]) < BW && Math.abs(A[2] - B[2]) < BH) bad.push("boxes overlap"); }
  const sec = qs.find((q) => q.kind === "choice" && /which organism is the/.test(q.q)); if (sec && sec.options[sec.a] !== W.n[F.ch[2]][0] && !/primary|tertiary/.test(sec.q)) bad.push("secondary");
  const S = F.scale; if (!S.w.every((w, i) => w % 2 === 0 && w >= 2 && w <= GC && (!i || w < S.w[i - 1]))) bad.push("scale widths");
  if (!["kelp", "seaweed", "algae"].includes(S.names[0])) bad.push("scale producer not seaweed");
  if (S.w[S.miss] < 6 || S.read === S.miss || S.w.length !== 3) bad.push("scale miss/read");
  for (let i = 1; i < 3; i++) if (S.w[i] / S.w[i - 1] > 0.4) bad.push("scale ratio");
  const pq = qs.find((q) => q.kind === "plot"); if (!pq || pq.plot.check({ w: S.w[S.miss] + 2 }) || pq.plot.check({ w: S.w[S.miss] - 2 })) bad.push("scale plot tolerance");
  return bad;
}

export default {
  key: KEY, group: "Diagrams", name: "Marine food chains and pyramids", topics: "Unit 4 (4.4)", thumbSeed: 3,
  blurb: "Marine food webs and chains with biomass or energy values; pyramids of numbers and energy, and a pyramid of biomass to read and draw to scale.",
  tips: ["Arrows point from the food to the organism that eats it: the direction energy is transferred.", "Producer → primary consumer → secondary consumer → tertiary consumer.", "% transferred = (value at the higher level ÷ value at the lower level) × 100.", "Energy is lost at each level through respiration, movement and excretion, and in parts that are not eaten or not digested.", "The producer is always the bottom bar. A pyramid of numbers can be any shape; a pyramid of energy is always upright.", "To draw a pyramid to scale, width = value ÷ value of one small square. Keep every bar the same height and centre each one."],
  ctx: (F) => `a food web in ${F.place}` + (F.scale && F.scale.web !== F.W.id ? `, and a food chain ${F.scale.place}` : ""),
  make, svg, questions, selfTest,
  css: `.fig-foodchain .fc-box{fill:var(--surface2);stroke:currentColor;stroke-width:1.6}.fig-foodchain .fc-box.hl{fill:color-mix(in srgb,var(--app) 55%,transparent);stroke-width:2.4}
.fig-foodchain .fc-t{font-size:17px;font-weight:600}.fig-foodchain .fc-ts{font-size:15px}.fig-foodchain .fc-v{font-size:18px;font-weight:700}.fig-foodchain.fc-chain{max-width:420px}.fig-foodchain .fc-u{font-size:15px}.fig-foodchain .fc-sm{font-size:13px;opacity:.85}
.fig-foodchain .fc-arr{stroke:currentColor;stroke-width:2}.fig-foodchain .fc-ah{fill:currentColor}
.fig-foodchain .fc-bar{fill:color-mix(in srgb,var(--ink) 22%,transparent);stroke:currentColor;stroke-width:1.5}.fig-foodchain .fc-bar.hl{fill:color-mix(in srgb,var(--app) 60%,transparent)}
.fig-foodchain .fc-miss{stroke:currentColor;stroke-width:1.2;stroke-dasharray:4 4;opacity:.5}.fig-foodchain .fc-mine{fill:none;stroke:var(--accent);stroke-width:3}.fig-foodchain .fc-halo{paint-order:stroke;stroke:var(--surface);stroke-width:4px;stroke-linejoin:round}`,
};
