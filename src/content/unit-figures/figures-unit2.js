/* Picture questions batch 1, Unit 2 (Sea water). Existing art only.
   Same shapes as src/content/figures.js. Hotspots are points in the image's
   natural pixel space. G-U2-watercycle, -states, -convection and -elnino reuse
   F8, F10, F9 and F11 with their own hotspot sets. (PQ-U2-07 and its
   composite G-U2-solubility were removed in review: the picture was bolted on.) */

export const FIGURES_U2 = {
  "G-U2-watercycle": {
    art: { kind: "img", src: "figs/F8.jpg", w: 370, h: 262 },
    hotspots: [
      { id: "evap", x: 50, y: 150, label: "evaporation" },
      { id: "cond", x: 52, y: 86, label: "condensation" },
      { id: "precip", x: 268, y: 92, label: "precipitation" },
      { id: "runoff", x: 272, y: 176, label: "surface run-off" },
    ],
  },
  "G-U2-states": {
    art: { kind: "img", src: "figs/F10.jpg", w: 280, h: 310 },
    hotspots: [
      { id: "solid", x: 46, y: 130, label: "vibrate about fixed positions" },
      { id: "liquid", x: 140, y: 140, label: "move past one another" },
      { id: "gas", x: 234, y: 140, label: "move quickly in all directions" },
    ],
  },
  "G-U2-convection": {
    art: { kind: "img", src: "figs/F9.jpg", w: 260, h: 310 },
    hotspots: [
      { id: "heated", x: 128, y: 190, label: "just heated, least dense" },
      { id: "cooled", x: 72, y: 72, label: "cooled at the surface, denser" },
      { id: "sinking", x: 196, y: 158, label: "sinking, denser" },
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
    id: "PQ-U2-01", topic: "u2-water", type: "tap", tier: 2, ref: "2.1/LO5 · 2.1/LO7", fig: "G-U2-watercycle",
    q: "Tap the stage of the water cycle where a change of state gives out energy to the surroundings.",
    target: "cond",
    why: "Condensation: water vapour cools and turns into the liquid droplets that make up clouds, and changing from a gas to a liquid gives out energy. Evaporation from the sea is the opposite change, so it takes in energy (from the Sun), even though the vapour it makes is warm. Precipitation and surface run-off move water that is already liquid, so there is no change of state at those stages.",
  },
  {
    id: "PQ-U2-02", topic: "u2-water", type: "label", tier: 1, ref: "2.1/LO1", fig: "G-U2-states",
    q: "Each box shows the particles in one state of matter. Label each box with how its particles move.",
    extra: ["do not move at all", "move only when they are stirred"],
    why: "In a solid the particles are packed in a regular pattern and vibrate about fixed positions; they still move, so \"do not move at all\" is wrong. In a liquid they are close but irregular and move past one another, which is why a liquid flows. In a gas they are far apart and move quickly in all directions. Particles in every state move all the time; stirring is not needed.",
  },
  {
    id: "PQ-U2-03", topic: "u2-water", type: "tap", tier: 1, ref: "2.1/LO1", fig: "G-U2-states",
    q: "Tap the box that shows the state that is easily compressed.",
    target: "gas",
    why: "The gas: its particles are far apart with large spaces between them, so they can be pushed closer together. In the solid and the liquid the particles are already touching, so squeezing hardly changes their volume. A liquid can flow because its particles move past one another, but that does not make it easy to compress.",
  },
  // u2-density
  {
    id: "PQ-U2-04", topic: "u2-density", type: "tap", tier: 2, ref: "2.4/LO4 · 2.4/LO5", fig: "G-U2-convection",
    q: "The arrows show a convection current in water heated from below. Tap where the water is least dense.",
    target: "heated",
    why: "Just above the heat source. Heating gives the particles more kinetic energy, so they move further apart; the same mass takes up more volume, so the density falls and this water rises. At the surface the water loses heat, becomes denser, moves aside and sinks down the sides of the beaker, which is why the arrows point down there.",
  },
  // u2-elnino
  {
    id: "PQ-U2-05", topic: "u2-elnino", type: "tap", tier: 2, ref: "2.6/LO3", fig: "G-U2-elnino",
    q: "One of these panels shows an El Niño year. Tap the place where drought becomes more likely in that El Niño year.",
    target: "aus2",
    why: "Australia in panel 2. Panel 2 is the El Niño year: the trade winds have reversed and warm surface water has spread east across the Pacific. The rain moves east with the warm water, so Australia and Asia get less rain and drought becomes more likely. The South American coast gets more rain in an El Niño year, not drought. Panel 1 is a normal year, so its markers show usual conditions.",
  },
  {
    id: "PQ-U2-06", topic: "u2-elnino", type: "tap", tier: 2, ref: "2.6/LO3", fig: "G-U2-elnino",
    q: "One of these panels shows an El Niño year. Tap the place where heavy rain and flooding become more likely in that El Niño year.",
    target: "sam2",
    why: "The South American coast in panel 2. In the El Niño year warm surface water spreads to the eastern Pacific, more water evaporates from it, and rainfall rises on this coast, bringing flooding. The effects are opposite on the two sides of the Pacific: Australia becomes drier, not wetter. Panel 1 is a normal year, with no extra rain on this coast.",
  },
];
