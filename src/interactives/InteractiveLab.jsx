import React from "react";
import { TidesInteractive } from "./TidesInteractive.jsx";
import { DepthSliderDemo } from "./DepthSliderDemo.jsx";
import { EstuaryTidalSlider } from "./EstuaryTidalSlider.jsx";
import { RockyShoreTideline } from "./RockyShoreTideline.jsx";
import { MeltTanks } from "./MeltTanks.jsx";

export function InteractiveLab({ onBack }) {
  return (
    <main className="interactive-lab">
      <button type="button" className="interactive-back" onClick={onBack}>← Back</button>
      <header className="interactive-lab-header">
        <p className="interactive-kicker">Learn by changing one thing</p>
        <h1>Interactive lab</h1>
        <p>Drag or slide one input and watch every linked result update immediately.</p>
      </header>
      <TidesInteractive />
      <DepthSliderDemo />
      <EstuaryTidalSlider />
      <RockyShoreTideline />
      <MeltTanks />
      <aside className="interactive-next" aria-label="Possible future interactives">
        <strong>Designed to grow</strong>
        <p>The same pattern can power salinity and density, dissolved oxygen and temperature, depth and light, population growth, or wave height and wind speed.</p>
      </aside>
    </main>
  );
}

export default InteractiveLab;
