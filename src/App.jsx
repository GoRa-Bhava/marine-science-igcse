import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  answer as scheduleAnswer, isDue, itemStrength, migrateProgress, PROGRESS_VERSION, GOLD_DAYS,
} from "./engine/scheduler.js";

/* ========================================================================
   RETRIEVAL PRACTICE ENGINE — subject content lives in src/content/
   Built in three layers, in this order:
     1. Scheduler engine  (retrieval loop + spaced repetition)
     2. Question shapes   (recognise / retrieve / connect / explain)
     3. Visual + reward   (dive map, ocean discoveries)
   No timers. No lives. No streaks. Nothing is ever taken away.
   ======================================================================== */

/* ---------------------------------------------------------------- tokens */
const C = {
  abyss: "#04141F",
  deep: "#0A2A3D",
  shelf: "#12455F",
  raise: "#17546F",
  line: "#1E6A87",
  foam: "#EAF6F5",
  mist: "#A9C7D2",
  glow: "#4FD8C4",
  glowDim: "#2A9C90",
  coral: "#FF7A5C",
  sand: "#F2D9A8",
  gold: "#F3C34E",
  ok: "#4FD8C4",
  no: "#FF9E7D",
};

const FONT_UI = "'Karla', ui-sans-serif, system-ui, sans-serif";
const FONT_DISPLAY = "'Fraunces Variable', Georgia, serif";

/* ------------------------------------------------------------- content */
/* The engine never names a subject. Everything it shows — topics, items,
   creatures, labels — arrives as data from the active content module.
   See src/content/index.js to switch subject and CONTENT-SPEC.md for the shape. */
import { content } from "./content/index.js";
const { topics: TOPICS, units: UNITS, items: ITEMS, creatures: CREATURES } = content;

const RANK = { choice: 1, gap: 2, match: 3, multi: 3, chain: 4 };
const SHAPE_NAME = {
  choice: "Recognise",
  gap: "Retrieve",
  match: "Connect",
  multi: "Connect",
  chain: "Explain",
};

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

/* ============================================================ 1. ENGINE */
/* Scheduling lives in src/engine/scheduler.js (FSRS). The engine here asks it
   three things: is this item due, what happens after an answer, and how
   strongly an item is held. */
const STORE_KEY = content.storeKey; // names the saved progress; never changes once shipped

function blankProgress() {
  return { items: {}, creatures: [], mastered: [], version: PROGRESS_VERSION };
}

/* Two measures from one pass over a topic's items:
     teal  — completion: the share of questions answered correctly at least
             once (goldDays >= 1). Full = "done".
     gold  — mastery: each item's gold days (distinct days it was got right on
             a scheduled review, capped at GOLD_DAYS) summed over the topic.
             Full = "mastered", which cannot be lost.
   `due` still feeds the "Ready to come back" button. */
function topicStats(topicId, progress) {
  const items = ITEMS.filter((i) => i.topic === topicId);
  const total = items.length;
  let correctOnce = 0, goldSum = 0, seen = 0, due = 0;
  items.forEach((i) => {
    const r = progress.items[i.id];
    if (r && r.seen) { seen++; if (isDue(r)) due++; }
    const gd = r?.goldDays || 0;
    if (gd >= 1) correctOnce++;
    goldSum += Math.min(gd, GOLD_DAYS);
  });
  const blueFrac = total ? correctOnce / total : 0;
  const goldFrac = total ? goldSum / (total * GOLD_DAYS) : 0;
  let state;
  if (seen === 0) state = "unexplored";
  else if (correctOnce < total) state = "inprogress";
  else if (goldFrac < 1) state = "done";
  else state = "mastered";
  return { total, correctOnce, blueFrac, goldFrac, due, seen, state };
}


/* Builds a lesson: due reviews first, then unseen items, ordered up the
   ladder (recognise → retrieve → connect → explain), topics interleaved. */
