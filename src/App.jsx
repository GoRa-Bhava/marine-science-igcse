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
const FONT_DISPLAY = "'Fraunces Variable', Georgia, serif";

/* ------------------------------------------------------------- content */
const TOPICS = [
  { id: "space",    unit: 1, name: "Earth in space",           depth: "Surface" },
  { id: "inside",   unit: 1, name: "Inside the Earth",         depth: "10 m" },
  { id: "plates",   unit: 1, name: "Plate boundaries",         depth: "60 m" },
  { id: "quakes",   unit: 1, name: "Earthquakes and tsunamis", depth: "200 m" },
  { id: "oceans",   unit: 1, name: "Seas and oceans",          depth: "800 m" },
  { id: "floor",    unit: 1, name: "The ocean floor",          depth: "2,400 m" },
  { id: "coords",   unit: 1, name: "Latitude and longitude",   depth: "5,000 m" },
  { id: "tides",    unit: 1, name: "Tides and currents",       depth: "10,900 m" },

  { id: "matter",   unit: 2, name: "Matter and particles",     depth: "States" },
  { id: "cycle",    unit: 2, name: "The water cycle and ice",  depth: "Surface" },
  { id: "salinity", unit: 2, name: "Salinity",                 depth: "35 ppt" },
  { id: "density",  unit: 2, name: "Density",                  depth: "1.03 g/cm³" },
  { id: "ph",       unit: 2, name: "pH of seawater",           depth: "pH 8.1" },
  { id: "depth",    unit: 2, name: "What changes with depth",  depth: "Down the column" },
  { id: "zones",    unit: 2, name: "Ocean zones and light",    depth: "200–4,000 m" },
  { id: "upwell",   unit: 2, name: "Upwelling and El Niño",    depth: "Eastern Pacific" },

  { id: "cells",    unit: 3, name: "Inside the cell",            depth: "Organelles" },
  { id: "magnif",   unit: 3, name: "Magnification",              depth: "×10 to ×400" },
  { id: "repro",    unit: 3, name: "Reproduction",               depth: "Gametes" },
  { id: "fins",     unit: 3, name: "Fish fins and movement",     depth: "Five fins" },
  { id: "gills",    unit: 3, name: "Gills and senses",           depth: "Gill cover" },
  { id: "symmetry", unit: 3, name: "Body symmetry",              depth: "Left and right" },
  { id: "radial",   unit: 3, name: "Cnidarians and echinoderms", depth: "Radial" },
  { id: "bilat",    unit: 3, name: "Crustaceans, molluscs, annelids", depth: "Bilateral" },
];

