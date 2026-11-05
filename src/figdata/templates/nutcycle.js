/* ---------- NUTRIENT CYCLING IN A MARINE ECOSYSTEM (0697 4.1/LO5 "explain how nutrients cycle through marine
   ecosystems", 4.1/LO6 "outline the role of bacteria as decomposers in cycling nutrients", with 4.1/LO4 nitrogen →
   proteins, as asked in s24) ----------
   A box-and-arrow cycle drawn as a ring. Arrows show the direction the nutrients move. Two layouts:
     A (5 boxes): nutrients dissolved in sea water → phytoplankton → zooplankton and fish → dead organisms and faeces
       → bacteria → back to the dissolved nutrients; plus a chord phytoplankton → dead organisms (producers die too).
       Rotated to any of 5 starting positions, clockwise or anticlockwise.
     B (6 boxes, the deep-water loop): the same surface part, then dead material sinks (marine snow) to bacteria
       on/near the seabed → nutrients dissolved in deep water → upwelling → nutrients in surface water. A dashed line
       separates surface water from deep water; mirrored left–right by seed.
   Two boxes are blank, X and Y (X is one of the organism / dead-material boxes: consumers, dead material or bacteria in
   layout A, also phytoplankton in B); every arrow is lettered. The two tapped arrows never touch box X.
   Knowledge model rules: guidance steps only (taken up, passed up food chains, death and decay, marine snow,
   upwelling); no nitrification / fixation / named bacteria / fungi / enzymes; "downwelling" never required.
   Misconceptions used as distractors: nutrients are used up or destroyed · energy cycles like nutrients ·
   decomposers are producers · upwelling goes downwards · upwelled water is warm · consumers take nutrients straight
   from the water · producers need only light and carbon dioxide.
   Run order is fixed so no feedback gives away a later answer: box X → no decomposers → two arrow taps → nitrogen →
   deep-water route (order, layout A) or upwelling stops (choice, layout B) → tick the true statements. Box Y is never
   asked and never named in a later explanation; choice questions after Q1 highlight nothing on the figure. */
import { rng, shuffleR, pickMixed } from "../core.js";

const KEY = "nutcycle";
const BW = 160, BH = 60;
const f1 = (v) => (Math.round(v * 10) / 10).toFixed(1);
const cap = (s) => s[0].toUpperCase() + s.slice(1);

const LINES = {
  S: { A: ["nutrients in", "sea water"], B: ["nutrients in", "surface water"] },
  P: ["phytoplankton"], C: ["zooplankton", "and fish"], D: ["dead organisms", "and faeces"], B: ["bacteria"],
  N: ["nutrients in", "deep water"],
};
const linesOf = (F, id) => (id === "S" ? LINES.S[F.layout] : LINES[id]);
const labelOf = (F, id) => linesOf(F, id).join(" ");
const ROLE = { P: "the producers", C: "the consumers", D: "the dead material", B: "the decomposers" };

