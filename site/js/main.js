import { config } from "../config.js?v=8342084e";
import { initThemes } from "./themes.js?v=8342084e";
import { initMenu } from "./menu.js?v=8342084e";
import { initMat } from "./mat.js?v=8342084e";
import { initGallery } from "./gallery.js?v=8342084e";
import { playIntro } from "./intro.js?v=8342084e";
import { initAnatomy } from "./anatomy.js?v=8342084e";
import { initTry } from "./calm.js?v=8342084e";
import { initRoadmap } from "./roadmap.js?v=8342084e";
import { initDownload } from "./download.js?v=8342084e";

window.__nd = 1;
initThemes();
const mat = initMat();
const intro = playIntro(mat);
initMenu();
initGallery(intro.gallery);
initAnatomy();
initTry();

// The roadmap renders first; the download card reads the build line from the same data.
const data = await initRoadmap(document.getElementById("roadmap-root"));
initDownload(config, data);
