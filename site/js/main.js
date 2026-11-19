import { config } from "../config.js?v=8b8ab64d";
import { initThemes } from "./themes.js?v=8b8ab64d";
import { initMenu } from "./menu.js?v=8b8ab64d";
import { initMat } from "./mat.js?v=8b8ab64d";
import { initGallery } from "./gallery.js?v=8b8ab64d";
import { playIntro } from "./intro.js?v=8b8ab64d";
import { initAnatomy } from "./anatomy.js?v=8b8ab64d";
import { initTry } from "./calm.js?v=8b8ab64d";
import { initRoadmap } from "./roadmap.js?v=8b8ab64d";
import { initDownload } from "./download.js?v=8b8ab64d";
import { initLatest } from "./latest.js?v=8b8ab64d";
import { initSpy } from "./spy.js?v=8b8ab64d";
import { initLocale } from "./locale.js?v=8b8ab64d";

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
