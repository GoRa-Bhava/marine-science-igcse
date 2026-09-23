/* Flashcards — a standalone revision deck, separate from the Units 1–6 question
 * bank. Flip-to-learn (front → back) plus an optional auto-graded `retrieval`
 * self-test that reuses the existing choice/gap renderers + grading. These do
 * NOT feed the spaced-repetition queue, mastery, or exam-readiness (by design).
 *
 * Seeded from the vetted sample (marine-tf-flashcards-sample.md, Part B, 15
 * cards). status: human_review — awaiting Don/Kiran sign-off before "live".
 *
 * Card shape: { id, unit, topic, front, back, retrieval }
 *   retrieval (choice): { type:"choice", stem, options:[correct-first...], a:0 }
 *   retrieval (gap):    { type:"gap", stem, segments:[...], answers:[...], bank:[...] }
 * Correct choice option is authored first; the renderer shuffles at display time.
 */

export const FLASHCARDS = [
  // ---- Unit 1 ----
  {
    id: "FC-U1-01", unit: 1, topic: "1.4 Tides and currents",
    front: "Gyre", back: "A large system of circular ocean currents.",
    retrieval: { type: "choice", stem: "Which term means a large system of circular ocean currents?",
      options: ["Gyre", "Rip current", "Tide", "Tsunami"], a: 0 },
  },
  {
    id: "FC-U1-02", unit: 1, topic: "1.3 Oceans and the sea floor",
    front: "Continental shelf", back: "The shallow, gently sloping platform of seabed next to the coast.",
    retrieval: { type: "choice", stem: "The shallow, gently sloping seabed bordering the coast is the…",
      options: ["Continental shelf", "Continental slope", "Abyssal plain", "Mid-ocean ridge"], a: 0 },
  },
  // ---- Unit 2 ----
  {
    id: "FC-U2-01", unit: 2, topic: "2.2 pH and salinity",
    front: "Salinity", back: "The concentration of dissolved salts in sea water, measured in parts per thousand (ppt).",
    retrieval: { type: "gap", stem: "The concentration of dissolved salts in sea water, measured in parts per thousand.",
      segments: ["The concentration of dissolved salts in sea water is called ", ", measured in parts per thousand."],
      answers: ["salinity"], bank: ["salinity", "density", "pH", "pressure"] },
  },
  {
    id: "FC-U2-02", unit: 2, topic: "2.4 Density",
    front: "Density", back: "Mass per unit volume (mass ÷ volume); units g/cm³.",
    retrieval: { type: "choice", stem: "Which quantity is mass ÷ volume?",
      options: ["Density", "Salinity", "Pressure", "Mass"], a: 0 },
  },
  {
    id: "FC-U2-03", unit: 2, topic: "2.6 Upwelling",
    front: "Upwelling", back: "The rising of cold, nutrient-rich deep water to the surface as wind moves surface water away.",
    retrieval: { type: "choice", stem: "Cold, nutrient-rich deep water rising to the surface as wind pushes surface water away is…",
      options: ["Upwelling", "A gyre", "Run-off", "A rip current"], a: 0 },
  },
  // ---- Unit 3 ----
  {
    id: "FC-U3-01", unit: 3, topic: "3.3 Classification",
    front: "Binomial system", back: "The internationally agreed two-part naming system — genus then species.",
    retrieval: { type: "choice", stem: "A two-part scientific name giving genus then species uses the…",
      options: ["Binomial system", "Dichotomous key", "Domain", "Kingdom"], a: 0 },
  },
  {
    id: "FC-U3-02", unit: 3, topic: "3.1 Cell structure and function",
    front: "Chloroplast", back: "The cell structure that absorbs light for photosynthesis.",
    retrieval: { type: "choice", stem: "Which structure absorbs light for photosynthesis?",
      options: ["Chloroplast", "Mitochondrion", "Nucleus", "Vacuole"], a: 0 },
  },
  // ---- Unit 4 ----
  {
    id: "FC-U4-01", unit: 4, topic: "4.4 Feeding relationships",
    front: "Trophic level", back: "The position of an organism in a food chain, web or pyramid (producers = level 1).",
    retrieval: { type: "choice", stem: "An organism's position in a food chain (producers = level 1) is its…",
      options: ["Trophic level", "Biomass", "Niche", "Food web"], a: 0 },
  },
  {
    id: "FC-U4-02", unit: 4, topic: "4.4 Feeding relationships",
    front: "Decomposer", back: "An organism (e.g. bacteria) that gets energy by breaking down dead or waste organic material.",
    retrieval: { type: "choice", stem: "Which organism gets energy by breaking down dead or waste material?",
      options: ["Decomposer", "Detritivore", "Producer", "Primary consumer"], a: 0 },
  },
  {
    id: "FC-U4-03", unit: 4, topic: "4.3 Photosynthesis",
    front: "Photosynthesis", back: "The process in which producers use light energy to make carbohydrates from carbon dioxide and water.",
    retrieval: { type: "gap", stem: "Producers use light energy to make carbohydrates from carbon dioxide and water.",
      segments: ["Producers use light energy to make carbohydrates from carbon dioxide and water in the process of ", "."],
      answers: ["photosynthesis"], bank: ["photosynthesis", "respiration", "diffusion", "decomposition"] },
  },
  // ---- Unit 5 ----
  {
    id: "FC-U5-01", unit: 5, topic: "5.3 Open-ocean ecosystem",
    front: "Phytoplankton", back: "Microscopic producers that drift in ocean currents (diatoms, dinoflagellates, cyanobacteria).",
    retrieval: { type: "choice", stem: "Which are microscopic producers that drift in the currents?",
      options: ["Phytoplankton", "Zooplankton", "Kelp", "Nekton"], a: 0 },
  },
  {
    id: "FC-U5-02", unit: 5, topic: "5.6 Mangrove forest",
    front: "Pneumatophore (aerial root)", back: "A mangrove root that grows up into the air to take in oxygen for respiration.",
    retrieval: { type: "choice", stem: "A mangrove root that grows into the air to take in oxygen is a…",
      options: ["Pneumatophore", "Prop root", "Holdfast", "Rhizome"], a: 0 },
  },
  {
    id: "FC-U5-03", unit: 5, topic: "5.7 Tropical coral reefs",
    front: "Mutualism", back: "A relationship between two species in which both benefit.",
    retrieval: { type: "choice", stem: "A relationship in which both species benefit is…",
      options: ["Mutualism", "Parasitism", "Predation", "Competition"], a: 0 },
  },
  // ---- Unit 6 ----
  {
    id: "FC-U6-01", unit: 6, topic: "6.7 Eutrophication",
    front: "Eutrophication", back: "Extra nutrients cause an algal bloom whose decomposition lowers dissolved oxygen, killing organisms.",
    retrieval: { type: "choice", stem: "Extra nutrients → an algal bloom → decomposition → falling oxygen → deaths. This process is…",
      options: ["Eutrophication", "Ocean acidification", "Upwelling", "Coral bleaching"], a: 0 },
  },
  {
    id: "FC-U6-02", unit: 6, topic: "6.1 Overview of human interactions",
    front: "Sustainable use", back: "Using a resource at a rate that does not damage the environment or cause it to run out.",
    retrieval: { type: "choice", stem: "Using a resource so it is not damaged and does not run out is described as…",
      options: ["Sustainable", "Renewable", "Endangered", "Protected"], a: 0 },
  },
];

// Units present in the deck, in order, for the Flashcards home.
export const FLASHCARD_UNITS = [...new Set(FLASHCARDS.map((c) => c.unit))].sort((a, b) => a - b);

export function flashcardsByUnit(unit) {
  return FLASHCARDS.filter((c) => c.unit === unit);
}

/* Turn a card's `retrieval` into a gradeable pseudo-item the existing renderer +
 * grade.js understand (choice → q/options/a; gap → q/segments/answers/bank). */
export function retrievalToItem(card) {
  const r = card.retrieval;
  if (!r) return null;
  if (r.type === "choice") {
    return { id: `fc-${card.id}`, type: "choice", q: r.stem, options: r.options, a: r.a ?? 0 };
  }
  if (r.type === "gap") {
    return { id: `fc-${card.id}`, type: "gap", q: "Complete the sentence.", segments: r.segments, answers: r.answers, bank: r.bank };
  }
  return null;
}
