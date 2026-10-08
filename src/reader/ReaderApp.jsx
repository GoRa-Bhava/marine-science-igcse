import React, { useEffect, useMemo, useRef, useState } from "react";
import { createProgressStore, PROFILE_COLORS } from "./progressStore.js";
import { isEntitled, isUnlocked as isUnlockedUnit, maxProfilesOf, graceExpired, activate as lsActivate, validate as lsValidate, deactivate as lsDeactivate } from "../licence/licence.js";
import { LICENCE_CONFIG, CHECKOUT_READY } from "../licence/config.js";
import { buildContentIndex, secOf } from "./contentIndex.js";
import { boxAfter, unitReadiness, coverage, reviseIds, masteryState } from "./scoring.js";
import { answer as schedAnswer } from "../engine/scheduler.js";
import { buildMixedSession, MIXED_SESSION_SIZE } from "../engine/mixed.js";
import { EXPLORE_ENTRIES, DISCOVERIES_ENTRY } from "./exploreEntries.js";
import { NOTES, notesUnits, notesByUnit } from "./notes.js";
import { PRACTICALS, practicalsList, practicalById, practicalItemIds } from "./practicals.js";

// Practical items grade + persist through the normal machinery (they're keyed in
// itemById below), but are deliberately kept OUT of the content index, so they
// never count toward a unit's home "% covered".
const PRACTICAL_ITEMS = PRACTICALS.flatMap((p) => p.items);

/* The Units 1–6 Reader — the whole app. A self-paced, book-style flow with
   durable device-local progress (IndexedDB) and a wrong-weighted smart-practice
   mode. Reuses the existing item components via `renderItemBody` and shared
   grading, so questions look and grade exactly as before. The Library also hosts
   the learn/reference surfaces (Interactive Lab, Concept Cards, Ocean
   discoveries) and the app's settings (theme, updates, back up / restore). */

const FONT_UI = "Karla, system-ui, sans-serif";
const FONT_DISPLAY = "Fraunces, Georgia, serif";
const TIER = { 1: "RECALL", 2: "APPLICATION", 3: "EXAM" };

// Decorative unit artwork (under public/images/units/). Relative paths — the app
// is built with base "./". Grid cards use the 256px thumbs; the desktop hero card
// uses the 512px copy. See public/images/units/.
const UNIT_IMG = {
  1: "unit-1-earth-processes",
  2: "unit-2-sea-water",
  3: "unit-3-marine-organisms",
  4: "unit-4-nutrients-and-energy",
  5: "unit-5-marine-ecosystems",
  6: "unit-6-human-influences",
};
const unitThumb = (id) => (UNIT_IMG[id] ? `images/units/${UNIT_IMG[id]}.jpg` : null);
const unitHero = (id) => (UNIT_IMG[id] ? `images/units/${UNIT_IMG[id]}-512.jpg` : null);
const IS_NATIVE = typeof window !== "undefined" && !!window.Capacitor?.isNativePlatform?.();
const todayISO = () => new Date().toISOString().slice(0, 10);

function daysToExam(iso) {
  if (!iso) return null;
  const d = Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
  return Number.isFinite(d) ? d : null;
}

function answerText(item) {
  const t = item.type;
  if (t === "truefalse") return item.answer ? "True" : "False";
  if (t === "choice" || t === "best") return item.options?.[item.a] ?? "";
  if (t === "multi") return (item.a || []).map((i) => item.options[i]).join(" · ");
  if (t === "gap") return (item.answers || []).join(" · ");
  if (t === "match") return (item.pairs || []).map((p) => `${p[0]} → ${p[1]}`).join("; ");
  if (t === "chain") return (item.chunks || []).join(" → ");
  if (t === "exam") return (item.build || item.modelAnswer || []).join("  ");
  return "";
}

// True on wide (desktop web) viewports only. The Capacitor APK is always phone
// width, so this stays false there and the desktop shell is never rendered.
function useIsDesktop() {
  const Q = "(min-width: 861px)";
  const read = () => (typeof window !== "undefined" && window.matchMedia ? window.matchMedia(Q).matches : false);
  const [desktop, setDesktop] = useState(read);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mq = window.matchMedia(Q);
    const on = () => setDesktop(mq.matches);
    on();
    mq.addEventListener ? mq.addEventListener("change", on) : mq.addListener(on);
    return () => { mq.removeEventListener ? mq.removeEventListener("change", on) : mq.removeListener(on); };
  }, []);
  return desktop;
}

