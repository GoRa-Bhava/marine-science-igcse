// Per-side hero illustrations that exist under public/card-art/.
// A "<cardId>__<side>" key means card-art/<cardId>__<side>.webp is bundled.
// Generated from public/card-art/*.webp (source of truth); regenerate when art
// is added or removed. The component also keeps an onError fallback, so a key
// listed here whose file later goes missing still degrades to the emblem.
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

export function hasHeroArt(cardId, side) {
  return CARD_ART.has(`${cardId}__${side}`);
}
