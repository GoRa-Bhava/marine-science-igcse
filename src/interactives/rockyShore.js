// Rocky-shore zonation model for Unit 5 (0697 5.4). The tide line moves between
// a fixed low-tide mark and high-tide mark; organisms are exposed to air above
// it and submerged below it. Zonation is limited UP-shore by exposure to air
// (drying) and DOWN-shore by predation — never by competition. Only 5.4/LO2
// factors are used here; salinity, light and pH must never appear.

const clamp01 = (v) => Math.max(0, Math.min(1, v));

// Shore heights on a 0 (deep subtidal) .. 100 (top supratidal) scale.
export const LOW_MARK = 30;    // low-tide mark: below it = subtidal (always wet)
export const HIGH_MARK = 70;   // high-tide mark: above it = supratidal (spray only)

// Tide thresholds where the two dynamic stress states flip.
export const ANEMONE_DRIES_BELOW = 35;   // pool can no longer keep it wet
export const MUSSEL_PREDATED_ABOVE = 75; // starfish reaches the submerged mussel

// Allowed 5.4/LO2 factors (for the data-only test); the forbidden ones must not
// appear anywhere in this interactive.
export const FACTORS = [
  "exposure to air", "wave action", "oxygen", "air temperature", "water temperature",
  "predation", "food availability",
];
export const FORBIDDEN_FACTORS = ["salinity", "light", "pH"];

// Characteristic shore heights (and scene x, for drawing).
export const ORGANISMS = [
  { id: "limpet", name: "Limpet", height: 60, x: 120 },
  { id: "anemone", name: "Sea anemone", height: 50, x: 176, pool: true },
  { id: "fucus", name: "Fucus", height: 46, x: 150 },
  { id: "mussel", name: "Mussel", height: 40, x: 134 },
  { id: "starfish", name: "Starfish", height: 20, x: 150, predator: true },
];

export function waterHeight(tide) {
  return LOW_MARK + clamp01(tide / 100) * (HIGH_MARK - LOW_MARK);
}

// Fraction (0..1) of the intertidal band currently above the water line.
export function intertidalExposed(tide) {
  return clamp01((HIGH_MARK - waterHeight(tide)) / (HIGH_MARK - LOW_MARK));
}

const heightOf = (id) => (ORGANISMS.find((o) => o.id === id) || {}).height;

export function isExposed(id, tide) {
  return heightOf(id) > waterHeight(tide);
}

// State for one organism at the current tide: exposed?, stressed? and why.
export function organismState(id, tide) {
  const exposed = isExposed(id, tide);
  switch (id) {
    case "limpet":
      return { exposed, stressed: false,
        note: exposed ? "clamps its shell shut to hold water in" : "grazing on the wet rock" };
    case "fucus":
      return { exposed, stressed: false,
        note: exposed ? "leathery fronds resist drying; holdfast grips the rock" : "swaying in the current" };
    case "anemone": {
      const stressed = tide < ANEMONE_DRIES_BELOW;
      return { exposed, stressed,
        note: stressed ? "drying out — exposed beyond what its pool can hold"
          : exposed ? "staying wet in its rock pool" : "tentacles out, feeding" };
    }
    case "mussel": {
      const stressed = tide >= MUSSEL_PREDATED_ABOVE;
      return { exposed, stressed,
        note: stressed ? "the starfish reaches it under water"
          : exposed ? "shell closed against drying" : "filter-feeding under water" };
    }
    case "starfish":
      return { exposed: false, stressed: false,
        note: tide >= MUSSEL_PREDATED_ABOVE ? "reaching the mussels as the tide covers them" : "on the submerged lower shore" };
    default:
      return { exposed, stressed: false, note: "" };
  }
}

// Count of organisms currently beyond their tolerance (greyed out).
export function underStress(tide) {
  return ORGANISMS.filter((o) => organismState(o.id, tide).stressed).length;
}

// The limit to name in the caption for whatever is currently stressed.
export function stressCaption(tide) {
  if (organismState("anemone", tide).stressed) return "Anemone drying out — the up-shore limit is exposure to air.";
  if (organismState("mussel", tide).stressed) return "Starfish reaching the mussel — the down-shore limit is predation.";
  return "All coping — mid-shore conditions suit them.";
}

// Self-check: expose the whole intertidal at low tide.
export function intertidalExposedAtLowTide(tide) {
  return tide <= 10;
}
