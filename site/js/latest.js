// "Fresh from the workbench": the newest finished items, taken from the same roadmap data. A card opens
// that item in the roadmap below. Text only goes in through textContent.
const fmt = (d) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: "UTC" });

export function initLatest(root, data, count = 6) {
  if (!root) return;
  const done = data.items.filter((i) => i.status === "done" && i.date);
  // newest first; items sharing a date keep roadmap order reversed, so the last one built comes first
  const list = done.map((i, n) => ({ i, n })).sort((a, b) => b.i.date.localeCompare(a.i.date) || b.n - a.n).slice(0, count).map((x) => x.i);
  const vname = new Map(data.versions.map((v) => [v.version, v.name]));
  const cards = list.map((i) => {
    const a = document.createElement("a");
    a.className = "lcard";
    a.href = "#roadmap";
    const meta = document.createElement("span"); meta.className = "lmeta"; meta.textContent = `${fmt(i.date)} · ${vname.get(i.version) ?? i.version}`;
    const h = document.createElement("h3"); h.textContent = i.title;
    const p = document.createElement("p"); p.textContent = i.summary ?? "";
    const go = document.createElement("span"); go.className = "lgo"; go.textContent = `${i.id} in the roadmap`;
    a.append(meta, h, p, go);
    a.addEventListener("click", (e) => { e.preventDefault(); window.dispatchEvent(new CustomEvent("rm:open", { detail: i.id })); });
    return a;
  });
  root.replaceChildren(...cards);
  root.closest("section")?.toggleAttribute("hidden", !cards.length);
}
