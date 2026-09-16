import React, { useState } from "react";
import "./interactives.css";
import { currentStageIndex } from "./processMeter.js";

// Generic stepped-causal-chain-with-a-meter. Drive a slider; a row of chain
// stages highlights as the driver advances, and a meter reads a value derived
// from the driver (meter.fn may be non-monotonic). Self-contained: React + the
// --lc-* CSS tokens only, no scheduler/mastery/rewards.
export function ProcessMeter({
  kicker, title, blurb, badge = "Advance the process",
  driver, stages, meter, scene, quickCheck, note,
}) {
  const min = Number(driver.min);
  const max = Number(driver.max);
  const step = Number(driver.step) || 1;
  const [value, setValue] = useState(min);
  const [answer, setAnswer] = useState(null);

  const current = currentStageIndex(stages, value);
  const reading = meter.fn(value);
  const level = Math.max(0, Math.min(1, reading.level));

  const answered = answer != null;
  const correct = quickCheck && answer === quickCheck.answer;

  return (
    <article className="interactive-card process-meter">
      <div className="interactive-title-row">
        <div>
          <p className="interactive-kicker">{kicker}</p>
          <h2>{title}</h2>
          <p>{blurb}</p>
        </div>
        <span className="interactive-badge">{badge}</span>
      </div>

      <div className="lc-driver-heading">
        <div><p className="lc-eyebrow">{driver.label}</p><h3>{stages[current].label}</h3></div>
        <output className="lc-value" aria-live="polite">Step {current + 1}/{stages.length}</output>
      </div>

      {scene && <div className="pm-scene-wrap">{scene(value)}</div>}

      <div className={`pm-meter is-${reading.state}`}>
        <div className="pm-meter-head">
          <span className="lc-output-label">{meter.label}</span>
          <span className="pm-meter-read" aria-live="polite">{reading.text}</span>
        </div>
        <span className="pm-meter-track" aria-hidden="true"><span className="pm-meter-fill" style={{ width: `${level * 100}%` }} /></span>
      </div>

      <ol className="pm-stages" aria-label="Process stages">
        {stages.map((s, i) => (
          <li key={s.label} className={`pm-stage${i <= current ? " is-reached" : ""}${i === current ? " is-current" : ""}`}>
            <span className="pm-stage-num" aria-hidden="true">{i + 1}</span>
            <span className="pm-stage-body">
              <strong>{s.label}</strong>
              <span>{s.note}</span>
            </span>
          </li>
        ))}
      </ol>

      <label className="lc-slider-wrap">
        <span>{driver.instruction || `Advance ${driver.label.toLowerCase()}`}</span>
        <input type="range" min={min} max={max} step={step} value={value}
          aria-label={driver.label} onChange={(e) => { setValue(Number(e.target.value)); }} />
        <span className="lc-range-ends" aria-hidden="true">
          <span>{driver.minLabel || "start"}</span><span>{driver.maxLabel || "end"}</span>
        </span>
      </label>

      {quickCheck && (
        <div className="lc-check">
          <div>
            <span className="lc-output-label">Quick self-check</span>
            <p>{quickCheck.prompt}</p>
          </div>
          <div className="melt-options" role="group" aria-label="Answer options">
            {quickCheck.options.map(([key, label]) => (
              <button key={key} type="button"
                className={`melt-opt${answer === key ? (key === quickCheck.answer ? " is-correct" : " is-wrong") : ""}`}
                onClick={() => setAnswer(key)}>
                {label}
              </button>
            ))}
          </div>
          <p className={`lc-feedback${!answered ? "" : correct ? " is-pass" : " is-try"}`} role="status" aria-live="polite">
            {!answered ? "Advance the process, then choose." : correct ? quickCheck.feedback.success : quickCheck.feedback.tryAgain}
          </p>
        </div>
      )}

      {note && <p className="depth-note pm-crux">{note}</p>}
    </article>
  );
}

export default ProcessMeter;
