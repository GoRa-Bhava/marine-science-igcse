/* The active subject. Adding a subject is: add a content file next to this
   one that satisfies CONTENT-SPEC.md, register it here, and point
   ACTIVE_SUBJECT at it. Nothing else in the app needs to change. */
import marineScience from "./marine-science.jsx";
import { FIGURES, FIGURE_ITEMS } from "./figures.js";

/* Figure (diagram) questions are ordinary gradable items carrying a `fig`;
   the figure map they point at rides on the subject as `figures`. Merged
   here so the giant content file stays untouched. */
const withFigures = {
  ...marineScience,
  items: [...marineScience.items, ...FIGURE_ITEMS],
  figures: FIGURES,
};

export const SUBJECTS = {
  "marine-science": withFigures,
};

export const ACTIVE_SUBJECT = "marine-science";

export const content = SUBJECTS[ACTIVE_SUBJECT];