function buildLesson(progress, topicId = null, size = 7) {
  const pool = ITEMS.filter((i) => (topicId ? i.topic === topicId : true));
  const dueItems = pool.filter((i) => isDue(progress.items[i.id]));
  const fresh = pool.filter((i) => !progress.items[i.id]?.seen);
  const chosen = [...dueItems, ...fresh].slice(0, size);
  if (chosen.length === 0) {
    // everything is scheduled ahead — offer the least-recently-strong items
    const extra = [...pool].sort(
      (a, b) => itemStrength(progress.items[a.id]) - itemStrength(progress.items[b.id])
    );
    chosen.push(...extra.slice(0, size));
  }
  const byRank = {};
  chosen.forEach((i) => {
    const r = RANK[i.type];
    (byRank[r] = byRank[r] || []).push(i);
  });
  const out = [];
  Object.keys(byRank)
    .sort()
    .forEach((r) => {
      const group = byRank[r];
      const buckets = {};
      group.forEach((i) => (buckets[i.topic] = buckets[i.topic] || []).push(i));
      const keys = Object.keys(buckets);
      let added = true;
      while (added) {
        added = false;
        keys.forEach((k) => {
          if (buckets[k].length) {
            out.push(buckets[k].shift());
            added = true;
          }
        });
      }
    });
  return out;
}

/* ------------------------------------------------------------- storage */
async function loadProgress() {
  try {
    const raw = window.localStorage.getItem(STORE_KEY);
    if (raw) {
      const saved = JSON.parse(raw);
      /* Progress saved by the fixed-box scheduler (no version field) is
         converted to FSRS once and written back. Nothing is lost. */
      const { progress, migrated } = migrateProgress({
        ...blankProgress(), ...saved, version: saved.version || 1,
      });
      if (migrated) await saveProgress(progress);
      return progress;
    }
  } catch (e) {
    /* first run, or storage blocked in private browsing */
  }
  return blankProgress();
}
async function saveProgress(p) {
  try {
    window.localStorage.setItem(STORE_KEY, JSON.stringify(p));
  } catch (e) {
    /* keeps working in memory for this session */
  }
}