/* ---------- model ---------- */
function make(seed) {
  const r = rng(seed + 17);
  const layout = r() < 0.5 ? "A" : "B";
  const F = { kind: KEY, seed, layout, nodes: {}, arrows: [] };
  let W, H;
  if (layout === "A") {
    W = 560; H = 392;
    const cx = 280, cy = 206, rx = 196, ry = 148, s0 = Math.floor(r() * 5), dir = r() < 0.5 ? 1 : -1;
    F.rot = s0; F.dir = dir;
    ["S", "P", "C", "D", "B"].forEach((id, j) => {
      const slot = (((s0 + dir * j) % 5) + 5) % 5, th = ((-90 + 72 * slot) * Math.PI) / 180;
      F.nodes[id] = { x: cx + rx * Math.cos(th), y: cy + ry * Math.sin(th) };
    });
    F.c = { x: cx, y: cy };
    F.arrows = [["up", "S", "P"], ["eat", "P", "C"], ["die", "C", "D"], ["dec", "D", "B"], ["rel", "B", "S"], ["pdie", "P", "D"]];
  } else {
    W = 580; H = 360;
    const cx = 290, cy = 186, rx = 204, ry = 128, mir = r() < 0.5;
    F.mirror = mir;
    // a stretched hexagon: the top and bottom pairs are set wider apart than a regular one, so their arrows are long enough to tap
    const h = ry * Math.sin(Math.PI / 3), OFF = { S: [-1, 0], P: [-0.6, -h / ry], C: [0.6, -h / ry], D: [1, 0], B: [0.6, h / ry], N: [-0.6, h / ry] };
    for (const [id, [ox, oy]] of Object.entries(OFF)) { const x = cx + rx * ox; F.nodes[id] = { x: mir ? 2 * cx - x : x, y: cy + ry * oy }; }
    F.c = { x: cx, y: cy };
    F.line = cy + BH / 2 + (ry * Math.sin(Math.PI / 3) - BH) / 2;   // between the surface and deep boxes
    F.arrows = [["up", "S", "P"], ["eat", "P", "C"], ["die", "C", "D"], ["snow", "D", "B"], ["rel", "B", "N"], ["upw", "N", "S"], ["pdie", "P", "D"]];
  }
  F.W = W; F.H = H;
  const lets = shuffleR(r, "ABCDEFG".slice(0, F.arrows.length).split(""));
  F.arrows = F.arrows.map(([id, from, to], i) => ({ id, from, to, letter: lets[i], ...geom(F, from, to, id === "pdie") }));
  // blanks: X is an organism / dead-material box; Y is any other box
  const X = shuffleR(r, layout === "A" ? ["C", "D", "B"] : ["P", "C", "D", "B"])[0];
  const Y = shuffleR(r, Object.keys(F.nodes).filter((k) => k !== X))[0];
  F.blank = { X, Y };
  return F;
}

/** where a ray from the centre of a box leaves it (with a small gap) */
function exitT(dx, dy, gap) {
  const hw = BW / 2 + gap, hh = BH / 2 + gap;
  return Math.min(Math.abs(dx) > 1e-9 ? hw / Math.abs(dx) : 1e9, Math.abs(dy) > 1e-9 ? hh / Math.abs(dy) : 1e9);
}
function geom(F, from, to, chord) {
  const A = F.nodes[from], B = F.nodes[to];
  if (chord) {
    // producers → dead material: a curve through the middle of the ring, leaving and entering each box on the side
    // that faces the centre, so it stays clear of the ring arrows at both ends
    const c = F.c, ea = { x: c.x - A.x, y: c.y - A.y }, eb = { x: c.x - B.x, y: c.y - B.y };
    const ta = exitT(ea.x, ea.y, 3), tb = exitT(eb.x, eb.y, 5);
    const p0 = { x: A.x + ea.x * ta, y: A.y + ea.y * ta }, p1 = { x: B.x + eb.x * tb, y: B.y + eb.y * tb };
    const at = (t) => ({ x: (1 - t) * (1 - t) * p0.x + 2 * t * (1 - t) * c.x + t * t * p1.x, y: (1 - t) * (1 - t) * p0.y + 2 * t * (1 - t) * c.y + t * t * p1.y });
    const pts = []; for (let k = 0; k <= 24; k++) pts.push(at(k / 24));
    let len = 0; for (let k = 1; k < pts.length; k++) len += Math.hypot(pts[k].x - pts[k - 1].x, pts[k].y - pts[k - 1].y);
    const m = at(0.5), cm = { x: (p0.x + p1.x) / 2, y: (p0.y + p1.y) / 2 }, cl = Math.hypot(p1.x - p0.x, p1.y - p0.y);
    let nx = -(p1.y - p0.y) / cl, ny = (p1.x - p0.x) / cl;
    if (nx * (m.x - cm.x) + ny * (m.y - cm.y) < 0) { nx = -nx; ny = -ny; }   // letter on the inside of the bend
    const lx = m.x + nx * 21, ly = m.y + ny * 21 + 6;
    const inner = [], outer = [];
    for (let k = 1; k < pts.length - 1; k++) {
      const a = pts[k - 1], b = pts[k + 1], l = Math.hypot(b.x - a.x, b.y - a.y); let qx = -(b.y - a.y) / l, qy = (b.x - a.x) / l;
      if (qx * nx + qy * ny < 0) { qx = -qx; qy = -qy; }
      inner.push([pts[k].x - qx * 20, pts[k].y - qy * 20]); outer.push([pts[k].x + qx * 36, pts[k].y + qy * 36]);
    }
    return { p0, p1, c, pts, len, lx, ly, band: inner.concat(outer.reverse()), curve: true };
  }
  const dx = B.x - A.x, dy = B.y - A.y, L = Math.hypot(dx, dy);
  const t0 = exitT(dx, dy, 3), t1 = 1 - exitT(dx, dy, 5);
  const p0 = { x: A.x + dx * t0, y: A.y + dy * t0 }, p1 = { x: A.x + dx * t1, y: A.y + dy * t1 };
  const ux = dx / L, uy = dy / L;
  let nx = -uy, ny = ux;
  const mx = (p0.x + p1.x) / 2, my = (p0.y + p1.y) / 2;
  if (nx * (mx - F.c.x) + ny * (my - F.c.y) < 0) { nx = -nx; ny = -ny; }   // letter on the outside of the ring
  const len = Math.hypot(p1.x - p0.x, p1.y - p0.y);
  const lx = mx + nx * 21, ly = my + ny * 21 + 6;
  // tap area: a band along the arrow, wider on the letter side so the letter is inside it
  const a0 = { x: p0.x + ux * 2, y: p0.y + uy * 2 }, a1 = { x: p1.x - ux * 2, y: p1.y - uy * 2 };
  const band = [[a0, -20], [a1, -20], [a1, 36], [a0, 36]].map(([p, w]) => [p.x + nx * w, p.y + ny * w]);
  return { p0, p1, pts: [p0, p1], len, lx, ly, band };
}

