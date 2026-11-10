import React, { useEffect, useRef, useState } from "react";
import { FIG_GROUPS, FIG_TEMPLATES, templateByKey, FIG_TEMPLATE_CSS } from "./index.js";
import { makeRun, figOpt, gradeFigQuestion, answerText, shuffleR } from "./core.js";
import { applyTap, orderAdd, orderRemove } from "./interactions.js";
import { panelIndexAt, clampToPlot, guideLayerSVG, guideReadSVG, centreOf, answeringEnabled } from "./guide.js";
import "./figdata.css";

/* smallest grid step along an axis (labelled ticks for a "large" step), for keyboard nudging. */
function gridStep(ticks, big) {
  if (!ticks || ticks.length < 2) return 0;
  const arr = (big ? ticks.filter((t) => t.label != null) : ticks).map((t) => t.at).sort((a, b) => a - b);
  let m = Infinity; for (let k = 1; k < arr.length; k++) m = Math.min(m, Math.abs(arr[k] - arr[k - 1]));
  return isFinite(m) ? m : 0;
}
const figAxes = (t, F) => { try { return t.axes ? t.axes(F) || null : null; } catch { return null; } };

/* Figures & data — practice section. A React port of the EnviroReady 0680
   figs-engine.js: every practice draws a fresh figure from seeded data and asks
   5–7 auto-marked questions (type a number, choose, tick, tap the figure, order
   chips, plot a point). Practice only — it does not feed the scheduler, mastery,
   readiness or Ocean Discoveries. Stats {best, of, runs} per template are saved
   on Finish via onFinish(key, score, of). The figure itself is drawn imperatively
   into a ref (as the DOM engine does) so tap/plot/order wiring and scrollLeft are
   preserved across redraws; the shell is ordinary React. */

// Palette → CSS custom properties, matching preview/marine-figures-preview.html.
function figVars(C, light) {
  return {
    "--ink": C.foam,
    "--soft": C.mist,
    "--mut": light ? C.line : "#7fa8b6",
    "--line": light ? "#9fb8c1" : C.line,
    "--surface": light ? C.raise : C.shelf,
    "--surface2": light ? C.raise : C.shelf,
    "--app": C.amber,
    "--accent": C.coral,
    "--ok": C.ok,
    "--no": C.no,
    "--recall": light ? C.accent : C.glow,
  };
}

// Display order for choice options / order chips. For `order`, never show the
// chips already in the answer sequence (engine rule): re-shuffle if they land
// in answer order.
function shuffleForDisplay(q) {
  const id = q.options.map((_, k) => k);
  let o = shuffleR(Math.random, id);
  for (let n = 0; n < 20 && q.kind === "order" && o.every((k, i) => k === q.a[i]); n++) o = shuffleR(Math.random, id);
  return o;
}

const nudgeMsg = (q) =>
  q.kind === "num" ? "Type a number, then press Check."
    : q.kind === "choice" ? "Choose an answer, then press Check."
    : q.kind === "multi" ? "Tick at least one statement, then press Check."
    : q.kind === "order" ? `Put all ${q.a.length} items in order, then press Check.`
    : q.kind === "tap" ? "Tap the figure to choose your answer first."
    : "Tap the figure to plot your answer first.";

