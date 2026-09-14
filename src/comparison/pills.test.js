import { test } from "node:test";
import assert from "node:assert/strict";
import { COMPARISON_CARDS } from "./comparison-cards.js";
import { PILL_LABELS, pillLabel, sideIndexFromScroll } from "./pills.js";

// The pill bar is the primary way to move between comparisons, so every card
// needs a distinct short label and selecting one must resolve to a real card.
test("every comparison has a unique, non-empty pill label", () => {
  const labels = COMPARISON_CARDS.map((c) => pillLabel(c.id));
  for (let i = 0; i < COMPARISON_CARDS.length; i++) {
    const label = labels[i];
    assert.equal(typeof label, "string", `${COMPARISON_CARDS[i].id} label is a string`);
    assert.ok(label.length > 0 && label !== COMPARISON_CARDS[i].id, `${COMPARISON_CARDS[i].id} has a real label`);
    assert.ok(label.length <= 34, `${COMPARISON_CARDS[i].id} label stays short`);
  }
  assert.equal(new Set(labels).size, labels.length, "labels are unique");
  // no orphan labels for ids that don't exist
  const ids = new Set(COMPARISON_CARDS.map((c) => c.id));
  for (const id of Object.keys(PILL_LABELS)) assert.ok(ids.has(id), `label id ${id} matches a card`);
});

// Swiping/selecting a side updates the "which side" indicator.
test("sideIndexFromScroll maps the scroll range onto the side index", () => {
  // 2 sides, container 400 wide, content 800 wide -> max scroll 400
  assert.equal(sideIndexFromScroll(0, 800, 400, 2), 0);   // resting on side a
  assert.equal(sideIndexFromScroll(400, 800, 400, 2), 1); // swiped to side b
  assert.equal(sideIndexFromScroll(150, 800, 400, 2), 0); // still nearer a
  assert.equal(sideIndexFromScroll(260, 800, 400, 2), 1); // now nearer b
  // degenerate: nothing to scroll -> first side
  assert.equal(sideIndexFromScroll(0, 400, 400, 2), 0);
  assert.equal(sideIndexFromScroll(0, 800, 400, 1), 0);
});

// The highlighted-row index is shared across both sides, so it must mean the
// same attribute on each — i.e. rows are the same count and order per side.
test("row index refers to the same attribute on both sides (highlight persists)", () => {
  for (const c of COMPARISON_CARDS) {
    assert.ok(c.rows.length >= 2, `${c.id} has rows`);
    c.rows.forEach((row, i) => {
      assert.equal(typeof row.a, "string", `${c.id} row ${i} side a`);
      assert.equal(typeof row.b, "string", `${c.id} row ${i} side b`);
      assert.equal(typeof row.label, "string", `${c.id} row ${i} label`);
    });
  }
});