/* ---------- drawing ---------- */
function svg(F, opt) {
  opt = opt || {}; const hl = opt.hl || {};
  let s = `<defs><marker id="${KEY}-ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" class="nc-ah"/></marker>
<marker id="${KEY}-ahh" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 z" class="nc-ahh"/></marker></defs>`;
  if (F.layout === "B") {
    s += `<line x1="8" x2="${F.W - 8}" y1="${f1(F.line)}" y2="${f1(F.line)}" class="nc-sea"/>`;
    s += `<text x="${F.c.x}" y="${f1(F.line - 7)}" text-anchor="middle" class="nc-zone">surface water</text>`;
    s += `<text x="${F.c.x}" y="${f1(F.line + 20)}" text-anchor="middle" class="nc-zone">deep water</text>`;
  }
  for (const a of F.arrows) {
    const on = (hl.arrows || []).includes(a.id);
    const d = a.curve ? `M${f1(a.p0.x)} ${f1(a.p0.y)}Q${f1(a.c.x)} ${f1(a.c.y)} ${f1(a.p1.x)} ${f1(a.p1.y)}` : `M${f1(a.p0.x)} ${f1(a.p0.y)}L${f1(a.p1.x)} ${f1(a.p1.y)}`;
    s += `<path d="${d}" class="nc-arr${on ? " on" : ""}" marker-end="url(#${KEY}-${on ? "ahh" : "ah"})"/>`;
    s += `<text x="${f1(a.lx)}" y="${f1(a.ly)}" text-anchor="middle" class="nc-let${on ? " on" : ""}">${a.letter}</text>`;
  }
  for (const [id, n] of Object.entries(F.nodes)) {
    const bl = id === F.blank.X ? "X" : id === F.blank.Y ? "Y" : null, fill = bl && (hl.fill || []).includes(id), on = (hl.boxes || []).includes(id);
    s += `<rect x="${f1(n.x - BW / 2)}" y="${f1(n.y - BH / 2)}" width="${BW}" height="${BH}" rx="7" class="nc-box${on ? " on" : ""}"/>`;
    if (bl && !fill) s += `<text x="${f1(n.x)}" y="${f1(n.y + 9)}" text-anchor="middle" class="nc-blank">${bl}</text>`;
    else {
      const L = linesOf(F, id), y0 = n.y + 7 - (L.length - 1) * 11;
      L.forEach((t, i) => (s += `<text x="${f1(n.x)}" y="${f1(y0 + i * 22)}" text-anchor="middle" class="nc-t${fill ? " on" : ""}">${t}</text>`));
    }
  }
  if (opt.tap) for (const a of F.arrows) s += `<path d="M${a.band.map((p) => `${f1(p[0])} ${f1(p[1])}`).join("L")}Z" fill="transparent" data-tap="${a.id}"/>`;
  return `<svg viewBox="0 0 ${F.W} ${F.H}" class="figsvg fig-${KEY}" role="img" aria-label="A nutrient cycle in a marine ecosystem drawn as boxes joined by lettered arrows; two boxes, X and Y, are blank">${s}</svg>`;
}

