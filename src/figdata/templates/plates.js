/* ---------- EARTH STRUCTURE AND PLATE BOUNDARIES (0697 1.1/LO3–4 structure of the Earth, iron core; 1.2/LO1–2 plates on
   the mantle, convection; 1.2/LO4 convergent / divergent / transform boundaries; 1.2/LO5 earthquakes and volcanoes) ----------
   Two figure modes, chosen by the seed:
   (a) "earth" — a cross-section through the Earth (a full circle, or a half section with the flat face down or up), four
       concentric layers (inner core, outer core, mantle, crust; the crust drawn thicker than it really is, said on the
       figure) carrying letters A–D (shuffled) on horizontal label lines that go out to the left or the right. Layer radii
       and label heights vary. Questions: tap a layer from a property (liquid; solid iron; what the plates float on; made up
       of tectonic plates); name a lettered layer; what a lettered layer is made of (solid/liquid, iron/rock — the w24 table
       form); then tap every layer made of rock (after a core layer) or of iron (after the crust; iron core → magnetic
       field), so the multi-tap never answers the made-of item; tick the true statements.
   (b) "bounds" — three block diagrams (front face = cross-section of plate and upper mantle, top face = the plates seen
       obliquely) of a convergent, a divergent and a transform boundary in a shuffled order, panel letters A–C / P–R / X–Z.
       Arrows on the top faces show plate motion. Half the seeds show the features (rising magma in a gap; a plate forced
       down under the other with a trench, a volcano and rising magma; a fault line); the other half show arrows only, so
       the type must be worked out from the motion. The subducting side and the transform sense vary. No boundary name is
       ever drawn. Questions: name the type in a panel; tap a panel (by type name, or where volcanoes form from a melting
       subducted plate); tap every panel where earthquakes happen (all three — never keyed "only at X"); what happens to the
       subducted plate; what moves the plates; order the earthquake or the volcano chain; tick the true statements about one
       panel.
   KM1: never require thicknesses/temperatures/depths, lithosphere, nickel, plate names, sub-types, hotspots, magnitudes.
   s24: "plates float on magma" is credited — it is never offered as a wrong statement; "mantle" is the model answer.
   No-leak rule: within a run, every identification question has a different target, and explanations only give facts
   about their own target, so an earlier explanation never states the answer to a later question. */
import { rng, shuffleR, pickMixed, pickR } from "../core.js";

const KEY = "plates";
const W = 560;
const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
const f1 = (v) => (Math.round(v * 10) / 10).toFixed(1);

/* ================= mode (a): the Earth's layers ================= */
const LAY = ["inner", "outer", "mantle", "crust"];
const LNAME = { inner: "inner core", outer: "outer core", mantle: "mantle", crust: "crust" };
const MAT = { inner: "solid iron", outer: "liquid iron", mantle: "solid rock", crust: "solid rock" };

function makeEarth(seed, r0) {
  const shape = r0() < 0.5 ? "full" : r0() < 0.5 ? "up" : "down", mirror = r0() < 0.5;
  const R = shape === "full" ? 182 : 225;
  for (let tries = 0; tries < 5000; tries++) {
    const r = rng(seed + 31 + tries * 7919);
    const ri = R * (0.2 + 0.05 * r()), ro = R * (0.5 + 0.07 * r()), rc = R * (0.065 + 0.025 * r()), rm = R - rc;
    const band = { inner: [0, ri], outer: [ri, ro], mantle: [ro, rm], crust: [rm, R] };
    const cx0 = 257, cy = shape === "full" ? 26 + R : shape === "up" ? 30 + R : 30;
    const col = cx0 + R + 36;
    // angle range for label points (towards the label side; in the drawn half for half sections)
    const [a0, a1] = shape === "full" ? [-58, 58] : shape === "up" ? [10, 74] : [-74, -10];
    const pt = {};
    for (const k of LAY) {
      const [b0, b1] = band[k], rr = k === "inner" ? ri * 0.55 : (b0 + b1) / 2;
      const a = (a0 + (a1 - a0) * r()) * Math.PI / 180;
      pt[k] = { u: rr * Math.cos(a), y: cy - rr * Math.sin(a), rr };
    }
    const ys = LAY.map((k) => pt[k].y).sort((a, b) => a - b);
    if (ys.some((y, i) => i && y - ys[i - 1] < 31)) continue;
    // label points stay clear of the layer boundaries, and of the flat face in a half section
    if (LAY.some((k) => Math.abs(pt[k].y - cy) < (shape === "full" ? 0 : 15))) continue;
    const letters = shuffleR(r, ["A", "B", "C", "D"]), letter = {};
    LAY.forEach((k, i) => (letter[k] = letters[i]));
    const VH = shape === "full" ? cy + R + 40 : shape === "up" ? cy + 40 : cy + R + 40;
    return { kind: KEY, mode: "earth", seed, shape, mirror, R, ri, ro, rm, rc, band, cx0, cy, col, pt, letter, VH };
  }
  throw new Error("plates: no earth layout");
}

const EX = (F, x) => (F.mirror ? W - x : x);
/** a disc / ring (r0 = 0 → disc) as a path: full circle, or the upper / lower half */
function ringPath(F, r0, r1) {
  const cx = EX(F, F.cx0), cy = F.cy, n = (v) => v.toFixed(1);
  if (F.shape === "full") {
    let d = `M${n(cx + r1)} ${n(cy)}A${n(r1)} ${n(r1)} 0 1 0 ${n(cx - r1)} ${n(cy)}A${n(r1)} ${n(r1)} 0 1 0 ${n(cx + r1)} ${n(cy)}Z`;
    if (r0 > 0) d += `M${n(cx + r0)} ${n(cy)}A${n(r0)} ${n(r0)} 0 1 0 ${n(cx - r0)} ${n(cy)}A${n(r0)} ${n(r0)} 0 1 0 ${n(cx + r0)} ${n(cy)}Z`;
    return d;
  }
  const s = F.shape === "up" ? 1 : 0;
  if (r0 <= 0) return `M${n(cx - r1)} ${n(cy)}A${n(r1)} ${n(r1)} 0 0 ${s} ${n(cx + r1)} ${n(cy)}Z`;
  return `M${n(cx - r1)} ${n(cy)}A${n(r1)} ${n(r1)} 0 0 ${s} ${n(cx + r1)} ${n(cy)}L${n(cx + r0)} ${n(cy)}A${n(r0)} ${n(r0)} 0 0 ${1 - s} ${n(cx - r0)} ${n(cy)}Z`;
}
/** tap bands: the thin crust gets a band that reaches 8 units into the mantle and 20 beyond the surface (≥ 38 units) */
function tapBand(F, k) {
  if (k === "inner") return [0, F.ri];
  if (k === "outer") return [F.ri, F.ro];
  if (k === "mantle") return [F.ro, F.rm - 8];
  return [F.rm - 8, F.R + 20];
}

