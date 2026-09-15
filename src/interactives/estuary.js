// Estuary tidal model for Unit 5 (0697 5.6/LO2), cross-checked with 2.2/LO11.
// Driver is the tide state 0 (low) → 100 (high) at a fixed mid-estuary point.
// The syllabus lists salinity, temperature and dissolved oxygen but NOT the
// directions; the directions here follow the coursebook + 2.2/2.3 reasoning.
// FLAG: the dissolved-oxygen direction is the least mark-scheme-certain — keep
// it reasoning-based, not a hard fact, and no numbers. All values are relative
// (0..1) and illustrative; the syllabus forbids numerical ranges.

const clamp01 = (v) => Math.max(0, Math.min(1, v));

export const LOW_TIDE = 10;
export const HIGH_TIDE = 90;

// Salinity RISES toward high tide (sea water pushes in); brackish/fresh at low
// tide (river water dominates).
export function salinityLevel(tide) {
  return clamp01(tide / 100);
}
export function salinityBand(tide) {
  if (tide >= HIGH_TIDE) return "Salty (sea water)";
  if (tide <= 15) return "Fresh–brackish";
  return "Brackish";
}

// Temperature: the point is STABILITY. Swing is wide at low tide (shallow water
// + exposed mud follow the air) and narrows toward high tide (a large volume of
// sea water buffers it). We model the SWING, which DECREASES with tide.
export function temperatureSwing(tide) {
  return clamp01(1 - tide / 100);
}
export function temperatureStabilityBand(tide) {
  if (tide >= 80) return "Steady (sea-buffered)";
  if (tide <= 25) return "Swings with the air";
  return "Fairly steady";
}

// Dissolved oxygen: relative, RISES toward high tide (oxygen-rich sea water
// mixes in; at low tide shallow warm water + waterlogged mud hold less).
// Least certain — kept relative, no mg/L.
export function oxygenLevel(tide) {
  return clamp01(0.4 + 0.6 * (tide / 100));
}
export function oxygenBand(tide) {
  if (tide >= 80) return "Higher";
  if (tide <= 25) return "Lower";
  return "Moderate";
}

export function tideName(tide) {
  if (tide <= LOW_TIDE) return "Low tide";
  if (tide >= HIGH_TIDE) return "High tide";
  return "Mid-tide";
}

// Self-check: the estuary is saltiest at high tide (the #1 misconception is that
// it's saltiest at low tide "from evaporation").
export function saltiest(tide) {
  return tide >= HIGH_TIDE;
}
