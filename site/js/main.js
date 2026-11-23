import { config } from "../config.js?v=afb2563b";
import { initThemes } from "./themes.js?v=afb2563b";
import { initMenu } from "./menu.js?v=afb2563b";
import { initMat } from "./mat.js?v=afb2563b";
import { initGallery } from "./gallery.js?v=afb2563b";
import { playIntro } from "./intro.js?v=afb2563b";
import { initAnatomy } from "./anatomy.js?v=afb2563b";
import { initTry } from "./calm.js?v=afb2563b";
import { initRoadmap } from "./roadmap.js?v=afb2563b";
import { initDownload } from "./download.js?v=afb2563b";
import { initLatest } from "./latest.js?v=afb2563b";
import { initSpy } from "./spy.js?v=afb2563b";
import { initLocale } from "./locale.js?v=afb2563b";

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
