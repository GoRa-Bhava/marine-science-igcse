/* ---------- FISHING METHODS FROM A DIAGRAM (0697 6.3/LO2) ----------
   Four schematic side views (panels A–D) of fishing methods from the 6.3/LO2 guidance list: cast net; pelagic trawl;
   beam trawl; purse seine; gill net and drift net (tangle nets); basket trap; trolling; longline; pole and line.
   Exam-style monochrome line art, drawn from seeded geometry (boat size, positions, depths, mirror, variants), with NO
   text on the drawings, so a method can only be named from the shape of its gear.
   Gill net and drift net are never shown together (a drift net is a drifting gill net), and neither is a distractor
   for the other. KM6 forbidden: otter boards, snoods, named bans, hook counts — none is drawn, named or asked.
   Questions: name the method in a panel (×2); tap the panel matching a description; tap a part of the gear (drawstring,
   floats, weighted line, hooks, main line, beam); tap the panel matching an impact; tick the true statements about one
   panel's method (impacts and KM6 misconceptions); compare two methods (pole and line vs longline, beam vs pelagic). */
import { rng, pickR, shuffleR, pickMixed } from "../core.js";

const KEY = "fishgear";
const PW = 268, PH = 200, W = 560, H = 486;
const POS = [[8, 28], [284, 28], [8, 258], [284, 258]];
const LET = "ABCD";
const METHODS = ["purse", "pelagic", "beam", "gill", "drift", "longline", "pole", "troll", "cast", "trap"];
const NAME = { purse: "purse seine", pelagic: "pelagic trawl", beam: "beam trawl", gill: "gill net", drift: "drift net", longline: "longline", pole: "pole and line", troll: "trolling", cast: "cast net", trap: "basket trap" };
const NAMEA = { purse: "a purse seine", pelagic: "a pelagic (mid-water) trawl", beam: "a beam trawl", gill: "a gill net", drift: "a drift net", longline: "a longline", pole: "pole-and-line fishing", troll: "trolling", cast: "a cast net", trap: "a basket trap" };
const SIB = { gill: "drift", drift: "gill" };
const CONF = { purse: ["drift", "gill", "pelagic", "cast"], pelagic: ["beam", "purse", "drift", "longline"], beam: ["pelagic", "gill", "trap"], gill: ["purse", "longline", "beam", "trap"], drift: ["purse", "longline", "pelagic"], longline: ["drift", "troll", "pole", "gill"], pole: ["troll", "longline", "cast"], troll: ["pole", "longline", "pelagic"], cast: ["purse", "trap", "pole"], trap: ["cast", "gill", "beam"] };
// what the drawing shows (used in the explanations) — must match the drawings below
const CLUE = {
  purse: "a wall of net hangs from a ring of floats around the shoal, and its bottom is drawn together by a line running back to the boat",
  pelagic: "a cone-shaped net is towed behind a moving boat in mid-water, well clear of the seabed",
  beam: "the mouth of the net is held open by a rigid beam on runners, and the net is dragged along the seabed behind a moving boat, stirring up sediment",
  gill: "a wall of net stands on the seabed, held up by floats along its top and held down by weights and anchors, with buoys marking its ends",
  drift: "a wall of net hangs down from a line of floats at the surface, joined to the boat and well clear of the seabed, so it drifts with the current",
  longline: "one long main line carries many short lines, each ending in a baited hook",
  pole: "fishers on the boat catch fish on rods, and live bait is thrown into the water to keep the shoal close",
  troll: "a few lines with lures are pulled behind a moving boat, some from long poles held out from the boat",
  cast: "one person throws a round net with weights around its edge over fish in shallow water",
  trap: "a basket with a funnel-shaped entrance sits on the seabed, joined by a rope to a buoy at the surface",
};
const DESC = {
  purse: "a net that is set in a circle around a shoal and then closed underneath",
  pelagic: "a cone-shaped net towed through mid-water, clear of the seabed",
  beam: "a net held open by a rigid beam and dragged along the seabed",
  gill: "a wall of net anchored to the seabed, which catches fish by their gills",
  drift: "a wall of net hanging from floats at the surface and drifting with the current",
  longline: "a long main line carrying very many baited hooks",
  pole: "fish caught on rods by fishers on the boat, with live bait thrown in to keep the shoal close",
  troll: "a few lines with lures pulled behind a moving boat",
  cast: "a round, weighted net thrown by hand over fish in shallow water",
  trap: "a baited trap left on the seabed for animals to crawl or swim into",
};
// statements for the tick-true question: { t: text, T: methods it is true for, F: methods it is clearly false for,
// g: group (at most one statement per group in a question, so parallel true/false versions never appear together),
// x: left out when that comparison question is asked (it would give the comparison away), w: explanation }
const ST = [
  { t: "It is dragged along the seabed, damaging seabed habitats.", T: ["beam"], F: ["pelagic", "purse", "drift", "pole", "troll", "cast"], g: "depth", x: "bp", w: "a beam trawl is dragged over the seabed, crushing and burying seabed animals and destroying their habitat" },
  { t: "The net is towed through mid-water and does not touch the seabed.", T: ["pelagic"], F: ["beam"], g: "depth", x: "bp", w: "a pelagic trawl is towed in mid-water, clear of the seabed; a beam trawl is dragged along it" },
  { t: "The net floats at the surface, so the seabed is not touched.", T: [], F: ["beam", "pelagic"], g: "depth", x: "bp", w: "trawls do not float at the surface: a pelagic trawl is towed in mid-water and a beam trawl along the seabed" },
  { t: "It catches almost everything in its path, including young fish.", T: ["beam"], F: ["pole", "troll", "longline", "trap"], w: "a beam trawl is not selective: it catches almost everything in its path" },
  { t: "Fish are caught one at a time, so there is very little bycatch.", T: ["pole", "troll"], F: ["purse", "pelagic", "beam", "gill", "drift"], x: "pl", w: "rod and line methods take one fish at a time, so little is caught by mistake" },
  { t: "Its bycatch is low mainly because each fish is landed on its own.", T: ["pole"], F: [], g: "polewhy", x: "pl", w: "the bycatch is low because fish are landed one at a time, so little is caught by mistake" },
  { t: "Its bycatch is low mainly because the rods are made of wood.", T: [], F: ["pole"], g: "polewhy", x: "pl", w: "the bycatch is low because fish are caught one at a time, not because of what the rods are made of" },
  { t: "Dolphins following the shoal can be caught along with the fish.", T: ["purse", "pelagic"], F: ["pole", "trap", "cast"], w: "nets that take a whole shoal also take the dolphins and other predators that follow it" },
  { t: "Seabirds and turtles take the bait and are caught on the hooks.", T: ["longline"], F: ["purse", "pelagic", "beam", "gill", "drift", "cast", "trap"], w: "the baited hooks of a longline also attract and hook seabirds, turtles and sharks" },
  { t: "Dolphins, turtles and sharks can become tangled in the mesh.", T: ["gill", "drift"], F: ["pole", "troll", "longline", "trap"], w: "a wall of mesh entangles animals that swim into it, not only the target fish" },
  { t: "Lost nets from this method keep catching animals for years as ghost nets.", T: ["gill", "drift"], F: [], g: "ghost", w: "lost gill and drift nets keep catching animals for years as ghost nets" },
  { t: "Lost nets from this method soon stop catching, because nylon breaks down quickly.", T: [], F: ["gill", "drift"], g: "ghost", w: "nylon does not break down quickly, so lost nets keep catching for years as ghost nets" },
  { t: "A whole shoal can be caught at once, which can lead to overfishing.", T: ["purse", "pelagic"], F: ["pole", "troll", "cast", "trap"], w: "taking a whole shoal at once gives very large catches and can lead to overfishing" },
  { t: "Very many baited hooks are set at once, so huge numbers of fish can be caught.", T: ["longline"], F: ["pole", "troll", "cast", "trap", "purse", "pelagic", "beam", "gill", "drift"], w: "a longline carries very many baited hooks, so very large numbers of fish can be caught" },
  { t: "Unwanted animals that are caught can usually be released alive.", T: ["cast", "trap", "pole"], F: ["beam", "gill", "drift"], w: "the catch is small and seen at once, so unwanted animals can be let go alive" },
  { t: "The catch is limited by how fast the crew can work.", T: ["pole"], F: ["purse", "pelagic", "beam", "longline", "drift", "gill"], w: "each fisher lands fish by hand, so the catch is limited by effort" },
  { t: "It is left on the seabed, and animals go in to reach the bait.", T: ["trap"], F: ["purse", "pelagic", "drift", "pole", "troll", "cast"], w: "a basket trap is baited and left on the seabed for animals to enter" },
  { t: "Its impact is low, as long as not too many are used and none are put on reefs.", T: ["trap"], F: ["beam", "gill", "drift"], w: "basket traps have a low impact unless too many are used or they are placed on reefs; beam trawls, gill nets and drift nets have a high impact wherever they are used" },
  { t: "A few lines with lures are pulled behind a moving boat.", T: ["troll"], F: ["pole", "longline", "purse", "pelagic", "beam", "gill", "drift", "cast", "trap"], w: "trolling pulls a few lines with lures behind a moving boat" },
  { t: "It is small-scale, catching only the fish under the net where it lands.", T: ["cast"], F: ["purse", "pelagic", "beam", "drift"], w: "a cast net is small-scale: it catches only the fish under it" },
  { t: "The bottom of the net is drawn closed, so the shoal cannot escape downwards.", T: ["purse"], F: ["drift", "gill"], w: "the line along the bottom of a purse seine is pulled to close the net like a purse" },
  { t: "The net is anchored to the seabed and left in place.", T: ["gill"], F: ["drift", "purse", "pelagic"], g: "anch", w: "a gill net is anchored to the seabed and left in place" },
  { t: "The net drifts freely with the current near the surface.", T: ["drift"], F: ["gill"], g: "anch", w: "a drift net hangs from floats at the surface and drifts with the current" },
];
// the comparison question asked for this set of methods, if any
const cmpOf = (ms) => (ms.includes("pole") && ms.includes("longline") ? "pl" : ms.includes("beam") && ms.includes("pelagic") ? "bp" : null);
const LOWBY = ["pole", "troll", "cast", "trap"];
const IMPACTS = [
  { id: "seabed", has: (ms) => ms.includes("beam"), ans: () => "beam", q: "Tap the panel showing the method that does the <b>most damage to seabed habitats</b>.",
    why: "it is dragged along the seabed, crushing and burying seabed animals, stirring up sediment and catching almost everything in its path. None of the other methods shown drags its gear over the seabed." },
  { id: "birds", has: (ms) => ms.includes("longline"), ans: () => "longline", q: "Tap the panel showing the method in which <b>seabirds and turtles</b> are most often caught on baited hooks.",
    why: "its very many baited hooks attract seabirds (as the line is set) and turtles and sharks (in the water), which are hooked as bycatch." },
  { id: "ghost", has: (ms) => ms.includes("gill") || ms.includes("drift"), ans: (ms) => (ms.includes("gill") ? "gill" : "drift"), q: "Tap the panel showing the method whose lost nets are most likely to become <b>ghost nets</b>, which go on catching animals.",
    why: "a wall of nylon mesh that breaks free keeps entangling fish, turtles and dolphins for years. Nylon does not break down quickly, so a lost net does not stop catching." },
  { id: "dolphin", has: (ms) => ms.includes("purse") && !ms.includes("pelagic"), ans: () => "purse", q: "Tap the panel showing the method in which <b>dolphins swimming with a shoal of tuna</b> can be trapped when the net is closed.",
    why: "the net encircles the whole shoal and is then closed underneath, so dolphins and turtles swimming with the shoal are trapped with it." },
  { id: "select", has: (ms) => ms.filter((m) => LOWBY.includes(m)).length === 1, ans: (ms) => ms.find((m) => LOWBY.includes(m)), q: "Tap the panel showing the <b>most selective</b> method, the one with the least bycatch.",
    why: "it catches only a few target animals at a time, and anything unwanted can be released. The other methods shown take large catches with nets or very many hooks, so they catch many non-target animals." },
];
// part questions: [part id, stem, name of the part, explanation]
const PARTQ = {
  purse: [["draw", "tap the line that is pulled tight to close the bottom of the net", "the drawstring (purse line)", "The <b>drawstring (purse line)</b> runs through rings along the bottom of the net. Pulling it in closes the bottom like a purse, so the shoal cannot escape downwards."],
    ["floats", "tap the floats that hold the top edge of the net at the surface", "the floats", "The <b>floats</b> form a ring at the surface. They hold up the top edge of the net while the rest hangs down around the shoal."]],
  drift: [["floats", "tap the floats that hold the top of the net at the surface", "the floats", "The <b>floats</b> along the top hold the net at the surface, so it hangs down like a curtain and drifts with the current."],
    ["weights", "tap the weighted line that keeps the bottom of the net hanging down", "the weighted line", "The <b>weighted line</b> along the bottom pulls the net down, so it hangs as a vertical wall that fish swim into."]],
  longline: [["hooks", "tap the baited hooks", "the baited hooks", "The <b>hooks</b> hang from short lines along the main line. Each carries bait; target fish, and also seabirds, turtles and sharks, take the bait."],
    ["main", "tap the main line that carries all the hooks", "the main line", "The <b>main line</b> is the long line that the many short lines with hooks hang from."]],
  beam: [["beam", "tap the rigid beam that holds the mouth of the net open", "the beam", "The <b>beam</b> is a rigid bar on runners. It holds the mouth of the net open as the net is dragged along the seabed."]],
};
const PARTNAME = { boat: "the boat", net: "the net", floats: "the floats", draw: "the drawstring", weights: "the weighted line", hooks: "the hooks", main: "the main line", beam: "the beam", warp: "the towing line", anchors: "the anchors", buoys: "the buoys" };

