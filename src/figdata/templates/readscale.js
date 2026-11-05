/* ---------- READING APPARATUS SCALES (0697 AO3: take readings from apparatus with appropriate precision) ----------
   A measuring cylinder (meniscus) or a thermometer drawn with a generated reading. Skills: the value of one small
   division, reading the scale (to the nearest division), where to read a meniscus and at what eye level, recording to
   the instrument's precision, choosing a sensible measuring cylinder, and a change between two readings (volume of an
   object by displacement; temperature rise when food is burned). Data are generated. */
import { rng, pickR, shuffleR, fmt } from "../core.js";

const KEY = "readscale";
const CYL = [ // capacity, small division, labelled every
  { cap: 10, d: 0.2, lab: 1 }, { cap: 25, d: 0.5, lab: 5 }, { cap: 50, d: 1, lab: 10 }, { cap: 100, d: 1, lab: 10 },
];
const THERM = [ { lo: -10, hi: 110, d: 1, lab: 10 }, { lo: 0, hi: 50, d: 0.5, lab: 10 } ];
const dpOf = (d) => (d < 1 ? (d < 0.5 ? 1 : 1) : 0);
const q = (v, d) => Math.round(v / d) * d;

function make(seed) {
  const r = rng(seed), mode = r() < 0.55 ? "cyl" : "therm";
  if (mode === "cyl") {
    const I = pickR(r, CYL), n = Math.round(I.cap / I.d);
    const k = Math.round(n * (0.25 + r() * 0.6)), v = Math.round(k * I.d * 1000) / 1000;
    // displacement: a starting volume before an object (a shell or pebble) was added
    const dk = Math.max(3, Math.round(k * (0.15 + r() * 0.35))), start = Math.round((k - dk) * I.d * 1000) / 1000;
    const want = pickR(r, I.cap === 10 ? [8, 9] : I.cap === 25 ? [20, 22, 24] : I.cap === 50 ? [40, 45] : [75, 80, 90]);
    return { kind: KEY, seed, mode, I, v, start, want, obj: pickR(r, ["a small shell", "a pebble", "a piece of coral rubble"]) };
  }
  const I = pickR(r, THERM), n = Math.round((I.hi - I.lo) / I.d);
  const lo = I.lo === -10 ? 15 : 10, hi = I.lo === -10 ? 85 : 45;
  let v; do { v = Math.round((lo + r() * (hi - lo)) / I.d) * I.d; } while (Math.abs(v - Math.round(v / 5) * 5) < 1e-9 && I.d === 1 && r() < 0.7); // avoid many multiples of 5
  v = Math.round(v * 10) / 10;
  const rise = I.d === 1 ? 6 + Math.floor(r() * 18) : 2 + Math.floor(r() * 16) * 0.5;
  return { kind: KEY, seed, mode, I, v, start: Math.round((v - rise) * 10) / 10, food: pickR(r, ["a peanut", "a piece of bread", "a crisp", "a piece of dried fish"]) };
}

