import React, { useState, useEffect, useMemo, useRef } from "react";
import { examPoints, examModel } from "./engine/exam.js";
import { figureDims, labelPool } from "./engine/figures.js";
import { ComparisonCard, COMPARISON_CARDS } from "./comparison/index.js";
import { pillLabel } from "./comparison/pills.js";
import { InteractiveLab } from "./interactives/index.js";
import { paletteFor } from "./theme.js";
import { initAnswer as initAnswerShared, canSubmit as canSubmitShared, gradeItem } from "./quiz/grade.js";
import { ReaderApp } from "./reader/ReaderApp.jsx";
import { FLASHCARDS } from "./flashcards/flashcards.js";

/* ========================================================================
   MARINE SCIENCE REVISION APP — subject content lives in src/content/
   The Reader (src/reader/ReaderApp.jsx) is the whole app. This module keeps the
   shared question renderer + reward art and hands it, plus the reusable learn
   surfaces (comparison cards, the interactive lab, Ocean discoveries) and the
   colour theme, down to the Reader. No timers, no lives, no streaks.
   ======================================================================== */

/* ---------------------------------------------------------------- tokens */
/* The module-level `C` is swapped by setPalette() at the top of each App render,
   so every component (which reads `C` at render time) picks up the active theme.
   Palettes live in theme.js; several SVGs feed `C` values into presentation
   attributes, so they must stay real hex (var() is invalid there). */
let C = paletteFor("dark");
function setPalette(theme) { C = paletteFor(theme); }

const FONT_UI = "'Karla', ui-sans-serif, system-ui, sans-serif";
const FONT_DISPLAY = "'Fraunces Variable', Georgia, serif";

/* ------------------------------------------------------------- content */
/* The engine never names a subject. Everything it shows — topics, items,
   creatures, labels — arrives as data from the active content module.
   See src/content/index.js to switch subject and CONTENT-SPEC.md for the shape. */
import { content } from "./content/index.js";
const { creatures: CREATURES } = content;
const FIGURES = content.figures || {};

/* ------------------------------------------------------ creature art */
/* Prefers <creaturePath><id>.png when the file exists, and falls back to the
   subject's drawn version if it doesn't — so artwork can be added a few at a time. */
function CreatureArt({ id, size = 132 }) {
  const [useDrawn, setUseDrawn] = useState(false);
  if (!useDrawn) {
    return (
      <img
        src={`${content.creaturePath}${id}.png`}
        alt=""
        width={size}
        height={size}
        onError={() => setUseDrawn(true)}
        style={{ width: size, height: size, objectFit: "contain", display: "block" }}
      />
    );
  }
  return <DrawnCreature id={id} size={size} />;
}

function DrawnCreature({ id, size = 132 }) {
  const s = { width: size, height: size };
  const art = content.drawnArt ? content.drawnArt(id, C) : null;
  const fallback = (
    <>
      <ellipse cx="48" cy="52" rx="26" ry="15" fill={C.mist} opacity="0.7" />
      <path d="M72 52 L88 40 L88 64 Z" fill={C.mist} opacity="0.7" />
      <circle cx="34" cy="48" r="3" fill={C.abyss} />
    </>
  );
  return (
    <svg viewBox="0 0 100 100" style={s} aria-hidden="true">
      {art || fallback}
    </svg>
  );
}

/* ------------------------------------------------------------- helpers */
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* A plain shuffle can land back on the original order, which hands the answer
   to the student. This one keeps trying until the order actually changed. */
const reorder = (arr, key = (x) => x) => {
  if (arr.length < 2) return [...arr];
  for (let t = 0; t < 40; t++) {
    const s = shuffle(arr);
    if (s.some((v, i) => key(v) !== key(arr[i]))) return s;
  }
  return [...arr.slice(1), arr[0]];
};

/* For matching: shuffle both columns, but never leave a term sitting directly
   opposite its own description. */
const matchColumns = (pairs) => {
  const L = reorder(pairs.map((p, i) => ({ t: p[0], i })), (x) => x.i);
  const rights = pairs.map((p, i) => ({ t: p[1], i }));
  for (let t = 0; t < 60; t++) {
    const R = shuffle(rights);
    if (R.every((r, idx) => r.i !== L[idx].i)) return { L, R };
  }
  const R = L.map((_, idx) => rights[L[(idx + 1) % L.length].i]);
  return { L, R };
};

/* ====================================================== 2. QUESTIONS */

function Prompt({ children }) {
  return (
    <h2 style={{
      fontFamily: FONT_DISPLAY, fontSize: 21, lineHeight: 1.32, color: C.foam,
      fontWeight: 600, margin: "0 0 20px", letterSpacing: "-0.01em",
      whiteSpace: "pre-line",   // a stem may carry a formula on its own line
    }}>{children}</h2>
  );
}

const btnBase = {
  fontFamily: FONT_UI, fontSize: 16, lineHeight: 1.4, width: "100%",
  textAlign: "left", padding: "14px 16px", borderRadius: 14,
  border: `1px solid ${C.line}`, background: C.shelf, color: C.foam,
  cursor: "pointer", marginBottom: 10, transition: "background .12s, border-color .12s",
};

