import { config } from "../config.js?v=055d4612";
import { initThemes } from "./themes.js?v=055d4612";
import { initMenu } from "./menu.js?v=055d4612";
import { initMat } from "./mat.js?v=055d4612";
import { initGallery } from "./gallery.js?v=055d4612";
import { playIntro } from "./intro.js?v=055d4612";
import { initAnatomy } from "./anatomy.js?v=055d4612";
import { initTry } from "./calm.js?v=055d4612";
import { initRoadmap } from "./roadmap.js?v=055d4612";
import { initDownload } from "./download.js?v=055d4612";
import { initLatest } from "./latest.js?v=055d4612";
import { initSpy } from "./spy.js?v=055d4612";
import { initLocale } from "./locale.js?v=055d4612";

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
