import React, { useEffect, useMemo, useRef, useState } from "react";
import { WRITING, scoreWritingItem, writingByUnit } from "../content/writing-bank.js";

/* A one-line, plain-words summary of an item's marking caps, shown under the checklist,
   e.g. "Counts at most 3 Strength ticks and 3 Limitation ticks (5 together)." */
function capsLine(caps) {
  const singles = caps.filter((c) => c.labels.length === 1);
  const combined = caps.filter((c) => c.labels.length > 1);
  const s = singles.map((c, i) => `${i === 0 ? "at most " : ""}${c.max} ${c.labels[0]} tick${c.max === 1 ? "" : "s"}`).join(" and ");
  const comb = combined.map((c) => `${c.max} together`).join(", ");
  return "Counts" + (s ? " " + s : "") + (comb ? ` (${comb})` : "") + ".";
}

/* Writing practice — a "write it, then mark it" pilot. Three screens, all local:
 *   list     → questions grouped by unit (command word, marks, last self-mark)
 *   question → exam-style header, auto-growing textarea, word count; "Mark my
 *              answer" (>=10 chars) or "I wrote it on paper"
 *   mark     → the answer stays visible (collapsible), a tick-the-points checklist
 *              with "also accepted" wording and a non-creditable list; Done reveals
 *              the result (min(ticked, marks)), points to add, model answer and tip.
 *
 * Nothing is auto-marked: the student ticks the points their answer actually made.
 * Fully isolated — never feeds scoring, mastery, readiness, mixed practice or rewards.
 * Entitlement: Unit 1 is free; other units need the licence (isUnlocked(unit)).
 */
