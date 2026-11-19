import { useRef, useState, useCallback, useLayoutEffect } from "react";
import { restorePlan, shouldHighlight, makeMemory, cssEscape, HIGHLIGHT_MS } from "./scrollRestore.core.js";

/* useRestoreScroll — keep a student's place in a long scrolling list.
 *
 * The problem: these screens navigate with React state, not routes. When a
 * student scrolls down a list (86 writing questions, 22 practical cards, the
 * figure types) and opens one, going back used to drop them at the top of the
 * list, so they had to scroll down again to find their place.
 *
 * The fix: when an item is opened, remember the list's scroll position and which
 * item was opened; when the list is shown again (Back / close / done), put the
 * student back where they were — directly, with no smooth-scroll animation — and
 * briefly highlight the item they came from. One shared hook, used by every list
 * that opens a detail view, rather than a copy in each.
 *
 * Memory lives in a ref on the hook instance, so it survives the round-trip to an
 * item (the list stays mounted, or its owning component does) but is cleared when
 * the component remounts — i.e. opening the page fresh from the menu starts at the
 * top, as it should. It is not meant to survive a reload.
 *
 * The app scrolls the window on both phone/APK and desktop (the desktop sidebar
 * scrolls on its own; the content column scrolls with the window), so by default
 * we read and write window scroll. If a list is ever placed inside its own scroll
 * box, we find that box by walking up from the list node, so the hook keeps
 * working without changes here.
 *
 *   const { listRef, rememberOpen, highlightId, hasPending } =
 *     useRestoreScroll(listKey, showingList);
 *
 *   listKey      a stable string for this list; include the unit/filter if the
 *                list can be filtered, e.g. `practicals` or `writing:unit3`, so
 *                each filtered view restores independently.
 *   showingList  true while the list itself is on screen (false on the detail).
 *   listRef      attach to the list's root element.
 *   rememberOpen call in the open handler, BEFORE switching to the detail, with
 *                the id of the opened item.
 *   highlightId  the id to highlight for ~1s after a restore (null otherwise;
 *                never set when the user prefers reduced motion).
 *   hasPending   () => whether a restore is queued for this listKey right now,
 *                for a caller that force-scrolls to top on navigation and wants
 *                to stand aside when we are about to restore instead.
 */

function scrollerOf(node) {
  let el = node && node.parentElement;
  while (el && el.nodeType === 1 && el !== document.body && el !== document.documentElement) {
    const oy = getComputedStyle(el).overflowY;
    if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight + 1) return el;
    el = el.parentElement;
  }
  return null; // null => the window / document scrolls
}
function readTop(sc) {
  if (sc) return sc.scrollTop;
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}
function writeTop(sc, top) {
  // Direct jump, never a smooth animation — nothing should slow the student down.
  if (sc) { sc.scrollTop = top; return; }
  const el = document.scrollingElement || document.documentElement;
  if (el) el.scrollTop = top; else window.scrollTo(0, top);
}
function maxTop(sc) {
  if (sc) return sc.scrollHeight - sc.clientHeight;
  const el = document.scrollingElement || document.documentElement || document.body;
  return (el ? el.scrollHeight : 0) - window.innerHeight;
}
function reducedMotion() {
  return typeof window !== "undefined" && typeof window.matchMedia === "function"
    && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useRestoreScroll(listKey, showingList) {
  const memRef = useRef(null);
  if (!memRef.current) memRef.current = makeMemory();  // listKey -> { top, itemId }
  const mem = memRef.current;
  const listRef = useRef(null);
  const [highlightId, setHighlightId] = useState(null);

  const rememberOpen = useCallback((itemId) => {
    mem.save(listKey, readTop(scrollerOf(listRef.current)), itemId);
  }, [mem, listKey]);

  const hasPending = useCallback(() => mem.peek(listKey), [mem, listKey]);

  useLayoutEffect(() => {
    if (!showingList || !mem.peek(listKey)) return;

    let hlTimer = 0;
    const raf = requestAnimationFrame(() => {
      const saved = mem.take(listKey);       // consume now, after we actually restore
      if (!saved) return;
      const sc = scrollerOf(listRef.current);
      const plan = restorePlan(saved.top, maxTop(sc));
      if (plan.mode === "top") {
        writeTop(sc, plan.top);              // same place as before — direct, no animation
      } else {
        const node = listRef.current
          && listRef.current.querySelector(`[data-restore-item="${cssEscape(saved.itemId)}"]`);
        if (node && typeof node.scrollIntoView === "function") node.scrollIntoView({ block: "center" });
        else writeTop(sc, Math.max(0, maxTop(sc)));
      }
      if (shouldHighlight(saved.itemId, reducedMotion())) {
        setHighlightId(saved.itemId);
        hlTimer = window.setTimeout(() => setHighlightId(null), HIGHLIGHT_MS);
      }
    });
    return () => { cancelAnimationFrame(raf); if (hlTimer) clearTimeout(hlTimer); };
    // listKey is stable per list; showingList flipping back to true is the "Back".
  }, [showingList, listKey, mem]);

  return { listRef, rememberOpen, highlightId, hasPending };
}

/* A soft outline in palette colours for the item the student came back from.
 * Spread onto the item's style when its id matches highlightId. */
export function restoreHighlight(C, on) {
  if (!on) return null;
  return {
    outline: `2px solid ${(C && (C.glow || C.accent)) || "#4fd8c4"}`,
    outlineOffset: 2,
    transition: "outline-color .4s ease",
  };
}
