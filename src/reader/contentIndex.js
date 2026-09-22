/* Content index for the Reader — units → sections → orderedItemIds.
 *
 * Derived from the existing question bank (no content change). A "section" is one
 * syllabus subsection = the item's `sec` (spec Appendix A). The app's items carry
 * `ref` (e.g. "2.3/LO2"), so `sec` is the leading "N.N" of `ref`; the unit is the
 * leading digit. Within a section, items are ordered by `tier` (1 recall →
 * 2 application → 3 exam), preserving author order within a tier. This index is
 * the single source of truth for book order and section boundaries.
 */

// Syllabus unit + section titles (0697). Stable reference data.
export const SYLLABUS = {
  1: { title: "Earth Processes", sections: { "1.1": "Earth in space and structure", "1.2": "Plate tectonics", "1.3": "Oceans and the sea floor", "1.4": "Tides and currents" } },
  2: { title: "Sea Water", sections: { "2.1": "The water cycle", "2.2": "pH and salinity", "2.3": "Dissolved gases", "2.4": "Density", "2.5": "Effects of increasing depth", "2.6": "Upwelling" } },
  3: { title: "Marine Organisms", sections: { "3.1": "Cell structure and function", "3.2": "Reproduction", "3.3": "Classification", "3.4": "The animal kingdom", "3.5": "Plant and protoctist kingdoms", "3.6": "Animal life cycles", "3.7": "Migration" } },
  4: { title: "Nutrients and Energy", sections: { "4.1": "Nutrients", "4.2": "Respiration", "4.3": "Photosynthesis", "4.4": "Feeding relationships" } },
  5: { title: "Marine Ecosystems", sections: { "5.1": "Components of ecosystems", "5.2": "Investigating ecosystems", "5.3": "Open-ocean ecosystem", "5.4": "Rocky shores", "5.5": "Sedimentary shores", "5.6": "Mangrove forest", "5.7": "Tropical coral reefs" } },
  6: { title: "Human Influences on Marine Ecosystems", sections: { "6.1": "Overview of human interactions", "6.2": "Tourism", "6.3": "Fisheries", "6.4": "Aquaculture", "6.5": "Energy from the oceans", "6.6": "Plastic pollution", "6.7": "Eutrophication", "6.8": "Understanding climate change", "6.9": "Conservation strategies" } },
};

export function secOf(item) {
  const ref = String(item.ref || "");
  const m = ref.match(/^(\d)\.(\d)/);
  return m ? `${m[1]}.${m[2]}` : "0.0";
}
export function unitOf(sectionId) {
  return parseInt(String(sectionId).split(".")[0], 10) || 0;
}

// Build the index from the bank. `figures` lets us drop items whose figure is
// missing (mirrors the app's servable-item filter) so the reader never serves a
// broken figure.
export function buildContentIndex(items, figures = {}) {
  const servable = items.filter((i) => !(i.fig && !figures[i.fig]));

  // group: unit -> sec -> [{item, order}]
  const bySec = new Map();
  servable.forEach((item, order) => {
    const sec = secOf(item);
    if (!bySec.has(sec)) bySec.set(sec, []);
    bySec.get(sec).push({ item, order });
  });

  const sectionIds = [...bySec.keys()].sort(cmpSec);
  const sections = {};
  const itemLoc = {}; // itemId -> { unitId, sectionId, indexInSection }
  const flatOrder = [];

  for (const sectionId of sectionIds) {
    const unitId = unitOf(sectionId);
    // stable order by tier, then author order
    const ordered = bySec.get(sectionId)
      .slice()
      .sort((a, b) => (tierOf(a.item) - tierOf(b.item)) || (a.order - b.order))
      .map((x) => x.item);
    const orderedItemIds = ordered.map((i) => i.id);
    orderedItemIds.forEach((id, idx) => { itemLoc[id] = { unitId, sectionId, indexInSection: idx }; flatOrder.push(id); });
    sections[sectionId] = {
      sectionId,
      unitId,
      title: (SYLLABUS[unitId]?.sections?.[sectionId]) || sectionId,
      orderedItemIds,
      total: orderedItemIds.length,
    };
  }

  // units in order
  const unitIds = [...new Set(sectionIds.map(unitOf))].sort((a, b) => a - b);
  const units = unitIds.map((unitId) => ({
    unitId,
    title: SYLLABUS[unitId]?.title || `Unit ${unitId}`,
    sectionIds: sectionIds.filter((s) => unitOf(s) === unitId),
    total: sectionIds.filter((s) => unitOf(s) === unitId).reduce((n, s) => n + sections[s].total, 0),
  }));

  return {
    units,
    sections,          // sectionId -> section
    sectionIds,        // ordered
    itemLoc,           // itemId -> location
    flatOrder,         // every itemId in book order
    itemCount: flatOrder.length,
    sectionOf: (id) => itemLoc[id]?.sectionId || null,
    nextSectionId: (sectionId) => { const i = sectionIds.indexOf(sectionId); return i >= 0 && i < sectionIds.length - 1 ? sectionIds[i + 1] : null; },
    firstItemOf: (sectionId) => sections[sectionId]?.orderedItemIds[0] || null,
  };
}

function tierOf(item) { return Number.isInteger(item.tier) ? item.tier : 2; }
function cmpSec(a, b) {
  const [au, as] = a.split(".").map(Number); const [bu, bs] = b.split(".").map(Number);
  return au - bu || as - bs;
}
