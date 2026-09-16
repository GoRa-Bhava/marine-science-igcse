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
  // Meltwater builds quickly, then fades once the last remnant of land ice is gone.
  const streamOpacity = Math.min(1, meltProgress * 1.6, r * 8);
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
          <stop offset="0" stopColor="#9c8060" /><stop offset=".42" stopColor="#66513d" /><stop offset="1" stopColor="#292b2a" />
        </linearGradient>
        <linearGradient id="melt-glass-edge" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#d8f7f5" stopOpacity=".75" /><stop offset=".5" stopColor="#4c7d8d" stopOpacity=".38" /><stop offset="1" stopColor="#d8f7f5" stopOpacity=".62" />
        </linearGradient>
        <filter id="melt-soft-shadow" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#020b11" floodOpacity=".55" />
        </filter>
        <filter id="melt-ice-glow" x="-20%" y="-20%" width="140%" height="145%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.5" result="blur" />
          <feFlood floodColor="#bff8ff" floodOpacity=".36" result="colour" />
          <feComposite in="colour" in2="blur" operator="in" result="glow" />
          <feMerge><feMergeNode in="glow" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <pattern id="melt-rock-strata" width="36" height="30" patternUnits="userSpaceOnUse" patternTransform="rotate(16)">
          <path d="M-10 7 H48 M-10 17 H48 M-10 27 H48" stroke="#d0b18a" strokeWidth="1.2" opacity=".34" />
          <path d="M4 0 V30 M28 0 V30" stroke="#211f1b" strokeWidth=".8" opacity=".26" />
        </pattern>
        <pattern id="melt-water-grain" width="44" height="26" patternUnits="userSpaceOnUse">
          <path d="M-5 8 Q7 2 19 8 T43 8 T67 8 M2 20 Q14 15 26 20 T50 20"
            fill="none" stroke="#c9f8f5" strokeWidth="1" opacity=".13" />
        </pattern>
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
          <rect className="melt-water-body melt-water-grain" x="30" y={waterA} width="252" height={BOTTOM - waterA} fill="url(#melt-water-grain)" />

          {/* Larger submerged mass, visible through the water. */}
          <g className="melt-berg-scale" style={{ transform: `translate(156px, ${waterA}px) scale(${iceScale})`, opacity: iceOpacity }}>
            <g className="melt-berg-bob">
              <path className="melt-berg-submerged" d="M-64 0 L-58 20 L-46 45 L-20 72 L7 82 L36 70 L55 43 L66 12 L53 0 Z"
                fill="url(#melt-ice-sub)" stroke="#c9f3f1" strokeWidth="1.7" filter="url(#melt-ice-glow)" />
              <path className="melt-ice-ink" d="M-57 20 Q-34 29 -9 18 T52 17 M-46 45 Q-18 51 3 40 T48 43 M-20 72 Q6 65 36 70" />
              <path className="melt-ice-facet" d="M-58 20 L-9 18 L7 82 M-9 18 L48 43 M-46 45 L-20 72 M3 40 L36 70" />
            </g>
          </g>

          {/* Brash ice and bubbles appear during the melt without affecting level. */}
          <g className="melt-brash" style={{ opacity: brashOpacity }}>
            <path className="melt-brash-a" d={`M78 ${waterA - 1} l10 -8 l11 8 l-8 6 Z`} fill="#e9ffff" stroke="#79afbd" />
            <path className="melt-brash-b" d={`M214 ${waterA + 2} l8 -6 l11 5 l-5 7 Z`} fill="#c8eef0" stroke="#659cad" />
            <path className="melt-brash-c" d={`M239 ${waterA - 1} l5 -4 l8 4 l-4 5 Z`} fill="#e5ffff" stroke="#659cad" />
            <g className="melt-bubble melt-bubble-a">
              <circle cx="108" cy={waterA + 35} r="3.2" /><circle cx="116" cy={waterA + 46} r="1.8" />
            </g>
            <g className="melt-bubble melt-bubble-b">
              <circle cx="220" cy={waterA + 58} r="2.4" /><circle cx="226" cy={waterA + 69} r="1.5" />
            </g>
          </g>

          <g className="melt-current-lines" aria-hidden="true">
            <path d="M49 292 C78 272 105 279 120 294 S170 315 197 293" />
            <path d="M179 271 C205 250 240 254 262 274" />
            <path d="M238 268 l15 4 l-8 13" className="melt-current-arrow" />
          </g>

          <path className="melt-water-surface" d={`M30 ${waterA} C60 ${waterA - 2}, 84 ${waterA + 2}, 112 ${waterA} S166 ${waterA - 2}, 194 ${waterA} S250 ${waterA + 2}, 282 ${waterA}`}
            fill="none" stroke="url(#melt-water-sheen)" strokeWidth="4" />

          {/* Crisp tip above the waterline, faceted rather than blob-like. */}
          <g className="melt-berg-scale" style={{ transform: `translate(156px, ${waterA}px) scale(${iceScale})`, opacity: iceOpacity }}>
            <g className="melt-berg-bob">
              <path d="M-64 0 L-47 -25 L-28 -31 L-12 -51 L-3 -62 L13 -43 L32 -49 L48 -28 L66 0 Z"
                fill="url(#melt-ice-tip)" stroke="#efffff" strokeWidth="1.8" filter="url(#melt-ice-glow)" />
              <path className="melt-ice-facet" d="M-47 -25 L-15 -17 L-3 -62 M-15 -17 L13 -43 L32 -49 M-15 -17 L8 0 M32 -49 L48 -28" />
              <path className="melt-ice-ink" d="M-43 -31 Q-23 -38 -8 -46 M4 -50 Q18 -39 38 -43 M-51 -16 Q-28 -8 -6 -17 T46 -16" />
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
          <rect className="melt-water-body melt-water-grain" x="318" y={waterB} width="252" height={BOTTOM - waterB} fill="url(#melt-water-grain)" />

          {/* Rock ledge keeps the glacier unmistakably on land. */}
          <path className="melt-rock" d="M318 324 V187 L334 166 L359 155 L389 161 L411 176 L432 185 L448 211 L464 324 Z"
            fill="url(#melt-rock)" stroke="#bea17b" strokeWidth="1.7" />
          <path d="M318 324 V187 L334 166 L359 155 L389 161 L411 176 L432 185 L448 211 L464 324 Z"
            fill="url(#melt-rock-strata)" opacity=".72" />
          <path className="melt-rock-ink" d="M333 172 L352 190 L379 174 L405 200 L431 186 M325 213 Q353 197 381 214 T443 211 M326 248 Q355 231 389 249 T454 248 M329 285 Q363 270 397 286 T459 283" />
          <path className="melt-rock-cracks" d="M354 190 l-8 24 l9 15 M405 200 l-12 27 l10 24 M438 216 l-13 29 l9 23" />

          {/* The ice sheet retreats up the ledge as its mass shrinks. */}
          <g className="melt-glacier-scale" style={{ transform: `translate(${330 + meltProgress * 15}px, ${157 - meltProgress * 5}px) scale(${iceScale})`, opacity: iceOpacity }}>
            <path d="M0 0 L3 -43 L14 -65 L36 -82 L61 -91 L84 -82 L100 -66 L111 -44 L122 -26 L128 0 Z"
              fill="url(#melt-glacier)" stroke="#ecffff" strokeWidth="2" filter="url(#melt-ice-glow)" />
            <path d="M2 -6 Q34 3 65 -4 T126 -5 L122 5 H6 Z" fill="#568ba3" opacity=".68" />
            <path className="melt-glacier-band" d="M8 -52 Q37 -43 62 -55 T106 -53 M5 -32 Q33 -21 64 -34 T118 -29 M3 -14 Q36 -6 68 -16 T125 -12" />
            <path className="melt-glacier-ink" d="M13 -65 Q39 -57 60 -72 T96 -65 M26 -79 Q43 -67 61 -91 M82 -81 Q78 -63 92 -51 M104 -57 Q98 -41 111 -29" />
            <path className="melt-crevasse" d="M36 -72 L43 -52 L35 -37 M72 -83 L65 -63 L75 -49 M96 -63 L88 -45 L98 -32" />
            <path className="melt-glacier-rill" style={{ opacity: streamOpacity }} d="M57 -84 C54 -68 68 -63 64 -48 S81 -27 82 -8" />
          </g>

          {/* Meltwater runs down the rock into the sea; it is decoration only. */}
          <g className="melt-streams" style={{ opacity: streamOpacity }}>
            <path className="melt-waterfall-shadow" d={`M401 155 C405 172, 424 179, 426 194 S441 ${waterB - 11}, 445 ${waterB + 1}`} />
            <path className="melt-waterfall-body" d={`M401 154 C404 172, 423 179, 425 194 S440 ${waterB - 11}, 445 ${waterB}`} />
            <path className="melt-stream melt-stream-main" d={`M400 153 C403 171, 421 177, 424 193 S439 ${waterB - 11}, 445 ${waterB}`} />
            <path className="melt-stream melt-stream-delay" d={`M377 156 C379 172, 391 180, 394 194 S410 ${waterB - 9}, 415 ${waterB}`} />
            <g className="melt-foam" style={{ transform: `translate(444px, ${waterB}px)` }}>
              <path d="M-31 3 Q-18 -11 -5 0 Q4 -12 14 -1 Q24 -7 32 4 Q17 14 2 8 Q-15 15 -31 3 Z" />
              <circle cx="-23" cy="-3" r="4.5" /><circle cx="8" cy="-5" r="5.5" /><circle cx="28" cy="2" r="3.5" />
            </g>
          </g>

          <g className="melt-current-lines melt-current-lines-b" aria-hidden="true">
            <path d="M337 286 C362 268 391 272 408 290 S456 310 483 289" />
            <path d="M462 267 C486 246 523 251 548 274" />
            <path d="M523 262 l17 5 l-9 14" className="melt-current-arrow" />
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
