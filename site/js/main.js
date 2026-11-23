import { config } from "../config.js?v=6581d225";
import { initThemes } from "./themes.js?v=6581d225";
import { initMenu } from "./menu.js?v=6581d225";
import { initMat } from "./mat.js?v=6581d225";
import { initGallery } from "./gallery.js?v=6581d225";
import { playIntro } from "./intro.js?v=6581d225";
import { initAnatomy } from "./anatomy.js?v=6581d225";
import { initTry } from "./calm.js?v=6581d225";
import { initRoadmap } from "./roadmap.js?v=6581d225";
import { initDownload } from "./download.js?v=6581d225";
import { initLatest } from "./latest.js?v=6581d225";
import { initSpy } from "./spy.js?v=6581d225";
import { initLocale } from "./locale.js?v=6581d225";

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