/* Lets you move progress between devices without a login. */
export function exportProgress() {
  return window.localStorage.getItem(STORE_KEY) || "{}";
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

const sameSet = (a, b) => a.length === b.length && [...a].sort().every((v, i) => v === [...b].sort()[i]);

/* ====================================================== 2. QUESTIONS */

function Prompt({ children }) {
  return (
    <h2 style={{
      fontFamily: FONT_DISPLAY, fontSize: 21, lineHeight: 1.32, color: C.foam,
      fontWeight: 600, margin: "0 0 20px", letterSpacing: "-0.01em",
    }}>{children}</h2>
  );
}

const btnBase = {
  fontFamily: FONT_UI, fontSize: 16, lineHeight: 1.4, width: "100%",
  textAlign: "left", padding: "14px 16px", borderRadius: 14,
  border: `1px solid ${C.line}`, background: C.shelf, color: C.foam,
  cursor: "pointer", marginBottom: 10, transition: "background .12s, border-color .12s",
};

function ChoiceQ({ item, locked, picked, setPicked }) {
  // Options are authored with the answer first; never show them that way.
  const order = useMemo(() => reorder(item.options.map((_, i) => i)), [item.id]);
  return (
    <>
      <Prompt>{item.q}</Prompt>
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
              <span style={{ color: C.glow }}>{a}</span> — {b}
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
              <span style={{ color: C.glow }}>{i + 1}.</span> {c}
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

/* ================================================ 3. VISUAL + REWARD */

function Confetti({ on }) {
  if (!on) return null;
  const bits = Array.from({ length: 26 }, (_, i) => i);
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none", overflow: "hidden", borderRadius: 18 }}>
      {bits.map((i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.25;
        const col = [C.glow, C.coral, C.sand, C.foam][i % 4];
        return (
          <span key={i} style={{
            position: "absolute", left: `${left}%`, top: "-8%", width: 7, height: 11,
            background: col, borderRadius: 2, opacity: 0.95,
            animation: `mfall .95s ${delay}s ease-in forwards`,
          }} />
        );
      })}
    </div>
  );
}

/* Two rings. Teal (inner) fills as questions are answered correctly and locks
   into a solid disc at "done". Gold (outer) then grows by thirds, one for each
   separate day the topic is got right on a scheduled review, and completes
   with a tick at "mastered". Only one ring is ever active, so it stays legible
   at phone size. `size` scales the whole thing (the key uses a small one). */
function DepthNode({ state, blueFrac, goldFrac, size = 56 }) {
  const box = 56, cx = 28, cy = 28, rBlue = 15, rGold = 21;
  const cBlue = 2 * Math.PI * rBlue, cGold = 2 * Math.PI * rGold;
  const svg = { width: size, height: size, viewBox: `0 0 ${box} ${box}`, style: { flexShrink: 0 } };
  if (state === "unexplored") {
    return (
      <svg {...svg}>
        <circle cx={cx} cy={cy} r={rBlue} fill="none" stroke={C.glowDim} strokeWidth="2.5" opacity="0.42" />
      </svg>
    );
  }
  if (state === "inprogress") {
    const sweep = Math.max(0.06, blueFrac);   // always show at least a sliver once started
    return (
      <svg {...svg}>
        <circle cx={cx} cy={cy} r={rBlue} fill="none" stroke={C.glowDim} strokeWidth="2.5" opacity="0.30" />
        <circle cx={cx} cy={cy} r={rBlue} fill="none" stroke={C.glow} strokeWidth="3.6"
          strokeLinecap="round" strokeDasharray={`${cBlue * sweep} ${cBlue}`}
          transform={`rotate(-90 ${cx} ${cy})`} style={{ transition: "stroke-dasharray .3s" }} />
      </svg>
    );
  }
  // "done" or "mastered": solid teal disc with the gold ring around it
  const mastered = state === "mastered";
  return (
    <svg {...svg}>
      <circle cx={cx} cy={cy} r={rGold} fill="none" stroke={C.gold}
        strokeWidth={mastered ? 3.6 : 3.2} opacity={mastered ? 1 : 0.22} />
      {!mastered && goldFrac > 0 && (
        <circle cx={cx} cy={cy} r={rGold} fill="none" stroke={C.gold} strokeWidth="3.6"
          strokeLinecap="round" strokeDasharray={`${cGold * Math.min(1, goldFrac)} ${cGold}`}
          transform={`rotate(-90 ${cx} ${cy})`} style={{ transition: "stroke-dasharray .3s" }} />
      )}
      <circle cx={cx} cy={cy} r="16" fill={C.glow} />
      {mastered && (
        <path d={`M${cx - 7.5} ${cy + 0.5} l5 5 l10 -11`} fill="none" stroke={C.abyss}
          strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
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

function UpdateCheck() {
  const [state, setState] = useState({ kind: "idle" });

  const check = async () => {
    setState({ kind: "checking" });
    try {
      const latest = await fetchLatestBuild();
      setState(latest > BUILD ? { kind: "available", latest } : { kind: "current" });
    } catch (e) {
      setState({ kind: "error" });
    }
  };

  const link = {
    background: "none", border: "none", padding: 0, color: C.glow, cursor: "pointer",
    fontFamily: FONT_UI, fontSize: 12.5, textDecoration: "underline",
  };

  return (
    <div style={{ fontSize: 12.5, color: C.line, lineHeight: 1.6, marginTop: 14, textAlign: "center" }}>
      <div>
        App build {BUILD || "dev"}
        {state.kind === "idle" && <> · <button onClick={check} style={link}>Check for updates</button></>}
      </div>
      {state.kind === "checking" && <div>Checking…</div>}
      {state.kind === "current" && (
        <div>You have the latest version. <button onClick={check} style={link}>Check again</button></div>
      )}
      {state.kind === "error" && (
        <div>Couldn't reach GitHub. Are you online? <button onClick={check} style={link}>Try again</button></div>
      )}
      {state.kind === "available" && (
        <>
          <button onClick={() => { window.location.href = APK_URL; }} style={{
            display: "block", width: "100%", marginTop: 10, padding: 14, borderRadius: 14,
            border: `1px solid ${C.glow}`, background: "rgba(79,216,196,.1)", color: C.foam,
            fontFamily: FONT_UI, fontSize: 15, cursor: "pointer",
          }}>
            Download build {state.latest}
          </button>
          <div style={{ marginTop: 8 }}>
            It downloads in your browser. Open the file when it finishes and tap Install.
            Your progress stays.
          </div>
        </>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------- app */
export default function App() {
  const [progress, setProgress] = useState(blankProgress);
  const [ready, setReady] = useState(false);
  const [view, setView] = useState("map");
  const [queue, setQueue] = useState([]);
  const [qIdx, setQIdx] = useState(0);
  const [locked, setLocked] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [wasRight, setWasRight] = useState(false);
  const [requeued, setRequeued] = useState([]);
  const [sessionLog, setSessionLog] = useState([]);
  const [reveal, setReveal] = useState(null);
  const [newlyMastered, setNewlyMastered] = useState([]);
  const [celebrate, setCelebrate] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    loadProgress().then((p) => { setProgress(p); setReady(true); });
  }, []);

  useEffect(() => { if (ready) saveProgress(progress); }, [progress, ready]);
  useEffect(() => { if (scrollRef.current) scrollRef.current.scrollTop = 0; }, [qIdx, view]);

  const stats = useMemo(
    () => Object.fromEntries(TOPICS.map((t) => [t.id, topicStats(t.id, progress)])),
    [progress]
  );
  const totalDue = TOPICS.reduce((s, t) => s + stats[t.id].due, 0);
  const item = queue[qIdx];

  /* ------------------------------------------------------ start lesson */
  const start = (topicId) => {
    const q = buildLesson(progress, topicId, topicId ? 7 : 8);
    if (!q.length) return;
    setQueue(q); setQIdx(0); setLocked(false); setAnswer(initAnswer(q[0]));
    setRequeued([]); setSessionLog([]); setNewlyMastered([]); setView("lesson");
  };

  function initAnswer(it) {
    if (!it) return null;
    if (it.type === "choice") return null;
    if (it.type === "multi") return [];
    if (it.type === "gap") return it.answers.map(() => null);
    if (it.type === "match") return { links: {}, order: [], sel: null };
    if (it.type === "chain") return [];
    return null;
  }

  const canSubmit = () => {
    if (!item || locked) return false;
    if (item.type === "choice") return answer !== null;
    if (item.type === "multi") return answer.length > 0;
    if (item.type === "gap") return answer.every((a) => a !== null);
    if (item.type === "match") return Object.keys(answer.links).length === item.pairs.length;
    if (item.type === "chain") return answer.length === item.chunks.length;
    return false;
  };

  const grade = () => {
    if (item.type === "choice") return answer === item.a;
    if (item.type === "multi") return sameSet(answer, item.a);
    if (item.type === "gap") return answer.every((a, i) => a === item.answers[i]);
    if (item.type === "match") return item.pairs.every((_, i) => answer.links[i] === i);
    if (item.type === "chain") return answer.every((k, i) => k === i);
    return false;
  };

  const submit = () => {
    if (!canSubmit()) return;
    const right = grade();
    setWasRight(right);
    setLocked(true);
    setSessionLog((l) => [...l, { id: item.id, right }]);

    setProgress((p) => {
      const next = { ...p, items: { ...p.items } };
      const isRetry = requeued.includes(item.id);
      const rec = p.items[item.id];
      /* The scheduler decides what an answer means: a due or new item is
         reviewed either way, an early wrong answer is a lapse, and an early
         right answer changes nothing (same-day practice is not spacing). */
      if (!isRetry) next.items[item.id] = scheduleAnswer(rec, right);

      /* ocean discoveries: weighted by correctness, never guaranteed */
      if (right) {
        const acc = sessionLog.length
          ? (sessionLog.filter((s) => s.right).length + 1) / (sessionLog.length + 1)
          : 1;
        const owned = p.creatures;
        const chance = 0.13 + 0.2 * acc;
        if (owned.length < CREATURES.length && Math.random() < chance) {
          const masteredCount = TOPICS.filter((t) => topicStats(t.id, next).state === "mastered").length;
          const prog = masteredCount / TOPICS.length;
          const roll = Math.random();
          const tier = roll < 0.05 + 0.35 * prog ? "rare" : roll < 0.35 + 0.3 * prog ? "uncommon" : "common";
          let pool = CREATURES.filter((c) => c.rarity === tier && !owned.includes(c.id));
          if (!pool.length) pool = CREATURES.filter((c) => !owned.includes(c.id));
          if (pool.length) {
            const pick = pool[Math.floor(Math.random() * pool.length)];
            next.creatures = [...owned, pick.id];
            setTimeout(() => setReveal(pick), 480);
          }
        }
      }

      /* mastery crossings */
      const crossed = TOPICS.filter(
        (t) => topicStats(t.id, next).state === "mastered" && !p.mastered.includes(t.id)
      ).map((t) => t.id);
      if (crossed.length) {
        next.mastered = [...p.mastered, ...crossed];
        setNewlyMastered((m) => [...m, ...crossed]);
        setCelebrate(true);
        setTimeout(() => setCelebrate(false), 1100);
      }
      return next;
    });

    if (!right && !requeued.includes(item.id)) {
      setRequeued((r) => [...r, item.id]);
      setQueue((q) => [...q, item]);
    }
  };

  const next = () => {
    const n = qIdx + 1;
    if (n >= queue.length) { setView("result"); return; }
    setQIdx(n); setLocked(false); setAnswer(initAnswer(queue[n]));
  };

  /* ---------------------------------------------------------- shells */
  const shell = {
    fontFamily: FONT_UI, maxWidth: 480, margin: "0 auto", minHeight: "100dvh",
    background: `linear-gradient(${C.deep} 0%, ${C.abyss} 60%)`,
    color: C.foam, position: "relative",
  };

  const keyframes = `
    @keyframes mfall { to { transform: translateY(420px) rotate(540deg); opacity: 0 } }
    @keyframes mrise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
    @media (prefers-reduced-motion: reduce) { *, *::before, *::after { animation: none !important } }
    button:focus-visible, div:focus-visible { outline: 2px solid ${C.glow}; outline-offset: 2px }
  `;

  if (!ready) {
    return (
      <div style={{ ...shell, display: "grid", placeItems: "center" }}>
        <p style={{ color: C.mist }}>Loading your progress…</p>
      </div>
    );
  }

  /* --------------------------------------------------------- map view */
  if (view === "map") {
    const masteredCount = TOPICS.filter((t) => stats[t.id].state === "mastered").length;
    return (
      <div style={shell} ref={scrollRef}>
        <style>{keyframes}</style>
        <div style={{ padding: "34px 22px 12px" }}>
          <p style={{ fontSize: 13, color: C.glow, margin: "0 0 6px", letterSpacing: ".04em" }}>
            {content.title} · {content.subtitle}
          </p>
          <h1 style={{
            fontFamily: FONT_DISPLAY, fontSize: 34, lineHeight: 1.08, fontWeight: 600,
            margin: "0 0 10px", letterSpacing: "-0.02em",
          }}>
            {content.headline}
          </h1>
          <p style={{ fontSize: 15, color: C.mist, margin: 0, lineHeight: 1.5 }}>
            {masteredCount} of {TOPICS.length} topics mastered · {progress.creatures.length} of {CREATURES.length} {content.collection.noun} found
          </p>
        </div>

        {totalDue > 0 && (
          <div style={{ padding: "14px 22px 4px" }}>
            <button onClick={() => start(null)} style={{
              width: "100%", textAlign: "left", padding: "18px 20px", borderRadius: 16,
              border: `1px solid ${C.glow}`, background: "rgba(79,216,196,.1)", color: C.foam,
              cursor: "pointer", fontFamily: FONT_UI,
            }}>
              <span style={{ fontFamily: FONT_DISPLAY, fontSize: 20, fontWeight: 600, display: "block" }}>
                Ready to come back
              </span>
              <span style={{ fontSize: 14, color: C.mist }}>
                {totalDue} question{totalDue > 1 ? "s" : ""} due across your topics
              </span>
            </button>
          </div>
        )}

        <div style={{ padding: "18px 22px 8px" }}>
          {UNITS.map((u) => {
            const list = TOPICS.filter((t) => t.unit === u.n);
            const done = list.filter((t) => stats[t.id].state === "mastered").length;
            return (
              <div key={u.n}>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "baseline",
                  margin: "6px 0 16px", paddingBottom: 8, borderBottom: `1px solid ${C.shelf}`,
                }}>
                  <span style={{ fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 600, color: C.glow }}>
                    {u.title || `Unit ${u.n} · ${u.name}`}
                  </span>
                  <span style={{ fontSize: 12, color: C.line }}>{done}/{list.length}</span>
                </div>
                {list.map((t, idx) => {
                  const s = stats[t.id];
                  return (
                    <div key={t.id} style={{ display: "flex", gap: 14, alignItems: "stretch" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 56 }}>
                        <DepthNode state={s.state} blueFrac={s.blueFrac} goldFrac={s.goldFrac} />
                        {idx < list.length - 1 && (
                          <div style={{ flex: 1, width: 2, background: C.line, opacity: 0.6, minHeight: 26 }} />
                        )}
                      </div>
                      <button onClick={() => start(t.id)} style={{
                        flex: 1, textAlign: "left", background: "transparent", border: "none",
                        padding: "2px 0 24px", cursor: "pointer", color: C.foam, fontFamily: FONT_UI,
                      }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
                          <span style={{ fontFamily: FONT_DISPLAY, fontSize: 19, fontWeight: 600, lineHeight: 1.2 }}>
                            {t.name}
                          </span>
                          <span style={{ fontSize: 12, color: C.line, maxWidth: "42%", textAlign: "right", lineHeight: 1.3 }}>{t.depth}</span>
                        </div>
                        <div style={{ fontSize: 13.5, color: s.state === "mastered" ? C.gold : C.mist, marginTop: 4 }}>
                          {s.state === "unexplored" ? "Unexplored"
                            : s.state === "inprogress" ? `In progress · ${s.correctOnce} of ${s.total}`
                            : s.state === "done" ? "Done · not yet mastered"
                            : "Mastered"}
                        </div>
                      </button>
                    </div>
                  );
                })}
                <div style={{ height: 14 }} />
              </div>
            );
          })}
        </div>

        <div style={{ padding: "0 22px 40px" }}>
          <button onClick={() => setView("collection")} style={{
            width: "100%", padding: "16px", borderRadius: 14, border: `1px solid ${C.line}`,
            background: C.shelf, color: C.foam, fontFamily: FONT_UI, fontSize: 15, cursor: "pointer",
          }}>
            {content.collection.title} · {progress.creatures.length}/{CREATURES.length}
          </button>
          <div style={{
            marginTop: 18, padding: "12px 14px 6px", borderRadius: 14,
            border: `1px solid ${C.shelf}`, background: "rgba(18,69,95,.25)",
          }}>
            <p style={{ fontSize: 12.5, color: C.line, margin: "0 0 10px", textAlign: "center" }}>
              No timers, no lives, no streaks.
            </p>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
              <DepthNode state="inprogress" blueFrac={0.6} goldFrac={0} size={34} />
              <p style={{ fontSize: 12.5, color: C.mist, margin: 0, lineHeight: 1.45 }}>
                <span style={{ color: C.glow }}>Teal ring</span> fills with every question you get right.
                Full once you have answered them all: <span style={{ color: C.foam }}>Done</span>.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 8 }}>
              <DepthNode state="done" blueFrac={1} goldFrac={0.67} size={34} />
              <p style={{ fontSize: 12.5, color: C.mist, margin: 0, lineHeight: 1.45 }}>
                <span style={{ color: C.gold }}>Gold ring</span> grows each day you get a done topic right again.
                Full after three correct days: <span style={{ color: C.gold }}>Mastered</span>, and once earned it stays.
              </p>
            </div>
          </div>
          {IS_NATIVE && <UpdateCheck />}
        </div>
      </div>
    );
  }

  /* -------------------------------------------------- collection view */
  if (view === "collection") {
    return (
      <div style={shell} ref={scrollRef}>
        <style>{keyframes}</style>
        <div style={{ padding: "30px 22px 10px" }}>
          <button onClick={() => setView("map")} style={{
            background: "none", border: "none", color: C.glow, fontFamily: FONT_UI,
            fontSize: 15, padding: 0, cursor: "pointer", marginBottom: 16,
          }}>← Back</button>
          <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 600, margin: "0 0 6px" }}>
            {content.collection.title}
          </h1>
          <p style={{ fontSize: 14.5, color: C.mist, margin: 0 }}>
            {progress.creatures.length} of {CREATURES.length} found. {content.collection.blurb}
          </p>
        </div>
        <div style={{ padding: "20px 22px 44px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {CREATURES.map((c) => {
            const owned = progress.creatures.includes(c.id);
            return (
              <div key={c.id} style={{
                borderRadius: 16, padding: 14, minHeight: 190,
                border: `1px solid ${owned ? C.line : "rgba(30,106,135,.4)"}`,
                background: owned ? C.shelf : "rgba(18,69,95,.25)",
                display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center",
              }}>
                <div style={{ opacity: owned ? 1 : 0.13, filter: owned ? "none" : "grayscale(1)" }}>
                  <CreatureArt id={c.id} size={92} />
                </div>
                <p style={{
                  fontFamily: FONT_DISPLAY, fontSize: 15, fontWeight: 600, margin: "6px 0 3px",
                  color: owned ? C.foam : C.line,
                }}>
                  {owned ? c.name : "Undiscovered"}
                </p>
                <p style={{ fontSize: 11.5, color: owned ? C.glow : C.line, margin: 0 }}>{c.rarity}</p>
                {owned && (
                  <p style={{ fontSize: 12, color: C.mist, lineHeight: 1.45, marginTop: 7 }}>{c.fact}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------ result view */
  if (view === "result") {
    const right = sessionLog.filter((s) => s.right).length;
    const missed = sessionLog.filter((s) => !s.right).length;
    return (
      <div style={{ ...shell, display: "flex", flexDirection: "column", justifyContent: "center", padding: "40px 24px" }}>
        <style>{keyframes}</style>
        <h1 style={{ fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 600, margin: "0 0 14px", lineHeight: 1.15 }}>
          Lesson done
        </h1>
        <p style={{ fontSize: 16.5, color: C.mist, lineHeight: 1.6, margin: "0 0 8px" }}>
          {right} answered from memory{missed > 0 && `, ${missed} not yet`}.
        </p>
        {missed > 0 && (
          <p style={{ fontSize: 15, color: C.glow, lineHeight: 1.6, margin: "0 0 8px" }}>
            The ones you missed come back tomorrow.
          </p>
        )}
        {newlyMastered.length > 0 && (
          <p style={{ fontSize: 15, color: C.coral, lineHeight: 1.6, margin: "0 0 8px" }}>
            Now mastered: {newlyMastered.map((id) => TOPICS.find((t) => t.id === id).name).join(", ")}.
          </p>
        )}
        <div style={{ marginTop: 28 }}>
          <button onClick={() => setView("map")} style={{
            width: "100%", padding: "16px", borderRadius: 14, border: "none",
            background: C.glow, color: C.abyss, fontFamily: FONT_UI, fontSize: 16,
            fontWeight: 600, cursor: "pointer", marginBottom: 10,
          }}>
            Back to the map
          </button>
          <button onClick={() => start(null)} style={{
            width: "100%", padding: "15px", borderRadius: 14, border: `1px solid ${C.line}`,
            background: "transparent", color: C.foam, fontFamily: FONT_UI, fontSize: 15, cursor: "pointer",
          }}>
            Another lesson
          </button>
        </div>
      </div>
    );
  }

  /* ------------------------------------------------------ lesson view */
  const topic = TOPICS.find((t) => t.id === item.topic);
  const pct = ((qIdx) / queue.length) * 100;

  return (
    <div style={{ ...shell, display: "flex", flexDirection: "column" }}>
      <style>{keyframes}</style>

      <div style={{ padding: "22px 22px 0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <button onClick={() => setView("map")} style={{
            background: "none", border: "none", color: C.mist, fontSize: 22,
            padding: 0, cursor: "pointer", lineHeight: 1,
          }} aria-label="Leave lesson">×</button>
          <div style={{ flex: 1, height: 6, borderRadius: 3, background: C.shelf, overflow: "hidden" }}>
            <div style={{ width: `${pct}%`, height: "100%", background: C.glow, transition: "width .25s" }} />
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 18 }}>
          <span style={{
            fontSize: 11.5, padding: "3px 9px", borderRadius: 20,
            border: `1px solid ${C.line}`, color: C.glow,
          }}>{SHAPE_NAME[item.type]}</span>
          <span style={{ fontSize: 12.5, color: C.line }}>{topic.name}</span>
        </div>
      </div>

      <div ref={scrollRef} style={{ flex: 1, overflowY: "auto", padding: "0 22px 20px" }}>
        {item.type === "choice" && <ChoiceQ item={item} locked={locked} picked={answer} setPicked={setAnswer} />}
        {item.type === "multi" && <MultiQ item={item} locked={locked} picked={answer} setPicked={setAnswer} />}
        {item.type === "gap" && <GapQ item={item} locked={locked} filled={answer} setFilled={setAnswer} />}
        {item.type === "match" && <MatchQ item={item} locked={locked} state={answer} setState={setAnswer} />}
        {item.type === "chain" && <ChainQ item={item} locked={locked} order={answer} setOrder={setAnswer} />}
      </div>

      <div style={{
        padding: "16px 22px 26px", position: "relative",
        borderTop: locked ? `1px solid ${C.line}` : "none",
        background: locked ? (wasRight ? "rgba(79,216,196,.07)" : "rgba(255,158,125,.06)") : "transparent",
      }}>
        <Confetti on={celebrate} />
        {locked && (
          <div style={{ marginBottom: 14, animation: "mrise .22s ease-out" }}>
            <p style={{
              fontFamily: FONT_DISPLAY, fontSize: 17, fontWeight: 600, margin: "0 0 5px",
              color: wasRight ? C.ok : C.no,
            }}>
              {wasRight ? "That's it" : "Not yet — it'll come back"}
            </p>
            <p style={{ fontSize: 14.5, color: C.foam, lineHeight: 1.5, margin: 0, opacity: 0.9 }}>
              {item.why}
            </p>
          </div>
        )}
        <button
          onClick={locked ? next : submit}
          disabled={!locked && !canSubmit()}
          style={{
            width: "100%", padding: "16px", borderRadius: 14, border: "none",
            fontFamily: FONT_UI, fontSize: 16, fontWeight: 600,
            background: !locked && !canSubmit() ? C.shelf : C.glow,
            color: !locked && !canSubmit() ? C.line : C.abyss,
            cursor: !locked && !canSubmit() ? "default" : "pointer",
          }}>
          {locked ? (qIdx + 1 >= queue.length ? "Finish" : "Next") : "Check"}
        </button>
      </div>

      {reveal && (
        <div style={{
          position: "absolute", inset: 0, background: "rgba(4,20,31,.94)",
          display: "flex", flexDirection: "column", justifyContent: "center",
          alignItems: "center", padding: 32, textAlign: "center", zIndex: 20,
          animation: "mrise .3s ease-out",
        }}>
          <p style={{ fontSize: 13, color: C.glow, letterSpacing: ".05em", margin: "0 0 4px" }}>
            {reveal.rarity} discovery
          </p>
          <CreatureArt id={reveal.id} size={168} />
          <h2 style={{ fontFamily: FONT_DISPLAY, fontSize: 27, fontWeight: 600, margin: "8px 0 10px" }}>
            {reveal.name}
          </h2>
          <p style={{ fontSize: 15.5, color: C.mist, lineHeight: 1.6, margin: "0 0 28px", maxWidth: 340 }}>
            {reveal.fact}
          </p>
          <button onClick={() => setReveal(null)} style={{
            padding: "14px 34px", borderRadius: 14, border: "none", background: C.glow,
            color: C.abyss, fontFamily: FONT_UI, fontSize: 16, fontWeight: 600, cursor: "pointer",
          }}>
            Add to collection
          </button>
        </div>
      )}
    </div>
  );
}
