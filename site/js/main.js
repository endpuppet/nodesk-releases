import { config } from "../config.js?v=f7479ab3";
import { initThemes } from "./themes.js?v=f7479ab3";
import { initMenu } from "./menu.js?v=f7479ab3";
import { initMat } from "./mat.js?v=f7479ab3";
import { initGallery } from "./gallery.js?v=f7479ab3";
import { playIntro } from "./intro.js?v=f7479ab3";
import { initAnatomy } from "./anatomy.js?v=f7479ab3";
import { initTry } from "./calm.js?v=f7479ab3";
import { initRoadmap } from "./roadmap.js?v=f7479ab3";
import { initDownload } from "./download.js?v=f7479ab3";
import { initLatest } from "./latest.js?v=f7479ab3";
import { initSpy } from "./spy.js?v=f7479ab3";
import { initLocale } from "./locale.js?v=f7479ab3";

window.__nd = 1;
initLocale();
initThemes();
const mat = initMat();
const intro = playIntro(mat);
initMenu();
initGallery(intro.gallery);
initAnatomy();
initTry();
initSpy();

// The roadmap renders first; the download card reads the build line from the same data.
const data = await initRoadmap(document.getElementById("roadmap-root"));
initLatest(document.getElementById("latest-root"), data);
initDownload(config, data);
