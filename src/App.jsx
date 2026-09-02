import React, { useState, useEffect, useMemo, useRef } from "react";

/* ========================================================================
   MARINE SCIENCE IGCSE — UNIT 1: EARTH AND OCEANS
   Built in three layers, in this order:
     1. Scheduler engine  (retrieval loop + spaced repetition)
     2. Question shapes   (recognise / retrieve / connect / explain)
     3. Visual + reward   (dive map, ocean discoveries)
   No timers. No lives. No streaks. Nothing is ever taken away.
   ======================================================================== */

/* ---------------------------------------------------------------- tokens */
const C = {
  abyss: "#04141F",
  deep: "#0A2A3D",
  shelf: "#12455F",
  raise: "#17546F",
  line: "#1E6A87",
  foam: "#EAF6F5",
  mist: "#A9C7D2",
  glow: "#4FD8C4",
  glowDim: "#2A9C90",
  coral: "#FF7A5C",
  sand: "#F2D9A8",
  ok: "#4FD8C4",
  no: "#FF9E7D",
};

const FONT_UI = "'Karla', ui-sans-serif, system-ui, sans-serif";
const FONT_DISPLAY = "'Fraunces', Georgia, serif";

/* ------------------------------------------------------------- content */
const TOPICS = [
  { id: "space", name: "Earth in space", depth: "Surface" },
  { id: "inside", name: "Inside the Earth", depth: "10 m" },
  { id: "plates", name: "Plate boundaries", depth: "60 m" },
  { id: "quakes", name: "Earthquakes and tsunamis", depth: "200 m" },
  { id: "oceans", name: "Seas and oceans", depth: "800 m" },
  { id: "floor", name: "The ocean floor", depth: "2,400 m" },
  { id: "coords", name: "Latitude and longitude", depth: "5,000 m" },
  { id: "tides", name: "Tides and currents", depth: "10,900 m" },
];

const RANK = { choice: 1, gap: 2, match: 3, multi: 3, chain: 4 };
const SHAPE_NAME = {
  choice: "Recognise",
  gap: "Retrieve",
  match: "Connect",
  multi: "Connect",
  chain: "Explain",
};

