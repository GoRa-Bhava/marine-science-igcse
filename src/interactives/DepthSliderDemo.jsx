import React from "react";
import { LinkedControl } from "./LinkedControl.jsx";
import {
  MAX_DEPTH, SUNLIGHT_ZONE, TWILIGHT_ZONE,
  lightLevel, lightPercent, pressureAtm, temperatureC, temperatureLevel,
  oxygenLevel, oxygenBand, zoneName, belowSunlightZone,
} from "./depth.js";

const SVG_W = 560;
const SVG_H = 320;
const TOP = 16;
const BOTTOM = 304;
const yOf = (m) => TOP + (Math.max(0, Math.min(MAX_DEPTH, m)) / MAX_DEPTH) * (BOTTOM - TOP);

// A vertical ocean column, 0–1200 m, with three light zones behind it and a
// submarine at the current depth. The water darkens with depth by design.
function DepthScene(depth) {
  const subY = yOf(depth);
  return (
    <svg className="depth-scene" viewBox={`0 0 ${SVG_W} ${SVG_H}`} role="img"
      aria-label={`A submersible at ${Math.round(depth)} metres depth, in the ${zoneName(depth).toLowerCase()}.`}>
      <defs>
        <linearGradient id="depth-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2a93ad" />
          <stop offset="0.42" stopColor="#0d4a63" />
          <stop offset="1" stopColor="#02101a" />
        </linearGradient>
      </defs>
      <rect width={SVG_W} height={SVG_H} rx="18" fill="url(#depth-water)" />

      {/* surface ripple */}
      <path d="M0 18q35-11 70 0t70 0t70 0t70 0t70 0t70 0t70 0t70 0" fill="none" stroke="#9ee9df" strokeWidth="3" opacity=".6" />

      {/* zone boundaries at 200 m and 1000 m */}
      {[SUNLIGHT_ZONE, TWILIGHT_ZONE].map((m) => (
        <g key={m}>
          <line x1="16" x2={SVG_W - 16} y1={yOf(m)} y2={yOf(m)} stroke="#d9f6f2" strokeDasharray="4 7" opacity=".55" />
          <text x={SVG_W - 22} y={yOf(m) - 6} textAnchor="end" className="depth-boundary">{m} m</text>
        </g>
      ))}

      {/* zone labels, one per band */}
      <text x="22" y={yOf(105)} className="depth-zone">Sunlight zone</text>
      <text x="22" y={yOf(600)} className="depth-zone">Twilight zone</text>
      <text x="22" y={yOf(1120)} className="depth-zone">Midnight zone</text>

      {/* submarine at depth */}
      <g className="depth-sub" transform={`translate(300 ${subY})`}>
        <line x1="0" y1={TOP - subY} x2="0" y2="0" stroke="#d9f6f2" strokeDasharray="3 6" opacity=".35" />
        <ellipse rx="40" ry="18" fill="#f3c34e" />
        <path d="M-13-15q13-20 26 0" fill="#78d9d0" stroke="#f3c34e" strokeWidth="5" />
        <circle cx="-19" r="7" fill="#092d42" /><circle r="7" fill="#092d42" /><circle cx="19" r="7" fill="#092d42" />
        <path d="M40 0h25l13-12v24L65 0" fill="#f3c34e" />
      </g>
      <text x="22" y={SVG_H - 12} className="depth-scene-caption">Slide to change depth</text>
    </svg>
  );
}

export function DepthSliderDemo() {
  const driver = {
    kind: "slider",
    min: 0,
    max: MAX_DEPTH,
    value: 60,
    step: 10,
    label: "Ocean depth",
    unit: "m",
    minLabel: "surface",
    maxLabel: "1200 m",
    instruction: "Drag to dive deeper",
  };

  const outputs = [
    {
      id: "light",
      label: "Light remaining",
      render: (d) => ({ display: `${Math.round(lightPercent(d))}% of surface light`, level: lightLevel(d), visualState: "fall" }),
    },
    {
      id: "pressure",
      label: "Pressure ≈ (about 1 atm per 10 m)",
      render: (d) => ({ display: `≈ ${Math.round(pressureAtm(d))} atm`, level: Math.min(1, d / MAX_DEPTH), visualState: "rise" }),
    },
    {
      id: "temp",
      label: "Temperature (typical)",
      render: (d) => ({ display: `≈ ${Math.round(temperatureC(d))} °C`, level: temperatureLevel(d), visualState: "fall" }),
    },
    {
      id: "oxygen",
      label: "Dissolved oxygen (relative)",
      render: (d) => ({ display: oxygenBand(d), level: oxygenLevel(d), visualState: "fall" }),
    },
  ];

  const quickCheck = {
    prompt: "Take the submarine below the sunlight zone — where photosynthesis can no longer happen.",
    test: (d) => belowSunlightZone(d),
    feedback: {
      success: "Below about 200 m there's too little light for photosynthesis, so no oxygen is added here.",
      tryAgain: "Keep going down — the sunlight zone ends around 200 m.",
    },
  };

  return (
    <article className="interactive-card depth-slider">
      <div className="interactive-title-row">
        <div>
          <p className="interactive-kicker">Unit 2 · Effects of increasing depth</p>
          <h2>Going deeper: what changes</h2>
          <p>Slide the submarine down and watch how conditions change through the ocean's light zones.</p>
        </div>
        <span className="interactive-badge">Slide the depth</span>
      </div>

      <LinkedControl driver={driver} outputs={outputs} scene={DepthScene} quickCheck={quickCheck} />

      <p className="depth-note">
        <strong>Salinity</strong> also changes with depth. The figures here are illustrative — the pattern matters, not the exact value.
      </p>
    </article>
  );
}

export default DepthSliderDemo;
