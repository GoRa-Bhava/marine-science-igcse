import React, { useState } from "react";
import "./interactives.css";
import {
  NODES, EDGES, NODE_BY_ID, webState, affectedCount, caption, edgeBroken,
} from "./foodWeb.js";

const HALF_W = 58;
const HALF_H = 20;

// Trim an arrow so it leaves the prey card and stops just short of the eater
// card, whatever the angle (some links run diagonally across the web).
function arrow(prey, eater) {
  const a = NODE_BY_ID[prey];
  const b = NODE_BY_ID[eater];
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  return {
    x1: a.x + ux * 30,
    y1: a.y + uy * 30,
    x2: b.x - ux * 34,
    y2: b.y - uy * 34,
  };
}

function FoodWebScene({ removed, onToggle }) {
  const state = webState(removed);
  return (
    <svg className="fw-scene" viewBox="0 0 600 440" role="img"
      aria-label="A marine food web; tap a species to remove it and see which organisms lose their food.">
      <defs>
        <linearGradient id="fw-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a2c3e" /><stop offset="1" stopColor="#05161f" />
        </linearGradient>
        <marker id="fw-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#6fd8c8" />
        </marker>
        <marker id="fw-arrow-broken" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#5f7d86" />
        </marker>
      </defs>
      <rect width="600" height="440" rx="20" fill="url(#fw-bg)" />

      {/* Arrows point eaten -> eater (energy direction). */}
      {EDGES.map(([prey, eater]) => {
        const { x1, y1, x2, y2 } = arrow(prey, eater);
        const broken = edgeBroken(prey, removed);
        return (
          <line key={`${prey}-${eater}`} className={`fw-edge${broken ? " is-broken" : ""}`}
            x1={x1} y1={y1} x2={x2} y2={y2}
            markerEnd={`url(#${broken ? "fw-arrow-broken" : "fw-arrow"})`} />
        );
      })}

      {/* Nodes — tap to remove/restore. */}
      {NODES.map((n) => {
        const st = state[n.id];
        const removedNode = st === "removed";
        return (
          <g key={n.id} className={`fw-node is-${st} ${n.role === "producer" ? "is-producer" : ""}`}
            role="button" tabIndex={0}
            aria-pressed={removedNode}
            aria-label={`${n.label}${n.role === "producer" ? " (producer)" : ""}. ${removedNode ? "Removed — tap to restore." : st === "declined" ? "Declined: it has lost all its food." : "Tap to remove."}`}
            onClick={() => onToggle(n.id)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onToggle(n.id); } }}>
            <rect className="fw-card" x={n.x - HALF_W} y={n.y - HALF_H} width={HALF_W * 2} height={HALF_H * 2} rx="11" />
            <text className="fw-label" x={n.x} y={n.y + (n.role === "producer" ? -2 : 5)} textAnchor="middle">{n.label}</text>
            {n.role === "producer" && <text className="fw-role" x={n.x} y={n.y + 12} textAnchor="middle">producer</text>}
            {removedNode && (
              <line className="fw-strike" x1={n.x - HALF_W + 8} y1={n.y} x2={n.x + HALF_W - 8} y2={n.y} />
            )}
          </g>
        );
      })}
    </svg>
  );
}

export function FoodWebRemoval() {
  const [removed, setRemoved] = useState(() => new Set());
  const [answer, setAnswer] = useState(null);

  const toggle = (id) => {
    setRemoved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };
  const reset = () => setRemoved(new Set());

  const n = affectedCount(removed);
  const answered = answer != null;
  const correct = answer === "yes";

  return (
    <article className="interactive-card fw-remove">
      <div className="interactive-title-row">
        <div>
          <p className="interactive-kicker">Unit 4 · Food webs (4.4)</p>
          <h2>Take one species out — who copes, who declines?</h2>
          <p>Tap a species to remove it. Anything that loses all of its food fades; anything with another food source copes.</p>
        </div>
        <span className="interactive-badge">Tap a species</span>
      </div>

      <div className="fw-toolbar">
        <span className="fw-hint" aria-hidden="true">Arrows point from the eaten to the eater (the way energy flows).</span>
        <button type="button" className="fw-reset" onClick={reset} disabled={removed.size === 0}>Reset web</button>
      </div>

      <FoodWebScene removed={removed} onToggle={toggle} />

      <div className="lc-outputs fw-outputs" aria-label="Effect of the removal">
        <article className="lc-output">
          <span className="lc-output-label">Organisms affected</span>
          <strong>{n === 0 ? "None" : `${n} declining`}</strong>
        </article>
        <article className="lc-output fw-caption-cell">
          <span className="lc-output-label">What happens</span>
          <strong aria-live="polite">{caption(removed)}</strong>
        </article>
      </div>

      <div className="lc-check">
        <div>
          <span className="lc-output-label">Quick self-check</span>
          <p>Remove the herring — does the seabird survive?</p>
        </div>
        <div className="melt-options" role="group" aria-label="Answer options">
          {[["yes", "Yes — it also eats crabs"], ["no", "No"]].map(([val, label]) => (
            <button key={val} type="button"
              className={`melt-opt${answer === val ? (val === "yes" ? " is-correct" : " is-wrong") : ""}`}
              onClick={() => setAnswer(val)}>
              {label}
            </button>
          ))}
        </div>
        <p className={`lc-feedback${!answered ? "" : correct ? " is-pass" : " is-try"}`} role="status" aria-live="polite">
          {!answered
            ? "Try removing the herring above, then choose."
            : correct
              ? "The seabird has two food sources, so losing one doesn't starve it."
              : "Look again — the seabird also eats crabs, so it still has food."}
        </p>
      </div>

      <p className="depth-note">
        A food web shows the transfer of energy; each arrow points <strong>from the eaten to the eater</strong>, and every
        chain starts with a <strong>producer</strong> (the diatoms). Removing an organism affects those <strong>above</strong> it
        (that fed on it), not those below. An organism with <strong>two food sources is buffered</strong> — losing one doesn't
        starve it. (Unit 4.4 / LO4.)
      </p>
    </article>
  );
}

export default FoodWebRemoval;
