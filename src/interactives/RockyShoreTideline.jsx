import React from "react";
import { LinkedControl } from "./LinkedControl.jsx";
import {
  ORGANISMS, LOW_MARK, HIGH_MARK, waterHeight, organismState,
  intertidalExposed, underStress, stressCaption, intertidalExposedAtLowTide,
} from "./rockyShore.js";

// Driver label for the tide state.
function tideName(t) {
  if (t <= 10) return "Low tide";
  if (t >= 90) return "High tide";
  return "Mid-tide";
}

const SVG_W = 560;
const SVG_H = 320;
const yOf = (h) => 300 - (Math.max(0, Math.min(100, h)) / 100) * 280;

function organismIcon(id) {
  switch (id) {
    case "limpet":
      return <path d="M-10 0 q10 -13 20 0 z" fill="#c8b48a" stroke="#8c744a" strokeWidth="1.5" />;
    case "mussel":
      return <g><ellipse cx="-4" cy="0" rx="6" ry="10" fill="#2b3d54" transform="rotate(-18 -4 0)" /><ellipse cx="5" cy="0" rx="6" ry="10" fill="#33465f" transform="rotate(14 5 0)" /></g>;
    case "fucus":
      return <g stroke="#6a7d33" strokeWidth="3" fill="none" strokeLinecap="round">
        <path d="M0 0 q-10 -14 -4 -28" /><path d="M0 0 q10 -12 5 -26" /><path d="M0 0 q0 -16 0 -30" />
        <circle cx="0" cy="2" r="3" fill="#6a5233" stroke="none" /></g>;
    case "anemone":
      return <g><ellipse cx="0" cy="6" rx="22" ry="7" fill="#2fb7c8" opacity=".45" />
        <g stroke="#e08aa6" strokeWidth="2.4" strokeLinecap="round">
          <path d="M0 2 v-12" /><path d="M0 2 l-7 -10" /><path d="M0 2 l7 -10" /><path d="M0 2 l-11 -6" /><path d="M0 2 l11 -6" /></g>
        <ellipse cx="0" cy="3" rx="6" ry="4" fill="#c25f81" /></g>;
    case "starfish":
      return <path d="M0 -12 L3 -4 12 -4 5 2 8 11 0 5 -8 11 -5 2 -12 -4 -3 -4 Z" fill="#f0885c" stroke="#b95a34" strokeWidth="1" />;
    default:
      return null;
  }
}