const ITEMS = [
  /* ---------------------------------------------------- Earth in space */
  {
    id: "sp1", topic: "space", type: "choice",
    q: "What is a natural satellite?",
    options: [
      "A celestial body that orbits another larger body",
      "A machine placed in orbit to send signals back to Earth",
      "Any large rock floating in space",
      "A star that a planet orbits around",
    ],
    a: 0,
    why: "Natural means it wasn't built and launched. The Moon is Earth's natural satellite.",
  },
  {
    id: "sp2", topic: "space", type: "choice",
    q: "What causes Earth's seasons?",
    options: [
      "The tilt of Earth's axis",
      "Earth moving closer to and further from the Sun",
      "Changes in how much energy the Sun gives out",
      "The Moon blocking sunlight at certain times of year",
    ],
    a: 0,
    why: "The tilt means different parts of Earth receive more direct sunlight at different times of the year.",
  },
  {
    id: "sp3", topic: "space", type: "gap",
    q: "Complete the definition.",
    segments: ["A natural satellite is a celestial ", " that ", " another larger body."],
    answers: ["body", "orbits"],
    bank: ["body", "orbits", "moon", "heats", "star", "crosses"],
    why: "Any body orbiting a larger one counts — moons orbit planets, planets orbit stars.",
  },
  {
    id: "sp4", topic: "space", type: "multi",
    q: "Select every statement that is true about Earth's seasons.",
    options: [
      "Earth's axis is tilted",
      "Different parts of Earth get more direct sun at different times of year",
      "Seasons happen because Earth's orbit is a perfect circle",
      "The whole Earth has summer at the same time",
    ],
    a: [0, 1],
    why: "When the northern hemisphere leans towards the Sun it is summer there and winter in the south — never both at once.",
  },
  {
    id: "sp5", topic: "space", type: "chain",
    q: "Build the explanation: why does the northern hemisphere have summer in June?",
    chunks: [
      "Earth's axis is tilted",
      "in June the northern hemisphere leans towards the Sun",
      "so sunlight strikes it more directly",
      "which heats that half of Earth more",
      "giving summer",
    ],
    why: "Tilt → lean → direct sunlight → more heating → summer. The tilt is the cause; the heating is the effect.",
  },

  /* -------------------------------------------------- Inside the Earth */
  {
    id: "in1", topic: "inside", type: "choice",
    q: "What are the four main layers of the Earth, from outside inwards?",
    options: [
      "Crust, mantle, outer core, inner core",
      "Crust, outer core, mantle, inner core",
      "Mantle, crust, inner core, outer core",
      "Crust, mantle, inner core, outer core",
    ],
    a: 0,
    why: "Crust, mantle, outer core, inner core. The outer core is liquid; the inner core is solid.",
  },
  {
    id: "in2", topic: "inside", type: "choice",
    q: "What keeps tectonic plates moving?",
    options: [
      "Convection currents in the mantle",
      "The pull of the Moon's gravity",
      "Ocean currents pushing against the crust",
      "The spin of the Earth on its axis",
    ],
    a: 0,
    why: "Heat from the core drives rising and falling magma in the mantle, and the plates ride on top of it.",
  },
  {
    id: "in3", topic: "inside", type: "gap",
    q: "Complete the description of a convection current.",
    segments: ["Heat from Earth's ", " makes magma in the mantle ", ". When it reaches the crust it cools and ", "."],
    answers: ["core", "rise", "sinks"],
    bank: ["core", "rise", "sinks", "crust", "melts", "spreads"],
    why: "Rise, cool, sink, repeat — that loop is the convection current.",
  },
  {
    id: "in4", topic: "inside", type: "match",
    q: "Match each layer to its description.",
    pairs: [
      ["Crust", "Thin outer layer we live on"],
      ["Mantle", "Where convection currents flow"],
      ["Outer core", "Liquid layer around the centre"],
      ["Inner core", "Solid centre of the Earth"],
    ],
    why: "The mantle is the layer that matters most for plate movement.",
  },
  {
    id: "in5", topic: "inside", type: "chain",
    q: "Build the explanation: why are tectonic plates always moving?",
    chunks: [
      "heat from Earth's core warms the mantle",
      "hot magma rises towards the crust",
      "at the crust it cools and sinks again",
      "this creates a convection current",
      "which drags the plates sitting above it",
    ],
    why: "The chain runs heat → rise → cool → sink → current → plates drag. Naming convection currents alone isn't the full explanation.",
  },

  /* --------------------------------------------------- Plate boundaries */
  {
    id: "pl1", topic: "plates", type: "choice",
    q: "What are the three main tectonic plate boundaries?",
    options: [
      "Divergent, convergent, transform",
      "Divergent, subduction, lateral",
      "Convergent, transform, oceanic",
      "Constructive, destructive, tectonic",
    ],
    a: 0,
    why: "Divergent (apart), convergent (together), transform (sliding past).",
  },
  {
    id: "pl2", topic: "plates", type: "choice",
    q: "Which plate boundary can form mid-ocean ridges?",
    options: ["Divergent", "Convergent", "Transform", "None of them"],
    a: 0,
    why: "Plates pulling apart leave a gap that magma fills, building a ridge.",
  },
  {
    id: "pl3", topic: "plates", type: "gap",
    q: "Complete the sentence.",
    segments: ["At a ", " boundary two plates move apart, which can form a mid ocean ", "."],
    answers: ["divergent", "ridge"],
    bank: ["divergent", "ridge", "convergent", "trench", "transform", "valley"],
    why: "Divergent boundaries build new crust; that's why they're also called constructive.",
  },
  {
    id: "pl4", topic: "plates", type: "match",
    q: "Match each boundary to the plate movement.",
    pairs: [
      ["Divergent", "Plates move apart"],
      ["Convergent", "Plates move together"],
      ["Transform", "Plates slide past each other"],
    ],
    why: "Transform boundaries don't build or destroy crust — they just grind sideways.",
  },
  {
    id: "pl5", topic: "plates", type: "chain",
    q: "Build the explanation: how does a mid-ocean ridge form?",
    chunks: [
      "two plates meet at a divergent boundary",
      "the plates move apart",
      "magma rises into the gap between them",
      "the magma cools to form new crust",
      "building a ridge along the ocean floor",
    ],
    why: "The ridge is new crust. That's the link most answers miss.",
  },

  /* --------------------------------------------- Earthquakes & tsunamis */
  {
    id: "eq1", topic: "quakes", type: "choice",
    q: "What causes an earthquake?",
    options: [
      "Plates get stuck, pressure builds, then releases suddenly",
      "Magma exploding out through the crust",
      "Large ocean waves striking the coastline",
      "The mantle cooling down and shrinking",
    ],
    a: 0,
    why: "Stuck → pressure builds → sudden slip → energy released as shaking.",
  },
  {
    id: "eq2", topic: "quakes", type: "choice",
    q: "What is a tsunami?",
    options: [
      "Huge tall waves caused by earthquakes or volcanoes beneath the sea",
      "A strong current that pulls swimmers away from the shore",
      "The highest tide of the month",
      "A large wave built up by very strong wind",
    ],
    a: 0,
    why: "Tsunamis come from the seabed moving, not from wind. They can reach 100ft on land.",
  },
  {
    id: "eq3", topic: "quakes", type: "gap",
    q: "Complete the sentence.",
    segments: ["Tsunamis form because of ", " or ", " beneath the sea, and can reach 100ft when they hit ", "."],
    answers: ["earthquakes", "volcanoes", "land"],
    bank: ["earthquakes", "volcanoes", "land", "tides", "gyres", "reefs"],
    why: "Both causes involve the seabed suddenly shifting and displacing a huge volume of water.",
  },
  {
    id: "eq4", topic: "quakes", type: "multi",
    q: "Select every impact a tsunami has on marine life.",
    options: [
      "Damage to coral reefs",
      "Seabed erosion",
      "Uprooting mangroves",
      "Washing up and killing marine species",
      "Permanently raising ocean salinity",
      "Cooling the deep ocean",
    ],
    a: [0, 1, 2, 3],
    why: "Also damage to coastal plants and vegetation. The impacts are physical destruction, not chemical change.",
  },
  {
    id: "eq5", topic: "quakes", type: "chain",
    q: "Build the explanation: how does an earthquake happen at a plate boundary?",
    chunks: [
      "two plates try to move past each other",
      "friction makes them stick together",
      "pressure builds up in the rock",
      "the plates suddenly slip free",
      "releasing energy that shakes the ground",
    ],
    why: "Stick, build, slip, shake. The shaking is released energy, not the plates themselves hitting.",
  },

  /* ------------------------------------------------------ Seas & oceans */
  {
    id: "oc1", topic: "oceans", type: "choice",
    q: "What is the main difference between a sea and an ocean?",
    options: [
      "Seas are smaller and usually partly enclosed by land",
      "Seas contain more salt than oceans",
      "Seas are freshwater and oceans are saltwater",
      "Oceans are always fully enclosed by land",
    ],
    a: 0,
    why: "Oceans are larger and deeper. A sea can also be a region within an ocean.",
  },
  {
    id: "oc2", topic: "oceans", type: "choice",
    q: "Which is the largest and deepest ocean?",
    options: ["Pacific", "Atlantic", "Indian", "Southern"],
    a: 0,
    why: "The Pacific holds the Mariana Trench, the deepest point on the planet.",
  },
  {
    id: "oc3", topic: "oceans", type: "gap",
    q: "Complete the comparison.",
    segments: ["A sea is ", " than an ocean and is often partly enclosed by ", ". A sea can also be a region of an ", "."],
    answers: ["smaller", "land", "ocean"],
    bank: ["smaller", "land", "ocean", "larger", "ice", "gyre"],
    why: "The Mediterranean is a sea almost enclosed by land; the Sargasso Sea sits inside the Atlantic.",
  },
  {
    id: "oc4", topic: "oceans", type: "multi",
    q: "Select the five world oceans.",
    options: ["Pacific", "Atlantic", "Arctic", "Indian", "Southern", "Caribbean", "Mediterranean"],
    a: [0, 1, 2, 3, 4],
    why: "The Caribbean and Mediterranean are seas, not oceans.",
  },
  {
    id: "oc5", topic: "oceans", type: "multi",
    q: "Select every statement that is true about a sea.",
    options: [
      "It is usually smaller than an ocean",
      "It is normally partially enclosed by land",
      "It can be a region of an ocean",
      "It is always deeper than an ocean",
      "It contains fresh water rather than salt water",
    ],
    a: [0, 1, 2],
    why: "Seas are smaller, usually partly enclosed, and can sit within an ocean. They are still salt water.",
  },

  /* ------------------------------------------------------- Ocean floor */
  {
    id: "fl1", topic: "floor", type: "choice",
    q: "What is an abyssal plain?",
    options: [
      "The flat region of the ocean floor",
      "A deep, narrow trench in the seabed",
      "A chain of underwater mountains",
      "The sloping edge of a continent",
    ],
    a: 0,
    why: "It sits on oceanic crust, normally 10,000–20,000 ft below sea level.",
  },
  {
    id: "fl2", topic: "floor", type: "choice",
    q: "What is the deepest ocean trench?",
    options: ["Mariana Trench", "Puerto Rico Trench", "Tonga Trench", "Java Trench"],
    a: 0,
    why: "Its deepest point is called Challenger Deep.",
  },
  {
    id: "fl3", topic: "floor", type: "choice",
    q: "Where is the Mariana Trench found?",
    options: ["West Pacific Ocean", "East Atlantic Ocean", "South Indian Ocean", "Arctic Ocean"],
    a: 0,
    why: "West Pacific — worth naming the ocean as well as the trench.",
  },
  {
    id: "fl4", topic: "floor", type: "gap",
    q: "Complete the description of an abyssal plain.",
    segments: ["An abyssal plain is the ", " region of the ocean floor. It sits on ", " crust, usually 10,000–20,000 ft below sea ", "."],
    answers: ["flat", "oceanic", "level"],
    bank: ["flat", "oceanic", "level", "steep", "continental", "ridge"],
    why: "Flat, oceanic crust, and a stated depth — three separate details worth remembering.",
  },
  {
    id: "fl5", topic: "floor", type: "chain",
    q: "Put these in order by depth, shallowest first.",
    chunks: [
      "sea level, at 0 ft",
      "the top of the abyssal plain, around 10,000 ft down",
      "the deepest parts of the abyssal plain, around 20,000 ft down",
      "the floor of the Mariana Trench, around 36,000 ft down",
    ],
    why: "The abyssal plain sits between roughly 10,000 and 20,000 ft. The Mariana Trench goes far deeper still.",
  },

  /* -------------------------------------------------- Lat & long */
  {
    id: "co1", topic: "coords", type: "choice",
    q: "What does latitude measure?",
    options: [
      "Distance north or south of the Equator",
      "Distance east or west of the prime meridian",
      "Height above sea level",
      "Depth below the ocean surface",
    ],
    a: 0,
    why: "Latitude lines run east–west but measure north–south distance. That flip catches people out.",
  },
  {
    id: "co2", topic: "coords", type: "choice",
    q: "What does longitude measure?",
    options: [
      "Distance east or west of the prime meridian",
      "Distance north or south of the Equator",
      "The tilt of Earth's axis",
      "Distance from the nearest pole",
    ],
    a: 0,
    why: "Longitude lines run vertically, pole to pole, and measure east–west distance.",
  },
  {
    id: "co3", topic: "coords", type: "gap",
    q: "Complete the sentence.",
    segments: ["Lines of latitude form circles running ", " around the Earth, parallel to the ", ". Lines of longitude run ", "."],
    answers: ["east-west", "Equator", "vertically"],
    bank: ["east-west", "Equator", "vertically", "north-south", "prime meridian", "diagonally"],
    why: "Latitude is measured with 180 imaginary lines parallel to the Equator.",
  },
  {
    id: "co4", topic: "coords", type: "match",
    q: "Match each term to what it describes.",
    pairs: [
      ["Latitude", "North or south of the Equator"],
      ["Longitude", "East or west of the prime meridian"],
      ["Equator", "The 0° line of latitude"],
      ["Prime meridian", "The 0° line of longitude"],
    ],
    why: "Every coordinate is a latitude paired with a longitude — one north–south, one east–west.",
  },
  {
    id: "co5", topic: "coords", type: "multi",
    q: "Select every statement that is true about latitude.",
    options: [
      "It measures distance north or south of the Equator",
      "It is measured using 180 imaginary lines",
      "Its lines form circles running east–west",
      "It is measured from the prime meridian",
      "Its lines run vertically from pole to pole",
    ],
    a: [0, 1, 2],
    why: "The last two describe longitude.",
  },

  /* ------------------------------------------------- Tides & currents */
  {
    id: "ti1", topic: "tides", type: "choice",
    q: "What is a spring tide?",
    options: [
      "The greatest difference between low and high water in a tidal cycle",
      "The smallest difference between low and high water in a tidal cycle",
      "A tide that only happens during the spring months",
      "A narrow current flowing away from the shore",
    ],
    a: 0,
    why: "High tides are higher than normal and low tides are lower than normal. Nothing to do with the season.",
  },
  {
    id: "ti2", topic: "tides", type: "choice",
    q: "What is a neap tide?",
    options: [
      "The least height difference between low and high water in a tidal cycle",
      "The greatest height difference between low and high water",
      "A tide caused by an undersea earthquake",
      "A tide that only occurs at the Equator",
    ],
    a: 0,
    why: "Neap is the flat one, spring is the extreme one. They are opposites.",
  },
  {
    id: "ti3", topic: "tides", type: "choice",
    q: "What is a rip current?",
    options: [
      "A narrow stream of water flowing rapidly away from the shore",
      "A wave caused by an undersea volcano",
      "A large circular system of ocean currents",
      "The inward flow of water at high tide",
    ],
    a: 0,
    why: "They form near sandbars and flow strongly out to sea.",
  },
  {
    id: "ti4", topic: "tides", type: "gap",
    q: "Complete the description of a spring tide.",
    segments: ["In a spring tide the high tides are ", " than normal and the low tides are ", " than normal."],
    answers: ["higher", "lower"],
    bank: ["higher", "lower", "equal", "weaker", "closer", "stronger"],
    why: "Both extremes stretch outwards, which is why the difference is the greatest of the cycle.",
  },
  {
    id: "ti5", topic: "tides", type: "multi",
    q: "Select the five ocean gyres.",
    options: [
      "North Atlantic Gyre",
      "South Atlantic Gyre",
      "North Pacific Gyre",
      "South Pacific Gyre",
      "Indian Ocean Gyre",
      "Arctic Gyre",
      "Southern Gyre",
    ],
    a: [0, 1, 2, 3, 4],
    why: "Two Atlantic, two Pacific, one Indian.",
  },
  {
    id: "ti6", topic: "tides", type: "match",
    q: "Match each term to its description.",
    pairs: [
      ["Spring tide", "Biggest difference between high and low"],
      ["Neap tide", "Smallest difference between high and low"],
      ["Rip current", "Narrow fast flow away from shore"],
      ["Gyre", "Large circular system of currents"],
    ],
    why: "Tides are vertical changes in water height; currents are horizontal movements of water.",
  },
  {
    id: "ti7", topic: "tides", type: "chain",
    q: "Build the explanation: why is a rip current dangerous to a swimmer?",
    chunks: [
      "waves push water towards the shore",
      "that water has to flow back out to sea",
      "it escapes through a narrow gap, often near a sandbar",
      "forming a fast, narrow stream",
      "which carries a swimmer away from the beach faster than they can swim back",
    ],
    why: "The danger is the speed and the direction, not the depth. Swimming sideways out of the narrow stream is the escape.",
  },
];

