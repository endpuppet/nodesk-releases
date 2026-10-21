// Hero gallery engine: one mini-desktop (#stage), a list of scenes (scenes.js), dots to pick one.
// A scene is replaced wholesale when it starts, so nothing needs resetting. Playback pauses when the
// gallery is off-screen, the tab is hidden, or the person pauses it. Under prefers-reduced-motion
// each scene runs to its end state at once and nothing advances by itself.
import { SCENES } from "./scenes.js?v=1aaa7b4c";

const $ = (id) => document.getElementById(id);
const CANCEL = Symbol("cancel");

export function initGallery(ready = Promise.resolve()) {
  const box = $("stagebox"), stage = $("stage"), host = $("scene-host"), cursorEl = $("cursor"), flyer = $("flyer");
  const dotsEl = $("dots"), ctl = $("gctl"), toggle = $("g-toggle");
  const haloEl = $("halo"), haloCur = $("halo-cur"), haloStatus = $("halo-status");
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const logicalW = () => parseFloat(getComputedStyle(box).getPropertyValue("--w"));
  const logicalH = () => parseFloat(getComputedStyle(box).getPropertyValue("--h"));
  const scale = () => box.clientWidth / logicalW();
  const NAMES = { home: "Home", art: "Art", dev: "Dev", focus: "Focus" };
  const setCtx = (c) => {
    stage.dataset.ctx = c;
    haloCur.textContent = NAMES[c];
    stage.querySelectorAll(".ctx").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.ctx === c)));
  };
  stage.querySelectorAll(".ctx").forEach((b) => b.addEventListener("click", () => setCtx(b.dataset.ctx)));

  const fit = () => {
    stage.style.setProperty("--s", scale());
    stage.toggleAttribute("data-narrow", logicalW() < 500);
  };
  new ResizeObserver(fit).observe(box);
  fit();

  const clock = $("halo-clock");
  const tick = () => { const d = new Date(); clock.textContent = `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`; };
  tick(); setInterval(tick, 20000);

  // dots
  const dots = SCENES.map((s, i) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "gdot"; b.title = s.short; b.setAttribute("aria-label", `${s.short} (${i + 1} of ${SCENES.length})`);
    b.append(document.createElement("i"));
    b.addEventListener("click", () => play(i));
    dotsEl.append(b);
    return b;
  });

  // playback state
  let token = 0, idx = 0, manualPause = false, inView = true;
  const paused = () => manualPause || !inView || document.hidden;
  new IntersectionObserver(([e]) => { inView = e.isIntersecting; }, { threshold: 0.25 }).observe(box);

  const rect = (el) => {
    const s = scale(), r = el.getBoundingClientRect(), b = stage.getBoundingClientRect();
    return { x: (r.left - b.left) / s, y: (r.top - b.top) / s, w: r.width / s, h: r.height / s };
  };

  function makeApi(my, scene) {
    const live = () => { if (my !== token) throw CANCEL; };
    const wait = (ms) => new Promise((res, rej) => {
      if (my !== token) return rej(CANCEL);
      if (reduced) return res();
      let left = ms, last = performance.now();
      const step = () => {
        if (my !== token) return rej(CANCEL);
        const now = performance.now();
        if (!paused()) left -= now - last;
        last = now;
        left <= 0 ? res() : setTimeout(step, 50);
      };
      step();
    });
    const els = (x) => { const cls = typeof x.at(-1) === "string" ? x.pop() : "on"; return [x, cls]; };
    let said = 0;
    const api = {
      W: logicalW(), H: logicalH(),
      wait,
      q: (s) => host.querySelector(s),
      qa: (s) => [...host.querySelectorAll(s)],
      sq: (s) => stage.querySelector(s),
      on: (...x) => { const [e, c] = els(x); e.forEach((n) => n.classList.add(c)); },
      off: (...x) => { const [e, c] = els(x); e.forEach((n) => n.classList.remove(c)); },
      say(text) {
        live();
        $("g-now").textContent = text;
        said++;
        const cap = $("scap");
        cap.classList.remove("on"); void cap.offsetWidth;
        $("scap-n").textContent = said; $("scap-t").textContent = text; cap.classList.add("on");
        dots[idx].style.setProperty("--p", Math.min(said / scene.steps, 1));
      },
      halo: {
        ctx: setCtx,
        status(t) { haloEl.classList.toggle("st", !!t); if (t) haloStatus.textContent = t; },
        open(b) { haloEl.classList.toggle("open", b); },
        ping() { haloEl.classList.remove("ping"); void haloEl.offsetWidth; haloEl.classList.add("ping"); },
      },
      cursor: {
        async to(el, fx = 0.6, fy = 0.55) {
          live();
          const r = rect(el);
          cursorEl.classList.remove("off");
          cursorEl.style.transform = `translate(${r.x + r.w * fx}px, ${r.y + r.h * fy}px)`;
          await wait(950);
        },
        click() { cursorEl.classList.remove("click"); void cursorEl.offsetWidth; cursorEl.classList.add("click"); },
        hide() { cursorEl.classList.add("off"); },
      },
      async fly(from, to, html) {
        const A = rect(from), B = rect(to);
        flyer.innerHTML = html; flyer.classList.remove("drag"); flyer.hidden = false;
        Object.assign(flyer.style, { left: `${A.x}px`, top: `${A.y}px`, width: `${Math.min(A.w, 240)}px` });
        const an = flyer.animate(
          [{ transform: "translate(0,0) scale(1)", opacity: 1 }, { transform: `translate(${B.x - A.x + 12}px,${B.y - A.y}px) scale(.82)`, opacity: 0 }],
          { duration: reduced ? 1 : 700, easing: "cubic-bezier(.34,1.36,.64,1)", fill: "forwards" });
        try { await an.finished; } catch { /* cancelled */ }
        flyer.hidden = true;
        live();
      },
      async drag(from, x, y, html) {
        const A = rect(from);
        flyer.innerHTML = html; flyer.hidden = false; flyer.classList.remove("drag");
        Object.assign(flyer.style, { left: `${A.x}px`, top: `${A.y}px`, width: `${Math.min(A.w, 220)}px` });
        void flyer.offsetWidth;
        flyer.classList.add("drag");
        flyer.style.left = `${x - 60}px`; flyer.style.top = `${y - 14}px`;
        cursorEl.style.transform = `translate(${x}px, ${y}px)`;
        await wait(1000);
        flyer.hidden = true; flyer.classList.remove("drag");
      },
      async type(el, text, ms = 50) { for (const ch of text) { el.textContent += ch; await wait(ms); } },
    };
    return api;
  }

  function meta(i) {
    const s = SCENES[i];
    $("g-num").textContent = `${i + 1} / ${SCENES.length}`;
    $("g-title").textContent = s.title;
    $("g-desc").textContent = s.desc;
    $("g-now").textContent = "";
    dots.forEach((d, j) => { j === i ? d.setAttribute("aria-current", "true") : d.removeAttribute("aria-current"); d.style.setProperty("--p", 0); });
  }

  async function play(i) {
    const my = ++token;
    idx = (i + SCENES.length) % SCENES.length;
    const scene = SCENES[idx];
    meta(idx);
    // reset the shared pieces, then build the scene
    flyer.getAnimations().forEach((an) => an.cancel()); flyer.hidden = true; cursorEl.classList.add("off");
    cursorEl.style.transition = "none";
    cursorEl.style.transform = `translate(${logicalW() - 90}px, ${logicalH() - 70}px)`;
    void cursorEl.offsetWidth; cursorEl.style.transition = "";
    haloEl.classList.remove("open", "st");
    const api = makeApi(my, scene);
    setCtx(scene.id === "halo" ? "home" : "dev");
    $("scap").classList.remove("on");
    host.innerHTML = scene.html;
    setTimeout(() => host.firstElementChild?.classList.add("in"), 30);
    try {
      await scene.run(api);
      if (my !== token) return;
      dots[idx].style.setProperty("--p", 1);
      if (reduced) return;
      await api.wait(900);
      play(idx + 1);
    } catch (e) {
      if (e !== CANCEL) console.error(e);
    }
  }

  // controls
  const step = (d) => play(idx + d);
  $("g-prev").addEventListener("click", () => step(-1));
  $("g-next").addEventListener("click", () => step(1));
  toggle.addEventListener("click", () => {
    manualPause = !manualPause;
    ctl.toggleAttribute("data-paused", manualPause);
    toggle.setAttribute("aria-label", manualPause ? "Play animation" : "Pause animation");
  });
  $("gal").addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") { step(1); e.preventDefault(); }
    if (e.key === "ArrowLeft") { step(-1); e.preventDefault(); }
  });
  // swipe on the stage
  let x0 = null;
  box.addEventListener("pointerdown", (e) => { x0 = e.clientX; });
  box.addEventListener("pointerup", (e) => { if (x0 != null && Math.abs(e.clientX - x0) > 50) step(e.clientX < x0 ? 1 : -1); x0 = null; });
  box.addEventListener("pointercancel", () => { x0 = null; });
  if (reduced) ctl.querySelector("#g-toggle").hidden = true;
  meta(0);
  ready.then(() => play(0));
}
