import React from "react";
import { LinkedControl } from "./LinkedControl.jsx";

function DepthScene(value) {
  const y = 30 + value / 200 * 150;
  return (
    <svg className="depth-scene" viewBox="0 0 560 210" role="img" aria-label={`A submersible at ${Math.round(value)} metres depth`}>
      <defs>
        <linearGradient id="depth-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2185a1" />
          <stop offset="1" stopColor="#03131e" />
        </linearGradient>
      </defs>
      <rect width="560" height="210" rx="18" fill="url(#depth-water)" />
      <path d="M0 22q35-12 70 0t70 0t70 0t70 0t70 0t70 0t70 0t70 0" fill="none" stroke="#9ee9df" strokeWidth="3" opacity=".65" />
      {[50, 100, 150, 200].map((depth) => (
        <g key={depth} opacity=".6">
          <line x1="18" x2="542" y1={30 + depth / 200 * 150} y2={30 + depth / 200 * 150} stroke="#d9f6f2" strokeDasharray="4 8" />
          <text x="522" y={25 + depth / 200 * 150} fill="#d9f6f2" fontSize="12">{depth} m</text>
        </g>
      ))}
      <g className="depth-sub" transform={`translate(224 ${y})`}>
        <ellipse rx="38" ry="17" fill="#f3c34e" />
        <path d="M-12-14q12-19 25 0" fill="#78d9d0" stroke="#f3c34e" strokeWidth="5" />
        <circle cx="-18" r="7" fill="#092d42" /><circle r="7" fill="#092d42" /><circle cx="18" r="7" fill="#092d42" />
        <path d="M38 0h24l13-12v24L62 0" fill="#f3c34e" />
      </g>
    </svg>
  );
}

export function DepthSliderDemo() {
  const driver = {
    kind: "slider",
    min: 0,
    max: 200,
    value: 40,
    step: 5,
    label: "Ocean depth",
    unit: "m",
    minLabel: "surface",
    maxLabel: "200 m",
  };
  const outputs = [
    {
      id: "pressure",
      label: "Approx. pressure",
      render: (depth) => ({ display: `${(1 + depth / 10).toFixed(1)} atm`, level: depth / 200 }),
    },
    {
      id: "light",
      label: "Light remaining",
      render: (depth) => {
        const light = Math.exp(-depth / 42);
        return { display: `${Math.round(light * 100)}%`, level: light, visualState: light < 0.1 ? "deep" : "lit" };
      },
    },
  ];

  return (
    <article className="interactive-card reuse-demo">
      <div className="interactive-title-row">
        <div>
          <p className="interactive-kicker">Reuse proof · compact stub</p>
          <h2>Depth changes pressure and light</h2>
          <p>The same component now uses a normal slider and two different outputs.</p>
        </div>
        <span className="interactive-badge">Same control</span>
      </div>
      <LinkedControl driver={driver} outputs={outputs} scene={DepthScene} />
    </article>
  );
}

export default DepthSliderDemo;