/* ------------------------------------------------------------ creatures */
const CREATURES = [
  { id: "clownfish", name: "Clownfish", rarity: "common", fact: "Every clownfish is born male. The largest one in a group turns female when the resident female dies." },
  { id: "turtle", name: "Green sea turtle", rarity: "common", fact: "They navigate thousands of miles back to the exact beach where they hatched, using Earth's magnetic field." },
  { id: "dolphin", name: "Common dolphin", rarity: "common", fact: "They sleep with one half of the brain at a time, so one eye stays open and they keep surfacing to breathe." },
  { id: "jelly", name: "Moon jellyfish", rarity: "common", fact: "They have no brain, no heart and no blood, and are roughly 95% water." },
  { id: "seahorse", name: "Seahorse", rarity: "common", fact: "The male carries the eggs in a pouch and gives birth to up to 2,000 young at once." },
  { id: "octopus", name: "Giant Pacific octopus", rarity: "uncommon", fact: "Two thirds of its neurons are in its arms, so each arm can solve problems semi-independently." },
  { id: "manta", name: "Manta ray", rarity: "uncommon", fact: "With a 7 m wingspan, it is one of the few fish shown to recognise itself in a mirror." },
  { id: "hammerhead", name: "Hammerhead shark", rarity: "uncommon", fact: "The wide head spreads out electrical sensors that detect the heartbeat of prey buried in sand." },
  { id: "dragon", name: "Leafy sea dragon", rarity: "uncommon", fact: "Its leaf-shaped fins are pure camouflage — it swims using two tiny transparent fins instead." },
  { id: "anglerfish", name: "Anglerfish", rarity: "rare", fact: "Its glowing lure is powered by bioluminescent bacteria that live inside it in a permanent trade." },
  { id: "squid", name: "Giant squid", rarity: "rare", fact: "It has the largest eye of any animal — about the size of a dinner plate — for spotting sperm whales in the dark." },
  { id: "snailfish", name: "Mariana snailfish", rarity: "rare", fact: "It lives 8,000 m down in the Mariana Trench under pressure equal to 1,600 elephants standing on a car." },
  { id: "yeticrab", name: "Yeti crab", rarity: "rare", fact: "It farms bacteria on its hairy claws at hydrothermal vents, waving them over the water to feed the crop." },
];

/* ------------------------------------------------------ creature art */
/* Prefers public/creatures/<id>.png when the file exists, and falls back to the
   drawn version below if it doesn't — so artwork can be added a few at a time. */
function CreatureArt({ id, size = 132 }) {
  const [useDrawn, setUseDrawn] = useState(false);
  if (!useDrawn) {
    return (
      <img
        src={`creatures/${id}.png`}
        alt=""
        width={size}
        height={size}
        onError={() => setUseDrawn(true)}
        style={{ width: size, height: size, objectFit: "contain", display: "block" }}
      />
    );
  }
  return <DrawnCreature id={id} size={size} />;
}

