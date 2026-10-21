// The seven feature scenes for the hero gallery. Each has the markup it needs (`html`) and a script
// (`run(a)`) written against the small engine API in gallery.js: wait, say, on/off, cursor, fly, drag,
// type, count, halo. `steps` is the number of say() calls, used for the progress dot.
const ico = (id) => `<svg class="i" viewBox="0 0 24 24"><use href="#${id}"/></svg>`;
const row = (k, ext, name, more = "", cls = "", attrs = "") => `<div class="frow ${cls}" ${attrs}><span class="th ${k}">${ext}</span><span class="nm">${name}</span>${more}</div>`;
const bin = (name, n, k) => `<div class="frow bin" data-k="${k}"><span class="th">${ico("i-folder")}</span><span class="nm">${name}</span><b data-k="${k}n">${n}</b></div>`;
const isl = (icon, title, cnt, body, attrs = "") => `<div class="isl" ${attrs}><div class="ih"><span class="ic">${ico(icon)}</span>${title}<span class="cnt" data-k="cnt">${cnt}</span></div><div class="body">${body}</div></div>`;
const apps = (list) => `<div class="apps">${list.map(([t, a, b]) => `<span class="app" style="--a:${a};--b:${b}">${t}</span>`).join("")}</div>`;
const toast = (txt) => `<div class="toast pop" data-k="toast">${ico("i-check")}<span>${txt}</span><span class="u">Undo</span></div>`;
const key = (...k) => `<div class="keyhint pop" data-k="key">${k.map((x) => `<kbd>${x}</kbd>`).join(" + ")}</div>`;
const PDF = `<span class="th pdf">PDF</span>Invoice_Tax2026.pdf`;

