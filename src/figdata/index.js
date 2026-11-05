/* Figures & data — template registry. Order = display order within each group. */
import tide from "./templates/tide.js";
import depth from "./templates/depth.js";
import shore from "./templates/shore.js";
import mline from "./templates/mline.js";
import mbar from "./templates/mbar.js";
import mscatter from "./templates/mscatter.js";
import mtable from "./templates/mtable.js";
import mcalc from "./templates/mcalc.js";
import features from "./templates/features.js";
import quadrat from "./templates/quadrat.js";
import magnify from "./templates/magnify.js";
import tabledesign from "./templates/tabledesign.js";
import oceanmap from "./templates/oceanmap.js";
import choropleth from "./templates/choropleth.js";
import foodchain from "./templates/foodchain.js";
import mcharts from "./templates/mcharts.js";
import mtrend from "./templates/mtrend.js";
import readscale from "./templates/readscale.js";
import mmaths from "./templates/mmaths.js";
export const FIG_GROUPS = ["Graphs and charts", "Tables and fieldwork", "Maps", "Diagrams"];
export const FIG_TEMPLATES = [tide, depth, shore, mline, mbar, mcharts, mscatter, mtrend, mtable, mcalc, mmaths, readscale, features, quadrat, magnify, tabledesign, oceanmap, choropleth, foodchain];
export const templateByKey = (k) => FIG_TEMPLATES.find((t) => t.key === k);
/* template CSS strings, to inject once (each is scoped to .fig-<key>) */
export const FIG_TEMPLATE_CSS = FIG_TEMPLATES.map((t) => t.css || "").join("\n");
