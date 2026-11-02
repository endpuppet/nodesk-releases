import { config } from "../config.js?v=b10ccfb1";
import { initThemes } from "./themes.js?v=b10ccfb1";
import { initMenu } from "./menu.js?v=b10ccfb1";
import { initMat } from "./mat.js?v=b10ccfb1";
import { initGallery } from "./gallery.js?v=b10ccfb1";
import { playIntro } from "./intro.js?v=b10ccfb1";
import { initAnatomy } from "./anatomy.js?v=b10ccfb1";
import { initTry } from "./calm.js?v=b10ccfb1";
import { initRoadmap } from "./roadmap.js?v=b10ccfb1";
import { initDownload } from "./download.js?v=b10ccfb1";
import { initLatest } from "./latest.js?v=b10ccfb1";
import { initSpy } from "./spy.js?v=b10ccfb1";

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
