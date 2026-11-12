/* Unit 3 (Marine organisms) picture questions, batch 1: questions on art the app already has.
   23 vetted September diagram items (U3-D..) ported onto the D01-D09 lp-* images and card art,
   plus 9 new items (PQ-U3-..) on existing specimen photos, card art and composites of lp-* images
   (PQ-U3-10 deleted and PQ-U3-03 rewritten at independent review, 10 Nov 2026).
   Shape as src/content/figures.js:
     FIGURES[id] = { art: { kind: "img", src, w, h }, hotspots: [{ id, x, y, label }] }
   Hotspots are points in the image's natural pixels. Choice items show the figure without markers.
   Composites and the fish-head crop live in public/figs-units/.
   Batch 3 (10 Nov 2026): the plant cell, fish, seagrass and kelp items moved to replacement art R-U3-01,
   R-U3-05, R-U3-04 and R-U3-06 (figures-r-units1-3.js) and G-U3-plantcell, G-U3-fish, G-U3-seagrass and
   G-U3-kelp were deleted. The composites G-U3-cells3, -domains, -kingdoms, -grasskelp and the -fishhead crop
   were rebuilt from the new panels (same layout, same hotspot ids; batch3/tools/build-r-units1-3.py). */

export const FIGURES_U3 = {
  // close-up of the head of R-U3-05 (crop 112,248 to 452,498, enlarged 2x) so the nares can be seen
  // (batch 3: on the whole R-U3-05 fish each naris is about 2.5 px at 390 px, so U3-D05 stays here)
  "G-U3-fishhead": { art: { kind: "img", src: "figs-units/G-U3-fishhead.webp", w: 680, h: 500 }, hotspots: [
    { id: "nares", x: 86, y: 248, label: "nares (nostrils)" },
    { id: "operculum", x: 412, y: 324, label: "operculum (gill cover)" },
    { id: "lateral-line", x: 616, y: 121, label: "lateral line" },
    { id: "pectoral-fin", x: 636, y: 304, label: "pectoral fin" },
    { id: "scales", x: 560, y: 55, label: "scales" },
  ] },
  // D02 animal cell
  "G-U3-animalcell": { art: { kind: "img", src: "figdata-img/lp-animalcell.webp", w: 800, h: 800 }, hotspots: [
    { id: "cell-membrane", x: 690, y: 137, label: "cell membrane" },
    { id: "nucleus", x: 410, y: 395, label: "nucleus" },
    { id: "cytoplasm", x: 400, y: 175, label: "cytoplasm" },
    { id: "mitochondrion", x: 108, y: 395, label: "mitochondrion" },
  ] },
  // composite: plant cell (top left, R-U3-01), animal cell (top right, lp-animalcell), bacterial cell (bottom, R-U3-03)
  "G-U3-cells3": { art: { kind: "img", src: "figs-units/G-U3-cells3.webp", w: 824, h: 627 }, hotspots: [
    { id: "plant-cell", x: 200, y: 196, label: "plant cell" },
    { id: "animal-cell", x: 624, y: 200, label: "animal cell" },
    { id: "bacterial-cell", x: 412, y: 525, label: "bacterial cell" },
  ] },
  // composite: bacterial cell (top, R-U3-03, no flagellum), dinoflagellate (bottom left), animal cell (bottom right)
  "G-U3-domains": { art: { kind: "img", src: "figs-units/G-U3-domains.webp", w: 824, h: 627 }, hotspots: [
    { id: "bacterial-cell", x: 412, y: 101, label: "bacterial cell" },
    { id: "dinoflagellate", x: 190, y: 310, label: "dinoflagellate" },
    { id: "animal-cell", x: 627, y: 421, label: "animal cell" },
  ] },
  // composite 2x2: kelp (R-U4-01), bony fish (lp-fish) / seagrass (R-U3-04), diatom (lp-diatom)
  "G-U3-kingdoms": { art: { kind: "img", src: "figs-units/G-U3-kingdoms.webp", w: 824, h: 824 }, hotspots: [
    { id: "kelp", x: 190, y: 185, label: "kelp" },
    { id: "fish", x: 610, y: 200, label: "bony fish" },
    { id: "seagrass", x: 185, y: 600, label: "seagrass" },
    { id: "diatom", x: 615, y: 620, label: "diatom" },
  ] },
  // anemone budding, card art cmp-sexual-asexual__b used whole (review: the __a spawning panel shows
  // gametes leaving the fishes' mouths, so the two-panel composite was dropped)
  "G-U3-budding": { art: { kind: "img", src: "card-art/cmp-sexual-asexual__b.webp", w: 1000, h: 750 }, hotspots: [] },
  // composite: kelp on a boulder (left, R-U3-06, 600 px square), seagrass (right, cmp-seagrass-kelp__a)
  "G-U3-grasskelp": { art: { kind: "img", src: "figs-units/G-U3-grasskelp.webp", w: 1424, h: 600 }, hotspots: [] },
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
  { id: "U3-D16", topic: "u3-cells", type: "label", tier: 1, ref: "3.1/LO1 · 3.1/LO3", fig: "R-U3-01",
    q: "Label the seven marked structures of this plant cell.",
    extra: ["flagellum", "silica skeleton"],
    why: "The thick dark-green outer layer is the cell wall, which supports the cell, and the thin dark-blue line just inside it is the cell membrane, which controls what enters and leaves; a plant cell has both, not a wall instead of a membrane. The large pale-blue central space is the vacuole, which stores cell sap, and the purple rounded body is the nucleus, which contains the genetic material and controls the cell. The green ovals are chloroplasts, which absorb light for photosynthesis, the small orange shapes are mitochondria, where respiration releases energy, and the ground around them is the cytoplasm, where most reactions happen; a flagellum or a silica skeleton belongs to other organisms." },
  { id: "U3-D17", topic: "u3-cells", type: "tap", tier: 1, ref: "3.1/LO3 · 3.1/LO4", fig: "R-U3-01",
    q: "Tap the structure that absorbs light energy for photosynthesis.", target: "chloroplast",
    why: "Chloroplasts are the small green ovals in the cytoplasm, and they absorb light energy for photosynthesis. The nucleus controls the cell, the vacuole stores cell sap, and mitochondria release energy by respiration; none of these absorbs light." },
  { id: "U3-D18", topic: "u3-cells", type: "tap", tier: 1, ref: "3.1/LO3 · 3.1/LO4", fig: "R-U3-01",
    q: "Tap the structure that contains the genetic material and controls the cell's activities.", target: "nucleus",
    why: "The nucleus is the purple rounded body beside the vacuole; it contains the genetic material and controls the cell. The vacuole is bigger, but it only stores water and dissolved substances (cell sap). Mixing up the vacuole and the nucleus is a common labelling error." },
  { id: "U3-D19", topic: "u3-cells", type: "choice", tier: 2, ref: "3.1/LO1 · 3.1/LO3", fig: "R-U3-01",
    q: "Which structure is present in this plant cell but would be ABSENT from an animal cell?",
    options: ["the chloroplasts", "the nucleus", "the cell membrane", "the mitochondria"], a: 0,
    why: "Chloroplasts, like the cell wall and the large vacuole, are found in plant cells only. The nucleus, the cell membrane and the mitochondria are found in both plant and animal cells." },
  { id: "U3-D20", topic: "u3-cells", type: "tap", tier: 1, ref: "3.1/LO2", fig: "G-U3-cells3",
    q: "Tap the cell that has a cell wall, a cell membrane and cytoplasm but no nucleus.", target: "bacterial-cell",
    why: "The bottom cell has a cell wall, a cell membrane and cytoplasm but no nucleus: it is a bacterial cell. The plant cell also has a wall, but it has a nucleus. The animal cell has a nucleus and no wall." },
  { id: "U3-D21", topic: "u3-cells", type: "choice", tier: 2, ref: "3.1/LO1", fig: "G-U3-cells3",
    q: "Which of these cells has a nucleus but no cell wall and no chloroplasts?", qRecall: "Which cell in the picture has a nucleus but no cell wall and no chloroplasts?",
    options: ["the top-right cell", "the top-left cell", "the bottom cell", "none of these three cells"], a: 0,
    why: "The top-right cell is an animal cell: it has a cell membrane, cytoplasm, a nucleus and mitochondria, but no wall and no chloroplasts. The top-left plant cell has a wall and chloroplasts. The bottom bacterial cell has a wall and no nucleus." },
  { id: "PQ-U3-01", topic: "u3-cells", type: "label", tier: 1, ref: "3.1/LO3", fig: "G-U3-animalcell",
    q: "Label the structures of this animal cell.",
    extra: ["cell wall", "chloroplast"],
    why: "The thin outer boundary is the cell membrane, which controls what enters and leaves the cell, and the large purple body in the middle is the nucleus, which contains the genetic material and controls the cell. The orange sausage shapes are mitochondria, where respiration releases energy, and the pink ground around them is the cytoplasm, where most reactions happen. An animal cell has no cell wall outside its membrane and no chloroplasts, so those two labels belong to plant cells." },
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
    why: "The top cell has a cell wall, a cell membrane and cytoplasm but no nucleus, so it is a bacterium, in the domain Bacteria. The dinoflagellate (bottom left, a protoctist) and the animal cell (bottom right, with its nucleus) both belong to kingdoms within the domain Eukarya. The dinoflagellate's nucleus is hidden by its outer covering in this picture, but it does have one." },

  /* ---------------- u3-animals ---------------- */
  { id: "U3-D01", topic: "u3-animals", type: "label", tier: 1, ref: "3.4/LO3", fig: "R-U3-05",
    q: "Label the external features of this bony fish.",
    extra: ["flipper", "hair"],
    why: "On the head, the nares are the small openings in front of the eye that detect chemicals, and the operculum is the bony gill cover; the scales cover and protect the body, and the lateral line is the thin line along the side that detects vibrations. The caudal (tail) fin gives the forward thrust, while the dorsal fin on the back, the anal fin underneath near the tail, the pectoral fin just behind the operculum and the pelvic fin below it control pitching, rolling, yawing and changes of direction. Students often swap the nares and the lateral line, or the pectoral and pelvic fins; fish have fins, not flippers, and scales, not hair." },
  { id: "U3-D02", topic: "u3-animals", type: "tap", tier: 1, ref: "3.4/LO3", fig: "R-U3-05",
    q: "Tap the fin that provides the forward thrust that pushes the fish through the water.", target: "caudal-fin",
    why: "The caudal (tail) fin sweeps from side to side and gives the forward thrust. The dorsal, pectoral, pelvic and anal fins work together to control pitching, rolling, yawing and changes of direction, but they do not drive the fish forward." },
  { id: "U3-D03", topic: "u3-animals", type: "tap", tier: 1, ref: "3.4/LO3", fig: "R-U3-05",
    q: "Tap the feature that detects vibrations from a predator approaching from behind.", target: "lateral-line",
    why: "The lateral line is the thin line running along the side of the body, and it detects vibrations (water movements). The nares detect chemicals, not vibrations. The operculum covers the gills and the scales protect the body; neither is a sense organ." },
  { id: "U3-D04", topic: "u3-animals", type: "choice", tier: 2, ref: "3.4/LO1 · 3.4/LO3", fig: "R-U3-05",
    q: "Which feature, visible in this photograph, shows that this animal is a fish and not a reptile?",
    options: ["an operculum covering its gills", "scales covering its body", "a streamlined body shape", "eyes on the sides of its head"], a: 0,
    why: "The operculum is the bony flap behind the head that covers the gills, and gills for gas exchange place this animal among the fish. Reptiles such as sea turtles and sea snakes breathe air with lungs. Reptiles also have scales, and many are streamlined with eyes on the sides of the head, so those features do not separate the two groups." },
  { id: "U3-D05", topic: "u3-animals", type: "tap", tier: 1, ref: "3.4/LO3", fig: "G-U3-fishhead",
    q: "Tap the feature that detects chemicals in the water.", target: "nares",
    why: "The nares (nostrils) are the small openings on the snout in front of the eye, and they detect chemicals in the water. The lateral line detects vibrations; nares and lateral line are the pair students most often swap. The operculum covers the gills and the pectoral fin helps to control movement." },
  { id: "PQ-U3-06", topic: "u3-animals", type: "choice", tier: 2, ref: "3.4/LO4", fig: "G-U3-starfish",
    q: "This animal was collected from a rocky shore. Which invertebrate group does it belong to, and why?",
    options: ["echinoderms, as it has pentaradial symmetry and spiny skin", "cnidaria, as it has radial symmetry and stinging tentacles", "crustaceans, as its spines are part of a jointed exoskeleton", "molluscs, as its body is unsegmented and has no jointed legs"], a: 0,
    why: "Five arms arranged round a centre (pentaradial symmetry) and a skin covered in spines are echinoderm features, and the curled arm also shows rows of tube feet. Cnidaria have radial symmetry and stinging tentacles, and these spines grow from the skin rather than forming a jointed exoskeleton like a crustacean's. Molluscs have bilateral symmetry, so the five-part body rules them out too." },
  { id: "PQ-U3-07", topic: "u3-animals", type: "choice", tier: 2, ref: "3.4/LO4", fig: "G-U3-crab",
    q: "Which feature, visible in this photo, shows that the animal is a crustacean and not a mollusc?",
    options: ["legs made of jointed sections", "a hard covering over its body", "a body with bilateral symmetry", "a body with no visible segments"], a: 0,
    why: "Jointed legs on a segmented body are a crustacean feature that no mollusc has; a crab's segmented abdomen is folded under its body. A hard outer covering does not decide it, because many molluscs have a hard shell, and both groups have bilateral symmetry. An unsegmented body is a mollusc feature, so it points the wrong way." },

  /* ---------------- u3-plants ---------------- */
  { id: "U3-D08", topic: "u3-plants", type: "label", tier: 1, ref: "3.5/LO1", fig: "R-U3-04",
    q: "Label the four main features of this seagrass.",
    extra: ["holdfast", "gas bladder"],
    why: "The long green leaves carry out photosynthesis, and the cream-white flower cluster on its own tall stalk is for sexual reproduction. In the sediment, the horizontal rhizome (underground stem) joins the plants and produces new ones asexually, and the fine roots below it secure the plant and take up minerals. Students often call the rhizome a root, and a holdfast and gas bladders belong to kelp, a seaweed, not to seagrass." },
  { id: "U3-D09", topic: "u3-plants", type: "tap", tier: 1, ref: "3.5/LO1", fig: "R-U3-04",
    q: "Tap the part that secures the plant in the sediment and takes up minerals.", target: "roots",
    why: "The roots spread down into the sediment; they secure the seagrass and take up minerals, and they are a feature of true plants. The rhizome is the sideways underground stem that links the plants, and it is easily mistaken for a root." },
  { id: "U3-D10", topic: "u3-plants", type: "tap", tier: 1, ref: "3.5/LO1", fig: "R-U3-04",
    q: "Tap the underground stem that connects plants and produces new plants asexually.", target: "rhizome",
    why: "The rhizome is the horizontal underground stem joining the plants, and new plants grow from it by asexual reproduction. The roots below it anchor the plant and absorb minerals, and the flower is for sexual reproduction. The rhizome does not float the leaves." },
  { id: "U3-D11", topic: "u3-plants", type: "choice", tier: 2, ref: "3.5/LO1", fig: "R-U3-04",
    q: "A seagrass grows new plants from its rhizome. Which feature shows that it can ALSO reproduce sexually?",
    options: ["the flower", "the rhizome", "the roots", "the leaf"], a: 0,
    why: "Flowers are the organs of sexual reproduction. The rhizome produces new plants asexually, the roots secure the plant and take in minerals, and the leaves carry out photosynthesis." },
  { id: "U3-D12", topic: "u3-plants", type: "label", tier: 1, ref: "3.5/LO2", fig: "R-U3-06",
    q: "Label the four main features of this kelp.",
    extra: ["roots", "flower"],
    why: "The flat blades carry out photosynthesis, and the small round gas bladders where the blades join the stipe float them up towards the light. The stipe is the stem-like stalk from which the blades develop, and the holdfast at the base grips the rock and anchors the kelp. The holdfast is not a root: kelp is a seaweed (a protoctist) with no true roots and no flowers." },
  { id: "U3-D13", topic: "u3-plants", type: "tap", tier: 1, ref: "3.5/LO2", fig: "R-U3-06",
    q: "Tap the structure that floats the blades up towards the light.", target: "gas-bladder",
    why: "The gas bladders are the small round floats where the blades join the stipe. They float the blades up towards the surface, where the light is brightest, which helps photosynthesis. They do not store oxygen, and the stipe and holdfast do not float the kelp." },
  { id: "U3-D14", topic: "u3-plants", type: "tap", tier: 1, ref: "3.5/LO2", fig: "R-U3-06",
    q: "Tap the part that anchors the kelp to the substrate.", target: "holdfast",
    why: "The holdfast grips the rock and anchors the kelp. It is not a root: kelp is a protoctist and has no true roots, and the holdfast only anchors. The stipe is the stem-like stalk above it, from which the blades develop." },
  { id: "U3-D15", topic: "u3-plants", type: "choice", tier: 2, ref: "3.3/LO4", fig: "R-U3-06",
    q: "Kelp has a holdfast, a stipe, blades and gas bladders, but no true roots and no flowers. In which kingdom is it placed?",
    options: ["protoctists", "plants", "animals", "bacteria"], a: 0,
    why: "Kelp is a macroalga (a seaweed) in the protoctist kingdom. It photosynthesises, but that does not make it a plant: its holdfast, stipe and blades are not true roots, stems or leaves, and it has no flowers. It is not an animal, because it makes its own food by photosynthesis, and it is not a bacterium, because it is a large organism made of many cells, each with a nucleus." },
  { id: "U3-D22", topic: "u3-plants", type: "label", tier: 1, ref: "3.5/LO3 · 3.5/LO4", fig: "G-U3-microalgae",
    q: "Label the main features of these two microalgae.",
    extra: ["calcium carbonate skeleton", "gas bladder"],
    why: "On the dinoflagellate (left), the long whip-like thread is a flagellum, one of the two flagella it uses to move. On the diatom (right), the golden-brown bodies inside are chloroplasts, which absorb light for photosynthesis, and the glassy, ribbed case is its silica skeleton. The skeleton is made of silica, not calcium carbonate (the material of shells and coral), and gas bladders belong to kelp." },
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
    why: "The left picture is kelp, with blades, gas bladders, a stipe and a holdfast gripping a bare boulder; the holdfast only anchors and is not a root, and kelp is a seaweed (macroalga) in the protoctist kingdom. The right picture is seagrass, held in the sand by true roots, so it is a plant. Photosynthesising does not make kelp a plant." },
  { id: "PQ-U3-09", topic: "u3-plants", type: "choice", tier: 2, ref: "3.5/LO3 · 3.5/LO4", fig: "G-U3-microalgae",
    q: "Which feature, visible in the pictures, shows that the organism in the right picture is a diatom and not a dinoflagellate?",
    options: ["It has no flagella.", "It has chloroplasts.", "It is a single cell.", "It has no nucleus."], a: 0,
    why: "A dinoflagellate has two flagella for movement, seen as the long threads on the left cell, while the diatom on the right has none and has a silica skeleton instead. Both have chloroplasts and both are single cells, so those features do not tell them apart. Both have a nucleus too; a cell with no nucleus would be a bacterium." },

  /* ---------------- u3-migration ----------------
     PQ-U3-10 (lanternfish, why it rises at night) deleted at review: the photo carries no information
     the stem needs, so it was a text question with a picture attached. */
];
