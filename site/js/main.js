import { config } from "../config.js?v=50dd2212";
import { initThemes } from "./themes.js?v=50dd2212";
import { initMenu } from "./menu.js?v=50dd2212";
import { initMat } from "./mat.js?v=50dd2212";
import { initGallery } from "./gallery.js?v=50dd2212";
import { playIntro } from "./intro.js?v=50dd2212";
import { initAnatomy } from "./anatomy.js?v=50dd2212";
import { initTry } from "./calm.js?v=50dd2212";
import { initRoadmap } from "./roadmap.js?v=50dd2212";
import { initDownload } from "./download.js?v=50dd2212";
import { initLatest } from "./latest.js?v=50dd2212";
import { initSpy } from "./spy.js?v=50dd2212";
import { initLocale } from "./locale.js?v=50dd2212";

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
