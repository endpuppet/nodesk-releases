// "Try it": a model of preview -> apply -> undo. It touches no files.
export function initTry() {
  const box = document.getElementById("try");
  if (!box) return;
  const rows = [...box.querySelectorAll(".to")];
  rows.forEach((el) => { el.dataset.from = el.textContent; });
  const chip = document.getElementById("try-chip");
  const journal = document.getElementById("try-journal");
  const [bPreview, bApply, bUndo] = ["try-preview", "try-apply", "try-undo"].map((id) => document.getElementById(id));

  const stamp = () => new Date().toTimeString().slice(0, 8);
  const setRows = (toTarget) => rows.forEach((el) => { el.textContent = toTarget ? el.dataset.to : el.dataset.from; });

  const view = {
    idle: () => { setRows(false); chip.textContent = "Nothing planned"; journal.textContent = "Journal is empty. Press Preview."; bPreview.disabled = false; bApply.disabled = true; bUndo.disabled = true; },
    preview: () => { setRows(true); chip.textContent = "Preview"; journal.innerHTML = "Plan: <i>3 moves</i>. Nothing has changed yet."; bPreview.disabled = true; bApply.disabled = false; bUndo.disabled = true; },
    applied: () => { chip.textContent = "Applied"; journal.innerHTML = `[${stamp()}] moved <i>3 files</i> · undo is ready`; bPreview.disabled = true; bApply.disabled = true; bUndo.disabled = false; },
    undone: () => { setRows(false); chip.textContent = "Undone"; journal.innerHTML = `[${stamp()}] undone · <i>3 files</i> are back where they were`; bPreview.disabled = false; bApply.disabled = true; bUndo.disabled = true; },
  };
  const go = (state) => { box.dataset.state = state; view[state](); };

  bPreview.addEventListener("click", () => go("preview"));
  bApply.addEventListener("click", () => go("applied"));
  bUndo.addEventListener("click", () => go("undone"));
  go("idle");
}
