/* Units 1-3 picture questions, batch 3: replacement art (R codes), 10 Nov 2026.
   Shape as src/content/figures.js:
     FIGURES[id] = { art: { kind: "img", src, w, h }, hotspots: [{ id, x, y, label }] }
   Hotspots are points in the image's natural pixels. Choice figures carry no hotspots (static render).
   These figure entries replace F1, F8, F9 (figures.js) and G-U1-oceans-med, G-U2-watercycle, G-U3-plantcell,
   G-U3-seagrass, G-U3-fish and G-U3-kelp (figures-unit1..3.js). The live items that move here keep their
   ids and stay in their own files (figures-unit1..3.js; FQ items via FQ-repoint-u1-3.json); this file holds
   the figure entries and the four new items. The app merges all FIGURES objects, so the cross-file fig
   references resolve at run time.
   Art: R-U1-01 reuses figs-units/P-U1-02.webp (no separate file); R-U1-02 is the app-coastline map, cropped
   to the map and ringed round the Mediterranean in code (raw file in batch3/src-art/R-U1-02.webp); the rest
   are the delivered ChatGPT files as converted. Composites that take these panels (G-U3-cells3, -domains,
   -kingdoms, -grasskelp, -fishhead) keep their ids in figures-unit3.js (tools/build-r-units1-3.py). */

const IMG = (code, w, h) => ({ kind: "img", src: `figs-units/${code}.webp`, w, h });

export const FIGURES_R13 = {
  /* ---------------- Unit 1 ---------------- */
  // Earth cut-away with a solid mantle (P-U1-02's file). F1's hotspot ids, so FQ1 and FQ2 move without edits;
  // the points match P-U1-02 / P-U1-02-layers (crust on the left cut-face rim, away from the volcano).
  "R-U1-01": { art: { kind: "img", src: "figs-units/P-U1-02.webp", w: 800, h: 800 }, hotspots: [
    { id: "crust", x: 233, y: 450, label: "crust" },
    { id: "mantle", x: 660, y: 330, label: "mantle" },
    { id: "outer", x: 440, y: 285, label: "outer core" },
    { id: "inner", x: 400, y: 400, label: "inner core" },
  ] },
  // world map centred on 0 degrees, whole Mediterranean ringed (choice: no hotspots)
  "R-U1-02": { art: IMG("R-U1-02", 1150, 589), hotspots: [] },

  /* ---------------- Unit 2 ---------------- */
  // convection current in a beaker heated under the centre of its base: four steps (FQ14's label item)
  "R-U2-01": { art: IMG("R-U2-01", 800, 800), hotspots: [
    { id: "heated", x: 400, y: 447, label: "heated, expands, less dense" },
    { id: "rises", x: 400, y: 300, label: "rises" },
    { id: "cools", x: 505, y: 172, label: "cools at the surface, denser" },
    { id: "sinks", x: 210, y: 272, label: "sinks" },
  ] },
  // same art, three points only: no marker on the rising arrow, which would be a defensible second
  // answer to "least dense" (PQ-U2-04)
  "R-U2-01-tap": { art: IMG("R-U2-01", 800, 800), hotspots: [
    { id: "heated", x: 400, y: 447, label: "just heated, least dense" },
    { id: "cools", x: 505, y: 172, label: "cooled at the surface, denser" },
    { id: "sinks", x: 210, y: 272, label: "sinking, denser" },
  ] },
  // water cycle: sea, Sun, small cloud, wind arrow, rain cloud over a mountain, river back to the sea
  "R-U2-02": { art: IMG("R-U2-02", 1200, 800), hotspots: [
    { id: "evap", x: 180, y: 440, label: "evaporation" },
    { id: "cond", x: 228, y: 245, label: "condensation" },
    { id: "precip", x: 830, y: 268, label: "precipitation" },
    { id: "runoff", x: 700, y: 535, label: "surface run-off" },
  ] },

  /* ---------------- Unit 3 ---------------- */
  // plant cell with all seven 3.1/LO1 structures. Wall marker on the left band, membrane marker on the
  // bottom line (different sides: the two are adjacent), cytoplasm in the clear top-right patch.
  "R-U3-01": { art: IMG("R-U3-01", 800, 800), hotspots: [
    { id: "cell-wall", x: 72, y: 380, label: "cell wall" },
    { id: "cell-membrane", x: 465, y: 614, label: "cell membrane" },
    { id: "cytoplasm", x: 640, y: 250, label: "cytoplasm" },
    { id: "nucleus", x: 640, y: 385, label: "nucleus" },
    { id: "chloroplast", x: 380, y: 207, label: "chloroplast" },
    { id: "vacuole", x: 360, y: 395, label: "vacuole" },
    { id: "mitochondrion", x: 153, y: 565, label: "mitochondrion" },
  ] },
  // rod-shaped bacterial cell: wall, membrane and cytoplasm only (no genetic material drawn, by the
  // syllabus limited-to list). Wall on the top band, membrane on the bottom line, cytoplasm at the left end.
  "R-U3-03": { art: IMG("R-U3-03", 800, 800), hotspots: [
    { id: "cell-wall", x: 300, y: 300, label: "cell wall" },
    { id: "cell-membrane", x: 520, y: 512, label: "cell membrane" },
    { id: "cytoplasm", x: 135, y: 410, label: "cytoplasm" },
  ] },
  // seagrass in a sediment cut-away: three plants on one rhizome, flower cluster on its own tall stalk
  "R-U3-04": { art: IMG("R-U3-04", 800, 800), hotspots: [
    { id: "leaf", x: 112, y: 130, label: "leaf" },
    { id: "flower", x: 490, y: 125, label: "flower" },
    { id: "rhizome", x: 255, y: 549, label: "rhizome (underground stem)" },
    { id: "roots", x: 640, y: 632, label: "roots" },
  ] },
  // photo-real snapper-type bony fish, side-on facing left. The nares are about 2.5 px each at 390 px, so
  // the nares tap (U3-D05) stays on the head crop G-U3-fishhead; the label item keeps the nares marker.
  "R-U3-05": { art: IMG("R-U3-05", 1200, 800), hotspots: [
    { id: "nares", x: 155, y: 372, label: "nares (nostrils)" },
    { id: "operculum", x: 318, y: 410, label: "operculum (gill cover)" },
    { id: "pectoral-fin", x: 470, y: 398, label: "pectoral fin" },
    { id: "scales", x: 600, y: 445, label: "scales" },
    { id: "lateral-line", x: 690, y: 336, label: "lateral line" },
    { id: "dorsal-fin", x: 600, y: 212, label: "dorsal fin" },
    { id: "caudal-fin", x: 990, y: 320, label: "caudal (tail) fin" },
    { id: "anal-fin", x: 750, y: 515, label: "anal fin" },
    { id: "pelvic-fin", x: 420, y: 578, label: "pelvic fin" },
  ] },
  // photo-real young kelp on one boulder: claw-like holdfast, one stipe, bladders where the blades join it
  "R-U3-06": { art: IMG("R-U3-06", 800, 800), hotspots: [
    { id: "blade", x: 190, y: 95, label: "blade" },
    { id: "gas-bladder", x: 533, y: 390, label: "gas bladder" },
    { id: "stipe", x: 493, y: 510, label: "stipe" },
    { id: "holdfast", x: 450, y: 695, label: "holdfast" },
  ] },
};