export default function WritingPractice({
  C, theme, writingData = {}, onSaveResult, keepText = true,
  isUnlocked = () => true, onLocked, onBack, fontUi, fontDisplay, unitTitle,
}) {
  const light = theme === "light";
  const F_UI = fontUi || "'Source Sans 3', ui-sans-serif, system-ui, sans-serif";
  const F_D = fontDisplay || "'Lexend', ui-sans-serif, system-ui, sans-serif";

  const [screen, setScreen] = useState("list"); // list | q | mark
  const [curId, setCurId] = useState(null);
  const [text, setText] = useState("");
  const [paper, setPaper] = useState(false);
  const [ticks, setTicks] = useState(() => new Set());
  const [done, setDone] = useState(false);
  const taRef = useRef(null);

  const groups = useMemo(() => writingByUnit(WRITING), []);
  const unlockedOrder = useMemo(() => WRITING.filter((w) => isUnlocked(w.unit)).map((w) => w.id), [isUnlocked]);
  const q = curId ? WRITING.find((w) => w.id === curId) : null;

  // ---- style helpers ----
  const cardBg = light ? "#FFFFFF" : C.deep;
  const card = { background: cardBg, border: `1px solid ${C.line}`, borderRadius: 16, padding: 16 };
  const kicker = { fontFamily: F_UI, fontSize: 11, fontWeight: 800, letterSpacing: 0.7, textTransform: "uppercase", color: light ? C.accent : C.glow, margin: 0 };
  const btnP = { fontFamily: F_UI, fontWeight: 800, fontSize: 15, padding: "12px 18px", borderRadius: 12, border: "none", background: light ? C.accent : C.glow, color: light ? "#fff" : C.abyss, cursor: "pointer" };
  const btnS = { fontFamily: F_UI, fontWeight: 700, fontSize: 14.5, padding: "12px 16px", borderRadius: 12, border: `1px solid ${C.line}`, background: light ? C.raise : C.shelf, color: C.foam, cursor: "pointer" };
  const linkBtn = { fontFamily: F_UI, fontWeight: 700, fontSize: 14, background: "none", border: "none", color: light ? C.accent : C.glow, cursor: "pointer", padding: "4px 0" };

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  useEffect(() => { autoGrow(); }, [screen, text]);
  function autoGrow() {
    const ta = taRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.max(120, ta.scrollHeight) + "px";
  }

  function openQuestion(id) {
    const w = WRITING.find((x) => x.id === id);
    if (!w) return;
    if (!isUnlocked(w.unit)) { onLocked && onLocked(); return; }
    setCurId(id); setText(""); setPaper(false); setTicks(new Set()); setDone(false); setScreen("q");
  }
  function toMark(onPaper) {
    setPaper(onPaper); setTicks(new Set()); setDone(false); setScreen("mark");
  }
  function toggleTick(i) {
    if (done) return;
    setTicks((prev) => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; });
  }
  function finish() {
    if (!q) return;
    const score = scoreWritingItem(q, [...ticks]);
    setDone(true);
    if (onSaveResult) onSaveResult(q.id, { score, of: q.marks, text: paper ? "" : text, ticks: [...ticks] });
  }
  function tryAgain() {
    setText(""); setPaper(false); setTicks(new Set()); setDone(false); setScreen("q");
  }
  function nextQuestion() {
    const i = unlockedOrder.indexOf(curId);
    const nextId = i >= 0 ? unlockedOrder[i + 1] : null;
    if (nextId) openQuestion(nextId); else setScreen("list");
  }

  // ================= LIST =================
  if (screen === "list") {
    return (
      <div style={{ fontFamily: F_UI, color: C.foam }}>
        <button onClick={onBack} style={linkBtn}>‹ Library</button>
        <p style={{ ...kicker, margin: "8px 0 2px" }}>Writing practice · pilot</p>
        <h1 style={{ fontFamily: F_D, fontSize: 26, fontWeight: 600, color: C.foam, margin: "0 0 4px" }}>Write it, then mark it</h1>
        <p style={{ color: C.mist, lineHeight: 1.5, margin: "0 0 16px" }}>
          Write a 4–6 mark answer, then tick the marking points you actually made. Nothing is marked for you, and this stays out of your scores and revision schedule.
        </p>
        {groups.map(({ unit, questions }) => {
          const locked = !isUnlocked(unit);
          return (
            <div key={unit} style={{ marginBottom: 18 }}>
              <h3 style={{ fontSize: 13, color: C.mist, textTransform: "uppercase", letterSpacing: 0.7, margin: "4px 2px 8px", fontWeight: 800 }}>
                Unit {unit}{unitTitle && unitTitle(unit) ? ` · ${unitTitle(unit)}` : ""}{locked ? " · 🔒 locked" : ""}
              </h3>
              <div style={{ display: "grid", gap: 10 }}>
                {questions.map((w) => {
                  const rec = writingData[w.id];
                  const last = rec && rec.lastScore != null ? `Last: ${rec.lastScore}/${w.marks}` : null;
                  return (
                    <button key={w.id} onClick={() => locked ? (onLocked && onLocked()) : openQuestion(w.id)}
                      style={{ ...card, display: "flex", alignItems: "flex-start", gap: 12, textAlign: "left", cursor: "pointer", opacity: locked ? 0.6 : 1 }}>
                      <span style={{ flex: 1 }}>
                        <span style={{ display: "block", fontFamily: F_UI, fontSize: 12.5, fontWeight: 800, color: light ? C.accent : C.glow, letterSpacing: 0.3 }}>
                          {w.command} · [{w.marks} marks]
                        </span>
                        <span style={{ display: "block", fontFamily: F_D, fontSize: 16, fontWeight: 600, color: C.foam, marginTop: 3, lineHeight: 1.3 }}>{w.q}</span>
                        {last && <span style={{ display: "inline-block", marginTop: 6, fontFamily: F_UI, fontSize: 12.5, fontWeight: 700, color: C.amber }}>{last}</span>}
                      </span>
                      <span aria-hidden="true" style={{ color: locked ? C.mist : (light ? C.accent : C.glow), fontSize: 20 }}>{locked ? "🔒" : "›"}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  if (!q) { setScreen("list"); return null; }

  // ================= QUESTION =================
  if (screen === "q") {
    const canMark = text.trim().length >= 10;
    return (
      <div style={{ fontFamily: F_UI, color: C.foam }}>
        <button onClick={() => setScreen("list")} style={linkBtn}>‹ All questions</button>
        <div style={{ ...card, marginTop: 8, borderLeft: `4px solid ${light ? C.accent : C.glow}` }}>
          <p style={kicker}>Unit {q.unit} · {q.ref} · {q.command}</p>
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 10, marginTop: 6 }}>
            <h2 style={{ fontFamily: F_D, fontSize: 20, fontWeight: 600, color: C.foam, margin: 0, lineHeight: 1.3 }}>{q.q}</h2>
          </div>
          <span style={{ display: "inline-block", marginTop: 8, fontFamily: F_UI, fontSize: 13, fontWeight: 800, color: C.amber, border: `1px solid ${C.line}`, borderRadius: 999, padding: "2px 10px" }}>[{q.marks} marks]</span>
        </div>

        <textarea ref={taRef} value={text} onChange={(e) => setText(e.target.value)} onInput={autoGrow}
          placeholder="Write your answer here…" aria-label="Your answer"
          style={{ width: "100%", boxSizing: "border-box", marginTop: 12, minHeight: 120, resize: "none", fontFamily: F_UI, fontSize: 16, lineHeight: 1.5, padding: "12px 14px", borderRadius: 12, border: `1px solid ${C.line}`, background: light ? C.raise : C.shelf, color: C.foam }} />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 6 }}>
          <span style={{ fontFamily: F_UI, fontSize: 13, color: C.mist }}>Aim for about one point per mark.</span>
          <span style={{ fontFamily: F_UI, fontSize: 13, color: C.mist }}>{wordCount} {wordCount === 1 ? "word" : "words"}</span>
        </div>

        <div style={{ display: "flex", gap: 10, marginTop: 14, flexWrap: "wrap" }}>
          <button onClick={() => toMark(false)} disabled={!canMark}
            style={{ ...btnP, flex: "1 1 180px", opacity: canMark ? 1 : 0.5, cursor: canMark ? "pointer" : "default" }}>
            Mark my answer
          </button>
          <button onClick={() => toMark(true)} style={{ ...btnS, flex: "1 1 160px" }}>I wrote it on paper</button>
        </div>
        {!canMark && <p style={{ fontFamily: F_UI, fontSize: 12.5, color: C.mist, marginTop: 8 }}>Type at least a sentence (10 characters) to mark it, or choose “I wrote it on paper”.</p>}
      </div>
    );
  }

  // ================= MARK =================
  const score = scoreWritingItem(q, [...ticks]);
  const missed = q.points.filter((_, i) => !ticks.has(i));
  return (
    <div style={{ fontFamily: F_UI, color: C.foam }}>
      <button onClick={() => setScreen("q")} style={linkBtn}>‹ Back to writing</button>
      <p style={{ ...kicker, margin: "8px 0 2px" }}>Unit {q.unit} · {q.command} · [{q.marks} marks]</p>
      <h2 style={{ fontFamily: F_D, fontSize: 19, fontWeight: 600, color: C.foam, margin: "0 0 10px", lineHeight: 1.3 }}>{q.q}</h2>

      {/* The answer stays visible, read-only and collapsible */}
      <details open style={{ ...card, marginBottom: 12 }}>
        <summary style={{ cursor: "pointer", fontFamily: F_UI, fontWeight: 700, fontSize: 14, color: C.foam }}>Your answer</summary>
        {paper
          ? <p style={{ margin: "8px 0 0", color: C.mist, fontStyle: "italic" }}>You wrote this answer on paper.</p>
          : <p style={{ margin: "8px 0 0", color: C.foam, lineHeight: 1.55, whiteSpace: "pre-wrap" }}>{text || <span style={{ color: C.mist }}>(nothing typed)</span>}</p>}
      </details>

      {!done && (
        <>
          <p style={{ fontFamily: F_UI, fontSize: 13.5, color: C.amber, fontWeight: 700, margin: "0 0 4px" }}>Be strict: mark it the way an examiner would.</p>
          <p style={{ fontFamily: F_UI, fontSize: 14, color: C.mist, margin: "0 0 10px", lineHeight: 1.5 }}>Tick each point your answer makes. Only tick it if you actually wrote it.</p>
        </>
      )}

      {/* Checklist */}
      <div style={{ display: "grid", gap: 8 }}>
        {q.points.map((p, i) => {
          const on = ticks.has(i);
          return (
            <button key={i} onClick={() => toggleTick(i)} disabled={done} aria-pressed={on}
              style={{ display: "flex", gap: 12, alignItems: "flex-start", minHeight: 44, textAlign: "left", width: "100%", padding: "10px 12px", borderRadius: 12, cursor: done ? "default" : "pointer",
                border: `1.5px solid ${on ? (light ? C.accent : C.glow) : C.line}`, background: on ? (light ? "rgba(12,124,111,.10)" : "rgba(79,216,196,.12)") : (light ? "#FFFFFF" : C.deep) }}>
              <span aria-hidden="true" style={{ flexShrink: 0, width: 24, height: 24, borderRadius: 7, marginTop: 1, display: "grid", placeItems: "center", fontWeight: 900, fontSize: 15,
                border: `2px solid ${on ? (light ? C.accent : C.glow) : C.line}`, background: on ? (light ? C.accent : C.glow) : "transparent", color: on ? (light ? "#fff" : C.abyss) : "transparent" }}>✓</span>
              <span style={{ flex: 1 }}>
                <span style={{ display: "block", fontFamily: F_UI, fontSize: 14.5, color: C.foam, lineHeight: 1.4 }}>{p.t}</span>
                {p.accept && <span style={{ display: "block", fontFamily: F_UI, fontSize: 12.5, color: C.mist, marginTop: 3 }}>also accepted: {p.accept}</span>}
              </span>
            </button>
          );
        })}
      </div>

      {Array.isArray(q.caps) && q.caps.length > 0 && (
        <p style={{ fontFamily: F_UI, fontSize: 12.5, color: C.mist, margin: "8px 2px 0", lineHeight: 1.5 }}>{capsLine(q.caps)}</p>
      )}

      {Array.isArray(q.noCredit) && q.noCredit.length > 0 && (
        <div style={{ marginTop: 12 }}>
          <p style={{ fontFamily: F_UI, fontSize: 12.5, fontWeight: 800, letterSpacing: 0.4, textTransform: "uppercase", color: C.mist, margin: "0 0 6px" }}>Not credited</p>
          <div style={{ display: "grid", gap: 6 }}>
            {q.noCredit.map((n, i) => (
              <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", padding: "8px 12px", borderRadius: 10, border: `1px dashed ${C.line}`, background: "transparent" }}>
                <span aria-hidden="true" style={{ color: C.coral, fontWeight: 900, flexShrink: 0 }}>✗</span>
                <span style={{ fontFamily: F_UI, fontSize: 13.5, color: C.mist, lineHeight: 1.4 }}>{n}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {!done ? (
        <button onClick={finish} style={{ ...btnP, width: "100%", marginTop: 16 }}>Done — show my score</button>
      ) : (
        <div style={{ marginTop: 16 }}>
          <div style={{ ...card, textAlign: "center", borderColor: light ? C.accent : C.glow }}>
            <p style={{ ...kicker, margin: 0 }}>Your self-mark</p>
            <p style={{ fontFamily: F_D, fontSize: 40, fontWeight: 600, color: light ? C.accent : C.glow, margin: "4px 0 0" }}>{score} / {q.marks}</p>
          </div>

          {missed.length > 0 && (
            <div style={{ ...card, marginTop: 12 }}>
              <p style={{ fontFamily: F_UI, fontWeight: 800, color: C.foam, margin: "0 0 8px" }}>Points you could add</p>
              <ul style={{ margin: 0, paddingLeft: 18, color: C.mist, lineHeight: 1.5 }}>
                {missed.map((p, i) => <li key={i} style={{ marginBottom: 4 }}>{p.t}{p.accept ? <span style={{ color: C.mist }}> (also: {p.accept})</span> : null}</li>)}
              </ul>
            </div>
          )}

          <div style={{ ...card, marginTop: 12 }}>
            <p style={{ fontFamily: F_UI, fontWeight: 800, color: C.foam, margin: "0 0 6px" }}>Model answer</p>
            <p style={{ margin: 0, color: C.foam, lineHeight: 1.6 }}>{q.model}</p>
          </div>

          {q.tip && (
            <div style={{ ...card, marginTop: 12, background: light ? "rgba(12,124,111,.06)" : "rgba(79,216,196,.06)" }}>
              <p style={{ fontFamily: F_UI, fontWeight: 800, color: C.foam, margin: "0 0 6px" }}>Examiner tip</p>
              <p style={{ margin: 0, color: C.mist, lineHeight: 1.55 }}>{q.tip}</p>
            </div>
          )}

          <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
            <button onClick={tryAgain} style={{ ...btnS, flex: "1 1 120px" }}>Try again</button>
            <button onClick={nextQuestion} style={{ ...btnP, flex: "1 1 140px" }}>Next question</button>
            <button onClick={() => setScreen("list")} style={{ ...btnS, flex: "1 1 120px" }}>Back to list</button>
          </div>
        </div>
      )}
    </div>
  );
}
