import { config } from "../config.js?v=7a547f6b";
import { initThemes } from "./themes.js?v=7a547f6b";
import { initMenu } from "./menu.js?v=7a547f6b";
import { initMat } from "./mat.js?v=7a547f6b";
import { initGallery } from "./gallery.js?v=7a547f6b";
import { playIntro } from "./intro.js?v=7a547f6b";
import { initAnatomy } from "./anatomy.js?v=7a547f6b";
import { initTry } from "./calm.js?v=7a547f6b";
import { initRoadmap } from "./roadmap.js?v=7a547f6b";
import { initDownload } from "./download.js?v=7a547f6b";
import { initLatest } from "./latest.js?v=7a547f6b";
import { initSpy } from "./spy.js?v=7a547f6b";
import { initLocale } from "./locale.js?v=7a547f6b";

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
