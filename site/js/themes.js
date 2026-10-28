// Theme picker: family, light/dark/system, accent. The colours themselves live in css/themes.css
// (generated from palette.js); this only sets data-family / data-mode / data-accent on <html> and draws
// the pickers. The head script in index.html applies the saved choice before first paint.
import { ACCENTS, FAMILIES, DEFAULTS, tokens } from "./palette.js?v=8342084e";

const KEY = "nodesk.site.theme.v2";
const MODES = [["system", "Auto"], ["light", "Day"], ["dark", "Night"]];
const sys = matchMedia("(prefers-color-scheme: light)");

function load() {
  try {
    const q = /[?&]theme=([a-z]+)\.(light|dark|system)\.([a-z]+)/.exec(location.search);
    const s = q ? { family: q[1], mode: q[2], accent: q[3] } : JSON.parse(localStorage.getItem(KEY) || "{}") || {};
    return {
      family: FAMILIES.some((f) => f.id === s.family) ? s.family : DEFAULTS.family,
      accent: ACCENTS.some((a) => a.id === s.accent) ? s.accent : DEFAULTS.accent,
      mode: ["system", "light", "dark"].includes(s.mode) ? s.mode : "system",
    };
  } catch { return { family: DEFAULTS.family, accent: DEFAULTS.accent, mode: "system" }; }
}

export function initThemes() {
  const root = document.documentElement;
  const state = load();
  const resolved = () => (state.mode === "system" ? (sys.matches ? "light" : "dark") : state.mode);

  const el = (tag, attrs = {}, html = "") => { const n = document.createElement(tag); for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v); n.innerHTML = html; return n; };

  function apply(save) {
    const mode = resolved();
    root.dataset.family = state.family; root.dataset.accent = state.accent; root.dataset.mode = mode;
    if (save) try { localStorage.setItem(KEY, JSON.stringify(state)); } catch { /* private mode: the choice lasts for this visit */ }
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = tokens(state.family, mode, state.accent).bg;
    render();
    dispatchEvent(new CustomEvent("nd:theme", { detail: { ...state, mode } }));
  }

  // ── pickers (the header popover and the "Make it yours" section share these builders) ──
  function render() {
    const mode = resolved();
    document.querySelectorAll("[data-theme-mode]").forEach((box) => {
      box.replaceChildren(...MODES.map(([id, name]) => {
        const b = el("button", { type: "button", "aria-pressed": String(state.mode === id) }, name);
        b.addEventListener("click", () => { state.mode = id; apply(true); });
        return b;
      }));
    });
    document.querySelectorAll("[data-theme-accents]").forEach((box) => {
      box.replaceChildren(...ACCENTS.map((a) => {
        const b = el("button", { type: "button", "aria-pressed": String(state.accent === a.id), "aria-label": a.name, title: a.name });
        b.style.setProperty("--c", tokens(state.family, mode, a.id).accent);
        b.addEventListener("click", () => { state.accent = a.id; apply(true); });
        return b;
      }));
    });
    document.querySelectorAll("[data-theme-fams]").forEach((box) => {
      box.replaceChildren(...FAMILIES.map((f) => {
        const t = tokens(f.id, mode, state.accent);
        const b = el("button", { type: "button", "aria-pressed": String(state.family === f.id) }, `<span class="fsw" aria-hidden="true"></span>${f.name}`);
        const sw = b.firstChild; sw.style.setProperty("--a", t.bg); sw.style.setProperty("--b", t["surface-2"]); sw.style.setProperty("--c", t["text-1"]);
        b.addEventListener("click", () => { state.family = f.id; apply(true); });
        return b;
      }));
    });
    document.querySelectorAll("[data-theme-tiles]").forEach((box) => {
      box.replaceChildren(...FAMILIES.map((f) => {
        const t = tokens(f.id, mode, state.accent);
        const b = el("button", { type: "button", class: "fam", "aria-pressed": String(state.family === f.id) },
          `<span class="mini" aria-hidden="true"><span class="mh"><i></i><u></u></span><span class="mi"><i></i><i></i><i style="width:70%"></i><b></b></span><span class="mj"></span></span>
           <span class="name"><b>${f.name}</b><span>${mode === "light" ? "Day" : "Night"}</span></span><p>${f.note}</p>`);
        const m = b.querySelector(".mini");
        for (const [k, v] of Object.entries({ wall1: t["wall-1"], wall2: t["wall-2"], dot: t["grid-dot"], s1: t["surface-1"], s2: t["surface-2"], l1: t["line-1"], l2: t["line-2"], t1: t["text-1"], t3: t["text-3"], acc: t.accent }))
          m.style.setProperty(`--m-${k}`, v);
        b.addEventListener("click", () => { state.family = f.id; apply(true); });
        return b;
      }));
    });
  }

  // header popover
  const btn = document.getElementById("theme-btn"), pop = document.getElementById("theme-pop");
  const open = (on) => { pop.hidden = !on; btn.setAttribute("aria-expanded", String(on)); };
  btn.addEventListener("click", () => open(pop.hidden));
  document.addEventListener("click", (e) => { if (!pop.hidden && !e.target.closest(".tpop-wrap")) open(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !pop.hidden) { open(false); btn.focus(); } });

  sys.addEventListener("change", () => { if (state.mode === "system") apply(false); });
  apply(false);
}
