// The desk mat: a 24 px dot grid under the hero (the pitch noDesk snaps islands to). It is still until
// something happens: dots near the pointer lift and take the accent, and ripple() sends a ring through
// the grid where something lands. Draws only while there is something to animate.
const PITCH = 24;

export function initMat() {
  const canvas = document.getElementById("mat");
  if (!canvas) return { ripple() {} };
  const ctx = canvas.getContext("2d");
  const host = canvas.parentElement;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let w = 0, h = 0, dpr = 1, dot = "#444", acc = "#fa5", px = -9999, py = -9999, near = 0, raf = 0, visible = true;
  const rings = [];

  const colours = () => { const cs = getComputedStyle(document.documentElement); dot = cs.getPropertyValue("--grid-dot").trim() || dot; acc = cs.getPropertyValue("--accent").trim() || acc; };
  const size = () => {
    const r = host.getBoundingClientRect();
    dpr = Math.min(2, devicePixelRatio || 1); w = r.width; h = r.height;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    draw();
  };

  function draw(now = performance.now()) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const ox = ((w % PITCH) / 2) + PITCH / 2, oy = PITCH / 2;
    for (let i = rings.length - 1; i >= 0; i--) if (now - rings[i].t > 1400) rings.splice(i, 1);
    let busy = rings.length > 0;
    for (let y = oy; y < h; y += PITCH) {
      for (let x = ox; x < w; x += PITCH) {
        let lift = 0;
        if (near) { const d = Math.hypot(x - px, y - py); if (d < 150) lift = (1 - d / 150) ** 2 * near; }
        for (const r of rings) {
          const age = (now - r.t) / 1400, rad = age * 420, d = Math.hypot(x - r.x, y - r.y);
          const band = 1 - Math.min(1, Math.abs(d - rad) / 34);
          if (band > 0) lift = Math.max(lift, band * (1 - age));
        }
        const rr = 1.2 + lift * 2;
        ctx.globalAlpha = 0.7 + lift * 0.3;
        ctx.fillStyle = lift > 0.08 ? acc : dot;
        ctx.beginPath(); ctx.arc(x, y, rr, 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
    return busy;
  }
  function loop(now) {
    raf = 0;
    if (!visible) return;
    const target = px > -999 ? 1 : 0;
    near += (target - near) * 0.18;
    const busy = draw(now);
    if (busy || Math.abs(target - near) > 0.01) raf = requestAnimationFrame(loop);
  }
  const kick = () => { if (!raf && !still) raf = requestAnimationFrame(loop); };

  host.addEventListener("pointermove", (e) => {
    if (e.pointerType === "touch") return;
    const r = host.getBoundingClientRect(); px = e.clientX - r.left; py = e.clientY - r.top;
    host.style.setProperty("--gx", `${(px / r.width) * 100}%`); host.style.setProperty("--gy", `${(py / r.height) * 100}%`);
    kick();
  });
  host.addEventListener("pointerleave", () => { px = py = -9999; kick(); });
  new ResizeObserver(size).observe(host);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) kick(); }).observe(host);
  addEventListener("nd:theme", () => { // follow the theme while its colours morph
    const t0 = performance.now();
    const step = () => { colours(); draw(); if (performance.now() - t0 < 800) requestAnimationFrame(step); };
    step();
  });
  colours(); size();

  return {
    /** A ring through the grid from (x, y) in viewport coordinates. */
    ripple(x, y) {
      if (still) return;
      const r = host.getBoundingClientRect();
      rings.push({ x: x - r.left, y: y - r.top, t: performance.now() });
      kick();
    },
  };
}
