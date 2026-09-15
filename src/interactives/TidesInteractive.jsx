import React, { useState } from "react";
import { LinkedControl } from "./LinkedControl.jsx";
import {
  isTideTarget,
  moonPhase,
  normalizeAngle,
  tidalRangeLevel,
  tidalRangeText,
  tideLabel,
} from "./tides.js";

const CX = 248;
const CY = 206;
const ORBIT = 142;

function TideScene(angle) {
  const theta = normalizeAngle(angle) * Math.PI / 180;
  const moonX = CX + ORBIT * Math.cos(theta);
  const moonY = CY - ORBIT * Math.sin(theta);
  const range = tidalRangeLevel(angle);
  // Exaggerate the bulge so it visibly grows toward spring tides and shrinks
  // toward neap: range runs ~0.43 (neap) to 1 (spring), so rx swings ~87->104
  // and ry ~64->55, i.e. a near-round shape at neap and a strongly stretched
  // one at spring.
  const rx = 74 + range * 30;
  const ry = 70 - range * 15;
  const label = tideLabel(angle);

  return (
    <svg className="tide-scene" viewBox="0 0 600 412" role="img" aria-labelledby="tide-title tide-desc">
      <title id="tide-title">Moon, Earth, Sun and the changing tidal range</title>
      <desc id="tide-desc">The Moon sits at {Math.round(angle)} degrees. The water bulges stay aligned with the Earth–Moon line. Current state: {label}.</desc>
      <defs>
        <radialGradient id="space" cx="42%" cy="42%" r="75%">
          <stop offset="0" stopColor="#12455f" />
          <stop offset="1" stopColor="#03131e" />
        </radialGradient>
        <radialGradient id="earth" cx="36%" cy="30%" r="72%">
          <stop offset="0" stopColor="#62d7d1" />
          <stop offset="0.48" stopColor="#167998" />
          <stop offset="1" stopColor="#072e49" />
        </radialGradient>
        <radialGradient id="sun" cx="35%" cy="32%" r="70%">
          <stop offset="0" stopColor="#fff2b2" />
          <stop offset="1" stopColor="#f3a83b" />
        </radialGradient>
        <filter id="soft-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="6" />
        </filter>
      </defs>

      <rect width="600" height="412" rx="22" fill="url(#space)" />
      <g className="tide-stars" fill="#d9f6f2">
        <circle cx="55" cy="74" r="1.5" /><circle cx="116" cy="330" r="1" />
        <circle cx="338" cy="39" r="1" /><circle cx="477" cy="338" r="1.5" />
        <circle cx="532" cy="77" r="1" /><circle cx="35" cy="205" r="1" />
      </g>

      <g className="tide-sun" aria-label="Sun fixed to the right">
        <circle cx="574" cy={CY} r="47" fill="#f3c34e" opacity=".16" filter="url(#soft-glow)" />
        <circle cx="574" cy={CY} r="29" fill="url(#sun)" />
        <text x="566" y="250" textAnchor="end">SUN</text>
      </g>

      <line x1={CX} y1={CY} x2="548" y2={CY} className="tide-sun-line" />
      <circle cx={CX} cy={CY} r={ORBIT} className="tide-orbit" />

      {[
        [CX + ORBIT, CY, "S"], [CX, CY - ORBIT, "N"],
        [CX - ORBIT, CY, "S"], [CX, CY + ORBIT, "N"],
      ].map(([x, y, mark], index) => (
        <g key={index} className={`tide-snap tide-snap-${mark.toLowerCase()}`}>
          <circle cx={x} cy={y} r="6" />
          <text x={x} y={y - 12} textAnchor="middle">{mark === "S" ? "spring" : "neap"}</text>
        </g>
      ))}

      <ellipse cx={CX} cy={CY} rx="84" ry="67" className="tide-solar-bulge" />
      <ellipse
        cx={CX} cy={CY} rx={rx} ry={ry}
        transform={`rotate(${-angle} ${CX} ${CY})`}
        className="tide-water"
      />

      <g className="tide-earth">
        <circle cx={CX} cy={CY} r="65" fill="url(#earth)" />
        <path d="M211 172c17-18 37-22 51-12 8 6 5 14-5 20-13 7-10 18-22 22-10 4-25-10-24-30Zm71 50c13-7 29 0 31 11 2 12-13 21-25 20-13-1-19-23-6-31Z" fill="#78a85b" opacity=".9" />
        <circle cx="288" cy="166" r="4.5" className="tide-location" />
      </g>

      <line x1={CX} y1={CY} x2={moonX} y2={moonY} className="tide-moon-line" />
      <g className="tide-moon" transform={`translate(${moonX} ${moonY})`}>
        <circle r="29" className="tide-moon-hit" />
        <circle r="19" fill="#e7e1cc" />
        <circle cx="-6" cy="-5" r="4" fill="#b9b4a5" opacity=".75" />
        <circle cx="7" cy="7" r="3" fill="#b9b4a5" opacity=".65" />
      </g>

      <g className="tide-bulge-labels" transform={`rotate(${-angle} ${CX} ${CY})`}>
        <text x={CX + rx + 9} y={CY - 5}>high tide</text>
        <text x={CX - rx - 9} y={CY - 5} textAnchor="end">high tide</text>
      </g>
      <text x="24" y="386" className="tide-scene-caption">Drag the Moon around its orbit</text>
    </svg>
  );
}

