/* Figures & data — template registry. Order = display order within each group. */
import tide from "./templates/tide.js";
export const FIG_GROUPS = ["Graphs and charts", "Tables and fieldwork", "Maps", "Diagrams"];
export const FIG_TEMPLATES = [tide];
export const templateByKey = (k) => FIG_TEMPLATES.find((t) => t.key === k);
/* template CSS strings, to inject once (each is scoped to .fig-<key>) */
export const FIG_TEMPLATE_CSS = FIG_TEMPLATES.map((t) => t.css || "").join("\n");