function svgEarth(F, opt) {
  const hl = opt.hl || {}, on = (k) => (hl.L || []).includes(k);
  let s = `<defs>
<pattern id="${KEY}-dot" width="7" height="7" patternUnits="userSpaceOnUse"><circle cx="3.5" cy="3.5" r="1.1" class="pl-pat"/></pattern>
<pattern id="${KEY}-diag" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><line x1="0" y1="0" x2="0" y2="7" class="pl-patl"/></pattern>
<pattern id="${KEY}-spk" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="1" class="pl-pat"/><circle cx="12" cy="11" r="1" class="pl-pat"/></pattern></defs>`;
  const layer = (k, cls, pat) => { const [a, b] = F.band[k], d = ringPath(F, a, b); return `<path d="${d}" fill-rule="evenodd" class="${cls}"/>` + (pat ? `<path d="${d}" fill-rule="evenodd" fill="url(#${KEY}-${pat})"/>` : ""); };
  s += layer("crust", "pl-crust") + layer("mantle", "pl-mantle", "spk") + layer("outer", "pl-outer", "diag") + layer("inner", "pl-inner", "dot");
  for (const k of LAY) if (on(k)) s += `<path d="${ringPath(F, F.band[k][0], F.band[k][1])}" fill-rule="evenodd" class="pl-hl"/>`;
  // layer outlines
  for (const rr of [F.ri, F.ro, F.rm, F.R]) s += `<path d="${ringPath(F, 0, rr)}" class="pl-edge"/>`;
  // label lines and letters
  for (const k of LAY) {
    const p = F.pt[k], x = EX(F, F.cx0 + p.u), xe = EX(F, F.col - 13), xl = EX(F, F.col), o = on(k) ? " on" : "";
    s += `<line x1="${x.toFixed(1)}" y1="${p.y.toFixed(1)}" x2="${xe.toFixed(1)}" y2="${p.y.toFixed(1)}" class="pl-lead${o}"/><circle cx="${x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="2.8" class="pl-dot${o}"/>`;
    s += `<text x="${xl.toFixed(1)}" y="${(p.y + 9).toFixed(1)}" text-anchor="middle" class="pl-let${o}">${F.letter[k]}</text>`;
  }
  const ny = F.shape === "up" ? F.cy + 26 : F.cy + F.R + 26;
  s += `<text x="${W / 2}" y="${ny.toFixed(1)}" text-anchor="middle" class="pl-note">Not to scale: the crust is drawn far too thick.</text>`;
  if (opt.tapMode) for (const k of LAY) { const [a, b] = tapBand(F, k); s += `<path d="${ringPath(F, a, b)}" fill-rule="evenodd" fill="transparent" data-tap="${k}"/>`; }
  return `<svg viewBox="0 0 ${W} ${F.VH.toFixed(0)}" class="figsvg fig-${KEY}" role="img" aria-label="A cross-section through the Earth showing four layers labelled with letters">${s}</svg>`;
}

/* earth explanations. No-leak rule: each explanation states facts about its own target only, and every fact it states is
   tagged (F1 inner solid · F2 inner iron · F3 outer liquid · F4 outer iron · F5 mantle rock · F6 mantle melts to magma ·
   F7 plates float on / are moved by the mantle · F8 crust solid rock · F9 crust made of plates · F10 crust thinnest ·
   F11 iron core → magnetic field). The closing statements item only uses statements whose facts no earlier item told. */
const TAPQ = {
  outer: ["Tap the layer that is <b>liquid</b>.", "The <b>outer core</b> is the liquid layer. Do not pick the mantle: it is solid, although it can melt to form a viscous liquid called magma.", ["F3", "F6"]],
  mantle: ["Tap the layer that the tectonic plates <b>float on</b>.", "The tectonic plates float on the <b>mantle</b>, and convection currents in the mantle move them.", ["F7"]],
  crust: ["Tap the layer that is made up of <b>tectonic plates</b>.", "The <b>crust</b> is made up of a number of large pieces called tectonic plates. It is not one continuous shell.", ["F9"]],
};
const POS = { inner: "the layer at the very centre of the Earth", outer: "the layer around the inner core", mantle: "the thick layer between the outer core and the crust", crust: "the outermost layer of the Earth" };
const MATWHY = {
  inner: ["The inner core is made of <b>solid iron</b>.", ["F1", "F2"]],
  outer: ["The outer core is made of <b>liquid iron</b>. Do not confuse it with magma: magma is melted rock.", ["F3", "F4"]],
  crust: ["The crust is made of <b>solid rock</b>.", ["F8"]],
};

