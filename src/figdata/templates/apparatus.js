/* ---------- PRACTICAL APPARATUS (0697 practical skills: 1.4/LO9, 2.4/LO3, 2.5/LO3, 4.2/LO5, 4.3/LO6, 5.2/LO1–LO2) ----------
   Six schematic line-art set-ups, one per run, drawn from seeded geometry: light and photosynthesis (4.3/LO6), burning
   food (4.2/LO5), Secchi disc (2.5/LO3), current speed and direction (1.4/LO9), belt transect on a shore (5.2/LO2) and
   salinity and density (2.4/LO3). 3–5 pieces of apparatus carry letters on label lines; NO apparatus name is ever drawn.
   Every run draws exactly one seeded fault, and each fault is one the app's practical cards (sw2/practicals.js) support:
   no water bath / lamp touching the glass; thermometer bulb out of the water / tube far above the flame; reading on the
   sunny side / unmarked rope; float riding high / stop-watch stopped while the line is slack; transect parallel to the
   sea / uneven intervals / quadrats of different sizes; unequal volumes / one solution in ice.
   Questions: name the apparatus labelled X; tap the apparatus used to measure Y; what apparatus Z is used for; choose the
   apparatus for a further measurement (syllabus list: gas syringe, balance, hydrometer, oxygen/pH/light meter,
   thermometer); spot the fault; tick the changes that would improve the investigation.
   KM limits kept: no light meter in 4.3, no light-meter/Secchi comparison, no current meters, no energy formula,
   no diversity indices. */
import { rng, pickR, shuffleR, pickMixed } from "../core.js";

const KEY = "apparatus";
const W = 560, H = 372;
const n1 = (v) => Math.round(v * 10) / 10;
const ln = (x1, y1, x2, y2, c = "ap-ln") => `<line x1="${n1(x1)}" y1="${n1(y1)}" x2="${n1(x2)}" y2="${n1(y2)}" class="${c}"/>`;
const rc = (x, y, w, h, c = "ap-bk", rx = 0) => `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}"${rx ? ` rx="${rx}"` : ""} class="${c}"/>`;
const ci = (x, y, r, c = "ap-bk") => `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(r)}" class="${c}"/>`;
const pa = (d, c = "ap-ln") => `<path d="${d}" class="${c}"/>`;
const pts = (a) => a.map(([x, y]) => `${n1(x)} ${n1(y)}`).join("L");
const poly = (a, c = "ap-bk") => `<path d="M${pts(a)}Z" class="${c}"/>`;
const tx = (x, y, t, c = "ap-sm", anc = "middle") => `<text x="${n1(x)}" y="${n1(y)}" text-anchor="${anc}" class="${c}">${t}</text>`;
const rectD = ([x, y, w, h]) => `M${n1(x)} ${n1(y)}h${n1(w)}v${n1(h)}h${n1(-w)}Z`;
const bandRects = (x1, y1, x2, y2, w) => { // a rotated band as a polygon path (for long thin targets)
  const L = Math.hypot(x2 - x1, y2 - y1) || 1, nx = (-(y2 - y1) / L) * w / 2, ny = ((x2 - x1) / L) * w / 2;
  return `M${n1(x1 - nx)} ${n1(y1 - ny)}L${n1(x2 - nx)} ${n1(y2 - ny)}L${n1(x2 + nx)} ${n1(y2 + ny)}L${n1(x1 + nx)} ${n1(y1 + ny)}Z`;
};
const bench = (B, x0 = 8, x1 = W - 8) => `<rect x="${x0}" y="${B}" width="${x1 - x0}" height="9" fill="url(#apparatus-hatch)" stroke="none"/>` + ln(x0, B, x1, B, "ap-thick");

/* ---------- small apparatus drawings ---------- */
function therm(x, y0, yb) { // stem from y0 down to the bulb centre yb
  let s = rc(x - 3.2, y0, 6.4, yb - y0, "ap-bk", 3) + ln(x, yb - 3, x, y0 + (yb - y0) * 0.45, "ap-col");
  for (let y = y0 + 8; y < yb - 10; y += 8) s += ln(x + 3.2, y, x + 6.5, y, "ap-th");
  return s + ci(x, yb, 4.8, "ap-fill");
}
function stopwatch(x, y, r, ang) {
  let s = rc(x - 3.5, y - r - 7, 7, 6, "ap-bk", 1.5) + rc(x - 6, y - r - 10, 12, 4, "ap-fill", 1.5);
  s += `<g transform="rotate(40 ${n1(x)} ${n1(y)})">${rc(x - 2.5, y - r - 5, 5, 5, "ap-bk", 1)}</g>`;
  s += ci(x, y, r, "ap-bk") + ci(x, y, r - 3.5, "ap-ln ap-th");
  for (let i = 0; i < 12; i++) { const a = (i * Math.PI) / 6; s += ln(x + (r - 3.5) * Math.sin(a), y - (r - 3.5) * Math.cos(a), x + (r - 7) * Math.sin(a), y - (r - 7) * Math.cos(a), "ap-th"); }
  return s + ln(x, y, x + (r - 6) * Math.sin(ang), y - (r - 6) * Math.cos(ang), "ap-ln") + ci(x, y, 1.8, "ap-fill");
}
function compass(x, y, r, ang) {
  const c = Math.cos(ang), sn = Math.sin(ang), P = (a, b) => [x + a * c - b * sn, y + a * sn + b * c];
  let s = ci(x, y, r, "ap-bk") + ci(x, y, r - 3, "ap-ln ap-th");
  for (let i = 0; i < 4; i++) { const a = (i * Math.PI) / 2; s += ln(x + (r - 3) * Math.sin(a), y - (r - 3) * Math.cos(a), x + (r - 6.5) * Math.sin(a), y - (r - 6.5) * Math.cos(a), "ap-th"); }
  return s + poly([P(0, -(r - 4)), P(3.6, 0), P(-3.6, 0)], "ap-fill") + poly([P(0, r - 4), P(3.6, 0), P(-3.6, 0)], "ap-bk") + ci(x, y, 1.6, "ap-fill");
}
function person(x, feet, k = 1) { // standing stick figure, returns {s, sh:[x,y] shoulder}
  const hy = feet - 60 * k, sh = feet - 44 * k;
  return { s: ci(x, hy, 7 * k, "ap-bk") + pa(`M${n1(x)} ${n1(hy + 7 * k)}L${n1(x)} ${n1(feet - 22 * k)}L${n1(x - 7 * k)} ${n1(feet)}M${n1(x)} ${n1(feet - 22 * k)}L${n1(x + 7 * k)} ${n1(feet)}`), sh: [x, sh] };
}
function cylinder(cx, base, h, lev, tick = 12, w = 24) { // measuring cylinder: foot, body, graduations, liquid to `lev` ticks
  const top = base - 6 - h, L = base - 6 - lev * tick;
  let s = rc(cx - w / 2 - 8, base - 6, w + 16, 6, "ap-bk", 1);
  s += `<rect x="${n1(cx - w / 2)}" y="${n1(L)}" width="${w}" height="${n1(base - 6 - L)}" class="ap-wat"/>` + ln(cx - w / 2, L, cx + w / 2, L, "ap-ln");
  s += pa(`M${n1(cx - w / 2 - 4)} ${n1(top - 2)}L${n1(cx - w / 2)} ${n1(top + 3)}L${n1(cx - w / 2)} ${n1(base - 6)}M${n1(cx + w / 2)} ${n1(top)}L${n1(cx + w / 2)} ${n1(base - 6)}M${n1(cx - w / 2)} ${n1(top + 3)}Q${n1(cx)} ${n1(top - 1)} ${n1(cx + w / 2)} ${n1(top)}`);
  for (let i = 1; i * tick < h - 6; i++) { const y = base - 6 - i * tick; s += ln(cx + w / 2 - (i % 5 ? 6 : 11), y, cx + w / 2, y, "ap-th"); }
  return { s, top, L };
}

/* =================== the six set-ups =================== */
// piece fields: name, nameable (asked in "name the apparatus"), conf (name distractors, most confusable first), clue,
// tap (stem for the tap question), use (option text for "used for"), useW (explanation sentence), absent(F), noAsk(F)
const LABNAMES = ["thermometer", "beaker", "boiling tube", "mounted needle", "clamp stand", "test-tube rack", "gas syringe", "lamp", "ruler", "stop-watch", "balance", "wash bottle", "dropping pipette", "forceps", "glass rod", "Petri dish", "tripod", "Bunsen burner"];
const FIELDNAMES = ["Secchi disc", "quadrat", "tape measure", "plankton net", "dip net", "sorting tray", "compass", "stop-watch", "float", "light meter", "pH meter", "oxygen meter"];
const CLASH = { float: ["hydrometer", "Secchi disc"], "tape measure": ["ruler"], "boiling tube": ["test-tube"], ruler: ["tape measure"] };

const SET = {};