/* ---------- drawing helpers (panel-local coordinates, 0..PW × 0..PH) ---------- */
const n1 = (v) => Math.round(v * 10) / 10;
const pth = (pts, close) => "M" + pts.map(([x, y]) => `${n1(x)} ${n1(y)}`).join("L") + (close ? "Z" : "");
// a closed polygon with positive orientation, so subpaths of one tap/highlight shape never cancel
const poly = (pts) => { let a = 0; for (let i = 0; i < pts.length; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % pts.length]; a += x1 * y2 - x2 * y1; } return pth(a < 0 ? pts.slice().reverse() : pts, true); };
const circP = (cx, cy, r) => poly(Array.from({ length: 14 }, (_, i) => [cx + r * Math.cos((i * Math.PI) / 7), cy + r * Math.sin((i * Math.PI) / 7)]));
const rectP = (x0, y0, x1, y1) => poly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]]);
function band(x1, y1, x2, y2, w) {
  const L = Math.hypot(x2 - x1, y2 - y1) || 1, ux = (x2 - x1) / L, uy = (y2 - y1) / L, nx = (-uy * w) / 2, ny = (ux * w) / 2, ex = (ux * w) / 3, ey = (uy * w) / 3;
  return poly([[x1 - nx - ex, y1 - ny - ey], [x2 - nx + ex, y2 - ny + ey], [x2 + nx + ex, y2 + ny + ey], [x1 + nx - ex, y1 + ny - ey]]);
}
const ln = (x1, y1, x2, y2, c = "fg-ln") => `<line x1="${n1(x1)}" y1="${n1(y1)}" x2="${n1(x2)}" y2="${n1(y2)}" class="${c}"/>`;
const fish = (x, y, s0, dir = 1) => { const s = s0 * 1.2, X = (d) => n1(x + d * s * dir); return `<path d="M${X(7)} ${n1(y)}Q${X(1)} ${n1(y - 3.6 * s)} ${X(-5)} ${n1(y)}Q${X(1)} ${n1(y + 3.6 * s)} ${X(7)} ${n1(y)}ZM${X(-4.5)} ${n1(y)}L${X(-8.5)} ${n1(y - 3.2 * s)}L${X(-8.5)} ${n1(y + 3.2 * s)}Z" class="fg-fill"/>`; };
function shoal(r, cx, cy, rx, ry, n, s = 1, dir = 1) {
  const pts = [];
  for (let t = 0; t < 400 && pts.length < n; t++) { const a = r() * 6.283, d = Math.sqrt(r()), p = [cx + rx * d * Math.cos(a), cy + ry * d * Math.sin(a)]; if (pts.every((q) => Math.abs(q[0] - p[0]) > 18 * s || Math.abs(q[1] - p[1]) > 9 * s)) pts.push(p); }
  return pts.map(([x, y]) => fish(x, y, s, dir)).join("");
}
const surf = (S) => { let d = `M0 ${n1(S)}`; for (let x = 0; x < PW; x += 12) d += `Q${x + 6} ${n1(S - 2.4)} ${x + 12} ${n1(S)}`; return `<path d="${d}" class="fg-surf"/>`; };
function seabed(r, B, x0 = 0, extra = null) {
  const pts = []; for (let x = x0; x <= PW + 0.1; x += 22) pts.push([Math.min(x, PW), B + (r() * 2 - 1) * 1.8]);
  if (pts[pts.length - 1][0] < PW) pts.push([PW, B]);
  const top = extra ? extra.concat(pts) : pts, area = pth(top.concat([[PW, PH], [extra ? 0 : x0, PH]]), true);
  return `<path d="${area}" class="fg-bg"/><path d="${area}" fill="url(#fishgear-bed)" stroke="none"/><path d="${pth(top)}" class="fg-bedl"/>`;
}
function boat(x, S, k, type) {
  let s, st, box, bow;
  if (type === "big") {
    s = `<path d="${pth([[x - 34 * k, S - 9 * k], [x + 26 * k, S - 9 * k], [x + 36 * k, S - 15 * k], [x + 27 * k, S + 5 * k], [x - 29 * k, S + 5 * k]], true)}" class="fg-hull"/>`;
    s += `<rect x="${n1(x - 6 * k)}" y="${n1(S - 23 * k)}" width="${n1(20 * k)}" height="${n1(14 * k)}" class="fg-cab"/><rect x="${n1(x + 5 * k)}" y="${n1(S - 20 * k)}" width="${n1(6 * k)}" height="${n1(4 * k)}" class="fg-fill"/>`;
    s += ln(x + 2 * k, S - 23 * k, x + 2 * k, S - 34 * k) + ln(x - 30 * k, S - 9 * k, x - 24 * k, S - 27 * k);
    st = [x - 33 * k, S - 9 * k]; bow = x + 36 * k; box = [x - 36 * k, S - 35 * k, x + 38 * k, S + 7 * k];
  } else if (type === "mid") {
    s = `<path d="${pth([[x - 28 * k, S - 8 * k], [x + 22 * k, S - 8 * k], [x + 30 * k, S - 13 * k], [x + 22 * k, S + 4 * k], [x - 24 * k, S + 4 * k]], true)}" class="fg-hull"/>`;
    s += `<rect x="${n1(x - 2 * k)}" y="${n1(S - 19 * k)}" width="${n1(14 * k)}" height="${n1(11 * k)}" class="fg-cab"/>`;
    st = [x - 27 * k, S - 8 * k]; bow = x + 30 * k; box = [x - 30 * k, S - 21 * k, x + 32 * k, S + 6 * k];
  } else {
    s = `<path d="${pth([[x - 22 * k, S - 6 * k], [x + 20 * k, S - 6 * k], [x + 25 * k, S - 10 * k], [x + 17 * k, S + 3 * k], [x - 18 * k, S + 3 * k]], true)}" class="fg-hull"/>`;
    st = [x - 21 * k, S - 6 * k]; bow = x + 25 * k; box = [x - 24 * k, S - 12 * k, x + 27 * k, S + 5 * k];
  }
  return { s, st, box, bow, deck: S - (type === "big" ? 9 : type === "mid" ? 8 : 6) * k };
}
// direction of travel (ahead of the bow) and the wake behind the stern
const motion = (b, S) => `<path d="M${n1(b.bow + 4)} ${n1(S - 22)}H${n1(b.bow + 20)}M${n1(b.bow + 14)} ${n1(S - 26)}L${n1(b.bow + 20)} ${n1(S - 22)}L${n1(b.bow + 14)} ${n1(S - 18)}" class="fg-ln"/>` +
  `<path d="M${n1(b.st[0] - 4)} ${n1(S + 1)}q-9 3 -20 2M${n1(b.st[0] - 2)} ${n1(S + 5)}q-8 3 -16 3" class="fg-ln fg-thin"/>`;