function questionsEarth(F, r) {
  const qs = [], Lt = F.letter, labelOf = (id) => `layer ${Lt[id]}`, told = new Set();
  // three different targets: T3 what it is made of (core or crust), T1 tap by property (never the inner core: its only
  // property stem, "solid iron", would give away part of the iron item), T2 name the letter
  const T3 = pickR(r, ["inner", "outer", "crust"]);
  const T1 = pickR(r, ["outer", "mantle", "crust"].filter((k) => k !== T3)), T2 = pickR(r, LAY.filter((k) => k !== T3 && k !== T1));
  const tapQ = { kind: "tap", q: TAPQ[T1][0], a: [T1], ansTxt: `layer ${Lt[T1]}, the ${LNAME[T1]}`, labelOf, hint: "Tap one layer on the cross-section.",
    askOpt: { tapMode: true }, doneOpt: () => ({ tapMode: true }), why: `${TAPQ[T1][1]} On this diagram it is layer <b>${Lt[T1]}</b>.`, told: TAPQ[T1][2] };
  const nameOpts = [T2, ...shuffleR(r, LAY.filter((k) => k !== T2))];
  const nameQ = { kind: "choice", q: `Name the layer labelled <b>${Lt[T2]}</b>.`, options: nameOpts.map((k) => LNAME[k]), a: 0, hl: { L: [T2] },
    why: `<b>${Lt[T2]}</b> is the <b>${LNAME[T2]}</b>, ${POS[T2]}.`, told: [] };
  if (r() < 0.5) qs.push(tapQ, nameQ); else qs.push(nameQ, tapQ);

  // what the lettered layer is made of (the w24 table form: state + material)
  const mo = ["solid iron", "liquid iron", "solid rock", "liquid rock"];
  qs.push({ kind: "choice", q: `What is layer <b>${Lt[T3]}</b> made of?`, options: [MAT[T3], ...shuffleR(r, mo.filter((m) => m !== MAT[T3]))], a: 0, hl: { L: [T3] },
    why: `Layer ${Lt[T3]} is the ${LNAME[T3]}. ${MATWHY[T3][0]}`, told: MATWHY[T3][1] });

  // then a multi-tap on material that the item above does not answer: rock (mantle + crust) after a core layer,
  // iron (inner + outer core, 1.1/LO3a, LO4) after the crust. Neither explanation says anything about solid or liquid.
  if (T3 === "crust") qs.push({ kind: "tap", multi: true, q: "Tap <b>every</b> layer that is made of iron.", a: ["inner", "outer"], ansTxt: `layers ${[Lt.inner, Lt.outer].sort().join(" and ")} (the inner core and the outer core)`, labelOf,
    hint: "Tap every layer that applies, then press Check.", askOpt: { tapMode: true }, doneOpt: () => ({ tapMode: true }),
    why: `The whole core is made of iron: both the <b>inner core</b> (${Lt.inner}) and the <b>outer core</b> (${Lt.outer}). This iron core creates a magnetic field around the Earth.`, told: ["F2", "F4", "F11"] });
  else qs.push({ kind: "tap", multi: true, q: "Tap <b>every</b> layer that is made of rock.", a: ["mantle", "crust"], ansTxt: `layers ${[Lt.mantle, Lt.crust].sort().join(" and ")} (the mantle and the crust)`, labelOf,
    hint: "Tap every layer that applies, then press Check.", askOpt: { tapMode: true }, doneOpt: () => ({ tapMode: true }),
    why: `Both the <b>mantle</b> (${Lt.mantle}) and the <b>crust</b> (${Lt.crust}) are made of rock. The core, inside them, is made of iron.`, told: ["F2", "F4", "F5", "F8"] });
  for (const q of qs) for (const f of q.told) told.add(f);

  // tick the true statements: one per idea, only from facts not yet told
  const G = [
    [[`Layer ${Lt.inner} is solid.`, true, `${Lt.inner} is the inner core, which is solid iron.`, ["F1"]], [`Layer ${Lt.inner} is liquid.`, false, `${Lt.inner} is the inner core: it is solid. Only the outer core is liquid.`, ["F1"]]],
    [[`Layer ${Lt.outer} is liquid.`, true, `${Lt.outer} is the outer core, which is liquid iron.`, ["F3"]], [`Layer ${Lt.outer} is solid.`, false, `${Lt.outer} is the outer core: it is liquid iron.`, ["F3"]]],
    [[`Layer ${Lt.crust} is made up of tectonic plates.`, true, `${Lt.crust} is the crust, which is made up of a number of tectonic plates.`, ["F9"]], [`Layer ${Lt.outer} is made up of tectonic plates.`, false, `${Lt.outer} is the outer core. It is the crust (${Lt.crust}) that is made up of tectonic plates.`, ["F9"]]],
    [[`The tectonic plates float on layer ${Lt.mantle}.`, true, `${Lt.mantle} is the mantle. The plates float on the mantle and are moved by convection currents in it.`, ["F7"]], [`Convection currents in layer ${Lt.mantle} move the tectonic plates.`, true, `${Lt.mantle} is the mantle. Convection currents in the mantle move the plates, which float on it.`, ["F7"]],
      [`The tectonic plates float on layer ${Lt.outer}.`, false, `${Lt.outer} is the outer core. The plates float on the mantle (${Lt.mantle}), not on the liquid outer core.`, ["F7"]], [`Convection currents in layer ${Lt.inner} move the tectonic plates.`, false, `${Lt.inner} is the inner core. The convection currents that move the plates are in the mantle (${Lt.mantle}).`, ["F7"]]],
    [[`Layer ${Lt.crust} is the thinnest layer.`, true, `${Lt.crust} is the crust, the thin outer layer of solid rock.`, ["F10"]], [`Layer ${Lt.mantle} is the thinnest layer.`, false, `${Lt.mantle} is the mantle, a thick layer. The thinnest layer is the crust (${Lt.crust}).`, ["F10"]]],
    [[`The Earth's magnetic field is created by layers ${[Lt.inner, Lt.outer].sort().join(" and ")}.`, true, `${[Lt.inner, Lt.outer].sort().join(" and ")} are the inner and outer core: the iron core creates the magnetic field.`, ["F11"]], [`The Earth's magnetic field is created by layers ${[Lt.mantle, Lt.crust].sort().join(" and ")}.`, false, `${[Lt.mantle, Lt.crust].sort().join(" and ")} are the mantle and the crust, which are rock. The magnetic field is created by the iron core (${[Lt.inner, Lt.outer].sort().join(" and ")}).`, ["F11"]]],
    [[`Layer ${Lt.crust} is made of solid rock.`, true, `${Lt.crust} is the crust, which is solid rock.`, ["F8"]], [`Layer ${Lt.crust} is liquid.`, false, `${Lt.crust} is the crust, which is solid rock.`, ["F8"]]],
  ].map((g) => g.filter((v) => !v[3].some((f) => told.has(f)))).filter((g) => g.length);
  const choice = G.map((g) => Math.floor(r() * g.length));
  let uniq = G.map((g, k) => g[choice[k]]);
  if (!uniq.some((x) => !x[1])) { const k = G.findIndex((g) => g.some((v) => !v[1])); uniq[k] = G[k].find((v) => !v[1]); }
  if (!uniq.some((x) => x[1])) { const k = G.findIndex((g) => g.some((v) => v[1])); uniq[k] = G[k].find((v) => v[1]); }
  const pick = pickMixed(r, uniq, Math.min(5, uniq.length));
  qs.push({ kind: "multi", q: "Tick <b>every</b> statement that is true.", options: pick.map((x) => x[0]), a: pick.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0),
    why: pick.map((x) => `${x[1] ? "✓" : "✗"} ${x[0]}: ${x[2]}`).join("<br>"), told: [], facts: pick.map((x) => x[3]).flat(), toldBefore: [...told] });
  return qs;
}

