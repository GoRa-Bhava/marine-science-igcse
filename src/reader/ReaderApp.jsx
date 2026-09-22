import React, { useEffect, useMemo, useRef, useState } from "react";
import { createProgressStore } from "./progressStore.js";
import { buildContentIndex, secOf } from "./contentIndex.js";
import { boxAfter, pickNext, masteryState, readiness, unitReadiness } from "./scoring.js";

/* The Units 1–6 Reader — self-paced, book-style flow with durable device-local
   progress (IndexedDB) and a wrong-weighted smart-practice mode. Reuses the
   existing item components via `renderItemBody` and shared grading, so questions
   look and grade exactly as in the classic flow. */

const FONT_UI = "Karla, system-ui, sans-serif";
const FONT_DISPLAY = "Fraunces, Georgia, serif";
const TIER = { 1: "RECALL", 2: "APPLICATION", 3: "EXAM" };

function daysToExam(iso) {
  if (!iso) return null;
  const d = Math.ceil((new Date(iso).getTime() - Date.now()) / 86400000);
  return Number.isFinite(d) ? d : null;
}

function answerText(item) {
  const t = item.type;
  if (t === "choice" || t === "best") return item.options?.[item.a] ?? "";
  if (t === "multi") return (item.a || []).map((i) => item.options[i]).join(" · ");
  if (t === "gap") return (item.answers || []).join(" · ");
  if (t === "match") return (item.pairs || []).map((p) => `${p[0]} → ${p[1]}`).join("; ");
  if (t === "chain") return (item.chunks || []).join(" → ");
  if (t === "exam") return (item.build || item.modelAnswer || []).join("  ");
  return "";
}

