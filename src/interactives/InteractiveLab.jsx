import React, { useState } from "react";
import { TidesInteractive } from "./TidesInteractive.jsx";
import { DepthSliderDemo } from "./DepthSliderDemo.jsx";
import { EstuaryTidalSlider } from "./EstuaryTidalSlider.jsx";
import { RockyShoreTideline } from "./RockyShoreTideline.jsx";
import { MeltTanks } from "./MeltTanks.jsx";
import { FoodWebRemoval } from "./FoodWebRemoval.jsx";
import { EutrophicationMeter } from "./EutrophicationMeter.jsx";
import { GreenhouseMeter } from "./GreenhouseMeter.jsx";
import { CollapsibleSelector } from "./CollapsibleSelector.jsx";
import { LAB_ITEMS } from "./labItems.js";

// key → component (labels/order live in labItems.js).
const COMPONENTS = {
  tides: TidesInteractive,
  depth: DepthSliderDemo,
  melt: MeltTanks,
  estuary: EstuaryTidalSlider,
  rocky: RockyShoreTideline,
  foodweb: FoodWebRemoval,
  eutrophication: EutrophicationMeter,
  greenhouse: GreenhouseMeter,
};

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

export function InteractiveLab({ onBack }) {
  const [index, setIndex] = useState(initialIndex);
  const item = LAB_ITEMS[index] || LAB_ITEMS[0];
  const Current = COMPONENTS[item.key];

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
        <p>Pick an interactive, then drag or slide one input and watch every linked result update immediately.</p>
      </header>

      <CollapsibleSelector
        items={LAB_ITEMS}
        activeIndex={index}
        onSelect={select}
        columns={1}
        ariaLabel="Choose an interactive"
      />

      {Current ? <Current /> : null}

      <aside className="interactive-next" aria-label="Possible future interactives">
        <strong>Designed to grow</strong>
        <p>More interactives use the same pattern — food webs, the greenhouse and eutrophication chains, and others land in this menu as they arrive.</p>
      </aside>
    </main>
  );
}

export default InteractiveLab;
