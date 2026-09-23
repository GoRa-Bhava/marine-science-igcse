/* The Reader Library's "Explore" group — learn/reference surfaces that sit
 * outside the read/practice loop (no scheduler, no scoring, no rewards from
 * them). Kept as plain data so a pure test can assert the Library exposes each
 * one and every entry maps to a known Reader view that returns to the library.
 */

// Every Explore/Discoveries view returns here.
export const LIBRARY_VIEW = "library";

// The two-item "Explore" group shown below the practice-mode row.
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
];

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
export const EXPLORE_VIEWS = [...EXPLORE_ENTRIES, DISCOVERIES_ENTRY].map((e) => e.view);