/* ================= mode (b): plate boundaries ================= */
const BT = ["conv", "div", "trans"];
const BNAME = { conv: "convergent", div: "divergent", trans: "transform" };
const MOTION = { conv: "moving towards each other", div: "moving apart", trans: "sliding past each other" };
const X0 = 78, X1 = 438, XM = 258, YT = 50, YP = 74, YB = 124, OX = 64, OY = -40, PH = 138, PTOP = 6;
const LETSETS = [["A", "B", "C"], ["P", "Q", "R"], ["X", "Y", "Z"]];

function makeBounds(seed, r0) {
  const r = rng(seed ^ 0x2b0d5);
  const order = shuffleR(r, BT), letters = pickR(r, LETSETS), detail = r() < 0.5 ? "features" : "arrows";
  const subRight = r() < 0.5, transSense = r() < 0.5 ? 1 : -1;
  const letter = {}; order.forEach((t, i) => (letter[t] = letters[i]));
  const jit = order.map(() => Math.round((r() * 2 - 1) * 10));
  return { kind: KEY, mode: "bounds", seed, order, letters, letter, detail, subRight, transSense, jit, VH: PTOP + 3 * PH + 34 };
}

const n1 = (v) => v.toFixed(1);
const poly = (pts, cls) => `<polygon points="${pts.map((p) => `${n1(p[0])},${n1(p[1])}`).join(" ")}" class="${cls}"/>`;
function arrow(x1, y1, x2, y2, cls = "pl-arr") {
  const dx = x2 - x1, dy = y2 - y1, L = Math.hypot(dx, dy), ux = dx / L, uy = dy / L, h = 11, w = 6.5;
  const bx = x2 - ux * h, by = y2 - uy * h;
  return `<line x1="${n1(x1)}" y1="${n1(y1)}" x2="${n1(bx)}" y2="${n1(by)}" class="${cls}"/>` +
    `<polygon points="${n1(x2)},${n1(y2)} ${n1(bx - uy * w)},${n1(by + ux * w)} ${n1(bx + uy * w)},${n1(by - ux * w)}" class="${cls}h"/>`;
}

function panelSvg(F, t, k, on) {
  const T = PTOP + k * PH, Y = (y) => T + y, feat = F.detail === "features", j = F.jit[k];
  let s = "";
  const mir = t === "conv" && F.subRight, fx = (x) => (mir ? 2 * XM - x : x);
  // right side face (mantle and plate) and the top faces
  s += poly([[X1, Y(YP)], [X1 + OX, Y(YP + OY)], [X1 + OX, Y(YB + OY)], [X1, Y(YB)]], "pl-mantle pl-side");
  s += poly([[X1, Y(YP)], [X1 + OX, Y(YP + OY)], [X1 + OX, Y(YB + OY)], [X1, Y(YB)]], "pl-spk");
  s += poly([[X1, Y(YT)], [X1 + OX, Y(YT + OY)], [X1 + OX, Y(YP + OY)], [X1, Y(YP)]], "pl-crust pl-side");
  const gap = t === "div" && feat ? 6 : 0;
  s += poly([[X0, Y(YT)], [XM - gap, Y(YT)], [XM - gap + OX, Y(YT + OY)], [X0 + OX, Y(YT + OY)]], "pl-top");
  s += poly([[XM + gap, Y(YT)], [X1, Y(YT)], [X1 + OX, Y(YT + OY)], [XM + gap + OX, Y(YT + OY)]], "pl-top");
  // front face: mantle
  s += `<rect x="${X0}" y="${Y(YP)}" width="${X1 - X0}" height="${YB - YP}" class="pl-mantle"/><rect x="${X0}" y="${Y(YP)}" width="${X1 - X0}" height="${YB - YP}" fill="url(#${KEY}-spk)"/>`;
  // front face: plates
  if (t === "conv" && feat) {
    const xs = (y) => XM + (y - (YT + 7)) / (YB - YT - 7) * 56;            // top of the sinking plate
    const slab = [[X0, YT], [XM - 13, YT], [XM, YT + 7], [XM + 56, YB], [XM + 30, YB], [XM - 15, YP], [X0, YP]];
    const over = [[XM - 1, YT], [X1, YT], [X1, YP], [xs(YP), YP], [XM, YT + 7]];
    const m = (pts) => pts.map(([x, y]) => [fx(x), Y(y)]);            // XM is the middle of the front face, so fx maps X0 ↔ X1
    s += poly(m(slab), "pl-crust") + poly(m(over), "pl-crust");
    // melting where the sinking plate is deep in the mantle; magma rises to a volcano on the overriding plate
    const xv = XM + 92, mx = xs(YB - 16) + 2;
    s += `<ellipse cx="${n1(fx(mx))}" cy="${n1(Y(YB - 17))}" rx="7" ry="5" class="pl-magma"/>`;
    s += `<path d="M${n1(fx(mx))} ${n1(Y(YB - 21))}C${n1(fx(mx + 6))} ${n1(Y(YB - 40))} ${n1(fx(xv - 4))} ${n1(Y(YP + 6))} ${n1(fx(xv))} ${n1(Y(YT - 4))}" class="pl-mpath"/>`;
    s += poly([[fx(xv - 25), Y(YT)], [fx(xv - 6), Y(YT - 20)], [fx(xv + 6), Y(YT - 20)], [fx(xv + 25), Y(YT)]], "pl-volc");
    s += arrow(fx(xv + 14), Y(YP + 14), fx(xv + 14), Y(YP - 6), "pl-marr");
  } else {
    s += `<rect x="${X0}" y="${Y(YT)}" width="${XM - gap - X0}" height="${YP - YT}" class="pl-crust"/><rect x="${XM + gap}" y="${Y(YT)}" width="${X1 - XM - gap}" height="${YP - YT}" class="pl-crust"/>`;
    if (t === "div" && feat) {
      s += poly([[XM - 6, Y(YT)], [XM + 6, Y(YT)], [XM + 16, Y(YB)], [XM - 16, Y(YB)]], "pl-magma");
      s += poly([[XM - 6, Y(YT)], [XM + 6, Y(YT)], [XM + 6 + OX, Y(YT + OY)], [XM - 6 + OX, Y(YT + OY)]], "pl-magma");
      s += arrow(XM, Y(YB - 4), XM, Y(YT + 4), "pl-marr");
    } else {
      s += `<line x1="${XM}" y1="${Y(YT)}" x2="${XM}" y2="${Y(YP)}" class="${t === "trans" && feat ? "pl-fault" : "pl-bnd"}"/>`;
    }
  }
  // boundary on the top face
  if (!(t === "div" && feat)) {
    if (t === "trans" && feat) { let d = `M${XM} ${Y(YT)}`; for (let i = 1; i <= 6; i++) { const f = i / 6; d += `L${n1(XM + OX * f + (i % 2 ? 3 : -3) * (i < 6 ? 1 : 0))} ${n1(Y(YT + OY * f))}`; } s += `<path d="${d}" class="pl-fault"/>`; }
    else s += `<line x1="${XM}" y1="${Y(YT)}" x2="${XM + OX}" y2="${Y(YT + OY)}" class="pl-bnd"/>`;
  }
  // outline of the block
  s += `<path d="M${X0} ${Y(YT)}L${X0 + OX} ${Y(YT + OY)}L${X1 + OX} ${Y(YT + OY)}L${X1 + OX} ${Y(YB + OY)}L${X1} ${Y(YB)}L${X0} ${Y(YB)}Z M${X1} ${Y(YT)}L${X1 + OX} ${Y(YT + OY)} M${X0} ${Y(YT)}H${X1}V${Y(YB)} M${X0} ${Y(YP)}H${X1}L${X1 + OX} ${Y(YP + OY)}" class="pl-out"/>`;
  // motion arrows on the top faces
  const ay = Y(YT + OY * 0.72), ax = (x) => x + OX * 0.72;
  if (t === "trans") {
    const ux = OX / Math.hypot(OX, OY), uy = OY / Math.hypot(OX, OY), cyA = Y(YT + OY / 2), half = 27, sg = F.transSense;
    for (const [cx0, d] of [[XM - 46 + j / 2, sg], [XM + 46 + j / 2, -sg]]) { const cx = cx0 + OX / 2; s += arrow(cx - d * ux * half, cyA - d * uy * half, cx + d * ux * half, cyA + d * uy * half); }
  } else {
    const L = 52, cl = ax((X0 + XM) / 2) + j, cr = ax((XM + X1) / 2) + j, dir = t === "div" ? -1 : 1;
    s += arrow(cl - dir * L / 2, ay, cl + dir * L / 2, ay) + arrow(cr + dir * L / 2, ay, cr - dir * L / 2, ay);
  }
  s += `<text x="${X1 - 48}" y="${Y(YB - 14)}" text-anchor="middle" class="pl-word pl-halo">mantle</text>`;
  // panel letter
  s += `<text x="34" y="${Y(YT + 26)}" text-anchor="middle" class="pl-plet${on ? " on" : ""}">${F.letter[t]}</text>`;
  if (on) s += `<rect x="12" y="${T + 2}" width="${W - 24}" height="${PH - 6}" rx="8" class="pl-phl"/>`;
  if (k < 2) s += `<line x1="12" x2="${W - 12}" y1="${T + PH - 1}" y2="${T + PH - 1}" class="pl-sep"/>`;
  return s;
}

