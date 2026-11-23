import { config } from "../config.js?v=669c9d2c";
import { initThemes } from "./themes.js?v=669c9d2c";
import { initMenu } from "./menu.js?v=669c9d2c";
import { initMat } from "./mat.js?v=669c9d2c";
import { initGallery } from "./gallery.js?v=669c9d2c";
import { playIntro } from "./intro.js?v=669c9d2c";
import { initAnatomy } from "./anatomy.js?v=669c9d2c";
import { initTry } from "./calm.js?v=669c9d2c";
import { initRoadmap } from "./roadmap.js?v=669c9d2c";
import { initDownload } from "./download.js?v=669c9d2c";
import { initLatest } from "./latest.js?v=669c9d2c";
import { initSpy } from "./spy.js?v=669c9d2c";
import { initLocale } from "./locale.js?v=669c9d2c";

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
