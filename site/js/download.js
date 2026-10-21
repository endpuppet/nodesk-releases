// The download card. Locked is decided here, from the one flag in config.js, and fails closed:
// anything other than `downloadLocked === false` keeps the card locked, makes no network request and
// never creates a link. index.html contains no download URL.
export async function initDownload(config, roadmap) {
  const card = document.getElementById("dl");
  const ver = document.getElementById("dl-ver");
  const line = roadmap?.current?.version;
  if (line) ver.textContent = `Current build ${line}`;

  if (config.downloadLocked !== false) {
    card.dataset.state = "locked";
    document.getElementById("dl-btn").addEventListener("click", (e) => e.preventDefault());
    return;
  }

  // ── unlocked: find the newest published release and its installer ──
  const acts = document.getElementById("dl-acts");
  const show = (title, text, href, label) => {
    document.getElementById("dl-title").textContent = title;
    document.getElementById("dl-text").textContent = text;
    card.dataset.state = href ? "ready" : "empty";
    document.getElementById("dl-icon").firstElementChild.setAttribute("href", href ? "#i-down" : "#i-lock");
    if (!href) { acts.replaceChildren(); return; }
    const a = document.createElement("a");
    a.className = "btn";
    a.href = href;
    a.rel = "noopener";
    a.textContent = label;
    acts.replaceChildren(a);
  };
  const safe = (u) => { try { const x = new URL(u); return x.protocol === "https:" ? x.href : ""; } catch { return ""; } };

  try {
    const r = await fetch(`https://api.github.com/repos/${config.releasesRepo}/releases?per_page=10`, { headers: { Accept: "application/vnd.github+json" } });
    if (!r.ok) throw new Error(r.status);
    const rel = (await r.json()).find((x) => !x.draft);
    const asset = rel?.assets?.find((a) => /setup.*\.exe$/i.test(a.name)) ?? rel?.assets?.find((a) => /\.(exe|msi)$/i.test(a.name));
    const href = safe(asset?.browser_download_url ?? "") || safe(config.downloadUrl);
    if (!href) throw new Error("no installer");
    ver.textContent = rel ? `${rel.tag_name} · ${asset ? (asset.size / 1048576).toFixed(1) + " MB" : "installer"}` : ver.textContent;
    show("Download the alpha", "Windows 10/11, per-user installer, no admin rights needed. It is an alpha: expect rough edges, and your files are never deleted.", href, `Download ${rel?.tag_name ?? "installer"}`);
  } catch {
    const href = safe(config.downloadUrl);
    if (href) show("Download the alpha", "Windows 10/11, per-user installer, no admin rights needed.", href, "Download installer");
    else show("No public build yet", "The releases repository has no published installer at the moment. Check back soon.", "", "");
  }
}
