/* ---------- HISTOGRAMS AND PIE CHARTS (0697 Mathematical requirements: interpret pie charts and histograms with
   equal intervals; Presentation of data) ----------
   Histogram mode: lengths of fish, crabs or limpets grouped into equal classes (bars touch, continuous data).
   Pie mode: the make-up of a beach-litter survey or a fish catch, with a 100-division ring for reading percentages.
   Contexts: 5.2 sampling, 6.3 fisheries (minimum landing size), 6.6 plastic pollution. Data are generated. */
import { rng, pickR, shuffleR, fmt } from "../core.js";

const KEY = "mcharts";
const HIST = [
  { id: "fish", what: "the lengths of mackerel caught by a fishing boat", animal: "mackerel", var: "length", unit: "cm", w: 2, start: 20, k: 7, xl: "length / cm", minSize: true },
  { id: "crab", what: "the carapace widths of shore crabs found on a rocky shore", animal: "crabs", var: "carapace width", unit: "mm", w: 5, start: 20, k: 7, xl: "carapace width / mm" },
  { id: "limpet", what: "the shell lengths of limpets measured on a rocky shore", animal: "limpets", var: "shell length", unit: "mm", w: 5, start: 10, k: 6, xl: "shell length / mm" },
];
const PIE = [
  { id: "litter", what: "the types of litter collected on a beach survey", items: "pieces of litter", cats: ["plastic bottles and caps", "plastic bags and wrappers", "fishing nets and rope", "glass", "metal cans", "cigarette ends"], plastic: [0, 1, 2] },
  { id: "catch", what: "the species landed by a fishing fleet in one year", items: "tonnes of fish", cats: ["mackerel", "herring", "cod", "sardines", "tuna", "squid"] },
];

function make(seed) {
  const r = rng(seed);
  if (r() < 0.5) {
    const C = pickR(r, HIST);
    for (let t = 0; t < 300; t++) {
      const peak = 1 + Math.floor(r() * (C.k - 2)), f = [];
      for (let i = 0; i < C.k; i++) f.push(Math.max(1, Math.round((14 + r() * 6) * Math.exp(-0.5 * ((i - peak) / (1.2 + r() * 0.5)) ** 2) + r() * 2)));
      const mx = Math.max(...f); if (f.filter((x) => x === mx).length !== 1 || mx > 22 || mx < 9) continue;
      const tot = f.reduce((a, b) => a + b, 0); if (tot < 30 || tot > 90) continue;
      const cut = 1 + Math.floor(r() * (C.k - 2));                 // classes at or above this index count as "at least" the threshold
      return { kind: KEY, seed, mode: "hist", C, f, tot, cut, ask: pickR(r, [...Array(C.k).keys()].filter((i) => f[i] !== mx)) };
    }
    return make(seed + 1);
  }
  const C = pickR(r, PIE);
  for (let t = 0; t < 300; t++) {
    const n = 4 + Math.floor(r() * 2), w = Array.from({ length: n }, () => 0.5 + r() * 2), sw = w.reduce((a, b) => a + b, 0);
    let p = w.map((x) => Math.max(4, Math.round(100 * x / sw)));
    p[0] += 100 - p.reduce((a, b) => a + b, 0);
    if (p.some((x) => x < 4) || new Set(p).size !== n) continue;
    const order = shuffleR(r, [...Array(C.cats.length).keys()]).slice(0, n);
    const total = pickR(r, C.id === "litter" ? [400, 500, 600, 800, 1200] : [2000, 4000, 5000, 8000]);
    return { kind: KEY, seed, mode: "pie", C, p, cats: order.map((i) => C.cats[i]), total };
  }
  return make(seed + 1);
}