/* ---------- questions ---------- */
// Q1 distractors: one energy option (the energy-cycles misconception) and one material that is not part of the cycle;
// short and long forms, so the key's length rank varies
const ENERGY_OPTS = ["heat", "sunlight", "light energy from the Sun", "heat released by respiration"];
const OTHER_OPTS = ["sand", "sand grains", "rock on the sea floor", "sand grains lying on the seabed"];
const TAPQ = {
  up: { q: "Tap the arrow that shows <b>producers taking up</b> nutrients from the water.",
    why: (F, A, nm) => `Arrow <b>${A.letter}</b> runs from ${nm("S")} to ${nm("P")}. Phytoplankton are the <b>producers</b>: they take up (absorb) dissolved nutrients such as nitrate from the water and use them to grow.` },
  eat: { q: "Tap the arrow that shows nutrients being <b>passed along a food chain</b>.",
    why: (F, A, nm) => `Arrow <b>${A.letter}</b> runs from ${nm("P")} to ${nm("C")}. When the producers are <b>eaten</b>, the nutrients in them pass to the consumers, so nutrients move up food chains by feeding.` },
  rel: { q: "Tap the arrow that shows <b>decomposers releasing</b> nutrients back into the water.",
    why: (F, A, nm) => `Arrow <b>${A.letter}</b> runs from ${nm("B")} to ${nm(F.layout === "A" ? "S" : "N")}. The bacteria are <b>decomposers</b>: they break down dead organisms and faeces and release the nutrients in them back into the water${F.layout === "B" ? ", here the deep water" : ""}.` },
  snow: { q: "Tap the arrow that shows <b>marine snow</b>.",
    why: (F, A, nm) => `Arrow <b>${A.letter}</b> runs from ${nm("D")} down to ${nm("B")}. Marine snow is dead organisms, faeces and other waste <b>sinking</b> through the water column towards the seabed, where bacteria break it down.` },
};
const DEC = [
  "Dead material would build up and producers would run short of nutrients",
  "More nutrients would stay dissolved in the water for the producers to use",
  "Little would change, because the producers would make new nutrients",
  "The producers would grow faster, because nothing would compete with them for nutrients",
];
const NITRO = [
  { q: "The nutrients dissolved in sea water include <b>nitrate</b>. Producers take it up and use the <b>nitrogen</b> in it. Which of these do they use the nitrogen to make?",
    o: ["proteins", "fats and oils", "starch", "calcium carbonate shells"],
    why: "Nitrogen is used to make <b>proteins</b>, which are needed for growth and repair. Fats, oils and starch are carbon compounds that contain no nitrogen, and shells are made using calcium. The protein then passes along the food chain when the producer is eaten." },
  { q: "Some nutrients supply organisms with essential elements. Which element do organisms need to make <b>proteins</b>?",
    o: ["nitrogen", "magnesium", "calcium", "iron"],
    why: "<b>Nitrogen</b> is used to make proteins; producers take it up as dissolved nitrate. The others have different roles: magnesium is used to make chlorophyll, calcium to make bones, shells and coral skeletons, and iron to make haemoglobin." },
];
const ORD = ["sinks through the water column as marine snow", "decomposed by bacteria near the seabed",
  "released into the deep water as dissolved nutrients", "carried up to the sunlit surface by upwelling", "taken up by phytoplankton"];
