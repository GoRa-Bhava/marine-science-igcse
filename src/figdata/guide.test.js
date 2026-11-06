/* Tests for the figure reading guide (axes(F) contract + overlay layout). See BUILD-BRIEF-graph-guide.md §Tests. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { FIG_TEMPLATES } from "./index.js";
import { guideBoxes, answeringEnabled, panelIndexAt } from "./guide.js";
import { rng } from "./core.js";

const SEEDS = Number(process.env.FIG_SEEDS || 800);
const withAxes = FIG_TEMPLATES.filter((t) => typeof t.axes === "function");
const seedOf = (s) => (s * 2654435761) >>> 0;

function parseVB(svg) { const m = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/); return m ? { w: +m[1], h: +m[2] } : null; }
function textNodes(svg) {
  const out = [], re = /<text\b([^>]*)>([\s\S]*?)<\/text>/g; let m;
  while ((m = re.exec(svg))) {
    if (/<tspan/.test(m[2])) continue;                 // wrapped labels live on category axes (no numeric ticks)
    const xm = m[1].match(/\bx="(-?[\d.]+)"/), ym = m[1].match(/\by="(-?[\d.]+)"/);
    out.push({ x: xm ? +xm[1] : null, y: ym ? +ym[1] : null, text: m[2].trim(), rotated: /transform=/.test(m[1]) });
  }
  return out;
}
const sorted = (a) => a.every((v, i) => !i || v >= a[i - 1]) || a.every((v, i) => !i || v <= a[i - 1]);
const labelled = (ax) => (ax && ax.ticks ? ax.ticks.filter((t) => t.label != null) : []);

test(`guide templates expose axes: ${withAxes.map((t) => t.key).join(", ")}`, () => {
  assert.ok(withAxes.length >= 12, `expected ≥12 templates with axes, got ${withAxes.length}`);
});

for (const t of withAxes) {
  test(`axes(${t.key}): shape, labels match svg(), ≥2 labelled ticks — ${SEEDS} seeds`, () => {
    const bad = [];
    for (let s = 1; s <= SEEDS && bad.length < 10; s++) {
      const seed = seedOf(s); let F, panels, svg;
      try { F = t.make(seed); panels = t.axes(F); svg = t.svg(F, {}); } catch (e) { bad.push(`seed ${seed} threw ${e.message}`); continue; }
      if (!panels || !panels.length) continue;         // a mode with no cartesian axes (e.g. a pie chart)
      const vb = parseVB(svg), nodes = textNodes(svg);
      for (const p of panels) {
        const pl = p.plot;
        if (!(pl.x0 < pl.x1 && pl.y0 < pl.y1)) { bad.push(`seed ${seed} bad plot rect`); break; }
        for (const [axis, lo, hi, isX] of [[p.x, pl.x0, pl.x1, true], [p.y, pl.y0, pl.y1, false]]) {
          if (!axis || !axis.ticks || !axis.ticks.length) continue;
          const ats = axis.ticks.map((tk) => tk.at);
          if (ats.some((a) => a < lo - 0.6 || a > hi + 0.6)) { bad.push(`seed ${seed} ${t.key} tick outside plot`); break; }
          if (!sorted(ats)) { bad.push(`seed ${seed} ${t.key} ticks not sorted`); break; }
          const lab = labelled(axis);
          if (lab.length < 2) { bad.push(`seed ${seed} ${t.key} ${isX ? "x" : "y"} has ${lab.length} labelled ticks`); break; }
          // (2) every label appears in svg() as a text node at the same position along the axis
          for (const tk of lab) {
            const hit = nodes.some((n) => !n.rotated && n.text === String(tk.label) && (isX ? (n.x != null && Math.abs(n.x - tk.at) <= 6) : (n.y != null && Math.abs(n.y - tk.at) <= 6)));
            if (!hit) { bad.push(`seed ${seed} ${t.key} ${isX ? "x" : "y"} label "${tk.label}" at ${tk.at.toFixed(1)} not found in svg`); break; }
          }
        }
      }
    }
    assert.deepEqual(bad, []);
  });

  test(`guideBoxes(${t.key}): overlay stays in the viewBox, off the ✕, no overlap`, () => {
    const bad = [];
    for (let s = 1; s <= Math.min(SEEDS, 120) && bad.length < 8; s++) {
      const seed = seedOf(s); let F, panels, vb;
      try { F = t.make(seed); panels = t.axes(F); vb = parseVB(t.svg(F, {})); } catch { continue; }
      if (!panels || !panels.length || !vb) continue;
      for (const p of panels) {
        const { x0, x1, y0, y1 } = p.plot, xs = [x0, (x0 + x1) / 2, x1], ys = [y0, (y0 + y1) / 2, y1];
        for (const x of xs) for (const y of ys) {
          const { yBox, xBox } = guideBoxes(p, x, y, vb);
          for (const [nm, b] of [["y", yBox], ["x", xBox]]) {
            if (!b) continue;
            if (b.x < -0.6 || b.y < -0.6 || b.x + b.w > vb.w + 0.6 || b.y + b.h > vb.h + 0.6) bad.push(`seed ${seed} ${nm}-box out of viewBox at (${x.toFixed(0)},${y.toFixed(0)})`);
            if (x > b.x + 0.6 && x < b.x + b.w - 0.6 && y > b.y + 0.6 && y < b.y + b.h - 0.6) bad.push(`seed ${seed} ${nm}-box covers the ✕ at (${x.toFixed(0)},${y.toFixed(0)})`);
          }
          if (yBox && xBox) {
            const over = yBox.x < xBox.x + xBox.w - 0.6 && yBox.x + yBox.w > xBox.x + 0.6 && yBox.y < xBox.y + xBox.h - 0.6 && yBox.y + yBox.h > xBox.y + 0.6;
            if (over) bad.push(`seed ${seed} boxes overlap at (${x.toFixed(0)},${y.toFixed(0)})`);
          }
        }
      }
    }
    assert.deepEqual(bad.slice(0, 8), []);
  });
}

test("guide: pointer routes to the panel that contains it, and ignores points outside every panel", () => {
  const panels = [{ plot: { x0: 10, x1: 100, y0: 10, y1: 100 } }, { plot: { x0: 10, x1: 100, y0: 150, y1: 240 } }];
  assert.equal(panelIndexAt(panels, 50, 50), 0);
  assert.equal(panelIndexAt(panels, 50, 200), 1);
  assert.equal(panelIndexAt(panels, 50, 125), -1);     // between the panels → ignored
  assert.equal(panelIndexAt(panels, 500, 50), -1);
});

test("guide: taps do not answer while the guide is on", () => {
  assert.equal(answeringEnabled("ask", true), false);  // guide on → answering disabled
  assert.equal(answeringEnabled("ask", false), true);  // guide off → normal answering
  assert.equal(answeringEnabled("done", false), false);
});