/* ------------------------------------------------------- figure render */
/* The raw figure (SVG or raster) at full container width. Hotspots are
   overlaid separately, positioned by percentage so both kinds scale. */
function FigureArt({ figId }) {
  const fig = FIGURES[figId];
  if (!fig) return null;
  if (fig.art.kind === "img") {
    return <img src={fig.art.src} alt="" style={{ width: "100%", display: "block", borderRadius: 10 }} />;
  }
  return <div style={{ width: "100%" }} dangerouslySetInnerHTML={{ __html: fig.art.svg }} />;
}

/* A figure with tappable hotspots overlaid. Shared by tap and label; `big`
   renders the enlarged, horizontally-scrollable version for wide figures. */
function HotspotLayer({ figId, mode, tappedId, assign, order, locked, item, onHotspot }) {
  const fig = FIGURES[figId];
  const dims = figureDims(fig);
  if (!fig || !dims) return null;
  if (mode === "static") {   // figure-choice: show the figure, no hotspots
    return <div style={{ width: "100%", lineHeight: 0 }}><FigureArt figId={figId} /></div>;
  }
  const targetOk = (h, i) => {
    if (!locked) return null;
    if (mode === "tap") return h.id === item.target ? "right" : (h.id === tappedId ? "wrong" : null);
    return assign?.[i] === i ? "right" : (assign?.[i] != null ? "wrong" : "missed");
  };
  return (
    <div style={{ position: "relative", width: "100%", lineHeight: 0 }}>
      <FigureArt figId={figId} />
      {fig.hotspots.map((h, i) => {
        const v = targetOk(h, i);
        const assigned = mode === "label" && assign?.[i] != null;
        const num = assigned ? order.indexOf(i) + 1 : null;
        const on = mode === "tap" ? tappedId === h.id : assigned;
        const ring = v === "right" ? C.ok : v === "wrong" ? C.no : v === "missed" ? C.no : (on ? C.glow : C.foam);
        return (
          <button key={h.id} onClick={() => !locked && onHotspot(i, h)} disabled={locked}
            aria-label={h.label}
            style={{
              position: "absolute", left: `${(h.x / dims.w) * 100}%`, top: `${(h.y / dims.h) * 100}%`,
              transform: "translate(-50%, -50%)", width: 30, height: 30, borderRadius: "50%",
              border: `2.5px solid ${ring}`, borderStyle: v === "missed" ? "dashed" : "solid",
              background: on || v === "right" ? "rgba(79,216,196,.25)" : v === "wrong" ? "rgba(255,158,125,.25)" : "rgba(4,20,31,.35)",
              color: C.foam, fontFamily: FONT_UI, fontSize: 13, fontWeight: 700,
              display: "grid", placeItems: "center", cursor: locked ? "default" : "pointer", padding: 0,
              boxShadow: "0 0 0 2px rgba(4,20,31,.5)",
            }}>
            {num || ""}
          </button>
        );
      })}
    </div>
  );
}

/* Wraps a hotspot figure with an Enlarge control. Wide figures (aspect > 1.4)
   are cramped on a phone card; Enlarge opens a full-screen, side-scrollable
   panel with the same interactive hotspots. */