/* ---- drawing */
function histSVG(F, opt) {
  const C = F.C, W = 560, H = 420, L = 64, R = 20, T = 30, B = 70, pw = W - L - R, ph = H - T - B, hl = opt.hl || {};
  const ymax = 24, sy = ph / ymax, bw = pw / C.k, X = (i) => L + i * bw, Y = (v) => T + ph - v * sy;
  let s = "";
  for (let i = 0; i <= ymax; i++) s += `<line x1="${L}" x2="${L + pw}" y1="${Y(i)}" y2="${Y(i)}" class="${i % 2 ? "gmin" : "gmaj"}"/>`;
  for (let i = 0; i <= ymax; i += 2) s += `<text x="${L - 8}" y="${Y(i) + 5}" text-anchor="end">${i}</text>`;
  F.f.forEach((v, i) => { s += `<rect x="${X(i)}" y="${Y(v)}" width="${bw}" height="${v * sy}" class="fbar${(hl.bars || []).includes(String(i)) ? " hl" : ""}"${opt.tapMode ? ` data-tap="${i}"` : ""}/>`; });
  for (let i = 0; i <= C.k; i++) s += `<text x="${X(i)}" y="${T + ph + 20}" text-anchor="middle">${C.start + i * C.w}</text>`;
  s += `<line x1="${L}" x2="${L + pw}" y1="${T + ph}" y2="${T + ph}" class="axis"/><line x1="${L}" x2="${L}" y1="${T}" y2="${T + ph}" class="axis"/>`;
  s += `<text x="${L + pw / 2}" y="${H - 22}" text-anchor="middle">${C.xl}</text><text transform="translate(18 ${T + ph / 2}) rotate(-90)" text-anchor="middle">number of ${C.animal}</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="figsvg fig-${KEY}" role="img" aria-label="Histogram of ${C.what}">${s}</svg>`;
}
function pieSVG(F, opt) {
  const W = 560, H = 416 + Math.ceil(F.cats.length / 2) * 32, cx = 280, cy = 190, R0 = 150, hl = opt.hl || {};
  const pt = (pc, rr) => { const a = -Math.PI / 2 + pc / 100 * 2 * Math.PI; return [cx + rr * Math.cos(a), cy + rr * Math.sin(a)]; };
  let s = "", acc = 0;
  F.p.forEach((pc, i) => {
    const [x1, y1] = pt(acc, R0), [x2, y2] = pt(acc + pc, R0), big = pc > 50 ? 1 : 0;
    s += `<path d="M${cx} ${cy} L${x1.toFixed(1)} ${y1.toFixed(1)} A${R0} ${R0} 0 ${big} 1 ${x2.toFixed(1)} ${y2.toFixed(1)} Z" class="pc-s pc-s${i}${(hl.sectors || []).includes(String(i)) ? " hl" : ""}"${opt.tapMode ? ` data-tap="${i}"` : ""}/>`;
    const [lx, ly] = pt(acc + pc / 2, R0 * 0.62); s += `<text x="${lx.toFixed(1)}" y="${(ly + 5).toFixed(1)}" text-anchor="middle" class="pc-n">${String.fromCharCode(65 + i)}</text>`;
    acc += pc;
  });
  for (let i = 0; i < 100; i++) { const [a, b] = pt(i, R0), [c, d] = pt(i, R0 + (i % 10 ? 6 : i % 5 ? 9 : 12)); s += `<line x1="${a.toFixed(1)}" y1="${b.toFixed(1)}" x2="${c.toFixed(1)}" y2="${d.toFixed(1)}" class="pc-t"/>`; }
  for (let i = 0; i < 100; i += 10) { const [a, b] = pt(i, R0 + 26); s += `<text x="${a.toFixed(1)}" y="${(b + 5).toFixed(1)}" text-anchor="middle" class="pc-k">${i}</text>`; }
  s += `<text x="${cx}" y="${cy + R0 + 48}" text-anchor="middle" class="pc-k">outer scale: percentage (each small mark = 1%)</text>`;
  F.cats.forEach((c, i) => { const kx = 24 + (i % 2) * 270, ky = cy + R0 + 70 + Math.floor(i / 2) * 32; s += `<rect x="${kx}" y="${ky}" width="20" height="20" class="pc-s pc-s${i}"/><text x="${kx + 28}" y="${ky + 15}" class="pc-l">${String.fromCharCode(65 + i)}: ${c}</text>`; });
  return `<svg viewBox="0 0 ${W} ${H}" class="figsvg fig-${KEY}" role="img" aria-label="Pie chart of ${F.C.what}">${s}</svg>`;
}
function svg(F, opt) { opt = opt || {}; return F.mode === "hist" ? histSVG(F, opt) : pieSVG(F, opt); }

