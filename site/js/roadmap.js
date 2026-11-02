// Roadmap: renders ONLY from data/roadmap.json (schema 1). If the fetch or the shape check fails, the
// same data inlined in index.html (#roadmap-fallback) is used. All text goes in through textContent.
const STATUS = { done: "Done", in_progress: "In progress", planned: "Planned", exploring: "Exploring" };
const ORDER = ["done", "in_progress", "planned", "exploring"];

const el = (tag, props = {}, ...kids) => {
  const n = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === "class") n.className = v;
    else if (k === "text") n.textContent = v;
    else if (v === true) n.setAttribute(k, "");
    else if (v !== false && v != null) n.setAttribute(k, v);
  }
  n.append(...kids.filter(Boolean));
  return n;
};
const icon = (id, cls = "i") => {
  const s = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  s.setAttribute("class", cls);
  s.setAttribute("aria-hidden", "true");
  const u = document.createElementNS("http://www.w3.org/2000/svg", "use");
  u.setAttribute("href", `#${id}`);
  s.append(u);
  return s;
};
const chip = (status) => el("span", { class: `chip ${status}`, text: STATUS[status] || status });
const fmtDate = (d) => {
  const t = new Date(`${d}T00:00:00Z`);
  return Number.isNaN(+t) ? d : t.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
};
const valid = (d) => d && d.schema === 1 && Array.isArray(d.versions) && Array.isArray(d.items)
  && d.versions.every((v) => v.version && v.name && STATUS[v.status]) && d.items.every((i) => i.id && i.version && i.title && STATUS[i.status]);

async function load() {
  try {
    const r = await fetch("data/roadmap.json", { cache: "no-cache" });
    if (!r.ok) throw new Error(r.status);
    const d = await r.json();
    if (!valid(d)) throw new Error("bad shape");
    return { data: d, fromFallback: false };
  } catch {
    const d = JSON.parse(document.getElementById("roadmap-fallback").textContent);
    return { data: d, fromFallback: true };
  }
}

