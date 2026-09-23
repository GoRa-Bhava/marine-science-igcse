// Marine Science IGCSE 0697 — Flashcard deck (Units 1–6)
// Standalone REVISION content — NOT part of the question banks. No scoring, no queue, no mastery.
// Each card: front (term) / back (definition) + a graded `retrieval` form used only for self-test.
//   retrieval.type "choice" = reverse-recall (show definition, tap the term); answer = option index.
//   retrieval.type "gap"    = cloze; answer = the correct word; wordBank = the 4 choices.
// Correct option is listed first in `options`/`wordBank`; shuffle at render time.
// Definitions sit at each outcome's depth ceiling (from the unit knowledge models).
// STATUS: human_review — vet (Don/Kiran) before going live.

export const FLASHCARDS = [
  // ================= UNIT 1 — The Earth and its oceans =================
  { id:"FC-U1-01", unit:1, topic:"1.4 Tides & currents", spec:"1.4/LO5",
    front:"Gyre", back:"A large system of circular ocean currents.",
    retrieval:{ type:"choice", stem:"Which term means a large system of circular ocean currents?",
      options:["Gyre","Rip current","Tide","Tsunami"], answer:0 } },
  { id:"FC-U1-02", unit:1, topic:"1.3 Oceans & sea floor", spec:"1.3/LO6",
    front:"Continental shelf", back:"The shallow, gently sloping platform of seabed next to the coast.",
    retrieval:{ type:"choice", stem:"The shallow, gently sloping seabed bordering the coast is the…",
      options:["Continental shelf","Continental slope","Abyssal plain","Mid-ocean ridge"], answer:0 } },
  { id:"FC-U1-03", unit:1, topic:"1.1 Earth structure", spec:"1.1/LO3",
    front:"Mantle", back:"The thick layer of solid rock between the crust and the core, which can melt to form magma.",
    retrieval:{ type:"choice", stem:"Which layer is solid rock that can melt to form magma?",
      options:["Mantle","Crust","Outer core","Inner core"], answer:0 } },
  { id:"FC-U1-04", unit:1, topic:"1.4 Tides & currents", spec:"1.4/LO8",
    front:"Rip current", back:"A narrow, fast current flowing away from the shore, formed as water pushed onto the beach flows back out through a gap.",
    retrieval:{ type:"choice", stem:"A narrow, fast current flowing away from the beach is a…",
      options:["Rip current","Gyre","Tide","Tsunami"], answer:0 } },
  { id:"FC-U1-05", unit:1, topic:"1.4 Tides & currents", spec:"1.4/LO1",
    front:"Spring tide", back:"A tide with the largest range, when the Sun and Moon are in line so their pulls combine.",
    retrieval:{ type:"choice", stem:"Which tide has the largest range, when Sun and Moon are in line?",
      options:["Spring tide","Neap tide","High tide","Rip current"], answer:0 } },
  { id:"FC-U1-06", unit:1, topic:"1.2 Plate tectonics", spec:"1.2/LO6",
    front:"Tsunami", back:"A series of waves formed when a sudden movement of the seabed displaces a large volume of water.",
    retrieval:{ type:"gap", stem:"A series of waves formed when the seabed suddenly displaces a large volume of water is a ______.",
      wordBank:["tsunami","spring tide","rip current","gyre"], answer:"tsunami" } },

  // ================= UNIT 2 — Sea water =================
  { id:"FC-U2-01", unit:2, topic:"2.2 pH & salinity", spec:"2.2/LO7",
    front:"Salinity", back:"The concentration of dissolved salts in sea water, in parts per thousand (ppt).",
    retrieval:{ type:"gap", stem:"The concentration of dissolved salts in sea water is called ______, in parts per thousand.",
      wordBank:["salinity","density","pH","pressure"], answer:"salinity" } },
  { id:"FC-U2-02", unit:2, topic:"2.4 Density", spec:"2.4/LO1",
    front:"Density", back:"Mass per unit volume (mass ÷ volume); units g/cm³.",
    retrieval:{ type:"choice", stem:"Which quantity is mass ÷ volume?",
      options:["Density","Salinity","Pressure","Mass"], answer:0 } },
  { id:"FC-U2-03", unit:2, topic:"2.6 Upwelling", spec:"2.6/LO1",
    front:"Upwelling", back:"The rising of cold, nutrient-rich deep water to the surface as wind moves surface water away.",
    retrieval:{ type:"choice", stem:"Cold, nutrient-rich deep water rising as wind pushes surface water away is…",
      options:["Upwelling","A gyre","Run-off","A rip current"], answer:0 } },
  { id:"FC-U2-04", unit:2, topic:"2.2 pH & salinity", spec:"2.2/LO10",
    front:"Estuary", back:"A partly enclosed body of water where a river flows into the sea.",
    retrieval:{ type:"choice", stem:"A partly enclosed body of water where a river meets the sea is an…",
      options:["Estuary","Sea","Gyre","Lagoon"], answer:0 } },
  { id:"FC-U2-05", unit:2, topic:"2.2 pH & salinity", spec:"2.2/LO5",
    front:"Solute", back:"A substance that dissolves in a solvent (e.g. salt dissolving in sea water).",
    retrieval:{ type:"choice", stem:"In sea water, the dissolved salt is the…",
      options:["Solute","Solvent","Solution","Mixture"], answer:0 } },
  { id:"FC-U2-06", unit:2, topic:"2.6 Upwelling", spec:"2.6/LO2",
    front:"El Niño", back:"A period when the Pacific trade winds weaken or reverse, warming the eastern Pacific and reducing its upwelling.",
    retrieval:{ type:"choice", stem:"Which term describes weakened/reversed Pacific trade winds warming the eastern Pacific?",
      options:["El Niño","Upwelling","Tsunami","Gyre"], answer:0 } },

  // ================= UNIT 3 — Marine organisms =================
  { id:"FC-U3-01", unit:3, topic:"3.3 Classification", spec:"3.3/LO2",
    front:"Binomial system", back:"The internationally agreed two-part naming system — genus then species.",
    retrieval:{ type:"choice", stem:"A two-part scientific name giving genus then species uses the…",
      options:["Binomial system","Dichotomous key","Domain","Kingdom"], answer:0 } },
  { id:"FC-U3-02", unit:3, topic:"3.1 Cells", spec:"3.1/LO4",
    front:"Chloroplast", back:"The cell structure that absorbs light for photosynthesis.",
    retrieval:{ type:"choice", stem:"Which structure absorbs light for photosynthesis?",
      options:["Chloroplast","Mitochondrion","Nucleus","Vacuole"], answer:0 } },
  { id:"FC-U3-03", unit:3, topic:"3.1 Cells", spec:"3.1/LO4",
    front:"Mitochondrion", back:"The cell structure where respiration releases energy.",
    retrieval:{ type:"choice", stem:"Which structure is where respiration releases energy?",
      options:["Mitochondrion","Chloroplast","Nucleus","Cell wall"], answer:0 } },
  { id:"FC-U3-04", unit:3, topic:"3.3 Classification", spec:"3.3/LO3",
    front:"Domain", back:"The largest grouping in classification — Bacteria, Archaea or Eukarya.",
    retrieval:{ type:"choice", stem:"Bacteria, Archaea and Eukarya are the three…",
      options:["Domains","Kingdoms","Genera","Species"], answer:0 } },
  { id:"FC-U3-05", unit:3, topic:"3.2 Reproduction", spec:"3.2/LO1",
    front:"Asexual reproduction", back:"One parent producing genetically identical offspring.",
    retrieval:{ type:"choice", stem:"One parent producing genetically identical offspring is…",
      options:["Asexual reproduction","Sexual reproduction","Fertilisation","Migration"], answer:0 } },
  { id:"FC-U3-06", unit:3, topic:"3.7 Migration", spec:"3.7",
    front:"Migration", back:"The regular movement of animals from one place to another, e.g. to feed or breed.",
    retrieval:{ type:"choice", stem:"The regular movement of animals to feed or breed is…",
      options:["Migration","Navigation","Reproduction","Diffusion"], answer:0 } },

  // ================= UNIT 4 — Nutrients and energy =================
  { id:"FC-U4-01", unit:4, topic:"4.4 Feeding relationships", spec:"4.4/LO5",
    front:"Trophic level", back:"The position of an organism in a food chain, web or pyramid (producers = level 1).",
    retrieval:{ type:"choice", stem:"An organism's position in a food chain (producers = level 1) is its…",
      options:["Trophic level","Biomass","Niche","Food web"], answer:0 } },
  { id:"FC-U4-02", unit:4, topic:"4.4 Feeding relationships", spec:"4.4/LO9",
    front:"Decomposer", back:"An organism (e.g. bacteria) that gets energy by breaking down dead or waste organic material.",
    retrieval:{ type:"choice", stem:"Which organism gets energy by breaking down dead or waste material?",
      options:["Decomposer","Detritivore","Producer","Primary consumer"], answer:0 } },
  { id:"FC-U4-03", unit:4, topic:"4.3 Photosynthesis", spec:"4.3",
    front:"Photosynthesis", back:"The process in which producers use light energy to make carbohydrates from carbon dioxide and water.",
    retrieval:{ type:"gap", stem:"Producers use light energy to make carbohydrates from carbon dioxide and water in ______.",
      wordBank:["photosynthesis","respiration","diffusion","decomposition"], answer:"photosynthesis" } },
  { id:"FC-U4-04", unit:4, topic:"4.2 Respiration", spec:"4.2",
    front:"Respiration", back:"The release of energy from glucose in living cells.",
    retrieval:{ type:"choice", stem:"The release of energy from glucose in living cells is…",
      options:["Respiration","Photosynthesis","Digestion","Diffusion"], answer:0 } },
  { id:"FC-U4-05", unit:4, topic:"4.4 Feeding relationships", spec:"4.4/LO6",
    front:"Consumer", back:"An organism that gets its energy by feeding on other organisms.",
    retrieval:{ type:"choice", stem:"An organism that gets energy by feeding on other organisms is a…",
      options:["Consumer","Producer","Decomposer","Detritivore"], answer:0 } },
  { id:"FC-U4-06", unit:4, topic:"4.4 Feeding relationships", spec:"4.4/LO3",
    front:"Food web", back:"A network of interconnected food chains.",
    retrieval:{ type:"choice", stem:"A network of interconnected food chains is a…",
      options:["Food web","Food chain","Trophic level","Energy pyramid"], answer:0 } },

  // ================= UNIT 5 — Marine ecosystems =================
  { id:"FC-U5-01", unit:5, topic:"5.3 Open ocean", spec:"5.3/LO6",
    front:"Phytoplankton", back:"Microscopic producers that drift in ocean currents (diatoms, dinoflagellates, cyanobacteria).",
    retrieval:{ type:"choice", stem:"Which are microscopic producers that drift in the currents?",
      options:["Phytoplankton","Zooplankton","Kelp","Nekton"], answer:0 } },
  { id:"FC-U5-02", unit:5, topic:"5.6 Mangrove", spec:"5.6/LO3",
    front:"Pneumatophore", back:"A mangrove aerial root that grows up into the air to take in oxygen for respiration.",
    retrieval:{ type:"choice", stem:"A mangrove root that grows into the air to take in oxygen is a…",
      options:["Pneumatophore","Prop root","Holdfast","Rhizome"], answer:0 } },
  { id:"FC-U5-03", unit:5, topic:"5.7 Coral reef", spec:"5.7/LO4",
    front:"Mutualism", back:"A relationship between two species in which both benefit.",
    retrieval:{ type:"choice", stem:"A relationship in which both species benefit is…",
      options:["Mutualism","Parasitism","Predation","Competition"], answer:0 } },
  { id:"FC-U5-04", unit:5, topic:"5.7 Coral reef", spec:"5.7/LO4",
    front:"Zooxanthellae", back:"The photosynthetic algae that live in coral polyp tissues in a mutualism.",
    retrieval:{ type:"choice", stem:"The photosynthetic algae living inside coral polyps are the…",
      options:["Zooxanthellae","Phytoplankton","Zooplankton","Polyps"], answer:0 } },
  { id:"FC-U5-05", unit:5, topic:"5.3 Open ocean", spec:"5.3/LO7",
    front:"Zooplankton", back:"Small drifting consumers, such as larvae and jellyfish, that feed on other plankton.",
    retrieval:{ type:"choice", stem:"Which are small drifting consumers such as larvae and jellyfish?",
      options:["Zooplankton","Phytoplankton","Producers","Decomposers"], answer:0 } },
  { id:"FC-U5-06", unit:5, topic:"5.4 Rocky shore", spec:"5.4/LO1",
    front:"Intertidal zone", back:"The part of the shore between the high and low tide marks, covered and exposed as the tide moves.",
    retrieval:{ type:"choice", stem:"The shore between the high and low tide marks is the…",
      options:["Intertidal zone","Subtidal zone","Supratidal zone","Pelagic zone"], answer:0 } },

  // ================= UNIT 6 — Human influences =================
  { id:"FC-U6-01", unit:6, topic:"6.7 Eutrophication", spec:"6.7/LO5",
    front:"Eutrophication", back:"Extra nutrients cause an algal bloom whose decomposition lowers dissolved oxygen, killing organisms.",
    retrieval:{ type:"choice", stem:"Extra nutrients → algal bloom → decomposition → falling oxygen → deaths. This is…",
      options:["Eutrophication","Ocean acidification","Upwelling","Coral bleaching"], answer:0 } },
  { id:"FC-U6-02", unit:6, topic:"6.1 Overview", spec:"6.1/LO4",
    front:"Sustainable use", back:"Using a resource at a rate that does not damage the environment or cause it to run out.",
    retrieval:{ type:"choice", stem:"Using a resource so it is not damaged and does not run out is described as…",
      options:["Sustainable","Renewable","Endangered","Protected"], answer:0 } },
  { id:"FC-U6-03", unit:6, topic:"6.6 Plastic", spec:"6.6/LO1",
    front:"Microplastics", back:"Tiny plastic fragments formed as larger plastic slowly breaks down.",
    retrieval:{ type:"choice", stem:"Tiny plastic fragments formed as plastic breaks down are…",
      options:["Microplastics","Nutrients","Sediment","Plankton"], answer:0 } },
  { id:"FC-U6-04", unit:6, topic:"6.6 Plastic", spec:"6.6/LO3",
    front:"Garbage patch", back:"An accumulation of floating plastic in the calm centre of an ocean gyre.",
    retrieval:{ type:"gap", stem:"An accumulation of floating plastic in the calm centre of a gyre is a garbage ______.",
      wordBank:["patch","reef","bloom","current"], answer:"patch" } },
  { id:"FC-U6-05", unit:6, topic:"6.9 Conservation", spec:"6.9/LO1",
    front:"Species richness", back:"The number of different species in an area.",
    retrieval:{ type:"choice", stem:"The number of different species in an area is the…",
      options:["Species richness","Biomass","Population","Abundance"], answer:0 } },
  { id:"FC-U6-06", unit:6, topic:"6.8 Climate", spec:"6.8/LO3",
    front:"Ocean acidification", back:"The fall in sea-water pH as the ocean absorbs more carbon dioxide.",
    retrieval:{ type:"choice", stem:"The fall in sea-water pH as it absorbs more CO₂ is…",
      options:["Ocean acidification","Eutrophication","Coral bleaching","Upwelling"], answer:0 } },
];

// Optional helper the Flashcards view can use to build the six unit decks.
export const flashcardsByUnit = (u) => FLASHCARDS.filter((c) => c.unit === u);

// Units present in the deck (for the Flashcards home), in order.
export const FLASHCARD_UNITS = [...new Set(FLASHCARDS.map((c) => c.unit))].sort((a, b) => a - b);

/* Build a gradeable pseudo-item from a card's `retrieval`, reusing the shared
   choice/gap renderers + grading. choice: answer is the option index; gap: the
   stem carries a "______" blank, answer is the word, wordBank the 4 choices. */
export function retrievalToItem(card) {
  const r = card && card.retrieval;
  if (!r) return null;
  if (r.type === "choice") {
    return { id: `fc-${card.id}`, type: "choice", q: r.stem, options: r.options, a: r.answer ?? 0 };
  }
  if (r.type === "gap") {
    const parts = String(r.stem).split("______");
    const segments = parts.length >= 2 ? parts : [String(r.stem), ""];
    return { id: `fc-${card.id}`, type: "gap", q: "Complete the sentence.", segments, answers: [r.answer], bank: r.wordBank };
  }
  return null;
}
