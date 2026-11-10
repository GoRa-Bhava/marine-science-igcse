// Marine 0697 picture questions, batch 3: the new ChatGPT art (styles A and B), hotspots measured 10 Nov 2026. STATUS: human_review.
import { FIGURES_P13, FIGURE_ITEMS_P13 } from "./figures-p-units1-3.js";
import { FIGURES_P46, FIGURE_ITEMS_P46 } from "./figures-p-units4-6.js";
import { FIGURES_R13, FIGURE_ITEMS_R13 } from "./figures-r-units1-3.js";
import { FIGURES_R46, FIGURE_ITEMS_R46 } from "./figures-r-units4-6.js";
export const UNIT_FIGURES_P = { ...FIGURES_P13, ...FIGURES_P46, ...FIGURES_R13, ...FIGURES_R46 };
export const UNIT_FIGURE_ITEMS_P = [ ...FIGURE_ITEMS_P13, ...FIGURE_ITEMS_P46, ...FIGURE_ITEMS_R13, ...FIGURE_ITEMS_R46 ];
