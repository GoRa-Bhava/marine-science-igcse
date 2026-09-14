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
  light: {
    abyss: "#04141F", deep: "#0A2A3D", shelf: "#D7E8E9", raise: "#C7DFE1", line: "#6E93A0",
    foam: "#0A2733", mist: "#42636F", glow: "#4FD8C4", accent: "#0C7C6F", glowDim: "#8FC7BE",
    coral: "#CE4E2C", sand: "#B0821F", gold: "#B0820A", ok: "#0C7C6F", no: "#C24A28",
    bg0: "#F4FBFB", bg1: "#E4F1F2", inset: "#F7FCFC",
  },
};

export function paletteFor(theme) {
  return PALETTES[theme] || PALETTES.dark;
}

// App preferences, stored inside the single progress record.
export const DEFAULT_SETTINGS = { theme: "dark", feedback: "immediate" };

// Backup file schema. Bump when the backup shape changes incompatibly.
export const BACKUP_SCHEMA = 1;
