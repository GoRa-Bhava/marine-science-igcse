import React from "react";
import { ProcessMeter } from "./ProcessMeter.jsx";
import { oxygenMeter, EUTRO_STAGES, EUTRO_CAPTION, EUTRO_ANSWER } from "./processMeter.js";

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const smooth = (t) => { const x = clamp(t, 0, 1); return x * x * (3 - 2 * x); };

// Cross-section of a water body: nutrients feed an algal bloom (oxygen bubbling
// up while it lives), the bloom dies and browns, decomposers multiply, and the
// fish suffocates once the oxygen has crashed.
function EutroScene(v) {
  const bloom = smooth(v / 30);            // living algae grow and photosynthesise
  const dying = smooth((v - 45) / 40);     // the dead bloom browns and is broken down
  const alive = bloom * (1 - dying);
  const bubbles = clamp(alive, 0, 1);      // oxygen bubbles only while algae live
  const decomposers = smooth((v - 50) / 45); // bacteria after the die-off
  const dead = v >= 72;                    // fish belly-up once oxygen has crashed

  const matW = 60 + bloom * 470;
  return (
    <svg className="eutro-scene" viewBox="0 0 600 300" role="img"
      aria-label="A pond in cross-section: an algal bloom grows and adds oxygen, then dies; decomposers use the oxygen up and the fish suffocates.">
      <defs>
        <linearGradient id="eu-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#186a86" /><stop offset="1" stopColor="#0a3245" />
        </linearGradient>
        <marker id="eu-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#8fd66a" />
        </marker>
      </defs>
      <rect width="600" height="300" rx="18" fill="url(#eu-water)" />
      <rect x="0" y="250" width="600" height="50" fill="#3d3326" />

      {/* Nutrient run-off entering from the land. */}
      <g className="eu-inflow">
        <line x1="26" y1="34" x2="70" y2="66" stroke="#8fd66a" strokeWidth="3" markerEnd="url(#eu-arrow)" />
        <text x="24" y="26" className="eu-label">nutrients (run-off / sewage)</text>
      </g>

      {/* Algal mat at the surface: green while alive, brown as it dies. */}
      <g style={{ opacity: Math.min(1, bloom * 1.4) }}>
        <rect x="30" y="52" width={matW} height="20" rx="9" fill="#57ad3e" style={{ opacity: 1 - dying }} />
        <rect x="30" y="52" width={matW} height="20" rx="9" fill="#7c5a2c" style={{ opacity: dying }} />
      </g>

      {/* Oxygen bubbles rise while the algae photosynthesise. */}
      <g className="eu-bubbles" style={{ opacity: bubbles }}>
        {[[110, 210], [175, 235], [250, 205], [330, 240], [410, 215], [470, 235]].map(([x, y], i) => (
          <g key={i} className={`eu-bubble eu-bubble-${i % 3}`}>
            <circle cx={x} cy={y} r="4" /><circle cx={x + 6} cy={y + 14} r="2.5" />
          </g>
        ))}
        <text x="300" y="120" textAnchor="middle" className="eu-note eu-note-o2">O₂ from photosynthesis</text>
      </g>

      {/* Decomposer bacteria bloom after the die-off. */}
      <g className="eu-decomp" style={{ opacity: decomposers }}>
        {[[120, 150], [200, 175], [270, 140], [350, 180], [430, 155], [500, 185], [160, 200], [390, 205]].map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="3" className={`eu-germ eu-germ-${i % 2}`} />
        ))}
        <text x="300" y="128" textAnchor="middle" className="eu-note eu-note-decomp">decomposers using up O₂</text>
      </g>

      {/* The fish: upright and swimming, or belly-up once the oxygen has crashed. */}
      <g className="eu-fish" style={{ transform: dead ? "translate(300px, 84px) rotate(180deg)" : "translate(300px, 200px)" }}>
        <path d="M-20 0 Q0 -13 20 0 Q0 13 -20 0 Z" fill={dead ? "#9fb0a6" : "#f0a24b"} stroke="#243b2f" strokeWidth="1.5" />
        <path d="M20 0 l14 -9 l0 18 Z" fill={dead ? "#9fb0a6" : "#f0a24b"} stroke="#243b2f" strokeWidth="1.5" />
        <circle cx="-12" cy="-3" r="2" fill="#243b2f" />
      </g>
    </svg>
  );
}

export function EutrophicationMeter() {
  return (
    <ProcessMeter
      kicker="Unit 6 · Eutrophication (6.7)"
      title="Why does more algae end in fewer fish?"
      blurb="Advance the process and watch the dissolved-oxygen meter rise with the bloom — then crash."
      badge="Advance the process"
      driver={{ label: "Advance the process", min: 0, max: 100, step: 1, minLabel: "run-off begins", maxLabel: "animals die", instruction: "Slide to advance the process through time" }}
      stages={EUTRO_STAGES}
      meter={{ label: "Dissolved oxygen", fn: oxygenMeter }}
      scene={EutroScene}
      note={EUTRO_CAPTION}
      quickCheck={{
        prompt: "When do the fish die — during the bloom, or after it?",
        options: [["during", "During the algal bloom"], ["after", "After it, when the bloom decomposes"]],
        answer: EUTRO_ANSWER,
        feedback: {
          success: "Right — while the algae are alive they add oxygen. The fish die after the bloom, when decomposers breaking it down use the oxygen up faster than it is replaced.",
          tryAgain: "Not during the bloom — living algae add oxygen. The fish die after it, when the decomposers use the oxygen up.",
        },
      }}
    />
  );
}

export default EutrophicationMeter;
