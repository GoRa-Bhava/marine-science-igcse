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
      "In the exam, give BOTH colours — the starting colour and the positive one (e.g. 'orange-brown → blue-black', 'blue → brick-red'), not just the final colour.",
      "Use a separate sample of the food for each test, with equal volumes of sample and reagent, so the tests don't interfere and comparisons are fair.",
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
      {
        id: "P4.1-12", type: "multi", tier: 2, ref: "4.1/LO2", family: "ft-fairtest",
        q: "You test one food for several nutrients. Which make it a fair, valid test? Select all that apply.",
        options: [
          "Use a separate sample of the food for each test",
          "Use equal volumes of sample and reagent",
          "Add all the reagents to the same sample at once",
          "Heat every test in a water bath",
        ],
        a: [0, 1],
        why: "Use a fresh sample for each test (so reagents don't interfere) and equal volumes for a fair comparison. Mixing all reagents in one sample confuses the results, and only the Benedict's test is heated — the others are done cold. (4.1/LO2)",
        status: "human_review",
      },
      {
        id: "P4.1-13", type: "choice", tier: 2, ref: "4.1/LO2", family: "ft-both-colours",
        q: "In an exam, which is the most complete way to record a positive starch test?",
        options: [
          "Orange-brown → blue-black",
          "It goes black",
          "It goes dark",
          "A colour change happens",
        ],
        a: 0,
        why: "State BOTH colours — the starting orange-brown and the positive blue-black. 'Black', 'dark' or just 'a colour change' can lose the mark; name the actual colours. (4.1/LO2)",
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
    diagram: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 880 560" role="img" aria-labelledby="title desc">
<title id="title">Testing pH with universal indicator</title><desc id="desc">Indicator is added to three samples. Illustrative results: sea water slightly alkaline, fresh water neutral and rain water slightly acidic. The pH scale runs from acidic zero through neutral seven to alkaline fourteen.</desc>
<style>:root{--bg:#e9f1f2;--panel:#ffffff;--ink:#0d2a37;--soft:#4d6c77;--line:#d2e0e3;--teal:#12a7bb;--deep:#0b6b79;--coral:#ff6a4d;--good:#1a9b6c;--amber:#f0a63c;--violet:#7a5bb0}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}}
:root[data-theme="dark"]{--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}

svg{display:block;height:auto;font-family:system-ui,sans-serif;background:var(--bg)}
text{fill:var(--ink);font-family:system-ui,"Segoe UI",Arial,sans-serif;font-size:28px;font-variant-numeric:tabular-nums}
.title{font-size:32px;font-weight:700}.small{font-size:24px}.big{font-size:36px;font-weight:700}
.soft{fill:var(--soft)}.accent{fill:var(--coral);font-weight:700}.good{fill:var(--good)}
.apparatus{fill:none;stroke:var(--deep);stroke-width:4;stroke-linejoin:round;stroke-linecap:round}
.rule{fill:none;stroke:var(--soft);stroke-width:2}.arrow{fill:none;stroke:var(--coral);stroke-width:4;marker-end:url(#arrow)}
.reveal{animation:reveal .45s ease-out var(--delay,5s) both}
.early{opacity:0;animation:early 9s linear infinite}.late{opacity:1;animation:late 9s linear infinite}
.grow{transform-origin:0 0;animation:grow 9s ease-in-out infinite}
.shrink{transform-origin:0 0;transform:scaleY(.22);animation:shrink 9s ease-in-out infinite}
.dissolve{opacity:0;animation:dissolve 9s linear infinite}
.bubble{opacity:0;animation:bubble 9s linear infinite}
@keyframes reveal{from{opacity:0}to{opacity:1}}
@keyframes early{0%,22%{opacity:1}28%,96%{opacity:0}100%{opacity:1}}
@keyframes late{0%,27%{opacity:0}34%,94%{opacity:1}100%{opacity:0}}
@keyframes grow{0%,15%{transform:scaleY(.22)}65%,92%{transform:scaleY(1)}100%{transform:scaleY(.22)}}
@keyframes shrink{0%,15%{transform:scaleY(1)}65%,92%{transform:scaleY(.22)}100%{transform:scaleY(1)}}
@keyframes dissolve{0%,18%{opacity:1}55%,94%{opacity:0}100%{opacity:1}}
@keyframes bubble{0%,15%{opacity:0;transform:translateY(0)}20%{opacity:1}65%{opacity:1;transform:translateY(-145px)}70%,99%{opacity:0;transform:translateY(-165px)}100%{opacity:0;transform:translateY(0)}}
 .dropper{animation:dropper 9s ease infinite}@keyframes dropper{0%,13%{transform:translateX(0);opacity:1}25%,36%{transform:translateX(295px);opacity:1}48%,59%{transform:translateX(590px);opacity:1}66%,96%{transform:translateX(590px);opacity:0}100%{transform:translateX(0);opacity:1}}@media(prefers-reduced-motion:reduce){.dropper{opacity:0!important}}.drop-0{opacity:0;animation:drop0 9s linear infinite}@keyframes drop0{0%,8%{opacity:0;transform:translateY(0)}10%{opacity:1;transform:translateY(0)}18%{opacity:0;transform:translateY(42px)}100%{opacity:0}}.drop-1{opacity:0;animation:drop1 9s linear infinite}@keyframes drop1{0%,20%{opacity:0;transform:translateY(0)}22%{opacity:1;transform:translateY(0)}30%{opacity:0;transform:translateY(42px)}100%{opacity:0}}.drop-2{opacity:0;animation:drop2 9s linear infinite}@keyframes drop2{0%,32%{opacity:0;transform:translateY(0)}34%{opacity:1;transform:translateY(0)}42%{opacity:0;transform:translateY(42px)}100%{opacity:0}}
@media(prefers-reduced-motion:reduce){svg *{animation:none!important;transition:none!important}.reveal,.late{opacity:1!important}.early,.dissolve,.bubble{opacity:0!important}.grow{transform:none!important}.shrink{transform:scaleY(.22)!important}}
</style>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="12" markerHeight="12" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L10 5 0 10Z" fill="var(--coral)"/></marker></defs>
<rect width="880" height="560" fill="var(--bg)"/>
<text x="24" y="43" class="title">Testing pH with universal indicator</text>
<!-- Apparatus and observations; final result remains visible after its reveal. -->
<text x="130" y="102" class="" text-anchor="middle">Rain water</text><path d="M94 131V240Q94 277 130 277Q166 277 166 240V131" class="apparatus" /><rect x="99" y="176" width="62" height="94" rx="25" fill="var(--teal)" opacity=".15"/><g class="reveal" style="--delay:1.2s"><rect x="99" y="176" width="62" height="94" rx="25" fill="#d6c341" opacity=".8"/></g><text x="130" y="311" class="small" text-anchor="middle">Slightly acidic</text><g class="reveal" style="--delay:4.0s"><path d="M130 322V334L386 356" class="arrow" /></g><text x="425" y="102" class="" text-anchor="middle">Fresh water</text><path d="M389 131V240Q389 277 425 277Q461 277 461 240V131" class="apparatus" /><rect x="394" y="176" width="62" height="94" rx="25" fill="var(--teal)" opacity=".15"/><g class="reveal" style="--delay:2.3s"><rect x="394" y="176" width="62" height="94" rx="25" fill="#45a76b" opacity=".8"/></g><text x="425" y="311" class="small" text-anchor="middle">Neutral</text><g class="reveal" style="--delay:4.15s"><path d="M425 322V334L439 356" class="arrow" /></g><text x="720" y="102" class="" text-anchor="middle">Sea water</text><path d="M684 131V240Q684 277 720 277Q756 277 756 240V131" class="apparatus" /><rect x="689" y="176" width="62" height="94" rx="25" fill="var(--teal)" opacity=".15"/><g class="reveal" style="--delay:3.4000000000000004s"><rect x="689" y="176" width="62" height="94" rx="25" fill="#259a9d" opacity=".8"/></g><text x="720" y="311" class="small" text-anchor="middle">Slightly alkaline</text><g class="reveal" style="--delay:4.3s"><path d="M720 322V334L492 356" class="arrow" /></g><rect x="100" y="116" width="25" height="43" rx="6" fill="var(--soft)" class="dropper"/><path d="M112 158v13"  class="rule dropper"/><rect x="43" y="361" width="53" height="26" rx="0" fill="#cf4551" /><text x="69" y="412" class="small" text-anchor="middle">0</text><rect x="96" y="361" width="53" height="26" rx="0" fill="#e85d40" /><text x="122" y="412" class="small" text-anchor="middle">1</text><rect x="149" y="361" width="53" height="26" rx="0" fill="#eb7f38" /><text x="175" y="412" class="small" text-anchor="middle">2</text><rect x="202" y="361" width="53" height="26" rx="0" fill="#e5a736" /><text x="228" y="412" class="small" text-anchor="middle">3</text><rect x="255" y="361" width="53" height="26" rx="0" fill="#debb3a" /><text x="281" y="412" class="small" text-anchor="middle">4</text><rect x="308" y="361" width="53" height="26" rx="0" fill="#d6c341" /><text x="334" y="412" class="small" text-anchor="middle">5</text><rect x="361" y="361" width="53" height="26" rx="0" fill="#bdc94b" /><text x="387" y="412" class="small" text-anchor="middle">6</text><rect x="414" y="361" width="53" height="26" rx="0" fill="#45a76b" /><text x="440" y="412" class="small" text-anchor="middle">7</text><rect x="467" y="361" width="53" height="26" rx="0" fill="#259a9d" /><text x="493" y="412" class="small" text-anchor="middle">8</text><rect x="520" y="361" width="53" height="26" rx="0" fill="#327da7" /><text x="546" y="412" class="small" text-anchor="middle">9</text><rect x="573" y="361" width="53" height="26" rx="0" fill="#5365ad" /><text x="599" y="412" class="small" text-anchor="middle">10</text><rect x="626" y="361" width="53" height="26" rx="0" fill="#6d59b1" /><text x="652" y="412" class="small" text-anchor="middle">11</text><rect x="679" y="361" width="53" height="26" rx="0" fill="#81499e" /><text x="705" y="412" class="small" text-anchor="middle">12</text><rect x="732" y="361" width="53" height="26" rx="0" fill="#913b96" /><text x="758" y="412" class="small" text-anchor="middle">13</text><rect x="785" y="361" width="53" height="26" rx="0" fill="#9e3485" /><text x="811" y="412" class="small" text-anchor="middle">14</text><g class="reveal" style="--delay:5s"><rect x="22" y="441" width="836" height="103" rx="14" fill="var(--panel)" stroke="var(--coral)" stroke-width="2"/><text x="440" y="478" class="accent" text-anchor="middle">Universal indicator shows pH by colour.</text><text x="440" y="514" class="accent" text-anchor="middle">Acidic ←     neutral 7     → alkaline</text></g><circle cx="130" cy="153" r="5" fill="var(--violet)" class="drop drop-0"/><circle cx="425" cy="153" r="5" fill="var(--violet)" class="drop drop-1"/><circle cx="720" cy="153" r="5" fill="var(--violet)" class="drop drop-2"/>
</svg>`,
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
    diagram: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 880 560" role="img" aria-labelledby="title desc">
<title id="title">Carbon dioxide lowers sea-water pH</title><desc id="desc">Carbon dioxide bubbles into sea water. Indicator colour changes from blue-green to green to yellow, matched by illustrative pH values eight, seven and six. Lower pH means more acidic.</desc>
<style>:root{--bg:#e9f1f2;--panel:#ffffff;--ink:#0d2a37;--soft:#4d6c77;--line:#d2e0e3;--teal:#12a7bb;--deep:#0b6b79;--coral:#ff6a4d;--good:#1a9b6c;--amber:#f0a63c;--violet:#7a5bb0}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}}
:root[data-theme="dark"]{--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}

svg{display:block;height:auto;font-family:system-ui,sans-serif;background:var(--bg)}
text{fill:var(--ink);font-family:system-ui,"Segoe UI",Arial,sans-serif;font-size:28px;font-variant-numeric:tabular-nums}
.title{font-size:32px;font-weight:700}.small{font-size:24px}.big{font-size:36px;font-weight:700}
.soft{fill:var(--soft)}.accent{fill:var(--coral);font-weight:700}.good{fill:var(--good)}
.apparatus{fill:none;stroke:var(--deep);stroke-width:4;stroke-linejoin:round;stroke-linecap:round}
.rule{fill:none;stroke:var(--soft);stroke-width:2}.arrow{fill:none;stroke:var(--coral);stroke-width:4;marker-end:url(#arrow)}
.reveal{animation:reveal .45s ease-out var(--delay,5s) both}
.early{opacity:0;animation:early 9s linear infinite}.late{opacity:1;animation:late 9s linear infinite}
.grow{transform-origin:0 0;animation:grow 9s ease-in-out infinite}
.shrink{transform-origin:0 0;transform:scaleY(.22);animation:shrink 9s ease-in-out infinite}
.dissolve{opacity:0;animation:dissolve 9s linear infinite}
.bubble{opacity:0;animation:bubble 9s linear infinite}
@keyframes reveal{from{opacity:0}to{opacity:1}}
@keyframes early{0%,22%{opacity:1}28%,96%{opacity:0}100%{opacity:1}}
@keyframes late{0%,27%{opacity:0}34%,94%{opacity:1}100%{opacity:0}}
@keyframes grow{0%,15%{transform:scaleY(.22)}65%,92%{transform:scaleY(1)}100%{transform:scaleY(.22)}}
@keyframes shrink{0%,15%{transform:scaleY(1)}65%,92%{transform:scaleY(.22)}100%{transform:scaleY(1)}}
@keyframes dissolve{0%,18%{opacity:1}55%,94%{opacity:0}100%{opacity:1}}
@keyframes bubble{0%,15%{opacity:0;transform:translateY(0)}20%{opacity:1}65%{opacity:1;transform:translateY(-145px)}70%,99%{opacity:0;transform:translateY(-165px)}100%{opacity:0;transform:translateY(0)}}
.ph-water{fill:#d6c341;animation:ph 9s linear infinite}@keyframes ph{0%,15%{fill:#259a9d}45%{fill:#45a76b}70%,94%{fill:#d6c341}100%{fill:#259a9d}}
@media(prefers-reduced-motion:reduce){svg *{animation:none!important;transition:none!important}.reveal,.late{opacity:1!important}.early,.dissolve,.bubble{opacity:0!important}.grow{transform:none!important}.shrink{transform:scaleY(.22)!important}}
</style>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="12" markerHeight="12" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L10 5 0 10Z" fill="var(--coral)"/></marker></defs>
<rect width="880" height="560" fill="var(--bg)"/>
<text x="24" y="43" class="title">Carbon dioxide lowers sea-water pH</text>
<!-- Apparatus and observations; final result remains visible after its reveal. -->
<rect x="91" y="193" width="275" height="170" rx="12" fill="var(--teal)" class="" opacity=".28"/><path d="M86 128V350Q86 368 104 368H353Q371 368 371 350V128" class="apparatus" /><path d="M91 193H366" class="rule" /><rect x="91" y="193" width="275" height="170" rx="10" fill="#259a9d" class="ph-water" opacity=".65"/><path d="M198 77H237V314" class="apparatus" /><text x="78" y="97" class="">CO₂</text><text x="78" y="402" class="small">Sea water + indicator</text><circle cx="231" cy="312" r="5" fill="none" stroke="var(--deep)" stroke-width="2" class="bubble" style="animation-delay:0.0s"/><circle cx="245" cy="327" r="6" fill="none" stroke="var(--deep)" stroke-width="2" class="bubble" style="animation-delay:0.18s"/><circle cx="259" cy="312" r="7" fill="none" stroke="var(--deep)" stroke-width="2" class="bubble" style="animation-delay:0.36s"/><circle cx="231" cy="327" r="5" fill="none" stroke="var(--deep)" stroke-width="2" class="bubble" style="animation-delay:0.54s"/><circle cx="245" cy="312" r="6" fill="none" stroke="var(--deep)" stroke-width="2" class="bubble" style="animation-delay:0.72s"/><circle cx="259" cy="327" r="7" fill="none" stroke="var(--deep)" stroke-width="2" class="bubble" style="animation-delay:0.8999999999999999s"/><rect x="452" y="100" width="352" height="124" rx="10" fill="var(--panel)" /><text x="480" y="141" class="small">Illustrative pH readings</text><g class="reveal" style="--delay:3s"><text x="626" y="191" class="big" text-anchor="middle">8 → 7 → 6</text></g><text x="470" y="271" class="accent">pH falls ↓</text><text x="470" y="311" class="accent">More acidic</text><rect x="472" y="338" width="90" height="26" rx="4" fill="#d6c341" /><text x="517" y="396" class="" text-anchor="middle">6</text><rect x="570" y="338" width="90" height="26" rx="4" fill="#45a76b" /><text x="615" y="396" class="" text-anchor="middle">7</text><rect x="668" y="338" width="90" height="26" rx="4" fill="#259a9d" /><text x="713" y="396" class="" text-anchor="middle">8</text><g class="reveal" style="--delay:5s"><rect x="22" y="441" width="836" height="103" rx="14" fill="var(--panel)" stroke="var(--coral)" stroke-width="2"/><text x="440" y="478" class="accent" text-anchor="middle">More CO₂ dissolves → lower pH → more acidic</text><text x="440" y="514" class="accent" text-anchor="middle">Models ocean acidification</text></g>
</svg>`,
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
    diagram: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 880 560" role="img" aria-labelledby="title desc">
<title id="title">Temperature and the solubility of a solid</title><desc id="desc">As temperature rises, more of most solids can dissolve. The amount dissolved bar grows.</desc>
<style>:root{--bg:#e9f1f2;--panel:#ffffff;--ink:#0d2a37;--soft:#4d6c77;--line:#d2e0e3;--teal:#12a7bb;--deep:#0b6b79;--coral:#ff6a4d;--good:#1a9b6c;--amber:#f0a63c;--violet:#7a5bb0}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}}
:root[data-theme="dark"]{--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}

svg{display:block;height:auto;font-family:system-ui,sans-serif;background:var(--bg)}
text{fill:var(--ink);font-family:system-ui,"Segoe UI",Arial,sans-serif;font-size:28px;font-variant-numeric:tabular-nums}
.title{font-size:32px;font-weight:700}.small{font-size:24px}.big{font-size:36px;font-weight:700}
.soft{fill:var(--soft)}.accent{fill:var(--coral);font-weight:700}.good{fill:var(--good)}
.apparatus{fill:none;stroke:var(--deep);stroke-width:4;stroke-linejoin:round;stroke-linecap:round}
.rule{fill:none;stroke:var(--soft);stroke-width:2}.arrow{fill:none;stroke:var(--coral);stroke-width:4;marker-end:url(#arrow)}
.reveal{animation:reveal .45s ease-out var(--delay,5s) both}
.early{opacity:0;animation:early 9s linear infinite}.late{opacity:1;animation:late 9s linear infinite}
.grow{transform-origin:0 0;animation:grow 9s ease-in-out infinite}
.shrink{transform-origin:0 0;transform:scaleY(.22);animation:shrink 9s ease-in-out infinite}
.dissolve{opacity:0;animation:dissolve 9s linear infinite}
.bubble{opacity:0;animation:bubble 9s linear infinite}
@keyframes reveal{from{opacity:0}to{opacity:1}}
@keyframes early{0%,22%{opacity:1}28%,96%{opacity:0}100%{opacity:1}}
@keyframes late{0%,27%{opacity:0}34%,94%{opacity:1}100%{opacity:0}}
@keyframes grow{0%,15%{transform:scaleY(.22)}65%,92%{transform:scaleY(1)}100%{transform:scaleY(.22)}}
@keyframes shrink{0%,15%{transform:scaleY(1)}65%,92%{transform:scaleY(.22)}100%{transform:scaleY(1)}}
@keyframes dissolve{0%,18%{opacity:1}55%,94%{opacity:0}100%{opacity:1}}
@keyframes bubble{0%,15%{opacity:0;transform:translateY(0)}20%{opacity:1}65%{opacity:1;transform:translateY(-145px)}70%,99%{opacity:0;transform:translateY(-165px)}100%{opacity:0;transform:translateY(0)}}

@media(prefers-reduced-motion:reduce){svg *{animation:none!important;transition:none!important}.reveal,.late{opacity:1!important}.early,.dissolve,.bubble{opacity:0!important}.grow{transform:none!important}.shrink{transform:scaleY(.22)!important}}
</style>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="12" markerHeight="12" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L10 5 0 10Z" fill="var(--coral)"/></marker></defs>
<rect width="880" height="560" fill="var(--bg)"/>
<text x="24" y="43" class="title">Temperature and the solubility of a solid</text>
<!-- Apparatus and observations; final result remains visible after its reveal. -->
<rect x="95" y="193" width="270" height="175" rx="12" fill="var(--teal)" class="" opacity=".28"/><path d="M90 128V355Q90 373 108 373H352Q370 373 370 355V128" class="apparatus" /><path d="M95 193H365" class="rule" /><rect x="430" y="144" width="28" height="190" rx="14" fill="var(--panel)" stroke="var(--deep)" stroke-width="3"/><g class="" transform="translate(439 326)"><g class="grow" ><rect x="0" y="-174" width="10" height="174" rx="5" fill="var(--coral)" /></g></g><circle cx="444" cy="334" r="22" fill="var(--panel)" stroke="var(--deep)" stroke-width="3"/><circle cx="444" cy="334" r="13" fill="var(--coral)" /><text x="425" y="108" class="small">Warm</text><text x="413" y="395" class="small">Cool</text><circle cx="122" cy="341" r="5" fill="var(--deep)" class="dissolve"/><circle cx="169" cy="341" r="5" fill="var(--deep)" class="dissolve"/><circle cx="216" cy="341" r="5" fill="var(--deep)" class="dissolve"/><circle cx="263" cy="341" r="5" fill="var(--deep)" class="dissolve"/><circle cx="310" cy="341" r="5" fill="var(--deep)" class="dissolve"/><circle cx="122" cy="350" r="5" fill="var(--deep)" class="dissolve"/><circle cx="169" cy="350" r="5" fill="var(--deep)" class="dissolve"/><circle cx="216" cy="350" r="5" fill="var(--deep)" class="dissolve"/><circle cx="263" cy="350" r="5" fill="var(--deep)" class="dissolve"/><circle cx="310" cy="350" r="5" fill="var(--deep)" class="dissolve"/><circle cx="122" cy="359" r="5" fill="var(--deep)" class="dissolve"/><circle cx="169" cy="359" r="5" fill="var(--deep)" class="dissolve"/><circle cx="216" cy="359" r="5" fill="var(--deep)" class="dissolve"/><circle cx="263" cy="359" r="5" fill="var(--deep)" class="dissolve"/><circle cx="310" cy="359" r="5" fill="var(--deep)" class="dissolve"/><text x="565" y="117" class="">Mass dissolved</text><rect x="610" y="156" width="90" height="196" rx="8" fill="var(--line)" /><g class="" transform="translate(610 352)"><g class="grow" ><rect x="0" y="-196" width="90" height="196" rx="8" fill="var(--teal)" /></g></g><text x="720" y="176" class="small">More</text><text x="720" y="351" class="small">Less</text><text x="84" y="415" class="small">Most solids · opposite of gases</text><g class="reveal" style="--delay:5s"><rect x="22" y="441" width="836" height="103" rx="14" fill="var(--panel)" stroke="var(--coral)" stroke-width="2"/><text x="440" y="478" class="accent" text-anchor="middle">Warmer water → MORE solid dissolves</text><text x="440" y="514" class="accent" text-anchor="middle">For most solids, solubility increases.</text></g>
</svg>`,
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
    diagram: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 880 560" role="img" aria-labelledby="title desc">
<title id="title">Temperature and the solubility of a gas</title><desc id="desc">As temperature rises, gas escapes as bubbles and less remains dissolved. This is not boiling.</desc>
<style>:root{--bg:#e9f1f2;--panel:#ffffff;--ink:#0d2a37;--soft:#4d6c77;--line:#d2e0e3;--teal:#12a7bb;--deep:#0b6b79;--coral:#ff6a4d;--good:#1a9b6c;--amber:#f0a63c;--violet:#7a5bb0}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}}
:root[data-theme="dark"]{--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}

svg{display:block;height:auto;font-family:system-ui,sans-serif;background:var(--bg)}
text{fill:var(--ink);font-family:system-ui,"Segoe UI",Arial,sans-serif;font-size:28px;font-variant-numeric:tabular-nums}
.title{font-size:32px;font-weight:700}.small{font-size:24px}.big{font-size:36px;font-weight:700}
.soft{fill:var(--soft)}.accent{fill:var(--coral);font-weight:700}.good{fill:var(--good)}
.apparatus{fill:none;stroke:var(--deep);stroke-width:4;stroke-linejoin:round;stroke-linecap:round}
.rule{fill:none;stroke:var(--soft);stroke-width:2}.arrow{fill:none;stroke:var(--coral);stroke-width:4;marker-end:url(#arrow)}
.reveal{animation:reveal .45s ease-out var(--delay,5s) both}
.early{opacity:0;animation:early 9s linear infinite}.late{opacity:1;animation:late 9s linear infinite}
.grow{transform-origin:0 0;animation:grow 9s ease-in-out infinite}
.shrink{transform-origin:0 0;transform:scaleY(.22);animation:shrink 9s ease-in-out infinite}
.dissolve{opacity:0;animation:dissolve 9s linear infinite}
.bubble{opacity:0;animation:bubble 9s linear infinite}
@keyframes reveal{from{opacity:0}to{opacity:1}}
@keyframes early{0%,22%{opacity:1}28%,96%{opacity:0}100%{opacity:1}}
@keyframes late{0%,27%{opacity:0}34%,94%{opacity:1}100%{opacity:0}}
@keyframes grow{0%,15%{transform:scaleY(.22)}65%,92%{transform:scaleY(1)}100%{transform:scaleY(.22)}}
@keyframes shrink{0%,15%{transform:scaleY(1)}65%,92%{transform:scaleY(.22)}100%{transform:scaleY(1)}}
@keyframes dissolve{0%,18%{opacity:1}55%,94%{opacity:0}100%{opacity:1}}
@keyframes bubble{0%,15%{opacity:0;transform:translateY(0)}20%{opacity:1}65%{opacity:1;transform:translateY(-145px)}70%,99%{opacity:0;transform:translateY(-165px)}100%{opacity:0;transform:translateY(0)}}
@media(prefers-reduced-motion:reduce){.shrink{transform:scaleY(.22)!important}}
@media(prefers-reduced-motion:reduce){svg *{animation:none!important;transition:none!important}.reveal,.late{opacity:1!important}.early,.dissolve,.bubble{opacity:0!important}.grow{transform:none!important}.shrink{transform:scaleY(.22)!important}}
</style>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="12" markerHeight="12" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L10 5 0 10Z" fill="var(--coral)"/></marker></defs>
<rect width="880" height="560" fill="var(--bg)"/>
<text x="24" y="43" class="title">Temperature and the solubility of a gas</text>
<!-- Apparatus and observations; final result remains visible after its reveal. -->
<rect x="95" y="193" width="270" height="175" rx="12" fill="var(--teal)" class="" opacity=".28"/><path d="M90 128V355Q90 373 108 373H352Q370 373 370 355V128" class="apparatus" /><path d="M95 193H365" class="rule" /><rect x="430" y="144" width="28" height="190" rx="14" fill="var(--panel)" stroke="var(--deep)" stroke-width="3"/><g class="" transform="translate(439 326)"><g class="grow" ><rect x="0" y="-174" width="10" height="174" rx="5" fill="var(--coral)" /></g></g><circle cx="444" cy="334" r="22" fill="var(--panel)" stroke="var(--deep)" stroke-width="3"/><circle cx="444" cy="334" r="13" fill="var(--coral)" /><text x="425" y="108" class="small">Warm</text><text x="413" y="395" class="small">Cool</text><circle cx="122" cy="228" r="4" fill="var(--deep)" class="dissolve"/><circle cx="169" cy="228" r="4" fill="var(--deep)" class="dissolve"/><circle cx="216" cy="228" r="4" fill="var(--deep)" class="dissolve"/><circle cx="263" cy="228" r="4" fill="var(--deep)" class="dissolve"/><circle cx="310" cy="228" r="4" fill="var(--deep)" class="dissolve"/><circle cx="122" cy="267" r="4" fill="var(--deep)" class="dissolve"/><circle cx="169" cy="267" r="4" fill="var(--deep)" class="dissolve"/><circle cx="216" cy="267" r="4" fill="var(--deep)" class="dissolve"/><circle cx="263" cy="267" r="4" fill="var(--deep)" class="dissolve"/><circle cx="310" cy="267" r="4" fill="var(--deep)" class="dissolve"/><circle cx="122" cy="306" r="4" fill="var(--deep)" class="dissolve"/><circle cx="169" cy="306" r="4" fill="var(--deep)" class="dissolve"/><circle cx="216" cy="306" r="4" fill="var(--deep)" class="dissolve"/><circle cx="263" cy="306" r="4" fill="var(--deep)" class="dissolve"/><circle cx="310" cy="306" r="4" fill="var(--deep)" class="dissolve"/><circle cx="135" cy="290" r="6" fill="none" stroke="var(--deep)" stroke-width="2" class="bubble" style="animation-delay:0.0s"/><circle cx="171" cy="310" r="6" fill="none" stroke="var(--deep)" stroke-width="2" class="bubble" style="animation-delay:0.2s"/><circle cx="207" cy="290" r="6" fill="none" stroke="var(--deep)" stroke-width="2" class="bubble" style="animation-delay:0.4s"/><circle cx="243" cy="310" r="6" fill="none" stroke="var(--deep)" stroke-width="2" class="bubble" style="animation-delay:0.6000000000000001s"/><circle cx="279" cy="290" r="6" fill="none" stroke="var(--deep)" stroke-width="2" class="bubble" style="animation-delay:0.8s"/><circle cx="315" cy="310" r="6" fill="none" stroke="var(--deep)" stroke-width="2" class="bubble" style="animation-delay:1.0s"/><circle cx="144" cy="300" r="4" fill="var(--deep)" /><circle cx="210" cy="317" r="4" fill="var(--deep)" /><circle cx="315" cy="276" r="4" fill="var(--deep)" /><text x="565" y="117" class="">Dissolved gas</text><rect x="610" y="156" width="90" height="196" rx="8" fill="var(--line)" /><g class="" transform="translate(610 352)"><g class="shrink" ><rect x="0" y="-196" width="90" height="196" rx="8" fill="var(--teal)" /></g></g><text x="720" y="176" class="small">More</text><text x="720" y="351" class="small">Less</text><text x="84" y="415" class="small">Gas escaping — not boiling</text><g class="reveal" style="--delay:5s"><rect x="22" y="441" width="836" height="103" rx="14" fill="var(--panel)" stroke="var(--coral)" stroke-width="2"/><text x="440" y="478" class="accent" text-anchor="middle">Warmer water → LESS gas stays dissolved</text><text x="440" y="514" class="accent" text-anchor="middle">Warm sea water holds less oxygen.</text></g>
</svg>`,
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
    diagram: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 880 560" role="img" aria-labelledby="title desc">
<title id="title">Temperature and the density of water</title><desc id="desc">Warm water is less dense and lies above colder, denser water. The same nine particles spread out as water warms: mass stays the same while volume increases.</desc>
<style>:root{--bg:#e9f1f2;--panel:#ffffff;--ink:#0d2a37;--soft:#4d6c77;--line:#d2e0e3;--teal:#12a7bb;--deep:#0b6b79;--coral:#ff6a4d;--good:#1a9b6c;--amber:#f0a63c;--violet:#7a5bb0}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}}
:root[data-theme="dark"]{--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}

svg{display:block;height:auto;font-family:system-ui,sans-serif;background:var(--bg)}
text{fill:var(--ink);font-family:system-ui,"Segoe UI",Arial,sans-serif;font-size:28px;font-variant-numeric:tabular-nums}
.title{font-size:32px;font-weight:700}.small{font-size:24px}.big{font-size:36px;font-weight:700}
.soft{fill:var(--soft)}.accent{fill:var(--coral);font-weight:700}.good{fill:var(--good)}
.apparatus{fill:none;stroke:var(--deep);stroke-width:4;stroke-linejoin:round;stroke-linecap:round}
.rule{fill:none;stroke:var(--soft);stroke-width:2}.arrow{fill:none;stroke:var(--coral);stroke-width:4;marker-end:url(#arrow)}
.reveal{animation:reveal .45s ease-out var(--delay,5s) both}
.early{opacity:0;animation:early 9s linear infinite}.late{opacity:1;animation:late 9s linear infinite}
.grow{transform-origin:0 0;animation:grow 9s ease-in-out infinite}
.shrink{transform-origin:0 0;transform:scaleY(.22);animation:shrink 9s ease-in-out infinite}
.dissolve{opacity:0;animation:dissolve 9s linear infinite}
.bubble{opacity:0;animation:bubble 9s linear infinite}
@keyframes reveal{from{opacity:0}to{opacity:1}}
@keyframes early{0%,22%{opacity:1}28%,96%{opacity:0}100%{opacity:1}}
@keyframes late{0%,27%{opacity:0}34%,94%{opacity:1}100%{opacity:0}}
@keyframes grow{0%,15%{transform:scaleY(.22)}65%,92%{transform:scaleY(1)}100%{transform:scaleY(.22)}}
@keyframes shrink{0%,15%{transform:scaleY(1)}65%,92%{transform:scaleY(.22)}100%{transform:scaleY(1)}}
@keyframes dissolve{0%,18%{opacity:1}55%,94%{opacity:0}100%{opacity:1}}
@keyframes bubble{0%,15%{opacity:0;transform:translateY(0)}20%{opacity:1}65%{opacity:1;transform:translateY(-145px)}70%,99%{opacity:0;transform:translateY(-165px)}100%{opacity:0;transform:translateY(0)}}
.density-demo{animation:density-demo 9s linear infinite}@keyframes density-demo{0%,86%{opacity:1}90%,98%{opacity:0}100%{opacity:1}}.p0{animation:p0 9s ease infinite}@keyframes p0{0%,15%{transform:translate(28px,25px)}65%,92%{transform:translate(0,0)}96%,100%{transform:translate(28px,25px)}}.p1{animation:p1 9s ease infinite}@keyframes p1{0%,15%{transform:translate(0px,25px)}65%,92%{transform:translate(0,0)}96%,100%{transform:translate(0px,25px)}}.p2{animation:p2 9s ease infinite}@keyframes p2{0%,15%{transform:translate(-28px,25px)}65%,92%{transform:translate(0,0)}96%,100%{transform:translate(-28px,25px)}}.p3{animation:p3 9s ease infinite}@keyframes p3{0%,15%{transform:translate(28px,0px)}65%,92%{transform:translate(0,0)}96%,100%{transform:translate(28px,0px)}}.p4{animation:p4 9s ease infinite}@keyframes p4{0%,15%{transform:translate(0px,0px)}65%,92%{transform:translate(0,0)}96%,100%{transform:translate(0px,0px)}}.p5{animation:p5 9s ease infinite}@keyframes p5{0%,15%{transform:translate(-28px,0px)}65%,92%{transform:translate(0,0)}96%,100%{transform:translate(-28px,0px)}}.p6{animation:p6 9s ease infinite}@keyframes p6{0%,15%{transform:translate(28px,-25px)}65%,92%{transform:translate(0,0)}96%,100%{transform:translate(28px,-25px)}}.p7{animation:p7 9s ease infinite}@keyframes p7{0%,15%{transform:translate(0px,-25px)}65%,92%{transform:translate(0,0)}96%,100%{transform:translate(0px,-25px)}}.p8{animation:p8 9s ease infinite}@keyframes p8{0%,15%{transform:translate(-28px,-25px)}65%,92%{transform:translate(0,0)}96%,100%{transform:translate(-28px,-25px)}}.density-marker{transform:translateX(330px);animation:density-marker 9s ease infinite}@keyframes density-marker{0%,15%{transform:translateX(0)}65%,92%{transform:translateX(330px)}96%,100%{transform:translateX(0)}}
@media(prefers-reduced-motion:reduce){svg *{animation:none!important;transition:none!important}.reveal,.late{opacity:1!important}.early,.dissolve,.bubble{opacity:0!important}.grow{transform:none!important}.shrink{transform:scaleY(.22)!important}}
</style>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="12" markerHeight="12" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L10 5 0 10Z" fill="var(--coral)"/></marker></defs>
<rect width="880" height="560" fill="var(--bg)"/>
<text x="24" y="43" class="title">Temperature and the density of water</text>
<!-- Apparatus and observations; final result remains visible after its reveal. -->
<rect x="45" y="170" width="330" height="204" rx="12" fill="var(--teal)" class="" opacity=".28"/><path d="M40 105V361Q40 379 58 379H362Q380 379 380 361V105" class="apparatus" /><path d="M45 170H375" class="rule" /><rect x="46" y="171" width="328" height="100" rx="0" fill="var(--amber)" opacity=".28"/><rect x="46" y="271" width="328" height="102" rx="0" fill="var(--teal)" opacity=".35"/><text x="77" y="218" class="small">Warm</text><text x="77" y="253" class="small">less dense → floats</text><text x="77" y="314" class="small">Cold</text><text x="77" y="349" class="small">denser → sinks</text><g class="reveal" style="--delay:3s"><path d="M340 237V190" class="arrow" /><path d="M340 295V350" class="arrow" /></g><g class="density-demo" ><text x="623" y="100" class="small" text-anchor="middle">Warming: particles spread out</text><rect x="441" y="117" width="363" height="163" rx="12" fill="var(--panel)" /><circle cx="573" cy="151" r="7" fill="var(--teal)" class="particle p0"/><circle cx="623" cy="151" r="7" fill="var(--teal)" class="particle p1"/><circle cx="673" cy="151" r="7" fill="var(--teal)" class="particle p2"/><circle cx="573" cy="196" r="7" fill="var(--teal)" class="particle p3"/><circle cx="623" cy="196" r="7" fill="var(--teal)" class="particle p4"/><circle cx="673" cy="196" r="7" fill="var(--teal)" class="particle p5"/><circle cx="573" cy="241" r="7" fill="var(--teal)" class="particle p6"/><circle cx="623" cy="241" r="7" fill="var(--teal)" class="particle p7"/><circle cx="673" cy="241" r="7" fill="var(--teal)" class="particle p8"/><text x="440" y="329" class="small">Density: higher → lower</text><rect x="457" y="353" width="330" height="10" rx="5" fill="var(--line)" /><path d="M457 344V372M787 344V372" class="rule" /><circle cx="457" cy="358" r="13" fill="var(--coral)" class="density-marker" stroke="var(--panel)" stroke-width="3"/><text x="440" y="412" class="small">Mass unchanged · volume grows</text></g><g class="reveal" style="--delay:5s"><rect x="22" y="441" width="836" height="103" rx="14" fill="var(--panel)" stroke="var(--coral)" stroke-width="2"/><text x="440" y="478" class="accent" text-anchor="middle">Warmer water → lower density</text><text x="440" y="514" class="accent" text-anchor="middle">Cold water sinks; warm water stays above.</text></g>
</svg>`,
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
    diagram: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 880 560" role="img" aria-labelledby="title desc">
<title id="title">Salinity and the density of water</title><desc id="desc">An egg sinks in fresh water. Dissolving salt increases water density; the identical egg in saltier water rises and floats higher. The salt remains in the water.</desc>
<style>:root{--bg:#e9f1f2;--panel:#ffffff;--ink:#0d2a37;--soft:#4d6c77;--line:#d2e0e3;--teal:#12a7bb;--deep:#0b6b79;--coral:#ff6a4d;--good:#1a9b6c;--amber:#f0a63c;--violet:#7a5bb0}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}}
:root[data-theme="dark"]{--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}

svg{display:block;height:auto;font-family:system-ui,sans-serif;background:var(--bg)}
text{fill:var(--ink);font-family:system-ui,"Segoe UI",Arial,sans-serif;font-size:28px;font-variant-numeric:tabular-nums}
.title{font-size:32px;font-weight:700}.small{font-size:24px}.big{font-size:36px;font-weight:700}
.soft{fill:var(--soft)}.accent{fill:var(--coral);font-weight:700}.good{fill:var(--good)}
.apparatus{fill:none;stroke:var(--deep);stroke-width:4;stroke-linejoin:round;stroke-linecap:round}
.rule{fill:none;stroke:var(--soft);stroke-width:2}.arrow{fill:none;stroke:var(--coral);stroke-width:4;marker-end:url(#arrow)}
.reveal{animation:reveal .45s ease-out var(--delay,5s) both}
.early{opacity:0;animation:early 9s linear infinite}.late{opacity:1;animation:late 9s linear infinite}
.grow{transform-origin:0 0;animation:grow 9s ease-in-out infinite}
.shrink{transform-origin:0 0;transform:scaleY(.22);animation:shrink 9s ease-in-out infinite}
.dissolve{opacity:0;animation:dissolve 9s linear infinite}
.bubble{opacity:0;animation:bubble 9s linear infinite}
@keyframes reveal{from{opacity:0}to{opacity:1}}
@keyframes early{0%,22%{opacity:1}28%,96%{opacity:0}100%{opacity:1}}
@keyframes late{0%,27%{opacity:0}34%,94%{opacity:1}100%{opacity:0}}
@keyframes grow{0%,15%{transform:scaleY(.22)}65%,92%{transform:scaleY(1)}100%{transform:scaleY(.22)}}
@keyframes shrink{0%,15%{transform:scaleY(1)}65%,92%{transform:scaleY(.22)}100%{transform:scaleY(1)}}
@keyframes dissolve{0%,18%{opacity:1}55%,94%{opacity:0}100%{opacity:1}}
@keyframes bubble{0%,15%{opacity:0;transform:translateY(0)}20%{opacity:1}65%{opacity:1;transform:translateY(-145px)}70%,99%{opacity:0;transform:translateY(-165px)}100%{opacity:0;transform:translateY(0)}}
.floating-egg{transform:translateY(-129px);animation:egg 9s ease infinite}@keyframes egg{0%,22%{transform:translateY(0)}65%,94%{transform:translateY(-129px)}100%{transform:translateY(0)}}.salt{opacity:0;animation:salt 9s linear infinite}@keyframes salt{0%,12%{opacity:0;transform:translateY(0)}16%{opacity:1}35%{opacity:1;transform:translateY(100px)}45%,100%{opacity:0;transform:translateY(110px)}}
@media(prefers-reduced-motion:reduce){svg *{animation:none!important;transition:none!important}.reveal,.late{opacity:1!important}.early,.dissolve,.bubble{opacity:0!important}.grow{transform:none!important}.shrink{transform:scaleY(.22)!important}}
</style>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="12" markerHeight="12" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L10 5 0 10Z" fill="var(--coral)"/></marker></defs>
<rect width="880" height="560" fill="var(--bg)"/>
<text x="24" y="43" class="title">Salinity and the density of water</text>
<!-- Apparatus and observations; final result remains visible after its reveal. -->
<text x="239" y="105" class="" text-anchor="middle">Fresh water</text><text x="626" y="105" class="" text-anchor="middle">Salty water</text><rect x="118" y="200" width="240" height="170" rx="12" fill="var(--teal)" class="" opacity=".28"/><path d="M113 135V357Q113 375 131 375H345Q363 375 363 357V135" class="apparatus" /><path d="M118 200H358" class="rule" /><rect x="506" y="200" width="240" height="170" rx="12" fill="var(--teal)" class="" opacity=".28"/><path d="M501 135V357Q501 375 519 375H733Q751 375 751 357V135" class="apparatus" /><path d="M506 200H746" class="rule" /><g class="" transform="translate(238 331)"><ellipse cx="0" cy="0" rx="28" ry="39" fill="var(--panel)" stroke="var(--soft)" stroke-width="3"/></g><g class="" transform="translate(626 331)"><g class="floating-egg" ><ellipse cx="0" cy="0" rx="28" ry="39" fill="var(--panel)" stroke="var(--soft)" stroke-width="3"/></g></g><text x="557" y="407" class="accent">Density rises ↑</text><text x="100" y="407" class="small">Egg sinks</text><rect x="785" y="209" width="24" height="158" rx="8" fill="var(--line)" /><g class="" transform="translate(785 367)"><g class="grow" ><rect x="0" y="-158" width="24" height="158" rx="8" fill="var(--teal)" /></g></g><circle cx="567" cy="157" r="3" fill="var(--ink)" class="salt" style="animation-delay:0.0s"/><circle cx="582" cy="170" r="3" fill="var(--ink)" class="salt" style="animation-delay:0.09s"/><circle cx="597" cy="183" r="3" fill="var(--ink)" class="salt" style="animation-delay:0.18s"/><circle cx="612" cy="157" r="3" fill="var(--ink)" class="salt" style="animation-delay:0.27s"/><circle cx="627" cy="170" r="3" fill="var(--ink)" class="salt" style="animation-delay:0.36s"/><circle cx="642" cy="183" r="3" fill="var(--ink)" class="salt" style="animation-delay:0.44999999999999996s"/><circle cx="657" cy="157" r="3" fill="var(--ink)" class="salt" style="animation-delay:0.54s"/><circle cx="672" cy="170" r="3" fill="var(--ink)" class="salt" style="animation-delay:0.63s"/><path d="M567 116l70 10-24 27-60-20Z" class="rule" fill="var(--panel)"/><g class="reveal" style="--delay:5s"><rect x="22" y="441" width="836" height="103" rx="14" fill="var(--panel)" stroke="var(--coral)" stroke-width="2"/><text x="440" y="478" class="accent" text-anchor="middle">More salt → denser water → floats higher</text><text x="440" y="514" class="accent" text-anchor="middle">Dissolved salt adds mass to the water.</text></g>
</svg>`,
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
    diagram: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 880 560" role="img" aria-labelledby="title desc">
<title id="title">Measuring water clarity with a Secchi disc</title><desc id="desc">A black-and-white disc disappears at about eight metres in clear water but about two metres in murky water. Greater Secchi depth means deeper light penetration and clearer water.</desc>
<style>:root{--bg:#e9f1f2;--panel:#ffffff;--ink:#0d2a37;--soft:#4d6c77;--line:#d2e0e3;--teal:#12a7bb;--deep:#0b6b79;--coral:#ff6a4d;--good:#1a9b6c;--amber:#f0a63c;--violet:#7a5bb0}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}}
:root[data-theme="dark"]{--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}

svg{display:block;height:auto;font-family:system-ui,sans-serif;background:var(--bg)}
text{fill:var(--ink);font-family:system-ui,"Segoe UI",Arial,sans-serif;font-size:28px;font-variant-numeric:tabular-nums}
.title{font-size:32px;font-weight:700}.small{font-size:24px}.big{font-size:36px;font-weight:700}
.soft{fill:var(--soft)}.accent{fill:var(--coral);font-weight:700}.good{fill:var(--good)}
.apparatus{fill:none;stroke:var(--deep);stroke-width:4;stroke-linejoin:round;stroke-linecap:round}
.rule{fill:none;stroke:var(--soft);stroke-width:2}.arrow{fill:none;stroke:var(--coral);stroke-width:4;marker-end:url(#arrow)}
.reveal{animation:reveal .45s ease-out var(--delay,5s) both}
.early{opacity:0;animation:early 9s linear infinite}.late{opacity:1;animation:late 9s linear infinite}
.grow{transform-origin:0 0;animation:grow 9s ease-in-out infinite}
.shrink{transform-origin:0 0;transform:scaleY(.22);animation:shrink 9s ease-in-out infinite}
.dissolve{opacity:0;animation:dissolve 9s linear infinite}
.bubble{opacity:0;animation:bubble 9s linear infinite}
@keyframes reveal{from{opacity:0}to{opacity:1}}
@keyframes early{0%,22%{opacity:1}28%,96%{opacity:0}100%{opacity:1}}
@keyframes late{0%,27%{opacity:0}34%,94%{opacity:1}100%{opacity:0}}
@keyframes grow{0%,15%{transform:scaleY(.22)}65%,92%{transform:scaleY(1)}100%{transform:scaleY(.22)}}
@keyframes shrink{0%,15%{transform:scaleY(1)}65%,92%{transform:scaleY(.22)}100%{transform:scaleY(1)}}
@keyframes dissolve{0%,18%{opacity:1}55%,94%{opacity:0}100%{opacity:1}}
@keyframes bubble{0%,15%{opacity:0;transform:translateY(0)}20%{opacity:1}65%{opacity:1;transform:translateY(-145px)}70%,99%{opacity:0;transform:translateY(-165px)}100%{opacity:0;transform:translateY(0)}}
.rope0{animation:rope0 9s ease infinite}@keyframes rope0{0%,0%{transform:scaleY(.02)}35%,94%{transform:scaleY(1)}100%{transform:scaleY(.02)}}.disc0{opacity:0;transform:translateY(192px);animation:disc0 9s ease infinite}@keyframes disc0{0%,0%{opacity:1;transform:translateY(0)}30%{opacity:.3;transform:translateY(192px)}36%,94%{opacity:0;transform:translateY(192px)}100%{opacity:1;transform:translateY(0)}}.rope1{animation:rope1 9s ease infinite}@keyframes rope1{0%,22%{transform:scaleY(.02)}57%,94%{transform:scaleY(1)}100%{transform:scaleY(.02)}}.disc1{opacity:0;transform:translateY(48px);animation:disc1 9s ease infinite}@keyframes disc1{0%,22%{opacity:1;transform:translateY(0)}52%{opacity:.3;transform:translateY(48px)}58%,94%{opacity:0;transform:translateY(48px)}100%{opacity:1;transform:translateY(0)}}
@media(prefers-reduced-motion:reduce){svg *{animation:none!important;transition:none!important}.reveal,.late{opacity:1!important}.early,.dissolve,.bubble{opacity:0!important}.grow{transform:none!important}.shrink{transform:scaleY(.22)!important}}
</style>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="12" markerHeight="12" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L10 5 0 10Z" fill="var(--coral)"/></marker></defs>
<rect width="880" height="560" fill="var(--bg)"/>
<text x="24" y="43" class="title">Measuring water clarity with a Secchi disc</text>
<!-- Apparatus and observations; final result remains visible after its reveal. -->
<text x="209" y="100" class="" text-anchor="middle">Clear water</text><rect x="62" y="133" width="305" height="264" rx="8" fill="var(--teal)" opacity=".23"/><path d="M62 133H367" class="rule" /><text x="69" y="142" class="small">0 m</text><text x="69" y="190" class="small">2 m</text><text x="69" y="238" class="small">4 m</text><text x="69" y="286" class="small">6 m</text><text x="69" y="334" class="small">8 m</text><text x="69" y="382" class="small">10 m</text><path d="M172 116H302V134" class="apparatus" /><path d="M242 134V325"  style="transform-origin:242px 134px" class="rule rope0"/><g class="" transform="translate(242 133)"><g class="disc0" ><circle cx="0" cy="0" r="20" fill="#ffffff" stroke="#202020" stroke-width="2"/><path d="M0-20A20 20 0 0 1 20 0H0ZM0 20A20 20 0 0 1-20 0H0Z" class="" fill="#202020"/></g></g><g class="reveal" style="--delay:3s"><path d="M139 325H365" class="rule" stroke-dasharray="7 6"/><text x="312" y="313" class="small" text-anchor="middle">≈ 8 m</text></g><text x="627" y="100" class="" text-anchor="middle">Murky water</text><rect x="480" y="133" width="305" height="264" rx="8" fill="var(--soft)" opacity=".23"/><path d="M480 133H785" class="rule" /><text x="487" y="142" class="small">0 m</text><text x="487" y="190" class="small">2 m</text><text x="487" y="238" class="small">4 m</text><text x="487" y="286" class="small">6 m</text><text x="487" y="334" class="small">8 m</text><text x="487" y="382" class="small">10 m</text><path d="M590 116H720V134" class="apparatus" /><path d="M660 134V181"  style="transform-origin:660px 134px" class="rule rope1"/><g class="" transform="translate(660 133)"><g class="disc1" ><circle cx="0" cy="0" r="20" fill="#ffffff" stroke="#202020" stroke-width="2"/><path d="M0-20A20 20 0 0 1 20 0H0ZM0 20A20 20 0 0 1-20 0H0Z" class="" fill="#202020"/></g></g><g class="reveal" style="--delay:5s"><path d="M557 181H783" class="rule" stroke-dasharray="7 6"/><text x="730" y="169" class="small" text-anchor="middle">≈ 2 m</text></g><text x="440" y="427" class="small" text-anchor="middle">Secchi depth: disappearance depth · illustrative values</text><g class="reveal" style="--delay:6s"><rect x="22" y="441" width="836" height="103" rx="14" fill="var(--panel)" stroke="var(--coral)" stroke-width="2"/><text x="440" y="478" class="accent" text-anchor="middle">Greater Secchi depth = clearer water</text><text x="440" y="514" class="accent" text-anchor="middle">Measures clarity, not water depth.</text></g>
</svg>`,
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
    diagram: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 880 560" role="img" aria-labelledby="title desc">
<title id="title">Choosing how to view a specimen</title><desc id="desc">A crab has a broad shell, two pincers, eight walking legs and stalked eyes. A hand lens magnifies its external features. A light microscope views a thin tissue slide, with an inset showing cells. A camera and a photograph of the crab illustrate identification by classification features, not colour or size.</desc>
<style>:root{--bg:#e9f1f2;--panel:#ffffff;--ink:#0d2a37;--soft:#4d6c77;--line:#d2e0e3;--teal:#12a7bb;--deep:#0b6b79;--coral:#ff6a4d;--good:#1a9b6c;--amber:#f0a63c;--violet:#7a5bb0}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}}
:root[data-theme="dark"]{--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}

svg{display:block;height:auto;font-family:system-ui,sans-serif;background:var(--bg)}
text{fill:var(--ink);font-family:system-ui,"Segoe UI",Arial,sans-serif;font-size:28px;font-variant-numeric:tabular-nums}
.title{font-size:32px;font-weight:700}.small{font-size:24px}.big{font-size:36px;font-weight:700}
.soft{fill:var(--soft)}.accent{fill:var(--coral);font-weight:700}.good{fill:var(--good)}
.apparatus{fill:none;stroke:var(--deep);stroke-width:4;stroke-linejoin:round;stroke-linecap:round}
.rule{fill:none;stroke:var(--soft);stroke-width:2}.arrow{fill:none;stroke:var(--coral);stroke-width:4;marker-end:url(#arrow)}
.reveal{animation:reveal .45s ease-out var(--delay,5s) both}
.early{opacity:0;animation:early 9s linear infinite}.late{opacity:1;animation:late 9s linear infinite}
.grow{transform-origin:0 0;animation:grow 9s ease-in-out infinite}
.shrink{transform-origin:0 0;transform:scaleY(.22);animation:shrink 9s ease-in-out infinite}
.dissolve{opacity:0;animation:dissolve 9s linear infinite}
.bubble{opacity:0;animation:bubble 9s linear infinite}
@keyframes reveal{from{opacity:0}to{opacity:1}}
@keyframes early{0%,22%{opacity:1}28%,96%{opacity:0}100%{opacity:1}}
@keyframes late{0%,27%{opacity:0}34%,94%{opacity:1}100%{opacity:0}}
@keyframes grow{0%,15%{transform:scaleY(.22)}65%,92%{transform:scaleY(1)}100%{transform:scaleY(.22)}}
@keyframes shrink{0%,15%{transform:scaleY(1)}65%,92%{transform:scaleY(.22)}100%{transform:scaleY(1)}}
@keyframes dissolve{0%,18%{opacity:1}55%,94%{opacity:0}100%{opacity:1}}
@keyframes bubble{0%,15%{opacity:0;transform:translateY(0)}20%{opacity:1}65%{opacity:1;transform:translateY(-145px)}70%,99%{opacity:0;transform:translateY(-165px)}100%{opacity:0;transform:translateY(0)}}
.focus0{opacity:0;animation:focus0 9s linear infinite}@keyframes focus0{0%,0%{opacity:0}4%,21%{opacity:1}25%,100%{opacity:0}}.focus1{opacity:0;animation:focus1 9s linear infinite}@keyframes focus1{0%,23%{opacity:0}27%,44%{opacity:1}48%,100%{opacity:0}}.focus2{opacity:0;animation:focus2 9s linear infinite}@keyframes focus2{0%,46%{opacity:0}50%,67%{opacity:1}71%,100%{opacity:0}}.lens{animation:lens 9s ease infinite;transform-origin:185px 185px}@keyframes lens{0%,10%,100%{transform:scale(.85)}20%,90%{transform:scale(1)}}
@media(prefers-reduced-motion:reduce){svg *{animation:none!important;transition:none!important}.reveal,.late{opacity:1!important}.early,.dissolve,.bubble{opacity:0!important}.grow{transform:none!important}.shrink{transform:scaleY(.22)!important}}
</style>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="12" markerHeight="12" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L10 5 0 10Z" fill="var(--coral)"/></marker></defs>
<rect width="880" height="560" fill="var(--bg)"/>
<text x="24" y="43" class="title">Choosing how to view a specimen</text>
<!-- Apparatus and observations; final result remains visible after its reveal. -->
<rect x="22" y="89" width="260" height="292" rx="10" fill="var(--panel)" /><rect x="22" y="89" width="260" height="292" rx="12" fill="none" stroke="var(--coral)" stroke-width="3" class="focus0"/><rect x="310" y="89" width="260" height="292" rx="10" fill="var(--panel)" /><rect x="310" y="89" width="260" height="292" rx="12" fill="none" stroke="var(--coral)" stroke-width="3" class="focus1"/><rect x="598" y="89" width="260" height="292" rx="10" fill="var(--panel)" /><rect x="598" y="89" width="260" height="292" rx="12" fill="none" stroke="var(--coral)" stroke-width="3" class="focus2"/><text x="152" y="125" class="" text-anchor="middle">Whole crab</text><g class="" transform="translate(135 233)"><g class="" transform="scale(-1 1)"><path d="M29-8L54-13 78-3M33 2L62 5 83 23M30 13L57 25 70 45M23 22L41 43 43 59" class="" fill="none" stroke="var(--deep)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M25-17L42-31 49-46" class="" fill="none" stroke="var(--deep)" stroke-width="8" stroke-linecap="round"/><path d="M45-37Q32-43 39-59L47-71 49-52 59-66Q71-50 60-40Q53-35 45-37Z" class="" fill="var(--teal)" stroke="var(--deep)" stroke-width="2.5"/></g><g class="" transform="scale(1 1)"><path d="M29-8L54-13 78-3M33 2L62 5 83 23M30 13L57 25 70 45M23 22L41 43 43 59" class="" fill="none" stroke="var(--deep)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M25-17L42-31 49-46" class="" fill="none" stroke="var(--deep)" stroke-width="8" stroke-linecap="round"/><path d="M45-37Q32-43 39-59L47-71 49-52 59-66Q71-50 60-40Q53-35 45-37Z" class="" fill="var(--teal)" stroke="var(--deep)" stroke-width="2.5"/></g><path d="M-34-13Q-32-29 0-29Q32-29 34-13L39 4Q34 30 0 31Q-34 30-39 4Z" class="" fill="var(--teal)" stroke="var(--deep)" stroke-width="3"/><path d="M-25-10Q0-24 25-10M-18 14Q0 24 18 14" class="" fill="none" stroke="var(--panel)" stroke-width="2.5" opacity=".55"/><path d="M-12-25L-17-37M12-25L17-37" class="" stroke="var(--deep)" stroke-width="5" stroke-linecap="round"/><circle cx="-17" cy="-38" r="5" fill="var(--ink)" /><circle cx="17" cy="-38" r="5" fill="var(--ink)" /><circle cx="-18" cy="-39" r="1.5" fill="var(--panel)" /><circle cx="16" cy="-39" r="1.5" fill="var(--panel)" /></g><g class="lens" ><circle cx="185" cy="185" r="43" fill="none" stroke="var(--deep)" stroke-width="6"/><path d="M216 216L243 249" class="" stroke="var(--deep)" stroke-width="11" stroke-linecap="round"/><path d="M156 174Q163 157 178 156" class="" fill="none" stroke="var(--panel)" stroke-width="3"/></g><text x="152" y="350" class="accent" text-anchor="middle">Hand lens</text><text x="440" y="125" class="" text-anchor="middle">Thin tissue</text><path d="M490 171Q536 177 543 214Q550 246 524 278L528 292H492L496 274Q526 246 522 220Q520 198 482 195Z" class="" fill="var(--teal)" stroke="var(--deep)" stroke-width="3"/><path d="M465 143L489 155 472 198 448 185Z" class="" fill="var(--line)" stroke="var(--deep)" stroke-width="3"/><path d="M465 136L493 149 487 161 459 148Z" class="" fill="var(--deep)"/><path d="M449 184L474 196 470 204 445 192Z" class="" fill="var(--deep)"/><path d="M455 198L462 201 456 217 449 214Z" class="" fill="var(--teal)" stroke="var(--deep)" stroke-width="2"/><rect x="407" y="225" width="107" height="9" rx="2" fill="var(--deep)" /><rect x="423" y="217" width="57" height="7" rx="1" fill="var(--panel)" stroke="var(--soft)" stroke-width="2"/><rect x="443" y="218" width="16" height="5" rx="1" fill="var(--violet)" /><circle cx="525" cy="214" r="12" fill="var(--panel)" stroke="var(--deep)" stroke-width="4"/><circle cx="525" cy="214" r="4" fill="var(--deep)" /><path d="M410 285H534Q547 285 551 302H397Q398 289 410 285Z" class="" fill="var(--deep)"/><path d="M441 280V268Q454 253 468 268V280Z" class="" fill="var(--teal)" stroke="var(--deep)" stroke-width="2"/><circle cx="454" cy="265" r="7" fill="var(--panel)" /><g class="reveal" style="--delay:2s"><path d="M400 204L442 221" class="rule" stroke-dasharray="4 4"/><circle cx="364" cy="183" r="37" fill="var(--panel)" stroke="var(--deep)" stroke-width="3"/><rect x="343" y="156" width="20" height="17" rx="4" fill="none" stroke="var(--deep)" stroke-width="1.5"/><circle cx="352" cy="164" r="2.5" fill="var(--violet)" /><rect x="365" y="156" width="20" height="17" rx="4" fill="none" stroke="var(--deep)" stroke-width="1.5"/><circle cx="374" cy="164" r="2.5" fill="var(--violet)" /><rect x="343" y="175" width="20" height="17" rx="4" fill="none" stroke="var(--deep)" stroke-width="1.5"/><circle cx="352" cy="183" r="2.5" fill="var(--violet)" /><rect x="365" y="175" width="20" height="17" rx="4" fill="none" stroke="var(--deep)" stroke-width="1.5"/><circle cx="374" cy="183" r="2.5" fill="var(--violet)" /><rect x="343" y="194" width="20" height="17" rx="4" fill="none" stroke="var(--deep)" stroke-width="1.5"/><circle cx="352" cy="202" r="2.5" fill="var(--violet)" /><rect x="365" y="194" width="20" height="17" rx="4" fill="none" stroke="var(--deep)" stroke-width="1.5"/><circle cx="374" cy="202" r="2.5" fill="var(--violet)" /><text x="364" y="244" class="small" text-anchor="middle">Cells</text></g><text x="440" y="350" class="accent" text-anchor="middle">Light microscope</text><text x="728" y="125" class="" text-anchor="middle">Identify an animal</text><rect x="674" y="146" width="159" height="126" rx="4" fill="var(--panel)" stroke="var(--soft)" stroke-width="3"/><rect x="681" y="153" width="145" height="103" rx="1" fill="var(--bg)" /><g class="" transform="translate(753 212) scale(.67)"><g class="" transform="scale(-1 1)"><path d="M29-8L54-13 78-3M33 2L62 5 83 23M30 13L57 25 70 45M23 22L41 43 43 59" class="" fill="none" stroke="var(--deep)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M25-17L42-31 49-46" class="" fill="none" stroke="var(--deep)" stroke-width="8" stroke-linecap="round"/><path d="M45-37Q32-43 39-59L47-71 49-52 59-66Q71-50 60-40Q53-35 45-37Z" class="" fill="var(--teal)" stroke="var(--deep)" stroke-width="2.5"/></g><g class="" transform="scale(1 1)"><path d="M29-8L54-13 78-3M33 2L62 5 83 23M30 13L57 25 70 45M23 22L41 43 43 59" class="" fill="none" stroke="var(--deep)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/><path d="M25-17L42-31 49-46" class="" fill="none" stroke="var(--deep)" stroke-width="8" stroke-linecap="round"/><path d="M45-37Q32-43 39-59L47-71 49-52 59-66Q71-50 60-40Q53-35 45-37Z" class="" fill="var(--teal)" stroke="var(--deep)" stroke-width="2.5"/></g><path d="M-34-13Q-32-29 0-29Q32-29 34-13L39 4Q34 30 0 31Q-34 30-39 4Z" class="" fill="var(--teal)" stroke="var(--deep)" stroke-width="3"/><path d="M-25-10Q0-24 25-10M-18 14Q0 24 18 14" class="" fill="none" stroke="var(--panel)" stroke-width="2.5" opacity=".55"/><path d="M-12-25L-17-37M12-25L17-37" class="" stroke="var(--deep)" stroke-width="5" stroke-linecap="round"/><circle cx="-17" cy="-38" r="5" fill="var(--ink)" /><circle cx="17" cy="-38" r="5" fill="var(--ink)" /><circle cx="-18" cy="-39" r="1.5" fill="var(--panel)" /><circle cx="16" cy="-39" r="1.5" fill="var(--panel)" /></g><path d="M619 255H641L650 244H680L689 255H737Q745 255 745 264V306Q745 313 737 313H619Q611 313 611 305V264Q611 255 619 255Z" class="" fill="var(--deep)" stroke="var(--ink)" stroke-width="2"/><rect x="621" y="250" width="13" height="5" rx="1" fill="var(--soft)" /><rect x="707" y="263" width="24" height="10" rx="2" fill="var(--panel)" /><circle cx="668" cy="284" r="25" fill="var(--panel)" /><circle cx="668" cy="284" r="19" fill="var(--teal)" stroke="var(--ink)" stroke-width="2"/><circle cx="668" cy="284" r="11" fill="var(--ink)" /><circle cx="662" cy="278" r="4" fill="var(--panel)" opacity=".8"/><text x="728" y="350" class="accent" text-anchor="middle">Camera + photo</text><g class="reveal" style="--delay:5s"><text x="440" y="420" class="accent" text-anchor="middle">✗ A hand lens cannot show cells.</text></g><g class="reveal" style="--delay:6s"><rect x="22" y="441" width="836" height="103" rx="14" fill="var(--panel)" stroke="var(--coral)" stroke-width="2"/><text x="440" y="478" class="accent" text-anchor="middle">Match the tool to the scale.</text><text x="440" y="514" class="accent" text-anchor="middle">Classify by features, not colour or size.</text></g>
</svg>`,
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
    diagram: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 880 560" role="img" aria-labelledby="title desc">
<title id="title">Making a biological drawing</title><desc id="desc">A poor fish drawing has colour, shading, broken sketchy lines and a curved label. The good drawing builds a single clean outline with correct proportions and a straight ruled label touching the tail.</desc>
<style>:root{--bg:#e9f1f2;--panel:#ffffff;--ink:#0d2a37;--soft:#4d6c77;--line:#d2e0e3;--teal:#12a7bb;--deep:#0b6b79;--coral:#ff6a4d;--good:#1a9b6c;--amber:#f0a63c;--violet:#7a5bb0}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}}
:root[data-theme="dark"]{--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}

svg{display:block;height:auto;font-family:system-ui,sans-serif;background:var(--bg)}
text{fill:var(--ink);font-family:system-ui,"Segoe UI",Arial,sans-serif;font-size:28px;font-variant-numeric:tabular-nums}
.title{font-size:32px;font-weight:700}.small{font-size:24px}.big{font-size:36px;font-weight:700}
.soft{fill:var(--soft)}.accent{fill:var(--coral);font-weight:700}.good{fill:var(--good)}
.apparatus{fill:none;stroke:var(--deep);stroke-width:4;stroke-linejoin:round;stroke-linecap:round}
.rule{fill:none;stroke:var(--soft);stroke-width:2}.arrow{fill:none;stroke:var(--coral);stroke-width:4;marker-end:url(#arrow)}
.reveal{animation:reveal .45s ease-out var(--delay,5s) both}
.early{opacity:0;animation:early 9s linear infinite}.late{opacity:1;animation:late 9s linear infinite}
.grow{transform-origin:0 0;animation:grow 9s ease-in-out infinite}
.shrink{transform-origin:0 0;transform:scaleY(.22);animation:shrink 9s ease-in-out infinite}
.dissolve{opacity:0;animation:dissolve 9s linear infinite}
.bubble{opacity:0;animation:bubble 9s linear infinite}
@keyframes reveal{from{opacity:0}to{opacity:1}}
@keyframes early{0%,22%{opacity:1}28%,96%{opacity:0}100%{opacity:1}}
@keyframes late{0%,27%{opacity:0}34%,94%{opacity:1}100%{opacity:0}}
@keyframes grow{0%,15%{transform:scaleY(.22)}65%,92%{transform:scaleY(1)}100%{transform:scaleY(.22)}}
@keyframes shrink{0%,15%{transform:scaleY(1)}65%,92%{transform:scaleY(.22)}100%{transform:scaleY(1)}}
@keyframes dissolve{0%,18%{opacity:1}55%,94%{opacity:0}100%{opacity:1}}
@keyframes bubble{0%,15%{opacity:0;transform:translateY(0)}20%{opacity:1}65%{opacity:1;transform:translateY(-145px)}70%,99%{opacity:0;transform:translateY(-165px)}100%{opacity:0;transform:translateY(0)}}
.draw-outline{stroke-dasharray:1000;animation:draw 9s ease infinite}@keyframes draw{0%,10%{stroke-dashoffset:1000}50%,94%{stroke-dashoffset:0}100%{stroke-dashoffset:1000}}
@media(prefers-reduced-motion:reduce){svg *{animation:none!important;transition:none!important}.reveal,.late{opacity:1!important}.early,.dissolve,.bubble{opacity:0!important}.grow{transform:none!important}.shrink{transform:scaleY(.22)!important}}
</style>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="12" markerHeight="12" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L10 5 0 10Z" fill="var(--coral)"/></marker></defs>
<rect width="880" height="560" fill="var(--bg)"/>
<text x="24" y="43" class="title">Making a biological drawing</text>
<!-- Apparatus and observations; final result remains visible after its reveal. -->
<text x="217" y="103" class="accent" text-anchor="middle">✗ Poor</text><text x="650" y="103" class="good" text-anchor="middle">✓ Good</text><rect x="25" y="118" width="383" height="197" rx="10" fill="var(--panel)" /><rect x="451" y="118" width="404" height="197" rx="10" fill="var(--panel)" /><g class="" transform="translate(71 213)"><path d="M0 0Q45-51 115-17L156-44 147 0 156 42 114 18Q46 48 0 0Z" class="" fill="var(--teal)" stroke="var(--soft)" stroke-width="3" stroke-dasharray="7 4"/><circle cx="26" cy="-4" r="5" fill="var(--ink)" /><path d="M27 10l28-29m-6 43 24-37m-5 33 25-38m-4 30 17-25" class="rule" /></g><path d="M219 211Q300 167 307 215" class="rule" /><text x="305" y="233" class="small">tail</text><g class="" transform="translate(492 213)"><path d="M0 0Q45-51 115-17L156-44 147 0 156 42 114 18Q46 48 0 0Z" class="draw-outline" fill="none" stroke="var(--ink)" stroke-width="2.5"/><circle cx="26" cy="-4" r="4" fill="none" stroke="var(--ink)" stroke-width="2"/></g><g class="reveal" style="--delay:4s"><path d="M644 190H756" class="rule" /><text x="761" y="198" class="small">tail</text></g><text x="37" y="350" class="small">✗ shading / colour</text><text x="37" y="382" class="small">✗ sketchy lines</text><text x="37" y="414" class="small">✗ curved label line</text><g class="reveal" style="--delay:4.7s"><text x="468" y="350" class="small">✓ large; correct proportions</text><text x="468" y="382" class="small">✓ clean lines; no colour</text><text x="468" y="414" class="small">✓ no shading; ruled labels</text></g><g class="reveal" style="--delay:6s"><rect x="22" y="441" width="836" height="103" rx="14" fill="var(--panel)" stroke="var(--coral)" stroke-width="2"/><text x="440" y="478" class="accent" text-anchor="middle">Draw only what you see.</text><text x="440" y="514" class="accent" text-anchor="middle">Ruled labels must touch the feature.</text></g>
</svg>`,
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
    diagram: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 880 560" role="img" aria-labelledby="title desc">
<title id="title">Using a dichotomous key</title><desc id="desc">Inspect the unknown coiled shell. Follow yes at has a shell, then yes at coiled shell, to identify a periwinkle. Coral connectors trace the chosen route in order; unused alternatives dim. The completed route and answer remain visible. Each question divides the remaining possibilities into two groups.</desc>
<style>:root{--bg:#e9f1f2;--panel:#ffffff;--ink:#0d2a37;--soft:#4d6c77;--line:#d2e0e3;--teal:#12a7bb;--deep:#0b6b79;--coral:#ff6a4d;--good:#1a9b6c;--amber:#f0a63c;--violet:#7a5bb0}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}}
:root[data-theme="dark"]{--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}

svg{display:block;height:auto;font-family:system-ui,sans-serif;background:var(--bg)}
text{fill:var(--ink);font-family:system-ui,"Segoe UI",Arial,sans-serif;font-size:28px;font-variant-numeric:tabular-nums}
.title{font-size:32px;font-weight:700}.small{font-size:24px}.big{font-size:36px;font-weight:700}
.soft{fill:var(--soft)}.accent{fill:var(--coral);font-weight:700}.good{fill:var(--good)}
.apparatus{fill:none;stroke:var(--deep);stroke-width:4;stroke-linejoin:round;stroke-linecap:round}
.rule{fill:none;stroke:var(--soft);stroke-width:2}.arrow{fill:none;stroke:var(--coral);stroke-width:4;marker-end:url(#arrow)}
.reveal{animation:reveal .45s ease-out var(--delay,5s) both}
.early{opacity:0;animation:early 9s linear infinite}.late{opacity:1;animation:late 9s linear infinite}
.grow{transform-origin:0 0;animation:grow 9s ease-in-out infinite}
.shrink{transform-origin:0 0;transform:scaleY(.22);animation:shrink 9s ease-in-out infinite}
.dissolve{opacity:0;animation:dissolve 9s linear infinite}
.bubble{opacity:0;animation:bubble 9s linear infinite}
@keyframes reveal{from{opacity:0}to{opacity:1}}
@keyframes early{0%,22%{opacity:1}28%,96%{opacity:0}100%{opacity:1}}
@keyframes late{0%,27%{opacity:0}34%,94%{opacity:1}100%{opacity:0}}
@keyframes grow{0%,15%{transform:scaleY(.22)}65%,92%{transform:scaleY(1)}100%{transform:scaleY(.22)}}
@keyframes shrink{0%,15%{transform:scaleY(1)}65%,92%{transform:scaleY(.22)}100%{transform:scaleY(1)}}
@keyframes dissolve{0%,18%{opacity:1}55%,94%{opacity:0}100%{opacity:1}}
@keyframes bubble{0%,15%{opacity:0;transform:translateY(0)}20%{opacity:1}65%{opacity:1;transform:translateY(-145px)}70%,99%{opacity:0;transform:translateY(-165px)}100%{opacity:0;transform:translateY(0)}}

.key-connector{fill:none;stroke:var(--soft);stroke-width:2.5;opacity:.45;stroke-linejoin:round}
.selected-path{fill:none;stroke:var(--coral);stroke-width:4;stroke-linecap:round;stroke-linejoin:round}
.first-path{stroke-dasharray:340;animation:first-branch .9s ease-out 1.1s both}
.second-path{stroke-dasharray:210;animation:second-branch .9s ease-out 3.1s both}
@keyframes first-branch{from{stroke-dashoffset:340}to{stroke-dashoffset:0}}
@keyframes second-branch{from{stroke-dashoffset:210}to{stroke-dashoffset:0}}
.unused-right{opacity:.45;animation:dim-branch .4s ease 2s both}
.unused-left{opacity:.45;animation:dim-branch .4s ease 4s both}
@keyframes dim-branch{from{opacity:1}to{opacity:.45}}

@media(prefers-reduced-motion:reduce){svg *{animation:none!important;transition:none!important}.reveal,.late{opacity:1!important}.early,.dissolve,.bubble{opacity:0!important}.grow{transform:none!important}.shrink{transform:scaleY(.22)!important}}
</style>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="12" markerHeight="12" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L10 5 0 10Z" fill="var(--coral)"/></marker></defs>
<rect width="880" height="560" fill="var(--bg)"/>
<text x="24" y="43" class="title">Using a dichotomous key</text>
<!-- Apparatus and observations; final result remains visible after its reveal. -->
<rect x="24" y="78" width="230" height="90" rx="10" fill="var(--panel)" /><g class="" transform="translate(68 126)"><path d="M-26 14Q-34-6-17-24Q1-39 21-22Q37-8 23 13L11 24Q-6 32-26 14Z" class="" fill="var(--teal)" fill-opacity=".2" stroke="var(--deep)" stroke-width="3"/><path d="M-17 11Q-28-7-8-18Q12-28 22-9Q30 7 11 15Q-6 23-12 8Q-18-3-5-8Q7-12 10-2Q13 7 4 7Q-2 7 0 2" class="apparatus" /></g><text x="111" y="114" class="small">Unknown</text><text x="111" y="144" class="small">coiled shell</text><path d="M262 124H301" class="arrow" /><text x="600" y="111" class="small">Follow the matching</text><text x="600" y="142" class="small">answer at each step.</text><rect x="310" y="112" width="260" height="56" rx="12" fill="var(--panel)" stroke="var(--line)" stroke-width="2"/><text x="440" y="149" class="" text-anchor="middle">Has a shell?</text><g class="reveal" style="--delay:0.5s"><rect x="310" y="112" width="260" height="56" rx="12" fill="none" stroke="var(--coral)" stroke-width="3"/></g><path d="M440 168V198Q440 206 432 206H233Q225 206 225 214V242" class="key-connector" /><path d="M440 168V198Q440 206 448 206H647Q655 206 655 214V242" class="key-connector" /><path d="M225 302V321Q225 329 217 329H129Q121 329 121 337V374" class="key-connector" /><path d="M225 302V321Q225 329 233 329H321Q329 329 329 337V374" class="key-connector" /><path d="M655 302V321Q655 329 647 329H559Q551 329 551 337V374" class="key-connector" /><path d="M655 302V321Q655 329 663 329H751Q759 329 759 337V374" class="key-connector" /><path d="M440 168V198Q440 206 432 206H233Q225 206 225 214V242" class="selected-path first-path" /><path d="M225 302V321Q225 329 217 329H129Q121 329 121 337V374" class="selected-path second-path" /><rect x="300" y="190" width="56" height="30" rx="8" fill="var(--bg)" /><text x="328" y="215" class="small" text-anchor="middle">Yes</text><rect x="522" y="190" width="56" height="30" rx="8" fill="var(--bg)" /><text x="550" y="215" class="small" text-anchor="middle">No</text><rect x="143" y="313" width="56" height="30" rx="8" fill="var(--bg)" /><text x="171" y="338" class="small" text-anchor="middle">Yes</text><rect x="250" y="313" width="56" height="30" rx="8" fill="var(--bg)" /><text x="278" y="338" class="small" text-anchor="middle">No</text><rect x="574" y="313" width="56" height="30" rx="8" fill="var(--bg)" /><text x="602" y="338" class="small" text-anchor="middle">Yes</text><rect x="679" y="313" width="56" height="30" rx="8" fill="var(--bg)" /><text x="707" y="338" class="small" text-anchor="middle">No</text><rect x="60" y="244" width="330" height="58" rx="12" fill="var(--panel)" stroke="var(--line)" stroke-width="2"/><text x="225" y="282" class="" text-anchor="middle">Coiled shell?</text><g class="reveal" style="--delay:2.2s"><rect x="60" y="244" width="330" height="58" rx="12" fill="none" stroke="var(--coral)" stroke-width="3"/></g><g class="unused-right" ><rect x="490" y="244" width="330" height="58" rx="12" fill="var(--panel)" stroke="var(--line)" stroke-width="2"/><text x="655" y="282" class="" text-anchor="middle">Has tentacles?</text></g><g class="chosen-name" ><rect x="27" y="376" width="188" height="48" rx="10" fill="var(--panel)" stroke="var(--line)" stroke-width="2"/><text x="121" y="409" class="" text-anchor="middle">Periwinkle</text></g><g class="unused-left" ><rect x="235" y="376" width="188" height="48" rx="10" fill="var(--panel)" stroke="var(--line)" stroke-width="2"/><text x="329" y="409" class="" text-anchor="middle">Mussel</text></g><g class="unused-right" ><rect x="457" y="376" width="188" height="48" rx="10" fill="var(--panel)" stroke="var(--line)" stroke-width="2"/><text x="551" y="409" class="" text-anchor="middle">Anemone</text></g><g class="unused-right" ><rect x="665" y="376" width="188" height="48" rx="10" fill="var(--panel)" stroke="var(--line)" stroke-width="2"/><text x="759" y="409" class="" text-anchor="middle">Fish</text></g><g class="reveal" style="--delay:4.2s"><rect x="27" y="376" width="188" height="48" rx="10" fill="var(--panel)" stroke="var(--coral)" stroke-width="3"/><text x="121" y="409" class="accent" text-anchor="middle">Periwinkle</text></g><g class="reveal" style="--delay:4.8s"><rect x="22" y="441" width="836" height="103" rx="14" fill="var(--panel)" stroke="var(--coral)" stroke-width="2"/><text x="440" y="478" class="accent" text-anchor="middle">Shell? Yes → Coiled? Yes → Periwinkle</text><text x="440" y="514" class="accent" text-anchor="middle">Use paired questions about visible features.</text></g>
</svg>`,
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
    diagram: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 880 560" role="img" aria-labelledby="title desc">
<title id="title">Burning food to measure energy</title><desc id="desc">A food sample burns below a clamped boiling tube of water. Record the starting and maximum water temperatures. Here the thermometer rises from twenty to forty-five degrees Celsius: a rise of twenty-five. Use the same volume of water, the same distance from food to tube and the same starting temperature. Compare energy per gram of food.</desc>
<style>:root{--bg:#e9f1f2;--panel:#ffffff;--ink:#0d2a37;--soft:#4d6c77;--line:#d2e0e3;--teal:#12a7bb;--deep:#0b6b79;--coral:#ff6a4d;--good:#1a9b6c;--amber:#f0a63c;--violet:#7a5bb0}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}}
:root[data-theme="dark"]{--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}

svg{display:block;height:auto;font-family:system-ui,sans-serif;background:var(--bg)}
text{fill:var(--ink);font-family:system-ui,"Segoe UI",Arial,sans-serif;font-size:28px;font-variant-numeric:tabular-nums}
.title{font-size:32px;font-weight:700}.small{font-size:24px}.big{font-size:36px;font-weight:700}
.soft{fill:var(--soft)}.accent{fill:var(--coral);font-weight:700}.good{fill:var(--good)}
.apparatus{fill:none;stroke:var(--deep);stroke-width:4;stroke-linejoin:round;stroke-linecap:round}
.rule{fill:none;stroke:var(--soft);stroke-width:2}.arrow{fill:none;stroke:var(--coral);stroke-width:4;marker-end:url(#arrow)}
.reveal{animation:reveal .45s ease-out var(--delay,5s) both}
.early{opacity:0;animation:early 9s linear infinite}.late{opacity:1;animation:late 9s linear infinite}
.grow{transform-origin:0 0;animation:grow 9s ease-in-out infinite}
.shrink{transform-origin:0 0;transform:scaleY(.22);animation:shrink 9s ease-in-out infinite}
.dissolve{opacity:0;animation:dissolve 9s linear infinite}
.bubble{opacity:0;animation:bubble 9s linear infinite}
@keyframes reveal{from{opacity:0}to{opacity:1}}
@keyframes early{0%,22%{opacity:1}28%,96%{opacity:0}100%{opacity:1}}
@keyframes late{0%,27%{opacity:0}34%,94%{opacity:1}100%{opacity:0}}
@keyframes grow{0%,15%{transform:scaleY(.22)}65%,92%{transform:scaleY(1)}100%{transform:scaleY(.22)}}
@keyframes shrink{0%,15%{transform:scaleY(1)}65%,92%{transform:scaleY(.22)}100%{transform:scaleY(1)}}
@keyframes dissolve{0%,18%{opacity:1}55%,94%{opacity:0}100%{opacity:1}}
@keyframes bubble{0%,15%{opacity:0;transform:translateY(0)}20%{opacity:1}65%{opacity:1;transform:translateY(-145px)}70%,99%{opacity:0;transform:translateY(-165px)}100%{opacity:0;transform:translateY(0)}}
.flame{animation:flame 9s ease infinite;transform-origin:240px 343px}@keyframes flame{0%,8%{opacity:0;transform:scale(.7)}16%,65%{opacity:1;transform:scale(1)}78%,100%{opacity:0;transform:scale(.7)}}
@media(prefers-reduced-motion:reduce){svg *{animation:none!important;transition:none!important}.reveal,.late{opacity:1!important}.early,.dissolve,.bubble{opacity:0!important}.grow{transform:none!important}.shrink{transform:scaleY(.22)!important}}
</style>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="12" markerHeight="12" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L10 5 0 10Z" fill="var(--coral)"/></marker></defs>
<rect width="880" height="560" fill="var(--bg)"/>
<text x="24" y="43" class="title">Burning food to measure energy</text>
<!-- Apparatus and observations; final result remains visible after its reveal. -->
<path d="M74 393H326M112 391V95H286" class="apparatus" /><path d="M188 130H287" class="apparatus" /><path d="M222 105V267Q222 294 253 294Q284 294 284 267V105" class="apparatus" /><rect x="227" y="169" width="52" height="119" rx="18" fill="var(--teal)" opacity=".35"/><rect x="241" y="103" width="28" height="149" rx="14" fill="var(--panel)" stroke="var(--deep)" stroke-width="3"/><g class="" transform="translate(250 244)"><g class="grow" ><rect x="0" y="-133" width="10" height="133" rx="5" fill="var(--coral)" /></g></g><circle cx="255" cy="252" r="22" fill="var(--panel)" stroke="var(--deep)" stroke-width="3"/><circle cx="255" cy="252" r="13" fill="var(--coral)" /><path d="M240 392V353" class="apparatus" /><circle cx="240" cy="343" r="12" fill="var(--soft)" /><g class="flame" ><path d="M220 337Q209 312 236 289Q230 309 252 318Q266 336 241 344Z" class="" fill="var(--amber)"/><path d="M230 337Q226 320 240 312Q242 326 249 337Z" class="" fill="var(--coral)"/></g><text x="45" y="427" class="small">Food on a mounted needle</text><text x="399" y="121" class="">Illustrative readings</text><text x="399" y="163" class="">Start: 20 °C</text><g class="reveal" style="--delay:4s"><text x="399" y="215" class="accent">Maximum: 45 °C</text><text x="399" y="257" class="accent">Rise: 25 °C</text></g><text x="399" y="309" class="small">• Same volume of water</text><text x="399" y="343" class="small">• Same distance from food to tube</text><text x="399" y="377" class="small">• Same starting temperature</text><text x="399" y="411" class="small">• Compare energy per gram of food</text><g class="reveal" style="--delay:5s"><rect x="22" y="441" width="836" height="103" rx="14" fill="var(--panel)" stroke="var(--coral)" stroke-width="2"/><text x="440" y="478" class="accent" text-anchor="middle">Burned food → heats the water</text><text x="440" y="514" class="accent" text-anchor="middle">→ measure water temperature rise</text></g>
</svg>`,
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
      "The energy from the burning food heats the water, so the temperature rise measures the energy released — burning transfers energy, it doesn't destroy it.",
      "Compare foods per gram, not per piece.",
      "Heat lost to the air and the glass means the water warms less than it should, so the energy you calculate from the temperature rise is an underestimate (too low).",
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
    diagram: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 880 560" role="img" aria-labelledby="title desc">
<title id="title">Light intensity and photosynthesis</title><desc id="desc">Pondweed, cut end up, sits in a boiling tube in a water bath. A close lamp produces more oxygen bubbles per minute; moving it farther away reduces the bubble rate. The water bath controls temperature.</desc>
<style>:root{--bg:#e9f1f2;--panel:#ffffff;--ink:#0d2a37;--soft:#4d6c77;--line:#d2e0e3;--teal:#12a7bb;--deep:#0b6b79;--coral:#ff6a4d;--good:#1a9b6c;--amber:#f0a63c;--violet:#7a5bb0}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}}
:root[data-theme="dark"]{--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}

svg{display:block;height:auto;font-family:system-ui,sans-serif;background:var(--bg)}
text{fill:var(--ink);font-family:system-ui,"Segoe UI",Arial,sans-serif;font-size:28px;font-variant-numeric:tabular-nums}
.title{font-size:32px;font-weight:700}.small{font-size:24px}.big{font-size:36px;font-weight:700}
.soft{fill:var(--soft)}.accent{fill:var(--coral);font-weight:700}.good{fill:var(--good)}
.apparatus{fill:none;stroke:var(--deep);stroke-width:4;stroke-linejoin:round;stroke-linecap:round}
.rule{fill:none;stroke:var(--soft);stroke-width:2}.arrow{fill:none;stroke:var(--coral);stroke-width:4;marker-end:url(#arrow)}
.reveal{animation:reveal .45s ease-out var(--delay,5s) both}
.early{opacity:0;animation:early 9s linear infinite}.late{opacity:1;animation:late 9s linear infinite}
.grow{transform-origin:0 0;animation:grow 9s ease-in-out infinite}
.shrink{transform-origin:0 0;transform:scaleY(.22);animation:shrink 9s ease-in-out infinite}
.dissolve{opacity:0;animation:dissolve 9s linear infinite}
.bubble{opacity:0;animation:bubble 9s linear infinite}
@keyframes reveal{from{opacity:0}to{opacity:1}}
@keyframes early{0%,22%{opacity:1}28%,96%{opacity:0}100%{opacity:1}}
@keyframes late{0%,27%{opacity:0}34%,94%{opacity:1}100%{opacity:0}}
@keyframes grow{0%,15%{transform:scaleY(.22)}65%,92%{transform:scaleY(1)}100%{transform:scaleY(.22)}}
@keyframes shrink{0%,15%{transform:scaleY(1)}65%,92%{transform:scaleY(.22)}100%{transform:scaleY(1)}}
@keyframes dissolve{0%,18%{opacity:1}55%,94%{opacity:0}100%{opacity:1}}
@keyframes bubble{0%,15%{opacity:0;transform:translateY(0)}20%{opacity:1}65%{opacity:1;transform:translateY(-145px)}70%,99%{opacity:0;transform:translateY(-165px)}100%{opacity:0;transform:translateY(0)}}
.lamp{transform:translateX(220px);animation:lamp 9s ease infinite}@keyframes lamp{0%,25%{transform:translateX(0)}48%,92%{transform:translateX(220px)}100%{transform:translateX(0)}}.b0{opacity:0;animation:oxygen 9s linear 0.0s infinite}.b1{opacity:0;animation:oxygen 9s linear 0.25s infinite}.b2{opacity:0;animation:oxygen 9s linear 0.5s infinite}.b3{opacity:0;animation:oxygen 9s linear 0.75s infinite}@keyframes oxygen{0%{opacity:0;transform:translateY(0)}3%{opacity:1}12%{opacity:0;transform:translateY(-83px)}13%{opacity:0;transform:translateY(0)}16%{opacity:1}25%{opacity:0;transform:translateY(-83px)}26%{opacity:0;transform:translateY(0)}29%{opacity:1}38%{opacity:0;transform:translateY(-83px)}39%,65%{opacity:0;transform:translateY(0)}68%{opacity:1}80%{opacity:0;transform:translateY(-83px)}100%{opacity:0}}
@media(prefers-reduced-motion:reduce){svg *{animation:none!important;transition:none!important}.reveal,.late{opacity:1!important}.early,.dissolve,.bubble{opacity:0!important}.grow{transform:none!important}.shrink{transform:scaleY(.22)!important}}
</style>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="12" markerHeight="12" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L10 5 0 10Z" fill="var(--coral)"/></marker></defs>
<rect width="880" height="560" fill="var(--bg)"/>
<text x="24" y="43" class="title">Light intensity and photosynthesis</text>
<!-- Apparatus and observations; final result remains visible after its reveal. -->
<rect x="50" y="238" width="326" height="142" rx="12" fill="var(--teal)" class="" opacity=".28"/><path d="M45 173V367Q45 385 63 385H363Q381 385 381 367V173" class="apparatus" /><path d="M50 238H376" class="rule" /><path d="M191 128V334Q191 355 221 355Q251 355 251 334V128" class="apparatus" /><rect x="196" y="177" width="50" height="174" rx="15" fill="var(--teal)" opacity=".25"/><path d="M220 321V231M220 311q-29 0-25-23q22 3 25 23M220 283q27-4 22-26q-19 6-22 26M220 264q-23-5-20-23q18 4 20 23" class="" stroke="var(--good)" stroke-width="4" fill="none"/><text x="45" y="118" class="small">Cut end up</text><path d="M170 125L217 231" class="rule" /><g class="" transform="translate(520 217)"><g class="lamp" ><path d="M0 0L-48-35V35ZM0 0H18V119M-12 120H48" class="apparatus" /><path d="M-56-27L-150-50M-56 0H-150M-56 27L-150 50" class="" stroke="var(--amber)" stroke-width="3"/></g></g><path d="M386 357H812" class="rule" /><path d="M400 351V367" class="rule" /><path d="M430 351V367" class="rule" /><path d="M460 351V367" class="rule" /><path d="M490 351V367" class="rule" /><path d="M520 351V367" class="rule" /><path d="M550 351V367" class="rule" /><path d="M580 351V367" class="rule" /><path d="M610 351V367" class="rule" /><path d="M640 351V367" class="rule" /><path d="M670 351V367" class="rule" /><path d="M700 351V367" class="rule" /><path d="M730 351V367" class="rule" /><path d="M760 351V367" class="rule" /><path d="M790 351V367" class="rule" /><text x="583" y="397" class="small" text-anchor="middle">Measured distance</text><g class="early" ><text x="446" y="99" class="small">Close lamp</text><text x="446" y="134" class="small">Many bubbles / minute</text></g><g class="late" ><text x="446" y="99" class="small">Distant lamp</text><text x="446" y="134" class="small">Fewer bubbles / minute</text></g><circle cx="220" cy="223" r="5" fill="none" stroke="var(--deep)" stroke-width="2" class="oxygen b0"/><circle cx="223" cy="223" r="5" fill="none" stroke="var(--deep)" stroke-width="2" class="oxygen b1"/><circle cx="220" cy="223" r="5" fill="none" stroke="var(--deep)" stroke-width="2" class="oxygen b2"/><circle cx="223" cy="223" r="5" fill="none" stroke="var(--deep)" stroke-width="2" class="oxygen b3"/><text x="43" y="416" class="small">Water bath: keeps temperature constant</text><g class="reveal" style="--delay:5s"><rect x="22" y="441" width="836" height="103" rx="14" fill="var(--panel)" stroke="var(--coral)" stroke-width="2"/><text x="440" y="478" class="accent" text-anchor="middle">Closer lamp → more light → faster photosynthesis</text><text x="440" y="514" class="accent" text-anchor="middle">Bubbles are oxygen; control temperature.</text></g>
</svg>`,
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
    diagram: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 880 560" role="img" aria-labelledby="title desc">
<title id="title">Random sampling with quadrats</title><desc id="desc">Three illustrative random one-square-metre quadrats contain two, four and three limpets. The mean is three per quadrat. A twenty-square-metre plot therefore has an estimated sixty limpets. Multiply the mean by total area divided by quadrat area.</desc>
<style>:root{--bg:#e9f1f2;--panel:#ffffff;--ink:#0d2a37;--soft:#4d6c77;--line:#d2e0e3;--teal:#12a7bb;--deep:#0b6b79;--coral:#ff6a4d;--good:#1a9b6c;--amber:#f0a63c;--violet:#7a5bb0}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}}
:root[data-theme="dark"]{--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}

svg{display:block;height:auto;font-family:system-ui,sans-serif;background:var(--bg)}
text{fill:var(--ink);font-family:system-ui,"Segoe UI",Arial,sans-serif;font-size:28px;font-variant-numeric:tabular-nums}
.title{font-size:32px;font-weight:700}.small{font-size:24px}.big{font-size:36px;font-weight:700}
.soft{fill:var(--soft)}.accent{fill:var(--coral);font-weight:700}.good{fill:var(--good)}
.apparatus{fill:none;stroke:var(--deep);stroke-width:4;stroke-linejoin:round;stroke-linecap:round}
.rule{fill:none;stroke:var(--soft);stroke-width:2}.arrow{fill:none;stroke:var(--coral);stroke-width:4;marker-end:url(#arrow)}
.reveal{animation:reveal .45s ease-out var(--delay,5s) both}
.early{opacity:0;animation:early 9s linear infinite}.late{opacity:1;animation:late 9s linear infinite}
.grow{transform-origin:0 0;animation:grow 9s ease-in-out infinite}
.shrink{transform-origin:0 0;transform:scaleY(.22);animation:shrink 9s ease-in-out infinite}
.dissolve{opacity:0;animation:dissolve 9s linear infinite}
.bubble{opacity:0;animation:bubble 9s linear infinite}
@keyframes reveal{from{opacity:0}to{opacity:1}}
@keyframes early{0%,22%{opacity:1}28%,96%{opacity:0}100%{opacity:1}}
@keyframes late{0%,27%{opacity:0}34%,94%{opacity:1}100%{opacity:0}}
@keyframes grow{0%,15%{transform:scaleY(.22)}65%,92%{transform:scaleY(1)}100%{transform:scaleY(.22)}}
@keyframes shrink{0%,15%{transform:scaleY(1)}65%,92%{transform:scaleY(.22)}100%{transform:scaleY(1)}}
@keyframes dissolve{0%,18%{opacity:1}55%,94%{opacity:0}100%{opacity:1}}
@keyframes bubble{0%,15%{opacity:0;transform:translateY(0)}20%{opacity:1}65%{opacity:1;transform:translateY(-145px)}70%,99%{opacity:0;transform:translateY(-165px)}100%{opacity:0;transform:translateY(0)}}
.quadrat{transform:translate(72px,144px);animation:quadrat 9s ease infinite}@keyframes quadrat{0%,22%{transform:translate(0,216px)}33%,49%{transform:translate(216px,72px)}60%,94%{transform:translate(72px,144px)}100%{transform:translate(0,216px)}}
@media(prefers-reduced-motion:reduce){svg *{animation:none!important;transition:none!important}.reveal,.late{opacity:1!important}.early,.dissolve,.bubble{opacity:0!important}.grow{transform:none!important}.shrink{transform:scaleY(.22)!important}}
</style>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="12" markerHeight="12" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L10 5 0 10Z" fill="var(--coral)"/></marker></defs>
<rect width="880" height="560" fill="var(--bg)"/>
<text x="24" y="43" class="title">Random sampling with quadrats</text>
<!-- Apparatus and observations; final result remains visible after its reveal. -->
<text x="248" y="86" class="small" text-anchor="middle">Shore plot · 20 m²</text><rect x="74" y="119" width="360" height="288" rx="0" fill="var(--panel)" /><path d="M74 119V407" class="rule" /><path d="M146 119V407" class="rule" /><path d="M218 119V407" class="rule" /><path d="M290 119V407" class="rule" /><path d="M362 119V407" class="rule" /><path d="M434 119V407" class="rule" /><path d="M74 119H434" class="rule" /><path d="M74 191H434" class="rule" /><path d="M74 263H434" class="rule" /><path d="M74 335H434" class="rule" /><path d="M74 407H434" class="rule" /><text x="110" y="111" class="small" text-anchor="middle">1</text><text x="182" y="111" class="small" text-anchor="middle">2</text><text x="254" y="111" class="small" text-anchor="middle">3</text><text x="326" y="111" class="small" text-anchor="middle">4</text><text x="398" y="111" class="small" text-anchor="middle">5</text><text x="52" y="166" class="small" text-anchor="middle">4</text><text x="52" y="238" class="small" text-anchor="middle">3</text><text x="52" y="310" class="small" text-anchor="middle">2</text><text x="52" y="382" class="small" text-anchor="middle">1</text><path d="M82 145Q91 127 100 145Z" class="" fill="var(--soft)"/><path d="M82 217Q91 199 100 217Z" class="" fill="var(--soft)"/><path d="M113 217Q122 199 131 217Z" class="" fill="var(--soft)"/><path d="M82 289Q91 271 100 289Z" class="" fill="var(--soft)"/><path d="M113 289Q122 271 131 289Z" class="" fill="var(--soft)"/><path d="M82 320Q91 302 100 320Z" class="" fill="var(--soft)"/><path d="M82 361Q91 343 100 361Z" class="" fill="var(--soft)"/><path d="M113 361Q122 343 131 361Z" class="" fill="var(--soft)"/><path d="M154 145Q163 127 172 145Z" class="" fill="var(--soft)"/><path d="M185 145Q194 127 203 145Z" class="" fill="var(--soft)"/><path d="M154 217Q163 199 172 217Z" class="" fill="var(--soft)"/><path d="M185 217Q194 199 203 217Z" class="" fill="var(--soft)"/><path d="M154 248Q163 230 172 248Z" class="" fill="var(--soft)"/><path d="M154 289Q163 271 172 289Z" class="" fill="var(--soft)"/><path d="M185 289Q194 271 203 289Z" class="" fill="var(--soft)"/><path d="M154 320Q163 302 172 320Z" class="" fill="var(--soft)"/><path d="M154 361Q163 343 172 361Z" class="" fill="var(--soft)"/><path d="M226 145Q235 127 244 145Z" class="" fill="var(--soft)"/><path d="M257 145Q266 127 275 145Z" class="" fill="var(--soft)"/><path d="M226 176Q235 158 244 176Z" class="" fill="var(--soft)"/><path d="M226 217Q235 199 244 217Z" class="" fill="var(--soft)"/><path d="M257 217Q266 199 275 217Z" class="" fill="var(--soft)"/><path d="M226 248Q235 230 244 248Z" class="" fill="var(--soft)"/><path d="M257 248Q266 230 275 248Z" class="" fill="var(--soft)"/><path d="M226 289Q235 271 244 289Z" class="" fill="var(--soft)"/><path d="M226 361Q235 343 244 361Z" class="" fill="var(--soft)"/><path d="M257 361Q266 343 275 361Z" class="" fill="var(--soft)"/><path d="M298 145Q307 127 316 145Z" class="" fill="var(--soft)"/><path d="M329 145Q338 127 347 145Z" class="" fill="var(--soft)"/><path d="M298 176Q307 158 316 176Z" class="" fill="var(--soft)"/><path d="M329 176Q338 158 347 176Z" class="" fill="var(--soft)"/><path d="M298 217Q307 199 316 217Z" class="" fill="var(--soft)"/><path d="M329 217Q338 199 347 217Z" class="" fill="var(--soft)"/><path d="M298 248Q307 230 316 248Z" class="" fill="var(--soft)"/><path d="M329 248Q338 230 347 248Z" class="" fill="var(--soft)"/><path d="M298 289Q307 271 316 289Z" class="" fill="var(--soft)"/><path d="M329 289Q338 271 347 289Z" class="" fill="var(--soft)"/><path d="M298 361Q307 343 316 361Z" class="" fill="var(--soft)"/><path d="M329 361Q338 343 347 361Z" class="" fill="var(--soft)"/><path d="M298 392Q307 374 316 392Z" class="" fill="var(--soft)"/><path d="M370 145Q379 127 388 145Z" class="" fill="var(--soft)"/><path d="M370 217Q379 199 388 217Z" class="" fill="var(--soft)"/><path d="M401 217Q410 199 419 217Z" class="" fill="var(--soft)"/><path d="M370 289Q379 271 388 289Z" class="" fill="var(--soft)"/><path d="M401 289Q410 271 419 289Z" class="" fill="var(--soft)"/><path d="M370 320Q379 302 388 320Z" class="" fill="var(--soft)"/><path d="M370 361Q379 343 388 361Z" class="" fill="var(--soft)"/><path d="M401 361Q410 343 419 361Z" class="" fill="var(--soft)"/><path d="M370 392Q379 374 388 392Z" class="" fill="var(--soft)"/><path d="M401 392Q410 374 419 392Z" class="" fill="var(--soft)"/><rect x="74" y="119" width="72" height="72" rx="0" fill="none" stroke="var(--coral)" stroke-width="5" class="quadrat"/><text x="478" y="113" class="small">Example random draws</text><text x="478" y="156" class="small">Coordinate      Count</text><g class="reveal" style="--delay:1.4s"><text x="481" y="202" class="">(1, 1)              2</text></g><g class="reveal" style="--delay:3.0s"><text x="481" y="247" class="">(4, 3)              4</text></g><g class="reveal" style="--delay:4.6s"><text x="481" y="292" class="">(2, 2)              3</text></g><g class="reveal" style="--delay:5.8s"><text x="480" y="348" class="small">Mean = (2 + 4 + 3) ÷ 3 = 3</text><text x="480" y="387" class="small">1 m² quadrat: 3 × 20 = 60</text></g><g class="reveal" style="--delay:6s"><rect x="22" y="441" width="836" height="103" rx="14" fill="var(--panel)" stroke="var(--coral)" stroke-width="2"/><text x="440" y="478" class="accent" text-anchor="middle">Random coordinates avoid selection bias.</text><text x="440" y="514" class="accent" text-anchor="middle">Mean × (total area ÷ quadrat area) = estimate</text></g><text x="481" y="425" class="small">Species richness = species count</text>
</svg>`,
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
      "'Random' means chosen by random numbers, not spread out evenly by eye — that is what removes the sampler's bias.",
      "Species richness = the number of different species, not the total count.",
      "More quadrats → a more reliable estimate, because the mean of many is closer to the true average.",
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
    diagram: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 880 560" role="img" aria-labelledby="title desc">
<title id="title">Transects — distribution up a shore</title><desc id="desc">A side view shows a transect tape running from high shore towards the sea. Five quadrats, shown from above for clarity, are placed at equal distances along the tape. Periwinkles have coiled shells, limpets have ridged conical shells and seaweed has branching fronds. Record species at each station to reveal distribution and zonation along the gradient. The species bands are illustrative, not fixed boundaries. The completed quadrats and result remain visible.</desc>
<style>:root{--bg:#e9f1f2;--panel:#ffffff;--ink:#0d2a37;--soft:#4d6c77;--line:#d2e0e3;--teal:#12a7bb;--deep:#0b6b79;--coral:#ff6a4d;--good:#1a9b6c;--amber:#f0a63c;--violet:#7a5bb0}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}}
:root[data-theme="dark"]{--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}

svg{display:block;height:auto;font-family:system-ui,sans-serif;background:var(--bg)}
text{fill:var(--ink);font-family:system-ui,"Segoe UI",Arial,sans-serif;font-size:28px;font-variant-numeric:tabular-nums}
.title{font-size:32px;font-weight:700}.small{font-size:24px}.big{font-size:36px;font-weight:700}
.soft{fill:var(--soft)}.accent{fill:var(--coral);font-weight:700}.good{fill:var(--good)}
.apparatus{fill:none;stroke:var(--deep);stroke-width:4;stroke-linejoin:round;stroke-linecap:round}
.rule{fill:none;stroke:var(--soft);stroke-width:2}.arrow{fill:none;stroke:var(--coral);stroke-width:4;marker-end:url(#arrow)}
.reveal{animation:reveal .45s ease-out var(--delay,5s) both}
.early{opacity:0;animation:early 9s linear infinite}.late{opacity:1;animation:late 9s linear infinite}
.grow{transform-origin:0 0;animation:grow 9s ease-in-out infinite}
.shrink{transform-origin:0 0;transform:scaleY(.22);animation:shrink 9s ease-in-out infinite}
.dissolve{opacity:0;animation:dissolve 9s linear infinite}
.bubble{opacity:0;animation:bubble 9s linear infinite}
@keyframes reveal{from{opacity:0}to{opacity:1}}
@keyframes early{0%,22%{opacity:1}28%,96%{opacity:0}100%{opacity:1}}
@keyframes late{0%,27%{opacity:0}34%,94%{opacity:1}100%{opacity:0}}
@keyframes grow{0%,15%{transform:scaleY(.22)}65%,92%{transform:scaleY(1)}100%{transform:scaleY(.22)}}
@keyframes shrink{0%,15%{transform:scaleY(1)}65%,92%{transform:scaleY(.22)}100%{transform:scaleY(1)}}
@keyframes dissolve{0%,18%{opacity:1}55%,94%{opacity:0}100%{opacity:1}}
@keyframes bubble{0%,15%{opacity:0;transform:translateY(0)}20%{opacity:1}65%{opacity:1;transform:translateY(-145px)}70%,99%{opacity:0;transform:translateY(-165px)}100%{opacity:0;transform:translateY(0)}}

.transect-tape{animation:lay-tape .8s ease-out both}
@keyframes lay-tape{from{opacity:0}to{opacity:1}}

@media(prefers-reduced-motion:reduce){svg *{animation:none!important;transition:none!important}.reveal,.late{opacity:1!important}.early,.dissolve,.bubble{opacity:0!important}.grow{transform:none!important}.shrink{transform:scaleY(.22)!important}}
</style>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="12" markerHeight="12" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L10 5 0 10Z" fill="var(--coral)"/></marker></defs>
<rect width="880" height="560" fill="var(--bg)"/>
<text x="24" y="43" class="title">Transects — distribution up a shore</text>
<!-- Apparatus and observations; final result remains visible after its reveal. -->
<text x="440" y="86" class="small" text-anchor="middle">Equal intervals · quadrats shown from above</text><path d="M24 163L851 345V367H24Z" class="" fill="var(--line)"/><path d="M752 334Q778 328 804 334T858 334V367H752Z" class="" fill="var(--teal)" opacity=".35"/><path d="M24 163L851 345" class="rule" /><text x="30" y="126" class="">High shore</text><text x="710" y="256" class="">Low shore</text><text x="800" y="361" class="small">Sea</text><path d="M65 135L49 162M804 266L838 325" class="rule" /><g class="transect-tape" ><path d="M48 168.36L815 337.1" class="" fill="none" stroke="var(--deep)" stroke-width="7" stroke-linecap="round"/><path d="M56.90 175.56L59.10 165.56" class="" stroke="var(--panel)" stroke-width="2"/><path d="M85.90 181.94L88.10 171.94" class="" stroke="var(--panel)" stroke-width="2"/><path d="M114.90 188.32L117.10 178.32" class="" stroke="var(--panel)" stroke-width="2"/><path d="M143.90 194.70L146.10 184.70" class="" stroke="var(--panel)" stroke-width="2"/><path d="M172.90 201.08L175.10 191.08" class="" stroke="var(--panel)" stroke-width="2"/><path d="M201.90 207.46L204.10 197.46" class="" stroke="var(--panel)" stroke-width="2"/><path d="M230.90 213.84L233.10 203.84" class="" stroke="var(--panel)" stroke-width="2"/><path d="M259.90 220.22L262.10 210.22" class="" stroke="var(--panel)" stroke-width="2"/><path d="M288.90 226.60L291.10 216.60" class="" stroke="var(--panel)" stroke-width="2"/><path d="M317.90 232.98L320.10 222.98" class="" stroke="var(--panel)" stroke-width="2"/><path d="M346.90 239.36L349.10 229.36" class="" stroke="var(--panel)" stroke-width="2"/><path d="M375.90 245.74L378.10 235.74" class="" stroke="var(--panel)" stroke-width="2"/><path d="M404.90 252.12L407.10 242.12" class="" stroke="var(--panel)" stroke-width="2"/><path d="M433.90 258.50L436.10 248.50" class="" stroke="var(--panel)" stroke-width="2"/><path d="M462.90 264.88L465.10 254.88" class="" stroke="var(--panel)" stroke-width="2"/><path d="M491.90 271.26L494.10 261.26" class="" stroke="var(--panel)" stroke-width="2"/><path d="M520.90 277.64L523.10 267.64" class="" stroke="var(--panel)" stroke-width="2"/><path d="M549.90 284.02L552.10 274.02" class="" stroke="var(--panel)" stroke-width="2"/><path d="M578.90 290.40L581.10 280.40" class="" stroke="var(--panel)" stroke-width="2"/><path d="M607.90 296.78L610.10 286.78" class="" stroke="var(--panel)" stroke-width="2"/><path d="M636.90 303.16L639.10 293.16" class="" stroke="var(--panel)" stroke-width="2"/><path d="M665.90 309.54L668.10 299.54" class="" stroke="var(--panel)" stroke-width="2"/><path d="M694.90 315.92L697.10 305.92" class="" stroke="var(--panel)" stroke-width="2"/><path d="M723.90 322.30L726.10 312.30" class="" stroke="var(--panel)" stroke-width="2"/><path d="M752.90 328.68L755.10 318.68" class="" stroke="var(--panel)" stroke-width="2"/><path d="M781.90 335.06L784.10 325.06" class="" stroke="var(--panel)" stroke-width="2"/></g><text x="355" y="147" class="small">Transect tape</text><path d="M454 156L493 257" class="rule" /><g class="reveal" style="--delay:1.0s"><g class="" transform="translate(110 182.00)"><g class="" transform="rotate(12.41)"><rect x="-40" y="-40" width="80" height="80" rx="2" fill="var(--panel)" stroke="var(--coral)" stroke-width="3"/></g><g class="" transform="scale(.72)"><path d="M-26 15Q-40-3-19-25Q1-42 23-19Q38-5 26 16L14 28Q-5 37-26 15Z" class="" fill="var(--good)" fill-opacity=".24" stroke="var(--deep)" stroke-width="3"/><path d="M-18 12Q-31-6-9-20Q12-29 23-10Q31 8 11 18Q-8 25-13 8Q-19-4-5-9Q8-13 12-2Q15 8 4 9Q-2 8 0 3" class="apparatus" /><path d="M17 19Q33 10 31 23L20 31Z" class="" fill="var(--deep)" opacity=".5"/></g><circle cx="0" cy="53" r="12" fill="var(--panel)" stroke="var(--line)" stroke-width="1.5"/><text x="0" y="61" class="small" text-anchor="middle">1</text></g></g><g class="reveal" style="--delay:1.65s"><g class="" transform="translate(268 216.76)"><g class="" transform="rotate(12.41)"><rect x="-40" y="-40" width="80" height="80" rx="2" fill="var(--panel)" stroke="var(--coral)" stroke-width="3"/></g><g class="" transform="scale(.72)"><path d="M-26 15Q-40-3-19-25Q1-42 23-19Q38-5 26 16L14 28Q-5 37-26 15Z" class="" fill="var(--good)" fill-opacity=".24" stroke="var(--deep)" stroke-width="3"/><path d="M-18 12Q-31-6-9-20Q12-29 23-10Q31 8 11 18Q-8 25-13 8Q-19-4-5-9Q8-13 12-2Q15 8 4 9Q-2 8 0 3" class="apparatus" /><path d="M17 19Q33 10 31 23L20 31Z" class="" fill="var(--deep)" opacity=".5"/></g><circle cx="0" cy="53" r="12" fill="var(--panel)" stroke="var(--line)" stroke-width="1.5"/><text x="0" y="61" class="small" text-anchor="middle">2</text></g></g><g class="reveal" style="--delay:2.3s"><g class="" transform="translate(426 251.52)"><g class="" transform="rotate(12.41)"><rect x="-40" y="-40" width="80" height="80" rx="2" fill="var(--panel)" stroke="var(--coral)" stroke-width="3"/></g><g class="" transform="scale(.72)"><path d="M-37 19Q-24-6-5-25Q2-32 11-20Q30 0 39 20Q2 38-37 19Z" class="" fill="var(--amber)" fill-opacity=".3" stroke="var(--deep)" stroke-width="3"/><path d="M-5-23L-28 19M-2-23L-12 25M2-23L5 28M5-21L21 25M8-19L32 19M-36 19Q1 32 38 20" class="" fill="none" stroke="var(--deep)" stroke-width="2" opacity=".8"/></g><circle cx="0" cy="53" r="12" fill="var(--panel)" stroke="var(--line)" stroke-width="1.5"/><text x="0" y="61" class="small" text-anchor="middle">3</text></g></g><g class="reveal" style="--delay:2.95s"><g class="" transform="translate(584 286.28)"><g class="" transform="rotate(12.41)"><rect x="-40" y="-40" width="80" height="80" rx="2" fill="var(--panel)" stroke="var(--coral)" stroke-width="3"/></g><g class="" transform="scale(.72)"><path d="M-37 19Q-24-6-5-25Q2-32 11-20Q30 0 39 20Q2 38-37 19Z" class="" fill="var(--amber)" fill-opacity=".3" stroke="var(--deep)" stroke-width="3"/><path d="M-5-23L-28 19M-2-23L-12 25M2-23L5 28M5-21L21 25M8-19L32 19M-36 19Q1 32 38 20" class="" fill="none" stroke="var(--deep)" stroke-width="2" opacity=".8"/></g><circle cx="0" cy="53" r="12" fill="var(--panel)" stroke="var(--line)" stroke-width="1.5"/><text x="0" y="61" class="small" text-anchor="middle">4</text></g></g><g class="reveal" style="--delay:3.6s"><g class="" transform="translate(742 321.04)"><g class="" transform="rotate(12.41)"><rect x="-40" y="-40" width="80" height="80" rx="2" fill="var(--panel)" stroke="var(--coral)" stroke-width="3"/></g><g class="" transform="scale(.72)"><path d="M-5 37Q0 11 3-31M-1 18L-22 1M1 4L22-14M3-12L-11-27" class="" fill="none" stroke="var(--deep)" stroke-width="4" stroke-linecap="round"/><path d="M-18 7Q-41 1-28-18Q-18-10-18 7ZM14-6Q16-30 34-30Q36-11 14-6ZM-8-19Q-26-26-16-39Q-7-35-8-19ZM3-18Q-3-40 11-43Q24-34 3-18ZM-2 27Q18 3 27 11Q26 28-2 27Z" class="" fill="var(--good)" stroke="var(--deep)" stroke-width="2"/><circle cx="-10" cy="13" r="4" fill="var(--amber)" stroke="var(--deep)" stroke-width="1.5"/><circle cx="9" cy="-1" r="4" fill="var(--amber)" stroke="var(--deep)" stroke-width="1.5"/><path d="M-5 34L-15 41M-5 34L5 41" class="rule" /></g><circle cx="0" cy="53" r="12" fill="var(--panel)" stroke="var(--line)" stroke-width="1.5"/><text x="0" y="61" class="small" text-anchor="middle">5</text></g></g><rect x="24" y="393" width="264" height="39" rx="10" fill="var(--panel)" /><g class="" transform="translate(54 413) scale(.43)"><path d="M-26 15Q-40-3-19-25Q1-42 23-19Q38-5 26 16L14 28Q-5 37-26 15Z" class="" fill="var(--good)" fill-opacity=".24" stroke="var(--deep)" stroke-width="3"/><path d="M-18 12Q-31-6-9-20Q12-29 23-10Q31 8 11 18Q-8 25-13 8Q-19-4-5-9Q8-13 12-2Q15 8 4 9Q-2 8 0 3" class="apparatus" /><path d="M17 19Q33 10 31 23L20 31Z" class="" fill="var(--deep)" opacity=".5"/></g><text x="86" y="423" class="">Periwinkles</text><rect x="308" y="393" width="264" height="39" rx="10" fill="var(--panel)" /><g class="" transform="translate(338 413) scale(.43)"><path d="M-37 19Q-24-6-5-25Q2-32 11-20Q30 0 39 20Q2 38-37 19Z" class="" fill="var(--amber)" fill-opacity=".3" stroke="var(--deep)" stroke-width="3"/><path d="M-5-23L-28 19M-2-23L-12 25M2-23L5 28M5-21L21 25M8-19L32 19M-36 19Q1 32 38 20" class="" fill="none" stroke="var(--deep)" stroke-width="2" opacity=".8"/></g><text x="370" y="423" class="">Limpets</text><rect x="592" y="393" width="264" height="39" rx="10" fill="var(--panel)" /><g class="" transform="translate(622 413) scale(.43)"><path d="M-5 37Q0 11 3-31M-1 18L-22 1M1 4L22-14M3-12L-11-27" class="" fill="none" stroke="var(--deep)" stroke-width="4" stroke-linecap="round"/><path d="M-18 7Q-41 1-28-18Q-18-10-18 7ZM14-6Q16-30 34-30Q36-11 14-6ZM-8-19Q-26-26-16-39Q-7-35-8-19ZM3-18Q-3-40 11-43Q24-34 3-18ZM-2 27Q18 3 27 11Q26 28-2 27Z" class="" fill="var(--good)" stroke="var(--deep)" stroke-width="2"/><circle cx="-10" cy="13" r="4" fill="var(--amber)" stroke="var(--deep)" stroke-width="1.5"/><circle cx="9" cy="-1" r="4" fill="var(--amber)" stroke="var(--deep)" stroke-width="1.5"/><path d="M-5 34L-15 41M-5 34L5 41" class="rule" /></g><text x="654" y="423" class="">Seaweed</text><g class="reveal" style="--delay:4.6s"><rect x="22" y="441" width="836" height="103" rx="14" fill="var(--panel)" stroke="var(--coral)" stroke-width="2"/><text x="440" y="478" class="accent" text-anchor="middle">Set intervals → record the species present</text><text x="440" y="514" class="accent" text-anchor="middle">Transects show distribution / zonation.</text></g>
</svg>`,
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
    diagram: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 880 560" role="img" aria-labelledby="title desc">
<title id="title">Measuring a shore profile</title><desc id="desc">Measure section A to B with a clinometer and a ground tape, sighting between marks exactly the same height above the feet of the two ranging poles. Keep the pole at B and move the other pole to C where the next section ends. Repeat the angle and distance measurement. A profile graph builds using the same scale factor for horizontal and vertical distances. Matching marks keep each sight line parallel to its ground section. The completed profile stays visible.</desc>
<style>:root{--bg:#e9f1f2;--panel:#ffffff;--ink:#0d2a37;--soft:#4d6c77;--line:#d2e0e3;--teal:#12a7bb;--deep:#0b6b79;--coral:#ff6a4d;--good:#1a9b6c;--amber:#f0a63c;--violet:#7a5bb0}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}}
:root[data-theme="dark"]{--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}

svg{display:block;height:auto;font-family:system-ui,sans-serif;background:var(--bg)}
text{fill:var(--ink);font-family:system-ui,"Segoe UI",Arial,sans-serif;font-size:28px;font-variant-numeric:tabular-nums}
.title{font-size:32px;font-weight:700}.small{font-size:24px}.big{font-size:36px;font-weight:700}
.soft{fill:var(--soft)}.accent{fill:var(--coral);font-weight:700}.good{fill:var(--good)}
.apparatus{fill:none;stroke:var(--deep);stroke-width:4;stroke-linejoin:round;stroke-linecap:round}
.rule{fill:none;stroke:var(--soft);stroke-width:2}.arrow{fill:none;stroke:var(--coral);stroke-width:4;marker-end:url(#arrow)}
.reveal{animation:reveal .45s ease-out var(--delay,5s) both}
.early{opacity:0;animation:early 9s linear infinite}.late{opacity:1;animation:late 9s linear infinite}
.grow{transform-origin:0 0;animation:grow 9s ease-in-out infinite}
.shrink{transform-origin:0 0;transform:scaleY(.22);animation:shrink 9s ease-in-out infinite}
.dissolve{opacity:0;animation:dissolve 9s linear infinite}
.bubble{opacity:0;animation:bubble 9s linear infinite}
@keyframes reveal{from{opacity:0}to{opacity:1}}
@keyframes early{0%,22%{opacity:1}28%,96%{opacity:0}100%{opacity:1}}
@keyframes late{0%,27%{opacity:0}34%,94%{opacity:1}100%{opacity:0}}
@keyframes grow{0%,15%{transform:scaleY(.22)}65%,92%{transform:scaleY(1)}100%{transform:scaleY(.22)}}
@keyframes shrink{0%,15%{transform:scaleY(1)}65%,92%{transform:scaleY(.22)}100%{transform:scaleY(1)}}
@keyframes dissolve{0%,18%{opacity:1}55%,94%{opacity:0}100%{opacity:1}}
@keyframes bubble{0%,15%{opacity:0;transform:translateY(0)}20%{opacity:1}65%{opacity:1;transform:translateY(-145px)}70%,99%{opacity:0;transform:translateY(-165px)}100%{opacity:0;transform:translateY(0)}}

.sight{fill:none;stroke:var(--coral);stroke-width:3;stroke-dasharray:7 5}
.tape-line{fill:none;stroke:var(--deep);stroke-width:3;stroke-dasharray:9 4}
.profile-one,.profile-two{fill:none;stroke:var(--coral);stroke-width:4;stroke-linecap:round}
.moving-pole{transform:translate(450px,397px);animation:move-pole 8s ease-in-out both}
.observer{transform:translate(290px,225px);animation:move-observer 8s ease-in-out both}
.section-one{opacity:0;animation:section-one 8s linear both}
.section-two{opacity:1;animation:section-two 8s linear both}
@keyframes move-pole{0%,43%{transform:translate(110px,300px);opacity:1}47%{transform:translate(110px,300px);opacity:0}52%{transform:translate(450px,397px);opacity:0}57%,100%{transform:translate(450px,397px);opacity:1}}
@keyframes move-observer{0%,43%{transform:translate(110px,190px);opacity:1}47%{transform:translate(110px,190px);opacity:0}52%{transform:translate(290px,225px);opacity:0}57%,100%{transform:translate(290px,225px);opacity:1}}
@keyframes section-one{0%,7%{opacity:0}12%,43%{opacity:1}47%,100%{opacity:0}}
@keyframes section-two{0%,57%{opacity:0}62%,100%{opacity:1}}

@media(prefers-reduced-motion:reduce){svg *{animation:none!important;transition:none!important}.reveal,.late{opacity:1!important}.early,.dissolve,.bubble{opacity:0!important}.grow{transform:none!important}.shrink{transform:scaleY(.22)!important}}
</style>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="12" markerHeight="12" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L10 5 0 10Z" fill="var(--coral)"/></marker></defs>
<rect width="880" height="560" fill="var(--bg)"/>
<text x="24" y="43" class="title">Measuring a shore profile</text>
<!-- Apparatus and observations; final result remains visible after its reveal. -->
<text x="27" y="92" class="">1  Measure each section</text><text x="529" y="92" class="">2  Draw the profile</text><path d="M27 283.86L110 300L290 335L450 397H480V429H27Z" class="" fill="var(--line)"/><path d="M27 283.86L110 300L290 335L450 397H480" class="apparatus" /><path d="M501 111V425" class="rule" stroke-dasharray="4 8" opacity=".4"/><g class="" transform="translate(290 335)"><rect x="-5" y="-156" width="10" height="156" rx="1" fill="var(--panel)" stroke="var(--deep)" stroke-width="2"/><rect x="-4" y="-156" width="8" height="24" rx="0" fill="var(--deep)" /><rect x="-4" y="-108" width="8" height="24" rx="0" fill="var(--deep)" /><rect x="-4" y="-60" width="8" height="24" rx="0" fill="var(--deep)" /><rect x="-10" y="-114" width="20" height="8" rx="2" fill="var(--coral)" /></g><g class="moving-pole" ><rect x="-5" y="-156" width="10" height="156" rx="1" fill="var(--panel)" stroke="var(--deep)" stroke-width="2"/><rect x="-4" y="-156" width="8" height="24" rx="0" fill="var(--deep)" /><rect x="-4" y="-108" width="8" height="24" rx="0" fill="var(--deep)" /><rect x="-4" y="-60" width="8" height="24" rx="0" fill="var(--deep)" /><rect x="-10" y="-114" width="20" height="8" rx="2" fill="var(--coral)" /></g><text x="265" y="155" class="small">Ranging poles</text><path d="M340 164L296 186" class="rule" /><g class="observer" ><circle cx="-43" cy="-2" r="12" fill="var(--ink)" /><path d="M-53-10Q-45-22-31-10" class="" fill="var(--deep)"/><path d="M-51 14Q-39 11-32 21L-28 55H-55Z" class="" fill="var(--teal)" stroke="var(--deep)" stroke-width="2"/><path d="M-48 54L-54 97M-34 55L-25 103M-53 25L-37 38-15 9" class="" fill="none" stroke="var(--ink)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M-60 99H-48M-30 105H-17" class="" stroke="var(--ink)" stroke-width="5" stroke-linecap="round"/><rect x="-26" y="-7" width="25" height="15" rx="3" fill="var(--coral)" stroke="var(--ink)" stroke-width="1.5"/><circle cx="-13" cy="0" r="4" fill="var(--panel)" /></g><g class="section-one" ><path d="M110 190L290 225" class="sight" /><path d="M110 190H210" class="rule" stroke-dasharray="5 5"/><path d="M179 190A69 69 0 0 1 177.7 203.2" class="" fill="none" stroke="var(--coral)" stroke-width="3"/><text x="167" y="178" class="small">Angle</text></g><g class="section-two" ><path d="M290 225L450 287" class="sight" /><path d="M290 225H414" class="rule" stroke-dasharray="5 5"/><path d="M361 225A71 71 0 0 1 356.2 250.7" class="" fill="none" stroke="var(--coral)" stroke-width="3"/><text x="361" y="212" class="small">Angle</text></g><path d="M111 313L285 347M296 350L444 407" class="tape-line" /><circle cx="110" cy="300" r="5" fill="var(--deep)" /><text x="125" y="309" class="small">A</text><circle cx="290" cy="335" r="5" fill="var(--deep)" /><text x="305" y="344" class="small">B</text><circle cx="450" cy="397" r="5" fill="var(--deep)" /><text x="465" y="406" class="small">C</text><text x="42" y="380" class="small">Clinometer → angle</text><text x="42" y="413" class="small">Tape → distance</text><rect x="523" y="122" width="334" height="244" rx="12" fill="var(--panel)" /><path d="M540 156V343" class="rule" opacity=".22"/><path d="M570 156V343" class="rule" opacity=".22"/><path d="M600 156V343" class="rule" opacity=".22"/><path d="M630 156V343" class="rule" opacity=".22"/><path d="M660 156V343" class="rule" opacity=".22"/><path d="M690 156V343" class="rule" opacity=".22"/><path d="M720 156V343" class="rule" opacity=".22"/><path d="M750 156V343" class="rule" opacity=".22"/><path d="M780 156V343" class="rule" opacity=".22"/><path d="M810 156V343" class="rule" opacity=".22"/><path d="M840 156V343" class="rule" opacity=".22"/><path d="M540 163H837" class="rule" opacity=".22"/><path d="M540 193H837" class="rule" opacity=".22"/><path d="M540 223H837" class="rule" opacity=".22"/><path d="M540 253H837" class="rule" opacity=".22"/><path d="M540 283H837" class="rule" opacity=".22"/><path d="M540 313H837" class="rule" opacity=".22"/><path d="M540 343H837" class="rule" opacity=".22"/><path d="M540 153V343H839" class="rule" /><text x="540" y="144" class="small">Height</text><text x="689" y="394" class="small" text-anchor="middle">Distance along profile</text><g class="reveal" style="--delay:2.5s"><path d="M553 218L688 244.25" class="profile-one" /><circle cx="553" cy="218" r="5" fill="var(--coral)" /><text x="551" y="201" class="small">A</text></g><g class="reveal" style="--delay:5.7s"><path d="M688 244.25L808 290.75" class="profile-two" /><circle cx="688" cy="244.25" r="5" fill="var(--coral)" /><text x="688" y="227" class="small">B</text><circle cx="808" cy="290.75" r="5" fill="var(--coral)" /><text x="808" y="277" class="small">C</text></g><g class="reveal" style="--delay:6s"><rect x="22" y="441" width="836" height="103" rx="14" fill="var(--panel)" stroke="var(--coral)" stroke-width="2"/><text x="440" y="478" class="accent" text-anchor="middle">Sight between the SAME height marks.</text><text x="440" y="514" class="accent" text-anchor="middle">Record angle + distance for each section.</text></g>
</svg>`,
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
      "Sight between the same height mark on both poles (not from the ground) so the line of sight is parallel to the ground and the angle is correct.",
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
    diagram: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 880 560" role="img" aria-labelledby="title desc">
<title id="title">Measuring sediment particle size</title><desc id="desc">Dry sediment is shaken through sieves with the coarsest mesh at the top and progressively finer meshes below. Large particles remain high up; the finest reach the collecting tray. Weigh the fractions to make a size distribution.</desc>
<style>:root{--bg:#e9f1f2;--panel:#ffffff;--ink:#0d2a37;--soft:#4d6c77;--line:#d2e0e3;--teal:#12a7bb;--deep:#0b6b79;--coral:#ff6a4d;--good:#1a9b6c;--amber:#f0a63c;--violet:#7a5bb0}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}}
:root[data-theme="dark"]{--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}

svg{display:block;height:auto;font-family:system-ui,sans-serif;background:var(--bg)}
text{fill:var(--ink);font-family:system-ui,"Segoe UI",Arial,sans-serif;font-size:28px;font-variant-numeric:tabular-nums}
.title{font-size:32px;font-weight:700}.small{font-size:24px}.big{font-size:36px;font-weight:700}
.soft{fill:var(--soft)}.accent{fill:var(--coral);font-weight:700}.good{fill:var(--good)}
.apparatus{fill:none;stroke:var(--deep);stroke-width:4;stroke-linejoin:round;stroke-linecap:round}
.rule{fill:none;stroke:var(--soft);stroke-width:2}.arrow{fill:none;stroke:var(--coral);stroke-width:4;marker-end:url(#arrow)}
.reveal{animation:reveal .45s ease-out var(--delay,5s) both}
.early{opacity:0;animation:early 9s linear infinite}.late{opacity:1;animation:late 9s linear infinite}
.grow{transform-origin:0 0;animation:grow 9s ease-in-out infinite}
.shrink{transform-origin:0 0;transform:scaleY(.22);animation:shrink 9s ease-in-out infinite}
.dissolve{opacity:0;animation:dissolve 9s linear infinite}
.bubble{opacity:0;animation:bubble 9s linear infinite}
@keyframes reveal{from{opacity:0}to{opacity:1}}
@keyframes early{0%,22%{opacity:1}28%,96%{opacity:0}100%{opacity:1}}
@keyframes late{0%,27%{opacity:0}34%,94%{opacity:1}100%{opacity:0}}
@keyframes grow{0%,15%{transform:scaleY(.22)}65%,92%{transform:scaleY(1)}100%{transform:scaleY(.22)}}
@keyframes shrink{0%,15%{transform:scaleY(1)}65%,92%{transform:scaleY(.22)}100%{transform:scaleY(1)}}
@keyframes dissolve{0%,18%{opacity:1}55%,94%{opacity:0}100%{opacity:1}}
@keyframes bubble{0%,15%{opacity:0;transform:translateY(0)}20%{opacity:1}65%{opacity:1;transform:translateY(-145px)}70%,99%{opacity:0;transform:translateY(-165px)}100%{opacity:0;transform:translateY(0)}}
.shake{animation:shake 9s linear infinite}@keyframes shake{0%,15%,60%,100%{transform:translateX(0)}20%,30%,40%,50%{transform:translateX(-4px)}25%,35%,45%,55%{transform:translateX(4px)}}.pour{opacity:0;animation:pour 9s linear infinite}@keyframes pour{0%{opacity:0}8%{opacity:1;transform:translateY(0)}25%{opacity:0;transform:translateY(48px)}100%{opacity:0}}.sorted0{animation:sort0 9s ease infinite}@keyframes sort0{0%,10%{opacity:0;transform:translateY(-60px)}15%{opacity:1;transform:translateY(-60px)}30%,94%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-60px)}}.sorted1{animation:sort1 9s ease infinite}@keyframes sort1{0%,10%{opacity:0;transform:translateY(-124px)}15%{opacity:1;transform:translateY(-124px)}42%,94%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-124px)}}.sorted2{animation:sort2 9s ease infinite}@keyframes sort2{0%,10%{opacity:0;transform:translateY(-188px)}15%{opacity:1;transform:translateY(-188px)}54%,94%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-188px)}}.sorted3{animation:sort3 9s ease infinite}@keyframes sort3{0%,10%{opacity:0;transform:translateY(-252px)}15%{opacity:1;transform:translateY(-252px)}66%,94%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-252px)}}
@media(prefers-reduced-motion:reduce){svg *{animation:none!important;transition:none!important}.reveal,.late{opacity:1!important}.early,.dissolve,.bubble{opacity:0!important}.grow{transform:none!important}.shrink{transform:scaleY(.22)!important}}
</style>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="12" markerHeight="12" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L10 5 0 10Z" fill="var(--coral)"/></marker></defs>
<rect width="880" height="560" fill="var(--bg)"/>
<text x="24" y="43" class="title">Measuring sediment particle size</text>
<!-- Apparatus and observations; final result remains visible after its reveal. -->
<text x="57" y="93" class="small">Dried sediment</text><text x="502" y="94" class="small">Weigh each retained fraction</text><g class="shake" ><path d="M72 151V175H357V151" class="apparatus" /><path d="M77 168V180" class="rule" /><path d="M112 168V180" class="rule" /><path d="M147 168V180" class="rule" /><path d="M182 168V180" class="rule" /><path d="M217 168V180" class="rule" /><path d="M252 168V180" class="rule" /><path d="M287 168V180" class="rule" /><path d="M322 168V180" class="rule" /><circle cx="89.0" cy="163" r="9" fill="var(--soft)" class="sorted0"/><circle cx="150.0" cy="156" r="9" fill="var(--soft)" class="sorted0"/><circle cx="211.0" cy="163" r="9" fill="var(--soft)" class="sorted0"/><circle cx="272.0" cy="156" r="9" fill="var(--soft)" class="sorted0"/><circle cx="333.0" cy="163" r="9" fill="var(--soft)" class="sorted0"/><path d="M72 215V239H357V215" class="apparatus" /><path d="M77 232V244" class="rule" /><path d="M96 232V244" class="rule" /><path d="M115 232V244" class="rule" /><path d="M134 232V244" class="rule" /><path d="M153 232V244" class="rule" /><path d="M172 232V244" class="rule" /><path d="M191 232V244" class="rule" /><path d="M210 232V244" class="rule" /><path d="M229 232V244" class="rule" /><path d="M248 232V244" class="rule" /><path d="M267 232V244" class="rule" /><path d="M286 232V244" class="rule" /><path d="M305 232V244" class="rule" /><path d="M324 232V244" class="rule" /><path d="M343 232V244" class="rule" /><circle cx="89.0" cy="227" r="6" fill="var(--soft)" class="sorted1"/><circle cx="123.85714285714286" cy="220" r="6" fill="var(--soft)" class="sorted1"/><circle cx="158.71428571428572" cy="227" r="6" fill="var(--soft)" class="sorted1"/><circle cx="193.57142857142856" cy="220" r="6" fill="var(--soft)" class="sorted1"/><circle cx="228.42857142857142" cy="227" r="6" fill="var(--soft)" class="sorted1"/><circle cx="263.2857142857143" cy="220" r="6" fill="var(--soft)" class="sorted1"/><circle cx="298.1428571428571" cy="227" r="6" fill="var(--soft)" class="sorted1"/><circle cx="333.0" cy="220" r="6" fill="var(--soft)" class="sorted1"/><path d="M72 279V303H357V279" class="apparatus" /><path d="M77 296V308" class="rule" /><path d="M85 296V308" class="rule" /><path d="M93 296V308" class="rule" /><path d="M101 296V308" class="rule" /><path d="M109 296V308" class="rule" /><path d="M117 296V308" class="rule" /><path d="M125 296V308" class="rule" /><path d="M133 296V308" class="rule" /><path d="M141 296V308" class="rule" /><path d="M149 296V308" class="rule" /><path d="M157 296V308" class="rule" /><path d="M165 296V308" class="rule" /><path d="M173 296V308" class="rule" /><path d="M181 296V308" class="rule" /><path d="M189 296V308" class="rule" /><path d="M197 296V308" class="rule" /><path d="M205 296V308" class="rule" /><path d="M213 296V308" class="rule" /><path d="M221 296V308" class="rule" /><path d="M229 296V308" class="rule" /><path d="M237 296V308" class="rule" /><path d="M245 296V308" class="rule" /><path d="M253 296V308" class="rule" /><path d="M261 296V308" class="rule" /><path d="M269 296V308" class="rule" /><path d="M277 296V308" class="rule" /><path d="M285 296V308" class="rule" /><path d="M293 296V308" class="rule" /><path d="M301 296V308" class="rule" /><path d="M309 296V308" class="rule" /><path d="M317 296V308" class="rule" /><path d="M325 296V308" class="rule" /><path d="M333 296V308" class="rule" /><path d="M341 296V308" class="rule" /><path d="M349 296V308" class="rule" /><circle cx="89.0" cy="291" r="3" fill="var(--soft)" class="sorted2"/><circle cx="107.76923076923077" cy="284" r="3" fill="var(--soft)" class="sorted2"/><circle cx="126.53846153846155" cy="291" r="3" fill="var(--soft)" class="sorted2"/><circle cx="145.30769230769232" cy="284" r="3" fill="var(--soft)" class="sorted2"/><circle cx="164.0769230769231" cy="291" r="3" fill="var(--soft)" class="sorted2"/><circle cx="182.84615384615387" cy="284" r="3" fill="var(--soft)" class="sorted2"/><circle cx="201.6153846153846" cy="291" r="3" fill="var(--soft)" class="sorted2"/><circle cx="220.3846153846154" cy="284" r="3" fill="var(--soft)" class="sorted2"/><circle cx="239.15384615384616" cy="291" r="3" fill="var(--soft)" class="sorted2"/><circle cx="257.9230769230769" cy="284" r="3" fill="var(--soft)" class="sorted2"/><circle cx="276.69230769230774" cy="291" r="3" fill="var(--soft)" class="sorted2"/><circle cx="295.46153846153845" cy="284" r="3" fill="var(--soft)" class="sorted2"/><circle cx="314.2307692307692" cy="291" r="3" fill="var(--soft)" class="sorted2"/><circle cx="333.0" cy="284" r="3" fill="var(--soft)" class="sorted2"/><path d="M72 343V367H357V343" class="apparatus" /><circle cx="89.0" cy="355" r="1.8" fill="var(--soft)" class="sorted3"/><circle cx="102.55555555555556" cy="348" r="1.8" fill="var(--soft)" class="sorted3"/><circle cx="116.11111111111111" cy="355" r="1.8" fill="var(--soft)" class="sorted3"/><circle cx="129.66666666666666" cy="348" r="1.8" fill="var(--soft)" class="sorted3"/><circle cx="143.22222222222223" cy="355" r="1.8" fill="var(--soft)" class="sorted3"/><circle cx="156.77777777777777" cy="348" r="1.8" fill="var(--soft)" class="sorted3"/><circle cx="170.33333333333331" cy="355" r="1.8" fill="var(--soft)" class="sorted3"/><circle cx="183.88888888888889" cy="348" r="1.8" fill="var(--soft)" class="sorted3"/><circle cx="197.44444444444446" cy="355" r="1.8" fill="var(--soft)" class="sorted3"/><circle cx="211.0" cy="348" r="1.8" fill="var(--soft)" class="sorted3"/><circle cx="224.55555555555554" cy="355" r="1.8" fill="var(--soft)" class="sorted3"/><circle cx="238.11111111111111" cy="348" r="1.8" fill="var(--soft)" class="sorted3"/><circle cx="251.66666666666666" cy="355" r="1.8" fill="var(--soft)" class="sorted3"/><circle cx="265.22222222222223" cy="348" r="1.8" fill="var(--soft)" class="sorted3"/><circle cx="278.77777777777777" cy="355" r="1.8" fill="var(--soft)" class="sorted3"/><circle cx="292.33333333333337" cy="348" r="1.8" fill="var(--soft)" class="sorted3"/><circle cx="305.8888888888889" cy="355" r="1.8" fill="var(--soft)" class="sorted3"/><circle cx="319.44444444444446" cy="348" r="1.8" fill="var(--soft)" class="sorted3"/><circle cx="333.0" cy="355" r="1.8" fill="var(--soft)" class="sorted3"/></g><text x="374" y="166" class="small">Coarse</text><text x="374" y="230" class="small">Medium</text><text x="374" y="294" class="small">Fine</text><text x="374" y="358" class="small">Tray</text><circle cx="140" cy="117" r="3" fill="var(--soft)" class="pour"/><circle cx="153" cy="108" r="4" fill="var(--soft)" class="pour"/><circle cx="166" cy="99" r="5" fill="var(--soft)" class="pour"/><circle cx="179" cy="117" r="6" fill="var(--soft)" class="pour"/><circle cx="192" cy="108" r="7" fill="var(--soft)" class="pour"/><circle cx="205" cy="99" r="3" fill="var(--soft)" class="pour"/><circle cx="218" cy="117" r="4" fill="var(--soft)" class="pour"/><circle cx="231" cy="108" r="5" fill="var(--soft)" class="pour"/><circle cx="244" cy="99" r="6" fill="var(--soft)" class="pour"/><circle cx="257" cy="117" r="7" fill="var(--soft)" class="pour"/><text x="648" y="149" class="" text-anchor="middle">Size distribution</text><path d="M515 183V357H841" class="rule" /><g class="" transform="translate(539 354)"><g class="grow" ><rect x="0" y="-110" width="43" height="110" rx="3" fill="var(--teal)" /></g></g><text x="560" y="389" class="small" text-anchor="middle">Coarse</text><g class="" transform="translate(615 354)"><g class="grow" ><rect x="0" y="-154" width="43" height="154" rx="3" fill="var(--teal)" /></g></g><text x="636" y="389" class="small" text-anchor="middle">Med.</text><g class="" transform="translate(691 354)"><g class="grow" ><rect x="0" y="-80" width="43" height="80" rx="3" fill="var(--teal)" /></g></g><text x="712" y="389" class="small" text-anchor="middle">Fine</text><g class="" transform="translate(767 354)"><g class="grow" ><rect x="0" y="-42" width="43" height="42" rx="3" fill="var(--teal)" /></g></g><text x="788" y="389" class="small" text-anchor="middle">Tray</text><text x="515" y="418" class="small">Bar height = mass retained</text><g class="reveal" style="--delay:5s"><rect x="22" y="441" width="836" height="103" rx="14" fill="var(--panel)" stroke="var(--coral)" stroke-width="2"/><text x="440" y="478" class="accent" text-anchor="middle">Coarse mesh at top → finest at bottom</text><text x="440" y="514" class="accent" text-anchor="middle">Dry first so particles do not clump.</text></g>
</svg>`,
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
    diagram: `<svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 880 560" role="img" aria-labelledby="title desc">
<title id="title">Measuring sediment moisture content</title><desc id="desc">Fresh sediment starts at one hundred grams. Gentle heating removes water. Repeated weighing after heating gives a constant mass of eighty-two grams, so eighteen grams of water were lost: eighteen percent of the starting mass. Heat gently to avoid burning organic matter.</desc>
<style>:root{--bg:#e9f1f2;--panel:#ffffff;--ink:#0d2a37;--soft:#4d6c77;--line:#d2e0e3;--teal:#12a7bb;--deep:#0b6b79;--coral:#ff6a4d;--good:#1a9b6c;--amber:#f0a63c;--violet:#7a5bb0}
@media(prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}}
:root[data-theme="dark"]{--bg:#071820;--panel:#0e2733;--ink:#e9f4f5;--soft:#9dbcc5;--line:#1c3d49;--teal:#3ac6d8;--deep:#8fdce7;--coral:#ff7d63;--good:#57c98b;--amber:#f3b75e;--violet:#b79be6}

svg{display:block;height:auto;font-family:system-ui,sans-serif;background:var(--bg)}
text{fill:var(--ink);font-family:system-ui,"Segoe UI",Arial,sans-serif;font-size:28px;font-variant-numeric:tabular-nums}
.title{font-size:32px;font-weight:700}.small{font-size:24px}.big{font-size:36px;font-weight:700}
.soft{fill:var(--soft)}.accent{fill:var(--coral);font-weight:700}.good{fill:var(--good)}
.apparatus{fill:none;stroke:var(--deep);stroke-width:4;stroke-linejoin:round;stroke-linecap:round}
.rule{fill:none;stroke:var(--soft);stroke-width:2}.arrow{fill:none;stroke:var(--coral);stroke-width:4;marker-end:url(#arrow)}
.reveal{animation:reveal .45s ease-out var(--delay,5s) both}
.early{opacity:0;animation:early 9s linear infinite}.late{opacity:1;animation:late 9s linear infinite}
.grow{transform-origin:0 0;animation:grow 9s ease-in-out infinite}
.shrink{transform-origin:0 0;transform:scaleY(.22);animation:shrink 9s ease-in-out infinite}
.dissolve{opacity:0;animation:dissolve 9s linear infinite}
.bubble{opacity:0;animation:bubble 9s linear infinite}
@keyframes reveal{from{opacity:0}to{opacity:1}}
@keyframes early{0%,22%{opacity:1}28%,96%{opacity:0}100%{opacity:1}}
@keyframes late{0%,27%{opacity:0}34%,94%{opacity:1}100%{opacity:0}}
@keyframes grow{0%,15%{transform:scaleY(.22)}65%,92%{transform:scaleY(1)}100%{transform:scaleY(.22)}}
@keyframes shrink{0%,15%{transform:scaleY(1)}65%,92%{transform:scaleY(.22)}100%{transform:scaleY(1)}}
@keyframes dissolve{0%,18%{opacity:1}55%,94%{opacity:0}100%{opacity:1}}
@keyframes bubble{0%,15%{opacity:0;transform:translateY(0)}20%{opacity:1}65%{opacity:1;transform:translateY(-145px)}70%,99%{opacity:0;transform:translateY(-165px)}100%{opacity:0;transform:translateY(0)}}
.vapour{opacity:0;animation:vapour 9s linear infinite}@keyframes vapour{0%,20%{opacity:0;transform:translateY(0)}25%,55%{opacity:.7;transform:translateY(-12px)}65%,100%{opacity:0;transform:translateY(-25px)}}
@media(prefers-reduced-motion:reduce){svg *{animation:none!important;transition:none!important}.reveal,.late{opacity:1!important}.early,.dissolve,.bubble{opacity:0!important}.grow{transform:none!important}.shrink{transform:scaleY(.22)!important}}
</style>
<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="12" markerHeight="12" orient="auto" markerUnits="userSpaceOnUse"><path d="M0 0L10 5 0 10Z" fill="var(--coral)"/></marker></defs>
<rect width="880" height="560" fill="var(--bg)"/>
<text x="24" y="43" class="title">Measuring sediment moisture content</text>
<!-- Apparatus and observations; final result remains visible after its reveal. -->
<rect x="34" y="133" width="273" height="239" rx="10" fill="var(--panel)" /><path d="M57 277H279M166 277V314" class="apparatus" /><rect x="75" y="311" width="196" height="48" rx="7" fill="var(--line)" /><g class="" transform="translate(115 277)"><path d="M0 0Q25-24 55-13Q72-25 101 0Z" class="" fill="var(--soft)"/></g><text x="171" y="112" class="" text-anchor="middle">Weigh</text><g class="early" ><text x="173" y="346" class="big" text-anchor="middle">100 g</text></g><g class="late" ><text x="173" y="346" class="big" text-anchor="middle">82 g</text></g><rect x="348" y="150" width="212" height="195" rx="12" fill="var(--panel)" stroke="var(--deep)" stroke-width="3"/><rect x="370" y="179" width="168" height="124" rx="6" fill="var(--bg)" /><g class="" transform="translate(406 274)"><path d="M0 0Q25-24 55-13Q72-25 101 0Z" class="" fill="var(--soft)"/></g><path d="M383 291H526" class="apparatus" /><text x="454" y="112" class="" text-anchor="middle">Heat gently</text><path d="M305 240H343" class="arrow" /><path d="M454 353Q448 414 281 390" class="arrow" /><text x="319" y="426" class="small">Reweigh; repeat</text><path d="M407 220q-12-17 0-30q12-14 0-30"  class="rule vapour v0"/><path d="M450 220q-12-17 0-30q12-14 0-30"  class="rule vapour v1"/><path d="M493 220q-12-17 0-30q12-14 0-30"  class="rule vapour v2"/><text x="592" y="128" class="small">Repeat readings:</text><text x="592" y="167" class="small">86 g → 82 g</text><text x="592" y="206" class="small">82 g → 82 g</text><g class="reveal" style="--delay:5s"><text x="590" y="272" class="small">Constant mass</text><text x="590" y="309" class="small">Water lost:</text><text x="590" y="346" class="small">100 − 82 = 18 g</text></g><g class="reveal" style="--delay:5.5s"><rect x="22" y="441" width="836" height="103" rx="14" fill="var(--panel)" stroke="var(--coral)" stroke-width="2"/><text x="440" y="478" class="accent" text-anchor="middle">Water lost ÷ starting mass × 100</text><text x="440" y="514" class="accent" text-anchor="middle">18 ÷ 100 × 100 = 18% water</text></g><text x="440" y="80" class="small" text-anchor="middle">Heat gently: do not burn organic matter.</text>
</svg>`,
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
      "Heat until the mass stops changing, not for a fixed time — a constant mass is how you know all the water has gone.",
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