const UPW = [
  "They would decrease, because fewer nutrients would reach the surface",
  "They would increase, because upwelling carries nutrients down to the seabed",
  "They would increase, because upwelled water is too warm for them",
  "Little would change, because they need only light and carbon dioxide",
];
// [text, true?, explanation, tag, group]. A tagged statement is left out when an earlier question in the run already
// teaches it. At most one statement is kept from the energy / prod / eat / up groups (their statements contradict each
// other, so one would answer the other) and at most two from the reuse / lost groups (near-repeats).
const ST = [
  ["Energy flows through the ecosystem in one direction, but nutrients are recycled.", true, "energy is passed along food chains and some is lost at each level, so it does not go round; nutrients are released by decay and used again", "", "energy"],
  ["Energy is recycled through the ecosystem in the same way as nutrients.", false, "energy flows in one direction and is lost at each level; only nutrients are recycled", "", "energy"],
  ["Energy can be passed back from decomposers to producers, as nutrients are.", false, "decomposers return nutrients, not energy; producers get their energy from light", "", "energy"],
  ["A nitrogen atom in a dead fish can later become part of a phytoplankton cell.", true, "decay releases the nitrogen back into the water as dissolved nutrients, and producers take it up again", "", "reuse"],
  ["The same nutrients can be used again and again by different organisms.", true, "that is what a nutrient cycle means: nutrients are passed on, released by decay and taken up again", "", "reuse"],
  ["Nutrients are destroyed when organisms use them, so the supply in the sea runs out.", false, "nutrients are not destroyed; they are released again by decay and reused", "", "lost"],
  ["A nutrient atom is used by one organism and then lost from the ecosystem.", false, "the atom is passed on by feeding, or released by decay, and used again by other organisms", "", "lost"],
  ["Decomposer bacteria are producers, because they release nutrients into the water.", false, "producers make their own food by photosynthesis; decomposers get their energy by breaking down dead material", "", "prod"],
  ["Decomposer bacteria make their own food by photosynthesis.", false, "decomposers get their energy by breaking down dead organisms and waste; producers photosynthesise", "", "prod"],
  ["Phytoplankton are producers, because they make their own food by photosynthesis.", true, "producers make their own food using light energy; they take up dissolved nutrients to do it", "P", "prod"],
  ["Nutrients pass between living things and the water around them.", true, "they are taken up from the water by producers and released back into it by decay", "", "lost"],
  ["Nutrients can be passed from consumers back to producers by feeding.", false, "producers do not eat consumers; nutrients get back to producers through death, decay and release into the water", "", "reuse"],
  ["Consumers get their nutrients by eating other organisms.", true, "nutrients pass along food chains when organisms are eaten", "eat", "eat"],
  ["Consumers take up most of their nutrients directly from the sea water.", false, "consumers get their nutrients by eating other organisms; producers take nutrients from the water", "eat", "eat"],
];

