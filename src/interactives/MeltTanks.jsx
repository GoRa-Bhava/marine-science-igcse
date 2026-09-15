import React, { useState } from "react";
import "./interactives.css";
import { floatingLevel, landLevel, iceRemaining, raisesSea, REFERENCE_LEVEL } from "./melt.js";

const BOTTOM = 324;
const LVL = (level) => BOTTOM - (level / 100) * 196;   // level% → y
const REF_Y = LVL(REFERENCE_LEVEL);

// Two tanks side by side with a shared reference line, so the comparison is
// unmistakable. Floating tank's water stays on the line; land tank's rises.
function MeltScene(melt) {
  const r = iceRemaining(melt);
  const waterA = LVL(floatingLevel(melt));
  const waterB = LVL(landLevel(melt));
  const meltProgress = 1 - r;
  // Ice mass is three-dimensional: a cube-root scale keeps the remaining ice
  // readable until the last part melts, while still reaching zero at full melt.
  const iceScale = Math.cbrt(Math.max(0, r));
  const iceOpacity = r > 0 ? Math.min(1, r * 8) : 0;
  const brashOpacity = Math.sin(Math.PI * meltProgress) * 0.8;
  const streamOpacity = Math.min(1, meltProgress * 1.6);
  const riseVisible = landLevel(melt) > REFERENCE_LEVEL + 0.3;

  return (
    <svg className="melt-scene" viewBox="0 0 600 360" role="img"
      aria-label={`Two tanks at ${Math.round(melt)}% melted: the floating-ice tank's level is unchanged; the land-ice tank's level has risen.`}>
      <defs>
        <linearGradient id="melt-scene-bg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#102f40" /><stop offset="1" stopColor="#061b28" />
        </linearGradient>
        <linearGradient id="melt-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2e9fba" /><stop offset=".18" stopColor="#187890" /><stop offset="1" stopColor="#082d43" />
        </linearGradient>
        <linearGradient id="melt-water-sheen" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#d7fbfa" stopOpacity=".05" />
          <stop offset=".45" stopColor="#d7fbfa" stopOpacity=".46" />
          <stop offset="1" stopColor="#d7fbfa" stopOpacity=".08" />
        </linearGradient>
        <linearGradient id="melt-ice-tip" x1="0" y1="0" x2=".8" y2="1">
          <stop offset="0" stopColor="#ffffff" /><stop offset=".52" stopColor="#dff7f5" /><stop offset="1" stopColor="#91c9d2" />
        </linearGradient>
        <linearGradient id="melt-ice-sub" x1="0" y1="0" x2=".6" y2="1">
          <stop offset="0" stopColor="#c9f5f4" /><stop offset="1" stopColor="#5699b5" />
        </linearGradient>
        <linearGradient id="melt-glacier" x1="0" y1="0" x2=".8" y2="1">
          <stop offset="0" stopColor="#f8ffff" /><stop offset=".48" stopColor="#c9eff0" /><stop offset="1" stopColor="#6ea7bb" />
        </linearGradient>
        <linearGradient id="melt-rock" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#806c55" /><stop offset=".55" stopColor="#4f4438" /><stop offset="1" stopColor="#2d2d2d" />
        </linearGradient>
        <linearGradient id="melt-glass-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d8f7f5" stopOpacity=".75" /><stop offset=".5" stopColor="#4c7d8d" stopOpacity=".38" /><stop offset="1" stopColor="#d8f7f5" stopOpacity=".62" />
        </linearGradient>
        <filter id="melt-soft-shadow" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#020b11" floodOpacity=".55" />
        </filter>
        <clipPath id="melt-clip-a"><rect x="30" y="68" width="252" height="256" rx="13" /></clipPath>
        <clipPath id="melt-clip-b"><rect x="318" y="68" width="252" height="256" rx="13" /></clipPath>
      </defs>
      <rect width="600" height="360" rx="22" fill="url(#melt-scene-bg)" />
      <circle cx="70" cy="33" r="1.2" fill="#d9f6f2" opacity=".45" />
      <circle cx="284" cy="40" r="1" fill="#d9f6f2" opacity=".32" />
      <circle cx="548" cy="28" r="1.4" fill="#d9f6f2" opacity=".4" />

      {/* ---- Tank A: floating ice ---- */}
      <g>
        <rect x="24" y="62" width="264" height="268" rx="18" fill="#041621" opacity=".7" filter="url(#melt-soft-shadow)" />
        <g clipPath="url(#melt-clip-a)">
          <rect x="30" y="68" width="252" height="256" fill="#071f2d" />
          <rect className="melt-water-body" x="30" y={waterA} width="252" height={BOTTOM - waterA} fill="url(#melt-water)" />

          {/* Larger submerged mass, visible through the water. */}
          <g className="melt-berg-scale" style={{ transform: `translate(156px, ${waterA}px) scale(${iceScale})`, opacity: iceOpacity }}>
            <g className="melt-berg-bob">
              <path className="melt-berg-submerged" d="M-58 0 L-48 33 L-25 66 L7 75 L42 52 L59 13 L50 0 Z"
                fill="url(#melt-ice-sub)" stroke="#c9f3f1" strokeWidth="1.7" />
              <path d="M-48 32 L-8 16 L7 75 M-8 16 L42 52" fill="none" stroke="#d8ffff" strokeWidth="1.1" opacity=".36" />
            </g>
          </g>

          {/* Brash ice and bubbles appear during the melt without affecting level. */}
          <g className="melt-brash" style={{ opacity: brashOpacity }}>
            <path d={`M88 ${waterA - 2} l9 -6 l8 7 l-7 5 Z`} fill="#dff7f5" />
            <path d={`M207 ${waterA + 4} l7 -5 l10 5 l-5 6 Z`} fill="#b9e4e7" />
            <circle cx="112" cy={waterA + 28} r="3" fill="none" stroke="#a9e7ea" />
            <circle cx="218" cy={waterA + 49} r="2" fill="none" stroke="#a9e7ea" />
          </g>

          <path className="melt-water-surface" d={`M30 ${waterA} C60 ${waterA - 2}, 84 ${waterA + 2}, 112 ${waterA} S166 ${waterA - 2}, 194 ${waterA} S250 ${waterA + 2}, 282 ${waterA}`}
            fill="none" stroke="url(#melt-water-sheen)" strokeWidth="4" />

          {/* Crisp tip above the waterline, faceted rather than blob-like. */}
          <g className="melt-berg-scale" style={{ transform: `translate(156px, ${waterA}px) scale(${iceScale})`, opacity: iceOpacity }}>
            <g className="melt-berg-bob">
              <path d="M-58 0 L-39 -31 L-19 -38 L-7 -55 L14 -36 L34 -42 L59 0 Z"
                fill="url(#melt-ice-tip)" stroke="#efffff" strokeWidth="1.8" />
              <path d="M-39 -31 L-10 -20 L-7 -55 M-10 -20 L14 -36 L34 -42 M-10 -20 L10 0"
                fill="none" stroke="#78b4c4" strokeWidth="1.2" opacity=".62" />
              <path d="M-54 -2 L55 -2" stroke="#ffffff" strokeWidth="1" opacity=".55" />
            </g>
          </g>
        </g>
        <rect className="melt-glass" x="24" y="62" width="264" height="268" rx="18" fill="none" stroke="url(#melt-glass-edge)" strokeWidth="2.2" />
        <path className="melt-glass-shine" d="M37 84 V296" />
        <path className="melt-tank-rim" d="M38 64 H274" />
        <text x="156" y="45" textAnchor="middle" className="melt-tank-label">Sea ice (floating)</text>
      </g>

      {/* ---- Tank B: land ice ---- */}
      <g>
        <rect x="312" y="62" width="264" height="268" rx="18" fill="#041621" opacity=".7" filter="url(#melt-soft-shadow)" />
        <g clipPath="url(#melt-clip-b)">
          <rect x="318" y="68" width="252" height="256" fill="#071f2d" />
          <rect className="melt-water-body" x="318" y={waterB} width="252" height={BOTTOM - waterB} fill="url(#melt-water)" />

          {/* Rock ledge keeps the glacier unmistakably on land. */}
          <path className="melt-rock" d="M318 324 V174 L342 160 H416 L443 188 L464 324 Z" fill="url(#melt-rock)" stroke="#9a8264" strokeWidth="1.5" />
          <path d="M342 160 L371 188 L416 160 M372 188 L408 217 L443 188 M408 217 L431 265"
            fill="none" stroke="#b49a78" strokeWidth="1.2" opacity=".36" />

          {/* The ice sheet retreats up the ledge as its mass shrinks. */}
          <g className="melt-glacier-scale" style={{ transform: `translate(${338 + meltProgress * 13}px, ${166 - meltProgress * 5}px) scale(${iceScale})`, opacity: iceOpacity }}>
            <path d="M0 0 L5 -52 L23 -70 L49 -83 L78 -72 L98 -44 L105 0 Z"
              fill="url(#melt-glacier)" stroke="#ecffff" strokeWidth="1.8" />
            <path d="M2 -5 H103 L98 4 H5 Z" fill="#5d8ea3" opacity=".62" />
            <path d="M8 -44 C35 -34, 64 -53, 94 -40 M6 -25 C31 -17, 70 -31, 102 -19"
              fill="none" stroke="#73b5c5" strokeWidth="4" opacity=".42" />
            <path d="M27 -67 L34 -47 L27 -33 M67 -72 L60 -54 L69 -40"
              fill="none" stroke="#3f8198" strokeWidth="2.2" strokeLinecap="round" />
            <path d="M13 -49 C36 -42, 65 -58, 90 -48" fill="none" stroke="#efffff" strokeWidth="1.4" opacity=".75" />
          </g>

          {/* Meltwater runs down the rock into the sea; it is decoration only. */}
          <g className="melt-streams" style={{ opacity: streamOpacity }}>
            <path className="melt-stream" d={`M397 164 C401 181, 416 190, 420 205 S438 ${Math.max(waterB, 220) - 7}, 442 ${Math.max(waterB, 220)}`} />
            <path className="melt-stream melt-stream-delay" d={`M377 164 C381 180, 392 187, 397 199 S414 ${Math.max(waterB, 224) - 8}, 417 ${Math.max(waterB, 224)}`} />
          </g>

          <path className="melt-water-surface" d={`M318 ${waterB} C348 ${waterB - 2}, 374 ${waterB + 2}, 403 ${waterB} S456 ${waterB - 2}, 486 ${waterB} S540 ${waterB + 2}, 570 ${waterB}`}
            fill="none" stroke="url(#melt-water-sheen)" strokeWidth="4" />

          {riseVisible && (
            <g className="melt-rise-indicator">
              <line x1="552" x2="552" y1={REF_Y} y2={waterB} />
              <line x1="546" x2="558" y1={REF_Y} y2={REF_Y} />
              <path d={`M552 ${waterB} l-6 9 h12 Z`} />
              <text x="544" y={waterB - 9} textAnchor="end" className="melt-rise">sea-level rise</text>
            </g>
          )}
        </g>
        <rect className="melt-glass" x="312" y="62" width="264" height="268" rx="18" fill="none" stroke="url(#melt-glass-edge)" strokeWidth="2.2" />
        <path className="melt-glass-shine" d="M325 84 V296" />
        <path className="melt-tank-rim" d="M326 64 H562" />
        <text x="444" y="45" textAnchor="middle" className="melt-tank-label">Ice sheet / glacier (on land)</text>
      </g>

      {/* Drawn last so one shared datum visibly crosses both tanks. */}
      <line className="melt-reference-line" x1="18" x2="582" y1={REF_Y} y2={REF_Y} />
      <rect x="251" y={REF_Y - 19} width="98" height="17" rx="8.5" fill="#092331" opacity=".93" />
      <text x="300" y={REF_Y - 7} textAnchor="middle" className="melt-ref">reference level</text>
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