/* ---- 1. light intensity and photosynthesis (4.3/LO6) ---- */
SET.photo = {
  ref: "4.3/LO6", lab: true, faults: ["nobath", "touch"], vb: [74, 276],
  ctx: () => "Apparatus for investigating how light intensity affects the rate of photosynthesis in an aquatic plant (side view, not to scale)",
  pieces: {
    lamp: { name: "lamp", nameable: true, conf: ["Bunsen burner", "hand lens", "water bath"], clue: "a bulb inside a shade on a stand, pointed at the plant",
      tap: "Tap the apparatus that is moved to change the light intensity.", use: "Giving light; its distance sets the light intensity",
      useW: "The light intensity is changed by moving the lamp nearer to or further from the plant." },
    ruler: { name: "ruler", nameable: true, conf: ["thermometer", "glass rod", "test-tube rack"], clue: "a flat strip with a scale of marks along it",
      tap: "Tap the apparatus used to measure the distance from the lamp to the plant.", use: "Measuring the distance between the lamp and the plant",
      useW: "It measures the distance from the lamp to the plant; the nearer the lamp, the higher the light intensity." },
    bath: { name: "water bath", nameable: false, absent: (F) => F.fault === "nobath",
      tap: "Tap the apparatus that keeps the temperature around the plant steady.", use: "Keeping the temperature around the plant steady",
      useW: "It keeps the temperature of the water around the plant steady, so that temperature is a controlled variable." },
    thermo: { name: "thermometer", nameable: true, conf: ["dropping pipette", "glass rod", "gas syringe"], absent: (F) => F.fault === "nobath", clue: "a narrow glass stem with a scale and a liquid-filled bulb at the bottom",
      tap: "Tap the apparatus used to check that the temperature stays the same.", use: "Checking that the water temperature stays the same",
      useW: "It is read during the experiment to check that the temperature of the water around the plant stays the same (a controlled variable)." },
    tube: { name: "boiling tube", nameable: true, conf: ["beaker", "gas syringe", "Petri dish"], clue: "a large glass tube with a rounded bottom" },
    watch: { name: "stop-watch", nameable: true, conf: ["compass", "balance", "thermometer"], clue: "a round dial with one hand and a button on top",
      tap: "Tap the apparatus used to time the period in which the bubbles are counted.", use: "Timing the set period in which the bubbles are counted",
      useW: "The bubbles are counted for the same set time (for example 1 minute) at each distance, so the rate is bubbles per minute." },
  },
  misuse: [
    { t: "Measuring the volume of oxygen gas the plant gives off", w: "no drawn apparatus collects the gas, so its volume is not measured" },
    { t: "Heating the water so that the plant photosynthesises faster", not: ["lamp"], w: "heating the water is not the aim; light intensity is the variable being changed" },
    { t: "Adding extra carbon dioxide to the water for the plant", w: "none of the apparatus adds carbon dioxide" },
  ],
  faultSt: [
    { id: "nobath", t: "There is no water bath, so the lamp could warm the plant's water.", fix: "The lamp heats the water, and temperature also affects the rate, so the tube should stand in a water bath (with a thermometer) to keep the temperature constant." },
    { id: "touch", t: "The lamp touches the glass, so it heats the water around the plant.", fix: "The lamp should be a measured distance from the plant; touching the glass warms the water (temperature also changes the rate) and puts an electrical lamp right against water." },
    { id: "away", t: "The lamp is pointing away from the plant, so little light reaches it.", on: () => false, w: "the lamp points straight at the plant" },
    { id: "dry", t: "The plant is not under the water, so no bubbles of gas can be seen.", on: () => false, w: "the plant is covered by water in the tube" },
    { id: "noruler", t: "There is no ruler, so the distance to the lamp cannot be measured.", on: () => false, w: "a ruler lies on the bench between the lamp and the plant" },
  ],
  impr: [
    ["Repeat the count at each distance and calculate a mean.", true, "repeats and a mean make the results more reliable"],
    ["Wait a few minutes after moving the lamp before counting.", true, "the plant needs time to adjust to the new light intensity"],
    ["Use the same piece of plant at every distance.", true, "a different plant could photosynthesise at a different rate"],
    ["Keep the carbon dioxide supply the same at every distance.", true, "carbon dioxide also affects the rate, so it is a controlled variable (e.g. the same amount of sodium hydrogencarbonate)"],
    ["Use a new piece of plant at each lamp distance.", false, "a different plant adds another variable; the same plant is used throughout"],
    ["Count for a shorter time when the lamp is far away.", false, "the counting time must be the same at every distance"],
    ["Start counting as soon as the lamp has been moved.", false, "the plant needs a few minutes to adjust first"],
  ],
  select: () => ({ q: "Instead of counting bubbles, the student wants to collect what the plant gives off and measure its volume. Which apparatus could do this?",
    options: ["gas syringe", "balance", "dropping pipette", "thermometer"],
    why: "A <b>gas syringe</b> (or an upturned measuring cylinder full of water) collects the gas so its volume can be read. This is more accurate than counting, because the bubbles are not all the same size. A balance measures mass, a dropping pipette adds small volumes of liquid and a thermometer measures temperature." }),
  params(r, fault) {
    const bx = n1(330 + r() * 30), gap = n1(80 + r() * 60);
    return { bx, mx: fault === "touch" ? bx - 60 : n1(bx - 60 - gap), ang: n1(r() * 6.28), plant: Math.floor(r() * 3) };
  },
  draw(F) {
    const p = F.p, B = 292, bx = p.bx, cy = B - 82, mx = p.mx, noBath = F.fault === "nobath", sx = bx + 140;
    let s = bench(B);
    // lamp: base, post, arm, shade (cone opening to the right), bulb, cable
    const px = mx - 52;
    s += pa(`M${n1(mx - 80)} ${B - 2}Q${n1(mx - 110)} ${B - 3} ${n1(mx - 120)} ${B - 18}`, "ap-ln ap-th");
    s += rc(mx - 80, B - 9, 56, 9, "ap-bk", 2) + rc(px - 2.5, cy - 4, 5, B - 9 - cy + 4, "ap-bk") + ln(px, cy, mx - 38, cy, "ap-thick");
    s += ci(mx - 10, cy, 9, "ap-bk") + poly([[mx - 40, cy - 12], [mx, cy - 27], [mx, cy + 27], [mx - 40, cy + 12]]);
    s += pa(`M${n1(mx - 2)} ${n1(cy - 13)}A13 13 0 0 1 ${n1(mx - 2)} ${n1(cy + 13)}`, "ap-ln ap-th");
    if (F.fault !== "touch") for (const d of [-14, 0, 14]) s += ln(mx + 8, cy + d * 1.2, noBath ? bx - 20 : bx - 66, cy + d * 0.5, "ap-ln ap-th ap-dash");
    // ruler on the bench, in front of the lamp base
    const r0 = 18, r1 = bx - 66;
    s += rc(r0, B - 7, r1 - r0, 7, "ap-bk", 1);
    for (let x = r0 + 6, i = 0; x < r1 - 2; x += 6, i++) s += ln(x, B - 7, x, B - (i % 5 === 4 ? 1.5 : 4.5), "ap-th");
    // the tube with the plant (in a beaker water bath, or in a rack)
    const t0 = B - 162, tb = B - 16, tl = B - 150;
    let tube = `<path d="M${bx - 13} ${tl}L${bx + 13} ${tl}L${bx + 13} ${tb}A13 13 0 0 1 ${bx - 13} ${tb}Z" class="ap-wat"/>`;
    tube += pa(`M${bx - 13} ${t0}L${bx - 13} ${tb}A13 13 0 0 0 ${bx + 13} ${tb}L${bx + 13} ${t0}`) + ln(bx - 16, t0, bx - 13, t0) + ln(bx + 13, t0, bx + 16, t0) + ln(bx - 13, tl, bx + 13, tl, "ap-th");
    // plant: stem with leaf whorls, cut end at the top, bubbles rising from the cut end
    const top = B - 120; let pl = pa(`M${bx + 1} ${tb + 6}C${bx - 4} ${B - 60} ${bx + 5} ${B - 90} ${bx - 1} ${top}`);
    for (let y = tb - 6, i = 0; y > top + 8; y -= 13, i++) { const sx2 = bx + (i % 2 ? 1 : -1) * 0.5; pl += pa(`M${n1(sx2)} ${n1(y)}q-7 -2 -10 -8M${n1(sx2)} ${n1(y)}q7 -2 10 -8`, "ap-ln ap-th"); }
    pl += ln(bx - 5, top, bx + 3, top, "ap-thick");
    for (const [dx, dy, rr] of [[0, -8, 2.4], [1.5, -17, 2.8], [-0.5, -25, 2.2]]) pl += ci(bx - 1 + dx, top + dy, rr, "ap-ln ap-th");
    if (!noBath) {
      s += `<path d="M${bx - 60} ${B - 108}L${bx + 60} ${B - 108}L${bx + 60} ${B - 3}L${bx - 60} ${B - 3}Z" class="ap-wat"/>`;
      s += tube + pl;
      s += pa(`M${bx - 64} ${B - 127}L${bx - 60} ${B - 122}L${bx - 60} ${B - 4}Q${bx - 60} ${B} ${bx - 56} ${B}L${bx + 56} ${B}Q${bx + 60} ${B} ${bx + 60} ${B - 4}L${bx + 60} ${B - 125}`, "ap-ln ap-thick2") + ln(bx - 60, B - 108, bx + 60, B - 108, "ap-th");
      s += therm(bx + 38, B - 178, B - 22);
    } else {
      // test-tube rack: end panels, a top bar with three holes (the tube in the middle one) and a low shelf
      s += rc(bx - 62, B - 84, 8, 84, "ap-bk", 1) + rc(bx + 54, B - 84, 8, 84, "ap-bk", 1) + rc(bx - 56, B - 18, 112, 6, "ap-bk", 1);
      s += rc(bx - 56, B - 84, 112, 10, "ap-bk", 1) + `<ellipse cx="${bx - 34}" cy="${B - 79}" rx="11" ry="3.5" class="ap-fill"/><ellipse cx="${bx + 34}" cy="${B - 79}" rx="11" ry="3.5" class="ap-fill"/>`;
      s += ci(bx - 34, B - 21, 6, "ap-ln ap-th") + ci(bx + 34, B - 21, 6, "ap-ln ap-th");
      s += tube + pl;
    }
    s += stopwatch(sx, B - 25, 22, p.ang);
    const P = {
      lamp: { at: [mx - 22, cy - 19], lab: [mx - 50, B - 190], hit: [[mx - 82, cy - 30, 84, B - cy + 30]] },
      ruler: { at: [(r0 + Math.min(r1, mx - 82)) / 2, B - 4], lab: [(r0 + Math.min(r1, mx - 82)) / 2, B + 34], hit: [[r0, B - 15, r1 - r0, 24]] },
      bath: { at: [bx + 60, B - 30], lab: [bx + 92, B - 30], hit: [[bx - 62, B - 128, 124, 130]] },
      thermo: { at: [bx + 41, B - 165], lab: [bx + 72, B - 198], hit: [[bx + 27, B - 182, 22, 162]] },
      tube: { at: [bx - 13, B - 140], lab: [bx - 44, B - 198], hit: [[bx - 14, B - 166, 28, 160]] },
      watch: { at: [sx - 16, B - 41], lab: [sx - 40, B - 82], hit: [[sx - 25, B - 60, 50, 60]] },
    };
    const hlF = noBath ? [[bx - 66, B - 170, 132, 172]] : [[bx - 80, cy - 34, 40, 68]];
    return { s, P, hlF };
  },
};

