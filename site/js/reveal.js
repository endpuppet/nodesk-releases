// Scroll reveals and the pointer-following glow on the feature cards.
export function initReveal() {
  const items = document.querySelectorAll(".reveal");
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window);
  if (still) {
    items.forEach((el) => el.classList.add("in"));
  } else {
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("in");
        io.unobserve(e.target);
      }
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    items.forEach((el) => io.observe(el));
  }

  const grid = document.getElementById("fgrid");
  if (!grid) return;
  grid.addEventListener("pointermove", (e) => {
    const card = e.target.closest(".card");
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty("--mx", `${e.clientX - r.left}px`);
    card.style.setProperty("--my", `${e.clientY - r.top}px`);
  });
}
