// Melt-two-tanks model (0697 2.1/LO6 practical + 6.8/LO5 climate). Two tanks:
// FLOATING ice never changes the water level (it already displaces its own mass
// of water, so its meltwater just replaces it); LAND ice raises the level as its
// meltwater is added. Values are a qualitative SHAPE only — no real figures are
// shown (the syllabus forbids numbers here). Levels are % of tank height.

const clamp = (v) => Math.max(0, Math.min(100, v));

export const REFERENCE_LEVEL = 50;  // baseline water level (shared reference line)
export const MAX_RISE = 18;         // illustrative rise shape at full melt (never displayed)

// Floating tank: the water level is CONSTANT — melting changes nothing.
export function floatingLevel(_melt) {
  return REFERENCE_LEVEL;
}

// Land tank: the water level RISES as the land ice melts and adds water.
export function landLevel(melt) {
  return REFERENCE_LEVEL + (clamp(melt) / 100) * MAX_RISE;
}

// Fraction of ice remaining, 1 (frozen) → 0 (fully melted); shrinks the blocks.
export function iceRemaining(melt) {
  return 1 - clamp(melt) / 100;
}

// Self-check: which melting ice raises the sea? Land ice does.
export const ANSWER = "land";
export function raisesSea(choice) {
  return choice === ANSWER;
}
