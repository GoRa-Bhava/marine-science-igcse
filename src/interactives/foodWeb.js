// Food-web removal model for the Unit 4 "predict the effect of removing an
// organism" interactive (0697 4.4 / LO4).
//
// A food web shows the transfer of energy; arrows point from the eaten to the
// eater (energy direction) and a chain starts with a producer. The mark-earning
// reasoning modelled here: removing an organism affects the organisms ABOVE it
// (that fed on it), not those below; and an organism with two food sources is
// buffered against losing one.
//
// Deliberately NOT modelled (out of scope / forbidden): population maths, prey
// "booming" when a predator is removed (a trophic cascade), and the terms
// keystone/cascade. Effects here are only "lost all its food -> declines".

// Nodes, laid out by trophic level (producer at the base). x/y are SVG scene
// coordinates (viewBox 600 x 440); role "producer" makes its own food and so
// never declines from losing prey.
export const NODES = [
  { id: "diatoms", label: "Diatoms", role: "producer", note: "producer", x: 300, y: 384 },
  { id: "zooplankton", label: "Zooplankton", x: 158, y: 286 },
  { id: "mussels", label: "Mussels", x: 442, y: 286 },
  { id: "herring", label: "Herring", x: 158, y: 188 },
  { id: "crab", label: "Crab", x: 442, y: 188 },
  { id: "seal", label: "Seal", x: 120, y: 78 },
  { id: "seabird", label: "Seabird", x: 404, y: 78 },
];

// Edges are [eaten, eater] — arrows point in the direction energy flows.
export const EDGES = [
  ["diatoms", "zooplankton"],
  ["diatoms", "mussels"],
  ["zooplankton", "herring"],
  ["mussels", "crab"],
  ["herring", "seal"],
  ["herring", "seabird"],
  ["crab", "seabird"],
];

export const NODE_BY_ID = Object.fromEntries(NODES.map((n) => [n.id, n]));

// The organisms a given node eats (its food sources).
export function foodSources(id) {
  return EDGES.filter(([, eater]) => eater === id).map(([prey]) => prey);
}

// The organisms that eat a given node (used only for captions).
export function consumers(id) {
  return EDGES.filter(([prey]) => prey === id).map(([, eater]) => eater);
}

function isProducer(id) {
  return NODE_BY_ID[id]?.role === "producer";
}

// State of every node given a set of removed ids. A node is:
//  - "removed"  : the user took it out.
//  - "declined" : not a producer, still present, but every food source is gone
//                 (removed, or itself declined) — it has lost all its food.
//  - "lit"      : still has at least one food source (buffered), or is a
//                 producer, or is below the removed node (unaffected).
// Nothing ever increases — losing food only ever makes an organism decline.
export function webState(removed) {
  const removedSet = removed instanceof Set ? removed : new Set(removed);
  const memo = new Map();
  // gone(id) === true when the organism is removed or has declined. Acyclic web,
  // so the recursion terminates without a visited guard.
  const gone = (id) => {
    if (removedSet.has(id)) return true;
    if (memo.has(id)) return memo.get(id);
    const src = foodSources(id);
    if (src.length === 0) { memo.set(id, false); return false; } // producer base
    const all = src.every(gone);
    memo.set(id, all);
    return all;
  };
  const state = {};
  for (const n of NODES) {
    if (removedSet.has(n.id)) state[n.id] = "removed";
    else state[n.id] = gone(n.id) ? "declined" : "lit";
  }
  return state;
}

// How many organisms have faded (declined). Removed nodes are not counted as
// "affected" — the count is the knock-on, not the removal itself.
export function affectedCount(removed) {
  const state = webState(removed);
  return Object.values(state).filter((v) => v === "declined").length;
}

// True when an arrow's link is broken because the prey it starts from is gone.
export function edgeBroken(prey, removed) {
  const state = webState(removed);
  return state[prey] === "removed" || state[prey] === "declined";
}

// Vetted captions. Single-organism removals are the teaching cases (4.4/LO4);
// each names the "lost all its food -> declines" vs "still has food -> copes"
// reasoning explicitly. No booming, no cascade, no numbers.
const SINGLE_CAPTIONS = {
  diatoms:
    "Diatoms removed — the producer is the base of the whole web, so zooplankton and mussels lose their only food and everything above them declines.",
  zooplankton:
    "Zooplankton removed — herring lose their only food and decline, so the seal (which eats only herring) declines too; the seabird still eats crabs, so it copes.",
  mussels:
    "Mussels removed — crabs lose their only food and decline; the seabird still eats herring, so it copes. Nothing below the mussels is affected.",
  herring:
    "Herring removed — the seal loses its only food and declines; the seabird still eats crabs, so it copes.",
  crab:
    "Crab removed — the seabird still eats herring, so it copes; the mussels the crab fed on are unaffected.",
  seal:
    "Seal removed — it is a top predator, so nothing it fed on is affected.",
  seabird:
    "Seabird removed — it is a top predator, so removing it leaves the rest of the web unaffected.",
};

export function caption(removed) {
  const list = [...(removed instanceof Set ? removed : new Set(removed))];
  if (list.length === 0) return "Tap a species to remove it, then trace the knock-on effects up the web.";
  if (list.length === 1) return SINGLE_CAPTIONS[list[0]];
  return "Several organisms removed — those that lost all their food have faded; those with another food source cope. Organisms below a removal are unaffected.";
}

// Self-check (learn-layer only): removing the herring, does the seabird survive?
// Yes — it also eats crabs, so losing one food source does not starve it.
export const SEABIRD_SURVIVES_HERRING_REMOVED = true;
export function seabirdSurvivesWithoutHerring() {
  return webState(["herring"]).seabird === "lit";
}
