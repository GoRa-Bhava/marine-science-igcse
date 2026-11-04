/* Figures & data — pure interaction reducers for the tap and order question
   kinds. Kept separate from the component so they can be unit-tested directly.
   Each returns a NEW array; it never mutates its input. (Plot nudges are the
   template's own q.plot.nudge, so they are not reduced here.) */

/** Toggle an id in a tap selection. Single-select (multi=false) replaces the
    selection; multi-select adds/removes. */
export function applyTap(state, id, multi) {
  const s = state || [];
  if (s.includes(id)) return s.filter((x) => x !== id);
  return multi ? s.concat(id) : [id];
}

/** Append an option index to the order the student is building. */
export function orderAdd(state, k) {
  return (state || []).concat(k);
}

/** Remove the placed chip at position n from the order. */
export function orderRemove(state, n) {
  const s = (state || []).slice();
  s.splice(n, 1);
  return s;
}
