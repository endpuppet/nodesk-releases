import { config } from "../config.js?v=ec4c72b8";
import { initThemes } from "./themes.js?v=ec4c72b8";
import { initMenu } from "./menu.js?v=ec4c72b8";
import { initMat } from "./mat.js?v=ec4c72b8";
import { initGallery } from "./gallery.js?v=ec4c72b8";
import { playIntro } from "./intro.js?v=ec4c72b8";
import { initAnatomy } from "./anatomy.js?v=ec4c72b8";
import { initTry } from "./calm.js?v=ec4c72b8";
import { initRoadmap } from "./roadmap.js?v=ec4c72b8";
import { initDownload } from "./download.js?v=ec4c72b8";
import { initLatest } from "./latest.js?v=ec4c72b8";
import { initSpy } from "./spy.js?v=ec4c72b8";

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
