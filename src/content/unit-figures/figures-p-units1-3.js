/* Units 1-3 picture questions, batch 2: questions on the NEW style A and style B images P-U1-02 ... P-U3-08,
   drawn by ChatGPT from the reviewed ART-PROMPTS-units1-3.md. The art has arrived (10 Nov 2026): it is in
   public/figs-units/<code>.webp, and every w, h, x and y below was measured by eye on the delivered image
   (grid, place, preview with markers, re-check). Notes: batch3/notes-p-units1-3.md.
   Shape as src/content/figures.js:
     FIGURES[id] = { art: { kind: "img", src, w, h }, hotspots: [{ id, x, y, label }] }
   Choice-only figures carry no hotspots (the app shows choice figures without markers).
   Figure ids are the image codes. Where one image needs a second hotspot set, the variant id adds a
   suffix (P-U1-02-layers, P-U1-12-swim) and points at the same src.
   Composites (made by us in PIL from the delivered files, white background, 20 px gap, no text):
     P-U2-02 = P-U2-02a (left, x 0-600) + P-U2-02b (right, x 620-1220)
     P-U2-04 = P-U2-04 low-tide edit (left) + P-U2-03 high tide (right)
     P-U2-06 = P-U2-06a (left, x 0-600) + P-U2-06b (right, x 620-1220)
     P-U3-03 = P-U3-03 shark (left, style A on white) + existing figdata-img/lp-fish.webp (right)
   Review (prompts): P-U3-10 and PQ2-U3-14 deleted (hatchlings head for the brighter seaward horizon,
   not the Moon's position, so the key taught a wrong mechanism).
   Review (art, 10 Nov 2026): the subduction image shows magma forming in the mantle ABOVE the sinking
   plate, so PQ2-U1-05 and PQ2-U1-06 now say that, not that the plate itself melts.
   No September items are held back for Units 1-3: batch 1 ported all 23 Unit 3 items. */

