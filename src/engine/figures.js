/* ========================================================================
   FIGURE QUESTIONS — pure helpers

   Diagram questions come in three shapes:
     tap    — tap the hotspot the question names; right iff its id === target.
     label  — place every label onto its hotspot; right iff all correct.
              The label pool is the hotspots' own labels plus any `extra`
              distractors, so a distractor placed anywhere is wrong.
     choice — an ordinary multiple choice with the figure shown above it
              (graded by the normal choice path, nothing here).

   Rendering lives in App.jsx; grading and geometry are pure and tested here.
   ======================================================================== */

/* The figure's own coordinate space: the raster's natural w,h, or the SVG
   viewBox. Hotspots are given in this space and overlaid by percentage, so
   both kinds scale responsively. */
export function figureDims(figure) {
  if (!figure || !figure.art) return null;
  if (figure.art.kind === "img") return { w: figure.art.w, h: figure.art.h };
  const m = /viewBox="0 0 ([\d.]+) ([\d.]+)"/.exec(figure.art.svg || "");
  return m ? { w: +m[1], h: +m[2] } : null;
}

/* The draggable/tappable label pool for a label question: the hotspots'
   labels (in hotspot order) followed by any distractors. Pool index i < n
   is hotspot i's own correct label. */
export function labelPool(item, figure) {
  return [...figure.hotspots.map((h) => h.label), ...(item.extra || [])];
}

/* After Check, a label marker is numbered by its hotspot's position in the
   figure (1-based), so the number drawn on the figure matches the answer-list
   line for that hotspot. (While answering, a placed marker shows the label the
   student placed as a tag, not a number.) */
export function labelMarkerNumber(i) {
  return i + 1;
}

/* One line of the label answer review, for hotspot i after Check: its 1-based
   number (same as the marker on the figure), its correct label, whether the
   student placed its own label there, and what they did place (null if the
   spot was left empty). */
export function labelResultLine(figure, item, assign, i) {
  const pool = labelPool(item, figure);
  const placedIdx = assign?.[i];
  return {
    n: labelMarkerNumber(i),
    label: figure.hotspots[i].label,
    correct: placedIdx === i,
    placed: placedIdx == null ? null : pool[placedIdx],
  };
}

export function gradeTap(item, tappedId) {
  return tappedId != null && tappedId === item.target;
}

/* `assign` maps hotspot index -> placed label-pool index. Correct iff every
   hotspot carries its own label (pool index === hotspot index), which also
   rules out any distractor. */
export function gradeLabel(figure, assign) {
  if (!figure) return false;
  return figure.hotspots.every((_, i) => assign?.[i] === i);
}