function RockyShoreScene(tide) {
  const waterY = yOf(waterHeight(tide));
  const bands = [
    { label: "Supratidal", y: (yOf(100) + yOf(HIGH_MARK)) / 2 },
    { label: "Intertidal", y: (yOf(HIGH_MARK) + yOf(LOW_MARK)) / 2 },
    { label: "Subtidal", y: (yOf(LOW_MARK) + yOf(0)) / 2 },
  ];
  return (
    <svg className="rocky-scene" viewBox={`0 0 ${SVG_W} ${SVG_H}`} role="img"
      aria-label={`Rocky shore at ${tideName(tide).toLowerCase()}; ${Math.round(intertidalExposed(tide) * 100)}% of the intertidal is out of the water.`}>
      <defs>
        <linearGradient id="rs-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1a5e78" /><stop offset="1" stopColor="#0d4a63" /></linearGradient>
        <linearGradient id="rs-rock" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#5b5147" /><stop offset="1" stopColor="#3c3831" /></linearGradient>
      </defs>
      <rect width={SVG_W} height={SVG_H} rx="18" fill="url(#rs-sky)" />

      {/* zone bands + labels (right side) */}
      {[yOf(HIGH_MARK), yOf(LOW_MARK)].map((y, i) => (
        <line key={i} x1="0" x2={SVG_W} y1={y} y2={y} stroke="#d9f6f2" strokeDasharray="2 8" opacity=".25" />
      ))}
      {bands.map((b) => (
        <text key={b.label} x={SVG_W - 16} y={b.y} textAnchor="end" className="rs-zone">{b.label}</text>
      ))}

      {/* rock cliff on the left */}
      <path d="M0 20 L150 20 Q205 90 190 170 Q178 236 205 300 L0 300 Z" fill="url(#rs-rock)" />

      {/* water up to the tide line (covers rock + open sea below the line) */}
      <rect x="0" y={waterY} width={SVG_W} height={SVG_H - waterY} fill="#2a93ad" opacity=".55" />
      <path d={`M0 ${waterY} q35-7 70 0 t70 0 t70 0 t70 0 t70 0 t70 0 t70 0 t70 0`} fill="none" stroke="#bfeff4" strokeWidth="2.5" opacity=".7" />
      <text x={SVG_W - 16} y={waterY - 7} textAnchor="end" className="rs-tideline">tide line</text>

      {/* tide marks */}
      {[["high-tide mark", HIGH_MARK], ["low-tide mark", LOW_MARK]].map(([label, m]) => (
        <g key={label}>
          <line x1="210" x2={SVG_W - 90} y1={yOf(m)} y2={yOf(m)} stroke="#f3c34e" strokeDasharray="5 5" opacity=".55" />
          <text x="214" y={yOf(m) - 5} className="rs-mark">{label}</text>
        </g>
      ))}

      {/* organisms */}
      {ORGANISMS.map((o) => {
        const st = organismState(o.id, tide);
        return (
          <g key={o.id} className={`rs-organism${st.stressed ? " is-stressed" : ""}`} transform={`translate(${o.x} ${yOf(o.height)})`}>
            {organismIcon(o.id)}
          </g>
        );
      })}

      {/* caption naming the current limit */}
      <text x="16" y={SVG_H - 12} className="rs-caption">{stressCaption(tide)}</text>
    </svg>
  );
}

export function RockyShoreTideline() {
  const driver = {
    kind: "slider",
    min: 0,
    max: 100,
    value: 45,
    step: 5,
    label: "Tide",
    minLabel: "low tide",
    maxLabel: "high tide",
    instruction: "Drag the tide line up and down the shore",
    formatValue: (v) => tideName(v),
  };

  const outputs = [
    {
      id: "exposed",
      label: "Shore exposed to air",
      render: (t) => ({ display: `${Math.round(intertidalExposed(t) * 100)}%`, level: intertidalExposed(t), visualState: "fall" }),
    },
    {
      id: "stress",
      label: "Under stress",
      render: (t) => {
        const n = underStress(t);
        return { display: n === 0 ? "None" : `${n} organism${n > 1 ? "s" : ""}` };
      },
    },
  ];

  const quickCheck = {
    prompt: "Drop the tide to low — expose the whole intertidal zone to the air.",
    test: (t) => intertidalExposedAtLowTide(t),
    feedback: {
      success: "At low tide the intertidal is exposed, so these organisms must survive drying: limpets clamp shut, Fucus has leathery fronds, and anemones shelter in pools.",
      tryAgain: "Lower the tide further to uncover the shore.",
    },
  };

  return (
    <article className="interactive-card rocky-shore">
      <div className="interactive-title-row">
        <div>
          <p className="interactive-kicker">Unit 5 · Rocky shores</p>
          <h2>Rocky-shore zonation: who lives where</h2>
          <p>Move the tide and watch each organism cope or reach the edge of what it can stand.</p>
        </div>
        <span className="interactive-badge">Move the tide</span>
      </div>

      <LinkedControl driver={driver} outputs={outputs} scene={RockyShoreScene} quickCheck={quickCheck} />

      <p className="depth-note">
        Zonation has two limits: organisms are held <strong>up-shore by exposure to air</strong> (drying) and
        <strong> down-shore by predation</strong>. Adaptations cope with exposure — limpets and mussels close their shells,
        anemones shelter in pools, Fucus has leathery fronds and a holdfast. Any figures are illustrative.
      </p>
    </article>
  );
}

export default RockyShoreTideline;
