import React from "react";
import { LinkedControl } from "./LinkedControl.jsx";
import {
  salinityLevel, salinityBand, temperatureSwing, temperatureStabilityBand,
  oxygenLevel, oxygenBand, tideName, saltiest,
} from "./estuary.js";

const SVG_W = 560;
const SVG_H = 270;
const SAMPLE_X = 300;                 // fixed mid-estuary sampling point
const SURFACE_LOW = 168;              // y of the water surface at low tide
const SURFACE_HIGH = 84;              // y of the water surface at high tide

// Estuary cross-section along its length: river (fresh) on the left, open sea on
// the right. As the tide rises the water level lifts, the salt-water front pushes
// inland (leftwards) and the mudflats submerge.
function EstuaryScene(tide) {
  const t = Math.max(0, Math.min(100, tide)) / 100;
  const surfaceY = SURFACE_LOW - t * (SURFACE_LOW - SURFACE_HIGH);
  const frontX = 540 - t * (540 - 150);   // salt front moves inland as tide rises
  // Bed rises on the river (left) side and deepens toward the sea (right).
  const bed = "M0 120 L120 150 L300 188 L560 224 L560 270 L0 270 Z";

  return (
    <svg className="estuary-scene" viewBox={`0 0 ${SVG_W} ${SVG_H}`} role="img"
      aria-label={`Estuary at ${tideName(tide).toLowerCase()}; sea water reaches ${Math.round(100 - t * 100)}% of the way to the river.`}>
      <defs>
        <linearGradient id="est-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#1a5e78" /><stop offset="1" stopColor="#0d4a63" />
        </linearGradient>
        <linearGradient id="est-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a93ad" /><stop offset="1" stopColor="#0a3346" />
        </linearGradient>
      </defs>

      <rect width={SVG_W} height={SVG_H} rx="18" fill="url(#est-sky)" />

      {/* water body from the current surface to the bottom */}
      <rect x="0" y={surfaceY} width={SVG_W} height={SVG_H - surfaceY} fill="url(#est-water)" />
      {/* salt-water region (toward the sea, right of the front) */}
      <rect x={frontX} y={surfaceY} width={SVG_W - frontX} height={SVG_H - surfaceY} fill="#2fb7c8" opacity=".34" />
      <line x1={frontX} y1={surfaceY} x2={frontX} y2={SVG_H} stroke="#bfeff4" strokeDasharray="4 6" opacity=".8" />
      <text x={frontX} y={surfaceY - 6} textAnchor="middle" className="estuary-front">salt-water front</text>

      {/* surface ripple */}
      <path d={`M0 ${surfaceY} q35-8 70 0 t70 0 t70 0 t70 0 t70 0 t70 0 t70 0 t70 0`} fill="none" stroke="#bfeff4" strokeWidth="2.5" opacity=".55" />

      {/* mud / bed (drawn over water so shallow banks show as exposed mud) */}
      <path d={bed} fill="#5a4632" />
      <path d={bed} fill="none" stroke="#755c40" strokeWidth="2" opacity=".7" />

      {/* mangroves on the river-side bank */}
      {[46, 84].map((x) => (
        <g key={x} transform={`translate(${x} 132)`}>
          <path d="M0 0 l-8 16 M0 0 l8 16 M0 0 v18" stroke="#6a5233" strokeWidth="3" fill="none" />
          <circle cy="-6" r="12" fill="#3f7d4e" /><circle cx="-9" cy="2" r="9" fill="#356c43" /><circle cx="9" cy="2" r="9" fill="#356c43" />
        </g>
      ))}

      {/* end labels */}
      <text x="16" y="30" className="estuary-end">River (fresh)</text>
      <text x={SVG_W - 16} y="30" textAnchor="end" className="estuary-end">Open sea</text>

      {/* fixed sampling point, mid-estuary */}
      <line x1={SAMPLE_X} y1="40" x2={SAMPLE_X} y2="250" stroke="#f3c34e" strokeDasharray="3 5" opacity=".85" />
      <circle cx={SAMPLE_X} cy={surfaceY} r="6" fill="#f3c34e" stroke="#0a3346" strokeWidth="2" />
      <text x={SAMPLE_X + 9} y="52" className="estuary-sample">sampling point</text>
    </svg>
  );
}

export function EstuaryTidalSlider() {
  const driver = {
    kind: "slider",
    min: 0,
    max: 100,
    value: 20,
    step: 5,
    label: "Tide",
    minLabel: "low tide",
    maxLabel: "high tide",
    instruction: "Drag the tide from low to high",
    formatValue: (v) => tideName(v),
  };

  const outputs = [
    {
      id: "salinity",
      label: "Salinity",
      render: (t) => ({ display: salinityBand(t), level: salinityLevel(t), visualState: "rise" }),
    },
    {
      id: "temp",
      label: "Temperature stability",
      // The meter shows the SWING: wide at low tide, narrowing as the tide rises.
      render: (t) => ({ display: temperatureStabilityBand(t), level: temperatureSwing(t), visualState: "fall" }),
    },
    {
      id: "oxygen",
      label: "Dissolved oxygen (relative)",
      render: (t) => ({ display: oxygenBand(t), level: oxygenLevel(t), visualState: "rise" }),
    },
  ];

  const quickCheck = {
    prompt: "Set the tide to when the estuary water is saltiest.",
    test: (t) => saltiest(t),
    feedback: {
      success: "At high tide the sea pushes salty water up the estuary, so salinity is highest here — not at low tide.",
      tryAgain: "Think about when sea water floods in — raise the tide.",
    },
  };

  return (
    <article className="interactive-card estuary-slider">
      <div className="interactive-title-row">
        <div>
          <p className="interactive-kicker">Unit 5 · Mangrove forest &amp; estuaries</p>
          <h2>Estuary tides: what the water is like</h2>
          <p>Move the tide from low to high and watch the conditions at a fixed point mid-estuary.</p>
        </div>
        <span className="interactive-badge">Move the tide</span>
      </div>

      <LinkedControl driver={driver} outputs={outputs} scene={EstuaryScene} quickCheck={quickCheck} />

      <p className="depth-note">
        <strong>Temperature</strong> is shown as stability, not a number: a big volume of sea water at high tide steadies it,
        while shallow water and exposed mud at low tide follow the air. Salinity is also higher nearer the sea. The
        dissolved-oxygen direction follows course reasoning. Figures are illustrative — the pattern is what matters.
      </p>
    </article>
  );
}

export default EstuaryTidalSlider;
