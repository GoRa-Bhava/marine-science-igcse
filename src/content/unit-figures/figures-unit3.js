/* Unit 3 (Marine organisms) picture questions, batch 1: questions on art the app already has.
   23 vetted September diagram items (U3-D..) ported onto the D01-D09 lp-* images and card art,
   plus 9 new items (PQ-U3-..) on existing specimen photos, card art and composites of lp-* images
   (PQ-U3-10 deleted and PQ-U3-03 rewritten at independent review, 10 Nov 2026).
   Shape as src/content/figures.js:
     FIGURES[id] = { art: { kind: "img", src, w, h }, hotspots: [{ id, x, y, label }] }
   Hotspots are points in the image's natural pixels. Choice items show the figure without markers.
   Composites and the fish-head crop live in public/figs-units/ (made from existing app images only). */

export const FIGURES_U3 = {
  // D01 bony fish
  "G-U3-fish": { art: { kind: "img", src: "figdata-img/lp-fish.webp", w: 800, h: 800 }, hotspots: [
    { id: "nares", x: 59, y: 386, label: "nares (nostrils)" },
    { id: "operculum", x: 180, y: 440, label: "operculum (gill cover)" },
    { id: "pectoral-fin", x: 320, y: 430, label: "pectoral fin" },
    { id: "scales", x: 430, y: 475, label: "scales" },
    { id: "lateral-line", x: 500, y: 367, label: "lateral line" },
    { id: "dorsal-fin", x: 400, y: 228, label: "dorsal fin" },
    { id: "caudal-fin", x: 730, y: 400, label: "caudal (tail) fin" },
    { id: "anal-fin", x: 540, y: 505, label: "anal fin" },
    { id: "pelvic-fin", x: 285, y: 575, label: "pelvic fin" },
  ] },
  // close-up of the head of lp-fish (crop 0,270 to 340,520, enlarged 2x) so the nares can be seen
  "G-U3-fishhead": { art: { kind: "img", src: "figs-units/G-U3-fishhead.webp", w: 680, h: 500 }, hotspots: [
    { id: "nares", x: 117, y: 232, label: "nares (nostrils)" },
    { id: "operculum", x: 370, y: 330, label: "operculum (gill cover)" },
    { id: "lateral-line", x: 560, y: 152, label: "lateral line" },
    { id: "pectoral-fin", x: 600, y: 330, label: "pectoral fin" },
    { id: "scales", x: 590, y: 50, label: "scales" },
  ] },
  // D03 plant cell (the membrane is not marked: it sits just inside the wall)
  "G-U3-plantcell": { art: { kind: "img", src: "figdata-img/lp-plantcell.webp", w: 800, h: 800 }, hotspots: [
    { id: "cell-wall", x: 17, y: 440, label: "cell wall" },
    { id: "cytoplasm", x: 710, y: 640, label: "cytoplasm" },
    { id: "nucleus", x: 645, y: 295, label: "nucleus" },
    { id: "chloroplast", x: 410, y: 90, label: "chloroplast" },
    { id: "vacuole", x: 360, y: 390, label: "large permanent vacuole" },
    { id: "mitochondrion", x: 276, y: 686, label: "mitochondrion" },
  ] },
  // D02 animal cell
  "G-U3-animalcell": { art: { kind: "img", src: "figdata-img/lp-animalcell.webp", w: 800, h: 800 }, hotspots: [
    { id: "cell-membrane", x: 690, y: 137, label: "cell membrane" },
    { id: "nucleus", x: 410, y: 395, label: "nucleus" },
    { id: "cytoplasm", x: 400, y: 175, label: "cytoplasm" },
    { id: "mitochondrion", x: 108, y: 395, label: "mitochondrion" },
  ] },
  // composite: plant cell (top left), animal cell (top right), bacterial cell (bottom)
  "G-U3-cells3": { art: { kind: "img", src: "figs-units/G-U3-cells3.webp", w: 824, h: 606 }, hotspots: [
    { id: "plant-cell", x: 200, y: 200, label: "plant cell" },
    { id: "animal-cell", x: 624, y: 200, label: "animal cell" },
    { id: "bacterial-cell", x: 340, y: 515, label: "bacterial cell" },
  ] },
  // composite: bacterial cell (top), dinoflagellate (bottom left), animal cell (bottom right)
  "G-U3-domains": { art: { kind: "img", src: "figs-units/G-U3-domains.webp", w: 824, h: 606 }, hotspots: [
    { id: "bacterial-cell", x: 300, y: 90, label: "bacterial cell" },
    { id: "dinoflagellate", x: 190, y: 360, label: "dinoflagellate" },
    { id: "animal-cell", x: 627, y: 400, label: "animal cell" },
  ] },
  // composite 2x2: kelp, bony fish / seagrass, diatom
  "G-U3-kingdoms": { art: { kind: "img", src: "figs-units/G-U3-kingdoms.webp", w: 824, h: 824 }, hotspots: [
    { id: "kelp", x: 180, y: 200, label: "kelp" },
    { id: "fish", x: 610, y: 200, label: "bony fish" },
    { id: "seagrass", x: 200, y: 620, label: "seagrass" },
    { id: "diatom", x: 615, y: 620, label: "diatom" },
  ] },
  // anemone budding, card art cmp-sexual-asexual__b used whole (review: the __a spawning panel shows
  // gametes leaving the fishes' mouths, so the two-panel composite was dropped)
  "G-U3-budding": { art: { kind: "img", src: "card-art/cmp-sexual-asexual__b.webp", w: 1000, h: 750 }, hotspots: [] },
  // D07 seagrass
  "G-U3-seagrass": { art: { kind: "img", src: "figdata-img/lp-seagrass.webp", w: 800, h: 800 }, hotspots: [
    { id: "leaf", x: 180, y: 170, label: "leaf (blade)" },
    { id: "flower", x: 420, y: 322, label: "flower" },
    { id: "rhizome", x: 250, y: 590, label: "rhizome (underground stem)" },
    { id: "roots", x: 130, y: 700, label: "roots" },
  ] },
  // D06 kelp
  "G-U3-kelp": { art: { kind: "img", src: "figdata-img/lp-kelp.webp", w: 800, h: 800 }, hotspots: [
    { id: "blade", x: 150, y: 150, label: "blade (frond)" },
    { id: "gas-bladder", x: 462, y: 458, label: "gas bladder (float)" },
    { id: "stipe", x: 350, y: 600, label: "stipe" },
    { id: "holdfast", x: 362, y: 728, label: "holdfast" },
  ] },
  // composite: kelp (left, cmp-seagrass-kelp__b), seagrass (right, __a)
  "G-U3-grasskelp": { art: { kind: "img", src: "figs-units/G-U3-grasskelp.webp", w: 1624, h: 600 }, hotspots: [] },
  // composite: dinoflagellate (left, cmp-dino-diatom__a, both flagella clear), diatom (right, __b)
  "G-U3-microalgae": { art: { kind: "img", src: "figs-units/G-U3-microalgae.webp", w: 1624, h: 600 }, hotspots: [
    { id: "dino-flagellum", x: 650, y: 360, label: "flagellum" },
    { id: "chloroplast", x: 1339, y: 225, label: "chloroplast" },
    { id: "diatom-silica", x: 1008, y: 332, label: "silica skeleton" },
  ] },
  "G-U3-starfish": { art: { kind: "img", src: "figdata-img/fd-starfish.webp", w: 720, h: 720 }, hotspots: [] },
  "G-U3-crab": { art: { kind: "img", src: "figdata-img/fd-crab.webp", w: 720, h: 720 }, hotspots: [] },
};

