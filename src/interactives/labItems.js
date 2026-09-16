// The Interactive Lab's menu: one entry per interactive, labelled by concept +
// unit so the selector doubles as a course map. Add new interactives here as
// they land. Kept as plain data (no JSX) so it is unit-testable; InteractiveLab
// maps each key to its component.
export const LAB_ITEMS = [
  { key: "tides", label: "Tides (Unit 1)" },
  { key: "depth", label: "Ocean depth (Unit 2)" },
  { key: "melt", label: "Melting ice & sea level (Units 2 & 6)" },
  { key: "estuary", label: "Estuary tides (Unit 5)" },
  { key: "rocky", label: "Rocky-shore zonation (Unit 5)" },
  { key: "foodweb", label: "Food-web removal (Unit 4)" },
  { key: "eutrophication", label: "Eutrophication & oxygen (Unit 6)" },
  { key: "greenhouse", label: "Enhanced greenhouse effect (Unit 6)" },
];
