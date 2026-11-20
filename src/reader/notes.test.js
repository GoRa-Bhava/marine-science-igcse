import { test } from "node:test";
import assert from "node:assert/strict";
import { NOTES } from "./notes.js";

// Writing-quality pass (20 Nov 2026, NOTES-quality-audit-2026-11-20.md): the
// Syllabus notes were rewritten to full prose, em dashes were removed from the
// body text, and a handful of specific wordings were corrected. These tests
// guard that work so a future edit cannot quietly bring the shorthand back.

const EM_DASH = "—"; // —

// Every readable field across every section, with a label for failure messages.
function* textFields() {
  for (const unit of Object.keys(NOTES)) {
    for (const s of NOTES[unit].sections) {
      if (typeof s.intro === "string") yield [`${unit}/${s.id}/intro`, s.intro];
      if (typeof s.tip === "string") yield [`${unit}/${s.id}/tip`, s.tip];
      const notes = s.notes || [];
      for (let i = 0; i < notes.length; i++) {
        yield [`${unit}/${s.id}/notes[${i}].h`, notes[i].h];
        yield [`${unit}/${s.id}/notes[${i}].body`, notes[i].body];
      }
      const terms = s.terms || [];
      for (let i = 0; i < terms.length; i++) {
        yield [`${unit}/${s.id}/terms[${i}].term`, terms[i][0]];
        yield [`${unit}/${s.id}/terms[${i}].def`, terms[i][1]];
      }
    }
  }
}

test("no note body, tip, intro or term contains an em dash", () => {
  const offenders = [...textFields()].filter(([, v]) => v.includes(EM_DASH)).map(([f]) => f);
  assert.deepEqual(offenders, [], `em dash found in: ${offenders.join(", ")}`);
});

test("no note body, tip, intro or term uses the 'e.g.' shorthand", () => {
  const offenders = [...textFields()].filter(([, v]) => v.includes("e.g.")).map(([f]) => f);
  assert.deepEqual(offenders, [], `"e.g." found in: ${offenders.join(", ")}`);
});

test("the specific wordings fixed in the audit do not reappear", () => {
  const banned = [
    "often and back",
    "block light to the coral",
    "used to separate the particles",
    "Feeding does not help",
  ];
  const hits = [];
  for (const [field, v] of textFields()) {
    for (const b of banned) if (v.includes(b)) hits.push(`${field} :: "${b}"`);
  }
  assert.deepEqual(hits, [], `banned wording found: ${hits.join("; ")}`);
});

test("every section still has id, title, notes and terms, with the same counts", () => {
  let units = 0, sections = 0, notes = 0, terms = 0;
  for (const unit of Object.keys(NOTES)) {
    units++;
    assert.ok(Array.isArray(NOTES[unit].sections), `unit ${unit} has a sections array`);
    for (const s of NOTES[unit].sections) {
      sections++;
      assert.ok(typeof s.id === "string" && s.id, `${unit} section has an id`);
      assert.ok(typeof s.title === "string" && s.title, `${unit}/${s.id} has a title`);
      assert.ok(Array.isArray(s.notes) && s.notes.length > 0, `${unit}/${s.id} has notes`);
      assert.ok(Array.isArray(s.terms) && s.terms.length > 0, `${unit}/${s.id} has terms`);
      for (const n of s.notes) {
        assert.ok(typeof n.h === "string" && typeof n.body === "string", `${unit}/${s.id} note has h + body`);
      }
      for (const t of s.terms) {
        assert.ok(Array.isArray(t) && t.length === 2, `${unit}/${s.id} term is a [term, def] pair`);
      }
      notes += s.notes.length;
      terms += s.terms.length;
    }
  }
  // Baseline counts at the time of the writing-quality pass (content fixes only
  // changed wording, never the shape). Bump these deliberately if notes/terms
  // are intentionally added or removed, in the same commit.
  assert.equal(units, 6, "unit count");
  assert.equal(sections, 37, "section count");
  assert.equal(notes, 227, "total notes count");
  assert.equal(terms, 199, "total terms count");
});
