import { config } from "../config.js?v=bbbf4a86";
import { initThemes } from "./themes.js?v=bbbf4a86";
import { initMenu } from "./menu.js?v=bbbf4a86";
import { initMat } from "./mat.js?v=bbbf4a86";
import { initGallery } from "./gallery.js?v=bbbf4a86";
import { playIntro } from "./intro.js?v=bbbf4a86";
import { initAnatomy } from "./anatomy.js?v=bbbf4a86";
import { initTry } from "./calm.js?v=bbbf4a86";
import { initRoadmap } from "./roadmap.js?v=bbbf4a86";
import { initDownload } from "./download.js?v=bbbf4a86";
import { initLatest } from "./latest.js?v=bbbf4a86";
import { initSpy } from "./spy.js?v=bbbf4a86";
import { initLocale } from "./locale.js?v=bbbf4a86";

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