/* ---- drawing */
function cylSVG(F, opt) {
  const I = F.I, W = 300, H = 440, x0 = 120, w = 70, top = 30, bot = 400, hl = opt.hl || {};
  const yOf = (vol) => bot - (vol / I.cap) * (bot - top - 20);
  let s = `<rect x="${x0}" y="${top}" width="${w}" height="${bot - top}" rx="6" class="rs-glass"/>`;
  const yv = yOf(F.v);
  // liquid with a concave meniscus: lowest point at the centre
  s += `<path d="M${x0 + 1} ${yv - 7} Q${x0 + w / 2} ${yv + 7} ${x0 + w - 1} ${yv - 7} L${x0 + w - 1} ${bot - 1} L${x0 + 1} ${bot - 1} Z" class="rs-liquid"/>`;
  const n = Math.round(I.cap / I.d);
  for (let i = 0; i <= n; i++) {
    const vol = i * I.d, y = yOf(vol), major = Math.abs(vol / I.lab - Math.round(vol / I.lab)) < 1e-9, mid = !major && Math.abs((vol / (I.lab / 2)) - Math.round(vol / (I.lab / 2))) < 1e-9;
    s += `<line x1="${x0}" x2="${x0 + (major ? 26 : mid ? 18 : 11)}" y1="${y}" y2="${y}" class="rs-tick"/>`;
    if (major) s += `<text x="${x0 - 8}" y="${y + 5}" text-anchor="end" class="rs-num">${fmt(vol)}</text>`;
  }
  s += `<text x="${x0 + w / 2}" y="${top - 10}" text-anchor="middle" class="rs-num">cm³</text>`;
  if (hl.read) s += `<line x1="${x0 - 30}" x2="${x0 + w + 30}" y1="${yv}" y2="${yv}" class="rs-hl"/>`;
  if (opt.tapMode) {
    s += `<rect x="${x0 + w / 2 - 14}" y="${yv - 5}" width="28" height="12" data-tap="bottom" class="rs-hit"/>`;
    s += `<rect x="${x0 - 2}" y="${yv - 15}" width="18" height="12" data-tap="edge" class="rs-hit"/>`;
    s += `<rect x="${x0 + w / 2 - 14}" y="${yv + 22}" width="28" height="12" data-tap="below" class="rs-hit"/>`;
  }
  s += `<text x="${W / 2}" y="${H - 8}" text-anchor="middle" class="rs-cap">${I.cap} cm³ measuring cylinder</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="figsvg fig-${KEY}" role="img" aria-label="A ${I.cap} cm³ measuring cylinder containing water">${s}</svg>`;
}
function thermSVG(F, opt) {
  const I = F.I, W = 300, H = 460, cx = 150, top = 26, bot = 390, hl = opt.hl || {};
  const yOf = (t) => bot - ((t - I.lo) / (I.hi - I.lo)) * (bot - top - 10);
  let s = `<rect x="${cx - 10}" y="${top - 12}" width="20" height="${bot - top + 22}" rx="10" class="rs-glass"/><circle cx="${cx}" cy="${bot + 26}" r="18" class="rs-bulb"/>`;
  const yv = yOf(F.v); s += `<rect x="${cx - 4}" y="${yv}" width="8" height="${bot + 12 - yv}" class="rs-red"/>`;
  const n = Math.round((I.hi - I.lo) / I.d);
  for (let i = 0; i <= n; i++) {
    const t = I.lo + i * I.d, y = yOf(t), major = Math.abs(t / I.lab - Math.round(t / I.lab)) < 1e-9, five = Math.abs(t / 5 - Math.round(t / 5)) < 1e-9;
    s += `<line x1="${cx + 12}" x2="${cx + 12 + (major ? 24 : five ? 16 : 9)}" y1="${y}" y2="${y}" class="rs-tick"/>`;
    if (major) s += `<text x="${cx + 42}" y="${y + 5}" class="rs-num">${fmt(t)}</text>`;
  }
  s += `<text x="${cx + 70}" y="${top - 2}" class="rs-num">°C</text>`;
  if (hl.read) s += `<line x1="${cx - 40}" x2="${cx + 70}" y1="${yv}" y2="${yv}" class="rs-hl"/>`;
  s += `<text x="${W / 2}" y="${H - 8}" text-anchor="middle" class="rs-cap">thermometer</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="figsvg fig-${KEY}" role="img" aria-label="A thermometer">${s}</svg>`;
}
function svg(F, opt) { opt = opt || {}; return F.mode === "cyl" ? cylSVG(F, opt) : thermSVG(F, opt); }

