import { config } from "../config.js?v=fe1e3129";
import { initThemes } from "./themes.js?v=fe1e3129";
import { initMenu } from "./menu.js?v=fe1e3129";
import { initMat } from "./mat.js?v=fe1e3129";
import { initGallery } from "./gallery.js?v=fe1e3129";
import { playIntro } from "./intro.js?v=fe1e3129";
import { initAnatomy } from "./anatomy.js?v=fe1e3129";
import { initTry } from "./calm.js?v=fe1e3129";
import { initRoadmap } from "./roadmap.js?v=fe1e3129";
import { initDownload } from "./download.js?v=fe1e3129";
import { initLatest } from "./latest.js?v=fe1e3129";
import { initSpy } from "./spy.js?v=fe1e3129";
import { initLocale } from "./locale.js?v=fe1e3129";

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
