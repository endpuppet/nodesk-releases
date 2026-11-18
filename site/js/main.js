import { config } from "../config.js?v=794b4d40";
import { initThemes } from "./themes.js?v=794b4d40";
import { initMenu } from "./menu.js?v=794b4d40";
import { initMat } from "./mat.js?v=794b4d40";
import { initGallery } from "./gallery.js?v=794b4d40";
import { playIntro } from "./intro.js?v=794b4d40";
import { initAnatomy } from "./anatomy.js?v=794b4d40";
import { initTry } from "./calm.js?v=794b4d40";
import { initRoadmap } from "./roadmap.js?v=794b4d40";
import { initDownload } from "./download.js?v=794b4d40";
import { initLatest } from "./latest.js?v=794b4d40";
import { initSpy } from "./spy.js?v=794b4d40";

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
