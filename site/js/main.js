import { config } from "../config.js";
import { initTheme } from "./theme.js";
import { initAccent } from "./accent.js";
import { initReveal } from "./reveal.js";
import { initGallery } from "./gallery.js";
import { playIntro } from "./intro.js";
import { initTry } from "./calm.js";
import { initRoadmap } from "./roadmap.js";
import { initDownload } from "./download.js";

window.__nd = 1;
const intro = playIntro();
initTheme();
initAccent();
initReveal();
initGallery(intro.gallery);
initTry();

// The roadmap renders first; the download card reads the build line from the same data.
const data = await initRoadmap(document.getElementById("roadmap-root"));
initDownload(config, data);