export const FIGURE_ITEMS_R13 = [
  /* ---------------- u2-density ---------------- */
  // restored with its original id (retired at audit on F9)
  { id: "PQ-U2-04", topic: "u2-density", type: "tap", tier: 2, ref: "2.4/LO4 · 2.4/LO5", fig: "R-U2-01-tap",
    q: "The arrows show a convection current in water heated from below. Tap where the water is least dense.",
    target: "heated",
    why: "Just above the flame: heating gives the particles more kinetic energy, so they move further apart and the same mass takes up more volume, so the density falls and this water rises. At the surface the water cools and becomes denser, then spreads to the sides and sinks, as the arrows show. The cooled and sinking water is the densest part of the loop, not the least dense." },

  /* ---------------- u3-cells ---------------- */
  { id: "PQ2-U3-91", topic: "u3-cells", type: "tap", tier: 1, ref: "3.1/LO3 · 3.1/LO4", fig: "R-U3-01",
    q: "Tap the structure that controls which substances enter and leave the cell.",
    target: "cell-membrane",
    why: "The cell membrane, the deep-blue layer just inside the cell wall, controls which substances enter and leave the cell. The cell wall outside it supports the cell and stops it bursting, but it does not control what passes through. A plant cell has both a wall and a membrane." },
  { id: "PQ2-U3-92", topic: "u3-cells", type: "label", tier: 1, ref: "3.1/LO2 · 3.1/LO3", fig: "R-U3-03",
    q: "Label the three marked structures of this bacterial cell.",
    extra: ["nucleus", "chloroplast"],
    why: "The thick violet outer layer is the cell wall, which supports the cell, and the thin dark-blue line just inside it is the cell membrane, which controls what enters and leaves. The cytoplasm fills the cell, and most of the cell's reactions happen there. A bacterial cell has no nucleus and no chloroplasts." },
  { id: "PQ2-U3-93", topic: "u3-cells", type: "choice", tier: 2, ref: "3.1/LO1 · 3.1/LO2", fig: "R-U3-03",
    q: "This cell has a cell wall, like a plant cell. Which feature shows that it is a bacterial cell?",
    options: ["It has no nucleus.", "It has no cell membrane.", "It has a cell wall.", "It has cytoplasm."], a: 0,
    why: "A bacterial cell has no nucleus, and this cell has none. It does have a cell membrane, the thin dark-blue line just inside the wall, as every cell does; a bacterium has a wall as well as a membrane, not instead of one. A cell wall does not show it is a bacterium, because plant cells have one too, and every cell has cytoplasm." },
];
