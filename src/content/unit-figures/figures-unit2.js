/* Picture questions batch 1, Unit 2 (Sea water). Existing art only.
   Same shapes as src/content/figures.js. Hotspots are points in the image's
   natural pixel space. G-U2-states and -elnino reuse
   F10 and F11 with their own hotspot sets. (PQ-U2-07 and its
   composite G-U2-solubility were removed in review: the picture was bolted on.)
   Audit 10 Nov 2026: PQ-U2-04 and G-U2-convection retired, because F9 draws the
   surface arrows double-headed and pointing inwards (wrong circulation); restore
   on replacement art R-U2-01. The run-off hotspot moved off F8's double-headed
   arrow onto the single-headed river arrow.
   Batch 3 (10 Nov 2026): PQ-U2-01 moved to replacement art R-U2-02 and
   G-U2-watercycle (F8) deleted; PQ-U2-04 restored on R-U2-01-tap. Both figures
   and PQ-U2-04 are in figures-r-units1-3.js. */

export const FIGURES_U2 = {
  "G-U2-states": {
    art: { kind: "img", src: "figs/F10.jpg", w: 280, h: 310 },
    hotspots: [
      { id: "solid", x: 46, y: 130, label: "vibrate about fixed positions" },
      { id: "liquid", x: 140, y: 140, label: "move past one another" },
      { id: "gas", x: 234, y: 140, label: "move quickly in all directions" },
    ],
  },
  "G-U2-elnino": {
    art: { kind: "img", src: "figs/F11.jpg", w: 365, h: 310 },
    hotspots: [
      { id: "aus1", x: 72, y: 88, label: "Australia, normal year" },
      { id: "sam1", x: 334, y: 88, label: "South American coast, normal year" },
      { id: "aus2", x: 72, y: 194, label: "Australia, El Niño year" },
      { id: "sam2", x: 334, y: 186, label: "South American coast, El Niño year" },
    ],
  },
};

export const FIGURE_ITEMS_U2 = [
  // u2-water
  {
    id: "PQ-U2-01", topic: "u2-water", type: "tap", tier: 2, ref: "2.1/LO5 · 2.1/LO7", fig: "R-U2-02",
    q: "Tap the stage of the water cycle where a change of state gives out energy to the surroundings.",
    target: "cond",
    why: "Condensation: water vapour cools and turns into the liquid droplets that make up clouds, and changing from a gas to a liquid gives out energy. Evaporation from the sea is the opposite change, so it takes in energy (from the Sun), even though the vapour it makes is warm. Precipitation and surface run-off move water that is already liquid, so there is no change of state at those stages.",
  },
  {
    id: "PQ-U2-02", topic: "u2-water", type: "label", tier: 1, ref: "2.1/LO1", fig: "G-U2-states",
    q: "Each box shows the particles in one state of matter. Label each box with how its particles move.",
    extra: ["do not move at all", "move only when they are stirred"],
    why: "Box A is a solid: its particles are packed in a regular pattern and vibrate about fixed positions, so they still move and \"do not move at all\" is wrong. Box B is a liquid: its particles are close together but irregular and move past one another, which is why a liquid flows. Box C is a gas: its particles are far apart and move quickly in all directions, and particles in every state move all the time without being stirred.",
  },
  {
    id: "PQ-U2-03", topic: "u2-water", type: "tap", tier: 1, ref: "2.1/LO1", fig: "G-U2-states",
    q: "Tap the box that shows the state that is easily compressed.",
    target: "gas",
    why: "The gas: its particles are far apart with large spaces between them, so they can be pushed closer together. In the solid and the liquid the particles are already touching, so squeezing hardly changes their volume. A liquid can flow because its particles move past one another, but that does not make it easy to compress.",
  },
  // u2-elnino
  {
    id: "PQ-U2-05", topic: "u2-elnino", type: "tap", tier: 2, ref: "2.6/LO3", fig: "G-U2-elnino",
    q: "One of these panels shows an El Niño year. Tap the place where drought becomes more likely in that El Niño year.",
    target: "aus2",
    why: "Panel 2 is the El Niño year: the trade winds have reversed and warm surface water has spread east across the Pacific, taking the rain with it. So in panel 2 Australia (and Asia) gets less rain and drought becomes more likely, while the South American coast gets more rain, not drought. The panel 1 markers show a normal year, with usual conditions.",
  },
  {
    id: "PQ-U2-06", topic: "u2-elnino", type: "tap", tier: 2, ref: "2.6/LO3", fig: "G-U2-elnino",
    q: "One of these panels shows an El Niño year. Tap the place where heavy rain and flooding become more likely in that El Niño year.",
    target: "sam2",
    why: "In the El Niño year (panel 2) warm surface water spreads to the eastern Pacific, more water evaporates from it, and rainfall rises on the South American coast, bringing flooding. The effects are opposite on the two sides of the Pacific, so Australia becomes drier, not wetter. Panel 1 is a normal year, with no extra rain on this coast.",
  },
];