export function ReaderApp({
  content, C, theme, onSetTheme, renderItemBody, grade, canSubmit, initAnswer,
  CreatureArt, creatures, InteractiveLab, ComparisonCard, ComparisonSelector,
  comparisonCards = [], UpdatesControl, flashcards = [],
}) {
  const desktop = useIsDesktop();
  const index = useMemo(() => buildContentIndex(content.items, content.figures || {}), [content]);
  const itemById = useMemo(() => Object.fromEntries([...content.items, ...PRACTICAL_ITEMS].map((i) => [i.id, i])), [content]);

  const storeRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [progressMap, setProgressMap] = useState({});
  const [sectionStates, setSectionStates] = useState({});
  const [settings, setSettings] = useState({});
  const [owned, setOwned] = useState([]);
  const [bookmarks, setBookmarks] = useState({ byUnit: {}, lastUnitId: null });

  const [view, setView] = useState("library");
  const [mode, setMode] = useState("read");       // read | smart | retry
  const [queue, setQueue] = useState([]);          // itemIds for read/retry
  const [pos, setPos] = useState(0);
  const [maxPos, setMaxPos] = useState(0);         // furthest position reached this run (earlier = reviewable)
  const [sectionId, setSectionId] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [locked, setLocked] = useState(false);
  const [wasRight, setWasRight] = useState(false);
  const [recent, setRecent] = useState([]);
  const [srMap, setSrMap] = useState({}); // spaced-repetition schedule (Mixed Practice only)
  const [session, setSession] = useState({ answered: [], wrong: [], count: 0, correct: 0 });
  const [checkpointSec, setCheckpointSec] = useState(null);
  const [browse, setBrowse] = useState({ ids: [], pos: 0, title: "" });
  const [reveal, setReveal] = useState(null);

  // Concept-cards state lives here so the chosen comparison + learn/self-check
  // mode persist while you flip between cards (as they did in the classic screen).
  const [conceptIndex, setConceptIndex] = useState(0);
  const [conceptMode, setConceptMode] = useState("learn");

  // Flashcards (standalone revision — no queue/mastery). All React state.
  const [fcUnit, setFcUnit] = useState(null);   // null = unit picker; number or "all" = a deck
  const [fcPos, setFcPos] = useState(0);
  const [fcFlipped, setFcFlipped] = useState(false);
  const [fcSeen, setFcSeen] = useState(() => new Set());

  // Read = syllabus notes (book-style). Read-only: no queue, mastery or rewards.
  const [notesUnit, setNotesUnit] = useState(null); // null = unit picker; 1..6 = a unit
  const [notesSec, setNotesSec] = useState(null);   // section id string within the unit

  // Home unit cards expand to show their section list (ephemeral UI state, not saved).
  const [expandedUnits, setExpandedUnits] = useState({}); // { [unitId]: true }
  const toggleUnit = (uid) => setExpandedUnits((m) => ({ ...m, [uid]: !m[uid] }));

  // Practicals section: null = index, or an open practical id (ephemeral UI state).
  const [practicalOpen, setPracticalOpen] = useState(null);

  // Settings: back up / restore / reset (against this device's Reader store).
  const [backupMsg, setBackupMsg] = useState("");
  const [restoreText, setRestoreText] = useState("");
  const [restoreMsg, setRestoreMsg] = useState("");
  const [restoreErr, setRestoreErr] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [resetDoneId, setResetDoneId] = useState(null);      // shows a tiny "reset" ack on that item
  const [confirmResetUnit, setConfirmResetUnit] = useState(null); // unitId pending its confirm on the card
  // Local learner profiles (device-level). maxProfiles comes from the licence
  // entitlement (free/single 1, family 3); the licence-gate PR fills it in.
  const [profiles, setProfiles] = useState([]);
  const [activeProfileId, setActiveProfileId] = useState(null);
  const [maxProfiles, setMaxProfiles] = useState(1);
  const [newProfileName, setNewProfileName] = useState("");
  const [confirmDeleteProfile, setConfirmDeleteProfile] = useState(null);
  // Licence entitlement (device-level). null = free (Unit 1 only).
  const [entitlement, setEntitlement] = useState(null);
  const [keyInput, setKeyInput] = useState("");
  const [licenceMsg, setLicenceMsg] = useState("");
  const [licenceBusy, setLicenceBusy] = useState(false);

  // ---- load persisted state (also re-run after restore / reset) ----
  async function loadAll() {
    if (!storeRef.current) storeRef.current = await createProgressStore();
    const store = storeRef.current;
    const [all, bmOld, bms, st, sec] = await Promise.all([
      store.getAllItemProgress(), store.getBookmark(), store.getBookmarks(),
      store.getSettings(), store.getAllSectionState(),
    ]);
    setProgressMap(Object.fromEntries(all.map((r) => [r.itemId || r.id, r])));
    setSectionStates(Object.fromEntries(sec.map((r) => [r.sectionId || r.id, r])));
    setSettings(st || {});
    setOwned((st && st.creatures) || []);
    // Per-unit bookmarks. First launch after the upgrade: seed from the legacy
    // single bookmark so the user's current resume point survives.
    let bookmarksRec = (bms && bms.byUnit) ? bms : { byUnit: {}, lastUnitId: null };
    if (!Object.keys(bookmarksRec.byUnit).length && bmOld && bmOld.unitId != null) {
      bookmarksRec = { byUnit: { [bmOld.unitId]: bmOld }, lastUnitId: bmOld.unitId };
      store.putBookmarks(bookmarksRec); // persist the seed once
    }
    setBookmarks(bookmarksRec);
    // Profiles + the entitlement-driven profile cap (device-level).
    const dev = await store.getDeviceSettings();
    const ent = (dev && dev.entitlement) || null;
    setEntitlement(ent);
    setMaxProfiles(maxProfilesOf(ent));
    setProfiles(store.listProfiles());
    setActiveProfileId(store.getActiveProfileId());
    setSrMap(await store.getSRMap()); // Mixed-Practice spaced-repetition schedule

    // Re-validate on launch (honours refunds/disables without a webhook). On any
    // network failure the cached entitlement is kept — never hard-lock offline.
    if (ent && ent.key) {
      lsValidate(ent).then(async (r) => {
        if (r && r.ok && r.entitlement) {
          await store.putDeviceSettings({ entitlement: r.entitlement });
          setEntitlement(r.entitlement);
          setMaxProfiles(maxProfilesOf(r.entitlement));
        }
      }).catch(() => { /* keep cached */ });
    }
  }

  useEffect(() => {
    let live = true;
    (async () => {
      await loadAll();
      if (!live) return;
      // "Who's studying?" on launch only when more than one learner exists.
      if (storeRef.current && storeRef.current.listProfiles().length > 1) setView("profiles");
      setReady(true);
    })();
    return () => { live = false; };
  }, []);

  // Navigation scrolls the page back to the top. The app changes screens with
  // React state (not routes), so without this a new screen inherits the previous
  // scroll position — e.g. opening a practical from a scrolled list landed at the
  // bottom. Covers view switches, opening/closing a practical, each new question
  // and each browse card.
  useEffect(() => {
    try { window.scrollTo(0, 0); } catch (_) { /* SSR / no window */ }
  }, [view, practicalOpen, currentId, browse.pos]);

  const store = () => storeRef.current;
  const item = currentId ? itemById[currentId] : null;

  // Each unit remembers its own last Read-mode question, so "Continue revising"
  // and each unit card resume exactly where you left off in that unit. Only Read
  // mode moves a bookmark; smart / revise / notes never do.
  useEffect(() => {
    if (view !== "reader" || mode !== "read" || !currentId) return;
    const loc = index.itemLoc[currentId];
    if (!loc || loc.unitId == null) return;
    const bm = { unitId: loc.unitId, sectionId: loc.sectionId, itemId: currentId, indexInSection: loc.indexInSection, mode: "read" };
    setBookmarks((prev) => {
      const next = { byUnit: { ...prev.byUnit, [loc.unitId]: bm }, lastUnitId: loc.unitId };
      if (storeRef.current) storeRef.current.putBookmarks(next);
      return next;
    });
  }, [currentId, view, mode]);

  function loadItem(id) {
    setCurrentId(id);
    setAnswer(initAnswer(itemById[id]));
    setLocked(false);
    setWasRight(false);
    setResetDoneId(null);
  }

  // ---- device / browser BACK button → pop the app's own screen history ----
  // The app navigates with React state, not routes; this auto-captures a screen
  // history so hardware back (Android), browser back and iOS edge-swipe step back
  // one screen instead of exiting. Moving between questions inside the reader is
  // NOT a new screen; overlays close before any screen navigation.
  const snapshot = () => ({
    view, mode, sectionId, queue, pos, currentId,
    browse, notesUnit, notesSec, practicalOpen, fcUnit, checkpointSec,
  });
  function applySnapshot(s) {
    setView(s.view); setMode(s.mode); setSectionId(s.sectionId);
    setQueue(s.queue); setPos(s.pos); setCurrentId(s.currentId);
    setBrowse(s.browse); setNotesUnit(s.notesUnit); setNotesSec(s.notesSec);
    setPracticalOpen(s.practicalOpen); setFcUnit(s.fcUnit); setCheckpointSec(s.checkpointSec);
  }
  // Two snapshots with the same key are the SAME screen (question-to-question in the
  // reader is one screen), so back leaves the reader in one press.
  const screenKey = (s) => [
    s.view, s.notesUnit, s.notesSec, s.practicalOpen, s.fcUnit, s.checkpointSec,
    s.view === "reader" ? `${s.mode}:${s.sectionId}` : "",
    s.view === "browse" ? s.browse?.title : "",
  ].join("|");

  const histRef = useRef([]);    // stack of prior screen snapshots
  const prevRef = useRef(null);  // last snapshot seen
  const backing = useRef(false); // true while applying a back()

  // Capture forward navigation: on a screen-key change that wasn't a back(), push
  // the previous screen. Runs after every render (cheap; no deps).
  useEffect(() => {
    const cur = snapshot();
    const prev = prevRef.current;
    if (prev && screenKey(prev) !== screenKey(cur)) {
      if (backing.current) backing.current = false;      // this change WAS the back()
      else {
        histRef.current.push(prev);
        if (!IS_NATIVE) { try { window.history.pushState({ n: histRef.current.length }, ""); } catch {} }
      }
    }
    prevRef.current = cur;
  });

  // Returns true if it handled a back, false at the root.
  function goBackScreen() {
    if (reveal) { setReveal(null); return true; }         // close overlays first
    if (confirmReset) { setConfirmReset(false); return true; }
    const st = histRef.current;
    if (st.length) { backing.current = true; const s = st.pop(); applySnapshot(s); prevRef.current = s; return true; }
    return false;
  }
  // Keep the latest goBackScreen for the once-registered listeners (avoid stale closures).
  const backFnRef = useRef(goBackScreen);
  backFnRef.current = goBackScreen;

  // Android hardware back (Capacitor).
  useEffect(() => {
    if (!IS_NATIVE) return;
    let handle;
    import("@capacitor/app").then(({ App }) => {
      App.addListener("backButton", () => {
        if (!backFnRef.current()) App.exitApp();          // root → exit the app
      }).then((h) => { handle = h; });
    });
    return () => { handle && handle.remove && handle.remove(); };
  }, []);

  // Browser / PWA back + iOS edge-swipe (best-effort).
  useEffect(() => {
    if (IS_NATIVE) return;
    const onPop = () => { if (backFnRef.current()) { try { window.history.pushState({}, ""); } catch {} } };
    try { window.history.pushState({}, ""); } catch {}    // sentinel so the first back is captured
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  // ---- start / navigate ----
  function startRead(secId, startIndex = 0) {
    if (!isUnlockedUnit(index.sections[secId]?.unitId, entitlement)) { setView("unlock"); return; }
    const q = index.sections[secId]?.orderedItemIds || [];
    setMode("read"); setSectionId(secId); setQueue(q); setPos(startIndex); setMaxPos(startIndex);
    setSession({ answered: [], wrong: [], count: 0, correct: 0 });
    setView("reader"); loadItem(q[startIndex]);
  }
  function continueSection(secId) { // keep the running session (checkpoint → next section)
    const q = index.sections[secId]?.orderedItemIds || [];
    setMode("read"); setSectionId(secId); setQueue(q); setPos(0); setMaxPos(0);
    setView("reader"); loadItem(q[0]);
  }
  function startSmart() {
    if (!isEntitled(entitlement)) { setView("unlock"); return; }   // Mixed Practice spans all units
    // Spaced-repetition session: due items first (oldest-due), then new fill,
    // topics interleaved, one item per session, never empty.
    const topicOf = (id) => itemById[id]?.topic;
    const sessionIds = buildMixedSession(index.flatOrder, srMap, topicOf, MIXED_SESSION_SIZE);
    if (!sessionIds.length) return; // defensive; the bank is never empty
    setMode("smart"); setSectionId(null); setQueue(sessionIds); setPos(0); setMaxPos(0); setRecent([]);
    setSession({ answered: [], wrong: [], count: 0, correct: 0 });
    setView("reader"); loadItem(sessionIds[0]);
  }
  function startRetry(wrongIds) {
    setMode("retry"); setSectionId(null); setQueue(wrongIds); setPos(0); setMaxPos(0);
    setSession({ answered: [], wrong: [], count: 0, correct: 0 });
    setView("reader"); loadItem(wrongIds[0]);
  }
  // Revise an explicit id list sourced from persisted progress (the "Revise these N"
  // action). Grades + persists exactly like normal practice, so a correct answer
  // clears wrongFlag and the item leaves the revise list next time. Ends at summary.
  function startRevise(ids, label) {
    if (!ids.length) return;
    if (!isUnlockedUnit(index.itemLoc?.[ids[0]]?.unitId, entitlement)) { setView("unlock"); return; }
    setMode("revise"); setSectionId(null); setQueue(ids); setPos(0); setMaxPos(0);
    setSession({ answered: [], wrong: [], count: 0, correct: 0 });
    setView("reader"); loadItem(ids[0]);
  }
  // Run a practical's items through the graded loop (mirrors startRevise). Not
  // "read" mode, so it never moves a unit bookmark and ends at the session summary.
  function startPractical(id) {
    const ids = practicalItemIds(id);
    if (!ids.length) return;
    setMode("practical"); setSectionId(null); setQueue(ids); setPos(0); setMaxPos(0);
    setSession({ answered: [], wrong: [], count: 0, correct: 0 });
    setView("reader"); loadItem(ids[0]);
  }
  // Step back to the previous question (never re-scores). maxPos is unchanged, so
  // the furthest-reached position is remembered. Forward uses next() (which also
  // advances maxPos and handles the end of the queue).
  function goBack() {
    if (pos <= 0) return;
    const np = pos - 1;
    setPos(np); loadItem(queue[np]);
  }
  const isAttempted = (id) => (progressMap[id]?.timesSeen || 0) > 0;
  // Scan units in book order starting at startUnitId (then the units after it, then
  // wrapping to earlier units), returning the first unattempted item's location, or
  // null if everything is attempted.
  function nextUnattemptedFrom(startUnitId) {
    const order = index.units;
    const s = Math.max(0, order.findIndex((u) => u.unitId === startUnitId));
    const rotated = [...order.slice(s), ...order.slice(0, s)];
    for (const u of rotated) {
      for (const sid of u.sectionIds) {
        for (const id of index.sections[sid].orderedItemIds) {
          if (!isAttempted(id)) return { unitId: u.unitId, sectionId: sid, itemId: id };
        }
      }
    }
    return null;
  }

  // Resume = the next UNATTEMPTED question in book order from `unitId` (advancing
  // into later units when this one is done); if everything is attempted, fall back
  // to this unit's saved spot. No arg → continue from the last unit worked on.
  // NB: takes an argument, so never pass it directly as an event handler — wrap it
  // (onClick={() => resume(...)}), or a click event lands in unitId.
  function resume(unitId) {
    const startU = unitId != null ? unitId : (bookmarks.lastUnitId ?? index.units[0]?.unitId);
    if (startU == null) return;
    if (!isUnlockedUnit(startU, entitlement)) { setView("unlock"); return; }
    const target = nextUnattemptedFrom(startU);
    if (target) {
      const idx = index.itemLoc[target.itemId]?.indexInSection || 0;
      startRead(target.sectionId, idx);
      return;
    }
    // Everything attempted — nothing new to cover. Fall back to this unit's saved spot (else its start).
    const bm = bookmarks.byUnit[startU];
    const u = index.units.find((x) => x.unitId === startU) || index.units[0];
    if (bm && index.sections[bm.sectionId]) startRead(bm.sectionId, Math.max(0, bm.indexInSection || 0));
    else if (u) startRead(u.sectionIds[0], 0);
  }
  function startBrowse(ids, title) { setBrowse({ ids, pos: 0, title }); setView("browse"); }

  // ---- record an answer (persist box ladder, bookmark, section, rewards) ----
  async function record(it, right) {
    const s = store();
    const prev = progressMap[it.id];
    const np = boxAfter(prev, right, it.id);
    setProgressMap((m) => ({ ...m, [it.id]: np }));
    if (s) await s.putItemProgress(np);

    // Spaced repetition — Mixed Practice ONLY. Additive and isolated: the unit
    // flow never reads or writes the SR map. scheduler.answer handles first-attempt
    // rules (early-correct is a no-op; early-wrong is a lapse).
    if (mode === "smart") {
      const nextSr = { ...srMap, [it.id]: schedAnswer(srMap[it.id], right) };
      setSrMap(nextSr);
      if (s) await s.putSRMap(nextSr);
    }

    const sec = index.sectionOf(it.id);
    const nextMap = { ...progressMap, [it.id]: np };
    if (sec) {
      const ss = { sectionId: sec, status: "in_progress", lastItemId: it.id };
      setSectionStates((m) => ({ ...m, [sec]: { ...(m[sec] || {}), ...ss } }));
      if (s) await s.putSectionState(ss);
    }
    setSession((se) => ({
      answered: [...se.answered, it.id],
      wrong: right ? se.wrong : [...se.wrong, it.id],
      count: se.count + 1,
      correct: se.correct + (right ? 1 : 0),
    }));

    // Ocean Discoveries: weighted by correctness, not volume; not in browse.
    if (right && owned.length < creatures.length) {
      const acc = session.count ? (session.correct + 1) / (session.count + 1) : 1;
      if (Math.random() < 0.13 + 0.2 * acc) {
        const prog = index.units.filter((u) => unitReadiness(u.sectionIds.map((x) => index.sections[x].orderedItemIds), nextMap) >= 0.8).length / index.units.length;
        const roll = Math.random();
        const tier = roll < 0.05 + 0.35 * prog ? "rare" : roll < 0.35 + 0.3 * prog ? "uncommon" : "common";
        let pool = creatures.filter((c) => c.rarity === tier && !owned.includes(c.id));
        if (!pool.length) pool = creatures.filter((c) => !owned.includes(c.id));
        if (pool.length) {
          const pick = pool[Math.floor(Math.random() * pool.length)];
          const newOwned = [...owned, pick.id];
          setOwned(newOwned);
          if (s) await s.putSettings({ creatures: newOwned });
          setTimeout(() => setReveal(pick), 480);
        }
      }
    }
  }

  // Reset ONE question to never-attempted. Optimistic local update + persisted delete.
  async function resetItem(id) {
    const s = store();
    setProgressMap((m) => { const n = { ...m }; delete n[id]; return n; });
    if (s) await s.deleteItemProgress(id);
  }

  // Reset a WHOLE unit's questions to never-attempted; also clear the unit's section
  // states and its resume bookmark so the card reads "Not started".
  async function resetUnit(u) {
    const s = store();
    const ids = u.sectionIds.flatMap((sid) => index.sections[sid].orderedItemIds);
    setProgressMap((m) => { const n = { ...m }; for (const id of ids) delete n[id]; return n; });
    setSectionStates((m) => { const n = { ...m }; for (const sid of u.sectionIds) delete n[sid]; return n; });
    setBookmarks((prev) => {
      const byUnit = { ...prev.byUnit }; delete byUnit[u.unitId];
      const next = { ...prev, byUnit, lastUnitId: prev.lastUnitId === u.unitId ? null : prev.lastUnitId };
      if (s) s.putBookmarks(next);
      return next;
    });
    if (s) {
      await s.deleteItemProgressMany(ids);
      for (const sid of u.sectionIds) await s.deleteSectionState(sid);
    }
  }

  // ---- learner profiles ----
  async function switchProfile(id) {
    const s = store();
    if (!s || id === activeProfileId) { setView("library"); return; }
    await s.setActiveProfile(id);
    await loadAll();                         // reloads the chosen profile's data
    setSession({ answered: [], wrong: [], count: 0, correct: 0 });
    setView("library");
  }
  async function addProfile() {
    const s = store();
    if (!s || profiles.length >= maxProfiles) return;
    const name = newProfileName.trim() || `Learner ${profiles.length + 1}`;
    await s.createProfile(name);
    setProfiles(s.listProfiles());
    setNewProfileName("");
  }
  async function renameProfile(id, patch) {
    const s = store();
    if (!s) return;
    await s.renameProfile(id, patch);
    setProfiles(s.listProfiles());
  }
  async function deleteProfileLocal(id) {
    const s = store();
    if (!s) return;
    await s.deleteProfile(id);
    setConfirmDeleteProfile(null);
    await loadAll();                         // active may have changed
    setView("library");
  }

  // ---- licence / unlock ----
  async function activateKey() {
    const s = store();
    if (!s || licenceBusy) return;
    setLicenceBusy(true); setLicenceMsg("");
    const deviceId = (await s.getMeta())?.deviceId || "device";
    const r = await lsActivate(keyInput, deviceId);
    if (r.ok) {
      await s.putDeviceSettings({ entitlement: r.entitlement });
      setEntitlement(r.entitlement);
      setMaxProfiles(maxProfilesOf(r.entitlement));
      setKeyInput(""); setLicenceBusy(false);
      setLicenceMsg("Unlocked — thank you! All six units are now available.");
      setView("library");
    } else {
      setLicenceMsg(r.code === "limit" ? `${r.error} You can remove a device in Settings, or email ${LICENCE_CONFIG.supportEmail}.` : r.error);
      setLicenceBusy(false);
    }
  }
  async function removeDevice() {
    const s = store();
    if (!s || licenceBusy) return;
    setLicenceBusy(true);
    await lsDeactivate(entitlement);
    await s.putDeviceSettings({ entitlement: null });
    setEntitlement(null); setMaxProfiles(1);
    setLicenceBusy(false);
    setLicenceMsg("This device has been removed. Units 2–6 are locked again.");
  }

  function onPrimary() {
    if (locked) { next(); return; }
    if (!canSubmit(item, answer)) return;
    const right = grade(item, answer);
    setWasRight(right); setLocked(true);
    record(item, right);
  }

  function next() {
    if (mode === "smart") {
      // Step through the pre-built spaced-repetition session; end at the summary.
      const np = pos + 1;
      if (np >= queue.length) { setView("summary"); return; }
      setPos(np); if (np > maxPos) setMaxPos(np); loadItem(queue[np]);
      return;
    }
    const np = pos + 1;
    if (np >= queue.length) {
      if (mode === "read") { markSectionComplete(sectionId); setCheckpointSec(sectionId); setView("checkpoint"); }
      else setView("summary"); // retry finished
      return;
    }
    setPos(np); if (np > maxPos) setMaxPos(np); loadItem(queue[np]);
  }

  async function markSectionComplete(sec) {
    const ss = { sectionId: sec, status: "complete", lastItemId: currentId };
    setSectionStates((m) => ({ ...m, [sec]: { ...(m[sec] || {}), ...ss } }));
    if (store()) await store().putSectionState(ss);
  }

  // ---- rendering ----------------------------------------------------------
  if (!ready) {
    return <Shell C={C}><div style={{ padding: 40, fontFamily: FONT_UI, color: C.mist }}>Loading your progress…</div></Shell>;
  }
  let viewContent;
  if (view === "reader") viewContent = <>{renderReader()}{revealOverlay()}</>;
  else if (view === "checkpoint") viewContent = renderCheckpoint();
  else if (view === "summary") viewContent = renderSummary();
  else if (view === "browse") viewContent = renderBrowse();
  else if (view === "notes") viewContent = renderNotes();
  else if (view === "interactives") viewContent = renderInteractives();
  else if (view === "concepts") viewContent = renderConcepts();
  else if (view === "flashcards") viewContent = renderFlashcards();
  else if (view === "practicals") viewContent = renderPracticals();
  else if (view === "collection") viewContent = <>{renderCollection()}{revealOverlay()}</>;
  else if (view === "settings") viewContent = renderSettings();
  else if (view === "profiles") viewContent = renderProfilePicker();
  else if (view === "unlock") viewContent = renderUnlock();
  else viewContent = <>{renderLibrary()}{revealOverlay()}</>;
  // Desktop-only shell (sidebar + top bar). On phone/APK these are null, so Shell
  // renders exactly today's single <main> — the layout is byte-for-byte unchanged.
  return (
    <Shell C={C} sidebar={desktop ? renderSidebar() : null} topBar={desktop ? renderTopBar() : null}>
      {viewContent}
    </Shell>
  );

  function backToLibrary() { setView("library"); }

  // ---------- desktop shell: sidebar + top bar ----------
  function renderSidebar() {
    const dte = daysToExam(settings.examDate);
    const nav = (key, label, onClick, active) => (
      <button key={key} className="rl-nav-item" onClick={onClick} aria-current={active ? "page" : undefined}>{label}</button>
    );
    return (
      <aside className="rl-sidebar">
        <div className="rl-brand">Marine Science · IGCSE 0697</div>
        <nav className="rl-nav" aria-label="Primary">
          {nav("read", "📖 Revise a unit", () => resume(), view === "reader" && mode === "read")}
          {nav("smart", "🔀 Mixed Practice", startSmart, view === "reader" && mode === "smart")}
          {nav("notes", "📖 Syllabus Notes", () => setView("notes"), view === "notes")}
          <div className="rl-nav-group">Explore</div>
          {EXPLORE_ENTRIES.map((e) => nav(e.key, `${e.icon} ${e.title.split(" · ")[0]}`, () => setView(e.view), view === e.view))}
          {nav("collection", "🐚 Ocean Discoveries", () => setView("collection"), view === "collection")}
        </nav>
        <div className="rl-side-foot">
          {dte != null && <div className="rl-ready-chip">{dte} days to exam</div>}
          {nav("home", "Home", () => setView("library"), view === "library")}
          {nav("settings", "Settings", () => setView("settings"), view === "settings")}
        </div>
      </aside>
    );
  }
  function renderTopBar() {
    const TITLES = { library: "Your revision", reader: mode === "smart" ? "Mixed Practice" : "Revision", notes: "Syllabus Notes", browse: "Answers", interactives: "Interactive Lab", concepts: "Concept Cards", flashcards: "Flashcards", practicals: "Practicals", collection: "Ocean Discoveries", settings: "Settings", checkpoint: "Section end", summary: "Session summary" };
    return (
      <header className="rl-topbar">
        <div className="rl-topbar-title">{TITLES[view] || "Marine Science"}</div>
        <div className="rl-topbar-right">
          <div className="rl-theme-toggle">
            <button type="button" aria-pressed={theme === "dark"} onClick={() => onSetTheme && onSetTheme("dark")}>Dark</button>
            <button type="button" aria-pressed={theme === "light"} onClick={() => onSetTheme && onSetTheme("light")}>Light</button>
          </div>
        </div>
      </header>
    );
  }

  // ---------- Library ----------
  function renderLibrary() {
    const lastUid = bookmarks.lastUnitId;
    const lastBm = lastUid != null ? bookmarks.byUnit[lastUid] : null;
    const unitIdsOf = (u) => u.sectionIds.flatMap((s) => index.sections[s].orderedItemIds);
    // Focus = the unit that holds the next thing to do (so the card and its Continue
    // button agree); if everything is attempted, the last unit worked on, else Unit 1.
    const nextDo = nextUnattemptedFrom(lastUid ?? index.units[0]?.unitId);
    const focusUnit =
      index.units.find((u) => u.unitId === (nextDo ? nextDo.unitId : (lastBm ? lastBm.unitId : index.units[0]?.unitId)))
      || index.units[0];
    const fIds = unitIdsOf(focusUnit);
    const fCov = coverage(fIds, progressMap);
    const fRev = reviseIds(fIds, progressMap);
    // to-revise status pill: coral when there's work, green when a started unit is
    // clear, muted "Not started" otherwise.
    const revisePill = (attempted, n) => {
      const st = n > 0 ? { c: C.coral, t: `● ${n} to revise` } : attempted > 0 ? { c: C.ok, t: "✓ nothing to revise" } : { c: C.line, t: "Not started" };
      return <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 11px", borderRadius: 999, border: `1px solid ${st.c}`, color: st.c, fontFamily: FONT_UI, fontSize: 12.5, fontWeight: 700 }}>{st.t}</span>;
    };
    return (
      <div style={pad} className="rl-pad rl-pad--home">
        <TopBar C={C} left="Library" />
        <p style={kicker(C)}>MARINE SCIENCE IGCSE 0697</p>
        <h1 style={h1(C)}>Your revision</h1>
        <p style={{ ...sub(C), marginTop: 4 }}>Pick up where you left off, or choose anywhere.</p>
        {profiles.length > 1 && (() => {
          const ap = profiles.find((p) => p.id === activeProfileId);
          return (
            <button onClick={() => setView("profiles")} aria-label="Switch learner profile"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, marginTop: 10, padding: "6px 12px", borderRadius: 999, border: `1px solid ${C.line}`, background: C.shelf, cursor: "pointer", fontFamily: FONT_UI, fontSize: 13, color: C.foam }}>
              <span aria-hidden="true" style={{ width: 16, height: 16, borderRadius: "50%", background: (ap && ap.color) || C.glow }} />
              {ap ? ap.name : "Profile"} · <span style={{ color: C.accent }}>Switch</span>
            </button>
          );
        })()}

        {/* Focus card = the resume hero + this unit's coverage & to-revise. */}
        <div className="rl-hero" style={{ ...card(C), border: `1.5px solid ${C.glow}`, marginTop: 16 }}>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {/* Larger unit artwork — desktop only (hidden below 861px via responsive.css). */}
            {unitHero(focusUnit.unitId) && (
              <img className="rl-hero-img" src={unitHero(focusUnit.unitId)} alt="" width={140} height={140}
                style={{ display: "none", width: 140, height: 140, flexShrink: 0, objectFit: "cover", borderRadius: 14 }} />
            )}
            <Donut C={C} pct={fCov.pct} color={fCov.pct === 100 ? C.ok : C.glow} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ ...kicker(C), marginTop: 0 }}>UNIT {focusUnit.unitId}</p>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 600, color: C.foam, margin: "2px 0 4px", lineHeight: 1.15 }}>{focusUnit.title}</div>
              <div style={{ fontFamily: FONT_UI, color: C.mist, fontSize: 14 }}>{fCov.pct}% covered · {fCov.attempted} of {fCov.total} questions attempted</div>
            </div>
          </div>
          <div style={{ marginTop: 12 }}>{revisePill(fCov.attempted, fRev.length)}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 14 }}>
            <button style={primaryBtn(C)} onClick={() => resume(focusUnit.unitId)}>{bookmarks.byUnit[focusUnit.unitId] ? "Continue revising ›" : "Revise ›"}</button>
            {fRev.length > 0 && (
              <button style={{ ...primaryBtn(C), background: C.coral, color: "#fff" }} onClick={() => startRevise(fRev, `Unit ${focusUnit.unitId} to revise`)}>Revise these {fRev.length} →</button>
            )}
          </div>
        </div>

        <p style={{ ...kicker(C), marginTop: 22 }}>YOUR UNITS</p>
        {/* Unit grid: compact card per unit (ring + % covered + revise link). Tap a
            card to expand its section list; tap a section to study it. */}
        <div className="rl-unit-grid">
        {index.units.map((u, ui) => {
          const ids = unitIdsOf(u);
          const cov = coverage(ids, progressMap);
          const thumb = unitThumb(u.unitId);
          const thumbImg = thumb ? (
            <img className="rl-unit-thumb" src={thumb} alt="" width={64} height={64}
              loading={ui === 0 ? "eager" : "lazy"}
              style={{ width: 64, height: 64, flexShrink: 0, objectFit: "cover", borderRadius: 11 }} />
          ) : null;
          const rev = reviseIds(ids, progressMap);
          const bm = bookmarks.byUnit[u.unitId];   // this unit's own resume point
          const here = bm != null;
          const open = !!expandedUnits[u.unitId];
          const locked = !isUnlockedUnit(u.unitId, entitlement);
          if (locked) {
            // Locked unit: a lock badge + CTA; tapping it goes to the Unlock screen.
            return (
              <button key={u.unitId} className="rl-unit-card" onClick={() => setView("unlock")}
                aria-label={`Unit ${u.unitId} ${u.title} — locked. Unlock all units.`}
                style={{ ...card(C), marginTop: 14, width: "100%", textAlign: "left", cursor: "pointer", border: `1px dashed ${C.line}`, display: "flex", gap: 14, alignItems: "center" }}>
                {thumbImg}
                <span aria-hidden="true" style={{ width: 52, height: 52, flexShrink: 0, borderRadius: "50%", border: `1px solid ${C.line}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, color: C.mist }}>🔒</span>
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 600, color: C.foam }}>Unit {u.unitId} · {u.title}</span>
                  <span style={{ display: "block", fontFamily: FONT_UI, fontSize: 13.5, color: C.accent, marginTop: 2, fontWeight: 700 }}>Unlock all units — £20 ›</span>
                </span>
              </button>
            );
          }
          return (
            <div key={u.unitId} className="rl-unit-card" style={{ ...card(C), marginTop: 14, border: here ? `1.5px solid ${C.glow}` : `1px solid ${C.line}55` }}>
              {/* Header — tap toggles the section list. */}
              <button onClick={() => toggleUnit(u.unitId)} aria-expanded={open}
                style={{ display: "flex", gap: 14, alignItems: "center", width: "100%", textAlign: "left", background: "transparent", border: "none", padding: 0, cursor: "pointer" }}>
                {thumbImg}
                <Donut C={C} pct={cov.pct} size={52} color={cov.pct === 100 ? C.ok : C.glow} />
                <span style={{ flex: 1, minWidth: 0 }}>
                  <span style={{ display: "block", fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 600, color: C.foam }}>Unit {u.unitId} · {u.title}</span>
                  <span style={{ display: "block", fontFamily: FONT_UI, fontSize: 13.5, color: C.mist, marginTop: 2 }}>
                    {cov.attempted > 0 ? `${cov.pct}% covered · ${cov.attempted}/${cov.total}` : `Not started · ${cov.total} questions`}
                  </span>
                </span>
                <span aria-hidden="true" style={{ color: C.accent, fontSize: 18, transform: open ? "rotate(90deg)" : "none", transition: "transform .15s" }}>›</span>
              </button>
              {(rev.length > 0 || cov.attempted > 0) && (
                <div style={{ marginTop: 10 }}>
                  {rev.length > 0
                    ? <button onClick={() => startRevise(rev, `Unit ${u.unitId} to revise`)}
                        style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: C.coral, fontFamily: FONT_UI, fontSize: 13.5, fontWeight: 700 }}>● Revise {rev.length} →</button>
                    : <span style={{ color: C.ok, fontFamily: FONT_UI, fontSize: 13.5, fontWeight: 700 }}>✓ all clear</span>}
                </div>
              )}
              {/* Expanded panel — resume row (if any) + one row per section. */}
              {open && (
                <div style={{ marginTop: 12, borderTop: `1px solid ${C.line}55`, paddingTop: 6 }}>
                  {(nextUnattemptedFrom(u.unitId)?.unitId === u.unitId || bm) && (
                    <button onClick={() => resume(u.unitId)}
                      style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", background: "transparent", border: "none", borderRadius: 10, padding: "10px 8px", cursor: "pointer" }}>
                      <span style={{ color: C.glow, fontSize: 15 }}>▸</span>
                      <span style={{ flex: 1, fontFamily: FONT_UI, fontSize: 14.5, fontWeight: 700, color: C.foam }}>Continue where you left off</span>
                      <span aria-hidden="true" style={{ color: C.accent, fontSize: 18 }}>›</span>
                    </button>
                  )}
                  {u.sectionIds.map((sid) => {
                    const sec = index.sections[sid];
                    const scov = coverage(sec.orderedItemIds, progressMap);
                    const srev = reviseIds(sec.orderedItemIds, progressMap).length;
                    return (
                      <button key={sid} onClick={() => startRead(sid, 0)}
                        style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", textAlign: "left", background: "transparent", border: "none", borderRadius: 10, padding: "10px 8px", cursor: "pointer" }}>
                        <span style={{ flex: 1, minWidth: 0, fontFamily: FONT_UI, fontSize: 14.5, color: C.foam }}>
                          <b style={{ fontWeight: 700 }}>{sid}</b> {sec.title}
                        </span>
                        {srev > 0 && <span aria-label={`${srev} to revise`} title={`${srev} to revise`} style={{ color: C.coral, fontSize: 13, fontWeight: 700 }}>● {srev}</span>}
                        <span style={{ fontFamily: FONT_UI, fontSize: 12.5, color: C.mist, minWidth: 44, textAlign: "right" }}>
                          {scov.attempted > 0 ? `${scov.attempted}/${scov.total}` : `0/${scov.total}`}
                        </span>
                        <span aria-hidden="true" style={{ color: C.accent, fontSize: 18 }}>›</span>
                      </button>
                    );
                  })}
                  <div style={{ marginTop: 8, borderTop: `1px solid ${C.line}55`, paddingTop: 8 }}>
                    {confirmResetUnit === u.unitId ? (
                      <div>
                        <div style={{ fontFamily: FONT_UI, fontSize: 13, color: C.mist, marginBottom: 8 }}>
                          Reset all {cov.total} questions in Unit {u.unitId}? Your progress for this unit will be erased.
                        </div>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={async () => { await resetUnit(u); setConfirmResetUnit(null); }}
                            style={{ ...ghostBtn(C), flex: 1, border: `1px solid ${C.coral}`, color: C.coral }}>
                            Erase Unit {u.unitId}
                          </button>
                          <button onClick={() => setConfirmResetUnit(null)} style={{ ...ghostBtn(C), flex: 1 }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <button onClick={() => setConfirmResetUnit(u.unitId)} disabled={cov.attempted === 0}
                        aria-label={`Reset all progress in Unit ${u.unitId}`}
                        style={{ ...linkBtn(C), color: cov.attempted === 0 ? C.line : C.coral,
                                 opacity: cov.attempted === 0 ? 0.5 : 1, padding: 0 }}>
                        ↺ Reset unit progress
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
          <button style={entryBtn(C)} onClick={startSmart}>🔀 Mixed Practice / Spaced Repetition</button>
          <button style={entryBtn(C)} onClick={() => setView("notes")}>📖 Syllabus Notes</button>
        </div>

        <div style={{ marginTop: 22 }}>
          <p style={kicker(C)}>EXPLORE</p>
          <div className="rl-tile-row" style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 8 }}>
            {EXPLORE_ENTRIES.map((e) => (
              <button key={e.key} onClick={() => setView(e.view)}
                style={{ display: "flex", alignItems: "center", gap: 14, width: "100%", textAlign: "left", ...card(C), border: `1px solid ${C.line}55`, cursor: "pointer" }}>
                <span aria-hidden="true" style={{ fontSize: 24, lineHeight: 1 }}>{e.icon}</span>
                <span style={{ flex: 1 }}>
                  <span style={{ display: "block", fontFamily: FONT_UI, fontWeight: 700, fontSize: 16, color: C.foam }}>{e.title}</span>
                  <span style={{ display: "block", fontFamily: FONT_UI, fontSize: 13, color: C.mist, marginTop: 2 }}>{e.blurb}</span>
                </span>
                <span aria-hidden="true" style={{ color: C.accent, fontSize: 20 }}>›</span>
              </button>
            ))}
          </div>
        </div>

        <button onClick={() => setView(DISCOVERIES_ENTRY.view)}
          style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", ...card(C), marginTop: 12, cursor: "pointer" }}>
          <span aria-hidden="true" style={{ fontSize: 22, lineHeight: 1 }}>{DISCOVERIES_ENTRY.icon}</span>
          <span style={{ flex: 1, fontFamily: FONT_UI, fontSize: 15.5, fontWeight: 700, color: C.foam }}>{DISCOVERIES_ENTRY.title}</span>
          <span style={{ fontFamily: FONT_UI, fontSize: 13, color: C.mist }}>{owned.length}/{creatures.length} found</span>
          <span aria-hidden="true" style={{ color: C.accent, fontSize: 20 }}>›</span>
        </button>

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button onClick={() => setView("settings")} style={linkBtn(C)}>Settings</button>
        </div>
      </div>
    );
  }

  // ---------- Reader ----------
  function renderReader() {
    const it = item;
    const loc = index.itemLoc[it.id];
    const wrongFlag = progressMap[it.id]?.wrongFlag;
    const total = queue.length;
    const railSec = loc?.sectionId;
    // Free back/forward navigation. A question shows its read-only answer only if
    // it was actually ANSWERED this run (reviewed); a question that was skipped
    // (moved past without answering) stays attemptable when you come back to it.
    const behind = mode !== "smart" && pos < maxPos;
    const answeredThisRun = session.answered.includes(it.id);
    const reviewed = mode !== "smart" && !locked && answeredThisRun;
    const atEnd = mode !== "smart" && pos >= total - 1;
    return (
      <div style={pad} className="rl-pad rl-pad--reader rl-two-pane">
        <div className="rl-reader-col">
        <TopBar C={C} left={mode === "smart" ? "Mixed Practice" : mode === "practical" ? "Practicals" : `Revision · Unit ${loc?.unitId}`} />
        <p style={kicker(C)}>{mode === "smart" ? `MIXED PRACTICE · UNIT ${loc?.unitId} · ${index.sections[loc?.sectionId]?.title?.toUpperCase() || ""}` : mode === "practical" ? `PRACTICAL · ${it.ref || ""}` : `UNIT ${loc?.unitId} · ${loc?.sectionId} ${index.sections[loc?.sectionId]?.title?.toUpperCase()}`}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "8px 0 6px" }}>
          <span style={tierPill(C, it.tier)}>{TIER[it.tier] || "RECALL"}</span>
          <span style={{ fontFamily: FONT_UI, color: C.mist, fontSize: 14 }}>{mode === "smart" ? "Interleaved" : `Question ${pos + 1} of ${total}${behind ? (reviewed ? " · reviewing" : locked ? "" : " · skipped") : ""}`}</span>
        </div>
        {mode === "smart" && wrongFlag && !locked && (
          <div style={{ fontFamily: FONT_UI, fontSize: 12.5, color: C.no, marginBottom: 8 }}>↻ you missed this last time</div>
        )}
        {reviewed ? (
          <>
            <div style={{ fontFamily: FONT_UI, fontSize: 12.5, color: C.mist, margin: "2px 0 8px" }}>Reviewing an earlier question — not scored.</div>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 600, color: C.foam, lineHeight: 1.25, margin: "6px 0 14px", whiteSpace: "pre-line" }}>{it.q}</div>
            <div style={{ ...card(C), border: `1px solid ${C.ok}55` }}>
              <p style={{ ...kicker(C), color: C.ok }}>ANSWER</p>
              {answerText(it) && <div style={{ fontFamily: FONT_UI, fontSize: 16, color: C.foam, fontWeight: 600, lineHeight: 1.5 }}>{answerText(it)}</div>}
              <div style={{ fontFamily: FONT_UI, fontSize: 15, color: C.mist, lineHeight: 1.55, marginTop: answerText(it) ? 10 : 0 }}>{it.why}</div>
              {resetDoneId === it.id ? (
                <div style={{ fontFamily: FONT_UI, fontSize: 12.5, color: C.mist, marginTop: 10 }}>
                  ↺ Reset — this question is fresh again.
                </div>
              ) : (
                <button onClick={async () => { await resetItem(it.id); setResetDoneId(it.id); }}
                  aria-label="Reset this question to never attempted"
                  style={{ ...linkBtn(C), color: C.mist, marginTop: 10, display: "block", padding: 0 }}>
                  ↺ Reset this question
                </button>
              )}
            </div>
          </>
        ) : (
          <>
            <div style={{ marginTop: 6 }}>
              {renderItemBody(it, { locked, answer, setAnswer })}
            </div>
            {locked && (
              <div aria-live="polite" style={{ ...card(C), marginTop: 16 }}>
                <div style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 600, color: wasRight ? C.ok : C.no, marginBottom: 6 }}>
                  {wasRight ? "Correct" : "Not quite"}
                </div>
                <div style={{ fontFamily: FONT_UI, fontSize: 14.5, color: C.foam, lineHeight: 1.5 }}>{it.why}</div>
                <div style={{ fontFamily: FONT_UI, fontSize: 12.5, color: C.mist, marginTop: 8 }}>Ref: syllabus {secOf(it)}.</div>
                {resetDoneId === it.id ? (
                  <div style={{ fontFamily: FONT_UI, fontSize: 12.5, color: C.mist, marginTop: 10 }}>
                    ↺ Reset — this question is fresh again.
                  </div>
                ) : (
                  <button onClick={async () => { await resetItem(it.id); setResetDoneId(it.id); }}
                    aria-label="Reset this question to never attempted"
                    style={{ ...linkBtn(C), color: C.mist, marginTop: 10, display: "block", padding: 0 }}>
                    ↺ Reset this question
                  </button>
                )}
              </div>
            )}
          </>
        )}
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          {mode !== "smart" && pos > 0 && (
            <button onClick={goBack} style={ghostBtn(C)} aria-label="Previous question">‹ Back</button>
          )}
          {reviewed ? (
            // Answered earlier and navigated back to: just move forward.
            <button onClick={next} style={{ ...primaryBtn(C), flex: 1 }}>{atEnd ? "Finish ›" : "Next ›"}</button>
          ) : locked ? (
            <>
              <button onClick={() => setView("summary")} style={ghostBtn(C)}>Stop</button>
              <button onClick={onPrimary} style={{ ...primaryBtn(C), flex: 1 }}>{atEnd ? "Finish ›" : "Next ›"}</button>
            </>
          ) : (
            <>
              <button onClick={() => setView("summary")} style={ghostBtn(C)}>Stop</button>
              {mode !== "smart" && (
                <button onClick={next} style={ghostBtn(C)} aria-label="Skip this question">Skip ›</button>
              )}
              <button onClick={onPrimary} disabled={!canSubmit(item, answer)}
                style={{ ...primaryBtn(C), flex: 1, opacity: !canSubmit(item, answer) ? 0.5 : 1 }}>
                Check
              </button>
            </>
          )}
        </div>
        </div>
        {desktop && (
          <aside className="rl-rail" aria-label="Session stats">
            <h3>This session</h3>
            <div className="rl-rail-stat"><b>{session.count}</b><span>answered</span></div>
            <div className="rl-rail-stat"><b>{session.correct}</b><span>correct</span></div>
            <div className="rl-rail-stat"><b>{session.wrong.length}</b><span>to revisit</span></div>
            {railSec && mode !== "smart" && (() => {
              const c = coverage(index.sections[railSec].orderedItemIds, progressMap);
              return (
                <>
                  <h3 style={{ marginTop: 18 }}>This topic</h3>
                  <div className="rl-rail-stat"><b>{c.pct}%</b><span>covered</span></div>
                </>
              );
            })()}
          </aside>
        )}
      </div>
    );
  }

  // ---------- Section checkpoint ----------
  function renderCheckpoint() {
    const sec = index.sections[checkpointSec];
    const nextSec = index.nextSectionId(checkpointSec);
    const secRev = reviseIds(sec.orderedItemIds, progressMap);
    return (
      <div style={{ ...pad, textAlign: "center" }} className="rl-pad rl-pad--reader">
        <TopBar C={C} left="Section end" />
        <div style={{ width: 64, height: 64, borderRadius: "50%", background: `${C.line}33`, display: "grid", placeItems: "center", margin: "40px auto 14px", color: C.mist, fontSize: 26 }}>✓</div>
        <h1 style={{ ...h1(C), fontSize: 26 }}>End of {sec.sectionId} {sec.title}</h1>
        {secRev.length > 0 && (
          <p style={{ ...sub(C), textAlign: "center" }}>{secRev.length} question{secRev.length > 1 ? "s" : ""} in this section to revise.</p>
        )}
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          {secRev.length > 0 && (
            <button style={{ ...primaryBtn(C), background: C.coral, color: "#fff" }} onClick={() => startRevise(secRev, `${sec.sectionId} to revise`)}>Revise these {secRev.length} →</button>
          )}
          {nextSec
            ? <button style={primaryBtn(C)} onClick={() => continueSection(nextSec)}>Continue to {nextSec} {index.sections[nextSec].title} ›</button>
            : null}
          <button style={ghostBtn(C)} onClick={() => setView("library")}>Back to home</button>
        </div>
      </div>
    );
  }

  // ---------- Session summary ----------
  function renderSummary() {
    const wrongIds = session.wrong;
    return (
      <div style={pad} className="rl-pad rl-pad--reader">
        <TopBar C={C} left="Session paused" />
        <p style={kicker(C)}>SESSION PAUSED</p>
        <h1 style={h1(C)}>How that went</h1>
        <p style={sub(C)}>No streaks, no timer — you set the pace. Your place is bookmarked.</p>
        <div style={{ display: "flex", gap: 40, margin: "22px 0" }}>
          <Stat C={C} n={session.count} label="QUESTIONS" />
          <Stat C={C} n={session.correct} label="CORRECT" />
          <Stat C={C} n={wrongIds.length} label="TO REVISIT" />
        </div>
        {(() => {
          const band = { mastered: C.ok, improving: C.amber || C.glow, weak: C.no, unstarted: `${C.line}66` };
          const rows = index.units.map((u) => {
            const ids = u.sectionIds.flatMap((sid) => index.sections[sid].orderedItemIds);
            return { unitId: u.unitId, title: u.title, pct: coverage(ids, progressMap).pct, state: masteryState(ids, progressMap) };
          });
          const reduce = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          return (
            <div style={{ ...card(C), marginTop: 4 }}>
              <p style={kicker(C)}>COVERAGE BY UNIT</p>
              {rows.map((r) => (
                <div key={r.unitId} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 0", fontFamily: FONT_UI }}>
                  <span style={{ width: 150, flexShrink: 0, fontSize: 13.5, color: C.mist }}>Unit {r.unitId} · {r.title}</span>
                  <div style={{ flex: 1, height: 12, borderRadius: 6, background: `${C.line}33`, overflow: "hidden" }} aria-label={`Unit ${r.unitId} ${r.title}: ${r.pct}% covered, ${r.state}`}>
                    <div style={{ height: "100%", width: `${r.pct}%`, borderRadius: 6, background: band[r.state], transition: reduce ? "none" : "width 0.6s ease" }} />
                  </div>
                  <span style={{ width: 42, flexShrink: 0, textAlign: "right", fontSize: 13, fontWeight: 700, color: C.foam }}>{r.pct}%</span>
                </div>
              ))}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 14, marginTop: 10, fontFamily: FONT_UI, fontSize: 12, color: C.mist }}>
                {[["Mastered", band.mastered], ["Improving", band.improving], ["Weak", band.weak], ["Not started", band.unstarted]].map(([lbl, col]) => (
                  <span key={lbl} style={{ display: "inline-flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 11, height: 11, borderRadius: 3, background: col, display: "inline-block" }} />{lbl}
                  </span>
                ))}
              </div>
            </div>
          );
        })()}
        {wrongIds.length > 0 && (
          <div style={{ ...card(C) }}>
            <p style={kicker(C)}>THE {wrongIds.length} YOU MISSED</p>
            {wrongIds.map((id) => (
              <div key={id} style={{ display: "flex", gap: 10, padding: "10px 0", borderTop: `1px solid ${C.line}22`, fontFamily: FONT_UI, fontSize: 14.5, color: C.foam }}>
                <span style={{ color: C.no }}>✗</span>
                <span>{secOf(itemById[id])} — {(itemById[id].q || "").slice(0, 90)}</span>
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop: 18, display: "flex", flexDirection: "column", gap: 10 }}>
          {wrongIds.length > 0 && <button style={{ ...primaryBtn(C), background: C.coral, color: "#fff" }} onClick={() => startRetry(wrongIds)}>↻ Retry the ones I missed</button>}
          {session.answered.length > 0 && <button style={ghostBtn(C)} onClick={() => startBrowse(session.answered, "This session")}>See the correct answers</button>}
          <button style={ghostBtn(C)} onClick={() => setView("library")}>Back to library</button>
        </div>
      </div>
    );
  }

  // ---------- Browse (read-only) ----------
  function renderBrowse() {
    const id = browse.ids[browse.pos];
    const it = id ? itemById[id] : null;
    if (!it) return <div style={pad} className="rl-pad"><TopBar C={C} left="Read" /><p style={sub(C)}>Nothing to read.</p><button style={ghostBtn(C)} onClick={() => setView("library")}>‹ Library</button></div>;
    return (
      <div style={pad} className="rl-pad">
        <TopBar C={C} left="Read" />
        <p style={kicker(C)}>👁 READ-ONLY</p>
        <p style={{ ...sub(C), marginTop: 2 }}>Question and answer together, nothing to attempt — just to jog the memory.</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "10px 0 6px" }}>
          <span style={tierPill(C, it.tier)}>{TIER[it.tier] || "RECALL"}</span>
          <span style={{ fontFamily: FONT_UI, color: C.mist, fontSize: 14 }}>{secOf(it)} · {browse.pos + 1} of {browse.ids.length}</span>
        </div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 600, color: C.foam, lineHeight: 1.25, margin: "6px 0 14px", whiteSpace: "pre-line" }}>{it.q}</div>
        <div style={{ ...card(C), border: `1px solid ${C.ok}55` }}>
          <p style={{ ...kicker(C), color: C.ok }}>ANSWER</p>
          {answerText(it) && <div style={{ fontFamily: FONT_UI, fontSize: 16, color: C.foam, fontWeight: 600, lineHeight: 1.5 }}>{answerText(it)}</div>}
          <div style={{ fontFamily: FONT_UI, fontSize: 15, color: C.mist, lineHeight: 1.55, marginTop: answerText(it) ? 10 : 0 }}>{it.why}</div>
        </div>
        {resetDoneId === it.id ? (
          <div style={{ fontFamily: FONT_UI, fontSize: 12.5, color: C.mist, margin: "4px 0 10px" }}>
            ↺ Reset — this question is fresh again.
          </div>
        ) : (
          <button onClick={async () => { await resetItem(it.id); setResetDoneId(it.id); }}
            aria-label="Reset this question to never attempted"
            style={{ ...linkBtn(C), color: C.mist, margin: "4px 0 10px", display: "block", padding: 0 }}>
            ↺ Reset this question
          </button>
        )}
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button style={ghostBtn(C)} onClick={() => setView("library")}>‹ Library</button>
          <button style={{ ...primaryBtn(C), flex: 1, background: "transparent", color: C.foam, border: `1px solid ${C.line}` }}
            disabled={browse.pos + 1 >= browse.ids.length}
            onClick={() => setBrowse((b) => ({ ...b, pos: Math.min(b.pos + 1, b.ids.length - 1) }))}>Next question ›</button>
        </div>
      </div>
    );
  }

  // ---------- Read: syllabus notes (Units 1–6), book-style, read-only ----------
  // Pure reading surface — no scoring, bookmark writes, queue/mastery/readiness
  // changes or reward rolls. The only jump into the practice loop is the explicit
  // "Revise …" nudge at the foot of a section (startRead).
  function notesOpenUnit(u) { setNotesUnit(u); setNotesSec(notesByUnit(u)[0]?.id || null); }
  function notesBackToUnits() { setNotesUnit(null); }

  function renderNotes() {
    // ----- unit picker -----
    if (notesUnit == null) {
      return (
        <div style={pad} className="rl-pad">
          <TopBar C={C} left="Syllabus Notes" />
          <button onClick={backToLibrary} style={linkBtn(C)}>‹ Library</button>
          <p style={kicker(C)}>READ · SYLLABUS NOTES</p>
          <h1 style={{ ...h1(C), marginTop: 2 }}>Syllabus notes</h1>
          <p style={{ ...sub(C), marginTop: 4 }}>Plain-English notes for every syllabus point, unit by unit. Just to read — nothing here is graded or tracked.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
            {notesUnits.map((u) => {
              const unit = NOTES[u];
              if (!unit) return null;
              const n = (unit.sections || []).length;
              return (
                <button key={u} onClick={() => notesOpenUnit(u)}
                  style={{ ...card(C), display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, textAlign: "left", cursor: "pointer" }}>
                  <span style={{ minWidth: 0 }}>
                    <span style={{ display: "block", fontFamily: FONT_UI, fontSize: 12, fontWeight: 700, letterSpacing: ".08em", color: C.accent }}>UNIT {u}</span>
                    <span style={{ display: "block", fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 600, color: C.foam, marginTop: 2 }}>{unit.title}</span>
                  </span>
                  <span style={{ fontFamily: FONT_UI, fontSize: 13, color: C.mist, whiteSpace: "nowrap" }}>{n} section{n === 1 ? "" : "s"} ›</span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // ----- a unit: section tabs + the active section -----
    const unit = NOTES[notesUnit];
    const sections = notesByUnit(notesUnit);
    const active = sections.find((s) => s.id === notesSec) || sections[0];
    if (!unit || !active) {
      return (
        <div style={pad} className="rl-pad">
          <TopBar C={C} left="Syllabus Notes" />
          <button onClick={notesBackToUnits} style={linkBtn(C)}>‹ Units</button>
          <p style={sub(C)}>No notes for this unit yet.</p>
        </div>
      );
    }
    const hasPractice = !!index.sections[active.id];
    return (
      <div style={pad} className="rl-pad">
        <TopBar C={C} left={`Syllabus Notes · Unit ${notesUnit}`} />
        <button onClick={notesBackToUnits} style={linkBtn(C)}>‹ Units</button>
        <p style={{ ...kicker(C), marginTop: 8 }}>UNIT {notesUnit}</p>
        <h1 style={{ ...h1(C), marginTop: 2 }}>{unit.title}</h1>

        {/* section tabs — horizontal scroll on phone, select which section to read */}
        <div style={{ display: "flex", gap: 8, overflowX: "auto", margin: "14px 0 4px", paddingBottom: 4, WebkitOverflowScrolling: "touch" }}>
          {sections.map((s) => {
            const on = s.id === active.id;
            return (
              <button key={s.id} onClick={() => setNotesSec(s.id)} title={s.title} aria-current={on ? "true" : undefined}
                style={{ flex: "0 0 auto", padding: "8px 13px", borderRadius: 999, cursor: "pointer", fontFamily: FONT_UI, fontSize: 13, fontWeight: 700,
                  border: `1px solid ${on ? C.glow : C.line}`, background: on ? "rgba(79,216,196,.14)" : "transparent", color: on ? C.accent : C.mist, whiteSpace: "nowrap" }}>
                {s.id}
              </button>
            );
          })}
        </div>

        {/* active section: heading, intro, then a card per note */}
        <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 600, color: C.foam, lineHeight: 1.2, margin: "16px 0 0" }}>{active.id} {active.title}</h2>
        {active.intro && <p style={{ ...sub(C), marginTop: 6 }}>{active.intro}</p>}

        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
          {(active.notes || []).map((note, i) => (
            <div key={i} style={{ ...card(C) }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 600, color: C.foam, margin: 0, lineHeight: 1.3 }}>{note.h}</h3>
                {note.ref && <span style={refChip(C)}>{note.ref}</span>}
              </div>
              {/* body is human-authored HTML (bold key terms); render as HTML per brief */}
              <div className="rl-note-body" style={{ fontFamily: FONT_UI, fontSize: 15.5, color: C.mist, lineHeight: 1.6, marginTop: 8 }}
                dangerouslySetInnerHTML={{ __html: note.body }} />
              {note.linked && (
                <span style={{ ...refChip(C), display: "inline-block", marginTop: 10, background: "transparent", border: `1px dashed ${C.line}`, color: C.mist }}>🔗 {note.linked}</span>
              )}
            </div>
          ))}
        </div>

        {/* key terms for the section */}
        {active.terms?.length ? (
          <div style={{ ...card(C), marginTop: 14, border: `1px solid ${C.glow}55` }}>
            <p style={{ ...kicker(C), marginTop: 0 }}>KEY TERMS</p>
            <dl style={{ margin: "10px 0 0" }}>
              {active.terms.map(([term, def], i) => (
                <div key={i} style={{ marginTop: i ? 12 : 0 }}>
                  <dt style={{ fontFamily: FONT_UI, fontSize: 14.5, fontWeight: 700, color: C.foam }}>{term}</dt>
                  <dd style={{ fontFamily: FONT_UI, fontSize: 14.5, color: C.mist, lineHeight: 1.55, margin: "2px 0 0" }}>{def}</dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        {/* Examiner tip (all sections) + optional worked example (calculation sections).
            Authored HTML (<b> only), same as note.body. Tinted callouts via 8-digit
            hex alpha on the theme tokens (themes automatically; no color-mix, which the
            APK WebView never exercises). Coral = tip, teal = worked example. */}
        {active.tip && (
          <aside style={{ marginTop: 16, padding: "12px 14px", borderRadius: 12, background: `${C.coral}1f`, border: `1px solid ${C.coral}66` }}>
            <p style={{ ...kicker(C), color: C.coral, margin: "0 0 4px" }}>◎ EXAMINER TIP</p>
            <div style={{ fontFamily: FONT_UI, fontSize: 14.5, color: C.foam, lineHeight: 1.5 }}
                 dangerouslySetInnerHTML={{ __html: active.tip }} />
          </aside>
        )}
        {active.example && (
          <aside style={{ marginTop: 10, padding: "12px 14px", borderRadius: 12, background: `${C.glow}1a`, border: `1px solid ${C.glow}55` }}>
            <p style={{ ...kicker(C), color: C.accent, margin: "0 0 4px" }}>✎ WORKED EXAMPLE</p>
            <div style={{ fontFamily: FONT_UI, fontSize: 14.5, color: C.foam, lineHeight: 1.5 }}
                 dangerouslySetInnerHTML={{ __html: active.example }} />
          </aside>
        )}

        {/* revise nudge — the one explicit hop into the practice loop */}
        {hasPractice && (
          <button style={{ ...primaryBtn(C), marginTop: 18 }} onClick={() => startRead(active.id, 0)}>Revise {active.id} ›</button>
        )}
      </div>
    );
  }

  // ---------- Interactive Lab (learn/explore surface) ----------
  function renderInteractives() {
    return (
      <div style={pad} className="rl-pad">
        <TopBar C={C} left="Interactive Lab" />
        {InteractiveLab ? <InteractiveLab onBack={backToLibrary} theme={theme} /> : (
          <div>
            <button onClick={backToLibrary} style={linkBtn(C)}>‹ Library</button>
            <p style={sub(C)}>The interactive lab isn't available.</p>
          </div>
        )}
      </div>
    );
  }

  // ---------- Concept Cards (two-sided comparisons) ----------
  function renderConcepts() {
    const cards = comparisonCards;
    const card = cards[conceptIndex] || cards[0];
    return (
      <div style={pad} className="rl-pad">
        <TopBar C={C} left="Concept Cards" />
        <button onClick={backToLibrary} style={linkBtn(C)}>‹ Library</button>
        <div style={{ marginTop: 8 }}>
          {card && ComparisonCard ? (
            <ComparisonCard
              key={card.id}
              card={card}
              mode={conceptMode}
              onModeChange={setConceptMode}
              selector={ComparisonSelector ? (
                <ComparisonSelector cards={cards} activeIndex={conceptIndex} onSelect={setConceptIndex} />
              ) : null}
            />
          ) : <p style={sub(C)}>No comparison cards available.</p>}
        </div>
      </div>
    );
  }

  // ---------- Flashcards (standalone revision deck) ----------
  function fcMarkSeen(id) { setFcSeen((s) => (s.has(id) ? s : new Set(s).add(id))); }
  function fcOpenDeck(u) { setFcUnit(u); setFcPos(0); setFcFlipped(false); setFcSeen(new Set()); }
  function fcBackToUnits() { setFcUnit(null); setFcFlipped(false); }
  function fcNext(deck) {
    const cur = deck[fcPos]; if (cur) fcMarkSeen(cur.id);
    const np = fcPos + 1;
    if (np < deck.length) { setFcPos(np); setFcFlipped(false); }
  }

  function renderFlashcards() {
    const units = [...new Set(flashcards.map((c) => c.unit))].sort((a, b) => a - b);

    // ----- unit picker -----
    if (fcUnit == null) {
      return (
        <div style={pad} className="rl-pad">
          <TopBar C={C} left="Flashcards" />
          <button onClick={backToLibrary} style={linkBtn(C)}>‹ Library</button>
          <p style={kicker(C)}>FLASHCARDS · REVISION</p>
          <h1 style={{ ...h1(C), marginTop: 2 }}>Flip to learn</h1>
          <p style={{ ...sub(C), marginTop: 4 }}>A separate revision deck — flip a card to reveal the answer. Pure practice; kept apart from your unit progress.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
            <button onClick={() => fcOpenDeck("all")} style={{ ...card(C), border: `1.5px solid ${C.glow}`, textAlign: "left", cursor: "pointer" }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 600, color: C.foam }}>Mixed deck</div>
              <div style={{ fontFamily: FONT_UI, fontSize: 13, color: C.mist, marginTop: 2 }}>All units · {flashcards.length} cards</div>
            </button>
            {units.map((u) => {
              const n = flashcards.filter((c) => c.unit === u).length;
              const title = index.units.find((x) => x.unitId === u)?.title;
              return (
                <button key={u} onClick={() => fcOpenDeck(u)} style={{ ...card(C), display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, textAlign: "left", cursor: "pointer" }}>
                  <span style={{ fontFamily: FONT_UI, fontSize: 15.5, fontWeight: 700, color: C.foam }}>Unit {u}{title ? ` · ${title}` : ""}</span>
                  <span style={{ fontFamily: FONT_UI, fontSize: 13, color: C.mist }}>{n} card{n === 1 ? "" : "s"} ›</span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // ----- deck -----
    const deck = fcUnit === "all" ? flashcards : flashcards.filter((c) => c.unit === fcUnit);
    const fcCard = deck[fcPos];
    if (!fcCard) {
      return <div style={pad} className="rl-pad"><TopBar C={C} left="Flashcards" /><button onClick={fcBackToUnits} style={linkBtn(C)}>‹ Units</button><p style={sub(C)}>This deck is empty.</p></div>;
    }
    const seenCount = deck.filter((c) => fcSeen.has(c.id)).length;
    const rm = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    return (
      <div style={pad} className="rl-pad">
        <TopBar C={C} left={fcUnit === "all" ? "Flashcards · Mixed" : `Flashcards · Unit ${fcUnit}`} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <button onClick={fcBackToUnits} style={linkBtn(C)}>‹ Units</button>
          <span style={{ fontFamily: FONT_UI, fontSize: 13, color: C.mist }}>{fcCard.topic} · {seenCount} of {deck.length} seen</span>
        </div>

        {/* flip card — front → tap to reveal back. Revision only: nothing graded or stored. */}
        <div style={{ perspective: 1200, marginTop: 12 }}>
          <div role="button" tabIndex={0} aria-label={fcFlipped ? "Show term" : "Show definition"}
            onClick={() => { setFcFlipped((f) => !f); fcMarkSeen(fcCard.id); }}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setFcFlipped((f) => !f); fcMarkSeen(fcCard.id); } }}
            style={{ position: "relative", minHeight: 220, transformStyle: "preserve-3d", cursor: "pointer",
              transition: rm ? "none" : "transform .5s", transform: fcFlipped ? "rotateY(180deg)" : "none" }}>
            {/* front */}
            <div style={{ ...card(C), position: "absolute", inset: 0, backfaceVisibility: "hidden", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 8 }}>
              <span style={kicker(C)}>TERM</span>
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: 26, fontWeight: 600, color: C.foam }}>{fcCard.front}</span>
              <span style={{ fontFamily: FONT_UI, fontSize: 12.5, color: C.mist }}>tap to reveal</span>
            </div>
            {/* back */}
            <div style={{ ...card(C), position: "absolute", inset: 0, backfaceVisibility: "hidden", transform: "rotateY(180deg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", gap: 8 }}>
              <span style={kicker(C)}>DEFINITION</span>
              <span style={{ fontFamily: FONT_UI, fontSize: 17, lineHeight: 1.5, color: C.foam }}>{fcCard.back}</span>
            </div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button style={ghostBtn(C)} onClick={() => setFcFlipped((f) => !f)}>{fcFlipped ? "Show term" : "Show definition"}</button>
          <button style={{ ...primaryBtn(C), flex: 1 }} disabled={fcPos + 1 >= deck.length} onClick={() => fcNext(deck)}>Next ›</button>
        </div>
      </div>
    );
  }

  // ---------- Practicals (required lab procedures — learn + graded practice) ----------
  function renderPracticals() {
    const swatch = (color) => <span style={{ display: "inline-block", width: 26, height: 18, borderRadius: 5, background: color, border: `1px solid ${C.line}`, verticalAlign: "middle" }} />;
    const liBase = { fontFamily: FONT_UI, fontSize: 14, color: C.mist, lineHeight: 1.5 };

    // ----- index (grouped by unit) -----
    if (practicalOpen == null) {
      const list = practicalsList();
      const units = [...new Set(list.map((p) => p.unit))].sort((a, b) => a - b);
      const unitTitle = (u) => index.units.find((x) => x.unitId === u)?.title;
      const practicalCard = (p) => {
        const ids = practicalItemIds(p.id);
        const cov = coverage(ids, progressMap);
        const rev = reviseIds(ids, progressMap);
        return (
          <div key={p.id} style={{ ...card(C), border: `1px solid ${C.line}55` }}>
            <button onClick={() => setPracticalOpen(p.id)}
              style={{ display: "flex", gap: 12, alignItems: "flex-start", width: "100%", textAlign: "left", background: "transparent", border: "none", padding: 0, cursor: "pointer" }}>
              <span aria-hidden="true" style={{ fontSize: 24, lineHeight: 1 }}>🔬</span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                  <span style={{ fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 600, color: C.foam }}>{p.title}</span>
                  {p.ref && <span style={refChip(C)}>{p.ref}</span>}
                </span>
                <span style={{ display: "block", fontFamily: FONT_UI, fontSize: 13.5, color: C.mist, marginTop: 2 }}>{p.subtitle}</span>
                <span style={{ display: "block", fontFamily: FONT_UI, fontSize: 13, color: C.mist, marginTop: 6 }}>
                  {cov.attempted > 0 ? `${cov.pct}% covered · ${cov.attempted}/${cov.total}` : `Not started · ${cov.total} questions`}
                </span>
              </span>
              <span aria-hidden="true" style={{ color: C.accent, fontSize: 20 }}>›</span>
            </button>
            {rev.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <button onClick={() => startRevise(rev, `${p.title} to revise`)}
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: C.coral, fontFamily: FONT_UI, fontSize: 13.5, fontWeight: 700 }}>● Revise {rev.length} →</button>
              </div>
            )}
          </div>
        );
      };
      return (
        <div style={pad} className="rl-pad">
          <TopBar C={C} left="Practicals" />
          <button onClick={backToLibrary} style={linkBtn(C)}>‹ Library</button>
          <p style={kicker(C)}>PRACTICALS · REQUIRED PROCEDURES</p>
          <h1 style={{ ...h1(C), marginTop: 2 }}>Practicals</h1>
          <p style={{ ...sub(C), marginTop: 4 }}>Learn a required syllabus practical, then test yourself — the questions feed the same revise loop as the rest of the app.</p>
          {units.map((u) => (
            <div key={u} style={{ marginTop: 18 }}>
              <p style={kicker(C)}>UNIT {u}{unitTitle(u) ? ` · ${unitTitle(u)}` : ""}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 8 }}>
                {list.filter((p) => p.unit === u).map(practicalCard)}
              </div>
            </div>
          ))}
        </div>
      );
    }

    // ----- one practical: procedure card + practise -----
    const p = practicalById(practicalOpen);
    if (!p) { setPracticalOpen(null); return null; }
    const ids = practicalItemIds(p.id);
    const cov = coverage(ids, progressMap);
    const rev = reviseIds(ids, progressMap);
    return (
      <div style={pad} className="rl-pad">
        <TopBar C={C} left="Practicals" />
        <button onClick={() => setPracticalOpen(null)} style={linkBtn(C)}>‹ All practicals</button>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10, marginTop: 6 }}>
          <h1 style={{ ...h1(C), fontSize: 28 }}>{p.title}</h1>
          {p.ref && <span style={refChip(C)}>{p.ref}</span>}
        </div>
        {/* Optional animated diagram — rendered ISOLATED via a data-URI <img> so its
            self-contained <style> (which redefines the app's --bg/--ink token names)
            can't leak into the app's global theme. It carries its own light/dark and
            reduced-motion handling via prefers-color-scheme. */}
        {p.diagram && (
          <img alt={`${p.title} diagram`}
            style={{ width: "100%", height: "auto", borderRadius: 12, marginTop: 12, display: "block", border: `1px solid ${C.line}55` }}
            src={`data:image/svg+xml;utf8,${encodeURIComponent(p.diagram)}`} />
        )}
        {p.aim && <p style={{ ...sub(C), marginTop: 6 }}>{p.aim}</p>}

        {p.tests?.length ? (
          /* Reagent shape (food tests): one block per test, with colour swatches. */
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
            {p.tests.map((t, i) => (
              <div key={i} style={{ ...card(C) }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                  <h3 style={{ fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 600, color: C.foam, margin: 0 }}>{t.nutrient}</h3>
                  {t.reagent && <span style={refChip(C)}>{t.reagent}</span>}
                </div>
                {t.method && <p style={{ fontFamily: FONT_UI, fontSize: 14.5, color: C.mist, lineHeight: 1.55, margin: "8px 0 0" }}>{t.method}</p>}
                {t.scale?.length ? (
                  <div style={{ display: "flex", marginTop: 10, borderRadius: 6, overflow: "hidden", width: "fit-content", border: `1px solid ${C.line}` }}>
                    {t.scale.map((c, j) => <span key={j} style={{ width: 24, height: 16, background: c }} />)}
                  </div>
                ) : null}
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 10 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: FONT_UI, fontSize: 14, color: C.foam }}>
                    {t.posColor && swatch(t.posColor)}<span><b style={{ color: C.ok }}>Positive:</b> {t.positive}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: FONT_UI, fontSize: 14, color: C.mist }}>
                    {t.negColor && swatch(t.negColor)}<span><b>Negative:</b> {t.negative}</span>
                  </div>
                </div>
                {t.why && <p style={{ fontFamily: FONT_UI, fontSize: 13, color: C.mist, lineHeight: 1.5, margin: "10px 0 0", fontStyle: "italic" }}>Why it works: {t.why}</p>}
              </div>
            ))}
          </div>
        ) : (
          /* Procedure shape: apparatus, numbered method, result, colours, controls, improvements. */
          <>
            {p.apparatus?.length ? (
              <div style={{ ...card(C), marginTop: 16 }}>
                <p style={{ ...kicker(C), marginTop: 0 }}>APPARATUS</p>
                <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
                  {p.apparatus.map((a, i) => <li key={i} style={{ ...liBase, marginTop: i ? 4 : 0 }}>{a}</li>)}
                </ul>
              </div>
            ) : null}
            {p.steps?.length ? (
              <div style={{ ...card(C), marginTop: 14 }}>
                <p style={{ ...kicker(C), marginTop: 0 }}>METHOD</p>
                <ol style={{ margin: "8px 0 0", paddingLeft: 20 }}>
                  {p.steps.map((s, i) => <li key={i} style={{ ...liBase, marginTop: i ? 8 : 0 }}>{s}</li>)}
                </ol>
              </div>
            ) : null}
            {p.result ? (
              <div style={{ ...card(C), marginTop: 14, border: `1px solid ${C.glow}55` }}>
                <p style={{ ...kicker(C), color: C.ok, marginTop: 0 }}>WHAT IT SHOWS</p>
                <p style={{ fontFamily: FONT_UI, fontSize: 15, color: C.foam, lineHeight: 1.5, margin: "6px 0 0" }}>{p.result}</p>
              </div>
            ) : null}
            {p.swatches?.length ? (
              <div style={{ ...card(C), marginTop: 14 }}>
                <p style={{ ...kicker(C), marginTop: 0 }}>COLOURS</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  {p.swatches.map((s, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: FONT_UI, fontSize: 14, color: C.foam }}>
                      {swatch(s.color)}<span>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {p.controls?.length ? (
              <div style={{ ...card(C), marginTop: 14 }}>
                <p style={{ ...kicker(C), marginTop: 0 }}>FOR RELIABLE RESULTS</p>
                <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
                  {p.controls.map((s, i) => <li key={i} style={{ ...liBase, marginTop: i ? 6 : 0 }}>{s}</li>)}
                </ul>
              </div>
            ) : null}
            {p.improvements?.length ? (
              <div style={{ ...card(C), marginTop: 14 }}>
                <p style={{ ...kicker(C), marginTop: 0 }}>IMPROVEMENTS</p>
                <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
                  {p.improvements.map((s, i) => <li key={i} style={{ ...liBase, marginTop: i ? 6 : 0 }}>{s}</li>)}
                </ul>
              </div>
            ) : null}
          </>
        )}

        {p.safety?.length ? (
          <div style={{ ...card(C), marginTop: 14, border: `1px solid ${C.coral}55` }}>
            <p style={{ ...kicker(C), color: C.coral, marginTop: 0 }}>⚠ SAFETY</p>
            <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
              {p.safety.map((s, i) => <li key={i} style={{ fontFamily: FONT_UI, fontSize: 14, color: C.mist, lineHeight: 1.5, marginTop: i ? 6 : 0 }}>{s}</li>)}
            </ul>
          </div>
        ) : null}

        {p.technique?.length ? (
          <div style={{ ...card(C), marginTop: 14, border: `1px solid ${C.glow}55` }}>
            <p style={{ ...kicker(C), marginTop: 0 }}>EXAM TECHNIQUE</p>
            <ul style={{ margin: "8px 0 0", paddingLeft: 18 }}>
              {p.technique.map((s, i) => <li key={i} style={{ fontFamily: FONT_UI, fontSize: 14, color: C.mist, lineHeight: 1.5, marginTop: i ? 6 : 0 }}>{s}</li>)}
            </ul>
          </div>
        ) : null}

        <button style={{ ...primaryBtn(C), marginTop: 18 }} onClick={() => startPractical(p.id)}>Practise these {ids.length} →</button>
        <div style={{ marginTop: 10, textAlign: "center", fontFamily: FONT_UI, fontSize: 13, color: C.mist }}>
          {cov.attempted > 0 ? `${cov.pct}% covered · ${cov.attempted}/${cov.total}` : `Not started · ${ids.length} questions`}
        </div>
        {rev.length > 0 && (
          <button style={{ ...primaryBtn(C), background: C.coral, color: "#fff", marginTop: 10 }} onClick={() => startRevise(rev, `${p.title} to revise`)}>Revise these {rev.length} →</button>
        )}
      </div>
    );
  }

  // ---------- Ocean Discoveries collection ----------
  function renderCollection() {
    const coll = content.collection || {};
    return (
      <div style={pad} className="rl-pad">
        <TopBar C={C} left="Discoveries" />
        <button onClick={backToLibrary} style={linkBtn(C)}>‹ Library</button>
        <h1 style={{ ...h1(C), marginTop: 8 }}>{coll.title || "Ocean discoveries"}</h1>
        <p style={{ ...sub(C), marginTop: 4 }}>{owned.length} of {creatures.length} found.{coll.blurb ? ` ${coll.blurb}` : ""}</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 18 }}>
          {creatures.map((c) => {
            const has = owned.includes(c.id);
            return (
              <div key={c.id} style={{
                borderRadius: 16, padding: 14, minHeight: 190,
                border: `1px solid ${has ? `${C.line}55` : `${C.line}33`}`,
                background: has ? (C.panel || "rgba(255,255,255,.03)") : "transparent",
                display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
              }}>
                <div style={{ opacity: has ? 1 : 0.13, filter: has ? "none" : "grayscale(1)" }}>
                  {CreatureArt ? <CreatureArt id={c.id} size={92} /> : null}
                </div>
                <p style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 600, margin: "6px 0 3px", color: has ? C.foam : C.line }}>
                  {has ? c.name : "Undiscovered"}
                </p>
                <p style={{ fontFamily: FONT_UI, fontSize: 11.5, color: has ? C.glow : C.line, margin: 0 }}>{c.rarity}</p>
                {has && <p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.mist, lineHeight: 1.45, marginTop: 7 }}>{c.fact}</p>}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ---------- Settings (theme, updates, exam date, back up / restore) ----------
  async function doBackup() {
    setBackupMsg("");
    const dump = await (store() ? store().exportAll() : Promise.resolve(null));
    if (!dump) { setBackupMsg("Nothing to back up yet."); return; }
    const json = JSON.stringify({ app: "marine-reader", ...dump }, null, 2);
    const filename = `marine-reader-${todayISO()}.json`;
    if (!IS_NATIVE) {
      try {
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        setBackupMsg(`Saved ${filename} to your downloads.`);
        return;
      } catch (e) { /* fall through to clipboard */ }
    }
    if (navigator.clipboard?.writeText) {
      try { await navigator.clipboard.writeText(json); setBackupMsg("Copied your progress to the clipboard. Paste it somewhere safe."); return; }
      catch (e) { /* fall through */ }
    }
    setBackupMsg("Couldn't save automatically — try again from a browser.");
  }

  function readRestoreFile(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setRestoreText(String(reader.result || "")); setRestoreErr(""); setRestoreMsg(""); };
    reader.readAsText(file);
  }

  async function doRestore() {
    setRestoreMsg(""); setRestoreErr("");
    let dump;
    try { dump = JSON.parse(restoreText); } catch (e) { setRestoreErr("That doesn't look like valid backup JSON. Nothing was changed."); return; }
    if (!dump || typeof dump !== "object" || !Array.isArray(dump.items)) {
      setRestoreErr("That doesn't look like a Reader backup. Nothing was changed."); return;
    }
    if (store()) await store().importAll(dump, { merge: false }); // replace with the backup
    await loadAll();
    setRestoreText(""); setRestoreMsg("Progress restored.");
  }

  async function doReset() {
    if (store()) await store().clearAll();
    await loadAll();
    setBookmarks({ byUnit: {}, lastUnitId: null }); setConfirmReset(false); setView("library");
  }

  // ---------- Unlock screen (the paywall) ----------
  function renderUnlock() {
    const planCard = (title, price, line, url, key) => (
      <div key={key} style={{ ...card(C), display: "flex", flexDirection: "column", gap: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 600, color: C.foam }}>{title}</span>
          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 700, color: C.accent }}>{price}</span>
        </div>
        <div style={{ fontFamily: FONT_UI, fontSize: 13.5, color: C.mist, lineHeight: 1.5 }}>{line}</div>
        <a href={CHECKOUT_READY ? url : undefined} target="_blank" rel="noopener noreferrer"
          onClick={(e) => { if (!CHECKOUT_READY) { e.preventDefault(); setLicenceMsg("Checkout opens once the store is live — if you already have a key, enter it below."); } }}
          style={{ ...primaryBtn(C), textAlign: "center", textDecoration: "none", marginTop: 4, opacity: CHECKOUT_READY ? 1 : 0.6 }}>
          {CHECKOUT_READY ? `Buy ${title} — ${price}` : "Checkout coming soon"}
        </a>
      </div>
    );
    return (
      <div style={pad} className="rl-pad">
        <TopBar C={C} left="Unlock" />
        <button onClick={() => setView("library")} style={linkBtn(C)}>‹ Back</button>
        <p style={kicker(C)}>UNLOCK ALL SIX UNITS</p>
        <h1 style={{ ...h1(C), marginTop: 2 }}>One payment, lifetime access</h1>
        <p style={{ ...sub(C), marginTop: 4 }}>Unit 1 is free forever. Unlock Units 2–6 and every premium feature with a one-off purchase — no subscription, keep it for good.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
          {planCard("Single", "£20", "All six units + premium, for one learner. Lifetime access.", LICENCE_CONFIG.checkoutUrlSingle, "single")}
          {planCard("Family", "£40", "All six units + premium, with up to 3 learner profiles — each with its own progress. Lifetime access.", LICENCE_CONFIG.checkoutUrlFamily, "family")}
        </div>
        <div style={{ ...card(C), marginTop: 16 }}>
          <div style={{ fontFamily: FONT_UI, fontWeight: 700, color: C.foam, marginBottom: 4 }}>I already bought — enter my licence key</div>
          <div style={{ fontFamily: FONT_UI, fontSize: 13, color: C.mist, marginBottom: 10, lineHeight: 1.5 }}>Lemon Squeezy emailed your key after purchase. It unlocks this device.</div>
          <input value={keyInput} onChange={(e) => { setKeyInput(e.target.value); setLicenceMsg(""); }}
            placeholder="XXXXXXXX-XXXX-XXXX-XXXX-XXXXXXXXXXXX" aria-label="Licence key"
            style={{ width: "100%", boxSizing: "border-box", fontFamily: "monospace", fontSize: 13, padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.line}`, background: C.shelf, color: C.foam }} />
          <button onClick={activateKey} disabled={licenceBusy || !keyInput.trim()}
            style={{ ...primaryBtn(C), width: "100%", marginTop: 10, opacity: (licenceBusy || !keyInput.trim()) ? 0.5 : 1 }}>
            {licenceBusy ? "Checking…" : "Unlock this device"}
          </button>
          {licenceMsg && <p style={{ fontFamily: FONT_UI, fontSize: 12.5, color: C.accent, marginTop: 10, lineHeight: 1.5 }}>{licenceMsg}</p>}
        </div>
        <p style={{ fontFamily: FONT_UI, fontSize: 12, color: C.mist, marginTop: 14, lineHeight: 1.5 }}>Lifetime access · one payment · no subscription. Prices include tax, handled by Lemon Squeezy.</p>
      </div>
    );
  }

  // ---------- Profile picker ("Who's studying?") ----------
  function renderProfilePicker() {
    return (
      <div style={pad} className="rl-pad">
        <TopBar C={C} left="Profiles" />
        <p style={kicker(C)}>WHO'S STUDYING?</p>
        <h1 style={{ ...h1(C), marginTop: 2 }}>Choose your profile</h1>
        <p style={{ ...sub(C), marginTop: 4 }}>Each learner keeps their own progress, exam date and discoveries.</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
          {profiles.map((p) => (
            <button key={p.id} onClick={() => switchProfile(p.id)}
              style={{ ...card(C), display: "flex", alignItems: "center", gap: 14, cursor: "pointer", textAlign: "left", border: `1px solid ${p.id === activeProfileId ? C.glow : `${C.line}55`}` }}>
              <span aria-hidden="true" style={{ width: 30, height: 30, borderRadius: "50%", background: p.color || C.glow, flexShrink: 0 }} />
              <span style={{ flex: 1, fontFamily: FONT_DISPLAY, fontSize: 18, fontWeight: 600, color: C.foam }}>{p.name}</span>
              {p.id === activeProfileId && <span style={{ fontFamily: FONT_UI, fontSize: 12.5, color: C.accent }}>active</span>}
            </button>
          ))}
        </div>
        <button onClick={() => setView("settings")} style={{ ...linkBtn(C), marginTop: 16, display: "block", padding: 0 }}>Manage profiles ›</button>
      </div>
    );
  }

  function renderSettings() {
    return (
      <div style={pad} className="rl-pad">
        <TopBar C={C} left="Settings" />
        <button onClick={() => setView("library")} style={linkBtn(C)}>‹ Back</button>
        <h1 style={{ ...h1(C), marginTop: 8 }}>Settings</h1>

        {/* Theme */}
        <div style={{ ...card(C), marginTop: 14 }}>
          <div style={{ fontFamily: FONT_UI, fontWeight: 700, color: C.foam, marginBottom: 4 }}>Theme</div>
          <div style={{ fontFamily: FONT_UI, color: C.mist, fontSize: 13, marginBottom: 10 }}>Dark oceanic, or a light variant.</div>
          <div style={{ display: "flex", gap: 8 }}>
            {[["dark", "Dark"], ["light", "Light"]].map(([v, l]) => (
              <button key={v} type="button" aria-pressed={theme === v} onClick={() => onSetTheme && onSetTheme(v)} style={{
                flex: 1, padding: "12px 10px", borderRadius: 12, cursor: "pointer", fontFamily: FONT_UI, fontSize: 14, fontWeight: 700,
                border: `1px solid ${theme === v ? C.glow : C.line}`,
                background: theme === v ? "rgba(79,216,196,.14)" : "transparent",
                color: theme === v ? C.accent : C.foam,
              }}>{l}</button>
            ))}
          </div>
        </div>

        {/* Learner profiles */}
        <div style={{ ...card(C), marginTop: 14 }}>
          <div style={{ fontFamily: FONT_UI, fontWeight: 700, color: C.foam, marginBottom: 4 }}>Learner profiles</div>
          <div style={{ fontFamily: FONT_UI, color: C.mist, fontSize: 13, marginBottom: 10, lineHeight: 1.5 }}>Each profile keeps its own progress, exam date and Ocean discoveries. Saved on this device.</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {profiles.map((p) => (
              <div key={p.id} style={{ border: `1px solid ${p.id === activeProfileId ? C.glow : C.line}55`, borderRadius: 12, padding: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span aria-hidden="true" style={{ width: 22, height: 22, borderRadius: "50%", background: p.color || C.glow, flexShrink: 0 }} />
                  <input value={p.name} aria-label="Profile name"
                    onChange={(e) => { const v = e.target.value; setProfiles((ps) => ps.map((x) => x.id === p.id ? { ...x, name: v } : x)); }}
                    onBlur={() => renameProfile(p.id, { name: p.name })}
                    style={{ flex: 1, minWidth: 0, fontFamily: FONT_UI, fontSize: 15, fontWeight: 700, padding: "8px 10px", borderRadius: 8, border: `1px solid ${C.line}`, background: C.shelf, color: C.foam }} />
                  {p.id === activeProfileId
                    ? <span style={{ fontFamily: FONT_UI, fontSize: 12, color: C.accent, whiteSpace: "nowrap" }}>active</span>
                    : <button onClick={() => switchProfile(p.id)} style={{ ...linkBtn(C), padding: 0, whiteSpace: "nowrap" }}>Switch</button>}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8, flexWrap: "wrap" }}>
                  {PROFILE_COLORS.map((c) => (
                    <button key={c} aria-label={`Colour ${c}`} onClick={() => renameProfile(p.id, { color: c })}
                      style={{ width: 20, height: 20, borderRadius: "50%", background: c, cursor: "pointer", border: p.color === c ? `2px solid ${C.foam}` : `1px solid ${C.line}` }} />
                  ))}
                  {profiles.length > 1 && (
                    confirmDeleteProfile === p.id ? (
                      <span style={{ marginLeft: "auto", display: "flex", gap: 8, alignItems: "center" }}>
                        <span style={{ fontFamily: FONT_UI, fontSize: 12, color: C.mist }}>Erase {p.name}'s progress?</span>
                        <button onClick={() => deleteProfileLocal(p.id)} style={{ ...linkBtn(C), color: C.coral, padding: 0 }}>Delete</button>
                        <button onClick={() => setConfirmDeleteProfile(null)} style={{ ...linkBtn(C), padding: 0 }}>Cancel</button>
                      </span>
                    ) : (
                      <button onClick={() => setConfirmDeleteProfile(p.id)} style={{ ...linkBtn(C), color: C.coral, padding: 0, marginLeft: "auto" }}>Delete</button>
                    )
                  )}
                </div>
              </div>
            ))}
          </div>
          {profiles.length < maxProfiles ? (
            <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
              <input value={newProfileName} onChange={(e) => setNewProfileName(e.target.value)} placeholder="New learner's name"
                aria-label="New learner's name"
                style={{ flex: 1, minWidth: 0, fontFamily: FONT_UI, fontSize: 15, padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.line}`, background: C.shelf, color: C.foam }} />
              <button onClick={addProfile} style={{ ...ghostBtn(C), border: `1px solid ${C.glow}`, color: C.accent, whiteSpace: "nowrap" }}>Add profile</button>
            </div>
          ) : (
            <p style={{ fontFamily: FONT_UI, fontSize: 12.5, color: C.mist, marginTop: 12, lineHeight: 1.5 }}>
              {maxProfiles <= 1 ? "The Family plan lets you add up to 3 learners, each with their own progress." : "You've added the maximum number of learners for your plan."}
            </p>
          )}
        </div>

        {/* Licence */}
        <div style={{ ...card(C), marginTop: 14 }}>
          <div style={{ fontFamily: FONT_UI, fontWeight: 700, color: C.foam, marginBottom: 4 }}>Licence</div>
          {isEntitled(entitlement) ? (
            <>
              <div style={{ fontFamily: FONT_UI, fontSize: 13, color: C.mist, marginBottom: 10, lineHeight: 1.5 }}>
                ✓ Unlocked · {entitlement.tier === "family" ? "Family" : "Single"} plan — all six units, lifetime.
                {graceExpired(entitlement) ? " Reconnect to the internet soon to keep your unlock verified." : ""}
              </div>
              <button onClick={removeDevice} disabled={licenceBusy} style={{ ...ghostBtn(C), width: "100%", border: `1px solid ${C.coral}`, color: C.coral }}>
                {licenceBusy ? "Removing…" : "Remove this device"}
              </button>
            </>
          ) : (
            <>
              <div style={{ fontFamily: FONT_UI, fontSize: 13, color: C.mist, marginBottom: 10, lineHeight: 1.5 }}>Free — Unit 1 only. Unlock all six units with a one-off purchase (no subscription).</div>
              <button onClick={() => setView("unlock")} style={{ ...primaryBtn(C), width: "100%" }}>Unlock all units — £20</button>
              <div style={{ fontFamily: FONT_UI, fontSize: 13, color: C.mist, margin: "12px 0 8px", lineHeight: 1.5 }}>Already bought? Restore on this device with your licence key:</div>
              <input value={keyInput} onChange={(e) => { setKeyInput(e.target.value); setLicenceMsg(""); }}
                placeholder="Licence key" aria-label="Licence key"
                style={{ width: "100%", boxSizing: "border-box", fontFamily: "monospace", fontSize: 13, padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.line}`, background: C.shelf, color: C.foam }} />
              <button onClick={activateKey} disabled={licenceBusy || !keyInput.trim()} style={{ ...ghostBtn(C), width: "100%", marginTop: 8, opacity: (licenceBusy || !keyInput.trim()) ? 0.5 : 1 }}>
                {licenceBusy ? "Checking…" : "Restore purchase"}
              </button>
            </>
          )}
          {licenceMsg && <p style={{ fontFamily: FONT_UI, fontSize: 12.5, color: C.accent, marginTop: 10, lineHeight: 1.5 }}>{licenceMsg}</p>}
        </div>

        {/* Exam date */}
        <div style={{ ...card(C), marginTop: 14 }}>
          <div style={{ fontFamily: FONT_UI, fontWeight: 700, color: C.foam, marginBottom: 4 }}>Exam date</div>
          <div style={{ fontFamily: FONT_UI, color: C.mist, fontSize: 13, marginBottom: 10 }}>Optional — drives the readiness countdown.</div>
          <input type="date" value={settings.examDate ? settings.examDate.slice(0, 10) : ""}
            onChange={async (e) => { const v = e.target.value || null; setSettings((s) => ({ ...s, examDate: v })); if (store()) await store().putSettings({ examDate: v }); }}
            style={{ fontFamily: FONT_UI, fontSize: 15, padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.line}`, background: C.shelf, color: C.foam }} />
        </div>

        {/* About + updates */}
        <div style={{ ...card(C), marginTop: 14 }}>
          <div style={{ fontFamily: FONT_UI, fontWeight: 700, color: C.foam, marginBottom: 4 }}>About</div>
          <div style={{ fontFamily: FONT_UI, color: C.mist, fontSize: 13, marginBottom: 8, lineHeight: 1.5 }}>Marine Science IGCSE Revision App 2026/27. A no-login revision app; your progress is saved on this device.</div>
          {UpdatesControl ? <UpdatesControl /> : null}
        </div>

        {/* Back up */}
        <div style={{ ...card(C), marginTop: 14 }}>
          <div style={{ fontFamily: FONT_UI, fontWeight: 700, color: C.foam, marginBottom: 4 }}>Back up my progress</div>
          <div style={{ fontFamily: FONT_UI, color: C.mist, fontSize: 13, marginBottom: 10, lineHeight: 1.5 }}>Save a copy of your reading history and Ocean discoveries. Do this before resetting or moving to a new phone.</div>
          <button onClick={doBackup} style={{ ...ghostBtn(C), width: "100%", border: `1px solid ${C.glow}`, background: "rgba(79,216,196,.1)" }}>
            {IS_NATIVE ? "Copy my progress" : "Back up my progress"}
          </button>
          {backupMsg && <p style={{ fontFamily: FONT_UI, fontSize: 12.5, color: C.accent, marginTop: 10, lineHeight: 1.5 }}>{backupMsg}</p>}
        </div>

        {/* Restore */}
        <div style={{ ...card(C), marginTop: 14 }}>
          <div style={{ fontFamily: FONT_UI, fontWeight: 700, color: C.foam, marginBottom: 4 }}>Restore from a backup</div>
          <div style={{ fontFamily: FONT_UI, color: C.mist, fontSize: 13, marginBottom: 10, lineHeight: 1.5 }}>Choose a saved file, or paste a backup, then restore. This replaces your current progress.</div>
          <input type="file" accept="application/json,.json" onChange={readRestoreFile}
            style={{ fontFamily: FONT_UI, fontSize: 13, color: C.mist, marginBottom: 10, display: "block", maxWidth: "100%", boxSizing: "border-box" }} />
          <textarea value={restoreText} onChange={(e) => { setRestoreText(e.target.value); setRestoreErr(""); }}
            placeholder="…or paste your backup JSON here" rows={4}
            style={{ width: "100%", fontFamily: "monospace", fontSize: 11, padding: 8, borderRadius: 8, boxSizing: "border-box",
              border: `1px solid ${restoreErr ? C.no : C.line}`, background: C.shelf, color: C.foam, resize: "vertical" }} />
          <button onClick={doRestore} disabled={!restoreText.trim()} style={{
            ...ghostBtn(C), width: "100%", marginTop: 10,
            cursor: restoreText.trim() ? "pointer" : "default", opacity: restoreText.trim() ? 1 : 0.5,
          }}>Restore this backup</button>
          {restoreErr && <p style={{ fontFamily: FONT_UI, fontSize: 12.5, color: C.no, marginTop: 10, lineHeight: 1.5 }}>{restoreErr}</p>}
          {restoreMsg && <p style={{ fontFamily: FONT_UI, fontSize: 12.5, color: C.accent, marginTop: 10, lineHeight: 1.5 }}>{restoreMsg}</p>}
        </div>

        {/* Reset */}
        <div style={{ ...card(C), marginTop: 14, border: `1px solid ${C.coral}66` }}>
          <div style={{ fontFamily: FONT_UI, fontWeight: 700, color: C.foam, marginBottom: 4 }}>Start from scratch</div>
          <div style={{ fontFamily: FONT_UI, color: C.mist, fontSize: 13, marginBottom: 10, lineHeight: 1.5 }}>Erase all your reading progress and Ocean discoveries on this device. Back up first if you might want it again.</div>
          {!confirmReset ? (
            <button onClick={() => setConfirmReset(true)} style={{ ...ghostBtn(C), width: "100%", border: `1px solid ${C.coral}`, color: C.coral }}>Reset everything</button>
          ) : (
            <div>
              <p style={{ fontFamily: FONT_UI, fontSize: 14, color: C.foam, lineHeight: 1.5, margin: "0 0 12px" }}>This can't be undone.</p>
              <button onClick={doReset} style={{ ...primaryBtn(C), background: C.coral, color: "#fff", marginBottom: 8 }}>Erase everything</button>
              <button onClick={() => setConfirmReset(false)} style={{ ...ghostBtn(C), width: "100%" }}>Cancel</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------- overlays ----------
  function revealOverlay() {
    if (!reveal) return null;
    return (
      <div style={overlay(C)}>
        <p style={{ color: C.accent, fontSize: 13, letterSpacing: ".05em", margin: 0 }}>{reveal.rarity} discovery</p>
        {CreatureArt ? <CreatureArt id={reveal.id} size={160} /> : null}
        <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: C.foam, margin: "8px 0 10px" }}>{reveal.name}</h2>
        <p style={{ fontFamily: FONT_UI, color: C.mist, maxWidth: 320, textAlign: "center", lineHeight: 1.6 }}>{reveal.fact}</p>
        <button style={primaryBtn(C)} onClick={() => setReveal(null)}>Add to collection</button>
      </div>
    );
  }
}

/* ------------------------------ presentational bits ------------------------ */
const pad = { maxWidth: 480, margin: "0 auto", padding: "0 18px 40px" };
function Shell({ C, children, sidebar = null, topBar = null }) {
  const bg = { minHeight: "100dvh", background: `linear-gradient(${C.bg0} 0%, ${C.bg1} 60%)`, color: C.foam, fontFamily: FONT_UI };
  // Phone / APK: no sidebar → exactly today's single <main> (byte-for-byte).
  if (!sidebar) return <main style={bg}>{children}</main>;
  // Desktop: sidebar + framed content column (all layout via responsive.css).
  return (
    <main className="rl-app" style={bg}>
      {sidebar}
      <div className="rl-frame">
        {topBar}
        <div className="rl-content">{children}</div>
      </div>
    </main>
  );
}
function TopBar({ C, left }) {
  return <div className="rl-inline-topbar" style={{ display: "flex", justifyContent: "space-between", padding: "16px 2px 6px", fontFamily: FONT_UI, fontSize: 14, color: C.mist }}><span>{left}</span><span>{" "}</span></div>;
}
const kicker = (C) => ({ fontFamily: FONT_UI, fontSize: 11, fontWeight: 700, letterSpacing: ".14em", color: C.accent, margin: "10px 0 0", textTransform: "uppercase" });
const h1 = (C) => ({ fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 600, color: C.foam, marginTop: 2, marginBottom: 0, marginLeft: 0, marginRight: 0, lineHeight: 1.08 });
const sub = (C) => ({ fontFamily: FONT_UI, fontSize: 15, color: C.mist, margin: 0, lineHeight: 1.5 });
const card = (C) => ({ background: C.panel || "rgba(255,255,255,.03)", border: `1px solid ${C.line}55`, borderRadius: 18, padding: 18 });
const primaryBtn = (C) => ({ width: "100%", padding: "16px", borderRadius: 14, border: "none", background: C.glow, color: C.abyss, fontFamily: FONT_UI, fontSize: 16, fontWeight: 700, cursor: "pointer" });
const ghostBtn = (C) => ({ padding: "14px 16px", borderRadius: 14, border: `1px solid ${C.line}`, background: "transparent", color: C.foam, fontFamily: FONT_UI, fontSize: 15, fontWeight: 700, cursor: "pointer" });
const entryBtn = (C) => ({ flex: 1, padding: "16px 8px", borderRadius: 14, border: `1px solid ${C.line}`, background: C.shelf || "transparent", color: C.foam, fontFamily: FONT_UI, fontSize: 14.5, fontWeight: 700, cursor: "pointer" });
const linkBtn = (C) => ({ background: "none", border: "none", color: C.accent, fontFamily: FONT_UI, fontSize: 14, cursor: "pointer", padding: 4 });
const tierPill = (C, tier) => ({ display: "inline-block", padding: "6px 12px", borderRadius: 999, background: tier === 3 ? "rgba(255,122,92,.16)" : "rgba(15,120,110,.9)", color: tier === 3 ? C.coral : "#eafffb", fontFamily: FONT_UI, fontSize: 12, fontWeight: 700, letterSpacing: ".05em" });
const refChip = (C) => ({ flex: "0 0 auto", padding: "3px 9px", borderRadius: 999, background: "rgba(79,216,196,.12)", color: C.accent, fontFamily: FONT_UI, fontSize: 11, fontWeight: 700, letterSpacing: ".03em", whiteSpace: "nowrap" });
const overlay = (C) => ({ position: "fixed", inset: 0, background: "rgba(4,20,31,.94)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: 30, zIndex: 50 });
function Stat({ C, n, label }) {
  return <div style={{ textAlign: "center" }}><div style={{ fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 600, color: C.foam }}>{n}</div><div style={{ fontFamily: FONT_UI, fontSize: 11, letterSpacing: ".08em", color: C.mist }}>{label}</div></div>;
}
function Donut({ C, pct, size = 72, color }) {
  const stroke = color || C.glow;
  const sw = size >= 64 ? 8 : 6;
  const cx = size / 2, r = cx - sw / 2 - 2;
  const circ = 2 * Math.PI * r, off = circ * (1 - Math.max(0, Math.min(100, pct)) / 100);
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flex: "0 0 auto" }}>
      <circle cx={cx} cy={cx} r={r} fill="none" stroke="rgba(255,255,255,.14)" strokeWidth={sw} />
      <circle cx={cx} cy={cx} r={r} fill="none" stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off} transform={`rotate(-90 ${cx} ${cx})`} />
      <text x={cx} y={cx + size * 0.07} textAnchor="middle" fontFamily={FONT_UI} fontSize={size >= 64 ? 15 : 12} fontWeight="700" fill={C.foam}>{pct}%</text>
    </svg>
  );
}

export default ReaderApp;
