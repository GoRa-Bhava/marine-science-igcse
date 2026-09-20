import React, { useState } from "react";
import MarineInteractive from "./MarineInteractive.jsx";
import { GreenhouseMeter } from "./GreenhouseMeter.jsx";
import { CollapsibleSelector } from "./CollapsibleSelector.jsx";
import { LAB_ITEMS } from "./labItems.js";

// The nine packaged interactives are self-contained HTML documents; Vite inlines
// each as a raw string that MarineInteractive drops into an isolated iframe.
import tides from "./embeds/tides.html?raw";
import depth from "./embeds/depth.html?raw";
import melt from "./embeds/melt.html?raw";
import elnino from "./embeds/elnino.html?raw";
import zones from "./embeds/zones.html?raw";
import rockyshore from "./embeds/rockyshore.html?raw";
import estuary from "./embeds/estuary.html?raw";
import foodweb from "./embeds/foodweb.html?raw";
import eutrophication from "./embeds/eutrophication.html?raw";

const HTML = { tides, depth, melt, elnino, zones, rockyshore, estuary, foodweb, eutrophication };

const STORE_KEY = "marine_lab_selected";

function initialIndex() {
  try {
    const key = window.localStorage.getItem(STORE_KEY);
    const i = LAB_ITEMS.findIndex((it) => it.key === key);
    return i >= 0 ? i : 0;
  } catch (e) {
    return 0;
  }
}

export function InteractiveLab({ onBack, theme = "dark" }) {
  const [index, setIndex] = useState(initialIndex);
  const item = LAB_ITEMS[index] || LAB_ITEMS[0];

  const select = (i) => {
    setIndex(i);
    try { window.localStorage.setItem(STORE_KEY, LAB_ITEMS[i].key); } catch (e) { /* ignore */ }
  };

  return (
    <main className="interactive-lab">
      <button type="button" className="interactive-back" onClick={onBack}>← Back</button>
      <header className="interactive-lab-header">
        <p className="interactive-kicker">Learn by changing one thing</p>
        <h1>Interactive lab</h1>
        <p>Pick an interactive, then change one thing and watch every linked result respond. These are teaching aids beside the quiz — explore, then test yourself in the questions.</p>
      </header>

      <CollapsibleSelector
        items={LAB_ITEMS}
        activeIndex={index}
        onSelect={select}
        columns={1}
        ariaLabel="Choose an interactive"
      />

      {item.kind === "native"
        ? <GreenhouseMeter />
        : (
          <MarineInteractive
            key={item.key}
            html={HTML[item.key]}
            title={item.label}
            theme={theme}
            className="lab-embed"
          />
        )}

      <aside className="interactive-next" aria-label="About these interactives">
        <strong>Explore, then retrieve</strong>
        <p>Each interactive has its own quick self-check for instant feedback. The graded questions in each unit are where your progress is recorded.</p>
      </aside>
    </main>
  );
}

export default InteractiveLab;