function DrawnCreature({ id, size = 132 }) {
  const s = { width: size, height: size };
  const g = C.glow, d = C.glowDim, co = C.coral, sa = C.sand;
  const art = {
    clownfish: (
      <>
        <ellipse cx="50" cy="50" rx="27" ry="17" fill={co} />
        <path d="M77 50 L92 38 L92 62 Z" fill={co} />
        <rect x="38" y="34" width="6" height="32" rx="3" fill={C.foam} />
        <rect x="56" y="35" width="6" height="30" rx="3" fill={C.foam} />
        <circle cx="31" cy="46" r="3.5" fill={C.abyss} />
        <path d="M46 33 Q54 22 64 33" stroke={co} strokeWidth="5" fill="none" strokeLinecap="round" />
      </>
    ),
    turtle: (
      <>
        <ellipse cx="50" cy="52" rx="26" ry="21" fill={d} />
        <path d="M50 31 L60 44 L50 55 L40 44 Z" fill={g} opacity="0.6" />
        <circle cx="50" cy="52" r="8" fill={g} opacity="0.35" />
        <circle cx="78" cy="44" r="8" fill={sa} />
        <circle cx="81" cy="42" r="1.8" fill={C.abyss} />
        <ellipse cx="28" cy="34" rx="11" ry="6" fill={sa} transform="rotate(-25 28 34)" />
        <ellipse cx="28" cy="70" rx="11" ry="6" fill={sa} transform="rotate(25 28 70)" />
      </>
    ),
    dolphin: (
      <>
        <path d="M14 56 Q34 30 62 34 Q80 37 90 30 Q84 46 70 52 Q46 68 14 56 Z" fill={g} />
        <path d="M50 34 L56 18 L64 36 Z" fill={d} />
        <path d="M20 58 L8 70 L26 66 Z" fill={d} />
        <circle cx="76" cy="41" r="2.6" fill={C.abyss} />
      </>
    ),
    jelly: (
      <>
        <path d="M22 50 Q22 22 50 22 Q78 22 78 50 Q64 56 50 50 Q36 56 22 50 Z" fill={g} opacity="0.55" />
        <circle cx="40" cy="40" r="6" fill={C.foam} opacity="0.5" />
        <circle cx="60" cy="40" r="6" fill={C.foam} opacity="0.5" />
        {[30, 42, 50, 58, 70].map((x, i) => (
          <path key={i} d={`M${x} 52 Q${x + (i % 2 ? 6 : -6)} 66 ${x} 82`} stroke={g} strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.8" />
        ))}
      </>
    ),
    seahorse: (
      <>
        <path d="M42 20 Q62 20 60 40 Q58 56 48 64 Q40 70 44 80 Q50 88 60 82" stroke={sa} strokeWidth="11" fill="none" strokeLinecap="round" />
        <path d="M40 18 Q30 14 28 24" stroke={sa} strokeWidth="7" fill="none" strokeLinecap="round" />
        <circle cx="50" cy="26" r="2.6" fill={C.abyss} />
        <path d="M62 34 L72 40 L62 46" stroke={co} strokeWidth="4" fill="none" strokeLinecap="round" />
      </>
    ),
    octopus: (
      <>
        <path d="M28 46 Q28 20 50 20 Q72 20 72 46 Q72 58 50 58 Q28 58 28 46 Z" fill={co} />
        <circle cx="41" cy="40" r="4" fill={C.abyss} />
        <circle cx="59" cy="40" r="4" fill={C.abyss} />
        {[-3, -1.5, 0, 1.5, 3].map((k, i) => (
          <path key={i} d={`M${50 + k * 9} 56 Q${50 + k * 13} 74 ${50 + k * 16} 86`} stroke={co} strokeWidth="6" fill="none" strokeLinecap="round" opacity={0.95 - i * 0.06} />
        ))}
      </>
    ),
    manta: (
      <>
        <path d="M50 32 Q86 34 94 60 Q70 58 50 66 Q30 58 6 60 Q14 34 50 32 Z" fill={d} />
        <path d="M40 30 L34 20 L46 28 Z" fill={d} />
        <path d="M60 30 L66 20 L54 28 Z" fill={d} />
        <path d="M50 66 L50 88" stroke={d} strokeWidth="3.5" strokeLinecap="round" />
        <ellipse cx="50" cy="48" rx="11" ry="8" fill={g} opacity="0.4" />
      </>
    ),
    hammerhead: (
      <>
        <path d="M20 50 Q46 36 74 44 Q88 47 94 54 Q84 60 74 60 Q46 66 20 50 Z" fill={C.mist} />
        <rect x="8" y="38" width="24" height="12" rx="6" fill={C.mist} />
        <circle cx="12" cy="44" r="2.6" fill={C.abyss} />
        <circle cx="28" cy="44" r="2.6" fill={C.abyss} />
        <path d="M50 42 L54 26 L60 44 Z" fill={C.mist} />
      </>
    ),
    dragon: (
      <>
        <path d="M18 40 Q40 30 58 44 Q72 55 82 74" stroke={sa} strokeWidth="9" fill="none" strokeLinecap="round" />
        <path d="M18 40 Q8 36 6 44" stroke={sa} strokeWidth="6" fill="none" strokeLinecap="round" />
        {[[34, 30], [50, 38], [64, 52], [74, 66]].map(([x, y], i) => (
          <ellipse key={i} cx={x} cy={y - 12} rx="9" ry="5" fill={g} opacity="0.7" transform={`rotate(${-30 + i * 12} ${x} ${y - 12})`} />
        ))}
        <circle cx="16" cy="40" r="2.4" fill={C.abyss} />
      </>
    ),
    anglerfish: (
      <>
        <path d="M22 56 Q30 28 58 30 Q82 32 86 56 Q78 76 52 76 Q28 74 22 56 Z" fill={C.deep} stroke={d} strokeWidth="2" />
        <path d="M56 30 Q52 12 34 12" stroke={d} strokeWidth="3" fill="none" strokeLinecap="round" />
        <circle cx="32" cy="12" r="7" fill={g} />
        <circle cx="32" cy="12" r="12" fill={g} opacity="0.25" />
        <circle cx="42" cy="48" r="4" fill={g} />
        <path d="M30 62 L38 68 L46 62 L54 68 L62 62 L70 68 L78 62" stroke={C.foam} strokeWidth="2.5" fill="none" strokeLinejoin="round" />
      </>
    ),
    squid: (
      <>
        <path d="M50 10 Q68 10 68 40 Q68 52 50 52 Q32 52 32 40 Q32 10 50 10 Z" fill={co} />
        <circle cx="42" cy="44" r="6" fill={C.foam} />
        <circle cx="42" cy="44" r="3" fill={C.abyss} />
        <circle cx="60" cy="44" r="6" fill={C.foam} />
        <circle cx="60" cy="44" r="3" fill={C.abyss} />
        {[-2.5, -1, 0.5, 2].map((k, i) => (
          <path key={i} d={`M${50 + k * 8} 52 Q${50 + k * 14} 72 ${50 + k * 10} 92`} stroke={co} strokeWidth="4.5" fill="none" strokeLinecap="round" />
        ))}
      </>
    ),
    snailfish: (
      <>
        <path d="M16 54 Q34 34 62 40 Q82 45 90 54 Q78 66 58 68 Q32 70 16 54 Z" fill={C.mist} opacity="0.85" />
        <path d="M86 46 L96 40 L94 62 Z" fill={C.mist} opacity="0.6" />
        <circle cx="30" cy="52" r="3.2" fill={C.abyss} />
        <path d="M40 46 Q54 54 70 50" stroke={C.foam} strokeWidth="2" fill="none" opacity="0.7" />
        {[24, 40, 56, 72].map((x, i) => <circle key={i} cx={x} cy={80} r="2" fill={C.foam} opacity="0.4" />)}
      </>
    ),
    yeticrab: (
      <>
        <ellipse cx="50" cy="54" rx="20" ry="14" fill={C.foam} />
        <circle cx="44" cy="48" r="2.6" fill={C.abyss} />
        <circle cx="56" cy="48" r="2.6" fill={C.abyss} />
        <path d="M30 50 Q16 42 12 28" stroke={C.foam} strokeWidth="7" fill="none" strokeLinecap="round" />
        <path d="M70 50 Q84 42 88 28" stroke={C.foam} strokeWidth="7" fill="none" strokeLinecap="round" />
        {[[12, 28], [88, 28]].map(([x, y], i) => (
          <g key={i}>
            {[-8, -3, 2, 7].map((o, j) => (
              <path key={j} d={`M${x + o} ${y} L${x + o * 1.5} ${y - 12}`} stroke={sa} strokeWidth="2.5" strokeLinecap="round" />
            ))}
          </g>
        ))}
        {[[32, 70], [50, 74], [68, 70]].map(([x, y], i) => (
          <path key={i} d={`M${x} 64 L${x - 6} ${y + 12}`} stroke={C.foam} strokeWidth="4" strokeLinecap="round" />
        ))}
      </>
    ),
  };
  return (
    <svg viewBox="0 0 100 100" style={s} aria-hidden="true">
      {art[id]}
    </svg>
  );
}

/* ============================================================ 1. ENGINE */
const INTERVALS = [1, 3, 7, 21]; // days, for boxes 1..4
const STORE_KEY = "marine_u1_v1";

const todayISO = () => new Date().toISOString().slice(0, 10);
const addDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};

function blankProgress() {
  return { items: {}, creatures: [], mastered: [] };
}

function scheduleAfter(rec, correct) {
  const box = rec ? rec.box : 0;
  if (correct) {
    const nextBox = Math.min(box + 1, 4);
    return { box: nextBox, due: addDays(INTERVALS[nextBox - 1]), seen: true };
  }
  return { box: 0, due: addDays(1), seen: true };
}

const isDue = (rec) => rec && rec.seen && rec.due <= todayISO();

function topicStats(topicId, progress) {
  const items = ITEMS.filter((i) => i.topic === topicId);
  let sum = 0, seen = 0, due = 0;
  items.forEach((i) => {
    const r = progress.items[i.id];
    if (r && r.seen) {
      seen++;
      sum += Math.min(r.box, 4);
      if (isDue(r)) due++;
    }
  });
  const strength = items.length ? sum / (items.length * 4) : 0;
  let state = "new";
  if (seen > 0) state = strength >= 0.75 ? "mastered" : strength >= 0.3 ? "growing" : "learning";
  return { total: items.length, seen, due, strength, state };
}

/* Builds a lesson: due reviews first, then unseen items, ordered up the
   ladder (recognise → retrieve → connect → explain), topics interleaved. */