function FigureStage(props) {
  const [big, setBig] = useState(false);
  const fig = FIGURES[props.figId];
  const dims = figureDims(fig);
  const wide = dims && dims.w / dims.h > 1.4;
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ borderRadius: 12, overflow: "hidden", border: `1px solid ${C.shelf}`, background: "rgba(10,42,61,.4)" }}>
        <HotspotLayer {...props} />
      </div>
      {wide && !props.locked && (
        <button onClick={() => setBig(true)} style={{
          marginTop: 8, background: "none", border: `1px solid ${C.line}`, borderRadius: 10,
          color: C.accent, fontFamily: FONT_UI, fontSize: 13, padding: "6px 12px", cursor: "pointer",
        }}>⤢ Enlarge</button>
      )}
      {big && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 40, background: "rgba(4,20,31,.97)",
          display: "flex", flexDirection: "column", padding: "16px 0",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0 16px 10px" }}>
            <span style={{ fontFamily: FONT_UI, fontSize: 13, color: C.mist }}>Scroll the figure sideways, then tap.</span>
            <button onClick={() => setBig(false)} style={{
              background: "none", border: "none", color: C.accent, fontFamily: FONT_UI, fontSize: 15, cursor: "pointer",
            }}>✕ Close</button>
          </div>
          <div style={{ flex: 1, overflow: "auto", padding: "0 16px", WebkitOverflowScrolling: "touch" }}>
            <div style={{ width: wide ? Math.round((dims.w / dims.h) * 78) + "vh" : "100%", minWidth: "100%" }}>
              <HotspotLayer {...props} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FigureTapQ({ item, locked, tappedId, setTapped }) {
  return (
    <>
      <Prompt>{item.q}</Prompt>
      <FigureStage figId={item.fig} mode="tap" item={item} locked={locked} tappedId={tappedId}
        onHotspot={(i, h) => setTapped(h.id)} />
    </>
  );
}

function FigureLabelQ({ item, locked, state, setState }) {
  const fig = FIGURES[item.fig];
  const pool = useMemo(() => labelPool(item, fig), [item.id]);
  const chipOrder = useMemo(() => reorder(pool.map((_, i) => i)), [item.id]);
  const { assign, order, selLab } = state;
  const usedLabels = new Set(Object.values(assign));

  const tapHotspot = (i) => {
    if (assign[i] != null) {
      const next = { ...assign }; delete next[i];
      setState({ assign: next, order: order.filter((x) => x !== i), selLab: null });
      return;
    }
    if (selLab == null) return;
    if (usedLabels.has(selLab)) return;
    setState({ assign: { ...assign, [i]: selLab }, order: [...order, i], selLab: null });
  };

  return (
    <>
      <Prompt>{item.q}</Prompt>
      <FigureStage figId={item.fig} mode="label" item={item} locked={locked} assign={assign} order={order}
        onHotspot={tapHotspot} />
      {!locked && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {chipOrder.map((p) => {
            const spent = usedLabels.has(p);
            const armed = selLab === p;
            return (
              <button key={p} onClick={() => !spent && setState({ ...state, selLab: armed ? null : p })}
                disabled={spent}
                style={{
                  fontFamily: FONT_UI, fontSize: 14, padding: "8px 13px", borderRadius: 999,
                  border: `1.5px solid ${armed ? C.glow : C.line}`,
                  background: armed ? C.raise : spent ? "transparent" : C.shelf,
                  color: spent ? C.line : C.foam, cursor: spent ? "default" : "pointer",
                }}>
                {pool[p]}
              </button>
            );
          })}
        </div>
      )}
      {!locked && (
        <p style={{ fontFamily: FONT_UI, fontSize: 13, color: C.mist, marginTop: 10 }}>
          {selLab == null ? "Tap a label, then tap its spot on the figure." : "Now tap where it belongs."}
          {order.length ? ` ${order.length} of ${fig.hotspots.length} placed — tap a numbered spot to undo it.` : ""}
        </p>
      )}
      {locked && (
        <div style={{ marginTop: 6 }}>
          {fig.hotspots.map((h, i) => (
            <p key={h.id} style={{ fontFamily: FONT_UI, fontSize: 13.5, color: C.foam, margin: "0 0 4px" }}>
              <span style={{ color: C.accent }}>{i + 1}.</span> {h.label}
            </p>
          ))}
        </div>
      )}
    </>
  );
}

function ChoiceQ({ item, locked, picked, setPicked }) {
  // Options are authored with the answer first; never show them that way.
  const order = useMemo(() => reorder(item.options.map((_, i) => i)), [item.id]);
  return (
    <>
      <Prompt>{item.q}</Prompt>
      {item.fig && <FigureStage figId={item.fig} mode="static" item={item} locked={locked} onHotspot={() => {}} />}
      {order.map((i) => {
        let bg = C.shelf, bd = C.line, col = C.foam;
        if (locked) {
          if (i === item.a) { bg = "rgba(79,216,196,.16)"; bd = C.ok; col = C.ok; }
          else if (i === picked) { bg = "rgba(255,158,125,.13)"; bd = C.no; col = C.no; }
          else { col = C.mist; }
        } else if (i === picked) { bg = C.raise; bd = C.glow; }
        return (
          <button key={i} onClick={() => !locked && setPicked(i)} disabled={locked}
            style={{ ...btnBase, background: bg, borderColor: bd, color: col, cursor: locked ? "default" : "pointer" }}>
            {item.options[i]}
          </button>
        );
      })}
    </>
  );
}

/* True/False verdict: two big buttons. `picked` is a boolean. Grading reuses the
   choice path (grade.js compares the boolean to item.answer); the reader then
   reveals `why` exactly as for every other type. */
function TrueFalseQ({ item, locked, picked, setPicked }) {
  const opts = [
    { val: true, label: "True" },
    { val: false, label: "False" },
  ];
  return (
    <>
      <Prompt>{item.q}</Prompt>
      <div style={{ display: "flex", gap: 12 }}>
        {opts.map(({ val, label }) => {
          let bg = C.shelf, bd = C.line, col = C.foam;
          if (locked) {
            if (val === item.answer) { bg = "rgba(79,216,196,.16)"; bd = C.ok; col = C.ok; }
            else if (val === picked) { bg = "rgba(255,158,125,.13)"; bd = C.no; col = C.no; }
            else { col = C.mist; }
          } else if (val === picked) { bg = C.raise; bd = C.glow; }
          return (
            <button key={label} onClick={() => !locked && setPicked(val)} disabled={locked}
              style={{
                ...btnBase, flex: 1, textAlign: "center", marginBottom: 0, fontSize: 18, fontWeight: 600,
                padding: "20px 16px", background: bg, borderColor: bd, color: col,
                cursor: locked ? "default" : "pointer",
              }}>
              {label}
            </button>
          );
        })}
      </div>
    </>
  );
}