export default function FiguresPractice({ C, theme, figData = {}, onBack, onFinish, fontUi, fontDisplay }) {
  const light = theme === "light";
  const F_UI = fontUi || "inherit";
  const F_D = fontDisplay || fontUi || "inherit";

  const [screen, setScreen] = useState("list"); // "list" | "q" | "end"
  const [run, setRun] = useState(null);          // { key, t, F, qs, seed }
  const [i, setI] = useState(0);
  const [score, setScore] = useState(0);
  const [stopped, setStopped] = useState(false);

  // per-question working state
  const [state, setState] = useState(null);      // tap ids[] | order idx[] | plot state | null
  const [numVal, setNumVal] = useState("");
  const [choiceVal, setChoiceVal] = useState(null);
  const [multiSet, setMultiSet] = useState([]);
  const [ord, setOrd] = useState(null);          // display order for choice / order pool
  const [checked, setChecked] = useState(false);
  const [ok, setOk] = useState(false);
  const [nudge, setNudge] = useState("");
  const [zoom, setZoom] = useState(false);
  const [guide, setGuide] = useState(false);     // reading-guide toggle (off for every new question)

  const figWrapRef = useRef(null);
  const checkedRef = useRef(false);
  checkedRef.current = checked;
  const guidePtRef = useRef(null);               // the ✕ position {pi, x, y}; kept while toggling within a question
  const guideUsedRef = useRef(false);            // has the guide been turned on this session (controls the first-question tip)

  // ---- style helpers (match the app's inline-styled surfaces) ----
  const cardBg = light ? "#FFFFFF" : C.deep;
  const panel = { background: cardBg, border: `1px solid ${C.line}`, borderRadius: 16, padding: 16 };
  const btnP = { fontFamily: F_UI, fontWeight: 800, fontSize: 15, padding: "11px 18px", borderRadius: 11, border: "none", background: light ? C.accent : C.glow, color: light ? "#fff" : C.abyss, cursor: "pointer" };
  const btnS = { fontFamily: F_UI, fontWeight: 700, fontSize: 14.5, padding: "11px 16px", borderRadius: 11, border: `1px solid ${C.line}`, background: light ? C.raise : C.shelf, color: C.foam, cursor: "pointer" };
  const linkBtn = { fontFamily: F_UI, fontWeight: 700, fontSize: 14, background: "none", border: "none", color: light ? C.accent : C.glow, cursor: "pointer", padding: "4px 0" };

  // ---- run lifecycle ----
  function resetForQuestion(q) {
    setState(q.kind === "plot" ? null : (q.kind === "tap" || q.kind === "order") ? [] : null);
    setNumVal(""); setChoiceVal(null); setMultiSet([]);
    setOrd(q.kind === "choice" || q.kind === "order" ? shuffleForDisplay(q) : null);
    setChecked(false); setOk(false); setNudge("");
    setGuide(false); guidePtRef.current = null;    // guide resets to off on each new question
  }
  function startFig(key) {
    const t = templateByKey(key);
    const seed = (Date.now() ^ Math.floor(Math.random() * 1e9)) >>> 0;
    const r = makeRun(t, seed);
    setRun({ key, t, F: r.F, qs: r.qs, seed });
    setI(0); setScore(0); setStopped(false);
    setZoom(!!t.zoomDefault && typeof window !== "undefined" && window.innerWidth < 600);
    resetForQuestion(r.qs[0]);
    setScreen("q");
  }
  function finishNatural() {
    if (onFinish && run) onFinish(run.key, score, run.qs.length);
    setStopped(false); setScreen("end");
  }
  function stop() { setStopped(true); setScreen("end"); }
  function next() {
    if (i >= run.qs.length - 1) { finishNatural(); return; }
    const ni = i + 1; setI(ni); resetForQuestion(run.qs[ni]);
  }

  // ---- checking ----
  function check() {
    const q = run.qs[i];
    const answer = q.kind === "num" ? numVal
      : q.kind === "choice" ? choiceVal
      : q.kind === "multi" ? multiSet
      : state; // tap / order / plot
    const g = gradeFigQuestion(q, answer);
    if (!g.attempted) { setNudge(nudgeMsg(q)); return; }
    setNudge(""); setOk(g.ok); setChecked(true);
    if (g.ok) setScore((s) => s + 1);
  }

  // ---- imperative figure draw + interaction wiring (preserves scrollLeft) ----
  useEffect(() => {
    if (screen !== "q" || !run) return;
    const w = figWrapRef.current; if (!w) return;
    const q = run.qs[i];
    const phase = checked ? "done" : "ask";
    const sl = w.scrollLeft;
    const st = w.scrollTop;
    const opt = figOpt(q, phase, state, ok);
    const note = phase === "done" && q.doneNote && q.doneNote(state, ok);
    w.innerHTML = run.t.svg(run.F, opt) + (note ? `<p class="plothint">${note}</p>` : "");
    w.scrollLeft = sl; w.scrollTop = st;

    // ---- reading guide (the ✕ with guide lines and mini axis scales) ----
    const svgEl = w.querySelector("svg.figsvg");
    const panels = figAxes(run.t, run.F);
    const hasGuide = !!(panels && panels.length);
    // after Check: show the correct reading in amber (for num / plot questions that provide hl.guide)
    if (phase === "done" && hasGuide && svgEl && opt.hl && opt.hl.guide) {
      const gp = opt.hl.guide, pi = panelIndexAt(panels, gp.x, gp.y);
      svgEl.insertAdjacentHTML("beforeend", guideReadSVG(panels[pi >= 0 ? pi : 0], gp.x, gp.y));
    }
    const guideOn = phase === "ask" && guide && hasGuide && svgEl;
    if (guideOn) {
      const vbb = svgEl.viewBox.baseVal, vb = { w: vbb.width, h: vbb.height };
      svgEl.classList.add("guiding"); svgEl.setAttribute("tabindex", "0");
      const toPt = (e) => {
        const ctm = svgEl.getScreenCTM(); if (!ctm) return null;
        const p = svgEl.createSVGPoint(); p.x = e.clientX; p.y = e.clientY;
        const u = p.matrixTransform(ctm.inverse()), pi = panelIndexAt(panels, u.x, u.y);
        if (pi < 0) return null;
        const c = clampToPlot(panels[pi].plot, u.x, u.y);
        return { pi, x: c.x, y: c.y };
      };
      const draw = () => {
        const old = svgEl.querySelector(".figguide"); if (old) old.remove();
        let pt = guidePtRef.current;
        if (!pt || !panels[pt.pi]) { const c = centreOf(panels[0]); pt = { pi: 0, x: c.x, y: c.y }; guidePtRef.current = pt; }
        svgEl.insertAdjacentHTML("beforeend", guideLayerSVG(panels[pt.pi], pt.x, pt.y, vb));
      };
      draw();
      let dragging = false;
      svgEl.onpointerdown = (e) => { const pt = toPt(e); if (!pt) return; guidePtRef.current = pt; dragging = true; draw(); try { svgEl.setPointerCapture(e.pointerId); } catch { /* */ } e.preventDefault(); };
      svgEl.onpointermove = (e) => { if (!dragging) return; const pt = toPt(e); if (pt) { guidePtRef.current = pt; draw(); } };
      svgEl.onpointerup = svgEl.onpointercancel = () => { dragging = false; };
      svgEl.onkeydown = (e) => {
        const dirs = { ArrowLeft: [-1, 0], ArrowRight: [1, 0], ArrowUp: [0, -1], ArrowDown: [0, 1] }, d = dirs[e.key];
        if (!d) return; e.preventDefault();
        let pt = guidePtRef.current; if (!pt || !panels[pt.pi]) { const c = centreOf(panels[0]); pt = { pi: 0, x: c.x, y: c.y }; }
        const panel = panels[pt.pi], sx = gridStep(panel.x && panel.x.ticks, e.shiftKey), sy = gridStep(panel.y && panel.y.ticks, e.shiftKey);
        const c = clampToPlot(panel.plot, pt.x + d[0] * sx, pt.y + d[1] * sy);
        guidePtRef.current = { pi: pt.pi, x: c.x, y: c.y }; draw();
      };
    }

    // while the guide is on, taps/plots do not answer; normal answering is wired only with the guide off
    if (answeringEnabled(phase, guideOn)) {
      if (q.kind === "plot") {
        const hit = w.querySelector(".plothit");
        if (hit) hit.onclick = (e) => {
          if (checkedRef.current) return;
          const svg = hit.ownerSVGElement, pt = svg.createSVGPoint();
          pt.x = e.clientX; pt.y = e.clientY;
          const p = pt.matrixTransform(svg.getScreenCTM().inverse());
          const s = q.plot.fromTap(p, hit.dataset, hit);
          if (s != null) setState(s);
        };
      } else if (q.kind === "tap") {
        w.querySelectorAll("[data-tap]").forEach((el) => {
          el.classList.add("tapel");
          el.classList.toggle("sel", (state || []).includes(el.dataset.tap));
          el.onclick = () => { if (checkedRef.current) return; setState((s) => applyTap(s, el.dataset.tap, q.multi)); };
        });
      }
    } else if (phase === "done" && q.kind === "tap") {
      w.querySelectorAll("[data-tap]").forEach((el) => {
        const id = el.dataset.tap, isA = q.a.map(String).includes(id), was = (state || []).includes(id);
        el.classList.add("tapel", isA ? (was ? "tapok" : "tapmiss") : was ? "tapno" : "tapoff");
      });
    }
  }, [screen, i, checked, ok, state, run, guide]);

  // Scroll the zoomed figure so the reading guide's ✕ sits in the middle of the
  // view (otherwise zoom starts top-left, away from where the student is reading).
  function centerCrossInView() {
    const w = figWrapRef.current; if (!w) return;
    const pt = guidePtRef.current; if (!pt || pt.x == null) return; // only when a ✕ is placed
    const svgEl = w.querySelector("svg.figsvg");
    if (!svgEl || !svgEl.viewBox || !svgEl.viewBox.baseVal) return;
    const vb = svgEl.viewBox.baseVal, r = svgEl.getBoundingClientRect();
    if (!r.width || !r.height || !vb.width || !vb.height) return;
    const fx = (pt.x - vb.x) / vb.width, fy = (pt.y - vb.y) / vb.height;
    const maxL = Math.max(0, r.width - w.clientWidth), maxT = Math.max(0, r.height - w.clientHeight);
    w.scrollLeft = Math.max(0, Math.min(maxL, fx * r.width - w.clientWidth / 2));
    w.scrollTop = Math.max(0, Math.min(maxT, fy * r.height - w.clientHeight / 2));
  }
  // Toggle Zoom; when turning it on with the ✕ placed, centre the view on it once
  // the .zoom class has resized the figure. A timeout (not rAF) so it still runs
  // in a backgrounded WebView; 0 is after React commits the class, 60 is a retry
  // in case layout for the 200% width settles a frame later.
  function toggleZoom() {
    const next = !zoom;
    setZoom(next);
    if (next && guide) { setTimeout(centerCrossInView, 0); setTimeout(centerCrossInView, 60); }
  }

  // ================= list =================
  if (screen === "list") {
    return (
      <div className="figroot" style={{ ...figVars(C, light), fontFamily: F_UI, color: C.foam }}>
        <style>{FIG_TEMPLATE_CSS}</style>
        <button onClick={onBack} style={linkBtn}>‹ Library</button>
        <p style={{ fontFamily: F_UI, fontSize: 11, fontWeight: 800, letterSpacing: 0.6, color: light ? C.accent : C.glow, margin: "8px 0 2px" }}>FIGURES &amp; DATA · PRACTICE</p>
        <h1 style={{ fontFamily: F_D, fontSize: 26, fontWeight: 600, color: C.foam, margin: "0 0 4px" }}>Graphs, tables &amp; maps</h1>
        <p style={{ color: C.mist, lineHeight: 1.5, margin: "0 0 16px" }}>Every practice uses new numbers, so you learn the skill rather than the answers.</p>
        {FIG_GROUPS.map((g) => {
          const ts = FIG_TEMPLATES.filter((t) => (t.group || FIG_GROUPS[0]) === g);
          if (!ts.length) return null;
          return (
            <div key={g}>
              <h3 style={{ fontSize: 13, color: C.mist, textTransform: "uppercase", letterSpacing: 0.7, margin: "20px 4px 8px", fontWeight: 800 }}>{g}</h3>
              <div style={{ display: "grid", gap: 12 }}>
                {ts.map((t) => {
                  const s = figData[t.key];
                  let thumb = "";
                  try { thumb = t.svg(t.make(t.thumbSeed || 7), { thumb: true }); } catch { thumb = ""; }
                  return (
                    <div key={t.key} style={panel}>
                      <div className="figthumb" style={{ marginBottom: 12 }} dangerouslySetInnerHTML={{ __html: thumb }} />
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                        <h3 style={{ fontFamily: F_D, margin: 0, fontSize: 18, fontWeight: 600, color: C.foam }}>{t.name}</h3>
                        <span style={{ fontSize: 12.5, color: C.amber, fontWeight: 700 }}>{t.topics}{s ? ` · best ${s.best}/${s.of}` : ""}</span>
                      </div>
                      <p style={{ margin: "6px 0 8px", color: C.mist, lineHeight: 1.45 }}>{t.blurb}</p>
                      <details style={{ fontSize: 14, marginBottom: 12 }}>
                        <summary style={{ cursor: "pointer", fontWeight: 700, color: C.foam }}>How to read it</summary>
                        <ul style={{ margin: "8px 0 0", paddingLeft: 18, lineHeight: 1.5, color: C.foam }}>
                          {t.tips.map((x, k) => <li key={k} style={{ marginBottom: 4 }} dangerouslySetInnerHTML={{ __html: x }} />)}
                        </ul>
                      </details>
                      <button onClick={() => startFig(t.key)} style={{ ...btnP, width: "100%" }}>Practise with new data ▸</button>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <p style={{ color: light ? C.line : "#7fa8b6", fontSize: 13, textAlign: "center", margin: "14px 8px 4px" }}>All data is made up for practice, so every run is different. The figure styles follow the exam papers.</p>
      </div>
    );
  }

  // ================= end =================
  if (screen === "end") {
    const answered = stopped ? i + (checked ? 1 : 0) : run.qs.length;
    return (
      <div className="figroot" style={{ ...figVars(C, light), fontFamily: F_UI, color: C.foam }}>
        <style>{FIG_TEMPLATE_CSS}</style>
        <div style={{ ...panel, textAlign: "center", padding: 26 }}>
          <div style={{ fontSize: 40, marginBottom: 4 }}>📊</div>
          <h2 style={{ fontFamily: F_D, margin: "4px 0 2px", fontSize: 22, color: C.foam }}>{stopped ? "Stopped for now" : `${run.t.name} done`}</h2>
          <div style={{ color: C.mist, marginBottom: 6 }}>{score} of {answered} correct{stopped ? "" : " on this figure"}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
            <button onClick={() => startFig(run.key)} style={btnP}>New {run.t.name.toLowerCase()} ▸</button>
            <button onClick={() => setScreen("list")} style={btnS}>All figure types</button>
            <button onClick={onBack} style={btnS}>Back to home</button>
          </div>
        </div>
      </div>
    );
  }

  // ================= question =================
  const q = run.qs[i];
  const total = run.qs.length;
  const showHint = q.kind === "plot" || q.kind === "tap";
  const plotHint = q.kind === "plot"
    ? (state ? `${q.plot.label(state)} Tap again${q.plot.nudges ? " or use the buttons" : ""} to adjust it.` : (q.plot.hint || "Tap the figure to plot your answer."))
    : (state && state.length ? `Selected: ${state.map((id) => (q.labelOf ? q.labelOf(id) : id)).join(", ")}. Tap again to deselect.` : (q.hint || (q.multi ? "Tap every one that applies on the figure." : "Tap your answer on the figure.")));
  const ansTxt = answerText(q);
  const hasGuide = !checked && !!(figAxes(run.t, run.F) || {}).length;
  const pillBtn = { flex: "0 0 auto", fontFamily: F_UI, fontSize: 12.5, fontWeight: 800, padding: "6px 10px", borderRadius: 999, border: `1px solid ${guide ? (light ? C.accent : C.glow) : C.line}`, background: guide ? (light ? "#e6f6f3" : "#113a38") : (light ? C.raise : C.shelf), color: guide ? (light ? C.accent : C.glow) : C.foam, cursor: "pointer" };

  return (
    <div className="figroot" style={{ ...figVars(C, light), fontFamily: F_UI, color: C.foam }}>
      <style>{FIG_TEMPLATE_CSS}</style>
      {/* progress */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "4px 2px 14px" }}>
        <div style={{ flex: 1, height: 7, borderRadius: 999, background: light ? C.raise : C.shelf, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${Math.round(i / total * 100)}%`, background: light ? C.accent : C.glow, transition: "width .3s ease" }} />
        </div>
        <span style={{ fontSize: 13, color: C.mist, fontWeight: 700 }}>{i + 1} / {total} · {run.t.name}</span>
      </div>

      <div style={panel}>
        {/* caption + zoom */}
        <div style={{ fontSize: 12.5, color: C.mist, fontWeight: 700, marginBottom: 6, display: "flex", gap: 10, alignItems: "center", justifyContent: "space-between" }}>
          <span>Figure: {run.t.ctx ? run.t.ctx(run.F) : run.t.name}</span>
          <div style={{ display: "flex", gap: 6, flex: "0 0 auto" }}>
            {hasGuide && (
              <button onClick={() => { setGuide((g) => { if (!g) guideUsedRef.current = true; return !g; }); }} aria-pressed={guide} style={pillBtn}>📏 Guide</button>
            )}
            {!run.t.noZoom && (
              <button onClick={toggleZoom} aria-pressed={zoom}
                style={{ flex: "0 0 auto", fontFamily: F_UI, fontSize: 12.5, fontWeight: 800, padding: "6px 10px", borderRadius: 999, border: `1px solid ${C.line}`, background: light ? C.raise : C.shelf, color: C.foam, cursor: "pointer" }}>
                {zoom ? "⤡ Fit" : "⤢ Zoom"}
              </button>
            )}
          </div>
        </div>
        {/* figure (drawn imperatively) */}
        <div ref={figWrapRef} className={"figwrap" + (zoom && !run.t.noZoom ? " zoom" : "") + (run.t.html ? " html" : "")} />
        {hasGuide && (guide
          ? <p className="plothint">Guide on: tap or drag on the graph. Turn it off to answer by tapping.</p>
          : (!guideUsedRef.current && i === 0 ? <p className="plothint">Tip: turn on 📏 Guide to line up a point with both axes.</p> : null))}

        {/* stem */}
        <div style={{ fontSize: 17, fontWeight: 600, lineHeight: 1.4, marginBottom: 14 }} dangerouslySetInnerHTML={{ __html: q.q }} />

        {/* input per kind */}
        {q.kind === "num" && (
          <div className="numrow">
            <input type="text" inputMode="decimal" autoComplete="off" aria-label="Your answer"
              value={numVal} disabled={checked} onChange={(e) => setNumVal(e.target.value)} />
            <span className="unit">{q.unit || ""}</span>
          </div>
        )}

        {q.kind === "choice" && ord && (
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {ord.map((k) => {
              const isA = k === q.a, picked = choiceVal === k;
              const mark = checked ? (isA ? "ok" : picked ? "no" : "") : "";
              return (
                <label key={k} style={optStyle(C, light, mark)}>
                  <input type="radio" name="fq" checked={picked} disabled={checked} onChange={() => setChoiceVal(k)} style={{ marginTop: 3, accentColor: light ? C.accent : C.glow }} />
                  <span dangerouslySetInnerHTML={{ __html: q.options[k] }} />
                </label>
              );
            })}
          </div>
        )}

        {q.kind === "multi" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
            {q.options.map((o, k) => {
              const isA = q.a.includes(k), picked = multiSet.includes(k);
              const mark = checked ? (isA ? "ok" : picked ? "no" : "") : "";
              return (
                <label key={k} style={optStyle(C, light, mark)}>
                  <input type="checkbox" checked={picked} disabled={checked}
                    onChange={() => setMultiSet((s) => s.includes(k) ? s.filter((x) => x !== k) : s.concat(k))}
                    style={{ marginTop: 3, accentColor: light ? C.accent : C.glow }} />
                  <span dangerouslySetInnerHTML={{ __html: o }} />
                </label>
              );
            })}
          </div>
        )}

        {q.kind === "order" && ord && (
          <>
            <div className="ordlbl">Your order:</div>
            <div className="ordbuilt">
              {state && state.length
                ? state.map((k, n) => (
                    <button key={n} className={"ochip on" + (checked ? (state[n] === q.a[n] ? " good" : " bad") : "")} disabled={checked}
                      onClick={() => { if (!checked) setState((s) => orderRemove(s, n)); }}>
                      <b>{n + 1}</b> <span dangerouslySetInnerHTML={{ __html: q.options[k] }} />
                    </button>
                  ))
                : <span className="ordph">Tap the items below in order.</span>}
            </div>
            <div className="ordpool">
              {ord.map((k) => (
                <button key={k} className="ochip" hidden={(state || []).includes(k)} disabled={checked}
                  onClick={() => { if (!checked) setState((s) => orderAdd(s, k)); }}
                  dangerouslySetInnerHTML={{ __html: q.options[k] }} />
              ))}
            </div>
          </>
        )}

        {showHint && <p className="plothint">{plotHint}</p>}
        {q.kind === "plot" && q.plot.nudges && (
          <div className="plotnudge">
            {q.plot.nudges.map((n) => (
              <button key={n[0]} className="fignudge" aria-label={n[2] || n[1]} disabled={checked}
                onClick={() => { if (!checked) setState((s) => q.plot.nudge(s || q.plot.start, n[0])); }}>{n[1]}</button>
            ))}
          </div>
        )}

        {/* feedback */}
        {nudge && !checked && (
          <div style={fbStyle(C, light, false)}>
            <span style={{ fontWeight: 800, display: "block", marginBottom: 3, color: C.no }}>Have a go first</span>
            {nudge}
          </div>
        )}
        {checked && (
          <div style={fbStyle(C, light, ok)}>
            <span style={{ fontWeight: 800, display: "block", marginBottom: 3, color: ok ? C.ok : C.no }}>{ok ? "Correct ✓" : "Not quite"}</span>
            {!ok && ansTxt && (
              <div style={{ marginBottom: 6 }}>Answer: <b dangerouslySetInnerHTML={{ __html: ansTxt }} />
                {q.kind === "num" && q.tol >= 0.5 && !q.check ? ` (accepted within ±${q.tol} ${q.unit || ""})` : ""}
              </div>
            )}
            <div style={{ color: C.foam, lineHeight: 1.5 }} dangerouslySetInnerHTML={{ __html: q.why }} />
          </div>
        )}

        {/* nav */}
        <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 16, flexWrap: "wrap" }}>
          <button onClick={stop} style={btnS}>Stop</button>
          {!checked
            ? <button onClick={check} style={{ ...btnP, flex: 1 }}>Check</button>
            : <button onClick={next} style={{ ...btnP, flex: 1 }}>{i >= total - 1 ? "Finish ▸" : "Next ▸"}</button>}
        </div>
      </div>
    </div>
  );
}

function optStyle(C, light, mark) {
  const base = {
    display: "flex", gap: 11, alignItems: "flex-start", padding: "12px 13px",
    border: `1.5px solid ${C.line}`, borderRadius: 12, background: light ? C.raise : C.shelf,
    color: C.foam, cursor: "pointer", lineHeight: 1.4,
  };
  if (mark === "ok") return { ...base, border: `1.5px solid ${C.ok}`, background: light ? "#e6f2ef" : "#123a36" };
  if (mark === "no") return { ...base, border: `1.5px solid ${C.no}`, background: light ? "#fae3dc" : "#3a241d" };
  return base;
}

function fbStyle(C, light, good) {
  return {
    marginTop: 14, padding: "13px 15px", borderRadius: 12, fontSize: 14.5, lineHeight: 1.5,
    border: `1px solid ${good ? C.ok : C.no}`,
    background: good ? (light ? "#e6f2ef" : "#123a36") : (light ? "#fae3dc" : "#3a241d"),
    color: C.foam,
  };
}
