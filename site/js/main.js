import { config } from "../config.js?v=1425764a";
import { initThemes } from "./themes.js?v=1425764a";
import { initMenu } from "./menu.js?v=1425764a";
import { initMat } from "./mat.js?v=1425764a";
import { initGallery } from "./gallery.js?v=1425764a";
import { playIntro } from "./intro.js?v=1425764a";
import { initAnatomy } from "./anatomy.js?v=1425764a";
import { initTry } from "./calm.js?v=1425764a";
import { initRoadmap } from "./roadmap.js?v=1425764a";
import { initDownload } from "./download.js?v=1425764a";
import { initLatest } from "./latest.js?v=1425764a";
import { initSpy } from "./spy.js?v=1425764a";
import { initLocale } from "./locale.js?v=1425764a";

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
