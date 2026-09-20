// The Interactive Lab's menu. The nine packaged interactives come from the shared
// registry (interactivesRegistry.js) and are embedded as isolated iframes;
// greenhouse is still the native React component until it is packaged the same
// way. Kept as plain data (no JSX) so it stays unit-testable; InteractiveLab maps
// each key to either the iframe wrapper (kind "embed") or a native component
// (kind "native").
import { INTERACTIVES } from "./interactivesRegistry.js";

export const PACKAGED = INTERACTIVES.map((i) => ({
  key: i.slug,
  label: `${i.title} (Unit ${i.unit})`,
  kind: "embed",
}));

export const LAB_ITEMS = [
  ...PACKAGED,
  { key: "greenhouse", label: "Enhanced greenhouse effect (Unit 6)", kind: "native" },
];
