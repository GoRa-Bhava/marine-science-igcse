/* External links and resource-page config — the single source of truth for the
 * in-app Printables screen. Keep the free-sheet list in step with the website's
 * /printables.html. No question-bank content lives here. */

// The website's printables index — linked only from the free-downloads list
// ("see the full list on the website"). Never used for a price or a buy button:
// in the app the bundle is only ever the £20 add-on (or the unlock-first CTA).
export const PRINTABLES_PAGE = "https://www.wildcateducation.co.uk/printables.html";

// The £20 add-on checkout (printables bought together with the app). Don pastes
// the Lemon Squeezy checkout link here. WHILE IT IS EMPTY, every £20 button and
// the post-activation offer card are hidden (not broken): see the helpers below.
export const PRINTABLES_ADDON_URL = "";

// The free sheets, hosted on the website. They open in a NEW TAB and are never
// precached by the service worker — they live on a different origin from the app
// (the worker only caches same-origin GETs), so no .pdf ever enters the cache.
const FREE_BASE = "https://www.wildcateducation.co.uk/printables/free/";
export const FREE_PRINTABLES = [
  {
    group: "Unit 1 knowledge organisers",
    items: [
      { label: "1.1 Earth in space and structure", file: "A4-ko-1-1-earth-in-space-and-structure.pdf" },
      { label: "1.2 Plate tectonics", file: "A4-ko-1-2-plate-tectonics.pdf" },
      { label: "1.3 Oceans and the sea floor", file: "A4-ko-1-3-oceans-and-the-sea-floor.pdf" },
      { label: "1.4 Tides and currents", file: "A4-ko-1-4-tides-and-currents.pdf" },
    ],
  },
  {
    group: "Unit 1 practicals",
    items: [
      { label: "Measuring tidal amplitude — A4 card", file: "A4-measuring-tidal-amplitude.pdf" },
      { label: "Measuring tidal amplitude — worksheet", file: "WS-measuring-tidal-amplitude.pdf" },
      { label: "Measuring tidal amplitude — answers", file: "WS-measuring-tidal-amplitude-answers.pdf" },
      { label: "Speed and direction of a current — A4 card", file: "A4-measuring-the-speed-and-direction-of-a-current.pdf" },
      { label: "Speed and direction of a current — worksheet", file: "WS-measuring-the-speed-and-direction-of-a-current.pdf" },
      { label: "Speed and direction of a current — answers", file: "WS-measuring-the-speed-and-direction-of-a-current-answers.pdf" },
    ],
  },
  {
    group: "Worksheets",
    items: [
      { label: "Plates and tsunamis — worksheet", file: "WS-plates-tsunamis.pdf" },
      { label: "Plates and tsunamis — answers", file: "WS-plates-tsunamis-answers.pdf" },
      { label: "Data handling — worksheet", file: "WS-data-handling.pdf" },
      { label: "Data handling — answers", file: "WS-data-handling-answers.pdf" },
    ],
  },
  {
    group: "Reference sheets",
    items: [
      { label: "Command words", file: "A4-command-words.pdf" },
      { label: "Formulae and maths", file: "A4-formulae-maths.pdf" },
      { label: "Data-handling rules", file: "A4-data-handling-rules.pdf" },
    ],
  },
].map((g) => ({ ...g, items: g.items.map((it) => ({ ...it, href: FREE_BASE + it.file })) }));

// Total number of free sheets, for tests and copy.
export const FREE_PRINTABLES_COUNT = FREE_PRINTABLES.reduce((n, g) => n + g.items.length, 0);

/* Which "full bundle" control the Printables screen shows. App users only ever
 * see £20 — the standalone price lives on the website, never in the app.
 *   - "addon":  activated (any paid or school licence) AND the add-on link is
 *               set → the "Add the printables for £20" button → the checkout.
 *   - "unlock": not activated → the "Unlock the full app, then add the
 *               printables for £20" line; its button opens the app's own unlock
 *               screen (never the website), so no checkout link is shown.
 *   - "none":   activated but the add-on link is not set yet → description only,
 *               no £20 button (hidden, not broken).
 * Pure, so every branch is testable without a React renderer. */
export function bundleOffer({ activated, addonUrl = PRINTABLES_ADDON_URL }) {
  if (!activated) return { kind: "unlock", label: "Unlock the full app, then add the printables for £20." };
  if (addonUrl) return { kind: "addon", price: "£20", url: addonUrl, label: "Add the printables for £20" };
  return { kind: "none" };
}

/* Whether the one-time, dismissible post-activation offer card should show.
 * Only when the add-on link is set and the card has not been shown before. The
 * caller also suppresses it during a quiz session. */
export function showActivationOffer({ seen, addonUrl = PRINTABLES_ADDON_URL }) {
  return Boolean(addonUrl) && !seen;
}
