/* "Write your answer first" (recall-first) for single-answer multiple-choice items.
 * On an eligible item the options are hidden; the student writes their own answer (never stored or
 * marked), then reveals the options and taps one as usual. Only the tap is graded.
 * Content fields (optional, on type "choice" items only):
 *   qRecall: string   — the stem to show while the options are hidden (when q only works with options in view)
 *   recall: false     — never hide the options for this item
 * Setting: settings.recallFirst (default ON; false turns the feature off). */

export const RECALL_SETTING = "recallFirst";

export function recallOn(settings) {
  return !settings || settings[RECALL_SETTING] !== false;
}

export function recallEligible(item, settings) {
  return !!item && item.type === "choice" && item.recall !== false && recallOn(settings);
}

// The stem to show while the options are hidden.
export function recallStem(item) {
  return (item && typeof item.qRecall === "string" && item.qRecall.trim()) ? item.qRecall : (item ? item.q : "");
}
