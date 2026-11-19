import { config } from "../config.js?v=aacedf10";
import { initThemes } from "./themes.js?v=aacedf10";
import { initMenu } from "./menu.js?v=aacedf10";
import { initMat } from "./mat.js?v=aacedf10";
import { initGallery } from "./gallery.js?v=aacedf10";
import { playIntro } from "./intro.js?v=aacedf10";
import { initAnatomy } from "./anatomy.js?v=aacedf10";
import { initTry } from "./calm.js?v=aacedf10";
import { initRoadmap } from "./roadmap.js?v=aacedf10";
import { initDownload } from "./download.js?v=aacedf10";
import { initLatest } from "./latest.js?v=aacedf10";
import { initSpy } from "./spy.js?v=aacedf10";
import { initLocale } from "./locale.js?v=aacedf10";

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