function buildLesson(progress, topicId = null, size = 7) {
  const pool = ITEMS.filter((i) => (topicId ? i.topic === topicId : true));
  const dueItems = pool.filter((i) => isDue(progress.items[i.id]));
  const fresh = pool.filter((i) => !progress.items[i.id]?.seen);
  const chosen = [...dueItems, ...fresh].slice(0, size);
  if (chosen.length === 0) {
    // everything is scheduled ahead — offer the least-recently-strong items
    const extra = [...pool].sort(
      (a, b) => (progress.items[a.id]?.box || 0) - (progress.items[b.id]?.box || 0)
    );
    chosen.push(...extra.slice(0, size));
  }
  const byRank = {};
  chosen.forEach((i) => {
    const r = RANK[i.type];
    (byRank[r] = byRank[r] || []).push(i);
  });
  const out = [];
  Object.keys(byRank)
    .sort()
    .forEach((r) => {
      const group = byRank[r];
      const buckets = {};
      group.forEach((i) => (buckets[i.topic] = buckets[i.topic] || []).push(i));
      const keys = Object.keys(buckets);
      let added = true;
      while (added) {
        added = false;
        keys.forEach((k) => {
          if (buckets[k].length) {
            out.push(buckets[k].shift());
            added = true;
          }
        });
      }
    });
  return out;
}

/* ------------------------------------------------------------- storage */
async function loadProgress() {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (raw) return { ...blankProgress(), ...JSON.parse(raw) };
  } catch (e) {
    /* first run, or storage blocked in private browsing */
  }
  return blankProgress();
}
async function saveProgress(p) {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(p));
  } catch (e) {
    /* keeps working in memory for this session */
  }
}

/* Lets you move progress between devices without a login. */
export function exportProgress() {
  return window.localStorage.getItem(STORE_KEY) || "{}";
}

/* ------------------------------------------------------------- helpers */
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* A plain shuffle can land back on the original order, which hands the answer
   to the student. This one keeps trying until the order actually changed. */
const reorder = (arr, key = (x) => x) => {
  if (arr.length < 2) return [...arr];
  for (let t = 0; t < 40; t++) {
    const s = shuffle(arr);
    if (s.some((v, i) => key(v) !== key(arr[i]))) return s;
  }
  return [...arr.slice(1), arr[0]];
};

/* For matching: shuffle both columns, but never leave a term sitting directly
   opposite its own description. */
const matchColumns = (pairs) => {
  const L = reorder(pairs.map((p, i) => ({ t: p[0], i })), (x) => x.i);
  const rights = pairs.map((p, i) => ({ t: p[1], i }));
  for (let t = 0; t < 60; t++) {
    const R = shuffle(rights);
    if (R.every((r, idx) => r.i !== L[idx].i)) return { L, R };
  }
  const R = L.map((_, idx) => rights[L[(idx + 1) % L.length].i]);
  return { L, R };
};

const sameSet = (a, b) => a.length === b.length && [...a].sort().every((v, i) => v === [...b].sort()[i]);

/* ====================================================== 2. QUESTIONS */

function Prompt({ children }) {
  return (
    <h2 style={{
      fontFamily: FONT_DISPLAY, fontSize: 21, lineHeight: 1.32, color: C.foam,
      fontWeight: 600, margin: "0 0 20px", letterSpacing: "-0.01em",
    }}>{children}</h2>
  );
}

const btnBase = {
  fontFamily: FONT_UI, fontSize: 16, lineHeight: 1.4, width: "100%",
  textAlign: "left", padding: "14px 16px", borderRadius: 14,
  border: `1px solid ${C.line}`, background: C.shelf, color: C.foam,
  cursor: "pointer", marginBottom: 10, transition: "background .12s, border-color .12s",
};

function ChoiceQ({ item, locked, picked, setPicked }) {
  // Options are authored with the answer first; never show them that way.
  const order = useMemo(() => reorder(item.options.map((_, i) => i)), [item.id]);
  return (
    <>
      <Prompt>{item.q}</Prompt>
      {order.map((i) => {
        let bg = C.shelf, bd = C.line, col = C.foam;
        if (locked) {
          if (i === item.a) { bg = "rgba(79,216,196,.16)"; bd = C.ok; col = C.ok; }
          else if (i === picked) { bg = "rgba(255,158,125,.13)"; bd = C.no; col = C.no; }
          else { col = C.mist; }
        } else if (i === picked) { bg = C.raise; bd = C.glow; }
        return (
          <button key={i} onClick={() => !locked && setPicked(i)} disabled={locked}
            style={{ ...btnBase, background: bg, borderColor: bd, color: col, cursor: locked ? "default" : "pointer" }}>
            {item.options[i]}
          </button>
        );
      })}
    </>
  );
}

