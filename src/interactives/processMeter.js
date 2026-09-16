// Process-chain-with-a-meter model for two Unit 6 chains:
//   A. Eutrophication — the dissolved-oxygen crash (6.7 / LO5). Non-monotonic:
//      oxygen RISES during the living bloom, then CRASHES when decomposers break
//      the dead bloom down and use the oxygen up.
//   B. Enhanced greenhouse effect — the heat trap (6.8 / LO2). Monotonic:
//      more greenhouse gas traps more of the OUTGOING heat, so temperature rises.
//      Incoming sunlight is never blocked.
//
// Every value is illustrative (no numbers are shown to the learner); the syllabus
// marks the shape of each curve and the reasoning, not the figures.

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smooth = (t) => { const x = clamp(t, 0, 1); return x * x * (3 - 2 * x); };

// ---- A. Eutrophication: dissolved oxygen ----
// Rises as the living algae photosynthesise (0 -> ~30), plateaus at the bloom's
// peak, then crashes as decomposers respire (from ~45 on). Ends well below the
// start: the paradox that "more algae" ends in less oxygen.
export function oxygenLevel(v) {
  const x = clamp(v, 0, 100);
  const rise = smooth(x / 30);        // bloom grows and photosynthesises
  const crash = smooth((x - 45) / 45); // dead bloom decomposed by respiring bacteria
  return clamp(0.45 + 0.5 * rise - 0.82 * crash, 0.08, 1);
}

export function oxygenMeter(v) {
  const level = oxygenLevel(v);
  let text;
  let state;
  if (v < 20) { text = "Normal — before the bloom."; state = "calm"; }
  else if (v < 45) { text = "Rising — the living algae are photosynthesising."; state = "rise"; }
  else if (v < 70) { text = "Falling — the bloom has died and decomposers are using up the oxygen."; state = "fall"; }
  else { text = "Very low — animals that need oxygen suffocate."; state = "crisis"; }
  return { level, text, state };
}

export const EUTRO_STAGES = [
  { at: 0, label: "More nutrients", note: "Fertiliser run-off or untreated sewage adds nitrates and phosphates." },
  { at: 22, label: "Algal bloom", note: "Producers grow fast; while alive they photosynthesise, so dissolved oxygen rises." },
  { at: 45, label: "The bloom dies", note: "The algae die off." },
  { at: 63, label: "Decomposers respire", note: "Bacteria multiply and break down the dead algae; their aerobic respiration uses up oxygen faster than it is replaced, so oxygen falls." },
  { at: 85, label: "Animals suffocate", note: "Animals that need oxygen die — from the lack of oxygen, not from the algae themselves." },
];

export const EUTRO_CAPTION =
  "Living algae make oxygen — so it rises during the bloom. But when the bloom dies, the decomposers breaking it down use up the oxygen faster than it's replaced, so it crashes and the animals suffocate.";

// Self-check: the fish die AFTER the bloom, when it decomposes.
export const EUTRO_ANSWER = "after";

// ---- B. Enhanced greenhouse effect: temperature (heat retained) ----
// Monotonically increasing with emissions: more gas traps more outgoing heat.
export function temperatureLevel(v) {
  const x = clamp(v, 0, 100) / 100;
  return clamp(0.12 + 0.8 * x, 0, 1);
}

export function temperatureMeter(v) {
  const level = temperatureLevel(v);
  let text;
  let state;
  if (v < 25) { text = "Baseline warmth."; state = "calm"; }
  else if (v < 60) { text = "Warming — more of the outgoing heat is trapped."; state = "warm"; }
  else { text = "Hotter — the enhanced greenhouse effect drives climate change."; state = "hot"; }
  return { level, text, state };
}

export const GREENHOUSE_STAGES = [
  { at: 0, label: "Emissions released", note: "Human activity releases carbon dioxide and methane — greenhouse gases." },
  { at: 30, label: "Outgoing heat trapped", note: "Sunlight still comes in freely; it is the heat radiated back from the surface that the gases hold in." },
  { at: 60, label: "More gas, more heat", note: "More greenhouse gas traps more of the outgoing heat — the enhanced greenhouse effect." },
  { at: 85, label: "Warming & climate change", note: "Rising temperatures drive climate change." },
];

export const GREENHOUSE_CAPTION =
  "Greenhouse gases let the Sun's rays in freely — they don't block incoming sunlight. What they trap is the heat radiated back from the surface, and more gas traps more of it, so the temperature climbs.";

// Self-check: no, greenhouse gases do not work by blocking incoming sunlight.
export const GREENHOUSE_ANSWER = "no";

// The stage the driver has reached (highest `at` not greater than the value).
export function currentStageIndex(stages, v) {
  let idx = 0;
  for (let i = 0; i < stages.length; i++) if (v >= stages[i].at) idx = i;
  return idx;
}
