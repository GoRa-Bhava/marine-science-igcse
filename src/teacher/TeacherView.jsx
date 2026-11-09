import React, { useEffect, useMemo, useRef, useState } from "react";
import { createTeacherStore } from "./teacherStore.js";
import { decodeReport, decodeResult, readHash, encodeAssignment, assignmentUrl } from "./reportCodec.js";
import { heatmap, classWeakestTopics, topMisconceptions, writingInsight, lessonStarterItems, studentsToCsv, cellState } from "./aggregate.js";
import { pickAssignmentItems, buildAssignment, aggregateResults } from "./assignment.js";
import { qrSvg } from "./qr.js";

/* Teacher view (view: "teacher"). Free to open; no licence needed to read reports.
 * All data is local (its own IndexedDB store). Tabs: Class, Mistakes, Writing,
 * Set work (phase E). Adds students from pasted #r= codes/links or a QR scan.
 */
const BAND = { green: "#2Fae6a", amber: "#E7A42E", red: "#E2553D", grey: "#9aa" };

export default function TeacherView({
  C, theme, itemById = {}, topicMeta = {}, topicUnit = {}, writingById = {}, unitNames = {},
  pendingAdd, onConsumePending, pendingResult, onConsumeResult, onSetWork, onBack, fontUi, fontDisplay,
}) {
  const light = theme === "light";
  const F_UI = fontUi || "Karla, system-ui, sans-serif";
  const F_D = fontDisplay || "Fraunces, Georgia, serif";
  const storeRef = useRef(null);
  if (!storeRef.current) storeRef.current = createTeacherStore(typeof window !== "undefined" ? window.indexedDB : undefined);
  const store = storeRef.current;

  const [classes, setClasses] = useState([]);
  const [activeClassId, setActiveClassId] = useState("all");
  const [tab, setTab] = useState("class");
  const [heatMode, setHeatMode] = useState("units"); // units | topics
  const [mistUnit, setMistUnit] = useState("all");
  const [pasteOpen, setPasteOpen] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [confirmList, setConfirmList] = useState(null); // [{name, classCode, report}] | {error}
  const [lesson, setLesson] = useState(null); // { items, i, revealed }
  const [toast, setToast] = useState("");
  const [scanOpen, setScanOpen] = useState(false);
  // Set work (phase E)
  const [swMode, setSwMode] = useState("weak"); // weak | unit
  const [swUnits, setSwUnits] = useState(() => new Set());
  const [swN, setSwN] = useState(5);
  const [swCount, setSwCount] = useState(10);
  const [swTitle, setSwTitle] = useState("");
  const [swDue, setSwDue] = useState("");
  const [swMade, setSwMade] = useState(null); // { assignment, code, url, svg }
  const [swResultsText, setSwResultsText] = useState("");
  const [swResults, setSwResults] = useState([]); // decoded result payloads

  const canScan = typeof window !== "undefined" && "BarcodeDetector" in window;

  async function refresh() { setClasses(await store.listClasses()); }
  useEffect(() => { refresh(); }, []);

  // A #r= link that arrived in the URL → offer to add that one student.
  useEffect(() => {
    if (!pendingAdd) return;
    (async () => {
      try {
        const parsed = readHash(pendingAdd) || { code: pendingAdd };
        const rep = await decodeReport(parsed.code || pendingAdd);
        setConfirmList([{ name: rep.n, classCode: rep.c || "", report: rep }]);
      } catch (e) {
        setConfirmList({ error: e && e.friendly ? e.message : "That link could not be read." });
      }
      if (onConsumePending) onConsumePending();
    })();
  }, [pendingAdd]);

  // A #x= result link that arrived in the URL → read it into the Set-work collector.
  useEffect(() => {
    if (!pendingResult) return;
    (async () => {
      try {
        const parsed = readHash(pendingResult) || { code: pendingResult };
        const res = await decodeResult(parsed.code || pendingResult);
        setSwResults((prev) => [...prev, res]);
        setTab("setwork");
        flash("Result added.");
      } catch { flash("That result link could not be read."); }
      if (onConsumeResult) onConsumeResult();
    })();
  }, [pendingResult]);

  function flash(m) { setToast(m); setTimeout(() => setToast(""), 2600); }

  const allStudents = useMemo(() => classes.flatMap((c) => c.students), [classes]);
  const activeStudents = useMemo(
    () => (activeClassId === "all" ? allStudents : (classes.find((c) => c.id === activeClassId)?.students || [])),
    [classes, activeClassId, allStudents]
  );

  // ---- add students ----
  async function parsePaste() {
    const lines = pasteText.split(/[\r\n]+/).map((s) => s.trim()).filter(Boolean);
    if (!lines.length) { setConfirmList({ error: "Paste at least one code or link." }); return; }
    const out = [];
    const bad = [];
    for (const line of lines) {
      try {
        const parsed = readHash(line) || { code: line };
        const rep = await decodeReport(parsed.code || line);
        out.push({ name: rep.n, classCode: rep.c || "", report: rep });
      } catch {
        bad.push(line.slice(0, 24));
      }
    }
    if (!out.length) { setConfirmList({ error: "None of those could be read." }); return; }
    setConfirmList(out);
    if (bad.length) flash(`${bad.length} line(s) couldn't be read.`);
  }
  async function confirmAdd() {
    if (!Array.isArray(confirmList)) return;
    for (const s of confirmList) await store.addReport(s.report);
    const n = confirmList.length;
    setConfirmList(null); setPasteText(""); setPasteOpen(false);
    await refresh();
    flash(`Added ${n} student${n === 1 ? "" : "s"}.`);
  }

  // ---- QR scan (BarcodeDetector) ----
  function onScanCode(raw) {
    setScanOpen(false);
    (async () => {
      try {
        const parsed = readHash(raw) || { code: raw };
        const rep = await decodeReport(parsed.code || raw);
        setConfirmList([{ name: rep.n, classCode: rep.c || "", report: rep }]);
      } catch (e) {
        setConfirmList({ error: "That QR code could not be read." });
      }
    })();
  }

  // ---- delete ----
  async function delStudent(name) {
    const cls = classes.find((c) => c.students.some((s) => s.name === name && (activeClassId === "all" || c.id === activeClassId)));
    const target = activeClassId === "all" ? cls : classes.find((c) => c.id === activeClassId);
    if (!target) return;
    if (!window.confirm(`Delete ${name} from ${target.name || target.code}? This can't be undone.`)) return;
    await store.deleteStudent(target.id, name);
    await refresh(); flash("Student deleted.");
  }
  async function delClass(cls) {
    if (!window.confirm(`Delete the whole class "${cls.name || cls.code}" and its ${cls.students.length} student(s)? This can't be undone.`)) return;
    await store.deleteClass(cls.id);
    setActiveClassId("all"); await refresh(); flash("Class deleted.");
  }

  // ---- export / backup / restore ----
  function download(filename, text, type = "text/plain") {
    try {
      const blob = new Blob([text], { type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = filename;
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      return true;
    } catch { return false; }
  }
  function exportCsv() {
    const unitIds = Object.keys(unitNames).sort((a, b) => Number(a) - Number(b));
    const topicIds = Object.keys(topicMeta);
    const csv = studentsToCsv(activeStudents, { unitIds, topicMeta, topicIds });
    download(`marine-class-${new Date().toISOString().slice(0, 10)}.csv`, csv, "text/csv");
    flash("CSV downloaded.");
  }
  async function backup() {
    const dump = await store.exportAll();
    download(`marine-teacher-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(dump, null, 2), "application/json");
    flash("Backup downloaded.");
  }
  function restore(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const r = new FileReader();
    r.onload = async () => {
      try {
        const dump = JSON.parse(String(r.result || ""));
        await store.importAll(dump);
        await refresh(); flash("Backup restored.");
      } catch { flash("That file could not be read."); }
    };
    r.readAsText(file);
    e.target.value = "";
  }

  // ---- derived aggregates ----
  const hm = useMemo(() => heatmap(activeStudents, { topicMeta }), [activeStudents, topicMeta]);
  const weakest = useMemo(() => classWeakestTopics(activeStudents, topicMeta, { minAttempts: 2 }), [activeStudents, topicMeta]);
  const mistakes = useMemo(
    () => topMisconceptions(activeStudents, itemById, topicUnit, { unit: mistUnit === "all" ? undefined : mistUnit }),
    [activeStudents, itemById, topicUnit, mistUnit]
  );
  const writing = useMemo(() => writingInsight(activeStudents, writingById), [activeStudents, writingById]);

  // topic-mode columns
  const topicCols = useMemo(() => {
    if (heatMode !== "topics") return [];
    const set = new Set();
    for (const s of activeStudents) for (const t of Object.keys(s.report?.tp || {})) set.add(t);
    return [...set].sort((a, b) => (topicMeta[a]?.unit || 0) - (topicMeta[b]?.unit || 0) || a.localeCompare(b));
  }, [heatMode, activeStudents, topicMeta]);

  // ---- styles ----
  const cardBg = light ? "#FFFFFF" : C.deep;
  const card = { background: cardBg, border: `1px solid ${C.line}`, borderRadius: 16, padding: 16 };
  const kicker = { fontFamily: F_UI, fontSize: 11, fontWeight: 800, letterSpacing: 0.7, textTransform: "uppercase", color: light ? C.accent : C.glow, margin: 0 };
  const h1 = { fontFamily: F_D, fontSize: 24, fontWeight: 800, color: C.foam, margin: "6px 0 2px" };
  const hint = { fontFamily: F_UI, fontSize: 13, color: C.mist, lineHeight: 1.5 };
  const btnP = { fontFamily: F_UI, fontWeight: 800, fontSize: 14, padding: "10px 14px", borderRadius: 10, border: "none", background: light ? C.accent : C.glow, color: light ? "#fff" : C.abyss, cursor: "pointer" };
  const btnS = { fontFamily: F_UI, fontWeight: 700, fontSize: 13.5, padding: "9px 13px", borderRadius: 10, border: `1px solid ${C.line}`, background: light ? C.raise : C.shelf, color: C.foam, cursor: "pointer" };
  const linkBtn = { fontFamily: F_UI, fontWeight: 700, fontSize: 14, background: "none", border: "none", color: light ? C.accent : C.glow, cursor: "pointer", padding: "4px 0" };
  const tabBtn = (on) => ({ ...btnS, background: on ? (light ? C.accent : C.glow) : (light ? C.raise : C.shelf), color: on ? (light ? "#fff" : C.abyss) : C.foam, border: on ? "none" : `1px solid ${C.line}`, fontWeight: 800 });
  const th = { fontFamily: F_UI, fontSize: 12, fontWeight: 800, color: C.mist, padding: "6px 8px", textAlign: "center", whiteSpace: "nowrap" };
  const nameTd = { fontFamily: F_UI, fontSize: 13.5, fontWeight: 700, color: C.foam, padding: "6px 10px", whiteSpace: "nowrap", position: "sticky", left: 0, background: cardBg };

  const empty = allStudents.length === 0;

  return (
    <div style={{ maxWidth: 820, margin: "0 auto", display: "flex", flexDirection: "column", gap: 14 }}>
      {onBack && <button style={linkBtn} onClick={onBack}>← Back</button>}
      <div>
        <p style={kicker}>Teacher view</p>
        <h1 style={h1}>Your classes</h1>
        <p style={hint}>Student data stays on this device. Clearing your browser data deletes it, so back up regularly. Nothing is uploaded.</p>
      </div>

      {/* confirm-add dialog */}
      {confirmList && (
        <div style={{ ...card, borderColor: light ? C.accent : C.glow }}>
          {Array.isArray(confirmList) ? (
            <>
              <div style={{ fontFamily: F_UI, fontWeight: 800, color: C.foam, marginBottom: 8 }}>
                {confirmList.length === 1
                  ? `Add ${confirmList[0].name}${confirmList[0].classCode ? ` to ${confirmList[0].classCode}` : ""}?`
                  : `Add ${confirmList.length} students?`}
              </div>
              {confirmList.length > 1 && (
                <ul style={{ ...hint, margin: "0 0 10px", paddingLeft: 18 }}>
                  {confirmList.slice(0, 12).map((s, i) => <li key={i}>{s.name}{s.classCode ? ` · ${s.classCode}` : ""}</li>)}
                  {confirmList.length > 12 && <li>…and {confirmList.length - 12} more</li>}
                </ul>
              )}
              <div style={{ display: "flex", gap: 8 }}>
                <button style={btnP} onClick={confirmAdd}>Add</button>
                <button style={btnS} onClick={() => setConfirmList(null)}>Cancel</button>
              </div>
            </>
          ) : (
            <>
              <div style={{ ...hint, color: C.coral, marginBottom: 8 }}>{confirmList.error}</div>
              <button style={btnS} onClick={() => setConfirmList(null)}>OK</button>
            </>
          )}
        </div>
      )}

      {/* add students */}
      <div style={{ ...card, display: "flex", flexDirection: "column", gap: 10 }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
          <button style={btnP} onClick={() => setPasteOpen((v) => !v)}>Add students</button>
          {canScan && <button style={btnS} onClick={() => setScanOpen(true)}>Scan QR</button>}
          <span style={hint}>Paste the codes or links students send you, one per line.{!canScan && " (QR scanning isn't available in this browser.)"}</span>
        </div>
        {pasteOpen && (
          <>
            <textarea value={pasteText} onChange={(e) => setPasteText(e.target.value)} rows={4}
              placeholder={"WC1.… or https://app.wildcateducation.co.uk/#r=WC1.…"}
              style={{ fontFamily: "monospace", fontSize: 12.5, width: "100%", boxSizing: "border-box", padding: 10, borderRadius: 10, border: `1px solid ${C.line}`, background: light ? C.raise : C.shelf, color: C.foam }} />
            <div><button style={btnP} onClick={parsePaste} disabled={!pasteText.trim()}>Read codes</button></div>
          </>
        )}
      </div>

      {(
        <>
          {/* class selector */}
          {classes.length > 1 && (
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
              <button style={tabBtn(activeClassId === "all")} onClick={() => setActiveClassId("all")}>All ({allStudents.length})</button>
              {classes.map((c) => (
                <button key={c.id} style={tabBtn(activeClassId === c.id)} onClick={() => setActiveClassId(c.id)}>{c.name || c.code || "Class"} ({c.students.length})</button>
              ))}
            </div>
          )}

          {/* tabs */}
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button style={tabBtn(tab === "class")} onClick={() => setTab("class")}>Class</button>
            <button style={tabBtn(tab === "mistakes")} onClick={() => setTab("mistakes")}>Mistakes</button>
            <button style={tabBtn(tab === "writing")} onClick={() => setTab("writing")}>Writing</button>
            <button style={tabBtn(tab === "setwork")} onClick={() => setTab("setwork")}>Set work</button>
          </div>

          {tab === "class" && renderClass()}
          {tab === "mistakes" && renderMistakes()}
          {tab === "writing" && renderWriting()}
          {tab === "setwork" && renderSetWork()}

          {/* actions footer */}
          <div style={{ ...card, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button style={btnS} onClick={doPrint}>Print reports</button>
            <button style={btnS} onClick={exportCsv}>Export CSV</button>
            <button style={btnS} onClick={backup}>Back up</button>
            <label style={{ ...btnS, display: "inline-block" }}>Restore<input type="file" accept="application/json" onChange={restore} style={{ display: "none" }} /></label>
          </div>
        </>
      )}

      {toast && <p role="status" style={{ ...hint, color: light ? C.accent : C.glow, fontWeight: 700, textAlign: "center" }}>{toast}</p>}

      {lesson && renderLesson()}
      {scanOpen && <QrScanner C={C} onCode={onScanCode} onClose={() => setScanOpen(false)} fontUi={F_UI} />}

      {/* Print target — hidden on screen, shown by the print stylesheet (responsive.css). */}
      <div id="teacher-print" className="teacher-print" aria-hidden="true" />
    </div>
  );

  // ---------- Class tab ----------
  function renderClass() {
    if (empty) return <div style={{ ...card }}><p style={hint}>No students yet. Ask a student to open <strong style={{ color: C.foam }}>Send progress to your teacher</strong> and send you the link or QR code, then add it above. You can still build an assignment under <strong style={{ color: C.foam }}>Set work</strong>.</p></div>;
    const cols = heatMode === "units" ? hm.units : topicCols;
    const colLabel = (id) => heatMode === "units" ? `U${id}` : (topicMeta[id]?.name || id);
    const cellFor = (s, id) => {
      if (heatMode === "units") {
        const c = (s.report?.u || {})[id];
        if (!c || c[0] === 0) return { pct: null, state: "grey" };
        const pct = Math.round((c[2] / c[0]) * 100);
        return { pct, state: cellState(pct) };
      }
      const v = (s.report?.tp || {})[id];
      if (!v || v[0] === 0) return { pct: null, state: "grey" };
      const pct = Math.round((v[1] / v[0]) * 100);
      return { pct, state: cellState(pct) };
    };
    return (
      <div style={{ ...card, display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <strong style={{ fontFamily: F_UI, color: C.foam }}>Heatmap</strong>
          <button style={tabBtn(heatMode === "units")} onClick={() => setHeatMode("units")}>Units</button>
          <button style={tabBtn(heatMode === "topics")} onClick={() => setHeatMode("topics")}>Topics</button>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table style={{ borderCollapse: "collapse", width: "100%" }}>
            <thead>
              <tr>
                <th style={{ ...th, textAlign: "left", position: "sticky", left: 0, background: cardBg }}>Student</th>
                {cols.map((id) => <th key={id} style={th} title={heatMode === "topics" ? topicMeta[id]?.name : `Unit ${id}`}>{colLabel(id)}</th>)}
                <th style={th}>Updated</th>
              </tr>
            </thead>
            <tbody>
              {activeStudents.map((s) => (
                <tr key={s.name}>
                  <td style={nameTd}>
                    {s.name}
                    <button onClick={() => delStudent(s.name)} aria-label={`Delete ${s.name}`} style={{ ...linkBtn, color: C.coral, fontSize: 12, marginLeft: 8, padding: 0 }}>✕</button>
                  </td>
                  {cols.map((id) => {
                    const cell = cellFor(s, id);
                    return <td key={id} style={{ padding: 4, textAlign: "center" }}>
                      <span title={`${colLabel(id)}: ${cell.pct == null ? "not started" : cell.pct + "%"}`}
                        style={{ display: "inline-block", minWidth: 34, padding: "4px 2px", borderRadius: 6, fontFamily: F_UI, fontSize: 12, fontWeight: 800, color: cell.state === "grey" ? C.mist : "#06202a", background: cell.state === "grey" ? "transparent" : BAND[cell.state] }}>
                        {cell.pct == null ? "–" : cell.pct}
                      </span>
                    </td>;
                  })}
                  <td style={{ ...th, fontWeight: 600 }}>{(s.report?.d || s.addedAt || "").slice(0, 10)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* weakest topics */}
        <div>
          <strong style={{ fontFamily: F_UI, color: C.foam }}>Weakest topics</strong>
          {weakest.length === 0 ? <p style={hint}>Not enough answers yet.</p> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
              {weakest.slice(0, 8).map((w) => {
                const pct = Math.round(w.accuracy * 100);
                return (
                  <div key={w.topicId} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontFamily: F_UI, fontSize: 13, color: C.foam, width: 180, flexShrink: 0 }}>{w.name}</span>
                    <span style={{ flex: 1, height: 14, background: light ? C.raise : C.shelf, borderRadius: 7, overflow: "hidden" }}>
                      <span style={{ display: "block", height: "100%", width: `${pct}%`, background: BAND[cellState(pct)] }} />
                    </span>
                    <span style={{ fontFamily: F_UI, fontSize: 12, color: C.mist, width: 74, textAlign: "right" }}>{pct}% · {w.attempts}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button style={btnP} onClick={() => { setSwMode("weak"); setSwN(5); setSwMade(null); setTab("setwork"); }}>Set these as homework</button>
          <button style={btnS} onClick={startLesson}>Lesson starter</button>
          {activeClassId !== "all" && <button style={{ ...btnS, borderColor: C.coral, color: C.coral }} onClick={() => delClass(classes.find((c) => c.id === activeClassId))}>Delete class</button>}
        </div>
      </div>
    );
  }

  // ---------- Mistakes tab ----------
  function renderMistakes() {
    const unitOpts = Object.keys(unitNames).sort((a, b) => Number(a) - Number(b));
    return (
      <div style={{ ...card, display: "flex", flexDirection: "column", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <strong style={{ fontFamily: F_UI, color: C.foam }}>Most common wrong ideas</strong>
          <select value={mistUnit} onChange={(e) => setMistUnit(e.target.value)}
            style={{ fontFamily: F_UI, fontSize: 13, padding: "6px 8px", borderRadius: 8, border: `1px solid ${C.line}`, background: light ? C.raise : C.shelf, color: C.foam }}>
            <option value="all">All units</option>
            {unitOpts.map((u) => <option key={u} value={u}>Unit {u}</option>)}
          </select>
        </div>
        {mistakes.length === 0 ? <p style={hint}>No shared wrong answers yet. These appear once students send reports with wrong answers.</p> : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {mistakes.slice(0, 25).map((m, i) => <MistakeRow key={i} m={m} C={C} light={light} F_UI={F_UI} />)}
          </div>
        )}
      </div>
    );
  }

  // ---------- Writing tab ----------
  function renderWriting() {
    const { questions, missedPoints } = writing;
    return (
      <div style={{ ...card, display: "flex", flexDirection: "column", gap: 16 }}>
        <div>
          <strong style={{ fontFamily: F_UI, color: C.foam }}>Writing practice</strong>
          {questions.length === 0 ? <p style={hint}>No writing answers in these reports yet.</p> : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, marginTop: 8 }}>
              {questions.map((q) => (
                <div key={q.qid} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontFamily: F_UI, fontSize: 13, color: C.foam, flex: 1 }}>{q.command ? `${q.command}: ` : ""}{q.q}</span>
                  <span style={{ fontFamily: F_UI, fontSize: 12, color: C.mist, whiteSpace: "nowrap" }}>avg {q.avgScore.toFixed(1)}/{q.marks} · {q.attempts} tried</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {missedPoints.length > 0 && (
          <div>
            <strong style={{ fontFamily: F_UI, color: C.foam }}>Marking points missed most</strong>
            <ul style={{ ...hint, marginTop: 8, paddingLeft: 18, display: "flex", flexDirection: "column", gap: 4 }}>
              {missedPoints.slice(0, 10).map((p, i) => (
                <li key={i}><span style={{ color: C.foam }}>{p.text}</span> — missed by {p.missed} of {p.attempts}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  // ---------- Set work tab (build an assignment + collect results) ----------
  function makeAssignment() {
    const pool = Object.values(itemById);
    const activeClass = activeClassId === "all" ? null : classes.find((c) => c.id === activeClassId);
    let opts = { count: swCount, seed: Date.now() & 0xffff };
    if (swMode === "weak") {
      opts.topicIds = weakest.slice(0, Math.max(1, swN)).map((w) => w.topicId);
      if (!opts.topicIds.length) { flash("Not enough class data to pick weakest topics — choose by unit instead."); return; }
    } else {
      opts.unitIds = [...swUnits];
      if (!opts.unitIds.length) { flash("Pick at least one unit."); return; }
    }
    const ids = pickAssignmentItems(pool, opts);
    if (!ids.length) { flash("No questions matched — widen the selection."); return; }
    const assignment = buildAssignment({ title: swTitle || "Marine science homework", due: swDue, classCode: activeClass ? activeClass.code : "", itemIds: ids });
    encodeAssignment(assignment).then((code) => {
      const url = assignmentUrl(code);
      setSwMade({ assignment, code, url, svg: qrSvg(url) });
    }).catch(() => flash("Couldn't build the assignment link."));
  }
  async function copyAssignmentLink() {
    if (!swMade) return;
    try { await navigator.clipboard.writeText(swMade.url); flash("Assignment link copied."); }
    catch { flash("Select and copy the link."); }
  }
  async function readResults() {
    const lines = swResultsText.split(/[\r\n]+/).map((s) => s.trim()).filter(Boolean);
    const out = [];
    for (const line of lines) {
      try {
        const parsed = readHash(line) || { code: line };
        out.push(await decodeResult(parsed.code || line));
      } catch { /* skip bad line */ }
    }
    if (!out.length) { flash("No results could be read."); return; }
    setSwResults(out);
    flash(`Read ${out.length} result${out.length === 1 ? "" : "s"}.`);
  }

  function renderSetWork() {
    const unitIds = Object.keys(unitNames).sort((a, b) => Number(a) - Number(b));
    // group collected results by assignment id
    const byAid = {};
    for (const r of swResults) (byAid[r.aid] ||= []).push(r);
    const radio = (checked) => ({ width: 18, height: 18, accentColor: light ? C.accent : C.glow });
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        <div style={{ ...card, display: "flex", flexDirection: "column", gap: 12 }}>
          <strong style={{ fontFamily: F_UI, color: C.foam }}>Build an assignment</strong>
          <input value={swTitle} onChange={(e) => setSwTitle(e.target.value)} placeholder="Title (e.g. Tides homework)" maxLength={80}
            style={{ fontFamily: F_UI, fontSize: 14, padding: "9px 11px", borderRadius: 10, border: `1px solid ${C.line}`, background: light ? C.raise : C.shelf, color: C.foam }} />
          <label style={{ ...hint, display: "flex", alignItems: "center", gap: 8 }}>Due (optional)
            <input type="date" value={swDue} onChange={(e) => setSwDue(e.target.value)}
              style={{ fontFamily: F_UI, fontSize: 14, padding: "7px 9px", borderRadius: 8, border: `1px solid ${C.line}`, background: light ? C.raise : C.shelf, color: C.foam }} /></label>

          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label style={{ ...hint, display: "flex", alignItems: "center", gap: 8, color: C.foam }}>
              <input type="radio" name="swmode" checked={swMode === "weak"} onChange={() => setSwMode("weak")} style={radio()} />
              Class weakest topics
              {swMode === "weak" && <input type="number" min={1} max={12} value={swN} onChange={(e) => setSwN(Number(e.target.value) || 1)} style={{ width: 56, marginLeft: 6, fontFamily: F_UI, padding: "4px 6px", borderRadius: 8, border: `1px solid ${C.line}`, background: light ? C.raise : C.shelf, color: C.foam }} />}
            </label>
            <label style={{ ...hint, display: "flex", alignItems: "center", gap: 8, color: C.foam }}>
              <input type="radio" name="swmode" checked={swMode === "unit"} onChange={() => setSwMode("unit")} style={radio()} />
              By unit
            </label>
            {swMode === "unit" && (
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginLeft: 26 }}>
                {unitIds.map((u) => (
                  <label key={u} style={{ ...btnS, display: "inline-flex", alignItems: "center", gap: 6, background: swUnits.has(u) ? (light ? C.accent : C.glow) : (light ? C.raise : C.shelf), color: swUnits.has(u) ? (light ? "#fff" : C.abyss) : C.foam, border: swUnits.has(u) ? "none" : `1px solid ${C.line}` }}>
                    <input type="checkbox" checked={swUnits.has(u)} onChange={() => setSwUnits((s) => { const n = new Set(s); n.has(u) ? n.delete(u) : n.add(u); return n; })} style={{ display: "none" }} />
                    U{u}
                  </label>
                ))}
              </div>
            )}
          </div>

          <label style={{ ...hint, display: "flex", alignItems: "center", gap: 10, color: C.foam }}>
            Questions: <strong style={{ color: C.foam }}>{swCount}</strong>
            <input type="range" min={5} max={25} value={swCount} onChange={(e) => setSwCount(Number(e.target.value))} style={{ flex: 1, accentColor: light ? C.accent : C.glow }} />
          </label>

          <div><button style={btnP} onClick={makeAssignment}>Make assignment</button></div>

          {swMade && (
            <div style={{ ...card, display: "flex", flexDirection: "column", alignItems: "center", gap: 10, background: light ? C.raise : C.shelf }}>
              <div style={{ fontFamily: F_UI, fontWeight: 800, color: C.foam, textAlign: "center" }}>{swMade.assignment.t}</div>
              <div style={hint}>{swMade.assignment.n} questions{swMade.assignment.due ? ` · due ${swMade.assignment.due}` : ""}{swMade.assignment.cls ? ` · ${swMade.assignment.cls}` : ""}</div>
              <div style={{ width: 180, height: 180, background: "#fff", borderRadius: 10, padding: 8, boxSizing: "border-box" }} dangerouslySetInnerHTML={{ __html: swMade.svg }} />
              <div style={{ display: "flex", gap: 8 }}>
                <button style={btnS} onClick={copyAssignmentLink}>Copy link</button>
              </div>
              <div style={hint}>Share this link or QR in Google Classroom, Teams or email.</div>
            </div>
          )}
        </div>

        {/* collect results */}
        <div style={{ ...card, display: "flex", flexDirection: "column", gap: 10 }}>
          <strong style={{ fontFamily: F_UI, color: C.foam }}>Collect results</strong>
          <p style={hint}>Paste the result codes or links students send back, one per line.</p>
          <textarea value={swResultsText} onChange={(e) => setSwResultsText(e.target.value)} rows={3}
            placeholder={"WR1.… or https://app.wildcateducation.co.uk/#x=WR1.…"}
            style={{ fontFamily: "monospace", fontSize: 12.5, width: "100%", boxSizing: "border-box", padding: 10, borderRadius: 10, border: `1px solid ${C.line}`, background: light ? C.raise : C.shelf, color: C.foam }} />
          <div><button style={btnP} onClick={readResults} disabled={!swResultsText.trim()}>Read results</button></div>

          {Object.entries(byAid).map(([aid, list]) => {
            const agg = aggregateResults(list, itemById);
            return (
              <div key={aid} style={{ marginTop: 8 }}>
                <div style={{ fontFamily: F_UI, fontWeight: 700, color: C.foam, marginBottom: 6 }}>Assignment {aid} · {list.length} returned</div>
                <div style={{ overflowX: "auto" }}>
                  <table style={{ borderCollapse: "collapse", width: "100%" }}>
                    <thead><tr><th style={{ ...th, textAlign: "left" }}>Student</th><th style={th}>Score</th><th style={th}>%</th><th style={th}>Done</th></tr></thead>
                    <tbody>
                      {agg.students.map((s) => (
                        <tr key={s.name}><td style={{ ...nameTd, position: "static" }}>{s.name}</td><td style={th}>{s.correct}/{s.total}</td><td style={th}>{s.pct}%</td><td style={{ ...th, fontWeight: 600 }}>{(s.d || "").slice(0, 10)}</td></tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {agg.questions.filter((q) => q.wrong > 0).length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ ...hint, color: C.foam, fontWeight: 700 }}>Most got wrong</div>
                    <ul style={{ ...hint, paddingLeft: 18, marginTop: 4 }}>
                      {agg.questions.filter((q) => q.wrong > 0).slice(0, 6).map((q) => (
                        <li key={q.itemId}>{(q.stem || q.itemId).slice(0, 80)} — {q.wrong}/{q.total} wrong{q.picks[0] && q.picks[0].text ? ` · most chose “${q.picks[0].text}”` : ""}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ---------- Lesson starter ----------
  function startLesson() {
    const items = lessonStarterItems(activeStudents, itemById, topicMeta, { n: 5, seed: 1 });
    if (!items.length) { flash("Not enough data for a lesson starter yet."); return; }
    setLesson({ items, i: 0, revealed: false });
  }
  function renderLesson() {
    const it = lesson.items[lesson.i];
    const correct = it.options && typeof it.a === "number" ? it.options[it.a] : null;
    return (
      <div role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, background: C.abyss, zIndex: 50, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, textAlign: "center" }}>
        <div style={{ fontFamily: F_UI, fontSize: 13, color: C.glow, marginBottom: 12 }}>Lesson starter · {lesson.i + 1} of {lesson.items.length}</div>
        <div style={{ fontFamily: F_D, fontSize: "clamp(22px, 4vw, 40px)", fontWeight: 800, color: C.foam, maxWidth: 900, lineHeight: 1.3 }}>{it.qRecall || it.q}</div>
        {lesson.revealed && (
          <div style={{ marginTop: 24, maxWidth: 820 }}>
            {correct && <div style={{ fontFamily: F_D, fontSize: "clamp(18px,3vw,30px)", fontWeight: 800, color: C.glow }}>{correct}</div>}
            {it.why && <p style={{ fontFamily: F_UI, fontSize: "clamp(14px,2vw,18px)", color: C.mist, marginTop: 12, lineHeight: 1.6 }}>{it.why}</p>}
          </div>
        )}
        <div style={{ display: "flex", gap: 10, marginTop: 32 }}>
          {!lesson.revealed
            ? <button style={{ ...btnP, fontSize: 18, padding: "14px 24px" }} onClick={() => setLesson((l) => ({ ...l, revealed: true }))}>Reveal answer</button>
            : (lesson.i < lesson.items.length - 1
                ? <button style={{ ...btnP, fontSize: 18, padding: "14px 24px" }} onClick={() => setLesson((l) => ({ ...l, i: l.i + 1, revealed: false }))}>Next ›</button>
                : <button style={{ ...btnP, fontSize: 18, padding: "14px 24px" }} onClick={() => setLesson(null)}>Done</button>)}
          <button style={{ ...btnS, fontSize: 16, padding: "14px 20px" }} onClick={() => setLesson(null)}>Close</button>
        </div>
      </div>
    );
  }

  // ---------- Print ----------
  function doPrint() {
    const el = document.getElementById("teacher-print");
    if (el) el.innerHTML = buildPrintHtml();
    window.print();
  }
  function buildPrintHtml() {
    const esc = (s) => String(s == null ? "" : s).replace(/[&<>]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));
    const unitIds = hm.units;
    let html = `<h1>Class report — ${esc(activeClassId === "all" ? "All classes" : (classes.find((c) => c.id === activeClassId)?.name || ""))}</h1>`;
    html += `<p class="tp-date">Generated ${new Date().toISOString().slice(0, 10)} · ${activeStudents.length} students · on this device only</p>`;
    // class summary: weakest topics
    html += `<h2>Weakest topics</h2><ol>`;
    for (const w of weakest.slice(0, 10)) html += `<li>${esc(w.name)} — ${Math.round(w.accuracy * 100)}% (${w.attempts} answers)</li>`;
    html += `</ol>`;
    // per student
    for (const s of activeStudents) {
      html += `<div class="tp-student"><h2>${esc(s.name)}</h2><p class="tp-date">${esc(s.classCode || "")} · updated ${esc((s.report?.d || "").slice(0, 10))}</p>`;
      html += `<table><tr><th>Unit</th>${unitIds.map((u) => `<th>U${u}</th>`).join("")}</tr><tr><td>% correct</td>`;
      for (const u of unitIds) {
        const c = (s.report?.u || {})[u];
        html += `<td>${c && c[0] ? Math.round((c[2] / c[0]) * 100) + "%" : "–"}</td>`;
      }
      html += `</tr></table>`;
      const sw = classWeakestTopics([s], topicMeta, { minAttempts: 1 }).slice(0, 5);
      if (sw.length) html += `<p><strong>Work on:</strong> ${sw.map((w) => esc(w.name) + " (" + Math.round(w.accuracy * 100) + "%)").join(", ")}</p>`;
      const wrong = (s.report?.mp || []).map(([id, pick]) => {
        const item = itemById[id]; if (!item) return null;
        const opt = Array.isArray(pick) ? pick.map((i) => (item.options || [])[i]).filter(Boolean).join(" + ") : (item.options || [])[pick];
        return opt ? `${esc((item.q || "").slice(0, 70))} → chose “${esc(opt)}”` : null;
      }).filter(Boolean).slice(0, 8);
      if (wrong.length) html += `<p><strong>Recent wrong ideas:</strong></p><ul>${wrong.map((w) => `<li>${w}</li>`).join("")}</ul>`;
      const wr = Object.entries(s.report?.w || {});
      if (wr.length) html += `<p><strong>Writing:</strong> ${wr.map(([qid, v]) => esc(qid) + " " + v[0] + "/" + v[1]).join(", ")}</p>`;
      html += `</div>`;
    }
    return html;
  }
}

// ---- a misconception row with a collapsible "why" ----
function MistakeRow({ m, C, light, F_UI }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderLeft: `3px solid ${BAND.red}`, paddingLeft: 10 }}>
      <div style={{ fontFamily: F_UI, fontSize: 13.5, color: C.foam, fontWeight: 600 }}>{(m.stem || "").slice(0, 110)}{(m.stem || "").length > 110 ? "…" : ""}</div>
      <div style={{ fontFamily: F_UI, fontSize: 13, color: C.coral, marginTop: 2 }}>✗ “{m.optionText}”</div>
      <div style={{ fontFamily: F_UI, fontSize: 12, color: C.mist, marginTop: 2 }}>
        {m.n} of {m.total} students chose this
        {m.why && <> · <button onClick={() => setOpen((v) => !v)} style={{ background: "none", border: "none", color: light ? C.accent : C.glow, cursor: "pointer", fontSize: 12, fontWeight: 700, padding: 0 }}>{open ? "hide why" : "why"}</button></>}
      </div>
      {open && m.why && <div style={{ fontFamily: F_UI, fontSize: 12.5, color: C.mist, marginTop: 4, lineHeight: 1.5 }}>{m.why}</div>}
    </div>
  );
}

// ---- QR scanner modal (BarcodeDetector + camera) ----
function QrScanner({ C, onCode, onClose, fontUi }) {
  const videoRef = useRef(null);
  const [err, setErr] = useState("");
  useEffect(() => {
    let stream = null;
    let raf = null;
    let stopped = false;
    (async () => {
      try {
        const Detector = window.BarcodeDetector;
        const det = new Detector({ formats: ["qr_code"] });
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        if (stopped) { stream.getTracks().forEach((t) => t.stop()); return; }
        const v = videoRef.current;
        v.srcObject = stream; await v.play();
        const tick = async () => {
          if (stopped) return;
          try {
            const codes = await det.detect(v);
            if (codes && codes.length) { onCode(codes[0].rawValue); return; }
          } catch {}
          raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      } catch (e) {
        setErr("Couldn't open the camera. You can paste the code instead.");
      }
    })();
    return () => { stopped = true; if (raf) cancelAnimationFrame(raf); if (stream) stream.getTracks().forEach((t) => t.stop()); };
  }, []);
  return (
    <div role="dialog" aria-modal="true" style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,.85)", zIndex: 60, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <video ref={videoRef} playsInline muted style={{ width: "min(90vw,420px)", borderRadius: 12, background: "#000" }} />
      {err && <p style={{ fontFamily: fontUi, color: "#fff", marginTop: 12 }}>{err}</p>}
      <button onClick={onClose} style={{ fontFamily: fontUi, fontWeight: 800, marginTop: 16, padding: "12px 20px", borderRadius: 10, border: "none", background: C.glow, color: C.abyss, cursor: "pointer" }}>Close</button>
    </div>
  );
}