export const FIGURE_ITEMS_U3 = [
  /* ---------------- u3-cells ---------------- */
  { id: "U3-D16", topic: "u3-cells", type: "label", tier: 1, ref: "3.1/LO3", fig: "G-U3-plantcell",
    q: "Label the structures of this plant cell.",
    extra: ["flagellum", "silica skeleton"] },
  { id: "U3-D17", topic: "u3-cells", type: "tap", tier: 1, ref: "3.1/LO3", fig: "G-U3-plantcell",
    q: "Tap the structure that absorbs light energy for photosynthesis.", target: "chloroplast",
    why: "Chloroplasts are the small green ovals in the cytoplasm, and they absorb light energy for photosynthesis. The nucleus controls the cell, the large vacuole stores cell sap, and mitochondria release energy by respiration; none of these absorbs light." },
  { id: "U3-D18", topic: "u3-cells", type: "tap", tier: 1, ref: "3.1/LO3", fig: "G-U3-plantcell",
    q: "Tap the structure that contains the genetic material and controls the cell's activities.", target: "nucleus",
    why: "The nucleus is the rounded body beside the vacuole; it contains the genetic material and controls the cell. The large vacuole is bigger, but it only stores water and dissolved substances (cell sap). Mixing up the vacuole and the nucleus is a common labelling error." },
  { id: "U3-D19", topic: "u3-cells", type: "choice", tier: 2, ref: "3.1/LO3", fig: "G-U3-plantcell",
    q: "Which structure is present in this plant cell but would be ABSENT from an animal cell?",
    options: ["the chloroplasts", "the nucleus", "the cell membrane", "the mitochondria"], a: 0,
    why: "Chloroplasts, like the cell wall and the large vacuole, are found in plant cells only. The nucleus, the cell membrane and the mitochondria are found in both plant and animal cells." },
  { id: "U3-D20", topic: "u3-cells", type: "tap", tier: 1, ref: "3.1/LO2", fig: "G-U3-cells3",
    q: "Tap the cell that has a cell wall, a cell membrane and cytoplasm but no nucleus.", target: "bacterial-cell",
    why: "The bottom cell has a wall, a membrane and cytoplasm, with its genetic material loose in the cytoplasm and no nucleus: it is a bacterial cell. The plant cell also has a wall, but it has a nucleus. The animal cell has a nucleus and no wall." },
  { id: "U3-D21", topic: "u3-cells", type: "choice", tier: 2, ref: "3.1/LO1", fig: "G-U3-cells3",
    q: "Which of these cells has a nucleus but no cell wall and no chloroplasts?",
    options: ["the top-right cell", "the top-left cell", "the bottom cell", "none of these three cells"], a: 0,
    why: "The top-right cell is an animal cell: it has a cell membrane, cytoplasm, a nucleus and mitochondria, but no wall and no chloroplasts. The top-left plant cell has a wall and chloroplasts. The bottom bacterial cell has a wall and no nucleus." },
  { id: "PQ-U3-01", topic: "u3-cells", type: "label", tier: 1, ref: "3.1/LO3", fig: "G-U3-animalcell",
    q: "Label the structures of this animal cell.",
    extra: ["cell wall", "chloroplast"] },
  { id: "PQ-U3-02", topic: "u3-cells", type: "tap", tier: 1, ref: "3.1/LO4", fig: "G-U3-animalcell",
    q: "Tap the structure where respiration releases energy for the cell.", target: "mitochondrion",
    why: "Mitochondria are the sausage-shaped structures with folded insides, and respiration in them releases energy. The nucleus controls the cell but does not supply energy. The cytoplasm is where most other reactions happen, and the cell membrane controls what enters and leaves." },

  /* ---------------- u3-repro ---------------- */
  { id: "PQ-U3-03", topic: "u3-repro", type: "choice", tier: 1, ref: "3.2/LO1 · 3.2/LO2", fig: "G-U3-budding",
    q: "This sea anemone is reproducing. Which type of reproduction does the picture show, and why?",
    options: ["asexual, as a new anemone buds from one parent", "sexual, as the new anemone grows from one parent", "asexual, as sex cells from two parents fuse", "sexual, as sex cells from two parents fuse"], a: 0,
    why: "The small anemone growing out of the side of the large one is a bud: a single parent is producing an exact copy of itself, which is asexual reproduction. Growing from one parent is never sexual. Sexual reproduction needs male and female sex cells from two parents to fuse, and no sex cells or second parent are shown here." },

  /* ---------------- u3-classify ---------------- */
  { id: "PQ-U3-04", topic: "u3-classify", type: "tap", tier: 1, ref: "3.3/LO4", fig: "G-U3-kingdoms",
    q: "Tap the organism that belongs to the plant kingdom.", target: "seagrass",
    why: "Seagrass is a true plant, with roots, leaves and flowers. Kelp is a seaweed and the diatom is a single cell; both photosynthesise, but they are protoctists, not plants. The fish is an animal." },
  { id: "PQ-U3-05", topic: "u3-classify", type: "tap", tier: 1, ref: "3.3/LO3", fig: "G-U3-domains",
    q: "Each picture shows a single cell. Tap the cell that is not in the domain Eukarya.", target: "bacterial-cell",
    why: "The top cell has a wall, a membrane and cytoplasm, with its genetic material loose inside and no nucleus. It is a bacterium, in the domain Bacteria. The dinoflagellate (a protoctist) and the animal cell are both in kingdoms within the domain Eukarya. The dinoflagellate's nucleus is hidden by its outer covering here, but it does have one." },

  /* ---------------- u3-animals ---------------- */
  { id: "U3-D01", topic: "u3-animals", type: "label", tier: 1, ref: "3.4/LO3", fig: "G-U3-fish",
    q: "Label the external features of this bony fish.",
    extra: ["flipper", "hair"] },
  { id: "U3-D02", topic: "u3-animals", type: "tap", tier: 1, ref: "3.4/LO3", fig: "G-U3-fish",
    q: "Tap the fin that provides the forward thrust that pushes the fish through the water.", target: "caudal-fin",
    why: "The caudal (tail) fin sweeps from side to side and gives the forward thrust. The dorsal, pectoral, pelvic and anal fins work together to control pitching, rolling, yawing and changes of direction, but they do not drive the fish forward." },
  { id: "U3-D03", topic: "u3-animals", type: "tap", tier: 1, ref: "3.4/LO3", fig: "G-U3-fish",
    q: "Tap the feature that detects vibrations from a predator approaching from behind.", target: "lateral-line",
    why: "The lateral line is the thin line running along the side of the body, and it detects vibrations (water movements). The nares detect chemicals, not vibrations. The operculum covers the gills and the scales protect the body; neither is a sense organ." },
  { id: "U3-D04", topic: "u3-animals", type: "choice", tier: 2, ref: "3.4/LO1", fig: "G-U3-fish",
    q: "The animal shown has gills, fins supported by fin rays, and fertilises its eggs externally in the water. Which group of marine vertebrates is it in?",
    options: ["fish", "reptiles", "marine mammals", "birds"], a: 0,
    why: "Gills for gas exchange and external fertilisation place it among the fish. Reptiles also have scales, but they breathe with lungs and fertilise internally. Marine mammals and birds also use lungs and internal fertilisation, and have hair or feathers rather than scales." },
  { id: "U3-D05", topic: "u3-animals", type: "tap", tier: 1, ref: "3.4/LO3", fig: "G-U3-fishhead",
    q: "Tap the feature that detects chemicals in the water.", target: "nares",
    why: "The nares (nostrils) are the small openings on the snout in front of the eye, and they detect chemicals in the water. The lateral line detects vibrations; nares and lateral line are the pair students most often swap. The operculum covers the gills and the pectoral fin helps to control movement." },
  { id: "PQ-U3-06", topic: "u3-animals", type: "choice", tier: 2, ref: "3.4/LO4", fig: "G-U3-starfish",
    q: "This animal was collected from a rocky shore. Which invertebrate group does it belong to, and why?",
    options: ["echinoderms, as it has pentaradial symmetry and spiny skin", "cnidaria, as it has radial symmetry and stinging tentacles", "crustaceans, as its spines are part of a jointed exoskeleton", "molluscs, as its body is unsegmented and has no jointed legs"], a: 0,
    why: "Five arms arranged around a centre (pentaradial symmetry) and skin covered in spines are echinoderm features; on the curled arm you can also see rows of tube feet. Cnidaria have radial symmetry with stinging tentacles, and these arms are not tentacles. The spines grow from the skin and are not a jointed exoskeleton. Molluscs have bilateral symmetry, so the five-part body rules them out." },
  { id: "PQ-U3-07", topic: "u3-animals", type: "choice", tier: 2, ref: "3.4/LO4", fig: "G-U3-crab",
    q: "Which feature, visible in this photo, shows that the animal is a crustacean and not a mollusc?",
    options: ["legs made of jointed sections", "a hard covering over its body", "a body with bilateral symmetry", "a body with no visible segments"], a: 0,
    why: "Abdominal segments with jointed legs are a crustacean feature that no mollusc has. A hard outer covering does not decide it, because many molluscs have a hard shell. Both groups have bilateral symmetry. An unsegmented body is a mollusc feature, so it points the wrong way; a crab's segmented abdomen is folded under its body." },

  /* ---------------- u3-plants ---------------- */
  { id: "U3-D08", topic: "u3-plants", type: "label", tier: 1, ref: "3.5/LO1", fig: "G-U3-seagrass",
    q: "Label the four main features of this seagrass.",
    extra: ["holdfast", "gas bladder"] },
  { id: "U3-D09", topic: "u3-plants", type: "tap", tier: 1, ref: "3.5/LO1", fig: "G-U3-seagrass",
    q: "Tap the part that secures the plant in the sediment and takes up minerals.", target: "roots",
    why: "The roots spread down into the sediment; they secure the seagrass and take up minerals, and they are a feature of true plants. The rhizome is the sideways underground stem that links the plants, and it is easily mistaken for a root." },
  { id: "U3-D10", topic: "u3-plants", type: "tap", tier: 1, ref: "3.5/LO1", fig: "G-U3-seagrass",
    q: "Tap the underground stem that connects plants and produces new plants asexually.", target: "rhizome",
    why: "The rhizome is the horizontal underground stem joining the plants, and new plants grow from it by asexual reproduction. The roots below it anchor the plant and absorb minerals, and the flower is for sexual reproduction. The rhizome does not float the leaves." },
  { id: "U3-D11", topic: "u3-plants", type: "choice", tier: 2, ref: "3.5/LO1", fig: "G-U3-seagrass",
    q: "A seagrass grows new plants from its rhizome. Which feature shows that it can ALSO reproduce sexually?",
    options: ["the flower", "the rhizome", "the roots", "the leaf"], a: 0,
    why: "Flowers are the organs of sexual reproduction. The rhizome produces new plants asexually, the roots secure the plant and take in minerals, and the leaves carry out photosynthesis." },
  { id: "U3-D12", topic: "u3-plants", type: "label", tier: 1, ref: "3.5/LO2", fig: "G-U3-kelp",
    q: "Label the four main features of this kelp.",
    extra: ["roots", "flower"] },
  { id: "U3-D13", topic: "u3-plants", type: "tap", tier: 1, ref: "3.5/LO2", fig: "G-U3-kelp",
    q: "Tap the structure that floats the blades up towards the light.", target: "gas-bladder",
    why: "The gas bladders are the small round floats where the blades join the stalks. They float the blades up towards the surface, where the light is brightest, which helps photosynthesis. They do not store oxygen, and the stipe and holdfast do not float the kelp." },
  { id: "U3-D14", topic: "u3-plants", type: "tap", tier: 1, ref: "3.5/LO2", fig: "G-U3-kelp",
    q: "Tap the part that anchors the kelp to the substrate.", target: "holdfast",
    why: "The holdfast grips the rock and anchors the kelp. It looks branched like roots, but it only anchors: kelp is a protoctist and has no true roots. The stipe is the stem-like stalk above it, from which the blades develop." },
  { id: "U3-D15", topic: "u3-plants", type: "choice", tier: 2, ref: "3.3/LO4", fig: "G-U3-kelp",
    q: "Kelp has a holdfast, a stipe, blades and gas bladders, but no true roots and no flowers. In which kingdom is it placed?",
    options: ["protoctists", "plants", "animals", "bacteria"], a: 0,
    why: "Kelp is a macroalga (a seaweed) in the protoctist kingdom. It photosynthesises, but that does not make it a plant: its holdfast, stipe and blades are not true roots, stems or leaves, and it has no flowers." },
  { id: "U3-D22", topic: "u3-plants", type: "label", tier: 1, ref: "3.5/LO3 · 3.5/LO4", fig: "G-U3-microalgae",
    q: "Label the main features of these two microalgae.",
    extra: ["calcium carbonate skeleton", "gas bladder"] },
  { id: "U3-D23", topic: "u3-plants", type: "tap", tier: 1, ref: "3.5/LO3", fig: "G-U3-microalgae",
    q: "Tap the feature that a dinoflagellate uses to move.", target: "dino-flagellum",
    why: "The dinoflagellate (left) has two flagella, the long whip-like threads that beat to move it through the water. The diatom (right) has no flagella. Chloroplasts absorb light for photosynthesis and the silica skeleton protects the diatom; neither is used for moving." },
  { id: "U3-D24", topic: "u3-plants", type: "tap", tier: 1, ref: "3.5/LO4", fig: "G-U3-microalgae",
    q: "Tap the structure that is made of silica.", target: "diatom-silica",
    why: "A diatom has a skeleton made of silica: the glassy, ribbed case around the cell. It is not calcium carbonate, which is the material of shells and coral. The dinoflagellate has no silica skeleton, and chloroplasts are not made of silica." },
  { id: "U3-D25", topic: "u3-plants", type: "choice", tier: 2, ref: "3.3/LO4", fig: "G-U3-microalgae",
    q: "Both cells shown are microscopic, single-celled and contain chloroplasts. In which kingdom are dinoflagellates and diatoms placed?",
    options: ["protoctists", "plants", "bacteria", "animals"], a: 0,
    why: "Dinoflagellates and diatoms are single-celled protoctists. Having chloroplasts does not make them plants, being microscopic does not make them bacteria (they have a nucleus), and a dinoflagellate is not an animal just because it can move." },
  { id: "PQ-U3-08", topic: "u3-plants", type: "choice", tier: 2, ref: "3.5/LO1 · 3.5/LO2 · 3.3/LO4", fig: "G-U3-grasskelp",
    q: "One of these organisms is anchored by a holdfast, not by roots. Which picture shows it, and which kingdom is it in?",
    options: ["left picture, protoctist kingdom", "left picture, plant kingdom", "right picture, protoctist kingdom", "right picture, plant kingdom"], a: 0,
    why: "The left picture is kelp: blades, gas bladders and a holdfast gripping bare rock. The holdfast looks branched like roots, but it only anchors, and kelp is a seaweed (macroalga) in the protoctist kingdom. The right picture is seagrass, held in the sand by true roots; it is a plant. Photosynthesising does not make kelp a plant." },
  { id: "PQ-U3-09", topic: "u3-plants", type: "choice", tier: 2, ref: "3.5/LO3 · 3.5/LO4", fig: "G-U3-microalgae",
    q: "Which feature, visible in the pictures, shows that the organism in the right picture is a diatom and not a dinoflagellate?",
    options: ["It has no flagella.", "It has chloroplasts.", "It is a single cell.", "It has no nucleus."], a: 0,
    why: "A dinoflagellate has two flagella for movement, seen as the two long threads on the left cell. The diatom on the right has none, and has a silica skeleton instead. Both have chloroplasts and both are single cells, so these do not tell them apart. Both have a nucleus too; a cell with no nucleus would be a bacterium." },

  /* ---------------- u3-migration ----------------
     PQ-U3-10 (lanternfish, why it rises at night) deleted at review: the photo carries no information
     the stem needs, so it was a text question with a picture attached. */
];
