import React, { useCallback, useEffect, useId, useState } from "react";
import "./interactives.css";

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

function feedbackText(feedback, passed) {
  if (typeof feedback === "function") return feedback(passed);
  if (typeof feedback === "string") return feedback;
  return passed ? feedback?.success : feedback?.tryAgain;
}

export function LinkedControl({ driver, outputs, scene, quickCheck, className = "", onValueChange }) {
  const min = Number(driver.min);
  const max = Number(driver.max);
  const step = Number(driver.step) || 1;
  const suppliedValue = Number(driver.value);
  const initialValue = Number.isFinite(suppliedValue) ? suppliedValue : min;
  const [value, setValue] = useState(clamp(initialValue, min, max));
  const [checkResult, setCheckResult] = useState(null);
  const labelId = useId();

  useEffect(() => {
    const next = Number(driver.value);
    setValue(clamp(Number.isFinite(next) ? next : min, min, max));
  }, [driver.value, min, max]);

  useEffect(() => setCheckResult(null), [quickCheck]);

  const update = useCallback((next) => {
    let adjusted = Number(next);
    if (driver.kind === "dial") {
      const span = max - min;
      adjusted = ((adjusted - min) % span + span) % span + min;
    } else {
      adjusted = clamp(adjusted, min, max);
    }
    setValue(adjusted);
    setCheckResult(null);
    onValueChange?.(adjusted);
  }, [driver.kind, max, min, onValueChange]);

  const valueFromPointer = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const center = driver.dialCenter || { x: 0.5, y: 0.5 };
    const centerX = rect.left + rect.width * center.x;
    const centerY = rect.top + rect.height * center.y;
    const x = event.clientX - centerX;
    const y = centerY - event.clientY;
    const angle = normalizeDial(Math.atan2(y, x) * 180 / Math.PI, min, max);
    const snapTolerance = Number(driver.snapTolerance) || 4;
    const snap = driver.snapPoints?.find((point) => dialDistance(angle, point, min, max) <= snapTolerance);
    update(snap == null ? angle : snap);
  };

  const pointerDown = (event) => {
    event.currentTarget.setPointerCapture?.(event.pointerId);
    valueFromPointer(event);
  };

  const pointerMove = (event) => {
    if (event.currentTarget.hasPointerCapture?.(event.pointerId)) valueFromPointer(event);
  };

  const dialKeyDown = (event) => {
    const direction = event.key === "ArrowRight" || event.key === "ArrowUp" ? 1
      : event.key === "ArrowLeft" || event.key === "ArrowDown" ? -1 : 0;
    if (!direction) return;
    event.preventDefault();
    update(value + direction * step);
  };

  const valueLabel = driver.formatValue
    ? driver.formatValue(value)
    : `${Math.round(value * 100) / 100}${driver.unit ? ` ${driver.unit}` : ""}`;

  const renderScene = scene ? scene(value) : null;
  const resultClass = checkResult == null ? "" : checkResult ? " is-pass" : " is-try";

  return (
    <section className={`linked-control ${className}`.trim()} aria-labelledby={labelId}>
      <div className="lc-driver-heading">
        <div>
          <p className="lc-eyebrow">Linked control</p>
          <h3 id={labelId}>{driver.label}</h3>
        </div>
        <output className="lc-value" aria-live="polite">{valueLabel}</output>
      </div>

      {driver.kind === "dial" ? (
        <div
          className="lc-dial"
          role="slider"
          tabIndex="0"
          aria-label={driver.ariaLabel || driver.label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={Math.round(value)}
          aria-valuetext={valueLabel}
          onPointerDown={pointerDown}
          onPointerMove={pointerMove}
          onKeyDown={dialKeyDown}
        >
          {renderScene}
        </div>
      ) : (
        <>
          {renderScene && <div className="lc-scene">{renderScene}</div>}
          <label className="lc-slider-wrap">
            <span>{driver.instruction || `Adjust ${driver.label.toLowerCase()}`}</span>
            <input
              type="range"
              min={min}
              max={max}
              step={step}
              value={value}
              aria-label={driver.ariaLabel || driver.label}
              onChange={(event) => update(event.target.value)}
            />
            <span className="lc-range-ends" aria-hidden="true">
              <span>{driver.minLabel || `${min}${driver.unit || ""}`}</span>
              <span>{driver.maxLabel || `${max}${driver.unit || ""}`}</span>
            </span>
          </label>
        </>
      )}

      {driver.kind === "dial" && (
        <p className="lc-instruction">{driver.instruction || "Drag around the path, or use the arrow keys."}</p>
      )}

      <div className="lc-outputs" aria-label="Linked outputs">
        {outputs.map((output) => {
          const rendered = output.render(value);
          const level = rendered.level == null ? null : clamp(rendered.level, 0, 1);
          return (
            <article className={`lc-output ${rendered.visualState ? `is-${rendered.visualState}` : ""}`} key={output.id}>
              <span className="lc-output-label">{output.label}</span>
              <strong>{rendered.display}</strong>
              {level != null && (
                <span className="lc-meter" aria-hidden="true">
                  <span style={{ width: `${level * 100}%` }} />
                </span>
              )}
            </article>
          );
        })}
      </div>

      {quickCheck && (
        <div className="lc-check">
          <div>
            <span className="lc-output-label">Quick self-check</span>
            <p>{quickCheck.prompt}</p>
          </div>
          <button type="button" onClick={() => setCheckResult(Boolean(quickCheck.test(value)))}>
            {quickCheck.actionLabel || "Check my setup"}
          </button>
          <p className={`lc-feedback${resultClass}`} role="status" aria-live="polite">
            {checkResult == null ? "Move the control, then check." : feedbackText(quickCheck.feedback, checkResult)}
          </p>
        </div>
      )}
    </section>
  );
}

function normalizeDial(value, min, max) {
  const span = max - min;
  return ((value - min) % span + span) % span + min;
}

function dialDistance(a, b, min, max) {
  const span = max - min;
  const difference = Math.abs(normalizeDial(a, min, max) - normalizeDial(b, min, max));
  return Math.min(difference, span - difference);
}

export default LinkedControl;
