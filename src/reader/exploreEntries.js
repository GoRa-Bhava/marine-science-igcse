/* The Reader Library's "Explore" group — learn/reference surfaces that sit
 * outside the read/practice loop (no scheduler, no scoring, no rewards from
 * them). Kept as plain data so a pure test can assert the Library exposes each
 * one and every entry maps to a known Reader view that returns to the library.
 */

// Every Explore/Discoveries view returns here.
export const LIBRARY_VIEW = "library";

// The "Explore" group shown below the Writing practice card.
export const EXPLORE_ENTRIES = [
  {
    key: "interactives",
    view: "interactives",
    title: "Interactive Lab",
    blurb: "9 models · change one thing, watch the rest respond",
    icon: "🧪",
  },
  {
    key: "concepts",
    view: "concepts",
    title: "Concept Cards · 14 Comparisons",
    blurb: "Two-sided comparisons — learn & self-check",
    icon: "🃏",
  },
  {
    key: "flashcards",
    view: "flashcards",
    title: "Flashcards",
    blurb: "Flip to learn · by unit",
    icon: "🎴",
  },
  {
    key: "practicals",
    view: "practicals",
    title: "Practicals",
    blurb: "Learn and test the required lab procedures — starting with the food tests.",
    icon: "🔬",
  },
  {
    key: "figdata",
    view: "figdata",
    title: "Figures & data",
    blurb: "Graphs, tables and maps — new data every time",
    icon: "📊",
  },
];

// Writing practice — featured on the Library home as a full-width card directly
// below the Mixed Practice / Syllabus Notes row (not in the Explore list), and
// third in the desktop sidebar after Syllabus Notes.
export const WRITING_ENTRY = {
  key: "writing",
  view: "writing",
  title: "Writing practice",
  blurb: "Write a 4–6 mark exam answer, then mark it against the marking points",
  icon: "✍️",
};

// The Ocean Discoveries collection — a small entry by the readiness card.
export const DISCOVERIES_ENTRY = {
  key: "collection",
  view: "collection",
  title: "Discoveries",
  blurb: "Your Ocean discoveries collection",
  icon: "🐚",
};

// All views the Library can open from Explore/Discoveries; each must return to
// LIBRARY_VIEW. Handy for tests and for the view dispatcher.
export const EXPLORE_VIEWS = [...EXPLORE_ENTRIES, WRITING_ENTRY, DISCOVERIES_ENTRY].map((e) => e.view);
