/* Practicals — syllabus "PA" (Practical Activity) processes students must be able
 * to carry out and explain. PILOT: Unit 4.1/LO2 food tests only. Each practical has
 * a procedure card (aim, per-test method/result with colour swatches + a plain-English
 * "why it works", safety, exam-technique points) and a set of auto-gradable items that
 * flow through the SAME grade.js / boxAfter engine as the reader (types: match, chain,
 * choice, multi, truefalse, exam). Item shape is identical to the unit banks:
 *   choice   { type:"choice", q, options:[correct-first], a:0, why }
 *   multi    { type:"multi",  q, options, a:[correct indices], why }
 *   match    { type:"match",  q, pairs:[[left,right],…], why }   // authored in correct correspondence
 *   chain    { type:"chain",  q, chunks:[…in correct order], why }
 *   truefalse{ type:"truefalse", q, answer:<bool>, why }
 *   exam     { type:"exam", tier:3, q, check:[correct mark points], distractors:[plausible-wrong], why }
 *
 * Content ceiling (4.1/LO2 knowledge model): NO reagent chemistry/equations, NO
 * non-reducing-sugar test / acid hydrolysis, NO quantitative Benedict's. The "why"
 * lines are plain-English rationale only. ALL content status: human_review (Don/Kiran vet).
 */

