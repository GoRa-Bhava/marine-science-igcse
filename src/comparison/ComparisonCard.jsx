import React, { useMemo, useRef, useState } from "react";
import { ConceptVisual } from "./ConceptVisual";
import { hasHeroArt, heroFit } from "./card-art";
import { sideIndexFromScroll } from "./pills";
import "./comparison-card.css";

// Each side leads with a painted hero illustration (card-art/<cardId>__<side>.webp)
// when one is bundled. If none exists for this side, or the image fails to load,
// the side falls back to its ConceptVisual emblem — per side, so a half-illustrated
// card renders art on the side that has it and the emblem on the side that doesn't.
function SideVisual({ card, side }) {
  const data = card[side];
  const [failed, setFailed] = useState(false);

  if (!hasHeroArt(card.id, side) || failed) {
    return (
      <div className="cc-visualWrap cc-visualWrap--emblem">
        <ConceptVisual visualKey={data.visualKey} accent={data.accent} />
      </div>
    );
  }

  // Edge-to-edge 4:3 scenes fill the frame (cover); transparent cut-outs are
  // contained on the glow panel. Both keep the same frame height.
  const fit = heroFit(card.id, side);
  return (
    <div className={`cc-visualWrap cc-visualWrap--hero cc-visualWrap--${fit}`}>
      <img
        className={`cc-heroArt cc-heroArt--${fit}`}
        src={`card-art/${card.id}__${side}.webp`}
        alt={data.name}
        loading="lazy"
        decoding="async"
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function AccentSide({
  card,
  side,
  activeRow,
  mode,
  revealedRows,
  onSelectRow,
  onRevealRow,
}) {
  const data = card[side];

  return (
    <article className={`cc-side cc-${data.accent}`}>
      <header className="cc-sideHead">
        <SideVisual card={card} side={side} />
        <div className="cc-sideTitleBlock">
          <h3>{data.name}</h3>
          <p>{data.kicker}</p>
        </div>
      </header>

      {data.equation?.length ? (
        <div className="cc-equation" aria-label={`${data.name} equation`}>
          {data.equation.map((token, index) => {
            const semanticClass =
              token === "carbon dioxide" ? "cc-co2" :
              token === "water" ? "cc-water" :
              token === "glucose" ? "cc-glucose" :
              token === "oxygen" ? "cc-oxygen" : "";
            const operator = token === "+" || token === "→";
            return operator
              ? <span className="cc-eqOp" key={`${token}-${index}`}>{token}</span>
              : <span className={`cc-molecule ${semanticClass}`} key={`${token}-${index}`}>{token}</span>;
          })}
        </div>
      ) : null}

      <div className="cc-rows">
        {card.rows.map((row, index) => {
          const value = row[side];
          const hidden = mode === "recall" && !revealedRows.has(index);
          return (
            <button
              key={`${row.label}-${side}`}
              type="button"
              className={[
                "cc-row",
                activeRow === index ? "is-active" : "",
                row.shared ? "is-shared" : "",
                hidden ? "is-hidden" : "",
              ].filter(Boolean).join(" ")}
              onClick={() => onSelectRow(index)}
              aria-pressed={activeRow === index}
            >
              <span className="cc-label">
                {row.label}
                {row.shared ? <span className="cc-sharedBadge">BOTH</span> : null}
              </span>

              {hidden ? (
                <span className="cc-recall">
                  <span>Hidden for recall</span>
                  <span
                    role="button"
                    tabIndex={0}
                    className="cc-reveal"
                    onClick={(event) => {
                      event.stopPropagation();
                      onRevealRow(index);
                    }}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        event.stopPropagation();
                        onRevealRow(index);
                      }
                    }}
                  >
                    Reveal pair
                  </span>
                </span>
              ) : <span className="cc-value">{value}</span>}
            </button>
          );
        })}
      </div>

      {data.energyStory?.length ? (
        <div className="cc-energy">
          <div className="cc-energyHead">
            <strong>Energy story</strong>
            <span>{data.energyStory.length > 1 ? "follow the flow" : "key idea"}</span>
          </div>
          <div className="cc-energyFlow">
            {data.energyStory.map((stage, index) => (
              <React.Fragment key={`${stage}-${index}`}>
                <span className="cc-energyStage">{stage}</span>
                {index < data.energyStory.length - 1 ? <span className="cc-energyArrow">→</span> : null}
              </React.Fragment>
            ))}
          </div>
        </div>
      ) : null}
    </article>
  );
}

