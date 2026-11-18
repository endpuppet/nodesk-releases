import { config } from "../config.js?v=540d06a4";
import { initThemes } from "./themes.js?v=540d06a4";
import { initMenu } from "./menu.js?v=540d06a4";
import { initMat } from "./mat.js?v=540d06a4";
import { initGallery } from "./gallery.js?v=540d06a4";
import { playIntro } from "./intro.js?v=540d06a4";
import { initAnatomy } from "./anatomy.js?v=540d06a4";
import { initTry } from "./calm.js?v=540d06a4";
import { initRoadmap } from "./roadmap.js?v=540d06a4";
import { initDownload } from "./download.js?v=540d06a4";
import { initLatest } from "./latest.js?v=540d06a4";
import { initSpy } from "./spy.js?v=540d06a4";
import { initLocale } from "./locale.js?v=540d06a4";

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
