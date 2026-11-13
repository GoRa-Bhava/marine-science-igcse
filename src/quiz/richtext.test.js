/* Item 15a: the <i> italics renderer. Scientific names render in italics via a
 * single allowed tag; every other tag is shown escaped; grading ignores tags. */
import { test } from "node:test";
import assert from "node:assert/strict";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { italicize, stripItalic } from "./richtext.js";
import { gradeLabel } from "../engine/figures.js";

const html = (field) => renderToStaticMarkup(React.createElement("span", null, italicize(field)));

test("<i>Fucus</i> in an option renders as a real italic element", () => {
  const out = html("A rockweed such as <i>Fucus</i> grows on the shore.");
  assert.match(out, /A rockweed such as <i>Fucus<\/i> grows on the shore\./);
});

test("other tags in a stem are shown escaped, not rendered", () => {
  const out = html("Tick the <b>true</b> statements.");
  assert.ok(!/<b>/.test(out), "a literal <b> tag must not reach the DOM");
  assert.match(out, /&lt;b&gt;true&lt;\/b&gt;/, "<b> must be shown as escaped text");
});

test("a plain string with no <i> is returned unchanged (fast path)", () => {
  assert.equal(italicize("plain text"), "plain text");
  assert.equal(stripItalic("<i>Fucus</i> and <i>Orcinus orca</i>"), "Fucus and Orcinus orca");
});

test("grading of a label item is unaffected by italic tags in the labels", () => {
  // A label figure whose label text carries an <i> tag. Grading is index-based:
  // the correct assignment (hotspot i -> label i) must still grade true, and a
  // swapped assignment must grade false — the tags change nothing.
  const fig = { hotspots: [
    { id: "a", label: "<i>Fucus</i>" },
    { id: "b", label: "limpet" },
  ] };
  assert.equal(gradeLabel(fig, { 0: 0, 1: 1 }), true);
  assert.equal(gradeLabel(fig, { 0: 1, 1: 0 }), false);
});

test("stripItalic makes gap-style text comparison tag-agnostic", () => {
  // grade.js grades gaps with stripItalic(a) === stripItalic(answer); mirror it.
  const gapOk = (placed, answer) => stripItalic(placed) === stripItalic(answer);
  assert.equal(gapOk("Fucus", "<i>Fucus</i>"), true);
  assert.equal(gapOk("<i>Fucus</i>", "<i>Fucus</i>"), true);
  assert.equal(gapOk("kelp", "<i>Fucus</i>"), false);
});
