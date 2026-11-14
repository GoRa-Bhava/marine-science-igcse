/* Picture questions batch 1, Unit 2 (Sea water). Existing art only.
   Same shapes as src/content/figures.js. Hotspots are points in the image's
   natural pixel space. G-U2-elnino reuses F11; G-U2-states was redrawn as an
   SVG on 14 Nov 2026 (F10 was blurry). (PQ-U2-07 and its
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
    art: { kind: "svg", svg: "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 300 250\" role=\"img\" aria-label=\"Three boxes, A, B and C, each showing the arrangement of particles in one state of matter\" style=\"max-width:100%;height:auto;font-family:system-ui,sans-serif\"><defs><radialGradient id=\"gu2st-p\" cx=\"0.35\" cy=\"0.35\" r=\"0.7\"><stop offset=\"0\" stop-color=\"#9cc8f0\"/><stop offset=\"0.55\" stop-color=\"#3f86cc\"/><stop offset=\"1\" stop-color=\"#1f5a99\"/></radialGradient></defs><rect x=\"0\" y=\"0\" width=\"300\" height=\"250\" fill=\"#ffffff\"/><text x=\"54.0\" y=\"44\" text-anchor=\"middle\" font-size=\"22\" font-weight=\"700\" fill=\"#12242F\">A</text><rect x=\"8\" y=\"60\" width=\"92\" height=\"170\" fill=\"#ffffff\" stroke=\"#12242F\" stroke-width=\"1.6\"/><circle cx=\"22.0\" cy=\"221.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"38.0\" cy=\"221.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"54.0\" cy=\"221.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"70.0\" cy=\"221.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"86.0\" cy=\"221.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"22.0\" cy=\"205.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"38.0\" cy=\"205.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"54.0\" cy=\"205.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"70.0\" cy=\"205.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"86.0\" cy=\"205.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"22.0\" cy=\"189.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"38.0\" cy=\"189.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"54.0\" cy=\"189.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"70.0\" cy=\"189.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"86.0\" cy=\"189.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"22.0\" cy=\"173.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"38.0\" cy=\"173.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"54.0\" cy=\"173.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"70.0\" cy=\"173.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"86.0\" cy=\"173.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"22.0\" cy=\"157.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"38.0\" cy=\"157.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"54.0\" cy=\"157.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"70.0\" cy=\"157.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"86.0\" cy=\"157.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><text x=\"150.0\" y=\"44\" text-anchor=\"middle\" font-size=\"22\" font-weight=\"700\" fill=\"#12242F\">B</text><rect x=\"104\" y=\"60\" width=\"92\" height=\"170\" fill=\"#ffffff\" stroke=\"#12242F\" stroke-width=\"1.6\"/><circle cx=\"137.7\" cy=\"221.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"176.3\" cy=\"221.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"159.4\" cy=\"221.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"117.0\" cy=\"221.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"148.5\" cy=\"209.2\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"126.3\" cy=\"208.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"168.2\" cy=\"207.2\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"183.9\" cy=\"204.5\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"115.9\" cy=\"195.9\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"139.1\" cy=\"196.2\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"156.1\" cy=\"195.1\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"172.4\" cy=\"191.8\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"128.0\" cy=\"184.7\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"146.3\" cy=\"182.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"184.5\" cy=\"181.3\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"165.7\" cy=\"177.2\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"116.6\" cy=\"173.4\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"133.5\" cy=\"169.7\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"152.2\" cy=\"167.1\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"178.5\" cy=\"166.4\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"122.0\" cy=\"158.3\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"164.2\" cy=\"156.5\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"142.2\" cy=\"154.6\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"183.9\" cy=\"151.4\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"154.4\" cy=\"143.9\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><text x=\"246.0\" y=\"44\" text-anchor=\"middle\" font-size=\"22\" font-weight=\"700\" fill=\"#12242F\">C</text><rect x=\"200\" y=\"60\" width=\"92\" height=\"170\" fill=\"#ffffff\" stroke=\"#12242F\" stroke-width=\"1.6\"/><circle cx=\"220.0\" cy=\"86.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"264.0\" cy=\"78.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"242.0\" cy=\"116.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"278.0\" cy=\"124.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"216.0\" cy=\"152.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"254.0\" cy=\"162.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"282.0\" cy=\"182.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"228.0\" cy=\"204.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/><circle cx=\"266.0\" cy=\"214.0\" r=\"7.6\" fill=\"url(#gu2st-p)\" stroke=\"#173f6b\" stroke-width=\"0.8\"/></svg>" },
    hotspots: [
      { id: "solid", x: 54, y: 189, label: "vibrate about fixed positions" },
      { id: "liquid", x: 150, y: 200, label: "move past one another" },
      { id: "gas", x: 246, y: 145, label: "move quickly in all directions" },
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