function svgBounds(F, opt) {
  const hl = opt.hl || {};
  let s = `<defs><pattern id="${KEY}-spk" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="4" cy="4" r="1" class="pl-pat"/><circle cx="12" cy="11" r="1" class="pl-pat"/></pattern></defs>`;
  F.order.forEach((t, k) => (s += panelSvg(F, t, k, (hl.p || []).includes(t))));
  const ny = PTOP + 3 * PH + 20;
  s += `<text x="${W / 2}" y="${ny}" text-anchor="middle" class="pl-note">Arrows show the direction each plate is moving. Not to scale.</text>`;
  if (opt.tapMode) F.order.forEach((t, k) => (s += `<rect x="12" y="${PTOP + k * PH + 2}" width="${W - 24}" height="${PH - 6}" rx="8" fill="transparent" data-tap="${t}"/>`));
  return `<svg viewBox="0 0 ${W} ${F.VH}" class="figsvg fig-${KEY}" role="img" aria-label="Three block diagrams of plate boundaries, lettered, with arrows showing how the plates move">${s}</svg>`;
}

const QUAKE = ["Two plates are moving, but they become stuck (locked) together.", "Pressure builds up in the rocks as the plates keep trying to move.", "The plates suddenly slip.", "A large amount of energy is released, causing an earthquake."];
const VOLC = ["The plates move towards each other.", "One plate is forced beneath the other, down into the mantle.", "The sinking plate melts, forming magma.", "The magma rises through the plate above.", "The magma erupts at the surface, forming a volcano."];

