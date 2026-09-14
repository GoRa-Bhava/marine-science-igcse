// Per-side hero illustrations under public/card-art/ and how each should be fitted.
// Generated from public/card-art/ + manifest.json (source of truth); regenerate
// when art changes. CARD_ART: a "<cardId>__<side>" key means the webp exists.
// FULL_FRAME: sides whose art is an edge-to-edge 4:3 scene (filled backdrop),
// rendered full-bleed with object-fit:cover; every other art side is a
// transparent cut-out and stays object-fit:contain. The component also keeps an
// onError fallback, so a listed key whose file goes missing degrades to the emblem.
export const CARD_ART = new Set([
  "cmp-detritivore-decomposer__a",
  "cmp-detritivore-decomposer__b",
  "cmp-dino-diatom__a",
  "cmp-dino-diatom__b",
  "cmp-fossil-renewable__a",
  "cmp-fossil-renewable__b",
  "cmp-nares-lateralline__a",
  "cmp-nares-lateralline__b",
  "cmp-open-closed-aquaculture__a",
  "cmp-open-closed-aquaculture__b",
  "cmp-pelagic-benthic__a",
  "cmp-pelagic-benthic__b",
  "cmp-pneumatophore-proproot__a",
  "cmp-pneumatophore-proproot__b",
  "cmp-resp-photo__a",
  "cmp-resp-photo__b",
  "cmp-respiration-gasexchange__a",
  "cmp-respiration-gasexchange__b",
  "cmp-sandy-muddy__a",
  "cmp-sandy-muddy__b",
  "cmp-seagrass-kelp__a",
  "cmp-seagrass-kelp__b",
  "cmp-sexual-asexual__a",
  "cmp-sexual-asexual__b",
  "cmp-solid-gas-solubility__a",
  "cmp-solid-gas-solubility__b",
  "cmp-sonar-radar__a",
  "cmp-sonar-radar__b",
]);

export const FULL_FRAME = new Set([
  "cmp-detritivore-decomposer__a",
  "cmp-detritivore-decomposer__b",
  "cmp-dino-diatom__a",
  "cmp-dino-diatom__b",
  "cmp-nares-lateralline__a",
  "cmp-nares-lateralline__b",
  "cmp-open-closed-aquaculture__b",
  "cmp-pelagic-benthic__a",
  "cmp-pelagic-benthic__b",
  "cmp-respiration-gasexchange__b",
  "cmp-seagrass-kelp__a",
  "cmp-seagrass-kelp__b",
  "cmp-sexual-asexual__a",
  "cmp-sexual-asexual__b",
  "cmp-solid-gas-solubility__a",
  "cmp-solid-gas-solubility__b",
  "cmp-sonar-radar__a",
  "cmp-sonar-radar__b",
]);

export function hasHeroArt(cardId, side) {
  return CARD_ART.has(`${cardId}__${side}`);
}

// "cover" for edge-to-edge scenes, "contain" for transparent cut-outs.
export function heroFit(cardId, side) {
  return FULL_FRAME.has(`${cardId}__${side}`) ? "cover" : "contain";
}
