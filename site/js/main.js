import { config } from "../config.js?v=d3f28a66";
import { initThemes } from "./themes.js?v=d3f28a66";
import { initMenu } from "./menu.js?v=d3f28a66";
import { initMat } from "./mat.js?v=d3f28a66";
import { initGallery } from "./gallery.js?v=d3f28a66";
import { playIntro } from "./intro.js?v=d3f28a66";
import { initAnatomy } from "./anatomy.js?v=d3f28a66";
import { initTry } from "./calm.js?v=d3f28a66";
import { initRoadmap } from "./roadmap.js?v=d3f28a66";
import { initDownload } from "./download.js?v=d3f28a66";
import { initLatest } from "./latest.js?v=d3f28a66";
import { initSpy } from "./spy.js?v=d3f28a66";
import { initLocale } from "./locale.js?v=d3f28a66";

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
