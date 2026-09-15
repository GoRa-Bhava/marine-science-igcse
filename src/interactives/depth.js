// Depth model for the Unit 2 "Effects of increasing depth" interactive (0697 2.5).
// Every number here is ILLUSTRATIVE — the syllabus marks the *pattern*, not the
// value (except that pressure "may be given" as ~1 atm per 10 m). The four
// driven quantities are light, pressure, temperature and dissolved oxygen;
// salinity is named by the syllabus but has no required depth pattern, so it is
// shown only as a note, never modelled here.

// Light zones (from 5.3, cross-referenced by 2.5/LO2), in metres.
export const SUNLIGHT_ZONE = 200;    // 0–200 m: light reaches, photosynthesis
export const TWILIGHT_ZONE = 1000;   // 200–1000 m: dim, no photosynthesis
export const MAX_DEPTH = 1200;

// Illustrative constants.
export const LIGHT_SCALE = 43;       // light% = 100·exp(−depth/43): ~1% by 200 m, ~0 by 1000 m
export const ATM_PER_M = 1 / 10;     // ~1 atm per 10 m (surface = 1 atm)
export const TEMP_DEEP = 4;          // °C, cold stable deep water
export const TEMP_SURFACE_EXTRA = 18;// warm surface layer adds up to +18 °C
export const TEMP_SCALE = 250;       // °C falls through the middle layer
export const O2_FLOOR = 0.35;        // relative O₂ never quite reaches zero here
export const O2_RANGE = 0.65;        // surface adds up to +0.65 (dissolves + photosynthesis)
export const O2_SCALE = 300;

// Light: decreases with depth (absorbed + scattered). 0..1 and 0..100 helpers.
export function lightLevel(depth) {
  return Math.exp(-Math.max(0, depth) / LIGHT_SCALE);
}
export function lightPercent(depth) {
  return 100 * lightLevel(depth);
}

// Pressure: increases with depth (weight of water above), ~1 atm per 10 m.
export function pressureAtm(depth) {
  return 1 + Math.max(0, depth) * ATM_PER_M;
}

// Temperature: warm at the surface, falls with depth, cold and stable deep.
export function temperatureC(depth) {
  return TEMP_DEEP + TEMP_SURFACE_EXTRA * Math.exp(-Math.max(0, depth) / TEMP_SCALE);
}
// 0..1 for the meter (1 warm surface → ~0 cold deep).
export function temperatureLevel(depth) {
  return (temperatureC(depth) - TEMP_DEEP) / TEMP_SURFACE_EXTRA;
}

// Dissolved oxygen: high at the surface, falls with depth. Kept RELATIVE
// (no mg/L) — high because it dissolves from the air and photosynthesis adds
// it; low deep because there is no photosynthesis and respiration/decomposition
// use it up with little mixing.
export function oxygenLevel(depth) {
  const v = O2_FLOOR + O2_RANGE * Math.exp(-Math.max(0, depth) / O2_SCALE);
  return Math.max(0, Math.min(1, v));
}
export function oxygenBand(depth) {
  const v = oxygenLevel(depth);
  if (v >= 0.75) return "High";
  if (v >= 0.5) return "Medium";
  return "Low";
}

export function zoneName(depth) {
  if (depth <= SUNLIGHT_ZONE) return "Sunlight zone";
  if (depth <= TWILIGHT_ZONE) return "Twilight zone";
  return "Midnight zone";
}

// Self-check: below the sunlight zone (no photosynthesis).
export function belowSunlightZone(depth) {
  return depth > SUNLIGHT_ZONE;
}