function person(x, y, k, hx, hy) {
  const sh = y - 19 * k;
  return `<circle cx="${n1(x)}" cy="${n1(y - 26 * k)}" r="${n1(3.4 * k)}" class="fg-fill"/><path d="M${n1(x)} ${n1(y - 22.5 * k)}L${n1(x)} ${n1(y - 10 * k)}L${n1(x - 4 * k)} ${n1(y)}M${n1(x)} ${n1(y - 10 * k)}L${n1(x + 4 * k)} ${n1(y)}M${n1(x)} ${n1(sh)}L${n1(hx)} ${n1(hy)}M${n1(x)} ${n1(sh)}L${n1(x - 5 * k)} ${n1(sh + 7 * k)}" class="fg-ln"/>`;
}
const buoy = (x, S) => `${ln(x, S - 6, x, S - 18)}<path d="M${n1(x)} ${n1(S - 18)}l9 3l-9 3Z" class="fg-fill"/><circle cx="${n1(x)}" cy="${n1(S - 2)}" r="5.5" class="fg-float"/>`;
const anchor = (x, B) => `<path d="M${n1(x)} ${n1(B - 14)}V${n1(B - 1)}M${n1(x - 6)} ${n1(B - 6)}Q${n1(x - 5)} ${n1(B)} ${n1(x)} ${n1(B - 1)}Q${n1(x + 5)} ${n1(B)} ${n1(x + 6)} ${n1(B - 6)}M${n1(x - 4)} ${n1(B - 11)}H${n1(x + 4)}" class="fg-thick2"/>`;
const hook = (x, y) => `<path d="M${n1(x)} ${n1(y)}q0 4.5 3.2 4.5q2.8 0 2.8 -3" class="fg-ln"/><circle cx="${n1(x + 1.4)}" cy="${n1(y + 3.2)}" r="1.7" class="fg-fill"/>`;
const floatE = (x, y) => `<ellipse cx="${n1(x)}" cy="${n1(y)}" rx="4.6" ry="3" class="fg-float"/>`;
const net = (d) => `<path d="${d}" fill="url(#fishgear-mesh)" class="fg-netl"/>`;

