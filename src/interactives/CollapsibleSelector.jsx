import React, { useEffect, useRef, useState } from "react";
import "./interactives.css";

// Generic collapsible selector — the same pattern as the Concept Cards
// comparison selector: a button showing the current choice + chevron that
// expands a list; picking one selects it and collapses; the button toggle,
// tapping outside, or Esc also collapse. Self-contained (React + interactives
// CSS tokens) so it stays inside interactives/ and mirrors cleanly.
export function CollapsibleSelector({ items, activeIndex, onSelect, columns = 1, ariaLabel = "Choose" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => { document.removeEventListener("mousedown", onDoc); document.removeEventListener("keydown", onKey); };
  }, [open]);

  const current = items[activeIndex] || items[0];
  return (
    <div className="lab-select" ref={ref}>
      <button type="button" className="lab-select-btn" aria-expanded={open} aria-haspopup="listbox" onClick={() => setOpen((o) => !o)}>
        <span className="lab-select-current">{current?.label}</span>
        <span className="lab-select-chev" aria-hidden="true" style={{ transform: open ? "rotate(180deg)" : "none" }}>▾</span>
      </button>
      {open && (
        <div className="lab-select-panel" role="listbox" aria-label={ariaLabel}
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}>
          {items.map((it, i) => (
            <button key={it.key ?? i} type="button" role="option" aria-selected={i === activeIndex}
              className={`lab-select-opt${i === activeIndex ? " is-active" : ""}`}
              onClick={() => { onSelect(i); setOpen(false); }}>
              {it.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default CollapsibleSelector;
