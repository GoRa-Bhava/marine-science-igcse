/* Scientific names (e.g. Fucus, Orcinus orca) are printed in italics. The
 * student-facing text fields — q, qRecall, options, match pairs and extras,
 * chunks, gap segments, banks and hotspot labels — render as plain text, so we
 * allow exactly one tag, <i>…</i>, and render it as a real <i> element. Every
 * other character, including any other tag such as <b>, stays a plain string
 * segment that React escapes, so no other HTML can be injected. Grading always
 * compares the tag-stripped text (stripItalic), so the tags never affect answers.
 *
 * Plain JS (React.createElement, no JSX) so node --test can import it directly. */
import React from "react";

/* Grading must ignore the tags, so any text comparison strips them first. */
export const stripItalic = (s) => (typeof s === "string" ? s.replace(/<\/?i>/g, "") : s);

export function italicize(s) {
  if (typeof s !== "string" || s.indexOf("<i>") === -1) return s;
  const out = [];
  const re = /<i>([\s\S]*?)<\/i>/g;
  let last = 0, m, k = 0;
  while ((m = re.exec(s)) !== null) {
    if (m.index > last) out.push(s.slice(last, m.index));
    out.push(React.createElement("i", { key: "it" + k++ }, m[1]));
    last = m.index + m[0].length;
  }
  if (last < s.length) out.push(s.slice(last));
  return out;
}