function MultiQ({ item, locked, picked, setPicked }) {
  const order = useMemo(() => reorder(item.options.map((_, i) => i)), [item.id]);
  const toggle = (i) => setPicked(picked.includes(i) ? picked.filter((x) => x !== i) : [...picked, i]);
  return (
    <>
      <Prompt>{item.q}</Prompt>
      {order.map((i) => {
        const on = picked.includes(i);
        const right = item.a.includes(i);
        let bg = C.shelf, bd = C.line, col = C.foam;
        if (locked) {
          if (right) { bg = "rgba(79,216,196,.16)"; bd = C.ok; col = C.ok; }
          else if (on) { bg = "rgba(255,158,125,.13)"; bd = C.no; col = C.no; }
          else col = C.mist;
        } else if (on) { bg = C.raise; bd = C.glow; }
        return (
          <button key={i} onClick={() => !locked && toggle(i)} disabled={locked}
            style={{ ...btnBase, background: bg, borderColor: bd, color: col, display: "flex", gap: 12, alignItems: "center" }}>
            <span style={{
              width: 20, height: 20, flexShrink: 0, borderRadius: 6,
              border: `2px solid ${on || (locked && right) ? bd : C.line}`,
              background: on || (locked && right) ? bd : "transparent",
            }} />
            <span>{item.options[i]}</span>
          </button>
        );
      })}
    </>
  );
}

