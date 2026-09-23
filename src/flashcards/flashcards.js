// Marine Science IGCSE 0697 — Flashcard deck (Units 1–6)
// Standalone REVISION content — NOT part of the question banks. No scoring, no queue, no mastery.
// Each card: front (term) / back (definition). Pure flip-card revision — tap to reveal the back.
// No self-test / graded retrieval: the flip itself is the recall act, and the auto-graded
// question types (true/false, "mark which are true", MCQ, gap-fill) live in the Unit 1–6 banks.
// Definitions sit at each outcome's depth ceiling (from the unit knowledge models).
// STATUS: human_review — vet (Don/Kiran) before going live.

export const FLASHCARDS = [
  // ================= UNIT 1 — The Earth and its oceans =================
  { id:"FC-U1-01", unit:1, topic:"1.4 Tides & currents", spec:"1.4/LO5",
    front:"Gyre", back:"A large system of circular ocean currents." },
  { id:"FC-U1-02", unit:1, topic:"1.3 Oceans & sea floor", spec:"1.3/LO6",
    front:"Continental shelf", back:"The shallow, gently sloping platform of seabed next to the coast." },
  { id:"FC-U1-03", unit:1, topic:"1.1 Earth structure", spec:"1.1/LO3",
    front:"Mantle", back:"The thick layer of solid rock between the crust and the core, which can melt to form magma." },
  { id:"FC-U1-04", unit:1, topic:"1.4 Tides & currents", spec:"1.4/LO8",
    front:"Rip current", back:"A narrow, fast current flowing away from the shore, formed as water pushed onto the beach flows back out through a gap." },
  { id:"FC-U1-05", unit:1, topic:"1.4 Tides & currents", spec:"1.4/LO1",
    front:"Spring tide", back:"A tide with the largest range, when the Sun and Moon are in line so their pulls combine." },
  { id:"FC-U1-06", unit:1, topic:"1.2 Plate tectonics", spec:"1.2/LO6",
    front:"Tsunami", back:"A series of waves formed when a sudden movement of the seabed displaces a large volume of water." },

  // ================= UNIT 2 — Sea water =================
  { id:"FC-U2-01", unit:2, topic:"2.2 pH & salinity", spec:"2.2/LO7",
    front:"Salinity", back:"The concentration of dissolved salts in sea water, in parts per thousand (ppt)." },
  { id:"FC-U2-02", unit:2, topic:"2.4 Density", spec:"2.4/LO1",
    front:"Density", back:"Mass per unit volume (mass ÷ volume); units g/cm³." },
  { id:"FC-U2-03", unit:2, topic:"2.6 Upwelling", spec:"2.6/LO1",
    front:"Upwelling", back:"The rising of cold, nutrient-rich deep water to the surface as wind moves surface water away." },
  { id:"FC-U2-04", unit:2, topic:"2.2 pH & salinity", spec:"2.2/LO10",
    front:"Estuary", back:"A partly enclosed body of water where a river flows into the sea." },
  { id:"FC-U2-05", unit:2, topic:"2.2 pH & salinity", spec:"2.2/LO5",
    front:"Solute", back:"A substance that dissolves in a solvent (e.g. salt dissolving in sea water)." },
  { id:"FC-U2-06", unit:2, topic:"2.6 Upwelling", spec:"2.6/LO2",
    front:"El Niño", back:"A period when the Pacific trade winds weaken or reverse, warming the eastern Pacific and reducing its upwelling." },

  // ================= UNIT 3 — Marine organisms =================
  { id:"FC-U3-01", unit:3, topic:"3.3 Classification", spec:"3.3/LO2",
    front:"Binomial system", back:"The internationally agreed two-part naming system — genus then species." },
  { id:"FC-U3-02", unit:3, topic:"3.1 Cells", spec:"3.1/LO4",
    front:"Chloroplast", back:"The cell structure that absorbs light for photosynthesis." },
  { id:"FC-U3-03", unit:3, topic:"3.1 Cells", spec:"3.1/LO4",
    front:"Mitochondrion", back:"The cell structure where respiration releases energy." },
  { id:"FC-U3-04", unit:3, topic:"3.3 Classification", spec:"3.3/LO3",
    front:"Domain", back:"The largest grouping in classification — Bacteria, Archaea or Eukarya." },
  { id:"FC-U3-05", unit:3, topic:"3.2 Reproduction", spec:"3.2/LO1",
    front:"Asexual reproduction", back:"One parent producing genetically identical offspring." },
  { id:"FC-U3-06", unit:3, topic:"3.7 Migration", spec:"3.7",
    front:"Migration", back:"The regular movement of animals from one place to another, e.g. to feed or breed." },

  // ================= UNIT 4 — Nutrients and energy =================
  { id:"FC-U4-01", unit:4, topic:"4.4 Feeding relationships", spec:"4.4/LO5",
    front:"Trophic level", back:"The position of an organism in a food chain, web or pyramid (producers = level 1)." },
  { id:"FC-U4-02", unit:4, topic:"4.4 Feeding relationships", spec:"4.4/LO9",
    front:"Decomposer", back:"An organism (e.g. bacteria) that gets energy by breaking down dead or waste organic material." },
  { id:"FC-U4-03", unit:4, topic:"4.3 Photosynthesis", spec:"4.3",
    front:"Photosynthesis", back:"The process in which producers use light energy to make carbohydrates from carbon dioxide and water." },
  { id:"FC-U4-04", unit:4, topic:"4.2 Respiration", spec:"4.2",
    front:"Respiration", back:"The release of energy from glucose in living cells." },
  { id:"FC-U4-05", unit:4, topic:"4.4 Feeding relationships", spec:"4.4/LO6",
    front:"Consumer", back:"An organism that gets its energy by feeding on other organisms." },
  { id:"FC-U4-06", unit:4, topic:"4.4 Feeding relationships", spec:"4.4/LO3",
    front:"Food web", back:"A network of interconnected food chains." },

  // ================= UNIT 5 — Marine ecosystems =================
  { id:"FC-U5-01", unit:5, topic:"5.3 Open ocean", spec:"5.3/LO6",
    front:"Phytoplankton", back:"Microscopic producers that drift in ocean currents (diatoms, dinoflagellates, cyanobacteria)." },
  { id:"FC-U5-02", unit:5, topic:"5.6 Mangrove", spec:"5.6/LO3",
    front:"Pneumatophore", back:"A mangrove aerial root that grows up into the air to take in oxygen for respiration." },
  { id:"FC-U5-03", unit:5, topic:"5.7 Coral reef", spec:"5.7/LO4",
    front:"Mutualism", back:"A relationship between two species in which both benefit." },
  { id:"FC-U5-04", unit:5, topic:"5.7 Coral reef", spec:"5.7/LO4",
    front:"Zooxanthellae", back:"The photosynthetic algae that live in coral polyp tissues in a mutualism." },
  { id:"FC-U5-05", unit:5, topic:"5.3 Open ocean", spec:"5.3/LO7",
    front:"Zooplankton", back:"Small drifting consumers, such as larvae and jellyfish, that feed on other plankton." },
  { id:"FC-U5-06", unit:5, topic:"5.4 Rocky shore", spec:"5.4/LO1",
    front:"Intertidal zone", back:"The part of the shore between the high and low tide marks, covered and exposed as the tide moves." },

  // ================= UNIT 6 — Human influences =================
  { id:"FC-U6-01", unit:6, topic:"6.7 Eutrophication", spec:"6.7/LO5",
    front:"Eutrophication", back:"Extra nutrients cause an algal bloom whose decomposition lowers dissolved oxygen, killing organisms." },
  { id:"FC-U6-02", unit:6, topic:"6.1 Overview", spec:"6.1/LO4",
    front:"Sustainable use", back:"Using a resource at a rate that does not damage the environment or cause it to run out." },
  { id:"FC-U6-03", unit:6, topic:"6.6 Plastic", spec:"6.6/LO1",
    front:"Microplastics", back:"Tiny plastic fragments formed as larger plastic slowly breaks down." },
  { id:"FC-U6-04", unit:6, topic:"6.6 Plastic", spec:"6.6/LO3",
    front:"Garbage patch", back:"An accumulation of floating plastic in the calm centre of an ocean gyre." },
  { id:"FC-U6-05", unit:6, topic:"6.9 Conservation", spec:"6.9/LO1",
    front:"Species richness", back:"The number of different species in an area." },
  { id:"FC-U6-06", unit:6, topic:"6.8 Climate", spec:"6.8/LO3",
    front:"Ocean acidification", back:"The fall in sea-water pH as the ocean absorbs more carbon dioxide." },
];

// Optional helper the Flashcards view can use to build the six unit decks.
export const flashcardsByUnit = (u) => FLASHCARDS.filter((c) => c.unit === u);

// Units present in the deck (for the Flashcards home), in order.
export const FLASHCARD_UNITS = [...new Set(FLASHCARDS.map((c) => c.unit))].sort((a, b) => a - b);