export function ComparisonCard({
  card,
  mode: modeProp,
  initialMode = "learn",
  className = "",
  onModeChange,
}) {
  // Mode is controllable (the Concept-cards screen owns it so it persists when
  // you switch pills); falls back to internal state when used standalone.
  const [modeState, setModeState] = useState(initialMode);
  const mode = modeProp ?? modeState;
  const [activeRow, setActiveRow] = useState(0);
  const [revealedRows, setRevealedRows] = useState(new Set());
  const [answer, setAnswer] = useState(null);
  const [activeSide, setActiveSide] = useState(0);
  const swipeRef = useRef(null);

  const setCardMode = (next) => {
    setAnswer(null);
    if (next === "learn") setRevealedRows(new Set());
    if (onModeChange) onModeChange(next);
    else setModeState(next);
  };

  const revealRow = (index) => {
    setRevealedRows((previous) => {
      const next = new Set(previous);
      next.add(index);
      return next;
    });
  };

  const onSwipeScroll = (event) => {
    const el = event.currentTarget;
    setActiveSide(sideIndexFromScroll(el.scrollLeft, el.scrollWidth, el.clientWidth, 2));
  };

  const classes = ["cc-root", className].filter(Boolean).join(" ");
  const sides = ["a", "b"];

  const testState = useMemo(() => {
    if (!card.quickTest || answer === null) return null;
    return {
      correct: answer === card.quickTest.answer,
      selected: card.quickTest.options[answer],
    };
  }, [answer, card.quickTest]);

  return (
    <section className={classes} data-card-id={card.id}>
      {/* Shared controls — belong to the comparison, fixed across the swipe. */}
      <div className="cc-meta">
        <span>Unit {card.unit}</span>
        <span>{card.ref}</span>
      </div>

      <div className="cc-header">
        <div>
          <h2>{card.title}</h2>
          <p>{card.subtitle}</p>
        </div>
        <div className="cc-modes" role="tablist" aria-label="Comparison card mode">
          {(["learn", "recall", "test"]).map((item) => {
            if (item === "test" && !card.quickTest) return null;
            const label = item === "learn" ? "Learn" : item === "recall" ? "Recall" : "Quick test";
            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={mode === item}
                className={mode === item ? "is-active" : ""}
                onClick={() => setCardMode(item)}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* The pair: one side at a time, full width, snap-scroll with an edge peek. */}
      <div className="cc-swipe" ref={swipeRef} onScroll={onSwipeScroll}>
        {sides.map((side) => (
          <div className="cc-slide" key={side}>
            <AccentSide
              card={card}
              side={side}
              activeRow={activeRow}
              mode={mode}
              revealedRows={revealedRows}
              onSelectRow={setActiveRow}
              onRevealRow={revealRow}
            />
          </div>
        ))}
      </div>

      <div className="cc-dots" role="tablist" aria-label="Shown side">
        {sides.map((side, index) => (
          <span
            key={side}
            className={activeSide === index ? "is-on" : ""}
            aria-label={card[side].name}
            aria-selected={activeSide === index}
          />
        ))}
      </div>

      <aside className="cc-memory">
        <span className="cc-memoryDot" />
        <p><strong>Memory hook:</strong> {card.memoryHook}</p>
      </aside>

      {mode === "test" && card.quickTest ? (
        <div className="cc-test" aria-live="polite">
          <strong>{card.quickTest.q}</strong>
          <div className="cc-testOptions">
            {card.quickTest.options.map((option, index) => (
              <button
                type="button"
                key={option}
                className={
                  answer === index
                    ? index === card.quickTest.answer ? "is-correct" : "is-wrong"
                    : ""
                }
                onClick={() => setAnswer(index)}
              >
                {option}
              </button>
            ))}
          </div>
          {testState ? (
            <p className={testState.correct ? "is-correctText" : "is-wrongText"}>
              {testState.correct ? "Correct. " : "Not quite. "}{card.quickTest.feedback}
            </p>
          ) : null}
          <p className="cc-testNote">Self-check only — this does not affect mastery, rewards or scheduling.</p>
        </div>
      ) : null}
    </section>
  );
}
