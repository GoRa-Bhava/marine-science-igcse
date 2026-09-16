import React from "react";
import { ProcessMeter } from "./ProcessMeter.jsx";
import { temperatureMeter, temperatureLevel, GREENHOUSE_STAGES, GREENHOUSE_CAPTION, GREENHOUSE_ANSWER } from "./processMeter.js";

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

const GAS_Y = 150;              // the greenhouse-gas layer
const GROUND_Y = 250;
const OUT_RAYS = [170, 250, 330, 430]; // outgoing-heat ray positions

// Sunlight always reaches the surface; only the OUTGOING heat is trapped. As
// emissions rise, more outgoing rays bounce back down off the gas layer and the
// thermometer climbs. Incoming sunlight is never blocked — that is the point.
function GreenhouseScene(v) {
  const emissions = clamp(v, 0, 100) / 100;
  const gasOpacity = 0.12 + 0.6 * emissions;
  const reflected = Math.round(emissions * OUT_RAYS.length);
  const tLevel = temperatureLevel(v);
  const tY = GROUND_Y - 6 - tLevel * 150; // thermometer fill top

  return (
    <svg className="gh-scene" viewBox="0 0 600 300" role="img"
      aria-label="Sunlight passes freely to the surface; greenhouse gases trap the heat radiated back, and more gas traps more heat.">
      <defs>
        <linearGradient id="gh-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#071b2c" /><stop offset="1" stopColor="#0e3a4e" />
        </linearGradient>
        <marker id="gh-sun" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#f6c945" />
        </marker>
        <marker id="gh-heat" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M0 0 L10 5 L0 10 z" fill="#ff7a5c" />
        </marker>
      </defs>
      <rect width="600" height="300" rx="18" fill="url(#gh-sky)" />

      {/* Sun, top-left. */}
      <circle cx="58" cy="52" r="30" fill="#f6c945" />
      <g stroke="#f6c945" strokeWidth="3" strokeLinecap="round">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((a) => {
          const r = a * Math.PI / 180;
          return <line key={a} x1={58 + Math.cos(r) * 34} y1={52 + Math.sin(r) * 34} x2={58 + Math.cos(r) * 42} y2={52 + Math.sin(r) * 42} />;
        })}
      </g>

      {/* Incoming sunlight — ALWAYS reaches the ground, whatever the emissions. */}
      <g className="gh-sun-rays">
        {[[95, 95], [140, 60], [200, 40]].map(([sx, sy], i) => (
          <line key={i} x1={sx} y1={sy} x2={sx + 150} y2={GROUND_Y - 4} stroke="#f6c945" strokeWidth="3" markerEnd="url(#gh-sun)" />
        ))}
        <text x="150" y="150" className="gh-label gh-label-sun">sunlight in (not blocked)</text>
      </g>

      {/* Greenhouse-gas layer — denser as emissions rise. */}
      <rect x="24" y={GAS_Y - 16} width="552" height="32" rx="14" fill="#8aa0a8" opacity={gasOpacity} />
      {[70, 150, 230, 310, 390, 470, 540].map((x, i) => (
        <text key={x} x={x} y={GAS_Y + 5} textAnchor="middle" className="gh-gas" style={{ opacity: 0.25 + 0.7 * emissions }}>
          {i % 2 ? "CH₄" : "CO₂"}
        </text>
      ))}
      <text x="576" y={GAS_Y - 22} textAnchor="end" className="gh-label gh-label-gas">greenhouse gases</text>

      {/* Outgoing heat from the surface: some escapes, more bounces back as gas builds. */}
      <g className="gh-heat-rays">
        {OUT_RAYS.map((x, i) => (
          i < reflected ? (
            <g key={x} className="gh-ray-reflect">
              <line x1={x} y1={GROUND_Y - 6} x2={x} y2={GAS_Y + 12} stroke="#ff7a5c" strokeWidth="3" />
              <line x1={x} y1={GAS_Y + 12} x2={x + 34} y2={GROUND_Y - 8} stroke="#ff7a5c" strokeWidth="3" markerEnd="url(#gh-heat)" />
            </g>
          ) : (
            <line key={x} x1={x} y1={GROUND_Y - 6} x2={x - 18} y2="20" stroke="#ffb27a" strokeWidth="2.4" strokeDasharray="6 5" markerEnd="url(#gh-heat)" opacity=".8" />
          )
        ))}
      </g>

      {/* Ground + sea. */}
      <rect x="0" y={GROUND_Y} width="600" height={300 - GROUND_Y} fill="#25543f" />
      <rect x="330" y={GROUND_Y} width="270" height={300 - GROUND_Y} fill="#12586e" />

      {/* Thermometer (no numbers) climbs with temperature. */}
      <g className="gh-thermo">
        <rect x="548" y="96" width="16" height="150" rx="8" fill="#0c2c3b" stroke="#cfe8ec" strokeWidth="2" />
        <rect x="551" y={tY} width="10" height={GROUND_Y - 4 - tY} rx="5" className={`gh-thermo-fill is-${temperatureMeter(v).state}`} />
        <circle cx="556" cy="252" r="13" className={`gh-thermo-fill is-${temperatureMeter(v).state}`} stroke="#cfe8ec" strokeWidth="2" />
      </g>
    </svg>
  );
}

export function GreenhouseMeter() {
  return (
    <ProcessMeter
      kicker="Unit 6 · Enhanced greenhouse effect (6.8)"
      title="Do greenhouse gases block the Sun — or trap the heat?"
      blurb="Raise emissions and watch: sunlight still pours in, but more of the heat leaving the surface is held in."
      badge="Raise emissions"
      driver={{ label: "Greenhouse-gas emissions", min: 0, max: 100, step: 1, minLabel: "low emissions", maxLabel: "high emissions", instruction: "Slide to raise greenhouse-gas emissions" }}
      stages={GREENHOUSE_STAGES}
      meter={{ label: "Temperature (heat retained)", fn: temperatureMeter }}
      scene={GreenhouseScene}
      note={GREENHOUSE_CAPTION}
      quickCheck={{
        prompt: "Do greenhouse gases work by blocking incoming sunlight?",
        options: [["yes", "Yes"], ["no", "No — they let sunlight in and trap the heat radiated back from the surface"]],
        answer: GREENHOUSE_ANSWER,
        feedback: {
          success: "Right — sunlight comes in freely. The gases trap the heat the surface radiates back, and more gas traps more of it.",
          tryAgain: "Look again — the sunlight still reaches the surface. What the gases hold in is the outgoing heat radiated back from the surface.",
        },
      }}
    />
  );
}

export default GreenhouseMeter;