/* ---- questions */
function questions(F, r) {
  const I = F.I, qs = [], d = I.d, dp = d < 1 ? 1 : 0, u = F.mode === "cyl" ? "cm³" : "°C", V = fmt(F.v, dp);
  const inst = F.mode === "cyl" ? `${I.cap} cm³ measuring cylinder` : "thermometer";
  // 1. value of one small division
  qs.push({ kind: "num", q: `What is the value of one small division on the scale of this ${inst}?`, ans: d, tol: 0, unit: u, dp: d < 1 ? 1 : 0,
    why: `Take two labelled marks, find the difference between them, and divide by the number of small spaces between them: ${fmt(I.lab)} ${u} ÷ ${Math.round(I.lab / d)} spaces = <b>${fmt(d)} ${u}</b> per small division.` });
  // 2. read the scale
  qs.push({ kind: "num", q: F.mode === "cyl" ? `Read the volume of water in the measuring cylinder.` : `Read the temperature shown on the thermometer.`, ans: F.v, tol: d / 2, unit: u, dp, hl: { read: true },
    why: F.mode === "cyl" ? `Read the scale at the <b>bottom of the meniscus</b> (the curved surface of the water), with your eye level with it: <b>${V} cm³</b>. Each small division is ${fmt(d)} cm³.` : `Read where the top of the liquid column lies against the scale, with your eye level with it: <b>${V} °C</b>. Each small division is ${fmt(d)} °C.` });
  // 3. how to read (tap the meniscus point, or choice for the thermometer)
  if (F.mode === "cyl") qs.push({ kind: "tap", q: "Tap the point where the volume should be read.", a: ["bottom"], askOpt: { tapMode: true }, doneOpt: () => ({ tapMode: true }),
    labelOf: (id) => ({ bottom: "the bottom of the meniscus", edge: "the top edge, where the water touches the glass", below: "below the surface of the water" })[id], ansTxt: "the bottom of the meniscus",
    why: "Water curves up where it touches the glass, forming a meniscus. The reading is taken at the <b>bottom of the meniscus</b>, at the centre, with your eye level with it. Reading the raised edge gives a value that is too high." });
  else qs.push({ kind: "choice", q: "How should the thermometer be read to get an accurate temperature?",
    options: ["With your eye level with the top of the liquid, once the reading has stopped changing", "From above, looking down at the scale, as soon as the thermometer goes into the water", "After taking the thermometer out of the water, so the scale is easier to see", "From below, looking up at the scale, with the bulb resting on the bottom of the beaker"], a: 0,
    why: "Read at eye level to avoid parallax (looking from above or below shifts the apparent reading), and wait until the reading is steady. Taking the thermometer out lets the liquid change temperature, and the bulb should not rest on the bottom of a heated beaker." });
  // 4. record to the right precision
  const sh = (v) => fmt(v, dp), wrong = d < 1 ? [fmt(F.v, dp + 1), fmt(Math.round(F.v)), `about ${fmt(Math.round(F.v))}`] : [fmt(F.v, 1), fmt(F.v, 2), `about ${fmt(Math.round(F.v / 5) * 5)}`];
  const recOpts = [`${sh(F.v)} ${u}`, ...wrong.map((w) => `${w} ${u}`)].filter((x, i, a) => a.indexOf(x) === i);
  while (recOpts.length < 4) recOpts.push(`${fmt(F.v + d, dp)} ${u}`);
  qs.push({ kind: "choice", q: `A student records this reading in a results table. The ${inst} can be read to the nearest ${fmt(d)} ${u}. Which entry is recorded to the right precision?`, options: recOpts.slice(0, 4), a: 0, hl: { read: true },
    why: `Record a reading to the precision of the instrument, here the nearest ${fmt(d)} ${u}: <b>${sh(F.v)} ${u}</b>. Extra decimal places claim more precision than the scale has, rounding throws away information, and "about" is not a recorded value.` });
  // 5. a change between two readings
  if (F.mode === "cyl") {
    const ch = Math.round((F.v - F.start) * 1000) / 1000;
    qs.push({ kind: "num", q: `Before ${F.obj} was dropped in, the cylinder held ${fmt(F.start, dp)} cm³ of water. The reading shown was taken after it was added. What is the volume of ${F.obj}?`, ans: ch, tol: d / 2, unit: "cm³", dp, hl: { read: true },
      why: `The object pushes up (displaces) its own volume of water. Volume = final reading − starting reading = ${V} − ${fmt(F.start, dp)} = <b>${fmt(ch, dp)} cm³</b>.` });
    // 6. choose a cylinder
    const opts = [25, 100, 250, 10].map(String);
    const best = F.want <= 9 ? "10" : F.want <= 25 ? "25" : F.want <= 50 ? "50" : "100";
    const pool = ["10", "25", "50", "100", "250"], others = shuffleR(r, pool.filter((p) => p !== best && Number(p) >= F.want)).concat(shuffleR(r, pool.filter((p) => Number(p) < F.want)));
    const ch6 = [best, ...others.slice(0, 3)].map((c) => `a ${c} cm³ measuring cylinder`);
    qs.push({ kind: "choice", q: `A student needs to measure out ${F.want} cm³ of sea water as precisely as possible. Which measuring cylinder should they use?`, options: ch6, a: 0,
      why: `Use the smallest cylinder that holds the whole volume in one go: <b>a ${best} cm³ cylinder</b>. Its divisions are smaller, so it can be read more precisely than a large cylinder; a cylinder that is too small would need filling more than once, which adds error.` }); void opts;
  } else {
    const ch = Math.round((F.v - F.start) * 10) / 10;
    qs.push({ kind: "num", q: `${F.food[0].toUpperCase() + F.food.slice(1)} was burned under a boiling tube of water. The water started at ${fmt(F.start, dp)} °C, and the thermometer shows the highest temperature reached. What was the rise in temperature?`, ans: ch, tol: d / 2, unit: "°C", dp, hl: { read: true },
      why: `Temperature rise = highest temperature − starting temperature = ${V} − ${fmt(F.start, dp)} = <b>${fmt(ch, dp)} °C</b>. The starting temperature must always be recorded, or the rise cannot be worked out.` });
    qs.push({ kind: "choice", q: "A digital thermometer reads to 0.1 °C, and this thermometer reads to the nearest " + fmt(d) + " °C. Which statement is correct?",
      options: ["The digital thermometer gives more precise readings, because it records smaller differences.", "The digital thermometer must be more accurate, because a digital reading is always correct.", "Both give equally precise readings, because they measure the same temperature.", "This thermometer is more precise, because its scale has more numbers on it."], a: 0,
      why: "Precision is the size of the smallest difference an instrument can record: 0.1 °C is finer than " + fmt(d) + " °C. A digital reading is not automatically accurate: it can still be wrong if the probe is faulty or not calibrated." });
  }
  return qs;
}