export const SCENES = [
  {
    id: "inbox", short: "Inbox", title: "Inbox: a bin for every new file", steps: 7,
    desc: "New files in Downloads and on the Desktop land in the Inbox. noDesk suggests a bin for each, with the reason and a confidence. One click accepts it, nothing moves until you say so, and Ctrl+Z puts it back.",
    html: `<div class="scene"><div class="cols">
      ${isl("i-inbox", "Inbox", "2 new", row("pdf", "PDF", "Invoice_Tax2026.pdf", `<span class="sg pop" data-k="sg">→ Tax2026 · 94%</span>`, "cl", 'data-k="hot"') + row("png", "PNG", "Screenshot 2026-10-18.png") + row("zip", "ZIP", "holiday-photos.zip") + `<div class="why pop" data-k="why"><b>Why:</b> the name starts with “Invoice”, like your Tax2026 rule.</div>`)}
      ${isl("i-folder", "Bins", "", bin("Tax2026", 12, "tax") + bin("Screenshots", 48, "shots") + bin("Archive", 203, "arch"))}
    </div>
    <div class="dlbar pop" data-k="dl"><span class="dlic" data-k="dlic">${ico("i-down")}</span><div class="dlt"><b>Invoice_Tax2026.pdf</b><span>Downloading from your browser · 84 KB</span><i class="bar"><u></u></i></div><span class="dlok pop" data-k="dlok">Saved to Downloads</span></div>
    ${toast("Moved 1 file to Tax2026")}${key("Ctrl", "Z")}</div>`,
    async run(a) {
      const [hot, sg, why, toastEl, cnt, tax, taxn, keyEl, dl, dlic, dlok] = ["hot", "sg", "why", "toast", "cnt", "tax", "taxn", "key", "dl", "dlic", "dlok"].map((k) => a.q(`[data-k=${k}]`));
      const setCount = (landed) => { cnt.textContent = landed ? "2 new" : "3 new"; taxn.textContent = landed ? 13 : 12; };
      a.say("A download finishes in your browser"); a.on(dl); await a.wait(400); dl.classList.add("run"); await a.wait(1900); a.on(dlok); await a.wait(700);
      a.say("noDesk watches Downloads: the file lands in the Inbox");
      a.on(hot); hot.classList.add("ghost"); cnt.textContent = "3 new"; await a.wait(450);
      await a.fly(dlic, hot, PDF); a.off(dl); hot.classList.remove("ghost"); hot.classList.add("new"); await a.wait(1300);
      a.say("It suggests a bin, with the reason and a confidence"); a.on(sg); a.on(why); await a.wait(2600);
      a.say("One click accepts the suggestion"); await a.cursor.to(sg); a.cursor.click(); await a.wait(350);
      a.say("The file moves into the bin and the bin's count goes up");
      hot.classList.add("ghost"); await a.fly(hot, tax, PDF); a.off(hot, sg, why); hot.classList.remove("ghost", "new");
      setCount(true); a.on(tax, "glow"); a.cursor.hide(); await a.wait(1500);
      a.say("The Halo confirms it, and Ctrl+Z undoes it");
      a.halo.status("Moved 1 file · Ctrl+Z undoes"); a.halo.ping(); a.on(toastEl); await a.wait(2600);
      a.say("Changed your mind? Ctrl+Z puts it right back");
      a.off(toastEl); a.halo.status(null); a.on(keyEl); await a.wait(1000); a.off(keyEl);
      a.on(hot); hot.classList.add("ghost"); await a.wait(450);
      await a.fly(tax, hot, PDF); hot.classList.remove("ghost"); a.off(tax, "glow"); setCount(false); await a.wait(1600);
    },
  },
  {
    id: "cmd", short: "Command bar", title: "Command bar: say what you want", steps: 4,
    desc: "Alt + Space from anywhere. Type a command or search, see exactly what would move and why, then apply. When noDesk is not sure, it says “needs you” instead of guessing.",
    html: `<div class="scene"><div class="cols">
      ${isl("i-inbox", "Downloads", "4 files", row("pdf", "PDF", "Invoice_Tax2026.pdf", "", "cl on", 'data-k="r1"') + row("png", "PNG", "Screenshot 2026-10-18.png", "", "cl on", 'data-k="r2"') + row("exe", "EXE", "setup_v3.2.1.exe", "", "cl on", 'data-k="r3"') + row("zip", "ZIP", "holiday-photos.zip", "", "", 'data-k="r4"') + `<div class="empty pop" data-k="empty">Everything it was sure about has moved.</div>`)}
      ${isl("i-folder", "Bins", "", bin("Tax2026", 12, "tax") + bin("Screenshots", 48, "shots") + bin("Archive", 203, "arch"))}
    </div>
    <div class="cmd pop" data-k="cmd">
      <div class="in">${ico("i-search")}<span class="typed" data-k="typed"></span></div>
      <div class="pv" data-k="pv"><div class="lbl">Preview · nothing has moved yet</div>
        <div class="mv"><span class="nm">Invoice_Tax2026.pdf</span><span class="ar">→</span>Tax2026<i>94%</i></div>
        <div class="mv"><span class="nm">Screenshot 2026-10-18.png</span><span class="ar">→</span>Screenshots<i>99%</i></div>
        <div class="mv"><span class="nm">setup_v3.2.1.exe</span><span class="ar">→</span>Archive<i>88%</i></div>
        <div class="mv"><span class="nm">holiday-photos.zip</span><span class="ar" style="color:var(--text-3)">·</span>stays<i>Needs you</i></div>
        <span class="go" data-k="go">Apply 3 moves</span></div>
    </div>${key("Alt", "Space")}</div>`,
    async run(a) {
      const [cmd, typed, pv, go, keyEl, empty, cnt] = ["cmd", "typed", "pv", "go", "key", "empty", "cnt"].map((k) => a.q(`[data-k=${k}]`));
      a.say("Alt + Space opens the command bar from anywhere"); a.on(keyEl); await a.wait(1100); a.off(keyEl); a.on(cmd); await a.wait(500);
      a.say("Type what you want"); await a.type(typed, "tidy downloads", 55); await a.wait(400);
      a.say("It shows exactly what will move, and why"); a.on(pv); await a.wait(3000);
      a.say("Apply: done, journaled and undoable"); await a.cursor.to(go); a.cursor.click(); await a.wait(300); a.off(cmd);
      for (const k of ["r1", "r2", "r3"]) { a.off(a.q(`[data-k=${k}]`)); await a.wait(180); }
      cnt.textContent = "1 file"; a.q("[data-k=taxn]").textContent = 13; a.q("[data-k=shotsn]").textContent = 49; a.q("[data-k=archn]").textContent = 204;
      a.on(a.q("[data-k=tax]"), "glow"); a.on(empty); a.halo.status("Moved 3 files · Ctrl+Z undoes"); a.cursor.hide(); await a.wait(2600);
    },
  },
  {
    id: "halo", short: "Halo & contexts", title: "Halo and contexts: one pill, four moods", steps: 5,
    desc: "One small pill shows status and context. Switch between Home, Art, Dev and Focus (or your own), and the layout and accent follow. Each context remembers its own panels.",
    html: `<div class="scene">
      <div class="lay on" data-l="home">${isl("i-inbox", "Inbox", "2 new", row("pdf", "PDF", "Invoice_Tax2026.pdf") + row("png", "PNG", "Screenshot 2026-10-18.png"))}${isl("i-islands", "Launch", "", apps([["Br", "#3b82f6", "#1d4ed8"], ["Ma", "#f59e0b", "#b45309"], ["Ph", "#10b981", "#047857"], ["Mu", "#ec4899", "#9d174d"]]))}</div>
      <div class="lay" data-l="art">${isl("i-islands", "Moodboards", "6", `<div class="mood">${[["#f59e0b", "#e11d48"], ["#06b6d4", "#6366f1"], ["#84cc16", "#16a34a"], ["#f472b6", "#a855f7"], ["#fb923c", "#facc15"], ["#38bdf8", "#818cf8"]].map(([x, y]) => `<i style="--a:${x};--b:${y}"></i>`).join("")}</div>`)}${isl("i-folder", "Screenshots", "", bin("Refs", 31, "x1") + bin("Exports", 12, "x2"))}</div>
      <div class="lay" data-l="dev">${isl("i-folder", "Projects", "3", bin("nodesk-app", 214, "p1") + bin("site", 17, "p2") + bin("notes", 9, "p3"))}${isl("i-islands", "Launch", "", apps([["Co", "#3b82f6", "#1d4ed8"], ["Te", "#64748b", "#334155"], ["Gi", "#f97316", "#c2410c"], ["Do", "#14b8a6", "#0f766e"]]))}</div>
      <div class="lay" data-l="focus">${isl("i-eye", "Scratch", "", `<div class="note"><i style="width:80%"></i><i style="width:92%"></i><i style="width:56%"></i><i style="width:70%"></i></div>`)}${isl("i-pulse", "Focus", "", `<div class="timer"><small>Focus</small>25:00</div>`)}</div>
    </div>`,
    async run(a) {
      const show = (c) => { a.qa(".lay").forEach((l) => l.classList.toggle("on", l.dataset.l === c)); a.halo.ctx(c); };
      show("home"); a.say("Home: your everyday desk"); await a.wait(1500);
      a.halo.open(true); a.say("Point at the Halo to switch context"); await a.wait(1000);
      const go = async (c, text) => { await a.cursor.to(a.sq(`.ctx[data-ctx=${c}]`)); a.cursor.click(); await a.wait(200); show(c); a.say(text); await a.wait(1900); };
      await go("art", "Art: its own layout and accent colour");
      await go("dev", "Dev: projects and tools within reach");
      await go("focus", "Focus: one thing, and a timer");
      a.cursor.hide(); a.halo.open(false); await a.wait(900);
    },
  },
  {
    id: "docks", short: "Docks", title: "Edge rails and docks: panels that wait at the edge", steps: 5,
    desc: "Stack panels as tabs or columns on any screen edge. A thin strip in the stack’s accent colour widens when you point at it, and opens after a short dwell. Labels can stand upright.",
    html: `<div class="scene">
      <div class="win"><div class="tb"><i></i><i></i><i></i></div><div class="code"><i style="width:60%"></i><i style="width:82%"></i><i style="width:44%"></i><i style="width:74%"></i><i style="width:52%"></i><i style="width:68%"></i><i style="width:38%"></i></div></div>
      <div class="rail" data-k="rail">
        <div class="re on">${ico("i-inbox")}<span class="ul">INBOX</span></div>
        <div class="re">${ico("i-folder")}<span class="ul">BINS</span></div>
        <div class="re">${ico("i-islands")}<span class="ul">LAUNCH</span></div>
      </div>
      <div class="dpanel pop" data-k="panel">
        <div class="tabs"><span class="on" data-k="t1">Inbox</span><span data-k="t2">Bins</span><span>Launch</span></div>
        <div class="pane on" data-k="p1">${row("pdf", "PDF", "Invoice_Tax2026.pdf")}${row("png", "PNG", "Screenshot 2026-10-18.png")}${row("zip", "ZIP", "holiday-photos.zip")}</div>
        <div class="pane" data-k="p2">${bin("Tax2026", 12, "q1")}${bin("Screenshots", 48, "q2")}${bin("Archive", 203, "q3")}</div>
      </div>
    </div>`,
    async run(a) {
      const [rail, panel, t1, t2, p1, p2] = ["rail", "panel", "t1", "t2", "p1", "p2"].map((k) => a.q(`[data-k=${k}]`));
      a.say("A thin strip in the stack’s accent colour waits on the edge"); await a.wait(1700);
      a.say("Point at it and it widens"); await a.cursor.to(rail, 0.5, 0.45); rail.classList.add("rl"); await a.wait(1300);
      a.say("Rest a moment and the panel opens over your apps"); a.on(panel); await a.wait(2000);
      a.say("Panels stack as tabs; dock them to any edge"); await a.cursor.to(t2); a.cursor.click(); await a.wait(200);
      t1.classList.remove("on"); t2.classList.add("on"); p1.classList.remove("on"); p2.classList.add("on"); await a.wait(1800);
      a.say("Move away and it tucks back to a strip"); await a.cursor.to(a.q(".win"), 0.6, 0.6); a.off(panel); rail.classList.remove("rl"); await a.wait(1600);
    },
  },
  {
    id: "shelf", short: "Shelf & Peek", title: "Shelf and Peek: look first, hold for later", steps: 4,
    desc: "Press Space on any file for a quick look. Drop files on the Shelf at the right edge to hold them for later. The Shelf only keeps a reference; the file stays where it is.",
    html: `<div class="scene"><div class="cols" style="max-width:64%">
      ${isl("i-inbox", "Downloads", "3 files", row("pdf", "PDF", "Invoice_Tax2026.pdf", `<span class="sg pop" data-k="onshelf">on Shelf</span>`, "", 'data-k="f1"') + row("png", "PNG", "Screenshot 2026-10-18.png") + row("doc", "DOC", "notes.docx"))}
    </div>
    <div class="peek pop" data-k="peek"><div class="ph"><span class="th pdf" style="margin:0">PDF</span>Invoice_Tax2026.pdf<span class="mt">1 page · 84 KB</span></div><div class="pg"><i class="h"></i><i></i><i class="s"></i><i></i><i class="s"></i></div><div class="pf">Space or Esc to close</div></div>
    <div class="shelfbar" data-k="shelf"><div class="held"><b>1 held</b><span>references only</span><span class="go ghost" data-k="ret">Return</span></div></div>
    ${key("Space")}</div>`,
    async run(a) {
      const [f1, peek, shelf, keyEl, onshelf, ret] = ["f1", "peek", "shelf", "key", "onshelf", "ret"].map((k) => a.q(`[data-k=${k}]`));
      a.say("Select a file and press Space for a quick look"); await a.cursor.to(f1); a.cursor.click(); f1.classList.add("sel"); a.on(keyEl); await a.wait(900); a.off(keyEl); a.on(peek); await a.wait(2400);
      a.say("Close it, then drag a file to the Shelf on the right edge"); a.off(peek); await a.wait(600);
      shelf.classList.add("on"); await a.drag(f1, a.W - 70, 120, PDF); await a.wait(300);
      a.say("The Shelf holds a reference. The file stays where it is"); a.on(onshelf); await a.wait(2400);
      a.say("Return it, or forget it, whenever you like"); await a.cursor.to(ret); a.cursor.click(); await a.wait(300);
      shelf.classList.remove("on"); a.off(onshelf); f1.classList.remove("sel"); a.cursor.hide(); await a.wait(1500);
    },
  },
  {
    id: "rename", short: "Rename & rules", title: "Smart rename and rules: it learns your habits", steps: 4,
    desc: "New names come from the file itself: a photo’s date, a PDF’s title, where a download came from. And rules are suggested from your own moves, so noDesk learns your habits, not someone else’s.",
    html: `<div class="scene">
      ${isl("i-tag", "Smart rename", "3 suggestions", `
        <div class="rr" data-k="r1"><span class="th jpg">JPG</span><span class="old">IMG_4412.jpg</span><div class="newn cl" data-k="n1">2026-10-18 IMG_4412.jpg <small>photo date</small></div></div>
        <div class="rr" data-k="r2"><span class="th pdf">PDF</span><span class="old">scan0013.pdf</span><div class="newn cl" data-k="n2">Rental agreement.pdf <small>PDF title</small></div></div>
        <div class="rr" data-k="r3"><span class="th pdf">PDF</span><span class="old">download (3).pdf</span><div class="newn cl" data-k="n3">bank.example 2026-10-18.pdf <small>download origin</small></div></div>
        <div style="padding:4px 6px 8px"><span class="go pop" data-k="apply">Apply 3 renames</span></div>`)}
      <div class="rule pop" data-k="rule"><div class="rt" data-k="rt"><b>Make it a rule?</b> You moved 4 files named Tax2026_… to Tax2026.</div><span class="go" data-k="save">Save rule</span></div>
    </div>`,
    async run(a) {
      const [apply, rule, rt, save] = ["apply", "rule", "rt", "save"].map((k) => a.q(`[data-k=${k}]`));
      a.say("Messy names pile up"); await a.wait(1300);
      a.say("noDesk reads the photo date, the PDF title and the download origin");
      for (const k of ["n1", "n2", "n3"]) { a.on(a.q(`[data-k=${k}]`)); await a.wait(800); }
      await a.wait(600);
      a.say("Preview, then apply"); a.on(apply); await a.wait(500); await a.cursor.to(apply); a.cursor.click(); await a.wait(300);
      a.qa(".rr").forEach((r) => r.classList.add("done")); a.off(apply); a.halo.status("Renamed 3 files · Ctrl+Z undoes"); await a.wait(1700);
      a.say("It also notices your habits and offers a rule"); a.on(rule); await a.wait(1800); await a.cursor.to(save); a.cursor.click(); await a.wait(250);
      rt.innerHTML = "<b>Rule saved.</b> Tax2026_* now goes to Tax2026."; save.textContent = "Saved"; a.cursor.hide(); await a.wait(2200);
    },
  },
  {
    id: "health", short: "Desk health", title: "Desk health: find the clutter, delete nothing", steps: 3,
    desc: "A scan finds stale, duplicate, oversized and near-duplicate files, then offers an archive plan. Everything moves to an archive you can browse and restore from. Nothing is ever deleted.",
    html: `<div class="scene">
      <div class="stats"><div class="stat"><b data-k="s1">0</b><span>stale files</span></div><div class="stat"><b data-k="s2">0</b><span>duplicates</span></div><div class="stat"><b data-k="s3">0</b><span>huge files</span></div></div>
      <div class="scan" data-k="scan"><i></i></div>
      <div class="pair pop" data-k="pair"><span class="t k"></span><span class="t b"></span><div class="pt"><b>Near-duplicate images</b><br>IMG_4401.jpg and IMG_4402.jpg · 98% alike</div></div>
      <div class="plan pop" data-k="plan"><div class="pt" data-k="pt"><b>Archive plan: 41 files · 2.3 GB</b><br>Moved to an archive, not deleted.</div><span class="go" data-k="go">Archive</span></div>
    </div>`,
    async run(a) {
      const [scan, pair, plan, pt, go] = ["scan", "pair", "plan", "pt", "go"].map((k) => a.q(`[data-k=${k}]`));
      const s = [1, 2, 3].map((n) => a.q(`[data-k=s${n}]`)), to = [38, 12, 3];
      a.say("A scan finds stale, duplicate and oversized files"); scan.classList.add("run");
      for (let i = 1; i <= 12; i++) { s.forEach((el, j) => { el.textContent = Math.round((to[j] * i) / 12); }); await a.wait(140); }
      await a.wait(400);
      a.say("Near-duplicate images are grouped, so you keep the best one"); a.on(pair); await a.wait(2600);
      a.say("You get an archive plan. Nothing is deleted"); a.on(plan); await a.wait(1700);
      await a.cursor.to(go); a.cursor.click(); await a.wait(300);
      pt.innerHTML = "<b>Archived 41 files · 2.3 GB</b><br>Restore any of them, any time."; go.textContent = "Done"; go.classList.add("ghost");
      s.forEach((el) => { el.textContent = "0"; }); a.halo.status("Archived 41 files · Ctrl+Z undoes"); a.cursor.hide(); await a.wait(2600);
    },
  },
];