function GapQ({ item, locked, filled, setFilled }) {
  const bank = useMemo(() => reorder(item.bank), [item.id]);
  const place = (w) => {
    const idx = filled.findIndex((f) => f === null);
    if (idx === -1) return;
    const next = [...filled];
    next[idx] = w;
    setFilled(next);
  };
  const clear = (i) => {
    const next = [...filled];
    next[i] = null;
    setFilled(next);
  };
  const used = filled.filter(Boolean);
  return (
    <>
      <Prompt>{item.q}</Prompt>
      <p style={{
        fontFamily: FONT_UI, fontSize: 17, lineHeight: 2.1, color: C.foam,
        margin: "0 0 22px",
      }}>
        {item.segments.map((seg, i) => (
          <React.Fragment key={i}>
            {seg}
            {i < item.answers.length && (
              <span onClick={() => !locked && clear(i)} style={{
                display: "inline-block", minWidth: 78, textAlign: "center", padding: "3px 10px",
                margin: "0 2px", borderRadius: 9, cursor: locked ? "default" : "pointer",
                background: filled[i] ? (locked ? (filled[i] === item.answers[i] ? "rgba(79,216,196,.18)" : "rgba(255,158,125,.15)") : C.raise) : "transparent",
                border: `1px ${filled[i] ? "solid" : "dashed"} ${locked ? (filled[i] === item.answers[i] ? C.ok : C.no) : filled[i] ? C.glow : C.line}`,
                color: locked ? (filled[i] === item.answers[i] ? C.ok : C.no) : C.foam,
              }}>
                {filled[i] || "\u00A0"}
              </span>
            )}
          </React.Fragment>
        ))}
      </p>
      {locked && filled.some((f, i) => f !== item.answers[i]) && (
        <p style={{ fontFamily: FONT_UI, fontSize: 14, color: C.mist, margin: "-10px 0 16px" }}>
          Correct: {item.answers.join(" · ")}
        </p>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {bank.map((w) => {
          const spent = used.includes(w);
          return (
            <button key={w} onClick={() => !locked && !spent && place(w)} disabled={locked || spent}
              style={{
                fontFamily: FONT_UI, fontSize: 15, padding: "9px 14px", borderRadius: 11,
                border: `1px solid ${C.line}`, background: spent ? "transparent" : C.shelf,
                color: spent ? C.line : C.foam, cursor: locked || spent ? "default" : "pointer",
              }}>
              {w}
            </button>
          );
        })}
      </div>
    </>
  );
}

function MatchQ({ item, locked, state, setState }) {
  const { L, R } = useMemo(() => matchColumns(item.pairs), [item.id]);
  const { links, order, sel } = state;

  const rightOwner = {};
  Object.entries(links).forEach(([l, r]) => { rightOwner[r] = Number(l); });
  const numberOf = (l) => order.indexOf(l) + 1;

  const unlink = (l) => {
    const next = { ...links };
    delete next[l];
    setState({ links: next, order: order.filter((x) => x !== l), sel: null });
  };

  const tapLeft = (l) => {
    if (locked) return;
    if (links[l] !== undefined) return unlink(l);
    setState({ ...state, sel: sel === l ? null : l });
  };

  const tapRight = (r) => {
    if (locked) return;
    const owner = rightOwner[r];
    if (owner !== undefined) return unlink(owner);
    if (sel === null) return;
    setState({
      links: { ...links, [sel]: r },
      order: [...order.filter((x) => x !== sel), sel],
      sel: null,
    });
  };

  /* Nothing is judged until Check. Before that a link is just teal. */
  const look = (linked, selected, verdict) => {
    const bad = verdict === "wrong";
    const good = verdict === "right";
    return {
      position: "relative", fontFamily: FONT_UI, fontSize: 14, lineHeight: 1.35,
      padding: "12px 26px 12px 12px", borderRadius: 12,
      cursor: locked ? "default" : "pointer",
      border: `1px solid ${bad ? C.no : good ? C.ok : linked || selected ? C.glow : C.line}`,
      background: bad ? "rgba(255,158,125,.14)" : good ? "rgba(79,216,196,.14)"
        : selected ? C.raise : linked ? "rgba(79,216,196,.08)" : C.shelf,
      color: bad ? C.no : good ? C.ok : C.foam,
      display: "flex", alignItems: "center",
      boxSizing: "border-box", minHeight: 58,
      transition: "background .12s, border-color .12s",
    };
  };

  const badge = (n, verdict) => (
    <span style={{
      position: "absolute", top: 6, right: 6, width: 17, height: 17, borderRadius: 9,
      fontSize: 10.5, lineHeight: "17px", textAlign: "center", fontWeight: 600,
      background: verdict === "wrong" ? C.no : verdict === "right" ? C.ok : C.glow,
      color: C.abyss,
    }}>{n}</span>
  );

  const verdictFor = (l) => {
    if (!locked || links[l] === undefined) return null;
    return links[l] === l ? "right" : "wrong";
  };

  const linkedCount = Object.keys(links).length;
  const allWrong = locked && Object.keys(links).some((l) => links[l] !== Number(l));

  return (
    <>
      <Prompt>{item.q}</Prompt>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1.3fr", gap: 8 }}>
        {L.map((left, row) => {
          const right = R[row];
          const lv = verdictFor(left.i);
          const owner = rightOwner[right.i];
          const rv = owner !== undefined ? verdictFor(owner) : null;
          return (
            <React.Fragment key={row}>
              <div onClick={() => tapLeft(left.i)}
                style={look(links[left.i] !== undefined, sel === left.i, lv)}>
                {left.t}
                {links[left.i] !== undefined && badge(numberOf(left.i), lv)}
              </div>
              <div onClick={() => tapRight(right.i)}
                style={look(owner !== undefined, false, rv)}>
                {right.t}
                {owner !== undefined && badge(numberOf(owner), rv)}
              </div>
            </React.Fragment>
          );
        })}
      </div>

      <p style={{ fontFamily: FONT_UI, fontSize: 14, color: C.mist, marginTop: 12, minHeight: 20 }}>
        {locked
          ? "Matching numbers show what you paired."
          : sel !== null
          ? "Now tap its description."
          : linkedCount === item.pairs.length
          ? "All paired. Change any of them, or press Check."
          : `Tap a term, then its description. ${linkedCount} of ${item.pairs.length} paired — tap a pair again to undo it.`}
      </p>

      {allWrong && (
        <div style={{ marginTop: 4 }}>
          <p style={{ fontFamily: FONT_UI, fontSize: 13, color: C.mist, margin: "0 0 6px" }}>
            The correct pairs
          </p>
          {item.pairs.map(([a, b], i) => (
            <p key={i} style={{ fontFamily: FONT_UI, fontSize: 14, color: C.foam, margin: "0 0 4px", lineHeight: 1.4 }}>
              <span style={{ color: C.accent }}>{a}</span> — {b}
            </p>
          ))}
        </div>
      )}
    </>
  );
}

function ChainQ({ item, locked, order, setOrder }) {
  const pool = useMemo(
    () => reorder(item.chunks.map((c, i) => ({ c, i })), (x) => x.i),
    [item.id]
  );
  const add = (k) => !locked && !order.includes(k) && setOrder([...order, k]);
  const remove = (k) => !locked && setOrder(order.filter((x) => x !== k));
  return (
    <>
      <Prompt>{item.q}</Prompt>
      <div style={{
        minHeight: 70, borderRadius: 14, border: `1px dashed ${C.line}`,
        padding: order.length ? 10 : 20, marginBottom: 16,
        background: "rgba(255,255,255,.02)",
      }}>
        {order.length === 0 && (
          <p style={{ fontFamily: FONT_UI, fontSize: 14, color: C.mist, margin: 0, textAlign: "center" }}>
            Tap the steps below in the right order
          </p>
        )}
        {order.map((k, pos) => {
          const right = locked && k === pos;
          const bad = locked && k !== pos;
          return (
            <div key={k} onClick={() => remove(k)} style={{
              fontFamily: FONT_UI, fontSize: 15, lineHeight: 1.4, padding: "10px 12px",
              borderRadius: 10, marginBottom: 6, cursor: locked ? "default" : "pointer",
              background: bad ? "rgba(255,158,125,.12)" : right ? "rgba(79,216,196,.14)" : C.raise,
              border: `1px solid ${bad ? C.no : right ? C.ok : C.glow}`,
              color: bad ? C.no : right ? C.ok : C.foam,
              display: "flex", gap: 10,
            }}>
              <span style={{ color: C.mist, flexShrink: 0 }}>{pos + 1}</span>
              <span>{item.chunks[k]}</span>
            </div>
          );
        })}
      </div>
      {locked && (
        <div style={{ marginBottom: 16 }}>
          <p style={{ fontFamily: FONT_UI, fontSize: 13, color: C.mist, margin: "0 0 6px" }}>Correct order</p>
          {item.chunks.map((c, i) => (
            <p key={i} style={{ fontFamily: FONT_UI, fontSize: 14, color: C.foam, margin: "0 0 4px" }}>
              <span style={{ color: C.accent }}>{i + 1}.</span> {c}
            </p>
          ))}
        </div>
      )}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {pool.map(({ c, i }) => {
          const spent = order.includes(i);
          if (spent) return null;
          return (
            <button key={i} onClick={() => add(i)} disabled={locked}
              style={{
                fontFamily: FONT_UI, fontSize: 15, lineHeight: 1.35, padding: "10px 13px",
                borderRadius: 11, border: `1px solid ${C.line}`, background: C.shelf,
                color: C.foam, textAlign: "left", cursor: locked ? "default" : "pointer",
              }}>
              {c}
            </button>
          );
        })}
      </div>
    </>
  );
}

/* Exam-style (tier-3) item: a single auto-graded marking-point checklist, then
   a read-only model answer for study. The learner ticks the points they'd
   include; grading is content-only (the ticked set must equal the true mark
   points). Answer ORDER is never authored, entered or graded. Grading helpers
   live in engine/exam.js. */
function ExamQ({ item, locked, state, setState }) {
  const pts = useMemo(() => examPoints(item), [item.id]);
  const model = useMemo(() => examModel(item), [item.id]);
  const display = useMemo(() => reorder(pts.map((_, i) => i)), [item.id]);
  const { checkSel } = state;

  const toggle = (i) => {
    if (locked) return;
    setState({ checkSel: checkSel.includes(i) ? checkSel.filter((x) => x !== i) : [...checkSel, i] });
  };

  const totalCorrect = pts.filter((p) => p.correct).length;
  const chosenCorrect = checkSel.filter((i) => pts[i].correct).length;
  const wrongPicks = checkSel.filter((i) => !pts[i].correct).length;
  const missed = totalCorrect - chosenCorrect;

  const note = { fontFamily: FONT_UI, fontSize: 14, color: C.mist, margin: "0 0 14px", lineHeight: 1.45 };
  const stepLabel = {
    fontFamily: FONT_UI, fontSize: 12, letterSpacing: ".05em", textTransform: "uppercase",
    color: C.accent, margin: "0 0 10px",
  };

  return (
    <>
      <p style={stepLabel}>Exam-type question</p>
      <Prompt>{item.q}</Prompt>

      {!locked && (
        <p style={note}>
          Tick every marking point you would include in your answer. The examiner awards the points, not the order.
        </p>
      )}

      <p style={stepLabel}>Tick the points you would include</p>
      {display.map((i) => {
        const p = pts[i];
        const on = checkSel.includes(i);
        let bg = C.shelf, bd = C.line, col = C.foam, dash = "solid";
        if (locked) {
          if (p.correct && on) { bg = "rgba(79,216,196,.16)"; bd = C.ok; col = C.ok; }          // included, correct
          else if (p.correct) { bd = C.ok; col = C.ok; dash = "dashed"; }                        // a mark point missed
          else if (on) { bg = "rgba(255,158,125,.13)"; bd = C.no; col = C.no; }                  // does not belong
          else col = C.mist;
        } else if (on) { bg = C.raise; bd = C.glow; }
        return (
          <div key={i}>
            <button onClick={() => toggle(i)} disabled={locked}
              style={{
                ...btnBase, background: bg, borderColor: bd, borderStyle: dash, color: col,
                display: "flex", gap: 12, alignItems: "center", cursor: locked ? "default" : "pointer",
                marginBottom: locked && !p.correct && on && p.reason ? 2 : 10,
              }}>
              <span style={{
                width: 20, height: 20, flexShrink: 0, borderRadius: 6,
                border: `2px solid ${on || (locked && p.correct) ? bd : C.line}`,
                background: on ? bd : "transparent",
              }} />
              <span>{p.text}</span>
            </button>
            {locked && on && !p.correct && p.reason && (
              <p style={{ fontFamily: FONT_UI, fontSize: 13, color: C.no, margin: "0 0 10px 32px", lineHeight: 1.4 }}>
                {p.reason}
              </p>
            )}
          </div>
        );
      })}

      {locked && (
        <>
          <p style={{ ...note, color: missed === 0 && wrongPicks === 0 ? C.ok : C.no, marginTop: 4 }}>
            {missed === 0 && wrongPicks === 0
              ? `All ${totalCorrect} mark points — nothing extra.`
              : `You included ${chosenCorrect} of ${totalCorrect} mark points${wrongPicks ? `, and ${wrongPicks} that don’t belong` : ""}. Teal = correct, dashed = missed, coral = does not belong.`}
          </p>

          <p style={stepLabel}>Model answer &middot; for study</p>
          <div style={{
            borderRadius: 14, border: `1px solid ${C.line}`, padding: 16, marginBottom: 4,
            background: "rgba(255,255,255,.02)",
          }}>
            {model.map((c, i) => (
              <p key={i} style={{ fontFamily: FONT_UI, fontSize: 15, lineHeight: 1.5, color: C.foam, margin: i ? "8px 0 0" : 0 }}>
                <span style={{ color: C.accent, fontWeight: 700 }}>{i + 1}.</span> {c}
              </p>
            ))}
          </div>
        </>
      )}
    </>
  );
}

/* ------------------------------------------------------------- updates */
/* Inside the Android app every file is baked into the APK, so new content
   only arrives with a new APK. The build workflow publishes each APK as a
   GitHub release tagged build-N and stamps N into the app as VITE_BUILD_NUMBER.
   "Check for updates" compares the two and hands the download to the phone's
   browser, which then offers to install it over the old copy. The web build
   never shows this: its service worker already refreshes itself. */
const REPO = "GoRa-Bhava/marine-science-igcse";
const APK_URL = `https://github.com/${REPO}/releases/latest/download/marine-science.apk`;
const BUILD = Number(import.meta.env.VITE_BUILD_NUMBER) || 0;
const IS_NATIVE = typeof window !== "undefined" && !!window.Capacitor?.isNativePlatform?.();

async function fetchLatestBuild() {
  const res = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
    headers: { Accept: "application/vnd.github+json" },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`GitHub answered ${res.status}`);
  const m = /build-(\d+)/.exec((await res.json()).tag_name || "");
  if (!m) throw new Error("latest release has no build number");
  return Number(m[1]);
}

/* Collapsible comparison selector for the Concept-cards screen: a button showing
   the current comparison + chevron; tapping expands a 2-column list of all 14.
   Picking one selects it and collapses; tapping the button again, tapping
   outside, or Esc also collapses. No horizontal scrolling. */
function ComparisonSelector({ cards, activeIndex, onSelect }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const current = cards[activeIndex] || cards[0];
  return (
    <div ref={wrapRef} style={{ position: "relative", marginBottom: 14 }}>
      <button type="button" aria-expanded={open} aria-haspopup="listbox" onClick={() => setOpen((o) => !o)} style={{
        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10,
        padding: "12px 14px", borderRadius: 14, cursor: "pointer",
        border: `1px solid ${C.line}`, background: C.shelf, color: C.foam,
        fontFamily: FONT_UI, fontSize: 15.5, fontWeight: 700, textAlign: "left",
      }}>
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{pillLabel(current.id)}</span>
        <span aria-hidden="true" style={{ color: C.accent, transform: open ? "rotate(180deg)" : "none", transition: ".18s" }}>▾</span>
      </button>
      {open && (
        <div role="listbox" aria-label="Choose a comparison" style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 30,
          maxHeight: "60vh", overflowY: "auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8,
          padding: 10, borderRadius: 14, border: `1px solid ${C.line}`, background: C.bg1,
          boxShadow: "0 18px 44px rgba(0,0,0,.4)",
        }}>
          {cards.map((c, i) => (
            <button key={c.id} type="button" role="option" aria-selected={i === activeIndex}
              onClick={() => { onSelect(i); setOpen(false); }}
              style={{
                textAlign: "left", padding: "11px 12px", borderRadius: 11, cursor: "pointer",
                border: `1px solid ${i === activeIndex ? C.glow : C.line}`,
                background: i === activeIndex ? "rgba(79,216,196,.14)" : "transparent",
                color: i === activeIndex ? C.accent : C.foam, fontFamily: FONT_UI, fontSize: 12.5,
                fontWeight: i === activeIndex ? 700 : 500, lineHeight: 1.3,
              }}>
              {pillLabel(c.id)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* One "Check for updates" control for both platforms. Web: refresh the service
   worker and reload to the newest deploy. Native (APK): compare the build number
   to the latest GitHub release and hand the download to the phone's browser. */
function UpdatesControl() {
  const [state, setState] = useState({ kind: "idle" });
  const link = {
    background: "none", border: "none", padding: 0, color: C.accent, cursor: "pointer",
    fontFamily: FONT_UI, fontSize: 13, textDecoration: "underline",
  };

  const check = async () => {
    setState({ kind: "checking" });
    try {
      if (IS_NATIVE) {
        const latest = await fetchLatestBuild();
        setState(latest > BUILD ? { kind: "available", latest } : { kind: "current" });
        return;
      }
      const reg = await navigator.serviceWorker?.getRegistration?.();
      if (!reg) { setState({ kind: "updating" }); window.location.reload(); return; }
      let reloaded = false;
      navigator.serviceWorker.addEventListener("controllerchange", () => {
        if (!reloaded) { reloaded = true; window.location.reload(); }
      });
      await reg.update();
      const fresh = reg.installing || reg.waiting;
      if (fresh) { setState({ kind: "updating" }); fresh.postMessage?.({ type: "SKIP_WAITING" }); }
      else setState({ kind: "current" });
    } catch (e) { setState({ kind: "error" }); }
  };

  return (
    <div style={{ fontSize: 13, color: C.mist, lineHeight: 1.6 }}>
      <button type="button" onClick={check} style={{
        textAlign: "left", padding: "13px 12px", width: "100%", borderRadius: 12, cursor: "pointer",
        border: "1px solid transparent", background: "transparent", color: C.foam,
        fontFamily: FONT_UI, fontSize: 15, fontWeight: 500,
      }}>
        Check for updates
      </button>
      <div style={{ padding: "0 12px" }}>
        {state.kind === "checking" && <div>Checking…</div>}
        {state.kind === "updating" && <div>Updating…</div>}
        {state.kind === "current" && <div>Up to date (build {BUILD || "dev"}). <button onClick={check} style={link}>Check again</button></div>}
        {state.kind === "error" && <div>Couldn't check. Are you online? <button onClick={check} style={link}>Try again</button></div>}
        {state.kind === "available" && (
          <button type="button" onClick={() => { window.location.href = APK_URL; }} style={{
            display: "block", width: "100%", marginTop: 8, padding: 12, borderRadius: 12,
            border: `1px solid ${C.glow}`, background: "rgba(79,216,196,.1)", color: C.foam,
            fontFamily: FONT_UI, fontSize: 14, cursor: "pointer",
          }}>
            Download build {state.latest}
          </button>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- app */
/* Dispatch one item's interaction to its component. Shared by the classic
   lesson render and the Reader so both look and behave identically. */
export function ItemBody({ item, locked, answer, setAnswer }) {
  if (!item) return null;
  return (
    <>
      {item.type === "choice" && <ChoiceQ item={item} locked={locked} picked={answer} setPicked={setAnswer} />}
      {item.type === "truefalse" && <TrueFalseQ item={item} locked={locked} picked={answer} setPicked={setAnswer} />}
      {item.type === "multi" && <MultiQ item={item} locked={locked} picked={answer} setPicked={setAnswer} />}
      {item.type === "gap" && <GapQ item={item} locked={locked} filled={answer} setFilled={setAnswer} />}
      {item.type === "match" && <MatchQ item={item} locked={locked} state={answer} setState={setAnswer} />}
      {item.type === "chain" && <ChainQ item={item} locked={locked} order={answer} setOrder={setAnswer} />}
      {item.type === "exam" && <ExamQ item={item} locked={locked} state={answer} setState={setAnswer} />}
      {item.type === "tap" && <FigureTapQ item={item} locked={locked} tappedId={answer} setTapped={setAnswer} />}
      {item.type === "label" && <FigureLabelQ item={item} locked={locked} state={answer} setState={setAnswer} />}
    </>
  );
}

/* ---------------------------------------------------------------- root */
/* The Reader is the whole app. This root only owns the colour theme — applied
   to the module palette so every component picks it up — and hands the reusable
   surfaces down to the Reader: the shared item renderer, comparison cards, the
   interactive lab, Ocean discoveries art, and the "check for updates" control. */
export default function App() {
  const [theme, setThemeState] = useState(() => {
    try {
      const t = window.localStorage.getItem("marine_theme");
      if (t === "light" || t === "dark") return t;
      // one-time carry-over of a theme chosen in the old classic settings
      const raw = window.localStorage.getItem(content.storeKey);
      if (raw) { const s = JSON.parse(raw)?.settings; if (s?.theme === "light") return "light"; }
    } catch (e) { /* first run, or storage blocked */ }
    return "dark";
  });
  const setTheme = (t) => {
    setThemeState(t);
    try { window.localStorage.setItem("marine_theme", t); } catch (e) { /* ignore */ }
  };

  setPalette(theme);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = theme;      // drives the light/dark tokens in comparison-card.css
    root.style.colorScheme = theme;
    document.body.style.background = C.bg1;
    // Bridge the active palette to CSS custom properties so responsive.css (the
    // desktop layout layer) has one source of truth for colour. Layout only —
    // nothing here changes the phone view. See src/responsive.css.
    const tokens = {
      "--rl-ink": C.foam, "--rl-mist": C.mist, "--rl-line": C.line,
      "--rl-glow": C.glow, "--rl-accent": C.accent, "--rl-bg0": C.bg0, "--rl-bg1": C.bg1,
      "--rl-panel": C.panel || "rgba(255,255,255,.03)", "--rl-shelf": C.shelf || "rgba(255,255,255,.03)",
      "--rl-raise": C.raise || C.shelf || "rgba(255,255,255,.05)",
      "--rl-ok": C.ok, "--rl-gold": C.gold, "--rl-coral": C.coral, "--rl-abyss": C.abyss,
    };
    for (const [k, v] of Object.entries(tokens)) if (v) root.style.setProperty(k, v);
  }, [theme]);

  return (
    <>
      <style>{`
        @keyframes mfall { to { transform: translateY(420px) rotate(540deg); opacity: 0 } }
        @keyframes mrise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
        @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important } }
        button:focus-visible, div:focus-visible, [tabindex]:focus-visible { outline: 2px solid ${C.glow}; outline-offset: 2px }
      `}</style>
      <ReaderApp
        content={content}
        C={C}
        theme={theme}
        onSetTheme={setTheme}
        renderItemBody={(item, s) => <ItemBody item={item} {...s} />}
        grade={gradeItem}
        canSubmit={canSubmitShared}
        initAnswer={initAnswerShared}
        CreatureArt={CreatureArt}
        creatures={CREATURES}
        InteractiveLab={InteractiveLab}
        ComparisonCard={ComparisonCard}
        ComparisonSelector={ComparisonSelector}
        comparisonCards={COMPARISON_CARDS}
        UpdatesControl={UpdatesControl}
        flashcards={FLASHCARDS}
      />
    </>
  );
}