function questions(F, r) {
  const qs = [], { X, Y } = F.blank, A = (id) => F.arrows.find((a) => a.id === id);
  const nm = (id) => (id === Y ? "box Y" : `the box “${labelOf(F, id)}”`);   // box Y is never named
  // 1. what goes in box X (options: both blanks + two energy distractors, so no option can be ruled out from the labels)
  const into = F.arrows.filter((a) => a.to === X).map((a) => a.from), out = F.arrows.filter((a) => a.from === X).map((a) => a.to);
  const nb = (ids) => ids.map(nm).join(" and ");
  const kl = labelOf(F, X), yl = labelOf(F, Y);
  const q1o = [kl, yl, ENERGY_OPTS[Math.floor(r() * 4)], OTHER_OPTS[Math.floor(r() * 4)]];
  if (Math.max(yl.length, q1o[2].length, q1o[3].length) <= kl.length) q1o[3] = OTHER_OPTS[3];   // the key is never the longest
  qs.push({ kind: "choice", q: "Two boxes, <b>X</b> and <b>Y</b>, have been left blank. What should be written in <b>box X</b>?",
    options: q1o, a: 0, hl: { fill: [X], boxes: [X] },
    why: `Box X receives nutrients from ${nb(into)} and passes them to ${nb(out)}, so it is <b>${labelOf(F, X)}</b> (${ROLE[X]}). ${
      { P: "Producers take up dissolved nutrients from the water, and the consumers get them by eating the producers.",
        C: "Consumers get their nutrients by eating the producers, and pass them on when they die or produce faeces.",
        D: "Both producers and consumers pass nutrients on when they die and in their faeces.",
        B: "Bacteria break down dead organisms and faeces and release the nutrients back into the water." }[X]
    } “${cap(q1o[2])}” is energy, not a nutrient, and energy does not go round a cycle; ${q1o[3].startsWith("rock") ? "rock" : "sand"} is not taken up or released by organisms, so neither is a box in a nutrient cycle.` });
  // 2. no decomposers (asked before the taps; highlights nothing)
  qs.push({ kind: "choice", q: "A pollutant kills the <b>decomposers</b> in this ecosystem. What would most likely happen to the nutrient cycle?",
    options: DEC.slice(), a: 0, hl: {},
    why: "Decomposers break down dead organisms and faeces and release the nutrients in them back into the water. Without them, <b>dead material would build up</b> and the nutrients locked inside it would not be returned, so <b>producers would run short of nutrients</b> and grow less. Producers cannot make new mineral nutrients, and with less released there would be fewer, not more, dissolved in the water." });
  // 3–4. two arrow taps
  // only arrows that do not touch box X: Q1's feedback names X, which would give away an arrow into or out of it
  const free = (ids) => ids.filter((id) => { const a = A(id); return a.from !== X && a.to !== X; });
  let taps;
  if (F.layout === "A") taps = shuffleR(r, free(["up", "eat", "rel"])).slice(0, 2);
  else { const f = free(["up", "eat", "rel"]); taps = free(["snow"]).length ? ["snow", shuffleR(r, f)[0]] : shuffleR(r, f).slice(0, 2); if (r() < 0.5) taps.reverse(); }
  for (const id of taps) {
    const a = A(id);
    qs.push({ kind: "tap", q: TAPQ[id].q, a: [id], ansTxt: `arrow ${a.letter}`, labelOf: (t) => `arrow ${A(t).letter}`, hint: "Tap one arrow on the diagram.",
      askOpt: { tap: true }, doneOpt: () => ({ tap: true, hl: { arrows: [id] } }), hl: { arrows: [id] }, why: TAPQ[id].why(F, a, nm) });
  }
  // 5. nitrogen → proteins
  const N = NITRO[r() < 0.5 ? 0 : 1];
  qs.push({ kind: "choice", q: N.q, options: N.o.slice(), a: 0, hl: {}, why: N.why });
  // 6. the deep-water route (A: not drawn, so the order is knowledge) / upwelling stops (B)
  if (F.layout === "A") {
    qs.push({ kind: "order", q: "In the open ocean, much dead material sinks before it decays. This route is <b>not shown</b> on the diagram. A fish dies near the surface. Put the stages in order to trace the nutrients in the dead fish back into a producer.",
      options: ORD.slice(), a: [0, 1, 2, 3, 4], hl: {},
      why: "The remains sink as <b>marine snow</b> → <b>bacteria</b> near the seabed decompose them → this <b>releases nutrients into the deep water</b> → <b>upwelling</b> brings the nutrient-rich deep water back to the sunlit surface → <b>phytoplankton take up</b> the nutrients. This is why deep water is often richer in nutrients than surface water." });
  } else {
    qs.push({ kind: "choice", q: "The winds change and <b>upwelling stops</b> in this area for several months. What would most likely happen to the phytoplankton in the surface water?",
      options: UPW.slice(), a: 0, hl: {},
      why: "Upwelling brings cold, nutrient-rich deep water up to the surface. If it stops, the nutrients released by decay stay in the deep water, so <b>fewer nutrients reach the surface</b> and the phytoplankton <b>decrease</b>. Upwelled water is cold, not warm, and producers need dissolved nutrients such as nitrate as well as light and carbon dioxide." });
  }
  // 7. tick the true statements (last, so its feedback gives nothing away)
  // taught earlier: the tapped arrows; Q1 when X is the producers or consumers. (Q5 says producers take up nitrate in
  // both forms, so no statement about producers' uptake is in the pool.)
  const taught = taps.concat({ P: ["eat", "P"], C: ["eat"] }[X] || [], taps.includes("up") ? ["P"] : []);
  const avail = ST.filter((x) => !x[3] || !taught.includes(x[3]));
  let pick = null;
  for (let k = 0; k < 40 && !pick; k++) {
    const grp = {}, pool = [];
    for (const x of shuffleR(r, avail)) { const cap = x[4] === "reuse" || x[4] === "lost" ? 2 : 1; if ((grp[x[4]] || 0) >= cap) continue; grp[x[4]] = (grp[x[4]] || 0) + 1; pool.push(x); }
    if (pool.length >= 4) pick = pickMixed(r, pool, Math.min(5, pool.length));
  }
  qs.push({ kind: "multi", q: "Tick <b>every</b> true statement about nutrient cycling in marine ecosystems.", options: pick.map((x) => x[0]), a: pick.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0), hl: {},
    why: pick.map((x) => `${x[1] ? "✓" : "✗"} ${x[0]} — ${x[2]}.`).join("<br>") });
  return qs;
}

