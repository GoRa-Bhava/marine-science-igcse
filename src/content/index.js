/* The active subject. Adding a subject is: add a content file next to this
   one that satisfies CONTENT-SPEC.md, register it here, and point
   ACTIVE_SUBJECT at it. Nothing else in the app needs to change. */
import marineScience from "./marine-science.jsx";
import { FIGURES, FIGURE_ITEMS } from "./figures.js";
import { TRUEFALSE } from "./truefalse-bank.js";
import { MARKTRUE } from "./mark-true-bank.js";

/* The True/False and "mark which are true" banks are authored in their own files
   in the bank runtime shape ({ ...id, unit, spec, stem, ... }). Map them to the
   app item shape the engine + renderers expect (q from stem, ref from spec, a
   valid topic id, and `a` for multi) and merge them into the item list, so they
   flow through boxAfter → queue → mastery/readiness and the recall→application
   ramp like every other item. Bank content is status: human_review. */
const secOf = (v) => (/^(\d\.\d)/.exec(v || "") || [])[1];

// Section -> a real topic id, learned from the existing hand-authored items.
const SEC_TO_TOPIC = {};
for (const it of marineScience.items) {
  const sec = secOf(it.ref);
  if (sec && !SEC_TO_TOPIC[sec]) SEC_TO_TOPIC[sec] = it.topic;
}
// Fallback: the first topic of each unit, for any section without an item yet.
const UNIT_TO_TOPIC = {};
for (const t of marineScience.topics) if (!(t.unit in UNIT_TO_TOPIC)) UNIT_TO_TOPIC[t.unit] = t.id;

function fromBank(it) {
  const topic = SEC_TO_TOPIC[secOf(it.spec)] || UNIT_TO_TOPIC[it.unit] || it.topic;
  const out = { ...it, q: it.stem, ref: it.spec, topic };
  if (it.type === "multi") out.a = it.answer; // app multi grades on `a`
  return out;
}

const BANK_ITEMS = [...TRUEFALSE.map(fromBank), ...MARKTRUE.map(fromBank)];

/* Figure (diagram) questions are ordinary gradable items carrying a `fig`;
   the figure map they point at rides on the subject as `figures`. Merged
   here so the giant content file stays untouched. */
const withFigures = {
  ...marineScience,
  items: [...marineScience.items, ...FIGURE_ITEMS, ...BANK_ITEMS],
  figures: FIGURES,
};

export const SUBJECTS = {
  "marine-science": withFigures,
};

export const ACTIVE_SUBJECT = "marine-science";

export const content = SUBJECTS[ACTIVE_SUBJECT];