export const FIGURES_P13 = {
  /* ---------------- Unit 1 ---------------- */
  // Earth cut-away, mantle drawn as SOLID rock. Crust point on the grey cut-face rim (left edge), well away
  // from the volcano; magma on the glowing pool under the volcano.
  "P-U1-02": { art: { kind: "img", src: "figs-units/P-U1-02.webp", w: 800, h: 800 }, hotspots: [
    { id: "crust", x: 233, y: 450, label: "crust" },
    { id: "mantle", x: 660, y: 330, label: "mantle" },
    { id: "outer-core", x: 440, y: 285, label: "outer core" },
    { id: "inner-core", x: 400, y: 400, label: "inner core" },
    { id: "magma", x: 548, y: 150, label: "magma" },
  ] },
  // same image, layers only, labelled by material and state (the w24 angle)
  "P-U1-02-layers": { art: { kind: "img", src: "figs-units/P-U1-02.webp", w: 800, h: 800 }, hotspots: [
    { id: "crust", x: 233, y: 450, label: "thin layer of solid rock" },
    { id: "mantle", x: 660, y: 330, label: "solid rock that can melt" },
    { id: "outer-core", x: 440, y: 285, label: "liquid iron" },
    { id: "inner-core", x: 400, y: 400, label: "solid iron" },
  ] },
  // Earth with magnetic-field loops; crust point on South American land, field point on the second loop out
  "P-U1-03": { art: { kind: "img", src: "figs-units/P-U1-03.webp", w: 800, h: 800 }, hotspots: [
    { id: "core", x: 420, y: 392, label: "iron core" },
    { id: "crust", x: 330, y: 470, label: "rocks of the crust" },
    { id: "ocean", x: 228, y: 420, label: "ocean water" },
    { id: "moon", x: 738, y: 62, label: "Moon" },
    { id: "field", x: 112, y: 400, label: "field lines" },
  ] },
  // subduction block section; plate-contact point on the black contact line below and landward of the
  // trench; melting zone on the glowing patch of mantle ABOVE the slab, below the volcano
  "P-U1-06": { art: { kind: "img", src: "figs-units/P-U1-06.webp", w: 1200, h: 800 }, hotspots: [
    { id: "trench", x: 472, y: 368, label: "ocean trench" },
    { id: "sinking-plate", x: 790, y: 632, label: "sinking plate" },
    { id: "plate-contact", x: 522, y: 470, label: "where the plates touch" },
    { id: "melting-zone", x: 925, y: 555, label: "melting zone" },
    { id: "rising-magma", x: 941, y: 380, label: "rising magma" },
    { id: "volcano", x: 985, y: 185, label: "volcano" },
  ] },
  // three-panel tsunami strip (panels x 5-395, 405-795, 805-1195); one point in each panel's water
  "P-U1-07": { art: { kind: "img", src: "figs-units/P-U1-07.webp", w: 1200, h: 407 }, hotspots: [
    { id: "panel-1", x: 150, y: 192, label: "plates locked" },
    { id: "panel-2", x: 500, y: 182, label: "seabed jolts and displaces water" },
    { id: "panel-3", x: 900, y: 182, label: "wave grows in shallow water" },
  ] },
  // split-level tsunami aftermath (below water: coral, cloudy water; above: mangroves, boats, fields)
  "P-U1-08": { art: { kind: "img", src: "figs-units/P-U1-08.webp", w: 1200, h: 800 }, hotspots: [
    { id: "broken-coral", x: 200, y: 590, label: "broken coral" },
    { id: "cloudy-water", x: 960, y: 560, label: "sediment clouding the water" },
    { id: "uprooted-mangroves", x: 150, y: 250, label: "uprooted mangroves" },
    { id: "wrecked-boats", x: 680, y: 252, label: "wrecked boats and harbour" },
    { id: "flooded-fields", x: 1060, y: 265, label: "farm fields flooded with sea water" },
  ] },
  // second sea-floor profile, coast on the RIGHT (F2 has it on the left)
  "P-U1-10": { art: { kind: "img", src: "figs-units/P-U1-10.webp", w: 1200, h: 421 }, hotspots: [
    { id: "shelf", x: 1020, y: 179, label: "continental shelf" },
    { id: "slope", x: 925, y: 228, label: "continental slope" },
    { id: "abyssal", x: 240, y: 268, label: "abyssal plain" },
    { id: "ridge", x: 405, y: 241, label: "mid-ocean ridge" },
    { id: "trench", x: 122, y: 303, label: "ocean trench" },
    { id: "island", x: 725, y: 193, label: "volcanic island" },
  ] },
  // tide pole (left) and float gauge (right); tube point low in the stilling tube, well below the float
  "P-U1-11": { art: { kind: "img", src: "figs-units/P-U1-11.webp", w: 800, h: 800 }, hotspots: [
    { id: "tide-pole", x: 107, y: 180, label: "tide pole" },
    { id: "float", x: 602, y: 517, label: "float" },
    { id: "tube", x: 608, y: 655, label: "stilling tube" },
    { id: "recorder", x: 425, y: 178, label: "recorder" },
    { id: "sea-surface", x: 330, y: 512, label: "sea surface" },
  ] },
  // aerial rip current; waves on the left of the channel, sandbar (pale shallow sand) on the right
  "P-U1-12": { art: { kind: "img", src: "figs-units/P-U1-12.webp", w: 1200, h: 800 }, hotspots: [
    { id: "rip", x: 600, y: 450, label: "rip current" },
    { id: "waves", x: 250, y: 400, label: "breaking waves" },
    { id: "sandbar", x: 900, y: 590, label: "sandbar" },
    { id: "beach", x: 300, y: 735, label: "beach" },
  ] },
  // same photo with a swimmer (red cap) and three arrows baked in (P-U1-12-swim.webp, Don 11 Nov):
  // markers on the arrow heads: towards the beach, sideways along the shore, out to sea
  "P-U1-12-swim": { art: { kind: "img", src: "figs-units/P-U1-12-swim.webp", w: 1200, h: 800 }, hotspots: [
    { id: "to-beach", x: 605, y: 618, label: "straight back to the beach" },
    { id: "sideways", x: 410, y: 430, label: "sideways, parallel to the shore" },
    { id: "out-to-sea", x: 605, y: 242, label: "further out to sea" },
  ] },

  /* ---------------- Unit 2 ---------------- */
  // composite: polar sea (left), tropical sea (right)
  "P-U2-02": { art: { kind: "img", src: "figs-units/P-U2-02.webp", w: 1220, h: 600 }, hotspots: [
    { id: "ice", x: 400, y: 340, label: "sea ice" },
    { id: "polar-water", x: 350, y: 490, label: "open polar water" },
    { id: "tropical-water", x: 920, y: 400, label: "warm tropical water" },
  ] },
  // estuary at high tide
  "P-U2-03": { art: { kind: "img", src: "figs-units/P-U2-03.webp", w: 1200, h: 800 }, hotspots: [
    { id: "upstream", x: 160, y: 135, label: "river, upstream" },
    { id: "mid", x: 470, y: 280, label: "middle of the estuary" },
    { id: "mouth", x: 720, y: 490, label: "estuary mouth" },
    { id: "open-sea", x: 700, y: 650, label: "open sea" },
  ] },
  // composite: low tide (left, P-U2-04 edit), high tide (right, P-U2-03); choice only
  "P-U2-04": { art: { kind: "img", src: "figs-units/P-U2-04.webp", w: 1820, h: 600 }, hotspots: [] },
  // indicator tubes: left green (fresh, block 7), middle yellow (rain, block 5), right teal (sea, block 8)
  "P-U2-05": { art: { kind: "img", src: "figs-units/P-U2-05.webp", w: 1200, h: 800 }, hotspots: [
    { id: "tube-left", x: 343, y: 410, label: "fresh water" },
    { id: "tube-middle", x: 601, y: 410, label: "rain water" },
    { id: "tube-right", x: 860, y: 410, label: "sea water" },
  ] },
  // composite: hot dry almost-enclosed sea (left), cool wet coast with a river (right). The sun sits in the
  // top-left corner: its point is at the minimum edge margin, on the lower part of the sun's glow.
  "P-U2-06": { art: { kind: "img", src: "figs-units/P-U2-06.webp", w: 1220, h: 600 }, hotspots: [
    { id: "sun", x: 93, y: 70, label: "strong sunshine" },
    { id: "strait", x: 345, y: 186, label: "narrow entrance to the ocean" },
    { id: "desert", x: 530, y: 265, label: "dry desert shore" },
    { id: "river-mouth", x: 895, y: 308, label: "river mouth" },
  ] },
  // sea-surface section; phytoplankton are drawn but deliberately NOT a target (tiny specks)
  "P-U2-08": { art: { kind: "img", src: "figs-units/P-U2-08.webp", w: 800, h: 800 }, hotspots: [
    { id: "surface", x: 470, y: 110, label: "sea surface with breaking waves" },
    { id: "seaweed", x: 110, y: 285, label: "seaweed" },
    { id: "fish", x: 560, y: 350, label: "fish" },
    { id: "deep", x: 400, y: 700, label: "deep, dark water" },
  ] },
  // layered salt solutions with an egg at the middle/bottom boundary
  "P-U2-09": { art: { kind: "img", src: "figs-units/P-U2-09.webp", w: 800, h: 1200 }, hotspots: [
    { id: "top", x: 380, y: 260, label: "top layer" },
    { id: "middle", x: 380, y: 520, label: "middle layer" },
    { id: "bottom", x: 380, y: 900, label: "bottom layer" },
  ] },
  // Secchi pair: all three points in the RIGHT (murky) panel. Review: rope-top dropped (the cleat sits
  // too close to the water line to be 10% of the width from the surface point).
  "P-U2-12": { art: { kind: "img", src: "figs-units/P-U2-12.webp", w: 1200, h: 800 }, hotspots: [
    { id: "surface", x: 931, y: 172, label: "water surface" },
    { id: "disc", x: 930, y: 358, label: "Secchi disc" },
    { id: "seabed", x: 900, y: 720, label: "seabed" },
  ] },

  /* ---------------- Unit 3 ---------------- */
  "P-U3-01": { art: { kind: "img", src: "figs-units/P-U3-01.webp", w: 1200, h: 800 }, hotspots: [] }, // seal hauled out (choice only)
  "P-U3-02": { art: { kind: "img", src: "figs-units/P-U3-02.webp", w: 1200, h: 800 }, hotspots: [] }, // green-type sea turtle (choice only)
  "P-U3-03": { art: { kind: "img", src: "figs-units/P-U3-03.webp", w: 1220, h: 600 }, hotspots: [] }, // composite: shark (left) + lp-fish (right), choice only
  // leatherback cycle: female, eggs, hatchlings, juvenile in a loop; adult male apart, no arrow
  "P-U3-05": { art: { kind: "img", src: "figs-units/P-U3-05.webp", w: 800, h: 800 }, hotspots: [
    { id: "nesting-female", x: 150, y: 140, label: "female digging a nest" },
    { id: "eggs", x: 540, y: 172, label: "eggs buried in the sand" },
    { id: "hatchlings", x: 575, y: 350, label: "hatchlings" },
    { id: "juvenile", x: 370, y: 478, label: "juvenile at sea" },
    { id: "adult-male", x: 330, y: 620, label: "adult male" },
  ] },
  // coral cycle; budding pair (bottom right) sits apart from the sexual loop
  "P-U3-06": { art: { kind: "img", src: "figs-units/P-U3-06.webp", w: 1200, h: 800 }, hotspots: [
    { id: "budding", x: 1092, y: 600, label: "budding" },
    { id: "spawning", x: 178, y: 385, label: "release of eggs and sperm" },
    { id: "surface-eggs", x: 330, y: 122, label: "eggs at the surface" },
    { id: "larvae", x: 698, y: 165, label: "drifting larvae" },
    { id: "settling", x: 825, y: 378, label: "larva attaching to rock" },
    { id: "new-polyp", x: 630, y: 575, label: "new polyp" },
  ] },
  "P-U3-07": { art: { kind: "img", src: "figs-units/P-U3-07.webp", w: 1200, h: 800 }, hotspots: [] }, // nesting leatherback photo (choice only)
  "P-U3-08": { art: { kind: "img", src: "figs-units/P-U3-08.webp", w: 1200, h: 800 }, hotspots: [] }, // day/night water column, LEFT = night (choice only)
};