function questionsBounds(F, r) {
  const qs = [], Lt = F.letter, labelOf = (id) => `panel ${Lt[id]}`, feat = F.detail === "features";
  const tapBase = { kind: "tap", labelOf, hint: "Tap one panel.", askOpt: { tapMode: true }, doneOpt: () => ({ tapMode: true }) };
  const motionWhy = (t) => `the arrows show the two plates ${MOTION[t]}`;
  // feature notes say nothing about melting, so they never give away the subducted-plate item or the volcano chain
  const featWhy = { conv: "one plate is forced down beneath the other", div: "magma rises into the gap between the plates", trans: "no gap opens and no plate is forced down" };
  const contrast = { div: "Divergent does not mean colliding: the plates move away from each other.", trans: "Sliding past each other is not the same as moving apart: at a transform boundary the plates move sideways, in opposite directions, along the boundary.", conv: "Convergent means the plates come together." };

  // targets: T1 named (never convergent: it is the longest name), T2 tapped, P (the third panel) for the closing statements
  const T1 = pickR(r, BT), byName = feat || T1 === "conv", T2 = byName ? pickR(r, BT.filter((t) => t !== T1)) : "conv", P = BT.find((t) => t !== T1 && t !== T2);
  const fate = feat && P !== "conv" && r() < 0.5, quake = !feat || P === "conv" || fate || r() < 0.5, conv = r() < 0.5;

  // 1. name the type. A fourth option is another exam name for a different type (constructive = divergent,
  // conservative = transform; never the target's own synonym), so "convergent" is never the longest option.
  const syn = T1 === "trans" ? ["constructive", "divergent"] : T1 === "div" ? ["conservative", "transform"] : pickR(r, [["constructive", "divergent"], ["conservative", "transform"]]);
  // sometimes a divergent panel is keyed by its mark-scheme synonym "constructive" (then "divergent" is not offered),
  // so the -ive names are not always wrong
  const asCon = T1 === "div" && r() < 0.3, key = asCon ? "constructive" : BNAME[T1];
  qs.push({ kind: "choice", q: `Name the type of plate boundary shown in panel <b>${Lt[T1]}</b>.`, options: [key, ...shuffleR(r, BT.filter((t) => t !== T1).map((t) => BNAME[t]).concat(syn[0]))], a: 0, hl: { p: [T1] },
    why: `Panel ${Lt[T1]} is a <b>${BNAME[T1]}</b>${asCon ? " (constructive)" : ""} boundary: ${motionWhy(T1)}${feat ? `; ${featWhy[T1]}` : ""}. ${contrast[T1]} ("${cap(asCon ? "constructive" : syn[0])}" ${asCon ? "is the other exam name for a divergent boundary; \"conservative\" means transform" : `is another name for a ${syn[1]} boundary`}.)` });

  // 2. tap a panel
  if (!byName) qs.push(Object.assign({}, tapBase, { q: "Volcanoes form where one plate is forced down into the mantle and melts. Tap the panel where this would happen.", a: ["conv"], ansTxt: `panel ${Lt.conv}`,
    why: `This happens at a <b>convergent</b> boundary, panel <b>${Lt.conv}</b>: the arrows show the plates moving towards each other, so one plate is forced beneath the other.` }));
  else qs.push(Object.assign({}, tapBase, { q: `Tap the panel that shows a <b>${BNAME[T2]}</b> boundary.`, a: [T2], ansTxt: `panel ${Lt[T2]}`,
    why: `At a ${BNAME[T2]} boundary the plates are ${MOTION[T2]}. In panel <b>${Lt[T2]}</b> ${motionWhy(T2)}; ${featWhy[T2]}. ${contrast[T2]}` }));

  // 3. order a chain (1.2/LO5) — before the earthquake item, whose explanation runs the earthquake chain
  const seq = quake ? QUAKE : VOLC, ord = shuffleR(r, seq.map((_, i) => i));
  qs.push({ kind: "order", q: quake ? "Put these steps in order to explain how an earthquake happens at a plate boundary." : "Put these steps in order to explain how volcanoes form where plates move towards each other.",
    options: ord.map((i) => seq[i]), a: seq.map((_, i) => ord.indexOf(i)),
    why: quake ? "The plates are <b>locked</b> together → <b>pressure builds up</b> as they keep trying to move → they suddenly <b>slip</b> → a large amount of <b>energy is released</b> as an earthquake (at sea, the sudden movement of the seabed can displace water and start a tsunami)."
      : "Plates <b>move towards each other</b> → one is <b>forced beneath</b> the other into the mantle (subduction) → the sinking plate <b>melts</b>, forming magma → the magma <b>rises</b> through the plate above → it <b>erupts</b> as a volcano." });

  // 4. earthquakes: every boundary (never keyed "only at X")
  const all = F.order.map((t) => Lt[t]);
  qs.push(Object.assign({}, tapBase, { multi: true, q: "Tap <b>every</b> panel showing a boundary where earthquakes can happen.", a: F.order.slice(), ansTxt: `all three panels (${all.slice(0, 2).join(", ")} and ${all[2]})`, hint: "Tap every panel that applies, then press Check.",
    why: "Earthquakes happen at <b>all three</b> types of plate boundary: convergent, divergent and transform. Wherever plates move against each other they can become stuck; pressure builds up until the plates suddenly slip, releasing a large amount of energy as an earthquake." }));

  // 5. what happens to the subducted plate (features, once the convergent panel has been identified)
  if (fate) {
    const o = ["It sinks into the hot mantle and melts, forming magma.", "Friction with the other plate melts it, forming magma.", "It is pushed up over the other plate into a mountain chain.", "It stays solid and slides along the top of the mantle."];
    qs.push({ kind: "choice", q: "Look at the panel where one plate is forced down beneath the other. What happens to that plate as it goes down?", options: o, a: 0, hl: { p: ["conv"] },
      why: `In panel ${Lt.conv} (a convergent boundary) the sinking plate goes down into the hot mantle and <b>melts</b>, forming magma; the magma rises through the plate above and erupts as a volcano. It is the heat of the mantle that melts it, not friction between the plates.` });
  }

  // 6. what moves the plates (1.2/LO2)
  if (conv) {
    const o = ["convection currents in the hot rock of the mantle", "the pull of the Moon's gravity on the crust", "ocean currents dragging the seabed along", "earthquakes deep in the mantle pushing the plates apart"];
    qs.push({ kind: "choice", q: "The tectonic plates in these diagrams are slowly moving. What causes this movement?", options: o, a: 0,
      why: "The plates float on the mantle and are moved by <b>convection currents in the mantle</b>: hot mantle rock rises, cooler rock sinks, and this very slow circulation carries the plates. The Moon causes tides, not plate movement; earthquakes are a result of plate movement, not its cause." });
  }

  // 7. tick the true statements about the third panel (its type is never named here, and nothing below was told earlier)
  const Lp = Lt[P], mv = { div: ["moving apart", "moving towards each other"], conv: ["moving towards each other", "moving apart"], trans: ["sliding past each other", "moving apart"] }[P];
  const G = [
    [[`The plates are ${mv[0]}.`, true, `The arrows show the plates ${mv[0]}, so this is a ${BNAME[P]} boundary.`], [`The plates are ${mv[1]}.`, false, `The arrows show the plates ${mv[0]}, not ${mv[1]}: this is a ${BNAME[P]} boundary.`]],
    [[`The two plates are moving in opposite directions.`, true, `The arrows point in opposite directions: the plates are ${mv[0]}.`], [`Both plates are moving in the same direction.`, false, `The arrows point in opposite directions: the plates are ${mv[0]}.`]],
    [[`These plates are pieces of the Earth's crust.`, true, "The crust is made up of a number of tectonic plates."], [`These plates are pieces of the mantle.`, false, "The plates are pieces of the crust; they float on the mantle."]],
    P === "div" ? [[`Magma rises into a gap between the plates.`, true, "As the plates move apart, magma from the mantle rises into the gap."]]
      : P === "conv" ? [[`Magma forms where the sinking plate melts.`, true, "The plate that is forced down sinks into the hot mantle and melts, forming magma."], [`Magma rises into a gap between the plates.`, false, "Here the plates move towards each other, so no gap opens; the magma comes from the sinking plate as it melts."]]
        : [[`Magma rises into a gap between the plates.`, false, "At a transform boundary the plates slide past each other: no gap opens for magma to fill."]],
  ];
  if (P === "conv") G.push([[`One plate is being forced beneath the other.`, true, "At a convergent boundary one plate is forced beneath the other (subducted) into the mantle."]]);
  if (!conv) G.push([[`These plates float on the mantle.`, true, "Tectonic plates float on the mantle."]],
    [[`The plates are moved by convection currents in the mantle.`, true, "Convection currents in the mantle move the plates."], [`The plates are moved by the tides.`, false, "Tides are caused by the Moon and do not move the plates: convection currents in the mantle do."]]);
  const choice = G.map((g) => Math.floor(r() * g.length));
  const uniq = G.map((g, k) => g[choice[k]]);
  if (!uniq.some((x) => x[1])) uniq[0] = G[0][0];
  if (!uniq.some((x) => !x[1])) { const k = G.findIndex((g) => g.some((v) => !v[1])); if (k >= 0) uniq[k] = G[k].find((v) => !v[1]); }
  const pick = pickMixed(r, uniq, Math.min(5, uniq.length));
  qs.push({ kind: "multi", q: `Look at panel <b>${Lp}</b>. Tick <b>every</b> statement about this boundary that is true.`, options: pick.map((x) => x[0]), a: pick.map((x, i) => (x[1] ? i : -1)).filter((i) => i >= 0), hl: { p: [P] },
    why: pick.map((x) => `${x[1] ? "✓" : "✗"} ${x[0]}: ${x[2]}`).join("<br>") });
  return qs;
}