const UNITS = [
  { n: 1, name: "Earth and oceans" },
  { n: 2, name: "Seawater" },
  { n: 3, name: "Marine organisms" },
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

  /* ============================================ UNIT 2 — SEAWATER ==== */

  /* ------------------------------------------------ Matter & particles */
  {
    id: "ma1", topic: "matter", type: "choice",
    q: "What are the three states of matter?",
    options: [
      "Solids, liquids and gases",
      "Solids, liquids and plasmas",
      "Solids, gases and compounds",
      "Liquids, gases and elements",
    ],
    a: 0,
    why: "Solid, liquid, gas. Water is the one substance you meet in all three in this course: ice, seawater, water vapour.",
  },
  {
    id: "ma2", topic: "matter", type: "choice",
    q: "What is a compound?",
    options: [
      "A substance made of two or more different elements chemically combined",
      "A mixture of substances that are not chemically joined",
      "A substance made of only one type of atom",
      "Any substance that will dissolve in water",
    ],
    a: 0,
    why: "Chemically combined is the key phrase. H₂O is a compound; seawater is a mixture.",
  },
  {
    id: "ma3", topic: "matter", type: "choice",
    q: "Define the term 'diffusion'.",
    options: [
      "The movement of particles from a region of higher concentration to a region of lower concentration",
      "The movement of particles from a region of lower concentration to a region of higher concentration",
      "The movement of water across a partially permeable membrane",
      "Particles sinking and settling at the bottom of a liquid",
    ],
    a: 0,
    why: "High to low. The third option describes osmosis, which is a different process.",
  },
  {
    id: "ma4", topic: "matter", type: "gap",
    q: "Complete the definition of diffusion.",
    segments: ["Diffusion is the movement of ", " from a region of ", " concentration to a region of ", " concentration."],
    answers: ["particles", "higher", "lower"],
    bank: ["particles", "higher", "lower", "salts", "equal", "greater"],
    why: "Say particles rather than salts — diffusion applies to gases and dissolved substances alike.",
  },
  {
    id: "ma5", topic: "matter", type: "match",
    q: "Match each term to its description.",
    pairs: [
      ["Solid", "Particles packed closely in a fixed shape"],
      ["Liquid", "Particles that flow and take the container's shape"],
      ["Gas", "Particles spread far apart, filling the space"],
      ["Compound", "Two or more elements chemically combined"],
    ],
    why: "The states differ in how the particles are arranged, not in what they are made of.",
  },
  {
    id: "ma6", topic: "matter", type: "chain",
    q: "Build the explanation: why does a drop of food colouring spread through still water?",
    chunks: [
      "the colouring starts in one small region",
      "so its particles are at a much higher concentration there",
      "particles move randomly in all directions",
      "giving a net movement from high to low concentration",
      "until the colour is spread evenly through the water",
    ],
    why: "Random movement plus a concentration difference gives a net flow. No stirring is needed.",
  },

  /* -------------------------------------------- Water cycle and ice */
  {
    id: "wc1", topic: "cycle", type: "choice",
    q: "What are the stages of the water cycle?",
    options: [
      "Evaporation, condensation, precipitation, surface run-off",
      "Condensation, evaporation, precipitation, surface run-off",
      "Evaporation, precipitation, condensation, surface run-off",
      "Precipitation, evaporation, surface run-off, condensation",
    ],
    a: 0,
    why: "Water leaves the sea as vapour, cools into cloud, falls as rain, then flows back to the sea.",
  },
  {
    id: "wc2", topic: "cycle", type: "multi",
    q: "Select every factor that affects the rate of evaporation.",
    options: [
      "Air temperature",
      "Wind or air movement",
      "Humidity",
      "Pressure",
      "Salinity",
      "The pH of the water",
      "The depth of the seabed",
    ],
    a: [0, 1, 2, 3, 4],
    why: "Five factors: air temperature, wind, humidity, pressure and salinity.",
  },
  {
    id: "wc3", topic: "cycle", type: "choice",
    q: "Which raises sea level more when it melts — land ice or sea ice?",
    options: ["Land ice", "Sea ice", "Both raise it equally", "Neither raises sea level"],
    a: 0,
    why: "Sea ice is already floating and displacing water, so melting it adds very little. Land ice adds water that wasn't in the sea before.",
  },
  {
    id: "wc4", topic: "cycle", type: "gap",
    q: "Complete the water cycle.",
    segments: ["Water evaporates, then ", " into clouds, falls as ", ", and returns to the sea as surface ", "."],
    answers: ["condenses", "precipitation", "run-off"],
    bank: ["condenses", "precipitation", "run-off", "diffuses", "upwelling", "filtration"],
    why: "Evaporation, condensation, precipitation, surface run-off.",
  },
  {
    id: "wc5", topic: "cycle", type: "chain",
    q: "Put the water cycle in order, starting at the ocean surface.",
    chunks: [
      "water at the sea surface evaporates into the air",
      "the water vapour rises and cools",
      "it condenses into clouds",
      "water falls back to Earth as precipitation",
      "and flows over land as surface run-off, returning to the sea",
    ],
    why: "The cycle closes: run-off returns the water to the sea, ready to evaporate again.",
  },

  /* ------------------------------------------------------- Salinity */
  {
    id: "sa1", topic: "salinity", type: "choice",
    q: "Define the term 'salinity'.",
    options: [
      "The concentration of dissolved salts in water",
      "The total mass of water in an ocean",
      "How acidic or alkaline the water is",
      "The amount of oxygen dissolved in water",
    ],
    a: 0,
    why: "Concentration of dissolved salts. Acidity is pH, which is a separate measurement.",
  },
  {
    id: "sa2", topic: "salinity", type: "choice",
    q: "What effect does increasing salinity have on the density of seawater?",
    options: [
      "Density increases",
      "Density decreases",
      "Density is unaffected",
      "Density increases then decreases",
    ],
    a: 0,
    why: "More dissolved salt means more mass in the same volume, so the water is denser.",
  },
  {
    id: "sa3", topic: "salinity", type: "gap",
    q: "Complete the sentence.",
    segments: ["Salinity is the concentration of dissolved ", " in water. The more saline the water is, the ", " its density will be."],
    answers: ["salts", "greater"],
    bank: ["salts", "greater", "lower", "gases", "acids", "equal"],
    why: "Higher salinity, greater density. This is what drives dense water to sink.",
  },
  {
    id: "sa4", topic: "salinity", type: "multi",
    q: "Select every statement that is true about salinity.",
    options: [
      "It measures the dissolved salts in water",
      "Higher salinity gives water a greater density",
      "Salinity affects the rate of evaporation",
      "It measures how acidic the water is",
      "Higher salinity gives water a lower density",
    ],
    a: [0, 1, 2],
    why: "Salinity appears twice in this unit: it changes density, and it is one of the factors affecting evaporation.",
  },
  {
    id: "sa5", topic: "salinity", type: "chain",
    q: "Build the explanation: why does very salty water sink beneath less salty water?",
    chunks: [
      "salt dissolves into the water",
      "the dissolved salt adds mass without adding much volume",
      "so that water becomes more dense",
      "and denser water sinks below less dense water",
    ],
    why: "Mass up, volume roughly the same, so density up. Density decides what floats and what sinks.",
  },

  /* -------------------------------------------------------- Density */
  {
    id: "de1", topic: "density", type: "choice",
    q: "What is density?",
    options: [
      "A measure of how much mass a substance has for its volume",
      "The total mass of a substance",
      "The total volume a substance takes up",
      "The force a substance exerts on the seabed",
    ],
    a: 0,
    why: "Density relates the two: mass and volume together, not either one alone.",
  },
  {
    id: "de2", topic: "density", type: "choice",
    q: "How do you calculate density?",
    options: [
      "Density = mass ÷ volume",
      "Density = volume ÷ mass",
      "Density = mass × volume",
      "Density = mass + volume",
    ],
    a: 0,
    why: "Divide the mass of a substance by its volume.",
  },
  {
    id: "de3", topic: "density", type: "gap",
    q: "Complete the method.",
    segments: ["To find density, divide the ", " of a substance by its ", "."],
    answers: ["mass", "volume"],
    bank: ["mass", "volume", "salinity", "pressure", "weight", "depth"],
    why: "Mass ÷ volume. Watch the units — g and cm³ give g/cm³.",
  },
  {
    id: "de4", topic: "density", type: "choice",
    q: "A sample of seawater has a mass of 206 g and a volume of 200 cm³. What is its density?",
    options: ["1.03 g/cm³", "0.97 g/cm³", "41,200 g/cm³", "6 g/cm³"],
    a: 0,
    why: "206 ÷ 200 = 1.03 g/cm³. Seawater sits a little above 1.00 because of its dissolved salts.",
  },
  {
    id: "de5", topic: "density", type: "match",
    q: "Match each term to its description.",
    pairs: [
      ["Density", "Mass divided by volume"],
      ["Higher salinity", "Gives water a greater density"],
      ["Colder water", "Denser than warmer water"],
      ["Less dense water", "Floats above denser water"],
    ],
    why: "Temperature and salinity both change density, which is why the ocean forms layers.",
  },

  /* ------------------------------------------------- pH of seawater */
  {
    id: "ph1", topic: "ph", type: "choice",
    q: "What impact does dissolved CO₂ have on the pH of seawater?",
    options: [
      "It lowers the pH, making the water more acidic",
      "It raises the pH, making the water more alkaline",
      "It has no effect on pH",
      "It makes the water exactly neutral",
    ],
    a: 0,
    why: "Dissolved CO₂ lowers pH. This is what ocean acidification means.",
  },
  {
    id: "ph2", topic: "ph", type: "multi",
    q: "Select every way you could measure the pH of water.",
    options: [
      "pH paper",
      "Universal Indicator solution",
      "A digital pH meter",
      "A Secchi disc",
      "A thermometer",
    ],
    a: [0, 1, 2],
    why: "A Secchi disc measures light penetration and a thermometer measures temperature — neither tells you pH.",
  },
  {
    id: "ph3", topic: "ph", type: "gap",
    q: "Complete the sentence.",
    segments: ["When CO₂ dissolves in seawater it ", " the pH, making the water more ", "."],
    answers: ["lowers", "acidic"],
    bank: ["lowers", "acidic", "raises", "alkaline", "neutral", "saltier"],
    why: "Lower pH means more acidic. The numbers go down as acidity goes up.",
  },
  {
    id: "ph4", topic: "ph", type: "match",
    q: "Match each piece of equipment to what it does.",
    pairs: [
      ["pH paper", "Strip that changes colour with pH"],
      ["Universal Indicator", "Solution that changes colour with pH"],
      ["Digital pH meter", "Probe giving a numerical pH reading"],
      ["Secchi disc", "Measures light penetration, not pH"],
    ],
    why: "The meter gives a number; the other two give a colour you compare against a chart.",
  },
  {
    id: "ph5", topic: "ph", type: "chain",
    q: "Build the explanation: how does burning fossil fuels make the ocean more acidic?",
    chunks: [
      "burning fossil fuels releases CO₂ into the atmosphere",
      "some of that CO₂ dissolves into the ocean surface",
      "the dissolved CO₂ reacts with the seawater",
      "which lowers the pH of the water",
      "making the ocean more acidic",
    ],
    why: "Release, dissolve, react, lower pH. The link most answers miss is that the CO₂ has to dissolve first.",
  },

  /* ------------------------------------------ What changes with depth */
  {
    id: "dp1", topic: "depth", type: "multi",
    q: "Select every factor that varies with ocean depth.",
    options: [
      "Light penetration",
      "Pressure",
      "Density",
      "Temperature",
      "Salinity",
      "Dissolved oxygen",
      "The shape of the coastline",
    ],
    a: [0, 1, 2, 3, 4, 5],
    why: "Six factors change with depth. The coastline is a surface feature and doesn't vary with depth.",
  },
  {
    id: "dp2", topic: "depth", type: "choice",
    q: "What happens to pressure as you go deeper in the ocean?",
    options: [
      "It increases steadily",
      "It decreases steadily",
      "It stays the same",
      "It rises then falls",
    ],
    a: 0,
    why: "More water above you means more weight pressing down, so pressure climbs the whole way.",
  },
  {
    id: "dp3", topic: "depth", type: "choice",
    q: "What happens to light penetration as depth increases?",
    options: [
      "It decreases until no light reaches at all",
      "It increases with depth",
      "It stays constant to the sea floor",
      "It decreases then increases again",
    ],
    a: 0,
    why: "Light fades with depth, which is exactly what defines the ocean zones.",
  },
  {
    id: "dp4", topic: "depth", type: "gap",
    q: "Complete the sentence.",
    segments: ["As you go deeper in the ocean, pressure ", " and light penetration ", "."],
    answers: ["increases", "decreases"],
    bank: ["increases", "decreases", "stays the same", "doubles", "stops", "reverses"],
    why: "Pressure up, light down. These two changes shape what can survive at each depth.",
  },
  {
    id: "dp5", topic: "depth", type: "match",
    q: "Match each factor to how it behaves with depth.",
    pairs: [
      ["Light penetration", "Falls to nothing below about 1,000 m"],
      ["Pressure", "Rises steadily the deeper you go"],
      ["Temperature", "Generally falls as you descend"],
      ["Density", "Rises as water gets colder and saltier"],
    ],
    why: "Pressure and density rise; light and temperature fall.",
  },

  /* --------------------------------------------- Ocean zones and light */
  {
    id: "zo1", topic: "zones", type: "choice",
    q: "What is the twilight zone?",
    options: [
      "Around 200–1,000 m down, where some light reaches but not enough for photosynthesis",
      "The top 200 m, where photosynthesis takes place",
      "1,000–4,000 m down, where no light reaches at all",
      "The flat region of the ocean floor",
    ],
    a: 0,
    why: "Some light, but too little for photosynthesis. That's the distinction that matters.",
  },
  {
    id: "zo2", topic: "zones", type: "choice",
    q: "What is the midnight zone?",
    options: [
      "The zone beneath the twilight zone, 1,000–4,000 m down, where no light penetrates",
      "The zone 200–1,000 m down, where a little light reaches",
      "The sunlit surface layer of the ocean",
      "The deepest trench in the Pacific Ocean",
    ],
    a: 0,
    why: "No light at all below 1,000 m — any light down there is made by the animals themselves.",
  },
  {
    id: "zo3", topic: "zones", type: "choice",
    q: "What is a Secchi disc used for?",
    options: [
      "Measuring light penetration and turbidity at different depths",
      "Measuring the salinity of seawater",
      "Measuring pressure on the sea floor",
      "Collecting plankton samples from the surface",
    ],
    a: 0,
    why: "You lower it until it disappears — that depth of disappearance tells you how transparent the water is.",
  },
  {
    id: "zo4", topic: "zones", type: "gap",
    q: "Complete the depths.",
    segments: ["The twilight zone runs from about ", " m down to about ", " m. Below it the midnight zone reaches about ", " m."],
    answers: ["200", "1,000", "4,000"],
    bank: ["200", "1,000", "4,000", "50", "10,000", "36,000"],
    why: "200 to 1,000 for twilight, 1,000 to 4,000 for midnight.",
  },
  {
    id: "zo5", topic: "zones", type: "chain",
    q: "Order these from the surface downwards.",
    chunks: [
      "sunlit surface water, where photosynthesis happens",
      "the twilight zone, beginning around 200 m",
      "the midnight zone, beginning around 1,000 m",
      "the sea floor, around 4,000 m down",
    ],
    why: "Each boundary is set by how much light is left.",
  },
  {
    id: "zo6", topic: "zones", type: "match",
    q: "Match each term to its description.",
    pairs: [
      ["Twilight zone", "Some light, but no photosynthesis"],
      ["Midnight zone", "No light penetrates at all"],
      ["Secchi disc", "Measures the depth of disappearance"],
    ],
    why: "The zones are defined by light, and the Secchi disc is how you measure it.",
  },

  /* ----------------------------------------- Upwelling and El Niño */
  {
    id: "up1", topic: "upwell", type: "choice",
    q: "Define the term 'upwelling'.",
    options: [
      "Cold, nutrient-rich water from the deep ocean rising to the surface",
      "Warm surface water sinking down into the deep ocean",
      "The regular rise and fall of the tide",
      "A narrow current flowing rapidly away from the shore",
    ],
    a: 0,
    why: "Cold, nutrient-rich, and rising. Those nutrients are what make upwelling zones so productive.",
  },
  {
    id: "up2", topic: "upwell", type: "choice",
    q: "What is El Niño?",
    options: [
      "A climate event when sea surface temperature is much warmer than normal in the eastern Pacific",
      "A climate event when sea surface temperature is much colder than normal in the eastern Pacific",
      "A seasonal wind that reverses across the Indian Ocean",
      "A period of unusually high tides worldwide",
    ],
    a: 0,
    why: "Warmer than normal, eastern Pacific. Name the ocean as well as the change.",
  },
  {
    id: "up3", topic: "upwell", type: "choice",
    q: "How could you model an upwelling at home?",
    options: [
      "Blow a fan across a tub of water with food colouring added",
      "Freeze salt water and watch how it melts",
      "Pour oil onto water and stir it",
      "Lower a Secchi disc into a bucket of water",
    ],
    a: 0,
    why: "The fan moves the surface water aside, and you can watch the colouring show water rising to replace it.",
  },
  {
    id: "up4", topic: "upwell", type: "gap",
    q: "Complete the definition of upwelling.",
    segments: ["Upwelling is the process where ", ", nutrient-rich water from the ", " ocean rises to the ", "."],
    answers: ["cold", "deep", "surface"],
    bank: ["cold", "deep", "surface", "warm", "shallow", "seabed"],
    why: "Cold, deep, rising to the surface — all three parts are needed for full marks.",
  },
  {
    id: "up5", topic: "upwell", type: "multi",
    q: "Select every effect of El Niño.",
    options: [
      "A rise in water temperatures",
      "A decrease in nutrients",
      "Changes in rainfall",
      "Food chain problems, as producers grow less",
      "A fall in animal population numbers",
      "An increase in upwelling",
    ],
    a: [0, 1, 2, 3, 4],
    why: "El Niño reduces upwelling rather than increasing it, which is why nutrients fall.",
  },
  {
    id: "up6", topic: "upwell", type: "chain",
    q: "Build the explanation: why does El Niño reduce fish populations?",
    chunks: [
      "sea surface temperature rises in the eastern Pacific",
      "the warm surface layer reduces upwelling",
      "so fewer nutrients reach the surface water",
      "producers such as phytoplankton grow less",
      "and the consumers that feed on them decline",
    ],
    why: "Warm water sits on top and blocks the cold nutrient-rich water from rising. Producers first, consumers after.",
  },

  /* ===================================== UNIT 3 — MARINE ORGANISMS ==== */

  /* ------------------------------------------------- Inside the cell */
  {
    id: "ce1", topic: "cells", type: "choice",
    q: "State the function of mitochondria.",
    options: [
      "The site of respiration, releasing energy from glucose",
      "The site of photosynthesis",
      "Where the cell's DNA is stored",
      "Controlling what enters and leaves the cell",
    ],
    a: 0,
    why: "Respiration happens in the mitochondria. It is a chemical reaction that releases energy from glucose.",
  },
  {
    id: "ce2", topic: "cells", type: "choice",
    q: "Where is DNA found in a cell?",
    options: ["In the nucleus", "In the mitochondria", "In the chloroplasts", "In the cell membrane"],
    a: 0,
    why: "The nucleus holds the DNA and other genetic material.",
  },
  {
    id: "ce3", topic: "cells", type: "choice",
    q: "Where does photosynthesis take place inside a plant cell?",
    options: ["In the chloroplasts", "In the mitochondria", "In the nucleus", "In the cell wall"],
    a: 0,
    why: "Chloroplasts for photosynthesis, mitochondria for respiration. Keep the two apart.",
  },
  {
    id: "ce4", topic: "cells", type: "choice",
    q: "Define 'eukaryotic'.",
    options: [
      "Cells that contain membrane-bound organelles such as a nucleus",
      "Cells that have no nucleus",
      "Cells that are able to photosynthesise",
      "Cells found only in animals",
    ],
    a: 0,
    why: "Animals, plants, protoctists and fungi all have eukaryotic cells.",
  },
  {
    id: "ce5", topic: "cells", type: "choice",
    q: "Which kingdom do dinoflagellates, diatoms and algae belong to?",
    options: ["Protoctist", "Plant", "Fungi", "Animal"],
    a: 0,
    why: "All three are protoctists, even though algae can look plant-like.",
  },
  {
    id: "ce6", topic: "cells", type: "gap",
    q: "Complete the sentence.",
    segments: ["Respiration is a chemical reaction that releases ", " from ", ". It happens in the ", "."],
    answers: ["energy", "glucose", "mitochondria"],
    bank: ["energy", "glucose", "mitochondria", "oxygen", "chloroplasts", "nucleus"],
    why: "Energy from glucose, in the mitochondria — three things to name for full marks.",
  },
  {
    id: "ce7", topic: "cells", type: "match",
    q: "Match each part of the cell to its role.",
    pairs: [
      ["Mitochondria", "Site of respiration"],
      ["Nucleus", "Contains the DNA"],
      ["Chloroplast", "Site of photosynthesis"],
      ["Eukaryotic cell", "Has membrane-bound organelles"],
    ],
    why: "Each organelle has one job to name. Mixing up mitochondria and chloroplasts is the classic slip.",
  },
  {
    id: "ce8", topic: "cells", type: "multi",
    q: "Select every group whose cells are eukaryotic.",
    options: ["Animals", "Plants", "Protoctists", "Fungi", "Bacteria"],
    a: [0, 1, 2, 3],
    why: "Bacteria have no nucleus, so they are prokaryotic.",
  },

  /* ---------------------------------------------------- Magnification */
  {
    id: "mg1", topic: "magnif", type: "choice",
    q: "Write down the formula for magnification.",
    options: [
      "Magnification = image size ÷ actual size",
      "Magnification = actual size ÷ image size",
      "Magnification = image size × actual size",
      "Magnification = image size − actual size",
    ],
    a: 0,
    why: "Image over actual. If the image is bigger than the real thing, the answer is bigger than one.",
  },
  {
    id: "mg2", topic: "magnif", type: "choice",
    q: "A diatom appears 40 mm wide in a photo. The real diatom is 0.1 mm wide. What is the magnification?",
    options: ["×400", "×40", "×4", "×0.0025"],
    a: 0,
    why: "40 ÷ 0.1 = 400. Both measurements must be in the same units before you divide.",
  },
  {
    id: "mg3", topic: "magnif", type: "choice",
    q: "A cell viewed at ×100 appears 5 mm across. What is its actual size?",
    options: ["0.05 mm", "500 mm", "20 mm", "0.5 mm"],
    a: 0,
    why: "Rearrange: actual size = image size ÷ magnification, so 5 ÷ 100 = 0.05 mm.",
  },
  {
    id: "mg4", topic: "magnif", type: "gap",
    q: "Complete the formula.",
    segments: ["Magnification = ", " size ÷ ", " size."],
    answers: ["image", "actual"],
    bank: ["image", "actual", "cell", "lens", "total", "field"],
    why: "Image size on top, actual size underneath.",
  },
  {
    id: "mg5", topic: "magnif", type: "chain",
    q: "Order the steps to find the actual size of a cell from a drawing.",
    chunks: [
      "measure the image with a ruler",
      "convert the measurement into the units you want the answer in",
      "note the magnification stated on the drawing",
      "rearrange the formula to actual size = image size ÷ magnification",
      "divide to get the actual size",
    ],
    why: "Measure, convert, rearrange, divide. Skipping the unit conversion is where most marks go missing.",
  },

  /* ------------------------------------------------------ Reproduction */
  {
    id: "rp1", topic: "repro", type: "choice",
    q: "Name the two main types of reproduction.",
    options: ["Sexual and asexual", "Internal and external", "Larval and adult", "Simple and complex"],
    a: 0,
    why: "Sexual reproduction uses gametes from two parents; asexual reproduction needs only one.",
  },
  {
    id: "rp2", topic: "repro", type: "choice",
    q: "Define the term 'gametes'.",
    options: [
      "The sex cells used in reproduction, such as eggs and sperm",
      "The immature forms of an animal",
      "The cells that make up an embryo",
      "The cells where respiration happens",
    ],
    a: 0,
    why: "Eggs (ova) and sperm are the examples to give.",
  },
  {
    id: "rp3", topic: "repro", type: "choice",
    q: "Define the term 'larva'.",
    options: [
      "An immature form of an animal that undergoes metamorphosis",
      "A sex cell used in reproduction",
      "A fertilised egg",
      "A fully grown adult that cannot reproduce",
    ],
    a: 0,
    why: "Immature, and it changes form — metamorphosis is the word to use.",
  },
  {
    id: "rp4", topic: "repro", type: "gap",
    q: "Complete the definition.",
    segments: ["Gametes are the ", " cells used in reproduction, for example ", " (ova) and ", " cells."],
    answers: ["sex", "eggs", "sperm"],
    bank: ["sex", "eggs", "sperm", "body", "larva", "nerve"],
    why: "Sex cells: eggs and sperm.",
  },
  {
    id: "rp5", topic: "repro", type: "match",
    q: "Match each term to its description.",
    pairs: [
      ["Sexual reproduction", "Two parents, gametes join"],
      ["Asexual reproduction", "One parent, offspring identical to it"],
      ["Gamete", "A sex cell such as an egg or sperm"],
      ["Larva", "Immature stage before metamorphosis"],
    ],
    why: "Only sexual reproduction involves gametes.",
  },
  {
    id: "rp6", topic: "repro", type: "chain",
    q: "Order the life stages of a marine animal that has a larval stage.",
    chunks: [
      "gametes — eggs and sperm — are released",
      "an egg is fertilised by a sperm",
      "the fertilised egg develops into a larva",
      "the larva undergoes metamorphosis",
      "and becomes the adult form",
    ],
    why: "Gametes → fertilisation → larva → metamorphosis → adult.",
  },

  /* ------------------------------------------ Fish fins and movement */
  {
    id: "fn1", topic: "fins", type: "choice",
    q: "Name the five main fish fin types.",
    options: [
      "Dorsal, pectoral, caudal, anal, pelvic",
      "Dorsal, pectoral, caudal, lateral, ventral",
      "Dorsal, gill, tail, anal, pelvic",
      "Pectoral, caudal, anal, pelvic, operculum",
    ],
    a: 0,
    why: "Dorsal on the back, caudal at the tail, pectoral and pelvic in pairs, anal underneath near the tail.",
  },
  {
    id: "fn2", topic: "fins", type: "choice",
    q: "What type of movement does 'yaw' describe in a fish?",
    options: [
      "A side to side swimming movement",
      "An up and down movement",
      "A rolling movement around the body's axis",
      "Moving straight forward",
    ],
    a: 0,
    why: "Yaw is side to side. It is controlled by the pectoral and pelvic fins.",
  },
  {
    id: "fn3", topic: "fins", type: "choice",
    q: "Which fins control yaw?",
    options: ["Pectoral and pelvic fins", "Dorsal and anal fins", "The caudal fin only", "The dorsal fin only"],
    a: 0,
    why: "The paired fins — pectoral and pelvic — steer side to side.",
  },
  {
    id: "fn4", topic: "fins", type: "multi",
    q: "Select the five main fin types.",
    options: ["Dorsal", "Pectoral", "Caudal", "Anal", "Pelvic", "Lateral", "Ventral"],
    a: [0, 1, 2, 3, 4],
    why: "Lateral and ventral describe positions, not fins.",
  },
  {
    id: "fn5", topic: "fins", type: "gap",
    q: "Complete the sentence.",
    segments: ["Yaw is a side to side movement controlled by the ", " and ", " fins."],
    answers: ["pectoral", "pelvic"],
    bank: ["pectoral", "pelvic", "dorsal", "caudal", "anal", "tail"],
    why: "Pectoral and pelvic — the two paired fins.",
  },
  {
    id: "fn6", topic: "fins", type: "match",
    q: "Match each fin to where it sits on the fish.",
    pairs: [
      ["Dorsal", "Along the back"],
      ["Caudal", "The tail fin"],
      ["Pectoral", "A pair just behind the gills"],
      ["Pelvic", "A pair on the underside"],
      ["Anal", "Underneath, near the tail"],
    ],
    why: "Worth knowing for diagram-labelling questions, which come up often.",
  },

  /* ------------------------------------------------- Gills and senses */
  {
    id: "gl1", topic: "gills", type: "choice",
    q: "Describe the function of the operculum.",
    options: [
      "A bony cover that protects the gills and stops water flowing backwards through them",
      "A sensory organ that detects vibrations in the water",
      "A fin used for steering side to side",
      "A gas-filled sac that controls buoyancy",
    ],
    a: 0,
    why: "Two functions: protection, and keeping water flowing one way across the gills.",
  },
  {
    id: "gl2", topic: "gills", type: "choice",
    q: "Describe the function of the lateral line.",
    options: [
      "A sensory organ that senses vibrations in the water",
      "A bony cover that protects the gills",
      "A line of muscle that drives side to side movement",
      "A membrane that absorbs oxygen from the water",
    ],
    a: 0,
    why: "It's a sense organ. Vibrations in the water tell the fish what is moving nearby.",
  },
  {
    id: "gl3", topic: "gills", type: "gap",
    q: "Complete the sentence.",
    segments: ["The operculum is a ", " cover over the ", " of bony fish. The lateral line senses ", " in the water."],
    answers: ["bony", "gills", "vibrations"],
    bank: ["bony", "gills", "vibrations", "soft", "fins", "temperature"],
    why: "Bony, gills, vibrations.",
  },
  {
    id: "gl4", topic: "gills", type: "multi",
    q: "Select every function of the operculum.",
    options: [
      "Protects the gills",
      "Stops water flowing backwards through the gills",
      "Senses vibrations in the water",
      "Controls the fish's buoyancy",
      "Steers the fish side to side",
    ],
    a: [0, 1],
    why: "Protection and one-way water flow. Sensing vibrations is the lateral line.",
  },
  {
    id: "gl5", topic: "gills", type: "match",
    q: "Match each structure to its role.",
    pairs: [
      ["Operculum", "Bony gill cover"],
      ["Lateral line", "Senses vibrations"],
      ["Gills", "Take oxygen from the water"],
      ["Pectoral fins", "Help control yaw"],
    ],
    why: "Four structures, four jobs.",
  },
  {
    id: "gl6", topic: "gills", type: "chain",
    q: "Build the explanation: how does the lateral line help a fish avoid a predator?",
    chunks: [
      "a predator moving nearby pushes water out of its way",
      "this creates vibrations that travel through the water",
      "the lateral line detects those vibrations",
      "the fish senses which direction they came from",
      "and swims away before it has even seen the predator",
    ],
    why: "Movement → vibrations → detection → direction → escape. It works in the dark, which is the point.",
  },

  /* ----------------------------------------------------- Body symmetry */
  {
    id: "sy1", topic: "symmetry", type: "choice",
    q: "Define the term 'bilateral symmetry'.",
    options: [
      "The body can be divided along one line into left and right halves that are nearly identical",
      "The body is divided equally around a central point",
      "The body has no line of symmetry",
      "The body can be divided into five equal parts",
    ],
    a: 0,
    why: "One line, two mirror-image halves. Equal on both sides.",
  },
  {
    id: "sy2", topic: "symmetry", type: "choice",
    q: "Define the term 'radial symmetry'.",
    options: [
      "The body is divided equally around a central point",
      "The body has left and right halves that mirror each other",
      "Only the front and back of the body are identical",
      "The body is made of repeating segments",
    ],
    a: 0,
    why: "Seen in starfish, jellyfish and flowering plants — parts arranged around a centre.",
  },
  {
    id: "sy3", topic: "symmetry", type: "choice",
    q: "Which organisms show radial symmetry?",
    options: ["Jellyfish and starfish", "Crabs and lobsters", "Fish and worms", "Octopuses and squid"],
    a: 0,
    why: "Jellyfish are cnidarians and starfish are echinoderms — the two radial groups.",
  },
  {
    id: "sy4", topic: "symmetry", type: "multi",
    q: "Select every group that has bilateral symmetry.",
    options: ["Crustaceans", "Molluscs", "Annelids", "Fish", "Cnidarians", "Echinoderms"],
    a: [0, 1, 2, 3],
    why: "Cnidarians and echinoderms are the radial groups. Everything else here is bilateral.",
  },
  {
    id: "sy5", topic: "symmetry", type: "match",
    q: "Match each term to its meaning.",
    pairs: [
      ["Bilateral symmetry", "Left and right halves mirror each other"],
      ["Radial symmetry", "Equal all the way around a central point"],
      ["Pentaradial symmetry", "Five-way radial symmetry, as in starfish"],
      ["Cnidarian", "Radially symmetric, with stinging tentacles"],
    ],
    why: "Pentaradial is a special case of radial — five arms around the centre.",
  },

  /* ------------------------------------- Cnidarians and echinoderms */
  {
    id: "cn1", topic: "radial", type: "choice",
    q: "State the main characteristics of Cnidaria.",
    options: [
      "Marine invertebrates with radial symmetry and tentacles with stinging cells",
      "Marine invertebrates with spiny skin and tube feet",
      "Marine invertebrates with an exoskeleton and jointed legs",
      "Invertebrates with a segmented body and setae",
    ],
    a: 0,
    why: "Radial symmetry and stinging tentacles. Jellyfish and sea anemones are cnidarians.",
  },
  {
    id: "cn2", topic: "radial", type: "choice",
    q: "State the main characteristics of Echinoderms.",
    options: [
      "Marine invertebrates with pentaradial symmetry, spiny skin and tube feet",
      "Marine invertebrates with tentacles and stinging cells",
      "Marine invertebrates with an internal or external shell",
      "Marine invertebrates with compound eyes and antennae",
    ],
    a: 0,
    why: "Five-way symmetry, spiny skin, tube feet. Starfish and sea urchins.",
  },
  {
    id: "cn3", topic: "radial", type: "multi",
    q: "Select the characteristics of Cnidaria.",
    options: ["Marine invertebrate", "Radial symmetry", "Tentacles with stinging cells", "Tube feet", "Exoskeleton"],
    a: [0, 1, 2],
    why: "Tube feet belong to echinoderms; exoskeletons to crustaceans.",
  },
  {
    id: "cn4", topic: "radial", type: "multi",
    q: "Select the characteristics of Echinoderms.",
    options: ["Marine invertebrate", "Pentaradial symmetry", "Spiny skin", "Tube feet", "Stinging cells", "Bilateral symmetry"],
    a: [0, 1, 2, 3],
    why: "Four characteristics. Stinging cells are cnidarian; echinoderms are not bilateral.",
  },
  {
    id: "cn5", topic: "radial", type: "gap",
    q: "Complete the description.",
    segments: ["Echinoderms have ", " symmetry, ", " skin and ", " feet."],
    answers: ["pentaradial", "spiny", "tube"],
    bank: ["pentaradial", "spiny", "tube", "bilateral", "smooth", "jointed"],
    why: "Pentaradial, spiny, tube.",
  },
  {
    id: "cn6", topic: "radial", type: "match",
    q: "Match each term to the right group or feature.",
    pairs: [
      ["Cnidaria", "Stinging tentacles — jellyfish, anemones"],
      ["Echinoderm", "Spiny skin and tube feet — starfish"],
      ["Radial symmetry", "Found in cnidarians"],
      ["Pentaradial symmetry", "Found in echinoderms"],
    ],
    why: "Both groups are radial, but only echinoderms are five-way.",
  },

  /* ------------------------------ Crustaceans, molluscs and annelids */
  {
    id: "cr1", topic: "bilat", type: "choice",
    q: "State the main characteristics of Crustaceans.",
    options: [
      "Exoskeleton, compound eyes, two pairs of antennae and jointed legs on a segmented abdomen",
      "Unsegmented body with an internal or external shell",
      "Segmented soft body with setae",
      "Radial symmetry with stinging cells",
    ],
    a: 0,
    why: "Crabs, lobsters and shrimp — hard outside, jointed legs, two pairs of antennae.",
  },
  {
    id: "cr2", topic: "bilat", type: "choice",
    q: "State the main characteristics of Molluscs.",
    options: [
      "Bilateral symmetry, unsegmented body, internal or external shell",
      "Exoskeleton and two pairs of antennae",
      "Segmented soft body with setae",
      "Spiny skin and tube feet",
    ],
    a: 0,
    why: "Unsegmented is the key word. The shell can be inside (squid) or outside (snail).",
  },
  {
    id: "cr3", topic: "bilat", type: "choice",
    q: "State the main characteristics of Annelids.",
    options: [
      "Bilateral symmetry, segmented soft body, have setae",
      "Unsegmented body with a shell",
      "Exoskeleton and compound eyes",
      "Pentaradial symmetry and spiny skin",
    ],
    a: 0,
    why: "Segmented worms with bristles called setae.",
  },
  {
    id: "cr4", topic: "bilat", type: "multi",
    q: "Select the characteristics of Crustaceans.",
    options: [
      "Bilateral symmetry",
      "Exoskeleton",
      "Compound eyes",
      "Two pairs of antennae",
      "Jointed legs on a segmented abdomen",
      "Internal or external shell",
      "Setae",
    ],
    a: [0, 1, 2, 3, 4],
    why: "The shell is a mollusc feature; setae are annelid.",
  },
  {
    id: "cr5", topic: "bilat", type: "match",
    q: "Match each group or term to its description.",
    pairs: [
      ["Crustacean", "Exoskeleton and two pairs of antennae"],
      ["Mollusc", "Unsegmented body, shell inside or outside"],
      ["Annelid", "Segmented soft body with setae"],
      ["Setae", "Bristles along an annelid's body"],
    ],
    why: "Segmented or not, hard or soft, shell or bristles — three ways to tell them apart.",
  },
  {
    id: "cr6", topic: "bilat", type: "gap",
    q: "Complete the sentence.",
    segments: ["Molluscs have an ", " body and an internal or external ", ". Annelids have a ", " body with setae."],
    answers: ["unsegmented", "shell", "segmented"],
    bank: ["unsegmented", "shell", "segmented", "jointed", "exoskeleton", "spiny"],
    why: "Unsegmented with a shell versus segmented with setae.",
  },
  {
    id: "cr7", topic: "bilat", type: "chain",
    q: "Identify a crab step by step, ruling out groups as you go.",
    chunks: [
      "it has bilateral symmetry — so it is not a cnidarian or an echinoderm",
      "its body is segmented — so it is not a mollusc",
      "it has a hard exoskeleton — so it is not a soft-bodied annelid",
      "it has jointed legs and two pairs of antennae",
      "so it is a crustacean",
    ],
    why: "Classification is a series of yes/no questions. Symmetry first, then segmentation, then body covering.",
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
  { id: "krill", name: "Antarctic krill", rarity: "common", fact: "Their swarms can be seen from space, and together they outweigh every human on Earth." },
  { id: "copepod", name: "Copepod", rarity: "common", fact: "Barely a millimetre long, it is probably the most numerous animal on the planet." },
  { id: "lanternfish", name: "Lanternfish", rarity: "uncommon", fact: "It rises from the twilight zone to feed each night and sinks again by dawn — the largest migration on Earth, made daily." },
  { id: "anchoveta", name: "Peruvian anchoveta", rarity: "uncommon", fact: "It thrives on upwelling off Peru, and El Niño years can collapse the entire fishery." },
  { id: "spermwhale", name: "Sperm whale", rarity: "uncommon", fact: "It dives past 2,000 m into the midnight zone and holds its breath for over an hour." },
  { id: "barreleye", name: "Barreleye fish", rarity: "rare", fact: "Its head is a transparent dome, and its tubular eyes rotate inside it to look straight up through its own forehead." },
  { id: "vampiresquid", name: "Vampire squid", rarity: "rare", fact: "Living where there is almost no oxygen, it escapes by ejecting a cloud of glowing mucus instead of ink." },
  { id: "starfish", name: "Common starfish", rarity: "common", fact: "It pushes its stomach out through its mouth to digest prey outside its body, then pulls it back in." },
  { id: "hermitcrab", name: "Hermit crab", rarity: "common", fact: "When it outgrows its shell, hermit crabs sometimes queue up by size and swap shells one after another." },
  { id: "anemone", name: "Sea anemone", rarity: "uncommon", fact: "It looks like a flower but is an animal, and some can live for over a century." },
  { id: "featherduster", name: "Feather duster worm", rarity: "uncommon", fact: "The feathery crown is its gills and its food-catching net at once, and it snaps into its tube in a fraction of a second." },
  { id: "nudibranch", name: "Nudibranch", rarity: "uncommon", fact: "Some eat stinging jellyfish relatives and store the unfired stinging cells in their own skin to reuse." },
  { id: "nautilus", name: "Nautilus", rarity: "rare", fact: "It has been nearly unchanged for 500 million years and rises and sinks by adjusting gas in its shell chambers." },
  { id: "diatom", name: "Diatom", rarity: "rare", fact: "A single-celled protoctist in a glass shell that produces around a fifth of the oxygen you breathe." },
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
  const fallback = (
    <>
      <ellipse cx="48" cy="52" rx="26" ry="15" fill={C.mist} opacity="0.7" />
      <path d="M72 52 L88 40 L88 64 Z" fill={C.mist} opacity="0.7" />
      <circle cx="34" cy="48" r="3" fill={C.abyss} />
    </>
  );
  return (
    <svg viewBox="0 0 100 100" style={s} aria-hidden="true">
      {art[id] || fallback}
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
      display: "flex", alignItems: "center",
      boxSizing: "border-box", minHeight: 58,
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
      const rec = p.items[item.id];
      /* An item only climbs the ladder when the gap has actually elapsed.
         Extra practice on the same day is welcome, but it isn't spacing. */
      const gapElapsed = !rec || !rec.seen || rec.due <= todayISO();
      if (!isRetry) {
        if (gapElapsed) next.items[item.id] = scheduleAfter(rec, right);
        else if (!right) next.items[item.id] = scheduleAfter(rec, false);
      }

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
            Marine Science IGCSE · Units 1 to 3
          </p>
          <h1 style={{
            fontFamily: FONT_DISPLAY, fontSize: 34, lineHeight: 1.08, fontWeight: 600,
            margin: "0 0 10px", letterSpacing: "-0.02em",
          }}>
            Earth, water and life
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
          {UNITS.map((u) => {
            const list = TOPICS.filter((t) => t.unit === u.n);
            const done = list.filter((t) => stats[t.id].state === "mastered").length;
            return (
              <div key={u.n}>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "baseline",
                  margin: "6px 0 16px", paddingBottom: 8, borderBottom: `1px solid ${C.shelf}`,
                }}>
                  <span style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 600, color: C.glow }}>
                    Unit {u.n} · {u.name}
                  </span>
                  <span style={{ fontSize: 12, color: C.line }}>{done}/{list.length}</span>
                </div>
                {list.map((t, idx) => {
                  const s = stats[t.id];
                  return (
                    <div key={t.id} style={{ display: "flex", gap: 14, alignItems: "stretch" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 34 }}>
                        <DepthNode strength={s.strength} state={s.state} />
                        {idx < list.length - 1 && (
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
                          {s.state === "learning" && `Learning · ${s.seen} of ${s.total} questions met`}
                          {s.state === "growing" && `Holding · ${Math.round(s.strength * 100)}% through the schedule`}
                          {s.state === "mastered" && "Mastered"}
                          {s.due > 0 && <span style={{ color: C.coral }}> · {s.due} due</span>}
                        </div>
                      </button>
                    </div>
                  );
                })}
                <div style={{ height: 14 }} />
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
            then in three days, then in a week. The percentage tracks how far a topic
            has travelled through that schedule, not how many you got right today —
            so it only climbs once the gap has actually passed.
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
