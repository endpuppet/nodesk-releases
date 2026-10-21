// Accent setting. Default is orange. A chosen colour is stored already worked out for both themes
// ({d: dark accent, od: text on it, l: deeper light-theme accent}) so the head script in index.html
// can apply it before first paint with no colour maths.
const KEY = "nodesk.site.accent";
export const ACCENTS = [["Orange", "#ffa94d"], ["Mint", "#8ff0c4"], ["Aqua", "#5eead4"], ["Sky", "#a8c6ff"], ["Violet", "#9b8cff"], ["Rose", "#ff8fab"], ["Coral", "#ff7a6b"], ["Lime", "#b8f26b"]];

const rgb = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const hex = (c) => "#" + c.map((v) => Math.round(Math.max(0, Math.min(255, v))).toString(16).padStart(2, "0")).join("");
const lum = (c) => { const [r, g, b] = c.map((v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const contrast = (a, b) => { const x = lum(a) + 0.05, y = lum(b) + 0.05; return Math.max(x, y) / Math.min(x, y); };
function toHsl([r, g, b]) {
  r /= 255; g /= 255; b /= 255;
  const mx = Math.max(r, g, b), mn = Math.min(r, g, b), l = (mx + mn) / 2;
  if (mx === mn) return [0, 0, l];
  const d = mx - mn, s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
  const h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4;
  return [h * 60, s, l];
}
function fromHsl([h, s, l]) {
  const f = (n) => { const k = (n + h / 30) % 12, a = s * Math.min(l, 1 - l); return 255 * (l - a * Math.max(-1, Math.min(k - 3, 9 - k, 1))); };
  return [f(0), f(8), f(4)];
}

// dark theme: the colour as is, with a very dark or white label; light theme: darkened until it
// reads at 4.6:1 on the lightest page background (#e9edf2), which keeps text and buttons AA.
export function derive(h) {
  const c = rgb(h), [hh, s, l] = toHsl(c);
  const od = lum(c) > 0.35 ? hex(fromHsl([hh, Math.min(s, 0.8), 0.1])) : "#ffffff";
  let ll = Math.min(l, 0.45), light = fromHsl([hh, Math.min(s, 0.9), ll]);
  while (contrast(light, rgb("#e9edf2")) < 4.6 && ll > 0.1) { ll -= 0.01; light = fromHsl([hh, Math.min(s, 0.9), ll]); }
  return { d: h, od, l: hex(light) };
}

export function initAccent() {
  const btn = document.getElementById("accent-btn"), pop = document.getElementById("accent-pop"), grid = document.getElementById("accent-grid");
  let current = (() => { try { return JSON.parse(localStorage.getItem(KEY) || "null")?.d ?? ACCENTS[0][1]; } catch { return ACCENTS[0][1]; } })();

  const apply = (h, save) => {
    const root = document.documentElement.style, v = derive(h);
    if (h === ACCENTS[0][1]) { ["--acc-d", "--on-d", "--acc-l"].forEach((k) => root.removeProperty(k)); if (save) try { localStorage.removeItem(KEY); } catch { /* ignore */ } }
    else {
      root.setProperty("--acc-d", v.d); root.setProperty("--on-d", v.od); root.setProperty("--acc-l", v.l);
      if (save) try { localStorage.setItem(KEY, JSON.stringify(v)); } catch { /* ignore */ }
    }
    current = h;
    grid.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.c === h)));
  };

  grid.replaceChildren(...ACCENTS.map(([name, h]) => {
    const b = document.createElement("button");
    b.type = "button"; b.dataset.c = h; b.style.setProperty("--c", h); b.title = name; b.setAttribute("aria-label", name);
    b.addEventListener("click", () => apply(h, true));
    return b;
  }));
  apply(current, false);

  const set = (open) => { pop.hidden = !open; btn.setAttribute("aria-expanded", String(open)); };
  btn.addEventListener("click", () => set(pop.hidden));
  document.getElementById("accent-reset").addEventListener("click", () => apply(ACCENTS[0][1], true));
  document.addEventListener("click", (e) => { if (!pop.hidden && !e.target.closest(".accpick")) set(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !pop.hidden) { set(false); btn.focus(); } });
}