export function TidesInteractive() {
  const [target, setTarget] = useState("spring");
  const targetName = target === "spring" ? "spring tide" : "neap tide";

  const driver = {
    kind: "dial",
    min: 0,
    max: 360,
    value: 42,
    step: 3,
    snapPoints: [0, 90, 180, 270],
    snapTolerance: 4,
    label: "Moon position",
    unit: "°",
    dialCenter: { x: CX / 600, y: CY / 412 },
    ariaLabel: "Moon position around Earth",
    instruction: "Drag anywhere around the orbit. The four marked positions are useful targets.",
    formatValue: (value) => `${Math.round(normalizeAngle(value)) % 360}°`,
  };

  const outputs = [
    {
      id: "range",
      label: "Tidal amplitude",
      render: (value) => ({ display: tidalRangeText(value), level: tidalRangeLevel(value) }),
    },
    {
      id: "pattern",
      label: "Tide pattern",
      render: (value) => ({
        display: tideLabel(value),
        visualState: tideLabel(value).startsWith("Spring") ? "spring" : tideLabel(value).startsWith("Neap") ? "neap" : "between",
      }),
    },
    {
      id: "phase",
      label: "Moon phase",
      render: (value) => ({ display: moonPhase(value) }),
    },
  ];

  const quickCheck = {
    prompt: `Move the Moon to make a ${targetName}.`,
    test: (value) => isTideTarget(value, target),
    feedback: {
      success: `Correct — this alignment produces a ${targetName}.`,
      tryAgain: target === "spring"
        ? "Try lining up the Sun, Earth and Moon. New Moon and full Moon both work."
        : "Try placing the Moon at a right angle to the Sun–Earth line. Either quarter Moon works.",
    },
  };

  return (
    <article className="interactive-card tides-interactive">
      <div className="interactive-title-row">
        <div>
          <p className="interactive-kicker">Pilot · Earth in space</p>
          <h2>Tides: drag the Moon</h2>
          <p>See how lunar and solar tidal effects combine as the Moon moves around Earth.</p>
        </div>
        <span className="interactive-badge">Live model</span>
      </div>

      <div className="tide-target-picker" aria-label="Choose a self-check target">
        <span>Challenge:</span>
        {[
          ["spring", "Make a spring tide"],
          ["neap", "Make a neap tide"],
        ].map(([value, label]) => (
          <button
            type="button"
            key={value}
            className={target === value ? "is-active" : ""}
            aria-pressed={target === value}
            onClick={() => setTarget(value)}
          >
            {label}
          </button>
        ))}
      </div>

      <LinkedControl
        driver={driver}
        outputs={outputs}
        scene={TideScene}
        quickCheck={quickCheck}
      />

      <section className="tide-facts" aria-labelledby="tide-facts-title">
        <h3 id="tide-facts-title">What the model shows</h3>
        <div className="tide-fact-grid">
          <p><strong>What makes tides.</strong> The Moon’s gravity pulls on the ocean water (the Sun helps too). As the Earth spins, each coast moves into and out of the raised water, giving about two high tides and two low tides a day.</p>
          <p><strong>Spring tides — the big ones.</strong> When the Sun and Moon line up (new Moon and full Moon), their pulls combine: high tide is higher and low tide is lower — the largest tidal amplitude.</p>
          <p><strong>Neap tides — the small ones.</strong> When the Sun and Moon are at right angles (the quarter Moons), their pulls partly cancel, so the gap between high and low tide is smallest.</p>
          <p><strong>Watch the traps.</strong> “Spring” means the tide springs up, not the season. Spring tides are big because the Sun and Moon line up — not because the Moon comes closer. Both the Moon and the Sun pull on the water; the Moon just has the larger effect.</p>
        </div>
        <p className="tide-model-note">Teaching model: lunar effect + solar effect × cos(2θ). It shows the relative amplitude, not the height or time at any one coast.</p>
      </section>
    </article>
  );
}

export default TidesInteractive;