/* ---------- one drawing per method: returns { s, parts: [[id, d]...] } (parts listed bottom to top for tapping) ---------- */
const DRAW = {
  purse(P, r) {
    const { S, k } = P, D = P.d, cx = 150 + r() * 18, rx = 64 + r() * 9, ry = 9 + r() * 3, rb = rx * 0.32, yb = S + D;
    const bx = cx - rx - 12, b = boat(bx, S, k, "big");
    let s = "";
    const fl = []; for (let i = 0; i < 16; i++) { const a = (i / 16) * 6.283; fl.push([cx + rx * Math.cos(a), S + ry * Math.sin(a), Math.sin(a) < 0]); }
    const netD = `M${n1(cx - rx)} ${n1(S)}A${n1(rx)} ${n1(ry)} 0 0 0 ${n1(cx + rx)} ${n1(S)}Q${n1(cx + rx * 0.95)} ${n1(S + D * 0.75)} ${n1(cx + rb)} ${n1(yb)}A${n1(rb)} 4 0 0 1 ${n1(cx - rb)} ${n1(yb)}Q${n1(cx - rx * 0.95)} ${n1(S + D * 0.75)} ${n1(cx - rx)} ${n1(S)}Z`;
    s += fl.filter((f) => f[2]).map((f) => floatE(f[0], f[1])).join("");
    s += net(netD) + shoal(r, cx, S + D * 0.48, (rx + rb) * 0.36, D * 0.26, 7 + Math.floor(r() * 5), 1, r() < 0.5 ? 1 : -1);
    s += `<ellipse cx="${n1(cx)}" cy="${n1(yb)}" rx="${n1(rb)}" ry="4" class="fg-thick"/>`;
    for (let i = 0; i < 8; i++) { const a = (i / 8) * 6.283; s += `<circle cx="${n1(cx + rb * Math.cos(a))}" cy="${n1(yb + 4 * Math.sin(a))}" r="2.3" class="fg-float"/>`; }
    const dx = b.box[2] - 10, dy = S + 3;
    s += ln(cx - rb, yb, dx, dy, "fg-thick") + b.s;
    s += fl.filter((f) => !f[2]).map((f) => floatE(f[0], f[1])).join("");
    const parts = [["net", netD], ["boat", rectP(...b.box)], ["floats", fl.map((f) => circP(f[0], f[1], 11)).join("")], ["draw", band(cx - rb, yb, dx, dy, 22) + rectP(cx - rb - 11, yb - 12, cx + rb + 11, yb + 12)]];
    return { s, parts };
  },
  pelagic(P, r) {
    const { S, k } = P, bx = 196 + r() * 10, b = boat(bx, S, k, "big"), my = P.my, ry = P.ry, mx = 106 + r() * 18, ex = 16 + r() * 10, ey = my + (r() * 2 - 1) * 4;
    const netD = `M${n1(mx)} ${n1(my - ry)}C${n1(mx - 40)} ${n1(my - ry)} ${n1(ex + 34)} ${n1(ey - 9)} ${n1(ex + 6)} ${n1(ey - 7)}A7 7 0 0 0 ${n1(ex + 6)} ${n1(ey + 7)}C${n1(ex + 34)} ${n1(ey + 9)} ${n1(mx - 40)} ${n1(my + ry)} ${n1(mx)} ${n1(my + ry)}Z`;
    let s = ln(b.st[0], b.st[1], mx, my - ry) + ln(b.st[0], b.st[1], mx, my + ry);
    s += net(netD) + `<ellipse cx="${n1(mx)}" cy="${n1(my)}" rx="7" ry="${n1(ry)}" class="fg-thick2" fill="none"/>`;
    s += shoal(r, mx + 34, my, 24, ry * 0.7, 4 + Math.floor(r() * 3), 1, 1) + shoal(r, ex + 26, ey, 14, 4, 3, 0.85, 1);
    s += b.s + motion(b, S);
    return { s, parts: [["net", netD], ["warp", band(b.st[0], b.st[1], mx, my - ry, 10) + band(b.st[0], b.st[1], mx, my + ry, 10)], ["boat", rectP(...b.box)]] };
  },
  beam(P, r) {
    const { S, B, k } = P, bx = 196 + r() * 10, b = boat(bx, S, k, "big"), sx = 120 + r() * 22, wx = sx + 44 + r() * 14, wy = B - 52 - r() * 14;
    const shoe = (x, y) => `<path d="${pth([[x - 11, y], [x + 12, y], [x + 7, y - 19], [x - 6, y - 19]], true)}" class="fg-cab"/>`;
    const cex = sx - 96 - r() * 12;
    const netD = `M${n1(sx)} ${n1(B - 19)}L${n1(sx + 20)} ${n1(B - 33)}C${n1(sx - 20)} ${n1(B - 34)} ${n1(cex + 30)} ${n1(B - 18)} ${n1(cex + 4)} ${n1(B - 13)}A6 6 0 0 0 ${n1(cex + 4)} ${n1(B - 1)}L${n1(sx + 8)} ${n1(B - 1)}Z`;
    let s = shoe(sx + 20, B - 14) + net(netD);
    for (let i = 0; i < 4; i++) { const px = cex + 8 + i * 24 + r() * 8; s += `<path d="M${n1(px)} ${n1(B - 1)}a5 5 0 0 1 8 -5a5 5 0 0 1 9 1a4 4 0 0 1 6 4" class="fg-puff"/>`; }
    s += shoe(sx, B) + ln(sx, B - 19, sx + 20, B - 33, "fg-beam");
    s += ln(b.st[0], b.st[1], wx, wy) + ln(wx, wy, sx, B - 19) + ln(wx, wy, sx + 20, B - 33) + b.s + motion(b, S);
    return { s, parts: [["net", netD], ["warp", band(b.st[0], b.st[1], wx, wy, 16)], ["boat", rectP(...b.box)], ["beam", band(sx, B - 19, sx + 20, B - 33, 24)]] };
  },
  gill(P, r) {
    const { S, B, k } = P, x0 = 30 + r() * 14, x1 = 226 + r() * 14, top = B - P.h;
    let s = "";
    if (P.v) { const b = boat((x0 + x1) / 2 + (r() * 2 - 1) * 30, S, k, "small"); s += b.s + person(b.box[0] + 28 * k, b.box[1] + 6 * k, k, b.box[0] + 36 * k, b.box[1] - 2); }
    s += ln(x0, top, x0 - 4, S - 2) + ln(x1, top, x1 + 4, S - 2) + buoy(x0 - 4, S) + buoy(x1 + 4, S);
    s += ln(x0, B - 3, x0 - 14, B - 1) + ln(x1, B - 3, x1 + 14, B - 1) + anchor(x0 - 14, B) + anchor(x1 + 14, B);
    const netD = rectP(x0, top, x1, B - 3);
    s += net(netD) + ln(x0, top, x1, top, "fg-thick2") + ln(x0, B - 3, x1, B - 3, "fg-thick2");
    const fl = [], wt = []; for (let x = x0 + 7; x < x1 - 3; x += 14) fl.push(x); for (let x = x0 + 6; x < x1 - 3; x += 16) wt.push(x);
    s += fl.map((x) => floatE(x, top)).join("") + wt.map((x) => `<rect x="${n1(x - 3)}" y="${n1(B - 6)}" width="6" height="5" class="fg-fill"/>`).join("");
    const nf = 2 + Math.floor(r() * 2); for (let i = 0; i < nf; i++) s += fish(x0 + 26 + ((x1 - x0 - 52) * (i + r() * 0.6)) / nf, top + 14 + r() * (P.h - 30), 1.15, r() < 0.5 ? 1 : -1);
    s += fish(x0 + 20 + r() * (x1 - x0 - 40), top - 14 - r() * 10, 1, r() < 0.5 ? 1 : -1);
    return { s, parts: [["net", netD], ["buoys", circP(x0 - 4, S - 6, 10) + circP(x1 + 4, S - 6, 10)], ["anchors", rectP(x0 - 24, B - 16, x0 - 4, B + 2) + rectP(x1 + 4, B - 16, x1 + 24, B + 2)], ["floats", fl.map((x) => rectP(x - 7, top - 6, x + 7, top + 6)).join("")]] };
  },
  drift(P, r) {
    const { S, k } = P, bx = 214 + r() * 10, b = boat(bx, S, k, "mid"), xe = 20 + r() * 14, xs = b.st[0] - 2, hb = S + P.h, sag = 6 + r() * 6;
    const netD = `M${n1(xe)} ${n1(S + 2)}L${n1(xs)} ${n1(S + 2)}L${n1(xs - 4)} ${n1(hb - 4)}Q${n1((xe + xs) / 2)} ${n1(hb + sag)} ${n1(xe + 3)} ${n1(hb - 4)}Z`;
    let s = ln(xs, S + 2, b.st[0], b.st[1]) + net(netD) + `<path d="M${n1(xs - 4)} ${n1(hb - 4)}Q${n1((xe + xs) / 2)} ${n1(hb + sag)} ${n1(xe + 3)} ${n1(hb - 4)}" class="fg-thick2"/>`;
    const wt = []; for (let i = 1; i < 12; i++) { const t = i / 12, x = (1 - t) * (1 - t) * (xs - 4) + 2 * t * (1 - t) * ((xe + xs) / 2) + t * t * (xe + 3), y = (1 - t) * (1 - t) * (hb - 4) + 2 * t * (1 - t) * (hb + sag) + t * t * (hb - 4); wt.push([x, y]); }
    s += wt.map(([x, y]) => `<circle cx="${n1(x)}" cy="${n1(y)}" r="2.2" class="fg-fill"/>`).join("");
    const fl = []; for (let x = xe + 12; x < xs - 4; x += 15) fl.push(x);
    s += ln(xe, S + 2, xs, S + 2, "fg-thick2") + fl.map((x) => floatE(x, S + 1)).join("") + buoy(xe, S);
    const nf = 2 + Math.floor(r() * 2); for (let i = 0; i < nf; i++) s += fish(xe + 24 + ((xs - xe - 48) * (i + r() * 0.6)) / nf, S + 16 + r() * (P.h - 30), 1.15, r() < 0.5 ? 1 : -1);
    s += b.s;
    return { s, parts: [["net", netD], ["boat", rectP(...b.box)], ["weights", wt.map(([x, y], i) => (i ? band(wt[i - 1][0], wt[i - 1][1], x, y, 22) : "")).join("")], ["floats", fl.map((x) => rectP(x - 7.5, S - 10, x + 7.5, S + 12)).join("") + circP(xe, S - 5, 13)]] };
  },
  longline(P, r) {
    const { S, B, k } = P; let s = "", parts;
    if (!P.v) {   // pelagic longline from a boat: main line just below the surface, held up by floats
      const bx = 220 + r() * 8, b = boat(bx, S, k, "mid"), ym = S + P.dm, x2 = b.st[0] - 22;
      s += ln(b.st[0], b.st[1], x2, ym) + ln(x2, ym, -2, ym + 3, "fg-thick2");
      const fx = []; for (let x = x2 - 26 - r() * 10; x > 12; x -= 52 + r() * 10) fx.push(x);
      const hx = []; for (let x = x2 - 8; x > 6; x -= 12.5) if (fx.every((f) => Math.abs(f - x) > 5)) hx.push(x);
      const yAt = (x) => ym + ((x2 - x) / (x2 + 2)) * 3, L = P.hl;
      for (const f of fx) s += ln(f, yAt(f), f, S + 1) + `<circle cx="${n1(f)}" cy="${n1(S - 1)}" r="5" class="fg-float"/>`;
      hx.forEach((x, i) => { const l = L + ((i * 7) % 5) - 2; s += ln(x, yAt(x), x, yAt(x) + l) + hook(x, yAt(x) + l); });
      const hi = hx[Math.floor(hx.length * (0.3 + r() * 0.4))]; s += fish(hi + 4, yAt(hi) + L + 13, 1.1, r() < 0.5 ? 1 : -1);
      s += shoal(r, 70 + r() * 80, ym + L + 40 + r() * 10, 50, 9, 3 + Math.floor(r() * 3), 1, r() < 0.5 ? 1 : -1) + b.s;
      parts = [["boat", rectP(...b.box)], ["main", band(x2, ym, 2, ym + 3, 20) + band(b.st[0], b.st[1], x2, ym, 14)], ["floats", fx.map((f) => circP(f, S - 2, 12)).join("")], ["hooks", hx.map((x) => rectP(x - 9, yAt(x) + L - 10, x + 12, yAt(x) + L + 14)).join("")]];
    } else {      // bottom longline: anchored main line just above the seabed, buoys at each end
      const x0 = 18 + r() * 8, x1 = 246 - r() * 8, ym = B - P.hl - 12;
      s += buoy(x0, S) + buoy(x1, S) + ln(x0, S + 3, x0, ym) + ln(x1, S + 3, x1, ym) + ln(x0, ym, x0 - 6, B - 1) + ln(x1, ym, x1 + 6, B - 1) + anchor(x0 - 6, B) + anchor(x1 + 6, B);
      s += `<path d="M${n1(x0)} ${n1(ym)}Q${n1((x0 + x1) / 2)} ${n1(ym + 5)} ${n1(x1)} ${n1(ym)}" class="fg-thick2"/>`;
      const yAt = (x) => { const t = (x - x0) / (x1 - x0); return ym + 2 * t * (1 - t) * 5; }, L = P.hl;
      const hx = []; for (let x = x0 + 12; x < x1 - 8; x += 12.5) hx.push(x);
      hx.forEach((x, i) => { const l = L + ((i * 7) % 5) - 2; s += ln(x, yAt(x), x, yAt(x) + l) + hook(x, yAt(x) + l); });
      const hi = hx[Math.floor(hx.length * (0.3 + r() * 0.4))]; s += fish(hi + 4, yAt(hi) + L - 2, 1.05, r() < 0.5 ? 1 : -1);
      s += shoal(r, 134, ym - 30 - r() * 20, 70, 10, 3 + Math.floor(r() * 3), 1, r() < 0.5 ? 1 : -1);
      if (r() < 0.5) { const b = boat(x0 + 40 + r() * 20, S, k, "mid"); s += b.s; }
      parts = [["anchors", rectP(x0 - 16, B - 16, x0 + 4, B + 2) + rectP(x1 - 4, B - 16, x1 + 16, B + 2)], ["main", band(x0, ym + 1, x1, ym + 1, 20)], ["floats", circP(x0, S - 6, 13) + circP(x1, S - 6, 13)], ["hooks", hx.map((x) => rectP(x - 9, yAt(x) + L - 10, x + 12, yAt(x) + L + 12)).join("")]];
    }
    return { s, parts };
  },
  pole(P, r) {
    const { S, k } = P, bx = 152 + r() * 22, b = boat(bx, S, k, "mid"), dk = b.deck, nf = 2 + Math.floor(r() * 2);
    let s = shoal(r, bx - 82 - r() * 10, S + 22 + r() * 6, 46, 12, 8 + Math.floor(r() * 4), 1, r() < 0.5 ? 1 : -1);
    const tips = [];
    for (let i = 0; i < nf; i++) {
      const px = bx - 24 * k + i * 11 * k, hx = px - 6 * k, hy = dk - 15 * k, tx = bx - 70 - i * 16 - r() * 6, ty = S - 46 + i * 7 + r() * 4;
      s += person(px, dk, k, hx, hy) + ln(hx + 4, hy + 2, tx, ty, "fg-rod");
      tips.push([tx, ty]);
    }
    const lift = r() < 0.75 ? 0 : -1;
    tips.forEach(([tx, ty], i) => {
      if (i === lift) { const fy = S - 12 - r() * 3; s += ln(tx, ty, tx + 2, fy - 8) + `<g transform="rotate(90 ${n1(tx + 2)} ${n1(fy)})">${fish(tx + 2, fy, 1.15, -1)}</g>`; }
      else { const ey = S + 9 + r() * 8; s += ln(tx, ty, tx - 2, ey) + hook(tx - 2, ey); }
    });
    // live bait thrown from the boat into the water beside the shoal
    const x0 = bx + 4 * k, y0 = dk - 4, x1 = bx - 52 - r() * 16, y1 = S - 2, cy = Math.min(y0, y1) - 26;
    s += `<path d="M${n1(x0)} ${n1(y0)}Q${n1((x0 + x1) / 2)} ${n1(cy)} ${n1(x1)} ${n1(y1)}" class="fg-ln fg-dash"/>`;
    for (const t of [0.35, 0.6, 0.85]) { const x = (1 - t) * (1 - t) * x0 + 2 * t * (1 - t) * ((x0 + x1) / 2) + t * t * x1, y = (1 - t) * (1 - t) * y0 + 2 * t * (1 - t) * cy + t * t * y1; s += fish(x, y - 1, 0.5, -1); }
    s += b.s;
    return { s, parts: [["boat", rectP(...b.box)], ["rods", tips.map(([tx, ty], i) => band(bx - 30 * k + i * 11 * k + 4, dk - 13 * k, tx, ty, 9)).join("")]] };
  },
  troll(P, r) {
    const { S, k } = P, bx = 198 + r() * 10, b = boat(bx, S, k, "mid"), nl = 3 + Math.floor(r() * 2);
    const rig = [[bx - 4 * k, b.deck, bx - 44 - r() * 8, S - 58 + r() * 6], [bx - 16 * k, b.deck, bx - 72 - r() * 8, S - 40 + r() * 6]];
    let s = rig.map(([a, c, d, e]) => ln(a, c, d, e, "fg-rod")).join("");
    const starts = [[rig[0][2], rig[0][3]], [rig[1][2], rig[1][3]], [b.st[0], b.st[1]], [b.st[0] + 4, b.st[1]]].slice(0, nl);
    const lures = [];
    starts.forEach(([sx, sy], i) => {
      const lx = 18 + i * 26 + r() * 14, ly = S + 8 + ((i * 5) % 3) * 6 + r() * 6;
      s += `<path d="M${n1(sx)} ${n1(sy)}Q${n1((sx + lx) / 2 + 10)} ${n1(Math.max(sy, S - 6) + 8)} ${n1(lx + 9)} ${n1(ly)}" class="fg-ln fg-thin"/>`;
      s += `<path d="M${n1(lx + 9)} ${n1(ly)}Q${n1(lx + 3)} ${n1(ly - 3.2)} ${n1(lx - 3)} ${n1(ly)}Q${n1(lx + 3)} ${n1(ly + 3.2)} ${n1(lx + 9)} ${n1(ly)}Z" class="fg-float"/>` + `<path d="M${n1(lx - 3)} ${n1(ly)}q-3 0 -3 3q0 2.5 2.4 2.5" class="fg-ln"/>`;
      lures.push([lx, ly]);
    });
    const c = lures[Math.floor(r() * lures.length)]; s += fish(c[0] - 16, c[1] + 2, 1.1, 1);
    s += b.s + motion(b, S);
    return { s, parts: [["boat", rectP(...b.box)], ["rods", rig.map(([a, c2, d, e]) => band(a, c2, d, e, 9)).join("")], ["lures", lures.map(([x, y]) => rectP(x - 8, y - 7, x + 11, y + 8)).join("")]] };
  },
  cast(P, r) {
    const { S, B, k } = P; let s = "", hx, hy, px;
    if (P.v & 1) {  // from the shore
      px = 30 + r() * 6;
      const land = [[0, S - 20], [44, S - 20], [70, S - 6], [100, B]];
      s += seabed(r, B, 100, land);
      hx = px + 9 * k; hy = S - 20 - 21 * k; s += person(px, S - 20, k, hx, hy);
    } else {        // from a small boat
      const b = boat(46 + r() * 16, S, k, "small"); px = b.box[0] + 30 * k; s += b.s; hx = px + 9 * k; hy = b.deck - 21 * k; s += person(px, b.deck, k, hx, hy);
    }
    const R = 34 + r() * 8, nx = P.v & 1 ? 108 + R + r() * 20 : px + 84 + r() * 20;
    const parts = [];
    if (P.v & 2) {  // net spread in the air as it is thrown
      const cy = S - 30 - r() * 4, ry = 8;
      const netD = `M${n1(nx - R)} ${n1(cy)}A${n1(R)} ${ry} 0 0 1 ${n1(nx + R)} ${n1(cy)}A${n1(R)} ${ry} 0 0 1 ${n1(nx - R)} ${n1(cy)}Z`;
      s += `<path d="M${n1(hx)} ${n1(hy)}Q${n1((hx + nx) / 2)} ${n1(Math.min(hy, cy) - 14)} ${n1(nx)} ${n1(cy - 2)}" class="fg-ln"/>` + net(netD);
      for (let i = 0; i < 12; i++) { const a = (i / 12) * 6.283; s += ln(nx, cy, nx + R * Math.cos(a), cy + ry * Math.sin(a), "fg-ln fg-thin"); }
      const wt = []; for (let i = 0; i < 14; i++) { const a = (i / 14) * 6.283; wt.push([nx + R * Math.cos(a), cy + ry * Math.sin(a)]); }
      s += wt.map(([x, y]) => `<circle cx="${n1(x)}" cy="${n1(y)}" r="2.3" class="fg-fill"/>`).join("");
      s += shoal(r, nx, (S + B) / 2 + 4, R * 0.7, (B - S) * 0.22, 3 + Math.floor(r() * 3), 1, r() < 0.5 ? 1 : -1);
      parts.push(["net", netD], ["weights", wt.map(([x, y]) => circP(x, y, 5)).join("")]);
    } else {        // net sinking over the fish
      const ya = S + 3, yr = B - 5;
      const netD = `M${n1(nx)} ${n1(ya)}C${n1(nx - 8)} ${n1(ya + 18)} ${n1(nx - R)} ${n1(yr - 18)} ${n1(nx - R)} ${n1(yr)}L${n1(nx + R)} ${n1(yr)}C${n1(nx + R)} ${n1(yr - 18)} ${n1(nx + 8)} ${n1(ya + 18)} ${n1(nx)} ${n1(ya)}Z`;
      s += `<path d="M${n1(hx)} ${n1(hy)}Q${n1((hx + nx) / 2)} ${n1(Math.min(hy, ya) - 10)} ${n1(nx)} ${n1(ya)}" class="fg-ln"/>` + shoal(r, nx, yr - 12, R * 0.55, 6, 2 + Math.floor(r() * 2), 1, r() < 0.5 ? 1 : -1) + net(netD);
      const wt = []; for (let i = 0; i <= 8; i++) wt.push([nx - R + (i * 2 * R) / 8, yr]);
      s += wt.map(([x, y]) => `<circle cx="${n1(x)}" cy="${n1(y)}" r="2.4" class="fg-fill"/>`).join("");
      parts.push(["net", netD], ["weights", rectP(nx - R - 5, yr - 5, nx + R + 5, yr + 5)]);
    }
    parts.push(["person", rectP(px - 8, hy - 12, px + 12, (P.v & 1 ? S - 20 : S) + 2)]);
    return { s, parts };
  },
  trap(P, r) {
    const { S, B, k } = P, n = 1 + (r() < 0.45 ? 1 : 0), tx = n === 2 ? 72 + r() * 20 : 110 + r() * 40, side = r() < 0.5 ? -1 : 1;
    let s = "", traps = "";
    const T = (x) => {
      const d = `M${n1(x - 30)} ${n1(B)}A30 27 0 0 1 ${n1(x + 30)} ${n1(B)}Z`, w = x + side * 28;
      return { d, s: `<path d="${d}" fill="url(#fishgear-weave)" class="fg-netl"/><path d="M${n1(w)} ${n1(B - 17)}L${n1(x + side * 12)} ${n1(B - 11)}L${n1(x + side * 12)} ${n1(B - 6)}L${n1(w)} ${n1(B - 2)}" class="fg-ln fg-funnel"/><ellipse cx="${n1(w)}" cy="${n1(B - 9.5)}" rx="2.6" ry="7" class="fg-cab"/><circle cx="${n1(x - side * 8)}" cy="${n1(B - 8)}" r="3.2" class="fg-fill"/>` };
    };
    const t1 = T(tx); s += t1.s; traps += t1.d;
    if (n === 2) { const t2 = T(tx + 92); s += ln(tx + 30, B - 2, tx + 62, B - 2) + t2.s; traps += t2.d; }
    const bxu = tx + (r() < 0.5 ? -1 : 1) * (18 + r() * 14);
    s += `<path d="M${n1(tx)} ${n1(B - 27)}Q${n1((tx + bxu) / 2 + 8)} ${n1((S + B) / 2)} ${n1(bxu)} ${n1(S + 3)}" class="fg-ln"/>` + buoy(bxu, S);
    s += fish(tx + side * 50, B - 12 - r() * 8, 1.05, -side);
    if (r() < 0.45) { const b = boat(n === 2 ? 220 : (bxu < 134 ? 215 : 52), S, k, "small"); s += b.s; }
    return { s, parts: [["trap", traps], ["rope", band(tx, B - 27, bxu, S + 3, 10)], ["buoys", circP(bxu, S - 6, 10)]] };
  },
};

