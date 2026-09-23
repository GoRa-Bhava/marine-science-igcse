import React, { useEffect, useMemo, useRef, useState } from "react";
import { ConceptVisual } from "./ConceptVisual";
import { hasHeroArt, heroFit } from "./card-art";
import { sideIndexFromScroll } from "./pills";
import "./comparison-card.css";

// Nearest scrolling ancestor of `node`, or null when the page (window) scrolls.
function getScrollParent(node) {
  let el = node && node.parentElement;
  while (el) {
    const oy = getComputedStyle(el).overflowY;
    if ((oy === "auto" || oy === "scroll") && el.scrollHeight > el.clientHeight) return el;
    el = el.parentElement;
  }
  return null;
}

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
          const hidden = (mode === "recall" || mode === "test") && !revealedRows.has(index);
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
                  <span>Hidden — recall it</span>
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
  selector = null,
}) {
  // Mode is controllable (the Concept-cards screen owns it so it persists when
  // you switch pills); falls back to internal state when used standalone.
  const [modeState, setModeState] = useState(initialMode);
  const mode = modeProp ?? modeState;
  const [activeRow, setActiveRow] = useState(0);
  const [revealedRows, setRevealedRows] = useState(new Set());
  const [answer, setAnswer] = useState(null);
  const [activeSide, setActiveSide] = useState(0);
  const sectionRef = useRef(null);
  const modeBarRef = useRef(null);
  const swipeRef = useRef(null);
  const testRef = useRef(null);
  // Each mode press requests a scroll; the nonce lets a re-press of the same
  // mode re-trigger it, and the effect runs after the (possibly new) DOM commits.
  const scrollReq = useRef(null);
  const [scrollNonce, setScrollNonce] = useState(0);

  const setCardMode = (next) => {
    setAnswer(null);
    if (next === "learn" || next === "test") setRevealedRows(new Set());
    if (onModeChange) onModeChange(next);
    else setModeState(next);
    scrollReq.current = next;
    setScrollNonce((n) => n + 1);
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

  // On a mode press, scroll so the sticky mode bar pins to the top and the
  // relevant content sits just under it: Learn -> bar at top; Recall -> the
  // visible side's title just below the bar (hero scrolled away, rows in view);
  // Quick test -> the test section revealed below the bar.
  useEffect(() => {
    const target = scrollReq.current;
    if (!target) return;
    scrollReq.current = null;
    const raf = requestAnimationFrame(() => {
      const bar = modeBarRef.current;
      if (!bar) return;
      // The mode bar pins below the fixed app bar (its CSS sticky `top`), so the
      // scroll target sits just under BOTH: appbar/sticky offset + bar height.
      const stickyTop = parseFloat(getComputedStyle(bar).top) || 0;
      const offset = stickyTop + bar.offsetHeight;
      // Each mode pins the bar to the top and positions its content just under it:
      // Learn -> the hero (top of the side); Recall -> the side title (hero
      // scrolled away, rows in view); Quick test -> the test section.
      let el;
      if (target === "recall") {
        el = swipeRef.current?.querySelector(".cc-sideTitleBlock");
      } else if (target === "test") {
        el = testRef.current;
      } else {
        el = swipeRef.current; // learn: the hero at the top of the pair
      }
      if (!el) el = bar;
      const scroller = getScrollParent(sectionRef.current);
      const viewportTop = scroller ? scroller.getBoundingClientRect().top : 0;
      const delta = el.getBoundingClientRect().top - viewportTop - offset;
      if (Math.abs(delta) < 2) return;
      const opts = { top: delta, behavior: "smooth" };
      if (scroller) scroller.scrollBy(opts);
      else window.scrollBy(opts);
    });
    return () => cancelAnimationFrame(raf);
  }, [scrollNonce]);

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
    <section className={classes} data-card-id={card.id} ref={sectionRef}>
      {/* Mode toggle — its own row directly below the app bar; sticks to the top
          (below the app bar) once you scroll past it. */}
      <div className="cc-modebar" ref={modeBarRef}>
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

      {/* Collapsible comparison selector (which card to show). */}
      {selector}

      {/* Compact context for the chosen comparison. */}
      <div className="cc-cardhead">
        <div className="cc-meta">
          <span>Unit {card.unit}</span>
          <span>{card.ref}</span>
        </div>
        <p className="cc-subtitle">{card.subtitle}</p>
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

      {/* The memory hook names the exact fact the quick test asks, so it only
          shows in Learn — hidden in Recall and Quick test so it can't cue the answer. */}
      {mode === "learn" && (
        <aside className="cc-memory">
          <span className="cc-memoryDot" />
          <p><strong>Memory hook:</strong> {card.memoryHook}</p>
        </aside>
      )}

      {mode === "test" && card.quickTest ? (
        <div className="cc-test" aria-live="polite" ref={testRef}>
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
                onClick={() => { setAnswer(index); setRevealedRows(new Set(card.rows.map((_, i) => i))); }}
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
