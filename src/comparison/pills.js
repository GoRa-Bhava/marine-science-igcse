// Short labels for the comparison-card pill selector (one pill per comparison).
// Kept separate from the card data so the labels are pure, testable, and easy to
// reword without touching the vetted content. Wording follows the layout brief;
// cmp-resp-photo is flipped to match its card title order ("Respiration vs …").
export const PILL_LABELS = {
  "cmp-resp-photo": "Respiration vs Photosynthesis",
  "cmp-seagrass-kelp": "Seagrass vs Kelp",
  "cmp-dino-diatom": "Dinoflagellate vs Diatom",
  "cmp-sonar-radar": "Sonar vs Radar",
  "cmp-sandy-muddy": "Sandy vs Muddy shore",
  "cmp-fossil-renewable": "Fossil fuels vs Renewables",
  "cmp-open-closed-aquaculture": "Open vs Closed farm",
  "cmp-solid-gas-solubility": "Solids vs Gases dissolving",
  "cmp-sexual-asexual": "Sexual vs Asexual",
  "cmp-nares-lateralline": "Nares vs Lateral line",
  "cmp-detritivore-decomposer": "Detritivore vs Decomposer",
  "cmp-respiration-gasexchange": "Respiration vs Gas exchange",
  "cmp-pelagic-benthic": "Pelagic vs Benthic",
  "cmp-pneumatophore-proproot": "Pneumatophores vs Prop roots",
};

export function pillLabel(cardId) {
  return PILL_LABELS[cardId] || cardId;
}

// Which side (0-based) the horizontal snap-scroller is currently resting on,
// mapping the scroll range [0, scrollWidth - clientWidth] onto [0, count - 1].
// Robust to the inter-slide gap and the edge-peek (no per-slide width needed).
export function sideIndexFromScroll(scrollLeft, scrollWidth, clientWidth, count) {
  const max = scrollWidth - clientWidth;
  if (max <= 0 || count <= 1) return 0;
  const frac = Math.min(1, Math.max(0, scrollLeft / max));
  return Math.round(frac * (count - 1));
}