export function ReaderApp({ content, C, theme, renderItemBody, grade, canSubmit, initAnswer, CreatureArt, creatures, onUseClassic }) {
  const index = useMemo(() => buildContentIndex(content.items, content.figures || {}), [content]);
  const itemById = useMemo(() => Object.fromEntries(content.items.map((i) => [i.id, i])), [content]);

  const storeRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [progressMap, setProgressMap] = useState({});
  const [sectionStates, setSectionStates] = useState({});
  const [settings, setSettings] = useState({});
  const [owned, setOwned] = useState([]);
  const [bookmark, setBookmark] = useState(null);

  const [view, setView] = useState("library");
  const [mode, setMode] = useState("read");       // read | smart | retry
  const [queue, setQueue] = useState([]);          // itemIds for read/retry
  const [pos, setPos] = useState(0);
  const [sectionId, setSectionId] = useState(null);
  const [currentId, setCurrentId] = useState(null);
  const [answer, setAnswer] = useState(null);
  const [locked, setLocked] = useState(false);
  const [wasRight, setWasRight] = useState(false);
  const [recent, setRecent] = useState([]);
  const [session, setSession] = useState({ answered: [], wrong: [], count: 0, correct: 0 });
  const [checkpointSec, setCheckpointSec] = useState(null);
  const [browse, setBrowse] = useState({ ids: [], pos: 0, title: "" });
  const [reveal, setReveal] = useState(null);
  const [celebrate, setCelebrate] = useState(null);

  // ---- load persisted state on mount ----
  useEffect(() => {
    let live = true;
    (async () => {
      const store = await createProgressStore();
      storeRef.current = store;
      const [all, bm, st, sec] = await Promise.all([
        store.getAllItemProgress(), store.getBookmark(), store.getSettings(), store.getAllSectionState(),
      ]);
      if (!live) return;
      setProgressMap(Object.fromEntries(all.map((r) => [r.itemId || r.id, r])));
      setSectionStates(Object.fromEntries(sec.map((r) => [r.sectionId || r.id, r])));
      setSettings(st || {});
      setOwned((st && st.creatures) || []);
      setBookmark(bm);
      setReady(true);
    })();
    return () => { live = false; };
  }, []);

  const store = () => storeRef.current;
  const item = currentId ? itemById[currentId] : null;

  // Bookmark tracks the currently shown item in linear Read mode, so an abrupt
  // exit resumes exactly there. Smart/retry/browse never move the reading spot.
  useEffect(() => {
    if (view !== "reader" || mode !== "read" || !currentId) return;
    const loc = index.itemLoc[currentId];
    const bm = { unitId: loc?.unitId, sectionId: loc?.sectionId, itemId: currentId, indexInSection: loc?.indexInSection, mode: "read" };
    setBookmark(bm);
    if (storeRef.current) storeRef.current.putBookmark(bm);
  }, [currentId, view, mode]);

  function loadItem(id) {
    setCurrentId(id);
    setAnswer(initAnswer(itemById[id]));
    setLocked(false);
    setWasRight(false);
  }

  // ---- start / navigate ----
  function startRead(secId, startIndex = 0) {
    const q = index.sections[secId]?.orderedItemIds || [];
    setMode("read"); setSectionId(secId); setQueue(q); setPos(startIndex);
    setSession({ answered: [], wrong: [], count: 0, correct: 0 });
    setView("reader"); loadItem(q[startIndex]);
  }
  function continueSection(secId) { // keep the running session (checkpoint → next section)
    const q = index.sections[secId]?.orderedItemIds || [];
    setMode("read"); setSectionId(secId); setQueue(q); setPos(0);
    setView("reader"); loadItem(q[0]);
  }
  function startSmart() {
    setMode("smart"); setSectionId(null); setQueue([]); setPos(0); setRecent([]);
    setSession({ answered: [], wrong: [], count: 0, correct: 0 });
    const first = pickNext(index.flatOrder, progressMap, []);
    setRecent(first ? [first] : []);
    setView("reader"); loadItem(first);
  }
  function startRetry(wrongIds) {
    setMode("retry"); setSectionId(null); setQueue(wrongIds); setPos(0);
    setSession({ answered: [], wrong: [], count: 0, correct: 0 });
    setView("reader"); loadItem(wrongIds[0]);
  }
  function resume() {
    if (bookmark && index.sections[bookmark.sectionId]) startRead(bookmark.sectionId, Math.max(0, bookmark.indexInSection || 0));
    else startRead(index.sectionIds[0], 0);
  }
  function startBrowse(ids, title) { setBrowse({ ids, pos: 0, title }); setView("browse"); }

  // ---- record an answer (persist box ladder, bookmark, section, rewards) ----
  async function record(it, right) {
    const s = store();
    const prev = progressMap[it.id];
    const np = boxAfter(prev, right, it.id);
    setProgressMap((m) => ({ ...m, [it.id]: np }));
    if (s) await s.putItemProgress(np);

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

    // weak → mastered celebration
    if (sec) {
      const ids = index.sections[sec].orderedItemIds;
      const before = masteryState(ids, progressMap);
      const after = masteryState(ids, nextMap);
      if (after === "mastered" && before !== "mastered") setCelebrate(sec);
    }
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
      const nextRecent = [...recent, currentId];
      const pick = pickNext(index.flatOrder, progressMap, nextRecent);
      setRecent(nextRecent.slice(-8));
      loadItem(pick);
      return;
    }
    const np = pos + 1;
    if (np >= queue.length) {
      if (mode === "read") { markSectionComplete(sectionId); setCheckpointSec(sectionId); setView("checkpoint"); }
      else setView("summary"); // retry finished
      return;
    }
    setPos(np); loadItem(queue[np]);
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
  if (view === "reader") return <Shell C={C}>{renderReader()}{revealOverlay()}{celebrateOverlay()}</Shell>;
  if (view === "checkpoint") return <Shell C={C}>{renderCheckpoint()}{celebrateOverlay()}</Shell>;
  if (view === "summary") return <Shell C={C}>{renderSummary()}</Shell>;
  if (view === "browse") return <Shell C={C}>{renderBrowse()}</Shell>;
  if (view === "settings") return <Shell C={C}>{renderSettings()}</Shell>;
  return <Shell C={C}>{renderLibrary()}{revealOverlay()}</Shell>;

  // ---------- Library ----------
  function renderLibrary() {
    const started = index.units.map((u) => ({ u, r: unitReadiness(u.sectionIds.map((x) => index.sections[x].orderedItemIds), progressMap) }));
    const attempted = started.filter((x) => index.units.find((y) => y.unitId === x.u.unitId).sectionIds.some((s) => (index.sections[s].orderedItemIds).some((id) => progressMap[id])));
    const weakest = (attempted.length ? attempted : started).slice().sort((a, b) => a.r - b.r)[0];
    const dte = daysToExam(settings.examDate);
    const bmSec = bookmark && index.sections[bookmark.sectionId];
    return (
      <div style={pad}>
        <TopBar C={C} left="Library" />
        <p style={kicker(C)}>MARINE SCIENCE IGCSE 0697</p>
        <h1 style={h1(C)}>Your revision</h1>
        <p style={{ ...sub(C), marginTop: 4 }}>Pick up where you left off, or choose anywhere.</p>

        {bmSec && (
          <div style={{ ...card(C), border: `1.5px solid ${C.glow}`, marginTop: 16 }}>
            <p style={kicker(C)}>RESUME</p>
            <div style={{ fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 600, color: C.foam, margin: "4px 0 8px" }}>
              Unit {bmSec.unitId} · {index.units.find((u) => u.unitId === bmSec.unitId)?.title}
            </div>
            <div style={{ fontFamily: FONT_UI, color: C.mist, fontSize: 15, marginBottom: 14 }}>
              §{bmSec.sectionId} {bmSec.title} — question {(bookmark.indexInSection || 0) + 1} of {bmSec.total}
            </div>
            <button style={primaryBtn(C)} onClick={resume}>Continue reading ›</button>
          </div>
        )}

        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <button style={entryBtn(C)} onClick={resume}>📖 Read</button>
          <button style={entryBtn(C)} onClick={startSmart}>🎲 Smart practice</button>
          <button style={entryBtn(C)} onClick={() => startBrowse(bookmark ? index.sections[bookmark.sectionId].orderedItemIds : index.sections[index.sectionIds[0]].orderedItemIds, bookmark ? `§${bookmark.sectionId}` : `§${index.sectionIds[0]}`)}>👁 Browse</button>
        </div>

        {weakest && (
          <div style={{ ...card(C), display: "flex", gap: 16, alignItems: "center", marginTop: 14 }}>
            <Donut C={C} pct={Math.round(weakest.r * 100)} />
            <div style={{ fontFamily: FONT_UI }}>
              <div style={{ color: C.foam, fontWeight: 700, fontSize: 16 }}>{index.units.find((u) => u.unitId === weakest.u.unitId)?.title} — {Math.round(weakest.r * 100)}% ready</div>
              <div style={{ color: C.mist, fontSize: 13, marginTop: 2 }}>{dte != null ? `${dte} days to exam · ` : ""}your weakest topic</div>
            </div>
          </div>
        )}

        {index.units.map((u) => (
          <div key={u.unitId} style={{ ...card(C), marginTop: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
              <div style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 600, color: C.foam }}>Unit {u.unitId} · {u.title}</div>
              <div style={{ fontFamily: FONT_UI, fontSize: 12.5, color: C.line }}>{u.sectionIds.reduce((n, s) => n + (index.sections[s].orderedItemIds.filter((id) => progressMap[id]).length), 0)} / {u.total} seen</div>
            </div>
            {u.sectionIds.map((sid) => {
              const sec = index.sections[sid];
              const st = masteryState(sec.orderedItemIds, progressMap);
              const r = readiness(sec.orderedItemIds, progressMap).value;
              const here = bookmark && bookmark.sectionId === sid;
              return (
                <button key={sid} onClick={() => startRead(sid, 0)}
                  style={{ display: "flex", alignItems: "center", gap: 12, width: "100%", textAlign: "left", background: here ? "rgba(79,216,196,.08)" : "transparent", border: "none", borderRadius: 12, padding: "12px 10px", cursor: "pointer" }}>
                  <span style={{ flex: 1, fontFamily: FONT_UI, fontSize: 15.5, fontWeight: here ? 700 : 500, color: C.foam }}>{sid} {sec.title}</span>
                  <span style={{ width: 90, height: 6, borderRadius: 99, background: "rgba(255,255,255,.12)", overflow: "hidden" }}>
                    <span style={{ display: "block", height: "100%", width: `${Math.round(r * 100)}%`, background: statusColor(C, st) }} />
                  </span>
                  <StatusPill C={C} state={here ? "here" : st} />
                </button>
              );
            })}
          </div>
        ))}

        <div style={{ textAlign: "center", marginTop: 24 }}>
          <button onClick={() => setView("settings")} style={linkBtn(C)}>Settings</button>
          <span style={{ color: C.line }}> · </span>
          <button onClick={onUseClassic} style={linkBtn(C)}>Use the classic experience</button>
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
    return (
      <div style={pad}>
        <TopBar C={C} left={mode === "smart" ? "Smart practice" : `Reading · Unit ${loc?.unitId}`} />
        <p style={kicker(C)}>{mode === "smart" ? "SMART PRACTICE · INTERLEAVED" : `UNIT ${loc?.unitId} · §${loc?.sectionId} ${index.sections[loc?.sectionId]?.title?.toUpperCase()}`}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "8px 0 6px" }}>
          <span style={tierPill(C, it.tier)}>{TIER[it.tier] || "RECALL"}</span>
          <span style={{ fontFamily: FONT_UI, color: C.mist, fontSize: 14 }}>{mode === "smart" ? "Interleaved" : `Question ${pos + 1} of ${total}`}</span>
        </div>
        {mode === "smart" && wrongFlag && !locked && (
          <div style={{ fontFamily: FONT_UI, fontSize: 12.5, color: C.no, marginBottom: 8 }}>↻ you missed this last time</div>
        )}
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
          </div>
        )}
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button onClick={() => setView("summary")} style={ghostBtn(C)}>Stop</button>
          <button onClick={onPrimary} disabled={!locked && !canSubmit(item, answer)}
            style={{ ...primaryBtn(C), flex: 1, opacity: !locked && !canSubmit(item, answer) ? 0.5 : 1 }}>
            {locked ? "Next ›" : "Check"}
          </button>
        </div>
      </div>
    );
  }

  // ---------- Section checkpoint ----------
  function renderCheckpoint() {
    const sec = index.sections[checkpointSec];
    const st = masteryState(sec.orderedItemIds, progressMap);
    const nextSec = index.nextSectionId(checkpointSec);
    return (
      <div style={{ ...pad, textAlign: "center" }}>
        <TopBar C={C} left="Section end" />
        <div style={{ width: 84, height: 84, borderRadius: "50%", background: "rgba(79,216,196,.16)", display: "grid", placeItems: "center", margin: "40px auto 16px", color: C.ok, fontSize: 34 }}>✓</div>
        <p style={{ ...kicker(C), textAlign: "center" }}>SECTION COMPLETE</p>
        <h1 style={{ ...h1(C), fontSize: 30 }}>You've finished §{sec.sectionId} {sec.title}</h1>
        <div style={{ display: "flex", justifyContent: "center", gap: 40, margin: "22px 0" }}>
          <Stat C={C} n={session.count} label="QUESTIONS" />
          <Stat C={C} n={session.correct} label="CORRECT" />
          <Stat C={C} n={session.count ? Math.round((session.correct / session.count) * 100) + "%" : "—"} label="THIS SESSION" />
        </div>
        <p style={{ ...sub(C), textAlign: "center" }}>§{sec.sectionId} is now <strong style={{ color: statusColor(C, st) }}>{st}</strong>.</p>
        <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 10 }}>
          {nextSec
            ? <button style={primaryBtn(C)} onClick={() => continueSection(nextSec)}>Continue to §{nextSec} {index.sections[nextSec].title} ›</button>
            : <button style={primaryBtn(C)} onClick={() => setView("summary")}>Finish ›</button>}
          <button style={ghostBtn(C)} onClick={() => setView("summary")}>Stop for now</button>
          <button style={ghostBtn(C)} onClick={() => startBrowse(sec.orderedItemIds, `§${sec.sectionId} ${sec.title}`)}>Review this section</button>
        </div>
      </div>
    );
  }

  // ---------- Session summary ----------
  function renderSummary() {
    const wrongIds = session.wrong;
    return (
      <div style={pad}>
        <TopBar C={C} left="Session paused" />
        <p style={kicker(C)}>SESSION PAUSED</p>
        <h1 style={h1(C)}>How that went</h1>
        <p style={sub(C)}>No streaks, no timer — you set the pace. Your place is bookmarked.</p>
        <div style={{ display: "flex", gap: 40, margin: "22px 0" }}>
          <Stat C={C} n={session.count} label="QUESTIONS" />
          <Stat C={C} n={session.correct} label="CORRECT" />
          <Stat C={C} n={wrongIds.length} label="TO REVISIT" />
        </div>
        {wrongIds.length > 0 && (
          <div style={{ ...card(C) }}>
            <p style={kicker(C)}>THE {wrongIds.length} YOU MISSED</p>
            {wrongIds.map((id) => (
              <div key={id} style={{ display: "flex", gap: 10, padding: "10px 0", borderTop: `1px solid ${C.line}22`, fontFamily: FONT_UI, fontSize: 14.5, color: C.foam }}>
                <span style={{ color: C.no }}>✗</span>
                <span>§{secOf(itemById[id])} — {(itemById[id].q || "").slice(0, 90)}</span>
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
    if (!it) return <div style={pad}><TopBar C={C} left="Browse" /><p style={sub(C)}>Nothing to browse.</p><button style={ghostBtn(C)} onClick={() => setView("library")}>‹ Library</button></div>;
    return (
      <div style={pad}>
        <TopBar C={C} left="Browse" />
        <p style={kicker(C)}>👁 BROWSE · READ-ONLY</p>
        <p style={{ ...sub(C), marginTop: 2 }}>Question and answer together, nothing to attempt — just to jog the memory.</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "10px 0 6px" }}>
          <span style={tierPill(C, it.tier)}>{TIER[it.tier] || "RECALL"}</span>
          <span style={{ fontFamily: FONT_UI, color: C.mist, fontSize: 14 }}>§{secOf(it)} · {browse.pos + 1} of {browse.ids.length}</span>
        </div>
        <div style={{ fontFamily: FONT_DISPLAY, fontSize: 22, fontWeight: 600, color: C.foam, lineHeight: 1.25, margin: "6px 0 14px", whiteSpace: "pre-line" }}>{it.q}</div>
        <div style={{ ...card(C), border: `1px solid ${C.ok}55` }}>
          <p style={{ ...kicker(C), color: C.ok }}>ANSWER</p>
          {answerText(it) && <div style={{ fontFamily: FONT_UI, fontSize: 16, color: C.foam, fontWeight: 600, lineHeight: 1.5 }}>{answerText(it)}</div>}
          <div style={{ fontFamily: FONT_UI, fontSize: 15, color: C.mist, lineHeight: 1.55, marginTop: answerText(it) ? 10 : 0 }}>{it.why}</div>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
          <button style={ghostBtn(C)} onClick={() => setView("library")}>‹ Library</button>
          <button style={{ ...primaryBtn(C), flex: 1, background: "transparent", color: C.foam, border: `1px solid ${C.line}` }}
            disabled={browse.pos + 1 >= browse.ids.length}
            onClick={() => setBrowse((b) => ({ ...b, pos: Math.min(b.pos + 1, b.ids.length - 1) }))}>Next question ›</button>
        </div>
      </div>
    );
  }

  // ---------- Settings (exam date + experience) ----------
  function renderSettings() {
    return (
      <div style={pad}>
        <TopBar C={C} left="Settings" />
        <button onClick={() => setView("library")} style={linkBtn(C)}>‹ Back</button>
        <h1 style={{ ...h1(C), marginTop: 8 }}>Settings</h1>
        <div style={{ ...card(C), marginTop: 14 }}>
          <div style={{ fontFamily: FONT_UI, fontWeight: 700, color: C.foam, marginBottom: 4 }}>Exam date</div>
          <div style={{ fontFamily: FONT_UI, color: C.mist, fontSize: 13, marginBottom: 10 }}>Optional — drives the readiness countdown.</div>
          <input type="date" value={settings.examDate ? settings.examDate.slice(0, 10) : ""}
            onChange={async (e) => { const v = e.target.value || null; setSettings((s) => ({ ...s, examDate: v })); if (store()) await store().putSettings({ examDate: v }); }}
            style={{ fontFamily: FONT_UI, fontSize: 15, padding: "10px 12px", borderRadius: 10, border: `1px solid ${C.line}`, background: C.shelf, color: C.foam }} />
        </div>
        <div style={{ ...card(C), marginTop: 14 }}>
          <div style={{ fontFamily: FONT_UI, fontWeight: 700, color: C.foam, marginBottom: 8 }}>Experience</div>
          <button style={ghostBtn(C)} onClick={onUseClassic}>Switch to the classic experience</button>
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
  function celebrateOverlay() {
    if (!celebrate) return null;
    const sec = index.sections[celebrate];
    return (
      <div style={overlay(C)} onClick={() => setCelebrate(null)}>
        <div style={{ fontSize: 44 }}>🎉</div>
        <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 26, color: C.ok, margin: "8px 0" }}>Mastered!</h2>
        <p style={{ fontFamily: FONT_UI, color: C.foam, maxWidth: 340, textAlign: "center" }}>§{sec.sectionId} {sec.title} just crossed into mastered.</p>
        <button style={primaryBtn(C)} onClick={() => setCelebrate(null)}>Nice</button>
      </div>
    );
  }
}

/* ------------------------------ presentational bits ------------------------ */
const pad = { maxWidth: 480, margin: "0 auto", padding: "0 18px 40px" };
function Shell({ C, children }) {
  return <main style={{ minHeight: "100dvh", background: `linear-gradient(${C.bg0} 0%, ${C.bg1} 60%)`, color: C.foam, fontFamily: FONT_UI }}>{children}</main>;
}
function TopBar({ C, left }) {
  return <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 2px 6px", fontFamily: FONT_UI, fontSize: 14, color: C.mist }}><span>{left}</span><span>{" "}</span></div>;
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
const overlay = (C) => ({ position: "fixed", inset: 0, background: "rgba(4,20,31,.94)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 6, padding: 30, zIndex: 50 });
function statusColor(C, st) { return st === "mastered" ? C.ok : st === "improving" ? C.gold : st === "weak" ? C.coral : C.line; }
function StatusPill({ C, state }) {
  const map = { here: ["YOU'RE HERE", C.glow, C.abyss, C.glow], mastered: ["MASTERED", "transparent", C.ok, C.ok], improving: ["IMPROVING", "transparent", C.gold, C.gold], weak: ["WEAK", "transparent", C.coral, C.coral], unstarted: ["NOT STARTED", "transparent", C.line, C.line] };
  const [label, bg, fg, bd] = map[state] || map.unstarted;
  return <span style={{ padding: "5px 10px", borderRadius: 999, background: bg, color: fg, border: `1px solid ${bd}`, fontFamily: FONT_UI, fontSize: 10.5, fontWeight: 700, letterSpacing: ".04em", whiteSpace: "nowrap" }}>{label}</span>;
}
function Stat({ C, n, label }) {
  return <div style={{ textAlign: "center" }}><div style={{ fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 600, color: C.foam }}>{n}</div><div style={{ fontFamily: FONT_UI, fontSize: 11, letterSpacing: ".08em", color: C.mist }}>{label}</div></div>;
}
function Donut({ C, pct }) {
  const r = 26, circ = 2 * Math.PI * r, off = circ * (1 - pct / 100);
  return (
    <svg width="72" height="72" viewBox="0 0 72 72">
      <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,.14)" strokeWidth="8" />
      <circle cx="36" cy="36" r={r} fill="none" stroke={C.glow} strokeWidth="8" strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={off} transform="rotate(-90 36 36)" />
      <text x="36" y="41" textAnchor="middle" fontFamily={FONT_UI} fontSize="15" fontWeight="700" fill={C.foam}>{pct}%</text>
    </svg>
  );
}

export default ReaderApp;