function drawPanel(F, i, opt) {
  const p = F.panels[i], [px, py] = POS[i], r = rng(p.ps), mtx = p.mir ? `translate(${px + PW} ${py}) scale(-1 1)` : `translate(${px} ${py})`;
  const { S, B } = p, hl = opt.hl || {};
  let s = `<rect x="0" y="0" width="${PW}" height="${PH}" class="fg-bg"/><rect x="0" y="${n1(S)}" width="${PW}" height="${n1(PH - S)}" class="fg-water"/>`;
  const shore = p.m === "cast" && p.v & 1;
  if (!shore) s += seabed(r, B);
  const D = DRAW[p.m](p, r);
  s += D.s + surf(S);
  if (shore) s += `<path d="${pth([[0, S - 20], [44, S - 20], [70, S - 6]])}" class="fg-bedl"/>`;
  if (hl.part && hl.part[0] === i) { const d = D.parts.find((x) => x[0] === hl.part[1]); if (d) s += `<path d="${d[1]}" class="fg-hlpart"/>`; }
  if (opt.partTap === i) for (const [id, d] of D.parts) s += `<path d="${d}" fill="transparent" data-tap="${id}"/>`;
  let out = `<g transform="${mtx}" clip-path="url(#fishgear-clip)">${s}</g><rect x="${px}" y="${py}" width="${PW}" height="${PH}" class="fg-frame"/>`;
  out += `<text x="${px + 2}" y="${py - 5}" class="fg-let">${LET[i]}</text>`;
  if (hl.panel === i) out += `<rect x="${px - 2.5}" y="${py - 25}" width="${PW + 5}" height="${PH + 27.5}" rx="4" class="fg-hlp"/>`;
  else if (hl.wrong === i) out += `<rect x="${px - 2.5}" y="${py - 25}" width="${PW + 5}" height="${PH + 27.5}" rx="4" class="fg-hlw"/>`;
  if (opt.panelTap) out += `<rect x="${px}" y="${py - 24}" width="${PW}" height="${PH + 24}" fill="transparent" data-tap="${LET[i]}"/>`;
  return { s: out, parts: D.parts };
}