export const FIGURE_ITEMS_P13 = [
  /* ================= Unit 1 ================= */
  /* ---------------- inside ---------------- */
  { id: "PQ2-U1-01", topic: "inside", type: "label", tier: 1, ref: "1.1/LO3", fig: "P-U1-02-layers",
    q: "This cut-away shows the inside of the Earth. Label each layer with what it is made of.",
    extra: ["liquid rock", "air"],
    why: "The crust is a thin layer of solid rock. The mantle is solid rock too, although it can melt to form magma; it is not a sea of liquid rock. The outer core is liquid iron and the inner core is solid iron, so only part of the iron core is liquid. Air lies above the crust and is not one of the Earth's layers." },
  { id: "PQ2-U1-02", topic: "inside", type: "tap", tier: 2, ref: "1.1/LO3 · 1.2/LO5", fig: "P-U1-02",
    q: "Molten rock is rising beneath the volcano. Tap the layer whose rock melted to form it.", target: "mantle",
    why: "The mantle is solid rock that can melt to form magma, a viscous liquid that rises through the crust to the volcano. The outer core is liquid too, but it is liquid iron, not molten rock. The inner core is solid iron. The crust is the thin layer the magma rises through." },
  { id: "PQ2-U1-03", topic: "inside", type: "tap", tier: 1, ref: "1.1/LO3", fig: "P-U1-02",
    q: "Tap the magma.", target: "magma",
    why: "Magma is molten rock below the surface: here, the glowing channel rising from the mantle to the volcano. The outer core is also liquid, but it is liquid iron, not magma. The mantle is solid rock that can melt to make magma, so the mantle itself is not magma, and the crust is solid rock." },
  { id: "PQ2-U1-04", topic: "inside", type: "tap", tier: 1, ref: "1.1/LO4", fig: "P-U1-03",
    q: "The curved lines show the magnetic field around the Earth. Tap the part that creates this field.", target: "core",
    why: "The Earth's core is made of iron, and the iron core creates the magnetic field. The rocks of the crust and the salty ocean water do not create it. The Moon plays no part: its gravity affects the tides, not magnetism. The lines show the field; they are not its source." },

  /* ---------------- plates ---------------- */
  { id: "PQ2-U1-05", topic: "plates", type: "tap", tier: 1, ref: "1.2/LO5", fig: "P-U1-06",
    q: "Tap the zone where magma forms above the sinking plate.", target: "melting-zone",
    why: "At this convergent boundary, subduction leads to magma formation in the mantle above the descending plate. The magma rises through the crust to the volcano. The trench marks the start of subduction; the shallow plate-contact region is where locking and slipping cause earthquakes." },
  { id: "PQ2-U1-06", topic: "plates", type: "choice", tier: 2, ref: "1.2/LO5", fig: "P-U1-06",
    q: "How did the volcano in this cross-section form?",
    options: [
      "One plate sank beneath the other, magma formed in the mantle above it, then rose and erupted.",
      "One plate ground against the other, friction at the trench melted the rock, then it rose and erupted.",
      "The plates moved apart, magma rose from the mantle into the gap between them, and it built up.",
      "The plates pushed together and squeezed the land upwards, folding it into a tall mountain of rock.",
    ], a: 0,
    why: "At this convergent boundary, one plate is subducted beneath the other. Magma forms in the mantle above the sinking plate, rises through the crust and erupts. This is different from plates moving apart at a divergent boundary or the crust being folded into mountains." },

  /* ---------------- quakes ---------------- */
  { id: "PQ2-U1-07", topic: "quakes", type: "tap", tier: 2, ref: "1.2/LO5", fig: "P-U1-06",
    q: "Tap the place between the two plates where they lock together, then suddenly slip and cause an earthquake.", target: "plate-contact",
    why: "Earthquakes start where the plates are in contact. They stick (lock), tension builds as the plates keep moving, and then they suddenly slip, releasing a large amount of energy. The trench is the dip in the sea floor where the sinking plate starts to go down, not the surface the plates grip along. Melting happens deeper, in the mantle, and the volcano is fed by magma, not by the slip." },
  { id: "PQ2-U1-09", topic: "quakes", type: "choice", tier: 2, ref: "1.2/LO6", fig: "P-U1-07",
    q: "Why is the wave much taller in the right-hand panel than in the middle panel?",
    options: [
      "It has reached shallow water near the coast.",
      "The wind blows more strongly close to land.",
      "The Moon's pull is stronger near the coast.",
      "More of the seabed moves as the wave travels.",
    ], a: 0,
    why: "A tsunami grows in height as it moves into shallow water near land; out in the deep ocean it is low. It is not a wind wave, so wind does not build it, and it is not a tide, so the Moon is not involved. The seabed moves once, at the start; it does not keep moving as the wave travels." },
  { id: "PQ2-U1-10", topic: "quakes", type: "multi", tier: 2, ref: "1.2/LO7", fig: "P-U1-08",
    q: "A tsunami has just hit this coast. Tick every effect on the marine ecosystem that the picture shows.",
    options: [
      "coral broken into pieces on the seabed",
      "mangrove trees pulled out by their roots",
      "seabed sediment stirred up, clouding the water",
      "fishing boats wrecked in the harbour",
      "farm fields flooded with sea water",
      "the sea made permanently less salty",
    ], a: [0, 1, 2],
    why: "Broken coral, uprooted mangroves and sediment clouding the water are damage to marine habitats and the organisms living in them. Wrecked boats and flooded fields are real tsunami effects, but they are effects on the human coastal community, not on the marine ecosystem. A tsunami does not make the sea permanently less salty, and nothing in the picture shows that." },

  /* ---------------- floor ---------------- */
  { id: "PQ2-U1-12", topic: "floor", type: "label", tier: 1, ref: "1.3/LO6", fig: "P-U1-10",
    q: "Label the six features of the ocean floor shown in this profile.",
    extra: ["coral reef", "estuary"],
    why: "Going out from the right-hand coast: the continental shelf is the shallow, gently sloping platform, the continental slope is the steep drop to the deep floor, and the abyssal plain is the flat deep floor. The mid-ocean ridge is the underwater mountain chain where plates move apart. The ocean trench is the deep, narrow dip where one plate is forced beneath another, here beside the left-hand continent. The volcanic island rises from the sea floor to above sea level." },
  { id: "PQ2-U1-13", topic: "floor", type: "tap", tier: 1, ref: "1.3/LO6 · 1.2/LO4", fig: "P-U1-10",
    q: "Tap the feature that forms where two plates are moving apart.", target: "ridge",
    why: "A mid-ocean ridge forms at a divergent boundary: the plates move apart and magma rises into the gap, building an underwater mountain chain. A trench forms where one plate is forced beneath another, the opposite movement. A volcanic island is a volcano grown above sea level; islands can form in several settings, so it is not the feature that marks plates moving apart. The slope and shelf are the edge of a continent." },

  /* ---------------- tides ---------------- */
  { id: "PQ2-U1-14", topic: "tides", type: "tap", tier: 1, ref: "1.4/LO2", fig: "P-U1-11",
    q: "Two ways of measuring the height of the sea are shown. Tap the equipment that a person must read by eye each time.", target: "tide-pole",
    why: "The tide pole is a fixed vertical scale: someone must look at where the sea surface meets the marks and write the height down, for example every hour. The float, the tube and the recorder work together as an automatic tide gauge: the float rises and falls with the water in the tube, and the recorder keeps a continuous record. The sea surface is what is being measured, not equipment." },
  { id: "PQ2-U1-15", topic: "tides", type: "choice", tier: 2, ref: "1.4/LO2", fig: "P-U1-11",
    q: "Both methods are used for the same 24 hours. The pole is read once an hour, and the recorder marks the height every few minutes. Why is the recorder more likely to give the true height of low tide?",
    options: [
      "Its readings are so close together that the lowest point is hard to miss.",
      "It records over a longer period of time, so it is sure to include the low tide.",
      "It measures how far the water moves along the beach as well as its height.",
      "It takes one reading exactly at low tide, and a single reading is enough.",
    ], a: 0,
    why: "The water height changes smoothly, and the true low tide is one moment on that curve. With readings an hour apart the lowest moment can fall between two readings and be missed, so the lowest reading is a little too high; readings every few minutes are far less likely to miss it. Both methods run for the same 24 hours, so the length of time is not the difference. Tidal amplitude depends on the height of the water, not how far it moves along the beach, and one reading cannot show which moment was the lowest." },
  { id: "PQ2-U1-16", topic: "tides", type: "tap", tier: 1, ref: "1.4/LO8", fig: "P-U1-12",
    q: "This beach is seen from above. Tap where a rip current is flowing.", target: "rip",
    why: "The rip current is the narrow channel of darker, calmer-looking water running out to sea through the gap in the breaking waves. Waves push water onto the shore, and it flows back out through the gap as a fast, narrow current. The calm look is what fools swimmers. The white breaking waves move towards the shore, the sandbar is the pale, shallow sand under the water beside the channel, and the beach is dry land." },
  { id: "PQ2-U1-17", topic: "tides", type: "tap", tier: 2, ref: "1.4/LO8", fig: "P-U1-12-swim",
    q: "A swimmer (red cap) is being carried out to sea in this rip current. The arrows show three ways they could swim. Tap the way they should swim first.", target: "sideways",
    why: "Swimming parallel to the shore takes the swimmer sideways out of the narrow current; then they can swim back to the beach with the waves. Swimming straight for the beach means fighting a current that flows faster than most people can swim, so they tire. Heading further out makes the way back longer. A rip current carries swimmers out to sea; it does not pull them under." },

  /* ================= Unit 2 ================= */
  /* ---------------- u2-water ---------------- */
  { id: "PQ2-U2-01", topic: "u2-water", type: "choice", tier: 2, ref: "2.1/LO8", fig: "P-U2-02",
    q: "From which sea will water evaporate faster, and why?",
    options: [
      "the right-hand sea, as its warm particles have more energy to escape",
      "the left-hand sea, as cold water is fresher and so evaporates more easily",
      "neither sea, as water needs to reach its boiling point before it evaporates",
      "the left-hand sea, as its ice adds extra water at the surface to evaporate",
    ], a: 0,
    why: "In the warm tropical sea the water particles have more kinetic energy, so more of them can escape from the surface and evaporation is faster. In the cold polar sea the particles have less energy, and the ice cover stops evaporation from much of the surface. Being fresher does not make water evaporate faster, and evaporation happens at any temperature, far below the boiling point." },

  /* ---------------- u2-salinity ---------------- */
  { id: "PQ2-U2-03", topic: "u2-salinity", type: "tap", tier: 1, ref: "2.2/LO11", fig: "P-U2-03",
    q: "A river flows through this estuary into the sea. Tap the place where the salinity is lowest.", target: "upstream",
    why: "Upstream the water is fresh river water, so the salinity is lowest there. Through the estuary the river water mixes with sea water, so salinity rises towards the mouth, and the open sea is saltiest. River water is not saltier than the sea: it carries only a little dissolved salt, and its overall effect is to dilute." },
  { id: "PQ2-U2-04", topic: "u2-salinity", type: "choice", tier: 2, ref: "2.2/LO11", fig: "P-U2-04",
    q: "The two pictures show the same estuary at different stages of the tide, with the buoy in the same place. In which picture is the water at the buoy saltier, and why?",
    options: [
      "the right, as the rising tide has pushed sea water up the estuary",
      "the left, as less water at low tide leaves the salt more concentrated",
      "the left, as the river stops flowing into the estuary at low tide",
      "neither, as the salinity at one place in an estuary stays the same",
    ], a: 0,
    why: "As the tide rises, sea water pushes up the estuary, so the water at the buoy is saltier at high tide, in the right-hand picture. As the tide falls the sea water drains out and river water takes over, so salinity falls at low tide. Low water does not concentrate the salt, a common exam error; the river keeps flowing at every stage of the tide; and salinity in an estuary changes through every tidal cycle." },
  { id: "PQ2-U2-05", topic: "u2-salinity", type: "tap", tier: 1, ref: "2.2/LO2 · 2.2/LO3", fig: "P-U2-05",
    q: "Universal indicator was added to samples of sea water, fresh water and rain water. The colour chart runs from pH 1 on the left to pH 14 on the right. Tap the tube that holds rain water.", target: "tube-middle",
    why: "Rain water is slightly acidic, because carbon dioxide from the air dissolves in it, so the indicator turns yellow, on the acid side of the chart. Fresh water is about neutral, so its tube is green, near the middle of the chart. Sea water is slightly alkaline, so its tube is blue-green, just on the alkaline side. Rain water is not neutral just because it seems pure." },
  { id: "PQ2-U2-06", topic: "u2-salinity", type: "choice", tier: 1, ref: "2.2/LO2 · 2.2/LO3", fig: "P-U2-05",
    q: "The right-hand tube holds sea water with universal indicator added. The colour chart runs from pH 1 on the left to pH 14 on the right. What does the colour show?",
    options: [
      "It is slightly alkaline.",
      "It is slightly acidic.",
      "It is exactly neutral.",
      "It has a very high salinity.",
    ], a: 0,
    why: "Blue-green lies just past green, on the alkaline side of the chart, so the sea water is slightly alkaline (about pH 8). A slightly acidic sample turns yellow or orange, and a neutral one is green. Universal indicator shows pH only; it does not measure how salty the water is." },
  { id: "PQ2-U2-07", topic: "u2-salinity", type: "choice", tier: 2, ref: "2.2/LO8 · 2.2/LO9", fig: "P-U2-06",
    q: "Which of these two seas will have the higher salinity, and why?",
    options: [
      "the left, as high evaporation and few rivers concentrate the salts",
      "the right, as its rivers wash extra salt from the rocks into the sea",
      "the right, as the cool water is denser, so it holds more dissolved salt",
      "the left, as its narrow entrance lets more salt flow in from the ocean",
    ], a: 0,
    why: "In the hot, dry sea strong sunshine evaporates water and leaves the salts behind, and there is little rain and almost no river water to dilute it; the Red Sea is a real example. The cool, wet coast gets plenty of rain and river water, which lower salinity, as in the Baltic Sea. Rivers carry a little salt from eroded rocks, but their main effect is dilution. The narrow entrance limits mixing with the ocean rather than bringing salt in, and density does not decide how much salt a sea holds." },

  /* ---------------- u2-gases ---------------- */
  { id: "PQ2-U2-09", topic: "u2-gases", type: "tap", tier: 1, ref: "2.3/LO1", fig: "P-U2-08",
    q: "Tap where oxygen from the atmosphere enters the sea water.", target: "surface",
    why: "Gases from the air dissolve into the sea at the surface, and breaking waves mix air into the water and help this. The seaweed adds oxygen too, but it makes it by photosynthesis rather than taking it from the atmosphere. The fish use oxygen up in respiration, and the deep water is furthest from the air." },
  { id: "PQ2-U2-10", topic: "u2-gases", type: "tap", tier: 1, ref: "2.3/LO1 · 2.5/LO6", fig: "P-U2-08",
    q: "Tap the organism that adds oxygen to the water by photosynthesis.", target: "seaweed",
    why: "The seaweed lives in the sunlit water and photosynthesises, giving out oxygen that dissolves in the water around it. The tiny green specks are phytoplankton, which photosynthesise too, but they are not marked. The surface is where oxygen dissolves from the atmosphere, not where it is made. The fish take oxygen in for respiration rather than adding it. In the dark deep water there is no light, so no photosynthesis can happen." },

  /* ---------------- u2-density ---------------- */
  { id: "PQ2-U2-11", topic: "u2-density", type: "tap", tier: 2, ref: "2.4/LO3", fig: "P-U2-09",
    q: "Three salt solutions of different salinity were poured gently into this cylinder and formed layers. Tap the layer with the highest salinity.", target: "bottom",
    why: "Saltier water is denser, and denser liquid sinks below less dense liquid, so the most saline solution forms the bottom layer and the least saline one floats on top. The colours are only dyes that make the layers visible; they show nothing about salinity." },
  { id: "PQ2-U2-12", topic: "u2-density", type: "choice", tier: 2, ref: "2.4/LO3 · 2.4/LO1", fig: "P-U2-09",
    q: "Why does the egg stay at the level shown in the cylinder?",
    options: [
      "It is denser than the upper layers but less dense than the bottom layer.",
      "It is less dense than the upper layers but denser than the bottom layer.",
      "It has the same density as all three layers, so it can rest at any level.",
      "The salt in the bottom layer pushes it upwards, whatever its density is.",
    ], a: 0,
    why: "An object sinks through a liquid that is less dense than itself and floats on one that is denser. The egg has sunk through the two upper layers, so it is denser than they are, and it floats on the bottom layer, so it is less dense than that. If it matched the density of all three it would not settle at one boundary. Salt raises the density of the water; it does not push objects up whatever their density." },

  /* ---------------- u2-depth ---------------- */
  { id: "PQ2-U2-13", topic: "u2-depth", type: "choice", tier: 2, ref: "2.5/LO3 · 2.5/LO2", fig: "P-U2-12",
    q: "A Secchi disc was lowered at two sites, as shown. At which site does light penetrate further into the water?",
    options: [
      "the left site, as the disc stays visible to a greater depth",
      "the right site, as the disc fades out nearer the surface",
      "neither site, as the seabed lies at the same depth at each site",
      "the left site, as clear water there must be less salty",
    ], a: 0,
    why: "The deeper a Secchi disc can still be seen, the clearer the water and the further light penetrates. At the left site the disc is still visible deep down; at the right site, in murky water, it fades out close to the surface, so light penetrates less there. Light penetration varies with how clear the water is, not with how deep the seabed is, and a Secchi disc tells you nothing about salinity." },
  { id: "PQ2-U2-14", topic: "u2-depth", type: "tap", tier: 2, ref: "2.5/LO3", fig: "P-U2-12",
    q: "In the right-hand picture the disc has been lowered until it just disappears from view. The Secchi depth is measured from the water surface. Tap the point it is measured down to.", target: "disc",
    why: "The Secchi depth is the depth at which the disc just disappears, measured along the rope from the water surface down to the disc. The water surface is the zero of the measurement, not the reading. The seabed is not involved: a Secchi disc measures how far light penetrates, not how deep the water is." },

  /* ================= Unit 3 ================= */
  /* ---------------- u3-animals ---------------- */
  { id: "PQ2-U3-01", topic: "u3-animals", type: "choice", tier: 1, ref: "3.4/LO1", fig: "P-U3-01",
    q: "Which feature, visible in this photo, places this animal in the mammals?",
    options: ["hair covering its body", "flippers instead of legs", "a smooth, streamlined shape", "it rests out of the water"], a: 0,
    why: "Hair (fur) is the mammal skin covering; even wet and sleek, this seal's body is covered in short fur. Flippers and a streamlined shape are found in turtles and penguins too, so they do not decide the group. Resting out of the water, like breathing air, is also true of reptiles and birds." },
  { id: "PQ2-U3-02", topic: "u3-animals", type: "choice", tier: 1, ref: "3.4/LO2", fig: "P-U3-01",
    q: "Which group of marine animals does this animal belong to?",
    options: ["pinnipeds", "cetaceans", "sirenians", "sea snakes"], a: 0,
    why: "Seals are pinnipeds: mammals with flippers that haul out on land or ice to rest and breed, as this one has. Cetaceans (whales and dolphins) and sirenians (manatees and dugongs) are also marine mammals, but they live entirely in the water. Sea snakes are reptiles." },
  { id: "PQ2-U3-03", topic: "u3-animals", type: "choice", tier: 2, ref: "3.4/LO1", fig: "P-U3-02",
    q: "This animal comes to the surface to breathe air with lungs. Which vertebrate group is it in?",
    options: ["reptiles", "bony fish", "mammals", "seabirds"], a: 0,
    why: "Its head and flippers are covered in scales, and it breathes with lungs: scales together with lungs place it with the reptiles. Fish also have scales, but they use gills. Mammals breathe with lungs but are covered in hair, and birds have feathers. Coming up to breathe air does not make an animal a mammal." },
  { id: "PQ2-U3-04", topic: "u3-animals", type: "choice", tier: 2, ref: "3.4/LO2", fig: "P-U3-03",
    q: "Both of these animals are fish. Which statement about them is correct?",
    options: [
      "The left fish is cartilaginous; the right fish is bony.",
      "The left fish is bony; the right fish is cartilaginous.",
      "Both are cartilaginous, as both have fins and gills.",
      "Both are bony fish, as both have scales and fins.",
    ], a: 0,
    why: "The left fish is a shark, and sharks are cartilaginous fish: its gill slits are open, with no gill cover. The right fish is a sea bream, a bony fish, and a bony operculum covers its gills. Both groups have fins and gills, so those features cannot separate them." },

  /* ---------------- u3-lifecycle ---------------- */
  { id: "PQ2-U3-05", topic: "u3-lifecycle", type: "tap", tier: 1, ref: "3.6/LO1", fig: "P-U3-05",
    q: "This diagram shows the life cycle of the leatherback turtle. Tap the stage at which temperature decides whether the young will be male or female.", target: "eggs",
    why: "The temperature of incubation in the buried nest determines the sex of the offspring, so it is decided while the eggs lie in the sand. The sex is not fixed when the eggs are fertilised or laid, and it is already set by the time the hatchlings head for the sea. Juveniles and adults at sea do not change sex." },
  { id: "PQ2-U3-06", topic: "u3-lifecycle", type: "tap", tier: 1, ref: "3.6/LO1", fig: "P-U3-05",
    q: "Tap the adult that never comes ashore.", target: "adult-male",
    why: "Male leatherbacks live entirely at sea. Only adult females come ashore, to dig nests and lay eggs on the beach where they hatched. Hatchlings cross the beach once, on their way to the sea, and juveniles stay at sea while they feed and grow. Males do not come ashore to mate." },
  { id: "PQ2-U3-07", topic: "u3-lifecycle", type: "tap", tier: 2, ref: "3.6/LO1", fig: "P-U3-05",
    q: "Tap the stage that comes back to the beach to breed only every 2 to 5 years.", target: "nesting-female",
    why: "Adult females reproduce every 2 to 5 years. In a nesting year they return to the sandy shore where they hatched, dig nests and lay eggs several times about 10 days apart, then bury the eggs and leave. Males never return to land, juveniles are not yet mature (that takes 15 to 25 years), and eggs and hatchlings are on the beach only once." },
  { id: "PQ2-U3-08", topic: "u3-lifecycle", type: "tap", tier: 1, ref: "3.6/LO2 · 3.2/LO1", fig: "P-U3-06",
    q: "This diagram shows the life cycle of a coral polyp. Tap the stage that is asexual reproduction.", target: "budding",
    why: "Budding is asexual: one parent polyp produces a new polyp next to itself, an exact copy, with no sex cells. The release of eggs and sperm into the water is sexual reproduction, and the eggs, larvae and settling larva all come from that sexual route." },
  { id: "PQ2-U3-09", topic: "u3-lifecycle", type: "tap", tier: 2, ref: "3.6/LO2", fig: "P-U3-06",
    q: "Tap the stage that swims towards the light, feeds and grows while being carried along by currents.", target: "larvae",
    why: "Fertilised eggs float to the surface and form planktonic larvae. The larvae swim towards the light, feed and grow, and are moved by currents, which spreads them far from the parent coral. The eggs at the surface have not yet become larvae, the settling larva has stopped drifting, and polyps are fixed in place." },
  { id: "PQ2-U3-10", topic: "u3-lifecycle", type: "tap", tier: 1, ref: "3.6/LO2", fig: "P-U3-06",
    q: "Tap the stage where a larva attaches itself to a hard surface.", target: "settling",
    why: "After drifting, a larva descends and attaches to a hard surface such as rock, where it grows into a new polyp. Fertilised eggs do not settle next to the parent; they float up to the surface first. The new polyp is the stage after attachment, and budding is the separate asexual route." },
  { id: "PQ2-U3-11", topic: "u3-lifecycle", type: "choice", tier: 2, ref: "3.6/LO1", fig: "P-U3-07",
    q: "What is this female leatherback doing on the beach, and what will she do next?",
    options: [
      "digging a nest; she will bury her eggs and go back to sea",
      "digging a nest; she will stay to guard her eggs until they hatch",
      "digging for food in the sand; she will then go back to sea",
      "resting out of the water; she will stay on the beach for weeks",
    ], a: 0,
    why: "She is using her flippers to excavate a nest in the sand. After laying, she buries the eggs and returns to the sea; she does not guard them, which is a common exam error. She will come back to lay again several times, about 10 days apart. Leatherbacks feed at sea, and come ashore only to nest." },

  /* ---------------- u3-migration ---------------- */
  { id: "PQ2-U3-12", topic: "u3-migration", type: "choice", tier: 2, ref: "3.7/LO3 · 3.7/LO2", fig: "P-U3-08",
    q: "The two panels show the same shrimp and lanternfish, once by day and once at night. Which statement is correct?",
    options: [
      "The left is night: they rise to feed in the sunlit water in the dark.",
      "The right is night: they sink to feed in the twilight zone in the dark.",
      "The left is night: they rise to escape the cold deep water at night.",
      "The right is night: they sink because their food sinks after dark.",
    ], a: 0,
    why: "These animals make a daily vertical migration. At dusk they rise from the twilight zone to the sunlight zone, where the plankton and other food are, and feed under cover of darkness, so the left panel is night. At dawn they sink back to the dim twilight zone. They are not escaping cold or following food downwards: there is little food at depth." },
  { id: "PQ2-U3-13", topic: "u3-migration", type: "choice", tier: 2, ref: "3.7/LO3", fig: "P-U3-08",
    q: "In the right-hand panel the shrimp and lanternfish are far below the predator, in the dim twilight zone. Why are they down there?",
    options: [
      "to stay hidden from predators that hunt by sight",
      "because there is more food down in the twilight zone",
      "to escape the warmer water close to the surface",
      "because the water pressure is lower in the deep water",
    ], a: 0,
    why: "This is the daytime panel. By day the sunlit surface water is dangerous, because predators such as the fish near the surface hunt by sight; in the dim twilight zone the shrimp are much harder to see. There is little food at depth, which is why they rise at night to feed. They are not avoiding warm water, and the pressure is higher in the deep, not lower." },
  { id: "PQ2-U3-15", topic: "u3-migration", type: "choice", tier: 2, ref: "3.7/LO5 · 1.1/LO4", fig: "P-U1-03",
    q: "A turtle crossing the open ocean has no landmarks to follow. It finds its way using what the curved lines around this Earth show. Which method is it using?",
    options: ["the Earth's magnetic field", "the location of the Moon and stars", "olfaction (smell)", "mental maps and landmarks"], a: 0,
    why: "The curved lines show the magnetic field created by the Earth's iron core. Turtles can sense it, and it works in the open ocean where there are no landmarks. The Moon is in the picture, and the location of the Moon and stars is another navigation cue, but the lines do not show it. Olfaction (detecting chemicals) and mental maps of landmarks do not use the field at all." },
];
