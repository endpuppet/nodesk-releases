// Intro. The logo draws itself and the name appears, alone in the middle of the screen. The tagline's
// words then land scattered and tilted across the desk mat, like loose things on a desk, and snap onto
// the grid into one clean line, each sending a ripple through the dots. Then the header and the tagline
// slide to their places and the rest of the page fills in, step by step. Any click or key skips it.
// The head script in index.html only adds `html.intro` at the top of the page without reduced motion.
const SCATTER = [[-0.24, -0.1, -13], [0.2, -0.17, 10], [-0.1, 0.16, 7], [0.26, 0.07, -11], [0.03, 0.22, -6]];

export function playIntro(mat) {
  const root = document.documentElement;
  const ready = {};
  ready.gallery = new Promise((r) => { ready.openGallery = r; });
  if (!root.classList.contains("intro")) { ready.openGallery(); return { gallery: ready.gallery, done: Promise.resolve() }; }

  const brand = document.querySelector(".brand"), h1 = document.querySelector(".hero h1");
  const words = [...h1.querySelectorAll(".w")];
  const timers = [];
  let finished = false;
  const at = (ms, fn) => timers.push(setTimeout(fn, ms));

  const place = () => {
    const vw = innerWidth, vh = innerHeight;
    const b = brand.getBoundingClientRect(), t = h1.getBoundingClientRect();
    const s = Math.min(2.9, (vw * 0.78) / b.width, (vh * 0.3) / b.height);
    const by = vh / 2 - Math.min(96, vh * 0.14), ty = vh / 2 + Math.min(64, vh * 0.09);
    brand.style.transform = `translate(${vw / 2 - (b.left + b.width / 2)}px, ${by - (b.top + b.height / 2)}px) scale(${s})`;
    h1.style.transform = `translate(${vw / 2 - (t.left + t.width / 2)}px, ${ty - (t.top + t.height / 2)}px)`;
    const sx = Math.min(vw * 0.5, 620), sy = Math.min(vh * 0.5, 360);
    words.forEach((w, i) => {
      const [x, y, r] = SCATTER[i % SCATTER.length];
      w.style.setProperty("--sx", `${x * sx}px`); w.style.setProperty("--sy", `${y * sy}px`); w.style.setProperty("--sr", `${r}deg`);
    });
  };
  place();

  const step = (n) => { root.classList.add(`st${n}`); document.querySelectorAll(`[data-st="${n}"]`).forEach((e) => e.classList.add("on")); if (n === 3) ready.openGallery(); };
  const tidy = () => {
    root.classList.add("tidy");
    words.forEach((w, i) => at(i * 70 + 420, () => { const r = w.getBoundingClientRect(); mat?.ripple(r.left + r.width / 2, r.top + r.height * 0.62); }));
  };
  let resolveDone;
  const done = new Promise((r) => { resolveDone = r; });
  const onResize = () => { if (!finished && !root.classList.contains("slide")) place(); };
  const finish = () => {
    if (finished) return;
    finished = true;
    timers.forEach(clearTimeout);
    brand.style.transform = h1.style.transform = "";
    root.classList.remove("intro", "logo", "name", "tag", "tidy", "slide", "st1", "st2", "st3", "st4", "st5");
    document.querySelectorAll("[data-st]").forEach((e) => e.classList.remove("on"));
    ready.openGallery();
    removeEventListener("pointerdown", skip); removeEventListener("keydown", skip); removeEventListener("resize", onResize);
    resolveDone();
  };
  const skip = () => {
    if (finished) return;
    timers.forEach(clearTimeout);
    brand.style.transform = h1.style.transform = "";
    root.classList.add("logo", "name", "tag", "tidy", "slide");
    [1, 2, 3, 4, 5].forEach(step);
    at(700, finish);
  };
  addEventListener("pointerdown", skip, { once: true });
  addEventListener("keydown", skip, { once: true });
  addEventListener("resize", onResize);

  at(250, () => root.classList.add("logo"));
  at(1100, () => root.classList.add("name"));
  at(1650, () => root.classList.add("tag"));
  at(2550, tidy);
  at(3700, () => { brand.style.transform = h1.style.transform = ""; root.classList.add("slide"); });
  at(4050, () => step(1));
  at(4350, () => step(2));
  at(4650, () => step(3));
  at(4950, () => step(4));
  at(5250, () => step(5));
  at(6300, finish);
  return { gallery: ready.gallery, done };
}