/* ---------- self-test ---------- */
function boxesOverlap(a, b, pad) { return Math.abs(a.x - b.x) < BW + pad && Math.abs(a.y - b.y) < BH + pad; }
function segHitsBox(pts, n) {   // does the arrow pass through the box (shrunk by 1)?
  for (let i = 1; i < pts.length; i++) for (let k = 0; k <= 20; k++) { const t = k / 20, x = pts[i - 1].x + (pts[i].x - pts[i - 1].x) * t, y = pts[i - 1].y + (pts[i].y - pts[i - 1].y) * t; if (Math.abs(x - n.x) < BW / 2 - 1 && Math.abs(y - n.y) < BH / 2 - 1) return true; }
  return false;
}
function selfTest(F, qs) {
  const bad = [], ids = Object.keys(F.nodes);
  for (let i = 0; i < ids.length; i++) for (let j = i + 1; j < ids.length; j++) if (boxesOverlap(F.nodes[ids[i]], F.nodes[ids[j]], 10)) bad.push("boxes overlap " + ids[i] + ids[j]);
  for (const n of Object.values(F.nodes)) if (n.x - BW / 2 < 4 || n.x + BW / 2 > F.W - 4 || n.y - BH / 2 < 20 || n.y + BH / 2 > F.H - 8) bad.push("box outside");
  for (const a of F.arrows) {
    if (a.len < 30) bad.push("arrow too short " + a.id + " " + a.len.toFixed(0));
    for (const [id, n] of Object.entries(F.nodes)) {
      if (segHitsBox(a.pts, n)) bad.push(`arrow ${a.id} crosses box ${id}`);
      if (Math.abs(a.lx - n.x) < BW / 2 + 6 && Math.abs(a.ly - 5 - n.y) < BH / 2 + 8) bad.push(`letter ${a.id} on box ${id}`);
    }
    if (a.lx < 10 || a.lx > F.W - 10 || a.ly < 14 || a.ly > F.H - 4) bad.push("letter outside");
    for (const b of F.arrows) if (b !== a) {
      if (Math.hypot(a.lx - b.lx, a.ly - b.ly) < 26) bad.push("letters clash " + a.id + b.id);
      for (const e of [a.p0, a.p1]) for (const g of [b.p0, b.p1]) if (Math.hypot(e.x - g.x, e.y - g.y) < 24) bad.push("arrow ends crowd " + a.id + b.id);
    }
  }
  if (F.blank.X === F.blank.Y || !["P", "C", "D", "B"].includes(F.blank.X)) bad.push("blanks");
  // the arrows form one cycle through every box, plus the producer-death chord
  const ring = F.arrows.filter((a) => a.id !== "pdie");
  if (ring.length !== ids.length) bad.push("ring size");
  let cur = "S", seen = new Set();
  for (let k = 0; k < ring.length; k++) { const a = ring.find((x) => x.from === cur); if (!a) { bad.push("ring broken"); break; } seen.add(cur); cur = a.to; }
  if (cur !== "S" || seen.size !== ids.length) bad.push("not a cycle");
  // Y is never named after Q1; nothing after Q1 fills a blank
  const yl = labelOf(F, F.blank.Y);
  qs.slice(1).forEach((q) => { if ((q.why + q.q).includes(`box “${yl}”`)) bad.push("Y named in " + q.kind); if (q.hl && q.hl.fill) bad.push("later fill"); });
  if (qs.length !== 7) bad.push("question count");
  for (const q of qs) if (q.kind === "choice") {
    if (new Set(q.options).size !== q.options.length) bad.push("dup options");
    const L = q.options.map((x) => x.length); if (L[0] >= Math.max(...L.slice(1))) bad.push("key is longest: " + q.q.slice(0, 40));
  }
  for (const q of qs.filter((q) => q.kind === "tap")) { const sv = svg(F, q.askOpt); if ((sv.match(/data-tap=/g) || []).length !== F.arrows.length) bad.push("taps"); if (!F.arrows.some((a) => a.id === q.a[0])) bad.push("tap key"); }
  const taps = qs.filter((q) => q.kind === "tap").map((q) => q.a[0]);
  if (new Set(taps).size !== 2) bad.push("tap repeat");
  for (const id of taps) { const a = F.arrows.find((x) => x.id === id); if (a.from === F.blank.X || a.to === F.blank.X) bad.push("tap touches box X"); }
  const m = qs.find((q) => q.kind === "multi");
  const tags = m.options.map((t) => (ST.find((x) => x[0] === t) || [])[4]).filter(Boolean);
  const one = tags.filter((g) => !["reuse", "lost"].includes(g));
  if (new Set(one).size !== one.length || ["reuse", "lost"].some((g) => tags.filter((x) => x === g).length > 2)) bad.push("both halves of a pair");
  m.options.forEach((t, i) => { const st = ST.find((x) => x[0] === t); if (!st || st[1] !== m.a.includes(i)) bad.push("multi truth"); if (st && st[3] && (taps.includes(st[3]) || ({ P: ["up", "eat", "P"], C: ["eat"] })[F.blank.X]?.includes(st[3]) || (st[3] === "P" && taps.includes("up")))) bad.push("multi repeats a taught point"); });
  if (F.layout === "A" && !qs.some((q) => q.kind === "order")) bad.push("no order");
  // the asking figure shows no names for the blanks
  const ask = svg(F, {});
  for (const id of [F.blank.X, F.blank.Y]) for (const t of linesOf(F, id)) if (ask.includes(`class="nc-t">${t}<`) && !Object.keys(F.nodes).some((k) => k !== F.blank.X && k !== F.blank.Y && linesOf(F, k).includes(t))) bad.push("blank shows its label");
  return bad;
}

