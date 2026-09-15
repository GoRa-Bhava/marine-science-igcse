import React, { useState } from "react";
import "./interactives.css";
import { floatingLevel, landLevel, iceRemaining, raisesSea, REFERENCE_LEVEL } from "./melt.js";

const BOTTOM = 262;
const LVL = (level) => BOTTOM - (level / 100) * 164;   // level% → y
const REF_Y = LVL(REFERENCE_LEVEL);

// Two tanks side by side with a shared reference line, so the comparison is
// unmistakable. Floating tank's water stays on the line; land tank's rises.
function MeltScene(melt) {
  const r = iceRemaining(melt);
  const waterB = LVL(landLevel(melt));
  // Tank A (floating) berg, centred on the reference line and shrinking with r.
  const aCx = 148;
  const aW = 40 + 60 * r;
  const berg = `M${aCx - aW / 2} ${REF_Y} L${aCx - aW / 3} ${REF_Y - 42 * r} L${aCx + aW / 6} ${REF_Y - 30 * r} L${aCx + aW / 2} ${REF_Y} L${aCx + aW / 3} ${REF_Y + 48 * r} L${aCx - aW / 4} ${REF_Y + 42 * r} Z`;
  // Tank B land ice on a ledge above the water; shrinks with r.
  const ledgeTop = 150;
  const iceW = 30 + 66 * r;
  const iceH = 20 + 46 * r;

  return (
    <svg className="melt-scene" viewBox="0 0 560 300" role="img"
      aria-label={`Two tanks at ${Math.round(melt)}% melted: the floating-ice tank's level is unchanged; the land-ice tank's level has risen.`}>
      <defs>
        <linearGradient id="melt-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#2a93ad" /><stop offset="1" stopColor="#0c3a4f" /></linearGradient>
      </defs>
      <rect width="560" height="300" rx="18" fill="#0d2937" />

      {/* shared reference line across both tanks */}
      <line x1="10" x2="550" y1={REF_Y} y2={REF_Y} stroke="#f3c34e" strokeDasharray="5 5" opacity=".8" />
      <text x="550" y={REF_Y - 6} textAnchor="end" className="melt-ref">reference level</text>

      {/* ---- Tank A: floating ice ---- */}
      <g>
        <rect x="26" y="40" width="240" height={BOTTOM - 40} rx="8" fill="#0a1f2b" stroke="#3b6274" strokeWidth="2" />
        <clipPath id="clipA"><rect x="28" y="42" width="236" height={BOTTOM - 44} rx="7" /></clipPath>
        <g clipPath="url(#clipA)">
          {/* berg first, then translucent water so the tip shows above the line */}
          <path d={berg} fill="#eaf6f5" stroke="#bcd7db" strokeWidth="1.5" />
          <rect x="28" y={REF_Y} width="236" height={BOTTOM - REF_Y} fill="url(#melt-water)" opacity=".7" />
        </g>
        <text x="146" y="32" textAnchor="middle" className="melt-tank-label">Sea ice (floating)</text>
      </g>

      {/* ---- Tank B: land ice ---- */}
      <g>
        <rect x="294" y="40" width="240" height={BOTTOM - 40} rx="8" fill="#0a1f2b" stroke="#3b6274" strokeWidth="2" />
        <clipPath id="clipB"><rect x="296" y="42" width="236" height={BOTTOM - 44} rx="7" /></clipPath>
        <g clipPath="url(#clipB)">
          {/* water (rises with melt) */}
          <rect x="296" y={waterB} width="236" height={BOTTOM - waterB} fill="url(#melt-water)" opacity=".7" />
          {/* land ledge on the left, above the water */}
          <path d={`M296 ${BOTTOM} L296 ${ledgeTop} L360 ${ledgeTop} L392 ${BOTTOM} Z`} fill="#5b4a36" stroke="#755c40" strokeWidth="1.5" />
          {/* ice block sitting on the ledge */}
          <path d={`M${328 - iceW / 2} ${ledgeTop} L${328 - iceW / 2 + 6} ${ledgeTop - iceH} L${328 + iceW / 2 - 8} ${ledgeTop - iceH + 4} L${328 + iceW / 2} ${ledgeTop} Z`}
            fill="#eaf6f5" stroke="#bcd7db" strokeWidth="1.5" />
          {/* meltwater drips once melting starts */}
          {melt > 0 && [0, 1, 2].map((i) => (
            <circle key={i} cx={360 + i * 6} cy={ledgeTop + 14 + i * 20} r="2.6" fill="#bfeff4" opacity=".8" />
          ))}
        </g>
        {/* sea-level-rise marker (grows above the reference line) */}
        {landLevel(melt) > REFERENCE_LEVEL + 0.3 && (
          <g>
            <line x1="516" x2="516" y1={REF_Y} y2={waterB} stroke="#7fe0d3" strokeWidth="2" />
            <path d={`M516 ${waterB} l-4 7 l8 0 Z`} fill="#7fe0d3" />
            <text x="512" y={(REF_Y + waterB) / 2 + 3} textAnchor="end" className="melt-rise">sea-level rise</text>
          </g>
        )}
        <text x="414" y="32" textAnchor="middle" className="melt-tank-label">Ice sheet / glacier (on land)</text>
      </g>
    </svg>
  );
}

