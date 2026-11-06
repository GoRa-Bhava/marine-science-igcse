// Marine Science IGCSE 0697: Writing practice bank (pilot).
// "Write it, then mark it": the student writes an answer, then ticks the marking points it makes.
// Score = min(points ticked, marks). Points are our own wording of creditable mark-scheme ideas;
// `accept` = alternatives the mark schemes credit; `noCredit` = common answers that earn nothing.
// Not a quiz tier: nothing here feeds scoring, spaced repetition or rewards.
// STATUS: human_review. The pilot content batch will extend this to 10-15 questions.

export const WRITING = [
  { id: "W1-01", unit: 1, ref: "1.2/LO3", command: "Outline", marks: 4,
    q: "Outline how the present-day continents and oceans were formed.",
    points: [
      { t: "The continents were once joined together in a single supercontinent", accept: "Pangaea" },
      { t: "The tectonic plates float on the mantle", accept: "float on magma" },
      { t: "Convection currents in the mantle move the plates" },
      { t: "The supercontinent broke apart and the plates carried the pieces away from each other" },
      { t: "This happened over hundreds of millions of years", accept: "over millions of years / over a very long time" },
    ],
    noCredit: ["Earthquakes pushed the continents into their present places", "The Moon's gravity pulled the land apart"],
    model: "The continents were once joined together in one supercontinent, Pangaea. The Earth's crust is made of tectonic plates that float on the mantle, and convection currents in the mantle slowly move them. The supercontinent broke apart and the pieces moved away from each other, forming today's continents with oceans between them. This took hundreds of millions of years.",
    tip: "Outline means give the main points, in a sensible order. One clear point per mark; you don't need long explanations.",
    status: "human_review" },

  { id: "W1-02", unit: 1, ref: "1.2/LO6", command: "Describe", marks: 4,
    q: "Describe how a tsunami can be formed.",
    points: [
      { t: "There is a sudden movement of the seabed", accept: "the seabed moves up or down suddenly" },
      { t: "This is caused by an earthquake at a plate boundary", accept: "an underwater volcanic eruption / an underwater landslide" },
      { t: "A large volume of water is displaced", accept: "water is pushed up / moved" },
      { t: "Waves spread out across the ocean from where the water was displaced" },
      { t: "The waves grow taller as they reach shallow water near the coast", accept: "slow down and increase in height near land" },
    ],
    noCredit: ["A very strong wind makes a giant wave", "An extremely high tide floods the coast", "The tsunami is tallest in the middle of the ocean"],
    model: "A sudden movement of the seabed, usually caused by an earthquake where two plates slip at a boundary, displaces a large volume of water. This sets off waves that spread out across the ocean. As the waves reach shallow water near the coast they slow down and grow much taller before they reach the land.",
    tip: "Describe means say what happens, step by step. Start with the cause (movement of the seabed) and use the key word displaced.",
    status: "human_review" },

  { id: "W6-01", unit: 6, ref: "6.7/LO5", command: "Explain", marks: 5,
    q: "Fertiliser runs off farmland into a river estuary. Explain how this can lead to the death of fish in the estuary.",
    points: [
      { t: "The fertiliser adds extra nutrients to the water", accept: "nitrates / phosphates" },
      { t: "Algae grow rapidly, forming an algal bloom", accept: "producers / phytoplankton grow quickly" },
      { t: "The algae die" },
      { t: "Decomposers (bacteria) break down the dead algae", accept: "the dead algae are decomposed by microorganisms" },
      { t: "The decomposers use up dissolved oxygen in aerobic respiration", accept: "the bacteria respire and use the oxygen" },
      { t: "The dissolved oxygen level falls, so fish cannot get enough oxygen and die", accept: "fish suffocate / move away" },
    ],
    noCredit: ["The algae poison the fish", "The fish starve because the algae use up the nutrients", "The algal bloom heats the water"],
    model: "The fertiliser washes extra nutrients, such as nitrates, into the estuary. The algae use them to grow rapidly, forming an algal bloom. When the algae die, decomposers such as bacteria break down the dead material. The decomposers respire aerobically and use up the dissolved oxygen in the water. The oxygen level falls so low that fish cannot get enough oxygen, and they die.",
    tip: "Explain needs a chain of causes. Link each step to the next (so, which means, because) and make sure the oxygen is used by the decomposers, not by the living algae.",
    status: "human_review" },
];

// Allowed command words (exam-style). Kept here so the content test and the UI agree.
export const WRITING_COMMANDS = [
  "Outline", "Describe", "Explain", "Suggest", "Discuss", "Evaluate", "Compare", "Describe and explain",
];

// Pure scorer: a self-marked answer scores one mark per ticked point, capped at the
// question's marks and floored at 0. No text is inspected — marking is the student's.
export function scoreWriting(ticked, marks) {
  const t = Math.max(0, Math.floor(Number(ticked) || 0));
  const m = Math.max(0, Math.floor(Number(marks) || 0));
  return Math.min(t, m);
}

// Questions grouped by unit, in bank order, for the list screen.
export function writingByUnit(bank = WRITING) {
  const groups = new Map();
  for (const w of bank) {
    if (!groups.has(w.unit)) groups.set(w.unit, []);
    groups.get(w.unit).push(w);
  }
  return [...groups.entries()].sort((a, b) => a[0] - b[0]).map(([unit, questions]) => ({ unit, questions }));
}