export const PRACTICALS = [
  {
    id: "P4.1",
    ref: "4.1/LO2",
    unit: 4,
    title: "Food tests",
    subtitle: "Test a food sample for starch, sugars, protein and fat",
    aim: "Identify which nutrient groups are present in a food sample using chemical tests.",

    // Each test: method, positive/negative result, colour swatches (hex), and a plain-English reason.
    tests: [
      {
        nutrient: "Starch",
        reagent: "Iodine solution",
        method: "Add a few drops of iodine solution to the sample.",
        positive: "Blue-black",
        posColor: "#16233f",
        negative: "Stays orange-brown",
        negColor: "#b5651d",
        why: "Iodine gets trapped inside the long, coiled starch molecule, and that makes it look blue-black.",
      },
      {
        nutrient: "Reducing sugars (e.g. glucose)",
        reagent: "Benedict's solution",
        method: "Add Benedict's solution and heat the tube in a hot water bath.",
        positive: "Blue → green → yellow → orange → brick-red (redder = more sugar)",
        posColor: "#b7410e",
        negative: "Stays blue",
        negColor: "#1f6feb",
        scale: ["#1f6feb", "#3aa66b", "#f2c744", "#f08a24", "#b7410e"], // the graded colour run
        why: "Reducing sugars react with warm Benedict's solution and shift its colour from blue toward brick-red — the more sugar, the further the change goes.",
      },
      {
        nutrient: "Protein",
        reagent: "Biuret solution",
        method: "Add biuret solution to the sample and mix.",
        positive: "Lilac / purple",
        posColor: "#7a4fb0",
        negative: "Stays blue",
        negColor: "#2e6fd6",
        why: "Biuret solution reacts with the bonds that hold a protein together, turning it purple.",
      },
      {
        nutrient: "Lipids (fats & oils)",
        reagent: "Ethanol emulsion test",
        method: "Dissolve the sample in ethanol, then pour the liquid into water.",
        positive: "Cloudy white emulsion",
        posColor: "#e9eef2",
        negative: "Stays clear",
        negColor: "#cfdae0",
        why: "Lipids don't dissolve in water, so when the ethanol mixture meets water the tiny lipid droplets separate out and turn it cloudy.",
      },
    ],

    safety: [
      "Ethanol is highly flammable — keep it away from naked flames.",
      "The reagents are irritants — wear eye protection.",
      "Heat Benedict's in a hot water bath, never directly over a flame.",
    ],

    // Exam-technique / AO3 points (the examiner's mark-scheme logic).
    technique: [
      "“No colour change” is a real result — it means that nutrient is absent, not that the test failed.",
      "Benedict's only reacts when heated; it stays blue if you test it cold.",
      "Judge each colour against an untested (control) sample.",
      "The white emulsion in the lipid test is lipid, not protein.",
    ],

    // Auto-graded run — recall (tier 1) → application (tier 2) → one exam-style (tier 3).
    items: [
      {
        id: "P4.1-01", type: "match", tier: 1, ref: "4.1/LO2", family: "ft-reagent",
        q: "Match each nutrient to the reagent that tests for it.",
        pairs: [
          ["Starch", "Iodine solution"],
          ["Reducing sugars", "Benedict's solution"],
          ["Protein", "Biuret solution"],
          ["Lipids", "Ethanol emulsion test"],
        ],
        why: "Starch → iodine; reducing sugars → Benedict's; protein → biuret; lipids → the ethanol emulsion test. (4.1/LO2)",
        status: "human_review",
      },
      {
        id: "P4.1-02", type: "match", tier: 1, ref: "4.1/LO2", family: "ft-colour",
        q: "Match each reagent to the colour it turns when the nutrient is present.",
        pairs: [
          ["Iodine solution", "Blue-black"],
          ["Benedict's solution (heated)", "Brick-red"],
          ["Biuret solution", "Lilac / purple"],
          ["Ethanol emulsion test", "Cloudy white emulsion"],
        ],
        why: "Iodine → blue-black (starch); heated Benedict's → brick-red (lots of reducing sugar); biuret → purple (protein); the ethanol test → a cloudy white emulsion (lipid). (4.1/LO2)",
        status: "human_review",
      },
      {
        id: "P4.1-03", type: "choice", tier: 1, ref: "4.1/LO2", family: "ft-which-protein",
        q: "Which reagent is used to test a food for protein?",
        options: ["Biuret solution", "Iodine solution", "Benedict's solution", "Ethanol"],
        a: 0,
        why: "Biuret solution tests for protein, turning from blue to purple. Iodine is for starch, Benedict's for reducing sugars, and ethanol for lipids. (4.1/LO2)",
        status: "human_review",
      },
      {
        id: "P4.1-04", type: "truefalse", tier: 1, ref: "4.1/LO2", family: "ft-benedict-heat",
        q: "Benedict's solution must be heated in a water bath to give a positive result.",
        answer: true,
        why: "True. Benedict's only reacts with reducing sugars when it is heated; tested cold it stays blue even if sugar is present. (4.1/LO2)",
        status: "human_review",
      },
      {
        id: "P4.1-05", type: "chain", tier: 2, ref: "4.1/LO2", family: "ft-benedict-method",
        q: "Put the steps of the Benedict's test in the correct order.",
        chunks: [
          "Add Benedict's solution to the food sample",
          "Place the tube in a hot water bath",
          "Heat for a few minutes",
          "Record the final colour",
        ],
        why: "Add Benedict's, put the tube in a hot water bath, heat for a few minutes, then read the colour it has reached — blue means no reducing sugar, brick-red means a lot. (4.1/LO2)",
        status: "human_review",
      },
      {
        id: "P4.1-06", type: "choice", tier: 2, ref: "4.1/LO2", family: "ft-benedict-read",
        q: "After heating, a food turns Benedict's solution brick-red. What does this show?",
        options: [
          "The food contains a lot of reducing sugar",
          "The food contains no reducing sugar",
          "The food contains protein",
          "The food contains starch",
        ],
        a: 0,
        why: "The Benedict's colour runs blue → green → yellow → orange → brick-red as more reducing sugar reacts, so brick-red means a high amount of reducing sugar. Blue would mean none. (4.1/LO2)",
        status: "human_review",
      },
      {
        id: "P4.1-07", type: "choice", tier: 2, ref: "4.1/LO2", family: "ft-negative-result",
        q: "Iodine solution added to a sample stays orange-brown. What does this tell you?",
        options: [
          "No starch is present",
          "The test has failed and must be repeated",
          "A lot of starch is present",
          "Protein is present",
        ],
        a: 0,
        why: "Iodine turns blue-black only when starch is present; staying orange-brown is a valid negative result meaning there is no starch — not a failed test. (4.1/LO2)",
        status: "human_review",
      },
      {
        id: "P4.1-08", type: "choice", tier: 2, ref: "4.1/LO2", family: "ft-crosswire",
        q: "A student sees a blue-black colour with iodine and says the food contains protein. What is the mistake?",
        options: [
          "Blue-black shows starch, not protein",
          "Nothing — blue-black does show protein",
          "Blue-black shows reducing sugar, not protein",
          "Iodine cannot give a blue-black colour",
        ],
        a: 0,
        why: "Iodine turning blue-black shows starch. Protein is shown by biuret solution turning purple — a common cross-wiring of the two tests. (4.1/LO2)",
        status: "human_review",
      },
      {
        id: "P4.1-09", type: "multi", tier: 2, ref: "4.1/LO2", family: "ft-safety",
        q: "Which are correct safety precautions for the food tests? Select all that apply.",
        options: [
          "Keep ethanol away from naked flames",
          "Wear eye protection when using the reagents",
          "Heat Benedict's in a water bath rather than directly on a flame",
          "Heat the ethanol over a Bunsen flame to speed up the lipid test",
          "No precautions are needed because the reagents are harmless",
        ],
        a: [0, 1, 2],
        why: "Ethanol is flammable (no naked flames), the reagents irritate the eyes (eye protection), and Benedict's is heated in a water bath. You never heat ethanol on a flame, and the reagents are not harmless. (4.1/LO2)",
        status: "human_review",
      },
      {
        id: "P4.1-10", type: "choice", tier: 2, ref: "4.1/LO2", family: "ft-lipid",
        q: "In the ethanol emulsion test, what shows that a lipid is present?",
        options: [
          "A cloudy white emulsion forms when the liquid is added to water",
          "The mixture turns purple",
          "The mixture turns brick-red when heated",
          "The mixture turns blue-black",
        ],
        a: 0,
        why: "In the emulsion test the sample is dissolved in ethanol and poured into water; if lipid is present, tiny droplets come out of solution and form a cloudy white emulsion. The other colours belong to the protein, sugar and starch tests. (4.1/LO2)",
        status: "human_review",
      },
      {
        id: "P4.1-11", type: "exam", tier: 3, ref: "4.1/LO2", family: "ft-describe-reducing",
        q: "Describe how you would test a food sample for reducing sugar, and give the result for a positive and a negative test.",
        check: [
          "add Benedict's solution to the food sample",
          "heat the tube in a hot water bath",
          "if reducing sugar is present the colour changes from blue toward brick-red",
          "if no reducing sugar is present the solution stays blue",
        ],
        distractors: [
          "add iodine solution to the sample",
          "keep the mixture cold rather than heating it",
          "a purple colour shows reducing sugar",
          "a cloudy white emulsion shows reducing sugar",
        ],
        why: "The reducing-sugar test is Benedict's solution heated in a water bath: blue → brick-red shows sugar (redder = more), and it stays blue if none is present. Iodine, testing cold, purple and the white emulsion all belong to other tests. (4.1/LO2)",
        status: "human_review",
      },
    ],

    status: "human_review",
  },
];

export const practicalsList = () =>
  PRACTICALS.map((p) => ({ id: p.id, title: p.title, subtitle: p.subtitle, ref: p.ref, unit: p.unit, count: p.items.length }));
export const practicalById = (id) => PRACTICALS.find((p) => p.id === id) || null;
export const practicalItemIds = (id) => (practicalById(id)?.items || []).map((i) => i.id);
