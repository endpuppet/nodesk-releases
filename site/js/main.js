import { config } from "../config.js?v=a2c304d5";
import { initThemes } from "./themes.js?v=a2c304d5";
import { initMenu } from "./menu.js?v=a2c304d5";
import { initMat } from "./mat.js?v=a2c304d5";
import { initGallery } from "./gallery.js?v=a2c304d5";
import { playIntro } from "./intro.js?v=a2c304d5";
import { initAnatomy } from "./anatomy.js?v=a2c304d5";
import { initTry } from "./calm.js?v=a2c304d5";
import { initRoadmap } from "./roadmap.js?v=a2c304d5";
import { initDownload } from "./download.js?v=a2c304d5";
import { initLatest } from "./latest.js?v=a2c304d5";
import { initSpy } from "./spy.js?v=a2c304d5";
import { initLocale } from "./locale.js?v=a2c304d5";

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
