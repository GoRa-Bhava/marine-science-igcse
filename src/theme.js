// Two oceanic palettes + app-wide setting defaults. Colours are real hex (not
// CSS vars) because several SVGs feed them into presentation attributes, where
// var() is invalid. See App.jsx for how the active palette is swapped per render.
export const PALETTES = {
  dark: {
    abyss: "#04141F", deep: "#0A2A3D", shelf: "#12455F", raise: "#17546F", line: "#1E6A87",
    foam: "#EAF6F5", mist: "#A9C7D2", glow: "#4FD8C4", accent: "#4FD8C4", glowDim: "#2A9C90",
    coral: "#FF7A5C", sand: "#F2D9A8", gold: "#F3C34E", ok: "#4FD8C4", no: "#FF9E7D",
    bg0: "#0A2A3D", bg1: "#04141F", inset: "#04141F",
  },
  // Independent light palette (not the dark one lightened). Text is near-black /
  // dark slate at full strength; accents deepened to read on white; surfaces are
  // near-white lifted by borders, not by being a lighter shade of the bg.
  // - abyss stays dark: it's the ink painted ON teal/coral accents.
  // - glow stays light teal: it's the accent FILL (dark ink reads on it);
  //   accent TEXT uses `accent` (deep teal). line is dark enough to double as
  //   muted text (>=4.5:1) while still working as a soft border.
  light: {
    abyss: "#04141F", deep: "#0A2A3D", shelf: "#FBFDFD", raise: "#EEF5F6", line: "#4A6672",
    foam: "#12242F", mist: "#46606C", glow: "#4FD8C4", accent: "#0C7C6F", glowDim: "#7FB8AE",
    coral: "#C2502E", sand: "#8A6410", gold: "#8A6410", ok: "#0C7C6F", no: "#C2502E",
    bg0: "#F4FBFB", bg1: "#E4F1F2", inset: "#FFFFFF",
  },
};

export function paletteFor(theme) {
  return PALETTES[theme] || PALETTES.dark;
}

// App preferences, stored inside the single progress record.
export const DEFAULT_SETTINGS = { theme: "dark", feedback: "immediate" };

// Backup file schema. Bump when the backup shape changes incompatibly.
export const BACKUP_SCHEMA = 1;