/* ---- 2. burning food (4.2/LO5) ---- */
SET.food = {
  ref: "4.2/LO5", lab: true, faults: ["air", "high"], vb: [2, 318],
  ctx: () => "Apparatus for comparing the energy released when samples of food are burned (side view, not to scale)",
  pieces: {
    stand: { name: "clamp stand", nameable: true, conf: ["tripod", "test-tube rack", "water bath"], clue: "a heavy base with an upright rod and a clamp that grips the tube",
      tap: "Tap the apparatus that holds the boiling tube steady above the food.", use: "Holding the boiling tube steady above the burning food",
      useW: "It holds the boiling tube still above the burning food." },
    tube: { name: "boiling tube", nameable: true, conf: ["beaker", "measuring cylinder", "Petri dish"], clue: "a large glass tube with a rounded bottom",
      use: "Holding the water that the burning food heats", useW: "It holds the measured volume of water that the burning food heats." },
    thermo: { name: "thermometer", nameable: true, conf: ["glass rod", "dropping pipette", "mounted needle"], clue: "a narrow glass stem with a scale and a liquid-filled bulb at the bottom",
      tap: "Tap the apparatus used to measure the temperature rise of the water.", use: "Measuring the water's starting and highest temperatures",
      useW: "The starting temperature and the highest temperature of the water are read; the rise shows how much energy the food released." },
    needle: { name: "mounted needle", nameable: true, conf: ["forceps", "glass rod", "dropping pipette"], clue: "a needle fixed in a handle, with the food pushed onto its point",
      tap: "Tap the apparatus used to hold the food while it burns.", use: "Holding the food sample while it burns",
      useW: "The food is pushed onto the needle so it can be held, burning, under the tube." },
    cyl: { name: "measuring cylinder", nameable: false, tap: "Tap the apparatus used to measure the volume of water.", use: "Measuring out the volume of water for the tube",
      useW: "It measures the same volume of water each time (a controlled variable)." },
  },
  misuse: [
    { t: "Measuring the energy stored in each food sample", w: "the energy is worked out from the temperature rise of the water; no piece of apparatus measures it" },
    { t: "Measuring how long each food sample takes to burn", w: "the burning time is not measured; the temperature rise is" },
    { t: "Weighing the ash that is left after the food has burned", w: "the ash is not weighed in this method" },
  ],
  faultSt: [
    { id: "air", t: "The thermometer bulb is above the water, so it reads the air.", fix: "The bulb must be in the water, because it is the temperature rise of the water that measures the energy released." },
    { id: "high", t: "The tube is far above the flame, so heat escapes into the air.", fix: "The tube should be just above the flame, at the same distance for every food; a big gap lets heat escape, so the temperature rise is too small." },
    { id: "side", t: "The food is not directly under the tube, so the flame misses it.", on: () => false, w: "the burning food is directly under the tube" },
    { id: "empty", t: "There is no water in the boiling tube, so nothing can be heated.", on: () => false, w: "the tube contains water" },
    { id: "loose", t: "The boiling tube is not clamped, so it could move during the test.", on: () => false, w: "a clamp holds the tube" },
  ],
  impr: [
    ["Shield the apparatus from draughts to reduce heat loss.", true, "less heat is lost to the air, so the temperature rise is closer to the true value"],
    ["Repeat with fresh samples and calculate a mean.", true, "repeats and a mean make the results more reliable"],
    ["Relight the food if it goes out before it has all burned.", true, "unburned food releases no energy, so the rise would be too small"],
    ["Compare the temperature rise per gram of each food.", true, "pieces of different mass can then be compared fairly"],
    ["Use a different volume of water for each food.", false, "the volume of water is a controlled variable"],
    ["Weigh the ash that is left to find the energy.", false, "the temperature rise of the water measures the energy"],
    ["Read the temperature as soon as the food catches fire.", false, "the highest temperature the water reaches is recorded"],
  ],
  select: () => ({ q: "Before it is burned, the mass of each food sample must be measured. Which apparatus should be used?",
    options: ["balance", "measuring cylinder", "thermometer", "stop-watch"],
    why: "A <b>balance</b> measures mass (to at least 0.1 g), so the energy released can be compared per gram of food. A measuring cylinder measures volume, a thermometer measures temperature and a stop-watch measures time." }),
  params(r) { return { tx: n1(250 + r() * 30), lev: 6 + Math.floor(r() * 4), foodA: n1(r() * 6.28) }; },
  draw(F) {
    const p = F.p, B = 300, t = p.tx, rod = t - 95, high = F.fault === "high";
    const yb = high ? B - 160 : B - 110, yt = yb - 95, wl = yb - 45, cl = yt + 14, fy = B - 60;
    let s = bench(B);
    // heat-proof mat, stand base and rod, boss and clamp
    s += `<rect x="${n1(t - 58)}" y="${B - 6}" width="116" height="6" fill="url(#apparatus-hatch)" class="ap-ln ap-th"/>`;
    s += rc(rod - 34, B - 10, 108, 10, "ap-bk", 2) + rc(rod - 3, B - 262, 6, 252, "ap-bk", 1);
    s += rc(rod - 8, cl - 8, 16, 16, "ap-bk", 2) + ln(rod + 8, cl, t - 17, cl, "ap-thick") + rc(t - 19, cl - 7, 6, 14, "ap-fill", 1) + rc(t + 13, cl - 7, 6, 14, "ap-fill", 1) + ln(t - 16, cl - 7, t + 16, cl - 7, "ap-ln ap-th");
    // boiling tube with water
    s += `<path d="M${n1(t - 13)} ${n1(wl)}L${n1(t + 13)} ${n1(wl)}L${n1(t + 13)} ${n1(yb)}A13 13 0 0 1 ${n1(t - 13)} ${n1(yb)}Z" class="ap-wat"/>` + ln(t - 13, wl, t + 13, wl, "ap-th");
    s += pa(`M${n1(t - 13)} ${n1(yt)}L${n1(t - 13)} ${n1(yb)}A13 13 0 0 0 ${n1(t + 13)} ${n1(yb)}L${n1(t + 13)} ${n1(yt)}`) + ln(t - 16, yt, t - 13, yt) + ln(t + 13, yt, t + 16, yt);
    s += therm(t + 3, yt - 34, F.fault === "air" ? wl - 15 : yb - 4);
    // food on a mounted needle, with its flame
    const fx = t;
    s += ln(fx + 4, fy + 1, t + 50, B - 38, "ap-ln") + `<path d="${bandRects(t + 50, B - 38, t + 96, B - 18, 9)}" class="ap-bk"/>`;
    s += pa(`M${n1(fx - 8)} ${n1(fy)}q2 -6 8 -6q7 0 8 5q1 6 -8 6q-8 0 -8 -5Z`, "ap-fill");
    s += pa(`M${n1(fx - 7)} ${n1(fy - 6)}Q${n1(fx - 9)} ${n1(fy - 22)} ${n1(fx)} ${n1(fy - 34)}Q${n1(fx + 9)} ${n1(fy - 22)} ${n1(fx + 7)} ${n1(fy - 6)}Q${n1(fx)} ${n1(fy - 2)} ${n1(fx - 7)} ${n1(fy - 6)}Z`, "ap-flame");
    s += pa(`M${n1(fx - 3)} ${n1(fy - 7)}Q${n1(fx - 3)} ${n1(fy - 16)} ${n1(fx)} ${n1(fy - 22)}Q${n1(fx + 3)} ${n1(fy - 16)} ${n1(fx + 3)} ${n1(fy - 7)}Z`, "ap-ln ap-th");
    // measuring cylinder on the bench
    const cx = 470, C = cylinder(cx, B, 150, p.lev);
    s += C.s;
    const P = {
      stand: { at: [rod - 3, B - 215], lab: [rod - 40, B - 215], hit: [[rod - 14, B - 264, 26, 254], [rod - 34, B - 22, 108, 22]] },
      tube: { at: [t - 13, (yt + wl) / 2 + 12], lab: [t - 48, yt - 8], hit: [[t - 15, yt, 30, yb - yt + 15]] },
      thermo: { at: [t + 6, yt - 26], lab: [t + 42, Math.max(yt - 40, 26)], hit: [[t - 9, yt - 38, 24, 36]] },
      needle: { at: [t + 76, B - 27], lab: [t + 110, B - 62], hit: [[t + 6, B - 70, 26, 26]], band: [t + 30, B - 48, t + 98, B - 17, 24] },
      cyl: { at: [cx + 12, B - 100], lab: [cx + 44, B - 130], hit: [[cx - 24, B - 160, 48, 160]] },
    };
    const hlF = F.fault === "air" ? [[t - 14, wl - 30, 34, 30]] : [[t - 26, yb + 12, 52, fy - 34 - (yb + 12)]];
    return { s, P, hlF };
  },
};