export default {
  key: KEY, group: "Diagrams", name: "Nutrient cycle", topics: "Unit 4 (4.1)", thumbSeed: 5,
  blurb: "A nutrient cycle drawn as boxes and lettered arrows: fill the blank boxes, find the arrows for uptake, feeding, decay and marine snow, and explain what keeps the cycle going.",
  tips: ["The arrows show the direction the nutrients move.", "Producers (phytoplankton) take up dissolved nutrients such as nitrate. The nutrients pass to consumers when the producers are eaten.", "When organisms die, and in their faeces, the nutrients pass to dead material. Decomposer bacteria break it down and release the nutrients back into the water.", "In the open ocean dead material sinks as marine snow. It decays in deep water, and upwelling brings the nutrients back to the surface.", "Nutrients cycle; energy does not. Energy flows along food chains and is lost at each level."],
  ctx: (F) => (F.layout === "A" ? "a nutrient cycle in a marine ecosystem" : "a nutrient cycle in the open ocean, with surface and deep water"),
  make, svg, questions, selfTest,
  css: `.fig-nutcycle text{font-size:19px}.fig-nutcycle .nc-box{fill:var(--surface);stroke:currentColor;stroke-width:1.6}.fig-nutcycle .nc-box.on{stroke:var(--app);stroke-width:3}
.fig-nutcycle .nc-t.on{fill:var(--app);font-weight:700}.fig-nutcycle .nc-blank{font-size:26px;font-weight:800}
.fig-nutcycle .nc-arr{fill:none;stroke:currentColor;stroke-width:2}.fig-nutcycle .nc-arr.on{stroke:var(--app);stroke-width:3.4}.fig-nutcycle .nc-ah{fill:currentColor}.fig-nutcycle .nc-ahh{fill:var(--app)}
.fig-nutcycle .nc-let{font-size:19px;font-weight:800;paint-order:stroke;stroke:var(--surface);stroke-width:4px;stroke-linejoin:round}.fig-nutcycle .nc-let.on{fill:var(--app)}
.fig-nutcycle .nc-sea{stroke:currentColor;stroke-width:1.3;stroke-dasharray:7 5;opacity:.75}.fig-nutcycle .nc-zone{font-size:16px;font-style:italic;opacity:.9}`,
};
