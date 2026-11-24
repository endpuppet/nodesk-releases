import { config } from "../config.js?v=fa71f4a7";
import { initThemes } from "./themes.js?v=fa71f4a7";
import { initMenu } from "./menu.js?v=fa71f4a7";
import { initMat } from "./mat.js?v=fa71f4a7";
import { initGallery } from "./gallery.js?v=fa71f4a7";
import { playIntro } from "./intro.js?v=fa71f4a7";
import { initAnatomy } from "./anatomy.js?v=fa71f4a7";
import { initTry } from "./calm.js?v=fa71f4a7";
import { initRoadmap } from "./roadmap.js?v=fa71f4a7";
import { initDownload } from "./download.js?v=fa71f4a7";
import { initLatest } from "./latest.js?v=fa71f4a7";
import { initSpy } from "./spy.js?v=fa71f4a7";
import { initLocale } from "./locale.js?v=fa71f4a7";

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