function svg(F, opt) {
  opt = opt || {};
  const defs = `<defs><clipPath id="fishgear-clip"><rect x="0" y="0" width="${PW}" height="${PH}"/></clipPath>` +
    `<pattern id="fishgear-mesh" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M0 0L7 7M7 0L0 7" class="fg-mesh"/></pattern>` +
    `<pattern id="fishgear-weave" width="6" height="6" patternUnits="userSpaceOnUse"><path d="M0 3H6M3 0V6" class="fg-mesh"/></pattern>` +
    `<pattern id="fishgear-bed" width="7" height="7" patternUnits="userSpaceOnUse"><path d="M-1 1L1 -1M0 7L7 0M6 8L8 6" class="fg-hatch"/></pattern></defs>`;
  let s = defs; for (let i = 0; i < 4; i++) s += drawPanel(F, i, opt).s;
  s += `<text x="${W / 2}" y="${H - 8}" text-anchor="middle" class="fg-sm">Side views, not drawn to scale. Hatched area = seabed.</text>`;
  return `<svg viewBox="0 0 ${W} ${H}" class="figsvg fig-${KEY}" role="img" aria-label="Four drawings, A to D, each showing a fishing method from the side">${s}</svg>`;
}

/* ---------- generation ---------- */
function panelParams(m, r) {
  const S = n1(50 + r() * 8), k = n1(0.9 + r() * 0.22) , p = { m, mir: r() < 0.5, S, k, ps: Math.floor(r() * 1e9), v: 0, B: n1(178 + r() * 12) };
  if (m === "purse") { p.d = n1(78 + r() * 24); p.B = n1(Math.min(192, S + p.d + 30 + r() * 20)); }
  if (m === "pelagic") { p.ry = n1(23 + r() * 6); p.my = n1(S + 52 + r() * 22); p.B = n1(Math.min(194, Math.max(p.B, p.my + p.ry + 34))); }
  if (m === "beam") p.B = n1(170 + r() * 18);
  if (m === "gill") { p.B = n1(S + 102 + r() * 26); p.h = n1(50 + r() * 20); p.v = r() < 0.5 ? 1 : 0; }
  if (m === "drift") { p.h = n1(46 + r() * 20); }
  if (m === "longline") { p.v = r() < 0.35 ? 1 : 0; p.dm = n1(22 + r() * 12); p.hl = n1(16 + r() * 6); }
  if (m === "cast") { p.B = n1(S + 62 + r() * 16); p.v = Math.floor(r() * 4); }
  if (m === "trap") p.B = n1(S + 88 + r() * 34);
  return p;
}

