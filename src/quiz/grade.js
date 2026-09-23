/* Shared, pure item grading — used by both the classic lesson flow and the
 * Reader. No React, no palette; given (item, answer) it decides initial answer
 * state, whether an answer can be submitted, and whether it is correct. Behaviour
 * is byte-for-byte the logic previously inlined in App.jsx (classic unchanged).
 */
import { content } from "../content/index.js";
import { gradeTap, gradeLabel } from "../engine/figures.js";
import { examCorrectIdx } from "../engine/exam.js";

const FIGURES = content.figures || {};

export const sameSet = (a, b) => a.length === b.length && [...a].sort().every((v, i) => v === [...b].sort()[i]);

export function initAnswer(it) {
  if (!it) return null;
  if (it.type === "choice") return null;
  if (it.type === "truefalse") return null;
  if (it.type === "multi") return [];
  if (it.type === "gap") return it.answers.map(() => null);
  if (it.type === "match") return { links: {}, order: [], sel: null };
  if (it.type === "chain") return [];
  if (it.type === "exam") return { checkSel: [] };
  if (it.type === "tap") return null;
  if (it.type === "label") return { assign: {}, order: [], selLab: null };
  return null;
}

export function canSubmit(item, answer) {
  if (!item) return false;
  if (item.type === "choice") return answer !== null;
  if (item.type === "truefalse") return answer !== null;
  if (item.type === "multi") return answer.length > 0;
  if (item.type === "gap") return answer.every((a) => a !== null);
  if (item.type === "match") return Object.keys(answer.links).length === item.pairs.length;
  if (item.type === "chain") return answer.length === item.chunks.length;
  if (item.type === "exam") return answer.checkSel.length > 0;
  if (item.type === "tap") return answer !== null;
  if (item.type === "label") return Object.keys(answer.assign).length === (FIGURES[item.fig]?.hotspots.length || 0);
  return false;
}

export function gradeItem(item, answer) {
  if (item.type === "choice") return answer === item.a;
  if (item.type === "truefalse") return answer === item.answer; // answer is a boolean
  if (item.type === "multi") return sameSet(answer, item.a);
  if (item.type === "gap") return answer.every((a, i) => a === item.answers[i]);
  if (item.type === "match") return item.pairs.every((_, i) => answer.links[i] === i);
  if (item.type === "chain") return answer.every((k, i) => k === i);
  if (item.type === "exam") return sameSet(answer.checkSel, examCorrectIdx(item)); // content-only, order never graded
  if (item.type === "tap") return gradeTap(item, answer);
  if (item.type === "label") return gradeLabel(FIGURES[item.fig], answer.assign);
  return false;
}
