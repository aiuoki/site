// Single source of truth for every color on the site.
// BaseLayout turns these tokens into CSS variables (surface2 -> --surface-2).
// If something looks wrong in one mode, fix it here and nowhere else.
export const themes = {
  dark: {
    bg: "#0b0e13", surface: "#12161e", surface2: "#181d27", line: "#252c39",
    fg: "#e9edf4", muted: "#8a94a8", axis: "#c9d0dc", grid: "#1b212c", handle: "#ffffff",
    sin: "#ff9d2e", cos: "#a07bff", tan: "#ffd84a", cot: "#2fb3e3", sec: "#ff4d79", csc: "#a6d63a",
    a: "#ff8a3d", b: "#3fd0c0", g: "#ff5cb0",
    coffee: "#FFDD00", coffeeFg: "#1b1a12",
  },
  light: {
    bg: "#eef5f1", surface: "#ffffff", surface2: "#e5efe9", line: "#d1dcd6",
    fg: "#13201b", muted: "#53625b", axis: "#26332d", grid: "#dfe8e3", handle: "#13201b",
    sin: "#d97000", cos: "#6c3ef0", tan: "#b58c00", cot: "#0a85b8", sec: "#dc1f55", csc: "#4f8f00",
    a: "#d4600f", b: "#0b8f82", g: "#c81d7a",
    coffee: "#FFDD00", coffeeFg: "#1b1a12",
  },
} as const;

export type ThemeName = keyof typeof themes;
export type ThemeToken = keyof (typeof themes)["dark"];

// Semantic names used by the complex numbers topic.
export const aliases = {
  z: "a",
  w: "csc",
  result: "g",
  re: "cos",
  im: "cot",
} as const satisfies Record<string, ThemeToken>;

export const themeStorageKey = "trig-theme";