function make(seed) {
  for (let tries = 0; tries < 2000; tries++) {
    const r = rng(seed + tries * 7919 + 13);
    const ms = []; for (const m of shuffleR(r, METHODS)) { if (ms.length === 4) break; if (SIB[m] && ms.includes(SIB[m])) continue; ms.push(m); }
    const [iX, iT, iY, iW] = shuffleR(r, [0, 1, 2, 3]);
    const pc = [iX, iT, iY].filter((i) => PARTQ[ms[i]]);
    if (!pc.length) continue;
    const iP = pickR(r, pc), pq = Math.floor(r() * PARTQ[ms[iP]].length);
    const cmp = cmpOf(ms);   // never let the impact question give the comparison question away
    const imps = IMPACTS.filter((I) => I.has(ms) && !(cmp === "pl" && I.id === "select" && I.ans(ms) === "pole") && !(cmp === "bp" && I.id === "seabed")).map((I) => ({ id: I.id, ans: ms.indexOf(I.ans(ms)) }));
    const impW = imps.filter((x) => x.ans === iW), impO = imps.filter((x) => x.ans !== iT);
    const imp = impW.length ? pickR(r, impW) : impO.length ? pickR(r, impO) : null;
    if (!imp) continue;
    const iM = imp.ans === iW ? pickR(r, [iX, iY]) : iW;
    const panels = ms.map((m) => panelParams(m, r));
    return { kind: KEY, seed, panels, iX, iT, iY, iW, iP, pq, imp: imp.id, iI: imp.ans, iM };
  }
  throw new Error("fishgear: no layout");
}

/* ---------- questions ---------- */
function nameOpts(m, r) {
  const ok = (x) => x !== m && x !== SIB[m];
  let d = shuffleR(r, CONF[m]).filter(ok).slice(0, 3);
  for (const x of shuffleR(r, METHODS)) { if (d.length >= 3) break; if (ok(x) && !d.includes(x)) d.push(x); }
  if (NAME[m].length > Math.max(...d.map((x) => NAME[x].length))) { const lg = shuffleR(r, METHODS).find((x) => ok(x) && !d.includes(x) && NAME[x].length >= NAME[m].length); if (lg) d[2] = lg; }
  return [m, ...d];
}
const capF = (s) => s[0].toUpperCase() + s.slice(1);

function questions(F, r) {
  const qs = [], ms = F.panels.map((p) => p.m), L = (i) => LET[i];
  const nameQ = (i) => {
    const m = ms[i], o = nameOpts(m, r), d1 = o[1];
    return { kind: "choice", q: `Which fishing method is shown in panel <b>${L(i)}</b>?`, options: o.map((x) => NAME[x]), a: 0, hl: { panel: i },
      why: `Panel ${L(i)} shows <b>${NAMEA[m]}</b>: ${CLUE[m]}. ${capF(NAMEA[d1])} would look different: ${CLUE[d1]}.` };
  };
  // 1. name the method in panel X
  qs.push(nameQ(F.iX));
  // 2. tap the panel matching a description
  const mT = ms[F.iT];
  qs.push({ kind: "tap", q: `Tap the panel showing ${DESC[mT]}.`, a: [L(F.iT)], ansTxt: `panel ${L(F.iT)}`, labelOf: (id) => `panel ${id}`,
    askOpt: { panelTap: true }, doneOpt: (st, ok) => ({ hl: { panel: F.iT, wrong: ok ? null : LET.indexOf((st || [])[0]) } }),
    why: `Panel ${L(F.iT)} shows <b>${NAMEA[mT]}</b>: ${CLUE[mT]}.` });
  // 3. name the method in panel Y
  qs.push(nameQ(F.iY));
  // 4. tap a part of the gear in panel P (already named or described)
  const [pid, pstem, pname, pwhy] = PARTQ[ms[F.iP]][F.pq], partsP = drawPanel(F, F.iP, {}).parts;
  qs.push({ kind: "tap", q: `In panel <b>${L(F.iP)}</b> (${NAME[ms[F.iP]]}), ${pstem}. Use Zoom to see the gear closely.`, a: [pid], ansTxt: pname, labelOf: (id) => PARTNAME[id] || `the ${id}`,
    askOpt: { partTap: F.iP }, doneOpt: () => ({ partTap: F.iP, hl: { part: [F.iP, pid] } }), why: pwhy, _parts: partsP.map((x) => x[0]) });
  // 5. tap the panel matching an impact
  const I = IMPACTS.find((x) => x.id === F.imp), mI = ms[F.iI];
  qs.push({ kind: "tap", q: I.q, a: [L(F.iI)], ansTxt: `panel ${L(F.iI)}`, labelOf: (id) => `panel ${id}`,
    askOpt: { panelTap: true }, doneOpt: (st, ok) => ({ hl: { panel: F.iI, wrong: ok ? null : LET.indexOf((st || [])[0]) } }),
    why: `Panel ${L(F.iI)} shows <b>${NAMEA[mI]}</b>: ${I.why}` });
  // 6. tick the true statements about the method in panel M
  const mM = ms[F.iM], cmp = cmpOf(ms);
  const pool = ST.map((x, j) => [x.t, x.T.includes(mM), j]).filter(([, , j]) => (ST[j].T.includes(mM) || ST[j].F.includes(mM)) && (!ST[j].x || ST[j].x !== cmp));
  let pick = null;
  for (let t = 0; t < 20 && !pick; t++) { const seen = new Set(), st = shuffleR(r, pool).filter(([, , j]) => { const g = ST[j].g; if (!g) return true; if (seen.has(g)) return false; seen.add(g); return true; }); pick = pickMixed(r, st, Math.min(4, st.length)); }
  if (pick) qs.push({ kind: "multi", q: `Tick <b>every</b> statement that is true for the fishing method shown in panel <b>${L(F.iM)}</b>.`, options: pick.map((x) => x[0]), a: pick.map((x, j) => (x[1] ? j : -1)).filter((j) => j >= 0), hl: { panel: F.iM },
    why: `Panel ${L(F.iM)} shows <b>${NAMEA[mM]}</b>.<br>` + pick.map((x) => `${x[1] ? "✓" : "✗"} ${x[0]} — ${ST[x[2]].w}.`).join("<br>") });
  // 7. compare two methods (when both are shown)
  const iPo = ms.indexOf("pole"), iLo = ms.indexOf("longline"), iBe = ms.indexOf("beam"), iPe = ms.indexOf("pelagic");
  if (iPo >= 0 && iLo >= 0) qs.push({ kind: "choice", q: `Panels <b>${L(iPo)}</b> and <b>${L(iLo)}</b> both catch fish on hooks. Why does the method in panel <b>${L(iPo)}</b> have much less bycatch than the method in panel <b>${L(iLo)}</b>?`,
    options: ["Fish are caught one at a time, so few unwanted animals are hooked.", "The rods are made of wood, so the method cannot harm fish stocks.", "Its hooks are set much deeper, below where seabirds and turtles feed.", "Its lines are nylon, which breaks down quickly if the gear is lost."], a: 0, hl: { panel: iPo },
    why: `Panel ${L(iPo)} shows <b>pole and line</b>: each fisher catches one fish at a time on a rod, so little is caught by mistake and it can be released. The <b>longline</b> in panel ${L(iLo)} has very many baited hooks left in the water, which also hook seabirds, turtles and sharks. Wooden rods are not the reason: the method is low-impact because it is selective. The pole-and-line hooks hang near the surface, and nylon line does not break down quickly.` });
  else if (iBe >= 0 && iPe >= 0) qs.push({ kind: "choice", q: `Panels <b>${L(iBe)}</b> and <b>${L(iPe)}</b> both show trawls. Why does the method in panel <b>${L(iBe)}</b> damage habitats far more than the method in panel <b>${L(iPe)}</b>?`,
    options: ["Its net is dragged along the seabed, crushing seabed life.", "Its net floats at the surface, so it shades the seabed below.", "Its net is towed in mid-water, so seabed animals swim up into it.", "Its mesh traps plankton, so the seabed animals that eat them starve."], a: 0, hl: { panel: iBe },
    why: `Panel ${L(iBe)} shows a <b>beam trawl</b>: its net is held open by a rigid beam and dragged along the seabed, crushing and burying seabed animals and destroying their habitat. The <b>pelagic trawl</b> in panel ${L(iPe)} is towed in mid-water, clear of the seabed. Trawls do not float at the surface, and plankton pass through the mesh of both nets.` });
  return qs;
}

