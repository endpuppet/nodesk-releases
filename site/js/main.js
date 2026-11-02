import { config } from "../config.js?v=05dfbcaa";
import { initThemes } from "./themes.js?v=05dfbcaa";
import { initMenu } from "./menu.js?v=05dfbcaa";
import { initMat } from "./mat.js?v=05dfbcaa";
import { initGallery } from "./gallery.js?v=05dfbcaa";
import { playIntro } from "./intro.js?v=05dfbcaa";
import { initAnatomy } from "./anatomy.js?v=05dfbcaa";
import { initTry } from "./calm.js?v=05dfbcaa";
import { initRoadmap } from "./roadmap.js?v=05dfbcaa";
import { initDownload } from "./download.js?v=05dfbcaa";
import { initLatest } from "./latest.js?v=05dfbcaa";
import { initSpy } from "./spy.js?v=05dfbcaa";

window.__nd = 1;
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
