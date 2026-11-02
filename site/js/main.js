import { config } from "../config.js?v=33db93e3";
import { initThemes } from "./themes.js?v=33db93e3";
import { initMenu } from "./menu.js?v=33db93e3";
import { initMat } from "./mat.js?v=33db93e3";
import { initGallery } from "./gallery.js?v=33db93e3";
import { playIntro } from "./intro.js?v=33db93e3";
import { initAnatomy } from "./anatomy.js?v=33db93e3";
import { initTry } from "./calm.js?v=33db93e3";
import { initRoadmap } from "./roadmap.js?v=33db93e3";
import { initDownload } from "./download.js?v=33db93e3";
import { initLatest } from "./latest.js?v=33db93e3";
import { initSpy } from "./spy.js?v=33db93e3";

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