function selfTest(F, qs) {
  const bad = [], ms = F.panels.map((p) => p.m), roles = [F.iX, F.iT, F.iY, F.iW];
  if (new Set(ms).size !== 4) bad.push("repeated method");
  if (ms.includes("gill") && ms.includes("drift")) bad.push("gill and drift together");
  if (new Set(roles).size !== 4) bad.push("roles");
  if (![F.iX, F.iT, F.iY].includes(F.iP) || !PARTQ[ms[F.iP]]) bad.push("part panel not revealed");
  if (F.iI === F.iT) bad.push("impact = description panel");
  // the impact answer is unique: its condition holds and the answer is in the set
  const I = IMPACTS.find((x) => x.id === F.imp); if (!I.has(ms) || ms.indexOf(I.ans(ms)) !== F.iI) bad.push("impact answer");
  if (F.imp === "select" && ms.filter((m) => LOWBY.includes(m)).length !== 1) bad.push("select not unique");
  // no method names or other text inside the drawings (only the panel letters and the footer)
  const sv = svg(F, {}), txt = [...sv.matchAll(/<text[^>]*>([^<]*)<\/text>/g)].map((m) => m[1]);
  if (txt.length !== 5 || txt.slice(0, 4).join("") !== "ABCD") bad.push("text in drawing " + txt.join("|"));
  for (const q of qs) {
    if (q.kind === "choice") { const ks = q.options[q.a].length; if (ks > Math.max(...q.options.filter((_, j) => j !== q.a).map((o) => o.length))) bad.push("key longest " + q.q.slice(0, 30)); }
    if (q.kind === "choice" && /Which fishing method/.test(q.q)) { const m = ms[LET.indexOf(q.q.match(/panel <b>(.)<\/b>/)[1])]; if (q.options[q.a] !== NAME[m]) bad.push("name key"); if (SIB[m] && q.options.includes(NAME[SIB[m]])) bad.push("sibling offered"); }
    if (q.kind === "tap" && q._parts) { if (q._parts.length < 3 || new Set(q._parts).size !== q._parts.length || !q._parts.includes(q.a[0])) bad.push("part taps"); }
    if (q.kind === "multi") { const m = ms[F.iM]; q.options.forEach((o, j) => { const s = ST.find((x) => x.t === o); if (!s) bad.push("unknown statement"); else if (s.x && s.x === cmpOf(ms)) bad.push("comparison give-away " + o); else if (s.T.includes(m) !== q.a.includes(j) || (!s.T.includes(m) && !s.F.includes(m))) bad.push("multi truth " + o); }); }
  }
  // the description tap: only one panel's method fits (descriptions are unique per method)
  if (new Set(Object.values(DESC)).size !== METHODS.length) bad.push("descriptions not unique");
  const mq = qs.find((q) => q.kind === "multi"); if (!mq) bad.push("no multi"); else { const gs = mq.options.map((o) => ST.find((x) => x.t === o).g).filter(Boolean); if (new Set(gs).size !== gs.length) bad.push("multi group repeated"); }
  const c = cmpOf(ms); if ((c === "pl" && F.imp === "select" && ms[F.iI] === "pole") || (c === "bp" && F.imp === "seabed")) bad.push("impact gives comparison away");
  if (qs.length < 5 || qs.length > 7) bad.push("question count " + qs.length);
  return bad;
}

export default {
  key: KEY, group: "Diagrams", name: "Fishing methods", topics: "Unit 6 (6.3)", thumbSeed: 3,
  blurb: "Side-view drawings of fishing gear: name each method from its shape, find its parts, and link it to its environmental impacts.",
  tips: ["Look at where the gear is: on the seabed (beam trawl, gill net, basket trap), in mid-water (pelagic trawl) or hanging from floats at the surface (drift net, purse seine, longline).",
    "Nets: a cone towed behind a boat is a trawl; a wall of net is a gill or drift net; a net closed underneath around a shoal is a purse seine; a round net thrown by one person is a cast net.",
    "Lines: one main line with very many hooks is a longline; a few lures pulled behind a moving boat is trolling; rods catching one fish at a time is pole and line.",
    "Impacts: beam trawls damage the seabed; purse seines and pelagic trawls take whole shoals; gill and drift nets entangle dolphins and turtles and become ghost nets; longlines hook seabirds and turtles. Pole and line, trolling, cast nets and traps are more selective."],
  ctx: () => "four fishing methods, A to D, drawn from the side",
  make, svg, questions, selfTest,
  css: `.fig-fishgear .fg-bg{fill:var(--surface)}.fig-fishgear .fg-frame{fill:none;stroke:var(--line);stroke-width:1.2}.fig-fishgear .fg-water{fill:color-mix(in srgb,var(--ink) 7%,transparent)}
.fig-fishgear .fg-surf{fill:none;stroke:currentColor;stroke-width:1.6}.fig-fishgear .fg-bedl{fill:none;stroke:currentColor;stroke-width:1.6}.fig-fishgear .fg-hatch{stroke:currentColor;stroke-width:.9;opacity:.65}
.fig-fishgear .fg-ln{fill:none;stroke:currentColor;stroke-width:1.5;stroke-linecap:round}.fig-fishgear .fg-thin{stroke-width:1.2}.fig-fishgear .fg-dash{stroke-dasharray:3 3}
.fig-fishgear .fg-thick{fill:none;stroke:currentColor;stroke-width:2.6;stroke-linecap:round}.fig-fishgear .fg-thick2{fill:none;stroke:currentColor;stroke-width:2;stroke-linecap:round}
.fig-fishgear .fg-beam{stroke:currentColor;stroke-width:5.5;stroke-linecap:round}.fig-fishgear .fg-rod{stroke:currentColor;stroke-width:2.2;stroke-linecap:round}
.fig-fishgear .fg-hull{fill:color-mix(in srgb,var(--ink) 28%,var(--surface));stroke:currentColor;stroke-width:1.4;stroke-linejoin:round}.fig-fishgear .fg-cab{fill:var(--surface);stroke:currentColor;stroke-width:1.2}
.fig-fishgear .fg-fill{fill:currentColor}.fig-fishgear .fg-float{fill:var(--surface);stroke:currentColor;stroke-width:1.3}
.fig-fishgear .fg-mesh{stroke:currentColor;stroke-width:.8;opacity:.85}.fig-fishgear .fg-netl{stroke:currentColor;stroke-width:1.3}.fig-fishgear .fg-funnel{stroke-width:1.6}
.fig-fishgear .fg-puff{fill:none;stroke:currentColor;stroke-width:1.1;stroke-dasharray:2 2}
.fig-fishgear .fg-let{font-size:22px;font-weight:800}.fig-fishgear .fg-sm{font-size:14px;opacity:.9}
.fig-fishgear .fg-hlp{fill:none;stroke:var(--app);stroke-width:4}.fig-fishgear .fg-hlw{fill:none;stroke:var(--accent);stroke-width:3;stroke-dasharray:7 5}.fig-fishgear .fg-hlpart{fill:color-mix(in srgb,var(--app) 45%,transparent);stroke:var(--app);stroke-width:2}`,
};