/* ---- 3. Secchi disc (2.5/LO3) ---- */
SET.secchi = {
  ref: "2.5/LO3", lab: false, faults: ["sunny", "unmarked"],
  ctx: () => "A student measuring water clarity from a small boat (side view, not to scale)",
  pieces: {
    disc: { name: "Secchi disc", nameable: true, conf: ["quadrat", "plankton net", "sorting tray"], clue: "a flat disc with black and white quarters, lowered on a line",
      tap: "Tap the apparatus that is lowered until it just disappears from view.", use: "Showing how far light penetrates the water",
      useW: "It is lowered until it just disappears; that depth (the Secchi depth) shows how far light penetrates, so a greater depth means clearer water." },
    rope: { name: "marked rope", nameable: false, noAsk: (F) => F.fault === "unmarked",
      tap: "Tap the apparatus used to read the depth of the disc.", use: "Measuring the depth at which the disc disappears",
      useW: "The marks on the rope show how deep the disc is when it just disappears from view." },
    jacket: { name: "life jacket", nameable: false, tap: "Tap the piece of safety equipment.", use: "Keeping the student afloat if they fall in",
      useW: "Working over deep water means there is a risk of falling in, so a life jacket is worn." },
  },
  misuse: [
    { t: "Measuring the depth of the sea down to the seabed", w: "the disc disappears long before it reaches the seabed; it measures clarity, not depth of water" },
    { t: "Measuring the salinity of the water at that depth", w: "salinity is not measured in this method" },
    { t: "Measuring the temperature of the deeper water", w: "temperature is not measured in this method" },
  ],
  faultSt: [
    { id: "sunny", t: "The disc is lowered on the sunny side, where glare hides it.", fix: "The reading should be taken on the shaded side of the boat, away from glare, because glare makes the depth at which the disc disappears hard to judge." },
    { id: "unmarked", t: "The rope has no depth markings, so the depth cannot be read.", fix: "A marked line or rope is needed, so the depth at which the disc disappears can be read." },
    { id: "nojacket", t: "The student in the boat is not wearing a life jacket to stay safe.", on: () => false, w: "the student is wearing a life jacket" },
    { id: "seabed", t: "The disc has been lowered until it rests on the seabed below.", on: () => false, w: "the disc hangs well above the seabed" },
    { id: "black", t: "The disc is painted all black, so it cannot be seen in the water.", on: () => false, w: "the disc has black and white quarters" },
  ],
  impr: [
    ["Use the same observer for every reading.", true, "different people judge the disappearing point differently"],
    ["Take every reading at the same time of day.", true, "the angle and brightness of the light change during the day"],
    ["Raise the disc until it reappears and take the mean of the two depths.", true, "the mean of the two depths is a more reliable value"],
    ["Repeat the reading several times and calculate a mean.", true, "repeats and a mean make the result more reliable"],
    ["Use a different observer for each reading.", false, "the same observer should be used, so readings are judged the same way"],
    ["Lower the disc until it touches the seabed, then read the depth.", false, "that measures the depth of the water, not its clarity"],
    ["Take each reading at a different time of day.", false, "the light changes during the day, so the time of day is kept the same"],
  ],
  select: (F, r) => fieldSelect(r, ["ox", "ph", "sal", "temp"], (f) => `The student also wants to find out ${f} at two sites. Which of these should be used?`),
  params(r, fault) { const sun = r() < 0.5 ? -1 : 1; return { sun, side: fault === "sunny" ? sun : -sun, depth: n1(110 + r() * 45), bx: n1(275 + r() * 14) }; },
  draw(F) {
    const p = F.p, S = 150, bx = p.bx, d = p.side, sun = p.sun, sea = 342;
    let s = `<rect x="8" y="${S}" width="${W - 16}" height="${sea - S}" class="ap-wat"/>`;
    // seabed
    let bed = `M8 ${sea}`; for (let x = 8; x < W - 30; x += 24) bed += `Q${x + 12} ${sea - 4} ${x + 24} ${sea}`;
    s += `<rect x="8" y="${sea}" width="${W - 16}" height="${H - 4 - sea}" fill="url(#apparatus-hatch)" stroke="none"/>` + pa(bed);
    // the Sun, glare on its side, the boat's shadow on the other
    const sx = sun < 0 ? 52 : W - 52; s += ci(sx, 44, 15, "ap-bk");
    for (let i = 0; i < 8; i++) { const a = (i * Math.PI) / 4; s += ln(sx + 20 * Math.cos(a), 44 + 20 * Math.sin(a), sx + 28 * Math.cos(a), 44 + 28 * Math.sin(a), "ap-ln ap-th"); }
    const gx = bx + sun * 120;
    s += ln(sx + -sun * 26, 64, gx - sun * 8, S - 6, "ap-ln ap-th ap-dash") + ln(sx + -sun * 18, 70, gx + sun * 22, S - 6, "ap-ln ap-th ap-dash");
    for (const [ox, oy] of [[-24, 3], [0, 6], [24, 2], [46, 5]]) { const x = gx + sun * ox, y = S + oy; s += pa(`M${n1(x - 8)} ${n1(y)}Q${n1(x)} ${n1(y)} ${n1(x)} ${n1(y - 8)}Q${n1(x)} ${n1(y)} ${n1(x + 8)} ${n1(y)}Q${n1(x)} ${n1(y)} ${n1(x)} ${n1(y + 8)}Q${n1(x)} ${n1(y)} ${n1(x - 8)} ${n1(y)}Z`, "ap-fill"); }
    const sh = -sun, shx0 = bx + sh * 66, shx1 = bx + sh * 136;
    s += `<path d="M${n1(shx0)} ${S}L${n1(shx1)} ${S}L${n1(shx1 - sh * 20)} ${S + 42}L${n1(shx0)} ${S + 42}Z" fill="url(#apparatus-dots)" class="ap-shade"/>`;
    // water surface
    let wv = `M8 ${S}`; for (let x = 8; x < W - 22; x += 16) wv += `Q${x + 8} ${S - 3} ${x + 16} ${S}`; s += pa(wv);
    // boat and the student leaning over the side d
    s += poly([[bx - 78, S - 20], [bx + 78, S - 20], [bx + 62, S + 9], [bx - 62, S + 9]]) + ln(bx - 78, S - 20, bx + 78, S - 20, "ap-thick");
    const px = bx + d * 22, hand = [bx + d * 92, S - 40];
    s += ci(px + d * 6, S - 92, 10, "ap-bk");
    s += pa(`M${n1(px - 9)} ${S - 20}L${n1(px - 9)} ${S - 30}M${n1(px + 9)} ${S - 20}L${n1(px + 9)} ${S - 30}`, "ap-ln ap-thick2");
    s += pa(`M${n1(px + d * 8)} ${S - 70}L${n1(hand[0] - d * 26)} ${S - 58}L${n1(hand[0])} ${n1(hand[1])}`, "ap-ln ap-thick2");
    s += `<rect x="${n1(px - 16)}" y="${S - 80}" width="32" height="52" rx="7" fill="url(#apparatus-hatch2)" class="ap-ln ap-thick2"/>`;
    s += pa(`M${n1(px - 7)} ${S - 80}L${n1(px)} ${S - 66}L${n1(px + 7)} ${S - 80}`, "ap-ln ap-thick2") + rc(px - 16, S - 50, 32, 5, "ap-fill", 1);
    // rope and disc
    const dx = hand[0] + d * 6, dy = S + p.depth;
    s += ln(hand[0], hand[1], dx, dy - 2, "ap-rope");
    if (F.fault !== "unmarked") for (let y = S + 14, i = 1; y < dy - 8; y += 16, i++) s += ln(dx - (i % 5 ? 4 : 7) + (hand[0] - dx) * (dy - y) / (dy - hand[1]), y, dx + (i % 5 ? 4 : 7) + (hand[0] - dx) * (dy - y) / (dy - hand[1]), y, i % 5 ? "ap-ln" : "ap-thick");
    s += `<ellipse cx="${n1(dx)}" cy="${n1(dy)}" rx="28" ry="9" class="ap-bk"/>`;
    s += pa(`M${n1(dx)} ${n1(dy)}L${n1(dx + 28)} ${n1(dy)}A28 9 0 0 1 ${n1(dx)} ${n1(dy + 9)}ZM${n1(dx)} ${n1(dy)}L${n1(dx - 28)} ${n1(dy)}A28 9 0 0 1 ${n1(dx)} ${n1(dy - 9)}Z`, "ap-fill");
    s += rc(dx - 3, dy + 9, 6, 6, "ap-fill", 1);
    const out = d; // letters go on the outer side of the disc
    const P = {
      disc: { at: [dx + out * 28, dy], lab: [dx + out * 66, dy + 4], hit: [[dx - 32, dy - 13, 64, 30]] },
      rope: { at: [dx + (hand[0] - dx) * 0.35, S + 70], lab: [dx + out * 60, S + 74], hit: [[Math.min(hand[0], dx) - 11, hand[1], Math.abs(dx - hand[0]) + 22, dy - 14 - hand[1]]] },
      jacket: { at: [px - d * 16, S - 58], lab: [px - d * 58, S - 100], hit: [[px - 18, S - 82, 36, 56]] },
    };
    const hlF = F.fault === "sunny" ? [[dx - 44, S - 16, 88, 36]] : [[Math.min(hand[0], dx) - 14, hand[1] + 6, Math.abs(dx - hand[0]) + 28, dy - 20 - hand[1]]];
    return { s, P, hlF };
  },
};

/* ---- 4. current speed and direction (1.4/LO9) ---- */
SET.current = {
  ref: "1.4/LO9", lab: false, faults: ["highfloat", "slack"],
  ctx: () => "Students on a jetty measuring a surface current with a float on a 10.0 m line. The drawing shows the moment the stop-watch is stopped (side view, not to scale).",
  pieces: {
    float: { name: "float", nameable: true, conf: ["plankton net", "quadrat", "sorting tray"], clue: "an object in the water, tied to the end of the line",
      tap: "Tap the object that is carried along by the current.", use: "Being carried along by the surface current",
      useW: "It is released into the water and carried along by the current." },
    line: { name: "measured line", nameable: false, tap: "Tap the apparatus that sets the distance the float travels.", use: "Setting a known distance for the float to travel",
      useW: "The line has a known length (10.0 m), so the distance the float travels is known." },
    watch: { name: "stop-watch", nameable: true, conf: ["compass", "light meter", "pH meter"], clue: "a round dial with one hand and a button on top",
      tap: "Tap the apparatus used to measure the time taken.", use: "Timing how long the line takes to pull tight",
      useW: "It measures the time the float takes to travel the known distance; speed = distance ÷ time." },
    compass: { name: "compass", nameable: true, conf: ["stop-watch", "light meter", "pH meter"], clue: "a round dial with a pointed needle",
      tap: "Tap the apparatus used to find the direction of the current.", use: "Finding the direction in which the float moves",
      useW: "A compass bearing of the direction the float moves gives the direction of the current." },
  },
  misuse: [
    { t: "Measuring the speed of the current, in m/s", w: "no instrument measures the speed here; it is calculated as distance ÷ time" },
    { t: "Finding the direction that the wind is blowing from", w: "the current's direction is taken from the float, not the wind" },
    { t: "Measuring the depth of the water beside the jetty", w: "depth is not measured in this method" },
  ],
  faultSt: [
    { id: "highfloat", t: "The float sits high in the water, so the wind can push it.", fix: "A weighted float that sits low in the water should be used, so that it is moved by the current and not blown by the wind." },
    { id: "slack", t: "The stop-watch is stopped while the line is still slack.", fix: "The stop-watch should be stopped when the line pulls tight, so the float has travelled the full 10.0 m." },
    { id: "untied", t: "The line is not held at a fixed point, so the distance can change.", on: () => false, w: "the line is tied to a post of the jetty" },
    { id: "nocompass", t: "No one has a compass, so the direction of the float cannot be found.", on: () => false, w: "one student holds a compass" },
    { id: "onland", t: "The float has been put down on the jetty rather than in the water.", on: () => false, w: "the float is in the water" },
  ],
  impr: [
    ["Repeat the timing several times and calculate a mean.", true, "repeats and a mean make the result more reliable"],
    ["Release the float from the same fixed point each time.", true, "the distance travelled is then the same for every run"],
    ["Use the same float and the same line for every run.", true, "these are controlled variables"],
    ["Take readings at different states of the tide.", true, "the current changes with the tide, so one set of readings does not show what it always does"],
    ["Use a shorter line so that each timing is quicker.", false, "a shorter time is harder to measure accurately"],
    ["Take the direction from the way the wind is blowing.", false, "the current's direction is the way the float moves"],
    ["Release the float from a different point for each run.", false, "the release point should stay the same"],
  ],
  select: (F, r) => fieldSelect(r, ["ox", "ph", "sal", "temp", "light"], (f) => `The students also want to find out ${f} at the end of the jetty. Which of these should they use?`),
  params(r, fault) { return { fx: n1(fault === "slack" ? 330 + r() * 50 : 455 + r() * 55), a1: n1(r() * 6.28), a2: n1(r() * 6.28), cur: r() < 0.5 }; },
  draw(F) {
    const p = F.p, Dk = 140, S = 172, sea = 342, fx = p.fx;
    let s = `<rect x="8" y="${S}" width="${W - 16}" height="${sea - S}" class="ap-wat"/>`;
    let bed = `M8 ${sea}`; for (let x = 8; x < W - 30; x += 24) bed += `Q${x + 12} ${sea - 4} ${x + 24} ${sea}`;
    s += `<rect x="8" y="${sea}" width="${W - 16}" height="${H - 4 - sea}" fill="url(#apparatus-hatch)" stroke="none"/>` + pa(bed);
    // jetty: deck and posts
    for (const x of [26, 96, 166]) s += rc(x - 5, Dk + 8, 10, sea - Dk - 8, "ap-bk");
    s += rc(8, Dk, 170, 10, "ap-bk", 1);
    let wv = `M8 ${S}`; for (let x = 8; x < W - 22; x += 16) wv += `Q${x + 8} ${S - 3} ${x + 16} ${S}`; s += pa(wv);
    // wind and current arrows (no words)
    for (const [x, y] of [[300, 46], [360, 62], [420, 42]]) s += pa(`M${x} ${y}q14 -6 28 0t28 0`, "ap-ln ap-th");
    s += pa(`M250 ${S + 60}H330M320 ${S + 54}L330 ${S + 60}L320 ${S + 66}`, "ap-ln ap-th");
    // students, stop-watch and compass
    const p1 = person(50, Dk, 1.3), p2 = person(124, Dk, 1.3);
    s += p1.s + p2.s + pa(`M50 ${Dk - 57}L68 ${Dk - 54}M124 ${Dk - 57}L140 ${Dk - 54}`);
    s += stopwatch(86, Dk - 54, 19, p.a1) + compass(158, Dk - 54, 19, p.a2);
    // line tied to the end post, and the float
    const ty = Dk + 12, tx0 = 171;
    s += ci(tx0, ty, 3, "ap-fill");
    let lineHit;
    if (F.fault === "slack") {
      const m = (tx0 + fx) / 2;
      s += pa(`M${tx0} ${ty}C${n1(tx0 + 40)} ${S + 30} ${n1(m - 30)} ${S + 10} ${n1(m)} ${S + 22}S${n1(fx - 40)} ${S + 34} ${n1(fx - 6)} ${S - 2}`, "ap-rope");
      lineHit = [[tx0, ty - 4, fx - 24 - tx0, S + 38 - ty]];
    } else {
      s += ln(tx0, ty, fx - 6, S - 2, "ap-rope");
      lineHit = null;
    }
    if (F.fault === "highfloat") s += ci(fx, S - 13, 15, "ap-bk") + pa(`M${n1(fx - 15)} ${S - 13}A15 6 0 0 0 ${n1(fx + 15)} ${S - 13}`, "ap-ln ap-th");
    else s += pa(`M${n1(fx - 9)} ${S}Q${n1(fx - 9)} ${S - 8} ${n1(fx)} ${S - 8}Q${n1(fx + 9)} ${S - 8} ${n1(fx + 9)} ${S}Z`, "ap-bk") + `<rect x="${n1(fx - 9)}" y="${S}" width="18" height="24" class="ap-bk ap-under"/>` + rc(fx - 9, S + 24, 18, 7, "ap-fill", 1);
    const lm = fx - 120;
    const P = {
      float: { at: [fx + 9, S - (F.fault === "highfloat" ? 22 : 6)], lab: [Math.min(fx + 30, W - 16), S - 50], hit: [[fx - 18, S - 32, 36, 66]] },
      line: { at: [lm, F.fault === "slack" ? S + 18 : ty + (S - 2 - ty) * (lm - tx0) / (fx - 6 - tx0)], lab: [lm - 30, F.fault === "slack" ? S + 62 : S - 60], hit: lineHit || [], band: lineHit ? null : [tx0 + 6, ty, fx - 20, S - 2, 22] },
      watch: { at: [80, Dk - 81], lab: [64, 24], hit: [[64, Dk - 84, 44, 46]] },
      compass: { at: [164, Dk - 72], lab: [178, 24], hit: [[136, Dk - 76, 44, 44]] },
    };
    const hlF = F.fault === "highfloat" ? [[fx - 22, S - 34, 44, 44]] : [[tx0 + 4, S - 6, fx - tx0 - 16, 44]];
    return { s, P, hlF };
  },
};