export async function initRoadmap(root) {
  const { data, fromFallback } = await load();
  // exploring versions are not milestones on the way to beta: they go last, under their own heading
  const ordered = [...data.versions.filter((v) => v.status !== "exploring"), ...data.versions.filter((v) => v.status === "exploring")];
  const byVersion = new Map(ordered.map((v) => [v.version, { v, items: data.items.filter((i) => i.version === v.version) }]));
  // filter counts: every item, plus a version itself when no item carries its status (so "in progress" is not 0)
  const units = data.versions.flatMap((v) => { const it = byVersion.get(v.version).items; return it.some((i) => i.status === v.status) ? it : [...it, v]; });
  const count = (s) => (s === "all" ? units.length : units.filter((u) => u.status === s).length);
  const curPhaseVersion = data.current?.phase ? data.versions.find((v) => v.phase === data.current.phase) : undefined;

  let filter = "all";
  let query = "";
  const openV = new Set(data.versions.filter((v) => v.status === "in_progress").map((v) => v.version));
  const openI = new Set();

  const hit = (i) => !query || `${i.id} ${i.title} ${i.summary ?? ""}`.toLowerCase().includes(query);
  const matchItems = (g) => g.items.filter((i) => (filter === "all" || i.status === filter) && hit(i));
  const showV = (g) => (query ? matchItems(g).length > 0 : filter === "all" || g.v.status === filter || matchItems(g).length > 0);

  function render() {
    const kids = [];

    kids.push(el("div", { class: "rm-top" },
      (() => {
        const done = data.items.filter((i) => i.status === "done").length, all = data.items.length;
        const bar = el("span", { class: "bar", role: "img", "aria-label": `${done} of ${all} items done` }, el("i"));
        bar.firstChild.style.width = `${Math.round((done / all) * 100)}%`;
        return el("div", { class: "rm-now" }, bar,
          el("span", { text: `${done} of ${all} done` }),
          curPhaseVersion && el("span", { text: `Now building ${curPhaseVersion.version}, ${curPhaseVersion.name}` }));
      })(),
      (() => {
        const bar = el("div", { class: "filters", role: "group", "aria-label": "Filter the roadmap by status" });
        for (const f of ["all", ...ORDER]) {
          const b = el("button", { type: "button", "aria-pressed": String(filter === f) }, f === "all" ? "All" : STATUS[f], el("span", { class: "n", text: String(count(f)) }));
          b.addEventListener("click", () => { filter = f; render(); });
          bar.append(b);
        }
        return bar;
      })()));

    kids.push(el("div", { class: "rm-tools" },
      (() => {
        const inp = el("input", { type: "search", class: "rm-search", placeholder: "Search the roadmap", "aria-label": "Search the roadmap", value: query, autocomplete: "off" });
        inp.value = query;
        inp.addEventListener("input", () => { query = inp.value.trim().toLowerCase(); const pos = inp.selectionStart; if (query) for (const g of byVersion.values()) if (matchItems(g).length) openV.add(g.v.version); render(); const n = root.querySelector(".rm-search"); n?.focus({ preventScroll: true }); n?.setSelectionRange(pos, pos); });
        return inp;
      })(),
      (() => {
        const allOpen = [...byVersion.values()].filter(showV).every((g) => openV.has(g.v.version));
        const b = el("button", { type: "button", class: "rm-expand" }, allOpen ? "Collapse all" : "Expand all");
        b.addEventListener("click", () => { for (const g of byVersion.values()) { if (allOpen) openV.delete(g.v.version); else openV.add(g.v.version); } render(); root.querySelector(".rm-expand")?.focus({ preventScroll: true }); });
        return b;
      })()));

    const track = el("nav", { class: "track", "aria-label": "Versions" });
    for (const g of byVersion.values()) {
      const a = el("a", { class: `node ${g.v.status}${showV(g) ? "" : " dim"}`, href: `#v-${g.v.version}`, "aria-label": `${g.v.version} ${g.v.name}, ${STATUS[g.v.status]}` },
        el("span", { class: "dot", "aria-hidden": "true" }, g.v.status === "done" ? icon("i-check", "i") : g.v.phase ?? ""),
        el("span", { class: "v", text: g.v.version }),
        el("span", { class: "nm", text: g.v.name }));
      a.addEventListener("click", (e) => {
        e.preventDefault();
        openV.add(g.v.version);
        render();
        document.getElementById(`v-${g.v.version}`)?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
      });
      track.append(a);
    }
    kids.push(track);

    const list = el("div", { class: "vlist" });
    let shown = 0;
    let futureShown = false;
    for (const g of byVersion.values()) {
      if (!showV(g)) continue;
      shown++;
      const { v } = g;
      const done = g.items.filter((i) => i.status === "done").length;
      const bits = [v.phase && `Phase ${v.phase}`, g.items.length && `${done} of ${g.items.length} done`, v.date && fmtDate(v.date)].filter(Boolean);
      const open = openV.has(v.version);
      const bodyId = `vb-${v.version}`;
      const head = el("button", { class: "vhead", type: "button", "aria-expanded": String(open), "aria-controls": bodyId },
        el("span", { class: "vv", text: v.version }),
        el("span", { class: "vn" }, v.name, el("small", { text: bits.join(" · ") })),
        chip(v.status),
        icon("i-chev", "i chev"));
      head.addEventListener("click", () => { open ? openV.delete(v.version) : openV.add(v.version); render(); });

      const items = el("div", { class: "items" });
      for (const i of matchItems(g)) {
        const io = openI.has(i.id);
        const did = `id-${i.id}`;
        const row = el("button", { class: "ibtn2", type: "button", "aria-expanded": String(io), "aria-controls": did },
          el("span", { class: "id", text: i.id }), el("span", { class: "tt", text: i.title }), chip(i.status), icon("i-chev", "i chev"));
        row.addEventListener("click", () => { io ? openI.delete(i.id) : openI.add(i.id); render(); });
        const meta = el("div", { class: "meta" }, el("span", { text: `Release ${v.version}` }), i.commit && el("span", { text: `commit ${i.commit}` }), i.date && el("span", { text: fmtDate(i.date) }));
        const det = el("div", { class: `idet${io ? " open" : ""}`, id: did, inert: !io }, el("div", {}, i.summary && el("p", { text: i.summary }), meta));
        items.append(el("div", { class: "item" }, row, det));
      }
      const body = el("div", { class: `vbody${open ? " open" : ""}`, id: bodyId, inert: !open },
        el("div", {}, v.summary && el("p", { class: "vsum", text: v.summary }), items));
      if (v.status === "exploring" && !futureShown) {
        futureShown = true;
        list.append(el("p", { class: "rm-group", text: "Future exploration" }));
      }
      list.append(el("article", { class: `ver${v.status === "in_progress" ? " cur" : ""}`, id: `v-${v.version}` }, el("h3", {}, head), body));
    }
    if (!shown) list.append(el("p", { class: "rm-empty", text: "Nothing in this state right now." }));
    kids.push(list);

    kids.push(el("p", { class: "rm-foot", text: `${fromFallback ? "Showing the copy bundled with this page. " : ""}Updated ${fmtDate(data.generatedAt.slice(0, 10))}. “Done” means built and committed; the alpha is not public yet.` }));

    // keep focus on the control the person just used across the re-render
    const active = document.activeElement?.classList?.contains("rm-search") || document.activeElement?.classList?.contains("rm-expand") ? null : document.activeElement?.getAttribute?.("aria-controls") ?? (document.activeElement?.closest?.(".filters") ? document.activeElement.textContent : null);
    root.replaceChildren(...kids);
    root.style.minHeight = "";
    if (active) {
      const again = root.querySelector(`[aria-controls="${CSS.escape(active)}"]`)
        ?? [...root.querySelectorAll(".filters button")].find((b) => b.textContent.startsWith(active.replace(/\d+$/, "")));
      again?.focus({ preventScroll: true });
    }
  }

  // "open this item": from the Latest cards or a #roadmap/ID link
  const openItem = (id) => {
    const it = data.items.find((i) => i.id === id);
    if (!it) return;
    filter = "all"; query = ""; openV.add(it.version); openI.add(id);
    render();
    const row = document.getElementById(`id-${id}`)?.closest(".item") ?? document.getElementById(`v-${it.version}`);
    row?.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" });
    row?.classList.add("flash");
    setTimeout(() => row?.classList.remove("flash"), 1800);
  };
  window.addEventListener("rm:open", (e) => openItem(e.detail));
  render();
  const m = /^#roadmap\/([A-Za-z0-9._-]+)$/.exec(location.hash);
  if (m) setTimeout(() => openItem(m[1]), 300);
  return data;
}
