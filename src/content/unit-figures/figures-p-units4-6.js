/* Marine 0697 picture questions, batch 3: style A and B images for Units 4-6.
   Same shape as src/content/figures.js. The art from ChatGPT (reviewed prompts ART-PROMPTS-units4-6.md)
   arrived and was checked on 10 Nov 2026; w, h are the natural pixel sizes of the webp files in
   public/figs-units/ and every hotspot x, y was measured on those images (10 Nov 2026).

   Composites (white background, 20 px gap, no text, left to right; panel x ranges in natural pixels):
   - P-U5-01-cmp   : P-U5-01 rocky shore (0-899) | card-art/cmp-sandy-muddy__a sandy shore (920-1719)
   - P-U5-06       : P-U5-06a seen from above (0-899) | P-U5-06b seen from below (920-1819)
   - P-U5-08       : P-U5-08 ray (0-899) | card-art/cmp-pelagic-benthic__b flatfish (920-1719)
   - P-U5-09       : open anemone (0-599) | P-U5-09 closed (620-1219)
   - P-U5-15       : P-U5-15a healthy (0-599) | 15b stressed (620-1219) | 15c bleached (1240-1839)
   - P-U5-16-trio  : P-U5-16 trigger fish (0-599) | P-U5-17 parrotfish (620-1219) | P-U5-18 nudibranch (1240-1839)
   - P-U6-04       : P-U6-04a resort (0-899) | P-U6-04b eco-lodge (920-1819)
   - P-U6-15       : P-U6-15 entangled turtle (0-599) | P-U6-16 bag and jellyfish (620-1219)
   - P-U6-22       : P-U6-22a one shoal (0-899) | P-U6-22b many species (920-1819)
   Every other figure is the single image of the same code.

   Ids: September ports keep their ids (U5-D..). New items are PQ2-U5-51.. and PQ2-U6-51..
   (the style-C file for these units uses 81 and up). The oil-spill (P-U6-11, U6-D10 to D12) and
   eutrophication (P-U6-17, U6-D01 to D03) sets are NOT here: figures-c-units4-6.js draws them in code. */

const IMG = (code, w, h) => ({ kind: "img", src: `figs-units/${code}.webp`, w, h });
const H = (id, x, y, label) => ({ id, x, y, label });

export const FIGURES_P46 = {
  // ---------- Unit 5 ----------
  "P-U5-01": { art: IMG("P-U5-01", 1200, 800), hotspots: [] },
  "P-U5-01-cmp": { art: IMG("P-U5-01-cmp", 1720, 600), hotspots: [] },
  "P-U5-02": { art: IMG("P-U5-02", 800, 800), hotspots: [
    H("limpets", 155, 190, "limpets clamped to the rock"),
    H("anemone", 550, 625, "sea anemone in the pool"),
    H("seaweed", 100, 545, "seaweed at the edge of the pool"),
    H("water", 340, 450, "pool water"),
    H("rock", 690, 175, "bare rock above the pool"),
  ] },
  "P-U5-03": { art: IMG("P-U5-03", 1200, 800), hotspots: [
    H("pole-1", 232, 500, "ranging pole at the bottom of the section"),
    H("pole-2", 628, 410, "ranging pole at the top of the section"),
    H("clinometer", 205, 383, "clinometer"),
    H("tape", 420, 543, "tape laid up the shore"),
    H("slope-break", 905, 255, "next change of slope"),
    H("mid-slope", 815, 350, "middle of an even slope"),
  ] },
  "P-U5-05": { art: IMG("P-U5-05", 1200, 800), hotspots: [
    H("photophores", 501, 437, "photophores (light organs)"),
    H("teeth", 100, 428, "large backward-facing teeth"),
    H("darkbody", 560, 350, "dark body colour"),
  ] },
  "P-U5-06": { art: IMG("P-U5-06", 1820, 600), hotspots: [] },
  "P-U5-08": { art: IMG("P-U5-08", 1720, 600), hotspots: [] },
  "P-U5-09": { art: IMG("P-U5-09", 1220, 600), hotspots: [] },
  "P-U5-10": { art: IMG("P-U5-10", 800, 800), hotspots: [
    H("holdfast", 175, 698, "holdfast"),
    H("stipe", 163, 585, "stipe (stem)"),
    H("frond", 640, 300, "frond"),
  ] },
  "P-U5-11": { art: IMG("P-U5-11", 1200, 800), hotspots: [
    H("lugworm", 240, 568, "lugworm in its U-shaped burrow"),
    H("clam", 592, 360, "buried clam"),
    H("crab", 925, 180, "crab on the surface"),
    H("darklayer", 850, 600, "low-oxygen sediment layer"),
    H("surface", 949, 335, "oxygen-rich surface sand"),
  ] },
  "P-U5-14": { art: IMG("P-U5-14", 800, 800), hotspots: [] },
  "P-U5-15": { art: IMG("P-U5-15", 1840, 600), hotspots: [
    H("panel1", 300, 330, "healthy coral"),
    H("panel2", 920, 330, "stressed coral"),
    H("panel3", 1540, 330, "bleached coral"),
  ] },
  "P-U5-16": { art: IMG("P-U5-16", 800, 800), hotspots: [
    H("spine", 266, 245, "raised first dorsal spine"),
    H("mouth", 62, 415, "mouth"),
    H("pectoral", 325, 415, "pectoral fin"),
    H("tail", 715, 390, "tail fin"),
  ] },
  "P-U5-16-trio": { art: IMG("P-U5-16-trio", 1840, 600), hotspots: [
    H("trigger", 300, 290, "trigger fish"),
    H("parrot", 900, 250, "parrotfish"),
    H("nudibranch", 1530, 290, "nudibranch"),
  ] },

  // ---------- Unit 6 ----------
  "P-U6-01": { art: IMG("P-U6-01", 1200, 800), hotspots: [] },
  "P-U6-02": { art: IMG("P-U6-02", 1200, 800), hotspots: [] },
  "P-U6-03": { art: IMG("P-U6-03", 1200, 800), hotspots: [
    H("anchor", 160, 583, "anchor and chain on the coral"),
    H("boat", 130, 160, "boat hull at the surface"),
    H("standing", 752, 330, "snorkeller standing on the coral"),
    H("floating", 978, 199, "snorkeller floating at the surface"),
    H("fish", 540, 645, "shoal of reef fish"),
  ] },
  "P-U6-04": { art: IMG("P-U6-04", 1820, 600), hotspots: [] },
  "P-U6-05": { art: IMG("P-U6-05", 1200, 800), hotspots: [] },
  "P-U6-06": { art: IMG("P-U6-06", 1200, 800), hotspots: [] },
  "P-U6-07": { art: IMG("P-U6-07", 1200, 800), hotspots: [
    H("raft", 600, 192, "floating raft"),
    H("algae", 630, 470, "algae growing on the hanging ropes"),
    H("smallfish", 380, 272, "small fish sheltering under the raft"),
    H("tuna", 210, 495, "tuna circling further out"),
    H("boat", 1010, 140, "fishing boat"),
  ] },
  "P-U6-09": { art: IMG("P-U6-09", 1200, 800), hotspots: [] },
  "P-U6-10": { art: IMG("P-U6-10", 1200, 800), hotspots: [] },
  "P-U6-12": { art: IMG("P-U6-12", 1200, 800), hotspots: [] },
  "P-U6-13": { art: IMG("P-U6-13", 1200, 800), hotspots: [
    H("outer-hull", 1018, 450, "outer hull"),
    H("hole", 208, 462, "hole in the outer hull"),
    H("gap", 600, 657, "gap between the hulls"),
    H("inner-hull", 310, 390, "inner hull"),
    H("cargo", 620, 430, "oil cargo"),
  ] },
  "P-U6-15": { art: IMG("P-U6-15", 1220, 600), hotspots: [] },
  "P-U6-18": { art: IMG("P-U6-18", 1200, 800), hotspots: [] },
  "P-U6-20": { art: IMG("P-U6-20", 1200, 800), hotspots: [] },
  "P-U6-22": { art: IMG("P-U6-22", 1820, 600), hotspots: [] },
};

