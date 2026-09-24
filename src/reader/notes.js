// Marine Science IGCSE 0697 — Read section: syllabus notes (Units 1–6).
// Authored from the per-unit Curriculum Knowledge Models, plain English at IGCSE level,
// every note tagged to its syllabus outcome. STATUS: human_review — vet before going live.
// Shape: NOTES[unit] = { title, sections:[ { id, title, intro, tip?, example?, notes:[{h, ref, body, linked?}], terms:[[term,def],...] } ] }
//   tip     = a short EXAMINER TIP (mark-scheme/technique nugget) for the section — HTML with <b>; render as a callout.
//   example = an optional WORKED EXAMPLE (calculation sections only) — HTML with <b>; render as a callout.
export const NOTES = {
 "1": {
  "title": "Earth Processes",
  "sections": [
   {
    "id": "1.1",
    "title": "Earth in space and structure",
    "intro": "Where the Earth and Moon sit in space, what holds them there, and what the Earth is made of inside.",
    "tip": "Get the layer order right from the centre out — inner core (solid iron), outer core (liquid iron), mantle (solid rock), crust. The inner core is solid despite being the hottest, because the pressure squeezes it solid.",
    "notes": [
     {
      "h": "Earth, Moon and the Sun",
      "ref": "1.1/LO1",
      "body": "The Earth is a <b>planet</b> that orbits the Sun. The Moon is the Earth's <b>natural satellite</b> — a body that orbits the Earth. So the Moon goes around the Earth, and the Earth goes around the Sun."
     },
     {
      "h": "What keeps them in orbit",
      "ref": "1.1/LO2",
      "body": "<b>Gravity</b> — the pull between masses — keeps the Earth orbiting the Sun and the Moon orbiting the Earth. This same gravity is what raises the tides (topic 1.4)."
     },
     {
      "h": "Inside the Earth: four layers",
      "ref": "1.1/LO3",
      "body": "From the centre outwards: a <b>solid inner core</b> and a <b>liquid outer core</b>, both made of iron; then the <b>mantle</b>, made of solid rock; then the <b>crust</b>, the thin solid rocky layer we live on."
     },
     {
      "h": "Magma",
      "ref": "1.1/LO3",
      "body": "The mantle is solid rock, but it can melt to form <b>magma</b> — a thick, sticky (viscous) liquid. This matters later: magma is what rises to make volcanoes."
     },
     {
      "h": "The Earth's magnetic field",
      "ref": "1.1/LO4",
      "body": "Because the core is made of <b>iron</b>, it creates a <b>magnetic field</b> around the whole Earth. (Some animals use this field to navigate — Unit 3.)"
     }
    ],
    "terms": [
     [
      "Natural satellite",
      "a body that orbits a planet — the Moon orbiting Earth"
     ],
     [
      "Gravity",
      "the pull between masses that holds the orbits"
     ],
     [
      "Inner / outer core",
      "solid then liquid, both iron, at the centre"
     ],
     [
      "Mantle",
      "the thick layer of solid rock that can melt to magma"
     ],
     [
      "Crust",
      "the thin solid rocky outer layer"
     ]
    ]
   },
   {
    "id": "1.2",
    "title": "Plate tectonics",
    "intro": "The crust is broken into moving plates. Where they meet, we get earthquakes, volcanoes and tsunamis.",
    "tip": "The cause of plate movement you need is <b>convection currents in the mantle</b>. Don't write 'slab pull' or 'ridge push' — they're not required for 0697.",
    "notes": [
     {
      "h": "The crust is made of plates",
      "ref": "1.2/LO1",
      "body": "The Earth's crust is not one solid shell. It is broken into a number of large pieces called <b>tectonic plates</b> that fit together and move very slowly."
     },
     {
      "h": "What moves the plates",
      "ref": "1.2/LO2",
      "body": "The plates rest (“float”) on the solid rock of the mantle, which flows extremely slowly. They move because of <b>convection currents</b> in the mantle — hot rock rises, cooler rock sinks, and this slow circulation drags the plates along."
     },
     {
      "h": "Supercontinents",
      "ref": "1.2/LO3",
      "body": "The continents were once joined in <b>supercontinents</b>. Over hundreds of millions of years the plates moved and the pieces drifted apart, giving today's continents and oceans — and they are still moving."
     },
     {
      "h": "Three types of plate boundary",
      "ref": "1.2/LO4",
      "body": "<b>Convergent</b>: plates move towards each other (one may be forced under the other). <b>Divergent</b>: plates move apart. <b>Transform</b>: plates slide past each other sideways."
     },
     {
      "h": "Earthquakes and volcanoes",
      "ref": "1.2/LO5",
      "body": "<b>Volcano</b> (convergent): one plate is forced under another (<b>subducted</b>), sinks into the hot mantle and melts; the magma rises through the plate above and erupts. <b>Earthquake</b>: plates become locked together, movement builds up tension, then they suddenly slip and release a burst of energy. Both happen mostly along plate boundaries.",
      "linked": "Interactive · subduction & earthquake"
     },
     {
      "h": "How a tsunami forms",
      "ref": "1.2/LO6",
      "body": "A sudden movement of the seabed (usually an underwater earthquake) <b>displaces a huge volume of water</b>. A wave spreads across the ocean and grows in height as it reaches shallow water near the coast."
     },
     {
      "h": "Effects of a tsunami",
      "ref": "1.2/LO7",
      "body": "On <b>marine ecosystems</b>: coral reefs broken, mangroves and seagrass uprooted, sediment stirred up and smothering life. On <b>coastal communities</b>: loss of life; homes, boats and harbours destroyed; low land flooded; fresh water and farmland contaminated with salt; livelihoods like fishing and tourism lost."
     }
    ],
    "terms": [
     [
      "Tectonic plate",
      "one of the large moving pieces of the crust"
     ],
     [
      "Convection current",
      "slow circulation in the mantle that moves the plates"
     ],
     [
      "Convergent / divergent / transform",
      "towards / apart / sliding-past boundaries"
     ],
     [
      "Subducted",
      "forced beneath another plate"
     ],
     [
      "Tsunami",
      "waves from seabed movement displacing water"
     ]
    ]
   },
   {
    "id": "1.3",
    "title": "Oceans and the sea floor",
    "intro": "The world's oceans, how they connect, how big and deep they are, and the shape of the sea floor.",
    "tip": "Name sea-floor features precisely — continental shelf, continental slope, abyssal plain, trench, mid-ocean ridge — and remember the shallow, sunlit continental shelf is the most productive zone.",
    "notes": [
     {
      "h": "The five oceans",
      "ref": "1.3/LO1",
      "body": "The Earth has five oceans: the <b>Arctic, Atlantic, Pacific, Indian and Southern</b>."
     },
     {
      "h": "Finding places on a map",
      "ref": "1.3/LO2",
      "body": "Lines of <b>latitude</b> run east–west, parallel to the <b>equator</b> (0° latitude). Lines of <b>longitude</b> run north–south and meet at the poles. A position is given as <b>coordinates</b>: its latitude (°N/°S) and longitude (°E/°W). The <b>tropical</b> zone is near the equator, the <b>polar</b> zones near the poles, and the <b>temperate</b> zones lie between."
     },
     {
      "h": "One World Ocean",
      "ref": "1.3/LO3",
      "body": "The five oceans are all connected, so water can flow between them. Together they encircle the Earth as one continuous <b>World Ocean</b>."
     },
     {
      "h": "How much, how deep",
      "ref": "1.3/LO4",
      "body": "The oceans cover <b>71% of the Earth's surface</b> and hold <b>97% of the Earth's water</b>. The <b>Pacific</b> is the largest ocean. The deepest point is the <b>Mariana Trench</b>, about <b>11 000 metres</b> deep."
     },
     {
      "h": "Seas",
      "ref": "1.3/LO5",
      "body": "A <b>sea</b> is a smaller area of water than an ocean. It may lie within an ocean (the Bering Sea in the Pacific) and is often partly enclosed by land (the Mediterranean)."
     },
     {
      "h": "The shape of the sea floor",
      "ref": "1.3/LO6",
      "body": "Going out from the coast: the <b>continental shelf</b> (shallow, gently sloping), then the <b>continental slope</b> (a steep drop), then the <b>abyssal plain</b> (the flat deep floor). Also a <b>mid-ocean ridge</b> (an underwater mountain chain where plates move apart), an <b>ocean trench</b> (a deep narrow dip where one plate is forced under another), and a <b>volcanic island</b> (a volcano built up from the sea floor above the surface).",
      "linked": "Diagram · sea-floor profile"
     }
    ],
    "terms": [
     [
      "World Ocean",
      "the five connected oceans as one continuous body"
     ],
     [
      "Coordinates",
      "a position as latitude (°N/S) and longitude (°E/W)"
     ],
     [
      "Continental shelf / slope",
      "shallow platform, then the steep drop to the deep floor"
     ],
     [
      "Abyssal plain",
      "the flat deep-ocean floor"
     ],
     [
      "Mid-ocean ridge / ocean trench",
      "where plates move apart / where one is forced under another"
     ]
    ]
   },
   {
    "id": "1.4",
    "title": "Tides and currents",
    "intro": "Why the sea rises and falls, and how ocean water keeps moving around the planet.",
    "tip": "Tidal amplitude = (high − low) ÷ 2 — always halve. The formula is given, so the marks are for using it correctly: subtract, then ÷ 2, with the right units.",
    "example": "High water 4.8 m, low water 1.0 m → range = 3.8 m → amplitude = 3.8 ÷ 2 = <b>1.9 m</b>.",
    "notes": [
     {
      "h": "High and low tides",
      "ref": "1.4/LO1",
      "body": "The Moon's gravity (and the Sun's) pulls on the ocean water, so the sea rises to a <b>high tide</b> and falls to a <b>low tide</b> about twice a day.",
      "linked": "Interactive · Tides — drag the Moon"
     },
     {
      "h": "Spring and neap tides",
      "ref": "1.4/LO1",
      "body": "<b>Spring tide</b>: when the Sun and Moon are <b>in a line</b>, their pulls combine — high tide is higher and low tide is lower (a larger <b>tidal amplitude</b>). <b>Neap tide</b>: when they are <b>at right angles</b>, their effects partly cancel, giving a smaller amplitude. (Spring tides have nothing to do with the season.)"
     },
     {
      "h": "Measuring tidal amplitude",
      "ref": "1.4/LO2",
      "body": "Measure the water height against a fixed vertical scale (or use a recording <b>tide gauge</b>) at regular times through a full tidal cycle, and note the highest and lowest readings. More frequent readings are less likely to miss the true high or low. <b>Tidal amplitude = (high tide − low tide) ÷ 2.</b>"
     },
     {
      "h": "Ocean currents",
      "ref": "1.4/LO3–4",
      "body": "A <b>current</b> is the continuous movement of sea water in a particular direction. Currents are caused by <b>prevailing winds</b>, the <b>spinning of the Earth</b>, <b>tides</b>, and <b>changes in water density</b> (colder, saltier water sinks)."
     },
     {
      "h": "Gyres",
      "ref": "1.4/LO5–7",
      "body": "A <b>gyre</b> is a large system of circular currents. There are five main gyres — North and South Atlantic, North and South Pacific, and the Indian Ocean. Together, currents and gyres circulate water around the whole World Ocean."
     },
     {
      "h": "Rip currents",
      "ref": "1.4/LO8",
      "body": "Waves push water onto the shore; it flows back out through a narrow gap as a fast, narrow current heading away from the beach. A rip can carry a swimmer out to sea and tire them, but it does <b>not</b> pull them under — the safe response is to swim <b>parallel to the shore</b> until out of it."
     },
     {
      "h": "Measuring a current",
      "ref": "1.4/LO9",
      "body": "For direction, release a <b>float</b> and take a compass bearing of the way it drifts. For speed, time the float over a known distance and use <b>speed = distance ÷ time</b>. Repeat and average for reliability."
     }
    ],
    "terms": [
     [
      "Tidal amplitude",
      "(high tide − low tide) ÷ 2"
     ],
     [
      "Spring / neap tide",
      "Sun & Moon in a line (bigger) / at right angles (smaller)"
     ],
     [
      "Current",
      "continuous movement of sea water in one direction"
     ],
     [
      "Gyre",
      "a large system of circular currents (five main ones)"
     ],
     [
      "Rip current",
      "a fast narrow flow back out to sea — swim parallel to escape"
     ]
    ]
   }
  ]
 },
 "2": {
  "title": "Sea Water",
  "sections": [
   {
    "id": "2.1",
    "title": "The water cycle",
    "intro": "How water moves between the sea, the air and the land, and the particle ideas that explain the changes it goes through.",
    "tip": "For melting ice and sea level, only ice resting on <b>land</b> raises the sea level when it melts; floating sea ice does not, because it already displaces its own weight.",
    "notes": [
     {
      "h": "Solids, liquids and gases",
      "ref": "2.1/LO1",
      "body": "In a <b>solid</b> the particles are close together in a regular pattern and only vibrate in fixed positions, so it keeps a fixed shape and volume. In a <b>liquid</b> the particles are close but irregular and can move past each other, so it has a fixed volume but takes the shape of its container and flows. In a <b>gas</b> the particles are far apart and move fast in all directions, so it fills its container and is easily squashed."
     },
     {
      "h": "Temperature",
      "ref": "2.1/LO2",
      "body": "<b>Temperature</b> is a measure of the average kinetic energy of the particles. In other words, hotter means the particles are moving faster. It is measured in <b>°C</b>."
     },
     {
      "h": "Diffusion",
      "ref": "2.1/LO3",
      "body": "<b>Diffusion</b> is the net movement of particles from a region of higher concentration to a region of lower concentration. It happens because of the random movement of the particles, with no external push or stirring needed. It carries on until the particles are evenly spread out."
     },
     {
      "h": "Changes of state",
      "ref": "2.1/LO4",
      "body": "<b>Melting</b> is solid to liquid and <b>freezing</b> is liquid to solid. <b>Evaporation</b> is liquid to gas, happening from the surface below the boiling point. <b>Condensation</b> is gas to liquid."
     },
     {
      "h": "Energy in changes of state",
      "ref": "2.1/LO5",
      "body": "Melting and evaporation <b>take in energy</b> from the surroundings, so the particles can gain energy and break free. Freezing and condensation <b>give out energy</b> to the surroundings. The temperature does not change during the change of state itself."
     },
     {
      "h": "Floating ice vs land-based ice",
      "ref": "2.1/LO6",
      "body": "When <b>floating ice</b> melts it does not raise the water level, because the ice already displaces its own mass of water. When ice held above the water on land (<b>land-based ice</b> like glaciers and ice sheets) melts, it adds water and <b>raises the level</b>, causing flooding and habitat loss. Both kinds of melting ice add fresh water, which <b>lowers salinity and density</b>. A fair test uses the same mass of ice, repeats, a narrow vessel for clearer readings, and waits until all the ice has melted."
     },
     {
      "h": "The water cycle",
      "ref": "2.1/LO7",
      "body": "Water <b>evaporates</b> from the ocean surface, and the vapour rises and cools. It then <b>condenses</b> into clouds and falls as <b>precipitation</b> such as rain or snow. Water returns to the sea as <b>run-off</b> in rivers. The whole cycle is driven by energy from the <b>Sun</b>."
     },
     {
      "h": "What speeds up evaporation",
      "ref": "2.1/LO8",
      "body": "A <b>higher temperature</b> gives particles more kinetic energy so more can escape the surface, which is why tropical seas evaporate faster than polar seas. <b>Ice cover</b> stops evaporation, and <b>wind</b> speeds it up by removing vapour from above the surface. Air that is already <b>humid</b> slows it down, and a <b>larger surface area</b> speeds it up."
     }
    ],
    "terms": [
     [
      "Diffusion",
      "the spreading of particles from where they are crowded to where there are fewer, due to random movement"
     ],
     [
      "Evaporation",
      "a liquid turning into a gas at its surface, below boiling point"
     ],
     [
      "Condensation",
      "a gas turning into a liquid"
     ],
     [
      "Precipitation",
      "water falling from clouds as rain or snow"
     ],
     [
      "Run-off",
      "water flowing over the land in rivers back to the sea"
     ],
     [
      "Temperature",
      "a measure of the average kinetic energy of particles"
     ]
    ]
   },
   {
    "id": "2.2",
    "title": "pH and salinity",
    "intro": "What sea water is made of, how acidic or alkaline it is, and why some seas are saltier than others.",
    "tip": "Salinity is in parts per thousand (ppt), not percent, and the open ocean is about 35 ppt. For the named seas always give the <b>reason</b> (evaporation, run-off), never just 'hot' or 'cold'.",
    "notes": [
     {
      "h": "Element, compound, mixture",
      "ref": "2.2/LO1",
      "body": "An <b>element</b> is made of only one type of atom, such as oxygen. A <b>compound</b> is two or more elements chemically joined in fixed proportions, such as calcium carbonate. A <b>mixture</b> is substances that are not chemically joined and can be separated physically, such as sea water, which is water plus dissolved salts and gases."
     },
     {
      "h": "The pH scale",
      "ref": "2.2/LO2",
      "body": "The <b>pH scale</b> runs from 0 to 14, and <b>pH 7 is neutral</b>. Below 7 is <b>acidic</b> and the lower the number the more acidic. Above 7 is <b>alkaline</b>; sea water is slightly alkaline, fresh water is about neutral, and rain water is slightly acidic."
     },
     {
      "h": "Measuring pH with universal indicator",
      "ref": "2.2/LO3",
      "body": "<b>Universal indicator</b> changes colour depending on the pH, and you match the colour to a chart to read it off. Use the same volume of each water sample, the same number of drops of indicator, and clean equipment between samples. Sea water shows slightly alkaline, fresh water about neutral, and rain water slightly acidic."
     },
     {
      "h": "Carbon dioxide and pH",
      "ref": "2.2/LO4",
      "body": "Adding <b>carbon dioxide</b> to sea water lowers its pH, making it more acidic, because the gas dissolves to form a weak acid. This is linked to <b>ocean acidification</b>. Rising acidity means the pH goes down, not up."
     },
     {
      "h": "Solutions and solubility",
      "ref": "2.2/LO5",
      "body": "In sea water, water is the <b>solvent</b> and the dissolved salts are the <b>solutes</b>, making it a <b>solution</b>. Salts that are <b>soluble</b>, like sodium chloride and magnesium sulfate, dissolve; <b>insoluble</b> substances like calcium carbonate barely dissolve and instead form shells and skeletons. <b>Sodium chloride</b> is the most abundant dissolved salt."
     },
     {
      "h": "Temperature and solubility of solids",
      "ref": "2.2/LO6",
      "body": "For most solid solutes, such as sodium chloride and sugar, <b>solubility increases with temperature</b>. You test this by adding solute to a fixed volume of water at set temperatures until no more dissolves (it is <b>saturated</b>), and recording the mass dissolved. Note that stirring only speeds up dissolving; it does not increase how much can dissolve."
     },
     {
      "h": "Salinity and ppt",
      "ref": "2.2/LO7",
      "body": "<b>Salinity</b> is the concentration of dissolved salts in sea water. It is measured in <b>parts per thousand (ppt)</b>, meaning grams of dissolved salt per 1000 g of sea water. Open-ocean salinity is typically about <b>35 ppt</b>."
     },
     {
      "h": "Salinities of named seas",
      "ref": "2.2/LO8",
      "body": "The <b>Pacific Ocean</b> has a typical salinity because it is open and well mixed. The <b>Baltic Sea</b> has a low salinity because of lots of river run-off and rain, little evaporation in its cool climate, and limited mixing as it is partly enclosed. The <b>Red Sea</b> has a high salinity because it is hot with high evaporation, very little rainfall or river inflow, and is partly enclosed."
     },
     {
      "h": "Factors that change salinity",
      "ref": "2.2/LO9",
      "body": "<b>Erosion of rocks</b> on land adds dissolved salts carried to the sea. <b>Run-off</b> and <b>precipitation</b> add fresh water and lower salinity, while <b>evaporation</b> removes water and leaves the salt behind, raising it. <b>Melting ice</b> adds fresh water and lowers salinity, and higher <b>temperature</b> raises salinity by causing more evaporation."
     },
     {
      "h": "Estuaries",
      "ref": "2.2/LO10-11",
      "body": "An <b>estuary</b> is a partly enclosed body of water where a river flows into the sea. Estuaries are tidal, so fresh river water mixes with sea water and the salinity keeps changing. Salinity rises toward high tide as sea water pushes in and falls toward low tide as river water takes over, staying <b>brackish</b> (in between) and higher nearer the sea."
     }
    ],
    "terms": [
     [
      "Element",
      "a substance made of only one type of atom"
     ],
     [
      "Compound",
      "two or more elements chemically joined in fixed proportions"
     ],
     [
      "Mixture",
      "substances not chemically joined that can be separated physically"
     ],
     [
      "Solute",
      "the substance that dissolves, such as the salts in sea water"
     ],
     [
      "Solvent",
      "the liquid that dissolves the solute, such as water"
     ],
     [
      "Salinity",
      "the concentration of dissolved salts, measured in ppt"
     ],
     [
      "Estuary",
      "a partly enclosed body of water where a river meets the sea"
     ]
    ]
   },
   {
    "id": "2.3",
    "title": "Dissolved gases",
    "intro": "How oxygen and carbon dioxide get into sea water, how much of each there is, and why warming changes it.",
    "tip": "Watch the direction trap: gases dissolve <b>less</b> as water warms — the opposite of solids. So warm sea water holds less oxygen for organisms.",
    "notes": [
     {
      "h": "Where dissolved gases come from",
      "ref": "2.3/LO1",
      "body": "Oxygen and carbon dioxide from the atmosphere <b>dissolve</b> into sea water at the surface. <b>Oxygen has a low solubility</b> in water, so dissolved oxygen is scarce and can limit marine life. Oxygen is also added by <b>photosynthesis</b>, while carbon dioxide is more soluble."
     },
     {
      "h": "Oxygen and carbon dioxide compared",
      "ref": "2.3/LO2",
      "body": "Air contains <b>far more oxygen</b> than sea water does, because oxygen dissolves poorly. Sea water contains <b>far more carbon dioxide</b> than air does, because carbon dioxide is very soluble. The two comparisons go in opposite directions."
     },
     {
      "h": "Temperature and gas solubility",
      "ref": "2.3/LO3",
      "body": "As temperature rises, the <b>solubility of oxygen and carbon dioxide falls</b>. This is because the gas particles gain kinetic energy and escape the liquid more easily. So <b>warm water holds less dissolved oxygen</b>. This is the opposite of solids, which dissolve more in warm water."
     },
     {
      "h": "Investigating temperature and gases",
      "ref": "2.3/LO4",
      "body": "To test this, warm water to a range of temperatures and measure the dissolved oxygen with an <b>oxygen probe or test kit</b>, or watch gas bubbles being released. Control the volume, the water source and the time, and repeat readings. Bubbles released on warming are the gas escaping, not boiling."
     }
    ],
    "terms": [
     [
      "Dissolved oxygen",
      "oxygen gas that has dissolved into the water, used by marine life"
     ],
     [
      "Solubility",
      "how much of a substance can dissolve in a liquid"
     ],
     [
      "Photosynthesis",
      "the process in which plants and algae make oxygen in the light"
     ]
    ]
   },
   {
    "id": "2.4",
    "title": "Density",
    "intro": "What density means, how to calculate it, and how differences in density make sea water move and form layers.",
    "tip": "You must recall density = mass ÷ volume (it isn't given). Colder water and saltier water are both denser.",
    "example": "A 1000 cm³ sample of sea water has a mass of 1030 g → density = 1030 ÷ 1000 = <b>1.03 g/cm³</b> (fresh water is 1.00).",
    "notes": [
     {
      "h": "Calculating density",
      "ref": "2.4/LO1",
      "body": "<b>Density</b> is mass per unit volume, worked out as <b>density = mass ÷ volume</b>. You can rearrange it to mass = density × volume, or volume = mass ÷ density. It is measured in <b>g/cm³</b>; sea water is about <b>1.03 g/cm³</b> and fresh water about 1.00 g/cm³."
     },
     {
      "h": "Temperature and density",
      "ref": "2.4/LO2",
      "body": "<b>Colder water is denser</b> than warmer water. To test this, measure the mass of a fixed volume of water at different temperatures, controlling the salinity and volume. The result is that density falls as temperature rises."
     },
     {
      "h": "Salinity and density",
      "ref": "2.4/LO3",
      "body": "<b>Saltier water is denser</b>. To test this, take equal volumes of solutions of known salinity and measure their mass, or float an object such as an egg, keeping the temperature the same. The result is that density rises with salinity."
     },
     {
      "h": "Convection currents",
      "ref": "2.4/LO4",
      "body": "When part of a liquid is heated it expands, becomes <b>less dense and rises</b>, while cooler denser liquid sinks to replace it. This continuous circulation is a <b>convection current</b>. In the ocean, warm surface water at the equator and cold dense water sinking at the poles drive deep circulation."
     },
     {
      "h": "Explaining density in particle terms",
      "ref": "2.4/LO5",
      "body": "Heating gives the particles more kinetic energy, so they move faster and further apart. The same mass then takes up a <b>larger volume</b>, so the density (mass ÷ volume) <b>falls</b>. Cooling does the reverse. The particles themselves do not get bigger and the mass does not change."
     },
     {
      "h": "Why cold water lies underneath",
      "ref": "2.4/LO6",
      "body": "Colder water is denser, and <b>denser water sinks</b> below less dense water. So cold water lies beneath warm water. This gives layers, with a warm surface and a cold deep."
     }
    ],
    "terms": [
     [
      "Density",
      "the mass of a substance per unit of its volume"
     ],
     [
      "Convection current",
      "circulation caused by warm liquid rising and cold liquid sinking"
     ],
     [
      "Volume",
      "the amount of space something takes up"
     ]
    ]
   },
   {
    "id": "2.5",
    "title": "Effects of increasing depth",
    "intro": "The conditions in the sea that change as you go deeper, and why each one changes.",
    "tip": "Learn the five conditions that change with depth — light, pressure, temperature, salinity, dissolved oxygen. Light doesn't stop suddenly; it fades, and is gone by about 1000 m.",
    "notes": [
     {
      "h": "What changes with depth",
      "ref": "2.5/LO1",
      "body": "Five conditions change as depth increases: <b>light penetration</b>, <b>pressure</b>, <b>temperature</b>, <b>salinity</b> and <b>dissolved oxygen</b>. Learning these five is the starting point for this section."
     },
     {
      "h": "Light penetration",
      "ref": "2.5/LO2",
      "body": "Light intensity <b>decreases with depth</b> as it is absorbed and scattered by the water and by particles in it. Most light is gone within the upper <b>200 m</b>, and there is none below about 1000 m. <b>Clearer water</b> lets light penetrate deeper."
     },
     {
      "h": "Measuring clarity with a Secchi disc",
      "ref": "2.5/LO3",
      "body": "A <b>Secchi disc</b> is a white disc lowered on a marked line until it just disappears from view. That <b>Secchi depth</b> measures water clarity, so a greater depth means clearer water and deeper light penetration. For fair results use the same observer, the same time of day and the shaded side, and repeat and average."
     },
     {
      "h": "Pressure",
      "ref": "2.5/LO4",
      "body": "<b>Pressure increases with depth</b> because the weight of the water above increases. The increase is steady as you go down. This is why deep-sea organisms live under very high pressure."
     },
     {
      "h": "Temperature",
      "ref": "2.5/LO5",
      "body": "There is a warm surface layer heated by the <b>Sun</b>. Temperature <b>falls with depth</b>, dropping quickly through the middle layer. The deep ocean is then cold and very stable."
     },
     {
      "h": "Dissolved oxygen",
      "ref": "2.5/LO6",
      "body": "Dissolved oxygen is <b>high at the surface</b>, because gas dissolves from the atmosphere and photosynthesis adds oxygen in the light. It <b>falls with depth</b>, because there is no photosynthesis in the dark, oxygen is used up by respiration and decomposition, and there is little mixing from the surface. So deep water has little dissolved oxygen."
     }
    ],
    "terms": [
     [
      "Light penetration",
      "how far sunlight reaches down into the water"
     ],
     [
      "Pressure",
      "the pushing force from the weight of water above"
     ],
     [
      "Secchi disc",
      "a white disc used to measure how clear the water is"
     ],
     [
      "Secchi depth",
      "the depth at which the disc just disappears, showing water clarity"
     ]
    ]
   },
   {
    "id": "2.6",
    "title": "Upwelling",
    "intro": "How wind brings deep nutrient-rich water to the surface, and how the El Niño event disrupts it in the Pacific.",
    "tip": "For upwelling, link the whole chain: deep nutrient-rich water rises → more producers → more fish. If upwelling is reduced, fish catches fall.",
    "notes": [
     {
      "h": "Wind-driven upwelling",
      "ref": "2.6/LO1",
      "body": "Winds blowing along or away from a coast push the warm surface water away. Cold, <b>nutrient-rich water rises from depth</b> to replace it, which is called <b>upwelling</b>. The nutrients support high productivity, feeding plankton and fish."
     },
     {
      "h": "How El Niño forms",
      "ref": "2.6/LO2",
      "body": "Normally the <b>trade winds</b> blow east to west across the Pacific, pushing warm surface water west and allowing upwelling of cold water in the east. In an <b>El Niño</b> year the trade winds weaken or reverse. Warm water then stays or moves east, so the <b>eastern Pacific surface warms</b> and <b>upwelling there is reduced</b>."
     },
     {
      "h": "Local effects of El Niño",
      "ref": "2.6/LO3",
      "body": "In the eastern Pacific, warmer water and reduced upwelling mean <b>fewer nutrients</b>, less plankton and a <b>lower fish catch</b>, along with heavy rainfall and flooding. In <b>Australia and Asia</b>, on the western side, there is drought, lower rainfall and bushfires. The effects are opposite on the two sides of the Pacific."
     }
    ],
    "terms": [
     [
      "Upwelling",
      "cold nutrient-rich water rising to the surface as wind pushes surface water away"
     ],
     [
      "Nutrients",
      "dissolved substances that support the growth of plankton and other life"
     ],
     [
      "Trade winds",
      "steady winds that normally blow east to west across the Pacific"
     ],
     [
      "El Niño",
      "an event when the trade winds weaken or reverse, warming the eastern Pacific"
     ]
    ]
   }
  ]
 },
 "3": {
  "title": "Marine Organisms",
  "sections": [
   {
    "id": "3.1",
    "title": "Cell structure and function",
    "intro": "What the parts of plant, animal and bacterial cells look like, and the job each part does.",
    "tip": "Plant cells have a wall <b>in addition to</b> a membrane, not instead of it. Magnification = image size ÷ actual size — convert both to the same units first.",
    "example": "An image is 30 mm across; the real cell is 0.5 mm → magnification = 30 ÷ 0.5 = <b>×60</b> (convert to the same units first).",
    "notes": [
     {
      "h": "Animal and plant cells",
      "ref": "3.1/LO1",
      "body": "Animal cells have a <b>cell membrane</b>, a <b>nucleus</b>, <b>cytoplasm</b> and <b>mitochondria</b>. Plant cells have all of those too. Plant cells also have three extra parts: a <b>cell wall</b> on the outside of the membrane, <b>chloroplasts</b>, and one large permanent <b>vacuole</b>."
     },
     {
      "h": "Bacterial cells",
      "ref": "3.1/LO2",
      "body": "A <b>bacterial cell</b> has only a <b>cell wall</b>, a <b>cell membrane</b> and <b>cytoplasm</b>. It has no nucleus, no mitochondria and no chloroplasts. Its genetic material sits loose in the cytoplasm."
     },
     {
      "h": "Spotting the parts in a picture",
      "ref": "3.1/LO3",
      "body": "The <b>cell wall</b> is the thick outer boundary; the <b>membrane</b> is a thin line (it is the outer edge of an animal cell). The <b>nucleus</b> is the large round body and the <b>vacuole</b> is the big central space. <b>Chloroplasts</b> are small green ovals and the <b>cytoplasm</b> is the filled background."
     },
     {
      "h": "What each part does",
      "ref": "3.1/LO4",
      "body": "The <b>nucleus</b> holds the genetic material and controls the cell. The <b>membrane</b> controls what enters and leaves, and the <b>cytoplasm</b> is where the chemical reactions happen. The <b>cell wall</b> supports the cell and stops it bursting, <b>chloroplasts</b> absorb light for photosynthesis, <b>mitochondria</b> release energy by respiration, and the <b>vacuole</b> stores water and dissolved substances."
     }
    ],
    "terms": [
     [
      "Cell wall",
      "the thick outer layer that supports a plant or bacterial cell and stops it bursting"
     ],
     [
      "Cell membrane",
      "the thin layer that controls what enters and leaves the cell"
     ],
     [
      "Nucleus",
      "the part that holds the genetic material and controls the cell"
     ],
     [
      "Chloroplast",
      "the part that absorbs light for photosynthesis"
     ],
     [
      "Mitochondria",
      "the parts where respiration releases energy"
     ],
     [
      "Vacuole",
      "the large space in a plant cell that stores water and dissolved substances"
     ]
    ]
   },
   {
    "id": "3.2",
    "title": "Reproduction",
    "intro": "The two ways organisms make new offspring, and how the offspring differ.",
    "tip": "External fertilisation releases eggs and sperm into the water, so huge numbers of gametes are needed because many are lost. Always link the fact to the reason.",
    "notes": [
     {
      "h": "Asexual reproduction",
      "ref": "3.2/LO1",
      "body": "In <b>asexual reproduction</b> one organism makes exact copies of itself. There is only one parent and no sex cells. The offspring are identical to the parent."
     },
     {
      "h": "Sexual reproduction",
      "ref": "3.2/LO2",
      "body": "In <b>sexual reproduction</b> an organism makes male and female <b>sex cells</b>. Two sex cells join, or fuse, together. The offspring get characteristics from both parents."
     }
    ],
    "terms": [
     [
      "Asexual reproduction",
      "one parent making exact copies of itself, with no sex cells"
     ],
     [
      "Sexual reproduction",
      "male and female sex cells fusing to make offspring from two parents"
     ],
     [
      "Sex cell",
      "a male or female cell that fuses with another to make offspring"
     ]
    ]
   },
   {
    "id": "3.3",
    "title": "Classification",
    "intro": "How scientists sort living things into groups and give each one a worldwide name.",
    "tip": "Write the binomial name correctly: Genus with a capital, species lowercase (e.g. Homo sapiens). Classification runs kingdom → … → species.",
    "notes": [
     {
      "h": "Grouping by shared features",
      "ref": "3.3/LO1",
      "body": "Marine organisms are put into groups by the <b>features they share</b>. They are not grouped by their habitat, size, diet or usefulness."
     },
     {
      "h": "The binomial name",
      "ref": "3.3/LO2",
      "body": "The <b>binomial system</b> gives each organism a two-part scientific name, for example <b>Orcinus orca</b>. The first part is the <b>genus</b> and the second part is the <b>species</b>. It is agreed internationally, so the same name is used everywhere whatever the local language."
     },
     {
      "h": "The three domains",
      "ref": "3.3/LO3",
      "body": "All living things are split into three <b>domains</b>: <b>Bacteria</b>, <b>Archaea</b> and <b>Eukarya</b>. Plants, animals and protoctists are kingdoms found inside Eukarya."
     },
     {
      "h": "Kingdoms of Eukarya in the sea",
      "ref": "3.3/LO4",
      "body": "<b>Animals</b> are multicellular, have no cell wall or chloroplasts, and feed on other organisms. <b>Plants</b> are multicellular with cell walls and chloroplasts, such as seagrass. <b>Protoctists</b> include kelp, dinoflagellates and diatoms; many are single-celled and some are multicellular."
     }
    ],
    "terms": [
     [
      "Binomial system",
      "the worldwide way of naming an organism with two parts"
     ],
     [
      "Genus",
      "the first part of a scientific name, a group of closely related species"
     ],
     [
      "Species",
      "the second part of a scientific name, one particular type of organism"
     ],
     [
      "Domain",
      "one of the three biggest groups: Bacteria, Archaea or Eukarya"
     ],
     [
      "Kingdom",
      "a group inside Eukarya, such as animals, plants or protoctists"
     ],
     [
      "Protoctist",
      "a Eukarya kingdom that includes kelp, dinoflagellates and diatoms"
     ]
    ]
   },
   {
    "id": "3.4",
    "title": "The animal kingdom",
    "intro": "How vertebrates and invertebrates are sorted into groups, the outside parts of a fish, and the practical skills of drawing, comparing and using keys.",
    "tip": "Sort invertebrates by a defining feature — body segments, jointed legs, radial symmetry — not by 'has a hard bit'. A crab is a crustacean because of jointed legs and an exoskeleton.",
    "notes": [
     {
      "h": "Sorting vertebrates into groups",
      "ref": "3.4/LO1",
      "body": "Vertebrates are grouped by three features: their <b>skin covering</b>, their <b>reproductive method</b> (internal or external fertilisation), and whether they have <b>gills or lungs</b>. Mammals have hair, internal fertilisation and lungs; birds have feathers, internal fertilisation and lungs; reptiles have scales, internal fertilisation and lungs; fish have scales, external fertilisation and gills. Reptiles and fish both have scales, so fertilisation and gas exchange tell them apart."
     },
     {
      "h": "Examples of each vertebrate group",
      "ref": "3.4/LO2",
      "body": "<b>Mammals</b> include cetaceans, pinnipeds and sirenians. <b>Birds</b> include pelagic birds and shorebirds. <b>Reptiles</b> include sea snakes and turtles, and <b>fish</b> are either cartilaginous or bony."
     },
     {
      "h": "The outside features of a fish",
      "ref": "3.4/LO3",
      "body": "The <b>operculum</b> is the gill cover, and <b>scales</b> give protection. The <b>lateral line</b> detects vibration and the <b>nares</b> detect chemicals. The <b>fins</b> (dorsal, pelvic, pectoral, anal and caudal) control pitching, rolling and yawing, change direction and give forward thrust; the caudal fin provides the thrust."
     },
     {
      "h": "Sorting invertebrates into groups",
      "ref": "3.4/LO4",
      "body": "<b>Crustaceans</b> have bilateral symmetry, an exoskeleton, compound eyes, two pairs of antennae and abdominal segments with jointed legs. <b>Cnidaria</b> have radial symmetry and tentacles with stinging cells; <b>echinoderms</b> have pentaradial symmetry, spiny skin and tube feet. <b>Molluscs</b> have bilateral symmetry, an unsegmented body and a shell, while <b>annelids</b> have bilateral symmetry, a segmented soft body and setae."
     },
     {
      "h": "Comparing specimens (practical)",
      "ref": "3.4/LO5",
      "body": "Choose the viewing tool to match the size of the specimen. Use a <b>hand lens</b> or a photograph for whole organisms and outside features, and a <b>light microscope</b> with a thin slide for cells. Compare specimens by their classification features, not by colour, size or where they were found."
     },
     {
      "h": "Drawing specimens (practical)",
      "ref": "3.4/LO6",
      "body": "A good biological drawing is <b>large</b> and uses clear, unbroken pencil lines with <b>no shading and no colour</b>. Keep the proportions and positions correct and draw only what you see, not every scale. Use straight ruled label lines that touch the feature."
     },
     {
      "h": "Working out magnification",
      "ref": "3.4/LO7",
      "body": "<b>Magnification = image size ÷ actual size</b>. To find actual size, do image size ÷ magnification. Change both measurements into the same units first (1 cm = 10 mm), then round as the question asks."
     },
     {
      "h": "Using a dichotomous key (practical)",
      "ref": "3.4/LO8",
      "body": "A <b>dichotomous key</b> is a series of paired statements or questions. Each answer leads to another pair or to the organism’s name. Good questions use fixed, easy-to-see outside features with a clear either/or answer, not things like size, weight or colour that vary."
     }
    ],
    "terms": [
     [
      "Vertebrate",
      "an animal with a backbone, such as a fish, reptile, bird or mammal"
     ],
     [
      "Invertebrate",
      "an animal without a backbone, such as a crustacean or mollusc"
     ],
     [
      "Operculum",
      "the gill cover of a fish"
     ],
     [
      "Lateral line",
      "the fish feature that detects vibration"
     ],
     [
      "Nares",
      "the fish feature that detects chemicals"
     ],
     [
      "Magnification",
      "how many times bigger an image is than the real object"
     ],
     [
      "Dichotomous key",
      "a set of paired questions used to identify an organism"
     ]
    ]
   },
   {
    "id": "3.5",
    "title": "Plant and protoctist kingdoms",
    "intro": "The one true marine plant, and the protoctists: kelp, dinoflagellates and diatoms.",
    "tip": "Kelp and other seaweeds are <b>protoctists</b>, not plants. Don't call algae 'plants' in an answer.",
    "notes": [
     {
      "h": "Seagrass, a true plant",
      "ref": "3.5/LO1",
      "body": "<b>Seagrass</b> is a real plant with roots, leaves and flowers. Its <b>leaves</b> carry out photosynthesis and its <b>roots</b> anchor it in the sediment and take up minerals. Its <b>rhizomes</b> are underground stems that connect plants and are used for asexual reproduction, while its <b>flowers</b> are for sexual reproduction."
     },
     {
      "h": "Kelp, a protoctist",
      "ref": "3.5/LO2",
      "body": "<b>Kelp</b> is a large seaweed in the protoctist kingdom. Its flat <b>blades</b> give a big surface for photosynthesis, its <b>gas bladders</b> float the blades up toward the light, and its <b>chloroplasts</b> absorb light. The <b>stipe</b> acts as a stem linking the blades to the <b>holdfast</b>, which anchors the kelp to the substrate."
     },
     {
      "h": "Dinoflagellates",
      "ref": "3.5/LO3",
      "body": "<b>Dinoflagellates</b> are microscopic, single-celled protoctists. They have <b>chloroplasts</b> for photosynthesis and <b>two flagella</b> for movement. Like a plant cell they photosynthesise, but they differ because they have flagella and are a whole single-celled organism."
     },
     {
      "h": "Diatoms",
      "ref": "3.5/LO4",
      "body": "<b>Diatoms</b> are microscopic, single-celled protoctists. They have <b>chloroplasts</b> for photosynthesis and a <b>silica skeleton</b>. This silica skeleton tells them apart from dinoflagellates, which instead have two flagella."
     }
    ],
    "terms": [
     [
      "Rhizome",
      "an underground stem that connects seagrass plants and is used for asexual reproduction"
     ],
     [
      "Holdfast",
      "the part of kelp that anchors it to the substrate"
     ],
     [
      "Stipe",
      "the stem-like part of kelp that links the holdfast to the blades"
     ],
     [
      "Gas bladder",
      "a part of some kelp that floats the blades up toward the light"
     ],
     [
      "Dinoflagellate",
      "a microscopic single-celled protoctist with chloroplasts and two flagella"
     ],
     [
      "Diatom",
      "a microscopic single-celled protoctist with chloroplasts and a silica skeleton"
     ]
    ]
   },
   {
    "id": "3.6",
    "title": "Animal life cycles",
    "intro": "How leatherback turtles and coral polyps reproduce and grow.",
    "tip": "Planktonic larvae aid dispersal and reduce competition with the adults — state the benefit, not just the stage name.",
    "notes": [
     {
      "h": "The leatherback turtle life cycle",
      "ref": "3.6/LO1",
      "body": "Females reproduce every 2 to 5 years and return to the sandy shore where they hatched. They dig a nest, lay eggs, and repeat the egg-laying several times at 10-day intervals before burying the eggs and leaving. The <b>temperature of incubation</b> decides the sex of the young. Eggs hatch after 55 to 60 days, the young go to sea to feed and grow, and they mature after 15 to 25 years; males live entirely at sea."
     },
     {
      "h": "The coral polyp life cycle",
      "ref": "3.6/LO2",
      "body": "<b>Coral polyps</b> reproduce both asexually and sexually. Asexually, a parent grows a new polyp beside itself by <b>budding</b>. Sexually, huge numbers of eggs and sperm are released into the water together; the fertilised eggs float to the surface and form planktonic <b>larvae</b>. The larvae swim toward the light, feed and grow, and are carried by currents before settling on a hard surface and growing into polyps."
     }
    ],
    "terms": [
     [
      "Incubation",
      "the period when eggs are kept warm until they hatch"
     ],
     [
      "Polyp",
      "the small fixed animal that builds coral"
     ],
     [
      "Budding",
      "asexual reproduction where a parent grows a new polyp beside itself"
     ],
     [
      "Larva",
      "a young stage that drifts in the water before settling"
     ]
    ]
   },
   {
    "id": "3.7",
    "title": "Migration",
    "intro": "Why marine animals travel, the shapes their journeys take, and how they find their way.",
    "tip": "Keep 'why' and 'how' apart: reasons to migrate (find food, breed in safe areas, avoid predators) versus the cues used (magnetic field, Sun and stars, smell).",
    "notes": [
     {
      "h": "What migration is and why",
      "ref": "3.7/LO1",
      "body": "<b>Migration</b> is the movement of organisms from one place to another, often and back again. Animals migrate to find food, to find mates, to reach a different habitat to reproduce, and to avoid predators. It is different from just moving around a home area or from drifting with the water."
     },
     {
      "h": "Migration in three dimensions",
      "ref": "3.7/LO2",
      "body": "The ocean is three-dimensional, so migration can be <b>horizontal</b> or <b>vertical</b>. It can cover short or very long distances. A daily up-and-down trip is short, while crossing an ocean is very long."
     },
     {
      "h": "Daily vertical migration",
      "ref": "3.7/LO3",
      "body": "Plankton, fish, squid and shrimp rise from the twilight zone to the sunlight zone at dusk. They feed near the surface at night, where the food is, hidden by the darkness. At dawn they sink back down and stay in the dim twilight zone during the day to avoid predators that hunt by sight."
     },
     {
      "h": "Very long horizontal migration",
      "ref": "3.7/LO4",
      "body": "Tuna, turtles and whales make very long horizontal journeys. At one end they find seasonal food, such as cold polar waters in summer. At the other end they reach a suitable place to breed or give birth, such as warm calm water, nesting beaches or spawning grounds."
     },
     {
      "h": "How animals navigate",
      "ref": "3.7/LO5",
      "body": "Animals find their way using the <b>magnetic field</b> of the Earth, and the position of the <b>Sun, Moon and stars</b>. They also use <b>olfaction</b>, which means detecting chemicals such as the scent of a river. And they build <b>mental maps</b> from remembered landmarks."
     }
    ],
    "terms": [
     [
      "Migration",
      "the movement of organisms from one place to another, often and back"
     ],
     [
      "Vertical migration",
      "movement up and down through the water, such as a daily trip to the surface"
     ],
     [
      "Horizontal migration",
      "movement across the ocean, often over very long distances"
     ],
     [
      "Navigation",
      "finding the way during a journey"
     ],
     [
      "Olfaction",
      "detecting chemicals by smell, used to navigate"
     ]
    ]
   }
  ]
 },
 "4": {
  "title": "Nutrients and Energy",
  "sections": [
   {
    "id": "4.1",
    "title": "Nutrients",
    "intro": "What nutrients are, how you test for them, what each type does, the key elements organisms need, and how nutrients are recycled in the sea.",
    "tip": "The food-test colours cross-wire easily: iodine → blue-black (starch), heated Benedict's → brick-red (reducing sugar), biuret → purple (protein), ethanol emulsion → white (lipid). State BOTH the starting and the result colour.",
    "notes": [
     {
      "h": "What a nutrient is",
      "ref": "4.1/LO1",
      "body": "A <b>nutrient</b> is a substance an organism needs for growth, for repair, and to provide chemical energy. There are three kinds: <b>gases</b> such as carbon dioxide (used by producers), <b>dissolved salts</b> such as nitrates, and <b>organic compounds</b>. Nutrients are not just food, and water and oxygen are not counted as nutrients here."
     },
     {
      "h": "The organic compounds",
      "ref": "4.1/LO1",
      "body": "There are three groups of organic compounds. <b>Carbohydrates</b> include starch and sugars such as glucose. <b>Lipids</b> are fats and oils. <b>Proteins</b> are the third group. Sugars and starch are both carbohydrates, not separate nutrient groups."
     },
     {
      "h": "Testing foods for nutrients",
      "ref": "4.1/LO2",
      "body": "Add <b>iodine solution</b> to test for <b>starch</b>: orange-brown turns blue-black. Heat with <b>Benedict’s solution</b> in a water bath to test for <b>reducing sugars</b>: blue turns green, yellow, orange or brick-red. Add <b>biuret solution</b> for <b>proteins</b>: blue turns lilac or purple. Take care: iodine gives blue-black and biuret gives purple, so do not swap them."
     },
     {
      "h": "Testing for lipids",
      "ref": "4.1/LO2",
      "body": "For the <b>ethanol emulsion test</b> for <b>lipids</b>, dissolve the sample in ethanol, then add water: a cloudy white emulsion shows lipid is present. If the colour or clearness does not change, that is a negative result, not a failed test. Ethanol is flammable, so use no naked flame, and wear eye protection as the reagents are irritants."
     },
     {
      "h": "What each nutrient group does",
      "ref": "4.1/LO3",
      "body": "<b>Protein</b> is used for tissue repair and growth, and can supply energy. <b>Carbohydrate</b> is an energy supply. <b>Lipids</b> give insulation and an energy store, and carry lipid-soluble vitamins. In marine animals, blubber is lipid for insulation and energy, and fish muscle is protein."
     },
     {
      "h": "Micronutrients",
      "ref": "4.1/LO3",
      "body": "<b>Vitamins</b> and <b>mineral salts</b> are <b>micronutrients</b>, which means they are needed only in small amounts. They do not provide energy. They are still essential for the body to work properly."
     },
     {
      "h": "Essential elements",
      "ref": "4.1/LO4",
      "body": "<b>Nitrogen</b> is needed to make proteins and <b>carbon</b> to make organic compounds. <b>Magnesium</b> is needed to make chlorophyll, so a shortage means less photosynthesis. <b>Calcium</b> builds bones, shells and coral skeletons, and <b>iron</b> is needed for haemoglobin, which carries oxygen."
     },
     {
      "h": "Nutrient cycling",
      "ref": "4.1/LO5",
      "body": "Nutrients are taken up by organisms and passed up food chains. After organisms die and decay, the nutrients become available again. Dead organisms, faeces and waste sink through the water as <b>marine snow</b>, and decay near the seabed releases nutrients into deep water. <b>Upwelling</b> then returns them to the surface, which is why deep water is nutrient-rich and surface water can be nutrient-poor."
     },
     {
      "h": "Decomposer bacteria",
      "ref": "4.1/LO6",
      "body": "<b>Decomposer</b> bacteria break down dead organisms and waste. This releases the mineral nutrients locked inside them back into the water, where producers can take them up again. Without decomposers, the nutrient cycle would stop."
     }
    ],
    "terms": [
     [
      "Nutrient",
      "a substance an organism needs for growth, repair and chemical energy"
     ],
     [
      "Micronutrient",
      "a nutrient needed only in very small amounts, such as a vitamin or mineral salt"
     ],
     [
      "Marine snow",
      "dead organisms, faeces and organic waste sinking through the water column"
     ],
     [
      "Upwelling",
      "the rising of cold, nutrient-rich deep water to the surface"
     ],
     [
      "Decomposer",
      "an organism that breaks down dead matter and releases its nutrients"
     ]
    ]
   },
   {
    "id": "4.2",
    "title": "Respiration",
    "intro": "How every living cell releases energy from nutrients, why this differs from gas exchange, and how you can measure the energy in food.",
    "tip": "All living cells respire all the time — including plants at night, which is why dissolved oxygen falls and CO₂ rises after dark. Respiration <b>releases</b> energy, it doesn't make it.",
    "notes": [
     {
      "h": "What respiration is",
      "ref": "4.2/LO1",
      "body": "<b>Respiration</b> is the chemical reactions in cells that break down nutrient molecules, mainly <b>glucose</b>, and release usable energy. It is not the same as breathing. Respiration does not make energy, it releases the energy already stored in the nutrient."
     },
     {
      "h": "All cells respire",
      "ref": "4.2/LO2",
      "body": "Every living cell in every organism respires all the time, including the cells of producers. Photosynthesis does not replace respiration. At night, producers respire but cannot photosynthesise, so <b>carbon dioxide</b> rises and <b>oxygen</b> falls in the water."
     },
     {
      "h": "Word equation for respiration",
      "ref": "4.2/LO3",
      "body": "The word equation for <b>aerobic respiration</b> is: oxygen + glucose → carbon dioxide + water. Oxygen and glucose are the reactants. Carbon dioxide and water are the products."
     },
     {
      "h": "Respiration is not gas exchange",
      "ref": "4.2/LO4",
      "body": "<b>Respiration</b> is the chemical reactions inside every cell that release energy. <b>Gas exchange</b> is the movement of oxygen into, and carbon dioxide out of, an organism across a surface such as gills, lungs or the body surface. Gas exchange supplies the oxygen that respiration needs. Good gas-exchange surfaces have a large surface area, thin walls and a good blood supply."
     },
     {
      "h": "Why low oxygen matters",
      "ref": "4.2/LO4",
      "body": "If oxygen is very low, gas exchange cannot bring in enough oxygen. Without enough oxygen, cells cannot carry out aerobic respiration. This means they cannot release the energy the organism needs."
     },
     {
      "h": "Measuring energy in food",
      "ref": "4.2/LO5",
      "body": "To find the energy in food, weigh a food sample and burn it under a boiling tube holding a measured volume of water. Record the start temperature and the highest temperature: the <b>temperature rise</b> shows how much energy was released. Keep the water volume, food mass, distance and starting temperature the same so the test is fair, then compare energy per gram."
     },
     {
      "h": "Errors and improvements in the burning test",
      "ref": "4.2/LO5",
      "body": "Some heat is lost to the air and the glass, and the food may not burn completely, so the result is usually too low. To improve it, repeat and take a mean, add a shield to reduce heat loss, and keep the distance small. Burning does not destroy the energy, it releases it."
     }
    ],
    "terms": [
     [
      "Respiration",
      "chemical reactions in cells that break down glucose to release usable energy"
     ],
     [
      "Aerobic respiration",
      "respiration that uses oxygen to release energy from glucose"
     ],
     [
      "Gas exchange",
      "movement of oxygen in and carbon dioxide out across a surface"
     ],
     [
      "Glucose",
      "the main sugar broken down in respiration to release energy"
     ],
     [
      "Temperature rise",
      "the increase in water temperature used to measure energy released by burning food"
     ]
    ]
   },
   {
    "id": "4.3",
    "title": "Photosynthesis",
    "intro": "How producers make their own food using light, which marine organisms can do it, and why upwellings make some seas so productive.",
    "tip": "Word equation: carbon dioxide + water → glucose + oxygen. Oxygen is the by-product (not starch), and because it needs light, photosynthesis only adds oxygen to the water in daylight.",
    "notes": [
     {
      "h": "What photosynthesis is",
      "ref": "4.3/LO1",
      "body": "In <b>photosynthesis</b>, some organisms make <b>glucose</b> from carbon dioxide and water using energy from light. <b>Oxygen</b> is released as a by-product. In daylight, in lit water with producers, the dissolved oxygen rises."
     },
     {
      "h": "The role of chlorophyll",
      "ref": "4.3/LO2",
      "body": "<b>Chlorophyll</b> is a green pigment that transfers energy from light into energy in organic chemicals such as carbohydrates. It sits inside <b>chloroplasts</b>. Blades or leaves with a large area and many chloroplasts can absorb more light, which is why kelp has large flat blades."
     },
     {
      "h": "What a producer is",
      "ref": "4.3/LO3",
      "body": "A <b>producer</b> is an organism that makes its own organic nutrients, generally using energy from sunlight through photosynthesis. Producers are the start of most food chains. A producer is not the same as a decomposer."
     },
     {
      "h": "Which marine organisms photosynthesise",
      "ref": "4.3/LO4",
      "body": "Three groups photosynthesise in the sea. <b>Marine plants</b>, such as seagrasses. Some <b>marine protoctists</b>, such as microalgae, macroalgae, diatoms and some dinoflagellates. Some <b>marine bacteria</b>, such as cyanobacteria. Not all plankton and not all bacteria photosynthesise."
     },
     {
      "h": "Word equation for photosynthesis",
      "ref": "4.3/LO5",
      "body": "The word equation for <b>photosynthesis</b> is: carbon dioxide + water → glucose + oxygen. This is the reverse of the respiration equation. Carbon dioxide and water are the reactants, and glucose and oxygen are the products."
     },
     {
      "h": "Light intensity and photosynthesis",
      "ref": "4.3/LO6",
      "body": "To study how light affects photosynthesis, place an aquatic plant cut-end-up in a tube of water and move a lamp to set distances, since distance changes the <b>light intensity</b>. Measure the <b>rate</b> by counting bubbles of gas per set time. Keep the tube in a water bath so the lamp does not change the temperature, and repeat for a mean. As the lamp is moved away, fewer bubbles are produced."
     },
     {
      "h": "Productivity",
      "ref": "4.3/LO7",
      "body": "<b>Productivity</b> is the rate at which producers transfer energy into carbohydrates. Higher productivity means more energy and biomass are made. It is not the same as the number of producers."
     },
     {
      "h": "Upwellings and coastal productivity",
      "ref": "4.3/LO8",
      "body": "Wind moves surface water away, and cold, nutrient-rich deep water rises up to the sunlit surface. Producers take up these nutrients and photosynthesise rapidly, so <b>productivity</b> is high. This gives more energy and biomass for consumers, supporting large fish populations. The upwelled water is cold, not warm, and it lifts nutrients rather than the producers themselves."
     }
    ],
    "terms": [
     [
      "Photosynthesis",
      "making glucose from carbon dioxide and water using light energy, releasing oxygen"
     ],
     [
      "Chlorophyll",
      "a green pigment that captures light energy for photosynthesis"
     ],
     [
      "Chloroplast",
      "the part of a cell containing chlorophyll where photosynthesis happens"
     ],
     [
      "Producer",
      "an organism that makes its own organic nutrients, usually by photosynthesis"
     ],
     [
      "Productivity",
      "the rate at which producers turn energy into carbohydrates"
     ]
    ]
   },
   {
    "id": "4.4",
    "title": "Feeding relationships",
    "intro": "How energy moves from the Sun through producers and consumers, the words used to describe who eats what, why energy is lost along the way, and how pyramids show it.",
    "tip": "Food-chain arrows point the way energy flows (prey → predator). Only about 10% passes to the next level, so give a reason for the loss — respiration, movement, not all of it eaten.",
    "example": "Biomass at one level 5.000 kg, the next 0.052 kg → transfer = 0.052 ÷ 5.000 × 100 = <b>1.04%</b>.",
    "notes": [
     {
      "h": "The Sun and food chains",
      "ref": "4.4/LO1-2",
      "body": "The <b>Sun</b> is the principal source of energy for biological systems, and producers capture it. A <b>food chain</b> shows energy transferring from one organism to the next and begins with a producer. The arrows point from the organism that is eaten to the organism that eats it, showing the direction the energy travels."
     },
     {
      "h": "Food webs",
      "ref": "4.4/LO3",
      "body": "A <b>food web</b> is a network of interconnected food chains. One organism can appear in several different chains within the web. A web is not just one long chain."
     },
     {
      "h": "Reading chains and webs",
      "ref": "4.4/LO4",
      "body": "From stated feeding relationships you can write a correct chain, with the producer first, the arrows in the energy direction, and no skipped or invented links. An organism with two food sources is less affected if one is lost. Losing a mid-level organism affects the organisms above it, not those below."
     },
     {
      "h": "Trophic levels and consumers",
      "ref": "4.4/LO5-7",
      "body": "A <b>trophic level</b> is the position of an organism in a chain, web or pyramid, with the producer as level 1. A <b>consumer</b> gets its energy by feeding on other organisms. A <b>primary consumer</b> eats the producer (level 2), a <b>secondary consumer</b> eats the primary (level 3), and a <b>tertiary consumer</b> eats the secondary (level 4). In a web, one organism can feed at more than one level."
     },
     {
      "h": "Types of consumer",
      "ref": "4.4/LO8",
      "body": "A <b>herbivore</b> eats producers, a <b>carnivore</b> eats other animals, and an <b>omnivore</b> eats both plants and animals. A <b>detritivore</b> eats dead or waste organic material, for example a sea cucumber swallowing sediment. A detritivore is an animal, so it is not the same as a decomposer."
     },
     {
      "h": "Decomposers, predators and prey",
      "ref": "4.4/LO9-10",
      "body": "A <b>decomposer</b> gets its energy by breaking down dead or waste organic material, and is usually a bacterium. This is different from a <b>detritivore</b>, which is an animal that eats that material. A <b>predator</b> captures, kills and eats another animal, which is its <b>prey</b>."
     },
     {
      "h": "Biomass and energy loss",
      "ref": "4.4/LO11-12",
      "body": "<b>Biomass</b> is the mass of living matter. Energy is lost between trophic levels through <b>respiration</b>, <b>movement</b>, <b>removal or harvesting</b>, and <b>excretion</b>. Some food is also not eaten, or passes out as faeces. Because so much energy is lost, only a fraction reaches the next level, so food chains are short."
     },
     {
      "h": "Ecological pyramids",
      "ref": "4.4/LO13",
      "body": "In a pyramid, producers form the bottom bar, and the width of each bar shows the quantity at that level. A <b>pyramid of numbers</b> can be any shape, and a <b>pyramid of biomass</b> can sometimes be inverted. A <b>pyramid of energy</b> is always upright because energy is lost at each level. To find the percentage of energy or biomass passed on, divide the higher value by the lower value and multiply by 100."
     }
    ],
    "terms": [
     [
      "Food chain",
      "a diagram showing energy transferred from one organism to the next, starting with a producer"
     ],
     [
      "Trophic level",
      "the position of an organism in a chain, web or pyramid"
     ],
     [
      "Consumer",
      "an organism that gets energy by feeding on other organisms"
     ],
     [
      "Detritivore",
      "an animal that eats dead or waste organic material"
     ],
     [
      "Biomass",
      "the mass of living matter"
     ],
     [
      "Predator",
      "an animal that captures, kills and eats its prey"
     ]
    ]
   }
  ]
 },
 "5": {
  "title": "Marine Ecosystems",
  "sections": [
   {
    "id": "5.1",
    "title": "Ecology terms, population growth, ecosystem types",
    "intro": "The basic words ecologists use, what makes a population grow or shrink, and the main kinds of marine ecosystem.",
    "tip": "Use the exact term: population (one species), community (all the species), habitat (where they live). The population-growth factors you need are food, disease, competition and predation, always for a named organism.",
    "notes": [
     {
      "h": "Species, population, community",
      "ref": "5.1/LO1",
      "body": "A <b>species</b> is a group that can reproduce together to make fertile offspring. A <b>population</b> is all the members of one species in the same area at the same time. A <b>community</b> is all the populations of the different species living in an area."
     },
     {
      "h": "Habitat, environment, ecosystem",
      "ref": "5.1/LO1",
      "body": "A <b>habitat</b> is the place where an organism lives and interacts with its surroundings and other organisms. The <b>environment</b> is everything around an organism, both living and non-living. An <b>ecosystem</b> is a community together with its environment, all interacting, such as a rocky shore or a coral reef."
     },
     {
      "h": "What changes population growth",
      "ref": "5.1/LO2",
      "body": "Four things speed up or slow down how fast a population grows. More <b>food supply</b> means faster growth; <b>disease</b> causes deaths and slows it; <b>competition</b> for food or space slows it; and <b>predation</b> kills members and slows it. These are always described for one named organism."
     },
     {
      "h": "Types of marine ecosystem",
      "ref": "5.1/LO3",
      "body": "The <b>open ocean</b> is one type. <b>Coastal ecosystems</b> sit on the continental shelf or slope and are affected by tides: wetlands, coral reefs, sandy shores, muddy shores, rocky shores, kelp forests, seagrass beds and mangrove forests."
     },
     {
      "h": "Why coasts are hit first by people",
      "ref": "5.1/LO4",
      "body": "Coastal ecosystems are close to where people live and work. They receive run-off, sewage and waste first, and are used directly for fishing, building, ports and tourism. Being shallow and small in volume, they cannot dilute pollution well."
     },
     {
      "h": "Coasts are more productive",
      "ref": "5.1/LO5",
      "body": "Coastal ecosystems generally produce more living matter than the open ocean. This is partly because <b>run-off</b> carries nutrients from the land into the water. These nutrients feed the producers, so more <b>biomass</b> is made."
     }
    ],
    "terms": [
     [
      "Species",
      "a group that can breed together to produce fertile offspring"
     ],
     [
      "Population",
      "all members of one species in the same area at the same time"
     ],
     [
      "Community",
      "all the populations of different species living in an area"
     ],
     [
      "Habitat",
      "the place where an organism lives and interacts with its surroundings"
     ],
     [
      "Ecosystem",
      "a community and its environment, all interacting together"
     ],
     [
      "Biomass",
      "the total mass of living material"
     ]
    ]
   },
   {
    "id": "5.2",
    "title": "Sampling and shore measurements",
    "intro": "Practical ways to count organisms, follow how they change across a shore, and measure the shape and sediment of the ground.",
    "tip": "Quadrats are placed at <b>random</b> (for population size); transects use <b>set intervals</b> (for distribution). 'Random' means random numbers, not evenly spread by eye.",
    "example": "Fresh sediment 100 g, dried to a constant 82 g → water lost 18 g → % water = 18 ÷ 100 × 100 = <b>18%</b>.",
    "notes": [
     {
      "h": "Random sampling with quadrats",
      "ref": "5.2/LO1",
      "body": "A <b>quadrat</b> is a square frame placed on the ground to count what is inside. Lay two tapes to make a grid, then use random numbers to pick coordinates so placement is fair and free of bias. Count the individuals (or percentage cover) in each quadrat, repeat many times, and find the mean. Scale up to the whole area, and count the number of different species present to give <b>species richness</b>."
     },
     {
      "h": "More quadrats, more reliable",
      "ref": "5.2/LO1",
      "body": "Random placement removes the sampler’s bias in choosing where to look. Taking many quadrats gives a more reliable estimate than one large count. Species richness is the number of different species, not the total number of individuals."
     },
     {
      "h": "Transects for distribution",
      "ref": "5.2/LO2",
      "body": "A <b>transect</b> is used to study how organisms change along a gradient, such as from the top of the shore down to the sea. In a <b>line transect</b>, you record the organisms touching a tape at set intervals. In a <b>belt transect</b>, you place a quadrat at set intervals along the tape and count inside it. Placement is <b>systematic</b> (evenly spaced), not random, and it shows distribution rather than a population total."
     },
     {
      "h": "Measuring the shore profile",
      "ref": "5.2/LO3",
      "body": "The <b>profile</b> is the shape of the slope. Run a tape from the low-water mark up the shore, and place two ranging poles at the ends of each section where the slope changes. Measure the distance between the poles, then use a <b>clinometer</b> sighted between the same marks on the poles to read the angle. Repeat for each section and draw the result to scale."
     },
     {
      "h": "Measuring particle profiles",
      "ref": "5.2/LO4",
      "body": "Pass dried sediment of known mass through a stack of <b>sieves</b> with mesh getting smaller down the stack. Weigh the mass caught on each sieve to show the range of particle sizes, and measure large particles with a ruler or callipers. Compare sites, and dry the sample first so particles do not clump together."
     },
     {
      "h": "Measuring moisture content",
      "ref": "5.2/LO5",
      "body": "Weigh a sample of known mass, then heat it gently to constant mass and reweigh it. The water lost equals the start mass minus the end mass, and the <b>percentage water</b> is that water divided by the start mass, times 100. Keep controls the same (same mass, depth, tide and time, with random sampling and repeats), wear eye protection, and heat gently so organic matter is not burned."
     }
    ],
    "terms": [
     [
      "Quadrat",
      "a square frame placed to count the organisms inside it"
     ],
     [
      "Species richness",
      "the number of different species present in an area"
     ],
     [
      "Transect",
      "a line along which organisms are recorded to show distribution"
     ],
     [
      "Systematic sampling",
      "sampling at set, evenly spaced intervals"
     ],
     [
      "Clinometer",
      "an instrument that measures the angle of a slope"
     ],
     [
      "Profile",
      "the shape of a shore or slope drawn to scale"
     ]
    ]
   },
   {
    "id": "5.3",
    "title": "Open-ocean zones, plankton, adaptations",
    "intro": "How the open ocean is divided by depth, the drifting plankton, and how animals are suited to each zone.",
    "tip": "Learn the zone depths — sunlight 0–200 m, twilight 200–1000 m, midnight below 1000 m — and don't use 'photic/aphotic' as the required terms.",
    "notes": [
     {
      "h": "Pelagic and benthic zones",
      "ref": "5.3/LO1-2",
      "body": "The <b>pelagic zone</b> is the whole column of water from the surface down. The <b>benthic zone</b> is the seabed and the organisms living on or in it, at any depth."
     },
     {
      "h": "The three depth zones",
      "ref": "5.3/LO3",
      "body": "The <b>sunlight zone</b> runs from 0 to 200 m. The <b>twilight zone</b> runs from 200 to 1000 m. The <b>midnight zone</b> is everything below 1000 m."
     },
     {
      "h": "Conditions in the sunlight zone",
      "ref": "5.3/LO4",
      "body": "The sunlight zone has plenty of light and high dissolved oxygen, high biomass, low pressure, variable temperature, and many photosynthetic organisms. Oxygen is high because it dissolves in from the atmosphere and because <b>photosynthesis</b> releases it into the water."
     },
     {
      "h": "Plankton: drifters",
      "ref": "5.3/LO5-7",
      "body": "<b>Plankton</b> drift in the currents rather than swimming against them. <b>Phytoplankton</b> are microscopic producers, including diatoms, dinoflagellates and cyanobacteria. <b>Zooplankton</b> are consumers, including the larvae of fish and invertebrates (which can be microscopic) and larger animals such as jellyfish."
     },
     {
      "h": "Why the sunlight zone has high biomass",
      "ref": "5.3/LO8",
      "body": "Light lets phytoplankton photosynthesise, making food for consumers, so biomass is high. There is also plenty of oxygen. This is why so much life is packed into the top layer of the ocean."
     },
     {
      "h": "Twilight and midnight conditions",
      "ref": "5.3/LO9-11",
      "body": "The <b>twilight zone</b> has low light, some dissolved oxygen, stable temperature and higher pressure. The <b>midnight zone</b> has no light, little dissolved oxygen, a very stable low temperature and very high pressure. Oxygen is low there because there is no photosynthesis and respiration uses up what sinks from above."
     },
     {
      "h": "Adaptations near the surface",
      "ref": "5.3/LO10",
      "body": "Animals of the sunlight and twilight zones are often <b>migratory</b>, moving to food or breeding grounds. They eat a wide range of food and are fast swimmers because there is no shelter. <b>Countershading</b> means a dark back and pale belly so the animal blends with the background when seen from above or below."
     },
     {
      "h": "Deep-sea adaptations",
      "ref": "5.3/LO12",
      "body": "Deep-sea animals use <b>bioluminescence</b> (making their own light) to attract mates or prey and to reveal predators. They are slow-moving with long lifespans to cope with low oxygen and cold, are dark brown or black so they are invisible in this light, and have gelatinous bodies to withstand pressure. Large <b>backward-facing teeth</b> stop caught prey escaping."
     },
     {
      "h": "Benthic adaptations",
      "ref": "5.3/LO13",
      "body": "Bottom-living animals use <b>camouflage</b> or burrowing to avoid predators. Some invertebrates have legs or tube feet on the underside and a hard spiny covering on top. <b>Flatfish</b> lie on one side, with one eye moving over so both eyes are on top; <b>skates and rays</b> are flattened top-to-bottom with wide pectoral and pelvic fins."
     }
    ],
    "terms": [
     [
      "Pelagic zone",
      "the whole column of open water from surface to depth"
     ],
     [
      "Benthic zone",
      "the seabed and the organisms on or in it"
     ],
     [
      "Plankton",
      "organisms that drift in the ocean currents"
     ],
     [
      "Countershading",
      "a dark back and pale belly for camouflage from above and below"
     ],
     [
      "Bioluminescence",
      "light made by a living organism"
     ],
     [
      "Phytoplankton",
      "microscopic drifting producers"
     ]
    ]
   },
   {
    "id": "5.4",
    "title": "Rocky shores",
    "intro": "The zones of a rocky shore and how living and non-living factors decide where each organism can survive.",
    "tip": "For rocky-shore zonation, link each adaptation to its stress: higher up the shore means longer exposure to air, so organisms need ways to avoid drying out.",
    "notes": [
     {
      "h": "Zones of a rocky shore",
      "ref": "5.4/LO1",
      "body": "The <b>supratidal zone</b> is above the high-tide mark and gets only spray. The <b>intertidal zone</b> lies between the tide marks and is covered and uncovered by each tide. The <b>subtidal zone</b> is below the low-tide mark and is always underwater."
     },
     {
      "h": "Factors affecting distribution",
      "ref": "5.4/LO2",
      "body": "Both living and non-living factors decide where organisms live. <b>Biotic</b> factors include predation and food availability. <b>Abiotic</b> factors include exposure to air, wave action, oxygen, air temperature and water temperature."
     },
     {
      "h": "How the factors work",
      "ref": "5.4/LO3",
      "body": "Exposure to air causes drying, so <b>Fucus</b> (a macroalga) and <b>sea anemones</b> are limited higher up the shore, with anemones restricted to pools or under algae. Predation limits organisms such as mussels lower down. Wave action favours firmly attached organisms, and grazers follow their food."
     },
     {
      "h": "Adaptations to a rocky shore",
      "ref": "5.4/LO4",
      "body": "<b>Limpets</b> and <b>mussels</b> close their hard shells to reduce water loss and resist predators. Sea anemones retract their tentacles and live in rock pools or under macroalgae to stay moist. <b>Fucus</b> has thick leathery fronds to resist drying and a <b>holdfast</b> to grip against currents and waves."
     }
    ],
    "terms": [
     [
      "Supratidal zone",
      "the shore above high tide, reached only by spray"
     ],
     [
      "Intertidal zone",
      "the shore between the tide marks, covered and uncovered each tide"
     ],
     [
      "Subtidal zone",
      "the shore below low tide, always submerged"
     ],
     [
      "Biotic factor",
      "a living factor, such as predation or food supply"
     ],
     [
      "Abiotic factor",
      "a non-living factor, such as temperature or wave action"
     ],
     [
      "Holdfast",
      "the root-like part that anchors seaweed to rock"
     ]
    ]
   },
   {
    "id": "5.5",
    "title": "Sandy and muddy shores",
    "intro": "How sandy and muddy shores differ, and how animals cope with a loose, low-oxygen ground.",
    "tip": "On sandy and muddy shores most organisms burrow to escape drying out and predators. Muddy shores trap more organic food but hold less oxygen than sandy shores.",
    "notes": [
     {
      "h": "Zones of sandy and muddy shores",
      "ref": "5.5/LO1",
      "body": "Sandy and muddy shores have the same three zones as a rocky shore. These are the <b>supratidal</b>, <b>intertidal</b> and <b>subtidal</b> zones, set by the tide marks."
     },
     {
      "h": "Comparing sand and mud",
      "ref": "5.5/LO2",
      "body": "<b>Sand</b> has larger particles, sits in higher-energy water, is loose and unstable, has a steeper gradient and holds more oxygen in its air spaces. <b>Mud</b> has very small particles in sheltered calm water where deposition beats erosion, sticks together when wet so it is stable, is almost flat and is waterlogged with little oxygen."
     },
     {
      "h": "Distribution on a sandy shore",
      "ref": "5.5/LO3",
      "body": "Non-living factors here include an <b>unstable substrate</b>, air temperature and exposure to air and wind; living factors include predation and food availability. Because there is no stable surface, no macroalgae can attach and few animals live on top. <b>Burrowing</b> lets animals escape predators and exposure."
     },
     {
      "h": "Adaptations to a sandy shore",
      "ref": "5.5/LO4",
      "body": "<b>Clams</b> have a muscular foot to burrow into the sand. <b>Lugworms</b> live in U-shaped burrows and have specialised <b>haemoglobin</b> to take in oxygen where there is little of it. Lugworms also swallow sand to digest the microorganisms in it."
     }
    ],
    "terms": [
     [
      "Substrate",
      "the surface or ground that organisms live on or in"
     ],
     [
      "Deposition",
      "the settling and building up of sediment"
     ],
     [
      "Erosion",
      "the wearing away and removal of sediment"
     ],
     [
      "Haemoglobin",
      "the substance that carries oxygen, letting lugworms cope with low oxygen"
     ],
     [
      "Burrowing",
      "digging into the ground to escape predators and drying"
     ]
    ]
   },
   {
    "id": "5.6",
    "title": "Mangrove forests and estuaries",
    "intro": "How mangrove forests are set up, how estuary conditions swing with the tide, and the special features of mangrove life.",
    "tip": "Match each mangrove feature to the problem it solves: salt-excreting/filtering roots (salt), aerial roots (low-oxygen mud), and support against shifting tides.",
    "notes": [
     {
      "h": "Structure of a mangrove forest",
      "ref": "5.6/LO1",
      "body": "A <b>mangrove forest</b> grows in the intertidal zone, often bordering a land forest behind it. It is often <b>estuarine</b>, meaning it sits where a river meets the sea."
     },
     {
      "h": "Estuary changes with the tide",
      "ref": "5.6/LO2",
      "body": "<b>Salinity</b> rises towards high tide as sea water flows in, and falls towards low tide when river water dominates. <b>Temperature</b> is steadier at high tide under a large volume of sea water and more variable at low tide. <b>Dissolved oxygen</b> is higher at high tide, when oxygen-rich sea water mixes in, and lower at low tide."
     },
     {
      "h": "Mangrove tree adaptations",
      "ref": "5.6/LO3",
      "body": "Waterlogged mud holds little oxygen, so mangroves have aerial roots called <b>pneumatophores</b> that stick up into the air to take in oxygen for respiration and energy. <b>Prop roots</b> support the tree in soft mud against the tidal flow. The leaves can secrete excess salt."
     },
     {
      "h": "Animal adaptations in mangroves",
      "ref": "5.6/LO4",
      "body": "The <b>banded archerfish</b> has large forward-set movable eyes for binocular vision, a mouth that shoots a jet of water to knock insects into the water, and dark bands that hide it from birds. The <b>mudskipper</b> absorbs oxygen through moist skin and its mouth and throat lining, has enlarged gill chambers that trap water, has fins shaped for moving on land, and has large eyes set high on its head."
     }
    ],
    "terms": [
     [
      "Estuarine",
      "found where a river meets the sea"
     ],
     [
      "Salinity",
      "the amount of salt dissolved in water"
     ],
     [
      "Pneumatophores",
      "aerial roots that take in oxygen for gas exchange"
     ],
     [
      "Prop roots",
      "roots that support a mangrove tree in soft mud"
     ],
     [
      "Binocular vision",
      "using both eyes together to judge distance to prey"
     ]
    ]
   },
   {
    "id": "5.7",
    "title": "Coral reefs",
    "intro": "What corals are, how they live with tiny algae, what controls where reefs grow, and why reefs are so rich in life.",
    "tip": "Coral and zooxanthellae are <b>mutualistic</b> — both benefit. Bleaching is the loss of the algae when the water is too warm; say what each partner gives.",
    "notes": [
     {
      "h": "Corals are animals",
      "ref": "5.7/LO1",
      "body": "Corals are <b>animals</b> that form colonies of many small units called <b>polyps</b>. Their tissues often contain photosynthetic microorganisms. A whole coral is a colony, not a single animal."
     },
     {
      "h": "Structure of a polyp",
      "ref": "5.7/LO2-3",
      "body": "A <b>polyp</b> has <b>tentacles</b> that catch food and move it to the mouth, and <b>stinging cells</b> that paralyse prey and defend it. The <b>mouth</b> takes in food and passes out waste, and the <b>stomach</b> digests it. A <b>calcium carbonate skeleton</b> supports and protects the polyp and builds the reef."
     },
     {
      "h": "Mutualism with zooxanthellae",
      "ref": "5.7/LO4",
      "body": "The polyp and the algae called <b>zooxanthellae</b> live in <b>mutualism</b>, where both benefit. The zooxanthellae get protection, carbon dioxide and nutrients from the polyp. The polyp gets sugars and oxygen from the algae’s photosynthesis."
     },
     {
      "h": "What controls coral distribution",
      "ref": "5.7/LO5",
      "body": "Corals need light for their zooxanthellae, so they grow in shallow, clear water, and larvae need a hard surface to settle on. Sediment blocks light and smothers the coral, and if water gets too warm the polyps expel their zooxanthellae and turn white (bleaching). <b>Parrot fish</b> graze on coral and <b>crown-of-thorns starfish</b> eat the polyps, destroying reefs in outbreaks."
     },
     {
      "h": "Why reef water is clear",
      "ref": "5.7/LO6",
      "body": "Reef water is clear because it is low in nutrients. With few nutrients in the water, there are few phytoplankton to cloud it. The nutrients are instead held inside the organisms and recycled quickly."
     },
     {
      "h": "High species richness",
      "ref": "5.7/LO7",
      "body": "Coral reefs have very high <b>species richness</b>. More coral means more photosynthesis and more energy, supporting more trophic levels. The reef also provides more shelter and breeding sites, so more species can live there."
     },
     {
      "h": "Adaptations of reef organisms",
      "ref": "5.7/LO8",
      "body": "The <b>trigger fish</b> has an adapted dorsal fin that locks it into crevices for safety. The <b>parrot fish</b> has grinding teeth for eating coral. <b>Nudibranchs</b> absorb toxins from their prey to protect themselves."
     },
     {
      "h": "How atolls form",
      "ref": "5.7/LO9",
      "body": "A <b>fringing reef</b> grows around the edge of a volcanic island. As the island subsides and erodes, the reef grows upward and a lagoon opens, making a <b>barrier reef</b>. When the island finally disappears, a ring of reef around a lagoon is left, called an <b>atoll</b>."
     }
    ],
    "terms": [
     [
      "Polyp",
      "a single small coral animal in a colony"
     ],
     [
      "Zooxanthellae",
      "photosynthetic algae living inside coral tissue"
     ],
     [
      "Mutualism",
      "a relationship in which both organisms benefit"
     ],
     [
      "Species richness",
      "the number of different species present"
     ],
     [
      "Atoll",
      "a ring of coral reef surrounding a lagoon"
     ],
     [
      "Fringing reef",
      "a reef growing around the edge of an island"
     ]
    ]
   }
  ]
 },
 "6": {
  "title": "Human Influences",
  "sections": [
   {
    "id": "6.1",
    "title": "Human interactions with marine ecosystems",
    "intro": "Why the sea matters to people, how our activities damage it, and what it means for a species or a way of using the sea to be safe for the future.",
    "tip": "When a question says 'evaluate' or 'discuss', give a benefit AND a drawback, then a judgement — don't argue only one side.",
    "notes": [
     {
      "h": "What the sea gives us",
      "ref": "6.1/LO1",
      "body": "The sea provides many <b>services</b>: recreation and tourism, food, and fisheries that people can catch and sell. It gives wood and building material, and medicines made from marine invertebrates and mangrove plants. Habitats like mangroves, seagrass, reefs and sand banks give <b>coastal protection</b> by reducing wave energy and erosion."
     },
     {
      "h": "Nursery areas",
      "ref": "6.1/LO1",
      "body": "Some habitats act as <b>nursery areas</b> where the young (juveniles) of many species grow up safely. These young fish are important both for food chains and for fisheries. Keeping nurseries healthy keeps adult stocks up."
     },
     {
      "h": "How we damage marine habitats",
      "ref": "6.1/LO2",
      "body": "Recreation causes noise and light pollution, litter and plastics, trampling and souvenir collection. Boats anchor on coral and divers touch it. <b>Dredging</b> (removing sand or mud) and logging mangroves remove habitat and cloud the water."
     },
     {
      "h": "More damaging activities",
      "ref": "6.1/LO2",
      "body": "<b>Land reclamation</b> (making new land from the sea) buries habitat and stirs up sediment. <b>Blast fishing</b> uses explosions that kill all nearby species and turn reef into rubble. <b>Shrimp farms</b> clear mangroves and release waste, and <b>oil spills</b> harm marine life."
     },
     {
      "h": "Endangered species",
      "ref": "6.1/LO3",
      "body": "An <b>endangered</b> species has a population that is falling and may become extinct. This happens when animals are removed faster than breeding can replace them. Fewer breeders left means the population falls even faster."
     },
     {
      "h": "What sustainable means",
      "ref": "6.1/LO4",
      "body": "A resource or activity is <b>sustainable</b> if it can be used at the current rate, without damaging the environment, and without the resource running out. All three things must be true. The sign it is working is that the stock stays stable over time."
     }
    ],
    "terms": [
     [
      "Nursery area",
      "a habitat where juvenile (young) animals grow up in safety"
     ],
     [
      "Coastal protection",
      "reducing wave energy and erosion of the shore"
     ],
     [
      "Dredging",
      "removing sand or mud from the seabed"
     ],
     [
      "Endangered",
      "having a falling population that may become extinct"
     ],
     [
      "Sustainable",
      "usable at the current rate, without harm, and without running out"
     ]
    ]
   },
   {
    "id": "6.2",
    "title": "Tourism",
    "intro": "How tourism brings money and jobs to coastal areas, the harm it can do, and the ways this harm can be reduced.",
    "tip": "For reducing tourist impact, name the method (education / legislation / planning) AND its limitation (cost, relies on cooperation, needs enforcement).",
    "notes": [
     {
      "h": "Why tourism matters to people",
      "ref": "6.2/LO1",
      "body": "Tourism brings <b>employment</b> and <b>income</b> to local communities. This money can pay for better <b>infrastructure</b> such as roads, ports, airports, water, sewage and schools. So tourism helps people, not just wildlife."
     },
     {
      "h": "Ecotourism",
      "ref": "6.2/LO2",
      "body": "<b>Ecotourism</b> is tourism that is ecologically sustainable and focused on experiencing natural areas. It encourages people to understand, appreciate and conserve the environment and local culture. You can spot it by guest education, local staff, renewable energy, conservation funding, and no sensitive habitat being lost."
     },
     {
      "h": "Good and bad sides of tourism",
      "ref": "6.2/LO3",
      "body": "Positives: tourists come to appreciate nature and want to preserve it, which helps set up <b>MPAs</b> and involves conservation groups. Negatives: competition for land or resources, pollution, and damage to sensitive ecosystems. Removing organisms to sell, and interacting with animals, are also problems."
     },
     {
      "h": "Feeding wild animals",
      "ref": "6.2/LO3",
      "body": "Interacting with wild animals can cause <b>behavioural consequences</b>. Fed animals change how they feed, become dependent on people or aggressive, and approach boats. Feeding does not help the population."
     },
     {
      "h": "A named example",
      "ref": "6.2/LO4",
      "body": "In the <b>Galapagos Islands</b>, tourists can carry species in on boats and footwear, trample nests and plants, fish illegally, and create resort waste. This is managed by marked paths, small guided groups, restricted islands and fees. At the <b>Great Barrier Reef</b>, anchors, hulls, divers and resort sediment block light to the coral."
     },
     {
      "h": "Reducing the harm",
      "ref": "6.2/LO5",
      "body": "<b>Education</b> gives visitors guidelines and reasons, but relies on cooperation. <b>Legislation</b> means laws with penalties, but enforcement is costly. <b>Strategic planning</b> means experts design development away from sensitive habitat, though it costs money up front."
     },
     {
      "h": "Green strategies, weighed up",
      "ref": "6.2/LO6",
      "body": "Using <b>renewable energy</b> cuts CO₂ but is costly and weather-dependent. Limiting water use (rainwater, reused grey water) saves water but needs costly systems and guest effort. Banning single-use plastics cuts plastic waste, and limiting motorised transport cuts fuel and pollution, but both can be inconvenient to enforce."
     }
    ],
    "terms": [
     [
      "Infrastructure",
      "built services like roads, ports, water and sewage"
     ],
     [
      "Ecotourism",
      "ecologically sustainable tourism in natural areas that aids conservation"
     ],
     [
      "MPA",
      "Marine Protected Area, a part of the sea protected from harm"
     ],
     [
      "Behavioural consequences",
      "changes in how animals behave after contact with people"
     ],
     [
      "Legislation",
      "laws, with penalties for breaking them"
     ]
    ]
   },
   {
    "id": "6.3",
    "title": "Fisheries",
    "intro": "How we catch fish, the aids that help boats navigate, and how fishing can be kept sustainable so stocks last.",
    "tip": "Overfishing answers need the chain: fewer adults → less breeding → stock collapse. Then name a management method (quotas, net mesh size, no-take zones) and say how it helps.",
    "notes": [
     {
      "h": "Food and income from fish",
      "ref": "6.3/LO1",
      "body": "Fish are a <b>protein</b>-rich food. Catching, processing and selling fish give people jobs, income and exports. This benefits local communities, not only large companies."
     },
     {
      "h": "Net fishing methods",
      "ref": "6.3/LO2",
      "body": "A <b>cast net</b> is small-scale and bycatch can be released. <b>Pelagic trawling</b> takes big catches of shoaling fish. A <b>beam trawl</b> is dragged along the seabed, destroys habitat and catches everything, so it is the most damaging. A <b>purse seine</b> takes very large catches and can trap dolphins and turtles."
     },
     {
      "h": "Nets, traps and lines",
      "ref": "6.3/LO2",
      "body": "<b>Gill, tangle and drift nets</b> entangle non-target species, and if lost become <b>ghost nets</b> that keep catching. <b>Basket traps</b> have low impact unless overused. <b>Trolling</b> and <b>longlining</b> use lines: longlining has thousands of hooks and catches seabirds and turtles, while <b>pole and line</b> takes one fish at a time with low bycatch."
     },
     {
      "h": "Bycatch",
      "ref": "6.3/LO2",
      "body": "<b>Bycatch</b> is the unwanted species caught along with the target fish. Methods that catch a lot of bycatch, like beam trawling and longlining, harm many other animals. Selective methods like pole and line have very little bycatch."
     },
     {
      "h": "Navigational aids",
      "ref": "6.3/LO3",
      "body": "A <b>chart</b> is a sea map showing depths, hazards and channels, and a <b>compass</b> points to magnetic north. <b>GPS</b> gives exact position from satellites in any visibility. <b>Sonar</b> sends sound pulses that reflect off the seabed and shoals, while <b>radar</b> uses radio waves to detect ships and coasts above the water."
     },
     {
      "h": "Why stocks get over-harvested",
      "ref": "6.3/LO4-6",
      "body": "More people means more demand, so fisheries risk being <b>over-harvested</b> and becoming unsustainable. Catching at the replacement rate keeps the stock level and leaves fish for future generations. It also keeps predator and prey numbers in food chains undisturbed."
     },
     {
      "h": "Keeping fishing sustainable",
      "ref": "6.3/LO5",
      "body": "Rules include restricting boat size, net type and <b>mesh size</b> (larger mesh lets juveniles escape to breed), plus <b>quotas</b> and licences that cap the catch. <b>Closed seasons</b> protect breeding, and <b>MPAs</b> let stocks recover and spill over into fished areas. <b>International agreements</b> cover migratory fish and the high seas, but rely on nations cooperating."
     },
     {
      "h": "Fish aggregating devices",
      "ref": "6.3/LO7",
      "body": "A <b>FAD</b> is a floating platform where algae grow and small fish shelter, attracting predators like tuna so boats can fish around it. This makes very large catches easy, causing overfishing. It also attracts and catches turtles, sharks and dolphins, and draws predators outside their normal range."
     }
    ],
    "terms": [
     [
      "Bycatch",
      "unwanted species caught along with the target fish"
     ],
     [
      "Ghost net",
      "a lost net that keeps catching and killing animals"
     ],
     [
      "Mesh size",
      "the size of the holes in a net"
     ],
     [
      "Quota",
      "a legal limit on how much fish may be caught"
     ],
     [
      "FAD",
      "fish aggregating device, a floating platform that gathers fish"
     ]
    ]
   },
   {
    "id": "6.4",
    "title": "Aquaculture",
    "intro": "Farming marine species for food, how it takes pressure off wild stocks yet causes its own problems, and how it can even help endangered habitats.",
    "tip": "Know open vs closed aquaculture: open = cages in the sea (waste, disease and escapes pass both ways); closed = tanks (isolated but costly). Give a benefit and an impact.",
    "notes": [
     {
      "h": "Why aquaculture matters",
      "ref": "6.4/LO1",
      "body": "<b>Aquaculture</b> is the farming of marine species. It gives coastal communities reliable food, jobs, income and exports. It provides a steady supply rather than relying only on wild catches."
     },
     {
      "h": "Helping wild fish, but with impacts",
      "ref": "6.4/LO2",
      "body": "Farmed fish meet part of the demand, so fewer wild fish are caught. But waste food and faeces lower the oxygen in the water, and parasites and disease can reach wild fish. Escaped fish compete or interbreed with wild ones, mangroves are cleared for farms, and wild fish are caught to make feed."
     },
     {
      "h": "What is farmed",
      "ref": "6.4/LO3",
      "body": "Farmed groups include <b>macroalgae</b> (kelp), fish (salmon, grouper), <b>crustaceans</b> (shrimp), <b>molluscs</b> (mussel, oyster) and <b>echinoderms</b> (sea cucumber). Aquaculture now supplies a large and growing share of seafood. Wild catches have levelled off."
     },
     {
      "h": "Open and closed systems",
      "ref": "6.4/LO4",
      "body": "An <b>open system</b> uses cages or nets in natural water, so currents bring oxygen and remove waste, but parasites, waste and escapes pass both ways. A <b>closed system</b> uses tanks not connected to the sea, so it is isolated. Closed tanks must be pumped, filtered, oxygenated and monitored, making them costlier."
     },
     {
      "h": "Methods of farming fish",
      "ref": "6.4/LO5",
      "body": "Farmers source good <b>broodstock</b> and control temperature, salinity, light, pH and oxygen. They <b>size sort</b> and feed regularly to stop cannibalism, and use low stocking density, antibiotics and cleaner species against disease and parasites. The fastest-growing fish are chosen as broodstock so offspring inherit fast growth."
     },
     {
      "h": "Feed choices",
      "ref": "6.4/LO5",
      "body": "Fish-based pellets need wild small fish, which adds fishing pressure. <b>Plant-based</b> pellets relieve that pressure but use land and suit carnivorous fish less well. Different species need different amounts of protein and lipid in their feed."
     },
     {
      "h": "Farming endangered species",
      "ref": "6.4/LO6",
      "body": "Endangered <b>mangrove forests</b> and <b>coral reefs</b> can be farmed: seedlings or fragments are grown in controlled, protected conditions and then planted out (restocking). This is slow, costly and needs skilled labour. It also fails if the original cause of damage, such as pollution or warming, is not fixed."
     }
    ],
    "terms": [
     [
      "Aquaculture",
      "the farming of marine species"
     ],
     [
      "Open system",
      "cages or nets in natural water"
     ],
     [
      "Closed system",
      "sealed tanks not connected to the sea"
     ],
     [
      "Broodstock",
      "the adult animals kept for breeding"
     ],
     [
      "Restocking",
      "raising young then planting or releasing them to rebuild numbers"
     ]
    ]
   },
   {
    "id": "6.5",
    "title": "Energy from the seas",
    "intro": "Oil from beneath the seabed, the pollution it can cause, and how energy from the sea can also be renewable.",
    "tip": "For each energy source give a benefit and a drawback — 'renewable' does not mean 'no impact'.",
    "notes": [
     {
      "h": "Oil under the seabed",
      "ref": "6.5/LO1",
      "body": "Oil lies in rocks beneath the seabed. It is reached by <b>drilling</b> down from platforms. It does not float on the seabed or dissolve in the water."
     },
     {
      "h": "A fossil fuel with many uses",
      "ref": "6.5/LO2",
      "body": "Oil is a <b>fossil fuel</b>, formed from organisms that died millions of years ago, and it is <b>non-renewable</b> so cannot be replaced. Burning (combusting) it releases <b>carbon dioxide</b>. It is also used to make plastics."
     },
     {
      "h": "Spill risk from transport",
      "ref": "6.5/LO3",
      "body": "Oil is moved around the world by tanker and pipeline. Collisions, groundings, platform accidents and pipe leaks can release it. This is why moving and extracting oil creates a spill risk."
     },
     {
      "h": "MARPOL rules",
      "ref": "6.5/LO4",
      "body": "<b>MARPOL</b> is a set of rules to reduce pollution from ships. It requires <b>double hulls</b>, holds washed only at special collection sites, and controls on sewage and garbage. A double hull means the inner hull stays intact if the outer one is punctured, so oil is not released."
     },
     {
      "h": "Impacts of oil spills",
      "ref": "6.5/LO5",
      "body": "Oil coats fur and feathers, so animals lose insulation and waterproofing and may chill or drown. Animals that ingest oil, for example when preening, are poisoned, and the toxins pass up food chains. Surface oil blocks light, so <b>producers</b> photosynthesise less, giving less energy and fewer consumers."
     },
     {
      "h": "Cleaning up a spill",
      "ref": "6.5/LO6",
      "body": "<b>Booms</b> float on the surface to contain the oil first. <b>Skimmers</b> then lift oil off the water. <b>Dispersants</b> break oil into droplets that mix in, protecting the surface and shore, but the droplets are toxic to fish and coral and sink. <b>Burning</b> removes surface oil but makes smoke and CO₂ and needs a thick fresh slick."
     },
     {
      "h": "Fossil fuels weighed up",
      "ref": "6.5/LO7",
      "body": "Fossil fuels give a constant supply unaffected by weather, are energy dense, relatively cheap and stable to transport. But they are non-renewable, release CO₂ and other damaging gases, damage the environment during extraction, and are increasingly difficult to extract. An exporter gains income, but the CO₂ effect is global."
     },
     {
      "h": "Ocean renewables weighed up",
      "ref": "6.5/LO8",
      "body": "<b>Renewable</b> ocean energy is from an infinite source, reduces CO₂, and reduces reliance on fossil fuels. But it has high initial costs and limited locations, and needs underwater cables that damage the seabed. Turbines can be damaged by weather, can catch marine life, cost money to maintain, and may spoil views for tourism."
     }
    ],
    "terms": [
     [
      "Fossil fuel",
      "a fuel from organisms that died millions of years ago"
     ],
     [
      "Non-renewable",
      "cannot be replaced once used up"
     ],
     [
      "MARPOL",
      "international rules to reduce pollution from ships"
     ],
     [
      "Boom",
      "a floating barrier that contains an oil spill"
     ],
     [
      "Dispersant",
      "a chemical that breaks oil into droplets that mix into the water"
     ],
     [
      "Renewable",
      "from a source that will not run out"
     ]
    ]
   },
   {
    "id": "6.6",
    "title": "Plastic pollution",
    "intro": "Why plastic lasts so long in the sea, the harm it does to animals, and how it gathers into giant patches.",
    "tip": "Be specific about plastic harm: entanglement, blocked guts from ingestion, and microplastics passing up the food chain — not just 'it's bad'.",
    "notes": [
     {
      "h": "Plastic does not rot",
      "ref": "6.6/LO1",
      "body": "Plastics persist in the sea for a very long time and do not rot. Sunlight and waves break them into ever-smaller pieces called <b>microplastics</b> and release toxins. Bacteria do not decompose plastic quickly."
     },
     {
      "h": "How plastic harms animals",
      "ref": "6.6/LO2",
      "body": "<b>Microplastics</b> are taken up by plankton and pass along food chains. Large plastics are ingested, for example when a turtle mistakes a bag for a jellyfish, blocking the gut and causing starvation. Lost nets and lines cause <b>entanglement</b> that drowns air-breathing animals."
     },
     {
      "h": "Gyres and garbage patches",
      "ref": "6.6/LO3",
      "body": "A <b>gyre</b> is a large system of circulating surface currents. Floating plastic moves towards the calm centre of a gyre and builds up into a <b>garbage patch</b>. The <b>Great Pacific Garbage Patch</b> is the largest."
     },
     {
      "h": "Cleaning up a patch",
      "ref": "6.6/LO4",
      "body": "One approach removes existing waste, for example boats towing booms into a collection net. But this is slow, costly and remote, weather damages the gear, and microplastics and sunken plastic are missed. The patch simply refills while new plastic keeps entering, so <b>prevention</b> tackles the real cause."
     },
     {
      "h": "Limiting plastic pollution",
      "ref": "6.6/LO5",
      "body": "<b>Legislation</b> can ban, charge or tax single-use plastics, such as a bag charge that cuts how many bags are discarded. <b>Education</b> changes behaviour, and people can <b>reduce, reuse and recycle</b>. A charge covers only one plastic type and needs enforcement, and since the sea is shared, international cooperation helps."
     }
    ],
    "terms": [
     [
      "Microplastics",
      "tiny fragments of broken-down plastic"
     ],
     [
      "Entanglement",
      "animals getting trapped and tangled in plastic"
     ],
     [
      "Gyre",
      "a large system of circulating surface currents"
     ],
     [
      "Garbage patch",
      "a build-up of floating plastic in the centre of a gyre"
     ],
     [
      "Single-use plastic",
      "plastic thrown away after one use"
     ]
    ]
   },
   {
    "id": "6.7",
    "title": "Eutrophication",
    "intro": "How fertilisers and sewage add nutrients to the sea, and why this can end up killing the animals that need oxygen.",
    "tip": "Learn the eutrophication chain in order: extra nutrients → algal bloom → light blocked / algae die → decomposers use up the oxygen → animals suffocate. The marks are for the sequence.",
    "notes": [
     {
      "h": "Fertilisers raise crop yields",
      "ref": "6.7/LO1",
      "body": "<b>Fertilisers</b> are mineral nutrients, mainly nitrates and phosphates, added to crops. They are used to increase crop yield. They are not the same as pesticides."
     },
     {
      "h": "They run off into the sea",
      "ref": "6.7/LO2",
      "body": "Fertilisers are <b>water-soluble</b>, so they dissolve in rain. The solution then runs off the land into rivers and the sea. This carries the nutrients away from the fields."
     },
     {
      "h": "Effect on the sea",
      "ref": "6.7/LO3",
      "body": "Extra nutrients cause an <b>algal bloom</b>, a rapid growth of algae. This later leads to a fall in oxygen and the death of animals. This whole process is called <b>eutrophication</b>."
     },
     {
      "h": "Sewage does the same",
      "ref": "6.7/LO4",
      "body": "Untreated <b>sewage</b> adds nutrients and organic matter to the sea. This makes producers and <b>decomposers</b> multiply. The decomposers use up oxygen as they respire."
     },
     {
      "h": "The eutrophication process",
      "ref": "6.7/LO5",
      "body": "More nutrients cause producer growth and an algal bloom. When the algae die, <b>decomposers</b> break them down and use oxygen in <b>aerobic respiration</b>. Dissolved oxygen falls, so organisms that need oxygen die. The key point is that living algae make oxygen, but the dead bloom is decomposed faster than oxygen is replaced."
     }
    ],
    "terms": [
     [
      "Fertiliser",
      "mineral nutrients added to crops to raise yield"
     ],
     [
      "Water-soluble",
      "able to dissolve in water"
     ],
     [
      "Algal bloom",
      "a rapid growth of algae from extra nutrients"
     ],
     [
      "Decomposer",
      "an organism that breaks down dead matter, using oxygen"
     ],
     [
      "Eutrophication",
      "nutrient enrichment leading to oxygen loss and death of organisms"
     ]
    ]
   },
   {
    "id": "6.8",
    "title": "Understanding climate change",
    "intro": "How adding greenhouse gases warms the planet, changes the sea water, raises sea level, and affects marine life.",
    "tip": "Keep the two effects apart: more CO₂ → warming (greenhouse effect), and CO₂ dissolving → lower pH (ocean acidification). Warming bleaches coral; acidification weakens shells.",
    "notes": [
     {
      "h": "Climate has changed before",
      "ref": "6.8/LO1",
      "body": "Over hundreds of millions of years, regional climates have changed significantly. These changes link to <b>carbon dioxide</b> level and temperature, which move together. So climate was not constant until humans arrived."
     },
     {
      "h": "The enhanced greenhouse effect",
      "ref": "6.8/LO2",
      "body": "<b>Greenhouse gases</b> such as methane and carbon dioxide trap heat radiated from the surface. Extra emissions trap more heat, which is called the <b>enhanced greenhouse effect</b>. This causes <b>climate change</b>."
     },
     {
      "h": "Warmer, more acidic sea",
      "ref": "6.8/LO3",
      "body": "Rising CO₂ makes sea water increase in <b>temperature</b> and decrease in <b>pH</b>. The pH falls because dissolved CO₂ forms a weak acid. So the sea gets warmer and more acidic."
     },
     {
      "h": "The ocean absorbs heat",
      "ref": "6.8/LO4",
      "body": "The ocean takes up much of the extra heat, which buffers the global temperature and keeps it more stable. Warmed water undergoes <b>thermal expansion</b>: the particles move faster and further apart, so the same mass takes up a larger volume. This makes sea level rise."
     },
     {
      "h": "Two causes of sea-level rise",
      "ref": "6.8/LO5",
      "body": "Both thermal expansion and melting ice raise sea level. <b>Thermal expansion</b> enlarges the water already there. Melting <b>land-based ice</b> adds new water to the sea, but melting floating ice does not raise the level."
     },
     {
      "h": "Impacts on marine life",
      "ref": "6.8/LO6",
      "body": "<b>Sea-level rise</b> causes habitat and land loss, and warming causes <b>coral bleaching</b> as corals expel their zooxanthellae. Warm water holds less oxygen, so species change their distribution and migration, or are lost. <b>Extreme weather</b> also threatens habitats such as mangroves."
     }
    ],
    "terms": [
     [
      "Greenhouse gas",
      "a gas such as CO₂ or methane that traps heat"
     ],
     [
      "Enhanced greenhouse effect",
      "extra heat trapped by added greenhouse gases"
     ],
     [
      "Thermal expansion",
      "water taking up more volume when it warms"
     ],
     [
      "Land-based ice",
      "ice on land whose meltwater adds to the sea"
     ],
     [
      "Coral bleaching",
      "coral losing its zooxanthellae when water is too warm"
     ]
    ]
   },
   {
    "id": "6.9",
    "title": "Conservation",
    "intro": "Measuring how many species live in an area, and the projects that protect them.",
    "tip": "Name a real strategy — marine protected areas / no-take zones, legislation, habitat restoration — and say how it works. 'Protect the animals' alone won't score.",
    "notes": [
     {
      "h": "Species richness",
      "ref": "6.9/LO1",
      "body": "<b>Species richness</b> is the number of different species in an area. It counts the different kinds, not the number of individuals or the biomass. More individuals of one species does not raise richness."
     },
     {
      "h": "Ways to conserve richness",
      "ref": "6.9/LO2",
      "body": "<b>Sustainable harvesting</b> of wild macroalgae, plants and animals keeps every species present. <b>Aquaculture</b> of commercial species relieves wild stocks, and of endangered species helps restock. <b>Marine parks and MPAs</b> protect habitat and all the species in it."
     },
     {
      "h": "Why an MPA raises fish species",
      "ref": "6.9/LO2",
      "body": "After an <b>MPA</b> is set up, coral recovers, and more coral means more <b>zooxanthellae</b> and more photosynthesis. This gives more energy, so more trophic levels, more shelter and more niches. The result is more fish species. To compare an MPA with a fished area fairly, keep the same area, depth, time, method and conditions."
     },
     {
      "h": "Conservation projects",
      "ref": "6.9/LO3",
      "body": "<b>Coral farming</b> grows coral for artificial or damaged reefs. Protecting turtle nest sites and rearing turtles for release means more hatchlings survive predators, though it is costly and few reach adulthood. <b>Culling</b> invasive species like lionfish, which have no natural predators and eat native fish, lets native species recover."
     }
    ],
    "terms": [
     [
      "Species richness",
      "the number of different species in an area"
     ],
     [
      "MPA",
      "Marine Protected Area, a part of the sea protected from harm"
     ],
     [
      "Zooxanthellae",
      "algae living in coral that photosynthesise for it"
     ],
     [
      "Niche",
      "the role and place a species occupies in a habitat"
     ],
     [
      "Culling",
      "deliberately removing (killing) individuals of a species"
     ]
    ]
   }
  ]
 }
};
export const notesUnits = [1,2,3,4,5,6];
export const notesByUnit = (u) => (NOTES[u] ? NOTES[u].sections : []);
export const noteSection = (u, sid) => notesByUnit(u).find((s) => s.id === sid) || null;