/* ---- 5. belt transect on a rocky shore (5.2/LO2) ---- */
SET.transect = {
  ref: "5.2/LO2", lab: false, faults: ["parallel", "uneven", "sizes"],
  ctx: () => "Students sampling a rocky shore with a belt transect, seen from above (plan view, not to scale)",
  pieces: {
    tape: { name: "tape measure", nameable: true, conf: ["quadrat", "plankton net", "sorting tray"], clue: "a long marked tape pulled out from a reel",
      tap: "Tap the apparatus that marks the line along which the samples are taken.", use: "Marking the transect line and distances along it",
      useW: "It is laid out as the transect line along which the samples are taken." },
    quad: { name: "quadrat", nameable: true, conf: ["sorting tray", "dip net", "Secchi disc"], clue: "a square frame divided into smaller squares",
      tap: "Tap the apparatus that marks out the area in which organisms are counted.", use: "Marking out an area in which to count organisms",
      useW: "The organisms (or the percentage cover) inside it are recorded at each sampling point." },
    chart: { name: "identification chart", nameable: false, tap: "Tap the apparatus used to name the species that are found.", use: "Identifying the species found in each quadrat",
      useW: "Pictures of the shore organisms are compared with what is found, to name each species." },
  },
  misuse: [
    { t: "Choosing random positions for each of the samples", w: "transect samples are placed systematically, not at random" },
    { t: "Measuring the total population of the whole shore", w: "a transect shows distribution along a gradient, not the total population" },
    { t: "Measuring how steep the shore is at each point", w: "the slope is measured with ranging poles and a clinometer in a profile survey" },
  ],
  faultSt: [
    { id: "parallel", t: "The tape runs along the shore, parallel to the edge of the sea.", fix: "The transect should run from the top of the shore down to the sea, so it crosses the gradient; a line along one level of the shore misses the change." },
    { id: "uneven", t: "The quadrats are not at equal intervals along the tape.", fix: "Quadrats on a belt transect are placed systematically, at the same set interval, so the changes along the gradient can be compared." },
    { id: "sizes", t: "The quadrats along the tape are not all the same size.", fix: "The same size of quadrat must be used at every point, or the counts cannot be compared." },
    { id: "offline", t: "The quadrats have been placed well away from the line of the tape.", on: () => false, w: "every quadrat is placed right beside the tape" },
  ],
  impr: [
    ["Repeat the transect at other places along the same shore.", true, "more transects make the pattern more reliable"],
    ["Estimate percentage cover for seaweeds that cannot be counted.", true, "individual seaweeds often cannot be told apart, so percentage cover is used"],
    ["Measure abiotic factors at each quadrat as well.", true, "the changes in the organisms can then be linked to the conditions"],
    ["Place the quadrats along the tape using random numbers.", false, "transect quadrats are placed systematically, at set intervals"],
    ["Sample only where the most organisms can be seen.", false, "choosing spots adds bias"],
    ["Collect the organisms in a bag to count back at school.", false, "organisms are counted in place and left where they were found"],
  ],
  select: (F, r) => fieldSelect(r, ["ox", "ph", "temp", "light", "sal"], (f, id) => `The students also want to find out ${id === "light" ? "how bright it is at each quadrat" : f.replace(/the water/, "the water in rock pools")}. Which of these should they use?`),
  params(r, fault) {
    const steps = [46, 46, 46, 46], sizes = [30, 30, 30, 30, 30];
    if (fault === "uneven") { const pat = pickR(r, [[36, 78, 34, 36], [74, 34, 40, 36], [38, 36, 76, 34]]); steps.splice(0, 4, ...pat); }
    if (fault === "sizes") sizes.splice(0, 5, ...pickR(r, [[30, 18, 42, 24, 36], [40, 24, 30, 16, 34], [22, 36, 30, 44, 18]]));
    return { x: n1(170 + r() * 70), y: n1(150 + r() * 30), steps, sizes, rocks: Math.floor(r() * 1e6) };
  },
  draw(F) {
    const p = F.p, top = 50, sea = 296, par = F.fault === "parallel";
    let s = `<rect x="8" y="22" width="${W - 16}" height="${top - 22}" fill="url(#apparatus-hatch)" stroke="none"/>` + ln(8, top, W - 8, top, "ap-thick");
    s += tx(16, 16, "top of the shore", "ap-sm", "start") + tx(W - 16, H - 10, "sea", "ap-sm", "end");
    s += `<rect x="8" y="${sea}" width="${W - 16}" height="${H - 26 - sea}" class="ap-wat"/>`;
    for (let row = 0; row < 3; row++) { let d = `M8 ${sea + 8 + row * 14}`; for (let x = 8; x < W - 20; x += 20) d += `q10 -4 20 0`; s += pa(d, "ap-ln ap-th"); }
    s += pa(`M8 ${sea}` + Array.from({ length: 27 }, (_, i) => `Q${18 + i * 20} ${sea - 5} ${28 + i * 20} ${sea}`).join(""));
    // rocks and seaweed tufts (texture only)
    const rr = rng(p.rocks);
    for (let i = 0; i < 9; i++) { const x = 20 + rr() * 380, y = top + 20 + rr() * 200; if (!par && x > p.x - 40 && x < p.x + 78) continue; if (par && y > p.y - 72 && y < p.y + 64) continue;
      s += `<ellipse cx="${n1(x)}" cy="${n1(y)}" rx="${n1(10 + rr() * 10)}" ry="${n1(6 + rr() * 5)}" class="ap-rock"/>`; }
    // tape and quadrats
    const qs = []; let tapeHit;
    if (!par) {
      const x = p.x; s += ln(x, top - 6, x, sea - 6, "ap-tape") + ci(x, top - 8, 9, "ap-bk") + ci(x, top - 8, 3, "ap-fill");
      for (let y = top + 12, i = 0; y < sea - 8; y += 11.5, i++) s += ln(x - (i % 2 ? 3 : 5), y, x + 3, y, "ap-th");
      let y = top + 12; for (let i = 0; i < 5; i++) { const sz = p.sizes[i]; qs.push([x + 4, y, sz]); s += ln(x - 8, y, x + 3, y, "ap-thick2"); y += (p.steps[i] || 0); }
      tapeHit = [[x - 22, top - 20, 24, sea - top + 14]];
    } else {
      const y = p.y; s += ln(30, y, 420, y, "ap-tape") + ci(22, y, 9, "ap-bk") + ci(22, y, 3, "ap-fill");
      for (let x = 40, i = 0; x < 418; x += 11.5, i++) s += ln(x, y - 3, x, y + (i % 2 ? 3 : 5), "ap-th");
      for (let i = 0; i < 5; i++) qs.push([62 + i * 72, y + 4, p.sizes[i], true]);
      tapeHit = [[10, y - 20, 412, 24]];
    }
    for (const [qx, qy, sz, h] of qs) { const x0 = h ? qx - sz / 2 : qx, y0 = qy;
      s += rc(x0, y0, sz, sz, "ap-quad"); for (let k = 1; k < 4; k++) s += ln(x0 + (k * sz) / 4, y0, x0 + (k * sz) / 4, y0 + sz, "ap-th") + ln(x0, y0 + (k * sz) / 4, x0 + sz, y0 + (k * sz) / 4, "ap-th"); }
    const quadHit = qs.map(([qx, qy, sz, h]) => { const e = Math.max(sz, 24), x0 = h ? qx - e / 2 : qx, y0 = qy; return [x0, y0, e, e]; });
    // identification chart on a clipboard
    const cx = 444, cy = 92;
    s += rc(cx, cy, 88, 118, "ap-bk", 3) + rc(cx + 30, cy - 5, 28, 9, "ap-fill", 2);
    for (let i = 0; i < 3; i++) { const yy = cy + 22 + i * 32; s += ln(cx + 48, yy, cx + 78, yy, "ap-th") + ln(cx + 48, yy + 8, cx + 72, yy + 8, "ap-th"); }
    s += pa(`M${cx + 12} ${cy + 26}q10 -9 20 0q-10 9 -20 0ZM${cx + 32} ${cy + 26}l6 -5v10Z`, "ap-ln ap-th");
    s += pa(`M${cx + 14} ${cy + 70}a9 9 0 1 1 18 0h-18Zm9 0v-9`, "ap-ln ap-th");
    s += pa(`M${cx + 24} ${cy + 108}c-6 -8 4 -14 -2 -22M${cx + 24} ${cy + 108}c6 -8 -2 -14 6 -20`, "ap-ln ap-th");
    const q2 = qs[2], q3 = qs[3];
    const P = par ? {
      tape: { at: [(qs[1][0] + qs[2][0]) / 2, p.y], lab: [(qs[1][0] + qs[2][0]) / 2, p.y - 52], hit: tapeHit },
      quad: { at: [q3[0], q3[1] + q3[2]], lab: [q3[0] + 10, Math.min(q3[1] + q3[2] + 50, sea - 14)], hit: quadHit },
      chart: { at: [cx, cy + 60], lab: [cx - 28, cy + 30], hit: [[cx, cy - 6, 88, 124]] },
    } : {
      tape: { at: [p.x, (qs[0][1] + qs[0][2] + qs[1][1]) / 2], lab: [p.x - 50, (qs[0][1] + qs[0][2] + qs[1][1]) / 2], hit: tapeHit },
      quad: { at: [q2[0] + q2[2], q2[1] + q2[2] / 2], lab: [q2[0] + q2[2] + 56, q2[1] + q2[2] / 2 - 8], hit: quadHit },
      chart: { at: [cx, cy + 60], lab: [cx - 28, cy + 30], hit: [[cx, cy - 6, 88, 124]] },
    };
    const xs = qs.map((q) => (q[3] ? q[0] - q[2] / 2 : q[0])), ys = qs.map((q) => q[1]);
    const hlF = par ? [[12, p.y - 14, 412, 66]] : [[Math.min(...xs) - 24, Math.min(...ys) - 6, 74, Math.max(...ys.map((y, i) => y + qs[i][2])) - Math.min(...ys) + 12]];
    return { s, P, hlF };
  },
};

