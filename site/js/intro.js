// Intro. The logo, the name and the tagline appear alone in the middle of the screen (the real header
// brand and the real h1, moved and scaled with transforms). Then they slide to their places and the
// rest of the page fades in step by step: header controls and badge, description, demo, narration.
// Any click or key skips it. The head script in index.html only adds `html.intro` when the visitor is
// at the top of the page and has not asked for reduced motion.
export function playIntro() {
  const root = document.documentElement;
  const ready = {};
  ready.gallery = new Promise((r) => { ready.openGallery = r; });
  if (!root.classList.contains("intro")) { ready.openGallery(); return { gallery: ready.gallery, done: Promise.resolve() }; }

  const brand = document.querySelector(".brand"), h1 = document.querySelector(".hero h1");
  const timers = [];
  let finished = false;
  const at = (ms, fn) => timers.push(setTimeout(fn, ms));

  // where the two pieces start: stacked in the middle of the viewport
  const place = () => {
    const vw = innerWidth, vh = innerHeight;
    const b = brand.getBoundingClientRect(), t = h1.getBoundingClientRect();
    const s = Math.min(2.9, (vw * 0.78) / b.width, (vh * 0.3) / b.height);
    const by = vh / 2 - Math.min(80, vh * 0.12), ty = vh / 2 + Math.min(70, vh * 0.1);
    brand.style.transform = `translate(${vw / 2 - (b.left + b.width / 2)}px, ${by - (b.top + b.height / 2)}px) scale(${s})`;
    h1.style.transform = `translate(${vw / 2 - (t.left + t.width / 2)}px, ${ty - (t.top + t.height / 2)}px)`;
  };
  place();

  const step = (n) => { root.classList.add(`st${n}`); document.querySelectorAll(`[data-st="${n}"]`).forEach((e) => e.classList.add("on")); if (n === 3) ready.openGallery(); };
  const finish = () => {
    if (finished) return;
    finished = true;
    timers.forEach(clearTimeout);
    brand.style.transform = h1.style.transform = "";
    root.classList.remove("intro", "logo", "name", "tag", "slide", "st1", "st2", "st3", "st4", "st5");
    document.querySelectorAll("[data-st]").forEach((e) => e.classList.remove("on"));
    ready.openGallery();
    removeEventListener("pointerdown", skip); removeEventListener("keydown", skip); removeEventListener("resize", onResize);
    resolveDone();
  };
  let resolveDone;
  const done = new Promise((r) => { resolveDone = r; });
  const skip = () => {
    if (finished) return;
    // jump to the end state, but let the page fade in once instead of popping
    brand.style.transform = h1.style.transform = "";
    root.classList.add("logo", "name", "tag", "slide");
    [1, 2, 3, 4, 5].forEach(step);
    timers.forEach(clearTimeout);
    at(700, finish);
  };
  addEventListener("pointerdown", skip, { once: true });
  addEventListener("keydown", skip, { once: true });
  const onResize = () => { if (!finished && !root.classList.contains("slide")) place(); };
  addEventListener("resize", onResize);

  at(250, () => root.classList.add("logo"));
  at(1150, () => root.classList.add("name"));
  at(1700, () => root.classList.add("tag"));
  at(3000, () => { brand.style.transform = h1.style.transform = ""; root.classList.add("slide"); });
  at(3350, () => step(1));
  at(3650, () => step(2));
  at(3950, () => step(3));
  at(4250, () => step(4));
  at(4550, () => step(5));
  at(5600, finish);
  return { gallery: ready.gallery, done };
}