/* geometry of the histogram, shared by the guide axes and the reading point (matches histSVG). */
const histGeo = (C) => { const L = 64, T = 30, pw = 476, ph = 320, bw = pw / C.k; return { L, T, pw, ph, bw, X: (i) => L + i * bw, Y: (v) => T + ph - v * (ph / 24) }; };
/* axes for the reading guide: the histogram only (a pie chart has no cartesian axes). */
function axes(F) {
  if (F.mode !== "hist") return [];
  const C = F.C, G = histGeo(C);
  const yt = []; for (let i = 0; i <= 24; i++) yt.push({ at: G.Y(i), label: i % 2 === 0 ? String(i) : undefined });
  const xt = []; for (let i = 0; i <= C.k; i++) xt.push({ at: G.X(i), label: String(C.start + i * C.w) });
  return [{ plot: { x0: G.L, x1: G.L + G.pw, y0: G.T, y1: G.T + G.ph }, x: { ticks: xt }, y: { ticks: yt } }];
}

/* ---- questions */
const cls = (C, i) => `${C.start + i * C.w}–${C.start + (i + 1) * C.w} ${C.unit}`;
function questions(F, r) {
  const qs = [];
  if (F.mode === "hist") {
    const C = F.C, f = F.f, mi = f.indexOf(Math.max(...f)), thr = C.start + F.cut * C.w, over = f.slice(F.cut).reduce((a, b) => a + b, 0), pc = over / F.tot * 100, Gh = histGeo(C);
    qs.push({ kind: "num", q: `How many ${C.animal} had a ${C.var} in the class ${cls(C, F.ask)}?`, ans: f[F.ask], tol: 0, unit: "", hl: { bars: [String(F.ask)], guide: { x: Gh.X(F.ask) + Gh.bw / 2, y: Gh.Y(f[F.ask]) } },
      why: `Go to the top of the bar for ${cls(C, F.ask)} and read across: <b>${f[F.ask]}</b> ${C.animal}. Each grid line is one animal.` });
    qs.push({ kind: "tap", q: `Tap the bar for the class with the most ${C.animal}.`, a: [String(mi)], askOpt: { tapMode: true }, doneOpt: () => ({ tapMode: true }), hl: { bars: [String(mi)] },
      labelOf: (id) => cls(C, +id), ansTxt: cls(C, mi), why: `The class with the most ${C.animal} is the tallest bar: <b>${cls(C, mi)}</b>, with ${f[mi]} ${C.animal}. (This is sometimes called the modal class.)` });
    qs.push({ kind: "num", q: `How many ${C.animal} were measured altogether?`, ans: F.tot, tol: 0, unit: "",
      why: `Add the frequencies of every bar: ${f.join(" + ")} = <b>${F.tot}</b>.` });
    const ans = Math.round(pc);
    qs.push({ kind: "num", q: C.minSize ? `Mackerel shorter than ${thr} cm must be returned to the sea (a minimum landing size). What percentage of the catch was ${thr} cm or longer? Give your answer to the nearest whole number.` : `What percentage of the ${C.animal} had a ${C.var} of ${thr} ${C.unit} or more? Give your answer to the nearest whole number.`,
      ans, tol: 0, unit: "%", check: (v) => Math.abs(v - ans) < 1e-9 || Math.abs(v - pc) < 0.051, hl: { bars: f.map((_, i) => String(i)).slice(F.cut) },
      why: `Add the bars from ${thr} ${C.unit} upwards: ${f.slice(F.cut).join(" + ")} = ${over}. Then ${over} ÷ ${F.tot} × 100 = ${fmt(Math.round(pc * 100) / 100)} = <b>${ans}%</b> to the nearest whole number.` });
    qs.push({ kind: "choice", q: "Why are the bars of this histogram drawn touching each other?", options: ["The data are continuous, so each class runs straight on into the next", "The bars touch to save space, so that more classes fit on the axis", "Touching bars show that every animal was measured accurately", "The data are categories, so there is no gap between the categories"], a: 0,
      why: `${C.var[0].toUpperCase() + C.var.slice(1)} is continuous: any value is possible, so the classes join with no gaps (${cls(C, 0)}, then ${cls(C, 1)}, and so on). A bar chart of separate categories, such as species, has gaps between the bars.` });
    qs.push({ kind: "choice", q: `What type of data is shown in this histogram?`, options: ["continuous data, grouped into equal classes", "discrete data, counted in whole numbers", "categoric data, sorted into named groups", "ranked data, listed from largest to smallest"], a: 0,
      why: `The ${C.var} of an animal can take any value, so it is continuous data. It has been grouped into equal classes of ${C.w} ${C.unit}, and the height of each bar shows how many animals fall in that class.` });
    return qs;
  }
  const P = F.p, cats = F.cats, L = (i) => `${String.fromCharCode(65 + i)} (${cats[i]})`;
  const ia = Math.floor(r() * P.length);
  qs.push({ kind: "num", q: `Use the percentage scale around the pie chart. What percentage of the ${F.C.items} were ${cats[ia]}?`, ans: P[ia], tol: 0.5, unit: "%", hl: { sectors: [String(ia)] },
    why: `Count the small marks on the outer scale across sector ${String.fromCharCode(65 + ia)}: it runs for <b>${P[ia]}%</b> (each small mark is 1%). Readings are accepted to within half a small mark (0.5%).` });
  const so = [...P.keys()].sort((x, y) => P[y] - P[x]), second = so[1];
  qs.push({ kind: "tap", q: `Tap the sector that is the second largest.`, a: [String(second)], askOpt: { tapMode: true }, doneOpt: () => ({ tapMode: true }), hl: { sectors: [String(second)] },
    labelOf: (id) => L(+id), ansTxt: L(second), why: `The largest sector is ${L(so[0])} at ${P[so[0]]}%, and the second largest is <b>${L(second)}</b> at ${P[second]}%.` });
  const ib = pickR(r, [...P.keys()].filter((i) => i !== ia)), num = P[ib] * F.total / 100, lo = (P[ib] - 0.5) * F.total / 100, hi = (P[ib] + 0.5) * F.total / 100;
  qs.push({ kind: "num", q: `The survey recorded ${F.total} ${F.C.items} in total. How many of them were ${cats[ib]}?`, ans: num, tol: 0, unit: "", check: (v) => v >= lo - 1e-9 && v <= hi + 1e-9, hl: { sectors: [String(ib)] },
    why: `Read sector ${String.fromCharCode(65 + ib)}: ${P[ib]}%. Then ${P[ib]} ÷ 100 × ${F.total} = <b>${fmt(num)}</b> ${F.C.items}. (Any answer from a reading within half a small mark, 0.5%, is accepted: ${fmt(lo)} to ${fmt(hi)}.)` });
  const ang = P[ia] * 3.6;
  qs.push({ kind: "num", q: `What angle at the centre of the pie chart does the sector for ${cats[ia]} have? (A whole circle is 360°.)`, ans: ang, tol: 0, unit: "°", check: (v) => v >= (P[ia] - 0.5) * 3.6 - 1e-9 && v <= (P[ia] + 0.5) * 3.6 + 1e-9, hl: { sectors: [String(ia)] },
    why: `Each 1% of a pie chart is 360 ÷ 100 = 3.6°. So ${P[ia]}% × 3.6 = <b>${fmt(ang)}°</b>.` });
  qs.push({ kind: "choice", q: "Why is a pie chart a suitable way to present these data?", options: ["It shows how each category makes up a share of the whole", "It shows how the amounts changed over time", "It shows a relationship between two continuous variables", "It shows the exact number in each category"], a: 0,
    why: "A pie chart shows parts of a whole: each sector is a share of the total. Changes over time need a line graph, how one variable changes with another needs a line graph, and the exact numbers are clearer in a table or a bar chart." });
  if (F.C.plastic) {
    const pl = F.C.plastic.map((c) => F.C.cats[c]), sum = cats.reduce((a, c, i) => a + (pl.includes(c) ? P[i] : 0), 0), np = cats.filter((c) => pl.includes(c)).length;
    const named = cats.filter((c) => pl.includes(c)), list = named.map((c) => `${String.fromCharCode(65 + cats.indexOf(c))} (${c})`).join(", ");
    if (np >= 2) { qs.push({ kind: "num", q: `In this survey, the litter in sectors ${list} is made of plastic. What percentage of the litter was plastic?`, ans: sum, tol: 0, unit: "%", check: (v) => Math.abs(v - sum) <= 0.5 * np + 1e-9,
      why: `Add the plastic sectors: ${cats.map((c, i) => (pl.includes(c) ? `${P[i]}%` : null)).filter(Boolean).join(" + ")} = <b>${sum}%</b>. (Small reading differences in each sector are accepted.)` }); return qs; }
  }
  const big = so[0], small = so[so.length - 1], ratio = P[big] / P[small];
  qs.push({ kind: "choice", q: `Which statement about the pie chart is correct?`, options: [`${cats[big]} made up a larger share than any other category.`, `${cats[small]} made up the largest share of the total.`, `Every category made up the same share of the total.`, P[big] === 50 ? `${cats[big]} made up exactly a quarter of the total.` : `${cats[big]} made up exactly half of the total.`], a: 0,
    why: `${L(big)} is the biggest sector at ${P[big]}%, and ${L(small)} the smallest at ${P[small]}%, so it is about ${fmt(Math.round(ratio * 10) / 10)} times as large (${P[big] - P[small]} percentage points more).` });
  return qs;
}

