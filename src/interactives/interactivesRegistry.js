// Registry of the nine Marine Science interactives.
//
// `html` is intentionally left out here — how the host loads the source is the
// host's choice (see INTERACTIVES-HANDOFF.md → "Loading the HTML"). Common options:
//   • bundler raw import:   import estuary from "./interactives/estuary.html?raw";
//   • fetch at runtime:     const html = await fetch(`/interactives/${slug}.html`).then(r=>r.text());
//   • inline string map:    HTML[slug] = "...";
//
// tierFit = which question tier(s) this interactive naturally reinforces, so the
// session builder can surface it next to the right questions (recall → application → exam).

export const INTERACTIVES = [
  { slug: "tides",          title: "Tides — spring & neap",     unit: 1, syllabus: "1.x tides",         tierFit: ["recall", "application"], note: "Drag the Moon; spring/neap tidal-range meter." },
  { slug: "depth",          title: "The deep-sea column",       unit: 2, syllabus: "2.5/LO1–6",         tierFit: ["recall", "application"], note: "One depth slider drives light, pressure & temperature together." },
  { slug: "melt",           title: "Melting ice & sea level",   unit: 2, syllabus: "2.1/LO6 · 6.8",     tierFit: ["application"],           note: "Two tanks; only land ice raises the level. The classic trap." },
  { slug: "elnino",         title: "El Niño",                   unit: 2, syllabus: "2.6/LO2–3",         tierFit: ["application", "exam"],    note: "Normal ⇄ El Niño toggle: winds, warm water, upwelling, catch." },
  { slug: "zones",          title: "Ocean zones",               unit: 5, syllabus: "5.3/LO3–11",        tierFit: ["recall", "application"], note: "Tap a zone → five conditions animate." },
  { slug: "rockyshore",     title: "Rocky-shore zonation",      unit: 5, syllabus: "5.4/LO1–3",         tierFit: ["application", "exam"],    note: "Tide slider + tap organism → highlights its tolerance band and explains why it can't live higher or lower." },
  { slug: "estuary",        title: "Estuary tidal cycle",       unit: 5, syllabus: "5.6/LO2 · 2.2/LO11", tierFit: ["application"],           note: "Tide floods/drains a mangrove mudflat; salinity/temp/O₂ meters." },
  { slug: "foodweb",        title: "Food-web removal",          unit: 4, syllabus: "4.4/LO4",           tierFit: ["application", "exam"],    note: "Tap to remove an organism; knock-on effects + quiz." },
  { slug: "eutrophication", title: "Eutrophication",            unit: 6, syllabus: "6.7/LO5",           tierFit: ["exam"],                  note: "Step-through; dissolved-oxygen graph rises then crashes." },
];

export const bySlug = Object.fromEntries(INTERACTIVES.map((i) => [i.slug, i]));
export const byUnit = (unit) => INTERACTIVES.filter((i) => i.unit === unit);
export const forTier = (tier) => INTERACTIVES.filter((i) => i.tierFit.includes(tier));