export function MeltTanks() {
  const [melt, setMelt] = useState(0);
  const [answer, setAnswer] = useState(null);
  const rose = landLevel(melt) > REFERENCE_LEVEL + 0.3;

  return (
    <article className="interactive-card melt-tanks">
      <div className="interactive-title-row">
        <div>
          <p className="interactive-kicker">Units 2 &amp; 6 · Melting ice &amp; sea level</p>
          <h2>Which melting ice raises the sea?</h2>
          <p>Melt the ice in both tanks and compare the water level against the shared reference line.</p>
        </div>
        <span className="interactive-badge">Melt the ice</span>
      </div>

      <div className="lc-driver-heading">
        <div><p className="lc-eyebrow">Melt the ice</p><h3>Melt</h3></div>
        <output className="lc-value" aria-live="polite">{Math.round(melt)}% melted</output>
      </div>

      {MeltScene(melt)}

      <div className="lc-outputs" aria-label="Sea level in each tank">
        <article className="lc-output">
          <span className="lc-output-label">Sea ice (floating)</span>
          <strong>Sea level: no change.</strong>
        </article>
        <article className="lc-output is-rise">
          <span className="lc-output-label">Ice sheet (on land)</span>
          <strong>Sea level: {rose ? "rises." : "watch it rise."}</strong>
          <span className="lc-meter" aria-hidden="true"><span style={{ width: `${(melt)}%` }} /></span>
        </article>
      </div>

      <label className="lc-slider-wrap">
        <span>Drag to melt the ice (and back to re-freeze)</span>
        <input type="range" min="0" max="100" step="5" value={melt}
          aria-label="Melt the ice" onChange={(e) => setMelt(Number(e.target.value))} />
        <span className="lc-range-ends" aria-hidden="true"><span>0% melted</span><span>100% melted</span></span>
      </label>

      <div className="lc-check">
        <div>
          <span className="lc-output-label">Quick self-check</span>
          <p>Which melting ice raises the sea?</p>
        </div>
        <div className="melt-options" role="group" aria-label="Answer options">
          {[["floating", "Floating sea ice"], ["land", "Land ice (glaciers, ice sheets)"]].map(([val, label]) => (
            <button key={val} type="button"
              className={`melt-opt${answer === val ? (raisesSea(val) ? " is-correct" : " is-wrong") : ""}`}
              onClick={() => setAnswer(val)}>
              {label}
            </button>
          ))}
        </div>
        <p className={`lc-feedback${answer == null ? "" : raisesSea(answer) ? " is-pass" : " is-try"}`} role="status" aria-live="polite">
          {answer == null
            ? "Melt the tanks, then choose."
            : raisesSea(answer)
              ? "Land ice adds new water to the sea. Floating ice was already displacing its own mass, so melting it doesn't change the level."
              : "That's the trap — floating ice melting makes no difference; it's land ice that raises the sea."}
        </p>
      </div>

      <p className="depth-note">
        Only melting <strong>land</strong> ice adds water and raises the sea; floating sea ice was already displacing its own
        mass of water, so its meltwater just replaces it. Both meltwaters are fresh, so they lower the sea's salinity and density.
        (Unit 2 practical 2.1 · Unit 6 climate 6.8: sea level also rises from <strong>thermal expansion</strong> as the ocean
        warms — a second cause, not shown here.)
      </p>
    </article>
  );
}

export default MeltTanks;