function selfTest(F, qs) {
  const bad = [];
  if (F.mode === "pie") { if (F.p.reduce((a, b) => a + b, 0) !== 100) bad.push("pie not 100%"); const last = qs[qs.length - 1];
    if (last.kind === "choice" && new Set(last.options).size !== 4) bad.push("compare options"); }
  else { if (F.f.reduce((a, b) => a + b, 0) !== F.tot) bad.push("total"); if (F.cut < 1 || F.cut > F.C.k - 2) bad.push("cut"); }
  return bad;
}

export default {
  key: KEY, group: "Graphs and charts", name: "Histograms and pie charts", topics: "Presentation of data; 5.2, 6.3, 6.6", thumbSeed: 2,
  ctx: (F) => F.C.what,
  blurb: "Read a histogram of animal sizes or a pie chart of a survey: frequencies, the largest class, percentages and angles.",
  tips: ["A histogram shows continuous data in equal classes, so the bars touch.", "The class with the most is the tallest bar.", "On a pie chart each 1% is 3.6°, because a whole circle is 360°.", "Percentage of a total × the total ÷ 100 gives the number."],
  make, svg, axes, questions, selfTest,
  css: `.fig-mcharts .pc-s{stroke:currentColor;stroke-width:1.2}.fig-mcharts .pc-s0{fill:color-mix(in srgb,var(--ink) 38%,transparent)}.fig-mcharts .pc-s1{fill:color-mix(in srgb,var(--ink) 10%,transparent)}.fig-mcharts .pc-s2{fill:color-mix(in srgb,#4aa8d8 50%,transparent)}.fig-mcharts .pc-s3{fill:color-mix(in srgb,#e0a030 45%,transparent)}.fig-mcharts .pc-s4{fill:color-mix(in srgb,#6cbf7a 45%,transparent)}.fig-mcharts .pc-s5{fill:color-mix(in srgb,#c77dc9 45%,transparent)}.fig-mcharts .pc-s.hl{fill:color-mix(in srgb,var(--app) 70%,transparent)}.fig-mcharts .pc-n{font-weight:700;font-size:15px}.fig-mcharts .pc-t{stroke:currentColor;stroke-width:1}.fig-mcharts .pc-k{font-size:12.5px;fill:var(--soft)}.fig-mcharts .pc-l{font-size:14px}.fig-mcharts .pc-h{font-weight:700}`,
};