export const FIGURE_ITEMS_P46 = [
  // ===================== Unit 5 =====================
  // ---- u5-components ----
  { id: "PQ2-U5-51", topic: "u5-components", type: "choice", tier: 1, ref: "5.1/LO3", fig: "P-U5-01",
    q: "Which type of marine ecosystem is shown in the photo?",
    options: ["A rocky shore", "A muddy shore", "A kelp forest", "A seagrass bed"], a: 0,
    why: "Boulders and rock platforms covered in brown seaweed, with rock pools left by the falling tide, make a rocky shore. A muddy shore is flat, fine sediment with no rock. A kelp forest is underwater, with tall kelp rising from the seabed, and a seagrass bed is a flowering plant rooted in sand or mud." },
  { id: "PQ2-U5-55", topic: "u5-components", type: "choice", tier: 2, ref: "5.1/LO1", fig: "P-U5-02",
    q: "Which of these is the community in this rock pool?",
    options: [
      "The limpets, anemones and seaweed living there together",
      "The group of limpets clamped onto the rock above the water",
      "The water, the rock and all the organisms, interacting",
      "The rock and the water that the organisms live in",
    ], a: 0,
    why: "A community is all the populations of different species living in an area, so it is every organism in the pool together. The limpets alone are one population. Adding the water and the rock gives the ecosystem, and the water and rock on their own are the abiotic part of the environment." },

  // ---- u5-investigating ----
  { id: "PQ2-U5-52", topic: "u5-investigating", type: "choice", tier: 2, ref: "5.2/LO3", fig: "P-U5-01",
    q: "Two students will measure the profile of this shore. Which safety precaution matters most here?",
    options: [
      "Wear shoes that grip well, as the seaweed-covered rocks are slippery.",
      "Work while the tide is high, so the rocks are covered and less slippery.",
      "Walk on the seaweed, not on bare rock, as it gives a softer surface.",
      "Stand on the boulders at the edge of the sea, to see the slope better.",
    ], a: 0,
    why: "Wet rock covered in seaweed is very slippery, so footwear with a good grip (and checking the tide times first) prevents falls. A shore profile is measured while the tide is out, not in. The seaweed is the most slippery surface of all, and standing at the edge of the sea risks being caught by a wave." },
  { id: "PQ2-U5-56", topic: "u5-investigating", type: "tap", tier: 1, ref: "5.2/LO3", fig: "P-U5-03",
    q: "Tap the instrument used to measure the angle of the slope between the two poles.",
    target: "clinometer",
    why: "The clinometer is sighted from a mark on one ranging pole to the mark at the same height on the other, and gives the angle of slope for that section. The ranging poles mark the two ends of the section, and the tape measures the distance between them." },
  { id: "PQ2-U5-57", topic: "u5-investigating", type: "tap", tier: 2, ref: "5.2/LO3", fig: "P-U5-03",
    q: "The section between the two poles has been measured. Tap where the next ranging pole should be placed.",
    target: "slope-break",
    why: "Each section of a shore profile ends where the slope changes, so the next pole goes at the top of the steep section, where the shore flattens out. A pole in the middle of an even slope would split one gradient into two sections for no gain; the sections do not have to be the same length." },
  { id: "PQ2-U5-58", topic: "u5-investigating", type: "choice", tier: 2, ref: "5.2/LO3", fig: "P-U5-03",
    q: "The student sights from a mark on one pole to a mark at the same height on the other pole. Why?",
    options: [
      "So the line of sight is parallel to the ground, giving its angle.",
      "So the distance between the poles can be read from the two marks.",
      "So the angle measured here can be used for the whole of the shore.",
      "So the clinometer can rest on the sand at each pole as it is read.",
    ], a: 0,
    why: "Marks at the same height on both poles make the line of sight parallel to the ground, so the clinometer reads the angle of the slope itself. Sighting to a mark at a different height would not do this. The tape gives the distance, not the marks, and each section has its own angle, which is why the profile is measured section by section." },

  // ---- u5-openocean (September ports, deep-sea fish) ----
  { id: "U5-D05", topic: "u5-openocean", type: "label", tier: 1, ref: "5.3/LO12", fig: "P-U5-05",
    q: "Label the deep-sea adaptations of this fish.",
    extra: ["countershading (dark back, pale belly)", "streamlined body for fast swimming"],
    why: "Photophores make light by bioluminescence, large backward-facing teeth stop prey escaping, and a dark body cannot be seen in the faint light that other animals make. Countershading and a streamlined body for fast swimming belong to fish of the sunlight and twilight zones, and are not shown here." },
  { id: "U5-D06", topic: "u5-openocean", type: "tap", tier: 1, ref: "5.3/LO12", fig: "P-U5-05",
    q: "Tap the light-producing organs the fish uses to attract prey.",
    target: "photophores",
    why: "The photophores make light (bioluminescence). In the midnight zone no sunlight reaches, so a light draws prey towards the fish. The teeth hold prey once it is caught and the dark body hides the fish; neither of them makes light." },
  { id: "U5-D07", topic: "u5-openocean", type: "tap", tier: 1, ref: "5.3/LO12", fig: "P-U5-05",
    q: "Tap the feature that stops caught prey from escaping.",
    target: "teeth",
    why: "Large teeth that point backwards let prey slide into the mouth but stop it pulling free. Food is scarce in the midnight zone, so losing a catch is costly. The photophores attract prey, and the dark body hides the fish." },
  { id: "U5-D08", topic: "u5-openocean", type: "choice", tier: 2, ref: "5.3/LO12", fig: "P-U5-05",
    q: "This fish makes its own light and has large backward-facing teeth. In which zone does it live, and why are these features useful?",
    options: [
      "The midnight zone: there is no sunlight, so its light lures prey and its teeth stop prey escaping.",
      "The sunlight zone: its light attracts the plankton it eats and its teeth grind hard-shelled prey.",
      "The twilight zone: its light warms the cold water around it and its teeth scrape algae off rocks.",
      "The midnight zone: its light is stored sunlight it lets out later and its teeth dig in the seabed.",
    ], a: 0,
    why: "Making light is most useful where no sunlight reaches, in the midnight zone, where it lures prey, and backward-facing teeth stop the prey escaping. The light is made by the fish, not stored sunlight, and it gives no useful heat. Teeth that grind shells or scrape algae belong to fish with quite different diets." },
  { id: "PQ2-U5-59", topic: "u5-openocean", type: "choice", tier: 2, ref: "5.3/LO10", fig: "P-U5-06",
    q: "Both pictures show the same fish in open water. The left picture looks down on it from above, and the right picture looks up at it from below. Why is it hard to see in both?",
    options: [
      "Its dark back matches the dark water below, and its pale belly matches the bright surface.",
      "Its dark back absorbs heat from the Sun, and its pale belly reflects light to dazzle predators.",
      "Its dark back matches the bright surface above, and its pale belly matches the dark water.",
      "It changes the colour of its whole body to match each background as it swims up and down.",
    ], a: 0,
    why: "This is countershading. From above, the dark back blends with the dark deep water; from below, the pale belly blends with the bright, sunlit surface, so predators and prey see it less easily. The colours are not for warmth or dazzling, and the fish does not change colour." },
  { id: "PQ2-U5-60", topic: "u5-openocean", type: "choice", tier: 1, ref: "5.3/LO13", fig: "P-U5-08",
    q: "Both fish live on the seabed. Which picture shows a ray, and how is a ray flattened?",
    options: [
      "The left: flattened from top to bottom, with wide fins round its edge.",
      "The right: flattened from top to bottom, with wide fins round its edge.",
      "The left: lying on one side, with both of its eyes on the upper side.",
      "The right: lying on one side, with both of its eyes on the upper side.",
    ], a: 0,
    why: "A ray is flattened from top to bottom, with long pectoral fins spread round its edge, as in the left picture. The right fish is a flatfish: it lies on one side, and one eye has moved so that both are on top. That is a different way of being flat, and it is not how a ray is built." },
  { id: "PQ2-U5-61", topic: "u5-openocean", type: "choice", tier: 2, ref: "5.3/LO13", fig: "P-U5-08",
    q: "How is the fish in the right picture adapted to lying on the seabed?",
    options: [
      "It lies on one side, and one eye has moved so both eyes are on top.",
      "It lies on its belly, and its eyes are underneath to watch the sand.",
      "It lies on its belly, with long pectoral fins spread round its edge.",
      "It lies on one side, with one eye on top and one in the sand below.",
    ], a: 0,
    why: "A flatfish lies on one side. As it grows, one eye moves round so that both eyes are on the upper side and stick up, letting it watch for prey and predators while it lies flat or half buried. Lying on the belly with pectoral fins spread round the edge describes a ray, and eyes facing the sand would be no use." },

  // ---- u5-rockyshore ----
  { id: "U5-D11", topic: "u5-rockyshore", type: "tap", tier: 1, ref: "5.4/LO4", fig: "P-U5-02",
    q: "Tap the organism that shelters in a rock pool or under seaweed to avoid drying out at low tide.",
    target: "anemone",
    why: "A sea anemone has a soft body that loses water quickly in air, so at low tide it survives only where water remains, in a rock pool or under damp seaweed. Limpets survive out of the water by clamping their shells to the rock, and the seaweed has thick, leathery fronds." },
  { id: "PQ2-U5-62", topic: "u5-rockyshore", type: "choice", tier: 1, ref: "5.4/LO4", fig: "P-U5-09",
    q: "Both pictures show the same species of sea anemone. One was taken while the tide was out. Which one, and why has it changed shape?",
    options: [
      "The right: it has pulled its tentacles in, to cut water loss to the air.",
      "The left: it has spread its tentacles out, to catch food from the air.",
      "The right: it has pulled its tentacles in, to grip the rock against waves.",
      "The left: it has spread its tentacles out, to take in oxygen from the air.",
    ], a: 0,
    why: "Out of the water a sea anemone pulls in its tentacles and becomes a firm, jelly-like blob, which reduces the surface that loses water. Spread tentacles catch food in the water, not in the air, and an anemone holds on to the rock with its base, not its tentacles." },
  { id: "PQ2-U5-63", topic: "u5-rockyshore", type: "tap", tier: 1, ref: "5.4/LO4", fig: "P-U5-10",
    q: "Waves break over this seaweed at high tide. Tap the part that stops it being washed off the rock.",
    target: "holdfast",
    why: "The holdfast grips the rock firmly, so wave action and currents do not tear the seaweed away. It only holds on: it is not a root and takes in no water. The stipe and the fronds are the parts the waves push against." },
  { id: "PQ2-U5-64", topic: "u5-rockyshore", type: "choice", tier: 2, ref: "5.4/LO4", fig: "P-U5-10",
    q: "This seaweed grows in the intertidal zone of a rocky shore, so it is uncovered at every low tide. Which feature, visible in the picture, helps it survive there?",
    options: [
      "Thick, leathery fronds that slow down the loss of water to the air",
      "A holdfast that soaks up water from the rock while the tide is out",
      "Roots that grow into cracks in the rock to reach the water below",
      "Thin, delicate fronds that dry out quickly and recover just as fast",
    ], a: 0,
    why: "At low tide the seaweed is exposed to the air, and its thick, leathery fronds slow down drying out. The holdfast only anchors it and takes up no water, and seaweeds have no roots. Thin, delicate fronds would lose water faster, not survive better." },

  // ---- u5-sediment ----
  { id: "PQ2-U5-53", topic: "u5-sediment", type: "choice", tier: 2, ref: "5.5/LO3", fig: "P-U5-01-cmp",
    q: "Seaweeds such as Fucus grow on only one of these shores. Which shore, and why?",
    options: [
      "The left shore, because the solid rock gives the holdfast a stable surface to grip.",
      "The right shore, because the loose sand lets the seaweed's roots grow down deeply.",
      "The left shore, because the seaweed takes in mineral nutrients from inside the rock.",
      "The right shore, because the sand holds more oxygen than the water round the rocks.",
    ], a: 0,
    why: "A seaweed has no roots: its holdfast grips a hard surface. Rock is stable, but sand is loose and keeps shifting, so seaweed cannot stay attached on a sandy shore; any seaweed seen on a sandy beach has been washed up there. The holdfast only holds on and takes no nutrients from the rock, and oxygen in the sand is not what limits seaweed." },
  { id: "PQ2-U5-54", topic: "u5-sediment", type: "choice", tier: 1, ref: "5.5/LO4", fig: "P-U5-01-cmp",
    q: "A lugworm lives in a U-shaped burrow and swallows sediment to feed. On which shore is it adapted to live?",
    options: [
      "The right shore, where it can dig down into the soft sand.",
      "The left shore, where it can shelter from waves in rock pools.",
      "The right shore, where it can grip the sand grains with its body.",
      "The left shore, where it can scrape algae off the rocks to feed.",
    ], a: 0,
    why: "A lugworm needs sediment that it can burrow into and swallow, so it lives on sandy or muddy shores; it cannot dig into rock. It does not grip the surface, and it feeds on the microorganisms in the sand it swallows, not on algae scraped from rock as a limpet does." },
  { id: "U5-D13", topic: "u5-sediment", type: "label", tier: 1, ref: "5.5/LO4", fig: "P-U5-11",
    q: "Label the shore animals and the two layers of sediment.",
    extra: ["rock pool", "holdfast"],
    why: "The lugworm lives in a U-shaped burrow, the clam is buried in the sand, and the crab moves over the surface. Below the pale, oxygen-rich surface sand lies a dark, waterlogged layer with very little oxygen. Rock pools and holdfasts belong to rocky shores." },
  { id: "U5-D14", topic: "u5-sediment", type: "tap", tier: 1, ref: "5.5/LO4", fig: "P-U5-11",
    q: "Tap the animal that swallows sand to digest the microorganisms living between the grains.",
    target: "lugworm",
    why: "The lugworm swallows sand, digests the microorganisms living between the grains and pushes the waste sand out as a coiled cast at the surface. The clam digs with its foot and the crab moves over the surface; neither swallows sand." },
  { id: "U5-D15", topic: "u5-sediment", type: "tap", tier: 1, ref: "5.5/LO2", fig: "P-U5-11",
    q: "Tap the layer of sediment that contains very little oxygen.",
    target: "darklayer",
    why: "Near the surface the sand is pale and holds oxygen in the air spaces between the grains. Further down, the waterlogged sediment is dark and contains very little oxygen. The animals are not layers of sediment." },
  { id: "U5-D16", topic: "u5-sediment", type: "choice", tier: 2, ref: "5.5/LO4", fig: "P-U5-11",
    q: "Why do the animals of a sandy or muddy shore live buried in the sediment?",
    options: [
      "It hides them from predators and stops them drying out when the tide is out.",
      "It is where they find the light they need to photosynthesise.",
      "The deeper sediment is the warmest part of the shore at low tide.",
      "Buried animals filter more oxygen from the waterlogged mud than those on the surface.",
    ], a: 0,
    why: "Burrowing hides the animals from predators such as birds and stops them drying out in the air at low tide. No light reaches buried animals, the deeper sediment is not the warmest place, and waterlogged sediment holds little oxygen, so being buried gives them less of it, not more." },
  { id: "PQ2-U5-65", topic: "u5-sediment", type: "tap", tier: 1, ref: "5.5/LO4", fig: "P-U5-11",
    q: "Tap the animal that uses a muscular foot to dig down into the sediment.",
    target: "clam",
    why: "A clam burrows by pushing its muscular foot down into the sand and pulling itself after it, which hides it from predators and stops it drying out. The lugworm lives in a U-shaped burrow and swallows sand, and the crab moves about on the surface." },

  // ---- u5-mangrove ----
  { id: "PQ2-U5-66", topic: "u5-mangrove", type: "choice", tier: 1, ref: "5.6/LO3", fig: "P-U5-14",
    q: "What are the white crystals on the surface of this mangrove leaf?",
    options: [
      "Salt the leaf has secreted to remove excess salt",
      "Salt the leaf has absorbed from sea spray, as food",
      "Sugar the leaf has made and stored on its surface",
      "Dried spray that stops the leaf from losing water",
    ], a: 0,
    why: "Mangroves grow in salty water, and some get rid of the excess salt by secreting it through their leaves, where it dries as white crystals. Leaves do not absorb salt as food, the sugar made in photosynthesis stays inside the cells, and the crystals are not a waterproof coating." },

  // ---- u5-coral ----
  { id: "U5-D25", topic: "u5-coral", type: "tap", tier: 1, ref: "5.7/LO5", fig: "P-U5-15",
    q: "Tap the panel that shows a healthy coral.",
    target: "panel1",
    why: "A healthy coral is golden-brown because huge numbers of zooxanthellae live in the polyps' tissue. The patchy coral is losing them, and the white coral has lost them." },
  { id: "U5-D26", topic: "u5-coral", type: "tap", tier: 1, ref: "5.7/LO5", fig: "P-U5-15",
    q: "Tap the panel that shows a fully bleached coral.",
    target: "panel3",
    why: "A fully bleached coral is white all over: the polyps have expelled their zooxanthellae, so the white calcium carbonate skeleton shows through the clear tissue. The patchy coral is only part of the way there." },
  { id: "U5-D27", topic: "u5-coral", type: "choice", tier: 2, ref: "5.7/LO5", fig: "P-U5-15",
    q: "The coral in the last panel has turned white. What has happened?",
    options: [
      "Warmer water stressed the polyps, so they expelled their zooxanthellae.",
      "The warm water dissolved the coloured outer layer of the coral's skeleton.",
      "The polyps grew a thick white skeleton to shade themselves from sunlight.",
      "The coral grew so quickly that its colour was spread too thinly to be seen.",
    ], a: 0,
    why: "When the water becomes too warm the polyps are stressed and expel their zooxanthellae, so the coral loses its colour and the white skeleton shows through; acidification can add to this stress. The skeleton has no coloured layer and is not dissolved by the heat, and bleaching is not a kind of growth. A bleached coral has lost its main food supply." },
  { id: "PQ2-U5-67", topic: "u5-coral", type: "tap", tier: 1, ref: "5.7/LO8", fig: "P-U5-16",
    q: "At night this fish wedges itself into a crack in the reef. Tap the feature it uses to lock itself in place.",
    target: "spine",
    why: "The trigger fish raises its first dorsal spine and locks it upright, jamming itself into the crevice. The tail fin and pectoral fins are used for swimming, and the mouth and strong teeth for feeding." },
  { id: "PQ2-U5-68", topic: "u5-coral", type: "choice", tier: 2, ref: "5.7/LO8", fig: "P-U5-16",
    q: "Why does this fish lock itself into a crevice like this?",
    options: [
      "So that a predator cannot pull it out of the reef",
      "So that it can scrape algae from inside the crack",
      "So that it can change colour to match the coral",
      "So that it can sting the coral with its dorsal fin",
    ], a: 0,
    why: "With its dorsal spine locked upright, the trigger fish is wedged so tightly that a predator cannot drag it out, which protects it while it rests. It does not feed while it is wedged, it does not change colour to hide, and its spine does not sting." },
  { id: "PQ2-U5-69", topic: "u5-coral", type: "tap", tier: 1, ref: "5.7/LO8", fig: "P-U5-16-trio",
    q: "Tap the animal that has grinding teeth for biting off and eating coral.",
    target: "parrot",
    why: "The parrotfish's teeth are joined into a beak that bites off coral, and it grinds up the hard skeleton to feed on the polyps and algae. The trigger fish locks itself into crevices with its dorsal spine, and the nudibranch takes in toxins from its prey." },
  { id: "PQ2-U5-70", topic: "u5-coral", type: "tap", tier: 2, ref: "5.7/LO8", fig: "P-U5-16-trio",
    q: "Tap the animal that takes in toxins from the animals it eats and keeps them in its own body.",
    target: "nudibranch",
    why: "A nudibranch absorbs toxins from its prey and stores them, which makes it harmful for a predator to eat. The parrotfish grinds coral with its teeth, and the trigger fish wedges itself into crevices with its dorsal spine." },

  // ===================== Unit 6 =====================
  // ---- u6-overview ----
  { id: "PQ2-U6-52", topic: "u6-overview", type: "choice", tier: 1, ref: "6.1/LO2", fig: "P-U6-01",
    q: "The photo shows a coast where a mangrove forest once grew. Which human activity has replaced it?",
    options: [
      "Shrimp farming in ponds dug into the coast",
      "Land reclamation to build a holiday resort",
      "Dredging the mud to deepen a shipping port",
      "Building a sea wall to protect the coast",
    ], a: 0,
    why: "Rectangular, water-filled ponds with banks between them, cut into cleared mangrove, are shrimp farms. Land reclamation builds up dry land for buildings, dredging removes mud from a channel, and a sea wall is a single barrier along the shore." },
  { id: "PQ2-U6-53", topic: "u6-overview", type: "choice", tier: 2, ref: "6.1/LO2", fig: "P-U6-01",
    q: "Which pair of impacts does the change shown in the photo have?",
    options: [
      "The coast loses its protection from waves, and pond waste pollutes the sea.",
      "Nursery areas for young fish increase, and the ponds add oxygen to the sea.",
      "Erosion of the coast is reduced, and the ponds filter waste out of the sea.",
      "Fish catches nearby rise, and the ponds stop sediment reaching the reefs.",
    ], a: 0,
    why: "Mangrove roots reduce wave energy and erosion, so clearing them leaves the coast unprotected, and waste food and faeces from the ponds are released into the coastal water. The ponds replace the mangrove nursery areas, so young fish lose their shelter, and the ponds neither add oxygen to the sea nor clean it." },
  { id: "PQ2-U6-54", topic: "u6-overview", type: "choice", tier: 1, ref: "6.1/LO2", fig: "P-U6-02",
    q: "Which human activity most likely caused the damage shown in the photo?",
    options: ["Blast fishing with explosives", "Coral bleaching in warm water", "Snorkellers trampling the coral", "Sediment from land reclamation"], a: 0,
    why: "An explosion shatters all the coral, and kills the fish, in one patch, leaving a crater of broken rubble beside reef that is untouched. Bleached coral stays standing but turns white, trampling breaks a few branches, and sediment smothers coral over a wide area without smashing it into rubble." },

  // ---- u6-tourism ----
  { id: "PQ2-U6-55", topic: "u6-tourism", type: "tap", tier: 1, ref: "6.2/LO3", fig: "P-U6-03",
    q: "Tap the damage that the boat itself is doing to the reef.",
    target: "anchor",
    why: "The anchor and its chain drop onto the coral and drag across it, breaking it. Mooring buoys avoid this. The boat's hull floats at the surface and does not touch the reef, and the snorkellers and fish are not part of the boat." },
  { id: "PQ2-U6-56", topic: "u6-tourism", type: "tap", tier: 1, ref: "6.2/LO3", fig: "P-U6-03",
    q: "Tap the visitor whose behaviour is damaging the reef.",
    target: "standing",
    why: "Standing on coral crushes the living polyps, and coral grows back very slowly. The other snorkeller floats at the surface without touching anything, which is how visitors are taught to behave on a reef." },
  { id: "PQ2-U6-57", topic: "u6-tourism", type: "choice", tier: 2, ref: "6.2/LO2", fig: "P-U6-04",
    q: "Which picture shows ecotourism, and which feature in it shows this?",
    options: [
      "The right: its electricity comes from solar panels on the roofs.",
      "The left: its guests can see the reef from their hotel windows.",
      "The left: it stands on reclaimed land, so no one walks on the reef.",
      "The right: its boardwalk lets guests collect shells to take home.",
    ], a: 0,
    why: "Ecotourism is ecologically sustainable tourism that helps to conserve the natural area, and renewable energy from solar panels is one of its strategies. Seeing wildlife does not by itself make a holiday ecotourism, reclaiming land buries the habitat under it, and collecting shells removes organisms from the ecosystem." },

  // ---- u6-fisheries ----
  { id: "PQ2-U6-59", topic: "u6-fisheries", type: "choice", tier: 1, ref: "6.3/LO2", fig: "P-U6-05",
    q: "Which fishing method is shown in the photo?",
    options: ["Pole and line", "Trolling lines", "Pelagic longlining", "Cast netting"], a: 0,
    why: "Each crew member holds one pole with a single line and lands one tuna at a time, which is pole and line. Trolling tows a few lines behind a moving boat, longlining sets one main line carrying thousands of hooks, and a cast net is thrown by hand." },
  { id: "PQ2-U6-60", topic: "u6-fisheries", type: "choice", tier: 2, ref: "6.3/LO2", fig: "P-U6-06",
    q: "This method is used to catch tuna. Why does it put tuna stocks at risk of overfishing?",
    options: [
      "The net can surround a whole shoal, so a huge catch is taken at once.",
      "The net is dragged along the seabed and destroys the tuna's habitat.",
      "Thousands of baited hooks are left in the water for many hours.",
      "The fish are caught one at a time, so the crew can fish all day long.",
    ], a: 0,
    why: "A purse seine is set in a ring round an entire shoal and then closed underneath, so a very large catch is taken in one go, which can remove fish faster than they breed. Dragging along the seabed is beam trawling, baited hooks are longlining, and catching one fish at a time is pole and line, which limits the catch." },
  { id: "PQ2-U6-61", topic: "u6-fisheries", type: "tap", tier: 1, ref: "6.3/LO7", fig: "P-U6-07",
    q: "Tuna gather around this floating device. Tap the animals they come to it to eat.",
    target: "smallfish",
    why: "Algae grow on the hanging ropes, small fish gather there to shelter and feed, and the tuna are drawn in to feed on the small fish. The boat then fishes for the tuna around the device. The algae feed the small fish, not the tuna." },
  { id: "PQ2-U6-62", topic: "u6-fisheries", type: "choice", tier: 2, ref: "6.3/LO7", fig: "P-U6-07",
    q: "Which pair of statements describes ecological impacts of this device?",
    options: [
      "Huge tuna catches are easy, and turtles and sharks are caught too.",
      "Tuna alone are drawn in, and the device keeps other fish away.",
      "The device is dragged over the seabed, and it destroys the coral there.",
      "The tuna are held inside the raft, and they are set free to breed later.",
    ], a: 0,
    why: "The device gathers tuna in one place, so very large catches are easy and stocks can be overfished; turtles, sharks and dolphins are drawn in as well and are caught or tangled in the lines. Many species, not only tuna, gather at the device. It floats at the surface and is not dragged, and it does not hold the fish." },

  // ---- u6-aquaculture ----
  { id: "PQ2-U6-63", topic: "u6-aquaculture", type: "choice", tier: 1, ref: "6.4/LO3", fig: "P-U6-09",
    q: "This animal is farmed for food in aquaculture. To which group does it belong?",
    options: ["Echinoderm", "Mollusc", "Crustacean", "Macroalga"], a: 0,
    why: "A sea cucumber is an echinoderm: it has rows of tube feet on its underside and a thick, bumpy skin. Molluscs such as mussels have a shell, crustaceans such as shrimp have jointed legs and a hard exoskeleton, and macroalgae such as kelp are not animals." },
  { id: "PQ2-U6-64", topic: "u6-aquaculture", type: "choice", tier: 2, ref: "6.4/LO6", fig: "P-U6-10",
    q: "These mangrove seedlings will be planted out on a coast where the forest was destroyed. Why is raising them like this a type of aquaculture?",
    options: [
      "They are raised in controlled, protected conditions.",
      "They are grown as a crop to be cut and sold for timber.",
      "They are fed fish pellets each day so they grow faster.",
      "They stand in sea water, so they take in salt as their food.",
    ], a: 0,
    why: "Aquaculture includes raising organisms in controlled, protected conditions, here in a shaded nursery, before planting them out to restock the coast. These trees are for restoring the forest, not for timber. They are not fed, and salt is not a food for them: like other plants, they make their own food by photosynthesis." },

  // ---- u6-energy ----
  { id: "PQ2-U6-65", topic: "u6-energy", type: "choice", tier: 2, ref: "6.5/LO5", fig: "P-U6-12",
    q: "This seabird has not swallowed any of the oil. Why may it still die?",
    options: [
      "Its feathers no longer keep it warm or dry, so it chills or drowns.",
      "The oil soaks through its skin and raises the salt level in its blood.",
      "The oil reflects sunlight onto the bird, so its body temperature soars.",
      "The oil makes it too heavy to fly to the fresh water it needs to drink.",
    ], a: 0,
    why: "Oil mats the feathers together so they no longer trap air: the bird loses its insulation and waterproofing, becomes chilled and can drown. It may also swallow oil as it preens, which poisons it. Oil does not raise the salt level in the blood or overheat the bird, and weight and thirst are not the danger." },
  { id: "PQ2-U6-66", topic: "u6-energy", type: "tap", tier: 1, ref: "6.5/LO4", fig: "P-U6-13",
    q: "This tanker has run onto a rock and its outer hull is holed. Tap the part that stops the oil escaping into the sea.",
    target: "inner-hull",
    why: "MARPOL requires tankers to have a double hull. When the outer hull is holed only the gap floods, and the intact inner hull still holds the oil cargo in. The hole is the damage itself, and neither the gap nor the cargo stops a leak." },

  // ---- u6-plastic ----
  { id: "PQ2-U6-67", topic: "u6-plastic", type: "choice", tier: 1, ref: "6.6/LO2", fig: "P-U6-15",
    q: "Which picture shows the plastic impact that can starve an animal, and how?",
    options: [
      "The right: a turtle mistakes the bag for food, and it blocks its gut.",
      "The left: the netting poisons the turtle within a few hours of touching it.",
      "The right: the bag makes the jellyfish sink, so turtles lose their food.",
      "The left: the netting breaks down in weeks into bits the turtle absorbs.",
    ], a: 0,
    why: "A drifting bag looks like a jellyfish, so turtles eat it; the plastic blocks the gut and the animal starves. Netting kills by entanglement, not by quick poisoning, and plastic takes a very long time to break down. A bag does not make a jellyfish sink." },
  { id: "PQ2-U6-68", topic: "u6-plastic", type: "choice", tier: 1, ref: "6.6/LO2", fig: "P-U6-15",
    q: "How can what is happening in the left picture kill this animal?",
    options: [
      "It cannot reach the surface to breathe, so it drowns.",
      "The netting gives off toxins that dissolve its shell.",
      "The netting blocks sunlight, so its food cannot grow.",
      "It cannot use its gills while it is held in the net.",
    ], a: 0,
    why: "An animal tangled in lost netting or line cannot swim freely and may be held below the surface, so an air-breather such as a turtle drowns. Plastic does not dissolve a shell, netting does not stop its food growing, and a turtle is a reptile that breathes with lungs, not gills." },

  // ---- u6-eutrophication ----
  { id: "PQ2-U6-69", topic: "u6-eutrophication", type: "choice", tier: 2, ref: "6.7/LO2", fig: "P-U6-18",
    q: "Why has this bloom of algae formed where the river meets the sea?",
    options: [
      "Rain has washed dissolved fertiliser off the farmland into the river.",
      "Fertiliser has evaporated from the fields and fallen on the sea as rain.",
      "The river water is less salty, and these algae grow best in fresh water.",
      "The river carries extra oxygen, which the algae need in order to grow.",
    ], a: 0,
    why: "Fertilisers are soluble in water, so rain dissolves them and the run-off carries the nutrients (nitrates and phosphates) down the river to the sea, where algae multiply into a bloom. Fertiliser does not evaporate, these marine algae grow in salt water, and oxygen is not what limits their growth." },

  // ---- u6-climate ----
  { id: "PQ2-U6-51", topic: "u6-climate", type: "choice", tier: 2, ref: "6.8/LO6", fig: "P-U5-15",
    q: "The panels show the same coral over a few weeks, from left to right. Which change in the sea water is the main cause?",
    options: [
      "Its temperature rose above what the coral tolerates.",
      "Its pH rose as more carbon dioxide dissolved in it.",
      "Its depth increased, so less light reached the coral.",
      "Its oxygen rose as the zooxanthellae made more of it.",
    ], a: 0,
    why: "Rising sea temperature is the main cause of bleaching: heat-stressed polyps expel their zooxanthellae. Extra dissolved carbon dioxide lowers the pH rather than raising it, and that acidification can add to the stress. Coral does not bleach because the water gets deeper, and more oxygen would not turn it white." },

  // ---- u6-conservation ----
  { id: "PQ2-U6-70", topic: "u6-conservation", type: "choice", tier: 2, ref: "6.9/LO3", fig: "P-U6-20",
    q: "This fenced area on a beach is part of a conservation project. Which gives one benefit and one limitation of it?",
    options: [
      "More eggs hatch safe from predators, but threats at sea remain.",
      "Most hatchlings survive to adulthood, but the fence is costly.",
      "The hatchlings learn to feed from staff, but few eggs hatch.",
      "Tourists are kept away, but the hatchlings are trapped inside it.",
    ], a: 0,
    why: "Protecting the nests from predators and disturbance lets more eggs hatch and more hatchlings reach the sea, but very few survive to adulthood, because nets, plastic and predators at sea remain, and the project is costly. Hatchlings do not learn to feed from people, and, as the picture shows, they leave the fence and crawl to the sea." },
  { id: "PQ2-U6-71", topic: "u6-conservation", type: "choice", tier: 1, ref: "6.9/LO1", fig: "P-U6-22",
    q: "Which reef has the higher species richness?",
    options: [
      "The right, as it has more different kinds of fish.",
      "The left, as it has far more individual fish in all.",
      "The left, as its single shoal has the most biomass.",
      "The right, as its fish come in more different sizes.",
    ], a: 0,
    why: "Species richness is the number of different species in an area, so the reef with many kinds of fish is richer even though it has fewer fish. The number of individuals and the biomass are different measures, and size alone does not tell species apart." },
];