function selfTest(F, qs) {
  const bad = [], d = F.I.d;
  if (Math.abs(F.v / d - Math.round(F.v / d)) > 1e-6) bad.push("reading off the scale grid " + F.v);
  if (F.mode === "cyl") { if (F.v <= 0 || F.v >= F.I.cap) bad.push("volume out of range"); if (!(F.start > 0 && F.start < F.v)) bad.push("start volume"); }
  else { if (F.v < F.I.lo || F.v > F.I.hi) bad.push("temp out of range"); if (!(F.start < F.v && F.start > F.I.lo)) bad.push("start temp"); }
  const rec = qs[3]; if (new Set(rec.options).size !== rec.options.length) bad.push("record options duplicate");
  return bad;
}

export default {
  key: KEY, group: "Tables and fieldwork", name: "Reading scales and apparatus", topics: "Practical skills (AO3)", thumbSeed: 3,
  ctx: (F) => (F.mode === "cyl" ? `a ${F.I.cap} cm³ measuring cylinder` : "a thermometer"),
  blurb: "Read a measuring cylinder or a thermometer to the right precision, then use the readings.",
  tips: ["Find the value of one small division first: the difference between two labelled marks ÷ the number of spaces between them.", "Read a measuring cylinder at the bottom of the meniscus, with your eye level with it.", "Record a reading to the precision of the instrument, no more and no less.", "Use the smallest measuring cylinder that holds the whole volume."],
  make, svg, questions, selfTest,
  css: `.fig-readscale{max-width:300px;margin:0 auto;display:block}.fig-readscale .rs-glass{fill:color-mix(in srgb,var(--ink) 5%,transparent);stroke:currentColor;stroke-width:2}.fig-readscale .rs-liquid{fill:color-mix(in srgb,#4aa8d8 45%,transparent);stroke:currentColor;stroke-width:1}.fig-readscale .rs-tick{stroke:currentColor;stroke-width:1.2}.fig-readscale .rs-num{font-size:14px}.fig-readscale .rs-cap{font-size:14px;fill:var(--soft)}.fig-readscale .rs-red{fill:#d9473a}.fig-readscale .rs-bulb{fill:#d9473a;stroke:currentColor;stroke-width:2}.fig-readscale .rs-hl{stroke:var(--app);stroke-width:2.5;stroke-dasharray:6 4}.fig-readscale .rs-hit{fill:color-mix(in srgb,var(--accent) 12%,transparent);stroke:var(--accent);stroke-width:1.5}`,
};
