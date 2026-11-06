/* Figures & data — reading guide (the ✕ with dashed guide lines and mini axis scales).
   Pure geometry + SVG, no DOM. A template exposes axes(F) -> [panel]; the engine places a
   ✕ on the plot and this module draws the overlay inside the figure's own <svg>, so it
   scales with Zoom. The mini scales copy the real axis: the SAME tick positions, and ONLY
   the labels the real axis shows (never a numeric read-out of the ✕), so the student still
   works out what one small square is worth — an examined skill.

   Panel contract (all coordinates in SVG user units):
     { plot: { x0, x1, y0, y1 },                 // the plot rectangle
       x: { ticks: [{ at, label? }] },           // every grid line along x; label only where the axis has one
       y: { ticks: [{ at, label? }] },           // same for y (at = SVG y)
       y2?: { ticks, side },                     // optional second y-axis (not drawn by the mini; see note)
       active?: "y" | "y2",                      // which y-axis the horizontal line goes to (default "y")
       xAxisY?: number,                          // SVG y of the horizontal (x) axis line (default plot.y1 — bottom)
       yAxisX?: number }                         // SVG x of the vertical (y) axis line (default plot.x0 — left)
   A panel with no x ticks draws only the horizontal guide and the y-mini (e.g. a bar chart's
   value axis); a panel with no y ticks draws only the vertical guide and the x-mini. */

const PAD = 10;        // mini-box padding around the window, in SVG units
const XMINI_H = 34;    // height of the x-mini strip
const GAPY = 16;       // horizontal gap from the ✕ to the y-mini box
const CHARW = 7.6;     // rough character width at the mini font size

const hasX = (p) => !!(p.x && p.x.ticks && p.x.ticks.length);
const hasY = (p) => !!(p.y && p.y.ticks && p.y.ticks.length);
const xAxisY = (p) => (p.xAxisY != null ? p.xAxisY : p.plot.y1);
const yAxisX = (p) => (p.yAxisX != null ? p.yAxisX : p.plot.x0);

/** index of the panel whose plot rectangle contains (x, y), or -1 if none. */
export function panelIndexAt(panels, x, y) {
  for (let i = 0; i < panels.length; i++) { const p = panels[i].plot; if (x >= p.x0 - 1e-6 && x <= p.x1 + 1e-6 && y >= p.y0 - 1e-6 && y <= p.y1 + 1e-6) return i; }
  return -1;
}
/** clamp a point to a plot rectangle. */
export function clampToPlot(plot, x, y) {
  return { x: Math.min(plot.x1, Math.max(plot.x0, x)), y: Math.min(plot.y1, Math.max(plot.y0, y)) };
}

/* the window on one axis = the span between the two labelled ticks that bracket the cross.
   `c` is the cross coordinate along that axis (SVG x for the x-axis, SVG y for the y-axis). */
function windowOf(ticks, c) {
  const lab = ticks.filter((t) => t.label != null).sort((a, b) => a.at - b.at);
  if (lab.length < 2) return null;
  let i = 0;
  for (let k = 0; k < lab.length - 1; k++) if (c >= lab[k].at - 1e-6) i = k;
  i = Math.max(0, Math.min(i, lab.length - 2));
  return { lo: lab[i].at, hi: lab[i + 1].at };     // lo < hi in SVG units
}
const ticksIn = (ticks, lo, hi) => ticks.filter((t) => t.at >= lo - 1e-6 && t.at <= hi + 1e-6).sort((a, b) => a.at - b.at);
const maxLabelLen = (ticks) => ticks.reduce((m, t) => (t.label != null ? Math.max(m, String(t.label).length) : m), 1);

/** Lay out the two mini boxes for a ✕ at (x,y) in `panel`, inside a viewBox of size vb={w,h}.
    Returns { cross:{x,y}, yBox|null, xBox|null } with each box {x,y,w,h, side, win}. Guarantees
    (by construction + clamping) that the boxes stay inside the viewBox, do not cover the ✕, and do
    not overlap each other. Exposed so the engine draws it and the test can check the invariants. */