/* ---- 6. salinity and density (2.4/LO3) ---- */
SET.density = {
  ref: "2.4/LO3", lab: true, faults: ["unequal", "ice"], vb: [40, 314],
  ctx: () => "Apparatus for investigating how salinity affects the density of water. The two measuring cylinders hold solutions of different salinity (side view, not to scale).",
  pieces: {
    balance: { name: "balance", nameable: true, conf: ["water bath", "pH meter", "stop-watch"], clue: "a box with a flat pan on top and a digital display",
      tap: "Tap the apparatus used to measure the mass of each solution.", use: "Measuring the mass of each solution",
      useW: "It measures the mass of each solution; density = mass ÷ volume." },
    cyl: { name: "measuring cylinder", nameable: false, tap: "Tap the apparatus used to measure the volume of each solution.", use: "Measuring out the volume of each solution",
      useW: "It measures out the volume of each solution; density = mass ÷ volume." },
    thermo: { name: "thermometer", nameable: true, conf: ["glass rod", "dropping pipette", "gas syringe"], clue: "a narrow glass stem with a scale and a liquid-filled bulb at the bottom",
      tap: "Tap the apparatus used to check the temperature of the solutions.", use: "Checking the temperature of each solution",
      useW: "It is used to check the temperature of the solutions." },
    beaker: { name: "beaker", nameable: true, conf: ["boiling tube", "Petri dish", "wash bottle"], clue: "a wide glass container with a lip and a spout" },
    wash: { name: "wash bottle", nameable: true, conf: ["dropping pipette", "gas syringe", "beaker"], clue: "a squeezy plastic bottle with a long bent nozzle",
      tap: "Tap the apparatus used to add distilled water when diluting a solution.", use: "Adding distilled water to dilute a solution",
      useW: "Distilled water is squeezed out of it to dilute a stock salt solution to a lower salinity." },
  },
  misuse: [
    { t: "Measuring the density of each solution", w: "density is worked out as mass ÷ volume; none of these pieces measures it" },
    { t: "Measuring the salinity of each solution", w: "the salinities are made up in advance and are known" },
    { t: "Heating the solutions so the salt dissolves", w: "nothing in this method heats the solutions" },
  ],
  faultSt: [
    { id: "unequal", t: "The two cylinders do not hold the same volume of solution.", fix: "Equal volumes must be used, so the difference in mass is caused by the salinity alone (density = mass ÷ volume)." },
    { id: "ice", t: "One cylinder stands in ice, so the temperatures are different.", fix: "Temperature also changes density, so all the solutions must be at the same temperature." },
    { id: "offpan", t: "The measuring cylinder is not standing on the pan of the balance.", on: () => false, w: "a cylinder is standing on the balance pan" },
    { id: "nothermo", t: "There is no thermometer, so the temperature cannot be checked.", on: () => false, w: "a thermometer stands in one of the solutions" },
  ],
  impr: [
    ["Repeat each measurement and calculate a mean.", true, "repeats and a mean make the results more reliable"],
    ["Subtract the mass of the empty measuring cylinder.", true, "only the mass of the solution should be compared"],
    ["Stir each solution until all the salt has dissolved.", true, "undissolved salt would make the salinity lower than intended"],
    ["Use a larger volume of the saltier solution.", false, "the volumes must be equal for a fair comparison"],
    ["Measure each volume with a beaker instead.", false, "a beaker is less precise than a measuring cylinder"],
    ["Warm the saltier solution so the salt dissolves.", false, "warming changes the density, so temperature must stay the same"],
  ],
  select: () => ({ q: "Which apparatus could measure the density of each solution directly?",
    options: ["hydrometer", "balance", "thermometer", "pH meter"],
    why: "A <b>hydrometer</b> floats in the liquid; it floats higher in a denser (saltier) solution, and its scale gives the density directly. A balance gives only the mass, so density = mass ÷ volume also needs the volume. A thermometer measures temperature and a pH meter measures pH." }),
  params(r, fault) {
    const lev = 7 + Math.floor(r() * 3); let l2 = lev;
    if (fault === "unequal") l2 = pickR(r, [lev - 3, lev - 4, lev + 3].filter((v) => v >= 3 && v <= 11));
    return { l1: lev, l2, mass: n1(40 + r() * 40), sal: pickR(r, [["35", "10"], ["30", "5"], ["40", "20"], ["10", "35"]]) };
  },
  draw(F) {
    const p = F.p, B = 300, ice = F.fault === "ice";
    let s = bench(B);
    // balance with a cylinder on its pan
    s += rc(36, B - 46, 148, 46, "ap-bk", 6) + rc(56, B - 36, 76, 22, "ap-bk", 2) + tx(124, B - 20, `${p.mass.toFixed(1)} g`, "ap-dig", "end");
    s += rc(152, B - 32, 14, 9, "ap-bk", 2) + rc(70, B - 54, 84, 6, "ap-bk", 2) + rc(108, B - 48, 8, 2, "ap-fill");
    const c1 = 112, C1 = cylinder(c1, B - 54, 150, p.l1);
    s += C1.s + tx(c1 - 18, C1.top + 14, `${p.sal[0]} ppt`, "ap-sm", "end");
    // second cylinder on a block (so both cylinders stand at the same height), in a beaker of ice or not, with a thermometer
    const c2 = 250, Bk = B - 54, base2 = Bk;
    s += `<rect x="${c2 - 38}" y="${Bk}" width="76" height="54" class="ap-bk"/><rect x="${c2 - 38}" y="${Bk}" width="76" height="54" fill="url(#apparatus-hatch2)" stroke="none"/>`;
    if (ice) {
      s += `<path d="M${c2 - 36} ${Bk - 50}L${c2 + 36} ${Bk - 50}L${c2 + 36} ${Bk - 2}L${c2 - 36} ${Bk - 2}Z" class="ap-wat"/>`;
      for (const [dx, dy, a] of [[-27, -36, 12], [-24, -15, -18], [25, -38, 20], [26, -15, -10], [-26, -26, 30], [24, -26, 5]]) s += `<rect x="${n1(c2 + dx - 5)}" y="${n1(Bk + dy - 5)}" width="10" height="10" rx="2" transform="rotate(${a} ${n1(c2 + dx)} ${n1(Bk + dy)})" class="ap-bk"/>`;
    }
    const C2 = cylinder(c2, base2, 150, p.l2);
    s += C2.s + tx(c2 - 18, C2.top + 14, `${p.sal[1]} ppt`, "ap-sm", "end");
    if (ice) s += pa(`M${c2 - 40} ${Bk - 64}L${c2 - 36} ${Bk - 60}L${c2 - 36} ${Bk}L${c2 + 36} ${Bk}L${c2 + 36} ${Bk - 62}`, "ap-ln ap-thick2") + ln(c2 - 36, Bk - 50, c2 + 36, Bk - 50, "ap-th");
    const tT = C2.top - 30, tX = c2 - 4; s += therm(tX, tT, base2 - 20);
    // beaker of solution and a wash bottle
    const c3 = 368;
    s += `<rect x="${c3 - 34}" y="${B - 58}" width="68" height="${56}" class="ap-wat"/>` + ln(c3 - 34, B - 58, c3 + 34, B - 58, "ap-th");
    s += pa(`M${c3 - 40} ${B - 86}L${c3 - 35} ${B - 80}L${c3 - 35} ${B - 4}Q${c3 - 35} ${B} ${c3 - 31} ${B}L${c3 + 31} ${B}Q${c3 + 35} ${B} ${c3 + 35} ${B - 4}L${c3 + 35} ${B - 84}`, "ap-ln ap-thick2");
    for (let i = 1; i <= 3; i++) s += ln(c3 - 35, B - i * 20, c3 - 27, B - i * 20, "ap-th");
    const c4 = 482;
    s += `<path d="M${c4 - 22} ${B}L${c4 - 22} ${B - 70}Q${c4 - 22} ${B - 86} ${c4 - 8} ${B - 88}L${c4 + 8} ${B - 88}Q${c4 + 22} ${B - 86} ${c4 + 22} ${B - 70}L${c4 + 22} ${B}Z" class="ap-bk"/>`;
    s += `<rect x="${c4 - 22}" y="${B - 52}" width="44" height="50" class="ap-wat"/>` + rc(c4 - 9, B - 98, 18, 11, "ap-bk", 2);
    s += pa(`M${c4} ${B - 98}L${c4} ${B - 122}Q${c4} ${B - 130} ${c4 - 8} ${B - 130}L${c4 - 30} ${B - 130}L${c4 - 40} ${B - 118}`, "ap-ln ap-thick2");
    const P = {
      balance: { at: [62, B - 6], lab: [62, B + 30], hit: [[34, B - 58, 152, 58]] },
      cyl: { at: [c2 + 12, base2 - 76], lab: [c2 + 46, C2.top + 18], hit: [[c1 - 22, C1.top - 4, 44, B - 54 - C1.top + 4], [c2 - 22, C2.top - 4, 44, base2 - C2.top + 4]] },
      thermo: { at: [tX - 3, tT + 10], lab: [tX - 40, tT + 4], hit: [[tX - 11, tT - 2, 22, C2.top - tT]] },
      beaker: { at: [c3 + 18, B - 60], lab: [c3 + 6, B - 122], hit: [[c3 - 40, B - 90, 80, 90]] },
      wash: { at: [c4 + 22, B - 40], lab: [c4 + 50, B - 76], hit: [[c4 - 44, B - 136, 70, 136]] },
    };
    const hlF = ice ? [[c2 - 46, Bk - 70, 92, 72]] : [[c1 - 26, Math.min(C1.L, C2.L) - 10, c2 - c1 + 52, Math.abs(C1.L - C2.L) + 20]];
    return { s, P, hlF };
  },
};

