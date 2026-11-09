/* Teacher tools — capture helpers (pure). The data the misconception report needs is
 * captured at answer time: which wrong option(s) the student actually chose. The value
 * is the ORIGINAL option index (before the on-screen shuffle), because the quiz passes
 * the original index as the answer (see ChoiceQ/MultiQ: options are rendered through a
 * shuffled order but each button carries its original index). Only choice and multi are
 * captured; other types have no meaningful "pick" to compare across the class.
 */

// The wrong pick to store on a wrong answer, or undefined when there's nothing to capture.
//   choice → the chosen option's original index (a number)
//   multi  → the sorted array of original indices ticked
//   anything else, or a non-matching answer → undefined
export function lastPickOf(type, answer) {
  if (type === "choice" && typeof answer === "number" && answer >= 0) return answer;
  if (type === "multi" && Array.isArray(answer)) return answer.map(Number).filter((n) => Number.isInteger(n) && n >= 0).sort((a, b) => a - b);
  return undefined;
}