export function guideBoxes(panel, x, y, vb) {
  const out = { cross: { x, y }, yBox: null, xBox: null };
  const clampX = (bx, w) => Math.min(vb.w - w - 1, Math.max(1, bx));
  const clampY = (by, h) => Math.min(vb.h - h - 1, Math.max(1, by));

  // ---- y-mini (a vertical strip beside the ✕) ----
  let ywin = null;
  if (hasY(panel)) {
    ywin = windowOf(panel.y.ticks, y);
    if (ywin) {
      const h = (ywin.hi - ywin.lo) + 2 * PAD, w = Math.max(40, maxLabelLen(panel.y.ticks) * CHARW + 16);
      const top = clampY(ywin.lo - PAD, h);
      let side = x < panel.plot.x1 - (w + GAPY) ? "right" : "left";       // prefer the right of the ✕
      let bx = side === "right" ? x + GAPY : x - GAPY - w;
      // flip if it would leave the viewBox or cover the ✕
      const fits = (vx) => vx >= 1 && vx + w <= vb.w - 1 && !(x >= vx - 1 && x <= vx + w + 1);
      if (!fits(bx)) { side = side === "right" ? "left" : "right"; bx = side === "right" ? x + GAPY : x - GAPY - w; }
      if (!fits(bx)) { bx = clampX(x < vb.w / 2 ? x + GAPY : x - GAPY - w, w); side = bx > x ? "right" : "left"; }
      out.yBox = { x: bx, y: top, w, h, side, win: ywin };
    }
  }
  // ---- x-mini (a horizontal strip below, or above, the ✕) ----
  if (hasX(panel)) {
    const xwin = windowOf(panel.x.ticks, x);
    if (xwin) {
      const w = (xwin.hi - xwin.lo) + 28;
      let bx = clampX(xwin.lo - 14, w);
      const yStripBottom = out.yBox ? out.yBox.y + out.yBox.h : y;
      let by = Math.max(y + 22, yStripBottom + 8), below = true;         // keep clear of the y-strip box
      if (by + XMINI_H > vb.h - 2) { by = Math.min(y - 22 - XMINI_H, (out.yBox ? out.yBox.y : y) - 8 - XMINI_H); below = false; }
      by = clampY(by, XMINI_H);
      // never let the strip cover the ✕
      if (y >= by - 1 && y <= by + XMINI_H + 1) { by = below ? clampY(y + 22, XMINI_H) : clampY(y - 22 - XMINI_H, XMINI_H); }
      out.xBox = { x: bx, y: by, w, h: XMINI_H, below, win: xwin };
    }
  }
  return out;
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** The full live guide overlay (guide lines, the ✕, and the mini scales), as an SVG <g> string.
    `cls` extra class ("amber" for the after-Check reading). */
export function guideLayerSVG(panel, x, y, vb, cls = "") {
  const P = panel.plot;
  let s = "";
  // dashed guide lines to the axes
  if (hasY(panel)) s += `<line x1="${x.toFixed(1)}" x2="${yAxisX(panel).toFixed(1)}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}" class="gg-line"/>`;
  if (hasX(panel)) s += `<line x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${y.toFixed(1)}" y2="${xAxisY(panel).toFixed(1)}" class="gg-line"/>`;
  // the ✕
  s += `<path d="M${(x - 7).toFixed(1)} ${(y - 7).toFixed(1)}L${(x + 7).toFixed(1)} ${(y + 7).toFixed(1)}M${(x + 7).toFixed(1)} ${(y - 7).toFixed(1)}L${(x - 7).toFixed(1)} ${(y + 7).toFixed(1)}" class="gg-cross"/>`;
  const { yBox, xBox } = guideBoxes(panel, x, y, vb);
  // y mini-scale
  if (yBox) {
    const edge = yBox.side === "right" ? yBox.x : yBox.x + yBox.w, dir = yBox.side === "right" ? 1 : -1;
    s += `<g class="gg-mini"><rect x="${yBox.x.toFixed(1)}" y="${yBox.y.toFixed(1)}" width="${yBox.w.toFixed(1)}" height="${yBox.h.toFixed(1)}" rx="6"/>`;
    for (const t of ticksIn(panel.y.ticks, yBox.win.lo, yBox.win.hi)) {
      const maj = t.label != null, len = maj ? 14 : 6;
      s += `<line x1="${edge.toFixed(1)}" x2="${(edge + dir * len).toFixed(1)}" y1="${t.at.toFixed(1)}" y2="${t.at.toFixed(1)}" class="${maj ? "gg-maj" : "gg-min"}"/>`;
      if (maj) s += `<text x="${(yBox.side === "right" ? yBox.x + yBox.w - 4 : yBox.x + 4).toFixed(1)}" y="${(t.at + 4).toFixed(1)}" text-anchor="${yBox.side === "right" ? "end" : "start"}">${esc(t.label)}</text>`;
    }
    s += `</g>`;
  }
  // x mini-scale
  if (xBox) {
    const edge = xBox.below ? xBox.y : xBox.y + xBox.h, dir = xBox.below ? 1 : -1;
    s += `<g class="gg-mini"><rect x="${xBox.x.toFixed(1)}" y="${xBox.y.toFixed(1)}" width="${xBox.w.toFixed(1)}" height="${xBox.h.toFixed(1)}" rx="6"/>`;
    for (const t of ticksIn(panel.x.ticks, xBox.win.lo, xBox.win.hi)) {
      const maj = t.label != null, len = maj ? 12 : 6;
      s += `<line x1="${t.at.toFixed(1)}" x2="${t.at.toFixed(1)}" y1="${edge.toFixed(1)}" y2="${(edge + dir * len).toFixed(1)}" class="${maj ? "gg-maj" : "gg-min"}"/>`;
      if (maj) s += `<text x="${t.at.toFixed(1)}" y="${(xBox.below ? xBox.y + XMINI_H - 5 : xBox.y + 15).toFixed(1)}" text-anchor="middle">${esc(t.label)}</text>`;
    }
    s += `</g>`;
  }
  return `<g class="figguide${cls ? " " + cls : ""}">${s}</g>`;
}

/** Just the dashed lines + ✕ at a point, in amber, for the after-Check "where you should have read". */
export function guideReadSVG(panel, x, y) {
  let s = "";
  if (hasY(panel)) s += `<line x1="${x.toFixed(1)}" x2="${yAxisX(panel).toFixed(1)}" y1="${y.toFixed(1)}" y2="${y.toFixed(1)}" class="gg-line"/>`;
  if (hasX(panel)) s += `<line x1="${x.toFixed(1)}" x2="${x.toFixed(1)}" y1="${y.toFixed(1)}" y2="${xAxisY(panel).toFixed(1)}" class="gg-line"/>`;
  s += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="5" class="gg-dot"/>`;
  return `<g class="figguide amber">${s}</g>`;
}

/** The engine wires tap/plot answering only when this is true: in the asking phase with the guide off.
    While the guide is on, pointer events drive the ✕ and never record an answer. */
export const answeringEnabled = (phase, guideOn) => phase === "ask" && !guideOn;

/** Default ✕ position: the centre of a panel's plot. */
export function centreOf(panel) {
  const p = panel.plot;
  return { x: (p.x0 + p.x1) / 2, y: (p.y0 + p.y1) / 2 };
}