function MultiQ({ item, locked, picked, setPicked }) {
  const order = useMemo(() => reorder(item.options.map((_, i) => i)), [item.id]);
  const toggle = (i) => setPicked(picked.includes(i) ? picked.filter((x) => x !== i) : [...picked, i]);
  return (
    <>
      <Prompt>{item.q}</Prompt>
      {order.map((i) => {
        const on = picked.includes(i);
        const right = item.a.includes(i);
        let bg = C.shelf, bd = C.line, col = C.foam;
        if (locked) {
          if (right) { bg = "rgba(79,216,196,.16)"; bd = C.ok; col = C.ok; }
          else if (on) { bg = "rgba(255,158,125,.13)"; bd = C.no; col = C.no; }
          else col = C.mist;
        } else if (on) { bg = C.raise; bd = C.glow; }
        return (
          <button key={i} onClick={() => !locked && toggle(i)} disabled={locked}
            style={{ ...btnBase, background: bg, borderColor: bd, color: col, display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{
              width: 20, height: 20, flexShrink: 0, borderRadius: 6,
              border: `2px solid ${on || (locked && right) ? bd : C.line}`,
              background: on || (locked && right) ? bd : "transparent",
            }} />
            <span>{item.options[i]}</span>
          </button>
        );
      })}
    </>
  );
}

function GapQ({ item, locked, filled, setFilled }) {
  const bank = useMemo(() => reorder(item.bank), [item.id]);
  const place = (w) => {
    const idx = filled.findIndex((f) => f === null);
    if (idx === -1) return;
    const next = [...filled];
    next[idx] = w;
    setFilled(next);
  };
  const clear = (i) => {
    const next = [...filled];
    next[i] = null;
    setFilled(next);
  };
  const used = filled.filter(Boolean);
  return (
    <>
      <Prompt>{item.q}</Prompt>
      <p style={{
        fontFamily: FONT_UI, fontSize: 17, lineHeight: 2.1, color: C.foam,
        margin: "0 0 22px",
      }}>
        {item.segments.map((seg, i) => (
          <React.Fragment key={i}>
            {seg}
            {i < item.answers.length && (
              <span onClick={() => !locked && clear(i)} style={{
                display: "inline-block", minWidth: 78, textAlign: "center", padding: "3px 10px",
                margin: "0 2px", borderRadius: 9, cursor: locked ? "default" : "pointer",
                background: filled[i] ? (locked ? (filled[i] === item.answers[i] ? "rgba(79,216,196,.18)" : "rgba(255,158,125,.15)") : C.raise) : "transparent",
                border: `1px ${filled[i] ? "solid" : "dashed"} ${locked ? (filled[i] === item.answers[i] ? C.ok : C.no) : filled[i] ? C.glow : C.line}`,
                color: locked ? (filled[i] === item.answers[i] ? C.ok : C.no) : C.foam,
              }}>
                {filled[i] || "\u00A0"}
              </span>
            )}
          </React.Fragment>
        ))}
      </p>
      {locked && filled.some((f, i) => f !== item.answers[i]) && (
        <p style={{ fontFamily: FONT_UI, fontSize: 14, color: C.mist, margin: "-10px 0 16px" }}>
          Correct: {item.answers.join(" · ")}
        </p>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {bank.map((w) => {
          const spent = used.includes(w);
          return (
            <button key={w} onClick={() => !locked && !spent && place(w)} disabled={locked || spent}
              style={{
                fontFamily: FONT_UI, fontSize: 15, padding: "9px 14px", borderRadius: 11,
                border: `1px solid ${C.line}`, background: spent ? "transparent" : C.shelf,
                color: spent ? C.line : C.foam, cursor: locked || spent ? "default" : "pointer",
              }}>
              {w}
            </button>
          );
        })}
      </div>
    </>
  );
}

function MatchQ({ item, locked, state, setState }) {
  const { L, R } = useMemo(() => matchColumns(item.pairs), [item.id]);
  const { links, order, sel } = state;

  const rightOwner = {};
  Object.entries(links).forEach(([l, r]) => { rightOwner[r] = Number(l); });
  const numberOf = (l) => order.indexOf(l) + 1;

  const unlink = (l) => {
    const next = { ...links };
    delete next[l];
    setState({ links: next, order: order.filter((x) => x !== l), sel: null });
  };

  const tapLeft = (l) => {
    if (locked) return;
    if (links[l] !== undefined) return unlink(l);
    setState({ ...state, sel: sel === l ? null : l });
  };

  const tapRight = (r) => {
    if (locked) return;
    const owner = rightOwner[r];
    if (owner !== undefined) return unlink(owner);
    if (sel === null) return;
    setState({
      links: { ...links, [sel]: r },
      order: [...order.filter((x) => x !== sel), sel],
      sel: null,
    });
  };

  /* Nothing is judged until Check. Before that a link is just teal. */
  const look = (linked, selected, verdict) => {
    const bad = verdict === "wrong";
    const good = verdict === "right";
    return {
      position: "relative", fontFamily: FONT_UI, fontSize: 14, lineHeight: 1.35,
      padding: "12px 26px 12px 12px", borderRadius: 12,
      cursor: locked ? "default" : "pointer",
      border: `1px solid ${bad ? C.no : good ? C.ok : linked || selected ? C.glow : C.line}`,
      background: bad ? "rgba(255,158,125,.14)" : good ? "rgba(79,216,196,.14)"
        : selected ? C.raise : linked ? "rgba(79,216,196,.08)" : C.shelf,
      color: bad ? C.no : good ? C.ok : C.foam,
      display: "flex", alignItems: "center", height: "100%",
      transition: "background .12s, border-color .12s",
    };
  };

  const badge = (n, verdict) => (
    <span style={{
      position: "absolute", top: 6, right: 6, width: 17, height: 17, borderRadius: 9,
      fontSize: 10.5, lineHeight: "17px", textAlign: "center", fontWeight: 600,
      background: verdict === "wrong" ? C.no : verdict === "right" ? C.ok : C.glow,
      color: C.abyss,
    }}>{n}</span>
  );

  const verdictFor = (l) => {
    if (!locked || links[l] === undefined) return null;
    return links[l] === l ? "right" : "wrong";
  };

  const linkedCount = Object.keys(links).length;
  const allWrong = locked && Object.keys(links).some((l) => links[l] !== Number(l));

  return (
    <>
      <Prompt>{item.q}</Prompt>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 8 }}>
        {L.map((left, row) => {
          const right = R[row];
          const lv = verdictFor(left.i);
          const owner = rightOwner[right.i];
          const rv = owner !== undefined ? verdictFor(owner) : null;
          return (
            <React.Fragment key={row}>
              <div onClick={() => tapLeft(left.i)}
                style={look(links[left.i] !== undefined, sel === left.i, lv)}>
                {left.t}
                {links[left.i] !== undefined && badge(numberOf(left.i), lv)}
              </div>
              <div onClick={() => tapRight(right.i)}
                style={look(owner !== undefined, false, rv)}>
                {right.t}
                {owner !== undefined && badge(numberOf(owner), rv)}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <p style={{ fontFamily: FONT_UI, fontSize: 14, color: C.mist, marginTop: 12, minHeight: 20 }}>
        {locked
          ? "Matching numbers show what you paired."
          : sel !== null
          ? "Now tap its description."
          : linkedCount === item.pairs.length
          ? "All paired. Change any of them, or press Check."
          : `Tap a term, then its description. ${linkedCount} of ${item.pairs.length} paired — tap a pair again to undo it.`}
      </p>

      {allWrong && (
        <div style={{ marginTop: 4 }}>
          <p style={{ fontFamily: FONT_UI, fontSize: 13, color: C.mist, margin: "0 0 6px" }}>
            The correct pairs
          </p>
          {item.pairs.map(([a, b], i) => (
            <p key={i} style={{ fontFamily: FONT_UI, fontSize: 14, color: C.foam, margin: "0 0 4px", lineHeight: 1.4 }}>
              <span style={{ color: C.glow }}>{a}</span> — {b}
            </p>
          ))}
        </div>
      )}
    </>
  );
}

function ChainQ({ item, locked, order, setOrder }) {
  const pool = useMemo(
    () => reorder(item.chunks.map((c, i) => ({ c, i })), (x) => x.i),
    [item.id]
  );
  const add = (k) => !locked && !order.includes(k) && setOrder([...order, k]);
  const remove = (k) => !locked && setOrder(order.filter((x) => x !== k));
  return (
    <>
      <Prompt>{item.q}</Prompt>
      <div style={{
        minHeight: 70, borderRadius: 14, border: `1px dashed ${C.line}`,
        padding: order.length ? 10 : 20, marginBottom: 16,
        background: "rgba(255,255,255,.02)",
      }}>
        {order.length === 0 && (
          <p style={{ fontFamily: FONT_UI, fontSize: 14, color: C.mist, margin: 0, textAlign: "center" }}>
            Tap the steps below in the right order
          </p>
        )}
        {order.map((k, pos) => {
          const right = locked && k === pos;
          const bad = locked && k !== pos;
          return (
            <div key={k} onClick={() => remove(k)} style={{
              fontFamily: FONT_UI, fontSize: 15, lineHeight: 1.4, padding: "10px 12px",
              borderRadius: 10, marginBottom: 6, cursor: locked ? "default" : "pointer",
              background: bad ? "rgba(255,158,125,.12)" : right ? "rgba(79,216,196,.14)" : C.raise,
              border: `1px solid ${bad ? C.no : right ? C.ok : C.glow}`,
              color: bad ? C.no : right ? C.ok : C.foam,
              display: "flex", gap: 10,
            }}>
              <span style={{ color: C.mist, flexShrink: 0 }}>{pos + 1}</span>
              <span>{item.chunks[k]}</span>
            </div>
          );
        })}
      </div>
      {locked && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontFamily: FONT_UI, fontSize: 13, color: C.mist, margin: "0 0 6px" }}>Correct order</p>
          {item.chunks.map((c, i) => (
            <p key={i} style={{ fontFamily: FONT_UI, fontSize: 14, color: C.foam, margin: "0 0 4px" }}>
              <span style={{ color: C.glow }}>{i + 1}.</span> {c}
            </p>
          ))}
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {pool.map(({ c, i }) => {
          const spent = order.includes(i);
          if (spent) return null;
          return (
            <button key={i} onClick={() => add(i)} disabled={locked}
              style={{
                fontFamily: FONT_UI, fontSize: 15, lineHeight: 1.35, padding: "10px 13px",
                borderRadius: 11, border: `1px solid ${C.line}`, background: C.shelf,
                color: C.foam, textAlign: "left", cursor: locked ? "default" : "pointer",
              }}>
              {c}
            </button>
          );
        })}
      </div>
    </>
  );
}

/* ================================================ 3. VISUAL + REWARD */

function Confetti({ on }) {
  if (!on) return null;
  const bits = Array.from({ length: 26 }, (_, i) => i);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", borderRadius: 18 }}>
      {bits.map((i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.25;
        const col = [C.glow, C.coral, C.sand, C.foam][i % 4];
        return (
          <span key={i} style={{
            position: "absolute", left: `${left}%`, top: "-8%", width: 7, height: 11,
            background: col, borderRadius: 2, opacity: 0.95,
            animation: `mfall .95s ${delay}s ease-in forwards`,
          }} />
        );
      })}
    </div>
  );
}

function DepthNode({ strength, state }) {
  const r = 15;
  const fill = state === "new" ? "transparent" : state === "mastered" ? C.glow : C.glowDim;
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" style={{ flexShrink: 0 }}>
      <circle cx="17" cy="17" r={r} fill="none" stroke={C.line} strokeWidth="2" />
      <circle
        cx="17" cy="17" r={r} fill="none" stroke={fill} strokeWidth="3"
        strokeDasharray={`${2 * Math.PI * r * strength} ${2 * Math.PI * r}`}
        strokeLinecap="round" transform="rotate(-90 17 17)"
      />
      {state === "mastered" && <circle cx="17" cy="17" r="6" fill={C.glow} />}
    </svg>
  );
}

/* ---------------------------------------------------------------- app */
export default function App() {
  const [progress, setProgress] = useState(blankProgress);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState("map");
  const [queue, setQueue] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [locked, setLocked] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [wasRight, setWasRight] = useState(false);
  const [requeued, setRequeued] = useState([]);
  const [sessionLog, setSessionLog] = useState([]);
  const [reveal, setReveal] = useState(null);
  const [newlyMastered, setNewlyMastered] = useState([]);
  const [celebrate, setCelebrate] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    loadProgress().then((p) => { setProgress(p); setReady(true); });
  }, []);

  useEffect(() => { if (ready) saveProgress(progress); }, [progress, ready]);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [qIdx, view]);

  const stats = useMemo(
    () => Object.fromEntries(TOPICS.map((t) => [t.id, topicStats(t.id, progress)])),
    [progress]
  );
  const totalDue = TOPICS.reduce((s, t) => s + stats[t.id].due, 0);
  const item = queue[qIdx];

  /* ------------------------------------------------------ start lesson */
  const start = (topicId) => {
    const q = buildLesson(progress, topicId, topicId ? 7 : 8);
    if (!q.length) return;
    setQueue(q); setQIdx(0); setLocked(false); setAnswer(initAnswer(q[0]));
    setRequeued([]); setSessionLog([]); setNewlyMastered([]); setView("lesson");
  };

  function initAnswer(it) {
    if (!it) return null;
    if (it.type === "choice") return null;
    if (it.type === "multi") return [];
    if (it.type === "gap") return it.answers.map(() => null);
    if (it.type === "match") return { links: {}, order: [], sel: null };
    if (it.type === "chain") return [];
    return null;
  }

  const canSubmit = () => {
    if (!item || locked) return false;
    if (item.type === "choice") return answer !== null;
    if (item.type === "multi") return answer.length > 0;
    if (item.type === "gap") return answer.every((a) => a !== null);
    if (item.type === "match") return Object.keys(answer.links).length === item.pairs.length;
    if (item.type === "chain") return answer.length === item.chunks.length;
    return false;
  };

  const grade = () => {
    if (item.type === "choice") return answer === item.a;
    if (item.type === "multi") return sameSet(answer, item.a);
    if (item.type === "gap") return answer.every((a, i) => a === item.answers[i]);
    if (item.type === "match") return item.pairs.every((_, i) => answer.links[i] === i);
    if (item.type === "chain") return answer.every((k, i) => k === i);
    return false;
  };

  const submit = () => {
    if (!canSubmit()) return;
    const right = grade();
    setWasRight(right);
    setLocked(true);
    setSessionLog((l) => [...l, { id: item.id, right }]);

    setProgress((p) => {
      const next = { ...p, items: { ...p.items } };
      const isRetry = requeued.includes(item.id);
      if (!isRetry) next.items[item.id] = scheduleAfter(p.items[item.id], right);

      /* ocean discoveries: weighted by correctness, never guaranteed */
      if (right) {
        const acc = sessionLog.length
          ? (sessionLog.filter((s) => s.right).length + 1) / (sessionLog.length + 1)
          : 1;
        const owned = p.creatures;
        const chance = 0.13 + 0.2 * acc;
        if (owned.length < CREATURES.length && Math.random() < chance) {
          const masteredCount = TOPICS.filter((t) => topicStats(t.id, next).state === "mastered").length;
          const prog = masteredCount / TOPICS.length;
          const roll = Math.random();
          const tier = roll < 0.05 + 0.35 * prog ? "rare" : roll < 0.35 + 0.3 * prog ? "uncommon" : "common";
          let pool = CREATURES.filter((c) => c.rarity === tier && !owned.includes(c.id));
          if (!pool.length) pool = CREATURES.filter((c) => !owned.includes(c.id));
          if (pool.length) {
            const pick = pool[Math.floor(Math.random() * pool.length)];
            next.creatures = [...owned, pick.id];
            setTimeout(() => setReveal(pick), 480);
          }
        }
      }

      /* mastery crossings */
      const crossed = TOPICS.filter(
        (t) => topicStats(t.id, next).state === "mastered" && !p.mastered.includes(t.id)
      ).map((t) => t.id);
      if (crossed.length) {
        next.mastered = [...p.mastered, ...crossed];
        setNewlyMastered((m) => [...m, ...crossed]);
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 1100);
      }
      return next;
    });

    if (!right && !requeued.includes(item.id)) {
      setRequeued((r) => [...r, item.id]);
      setQueue((q) => [...q, item]);
    }
  };

  const next = () => {
    const n = qIdx + 1;
    if (n >= queue.length) { setView("result"); return; }
    setQIdx(n); setLocked(false); setAnswer(initAnswer(queue[n]));
  };

  /* ---------------------------------------------------------- shells */
  const shell = {
    fontFamily: FONT_UI, maxWidth: 480, margin: "0 auto", minHeight: "100dvh",
    background: `linear-gradient(${C.deep} 0%, ${C.abyss} 60%)`,
    color: C.foam, position: "relative",
  };

  const keyframes = `
    @keyframes mfall { to { transform: translateY(420px) rotate(540deg); opacity: 0 } }
    @keyframes mrise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important } }
    button:focus-visible, div:focus-visible { outline: 2px solid ${C.glow}; outline-offset: 2px }
  `;

  if (!ready) {
    return (
      <div style={{ ...shell, display: "grid", placeItems: "center" }}>
        <p style={{ color: C.mist }}>Loading your progress…</p>
      </div>
    );
  }

  /* --------------------------------------------------------- map view */
  if (view === "map") {
    const masteredCount = TOPICS.filter((t) => stats[t.id].state === "mastered").length;
    return (
      <div style={shell} ref={scrollRef}>
        <style>{keyframes}</style>
        <div style={{ padding: "34px 22px 12px" }}>
          <p style={{ fontSize: 13, color: C.glow, margin: "0 0 6px", letterSpacing: ".04em" }}>
            Marine Science IGCSE · Unit 1
          </p>
          <h1 style={{
            fontFamily: FONT_DISPLAY, fontSize: 34, lineHeight: 1.08, fontWeight: 600,
            margin: "0 0 10px", letterSpacing: "-0.02em",
          }}>
            Earth and oceans
          </h1>
          <p style={{ fontSize: 15, color: C.mist, margin: 0, lineHeight: 1.5 }}>
            {masteredCount} of {TOPICS.length} topics mastered · {progress.creatures.length} of {CREATURES.length} creatures found
          </p>
        </div>

        {totalDue > 0 && (
          <div style={{ padding: "14px 22px 4px" }}>
            <button onClick={() => start(null)} style={{
              width: "100%", textAlign: "left", padding: "18px 20px", borderRadius: 16,
              border: `1px solid ${C.glow}`, background: "rgba(79,216,196,.1)", color: C.foam,
              cursor: "pointer", fontFamily: FONT_UI,
            }}>
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 600, display: "block" }}>
                Ready to come back
              </span>
              <span style={{ fontSize: 14, color: C.mist }}>
                {totalDue} question{totalDue > 1 ? "s" : ""} due across your topics
              </span>
            </button>
          </div>
        )}

        <div style={{ padding: "18px 22px 8px" }}>
          {TOPICS.map((t, idx) => {
            const s = stats[t.id];
            return (
              <div key={t.id} style={{ display: "flex", gap: 14, alignItems: "stretch" }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 34 }}>
                  <DepthNode strength={s.strength} state={s.state} />
                  {idx < TOPICS.length - 1 && (
                    <div style={{ flex: 1, width: 2, background: C.line, opacity: 0.6, minHeight: 26 }} />
                  )}
                </div>
                <button onClick={() => start(t.id)} style={{
                  flex: 1, textAlign: "left", background: "transparent", border: "none",
                  padding: "2px 0 24px", cursor: "pointer", color: C.foam, fontFamily: FONT_UI,
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                    <span style={{ fontFamily: FONT_DISPLAY, fontSize: 19, fontWeight: 600, lineHeight: 1.2 }}>
                      {t.name}
                    </span>
                    <span style={{ fontSize: 12, color: C.line, flexShrink: 0 }}>{t.depth}</span>
                  </div>
                  <div style={{ fontSize: 13.5, color: C.mist, marginTop: 4 }}>
                    {s.state === "new" && "Not started"}
                    {s.state === "learning" && `Learning · ${s.seen} of ${s.total} met`}
                    {s.state === "growing" && `Getting solid · ${Math.round(s.strength * 100)}%`}
                    {s.state === "mastered" && "Mastered"}
                    {s.due > 0 && (
                      <span style={{ color: C.coral }}> · {s.due} due</span>
                    )}
                  </div>
                </button>
              </div>
            );
          })}
        </div>

        <div style={{ padding: "0 22px 40px" }}>
          <button onClick={() => setView("collection")} style={{
            width: "100%", padding: "16px", borderRadius: 14, border: `1px solid ${C.line}`,
            background: C.shelf, color: C.foam, fontFamily: FONT_UI, fontSize: 15, cursor: "pointer",
          }}>
            Ocean discoveries · {progress.creatures.length}/{CREATURES.length}
          </button>
          <p style={{ fontSize: 12.5, color: C.line, lineHeight: 1.6, marginTop: 18, textAlign: "center" }}>
            No timers, no lives, no streaks. Questions you miss come back tomorrow,
            then in three days, then in a week.
          </p>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------- collection view */
  if (view === "collection") {
    return (
      <div style={shell} ref={scrollRef}>
        <style>{keyframes}</style>
        <div style={{ padding: "30px 22px 10px" }}>
          <button onClick={() => setView("map")} style={{
            background: "none", border: "none", color: C.glow, fontFamily: FONT_UI,
            fontSize: 15, padding: 0, cursor: "pointer", marginBottom: 16,
          }}>← Back</button>
          <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 600, margin: "0 0 6px" }}>
            Ocean discoveries
          </h1>
          <p style={{ fontSize: 14.5, color: C.mist, margin: 0 }}>
            {progress.creatures.length} of {CREATURES.length} found. Rarer species appear as more topics reach mastered.
          </p>
        </div>
        <div style={{ padding: "20px 22px 44px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {CREATURES.map((c) => {
            const owned = progress.creatures.includes(c.id);
            return (
              <div key={c.id} style={{
                borderRadius: 16, padding: 14, minHeight: 190,
                border: `1px solid ${owned ? C.line : "rgba(30,106,135,.4)"}`,
                background: owned ? C.shelf : "rgba(18,69,95,.25)",
                display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
              }}>
                <div style={{ opacity: owned ? 1 : 0.13, filter: owned ? "none" : "grayscale(1)" }}>
                  <CreatureArt id={c.id} size={92} />
                </div>
                <p style={{
                  fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 600, margin: "6px 0 3px",
                  color: owned ? C.foam : C.line,
                }}>
                  {owned ? c.name : "Undiscovered"}
                </p>
                <p style={{ fontSize: 11.5, color: owned ? C.glow : C.line, margin: 0 }}>{c.rarity}</p>
                {owned && (
                  <p style={{ fontSize: 12, color: C.mist, lineHeight: 1.45, marginTop: 7 }}>{c.fact}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------ result view */
  if (view === "result") {
    const right = sessionLog.filter((s) => s.right).length;
    const missed = sessionLog.filter((s) => !s.right).length;
    return (
      <div style={{ ...shell, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 24px" }}>
        <style>{keyframes}</style>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 600, margin: "0 0 14px", lineHeight: 1.15 }}>
          Lesson done
        </h1>
        <p style={{ fontSize: 16.5, color: C.mist, lineHeight: 1.6, margin: "0 0 8px" }}>
          {right} answered from memory{missed > 0 && `, ${missed} not yet`}.
        </p>
        {missed > 0 && (
          <p style={{ fontSize: 15, color: C.glow, lineHeight: 1.6, margin: "0 0 8px" }}>
            The ones you missed come back tomorrow.
          </p>
        )}
        {newlyMastered.length > 0 && (
          <p style={{ fontSize: 15, color: C.coral, lineHeight: 1.6, margin: "0 0 8px" }}>
            Now mastered: {newlyMastered.map((id) => TOPICS.find((t) => t.id === id).name).join(", ")}.
          </p>
        )}
        <div style={{ marginTop: 28 }}>
          <button onClick={() => setView("map")} style={{
            width: "100%", padding: "16px", borderRadius: 14, border: "none",
            background: C.glow, color: C.abyss, fontFamily: FONT_UI, fontSize: 16,
            fontWeight: 600, cursor: "pointer", marginBottom: 10,
          }}>
            Back to the map
          </button>
          <button onClick={() => start(null)} style={{
            width: "100%", padding: "15px", borderRadius: 14, border: `1px solid ${C.line}`,
            background: "transparent", color: C.foam, fontFamily: FONT_UI, fontSize: 15, cursor: "pointer",
          }}>
            Another lesson
          </button>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------ lesson view */
  const topic = TOPICS.find((t) => t.id === item.topic);
  const pct = ((qIdx) / queue.length) * 100;

  return (
    <div style={{ ...shell, display: "flex", flexDirection: "column" }}>
      <style>{keyframes}</style>

      <div style={{ padding: "22px 22px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <button onClick={() => setView("map")} style={{
            background: "none", border: "none", color: C.mist, fontSize: 22,
            padding: 0, cursor: "pointer", lineHeight: 1,
          }} aria-label="Leave lesson">×</button>
          <div style={{ flex: 1, height: 6, borderRadius: 3, background: C.shelf, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: C.glow, transition: "width .25s" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 18 }}>
          <span style={{
            fontSize: 11.5, padding: "3px 9px", borderRadius: 20,
            border: `1px solid ${C.line}`, color: C.glow,
          }}>{SHAPE_NAME[item.type]}</span>
          <span style={{ fontSize: 12.5, color: C.line }}>{topic.name}</span>
        </div>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "0 22px 20px" }}>
        {item.type === "choice" && <ChoiceQ item={item} locked={locked} picked={answer} setPicked={setAnswer} />}
        {item.type === "multi" && <MultiQ item={item} locked={locked} picked={answer} setPicked={setAnswer} />}
        {item.type === "gap" && <GapQ item={item} locked={locked} filled={answer} setFilled={setAnswer} />}
        {item.type === "match" && <MatchQ item={item} locked={locked} state={answer} setState={setAnswer} />}
        {item.type === "chain" && <ChainQ item={item} locked={locked} order={answer} setOrder={setAnswer} />}
      </div>

      <div style={{
        padding: "16px 22px 26px", position: "relative",
        borderTop: locked ? `1px solid ${C.line}` : "none",
        background: locked ? (wasRight ? "rgba(79,216,196,.07)" : "rgba(255,158,125,.06)") : "transparent",
      }}>
        <Confetti on={celebrate} />
        {locked && (
          <div style={{ marginBottom: 14, animation: "mrise .22s ease-out" }}>
            <p style={{
              fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 600, margin: "0 0 5px",
              color: wasRight ? C.ok : C.no,
            }}>
              {wasRight ? "That's it" : "Not yet — it'll come back"}
            </p>
            <p style={{ fontSize: 14.5, color: C.foam, lineHeight: 1.5, margin: 0, opacity: 0.9 }}>
              {item.why}
            </p>
          </div>
        )}
        <button
          onClick={locked ? next : submit}
          disabled={!locked && !canSubmit()}
          style={{
            width: "100%", padding: "16px", borderRadius: 14, border: "none",
            fontFamily: FONT_UI, fontSize: 16, fontWeight: 600,
            background: !locked && !canSubmit() ? C.shelf : C.glow,
            color: !locked && !canSubmit() ? C.line : C.abyss,
            cursor: !locked && !canSubmit() ? "default" : "pointer",
          }}>
          {locked ? (qIdx + 1 >= queue.length ? "Finish" : "Next") : "Check"}
        </button>
      </div>

      {reveal && (
        <div style={{
          position: "absolute", inset: 0, background: "rgba(4,20,31,.94)",
          display: "flex", flexDirection: "column", justifyContent: "center",
          alignItems: "center", padding: 32, textAlign: "center", zIndex: 20,
          animation: "mrise .3s ease-out",
        }}>
          <p style={{ fontSize: 13, color: C.glow, letterSpacing: ".05em", margin: "0 0 4px" }}>
            {reveal.rarity} discovery
          </p>
          <CreatureArt id={reveal.id} size={168} />
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 27, fontWeight: 600, margin: "8px 0 10px" }}>
            {reveal.name}
          </h2>
          <p style={{ fontSize: 15.5, color: C.mist, lineHeight: 1.6, margin: "0 0 28px", maxWidth: 340 }}>
            {reveal.fact}
          </p>
          <button onClick={() => setReveal(null)} style={{
            padding: "14px 34px", borderRadius: 14, border: "none", background: C.glow,
            color: C.abyss, fontFamily: FONT_UI, fontSize: 16, fontWeight: 600, cursor: "pointer",
          }}>
            Add to collection
          </button>
        </div>
      )}
    </div>
  );
}