/* ================= template ================= */
function make(seed) {
  const r0 = rng(seed ^ 0x7a1e5);
  return r0() < 0.5 ? makeEarth(seed, r0) : makeBounds(seed, r0);
}
function svg(F, opt) { opt = opt || {}; return F.mode === "earth" ? svgEarth(F, opt) : svgBounds(F, opt); }
function questions(F, r) { return F.mode === "earth" ? questionsEarth(F, r) : questionsBounds(F, r); }

function selfTest(F, qs) {
  const bad = [];
  for (const q of qs.filter((q) => q.kind === "choice")) if (!q.options.some((x, i) => i !== q.a && x.length >= q.options[q.a].length)) bad.push("answer is longest: " + q.options[q.a]);
  for (const q of qs) if (/\b(always|never|only|all|none)\b/i.test((q.options || []).join(" ")) && q.kind === "multi") bad.push("absolute word in statements");
  if (F.mode === "earth") {
    const ys = LAY.map((k) => F.pt[k].y).sort((a, b) => a - b); if (ys.some((y, i) => i && y - ys[i - 1] < 31)) bad.push("labels too close");
    for (const k of LAY) { const [a, b] = F.band[k], rr = F.pt[k].rr; if (!(rr > a + 2 && rr < b - 2)) bad.push("label point outside its layer " + k); const [t0, t1] = tapBand(F, k); if (k !== "inner" && t1 - t0 < (k === "crust" ? 36 : 22)) bad.push("tap band thin " + k); if (k === "inner" && 2 * t1 < 22) bad.push("inner tap"); }
    if (F.shape !== "full") for (const k of LAY) if ((F.shape === "up") !== (F.pt[k].y < F.cy)) bad.push("label point outside the half section");
    if (!(F.rc < F.ri && F.rc < F.ro - F.ri && F.rc < F.rm - F.ro)) bad.push("crust not thinnest");
    const tg = qs.filter((q) => q.kind === "tap" && !q.multi).map((q) => q.a[0]).concat(qs.filter((q) => q.kind === "choice").map((q) => q.hl.L[0]));
    if (new Set(tg).size !== tg.length || tg.length !== 3) bad.push("repeated layer target");
    const mq = qs.find((q) => q.kind === "multi"); if (mq.facts.some((f) => mq.toldBefore.includes(f))) bad.push("statement already told");
    if (mq.options.length < 4) bad.push("too few statements");
    const it = qs.find((q) => q.multi), mt = qs.find((q) => /made of\?/.test(q.q)), T3 = mt.hl.L[0];
    if (!it || it.a.join() !== (T3 === "crust" ? "inner,outer" : "mantle,crust")) bad.push("material tap item");
    if (qs.indexOf(mt) > qs.indexOf(it)) bad.push("made-of item after the material tap");
    const m = qs.find((q) => q.kind === "multi"); const inv = Object.fromEntries(LAY.map((k) => [F.letter[k], k]));
    m.options.forEach((t, i) => { const tr = m.a.includes(i), L0 = (t.match(/[Ll]ayer ([A-D])/) || [])[1], k = inv[L0];
      if (/is solid\.$/.test(t) && tr !== (k === "inner")) bad.push("solid statement");
      if (/is liquid\.$/.test(t) && tr !== (k === "outer")) bad.push("liquid statement");
      if (/float on|Convection currents/.test(t) && tr !== (k === "mantle")) bad.push("float statement");
      if (/magma/i.test(t) && /float/.test(t) && !tr) bad.push("float on magma marked wrong"); });
  } else {
    const tp = qs.filter((q) => q.kind === "tap");
    const eq = tp.find((q) => q.multi); if (!eq || eq.a.length !== 3) bad.push("earthquakes not keyed to every boundary");
    const nm = qs[0];
    const t2 = tp.find((q) => !q.multi); if (t2.a[0] === nm.hl.p[0]) bad.push("repeated panel target");
    if (F.detail === "arrows" && nm.hl.p[0] !== "conv" && t2.a[0] !== "conv") bad.push("volcano tap");
    { const own = { div: "constructive", trans: "conservative", conv: "destructive" }[nm.hl.p[0]], i = nm.options.indexOf(own);
      if (i >= 0 && (i !== nm.a || nm.options.includes(BNAME[nm.hl.p[0]]))) bad.push("own synonym offered as a distractor or with its plain name"); }
    const o = qs.find((q) => q.kind === "order"); if (o.a.some((k, n) => o.options[k] !== (o.options.length === 4 ? QUAKE : VOLC)[n])) bad.push("order key");
    const m = qs.find((q) => q.kind === "multi"), P = m.hl.p[0];
    if (P === nm.hl.p[0] || P === t2.a[0]) bad.push("statements on an identified panel");
    if (m.options.length < 4) bad.push("too few statements");
    if (m.options.some((t) => /^This is a|Earthquakes/.test(t))) bad.push("told statement");
    const fq = qs.find((q) => /forced down beneath the other\. What happens/.test(q.q)); if (fq && (o.options.length === 5 || (t2.a[0] !== "conv" && nm.hl.p[0] !== "conv"))) bad.push("fate item leaks");
    m.options.forEach((t, i) => { const tr = m.a.includes(i);
      if (/^The plates are (moving|sliding)/.test(t) && tr !== t.includes(MOTION[P])) bad.push("motion statement");
      if (/^This is a/.test(t) && tr !== t.includes(BNAME[P])) bad.push("name statement");
      if (/forced beneath/.test(t) && tr !== (P === "conv")) bad.push("subduction statement");
      if (/Earthquakes/.test(t) && !tr) bad.push("earthquake statement"); });
    if (new Set(Object.values(F.letter)).size !== 3) bad.push("letters");
  }
  return bad;
}

