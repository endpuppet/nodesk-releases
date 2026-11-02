// Scroll helpers: a thin progress line under the header and the current section lit in the nav.
export function initSpy() {
  const bar = document.getElementById("progress");
  const links = [...document.querySelectorAll("nav.main a")];
  const targets = [...document.querySelectorAll("main > section[id]")].filter((t) => t.id !== "top");
  let queued = false;
  const update = () => {
    queued = false;
    const max = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
    const line = innerHeight * 0.35;
    let cur = null;
    for (const t of targets) if (t.getBoundingClientRect().top <= line) cur = t;
    for (const a of links) { const on = cur && a.getAttribute("href") === `#${cur.id}`; if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); }
  };
  const queue = () => { if (!queued) { queued = true; requestAnimationFrame(update); } };
  addEventListener("scroll", queue, { passive: true });
  addEventListener("resize", queue);
  update();
}