/* the further-measurement question for field set-ups (syllabus list of abiotic apparatus) */
const FIELD = {
  ox: { f: "how much of the gas that animals need for respiration the water holds", keys: ["oxygen meter", "dissolved-oxygen test kit"], q: "dissolved oxygen" },
  ph: { f: "how acidic or alkaline the water is", keys: ["pH meter", "universal indicator paper"], q: "pH" },
  sal: { f: "the density of the water (to compare salinity)", keys: ["hydrometer"], q: "density (and so salinity)" },
  temp: { f: "how warm the water is", keys: ["thermometer"], q: "temperature" },
  light: { f: "how bright it is", keys: ["light meter"], q: "light intensity" },
};
const METER = { "oxygen meter": "ox", "dissolved-oxygen test kit": "ox", "pH meter": "ph", "universal indicator paper": "ph", hydrometer: "sal", thermometer: "temp", "light meter": "light" };
const METERW = { "oxygen meter": "an oxygen meter measures dissolved oxygen", "dissolved-oxygen test kit": "a dissolved-oxygen test kit measures dissolved oxygen", "pH meter": "a pH meter measures pH",
  "universal indicator paper": "universal indicator paper shows pH by its colour", "light meter": "a light meter measures light intensity", hydrometer: "a hydrometer measures density (to compare salinity)", thermometer: "a thermometer measures temperature" };
// the key is never the longest option: the two 25-character names are each sometimes the key and sometimes a distractor
function fieldSelect(r, ids, stem) {
  const id = pickR(r, ids), f = FIELD[id], key = pickR(r, f.keys);
  // one distractor per other factor, so no two options do the same job; a long key gets the other long name
  const facs = shuffleR(r, Object.keys(FIELD).filter((k) => k !== id)).slice(0, 3);
  const others = facs.map((k) => (key.length > 12 && FIELD[k].keys.length > 1 ? FIELD[k].keys[1] : pickR(r, FIELD[k].keys)));
  if (key.length > Math.max(...others.map((o) => o.length))) { const k2 = Object.keys(FIELD).find((k) => k !== id && FIELD[k].keys.length > 1); const i = facs.indexOf(k2); if (i >= 0) others[i] = FIELD[k2].keys[1]; else { facs[2] = k2; others[2] = FIELD[k2].keys[1]; } }
  return { q: stem(f.f, id), options: [key, ...others],
    why: `${cap(METERW[key])}, so it is the one to use to find out ${id === "light" ? "how bright it is" : f.f}. ` + cap(others.map((o) => METERW[o]).join("; ")) + "." };
}

/* =================== generation =================== */
const SETS = Object.keys(SET);
const art = (n) => (/^[aeiou]/i.test(n) ? "an" : "a");
const cap = (s) => s[0].toUpperCase() + s.slice(1);
const avail = (S, F) => Object.keys(S.pieces).filter((id) => !(S.pieces[id].absent && S.pieces[id].absent(F)));
const canTap = (S, F, id) => S.pieces[id].tap && !(S.pieces[id].noAsk && S.pieces[id].noAsk(F));
const canUse = (S, F, id) => S.pieces[id].use && !(S.pieces[id].noAsk && S.pieces[id].noAsk(F));

function make(seed) {
  const r = rng(seed);
  const set = SETS[Math.floor(r() * SETS.length)], S = SET[set], fault = pickR(r, S.faults);
  const F = { kind: KEY, seed, set, fault };
  F.p = S.params(r, fault);
  const av = avail(S, F);
  for (let t = 0; t < 200; t++) {
    const n = Math.min(av.length, 3 + Math.floor(r() * 3)), pick = shuffleR(r, av).slice(0, n);
    const Xs = pick.filter((id) => S.pieces[id].nameable); if (!Xs.length) continue;
    const X = pickR(r, Xs), Ys = pick.filter((id) => id !== X && canTap(S, F, id)); if (!Ys.length) continue;
    const Y = pickR(r, Ys), Zs = pick.filter((id) => id !== X && id !== Y && canUse(S, F, id));
    const Z = Zs.length ? pickR(r, Zs) : null;
    if (!Z && t < 60) continue;
    const L = shuffleR(r, "ABCDE".slice(0, n).split("")), let_ = {}; pick.forEach((id, i) => (let_[id] = L[i]));
    Object.assign(F, { let: let_, X, Y, Z }); return F;
  }
  throw new Error("apparatus: no lettering");
}

/* =================== drawing =================== */
function svg(F, opt) {
  opt = opt || {}; const hl = opt.hl || {}, S = SET[F.set], D = S.draw(F);
  const defs = `<defs><pattern id="apparatus-hatch" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M-1 1L1 -1M0 7L7 0M6 8L8 6" class="ap-hatch"/></pattern>` +
    `<pattern id="apparatus-hatch2" width="5" height="5" patternUnits="userSpaceOnUse"><path d="M0 5L5 0" class="ap-hatch"/></pattern>` +
    `<pattern id="apparatus-dots" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r="1" class="ap-dotp"/></pattern></defs>`;
  let s = defs + D.s;
  const ids = Object.keys(F.let);
  if (hl.fault) for (const h of D.hlF) s += `<rect x="${n1(h[0])}" y="${n1(h[1])}" width="${n1(h[2])}" height="${n1(h[3])}" rx="8" class="ap-hlf"/>`;
  for (const id of ids) { // label lines and letters
    const P = D.P[id], [ax, ay] = P.at, [lx, ly] = P.lab, dd = Math.hypot(ax - lx, ay - ly) || 1, sx = lx + ((ax - lx) / dd) * 15, sy = ly + ((ay - ly) / dd) * 15;
    s += ln(sx, sy, ax, ay, "ap-lead") + ci(ax, ay, 2.6, "ap-fill") + tx(lx, ly + 9, F.let[id], "ap-let");
  }
  const shapes = (id) => { const P = D.P[id]; return P.hit.map(rectD).join("") + (P.band ? bandRects(...P.band) : "") + rectD([P.lab[0] - 20, P.lab[1] - 20, 40, 40]); };
  if (hl.piece) s += `<path d="${shapes(hl.piece)}" class="ap-hl"/>`;
  if (hl.wrong && hl.wrong !== F.let[hl.piece]) { const id = ids.find((k) => F.let[k] === hl.wrong); if (id) s += `<path d="${shapes(id)}" class="ap-hlw"/>`; }
  if (opt.tapMode) {
    const area = (id) => D.P[id].hit.reduce((a, h) => a + h[2] * h[3], 0) + (D.P[id].band ? 4000 : 0);
    for (const id of ids.slice().sort((a, b) => area(b) - area(a))) s += `<path d="${shapes(id)}" fill="transparent" data-tap="${F.let[id]}"/>`;
  }
  const vb = S.vb || [0, H];
  return `<svg viewBox="0 ${vb[0]} ${W} ${vb[1]}" class="figsvg fig-${KEY}" role="img" aria-label="Diagram of a practical set-up with lettered apparatus">${s}</svg>`;
}

