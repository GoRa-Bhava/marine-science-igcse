import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const read = (p) => readFileSync(new URL(p, import.meta.url), "utf8");
const HOOK = read("./useRestoreScroll.js");
const READER = read("./ReaderApp.jsx");
const WRITING = read("../writing/WritingPractice.jsx");
const FIGS = read("../figdata/FiguresPractice.jsx");

test("the hook restores after layout, consumes once, and never smooth-scrolls", () => {
  assert.match(HOOK, /useLayoutEffect/, "restores in a layout effect (after layout, before paint)");
  assert.match(HOOK, /mem\.take\(listKey\)/, "consumes the saved position exactly once");
  assert.match(HOOK, /prefers-reduced-motion/, "skips the highlight under reduced motion");
  // A direct jump, not an animated scroll (brief: don't animate a long scroll).
  assert.doesNotMatch(HOOK, /behavior\s*:\s*["']smooth["']/, "no smooth-scroll animation");
});

test("the restore is synchronous, not rAF-only, so it works on a hidden/backgrounded page", () => {
  // requestAnimationFrame never fires while a tab is hidden or an APK WebView is
  // backgrounded, so an rAF-only restore would silently leave the list at the top.
  // The position is taken and applied synchronously in the layout effect; rAF is
  // only a re-assert for late layout.
  const take = HOOK.indexOf("mem.take(listKey)");
  const applyCall = HOOK.search(/\n\s*apply\(\);/);        // the synchronous call
  const raf = HOOK.indexOf("requestAnimationFrame(apply)"); // the re-assert
  assert.ok(take !== -1 && applyCall !== -1 && raf !== -1, "take + synchronous apply() + rAF re-assert all present");
  assert.ok(take < applyCall && applyCall < raf, "apply() runs synchronously before the rAF re-assert");
});

test("the hook is shared, not copied: all three lists import the one hook", () => {
  for (const [name, src] of [["ReaderApp", READER], ["WritingPractice", WRITING], ["FiguresPractice", FIGS]]) {
    assert.match(src, /import\s*\{[^}]*useRestoreScroll[^}]*\}\s*from\s*["'][^"']*useRestoreScroll\.js["']/,
      `${name} imports the shared useRestoreScroll hook`);
  }
});

test("Practicals: list remembers the opened card and restores instead of topping", () => {
  // Only the list (not the open detail) is the "showing list" state.
  assert.match(READER, /useRestoreScroll\("practicals",\s*view === "practicals" && practicalOpen == null\)/);
  assert.match(READER, /ref=\{pracScroll\.listRef\}/, "list root carries the scroll ref");
  assert.match(READER, /data-restore-item=\{p\.id\}/, "each card is findable for the centre-on-item fallback");
  // Position is captured BEFORE switching to the detail, while the list is still up.
  assert.match(READER, /pracScroll\.rememberOpen\(p\.id\);\s*setPracticalOpen\(p\.id\)/);
  assert.match(READER, /restoreHighlight\(C,\s*pracScroll\.highlightId === p\.id\)/, "brief highlight on return");
});

test("Practicals: the blanket scroll-to-top no longer fires on open/close", () => {
  // practicalOpen was removed from the global top effect so returning can restore…
  assert.match(READER, /\}, \[view, currentId, browse\.pos\]\);/, "global top effect drops practicalOpen");
  // …and opening a practical tops the detail via its own layout effect instead.
  assert.match(READER, /if \(view === "practicals" && practicalOpen != null\)/, "detail reads from the top");
});

test("Writing practice: the question list keeps its place on Back", () => {
  assert.match(WRITING, /useRestoreScroll\("writing",\s*screen === "list"\)/);
  assert.match(WRITING, /ref=\{listRef\}/, "list root carries the scroll ref");
  assert.match(WRITING, /data-restore-item=\{w\.id\}/);
  assert.match(WRITING, /rememberOpen\(w\.id\),\s*openQuestion\(w\.id\)/, "remember before opening the question");
  assert.match(WRITING, /restoreHighlight\(C,\s*highlightId === w\.id\)/);
  // A question/mark screen reads from the top, not the list's old scroll.
  assert.match(WRITING, /if \(screen !== "list"\) window\.scrollTo\(0, 0\)/);
});

test("Figures & data: the figure-type list keeps its place on Back", () => {
  assert.match(FIGS, /useRestoreScroll\("figdata",\s*screen === "list"\)/);
  assert.match(FIGS, /ref=\{listRef\}/, "list root carries the scroll ref");
  assert.match(FIGS, /data-restore-item=\{t\.key\}/);
  assert.match(FIGS, /rememberOpen\(t\.key\);\s*startFig\(t\.key\)/, "remember before starting the figure run");
  assert.match(FIGS, /restoreHighlight\(C,\s*highlightId === t\.key\)/);
  assert.match(FIGS, /if \(screen !== "list"\) window\.scrollTo\(0, 0\)/);
});
