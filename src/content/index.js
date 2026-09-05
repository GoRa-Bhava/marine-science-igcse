/* The active subject. Adding a subject is: add a content file next to this
   one that satisfies CONTENT-SPEC.md, register it here, and point
   ACTIVE_SUBJECT at it. Nothing else in the app needs to change. */
import marineScience from "./marine-science.jsx";

export const SUBJECTS = {
  "marine-science": marineScience,
};

export const ACTIVE_SUBJECT = "marine-science";

export const content = SUBJECTS[ACTIVE_SUBJECT];