/* =================== questions =================== */
function questions(F, r) {
  const S = SET[F.set], qs = [], Pc = (id) => S.pieces[id], Lt = F.let;
  const present = avail(S, F);
  // 1. name the apparatus labelled X
  const X = Pc(F.X);
  const clash = CLASH[X.name] || [];
  const conf = shuffleR(r, X.conf.filter((n) => !clash.includes(n))), rest = shuffleR(r, S.lab ? LABNAMES : FIELDNAMES).filter((n) => n !== X.name && !clash.includes(n) && !conf.includes(n));
  const nd = conf.concat(rest).slice(0, 3);
  if (X.name.length > Math.max(...nd.map((x) => x.length))) { const lg = rest.find((x) => !nd.includes(x) && x.length >= X.name.length); if (lg) nd[2] = lg; }
  qs.push({ kind: "choice", q: `Name the apparatus labelled <b>${Lt[F.X]}</b>.`, options: [X.name, ...nd], a: 0, hl: { piece: F.X },
    why: `<b>${Lt[F.X]}</b> is ${art(X.name)} <b>${X.name}</b>: ${X.clue}. ${X.useW || ""}`.trim() });
  // 2. tap the apparatus used to measure / do Y
  const Y = Pc(F.Y), lY = Lt[F.Y];
  qs.push({ kind: "tap", q: Y.tap, a: [lY], ansTxt: `apparatus ${lY}`, labelOf: (id) => `apparatus ${id}`,
    askOpt: { tapMode: true }, doneOpt: (st, ok) => ({ hl: { piece: F.Y, wrong: ok ? null : (st || [])[0] } }), hl: { piece: F.Y },
    why: `Apparatus <b>${lY}</b> is the <b>${Y.name}</b>. ${Y.useW}` });
  // 3. what is apparatus Z used for?
  if (F.Z) {
    const Z = Pc(F.Z), lZ = Lt[F.Z];
    const other = present.filter((id) => id !== F.Z && id !== F.X && id !== F.Y && canUse(S, F, id)).map((id) => ({ t: Pc(id).use, w: `that is the job of the ${Pc(id).name}` }));
    const mis = S.misuse.filter((m) => !(m.not || []).includes(F.Z));
    const cand = shuffleR(r, other).concat(shuffleR(r, mis));
    let d = cand.slice(0, 3);
    if (Z.use.length > Math.max(...d.map((x) => x.t.length))) { const lg = cand.slice(3).find((x) => x.t.length >= Z.use.length); if (lg) d[2] = lg; }
    qs.push({ kind: "choice", q: `What is apparatus <b>${lZ}</b> used for in this investigation?`, options: [Z.use, ...d.map((x) => x.t)], a: 0, hl: { piece: F.Z },
      why: `Apparatus <b>${lZ}</b> is the <b>${Z.name}</b>. ${Z.useW}<br>` + d.map((x) => `✗ ${x.t}: ${x.w}.`).join("<br>") });
  }
  // 4. choose the apparatus for a further measurement
  const sel = S.select(F, r);
  qs.push({ kind: "choice", q: sel.q, options: sel.options, a: 0, why: sel.why });
  // 5. spot the fault
  const key = S.faultSt.find((x) => x.id === F.fault), wrong = S.faultSt.filter((x) => x.id !== F.fault);
  let fd = shuffleR(r, wrong).slice(0, 3);
  if (key.t.length > Math.max(...fd.map((x) => x.t.length))) { const lg = wrong.filter((x) => !fd.includes(x)).find((x) => x.t.length >= key.t.length); if (lg) fd[2] = lg; }
  const notShown = (x) => (x.on ? x.w : "that is not what the diagram shows");
  qs.push({ kind: "choice", q: "The diagram shows <b>one</b> mistake in the way this investigation has been set up. What is the mistake?", options: [key.t, ...fd.map((x) => x.t)], a: 0, hl: { fault: true },
    why: `The mistake: ${key.t[0].toLowerCase() + key.t.slice(1).replace(/\.$/, "")}. ${key.fix}<br>` + fd.map((x) => `✗ ${x.t.replace(/\.$/, "")}: ${x.on ? x.w : "the diagram does not show this"}.`).join("<br>") });
  // 6. tick the changes that would improve the investigation
  let pick = null; for (let t = 0; t < 20 && !pick; t++) pick = pickMixed(r, S.impr, 4);
  if (pick) qs.push({ kind: "multi", q: "Which of these would improve this investigation? Tick <b>every</b> one that would.", options: pick.map((x) => x[0]), a: pick.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0),
    why: pick.map((x) => `${x[1] ? "✓" : "✗"} ${x[0].replace(/\.$/, "")}: ${x[2]}.`).join("<br>") });
  return qs;
}

/* =================== self-test =================== */
const ALLNAMES = [...new Set(Object.values(SET).flatMap((S) => Object.values(S.pieces).map((p) => p.name)).concat(LABNAMES, FIELDNAMES, ["hydrometer", "water bath", "life jacket"]))];
function selfTest(F, qs) {
  const bad = [], S = SET[F.set], D = S.draw(F), ids = Object.keys(F.let);
  if (ids.length < 3 || ids.length > 5) bad.push("letter count " + ids.length);
  if (!S.pieces[F.X].nameable || F.X === F.Y || F.Z === F.X || F.Z === F.Y) bad.push("roles");
  if (!canTap(S, F, F.Y)) bad.push("Y not askable");
  // letters inside the frame, apart from each other; tap areas big enough
  const L = ids.map((id) => D.P[id].lab);
  L.forEach(([x, y], i) => { const vb = S.vb || [0, H]; if (x < 20 || x > W - 20 || y < vb[0] + 20 || y > vb[0] + vb[1] - 20) bad.push("letter outside " + ids[i]); L.forEach(([x2, y2], j) => { if (j > i && Math.abs(x - x2) < 40 && Math.abs(y - y2) < 40) bad.push("letter boxes overlap " + ids[i] + "/" + ids[j]); }); });
  for (const id of ids) for (const o of ids) if (o !== id) { const [x, y] = D.P[id].lab; if (D.P[o].hit.some((h) => x > h[0] && x < h[0] + h[2] && y > h[1] && y < h[1] + h[3])) bad.push("letter " + id + " inside tap area of " + o); }
  for (const id of ids) { for (const h of D.P[id].hit) if (h[2] < 22 || h[3] < 22) bad.push("small hit " + id + " " + h.map(n1).join(",")); if (!D.P[id].hit.length && !D.P[id].band) bad.push("no hit " + id); }
  // no apparatus names in the drawing
  const sv = svg(F, {}), txt = [...sv.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1].toLowerCase()).join(" | ");
  for (const n of ALLNAMES) if (txt.includes(n.toLowerCase())) bad.push("name drawn " + n);
  // key never the longest; fault question has exactly one shown mistake
  for (const q of qs) if (q.kind === "choice") { const k = q.options[q.a].length; if (k > Math.max(...q.options.filter((_, j) => j !== q.a).map((o) => o.length))) bad.push("key longest: " + q.options[q.a]); if (new Set(q.options).size !== q.options.length) bad.push("dup options"); }
  const fq = qs.find((q) => /one<\/b> mistake/.test(q.q));
  if (!fq) bad.push("no fault q"); else { const on = fq.options.map((o) => S.faultSt.find((x) => x.t === o)).map((x) => (x.on ? x.on(F) : x.id === F.fault)); if (on.filter(Boolean).length !== 1 || !on[fq.a]) bad.push("fault truth"); }
  // the use question never offers a use already revealed by questions 1–2
  const uq = qs.find((q) => /used for in this/.test(q.q));
  if (uq) { const rev = [S.pieces[F.X].use, S.pieces[F.Y].use].filter(Boolean); if (uq.options.some((o, j) => j !== uq.a && rev.includes(o))) bad.push("use revealed"); }
  // feedback of questions 1–4 never mentions the fault
  const fk = S.faultSt.find((x) => x.id === F.fault);
  for (const q of qs.slice(0, qs.indexOf(fq))) if (q.why.includes(fk.t.slice(0, 24))) bad.push("fault revealed early");
  // select answer is not a lettered piece
  const sq = qs[F.Z ? 3 : 2]; if (ids.some((id) => S.pieces[id].name === sq.options[sq.a])) bad.push("select answer drawn");
  if (qs.length < 5 || qs.length > 7) bad.push("question count " + qs.length);
  return bad;
}

export default {
  key: KEY, group: "Diagrams", name: "Practical apparatus", topics: "Units 1, 2, 4, 5 (practical skills)", thumbSeed: 5,
  blurb: "Exam-style drawings of practical set-ups: name the lettered apparatus, say what each piece measures, spot the mistake in the set-up and choose improvements.",
  tips: ["Learn the shapes: a thermometer has a bulb at the bottom; a Secchi disc has black and white quarters and hangs on a marked rope; a quadrat is a square frame; a clamp stand grips a tube on an upright rod.",
    "Say what each piece measures, with the quantity: a ruler measures the distance from the lamp to the plant; a stop-watch measures the time; a balance measures mass.",
    "Common mistakes in a set-up: no water bath when a lamp is close; a thermometer bulb out of the liquid; a Secchi disc read in the glare; a float that sits high in the wind; a transect that does not run down the shore.",
    "Abiotic factors: oxygen meter or dissolved-oxygen test kit (dissolved oxygen), pH meter or universal indicator (pH), light meter (light intensity), hydrometer (density, to compare salinity), thermometer (temperature)."],
  ctx: (F) => SET[F.set].ctx(F),
  make, svg, questions, selfTest, SET,
  css: `.fig-apparatus .ap-ln{fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}.fig-apparatus .ap-th{stroke:currentColor;stroke-width:1.1;fill:none}
.fig-apparatus .ap-thick{fill:none;stroke:currentColor;stroke-width:3;stroke-linecap:round}.fig-apparatus .ap-thick2{fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round}
.fig-apparatus .ap-bk{fill:var(--surface);stroke:currentColor;stroke-width:1.6;stroke-linejoin:round}.fig-apparatus .ap-fill{fill:currentColor}
.fig-apparatus .ap-wat{fill:color-mix(in srgb,var(--ink) 12%,transparent);stroke:none}.fig-apparatus .ap-under{fill:color-mix(in srgb,var(--ink) 12%,var(--surface))}
.fig-apparatus .ap-col{stroke:currentColor;stroke-width:2.2}.fig-apparatus .ap-dash{stroke-dasharray:4 4}
.fig-apparatus .ap-hatch{stroke:currentColor;stroke-width:.9;opacity:.6}.fig-apparatus .ap-dotp{fill:currentColor;opacity:.55}.fig-apparatus .ap-shade{stroke:currentColor;stroke-width:1;stroke-dasharray:3 3}
.fig-apparatus .ap-flame{fill:color-mix(in srgb,var(--ink) 18%,var(--surface));stroke:currentColor;stroke-width:1.4}
.fig-apparatus .ap-rope{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}.fig-apparatus .ap-tape{stroke:currentColor;stroke-width:5;stroke-linecap:butt;opacity:.9}
.fig-apparatus .ap-quad{fill:none;stroke:currentColor;stroke-width:2.4}.fig-apparatus .ap-rock{fill:color-mix(in srgb,var(--ink) 10%,transparent);stroke:currentColor;stroke-width:1;opacity:.8}
.fig-apparatus .ap-sm{font-size:17px;fill:currentColor}.fig-apparatus .ap-dig{font-size:18px;font-weight:700;fill:currentColor;font-family:ui-monospace,monospace}
.fig-apparatus .ap-let{font-size:26px;font-weight:800;fill:currentColor}.fig-apparatus .ap-lead{stroke:currentColor;stroke-width:1.3}
.fig-apparatus .ap-hl{fill:color-mix(in srgb,var(--app) 28%,transparent);stroke:var(--app);stroke-width:2.5}
.fig-apparatus .ap-hlw{fill:none;stroke:var(--accent);stroke-width:2.5;stroke-dasharray:6 4}.fig-apparatus .ap-hlf{fill:color-mix(in srgb,var(--app) 14%,transparent);stroke:var(--app);stroke-width:3;stroke-dasharray:7 4}`,
};
