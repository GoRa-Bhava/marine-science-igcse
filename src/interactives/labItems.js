// The Interactive Lab's menu. The nine packaged interactives come from the shared
// registry (interactivesRegistry.js); greenhouse is now packaged the same way as
// an isolated iframe embed. Kept as plain data (no JSX) so it stays unit-testable;
// InteractiveLab maps each key to the iframe wrapper (kind "embed").
import { INTERACTIVES } from "./interactivesRegistry.js";

export const PACKAGED = INTERACTIVES.map((i) => ({
  key: i.slug,
  label: `${i.title} (Unit ${i.unit})`,
  kind: "embed",
}));

export const LAB_ITEMS = [
  ...PACKAGED,
  { key: "greenhouse", label: "Enhanced greenhouse effect (Unit 6)", kind: "embed" },
];
