import { config } from "../config.js?v=a62c0af7";
import { initThemes } from "./themes.js?v=a62c0af7";
import { initMenu } from "./menu.js?v=a62c0af7";
import { initMat } from "./mat.js?v=a62c0af7";
import { initGallery } from "./gallery.js?v=a62c0af7";
import { playIntro } from "./intro.js?v=a62c0af7";
import { initAnatomy } from "./anatomy.js?v=a62c0af7";
import { initTry } from "./calm.js?v=a62c0af7";
import { initRoadmap } from "./roadmap.js?v=a62c0af7";
import { initDownload } from "./download.js?v=a62c0af7";
import { initLatest } from "./latest.js?v=a62c0af7";
import { initSpy } from "./spy.js?v=a62c0af7";

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
