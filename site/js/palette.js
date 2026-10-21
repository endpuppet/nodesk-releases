// noDesk theme system v2: the single source of every colour, for the site now and the app later.
// Pure module (no DOM): scripts/build-themes.mjs imports it to write site/css/themes.css and
// design/themes/tokens.json; the site imports it to draw live theme previews.
//
// A theme = a FAMILY (neutral hue + tint strength) in a MODE (dark | light), plus an ACCENT.
// Every family walks the same OKLCH lightness ladder, so contrast is the same in all of them; only the
// colour of the neutrals changes. Accents share one perceived lightness per mode, so none shouts louder
// than another. All values are gamut-mapped to sRGB and checked against WCAG contrast.

// ───────── colour maths (OKLCH → sRGB, WCAG contrast) ─────────
const toLinear = (v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
const toGamma = (v) => (v <= 0.0031308 ? 12.92 * v : 1.055 * v ** (1 / 2.4) - 0.055);

function oklchToLinear(L, C, h) {
  const a = C * Math.cos((h * Math.PI) / 180), b = C * Math.sin((h * Math.PI) / 180);
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
const inGamut = (rgb) => rgb.every((v) => v >= -1e-4 && v <= 1 + 1e-4);

/** OKLCH → "#rrggbb", lowering chroma until the colour fits sRGB (keeps lightness and hue). */
export function oklch(L, C, h) {
  let lo = 0, hi = C, rgb = oklchToLinear(L, C, h);
  if (!inGamut(rgb)) {
    for (let i = 0; i < 24; i++) { const mid = (lo + hi) / 2; if (inGamut(oklchToLinear(L, mid, h))) lo = mid; else hi = mid; }
    rgb = oklchToLinear(L, lo, h);
  }
  return "#" + rgb.map((v) => Math.round(Math.min(1, Math.max(0, toGamma(Math.min(1, Math.max(0, v))))) * 255).toString(16).padStart(2, "0")).join("");
}

export const rgbOf = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
export function luminance(hex) {
  const [r, g, b] = rgbOf(hex).map((v) => toLinear(v / 255));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
export function contrast(a, b) {
  const x = luminance(a) + 0.05, y = luminance(b) + 0.05;
  return Math.max(x, y) / Math.min(x, y);
}
/** Mix two hex colours in linear light (t = share of b). Used for solid "soft" tints the app can use as-is. */
export function mix(a, b, t) {
  const A = rgbOf(a).map((v) => toLinear(v / 255)), B = rgbOf(b).map((v) => toLinear(v / 255));
  return "#" + A.map((v, i) => Math.round(toGamma(v * (1 - t) + B[i] * t) * 255).toString(16).padStart(2, "0")).join("");
}

// ───────── the lightness ladder (same for every family) ─────────
// [L, chroma share of the family tint]
const LADDER = {
  dark: {
    "bg-2": [0.18, 1], bg: [0.205, 1], "surface-1": [0.245, 0.95], "surface-2": [0.285, 0.9], "surface-3": [0.322, 0.85],
    "line-1": [0.33, 0.8], "line-2": [0.415, 0.7], "text-3": [0.7, 0.45], "text-2": [0.81, 0.35], "text-1": [0.955, 0.2],
    "grid-dot": [0.5, 0.8], "wall-1": [0.3, 1.9], "wall-2": [0.165, 1.2],
  },
  light: {
    "bg-2": [0.94, 1], bg: [0.968, 0.8], "surface-1": [0.988, 0.4], "surface-2": [1, 0], "surface-3": [0.955, 0.8],
    "line-1": [0.9, 0.8], "line-2": [0.82, 0.8], "text-3": [0.505, 0.6], "text-2": [0.415, 0.6], "text-1": [0.225, 0.7],
    "grid-dot": [0.75, 1.1], "wall-1": [0.86, 2.2], "wall-2": [0.95, 1.2],
  },
};

// ───────── families ─────────
// hue = neutral hue, tint = neutral chroma per mode; shift = optional lightness offset for the dark ladder
export const FAMILIES = [
  { id: "dusk", name: "Dusk", hue: 262, tint: { dark: 0.042, light: 0.02 }, accent: "lamp", note: "Ink blue after sunset, a lamp on the desk. The default." },
  { id: "graphite", name: "Graphite", hue: 250, tint: { dark: 0.014, light: 0.009 }, accent: "teal", note: "Cool and grey, close to the app's look today." },
  { id: "felt", name: "Felt", hue: 165, tint: { dark: 0.036, light: 0.018 }, accent: "brass", note: "Green desk felt and brass fittings." },
  { id: "walnut", name: "Walnut", hue: 48, tint: { dark: 0.03, light: 0.014 }, accent: "teal", note: "Warm wood by night, pale birch by day." },
  { id: "plum", name: "Plum", hue: 318, tint: { dark: 0.038, light: 0.018 }, accent: "rose", note: "Deep aubergine, soft lilac paper." },
  { id: "carbon", name: "Carbon", hue: 260, tint: { dark: 0, light: 0 }, shift: { dark: -0.06 }, accent: "lamp", note: "No tint at all. True black at night." },
];

// ───────── accents (one perceived lightness per mode) ─────────
export const ACCENTS = [
  { id: "lamp", name: "Lamp", hue: 58, chroma: 0.16 },
  { id: "brass", name: "Brass", hue: 88, chroma: 0.14 },
  { id: "coral", name: "Coral", hue: 30, chroma: 0.16 },
  { id: "rose", name: "Rose", hue: 358, chroma: 0.15 },
  { id: "iris", name: "Iris", hue: 292, chroma: 0.15 },
  { id: "sky", name: "Sky", hue: 245, chroma: 0.13 },
  { id: "teal", name: "Teal", hue: 196, chroma: 0.12 },
  { id: "fern", name: "Fern", hue: 148, chroma: 0.15 },
];

// Context accents (the app's Home / Art / Dev / Focus) and status colours follow the accent rules.
export const CONTEXTS = [
  { id: "home", name: "Home", hue: 292, chroma: 0.13 },
  { id: "art", name: "Art", hue: 40, chroma: 0.14 },
  { id: "dev", name: "Dev", hue: 162, chroma: 0.13 },
  { id: "focus", name: "Focus", hue: 245, chroma: 0.12 },
];
export const STATUS = [
  { id: "ok", hue: 150, chroma: 0.14 }, { id: "warn", hue: 80, chroma: 0.14 },
  { id: "info", hue: 245, chroma: 0.12 }, { id: "danger", hue: 25, chroma: 0.17 },
];

export const MODES = ["dark", "light"];
export const DEFAULTS = { family: "dusk", mode: "dark", accent: "lamp" };

/** Neutral tokens of a family in a mode, as hex. */
export function neutrals(familyId, mode) {
  const f = FAMILIES.find((x) => x.id === familyId) || FAMILIES[0];
  const shift = f.shift?.[mode] || 0, tint = f.tint[mode];
  const out = {};
  for (const [k, [L, share]] of Object.entries(LADDER[mode])) {
    const l = k.startsWith("text") || k.startsWith("wall") ? L : Math.max(0.05, L + shift);
    out[k] = oklch(Math.min(1, l), tint * share, f.hue);
  }
  return out;
}

// Accent-like colours. Dark: one bright fill that doubles as text, dark label on it. Light: the same bright
// fill with a dark label (buttons stay lively), plus an "ink" for accent-coloured TEXT, darkened until it
// reads at 4.6:1 on every light background of every family.
let LIGHT_BGS;
const lightBgs = () => (LIGHT_BGS ||= FAMILIES.flatMap((f) => { const n = neutrals(f.id, "light"); return [n.bg, n["bg-2"], n["surface-1"], n["surface-2"], n["surface-3"]]; }));
function darkLabel(fill, hue, chroma) {
  let L = 0.24;
  while (L > 0.08 && contrast(oklch(L, Math.min(chroma, 0.06), hue), fill) < 4.6) L -= 0.02;
  return oklch(L, Math.min(chroma, 0.06), hue);
}
function lightInk(hue, chroma, start, against) {
  let L = start;
  while (L > 0.2 && against.some((bg) => contrast(oklch(L, chroma, hue), bg) < 4.6)) L -= 0.01;
  return oklch(L, chroma, hue);
}
export function accentSet(hue, chroma, mode) {
  if (mode === "dark") {
    const accent = oklch(0.8, chroma, hue);
    return { accent, "accent-hi": oklch(0.86, chroma * 0.85, hue), "accent-ink": accent, "on-accent": darkLabel(accent, hue, chroma) };
  }
  const accent = oklch(0.72, chroma, hue);
  return { accent, "accent-hi": oklch(0.67, chroma, hue), "accent-ink": lightInk(hue, chroma, 0.55, lightBgs()), "on-accent": darkLabel(accent, hue, chroma) };
}

/** Every token for one family, mode and accent (hex values; *-soft and *-line are alpha forms). */
export function tokens(familyId = DEFAULTS.family, mode = DEFAULTS.mode, accentId = DEFAULTS.accent) {
  const n = neutrals(familyId, mode);
  const a = ACCENTS.find((x) => x.id === accentId) || ACCENTS[0];
  const acc = accentSet(a.hue, a.chroma, mode);
  const t = { ...n, ...acc };
  for (const c of [...CONTEXTS, ...STATUS]) {
    const s = accentSet(c.hue, c.chroma, mode);
    t[c.id === "ok" || c.id === "warn" || c.id === "info" || c.id === "danger" ? c.id : `ctx-${c.id}`] = s["accent-ink"];
    if (CONTEXTS.includes(c)) t[`ctx-${c.id}-on`] = s["on-accent"];
    if (CONTEXTS.includes(c)) t[`ctx-${c.id}-fill`] = s.accent;
  }
  // solid helpers for places that cannot blend (the native app): accent tint over surface-1
  t["accent-soft-solid"] = mix(n["surface-1"], acc.accent, mode === "dark" ? 0.16 : 0.12);
  return t;
}
