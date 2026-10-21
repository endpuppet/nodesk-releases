// system -> light -> dark -> system. "system" removes data-theme so the CSS media query decides.
const KEY = "nodesk.site.theme";
const ORDER = ["system", "light", "dark"];
const LABEL = { system: "follows system", light: "light", dark: "dark" };

function read() {
  try { const v = localStorage.getItem(KEY); return v === "light" || v === "dark" ? v : "system"; } catch { return "system"; }
}

export function initTheme() {
  const btn = document.getElementById("theme-toggle");
  let mode = read();

  const apply = () => {
    if (mode === "system") delete document.documentElement.dataset.theme;
    else document.documentElement.dataset.theme = mode;
    btn.dataset.mode = mode;
    const next = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
    btn.setAttribute("aria-label", `Theme: ${LABEL[mode]}. Switch to ${next === "system" ? "follow system" : next}`);
  };

  btn.addEventListener("click", () => {
    mode = ORDER[(ORDER.indexOf(mode) + 1) % ORDER.length];
    try { mode === "system" ? localStorage.removeItem(KEY) : localStorage.setItem(KEY, mode); } catch { /* storage blocked: the choice lasts for this visit */ }
    apply();
  });
  apply();
}
