// Marine Science IGCSE 0697 — Read section: syllabus notes (Units 1–6).
// Authored from the per-unit Curriculum Knowledge Models, plain English at IGCSE level,
// every note tagged to its syllabus outcome. STATUS: writing-quality pass 20 Nov 2026 (NOTES-quality-audit-2026-11-20.md).
// Shape: NOTES[unit] = { title, sections:[ { id, title, intro, tip?, example?, notes:[{h, ref, body, linked?}], terms:[[term,def],...] } ] }
//   tip     = a short EXAMINER TIP (mark-scheme/technique nugget) for the section — HTML with <b>; render as a callout.
//   example = an optional WORKED EXAMPLE (calculation sections only) — HTML with <b>; render as a callout.
export const NOTES = {
 "1": {
  "title": "The Earth and its oceans",
  "sections": [
   {
    "id": "1.1",
    "title": "Earth in space and structure",
    "intro": "The Earth's place in space, the force that keeps the Earth and Moon in orbit, and the layers inside the Earth.",
    "tip": "Get the layer order right from the centre out: inner core (solid iron), outer core (liquid iron), mantle (solid rock), crust. Some textbooks call the mantle semi-molten; in the exam, write that it is solid rock that can melt to form magma.",
    "notes": [
     {
      "h": "Earth, Moon and the Sun",
      "ref": "1.1/LO1",
      "body": "The Earth is a <b>planet</b> that orbits the Sun. The Moon is the Earth's <b>natural satellite</b>: a body that orbits the Earth. So the Moon goes around the Earth, and the Earth goes around the Sun."
     },
     {
      "h": "What keeps them in orbit",
      "ref": "1.1/LO2",
      "body": "<b>Gravity</b>, the force of attraction between masses, keeps the Earth in orbit around the Sun and the Moon in orbit around the Earth. Gravity also causes the tides (topic 1.4)."
     },
     {
      "h": "Inside the Earth: four layers",
      "ref": "1.1/LO3",
      "body": "From the centre outwards: a solid <b>inner core</b> and a liquid <b>outer core</b>, both made of iron; then the <b>mantle</b>, made of solid rock; then the <b>crust</b>, the thin, solid, rocky outer layer."
     },
     {
      "h": "Magma",
      "ref": "1.1/LO3",
      "body": "The mantle is solid rock, but it can melt to form <b>magma</b>, a thick, sticky (viscous) liquid. Magma that rises through the crust erupts at volcanoes (topic 1.2)."
     },
     {
      "h": "The Earth's magnetic field",
      "ref": "1.1/LO4",
      "body": "The Earth's iron <b>core</b> produces a <b>magnetic field</b> around the whole planet. Some animals use this field to navigate (topic 3.7)."
     }
    ],
    "terms": [
     [
      "Natural satellite",
      "a natural object that orbits a planet, such as the Moon orbiting the Earth"
     ],
     [
      "Gravity",
      "the force of attraction between masses; it keeps planets and moons in orbit"
     ],
     [
      "Inner / outer core",
      "the centre of the Earth: a solid iron inner core surrounded by a liquid iron outer core"
     ],
     [
      "Mantle",
      "the thick layer of solid rock between the crust and the core, which can melt to form magma"
     ],
     [
      "Crust",
      "the thin, solid, rocky outer layer of the Earth"
     ]
    ]
   },
   {
    "id": "1.2",
    "title": "Plate tectonics",
    "intro": "The Earth's crust is broken into moving plates. Earthquakes, volcanoes and tsunamis happen where the plates meet.",
    "tip": "The cause of plate movement you need is convection currents in the mantle. Slab pull and ridge push are not required for 0697, so do not use them in place of convection.",
    "notes": [
     {
      "h": "The crust is made of plates",
      "ref": "1.2/LO1",
      "body": "The Earth's crust is not one solid shell. It is broken into a number of large pieces called <b>tectonic plates</b> that fit together and move very slowly."
     },
     {
      "h": "What moves the plates",
      "ref": "1.2/LO2",
      "body": "The plates rest on the mantle. Although the mantle is solid rock, it flows extremely slowly. Heat from the core sets up <b>convection currents</b> in the mantle: hotter rock rises, cooler rock sinks, and this slow circulation moves the plates."
     },
     {
      "h": "Supercontinents",
      "ref": "1.2/LO3",
      "body": "The continents were once joined together as <b>supercontinents</b>. Over hundreds of millions of years, plate movement split them apart and carried them to their present positions, forming today's continents and oceans. The plates are still moving."
     },
     {
      "h": "Three types of plate boundary",
      "ref": "1.2/LO4",
      "body": "<b>Convergent</b>: plates move towards each other (one may be forced under the other). <b>Divergent</b>: plates move apart. <b>Transform</b>: plates slide past each other sideways."
     },
     {
      "h": "Earthquakes and volcanoes",
      "ref": "1.2/LO5",
      "body": "<b>Earthquakes</b> happen at all three kinds of boundary: the plates become locked together, tension builds up, then they suddenly slip and release a burst of energy. <b>Volcanoes</b> need magma to rise. At a <b>convergent</b> boundary one plate is forced under another (<b>subducted</b>), sinks into the hot mantle and melts, and the magma rises through the plate above and erupts. At a <b>divergent</b> boundary the plates move apart and magma rises to fill the gap, erupting as lava and building a mid-ocean ridge (in places building volcanic islands above the sea). At a <b>transform</b> boundary the plates slide past each other: there are earthquakes but no volcanoes, because no plate sinks and no gap opens.",
      "linked": "Interactive · subduction & earthquake"
     },
     {
      "h": "How a tsunami forms",
      "ref": "1.2/LO6",
      "body": "A sudden movement of the seabed, usually during an underwater earthquake, displaces a huge volume of water, and waves spread out across the ocean. Underwater landslides, volcanic eruptions and, rarely, meteorite impacts can also displace the water. In deep water a <b>tsunami</b> is low and travels very fast. As the water becomes shallower near the coast, friction with the seabed slows the wave down. The back of the wave catches up with the front, so the same water and energy are squeezed into a shorter length and the wave height increases greatly."
     },
     {
      "h": "Effects of a tsunami",
      "ref": "1.2/LO7",
      "body": "On marine ecosystems: coral reefs are broken, mangroves and seagrass are uprooted, and stirred-up sediment smothers organisms. On coastal communities: people are killed; homes, boats and harbours are destroyed; low-lying land is flooded; fresh water and farmland are contaminated with salt; and livelihoods such as fishing and tourism are lost."
     }
    ],
    "terms": [
     [
      "Tectonic plate",
      "one of the large moving pieces of the crust"
     ],
     [
      "Convection current",
      "a circulation in which hotter material rises and cooler material sinks; in the mantle, it moves the plates"
     ],
     [
      "Convergent / divergent / transform",
      "plate boundaries where the plates move towards each other / apart / past each other"
     ],
     [
      "Subducted",
      "forced beneath another plate"
     ],
     [
      "Tsunami",
      "a series of very large waves caused when a sudden movement, usually of the seabed, displaces a large volume of water"
     ]
    ]
   },
   {
    "id": "1.3",
    "title": "Oceans and the sea floor",
    "intro": "The world's oceans, how they connect, how big and deep they are, and the shape of the sea floor.",
    "tip": "Name sea-floor features precisely: continental shelf, continental slope, abyssal plain, mid-ocean ridge, ocean trench and volcanic island.",
    "notes": [
     {
      "h": "The five oceans",
      "ref": "1.3/LO1",
      "body": "The Earth has five oceans: the <b>Arctic, Atlantic, Pacific, Indian and Southern</b>."
     },
     {
      "h": "Finding places on a map",
      "ref": "1.3/LO2",
      "body": "Lines of <b>latitude</b> run east–west, parallel to the equator (0° latitude). Lines of <b>longitude</b> run north–south and meet at the poles; the Prime Meridian is 0° longitude. A position is given as <b>coordinates</b>: its latitude (°N or °S) and its longitude (°E or °W). The tropical zone lies on either side of the equator, between the Tropic of Cancer and the Tropic of Capricorn (about 23.5° N and S). The polar zones lie beyond the Arctic and Antarctic Circles (about 66.5° N and S), and the temperate zones lie between the tropical and polar zones."
     },
     {
      "h": "One World Ocean",
      "ref": "1.3/LO3",
      "body": "The five oceans are all connected, so water can flow between them. Together they encircle the Earth as one continuous <b>World Ocean</b>."
     },
     {
      "h": "Size and depth of the oceans",
      "ref": "1.3/LO4",
      "body": "The oceans cover <b>71% of the Earth's surface</b> and hold <b>97% of the Earth's water</b>. The <b>Pacific</b> is the largest ocean. The deepest point is the <b>Mariana Trench</b>, about <b>11 000 metres</b> deep."
     },
     {
      "h": "Seas",
      "ref": "1.3/LO5",
      "body": "A <b>sea</b> is a smaller area of water than an ocean. It may lie within an ocean, for example the Bering Sea in the Pacific, and it is often partly enclosed by land, for example the Mediterranean."
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
      "the five oceans, connected to form one continuous body of water"
     ],
     [
      "Coordinates",
      "a position given as its latitude (°N or °S) and its longitude (°E or °W)"
     ],
     [
      "Continental shelf / slope",
      "the shallow, gently sloping sea floor next to a continent / the steep slope from the edge of the shelf down to the deep ocean floor"
     ],
     [
      "Abyssal plain",
      "the flat deep-ocean floor"
     ],
     [
      "Mid-ocean ridge / ocean trench",
      "an underwater mountain chain where plates move apart / a deep, narrow dip where one plate is forced under another"
     ]
    ]
   },
   {
    "id": "1.4",
    "title": "Tides and currents",
    "intro": "Why the sea rises and falls, and how ocean water keeps moving around the planet.",
    "tip": "Tidal amplitude = (high water − low water) ÷ 2, so always halve the range. The formula is given in the question, so the marks are for using it correctly: subtract, divide by 2 and give the unit.",
    "example": "High water 4.8 m, low water 1.0 m → range = 3.8 m → amplitude = 3.8 ÷ 2 = <b>1.9 m</b>.",
    "notes": [
     {
      "h": "High and low tides",
      "ref": "1.4/LO1",
      "body": "The gravitational pull of the Moon, and to a lesser extent the Sun, on the ocean water makes the sea rise to a <b>high tide</b> and fall to a <b>low tide</b> about twice a day. The Moon's effect is about twice the Sun's because the Moon is much closer to the Earth.",
      "linked": "Interactive · Tides: drag the Moon"
     },
     {
      "h": "Spring and neap tides",
      "ref": "1.4/LO1",
      "body": "<b>Spring tide</b>: when the Sun and Moon are in line, their pulls combine, so high tide is higher and low tide is lower (a larger tidal amplitude). <b>Neap tide</b>: when the Sun and Moon are at right angles to the Earth, their pulls partly cancel, giving a smaller amplitude. Spring tides are not linked to the season of spring."
     },
     {
      "h": "Measuring tidal amplitude",
      "ref": "1.4/LO2",
      "body": "Measure the water height against a fixed vertical scale, or use a recording tide gauge, at regular times through a full tidal cycle, and note the highest and lowest readings. More frequent readings are less likely to miss the true high or low water. <b>Tidal amplitude</b> = (high water − low water) ÷ 2."
     },
     {
      "h": "Ocean currents",
      "ref": "1.4/LO3–4",
      "body": "A <b>current</b> is a continuous movement of sea water in a particular direction. Currents are caused by prevailing winds, the rotation of the Earth, tides, and differences in water density: cold, salty polar water is dense, so it sinks and flows along the deep ocean floor. A <b>tidal current</b> reverses direction as the tide rises and falls, and is strongest in narrow channels."
     },
     {
      "h": "Gyres",
      "ref": "1.4/LO5–7",
      "body": "A <b>gyre</b> is a large system of circular ocean currents. Prevailing winds and the rotation of the Earth drive surface currents round in these huge circular paths. There are five main gyres: the North Atlantic, South Atlantic, North Pacific, South Pacific and Indian Ocean gyres. Together, currents and gyres circulate water around the whole World Ocean."
     },
     {
      "h": "Rip currents",
      "ref": "1.4/LO8",
      "body": "Breaking waves push water up the beach. The water returns to the sea through a narrow channel, often a gap in a sandbar, as a fast, narrow <b>rip current</b> flowing away from the shore. A rip can carry a swimmer out to sea and tire them, but it does not pull them under. The safe response is to swim parallel to the shore until out of the current, then swim back to land."
     },
     {
      "h": "Measuring a current",
      "ref": "1.4/LO9",
      "body": "For direction, release a float and take a compass bearing of the direction it drifts. For speed, time the float over a measured distance and calculate speed = distance ÷ time. Repeat the measurement and calculate a mean to improve reliability."
     }
    ],
    "terms": [
     [
      "Tidal amplitude",
      "half the difference between high water and low water: (high water − low water) ÷ 2"
     ],
     [
      "Spring / neap tide",
      "the tide with the largest range, when the Sun and Moon are in line / the tide with the smallest range, when they are at right angles"
     ],
     [
      "Current",
      "a continuous movement of sea water in a particular direction"
     ],
     [
      "Gyre",
      "a large system of circular ocean currents; there are five main gyres"
     ],
     [
      "Rip current",
      "a fast, narrow current flowing away from the shore; escape by swimming parallel to the shore"
     ]
    ]
   }
  ]
 },
 "2": {
  "title": "Sea water",
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
      "body": "<b>Melting</b> and <b>evaporation</b> take in energy from the surroundings, and <b>freezing</b> and <b>condensation</b> give energy out to the surroundings. While ice melts or water boils, the energy taken in is used to overcome the forces holding the particles in place, not to raise the temperature. So the temperature stays constant until the change of state is complete, which a heating curve shows as a flat section."
     },
     {
      "h": "Floating ice vs land-based ice",
      "ref": "2.1/LO6",
      "body": "When floating ice melts it does not raise the water level, because the ice already displaces its own mass of water. When <b>land-based ice</b> (glaciers and ice sheets) melts, the water runs into the sea and raises the sea level, causing flooding and habitat loss. Both kinds of melting ice add fresh water, which lowers salinity and density. In the investigation, use the same mass of ice in each container, read the level in a narrow container so that small changes are easier to see, wait until all the ice has melted, and repeat the test."
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
      "the net movement of particles from a region of higher concentration to a region of lower concentration, as a result of their random movement"
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
    "tip": "Salinity is given in parts per thousand (ppt); the open ocean is about 35 ppt (a question will give the figure if you need it). A percentage is also accepted, but take care: 35 ppt = 3.5 %, not 35 %. For the named seas always give the <b>reason</b> (evaporation, run-off), never just 'hot' or 'cold'.",
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
      "body": "<b>Universal indicator</b> changes colour with pH; match the colour to the chart to read the pH. Use the same volume of each water sample, the same small number of drops of indicator, and clean equipment for each sample. Sea water gives a slightly alkaline result, fresh water about neutral, and rain water slightly acidic."
     },
     {
      "h": "Carbon dioxide and pH",
      "ref": "2.2/LO4",
      "body": "Adding <b>carbon dioxide</b> to sea water lowers its pH, making it more acidic, because the gas dissolves to form a weak acid. This is linked to <b>ocean acidification</b>. Rising acidity means the pH goes down, not up."
     },
     {
      "h": "Solutions and solubility",
      "ref": "2.2/LO5",
      "body": "In sea water, water is the <b>solvent</b> and the dissolved salts are the <b>solutes</b>, making it a <b>solution</b>. Salts that are <b>soluble</b>, like sodium chloride and magnesium sulfate, dissolve. <b>Insoluble</b> substances do not dissolve. Calcium carbonate is only very slightly soluble, so marine organisms can build shells and skeletons from it that do not dissolve away. <b>Sodium chloride</b> is the most abundant dissolved salt."
     },
     {
      "h": "Temperature and solubility of solids",
      "ref": "2.2/LO6",
      "body": "For most solid solutes, such as potassium nitrate and sugar, solubility increases with temperature. To test this, add small, weighed amounts of the solute to a fixed volume of water at a set temperature, stirring after each, until no more will dissolve; add up the mass that dissolved, then repeat at a higher temperature. Stirring only speeds up dissolving; it does not change the maximum amount that can dissolve."
     },
     {
      "h": "Salinity and ppt",
      "ref": "2.2/LO7",
      "body": "<b>Salinity</b> is the concentration of dissolved salts in sea water. It is measured in <b>parts per thousand (ppt)</b>, meaning grams of dissolved salt per 1000 g of sea water. A typical open-ocean value (about 35 ppt) is given in questions when it is needed."
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
    "tip": "Watch the direction trap: gases dissolve <b>less</b> as water warms (the opposite of solids). So warm sea water holds less oxygen for organisms.",
    "notes": [
     {
      "h": "Where dissolved gases come from",
      "ref": "2.3/LO1",
      "body": "Oxygen and carbon dioxide from the atmosphere dissolve into sea water at the surface. Oxygen is also added by photosynthesis. Oxygen has a low solubility in water, so dissolved oxygen is scarce and can limit marine life; carbon dioxide is much more soluble."
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
      "body": "To investigate this, heat water samples to a range of temperatures and measure the dissolved oxygen with an oxygen probe or test kit, or observe the gas bubbles released. Keep the volume of water, the water source and the timing the same, and repeat the readings. The small bubbles that appear well below boiling point are mainly gas coming out of solution, not boiling."
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
      "the process in which plants and algae use light energy to make glucose from carbon dioxide and water, releasing oxygen"
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
      "body": "<b>Colder water is denser</b> than warmer water. One way to show it is to warm coloured water in a boiling tube fitted with a narrow glass tube: the level rises as the water expands, but the mass stays the same, so the density falls. Measuring the mass of a fixed volume also works in principle, but the change is only about 1 %, too small to measure well with a measuring cylinder. The result is that density falls as temperature rises."
     },
     {
      "h": "Salinity and density",
      "ref": "2.4/LO3",
      "body": "Saltier water is denser. To test this, make solutions of known salinity, weigh equal volumes of each and compare the masses, keeping the temperature the same. Density increases as salinity increases."
     },
     {
      "h": "Convection currents",
      "ref": "2.4/LO4",
      "body": "When part of a liquid is heated it expands, becomes less dense and rises, while cooler, denser liquid sinks to replace it. This continuous circulation is a <b>convection current</b>. In the ocean, cold, dense water sinking near the poles and warmer water near the equator drive a slow circulation through the deep ocean."
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
    "tip": "Learn the five conditions that change with depth: light, pressure, temperature, salinity and dissolved oxygen. Light does not stop suddenly: it fades with depth and is absent below about 1000 m.",
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
      "body": "A <b>Secchi disc</b> is a white, or black-and-white, disc lowered on a marked line until it just disappears from view: that depth is the <b>Secchi depth</b>. For a more reliable reading, lower it a little further, raise it until it just reappears, and take the mean of the two depths. It measures water clarity, so a greater depth means clearer water and deeper light penetration. For fair results use the same observer, the same time of day and the shaded side, and repeat and average."
     },
     {
      "h": "Pressure",
      "ref": "2.5/LO4",
      "body": "<b>Pressure increases with depth</b> because the weight of the water above increases. The increase is steady as you go down. This is why deep-sea organisms live under very high pressure. If a question needs a figure, it will give one (for example, about 1 atmosphere more for every 10 m); you do not need to learn it."
     },
     {
      "h": "Temperature",
      "ref": "2.5/LO5",
      "body": "There is a warm surface layer heated by the <b>Sun</b>. Temperature <b>falls with depth</b>, dropping quickly through the middle layer. The deep ocean is then cold and very stable."
     },
     {
      "h": "Dissolved oxygen",
      "ref": "2.5/LO6",
      "body": "Dissolved oxygen is high at the surface, because oxygen dissolves from the atmosphere and photosynthesis adds oxygen in the light. It falls with depth, because there is no photosynthesis in the dark, oxygen is used up by respiration and decomposition, and only slow circulation from the surface replaces it. So dissolved oxygen is generally lower below the sunlit zone."
     }
    ],
    "terms": [
     [
      "Light penetration",
      "how far sunlight reaches down into the water"
     ],
     [
      "Pressure",
      "the force pressing on an area; in the sea it is caused by the weight of the water above"
     ],
     [
      "Secchi disc",
      "a white, or black-and-white, disc used to measure how clear the water is"
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
  "title": "Marine organisms",
  "sections": [
   {
    "id": "3.1",
    "title": "Cell structure and function",
    "intro": "What the parts of plant, animal and bacterial cells look like, and the job each part does.",
    "tip": "Plant cells have a wall <b>in addition to</b> a membrane, not instead of it. Magnification = image size ÷ actual size: convert both to the same units first.",
    "example": "An image is 30 mm across; the real cell is 0.5 mm → magnification = 30 ÷ 0.5 = <b>×60</b> (convert to the same units first).",
    "notes": [
     {
      "h": "Animal and plant cells",
      "ref": "3.1/LO1",
      "body": "Animal cells have a cell membrane, a nucleus, cytoplasm and mitochondria. Plant cells have all of these as well as a <b>cell wall</b> outside the membrane and one large permanent <b>vacuole</b>; leaf cells also have <b>chloroplasts</b>."
     },
     {
      "h": "Bacterial cells",
      "ref": "3.1/LO2",
      "body": "A bacterial cell has a cell wall, a cell membrane and cytoplasm, but no nucleus, no mitochondria and no chloroplasts. Its genetic material (DNA) lies free in the cytoplasm."
     },
     {
      "h": "Spotting the parts in a picture",
      "ref": "3.1/LO3",
      "body": "The <b>cell wall</b> is the thick outer boundary; the <b>membrane</b> is a thin line (it is the outer edge of an animal cell). The <b>nucleus</b> is the large round body and the <b>vacuole</b> is the big central space. <b>Chloroplasts</b> are small green ovals and the <b>cytoplasm</b> is the filled background."
     },
     {
      "h": "What each part does",
      "ref": "3.1/LO4",
      "body": "The <b>nucleus</b> contains the genetic material and controls the cell. The <b>cell membrane</b> controls what enters and leaves the cell, and the <b>cytoplasm</b> is where most chemical reactions take place. The <b>cell wall</b> supports the cell and stops it bursting, <b>chloroplasts</b> absorb light for photosynthesis, <b>mitochondria</b> are where aerobic respiration releases energy, and the <b>vacuole</b> stores water and dissolved substances."
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
    "tip": "External fertilisation releases eggs and sperm into the water, so huge numbers of sex cells are needed because many are lost. Always link the fact to the reason.",
    "notes": [
     {
      "h": "Asexual reproduction",
      "ref": "3.2/LO1",
      "body": "In <b>asexual reproduction</b> a single parent produces offspring without sex cells. The offspring are genetically identical to the parent."
     },
     {
      "h": "Sexual reproduction",
      "ref": "3.2/LO2",
      "body": "In <b>sexual reproduction</b> a male sex cell and a female sex cell fuse (fertilisation). The offspring inherit characteristics from both parents."
     }
    ],
    "terms": [
     [
      "Asexual reproduction",
      "reproduction by a single parent, without sex cells, producing genetically identical offspring"
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
    "tip": "The binomial name has two parts, genus then species (for example, <i>Orcinus orca</i>). Classification runs domain → kingdom → … → species.",
    "notes": [
     {
      "h": "Grouping by shared features",
      "ref": "3.3/LO1",
      "body": "Marine organisms are put into groups by the <b>features they share</b>. They are not grouped by their habitat, size, diet or usefulness."
     },
     {
      "h": "The binomial name",
      "ref": "3.3/LO2",
      "body": "The <b>binomial system</b> gives each organism a two-part scientific name, for example <b><i>Orcinus orca</i></b>. The first part is the <b>genus</b> and the second part is the <b>species</b>. It is agreed internationally, so the same name is used everywhere whatever the local language."
     },
     {
      "h": "The three domains",
      "ref": "3.3/LO3",
      "body": "All living things are split into three <b>domains</b>: <b>Bacteria</b>, <b>Archaea</b> and <b>Eukarya</b>. Plants, animals and protoctists are kingdoms found inside Eukarya."
     },
     {
      "h": "Kingdoms of Eukarya in the sea",
      "ref": "3.3/LO4",
      "body": "<b>Animals</b> are multicellular, have no cell walls or chloroplasts, and feed on other organisms. <b>Plants</b> are multicellular, have cell walls and chloroplasts, and have true roots, leaves and flowers; seagrass is an example. <b>Protoctists</b> include kelp, dinoflagellates and diatoms; many are single-celled and some, such as kelp, are multicellular."
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
    "tip": "Sort invertebrates by a defining feature (body segments, jointed legs, radial symmetry), not by 'has a hard bit'. A crab is a crustacean because of jointed legs and an exoskeleton.",
    "notes": [
     {
      "h": "Sorting vertebrates into groups",
      "ref": "3.4/LO1",
      "body": "Vertebrates are grouped by three features: their <b>skin covering</b>, their <b>reproductive method</b> (internal or external fertilisation), and whether they have <b>gills or lungs</b>. Mammals have hair, internal fertilisation and lungs; birds have feathers, internal fertilisation and lungs; reptiles have scales, internal fertilisation and lungs; fish have scales, gills and (in most fish) external fertilisation. Reptiles and fish both have scales, so fertilisation and gas exchange tell them apart."
     },
     {
      "h": "Examples of each vertebrate group",
      "ref": "3.4/LO2",
      "body": "<b>Mammals</b> include cetaceans, pinnipeds and sirenians. <b>Birds</b> include pelagic birds and shorebirds. <b>Reptiles</b> include sea snakes and turtles, and <b>fish</b> are either cartilaginous or bony."
     },
     {
      "h": "The outside features of a fish",
      "ref": "3.4/LO3",
      "body": "The <b>operculum</b> is the gill cover, and <b>scales</b> protect the body. The <b>lateral line</b> detects vibrations in the water and the <b>nares</b> detect chemicals. The dorsal, pelvic, pectoral and anal fins control pitching, rolling and yawing and allow the fish to change direction, and the caudal (tail) fin provides forward thrust."
     },
     {
      "h": "Sorting invertebrates into groups",
      "ref": "3.4/LO4",
      "body": "<b>Crustaceans</b> have bilateral symmetry, an exoskeleton, compound eyes, two pairs of antennae and abdominal segments with jointed legs. <b>Cnidaria</b> have radial symmetry and tentacles with stinging cells; <b>echinoderms</b> have pentaradial symmetry, spiny skin and tube feet. <b>Molluscs</b> have bilateral symmetry, an unsegmented body and a shell, while <b>annelids</b> have bilateral symmetry, a segmented soft body and setae. Examples: crabs, shrimps and <b>barnacles</b> are crustaceans; jellyfish, sea anemones and corals are cnidaria; starfish, sea urchins and <b>sea cucumbers</b> are echinoderms; mussels, snails and <b>squid</b> (internal shell) are molluscs; ragworms and lugworms are annelids."
     },
     {
      "h": "Comparing specimens (practical)",
      "ref": "3.4/LO5",
      "body": "Choose the viewing method to suit the specimen. A hand lens or a photograph shows the external features of a whole organism. A light microscope is used for small specimens, such as plankton, and for thin sections on a slide to show the structures inside cells. Compare specimens by their classification features, not by colour, size or where they were found."
     },
     {
      "h": "Drawing specimens (practical)",
      "ref": "3.4/LO6",
      "body": "A good biological drawing is large and uses clear, single, unbroken pencil lines, with no shading and no colour. Show the parts in their correct proportions and positions, and draw only what you can actually see on the specimen. Label lines are ruled and touch the feature they label."
     },
     {
      "h": "Working out magnification",
      "ref": "3.4/LO7",
      "body": "<b>Magnification = image size ÷ actual size</b>. To find actual size, do image size ÷ magnification. Change both measurements into the same units first (1 cm = 10 mm and 1 mm = 1000 µm, the unit used for cells and plankton), then round as the question asks."
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
    "tip": "Kelp and other seaweeds are protoctists, not plants. Do not call algae 'plants' in an answer.",
    "notes": [
     {
      "h": "Seagrass, a true plant",
      "ref": "3.5/LO1",
      "body": "<b>Seagrass</b> is a true plant, with roots, leaves and flowers. Its leaves carry out photosynthesis, and its roots anchor it in the sediment and absorb minerals. Its <b>rhizomes</b> are underground stems that connect the plants and are used for asexual reproduction; its flowers are used for sexual reproduction."
     },
     {
      "h": "Kelp, a protoctist",
      "ref": "3.5/LO2",
      "body": "<b>Kelp</b> is a large seaweed in the protoctist kingdom. Its flat <b>blades</b> give a big surface for photosynthesis, its <b>gas bladders</b> float the blades up toward the light, and its <b>chloroplasts</b> absorb light. The <b>stipe</b> acts as a stem linking the blades to the <b>holdfast</b>, which anchors the kelp to the substrate."
     },
     {
      "h": "Dinoflagellates",
      "ref": "3.5/LO3",
      "body": "<b>Dinoflagellates</b> are microscopic, single-celled protoctists. They have chloroplasts for photosynthesis and two <b>flagella</b> for movement. Like plant cells they photosynthesise, but unlike plant cells they can move using their flagella, and each one is a whole organism."
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
    "tip": "Planktonic larvae aid dispersal and reduce competition with the adults: state the benefit, not just the stage name.",
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
      "body": "<b>Migration</b> is the movement of organisms from one place to another, and often back again. Animals migrate to find food, to find mates, to reach a different habitat to reproduce, and to avoid predators. It is different from just moving around a home area or from drifting with the water. For example, whales travel to cold waters where food is plentiful in summer (finding food), and plankton sink to dark water by day (avoiding predators)."
     },
     {
      "h": "Migration in three dimensions",
      "ref": "3.7/LO2",
      "body": "The ocean is three-dimensional, so migration can be <b>horizontal</b> or <b>vertical</b>. It can cover short or very long distances. A daily up-and-down trip is short, while crossing an ocean is very long."
     },
     {
      "h": "Daily vertical migration",
      "ref": "3.7/LO3",
      "body": "Plankton, fish, squid and shrimp rise from the twilight zone to the sunlight zone at dusk. They feed near the surface at night, where the food is, hidden by the darkness. At dawn they sink back down and stay in the dim twilight zone during the day to avoid predators that hunt by sight. Lanternfish are a well-known example."
     },
     {
      "h": "Very long horizontal migration",
      "ref": "3.7/LO4",
      "body": "Tuna, turtles and whales make very long horizontal journeys. At one end they find seasonal food, such as cold polar waters in summer. At the other end they reach a suitable place to breed or give birth, such as warm calm water, nesting beaches or spawning grounds. For example, whales feed in polar waters in summer and breed in warm water in winter, and female turtles return to nesting beaches to lay their eggs."
     },
     {
      "h": "How animals navigate",
      "ref": "3.7/LO5",
      "body": "Animals navigate using the Earth's <b>magnetic field</b> and the positions of the Sun, Moon and stars. They also use <b>olfaction</b>, the detection of chemicals such as the scent of their home river, and they remember landmarks to build a mental map."
     }
    ],
    "terms": [
     [
      "Migration",
      "the movement of organisms from one place to another, often returning later"
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
  "title": "Nutrients and energy",
  "sections": [
   {
    "id": "4.1",
    "title": "Nutrients",
    "intro": "What nutrients are, how you test for them, what each type does, the key elements organisms need, and how nutrients are recycled in the sea.",
    "tip": "The food-test colours are easily confused: iodine turns blue-black (starch), heated Benedict's solution turns brick-red (reducing sugar), biuret solution turns purple (protein), and the ethanol emulsion test gives a cloudy white emulsion (lipid). State both the starting colour and the result colour.",
    "notes": [
     {
      "h": "What a nutrient is",
      "ref": "4.1/LO1",
      "body": "A <b>nutrient</b> is a substance an organism needs for growth, for repair, and to provide chemical energy. There are three kinds: <b>gases</b> such as carbon dioxide (used by producers), <b>dissolved salts</b> such as nitrates, and <b>organic compounds</b>. Nutrients are not just food: carbon dioxide and dissolved salts count too."
     },
     {
      "h": "The organic compounds",
      "ref": "4.1/LO1",
      "body": "There are three groups of organic compounds: <b>carbohydrates</b>, including starch and sugars such as glucose; <b>lipids</b>, which are fats and oils; and <b>proteins</b>. Sugars and starch are both carbohydrates, not separate nutrient groups."
     },
     {
      "h": "Testing foods for nutrients",
      "ref": "4.1/LO2",
      "body": "Add <b>iodine solution</b> to test for <b>starch</b>: orange-brown turns blue-black. Heat with <b>Benedict’s solution</b> in a water bath to test for <b>reducing sugars</b>: blue turns green, yellow, orange or brick-red. Add <b>biuret solution</b> for <b>proteins</b>: blue turns lilac or purple. Take care: iodine gives blue-black and biuret gives purple, so do not swap them."
     },
     {
      "h": "Testing for lipids",
      "ref": "4.1/LO2",
      "body": "For the <b>ethanol emulsion test</b>, shake the sample with ethanol, then pour the liquid into water: a cloudy white <b>emulsion</b> shows that lipid is present. If the mixture stays clear, the result is negative, not a failed test. Ethanol is flammable, so keep it away from naked flames, and wear eye protection because the reagents are irritants."
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
      "body": "<b>Nitrogen</b> is needed to make proteins and <b>carbon</b> to make organic compounds. <b>Magnesium</b> is needed to make chlorophyll, so a shortage means less photosynthesis. <b>Calcium</b> builds bones, shells and coral skeletons, and <b>iron</b> is needed for haemoglobin, which carries oxygen in vertebrates and some invertebrates, such as lugworms in their oxygen-poor burrows."
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
    "tip": "All living cells respire all the time, including plant and algal cells at night, which is why dissolved oxygen falls and carbon dioxide rises after dark. Respiration releases energy; it does not make it.",
    "notes": [
     {
      "h": "What respiration is",
      "ref": "4.2/LO1",
      "body": "<b>Respiration</b> is the set of chemical reactions in cells that break down nutrient molecules, mainly glucose, to release usable energy. It is not the same as breathing. Respiration does not make energy: it releases energy that is already stored in the nutrient."
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
      "body": "<b>Respiration</b> is the chemical reactions inside every cell that release energy. <b>Gas exchange</b> is the movement of oxygen and carbon dioxide into and out of an organism across a surface such as gills, lungs or the body surface. Gas exchange supplies the oxygen that respiration needs. Good gas-exchange surfaces have a large surface area, thin walls and a good blood supply. Producers such as seagrass respire all the time, but in bright light photosynthesis is faster, so overall they take in carbon dioxide and give out oxygen; in the dark they take in oxygen and give out carbon dioxide."
     },
     {
      "h": "Why low oxygen matters",
      "ref": "4.2/LO4",
      "body": "If oxygen is very low, gas exchange cannot bring in enough oxygen. Without enough oxygen, cells cannot carry out aerobic respiration. This means they cannot release the energy the organism needs."
     },
     {
      "h": "Measuring energy in food",
      "ref": "4.2/LO5",
      "body": "To find the energy in food, weigh a food sample and burn it under a boiling tube holding a measured volume of water. Record the start temperature and the highest temperature: the <b>temperature rise</b> shows how much energy was released. Keep the water volume, the mass of food (as near as possible), the distance and the starting temperature the same so the test is fair; because samples are rarely exactly the same mass, also compare energy per gram. You may be given: energy per gram (J/g) = mass of water (g) × temperature rise (°C) × 4.2 ÷ mass of food (g). If you are told that lipids release more energy per gram, you can predict that lipid-rich foods such as nuts heat the water most."
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
      "movement of oxygen and carbon dioxide into and out of an organism across a surface"
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
      "body": "In <b>photosynthesis</b>, producers use energy from light to make glucose from carbon dioxide and water. Oxygen is released as a by-product, so in daylight the dissolved oxygen in water containing producers rises."
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
      "body": "Three groups of marine organisms photosynthesise: marine <b>plants</b>, such as seagrasses; some marine <b>protoctists</b>, such as microalgae, macroalgae, diatoms and some dinoflagellates; and some marine <b>bacteria</b>, such as cyanobacteria. Not all plankton and not all bacteria photosynthesise."
     },
     {
      "h": "Word equation for photosynthesis",
      "ref": "4.3/LO5",
      "body": "The word equation for <b>photosynthesis</b> is: carbon dioxide + water → glucose + oxygen. This is the reverse of the respiration equation. Carbon dioxide and water are the reactants, and glucose and oxygen are the products."
     },
     {
      "h": "Light intensity and photosynthesis",
      "ref": "4.3/LO6",
      "body": "To investigate how light intensity affects photosynthesis, place an aquatic plant cut end up in a tube of water and set a lamp at a measured distance; changing the distance changes the light intensity. Wait a few minutes for the plant to adjust, then count the bubbles of gas given off in a set time. Stand the tube in a water bath so the lamp does not change the temperature, and repeat to calculate a mean. Over the distances used, fewer bubbles are produced as the lamp is moved further away."
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
    "tip": "Food-chain arrows point in the direction energy flows, from the organism eaten to the organism that eats it. Only a small fraction of the energy passes to the next level, so give reasons for the loss: respiration, movement, excretion, and parts that are not eaten.",
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
      "body": "<b>Biomass</b> is the mass of living material. Energy is lost at each transfer between trophic levels, for example in respiration (as heat), in movement and in excretion, and some material is not eaten or passes out as faeces; harvesting by people also removes biomass. Because so much energy is lost at each step, only a fraction reaches the next level, so food chains are short."
     },
     {
      "h": "Ecological pyramids",
      "ref": "4.4/LO13",
      "body": "In a pyramid, producers form the bottom bar, and the width of each bar shows the quantity at that level. A <b>pyramid of numbers</b> can be any shape, and a <b>pyramid of biomass</b> can sometimes be inverted. A <b>pyramid of energy</b> is always upright because energy is lost at each level. To find the percentage of energy or biomass passed on, divide the value at the higher trophic level by the value at the level below it (the smaller number by the larger), then multiply by 100."
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
  "title": "Marine ecology",
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
      "body": "Four factors affect how fast a population grows. A larger food supply allows faster growth; <b>disease</b> causes deaths and slows growth; <b>competition</b> for food or space slows growth; and <b>predation</b> kills individuals and slows growth. In an exam answer, apply each factor to the named organism in the question. Disease spreads faster, and kills a larger proportion, in a dense population."
     },
     {
      "h": "Types of marine ecosystem",
      "ref": "5.1/LO3",
      "body": "The <b>open ocean</b> is one type. <b>Coastal ecosystems</b> sit on the continental shelf or slope and are affected by tides: wetlands, coral reefs, sandy shores, muddy shores, rocky shores, kelp forests, seagrass beds and mangrove forests."
     },
     {
      "h": "Why coastal ecosystems are most affected by people",
      "ref": "5.1/LO4",
      "body": "Coastal ecosystems are close to where people live and work. They are the first to receive run-off, sewage and waste, and they are used directly for fishing, building, ports and tourism. Because they are shallow and hold a small volume of water, they cannot dilute pollution as well as the open ocean."
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
      "body": "A <b>quadrat</b> is a square frame used to sample the organisms inside it. Lay two tapes at right angles to make a grid, and use random numbers to choose the coordinates of each quadrat, so that the sampler's choice cannot bias where the quadrats go. Count the individuals (or estimate the percentage cover) in each quadrat, sample many quadrats and calculate the mean, then scale up to estimate the population of the whole area. Recording the number of different species present gives the <b>species richness</b>."
     },
     {
      "h": "More quadrats, more reliable",
      "ref": "5.2/LO1",
      "body": "Random placement removes the sampler's bias in choosing where to sample. Taking many quadrats gives a more reliable estimate than a single quadrat. Count organisms touching two sides of the frame (for example the top and left) but not the other two. To decide how many quadrats are enough, keep a running mean: once it barely changes as more quadrats are added, the sample is large enough."
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
      "h": "Measuring particle size",
      "ref": "5.2/LO4",
      "body": "Dry the sediment first so that the particles do not clump together. Pour a known mass of dry sediment into a stack of sieves with the mesh size decreasing down the stack, and shake it. Weigh the sediment caught on each sieve and in the pan below the finest sieve, and measure any very large particles with a ruler or callipers. Work out each mass as a percentage of the starting mass to show the particle-size distribution, and compare sites."
     },
     {
      "h": "Measuring moisture content",
      "ref": "5.2/LO5",
      "body": "Weigh a sediment sample, heat it gently in an oven, and reweigh it until the mass stops changing. Water lost = starting mass − final mass, and percentage water = water lost ÷ starting mass × 100. Take samples of the same mass from the same depth, at the same state of the tide and time of day, at randomly chosen positions, and repeat. Heat gently so that organic matter is not burned off, and wear eye protection."
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
    "tip": "Learn the zone depths: sunlight zone 0–200 m, twilight zone 200–1000 m, midnight zone below 1000 m. Use these names; 'photic' and 'aphotic' are not the terms required.",
    "notes": [
     {
      "h": "Pelagic and benthic zones",
      "ref": "5.3/LO1-2",
      "body": "The <b>pelagic zone</b> is the open water, from the surface down to just above the seabed. The <b>benthic zone</b> is the seabed and the organisms living on or in it, at any depth."
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
      "body": "The <b>twilight zone</b> has low light, some dissolved oxygen, a stable temperature and higher pressure. The <b>midnight zone</b> has no sunlight, little dissolved oxygen, a stable low temperature and very high pressure. Oxygen is low in the deep ocean because there is no photosynthesis, respiration by organisms and decomposers uses oxygen up, and only slow circulation from the surface replaces it."
     },
     {
      "h": "Adaptations near the surface",
      "ref": "5.3/LO10",
      "body": "Animals of the sunlight and twilight zones are often <b>migratory</b>, moving to feeding or breeding grounds. They eat a wide range of food, and many are fast swimmers, because the open water offers nowhere to hide from predators. <b>Countershading</b>, a dark back and a pale belly, camouflages an animal against the dark depths when seen from above and against the bright surface when seen from below."
     },
     {
      "h": "Deep-sea adaptations",
      "ref": "5.3/LO12",
      "body": "Deep-sea animals use <b>bioluminescence</b> (light made by the organism) to attract mates or prey and to see or startle predators. Many are slow-moving and have long lifespans because of the low oxygen and low temperature; moving slowly also saves energy, which helps them survive where food is scarce. They are dark brown or black, so they are hard to see, and gelatinous bodies help them withstand the pressure. Large, backward-facing teeth stop captured prey escaping."
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
      "body": "Exposure to air causes drying, so <b><i>Fucus</i></b> (a macroalga) and <b>sea anemones</b> are limited higher up the shore, with anemones restricted to pools or under algae. Predation limits organisms such as mussels lower down. Wave action favours firmly attached organisms, and grazers follow their food. At low tide, high-shore rock pools are cut off: their small volume warms and cools quickly, so temperature swings widely, and at night, with no light for photosynthesis, oxygen can fall as everything in the pool keeps respiring."
     },
     {
      "h": "Adaptations to a rocky shore",
      "ref": "5.4/LO4",
      "body": "<b>Limpets</b> and <b>mussels</b> close their hard shells to reduce water loss and resist predators. Sea anemones retract their tentacles and live in rock pools or under macroalgae to stay moist. <b><i>Fucus</i></b> has thick leathery fronds to resist drying and a <b>holdfast</b> to grip against currents and waves."
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
    "tip": "On sandy and muddy shores most organisms burrow to escape drying out and predators. Muddy shores hold less oxygen than sandy shores because the fine mud stays waterlogged.",
    "notes": [
     {
      "h": "Zones of sandy and muddy shores",
      "ref": "5.5/LO1",
      "body": "Sandy and muddy shores have the same three zones as a rocky shore. These are the <b>supratidal</b>, <b>intertidal</b> and <b>subtidal</b> zones, set by the tide marks."
     },
     {
      "h": "Comparing sand and mud",
      "ref": "5.5/LO2",
      "body": "<b>Sand</b> has larger particles, is found where water has more energy, is loose and unstable, has a steeper gradient, and holds more oxygen in the spaces between the particles. <b>Mud</b> has very small particles and is found in sheltered, calm water where deposition is greater than erosion; it sticks together when wet, so it is stable, is almost flat, and is waterlogged with little oxygen."
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
    "tip": "Match each mangrove feature to the problem it solves: leaves that secrete salt (salty water), pneumatophores (low-oxygen mud), and prop roots (support in soft mud against the tide).",
    "notes": [
     {
      "h": "Structure of a mangrove forest",
      "ref": "5.6/LO1",
      "body": "A <b>mangrove forest</b> grows in the intertidal zone, often bordering a land forest behind it. It is often <b>estuarine</b>, meaning it sits where a river meets the sea."
     },
     {
      "h": "Estuary changes with the tide",
      "ref": "5.6/LO2",
      "body": "<b>Salinity</b> rises towards high tide as sea water flows in, and falls towards low tide when river water dominates. <b>Temperature</b> is steadier at high tide under a large volume of sea water and more variable at low tide. <b>Dissolved oxygen</b> also varies over the tidal cycle as sea water and river water mix in different amounts."
     },
     {
      "h": "Mangrove tree adaptations",
      "ref": "5.6/LO3",
      "body": "Waterlogged mud holds little oxygen, so mangroves have aerial roots called <b>pneumatophores</b> that grow up into the air and take in oxygen for respiration. <b>Prop roots</b> support the tree in soft mud against the tidal flow. The leaves can secrete excess salt."
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
    "tip": "Coral and zooxanthellae are <b>mutualistic</b>: both benefit. Bleaching is the loss of the algae when the coral is stressed, mainly by water that is too warm; say what each partner gives.",
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
      "body": "Corals need light for their zooxanthellae to photosynthesise, so they grow in shallow, clear water; their larvae need a hard surface to settle on; so reefs are found in warm, shallow, clear tropical water. Sediment blocks light and smothers coral, and if the water becomes too warm the polyps expel their zooxanthellae and turn white (<b>bleaching</b>). Parrot fish graze on coral, and crown-of-thorns starfish eat the polyps and can destroy large areas of reef when their numbers rise sharply (outbreaks)."
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
  "title": "Human influences on the marine environment",
  "sections": [
   {
    "id": "6.1",
    "title": "Human interactions with marine ecosystems",
    "intro": "Why marine ecosystems are important to people, how human activities damage them, and what makes the use of a resource sustainable.",
    "tip": "When you explain how an activity damages an ecosystem, link three steps: the activity, the change it causes and the effect on organisms. For example: dredging stirs up sediment, which reduces light, so seagrass photosynthesises less.",
    "notes": [
     {
      "h": "Why marine ecosystems matter",
      "ref": "6.1/LO1",
      "body": "Marine ecosystems provide people with <b>food</b> and support <b>fisheries</b>, which provide jobs and income. They are used for <b>recreation and tourism</b>. <b>Mangrove forests</b> supply wood for building and fuel, and some <b>medicines</b> are made from marine invertebrates and from mangrove plants. Mangroves, seagrass meadows, coral reefs and sand banks provide <b>coastal protection</b>: they absorb wave energy and so reduce erosion of the shore."
     },
     {
      "h": "Nursery areas",
      "ref": "6.1/LO1",
      "body": "Mangroves, seagrass meadows and coral reefs are <b>nursery areas</b>, where the juveniles of many species feed and shelter from predators until they become adults. Protecting nursery areas maintains the adult populations of commercially and ecologically important species, so fisheries and food chains both depend on them."
     },
     {
      "h": "Damage from recreation and tourism",
      "ref": "6.1/LO2",
      "body": "Visitors cause noise and light pollution, leave litter and plastics, trample shore habitats and collect souvenirs such as shells and coral. Tourist boats break coral when they drop anchor on a reef, and divers damage coral when they touch or knock against it."
     },
     {
      "h": "Damage from development and industry",
      "ref": "6.1/LO2",
      "body": "<b>Dredging</b> (removing sand or mud from the seabed) and logging mangroves destroy habitats and stir up sediment, which reduces the light reaching seagrass and corals for photosynthesis. <b>Land reclamation</b> (creating new land from the sea) buries habitats. <b>Blast fishing</b> uses explosives that kill most organisms nearby, including species that are not being targeted, and reduces coral reef to rubble. <b>Shrimp farms</b> are built by clearing mangrove forests, and they release waste into the water. <b>Oil spills</b> coat marine organisms and are toxic to them."
     },
     {
      "h": "Building infrastructure",
      "ref": "6.1/LO2",
      "body": "Developing a coast for resorts, ports or the fishing industry requires <b>infrastructure</b>: roads, airports, harbours, water and power supplies, sewage systems and housing. Construction destroys coastal habitats and causes air pollution. A larger population produces more sewage and waste and needs more fresh water and food. Fresh water may come from <b>desalination</b> plants, which return very salty water (brine) to the sea, and the demand for food increases farming and fishing pressure. Resorts can compete with local people and farmers for water."
     },
     {
      "h": "Endangered species",
      "ref": "6.1/LO3",
      "body": "An <b>endangered</b> species is one whose population is falling and which is at risk of extinction. A population falls when individuals die or are removed faster than reproduction replaces them, for example through overfishing, habitat loss or pollution. As numbers fall, fewer adults are left to breed, so the population can fall faster still."
     },
     {
      "h": "Sustainable use",
      "ref": "6.1/LO4",
      "body": "A resource or activity is <b>sustainable</b> if it can continue at its current rate without damaging the environment and without the resource running out. All three conditions must be met. For a fish stock, one sign of sustainable use is a population that stays stable over time."
     }
    ],
    "terms": [
     [
      "Nursery area",
      "a habitat where juveniles feed and shelter until they become adults"
     ],
     [
      "Coastal protection",
      "the reduction of wave energy and erosion along a shore"
     ],
     [
      "Dredging",
      "removing sand or mud from the seabed"
     ],
     [
      "Endangered",
      "having a falling population and at risk of extinction"
     ],
     [
      "Sustainable",
      "able to continue at the current rate without damaging the environment or using up the resource"
     ],
     [
      "Infrastructure",
      "the basic facilities an area needs, such as roads, harbours, water supply and sewage systems"
     ]
    ]
   },
   {
    "id": "6.2",
    "title": "Tourism",
    "intro": "How tourism brings money and jobs to coastal areas, the harm it can do, and the ways this harm can be reduced.",
    "tip": "For reducing the impact of tourists, name the method (education, legislation or strategic planning) and its limitation (cost, reliance on cooperation, or the need for enforcement).",
    "notes": [
     {
      "h": "Why tourism matters to people",
      "ref": "6.2/LO1",
      "body": "Tourism brings <b>employment</b> and <b>income</b> to local communities. This money can pay for better <b>infrastructure</b>, such as roads, ports, airports, water supplies, sewage systems and schools."
     },
     {
      "h": "Ecotourism",
      "ref": "6.2/LO2",
      "body": "<b>Ecotourism</b> is ecologically sustainable tourism focused on experiencing natural areas. It encourages visitors to understand, appreciate and conserve the environment and the local culture. Features of ecotourism include educating guests, employing local staff, using renewable energy, funding conservation, and not destroying sensitive habitats."
     },
     {
      "h": "Positive and negative impacts of tourism",
      "ref": "6.2/LO3",
      "body": "Positive impacts: visitors come to appreciate marine life and want to preserve it, which supports the setting up of marine protected areas (MPAs) and the involvement of conservation organisations. Negative impacts: competition for land and resources, pollution, damage to sensitive ecosystems, the removal of organisms to sell, and interactions with animals that change their behaviour."
     },
     {
      "h": "Feeding wild animals",
      "ref": "6.2/LO3",
      "body": "Interacting with wild animals can change their behaviour. Animals that are fed change how they feed, become dependent on people or aggressive, and approach boats. Even if it adds food, feeding changes natural behaviour and makes animals depend on people."
     },
     {
      "h": "A named example",
      "ref": "6.2/LO4",
      "body": "In the <b>Galapagos Islands</b>, visitors can carry new species in on boats and footwear, trample nests and plants, fish illegally and add to the waste from resorts. These impacts are managed with marked paths, small guided groups, islands closed to visitors, and entry fees. On the <b>Great Barrier Reef</b>, anchors, boat hulls and divers damage coral, and sediment from resort building reduces the light reaching it."
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
      "the basic facilities an area needs, such as roads, ports, water supplies and sewage systems"
     ],
     [
      "Ecotourism",
      "ecologically sustainable tourism in natural areas that aids conservation"
     ],
     [
      "MPA",
      "Marine Protected Area, an area of sea where fishing and other human activities are banned, restricted or controlled"
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
      "body": "A <b>cast net</b> is small-scale and bycatch can be released. <b>Pelagic trawling</b> takes big catches of shoaling fish. A <b>beam trawl</b> is dragged along the seabed, destroys habitat and catches almost everything in its path, so it is the most damaging. A <b>purse seine</b> takes very large catches and can trap dolphins and turtles."
     },
     {
      "h": "Nets, traps and lines",
      "ref": "6.3/LO2",
      "body": "<b>Gill, tangle and drift nets</b> entangle non-target species, and if lost become <b>ghost nets</b> that keep catching. <b>Basket traps</b> have low impact unless overused. <b>Trolling</b> and <b>longlining</b> use lines: longlining sets very long lines with many hooks and catches seabirds and turtles, while <b>pole and line</b> takes one fish at a time with low bycatch."
     },
     {
      "h": "Bycatch",
      "ref": "6.3/LO2",
      "body": "<b>Bycatch</b> is the unwanted species caught along with the target fish. Methods that catch a lot of bycatch, like beam trawling and longlining, harm many other animals. Selective methods like pole and line have very little bycatch."
     },
     {
      "h": "Navigational aids",
      "ref": "6.3/LO3",
      "body": "A <b>chart</b> is a sea map showing depths, hazards and channels, and a <b>compass</b> points to magnetic north. Every chart has a <b>compass rose</b>, a diagram showing the directions (north, east, south, west and the points between), which sailors use with a compass to plan and follow a course. <b>GPS</b> gives exact position from satellites in any visibility. <b>Sonar</b> sends sound pulses that reflect off the seabed and shoals, while <b>radar</b> uses radio waves to detect ships and coasts above the water."
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
     ],
     [
      "Compass rose",
      "a diagram on a chart showing the directions, such as north, east, south and west"
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
      "body": "Farmed fish meet part of the demand, so fewer wild fish need to be caught. However, uneaten food and faeces lower the oxygen in the water as they decompose, and parasites and disease can spread to wild fish. Escaped fish compete or interbreed with wild fish, mangroves are cleared to build farms, and wild fish are caught to make feed."
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
    "tip": "For each energy source give a benefit and a drawback: 'renewable' does not mean 'no impact'.",
    "notes": [
     {
      "h": "Oil under the seabed",
      "ref": "6.5/LO1",
      "body": "Oil is found in rocks beneath the seabed and is reached by drilling down from platforms. It is trapped in the rock, not lying on the seabed or in the water."
     },
     {
      "h": "A fossil fuel with many uses",
      "ref": "6.5/LO2",
      "body": "Oil is a <b>fossil fuel</b>, formed from organisms that died millions of years ago, and it is <b>non-renewable</b>: it took millions of years to form, so it cannot be replaced in a human lifetime. Burning (combusting) it releases <b>carbon dioxide</b>. It is also used to make plastics."
     },
     {
      "h": "Spill risk from transport",
      "ref": "6.5/LO3",
      "body": "Oil is moved around the world by tanker and pipeline. Collisions, groundings, platform accidents and pipe leaks can release it. This is why moving and extracting oil creates a spill risk."
     },
     {
      "h": "MARPOL rules",
      "ref": "6.5/LO4",
      "body": "<b>MARPOL</b> is an international set of rules to reduce pollution from ships. It requires double hulls on oil tankers, washing of holds only at special collection sites, and controls on sewage and garbage. If only the outer hull is punctured, the inner hull still holds the oil in, so a spill is less likely."
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
      "body": "Renewable ocean energy comes from a source that will not run out, reduces carbon dioxide emissions and reduces reliance on fossil fuels. However, it has high initial costs and can only be used in suitable locations, and the underwater cables can damage the seabed. Turbines can be damaged by storms, can harm marine life, are costly to maintain, and may spoil the view for tourism."
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
    "tip": "Be specific about plastic harm: entanglement, blocked guts from ingestion, and microplastics passing up the food chain (not just 'it's bad').",
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
    "tip": "Learn the eutrophication chain in order: extra nutrients (nitrogen, phosphorus) → algal bloom → algae die → more decomposition → decomposers respire aerobically → dissolved oxygen falls → organisms needing oxygen die. The marks are for the sequence.",
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
      "body": "Extra nutrients cause producers to grow rapidly, forming an <b>algal bloom</b>. When the algae die, <b>decomposers</b> break them down and use oxygen in aerobic respiration. Decomposers use oxygen faster than photosynthesis and the air can replace it, and living algae and decomposers continue to respire at night, when photosynthesis stops. Dissolved oxygen falls, so organisms that need oxygen die."
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
      "an organism that breaks down dead material; in water, decomposers use oxygen as they respire"
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
    "intro": "How the greenhouse effect works, where the extra gases come from, and how warming and acidification change the sea, sea level and marine life.",
    "tip": "Keep the two effects apart: more CO₂ → warming (greenhouse effect), and CO₂ dissolving → lower pH (ocean acidification). Warming bleaches coral.",
    "notes": [
     {
      "h": "Climate has changed before",
      "ref": "6.8/LO1",
      "body": "Over the last 335 million years the climate of different regions has changed significantly. The carbon dioxide level and the average temperature have risen and fallen many times, generally together. This shows that the climate has also changed naturally in the past."
     },
     {
      "h": "The greenhouse effect",
      "ref": "6.8/LO2",
      "body": "Radiation from the Sun passes through the atmosphere and is absorbed by the land and sea, which warm up and give off heat (infrared radiation). <b>Greenhouse gases</b>, such as carbon dioxide and methane, absorb some of this heat and send it back towards the surface, trapping it. This natural <b>greenhouse effect</b> keeps the Earth warm enough for life."
     },
     {
      "h": "The enhanced greenhouse effect",
      "ref": "6.8/LO2",
      "body": "Human activity adds extra carbon dioxide and methane, so more heat is trapped: the <b>enhanced greenhouse effect</b>. The rise in the Earth's average temperature that results is <b>global warming</b>, and the long-term change in weather patterns (temperature, rainfall, storms) is <b>climate change</b>."
     },
     {
      "h": "Where the extra gases come from",
      "ref": "6.8/LO2",
      "body": "<b>Carbon dioxide</b> comes from burning fossil fuels in vehicles, ships, aircraft and power stations, and from <b>deforestation</b> (fewer trees photosynthesise, and the dead wood releases CO₂). It is removed by photosynthesis and by dissolving in the oceans, but far more is now released than removed. <b>Methane</b> also comes from human activities, such as farming and rotting waste."
     },
     {
      "h": "Warmer, more acidic sea",
      "ref": "6.8/LO3",
      "body": "Rising CO₂ makes sea water increase in <b>temperature</b> and decrease in <b>pH</b>. Sea water is slightly alkaline (about pH 8.1–8.2); dissolved CO₂ forms a weak acid, so the water becomes less alkaline (<b>ocean acidification</b>)."
     },
     {
      "h": "The ocean absorbs heat",
      "ref": "6.8/LO4",
      "body": "Water needs a lot of energy to warm up, so the oceans absorb and store a great deal of heat with only a small rise in temperature. This <b>slows</b> the warming of the air but does not stop it (it is also why coasts have milder winters and cooler summers). But the oceans are slowly warming: the water undergoes <b>thermal expansion</b> (the particles move faster and further apart, so the same mass takes up a larger volume), ice melts and less oxygen dissolves."
     },
     {
      "h": "Two causes of sea-level rise",
      "ref": "6.8/LO5",
      "body": "Both raise sea level. <b>Thermal expansion</b> enlarges the water already in the ocean. Melting <b>land-based ice</b> (the ice sheets of Greenland and Antarctica, and mountain glaciers) adds new water. Melting floating ice (sea ice, icebergs) does not noticeably raise the level."
     },
     {
      "h": "Impacts on marine life",
      "ref": "6.8/LO6",
      "body": "<b>Sea-level rise</b> floods coastal habitats and land, and low-lying islands such as the Maldives are most at risk. Warming causes <b>coral bleaching</b>. Warm water holds <b>less oxygen</b>, which affects active fish most. Cool-water species shift <b>towards the poles</b>, and migrations can miss the food they are timed to meet. New competitors, predators and parasites spread, ice-dependent species may be lost, and more <b>extreme weather</b> damages reefs and mangroves; glacier meltwater can lower salinity and affect currents."
     }
    ],
    "terms": [
     [
      "Greenhouse effect",
      "natural trapping of heat by gases in the atmosphere, which keeps the Earth warm enough for life"
     ],
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
      "ice sheets and glaciers on land, whose meltwater adds to the sea"
     ],
     [
      "Coral bleaching",
      "coral expelling its zooxanthellae when stressed, mainly by water that is too warm"
     ],
     [
      "Global warming",
      "the rise in the Earth's average temperature caused by the enhanced greenhouse effect"
     ],
     [
      "Climate change",
      "long-term change in weather patterns such as temperature, rainfall and storms"
     ],
     [
      "Ocean acidification",
      "the fall in the pH of sea water as more carbon dioxide dissolves in it"
     ]
    ]
   },
   {
    "id": "6.9",
    "title": "Conservation",
    "intro": "Measuring how many species live in an area, and how harvesting rules, aquaculture, protected areas and conservation projects protect them, with their advantages and drawbacks.",
    "tip": "For an 'evaluate' question, give both sides: how the strategy helps, and a named drawback (cost, enforcement, conflict with local people, or the cause of damage not being stopped).",
    "notes": [
     {
      "h": "Species richness",
      "ref": "6.9/LO1",
      "body": "<b>Species richness</b> is the number of different species in an area at a particular time. It counts the different kinds, not the number of individuals or the biomass. It is a quick measure of health, but it ignores how many individuals of each species there are, so a high species richness can hide the fact that most of the populations are very small."
     },
     {
      "h": "Sustainable harvesting",
      "ref": "6.9/LO2",
      "body": "Harvesting of wild macroalgae, plants and animals is kept sustainable with quotas, limits on fishing days, closed seasons and closed areas, rules on fishing gear, and licences. For example, some island fisheries allow tuna to be caught only by pole and line, with quotas and licences. For: people keep their income and traditional work, so they support the rules, and stocks survive. Against: the rules are hard to monitor and enforce, so some overfishing continues."
     },
     {
      "h": "Aquaculture for conservation",
      "ref": "6.9/LO2",
      "body": "Farming <b>commercial species</b> meets demand and relieves wild stocks. Farming <b>endangered species</b> can restock the wild: giant clams farmed in Fiji are released onto reefs, and coral is farmed for reefs. For: less harvesting from the wild, local income, animals for release. Against: farms can pollute, may use wild-caught fish for feed or broodstock, and released animals can carry disease into wild populations."
     },
     {
      "h": "Why an MPA raises fish species",
      "ref": "6.9/LO2",
      "body": "After an <b>MPA</b> is set up, coral recovers, and more coral means more <b>zooxanthellae</b> and more photosynthesis. This gives more energy, so more trophic levels, more shelter and more niches. The result is more fish species. To compare an MPA with a fished area fairly, keep the same area, depth, time, method and conditions."
     },
     {
      "h": "Marine parks and MPAs",
      "ref": "6.9/LO2",
      "body": "<b>National marine parks</b> and <b>MPAs</b> control activities inside their boundaries: no-take zones, limits on catches, gear and seasons, and bans or limits on drilling, mining, tourism and boats. For: species breed and increase, habitats and food chains are kept, and fish <b>spill over</b> into nearby waters. Against: conflict with local fishers who lose fishing grounds, and fishers crowding the boundary."
     },
     {
      "h": "Coral farming",
      "ref": "6.9/LO3",
      "body": "Coral is grown from fragments of healthy coral, or from larvae (collected at spawning or from broodstock spawned in tanks) that settle on concrete, plastic or rock; the young corals are then transplanted onto damaged or artificial reefs. For: it has repaired many reefs and gives local jobs. Against: it is slow, costly and needs skilled workers, many transplants fail, and it only works if the cause of the damage (such as blast fishing) is stopped."
     },
     {
      "h": "Protecting turtles",
      "ref": "6.9/LO3",
      "body": "Nesting beaches are protected (restricted access, guided night visits, and limits on <b>artificial lighting</b>, which confuses nesting females and hatchlings). Eggs are incubated away from predators, hatchlings are reared in tanks and released close to the water. For: more eggs hatch and more young reach the sea. Against: it is expensive, and at sea the turtles still face nets, longlines and plastic."
     },
     {
      "h": "Culling lionfish",
      "ref": "6.9/LO3",
      "body": "Lionfish are an <b>invasive species</b> on Atlantic and Caribbean reefs: they have few predators there (groupers have been overfished) and eat many native fish, reducing species richness. They are culled with traps only lionfish can enter, licensed divers with spears, and campaigns to eat them. For: native species can recover, and the campaigns are cheap. Against: poorly designed traps catch other species, divers can damage coral, and lionfish learn to avoid divers."
     }
    ],
    "terms": [
     [
      "Species richness",
      "the number of different species in an area"
     ],
     [
      "MPA",
      "Marine Protected Area, an area of sea where fishing and other human activities are banned, restricted or controlled"
     ],
     [
      "Zooxanthellae",
      "photosynthetic algae living inside coral tissue"
     ],
     [
      "Niche",
      "the role and place a species occupies in a habitat"
     ],
     [
      "Culling",
      "deliberately removing (killing) individuals of a species"
     ],
     [
      "Invasive species",
      "a species that causes harm in an area where it is not native"
     ],
     [
      "Sustainable harvesting",
      "taking only as much as a population can replace"
     ]
    ]
   }
  ]
 }
};
export const notesUnits = [1,2,3,4,5,6];
export const notesByUnit = (u) => (NOTES[u] ? NOTES[u].sections : []);
export const noteSection = (u, sid) => notesByUnit(u).find((s) => s.id === sid) || null;
