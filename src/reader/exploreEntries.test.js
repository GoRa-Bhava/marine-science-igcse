import { test } from "node:test";
import assert from "node:assert/strict";
import {
  EXPLORE_ENTRIES, DISCOVERIES_ENTRY, EXPLORE_VIEWS, LIBRARY_VIEW,
} from "./exploreEntries.js";

test("Library exposes Interactive Lab and Concept Cards in the Explore group", () => {
  const byKey = Object.fromEntries(EXPLORE_ENTRIES.map((e) => [e.key, e]));
  assert.ok(byKey.interactives, "Interactive Lab entry present");
  assert.ok(byKey.concepts, "Concept Cards entry present");
  assert.equal(byKey.interactives.view, "interactives");
  assert.equal(byKey.concepts.view, "concepts");
  assert.match(byKey.interactives.title, /Interactive Lab/i);
  assert.match(byKey.concepts.title, /Concept Cards/i);
  assert.match(byKey.concepts.title, /14/); // 14 comparisons
  assert.ok(byKey.flashcards, "Flashcards entry present");
  assert.equal(byKey.flashcards.view, "flashcards");
  assert.match(byKey.flashcards.title, /Flashcards/i);
});

test("Library exposes a Discoveries entry for the Ocean discoveries collection", () => {
  assert.equal(DISCOVERIES_ENTRY.view, "collection");
  assert.match(DISCOVERIES_ENTRY.title, /Discover/i);
});

test("every Explore/Discoveries view is a distinct route that is not the library", () => {
  const seen = new Set();
  for (const v of EXPLORE_VIEWS) {
    assert.equal(typeof v, "string");
    assert.notEqual(v, LIBRARY_VIEW, "an explore view must not be the library itself");
    assert.ok(!seen.has(v), `duplicate view route: ${v}`);
    seen.add(v);
  }
  // interactives, concepts, flashcards, collection
  assert.equal(EXPLORE_VIEWS.length, 4);
  assert.equal(LIBRARY_VIEW, "library");
});