export default {
  key: KEY, group: "Diagrams", name: "Earth's layers and plate boundaries", topics: "Unit 1 (1.1, 1.2)", thumbSeed: 3,
  blurb: "A generated cross-section of the Earth or a set of plate-boundary block diagrams: identify the layers and what they are made of, and the convergent, divergent and transform boundaries from how the plates move.",
  tips: [
    "From the centre out: <b>inner core</b> (solid iron) → <b>outer core</b> (liquid iron) → <b>mantle</b> (solid rock, which can melt to form magma) → <b>crust</b> (thin, solid rock).",
    "The iron core creates the Earth's magnetic field.",
    "The crust is made up of <b>tectonic plates</b>. They float on the mantle and are moved by <b>convection currents</b> in the mantle.",
    "<b>Convergent</b>: plates move towards each other, and one may be forced beneath the other, melt and feed a volcano. <b>Divergent</b>: plates move apart and magma rises into the gap. <b>Transform</b>: plates slide past each other.",
    "Earthquakes happen at all three types of boundary: stuck plates build up pressure and then suddenly slip, releasing energy.",
    "Read the arrows first: they tell you how the plates are moving, and that tells you the type of boundary.",
  ],
  ctx: (F) => (F.mode === "earth" ? "a cross-section through the Earth, showing its layers" : "three block diagrams of plate boundaries; arrows show how the plates move"),
  make, svg, questions, selfTest,
  css: `.fig-plates .pl-pat{fill:var(--ink);opacity:.45}.fig-plates .pl-patl{stroke:var(--ink);stroke-width:.8;opacity:.35}
.fig-plates .pl-inner{fill:color-mix(in srgb,var(--ink) 30%,var(--surface))}.fig-plates .pl-outer{fill:color-mix(in srgb,var(--ink) 14%,var(--surface))}
.fig-plates .pl-mantle{fill:var(--surface2)}.fig-plates .pl-crust{fill:color-mix(in srgb,var(--ink) 52%,var(--surface));stroke:currentColor;stroke-width:1.2;stroke-linejoin:round}
.fig-plates .pl-spk{fill:url(#plates-spk)}.fig-plates .pl-side{filter:brightness(.92)}
.fig-plates .pl-top{fill:color-mix(in srgb,var(--ink) 28%,var(--surface));stroke:currentColor;stroke-width:1.1;stroke-linejoin:round}
.fig-plates .pl-edge{fill:none;stroke:currentColor;stroke-width:1.6}
.fig-plates .pl-lead{stroke:currentColor;stroke-width:1.4}.fig-plates .pl-dot{fill:currentColor}.fig-plates .pl-let,.fig-plates .pl-plet{font-size:26px;font-weight:800;fill:currentColor}
.fig-plates .pl-lead.on{stroke:var(--app);stroke-width:2.4}.fig-plates .pl-dot.on,.fig-plates .pl-let.on,.fig-plates .pl-plet.on{fill:var(--app)}
.fig-plates .pl-hl{fill:color-mix(in srgb,var(--app) 38%,transparent);stroke:var(--app);stroke-width:2.5}
.fig-plates .pl-phl{fill:color-mix(in srgb,var(--app) 14%,transparent);stroke:var(--app);stroke-width:2.5}
.fig-plates .pl-note{font-size:17px;fill:currentColor;opacity:.9}.fig-plates .pl-word{font-size:17px;font-weight:700;fill:currentColor}
.fig-plates .pl-halo{paint-order:stroke;stroke:var(--surface2);stroke-width:4px;stroke-linejoin:round}
.fig-plates .pl-out{fill:none;stroke:currentColor;stroke-width:1.5;stroke-linejoin:round}.fig-plates .pl-bnd{stroke:currentColor;stroke-width:1.8}
.fig-plates .pl-fault{fill:none;stroke:currentColor;stroke-width:2.6;stroke-linejoin:round}
.fig-plates .pl-sep{stroke:var(--line);stroke-width:1}
.fig-plates .pl-arr{stroke:currentColor;stroke-width:3.4;stroke-linecap:round}.fig-plates .pl-arrh{fill:currentColor}
.fig-plates .pl-magma{fill:var(--surface);stroke:currentColor;stroke-width:1.4;stroke-dasharray:3 2}
.fig-plates .pl-mpath{fill:none;stroke:currentColor;stroke-width:3;stroke-dasharray:5 3}
.fig-plates .pl-marr{stroke:currentColor;stroke-width:2}.fig-plates .pl-marrh{fill:currentColor}
.fig-plates .pl-volc{fill:color-mix(in srgb,var(--ink) 40%,var(--surface));stroke:currentColor;stroke-width:1.4;stroke-linejoin:round}`,
};
