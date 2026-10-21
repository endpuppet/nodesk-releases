// "Six parts": pointing at a part name (or tapping it) lights that part of the drawing.
export function initAnatomy() {
  const screen = document.getElementById("screen"), list = document.getElementById("parts-list");
  if (!screen || !list) return;
  const buttons = [...list.querySelectorAll("button[data-part]")];
  let pinned = null;
  const show = (part) => {
    if (part) screen.dataset.on = part; else delete screen.dataset.on;
    screen.querySelectorAll("[data-part]").forEach((n) => n.classList.toggle("on", n.dataset.part === part));
    buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.part === part)));
  };
  for (const b of buttons) {
    b.addEventListener("pointerenter", (e) => { if (e.pointerType !== "touch") show(b.dataset.part); });
    b.addEventListener("focus", () => show(b.dataset.part));
    b.addEventListener("click", () => { pinned = pinned === b.dataset.part ? null : b.dataset.part; show(pinned); });
  }
  list.addEventListener("pointerleave", () => show(pinned));
  list.addEventListener("focusout", (e) => { if (!list.contains(e.relatedTarget)) show(pinned); });
}
