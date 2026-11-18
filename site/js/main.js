import { config } from "../config.js?v=30e9289d";
import { initThemes } from "./themes.js?v=30e9289d";
import { initMenu } from "./menu.js?v=30e9289d";
import { initMat } from "./mat.js?v=30e9289d";
import { initGallery } from "./gallery.js?v=30e9289d";
import { playIntro } from "./intro.js?v=30e9289d";
import { initAnatomy } from "./anatomy.js?v=30e9289d";
import { initTry } from "./calm.js?v=30e9289d";
import { initRoadmap } from "./roadmap.js?v=30e9289d";
import { initDownload } from "./download.js?v=30e9289d";
import { initLatest } from "./latest.js?v=30e9289d";
import { initSpy } from "./spy.js?v=30e9289d";

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
