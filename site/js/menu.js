// Phone menu: the section links that the header hides below 720 px.
export function initMenu() {
  const btn = document.getElementById("menu-btn"), nav = document.getElementById("mobile-nav");
  const set = (open) => { nav.hidden = !open; btn.setAttribute("aria-expanded", String(open)); btn.setAttribute("aria-label", open ? "Close menu" : "Menu"); };
  btn.addEventListener("click", () => set(nav.hidden));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) set(false); });
  document.addEventListener("click", (e) => { if (!nav.hidden && !e.target.closest(".top")) set(false); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !nav.hidden) { set(false); btn.focus(); } });
  matchMedia("(min-width: 721px)").addEventListener("change", (e) => { if (e.matches) set(false); });
}
