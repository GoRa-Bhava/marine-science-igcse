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
 * Content ceiling (per outcome's knowledge model): NO chemistry/equations beyond the
 * plain-English "why", NO forbidden extensions (see each entry). "why" lines are plain
 * rationale only. ALL content status: human_review (Don/Kiran vet).
 *
 * PROCEDURE-CARD SHAPE (two forms, renderPracticals handles both):
 *   Reagent form (food tests):  tests: [{ nutrient, reagent, method, positive, posColor,
 *                                         negative, negColor, scale?, why }]
 *   Procedure form (all others): apparatus: [str], steps: [str, in order], result: str,
 *                                controls: [str], improvements?: [str], swatches?: [{label,color}]
 *   Shared on any practical:     aim, safety?: [str], technique?: [str] (mark-scheme logic), items[]
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

  /* ============================ UNIT 1 ============================ */
  {
    id: "P1.4", ref: "1.4/LO2", unit: 1,
    title: "Measuring tidal amplitude",
    subtitle: "Use tide readings to work out the tidal amplitude",
    aim: "Measure the tidal amplitude at a shore from readings of high and low water.",
    diagram: `<svg xmlns="http://www.w3.org/2000/svg"
     width="100%" viewBox="0 0 880 560"
     role="img" aria-labelledby="title description">
  <title id="title">Measuring tidal amplitude</title>
  <desc id="description">
    A fixed tide gauge is marked from zero to five metres.
    Regular readings record high water at 4.8 metres and low water at 1.0 metre.
    The tidal range is 3.8 metres. Tidal amplitude is half the range: 1.9 metres.
    Once revealed, all readings and the final answer remain on screen
    while the tide continues to rise and fall.
  </desc>
  <style>
    :root { --bg:#e9f1f2; --panel:#ffffff; --ink:#0d2a37; --soft:#4d6c77; --line:#d2e0e3; --teal:#12a7bb; --deep:#0b6b79; --coral:#ff6a4d; --good:#1a9b6c; }
    @media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg:#071820; --panel:#0e2733; --ink:#e9f4f5; --soft:#9dbcc5; --line:#1c3d49; --teal:#3ac6d8; --deep:#8fdce7; --coral:#ff7d63; } }
    :root[data-theme="dark"] { --bg:#071820; --panel:#0e2733; --ink:#e9f4f5; --soft:#9dbcc5; --line:#1c3d49; --teal:#3ac6d8; --deep:#8fdce7; --coral:#ff7d63; }
    svg { display:block; height:auto; background:var(--bg); font-family:system-ui, sans-serif; }
    text { fill:var(--ink); font-variant-numeric:tabular-nums; }
    .soft{fill:var(--soft);} .accent{fill:var(--coral);}
    .heading{font-size:34px;font-weight:700;} .label{font-size:30px;font-weight:600;}
    .number{font-size:25px;font-weight:600;} .small{font-size:23px;} .result{font-size:36px;font-weight:750;}
    .reference{fill:none;stroke:var(--soft);stroke-width:2.5;stroke-dasharray:9 7;}
    .range-stroke{fill:none;stroke:var(--ink);stroke-width:4;stroke-linecap:round;}
    .amplitude-stroke{fill:none;stroke:var(--coral);stroke-width:5;stroke-linecap:round;}
    .water{animation:tide 9s linear infinite;}
    @keyframes tide{0%,100%{transform:translateY(0);}6.25%{transform:translateY(-43.63px);}12.5%{transform:translateY(-80.61px);}18.75%{transform:translateY(-105.32px);}25%{transform:translateY(-114px);}31.25%{transform:translateY(-105.32px);}37.5%{transform:translateY(-80.61px);}43.75%{transform:translateY(-43.63px);}50%{transform:translateY(0);}56.25%{transform:translateY(43.63px);}62.5%{transform:translateY(80.61px);}68.75%{transform:translateY(105.32px);}75%{transform:translateY(114px);}81.25%{transform:translateY(105.32px);}87.5%{transform:translateY(80.61px);}93.75%{transform:translateY(43.63px);}}
    .high{animation:reveal .36s ease-out 2.25s both;} .low{animation:reveal .27s ease-out 6.75s both;}
    .range{animation:reveal .27s ease-out 7.02s both;} .halving{animation:reveal .18s ease-out 7.29s both;} .answer{animation:reveal .30s ease-out 8.01s both;}
    @keyframes reveal{from{opacity:0;}to{opacity:1;}}
    .half-line{transform-box:view-box;transform-origin:642px 112px;animation:halve-line .54s ease-in-out 7.47s both;}
    .moving-cap{animation:halve-cap .54s ease-in-out 7.47s both;}
    @keyframes halve-line{from{transform:scaleY(1);}to{transform:scaleY(.5);}}
    @keyframes halve-cap{from{transform:translateY(0);}to{transform:translateY(-114px);}}
    .clock-hand{transform-box:view-box;transform-origin:640px 39px;animation:intervals 9s steps(12, end) infinite;}
    @keyframes intervals{to{transform:rotate(360deg);}}
    @media (prefers-reduced-motion: reduce){ .water,.high,.low,.range,.halving,.answer,.half-line,.moving-cap,.clock-hand{animation:none;} .water{transform:translateY(0);} .high,.low,.range,.halving,.answer{opacity:1;} .half-line{transform:scaleY(.5);} .moving-cap{transform:translateY(-114px);} }
  </style>
  <defs>
    <linearGradient id="water-fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="var(--teal)" stop-opacity=".35"/><stop offset="1" stop-color="var(--deep)" stop-opacity=".65"/></linearGradient>
    <clipPath id="scene-clip"><rect x="16" y="76" width="848" height="350" rx="14"/></clipPath>
  </defs>
  <rect width="880" height="560" fill="var(--bg)"/>
  <text x="26" y="43" class="heading">Measuring tidal amplitude</text>
  <g aria-hidden="true">
    <circle cx="640" cy="39" r="21" fill="var(--panel)" stroke="var(--soft)" stroke-width="2"/>
    <path d="M640 21v4 M658 39h-4 M640 57v-4 M622 39h4" stroke="var(--soft)" stroke-width="2"/>
    <path class="clock-hand" d="M640 39V25" stroke="var(--deep)" stroke-width="3" stroke-linecap="round"/>
    <circle cx="640" cy="39" r="3" fill="var(--deep)"/>
    <text x="675" y="33" class="small soft">Regular</text>
    <text x="675" y="59" class="small soft">readings</text>
  </g>
  <g clip-path="url(#scene-clip)">
    <rect x="16" y="76" width="848" height="350" fill="var(--panel)"/>
    <path d="M16 86H864" stroke="var(--line)" stroke-width="2"/>
    <g class="water">
      <path d="M16 226 Q94 222 172 226 Q251 230 330 226 Q409 222 488 226 Q582 230 676 226 Q770 222 864 226 V560H16Z" fill="url(#water-fill)"/>
      <path d="M16 226 Q94 222 172 226 Q251 230 330 226 Q409 222 488 226 Q582 230 676 226 Q770 222 864 226" fill="none" stroke="var(--deep)" stroke-width="3"/>
    </g>
    <path d="M16 150H278V166H16Z" fill="var(--line)" stroke="var(--soft)" stroke-width="2"/>
    <path d="M47 166V426 M190 166V426" stroke="var(--soft)" stroke-width="10"/>
    <rect x="36" y="190" width="197" height="77" rx="10" fill="var(--panel)" fill-opacity=".95"/>
    <text x="53" y="220" class="label">Fixed tide</text>
    <text x="53" y="254" class="label">gauge</text>
    <path d="M235 226H275" stroke="var(--soft)" stroke-width="2"/>
    <rect x="278" y="89" width="52" height="323" rx="5" fill="var(--panel)" stroke="var(--ink)" stroke-width="2.5"/>
    <text x="298" y="80" text-anchor="middle" class="small soft">m</text>
    <path d="M312 100H330 M312 160H330 M312 220H330 M312 280H330 M312 340H330 M312 400H330" stroke="var(--ink)" stroke-width="2.5"/>
    <g class="number" text-anchor="middle"><text x="295" y="109">5</text><text x="295" y="169">4</text><text x="295" y="229">3</text><text x="295" y="289">2</text><text x="295" y="349">1</text><text x="295" y="409">0</text></g>
    <g class="high"><path class="reference" d="M330 112H842"/><circle cx="330" cy="112" r="4" fill="var(--ink)"/><text x="354" y="101" class="label">High water 4.8 m</text></g>
    <g class="low"><path class="reference" d="M330 340H842"/><circle cx="330" cy="340" r="4" fill="var(--ink)"/><text x="354" y="378" class="label">Low water 1.0 m</text></g>
    <g class="range"><path class="range-stroke" d="M413 112H435 M424 112V340 M413 340H435"/><text x="448" y="281" class="label">Range =</text><text x="448" y="321" class="result">3.8 m</text></g>
    <g class="halving"><path class="amplitude-stroke half-line" d="M642 112V340"/><path class="amplitude-stroke" d="M630 112H654"/><g class="moving-cap"><path class="amplitude-stroke" d="M630 340H654"/><circle cx="642" cy="340" r="5" fill="var(--coral)"/></g></g>
    <g class="answer"><path d="M330 226H642" fill="none" stroke="var(--coral)" stroke-width="2" stroke-dasharray="4 7"/><text x="662" y="173" class="label accent">Amplitude</text><text x="662" y="214" class="result accent">= 1.9 m</text></g>
  </g>
  <g class="answer"><rect x="24" y="443" width="832" height="101" rx="14" fill="var(--panel)" stroke="var(--coral)" stroke-width="2"/><text x="440" y="481" text-anchor="middle" class="label accent">amplitude = (high − low) ÷ 2</text><text x="440" y="523" text-anchor="middle" class="result accent">Half the range = 1.9 m</text></g>
</svg>`,
    apparatus: ["A fixed marked scale (or a recording tide gauge)", "A clock or timer", "A results table"],
    steps: [
      "Fix a marked scale vertically where the water rises and falls",
      "Read the water level at regular time intervals",
      "Record the highest (high water) and lowest (low water) levels",
      "Calculate amplitude = (high water − low water) ÷ 2",
    ],
    result: "The tidal amplitude — half the difference between high water and low water.",
    controls: [
      "Take readings at regular, frequent intervals so the true high and low are not missed",
      "Use two methods (e.g. a fixed scale and a recording gauge) to check reliability",
      "Read from the same fixed position every time",
    ],
    technique: [
      "Amplitude = (high − low) ÷ 2 — not high − low.",
      "More frequent readings capture the true high and low more accurately.",
      "The formula is given in the question — you don't need to recall it.",
    ],
    items: [
      { id: "P1.4-01", type: "choice", tier: 1, ref: "1.4/LO2", family: "tide-formula",
        q: "Tidal amplitude is calculated as:",
        options: ["(high water − low water) ÷ 2", "high water − low water", "high water + low water", "(high water + low water) ÷ 2"],
        a: 0, why: "Amplitude is half the difference between high and low water: (high − low) ÷ 2. Forgetting the ÷ 2 gives the tidal range, not the amplitude. (1.4/LO2)", status: "human_review" },
      { id: "P1.4-02", type: "truefalse", tier: 1, ref: "1.4/LO2", family: "tide-accuracy",
        q: "Taking tide readings more frequently gives a more accurate value for high and low water.",
        answer: true, why: "True. Frequent readings are more likely to catch the real highest and lowest points, so the amplitude is more accurate. (1.4/LO2)", status: "human_review" },
      { id: "P1.4-03", type: "chain", tier: 2, ref: "1.4/LO2", family: "tide-method",
        q: "Put the steps of measuring tidal amplitude in order.",
        chunks: ["Fix a marked scale where the water rises and falls", "Read the water level at regular time intervals", "Record the high-water and low-water levels", "Work out the amplitude with the formula"],
        why: "Set up the scale, take timed readings, record the highest and lowest levels, then apply amplitude = (high − low) ÷ 2. (1.4/LO2)", status: "human_review" },
      { id: "P1.4-04", type: "choice", tier: 2, ref: "1.4/LO2", family: "tide-calc",
        q: "High water is 4.8 m and low water is 1.0 m. Using amplitude = (high − low) ÷ 2, the amplitude is:",
        options: ["1.9 m", "3.8 m", "2.9 m", "5.8 m"],
        a: 0, why: "4.8 − 1.0 = 3.8 m (the range); ÷ 2 = 1.9 m (the amplitude). 3.8 m is the common error of forgetting to halve. (1.4/LO2)", status: "human_review" },
      { id: "P1.4-05", type: "choice", tier: 2, ref: "1.4/LO2", family: "tide-reliability",
        q: "Why measure the tide using two different methods?",
        options: ["To check the results are reliable", "To measure two different tides", "To make the tide rise faster", "Because one method measures salinity"],
        a: 0, why: "Comparing two methods that agree shows the readings are reliable. (1.4/LO2)", status: "human_review" },
    ],
    status: "human_review",
  },

  /* ============================ UNIT 2 ============================ */
  {
    id: "P2.2a", ref: "2.2/LO3", unit: 2,
    title: "Testing pH with universal indicator",
    subtitle: "Compare the pH of sea, fresh and rain water",
    aim: "Compare the pH of sea, fresh and rain water using universal indicator.",
    apparatus: ["Universal indicator (solution or paper)", "A pH colour chart", "Samples of sea, fresh and rain water", "Equal measuring vessels"],
    steps: [
      "Put the same volume of each water sample into a clean container",
      "Add the same number of drops of universal indicator to each",
      "Compare each colour with the pH chart",
      "Record the pH of each sample",
    ],
    result: "Sea water is slightly alkaline, fresh water about neutral, rain water slightly acidic.",
    swatches: [
      { label: "Sea water — slightly alkaline", color: "#2f8f9d" },
      { label: "Fresh water — neutral", color: "#4aa84a" },
      { label: "Rain water — slightly acidic", color: "#e8a13a" },
    ],
    controls: ["Same volume of each water sample", "Same number of drops of indicator", "Clean the equipment between samples"],
    technique: [
      "Universal indicator shows pH by its colour — match it to the chart.",
      "The amount of indicator doesn't change the pH; only the sample does.",
      "Rain water is slightly acidic, not neutral.",
    ],
    items: [
      { id: "P2.2a-01", type: "match", tier: 1, ref: "2.2/LO3", family: "ph-samples",
        q: "Match each water sample to its pH.",
        pairs: [["Sea water", "Slightly alkaline"], ["Fresh water", "Neutral"], ["Rain water", "Slightly acidic"]],
        why: "Sea water is slightly alkaline, fresh water is about neutral, and rain water is slightly acidic. (2.2/LO3)", status: "human_review" },
      { id: "P2.2a-02", type: "choice", tier: 1, ref: "2.2/LO3", family: "ph-what",
        q: "What does universal indicator measure?",
        options: ["The pH of the water", "The salinity of the water", "The temperature of the water", "The oxygen in the water"],
        a: 0, why: "Universal indicator changes colour with pH, which you read off the chart. (2.2/LO3)", status: "human_review" },
      { id: "P2.2a-03", type: "truefalse", tier: 2, ref: "2.2/LO3", family: "ph-drops",
        q: "Adding more drops of universal indicator changes the pH reading.",
        answer: false, why: "False. The pH depends on the sample, not on how much indicator you add — that is why you use the same number of drops each time. (2.2/LO3)", status: "human_review" },
      { id: "P2.2a-04", type: "choice", tier: 2, ref: "2.2/LO3", family: "ph-control",
        q: "Why use the same number of indicator drops in every sample?",
        options: ["So the colours can be compared fairly", "To change the pH equally", "To make the reaction faster", "To remove the salt"],
        a: 0, why: "Keeping the indicator the same means any colour difference is due to the water's pH, not the test. (2.2/LO3)", status: "human_review" },
      { id: "P2.2a-05", type: "chain", tier: 2, ref: "2.2/LO3", family: "ph-method",
        q: "Put the steps of the universal-indicator test in order.",
        chunks: ["Measure the same volume of each water sample", "Add the same number of drops of universal indicator", "Compare each colour with the pH chart", "Record the pH of each sample"],
        why: "Equal volumes, equal indicator, compare to the chart, then record each pH. (2.2/LO3)", status: "human_review" },
    ],
    status: "human_review",
  },
  {
    id: "P2.2b", ref: "2.2/LO4", unit: 2,
    title: "Effect of carbon dioxide on sea-water pH",
    subtitle: "Show how dissolved CO₂ makes sea water more acidic",
    aim: "Investigate how adding carbon dioxide changes the pH of sea water.",
    apparatus: ["A sample of sea water", "Universal indicator", "A source of carbon dioxide (e.g. a straw to breathe through)", "Containers"],
    steps: [
      "Add universal indicator to a sample of sea water and note the colour/pH",
      "Bubble carbon dioxide through the sea water (e.g. breathe out through a straw)",
      "Watch the indicator colour change",
      "Record the new pH",
    ],
    result: "The pH falls (the water becomes more acidic) as carbon dioxide dissolves.",
    controls: ["Same volume of sea water", "Same amount of indicator", "Compare with a sample that has no CO₂ added"],
    technique: [
      "Dissolving CO₂ makes the water more acidic — the pH goes down.",
      "This is a lab model of ocean acidification (links to 6.8).",
      "'More acidic' means a lower pH, not a higher one.",
    ],
    items: [
      { id: "P2.2b-01", type: "choice", tier: 1, ref: "2.2/LO4", family: "co2-effect",
        q: "What happens to the pH of sea water when carbon dioxide is bubbled through it?",
        options: ["It falls (more acidic)", "It rises (more alkaline)", "It stays exactly the same", "It becomes neutral and stops"],
        a: 0, why: "CO₂ dissolves to form a weak acid, lowering the pH — the water becomes more acidic. (2.2/LO4)", status: "human_review" },
      { id: "P2.2b-02", type: "truefalse", tier: 1, ref: "2.2/LO4", family: "co2-acidic",
        q: "Adding carbon dioxide to sea water makes it more acidic.",
        answer: true, why: "True. Dissolved CO₂ lowers the pH, making the water more acidic. (2.2/LO4)", status: "human_review" },
      { id: "P2.2b-03", type: "choice", tier: 2, ref: "2.2/LO4", family: "co2-real",
        q: "Bubbling CO₂ into sea water is a lab model of which real-world change?",
        options: ["Ocean acidification", "Rising sea levels", "Upwelling", "Eutrophication"],
        a: 0, why: "Extra CO₂ dissolving in the sea lowers its pH — this is ocean acidification. (2.2/LO4)", status: "human_review" },
      { id: "P2.2b-04", type: "choice", tier: 2, ref: "2.2/LO4", family: "co2-control",
        q: "Why keep a sample of sea water with no CO₂ added?",
        options: ["To act as a control for comparison", "To measure the salinity", "To warm the water", "To add more indicator"],
        a: 0, why: "A control with no CO₂ added shows the change is caused by the carbon dioxide. (2.2/LO4)", status: "human_review" },
      { id: "P2.2b-05", type: "chain", tier: 2, ref: "2.2/LO4", family: "co2-method",
        q: "Put the steps of this investigation in order.",
        chunks: ["Add universal indicator to the sea water and note the pH", "Bubble carbon dioxide through the water", "Watch the indicator colour change", "Record the new pH"],
        why: "Note the starting pH, add CO₂, observe the colour change, then record the lower pH. (2.2/LO4)", status: "human_review" },
    ],
    status: "human_review",
  },
  {
    id: "P2.2c", ref: "2.2/LO6", unit: 2,
    title: "Temperature and the solubility of a solid",
    subtitle: "How temperature changes how much of a solid dissolves",
    aim: "Investigate how temperature affects how much of a solid dissolves in water.",
    apparatus: ["A solid solute (e.g. salt or sugar)", "Water", "Thermometer", "Balance", "Heat source and stirrer"],
    steps: [
      "Measure a fixed volume of water at a set temperature",
      "Add the solid a little at a time, stirring, until no more dissolves (saturated)",
      "Record the mass of solid that dissolved",
      "Repeat at higher temperatures",
    ],
    result: "For most solids, more dissolves as the temperature rises.",
    controls: ["Same volume of water", "Same solid", "Stir the same way each time"],
    technique: [
      "Solids dissolve MORE as temperature rises — the opposite of gases.",
      "'Saturated' means no more will dissolve, not 'full of water'.",
      "Stirring changes the rate of dissolving, not the total amount that dissolves.",
    ],
    items: [
      { id: "P2.2c-01", type: "choice", tier: 1, ref: "2.2/LO6", family: "solid-trend",
        q: "As the temperature of the water rises, the amount of a solid such as salt that dissolves:",
        options: ["increases", "decreases", "stays the same", "falls to zero"],
        a: 0, why: "For most solids, higher temperature means more dissolves. (2.2/LO6)", status: "human_review" },
      { id: "P2.2c-02", type: "truefalse", tier: 1, ref: "2.2/LO6", family: "solid-saturated",
        q: "A saturated solution is one in which no more solute will dissolve.",
        answer: true, why: "True. Saturated means the water is holding all the solute it can at that temperature. (2.2/LO6)", status: "human_review" },
      { id: "P2.2c-03", type: "choice", tier: 2, ref: "2.2/LO6", family: "solid-stir",
        q: "A student stirs the mixture faster and more dissolves in the same time. Stirring has changed the:",
        options: ["rate of dissolving, not the total amount", "total amount that can dissolve", "temperature of the water", "mass of the water"],
        a: 0, why: "Stirring makes the solid dissolve faster, but the total amount that can dissolve is set by the temperature. (2.2/LO6)", status: "human_review" },
      { id: "P2.2c-04", type: "multi", tier: 2, ref: "2.2/LO6", family: "solid-fairtest",
        q: "Which should be kept the same to make this a fair test? Select all that apply.",
        options: ["The volume of water", "The solid being dissolved", "The way the mixture is stirred", "The temperature of the water"],
        a: [0, 1, 2], why: "Volume, solute and stirring are controlled; the temperature is the variable you change, so it is not kept the same. (2.2/LO6)", status: "human_review" },
      { id: "P2.2c-05", type: "chain", tier: 2, ref: "2.2/LO6", family: "solid-method",
        q: "Put the steps of this investigation in order.",
        chunks: ["Measure a fixed volume of water at a set temperature", "Add the solid a little at a time, stirring", "Stop when no more will dissolve (saturated)", "Record the mass that dissolved, then repeat at a higher temperature"],
        why: "Fixed volume, add solid until saturated, record the mass, then repeat hotter. (2.2/LO6)", status: "human_review" },
    ],
    status: "human_review",
  },
  {
    id: "P2.3", ref: "2.3/LO4", unit: 2,
    title: "Temperature and the solubility of a gas",
    subtitle: "How temperature changes how much gas stays dissolved",
    aim: "Investigate how temperature affects how much gas (oxygen) stays dissolved in water.",
    apparatus: ["Water", "Thermometer", "Dissolved-oxygen probe or kit (or observe bubbles)", "Heat source"],
    steps: [
      "Measure the dissolved oxygen (or watch for bubbles) in cool water",
      "Warm the water to a higher temperature",
      "Measure the dissolved oxygen again (or note the bubbles forming)",
      "Record how the dissolved gas changes with temperature",
    ],
    result: "Less gas stays dissolved as the water warms — gas comes out of warm water.",
    controls: ["Same volume and source of water", "Same time for each reading", "Repeat the readings"],
    technique: [
      "Gases dissolve LESS as temperature rises — the opposite of solids.",
      "Bubbles forming on gentle warming are dissolved gas escaping, not the water boiling.",
      "So warmer sea water holds less oxygen for organisms.",
    ],
    items: [
      { id: "P2.3-01", type: "choice", tier: 1, ref: "2.3/LO4", family: "gas-trend",
        q: "As water gets warmer, the amount of oxygen that stays dissolved in it:",
        options: ["decreases", "increases", "stays the same", "doubles"],
        a: 0, why: "Gases become less soluble as temperature rises, so warm water holds less oxygen. (2.3/LO4)", status: "human_review" },
      { id: "P2.3-02", type: "truefalse", tier: 2, ref: "2.3/LO4", family: "gas-vs-solid",
        q: "Solids and gases both become more soluble as temperature rises.",
        answer: false, why: "False — they behave oppositely: most solids dissolve more as it warms, but gases dissolve less. (2.3/LO4)", status: "human_review" },
      { id: "P2.3-03", type: "choice", tier: 2, ref: "2.3/LO4", family: "gas-bubbles",
        q: "Small bubbles appear as the water is warmed, well below boiling. These bubbles are:",
        options: ["dissolved gas escaping from the water", "the water boiling", "salt coming out of solution", "new water being made"],
        a: 0, why: "Warming lowers gas solubility, so dissolved gas comes out as bubbles — the water is not boiling. (2.3/LO4)", status: "human_review" },
      { id: "P2.3-04", type: "choice", tier: 2, ref: "2.3/LO4", family: "gas-consequence",
        q: "Warmer sea water holds less oxygen. For marine animals this means:",
        options: ["less oxygen is available to them", "more oxygen is available to them", "the water becomes saltier", "the water becomes clearer"],
        a: 0, why: "Less dissolved oxygen in warm water means less is available for organisms to use. (2.3/LO4)", status: "human_review" },
      { id: "P2.3-05", type: "chain", tier: 2, ref: "2.3/LO4", family: "gas-method",
        q: "Put the steps of this investigation in order.",
        chunks: ["Measure the dissolved oxygen in cool water", "Warm the water to a higher temperature", "Measure the dissolved oxygen again", "Record how the dissolved gas changed"],
        why: "Measure cool, warm the water, measure again, and record the fall in dissolved gas. (2.3/LO4)", status: "human_review" },
    ],
    status: "human_review",
  },
  {
    id: "P2.4a", ref: "2.4/LO2", unit: 2,
    title: "Temperature and the density of water",
    subtitle: "How temperature changes water's density",
    aim: "Investigate how temperature affects the density of water.",
    apparatus: ["Water at different temperatures", "Measuring cylinder (fixed volume)", "Balance", "Thermometer (or a hydrometer / floating object)"],
    steps: [
      "Measure the mass of a fixed volume of water at a low temperature",
      "Warm the water to a higher temperature",
      "Measure the mass of the same volume again",
      "Compare to see how density changes with temperature",
    ],
    result: "Colder water is denser; density falls as temperature rises.",
    controls: ["Same volume of water each time", "Same salinity", "Same balance and method"],
    technique: [
      "Colder water is denser, so it sinks below warmer water.",
      "Heating spreads the particles out, so the same mass fills a bigger volume → lower density.",
      "Mass does not change on heating — the volume does.",
    ],
    items: [
      { id: "P2.4a-01", type: "choice", tier: 1, ref: "2.4/LO2", family: "tempdens-trend",
        q: "Compared with warm water, cold water is:",
        options: ["denser", "less dense", "the same density", "always frozen"],
        a: 0, why: "Colder water is denser, which is why it sinks below warmer water. (2.4/LO2)", status: "human_review" },
      { id: "P2.4a-02", type: "truefalse", tier: 2, ref: "2.4/LO2", family: "tempdens-mass",
        q: "Heating water increases its mass.",
        answer: false, why: "False. Heating spreads the particles out so the same mass fills a bigger volume (lower density); the mass itself is unchanged. (2.4/LO2)", status: "human_review" },
      { id: "P2.4a-03", type: "choice", tier: 2, ref: "2.4/LO2", family: "tempdens-why",
        q: "Why does warming water lower its density?",
        options: ["The particles spread out, so the same mass fills a bigger volume", "The particles get heavier", "Water is lost as steam", "Salt is added"],
        a: 0, why: "Density = mass ÷ volume; warming increases the volume for the same mass, so density falls. (2.4/LO2)", status: "human_review" },
      { id: "P2.4a-04", type: "choice", tier: 2, ref: "2.4/LO2", family: "tempdens-control",
        q: "Which must be kept the same to compare density fairly?",
        options: ["The volume of water measured", "The temperature of the water", "The colour of the water", "The time of day"],
        a: 0, why: "You compare the mass of the same volume; temperature is the variable being changed. (2.4/LO2)", status: "human_review" },
      { id: "P2.4a-05", type: "chain", tier: 2, ref: "2.4/LO2", family: "tempdens-method",
        q: "Put the steps of this investigation in order.",
        chunks: ["Measure the mass of a fixed volume of cold water", "Warm the water to a higher temperature", "Measure the mass of the same volume again", "Compare to see how density changed"],
        why: "Weigh a fixed volume cold, warm it, weigh the same volume again, and compare. (2.4/LO2)", status: "human_review" },
    ],
    status: "human_review",
  },
  {
    id: "P2.4b", ref: "2.4/LO3", unit: 2,
    title: "Salinity and the density of water",
    subtitle: "How salt content changes water's density",
    aim: "Investigate how salinity affects the density of water.",
    apparatus: ["Solutions of different known salinity", "Measuring cylinder (fixed volume)", "Balance (or float an egg/object; or layer coloured solutions)"],
    steps: [
      "Make up solutions of different salinity",
      "Measure the mass of an equal volume of each",
      "Compare the masses (or see which one an object floats highest in)",
      "Record how density changes with salinity",
    ],
    result: "Saltier water is denser; density rises with salinity.",
    controls: ["Equal volumes", "Same temperature", "Same test object, if floating one"],
    technique: [
      "Adding salt adds mass to the same volume, so density rises.",
      "Salt doesn't disappear when it dissolves — its mass is still there.",
      "An object floats higher in saltier (denser) water.",
    ],
    items: [
      { id: "P2.4b-01", type: "choice", tier: 1, ref: "2.4/LO3", family: "saldens-trend",
        q: "As the salinity of water increases, its density:",
        options: ["increases", "decreases", "stays the same", "falls to zero"],
        a: 0, why: "More dissolved salt adds mass to the same volume, so density rises with salinity. (2.4/LO3)", status: "human_review" },
      { id: "P2.4b-02", type: "truefalse", tier: 1, ref: "2.4/LO3", family: "saldens-float",
        q: "An object floats higher in salty water than in fresh water.",
        answer: true, why: "True. Salty water is denser, so it pushes up on the object more and it floats higher. (2.4/LO3)", status: "human_review" },
      { id: "P2.4b-03", type: "choice", tier: 2, ref: "2.4/LO3", family: "saldens-mass",
        q: "Salt dissolves in water. The mass of the salt:",
        options: ["is still there, adding to the water's mass", "disappears completely", "turns into water", "leaves the container"],
        a: 0, why: "Dissolving spreads the salt out but doesn't destroy it; its mass still counts, raising the density. (2.4/LO3)", status: "human_review" },
      { id: "P2.4b-04", type: "choice", tier: 2, ref: "2.4/LO3", family: "saldens-control",
        q: "Why keep the temperature the same when testing salinity and density?",
        options: ["Temperature also changes density, so it must be controlled", "To make the salt dissolve", "To keep the object dry", "It doesn't matter"],
        a: 0, why: "Temperature affects density too, so it is controlled to isolate the effect of salinity. (2.4/LO3)", status: "human_review" },
      { id: "P2.4b-05", type: "chain", tier: 2, ref: "2.4/LO3", family: "saldens-method",
        q: "Put the steps of this investigation in order.",
        chunks: ["Make up solutions of different salinity", "Measure the mass of an equal volume of each", "Compare the masses (or floating heights)", "Record how density changed with salinity"],
        why: "Make salinities, weigh equal volumes, compare, and record the rise in density. (2.4/LO3)", status: "human_review" },
    ],
    status: "human_review",
  },
  {
    id: "P2.5", ref: "2.5/LO3", unit: 2,
    title: "Measuring water clarity with a Secchi disc",
    subtitle: "Measure how far light penetrates the water",
    aim: "Measure water clarity (light penetration) using a Secchi disc.",
    apparatus: ["A Secchi disc (white, or black-and-white)", "A marked line or rope"],
    steps: [
      "Lower the Secchi disc into the water on a marked line",
      "Note the depth at which it just disappears from view",
      "Raise it slightly until it just reappears, and take the average depth",
      "Repeat and record the Secchi depth",
    ],
    result: "The Secchi depth — a greater depth means clearer water and deeper light penetration.",
    controls: ["Same observer each time", "Same shaded side of the boat/shore, away from glare", "Same time of day; repeat and average"],
    technique: [
      "A bigger Secchi depth means clearer water (more light penetration), not murkier.",
      "It measures clarity, not the depth of the water, salinity or temperature.",
      "Using the same observer and shade reduces differences between readings.",
    ],
    items: [
      { id: "P2.5-01", type: "choice", tier: 1, ref: "2.5/LO3", family: "secchi-what",
        q: "A Secchi disc measures:",
        options: ["water clarity (how far light penetrates)", "the depth of the sea", "the salinity of the water", "the temperature of the water"],
        a: 0, why: "The depth at which the disc disappears measures how far light penetrates — the water's clarity. (2.5/LO3)", status: "human_review" },
      { id: "P2.5-02", type: "choice", tier: 1, ref: "2.5/LO3", family: "secchi-read",
        q: "A larger Secchi depth means the water is:",
        options: ["clearer", "murkier", "saltier", "warmer"],
        a: 0, why: "If the disc is still visible deep down, light is penetrating far, so the water is clearer. (2.5/LO3)", status: "human_review" },
      { id: "P2.5-03", type: "truefalse", tier: 2, ref: "2.5/LO3", family: "secchi-observer",
        q: "Using the same observer for every reading makes the results more reliable.",
        answer: true, why: "True. Different people judge the disappearing point differently, so one observer keeps readings consistent. (2.5/LO3)", status: "human_review" },
      { id: "P2.5-04", type: "choice", tier: 2, ref: "2.5/LO3", family: "secchi-shade",
        q: "Why take the reading in the shade, away from glare?",
        options: ["Glare makes the disappearing depth harder to judge", "Shade cools the water", "Glare adds salt", "To measure the temperature"],
        a: 0, why: "Surface glare makes it hard to see exactly where the disc vanishes, so shade gives a fairer reading. (2.5/LO3)", status: "human_review" },
      { id: "P2.5-05", type: "chain", tier: 2, ref: "2.5/LO3", family: "secchi-method",
        q: "Put the steps of using a Secchi disc in order.",
        chunks: ["Lower the disc on a marked line", "Note the depth where it just disappears", "Raise it until it just reappears and average the two", "Repeat and record the Secchi depth"],
        why: "Lower until it vanishes, raise until it reappears, average, then repeat for reliability. (2.5/LO3)", status: "human_review" },
    ],
    status: "human_review",
  },

  /* ============================ UNIT 3 ============================ */
  {
    id: "P3.4a", ref: "3.4/LO5", unit: 3,
    title: "Choosing how to view a specimen",
    subtitle: "Pick the right tool: hand lens, microscope or photograph",
    aim: "Choose a suitable instrument to identify and compare specimens.",
    apparatus: ["Hand lens", "Light microscope with a prepared slide", "Photographs"],
    steps: [
      "Use a hand lens or a photograph for whole organisms and external features",
      "Use a light microscope with a thin section on a slide to see cells",
      "Compare specimens using classification features, not colour, size or where they were found",
    ],
    result: "The specimen identified or compared using suitable equipment and classification features.",
    controls: ["Match the instrument to the scale of what you want to see"],
    technique: [
      "Hand lens or photo for whole organisms; light microscope for cells.",
      "Compare by classification features (body plan, symmetry, appendages), not colour or size.",
      "A hand lens cannot show individual cells.",
    ],
    items: [
      { id: "P3.4a-01", type: "match", tier: 1, ref: "3.4/LO5", family: "view-tool",
        q: "Match each task to the best tool.",
        pairs: [["See the cells in a thin slice of tissue", "Light microscope"], ["Look at the external features of a whole crab", "Hand lens"], ["Identify an animal from a picture", "Photograph"]],
        why: "Cells need a microscope; whole-organism external features suit a hand lens; a photo can be used to identify from a picture. (3.4/LO5)", status: "human_review" },
      { id: "P3.4a-02", type: "choice", tier: 1, ref: "3.4/LO5", family: "view-cells",
        q: "To see individual cells you would use a:",
        options: ["light microscope", "hand lens", "photograph", "naked eye"],
        a: 0, why: "Only a light microscope, with a thin section on a slide, magnifies enough to show cells. (3.4/LO5)", status: "human_review" },
      { id: "P3.4a-03", type: "truefalse", tier: 2, ref: "3.4/LO5", family: "view-lens",
        q: "A hand lens is powerful enough to show individual cells.",
        answer: false, why: "False. A hand lens shows external features of whole organisms; cells need a microscope. (3.4/LO5)", status: "human_review" },
      { id: "P3.4a-04", type: "choice", tier: 2, ref: "3.4/LO5", family: "view-compare",
        q: "When comparing two specimens to classify them, you should compare their:",
        options: ["classification features, such as body plan and appendages", "colour only", "size only", "the place they were found"],
        a: 0, why: "Classification uses body features; colour, size and habitat can vary within a group and mislead. (3.4/LO5)", status: "human_review" },
      { id: "P3.4a-05", type: "choice", tier: 2, ref: "3.4/LO5", family: "view-whole",
        q: "Which is the best tool for studying the external features of a whole starfish?",
        options: ["A hand lens", "A light microscope with a slide", "A dissolved-oxygen probe", "A Secchi disc"],
        a: 0, why: "A hand lens is right for the external features of a whole organism. (3.4/LO5)", status: "human_review" },
    ],
    status: "human_review",
  },
  {
    id: "P3.4b", ref: "3.4/LO6", unit: 3,
    title: "Making a biological drawing",
    subtitle: "Draw a specimen using the standard conventions",
    aim: "Observe and draw a structure or whole specimen using correct biological-drawing conventions.",
    apparatus: ["Sharp pencil", "Plain paper", "Ruler", "Eraser"],
    steps: [
      "Draw large, filling the space",
      "Use clear, single, unbroken lines with a sharp pencil",
      "Show correct proportions and positions; draw only what you see",
      "Add straight, ruled label lines that touch each feature",
    ],
    result: "A clear biological drawing that follows the standard conventions.",
    controls: ["Draw only what is actually seen", "Keep proportions and positions correct"],
    technique: [
      "No shading and no colour in a biological drawing.",
      "Draw only what is seen — not extra detail like every scale.",
      "Label lines are ruled straight and touch the feature.",
    ],
    items: [
      { id: "P3.4b-01", type: "multi", tier: 1, ref: "3.4/LO6", family: "draw-rules",
        q: "Which are rules for a biological drawing? Select all that apply.",
        options: ["Draw large, filling the space", "Use single, unbroken lines", "Use ruled label lines that touch the feature", "Add shading to show depth", "Colour it in to look realistic"],
        a: [0, 1, 2], why: "Large, single clean lines and ruled labels are correct; shading and colour are not used in a biological drawing. (3.4/LO6)", status: "human_review" },
      { id: "P3.4b-02", type: "truefalse", tier: 1, ref: "3.4/LO6", family: "draw-shade",
        q: "A biological drawing should be shaded to show depth.",
        answer: false, why: "False. Biological drawings use clear single lines with no shading and no colour. (3.4/LO6)", status: "human_review" },
      { id: "P3.4b-03", type: "choice", tier: 2, ref: "3.4/LO6", family: "draw-labels",
        q: "Label lines on a biological drawing should be:",
        options: ["ruled straight and touching the feature", "curved and roughly near the feature", "drawn freehand with arrowheads", "left off to keep it neat"],
        a: 0, why: "Labels are ruled straight lines that touch the exact feature they name. (3.4/LO6)", status: "human_review" },
      { id: "P3.4b-04", type: "choice", tier: 2, ref: "3.4/LO6", family: "draw-observed",
        q: "In a biological drawing you should draw:",
        options: ["only what you actually see", "every scale and detail from memory", "a bigger, more colourful version", "the animal from a textbook instead"],
        a: 0, why: "You record only what is actually observed, not remembered or invented detail. (3.4/LO6)", status: "human_review" },
      { id: "P3.4b-05", type: "choice", tier: 2, ref: "3.4/LO6", family: "draw-tool",
        q: "A good biological drawing uses:",
        options: ["a sharp pencil with clear single lines", "a soft shaded style", "coloured pens", "a rough, sketchy outline"],
        a: 0, why: "A sharp pencil gives the clean single lines the conventions require. (3.4/LO6)", status: "human_review" },
    ],
    status: "human_review",
  },
  {
    id: "P3.4c", ref: "3.4/LO8", unit: 3,
    title: "Using a dichotomous key",
    subtitle: "Identify organisms with paired either/or questions",
    aim: "Construct and use a dichotomous key to identify organisms.",
    apparatus: ["A dichotomous key", "The specimens or pictures to identify"],
    steps: [
      "Start at the first pair of statements",
      "Choose the statement that matches a visible feature of the organism",
      "Follow it to the next pair of statements",
      "Continue until you reach the name of the organism",
    ],
    result: "The organism identified by following the key's paired choices.",
    controls: ["Use clear, observable features at each step"],
    technique: [
      "A dichotomous key is a series of paired either/or questions.",
      "Use clear, observable features (present/absent), not opinions like 'pretty' or 'big'.",
      "Each step splits the remaining group into two.",
    ],
    items: [
      { id: "P3.4c-01", type: "choice", tier: 1, ref: "3.4/LO8", family: "key-what",
        q: "A dichotomous key works by asking a series of:",
        options: ["paired either/or questions about visible features", "questions about where the animal lives", "random questions", "questions about the animal's name"],
        a: 0, why: "At each step you choose between two statements about a visible feature, narrowing down to the name. (3.4/LO8)", status: "human_review" },
      { id: "P3.4c-02", type: "truefalse", tier: 1, ref: "3.4/LO8", family: "key-split",
        q: "Each step of a dichotomous key splits the group into two.",
        answer: true, why: "True. 'Dichotomous' means each choice divides the remaining organisms into two branches. (3.4/LO8)", status: "human_review" },
      { id: "P3.4c-03", type: "choice", tier: 2, ref: "3.4/LO8", family: "key-feature",
        q: "Which is the best feature to use in a dichotomous key?",
        options: ["Has a shell / does not have a shell", "Looks pretty / looks ugly", "Is interesting / is boring", "Is common / is rare"],
        a: 0, why: "Good key features are clearly observable and either present or absent — not matters of opinion. (3.4/LO8)", status: "human_review" },
      { id: "P3.4c-04", type: "chain", tier: 2, ref: "3.4/LO8", family: "key-method",
        q: "Put the steps of using a dichotomous key in order.",
        chunks: ["Start at the first pair of statements", "Pick the statement that matches the organism", "Follow it to the next pair", "Reach the name of the organism"],
        why: "Begin at the first pair, choose the matching statement, follow it on, and repeat until named. (3.4/LO8)", status: "human_review" },
      { id: "P3.4c-05", type: "choice", tier: 2, ref: "3.4/LO8", family: "key-good",
        q: "Good key questions are based on features that are:",
        options: ["clearly observable, like present or absent", "a matter of opinion", "about the habitat only", "about the colour only"],
        a: 0, why: "Clear present/absent features give a reliable path through the key. (3.4/LO8)", status: "human_review" },
    ],
    status: "human_review",
  },

  /* ============================ UNIT 4 ============================ */
  {
    id: "P4.2", ref: "4.2/LO5", unit: 4,
    title: "Burning food to measure energy",
    subtitle: "Compare the energy in foods by heating water",
    aim: "Compare the energy stored in foods by burning them to heat water.",
    apparatus: ["Food sample on a mounted needle", "Boiling tube of measured water", "Thermometer", "Balance", "Clamp and stand"],
    steps: [
      "Measure the mass of the food and a fixed volume of water",
      "Record the starting temperature of the water",
      "Set light to the food and hold it under the boiling tube of water",
      "Record the highest temperature the water reaches",
    ],
    result: "The temperature rise measures the energy released; a bigger rise means more energy (compare per gram).",
    controls: ["Same volume of water", "Same distance from food to tube", "Same starting temperature", "Compare energy per gram of food"],
    improvements: ["Shield the apparatus to cut heat loss", "Relight the food if it goes out", "Repeat and take a mean"],
    technique: [
      "The temperature rise shows the energy released; burning doesn't destroy energy.",
      "Compare foods per gram, not per piece.",
      "Heat lost to the surroundings makes the measured value too low.",
    ],
    items: [
      { id: "P4.2-01", type: "choice", tier: 1, ref: "4.2/LO5", family: "burn-measure",
        q: "In the burning-food experiment, what is measured to compare the energy in foods?",
        options: ["The temperature rise of the water", "The mass of ash left", "The colour of the flame", "The time taken to light"],
        a: 0, why: "The burning food heats the water; the temperature rise measures the energy released. (4.2/LO5)", status: "human_review" },
      { id: "P4.2-02", type: "truefalse", tier: 2, ref: "4.2/LO5", family: "burn-loss",
        q: "Some heat is lost to the surroundings, so the measured energy is lower than the true value.",
        answer: true, why: "True. Heat escapes to the air and the glass, so the temperature rise — and the energy found — is an underestimate. (4.2/LO5)", status: "human_review" },
      { id: "P4.2-03", type: "multi", tier: 2, ref: "4.2/LO5", family: "burn-fairtest",
        q: "Which should be controlled to make it a fair test? Select all that apply.",
        options: ["The volume of water heated", "The distance from the food to the tube", "The starting temperature of the water", "The type of food being burned"],
        a: [0, 1, 2], why: "Water volume, distance and starting temperature are controlled; the type of food is the variable you are comparing. (4.2/LO5)", status: "human_review" },
      { id: "P4.2-04", type: "choice", tier: 2, ref: "4.2/LO5", family: "burn-incomplete",
        q: "The food does not burn completely. This makes the temperature rise:",
        options: ["smaller than it should be", "larger than it should be", "exactly correct", "impossible to read"],
        a: 0, why: "If not all the food burns, less energy is released, so the water warms less than it should. (4.2/LO5)", status: "human_review" },
      { id: "P4.2-05", type: "chain", tier: 2, ref: "4.2/LO5", family: "burn-method",
        q: "Put the steps of the burning-food experiment in order.",
        chunks: ["Measure the mass of food and a fixed volume of water", "Record the starting temperature of the water", "Set light to the food under the tube of water", "Record the highest temperature the water reaches"],
        why: "Weigh the food and water, note the start temperature, burn the food under the tube, then read the highest temperature. (4.2/LO5)", status: "human_review" },
      { id: "P4.2-06", type: "exam", tier: 3, ref: "4.2/LO5", family: "burn-describe",
        q: "Describe how to compare the energy in two foods by burning them, including one way to make the results reliable.",
        check: ["measure a fixed volume of water and record its starting temperature", "burn a known mass of the food under the tube of water", "record the highest temperature the water reaches", "the bigger the temperature rise, the more energy the food released", "repeat and take a mean (or shield the apparatus to reduce heat loss)"],
        distractors: ["weigh the ash left behind to find the energy", "measure how long the food takes to catch fire", "a colour change in the water shows the energy", "cool the water first with ice"],
        why: "Heat a measured volume of water with a known mass of burning food, use the temperature rise as the energy measure, and repeat / shield to improve reliability. (4.2/LO5)", status: "human_review" },
    ],
    status: "human_review",
  },
  {
    id: "P4.3", ref: "4.3/LO6", unit: 4,
    title: "Light intensity and photosynthesis",
    subtitle: "How light level changes the rate of photosynthesis",
    aim: "Investigate how light intensity affects the rate of photosynthesis.",
    apparatus: ["An aquatic plant in a tube of water", "A lamp", "A ruler", "A timer", "A water bath"],
    steps: [
      "Place the aquatic plant, cut end up, in a tube of water",
      "Set the lamp a measured distance away",
      "Count the bubbles of gas given off in a set time",
      "Move the lamp further away and repeat at each distance",
    ],
    result: "Fewer bubbles as the lamp moves away — lower light intensity gives a slower rate.",
    controls: ["Temperature (stand the tube in a water bath, since the lamp heats it)", "Same plant and same length of time", "Same CO₂ supply", "Let the plant adjust after moving the lamp; repeat and mean"],
    improvements: ["Collect the gas and measure its volume, since bubble size varies"],
    technique: [
      "Moving the lamp away lowers the light intensity, which slows photosynthesis.",
      "A water bath keeps temperature constant so light is the only variable.",
      "The bubbles are oxygen from photosynthesis, not respiration.",
    ],
    items: [
      { id: "P4.3-01", type: "choice", tier: 1, ref: "4.3/LO6", family: "photo-measure",
        q: "In this experiment, the rate of photosynthesis is measured by:",
        options: ["counting the bubbles of gas given off in a set time", "weighing the plant", "measuring the water temperature", "timing how long the lamp is on"],
        a: 0, why: "The plant releases oxygen bubbles; counting them per set time measures the rate. (4.3/LO6)", status: "human_review" },
      { id: "P4.3-02", type: "choice", tier: 1, ref: "4.3/LO6", family: "photo-trend",
        q: "As the lamp is moved further from the plant, the number of bubbles:",
        options: ["decreases", "increases", "stays the same", "rises then stays high"],
        a: 0, why: "Further away means lower light intensity, so photosynthesis slows and fewer bubbles form. (4.3/LO6)", status: "human_review" },
      { id: "P4.3-03", type: "choice", tier: 2, ref: "4.3/LO6", family: "photo-waterbath",
        q: "Why stand the tube in a water bath?",
        options: ["To keep the temperature constant, since the lamp heats the water", "To add carbon dioxide", "To make more bubbles", "To measure salinity"],
        a: 0, why: "The lamp warms the water; a water bath holds the temperature steady so light is the only variable changing. (4.3/LO6)", status: "human_review" },
      { id: "P4.3-04", type: "truefalse", tier: 2, ref: "4.3/LO6", family: "photo-oxygen",
        q: "The bubbles collected in this experiment are oxygen from photosynthesis.",
        answer: true, why: "True. In the light, the plant photosynthesises and releases oxygen as the bubbles. (4.3/LO6)", status: "human_review" },
      { id: "P4.3-05", type: "multi", tier: 2, ref: "4.3/LO6", family: "photo-controls",
        q: "Which are controlled variables in this experiment? Select all that apply.",
        options: ["The temperature of the water", "The same piece of plant", "The length of time bubbles are counted", "The distance of the lamp from the plant"],
        a: [0, 1, 2], why: "Temperature, the plant and the counting time are controlled; the lamp distance (light intensity) is the variable you change. (4.3/LO6)", status: "human_review" },
      { id: "P4.3-06", type: "chain", tier: 2, ref: "4.3/LO6", family: "photo-method",
        q: "Put the steps of this experiment in order.",
        chunks: ["Place the plant, cut end up, in a tube of water", "Set the lamp a measured distance away", "Count the bubbles given off in a set time", "Move the lamp further away and repeat"],
        why: "Set up the plant, place the lamp, count bubbles per set time, then repeat at greater distances. (4.3/LO6)", status: "human_review" },
    ],
    status: "human_review",
  },

  /* ============================ UNIT 5 ============================ */
  {
    id: "P5.2a", ref: "5.2/LO1", unit: 5,
    title: "Random sampling with quadrats",
    subtitle: "Estimate population size and species richness",
    aim: "Estimate population size and species richness using random quadrat sampling.",
    apparatus: ["A quadrat", "Two tape measures", "A source of random numbers", "An identification chart"],
    steps: [
      "Lay two tapes at right angles to make a grid over the area",
      "Use random numbers to pick coordinates for each quadrat",
      "Count the organisms (or % cover) in each quadrat",
      "Repeat many times, find the mean, then scale up to the whole area",
    ],
    result: "An estimate of population size (mean per quadrat × area) and species richness (number of different species).",
    controls: ["Random placement to remove sampler bias", "More quadrats for a more reliable mean", "Same size quadrat throughout"],
    technique: [
      "'Random' means chosen by random numbers, not spread out evenly by eye.",
      "Species richness = the number of different species, not the total count.",
      "More quadrats → a more reliable estimate.",
    ],
    items: [
      { id: "P5.2a-01", type: "choice", tier: 1, ref: "5.2/LO1", family: "quad-random",
        q: "Quadrats are placed using random numbers in order to:",
        options: ["remove bias in where they are placed", "spread them out evenly", "count every organism", "measure the shore slope"],
        a: 0, why: "Random coordinates stop the sampler unconsciously choosing 'good' spots, removing bias. (5.2/LO1)", status: "human_review" },
      { id: "P5.2a-02", type: "choice", tier: 1, ref: "5.2/LO1", family: "quad-richness",
        q: "Species richness means:",
        options: ["the number of different species present", "the total number of organisms", "the biggest species present", "the rarest species present"],
        a: 0, why: "Richness counts how many different species there are, not how many individuals. (5.2/LO1)", status: "human_review" },
      { id: "P5.2a-03", type: "truefalse", tier: 2, ref: "5.2/LO1", family: "quad-meaning",
        q: "'Random' placement means spacing the quadrats out evenly across the area.",
        answer: false, why: "False. Even spacing is systematic; random means positions chosen by random numbers. (5.2/LO1)", status: "human_review" },
      { id: "P5.2a-04", type: "choice", tier: 2, ref: "5.2/LO1", family: "quad-reliable",
        q: "How do you make the population estimate more reliable?",
        options: ["Take more quadrat samples", "Use one large count", "Choose the best-looking spots", "Count faster"],
        a: 0, why: "More quadrats give a more representative mean, so the scaled-up estimate is more reliable. (5.2/LO1)", status: "human_review" },
      { id: "P5.2a-05", type: "chain", tier: 2, ref: "5.2/LO1", family: "quad-method",
        q: "Put the steps of random quadrat sampling in order.",
        chunks: ["Lay two tapes to make a grid over the area", "Use random numbers to choose quadrat positions", "Count the organisms in each quadrat", "Find the mean and scale up to the whole area"],
        why: "Grid the area, place quadrats at random coordinates, count, then average and scale up. (5.2/LO1)", status: "human_review" },
    ],
    status: "human_review",
  },
  {
    id: "P5.2b", ref: "5.2/LO2", unit: 5,
    title: "Transects",
    subtitle: "Show how organisms are distributed along a gradient",
    aim: "Investigate how organisms are distributed along a gradient using transects.",
    apparatus: ["A tape measure (the transect line)", "A quadrat (for a belt transect)", "An identification chart"],
    steps: [
      "Lay a tape in a straight line down the gradient (e.g. top of the shore to the sea)",
      "For a line transect, record the organisms touching the tape at set intervals",
      "For a belt transect, place a quadrat at set intervals and count inside it",
      "Record how the organisms change along the transect",
    ],
    result: "The distribution of organisms along the gradient (not the total population).",
    controls: ["Systematic (set-interval) placement, not random", "Same interval spacing", "Same quadrat size for a belt transect"],
    technique: [
      "Transects are placed systematically (set intervals), not randomly.",
      "A transect shows distribution/change along a gradient, not the total population.",
      "Use random quadrats for population size; use transects for distribution.",
    ],
    items: [
      { id: "P5.2b-01", type: "choice", tier: 1, ref: "5.2/LO2", family: "trans-what",
        q: "A transect is used to show:",
        options: ["how organisms are distributed along a gradient", "the total population of the shore", "the salinity of the water", "the pH of the sand"],
        a: 0, why: "A transect reveals how species change along a gradient, such as up a shore. (5.2/LO2)", status: "human_review" },
      { id: "P5.2b-02", type: "choice", tier: 1, ref: "5.2/LO2", family: "trans-place",
        q: "Quadrats along a transect are placed:",
        options: ["systematically, at set intervals", "randomly, using random numbers", "only where organisms are seen", "all at the same point"],
        a: 0, why: "Belt-transect quadrats go at fixed intervals so you can see the change along the line. (5.2/LO2)", status: "human_review" },
      { id: "P5.2b-03", type: "truefalse", tier: 2, ref: "5.2/LO2", family: "trans-total",
        q: "A transect gives the total number of organisms on the whole shore.",
        answer: false, why: "False. A transect shows distribution along a line; random quadrats are used to estimate the total population. (5.2/LO2)", status: "human_review" },
      { id: "P5.2b-04", type: "match", tier: 2, ref: "5.2/LO2", family: "trans-vs-quad",
        q: "Match each method to what it is best for.",
        pairs: [["Transect", "Distribution along a gradient"], ["Random quadrats", "Estimating population size"]],
        why: "Transects show how organisms change along a gradient; random quadrats estimate population size. (5.2/LO2)", status: "human_review" },
      { id: "P5.2b-05", type: "chain", tier: 2, ref: "5.2/LO2", family: "trans-method",
        q: "Put the steps of a belt transect in order.",
        chunks: ["Lay a tape down the gradient", "Place a quadrat at the first set interval", "Count the organisms inside the quadrat", "Move along at set intervals and record the change"],
        why: "Lay the line, place a quadrat at each set interval, count, and record how the community changes along it. (5.2/LO2)", status: "human_review" },
    ],
    status: "human_review",
  },
  {
    id: "P5.2c", ref: "5.2/LO3", unit: 5,
    title: "Measuring a shore profile",
    subtitle: "Measure the slope of a shore",
    aim: "Measure the profile (slope) of a shore or slope.",
    apparatus: ["A tape measure", "Two ranging poles", "A clinometer"],
    steps: [
      "Run a tape from the low-water mark up the shore",
      "At each point where the slope changes, stand a ranging pole",
      "Measure the distance between the two poles and the angle between them with a clinometer",
      "Repeat up the shore and draw the profile to scale",
    ],
    result: "A scale drawing of the shore's slope (its profile).",
    controls: ["Sight the clinometer between the same height mark on both poles", "Measure a new section wherever the slope changes", "Keep the line of sight parallel to the ground"],
    technique: [
      "Sight between the same height mark on both poles, not from the ground.",
      "Measure a new section whenever the slope changes.",
      "A clinometer measures the angle of the slope.",
    ],
    items: [
      { id: "P5.2c-01", type: "choice", tier: 1, ref: "5.2/LO3", family: "prof-clino",
        q: "A clinometer is used to measure the:",
        options: ["angle of the slope", "depth of the water", "salinity", "number of species"],
        a: 0, why: "A clinometer reads the angle of each section of the slope. (5.2/LO3)", status: "human_review" },
      { id: "P5.2c-02", type: "truefalse", tier: 2, ref: "5.2/LO3", family: "prof-sight",
        q: "You should sight the clinometer between the same height mark on both ranging poles.",
        answer: true, why: "True. Sighting between the same marks keeps the line of sight parallel to the ground, so the angle is correct. (5.2/LO3)", status: "human_review" },
      { id: "P5.2c-03", type: "choice", tier: 2, ref: "5.2/LO3", family: "prof-section",
        q: "A new section of the profile is measured whenever:",
        options: ["the slope of the shore changes", "an animal is seen", "the tide comes in", "the tape runs out"],
        a: 0, why: "Each change in gradient is a new section, so the profile follows the real shape of the shore. (5.2/LO3)", status: "human_review" },
      { id: "P5.2c-04", type: "choice", tier: 2, ref: "5.2/LO3", family: "prof-poles",
        q: "The two ranging poles are used to:",
        options: ["mark the ends of each section of slope", "catch organisms", "measure salinity", "hold the tape down"],
        a: 0, why: "The poles mark the two ends of a section so the distance and angle can be measured between them. (5.2/LO3)", status: "human_review" },
      { id: "P5.2c-05", type: "chain", tier: 2, ref: "5.2/LO3", family: "prof-method",
        q: "Put the steps of measuring a shore profile in order.",
        chunks: ["Run a tape from the low-water mark up the shore", "Stand a ranging pole where the slope changes", "Measure the distance and angle to the next pole", "Repeat up the shore and draw the profile to scale"],
        why: "Lay the tape, mark each slope change with poles, measure distance and angle per section, then draw to scale. (5.2/LO3)", status: "human_review" },
    ],
    status: "human_review",
  },
  {
    id: "P5.2d", ref: "5.2/LO4", unit: 5,
    title: "Measuring sediment particle size",
    subtitle: "Compare the particle sizes of sediments",
    aim: "Compare the particle sizes of sediments from different sites.",
    apparatus: ["Dried sediment of known mass", "A stack of sieves of decreasing mesh", "A balance", "A ruler or callipers"],
    steps: [
      "Dry the sediment first so the particles do not clump",
      "Pour a known mass through a stack of sieves with the smallest mesh at the bottom",
      "Weigh the sediment caught on each sieve",
      "Measure any very large particles with a ruler or callipers",
    ],
    result: "The size distribution of the particles — which sizes make up the sample.",
    controls: ["Same mass of dried sediment", "Same set of sieves", "Dry each sample the same way"],
    technique: [
      "Dry the sediment first so particles don't clump together.",
      "The mass caught on each sieve shows the size distribution.",
      "Sieving measures particle size, not moisture.",
    ],
    items: [
      { id: "P5.2d-01", type: "choice", tier: 1, ref: "5.2/LO4", family: "sieve-what",
        q: "Sediment is passed through a stack of sieves to find its:",
        options: ["particle-size distribution", "moisture content", "salinity", "pH"],
        a: 0, why: "The mass caught on each mesh shows how the particle sizes are distributed. (5.2/LO4)", status: "human_review" },
      { id: "P5.2d-02", type: "choice", tier: 1, ref: "5.2/LO4", family: "sieve-dry",
        q: "Why is the sediment dried before sieving?",
        options: ["So the particles do not clump together", "To add mass", "To measure the water content", "To kill organisms"],
        a: 0, why: "Damp particles stick together, so drying first lets them separate by size properly. (5.2/LO4)", status: "human_review" },
      { id: "P5.2d-03", type: "truefalse", tier: 2, ref: "5.2/LO4", family: "sieve-moisture",
        q: "Sieving sediment measures how much water it contains.",
        answer: false, why: "False. Sieving sorts particles by size; the water content is found by drying and weighing (a different practical). (5.2/LO4)", status: "human_review" },
      { id: "P5.2d-04", type: "choice", tier: 2, ref: "5.2/LO4", family: "sieve-stack",
        q: "In the sieve stack, the sieve with the smallest mesh goes:",
        options: ["at the bottom", "at the top", "in the middle", "it does not matter"],
        a: 0, why: "Large particles are caught high up and the finest at the bottom, so the smallest mesh sits at the base. (5.2/LO4)", status: "human_review" },
      { id: "P5.2d-05", type: "chain", tier: 2, ref: "5.2/LO4", family: "sieve-method",
        q: "Put the steps of the sieving method in order.",
        chunks: ["Dry the sediment so it does not clump", "Pour a known mass into the stack of sieves", "Weigh the sediment caught on each sieve", "Measure any very large particles with callipers"],
        why: "Dry, pour a known mass through the sieves, weigh each fraction, and measure oversized particles separately. (5.2/LO4)", status: "human_review" },
    ],
    status: "human_review",
  },
  {
    id: "P5.2e", ref: "5.2/LO5", unit: 5,
    title: "Measuring sediment moisture content",
    subtitle: "Find the percentage of water in a sediment",
    aim: "Measure the water (moisture) content of a sediment sample.",
    apparatus: ["A sediment sample", "A balance", "An oven or gentle heat source (~105 °C)"],
    steps: [
      "Weigh a known mass of the fresh sediment",
      "Heat it gently until its mass stops changing",
      "Weigh the dried sediment",
      "Water content = start mass − end mass; % water = water ÷ start × 100",
    ],
    result: "The mass (and percentage) of water the sediment contained.",
    controls: ["Same mass, depth and tide/time for each sample", "Random sampling of each site", "Repeat and take a mean"],
    technique: [
      "Heat until the mass is constant, not for a fixed time.",
      "% water = water lost ÷ starting mass × 100.",
      "Heat gently so organic matter isn't burned away.",
    ],
    items: [
      { id: "P5.2e-01", type: "chain", tier: 2, ref: "5.2/LO5", family: "moist-method",
        q: "Put the steps of measuring moisture content in order.",
        chunks: ["Weigh a known mass of fresh sediment", "Heat it gently until the mass stops changing", "Weigh the dried sediment", "Work out the water lost and the % water"],
        why: "Weigh wet, dry to constant mass, weigh dry, then find the water lost and the percentage. (5.2/LO5)", status: "human_review" },
      { id: "P5.2e-02", type: "choice", tier: 1, ref: "5.2/LO5", family: "moist-what",
        q: "The water content of the sediment is found from:",
        options: ["the loss in mass after drying", "the mass gained after drying", "the colour of the sediment", "the volume of the sediment"],
        a: 0, why: "The mass lost on drying is the water that has evaporated away. (5.2/LO5)", status: "human_review" },
      { id: "P5.2e-03", type: "truefalse", tier: 2, ref: "5.2/LO5", family: "moist-constant",
        q: "You heat the sediment until its mass stops changing, not for a fixed time.",
        answer: true, why: "True. Constant mass means all the water has gone; a fixed time might leave some water or over-dry it. (5.2/LO5)", status: "human_review" },
      { id: "P5.2e-04", type: "choice", tier: 2, ref: "5.2/LO5", family: "moist-calc",
        q: "Start mass 100 g, dried mass 82 g. The percentage of water is:",
        options: ["18%", "82%", "118%", "8.2%"],
        a: 0, why: "Water lost = 100 − 82 = 18 g; % water = 18 ÷ 100 × 100 = 18%. (5.2/LO5)", status: "human_review" },
      { id: "P5.2e-05", type: "choice", tier: 2, ref: "5.2/LO5", family: "moist-gentle",
        q: "Why heat the sediment gently rather than strongly?",
        options: ["So organic matter is not burned away", "To make it dry faster only", "To add water", "To measure salinity"],
        a: 0, why: "Strong heat would burn off organic matter as well as water, giving too high a water value. (5.2/LO5)", status: "human_review" },
      { id: "P5.2e-06", type: "exam", tier: 3, ref: "5.2/LO5", family: "moist-describe",
        q: "Describe how to find the percentage of water in a sediment sample.",
        check: ["weigh a known mass of the fresh (wet) sediment", "heat it gently until its mass stops changing", "weigh the dried sediment", "water lost = starting mass − dried mass", "percentage water = water lost ÷ starting mass × 100"],
        distractors: ["weigh only the dried sediment", "heat it for exactly five minutes", "the colour change gives the water content", "add water and measure the volume"],
        why: "Weigh wet, dry to constant mass, weigh dry, find the loss, and express it as a percentage of the starting mass. (5.2/LO5)", status: "human_review" },
    ],
    status: "human_review",
  },
];

export const practicalsList = () =>
  PRACTICALS.map((p) => ({ id: p.id, title: p.title, subtitle: p.subtitle, ref: p.ref, unit: p.unit, count: p.items.length }));
export const practicalById = (id) => PRACTICALS.find((p) => p.id === id) || null;
export const practicalItemIds = (id) => (practicalById(id)?.items || []).map((i) => i.id);
